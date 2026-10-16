"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BOKMARKEN_HANDELSE,
  exporteraSparadeOrd,
  hamtaSparadeOrd,
  laddaNerFil,
  rensaAllaSparadeOrd,
  taBortSparatOrd,
  uppdateraAnteckning,
  type SparatOrdbokOrd,
} from "@/lib/ordbok/bokmarken";
import { formatOrdklassLista } from "./ordklasser";

export default function BokmarkenPanel({
  oppen,
  onStang,
}: {
  oppen: boolean;
  onStang: () => void;
}) {
  const [sparadeOrd, setSparadeOrd] = useState<SparatOrdbokOrd[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterKategori, setFilterKategori] = useState<"alla" | "texter" | "soederwall" | "soederwall-supp">("alla");
  const [bekraftaRensa, setBekraftaRensa] = useState(false);
  const [aktivAnteckningId, setAktivAnteckningId] = useState<string | null>(null);
  const [anteckningVarde, setAnteckningVarde] = useState("");

  const laddaOm = () => {
    setSparadeOrd(hamtaSparadeOrd());
  };

  useEffect(() => {
    laddaOm();
    window.addEventListener(BOKMARKEN_HANDELSE, laddaOm);
    return () => window.removeEventListener(BOKMARKEN_HANDELSE, laddaOm);
  }, []);

  useEffect(() => {
    if (!oppen) {
      setBekraftaRensa(false);
      setAktivAnteckningId(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStang();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [oppen, onStang]);

  if (!oppen) return null;

  const filtrerade = sparadeOrd.filter((p) => {
    if (filterKategori === "texter" && !p.kallText) return false;
    if (filterKategori === "soederwall" && p.sourceDataset !== "soederwall") return false;
    if (filterKategori === "soederwall-supp" && p.sourceDataset !== "soederwall-supp") return false;

    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      p.headwordDisplay.toLowerCase().includes(q) ||
      p.snippet.toLowerCase().includes(q) ||
      (p.anteckning && p.anteckning.toLowerCase().includes(q)) ||
      (p.kallText?.ord && p.kallText.ord.toLowerCase().includes(q)) ||
      (p.kallText?.meningFsv && p.kallText.meningFsv.toLowerCase().includes(q))
    );
  });

  const hanteraExport = (format: "anki" | "csv" | "text" | "json") => {
    if (sparadeOrd.length === 0) return;
    const { data, mimeType, filnamn } = exporteraSparadeOrd(sparadeOrd, format);
    laddaNerFil(data, mimeType, filnamn);
  };

  const startaRedigeraAnteckning = (p: SparatOrdbokOrd) => {
    setAktivAnteckningId(p.id);
    setAnteckningVarde(p.anteckning ?? "");
  };

  const sparaAnteckning = (id: string) => {
    uppdateraAnteckning(id, anteckningVarde);
    setAktivAnteckningId(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Min personliga ordlista"
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/40 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onStang();
      }}
    >
      <div className="w-full sm:w-[540px] lg:w-[620px] bg-panel border-l border-ink h-full flex flex-col shadow-2xl">
        {/* Panelens topplist */}
        <header className="px-4 py-3 bg-ink text-paper flex items-center justify-between gap-3 border-b border-ink shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-accent text-[1.1rem] leading-none" aria-hidden="true">
              ★
            </span>
            <span className="nano tracking-[0.12em] font-medium truncate">
              MIN PERSONLIGA ORDLISTA
            </span>
            <span className="nano px-1.5 py-0.2 border border-paper/40 shrink-0">
              {sparadeOrd.length} {sparadeOrd.length === 1 ? "ord" : "ord"}
            </span>
          </div>

          <button
            type="button"
            onClick={onStang}
            className="nano px-2 py-1 border border-paper/40 hover:bg-accent hover:text-ink hover:border-accent transition-colors"
          >
            Stäng [Esc] ✕
          </button>
        </header>

        {/* Verktygsrad: Sök, filter och export */}
        <div className="p-4 bg-paper border-b border-ink flex flex-col gap-3 shrink-0">
          {/* Sökfilter */}
          <div className="flex gap-2 items-center">
            <input
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrera bland sparade ord eller anteckningar…"
              className="flex-1 min-w-0 border border-ink bg-panel px-3 py-1.5 text-[0.82rem] focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {filterText && (
              <button
                type="button"
                onClick={() => setFilterText("")}
                className="nano px-2 py-1.5 border border-ink bg-panel hover:bg-paper"
              >
                Rensa
              </button>
            )}
          </div>

          {/* Källfilter & exportknappar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  { id: "alla", label: "Alla" },
                  { id: "texter", label: "Från texter" },
                  { id: "soederwall", label: "Huvudverk" },
                  { id: "soederwall-supp", label: "Supplement" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterKategori(f.id)}
                  className={`nano px-2 py-0.5 border border-ink transition-colors ${
                    filterKategori === f.id
                      ? "bg-ink text-paper"
                      : "bg-panel text-ink hover:bg-paper"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Exportknappar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="nano opacity-55">Exportera:</span>
              <button
                type="button"
                onClick={() => hanteraExport("anki")}
                disabled={sparadeOrd.length === 0}
                title="Ladda ner Anki flashcards (.txt) med framsida, baksida och kontextmeningar"
                className="nano px-2 py-0.5 border border-ink bg-panel hover:bg-ink hover:text-paper disabled:opacity-40 transition-colors"
              >
                Anki ⚡
              </button>
              <button
                type="button"
                onClick={() => hanteraExport("csv")}
                disabled={sparadeOrd.length === 0}
                title="Ladda ner Excel/CSV-fil"
                className="nano px-2 py-0.5 border border-ink bg-panel hover:bg-ink hover:text-paper disabled:opacity-40 transition-colors"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => hanteraExport("text")}
                disabled={sparadeOrd.length === 0}
                title="Ladda ner formaterad textfil"
                className="nano px-2 py-0.5 border border-ink bg-panel hover:bg-ink hover:text-paper disabled:opacity-40 transition-colors"
              >
                Text
              </button>
            </div>
          </div>
        </div>

        {/* Sparad ordlista */}
        <div className="flex-1 overflow-y-auto divide-y divide-ink/20">
          {sparadeOrd.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <span className="text-3xl text-ink/30" aria-hidden="true">
                ☆
              </span>
              <p className="doc-body text-[1.05rem]">Din personliga ordlista är tom ännu.</p>
              <p className="text-[0.66rem] leading-[1.6] opacity-70 max-w-[42ch]">
                Klicka på <strong>★ Spara ord</strong> i en artikel i ordboken eller i
                klicka-på-ord-panelen i lästexterna för att samla ord du vill repetera.
              </p>
            </div>
          ) : filtrerade.length === 0 ? (
            <div className="p-8 text-center">
              <p className="doc-body text-[0.95rem] opacity-70">
                Inga sparade ord matchade filtret »{filterText}».
              </p>
            </div>
          ) : (
            filtrerade.map((post) => {
              const arRedigerar = aktivAnteckningId === post.id;
              const kallaLabel =
                post.sourceDataset === "soederwall" ? "Huvudverket" : "Supplementet";

              return (
                <article key={post.id} className="p-4 flex flex-col gap-2.5 bg-panel hover:bg-paper/40 transition-colors">
                  {/* Överrad med uppslagsord, källmärke och ta-bort */}
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                      <Link
                        href={`/ordbok/${encodeURIComponent(post.id)}`}
                        onClick={onStang}
                        className="display text-[1.3rem] leading-tight font-medium hover:underline decoration-accent underline-offset-4"
                      >
                        {post.headwordDisplay}
                      </Link>
                      {post.homonymNumber && (
                        <span className="nano border border-ink px-1 py-0.2">
                          {post.homonymNumber}
                        </span>
                      )}
                      {post.gramOriginal && (
                        <span className="doc-body italic text-[0.88rem] opacity-75">
                          {post.gramOriginal}
                        </span>
                      )}
                      {post.partOfSpeech.length > 0 && (
                        <span className="nano opacity-55">
                          [{formatOrdklassLista(post.partOfSpeech)}]
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="nano px-1.5 py-0.2 border border-ink/40 opacity-70">
                        {kallaLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => taBortSparatOrd(post.id)}
                        title={`Ta bort »${post.headwordDisplay}» ur ordlistan`}
                        className="nano border border-ink px-1.5 py-0.5 hover:bg-accent hover:text-ink transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Källtext-kontext (om sparad från /texter) */}
                  {post.kallText && (
                    <div className="border-l-2 border-accent pl-2.5 py-0.5 bg-paper/60 text-[0.62rem] leading-[1.5]">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="nano font-semibold">Sparad från lästext:</span>
                        <span className="font-semibold">{post.kallText.ord}</span>
                        {post.kallText.titel && (
                          <span className="opacity-60">({post.kallText.titel})</span>
                        )}
                      </div>
                      {post.kallText.meningFsv && (
                        <div className="italic opacity-80 mt-0.5">
                          »{post.kallText.meningFsv}«
                        </div>
                      )}
                      {post.kallText.meningTolkning && (
                        <div className="opacity-65 mt-0.5">
                          {post.kallText.meningTolkning}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Definition / Utdrag */}
                  {post.snippet && (
                    <p className="doc-body text-[0.9rem] leading-[1.5] opacity-80 line-clamp-3">
                      {post.snippet}
                    </p>
                  )}

                  {/* Personlig studieanteckning */}
                  <div className="pt-1">
                    {arRedigerar ? (
                      <div className="flex flex-col gap-1.5 bg-paper p-2.5 border border-ink">
                        <label className="nano opacity-65" htmlFor={`not-${post.id}`}>
                          Studieanteckning för »{post.headwordDisplay}»:
                        </label>
                        <textarea
                          id={`not-${post.id}`}
                          rows={2}
                          value={anteckningVarde}
                          onChange={(e) => setAnteckningVarde(e.target.value)}
                          placeholder="T.ex. böjning, minnesregel eller översättning…"
                          className="w-full p-2 border border-ink bg-panel text-[0.8rem] focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setAktivAnteckningId(null)}
                            className="nano px-2 py-1 border border-ink bg-panel hover:bg-paper"
                          >
                            Avbryt
                          </button>
                          <button
                            type="button"
                            onClick={() => sparaAnteckning(post.id)}
                            className="nano px-2.5 py-1 border border-ink bg-ink text-paper hover:bg-accent hover:text-ink transition-colors"
                          >
                            Spara anteckning
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between gap-2">
                        {post.anteckning ? (
                          <div
                            onClick={() => startaRedigeraAnteckning(post)}
                            className="text-[0.68rem] leading-[1.45] bg-paper px-2 py-1 border border-ink/40 cursor-pointer hover:border-ink flex-1"
                          >
                            <span className="nano font-semibold opacity-60 mr-1.5">Not:</span>
                            <span>{post.anteckning}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startaRedigeraAnteckning(post)}
                            className="nano opacity-60 hover:opacity-100 underline decoration-dotted underline-offset-4"
                          >
                            + Skriv egen studieanteckning
                          </button>
                        )}
                        <span className="nano opacity-40 shrink-0">
                          {post.sparadDatum.slice(0, 10)}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Panelens fot */}
        {sparadeOrd.length > 0 && (
          <footer className="px-4 py-2.5 bg-paper border-t border-ink flex items-center justify-between gap-3 shrink-0">
            {bekraftaRensa ? (
              <div className="flex items-center gap-2">
                <span className="nano text-accent">Rensa alla {sparadeOrd.length} ord?</span>
                <button
                  type="button"
                  onClick={() => {
                    rensaAllaSparadeOrd();
                    setBekraftaRensa(false);
                  }}
                  className="nano px-2 py-0.5 border border-accent bg-accent text-ink font-semibold"
                >
                  Ja, rensa
                </button>
                <button
                  type="button"
                  onClick={() => setBekraftaRensa(false)}
                  className="nano px-2 py-0.5 border border-ink bg-panel"
                >
                  Avbryt
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setBekraftaRensa(true)}
                className="nano opacity-50 hover:opacity-100 hover:text-accent transition-colors"
              >
                Rensa hela ordlistan
              </button>
            )}

            <span className="nano opacity-50">
              Lagras lokalt i din webbläsare
            </span>
          </footer>
        )}
      </div>
    </div>
  );
}
