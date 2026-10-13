import { LatestPosts } from "@/components/blog-cards";
import Link from "next/link";
import { CoreArt } from "@/components/core-art";
import { Arrow, Icon } from "@/components/icons";
import { HeroMotion, Process } from "@/components/interactions";
import { ContactBand } from "@/components/footer";
import { solutions } from "@/lib/content";

export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <>
      <HeroMotion>
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="status-dot" /> SOFTWARE · AUTOMAÇÃO · ENGENHARIA
            </div>
            <h1 id="hero-title">
              Software e engenharia
              <br />
              para operações que
              <br />
              <span className="word-accent">precisam funcionar.</span>
            </h1>
            <p>
              Desenvolvemos soluções digitais, automações e protótipos para
              organizar processos, conectar informações e enfrentar desafios
              operacionais reais.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="#solucoes">
                Conhecer nossas soluções <Arrow />
              </Link>
              <Link className="text-link" href="/sobre">
                Conheça a Zerith <Arrow diagonal />
              </Link>
            </div>
            <div className="hero-origin">
              <span /> DE PATROCÍNIO, MG. PARA NOVAS POSSIBILIDADES.
            </div>
          </div>
          <div className="hero-visual">
            <div className="art-caption">
              <span className="tiny-cross">+</span>
              <span>MAPA DE OPERAÇÃO / 001</span>
            </div>
            <CoreArt />
            <div className="art-bottom">
              <span>PROCESSO · DADOS · DECISÃO</span>
              <span>ZERITH / 01</span>
            </div>
          </div>
        </section>
        <div className="hero-bottom container">
          <a href="#intro">
            <span className="scroll-track">
              <span />
            </span>
            COMO TRABALHAMOS
          </a>
          <span>
            TECNOLOGIA APLICADA <span className="tiny-cross">+</span>
          </span>
        </div>
      </HeroMotion>
      <div className="discipline-strip" aria-label="Áreas da Zerith">
        <div className="container">
          {[
            "SOFTWARE",
            "AUTOMAÇÃO",
            "FABRICAÇÃO DIGITAL",
            "INTELIGÊNCIA",
            "CONEXÃO",
          ].map((t) => (
            <span key={t}>
              <i /> {t}
            </span>
          ))}
        </div>
      </div>
      <section id="intro" className="intro-section container section-space">
        <div className="section-label">
          <span className="section-index">01 /</span>
          <span>A ESSÊNCIA ZERITH</span>
        </div>
        <div className="intro-main">
          <h2>
            Ideias são o começo.
            <br />
            <span className="text-muted">A engenharia abre o caminho.</span>
          </h2>
          <div className="intro-bottom">
            <p>
              A Zerith nasceu para aproximar possibilidades e aplicações. Com
              origem em Patrocínio, Minas Gerais, reunimos serviços tecnológicos
              e o desenvolvimento de produtos próprios.
            </p>
            <Link className="text-link" href="/sobre">
              Essa é a nossa direção <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <section id="solucoes" className="solutions-section section-space">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-label">
                <span className="section-index">02 /</span>
                <span>NOSSAS SOLUÇÕES</span>
              </div>
              <h2>
                Diferentes tecnologias.
                <br />
                <span className="text-muted">Um novo jeito de resolver.</span>
              </h2>
            </div>
            <p>
              Da peça física ao sistema digital,
              <br />
              encontre o ponto de partida do seu projeto.
            </p>
          </div>
          <div className="solutions-grid">
            {solutions.map((s) => (
              <Link
                href={`/solucoes#${s.id}`}
                className={`solution-card solution-${s.id}`}
                key={s.id}
              >
                <div className="solution-card-top">
                  <Icon name={s.icon} />
                  <span>{s.number}</span>
                </div>
                <h3>
                  <span>ZERITH</span> {s.name}
                </h3>
                <p>{s.description}</p>
                <div className="card-bottom">
                  <span>{s.tags[0]}</span>
                  <Arrow diagonal />
                </div>
              </Link>
            ))}
            <Link href="/contato" className="solution-card solution-invite">
              <div className="invite-mark" aria-hidden="true">
                +
              </div>
              <h3>
                O seu desafio
                <br />é o próximo começo.
              </h3>
              <div className="card-bottom">
                <span>Vamos conversar</span>
                <Arrow diagonal />
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="fleet-section container section-space">
        <div className="fleet-copy">
          <div className="section-label">
            <span className="section-index">03 /</span>
            <span>PRODUTOS PRÓPRIOS</span>
          </div>
          <div className="status-pill">
            <span /> EM DESENVOLVIMENTO
          </div>
          <h2>
            O próximo destino
            <br />
            da sua operação.
          </h2>
          <p>
            Conheça o Zerith Fleet, nosso software de inteligência operacional
            para frotas. Um produto em construção, com foco nos desafios da
            operação.
          </p>
          <Link href="/produtos/fleet" className="button button-outline">
            Conhecer o Zerith Fleet <Arrow diagonal />
          </Link>
        </div>
        <div className="fleet-visual" aria-hidden="true">
          <div className="fleet-grid" />
          <svg viewBox="0 0 600 400">
            <path
              className="route-shadow"
              d="M20 330 155 252 249 307 381 230 282 173 420 94 552 169"
            />
            <path
              className="route-line"
              d="M20 330 155 252 249 307 381 230 282 173 420 94 552 169"
            />
            {[
              [155, 252],
              [249, 307],
              [381, 230],
              [282, 173],
              [420, 94],
            ].map(([x, y], i) => (
              <g key={i}>
                <ellipse
                  cx={x}
                  cy={y}
                  rx="17"
                  ry="10"
                  fill="#2563EB"
                  fillOpacity=".15"
                />
                <ellipse cx={x} cy={y} rx="5" ry="3" fill="#83BBFF" />
              </g>
            ))}
            <path d="m418 92 0-30" stroke="#60A5FA" />
            <circle cx="418" cy="60" r="5" fill="#60A5FA" />
          </svg>
          <div className="fleet-wordmark">
            zerith<span>fleet</span>
            <i />
          </div>
          <span className="fleet-note">INTELIGÊNCIA EM MOVIMENTO</span>
        </div>
      </section>
      <section className="process-section section-space">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-label">
                <span className="section-index">04 /</span>
                <span>ENGENHARIA APLICADA</span>
              </div>
              <h2>
                Da primeira conversa
                <br />
                <span className="text-muted">ao próximo passo.</span>
              </h2>
            </div>
            <p>
              Um processo claro.
              <br /> Construído com você.
            </p>
          </div>
          <Process />
        </div>
      </section>
      <section className="lab-section container section-space">
        <div className="lab-visual" aria-hidden="true">
          <div className="lab-axis" />
          <div className="lab-object">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="lab-visual-label">
            FORMA / FUNÇÃO / POSSIBILIDADE
          </span>
        </div>
        <div className="lab-copy">
          <div className="section-label">
            <span className="section-index">05 /</span>
            <span>MENTALIDADE DE LABORATÓRIO</span>
          </div>
          <h2>
            É experimentando
            <br />
            que a ideia
            <br />
            <span className="text-muted">encontra forma.</span>
          </h2>
          <p>
            Prototipagem, fabricação digital e eletrônica. Um espaço de
            possibilidades para testar conceitos e aproximar o desenho da
            aplicação.
          </p>
          <Link href="/solucoes#lab" className="text-link">
            Explore o Zerith Lab <Arrow diagonal />
          </Link>
          <span className="image-caption">
            Ilustração conceitual de fabricação em camadas.
          </span>
        </div>
      </section>
      <LatestPosts />
      <ContactBand />
    </>
  );
}
