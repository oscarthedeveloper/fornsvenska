import { KALLOR } from "@/data/kallor";
import { grammatikartiklarForKalla } from "@/lib/kallindex";
import { TYPNAMN_FLERTAL, type Bibliotek, type Resurs, type Resurstyp } from "@/lib/resurstyper";

/**
 * Kontrollerar om ett verk är en lokal transkription.
 * Lokala transkriptioner (t.ex. av Svenska språket under 700 år, Liten vikingagrammatik
 * eller Äldre Västgötalagen) ska inte visas i det publika Resursbiblioteket.
 */
function arLokalTranskription(kalla: (typeof KALLOR)[number]): boolean {
  if (kalla.id === "PET-SJUHUNDRA" || kalla.id === "VIK-GRAM" || kalla.id === "AVG-MASKIN") {
    return true;
  }
  if (
    kalla.bibliografi.toLowerCase().includes("lokal transkription") ||
    kalla.bibliografi.toLowerCase().includes("lokal verifierad transkription")
  ) {
    return true;
  }
  if (kalla.filer.some((f) => f.sokvag.endsWith(".md"))) {
    return true;
  }
  return false;
}

/** Registret är bibliotekets grund även när extra resurser hämtas från databasen. */
export function medKallor(bibliotek: Bibliotek): Bibliotek {
  const poster: Resurs[] = KALLOR.filter((kalla) => !arLokalTranskription(kalla)).map((kalla, position) => {
    const typ: Resurstyp =
      kalla.typ === "examensarbete" || kalla.typ === "avhandling"
        ? kalla.typ
        : kalla.niva === "handbok"
        ? "larobok"
        : "ovrigt";
    return {
      id: kalla.id,
      hyllaId: `kallor-${typ}`,
      typ,
      titel: kalla.titel,
      forfattare: kalla.forfattare.join(", "),
      ar: kalla.ar,
      tillganglighet: 0,
      versioner: [],
      position,
      kalla,
      artiklar: grammatikartiklarForKalla(kalla.id),
    };
  });
  const normalisera = (titel: string) =>
    titel.normalize("NFC").toLocaleLowerCase("sv").replace(/[^\p{L}\p{N}]/gu, "");
  const finns = (r: Resurs) =>
    poster.some((p) => p.id === r.id || normalisera(p.titel) === normalisera(r.titel));
  return {
    ...bibliotek,
    hyllor: [
      ...(["larobok", "examensarbete", "avhandling", "ovrigt"] as Resurstyp[])
        .map((typ, position) => ({
          id: `kallor-${typ}`,
          titel: TYPNAMN_FLERTAL[typ],
          position,
          resurser: poster.filter((r) => r.typ === typ),
        }))
        .filter((h) => h.resurser.length > 0),
      ...bibliotek.hyllor.map((h) => ({
        ...h,
        resurser: h.resurser.filter((r) => !finns(r) && r.typ !== "skrift"),
      })),
    ],
    skrifter: [],
  };
}
