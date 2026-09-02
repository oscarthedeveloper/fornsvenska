/** Rena typer för resursbiblioteket — inga serverberoenden. */

export type Resurstyp =
  | "larobok"
  | "examensarbete"
  | "avhandling"
  | "skrift"
  | "ovrigt";

export const TYPNAMN: Record<Resurstyp, string> = {
  larobok: "Lärobok",
  examensarbete: "Examensarbete",
  avhandling: "Doktorsavhandling",
  skrift: "Skrift",
  ovrigt: "Övrigt",
};

/** Flertalsformerna används i filterraden ovanför hyllorna. */
export const TYPNAMN_FLERTAL: Record<Resurstyp, string> = {
  larobok: "Läroböcker",
  examensarbete: "Examensarbeten",
  avhandling: "Avhandlingar",
  skrift: "Skrifter",
  ovrigt: "Övrigt",
};

/** Ordningen är den som visas i typväljaren. */
export const TYPER: Resurstyp[] = [
  "larobok",
  "examensarbete",
  "avhandling",
  "skrift",
  "ovrigt",
];

/**
 * Tillgänglighet i fem steg. Skalan handlar om hur svårt materialet är att
 * komma åt — inte om kvalitet. Index 0 motsvarar betyg 1.
 */
export const TILLGANGLIGHET = [
  "Nästan omöjlig att få tag på",
  "Svår att få tag på",
  "Går att beställa",
  "Finns på bibliotek",
  "Fritt tillgänglig online",
];

/**
 * En version av en skrift. Samma text kan finnas i flera versioner —
 * grundtext, en där pronomenen är markerade, en där verben är det.
 */
export interface Skriftversion {
  id: string;
  etikett: string;
  /** Kort förklaring av vad som är markerat i den här versionen. */
  note?: string;
  /** Texten. ==ord== markerar, ==ord|Verb== markerar med etikett. */
  innehall: string;
}

/** En lokalt utgiven bok som har en egen läsvy i resursbiblioteket. */
export interface Bokresurs {
  /** Intern sida med den formgivna läsaren. */
  sokvag: string;
  /** Originalfilen, för hämtning, utskrift och textmarkering. */
  pdf: string;
  sidor: number;
}

export interface Resurs {
  id: string;
  hyllaId: string | null;
  typ: Resurstyp;
  titel: string;
  forfattare?: string;
  ar?: string;
  utgivare?: string;
  omslag?: string;
  lank?: string;
  tillganglighet: number;
  beskrivning?: string;
  versioner: Skriftversion[];
  bok?: Bokresurs;
  position: number;
  utkast?: boolean;
}

export interface Hylla {
  id: string;
  titel: string;
  note?: string;
  position: number;
  resurser: Resurs[];
}

export interface Bibliotek {
  hyllor: Hylla[];
  /** Skrifterna står för sig själva, i Skriftkammaren. */
  skrifter: Resurs[];
  /** Falskt när sajten läser demomaterialet ur data/ i stället för databasen. */
  harDatabas: boolean;
}

/** Slumpat id för versioner, som bara lever inuti JSON-kolumnen. */
export function nyttId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Tonen ett standardomslag får. Härleds ur titeln så att samma resurs alltid
 * ser likadan ut, och ur typen så att en hylla inte blir enfärgad.
 */
export function omslagston(titel: string, typ: Resurstyp): number {
  let summa = TYPER.indexOf(typ) + 1;
  for (let i = 0; i < titel.length; i++) summa += titel.charCodeAt(i);
  return summa % 6;
}
