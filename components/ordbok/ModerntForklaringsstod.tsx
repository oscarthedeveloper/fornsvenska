"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/AdminContext";
import type { OrdbokPost } from "@/lib/ordbok/typer";
import ModernDefinitionModal from "./ModernDefinitionModal";

export default function ModerntForklaringsstod({
  post,
}: {
  post: OrdbokPost;
}) {
  const { arAdmin, redigerar } = useAdmin();
  const [modalOppen, setModalOppen] = useState(false);
  const [arExpanderad, setArExpanderad] = useState(true);

  const def = post.modernDefinition;
  if (!def && !arAdmin && !redigerar) return null;

  const arKurerad = def?.kalla === "kurerad_redaktionell";
  const harBehorighet = arAdmin || redigerar;

  return (
    <section
      aria-label="Modernt förklaringsstöd och snabbglosor"
      className="border border-ink bg-panel p-4 sm:p-5 flex flex-col gap-3 relative"
    >
      {/* Rubrikrad med statusbrickor och kontroller */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-ink/25 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="nano font-semibold tracking-wide uppercase text-ink">
            Modernt förklaringsstöd & snabbglosa
          </span>

          {def && (
            <span
              className={`nano px-2 py-0.5 border border-ink ${
                arKurerad ? "bg-accent/20 text-ink font-semibold" : "bg-paper text-ink/75"
              }`}
              title={
                arKurerad
                  ? "Kurerad och granskad av redaktionen för Fornsvenska Studielabbet"
                  : "Automatisk läshjälp baserad på Söderwalls första definition med moderniserad 1800-talsstavning"
              }
            >
              {arKurerad ? "✓ Kurerat förklaringsstöd" : "Automatisk läshjälp"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {harBehorighet && (
            <button
              type="button"
              onClick={() => setModalOppen(true)}
              className="nano px-2 py-0.5 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors"
              title="Redigera den moderna förklaringen"
            >
              ✎ {arKurerad ? "Redigera förklaring" : "+ Skriv kurerad förklaring"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setArExpanderad((exp) => !exp)}
            className="nano text-ink/70 hover:text-ink underline ml-1"
            aria-expanded={arExpanderad}
          >
            {arExpanderad ? "Dölj" : "Visa"}
          </button>
        </div>
      </div>

      {arExpanderad && (
        <div className="flex flex-col gap-3 pt-0.5">
          {/* Moderna snabbglosor */}
          {def && def.modernGlos.length > 0 && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="nano opacity-60">Snabbglosor:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {def.modernGlos.map((glosa, idx) => (
                  <span
                    key={`${glosa}-${idx}`}
                    className="micro font-semibold border border-ink/60 bg-paper px-2 py-0.5 text-ink"
                  >
                    {glosa}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sammanfattande förklaring */}
          {def?.kortForklaring && (
            <p className="doc-body text-[0.98rem] leading-[1.6] text-ink font-serif">
              {def.kortForklaring}
            </p>
          )}

          {/* Pedagogisk not (om fornsvensk formlära eller kontext) */}
          {def?.pedagogiskNot && (
            <div className="border-l-2 border-accent bg-paper/70 px-3 py-1.5 flex flex-col gap-0.5">
              <span className="nano font-semibold opacity-70">Pedagogisk formnot</span>
              <p className="text-[0.74rem] leading-[1.5] font-mono text-ink/90">
                {def.pedagogiskNot}
              </p>
            </div>
          )}

          {/* Källpolicy- och transparensdeklaration */}
          <div className="pt-2 border-t border-ink/15 flex items-center justify-between gap-2 text-[0.62rem] opacity-60 flex-wrap">
            <span>
              Pedagogiskt orienteringsstöd på modern svenska. Söderwalls fullständiga historiska
              ordbokstext återges oförändrad i källavsnitten nedan.
            </span>
            {def?.uppdaterad && (
              <span>Uppdaterad: {new Date(def.uppdaterad).toLocaleDateString("sv-SE")}</span>
            )}
          </div>
        </div>
      )}

      <ModernDefinitionModal
        post={post}
        befintligDefinition={def}
        arOppen={modalOppen}
        onStang={() => setModalOppen(false)}
      />
    </section>
  );
}
