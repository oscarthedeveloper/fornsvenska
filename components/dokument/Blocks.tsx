"use client";

import type { Block } from "@/lib/dokument";
import Inline from "./Inline";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";

export default function Blocks({
  block,
  redigerbar = false,
  onChange,
}: {
  block: Block;
  redigerbar?: boolean;
  onChange?: (block: Block) => void;
}) {
  const uppdatera = (delar: Partial<Block>) =>
    onChange?.({ ...block, ...delar } as Block);

  switch (block.typ) {
    case "rubrik":
      return (
        <div className="flex items-center gap-3">
          <Redigerbar
            as="div"
            varde={block.text}
            redigerbar={redigerbar}
            platshallare="Rubrik"
            onChange={(text) => uppdatera({ text })}
            className={block.niva === 2 ? "doc-h2 mt-2" : "doc-h3 mt-1"}
          />
          {redigerbar && (
            <Knapp
              titel="Växla rubriknivå"
              onClick={() => uppdatera({ niva: block.niva === 2 ? 3 : 2 } as Partial<Block>)}
            >
              H{block.niva}
            </Knapp>
          )}
        </div>
      );

    case "stycke":
      return redigerbar ? (
        <Redigerbar
          as="p"
          varde={block.text}
          redigerbar
          flerRader
          platshallare="Brödtext. *kursiv* och [^1] för fotnot."
          onChange={(text) => uppdatera({ text })}
          className="doc-body"
        />
      ) : (
        <p className="doc-body">
          <Inline text={block.text} />
        </p>
      );

    /* Tvåspaltssystemet: smal spalt med fornsvenskt utdrag, bred spalt med
       förklaring. Läggs in där man vill ha det, inte automatiskt. */
    case "spalter":
      return (
        <div className="grid gap-5 md:gap-8 md:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
          <div className="border-l border-dashed border-ink pl-4 flex flex-col gap-2">
            <Redigerbar
              as="p"
              varde={block.utdrag}
              redigerbar={redigerbar}
              flerRader
              platshallare="Fornsvenskt utdrag"
              onChange={(utdrag) => uppdatera({ utdrag })}
              className="doc-excerpt"
            />
            <Redigerbar
              as="span"
              varde={block.utdragKalla ?? ""}
              redigerbar={redigerbar}
              platshallare="Källa"
              onChange={(utdragKalla) => uppdatera({ utdragKalla })}
              className="nano opacity-55"
            />
          </div>
          {redigerbar ? (
            <Redigerbar
              as="p"
              varde={block.kommentar}
              redigerbar
              flerRader
              platshallare="Förklaring"
              onChange={(kommentar) => uppdatera({ kommentar })}
              className="doc-body"
            />
          ) : (
            <p className="doc-body">
              <Inline text={block.kommentar} />
            </p>
          )}
        </div>
      );

    case "tabell": {
      const sattCell = (i: number, j: number, text: string) => {
        const rader = block.rader.map((rad, ri) =>
          ri === i ? rad.map((cell, ci) => (ci === j ? text : cell)) : rad
        );
        uppdatera({ rader } as Partial<Block>);
      };

      return (
        <figure className="flex flex-col gap-2">
          <Redigerbar
            as="div"
            varde={block.rubrik ?? ""}
            redigerbar={redigerbar}
            platshallare="Tabellrubrik"
            onChange={(rubrik) => uppdatera({ rubrik } as Partial<Block>)}
            className="nano opacity-60"
          />
          <table className="gram-table">
            <thead>
              <tr>
                {redigerbar && <th className="w-[2.2rem]" aria-hidden="true" />}
                {block.kolumner.map((k, j) => (
                  <th key={j} scope="col">
                    <Redigerbar
                      varde={k}
                      redigerbar={redigerbar}
                      platshallare="Kolumn"
                      onChange={(text) =>
                        uppdatera({
                          kolumner: block.kolumner.map((v, ji) => (ji === j ? text : v)),
                        } as Partial<Block>)
                      }
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rader.map((rad, i) => (
                <tr key={i} data-mark={block.markeraRad === i ? "1" : undefined}>
                  {redigerbar && (
                    <td className="text-center">
                      <Knapp
                        titel="Markera raden"
                        onClick={() =>
                          uppdatera({
                            markeraRad: block.markeraRad === i ? undefined : i,
                          } as Partial<Block>)
                        }
                      >
                        {block.markeraRad === i ? "●" : "○"}
                      </Knapp>
                    </td>
                  )}
                  {rad.map((cell, j) => (
                    <td key={j}>
                      <Redigerbar
                        varde={cell}
                        redigerbar={redigerbar}
                        platshallare="—"
                        onChange={(text) => sattCell(i, j, text)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {redigerbar && (
            <div className="flex gap-1.5 flex-wrap">
              <Knapp
                titel="Lägg till rad"
                onClick={() =>
                  uppdatera({
                    rader: [...block.rader, block.kolumner.map(() => "")],
                  } as Partial<Block>)
                }
              >
                + rad
              </Knapp>
              <Knapp
                titel="Ta bort sista raden"
                onClick={() =>
                  uppdatera({ rader: block.rader.slice(0, -1) } as Partial<Block>)
                }
              >
                − rad
              </Knapp>
              <Knapp
                titel="Lägg till kolumn"
                onClick={() =>
                  uppdatera({
                    kolumner: [...block.kolumner, "Ny"],
                    rader: block.rader.map((rad) => [...rad, ""]),
                  } as Partial<Block>)
                }
              >
                + kolumn
              </Knapp>
              <Knapp
                titel="Ta bort sista kolumnen"
                onClick={() =>
                  uppdatera({
                    kolumner: block.kolumner.slice(0, -1),
                    rader: block.rader.map((rad) => rad.slice(0, -1)),
                  } as Partial<Block>)
                }
              >
                − kolumn
              </Knapp>
            </div>
          )}
        </figure>
      );
    }

    case "obs":
      return (
        <aside className="border border-ink bg-paper flex">
          <span className="bg-ink text-paper nano px-2 py-3 flex items-start shrink-0">
            <Redigerbar
              varde={block.etikett ?? "Obs"}
              redigerbar={redigerbar}
              platshallare="Obs"
              onChange={(etikett) => uppdatera({ etikett } as Partial<Block>)}
            />
          </span>
          {redigerbar ? (
            <Redigerbar
              as="p"
              varde={block.text}
              redigerbar
              flerRader
              platshallare="Anmärkning"
              onChange={(text) => uppdatera({ text })}
              className="doc-body p-4 text-[0.94rem] flex-1"
            />
          ) : (
            <p className="doc-body p-4 text-[0.94rem]">
              <Inline text={block.text} />
            </p>
          )}
        </aside>
      );

    case "nycklar":
      return (
        <dl className="border-t border-dashed border-ink">
          {block.poster.map((post, i) => (
            <div
              key={i}
              className="grid grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)_auto] gap-4 border-b border-dashed border-ink py-2"
            >
              <dt className="nano opacity-60 self-center">
                <Redigerbar
                  varde={post.nyckel}
                  redigerbar={redigerbar}
                  platshallare="Nyckel"
                  onChange={(nyckel) =>
                    uppdatera({
                      poster: block.poster.map((p, pi) =>
                        pi === i ? { ...p, nyckel } : p
                      ),
                    } as Partial<Block>)
                  }
                />
              </dt>
              <dd className="text-[0.72rem] tracking-[0.02em] self-center">
                <Redigerbar
                  varde={post.varde}
                  redigerbar={redigerbar}
                  platshallare="Värde"
                  onChange={(varde) =>
                    uppdatera({
                      poster: block.poster.map((p, pi) =>
                        pi === i ? { ...p, varde } : p
                      ),
                    } as Partial<Block>)
                  }
                />
              </dd>
              {redigerbar && (
                <Knapp
                  titel="Ta bort raden"
                  fara
                  onClick={() =>
                    uppdatera({
                      poster: block.poster.filter((_, pi) => pi !== i),
                    } as Partial<Block>)
                  }
                >
                  ✕
                </Knapp>
              )}
            </div>
          ))}
          {redigerbar && (
            <Knapp
              titel="Lägg till rad"
              onClick={() =>
                uppdatera({
                  poster: [...block.poster, { nyckel: "", varde: "" }],
                } as Partial<Block>)
              }
            >
              + rad
            </Knapp>
          )}
        </dl>
      );

    /* Flikblocket ritas av Blocklista — en flik innehåller i sin tur en
       blocklista, och den kedjan hör hemma på ett ställe. */
    default:
      return null;
  }
}

/** Nya block med rimliga utgångsvärden. */
export const NYA_BLOCK: { etikett: string; skapa: () => Block }[] = [
  { etikett: "Rubrik", skapa: () => ({ typ: "rubrik", niva: 2, text: "Ny rubrik" }) },
  { etikett: "Stycke", skapa: () => ({ typ: "stycke", text: "" }) },
  {
    etikett: "Tvåspalt",
    skapa: () => ({ typ: "spalter", utdrag: "", utdragKalla: "", kommentar: "" }),
  },
  {
    etikett: "Tabell",
    skapa: () => ({
      typ: "tabell",
      rubrik: "",
      kolumner: ["Kasus", "Singularis", "Pluralis"],
      rader: [
        ["Nominativ", "", ""],
        ["Genitiv", "", ""],
        ["Dativ", "", ""],
        ["Ackusativ", "", ""],
      ],
    }),
  },
  { etikett: "OBS-ruta", skapa: () => ({ typ: "obs", etikett: "Obs", text: "" }) },
  {
    etikett: "Nyckelvärden",
    skapa: () => ({ typ: "nycklar", poster: [{ nyckel: "", varde: "" }] }),
  },
  {
    etikett: "Flikar",
    skapa: () => ({
      typ: "flikar",
      flikar: [
        { etikett: "Flik 1", block: [] },
        { etikett: "Flik 2", block: [] },
      ],
    }),
  },
];
