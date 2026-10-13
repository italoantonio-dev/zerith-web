export function Status({ status }: { status: string }) {
  return (
    <span className={`post-status status-${status}`}>
      {status === "published"
        ? "Publicado"
        : status === "archived"
          ? "Arquivado"
          : "Rascunho"}
    </span>
  );
}
export function actionName(action: string) {
  const labels: Record<string, string> = {
    "admin.created": "Conta administrativa criada",
    "auth.mfa_verified": "Acesso confirmado em duas etapas",
    "post.created": "Artigo criado",
    "post.updated": "Artigo atualizado",
    "post.published": "Artigo publicado",
    "post.draft": "Artigo voltou para rascunho",
    "post.archived": "Artigo arquivado",
    "media.uploaded": "Imagem adicionada",
    "session.revoked": "Sessão encerrada",
  };
  return labels[action] || action;
}
