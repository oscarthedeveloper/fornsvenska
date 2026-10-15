export type Kalltyp =
  | "primartext"
  | "grammatik"
  | "monografi"
  | "avhandling"
  | "artikel"
  | "examensarbete"
  | "textutgava"
  | "samlingsverk"
  | "recension"
  | "arbetsunderlag";

export type Kallniva =
  | "primar"
  | "vetenskaplig-sekundar"
  | "handbok"
  | "arbetsunderlag"
  | "perifer";

export type Kallanvandning = "central" | "fordjupning" | "kontext" | "begransad";

export type Filrelation =
  | "huvudfil"
  | "exakt-dubblett"
  | "innehallsdubblett"
  | "utdrag"
  | "bilaga";

export interface Kallfil {
  /** Sökväg relativt projektroten. */
  sokvag: string;
  format: "pdf" | "md" | "png";
  sidor?: number;
  relation: Filrelation;
  /** Textlager: fullständigt, ofullständigt eller saknas (bild/skanning). */
  textlager: "fullstandigt" | "ofullstandigt" | "saknas";
  anmarkning?: string;
}

export interface Kalla {
  /** Stabilt ID som aldrig ska bero på filnamnet. */
  id: string;
  titel: string;
  forfattare: string[];
  ar?: string;
  typ: Kalltyp;
  niva: Kallniva;
  anvandning: Kallanvandning;
  bibliografi: string;
  amnen: string[];
  perioder: string[];
  texttyper?: string[];
  anmarkning?: string;
  filer: Kallfil[];
}

export type Stodtyp =
  | "primarbelagg"
  | "regel"
  | "paradigm"
  | "analys"
  | "bakgrund"
  | "metod";

/**
 * En numrerad hänvisning i en grammatikartikel.
 *
 * `text` finns enbart för äldre utkast. Publicerade dokument måste använda
 * `kallaId` och `lokalisering`; detta kontrolleras av validate:kallor.
 */
export interface Kallhanvisning {
  id: number;
  kallaId?: string;
  lokalisering?: string;
  stod?: Stodtyp;
  kommentar?: string;
  citat?: string;
  text?: string;
}

