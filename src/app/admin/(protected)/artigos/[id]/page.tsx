import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin";
import { listMedia } from "@/lib/media";
import { Editor } from "@/components/admin/editor";
export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [post] = await getDb().select().from(posts).where(eq(posts.id, id));
  if (!post) notFound();
  return (
    <Editor
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        status: post.status,
        coverAssetId: post.coverAssetId,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        version: post.version,
      }}
      media={await listMedia()}
    />
  );
}
