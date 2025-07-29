import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore;
          return cookie.get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          try {
            const cookie = await cookieStore;
            cookie.set({ name, value, ...options });
          } catch (error) {
            console.error("Error setting cookie:", error);
            throw new Error("Failed to set cookie");
          }
        },
        async remove(name: string, options: any) {
          try {
            const cookie = await cookieStore;
            cookie.delete({ name, ...options });
          } catch (error) {
            console.error("Error removing cookie:", error);
            throw new Error("Failed to set cookie");
          }
        },
      },
    }
  );
};
