import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getAuth } from "./auth";
import { getDb } from "./db";
import { mfaProof } from "./db/schema";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function adminSession(requestHeaders: Headers) {
  const active = await getAuth().api.getSession({ headers: requestHeaders });
  if (!active) throw new HttpError(401, "Entre na sua conta para continuar.");
  if (!active.user.isAdmin)
    throw new HttpError(403, "Esta conta não tem acesso administrativo.");
  const [proof] = await getDb()
    .select()
    .from(mfaProof)
    .where(eq(mfaProof.sessionId, active.session.id));
  if (!active.user.twoFactorEnabled || !proof)
    throw new HttpError(403, "Confirme a autenticação em duas etapas.");
  return active;
}
export async function requireAdmin() {
  try {
    return await adminSession(await headers());
  } catch (error) {
    if (error instanceof HttpError)
      redirect(error.status === 401 ? "/admin/entrar" : "/admin/verificar");
    throw error;
  }
}
export function requireOrigin(request: Request) {
  const allowed = new URL(
    process.env.BETTER_AUTH_URL || "http://127.0.0.1:3000",
  ).origin;
  if (request.headers.get("origin") !== allowed)
    throw new HttpError(403, "Origem não permitida.");
}
export async function limitedBody(request: Request, maxBytes = 150_000) {
  if (Number(request.headers.get("content-length") || 0) > maxBytes)
    throw new HttpError(413, "Arquivo ou conteúdo muito grande.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Conteúdo ausente.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > maxBytes) {
      await reader.cancel();
      throw new HttpError(413, "Arquivo ou conteúdo muito grande.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(415, "Formato de conteúdo inválido.");
  try {
    return JSON.parse((await limitedBody(request)).toString("utf8"));
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Conteúdo inválido.");
  }
}
export function apiError(error: unknown) {
  if (error instanceof HttpError)
    return Response.json({ error: error.message }, { status: error.status });
  console.error(
    "Falha na operação administrativa:",
    error instanceof Error ? error.name : "UnknownError",
  );
  return Response.json(
    { error: "Não foi possível concluir. Tente novamente." },
    { status: 500 },
  );
}
