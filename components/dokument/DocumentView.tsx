"use client";

import Link from "next/link";
import type { Crumb } from "@/lib/typer";
import type { Block, Dokument } from "@/lib/dokument";
import Blocklista from "./Blocklista";
import Inline from "./Inline";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import { KALLOR } from "@/data/kallor";
import { kallorForArtikel, produktionsprioritet } from "@/data/grammatikplan";
import { formateraKallhanvisning } from "@/lib/kallformat";

/** Tar bort en raderad fotnot även ur block och block inuti flikar. */
function utanBlockkalla(block: Block, id: number): Block {
  const kallor = block.kallor?.filter((kalla) => kalla !== id);
  const nytt = {
    ...block,
    kallor: kallor && kallor.length > 0 ? kallor : undefined,
  } as Block;

  if (nytt.typ !== "flikar") return nytt;

  return {
    ...nytt,
    flikar: nytt.flikar.map((flik) => ({
      ...flik,
      block: flik.block.map((barn) => utanBlockkalla(barn, id)),
    })),
  };
}

function Kallmarkorer({ ids }: { ids?: number[] }) {
  if (!ids?.length) return null;
  return (
    <span className="inline-flex gap-1 align-super ml-1" aria-label={`Källor ${ids.join(", ")}`}>
      {ids.map((id) => (
        <a key={id} href={`#not-${id}`} className="nano underline underline-offset-2">
          {id}
        </a>
      ))}
    </span>
  );
}

function Kallval({
  etikett,
  ids,
  dokument,
  onChange,
}: {
  etikett: string;
  ids?: number[];
  dokument: Dokument;
  onChange: (ids: number[]) => void;
}) {
  if (!dokument.fotnoter.length) return <span className="nano opacity-45">Lägg till en källa längst ned först.</span>;
  const valda = ids ?? [];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="nano opacity-55 mr-1">{etikett}</span>
      {dokument.fotnoter.map((not) => {
        const vald = valda.includes(not.id);
        return (
          <button
            key={not.id}
            type="button"
            aria-pressed={vald}
            onClick={() =>
              onChange(
                vald
                  ? valda.filter((id) => id !== not.id)
                  : [...valda, not.id].sort((a, b) => a - b)
              )
            }
            className="nano border border-ink px-1.5 py-0.5"
            data-vald={vald ? "1" : undefined}
          >
            {not.id}{vald ? " ●" : ""}
          </button>
        );
      })}
    </div>
  );
}

export default function DocumentView({
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
  dokument: Dokument | null;
  sidebar: React.ReactNode;
  crumbs: Crumb[];
  syskon: {
    prev: { title: string; href: string } | null;
    next: { title: string; href: string } | null;
  };
  titel: string;
  note?: string;
  redigerbar?: boolean;
  onChange?: (dok: Dokument) => void;
  onTitel?: (titel: string) => void;
  onSkapa?: () => void;
}) {
  const foralder = crumbs[crumbs.length - 2];
  const dokumentSokvag =
    crumbs.at(-1)?.href.replace(/^\/grammatik\/?/, "").replace(/\/$/, "") ?? "";
  const planeradeKallor = kallorForArtikel(dokumentSokvag)
    .map((id) => KALLOR.find((kalla) => kalla.id === id))
    .filter((kalla): kalla is (typeof KALLOR)[number] => Boolean(kalla));
  const satt = (delar: Partial<Dokument>) =>
    dokument && onChange?.({ ...dokument, ...delar });

  return (
    <div className="flex-1 flex items-stretch">
      {sidebar}

      <div className="flex-1 min-w-0 p-[1.2rem] sm:p-[2rem] lg:p-[2.6rem]">
        <article className="doc-sheet border border-ink mx-auto max-w-[900px] px-[1.4rem] py-[2rem] sm:px-[3rem] sm:py-[3.2rem] flex flex-col gap-7">
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
                /* Titeln är också nodens namn i arkivet, sidebaren och
                   brödsmulorna. Uppmärkning här skulle synas som markörer
                   där — därför ingen formatering i det här fältet. */
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
              {(dokument.citat || redigerbar) && (
                <blockquote className="flex gap-4 sm:gap-6">
                  <span className="display text-[1.1rem] opacity-40 pt-2">I</span>
                  <div className="flex flex-col gap-3 flex-1">
                    <Redigerbar
                      as="p"
                      varde={dokument.citat?.text ?? ""}
                      redigerbar={redigerbar}
                      flerRader
                      platshallare="Inledande citat"
                      onChange={(text) =>
                        satt({ citat: { ...dokument.citat, text } })
                      }
                      className="doc-quote"
                    />
                    {dokument.citat?.oversattning && (
                      <p className="text-sm italic opacity-75 leading-relaxed">
                        &rdquo;{dokument.citat.oversattning}&rdquo;
                      </p>
                    )}
                    <Redigerbar
                      varde={dokument.citat?.kalla ?? ""}
                      redigerbar={redigerbar}
                      platshallare="Källa"
                      onChange={(kalla) =>
                        satt({
                          citat: {
                            text: dokument.citat?.text ?? "",
                            kalla,
                            kallor: dokument.citat?.kallor,
                          },
                        })
                      }
                      className="nano not-italic opacity-55"
                    />
                    {!redigerbar && <Kallmarkorer ids={dokument.citat?.kallor} />}
                    {redigerbar && (
                      <Kallval
                        etikett="Citatets källor"
                        ids={dokument.citat?.kallor}
                        dokument={dokument}
                        onChange={(kallor) =>
                          satt({
                            citat: {
                              text: dokument.citat?.text ?? "",
                              kalla: dokument.citat?.kalla,
                              kallor,
                            },
                          })
                        }
                      />
                    )}
                  </div>
                </blockquote>
              )}

              {(dokument.ingress || redigerbar) &&
                (redigerbar ? (
                  <div className="flex flex-col gap-2">
                    <Redigerbar
                      as="p"
                      varde={dokument.ingress ?? ""}
                      redigerbar
                      flerRader
                      platshallare="Ingress"
                      onChange={(ingress) => satt({ ingress })}
                      className="doc-ingress"
                    />
                    <Kallval
                      etikett="Ingressens källor"
                      ids={dokument.ingressKallor}
                      dokument={dokument}
                      onChange={(ingressKallor) => satt({ ingressKallor })}
                    />
                  </div>
                ) : (
                  <p className="doc-ingress">
                    <Inline text={dokument.ingress ?? ""} />
                    <Kallmarkorer ids={dokument.ingressKallor} />
                  </p>
                ))}

              {(dokument.meta?.length || redigerbar) && (
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

              <Blocklista
                block={dokument.block}
                fotnoter={dokument.fotnoter}
                redigerbar={redigerbar}
                onChange={(block) => satt({ block })}
              />

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
                        {redigerbar ? (
                          <div className="flex-1 grid gap-1.5 sm:grid-cols-[minmax(12rem,1fr)_minmax(9rem,0.7fr)]">
                            <select
                              value={not.kallaId ?? ""}
                              aria-label={`Källverk för hänvisning ${not.id}`}
                              onChange={(e) =>
                                satt({
                                  fotnoter: dokument.fotnoter.map((f, fi) =>
                                    fi === i ? { ...f, kallaId: e.target.value || undefined } : f
                                  ),
                                })
                              }
                              className="micro border border-ink bg-paper px-2 py-1"
                            >
                              <option value="">Välj källverk</option>
                              {KALLOR.map((kalla) => (
                                <option key={kalla.id} value={kalla.id}>
                                  {kalla.id} — {kalla.titel}
                                </option>
                              ))}
                            </select>
                            <Redigerbar
                              varde={not.lokalisering ?? ""}
                              redigerbar
                              formatering={false}
                              platshallare="Sida, paragraf eller tabell"
                              onChange={(lokalisering) =>
                                satt({
                                  fotnoter: dokument.fotnoter.map((f, fi) =>
                                    fi === i ? { ...f, lokalisering } : f
                                  ),
                                })
                              }
                              className="micro border border-ink px-2 py-1"
                            />
                            <Redigerbar
                              as="div"
                              varde={not.kommentar ?? not.text ?? ""}
                              redigerbar
                              flerRader
                              platshallare="Kommentar (valfri)"
                              onChange={(kommentar) =>
                                satt({
                                  fotnoter: dokument.fotnoter.map((f, fi) =>
                                    fi === i ? { ...f, kommentar, text: undefined } : f
                                  ),
                                })
                              }
                              className="micro opacity-70 sm:col-span-2"
                            />
                          </div>
                        ) : (
                          <span className="opacity-80 flex-1">
                            {formateraKallhanvisning(not)}
                          </span>
                        )}
                        {redigerbar && (
                          <Knapp
                            titel="Ta bort källan"
                            fara
                            onClick={() =>
                              satt({
                                fotnoter: dokument.fotnoter.filter((_, fi) => fi !== i),
                                block: dokument.block.map((block) =>
                                  utanBlockkalla(block, not.id)
                                ),
                                ingressKallor: dokument.ingressKallor?.filter(
                                  (id) => id !== not.id
                                ),
                                citat: dokument.citat
                                  ? {
                                      ...dokument.citat,
                                      kallor: dokument.citat.kallor?.filter(
                                        (id) => id !== not.id
                                      ),
                                    }
                                  : undefined,
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
                              kallaId: "",
                              lokalisering: "",
                              stod: "regel",
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
                Det här dokumentet är ännu inte skrivet.
              </p>
              {planeradeKallor.length > 0 && (
                <section className="border border-ink p-4 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="display text-[1.2rem]">Redaktionell källplan</h2>
                    <span className="nano border border-ink px-2 py-1">
                      Prioritet {produktionsprioritet(dokumentSokvag)}
                    </span>
                  </div>
                  <p className="micro opacity-65">
                    Dessa verk avgränsar artikeln. Färdig text kräver fortfarande
                    sidexakta hänvisningar till varje regel, tabell och belägg.
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {planeradeKallor.map((kalla) => (
                      <li key={kalla.id} className="micro flex gap-2">
                        <a href={`/kallor#${kalla.id}`} className="underline underline-offset-2 shrink-0">
                          {kalla.id}
                        </a>
                        <span>{kalla.titel}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
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
    </div>
  );
}
