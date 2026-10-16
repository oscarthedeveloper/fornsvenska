"use client";

import { TILLGANGLIGHET } from "@/lib/resurstyper";

/**
 * Tillgänglighet i fem steg — hur lätt materialet är att komma åt, inte hur
 * bra det är. Fyllda rutor och en textrad: färgen ensam bär aldrig
 * informationen.
 */
export default function Tillganglighet({
  varde,
  redigerbar = false,
  onChange,
}: {
  varde: number;
  redigerbar?: boolean;
  onChange?: (n: number) => void;
}) {
  if (!varde && !redigerbar) return <span className="tillganglighet-text">Tillgänglighet ej bedömd</span>;

  const niva = Math.min(5, Math.max(1, varde || 3));

  return (
    <span className="tillganglighet">
      <span className="tillganglighet-skala" role={redigerbar ? "group" : undefined}>
        {[1, 2, 3, 4, 5].map((n) =>
          redigerbar ? (
            <button
              key={n}
              type="button"
              className="tillganglighet-ruta"
              data-fylld={n <= niva ? "1" : undefined}
              title={`${n}/5 — ${TILLGANGLIGHET[n - 1]}`}
              aria-label={`${n} av 5 — ${TILLGANGLIGHET[n - 1]}`}
              onClick={() => onChange?.(n)}
            />
          ) : (
            <span
              key={n}
              className="tillganglighet-ruta"
              data-fylld={n <= niva ? "1" : undefined}
              aria-hidden="true"
            />
          )
        )}
      </span>
      <span className="tillganglighet-text">{TILLGANGLIGHET[niva - 1]}</span>
    </span>
  );
}
