import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
const config={apiKey:"AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY",authDomain:"lecture-entre-les-lignes.firebaseapp.com",projectId:"lecture-entre-les-lignes",appId:"1:876044393565:web:da359169bccbfc709081b4"};
const app=getApps()[0]||initializeApp(config),auth=getAuth(app);
const root=document.getElementById('reader-content');if(!root)throw Error('Lecteur introuvable');
const bar=document.createElement('section');bar.className='ell-reader-plus';bar.setAttribute('aria-label','Outils de lecture Premium');
bar.innerHTML='<div class="ell-plus-heading"><strong>✦ Mon carnet de lecture</strong><span id="ell-plus-plan">Vérification du compte…</span></div><div id="ell-plus-tools" hidden><p>Sélectionne une phrase du texte de la page, puis choisis une couleur pour l’enregistrer dans ton carnet.</p><div class="ell-plus-colors" id="ell-plus-colors"></div><label for="ell-plus-note">Ma note sur ce passage</label><textarea id="ell-plus-note" rows="3" placeholder="Ce passage me fait penser à…"></textarea><div class="ell-plus-actions"><button type="button" id="ell-plus-save">♡ Enregistrer le passage</button><button type="button" id="ell-plus-export">Exporter mon carnet (.json)</button></div><p id="ell-plus-message" role="status"></p><div id="ell-plus-entries"></div></div><p id="ell-plus-locked">Connecte-toi pour retrouver tes outils de lecture. <a href="connexion-firebase.html">Mon compte</a></p>';
root.parentNode.insertBefore(bar,root);const $=id=>document.getElementById(id);const palette=['#ffe087','#ffc5d7','#bce6dc','#c9d8ff','#e5c7f2','#ffd6b2','#d8edab','#e0d9d1'];let tier=0,uid='',chosen=palette[0],selection='',entries=[],readerData={};const names=['Gratuit','Découverte','Passion','Illimité'];const key=()=> 'ell-reader-plus-'+uid+'-'+location.pathname+'-'+new URLSearchParams(location.search).get('id');
const bookKey=()=>location.pathname+'?id='+(new URLSearchParams(location.search).get('id')||'');function show(){const unlocked=!!uid;$('ell-plus-tools').hidden=!unlocked;$('ell-plus-locked').hidden=unlocked;$('ell-plus-plan').textContent=names[tier];if(!unlocked)$('ell-plus-locked').innerHTML='Connecte-toi pour enregistrer tes passages et tes notes dans ton compte. <a href="connexion-firebase.html">Se connecter</a>';render();}
const colors=$('ell-plus-colors');palette.forEach((color,i)=>{const b=document.createElement('button');b.type='button';b.className='ell-plus-swatch';b.style.backgroundColor=color;b.setAttribute('aria-label','Couleur '+(i+1));b.setAttribute('aria-pressed',i===0?'true':'false');b.onclick=()=>{chosen=color;colors.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));};colors.append(b)});
function render(){const host=$('ell-plus-entries');host.replaceChildren();for(const e of entries.slice().reverse()){const item=document.createElement('article');item.className='ell-plus-entry';item.style.borderLeftColor=e.color;const q=document.createElement('blockquote');q.textContent=e.quote;const p=document.createElement('p');p.textContent=e.note||'Sans note';const date=document.createElement('small');date.textContent=new Date(e.date).toLocaleDateString('fr-FR');item.append(q,p,date);host.append(item);}}
document.addEventListener('selectionchange',()=>{const sel=window.getSelection();if(sel&&sel.rangeCount&&root.contains(sel.anchorNode)&&root.contains(sel.focusNode))selection=sel.toString().trim().slice(0,3000);});

const ROOT='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
async function call(action,kind='reader',data=undefined){
 const user=auth.currentUser;if(!user)throw Error('Connecte-toi pour enregistrer ton carnet.');
 const response=await fetch(ROOT,{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action,kind,data})});
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(result.error||'Sauvegarde indisponible');return result;
}
$('ell-plus-save').onclick=async()=>{
 if(!uid)return;
 if(!selection){$('ell-plus-message').textContent='Sélectionne d’abord un passage dans le lecteur.';return;}
 const button=$('ell-plus-save');button.disabled=true;$('ell-plus-message').textContent='Enregistrement sur ton compte…';
 const next={quote:selection,note:$('ell-plus-note').value.trim(),color:chosen,date:new Date().toISOString()};
 try{
  // Relire la dernière version pour préserver les passages des autres livres.
  const fresh=await call('read');const all=fresh.data&&typeof fresh.data==='object'&&!Array.isArray(fresh.data)?fresh.data:{};
  const latest=Array.isArray(all[bookKey()])?all[bookKey()]:[];
  const updated=[...latest,next].slice(-1000);
  await call('write','reader',{...all,[bookKey()]:updated});
  entries=updated;readerData={...all,[bookKey()]:updated};
  localStorage.setItem(key(),JSON.stringify(entries));
  $('ell-plus-note').value='';$('ell-plus-message').textContent='Passage enregistré dans ton compte ♡';render();
 }catch(e){$('ell-plus-message').textContent='Sauvegarde non confirmée : '+e.message;}
 finally{button.disabled=false;}
};
$('ell-plus-export').onclick=()=>{
 if(!uid)return;
 const blob=new Blob([JSON.stringify(entries,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='mon-carnet-entre-les-lignes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
let authGeneration=0;
onAuthStateChanged(auth,async user=>{
 const generation=++authGeneration;uid=user?.uid||'';tier=0;entries=[];readerData={};show();
 if(!user)return;
 $('ell-plus-plan').textContent='Chargement de ton carnet…';
 try{
  const [res,status]=await Promise.all([call('read'),call('status','billing')]);
  if(generation!==authGeneration)return;
  readerData=res.data&&typeof res.data==='object'&&!Array.isArray(res.data)?res.data:{};
  entries=Array.isArray(readerData[bookKey()])?readerData[bookKey()]:[];
  const plans={decouverte:1,passion:2,illimite:3};
  tier=Number(status.subscription?.access_level||0);
  // Import des passages historiques de cet utilisateur si ce livre n'existe pas encore sur le serveur.
  if(!entries.length){
   let legacy=[];try{legacy=JSON.parse(localStorage.getItem(key())||'[]');}catch{}
   if(Array.isArray(legacy)&&legacy.length){
    await call('write','reader',{...readerData,[bookKey()]:legacy});
    if(generation!==authGeneration)return;
    entries=legacy;readerData[bookKey()]=legacy;
   }
  }
  $('ell-plus-message').textContent='Carnet synchronisé avec ton compte.';
 }catch(e){$('ell-plus-message').textContent='Impossible de récupérer ton carnet : '+e.message;}
 show();
});
