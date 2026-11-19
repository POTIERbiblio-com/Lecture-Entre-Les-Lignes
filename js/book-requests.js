import {auth,onAccount,requestService,uploadAttachment,requestCard} from './request-service.js';

const $=id=>document.getElementById(id);
const form=$('request-form'), status=$('request-status'), list=$('my-requests');
async function refresh(account){
  list.textContent='Chargement de tes propositions…';
  try{
    const {requests}=await requestService('requests-list',{},account);
    if(auth.currentUser?.uid!==account.uid)return;
    list.replaceChildren(...requests.map(record=>requestCard(record,{account})));
    if(!requests.length)list.textContent='Aucune proposition pour le moment.';
  }catch(error){
    if(auth.currentUser?.uid===account.uid)list.textContent='Suivi indisponible. '+error.message;
  }
}
onAccount(account=>{
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
    await requestService('requests-create',{data,coverPath,pdfPath,pdfName:pdf.name},account);
    if(auth.currentUser?.uid!==account.uid)return;
    form.reset();
    status.textContent='Proposition enregistrée.';
    $('request-success').hidden=false;
    await refresh(account);
  }catch(error){
    if(auth.currentUser?.uid===account.uid)status.textContent='Envoi impossible. '+error.message;
  }finally{button.disabled=false;}
};
