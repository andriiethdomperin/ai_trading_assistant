"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

interface AuthProtectionProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export default function AuthProtection({
  children,
  requiredRole,
}: AuthProtectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        // Redirect to login if not authenticated
        router.push(`/login?redirectedFrom=${pathname}`);
        return;
      }

      // If role check is required
      if (requiredRole) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userError || !userData || userData.role !== requiredRole) {
          // Redirect to home if role doesn't match
          router.push("/");
          return;
        }
      }
    };

    checkAuth();
  }, [router, pathname, requiredRole, supabase]);

  return <>{children}</>;
}
