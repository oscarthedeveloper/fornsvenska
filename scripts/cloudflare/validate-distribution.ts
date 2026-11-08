import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {getArticleOwner} from './routing';
import {releaseMetadata} from './release-metadata';
export const projects=[...Array.from({length:7},(_,i)=>`ord-0${i+1}`),'www'];
export async function validateDistribution(root=path.resolve('dist')){
 const words=JSON.parse(await readFile('data/ordbok/poster.json','utf8')) as {id:string}[];
 const report:Record<string,{files:number;bytes:number}>={};
 for(const project of projects){
  let files=0,bytes=0;async function walk(dir:string){for(const item of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isSymbolicLink())throw Error('Symlink in distribution');if(item.isDirectory())await walk(p);else{const size=(await stat(p)).size;if(size>25*1024*1024)throw Error('Oversized asset');if(/\.(env|sql)$/.test(item.name))throw Error('Private file in distribution');files++;bytes+=size;}}}
  const meta=JSON.parse(await readFile(path.join(root,project,'release.json'),'utf8'));
  if(JSON.stringify(meta)!==JSON.stringify(releaseMetadata()))throw Error(`Mixed release versions: ${project}`);
  await walk(path.join(root,project));if(files>16000)throw Error(`File budget exceeded: ${project}`);report[project]={files,bytes};
 }
 for(const p of ['index.html','404.html','ordbok.html','admin.html','kontakt.html','ordbok/search-worker.js','ordbok/index-headwords.json','_worker.js','_routes.json'])await stat(path.join(root,'www',p));
 for(const word of words){const file=path.join(root,`ord-${getArticleOwner(word.id).group}`,'ordbok',`${word.id}.html`);const html=await readFile(file,'utf8');if(!html.includes('rel="canonical"')||!html.includes('<h1')||!html.includes('artikel-text'))throw Error(`Incomplete article: ${word.id}`);}
 return {articles:words.length,projects:report};
}
