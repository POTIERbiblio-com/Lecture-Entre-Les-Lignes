import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {getAuth,onAuthStateChanged,getIdTokenResult} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {getFirestore,doc,setDoc} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const OWNERS=new Set(['quentinmorel1912@gmail.com','juliepotier2006@gmail.com']);
const config={apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'};
const app=getApps().length?getApp():initializeApp(config),auth=getAuth(app),db=getFirestore(app);
let authorized=false;
const tools=document.getElementById('catalogue-editor-tools');
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function decorate(){
 if(!authorized)return;
 document.querySelectorAll('#books article.book[data-ell-book-id]').forEach(card=>{
  if(card.querySelector('.catalogue-admin-remove'))return;
  const id=card.dataset.ellBookId;
  const title=card.querySelector('h2')?.textContent?.trim();
  if(!id||!title)return;
  const button=document.createElement('button');
  button.type='button';button.className='catalogue-admin-remove';button.textContent='Retirer du catalogue';
  button.setAttribute('aria-label','Retirer « '+title+' » du catalogue');
  button.addEventListener('click',async e=>{
   e.preventDefault();e.stopPropagation();
   if(!authorized||!auth.currentUser)return;
   if(!confirm('Retirer « '+title+' » du catalogue public pour tous les visiteurs ? Le PDF ne sera pas supprimé.'))return;
   const check=prompt('Pour confirmer, recopie exactement le titre : '+title);
   if(check!==title){alert('Retrait annulé : titre incorrect.');return;}
   button.disabled=true;
   try{
    await setDoc(doc(db,'catalogue_hidden',id),{book_id:id,hidden:true,hidden_by:auth.currentUser.email,hidden_at:new Date().toISOString()});
    card.remove();
    const count=document.getElementById('search-count');
    if(count)count.textContent='Livre retiré. Actualise la page pour voir le catalogue mis à jour.';
   }catch(error){button.disabled=false;alert('Retrait refusé par Firebase : '+(error.code||error.message)+'. Vérifie les règles de sécurité.');}
  });
  card.append(button);
 });
}
onAuthStateChanged(auth,async user=>{
 authorized=false;if(tools)tools.hidden=true;
 if(!user||!OWNERS.has((user.email||'').toLowerCase()))return;
 try{
  const token=await getIdTokenResult(user,true);
  authorized=token.claims.admin===true||token.claims.catalogEditor===true;
  if(tools)tools.hidden=!authorized;
  if(authorized)decorate();
 }catch(error){console.warn('Droits du catalogue non vérifiés',error);}
});
new MutationObserver(decorate).observe(document.getElementById('books')||document.body,{childList:true,subtree:true});
