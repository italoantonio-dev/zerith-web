"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
type SessionItem = {
  id: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string | null;
};
export function Security({
  initial,
  currentId,
}: {
  initial: SessionItem[];
  currentId: string;
}) {
  const [items, setItems] = useState(initial),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="security-grid">
      <section className="admin-panel padded-panel">
        <h2>Senha de acesso</h2>
        <p>
          Ao trocar sua senha, as outras sessões serão encerradas. Confirme seu
          autenticador novamente para continuar.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const data = new FormData(e.currentTarget);
            if (data.get("new") !== data.get("confirm")) {
              setError("As novas senhas não coincidem.");
              setBusy(false);
              return;
            }
            try {
              const result = await authClient.changePassword({
                currentPassword: String(data.get("current")),
                newPassword: String(data.get("new")),
                revokeOtherSessions: true,
              });
              if (result.error)
                throw new Error(
                  "Não foi possível alterar a senha. Confira sua senha atual.",
                );
              window.location.assign("/admin/verificar");
            } catch (err) {
              setError((err as Error).message);
              setBusy(false);
            }
          }}
        >
          <label>
            Senha atual
            <input
              name="current"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            Nova senha
            <input
              name="new"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
            />
          </label>
          <label>
            Confirme a nova senha
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          <button className="button button-primary" disabled={busy}>
            {busy ? "Atualizando…" : "Alterar senha"}
          </button>
        </form>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
      </section>
      <section className="admin-panel padded-panel">
        <h2>Sessões ativas</h2>
        <p>Reconheça seus acessos e encerre os que não precisa mais.</p>
        {items.map((item) => (
          <div className="session-item" key={item.id}>
            <strong>
              {item.id === currentId ? "Esta sessão" : "Outra sessão"}
            </strong>
            <p>{item.userAgent || "Navegador não informado"}</p>
            <small>
              Início: {new Date(item.createdAt).toLocaleString("pt-BR")}
            </small>
            <button
              className="admin-danger-link"
              onClick={async () => {
                setError("");
                try {
                  const r = await fetch(`/api/admin/sessions/${item.id}`, {
                    method: "DELETE",
                  });
                  const data = await r.json();
                  if (!r.ok) throw new Error(data.error);
                  if (data.current) window.location.assign("/admin/entrar");
                  else
                    setItems((previous) =>
                      previous.filter((s) => s.id !== item.id),
                    );
                } catch (err) {
                  setError((err as Error).message);
                }
              }}
            >
              Encerrar {item.id === currentId ? "esta sessão" : "sessão"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
