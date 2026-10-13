"use client";
export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <section className="blog-empty container">
      <h1>Não foi possível carregar os artigos.</h1>
      <p>Tente novamente em instantes.</p>
      <button className="button button-primary" onClick={reset}>
        Tentar novamente
      </button>
    </section>
  );
}
