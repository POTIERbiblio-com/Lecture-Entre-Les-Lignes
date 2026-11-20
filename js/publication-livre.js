import {watchAdministration} from './admin-session.js';
import {auth,requestService} from './request-service.js?v=decisions-20261119';
import {uploadCataloguePdf} from './catalogue-access.js';
const GENRES={"fiction":["Fiction",["Roman contemporain","Imaginaire","Suspense","Amour et relations","Histoire et aventure","BD et manga","Poésie et théâtre","Contes et nouvelles","Horreur"]],"savoirs":["Savoirs",["Sciences","Psychologie","Philosophie","Histoire","Économie et politique","Management et entrepreneuriat","Informatique et numérique","Langues et apprentissage"]],"arts":["Arts",["Musique","Cinéma","Architecture","Peinture et photographie"]],"vie-et-societe":["Vie et société",["Biographies","Témoignages","Vie pratique","Sociologie","Finances personnelles","Développement personnel","Relations et communication"]],"spiritualites":["Spiritualités et religions",["Religions","Spiritualités","Mythes","Ésotérisme"]],"jeunesse":["Jeunesse et pédagogie",["Albums","Romans jeunesse","Documentaires","Apprentissage"]],"voyages":["Voyages et nature",["Récits de voyage","Nature et écologie","Aventure et plein air"]],"creativite":["Créativité et loisirs",["Écriture et carnets","Arts manuels","Mode et design"]],"magazine":["Magazine",["Culture, arts et littérature","Mode et design","Sciences et découvertes","Actualité et société","Voyages et nature","Bien-être et vie pratique"]],"manga":["Manga et BD",["Mangas, BD et romans graphiques"]],"a-classer":["À classer",["Sans sous-genre"]]};
const form=document.getElementById('publication-form');
const message=document.getElementById('publication-message');
const chapters=document.getElementById('publication-chapters');
const fields=form.elements;
const addChapter=document.getElementById('add-chapter');
const submit=form.querySelector('[type=submit]');
let draft=null;
const privateLevel='quentin-only';
const isQuentin=account=>account?.emailVerified===true&&account.email?.toLowerCase()==='quentinmorel1912@gmail.com';
const coverLabel=fields.cover.closest('label');
const audienceNote=document.getElementById('publication-private-note');
function updateAudience(){
  const privateSelection=fields.level.value===privateLevel;
  fields.cover.disabled=privateSelection;
  coverLabel.hidden=privateSelection;
  audienceNote.hidden=!privateSelection;
  submit.textContent=privateSelection?'Ajouter à ma sélection privée':'Publier le livre';
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
addChapter.onclick=()=>{
  const field=document.getElementById('chapter-template').content.firstElementChild.cloneNode(true);
  field.querySelector('button').onclick=()=>{field.remove();addChapter.disabled=false;};
  chapters.append(field);
  addChapter.disabled=chapters.childElementCount>=100;
  field.querySelector('input').focus();
};
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
},onReady(){
  if(isQuentin(auth.currentUser)&&!fields.level.querySelector('option[value="quentin-only"]')){
    fields.level.add(new Option('Sélection privée de Quentin',privateLevel));
    if(new URLSearchParams(location.search).get('selection')==='privee'){
      fields.level.value=privateLevel;
      fields.level.closest('details').open=true;
    }
  }
  updateAudience();
  form.hidden=false;
  message.textContent='Compte administrateur vérifié. Tu peux publier le livre.';
}});

form.onsubmit=async event=>{
  event.preventDefault();
  const account=auth.currentUser;
  const values=new FormData(form);
  const privateSelection=values.get('level')===privateLevel;
  if(privateSelection&&!isQuentin(account))return;
  const cover=values.get('cover'),pdf=values.get('pdf');
  const coverType=cover?.type||'';
  if(cover?.size&&(!['image/jpeg','image/png','image/webp'].includes(coverType)||cover.size>8*1024*1024)){
    message.textContent='Choisis une couverture JPEG, PNG ou WebP de 8 Mo maximum.';
    return;
  }
  if(!pdf.size||pdf.size>100*1024*1024||await pdf.slice(0,5).text()!=='%PDF-'){
    message.textContent='Choisis un fichier PDF valide de 100 Mo maximum.';
    return;
  }
  if(!values.get('rights')||!account||auth.currentUser?.uid!==account.uid)return;
  if(!draft||draft.privateSelection!==privateSelection)draft={id:'edition-'+crypto.randomUUID(),pdf:null,cover:null,privateSelection};
  const publication=draft;
  submit.disabled=true;
  const payload=Object.fromEntries([...values].filter(([name,value])=>typeof value==='string'&&!/^(chapter-|edition-)/.test(name)));
  payload.edition=Object.fromEntries([...values].filter(([name])=>name.startsWith('edition-')).map(([name,value])=>[name.slice(8),value]));
  payload.chapters=Array.from(chapters.children,field=>Object.fromEntries(['title','page','summary'].map(name=>[name,field.querySelector('[name=chapter-'+name+']').value])));
  try{
    if(cover?.size&&publication.cover!==cover.name+'|'+cover.size+'|'+cover.lastModified){
      message.textContent='Envoi de la couverture…';
      const {path,token}=await requestService('editorial-cover-upload',{bookId:publication.id,coverType},account);
      const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      const storage=createClient('https://cezgcoaokwuobipwfffa.supabase.co','sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3',{auth:{persistSession:false}}).storage;
      const {error}=await storage.from('book-covers').uploadToSignedUrl(path,token,cover,{contentType:coverType});
      if(error)throw error;
      publication.cover=cover.name+'|'+cover.size+'|'+cover.lastModified;
    }
    const fileKey=pdf.name+'|'+pdf.size+'|'+pdf.lastModified;
    if(publication.pdf!==fileKey){
      message.textContent='Envoi du PDF vers le stockage privé…';
      await uploadCataloguePdf(publication.id,pdf,account);
      publication.pdf=fileKey;
    }
    message.textContent=privateSelection?'Ajout à ta sélection privée…':'Publication dans le catalogue…';
    const {id}=await requestService('editorial-publish',{...payload,bookId:publication.id,coverType:cover?.size?coverType:''},account);
    if(auth.currentUser?.uid!==account.uid)return;
    if(privateSelection){location.assign('mon-espace.html#quentin-selection');return;}
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