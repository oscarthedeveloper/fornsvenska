/**
 * Supabase Postgres-adapter för Söderwalls ordbok.
 *
 * Används när projektet körs i molndrift med:
 *   NEXT_PUBLIC_DATA_SOURCE="supabase"
 * och Supabase-miljövariabler är konfigurerade.
 *
 * Hämtar poster, rättelser och moderna definitioner direkt via SQL/Postgres.
 */

import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaPublikServerKlient } from "@/lib/supabase/server";
import { SODERWALL_ALFABET } from "./normalisering";
import { byggExternaLankar } from "./proveniens";
import type {
  ModerniseradDefinition,
  OrdbokBokstavsStatistik,
  OrdbokFormRad,
  OrdbokHanvisning,
  OrdbokListPost,
  OrdbokPost,
  OrdbokRattelse,
  OrdbokSokParametrar,
  OrdbokSokResultat,
} from "./typer";

/** Sant när ordboken ska läsas direkt från Supabase Postgres i stället för lokal serverfil. */
export const ORDBOK_LAS_FRAN_SUPABASE =
  HAR_SUPABASE && process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

interface DbPostRad {
  id: string;
  source_dataset: "soederwall" | "soederwall-supp";
  kalla_id: "SOD1884" | "SOD-SUPP";
  source_entry_id: string;
  source_index: number;
  old_lemma: string | null;
  is_new_in_supplement: boolean;
  is_main_work_ae_in_supp_file: boolean;
  headword_original: string;
  headword_display: string;
  homonym_number: number | null;
  part_of_speech: string[];
  gram_original: string | null;
  information_original: string | null;
  old_form_original: string | null;
  variants_original: string[];
  word_form_rows: OrdbokFormRad[];
  senses: OrdbokPost["senses"];
  article_plain_text: string;
  search_keys: string[];
  alias_keys: string[];
  sort_key: string;
  letter_section: string;
  references_json: OrdbokHanvisning[];
  import_version: string;
  source_checksum: string;
  review_status: OrdbokPost["reviewStatus"];
  ordbok_rattelser?: {
    review_status: OrdbokPost["reviewStatus"];
    headword_display_override: string | null;
    note: string;
    kallstod: string;
    andrad: string;
  } | null;
  ordbok_moderna_definitioner?: {
    headword_display: string | null;
    modern_glos: string[];
    kort_forklaring: string;
    pedagogisk_not: string | null;
    modern_motsvarighet: string | null;
    kalla: "kurerad_redaktionell" | "automatisk_extraktion";
    granskad: boolean;
    uppdaterad: string;
  } | null;
}

function mappaDbRadTillOrdbokPost(rad: DbPostRad): OrdbokPost {
  const rattelse: OrdbokRattelse | undefined = rad.ordbok_rattelser
    ? {
        id: rad.id,
        headwordDisplayOverride: rad.ordbok_rattelser.headword_display_override ?? undefined,
        reviewStatus: rad.ordbok_rattelser.review_status,
        note: rad.ordbok_rattelser.note,
        kallstod: rad.ordbok_rattelser.kallstod,
        skapad: rad.ordbok_rattelser.andrad,
        andrad: rad.ordbok_rattelser.andrad,
      }
    : undefined;

  const modernDefinition: ModerniseradDefinition | undefined = rad.ordbok_moderna_definitioner
    ? {
        id: rad.id,
        headwordDisplay: rad.ordbok_moderna_definitioner.headword_display ?? rad.headword_display,
        modernGlos: rad.ordbok_moderna_definitioner.modern_glos,
        kortForklaring: rad.ordbok_moderna_definitioner.kort_forklaring,
        pedagogiskNot: rad.ordbok_moderna_definitioner.pedagogisk_not ?? undefined,
        modernMotsvarighet: rad.ordbok_moderna_definitioner.modern_motsvarighet ?? undefined,
        kalla: rad.ordbok_moderna_definitioner.kalla,
        granskad: rad.ordbok_moderna_definitioner.granskad,
        uppdaterad: rad.ordbok_moderna_definitioner.uppdaterad,
      }
    : undefined;

  return {
    id: rad.id,
    sourceDataset: rad.source_dataset,
    kallaId: rad.kalla_id,
    sourceEntryId: rad.source_entry_id,
    sourceIndex: rad.source_index,
    oldLemma: rad.old_lemma ?? undefined,
    isNewInSupplement: rad.is_new_in_supplement,
    isMainWorkAeInSuppFile: rad.is_main_work_ae_in_supp_file,
    headwordOriginal: rad.headword_original,
    headwordDisplay: rattelse?.headwordDisplayOverride ?? rad.headword_display,
    homonymNumber: rad.homonym_number ?? undefined,
    partOfSpeech: rad.part_of_speech,
    gramOriginal: rad.gram_original ?? undefined,
    informationOriginal: rad.information_original ?? undefined,
    oldFormOriginal: rad.old_form_original ?? undefined,
    variantsOriginal: rad.variants_original,
    wordFormRows: rad.word_form_rows,
    senses: rad.senses,
    articleOriginal: "",
    articlePlainText: rad.article_plain_text,
    searchKeys: rad.search_keys,
    aliasKeys: rad.alias_keys,
    sortKey: rad.sort_key,
    letterSection: rad.letter_section,
    references: rad.references_json,
    externalLinks: byggExternaLankar(
      rad.source_dataset,
      rad.letter_section,
      rad.is_main_work_ae_in_supp_file
    ),
    importVersion: rad.import_version,
    sourceChecksum: rad.source_checksum,
    reviewStatus: rattelse ? rattelse.reviewStatus : rad.review_status,
    supplierQualityNote:
      rad.source_dataset === "soederwall"
        ? "Språkbankens LMF-utgåva: uppslagsorden är kontrollästa efter manuell inkodning, men övrig artikeltext är inte korrekturläst."
        : "Språkbankens LMF-utgåva: varken uppslagsord eller övrig artikeltext är kontrollästa efter manuell inkodning.",
    rattelse,
    modernDefinition,
  };
}

function mappaDbRadTillListPost(rad: DbPostRad): OrdbokListPost {
  const p = mappaDbRadTillOrdbokPost(rad);
  return {
    id: p.id,
    sourceDataset: p.sourceDataset,
    kallaId: p.kallaId,
    sourceEntryId: p.sourceEntryId,
    headwordDisplay: p.headwordDisplay,
    homonymNumber: p.homonymNumber,
    partOfSpeech: p.partOfSpeech,
    gramOriginal: p.gramOriginal,
    variantsPreview: p.variantsOriginal.slice(0, 4),
    snippet: p.articlePlainText.slice(0, 160) + (p.articlePlainText.length > 160 ? "…" : ""),
    letterSection: p.letterSection,
    isNewInSupplement: p.isNewInSupplement,
    isMainWorkAeInSuppFile: p.isMainWorkAeInSuppFile,
    rattelse: p.rattelse,
    modernDefinition: p.modernDefinition,
  };
}

/**
 * Hämtar en enskild ordbokspost från Supabase.
 */
export async function hamtaOrdbokPostDb(id: string): Promise<OrdbokPost | null> {
  const supabase = skapaPublikServerKlient();
  const { data, error } = await supabase
    .from("ordbok_poster")
    .select("*, ordbok_rattelser(*), ordbok_moderna_definitioner(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mappaDbRadTillOrdbokPost(data as unknown as DbPostRad);
}

/**
 * Utför sökning eller alfabetisk bläddring direkt mot Supabase Postgres.
 */
export async function sokOrdbokDb(
  parametrar: OrdbokSokParametrar
): Promise<OrdbokSokResultat> {
  const start = performance.now();
  const supabase = skapaPublikServerKlient();

  const {
    q = "",
    mode = "uppslagsord",
    letter,
    dataset = "alla",
    page = 1,
    pageSize = 30,
  } = parametrar;

  const renQ = q.trim();
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("ordbok_poster")
    .select("*, ordbok_rattelser(*), ordbok_moderna_definitioner(*)", {
      count: "exact",
    });

  if (dataset !== "alla") {
    query = query.eq("source_dataset", dataset);
  }

  if (renQ) {
    if (mode === "artikeltext") {
      query = query.ilike("article_plain_text", `%${renQ}%`);
    } else {
      query = query.or(
        `headword_display.ilike.${renQ}%,search_keys.cs.{${renQ.toLowerCase()}},alias_keys.cs.{${renQ.toLowerCase()}}`
      );
    }
  } else if (letter) {
    query = query.eq("letter_section", letter.toUpperCase());
  }

  query = query
    .order("letter_section", { ascending: true })
    .order("sort_key", { ascending: true })
    .range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;

  const elapsed = Number((performance.now() - start).toFixed(2));

  if (error || !data) {
    return {
      query: renQ,
      mode,
      letter: letter ?? null,
      dataset,
      totalHits: 0,
      page,
      pageSize,
      totalPages: 0,
      executionTimeMs: elapsed,
      hits: [],
    };
  }

  const hits = (data as unknown as DbPostRad[]).map(mappaDbRadTillListPost);
  const totalHits = count ?? hits.length;
  const totalPages = Math.ceil(totalHits / pageSize);

  return {
    query: renQ,
    mode,
    letter: letter ?? null,
    dataset,
    totalHits,
    page,
    pageSize,
    totalPages,
    executionTimeMs: elapsed,
    hits,
  };
}

/**
 * Hämtar statistik per bokstav ur Supabase.
 */
export async function hamtaBokstavsStatistikDb(): Promise<OrdbokBokstavsStatistik[]> {
  const supabase = skapaPublikServerKlient();
  const { data, error } = await supabase
    .from("ordbok_poster")
    .select("letter_section, source_dataset");

  if (error || !data) {
    return SODERWALL_ALFABET.map((letter) => ({
      letter,
      label: letter === "Þ" ? "Þ (TH)" : letter,
      total: 0,
      mainCount: 0,
      suppCount: 0,
    }));
  }

  const counts: Record<string, { total: number; main: number; supp: number }> = {};
  for (const b of SODERWALL_ALFABET) {
    counts[b] = { total: 0, main: 0, supp: 0 };
  }

  for (const rad of data as { letter_section: string; source_dataset: string }[]) {
    const sec = counts[rad.letter_section];
    if (sec) {
      sec.total++;
      if (rad.source_dataset === "soederwall") sec.main++;
      else sec.supp++;
    }
  }

  return SODERWALL_ALFABET.map((letter) => ({
    letter,
    label: letter === "Þ" ? "Þ (TH)" : letter,
    total: counts[letter]?.total ?? 0,
    mainCount: counts[letter]?.main ?? 0,
    suppCount: counts[letter]?.supp ?? 0,
  }));
}
