import {narrationCues} from './tutoriels-audio.js?v=voix-3';

const reader='lire.html?id=edition-6e9408ef-af2f-5583-949d-742806ca90ff&pdfpage=5';
const proposal='demander-un-livre.html';
const paths={
 genres:[
  ['genres.html','.site-nav a[href="genres.html"]','Genres',true],
  ['genres.html','a.genre-plate[href="fiction.html"] .genre-book-count','L’index des genres'],
  ['genres.html','a.genre-plate[href="fiction.html"]','L’index des genres',true],
  ['fiction.html','a.rayon-image[href="livres-fiction-7.html"] .genre-book-count','Romans et fiction'],
  ['fiction.html','a.rayon-image[href="livres-fiction-7.html"]','Romans et fiction',true],
  ['livres-fiction-7.html','#books article a.btn','Contes et nouvelles',true]
 ],
 carnet:[
  ['livre.html?id=edition-6e9408ef-af2f-5583-949d-742806ca90ff','.book-file-actions a[href^="lire.html"]','Présentation du livre',true],
  [reader,'.reader-pencils .pencil','Le lecteur PDF',true],
  [reader,'#pdf-text-layer span[role="presentation"]','Le lecteur PDF'],
  [reader,'#save-selection','Le lecteur PDF',true],
  [reader,'#reader-annotation','Mon passage choisi',true],
  [reader,'#save-reader-sheet','Ma fiche de lecture',true],
  ['mon-espace.html','a.object-link[href="journaux.html"]','Mon espace',true,'demo'],
  ['journaux.html','#journal-collection-form button[type="submit"]','Mes journaux de livres',true,'demo']
 ],
 proposer:[
  [proposal,'.site-nav a[href="demander-un-livre.html"]','Proposer un livre',true,'demo'],
  [proposal,'.request-banner-link','Proposer un livre',true,'demo'],
  [proposal,'#request-form input[name="title"]','Ma proposition',true,'demo'],
  [proposal,'#request-form select[name="genre"]','Ma proposition',true,'demo'],
  [proposal,'#request-pdf','Ma proposition',true,'demo'],
  [proposal,'#send-request','Ma proposition',true,'demo'],
  [proposal,'.request-history-card h2','Mes propositions',false,'demo']
 ],
 abonnements:[
  ['index.html','.ell-cercle-action','Accueil',true,'demo'],
  ['le-cercle.html','.premium-link[href="#formules"]','Le Cercle',true,'demo'],
  ['le-cercle.html','.tier-one','Découverte',false,'demo'],
  ['le-cercle.html','.tier-two','Passion',false,'demo'],
  ['le-cercle.html','.tier-three','Illimité',false,'demo'],
  ['le-cercle.html','.tier-three a[href="#comparatif"]','Comparer les avantages',true,'demo'],
  ['le-cercle.html','.circle-table thead','Le tableau comparatif',false,'demo'],
  ['le-cercle.html','[data-subscribe-plan="passion"]','Souscrire',true,'demo']
 ]
};
const frameWidth=760;
const frameHeight=486;

function element(parent,tag,cls,text){
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(text)node.textContent=text;
 parent.append(node);
 return node;
}
function waitForTarget(doc,selector){
 return new Promise(resolve=>{
  const visible=()=>{
   const target=doc.querySelector(selector);
   return target?.getClientRects().length?target:null;
  };
  const found=visible();
  if(found){resolve(found);return;}
  const update=new MutationObserver(()=>{
   const found=visible();
   if(found){clearTimeout(deadline);update.disconnect();resolve(found);}
  });
  const deadline=setTimeout(()=>{update.disconnect();resolve(null);},11000);
  update.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
 });
}
function showDemo(doc,path){
 if(path===proposal){
  doc.getElementById('request-member').hidden=false;
  doc.querySelector('#request-form [name="title"]').value='La Ferme des animaux';
  doc.querySelector('#request-form [name="author"]').value='George Orwell';
 }
 if(path==='journaux.html'){
  doc.getElementById('journal-builder').hidden=false;
  doc.getElementById('journal-collection-form').hidden=false;
  doc.querySelector('#journal-collection-form [name="title"]').value='Mes passages préférés';
 }
}
let pauseActiveGuide=()=>{};

function makeGuide(host,steps){
 const cues=narrationCues[host.dataset.tutorial];
 const audio=element(host,'audio','');
 audio.hidden=true;
 audio.src='videos/narration/'+host.dataset.tutorial+'.mp3?v=3';
 audio.preload='metadata';
 const duration=cues.at(-1)[1];
 const view=element(host,'div','tutorial-view');
 const overlay=element(view,'div','tutorial-overlay');
 overlay.setAttribute('aria-hidden','true');
 const rect=element(overlay,'div','tutorial-focus');
 const pointer=element(overlay,'span','tutorial-pointer','➤');
 const bar=element(host,'div','tutorial-controls');
 const play=element(bar,'button','','▶');
 const progress=element(bar,'input','tutorial-progress');
 progress.type='range';
 progress.min='0';
 progress.max=String(duration);
 progress.step='any';
 progress.value='0';
 progress.setAttribute('aria-label','Position dans le tutoriel');
 const clock=element(bar,'span','tutorial-clock');
 const expand=element(bar,'button','','⛶');
 expand.setAttribute('aria-label','Agrandir');
 expand.setAttribute('aria-pressed','false');
 for(const control of bar.querySelectorAll('button'))control.type='button';
 const status=element(host,'p','tutorial-status');
 status.setAttribute('role','status');
 let stage=0, generation=0, playing=false, readyStage=false, position=0;
 let iframe, lastPath, ready, target, clickTimer, observer, comparison;
 function formatTime(time){
  const seconds=Math.floor(time);
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
 }
 function updatePosition(time){
  position=time;
  progress.value=String(time);
  clock.textContent=formatTime(time)+' / '+formatTime(duration);
  progress.setAttribute('aria-valuetext',formatTime(time)+' sur '+formatTime(duration));
 }
 function updatePlay(){
  play.textContent=playing?'Ⅱ':'▶';
  play.setAttribute('aria-label',playing?'Mettre en pause':position>=duration?'Revoir le tutoriel':'Lire le tutoriel');
 }
 function pause(){
  playing=false;
  audio.pause();
  clearTimeout(clickTimer);
  updatePlay();
 }
 function playCue(token){
  if(!playing||token!==generation)return;
  audio.muted=false;
  animateClick(steps[stage][3],token);
  audio.play().catch(()=>{
   if(token!==generation||!playing||!readyStage)return;
   pause();
   status.textContent='Appuie sur Lecture pour relancer le son.';
  });
 }
 updatePosition(0);
 function animateClick(enabled,token){
  clearTimeout(clickTimer);
  overlay.classList.remove('tutorial-click');
  if(!enabled&&!comparison)return;
  clickTimer=setTimeout(()=>{
   if(token!==generation||!playing)return;
   if(comparison)comparison.scrollTo({left:comparison.scrollWidth,behavior:'smooth'});
   else overlay.classList.add('tutorial-click');
  },comparison?1700:stage<2?900:1300);
 }
 updatePlay();
 function resize(){
  if(!iframe||!view.clientWidth)return;
  const scale=view.clientWidth/frameWidth;
  iframe.style.transform='scale('+scale+')';
  if(!target){overlay.hidden=true;return;}
  const box=target.getBoundingClientRect();
  const left=Math.max(0,box.left);
  const top=Math.max(0,box.top);
  const width=Math.min(box.right,frameWidth)-left;
  const height=Math.min(box.bottom,frameHeight)-top;
  overlay.hidden=width<=0||height<=0;
  if(overlay.hidden)return;
  Object.assign(rect.style,{left:(left*scale)+'px',top:(top*scale)+'px',width:(width*scale)+'px',height:(height*scale)+'px'});
  pointer.style.left=Math.min(view.clientWidth-26,(left+width*.56)*scale)+'px';
  pointer.style.top=Math.min(view.clientHeight-25,(top+height*.68)*scale)+'px';
 }
 function preview(path,demo){
  if(iframe&&lastPath===path)return ready;
  iframe?.remove();
  iframe=document.createElement('iframe');
  iframe.title='Aperçu du site pour la démonstration';
  iframe.setAttribute('sandbox',demo?'allow-same-origin':'allow-same-origin allow-scripts');
  iframe.setAttribute('tabindex','-1');
  lastPath=path;
  const frame=iframe;
  ready=new Promise(resolve=>{frame.addEventListener('load',()=>resolve(frame.contentDocument),{once:true});});
  iframe.src=path;
  view.prepend(iframe);
  resize();
  return ready;
 }
 function proceed(){
  if(!playing||!readyStage)return;
  if(stage<steps.length-1){seek(cues[stage+1][0]);return;}
  updatePosition(duration);
  pause();
 }
 audio.addEventListener('timeupdate',()=>{
  if(!playing||!readyStage||audio.seeking)return;
  if(audio.currentTime>=cues[stage][1]-.015)proceed();
  else updatePosition(audio.currentTime);
 });
 audio.addEventListener('ended',proceed);
 audio.addEventListener('error',()=>{
  pause();
  status.textContent='Le son du tutoriel n’a pas pu être chargé.';
 });
 function seek(time){
  const offset=Math.min(duration,Math.max(0,time));
  const previousStage=stage;
  const nextStage=cues.findIndex(([,end])=>offset<end);
  stage=nextStage===-1?steps.length-1:nextStage;
  updatePosition(offset);
  if(offset===duration)pause();
  else updatePlay();
  if(stage!==previousStage||!readyStage){void render();return;}
  audio.currentTime=offset;
  if(playing&&audio.paused)playCue(generation);
 }
 async function render(){
  const token=++generation;
  readyStage=false;
  audio.pause();
  observer?.disconnect();
  clearTimeout(clickTimer);
  target=null;
  overlay.hidden=true;
  overlay.classList.remove('tutorial-click');
  comparison=null;
  const [path,selector,name,,demo]=steps[stage];
  view.setAttribute('aria-label',name);
  const doc=await preview(path,demo);
  if(token!==generation||!doc?.body)return;
  if(demo)showDemo(doc,path);
  const found=await waitForTarget(doc,selector);
  if(token!==generation)return;
  target=found;
  if(target){
   const sample=path===reader?[...doc.querySelectorAll('#pdf-text-layer span[role="presentation"]')]
     .reduce((line,span)=>(span.textContent.trim().length>(line?.textContent.trim().length||0)?span:line),null):null;
   if(sample&&stage===2)target=sample;
   target.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
   if(path===reader){
    const selection=doc.defaultView.getSelection();
    selection?.removeAllRanges();
    if(sample&&[2,3].includes(stage)&&selection){
     const range=doc.createRange();
     range.selectNodeContents(sample);
     selection.addRange(range);
    }
    if(stage===4){
     const note=doc.getElementById('reader-annotation');
     note.disabled=false;
     note.value='Ce passage présente les animaux de la ferme.';
     doc.getElementById('save-reader-passage').disabled=false;
     if(sample?.textContent)doc.getElementById('chosen-excerpt').textContent=sample.textContent;
    }
    if(stage===5){
     doc.getElementById('reader-sheet-page').value='5';
     doc.getElementById('reader-sheet-passage').value=sample?.textContent||'Le début du chapitre';
     doc.getElementById('reader-sheet-text').value='Observer comment l’auteur installe le récit.';
    }
   }
   // Allow one frame for the real page to settle before placing the callout.
   await new Promise(resolve=>requestAnimationFrame(resolve));
   if(token!==generation)return;
   resize();
   observer=new ResizeObserver(resize);
   observer.observe(target);
   if(name==='Le tableau comparatif'){
    const table=doc.querySelector('.circle-table-scroll');
    if(table&&table.scrollWidth>table.clientWidth)comparison=table;
   }
  }
  readyStage=true;
  audio.currentTime=position;
  playCue(token);
 }
 progress.addEventListener('input',()=>seek(progress.valueAsNumber));
 play.onclick=()=>{
  if(playing){pause();return;}
  pauseActiveGuide();
  pauseActiveGuide=pause;
  status.textContent='';
  const restart=position>=duration;
  playing=true;
  updatePlay();
  if(readyStage&&!restart){playCue(generation);return;}
  // On touch devices, unlock this audio element during the tap.
  audio.muted=true;
  audio.play().then(()=>{if(!readyStage)audio.pause();}).catch(()=>{});
  if(restart)seek(0);
  else void render();
 };
 const preload=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  preload.disconnect();
  if(!generation)void render();
 },{rootMargin:'160px'});
 preload.observe(host);
 expand.onclick=()=>{
  const wide=host.closest('article').classList.toggle('tutorial-wide');
  expand.setAttribute('aria-pressed',String(wide));
  expand.setAttribute('aria-label',wide?'Réduire':'Agrandir');
 };
 new ResizeObserver(resize).observe(view);
}
for(const host of document.querySelectorAll('[data-tutorial]'))makeGuide(host,paths[host.dataset.tutorial]);
