"use client";

import { useState } from "react";
import { nyttId, type Resurs, type Skriftversion } from "@/lib/resurstyper";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import MarkeradText, { etiketterI } from "./MarkeradText";

/**
 * Läsaren för en skrift.
 *
 * Öppnas i sidan, aldrig i ett nytt fönster: hela poängen är att kunna hoppa
 * mellan versionerna av samma text — grundtext, pronomen markerade, verb
 * markerade — utan att tappa stället. Versionerna ligger som flikar, samma
 * form som flikblocket i dokumenten.
 */
export default function SkriftLasare({
  resurs,
  redigerbar,
  onChange,
  onStang,
}: {
  resurs: Resurs;
  redigerbar: boolean;
  onChange: (delar: Partial<Resurs>) => void;
  onStang: () => void;
}) {
  const [vald, setVald] = useState(0);
  const versioner = resurs.versioner ?? [];
  const aktiv = Math.min(vald, Math.max(0, versioner.length - 1));
  const version: Skriftversion | undefined = versioner[aktiv];

  const sattVersioner = (nya: Skriftversion[]) => onChange({ versioner: nya });

  const sattVersion = (i: number, delar: Partial<Skriftversion>) =>
    sattVersioner(versioner.map((v, vi) => (vi === i ? { ...v, ...delar } : v)));

  const laggTill = () => {
    sattVersioner([
      ...versioner,
      {
        id: nyttId(),
        etikett: versioner.length === 0 ? "Grundtext" : "Ny version",
        note: "",
        innehall: "",
      },
    ]);
    setVald(versioner.length);
  };

  const flytta = (steg: -1 | 1) => {
    const j = aktiv + steg;
    if (j < 0 || j >= versioner.length) return;
    const kopia = [...versioner];
    [kopia[aktiv], kopia[j]] = [kopia[j], kopia[aktiv]];
    sattVersioner(kopia);
    setVald(j);
  };

  const etiketter = etiketterI(version?.innehall ?? "");

  return (
    <section className="lasare" aria-label={`Läsare: ${resurs.titel}`}>
      <header className="lasare-topp">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="nano opacity-50">Skriftkammaren</span>
          <h3 className="display text-[1.35rem] leading-[1.15]">{resurs.titel}</h3>
          <span className="nano opacity-55">
            {[resurs.ar, resurs.utgivare, resurs.forfattare]
              .filter(Boolean)
              .join(" · ") || "Odaterad"}
          </span>
        </div>
        <Knapp titel="Stäng läsaren" onClick={onStang}>
          ✕
        </Knapp>
      </header>

      {versioner.length === 0 ? (
        <div className="lasare-tom">
          <p className="doc-body opacity-70">
            Den här skriften har ingen text ännu.
          </p>
          {redigerbar && (
            <Knapp titel="Lägg till version" onClick={laggTill}>
              + version
            </Knapp>
          )}
        </div>
      ) : (
        <div className="flikar">
          <div className="flikrad" role="tablist" aria-label="Versioner">
            {versioner.map((v, i) => (
              <div
                key={v.id}
                role="tab"
                id={`version-${v.id}`}
                aria-selected={i === aktiv}
                aria-controls={`versionpanel-${v.id}`}
                tabIndex={i === aktiv ? 0 : -1}
                data-vald={i === aktiv ? "1" : undefined}
                className="flik micro"
                onClick={() => setVald(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") setVald((i + 1) % versioner.length);
                  if (e.key === "ArrowLeft")
                    setVald((i - 1 + versioner.length) % versioner.length);
                }}
              >
                {redigerbar && i === aktiv ? (
                  <Redigerbar
                    varde={v.etikett}
                    redigerbar
                    formatering={false}
                    platshallare="Versionens namn"
                    onChange={(etikett) => sattVersion(i, { etikett })}
                  />
                ) : (
                  v.etikett || "—"
                )}
              </div>
            ))}

            {redigerbar && (
              <span className="flikverktyg">
                <Knapp titel="Flytta versionen åt vänster" onClick={() => flytta(-1)}>
                  ‹
                </Knapp>
                <Knapp titel="Flytta versionen åt höger" onClick={() => flytta(1)}>
                  ›
                </Knapp>
                <Knapp titel="Lägg till version" onClick={laggTill}>
                  + version
                </Knapp>
                <Knapp
                  titel="Ta bort den valda versionen"
                  fara
                  onClick={() => {
                    sattVersioner(versioner.filter((_, vi) => vi !== aktiv));
                    setVald(Math.max(0, aktiv - 1));
                  }}
                >
                  ✕
                </Knapp>
              </span>
            )}
          </div>

          <div
            role="tabpanel"
            id={`versionpanel-${version?.id ?? "tom"}`}
            aria-labelledby={`version-${version?.id ?? "tom"}`}
            className="flikpanel flex flex-col gap-4"
          >
            {(version?.note || redigerbar) && (
              <Redigerbar
                as="p"
                varde={version?.note ?? ""}
                redigerbar={redigerbar}
                platshallare="Vad är markerat i den här versionen?"
                onChange={(note) => sattVersion(aktiv, { note })}
                className="nano opacity-60"
              />
            )}

            {etiketter.length > 0 && (
              <ul className="teckenforklaring" aria-label="Teckenförklaring">
                {etiketter.map((etikett, i) => (
                  <li key={etikett}>
                    <span className="mark-chip" data-mark={i % 5} aria-hidden="true" />
                    <span className="nano">{etikett}</span>
                  </li>
                ))}
              </ul>
            )}

            {redigerbar ? (
              <>
                <Redigerbar
                  as="div"
                  varde={version?.innehall ?? ""}
                  redigerbar
                  flerRader
                  formatering={false}
                  platshallare="Skriftens text. ==ordet|Pronomen== markerar ett ord."
                  onChange={(innehall) => sattVersion(aktiv, { innehall })}
                  className="skrift-text skrift-falt"
                />
                <p className="nano opacity-45 leading-[1.7]">
                  ==ordet== markerar med första tonen. ==ordet|Verb== ger
                  etiketten Verb en egen ton och en rad i teckenförklaringen.
                  Tomrad bryter stycke.
                </p>
              </>
            ) : (
              <MarkeradText text={version?.innehall ?? ""} etiketter={etiketter} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
