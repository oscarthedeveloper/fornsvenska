/** Trusted CI only. Claims one immutable job and keeps its contents outside public/Git. */
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
export async function rest(endpoint:string,body?:unknown,method?:string){
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw Error('Build credentials missing');
 const r=await fetch(`${url}/rest/v1/${endpoint}`,{method:method||(body?'POST':'GET'),headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body?JSON.stringify(body):undefined});
 if(!r.ok)throw Error(`Editorial store returned HTTP ${r.status}`);return r.status===204?null:r.json();
}
async function main(){
 const [action,id]=process.argv.slice(2);if(!/^[a-f0-9-]{36}$/.test(id||''))throw Error('A real publication job ID is required');
 if(action==='claim'){
  const rows=await rest(`cf_release_jobs?id=eq.${id}&status=eq.pending`,{status:'running'},'PATCH');
  if(rows.length!==1)throw Error('Job already claimed or unavailable');const job=rows[0];
  if(!/^[a-f0-9]{40}$/.test(job.git_sha))throw Error('Frozen source commit missing');
  const dir=path.join(os.tmpdir(),`fornsvenska-release-${id}`);await mkdir(dir,{mode:0o700});
  const snapshot=path.join(dir,'snapshot.json');await writeFile(snapshot,JSON.stringify(job.snapshot),{mode:0o600});
  if(process.env.GITHUB_ENV)await writeFile(process.env.GITHUB_ENV,`CF_RELEASE_SNAPSHOT=${snapshot}\nCF_RELEASE_JOB_ID=${id}\nCF_RELEASE_GIT_SHA=${job.git_sha}\n`,{flag:'a'});
  if(process.env.GITHUB_OUTPUT)await writeFile(process.env.GITHUB_OUTPUT,`git_sha=${job.git_sha}\n`,{flag:'a'});
  console.log(`Claimed publication job ${id}; content is stored privately.`);
 }else if(action==='fail'){
  await rest(`cf_release_jobs?id=eq.${id}&status=eq.running`,{status:'failed',error:'CI failed; inspect build logs and project deployment evidence.'},'PATCH');
 }else throw Error('Unsupported job action');
}
if(process.argv[1]?.endsWith('editorial-job.ts'))main().catch(e=>{console.error(e.message);process.exitCode=1;});
