import type { OrdbokGranskningsstatus, OrdbokPost, OrdbokRattelse } from "./typer";

/**
 * Strukturerad representation av skillnaden (diff) mellan källans original
 * och den föreslagna/sparade redaktionella rättelsen.
 */
export interface RattelseDiff {
  harAndringar: boolean;
  uppslagsord: {
    original: string;
    nytt: string;
    arAndrat: boolean;
  };
  status: {
    original: OrdbokGranskningsstatus;
    ny: OrdbokGranskningsstatus;
    arAndrat: boolean;
  };
  note: string;
  kallstod: string;
}

/**
 * Ren beräkningsfunktion (klientsäker, inga server- eller fs-beroenden)
 * som räknar ut diffen mellan källans original och en rättelse.
 */
export function beraknaRattelseDiff(
  originalPost: Pick<OrdbokPost, "headwordOriginal" | "headwordDisplay" | "reviewStatus">,
  rattelse: Partial<OrdbokRattelse>
): RattelseDiff {
  const origHw = (originalPost.headwordOriginal || originalPost.headwordDisplay || "").trim();
  const nyttHw = (rattelse.headwordDisplayOverride?.trim() || originalPost.headwordDisplay || "").trim();
  const hwAndrat = origHw !== nyttHw;

  const origStatus: OrdbokGranskningsstatus = "oandrad_kallimport";
  const nyStatus = rattelse.reviewStatus ?? "rattad_med_kallstod";
  const statusAndrat = origStatus !== nyStatus;

  return {
    harAndringar: hwAndrat || statusAndrat || Boolean(rattelse.note?.trim()),
    uppslagsord: {
      original: origHw,
      nytt: nyttHw,
      arAndrat: hwAndrat,
    },
    status: {
      original: origStatus,
      ny: nyStatus,
      arAndrat: statusAndrat,
    },
    note: rattelse.note?.trim() ?? "",
    kallstod: rattelse.kallstod?.trim() ?? "",
  };
}
