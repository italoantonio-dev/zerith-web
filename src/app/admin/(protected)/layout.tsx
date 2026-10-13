import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/shell";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const active = await requireAdmin();
  return <AdminShell name={active.user.name}>{children}</AdminShell>;
}
