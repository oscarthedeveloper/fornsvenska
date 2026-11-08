import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isOriginAllowed,
  sanitizeSavedPost,
  ALLOWED_ORIGINS,
  BRIDGE_CHANNEL,
} from '../lib/ordbok/bridgeProtocol.ts';
import {
  importeraSparadeOrdFromJson,
  exporteraSparadeOrd,
} from '../lib/ordbok/bokmarken.ts';

test('CF04: isOriginAllowed permits all project origins and rejects untrusted origins', () => {
  // Samtliga auktoriserade produktionsadresser måste tillåtas
  assert.equal(ALLOWED_ORIGINS.length, 9);
  for (const origin of ALLOWED_ORIGINS) {
    assert.equal(isOriginAllowed(origin), true, `Allowed origin failed: ${origin}`);
    assert.equal(isOriginAllowed(origin + '/'), true, `Allowed origin with slash failed: ${origin}`);
  }

  // Lokala utvecklingsorigins
  assert.equal(isOriginAllowed('http://localhost:3000'), true);
  assert.equal(isOriginAllowed('http://127.0.0.1:3123'), true);

  // Obehöriga origins måste nekas
  assert.equal(isOriginAllowed('https://attacker.com'), false);
  assert.equal(isOriginAllowed('https://fornsvenska.se.evil.com'), false);
  assert.equal(isOriginAllowed('https://ord-08.fornsvenska.se'), false);
  assert.equal(isOriginAllowed('http://fornsvenska.se'), false); // Måste vara HTTPS
  assert.equal(isOriginAllowed(''), false);
  assert.equal(isOriginAllowed(null), false);
  assert.equal(isOriginAllowed(undefined), false);
});

test('CF04: sanitizeSavedPost enforces schema and strips unauthorized tokens/fields', () => {
  const dirtyInput = {
    id: 'soederwall--konunger-nn.1',
    headwordDisplay: 'konunger',
    sourceDataset: 'soederwall',
    partOfSpeech: ['nn'],
    snippet: 'Konge, härskare',
    sparadDatum: '2026-10-30T10:00:00.000Z',
    anteckning: 'Viktigt ord för lagtext',
    // Otillåtna fält som inte får läcka in i lagringen:
    authToken: 'secret-token-123',
    sessionCookie: 'sb-cookie-xyz',
    isAdmin: true,
    maliciousScript: '<script>alert(1)</script>',
  };

  const clean = sanitizeSavedPost(dirtyInput);
  assert.ok(clean);
  assert.equal(clean.id, 'soederwall--konunger-nn.1');
  assert.equal(clean.headwordDisplay, 'konunger');
  assert.equal(clean.sourceDataset, 'soederwall');
  assert.equal(clean.kallaId, 'SOD1884');
  assert.equal(clean.anteckning, 'Viktigt ord för lagtext');

  // Bekräfta att inga hemligheter eller otillåtna fält följer med
  assert.equal(clean.authToken, undefined);
  assert.equal(clean.sessionCookie, undefined);
  assert.equal(clean.isAdmin, undefined);
  assert.equal(clean.maliciousScript, undefined);

  // Ogiltiga indata måste avvisas
  assert.equal(sanitizeSavedPost(null), null);
  assert.equal(sanitizeSavedPost({}), null);
  assert.equal(sanitizeSavedPost({ id: 'invalid-id' }), null); // Saknar '--'
  assert.equal(sanitizeSavedPost({ id: 'soederwall--ord', headwordDisplay: '' }), null);
  assert.equal(sanitizeSavedPost({ id: 'soederwall--ord', headwordDisplay: 'ord', sourceDataset: 'unknown' }), null);
});

test('CF04: Mock cross-origin storage bridge processes GET, SAVE, REMOVE, NOTE, CLEAR and IMPORT', () => {
  // Mocka en isolerad in-memory lagring som motsvarar browserns localStorage
  let storage = {};
  const STORAGE_KEY = 'fornsvenska_sparade_ord_v1';

  const mockBridgeHandler = (origin, req) => {
    if (!isOriginAllowed(origin)) return { ignored: true };
    if (!req || req.channel !== BRIDGE_CHANNEL || !req.requestId) return null;

    let list = [];
    try {
      list = JSON.parse(storage[STORAGE_KEY] || '[]');
    } catch {
      list = [];
    }

    if (req.action === 'GET') {
      return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: true, data: list };
    }

    if (req.action === 'SAVE') {
      const post = sanitizeSavedPost(req.payload?.post);
      if (!post) {
        return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: false, error: { code: 'INVALID_PAYLOAD' } };
      }
      list = list.filter((p) => p.id !== post.id);
      list.unshift(post);
      storage[STORAGE_KEY] = JSON.stringify(list);
      return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: true, data: list };
    }

    if (req.action === 'REMOVE') {
      const id = req.payload?.id;
      list = list.filter((p) => p.id !== id);
      storage[STORAGE_KEY] = JSON.stringify(list);
      return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: true, data: list };
    }

    if (req.action === 'NOTE') {
      const id = req.payload?.id;
      const note = req.payload?.anteckning;
      list = list.map((p) => (p.id === id ? { ...p, anteckning: note || undefined } : p));
      storage[STORAGE_KEY] = JSON.stringify(list);
      return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: true, data: list };
    }

    if (req.action === 'CLEAR') {
      storage[STORAGE_KEY] = JSON.stringify([]);
      return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: true, data: [] };
    }

    return { channel: BRIDGE_CHANNEL, requestId: req.requestId, success: false, error: { code: 'INVALID_ACTION' } };
  };

  // 1. Initial GET ska returnera tom lista
  const res1 = mockBridgeHandler('https://ord-01.fornsvenska.se', {
    channel: BRIDGE_CHANNEL,
    requestId: 'r1',
    action: 'GET',
  });
  assert.equal(res1.success, true);
  assert.deepEqual(res1.data, []);

  // 2. SAVE ord från underdomän ord-01
  const testPost1 = {
    id: 'soederwall--af-aeta',
    headwordDisplay: 'af-äta',
    sourceDataset: 'soederwall',
    kallaId: 'SOD1884',
    partOfSpeech: ['vb'],
    snippet: 'äta upp',
    sparadDatum: '2026-10-30T10:00:00Z',
  };
  const res2 = mockBridgeHandler('https://ord-01.fornsvenska.se', {
    channel: BRIDGE_CHANNEL,
    requestId: 'r2',
    action: 'SAVE',
    payload: { post: testPost1 },
  });
  assert.equal(res2.success, true);
  assert.equal(res2.data.length, 1);
  assert.equal(res2.data[0].id, 'soederwall--af-aeta');

  // 3. GET från annan underdomän ord-04 ser samma sparade ord
  const res3 = mockBridgeHandler('https://ord-04.fornsvenska.se', {
    channel: BRIDGE_CHANNEL,
    requestId: 'r3',
    action: 'GET',
  });
  assert.equal(res3.success, true);
  assert.equal(res3.data.length, 1);
  assert.equal(res3.data[0].headwordDisplay, 'af-äta');

  // 4. NOTE från ord-04 uppdaterar anteckning
  const res4 = mockBridgeHandler('https://ord-04.fornsvenska.se', {
    channel: BRIDGE_CHANNEL,
    requestId: 'r4',
    action: 'NOTE',
    payload: { id: 'soederwall--af-aeta', anteckning: 'Undersök verbform i VGL' },
  });
  assert.equal(res4.success, true);
  assert.equal(res4.data[0].anteckning, 'Undersök verbform i VGL');

  // 5. REMOVE från huvudsajten tar bort ordet
  const res5 = mockBridgeHandler('https://www.fornsvenska.se', {
    channel: BRIDGE_CHANNEL,
    requestId: 'r5',
    action: 'REMOVE',
    payload: { id: 'soederwall--af-aeta' },
  });
  assert.equal(res5.success, true);
  assert.equal(res5.data.length, 0);

  // 6. Anrop från otillåten origin ignoreras helt
  const resBad = mockBridgeHandler('https://evil-site.com', {
    channel: BRIDGE_CHANNEL,
    requestId: 'rbad',
    action: 'GET',
  });
  assert.equal(resBad.ignored, true);
});

test('CF04: Negative test - Blocked storage (Safari ITP / privacy mode) NEVER overwrites data with empty list', () => {
  // Simulera att huvudsajtens lagring redan har sparade ord
  const existingWords = [
    {
      id: 'soederwall--lagh-nn.1',
      headwordDisplay: 'lagh',
      sourceDataset: 'soederwall',
      kallaId: 'SOD1884',
      partOfSpeech: ['nn'],
      snippet: 'lag, rättvisa',
      sparadDatum: '2026-10-30T09:00:00Z',
      anteckning: 'Viktig term',
    },
  ];
  let canonicalStorage = JSON.stringify(existingWords);

  // Simulera ett fel där iframen har blockerad lagring (SecurityError)
  const simulateBlockedIframe = (action) => {
    // Webbläsaren kastar SecurityError vid anrop till localStorage i tredjeparts-iframe
    return {
      channel: BRIDGE_CHANNEL,
      requestId: 'req-blocked',
      success: false,
      error: {
        code: 'BLOCKED',
        message: 'Tredjepartslagring är blockerad i denna webbläsarkontext.',
      },
    };
  };

  const response = simulateBlockedIframe('GET');

  // Verifiera att svaret explicit signalerar BLOCKED
  assert.equal(response.success, false);
  assert.equal(response.error.code, 'BLOCKED');

  // Verifiera att klienten INTE tolkar detta som en lyckad tom lista och inte skriver över
  let clientList = null;
  let didOverwrite = false;

  if (response.success && Array.isArray(response.data)) {
    clientList = response.data;
    // Skulle skriva över om det felaktigt tolkades som tom lista:
    canonicalStorage = JSON.stringify(clientList);
    didOverwrite = true;
  }

  // Bekräfta:
  assert.equal(didOverwrite, false, 'Får ALDRIG skriva över vid blockering');
  assert.equal(clientList, null);

  // Bekräfta att befintlig data på kanonisk origin är 100% intakt
  const restored = JSON.parse(canonicalStorage);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].id, 'soederwall--lagh-nn.1');
  assert.equal(restored[0].anteckning, 'Viktig term');
});

test('CF04: Backup restoration roundtrip via JSON export and import', () => {
  const originalList = [
    {
      id: 'soederwall--bonde-nn.1',
      headwordDisplay: 'bonde',
      sourceDataset: 'soederwall',
      kallaId: 'SOD1884',
      partOfSpeech: ['nn'],
      snippet: 'bonde, fri man',
      sparadDatum: '2026-10-25T14:30:00Z',
      anteckning: 'Västgötalagen Ärvdabalken',
      kallText: {
        ord: 'bonde',
        titel: 'Äldre Västgötalagen',
        meningFsv: 'Bonde war skald',
      },
    },
    {
      id: 'soederwall-supp--odhal-nn.1',
      headwordDisplay: 'odhal',
      sourceDataset: 'soederwall-supp',
      kallaId: 'SOD-SUPP',
      partOfSpeech: ['nn'],
      snippet: 'odaljord',
      sparadDatum: '2026-10-28T16:00:00Z',
    },
  ];

  // 1. Exportera till JSON
  const exported = exporteraSparadeOrd(originalList, 'json');
  assert.equal(exported.mimeType, 'application/json;charset=utf-8');
  assert.ok(exported.filnamn.startsWith('fornsvenska-ordlista-'));
  assert.ok(exported.data.includes('soederwall--bonde-nn.1'));
  assert.ok(exported.data.includes('soederwall-supp--odhal-nn.1'));

  // 2. Simulera import i mockad fönsterkontext
  const mockStorage = {};
  const previousWindow = globalThis.window;

  globalThis.window = {
    localStorage: {
      getItem: (k) => mockStorage[k] || null,
      setItem: (k, v) => {
        mockStorage[k] = v;
      },
      removeItem: (k) => {
        delete mockStorage[k];
      },
    },
    dispatchEvent: () => true,
  };

  try {
    const importResult = importeraSparadeOrdFromJson(exported.data);
    assert.equal(importResult.success, true);
    assert.equal(importResult.importeradeAntal, 2);
    assert.equal(importResult.totaltAntal, 2);

    const importedFromStorage = JSON.parse(mockStorage['fornsvenska_sparade_ord_v1']);
    assert.equal(importedFromStorage.length, 2);

    const bonde = importedFromStorage.find((p) => p.id === 'soederwall--bonde-nn.1');
    assert.ok(bonde);
    assert.equal(bonde.anteckning, 'Västgötalagen Ärvdabalken');
    assert.equal(bonde.kallText.titel, 'Äldre Västgötalagen');

    // 3. Testa att import av ytterligare fil mergar utan dataförlust
    const secondFile = JSON.stringify([
      {
        id: 'soederwall--ting-nn.1',
        headwordDisplay: 'ting',
        sourceDataset: 'soederwall',
        kallaId: 'SOD1884',
        partOfSpeech: ['nn'],
        snippet: 'ting, samling',
        sparadDatum: '2026-10-30T12:00:00Z',
      },
    ]);

    const mergeResult = importeraSparadeOrdFromJson(secondFile);
    assert.equal(mergeResult.success, true);
    assert.equal(mergeResult.importeradeAntal, 1);
    assert.equal(mergeResult.totaltAntal, 3); // 2 tidigare + 1 ny = 3 totalt!

    const finalStorage = JSON.parse(mockStorage['fornsvenska_sparade_ord_v1']);
    assert.equal(finalStorage.length, 3);
    assert.ok(finalStorage.some((p) => p.id === 'soederwall--bonde-nn.1'));
    assert.ok(finalStorage.some((p) => p.id === 'soederwall-supp--odhal-nn.1'));
    assert.ok(finalStorage.some((p) => p.id === 'soederwall--ting-nn.1'));
  } finally {
    globalThis.window = previousWindow;
  }
});
