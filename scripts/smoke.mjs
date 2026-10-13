import assert from "node:assert/strict";

const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:3000";
const paths = [
  "/",
  "/solucoes",
  "/produtos",
  "/produtos/fleet",
  "/sobre",
  "/contato",
  "/blog",
  "/privacidade",
];
const results = await Promise.all(
  paths.map(async (path) => {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, `${path}: status HTTP`);
    const html = await response.text();
    assert.equal(
      (html.match(/<h1(?:\s|>)/g) || []).length,
      1,
      `${path}: um título h1`,
    );
    assert.match(html, /lang="pt-BR"/, `${path}: idioma`);
    assert.match(
      html,
      /name="robots" content="noindex, nofollow"/,
      `${path}: preview não indexável`,
    );
    assert.match(html, /href="#conteudo"/, `${path}: link para pular conteúdo`);
    assert.equal(
      response.headers.get("x-content-type-options"),
      "nosniff",
      `${path}: cabeçalho de segurança`,
    );
    assert.equal(
      response.headers.get("x-frame-options"),
      "DENY",
      `${path}: proteção de enquadramento`,
    );
    return {
      path,
      status: response.status,
      htmlBytes: Buffer.byteLength(html),
    };
  }),
);
for (const path of ["/pagina-inexistente", "/blog/artigo-inexistente"]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 404, `${path}: página inexistente`);
  results.push({ path, status: response.status });
}
const robots = await fetch(new URL("/robots.txt", origin));
assert.match(await robots.text(), /Disallow: \//);
const sitemap = await fetch(new URL("/sitemap.xml", origin));
assert.equal(sitemap.status, 200, "/sitemap.xml: status HTTP");
assert.match(await sitemap.text(), /urlset/, "/sitemap.xml: XML válido");
for (const path of ["/icon.svg", "/og.png"]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path}: asset presente`);
  assert.match(response.headers.get("content-type"), /image\//);
}
console.table(results);
console.log("Rotas, 404, metadados, cabeçalhos e assets: OK.");
