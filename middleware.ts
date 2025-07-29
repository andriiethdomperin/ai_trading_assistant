import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  addCSRFTokenToResponse,
  validateCSRFTokenFromRequest,
} from "@/lib/utils/csrf";

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.147.35:3000",
  // "https://tutofino.vercel.app", // Add your production domain
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

// Methods that require CSRF protection
const CSRF_PROTECTED_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export async function middleware(request: NextRequest) {
  // CORS headers
  const origin = request.headers.get("origin") || "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Basic response with CORS headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Add CORS headers
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  // CSRF Protection for state-changing methods
  if (CSRF_PROTECTED_METHODS.includes(request.method)) {
    const isValidCSRF = validateCSRFTokenFromRequest(request);
    if (!isValidCSRF) {
      return new NextResponse("Invalid CSRF Token", {
        status: 403,
        headers: response.headers,
      });
    }
  }

  // Add CSRF token to response for subsequent requests
  response = await addCSRFTokenToResponse(response);

  // IP-based rate limiting
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const requestData = ipRequestCounts.get(clientIp);

  if (requestData) {
    // Check if the window has expired
    if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
      ipRequestCounts.set(clientIp, { count: 1, timestamp: now });
    } else if (requestData.count >= MAX_REQUESTS) {
      // Rate limit exceeded
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
          ...response.headers,
        },
      });
    } else {
      // Increment request count
      ipRequestCounts.set(clientIp, {
        count: requestData.count + 1,
        timestamp: requestData.timestamp,
      });
    }
  } else {
    // First request from this IP
    ipRequestCounts.set(clientIp, { count: 1, timestamp: now });
  }

  // Log IP and request details
  const logData = {
    ip: clientIp,
    timestamp: new Date().toISOString(),
    method: request.method,
    user_agent: request.headers.get("user-agent"),
  };

  // Log to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Only log login-related requests
  if (request.nextUrl.pathname === "/login" && request.method === "GET") {
    try {
      await supabase.from("request_logs").insert([logData]);
    } catch (error) {
      console.error("Error logging request:", error);
    }
  }

  // Create Supabase client for auth
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.getUser();

  if (request.nextUrl.pathname === "/login") {
    const code = request.nextUrl.searchParams.get("code");
    if (code) {
      try {
        const { error: exchangeError } =
          await supabaseAuth.auth.exchangeCodeForSession(code);
        if (!exchangeError) {
          // After successful exchange, redirect to login with success parameter
          const redirectUrl = new URL("/login", request.url);
          redirectUrl.searchParams.set("verified", "true");
          return NextResponse.redirect(redirectUrl);
        } else {
          // If there's an error, redirect with error parameter
          const redirectUrl = new URL("/login", request.url);
          redirectUrl.searchParams.set("error", "verification-failed");
          return NextResponse.redirect(redirectUrl);
        }
      } catch (error) {
        console.error("Error exchanging code for session:", error);
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("error", "verification-failed");
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Protected routes
  const protectedRoutes = ["/admin", "/profile", "/chat"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Auth routes (login, register, etc.)
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Handle auth routes and redirects first
  if (isAuthRoute && user) {
    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // Only redirect if user is on an auth route (login, register, etc.)
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/forgot-password")
    ) {
      if (userData?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/user", request.url));
      } else {
        return NextResponse.redirect(new URL("/chat", request.url));
      }
    }
  }

  // Then handle protected routes
  // if (isProtectedRoute && (!user || error)) {
  //   console.log("error", error);
  //   console.log("user", user);

  //   // Add a small delay to allow session establishment
  //   await new Promise((resolve) => setTimeout(resolve, 500));

  //   // Check authentication again after delay
  //   const {
  //     data: { user: retryUser },
  //     error: retryError,
  //   } = await supabaseAuth.auth.getUser();

  //   console.log("retry user", retryUser);
  //   console.log("retry error", retryError);

  //   // If we still don't have a user or there's an auth error, redirect to login
  //   if (!retryUser || retryError) {
  //     console.log("redirecting to login");
  //     const redirectUrl = new URL("/login", request.url);
  //     redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
  //     return NextResponse.redirect(redirectUrl);
  //   }

  //   // If we have a user after retry, continue with the request
  //   return response;
  // }

  // Check admin access for admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If we have a user and it's a protected route, allow access
  if (isProtectedRoute && user) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
