/** Aggregate comparison only; raw database content stays in a private directory. */
import {readFile} from 'node:fs/promises';
import {GRAMMATIK} from '../../data/grammatik';
import {TEXTER} from '../../data/texter';
import {GRAMMATIK_DOKUMENT} from '../../data/dokument';
import {TEXTER_DOKUMENT} from '../../data/textdokument';
import {START_STANDARD} from '../../lib/sidtyper';
import {flattenTree,stable,hash,unique} from './snapshot-core';
async function main() {
const raw=await readFile(process.argv[2]);
const db=JSON.parse(raw.toString());
if(db.schemaVersion!==1||db.consistency!=='single-statement-mvcc') throw new Error('Unsupported database export');
unique(db.nodes,(n:any)=>n.id,'database node ID');
for(const table of ['nodes','sidor','hyllor','resurser']) if(db[table].length!==db.counts[table]) throw new Error(`Truncated export: ${table}`);
const byId=new Map<string,any>(db.nodes.map((n:any)=>[n.id,n]));
function route(n:any,seen=new Set<string>()):string {
 if(seen.has(n.id)) throw new Error('Cycle in database tree');seen.add(n.id);
 if(n.parent_id) {const parent=byId.get(n.parent_id);if(!parent||parent.root!==n.root)throw new Error('Orphan database node');return `${route(parent,seen)}/${n.slug}`;}
 return '/'+n.slug;
}
const roots:any={};
for(const [root,tree,docs] of [['grammatik',GRAMMATIK,GRAMMATIK_DOKUMENT],['texter',TEXTER,TEXTER_DOKUMENT]] as const) {
 const local=flattenTree(tree), remote=db.nodes.filter((n:any)=>n.root===root).map((n:any)=>({...n,route:route(n)}));
 const localRoutes=new Set(local.map(n=>n.route)),dbRoutes=new Set(remote.map((n:any)=>n.route));
 const shared=remote.filter((n:any)=>n.kind==='doc'&&docs[n.route.slice(1) as keyof typeof docs]);
 roots[root]={localNodes:local.length,localDocuments:Object.keys(docs).length,databaseNodes:remote.length,databaseDocumentNodes:remote.filter((n:any)=>n.kind==='doc').length,localOnlyRoutes:[...localRoutes].filter(r=>!dbRoutes.has(r)).length,databaseOnlyRoutes:[...dbRoutes].filter(r=>!localRoutes.has(r)).length,sharedDocumentPaths:shared.length,identicalDocumentPayloads:shared.filter((n:any)=>stable(n.content)===stable(docs[n.route.slice(1) as keyof typeof docs])).length,databaseNodesMarkedUtkast:remote.filter((n:any)=>n.utkast).length};
}
const summary={schemaVersion:1,observedAt:db.observedAt,databaseExportSha256:hash(raw),databaseExportBytes:raw.length,consistency:db.consistency,exactCounts:db.counts,roots,otherRootNodeCount:db.nodes.filter((n:any)=>!['grammatik','texter'].includes(n.root)).length,homepageIdenticalRawPayload:stable(db.sidor.find((s:any)=>s.slug==='start')?.content)===stable(START_STANDARD),productionSourceSelection:'unverified; do not merge or fall back',privateExportNotPublic:true};
console.log(JSON.stringify(summary,null,2));

}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
