import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {getFirestore,getDocs,collection} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';
const config={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const app=getApps()[0]||initializeApp(config),auth=getAuth(app),db=getFirestore(app),$=id=>document.getElementById(id);
const url='https://cezgcoaokwuobipwfffa.supabase.co',supabase=createClient(url,'sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3',{auth:{persistSession:false,autoRefreshToken:false}});
const allowed=['quentinmorel1912@gmail.com','juliepotier2006@gmail.com'];
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let books=[],moderation=new Map(),privateFiles=new Map();
async function api(action,params={}){
 const user=auth.currentUser;if(!user)throw Error('Connexion requise');
 const res=await fetch(url+'/functions/v1/secure-account',{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action,...params})});
 const result=await res.json().catch(()=>({}));if(!res.ok)throw Error(result.error||'Opération refusée');return result;
}
function entry(id,title,author,cover,source){return {id,title:title||'Livre sans titre',author:author||'',cover:cover||'',source};}
async function load(){
 const local=await fetch('catalogue-moderation-index.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Index du catalogue introuvable');return r.json();});
 const map=new Map(local.map(x=>[x.id,entry(x.id,x.title,x.author,x.cover,'Bibliothèque')]));
 const {data:remote,error}=await supabase.from('books').select('id,title,author,cover_path,original_cover');
 if(error)console.warn('Catalogue Supabase',error);
 for(const x of remote||[])map.set('db-'+x.id,entry('db-'+x.id,x.title,x.author,x.cover_path||x.original_cover,'Catalogue en ligne'));
 try{
  const snap=await getDocs(collection(db,'books'));
  for(const x of snap.docs){const v=x.data();map.set('firebase-'+x.id,entry('firebase-'+x.id,v.title,v.author,v.cover_path,'Catalogue Firebase'));}
 }catch(e){console.warn('Catalogue Firebase indisponible',e);}
 books=[...map.values()].sort((a,b)=>a.title.localeCompare(b.title,'fr'));
 const m=await supabase.from('catalogue_moderation').select('book_id,hidden,deleted,access_level');
 if(m.error)throw m.error;
 moderation=new Map((m.data||[]).map(x=>[x.book_id,x]));
 const privateIndex=await api('catalogue-private-index');
 privateFiles=new Map((privateIndex.files||[]).map(x=>[x.book_id,x]));
 render();
}
async function change(book,patch){
 const previous=moderation.get(book.id)||{hidden:false,deleted:false,access_level:0};
 const next={...previous,...patch};
 await api('catalogue-moderate',{bookId:book.id,hidden:!!next.hidden,deleted:!!next.deleted,level:Number(next.access_level)});
 moderation.set(book.id,next);render();
 $('am-status').textContent='Modifications enregistrées sur le serveur pour « '+book.title+' ».';
}
function card(b){
 const rule=moderation.get(b.id)||{hidden:false,deleted:false,access_level:0};
 const c=document.createElement('article');c.className='am-book';
 const safeCover=/^(?:images\/|livres\/|Entre_les_lignes_)[^?#]+\.(?:jpg|jpeg|png|webp)$/i.test(b.cover)?b.cover:'';
 c.innerHTML='<div class="am-cover">'+(safeCover?'<img src="'+safe(safeCover)+'" alt="Couverture de '+safe(b.title)+'" loading="lazy">':'<span aria-hidden="true">📚</span>')+'</div>'
 +'<div class="am-book-body"><p class="am-source">'+safe(b.source)+'</p><h2>'+safe(b.title)+'</h2><p>'+safe(b.author)+'</p><p class="am-current">'+(rule.deleted?'Retiré du catalogue':rule.hidden?'Masqué':rule.access_level?'🔒 '+(['Libre','Orange · Découverte','Jaune · Passion','Rouge · Illimité'][rule.access_level]):'Visible · gratuit')+'</p>'
 +'<label>Accès<select class="am-tier"><option value="0">Libre / gratuit</option><option value="1">🟠 Orange · Découverte · niveau 1</option><option value="2">🟡 Jaune · Passion · niveau 2</option><option value="3">🔴 Rouge · Illimité · niveau 3</option></select></label>'
 +'<div class="am-actions"><button type="button" class="am-save">Enregistrer le cadenas</button><button type="button" class="am-hide">'+(rule.hidden?'Réafficher':'Masquer')+'</button><button type="button" class="am-delete">'+(rule.deleted?'Restaurer':'Supprimer du catalogue')+'</button></div>'
 +'<section class="am-private-upload"><p><strong>PDF privé :</strong> '+(privateFiles.get(b.id)?.rights_attested?'Fichier enregistré avec déclaration de droits':'Non disponible dans le stockage privé')+'</p>'
 +'<label>Fichier PDF autorisé <input type="file" class="am-pdf-file" accept="application/pdf,.pdf"></label>'
 +'<label><input type="checkbox" class="am-pdf-license"> Je confirme détenir les droits permettant de diffuser ce PDF aux abonnés.</label>'
 +'<button type="button" class="am-pdf-upload">Déposer dans le stockage privé</button><p class="am-pdf-status" role="status"></p></section></div>';
 const tier=c.querySelector('.am-tier');tier.value=String(rule.access_level||0);
 const act=async (button,patch)=>{button.disabled=true;try{await change(b,patch);}catch(e){$('am-status').textContent='Échec : '+e.message;button.disabled=false;}};
 c.querySelector('.am-save').onclick=e=>act(e.currentTarget,{access_level:Number(tier.value)});
 c.querySelector('.am-hide').onclick=e=>act(e.currentTarget,{hidden:!rule.hidden});
 c.querySelector('.am-delete').onclick=e=>{
  if(!rule.deleted&&!confirm('Attention : supprimer « '+b.title+' » du catalogue le rendra invisible aux lecteurs. Les PDF et fichiers hébergés ne seront pas effacés. Confirmer ?'))return;
  act(e.currentTarget,{deleted:!rule.deleted});
 };
 const uploadButton=c.querySelector('.am-pdf-upload');
 uploadButton.onclick=async()=>{
  const file=c.querySelector('.am-pdf-file').files?.[0],consent=c.querySelector('.am-pdf-license').checked,feedback=c.querySelector('.am-pdf-status');
  if(!file||!file.name.toLowerCase().endsWith('.pdf')||file.size<5||file.size>20*1024*1024){feedback.textContent='Choisis un PDF valide de 20 Mo maximum.';return;}
  if(!consent){feedback.textContent='Attestation des droits de diffusion obligatoire.';return;}
  const head=new Uint8Array(await file.slice(0,5).arrayBuffer());
  if(String.fromCharCode(...head)!=='%PDF-'){feedback.textContent='Ce fichier ne commence pas par une signature PDF valide.';return;}
  uploadButton.disabled=true;feedback.textContent='Transfert du PDF vers le stockage privé…';
  try{
   const {path,token}=await api('catalogue-pdf-upload',{bookId:b.id});
   const {error}=await supabase.storage.from('book-pdfs').uploadToSignedUrl(path,token,file,{contentType:'application/pdf'});
   if(error)throw error;
   await api('catalogue-pdf-activate',{bookId:b.id,path,rightsAttested:true});
   privateFiles.set(b.id,{book_id:b.id,rights_attested:true});
   feedback.textContent='PDF déposé et enregistré. Attention : toute copie déjà publiée sur GitHub reste accessible tant qu’elle n’a pas été retirée.';
  }catch(e){feedback.textContent='Échec du transfert : '+(e.message||String(e));}
  finally{uploadButton.disabled=false;}
 };
 return c;
}
function render(){
 const q=$('am-search').value.trim().toLocaleLowerCase('fr'),f=$('am-filter').value;
 const list=books.filter(b=>{
  const r=moderation.get(b.id)||{hidden:false,deleted:false,access_level:0};
  return (!q||(b.title+' '+b.author).toLocaleLowerCase('fr').includes(q))
   &&(f==='all'||f==='visible'&&!r.hidden&&!r.deleted||f==='hidden'&&r.hidden&&!r.deleted||f==='deleted'&&r.deleted||f==='locked'&&r.access_level>0);
 });
 $('am-count').textContent=list.length+' livre(s) dans cette sélection · '+books.length+' fiches référencées';
 $('am-books').replaceChildren(...list.map(card));
}
$('am-search').value=(new URLSearchParams(location.search).get('search')||'').slice(0,150);
$('am-search').addEventListener('input',render);
$('am-filter').addEventListener('change',render);
onAuthStateChanged(auth,async u=>{
 $('am-panel').hidden=true;
 if(!u){$('am-status').innerHTML='Connecte-toi depuis <a href="connexion-firebase.html">Mon compte</a>.';return;}
 if(!u.emailVerified||!allowed.includes((u.email||'').toLowerCase())){$('am-status').textContent='Accès réservé aux comptes administrateurs avec e-mail vérifié.';return;}
 $('am-status').textContent='Chargement des ouvrages et des droits…';
 try{await load();$('am-panel').hidden=false;$('am-status').textContent='Atelier connecté · '+u.email;}
 catch(e){$('am-status').textContent='Impossible de charger la gestion : '+e.message;}
});