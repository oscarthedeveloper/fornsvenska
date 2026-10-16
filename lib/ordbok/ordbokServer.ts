/**
 * Serverbaserat datalager och söktjänst för Söderwalls ordbok (41 744 poster).
 *
 * OBS: Denna fil får endast importeras på serversidan (Server Components / Route Handlers).
 * Hela ordboken skickas aldrig till webbläsaren — klienten tar endast emot paginerade
 * träfflistor (OrdbokListPost[]) och den valda posten (OrdbokPost).
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  genereraUppslagskandidater,
  rensaKlickatOrd,
} from "./kandidater";
import {
  genereraOrtografiskaAlias,
  normaliseraSokterm,
  SODERWALL_ALFABET,
} from "./normalisering";
import {
  byggPlainText,
  hydreraOrdbokPost,
  type LagradOrdbokPost,
} from "./proveniens";
import { lasRattelserKarta } from "./rattelser";
import {
  extraheraAutomatiskGlosa,
  lasModernaDefinitionerKarta,
} from "./modernisering";
import type {
  ModerniseradDefinition,
  OrdbokBokstavsStatistik,
  OrdbokKallfilter,
  OrdbokListPost,
  OrdbokMorfologiskKandidat,
  OrdbokPost,
  OrdbokRattelse,
  OrdbokSoklage,
  OrdbokSokParametrar,
  OrdbokSokResultat,
  OrdbokTextUppslagResultat,
  OrdbokTextUppslagTräff,
} from "./typer";

interface MinnesIndex {
  poster: LagradOrdbokPost[];
  plainTexts: string[];
  plainTextsLower: string[];
  byId: Map<string, number>;
  byExactHeadword: Map<string, number[]>;
  byExactVariant: Map<string, { idx: number; variant: string }[]>;
  byLetter: Map<string, number[]>;
  bokstavsStatistik: OrdbokBokstavsStatistik[];
  homonymCounts: Map<string, number>;
}

declare global {
  // eslint-disable-next-line no-var
  var __ordbokMinnesIndex: MinnesIndex | undefined;
}

function laddaMinnesIndex(): MinnesIndex {
  if (globalThis.__ordbokMinnesIndex) {
    return globalThis.__ordbokMinnesIndex;
  }

  const filSokvag = path.join(process.cwd(), "data", "ordbok", "poster.json");
  if (!existsSync(filSokvag)) {
    throw new Error(
      "Ordboksdata saknas (data/ordbok/poster.json). Kör `npm run import:ordbok` för att generera ordboksindexet från Källor/soederwall.xml och Källor/soederwall-supp.xml."
    );
  }

  const raaPoster = JSON.parse(readFileSync(filSokvag, "utf8")) as LagradOrdbokPost[];

  // Applicera eventuella redaktionella rättelser sparade i data/ordbok-rattelser.json
  const rattelserKarta = lasRattelserKarta();
  if (rattelserKarta.size > 0) {
    for (const p of raaPoster) {
      const r = rattelserKarta.get(p.id);
      if (r) {
        p.rattelse = r;
        if (r.headwordDisplayOverride) {
          p.headwordDisplay = r.headwordDisplayOverride;
        }
        if (r.reviewStatus) {
          p.reviewStatus = r.reviewStatus;
        }
      }
    }
  }

  // Sortera primärt efter sortKey (med mellanslag som fältavskiljare så att
  // kortare grundord som "lagh" alltid sorteras före längre avledningar som "lagha").
  raaPoster.sort((a, b) => {
    const ka = a.sortKey.replace(/:/g, " ");
    const kb = b.sortKey.replace(/:/g, " ");
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });

  const byId = new Map<string, number>();
  const byExactHeadword = new Map<string, number[]>();
  const byExactVariant = new Map<string, { idx: number; variant: string }[]>();
  const byLetter = new Map<string, number[]>();
  const homonymCounts = new Map<string, number>();
  const plainTexts: string[] = new Array(raaPoster.length);
  const plainTextsLower: string[] = new Array(raaPoster.length);

  for (const b of SODERWALL_ALFABET) {
    byLetter.set(b, []);
  }

  const modernKarta = lasModernaDefinitionerKarta();

  for (let i = 0; i < raaPoster.length; i++) {
    const p = raaPoster[i];
    byId.set(p.id, i);

    // Knyck kurerad modern definition eller härled automatisk läshjälpsglosa
    const modDef = modernKarta.get(p.id) ?? extraheraAutomatiskGlosa(p);
    if (modDef) {
      p.modernDefinition = modDef;
    }

    const plain = byggPlainText(p);
    plainTexts[i] = plain;
    plainTextsLower[i] = plain.toLowerCase();

    const hwKey = normaliseraSokterm(p.headwordDisplay.replace(/\s+och$/, ""));
    const hwList = byExactHeadword.get(hwKey) ?? [];
    hwList.push(i);
    byExactHeadword.set(hwKey, hwList);

    const seddaVarForPost = new Set<string>();
    for (const v of p.variantsOriginal) {
      const varKey = normaliseraSokterm(v.replace(/-$/, ""));
      if (!varKey || seddaVarForPost.has(varKey)) continue;
      seddaVarForPost.add(varKey);
      const varList = byExactVariant.get(varKey) ?? [];
      varList.push({ idx: i, variant: v });
      byExactVariant.set(varKey, varList);
    }

    const dsHwKey = `${p.sourceDataset}:${hwKey}`;
    homonymCounts.set(dsHwKey, (homonymCounts.get(dsHwKey) ?? 0) + 1);

    const sec = byLetter.get(p.letterSection);
    if (sec) {
      sec.push(i);
    } else {
      byLetter.set(p.letterSection, [i]);
    }
  }

  const bokstavsStatistik: OrdbokBokstavsStatistik[] = SODERWALL_ALFABET.map((letter) => {
    const indices = byLetter.get(letter) ?? [];
    let mainCount = 0;
    let suppCount = 0;
    for (const idx of indices) {
      if (raaPoster[idx].sourceDataset === "soederwall") mainCount++;
      else suppCount++;
    }
    return {
      letter,
      label: letter === "Þ" ? "Þ (TH)" : letter,
      total: indices.length,
      mainCount,
      suppCount,
    };
  });

  const index: MinnesIndex = {
    poster: raaPoster,
    plainTexts,
    plainTextsLower,
    byId,
    byExactHeadword,
    byExactVariant,
    byLetter,
    bokstavsStatistik,
    homonymCounts,
  };

  globalThis.__ordbokMinnesIndex = index;
  return index;
}

function skapaSnippet(
  post: LagradOrdbokPost,
  plainText: string,
  sokord?: string,
  mode?: OrdbokSoklage
): string {
  // Vid artikeltextsökning: visa utdrag runt träffen
  if (mode === "artikeltext" && sokord) {
    const lag = plainText.toLowerCase();
    const pos = lag.indexOf(sokord.toLowerCase());
    if (pos >= 0) {
      const start = Math.max(0, pos - 55);
      const end = Math.min(plainText.length, pos + sokord.length + 95);
      const prefix = start > 0 ? "… " : "";
      const suffix = end < plainText.length ? " …" : "";
      return `${prefix}${plainText.slice(start, end).trim()}${suffix}`;
    }
  }

  // Annars visa början av första betydelsen (eller WordForm om Sense saknas)
  if (post.senses.length > 0) {
    const forsta = post.senses
      .map((s) => [s.etikett, s.gram, s.writtenForm, s.text].filter(Boolean).join(" "))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (forsta.length <= 150) return forsta;
    return `${forsta.slice(0, 147).trim()}…`;
  }

  const wf = post.wordFormRows
    .map((r) => (r.orth ? `${r.orth} (${r.val.trim()})` : r.val.trim()))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (wf.length <= 150) return wf;
  return `${wf.slice(0, 147).trim()}…`;
}

function tillListPost(
  index: MinnesIndex,
  idx: number,
  matchType?: OrdbokListPost["matchType"],
  matchedForm?: string,
  sokord?: string,
  mode?: OrdbokSoklage,
  matchExplanation?: string
): OrdbokListPost {
  const p = index.poster[idx];
  const hwKey = normaliseraSokterm(p.headwordDisplay.replace(/\s+och$/, ""));
  const dsHwKey = `${p.sourceDataset}:${hwKey}`;
  const antalHomonymer = index.homonymCounts.get(dsHwKey) ?? 1;

  return {
    id: p.id,
    sourceDataset: p.sourceDataset,
    kallaId: p.sourceDataset === "soederwall" ? "SOD1884" : "SOD-SUPP",
    sourceEntryId: p.sourceEntryId,
    headwordDisplay: p.headwordDisplay,
    homonymNumber: antalHomonymer > 1 || (p.homonymNumber ?? 1) > 1 ? p.homonymNumber : undefined,
    partOfSpeech: p.partOfSpeech,
    gramOriginal: p.gramOriginal,
    variantsPreview: p.variantsOriginal.slice(0, 4),
    snippet: skapaSnippet(p, index.plainTexts[idx], sokord, mode),
    letterSection: p.letterSection,
    isNewInSupplement: p.isNewInSupplement,
    isMainWorkAeInSuppFile: p.isMainWorkAeInSuppFile,
    rattelse: p.rattelse,
    modernDefinition: p.modernDefinition,
    matchType,
    matchedForm,
    matchExplanation,
  };
}

export function hamtaBokstavsStatistik(): OrdbokBokstavsStatistik[] {
  return laddaMinnesIndex().bokstavsStatistik;
}

export function hamtaOrdbokPost(id: string): OrdbokPost | null {
  const decoded = decodeURIComponent(id).normalize("NFC");
  const index = laddaMinnesIndex();
  const idx = index.byId.get(decoded);
  if (idx === undefined) return null;
  return hydreraOrdbokPost(index.poster[idx]);
}

/**
 * Hämtar övriga poster i huvudverket och supplementet som delar samma uppslagsord
 * (för att visa tydliga källetiketter och homonymer på artikelsidan, utan att
 * automatiskt slå ihop dem).
 */
export function hamtaRelateradeUppslagsord(post: OrdbokPost): {
  sammaUppslagsordHuvudverk: OrdbokListPost[];
  sammaUppslagsordSupplement: OrdbokListPost[];
  grannarISektion: { prev: OrdbokListPost | null; next: OrdbokListPost | null };
} {
  const index = laddaMinnesIndex();
  const hwKey = normaliseraSokterm(post.headwordDisplay.replace(/\s+och$/, ""));
  const kandidater = index.byExactHeadword.get(hwKey) ?? [];

  const sammaUppslagsordHuvudverk: OrdbokListPost[] = [];
  const sammaUppslagsordSupplement: OrdbokListPost[] = [];

  for (const idx of kandidater) {
    const p = index.poster[idx];
    if (p.id === post.id) continue;
    const lp = tillListPost(index, idx);
    if (p.sourceDataset === "soederwall") {
      sammaUppslagsordHuvudverk.push(lp);
    } else {
      sammaUppslagsordSupplement.push(lp);
    }
  }

  const sektionLista = index.byLetter.get(post.letterSection) ?? [];
  const egenIdx = index.byId.get(post.id);
  const posISektion = egenIdx !== undefined ? sektionLista.indexOf(egenIdx) : -1;

  const prev =
    posISektion > 0 ? tillListPost(index, sektionLista[posISektion - 1]) : null;
  const next =
    posISektion >= 0 && posISektion < sektionLista.length - 1
      ? tillListPost(index, sektionLista[posISektion + 1])
      : null;

  return {
    sammaUppslagsordHuvudverk,
    sammaUppslagsordSupplement,
    grannarISektion: { prev, next },
  };
}

function matcharDataset(post: LagradOrdbokPost, dataset: OrdbokKallfilter): boolean {
  if (dataset === "alla") return true;
  return post.sourceDataset === dataset;
}

/**
 * Huvudsökfunktion för både sökning (uppslagsord/varianter samt artikeltext)
 * och alfabetisk bläddring med paginering.
 */
export function sokOrdbok(params: OrdbokSokParametrar): OrdbokSokResultat {
  const start = performance.now();
  const index = laddaMinnesIndex();

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

  // Fall 1: Ingen sökfråga -> alfabetisk bläddring (inom vald bokstav eller A som standard)
  if (!rawQuery) {
    const valdaIndex: number[] = [];
    const kallaLista = activeLetter
      ? index.byLetter.get(activeLetter) ?? []
      : index.poster.map((_, i) => i);

    for (const idx of kallaLista) {
      if (matcharDataset(index.poster[idx], dataset)) {
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
      hits: sidaIndex.map((idx) => tillListPost(index, idx)),
      executionTimeMs: Number((performance.now() - start).toFixed(2)),
    };
  }

  // Fall 2: Sökning i historisk artikeltext
  if (mode === "artikeltext") {
    const qNorm = normaliseraSokterm(rawQuery);
    const qAliases = genereraOrtografiskaAlias(qNorm);

    const exactMatches: number[] = [];
    const aliasMatches: { idx: number; alias: string }[] = [];

    for (let i = 0; i < index.poster.length; i++) {
      const p = index.poster[i];
      if (!matcharDataset(p, dataset)) continue;
      if (activeLetter && p.letterSection !== activeLetter) continue;

      const textLower = index.plainTextsLower[i];
      if (textLower.includes(qNorm)) {
        exactMatches.push(i);
      } else {
        for (const al of qAliases) {
          if (textLower.includes(al)) {
            aliasMatches.push({ idx: i, alias: al });
            break;
          }
        }
      }
    }

    const samlade: { idx: number; matchedForm?: string }[] = [
      ...exactMatches.map((idx) => ({ idx })),
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
        tillListPost(
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

  // Fall 3: Sökning på uppslagsord, belagda stavningsvarianter samt morfologiska/ortografiska kandidater
  // Rangordning:
  // 1. Exakt uppslagsord (exact_headword)
  // 2. Exakt belagd variant (exact_variant)
  // 3. Exakt teckenalias på uppslagsord (alias_headword)
  // 3.5. Ortografisk motsvarighet på uppslagsord (ortho_candidate)
  // 4. Prefix på uppslagsord (prefix_headword)
  // 5. Exakt teckenalias på belagd variant (alias_variant)
  // 5.5. Morfologisk böjningskandidat på uppslagsord (inflected_candidate)
  // 6. Prefix på belagd variant (prefix_variant)
  // 7. Prefix via ortografiskt alias på uppslagsord (alias_headword)
  // 8. Prefix via ortografiskt alias på variant (alias_variant)
  const qNorm = normaliseraSokterm(rawQuery);
  const qAliases = genereraOrtografiskaAlias(qNorm);

  const harExaktUppslagsord = (index.byExactHeadword.get(qNorm) ?? []).some(
    (idx) =>
      matcharDataset(index.poster[idx], dataset) &&
      (!activeLetter || index.poster[idx].letterSection === activeLetter)
  );

  // Generera morfologiska och ortografiska kandidater
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
    // Om sökordet redan är ett exakt uppslagsord (t.ex. "vara", "konunger", "lagh"),
    // ta bara med oregelbundna/omljudda former (t.ex. "var" -> "vara", "bar" -> "bära")
    // så att vanliga lemman inte späs ut med mekaniska ändelseavklipp.
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

    const hwIdxs = (index.byExactHeadword.get(kand.form) ?? []).filter(
      (idx) =>
        matcharDataset(index.poster[idx], dataset) &&
        (!activeLetter || index.poster[idx].letterSection === activeLetter)
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

  for (let i = 0; i < index.poster.length; i++) {
    const p = index.poster[i];
    if (!matcharDataset(p, dataset)) continue;
    if (activeLetter && p.letterSection !== activeLetter) continue;

    const hwNorm = normaliseraSokterm(p.headwordDisplay.replace(/\s+och$/, ""));

    // 1. Exakt uppslagsord
    if (hwNorm === qNorm || normaliseraSokterm(p.headwordDisplay) === qNorm) {
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
    for (const v of p.variantsOriginal) {
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
        exactAliasHw = p.headwordDisplay;
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

    // 3.5. Ortografisk motsvarighet på uppslagsord (t.ex. konongær -> konunger, uatn -> vatn)
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
      for (const v of p.variantsOriginal) {
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

    // 5.5. Morfologisk böjningskandidat på uppslagsord (t.ex. laghum -> lagh, biskupinum -> biskuper)
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
    for (const v of p.variantsOriginal) {
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
        prefixAliasHw = p.headwordDisplay;
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
      for (const v of p.variantsOriginal) {
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
    hits: sida.map((k) =>
      tillListPost(
        index,
        k.idx,
        k.matchType,
        k.matchedForm,
        undefined,
        undefined,
        k.matchExplanation
      )
    ),
    morfologiskaKandidater:
      morfologiskaKandidater.length > 0 ? morfologiskaKandidater : undefined,
    executionTimeMs: Number((performance.now() - start).toFixed(2)),
  };
}

/**
 * Slår upp ett klickat ord från en fornsvensk lästext (/texter) mot Söderwalls
 * ordbok (Huvudverket + Supplementet).
 *
 * Principer:
 * - Skiljer alltid mellan exakt uppslagsord, exakt belagd stavnings-/böjningsvariant,
 *   ortografisk motsvarighet och böjnings-/stamkandidat.
 * - Returnerar aldrig en gissad betydelse utan visar källans egna artiklar tillsammans
 *   med den dokumenterade matchningskategorin.
 */
export function slaUppTextOrd(
  klickatOrd: string,
  maxTraffar = 8
): OrdbokTextUppslagResultat {
  const start = performance.now();
  const index = laddaMinnesIndex();
  const rensatOrd = rensaKlickatOrd(klickatOrd);

  if (!rensatOrd) {
    return {
      klickatOrd,
      rensatOrd: "",
      executionTimeMs: Number((performance.now() - start).toFixed(2)),
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
    // 1. Pröva mot uppslagsord (headword)
    const hwIndices = index.byExactHeadword.get(kand.form);
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

    // 2. Pröva mot källbelagda stavnings- och böjningsvarianter i <WordForm>
    const varPoster = index.byExactVariant.get(kand.form);
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
    const pa = index.poster[a.idx];
    const pb = index.poster[b.idx];
    // Föredra poster med utskrivna betydelsemoment framför rena hänvisningsposter
    const aHarSense = pa.senses.length > 0 ? 0 : 1;
    const bHarSense = pb.senses.length > 0 ? 0 : 1;
    if (aHarSense !== bHarSense) return aHarSense - bHarSense;
    // Föredra enkla uppslagsord framför flerordsfraser vid samma rank
    const aFras = pa.headwordDisplay.includes(" ") ? 1 : 0;
    const bFras = pb.headwordDisplay.includes(" ") ? 1 : 0;
    if (aFras !== bFras) return aFras - bFras;
    if (a.kandIdx !== b.kandIdx) return a.kandIdx - b.kandIdx;
    // Vid samma uppslagsord: huvudverket före supplementet
    if (pa.headwordDisplay === pb.headwordDisplay && pa.sourceDataset !== pb.sourceDataset) {
      return pa.sourceDataset === "soederwall" ? -1 : 1;
    }
    return a.idx - b.idx;
  });

  const urval = sorterade.slice(0, maxTraffar);

  const traffar: OrdbokTextUppslagTräff[] = urval.map((t) => ({
    listPost: tillListPost(
      index,
      t.idx,
      t.matchType,
      t.matchedVariant ?? t.kandidatForm
    ),
    post: hydreraOrdbokPost(index.poster[t.idx]),
    matchKategori: t.matchKategori,
    kandidatForm: t.kandidatForm,
    forklaring: t.forklaring,
  }));

  return {
    klickatOrd,
    rensatOrd,
    executionTimeMs: Number((performance.now() - start).toFixed(2)),
    traffar,
  };
}

/**
 * Uppdaterar minnesindexet direkt med en ny eller ändrad redaktionell rättelse
 * så att ändringen syns omedelbart i ordboken utan omstart av serverprocessen.
 */
export function appliceraRattelseIMinne(rattelse: OrdbokRattelse): void {
  const index = globalThis.__ordbokMinnesIndex;
  if (!index) return;
  const idx = index.byId.get(rattelse.id);
  if (idx === undefined) return;

  const p = index.poster[idx];
  p.rattelse = rattelse;
  if (rattelse.headwordDisplayOverride) {
    p.headwordDisplay = rattelse.headwordDisplayOverride;
  }
  p.reviewStatus = rattelse.reviewStatus;

  // Uppdatera härledd plain text
  const plain = byggPlainText(p);
  index.plainTexts[idx] = plain;
  index.plainTextsLower[idx] = plain.toLowerCase();

  // Registrera rättat uppslagsord i byExactHeadword
  const hwKey = normaliseraSokterm(p.headwordDisplay.replace(/\s+och$/, ""));
  const hwList = index.byExactHeadword.get(hwKey) ?? [];
  if (!hwList.includes(idx)) {
    hwList.push(idx);
    index.byExactHeadword.set(hwKey, hwList);
  }
}

/**
 * Raderar en rättelse ur minnesindexet och återställer postens original.
 */
export function avlasgnaRattelseIMinne(id: string): void {
  const index = globalThis.__ordbokMinnesIndex;
  if (!index) return;
  const idx = index.byId.get(id);
  if (idx === undefined) return;

  const p = index.poster[idx];
  delete p.rattelse;
  p.headwordDisplay = p.headwordOriginal;
  p.reviewStatus = "oandrad_kallimport";

  const plain = byggPlainText(p);
  index.plainTexts[idx] = plain;
  index.plainTextsLower[idx] = plain.toLowerCase();
}

/**
 * Uppdaterar minnesindexet med en ny eller redigerad modern definition.
 */
export function appliceraModernDefinitionIMinne(def: ModerniseradDefinition): void {
  const index = globalThis.__ordbokMinnesIndex;
  if (!index) return;
  const idx = index.byId.get(def.id);
  if (idx === undefined) return;
  index.poster[idx].modernDefinition = def;
}

/**
 * Raderar en kurerad modern definition ur minnet och återgår till automatisk glosering.
 */
export function avlasgnaModernDefinitionIMinne(id: string): void {
  const index = globalThis.__ordbokMinnesIndex;
  if (!index) return;
  const idx = index.byId.get(id);
  if (idx === undefined) return;
  const p = index.poster[idx];
  p.modernDefinition = extraheraAutomatiskGlosa(p) ?? undefined;
}



