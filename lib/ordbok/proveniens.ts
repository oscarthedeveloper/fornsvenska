import type {
  OrdbokDataset,
  OrdbokGranskningsstatus,
  OrdbokKallaId,
  OrdbokKalllank,
  OrdbokPost,
  OrdbokRattelse,
  ModerniseradDefinition,
} from "./typer";

export const ORDBOK_IMPORT_VERSION = "2026-10-16.v1";

export const ORDBOK_CHECKSUMS: Record<OrdbokDataset, string> = {
  soederwall: "9eddf1d7f94dc34aa4a2b0620734dee7fe164a879df195ee96a2f6098f7ce1f4",
  "soederwall-supp": "58cb1e3e6370cff44a7aecd09c5bc89536d8f422ec92d8a2c5ac5055d843717f",
};

export const ORDBOK_SUPPLIER_QUALITY: Record<OrdbokDataset, string> = {
  soederwall:
    "Språkbankens LMF-utgåva: uppslagsorden är kontrollästa efter manuell inkodning, men övrig artikeltext är inte korrekturläst.",
  "soederwall-supp":
    "Språkbankens LMF-utgåva: varken uppslagsord eller övrig artikeltext är kontrollästa efter manuell inkodning.",
};

export function byggExternaLankar(
  dataset: OrdbokDataset,
  letterSection: string,
  isMainWorkAeInSuppFile?: boolean
): OrdbokKalllank[] {
  const lankar: OrdbokKalllank[] = [];
  if (dataset === "soederwall") {
    lankar.push(
      {
        label: "Språkbanken Text: Söderwalls ordbok",
        url: "https://sprakbanken.se/resurser/soederwall",
        kind: "sprakbanken",
        note: "Digital LMF/XML-resurs hos Språkbanken Text",
      },
      {
        label: "DOI: 10.23695/0gf3-5042",
        url: "https://doi.org/10.23695/0gf3-5042",
        kind: "doi",
        note: "Beständig identifierare för källdatamängden",
      }
    );
  } else {
    lankar.push(
      {
        label: "Språkbanken Text: Söderwalls supplement",
        url: "https://spraakbanken.gu.se/resurser/soederwall-supp",
        kind: "sprakbanken",
        note: "Digital LMF/XML-resurs hos Språkbanken Text",
      },
      {
        label: "DOI: 10.23695/vp9e-pg93",
        url: "https://doi.org/10.23695/vp9e-pg93",
        kind: "doi",
        note: "Beständig identifierare för källdatamängden",
      }
    );
  }

  if (dataset === "soederwall" || isMainWorkAeInSuppFile) {
    let bandUrl = "https://runeberg.org/svmtsprk/1/";
    let bandNamn = "Band 1 (A–L)";
    if (["M", "N", "O", "P", "Q", "R", "S", "T"].includes(letterSection)) {
      bandUrl = "https://runeberg.org/svmtsprk/2/";
      bandNamn = "Band 2:1 (M–T)";
    } else if (["U", "V", "Y", "Ä", "Ö", "Þ"].includes(letterSection)) {
      bandUrl = "https://runeberg.org/svmtsprk/3/";
      bandNamn = "Band 2:2 (U–Ö samt Þ/TH)";
    }
    lankar.push({
      label: `Projekt Runeberg: ${bandNamn}`,
      url: bandUrl,
      kind: "runeberg_band",
      note: "Bandöversikt till skannat faksimil (ej sidexakt djuplänk)",
    });
  } else {
    lankar.push({
      label: "Projekt Runeberg: Supplement (A–Ö, Þ)",
      url: "https://runeberg.org/svmtsprk/4/",
      kind: "runeberg_band",
      note: "Bandöversikt till skannat faksimil av supplementet (ej sidexakt djuplänk)",
    });
  }

  lankar.push({
    label: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/",
    kind: "licens",
    note: "Creative Commons Erkännande 4.0 Internationell",
  });

  return lankar;
}

/**
 * Lagrad kompakt post i data/ordbok/poster.json (utan fält som är konstanta
 * per datamängd eller härleds direkt ur wordFormRows + senses).
 */
export interface LagradOrdbokPost {
  id: string;
  sourceDataset: OrdbokDataset;
  sourceEntryId: string;
  sourceIndex: number;
  oldLemma?: string;
  isNewInSupplement?: boolean;
  isMainWorkAeInSuppFile?: boolean;
  headwordOriginal: string;
  headwordDisplay: string;
  homonymNumber?: number;
  partOfSpeech: string[];
  gramOriginal?: string;
  informationOriginal?: string;
  oldFormOriginal?: string;
  variantsOriginal: string[];
  wordFormRows: OrdbokPost["wordFormRows"];
  senses: OrdbokPost["senses"];
  searchKeys: string[];
  aliasKeys: string[];
  sortKey: string;
  letterSection: string;
  references: OrdbokPost["references"];
  reviewStatus?: OrdbokGranskningsstatus;
  rattelse?: OrdbokRattelse;
  modernDefinition?: ModerniseradDefinition;
}

export function byggPlainText(post: LagradOrdbokPost): string {
  const wfText = post.wordFormRows
    .map((r) => (r.orth ? `${r.orth} (${r.val.trim()})` : r.val.trim()))
    .filter(Boolean)
    .join(" ");
  const senseText = post.senses
    .map((s) => [s.etikett, s.gram, s.writtenForm, s.text].filter(Boolean).join(" "))
    .join(" ");
  return [
    post.headwordDisplay,
    post.gramOriginal,
    post.informationOriginal,
    wfText,
    senseText,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hydreraOrdbokPost(lagrad: LagradOrdbokPost): OrdbokPost {
  const kallaId: OrdbokKallaId =
    lagrad.sourceDataset === "soederwall" ? "SOD1884" : "SOD-SUPP";
  const articlePlainText = byggPlainText(lagrad);
  return {
    ...lagrad,
    kallaId,
    articleOriginal: "",
    articlePlainText,
    externalLinks: byggExternaLankar(
      lagrad.sourceDataset,
      lagrad.letterSection,
      lagrad.isMainWorkAeInSuppFile
    ),
    importVersion: ORDBOK_IMPORT_VERSION,
    sourceChecksum: ORDBOK_CHECKSUMS[lagrad.sourceDataset],
    reviewStatus: lagrad.reviewStatus ?? (lagrad.rattelse ? lagrad.rattelse.reviewStatus : "oandrad_kallimport"),
    rattelse: lagrad.rattelse,
    modernDefinition: lagrad.modernDefinition,
    supplierQualityNote: ORDBOK_SUPPLIER_QUALITY[lagrad.sourceDataset],
  };
}
