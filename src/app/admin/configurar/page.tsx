import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { SetupForm } from "@/components/admin/auth-forms";
export default async function SetupPage() {
  const admins = await getDb()
    .select({ id: user.id })
    .from(user)
    .where(eq(user.isAdmin, true))
    .limit(1);
  if (admins.length) redirect("/admin/entrar");
  return <SetupForm />;
}
