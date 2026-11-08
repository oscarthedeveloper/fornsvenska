"use client";
import {useEffect,useState} from 'react';
import {skapaKlient} from '@/lib/supabase/client';
import {HAR_SUPABASE,anvandarnamnTillEpost} from '@/lib/supabase/config';
const domains=['startsida','trad_och_block','texter','resurser','ordbok','runor'];
type Doc={domain:string;id:string;title:string;content:unknown;revision:number;approved:boolean};
export default function StaticEditorialApp(){
 const [ready,setReady]=useState(false),[message,setMessage]=useState(''),[user,setUser]=useState(''),[password,setPassword]=useState('');
 const [docs,setDocs]=useState<Doc[]>([]),[jobs,setJobs]=useState<any[]>([]),[selected,setSelected]=useState<Doc>({domain:'startsida',id:'start',title:'Startsida',content:{},revision:0,approved:false});
 const [text,setText]=useState('{}'),[busy,setBusy]=useState(false);
 async function load(){
  if(!HAR_SUPABASE){setMessage('Redaktionen är inte konfigurerad.');return;}
  const db=skapaKlient(); const {data:{user}}=await db.auth.getUser();
  if(!user){setReady(false);return;}
  const admin=await db.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();
  if(admin.error||!admin.data){setMessage('Administratörsbehörighet krävs.');setReady(false);return;}
  const all:Doc[]=[];
  for(let offset=0;;offset+=500){
    const page=await db.from('cf_documents').select('*').order('domain').order('id').range(offset,offset+499);
    if(page.error)throw page.error;
    all.push(...page.data);
    if(page.data.length<500)break;
  }
  const d={data:all,error:null};
  const j=await db.from('cf_release_jobs').select('id,status,error,created_at').order('created_at',{ascending:false}).limit(10);
  if(d.error||j.error){setMessage('Det beständiga redaktionslagret är inte tillgängligt. Inget visas som sparat.');return;}
  setDocs(d.data);setJobs(j.data);setReady(true);
 }
 useEffect(()=>{load().catch(()=>setMessage('Redaktionen kunde inte läsas.'));},[]);
 async function save(){setBusy(true);try{
  const content=JSON.parse(text);
  const {data,error}=await skapaKlient().rpc('cf_save_document',{p_domain:selected.domain,p_id:selected.id,p_title:selected.title,p_content:content,p_expected_revision:selected.revision,p_approved:selected.approved});
  if(error)throw Error(error.code==='40001'?'Posten har ändrats i en annan flik. Ladda om innan du sparar.':error.message);
  setSelected({...selected,content,revision:data.revision});setMessage(`Sparat som revision ${data.revision}. Ännu inte publicerat.`);await load();
 }catch(e){setMessage(e instanceof Error?e.message:'Sparning misslyckades.');}finally{setBusy(false);}}
 async function publish(){setBusy(true);try{
  const {data:{session}}=await skapaKlient().auth.getSession();if(!session)throw Error('Logga in igen.');
  const r=await fetch('/api/publicera',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({idempotencyKey:crypto.randomUUID()})});
  const d=await r.json();if(!r.ok)throw Error(d.error||'Publicering kunde inte startas.');
  setMessage(`Publiceringsjobb ${d.jobId} är köat. Följ status nedan; innehållet är inte publicerat ännu.`);await load();
 }catch(e){setMessage(e instanceof Error?e.message:'Publicering misslyckades.');}finally{setBusy(false);}}
 return <section className="max-w-4xl mx-auto p-6 flex flex-col gap-4"><h1 className="display text-3xl">Webbredaktion</h1>
 <p role="status">{message}</p>{!ready?<form className="flex flex-col gap-3" onSubmit={async e=>{e.preventDefault();if(!HAR_SUPABASE)return;setBusy(true);try{const r=await skapaKlient().auth.signInWithPassword({email:anvandarnamnTillEpost(user),password});if(r.error)throw r.error;setPassword('');await load();}catch{setMessage('Inloggningen misslyckades.');}finally{setBusy(false);}}}>
 <label>Användarnamn<input className="border p-2 block" autoComplete="username" value={user} onChange={e=>setUser(e.target.value)}/></label><label>Lösenord<input className="border p-2 block" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy||!HAR_SUPABASE}>Logga in</button></form>:<>
 <p>Välj en befintlig post. JSON-redigeringen bevarar hela dokumentets struktur. Sparning och publicering är separata steg.</p>
 <select aria-label="Välj innehåll" onChange={e=>{const d=docs[Number(e.target.value)];if(d){setSelected(d);setText(JSON.stringify(d.content,null,2));}}}><option value="">Välj post</option>{docs.map((d,i)=><option key={d.domain+':'+d.id} value={i}>{d.domain}: {d.title} (rev {d.revision})</option>)}</select>
 <label>Innehållstyp<select value={selected.domain} onChange={e=>setSelected({...selected,domain:e.target.value,revision:0})}>{domains.map(d=><option key={d}>{d}</option>)}</select></label>
 <label>ID<input className="border p-2 block w-full" value={selected.id} onChange={e=>setSelected({...selected,id:e.target.value,revision:0})}/></label>
 <label>Titel<input className="border p-2 block w-full" value={selected.title} onChange={e=>setSelected({...selected,title:e.target.value})}/></label>
 <label>Dokumentinnehåll<textarea className="border p-2 w-full font-mono" rows={18} value={text} onChange={e=>setText(e.target.value)}/></label>
 <label><input type="checkbox" checked={selected.approved} onChange={e=>setSelected({...selected,approved:e.target.checked})}/> Godkänd för nästa publicering</label>
 <button disabled={busy} onClick={save}>Spara revision</button><button disabled={busy} onClick={publish}>Begär publicering</button><button disabled={busy} onClick={()=>load()}>Uppdatera status</button>
 <ul>{jobs.map(j=><li key={j.id}>{j.id}: {j.status}{j.error?` – ${j.error}`:''}</li>)}</ul>
 <button onClick={async()=>{await skapaKlient().auth.signOut();setReady(false);setDocs([]);setJobs([]);}}>Logga ut</button></>}
 </section>;
}
