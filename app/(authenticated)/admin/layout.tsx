import AuthProtection from "@/app/components/AuthProtection";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProtection requiredRole="admin">{children}</AuthProtection>;
}
