import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { TwoFactorForm } from "@/components/admin/auth-forms";
export default async function VerifyPage() {
  const active = await getAuth().api.getSession({ headers: await headers() });
  if (active && !active.user.isAdmin) redirect("/admin/entrar");
  return (
    <TwoFactorForm enroll={Boolean(active && !active.user.twoFactorEnabled)} />
  );
}
