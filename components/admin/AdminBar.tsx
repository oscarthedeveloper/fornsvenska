"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "./AdminContext";
import {
  FORMATERINGSHANDELSE,
  MARKERINGSFARGER,
  type Formateringskommando,
} from "@/lib/markeringar";

const TEXT: Record<string, string> = {
  vilande: "",
  sparar: "Sparar …",
  sparat: "Sparat",
  fel: "Kunde inte spara",
};

/** Fast list längst ned till höger. Syns bara för inloggad administratör. */
export default function AdminBar({
  anvandarnamn: propsAnvandarnamn,
}: {
  anvandarnamn?: string | null;
} = {}) {
  const {
    arAdmin,
    anvandarnamn: kontextAnvandarnamn,
    redigerar,
    setRedigerar,
    status,
    felmeddelande,
    sparadRevision,
    publiceradRevision,
    harOpubliceradeAndringar,
    forhandsgranskning,
    setForhandsgranskning,
    konfliktVarning,
    setKonfliktVarning,
  } = useAdmin();
  const anvandarnamn = propsAnvandarnamn ?? kontextAnvandarnamn;
  const [formatOppen, setFormatOppen] = useState(false);

  if (!arAdmin) return null;
  if (process.env.NEXT_PUBLIC_STATIC_DELIVERY !== '0') return <aside className="adminbar fixed bottom-0 right-0 z-[100] border border-ink bg-panel p-3"><Link href="/admin">Öppna webbredaktionen</Link></aside>;

  const skicka = (kommando: Formateringskommando) => {
    document.dispatchEvent(
      new CustomEvent<Formateringskommando>(FORMATERINGSHANDELSE, {
        detail: kommando,
      })
    );
  };

  return (
    <div className="adminbar fixed bottom-0 right-0 z-[100] flex items-stretch border-t border-l border-ink bg-panel flex-wrap sm:flex-nowrap">
      {redigerar && (
        <div className="admin-format-hallare">
          <button
            type="button"
            className="admin-format-utlosare nano"
            aria-expanded={formatOppen}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setFormatOppen((oppet) => !oppet)}
          >
            <span className="admin-format-symbol" aria-hidden="true">A</span>
            Formatera
          </button>

          {formatOppen && (
            <div
              className="admin-formatpanel"
              aria-label="Textformatering"
              onMouseDown={(event) => event.preventDefault()}
            >
              <div className="admin-formatsektion">
                <span className="nano admin-formatetikett">Text</span>
                <div className="admin-formatrad">
                  <button type="button" onClick={() => skicka({ typ: "inline", format: "fet" })} aria-label="Fetstil" title="Fetstil · Ctrl/⌘ B"><strong>B</strong></button>
                  <button type="button" onClick={() => skicka({ typ: "inline", format: "kursiv" })} aria-label="Kursiv" title="Kursiv · Ctrl/⌘ I"><em>I</em></button>
                  <button type="button" onClick={() => skicka({ typ: "inline", format: "understruken" })} aria-label="Understruken" title="Understruken · Ctrl/⌘ U"><span className="underline">U</span></button>
                  <button type="button" onClick={() => skicka({ typ: "inline", format: "term" })} aria-label="Fornsvensk term" title="Fornsvensk term · Ctrl/⌘ E"><span className="font-mono">E</span></button>
                </div>
              </div>

              <div className="admin-formatsektion">
                <span className="nano admin-formatetikett">Överstrykning</span>
                <div className="admin-markeringsrad">
                  {MARKERINGSFARGER.map((farg) => (
                    <button
                      key={farg.id}
                      type="button"
                      className="admin-markeringsknapp"
                      data-highlight={farg.id}
                      aria-label={`Överstryk med ${farg.namn.toLowerCase()}`}
                      title={`${farg.namn} markering · samma färg igen tar bort`}
                      onClick={() => skicka({ typ: "markering", farg: farg.id })}
                    >
                      <span aria-hidden="true" />
                    </button>
                  ))}
                  <button
                    type="button"
                    className="admin-markeringsknapp admin-markering-ta-bort"
                    aria-label="Ta bort överstrykning"
                    title="Ta bort överstrykning"
                    onClick={() => skicka({ typ: "markering", farg: 0 })}
                  >
                    ×
                  </button>
                </div>
              </div>

              <p className="nano admin-formathjalp">
                Markera texten först, välj sedan ett format eller en färg.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Samtidighetskonflikt-varning */}
      {konfliktVarning && (
        <span
          className="nano px-3 flex items-center bg-red-600 text-paper max-w-[320px] truncate cursor-pointer"
          title={konfliktVarning}
          onClick={() => setKonfliktVarning(null)}
        >
          ⚠️ {konfliktVarning}
        </span>
      )}

      {felmeddelande && !konfliktVarning && (
        <span className="nano px-3 flex items-center bg-accent text-ink max-w-[280px] truncate">
          {felmeddelande}
        </span>
      )}

      {status !== "vilande" && !felmeddelande && (
        <span className="nano px-3 flex items-center opacity-60">{TEXT[status]}</span>
      )}

      {/* Sparad revision & publicerad revision status */}
      {sparadRevision !== null && (
        <span
          className="nano px-2.5 flex items-center border-l border-ink font-mono opacity-80"
          title={`Senast sparad revision: ${sparadRevision}${
            publiceradRevision ? ` · Publicerad revision: ${publiceradRevision}` : ""
          }`}
        >
          rev {sparadRevision}
          {publiceradRevision && publiceradRevision !== sparadRevision && (
            <span className="opacity-50 ml-1 text-[0.68rem]">(pub: {publiceradRevision})</span>
          )}
        </span>
      )}

      {harOpubliceradeAndringar && (
        <span
          className="nano px-2 flex items-center bg-amber-200 text-amber-950 font-bold border-l border-ink"
          title="Opublicerat utkast: Ändringen syns inte för publika läsare förrän webbplatsen publiceras"
        >
          Utkast
        </span>
      )}

      {/* Förhandsgranskningsväxlare */}
      <button
        type="button"
        onClick={() => setForhandsgranskning(!forhandsgranskning)}
        aria-pressed={forhandsgranskning}
        className={`nano px-3 py-2.5 border-l border-ink transition-colors hover:opacity-75 ${
          forhandsgranskning ? "bg-amber-100 font-bold text-amber-950" : "bg-panel text-ink"
        }`}
        title="Växla mellan att förhandsgranska utkast eller se den aktiva publicerade versionen"
      >
        {forhandsgranskning ? "Förhandsgranskar" : "Granska"}
      </button>

      <span className="nano px-3 flex items-center opacity-50 border-l border-ink">
        {anvandarnamn}
      </span>

      <button
        type="button"
        onClick={() => setRedigerar(!redigerar)}
        aria-pressed={redigerar}
        className={`nano px-4 py-2.5 border-l border-ink transition-opacity duration-[140ms] hover:opacity-70 ${
          redigerar ? "bg-accent text-ink" : "bg-panel text-ink"
        }`}
      >
        {redigerar ? "Redigerar" : "Redigera"}
      </button>

      <Link
        href="/admin"
        className="nano px-3 flex items-center border-l border-ink transition-opacity duration-[140ms] hover:opacity-60"
      >
        Redaktion
      </Link>
    </div>
  );
}
