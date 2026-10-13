import type { CSSProperties } from "react";
export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}
export function Icon({ name, style }: { name: string; style?: CSSProperties }) {
  const paths: Record<string, React.ReactNode> = {
    cube: (
      <>
        <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z M3 8l9 5 9-5M12 13v9M7.5 5.5l9 5" />
      </>
    ),
    signal: (
      <>
        <path d="M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M8 17a5 5 0 0 1 8 0" />
        <circle cx="12" cy="21" r=".7" fill="currentColor" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v18h17M8 16v-5M13 16V7M18 16V4" />
        <path d="m7 6 4-3" />
      </>
    ),
    code: (
      <>
        <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />
      </>
    ),
    growth: (
      <>
        <path d="M3 20V4m0 16h18M7 15l5-5 4 2 5-8m-6 0h6v6" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    route: (
      <>
        <circle cx="6" cy="5" r="2" />
        <circle cx="18" cy="19" r="2" />
        <path d="M8 5h7a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h7" />
      </>
    ),
  };
  return (
    <svg
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.cube}
    </svg>
  );
}
export function Mark() {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 8h25L15 26h16v6H6l18-18H8V8Z" fill="currentColor" />
      <path d="m6 8 5-5h23l-5 5H6Z" fill="#60A5FA" />
    </svg>
  );
}
