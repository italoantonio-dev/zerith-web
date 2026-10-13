import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.SITE_INDEXABLE !== "true") return [];
  const base = process.env.BETTER_AUTH_URL?.replace(/\/$/, "") || "https://zerith.tech";
  const { items } = await listPosts({ limit: 1000 });
  const paths = ["/", "/solucoes", "/produtos", "/produtos/fleet", "/sobre", "/contato", "/blog"];
  return [
    ...paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...items.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.publishedAt || undefined, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
