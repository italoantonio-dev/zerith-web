import { and, eq, or, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assets, posts } from "@/lib/db/schema";
import { published } from "@/lib/blog";
import { adminSession } from "@/lib/admin";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const visible = await getDb()
    .select({ id: posts.id })
    .from(posts)
    .where(
      and(
        published(),
        or(
          eq(posts.coverAssetId, id),
          sql`position(${`/media/${id}`} in ${posts.content})>0`,
        ),
      ),
    )
    .limit(1);
  if (!visible.length) {
    try {
      await adminSession(request.headers);
    } catch {
      return new Response(null, { status: 404 });
    }
  }
  const [asset] = await getDb().select().from(assets).where(eq(assets.id, id));
  if (!asset) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mime,
      "Content-Length": String(asset.size),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
