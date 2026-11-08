/**
 * CF04: Klientadapter för Cross-Origin Storage Bridge
 *
 * Ger artikelunderdomäner transparent tillgång till användarens kanoniska
 * ordlista på www.fornsvenska.se via postMessage och en osynlig iframe.
 */

import type { SparatOrdbokOrd } from './bokmarken';
import {
  BRIDGE_CHANNEL,
  BRIDGE_TIMEOUT_MS,
  type BridgeAction,
  type BridgeErrorCode,
  type BridgeRequestMessage,
  type BridgeResponseMessage,
} from './bridgeProtocol';

export interface StorageBridgeStatus {
  isSameOrigin: boolean;
  isReady: boolean;
  isBlocked: boolean;
  mode: 'DIRECT' | 'BRIDGE' | 'LOCAL_FALLBACK';
  lastError?: string;
}

export class StorageBridgeError extends Error {
  code: BridgeErrorCode;
  constructor(code: BridgeErrorCode, message: string) {
    super(`[StorageBridge:${code}] ${message}`);
    this.name = 'StorageBridgeError';
    this.code = code;
  }
}

export class StorageBridgeClient {
  private canonicalOrigin: string;
  private bridgeUrl: string;
  private iframe: HTMLIFrameElement | null = null;
  private isReady = false;
  private isBlocked = false;
  private pendingRequests = new Map<
    string,
    {
      resolve: (data: SparatOrdbokOrd[]) => void;
      reject: (err: Error) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  private messageListenerBound = false;
  private subscribers = new Set<(list:SparatOrdbokOrd[])=>void>();
  public subscribe(listener:(list:SparatOrdbokOrd[])=>void){ this.subscribers.add(listener); return ()=>this.subscribers.delete(listener); }

  constructor(
    canonicalOrigin = 'https://www.fornsvenska.se',
    bridgePath = '/ordbok/storage-bridge.html'
  ) {
    this.canonicalOrigin = canonicalOrigin.replace(/\/$/, '');
    this.bridgeUrl = `${this.canonicalOrigin}${bridgePath}`;
  }

  public isSameOrigin(): boolean {
    if (typeof window === 'undefined') return true;
    const current = window.location.origin.replace(/\/$/, '').toLowerCase();
    return current === this.canonicalOrigin.toLowerCase();
  }

  public getStatus(): StorageBridgeStatus {
    const same = this.isSameOrigin();
    return {
      isSameOrigin: same,
      isReady: same || this.isReady,
      isBlocked: this.isBlocked,
      mode: same ? 'DIRECT' : this.isBlocked ? 'LOCAL_FALLBACK' : 'BRIDGE',
    };
  }

  public ensureBridge(): Promise<boolean> {
    if (typeof window === 'undefined' || this.isSameOrigin()) {
      this.isReady = true;
      return Promise.resolve(true);
    }

    if (this.isReady && this.iframe) {
      return Promise.resolve(true);
    }

    if (this.isBlocked) {
      return Promise.resolve(false);
    }

    this.bindMessageListener();

    return new Promise((resolve) => {
      let resolved = false;

      const iframe = document.createElement('iframe');
      iframe.src = this.bridgeUrl;
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.border = 'none';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.isBlocked = true;
          resolve(false);
        }
      }, BRIDGE_TIMEOUT_MS);

      iframe.onload = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          this.isReady = true;
          this.iframe = iframe;
          resolve(true);
        }
      };

      iframe.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          this.isBlocked = true;
          resolve(false);
        }
      };

      document.body.appendChild(iframe);
    });
  }

  private bindMessageListener() {
    if (this.messageListenerBound || typeof window === 'undefined') return;
    this.messageListenerBound = true;

    window.addEventListener('message', (event) => {
      // Ignorera meddelanden från andra origins
      if (event.origin !== this.canonicalOrigin || event.source !== this.iframe?.contentWindow) return;

      if(event.data?.channel === BRIDGE_CHANNEL && event.data?.event === 'CHANGED' && Array.isArray(event.data.data)) {
        for(const listener of this.subscribers) listener(event.data.data);
        return;
      }
      const res = event.data as BridgeResponseMessage;
      if (!res || res.channel !== BRIDGE_CHANNEL || !res.requestId) return;

      const pending = this.pendingRequests.get(res.requestId);
      if (!pending) return;

      this.pendingRequests.delete(res.requestId);
      clearTimeout(pending.timer);

      if (res.success && Array.isArray(res.data)) {
        pending.resolve(res.data);
      } else {
        const code = res.error?.code || 'STORAGE_ERROR';
        if (code === 'BLOCKED') {
          this.isBlocked = true;
        }
        pending.reject(
          new StorageBridgeError(code, res.error?.message || 'Okänt fel i lagringsbryggan')
        );
      }
    });
  }

  private sendAction(
    action: BridgeAction,
    payload?: BridgeRequestMessage['payload']
  ): Promise<SparatOrdbokOrd[]> {
    // Fallback till direkt localStorage på samma origin
    if (this.isSameOrigin()) {
      return this.executeLocalDirect(action, payload);
    }

    return this.ensureBridge().then((ready) => {
      if (!ready || !this.iframe?.contentWindow) {
        // Fallback vid blockerad iframe: rör inte huvudlistan, kasta kontrollerat fel
        throw new StorageBridgeError(
          'BLOCKED',
          'Lagringsbryggan är inte tillgänglig i denna webbläsare.'
        );
      }

      const requestId = `fs-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      return new Promise<SparatOrdbokOrd[]>((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pendingRequests.delete(requestId);
          this.isBlocked = true;
          reject(new StorageBridgeError('TIMEOUT', `Timeout vid anrop '${action}' mot bryggan`));
        }, BRIDGE_TIMEOUT_MS);

        this.pendingRequests.set(requestId, { resolve, reject, timer });

        const msg: BridgeRequestMessage = {
          channel: BRIDGE_CHANNEL,
          requestId,
          action,
          payload,
        };

        this.iframe!.contentWindow!.postMessage(msg, this.canonicalOrigin);
      });
    });
  }

  private executeLocalDirect(
    action: BridgeAction,
    payload?: BridgeRequestMessage['payload']
  ): Promise<SparatOrdbokOrd[]> {
    const STORAGE_KEY = 'fornsvenska_sparade_ord_v1';
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      let list: SparatOrdbokOrd[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) throw new StorageBridgeError('STORAGE_ERROR', 'Ordlistan är skadad. Exportera och återställ den innan sparning.');

      switch (action) {
        case 'GET':
          return Promise.resolve(list);

        case 'SAVE':
          if (!payload?.post) throw new StorageBridgeError('INVALID_PAYLOAD', 'Post saknas');
          const existing = list.find(p=>p.id===payload.post!.id);
          list = list.filter((p) => p.id !== payload.post!.id);
          list.unshift({...existing,...payload.post,anteckning:payload.post.anteckning??existing?.anteckning});
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          return Promise.resolve(list);

        case 'REMOVE':
          if (!payload?.id) throw new StorageBridgeError('INVALID_PAYLOAD', 'ID saknas');
          list = list.filter((p) => p.id !== payload.id);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          return Promise.resolve(list);

        case 'NOTE':
          if (!payload?.id) throw new StorageBridgeError('INVALID_PAYLOAD', 'ID saknas');
          list = list.map((p) =>
            p.id === payload.id
              ? { ...p, anteckning: payload.anteckning?.trim() || undefined }
              : p
          );
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          return Promise.resolve(list);

        case 'CLEAR':
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          return Promise.resolve([]);

        case 'IMPORT':
          if (!Array.isArray(payload?.importeradLista)) {
            throw new StorageBridgeError('INVALID_PAYLOAD', 'importeradLista saknas');
          }
          const map = new Map<string, SparatOrdbokOrd>();
          for (const item of list) map.set(item.id, item);
          for (const item of payload.importeradLista) map.set(item.id, item);
          const merged = Array.from(map.values()).sort((a, b) =>
            (b.sparadDatum || '').localeCompare(a.sparadDatum || '')
          );
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return Promise.resolve(merged);

        default:
          throw new StorageBridgeError('INVALID_ACTION', `Okänd åtgärd: ${action}`);
      }
    } catch (err: any) {
      if (err instanceof StorageBridgeError) throw err;
      throw new StorageBridgeError('STORAGE_ERROR', err?.message || 'Lokal lagring misslyckades');
    }
  }

  public hamtaSparadeOrd(): Promise<SparatOrdbokOrd[]> {
    return this.sendAction('GET');
  }

  public sparaOrd(post: SparatOrdbokOrd): Promise<SparatOrdbokOrd[]> {
    return this.sendAction('SAVE', { post });
  }

  public taBortSparatOrd(id: string): Promise<SparatOrdbokOrd[]> {
    return this.sendAction('REMOVE', { id });
  }

  public uppdateraAnteckning(id: string, anteckning: string): Promise<SparatOrdbokOrd[]> {
    return this.sendAction('NOTE', { id, anteckning });
  }

  public importeraSparadeOrd(importeradLista: SparatOrdbokOrd[]): Promise<SparatOrdbokOrd[]> {
    return this.sendAction('IMPORT', { importeradLista });
  }
}

let globalBridgeInstance: StorageBridgeClient | null = null;

export function getStorageBridge(): StorageBridgeClient {
  if (!globalBridgeInstance) {
    globalBridgeInstance = new StorageBridgeClient();
  }
  return globalBridgeInstance;
}
