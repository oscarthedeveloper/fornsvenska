/**
 * CF04: Protokoll och typer för Cross-Origin Storage Bridge
 *
 * Tillåter säker synkronisering av personlig ordlista (localStorage)
 * mellan huvudsajten (www.fornsvenska.se) och ordbokens underdomäner (ord-01..07.fornsvenska.se).
 */

import type { SparatOrdbokOrd } from './bokmarken';

export const BRIDGE_CHANNEL = 'fornsvenska:ordlista-v1';
export const BRIDGE_TIMEOUT_MS = 2500;

export const ALLOWED_ORIGINS: readonly string[] = [
  'https://www.fornsvenska.se',
  'https://fornsvenska.se',
  'https://ord-01.fornsvenska.se',
  'https://ord-02.fornsvenska.se',
  'https://ord-03.fornsvenska.se',
  'https://ord-04.fornsvenska.se',
  'https://ord-05.fornsvenska.se',
  'https://ord-06.fornsvenska.se',
  'https://ord-07.fornsvenska.se',
];

export type BridgeAction = 'GET' | 'SAVE' | 'REMOVE' | 'NOTE' | 'CLEAR' | 'IMPORT';

export type BridgeErrorCode =
  | 'BLOCKED'
  | 'TIMEOUT'
  | 'FORBIDDEN_ORIGIN'
  | 'INVALID_ACTION'
  | 'INVALID_PAYLOAD'
  | 'STORAGE_ERROR';

export interface BridgeRequestMessage {
  channel: typeof BRIDGE_CHANNEL;
  requestId: string;
  action: BridgeAction;
  payload?: {
    post?: SparatOrdbokOrd;
    id?: string;
    anteckning?: string;
    importeradLista?: SparatOrdbokOrd[];
  };
}

export interface BridgeResponseMessage {
  channel: typeof BRIDGE_CHANNEL;
  requestId: string;
  success: boolean;
  data?: SparatOrdbokOrd[];
  error?: {
    code: BridgeErrorCode;
    message: string;
  };
}

export interface BridgeBroadcastMessage {
  channel: typeof BRIDGE_CHANNEL;
  event: 'CHANGED';
  data: SparatOrdbokOrd[];
}

/**
 * Validerar om en origin är tillåten att kommunicera med bryggan.
 * Tillåter exakta produktionsorigins samt lokala adresser för testning.
 */
export function isOriginAllowed(origin: string): boolean {
  if (!origin || typeof origin !== 'string') return false;

  const normalized = origin.trim().replace(/\/$/, '').toLowerCase();

  // Tillåt kända produktion- och preview-domäner
  if (ALLOWED_ORIGINS.includes(normalized)) return true;

  // Tillåt lokal utvecklingsmiljö
  if (
    normalized.startsWith('http://localhost:') ||
    normalized.startsWith('http://127.0.0.1:') ||
    normalized.startsWith('http://[::1]:')
  ) {
    return true;
  }

  return false;
}

/**
 * Saniterar och validerar en post så att endast tillåtna ordboksfält sparas.
 * Inga auth-tokens, lösenord eller otillåtna egenskaper kan injiceras.
 */
export function sanitizeSavedPost(raw: any): SparatOrdbokOrd | null {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || !raw.id.includes('--')) return null;
  if (typeof raw.headwordDisplay !== 'string' || !raw.headwordDisplay) return null;
  if (raw.sourceDataset !== 'soederwall' && raw.sourceDataset !== 'soederwall-supp') return null;

  const post: SparatOrdbokOrd = {
    id: raw.id,
    headwordDisplay: raw.headwordDisplay,
    sourceDataset: raw.sourceDataset,
    kallaId: raw.sourceDataset === 'soederwall' ? 'SOD1884' : 'SOD-SUPP',
    partOfSpeech: Array.isArray(raw.partOfSpeech)
      ? raw.partOfSpeech.filter((s: unknown): s is string => typeof s === 'string')
      : [],
    snippet: typeof raw.snippet === 'string' ? raw.snippet.slice(0, 300) : '',
    sparadDatum:
      typeof raw.sparadDatum === 'string' && !isNaN(Date.parse(raw.sparadDatum))
        ? raw.sparadDatum
        : new Date().toISOString(),
  };

  if (typeof raw.homonymNumber === 'number' && raw.homonymNumber > 0) {
    post.homonymNumber = raw.homonymNumber;
  }
  if (typeof raw.gramOriginal === 'string') {
    post.gramOriginal = raw.gramOriginal.slice(0, 100);
  }
  if (typeof raw.anteckning === 'string' && raw.anteckning.trim()) {
    post.anteckning = raw.anteckning.trim().slice(0, 2000);
  }
  if (raw.kallText && typeof raw.kallText === 'object') {
    post.kallText = {
      ord: String(raw.kallText.ord || '').slice(0, 100),
      titel: raw.kallText.titel ? String(raw.kallText.titel).slice(0, 150) : undefined,
      meningFsv: raw.kallText.meningFsv ? String(raw.kallText.meningFsv).slice(0, 500) : undefined,
      meningTolkning: raw.kallText.meningTolkning ? String(raw.kallText.meningTolkning).slice(0, 500) : undefined,
    };
  }

  return post;
}
