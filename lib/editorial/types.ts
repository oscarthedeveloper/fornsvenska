/**
 * CF09: Typdefinitioner för Fornsvenskas samlade webbredaktionsmodell
 *
 * Omfattar alla 6 innehållsdomäner:
 * 1. Startsida (sidor: startinnehall)
 * 2. Träd & mappar (nodes: folder)
 * 3. Dokumentblock & texter (nodes: doc, textsegment)
 * 4. Resurser, hyllor & omslag (hyllor, resurser)
 * 5. Ordboksrättelser & moderna definitioner (ordbok_rattelser, modernisering)
 * 6. Runredaktion (svenska_runor_drafts, audit_log, granskningsflöde)
 */

export type EditorialDomain =
  | 'startsida'
  | 'trad_och_block'
  | 'texter'
  | 'resurser'
  | 'ordbok'
  | 'runor';

export type EditorialReviewStatus =
  | 'utkast'
  | 'kandidat'
  | 'under_granskning'
  | 'godkand_for_publicering'
  | 'avvisad'
  | 'publicerad';

export interface EditorialActor {
  id: string;
  email: string;
  isAdmin: boolean;
  name?: string;
}

export interface EditorialDraftRecord<T = unknown> {
  id: string;
  domain: EditorialDomain;
  slug?: string;
  title: string;
  draftRevision: number;
  publishedRevision: number | null;
  dirty: boolean;
  status: EditorialReviewStatus;
  savedBy: string;
  savedAt: string;
  publishedAt?: string;
  publishedReleaseId?: string;
  content: T;
  publishedContent: T | null;
  history?: Array<{
    revision: number;
    savedBy: string;
    savedAt: string;
    content: T;
    status: EditorialReviewStatus;
    note?: string;
  }>;
  sourceCitation?: string;
  editorialNotes?: string;
  assignedReviewer?: string | null;
  rejectionReason?: string | null;
}

export interface EditorialAuditLogEntry {
  id: string;
  domain: EditorialDomain;
  entityId: string;
  action:
    | 'draft_saved'
    | 'status_changed'
    | 'published'
    | 'rollback'
    | 'conflict_detected'
    | 'deleted';
  actor: string;
  revision: number;
  summary: string;
  timestamp: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
}

export interface SaveDraftOptions<T = unknown> {
  domain: EditorialDomain;
  id: string;
  slug?: string;
  title: string;
  content: T;
  expectedRevision?: number; // Optimistisk låsning för samtidighetskontroll
  sourceCitation?: string;
  editorialNotes?: string;
  actor: EditorialActor;
  status?: EditorialReviewStatus;
  assignedReviewer?: string;
  rejectionReason?: string;
}

export interface SaveDraftResult<T = unknown> {
  ok: boolean;
  conflict?: boolean;
  error?: string;
  httpStatus: number;
  draft?: EditorialDraftRecord<T>;
  conflictDetails?: {
    currentRevision: number;
    currentSavedBy: string;
    currentSavedAt: string;
  };
}

export interface RollbackOptions {
  domain: EditorialDomain;
  id: string;
  targetRevision: number;
  actor: EditorialActor;
  reason: string;
}

export interface RollbackResult<T = unknown> {
  ok: boolean;
  error?: string;
  httpStatus: number;
  draft?: EditorialDraftRecord<T>;
}

export interface EditorialDomainSummary {
  domain: EditorialDomain;
  domainName: string;
  totalCount: number;
  unpublishedCount: number;
  draftRevisionsCount: number;
  lastUpdated: string | null;
}

export interface EditorialOverview {
  domains: Record<EditorialDomain, EditorialDomainSummary>;
  totalUnpublishedCount: number;
  activeReleaseId: string;
  monthlyBuildCount: number;
  monthlyBuildQuota: number;
}
