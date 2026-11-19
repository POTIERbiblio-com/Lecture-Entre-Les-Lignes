import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';
const CONFIG={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const auth=getAuth(getApps()[0]||initializeApp(CONFIG));
const URL='https://cezgcoaokwuobipwfffa.supabase.co';
const sb=createClient(URL,'sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const $=id=>document.getElementById(id);
const safe=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const statuses={pending:'En attente',validated:'Validée',unresolved:'Non traitée'};
let user=null,refreshTimer=null,refreshing=false;
async function call(action,params={}){
 const current=auth.currentUser;
 if(!current)throw Error('Connecte-toi pour accéder à tes propositions.');
 const result=await fetch(URL+'/functions/v1/secure-account',{method:'POST',headers:{Authorization:'Bearer '+await current.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action,...params})});
 const body=await result.json().catch(()=>({}));
 if(!result.ok)throw Error(body.error||'Le serveur ne confirme pas la demande.');
 return body;
}
async function openFile(id,fileType){
 try{const {url}=await call('requests-file',{id,fileType});if(!url)throw Error('Fichier non disponible');window.open(url,'_blank','noopener,noreferrer');}
 catch(e){$('request-status').textContent=e.message;}
}
function card(r){
 const d=r.details||{};
 const el=document.createElement('article');
 el.className='request-entry';
 el.innerHTML='<div class="request-no-cover">📖</div><h3>'+safe(r.title)+'</h3><span class="status '+safe(r.status)+'">'+safe(statuses[r.status]||'En attente')+'</span>'
 +'<p class="meta">'+safe([r.author&&'Auteur : '+r.author,d.genre&&'Genre : '+d.genre,d.edition&&'Édition : '+d.edition,d.publicationDate&&'Parution : '+d.publicationDate,d.isbn&&'ISBN : '+d.isbn,d.summary&&'Résumé : '+d.summary,d.details].filter(Boolean).join('\n'))+'</p>'
 +(r.admin_message?'<div class="response"><strong>Message de la bibliothèque :</strong><p>'+safe(r.admin_message)+'</p></div>':'')
 +(r.reason?'<p class="meta">Motif : '+safe({missing_details:'Informations manquantes',pdf_unavailable:'PDF indisponible',other:'Autre motif'}[r.reason]||r.reason)+'</p>':'')
 +'<p class="meta">Proposée le '+new Date(r.created_at).toLocaleDateString('fr-FR')+'</p>';
 if(r.cover_path){const b=document.createElement('button');b.type='button';b.textContent='Voir la couverture';b.onclick=()=>openFile(r.id,'cover');el.append(b);}
 if(r.pdf_path){const b=document.createElement('button');b.type='button';b.textContent='Voir le PDF joint';b.onclick=()=>openFile(r.id,'pdf');el.append(b);}
 return el;
}
async function refresh(){
 if(!auth.currentUser||refreshing)return;
 refreshing=true;
 try{
  const {requests}=await call('requests-list');
  $('my-requests').replaceChildren(...(requests||[]).map(card));
  if(!requests?.length)$('my-requests').textContent='Aucune proposition pour le moment.';
 }catch(e){$('my-requests').textContent='Impossible de charger les propositions : '+e.message;}
 finally{refreshing=false;}
}
onAuthStateChanged(auth,u=>{
 if(refreshTimer)clearInterval(refreshTimer);
 user=u;
 $('request-member').hidden=!u;$('request-login').hidden=!!u;
 if(!u){$('request-status').textContent='Connecte-toi pour envoyer et suivre tes propositions.';$('my-requests').replaceChildren();return;}
 $('request-status').textContent='Connecté avec '+(u.email||'ton compte');
 refresh();refreshTimer=setInterval(refresh,30000);
});
async function upload(file,fileType){
 const mime=fileType==='pdf'?'application/pdf':file.type;
 const {path,token}=await call('requests-upload',{fileType,mime});
 const {error}=await sb.storage.from('book-request-files').uploadToSignedUrl(path,token,file,{contentType:mime});
 if(error)throw Error('Envoi du fichier impossible : '+error.message);
 return path;
}
$('request-form').onsubmit=async e=>{
 e.preventDefault();
 if(!auth.currentUser){$('request-status').textContent='Connecte-toi avant de proposer un livre.';return;}
 const form=e.currentTarget,d=new FormData(form),button=$('send-request');
 const cover=d.get('cover'),pdf=d.get('pdf');
 const hasCover=cover instanceof File&&cover.size>0,hasPdf=pdf instanceof File&&pdf.size>0;
 if(hasCover&&(cover.size>3*1024*1024||!['image/jpeg','image/png','image/webp'].includes(cover.type))){$('request-status').textContent='Couverture : JPG, PNG ou WebP, maximum 3 Mo.';return;}
 if(hasPdf){
  if(pdf.size>20*1024*1024||!pdf.name.toLowerCase().endsWith('.pdf')){$('request-status').textContent='PDF : maximum 20 Mo.';return;}
  const signature=new Uint8Array(await pdf.slice(0,5).arrayBuffer());
  if(String.fromCharCode(...signature)!=='%PDF-'){$('request-status').textContent='Le fichier ne commence pas par une signature PDF valide.';return;}
 }
 const fields=['title','author','genre','subgenre','edition','publicationDate','price','isbn','referenceUrl','summary','details'];
 const data=Object.fromEntries(fields.map(k=>[k,String(d.get(k)||'').trim()]));
 if(!data.title){$('request-status').textContent='Indique le titre du livre.';return;}
 button.disabled=true;
 const label=button.textContent;$('request-success').hidden=true;
 try{
  let coverPath='',pdfPath='';
  if(hasCover){button.textContent='Envoi de la couverture…';$('request-status').textContent='Transfert de la couverture dans l’espace privé…';coverPath=await upload(cover,'cover');}
  if(hasPdf){button.textContent='Envoi du PDF…';$('request-status').textContent='Transfert du PDF dans l’espace privé…';pdfPath=await upload(pdf,'pdf');}
  button.textContent='Enregistrement…';$('request-status').textContent='Enregistrement de la proposition…';
  await call('requests-create',{data,coverPath,pdfPath,pdfName:hasPdf?pdf.name:''});
  form.reset();
  $('request-success').hidden=false;
  $('request-status').textContent='Proposition enregistrée sur ton compte et transmise aux administrateurs.';
  await refresh();
  $('request-success').scrollIntoView({behavior:'smooth',block:'center'});
 }catch(err){$('request-status').textContent='Proposition non confirmée : '+err.message;console.error('Proposition',err);}
 finally{button.disabled=false;button.textContent=label;}
};
