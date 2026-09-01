/** Redigerbar text som hör till en sida och inte till en nod i arkivet. */

export interface Startinnehall {
  period: string;
  ogonrunor: string;
  ogonetikett: string;
  rubrik: string;
  spaltA: string;
  spaltB: string;
  knapp: string;
  skanmetod: string;
  skanstatus: string;
}

/**
 * Standardtexten. Används tills någon skrivit något eget, och som reserv om
 * databasen inte svarar — sidan ska aldrig stå tom bara för att en fråga
 * misslyckades.
 */
export const START_STANDARD: Startinnehall = {
  period: "1225—1526",
  ogonrunor: "ᚠ ᚢ ᚦ ᚮ ᚱ ᚴ",
  ogonetikett: "Digital läsapparat",
  rubrik: "Kvarlevor av ett språk",
  spaltA:
    "Lagar, brev och böner bär spåren av ett språk ingen längre talar. Här läses de i tre lager: handskrift, normaliserad text och översättning.",
  spaltB:
    "Utforska grammatiken, följ ordens förändring och jämför läsningar direkt mot källorna.",
  knapp: "Utforska arkivet",
  skanmetod: "Strukturljus",
  skanstatus: "Transkribering pågår",
};

/** Fyller ut det som saknas, så att en halvskriven rad aldrig tömmer sidan. */
export function medStandard(delvis: Partial<Startinnehall> | null): Startinnehall {
  return {
    period: delvis?.period?.trim() || START_STANDARD.period,
    ogonrunor: delvis?.ogonrunor?.trim() || START_STANDARD.ogonrunor,
    ogonetikett: delvis?.ogonetikett?.trim() || START_STANDARD.ogonetikett,
    rubrik: delvis?.rubrik?.trim() || START_STANDARD.rubrik,
    spaltA: delvis?.spaltA?.trim() || START_STANDARD.spaltA,
    spaltB: delvis?.spaltB?.trim() || START_STANDARD.spaltB,
    knapp: delvis?.knapp?.trim() || START_STANDARD.knapp,
    skanmetod: delvis?.skanmetod?.trim() || START_STANDARD.skanmetod,
    skanstatus: delvis?.skanstatus?.trim() || START_STANDARD.skanstatus,
  };
}
