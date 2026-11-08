import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {PGlite} from '@electric-sql/pglite';
import {pagesWorker as worker} from '../lib/cloudflare/worker.ts';
const admin='11111111-1111-4111-8111-111111111111';
const stranger='22222222-2222-4222-8222-222222222222';
async function setup(db){await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('role',current_setting('request.jwt.claim.role',true))$$;
grant usage on schema auth to anon,authenticated,service_role;
create table public.admins(user_id uuid primary key);insert into public.admins values('${admin}');
alter table public.admins enable row level security;
create policy own_admin on public.admins for select to authenticated using(user_id=auth.uid());grant select on public.admins to authenticated;`);
await db.exec(await readFile('supabase/cloudflare-editorial.sql','utf8'));}
async function login(db,id=admin,role='authenticated'){await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)",[id,role]);await db.exec(`set role ${role}`);}
async function save(db,title,revision=0){return db.query("select public.cf_save_document('startsida','start','Startsida',$1::jsonb,$2,true) as data",[JSON.stringify({rubrik:title}),revision]);}

test('editorial RPC persists across restart, rejects non-admin/stale saves and freezes queued content',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'cf-persistent-'));const target=path.join(directory,'pg');let db=new PGlite(target);
 try{
 await setup(db);await login(db,stranger);await assert.rejects(save(db,'unauthorized'),/Administrator/);
 await login(db);await save(db,'First',0);await assert.rejects(save(db,'stale',0),/conflict/);
 const j=await db.query("select public.cf_request_release('same-job') as data");const id=j.rows[0].data.id;
 await save(db,'Second',1);
 const repeated=await db.query("select public.cf_request_release('same-job') as data");assert.equal(repeated.rows[0].data.id,id);
 await db.close();db=new PGlite(target);await login(db);
 const docs=await db.query('select content,revision,published_content from public.cf_documents');assert.equal(docs.rows[0].content.rubrik,'Second');assert.equal(docs.rows[0].revision,2);assert.equal(docs.rows[0].published_content,null);
 const jobs=await db.query('select snapshot,status from public.cf_release_jobs');assert.equal(jobs.rows[0].snapshot[0].content.rubrik,'First');assert.equal(jobs.rows[0].status,'pending');
 await assert.rejects(db.query("update public.cf_release_jobs set status='succeeded'"),/permission denied/);
 await db.exec('reset role');await login(db,stranger);assert.equal((await db.query('select * from public.cf_documents')).rows.length,0);
 }finally{await db.close();await rm(directory,{recursive:true,force:true});}
});

test('contact quota is persistent and cannot be called by anonymous/authenticated users',async()=>{
 const db=new PGlite();try{await setup(db);await login(db);await assert.rejects(db.query("select public.cf_reserve_contact(repeat('a',64))"),/permission denied/);await db.exec('reset role');await login(db,admin,'service_role');
 for(let i=0;i<5;i++)assert.equal((await db.query("select public.cf_reserve_contact(repeat('a',64)) as allowed")).rows[0].allowed,true);
 assert.equal((await db.query("select public.cf_reserve_contact(repeat('a',64)) as allowed")).rows[0].allowed,false);
 }finally{await db.close();}
});

test('Pages API never reports a mock publication/send and ordinary reading bypasses the worker APIs',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('static')}};
 assert.equal(await (await worker.fetch(new Request('https://www.fornsvenska.se/grammatik'),env)).text(),'static');
 for(const endpoint of ['kontakt','publicera']){
 const request=new Request(`https://www.fornsvenska.se/api/${endpoint}`,{method:'POST',headers:{Origin:'https://www.fornsvenska.se','Content-Type':'application/json'},body:'{}'});
 const response=await worker.fetch(request,env);assert.equal(response.status,503);assert.equal((await response.json()).ok,undefined);
 }
 const foreign=new Request('https://www.fornsvenska.se/api/publicera',{method:'POST',headers:{Origin:'https://evil.invalid'},body:'{}'});assert.equal((await worker.fetch(foreign,env)).status,403);
 const huge=new Request('https://www.fornsvenska.se/api/kontakt',{method:'POST',headers:{Origin:'https://www.fornsvenska.se'},body:'x'.repeat(32769)});assert.equal((await worker.fetch(huge,env)).status,413);
});

test('publication broker validates identity and queues a real GitHub job only once',async()=>{
 const original=globalThis.fetch;let dispatches=0,exists=false;
 globalThis.fetch=async(input,options={})=>{
  const url=String(input);
  if(url.endsWith('/auth/v1/user'))return Response.json({id:admin});
  if(url.includes('/admins?'))return Response.json([{user_id:admin}]);
  if(url.includes('/commits/'))return Response.json({sha:'a'.repeat(40)});
  if(url.endsWith('/rpc/cf_request_release')){const created=!exists;exists=true;return Response.json({id:admin,status:'pending',created});}
  if(url.includes('/cf_release_jobs?'))return Response.json([{id:admin}]);
  if(url.endsWith('/dispatches')){dispatches++;return new Response(null,{status:204});}
  throw Error('Unexpected network request');
 };
 try{
 const env={ASSETS:{fetch:async()=>new Response('static')},SUPABASE_URL:'https://project.supabase.co',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'server-secret',GITHUB_TOKEN:'github-secret',GITHUB_REPOSITORY:'owner/repo'};
 const request=()=>new Request('https://www.fornsvenska.se/api/publicera',{method:'POST',headers:{Origin:'https://www.fornsvenska.se',Authorization:'Bearer user-token','Content-Type':'application/json'},body:JSON.stringify({idempotencyKey:'stable-id'})});
 const first=await worker.fetch(request(),env);assert.equal(first.status,202);assert.equal((await first.json()).status,'pending');
 const second=await worker.fetch(request(),env);assert.equal(second.status,202);assert.equal(dispatches,1);
 }finally{globalThis.fetch=original;}
});

test('runic API on Pages preserves query, version and OPTIONS behavior from frozen assets',async()=>{
 const corpus=JSON.parse(await readFile('public/api/runor/v1/versions/2026.1-pilot.json','utf8'));
 const env={ASSETS:{fetch:async()=>Response.json(corpus)}};
 const r=await worker.fetch(new Request('https://www.fornsvenska.se/api/runor/v1?q=Karlevi'),env);assert.equal(r.status,200);assert.equal((await r.json()).totalPublished,1);
 const options=await worker.fetch(new Request('https://www.fornsvenska.se/api/runor/v1',{method:'OPTIONS'}),env);assert.equal(options.status,204);assert.equal(options.headers.get('Access-Control-Allow-Origin'),'*');
 const missing=await worker.fetch(new Request('https://www.fornsvenska.se/api/runor/v1/unknown'),env);assert.equal(missing.status,404);
});

test('the real storage bridge preserves notes, broadcasts changes and refuses to overwrite corrupt storage',async()=>{
 const {runInNewContext}=await import('node:vm');
 const html=await readFile('public/ordbok/storage-bridge.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const listeners={},data=new Map(),responses=[];const source={postMessage:(msg)=>responses.push(msg)};
 const localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const window={localStorage,addEventListener:(type,handler)=>{listeners[type]=handler;}};
 runInNewContext(script,{window,Date,JSON,Array,Map,String,isNaN,console});
 const send=(action,payload)=>listeners.message({origin:'https://ord-03.fornsvenska.se',source,data:{channel:'fornsvenska:ordlista-v1',requestId:Math.random().toString(),action,payload}});
 const post={id:'soederwall--kirkia-nn.1',headwordDisplay:'kirkia',sourceDataset:'soederwall',anteckning:'My study note'};
 send('SAVE',{post});send('SAVE',{post:{...post,anteckning:undefined}});
 assert.equal(JSON.parse(data.get('fornsvenska_sparade_ord_v1'))[0].anteckning,'My study note');
 assert.ok(responses.some(r=>r.event==='CHANGED'));
 data.set('fornsvenska_sparade_ord_v1','broken-json');send('SAVE',{post});
 assert.equal(data.get('fornsvenska_sparade_ord_v1'),'broken-json');assert.equal(responses.at(-1).success,false);
});

test('contact verifies exact root/www hostnames, reserves quota and reports delivery failures',async()=>{
 const original=globalThis.fetch;let hostname='fornsvenska.se',quota=true,delivery=true,sends=0;
 globalThis.fetch=async(input,options={})=>{
  const url=String(input);
  if(url.includes('/turnstile/v0/siteverify'))return Response.json({success:true,hostname,action:'contact'});
  if(url.endsWith('/rpc/cf_reserve_contact'))return Response.json(quota);
  if(url==='https://api.resend.com/emails'){
   sends++;const body=JSON.parse(options.body);assert.equal(body.reply_to,'visitor@example.org');assert.deepEqual(body.to,['editor@example.org']);
   return delivery?Response.json({id:'delivered'}):Response.json({message:'provider rejected'},{status:403});
  }
  throw Error('Unexpected network request');
 };
 try{
  const env={ASSETS:{fetch:async()=>new Response('static')},SUPABASE_URL:'https://project.supabase.co',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'server',RESEND_API_KEY:'resend',RESEND_FROM_EMAIL:'Contact <contact@example.org>',KONTAKT_MOTTAGARE_EPOST:'editor@example.org',TURNSTILE_SECRET_KEY:'secret',TURNSTILE_HOSTNAME:'fornsvenska.se,www.fornsvenska.se',CONTACT_IP_SALT:'salt'};
  const request=(host='fornsvenska.se')=>new Request('https://'+host+'/api/kontakt',{method:'POST',headers:{Origin:'https://'+host,'CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json'},body:JSON.stringify({epost:'visitor@example.org',meddelande:'Test message',turnstileToken:'token'})});
  assert.equal((await worker.fetch(request(),env)).status,200);
  hostname='www.fornsvenska.se';assert.equal((await worker.fetch(request(hostname),env)).status,200);
  hostname='evilfornsvenska.se';assert.equal((await worker.fetch(request(),env)).status,400);assert.equal(sends,2);
  hostname='fornsvenska.se';quota=false;assert.equal((await worker.fetch(request(),env)).status,429);assert.equal(sends,2);
  quota=true;delivery=false;const failed=await worker.fetch(request(),env);assert.equal(failed.status,502);assert.equal((await failed.json()).ok,undefined);
 }finally{globalThis.fetch=original;}
});
