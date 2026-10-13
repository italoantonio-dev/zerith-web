import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { posts, assets, audit } from "@/lib/db/schema";
import {
  adminSession,
  requireOrigin,
  readJson,
  HttpError,
  apiError,
} from "@/lib/admin";
import { postSchema, mediaIds } from "@/lib/post-validation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const active = await adminSession(request.headers);
    const parsed = postSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new HttpError(400, parsed.error.issues[0].message);
    const { version: _version, ...data } = parsed.data;
    const ids = [
      ...new Set([
        ...mediaIds(data.content),
        ...(data.coverAssetId ? [data.coverAssetId] : []),
      ]),
    ];
    if (ids.length) {
      const found = await getDb()
        .select({ id: assets.id })
        .from(assets)
        .where(inArray(assets.id, ids));
      if (found.length !== ids.length)
        throw new HttpError(
          400,
          "Há uma imagem que não está disponível na biblioteca.",
        );
    }
    const id = crypto.randomUUID();
    await getDb().transaction(async (tx) => {
      await tx
        .insert(posts)
        .values({
          ...data,
          id,
          authorId: active.user.id,
          publishedAt: data.status === "published" ? new Date() : null,
        });
      await tx
        .insert(audit)
        .values({
          id: crypto.randomUUID(),
          actorId: active.user.id,
          action:
            data.status === "published" ? "post.published" : "post.created",
          entityId: id,
          detail: data.title,
        });
    });
    return Response.json({ id, version: 1 }, { status: 201 });
  } catch (error) {
    if ((error as { cause?: { code?: string } })?.cause?.code === "23505")
      return Response.json(
        { error: "Este endereço já está em uso por outro artigo." },
        { status: 409 },
      );
    return apiError(error);
  }
}
