import { and, eq, inArray, sql } from "drizzle-orm";
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
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireOrigin(request);
    const active = await adminSession(request.headers);
    const { id } = await params;
    const parsed = postSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new HttpError(400, parsed.error.issues[0].message);
    const { version, ...data } = parsed.data;
    if (!version) throw new HttpError(400, "Versão do artigo ausente.");
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
    const result = await getDb().transaction(async (tx) => {
      const [previous] = await tx
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .for("update");
      if (!previous) throw new HttpError(404, "Artigo não encontrado.");
      if (previous.version !== version)
        throw new HttpError(
          409,
          "Este artigo foi alterado em outra aba. Copie suas alterações e recarregue a página antes de salvar.",
        );
      const [saved] = await tx
        .update(posts)
        .set({
          ...data,
          updatedAt: new Date(),
          version: sql`${posts.version}+1`,
          publishedAt:
            data.status === "published"
              ? previous.publishedAt || new Date()
              : previous.publishedAt,
        })
        .where(and(eq(posts.id, id), eq(posts.version, version)))
        .returning({ version: posts.version });
      await tx
        .insert(audit)
        .values({
          id: crypto.randomUUID(),
          actorId: active.user.id,
          action:
            previous.status !== data.status
              ? `post.${data.status}`
              : "post.updated",
          entityId: id,
          detail: data.title,
        });
      return saved;
    });
    return Response.json({ id, version: result.version });
  } catch (error) {
    if ((error as { cause?: { code?: string } })?.cause?.code === "23505")
      return Response.json(
        { error: "Este endereço já está em uso por outro artigo." },
        { status: 409 },
      );
    return apiError(error);
  }
}
