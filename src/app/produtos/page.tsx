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
  const fleet = { id: "fleet", name: "Zerith Fleet", description: "Inteligência operacional para frotas. Nosso primeiro produto próprio está em desenvolvimento.", href: "/produtos/fleet", imageAssetId: null as string | null };
  const featured = [fleet, ...catalog.filter((product) => product.slug !== "zerith-fleet")];
  return (
    <>
      <PageIntro
        label="Produtos"
        title="Ideias da Zerith."
        accent="Aplicações para o mundo real."
        description="Além dos serviços, desenvolvemos produtos próprios. Conheça o que está em construção."
      />
      <section className="product-catalog container section-space" aria-labelledby="catalog-title"><div className="section-label"><span className="section-index">02 /</span><span>PRODUTOS PRÓPRIOS</span></div><h2 id="catalog-title">Soluções próprias em evolução.</h2>{featured.map((product) => <article className="product-feature product-feature--catalog" key={product.id}><div><span className="status-pill"><span /> EM DESENVOLVIMENTO</span><h2>{product.name}</h2><p>{product.description}</p><Link href={product.href} className="button button-primary">Conhecer o projeto <Arrow /></Link></div>{product.imageAssetId ? <Image className="product-feature-image" src={`/media/${product.imageAssetId}`} alt={`Imagem de ${product.name}`} width={640} height={400} /> : <CoreArt compact />}</article>)}</section>
      <ContactBand />
    </>
  );
}
