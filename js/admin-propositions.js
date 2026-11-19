import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
const config={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const auth=getAuth(getApps()[0]||initializeApp(config)), ROOT='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
const allowed=new Set(['quentinmorel1912@gmail.com','juliepotier2006@gmail.com']);
const $=id=>document.getElementById(id);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=[],timer=null,fetching=false;
async function call(action,params={}){
 const user=auth.currentUser;if(!user)throw Error('Connexion requise.');
 const response=await fetch(ROOT,{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action,...params})});
 const body=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(body.error||'Opération impossible');return body;
}
async function file(r,fileType){
 try{const result=await call('requests-file',{id:r.id,fileType});window.open(result.url,'_blank','noopener,noreferrer');}
 catch(e){$('admin-access').textContent=e.message;}
}
function createCard(r){
 const d=r.details||{};
 const el=document.createElement('article');el.className='admin-request';
 const body=document.createElement('div');body.className='admin-request-body';
 body.innerHTML='<span class="admin-label">'+safe(r.status==='validated'?'VALIDÉE':r.status==='unresolved'?'NON TRAITÉE':'À ÉTUDIER')+'</span>'
 +'<h2>'+safe(r.title)+'</h2><p class="admin-byline">'+safe(r.author||'Auteur non renseigné')+' · proposé par '+safe(r.requester_email)+'</p>'
 +'<p class="admin-details">'+safe([d.genre,d.subgenre,d.edition,d.publicationDate,d.price,d.isbn,d.summary,d.details].filter(Boolean).join(' · '))+'</p>';
 if(d.referenceUrl&&/^https:\/\//.test(d.referenceUrl)){
  const link=document.createElement('a');link.href=d.referenceUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Consulter la référence';body.append(link);
 }
 if(r.cover_path){const b=document.createElement('button');b.type='button';b.textContent='Voir la couverture';b.onclick=()=>file(r,'cover');body.append(b);}
 if(r.pdf_path){const b=document.createElement('button');b.type='button';b.textContent='Ouvrir le PDF : '+(r.pdf_name||'Document');b.onclick=()=>file(r,'pdf');body.append(b);}
 const form=document.createElement('form');
 form.innerHTML='<label>Décision<select name="status"><option value="pending">En attente</option><option value="validated">Demande validée</option><option value="unresolved">Demande non traitée</option></select></label>'
 +'<label>Motif<select name="reason"><option value="">Aucun</option><option value="missing_details">Informations manquantes</option><option value="pdf_unavailable">PDF introuvable ou indisponible</option><option value="other">Autre</option></select></label>'
 +'<label class="admin-message">Réponse au lecteur<textarea name="message" rows="3" maxlength="3000" placeholder="Bonjour, nous avons bien reçu ta proposition…"></textarea></label>'
 +'<button type="submit">Enregistrer et envoyer la réponse ♡</button><span class="admin-save-status" role="status"></span>';
 form.elements.status.value=r.status||'pending';form.elements.reason.value=r.reason||'';form.elements.message.value=r.admin_message||'';
 form.onsubmit=async e=>{
  e.preventDefault();const b=form.querySelector('button'),msg=form.querySelector('.admin-save-status');
  b.disabled=true;msg.textContent='Enregistrement…';
  try{
   await call('requests-reply',{id:r.id,status:form.elements.status.value,reason:form.elements.reason.value,message:form.elements.message.value.trim()});
   msg.textContent='Réponse enregistrée et disponible dans les propositions du lecteur.';
   await refresh();
  }catch(err){msg.textContent='Échec : '+err.message;}finally{b.disabled=false;}
 };
 body.append(form);el.append(body);return el;
}
function render(){
 const term=$('admin-search').value.trim().toLocaleLowerCase('fr'),filter=$('admin-filter').value;
 const counts={pending:0,validated:0,unresolved:0};
 for(const r of records)if(r.status in counts)counts[r.status]++;
 $('admin-total').textContent=records.length;
 for(const s of Object.keys(counts))$('admin-'+s).textContent=counts[s];
 const list=records.filter(r=>(filter==='all'||r.status===filter)&&[r.title,r.author,r.requester_email].some(v=>String(v||'').toLocaleLowerCase('fr').includes(term)));
 $('admin-requests').replaceChildren(...list.map(createCard));
 if(!list.length)$('admin-requests').textContent='Aucune proposition dans cette sélection.';
}
async function refresh(){
 if(fetching||!auth.currentUser)return;
 fetching=true;
 try{const {requests}=await call('requests-list',{admin:true});records=requests||[];render();}
 catch(e){$('admin-requests').textContent='Chargement impossible : '+e.message;}
 finally{fetching=false;}
}
$('admin-search').addEventListener('input',render);
$('admin-filter').addEventListener('change',render);
onAuthStateChanged(auth,async user=>{
 if(timer)clearInterval(timer);
 $('admin-workspace').hidden=true;
 if(!user){$('admin-access').innerHTML='Connecte-toi depuis <a href="connexion-firebase.html">ton compte</a> pour accéder à cet espace.';return;}
 if(!allowed.has(String(user.email||'').toLowerCase())||!user.emailVerified){$('admin-access').textContent='Espace réservé aux comptes administrateurs avec adresse e-mail vérifiée.';return;}
 $('admin-access').textContent='Espace administrateur · '+user.email;
 $('admin-workspace').hidden=false;
 await refresh();timer=setInterval(refresh,30000);
});
