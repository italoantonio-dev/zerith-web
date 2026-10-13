import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { ContactForm } from "@/components/interactions";
import { Icon, Arrow } from "@/components/icons";
import { contactEmail } from "@/lib/content";
export const metadata: Metadata = { title: "Contato" };
export default function ContactPage() {
  return (
    <>
      <PageIntro
        label="Contato"
        title="Toda construção"
        accent="começa com uma conversa."
        description="Conte sua ideia, compartilhe um desafio ou tire uma dúvida. Vamos entender juntos o próximo passo."
      />
      <section className="contact-layout container">
        <aside>
          <span className="eyebrow">FALE DIRETAMENTE</span>
          <a className="contact-email" href={`mailto:${contactEmail}`}>
            <Icon name="mail" />
            {contactEmail}
            <Arrow diagonal />
          </a>
          <div className="contact-location">
            <Icon name="pin" />
            <div>
              <strong>Patrocínio, Minas Gerais</strong>
              <span>A origem da Zerith.</span>
            </div>
          </div>
          <div className="contact-aside-note">
            <span className="tiny-cross">+</span>
            <p>
              Ainda não sabe qual área atende sua ideia? Tudo bem. Comece pelo
              desafio.
            </p>
          </div>
          <Link href="/privacidade" className="text-link">
            Sobre seus dados <Arrow diagonal />
          </Link>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
