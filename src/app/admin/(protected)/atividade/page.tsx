import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { audit, user } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin";
import { actionName } from "@/components/admin/post-status";
export default async function Activity() {
  await requireAdmin();
  const events = await getDb()
    .select({
      id: audit.id,
      action: audit.action,
      detail: audit.detail,
      createdAt: audit.createdAt,
      actor: user.name,
    })
    .from(audit)
    .leftJoin(user, eq(audit.actorId, user.id))
    .orderBy(desc(audit.createdAt))
    .limit(100);
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">RASTREABILIDADE</span>
          <h1>O histórico da sua construção.</h1>
          <p>
            Últimas 100 ações registradas. Senhas e códigos de autenticação não
            aparecem neste registro.
          </p>
        </div>
      </div>
      <section className="admin-panel">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ação</th>
                <th>Detalhes</th>
                <th>Responsável</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{actionName(event.action)}</td>
                  <td>{event.detail || "—"}</td>
                  <td>{event.actor || "Sistema"}</td>
                  <td>{event.createdAt.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
