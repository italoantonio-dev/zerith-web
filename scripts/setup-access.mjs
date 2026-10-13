import nextEnv from "@next/env";
import { Client } from "pg";
import { randomBytes, createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
nextEnv.loadEnvConfig(process.cwd());
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const admins = await client.query(
    'SELECT 1 FROM "user" WHERE is_admin=true LIMIT 1',
  );
  if (admins.rowCount) {
    console.log("Administrador já existe. Primeiro acesso não foi reaberto.");
  } else {
    const token = randomBytes(32).toString("hex");
    const hash = createHash("sha256").update(token).digest("hex");
    await client.query(
      "INSERT INTO setup_token(id,token_hash,email,expires_at) VALUES('owner',$1,$2,now()+interval '24 hours') ON CONFLICT(id) DO UPDATE SET token_hash=excluded.token_hash,email=excluded.email,expires_at=excluded.expires_at,consumed_at=NULL",
      [hash, "italoafelisbino@gmail.com"],
    );
    await mkdir(".setup", { recursive: true });
    await writeFile(
      ".setup/primeiro-acesso.txt",
      `PRIMEIRO ACESSO ZERITH\n\nAbra http://127.0.0.1:3000/admin/configurar\nE-mail administrativo: italoafelisbino@gmail.com\n\nCódigo de configuração (uso único, válido por 24 horas):\n${token}\n\nEscolha sua senha diretamente na página. Depois configure seu autenticador.\nNão compartilhe este arquivo. O código deixa de funcionar assim que a conta é criada.\n`,
      { mode: 0o600 },
    );
    console.log(
      "Código de primeiro acesso salvo em .setup/primeiro-acesso.txt. Nenhuma senha foi definida pelo assistente.",
    );
  }
} finally {
  await client.end();
}
