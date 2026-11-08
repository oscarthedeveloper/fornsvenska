/** Real Pages deployments with recorded deployment IDs and compensating rollback on failure. */
import {execFileSync} from 'node:child_process';
import {writeFile,readFile} from 'node:fs/promises';
import {validateDistribution,projects} from './validate-distribution';
import {rest} from './editorial-job';
const projectName=(group:string)=>`fornsvenska-${group}`;
async function cf(endpoint:string,method='GET'){
 const token=process.env.CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID;
 if(!token||!account)throw Error('Cloudflare credentials missing');
 const r=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/${endpoint}`,{method,headers:{Authorization:`Bearer ${token}`}});
 const data=await r.json() as any;if(!r.ok||!data.success)throw Error(`Cloudflare API failed (${r.status})`);return data.result;
}
export async function deployAllProjects({dryRun=false}={}){
 const validation=await validateDistribution();
 if(dryRun){console.log(JSON.stringify({dryRun:true,validation,projects}));return;}
 const id=process.env.CF_RELEASE_JOB_ID;if(!id)throw Error('A claimed persistent job is required');
 const rows=await rest(`cf_release_jobs?id=eq.${id}&status=eq.running&select=id,git_sha`);
 if(rows.length!==1||rows[0].git_sha!==process.env.CF_RELEASE_GIT_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==rows[0].git_sha)throw Error('Publication job or source commit mismatch');
 const previous:Record<string,string>={},evidence:Record<string,any>={},touched:string[]=[];
 for(const group of projects){const p=await cf(projectName(group));if(p.production_branch!=='main')throw Error('Expected Pages production branch main');if(!p.canonical_deployment?.id)throw Error('Bootstrap a test deployment first: rollback baseline is required');previous[group]=p.canonical_deployment.id;}
 try{
  for(const group of projects){
   touched.push(group);
   execFileSync('npx',['--yes','wrangler@4.45.0','pages','deploy',`dist/${group}`,`--project-name=${projectName(group)}`,'--branch=main','--commit-dirty=true'],{stdio:'inherit'});
   const current=await cf(projectName(group));const deployed=current.canonical_deployment;
   if(!deployed?.id||deployed.id===previous[group])throw Error(`No new deployment confirmed for ${group}`);
   const probe=await fetch(`${deployed.url}/`,{redirect:'follow'});if(!probe.ok)throw Error(`Deployment probe failed for ${group}`);
   evidence[group]={deploymentId:deployed.id,previousDeploymentId:previous[group],url:deployed.url};
   await rest(`cf_release_jobs?id=eq.${id}`,{projects:evidence},'PATCH');
  }
  await rest('rpc/cf_finish_release',{p_id:id,p_status:'succeeded',p_projects:evidence,p_error:null});
  console.log(`Publication ${id} confirmed on all eight projects.`);
 }catch(e){
  const rollbackErrors:string[]=[];
  for(const group of touched.reverse())try{await cf(`${projectName(group)}/deployments/${previous[group]}/rollback`,'POST');}catch{rollbackErrors.push(group);}
  const error=`Publication failed. Rollback ${rollbackErrors.length?'requires attention: '+rollbackErrors.join(','):'confirmed for all touched projects'}.`;
  await rest('rpc/cf_finish_release',{p_id:id,p_status:'failed',p_projects:evidence,p_error:error});
  throw Error(error);
 }
}
if(process.argv[1]?.endsWith('deploy-pages.ts'))deployAllProjects({dryRun:process.argv.includes('--dry-run')}).catch(e=>{console.error(e.message);process.exitCode=1;});
