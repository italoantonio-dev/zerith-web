import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
const globalDb = globalThis as unknown as { zerithPool?: Pool };
export function getDb() {
  if (!process.env.DATABASE_URL)
    throw new Error(
      "DATABASE_URL não configurada. Execute npm run local:setup.",
    );
  globalDb.zerithPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 8,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
  return drizzle(globalDb.zerithPool, { schema });
}
