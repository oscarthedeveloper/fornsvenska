/**
 * CF05: Beständigt redaktionslager för ordboken
 *
 * Separerar redaktionella utkast (sparas beständigt) från publicerad version.
 * Säkerställer att sparade ändringar inte slår igenom på den publika sajten
 * förrän administratören uttryckligen initierat en godkänd publicering.
 */

import type {
  ModerniseradDefinition,
  OrdbokGranskningsstatus,
  OrdbokRattelse,
} from './typer';

export interface AdminActor {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface EditorialEntry {
  entryId: string;
  rattelse?: OrdbokRattelse;
  modernDefinition?: ModerniseradDefinition;
  senastSparadAv: string;
  senastSparadTid: string;
  publiceradRevision?: string;
  harOpubliceradeAndringar: boolean;
}

export class EditorialStore {
  private drafts: Map<string, EditorialEntry> = new Map();
  private publishedRevisions: Map<string, { rattelse?: OrdbokRattelse; modernDefinition?: ModerniseradDefinition }> = new Map();

  /**
   * Sparar en redaktionell rättelse beständigt.
   * Kräver verifierad administratörsroll.
   */
  public async sparaRattelse(
    indata: {
      id: string;
      headwordDisplayOverride?: string;
      reviewStatus: OrdbokGranskningsstatus;
      note: string;
      kallstod: string;
    },
    actor: AdminActor
  ): Promise<{ ok: boolean; fel?: string; entry?: EditorialEntry }> {
    if (!actor.isAdmin) {
      return { ok: false, fel: 'Behörighet saknas. Endast administratörer får spara rättelser.' };
    }

    const id = indata.id.trim();
    if (!id) return { ok: false, fel: 'Post-ID saknas.' };

    const kallstod = indata.kallstod.trim();
    if (!kallstod) {
      return { ok: false, fel: 'Källstöd är obligatoriskt vid redaktionell rättelse.' };
    }

    const note = indata.note.trim();
    if (!note) {
      return { ok: false, fel: 'Motivering/notering måste anges.' };
    }

    const nu = new Date().toISOString();
    const existing = this.drafts.get(id);

    const rattelse: OrdbokRattelse = {
      id,
      headwordDisplayOverride: indata.headwordDisplayOverride?.trim() || undefined,
      reviewStatus: indata.reviewStatus,
      note,
      kallstod,
      skapad: existing?.rattelse?.skapad || nu,
      andrad: nu,
      skapadAv: actor.email,
    };

    const entry: EditorialEntry = {
      entryId: id,
      rattelse,
      modernDefinition: existing?.modernDefinition,
      senastSparadAv: actor.email,
      senastSparadTid: nu,
      publiceradRevision: existing?.publiceradRevision,
      harOpubliceradeAndringar: true,
    };

    this.drafts.set(id, entry);
    return { ok: true, entry };
  }

  /**
   * Sparar en moderniserad definition beständigt.
   * Kräver verifierad administratörsroll.
   */
  public async sparaModernDefinition(
    indata: {
      id: string;
      kortForklaring: string;
      modernGlos?: string[];
      pedagogiskNot?: string;
    },
    actor: AdminActor
  ): Promise<{ ok: boolean; fel?: string; entry?: EditorialEntry }> {
    if (!actor.isAdmin) {
      return { ok: false, fel: 'Behörighet saknas. Endast administratörer får spara moderna definitioner.' };
    }

    const id = indata.id.trim();
    if (!id) return { ok: false, fel: 'Post-ID saknas.' };

    const forklaring = indata.kortForklaring.trim();
    if (!forklaring) {
      return { ok: false, fel: 'Kort modern förklaring är obligatorisk.' };
    }

    const nu = new Date().toISOString();
    const existing = this.drafts.get(id);

    const modernDefinition: ModerniseradDefinition = {
      id,
      kortForklaring: forklaring,
      modernGlos: indata.modernGlos && indata.modernGlos.length > 0 ? indata.modernGlos : [],
      pedagogiskNot: indata.pedagogiskNot?.trim() || undefined,
      kalla: 'kurerad_redaktionell',
      granskad: true,
      uppdaterad: nu,
    };

    const entry: EditorialEntry = {
      entryId: id,
      rattelse: existing?.rattelse,
      modernDefinition,
      senastSparadAv: actor.email,
      senastSparadTid: nu,
      publiceradRevision: existing?.publiceradRevision,
      harOpubliceradeAndringar: true,
    };

    this.drafts.set(id, entry);
    return { ok: true, entry };
  }

  /**
   * Hämtar ett utkast för administratören (visar osparade/opublicerade ändringar).
   */
  public hamtaUtkast(id: string, actor: AdminActor): EditorialEntry | null {
    if (!actor.isAdmin) {
      throw new Error('Åtkomst nekad: Endast administratörer har tillgång till utkast.');
    }
    return this.drafts.get(id) || null;
  }

  /**
   * Hämtar det som faktiskt är publicerat på den statiska sajten.
   * Läsare ser ENDAST detta – aldrig opublicerade redaktionsutkast.
   */
  public hamtaPubliceradVersion(id: string): { rattelse?: OrdbokRattelse; modernDefinition?: ModerniseradDefinition } | null {
    return this.publishedRevisions.get(id) || null;
  }

  /**
   * Publicerar samtliga utkast till den angivna release-revisionen.
   * Anropas endast när publiceringspipelinen framgångsrikt har byggt och verifierat utgåvan.
   */
  public aktiveraPublicering(releaseId: string): void {
    for (const [id, draft] of this.drafts.entries()) {
      if (draft.harOpubliceradeAndringar) {
        this.publishedRevisions.set(id, {
          rattelse: draft.rattelse ? JSON.parse(JSON.stringify(draft.rattelse)) : undefined,
          modernDefinition: draft.modernDefinition ? JSON.parse(JSON.stringify(draft.modernDefinition)) : undefined,
        });
        draft.publiceradRevision = releaseId;
        draft.harOpubliceradeAndringar = false;
      }
    }
  }
}
