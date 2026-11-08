/** Historical in-memory test model only; not the runtime persistence layer. */
/**
 * CF09: Central redaktionshanterare och versionslager för Fornsvenska
 *
 * Ansvarar för:
 * 1. Samlad redaktionsmodell över samtliga 6 innehållsdomäner.
 * 2. Strikt separation mellan autosparade utkast och manuell publicering.
 * 3. Optimistisk samtidighetslåsning (konfliktvarning i stället för tyst överskrivning).
 * 4. Reversibilitet och fullständig revisionshistorik med återställning.
 * 5. Källkritiska krav (proveniens, granskare, motivering och källstöd).
 * 6. Vattentät isolering: Opublicerade utkast exkluderas 100 % från publika snapshots.
 */

import type {
  EditorialActor,
  EditorialAuditLogEntry,
  EditorialDomain,
  EditorialDomainSummary,
  EditorialDraftRecord,
  EditorialOverview,
  EditorialReviewStatus,
  RollbackOptions,
  RollbackResult,
  SaveDraftOptions,
  SaveDraftResult,
} from './types';
import {
  isValidStatusTransition,
  validateApprovalForPublication,
  type EditorialStatus,
} from '../runor/editorial';

export class EditorialManager {
  private drafts: Map<string, EditorialDraftRecord> = new Map();
  private auditLog: EditorialAuditLogEntry[] = [];

  constructor() {
    this.initieradeStandarddata();
  }

  /**
   * Skapar en unik nyckel för post i redaktionskartan: domain:id
   */
  private makeKey(domain: EditorialDomain, id: string): string {
    return `${domain}:${id}`;
  }

  /**
   * Förpopulerar redaktionen med befintliga godkända poster så att
   * baslinjen inte är tom vid start.
   */
  private initieradeStandarddata() {
    // 1. Startsida
    this.setPublishedRecord({
      domain: 'startsida',
      id: 'start',
      title: 'Startsida · Introduktion & Portal',
      content: {
        ogonrunor: 'ᚠᚢᚦᚬᚱᚴ',
        rubrik: 'Fornsvenska',
        ingress: 'Handskrifter, lexikon och källor till det medeltida svenska språket.',
      },
      revision: 1,
      savedBy: 'system@fornsvenska.se',
    });

    // 2. Träd och mappar
    this.setPublishedRecord({
      domain: 'trad_och_block',
      id: 'nod-lagar',
      slug: 'lagar',
      title: 'Landskapslagar och rättstexter',
      content: {
        kind: 'folder',
        root: 'texter',
        position: 0,
        childrenCount: 3,
      },
      revision: 1,
      savedBy: 'system@fornsvenska.se',
    });

    // 3. Dokumentblock & Texter
    this.setPublishedRecord({
      domain: 'texter',
      id: 'text-vg-intro',
      slug: 'aldre-vastgotalagen-inledning',
      title: 'Äldre Västgötalagen · Inledning',
      content: {
        docId: 'vg-aldre',
        title: 'Äldre Västgötalagen',
        segments: [
          { id: 'vg-s1', fornsvenska: 'Sveær egho konung at taka', nusvenska: 'Svearna äga konung att taga' },
        ],
      },
      revision: 1,
      savedBy: 'system@fornsvenska.se',
    });

    // 4. Resurser & Hyllor
    this.setPublishedRecord({
      domain: 'resurser',
      id: 'hylla-ordbocker',
      title: 'Medeltida handskriftsutgåvor och ordböcker',
      content: {
        titel: 'Medeltida handskriftsutgåvor och ordböcker',
        note: 'Samling av digitaliserade lexikon och källor',
        position: 1,
      },
      revision: 1,
      savedBy: 'system@fornsvenska.se',
    });

    // 5. Ordboksrättelser
    this.setPublishedRecord({
      domain: 'ordbok',
      id: 'soederwall--af-aeta',
      title: 'soederwall: af-æta',
      content: {
        headword: 'af-æta',
        headwordDisplayOverride: 'af æta',
        reviewStatus: 'granskad_med_kallstod',
        note: 'Normaliserad stavning med särskrivning belagd i handskrift',
        kallstod: 'Söderwall Huvudverk band 1 s. 4',
      },
      revision: 1,
      savedBy: 'system@fornsvenska.se',
    });

    // 6. Runor
    this.setPublishedRecord({
      domain: 'runor',
      id: 'u-112b',
      slug: 'u-112b',
      title: 'U 112B · Kyrkstigen i Ed',
      content: {
        signum: 'U 112B',
        slug: 'u-112b',
        transcription: 'ragnvaldr let rista runar...',
        dating: 'ca 1050–1100',
        editorialNotes: 'Wesséns tolkning i SRI Band 6',
      },
      revision: 1,
      savedBy: 'runredaktion@fornsvenska.se',
      status: 'godkand_for_publicering',
      sourceCitation: 'Sveriges runinskrifter Band 6, s. 158',
      assignedReviewer: 'Källansvarig docent i runologi',
    });
  }

  private setPublishedRecord(params: {
    domain: EditorialDomain;
    id: string;
    slug?: string;
    title: string;
    content: any;
    revision: number;
    savedBy: string;
    status?: EditorialReviewStatus;
    sourceCitation?: string;
    editorialNotes?: string;
    assignedReviewer?: string;
  }) {
    const key = this.makeKey(params.domain, params.id);
    const nu = '2026-10-26T20:00:00Z';
    const record: EditorialDraftRecord = {
      id: params.id,
      domain: params.domain,
      slug: params.slug,
      title: params.title,
      draftRevision: params.revision,
      publishedRevision: params.revision,
      dirty: false,
      status: params.status || 'publicerad',
      savedBy: params.savedBy,
      savedAt: nu,
      publishedAt: nu,
      publishedReleaseId: 'cf-rel-20261026-initial',
      content: structuredClone(params.content),
      publishedContent: structuredClone(params.content),
      history: [
        {
          revision: params.revision,
          savedBy: params.savedBy,
          savedAt: nu,
          content: structuredClone(params.content),
          status: params.status || 'publicerad',
          note: 'Initial publicerad version',
        },
      ],
      sourceCitation: params.sourceCitation,
      editorialNotes: params.editorialNotes,
      assignedReviewer: params.assignedReviewer,
    };
    this.drafts.set(key, record);
  }

  /**
   * Kontrollerar administratörsbehörighet.
   */
  private checkAuth(actor: EditorialActor | null | undefined): { ok: boolean; error?: string; httpStatus: number } {
    if (!actor || !actor.id) {
      return { ok: false, error: 'Oautentiserad användare. Inloggning krävs.', httpStatus: 401 };
    }
    if (!actor.isAdmin) {
      return { ok: false, error: 'Åtkomst nekad. Endast administratörer med verifierad adminroll har behörighet.', httpStatus: 403 };
    }
    return { ok: true, httpStatus: 200 };
  }

  /**
   * Sparar ett utkast (autosave eller manuell sparning).
   * Implementerar optimistisk samtidighetslåsning (conflict detection).
   */
  public async saveDraft<T = unknown>(options: SaveDraftOptions<T>): Promise<SaveDraftResult<T>> {
    const auth = this.checkAuth(options.actor);
    if (!auth.ok) {
      return { ok: false, httpStatus: auth.httpStatus, error: auth.error };
    }

    const key = this.makeKey(options.domain, options.id);
    const existing = this.drafts.get(key);

    // OPTIMISTISK SAMTIDIGHETSKONTROLL:
    // Om anroparen anger en förväntad revision och posten under tiden ändrats av någon annan
    if (
      options.expectedRevision !== undefined &&
      existing &&
      existing.draftRevision !== options.expectedRevision
    ) {
      // Registrera konflikt i audit log
      this.auditLog.unshift({
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        domain: options.domain,
        entityId: options.id,
        action: 'conflict_detected',
        actor: options.actor.email,
        revision: existing.draftRevision,
        summary: `Samtidighetskonflikt: Försökte spara över rev ${existing.draftRevision} med bas i rev ${options.expectedRevision}`,
        timestamp: new Date().toISOString(),
        previousState: existing.content as Record<string, unknown>,
        newState: options.content as Record<string, unknown>,
      });

      return {
        ok: false,
        conflict: true,
        httpStatus: 409,
        error: `Konflikt vid sparning: Posten »${existing.title}« har ändrats av ${existing.savedBy} (revision ${existing.draftRevision}) sedan du började redigera (revision ${options.expectedRevision}). Ladda om för att sammanfoga ändringarna.`,
        conflictDetails: {
          currentRevision: existing.draftRevision,
          currentSavedBy: existing.savedBy,
          currentSavedAt: existing.savedAt,
        },
      };
    }

    // DOMÄNSPECIFIK VALIDERING:
    // Ordboksrättelser kräver källstöd och motiverande notering
    if (options.domain === 'ordbok') {
      const kallstod = (options.sourceCitation || (options.content as any)?.kallstod || '').trim();
      const note = (options.editorialNotes || (options.content as any)?.note || '').trim();
      if (!kallstod) {
        return {
          ok: false,
          httpStatus: 400,
          error: 'Källstöd (faksimilsida, handskrift eller bandhänvisning) är obligatoriskt vid ordboksrättelse.',
        };
      }
      if (!note) {
        return {
          ok: false,
          httpStatus: 400,
          error: 'Redaktionell motivering eller förklarande not måste anges.',
        };
      }
    }

    // Runredaktion: Validera statusövergångar och publiceringskrav
    if (options.domain === 'runor' && options.status && existing) {
      const fromStatus = (existing.status || 'kandidat') as EditorialStatus;
      const toStatus = options.status as EditorialStatus;

      if (!isValidStatusTransition(fromStatus, toStatus)) {
        return {
          ok: false,
          httpStatus: 400,
          error: `Ogiltig statusövergång för runinskriften: Kan inte växla från '${fromStatus}' till '${toStatus}'.`,
        };
      }

      if (toStatus === 'godkand_for_publicering') {
        const assignedReviewer = options.assignedReviewer !== undefined ? options.assignedReviewer : existing.assignedReviewer;
        const reason = options.editorialNotes !== undefined ? options.editorialNotes : (options.content as any)?.curationNotes || existing.editorialNotes;
        const hasSourceCitation = Boolean(options.sourceCitation !== undefined ? options.sourceCitation : existing.sourceCitation);

        const approvalCheck = validateApprovalForPublication({
          assignedReviewer,
          reason,
          hasSourceCitation,
        });
        if (!approvalCheck.approved) {
          return {
            ok: false,
            httpStatus: 400,
            error: approvalCheck.error || 'Godkännande för publicering uppfyller inte de redaktionella kvalitetskraven.',
          };
        }
      }
    }

    const nu = new Date().toISOString();
    const nyRevision = existing ? existing.draftRevision + 1 : 1;
    const nyStatus: EditorialReviewStatus = options.status || existing?.status || 'utkast';

    const history = existing?.history ? [...existing.history] : [];
    history.push({
      revision: nyRevision,
      savedBy: options.actor.email,
      savedAt: nu,
      content: structuredClone(options.content),
      status: nyStatus,
      note: options.editorialNotes,
    });

    const draftRecord: EditorialDraftRecord<T> = {
      id: options.id,
      domain: options.domain,
      slug: options.slug || existing?.slug,
      title: options.title || existing?.title || options.id,
      draftRevision: nyRevision,
      publishedRevision: existing?.publishedRevision ?? null,
      dirty: true,
      status: nyStatus,
      savedBy: options.actor.email,
      savedAt: nu,
      publishedAt: existing?.publishedAt,
      publishedReleaseId: existing?.publishedReleaseId,
      content: structuredClone(options.content),
      publishedContent: existing ? (existing.publishedContent as T) : null,
      history: history as any,
      sourceCitation: options.sourceCitation || existing?.sourceCitation,
      editorialNotes: options.editorialNotes || existing?.editorialNotes,
      assignedReviewer: options.assignedReviewer || existing?.assignedReviewer,
      rejectionReason: options.rejectionReason || existing?.rejectionReason,
    };

    this.drafts.set(key, draftRecord as EditorialDraftRecord);

    // Registrera audit log
    this.auditLog.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      domain: options.domain,
      entityId: options.id,
      action: 'draft_saved',
      actor: options.actor.email,
      revision: nyRevision,
      summary: `Utkast sparat: revision ${nyRevision} i ${options.domain} (${options.title})`,
      timestamp: nu,
      previousState: existing ? (existing.content as Record<string, unknown>) : null,
      newState: options.content as Record<string, unknown>,
    });

    return {
      ok: true,
      httpStatus: 200,
      draft: draftRecord,
    };
  }

  /**
   * Hämtar ett utkast för administratör/förhandsgranskning.
   */
  public getDraft<T = unknown>(
    domain: EditorialDomain,
    id: string,
    actor: EditorialActor | null | undefined
  ): { ok: boolean; draft?: EditorialDraftRecord<T>; error?: string; httpStatus: number } {
    const auth = this.checkAuth(actor);
    if (!auth.ok) {
      return { ok: false, error: auth.error, httpStatus: auth.httpStatus };
    }
    const key = this.makeKey(domain, id);
    const item = this.drafts.get(key);
    if (!item) {
      return { ok: false, error: `Inget utkast hittades för ${domain}:${id}`, httpStatus: 404 };
    }
    return { ok: true, draft: structuredClone(item) as EditorialDraftRecord<T>, httpStatus: 200 };
  }

  /**
   * KRITISK OFFENTLIG LÄSFUNKTION:
   * Hämtar den publicerade versionen av en post.
   * Returnerar uteslutande data från 'publishedContent'.
   * Opublicerade utkast eller pågående redigeringar exponeras ALDRIG här.
   */
  public getPublishedContent<T = unknown>(domain: EditorialDomain, id: string): T | null {
    const key = this.makeKey(domain, id);
    const item = this.drafts.get(key);
    if (!item || item.publishedContent === null) {
      return null;
    }
    return structuredClone(item.publishedContent) as T;
  }

  /**
   * Återställer ett utkast till en tidigare revision (reversibilitet).
   */
  public async rollbackToRevision<T = unknown>(options: RollbackOptions): Promise<RollbackResult<T>> {
    const auth = this.checkAuth(options.actor);
    if (!auth.ok) {
      return { ok: false, error: auth.error, httpStatus: auth.httpStatus };
    }

    const key = this.makeKey(options.domain, options.id);
    const existing = this.drafts.get(key);
    if (!existing) {
      return { ok: false, error: `Posten saknas i redaktionslagret.`, httpStatus: 404 };
    }

    const historikPost = existing.history?.find((h) => h.revision === options.targetRevision);
    if (!historikPost) {
      return {
        ok: false,
        error: `Revision ${options.targetRevision} kunde inte hittas i revisionshistoriken för ${existing.title}.`,
        httpStatus: 404,
      };
    }

    const nu = new Date().toISOString();
    const nyRevision = existing.draftRevision + 1;

    existing.history = existing.history || [];
    existing.history.push({
      revision: nyRevision,
      savedBy: options.actor.email,
      savedAt: nu,
      content: structuredClone(historikPost.content),
      status: historikPost.status,
      note: `Återställd till revision ${options.targetRevision}. Skäl: ${options.reason}`,
    });

    existing.content = structuredClone(historikPost.content);
    existing.draftRevision = nyRevision;
    existing.savedBy = options.actor.email;
    existing.savedAt = nu;
    existing.dirty = true;
    existing.status = historikPost.status;

    this.drafts.set(key, existing);

    this.auditLog.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      domain: options.domain,
      entityId: options.id,
      action: 'rollback',
      actor: options.actor.email,
      revision: nyRevision,
      summary: `Återställde ${existing.title} till revision ${options.targetRevision}. Skäl: ${options.reason}`,
      timestamp: nu,
      previousState: existing.content as Record<string, unknown>,
      newState: historikPost.content as Record<string, unknown>,
    });

    return {
      ok: true,
      httpStatus: 200,
      draft: structuredClone(existing) as EditorialDraftRecord<T>,
    };
  }

  /**
   * Publicerar godkända utkast i en release (kopplad till PublishingPipeline).
   * Gör utkastets innehåll till det nya aktiva 'publishedContent'.
   */
  public async publishApprovedDrafts(
    releaseId: string,
    actor: EditorialActor
  ): Promise<{
    ok: boolean;
    publishedIds: string[];
    error?: string;
    httpStatus: number;
  }> {
    const auth = this.checkAuth(actor);
    if (!auth.ok) {
      return { ok: false, publishedIds: [], error: auth.error, httpStatus: auth.httpStatus };
    }

    const nu = new Date().toISOString();
    const publishedIds: string[] = [];

    for (const [key, draft] of this.drafts.entries()) {
      let skaPubliceras = false;

      if (draft.domain === 'runor') {
        // Runor kräver uttryckligt godkännande
        skaPubliceras = draft.status === 'godkand_for_publicering' && draft.dirty;
      } else {
        // Övriga domäner publiceras om de har opublicerade ändringar (dirty)
        skaPubliceras = draft.dirty;
      }

      if (skaPubliceras) {
        draft.publishedContent = structuredClone(draft.content);
        draft.publishedRevision = draft.draftRevision;
        draft.publishedReleaseId = releaseId;
        draft.publishedAt = nu;
        draft.dirty = false;
        draft.status = 'publicerad';

        publishedIds.push(key);

        this.auditLog.unshift({
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          domain: draft.domain,
          entityId: draft.id,
          action: 'published',
          actor: actor.email,
          revision: draft.draftRevision,
          summary: `Publicerade revision ${draft.draftRevision} i release ${releaseId}`,
          timestamp: nu,
        });
      }
    }

    return {
      ok: true,
      publishedIds,
      httpStatus: 200,
    };
  }

  /**
   * Genererar en offentlig snapshot för samtliga domäner.
   * Garanterar att 0 opublicerade utkast finns med.
   */
  public exportPublicSnapshot(): Record<EditorialDomain, Array<{ id: string; content: unknown; revision: number }>> {
    const result: Record<EditorialDomain, Array<{ id: string; content: unknown; revision: number }>> = {
      startsida: [],
      trad_och_block: [],
      texter: [],
      resurser: [],
      ordbok: [],
      runor: [],
    };

    for (const draft of this.drafts.values()) {
      // Strikt isolering: ENDAST publicerat innehåll med giltig publishedRevision
      if (draft.publishedContent !== null && draft.publishedRevision !== null) {
        result[draft.domain].push({
          id: draft.id,
          content: structuredClone(draft.publishedContent),
          revision: draft.publishedRevision,
        });
      }
    }

    return result;
  }

  /**
   * Hämtar redaktionell sammanfattning för en domän.
   */
  public getDomainSummary(domain: EditorialDomain): EditorialDomainSummary {
    const DOMAIN_NAMES: Record<EditorialDomain, string> = {
      startsida: 'Startsida',
      trad_och_block: 'Träd & mappar',
      texter: 'Texter & segment',
      resurser: 'Resurser & hyllor',
      ordbok: 'Ordbok & rättelser',
      runor: 'Runsidan & inskrifter',
    };

    let totalCount = 0;
    let unpublishedCount = 0;
    let draftRevisionsCount = 0;
    let lastUpdated: string | null = null;

    for (const draft of this.drafts.values()) {
      if (draft.domain === domain) {
        totalCount++;
        draftRevisionsCount += draft.draftRevision;
        if (draft.dirty) {
          unpublishedCount++;
        }
        if (!lastUpdated || draft.savedAt > lastUpdated) {
          lastUpdated = draft.savedAt;
        }
      }
    }

    return {
      domain,
      domainName: DOMAIN_NAMES[domain],
      totalCount,
      unpublishedCount,
      draftRevisionsCount,
      lastUpdated,
    };
  }

  /**
   * Hämtar komplett sammanfattning över alla 6 domäner.
   */
  public getOverview(pipelineState: {
    activeReleaseId: string;
    monthlyBuildCount: number;
    monthlyBuildQuota: number;
  }): EditorialOverview {
    const domains: Record<EditorialDomain, EditorialDomainSummary> = {
      startsida: this.getDomainSummary('startsida'),
      trad_och_block: this.getDomainSummary('trad_och_block'),
      texter: this.getDomainSummary('texter'),
      resurser: this.getDomainSummary('resurser'),
      ordbok: this.getDomainSummary('ordbok'),
      runor: this.getDomainSummary('runor'),
    };

    let totalUnpublishedCount = 0;
    for (const d of Object.values(domains)) {
      totalUnpublishedCount += d.unpublishedCount;
    }

    return {
      domains,
      totalUnpublishedCount,
      activeReleaseId: pipelineState.activeReleaseId,
      monthlyBuildCount: pipelineState.monthlyBuildCount,
      monthlyBuildQuota: pipelineState.monthlyBuildQuota,
    };
  }

  /**
   * Hämtar alla utkast inom en domän eller för hela webbplatsen.
   */
  public listDrafts(
    domain?: EditorialDomain,
    actor?: EditorialActor | null
  ): { ok: boolean; drafts: EditorialDraftRecord[]; error?: string; httpStatus: number } {
    const auth = this.checkAuth(actor);
    if (!auth.ok) {
      return { ok: false, drafts: [], error: auth.error, httpStatus: auth.httpStatus };
    }

    const result: EditorialDraftRecord[] = [];
    for (const draft of this.drafts.values()) {
      if (!domain || draft.domain === domain) {
        result.push(structuredClone(draft));
      }
    }

    result.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    return { ok: true, drafts: result, httpStatus: 200 };
  }

  /**
   * Hämtar ändringshistorik / audit log.
   */
  public getAuditLog(
    options?: { domain?: EditorialDomain; entityId?: string; limit?: number },
    actor?: EditorialActor | null
  ): { ok: boolean; log: EditorialAuditLogEntry[]; error?: string; httpStatus: number } {
    const auth = this.checkAuth(actor);
    if (!auth.ok) {
      return { ok: false, log: [], error: auth.error, httpStatus: auth.httpStatus };
    }

    let filtered = [...this.auditLog];
    if (options?.domain) {
      filtered = filtered.filter((l) => l.domain === options.domain);
    }
    if (options?.entityId) {
      filtered = filtered.filter((l) => l.entityId === options.entityId);
    }
    if (options?.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }

    return { ok: true, log: filtered, httpStatus: 200 };
  }
}

// Global delad instans i processen
export const globalEditorialManager = new EditorialManager();
