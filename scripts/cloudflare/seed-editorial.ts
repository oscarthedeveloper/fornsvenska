/** Explicit, additive bootstrap from the canonical local content. Existing records are never overwritten. */
import {GRAMMATIK} from '../../data/grammatik';
import {TEXTER} from '../../data/texter';
import {GRAMMATIK_DOKUMENT} from '../../data/dokument';
import {TEXTER_DOKUMENT} from '../../data/textdokument';
import {START_STANDARD} from '../../lib/sidtyper';
import {FASTA_SKRIFTER} from '../../data/resurser';
import {medKallor} from '../../lib/kallbibliotek';
import {RUNIC_PILOT_INSCRIPTIONS} from '../../lib/runor/pilot-data';
import {RUNIC_COMBINED_CORPUS_50} from '../../lib/runor/batch1-data';
import {readFile} from 'node:fs/promises';
export async function baselineRecords(){
 const records:any[]=[];const add=(domain:string,id:string,title:string,content:unknown)=>records.push({domain,id,title,content,revision:1,approved:false,published_revision:1,published_content:content});
 add('startsida','start','Startsida',START_STANDARD);add('trad_och_block','grammatik','Grammatikträd',GRAMMATIK);add('trad_och_block','texter','Textträd',TEXTER);
 for(const [root,documents] of [['grammatik',GRAMMATIK_DOKUMENT],['texter',TEXTER_DOKUMENT]] as const)for(const [id,doc] of Object.entries(documents))add('texter',root+'/'+id,doc.titel,doc);
 add('resurser','bibliotek','Resursbibliotek',medKallor({hyllor:[],skrifter:FASTA_SKRIFTER,harDatabas:false}));
 const definitions=JSON.parse(await readFile('data/ordbok/moderniserade-definitioner.json','utf8'));
 const corrections=JSON.parse(await readFile('data/ordbok-rattelser.json','utf8'));
 for(const id of new Set<string>([...definitions,...corrections].map(r=>r.id)))add('ordbok',id,id,{definition:definitions.find((r:any)=>r.id===id),correction:corrections.find((r:any)=>r.id===id)});
 for(const [version,items] of [['2026.1-pilot',RUNIC_PILOT_INSCRIPTIONS],['2026.2-batch1',RUNIC_COMBINED_CORPUS_50]] as const)for(const item of items)add('runor',`${version}/${item.canonicalSlug}`,`${version}: ${item.canonicalSignum}`,item);
 return records;
}
async function main(){
 const records=await baselineRecords();
 if(!process.argv.includes('--apply')){console.log(JSON.stringify({dryRun:true,records:records.length}));return;}
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw Error('Bootstrap credentials missing');
 for(let i=0;i<records.length;i+=100){const r=await fetch(`${url}/rest/v1/cf_documents?on_conflict=domain,id`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify(records.slice(i,i+100))});if(!r.ok)throw Error(`Bootstrap failed (${r.status}); existing data preserved`);
 const inserted=await r.json() as any[];
 if(inserted.length){const history=inserted.map(r=>({domain:r.domain,id:r.id,revision:1,content:r.content,actor:null}));const h=await fetch(`${url}/rest/v1/cf_revisions?on_conflict=domain,id,revision`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(history)});if(!h.ok)throw Error('Baseline revision history could not be confirmed');}
 }
 console.log(`Baseline bootstrap finished (${records.length} candidate records; existing records preserved).`);
}
if(process.argv[1]?.endsWith('seed-editorial.ts'))main().catch(e=>{console.error(e.message);process.exitCode=1;});
