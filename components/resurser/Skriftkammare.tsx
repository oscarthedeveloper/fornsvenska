"use client";

import type { Resurs } from "@/lib/resurstyper";
import Knapp from "@/components/admin/Knapp";

/**
 * Skriftkammaren.
 *
 * Lagar, brev och diplom har inga omslag att visa upp, och skulle bli tomma
 * rutor på en hylla. De får därför en egen avdelning där kortet ser ut som
 * det de är: ett dokument, med datering och handskrift i stället för
 * bokrygg. Läsaren fälls ut i sidan när man öppnar ett av dem.
 */
export default function Skriftkammare({
  skrifter,
  valdId,
  oppenId,
  redigerbar,
  onValj,
  onLas,
  onNy,
}: {
  skrifter: Resurs[];
  valdId: string | null;
  oppenId: string | null;
  redigerbar: boolean;
  onValj: (resurs: Resurs) => void;
  onLas: (resurs: Resurs) => void;
  onNy: () => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <header className="hylla-topp">
        <div className="flex flex-col gap-0.5">
          <span className="section-label">Skriftkammaren</span>
          <span className="nano opacity-50">
            Lagar, brev och diplom — läses i sidan, version för version
          </span>
        </div>
        {redigerbar && (
          <Knapp titel="Lägg till skrift" onClick={onNy}>
            + skrift
          </Knapp>
        )}
      </header>

      {skrifter.length === 0 ? (
        <p className="nano opacity-45 py-4">
          {redigerbar
            ? "Ingen skrift ännu — lägg till den första."
            : "Inga skrifter är inlagda ännu."}
        </p>
      ) : (
        <div className="skriftrutnat">
          {skrifter.map((skrift) => (
            <article
              key={skrift.id}
              className="skriftkort"
              data-vald={skrift.id === valdId ? "1" : undefined}
              data-oppen={skrift.id === oppenId ? "1" : undefined}
            >
              <button
                type="button"
                className="skriftkort-yta"
                onClick={() => onValj(skrift)}
              >
                <span className="skriftkort-horn" aria-hidden="true" />
                <span className="nano opacity-50">
                  {skrift.ar || "Odaterad"}
                </span>
                <span className="display skriftkort-titel">{skrift.titel}</span>
                <span className="nano opacity-55">
                  {skrift.utgivare || "Handskrift okänd"}
                </span>
                <span className="nano opacity-45">
                  {skrift.bok
                    ? `${skrift.bok.sidor} sidor · fulltext`
                    : skrift.versioner.length === 0
                    ? "Ingen text ännu"
                    : `${skrift.versioner.length} ${
                        skrift.versioner.length === 1 ? "version" : "versioner"
                      }`}
                </span>
              </button>

              <button
                type="button"
                className="skriftkort-las micro"
                onClick={() => onLas(skrift)}
              >
                {skrift.bok
                  ? "Öppna bokvyn"
                  : skrift.id === oppenId
                    ? "Stäng läsaren"
                    : "Läs i sidan"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
