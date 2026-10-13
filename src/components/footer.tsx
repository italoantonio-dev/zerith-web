import Link from "next/link";
import { contactEmail } from "@/lib/content";
import { Arrow, Icon, Mark } from "./icons";
export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="container contact-band-inner">
        <div>
          <span className="eyebrow">
            O PRÓXIMO PASSO COMEÇA COM UMA CONVERSA
          </span>
          <h2>
            O que vamos
            <br />
            <span className="text-muted">construir juntos?</span>
          </h2>
        </div>
        <Link
          href="/contato"
          className="round-cta"
          aria-label="Conversar sobre um projeto"
        >
          <Arrow diagonal />
        </Link>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <Mark />
              <span>
                ZERITH<small>TECHNOLOGIES</small>
              </span>
            </Link>
            <p>
              Engenharia para transformar
              <br />
              ideias em soluções reais.
            </p>
            <span className="location">
              <Icon name="pin" />
              Patrocínio, Minas Gerais
            </span>
          </div>
          <div className="footer-links">
            <span className="eyebrow">EXPLORE</span>
            <Link href="/solucoes">Soluções</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/sobre">A Zerith</Link>
            <Link href="/blog">Conhecimento</Link>
          </div>
          <div className="footer-links">
            <span className="eyebrow">VAMOS CONVERSAR</span>
            <a href={`mailto:${contactEmail}`}>
              {contactEmail}
              <Arrow diagonal />
            </a>
            <Link href="/contato">
              Conte sua ideia <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Zerith Technologies</span>
          <span className="footer-motto">IDEIA. ENGENHARIA. APLICAÇÃO.</span>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/admin">Administração</Link>
        </div>
      </div>
    </footer>
  );
}
