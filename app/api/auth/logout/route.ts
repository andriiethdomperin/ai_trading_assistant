import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return NextResponse.json(
        { success: false, message: "Logout failed" },
        { status: 500 }
      );
    }

    // Clear all auth-related cookies
    const authCookies = [
      "sb-access-token",
      "sb-refresh-token",
      "supabase-auth-token",
    ];

    const cookie = await cookieStore;
    authCookies.forEach((cookieName) => {
      cookie.delete(cookieName);
    });

    return NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected error during logout" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return await signOut();
}
