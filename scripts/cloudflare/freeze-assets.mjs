/** Freeze explicitly listed public Storage references privately. No bucket crawling or credentials. */
import {readFile,writeFile,mkdir,rm,rename} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const digest=b=>createHash('sha256').update(b).digest('hex');
async function download(url) {
 const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});
 if(!r.ok||!r.body)throw Error(`Asset fetch failed: HTTP ${r.status}`);
 const chunks=[];let bytes=0;
 for await(const chunk of r.body) {bytes+=chunk.length;if(bytes>25*1024*1024)throw Error('Asset exceeds Pages file limit');chunks.push(chunk);}
 return Buffer.concat(chunks);
}
async function main() {
 const [plan,output,allowedOrigin]=process.argv.slice(2);
 if(!plan||!output||!allowedOrigin)throw Error('Usage: freeze-assets.mjs <private-url-plan.json> <new-private-output-dir> <allowed-https-origin>');
 const origin=new URL(allowedOrigin);
 if(origin.protocol!=='https:'||origin.origin!==allowedOrigin)throw Error('Expected exact HTTPS origin');
 const out=path.resolve(output),root=process.cwd();
 if(!path.isAbsolute(output)||out===root||out.startsWith(root+path.sep))throw Error('Output must be outside repository');
 const urls=JSON.parse(await readFile(plan,'utf8'));
 if(!Array.isArray(urls)||urls.length!==new Set(urls).size)throw Error('Invalid asset plan');
 for(const raw of urls) {const u=new URL(raw);if(u.origin!==allowedOrigin||u.username||u.password||u.search||u.hash||!u.pathname.startsWith('/storage/v1/object/public/'))throw Error('Only explicit public Storage URLs on the confirmed origin are allowed');}
 const stage=out+`.partial-${process.pid}`;await mkdir(stage,{mode:0o700});
 try {
 const assets=[];
 for(const url of urls) {
  const bytes=await download(url);const checksum=digest(bytes);
  if(checksum!==digest(await download(url)))throw Error('Remote asset changed during freeze');
  const filename=checksum;await writeFile(path.join(stage,filename),bytes,{mode:0o600});
  assets.push({url,path:filename,bytes:bytes.length,sha256:checksum});
 }
 await writeFile(path.join(stage,'manifest.json'),JSON.stringify({schemaVersion:1,audience:'private-evidence',observedAt:new Date().toISOString(),publishable:false,rightsVerified:false,assets},null,2)+'\n',{mode:0o600});
 await mkdir(out,{mode:0o700});await rename(stage,out);
 console.log(JSON.stringify({assets:assets.length,bytes:assets.reduce((s,a)=>s+a.bytes,0),publishable:false}));
 }catch(e){await rm(stage,{recursive:true,force:true});throw e;}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
