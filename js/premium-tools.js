import {auth,onAccount,requestService} from './request-service.js';
const FEATURES=[['themes','Thèmes de carnet',1],['favorites','Favoris et collections',1],['notes','Fiches de lecture enrichies',2],['search','Recherche dans les notes',2],['export','Export des notes',2],['stats','Statistiques personnelles',2],['folders','Dossiers multi-livres',3],['dashboard','Tableau de bord détaillé',3],['compare','Comparaison des notes',3],['colors','Palette de surlignage étendue',1],['annotations','Annotations privées',2],['journal','Journal paginé par livre',2],['highlight-sort','Tri des surlignages',2],['highlight-export','Export des surlignages',3]];
const $=id=>document.getElementById(id), storeKey=()=> 'ell-premium-local-'+auth.currentUser.uid;
const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tier=0,admin=false,notes=[],extras=[],theme='',color='#e9b5cc',queue=Promise.resolve();
const extraKey=()=>storeKey()+'-reading';
function readExtra(){return extras.slice();}
function saveExtra(data){extras=data;return save();}
function save(){
 const owner=auth.currentUser;
 const data=structuredClone({notes,extras,theme,color});
 if(!owner||!tier)return Promise.resolve();
 const task=queue.catch(()=>{}).then(()=>requestService('write',{kind:'premium',data},owner));
 queue=task;
 return task.catch(error=>{if(auth.currentUser?.uid===owner.uid)$('info').textContent='Sauvegarde indisponible · '+error.message;throw error;});
}
function render(){const names=['Gratuit','Découverte','Passion','Illimité'];$('plan').textContent=names[tier];$('features').innerHTML=FEATURES.map(([id,name,level])=>{const allowed=tier>=level;return '<article class="pf-card '+(allowed?'enabled':'locked')+'"><div class="pf-level"><span class="plan-lock plan-lock-'+level+'" aria-label="À partir de '+names[level]+'"><span class="plan-lock-icon" aria-hidden="true"></span>'+names[level]+'</span></div><h3>'+safe(name)+'</h3><p>'+(allowed?'Disponible pour ton compte':'À débloquer')+'</p>'+(allowed?'<button type="button" data-feature="'+id+'">Ouvrir ↗</button>':'<a href="le-cercle.html#comparatif">Voir les offres</a>')+'</article>'}).join('');$('features').querySelectorAll('button').forEach(b=>b.onclick=()=>openFeature(b.dataset.feature));}
function openFeature(id){const level=FEATURES.find(f=>f[0]===id)?.[2];if(!level||tier<level)return;const area=$('workspace');area.hidden=false;const title=FEATURES.find(f=>f[0]===id)[1];let html='<h2>'+safe(title)+'</h2>';if(id==='themes'){html+='<p>Choisis une couleur pour ton carnet dans ton compte.</p><div class="pf-swatches"><button data-color="#fff5f8">Rose</button><button data-color="#f0f5e9">Sauge</button><button data-color="#fff2dd">Crème</button></div>';}else if(id==='notes'||id==='favorites'||id==='folders'){html+='<form id="note-form"><label>Titre <input name="title" required maxlength="120"></label><label>Texte / livres associés <textarea name="body" rows="4" maxlength="8000"></textarea></label><button>Enregistrer dans ton compte</button></form><div id="note-list"></div>';}else if(id==='search'){html+='<label>Rechercher <input id="note-query" placeholder="Mot-clé"></label><div id="note-list"></div>';}else if(id==='export'){html+='<p>Exporter les notes créées dans cet espace dans ton compte.</p><button id="download-notes">Exporter mes notes (JSON)</button>';}else if(id==='stats'||id==='dashboard'){html+='<p><strong>'+notes.length+'</strong> notes et éléments personnels enregistrés dans ton compte.</p><p>Nombre de caractères : '+notes.reduce((a,n)=>a+n.body.length,0)+'</p>';}else if(['colors','annotations','journal','highlight-sort','highlight-export'].includes(id)){const records=readExtra();if(id==='colors'){html+='<p>Palette supplémentaire pour tes repères personnels.</p><div class="pf-swatches">'+['#e9b5cc','#a6d8ea','#b4e5c6','#ead4a2','#d4c3f5','#f2b5a5','#d6eaa0','#b7b4f4'].map(c=>'<button type="button" data-mark-color="'+c+'" style="background:'+c+';color:#342538">'+c+'</button>').join('')+'</div><p id="color-feedback">Choisis une couleur pour la copier.</p>';}else if(id==='annotations'||id==='journal'){html+='<p>'+(id==='journal'?'Rédige une fiche par page et par livre ; tes fiches constituent un journal de lecture.':'Ajoute une annotation personnelle liée à un livre et à une page.')+'</p><form id="extra-form"><label>Livre<input name="book" required maxlength="180"></label><label>Page du livre<input name="page" type="number" min="1" required></label><label>Texte<textarea name="body" rows="5" required maxlength="12000"></textarea></label><button type="submit">Enregistrer</button></form><div id="extra-list"></div>';}else if(id==='highlight-sort'){html+='<p>Classe tes repères enregistrés dans cet atelier. Les surlignages de l’ancien lecteur ne sont pas encore synchronisés ici.</p><label>Tri<select id="extra-sort"><option value="date">Date</option><option value="book">Livre</option><option value="color">Couleur</option></select></label><div id="extra-list"></div>';}else{html+='<p>Exporter les repères créés dans cet atelier au format JSON.</p><button id="extra-export" type="button">Exporter mes repères</button>';}}else if(id==='compare'){html+='<p>Comparer deux notes personnelles.</p><div class="pf-compare"><select id="compare-a"></select><select id="compare-b"></select></div><div id="compare-output"></div>';}area.innerHTML=html;area.scrollIntoView({behavior:'smooth',block:'nearest'});area.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{document.body.style.background=b.dataset.color;theme=b.dataset.color;void save().catch(()=>{})});const form=$('note-form');if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form);notes.push({title:String(d.get('title')),body:String(d.get('body')),kind:id,date:new Date().toISOString()});void save().then(()=>{form.reset();listNotes();}).catch(()=>{});};if($('note-query'))$('note-query').oninput=listNotes;if($('download-notes'))$('download-notes').onclick=()=>{const blob=new Blob([JSON.stringify(notes,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='mes-notes-entre-les-lignes.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};if($('compare-a')){for(const sel of [$('compare-a'),$('compare-b')]){sel.innerHTML=notes.map((n,i)=>'<option value="'+i+'">'+safe(n.title)+'</option>').join('');sel.onchange=compare;}if(notes.length>1)$('compare-b').value='1';compare();}if($('extra-form'))$('extra-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),items=readExtra();items.push({kind:id,book:String(f.get('book')),page:Number(f.get('page')),body:String(f.get('body')),color:color,date:new Date().toISOString()});const target=e.target;void saveExtra(items).then(()=>{target.reset();drawExtra();}).catch(()=>{});};
area.querySelectorAll('[data-mark-color]').forEach(b=>b.onclick=()=>{color=b.dataset.markColor;void save().catch(()=>{});$('color-feedback').textContent='Couleur sélectionnée : '+b.dataset.markColor;});
if($('extra-sort'))$('extra-sort').onchange=drawExtra;
if($('extra-export'))$('extra-export').onclick=()=>{const blob=new Blob([JSON.stringify(readExtra(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='repères-entre-les-lignes.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);};
drawExtra();listNotes();}
function drawExtra(){const box=$('extra-list');if(!box)return;let items=readExtra().filter(x=>['annotations','journal','highlight-sort'].includes(x.kind));const order=$('extra-sort')?.value||'page';items.sort((a,b)=>order==='book'?a.book.localeCompare(b.book):order==='color'?a.color.localeCompare(b.color):order==='date'?b.date.localeCompare(a.date):a.book.localeCompare(b.book)||a.page-b.page);box.innerHTML=items.map(x=>'<article class="pf-note"><strong>'+safe(x.book)+' · page '+x.page+'</strong><p>'+safe(x.body)+'</p><small>'+safe(x.date.slice(0,10))+'</small></article>').join('')||'<p>Aucune entrée enregistrée dans cet atelier.</p>';}
function listNotes(){const list=$('note-list');if(!list)return;const q=($('note-query')?.value||'').toLowerCase();list.innerHTML=notes.filter(n=>(n.title+' '+n.body).toLowerCase().includes(q)).map(n=>'<div class="pf-note"><strong>'+safe(n.title)+'</strong><p>'+safe(n.body)+'</p></div>').join('')||'<p>Aucune note pour le moment.</p>';}
function compare(){const a=notes[Number($('compare-a')?.value)],b=notes[Number($('compare-b')?.value)];if($('compare-output'))$('compare-output').innerHTML=a&&b?'<div class="pf-compare"><div class="pf-note"><strong>'+safe(a.title)+'</strong><p>'+safe(a.body)+'</p></div><div class="pf-note"><strong>'+safe(b.title)+'</strong><p>'+safe(b.body)+'</p></div></div>':'<p>Ajoute deux notes pour les comparer.</p>';}
let session=0;
onAccount(async user=>{
 const turn=++session;
 tier=0;admin=false;notes=[];extras=[];theme='';color='#e9b5cc';
 $('workspace').hidden=true;
 $('workspace').replaceChildren();
 document.body.style.background='';
 $('login').hidden=!!user;
 $('panel').hidden=false;
 render();
 if(!user){$('loading').textContent='Connecte-toi pour vérifier tes accès.';return;}
 try{
  const {subscription}=await requestService('status',{},user);
  if(turn!==session||auth.currentUser?.uid!==user.uid)return;
  const level=subscription.access_level||0;
  if(level){
   const {data}=await requestService('read',{kind:'premium'},user);
   if(turn!==session||auth.currentUser?.uid!==user.uid)return;
   const parse=key=>{try{return JSON.parse(localStorage.getItem(key)||'[]');}catch{return [];}};
   const localKeys=[storeKey(),extraKey(),storeKey()+'-theme',extraKey()+'-color'];
   notes=data?.notes??parse(localKeys[0]);
   extras=data?.extras??parse(localKeys[1]);
   if(!Array.isArray(notes))notes=[];
   if(!Array.isArray(extras))extras=[];
   theme=data?.theme??localStorage.getItem(localKeys[2])??'';
   color=data?.color??localStorage.getItem(localKeys[3])??'#e9b5cc';
   tier=level;
   if(!data&&localKeys.some(key=>localStorage.getItem(key)!==null))await save();
   if(turn!==session||auth.currentUser?.uid!==user.uid)return;
   if(!data)localKeys.forEach(key=>localStorage.removeItem(key));
   document.body.style.background=theme;
  }
  admin=subscription.complimentary===true;
  $('loading').textContent='Compte · '+user.email;
  $('info').textContent=(admin?'Accès Illimité permanent. ':'')+'Les notes créées dans cet atelier sont conservées dans ton compte.';
  render();
 }catch(error){if(turn===session)$('loading').textContent='Impossible de vérifier les droits · '+error.message;}
});
