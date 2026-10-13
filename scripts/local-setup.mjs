import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
const root = join(process.env.LOCALAPPDATA || join(homedir(), ".local", "share"), "ZerithWeb");
await mkdir(root, { recursive: true });
const configPath = join(root, "postgres-local.json");
let config;
try { config = JSON.parse(await readFile(configPath,"utf8")); } catch(error) { if(error.code !== "ENOENT") throw error; config={ databaseDir:join(root,"postgres"), user:"zerith_local", password:randomBytes(32).toString("hex"), port:55432 }; await writeFile(configPath,JSON.stringify(config),{mode:0o600,flag:"wx"}); }
try { await writeFile(".env.local",`DATABASE_URL=postgresql://${config.user}:${config.password}@127.0.0.1:${config.port}/zerith_web\nBETTER_AUTH_SECRET=${randomBytes(48).toString("hex")}\nBETTER_AUTH_URL=http://127.0.0.1:3000\nSITE_INDEXABLE=false\n`,{mode:0o600,flag:"wx"}); console.log("Configuração local criada. Segredos não foram exibidos."); } catch(error) { if(error.code !== "EEXIST") throw error; console.log("Configuração existente preservada."); }
console.log("Dados PostgreSQL persistentes:",config.databaseDir);
