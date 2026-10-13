import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { session, audit } from "@/lib/db/schema";
import { adminSession, requireOrigin, HttpError, apiError } from "@/lib/admin";
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireOrigin(request);
    const active = await adminSession(request.headers);
    const { id } = await params;
    await getDb().transaction(async (tx) => {
      const removed = await tx
        .delete(session)
        .where(and(eq(session.id, id), eq(session.userId, active.user.id)))
        .returning({ id: session.id });
      if (!removed.length) throw new HttpError(404, "Sessão não encontrada.");
      await tx
        .insert(audit)
        .values({
          id: crypto.randomUUID(),
          actorId: active.user.id,
          action: "session.revoked",
          entityId: id,
        });
    });
    return Response.json({ ok: true, current: id === active.session.id });
  } catch (error) {
    return apiError(error);
  }
}
