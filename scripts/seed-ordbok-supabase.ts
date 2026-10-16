/**
 * Seed-skript för att migrera hela ordboksindexet (41 744 poster) från data/ordbok/poster.json
 * samt data/ordbok-rattelser.json och data/ordbok/moderniserade-definitioner.json
 * till Supabase Postgres.
 *
 * Körning:
 *   npm run seed:ordbok
 *
 * Förutsätter att supabase/ordbok.sql har körts i Supabase SQL Editor.
 * Kräver NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i .env.local.
 */

import { config } from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  byggPlainText,
  hydreraOrdbokPost,
  type LagradOrdbokPost,
} from "../lib/ordbok/proveniens";
import type { ModerniseradDefinition, OrdbokRattelse } from "../lib/ordbok/typer";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nyckel = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log("=== Fornsvenska Studielabbet: Seedning av Söderwalls ordbok till Supabase ===");

  if (!url || !nyckel) {
    console.error(
      "\nFel: Saknar NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY i .env.local.\n" +
        "Servicenyckeln (service_role) hämtas i Supabase Dashboard under Project Settings → API.\n" +
        "Lägg in den i .env.local och kör `npm run seed:ordbok` igen.\n"
    );
    process.exit(1);
  }

  const filSokvag = path.join(process.cwd(), "data", "ordbok", "poster.json");
  if (!existsSync(filSokvag)) {
    console.error(
      `Fel: data/ordbok/poster.json saknas. Kör \`npm run import:ordbok\` först.`
    );
    process.exit(1);
  }

  const supabase = createClient(url, nyckel, {
    auth: { persistSession: false },
  });

  // 1. Kontrollera tabellanslutning
  const { error: testFel } = await supabase
    .from("ordbok_poster")
    .select("id")
    .limit(1);

  if (testFel) {
    console.error(
      `\nDatabasfel: Tabellen public.ordbok_poster saknas eller kan inte nås.\n` +
        `Meddelande: ${testFel.message}\n` +
        `Åtgärd: Kör hela filen supabase/ordbok.sql i Supabase SQL Editor och försök igen.\n`
    );
    process.exit(1);
  }

  console.log("Anslutning till Supabase verifierad.");

  // 2. Läs in poster
  const startTid = Date.now();
  console.log("Läser data/ordbok/poster.json ...");
  const raaPoster = JSON.parse(readFileSync(filSokvag, "utf8")) as LagradOrdbokPost[];
  console.log(`Inläst ${raaPoster.length} poster. Förbereder Postgres-rader ...`);

  // Läs in rättelser om sådana finns
  const rattelserFil = path.join(process.cwd(), "data", "ordbok-rattelser.json");
  const rattelser: OrdbokRattelse[] = existsSync(rattelserFil)
    ? JSON.parse(readFileSync(rattelserFil, "utf8"))
    : [];

  // Läs in moderna definitioner
  const modDefFil = path.join(
    process.cwd(),
    "data",
    "ordbok",
    "moderniserade-definitioner.json"
  );
  const modDefinitioner: ModerniseradDefinition[] = existsSync(modDefFil)
    ? JSON.parse(readFileSync(modDefFil, "utf8"))
    : [];

  // 3. Batch-insättning av ordbok_poster (500 i taget)
  const BATCH_STORLEK = 500;
  let antalInsatta = 0;

  for (let i = 0; i < raaPoster.length; i += BATCH_STORLEK) {
    const chunk = raaPoster.slice(i, i + BATCH_STORLEK);
    const dbRader = chunk.map((p) => {
      const hydrerad = hydreraOrdbokPost(p);
      return {
        id: hydrerad.id,
        source_dataset: hydrerad.sourceDataset,
        kalla_id: hydrerad.kallaId,
        source_entry_id: hydrerad.sourceEntryId,
        source_index: hydrerad.sourceIndex,
        old_lemma: hydrerad.oldLemma ?? null,
        is_new_in_supplement: hydrerad.isNewInSupplement ?? false,
        is_main_work_ae_in_supp_file: hydrerad.isMainWorkAeInSuppFile ?? false,
        headword_original: hydrerad.headwordOriginal,
        headword_display: hydrerad.headwordDisplay,
        homonym_number: hydrerad.homonymNumber ?? null,
        part_of_speech: hydrerad.partOfSpeech,
        gram_original: hydrerad.gramOriginal ?? null,
        information_original: hydrerad.informationOriginal ?? null,
        old_form_original: hydrerad.oldFormOriginal ?? null,
        variants_original: hydrerad.variantsOriginal,
        word_form_rows: hydrerad.wordFormRows,
        senses: hydrerad.senses,
        article_plain_text: hydrerad.articlePlainText,
        search_keys: hydrerad.searchKeys,
        alias_keys: hydrerad.aliasKeys,
        sort_key: hydrerad.sortKey,
        letter_section: hydrerad.letterSection,
        references_json: hydrerad.references,
        import_version: hydrerad.importVersion,
        source_checksum: hydrerad.sourceChecksum,
        review_status: hydrerad.reviewStatus,
      };
    });

    const { error: upsertFel } = await supabase
      .from("ordbok_poster")
      .upsert(dbRader, { onConflict: "id" });

    if (upsertFel) {
      console.error(
        `\nFel vid batch ${i}–${i + chunk.length}: ${upsertFel.message}`
      );
      process.exit(1);
    }

    antalInsatta += chunk.length;
    const procent = ((antalInsatta / raaPoster.length) * 100).toFixed(1);
    process.stdout.write(
      `\rFramsteg: ${antalInsatta} / ${raaPoster.length} poster insatta (${procent} %) ...`
    );
  }

  console.log(`\nAlla ${antalInsatta} poster insatta i public.ordbok_poster!`);

  // 4. Spara redaktionella rättelser
  if (rattelser.length > 0) {
    console.log(`Synkroniserar ${rattelser.length} redaktionella rättelser ...`);
    const rattelseRader = rattelser.map((r) => ({
      entry_id: r.id,
      review_status: r.reviewStatus,
      headword_display_override: r.headwordDisplayOverride ?? null,
      note: r.note,
      kallstod: r.kallstod,
      andrad: r.andrad || new Date().toISOString(),
    }));

    const { error: rattelseFel } = await supabase
      .from("ordbok_rattelser")
      .upsert(rattelseRader, { onConflict: "entry_id" });

    if (rattelseFel) {
      console.warn("Varning vid insättning av rättelser:", rattelseFel.message);
    } else {
      console.log(`${rattelser.length} rättelser synkroniserade.`);
    }
  }

  // 5. Spara moderna definitioner
  if (modDefinitioner.length > 0) {
    console.log(
      `Synkroniserar ${modDefinitioner.length} moderna förklaringar och snabbglosor ...`
    );
    const modRader = modDefinitioner.map((d) => ({
      entry_id: d.id,
      headword_display: d.headwordDisplay ?? null,
      modern_glos: d.modernGlos,
      kort_forklaring: d.kortForklaring,
      pedagogisk_not: d.pedagogiskNot ?? null,
      modern_motsvarighet: d.modernMotsvarighet ?? null,
      kalla: d.kalla,
      granskad: d.granskad,
      uppdaterad: d.uppdaterad || new Date().toISOString(),
    }));

    const { error: modFel } = await supabase
      .from("ordbok_moderna_definitioner")
      .upsert(modRader, { onConflict: "entry_id" });

    if (modFel) {
      console.warn(
        "Varning vid insättning av moderna definitioner:",
        modFel.message
      );
    } else {
      console.log(`${modDefinitioner.length} moderna definitioner synkroniserade.`);
    }
  }

  const sekunder = ((Date.now() - startTid) / 1000).toFixed(1);
  console.log(`\nSeedning till Supabase slutförd på ${sekunder} sekunder!`);
}

main().catch((err) => {
  console.error("Oväntat fel under seedning:", err);
  process.exit(1);
});
