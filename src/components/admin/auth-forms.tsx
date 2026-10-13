"use client";
import { useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { authClient } from "@/lib/auth-client";
import { Mark, Arrow } from "@/components/icons";
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-auth-page">
      <Link className="brand" href="/">
        <Mark />
        <span>
          ZERITH<small>ADMINISTRAÇÃO</small>
        </span>
      </Link>
      <div className="admin-auth-card">
        <span className="eyebrow">ACESSO RESTRITO</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
      <Link className="auth-back" href="/">
        ← Voltar ao site
      </Link>
    </div>
  );
}
export function LoginForm({ setupAvailable }: { setupAvailable: boolean }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <AuthCard
      title="Bem-vindo de volta."
      description="Entre para cuidar dos conteúdos da Zerith."
    >
      <form method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const f = new FormData(e.currentTarget);
          try {
            const result = await authClient.signIn.email({
              email: String(f.get("email")),
              password: String(f.get("password")),
              rememberMe: false,
            });
            if (result.error)
              throw new Error(
                "Não foi possível entrar. Confira os dados ou aguarde antes de tentar novamente.",
              );
            window.location.assign("/admin/verificar");
          } catch (err) {
            setError((err as Error).message);
            setBusy(false);
          }
        }}
      >
        <label>
          E-mail
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label>
          Senha
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary" disabled={busy}>
          {busy ? "Entrando…" : "Continuar"}
          <Arrow />
        </button>
      </form>
      {setupAvailable && (
        <Link className="auth-help" href="/admin/configurar">
          Primeiro acesso? Configure sua conta.
        </Link>
      )}
      <p className="auth-security">
        Protegido por senha e autenticação em duas etapas.
      </p>
    </AuthCard>
  );
}
export function SetupForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <AuthCard
      title="Seu espaço de criação."
      description="Use o código de primeiro acesso salvo no seu computador para criar a conta administrativa."
    >
      <form method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const f = new FormData(e.currentTarget);
          if (f.get("password") !== f.get("confirm")) {
            setError("As senhas não coincidem.");
            setBusy(false);
            return;
          }
          try {
            const r = await fetch("/api/admin/setup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: String(f.get("token")).trim(),
                name: f.get("name"),
                password: f.get("password"),
              }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error);
            window.location.assign("/admin/entrar");
          } catch (err) {
            setError((err as Error).message);
            setBusy(false);
          }
        }}
      >
        <label>
          Código de primeiro acesso
          <input
            name="token"
            required
            minLength={64}
            maxLength={64}
            autoComplete="off"
            spellCheck={false}
          />
          <small>
            Disponível no arquivo de primeiro acesso. Válido por 24 horas.
          </small>
        </label>
        <label>
          Seu nome
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
          />
        </label>
        <label>
          E-mail administrativo
          <input value="italoafelisbino@gmail.com" readOnly />
        </label>
        <label>
          Escolha sua senha
          <input
            name="password"
            type="password"
            required
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
          />
          <small>Use pelo menos 12 caracteres.</small>
        </label>
        <label>
          Confirme sua senha
          <input
            name="confirm"
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
          />
        </label>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        <button className="button button-primary" disabled={busy}>
          {busy ? "Criando conta…" : "Criar minha conta"}
          <Arrow />
        </button>
      </form>
      <p className="auth-security">
        Na próxima etapa, você conectará seu aplicativo autenticador.
      </p>
    </AuthCard>
  );
}
export function TwoFactorForm({ enroll = false }: { enroll?: boolean }) {
  const [qr, setQr] = useState(""),
    [codes, setCodes] = useState<string[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [backup, setBackup] = useState(false);
  return (
    <AuthCard
      title={enroll ? "Uma camada a mais de proteção." : "Confirme que é você."}
      description={
        enroll
          ? "Conecte seu aplicativo autenticador. Essa verificação é obrigatória para administrar o site."
          : "Digite o código do seu aplicativo autenticador para acessar o painel."
      }
    >
      {enroll && !qr ? (
        <form method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const f = new FormData(e.currentTarget);
            try {
              const r = await authClient.twoFactor.enable({
                password: String(f.get("password")),
              });
              if (r.error)
                throw new Error(
                  "Não foi possível configurar. Confira sua senha.",
                );
              if (!r.data || !("totpURI" in r.data) || !r.data.totpURI)
                throw new Error(
                  "O autenticador não retornou um QR code. Recarregue a página e tente novamente.",
                );
              setQr(r.data.totpURI);
              setCodes(r.data.backupCodes);
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Confirme sua senha
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button className="button button-primary" disabled={busy}>
            {busy ? "Preparando…" : "Conectar autenticador"}
          </button>
        </form>
      ) : (
        <>
          {qr && (
            <div className="mfa-enrollment">
              <div className="mfa-qr">
                <QRCode value={qr} size={180} />
              </div>
              <p>Escaneie o QR code com seu aplicativo autenticador.</p>
              <details>
                <summary>Não consigo escanear</summary>
                <code>{new URL(qr).searchParams.get("secret")}</code>
              </details>
              <h2>Guarde seus códigos de recuperação</h2>
              <p>
                Cada código funciona uma única vez. Guarde-os em um lugar seguro
                antes de continuar.
              </p>
              <div className="backup-codes">
                {codes.map((code) => (
                  <code key={code}>{code}</code>
                ))}
              </div>
            </div>
          )}
          <form method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              const f = new FormData(e.currentTarget);
              try {
                const code = String(f.get("code")).trim();
                const r = backup
                  ? await authClient.twoFactor.verifyBackupCode({
                      code,
                      trustDevice: false,
                    })
                  : await authClient.twoFactor.verifyTotp({
                      code,
                      trustDevice: false,
                    });
                if (r.error)
                  throw new Error(
                    "Código inválido ou expirado. Confira o autenticador e tente novamente.",
                  );
                window.location.assign("/admin");
              } catch (err) {
                setError((err as Error).message);
                setBusy(false);
              }
            }}
          >
            {enroll && (
              <label className="admin-checkbox">
                <input type="checkbox" required />
                Guardei meus códigos de recuperação.
              </label>
            )}
            <label>
              {backup ? "Código de recuperação" : "Código de 6 dígitos"}
              <input
                name="code"
                autoComplete="one-time-code"
                inputMode={backup ? "text" : "numeric"}
                pattern={backup ? undefined : "[0-9]{6}"}
                minLength={backup ? 1 : 6}
                maxLength={backup ? 50 : 6}
                required
              />
            </label>
            <button className="button button-primary" disabled={busy}>
              {busy ? "Verificando…" : "Acessar painel"}
              <Arrow />
            </button>
          </form>
          {!enroll && (
            <button
              className="auth-help"
              onClick={() => {
                setBackup(!backup);
                setError("");
              }}
            >
              {backup
                ? "Usar aplicativo autenticador"
                : "Usar um código de recuperação"}
            </button>
          )}
        </>
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <Link className="auth-help" href="/admin/entrar">
        Voltar para o login
      </Link>
    </AuthCard>
  );
}
