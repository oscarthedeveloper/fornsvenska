/**
 * Verifierings- och prestandatest för Etapp 3 (Sökning och alfabetisk bläddring).
 *
 * Testar:
 * 1. Rangordning (exakt uppslagsord > exakt variant > exakt alias > prefix > prefix variant/alias).
 * 2. Specialtecken (þ, ä, ö, æ, ø) och ortografiska alias (th <-> þ, dh <-> þ).
 * 3. Sökning i både Huvudverket (SOD1884) och Supplementet (SOD-SUPP).
 * 4. Separat sökläge för historisk artikeltext.
 * 5. Alfabetisk ordning (A..Ö, sist Þ/TH) och paginering.
 * 6. Tomma sökningar, noll träffar och svarstider över alla 41 744 poster.
 */

import assert from "node:assert/strict";
import {
  hamtaBokstavsStatistik,
  hamtaOrdbokPost,
  hamtaRelateradeUppslagsord,
  slaUppTextOrd,
  sokOrdbok,
} from "../lib/ordbok/ordbokServer";
import {
  exporteraSparadeOrd,
  type SparatOrdbokOrd,
} from "../lib/ordbok/bokmarken";
import {
  beraknaRattelseDiff,
  lasAllaRattelser,
  sparaRattelseFilOchDb,
  taBortRattelseFilOchDb,
} from "../lib/ordbok/rattelser";
import {
  appliceraRattelseIMinne,
  avlasgnaRattelseIMinne,
} from "../lib/ordbok/ordbokServer";
import {
  extraheraAutomatiskGlosa,
  modernisera1800TalsSvenska,
  sparaModernDefinitionFil,
  taBortModernDefinitionFil,
} from "../lib/ordbok/modernisering";

async function main() {
  console.log("=== Etapp 3: Tester och prestandamätning ===");

  // 1. Första inladdning (kallstart) + bokstavsstatistik
  const t0 = performance.now();
  const bokstaver = hamtaBokstavsStatistik();
  const coldLoadMs = Number((performance.now() - t0).toFixed(2));
  const totalInStat = bokstaver.reduce((sum, b) => sum + b.total, 0);
  console.log(`Kallstart (inläsning + indexering av ${totalInStat} poster): ${coldLoadMs} ms`);
  assert.equal(totalInStat, 41744, "Summan av bokstavsstatistiken ska vara exakt 41 744");
  assert.equal(bokstaver[0].letter, "A", "Första bokstavssektionen ska vara A");
  assert.equal(
    bokstaver[bokstaver.length - 1].letter,
    "Þ",
    "Sista bokstavssektionen ska vara Þ (efter Ö)"
  );

  // 2. Exakt träff och homonymhantering ("vara")
  const resVara = sokOrdbok({ q: "vara", mode: "uppslagsord" });
  console.log(
    `Sökning "vara" (uppslagsord): ${resVara.totalHits} träffar på ${resVara.executionTimeMs} ms`
  );
  assert(resVara.totalHits >= 6, "Bör hitta minst de 6 homonymerna av 'vara'");
  assert.equal(resVara.hits[0].headwordDisplay, "vara");
  assert.equal(resVara.hits[0].matchType, "exact_headword");

  // 3. Variantträff ("delir" och "deladhe" under "dela", samt "aboot" under "abot")
  const resDelir = sokOrdbok({ q: "delir", mode: "uppslagsord" });
  console.log(
    `Sökning "delir" (variant ur orth-attribut): ${resDelir.totalHits} träffar på ${resDelir.executionTimeMs} ms`
  );
  assert(
    resDelir.hits.some((h) => h.headwordDisplay === "dela" && h.matchType === "exact_variant"),
    "Ska hitta 'dela' via varianten 'delir'"
  );

  const resAboot = sokOrdbok({ q: "aboot", mode: "uppslagsord" });
  assert(
    resAboot.hits.some((h) => h.headwordDisplay === "abot" && h.matchType === "exact_variant"),
    "Ska hitta 'abot' i supplementet via varianten 'aboot'"
  );

  // 4. Specialtecken þ och alias th <-> þ ("þing" vs "thing", "aþalkona" vs "adhalkona")
  const resThing = sokOrdbok({ q: "þing", mode: "uppslagsord" });
  assert.equal(resThing.hits[0].headwordDisplay, "þing");
  assert.equal(resThing.hits[0].matchType, "exact_headword");

  const resThingAlias = sokOrdbok({ q: "thing", mode: "uppslagsord" });
  console.log(
    `Sökning "thing" (alias/uppslagsord): ${resThingAlias.totalHits} träffar på ${resThingAlias.executionTimeMs} ms`
  );
  assert(
    resThingAlias.hits.some((h) => h.headwordDisplay === "þing" && h.matchType === "alias_headword"),
    "Sökning på 'thing' ska hitta 'þing' som alias_headword"
  );

  const resAdhalkona = sokOrdbok({ q: "adhalkona", mode: "uppslagsord" });
  assert(
    resAdhalkona.hits.some((h) => h.headwordDisplay === "aþalkona"),
    "Sökning på 'adhalkona' ska hitta 'aþalkona' via dh<->þ alias"
  );

  // 5. Ligaturer æ -> ä och ø -> ö ("ægha" -> "ägha", "øgha" -> "ögha")
  const resAegha = sokOrdbok({ q: "ægha", mode: "uppslagsord" });
  assert(
    resAegha.hits.some((h) => h.headwordDisplay === "ägha"),
    "Sökning på 'ægha' ska hitta 'ägha'"
  );

  const resOegha = sokOrdbok({ q: "øgha", mode: "uppslagsord" });
  assert(
    resOegha.hits.some((h) => h.headwordDisplay === "ögha"),
    "Sökning på 'øgha' ska hitta 'ögha'"
  );

  // 6. Både huvudverk och supplement + källfilter
  const resA = sokOrdbok({ q: "a", mode: "uppslagsord" });
  const exactA = resA.hits.filter((h) => h.matchType === "exact_headword");
  assert(
    exactA.some((h) => h.sourceDataset === "soederwall") &&
      exactA.some((h) => h.sourceDataset === "soederwall-supp"),
    "Exakta träffar på 'a' ska finnas i både huvudverk och supplement"
  );

  const resASuppOnly = sokOrdbok({
    q: "a",
    mode: "uppslagsord",
    dataset: "soederwall-supp",
  });
  assert(
    resASuppOnly.hits.every((h) => h.sourceDataset === "soederwall-supp"),
    "Datasetfilter 'soederwall-supp' ska enbart returnera supplementposter"
  );

  // 7. Artikeltextsökning
  const resArtikel = sokOrdbok({ q: "abbedissa", mode: "artikeltext" });
  console.log(
    `Sökning "abbedissa" (artikeltext): ${resArtikel.totalHits} träffar på ${resArtikel.executionTimeMs} ms`
  );
  assert(resArtikel.totalHits >= 2, "Artikeltextsökning på 'abbedissa' ska ge träffar");
  assert(
    resArtikel.hits.some((h) => h.id === "soederwall-supp--abbadissa-e.1"),
    "Ska även hitta posten abbadissa..e.1 i supplementet (som saknar <Sense> men har definitionen i <WordForm>)"
  );

  // 8. Tom sökning + alfabetisk bläddring + paginering
  const resBladdraTh = sokOrdbok({ letter: "Þ", page: 1, pageSize: 25 });
  console.log(
    `Alfabetisk bläddring bokstav Þ (sida 1): ${resBladdraTh.totalHits} poster på ${resBladdraTh.executionTimeMs} ms`
  );
  assert.equal(resBladdraTh.totalHits, 999, "Bokstaven Þ har 571 + 428 = 999 poster");
  assert.equal(resBladdraTh.hits.length, 25);

  const resBladdraThSida2 = sokOrdbok({ letter: "Þ", page: 2, pageSize: 25 });
  assert.notEqual(
    resBladdraTh.hits[0].id,
    resBladdraThSida2.hits[0].id,
    "Sida 1 och sida 2 ska ha olika poster"
  );

  // 9. Noll träffar
  const resNoll = sokOrdbok({ q: "xyz123finnsinte", mode: "uppslagsord" });
  assert.equal(resNoll.totalHits, 0);
  assert.equal(resNoll.hits.length, 0);

  // 10. Enskild post + relaterade poster
  const postKonunger = hamtaOrdbokPost("soederwall--konunger-nn.1");
  assert(postKonunger !== null, "Ska kunna hämta konunger..nn.1 med ID");
  assert.equal(postKonunger.headwordDisplay, "konunger");
  const relKonunger = hamtaRelateradeUppslagsord(postKonunger);
  assert(
    relKonunger.sammaUppslagsordHuvudverk.length >= 1,
    "konunger har minst en homonym i huvudverket"
  );

  // 11. Svarstidsmätning över en svit på 10 vanliga frågor (varma svarstider)
  const testFragor = [
    { q: "konunger", mode: "uppslagsord" as const },
    { q: "lagh", mode: "uppslagsord" as const },
    { q: "þing", mode: "uppslagsord" as const },
    { q: "thing", mode: "uppslagsord" as const },
    { q: "ägha", mode: "uppslagsord" as const },
    { q: "hava", mode: "uppslagsord" as const },
    { q: "hus", mode: "uppslagsord" as const },
    { q: "rätter", mode: "uppslagsord" as const },
    { q: "stadh", mode: "artikeltext" as const },
    { q: "kloster", mode: "artikeltext" as const },
  ];

  const tider: { label: string; ms: number; hits: number }[] = [];
  for (const tf of testFragor) {
    const r = sokOrdbok(tf);
    tider.push({
      label: `${tf.mode}:${tf.q}`,
      ms: r.executionTimeMs,
      hits: r.totalHits,
    });
  }
  console.log("Uppmätta svarstider (hela datamängden, 41 744 poster):");
  console.table(tider);

  // 12. Klicka-på-ord-uppslagning från /texter (slaUppTextOrd)
  console.log("\n=== Klicka-på-ord-uppslagning (/texter -> Söderwall) ===");
  const textOrdTester: {
    ord: string;
    forvantatUppslagsord: string;
    forvantadKategori?: string;
  }[] = [
    { ord: "fyrst", forvantatUppslagsord: "fyrst", forvantadKategori: "exact_headword" },
    { ord: "allir", forvantatUppslagsord: "alder", forvantadKategori: "inflected_candidate" },
    { ord: "cristna", forvantatUppslagsord: "kristna", forvantadKategori: "exact_variant" },
    { ord: "laghum", forvantatUppslagsord: "lagh", forvantadKategori: "inflected_candidate" },
    { ord: "warum", forvantatUppslagsord: "var" },
    { ord: "konongær", forvantatUppslagsord: "konunger", forvantadKategori: "ortho_candidate" },
    { ord: "böndær", forvantatUppslagsord: "bonde", forvantadKategori: "ortho_candidate" },
    { ord: "kirkiu", forvantatUppslagsord: "kirkia" },
    { ord: "uatn", forvantatUppslagsord: "vatn", forvantadKategori: "ortho_candidate" },
    { ord: "vardvetæ", forvantatUppslagsord: "varþveta", forvantadKategori: "ortho_candidate" },
    { ord: "brymsignæ", forvantatUppslagsord: "primsigna", forvantadKategori: "ortho_candidate" },
  ];

  for (const tt of textOrdTester) {
    const res = slaUppTextOrd(tt.ord);
    console.log(
      `Ord "${tt.ord}" -> ${res.traffar.length} träffar (${res.executionTimeMs} ms): [${res.traffar
        .map((t) => `${t.post.headwordDisplay} (${t.matchKategori})`)
        .join(", ")}]`
    );
    assert(
      res.traffar.some((t) => t.post.headwordDisplay === tt.forvantatUppslagsord),
      `Uppslag på "${tt.ord}" ska hitta "${tt.forvantatUppslagsord}"`
    );
    if (tt.forvantadKategori) {
      const traff = res.traffar.find(
        (t) => t.post.headwordDisplay === tt.forvantatUppslagsord
      );
      assert.equal(
        traff?.matchKategori,
        tt.forvantadKategori,
        `Uppslag på "${tt.ord}" -> "${tt.forvantatUppslagsord}" ska ha kategori ${tt.forvantadKategori}`
      );
    }
  }

  // 13. Morfologisk och ortografisk böjningsuppslagning direkt i /ordbok (sokOrdbok)
  console.log("\n=== Morfologisk & ortografisk böjningsuppslagning i /ordbok (sokOrdbok) ===");
  const morfSokTester: {
    q: string;
    forvantatUppslagsord: string;
    forvantadMatchType: string;
  }[] = [
    { q: "laghum", forvantatUppslagsord: "lagh", forvantadMatchType: "inflected_candidate" },
    { q: "konongær", forvantatUppslagsord: "konunger", forvantadMatchType: "ortho_candidate" },
    { q: "konunginum", forvantatUppslagsord: "konunger", forvantadMatchType: "inflected_candidate" },
    { q: "biskupinum", forvantatUppslagsord: "biskoper", forvantadMatchType: "ortho_candidate" },
    { q: "älskadhi", forvantatUppslagsord: "älska", forvantadMatchType: "inflected_candidate" },
    { q: "mæn", forvantatUppslagsord: "man", forvantadMatchType: "inflected_candidate" },
    { q: "böker", forvantatUppslagsord: "bok", forvantadMatchType: "inflected_candidate" },
    { q: "hondum", forvantatUppslagsord: "hand", forvantadMatchType: "inflected_candidate" },
    { q: "tok", forvantatUppslagsord: "taka", forvantadMatchType: "inflected_candidate" },
  ];

  for (const mt of morfSokTester) {
    const res = sokOrdbok({ q: mt.q, mode: "uppslagsord" });
    console.log(
      `sokOrdbok("${mt.q}") -> ${res.totalHits} träffar, ${
        res.morfologiskaKandidater?.length ?? 0
      } morf. kandidater: [${(res.morfologiskaKandidater ?? [])
        .map((k) => `${k.grundform} (${k.forklaring})`)
        .join("; ")}]`
    );
    assert(
      (res.morfologiskaKandidater ?? []).some(
        (k) => k.grundform === mt.forvantatUppslagsord
      ),
      `sokOrdbok("${mt.q}") ska inkludera "${mt.forvantatUppslagsord}" i morfologiskaKandidater`
    );
    const hit = res.hits.find(
      (h) =>
        h.headwordDisplay === mt.forvantatUppslagsord &&
        (h.matchType === mt.forvantadMatchType || h.matchType === "exact_variant")
    );
    assert(
      hit !== undefined,
      `sokOrdbok("${mt.q}") ska inkludera "${mt.forvantatUppslagsord}" i träfflistan med matchType ${mt.forvantadMatchType} eller exact_variant`
    );
  }

  // 14. Bokmärken och personlig ordlista (export till Anki, CSV, Text, JSON)
  console.log("\n=== Bokmärken och personlig ordlista (exporttester) ===");
  const testBokmarken: SparatOrdbokOrd[] = [
    {
      id: "soederwall--konunger-nn.1",
      headwordDisplay: "konunger",
      sourceDataset: "soederwall",
      kallaId: "SOD1884",
      partOfSpeech: ["nn"],
      gramOriginal: "m.",
      snippet: "konung, härskare, furste.",
      sparadDatum: "2026-10-16T20:00:00.000Z",
      anteckning: "Maskulint substantiv, a-stam.",
      kallText: {
        titel: "Kristnu balkær, del I",
        ord: "konongær",
        meningFsv: "þa ær cristna var oc allir cristnir konongær",
        meningTolkning: "Därnäst vår kristenhet och alla kristna konungar.",
      },
    },
    {
      id: "soederwall--lagh-nn.1",
      headwordDisplay: "lagh",
      sourceDataset: "soederwall",
      kallaId: "SOD1884",
      partOfSpeech: ["nn"],
      gramOriginal: "n. pl.",
      snippet: "lag, lagar, rättsordning.",
      sparadDatum: "2026-10-16T20:05:00.000Z",
    },
  ];

  const ankiExport = exporteraSparadeOrd(testBokmarken, "anki");
  assert(ankiExport.data.includes("konongær [konunger]"), "Anki export ska innehålla kontextuellt ord");
  assert(ankiExport.data.includes("fornsvenska soderwall"), "Anki export ska innehålla taggar");
  assert(ankiExport.filnamn.endsWith(".txt"), "Anki filnamn ska vara .txt");

  const csvExport = exporteraSparadeOrd(testBokmarken, "csv");
  assert(csvExport.data.includes("konunger"), "CSV ska innehålla konunger");
  assert(csvExport.data.startsWith("\uFEFF"), "CSV ska starta med UTF-8 BOM");

  const textExport = exporteraSparadeOrd(testBokmarken, "text");
  assert(textExport.data.includes("FORNSVENSKA STUDIELABBET"), "Text export ska ha rubrik");
  assert(textExport.data.includes("Maskulint substantiv, a-stam."), "Text export ska innehålla anteckning");

  const jsonExport = exporteraSparadeOrd(testBokmarken, "json");
  const jsonParsed = JSON.parse(jsonExport.data) as SparatOrdbokOrd[];
  assert.equal(jsonParsed.length, 2, "JSON export ska innehålla 2 ord");

  console.log("Alla exportformat (Anki TSV, CSV, Text, JSON) godkända!");

  // 15. Redaktionellt rättelsegränssnitt och diff-beräkning
  console.log("\n=== Redaktionellt rättelsegränssnitt och diff-beräkning ===");
  const testPost = hamtaOrdbokPost("soederwall--konunger-nn.1");
  assert(testPost !== null, "Testpost konunger ska finnas");

  // Testa diff-beräkning
  const diffTest = beraknaRattelseDiff(testPost, {
    headwordDisplayOverride: "konungær",
    reviewStatus: "rattad_med_kallstod",
    note: "Normaliserad fornsvensk form enligt handskrift",
    kallstod: "Söderwall Bd 1 s. 660, faksimil Runeberg",
  });
  assert(diffTest.harAndringar, "Diff ska indikera ändringar");
  assert(diffTest.uppslagsord.arAndrat, "Uppslagsord ska markeras som ändrat i diff");
  assert.equal(diffTest.uppslagsord.original, "konunger");
  assert.equal(diffTest.uppslagsord.nytt, "konungær");
  assert.equal(diffTest.status.ny, "rattad_med_kallstod");

  // Testa obligatoriskt källstöd (validering: tomt källstöd ska nekas)
  const ogiltigRes = await sparaRattelseFilOchDb({
    id: "soederwall--konunger-nn.1",
    reviewStatus: "rattad_med_kallstod",
    note: "Testnot",
    kallstod: "",
  });
  assert.equal(ogiltigRes.ok, false, "Spara utan källstöd ska misslyckas");

  // Spara en testrättelse
  const sparaRes = await sparaRattelseFilOchDb({
    id: "soederwall--konunger-nn.1",
    headwordDisplayOverride: "konungær",
    reviewStatus: "rattad_med_kallstod",
    note: "Automatiserat test av rättelsegränssnitt",
    kallstod: "Söderwall Bd 1 s. 660, faksimil Runeberg",
  });
  assert(sparaRes.ok, "Spara rättelse ska lyckas");
  assert(sparaRes.rattelse !== undefined, "Rättelseobjekt ska returneras");

  // Uppdatera minnet och verifiera
  appliceraRattelseIMinne(sparaRes.rattelse!);
  const uppdateradPost = hamtaOrdbokPost("soederwall--konunger-nn.1");
  assert.equal(uppdateradPost?.headwordDisplay, "konungær", "Visningsuppslagsord ska vara korrigerat");
  assert.equal(uppdateradPost?.headwordOriginal, "konunger", "Källoriginal ska bevaras oförvanskat");
  assert.equal(uppdateradPost?.reviewStatus, "rattad_med_kallstod", "Status ska vara rattad_med_kallstod");
  assert(uppdateradPost?.rattelse !== undefined, "Rättelse ska finnas kopplad");

  // Testa återställning / borttagning
  const taBortRes = await taBortRattelseFilOchDb("soederwall--konunger-nn.1");
  assert(taBortRes.ok, "Ta bort rättelse ska lyckas");
  avlasgnaRattelseIMinne("soederwall--konunger-nn.1");
  const aterstalldPost = hamtaOrdbokPost("soederwall--konunger-nn.1");
  assert.equal(aterstalldPost?.headwordDisplay, "konunger", "Uppslagsord ska vara återställt till original");
  assert.equal(aterstalldPost?.reviewStatus, "oandrad_kallimport", "Status ska vara återställd till oandrad_kallimport");
  assert.equal(aterstalldPost?.rattelse, undefined, "Rättelseobjekt ska vara borttaget");

  console.log("Rättelsegränssnitt, diff-beräkning, källstödsvalidering och återställning godkända!");

  // 16. Moderniserade definitioner och pedagogiskt förklaringsstöd
  console.log("\n=== Moderniserade definitioner och pedagogiskt förklaringsstöd ===");

  // 16.1 Verifiera kurerad modern definition för "konunger"
  const konungPost = hamtaOrdbokPost("soederwall--konunger-nn.1");
  assert(konungPost !== null, "Post konunger ska finnas");
  assert(konungPost?.modernDefinition !== undefined, "konunger ska ha modernDefinition");
  assert.equal(konungPost?.modernDefinition?.kalla, "kurerad_redaktionell");
  assert.equal(konungPost?.modernDefinition?.granskad, true);
  assert(konungPost?.modernDefinition?.modernGlos.includes("kung"), "Ska innehålla modern glosa 'kung'");
  assert(konungPost?.modernDefinition?.kortForklaring.length! > 10, "Ska ha en lättfattlig förklaring");
  assert(konungPost?.modernDefinition?.pedagogiskNot !== undefined, "Ska ha pedagogisk not");

  // 16.2 Verifiera fler kurerade nyckelord (lagh, þing, bonde)
  for (const nyckelId of ["soederwall--lagh-nn.1", "soederwall--þing-nn.1", "soederwall--bonde-nn.1"]) {
    const p = hamtaOrdbokPost(nyckelId);
    assert(p !== null, `Post ${nyckelId} ska finnas`);
    assert.equal(p?.modernDefinition?.kalla, "kurerad_redaktionell");
    assert(p?.modernDefinition?.modernGlos.length! >= 1);
  }

  // 16.3 Verifiera 1800-talsnormalisering för automatisk extraktion
  assert.equal(modernisera1800TalsSvenska("hafwa och wara"), "ha och vara");
  assert.equal(modernisera1800TalsSvenska("gifwa qwinna blifwa"), "ge kvinna bli");
  assert.equal(modernisera1800TalsSvenska("huruledes hwad"), "hur vad");

  // 16.4 Verifiera automatisk extraktion för en post utan kurerad definition
  const abbedissaPost = hamtaOrdbokPost("soederwall--abbedis-nn.1") ?? hamtaOrdbokPost("soederwall--abbedissa-nn.1");
  if (abbedissaPost) {
    assert(abbedissaPost.modernDefinition !== undefined, "abbedissa ska ha automatisk modernDefinition");
    assert.equal(abbedissaPost.modernDefinition.kalla, "automatisk_extraktion");
    assert.equal(abbedissaPost.modernDefinition.granskad, false);
  }

  // 16.5 Verifiera att sökning inkluderar modernDefinition i träfflistan
  const sokKonung = sokOrdbok({ q: "konunger", mode: "uppslagsord" });
  const konungHit = sokKonung.hits.find((h) => h.id === "soederwall--konunger-nn.1");
  assert(konungHit !== undefined, "konunger ska finnas i träfflistan");
  assert(konungHit?.modernDefinition !== undefined, "Träfflistan ska inkludera modernDefinition");
  assert(konungHit?.modernDefinition?.modernGlos.includes("kung"));

  console.log("Kurerade definitioner, 1800-talsnormalisering, automatisk glosering och träfflistvisning godkända!");

  console.log("\nAlla tester för Etapp 3, Klicka-på-ord, Morfologisk analys, Bokmärken, Rättelsegränssnitt och Moderna definitioner godkända!");
}

main().catch((err) => {
  console.error("Test misslyckades:", err);
  process.exit(1);
});


