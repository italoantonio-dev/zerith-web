import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { BlogCards } from "@/components/blog-cards";
import { getCategories, listPosts } from "@/lib/blog";
export const metadata: Metadata = {
  title: "Conhecimento",
  description:
    "Artigos e aprendizados da Zerith sobre tecnologia, engenharia, automação e desenvolvimento.",
};
export const dynamic = "force-dynamic";
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const query = value("q").slice(0, 100),
    category = value("categoria").slice(0, 50),
    tag = value("tag").slice(0, 30),
    page = Math.min(10000, Math.max(1, Number.parseInt(value("pagina")) || 1));
  const [{ items, total, pages }, categories] = await Promise.all([
    listPosts({ query, category, tag, page }),
    getCategories(),
  ]);
  const pageUrl = (n: number) =>
    `/blog?${new URLSearchParams({ q: query, categoria: category, tag, pagina: String(n) })}`;
  return (
    <>
      <PageIntro
        label="Conhecimento"
        title="Aprender. Construir."
        accent="Compartilhar."
        description="Reflexões sobre tecnologia, engenharia e o caminho entre uma ideia e sua aplicação."
      />
      <section className="container blog-index">
        <form className="blog-filters" action="/blog" method="get">
          <label>
            Buscar artigos
            <input
              name="q"
              type="search"
              defaultValue={query}
              maxLength={100}
              placeholder="Sobre o que você quer aprender?"
            />
          </label>
          <label>
            Categoria
            <select name="categoria" defaultValue={category}>
              <option value="">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="button button-primary">
            Buscar
          </button>
        </form>
        {tag && (
          <p className="filter-note">
            Tag: <strong>{tag}</strong> <Link href="/blog">Limpar filtro</Link>
          </p>
        )}
        {items.length ? (
          <>
            <p className="blog-count">
              {total} {total === 1 ? "artigo publicado" : "artigos publicados"}
            </p>
            <BlogCards items={items} />
          </>
        ) : (
          <div className="blog-empty">
            <span className="eyebrow">CONHECIMENTO EM CONSTRUÇÃO</span>
            <h2>
              {query || category || tag
                ? "Nenhum artigo encontrado."
                : "Este espaço está só começando."}
            </h2>
            <p>
              {query || category || tag
                ? "Tente buscar por outro assunto ou limpe os filtros."
                : "As primeiras publicações estão em preparação. Explore nossas soluções enquanto isso."}
            </p>
            <Link
              className="text-link"
              href={query || category || tag ? "/blog" : "/solucoes"}
            >
              {query || category || tag
                ? "Ver todos os artigos"
                : "Conhecer nossas soluções"}{" "}
              →
            </Link>
          </div>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="Páginas do blog">
            {page > 1 && <Link href={pageUrl(page - 1)}>← Anterior</Link>}
            <span>
              Página {page} de {pages}
            </span>
            {page < pages && <Link href={pageUrl(page + 1)}>Próxima →</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
