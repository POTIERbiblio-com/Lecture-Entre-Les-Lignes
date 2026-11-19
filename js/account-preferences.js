import {auth,onAccount,requestService} from './request-service.js';
const $=id=>document.getElementById(id);
const inbox=$('proposal-notifications'),settings=$('parametres-compte'),form=$('notification-settings');
const label=$('proposal-bell-label'),count=$('proposal-unread'),releases=$('catalogue-notifications');
const date=new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'Europe/Paris'});
const plans={decouverte:'Découverte',passion:'Passion',illimite:'Illimité'};
let generation=0;
function showBooks(notices){
 const list=$('catalogue-notices');
 list.replaceChildren();
 for(const book of notices){
  const link=document.createElement('a');link.href='livre.html?id='+encodeURIComponent(book.book_id);
  link.style.cssText='display:flex;align-items:center;gap:.65rem;margin:.6rem 0';
  if(book.cover){
   const cover=document.createElement('img');
   try{const source=new URL(book.cover,location.href);if(source.protocol==='https:'||source.origin===location.origin){cover.src=source.href;cover.width=42;cover.alt='';link.append(cover);}}catch{}
  }
  const title=document.createElement('strong');title.textContent=book.title+' · '+book.author;
  link.append(title);list.append(link);
 }
 releases.hidden=!notices.length;
}
async function refresh(account,{loadSettings=false}={}){
 const turn=++generation;
 inbox.hidden=settings.hidden=!account;
 count.textContent='0';inbox.dataset.size='0';label.textContent='Notifications';
 $('proposal-latest-title').textContent='';$('proposal-latest-message').textContent='';showBooks([]);
 if(loadSettings){
  form.elements.app.checked=false;form.elements.email.checked=false;form.querySelector('button').disabled=true;
  $('notification-settings-status').textContent='';
  $('account-subscription-status').textContent='';$('account-subscription-link').hidden=true;$('account-subscription-dates').replaceChildren();
 }
 if(!account)return;
 const checks=[requestService('requests-unread',{},account),requestService('notification-preferences',{},account)];
 if(loadSettings)checks.push(requestService('status',{},account));
 const [proposals,preferences,billing]=await Promise.allSettled(checks);
 if(turn!==generation||auth.currentUser?.uid!==account.uid)return;
 if(proposals.status==='fulfilled'){
  const latest=proposals.value.latest;
  $('proposal-latest-title').textContent=latest?latest.title+' · '+latest.status:'Aucune mise à jour de proposition';
  $('proposal-latest-message').textContent=latest?.message||'';
 }
 if(preferences.status==='fulfilled'){
  const data=preferences.value;
  if(loadSettings){form.elements.app.checked=data.app;form.elements.email.checked=data.email;form.querySelector('button').disabled=false;}
  showBooks(data.notices||[]);
 }else if(loadSettings)$('notification-settings-status').textContent='Préférences indisponibles pour le moment.';
 const total=(proposals.value?.unread||0)+(preferences.value?.unread||0);
 count.textContent=total;inbox.dataset.size=String(Math.min(total,3));label.textContent=total?total+' notification'+(total===1?'':'s'):'Notifications';
 if(billing?.status==='fulfilled'){
  const info=billing.value.subscription,link=$('account-subscription-link'),dates=$('account-subscription-dates');
  $('abonnement-compte').querySelector('summary').textContent=info.complimentary?'Mes accès':'Mon abonnement et mes accès';
  $('account-subscription-status').textContent=info.complimentary?'Toutes les fonctionnalités sont activées directement pour ton compte.':info.access_level?'Formule '+(plans[info.access_plan]||info.access_plan):'Aucun abonnement actif';
  link.hidden=info.complimentary;
  link.textContent=info.access_level?'Gérer mon abonnement ↗':'Voir les formules ↗';
  link.href=info.access_level?'le-cercle.html#mon-abonnement':'le-cercle.html#comparatif';
  if(!info.complimentary&&info.access_level){
   for(const [name,value] of [['Début de l’abonnement',info.subscription_started_at],[info.cancel_at_period_end?'Fin de l’accès':'Prochain renouvellement',info.current_period_end]]){
    const term=document.createElement('dt'),definition=document.createElement('dd');
    term.textContent=name;definition.textContent=value?date.format(new Date(value)):'Date non communiquée';dates.append(term,definition);
   }
  }
 }else if(loadSettings)$('account-subscription-status').textContent='Informations d’abonnement indisponibles.';
}
onAccount(account=>refresh(account,{loadSettings:true}));
window.addEventListener('focus',()=>{if(auth.currentUser&&!form.querySelector('button').disabled)void refresh(auth.currentUser);});
form.onsubmit=async event=>{
 event.preventDefault();
 const account=auth.currentUser,button=form.querySelector('button');if(!account||button.disabled)return;
 button.disabled=true;
 try{
  await requestService('notification-preferences-save',{app:form.elements.app.checked,email:form.elements.email.checked},account);
  if(auth.currentUser?.uid!==account.uid)return;
  $('notification-settings-status').textContent='Préférences enregistrées.';
  await refresh(account);
 }catch(error){if(auth.currentUser?.uid===account.uid)$('notification-settings-status').textContent=error.message;}
 finally{if(auth.currentUser?.uid===account.uid)button.disabled=false;}
};
$('catalogue-notices-seen').onclick=async()=>{
 const account=auth.currentUser;if(!account)return;
 try{await requestService('catalogue-notifications-seen',{},account);await refresh(account);}
 catch(error){if(auth.currentUser?.uid===account.uid)label.textContent=error.message;}
};