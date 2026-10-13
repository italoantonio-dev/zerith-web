import type { Metadata } from "next";
import Link from "next/link";
import { solutions } from "@/lib/content";
import { PageIntro } from "@/components/page-intro";
import { ContactBand } from "@/components/footer";
import { Arrow, Icon } from "@/components/icons";
export const metadata: Metadata = { title: "Soluções" };
export default function SolutionsPage() {
  return (
    <>
      <PageIntro
        label="Soluções"
        title="O desafio é seu."
        accent="O caminho, construímos juntos."
        description="Cinco áreas de atuação. Diferentes formas de conectar tecnologia ao que você precisa realizar."
      />
      <nav
        className="solution-anchor-nav container"
        aria-label="Áreas de atuação"
      >
        {solutions.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.name}
            <Arrow diagonal />
          </a>
        ))}
      </nav>
      <div className="container solution-details">
        {solutions.map((s) => (
          <section className="solution-detail" id={s.id} key={s.id}>
            <div className="detail-number">
              {s.number}
              <Icon name={s.icon} />
            </div>
            <div>
              <span className="eyebrow">ZERITH {s.name}</span>
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <p className="text-muted">{s.detail}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <Link href="/contato" className="text-link">
                Conversar sobre meu projeto <Arrow diagonal />
              </Link>
            </div>
          </section>
        ))}
      </div>
      <ContactBand />
    </>
  );
}
