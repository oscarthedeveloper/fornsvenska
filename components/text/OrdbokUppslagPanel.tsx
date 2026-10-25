"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { OrdbokTextUppslagResultat, OrdbokTextUppslagTräff } from "@/lib/ordbok/typer";
import { formatOrdklassLista } from "@/components/ordbok/ordklasser";
import { byggOrdbokQueryString } from "@/lib/ordbok/url";
import Inline from "@/components/dokument/Inline";
import type { KlickatOrdKontext } from "./KlickbarFsvMening";
import BokmarkeKnapp from "@/components/ordbok/BokmarkeKnapp";
import BokmarkenTrigger from "@/components/ordbok/BokmarkenTrigger";

function kategoriEtikett(
  kat: OrdbokTextUppslagTräff["matchKategori"]
): { rubrik: string; markera: boolean } {
  switch (kat) {
    case "exact_headword":
      return { rubrik: "Exakt uppslagsord", markera: true };
    case "exact_variant":
      return { rubrik: "Exakt belagd form", markera: true };
    case "ortho_candidate":
      return { rubrik: "Ortografisk motsvarighet", markera: false };
    case "inflected_candidate":
      return { rubrik: "Böjnings- / stamkandidat", markera: false };
  }
}

const KLIENT_UPPSLAG_CACHE = new Map<string, OrdbokTextUppslagResultat>();
const MAX_CACHE_STORLEK = 250;

function sparaIKlientCache(ord: string, data: OrdbokTextUppslagResultat) {
  if (KLIENT_UPPSLAG_CACHE.size >= MAX_CACHE_STORLEK) {
    const aldsta = KLIENT_UPPSLAG_CACHE.keys().next().value;
    if (aldsta) KLIENT_UPPSLAG_CACHE.delete(aldsta);
  }
  KLIENT_UPPSLAG_CACHE.set(ord, data);
}

export default function OrdbokUppslagPanel({
  kontext,
  onClose,
}: {
  kontext: KlickatOrdKontext | null;
  onClose: () => void;
}) {
  const [laddar, setLaddar] = useState(false);
  const [resultat, setResultat] = useState<OrdbokTextUppslagResultat | null>(null);
  const [fel, setFel] = useState<string | null>(null);
  const [expanderadePoster, setExpanderadePoster] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!kontext?.rensatOrd) {
      setResultat(null);
      setFel(null);
      return;
    }

    const ord = kontext.rensatOrd;
    setExpanderadePoster({});

    // 1. Kontrollera omedelbart klientsidans minnescache
    const iCache = KLIENT_UPPSLAG_CACHE.get(ord);
    if (iCache) {
      setResultat(iCache);
      setLaddar(false);
      setFel(null);
      return;
    }

    // 2. Skapa AbortController för att avbryta pågående förfrågan om nytt ord väljs
    const controller = new AbortController();
    setLaddar(true);
    setFel(null);

    fetch(`/api/ordbok/uppslag?ord=${encodeURIComponent(ord)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta ordboksuppslag.");
        return res.json() as Promise<OrdbokTextUppslagResultat>;
      })
      .then((data) => {
        sparaIKlientCache(ord, data);
        setResultat(data);
        setLaddar(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") {
          // Förfrågan avbröts av ett snabbt ordbyte; ignorera
          return;
        }
        setFel(err instanceof Error ? err.message : "Ett fel uppstod.");
        setLaddar(false);
      });

    return () => {
      controller.abort();
    };
  }, [kontext?.rensatOrd]);


  useEffect(() => {
    if (!kontext) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [kontext, onClose]);

  if (!kontext) return null;

  return (
    <aside
      aria-label={`Ordboksuppslag för ${kontext.ord}`}
      className="fixed bottom-0 right-0 z-50 w-full sm:w-[460px] lg:w-[520px] max-h-[82vh] flex flex-col border-t sm:border-l border-ink bg-panel shadow-[0_-8px_28px_rgba(17,17,17,0.16)]"
    >
      {/* Topplist */}
      <header className="flex items-center justify-between gap-3 px-4 py-2.5 bg-ink text-paper border-b border-ink shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 bg-accent shrink-0" aria-hidden="true" />
          <span className="nano tracking-[0.12em] truncate">
            SÖDERWALLS ORDBOK · TEXTUPPSLAG
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BokmarkenTrigger visaNoll={false} label="Ordlista" />
          <button
            type="button"
            onClick={onClose}
            className="nano px-2 py-1 border border-paper/40 hover:bg-accent hover:text-ink hover:border-accent transition-colors"
          >
            Stäng [Esc] ✕
          </button>
        </div>
      </header>

      {/* Klickat ord och meningskontext */}
      <div className="px-4 py-3 bg-paper border-b border-ink flex flex-col gap-2 shrink-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="flex items-baseline gap-2.5">
            <span className="nano opacity-55">Ord i texten:</span>
            <span className="display text-[1.55rem] leading-none font-medium">
              {kontext.ord}
            </span>
            {kontext.rensatOrd.toLowerCase() !== kontext.ord.toLowerCase() && (
              <span className="nano opacity-60">({kontext.rensatOrd})</span>
            )}
          </div>
          <Link
            href={`/ordbok${byggOrdbokQueryString({
              q: kontext.rensatOrd,
              mode: "uppslagsord",
              dataset: "alla",
            })}`}
            className="nano underline decoration-accent underline-offset-4 hover:opacity-70"
          >
            Sök »{kontext.rensatOrd}» i /ordbok →
          </Link>
        </div>

        {kontext.meningKommentar && (
          <div className="text-[0.62rem] leading-[1.55] border-l-2 border-accent pl-2.5 py-0.5 opacity-85">
            <span className="nano opacity-60 mr-1.5">
              Textens grammatiknot (mening {kontext.meningNr}):
            </span>
            <Inline text={kontext.meningKommentar} />
          </div>
        )}
      </div>

      {/* Träfflista ur Söderwall */}
      <div className="flex-1 overflow-y-auto divide-y divide-ink/25">
        {laddar && (
          <div className="p-5 flex items-center justify-between">
            <span className="micro opacity-65">
              Slår upp »{kontext.rensatOrd}» i Söderwall (41 744 poster)…
            </span>
          </div>
        )}

        {fel && (
          <div className="p-5">
            <p className="micro text-accent">{fel}</p>
          </div>
        )}

        {!laddar && !fel && resultat && resultat.traffar.length === 0 && (
          <div className="p-5 flex flex-col gap-3">
            <p className="doc-body text-[0.95rem]">
              Ingen direkt eller böjd kandidat hittades för ordformen{" "}
              <strong>»{kontext.rensatOrd}»</strong> i Söderwalls huvudord eller
              belagda variantformer.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/ordbok${byggOrdbokQueryString({
                  q: kontext.rensatOrd,
                  mode: "artikeltext",
                  dataset: "alla",
                })}`}
                className="nano border border-ink bg-paper px-2.5 py-1.5 hover:bg-ink hover:text-paper transition-colors"
              >
                Sök i Söderwalls artikeltext →
              </Link>
              {kontext.rensatOrd.length >= 3 && (
                <Link
                  href={`/ordbok${byggOrdbokQueryString({
                    q: kontext.rensatOrd.slice(0, 3),
                    mode: "uppslagsord",
                    dataset: "alla",
                  })}`}
                  className="nano border border-ink bg-panel px-2.5 py-1.5 hover:bg-paper transition-colors"
                >
                  Sök på ordstammen »{kontext.rensatOrd.slice(0, 3)}-» →
                </Link>
              )}
            </div>
          </div>
        )}

        {!laddar &&
          !fel &&
          resultat &&
          resultat.traffar.map((traff) => {
            const { post, listPost, matchKategori, kandidatForm, forklaring } =
              traff;
            const kat = kategoriEtikett(matchKategori);
            const arExpanderad = Boolean(expanderadePoster[post.id]);
            const kallaKort =
              post.isMainWorkAeInSuppFile
                ? "Huvudverket (Ä)"
                : post.sourceDataset === "soederwall"
                  ? "Huvudverket"
                  : "Supplementet";

            return (
              <article key={post.id} className="p-4 flex flex-col gap-2.5">
                {/* Matchningskategori + källverk */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`nano px-1.5 py-0.5 border border-ink ${
                        kat.markera ? "bg-ink text-paper" : "bg-paper"
                      }`}
                    >
                      {kat.rubrik}
                    </span>
                    {matchKategori !== "exact_headword" && (
                      <span className="nano opacity-65">
                        via »{kandidatForm}»
                      </span>
                    )}
                  </div>
                  <span className="nano px-1.5 py-0.5 border border-ink/50 opacity-75">
                    {kallaKort} · {post.kallaId}
                  </span>
                </div>

                {forklaring && matchKategori !== "exact_headword" && (
                  <p className="text-[0.6rem] leading-[1.4] opacity-65">
                    {forklaring}
                  </p>
                )}

                {/* Uppslagsord och ordklass */}
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <Link
                      href={`/ordbok/${encodeURIComponent(post.id)}`}
                      className="display text-[1.35rem] leading-tight hover:underline decoration-accent underline-offset-4"
                    >
                      {post.headwordDisplay}
                    </Link>
                    {listPost.homonymNumber && (
                      <span className="nano border border-ink px-1 py-0.2">
                        {listPost.homonymNumber}
                      </span>
                    )}
                    {post.gramOriginal && (
                      <span className="doc-body italic text-[0.9rem] opacity-80">
                        {post.gramOriginal}
                      </span>
                    )}
                    {post.partOfSpeech.length > 0 && (
                      <span className="nano opacity-55">
                        [{formatOrdklassLista(post.partOfSpeech)}]
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <BokmarkeKnapp
                      post={listPost}
                      kallText={{
                        titel: kontext.sektionRubrik,
                        ord: kontext.ord,
                        meningFsv: kontext.meningFsv,
                        meningTolkning: kontext.meningTolkning,
                      }}
                    />
                    <Link
                      href={`/ordbok/${encodeURIComponent(post.id)}`}
                      className="nano border border-ink bg-paper px-2 py-1 hover:bg-ink hover:text-paper transition-colors shrink-0"
                    >
                      Öppna artikel →
                    </Link>
                  </div>
                </div>

                {/* Modernt förklaringsstöd / snabbglosa */}
                {(post.modernDefinition || listPost.modernDefinition) && (
                  <div className="bg-panel border border-ink/40 p-2 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="nano font-semibold opacity-60">Modern glosa:</span>
                      {(post.modernDefinition || listPost.modernDefinition)?.modernGlos.map((g, gi) => (
                        <span
                          key={gi}
                          className="nano font-semibold border border-ink/40 bg-paper px-1.5 py-0.2 text-ink"
                        >
                          {g}
                        </span>
                      ))}
                      {(post.modernDefinition || listPost.modernDefinition)?.kalla === "kurerad_redaktionell" && (
                        <span className="nano text-accent font-semibold ml-auto">
                          ✓ Kurerad
                        </span>
                      )}
                    </div>
                    {(post.modernDefinition || listPost.modernDefinition)?.kortForklaring && (
                      <p className="text-[0.76rem] leading-[1.45] text-ink font-serif">
                        {(post.modernDefinition || listPost.modernDefinition)?.kortForklaring}
                      </p>
                    )}
                  </div>
                )}

                {/* Belagda stavnings-/böjningsformer */}
                {post.variantsOriginal.length > 0 && (
                  <p className="text-[0.62rem] leading-[1.5] opacity-70">
                    <span className="nano opacity-60 mr-1">Former:</span>
                    {post.variantsOriginal.slice(0, 8).join(", ")}
                    {post.variantsOriginal.length > 8 &&
                      ` (+${post.variantsOriginal.length - 8})`}
                  </p>
                )}

                {/* Betydelser ur Söderwall */}
                {post.senses.length > 0 ? (
                  <div className="flex flex-col gap-1.5 pt-1">
                    {(arExpanderad ? post.senses : post.senses.slice(0, 2)).map(
                      (sense) => {
                        const arKort = sense.text.length <= 260 || arExpanderad;
                        const visadText = arKort
                          ? sense.text
                          : `${sense.text.slice(0, 255).trim()}…`;
                        return (
                          <div
                            key={sense.id}
                            className="doc-body text-[0.92rem] leading-[1.55] border-l border-ink/30 pl-2.5"
                          >
                            {sense.etikett && (
                              <strong className="mr-1">{sense.etikett}</strong>
                            )}
                            {sense.gram && (
                              <em className="mr-1 opacity-80">{sense.gram}</em>
                            )}
                            {sense.writtenForm && (
                              <strong className="mr-1">
                                {sense.writtenForm}
                              </strong>
                            )}
                            <span>{visadText}</span>
                          </div>
                        );
                      }
                    )}

                    {(post.senses.length > 2 ||
                      post.senses.some((s) => s.text.length > 260)) && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanderadePoster((prev) => ({
                            ...prev,
                            [post.id]: !arExpanderad,
                          }))
                        }
                        className="nano self-start opacity-70 hover:opacity-100 underline decoration-dotted underline-offset-4 mt-0.5"
                      >
                        {arExpanderad
                          ? "Visa kortare utdrag"
                          : `Visa hela artikeltexten (${post.senses.length} betydelsemoment)`}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="doc-body text-[0.9rem] leading-[1.5] opacity-80 border-l border-ink/30 pl-2.5">
                    {listPost.snippet || "Hänvisnings- eller formpost i Söderwall."}
                  </div>
                )}
              </article>
            );
          })}
      </div>

      {/* Fotrad med proveniens */}
      <footer className="px-4 py-2 bg-paper border-t border-ink flex items-center justify-between gap-2 shrink-0">
        <span className="nano opacity-60">
          Källa: K. F. Söderwall (CC BY 4.0, Språkbanken Text)
        </span>
        {resultat && (
          <span className="nano opacity-55">
            {resultat.traffar.length} träff{resultat.traffar.length === 1 ? "" : "ar"} ·{" "}
            {resultat.executionTimeMs} ms
          </span>
        )}
      </footer>
    </aside>
  );
}
