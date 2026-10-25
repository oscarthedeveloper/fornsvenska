"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skapaServerKlient } from "@/lib/supabase/server";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { hamtaSession } from "@/lib/session";
import { tillSlug } from "@/lib/slug";

export interface Svar {
  ok: boolean;
  fel?: string;
  /** Ny sökväg, när en åtgärd flyttar användaren. */
  href?: string;
}

async function kravAdmin(): Promise<string | null> {
  if (!HAR_SUPABASE) return "Supabase är inte konfigurerat.";
  const { arAdmin } = await hamtaSession();
  return arAdmin ? null : "Du är inte inloggad som administratör.";
}

/**
 * Målstyrd invalidation:
 * Invaliderar endast den berörda roten (`/texter` eller `/grammatik`) i stället
 * för att tömma hela sajtens globala cache med `revalidatePath('/', 'layout')`.
 */
function uppdateraRot(root?: string | null) {
  if (root === "texter" || root === "grammatik") {
    revalidatePath(`/${root}`, "layout");
  } else {
    revalidatePath("/texter", "layout");
    revalidatePath("/grammatik", "layout");
  }
}

/** Sparar ett dokuments innehåll (JSONB). */
export async function sparaInnehall(nodId: string, innehall: unknown): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const utkast = Boolean((innehall as { utkast?: boolean } | null)?.utkast);

  const { data: nod, error } = await supabase
    .from("nodes")
    .update({ content: innehall, utkast })
    .eq("id", nodId)
    .select("root")
    .maybeSingle();

  if (error) return { ok: false, fel: error.message };

  uppdateraRot(nod?.root);
  return { ok: true };
}

/** Skapar en mapp eller ett dokument under en förälder. */
export async function skapaNod(indata: {
  root: string;
  parentId: string | null;
  kind: "folder" | "doc";
  title: string;
  basHref: string;
}): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const titel = indata.title.trim();
  if (!titel) return { ok: false, fel: "Titeln får inte vara tom." };

  const supabase = skapaServerKlient();

  let syskonFraga = supabase
    .from("nodes")
    .select("slug, position")
    .eq("root", indata.root);

  syskonFraga = indata.parentId
    ? syskonFraga.eq("parent_id", indata.parentId)
    : syskonFraga.is("parent_id", null);

  const { data: syskon, error: lasFel } = await syskonFraga;
  if (lasFel) return { ok: false, fel: lasFel.message };

  const taget = new Set(
    ((syskon ?? []) as { slug: string }[]).map((s) => s.slug)
  );
  let slug = tillSlug(titel);
  let n = 2;
  while (taget.has(slug)) slug = `${tillSlug(titel)}-${n++}`;

  const position =
    ((syskon ?? []) as { position: number }[]).reduce(
      (max: number, s) => Math.max(max, s.position ?? 0),
      -1
    ) + 1;

  const { error } = await supabase.from("nodes").insert({
    root: indata.root,
    parent_id: indata.parentId,
    slug,
    title: titel,
    kind: indata.kind,
    position,
    content: null,
  });

  if (error) return { ok: false, fel: error.message };

  uppdateraRot(indata.root);
  return { ok: true, href: `${indata.basHref}/${slug}` };
}

/** Byter titel (och valfritt slug) på en nod. */
export async function bytNamn(
  nodId: string,
  titel: string,
  note?: string
): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const rent = titel.trim();
  if (!rent) return { ok: false, fel: "Titeln får inte vara tom." };

  const supabase = skapaServerKlient();
  const { data: nod, error } = await supabase
    .from("nodes")
    .update({ title: rent, note: note?.trim() || null })
    .eq("id", nodId)
    .select("root")
    .maybeSingle();

  if (error) return { ok: false, fel: error.message };

  uppdateraRot(nod?.root);
  return { ok: true };
}

/** Tar bort en nod och allt under den. */
export async function taBortNod(nodId: string): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const { data: nod, error } = await supabase
    .from("nodes")
    .delete()
    .eq("id", nodId)
    .select("root")
    .maybeSingle();

  if (error) return { ok: false, fel: error.message };

  uppdateraRot(nod?.root);
  return { ok: true };
}

/** Flyttar en nod ett steg upp eller ned bland sina syskon. */
export async function flyttaNod(nodId: string, riktning: -1 | 1): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();

  const { data: nod, error: nodFel } = await supabase
    .from("nodes")
    .select("id, root, parent_id, position")
    .eq("id", nodId)
    .single();

  if (nodFel || !nod) return { ok: false, fel: nodFel?.message ?? "Noden saknas." };

  let fraga = supabase
    .from("nodes")
    .select("id, position")
    .eq("root", nod.root)
    .order("position", { ascending: true });

  fraga = nod.parent_id
    ? fraga.eq("parent_id", nod.parent_id)
    : fraga.is("parent_id", null);

  const { data: syskon, error: syskonFel } = await fraga;
  if (syskonFel || !syskon) return { ok: false, fel: syskonFel?.message };

  const i = (syskon as { id: string; position: number }[]).findIndex(
    (s) => s.id === nodId
  );
  const j = i + riktning;
  if (i < 0 || j < 0 || j >= syskon.length) return { ok: true };

  const lista = syskon as { id: string; position: number }[];
  const a = lista[i];
  const b = lista[j];

  const { error: felA } = await supabase
    .from("nodes")
    .update({ position: b.position })
    .eq("id", a.id);
  const { error: felB } = await supabase
    .from("nodes")
    .update({ position: a.position })
    .eq("id", b.id);

  if (felA || felB) return { ok: false, fel: (felA ?? felB)?.message };

  uppdateraRot(nod.root);
  return { ok: true };
}

/** Loggar ut. Anropas direkt från ett formulär, därför utan returvärde. */
export async function loggaUt(): Promise<void> {
  const supabase = skapaServerKlient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin");
}
