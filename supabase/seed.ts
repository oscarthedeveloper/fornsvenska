/**
 * Importerar innehållet i data/ till Supabase.
 *
 *   npm install
 *   npm run seed
 *
 * Kräver NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i .env.local.
 * Servicenyckeln går förbi alla säkerhetsregler — kör bara skriptet lokalt.
 *
 * Skriptet vägrar skriva över en rot som redan har innehåll. Sätt SEED_FORCE=1
 * för att tömma roten först.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { GRAMMATIK } from "../data/grammatik";
import { TEXTER } from "../data/texter";
import { GRAMMATIK_DOKUMENT } from "../data/dokument";
import { TEXTER_DOKUMENT } from "../data/textdokument";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nyckel = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !nyckel) {
  console.error(
    "Saknar NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY i .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, nyckel, {
  auth: { persistSession: false },
});

interface Nod {
  slug: string;
  title: string;
  kind: "folder" | "doc";
  note?: string;
  children?: Nod[];
}

async function laggIn(
  root: string,
  noder: Nod[],
  parentId: string | null,
  stig: string[],
  innehall: Record<string, unknown>
) {
  let position = 0;

  for (const nod of noder) {
    const minStig = [...stig, nod.slug];
    const content = nod.kind === "doc" ? innehall[minStig.join("/")] ?? null : null;

    const { data, error } = await supabase
      .from("nodes")
      .insert({
        root,
        parent_id: parentId,
        slug: nod.slug,
        title: nod.title,
        kind: nod.kind,
        note: nod.note ?? null,
        position,
        content,
        utkast: Boolean((content as { utkast?: boolean } | null)?.utkast),
      })
      .select("id")
      .single();

    if (error) throw new Error(`${minStig.join("/")}: ${error.message}`);

    console.log(`  ${"  ".repeat(stig.length)}${nod.kind === "folder" ? "▸" : "·"} ${nod.title}`);
    position += 1;

    if (nod.children?.length) {
      await laggIn(root, nod.children, data.id, minStig, innehall);
    }
  }
}

async function seedaRot(
  root: string,
  trad: Nod[],
  innehall: Record<string, unknown>
) {
  const { count, error } = await supabase
    .from("nodes")
    .select("id", { count: "exact", head: true })
    .eq("root", root);

  if (error) throw error;

  if (count && count > 0) {
    if (process.env.SEED_FORCE !== "1") {
      console.log(
        `\n${root}: ${count} noder finns redan — hoppar över. Kör med SEED_FORCE=1 för att ersätta.`
      );
      return;
    }
    console.log(`\n${root}: tömmer ${count} befintliga noder …`);
    const { error: raderaFel } = await supabase.from("nodes").delete().eq("root", root);
    if (raderaFel) throw raderaFel;
  }

  console.log(`\n${root}:`);
  await laggIn(root, trad, null, [], innehall);
}

async function main() {
  await seedaRot("grammatik", GRAMMATIK as Nod[], GRAMMATIK_DOKUMENT);
  await seedaRot("texter", TEXTER as Nod[], TEXTER_DOKUMENT);
  console.log("\nKlart.");
}

main().catch((fel) => {
  console.error("\nSeed misslyckades:", fel.message ?? fel);
  process.exit(1);
});
