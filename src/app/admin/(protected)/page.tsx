import Link from "next/link";
import { desc, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { posts, assets, audit } from "@/lib/db/schema";
import { Status, actionName } from "@/components/admin/post-status";
export default async function Dashboard() {
  const active = await requireAdmin();
  const [totals, media, latest, events] = await Promise.all([
    getDb()
      .select({ status: posts.status, total: count() })
      .from(posts)
      .groupBy(posts.status),
    getDb().select({ total: count() }).from(assets),
    getDb().select().from(posts).orderBy(desc(posts.updatedAt)).limit(5),
    getDb().select().from(audit).orderBy(desc(audit.createdAt)).limit(4),
  ]);
  const total = (status: string) =>
    totals.find((t) => t.status === status)?.total || 0;
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h1>Vamos construir, {active.user.name.split(" ")[0]}.</h1>
          <p>Seu conteúdo, do primeiro rascunho à publicação.</p>
        </div>
        <Link className="button button-primary" href="/admin/artigos/novo">
          + Novo artigo
        </Link>
      </div>
      <div className="admin-stats">
        {[
          ["Publicados", total("published"), "No blog da Zerith"],
          ["Rascunhos", total("draft"), "Ideias em desenvolvimento"],
          ["Arquivados", total("archived"), "Fora do blog público"],
          ["Imagens", media[0].total, "Na sua biblioteca"],
        ].map(([label, value, note]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Continue de onde parou</h2>
            <Link href="/admin/artigos">Ver todos →</Link>
          </div>
          {latest.length ? (
            latest.map((post) => (
              <Link
                className="admin-recent-post"
                key={post.id}
                href={`/admin/artigos/${post.id}`}
              >
                <span>
                  <strong>{post.title}</strong>
                  <small>
                    {post.category} ·{" "}
                    {post.updatedAt.toLocaleDateString("pt-BR")}
                  </small>
                </span>
                <Status status={post.status} />
              </Link>
            ))
          ) : (
            <div className="admin-empty">
              <span className="admin-empty-icon">✎</span>
              <h3>Sua primeira ideia começa aqui.</h3>
              <p>
                Escreva um rascunho, revise a prévia e publique quando estiver
                pronto.
              </p>
              <Link href="/admin/artigos/novo" className="text-link">
                Criar primeiro artigo →
              </Link>
            </div>
          )}
        </section>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Atividade recente</h2>
            <Link href="/admin/atividade">Ver registro →</Link>
          </div>
          <ul className="admin-events">
            {events.map((event) => (
              <li key={event.id}>
                <span className="event-dot" />
                <div>
                  <strong>{actionName(event.action)}</strong>
                  <p>{event.detail || "Ação registrada com segurança."}</p>
                  <time>{event.createdAt.toLocaleString("pt-BR")}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="admin-info">
        <span>◇</span>
        <div>
          <strong>Você está no controle.</strong>
          <p>
            Rascunhos e prévias são privados. Apenas artigos publicados aparecem
            no site.
          </p>
        </div>
      </div>
    </>
  );
}
