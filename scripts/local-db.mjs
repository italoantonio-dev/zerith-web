import EmbeddedPostgres from "embedded-postgres";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
const root = join(process.env.LOCALAPPDATA || join(homedir(), ".local", "share"), "ZerithWeb");
const config = JSON.parse(await readFile(join(root,"postgres-local.json"),"utf8"));
const cluster = new EmbeddedPostgres({ ...config, persistent:true, createPostgresUser:false, authMethod:"scram-sha-256", initdbFlags:["--encoding=UTF8","--locale=C"], postgresFlags:["-c","listen_addresses=127.0.0.1"], onLog:()=>{}, onError:()=>{} });
try { await access(join(config.databaseDir,"PG_VERSION")); } catch { await cluster.initialise(); }
await cluster.start();
const client = cluster.getPgClient(); await client.connect();
const found = await client.query("SELECT 1 FROM pg_database WHERE datname='zerith_web'");
if (!found.rowCount) await client.query('CREATE DATABASE zerith_web');
await client.end();
console.log(`PostgreSQL pronto em 127.0.0.1:${config.port}. Dados persistentes; acesso somente local.`);
setInterval(()=>{},60_000);
