import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
const config={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const auth=getAuth(getApps()[0]||initializeApp(config)),ROOT='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
const host=document.getElementById('ell-book-request-inbox'),area=document.getElementById('ell-request-messages');
let timer=null,loading=false;
async function update(){
 if(loading||!auth.currentUser||!area)return;loading=true;
 try{
  const user=auth.currentUser;
  const response=await fetch(ROOT,{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action:'requests-list'})});
  const data=await response.json();
  if(!response.ok)throw Error(data.error||'Service indisponible');
  if(user.uid!==auth.currentUser?.uid)return;
  const answered=(data.requests||[]).filter(x=>x.admin_message||x.status!=='pending');
  const unreadResult=await fetch(ROOT,{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action:'requests-unread'})});
  const unreadData=unreadResult.ok?await unreadResult.json():{unread:0};
  if(user.uid!==auth.currentUser?.uid)return;
  let badge=host.querySelector('[data-ell-proposal-badge]');
  if(!badge){badge=document.createElement('strong');badge.dataset.ellProposalBadge='1';badge.style.cssText='display:inline-block;margin:8px;padding:6px 12px;border-radius:22px;background:#f7d8e8;color:#6e3b58';host.prepend(badge)}
  badge.textContent=unreadData.unread>0?unreadData.unread+' nouvelle(s) réponse(s) à tes propositions':'Tes réponses et propositions';
  host.hidden=answered.length===0;area.replaceChildren();
  answered.slice(0,8).forEach(x=>{
   const article=document.createElement('article');
   article.style.cssText='padding:15px 20px;margin:12px 0;background:#fff6fa;border:2px solid #e9c4d7;border-radius:20px;color:#74435e';
   const title=document.createElement('h3');title.textContent=x.title;article.append(title);
   const label=document.createElement('p');label.textContent=x.status==='validated'?'Proposition validée':x.status==='unresolved'?'Proposition non traitée':'Réponse de la bibliothèque';article.append(label);
   if(x.admin_message){const body=document.createElement('p');body.textContent=x.admin_message;article.append(body);}
   const link=document.createElement('a');link.href='demander-un-livre.html#my-requests';link.textContent='Voir les détails de ma proposition';article.append(link);area.append(article);
  });
 }catch(e){if(host){host.hidden=false;area.textContent='Impossible de charger les messages : '+e.message;}}
 finally{loading=false;}
}
if(host&&area)onAuthStateChanged(auth,u=>{if(timer)clearInterval(timer);host.hidden=!u;if(!u){area.replaceChildren();return;}update();timer=setInterval(update,30000);});
