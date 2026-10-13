import { createHash, timingSafeEqual } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { and, eq, isNull, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { user, account, setupToken, audit } from "@/lib/db/schema";
import { apiError, HttpError, readJson, requireOrigin } from "@/lib/admin";
export const runtime = "nodejs";
export async function GET() {
  try {
    const found = await getDb()
      .select({ id: user.id })
      .from(user)
      .where(eq(user.isAdmin, true))
      .limit(1);
    return Response.json(
      { available: found.length === 0 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const input = z
      .object({
        token: z.string().regex(/^[a-f0-9]{64}$/),
        name: z.string().trim().min(2).max(80),
        password: z.string().min(12).max(128),
      })
      .safeParse(await readJson(request));
    if (!input.success)
      throw new HttpError(
        400,
        "Informe seu nome, o código de configuração e uma senha com pelo menos 12 caracteres.",
      );
    const hashed = createHash("sha256").update(input.data.token).digest();
    await getDb().transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(7439281)`);
      const existing = await tx
        .select({ id: user.id })
        .from(user)
        .where(eq(user.isAdmin, true))
        .limit(1);
      if (existing.length)
        throw new HttpError(409, "A conta administrativa já foi configurada.");
      const [token] = await tx
        .select()
        .from(setupToken)
        .where(
          and(
            eq(setupToken.id, "owner"),
            isNull(setupToken.consumedAt),
            gt(setupToken.expiresAt, new Date()),
          ),
        )
        .for("update");
      if (
        !token ||
        !timingSafeEqual(Buffer.from(token.tokenHash, "hex"), hashed)
      )
        throw new HttpError(403, "Código inválido ou expirado.");
      const password = await hashPassword(input.data.password);
      const id = crypto.randomUUID();
      await tx
        .insert(user)
        .values({
          id,
          name: input.data.name,
          email: token.email,
          isAdmin: true,
          emailVerified: false,
        });
      await tx
        .insert(account)
        .values({
          id: crypto.randomUUID(),
          userId: id,
          accountId: id,
          providerId: "credential",
          password,
        });
      await tx
        .update(setupToken)
        .set({ consumedAt: new Date() })
        .where(eq(setupToken.id, "owner"));
      await tx
        .insert(audit)
        .values({
          id: crypto.randomUUID(),
          actorId: id,
          action: "admin.created",
          detail: "Primeiro acesso com código de uso único.",
        });
    });
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
