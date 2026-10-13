import sharp from "sharp";
import { getDb } from "@/lib/db";
import { assets, audit } from "@/lib/db/schema";
import {
  adminSession,
  requireOrigin,
  limitedBody,
  HttpError,
  apiError,
} from "@/lib/admin";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const active = await adminSession(request.headers);
    const buffer = await limitedBody(request, 5 * 1024 * 1024 + 20_000);
    const form = await new Response(new Uint8Array(buffer), {
      headers: { "content-type": request.headers.get("content-type") || "" },
    }).formData();
    const file = form.get("file"),
      alt = String(form.get("alt") || "").trim();
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !file.size)
      throw new HttpError(400, "Envie uma imagem de até 5 MB.");
    if (alt.length < 3 || alt.length > 250)
      throw new HttpError(400, "Descreva a imagem em 3 a 250 caracteres.");
    const bytes = Buffer.from(await file.arrayBuffer());
    let image;
    try {
      const processor = sharp(bytes, {
        limitInputPixels: 24_000_000,
        animated: false,
      });
      const meta = await processor.metadata();
      if (
        !["jpeg", "png", "webp"].includes(meta.format || "") ||
        (meta.pages || 1) > 1
      )
        throw new Error("format");
      image = await processor
        .rotate()
        .resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      throw new HttpError(
        400,
        "Imagem inválida. Use JPG, PNG ou WebP, sem animação, com até 24 megapixels.",
      );
    }
    const id = crypto.randomUUID();
    await getDb().transaction(async (tx) => {
      await tx
        .insert(assets)
        .values({
          id,
          name: file.name.slice(0, 150),
          alt,
          mime: "image/webp",
          width: image.info.width,
          height: image.info.height,
          size: image.data.length,
          data: image.data,
          createdBy: active.user.id,
        });
      await tx
        .insert(audit)
        .values({
          id: crypto.randomUUID(),
          actorId: active.user.id,
          action: "media.uploaded",
          entityId: id,
          detail: file.name.slice(0, 150),
        });
    });
    return Response.json(
      {
        id,
        url: `/media/${id}`,
        alt,
        width: image.info.width,
        height: image.info.height,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
