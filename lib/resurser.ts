/**
 * Datalagret för resursbiblioteket.
 *
 * Samma uppdelning som arkivet: Supabase när nycklarna finns i miljön, annars
 * demomaterialet i data/. Hyllor och resurser hämtas i två frågor och sätts
 * ihop i minnet — biblioteket är litet, och slipper då en fråga per hylla.
 */
import { cache } from "react";
import { DEMO_HYLLOR, FASTA_SKRIFTER } from "@/data/resurser";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaServerKlient } from "@/lib/supabase/server";
import type { Bibliotek, Hylla, Resurs, Resurstyp, Skriftversion } from "@/lib/resurstyper";

interface HyllRad {
  id: string;
  titel: string;
  note: string | null;
  position: number;
}

interface ResursRad {
  id: string;
  hylla_id: string | null;
  typ: Resurstyp;
  titel: string;
  forfattare: string | null;
  ar: string | null;
  utgivare: string | null;
  omslag: string | null;
  lank: string | null;
  tillganglighet: number;
  beskrivning: string | null;
  versioner: Skriftversion[] | null;
  position: number;
  utkast: boolean;
}

const KOLUMNER =
  "id, hylla_id, typ, titel, forfattare, ar, utgivare, omslag, lank, tillganglighet, beskrivning, versioner, position, utkast";

function tillResurs(rad: ResursRad): Resurs {
  return {
    id: rad.id,
    hyllaId: rad.hylla_id,
    typ: rad.typ,
    titel: rad.titel,
    forfattare: rad.forfattare ?? undefined,
    ar: rad.ar ?? undefined,
    utgivare: rad.utgivare ?? undefined,
    omslag: rad.omslag ?? undefined,
    lank: rad.lank ?? undefined,
    tillganglighet: rad.tillganglighet ?? 3,
    beskrivning: rad.beskrivning ?? undefined,
    versioner: Array.isArray(rad.versioner) ? rad.versioner : [],
    position: rad.position,
    utkast: rad.utkast,
  };
}

/**
 * Hela biblioteket. Cachas per förfrågan.
 *
 * Skrifterna plockas ut för sig: de har inga omslag och hör hemma i
 * Skriftkammaren, inte på en hylla bland läroböckerna.
 */
const ANVAND_SUPABASE_RESURSER =
  HAR_SUPABASE && process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

export const hamtaBibliotek = cache(async (): Promise<Bibliotek> => {
  if (!ANVAND_SUPABASE_RESURSER) {
    return { hyllor: DEMO_HYLLOR, skrifter: FASTA_SKRIFTER, harDatabas: false };
  }

  try {
    const supabase = skapaServerKlient();

    const [hyllsvar, resurssvar] = await Promise.all([
      supabase
        .from("hyllor")
        .select("id, titel, note, position")
        .order("position", { ascending: true }),
      supabase.from("resurser").select(KOLUMNER).order("position", { ascending: true }),
    ]);

    if (hyllsvar.error) throw hyllsvar.error;
    if (resurssvar.error) throw resurssvar.error;

    const resurser = ((resurssvar.data ?? []) as ResursRad[]).map(tillResurs);

    const hyllor: Hylla[] = ((hyllsvar.data ?? []) as HyllRad[]).map((rad) => ({
      id: rad.id,
      titel: rad.titel,
      note: rad.note ?? undefined,
      position: rad.position,
      resurser: resurser.filter((r) => r.typ !== "skrift" && r.hyllaId === rad.id),
    }));

    /* Resurser vars hylla tagits bort hamnar sist, så att de inte försvinner
       ur sikte bara för att hyllan gjorde det. */
    const hemlosa = resurser.filter((r) => r.typ !== "skrift" && !r.hyllaId);
    if (hemlosa.length) {
      hyllor.push({
        id: "osorterat",
        titel: "Osorterat",
        note: "Resurser utan hylla",
        position: hyllor.length,
        resurser: hemlosa,
      });
    }

    return {
      hyllor,
      skrifter: [
        ...FASTA_SKRIFTER,
        ...resurser.filter(
          (r) => r.typ === "skrift" && !FASTA_SKRIFTER.some((fast) => fast.id === r.id)
        ),
      ],
      harDatabas: true,
    };
  } catch (fel) {
    console.warn("[resurser] kunde inte läsa biblioteket från Supabase:", fel);
    return { hyllor: DEMO_HYLLOR, skrifter: FASTA_SKRIFTER, harDatabas: false };
  }
});
