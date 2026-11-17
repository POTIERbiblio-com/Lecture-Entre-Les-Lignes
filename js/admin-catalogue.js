import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {getAuth,onAuthStateChanged,getIdTokenResult} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {getFirestore,collection,doc,getDocs,query,where,setDoc,addDoc,deleteDoc,writeBatch} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const config={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const app=getApps().length?getApp():initializeApp(config);
const auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id);
const msg=t=>{$('admin-msg').textContent=t;};
const GENRES={
 'Fiction':['Roman contemporain','Imaginaire','Suspense','Amour et relations','Histoire et aventure','BD et manga','Poésie et théâtre','Contes et nouvelles','Horreur'],
 'Savoirs':['Sciences','Psychologie','Philosophie','Histoire','Économie et politique','Management et entrepreneuriat','Informatique et numérique'],
 'Arts':['Musique','Cinéma','Architecture','Peinture et photographie'],
 'Vie et société':['Biographies','Témoignages','Vie pratique','Sociologie','Finances personnelles','Développement personnel'],
 'Spiritualités et religions':['Religions','Spiritualités','Mythes','Ésotérisme'],
 'Jeunesse et pédagogie':['Albums','Romans jeunesse','Documentaires','Apprentissage']
};
const genreSelect=$('category-select'),subSelect=$('subcategory-select');
for(const name of Object.keys(GENRES))genreSelect.add(new Option(name,name));
function refreshSubgenres(value=''){
 subSelect.replaceChildren(new Option('Choisir un sous-genre existant',''));
 for(const name of GENRES[genreSelect.value]||[])subSelect.add(new Option(name,name));
 if(value&&GENRES[genreSelect.value]?.includes(value))subSelect.value=value;
}
genreSelect.addEventListener('change',()=>refreshSubgenres());
function publicationState(published){$('publication-status').textContent=published?'Publié dans Firestore · visibilité publique à vérifier':'Brouillon · Non publié';$('publish-book').disabled=!current||!!published;$('unpublish-book').disabled=!current||!published;}
let books=[],chapters=[],current=null,chapter=null,ready=false;
const fields=form=>Object.fromEntries(new FormData(form).entries());
function showError(e){console.error('Catalogue Firebase:',e);msg('Impossible d’enregistrer : '+(e?.message||'erreur inconnue'));}
function bookForm(b={}){
 current=b.id||null;
 for(const e of $('book-editor').elements){
  if(!e.name)continue;
  if(e.type==='checkbox')e.checked=!!b[e.name];
  else e.value=e.name==='review_links'?(b.review_links||[]).join('\n'):(b[e.name]??'');
 }
 refreshSubgenres(b.subcategory||'');publicationState(!!b.published);loadChapters().catch(showError);
}
function chapterForm(c={}){chapter=c.id||null;for(const e of $('chapter-form').elements)if(e.name)e.value=c[e.name]??'';}
async function loadBooks(){
 const snap=await getDocs(collection(db,'books'));
 books=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.title||'').localeCompare(b.title||'','fr'));
 $('book-select').replaceChildren(new Option('Sélectionner un livre',''));
 for(const b of books)$('book-select').add(new Option(b.title||'Sans titre',b.id));
}
async function loadChapters(){
 chapters=[];$('chapter-select').replaceChildren(new Option('Nouveau chapitre',''));
 if(!current){chapterForm();return;}
 const snap=await getDocs(query(collection(db,'book_chapters'),where('book_id','==',current)));
 chapters=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.chapter_number||0)-(b.chapter_number||0));
 for(const c of chapters)$('chapter-select').add(new Option((c.chapter_number||'')+' · '+(c.title||'Sans titre'),c.id));
 chapterForm();
}
$('book-select').onchange=()=>bookForm(books.find(b=>b.id===$('book-select').value)||{});
$('new-book').onclick=()=>{$('book-select').value='';bookForm();msg('Nouvelle fiche : complète les champs puis enregistre.');};
$('chapter-select').onchange=()=>chapterForm(chapters.find(c=>c.id===$('chapter-select').value)||{});
$('new-chapter').onclick=()=>{$('chapter-select').value='';chapterForm();};
$('book-editor').onsubmit=async e=>{
 e.preventDefault();if(!ready){msg('Connecte-toi avec le compte éditeur.');return;}
 try{
  const v=fields(e.target);
  v.publication_year=v.publication_year?Number(v.publication_year):null;
  v.summary=v.description||'';
  v.published=!!(current&&books.find(b=>b.id===current)?.published);
  v.review_links=(v.review_links||'').split('\n').map(x=>x.trim()).filter(x=>/^https:\/\//.test(x));
  const id=current||doc(collection(db,'books')).id;
  await setDoc(doc(db,'books',id),v,{merge:!!current});
  await loadBooks();$('book-select').value=id;bookForm({id,...v});
  msg('Fiche enregistrée dans Firebase.'+(v.published?' Publication existante conservée.':' Brouillon non publié. Clique sur « Publier le livre » lorsque tout est prêt.')+' Les fichiers sélectionnés ne sont pas envoyés automatiquement.');
 }catch(err){showError(err);}
};
async function setPublication(published){
 if(!current){msg('Enregistre d’abord la fiche avant de publier.');return;}
 try{
  if(published){
   const book=books.find(b=>b.id===current);
   if(!book?.title||!book?.category||!book?.subcategory){msg('Titre, genre et sous-genre obligatoires avant publication.');return;}
   if(!book.pdf_path){msg('Aucun PDF hébergé : ajoute son chemin réel pour activer lecture et téléchargement. La sélection locale ne suffit pas.');return;}
   if(!(/^(pdf\/|livres\/).+\.pdf$/i.test(book.pdf_path)||/^https:\/\/potierbiblio-com\.github\.io\/Lecture-Entre-Les-Lignes\/(pdf|livres)\/.+\.pdf$/i.test(book.pdf_path))){msg('Le chemin du PDF doit pointer vers un fichier PDF du site GitHub Pages.');return;}
   if(!confirm('Publier la fiche ? Le PDF doit déjà être hébergé légalement sur le site.'))return;
  }
  await setDoc(doc(db,'books',current),{published},{merge:true});
  const book=books.find(b=>b.id===current);if(book)book.published=published;
  $('book-editor').elements.published.checked=published;
  publicationState(published);
  msg(published?'Fiche publiée dans Firestore. Vérifie sa visibilité publique : '+location.origin+location.pathname.replace('admin-catalogue.html','livre.html')+'?id=firebase-'+current:'Livre repassé en brouillon dans Firestore.');
 }catch(err){showError(err);}
}
$('publish-book').onclick=()=>setPublication(true);
$('unpublish-book').onclick=()=>setPublication(false);
$('chapter-form').onsubmit=async e=>{
 e.preventDefault();if(!current){msg('Enregistre d’abord le livre.');return;}
 try{
  const v=fields(e.target);v.chapter_number=Number(v.chapter_number);v.page_start=v.page_start?Number(v.page_start):null;v.page_end=v.page_end?Number(v.page_end):null;v.book_id=current;
  if(chapter)await setDoc(doc(db,'book_chapters',chapter),v,{merge:true});
  else await addDoc(collection(db,'book_chapters'),v);
  await loadChapters();msg('Chapitre enregistré dans Firebase.');
 }catch(err){showError(err);}
};
$('delete-chapter').onclick=async()=>{
 if(!current||!chapter){msg('Sélectionne un chapitre à supprimer.');return;}
 const item=chapters.find(x=>x.id===chapter);
 if(!confirm('Supprimer définitivement le chapitre « '+(item?.title||'Sans titre')+' » ?'))return;
 try{await deleteDoc(doc(db,'book_chapters',chapter));await loadChapters();msg('Chapitre supprimé.');}catch(err){showError(err);}
};
$('delete-book').onclick=async()=>{
 if(!current){msg('Sélectionne un livre à supprimer.');return;}
 const item=books.find(x=>x.id===current);
 if(!confirm('Supprimer définitivement « '+(item?.title||'ce livre')+' » et ses résumés ?'))return;
 try{
  const batch=writeBatch(db);
  for(const c of chapters)batch.delete(doc(db,'book_chapters',c.id));
  batch.delete(doc(db,'books',current));
  await batch.commit();current=null;await loadBooks();bookForm();
  msg('Livre supprimé de Firestore. Les fichiers hébergés sur GitHub ne sont pas supprimés.');
 }catch(err){showError(err);}
};
onAuthStateChanged(auth,async user=>{
 ready=false;$('admin-editor').hidden=true;
 if(!user){msg('Connecte-toi à Firebase depuis Mon espace, puis reviens ici.');return;}
 try{
  const token=await getIdTokenResult(user,true);
  if(token.claims.admin!==true&&token.claims.catalogEditor!==true){
   msg('Ce compte Firebase ne possède pas les droits d’édition du catalogue. Connecte-toi avec le compte de Quentin.');return;
  }
  await loadBooks();ready=true;$('admin-editor').hidden=false;bookForm();
  msg('Compte éditeur Firebase vérifié. Tu peux créer et enregistrer une fiche.');
 }catch(err){showError(err);}
});
