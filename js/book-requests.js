import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {getFirestore,collection,query,where,onSnapshot,addDoc,updateDoc,doc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-storage.js';
const config={apiKey:"AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY",authDomain:"lecture-entre-les-lignes.firebaseapp.com",projectId:"lecture-entre-les-lignes",storageBucket:"lecture-entre-les-lignes.firebasestorage.app",appId:"1:876044393565:web:da359169bccbfc709081b4"};
const app=getApps()[0]||initializeApp(config),auth=getAuth(app),db=getFirestore(app),storage=getStorage(app);
const $=id=>document.getElementById(id),safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let user=null,unsubs=[];
const status={pending:'En attente',validated:'Validée',unresolved:'Non traitée'};
function item(r,admin){const d=r.data(),id=r.id;const el=document.createElement('article');el.className='request-entry';el.innerHTML=(d.coverUrl?'<img alt="Couverture proposée" src="'+safe(d.coverUrl)+'">':'<div class="request-no-cover" aria-label="Aucune couverture fournie">📖 Couverture non fournie</div>')+'<h3>'+safe(d.title)+'</h3><span class="status '+safe(d.status)+'">'+safe(status[d.status]||'En attente')+'</span><p class="meta">'+safe([d.author&&'Auteur : '+d.author,d.genre&&'Genre : '+d.genre,d.subgenre&&'Sous-genre : '+d.subgenre,d.edition&&'Édition : '+d.edition,d.publicationDate&&'Parution : '+d.publicationDate,d.price&&'Prix : '+d.price,d.isbn&&'ISBN : '+d.isbn,d.referenceUrl&&'Référence : '+d.referenceUrl,d.summary&&'Résumé : '+d.summary,d.details].filter(Boolean).join('\n'))+'</p>'+(admin?'<p class="meta">Demande de '+safe(d.requesterEmail)+'</p>':'')+(d.pdfPath?'<p class="meta">📄 PDF joint : '+safe(d.pdfName||'Document PDF')+'</p>':'')+(d.adminMessage?'<div class="response"><strong>Réponse de la bibliothèque :</strong> '+safe(d.adminMessage)+'</div>':'')+(admin?'<form><label>Décision <select name="status"><option value="pending">En attente</option><option value="validated">Validée</option><option value="unresolved">Non traitée</option></select></label><label>Motif (si non traitée) <select name="reason"><option value="">—</option><option value="missing_details">Informations manquantes</option><option value="pdf_unavailable">PDF introuvable / non disponible légalement</option><option value="other">Autre motif</option></select></label><label>Message pour le demandeur <textarea name="message" maxlength="3000" rows="3"></textarea></label><button>Envoyer la réponse</button></form>':'');if(admin){const f=el.querySelector('form');f.elements.status.value=d.status||'pending';f.elements.reason.value=d.reason||'';f.elements.message.value=d.adminMessage||'';f.onsubmit=async e=>{e.preventDefault();const b=f.querySelector('button');b.disabled=true;try{await updateDoc(doc(db,'book_requests',id),{status:f.elements.status.value,reason:f.elements.reason.value,adminMessage:f.elements.message.value.trim(),reviewedBy:auth.currentUser.uid,reviewedAt:serverTimestamp()});}catch(err){alert('Réponse non enregistrée : '+(err.code||err.message));}finally{b.disabled=false;}};}return el;}
function watch(q,target,admin){unsubs.push(onSnapshot(q,snap=>{const list=snap.docs.sort((a,b)=>(b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0));$(target).replaceChildren(...list.map(r=>item(r,admin)));if(!list.length)$(target).textContent='Aucune proposition pour le moment.';},err=>{$(target).textContent='Tes propositions ne sont pas disponibles pour le moment. Réessaie plus tard.';console.error('Chargement des propositions',err);}));}
onAuthStateChanged(auth,async u=>{unsubs.forEach(f=>f());unsubs=[];user=u;$('request-member').hidden=!u;$('request-login').hidden=!!u;if(!u){$('request-status').textContent='Connecte-toi pour envoyer et suivre tes demandes.';return;}try{$('request-status').textContent='Connecté avec '+u.email;watch(query(collection(db,'book_requests'),where('requesterUid','==',u.uid)),'my-requests',false);}catch(e){$('request-status').textContent='Vérification des droits impossible : '+(e.code||e.message);}});
const formatError=err=>{
  const code=err?.code||'';
  if(code==='permission-denied'||code==='storage/unauthorized')return 'Envoi refusé par Firebase : les règles de sécurité ne sont probablement pas publiées.';
  if(code==='unavailable'||code==='storage/retry-limit-exceeded')return 'Connexion au serveur indisponible. Réessaie quand le réseau est stable.';
  if(code==='storage/canceled')return 'Transfert interrompu. Réessaie et garde cette page ouverte jusqu’à la confirmation.';
  if(code==='storage/object-not-found')return 'Le serveur ne retrouve pas le fichier transféré. Réessaie.';
  if(code==='storage/quota-exceeded')return 'Espace de stockage indisponible : quota atteint.';
  return 'Envoi impossible : '+(code||err?.message||'erreur inconnue');
};
function uploadWithProgress(file,path,onProgress){
  // Un PDF volumineux sur réseau mobile peut rester plus de 25 s sans progression.
  // Ne jamais annuler automatiquement : storage/canceled provenait de task.cancel().
  const retryable=new Set(['storage/retry-limit-exceeded','storage/unknown']);
  const once=()=>new Promise((resolve,reject)=>{
    const task=uploadBytesResumable(ref(storage,path),file,{contentType:path.endsWith('.pdf')?'application/pdf':file.type});
    task.on('state_changed',snapshot=>{
      onProgress(Math.round(snapshot.bytesTransferred/Math.max(snapshot.totalBytes,1)*100));
    },reject,()=>resolve(task.snapshot.ref));
  });
  return (async()=>{
    for(let attempt=0;attempt<3;attempt++){
      try{return await once()}
      catch(error){
        if(!retryable.has(error?.code)||attempt===2)throw error;
        onProgress(0);
        await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
      }
    }
  })();
}
$('request-form').onsubmit=async e=>{
  e.preventDefault();
  if(!user){$('request-status').textContent='Connecte-toi avant d’envoyer une proposition.';return;}
  const f=e.currentTarget,b=$('send-request'),d=new FormData(f),cover=d.get('cover'),pdf=d.get('pdf');
  const hasCover=cover instanceof File&&cover.size>0,hasPdf=pdf instanceof File&&pdf.size>0;
  if(hasCover&&(cover.size>3*1024*1024||!['image/jpeg','image/png','image/webp'].includes(cover.type))){$('request-status').textContent='Couverture : JPG, PNG ou WebP, 3 Mo maximum.';return;}
  if(hasPdf){
    if(pdf.size>20*1024*1024||!(pdf.type==='application/pdf'||pdf.name.toLowerCase().endsWith('.pdf'))){$('request-status').textContent='PDF : 20 Mo maximum.';return;}
    const signature=new Uint8Array(await pdf.slice(0,5).arrayBuffer());
    if(String.fromCharCode(...signature)!=='%PDF-'){$('request-status').textContent='Le document choisi n’est pas un PDF valide.';return;}
  }
  const fields=['title','author','genre','subgenre','edition','publicationDate','price','isbn','referenceUrl','summary','details'];
  const data=Object.fromEntries(fields.map(k=>[k,String(d.get(k)||'').trim()]));
  if(!data.title||!data.author){$('request-status').textContent='Le titre et l’auteur sont obligatoires.';return;}
  b.disabled=true;$('request-success').hidden=true;
  const label=b.textContent;
  try{
    const fileId=crypto.randomUUID();
    const coverPath=hasCover?'book-request-covers/'+user.uid+'/'+fileId+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[cover.type]):'';
    const pdfPath=hasPdf?'book-request-pdfs/'+user.uid+'/'+fileId+'.pdf':'';
    let coverUrl='';
    if(hasCover||hasPdf){
      b.textContent='Envoi en cours…';
      const progress={cover:0,pdf:0};
      const report=()=>{$('request-status').textContent='Envoi des fichiers : couverture '+(hasCover?progress.cover+' %':'aucune')+' · PDF '+(hasPdf?progress.pdf+' %':'aucun');};
      report();
      const tasks=[];
      if(hasCover)tasks.push(uploadWithProgress(cover,coverPath,n=>{progress.cover=n;report();}).then(async fileRef=>{coverUrl=await getDownloadURL(fileRef);}));
      if(hasPdf)tasks.push(uploadWithProgress(pdf,pdfPath,n=>{progress.pdf=n;report();}));
      await Promise.all(tasks);
    }
    $('request-status').textContent='Enregistrement de la proposition…';
    b.textContent='Enregistrement…';
    const write=addDoc(collection(db,'book_requests'),{...data,requesterUid:user.uid,requesterEmail:user.email,coverPath,coverUrl,pdfPath,pdfName:hasPdf?pdf.name.slice(0,180):'',status:'pending',reason:'',adminMessage:'',createdAt:serverTimestamp()});
    // Firestore peut attendre une reconnexion sans jamais terminer : prévenir plutôt que laisser tourner.
    let timer;try{await Promise.race([write,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(new Error('Enregistrement toujours en attente du serveur.'),{code:'save-pending'})),20000);})]);}finally{clearTimeout(timer);}
    f.reset();
    $('request-status').textContent='Proposition enregistrée avec succès.';
    $('request-success').hidden=false;
    $('request-success').scrollIntoView({behavior:'smooth',block:'center'});
  }catch(err){
    $('request-status').textContent=err?.code==='save-pending'
      ?'Le serveur ne confirme pas encore la demande. Vérifie « Mes propositions » avant de réessayer pour éviter un doublon.'
      :formatError(err);
    console.error('Échec envoi proposition',err);
  }finally{b.disabled=false;b.textContent=label;}
};
