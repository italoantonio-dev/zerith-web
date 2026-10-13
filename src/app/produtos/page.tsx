import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CoreArt } from "@/components/core-art";
import { Arrow } from "@/components/icons";
import { ContactBand } from "@/components/footer";
export const metadata: Metadata = { title: "Produtos" };
export default function ProductsPage() {
  return (
    <>
      <PageIntro
        label="Produtos"
        title="Ideias da Zerith."
        accent="Aplicações para o mundo real."
        description="Além dos serviços, desenvolvemos produtos próprios. Conheça o que está em construção."
      />
      <section className="product-feature container">
        <div>
          <span className="status-pill">
            <span /> EM DESENVOLVIMENTO
          </span>
          <h2>Zerith Fleet</h2>
          <p>
            Inteligência operacional para frotas. Nosso primeiro produto próprio
            está em desenvolvimento.
          </p>
          <Link href="/produtos/fleet" className="button button-primary">
            Conhecer o projeto <Arrow />
          </Link>
        </div>
        <CoreArt compact />
      </section>
      <ContactBand />
    </>
  );
}
