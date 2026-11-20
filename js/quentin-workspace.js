import {onAccount,requestService} from './request-service.js';

const workspace=document.getElementById('quentin-workspace');
const inbox=document.getElementById('review-inbox');
const footerTemplate=document.getElementById('quentin-footer');
let footer;
let generation=0;
let unread=0;

document.addEventListener('ell-review-count',({detail})=>{
  unread=Number(detail)||0;
  const count=workspace.querySelector('[data-unread]');
  if(count)count.textContent=unread?' ('+unread+')':'';
});

onAccount(async account=>{
  const request=++generation;
  workspace.hidden=true;
  workspace.replaceChildren();
  inbox.hidden=true;
  footer?.remove();
  footer=null;
  if(account?.email?.toLowerCase()!=='quentinmorel1912@gmail.com')return;
  try{
    await account.getIdToken(account.emailVerified!==true);
    const {quentin}=await requestService('quentin-workspace',{},account);
    if(request!==generation)return;
    if(!quentin)throw Error('Compte non confirmé.');

    const heading=document.createElement('h2');
    heading.textContent='Espace Quentin';
    const navigation=document.createElement('nav');
    navigation.className='banner-actions';
    navigation.setAttribute('aria-label','Espace Quentin');
    const library=document.createElement('a');
    library.className='btn';
    library.href='bibliotheque-privee.html';
    library.textContent='Ma bibliothèque privée';
    const reviews=document.createElement('a');
    reviews.className='btn secondary';
    reviews.href='#critiques-recentes';
    reviews.textContent='Critiques des lecteurs';
    const count=document.createElement('span');
    count.dataset.unread='';
    count.textContent=unread?' ('+unread+')':'';
    reviews.append(count);
    navigation.append(library,reviews);
    workspace.append(heading,navigation);
    workspace.hidden=false;
    inbox.hidden=false;
    footer=footerTemplate.content.firstElementChild.cloneNode(true);
    footerTemplate.after(footer);
  }catch(error){
    if(request!==generation)return;
    const status=document.createElement('p');
    status.setAttribute('role','status');
    status.textContent=account.emailVerified?'Accès Quentin indisponible. Recharge la page pour réessayer.':'Vérifie ton adresse e-mail, puis reconnecte-toi pour ouvrir ton espace.';
    workspace.append(status);
    workspace.hidden=false;
  }
});
