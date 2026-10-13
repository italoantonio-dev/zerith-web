import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Icon, Arrow } from "@/components/icons";
export const metadata: Metadata = { title: "Zerith Fleet" };
export default function FleetPage() {
  return (
    <>
      <PageIntro
        label="Zerith Fleet"
        title="Inteligência"
        accent="para a operação em movimento."
        description="O Zerith Fleet é o software próprio de inteligência operacional para frotas da Zerith Technologies."
      />
      <section className="fleet-detail container">
        <div className="fleet-detail-icon">
          <Icon name="route" />
        </div>
        <div>
          <span className="status-pill">
            <span /> EM DESENVOLVIMENTO
          </span>
          <h2>
            Todo produto começa
            <br />
            com um desafio real.
          </h2>
          <p>
            O Fleet está em fase de desenvolvimento. Funcionalidades,
            disponibilidade e condições comerciais serão apresentadas quando
            estiverem definidas.
          </p>
          <p>
            Se esse tema faz parte da sua rotina, queremos entender seus
            desafios. Uma conversa agora pode ajudar a aproximar o produto da
            operação real.
          </p>
          <Link href="/contato" className="button button-primary">
            Conversar sobre o Fleet <Arrow diagonal />
          </Link>
        </div>
      </section>
    </>
  );
}
