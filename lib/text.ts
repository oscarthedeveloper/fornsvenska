import type { Fotnot, Nyckelvarde } from "@/lib/dokument";

/**
 * Textdokument: ett utdrag som översätts och tolkas.
 *
 * Utdraget delas i sektioner; en sektion rymmer omkring fem meningar, och
 * varje mening analyseras för sig. Färgerna skiljer meningarna åt inom en
 * sektion — de får gärna återanvändas mellan sektioner.
 */
export interface Mening {
  /** Meningen på fornsvenska, som den står i utgåvan. */
  fsv: string;
  /** Översättning och tolkning. */
  tolkning: string;
  /** Valfri grammatisk anmärkning under tolkningen. */
  kommentar?: string;
  /** Unikt segment-ID för källspårbarhet (t.ex. "avg-b01-punkt01-seg001"). */
  segmentId?: string;
  /** Detaljerad källreferens (t.ex. "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"). */
  kallreferens?: string;
  /** Flaggade avvikelser eller textkritiska anmärkningar för segmentet. */
  avvikelser?: string[];
}

export interface Sektion {
  rubrik?: string;
  /** Hänvisning till handskrift, blad eller utgåva. */
  hanvisning?: string;
  meningar: Mening[];
  /** Balk- eller avsnitts-identifikator (t.ex. "B01"). */
  balkId?: string;
  /** Sidor i primärkällan (1-baserade, t.ex. [1] eller [1, 2]). */
  pdfSidor?: number[];
  /** Primärkällans punktnummer (t.ex. "1", "2", "§.1."). */
  kallpunkt?: string;
}

export interface Textdokument {
  titel: string;
  underrubrik?: string;
  meta?: Nyckelvarde[];
  ingress?: string;
  sektioner: Sektion[];
  fotnoter: Fotnot[];
  /** Markerar innehåll som ännu inte är genomarbetat. */
  utkast?: boolean;
  /** Källidentifikator för utgåvan (t.ex. "AVG-MASKIN"). */
  kallaId?: string;
}
