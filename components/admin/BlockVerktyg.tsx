"use client";

import Knapp from "./Knapp";

/** Hållare runt ett block: verktygen tonas fram när man är i närheten. */
export function BlockHallare({
  children,
  redigerbar,
  onUpp,
  onNed,
  onTaBort,
}: {
  children: React.ReactNode;
  redigerbar: boolean;
  onUpp: () => void;
  onNed: () => void;
  onTaBort: () => void;
}) {
  if (!redigerbar) return <>{children}</>;

  return (
    <div className="block-hallare relative">
      <div className="block-verktyg absolute -left-2 -translate-x-full top-0 hidden lg:flex flex-col gap-1">
        <Knapp titel="Flytta upp" onClick={onUpp}>
          ↑
        </Knapp>
        <Knapp titel="Flytta ned" onClick={onNed}>
          ↓
        </Knapp>
        <Knapp titel="Ta bort blocket" fara onClick={onTaBort}>
          ✕
        </Knapp>
      </div>

      <div className="block-verktyg flex lg:hidden gap-1 mb-1">
        <Knapp titel="Flytta upp" onClick={onUpp}>
          ↑
        </Knapp>
        <Knapp titel="Flytta ned" onClick={onNed}>
          ↓
        </Knapp>
        <Knapp titel="Ta bort blocket" fara onClick={onTaBort}>
          ✕
        </Knapp>
      </div>

      {children}
    </div>
  );
}

/** Tunn rad mellan blocken där nya block kan skjutas in. */
export function Infogningsrad({
  val,
  onValj,
  alltidSynlig = false,
}: {
  val: { etikett: string; skapa: () => unknown }[];
  onValj: (skapa: () => unknown) => void;
  /** I en tom flik finns inget att hovra över — då får raden synas. */
  alltidSynlig?: boolean;
}) {
  return (
    <div className="infogningsrad" data-synlig={alltidSynlig ? "1" : undefined}>
      <div>
        {val.map((v) => (
          <Knapp key={v.etikett} titel={`Lägg till ${v.etikett}`} onClick={() => onValj(v.skapa)}>
            + {v.etikett}
          </Knapp>
        ))}
      </div>
    </div>
  );
}
