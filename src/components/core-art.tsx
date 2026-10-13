export function CoreArt({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`core-art ${compact ? "core-art--compact" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 720 680" fill="none" className="core-svg" role="img" aria-label="Diagrama de operação com fluxo de dados e indicadores">
        <rect x="60" y="70" width="600" height="520" rx="4" fill="#0d1a2b" stroke="#2a3a52" />
        <path d="M60 164h600M60 260h600M60 356h600M60 452h600M180 70v520M330 70v520M480 70v520" stroke="#2a3a52" strokeOpacity=".55" />
        <path d="M91 448 175 394l72 28 92-118 77 46 112-120" stroke="#76b5ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M91 448 175 394l72 28 92-118 77 46 112-120" stroke="#2563eb" strokeOpacity=".25" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        {[91,175,247,339,416,528].map((x, i) => <circle key={x} cx={x} cy={[448,394,422,304,350,230][i]} r="6" fill="#08111f" stroke="#9ac8ff" strokeWidth="2" />)}
        <rect x="88" y="101" width="118" height="38" rx="3" fill="#16263d" />
        <text x="104" y="118" fill="#aab9cc" fontSize="10" fontFamily="Sora, sans-serif">OPERAÇÃO</text>
        <text x="104" y="132" fill="#f1f5fa" fontSize="14" fontFamily="Sora, sans-serif">em leitura</text>
        <rect x="506" y="101" width="120" height="38" rx="3" fill="#16263d" />
        <text x="522" y="118" fill="#aab9cc" fontSize="10" fontFamily="Sora, sans-serif">FLUXO</text>
        <text x="522" y="132" fill="#8dd9b5" fontSize="14" fontFamily="Sora, sans-serif">estável</text>
        <text x="86" y="548" fill="#7f9cbf" fontSize="10" letterSpacing="1.5" fontFamily="monospace">PROCESSO / DADOS / DECISÃO</text>
        <text x="512" y="548" fill="#7f9cbf" fontSize="10" letterSpacing="1.5" fontFamily="monospace">ZERITH / 01</text>
      </svg>
    </div>
  );
}
