"use client";

import Link from "next/link";
import type { Crumb } from "@/lib/typer";
import type { Block, Dokument } from "@/lib/dokument";
import Blocks, { NYA_BLOCK } from "./Blocks";
import Inline from "./Inline";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import { BlockHallare, Infogningsrad } from "@/components/admin/BlockVerktyg";

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
  const satt = (delar: Partial<Dokument>) =>
    dokument && onChange?.({ ...dokument, ...delar });

  const sattBlock = (i: number, block: Block) =>
    dokument &&
    onChange?.({
      ...dokument,
      block: dokument.block.map((b, bi) => (bi === i ? block : b)),
    });

  const infoga = (i: number, block: Block) =>
    dokument &&
    onChange?.({
      ...dokument,
      block: [...dokument.block.slice(0, i), block, ...dokument.block.slice(i)],
    });

  const flytta = (i: number, steg: -1 | 1) => {
    if (!dokument) return;
    const j = i + steg;
    if (j < 0 || j >= dokument.block.length) return;
    const block = [...dokument.block];
    [block[i], block[j]] = [block[j], block[i]];
    onChange?.({ ...dokument, block });
  };

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
                    <Redigerbar
                      varde={dokument.citat?.kalla ?? ""}
                      redigerbar={redigerbar}
                      platshallare="Källa"
                      onChange={(kalla) =>
                        satt({ citat: { text: dokument.citat?.text ?? "", kalla } })
                      }
                      className="nano not-italic opacity-55"
                    />
                  </div>
                </blockquote>
              )}

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

              <div className="flex flex-col gap-6">
                {redigerbar && (
                  <Infogningsrad
                    val={NYA_BLOCK}
                    onValj={(skapa) => infoga(0, skapa() as Block)}
                  />
                )}

                {dokument.block.map((block, i) => (
                  <div key={i} className="flex flex-col gap-6">
                    <BlockHallare
                      redigerbar={redigerbar}
                      onUpp={() => flytta(i, -1)}
                      onNed={() => flytta(i, 1)}
                      onTaBort={() =>
                        satt({ block: dokument.block.filter((_, bi) => bi !== i) })
                      }
                    >
                      <Blocks
                        block={block}
                        redigerbar={redigerbar}
                        onChange={(nytt) => sattBlock(i, nytt)}
                      />
                    </BlockHallare>

                    {redigerbar && (
                      <Infogningsrad
                        val={NYA_BLOCK}
                        onValj={(skapa) => infoga(i + 1, skapa() as Block)}
                      />
                    )}
                  </div>
                ))}
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
                          varde={not.text}
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
                Det här dokumentet är ännu inte skrivet.
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
    </div>
  );
}
