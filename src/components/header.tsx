"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow, Mark } from "./icons";
const links = [
  { href: "/solucoes", label: "Soluções" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "A Zerith" },
  { href: "/blog", label: "Conhecimento" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") setTheme(current);
    const saved = localStorage.getItem("zerith-theme");
    if (saved === "light" || saved === "dark") setThemeMode(saved);
  }, []);
  useEffect(() => {
    if (!open && !themeMenuOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setThemeMenuOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, themeMenuOpen]);
  const applyTheme = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
    if (mode === "system") {
      localStorage.removeItem("zerith-theme");
      document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      setTheme(document.documentElement.dataset.theme as "light" | "dark");
    } else {
      localStorage.setItem("zerith-theme", mode);
      document.documentElement.dataset.theme = mode;
      setTheme(mode);
    }
    setThemeMenuOpen(false);
  };
  const ThemeIcon = () => themeMode === "light" ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg> : themeMode === "dark" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 15.2A8.5 8.5 0 0 1 8.8 3.3 8.5 8.5 0 1 0 20.7 15.2Z" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16Z" /></svg>;
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link
          href="/"
          className="brand"
          aria-label="Zerith Technologies, início"
          onClick={() => setOpen(false)}
        >
          <Mark />
          <span>
            ZERITH<small>TECHNOLOGIES</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contato" className="header-cta">
          Vamos conversar <Arrow diagonal />
        </Link>
        <div className="theme-control">
          <button className="theme-toggle" type="button" aria-label="Escolher tema" aria-haspopup="menu" aria-expanded={themeMenuOpen} onClick={() => setThemeMenuOpen(!themeMenuOpen)}>
            <ThemeIcon />
          </button>
          {themeMenuOpen && <div className="theme-menu" role="menu" aria-label="Tema da interface">
            {([["light", "Claro"], ["dark", "Escuro"], ["system", "Automático"]] as const).map(([mode, label]) => <button key={mode} type="button" role="menuitemradio" aria-checked={themeMode === mode} className={themeMode === mode ? "is-selected" : ""} onClick={() => applyTheme(mode)}>{label}<span aria-hidden="true">{themeMode === mode ? "✓" : ""}</span></button>)}
          </div>}
        </div>
        <button
          className="menu-toggle"
          ref={toggle}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span className={open ? "is-open" : ""} />
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav container"
          aria-label="Navegação móvel"
        >
          {[...links, { href: "/contato", label: "Vamos conversar" }].map(
            (link) => (
              <Link
                href={link.href}
                key={link.href}
                aria-current={
                  pathname.startsWith(link.href) ? "page" : undefined
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
                <Arrow />
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
