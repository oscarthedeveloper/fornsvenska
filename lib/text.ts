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
}

export interface Sektion {
  rubrik?: string;
  /** Hänvisning till handskrift, blad eller utgåva. */
  hanvisning?: string;
  meningar: Mening[];
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
}
