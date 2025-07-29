import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="TradeSmart Logo" width={32} height={32} />
          <span className="text-2xl font-bold text-white">TradeSmart</span>
        </Link>
      </div>
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="relative w-full max-w-md px-4">{children}</div>
      </div>
    </div>
  );
}
