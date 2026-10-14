import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { CoreArt } from "@/components/core-art";
import { Arrow } from "@/components/icons";
import Image from "next/image";
import { ContactBand } from "@/components/footer";
import { listProducts } from "@/lib/products";
export const metadata: Metadata = { title: "Produtos" };
export default async function ProductsPage() {
  const catalog = await listProducts();
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
      {catalog.length > 0 && <section className="container product-catalog section-space" aria-labelledby="catalog-title"><div className="section-label"><span className="section-index">02 /</span><span>OUTROS PRODUTOS</span></div><h2 id="catalog-title">Soluções próprias em evolução.</h2><div className="solutions-grid">{catalog.map((product) => <Link key={product.id} href={product.href} className="solution-card">{product.imageAssetId && <Image className="product-card-image" src={`/media/${product.imageAssetId}`} alt="" width={640} height={360} /> }<div className="solution-card-top"><span className="status-dot" /><span>PUBLICADO</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="card-bottom"><span>Conhecer produto</span><Arrow diagonal /></div></Link>)}</div></section>}
      <ContactBand />
    </>
  );
}
