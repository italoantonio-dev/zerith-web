import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getPublishedPost } from "@/lib/blog";
import { Markdown } from "@/components/markdown";
const find = cache(getPublishedPost);
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await find(slug);
  if (!found) return { title: "Artigo não encontrado" };
  const p = found.post;
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      type: "article",
      title: p.seoTitle || p.title,
      description: p.seoDescription || p.excerpt,
      publishedTime: p.publishedAt?.toISOString(),
      modifiedTime: p.updatedAt.toISOString(),
      authors: [found.author],
      images: p.coverAssetId ? [`/media/${p.coverAssetId}`] : ["/og.png"],
    },
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await find(slug);
  if (!found) notFound();
  const { post, author, cover } = found;
  return (
    <article className="public-article container">
      <div className="breadcrumbs">
        <Link href="/blog">Conhecimento</Link>
        <span>/</span>
        <Link href={`/blog?categoria=${encodeURIComponent(post.category)}`}>
          {post.category}
        </Link>
      </div>
      <header className="article-heading">
        <span className="eyebrow">{post.category}</span>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="article-byline">
          <span>Por {author}</span>
          <span>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt?.toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "America/Sao_Paulo",
            })}
          </time>
          <span>·</span>
          <span>
            {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min
            de leitura
          </span>
        </div>
      </header>
      {post.coverAssetId && (
        <Image
          className="article-cover"
          src={`/media/${post.coverAssetId}`}
          alt={cover?.alt || post.title}
          width={cover?.width || 1200}
          height={cover?.height || 750}
          sizes="(max-width: 1000px) 100vw, 1000px"
        />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article", headline: post.title,
        description: post.excerpt, datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(), author: { "@type": "Person", name: author },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://zerith.tech/blog/${post.slug}` },
        image: post.coverAssetId ? `https://zerith.tech/media/${post.coverAssetId}` : undefined,
      }) }} />
      <Markdown content={post.content} />
      {post.tags.length > 0 && (
        <nav className="tags" aria-label="Tags do artigo">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              {tag}
            </Link>
          ))}
        </nav>
      )}
      <div className="article-return">
        <Link className="text-link" href="/blog">
          ← Voltar para todos os artigos
        </Link>
        <Link className="text-link" href="/contato">
          Conversar sobre uma ideia →
        </Link>
      </div>
    </article>
  );
}
