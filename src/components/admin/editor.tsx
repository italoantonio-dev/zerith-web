"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Markdown } from "@/components/markdown";
import { slugify } from "@/lib/post-validation";
import { MediaLibrary, type MediaItem } from "./media-library";
import { Status } from "./post-status";
type EditorData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  coverAssetId: string | null;
  seoTitle: string;
  seoDescription: string;
  version?: number;
};
const blank: EditorData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Tecnologia",
  tags: [],
  status: "draft",
  coverAssetId: null,
  seoTitle: "",
  seoDescription: "",
};
export function Editor({
  initial,
  media,
}: {
  initial?: EditorData;
  media: MediaItem[];
}) {
  const [post, setPost] = useState<EditorData>(initial || blank),
    [tagText, setTagText] = useState(initial?.tags.join(", ") || ""),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [preview, setPreview] = useState(false),
    [library, setLibrary] = useState(false),
    [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const text = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const change = <K extends keyof EditorData>(key: K, value: EditorData[K]) => {
    setPost((p) => ({ ...p, [key]: value }));
    setDirty(true);
    setNotice("");
  };
  const insert = (prefix: string, suffix = "") => {
    const el = text.current;
    const start = el?.selectionStart ?? post.content.length,
      end = el?.selectionEnd ?? post.content.length;
    change(
      "content",
      post.content.slice(0, start) +
        prefix +
        post.content.slice(start, end) +
        suffix +
        post.content.slice(end),
    );
    setPreview(false);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  };
  async function save(status: EditorData["status"]) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        post.id ? `/api/admin/posts/${post.id}` : "/api/admin/posts",
        {
          method: post.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...post,
            status,
            tags: tagText
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPost((p) => ({ ...p, id: data.id, version: data.version, status }));
      setDirty(false);
      setNotice(
        status === "published"
          ? "Artigo publicado. Ele já está disponível no blog."
          : status === "archived"
            ? "Artigo arquivado e removido do blog público."
            : "Rascunho salvo com segurança.",
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-page-heading editor-heading">
        <div>
          <span className="eyebrow">EDITOR DE CONTEÚDO</span>
          <h1>
            {initial ? "Lapide sua ideia." : "O próximo artigo começa aqui."}
          </h1>
          <p>
            {dirty
              ? "Você tem alterações não salvas."
              : notice || "Escreva, revise e publique no seu ritmo."}
          </p>
        </div>
        <div className="editor-actions">
          <button
            className="button button-outline"
            disabled={busy}
            onClick={() => save("draft")}
          >
            {busy
              ? "Salvando…"
              : post.status === "published"
                ? "Salvar e despublicar"
                : "Salvar rascunho"}
          </button>
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => save("published")}
          >
            {post.status === "published"
              ? "Atualizar publicação"
              : "Publicar artigo"}
          </button>
        </div>
      </div>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="admin-success" role="status">
          {notice}
        </p>
      )}
      <div className="editor-layout">
        <div className="editor-main">
          <section className="admin-panel editor-fields">
            <label>
              Título do artigo
              <input
                value={post.title}
                maxLength={140}
                placeholder="Uma ideia que merece ser compartilhada"
                onChange={(e) => {
                  const title = e.target.value;
                  setPost((p) => ({
                    ...p,
                    title,
                    slug: slugEdited ? p.slug : slugify(title),
                  }));
                  setDirty(true);
                }}
              />
            </label>
            <label>
              Endereço do artigo
              <div className="slug-input">
                <span>/blog/</span>
                <input
                  value={post.slug}
                  maxLength={150}
                  onChange={(e) => {
                    setSlugEdited(true);
                    change("slug", e.target.value);
                  }}
                  spellCheck={false}
                />
              </div>
            </label>
            <label>
              Resumo
              <textarea
                value={post.excerpt}
                rows={3}
                maxLength={300}
                placeholder="Apresente o assunto em poucas linhas."
                onChange={(e) => change("excerpt", e.target.value)}
              />
              <small>{post.excerpt.length}/300 caracteres</small>
            </label>
          </section>
          <section className="admin-panel editor-body">
            <div className="editor-toolbar">
              <div>
                <button
                  type="button"
                  aria-pressed={!preview}
                  onClick={() => setPreview(false)}
                >
                  Escrever
                </button>
                <button
                  type="button"
                  aria-pressed={preview}
                  onClick={() => setPreview(true)}
                >
                  Prévia
                </button>
              </div>
              {!preview && (
                <div>
                  <button
                    type="button"
                    title="Inserir título"
                    aria-label="Inserir título"
                    onClick={() => insert("\n## ")}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    title="Negrito"
                    aria-label="Inserir negrito"
                    onClick={() => insert("**", "**")}
                  >
                    <b>B</b>
                  </button>
                  <button
                    type="button"
                    title="Lista"
                    aria-label="Inserir lista"
                    onClick={() => insert("\n- ")}
                  >
                    ≡
                  </button>
                  <button
                    type="button"
                    title="Link"
                    aria-label="Inserir link"
                    onClick={() => insert("[", "](https://)")}
                  >
                    ↗
                  </button>
                </div>
              )}
            </div>
            {preview ? (
              <div className="editor-live-preview">
                {post.content ? (
                  <Markdown content={post.content} />
                ) : (
                  <p>Sua prévia aparecerá aqui conforme você escrever.</p>
                )}
              </div>
            ) : (
              <>
                <label className="sr-only" htmlFor="article-body">
                  Conteúdo em Markdown
                </label>
                <textarea
                  id="article-body"
                  ref={text}
                  value={post.content}
                  onChange={(e) => change("content", e.target.value)}
                  placeholder={
                    "## Comece pelo que importa\n\nEscreva o conteúdo do artigo aqui.\n\nUse **negrito**, listas e links para organizar a leitura."
                  }
                  spellCheck
                  className="markdown-input"
                />
              </>
            )}
            <div className="editor-body-footer">
              <span>
                {post.content.trim()
                  ? post.content.trim().split(/\s+/).length
                  : 0}{" "}
                palavras
              </span>
              <span>Markdown · HTML não é executado</span>
            </div>
          </section>
          <details className="admin-panel seo-panel">
            <summary>Como o artigo aparece nas buscas</summary>
            <label>
              Título para busca
              <input
                maxLength={70}
                value={post.seoTitle}
                placeholder={post.title || "Usar título do artigo"}
                onChange={(e) => change("seoTitle", e.target.value)}
              />
              <small>{post.seoTitle.length}/70 caracteres</small>
            </label>
            <label>
              Descrição para busca
              <textarea
                rows={3}
                maxLength={180}
                value={post.seoDescription}
                placeholder={post.excerpt || "Usar resumo do artigo"}
                onChange={(e) => change("seoDescription", e.target.value)}
              />
              <small>{post.seoDescription.length}/180 caracteres</small>
            </label>
          </details>
        </div>
        <aside className="editor-sidebar">
          <section className="admin-panel">
            <h2>Publicação</h2>
            <Status status={post.status} />
            <p className="admin-note">
              Rascunhos ficam visíveis apenas no painel. Arquivar remove o
              artigo do blog sem apagar seu conteúdo.
            </p>
            {post.id && (
              <Link
                href={`/admin/previa/${post.id}`}
                target="_blank"
                className="text-link"
              >
                Abrir prévia salva ↗
              </Link>
            )}
            {post.status === "published" && (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="text-link"
              >
                Ver no blog ↗
              </Link>
            )}
            {post.id && post.status !== "archived" && (
              <button
                className="admin-danger-link"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      "Arquivar este artigo? Ele sairá do blog, mas poderá ser restaurado como rascunho.",
                    )
                  )
                    void save("archived");
                }}
              >
                Arquivar artigo
              </button>
            )}
          </section>
          <section className="admin-panel">
            <h2>Organização</h2>
            <label>
              Categoria
              <input
                value={post.category}
                maxLength={50}
                list="category-suggestions"
                onChange={(e) => change("category", e.target.value)}
              />
              <datalist id="category-suggestions">
                {[
                  "Tecnologia",
                  "Engenharia",
                  "Automação",
                  "Software",
                  "Fabricação digital",
                  "Bastidores",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </datalist>
            </label>
            <label>
              Tags
              <input
                value={tagText}
                onChange={(e) => {
                  setTagText(e.target.value);
                  setDirty(true);
                }}
                placeholder="software, projeto, inovação"
              />
              <small>Separe por vírgula. Até 8 tags.</small>
            </label>
          </section>
          <section className="admin-panel">
            <h2>Imagem de capa</h2>
            {post.coverAssetId ? (
              <>
                <img
                  className="editor-cover"
                  src={`/media/${post.coverAssetId}`}
                  alt="Capa selecionada"
                />
                <button
                  className="auth-help"
                  onClick={() => change("coverAssetId", null)}
                >
                  Remover capa
                </button>
              </>
            ) : (
              <div className="empty-cover">
                Uma imagem pode abrir a conversa.
              </div>
            )}
            <button
              className="button button-outline"
              onClick={() => setLibrary(!library)}
            >
              {library ? "Fechar biblioteca" : "Escolher imagem"}
            </button>
          </section>
          <div className="admin-note">
            A prévia salva mostra a última versão gravada. Salve antes de abrir.
          </div>
        </aside>
      </div>
      {library && (
        <section className="admin-panel editor-library">
          <h2>Biblioteca de imagens</h2>
          <p className="admin-note">
            Selecione uma imagem para a capa ou envie uma nova. Para incluí-la
            no texto, use o botão abaixo.
          </p>
          <MediaLibrary
            initial={media}
            onSelect={(item) => {
              change("coverAssetId", item.id);
              setNotice("Imagem selecionada para a capa.");
            }}
          />
          {post.coverAssetId && (
            <button
              className="button button-outline"
              onClick={() => {
                insert(`\n![Descreva a imagem](/media/${post.coverAssetId})\n`);
                setNotice(
                  "Imagem inserida no texto. Ajuste sua descrição em Markdown.",
                );
              }}
            >
              Inserir imagem selecionada no conteúdo
            </button>
          )}
        </section>
      )}
    </>
  );
}
