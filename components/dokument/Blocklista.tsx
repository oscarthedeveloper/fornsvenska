"use client";

import { useState } from "react";
import type { Block, Flik, Fotnot } from "@/lib/dokument";
import Blocks, { NYA_BLOCK } from "./Blocks";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";
import { BlockHallare, Infogningsrad } from "@/components/admin/BlockVerktyg";

/**
 * En lista block med redigeringsverktygen runt sig.
 *
 * Samma komponent bär både dokumentets huvudflöde och innehållet i en flik.
 * Därför ligger flikblocket här och inte i Blocks: en flik innehåller en
 * blocklista, och en blocklista ritar flikar — hade de legat i skilda filer
 * hade de importerat varandra i ring.
 */
export default function Blocklista({
  block,
  redigerbar = false,
  onChange,
  tillatFlikar = true,
  fotnoter = [],
}: {
  block: Block[];
  redigerbar?: boolean;
  onChange?: (block: Block[]) => void;
  /** Falskt inne i en flik: flikar i flikar blir obegripliga att navigera. */
  tillatFlikar?: boolean;
  /** Dokumentets källista. Valda nummer kan kopplas till hela block. */
  fotnoter?: Fotnot[];
}) {
  const val = tillatFlikar
    ? NYA_BLOCK
    : NYA_BLOCK.filter((v) => v.etikett !== "Flikar");

  const satt = (i: number, nytt: Block) =>
    onChange?.(block.map((b, bi) => (bi === i ? nytt : b)));

  const infoga = (i: number, nytt: Block) =>
    onChange?.([...block.slice(0, i), nytt, ...block.slice(i)]);

  const flytta = (i: number, steg: -1 | 1) => {
    const j = i + steg;
    if (j < 0 || j >= block.length) return;
    const kopia = [...block];
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
    onChange?.(kopia);
  };

  const rita = (b: Block, i: number) =>
    b.typ === "flikar" ? (
      <Flikblock
        block={b}
        redigerbar={redigerbar}
        fotnoter={fotnoter}
        onChange={(nytt) => satt(i, nytt)}
      />
    ) : (
      <Blocks block={b} redigerbar={redigerbar} onChange={(nytt) => satt(i, nytt)} />
    );

  return (
    <div className="flex flex-col gap-6">
      {redigerbar && (
        <Infogningsrad
          val={val}
          alltidSynlig={block.length === 0}
          onValj={(skapa) => infoga(0, skapa() as Block)}
        />
      )}

      {block.map((b, i) => (
        <div key={i} className="flex flex-col gap-6">
          <BlockHallare
            redigerbar={redigerbar}
            onUpp={() => flytta(i, -1)}
            onNed={() => flytta(i, 1)}
            onTaBort={() => onChange?.(block.filter((_, bi) => bi !== i))}
          >
            <section className="doc-blocksektion">
              {rita(b, i)}
              <Blockkallor
                block={b}
                fotnoter={fotnoter}
                redigerbar={redigerbar}
                onChange={(kallor) =>
                  satt(i, {
                    ...b,
                    kallor: kallor.length > 0 ? kallor : undefined,
                  } as Block)
                }
              />
            </section>
          </BlockHallare>

          {redigerbar && (
            <Infogningsrad val={val} onValj={(skapa) => infoga(i + 1, skapa() as Block)} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * En blockhänvisning belägger hela innehållsenheten — exempelvis båda
 * spalterna eller hela tabellen. I redigeringsläget väljs källorna med
 * nummer från dokumentets ordinarie källista.
 */
function Blockkallor({
  block,
  fotnoter,
  redigerbar,
  onChange,
}: {
  block: Block;
  fotnoter: Fotnot[];
  redigerbar: boolean;
  onChange: (kallor: number[]) => void;
}) {
  const valda = [...new Set(block.kallor ?? [])].sort((a, b) => a - b);
  const valbara = [
    ...new Set([...fotnoter.map((fotnot) => fotnot.id), ...valda]),
  ].sort((a, b) => a - b);

  if (!redigerbar && valda.length === 0) return null;

  if (!redigerbar) {
    return (
      <aside
        className="doc-blockkallor"
        aria-label={`Källa för hela avsnittet: ${valda.join(", ")}`}
      >
        <span>Källa för hela avsnittet</span>
        {valda.map((id) => (
          <a key={id} href={`#not-${id}`} aria-label={`Källa ${id}`}>
            {id}
          </a>
        ))}
      </aside>
    );
  }

  return (
    <div className="doc-blockkallor doc-blockkallor-admin">
      <span>Hela blockets källa</span>
      {valbara.length > 0 ? (
        <div role="group" aria-label="Välj källor för hela blocket">
          {valbara.map((id) => {
            const vald = valda.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={vald}
                data-vald={vald ? "1" : undefined}
                title={`${vald ? "Ta bort" : "Använd"} källa ${id} för hela blocket`}
                onClick={() =>
                  onChange(
                    vald
                      ? valda.filter((kalla) => kalla !== id)
                      : [...valda, id].sort((a, b) => a - b)
                  )
                }
              >
                {id}
              </button>
            );
          })}
        </div>
      ) : (
        <span className="doc-blockkallor-tom">Lägg först till en källa längst ned</span>
      )}
    </div>
  );
}

/** Flikarna. Bara en flik i taget syns; den valda ligger i lokalt tillstånd. */
function Flikblock({
  block,
  redigerbar,
  fotnoter,
  onChange,
}: {
  block: Extract<Block, { typ: "flikar" }>;
  redigerbar: boolean;
  fotnoter: Fotnot[];
  onChange: (block: Block) => void;
}) {
  const [vald, setVald] = useState(0);
  const flikar = block.flikar;
  const aktiv = Math.min(vald, Math.max(0, flikar.length - 1));

  const sattFlikar = (nya: Flik[]) => onChange({ ...block, flikar: nya });

  const sattFlik = (i: number, delar: Partial<Flik>) =>
    sattFlikar(flikar.map((f, fi) => (fi === i ? { ...f, ...delar } : f)));

  const flyttaFlik = (steg: -1 | 1) => {
    const j = aktiv + steg;
    if (j < 0 || j >= flikar.length) return;
    const kopia = [...flikar];
    [kopia[aktiv], kopia[j]] = [kopia[j], kopia[aktiv]];
    sattFlikar(kopia);
    setVald(j);
  };

  if (flikar.length === 0) {
    return redigerbar ? (
      <Knapp
        titel="Lägg till flik"
        onClick={() => sattFlikar([{ etikett: "Ny flik", block: [] }])}
      >
        + flik
      </Knapp>
    ) : null;
  }

  return (
    <div className="flikar">
      <div className="flikrad" role="tablist" aria-label="Flikar">
        {flikar.map((flik, i) => (
          /* Div och inte button: i redigeringsläget bor ett contentEditable-fält
             inne i fliken, och mellanslag i en knapp klickar knappen. */
          <div
            key={i}
            role="tab"
            id={`flik-${i}`}
            aria-selected={i === aktiv}
            aria-controls={`flikpanel-${i}`}
            tabIndex={i === aktiv ? 0 : -1}
            data-vald={i === aktiv ? "1" : undefined}
            className="flik micro"
            onClick={() => setVald(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setVald((i + 1) % flikar.length);
              if (e.key === "ArrowLeft") setVald((i - 1 + flikar.length) % flikar.length);
              if (!redigerbar && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                setVald(i);
              }
            }}
          >
            {redigerbar && i === aktiv ? (
              <Redigerbar
                varde={flik.etikett}
                redigerbar
                formatering={false}
                platshallare="Fliknamn"
                onChange={(etikett) => sattFlik(i, { etikett })}
              />
            ) : (
              flik.etikett || "—"
            )}
          </div>
        ))}

        {redigerbar && (
          <span className="flikverktyg">
            <Knapp titel="Flytta fliken åt vänster" onClick={() => flyttaFlik(-1)}>
              ‹
            </Knapp>
            <Knapp titel="Flytta fliken åt höger" onClick={() => flyttaFlik(1)}>
              ›
            </Knapp>
            <Knapp
              titel="Lägg till flik"
              onClick={() => {
                sattFlikar([...flikar, { etikett: "Ny flik", block: [] }]);
                setVald(flikar.length);
              }}
            >
              + flik
            </Knapp>
            <Knapp
              titel="Ta bort den valda fliken"
              fara
              onClick={() => {
                sattFlikar(flikar.filter((_, fi) => fi !== aktiv));
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
        id={`flikpanel-${aktiv}`}
        aria-labelledby={`flik-${aktiv}`}
        className="flikpanel"
      >
        <Blocklista
          block={flikar[aktiv]?.block ?? []}
          redigerbar={redigerbar}
          tillatFlikar={false}
          fotnoter={fotnoter}
          onChange={(nytt) => sattFlik(aktiv, { block: nytt })}
        />
      </div>
    </div>
  );
}
