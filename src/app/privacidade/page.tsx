import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { contactEmail } from "@/lib/content";
export const metadata: Metadata = { title: "Privacidade" };
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        label="Privacidade"
        title="Transparência"
        accent="também faz parte."
        description="Como funcionam o contato, o blog e o acesso administrativo."
      />
      <article className="prose container">
        <h2>Formulário de contato</h2>
        <p>
          As informações digitadas são usadas no seu navegador para preparar um
          e-mail. O site não envia nem armazena esses campos em um banco de
          dados. O envio acontece apenas quando você confirma a mensagem no seu
          aplicativo de e-mail.
        </p>
        <h2>Mensagens enviadas por e-mail</h2>
        <p>
          Se você enviar a mensagem, ela será recebida no endereço{" "}
          {contactEmail} e poderá ser utilizada para responder ao seu contato e
          conversar sobre o projeto. O aplicativo e o provedor de e-mail possuem
          suas próprias práticas de tratamento de dados.
        </p>
        <h2>Navegação</h2>
        <p>
          Esta versão não inclui ferramentas de publicidade, análise de
          audiência ou cookies de rastreamento. O funcionamento da hospedagem e
          seus registros de acesso devem ser documentados antes da publicação
          definitiva.
        </p>
        <h2>Acesso administrativo e conteúdo</h2>
        <p>
          O painel usa cookies essenciais de autenticação. Nome, e-mail, senha
          protegida por hash, configuração de autenticação em duas etapas,
          sessões e registros de atividade ficam armazenados no banco de dados.
          Sessões podem incluir endereço IP e identificação do navegador. O
          administrador pode encerrar sessões no painel de segurança.
        </p>
        <p>
          Artigos e imagens enviados ao painel ficam armazenados no banco.
          Rascunhos e suas imagens são privados; artigos publicados, autoria e
          imagens associadas ficam disponíveis aos visitantes. Não há cadastro
          público de leitores, comentários ou newsletter nesta versão.
        </p>
        <h2>Dúvidas sobre seus dados</h2>
        <p>
          Para esclarecer dúvidas ou solicitar a exclusão de uma mensagem
          enviada, entre em contato pelo e-mail{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
        <div className="document-note">
          Este aviso descreve a instalação local atual. Antes da publicação na
          internet, serão definidos a hospedagem, os responsáveis pela operação,
          as rotinas de backup e os prazos de retenção.
        </div>
      </article>
    </>
  );
}
