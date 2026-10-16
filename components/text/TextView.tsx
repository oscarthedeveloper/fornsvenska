"use client";

import { useState } from "react";
import Link from "next/link";
import type { Crumb } from "@/lib/typer";
import type { Sektion as SektionTyp, Textdokument } from "@/lib/text";
import Inline from "@/components/dokument/Inline";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import { formateraKallhanvisning } from "@/lib/kallformat";
import Sektion from "./Sektion";
import type { KlickatOrdKontext } from "./KlickbarFsvMening";
import OrdbokUppslagPanel from "./OrdbokUppslagPanel";
import BokmarkenTrigger from "@/components/ordbok/BokmarkenTrigger";

export default function TextView({
  dokument,
  sidebar,
  crumbs,
  syskon,
  titel,
  note,
  redigerbar = false,
  onChange,
  onTitel,
  onSkapa,
}: {
  dokument: Textdokument | null;
  sidebar: React.ReactNode;
  crumbs: Crumb[];
  syskon: {
    prev: { title: string; href: string } | null;
    next: { title: string; href: string } | null;
  };
  titel: string;
  note?: string;
  redigerbar?: boolean;
  onChange?: (dok: Textdokument) => void;
  onTitel?: (titel: string) => void;
  onSkapa?: () => void;
}) {
  const [ordbokAktiv, setOrdbokAktiv] = useState(true);
  const [valtOrdKontext, setValtOrdKontext] = useState<KlickatOrdKontext | null>(
    null
  );

  const foralder = crumbs[crumbs.length - 2];
  const satt = (delar: Partial<Textdokument>) =>
    dokument && onChange?.({ ...dokument, ...delar });

  const sattSektion = (i: number, sektion: SektionTyp) =>
    dokument &&
    onChange?.({
      ...dokument,
      sektioner: dokument.sektioner.map((s, si) => (si === i ? sektion : s)),
    });

  return (
    <div className="flex-1 flex items-stretch">
      {sidebar}

      <div className="flex-1 min-w-0 p-[1.2rem] sm:p-[2rem] lg:p-[2.6rem]">
        <article className="doc-sheet border border-ink mx-auto max-w-[1040px] px-[1.4rem] py-[2rem] sm:px-[3rem] sm:py-[3.2rem] flex flex-col gap-7">
          <header className="flex flex-col gap-3">
            <nav aria-label="Brödsmulor" className="flex items-center gap-2 flex-wrap">
              {crumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span className="nano opacity-35">/</span>}
                  {i === crumbs.length - 1 ? (
                    <span className="nano">{crumb.title}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="nano opacity-55 transition-opacity duration-[140ms] hover:opacity-100"
                    >
                      {crumb.title}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            <div className="flex items-start justify-between gap-4">
              <Redigerbar
                as="div"
                varde={dokument?.titel ?? titel}
                redigerbar={redigerbar && Boolean(dokument)}
                /* Titeln är nodens namn i arkiv och sidebar — ingen
                   uppmärkning, markörerna skulle synas där. */
                formatering={false}
                platshallare="Rubrik"
                onChange={(t) => {
                  satt({ titel: t });
                  onTitel?.(t);
                }}
                className="display text-[clamp(2rem,4vw,3rem)] leading-[1.08]"
              />
              {redigerbar && dokument ? (
                <Knapp
                  titel="Växla utkaststatus"
                  onClick={() => satt({ utkast: !dokument.utkast })}
                >
                  {dokument.utkast ? "Utkast ●" : "Utkast ○"}
                </Knapp>
              ) : (
                dokument?.utkast && (
                  <span className="nano border border-ink px-2 py-1 shrink-0 opacity-70">
                    Utkast
                  </span>
                )
              )}
            </div>

            {(dokument || note) && (
              <Redigerbar
                as="p"
                varde={dokument?.underrubrik ?? note ?? ""}
                redigerbar={redigerbar && Boolean(dokument)}
                platshallare="Underrubrik"
                onChange={(underrubrik) => satt({ underrubrik })}
                className="micro opacity-65"
              />
            )}
          </header>

          <hr className="border-0 border-t border-ink" />

          {dokument ? (
            <>
              {(dokument.ingress || redigerbar) &&
                (redigerbar ? (
                  <Redigerbar
                    as="p"
                    varde={dokument.ingress ?? ""}
                    redigerbar
                    flerRader
                    platshallare="Ingress"
                    onChange={(ingress) => satt({ ingress })}
                    className="doc-ingress"
                  />
                ) : (
                  <p className="doc-ingress">
                    <Inline text={dokument.ingress ?? ""} />
                  </p>
                ))}

              {((dokument.meta?.length ?? 0) > 0 || redigerbar) && (
                <div className="flex flex-col gap-2">
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 border-y border-dashed border-ink py-3">
                    {(dokument.meta ?? []).map((post, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <dt className="nano opacity-50 flex items-center gap-1">
                          <Redigerbar
                            varde={post.nyckel}
                            redigerbar={redigerbar}
                            platshallare="Fält"
                            onChange={(nyckel) =>
                              satt({
                                meta: (dokument.meta ?? []).map((p, pi) =>
                                  pi === i ? { ...p, nyckel } : p
                                ),
                              })
                            }
                          />
                          {redigerbar && (
                            <Knapp
                              titel="Ta bort fältet"
                              fara
                              onClick={() =>
                                satt({
                                  meta: (dokument.meta ?? []).filter((_, pi) => pi !== i),
                                })
                              }
                            >
                              ✕
                            </Knapp>
                          )}
                        </dt>
                        <dd className="text-[0.72rem] tracking-[0.02em]">
                          <Redigerbar
                            varde={post.varde}
                            redigerbar={redigerbar}
                            platshallare="Värde"
                            onChange={(varde) =>
                              satt({
                                meta: (dokument.meta ?? []).map((p, pi) =>
                                  pi === i ? { ...p, varde } : p
                                ),
                              })
                            }
                          />
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {redigerbar && (
                    <Knapp
                      titel="Lägg till metafält"
                      onClick={() =>
                        satt({
                          meta: [...(dokument.meta ?? []), { nyckel: "Fält", varde: "" }],
                        })
                      }
                    >
                      + metafält
                    </Knapp>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {!redigerbar && (
                  <div className="flex items-center justify-between gap-3 flex-wrap border border-ink bg-paper px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 ${
                          ordbokAktiv ? "bg-accent" : "bg-ink/30"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="nano opacity-80">
                        {ordbokAktiv
                          ? "Klicka på ett fornsvenskt ord i utdraget för att slå upp det i Söderwalls ordbok."
                          : "Ordboksuppslag i utdraget är avstängt."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BokmarkenTrigger visaNoll={false} label="Min ordlista" />
                      {valtOrdKontext && (
                        <button
                          type="button"
                          onClick={() => setValtOrdKontext(null)}
                          className="nano underline decoration-dotted underline-offset-4 opacity-70 hover:opacity-100"
                        >
                          Rensa »{valtOrdKontext.ord}»
                        </button>
                      )}
                      <button
                        type="button"
                        aria-pressed={ordbokAktiv}
                        onClick={() => {
                          setOrdbokAktiv((v) => {
                            if (v) setValtOrdKontext(null);
                            return !v;
                          });
                        }}
                        className={`nano px-2 py-0.5 border border-ink transition-colors ${
                          ordbokAktiv
                            ? "bg-ink text-paper"
                            : "bg-panel text-ink hover:bg-paper"
                        }`}
                      >
                        Ordboksuppslag: {ordbokAktiv ? "På" : "Av"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                  <span className="nano opacity-45">
                    Utdrag{!redigerbar && ordbokAktiv ? " (klickbara ord)" : ""}
                  </span>
                  <span className="nano opacity-45">Översättning och tolkning</span>
                </div>
              </div>

              <div className="flex flex-col gap-9">
                {dokument.sektioner.map((sektion, i) => (
                  <Sektion
                    key={i}
                    sektion={sektion}
                    index={i}
                    redigerbar={redigerbar}
                    aktivtRensatOrd={
                      !redigerbar && ordbokAktiv
                        ? valtOrdKontext?.rensatOrd ?? null
                        : null
                    }
                    onKlickaOrd={
                      !redigerbar && ordbokAktiv
                        ? (kontext) => setValtOrdKontext(kontext)
                        : undefined
                    }
                    onChange={(s) => sattSektion(i, s)}
                    onTaBort={() =>
                      satt({
                        sektioner: dokument.sektioner.filter((_, si) => si !== i),
                      })
                    }
                  />
                ))}

                {redigerbar && (
                  <Knapp
                    titel="Lägg till sektion"
                    onClick={() =>
                      satt({
                        sektioner: [
                          ...dokument.sektioner,
                          { meningar: [{ fsv: "", tolkning: "" }] },
                        ],
                      })
                    }
                  >
                    + sektion
                  </Knapp>
                )}
              </div>

              {(dokument.fotnoter.length > 0 || redigerbar) && (
                <footer className="mt-2 pt-4 border-t border-ink flex flex-col gap-2">
                  <span className="nano opacity-50">Källor</span>
                  <ol className="flex flex-col gap-1.5">
                    {dokument.fotnoter.map((not, i) => (
                      <li
                        key={not.id}
                        id={`not-${not.id}`}
                        className="text-[0.62rem] leading-[1.6] flex gap-2 scroll-mt-6"
                      >
                        <span className="opacity-50">{not.id}</span>
                        <Redigerbar
                          varde={not.text ?? formateraKallhanvisning(not)}
                          redigerbar={redigerbar}
                          flerRader
                          platshallare="Källhänvisning"
                          onChange={(text) =>
                            satt({
                              fotnoter: dokument.fotnoter.map((f, fi) =>
                                fi === i ? { ...f, text } : f
                              ),
                            })
                          }
                          className="opacity-80 flex-1"
                        />
                        {redigerbar && (
                          <Knapp
                            titel="Ta bort källan"
                            fara
                            onClick={() =>
                              satt({
                                fotnoter: dokument.fotnoter.filter((_, fi) => fi !== i),
                              })
                            }
                          >
                            ✕
                          </Knapp>
                        )}
                      </li>
                    ))}
                  </ol>
                  {redigerbar && (
                    <Knapp
                      titel="Lägg till källa"
                      onClick={() =>
                        satt({
                          fotnoter: [
                            ...dokument.fotnoter,
                            {
                              id:
                                dokument.fotnoter.reduce((m, f) => Math.max(m, f.id), 0) + 1,
                              text: "",
                            },
                          ],
                        })
                      }
                    >
                      + källa
                    </Knapp>
                  )}
                </footer>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="doc-body opacity-70">
                Det här utdraget är ännu inte inlagt. När adminläget finns på
                plats skrivs texten in sektion för sektion — fem meningar i
                taget, med tolkningen i den högra spalten.
              </p>
              {redigerbar ? (
                <Knapp titel="Skapa innehåll" onClick={() => onSkapa?.()}>
                  + Skapa innehåll
                </Knapp>
              ) : (
                foralder && (
                  <Link
                    href={foralder.href}
                    className="micro border border-ink px-3 py-1.5 self-start transition-opacity duration-[140ms] hover:opacity-60"
                  >
                    &lt;&lt; Tillbaka till {foralder.title}
                  </Link>
                )
              )}
            </div>
          )}

          {(syskon.prev || syskon.next) && (
            <nav className="mt-2 pt-4 border-t border-dashed border-ink grid grid-cols-2 gap-4">
              <div>
                {syskon.prev && (
                  <Link
                    href={syskon.prev.href}
                    className="flex flex-col gap-1 transition-opacity duration-[140ms] hover:opacity-60"
                  >
                    <span className="nano opacity-45">Föregående</span>
                    <span className="micro">{syskon.prev.title}</span>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {syskon.next && (
                  <Link
                    href={syskon.next.href}
                    className="flex flex-col gap-1 transition-opacity duration-[140ms] hover:opacity-60"
                  >
                    <span className="nano opacity-45">Nästa</span>
                    <span className="micro">{syskon.next.title}</span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </article>

        <p className="nano text-center opacity-45 mt-6">
          Informationen kan inte garanteras vara fullständig — fornsvenskan var
          aldrig ett standardiserat språk
        </p>
      </div>

      {!redigerbar && ordbokAktiv && (
        <OrdbokUppslagPanel
          kontext={valtOrdKontext}
          onClose={() => setValtOrdKontext(null)}
        />
      )}
    </div>
  );
}
