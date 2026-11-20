import {watchAdministration} from './admin-session.js';
import {auth,requestService} from './request-service.js?v=pieces-jointes-20261120';
import {uploadCataloguePdf} from './catalogue-access.js';
const GENRES={"fiction":["Fiction",["Roman contemporain","Imaginaire","Suspense","Amour et relations","Histoire et aventure","BD et manga","Poésie et théâtre","Contes et nouvelles","Horreur"]],"savoirs":["Savoirs",["Sciences","Psychologie","Philosophie","Histoire","Économie et politique","Management et entrepreneuriat","Informatique et numérique","Langues et apprentissage"]],"arts":["Arts",["Musique","Cinéma","Architecture","Peinture et photographie","Littérature et critique"]],"vie-et-societe":["Vie et société",["Biographies","Témoignages","Vie pratique","Sociologie","Finances personnelles","Développement personnel","Relations et communication"]],"spiritualites":["Spiritualités et religions",["Religions","Spiritualités","Mythes","Ésotérisme"]],"jeunesse":["Jeunesse et pédagogie",["Albums","Romans jeunesse","Documentaires","Apprentissage","Magazines et BD jeunesse"]],"voyages":["Voyages et nature",["Récits de voyage","Nature et écologie","Aventure et plein air"]],"creativite":["Créativité et loisirs",["Écriture et carnets","Arts manuels","Mode et design"]],"magazine":["Magazine",["Culture, arts et littérature","Mode et design","Sciences et découvertes","Actualité et société","Voyages et nature","Bien-être et vie pratique","BD et jeunesse"]],"manga":["Manga et BD",["Mangas, BD et romans graphiques"]],"a-classer":["À classer",["Sans sous-genre"]]};
const $=id=>document.getElementById(id);
const form=document.getElementById('publication-form');
const message=document.getElementById('publication-message');
const chapters=document.getElementById('publication-chapters');
const fields=form.elements;
const addChapter=document.getElementById('add-chapter');
const submit=form.querySelector('[type=submit]');
let draft=null;
const privateLevel='quentin-only';
const params=new URLSearchParams(location.search);
const editId=params.get('modifier');
const privateRequested=Boolean(editId)||params.get('selection')==='privee';
if(privateRequested){
  $('publication-title').textContent=editId?'Modifier un livre privé':'Ajouter un livre privé';
  $('publication-intro').textContent=editId?'Modifie la fiche ou remplace les fichiers.':'Ajoute le PDF, la couverture et ta fiche à la bibliothèque privée.';
  $('publication-audience').hidden=true;
}
if(editId){
  $('publication-pdf-label').textContent='Nouveau PDF (facultatif)';
  fields.pdf.required=false;
  fields.rights.required=false;
}
const isQuentin=account=>account?.emailVerified===true&&account.email?.toLowerCase()==='quentinmorel1912@gmail.com';
const proposalId=new URLSearchParams(location.search).get('proposition');
const audienceNote=document.getElementById('publication-private-note');
function updateAudience(){
  const privateSelection=fields.level.value===privateLevel;
  audienceNote.hidden=!privateSelection;
  $('private-review-url').hidden=!privateSelection;
  submit.textContent=editId?'Enregistrer les modifications':privateSelection?'Ajouter à ma bibliothèque':'Publier le livre';
}
fields.level.addEventListener('change',updateAudience);

for(const [slug,[label]] of Object.entries(GENRES))fields.genre.add(new Option(label,slug));
fields.genre.value='a-classer';
function subgenres(){
  fields.sub.replaceChildren(...GENRES[fields.genre.value][1].map((label,index)=>new Option(label,index)));
}
fields.genre.onchange=subgenres;
subgenres();
fields.reviewUrl.oninput=()=>{
  const required=!!fields.reviewUrl.value.trim();
  fields.rating.required=required;
  fields.ratingCount.required=required;
};
function appendChapter(values={}){
  const field=document.getElementById('chapter-template').content.firstElementChild.cloneNode(true);
  field.querySelector('button').onclick=()=>{field.remove();addChapter.disabled=false;};
  chapters.append(field);
  addChapter.disabled=chapters.childElementCount>=100;
  for(const key of ['title','page','summary'])field.querySelector('[name=chapter-'+key+']').value=values[key]??'';
  return field;
}
addChapter.onclick=()=>appendChapter().querySelector('input').focus();
watchAdministration({status:message,onClosed(){
  form.hidden=true;
  fields.level.querySelector('option[value="quentin-only"]')?.remove();
  form.reset();
  updateAudience();
  fields.genre.value='a-classer';
  chapters.replaceChildren();
  addChapter.disabled=false;
  fields.reviewUrl.oninput();
  const query=new URLSearchParams(location.search);
  fields.title.value=(query.get('title')||'').slice(0,180);
  fields.author.value=(query.get('author')||'').slice(0,150);
  if(Object.hasOwn(GENRES,query.get('genre')))fields.genre.value=query.get('genre');
  subgenres();
  if(Array.from(fields.sub.options).some(option=>option.value===query.get('sub')))fields.sub.value=query.get('sub');
  draft=null;
  $('proposal-prefill').hidden=true;
},async onReady(account,changed,isCurrent){
  if(privateRequested&&!isQuentin(auth.currentUser)){
    form.hidden=true;
    message.textContent='La sélection privée est réservée au compte de Quentin.';
    return;
  }
  if(isQuentin(auth.currentUser)&&!fields.level.querySelector('option[value="quentin-only"]')){
    fields.level.add(new Option('Sélection privée de Quentin',privateLevel));
    if(privateRequested){
      fields.level.value=privateLevel;
      fields.level.closest('details').open=true;
    }
  }
  updateAudience();
  if(editId){
    const {books}=await requestService('quentin-private-selection',{bookId:editId},account);
    if(!isCurrent())return;
    const ficha=books[0]?.ficha;
    if(!ficha){message.textContent='Livre privé introuvable.';return;}
    if(changed||form.hidden){
      for(const name of ['title','author','genre','summary','presentation'])fields[name].value=ficha[name]||'';
      if(!fields.genre.value)fields.genre.value='a-classer';
      subgenres();
      fields.sub.value=String(ficha.sub??0);
      for(const [name,value] of Object.entries(ficha.edition||{})){
        if(fields['edition-'+name])fields['edition-'+name].value=value??'';
      }
      fields.referenceUrl.value=ficha.sources?.find(source=>source.url)?.url||'';
      fields.privateReviewUrl.value=ficha.reviewLinks?.[0]||'';
      fields.reviewUrl.value=ficha.external?.url||'';
      fields.rating.value=ficha.external?.rating??'';
      fields.ratingCount.value=ficha.external?.count??'';
      fields.comments.value=ficha.external?.comments??'';
      fields.reviewUrl.oninput();
      chapters.replaceChildren();
      (ficha.chapters||[]).forEach(appendChapter);
      $('publication-remove-cover').hidden=!ficha.cover;
      fields.pdf.onchange=()=>{fields.rights.required=fields.pdf.files.length>0||fields.cover.files.length>0;};
      fields.cover.onchange=()=>{fields.rights.required=fields.pdf.files.length>0||fields.cover.files.length>0;};
    }
    form.hidden=false;
    message.textContent='Livre privé chargé.';
    return;
  }
  if(proposalId){
    form.hidden=true;
    message.textContent='Chargement de la proposition et contrôle des pièces jointes…';
    const {draft:proposal}=await requestService('requests-publication-draft',{id:proposalId},account);
    if(!isCurrent())return;
    const details=proposal.details||{}, workflow=proposal.workflow||{};
    fields.title.value=(workflow.title||proposal.title||'').slice(0,180);
    fields.author.value=(workflow.author||proposal.author||'').slice(0,150);
    const normalize=value=>String(value||'').normalize('NFD').replace(/\p{M}/gu,'').trim().toLowerCase();
    const category=Object.entries(GENRES).find(([slug,[label]])=>[slug,label].some(name=>normalize(name)===normalize(details.genre)));
    fields.genre.value=workflow.genre&&Object.hasOwn(GENRES,workflow.genre)?workflow.genre:category?.[0]||'a-classer';
    subgenres();
    const guessed=GENRES[fields.genre.value][1].findIndex(label=>normalize(label)===normalize(details.subgenre));
    const sub=workflow.sub!==''&&workflow.sub!=null?String(workflow.sub):String(guessed);
    if(Array.from(fields.sub.options).some(option=>option.value===sub))fields.sub.value=sub;
    fields.summary.value=details.summary||'';
    fields['edition-year'].value=details.publicationDate||'';
    fields['edition-isbn'].value=details.isbn||'';
    fields['edition-language'].value=details.language||'';
    const note=[details.edition,details.price&&'Prix indiqué : '+details.price,details.details].filter(Boolean).join(' · ');
    fields['edition-note'].value=note.slice(0,250);
    fields.referenceUrl.value=details.referenceUrl||'';
    const report=$('proposal-prefill');
    report.hidden=false;
    report.textContent=note;
    const files=[['pdf',proposal.hasPdf],['cover',proposal.hasCover]].filter(([,present])=>present);
    const loaded=await Promise.allSettled(files.map(async ([type])=>{
      const blob=await requestService('requests-file',{id:proposalId,fileType:type},account);
      return [type,blob];
    }));
    if(!isCurrent())return;
    const warnings=[];
    for(const [index,result] of loaded.entries()){
      if(result.status==='rejected'){warnings.push(files[index][0]==='pdf'?'PDF : '+result.reason.message:'Couverture : '+result.reason.message);continue;}
      const [type,blob]=result.value;
      const extension=({'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[blob.type];
      if(!extension){warnings.push('Format de pièce jointe inattendu.');continue;}
      const transfer=new DataTransfer();
      transfer.items.add(new File([blob],(type==='pdf'?'proposition':'couverture')+'.'+extension,{type:blob.type}));
      fields[type].files=transfer.files;
    }
    form.hidden=false;
    message.textContent=warnings.length?warnings.join(' · '):'Proposition reprise. Vérifie la fiche avant de publier.';
    return;
  }
  form.hidden=false;
  message.textContent='Compte administrateur vérifié. Tu peux publier le livre.';
}});

form.onsubmit=async event=>{
  event.preventDefault();
  const account=auth.currentUser;
  const values=new FormData(form);
  const privateSelection=values.get('level')===privateLevel;
  if((privateSelection||privateRequested)&&!isQuentin(account))return;
  if(privateRequested&&!privateSelection){
    message.textContent='Sélectionne l’accès privé pour ajouter ce livre à ta sélection.';
    return;
  }
  const cover=values.get('cover'),pdf=values.get('pdf');
  const coverType=cover?.type||'';
  if(cover?.size&&(!['image/jpeg','image/png','image/webp'].includes(coverType)||cover.size>8*1024*1024)){
    message.textContent='Choisis une couverture JPEG, PNG ou WebP de 8 Mo maximum.';
    return;
  }
  if((!editId&&!pdf?.size)||(pdf?.size&&(pdf.size>100*1024*1024||await pdf.slice(0,5).text()!=='%PDF-'))){
    message.textContent='Choisis un fichier PDF valide de 100 Mo maximum.';
    return;
  }
  if((!editId||pdf?.size||cover?.size)&&!values.get('rights')){message.textContent='Confirme les droits pour les fichiers ajoutés.';return;}
  if(!account||auth.currentUser?.uid!==account.uid)return;
  if(!draft||draft.privateSelection!==privateSelection)draft={id:editId||'edition-'+crypto.randomUUID(),pdf:null,cover:null,privateSelection};
  const publication=draft;
  submit.disabled=true;
  const payload=Object.fromEntries([...values].filter(([name,value])=>typeof value==='string'&&!/^(chapter-|edition-)/.test(name)));
  payload.removeCover=values.has('removeCover');
  payload.edition=Object.fromEntries([...values].filter(([name])=>name.startsWith('edition-')).map(([name,value])=>[name.slice(8),value]));
  payload.chapters=Array.from(chapters.children,field=>Object.fromEntries(['title','page','summary'].map(name=>[name,field.querySelector('[name=chapter-'+name+']').value])));
  try{
    if(privateSelection&&cover?.size){
      message.textContent='Préparation de la couverture privée…';
      const bitmap=await createImageBitmap(cover);
      try{
        const scale=Math.min(1,400/bitmap.width,600/bitmap.height);
        const canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.floor(bitmap.width*scale));
        canvas.height=Math.max(1,Math.floor(bitmap.height*scale));
        canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
        payload.privateCover=canvas.toDataURL('image/jpeg',.78);
        if(payload.privateCover.length>240000)throw Error('Cette couverture compressée dépasse la limite.');
      }finally{bitmap.close();}
    }else if(cover?.size&&publication.cover!==cover.name+'|'+cover.size+'|'+cover.lastModified){
      message.textContent='Envoi de la couverture…';
      const {path,token}=await requestService('editorial-cover-upload',{bookId:publication.id,coverType},account);
      const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      const storage=createClient('https://cezgcoaokwuobipwfffa.supabase.co','sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3',{auth:{persistSession:false}}).storage;
      const {error}=await storage.from('book-covers').uploadToSignedUrl(path,token,cover,{contentType:coverType});
      if(error)throw error;
      publication.cover=cover.name+'|'+cover.size+'|'+cover.lastModified;
    }
    const fileKey=pdf.name+'|'+pdf.size+'|'+pdf.lastModified;
    if(pdf?.size&&publication.pdf!==fileKey&&!editId){
      message.textContent='Envoi du PDF vers le stockage privé…';
      await uploadCataloguePdf(publication.id,pdf,account);
      publication.pdf=fileKey;
    }
    message.textContent=editId?'Enregistrement de la fiche…':privateSelection?'Ajout à ta sélection privée…':'Publication dans le catalogue…';
    const {id}=await requestService(editId?'quentin-private-update':'editorial-publish',{...payload,bookId:publication.id,coverType:!privateSelection&&cover?.size?coverType:''},account);
    if(editId&&pdf?.size&&publication.pdf!==fileKey){
      try{
        message.textContent='Remplacement du PDF privé…';
        await uploadCataloguePdf(id,pdf,account);
        publication.pdf=fileKey;
      }catch(error){throw Error('Fiche enregistrée. Le PDF précédent est encore disponible. '+error.message);}
    }
    if(auth.currentUser?.uid!==account.uid)return;
    if(privateSelection){location.assign('livre.html?id='+encodeURIComponent(id));return;}
    const filters=new URLSearchParams({genre:payload.genre,sub:payload.sub,publie:id});
    const destination='mes-livres.html?'+filters+'#books';
    const proposal=new URLSearchParams(location.search).get('proposition');
    if(proposal){
      try{
        await requestService('requests-reply',{id:proposal,decision:'published',bookId:id,title:payload.title,author:payload.author,genre:payload.genre,sub:payload.sub},account);
      }catch(error){
        const link=document.createElement('a');link.href=destination;link.textContent='Voir le livre publié';
        message.replaceChildren('Livre publié. Mise à jour de la proposition indisponible · '+error.message+' ',link);
        return;
      }
    }
    location.assign(destination);
  }catch(error){if(auth.currentUser?.uid===account.uid)message.textContent=error.message;}
  finally{submit.disabled=false;}
};