"use client";

import { TYPER, TYPNAMN, type Resurs, type Resurstyp } from "@/lib/resurstyper";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import Kalluppgifter from "./Kalluppgifter";
import Omslag from "./Omslag";
import Omslagsvaljare from "./Omslagsvaljare";
import Tillganglighet from "./Tillganglighet";

/**
 * Kortet till höger: allt som är känt om den valda resursen.
 *
 * Samma ordning som i katalogposten — omslag, titel, upphov, sedan vad man
 * faktiskt kan göra med den, och först därefter metadata och beskrivning.
 */
export default function ResursPanel({
  resurs,
  redigerbar,
  onChange,
  onTaBort,
  onFlytta,
  onLas,
  antal,
}: {
  resurs: Resurs | null;
  redigerbar: boolean;
  onChange: (delar: Partial<Resurs>) => void;
  onTaBort: () => void;
  onFlytta: (steg: -1 | 1) => void;
  onLas?: () => void;
  antal: { resurser: number; hyllor: number; skrifter: number };
}) {
  if (!resurs) {
    return (
      <aside className="resurspanel">
        <div className="flex flex-col gap-3">
          <span className="nano opacity-50">Biblioteket</span>
          <p className="doc-body text-[0.95rem] opacity-75">
            Välj en resurs för att se bibliografi, källuppgifter och
            tillgängliga läsvyer.
          </p>
          <dl className="resursfakta">
            <div>
              <dt>Resurser</dt>
              <dd>{antal.resurser}</dd>
            </div>
            <div>
              <dt>Hyllor</dt>
              <dd>{antal.hyllor}</dd>
            </div>
            <div>
              <dt>Skrifter</dt>
              <dd>{antal.skrifter}</dd>
            </div>
          </dl>
        </div>
      </aside>
    );
  }

  return (
    <aside className="resurspanel">
      <div className="flex gap-4">
        <span className="resurspanel-omslag">
          <Omslag resurs={resurs} storlek="stor" />
        </span>

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <Redigerbar
            as="div"
            varde={resurs.titel}
            redigerbar={redigerbar}
            platshallare="Titel"
            onChange={(titel) => onChange({ titel })}
            className="display text-[1.15rem] leading-[1.2]"
          />
          <Redigerbar
            varde={resurs.forfattare ?? ""}
            redigerbar={redigerbar}
            platshallare="Författare"
            onChange={(forfattare) => onChange({ forfattare })}
            className="micro opacity-70"
          />
          {redigerbar ? (
            <select
              className="valjare nano"
              value={resurs.typ}
              onChange={(e) => onChange({ typ: e.target.value as Resurstyp })}
            >
              {TYPER.map((t) => (
                <option key={t} value={t}>
                  {TYPNAMN[t]}
                </option>
              ))}
            </select>
          ) : (
            <span className="nano opacity-50">{TYPNAMN[resurs.typ]}</span>
          )}
        </div>
      </div>

      {redigerbar && (
        <Omslagsvaljare
          resursId={resurs.id}
          harOmslag={Boolean(resurs.omslag)}
          onKlar={(url) => onChange({ omslag: url ?? "" })}
        />
      )}

      <div className="flex flex-col gap-2">
        {resurs.typ === "skrift" && onLas && (
          <button type="button" className="resursknapp primar" onClick={onLas}>
            {resurs.bok ? "Öppna bokvyn" : "Läs i sidan"}
          </button>
        )}

        {resurs.lank ? (
          <a
            className="resursknapp"
            href={resurs.lank}
            target="_blank"
            rel="noopener noreferrer"
          >
            {resurs.bok ? "Öppna original-PDF" : "Öppna hos utgivaren"} &gt;&gt;
          </a>
        ) : (
          !redigerbar && (
            <span className="resursknapp inaktiv">Ingen länk till nätutgåva registrerad</span>
          )
        )}

        {redigerbar && (
          <label className="flex flex-col gap-1">
            <span className="nano opacity-50">Länk</span>
            <Redigerbar
              varde={resurs.lank ?? ""}
              redigerbar
              formatering={false}
              platshallare="https://…"
              onChange={(lank) => onChange({ lank })}
              className="text-[0.62rem] break-all"
            />
          </label>
        )}
      </div>

      <dl className="resursfakta">
        <div>
          <dt>Tillgänglighet</dt>
          <dd>
            <Tillganglighet
              varde={resurs.tillganglighet}
              redigerbar={redigerbar}
              onChange={(tillganglighet) => onChange({ tillganglighet })}
            />
          </dd>
        </div>
        <div>
          <dt>År</dt>
          <dd>
            <Redigerbar
              varde={resurs.ar ?? ""}
              redigerbar={redigerbar}
              platshallare="—"
              onChange={(ar) => onChange({ ar })}
            />
          </dd>
        </div>
        <div>
          <dt>{resurs.typ === "skrift" ? "Handskrift" : "Utgivare"}</dt>
          <dd>
            <Redigerbar
              varde={resurs.utgivare ?? ""}
              redigerbar={redigerbar}
              platshallare="—"
              onChange={(utgivare) => onChange({ utgivare })}
            />
          </dd>
        </div>
      </dl>

      {(resurs.beskrivning || redigerbar) && (
        <Redigerbar
          as="p"
          varde={resurs.beskrivning ?? ""}
          redigerbar={redigerbar}
          flerRader
          platshallare="Vad är det här för något, och vad duger den till?"
          onChange={(beskrivning) => onChange({ beskrivning })}
          className="doc-body text-[0.9rem]"
        />
      )}

      {resurs.kalla && <Kalluppgifter kalla={resurs.kalla} artiklar={resurs.artiklar} />}

      {redigerbar && (
        <div className="flex gap-1.5 flex-wrap pt-1 border-t border-dashed border-ink">
          <Knapp titel="Flytta åt vänster" onClick={() => onFlytta(-1)}>
            ‹
          </Knapp>
          <Knapp titel="Flytta åt höger" onClick={() => onFlytta(1)}>
            ›
          </Knapp>
          <Knapp
            titel="Växla utkaststatus"
            onClick={() => onChange({ utkast: !resurs.utkast })}
          >
            {resurs.utkast ? "Utkast ●" : "Utkast ○"}
          </Knapp>
          <Knapp titel="Ta bort resursen" fara onClick={onTaBort}>
            ✕ ta bort
          </Knapp>
        </div>
      )}
    </aside>
  );
}
