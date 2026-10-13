import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { CoreArt } from "@/components/core-art";
import { ContactBand } from "@/components/footer";
import { Process } from "@/components/interactions";
export const metadata: Metadata = { title: "A Zerith" };
export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="A Zerith"
        title="Origem local."
        accent="Vontade de construir."
        description="Uma iniciativa de tecnologia nascida em Patrocínio, Minas Gerais. Engenharia para transformar ideias em aplicações reais."
      />
      <section className="about-story container">
        <CoreArt compact />
        <div>
          <span className="eyebrow">QUEM SOMOS</span>
          <h2>
            Aproximamos ideias
            <br />e possibilidades.
          </h2>
          <p>
            A Zerith Technologies combina a prestação de serviços tecnológicos
            com o desenvolvimento de produtos próprios.
          </p>
          <p>
            Estamos em fase inicial de estruturação, com atuação organizada em
            fabricação digital, automação, inteligência operacional,
            desenvolvimento de software e tecnologia aplicada ao crescimento dos
            negócios.
          </p>
          <p>
            Nosso ponto de partida é simples: entender o desafio antes de
            escolher a ferramenta.
          </p>
        </div>
      </section>
      <section className="container section-space">
        <div className="section-label">
          <span className="section-index">01 /</span>
          <span>COMO TRABALHAMOS</span>
        </div>
        <h2 className="section-title">Clareza em cada etapa.</h2>
        <Process />
      </section>
      <ContactBand />
    </>
  );
}
