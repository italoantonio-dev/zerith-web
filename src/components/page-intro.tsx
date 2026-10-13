import Link from "next/link";
export function PageIntro({
  label,
  title,
  accent,
  description,
}: {
  label: string;
  title: string;
  accent?: string;
  description: string;
}) {
  return (
    <section className="page-intro container">
      <div className="breadcrumbs">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>{label}</span>
      </div>
      <span className="eyebrow">UNIVERSO ZERITH / {label.toUpperCase()}</span>
      <h1>
        {title}
        {accent && (
          <>
            <br />
            <span className="text-muted">{accent}</span>
          </>
        )}
      </h1>
      <p>{description}</p>
    </section>
  );
}
