"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Toppnav from "@/components/Toppnav";
import Redigerbar from "@/components/admin/Redigerbar";
import { useAdmin } from "@/components/admin/AdminContext";
import { sparaStartinnehall } from "@/lib/sidActions";
import type { Startinnehall } from "@/lib/sidtyper";
import Runsten3D from "./Runsten3D";
import { useTilt } from "./useTilt";

/**
 * Startsidan.
 *
 * Ett enda uppslag: kort introduktion och en monumental runsten som kommer
 * snett nedifrån vänster. Stenen fortsätter under sidans kant; den är inte
 * avkapad i modellen, bara i kamerans utsnitt.
 *
 * All text är redigerbar på plats för inloggad administratör och sparas en
 * kort stund efter senaste tangenttryckningen, samma sätt som dokumentvyn.
 */
export default function Startsida({ initial }: { initial: Startinnehall }) {
  const { redigerar, setStatus, setFelmeddelande } = useAdmin();
  const { scen } = useTilt();

  const [text, setText] = useState<Startinnehall>(initial);
  const senasteText = useRef<Startinnehall>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    senasteText.current = initial;
    setText(initial);
  }, [initial]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const andra = useCallback(
    (delar: Partial<Startinnehall>) => {
      const nytt = { ...senasteText.current, ...delar };
      senasteText.current = nytt;
      setText(nytt);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        setStatus("sparar");
        const svar = await sparaStartinnehall(nytt);
        if (svar.ok) {
          setStatus("sparat");
          setFelmeddelande(null);
        } else {
          setStatus("fel");
          setFelmeddelande(svar.fel ?? "Okänt fel");
        }
      }, 800);
    },
    [setStatus, setFelmeddelande]
  );

  return (
    <main
      className="startsida viewport-lock"
      data-redigerar={redigerar ? "1" : undefined}
    >
      <Toppnav />

      <section className="start-huvud">
        <div className="start-ogonbryn">
          <Redigerbar
            varde={text.ogonrunor}
            redigerbar={redigerar}
            formatering={false}
            platshallare="Runrad"
            onChange={(ogonrunor) => andra({ ogonrunor })}
            className="rune"
          />
          <Redigerbar
            varde={text.ogonetikett}
            redigerbar={redigerar}
            formatering={false}
            platshallare="Etikett"
            onChange={(ogonetikett) => andra({ ogonetikett })}
          />
        </div>

        <Redigerbar
          as="div"
          varde={text.rubrik}
          redigerbar={redigerar}
          flerRader
          platshallare="Rubrik"
          onChange={(rubrik) => andra({ rubrik })}
          className="display start-rubrik"
        />

        <div className="start-spalter">
          <Redigerbar
            as="p"
            varde={text.spaltA}
            redigerbar={redigerar}
            flerRader
            platshallare="Vänster spalt"
            onChange={(spaltA) => andra({ spaltA })}
          />
          <Redigerbar
            as="p"
            varde={text.spaltB}
            redigerbar={redigerar}
            flerRader
            platshallare="Höger spalt"
            onChange={(spaltB) => andra({ spaltB })}
          />
        </div>

        <div className="start-knapprad">
          {redigerar ? (
            <span className="faktaknapp">
              <Redigerbar
                varde={text.knapp}
                redigerbar
                formatering={false}
                platshallare="Knapptext"
                onChange={(knapp) => andra({ knapp })}
              />
            </span>
          ) : (
            <Link href="/grammatik" className="faktaknapp">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 4.5h4l1.5 2h7.5v7h-13z" />
              </svg>
              {text.knapp}
            </Link>
          )}
        </div>
      </section>

      <div className="start-scen" ref={scen}>
        <div className="stenplats">
          <Runsten3D />
        </div>


      </div>
    </main>
  );
}
