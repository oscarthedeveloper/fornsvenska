"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Node } from "@/lib/typer";
import { bytNamn, flyttaNod, skapaNod, taBortNod } from "@/lib/actions";
import { useAdmin } from "@/components/admin/AdminContext";
import Knapp from "@/components/admin/Knapp";
import FolderStack from "./FolderStack";
import TreeView from "./TreeView";

type View = "arkiv" | "trad";

const LAGRINGSNYCKEL = "fsv:arkivvy";

/**
 * Växlingen mellan hängmappsvyn och trädvyn.
 *
 * Arkivvyn är förvald första gången, men valet sparas och följer med när man
 * går in i ett dokument och tillbaka igen. Läsningen sker i en effekt och inte
 * i initialvärdet: servern renderar alltid arkivvyn, så ett synkront värde
 * skulle ge hydreringsfel.
 */
export default function ArchiveViews({
  items,
  title,
  basePath,
  counts,
  root,
  parentId,
}: {
  items: Node[];
  title: string;
  /** Sökvägen till nuvarande mapp, t.ex. ["grammatik", "substantiv"]. */
  basePath: string[];
  counts: { folders: number; docs: number };
  root: string;
  /** Databas-id för mappen vi står i, null på rotnivå. */
  parentId: string | null;
}) {
  const router = useRouter();
  const { redigerar, setStatus, setFelmeddelande } = useAdmin();
  const [view, setView] = useState<View>("arkiv");

  useEffect(() => {
    const sparad = window.localStorage.getItem(LAGRINGSNYCKEL);
    if (sparad === "trad" || sparad === "arkiv") setView(sparad);
  }, []);

  const valj = (v: View) => {
    setView(v);
    window.localStorage.setItem(LAGRINGSNYCKEL, v);
  };

  const hrefForPath = (path: string[]) => `/${[...basePath, ...path].join("/")}`;
  const hrefFor = (node: Node) => hrefForPath([node.slug]);

  async function kor(fn: () => Promise<{ ok: boolean; fel?: string }>) {
    setStatus("sparar");
    const svar = await fn();
    if (svar.ok) {
      setStatus("sparat");
      setFelmeddelande(null);
      router.refresh();
    } else {
      setStatus("fel");
      setFelmeddelande(svar.fel ?? "Okänt fel");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 max-w-[960px] mx-auto w-full flex-wrap">
        <span className="nano opacity-50">
          {view === "arkiv" ? "Hängmappar" : "Trädstruktur"}
        </span>

        <div className="flex items-center gap-3">
          {redigerar && (
            <div className="flex gap-1.5">
              <Knapp
                titel="Ny mapp här"
                onClick={() =>
                  kor(() =>
                    skapaNod({
                      root,
                      parentId,
                      kind: "folder",
                      title: "Ny mapp",
                      basHref: `/${basePath.join("/")}`,
                    })
                  )
                }
              >
                + Mapp
              </Knapp>
              <Knapp
                titel="Nytt dokument här"
                onClick={() =>
                  kor(() =>
                    skapaNod({
                      root,
                      parentId,
                      kind: "doc",
                      title: "Nytt dokument",
                      basHref: `/${basePath.join("/")}`,
                    })
                  )
                }
              >
                + Dokument
              </Knapp>
            </div>
          )}

          <div className="flex" role="group" aria-label="Välj vy">
            {(
              [
                ["arkiv", "Arkiv"],
                ["trad", "Träd"],
              ] as const
            ).map(([key, label], i) => (
              <button
                key={key}
                type="button"
                onClick={() => valj(key)}
                aria-pressed={view === key}
                className={`micro border border-ink px-3 py-1.5 transition-opacity duration-[140ms] hover:opacity-70 ${
                  i === 1 ? "border-l-0" : ""
                } ${view === key ? "bg-ink text-paper" : "bg-panel text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "arkiv" ? (
        <FolderStack
          items={items}
          hrefFor={hrefFor}
          title={title}
          counts={counts}
          redigerbar={redigerar}
          onNamn={(node, titel) => node.id && kor(() => bytNamn(node.id!, titel))}
          onFlytta={(node, riktning) =>
            node.id && kor(() => flyttaNod(node.id!, riktning))
          }
          onTaBort={(node) => {
            if (!node.id) return;
            const text =
              node.kind === "folder"
                ? `Ta bort mappen "${node.title}" och allt som ligger i den?`
                : `Ta bort dokumentet "${node.title}"?`;
            if (window.confirm(text)) void kor(() => taBortNod(node.id!));
          }}
        />
      ) : (
        <TreeView items={items} hrefFor={hrefForPath} title={title} />
      )}
    </div>
  );
}
