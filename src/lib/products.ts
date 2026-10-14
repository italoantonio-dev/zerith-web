import { asc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { products } from "./db/schema";
export async function listProducts(includeDrafts = false) {
  try {
    return await getDb().select().from(products).where(includeDrafts ? undefined : eq(products.status, "published")).orderBy(asc(products.createdAt));
  } catch (error) {
    // Keep the existing catalog available until the additive migration is applied.
    if ((error as { cause?: { code?: string } })?.cause?.code === "42P01") return [];
    throw error;
  }
}
