import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {SCHEMA,hash,stable,validateRelations,validateArchive,verifyManifest} from '../scripts/cloudflare/snapshot-core.ts';

const word={id:'s--þing',headwordDisplay:'þing',sourceDataset:'soederwall',senses:[{text:'æ ø þ'}]};
test('snapshot rejects duplicate dictionary IDs and orphan editorial changes',()=>{
 assert.throws(()=>validateRelations([word,word],[],[]),/duplicate/);
 assert.throws(()=>validateRelations([word],[{id:'absent'}],[]),/Orphan/);
 assert.throws(()=>validateRelations([word],[],[{id:'absent'}]),/Orphan/);
});
test('historically public drafts remain reachable and missing documents block export',()=>{
 const tree=[{slug:'utkast',kind:'doc'}],docs={utkast:{titel:'æ ø þ',utkast:true}};
 validateArchive(tree,docs);
 assert.throws(()=>validateArchive(tree,{}),/Missing document/);
 assert.throws(()=>validateArchive([],docs),/Unreachable/);
});
test('manifest rejects damaged data, damaged assets and unknown extra files',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'cf-snapshot-test-'));
 try {
 await mkdir(path.join(dir,'data')); await mkdir(path.join(dir,'assets'));
 const datasets={dictionary:[word],corrections:[],definitions:[],archive:{grammatik:{tree:[],documents:{}},texter:{tree:[],documents:{}}}};
 const files=[];
 for(const [name,value] of Object.entries(datasets)) {
 const content=stable(value)+'\n',p=`data/${name}.json`;
 await writeFile(path.join(dir,p),content);files.push({path:p,bytes:Buffer.byteLength(content),sha256:hash(content)});
 }
 const asset='fake-image',p='assets/image.png';await writeFile(path.join(dir,p),asset);files.push({path:p,bytes:asset.length,sha256:hash(asset)});
 const m={schema:SCHEMA,audience:'private-prototype',publishable:false,files,counts:{dictionary:1}};
 m.releaseId=`cf-${hash(stable(m)).slice(0,24)}`;
 await writeFile(path.join(dir,'manifest.json'),stable(m));await verifyManifest(dir);
 await writeFile(path.join(dir,p),'different!'); await assert.rejects(verifyManifest(dir),/integrity/);
 await writeFile(path.join(dir,p),asset);
 await writeFile(path.join(dir,'data/dictionary.json'),'[]'); await assert.rejects(verifyManifest(dir),/integrity/);
 await writeFile(path.join(dir,'data/dictionary.json'),stable([word])+'\n');
 await writeFile(path.join(dir,'private.json'),'secret');await assert.rejects(verifyManifest(dir),/Unlisted/);
 } finally {await rm(dir,{recursive:true,force:true});}
});
