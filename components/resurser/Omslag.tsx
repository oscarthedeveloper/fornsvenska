import { TYPNAMN, omslagston, type Resurs } from "@/lib/resurstyper";

/**
 * Omslaget till en resurs.
 *
 * Finns ingen bild ritas ett typografiskt standardomslag i stället — samma
 * proportioner, samma ram, men titeln som bild. Skrifter och uppsatser har
 * sällan omslag, och en tom grå ruta hade sett ut som ett fel.
 */
export default function Omslag({
  resurs,
  storlek = "normal",
}: {
  resurs: Resurs;
  storlek?: "normal" | "stor";
}) {
  if (resurs.omslag) {
    return (
      <span className="omslag">
        {/* Vanlig img: bilderna ligger i Supabase storage, och next/image
            hade krävt att varje projekt konfigurerar värdnamnet. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={resurs.omslag} alt="" className="omslag-bild" />
      </span>
    );
  }

  return (
    <span
      className={`omslag standardomslag ${storlek === "stor" ? "stort" : ""}`}
      data-ton={omslagston(resurs.titel, resurs.typ)}
      aria-hidden="true"
    >
      <span className="nano standardomslag-typ">{TYPNAMN[resurs.typ]}</span>
      <span className="display standardomslag-titel">{resurs.titel}</span>
      <span className="nano standardomslag-fot">
        {resurs.forfattare || resurs.ar || "—"}
      </span>
    </span>
  );
}
