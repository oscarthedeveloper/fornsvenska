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
  period: "",
  ogonrunor: "ᚠ ᚢ ᚦ ᚮ ᚱ ᚴ",
  ogonetikett: "Digital resurs",
  rubrik: "Det var en gång, fornsvenskan",
  spaltA:
    "Lagar, brev och böner bär spåren av ett språk ingen längre talar. Här läses de i tre lager: handskrift, normaliserad text och översättning.",
  spaltB:
    "Utforska grammatiken, följ ordens förändring och jämför läsningar direkt mot källorna.",
  knapp: "Utforska",
  skanmetod: "",
  skanstatus: "",
};

/** Fyller ut det som saknas, så att en halvskriven rad aldrig tömmer sidan. */
export function medStandard(delvis: Partial<Startinnehall> | null): Startinnehall {
  // Uppdatera även tidigare standardtexter som redan sparats i databasen.
  const text = { ...delvis };
  if (text.rubrik?.trim() === "Kvarlevor av ett språk") text.rubrik = START_STANDARD.rubrik;
  if (text.knapp?.trim() === "Utforska arkivet") text.knapp = START_STANDARD.knapp;
  if (text.ogonetikett?.trim() === "Digital läsapparat") text.ogonetikett = START_STANDARD.ogonetikett;
  return {
    period: text?.period?.trim() || START_STANDARD.period,
    ogonrunor: text?.ogonrunor?.trim() || START_STANDARD.ogonrunor,
    ogonetikett: text?.ogonetikett?.trim() || START_STANDARD.ogonetikett,
    rubrik: text?.rubrik?.trim() || START_STANDARD.rubrik,
    spaltA: text?.spaltA?.trim() || START_STANDARD.spaltA,
    spaltB: text?.spaltB?.trim() || START_STANDARD.spaltB,
    knapp: text?.knapp?.trim() || START_STANDARD.knapp,
    skanmetod: text?.skanmetod?.trim() || START_STANDARD.skanmetod,
    skanstatus: text?.skanstatus?.trim() || START_STANDARD.skanstatus,
  };
}
