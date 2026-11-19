(()=>{
'use strict';
const empty=()=>({favorites:[],boards:[]});
const normalize=data=>({
 favorites:[...new Set(Array.isArray(data?.favorites)?data.favorites.filter(id=>typeof id==='string'):[])],
 boards:Array.isArray(data?.boards)?data.boards.filter(b=>b&&typeof b.id==='string'&&Array.isArray(b.books)).map(b=>({...b,books:[...new Set(b.books.filter(id=>typeof id==='string'))]})):[]
});
let cache=empty(),owner=null,loaded=null,queue=Promise.resolve();
const listeners=new Set();
const read=()=>normalize(cache);
const service=import('./request-service.js');
function emit(){
 for(const fn of listeners)fn(read());
 dispatchEvent(new Event('ell-lists-change'));
}
const observing=service.then(({onAccount})=>onAccount(account=>{
 if((account?.uid??null)===owner)return;
 owner=account?.uid??null;
 loaded=null;
 cache=empty();
 emit();
 if(account)init().catch(console.error);
}));
async function init(){
 const {auth,requestService}=await service;
 await observing;
 await auth.authStateReady();
 const account=auth.currentUser;
 if(!account)return null;
 if(account.uid!==owner){owner=account.uid;loaded=null;cache=empty();emit();}
 if(!loaded){
  const pending=requestService('read',{kind:'collections'},account).then(result=>{
   if(auth.currentUser?.uid!==account.uid||owner!==account.uid)throw Error('Le compte a changé.');
   cache=normalize(result.data);
   emit();
  }).catch(error=>{if(loaded===pending)loaded=null;throw error;});
  loaded=pending;
 }
 await loaded;
 if(auth.currentUser?.uid!==account.uid)throw Error('Le compte a changé.');
 return {id:account.uid,email:account.email};
}
async function change(update){
 const {auth,requestService}=await service;
 await auth.authStateReady();
 const account=auth.currentUser;
 if(!account)throw Error('Connecte-toi pour enregistrer tes collections.');
 const next=queue.catch(()=>{}).then(async()=>{
  if(auth.currentUser?.uid!==account.uid)throw Error('Le compte a changé.');
  await init();
  if(auth.currentUser?.uid!==account.uid)throw Error('Le compte a changé.');
  const previous=read();
  const updated=read();
  const replacement=update(updated);
  cache=normalize(replacement??updated);
  emit();
  try{await requestService('write',{kind:'collections',data:read()},account);}
  catch(error){
   if(owner===account.uid&&auth.currentUser?.uid===account.uid){cache=previous;emit();}
   throw error;
  }
 });
 queue=next;
 return next;
}
window.ELLCollections={init,read,change,save:next=>change(()=>next),onChange(fn){listeners.add(fn);return()=>listeners.delete(fn)},get user(){return owner?{id:owner}:null}};
})();