"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { OrdbokRattelse } from "@/lib/ordbok/typer";
import {
  hamtaAllaOrdbokRattelserAction,
  taBortOrdbokRattelseAction,
} from "@/lib/ordbok/rattelseActions";
import OrdbokRattelseDiff from "@/components/ordbok/OrdbokRattelseDiff";

export default function OrdbokRattelserAdmin() {
  const [rattelser, setRattelser] = useState<OrdbokRattelse[]>([]);
  const [filter, setFilter] = useState("");
  const [laddar, setLaddar] = useState(true);
  const [oppnadDiffId, setOppnadDiffId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [meddelande, setMeddelande] = useState<string | null>(null);

  useEffect(() => {
    async function ladda() {
      setLaddar(true);
      const res = await hamtaAllaOrdbokRattelserAction();
      if (res.ok) {
        setRattelser(res.rattelser);
      }
      setLaddar(false);
    }
    ladda();
  }, []);

  function hanteraTaBort(id: string) {
    if (!confirm(`Är du säker på att du vill ta bort rättelsen för post »${id}« och återställa källans original?`)) {
      return;
    }
    setMeddelande(null);
    startTransition(async () => {
      const res = await taBortOrdbokRattelseAction(id);
      if (res.ok) {
        setRattelser((prev) => prev.filter((r) => r.id !== id));
        setMeddelande(`Rättelsen för ${id} togs bort och källans original återställdes.`);
      } else {
        setMeddelande(res.fel ?? "Kunde inte ta bort rättelsen.");
      }
    });
  }

  function exporteraJson() {
    const blob = new Blob([JSON.stringify(rattelser, null, 2) + "\n"], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ordbok-rattelser-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const matchande = rattelser.filter((r) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      (r.headwordDisplayOverride && r.headwordDisplayOverride.toLowerCase().includes(q)) ||
      r.note.toLowerCase().includes(q) ||
      r.kallstod.toLowerCase().includes(q)
    );
  });

  return (
    <section className="flex flex-col gap-4 border border-ink bg-panel p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap border-b border-ink/40 pb-3">
        <div>
          <span className="nano opacity-60">Redaktionellt granskningsregister</span>
          <h2 className="font-serif text-[1.35rem] leading-tight">
            Ordbok: Redaktionella rättelser & faksimilverifiering
          </h2>
          <p className="text-[0.72rem] leading-relaxed opacity-75 mt-0.5 max-w-xl">
            Registrerade rättelser av Söderwalls ordbok och supplementet. Ändringar lagras i{" "}
            <code className="font-mono text-[0.68rem] border border-ink/30 px-1 bg-paper">
              data/ordbok-rattelser.json
            </code>{" "}
            och bevaras vid framtida omimporter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exporteraJson}
            disabled={rattelser.length === 0}
            className="nano border border-ink bg-paper px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
            title="Ladda ner säkerhetskopia av rättelserna som JSON"
          >
            Ladda ner JSON ({rattelser.length})
          </button>
        </div>
      </div>

      {meddelande && (
        <div className="p-2.5 bg-paper border border-ink text-ink micro">
          {meddelande}
        </div>
      )}

      {/* Sökfilter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrera på ord, ID, källstöd eller not …"
          className="flex-1 min-w-[200px] border border-ink bg-paper px-3 py-1.5 text-[0.78rem] outline-none focus:bg-panel"
        />
        <span className="nano opacity-60">
          Visar {matchande.length} av {rattelser.length} rättelser
        </span>
      </div>

      {/* Lista / Tabell över rättelser */}
      {laddar ? (
        <p className="micro opacity-50 py-4 text-center">Läser in rättelser …</p>
      ) : rattelser.length === 0 ? (
        <div className="border border-dashed border-ink/40 p-6 text-center bg-paper/40">
          <p className="micro opacity-70">
            Inga redaktionella rättelser är registrerade ännu.
          </p>
          <p className="text-[0.68rem] opacity-50 mt-1">
            Gå till valfri ordboksartikel under{" "}
            <Link href="/ordbok" className="underline hover:text-accent">
              /ordbok
            </Link>{" "}
            och klicka på »✎ Redaktionell rättelse« för att föreslå eller granska en post.
          </p>
        </div>
      ) : matchande.length === 0 ? (
        <p className="micro opacity-60 py-4 text-center">
          Inga rättelser matchade sökningen »{filter}«.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {matchande.map((r) => {
            const oppen = oppnadDiffId === r.id;
            return (
              <div
                key={r.id}
                className="border border-ink bg-paper p-3.5 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-serif text-[1.15rem] font-semibold">
                      {r.headwordDisplayOverride ?? r.id}
                    </span>
                    <span
                      className={`nano px-2 py-0.2 border border-ink ${
                        r.reviewStatus === "rattad_med_kallstod"
                          ? "bg-accent text-ink"
                          : "bg-panel text-ink"
                      }`}
                    >
                      {r.reviewStatus === "rattad_med_kallstod"
                        ? "Rättad med källstöd"
                        : "Redaktionellt verifierad"}
                    </span>
                    <span className="nano opacity-50 font-mono">ID: {r.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOppnadDiffId(oppen ? null : r.id)}
                      className="nano border border-ink bg-panel px-2.5 py-1 hover:bg-paper transition-colors"
                    >
                      {oppen ? "Dölj diff ▲" : "Visa diff ▼"}
                    </button>
                    <Link
                      href={`/ordbok/${encodeURIComponent(r.id)}`}
                      className="nano border border-ink bg-panel px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors"
                      target="_blank"
                    >
                      Öppna artikel ↗
                    </Link>
                    <button
                      type="button"
                      onClick={() => hanteraTaBort(r.id)}
                      disabled={isPending}
                      className="nano border border-dashed border-ink/60 px-2 py-1 hover:border-ink hover:bg-accent/20 transition-colors"
                      title="Ta bort rättelse och återställ original"
                    >
                      Återställ
                    </button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 micro">
                  <div>
                    <span className="nano opacity-60 block">Källstöd:</span>
                    <span className="font-mono text-[0.72rem] bg-panel border border-ink/20 px-2 py-1 block">
                      {r.kallstod}
                    </span>
                  </div>
                  <div>
                    <span className="nano opacity-60 block">Motivering:</span>
                    <span className="italic bg-panel border border-ink/20 px-2 py-1 block">
                      {r.note}
                    </span>
                  </div>
                </div>

                {oppen && (
                  <div className="mt-2 pt-2 border-t border-ink/20">
                    <OrdbokRattelseDiff
                      post={{
                        headwordOriginal: r.id.split("--")[1]?.replace(/\.\.nn\.\d+/, "") ?? r.id,
                        headwordDisplay: r.headwordDisplayOverride ?? r.id,
                        reviewStatus: r.reviewStatus,
                      }}
                      rattelse={r}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
