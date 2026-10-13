import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { LoginForm } from "@/components/admin/auth-forms";
export default async function LoginPage() {
  const admins = await getDb()
    .select({ id: user.id })
    .from(user)
    .where(eq(user.isAdmin, true))
    .limit(1);
  return <LoginForm setupAvailable={!admins.length} />;
}
