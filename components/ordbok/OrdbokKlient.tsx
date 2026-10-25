"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type {
  OrdbokBokstavsStatistik,
  OrdbokKallfilter,
  OrdbokPost,
  OrdbokSoklage,
  OrdbokSokResultat,
} from "@/lib/ordbok/typer";
import OrdbokArtikelVy from "./OrdbokArtikelVy";
import OrdbokKallochKvalitetsruta from "./OrdbokKallochKvalitetsruta";
import { MATCHTYP_ETIKETTER, ORDKLASS_ETIKETTER } from "./ordklasser";
import BokmarkeKnapp from "./BokmarkeKnapp";
import BokmarkenTrigger from "./BokmarkenTrigger";
import { byggOrdbokQueryString } from "@/lib/ordbok/url";

const TECKEN_KNAPPAR = [
  { char: "þ", label: "þ (thorn)" },
  { char: "æ", label: "æ" },
  { char: "ø", label: "ø" },
  { char: "ä", label: "ä" },
  { char: "ö", label: "ö" },
  { char: "å", label: "å" },
];

export default function OrdbokKlient({
  sokResultat,
  bokstavsStatistik,
  valdPost,
  relaterade,
  mobilVisarArtikel,
}: {
  sokResultat: OrdbokSokResultat;
  bokstavsStatistik: OrdbokBokstavsStatistik[];
  valdPost: OrdbokPost | null;
  relaterade: {
    sammaUppslagsordHuvudverk: {
      id: string;
      headwordDisplay: string;
      homonymNumber?: number;
      gramOriginal?: string;
      partOfSpeech: string[];
    }[];
    sammaUppslagsordSupplement: {
      id: string;
      headwordDisplay: string;
      homonymNumber?: number;
      gramOriginal?: string;
      partOfSpeech: string[];
    }[];
    grannarISektion: {
      prev: { id: string; headwordDisplay: string; homonymNumber?: number } | null;
      next: { id: string; headwordDisplay: string; homonymNumber?: number } | null;
    };
  } | null;
  mobilVisarArtikel: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sokText, setSokText] = useState(sokResultat.query);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const artikelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSokText(sokResultat.query);
  }, [sokResultat.query]);

  const navigera = (nya: {
    q?: string;
    mode?: OrdbokSoklage;
    letter?: string | null;
    dataset?: OrdbokKallfilter;
    page?: number;
    entry?: string | null;
  }) => {
    const qs = byggOrdbokQueryString({
      q: nya.q !== undefined ? nya.q : sokResultat.query,
      mode: nya.mode !== undefined ? nya.mode : sokResultat.mode,
      letter: nya.letter !== undefined ? nya.letter : sokResultat.letter,
      dataset: nya.dataset !== undefined ? nya.dataset : sokResultat.dataset,
      page: nya.page !== undefined ? nya.page : 1,
      entry: nya.entry !== undefined ? nya.entry : null,
    });
    startTransition(() => {
      router.push(`/ordbok${qs}`, { scroll: false });
    });
  };

  const infogaTecken = (tecken: string) => {
    const el = inputRef.current;
    if (!el) {
      setSokText((prev) => prev + tecken);
      return;
    }
    const start = el.selectionStart ?? sokText.length;
    const end = el.selectionEnd ?? sokText.length;
    const ny = sokText.slice(0, start) + tecken + sokText.slice(end);
    setSokText(ny);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + tecken.length, start + tecken.length);
    });
  };

  // Tangentbordsnavigering med pil upp/ned i träfflistan när sökfältet inte redigeras
  const flyttaUrvalMedTangent = (riktning: -1 | 1) => {
    if (sokResultat.hits.length === 0) return;
    const nuvarandeIdx = sokResultat.hits.findIndex((h) => h.id === valdPost?.id);
    const nastaIdx =
      nuvarandeIdx < 0
        ? 0
        : Math.max(0, Math.min(sokResultat.hits.length - 1, nuvarandeIdx + riktning));
    const nasta = sokResultat.hits[nastaIdx];
    if (nasta && nasta.id !== valdPost?.id) {
      navigera({
        page: sokResultat.page,
        entry: nasta.id,
      });
    }
  };

  const sokKontextUtanEntry = byggOrdbokQueryString({
    q: sokResultat.query,
    mode: sokResultat.mode,
    letter: sokResultat.letter,
    dataset: sokResultat.dataset,
    page: sokResultat.page,
  });

  return (
    <div className="flex-1 flex flex-col p-[1.2rem] sm:p-[2rem] lg:p-[2.6rem] gap-5">
      {/* Sidhuvud */}
      <header className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="display text-[clamp(1.85rem,3.2vw,2.55rem)] leading-[1.08]">
                Fornsvensk ordbok
              </h1>
              <span className="nano border border-ink px-2 py-0.5 bg-panel">
                Söderwall (1884–1918) + Supplement (1925–1973)
              </span>
            </div>
            <p className="micro opacity-65">
              41 744 källartiklar ur Språkbankens digitala LMF-utgåvor · Huvudverk (22 572) &amp;
              Supplement (19 172)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isPending && (
              <span className="nano bg-ink text-paper px-2 py-1" aria-live="polite">
                Söker i ordboken…
              </span>
            )}
            <span className="nano opacity-55">
              Svarstid: {sokResultat.executionTimeMs} ms
            </span>
          </div>
        </div>

        {/* Sökpanel: Sökfält, teckenknappar, sökläge och källfilter */}
        <div className="border border-ink bg-panel p-3.5 sm:p-4 flex flex-col gap-3.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigera({
                q: sokText,
                letter: sokText.trim() ? null : sokResultat.letter ?? "A",
                page: 1,
                entry: null,
              });
            }}
            className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center"
            role="search"
            aria-label="Sök i Söderwalls fornsvenska ordbok"
          >
            <label htmlFor="ordbok-sokfalt" className="sr-only">
              Sökord
            </label>
            <input
              ref={inputRef}
              id="ordbok-sokfalt"
              type="search"
              value={sokText}
              onChange={(e) => setSokText(e.target.value)}
              placeholder={
                sokResultat.mode === "uppslagsord"
                  ? "Sök uppslagsord, belagd variant eller böjd form (t.ex. konunger, laghum, konongær, kirkiu, þing)…"
                  : "Sök i historisk artikeltext och källcitat (t.ex. kloster, abbedissa, VKR)…"
              }
              className="flex-1 min-w-0 border border-ink bg-paper px-3.5 py-2.5 text-[0.88rem] focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <div className="flex gap-2 shrink-0">
              <button
                type="submit"
                className="border border-ink bg-ink text-paper px-4 py-2.5 micro hover:bg-accent hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                Sök
              </button>

              {(sokText || sokResultat.query) && (
                <button
                  type="button"
                  onClick={() => {
                    setSokText("");
                    navigera({
                      q: "",
                      letter: sokResultat.letter ?? "A",
                      page: 1,
                      entry: null,
                    });
                  }}
                  className="border border-ink bg-paper px-3 py-2.5 micro hover:bg-panel transition-colors"
                >
                  Rensa
                </button>
              )}
            </div>
          </form>

          {/* Teckenknappar, sökläge och källfilter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-dashed border-ink/25">
            {/* Teckenknappar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="nano opacity-55 mr-1">Infoga tecken:</span>
              {TECKEN_KNAPPAR.map((tk) => (
                <button
                  key={tk.char}
                  type="button"
                  onClick={() => infogaTecken(tk.char)}
                  title={`Infoga ${tk.label} i sökfältet`}
                  aria-label={`Infoga ${tk.label}`}
                  className="border border-ink bg-paper px-2.5 py-1 text-[0.82rem] hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                >
                  {tk.char}
                </button>
              ))}
            </div>

            {/* Sökläge */}
            <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Sökläge">
              <span className="nano opacity-55 mr-1">Sökläge:</span>
              <button
                type="button"
                aria-pressed={sokResultat.mode === "uppslagsord"}
                onClick={() =>
                  navigera({
                    q: sokText,
                    mode: "uppslagsord",
                    page: 1,
                    entry: null,
                  })
                }
                className={`chip micro ${
                  sokResultat.mode === "uppslagsord" ? "bg-ink text-paper" : ""
                }`}
                data-vald={sokResultat.mode === "uppslagsord" ? "1" : undefined}
              >
                Uppslagsord &amp; varianter
              </button>
              <button
                type="button"
                aria-pressed={sokResultat.mode === "artikeltext"}
                onClick={() =>
                  navigera({
                    q: sokText,
                    mode: "artikeltext",
                    page: 1,
                    entry: null,
                  })
                }
                className={`chip micro ${
                  sokResultat.mode === "artikeltext" ? "bg-ink text-paper" : ""
                }`}
                data-vald={sokResultat.mode === "artikeltext" ? "1" : undefined}
              >
                Historisk artikeltext
              </button>
            </div>

            {/* Källfilter */}
            <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Källband">
              <span className="nano opacity-55 mr-1">Band:</span>
              {(
                [
                  { id: "alla", label: "Båda banden" },
                  { id: "soederwall", label: "Huvudverk" },
                  { id: "soederwall-supp", label: "Supplement" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={sokResultat.dataset === f.id}
                  onClick={() =>
                    navigera({
                      q: sokText,
                      dataset: f.id,
                      page: 1,
                      entry: null,
                    })
                  }
                  className="chip micro"
                  data-vald={sokResultat.dataset === f.id ? "1" : undefined}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Min ordlista (öppnas i panel) */}
            <div className="flex items-center">
              <BokmarkenTrigger visaNoll={true} />
            </div>
          </div>

          {sokResultat.mode === "artikeltext" && (
            <p className="nano opacity-70 bg-paper border border-ink/30 px-2.5 py-1.5">
              Obs: Läget <strong>Historisk artikeltext</strong> fritextsöker i Söderwalls
              1800- och 1900-talsdefinitioner samt i de fornsvenska textcitaten — det är inte en
              moderniserad nysvensk översättningsordbok.
            </p>
          )}
        </div>

        {/* Alfabetisk bläddring (Söderwalls alfabet A–Ö, sist Þ/TH) */}
        <nav
          aria-label="Alfabetisk bläddring i Söderwalls ordning"
          className="border border-ink bg-panel px-3 py-2.5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="nano opacity-60">
              Alfabetisk bläddring (Söderwalls ordning: A–Ö, sist Þ/TH)
            </span>
            {sokResultat.query && sokResultat.letter && (
              <button
                type="button"
                onClick={() => navigera({ letter: null, page: 1, entry: null })}
                className="nano underline underline-offset-2"
              >
                Visa träffar i alla bokstäver (ta bort filter {sokResultat.letter})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {bokstavsStatistik.map((b) => {
              const arVald = sokResultat.letter === b.letter && !sokResultat.query;
              const arFilterUnderSok =
                sokResultat.letter === b.letter && Boolean(sokResultat.query);
              const href = `/ordbok${byggOrdbokQueryString({
                letter: b.letter,
                dataset: sokResultat.dataset !== "alla" ? sokResultat.dataset : undefined,
              })}`;
              return (
                <Link
                  key={b.letter}
                  href={href}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                      e.preventDefault();
                      setSokText("");
                      navigera({
                        q: "",
                        letter: b.letter,
                        page: 1,
                        entry: null,
                      });
                    }
                  }}
                  aria-current={arVald ? "page" : undefined}
                  title={`${b.label}: ${b.total} artiklar (${b.mainCount} i huvudverket, ${b.suppCount} i supplementet)`}
                  className={`border border-ink px-2 py-1 text-[0.74rem] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                    arVald || arFilterUnderSok
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink hover:bg-ink/10"
                  }`}
                >
                  {b.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Huvudyta: Smal träfflista till vänster (desktop) + bred artikelyta till höger */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[23rem_1fr] xl:grid-cols-[26rem_1fr] gap-5 items-start"
        onKeyDown={(e) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            flyttaUrvalMedTangent(1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            flyttaUrvalMedTangent(-1);
          }
        }}
      >
        {/* VÄNSTER: Träfflista & paginering */}
        <section
          aria-label="Träfflista"
          className={`border border-ink bg-panel flex flex-col ${
            mobilVisarArtikel ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Träfflistans huvud */}
          <div className="border-b border-ink px-3.5 py-2.5 bg-paper flex items-center justify-between gap-2 flex-wrap">
            <span className="micro">
              {sokResultat.query ? (
                <>
                  Sökning »{sokResultat.query}»:{" "}
                  <strong>{sokResultat.totalHits.toLocaleString("sv-SE")}</strong>{" "}
                  {sokResultat.totalHits === 1 ? "träff" : "träffar"}
                </>
              ) : (
                <>
                  Bokstav {sokResultat.letter === "Þ" ? "Þ (TH)" : sokResultat.letter ?? "Alla"}:{" "}
                  <strong>{sokResultat.totalHits.toLocaleString("sv-SE")}</strong> poster
                </>
              )}
            </span>
            <span className="nano opacity-60">
              Sida {sokResultat.page} av {sokResultat.totalPages}
            </span>
          </div>

          {/* Morfologisk & ortografisk analys vid sökning på böjd eller paleografisk form */}
          {sokResultat.query &&
            sokResultat.morfologiskaKandidater &&
            sokResultat.morfologiskaKandidater.length > 0 && (
              <div className="border-b border-ink bg-paper/90 px-3.5 py-2.5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="nano tracking-[0.09em] opacity-80">
                    MORFOLOGISK &amp; ORTOGRAFISK ANALYS AV »{sokResultat.query}»
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {sokResultat.morfologiskaKandidater.slice(0, 5).map((mk) => (
                    <li
                      key={`${mk.kategori}:${mk.grundform}`}
                      className="flex items-baseline justify-between gap-2 text-[0.66rem] leading-[1.45]"
                    >
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSokText(mk.grundform);
                            navigera({
                              q: mk.grundform,
                              page: 1,
                              entry: null,
                            });
                          }}
                          className="display font-semibold text-[0.95rem] underline decoration-accent underline-offset-2 hover:opacity-70 mr-1.5"
                        >
                          {mk.grundform}
                        </button>
                        <span className="opacity-75">— {mk.forklaring}</span>
                      </div>
                      <span className="nano border border-ink/40 bg-panel px-1.5 py-0.2 shrink-0">
                        {mk.antalTraffar} {mk.antalTraffar === 1 ? "post" : "poster"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Källnotis vid bokstav Ä eller V + Supplement */}
          {!sokResultat.query && sokResultat.letter === "Ä" && (
            <div className="border-b border-ink/30 bg-paper px-3.5 py-2 nano opacity-80">
              Obs: I Språkbankens XML-leverans ligger både Huvudverkets (332 poster) och
              Supplementets (285 poster) Ä-kapitel i <code>soederwall-supp.xml</code>.
            </div>
          )}
          {!sokResultat.query &&
            sokResultat.letter === "V" &&
            sokResultat.dataset === "soederwall-supp" && (
              <div className="border-b border-ink/30 bg-paper px-3.5 py-3 micro">
                Kapitlet <strong>V</strong> saknas i Språkbankens digitala LMF-fil för
                Supplementet (<code>soederwall-supp.xml</code>). Byt filter till{" "}
                <button
                  type="button"
                  onClick={() => navigera({ dataset: "alla", page: 1 })}
                  className="underline underline-offset-2 font-medium"
                >
                  Båda banden
                </button>{" "}
                för att läsa Huvudverkets 1 387 artiklar under V.
              </div>
            )}

          {/* Lista med poster */}
          {sokResultat.hits.length === 0 ? (
            <div className="p-6 flex flex-col gap-3">
              <p className="doc-body text-[1rem]">
                Inga artiklar matchade <strong>»{sokResultat.query}»</strong>
                {sokResultat.dataset !== "alla" ? " i det valda bandet" : ""}.
              </p>
              <ul className="micro opacity-75 list-disc pl-4 flex flex-col gap-1">
                <li>
                  Prova att söka på ordets rot eller början (t.ex. <code>konung</code>,{" "}
                  <code>lagh</code>, <code>þing</code>).
                </li>
                <li>
                  Växla till sökläget <strong>Historisk artikeltext</strong> om du söker ett ord
                  inuti Söderwalls förklaringar eller citat.
                </li>
                {sokResultat.dataset !== "alla" && (
                  <li>
                    <button
                      type="button"
                      onClick={() => navigera({ dataset: "alla", page: 1 })}
                      className="underline underline-offset-2"
                    >
                      Sök i både Huvudverket och Supplementet
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <ul className="divide-y divide-ink/25 max-h-[74vh] overflow-y-auto">
              {sokResultat.hits.map((hit) => {
                const arAktiv = valdPost?.id === hit.id;
                const itemHref = `/ordbok${byggOrdbokQueryString({
                  q: sokResultat.query,
                  mode: sokResultat.mode,
                  letter: sokResultat.letter,
                  dataset: sokResultat.dataset,
                  page: sokResultat.page,
                  entry: hit.id,
                })}`;
                const posKort = hit.partOfSpeech
                  .map((p) => ORDKLASS_ETIKETTER[p] ?? p)
                  .join("/");

                return (
                  <li key={hit.id}>
                    <Link
                      href={itemHref}
                      scroll={false}
                      aria-current={arAktiv ? "true" : undefined}
                      className={`block px-3.5 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                        arAktiv
                          ? "bg-paper border-l-4 border-l-accent"
                          : "bg-panel hover:bg-paper/75"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                          <span className="display text-[1.15rem] leading-[1.15] font-semibold">
                            {hit.headwordDisplay}
                            {hit.homonymNumber !== undefined && (
                              <sup className="mono text-[0.62rem] ml-0.5 opacity-75">
                                {hit.homonymNumber}
                              </sup>
                            )}
                          </span>

                          {(hit.gramOriginal || posKort) && (
                            <span className="nano opacity-60">
                              {hit.gramOriginal ?? posKort}
                            </span>
                          )}

                          {hit.modernDefinition?.modernGlos && hit.modernDefinition.modernGlos.length > 0 && (
                            <span
                              className="nano border border-ink/30 bg-paper px-1.5 py-0.2 text-ink/85 italic"
                              title={hit.modernDefinition.kortForklaring}
                            >
                              {hit.modernDefinition.modernGlos.slice(0, 2).join(", ")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {hit.rattelse && (
                            <span
                              className="nano border border-accent bg-accent/20 px-1.5 py-0.5"
                              title={`Redaktionell rättelse: ${hit.rattelse.note}`}
                            >
                              Rättad
                            </span>
                          )}
                          <BokmarkeKnapp post={hit} kompakt={true} />
                          <span
                            className={`nano px-1.5 py-0.5 border border-ink ${
                              hit.sourceDataset === "soederwall"
                                ? "bg-ink text-paper"
                                : "bg-paper text-ink"
                            }`}
                          >
                            {hit.sourceDataset === "soederwall" ? "Huvudv." : "Suppl."}
                          </span>
                        </div>
                      </div>

                      {/* Matchtyp vid sökning (variant, teckenalias eller morfologisk/ortografisk kandidat) */}
                      {hit.matchType && hit.matchType !== "exact_headword" && (
                        <div className="mt-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="nano border border-ink/40 bg-paper px-1.5 py-0.2">
                              {MATCHTYP_ETIKETTER[hit.matchType] ?? hit.matchType}
                              {hit.matchedForm &&
                              hit.matchedForm.toLowerCase() !==
                                hit.headwordDisplay.toLowerCase()
                                ? `: »${hit.matchedForm}»`
                                : ""}
                            </span>
                          </div>
                          {hit.matchExplanation && (
                            <span className="text-[0.6rem] leading-[1.35] opacity-65">
                              {hit.matchExplanation}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Kort utdrag */}
                      {hit.snippet && (
                        <p className="doc-body text-[0.88rem] leading-[1.42] opacity-80 mt-1 line-clamp-2">
                          {hit.snippet}
                        </p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Pagineringskontroller */}
          {sokResultat.totalPages > 1 && (
            <div className="border-t border-ink px-3.5 py-2.5 bg-paper flex items-center justify-between gap-2">
              {sokResultat.page > 1 ? (
                <Link
                  href={`/ordbok${byggOrdbokQueryString({
                    q: sokResultat.query,
                    mode: sokResultat.mode,
                    letter: sokResultat.letter,
                    dataset: sokResultat.dataset !== "alla" ? sokResultat.dataset : undefined,
                    page: sokResultat.page - 1,
                  })}`}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                      e.preventDefault();
                      navigera({ page: sokResultat.page - 1, entry: null });
                    }
                  }}
                  className="border border-ink bg-panel px-2.5 py-1 nano hover:bg-ink hover:text-paper transition-colors"
                >
                  ← Föregående
                </Link>
              ) : (
                <span className="border border-ink/40 bg-panel px-2.5 py-1 nano opacity-35 cursor-not-allowed">
                  ← Föregående
                </span>
              )}

              <span className="nano opacity-70">
                Sida {sokResultat.page} / {sokResultat.totalPages}
              </span>

              {sokResultat.page < sokResultat.totalPages ? (
                <Link
                  href={`/ordbok${byggOrdbokQueryString({
                    q: sokResultat.query,
                    mode: sokResultat.mode,
                    letter: sokResultat.letter,
                    dataset: sokResultat.dataset !== "alla" ? sokResultat.dataset : undefined,
                    page: sokResultat.page + 1,
                  })}`}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                      e.preventDefault();
                      navigera({ page: sokResultat.page + 1, entry: null });
                    }
                  }}
                  className="border border-ink bg-panel px-2.5 py-1 nano hover:bg-ink hover:text-paper transition-colors"
                >
                  Nästa →
                </Link>
              ) : (
                <span className="border border-ink/40 bg-panel px-2.5 py-1 nano opacity-35 cursor-not-allowed">
                  Nästa →
                </span>
              )}
            </div>
          )}
        </section>

        {/* HÖGER: Artikelläsning */}
        <section
          ref={artikelRef}
          aria-label="Ordboksartikel"
          className={`min-w-0 ${
            mobilVisarArtikel ? "block" : "hidden lg:block"
          }`}
        >
          {/* Mobil återgångsknapp till samma träfflista */}
          {mobilVisarArtikel && (
            <div className="mb-3 lg:hidden">
              <Link
                href={`/ordbok${sokKontextUtanEntry}`}
                scroll={false}
                className="inline-flex items-center gap-2 border border-ink bg-panel px-3.5 py-2 micro hover:bg-ink hover:text-paper transition-colors"
              >
                ← Tillbaka till träfflistan ({sokResultat.totalHits.toLocaleString("sv-SE")}{" "}
                träffar)
              </Link>
            </div>
          )}

          {valdPost && relaterade ? (
            <OrdbokArtikelVy
              post={valdPost}
              sammaUppslagsordHuvudverk={relaterade.sammaUppslagsordHuvudverk}
              sammaUppslagsordSupplement={relaterade.sammaUppslagsordSupplement}
              grannarISektion={relaterade.grannarISektion}
              sokKontextQuery={sokKontextUtanEntry}
            />
          ) : (
            <div className="doc-sheet border border-ink p-8 flex flex-col gap-3">
              <h2 className="display text-[1.45rem]">Välj ett uppslagsord</h2>
              <p className="doc-body opacity-80">
                Sök efter ett fornsvenskt ord ovan eller välj en artikel i träfflistan till
                vänster för att läsa Söderwalls artikel med källbelägg och proveniens.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Käll-, licens- och kvalitetsförklaring (Etapp 5) */}
      <OrdbokKallochKvalitetsruta />
    </div>
  );
}
