"use client";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const admin = usePathname().startsWith("/admin");
  return (
    <>
      {!admin && <Header />}
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      {!admin && <Footer />}
    </>
  );
}
