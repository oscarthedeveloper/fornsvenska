import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';

export const SCHEMA = 'fornsvenska.snapshot.v1';
export const hash = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
export function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
export async function walk(dir: string): Promise<string[]> {
  const result: string[] = [];
  for (const name of (await readdir(dir)).sort()) {
    const p = path.join(dir, name); const s = await lstat(p);
    if (s.isSymbolicLink()) throw new Error(`Symlink not allowed: ${p}`);
    if (s.isDirectory()) result.push(...await walk(p));
    else if (s.isFile()) result.push(p);
  }
  return result;
}
export function unique<T>(items: T[], key: (item:T)=>string, label: string) {
  const ids = new Set<string>();
  for (const item of items) { const id = key(item); if (!id || ids.has(id)) throw new Error(`Missing/duplicate ${label}: ${id}`); ids.add(id); }
  return ids;
}
export function validateRelations(dictionary: any[], corrections: any[], definitions: any[]) {
  const ids = unique(dictionary, p=>p.id, 'dictionary ID');
  for (const [label, rows] of [['correction', corrections], ['definition', definitions]] as const) {
    unique(rows, p=>p.id, label);
    for (const row of rows) if (!ids.has(row.id)) throw new Error(`Orphan ${label}: ${row.id}`);
  }
  for (const p of dictionary) if (!p.headwordDisplay || !Array.isArray(p.senses) || !p.sourceDataset) throw new Error(`Invalid dictionary record: ${p.id}`);
}
export function flattenTree(tree: any[], prefix=''): any[] {
  const rows:any[]=[];
  for (const n of tree) {
    if (!n.slug || /[/?#]/.test(n.slug) || !['folder','doc'].includes(n.kind)) throw new Error('Invalid tree node');
    const route = `${prefix}/${n.slug}`;
    rows.push({route, kind:n.kind});
    rows.push(...flattenTree(n.children ?? [], route));
  }
  unique(rows, r=>r.route, 'route');
  return rows;
}
export function validateArchive(tree: any[], documents: Record<string,any>) {
  const rows=flattenTree(tree);
  for (const n of rows) if (n.kind==='doc' && !documents[n.route.slice(1)]) throw new Error(`Missing document: ${n.route}`);
  const routes=new Set(rows.filter(r=>r.kind==='doc').map(r=>r.route.slice(1)));
  for (const key of Object.keys(documents)) if (!routes.has(key)) throw new Error(`Unreachable document: ${key}`);
}
export async function inventory(root:string, dirs:string[]) {
  const files=(await Promise.all(dirs.map(async d=>{ const p=path.join(root,d), s=await lstat(p); if(s.isSymbolicLink()) throw new Error('Symlink input'); return s.isDirectory()?walk(p):[p]; }))).flat();
  const entries=[];
  for (const file of files) {const b=await readFile(file); entries.push({path:path.relative(root,file),bytes:b.length,sha256:hash(b)});}
  return entries;
}
export async function verifyManifest(dir: string) {
  const manifest=JSON.parse(await readFile(path.join(dir,'manifest.json'),'utf8'));
  if (manifest.schema !== SCHEMA || manifest.audience !== 'private-prototype' || manifest.publishable !== false) throw new Error('Unsupported snapshot contract');
  const allFiles=(await walk(dir)).map(f=>path.relative(dir,f));
  unique(manifest.files, (f:any)=>f.path, 'snapshot path');
  for (const f of manifest.files) {
    if (!/^(data|assets)\/[a-zA-Z0-9._/-]+$/.test(f.path) || f.path.split('/').includes('..')) throw new Error('Unsafe manifest path');
    const absolute=path.join(dir,f.path);
    if ((await lstat(absolute)).isSymbolicLink()) throw new Error('Symlink in snapshot');
    const b=await readFile(absolute);
    if(b.length!==f.bytes || hash(b)!==f.sha256) throw new Error(`Snapshot integrity failure: ${f.path}`);
  }
  const files=allFiles;
  const listed=new Set(['manifest.json',...manifest.files.map((f:any)=>f.path)]);
  if (files.some(f=>!listed.has(f))) throw new Error('Unlisted snapshot file');
  const core={...manifest}; delete core.releaseId;
  if(manifest.releaseId!==`cf-${hash(stable(core)).slice(0,24)}`) throw new Error('Manifest integrity failure');
  const read=async(name:string)=>JSON.parse(await readFile(path.join(dir,'data',`${name}.json`),'utf8'));
  const dictionary=await read('dictionary'), corrections=await read('corrections'), definitions=await read('definitions');
  validateRelations(dictionary,corrections,definitions);
  const archive=await read('archive');
  for(const root of ['grammatik','texter']) validateArchive(archive[root].tree,archive[root].documents);
  if(dictionary.length!==manifest.counts.dictionary) throw new Error('Dictionary count mismatch');
  return manifest;
}
