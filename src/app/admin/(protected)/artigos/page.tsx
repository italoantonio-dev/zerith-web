import Link from "next/link";
import { desc, eq, and, ilike, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin";
import { Status } from "@/components/admin/post-status";
export default async function PostList({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const status = ["draft", "published", "archived"].includes(
    params.status || "",
  )
    ? (params.status as "draft" | "published" | "archived")
    : undefined;
  const q = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const items = await getDb()
    .select()
    .from(posts)
    .where(
      and(
        status ? eq(posts.status, status) : undefined,
        q
          ? or(
              ilike(posts.title, `%${q.replace(/[\\%_]/g, "\\$&")}%`),
              ilike(posts.slug, `%${q.replace(/[\\%_]/g, "\\$&")}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(posts.updatedAt))
    .limit(100);
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">EDITORIAL</span>
          <h1>Seus artigos.</h1>
          <p>Organize ideias e compartilhe conhecimento.</p>
        </div>
        <Link className="button button-primary" href="/admin/artigos/novo">
          + Novo artigo
        </Link>
      </div>
      <form className="admin-filter" method="get">
        <label className="sr-only" htmlFor="post-query">
          Buscar artigos
        </label>
        <input
          id="post-query"
          name="q"
          placeholder="Buscar por título ou endereço"
          defaultValue={q}
        />
        <label className="sr-only" htmlFor="post-status">
          Status
        </label>
        <select id="post-status" name="status" defaultValue={status || ""}>
          <option value="">Todos os status</option>
          <option value="draft">Rascunhos</option>
          <option value="published">Publicados</option>
          <option value="archived">Arquivados</option>
        </select>
        <button className="button button-outline">Filtrar</button>
      </form>
      <section className="admin-panel">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artigo</th>
                <th>Status</th>
                <th>Categoria</th>
                <th>Atualizado</th>
                <th>
                  <span className="sr-only">Ação</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/artigos/${p.id}`}>
                      <strong>{p.title}</strong>
                      <small>/blog/{p.slug}</small>
                    </Link>
                  </td>
                  <td>
                    <Status status={p.status} />
                  </td>
                  <td>{p.category}</td>
                  <td>{p.updatedAt.toLocaleDateString("pt-BR")}</td>
                  <td>
                    <Link
                      className="admin-edit-link"
                      href={`/admin/artigos/${p.id}`}
                    >
                      Editar →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="admin-empty">
            <h2>Nenhum artigo por aqui.</h2>
            <p>Comece com uma ideia e salve seu primeiro rascunho.</p>
            <Link className="text-link" href="/admin/artigos/novo">
              Criar artigo →
            </Link>
          </div>
        )}
        {items.length === 100 && (
          <p className="admin-note">
            Exibindo os 100 artigos mais recentes. Use os filtros para encontrar
            outros.
          </p>
        )}
      </section>
    </>
  );
}
