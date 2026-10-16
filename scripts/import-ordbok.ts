/**
 * Reproducerbart importskript för Söderwalls ordbok (Huvudverket + Supplementet).
 *
 * Läser:
 * - Källor/soederwall.xml (SOD1884, 22 572 poster)
 * - Källor/soederwall-supp.xml (SOD-SUPP, 19 172 poster)
 * - data/ordbok-rattelser.json (valfri separat fil för redaktionella rättelser som
 *   aldrig skrivs över vid omimport).
 *
 * Producerar:
 * - data/ordbok/poster.json (kanonisk serverdata med samtliga 41 744 poster)
 * - docs/ordbok/importrapport.json (maskinläsbar valideringsrapport)
 * - docs/ordbok/etapp2-importrapport.md (läsbar import- och valideringsrapport)
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  beraknaBokstavssektion,
  beraknaSorteringsnyckel,
  genereraOrtografiskaAlias,
  normaliseraSokterm,
} from "../lib/ordbok/normalisering";
import type {
  OrdbokBetydelse,
  OrdbokDataset,
  OrdbokFormRad,
  OrdbokGranskningsstatus,
  OrdbokHanvisning,
  OrdbokKallaId,
  OrdbokKalllank,
  OrdbokPost,
} from "../lib/ordbok/typer";

const IMPORT_VERSION = "2026-10-16.v1";
const PROJEKTROT = process.cwd();
const KALLROT = path.join(PROJEKTROT, "Källor");
const DATA_UT = path.join(PROJEKTROT, "data", "ordbok");
const DOCS_UT = path.join(PROJEKTROT, "docs", "ordbok");
const RATTELSER_FIL = path.join(PROJEKTROT, "data", "ordbok-rattelser.json");

interface RattelsePost {
  id: string;
  reviewStatus: OrdbokGranskningsstatus;
  note: string;
  headwordDisplayOverride?: string;
}

const GRAM_STOP = new Set([
  "pl",
  "sg",
  "sing",
  "pres",
  "impf",
  "pret",
  "part",
  "pass",
  "akt",
  "inf",
  "nom",
  "gen",
  "dat",
  "ack",
  "m",
  "f",
  "n",
  "adj",
  "adv",
  "prep",
  "konj",
  "interj",
  "pron",
  "v",
  "subst",
  "utt",
  "ib",
  "jfr",
  "se",
  "el",
  "eller",
  "och",
  "samt",
  "ss",
  "trol",
  "osv",
  "cod",
  "red",
  "ns",
  "kap",
  "mom",
  "s",
  "rad",
  "val",
  "fore",
]);

function avkodaXmlEntiteter(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .normalize("NFC");
}

function byggId(dataset: OrdbokDataset, lemgram: string): string {
  const ren = lemgram.replace(/^fsvm--/, "").replace(/\.\./g, "-");
  return `${dataset}--${ren}`;
}

function extraheraHomonymNummer(lemgram: string): number | undefined {
  const m = lemgram.match(/\.(\d+)$/);
  if (!m) return undefined;
  const num = Number.parseInt(m[1], 10);
  return Number.isNaN(num) ? undefined : num;
}

function byggExternaLankar(
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

  // Bandöversikt hos Projekt Runeberg (aldrig påhittad sidlänk!)
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

function extraheraVarianterUrWordForm(
  rows: OrdbokFormRad[],
  headword: string,
  oldForm?: string
): string[] {
  const varianter = new Set<string>();
  const hwNorm = normaliseraSokterm(headword);

  if (oldForm) {
    const renOld = oldForm.trim();
    if (renOld && normaliseraSokterm(renOld) !== hwNorm) {
      varianter.add(renOld);
    }
  }

  for (const rad of rows) {
    if (rad.orth) {
      const o = rad.orth.trim();
      if (o && normaliseraSokterm(o) !== hwNorm && !GRAM_STOP.has(o.toLowerCase())) {
        varianter.add(o);
      }
    }
    if (rad.att === "gram") continue;

    const clean = rad.val.trim();
    if (!clean || clean.startsWith("-")) continue;

    // 1. Om hela värdet (efter borttagning av inledande * och avslutande ),.;:) är ett rent ord/uttryck:
    const stripped = clean
      .replace(/^\*/, "")
      .replace(/[\s).,;:]+$/, "")
      .trim();

    if (
      stripped.length >= 2 &&
      stripped.length <= 36 &&
      /^[a-zåäöæøþ-]+(?:\s+[a-zåäöæøþ-]+)?$/i.test(stripped) &&
      !stripped.startsWith("-")
    ) {
      const lag = stripped.toLowerCase();
      if (normaliseraSokterm(lag) !== hwNorm && !GRAM_STOP.has(lag)) {
        varianter.add(stripped);
      }
      continue;
    }

    // 2. Annars splitta på ". ", "; " eller ")," och extrahera inledande fornsvensk ordform
    // före kolon, parentes eller källförkortning med versal
    const segments = clean.split(/(?:[.;]|\),)\s+/);
    for (const seg of segments) {
      const s = seg.replace(/^\*/, "").trim();
      if (!s || s.startsWith("-")) continue;
      const m = s.match(/^([a-zåäöæøþ]{2,}(?:-[a-zåäöæøþ]*)?)(?=\s*(?:[:),;.]|$|\s+[A-Z0-9(]))/);
      if (m) {
        const ord = m[1].trim();
        const lag = ord.toLowerCase();
        if (
          ord.length >= 2 &&
          normaliseraSokterm(lag) !== hwNorm &&
          !GRAM_STOP.has(lag)
        ) {
          varianter.add(ord);
        }
      }
    }
  }

  return [...varianter];
}

function extraheraKorshanvisningar(text: string, ownHeadword: string): OrdbokHanvisning[] {
  const resultat: OrdbokHanvisning[] = [];
  const sedda = new Set<string>();

  // Matcha t.ex. ", se ädhla." eller "se ofbradher." eller "Jfr ovan-, up-a." eller "se mal."
  const re = /(?:^|[\s,(.;])(se\s+([a-zåäöæøþ]{2,}(?:\s+[a-zåäöæøþ]+)?))\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const rawText = m[1].trim();
    const kandidat = m[2].trim().toLowerCase();
    if (
      ["detta", "detta ord", "ofvan", "ovan", "nedan", "under", "vidare", "dock", "äfven", "även"].some(
        (stop) => kandidat === stop || kandidat.startsWith(stop + " ")
      )
    ) {
      continue;
    }
    if (normaliseraSokterm(kandidat) === normaliseraSokterm(ownHeadword)) continue;
    if (sedda.has(kandidat)) continue;
    sedda.add(kandidat);
    resultat.push({
      rawText,
      targetHeadword: kandidat,
    });
  }

  return resultat;
}

interface ParseStatistik {
  dataset: OrdbokDataset;
  totalEntries: number;
  entriesWithoutSense: number;
  entriesWithMalformedOrthAttr: number;
  sensesWithoutDefinition: number;
  definitionsWithMultipleTextFeats: number;
  warnings: string[];
}

function parsaXmlFil(
  sokvag: string,
  dataset: OrdbokDataset,
  kallaId: OrdbokKallaId,
  supplierQualityNote: string,
  rattelserMap: Map<string, RattelsePost>
): { poster: OrdbokPost[]; sha256: string; stat: ParseStatistik } {
  const buffer = readFileSync(sokvag);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const xml = buffer.toString("utf8");

  const entryMatches = xml.match(/<LexicalEntry[\s\S]*?<\/LexicalEntry>/g) ?? [];
  const poster: OrdbokPost[] = [];
  const stat: ParseStatistik = {
    dataset,
    totalEntries: entryMatches.length,
    entriesWithoutSense: 0,
    entriesWithMalformedOrthAttr: 0,
    sensesWithoutDefinition: 0,
    definitionsWithMultipleTextFeats: 0,
    warnings: [],
  };

  for (let idx = 0; idx < entryMatches.length; idx++) {
    const rawEntry = entryMatches[idx];

    const lemmaBlock = (rawEntry.match(/<Lemma>([\s\S]*?)<\/Lemma>/) ?? ["", ""])[1];
    const oldLemmaMatch = lemmaBlock.match(/<feat att="oldlemma" val="([^"]*)"/);
    const oldLemma = oldLemmaMatch ? avkodaXmlEntiteter(oldLemmaMatch[1]) : undefined;
    const isNewInSupplement = oldLemma ? oldLemma.includes("*") : undefined;

    const formRepBlock = (lemmaBlock.match(
      /<FormRepresentation>([\s\S]*?)<\/FormRepresentation>/
    ) ?? ["", ""])[1];

    const lemgramMatch = formRepBlock.match(/<feat att="lemgram" val="([^"]*)"/);
    const sourceEntryId = lemgramMatch
      ? avkodaXmlEntiteter(lemgramMatch[1])
      : `${dataset}-fallback-${idx}`;

    const wfMatch = formRepBlock.match(/<feat att="writtenForm" val="([^"]*)"/);
    const headwordOriginal = wfMatch ? avkodaXmlEntiteter(wfMatch[1]) : "";
    const headwordDisplay = headwordOriginal.replace(/\s+/g, " ").trim();

    const partOfSpeech = [
      ...formRepBlock.matchAll(/<feat att="partOfSpeech" val="([^"]*)"/g),
    ].map((m) => avkodaXmlEntiteter(m[1]));

    const gramMatch = formRepBlock.match(/<feat att="gram" val="([^"]*)"/);
    const gramOriginal = gramMatch ? avkodaXmlEntiteter(gramMatch[1]).trim() : undefined;

    const infoMatch = formRepBlock.match(/<feat att="information" val="([^"]*)"/);
    const informationOriginal = infoMatch
      ? avkodaXmlEntiteter(infoMatch[1]).trim()
      : undefined;

    const oldFormMatch = formRepBlock.match(/<feat att="oldForm" val="([^"]*)"/);
    const oldFormOriginal = oldFormMatch
      ? avkodaXmlEntiteter(oldFormMatch[1]).trim()
      : undefined;

    // Parsa <WordForm>
    const wfBlockMatch = rawEntry.match(/<WordForm>([\s\S]*?)<\/WordForm>/);
    const wordFormRows: OrdbokFormRad[] = [];
    if (wfBlockMatch) {
      let hadMalformedOrth = false;
      for (const m of wfBlockMatch[1].matchAll(/<feat att="([^"]*)" val="([^"]*)"/g)) {
        const rawAtt = m[1];
        const rawVal = avkodaXmlEntiteter(m[2]);
        // Hantera trasiga attribut som att="V0IPA**' orth='delir"
        const orthMatch = rawAtt.match(/^([^']*)'\s*orth='([^']*)$/);
        if (orthMatch) {
          hadMalformedOrth = true;
          wordFormRows.push({
            att: orthMatch[1].trim(),
            orth: avkodaXmlEntiteter(orthMatch[2].trim()),
            val: rawVal,
          });
        } else {
          wordFormRows.push({
            att: rawAtt,
            val: rawVal,
          });
        }
      }
      if (hadMalformedOrth) {
        stat.entriesWithMalformedOrthAttr++;
      }
    }

    // Parsa <Sense>
    const senseBlocks = rawEntry.match(/<Sense[\s\S]*?<\/Sense>/g) ?? [];
    if (senseBlocks.length === 0) {
      stat.entriesWithoutSense++;
    }

    const senses: OrdbokBetydelse[] = [];
    for (let sIdx = 0; sIdx < senseBlocks.length; sIdx++) {
      const sb = senseBlocks[sIdx];
      const senseIdMatch = sb.match(/<Sense\s+id="([^"]*)"/);
      const senseId = senseIdMatch
        ? avkodaXmlEntiteter(senseIdMatch[1])
        : `${sourceEntryId}--s${sIdx + 1}`;

      // Ta ut feat direkt under <Sense> (utanför <Definition>)
      const utanDef = sb.replace(/<Definition>[\s\S]*?<\/Definition>/g, "");
      const directTexts = [...utanDef.matchAll(/<feat att="text" val="([^"]*)"/g)].map((m) =>
        avkodaXmlEntiteter(m[1])
      );
      const directGramMatch = utanDef.match(/<feat att="gram" val="([^"]*)"/);
      const directWfMatch = utanDef.match(/<feat att="writtenForm" val="([^"]*)"/);

      const defBlocks = sb.match(/<Definition>([\s\S]*?)<\/Definition>/g) ?? [];
      const defTexts: string[] = [];
      for (const db of defBlocks) {
        const tFeats = [...db.matchAll(/<feat att="text" val="([^"]*)"/g)].map((m) =>
          avkodaXmlEntiteter(m[1])
        );
        if (tFeats.length > 1) {
          stat.definitionsWithMultipleTextFeats++;
        }
        defTexts.push(...tFeats);
      }

      let etikett: string | undefined;
      let huvudtext = "";

      if (defTexts.length === 0) {
        // Betydelsetexten ligger direkt på <Sense><feat att="text" .../></Sense>
        stat.sensesWithoutDefinition++;
        const samlad = directTexts.join(" ").trim();
        const etikettMatch = samlad.match(/^(\d+\)|[A-Z]\))\s*(.*)$/s);
        if (etikettMatch && etikettMatch[2].trim()) {
          etikett = etikettMatch[1];
          huvudtext = etikettMatch[2].trim();
        } else {
          huvudtext = samlad;
        }
      } else {
        const directSamlad = directTexts.join(" ").trim();
        if (directSamlad) {
          etikett = directSamlad;
        }
        huvudtext = defTexts.join(" ").trim();
      }

      senses.push({
        id: senseId,
        etikett,
        gram: directGramMatch ? avkodaXmlEntiteter(directGramMatch[1]).trim() : undefined,
        writtenForm: directWfMatch
          ? avkodaXmlEntiteter(directWfMatch[1]).trim()
          : undefined,
        text: huvudtext,
      });
    }

    const id = byggId(dataset, sourceEntryId);
    const isMainWorkAeInSuppFile =
      dataset === "soederwall-supp" && idx >= 17988 && idx <= 18319 ? true : undefined;

    const variantsOriginal = extraheraVarianterUrWordForm(
      wordFormRows,
      headwordDisplay,
      oldFormOriginal
    );

    // Bygg söknycklar (lowercase NFC) för uppslagsord och varianter
    const searchKeysSet = new Set<string>();
    const hwClean = headwordDisplay.replace(/\s+och$/, "").trim();
    if (hwClean) searchKeysSet.add(normaliseraSokterm(hwClean));
    if (headwordDisplay) searchKeysSet.add(normaliseraSokterm(headwordDisplay));
    for (const v of variantsOriginal) {
      const vn = normaliseraSokterm(v.replace(/-$/, ""));
      if (vn.length >= 2) searchKeysSet.add(vn);
    }

    // Bygg ortografiska aliasnycklar (separerade från exakta söknycklar)
    const aliasKeysSet = new Set<string>();
    for (const key of searchKeysSet) {
      for (const alias of genereraOrtografiskaAlias(key)) {
        if (!searchKeysSet.has(alias)) {
          aliasKeysSet.add(alias);
        }
      }
    }

    // Bygg artikelns klartext för fritextsökning och utdrag
    const wfText = wordFormRows
      .map((r) => (r.orth ? `${r.orth} (${r.val.trim()})` : r.val.trim()))
      .filter(Boolean)
      .join(" ");
    const senseText = senses
      .map((s) => [s.etikett, s.gram, s.writtenForm, s.text].filter(Boolean).join(" "))
      .join(" ");
    const articlePlainText = [
      headwordDisplay,
      gramOriginal,
      informationOriginal,
      wfText,
      senseText,
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const homonymNumber = extraheraHomonymNummer(sourceEntryId);
    const letterSection = beraknaBokstavssektion(headwordDisplay, dataset, idx);
    const sortKey = beraknaSorteringsnyckel(headwordDisplay, dataset, idx, homonymNumber);
    const references = extraheraKorshanvisningar(senseText || wfText, headwordDisplay);
    const externalLinks = byggExternaLankar(
      dataset,
      letterSection,
      isMainWorkAeInSuppFile
    );

    const rattelse = rattelserMap.get(id);

    poster.push({
      id,
      sourceDataset: dataset,
      kallaId,
      sourceEntryId,
      sourceIndex: idx,
      oldLemma,
      isNewInSupplement,
      isMainWorkAeInSuppFile,
      headwordOriginal,
      headwordDisplay: rattelse?.headwordDisplayOverride ?? headwordDisplay,
      homonymNumber,
      partOfSpeech,
      gramOriginal,
      informationOriginal,
      oldFormOriginal,
      variantsOriginal,
      wordFormRows,
      senses,
      articleOriginal: rawEntry.trim(),
      articlePlainText,
      searchKeys: [...searchKeysSet],
      aliasKeys: [...aliasKeysSet],
      sortKey,
      letterSection,
      references,
      externalLinks,
      importVersion: IMPORT_VERSION,
      sourceChecksum: sha256,
      reviewStatus: rattelse?.reviewStatus ?? "oandrad_kallimport",
      supplierQualityNote,
    });
  }

  return { poster, sha256, stat };
}

function main() {
  const start = Date.now();
  mkdirSync(DATA_UT, { recursive: true });
  mkdirSync(DOCS_UT, { recursive: true });

  // Läs eventuella separata redaktionella rättelser så att de bevaras vid omimport
  const rattelserMap = new Map<string, RattelsePost>();
  if (existsSync(RATTELSER_FIL)) {
    const lista = JSON.parse(readFileSync(RATTELSER_FIL, "utf8")) as RattelsePost[];
    for (const r of lista) rattelserMap.set(r.id, r);
  } else {
    writeFileSync(RATTELSER_FIL, "[]\n", "utf8");
  }

  const huvudFil = path.join(KALLROT, "soederwall.xml");
  const suppFil = path.join(KALLROT, "soederwall-supp.xml");

  const resHuvud = parsaXmlFil(
    huvudFil,
    "soederwall",
    "SOD1884",
    "Språkbankens LMF-utgåva: uppslagsorden är kontrollästa efter manuell inkodning, men övrig artikeltext är inte korrekturläst.",
    rattelserMap
  );

  const resSupp = parsaXmlFil(
    suppFil,
    "soederwall-supp",
    "SOD-SUPP",
    "Språkbankens LMF-utgåva: varken uppslagsord eller övrig artikeltext är kontrollästa efter manuell inkodning.",
    rattelserMap
  );

  const allaPoster = [...resHuvud.poster, ...resSupp.poster];

  // Kontrollera att alla ID:n är globalt unika
  const idSet = new Set<string>();
  const dubblettIdn: string[] = [];
  for (const p of allaPoster) {
    if (idSet.has(p.id)) dubblettIdn.push(p.id);
    idSet.add(p.id);
  }
  if (dubblettIdn.length > 0) {
    throw new Error(`Kritiskt fel: dubblerade post-ID:n vid import: ${dubblettIdn.join(", ")}`);
  }

  // Lös korshänvisningar ("se X") där målordet finns i ordboken
  const headwordToIds = new Map<string, string[]>();
  for (const p of allaPoster) {
    const nyckel = normaliseraSokterm(p.headwordDisplay.replace(/\s+och$/, ""));
    const bef = headwordToIds.get(nyckel) ?? [];
    bef.push(p.id);
    headwordToIds.set(nyckel, bef);
  }

  let lostaHanvisningar = 0;
  let olostaHanvisningar = 0;
  const olostaExempel: { fromId: string; fromHw: string; targetHw: string }[] = [];

  for (const p of allaPoster) {
    for (const ref of p.references) {
      if (!ref.targetHeadword) continue;
      const nyckel = normaliseraSokterm(ref.targetHeadword);
      let mal = headwordToIds.get(nyckel);
      if (!mal) {
        // Pröva ortografiska alias (t.ex. "se ädhla" eller "se þing")
        for (const alias of genereraOrtografiskaAlias(nyckel)) {
          mal = headwordToIds.get(alias);
          if (mal) break;
        }
      }
      if (mal && mal.length > 0) {
        ref.targetEntryId = mal[0];
        lostaHanvisningar++;
      } else {
        olostaHanvisningar++;
        if (olostaExempel.length < 25) {
          olostaExempel.push({
            fromId: p.id,
            fromHw: p.headwordDisplay,
            targetHw: ref.targetHeadword,
          });
        }
      }
    }
  }

  // Spara en kompakt men 100 % förlustfri serverdatafil (exkluderar identiska strängkonstanter
  // per datamängd och härledd articlePlainText som återskapas vid läsning via hydreraOrdbokPost).
  const runtimePoster = allaPoster.map((p) => {
    const {
      articleOriginal: _raw,
      articlePlainText: _plain,
      externalLinks: _links,
      importVersion: _ver,
      sourceChecksum: _sum,
      supplierQualityNote: _qual,
      kallaId: _kalla,
      reviewStatus,
      ...rest
    } = p;
    return {
      ...rest,
      ...(reviewStatus !== "oandrad_kallimport" ? { reviewStatus } : {}),
    };
  });

  const utFil = path.join(DATA_UT, "poster.json");
  writeFileSync(utFil, JSON.stringify(runtimePoster), "utf8");

  const elapsedMs = Date.now() - start;

  const rapport = {
    importVersion: IMPORT_VERSION,
    executedAt: new Date().toISOString(),
    elapsedMs,
    totalEntries: allaPoster.length,
    uniqueIds: idSet.size,
    duplicateIds: dubblettIdn.length,
    resolvedCrossReferences: lostaHanvisningar,
    unresolvedCrossReferences: olostaHanvisningar,
    unresolvedCrossReferenceSamples: olostaExempel,
    datasets: {
      soederwall: {
        sha256: resHuvud.sha256,
        ...resHuvud.stat,
      },
      "soederwall-supp": {
        sha256: resSupp.sha256,
        ...resSupp.stat,
      },
    },
  };

  writeFileSync(
    path.join(DOCS_UT, "importrapport.json"),
    JSON.stringify(rapport, null, 2) + "\n",
    "utf8"
  );

  console.log(`Import slutförd på ${elapsedMs} ms.`);
  console.log(`Huvudverket (SOD1884): ${resHuvud.poster.length} poster.`);
  console.log(`Supplementet (SOD-SUPP): ${resSupp.poster.length} poster.`);
  console.log(`Totalt: ${allaPoster.length} unika poster sparade till data/ordbok/poster.json.`);
  console.log(
    `Korshänvisningar: ${lostaHanvisningar} lösta, ${olostaHanvisningar} olösta (bevarade som ren text utan gissad länk).`
  );
}

main();
