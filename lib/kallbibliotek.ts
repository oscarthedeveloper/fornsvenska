import { KALLOR } from "@/data/kallor";
import { FASTA_SKRIFTER } from "@/data/resurser";
import { grammatikartiklarForKalla } from "@/lib/kallindex";
import { TYPNAMN_FLERTAL, type Bibliotek, type Resurs, type Resurstyp } from "@/lib/resurstyper";

/** Registret är bibliotekets grund även när extra resurser hämtas från databasen. */
export function medKallor(bibliotek: Bibliotek): Bibliotek {
  const poster: Resurs[] = KALLOR.map((kalla, position) => {
    const bok = kalla.id === "AVG-MASKIN" ? FASTA_SKRIFTER[0] : undefined;
    const typ: Resurstyp = bok ? "skrift" : kalla.typ === "examensarbete" || kalla.typ === "avhandling"
      ? kalla.typ : kalla.niva === "handbok" ? "larobok" : "ovrigt";
    return {
      id: kalla.id, hyllaId: `kallor-${typ}`, typ, titel: kalla.titel,
      forfattare: kalla.forfattare.join(", "), ar: kalla.ar,
      tillganglighet: 0, versioner: [], position,
      ...bok,
      kalla, artiklar: grammatikartiklarForKalla(kalla.id),
    };
  });
  const normalisera = (titel: string) => titel.normalize("NFC").toLocaleLowerCase("sv").replace(/[^\p{L}\p{N}]/gu, "");
  const finns = (r: Resurs) => poster.some((p) => p.id === r.id || normalisera(p.titel) === normalisera(r.titel));
  return {
    ...bibliotek,
    hyllor: [
      ...(["larobok", "examensarbete", "avhandling", "ovrigt"] as Resurstyp[]).map((typ, position) => ({
        id: `kallor-${typ}`, titel: TYPNAMN_FLERTAL[typ], position,
        resurser: poster.filter((r) => r.typ === typ),
      })).filter((h) => h.resurser.length > 0),
      ...bibliotek.hyllor.map((h) => ({ ...h, resurser: h.resurser.filter((r) => !finns(r)) })),
    ],
    skrifter: [...poster.filter((r) => r.typ === "skrift"), ...bibliotek.skrifter.filter((r) => !finns(r))],
  };
}
