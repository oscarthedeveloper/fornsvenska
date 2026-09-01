"use client";

import type { Hylla as HyllaTyp, Resurs } from "@/lib/resurstyper";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import Omslag from "./Omslag";

/**
 * En hylla: rubrik, en rad resurser som står på en planka, och i
 * redigeringsläget verktygen för att döpa om, flytta och fylla på.
 *
 * Raden rullar i sidled i stället för att radbryta. Det är avsiktligt — en
 * hylla ska se ut som en hylla, inte som ett rutnät.
 */
export default function Hylla({
  hylla,
  valdId,
  redigerbar,
  onValj,
  onHylla,
  onTaBort,
  onFlytta,
  onNyResurs,
}: {
  hylla: HyllaTyp;
  valdId: string | null;
  redigerbar: boolean;
  onValj: (resurs: Resurs) => void;
  onHylla: (delar: { titel?: string; note?: string }) => void;
  onTaBort: () => void;
  onFlytta: (steg: -1 | 1) => void;
  onNyResurs: () => void;
}) {
  /* Osorterat är ingen riktig hylla utan en uppsamling — den går varken att
     döpa om eller ta bort. */
  const riktig = hylla.id !== "osorterat";

  return (
    <section className="hylla">
      <header className="hylla-topp">
        <div className="flex flex-col gap-0.5 min-w-0">
          <Redigerbar
            as="div"
            varde={hylla.titel}
            redigerbar={redigerbar && riktig}
            formatering={false}
            platshallare="Hyllans namn"
            onChange={(titel) => onHylla({ titel })}
            className="section-label"
          />
          {(hylla.note || (redigerbar && riktig)) && (
            <Redigerbar
              varde={hylla.note ?? ""}
              redigerbar={redigerbar && riktig}
              formatering={false}
              platshallare="Kort beskrivning"
              onChange={(note) => onHylla({ note })}
              className="nano opacity-50"
            />
          )}
        </div>

        {redigerbar && (
          <div className="flex gap-1.5 shrink-0">
            <Knapp titel="Lägg till resurs" onClick={onNyResurs}>
              + resurs
            </Knapp>
            {riktig && (
              <>
                <Knapp titel="Flytta hyllan uppåt" onClick={() => onFlytta(-1)}>
                  ↑
                </Knapp>
                <Knapp titel="Flytta hyllan nedåt" onClick={() => onFlytta(1)}>
                  ↓
                </Knapp>
                <Knapp titel="Ta bort hyllan" fara onClick={onTaBort}>
                  ✕
                </Knapp>
              </>
            )}
          </div>
        )}
      </header>

      <div className="hylla-plan">
        {hylla.resurser.length === 0 ? (
          <p className="nano opacity-45 py-6">
            {redigerbar
              ? "Tom hylla — lägg till din första resurs."
              : "Inget här ännu."}
          </p>
        ) : (
          <div className="hylla-rad">
            {hylla.resurser.map((resurs) => (
              <button
                key={resurs.id}
                type="button"
                className="resurskort"
                data-vald={resurs.id === valdId ? "1" : undefined}
                onClick={() => onValj(resurs)}
              >
                <Omslag resurs={resurs} />
                <span className="resurskort-titel">{resurs.titel}</span>
                <span className="resurskort-fot">
                  <span className="resurskort-forfattare">
                    {resurs.forfattare || resurs.ar || " "}
                  </span>
                  <span className="tillganglighet-skala liten" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className="tillganglighet-ruta"
                        data-fylld={n <= resurs.tillganglighet ? "1" : undefined}
                      />
                    ))}
                  </span>
                </span>
                {resurs.utkast && redigerbar && (
                  <span className="nano opacity-50">Utkast</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
