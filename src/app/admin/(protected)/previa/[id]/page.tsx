import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin";
import { Markdown } from "@/components/markdown";
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [post] = await getDb().select().from(posts).where(eq(posts.id, id));
  if (!post) notFound();
  return (
    <>
      <div className="admin-info">
        <span>◇</span>
        <div>
          <strong>Prévia privada da versão salva</strong>
          <p>Esta página exige autenticação e não aparece nos buscadores.</p>
        </div>
        <Link className="text-link" href={`/admin/artigos/${post.id}`}>
          Voltar ao editor →
        </Link>
      </div>
      <article className="admin-article-preview">
        <span className="eyebrow">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="preview-excerpt">{post.excerpt}</p>
        {post.coverAssetId && (
          <img
            className="article-cover"
            src={`/media/${post.coverAssetId}`}
            alt={post.title}
          />
        )}
        <Markdown content={post.content} />
      </article>
    </>
  );
}
