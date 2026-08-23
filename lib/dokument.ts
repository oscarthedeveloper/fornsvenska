/**
 * Dokumentmodellen.
 *
 * Ett dokument är en lista block. Det är avsiktligt: när adminläget byggs
 * ska varje block kunna läggas till, redigeras och tas bort för sig, utan
 * att någon rör kod. Blocken motsvarar rader i en framtida tabell
 *   blocks(id, document_id, position, type, payload jsonb).
 */

export interface Nyckelvarde {
  nyckel: string;
  varde: string;
}

export interface Fotnot {
  id: number;
  text: string;
}

export type Block =
  | { typ: "rubrik"; niva: 2 | 3; text: string }
  | { typ: "stycke"; text: string }
  /** Tvåspaltssystemet: fornsvenskt utdrag till vänster, förklaring till höger. */
  | { typ: "spalter"; utdrag: string; utdragKalla?: string; kommentar: string }
  | {
      typ: "tabell";
      rubrik?: string;
      kolumner: string[];
      rader: string[][];
      /** Radindex som markeras, t.ex. den kasusrad dokumentet handlar om. */
      markeraRad?: number;
    }
  | { typ: "obs"; etikett?: string; text: string }
  | { typ: "nycklar"; poster: Nyckelvarde[] }
  /**
   * Flikar. Varje flik har en egen blocklista, så en flik kan innehålla
   * precis det ett dokument kan: en paradigmtabell, en kommentar under den,
   * en OBS-ruta. Flikar i flikar är inte tillåtna — se Blocklista.
   */
  | { typ: "flikar"; flikar: Flik[] };

export interface Flik {
  etikett: string;
  block: Block[];
}

export interface Dokument {
  titel: string;
  underrubrik?: string;
  meta?: Nyckelvarde[];
  /** Det stora inledande citatet högst upp på arket. */
  citat?: { text: string; kalla?: string };
  ingress?: string;
  block: Block[];
  fotnoter: Fotnot[];
  /** Markerar innehåll som ännu inte är genomarbetat. */
  utkast?: boolean;
}
