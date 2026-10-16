import type { OrdbokPost, OrdbokRattelse } from "@/lib/ordbok/typer";
import { beraknaRattelseDiff } from "@/lib/ordbok/rattelseDiff";

/**
 * Tydlig visuell jämförelse (diff) mellan källans originalimport och den redaktionella rättelsen.
 * Utformad enligt designsystemet (paper #FDFBEF, panel #FFFFFF, ink #111111, accent #FF5C39, Martian Mono & Newsreader).
 */
export default function OrdbokRattelseDiff({
  post,
  rattelse,
  kompakt = false,
}: {
  post: Pick<OrdbokPost, "headwordOriginal" | "headwordDisplay" | "reviewStatus">;
  rattelse: Partial<OrdbokRattelse>;
  kompakt?: boolean;
}) {
  const diff = beraknaRattelseDiff(post as OrdbokPost, rattelse);

  return (
    <div className="border border-ink bg-panel p-3.5 sm:p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-ink/30 pb-2">
        <span className="nano font-semibold">Redaktionell differentiering (diff mot källan)</span>
        <span
          className={`nano px-2 py-0.5 border border-ink ${
            diff.status.ny === "rattad_med_kallstod"
              ? "bg-accent text-ink"
              : "bg-paper text-ink"
          }`}
        >
          {diff.status.ny === "rattad_med_kallstod"
            ? "Rättad med källstöd"
            : diff.status.ny === "redaktionellt_verifierad"
              ? "Redaktionellt verifierad"
              : "Oändrad källimport"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Vänster: Källans original */}
        <div className="flex flex-col gap-1 border border-ink/30 bg-paper/60 p-2.5">
          <span className="nano opacity-60">Källans original (Språkbanken)</span>
          <div className="font-serif text-[1.15rem] leading-tight flex items-baseline gap-2">
            <span className={diff.uppslagsord.arAndrat ? "line-through opacity-60" : ""}>
              {diff.uppslagsord.original}
            </span>
          </div>
          <span className="nano opacity-50 mt-1">Status: Oändrad källimport</span>
        </div>

        {/* Höger: Rättad visning */}
        <div
          className={`flex flex-col gap-1 border p-2.5 ${
            diff.uppslagsord.arAndrat
              ? "border-accent bg-accent/10"
              : "border-ink/30 bg-panel"
          }`}
        >
          <span className="nano opacity-60">
            {diff.uppslagsord.arAndrat ? "Korrigerat uppslagsord" : "Visningsuppslagsord"}
          </span>
          <div className="font-serif text-[1.15rem] leading-tight flex items-baseline gap-2">
            <span className={diff.uppslagsord.arAndrat ? "font-semibold text-accent" : ""}>
              {diff.uppslagsord.nytt}
            </span>
            {diff.uppslagsord.arAndrat && (
              <span className="nano px-1.5 py-0.2 border border-accent bg-accent text-ink">
                Korrigerad
              </span>
            )}
          </div>
          <span className="nano opacity-70 mt-1">
            Status:{" "}
            {diff.status.ny === "rattad_med_kallstod"
              ? "Rättad med källstöd"
              : "Redaktionellt verifierad"}
          </span>
        </div>
      </div>

      {/* Källstöd och redaktionell motivering */}
      <div className="flex flex-col gap-2 pt-1 border-t border-ink/20">
        <div>
          <span className="nano opacity-60 block">Dokumenterat källstöd:</span>
          <p className="micro font-mono bg-paper border border-ink/30 px-2.5 py-1.5 mt-0.5 whitespace-pre-wrap">
            {diff.kallstod || "(Inget källstöd angivet ännu)"}
          </p>
        </div>

        {diff.note && (
          <div>
            <span className="nano opacity-60 block">Redaktionell motivering:</span>
            <p className="micro italic bg-paper border border-ink/30 px-2.5 py-1.5 mt-0.5">
              {diff.note}
            </p>
          </div>
        )}

        {rattelse.skapad && !kompakt && (
          <div className="flex items-center justify-between gap-2 pt-1 text-[0.62rem] opacity-60">
            <span>Registrerad: {new Date(rattelse.skapad).toLocaleString("sv-SE")}</span>
            {rattelse.skapadAv && <span>Av: {rattelse.skapadAv}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
