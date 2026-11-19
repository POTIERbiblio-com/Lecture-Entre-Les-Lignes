import {auth,onAccount,requestService,uploadAttachment,requestCard} from './request-service.js?v=decisions-20261119';

const $=id=>document.getElementById(id);
const form=$('request-form'), status=$('request-status'), list=$('my-requests');
let priorityOwner=null,priorityRefresh=0;
async function refreshPriority(account){
 const info=$('request-priority-info'),check=$('request-boost'),card=$('priority-card');
 if(!info||!check||!card)return;
 const turn=++priorityRefresh;
 const owner=account?.uid??null;
 const selected=owner&&priorityOwner===owner&&check.checked&&card.dataset.state!=='automatic';
 priorityOwner=owner;
 const cost=$('priority-cost'),plans=$('priority-plans');
 check.disabled=true;check.checked=Boolean(selected);
 card.dataset.state=account?'loading':'guest';
 cost.textContent='1 crédit utilisé à l’envoi';plans.hidden=false;
 info.textContent=account?'Vérification de tes crédits…':'Connecte-toi pour voir tes crédits.';
 if(!account)return;
 try{
  const {remaining,automatic,eligible}=await requestService('requests-priority-status',{},account);
  if(turn!==priorityRefresh||auth.currentUser?.uid!==owner)return;
  check.checked=automatic||Boolean(selected&&eligible&&remaining>0);
  check.disabled=automatic||!eligible||remaining===0;
  card.dataset.state=automatic?'automatic':!eligible?'locked':remaining===0?'empty':'ready';
  plans.hidden=automatic||(eligible&&remaining>0);
  cost.textContent=automatic?'Priorité appliquée à chaque envoi':eligible?'1 crédit utilisé à l’envoi':'Fonctionnalité des formules payantes';
  info.textContent=automatic?'Priorité automatique activée':!eligible?'Incluse avec Découverte, Passion et Illimité.':remaining===0?'Aucun crédit restant ce mois-ci.':remaining+' crédit'+(remaining===1?' restant':'s restants')+' ce mois-ci';
 }catch(error){if(turn===priorityRefresh&&auth.currentUser?.uid===owner)info.textContent=error.message;}
}
let records=[],owner=null,requestSequence=0;
const sort=$('request-history-sort');
function drawHistory(account){
 const order=sort?.value||'recent';
 const ordered=[...records].sort((a,b)=>order==='title'?a.title.localeCompare(b.title,'fr'):order==='oldest'?new Date(a.created_at)-new Date(b.created_at):new Date(b.created_at)-new Date(a.created_at));
 if(!ordered.length){list.textContent='Aucune proposition pour le moment.';return;}
 const track=document.createElement('div');track.className='proposal-track';track.tabIndex=0;track.setAttribute('aria-label','Historique défilant des propositions');
 const navigation=document.createElement('div');navigation.className='proposal-history-actions';
 const position=document.createElement('span');position.setAttribute('aria-live','polite');
 for(const record of ordered){
  const slide=document.createElement('div');slide.className='proposal-slide';
  const date=document.createElement('small');date.textContent='Proposée le '+new Date(record.created_at).toLocaleDateString('fr-FR');
  slide.append(date,requestCard(record,{account}));track.append(slide);
 }
 const buttons=[-1,1].map((step,index)=>{
  const button=document.createElement('button');button.type='button';button.className='btn secondary';
  button.textContent=index?'Suivante →':'← Précédente';
  button.onclick=()=>track.scrollBy({left:step*track.clientWidth,behavior:'smooth'});
  return button;
 });
 function update(){
  const index=Math.min(ordered.length-1,Math.max(0,Math.round(track.scrollLeft/track.clientWidth)||0));
  position.textContent=(index+1)+' / '+ordered.length;
  buttons[0].disabled=index===0;buttons[1].disabled=index===ordered.length-1;
 }
 track.addEventListener('scroll',update,{passive:true});
 let drag=null;
 track.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('button,a,summary,input,textarea'))return;
  drag={id:event.pointerId,x:event.clientX,left:track.scrollLeft};track.setPointerCapture(event.pointerId);track.classList.add('is-dragging');
 });
 track.addEventListener('pointermove',event=>{if(drag?.id===event.pointerId)track.scrollLeft=drag.left+drag.x-event.clientX;});
 function finish(event){
  if(drag?.id!==event.pointerId)return;
  drag=null;track.classList.remove('is-dragging');
  track.scrollTo({left:Math.round(track.scrollLeft/track.clientWidth)*track.clientWidth,behavior:'smooth'});
 }
 track.addEventListener('pointerup',finish);track.addEventListener('pointercancel',finish);
 navigation.append(buttons[0],position,buttons[1]);navigation.hidden=ordered.length<2;
 list.replaceChildren(track,navigation);update();
}
if(sort)sort.onchange=()=>{if(owner)drawHistory(owner);};
let markSeen=new URLSearchParams(location.search).get('notifications')==='1';
async function refresh(account){
 const sequence=++requestSequence;
 void refreshPriority(account);
 if(!records.length)list.textContent='Chargement de tes propositions…';
 try{
  const {requests}=await requestService('requests-list',{},account);
  if(auth.currentUser?.uid!==account.uid||sequence!==requestSequence)return;
  records=requests;owner=account;drawHistory(account);
  if(markSeen){markSeen=false;try{await requestService('requests-mark-seen',{},account);}catch(error){console.warn(error);}}
 }catch(error){if(auth.currentUser?.uid===account.uid&&sequence===requestSequence)list.textContent='Suivi indisponible. '+error.message;}
}
window.addEventListener('focus',()=>{if(auth.currentUser)void refresh(auth.currentUser);});
onAccount(account=>{
  if(!account)void refreshPriority(null);
  requestSequence++;records=[];owner=null;
  list.replaceChildren();
  $('request-success').hidden=true;
  $('request-member').hidden=!account;
  $('request-login').hidden=!!account;
  status.textContent=account?'Connecté avec '+account.email:'Connecte-toi pour envoyer et suivre tes demandes.';
  if(account)refresh(account);
});
form.onsubmit=async event=>{
  event.preventDefault();
  const account=auth.currentUser,button=$('send-request'),fields=new FormData(form);
  if(!account||button.disabled)return;
  const boost=$('request-boost')?.checked===true;
  $('request-success').hidden=true;
  button.disabled=true;
  try{
    const data=Object.fromEntries([...fields].filter(([,value])=>typeof value==='string').map(([key,value])=>[key,value.trim()]));
    if(!data.title)throw Error('Indique le titre du livre.');
    const cover=fields.get('cover'),pdf=fields.get('pdf');
    if(cover.size&&(cover.size>3*1024*1024||!['image/jpeg','image/png','image/webp'].includes(cover.type)))throw Error('Couverture JPG, PNG ou WebP de 3 Mo maximum.');
    if(pdf.size&&(pdf.size>20*1024*1024||await pdf.slice(0,5).text()!=='%PDF-'))throw Error('Choisis un PDF valide de 20 Mo maximum.');
    status.textContent=cover.size||pdf.size?'Envoi des pièces jointes…':'Enregistrement…';
    const [coverPath,pdfPath]=await Promise.all([uploadAttachment(cover,'cover',account),uploadAttachment(pdf,'pdf',account)]);
    status.textContent='Enregistrement…';
    const {boosted}=await requestService('requests-create',{data,coverPath,pdfPath,pdfName:pdf.name,boost},account);
    if(auth.currentUser?.uid!==account.uid)return;
    form.reset();
    status.textContent=boosted?'Proposition enregistrée en tête de liste.':'Proposition enregistrée.';
    $('request-success').hidden=false;
    await refresh(account);
  }catch(error){
    if(auth.currentUser?.uid===account.uid)status.textContent='Envoi impossible. '+error.message;
  }finally{button.disabled=false;}
};
