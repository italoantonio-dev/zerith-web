"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <section className="admin-auth-page">
      <h1>Não foi possível carregar o painel.</h1>
      <p>Confira se o banco de dados está em execução e tente novamente.</p>
      <button className="button button-primary" onClick={reset}>
        Tentar novamente
      </button>
    </section>
  );
}
