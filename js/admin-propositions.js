import {watchAdministration} from './admin-session.js';
import {auth,requestService,requestCard,labels} from './request-service.js?v=decisions-20261119';

const $=id=>document.getElementById(id), workspace=$('admin-workspace'), status=$('admin-access');
const GENRES={"fiction":["Fiction",["Roman contemporain","Imaginaire","Suspense","Amour et relations","Histoire et aventure","BD et manga","Poésie et théâtre","Contes et nouvelles","Horreur"]],"savoirs":["Savoirs",["Sciences","Psychologie","Philosophie","Histoire","Économie et politique","Management et entrepreneuriat","Informatique et numérique"]],"arts":["Arts",["Musique","Cinéma","Architecture","Peinture et photographie"]],"vie-et-societe":["Vie et société",["Biographies","Témoignages","Vie pratique","Sociologie","Finances personnelles","Développement personnel"]],"spiritualites":["Spiritualités et religions",["Religions","Spiritualités","Mythes","Ésotérisme"]],"jeunesse":["Jeunesse et pédagogie",["Albums","Romans jeunesse","Documentaires","Apprentissage"]],"voyages":["Voyages et nature",["Récits de voyage","Nature et écologie","Aventure et plein air"]],"creativite":["Créativité et loisirs",["Écriture et carnets","Arts manuels","Mode et design"]]};
const decisions={pending:'À étudier',more_info:'Demander un complément',accepted:'Acceptée',queued:'En attente de mise en ligne',rejected:'Refusée',published:'Publiée'};
const decisionOf=record=>record.review_workflow?.decision||({validated:'accepted',unresolved:'rejected'}[record.status]||'pending');
let records=[], refresh;
function render(account=auth.currentUser){
 const filter=$('admin-filter').value,term=$('admin-search').value.trim().toLocaleLowerCase('fr');
 const result=$('admin-requests');
 $('admin-total').textContent=records.length;
 for(const key of ['pending','accepted','queued','rejected'])$('admin-'+key).textContent=records.filter(record=>decisionOf(record)===key).length;
 const matches=records.filter(record=>(filter==='all'||decisionOf(record)===filter)&&[record.title,record.author,record.requester_email].join(' ').toLocaleLowerCase('fr').includes(term));
 if($('admin-sort').value==='title')matches.sort((a,b)=>a.title.localeCompare(b.title,'fr'));
 if($('admin-sort').value==='oldest')matches.reverse();
 result.replaceChildren();
 for(const record of matches){
  const card=requestCard(record,{admin:true,account}), workflow=record.review_workflow||{};
  if(['accepted','queued'].includes(workflow.decision)){
   const publish=document.createElement('a');
   publish.className='btn';publish.textContent='Préparer la publication ↗';
   publish.href='publier-livre.html?'+new URLSearchParams({proposition:record.id,title:workflow.title,author:workflow.author,genre:workflow.genre,sub:workflow.sub});
   card.append(publish);
  }
  const form=document.createElement('form');
  form.innerHTML='<label>Décision<select name="decision"></select></label><fieldset><legend>Classement du livre</legend><label>Titre<input name="title" maxlength="180"></label><label>Auteur<input name="author" maxlength="150"></label><label>Genre<select name="genre"></select></label><label>Sous-genre<select name="sub"></select></label></fieldset><label>Message au lecteur<textarea name="message" maxlength="3000" rows="3"></textarea></label><button class="btn">Envoyer la décision</button><p role="status"></p>';
  const fields=form.elements;
  for(const [key,label] of Object.entries(decisions))if(key!=='published')fields.decision.add(new Option(label,key));
  fields.decision.value=workflow.decision==='published'?'accepted':decisionOf(record);
  fields.title.value=workflow.title||record.title;
  fields.author.value=workflow.author||record.author||'';
  fields.genre.add(new Option('Choisir un genre',''));
  for(const [key,[label]] of Object.entries(GENRES))fields.genre.add(new Option(label,key));
  fields.genre.value=workflow.genre||'';
  function setSubgenres(){fields.sub.replaceChildren(new Option('Choisir un sous-genre',''),...(GENRES[fields.genre.value]?.[1]||[]).map((label,index)=>new Option(label,index)));}
  fields.genre.onchange=setSubgenres;setSubgenres();fields.sub.value=workflow.sub??'';
  function updateRequirements(){
   const accepted=['accepted','queued'].includes(fields.decision.value);
   for(const name of ['title','author','genre','sub'])fields[name].required=accepted;
   fields.message.required=['rejected','more_info'].includes(fields.decision.value);
  }
  fields.decision.onchange=updateRequirements;updateRequirements();
  form.onsubmit=async event=>{
   event.preventDefault();
   const button=form.querySelector('button'),feedback=form.querySelector('[role=status]');
   button.disabled=true;
   try{
    const response=await requestService('requests-reply',{id:record.id,...Object.fromEntries(new FormData(form))},account);
    if(auth.currentUser?.uid!==account.uid)return;
    await refresh();
    status.prepend(response.emailSent?'Message déposé dans le compte et envoyé par e-mail. ':'Message déposé dans le compte du lecteur. ');
   }catch(error){feedback.textContent=error.message;}
   finally{button.disabled=false;}
  };
  card.append(form);result.append(card);
 }
 if(!matches.length)result.textContent='Aucune proposition à afficher.';
}
for(const id of ['admin-search','admin-filter','admin-sort'])$(id).oninput=()=>render();
refresh=watchAdministration({status,onClosed(){
 records=[];workspace.hidden=true;$('admin-requests').replaceChildren();
},async onReady(account,changed,isCurrent){
 const {requests}=await requestService('requests-list',{admin:true},account);
 if(!isCurrent())return;
 records=requests;render(account);workspace.hidden=false;status.textContent='Propositions reçues';
 const button=document.createElement('button');
 button.type='button';button.className='btn secondary';button.textContent='Actualiser';button.onclick=refresh;
 status.append(' ',button);
}});
