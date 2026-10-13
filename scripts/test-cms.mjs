import nextEnv from "@next/env";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { randomBytes, createHash, createHmac } from "node:crypto";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import sharp from "sharp";
import { writeFile, access, unlink } from "node:fs/promises";
nextEnv.loadEnvConfig(process.cwd());
const url = new URL(process.env.DATABASE_URL);
const name = `zerith_test_${Date.now()}`;
const root = new Client({ connectionString: url.href });
await root.connect();
await root.query(`CREATE DATABASE "${name}"`);
url.pathname = "/" + name;
const db = new Client({ connectionString: url.href });
await db.connect();
await migrate(drizzle(db), { migrationsFolder: "drizzle" });
const base = "http://127.0.0.1:3001";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3001",
  ],
  {
    env: {
      ...process.env,
      DATABASE_URL: url.href,
      BETTER_AUTH_URL: base,
      BETTER_AUTH_SECRET: randomBytes(48).toString("hex"),
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);
let logs = "";
child.stdout.on("data", (c) => (logs += c));
child.stderr.on("data", (c) => (logs += c));
const cookies = new Map();
let checks = 0;
async function req(
  path,
  {
    body,
    method = body ? "POST" : "GET",
    auth = true,
    origin = base,
    form,
  } = {},
) {
  const headers = { origin };
  if (auth)
    headers.cookie = [...cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  if (body) headers["content-type"] = "application/json";
  const r = await fetch(base + path, {
    method,
    headers,
    body: form || (body ? JSON.stringify(body) : undefined),
    redirect: "manual",
  });
  if (auth)
    for (const c of r.headers.getSetCookie()) {
      const [pair] = c.split(";");
      const at = pair.indexOf("=");
      cookies.set(pair.slice(0, at), pair.slice(at + 1));
    }
  return r;
}
function ok(value, label) {
  assert.ok(value, label);
  checks++;
  console.log("PASS " + label);
}
function totp(secret) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of secret.toUpperCase().replace(/=+$/, ""))
    bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const key = Buffer.from(
    (bits.match(/.{8}/g) || []).map((b) => parseInt(b, 2)),
  );
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const hash = createHmac("sha1", key).update(counter).digest();
  const n = hash.readUInt32BE(hash[19] & 15) & 0x7fffffff;
  return String(n % 1000000).padStart(6, "0");
}
try {
  for (let i = 0; i < 90; i++) {
    try {
      if ((await fetch(base + "/api/admin/setup")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
    if (i === 89) throw Error("Test server unavailable");
  }
  const token = randomBytes(32).toString("hex"),
    password = randomBytes(24).toString("hex"),
    email = "cms-test@example.invalid";
  await db.query(
    "INSERT INTO setup_token(id,token_hash,email,expires_at) VALUES('owner',$1,$2,now()+interval '1 hour')",
    [createHash("sha256").update(token).digest("hex"), email],
  );
  ok(
    (await req("/api/admin/posts", { body: {} })).status === 401,
    "anonymous CMS blocked",
  );
  ok(
    (
      await req("/api/admin/setup", {
        body: { token, name: "CMS Test", password },
        origin: "https://other.invalid",
      })
    ).status === 403,
    "cross-origin setup blocked",
  );
  ok(
    (
      await req("/api/admin/setup", {
        body: { token, name: "CMS Test", password },
      })
    ).ok,
    "one-time setup",
  );
  ok(
    (
      await req("/api/admin/setup", {
        body: { token, name: "CMS Test", password },
      })
    ).status === 409,
    "setup cannot be reused",
  );
  ok(
    (
      await req("/api/auth/sign-up/email", {
        body: { email: "other@example.invalid", name: "Other", password },
      })
    ).status === 403,
    "public signup disabled",
  );
  ok(
    (await req("/api/auth/sign-in/email", { body: { email, password } })).ok,
    "password sign-in",
  );
  ok(
    (await req("/api/admin/posts", { body: {} })).status === 403,
    "password alone cannot access CMS",
  );
  const enrollment = await req("/api/auth/two-factor/enable", {
    body: { password },
  });
  ok(enrollment.ok, "MFA enrollment");
  const enrolled = await enrollment.json();
  const secret = new URL(enrolled.totpURI).searchParams.get("secret");
  const verified = await req("/api/auth/two-factor/verify-totp", {
    body: { code: totp(secret) },
  });
  ok(verified.ok, "MFA verification");
  ok(
    (await db.query("SELECT 1 FROM admin_mfa_proof")).rowCount === 1,
    "session proof persisted",
  );
  for (const route of [
    "/admin",
    "/admin/artigos",
    "/admin/artigos/novo",
    "/admin/midia",
    "/admin/seguranca",
    "/admin/atividade",
  ])
    ok((await req(route)).status === 200, route + " renders");
  const image = await sharp({
    create: { width: 40, height: 30, channels: 3, background: "#2563eb" },
  })
    .png()
    .toBuffer();
  const form = new FormData();
  form.set("file", new Blob([image], { type: "image/png" }), "test.png");
  form.set("alt", "Imagem de teste isolado");
  const upload = await req("/api/admin/media", { method: "POST", form });
  ok(upload.status === 201, "safe image upload");
  const asset = await upload.json();
  ok(
    (await req("/media/" + asset.id, { auth: false })).status === 404,
    "unpublished media private",
  );
  const post = {
    title: "Artigo de teste isolado",
    slug: "artigo-teste-isolado",
    excerpt:
      "Resumo exclusivo para verificar a publicação em um banco temporário.",
    content:
      "## Conteúdo de teste\n\nEste conteúdo existe apenas no banco temporário para validar a publicação e a proteção de rascunhos.\n\n<script>alert(1)</script>\n\n[link](javascript:alert(1))",
    category: "Engenharia",
    tags: ["teste"],
    status: "draft",
    coverAssetId: asset.id,
    seoTitle: "",
    seoDescription: "",
  };
  const created = await req("/api/admin/posts", { body: post });
  ok(created.status === 201, "create draft");
  const saved = await created.json();
  ok(
    (await req("/blog/" + post.slug, { auth: false })).status === 404,
    "draft hidden from public",
  );
  ok(
    (await req("/admin/previa/" + saved.id)).status === 200,
    "authenticated preview",
  );
  ok(
    (await req("/admin/previa/" + saved.id, { auth: false })).status === 307,
    "preview requires login",
  );
  ok(
    (await req("/api/admin/posts", { body: post })).status === 409,
    "duplicate slug rejected",
  );
  ok(
    (
      await req("/api/admin/posts/" + saved.id, {
        method: "PUT",
        body: { ...post, status: "published", version: 1 },
      })
    ).ok,
    "publish article",
  );
  const publicPage = await req("/blog/" + post.slug, { auth: false });
  ok(publicPage.status === 200, "published article accessible");
  const html = await publicPage.text();
  ok(
    !html.includes("<script>alert(1)</script>") &&
      !html.includes('href="javascript:'),
    "unsafe Markdown not executable",
  );
  ok(
    (await req("/media/" + asset.id, { auth: false })).status === 200,
    "published cover accessible",
  );
  for (const route of [
    "/",
    "/blog?q=isolado",
    "/blog?categoria=Engenharia",
    "/blog?tag=teste",
  ])
    ok(
      (await (await req(route, { auth: false })).text()).includes(post.title),
      route + " lists publication",
    );
  ok(
    (
      await req("/api/admin/posts/" + saved.id, {
        method: "PUT",
        body: { ...post, version: 1 },
      })
    ).status === 409,
    "stale version rejected",
  );
  ok(
    (
      await req("/api/admin/posts/" + saved.id, {
        method: "PUT",
        body: { ...post, version: 2 },
        origin: "https://other.invalid",
      })
    ).status === 403,
    "cross-origin write blocked",
  );
  ok(
    (
      await req("/api/admin/posts/" + saved.id, {
        method: "PUT",
        body: { ...post, version: 2 },
      })
    ).ok,
    "unpublish article",
  );
  ok(
    (await req("/blog/" + post.slug, { auth: false })).status === 404,
    "unpublished article hidden",
  );
  ok(
    (await req("/media/" + asset.id, { auth: false })).status === 404,
    "unpublished cover hidden",
  );
  const session = (await req("/api/auth/get-session")).ok;
  ok(session, "session active");
  const id = (await db.query("SELECT session_id FROM admin_mfa_proof LIMIT 1"))
    .rows[0].session_id;
  ok(
    (await req("/api/admin/sessions/" + id, { method: "DELETE" })).ok,
    "revoke current session",
  );
  ok(
    (await req("/api/admin/posts", { body: post })).status === 401,
    "revocation enforced immediately",
  );
  ok(
    (await req("/api/auth/sign-in/email", { body: { email, password } })).ok,
    "second sign-in",
  );
  ok(
    (await req("/api/admin/posts", { body: post })).status === 401,
    "second login requires MFA challenge",
  );
  ok(
    (
      await req("/api/auth/two-factor/verify-backup-code", {
        body: { code: enrolled.backupCodes[0] },
      })
    ).ok,
    "recovery code verifies",
  );
  ok((await req("/admin")).status === 200, "recovery restores admin access");
  console.log(`CMS: ${checks} checks passed. Production data unchanged.`);
  if (process.env.CMS_UI === "1") {
    await writeFile(
      ".setup/ui-test.json",
      JSON.stringify({ email, password, code: enrolled.backupCodes[1] }),
    );
    console.log("Isolated UI test ready at port 3001.");
    for (let i = 0; i < 1200; i++) {
      try {
        await access(".setup/ui-done");
        await unlink(".setup/ui-done");
        break;
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    await unlink(".setup/ui-test.json");
  }
} catch (e) {
  console.error(e.message);
  console.error(logs.replace(/(secret|password|token)[^\n]*/gi, "[redacted]"));
  process.exitCode = 1;
} finally {
  child.kill();
  await new Promise((r) => child.once("exit", r));
  await db.end();
  await root.query(`DROP DATABASE "${name}" WITH (FORCE)`);
  await root.end();
}
