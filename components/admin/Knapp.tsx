"use client";

/** Liten verktygsknapp i redigeringsläget. */
export default function Knapp({
  children,
  onClick,
  titel,
  fara,
}: {
  children: React.ReactNode;
  onClick: () => void;
  titel?: string;
  fara?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titel}
      aria-label={titel}
      className={`nano border border-ink px-1.5 py-1 leading-none transition-opacity duration-[140ms] hover:opacity-60 ${
        fara ? "bg-accent text-ink" : "bg-panel text-ink"
      }`}
    >
      {children}
    </button>
  );
}
