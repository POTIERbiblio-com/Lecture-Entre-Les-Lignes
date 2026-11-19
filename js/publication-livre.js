import {auth,onAccount,requestService} from './request-service.js';
import {uploadCataloguePdf} from './catalogue-access.js';
const GENRES={"fiction":["Fiction",["Roman contemporain","Imaginaire","Suspense","Amour et relations","Histoire et aventure","BD et manga","Poésie et théâtre","Contes et nouvelles","Horreur"]],"savoirs":["Savoirs",["Sciences","Psychologie","Philosophie","Histoire","Économie et politique","Management et entrepreneuriat","Informatique et numérique"]],"arts":["Arts",["Musique","Cinéma","Architecture","Peinture et photographie"]],"vie-et-societe":["Vie et société",["Biographies","Témoignages","Vie pratique","Sociologie","Finances personnelles","Développement personnel"]],"spiritualites":["Spiritualités et religions",["Religions","Spiritualités","Mythes","Ésotérisme"]],"jeunesse":["Jeunesse et pédagogie",["Albums","Romans jeunesse","Documentaires","Apprentissage"]],"voyages":["Voyages et nature",["Récits de voyage","Nature et écologie","Aventure et plein air"]],"creativite":["Créativité et loisirs",["Écriture et carnets","Arts manuels","Mode et design"]]};
const form=document.getElementById('publication-form');
const message=document.getElementById('publication-message');
const chapters=document.getElementById('publication-chapters');
const fields=form.elements;
const addChapter=document.getElementById('add-chapter');
const submit=form.querySelector('[type=submit]');
let draft=null;

for(const [slug,[label]] of Object.entries(GENRES))fields.genre.add(new Option(label,slug));
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
onAccount(async account=>{
  form.hidden=true;
  form.reset();
  chapters.replaceChildren();
  addChapter.disabled=false;
  fields.reviewUrl.oninput();
  const query=new URLSearchParams(location.search);
  if(Object.hasOwn(GENRES,query.get('genre')))fields.genre.value=query.get('genre');
  subgenres();
  if(Array.from(fields.sub.options).some(option=>option.value===query.get('sub')))fields.sub.value=query.get('sub');
  draft=null;
  message.textContent='Connecte-toi avec un compte administrateur vérifié.';
  if(!account)return;
  try{
    const {subscription}=await requestService('status',{},account);
    if(auth.currentUser?.uid!==account.uid||!subscription.admin)return;
    form.hidden=false;
    message.textContent='Complète la fiche et ajoute les fichiers pour publier le livre.';
  }catch(error){if(auth.currentUser?.uid===account.uid)message.textContent=error.message;}
});

form.onsubmit=async event=>{
  event.preventDefault();
  const account=auth.currentUser;
  const values=new FormData(form);
  const cover=values.get('cover'),pdf=values.get('pdf');
  const coverType=cover.type;
  if(!['image/jpeg','image/png','image/webp'].includes(coverType)||cover.size>8*1024*1024){
    message.textContent='Choisis une couverture JPEG, PNG ou WebP de 8 Mo maximum.';
    return;
  }
  if(!pdf.size||pdf.size>100*1024*1024||await pdf.slice(0,5).text()!=='%PDF-'){
    message.textContent='Choisis un fichier PDF valide de 100 Mo maximum.';
    return;
  }
  if(!values.get('rights')||!account||auth.currentUser?.uid!==account.uid)return;
  draft??={id:'edition-'+crypto.randomUUID(),pdf:null,cover:null};
  const publication=draft;
  submit.disabled=true;
  const payload=Object.fromEntries([...values].filter(([name,value])=>typeof value==='string'&&!/^(chapter-|edition-)/.test(name)));
  payload.edition=Object.fromEntries([...values].filter(([name])=>name.startsWith('edition-')).map(([name,value])=>[name.slice(8),value]));
  payload.chapters=Array.from(chapters.children,field=>Object.fromEntries(['title','page','summary'].map(name=>[name,field.querySelector('[name=chapter-'+name+']').value])));
  try{
    if(publication.cover!==cover.name+'|'+cover.size+'|'+cover.lastModified){
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
    message.textContent='Publication dans le catalogue…';
    const {id}=await requestService('editorial-publish',{...payload,bookId:publication.id,coverType},account);
    if(auth.currentUser?.uid!==account.uid)return;
    const link=document.createElement('a');
    link.href='livre.html?id='+encodeURIComponent(id);
    link.textContent='Ouvrir la fiche publiée';
    message.replaceChildren('Le livre a été publié. ',link);
    draft=null;
    form.reset();
    fields.reviewUrl.oninput();
    chapters.replaceChildren();
    addChapter.disabled=false;
    subgenres();
  }catch(error){if(auth.currentUser?.uid===account.uid)message.textContent=error.message;}
  finally{submit.disabled=false;}
};