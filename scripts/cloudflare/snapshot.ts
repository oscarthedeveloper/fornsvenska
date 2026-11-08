/** CF02 local prototype export; never silently chooses DB fallback or publishes. */
import { readFile, writeFile, mkdir, rename, chmod, rm } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { SCHEMA, hash, stable, inventory, validateArchive, validateRelations, verifyManifest } from './snapshot-core';

async function main() {
  const args=process.argv.slice(2);
  if(args[0]==='validate') { const m=await verifyManifest(path.resolve(args[1])); console.log(JSON.stringify({releaseId:m.releaseId,counts:m.counts,publishable:m.publishable})); return; }
  if(args[0]!=='export-local' || !args[1] || args.length!==2) throw new Error('Usage: snapshot.ts export-local <absolute-private-output> | validate <snapshot-directory>');
  const root=process.cwd(), out=path.resolve(args[1]);
  if(!path.isAbsolute(args[1]) || out===root || out.startsWith(root+path.sep)) throw new Error('Snapshot must be outside repository/public build directories');
  const sources=await inventory(root,['data','lib','public','scripts/cloudflare','package.json','package-lock.json','tsconfig.json']);
  const [{GRAMMATIK},{TEXTER},{GRAMMATIK_DOKUMENT},{TEXTER_DOKUMENT},{START_STANDARD},{FASTA_SKRIFTER},{KALLOR},{medKallor},{RUNIC_PILOT_INSCRIPTIONS},{RUNIC_COMBINED_CORPUS_50},{toPublicPublishedItem}] = await Promise.all([
    import('../../data/grammatik'),import('../../data/texter'),import('../../data/dokument'),import('../../data/textdokument'),import('../../lib/sidtyper'),import('../../data/resurser'),import('../../data/kallor'),import('../../lib/kallbibliotek'),import('../../lib/runor/pilot-data'),import('../../lib/runor/batch1-data'),import('../../lib/runor/contract')
  ]);
  const dictionary=JSON.parse(await readFile('data/ordbok/poster.json','utf8'));
  const corrections=JSON.parse(await readFile('data/ordbok-rattelser.json','utf8')).map(({skapadAv,...rest}:any)=>rest);
  const definitions=JSON.parse(await readFile('data/ordbok/moderniserade-definitioner.json','utf8'));
  validateRelations(dictionary,corrections,definitions);
  validateArchive(GRAMMATIK,GRAMMATIK_DOKUMENT); validateArchive(TEXTER,TEXTER_DOKUMENT);
  const archive={grammatik:{tree:GRAMMATIK,documents:GRAMMATIK_DOKUMENT},texter:{tree:TEXTER,documents:TEXTER_DOKUMENT}};
  const runor={pilot:RUNIC_PILOT_INSCRIPTIONS.map(toPublicPublishedItem).filter(Boolean),batch1:RUNIC_COMBINED_CORPUS_50.map(toPublicPublishedItem).filter(Boolean)};
  const datasets:Record<string,unknown>={dictionary,corrections,definitions,archive,homepage:START_STANDARD,resources:medKallor({hyllor:[],skrifter:FASTA_SKRIFTER,harDatabas:false}),sources:KALLOR,runor};
  const stage=`${out}.partial-${process.pid}`;
  await mkdir(stage,{mode:0o700});
  try {
    await mkdir(path.join(stage,'data'),{mode:0o700});await mkdir(path.join(stage,'assets'),{mode:0o700});
    const files:any[]=[];
    const put=async(p:string,b:Buffer)=>{await writeFile(path.join(stage,p),b,{mode:0o600}); files.push({path:p,bytes:b.length,sha256:hash(b)});};
    for(const [name,data] of Object.entries(datasets)) await put(`data/${name}.json`,Buffer.from(stable(data)+'\n'));
    const assets=[];
    for(const source of sources.filter(s=>s.path.startsWith('public/'))) {
      const bytes=await readFile(source.path);
      if(hash(bytes)!==source.sha256) throw new Error('Asset changed during export');
      const ext=path.extname(source.path).replace(/[^.a-zA-Z0-9]/g,'');
      const target=`assets/${source.sha256}${ext}`;
      if(!files.some(f=>f.path===target)) await put(target,bytes);
      assets.push({originalPath:`/${source.path.slice(7)}`,path:target,sha256:source.sha256,bytes:source.bytes});
    }
    await put('data/assets.json',Buffer.from(stable(assets)+'\n'));
    const external=new Set<string>();
    function scan(v:unknown) {if(typeof v==='string') {for(const u of v.match(/https?:\/\/[^\s"'<>]+/g)??[]) external.add(u);} else if(Array.isArray(v)) v.forEach(scan); else if(v&&typeof v==='object') Object.values(v).forEach(scan);}
    Object.values(datasets).forEach(scan);
    await put('data/external-references.json',Buffer.from(stable([...external].sort())+'\n'));
    const after=await inventory(root,['data','lib','public','scripts/cloudflare','package.json','package-lock.json','tsconfig.json']);
    if(stable(after)!==stable(sources)) throw new Error('Sources changed during export; retry in fresh process');
    const manifest:any={schema:SCHEMA,audience:'private-prototype',publishable:false,sourceMode:'explicit-local-files',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceInventory:sources,counts:{dictionary:dictionary.length,corrections:corrections.length,definitions:definitions.length,grammarDocuments:Object.keys(GRAMMATIK_DOKUMENT).length,textDocuments:Object.keys(TEXTER_DOKUMENT).length,pilotRunes:runor.pilot.length,batch1Runes:runor.batch1.length,assets:assets.length},blockers:['Production source selection and DB parity unresolved','External asset bytes/rights not frozen','No production publication revision boundary verified'],files:files.sort((a,b)=>a.path<b.path?-1:1)};
    manifest.releaseId=`cf-${hash(stable(manifest)).slice(0,24)}`;
    await writeFile(path.join(stage,'manifest.json'),stable(manifest)+'\n',{mode:0o600});
    await verifyManifest(stage);
    // Output must be new: no overwrite of an existing valid release.
    await mkdir(out,{mode:0o700});
    await rename(stage,out); await chmod(out,0o700);
    console.log(JSON.stringify({releaseId:manifest.releaseId,counts:manifest.counts,publishable:false,output:out}));
  } catch(error) {await rm(stage,{recursive:true,force:true}); throw error;}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
