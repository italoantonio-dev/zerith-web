import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { adminSession, apiError, readJson, requireOrigin, HttpError } from "@/lib/admin";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireOrigin(request); const active = await adminSession(request.headers);
    const data = await readJson(request) as Record<string, unknown>;
    const name = String(data.name ?? "").trim(), slug = String(data.slug ?? "").trim().toLowerCase(), description = String(data.description ?? "").trim();
    if (!name || !/^[a-z0-9-]+$/.test(slug) || !description) throw new HttpError(400, "Preencha nome, slug e descrição.");
    const id = crypto.randomUUID();
    await getDb().insert(products).values({ id, name, slug, description, href: String(data.href ?? "/contato"), status: data.status === "published" ? "published" : "draft" });
    return Response.json({ id }, { status: 201 });
  } catch (error) { return apiError(error); }
}
