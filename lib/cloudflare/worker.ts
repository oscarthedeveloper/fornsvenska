import { inscriptionsToGeoJson } from '../runor/geojson';
import { getRunicCacheHeaders, isValidDatasetVersion, CURRENT_RUNIC_DATASET_VERSION } from '../runor/cache-control';
/** Only API routes invoke this Worker; ordinary reading goes straight to Pages assets. */
export interface Env {
 ASSETS:{fetch(request:Request):Promise<Response>};
 SUPABASE_URL?:string; SUPABASE_ANON_KEY?:string; SUPABASE_SERVICE_ROLE_KEY?:string;
 GITHUB_TOKEN?:string; GITHUB_REPOSITORY?:string; RELEASE_GIT_REF?:string;
 RESEND_API_KEY?:string; RESEND_FROM_EMAIL?:string; KONTAKT_MOTTAGARE_EPOST?:string;
 TURNSTILE_SECRET_KEY?:string; TURNSTILE_HOSTNAME?:string; CONTACT_IP_SALT?:string;
}
class ApiError extends Error { constructor(message:string,public status:number){super(message);} }
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
async function db(env:Env,path:string,token:string,body?:unknown,method?:string){
 const r=await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`,{method:method||(body?'POST':'GET'),headers:{apikey:env.SUPABASE_ANON_KEY!,Authorization:`Bearer ${token}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
 if(!r.ok){
  const failure=await r.json().catch(()=>({})) as {code?:string;message?:string};
  if(failure.code==='42501')throw new ApiError('Administratörsbehörighet krävs.',403);
  if(failure.message?.includes('Monthly publication quota'))throw new ApiError('Månadens publiceringskvot är förbrukad.',429);
  if(failure.message?.includes('already queued'))throw new ApiError('Ett publiceringsjobb pågår redan.',409);
  if(failure.message?.includes('No approved changes'))throw new ApiError('Det finns inga godkända ändringar att publicera.',409);
  throw new ApiError('Redaktionslagret är inte tillgängligt.',503);
 }return r.status===204?null:r.json();
}
async function publish(request:Request,env:Env){
 if(!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY||!env.SUPABASE_SERVICE_ROLE_KEY||!env.GITHUB_TOKEN||!env.GITHUB_REPOSITORY)return json({error:'Publiceringstjänsten är inte konfigurerad.'},503);
 const token=request.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1];if(!token)return json({error:'Inloggning krävs.'},401);
 const auth=await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{apikey:env.SUPABASE_ANON_KEY,Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)});
 if(!auth.ok)return json({error:'Sessionen är inte giltig.'},401);
 const user=await auth.json() as {id:string};
 const admins=await db(env,`admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,token);
 if(!admins.length)return json({error:'Administratörsbehörighet krävs.'},403);
 const input=await request.json() as {idempotencyKey?:string};if(!input.idempotencyKey||input.idempotencyKey.length>200)return json({error:'Ogiltig jobbnyckel.'},400);
 const ghHeaders={Authorization:`Bearer ${env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','Content-Type':'application/json','User-Agent':'fornsvenska-publisher'};
 const commit=await fetch(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/commits/${encodeURIComponent(env.RELEASE_GIT_REF||'main')}`,{headers:ghHeaders});
 if(!commit.ok)return json({error:'Kunde inte fastställa byggversionen.'},502);
 const {sha}=await commit.json() as {sha:string};
 const job=await db(env,'rpc/cf_request_release',token,{p_key:input.idempotencyKey}) as {id:string;status:string;created:boolean};
 if(!job.created)return json({jobId:job.id,status:job.status},202);
 try {
  await db(env,`cf_release_jobs?id=eq.${job.id}&status=eq.pending`,env.SUPABASE_SERVICE_ROLE_KEY,{git_sha:sha},'PATCH');
  const dispatch=await fetch(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/actions/workflows/deploy-cloudflare.yml/dispatches`,{method:'POST',headers:ghHeaders,body:JSON.stringify({ref:env.RELEASE_GIT_REF||'main',inputs:{job_id:job.id}})});
  if(!dispatch.ok)throw Error('Byggtjänsten avvisade begäran.');
  return json({jobId:job.id,status:'pending'},202);
 }catch{
  await db(env,`cf_release_jobs?id=eq.${job.id}&status=eq.pending`,env.SUPABASE_SERVICE_ROLE_KEY,{status:'failed',error:'Byggbegäran kunde inte bekräftas. Kontrollera CI före nytt försök.'},'PATCH');
  return json({error:'Byggbegäran kunde inte bekräftas.',jobId:job.id},502);
 }
}
async function contact(request:Request,env:Env){
 if(!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_HOSTNAME||!env.RESEND_API_KEY||!env.RESEND_FROM_EMAIL||!env.KONTAKT_MOTTAGARE_EPOST||!env.SUPABASE_SERVICE_ROLE_KEY||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY||!env.CONTACT_IP_SALT)return json({error:'Kontaktfunktionen är inte konfigurerad.'},503);
 const d=await request.json() as Record<string,unknown>;
 if(d['bot-field'])return json({error:'Formuläret kunde inte verifieras.'},400);
 const email=typeof d.epost==='string'?d.epost.trim():'';const text=typeof d.meddelande==='string'?d.meddelande.trim():'';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>150||!text||text.length>5000||typeof d.turnstileToken!=='string')return json({error:'Kontrollera e-post, meddelande och spamskydd.'},400);
 const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:d.turnstileToken,remoteip:request.headers.get('CF-Connecting-IP')||''})});
 const proof=await verify.json() as {success:boolean;hostname:string;action:string};
 if(!proof.success||!env.TURNSTILE_HOSTNAME.split(',').map(h=>h.trim()).includes(proof.hostname)||proof.action!=='contact')return json({error:'Spamskyddet kunde inte verifieras.'},400);
 const ip=request.headers.get('CF-Connecting-IP');if(!ip)return json({error:'Kontaktfunktionen saknar nätverksverifiering.'},503);
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.CONTACT_IP_SALT+':'+ip));const ipHash=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
 const allowed=await db(env,'rpc/cf_reserve_contact',env.SUPABASE_SERVICE_ROLE_KEY,{p_ip_hash:ipHash});
 if(!allowed)return json({error:'Kontaktkvoten är förbrukad. Försök senare.'},429);
 const subject=typeof d.amne==='string'?d.amne.slice(0,200):'';const name=typeof d.namn==='string'?d.namn.slice(0,100):'';
 const send=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.RESEND_FROM_EMAIL,to:[env.KONTAKT_MOTTAGARE_EPOST],reply_to:email,subject:`[Fornsvenska.se] ${subject||'Kontakt'}`,text:`Från: ${name}\n${email}\n\n${text}`})});
 if(!send.ok)return json({error:'Meddelandet kunde inte levereras.'},502);
 return json({ok:true});
}
async function runicApi(request:Request,env:Env){
 const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization, X-Dataset-Version'};
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='GET')return new Response(null,{status:405,headers:cors});
 const url=new URL(request.url),sp=url.searchParams,asked=sp.get('version');
 const version=isValidDatasetVersion(asked)?asked:CURRENT_RUNIC_DATASET_VERSION;
 const r=await env.ASSETS.fetch(new Request(new URL(`/api/runor/v1/versions/${version}.json`,url)));
 if(!r.ok)return Response.json({error:'Utgåvan är inte tillgänglig.'},{status:503,headers:cors});
 const corpus=await r.json() as any;
 const slug=decodeURIComponent(url.pathname.replace(/\/$/,'').slice('/api/runor/v1'.length+1));
 const headers={...cors,...getRunicCacheHeaders(version)};
 if(slug){const item=corpus.inscriptions.find((i:any)=>i.canonicalSlug===slug||i.canonicalSignum.toLowerCase()===slug.toLowerCase());return Response.json(item?{version:'1.0.0',datasetVersion:version,apiEndpoint:url.pathname,license:corpus.license,attribution:corpus.attribution,generatedAt:corpus.generatedAt,inscription:item}:{error:'Inskriften finns inte.'},{status:item?200:404,headers});}
 let items=corpus.inscriptions as any[];
 if(sp.get('format')==='geojson')return Response.json(inscriptionsToGeoJson(items as any,sp.get('placement')==='nuvarande_plats'?'nuvarande_plats':'fyndplats'),{headers:{...headers,'Content-Type':'application/geo+json; charset=utf-8'}});
 const province=sp.get('province'),carrier=sp.get('carrier'),q=sp.get('q')?.trim().toLowerCase();
 if(province&&province!=='all')items=items.filter(i=>i.provinceCode===province);
 if(carrier&&carrier!=='all')items=items.filter(i=>i.carrier.type===carrier);
 if(q)items=items.filter(i=>[i.canonicalSignum,i.name,...i.aliases,i.textLayer.translationSwedish,...i.placements.flatMap((p:any)=>[p.parish,p.province])].some(v=>typeof v==='string'&&v.toLowerCase().includes(q)));
 return Response.json({...corpus,inscriptions:items,totalPublished:items.length,datasetVersion:version},{headers});
}
export const pagesWorker = {
 async fetch(request:Request,env:Env):Promise<Response>{
  const url=new URL(request.url);
  if(/^\/api\/runor\/v1(?:\/[^/.]+)?\/?$/.test(url.pathname))return runicApi(request,env);
  if(!['/api/kontakt','/api/publicera'].includes(url.pathname))return env.ASSETS.fetch(request);
  if(request.method!=='POST')return json({error:'Metoden stöds inte.'},405);
  if(request.headers.get('Origin')!==url.origin)return json({error:'Otillåten origin.'},403);
  if(Number(request.headers.get('Content-Length')||0)>32768)return json({error:'För stor begäran.'},413);
  // Enforce the limit even for chunked bodies without Content-Length.
  let size=0;const chunks:Uint8Array[]=[];if(!request.body)return json({error:'Tom begäran.'},400);
  for await(const chunk of request.body as any){size+=chunk.byteLength;if(size>32768)return json({error:'För stor begäran.'},413);chunks.push(chunk);}
  const body=new Uint8Array(size);let offset=0;for(const c of chunks){body.set(c,offset);offset+=c.length;}
  const bounded=new Request(request.url,{method:'POST',headers:request.headers,body});
  try{return url.pathname==='/api/publicera'?await publish(bounded,env):await contact(bounded,env);}catch(error){return json({error:error instanceof ApiError?error.message:error instanceof SyntaxError?'Ogiltig JSON-begäran.':'Tjänsten kunde inte slutföra begäran.'},error instanceof ApiError?error.status:error instanceof SyntaxError?400:503);}
 }
};

export default pagesWorker;
