import { and, desc, eq, ilike, lte, or, sql, count } from "drizzle-orm";
import { getDb } from "./db";
import { assets, posts, user } from "./db/schema";
export const published = () =>
  and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()));
export async function listPosts({
  query = "",
  category = "",
  tag = "",
  page = 1,
  limit = 9,
} = {}) {
  const search = query
    .trim()
    .slice(0, 100)
    .replace(/[\\%_]/g, "\\$&");
  const conditions = and(
    published(),
    search
      ? or(
          ilike(posts.title, `%${search}%`),
          ilike(posts.excerpt, `%${search}%`),
        )
      : undefined,
    category ? eq(posts.category, category.slice(0, 50)) : undefined,
    tag
      ? sql`${posts.tags} @> ${JSON.stringify([tag.slice(0, 30)])}::jsonb`
      : undefined,
  );
  const [items, [total]] = await Promise.all([
    getDb()
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        category: posts.category,
        tags: posts.tags,
        coverAssetId: posts.coverAssetId,
        coverAlt: assets.alt,
        coverWidth: assets.width,
        coverHeight: assets.height,
        publishedAt: posts.publishedAt,
        author: user.name,
      })
      .from(posts)
      .innerJoin(user, eq(posts.authorId, user.id))
      .leftJoin(assets, eq(posts.coverAssetId, assets.id))
      .where(conditions)
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset((page - 1) * limit),
    getDb().select({ value: count() }).from(posts).where(conditions),
  ]);
  return { items, total: total.value, pages: Math.ceil(total.value / limit) };
}
export async function getPublishedPost(slug: string) {
  const [item] = await getDb()
    .select({ post: posts, author: user.name, cover: assets })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(assets, eq(posts.coverAssetId, assets.id))
    .where(and(published(), eq(posts.slug, slug)))
    .limit(1);
  return item;
}
export async function getCategories() {
  return getDb()
    .selectDistinct({ name: posts.category })
    .from(posts)
    .where(published())
    .orderBy(posts.category);
}
