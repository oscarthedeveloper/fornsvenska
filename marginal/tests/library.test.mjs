import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';

// Exercise the actual standalone app's data layer without browser dependencies.
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function harness(initialStorage = null) {
  const elements = new Map();
  const listeners = new Map();
  const storage = new Map(initialStorage === null ? [] : [['marginal.library.v1', initialStorage]]);
  const element = () => ({
    value: '', hidden: false, textContent: '', innerHTML: '', style: {},
    classList: { toggle() {}, remove() {}, add() {} },
    addEventListener() {}, setAttribute() {}, replaceChildren() {}, append() {},
    close() {}, focus() {}, scrollHeight:100, querySelectorAll() { return []; },
  });
  const getElement = id => {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  };
  let failWrites = false;
  const context = {
    console, Date, Math, Map, Set, JSON, Number, String, Error, SyntaxError, URLSearchParams,
    crypto: webcrypto, setTimeout: () => 1, clearTimeout() {},
    document: {
      getElementById: getElement, addEventListener() {},
      querySelector: () => element(), querySelectorAll: () => [],
      createTextNode: text => text, createElement: element,
    },
    window: {
      location: { hash: '' },
      history: {
        state:null,
        pushState(state, _title, route) { this.state=state;context.window.location.hash=route; },
        replaceState(state, _title, route) { this.state=state;context.window.location.hash=route; },
      },
      addEventListener(name, listener) { listeners.set(name, listener); },
    },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem(key, value) { if (failWrites) throw Error('Quota exceeded'); storage.set(key, value); },
    },
  };
  const exposed = source.replace('    initialize();', `
    globalThis.appTest = {
      seed, validateLibrary, markdown, isArchived, load, persist, confirmImport,
      setState(value) { state = value; currentRoom = value.lastRoom; },
      getState() { return state; },
      setImport(value) { pendingImport = value; },
      recovery() { return recoveredBackup; },
      markOriginalExported() { recoveryExported = true; },
      openNote, navigate, applyRoute, returnFromNote, syncEditor, routeFor,
      deskNotes, switchDesk, createNote, nextLappPosition, archiveNote,
      view() { return {view, editingNote, currentRoom, preview, query, includeArchive, deskMode}; },
    };
  `);
  runInNewContext(exposed, context);
  const api = context.appTest;
  api.setState(api.seed());
  return { api, storage, elements, listeners, window:context.window, failWrites: value => { failWrites = value; } };
}

test('library survives a save/reload with text, archive status and positions intact', () => {
  const { api } = harness();
  const library = api.seed();
  library.rooms[0].archived = true;
  Object.assign(library.notes[0], { title: 'Översättning', body: 'αβγ\nEn tanke 📝', x: 865, y: 1420, archived: true, reference: 'Joh 1:1–5' });
  api.setState(library);
  assert.equal(api.persist(), true);
  api.load();
  assert.deepEqual(JSON.parse(JSON.stringify(api.getState())), JSON.parse(JSON.stringify(library)));
});

test('room archival preserves separate note archival when a room is taken out again', () => {
  const { api } = harness();
  const library = api.getState();
  const room = library.rooms[0], [note, individuallyArchived] = library.notes;
  individuallyArchived.archived = true;
  room.archived = true;
  assert.equal(api.isArchived(note), true);
  room.archived = false;
  assert.equal(api.isArchived(note), false);
  assert.equal(api.isArchived(individuallyArchived), true);
});

test('import adds complete independent copies and keeps existing notes unchanged', () => {
  const { api } = harness();
  const original = JSON.stringify(api.getState().notes);
  const imported = api.validateLibrary(JSON.parse(JSON.stringify(api.seed())));
  const count = api.getState().notes.length;
  api.setImport(imported);
  api.confirmImport();
  const result = api.getState();
  assert.equal(result.notes.length, count + imported.notes.length);
  assert.equal(JSON.stringify(result.notes.slice(0, count)), original);
  const ids = new Set(result.rooms.map(room => room.id));
  assert.equal(ids.size, result.rooms.length);
  assert.equal(new Set(result.notes.map(note => note.id)).size, result.notes.length);
  assert.ok(result.notes.every(note => ids.has(note.roomId)));
});

test('a storage quota failure rolls back an import without changing saved data', () => {
  const h = harness();
  h.api.persist();
  const saved = h.storage.get('marginal.library.v1');
  const original = JSON.stringify(h.api.getState());
  h.api.setImport(h.api.seed());
  h.failWrites(true);
  h.api.confirmImport();
  assert.equal(JSON.stringify(h.api.getState()), original);
  assert.equal(h.storage.get('marginal.library.v1'), saved);
  assert.match(h.elements.get('import-review').textContent, /Inga anteckningar/);
});

test('corrupt stored data is never overwritten by initialization or autosave', () => {
  const h = harness('{invalid');
  h.api.load();
  assert.equal(h.api.recovery(), '{invalid');
  assert.equal(h.api.persist(), false);
  assert.equal(h.storage.get('marginal.library.v1'), '{invalid');
  assert.equal(h.elements.get('storage-error').hidden, false);
});

test('recovery import requires exporting original data, then can restore normal saving', () => {
  const h = harness('{invalid');
  h.api.load();
  const library = h.api.seed();
  h.api.setImport(library);
  h.api.confirmImport();
  assert.equal(h.storage.get('marginal.library.v1'), '{invalid');
  h.api.markOriginalExported();
  h.api.confirmImport();
  assert.equal(h.api.recovery(), null);
  assert.equal(h.api.persist(), true);
  assert.equal(JSON.parse(h.storage.get('marginal.library.v1')).notes.length, library.notes.length * 2);
});

test('another window changing storage locks this window against overwriting it', () => {
  const h = harness();
  h.api.persist();
  const saved = h.storage.get('marginal.library.v1');
  h.listeners.get('storage')({ key: 'marginal.library.v1', newValue: '{other-window}' });
  assert.equal(h.api.persist(), false);
  h.api.setImport(h.api.seed());
  h.api.confirmImport();
  assert.equal(h.storage.get('marginal.library.v1'), saved);
});

test('import rejects broken references, duplicate ids and unsupported versions', () => {
  const { api } = harness();
  const invalid = change => { const data = JSON.parse(JSON.stringify(api.seed())); change(data); return data; };
  assert.throws(() => api.validateLibrary(invalid(data => { data.version = 2; })));
  assert.throws(() => api.validateLibrary(invalid(data => { data.notes[0].roomId = 'missing'; })));
  assert.throws(() => api.validateLibrary(invalid(data => { data.rooms.push(data.rooms[0]); })));
  assert.throws(() => api.validateLibrary(invalid(data => { data.notes.push(data.notes[0]); })));
  assert.throws(() => api.validateLibrary(invalid(data => { data.notes[0].body = null; })));
});

test('import normalizes unsafe colors and excessive coordinates', () => {
  const { api } = harness();
  const data = JSON.parse(JSON.stringify(api.seed()));
  Object.assign(data.notes[0], { color: 'red;display:none', x: -500, y: 999999 });
  const note = api.validateLibrary(data).notes[0];
  assert.equal(note.color, '#fffef7');
  assert.equal(note.x, 15);
  assert.equal(note.y, 12000);
});

test('text rendering escapes HTML while retaining supported study formatting', () => {
  const { api } = harness();
  const rendered = api.markdown('# Kapitel\n\n<script>alert(1)</script>\n\n==viktigt== och **tydligt**\n\n- ett\n- två');
  assert.ok(!rendered.includes('<script>'));
  assert.match(rendered, /&lt;script&gt;/);
  assert.match(rendered, /<mark>viktigt<\/mark>/);
  assert.match(rendered, /<strong>tydligt<\/strong>/);
  assert.match(rendered, /<ul><li>ett<\/li><li>två<\/li><\/ul>/);
});

test('opening a note navigates to its own address and begins in read mode', () => {
  const h=harness();const note=h.api.getState().notes[0];
  h.api.openNote(note.id);
  assert.equal(h.window.location.hash, '#/anteckning/'+note.id);
  assert.equal(h.api.view().view, 'document');
  assert.equal(h.api.view().preview, true);
  assert.equal(h.elements.get('library-page').hidden, true);
  assert.equal(h.elements.get('note-page').hidden, false);
  assert.equal(h.elements.get('document-title').textContent,note.title);
});

test('following a sibling note saves the text currently being edited', () => {
  const h=harness();const [first,second]=h.api.getState().notes;
  h.api.openNote(first.id,{edit:true});
  h.elements.get('editor-body').value='En ny tanke som inte får tappas bort.';
  h.api.openNote(second.id);
  assert.equal(first.body,'En ny tanke som inte får tappas bort.');
  assert.equal(h.api.view().editingNote,second.id);
  assert.match(h.storage.get('marginal.library.v1'), /En ny tanke/);
});

test('a direct document address restores the correct room and note after reload', () => {
  const h=harness();const note=h.api.getState().notes[2];
  h.window.location.hash='#/anteckning/'+note.id;h.api.applyRoute();
  assert.equal(h.api.view().view,'document');
  assert.equal(h.api.view().editingNote,note.id);
  assert.equal(h.api.view().currentRoom,note.roomId);
  h.window.location.hash='#/anteckning/%invalid';h.api.applyRoute();
  assert.equal(h.api.view().view,'desk');
  h.window.location.hash='#/anteckning/missing';h.api.applyRoute();
  assert.equal(h.api.view().view,'library');
});

test('returning to the workspace saves edits and exits the document page', () => {
  const h=harness();const note=h.api.getState().notes[0];
  h.api.openNote(note.id,{edit:true});
  h.elements.get('editor-title').value='En uppdaterad rubrik';
  h.api.returnFromNote();
  assert.equal(note.title,'En uppdaterad rubrik');
  assert.equal(h.api.view().view,'desk');
  assert.equal(h.api.view().editingNote,null);
  assert.equal(h.elements.get('library-page').hidden,false);
  assert.equal(h.elements.get('note-page').hidden,true);
  assert.match(h.window.location.hash,/^#\/rum\//);
});

test('reading a note does not change its modification date', () => {
  const h=harness();const note=h.api.getState().notes[0];
  note.updatedAt='2020-01-01T00:00:00.000Z';
  h.api.openNote(note.id);h.api.returnFromNote();
  assert.equal(note.updatedAt,'2020-01-01T00:00:00.000Z');
});

test('back navigation can restore a search including the archive filter', () => {
  const h=harness();const room=h.api.getState().rooms[0];
  h.window.location.hash='#/rum/'+room.id+'?q='+encodeURIComponent('egna ord')+'&arkiv=1';
  h.api.applyRoute();
  assert.equal(h.api.view().view,'desk');
  assert.equal(h.api.view().query,'egna ord');
  assert.equal(h.api.view().includeArchive,true);
  assert.equal(h.elements.get('search').value,'egna ord');
});

test('existing mixed rooms split into quick notes and document shelves without rewriting their positions', () => {
  const h=harness(), library=h.api.getState(), room=library.rooms[0];
  const before=JSON.stringify(library.notes);
  const quick=h.api.deskNotes(room.id,'notes'), documents=h.api.deskNotes(room.id,'documents');
  assert.equal(quick.length,1);
  assert.ok(quick.every(note=>note.type==='quick'));
  assert.equal(documents.length,4);
  assert.deepEqual(new Set(documents.map(note=>note.type)),new Set(['document','reflection','quote','bookmark']));
  assert.equal(JSON.stringify(library.notes),before);
  documents[0].archived=true;
  assert.equal(h.api.deskNotes(room.id,'documents').length,3);
  quick[0].archived=true;
  assert.equal(h.api.deskNotes(room.id,'notes').length,0);
});

test('each workspace has a reloadable address and explicit addresses take precedence over saved history', () => {
  const h=harness(), room=h.api.getState().rooms[0];
  h.api.switchDesk('documents');
  assert.equal(h.window.location.hash,'#/rum/'+room.id+'/dokument');
  h.window.history.state={workspace:{view:'desk',deskMode:'notes',left:0,top:0}};
  h.api.applyRoute();
  assert.equal(h.api.view().deskMode,'documents');
  h.api.switchDesk('notes');
  assert.equal(h.window.location.hash,'#/rum/'+room.id+'/lappar');
  h.api.applyRoute();
  assert.equal(h.api.view().deskMode,'notes');
  h.window.location.hash='#/rum/'+room.id;
  h.window.history.state=null;
  h.api.applyRoute();
  assert.equal(h.api.view().deskMode,'notes');
});

test('new lappar open on the board and avoid existing lappar without moving saved notes', () => {
  const h=harness(), room=h.api.getState().rooms[0];
  const original=JSON.stringify(h.api.getState().notes);
  h.api.switchDesk('documents');h.api.createNote('quick');
  const library=h.api.getState(), added=library.notes.at(-1);
  assert.equal(h.api.view().deskMode,'notes');
  assert.equal(h.api.view().view,'desk');
  assert.match(h.window.location.hash,/\/lappar$/);
  assert.equal(JSON.stringify(library.notes.slice(0,-1)),original);
  const others=h.api.deskNotes(room.id,'notes').filter(note=>note.id!==added.id);
  assert.ok(others.every(note=>added.x+272<=note.x||note.x+272<=added.x||added.y+410<=note.y||note.y+410<=added.y));
});

test('new documents start in their own editor and return to the document shelf', () => {
  const h=harness();h.api.switchDesk('notes');h.api.createNote('reflection');
  assert.equal(h.api.view().view,'document');
  assert.equal(h.api.view().deskMode,'documents');
  assert.equal(h.api.view().preview,false);
  h.elements.get('editor-body').value='Mina reflektioner efter kapitlet.';
  h.api.returnFromNote();
  assert.equal(h.api.view().view,'desk');
  assert.equal(h.api.view().deskMode,'documents');
  assert.match(h.window.location.hash,/\/dokument$/);
  assert.equal(h.api.getState().notes.at(-1).body,'Mina reflektioner efter kapitlet.');
});

test('archiving a document returns to the shelf and keeps the document available for restoration', () => {
  const h=harness(), note=h.api.getState().notes[0], roomId=note.roomId;
  const initial=h.api.deskNotes(roomId,'documents').length;
  h.api.switchDesk('documents');h.api.openNote(note.id);h.api.archiveNote();
  assert.equal(h.api.view().deskMode,'documents');
  assert.equal(h.api.view().view,'desk');
  assert.equal(h.api.deskNotes(roomId,'documents').length,initial-1);
  assert.equal(note.archived,true);
  assert.ok(h.api.getState().notes.includes(note));
});
