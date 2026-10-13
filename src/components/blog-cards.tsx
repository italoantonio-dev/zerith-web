import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./icons";
import { listPosts } from "@/lib/blog";
type Item = Awaited<ReturnType<typeof listPosts>>["items"][number];
export function BlogCards({ items }: { items: Item[] }) {
  return (
    <div className="blog-grid">
      {items.map((post, i) => (
        <article className="blog-card" key={post.id}>
          <Link
            href={`/blog/${post.slug}`}
            className="blog-card-image"
            tabIndex={-1}
            aria-hidden="true"
          >
            {post.coverAssetId ? (
              <Image src={`/media/${post.coverAssetId}`} alt={post.coverAlt || ""} width={post.coverWidth || 1200} height={post.coverHeight || 750} sizes="(max-width: 850px) 100vw, 33vw" />
            ) : (
              <div className={`blog-art blog-art-${i % 3}`}>
                <span />
                <span />
                <span />
                <b>
                  ZERITH
                  <br />
                  CONHECIMENTO
                </b>
              </div>
            )}
          </Link>
          <div className="blog-card-body">
            <span className="eyebrow">{post.category}</span>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.excerpt}</p>
            <div className="blog-card-foot">
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt ? new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(post.publishedAt) : ""}
              </time>
              <Link
                href={`/blog/${post.slug}`}
                aria-label={`Ler ${post.title}`}
              >
                <Arrow diagonal />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export async function LatestPosts() {
  const { items } = await listPosts({ limit: 3 });
  return (
    <section className="latest-posts container">
      <div className="section-heading">
        <div>
          <div className="section-label">
            <span className="section-index">06 /</span>
            <span>CONHECIMENTO</span>
          </div>
          <h2>
            Ideias também merecem
            <br />
            ser compartilhadas.
          </h2>
        </div>
        <Link href="/blog" className="text-link">
          Todos os artigos <Arrow diagonal />
        </Link>
      </div>
      {items.length ? (
        <BlogCards items={items} />
      ) : (
        <p>
          As primeiras publicações estão em preparação. Em breve, aprendizados
          sobre tecnologia, engenharia e o processo de construir.
        </p>
      )}
    </section>
  );
}
