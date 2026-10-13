import { desc } from "drizzle-orm";
import { getDb } from "./db";
import { assets } from "./db/schema";
export function listMedia() {
  return getDb()
    .select({
      id: assets.id,
      name: assets.name,
      alt: assets.alt,
      width: assets.width,
      height: assets.height,
      size: assets.size,
    })
    .from(assets)
    .orderBy(desc(assets.createdAt))
    .limit(100);
}
