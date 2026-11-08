"use server";
/** Next development host adapter. Pages uses the same authenticated Postgres RPCs directly. */
import {hamtaSession} from '@/lib/session';
import {skapaServerKlient} from '@/lib/supabase/server';
import {HAR_SUPABASE} from '@/lib/supabase/config';
import type {EditorialDomain,EditorialDraftRecord,EditorialOverview,SaveDraftOptions,SaveDraftResult,RollbackResult} from './types';
async function client(){
 if(!HAR_SUPABASE||(await hamtaSession()).arAdmin!==true)throw Error('Administratörsinloggning krävs.');
 return skapaServerKlient();
}
function map(r:any):EditorialDraftRecord{return {domain:r.domain,id:r.id,title:r.title,content:r.content,draftRevision:r.revision,publishedRevision:r.published_revision,dirty:r.revision!==r.published_revision,status:r.approved?'godkand_for_publicering':'utkast',savedBy:'',savedAt:r.updated_at,publishedContent:r.published_content};}
export async function hamtaUtkastListaAction(domain?:EditorialDomain){
 try{const db=await client();let q=db.from('cf_documents').select('*').order('id');if(domain)q=q.eq('domain',domain);const r=await q;if(r.error)throw r.error;return {ok:true,drafts:r.data.map(map),httpStatus:200};}
 catch{return {ok:false,drafts:[] as EditorialDraftRecord[],error:'Redaktionslagret kunde inte läsas.',httpStatus:503};}
}
export async function sparaUtkastAction<T>(p:Omit<SaveDraftOptions<T>,'actor'>):Promise<SaveDraftResult<T>>{
 try{const db=await client();const r=await db.rpc('cf_save_document',{p_domain:p.domain,p_id:p.id,p_title:p.title,p_content:p.content,p_expected_revision:p.expectedRevision??0,p_approved:p.status==='godkand_for_publicering'});if(r.error)return {ok:false,httpStatus:r.error.code==='40001'?409:403,error:r.error.message,conflict:r.error.code==='40001'};return {ok:true,httpStatus:200};}
 catch{return {ok:false,httpStatus:503,error:'Ingen ändring har bekräftats sparad.'};}
}
export async function aterstallUtkastAction<T>(p:{domain:EditorialDomain;id:string;targetRevision:number;reason:string}):Promise<RollbackResult<T>>{
 try{const db=await client();const [rev,current]=await Promise.all([db.from('cf_revisions').select('content').eq('domain',p.domain).eq('id',p.id).eq('revision',p.targetRevision).single(),db.from('cf_documents').select('title,revision').eq('domain',p.domain).eq('id',p.id).single()]);if(rev.error||current.error)throw Error('Revision saknas');return sparaUtkastAction({domain:p.domain,id:p.id,title:current.data.title,content:rev.data.content,expectedRevision:current.data.revision});}
 catch{return {ok:false,httpStatus:503,error:'Återställning kunde inte bekräftas.'};}
}
export async function hamtaRedaktionsOversiktAction():Promise<{ok:boolean;overview?:EditorialOverview;error?:string}>{
 const list=await hamtaUtkastListaAction();if(!list.ok)return {ok:false,error:list.error};
 const domains={} as EditorialOverview['domains'];
 for(const domain of ['startsida','trad_och_block','texter','resurser','ordbok','runor'] as EditorialDomain[]){const rows=list.drafts.filter(r=>r.domain===domain);domains[domain]={domain,domainName:domain,totalCount:rows.length,unpublishedCount:rows.filter(r=>r.dirty).length,draftRevisionsCount:rows.reduce((s,r)=>s+r.draftRevision,0),lastUpdated:rows.map(r=>r.savedAt).sort().at(-1)||null};}
 const db=await client();const latest=await db.from('cf_release_jobs').select('id').eq('status','succeeded').order('completed_at',{ascending:false}).limit(1);
 const month=new Date();month.setUTCDate(1);month.setUTCHours(0,0,0,0);
 const count=await db.from('cf_release_jobs').select('id',{count:'exact',head:true}).gte('created_at',month.toISOString());
 if(count.error)return {ok:false,error:'Publiceringskvoten kunde inte läsas.'};
 return {ok:true,overview:{domains,totalUnpublishedCount:list.drafts.filter(r=>r.dirty).length,activeReleaseId:latest.data?.[0]?.id||'Ej publicerad',monthlyBuildCount:count.count??0,monthlyBuildQuota:28}};
}
export async function begarPubliceringAction(_key?:string):Promise<{ok:boolean;httpStatus:number;error?:string;activeReleaseId?:string;publishedCount?:number}>{return {ok:false,httpStatus:503,error:'Begär publicering i den statiska webbredaktionen. Ingen release har aktiverats.'};}
