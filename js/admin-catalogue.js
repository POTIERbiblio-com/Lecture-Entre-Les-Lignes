import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {getAuth,onAuthStateChanged,getIdTokenResult} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {getFirestore,collection,doc,getDocs,query,where,setDoc,addDoc,deleteDoc,writeBatch} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const config={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const app=getApps().length?getApp():initializeApp(config);
const auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id);
const msg=t=>{$('admin-msg').textContent=t;};
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
 loadChapters().catch(showError);
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
  v.published=e.target.elements.published.checked;
  v.review_links=(v.review_links||'').split('\n').map(x=>x.trim()).filter(x=>/^https:\/\//.test(x));
  const id=current||doc(collection(db,'books')).id;
  await setDoc(doc(db,'books',id),v,{merge:!!current});
  await loadBooks();$('book-select').value=id;bookForm({id,...v});
  msg('Fiche enregistrée dans Firebase.'+(v.published?' Elle est publiée dans Firestore.':' Elle reste en brouillon.')+' Les fichiers sélectionnés ne sont pas envoyés automatiquement.');
 }catch(err){showError(err);}
};
$('chapter-form').onsubmit=async e=>{
 e.preventDefault();if(!current){msg('Enregistre d’abord le livre.');return;}
 try{
  const v=fields(e.target);v.chapter_number=Number(v.chapter_number);v.book_id=current;
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
