"use server";

import { revalidatePath } from "next/cache";
import { skapaServerKlient } from "@/lib/supabase/server";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { hamtaSession } from "@/lib/session";
import type { Resurs, Resurstyp } from "@/lib/resurstyper";

export interface Svar {
  ok: boolean;
  fel?: string;
  /** Id på det som just skapades. */
  id?: string;
}

async function kravAdmin(): Promise<string | null> {
  if (!HAR_SUPABASE) return "Supabase är inte konfigurerat.";
  const { arAdmin } = await hamtaSession();
  return arAdmin ? null : "Du är inte inloggad som administratör.";
}

function uppdatera() {
  revalidatePath("/resurser");
}

/** Nästa lediga position i en tabell, valfritt inom en hylla. */
async function nastaPosition(
  tabell: "hyllor" | "resurser",
  filter?: { kolumn: string; varde: string | null }
): Promise<number> {
  const supabase = skapaServerKlient();
  let fraga = supabase.from(tabell).select("position");
  if (filter) {
    fraga = filter.varde
      ? fraga.eq(filter.kolumn, filter.varde)
      : fraga.is(filter.kolumn, null);
  }
  const { data } = await fraga;
  return (
    ((data ?? []) as { position: number }[]).reduce(
      (max, r) => Math.max(max, r.position ?? 0),
      -1
    ) + 1
  );
}

/* ------------------------------------------------------------------ HYLLOR */

export async function skapaHylla(titel = "Ny hylla"): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const position = await nastaPosition("hyllor");

  const { data, error } = await supabase
    .from("hyllor")
    .insert({ titel, position })
    .select("id")
    .single();

  if (error) return { ok: false, fel: error.message };

  uppdatera();
  return { ok: true, id: (data as { id: string }).id };
}

export async function sparaHylla(
  id: string,
  delar: { titel?: string; note?: string }
): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const { error } = await supabase
    .from("hyllor")
    .update({
      ...(delar.titel !== undefined ? { titel: delar.titel.trim() || "Ny hylla" } : {}),
      ...(delar.note !== undefined ? { note: delar.note.trim() || null } : {}),
    })
    .eq("id", id);

  if (error) return { ok: false, fel: error.message };

  uppdatera();
  return { ok: true };
}

/** Tar bort hyllan. Resurserna blir kvar och hamnar under Osorterat. */
export async function taBortHylla(id: string): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const { error } = await supabase.from("hyllor").delete().eq("id", id);

  if (error) return { ok: false, fel: error.message };

  uppdatera();
  return { ok: true };
}

/* ---------------------------------------------------------------- RESURSER */

export async function skapaResurs(
  hyllaId: string | null,
  typ: Resurstyp
): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const position = await nastaPosition(
    "resurser",
    typ === "skrift"
      ? { kolumn: "typ", varde: "skrift" }
      : { kolumn: "hylla_id", varde: hyllaId }
  );

  const { data, error } = await supabase
    .from("resurser")
    .insert({
      hylla_id: typ === "skrift" ? null : hyllaId,
      typ,
      titel: typ === "skrift" ? "Ny skrift" : "Ny resurs",
      position,
      utkast: true,
    })
    .select("id")
    .single();

  if (error) return { ok: false, fel: error.message };

  uppdatera();
  return { ok: true, id: (data as { id: string }).id };
}

/** Sparar de fält som ändrats. Versionerna sparas som JSONB i samma svep. */
export async function sparaResurs(
  id: string,
  delar: Partial<Omit<Resurs, "id" | "position">>
): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const rad: Record<string, unknown> = {};
  if (delar.hyllaId !== undefined) rad.hylla_id = delar.hyllaId;
  if (delar.typ !== undefined) rad.typ = delar.typ;
  if (delar.titel !== undefined) rad.titel = delar.titel.trim() || "Utan titel";
  if (delar.forfattare !== undefined) rad.forfattare = delar.forfattare || null;
  if (delar.ar !== undefined) rad.ar = delar.ar || null;
  if (delar.utgivare !== undefined) rad.utgivare = delar.utgivare || null;
  if (delar.omslag !== undefined) rad.omslag = delar.omslag || null;
  if (delar.lank !== undefined) rad.lank = delar.lank || null;
  if (delar.tillganglighet !== undefined)
    rad.tillganglighet = Math.min(5, Math.max(1, delar.tillganglighet));
  if (delar.beskrivning !== undefined) rad.beskrivning = delar.beskrivning || null;
  if (delar.versioner !== undefined) rad.versioner = delar.versioner;
  if (delar.utkast !== undefined) rad.utkast = delar.utkast;

  if (Object.keys(rad).length === 0) return { ok: true };

  const supabase = skapaServerKlient();
  const { error } = await supabase.from("resurser").update(rad).eq("id", id);

  if (error) return { ok: false, fel: error.message };

  uppdatera();
  return { ok: true };
}

export async function taBortResurs(id: string): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const { error } = await supabase.from("resurser").delete().eq("id", id);

  if (error) return { ok: false, fel: error.message };

  uppdatera();
  return { ok: true };
}

/**
 * Flyttar en resurs ett steg bland sina grannar — inom hyllan, eller bland
 * skrifterna. Positionerna byts, precis som för noderna i arkivet.
 */
export async function flyttaResurs(id: string, riktning: -1 | 1): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();

  const { data: resurs, error: lasFel } = await supabase
    .from("resurser")
    .select("id, hylla_id, typ, position")
    .eq("id", id)
    .single();

  if (lasFel || !resurs) return { ok: false, fel: lasFel?.message ?? "Resursen saknas." };

  const post = resurs as {
    id: string;
    hylla_id: string | null;
    typ: Resurstyp;
    position: number;
  };

  let fraga = supabase
    .from("resurser")
    .select("id, position")
    .order("position", { ascending: true });

  if (post.typ === "skrift") {
    fraga = fraga.eq("typ", "skrift");
  } else {
    fraga = post.hylla_id
      ? fraga.eq("hylla_id", post.hylla_id).neq("typ", "skrift")
      : fraga.is("hylla_id", null).neq("typ", "skrift");
  }

  const { data: grannar, error: grannFel } = await fraga;
  if (grannFel || !grannar) return { ok: false, fel: grannFel?.message };

  const lista = grannar as { id: string; position: number }[];
  const i = lista.findIndex((r) => r.id === id);
  const j = i + riktning;
  if (i < 0 || j < 0 || j >= lista.length) return { ok: true };

  const { error: felA } = await supabase
    .from("resurser")
    .update({ position: lista[j].position })
    .eq("id", lista[i].id);
  const { error: felB } = await supabase
    .from("resurser")
    .update({ position: lista[i].position })
    .eq("id", lista[j].id);

  if (felA || felB) return { ok: false, fel: (felA ?? felB)?.message };

  uppdatera();
  return { ok: true };
}

/** Flyttar en hylla ett steg upp eller ned. */
export async function flyttaHylla(id: string, riktning: -1 | 1): Promise<Svar> {
  const fel = await kravAdmin();
  if (fel) return { ok: false, fel };

  const supabase = skapaServerKlient();
  const { data, error } = await supabase
    .from("hyllor")
    .select("id, position")
    .order("position", { ascending: true });

  if (error || !data) return { ok: false, fel: error?.message };

  const lista = data as { id: string; position: number }[];
  const i = lista.findIndex((h) => h.id === id);
  const j = i + riktning;
  if (i < 0 || j < 0 || j >= lista.length) return { ok: true };

  const { error: felA } = await supabase
    .from("hyllor")
    .update({ position: lista[j].position })
    .eq("id", lista[i].id);
  const { error: felB } = await supabase
    .from("hyllor")
    .update({ position: lista[i].position })
    .eq("id", lista[j].id);

  if (felA || felB) return { ok: false, fel: (felA ?? felB)?.message };

  uppdatera();
  return { ok: true };
}
