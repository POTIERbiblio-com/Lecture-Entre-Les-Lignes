/* Favoris et listes privés, isolés par utilisateur Supabase. */
(()=>{'use strict';
const URL='https://cezgcoaokwuobipwfffa.supabase.co',KEY='sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3';
const empty=()=>({favorites:[],boards:[]});let client,user,cache=empty(),ready=false,writing=Promise.resolve();
const listeners=new Set();
const normalize=x=>({favorites:Array.isArray(x?.favorites)?x.favorites.filter(v=>typeof v==='string'):[],boards:Array.isArray(x?.boards)?x.boards.filter(b=>b&&typeof b.id==='string'&&Array.isArray(b.books)).map(b=>({...b,books:b.books.filter(v=>typeof v==='string')})):[]});
const emit=()=>{for(const cb of listeners)cb(read());window.dispatchEvent(new Event('ell-lists-change'))};
const read=()=>normalize(cache);
async function init(){
 if(ready)return user;
 const m=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
 client=m.createClient(URL,KEY);const {data,error}=await client.auth.getUser();
 if(error||!data.user){user=null;cache=empty();ready=true;emit();return null}
 user=data.user;const {data:row,error:loadError}=await client.from('user_reading_collections').select('data').eq('user_id',user.id).maybeSingle();
 if(loadError)throw loadError;
 cache=normalize(row?.data);ready=true;emit();
 client.auth.onAuthStateChange((_event,session)=>{if(session?.user?.id!==user?.id){user=null;cache=empty();ready=false;emit();init().catch(console.error)}});
 return user;
}
async function save(next){
 await init();if(!user)throw Error('Connecte-toi pour enregistrer tes favoris et listes.');
 const previous=cache;cache=normalize(next);emit();
 const snapshot=JSON.stringify(cache);
 const task=writing.catch(()=>{}).then(async()=>{
  const {error}=await client.from('user_reading_collections').upsert({user_id:user.id,data:JSON.parse(snapshot),updated_at:new Date().toISOString()},{onConflict:'user_id'});
  if(error)throw error;
 });
 writing=task;
 try{await task}catch(e){cache=previous;emit();throw e}
}
window.ELLCollections={init,read,save,onChange(fn){listeners.add(fn);return()=>listeners.delete(fn)},get user(){return user}};
})();
