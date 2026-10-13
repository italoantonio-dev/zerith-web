import { z } from "zod";
export const postSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "O título precisa ter pelo menos 5 caracteres.")
      .max(140),
    slug: z
      .string()
      .trim()
      .min(3)
      .max(150)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use letras minúsculas, números e hífens no endereço.",
      ),
    excerpt: z.string().trim().max(300),
    content: z.string().max(80_000),
    category: z.string().trim().min(2).max(50),
    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(8)
      .transform((tags) => [...new Set(tags)]),
    status: z.enum(["draft", "published", "archived"]),
    coverAssetId: z.string().uuid().nullable(),
    seoTitle: z.string().trim().max(70),
    seoDescription: z.string().trim().max(180),
    version: z.number().int().positive().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.status === "published" &&
      (value.content.trim().length < 80 || value.excerpt.length < 30)
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Para publicar, escreva pelo menos 80 caracteres de conteúdo e 30 de resumo.",
      });
  });
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150);
}
export function mediaIds(content: string) {
  return [
    ...new Set(
      [...content.matchAll(/\/media\/([0-9a-f-]{36})/g)].map((m) => m[1]),
    ),
  ];
}
