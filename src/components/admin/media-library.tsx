"use client";
import { useState } from "react";
import Image from "next/image";
export type MediaItem = {
  id: string;
  name: string;
  alt: string;
  width: number;
  height: number;
  size: number;
};
export function MediaLibrary({
  initial,
  onSelect,
  compact = false,
}: {
  initial: MediaItem[];
  onSelect?: (item: MediaItem) => void;
  compact?: boolean;
}) {
  const [items, setItems] = useState(initial),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  return (
    <div className={compact ? "media-library compact" : "media-library"}>
      <form
        className="media-upload"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const body = new FormData(form);
          setBusy(true);
          setError("");
          setNotice("");
          try {
            const file = body.get("file") as File;
            if (file.size > 5 * 1024 * 1024)
              throw new Error("A imagem deve ter até 5 MB.");
            const response = await fetch("/api/admin/media", {
              method: "POST",
              body,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            const item = {
              id: data.id,
              name: file.name,
              alt: data.alt,
              width: data.width,
              height: data.height,
              size: file.size,
            };
            setItems((previous) => [item, ...previous]);
            setNotice("Imagem adicionada à biblioteca.");
            form.reset();
            onSelect?.(item);
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Adicionar imagem
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
        </label>
        <label>
          Descrição da imagem
          <input
            name="alt"
            required
            minLength={3}
            maxLength={250}
            placeholder="Descreva o que aparece na imagem"
          />
        </label>
        <p className="admin-note">
          JPG, PNG ou WebP, até 5 MB. A imagem será otimizada e os metadados
          removidos.
        </p>
        <button className="button button-outline" disabled={busy}>
          {busy ? "Enviando…" : "Adicionar à biblioteca"}
        </button>
      </form>
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
      {!items.length ? (
        <p className="admin-note">Sua biblioteca ainda está vazia.</p>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <div className="media-item" key={item.id}>
              <Image src={`/media/${item.id}`} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 800px) 100vw, 33vw" />
              <div>
                <strong>{item.name}</strong>
                <p>{item.alt}</p>
                <small>
                  {item.width} × {item.height}
                </small>
                {onSelect && (
                  <button type="button" onClick={() => onSelect(item)}>
                    Selecionar imagem
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
