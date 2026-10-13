import Link from "next/link";
import { Arrow } from "@/components/icons";
export default function NotFound() {
  return (
    <section className="not-found container">
      <span className="eyebrow">ERRO 404 / FORA DO PERCURSO</span>
      <h1>
        Esse caminho
        <br />
        ainda não existe.
      </h1>
      <p>A página pode ter mudado ou ainda não ter sido publicada.</p>
      <Link href="/" className="button button-primary">
        Voltar ao início <Arrow />
      </Link>
    </section>
  );
}
