import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
const config={apiKey:"AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY",authDomain:"lecture-entre-les-lignes.firebaseapp.com",projectId:"lecture-entre-les-lignes",appId:"1:876044393565:web:da359169bccbfc709081b4"};
const app=getApps()[0]||initializeApp(config),auth=getAuth(app);
const FEATURES=[['themes','Thèmes de carnet',1],['favorites','Favoris et collections',1],['notes','Fiches de lecture enrichies',2],['search','Recherche dans les notes',2],['export','Export des notes',2],['stats','Statistiques personnelles',2],['folders','Dossiers multi-livres',3],['dashboard','Tableau de bord détaillé',3],['compare','Comparaison des notes',3],['colors','Palette de surlignage étendue',1],['annotations','Annotations privées',2],['journal','Journal paginé par livre',2],['highlight-sort','Tri des surlignages',2],['highlight-export','Export des surlignages',3]];
const $=id=>document.getElementById(id), storeKey=()=> 'ell-premium-local-'+auth.currentUser.uid;
const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tier=0,admin=false,notes=[],extras=[],themeColor='',syncQueue=Promise.resolve();
const ROOT='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
const extraKey=()=>storeKey()+'-reading';
async function request(action,data){
 const current=auth.currentUser;if(!current)throw Error('Connexion requise.');
 const response=await fetch(ROOT,{method:'POST',headers:{Authorization:'Bearer '+await current.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action,kind:'premium',data})});
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(result.error||'Données personnelles indisponibles');return result;
}
const send=()=>{
 const owner=auth.currentUser?.uid;if(!owner)return;
 const data={notes:structuredClone(notes),extras:structuredClone(extras),theme:themeColor};
 syncQueue=syncQueue.catch(()=>{}).then(()=>{
  if(auth.currentUser?.uid!==owner)throw Error('Compte changé pendant la sauvegarde.');
  return request('write',data);
 });
 syncQueue.catch(e=>{$('info').textContent='Sauvegarde distante non confirmée : '+e.message;});
};
function readExtra(){return extras.slice();}
function saveExtra(data){extras=Array.isArray(data)?data:[];localStorage.setItem(extraKey(),JSON.stringify(extras));send();}
function save(){localStorage.setItem(storeKey(),JSON.stringify(notes));send();}
function render(){const names=['Gratuit','Découverte','Passion','Illimité'];$('plan').textContent=names[tier];$('features').innerHTML=FEATURES.map(([id,name,level])=>{const allowed=tier>=level;return '<article class="pf-card '+(allowed?'enabled':'locked')+'"><div class="pf-level">✦ '+(level===1?'01 · 02 · 03':level===2?'02 · 03':'03')+'</div><h3>'+safe(name)+'</h3><p>'+(allowed?'Disponible pour ton compte':'Réservé aux formules '+(level===1?'Découverte, Passion et Illimité':level===2?'Passion et Illimité':'Illimité'))+'</p>'+(allowed?'<button type="button" data-feature="'+id+'">Ouvrir ↗</button>':'<a href="le-cercle.html#formules">Voir les offres</a>')+'</article>'}).join('');$('features').querySelectorAll('button').forEach(b=>b.onclick=()=>openFeature(b.dataset.feature));}
function openFeature(id){const level=FEATURES.find(f=>f[0]===id)?.[2];if(!level||tier<level)return;const area=$('workspace');area.hidden=false;const title=FEATURES.find(f=>f[0]===id)[1];let html='<h2>'+safe(title)+'</h2>';if(id==='themes'){html+='<p>Choisis une couleur pour ton carnet sur cet appareil.</p><div class="pf-swatches"><button data-color="#fff5f8">Rose</button><button data-color="#f0f5e9">Sauge</button><button data-color="#fff2dd">Crème</button></div>';}else if(id==='notes'||id==='favorites'||id==='folders'){html+='<form id="note-form"><label>Titre <input name="title" required maxlength="120"></label><label>Texte / livres associés <textarea name="body" rows="4" maxlength="8000"></textarea></label><button>Enregistrer dans ce navigateur</button></form><div id="note-list"></div>';}else if(id==='search'){html+='<label>Rechercher <input id="note-query" placeholder="Mot-clé"></label><div id="note-list"></div>';}else if(id==='export'){html+='<p>Exporter les notes créées dans cet espace sur cet appareil.</p><button id="download-notes">Exporter mes notes (JSON)</button>';}else if(id==='stats'||id==='dashboard'){html+='<p><strong>'+notes.length+'</strong> notes et éléments personnels enregistrés sur cet appareil.</p><p>Nombre de caractères : '+notes.reduce((a,n)=>a+n.body.length,0)+'</p>';}else if(['colors','annotations','journal','highlight-sort','highlight-export'].includes(id)){const records=readExtra();if(id==='colors'){html+='<p>Palette supplémentaire pour tes repères personnels.</p><div class="pf-swatches">'+['#e9b5cc','#a6d8ea','#b4e5c6','#ead4a2','#d4c3f5','#f2b5a5','#d6eaa0','#b7b4f4'].map(c=>'<button type="button" data-mark-color="'+c+'" style="background:'+c+';color:#342538">'+c+'</button>').join('')+'</div><p id="color-feedback">Choisis une couleur pour la copier.</p>';}else if(id==='annotations'||id==='journal'){html+='<p>'+(id==='journal'?'Rédige une fiche par page et par livre ; tes fiches constituent un journal de lecture.':'Ajoute une annotation personnelle liée à un livre et à une page.')+'</p><form id="extra-form"><label>Livre<input name="book" required maxlength="180"></label><label>Page du livre<input name="page" type="number" min="1" required></label><label>Texte<textarea name="body" rows="5" required maxlength="12000"></textarea></label><button type="submit">Enregistrer</button></form><div id="extra-list"></div>';}else if(id==='highlight-sort'){html+='<p>Classe tes repères enregistrés dans cet atelier. Les surlignages de l’ancien lecteur ne sont pas encore synchronisés ici.</p><label>Tri<select id="extra-sort"><option value="date">Date</option><option value="book">Livre</option><option value="color">Couleur</option></select></label><div id="extra-list"></div>';}else{html+='<p>Exporter les repères créés dans cet atelier au format JSON.</p><button id="extra-export" type="button">Exporter mes repères</button>';}}else if(id==='compare'){html+='<p>Comparer deux notes personnelles.</p><div class="pf-compare"><select id="compare-a"></select><select id="compare-b"></select></div><div id="compare-output"></div>';}area.innerHTML=html;area.scrollIntoView({behavior:'smooth',block:'nearest'});area.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{document.body.style.background=b.dataset.color;localStorage.setItem(storeKey()+'-theme',b.dataset.color);themeColor=b.dataset.color;send()});const form=$('note-form');if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form);notes.push({title:String(d.get('title')),body:String(d.get('body')),kind:id,date:new Date().toISOString()});save();form.reset();listNotes();};if($('note-query'))$('note-query').oninput=listNotes;if($('download-notes'))$('download-notes').onclick=()=>{const blob=new Blob([JSON.stringify(notes,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='mes-notes-entre-les-lignes.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};if($('compare-a')){for(const sel of [$('compare-a'),$('compare-b')]){sel.innerHTML=notes.map((n,i)=>'<option value="'+i+'">'+safe(n.title)+'</option>').join('');sel.onchange=compare;}if(notes.length>1)$('compare-b').value='1';compare();}if($('extra-form'))$('extra-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),items=readExtra();items.push({kind:id,book:String(f.get('book')),page:Number(f.get('page')),body:String(f.get('body')),color:localStorage.getItem(extraKey()+'-color')||'#e9b5cc',date:new Date().toISOString()});saveExtra(items);e.target.reset();drawExtra();};
area.querySelectorAll('[data-mark-color]').forEach(b=>b.onclick=()=>{localStorage.setItem(extraKey()+'-color',b.dataset.markColor);send();$('color-feedback').textContent='Couleur sélectionnée : '+b.dataset.markColor;});
if($('extra-sort'))$('extra-sort').onchange=drawExtra;
if($('extra-export'))$('extra-export').onclick=()=>{const blob=new Blob([JSON.stringify(readExtra(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='repères-entre-les-lignes.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);};
drawExtra();listNotes();}
function drawExtra(){const box=$('extra-list');if(!box)return;let items=readExtra().filter(x=>['annotations','journal','highlight-sort'].includes(x.kind));const order=$('extra-sort')?.value||'page';items.sort((a,b)=>order==='book'?a.book.localeCompare(b.book):order==='color'?a.color.localeCompare(b.color):order==='date'?b.date.localeCompare(a.date):a.book.localeCompare(b.book)||a.page-b.page);box.innerHTML=items.map(x=>'<article class="pf-note"><strong>'+safe(x.book)+' · page '+x.page+'</strong><p>'+safe(x.body)+'</p><small>'+safe(x.date.slice(0,10))+'</small></article>').join('')||'<p>Aucune entrée enregistrée dans cet atelier.</p>';}
function listNotes(){const list=$('note-list');if(!list)return;const q=($('note-query')?.value||'').toLowerCase();list.innerHTML=notes.filter(n=>(n.title+' '+n.body).toLowerCase().includes(q)).map(n=>'<div class="pf-note"><strong>'+safe(n.title)+'</strong><p>'+safe(n.body)+'</p></div>').join('')||'<p>Aucune note pour le moment.</p>';}
function compare(){const a=notes[Number($('compare-a')?.value)],b=notes[Number($('compare-b')?.value)];if($('compare-output'))$('compare-output').innerHTML=a&&b?'<div class="pf-compare"><div class="pf-note"><strong>'+safe(a.title)+'</strong><p>'+safe(a.body)+'</p></div><div class="pf-note"><strong>'+safe(b.title)+'</strong><p>'+safe(b.body)+'</p></div></div>':'<p>Ajoute deux notes pour les comparer.</p>';}
onAuthStateChanged(auth,async user=>{
 $('panel').hidden=true;
 if(!user){$('loading').textContent='Connecte-toi pour accéder à ton espace.';$('login').hidden=false;notes=[];extras=[];tier=0;return;}
 $('login').hidden=true;
 try{
  const token=await user.getIdTokenResult(true);
  admin=!!user.emailVerified&&['quentinmorel1912@gmail.com','juliepotier2006@gmail.com'].includes((user.email||'').toLowerCase())&&(token.claims.admin===true||token.claims.catalogEditor===true);
  const response=await fetch(ROOT,{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action:'status'})});
  if(!response.ok)throw Error('Abonnement indisponible');
  const {subscription}=await response.json();
  const levels={free:0,decouverte:1,passion:2,illimite:3};
  tier=admin?3:Number(subscription?.access_level||0);
  const cloud=await request('read');
  if(auth.currentUser?.uid!==user.uid)return;
  const remote=cloud.data&&typeof cloud.data==='object'&&!Array.isArray(cloud.data)?cloud.data:{};
  const oldNotes=JSON.parse(localStorage.getItem(storeKey())||'[]');
  const oldExtras=JSON.parse(localStorage.getItem(extraKey())||'[]');
  notes=Array.isArray(remote.notes)?remote.notes:(Array.isArray(oldNotes)?oldNotes:[]);
  extras=Array.isArray(remote.extras)?remote.extras:(Array.isArray(oldExtras)?oldExtras:[]);
  themeColor=typeof remote.theme==='string'?remote.theme:localStorage.getItem(storeKey()+'-theme')||'';
  document.body.style.background=themeColor;
  if(!Object.keys(remote).length&&(notes.length||extras.length||themeColor))send();
  $('loading').textContent='Compte : '+user.email;
  render();$('panel').hidden=false;
  $('info').textContent=(admin?'Mode démonstration de l’équipe : toutes les fonctions sont accessibles. ':'')+'Tes notes et personnalisations de cet atelier sont enregistrées par compte. Les niveaux sont vérifiés sur le serveur.';
 }catch(e){$('loading').textContent='Impossible de charger ton atelier : '+(e.code||e.message);$('login').hidden=true;}
});