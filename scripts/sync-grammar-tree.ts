/**
 * Synkroniserar den planerade grammatikstrukturen till en befintlig Supabase-
 * installation utan att tömma roten eller skriva över dokumentinnehåll.
 *
 * Nya noder skapas, befintliga titlar/noter/positioner uppdateras och innehåll
 * lämnas orört. Noder som inte längre finns i filträdet rapporteras men raderas
 * aldrig automatiskt.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { GRAMMATIK } from "../data/grammatik";
import type { Node } from "../lib/typer";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nyckel = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !nyckel) {
  console.error("Saknar NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY i .env.local");
  process.exit(1);
}

const supabase = createClient(url, nyckel, { auth: { persistSession: false } });

interface BefintligNod {
  id: string;
  parent_id: string | null;
  slug: string;
  title: string;
  kind: "folder" | "doc";
  note: string | null;
  position: number;
  content: unknown;
}

const nyckelFor = (parentId: string | null, slug: string) => `${parentId ?? "ROOT"}/${slug}`;

async function main() {
  const { data, error } = await supabase
    .from("nodes")
    .select("id, parent_id, slug, title, kind, note, position, content")
    .eq("root", "grammatik");
  if (error) throw error;

  const befintliga = (data ?? []) as BefintligNod[];
  const perNyckel = new Map(befintliga.map((nod) => [nyckelFor(nod.parent_id, nod.slug), nod]));
  const anvandaId = new Set<string>();
  let skapade = 0;
  let uppdaterade = 0;

  async function synka(noder: Node[], parentId: string | null, foraldrar: string[]) {
    for (let position = 0; position < noder.length; position += 1) {
      const nod = noder[position];
      const sokvag = [...foraldrar, nod.slug];
      const nyckel = nyckelFor(parentId, nod.slug);
      let rad = perNyckel.get(nyckel);

      if (!rad) {
        const { data: skapad, error: skapaFel } = await supabase
          .from("nodes")
          .insert({
            root: "grammatik",
            parent_id: parentId,
            slug: nod.slug,
            title: nod.title,
            kind: nod.kind,
            note: nod.note ?? null,
            position,
            content: null,
            utkast: true,
          })
          .select("id, parent_id, slug, title, kind, note, position, content")
          .single();
        if (skapaFel) throw new Error(`${sokvag.join("/")}: ${skapaFel.message}`);
        rad = skapad as BefintligNod;
        perNyckel.set(nyckel, rad);
        skapade += 1;
      } else {
        if (rad.kind === "doc" && nod.kind === "folder" && rad.content) {
          throw new Error(
            `${sokvag.join("/")}: kan inte göra ett dokument med innehåll till mapp. Flytta innehållet manuellt först.`
          );
        }
        if (
          rad.title !== nod.title ||
          rad.kind !== nod.kind ||
          rad.note !== (nod.note ?? null) ||
          rad.position !== position
        ) {
          const { error: uppdateraFel } = await supabase
            .from("nodes")
            .update({
              title: nod.title,
              kind: nod.kind,
              note: nod.note ?? null,
              position,
            })
            .eq("id", rad.id);
          if (uppdateraFel) throw new Error(`${sokvag.join("/")}: ${uppdateraFel.message}`);
          uppdaterade += 1;
        }
      }

      anvandaId.add(rad.id);
      if (nod.children?.length) await synka(nod.children, rad.id, sokvag);
    }
  }

  await synka(GRAMMATIK, null, []);

  const overtaliga = befintliga.filter((nod) => !anvandaId.has(nod.id));
  console.log(`Synkronisering klar: ${skapade} skapade, ${uppdaterade} uppdaterade.`);
  if (overtaliga.length) {
    console.log(`${overtaliga.length} äldre noder finns inte i planen och har lämnats orörda:`);
    overtaliga.forEach((nod) => console.log(`- ${nod.id} ${nod.slug}`));
  }
}

main().catch((fel) => {
  console.error(`Synkronisering misslyckades: ${fel instanceof Error ? fel.message : String(fel)}`);
  process.exit(1);
});

