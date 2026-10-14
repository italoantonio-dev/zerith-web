import { getDb } from "@/lib/db";
import { products, assets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { adminSession, apiError, readJson, requireOrigin, HttpError } from "@/lib/admin";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try { await adminSession(request.headers); return Response.json(await getDb().select().from(products).orderBy(desc(products.updatedAt))); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    requireOrigin(request); const active = await adminSession(request.headers);
    const data = await readJson(request) as Record<string, unknown>;
    const name = String(data.name ?? "").trim(), slug = String(data.slug ?? "").trim().toLowerCase(), description = String(data.description ?? "").trim();
    if (!name || !/^[a-z0-9-]+$/.test(slug) || !description) throw new HttpError(400, "Preencha nome, slug e descrição.");
    const id = crypto.randomUUID();
    const imageAssetId = data.imageAssetId ? String(data.imageAssetId) : null;
    if (imageAssetId && !(await getDb().select({ id: assets.id }).from(assets).where(eq(assets.id, imageAssetId))).length) throw new HttpError(400, "Imagem não encontrada na biblioteca.");
    await getDb().insert(products).values({ id, name, slug, description, href: String(data.href ?? "/contato"), imageAssetId, status: data.status === "published" ? "published" : "draft" });
    return Response.json({ id }, { status: 201 });
  } catch (error) { return apiError(error); }
}
