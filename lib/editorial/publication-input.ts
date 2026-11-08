/** Frozen CI input only. Never called from client bundles or used as a live database fallback. */
import {readFileSync} from 'node:fs';
export interface PublicationRecord {domain:string;id:string;revision:number;content:any}
let cachedPath:string|undefined;let cached:PublicationRecord[]=[];
export function publicationRecords():PublicationRecord[]{
 const file=process.env.CF_RELEASE_SNAPSHOT;
 if(!file)return [];
 if(file!==cachedPath){
  const data=JSON.parse(readFileSync(file,'utf8'));
  if(!Array.isArray(data))throw Error('Invalid frozen publication input');
  const seen=new Set<string>();
  for(const r of data){
   if(!['startsida','trad_och_block','texter','resurser','ordbok','runor'].includes(r.domain)||typeof r.id!=='string'||!Number.isSafeInteger(r.revision)||r.revision<1||r.content===null)throw Error('Invalid publication record');
   const key=r.domain+':'+r.id;if(seen.has(key))throw Error('Duplicate publication record');seen.add(key);
   if(r.domain==='startsida'&&r.id!=='start')throw Error('Unknown homepage ID');
   if(r.domain==='trad_och_block'&&!['grammatik','texter'].includes(r.id))throw Error('Unknown archive root');
   if(r.domain==='texter'&&!/^(grammatik|texter)\/.+/.test(r.id))throw Error('Document IDs must include the archive root');
   if(r.domain==='resurser'&&r.id!=='bibliotek')throw Error('Unknown library ID');
   if(r.domain==='ordbok'&&(!r.id.includes('--')||(!r.content.correction&&!r.content.definition)))throw Error('Dictionary changes require correction/definition payloads');
   if(r.domain==='ordbok'&&r.content.correction&&(!r.content.correction.kallstod?.trim()||!r.content.correction.note?.trim()))throw Error('Corrections require source evidence and a reason');
  }
  cached=data;cachedPath=file;
 }
 return cached;
}
export function publishedOverride<T>(domain:string,id:string):T|undefined{return publicationRecords().find(r=>r.domain===domain&&r.id===id)?.content;}
export function withRunicOverrides<T extends {canonicalSlug:string}>(items:T[],version='2026.1-pilot'):T[]{
 const changes=publicationRecords().filter(r=>r.domain==='runor'&&r.id.startsWith(version+'/'));
 for(const r of changes)if(r.content.canonicalSlug!==r.id.slice(version.length+1))throw Error('Runic slug mismatch');
 const result=items.map(item=>publishedOverride<T>('runor',version+'/'+item.canonicalSlug)??item);
 for(const r of changes)if(!result.some(i=>i.canonicalSlug===r.content.canonicalSlug))result.push(r.content);
 return result;
}
