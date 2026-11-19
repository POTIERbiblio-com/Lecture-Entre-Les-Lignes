import {auth,onAccount,requestService} from './request-service.js';
import {catalogueRules,uploadCataloguePdf} from './catalogue-access.js';

const panel=document.getElementById('catalogue-access-admin');
const form=panel.querySelector('form'), status=panel.querySelector('[role=status]');
const fields=form.elements,restore=document.getElementById('catalogue-restore-book');
const administrators=new Set(['quentinmorel1912@gmail.com']);
let rules=new Map();
let privateBooks=new Set();
function selectBook(){
  const id=fields.bookId.value.trim(), rule=rules.get(id);
  fields.level.value=rule?.pending_access_level||rule?.access_level||0;
  restore.hidden=!(rule?.hidden||rule?.deleted);
  fields.visibility.value=rule?.deleted?'deleted':rule?.hidden?'hidden':'visible';
  status.textContent=rule?.pending_access_level?'PDF privé préparé. Cadenas en attente du retrait des copies publiques.':privateBooks.has(id)?'PDF privé disponible pour ce livre.':'PDF privé absent pour ce livre.';
}
fields.bookId.addEventListener('change',selectBook);
restore.onclick=async()=>{
 const account=auth.currentUser,bookId=fields.bookId.value.trim();
 if(!confirm('Remettre la fiche existante dans le catalogue avec ses informations et ses avis ?'))return;
 restore.disabled=true;
 try{
  const {rule}=await requestService('catalogue-restore',{bookId},account);
  if(auth.currentUser?.uid!==account.uid)return;
  rules.set(bookId,rule);selectBook();
  status.textContent='Fiche restaurée avec ses informations. '+status.textContent;
 }catch(error){status.textContent=error.message;}
 finally{restore.disabled=false;}
};
onAccount(async account=>{
  form.hidden=true;rules=new Map();privateBooks=new Set();status.textContent='Connecte-toi avec une adresse administrateur vérifiée.';
  if(!account?.emailVerified||!administrators.has(account.email?.toLowerCase()))return;
  status.textContent='Chargement du catalogue…';
  try{
    const [index,access]=await Promise.all([
      requestService('catalogue-private-index',{},account),catalogueRules(),
      (async()=>{
        const select=form.querySelector('datalist');
        select.replaceChildren();
        const add=book=>{const option=document.createElement('option');option.value=book.id;option.label=book.title;select.append(option);};
        const catalogue=await fetch('catalogue-favoris.json',{cache:'no-store'});
        if(catalogue.ok)for(const book of await catalogue.json())add(book);
      })()
    ]);
    if(auth.currentUser?.uid!==account.uid)return;
    rules=access;
    const select=form.querySelector('datalist');
    const indexed=new Set(Array.from(select.options,option=>option.value));
    for(const id of access.keys())if(!indexed.has(id))select.append(new Option(id,id));
    privateBooks=new Set(index.files.filter(file=>file.rights_attested).map(file=>file.book_id));
    form.hidden=false;
    const selected=new URLSearchParams(location.search).get('livre');
    if(selected&&/^[a-zA-Z0-9_-]{1,120}$/.test(selected)){fields.bookId.value=selected;selectBook();}
    else status.textContent='Choisis un identifiant de livre.';
  }catch(error){if(auth.currentUser?.uid===account.uid)status.textContent=error.message;}
});
form.onsubmit=async event=>{
  event.preventDefault();
  const account=auth.currentUser,bookId=fields.bookId.value.trim(),level=Number(fields.level.value);
  const hidden=fields.visibility.value==='hidden',deleted=fields.visibility.value==='deleted';
  const file=fields.pdf.files[0], button=form.querySelector('button');
  if(deleted&&!confirm('Retirer cette fiche du catalogue public ?'))return;
  if(level&&!hidden&&!deleted&&!confirm('Préparer le cadenas pour ce livre en conservant sa fiche, ses résumés et ses avis ?'))return;
  button.disabled=true;
  try{
    if(file){
      if(!fields.rights.checked)throw Error('Confirme les droits de diffusion avant d’importer le PDF.');
      status.textContent='Import du PDF privé…';
      await uploadCataloguePdf(bookId,file);
      privateBooks.add(bookId);
    }
    if(level&&!hidden&&!deleted&&!privateBooks.has(bookId)&&level!==rules.get(bookId)?.access_level)throw Error('Importe le PDF privé avant d’activer le cadenas.');
    const result=await requestService('catalogue-moderate',{bookId,level,hidden,deleted},account);
    if(auth.currentUser?.uid!==account.uid)return;
    rules.set(bookId,{book_id:bookId,access_level:result.pending?result.level:level,pending_access_level:result.pending?level:null,hidden,deleted});
    restore.hidden=!(hidden||deleted);
    fields.pdf.value='';
    fields.rights.checked=false;
    status.textContent=result.pending?'Cadenas préparé. Le PDF privé est enregistré et la fiche est conservée. Le retrait de la copie publique reste nécessaire pour activer le cadenas.':'Modification enregistrée sur la fiche existante.';
  }catch(error){status.textContent=error.message;}
  finally{button.disabled=false;}
};
