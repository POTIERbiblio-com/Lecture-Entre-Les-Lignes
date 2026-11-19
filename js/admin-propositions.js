import {auth,onAccount,requestService,requestCard,labels} from './request-service.js';

const $=id=>document.getElementById(id), workspace=$('admin-workspace'), status=$('admin-access');
const managers=new Set(['quentinmorel1912@gmail.com','juliepotier2006@gmail.com']);
let records=[];
function render(account=auth.currentUser){
  const term=$('admin-search').value.trim().toLocaleLowerCase('fr');
  const filter=$('admin-filter').value;
  const result=$('admin-requests');
  $('admin-total').textContent=records.length;
  for(const key of Object.keys(labels))$('admin-'+key).textContent=records.filter(record=>record.status===key).length;
  result.replaceChildren();
  for(const record of records){
    if(filter!=='all'&&filter!==record.status)continue;
    if(![record.title,record.author,record.requester_email].join(' ').toLocaleLowerCase('fr').includes(term))continue;
    const card=requestCard(record,{admin:true,account});
    const form=document.createElement('form');
    form.innerHTML='<label>Décision<select name="status"><option value="pending">En attente</option><option value="validated">Validée</option><option value="unresolved">Non traitée</option></select></label><label>Motif<select name="reason"><option value="">—</option><option value="missing_details">Informations manquantes</option><option value="pdf_unavailable">PDF indisponible</option><option value="other">Autre motif</option></select></label><label>Message<textarea name="message" maxlength="3000" rows="3"></textarea></label><button>Enregistrer la réponse</button><p role="status"></p>';
    form.elements.status.value=record.status||'pending';
    form.elements.reason.value=record.reason||'';
    form.elements.message.value=record.admin_message||'';
    form.onsubmit=async event=>{
      event.preventDefault();
      const button=form.querySelector('button'), feedback=form.querySelector('[role=status]');
      button.disabled=true;
      try{
        const fields=Object.fromEntries(new FormData(form));
        const response=await requestService('requests-reply',{id:record.id,...fields},account);
        Object.assign(record,{status:fields.status,reason:fields.reason,admin_message:fields.message});
        if(auth.currentUser?.uid===account.uid){render(account);status.textContent=response.emailSent?'Réponse enregistrée et envoyée par e-mail.':'Réponse enregistrée dans le compte du lecteur.';}
      }catch(error){feedback.textContent=error.message;}
      finally{button.disabled=false;}
    };
    card.append(form);
    result.append(card);
  }
  if(!result.children.length)result.textContent='Aucune proposition à afficher.';
}
$('admin-search').oninput=()=>render();
$('admin-filter').onchange=()=>render();
onAccount(async account=>{
  records=[];workspace.hidden=true;$('admin-requests').replaceChildren();
  if(!account?.emailVerified||!managers.has(account.email?.toLowerCase())){
    status.textContent='Connecte-toi avec un compte administrateur dont l’adresse e-mail est vérifiée.';return;
  }
  status.textContent='Chargement des propositions…';
  try{
    const {requests}=await requestService('requests-list',{admin:true},account);
    if(auth.currentUser?.uid!==account.uid)return;
    records=requests;render(account);workspace.hidden=false;status.textContent='Propositions reçues';
  }catch(error){if(auth.currentUser?.uid===account.uid)status.textContent=error.message;}
});
