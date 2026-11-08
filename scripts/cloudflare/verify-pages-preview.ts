/** Verify the initial, isolated pages.dev upload without treating it as a production release. */
import {readFile,writeFile} from 'node:fs/promises';
import {getArticleOwner} from './routing';
async function main(){
const words=JSON.parse(await readFile('data/ordbok/poster.json','utf8')) as {id:string}[];
const evidence:{url:string;status:number;checks:string[]}[]=[];
async function probe(url:string,checks:string[]){
 const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
 const text=await response.text();
 if(response.status!==200)throw Error(`${url}: HTTP ${response.status}`);
 for(const marker of checks)if(!text.includes(marker))throw Error(`${url}: missing ${marker}`);
 if(response.headers.get('x-robots-tag')!=='noindex')throw Error(`${url}: missing preview noindex`);
 evidence.push({url,status:response.status,checks});
}
const main='https://fornsvenska-www.pages.dev';
for(const [route,checks] of [['/',['Fornsvenska']],['/ordbok',['ordbok']],['/admin',['Webbredaktion']],['/grammatik',['Grammatik']],['/ordbok/storage-bridge',['fornsvenska-ord-01.pages.dev']]] as [string,string[]][])await probe(main+route,checks);
for(let i=1;i<=7;i++){
 const group=`0${i}`;
 const word=words.find(w=>getArticleOwner(w.id).group===group)!;
 await probe(`https://fornsvenska-ord-${group}.pages.dev/ordbok/${encodeURIComponent(word.id)}`,['rel="canonical"','artikel-text','/assets/article-bookmarks.js']);
}
await writeFile('docs/drift/cloudflare/PAGES-UPLOAD-2026-11-01-verifiering.json',JSON.stringify({productionMigration:false,main,evidence},null,2)+'\n');
console.log(JSON.stringify({verified:evidence.length,main}));

}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
