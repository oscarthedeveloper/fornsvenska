"use client";

import type { Sektion as SektionTyp } from "@/lib/text";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import { rensaKlickatOrd } from "@/lib/ordbok/kandidater";
import KlickbarFsvMening, {
  type KlickatOrdKontext,
} from "./KlickbarFsvMening";

/**
 * En sektion av utdraget: fornsvensk text till vänster, tolkning till höger,
 * i två lika breda spalter. Varje mening får sin färg OCH sitt nummer —
 * numret är det som binder ihop spalterna, färgen är stödet.
 */
export default function Sektion({
  sektion,
  index,
  redigerbar = false,
  aktivtRensatOrd = null,
  onKlickaOrd,
  onChange,
  onTaBort,
}: {
  sektion: SektionTyp;
  index: number;
  redigerbar?: boolean;
  aktivtRensatOrd?: string | null;
  onKlickaOrd?: (kontext: KlickatOrdKontext) => void;
  onChange?: (s: SektionTyp) => void;
  onTaBort?: () => void;
}) {
  const satt = (delar: Partial<SektionTyp>) => onChange?.({ ...sektion, ...delar });

  const sattMening = (i: number, delar: Partial<SektionTyp["meningar"][number]>) =>
    satt({
      meningar: sektion.meningar.map((m, mi) => (mi === i ? { ...m, ...delar } : m)),
    });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4 border-b border-ink pb-2">
        <Redigerbar
          varde={sektion.rubrik ?? `Sektion ${String(index + 1).padStart(2, "0")}`}
          redigerbar={redigerbar}
          platshallare="Sektionsrubrik"
          onChange={(rubrik) => satt({ rubrik })}
          className="micro"
        />
        <span className="flex items-center gap-2">
          <Redigerbar
            varde={sektion.hanvisning ?? ""}
            redigerbar={redigerbar}
            platshallare="Hänvisning"
            onChange={(hanvisning) => satt({ hanvisning })}
            className="nano opacity-55 text-right"
          />
          {redigerbar && (
            <Knapp titel="Ta bort sektionen" fara onClick={() => onTaBort?.()}>
              ✕
            </Knapp>
          )}
        </span>
      </header>

      <div className="grid gap-6 md:gap-10 md:grid-cols-2">
        {/* Utdraget — meningarna löper som en text, var och en markerad */}
        <div className="text-excerpt">
          {sektion.meningar.map((mening, i) => (
            <span key={i}>
              <mark className="mark-sent" data-mark={i % 5}>
                {!redigerbar && onKlickaOrd ? (
                  <KlickbarFsvMening
                    text={mening.fsv}
                    aktivtRensatOrd={aktivtRensatOrd}
                    onSelectWord={(ord) => {
                      const rensatOrd = rensaKlickatOrd(ord);
                      if (!rensatOrd) return;
                      onKlickaOrd({
                        ord,
                        rensatOrd,
                        meningFsv: mening.fsv,
                        meningTolkning: mening.tolkning,
                        meningKommentar: mening.kommentar,
                        sektionRubrik:
                          sektion.rubrik ??
                          `Sektion ${String(index + 1).padStart(2, "0")}`,
                        sektionHanvisning: sektion.hanvisning,
                        meningNr: i + 1,
                      });
                    }}
                  />
                ) : (
                  <Redigerbar
                    varde={mening.fsv}
                    redigerbar={redigerbar}
                    platshallare="Mening på fornsvenska"
                    onChange={(fsv) => sattMening(i, { fsv })}
                  />
                )}
                <span className="text-sup">{i + 1}</span>
              </mark>{" "}
            </span>
          ))}
        </div>

        {/* Tolkningen — en mening i taget */}
        <div className="flex flex-col gap-4">
          {sektion.meningar.map((mening, i) => (
            <div key={i} className="flex gap-3">
              <span className="mark-chip" data-mark={i % 5} aria-hidden="true">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <Redigerbar
                  as="p"
                  varde={mening.tolkning}
                  redigerbar={redigerbar}
                  flerRader
                  platshallare="Översättning och tolkning"
                  onChange={(tolkning) => sattMening(i, { tolkning })}
                  className="doc-body text-[0.96rem]"
                />
                <Redigerbar
                  as="p"
                  varde={mening.kommentar ?? ""}
                  redigerbar={redigerbar}
                  flerRader
                  platshallare="Grammatisk anmärkning"
                  onChange={(kommentar) => sattMening(i, { kommentar })}
                  className="text-[0.62rem] leading-[1.6] opacity-65"
                />
              </div>
              {redigerbar && (
                <Knapp
                  titel="Ta bort meningen"
                  fara
                  onClick={() =>
                    satt({ meningar: sektion.meningar.filter((_, mi) => mi !== i) })
                  }
                >
                  ✕
                </Knapp>
              )}
            </div>
          ))}

          {redigerbar && (
            <Knapp
              titel="Lägg till mening"
              onClick={() =>
                satt({
                  meningar: [...sektion.meningar, { fsv: "", tolkning: "" }],
                })
              }
            >
              + mening {sektion.meningar.length >= 5 ? "(över fem)" : ""}
            </Knapp>
          )}
        </div>
      </div>
    </section>
  );
}
