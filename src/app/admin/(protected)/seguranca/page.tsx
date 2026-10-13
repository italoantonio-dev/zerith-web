import { and, eq, gt, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { session } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin";
import { Security } from "@/components/admin/security";
export default async function SecurityPage() {
  const active = await requireAdmin();
  const items = await getDb()
    .select({
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      userAgent: session.userAgent,
    })
    .from(session)
    .where(
      and(
        eq(session.userId, active.user.id),
        gt(session.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(session.createdAt));
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">SUA CONTA</span>
          <h1>Segurança em cada acesso.</h1>
          <p>Autenticação em duas etapas ativa e obrigatória.</p>
        </div>
        <span className="post-status status-published">MFA ativo</span>
      </div>
      <Security
        initial={items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          expiresAt: item.expiresAt.toISOString(),
        }))}
        currentId={active.session.id}
      />
    </>
  );
}
