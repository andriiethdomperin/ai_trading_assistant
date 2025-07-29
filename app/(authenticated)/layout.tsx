"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/context/auth-context";
import { Footer } from "@/components/layout/footer";
import AuthProtection from "@/app/components/AuthProtection";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useAuth();

  return (
    <AuthProtection>
      <Header />
      {userInfo?.role === "admin" ? (
        <SidebarProvider>
          <div className="flex flex-col w-full font-inter">
            <div className="block lg:flex">
              <div className="hidden lg:block">
                <DashboardSidebar />
              </div>
              <main className="flex-1 p-10">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <>
          <main className="flex-1 p-10 font-inter">{children}</main>
          <Footer />
        </>
      )}
    </AuthProtection>
  );
}
