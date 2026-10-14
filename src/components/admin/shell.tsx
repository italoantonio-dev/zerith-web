"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark, Arrow } from "@/components/icons";
import { authClient } from "@/lib/auth-client";
export function AdminShell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [error, setError] = useState("");
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin">
          <Mark />
          <span>
            ZERITH<small>ADMINISTRAÇÃO</small>
          </span>
        </Link>
        <span className="admin-nav-label">SEU ESPAÇO DE TRABALHO</span>
        <nav aria-label="Painel administrativo">
          {[
            { href: "/admin", label: "Visão geral", icon: "◈" },
            { href: "/admin/artigos", label: "Artigos", icon: "▤" },
            { href: "/admin/produtos", label: "Produtos", icon: "◇" },
            { href: "/admin/midia", label: "Biblioteca", icon: "▧" },
            { href: "/admin/seguranca", label: "Segurança", icon: "◇" },
            { href: "/admin/atividade", label: "Atividade", icon: "↗" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                (
                  item.href === "/admin"
                    ? path === item.href
                    : path.startsWith(item.href)
                )
                  ? "page"
                  : undefined
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Abrir site <Arrow diagonal />
          </Link>
          <p>
            <span className="status-dot" /> AMBIENTE DE CONTEÚDO
          </p>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>Do conhecimento à publicação.</span>
          <div>
            <span className="admin-avatar">{name.charAt(0).toUpperCase()}</span>
            <span>{name}</span>
            <button
              onClick={async () => {
                const r = await authClient.signOut();
                if (r.error)
                  setError("Não foi possível sair. Tente novamente.");
                else window.location.assign("/admin/entrar");
              }}
            >
              Sair
            </button>
          </div>
        </header>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
