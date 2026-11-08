/**
 * Klientbaserad sökmotor för Söderwalls ordbok (41 744 poster).
 *
 * Utför blixtsnabb sökning, morfologiska textuppslag och alfabetisk bläddring
 * direkt i webbläsaren eller i en Web Worker med noll anrop till server eller databas.
 *
 * Använder det kompakta sökindexet (< 1 MB gzip) för grundsökning och textuppslag.
 */

import {
  genereraUppslagskandidater,
  rensaKlickatOrd,
} from "./kandidater";
import {
  genereraOrtografiskaAlias,
  normaliseraSokterm,
  SODERWALL_ALFABET,
} from "./normalisering";
import type {
  ModerniseradDefinition,
  OrdbokBokstavsStatistik,
  OrdbokKallfilter,
  OrdbokListPost,
  OrdbokMorfologiskKandidat,
  OrdbokPost,
  OrdbokSoklage,
  OrdbokSokParametrar,
  OrdbokSokResultat,
  OrdbokTextUppslagResultat,
  OrdbokTextUppslagTräff,
} from "./typer";

export interface CompactOrdbokEntry {
  id: string;
  h: string; // headwordDisplay
  k: string; // sortKey
  d: "s" | "supp"; // sourceDataset ('s' = soederwall, 'supp' = soederwall-supp)
  s: string; // letterSection
  hom?: number; // homonymNumber
  pos: string[]; // partOfSpeech
  gram?: string; // gramOriginal
  vars: string[]; // variantsOriginal
  snip: string; // precomputed snippet
  mod?: {
    k?: string; // kortForklaring
    g?: string[]; // modernGlos
  };
  r?: boolean; // hasCorrection
  hasSense: boolean; // whether post has senses
  suppNew?: boolean; // isNewInSupplement
  suppAe?: boolean; // isMainWorkAeInSuppFile
}

export type CompactTuple = [
  id: string,               // 0: id
  h: string,                // 1: headwordDisplay
  k: string,                // 2: sortKey
  d: 1 | 2,                 // 3: 1 = soederwall, 2 = soederwall-supp
  s: string,                // 4: letterSection
  hom: number,              // 5: homonymNumber (0 = none)
  pos: string[],            // 6: partOfSpeech
  vars: string[],           // 7: variantsOriginal
  gram?: string,            // 8: gramOriginal
  mod?: [string, string[]], // 9: [kortForklaring, modernGlos]
  flags?: number            // 10: bit 1 = rattelse, bit 2 = noSense
];

export interface CompactOrdbokIndex {
  version: string;
  totalCount: number;
  bokstavsStatistik: OrdbokBokstavsStatistik[];
  entries: (CompactOrdbokEntry | CompactTuple)[];
}

export function tupleToEntry(item: CompactOrdbokEntry | CompactTuple): CompactOrdbokEntry {
  if (Array.isArray(item)) {
    const flags = item[10] || 0;
    return {
      id: item[0],
      h: item[1],
      k: item[2],
      d: item[3] === 1 ? "s" : "supp",
      s: item[4],
      hom: item[5] || undefined,
      pos: item[6] || [],
      vars: item[7] || [],
      gram: item[8] || undefined,
      snip: item[9]?.[0] || item[8] || "",
      mod: item[9] ? { k: item[9][0] || undefined, g: item[9][1] || undefined } : undefined,
      r: Boolean(flags & 1),
      hasSense: !(flags & 2),
    };
  }
  return item;
}

export interface PreparedOrdbokIndex {
  version: string;
  totalCount: number;
  entries: CompactOrdbokEntry[];
  bokstavsStatistik: OrdbokBokstavsStatistik[];
  byId: Map<string, number>;
  byExactHeadword: Map<string, number[]>;
  byExactVariant: Map<string, { idx: number; variant: string }[]>;
  byLetter: Map<string, number[]>;
  homonymCounts: Map<string, number>;
}

/**
 * Bygger snabba uppslagsstrukturer i minnet för sökindexet.
 * Körs en gång vid initialisering (tar ca 15–25 ms för 41 744 poster).
 */
export function prepareIndex(compact: CompactOrdbokIndex): PreparedOrdbokIndex {
  const byId = new Map<string, number>();
  const byExactHeadword = new Map<string, number[]>();
  const byExactVariant = new Map<string, { idx: number; variant: string }[]>();
  const byLetter = new Map<string, number[]>();
  const homonymCounts = new Map<string, number>();

  const rawEntries = compact.entries;
  const entries: CompactOrdbokEntry[] = new Array(rawEntries.length);

  for (let idx = 0; idx < rawEntries.length; idx++) {
    const p = tupleToEntry(rawEntries[idx]);
    entries[idx] = p;

    // Registrera ID
    byId.set(p.id, idx);

    // Registrera bokstavssektion
    const letList = byLetter.get(p.s);
    if (letList) letList.push(idx);
    else byLetter.set(p.s, [idx]);

    // Registrera exakt uppslagsord
    const hwKey = normaliseraSokterm(p.h.replace(/\s+och$/, ""));
    const hwList = byExactHeadword.get(hwKey);
    if (hwList) hwList.push(idx);
    else byExactHeadword.set(hwKey, [idx]);

    // Räkna homonymer per dataset
    const ds = p.d === "s" ? "soederwall" : "soederwall-supp";
    const dsHwKey = `${ds}:${hwKey}`;
    homonymCounts.set(dsHwKey, (homonymCounts.get(dsHwKey) ?? 0) + 1);

    // Registrera exakta varianter
    const seddaVarForPost = new Set<string>();
    for (const v of p.vars) {
      const vKey = normaliseraSokterm(v.replace(/-$/, ""));
      if (!vKey || seddaVarForPost.has(vKey)) continue;
      seddaVarForPost.add(vKey);
      const vList = byExactVariant.get(vKey);
      if (vList) vList.push({ idx, variant: v });
      else byExactVariant.set(vKey, [{ idx, variant: v }]);
    }
  }

  return {
    version: compact.version,
    totalCount: compact.totalCount,
    entries,
    bokstavsStatistik: compact.bokstavsStatistik,
    byId,
    byExactHeadword,
    byExactVariant,
    byLetter,
    homonymCounts,
  };
}

function matcharDataset(p: CompactOrdbokEntry, dataset: OrdbokKallfilter): boolean {
  if (dataset === "alla") return true;
  const ds = p.d === "s" ? "soederwall" : "soederwall-supp";
  return ds === dataset;
}

export function tillListPostKlient(
  index: PreparedOrdbokIndex,
  idx: number,
  matchType?: NonNullable<OrdbokListPost["matchType"]>,
  matchedForm?: string,
  sokord?: string,
  mode: OrdbokSoklage = "uppslagsord",
  matchExplanation?: string,
  customSnippet?: string
): OrdbokListPost {
  const p = index.entries[idx];
  const sourceDataset = p.d === "s" ? "soederwall" : "soederwall-supp";
  const hwKey = normaliseraSokterm(p.h.replace(/\s+och$/, ""));
  const dsHwKey = `${sourceDataset}:${hwKey}`;
  const antalHomonymer = index.homonymCounts.get(dsHwKey) ?? 1;

  let modernDef: ModerniseradDefinition | undefined;
  if (p.mod) {
    modernDef = {
      id: p.id,
      headwordDisplay: p.h,
      kortForklaring: p.mod.k || "",
      modernGlos: p.mod.g ?? [],
      kalla: "automatisk_extraktion",
      granskad: false,
    };
  }

  return {
    id: p.id,
    sourceDataset,
    kallaId: p.d === "s" ? "SOD1884" : "SOD-SUPP",
    sourceEntryId: p.id.split("--")[1] || p.id,
    headwordDisplay: p.h,
    homonymNumber: antalHomonymer > 1 || (p.hom ?? 1) > 1 ? p.hom : undefined,
    partOfSpeech: p.pos,
    gramOriginal: p.gram,
    variantsPreview: p.vars.slice(0, 4),
    snippet: customSnippet || p.snip,
    letterSection: p.s,
    isNewInSupplement: p.suppNew,
    isMainWorkAeInSuppFile: p.suppAe,
    modernDefinition: modernDef,
    matchType,
    matchedForm,
    matchExplanation,
  };
}

/**
 * Sök i ordboksindexet med paritet mot serverns sökalgoritm.
 */
export function sokOrdbokKlient(
  index: PreparedOrdbokIndex,
  params: OrdbokSokParametrar,
  fulltextMap?: Map<string, string>
): OrdbokSokResultat {
  const start = performance.now();
  const rawQuery = (params.q ?? "").trim();
  const mode: OrdbokSoklage =
    params.mode === "artikeltext" ? "artikeltext" : "uppslagsord";
  const dataset: OrdbokKallfilter =
    params.dataset === "soederwall" || params.dataset === "soederwall-supp"
      ? params.dataset
      : "alla";
  const pageSize = Math.min(Math.max(params.pageSize ?? 40, 10), 100);
  const requestedPage = Math.max(params.page ?? 1, 1);

  const normalizedLetter = params.letter
    ? params.letter.trim().toUpperCase().replace("TH", "Þ")
    : null;
  const activeLetter =
    normalizedLetter &&
    (SODERWALL_ALFABET as readonly string[]).includes(normalizedLetter)
      ? normalizedLetter
      : null;

  // Fall 1: Ingen sökfråga -> alfabetisk bläddring
  if (!rawQuery) {
    const valdaIndex: number[] = [];
    const kallaLista = activeLetter
      ? index.byLetter.get(activeLetter) ?? []
      : index.entries.map((_, i) => i);

    for (const idx of kallaLista) {
      if (matcharDataset(index.entries[idx], dataset)) {
        valdaIndex.push(idx);
      }
    }

    const totalHits = valdaIndex.length;
    const totalPages = Math.max(1, Math.ceil(totalHits / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const offset = (page - 1) * pageSize;
    const sidaIndex = valdaIndex.slice(offset, offset + pageSize);

    return {
      query: "",
      mode,
      letter: activeLetter,
      dataset,
      page,
      pageSize,
      totalHits,
      totalPages,
      hits: sidaIndex.map((idx) => tillListPostKlient(index, idx)),
      executionTimeMs: Number((performance.now() - start).toFixed(2)),
    };
  }

  // Fall 2: Sökning i artikeltext (on-demand fulltext)
  if (mode === "artikeltext") {
    const qNorm = normaliseraSokterm(rawQuery);
    const qAliases = genereraOrtografiskaAlias(qNorm);

    const exactMatches: { idx: number; snippet?: string }[] = [];
    const aliasMatches: { idx: number; alias: string; snippet?: string }[] = [];

    if (fulltextMap) {
      for (let i = 0; i < index.entries.length; i++) {
        const p = index.entries[i];
        if (!matcharDataset(p, dataset)) continue;
        if (activeLetter && p.s !== activeLetter) continue;

        const textLower = fulltextMap.get(p.id);
        if (!textLower) continue;

        if (textLower.includes(qNorm)) {
          exactMatches.push({ idx: i });
        } else {
          for (const al of qAliases) {
            if (textLower.includes(al)) {
              aliasMatches.push({ idx: i, alias: al });
              break;
            }
          }
        }
      }
    }

    const samlade = [
      ...exactMatches.map((m) => ({ idx: m.idx, matchedForm: undefined })),
      ...aliasMatches.map((m) => ({ idx: m.idx, matchedForm: m.alias })),
    ];

    const totalHits = samlade.length;
    const totalPages = Math.max(1, Math.ceil(totalHits / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const offset = (page - 1) * pageSize;
    const sida = samlade.slice(offset, offset + pageSize);

    return {
      query: rawQuery,
      mode,
      letter: activeLetter,
      dataset,
      page,
      pageSize,
      totalHits,
      totalPages,
      hits: sida.map(({ idx, matchedForm }) =>
        tillListPostKlient(
          index,
          idx,
          "article_text",
          matchedForm,
          matchedForm ?? qNorm,
          "artikeltext"
        )
      ),
      executionTimeMs: Number((performance.now() - start).toFixed(2)),
    };
  }

  // Fall 3: Uppslagsord och stavningsvarianter
  const qNorm = normaliseraSokterm(rawQuery);
  const qAliases = genereraOrtografiskaAlias(qNorm);

  const harExaktUppslagsord = (index.byExactHeadword.get(qNorm) ?? []).some(
    (idx) =>
      matcharDataset(index.entries[idx], dataset) &&
      (!activeLetter || index.entries[idx].s === activeLetter)
  );

  const allaMorfKandidater = genereraUppslagskandidater(rawQuery).filter(
    (k) =>
      k.kind !== "exact" &&
      k.form !== qNorm &&
      !qAliases.includes(k.form)
  );

  interface MorfIdxInfo {
    rank: number;
    kandOrder: number;
    matchType: "ortho_candidate" | "inflected_candidate";
    matchedForm: string;
    matchExplanation?: string;
  }

  const morfMatchPerIdx = new Map<number, MorfIdxInfo>();
  const morfologiskaKandidater: OrdbokMorfologiskKandidat[] = [];

  for (let mIdx = 0; mIdx < allaMorfKandidater.length; mIdx++) {
    const kand = allaMorfKandidater[mIdx];
    if (
      harExaktUppslagsord &&
      kand.kind === "inflected" &&
      !(
        kand.forklaring?.includes("av ") ||
        kand.forklaring?.includes("Starkt ") ||
        kand.forklaring?.includes("Omljudd ")
      )
    ) {
      continue;
    }

    const kandNorm = normaliseraSokterm(kand.form);
    const hwIdxs = (index.byExactHeadword.get(kandNorm) ?? []).filter(
      (idx) =>
        matcharDataset(index.entries[idx], dataset) &&
        (!activeLetter || index.entries[idx].s === activeLetter)
    );

    if (hwIdxs.length === 0) continue;

    if (morfologiskaKandidater.length < 8) {
      morfologiskaKandidater.push({
        grundform: kand.form,
        kategori: kand.kind === "ortho" ? "ortho" : "inflected",
        forklaring:
          kand.forklaring ??
          (kand.kind === "ortho"
            ? "Ortografisk motsvarighet"
            : "Böjningskandidat"),
        antalTraffar: hwIdxs.length,
      });
    }

    const rank = kand.kind === "ortho" ? 3.5 : 5.5;
    const matchType: "ortho_candidate" | "inflected_candidate" =
      kand.kind === "ortho" ? "ortho_candidate" : "inflected_candidate";

    for (const idx of hwIdxs) {
      const bef = morfMatchPerIdx.get(idx);
      if (bef && bef.rank <= rank) continue;
      morfMatchPerIdx.set(idx, {
        rank,
        kandOrder: mIdx,
        matchType,
        matchedForm: kand.form,
        matchExplanation: kand.forklaring,
      });
    }
  }

  interface TräffKandidat {
    idx: number;
    rank: number;
    matchType: NonNullable<OrdbokListPost["matchType"]>;
    matchedForm?: string;
    matchExplanation?: string;
    lengthDiff: number;
  }

  const kandidater: TräffKandidat[] = [];

  for (let i = 0; i < index.entries.length; i++) {
    const p = index.entries[i];
    if (!matcharDataset(p, dataset)) continue;
    if (activeLetter && p.s !== activeLetter) continue;

    const hwNorm = normaliseraSokterm(p.h.replace(/\s+och$/, ""));

    // 1. Exakt uppslagsord
    if (hwNorm === qNorm || normaliseraSokterm(p.h) === qNorm) {
      kandidater.push({
        idx: i,
        rank: 1,
        matchType: "exact_headword",
        lengthDiff: 0,
      });
      continue;
    }

    // 2. Exakt belagd variant
    let exactVarMatch: string | undefined;
    for (const v of p.vars) {
      if (normaliseraSokterm(v.replace(/-$/, "")) === qNorm) {
        exactVarMatch = v;
        break;
      }
    }
    if (exactVarMatch) {
      kandidater.push({
        idx: i,
        rank: 2,
        matchType: "exact_variant",
        matchedForm: exactVarMatch,
        lengthDiff: 0,
      });
      continue;
    }

    // 3. Exakt alias på uppslagsord
    let exactAliasHw: string | undefined;
    for (const al of qAliases) {
      if (hwNorm === al) {
        exactAliasHw = p.h;
        break;
      }
    }
    if (exactAliasHw) {
      kandidater.push({
        idx: i,
        rank: 3,
        matchType: "alias_headword",
        matchedForm: exactAliasHw,
        lengthDiff: 0,
      });
      continue;
    }

    // 3.5. Ortografisk motsvarighet på uppslagsord
    const morfMatch = morfMatchPerIdx.get(i);
    if (morfMatch && morfMatch.rank === 3.5) {
      kandidater.push({
        idx: i,
        rank: morfMatch.rank,
        matchType: morfMatch.matchType,
        matchedForm: morfMatch.matchedForm,
        matchExplanation: morfMatch.matchExplanation,
        lengthDiff: morfMatch.kandOrder,
      });
      continue;
    }

    // 4. Prefix på uppslagsord
    if (hwNorm.startsWith(qNorm)) {
      kandidater.push({
        idx: i,
        rank: 4,
        matchType: "prefix_headword",
        lengthDiff: hwNorm.length - qNorm.length,
      });
      continue;
    }

    // 5. Exakt alias på variant
    let exactAliasVar: string | undefined;
    for (const al of qAliases) {
      for (const v of p.vars) {
        if (normaliseraSokterm(v.replace(/-$/, "")) === al) {
          exactAliasVar = v;
          break;
        }
      }
      if (exactAliasVar) break;
    }
    if (exactAliasVar) {
      kandidater.push({
        idx: i,
        rank: 5,
        matchType: "alias_variant",
        matchedForm: exactAliasVar,
        lengthDiff: 0,
      });
      continue;
    }

    // 5.5. Morfologisk böjningskandidat på uppslagsord
    if (morfMatch && morfMatch.rank === 5.5) {
      kandidater.push({
        idx: i,
        rank: morfMatch.rank,
        matchType: morfMatch.matchType,
        matchedForm: morfMatch.matchedForm,
        matchExplanation: morfMatch.matchExplanation,
        lengthDiff: morfMatch.kandOrder,
      });
      continue;
    }

    // 6. Prefix på variant
    let prefixVarMatch: string | undefined;
    for (const v of p.vars) {
      const vn = normaliseraSokterm(v.replace(/-$/, ""));
      if (vn.startsWith(qNorm)) {
        prefixVarMatch = v;
        break;
      }
    }
    if (prefixVarMatch) {
      kandidater.push({
        idx: i,
        rank: 6,
        matchType: "prefix_variant",
        matchedForm: prefixVarMatch,
        lengthDiff: prefixVarMatch.length - qNorm.length,
      });
      continue;
    }

    // 7. Prefix via ortografiskt alias på uppslagsord
    let prefixAliasHw: string | undefined;
    for (const al of qAliases) {
      if (hwNorm.startsWith(al)) {
        prefixAliasHw = p.h;
        break;
      }
    }
    if (prefixAliasHw) {
      kandidater.push({
        idx: i,
        rank: 7,
        matchType: "alias_headword",
        matchedForm: prefixAliasHw,
        lengthDiff: hwNorm.length - qNorm.length,
      });
      continue;
    }

    // 8. Prefix via ortografiskt alias på variant
    let prefixAliasVar: string | undefined;
    for (const al of qAliases) {
      for (const v of p.vars) {
        const vn = normaliseraSokterm(v.replace(/-$/, ""));
        if (vn.startsWith(al)) {
          prefixAliasVar = v;
          break;
        }
      }
      if (prefixAliasVar) break;
    }
    if (prefixAliasVar) {
      kandidater.push({
        idx: i,
        rank: 8,
        matchType: "alias_variant",
        matchedForm: prefixAliasVar,
        lengthDiff: prefixAliasVar.length - qNorm.length,
      });
    }
  }

  kandidater.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.lengthDiff !== b.lengthDiff) return a.lengthDiff - b.lengthDiff;
    return a.idx - b.idx;
  });

  const totalHits = kandidater.length;
  const totalPages = Math.max(1, Math.ceil(totalHits / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * pageSize;
  const sida = kandidater.slice(offset, offset + pageSize);

  return {
    query: rawQuery,
    mode,
    letter: activeLetter,
    dataset,
    page,
    pageSize,
    totalHits,
    totalPages,
    morfologiskaKandidater:
      morfologiskaKandidater.length > 0 ? morfologiskaKandidater : undefined,
    hits: sida.map((k) =>
      tillListPostKlient(
        index,
        k.idx,
        k.matchType,
        k.matchedForm,
        undefined,
        undefined,
        k.matchExplanation
      )
    ),
    executionTimeMs: Number((performance.now() - start).toFixed(2)),
  };
}

/**
 * Slår upp ett ord från en fornsvensk text i ordboken (för klick-i-text).
 * Körs på sub-millisekund i webbläsaren utan nätverksanrop med full paritet
 * mot serverns `slaUppTextOrd`.
 */
export function slaUppTextOrdKlient(
  index: PreparedOrdbokIndex,
  klickatOrd: string,
  maxTraffar = 8
): OrdbokTextUppslagResultat {
  const start = performance.now();
  const rensatOrd = rensaKlickatOrd(klickatOrd);

  if (!rensatOrd) {
    return {
      klickatOrd,
      rensatOrd: "",
      executionTimeMs: 0,
      traffar: [],
    };
  }

  const kandidater = genereraUppslagskandidater(rensatOrd);

  interface RaaTextTraff {
    idx: number;
    rank: number;
    kandIdx: number;
    matchKategori: OrdbokTextUppslagTräff["matchKategori"];
    matchType: NonNullable<OrdbokListPost["matchType"]>;
    kandidatForm: string;
    matchedVariant?: string;
    forklaring?: string;
  }

  const hittadePerIdx = new Map<number, RaaTextTraff>();

  for (let kandIdx = 0; kandIdx < kandidater.length; kandIdx++) {
    const kand = kandidater[kandIdx];
    const kandNorm = normaliseraSokterm(kand.form);
    if (!kandNorm) continue;

    // 1. Pröva mot uppslagsord (headword)
    const hwIndices = index.byExactHeadword.get(kandNorm);
    if (hwIndices) {
      for (const idx of hwIndices) {
        const rank =
          kand.kind === "exact" ? 1 : kand.kind === "ortho" ? 3 : 5;
        const befintlig = hittadePerIdx.get(idx);
        if (befintlig && befintlig.rank <= rank) continue;
        const matchKategori: OrdbokTextUppslagTräff["matchKategori"] =
          kand.kind === "exact"
            ? "exact_headword"
            : kand.kind === "ortho"
              ? "ortho_candidate"
              : "inflected_candidate";
        hittadePerIdx.set(idx, {
          idx,
          rank,
          kandIdx,
          matchKategori,
          matchType:
            kand.kind === "exact" ? "exact_headword" : "alias_headword",
          kandidatForm: kand.form,
          forklaring: kand.forklaring,
        });
      }
    }

    // 2. Pröva mot källbelagda stavnings- och böjningsvarianter
    const varPoster = index.byExactVariant.get(kandNorm);
    if (varPoster) {
      for (const { idx, variant } of varPoster) {
        const rank =
          kand.kind === "exact" ? 2 : kand.kind === "ortho" ? 4 : 6;
        const befintlig = hittadePerIdx.get(idx);
        if (befintlig && befintlig.rank <= rank) continue;
        const matchKategori: OrdbokTextUppslagTräff["matchKategori"] =
          kand.kind === "exact"
            ? "exact_variant"
            : kand.kind === "ortho"
              ? "ortho_candidate"
              : "inflected_candidate";
        hittadePerIdx.set(idx, {
          idx,
          rank,
          kandIdx,
          matchKategori,
          matchType:
            kand.kind === "exact" ? "exact_variant" : "alias_variant",
          kandidatForm: variant,
          matchedVariant: variant,
          forklaring:
            kand.kind === "exact"
              ? `Belagd form »${variant}» i Söderwall`
              : `${kand.forklaring ?? "Kandidat"} (belagd variant »${variant}»)`,
        });
      }
    }
  }

  const sorterade = [...hittadePerIdx.values()].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    const pa = index.entries[a.idx];
    const pb = index.entries[b.idx];
    // Föredra poster med utskrivna betydelsemoment framför rena hänvisningsposter
    const aHarSense = pa.hasSense ? 0 : 1;
    const bHarSense = pb.hasSense ? 0 : 1;
    if (aHarSense !== bHarSense) return aHarSense - bHarSense;
    // Föredra enkla uppslagsord framför flerordsfraser vid samma rank
    const aFras = pa.h.includes(" ") ? 1 : 0;
    const bFras = pb.h.includes(" ") ? 1 : 0;
    if (aFras !== bFras) return aFras - bFras;
    if (a.kandIdx !== b.kandIdx) return a.kandIdx - b.kandIdx;
    // Vid samma uppslagsord: huvudverket före supplementet
    if (pa.h === pb.h && pa.d !== pb.d) {
      return pa.d === "s" ? -1 : 1;
    }
    return a.idx - b.idx;
  });

  const urval = sorterade.slice(0, maxTraffar);

  const traffar: OrdbokTextUppslagTräff[] = urval.map((t) => {
    const lp = tillListPostKlient(
      index,
      t.idx,
      t.matchType,
      t.matchedVariant ?? t.kandidatForm
    );
    const p = index.entries[t.idx];
    const minimalPost: OrdbokPost = {
      id: p.id,
      sourceDataset: p.d === "s" ? "soederwall" : "soederwall-supp",
      kallaId: p.d === "s" ? "SOD1884" : "SOD-SUPP",
      sourceEntryId: p.id.split("--")[1] || p.id,
      sourceIndex: t.idx,
      headwordOriginal: p.h,
      headwordDisplay: p.h,
      homonymNumber: p.hom,
      partOfSpeech: p.pos,
      gramOriginal: p.gram,
      variantsOriginal: p.vars,
      wordFormRows: [],
      senses: p.snip ? [{ id: `${p.id}-s1`, text: p.snip }] : [],
      articleOriginal: "",
      articlePlainText: p.snip,
      searchKeys: [p.h],
      aliasKeys: [],
      sortKey: p.k,
      letterSection: p.s,
      references: [],
      externalLinks: [],
      importVersion: "1.0.0",
      sourceChecksum: "",
      reviewStatus: "oandrad_kallimport",
      supplierQualityNote: "",
      modernDefinition: lp.modernDefinition,
    };

    return {
      listPost: lp,
      post: minimalPost,
      matchKategori: t.matchKategori,
      kandidatForm: t.kandidatForm,
      forklaring: t.forklaring,
    };
  });

  return {
    klickatOrd,
    rensatOrd,
    executionTimeMs: Number((performance.now() - start).toFixed(2)),
    traffar,
  };
}

/**
 * Hämtar relaterade poster och sektionsgrannar.
 */
export function hamtaRelateradeKlient(
  index: PreparedOrdbokIndex,
  id: string
): {
  sammaUppslagsordHuvudverk: OrdbokListPost[];
  sammaUppslagsordSupplement: OrdbokListPost[];
  grannarISektion: { prev: OrdbokListPost | null; next: OrdbokListPost | null };
} {
  const idx = index.byId.get(id);
  if (idx === undefined) {
    return {
      sammaUppslagsordHuvudverk: [],
      sammaUppslagsordSupplement: [],
      grannarISektion: { prev: null, next: null },
    };
  }

  const post = index.entries[idx];
  const hwKey = normaliseraSokterm(post.h.replace(/\s+och$/, ""));
  const kandidater = index.byExactHeadword.get(hwKey) ?? [];

  const sammaUppslagsordHuvudverk: OrdbokListPost[] = [];
  const sammaUppslagsordSupplement: OrdbokListPost[] = [];

  for (const cIdx of kandidater) {
    if (cIdx === idx) continue;
    const cp = index.entries[cIdx];
    const lp = tillListPostKlient(index, cIdx);
    if (cp.d === "s") {
      sammaUppslagsordHuvudverk.push(lp);
    } else {
      sammaUppslagsordSupplement.push(lp);
    }
  }

  const sektionLista = index.byLetter.get(post.s) ?? [];
  const posISektion = sektionLista.indexOf(idx);

  const prev =
    posISektion > 0 ? tillListPostKlient(index, sektionLista[posISektion - 1]) : null;
  const next =
    posISektion >= 0 && posISektion < sektionLista.length - 1
      ? tillListPostKlient(index, sektionLista[posISektion + 1])
      : null;

  return {
    sammaUppslagsordHuvudverk,
    sammaUppslagsordSupplement,
    grannarISektion: { prev, next },
  };
}
