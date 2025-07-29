import type React from "react";
import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/comic-neue/400.css";
import "@fontsource/comic-neue/700.css";
import "../styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TradeSmart",
  description:
    "A comprehensive AI-driven educational platform with interactive features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-comic-neue">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
