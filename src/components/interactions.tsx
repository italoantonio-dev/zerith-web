"use client";
import { useEffect, useRef, useState } from "react";
import { steps, contactEmail, solutions } from "@/lib/content";
import { Arrow, Icon } from "./icons";

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
      element.style.setProperty(
        "--hero-progress",
        reduce.matches ? "0" : String(p),
      );
    };
    const scroll = () => {
      if (!frame && !reduce.matches) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    reduce.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      reduce.removeEventListener("change", update);
    };
  }, []);
  return (
    <div ref={ref} className="hero-motion">
      {children}
    </div>
  );
}
export function Process() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="process-widget">
      <div
        className="process-tabs"
        role="tablist"
        aria-label="Etapas do projeto"
      >
        {steps.map((step, i) => (
          <button
            key={step.title}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={`step-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let next = active;
              if (e.key === "ArrowRight") next = (active + 1) % 4;
              else if (e.key === "ArrowLeft") next = (active + 3) % 4;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 3;
              else return;
              e.preventDefault();
              setActive(next);
              buttons.current[next]?.focus();
            }}
          >
            <span className="step-number">0{i + 1}</span>
            <span>{step.title}</span>
            <Arrow />
          </button>
        ))}
      </div>
      {steps.map((step, i) => (
        <div
          key={step.title}
          hidden={i !== active}
          id={`panel-${i}`}
          role="tabpanel"
          aria-labelledby={`step-${i}`}
          tabIndex={0}
          className="process-panel"
        >
          <div className="process-symbol" aria-hidden="true">
            <span />
            <span />
            <span />
            <b>0{i + 1}</b>
          </div>
          <div>
            <span className="eyebrow">{step.label}</span>
            <h3>{step.subtitle}</h3>
            <p>{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const [emailLink, setEmailLink] = useState("");
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const body = `Olá, Zerith!\n\nMeu nome é ${data.get("name")}.\nMeu e-mail: ${data.get("email")}\nÁrea de interesse: ${data.get("area")}\n\n${data.get("message")}\n`;
        const href = `mailto:${contactEmail}?subject=${encodeURIComponent(`Novo projeto: ${data.get("area")}`)}&body=${encodeURIComponent(body)}`;
        setEmailLink(href);
        setPrepared(true);
        window.location.href = href;
      }}
    >
      <div className="form-row">
        <label>
          Seu nome
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Como podemos chamar você?"
          />
        </label>
        <label>
          Seu e-mail
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder="voce@exemplo.com"
          />
        </label>
      </div>
      <label htmlFor="contact-area">O que você tem em mente?</label>
      <select
        id="contact-area"
        name="area"
        defaultValue="Ainda quero entender as possibilidades"
      >
        <option>Ainda quero entender as possibilidades</option>
        {solutions.map((s) => (
          <option key={s.id}>Zerith {s.name}</option>
        ))}
        <option>Zerith Fleet</option>
      </select>
      <label>
        Conte um pouco sobre sua ideia
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2500}
          rows={5}
          placeholder="Qual desafio você quer resolver?"
        />
      </label>
      <p className="form-note">
        Ao continuar, seu aplicativo de e-mail será aberto com a mensagem pronta
        para você revisar e enviar. Os dados deste formulário não são salvos
        pelo site.
      </p>
      <button className="button button-primary" type="submit">
        Preparar e-mail <Arrow diagonal />
      </button>
      {prepared && (
        <div className="form-result" role="status">
          <Icon name="check" />
          <div>
            <strong>Mensagem preparada.</strong>
            <p>
              Conclua o envio no seu aplicativo de e-mail. Se ele não abriu,{" "}
              <a href={emailLink}>tente abrir novamente</a> ou escreva para{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
