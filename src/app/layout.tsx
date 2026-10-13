import type { Metadata, Viewport } from "next";
import { SiteFrame } from "@/components/site-frame";
import "@fontsource-variable/sora";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://zerith.tech"),
    title: {
      default: "Zerith Technologies | Software e engenharia para operações",
    template: "%s | Zerith Technologies",
  },
  description:
    "Software, automação, fabricação digital e inteligência operacional. Conheça a Zerith Technologies, de Patrocínio, Minas Gerais.",
  robots: {
    index: process.env.SITE_INDEXABLE === "true",
    follow: process.env.SITE_INDEXABLE === "true",
  },
  openGraph: {
    title: "Zerith Technologies",
    description: "Engenharia para transformar ideias em soluções reais.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Zerith Technologies. Tecnologia que transforma ideias.",
      },
    ],
  },
};
export const viewport: Viewport = { themeColor: "#08111f", colorScheme: "dark" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <script dangerouslySetInnerHTML={{ __html: `(() => { try { const saved = localStorage.getItem('zerith-theme'); const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches; document.documentElement.dataset.theme = saved || (prefersLight ? 'light' : 'dark'); } catch (_) {} })()` }} />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
import "./blog.css";
