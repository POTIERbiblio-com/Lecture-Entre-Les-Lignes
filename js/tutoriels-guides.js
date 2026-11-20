const reader='lire.html?id=edition-6e9408ef-af2f-5583-949d-742806ca90ff&pdfpage=5';
const proposal='demander-un-livre.html';
const paths={
 genres:[
  ['genres.html','.site-nav a[href="genres.html"]','Genres','Dans le menu du haut, clique sur « Genres ». Tu arrives sur la page qui rassemble les rayons.',true],
  ['genres.html','a.genre-plate[href="fiction.html"] .genre-book-count','L’index des genres','Le chiffre en haut de « Romans et fiction » indique le nombre de livres dans tout ce genre.'],
  ['genres.html','a.genre-plate[href="fiction.html"]','L’index des genres','Clique sur la carte « Romans et fiction » pour afficher ses sous-genres.',true],
  ['fiction.html','a.rayon-image[href="livres-fiction-7.html"] .genre-book-count','Romans et fiction','Le compteur de « Contes et nouvelles » indique combien de livres sont dans ce sous-genre.'],
  ['fiction.html','a.rayon-image[href="livres-fiction-7.html"]','Romans et fiction','Clique sur « Contes et nouvelles ». La page suivante affiche les livres de ce rayon.',true],
  ['livres-fiction-7.html','#books article a.btn','Contes et nouvelles','Sous la couverture, clique sur « Présentation du livre » pour retrouver la fiche et les résumés.',true]
 ],
 carnet:[
  ['livre.html?id=edition-6e9408ef-af2f-5583-949d-742806ca90ff','.book-file-actions a[href^="lire.html"]','Présentation du livre','Dans la fiche du livre, clique sur « Lire » ou « Ouvrir le lecteur ». Connecte-toi pour enregistrer tes traces.',true],
  [reader,'.reader-pencils .pencil','Le lecteur PDF','Les couleurs sont au-dessus de la page. Clique sur le crayon de la couleur que tu veux utiliser.',true],
  [reader,'#pdf-text-layer span[role="presentation"]','Le lecteur PDF','Sélectionne les mots qui t’intéressent. Sur un PDF scanné, utilise « Zone » si l’outil apparaît.'],
  [reader,'#save-selection','Le lecteur PDF','Reviens à la barre d’outils et clique sur « Surligner la sélection ».',true],
  [reader,'#reader-annotation','Mon passage choisi','Clique sur ton passage surligné, puis saisis ta note dans « Mon annotation ». Enregistre le passage.',true],
  [reader,'#save-reader-sheet','Ma fiche de lecture','Sous le PDF, renseigne la page, le passage et tes notes dans « Ma fiche de lecture ». Clique sur « Enregistrer la fiche ». ',true],
  ['mon-espace.html','a.object-link[href="journaux.html"]','Mon espace','Dans « Mon espace », clique sur « Journaux ». Les journaux personnalisés sont disponibles avec Passion et Illimité.',true,'demo'],
  ['journaux.html','#journal-collection-form button[type="submit"]','Mes journaux de livres','Choisis les surlignages et les fiches à réunir. Donne un titre au journal, puis clique sur « Enregistrer le journal ». ',true,'demo']
 ],
 proposer:[
  [proposal,'.site-nav a[href="demander-un-livre.html"]','Proposer un livre','Dans le menu, clique sur « Proposer un livre ».',true,'demo'],
  [proposal,'.request-banner-link','Proposer un livre','Sur cette page, clique sur « Remplir ma proposition ». Connecte-toi si le site te le demande.',true,'demo'],
  [proposal,'#request-form input[name="title"]','Ma proposition','Écris le titre exact du livre dans le champ obligatoire. Ajoute le nom de l’auteur si tu le connais.',true,'demo'],
  [proposal,'#request-form select[name="genre"]','Ma proposition','Tu peux renseigner le genre et, un peu plus bas, la langue du PDF.',true,'demo'],
  [proposal,'#request-pdf','Ma proposition','Ajoute ton PDF ou une couverture, si tu en as le droit. Ces pièces jointes sont facultatives.',true,'demo'],
  [proposal,'#send-request','Ma proposition','Relis les informations, puis clique sur « Envoyer ma proposition ».',true,'demo'],
  [proposal,'.request-history-card h2','Mes propositions','Dans « Mes propositions », retrouve ta demande et consulte son statut et les réponses.',false,'demo']
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
function makeGuide(host,steps){
 const header=element(host,'p','tutorial-page','Démo du site');
 const view=element(host,'div','tutorial-view');
 view.hidden=true;
 const overlay=element(view,'div','tutorial-overlay');
 overlay.setAttribute('aria-hidden','true');
 const rect=element(overlay,'div','tutorial-focus');
 const pointer=element(overlay,'span','tutorial-pointer','➤');
 const caption=element(host,'p','tutorial-caption','Lance la démonstration pour voir les étapes.');
 caption.setAttribute('aria-live','polite');
 const bar=element(host,'div','tutorial-controls');
 const previous=element(bar,'button','','‹');
 previous.setAttribute('aria-label','Étape précédente');
 const play=element(bar,'button','','Lancer');
 const next=element(bar,'button','','›');
 next.setAttribute('aria-label','Étape suivante');
 const sound=element(bar,'button','','Écouter');
 sound.setAttribute('aria-pressed','false');
 for(const control of bar.querySelectorAll('button'))control.type='button';
 if(!('speechSynthesis' in window))sound.hidden=true;
 let stage=0, generation=0, playing=false, narrated=false, elapsed=null;
 let iframe, lastPath, ready, target, currentClick=false, speech, clickTimer, observer;
 previous.disabled=true;
 next.disabled=true;
 function stop(){
  clearTimeout(elapsed);
  elapsed=null;
  const speaking=speech;
  speech=null;
  if(speaking)speechSynthesis.cancel();
 }
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
  view.hidden=false;
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
 function proceed(token){
  if(token!==generation||!playing)return;
  if(stage<steps.length-1){stage++;void render();}
  else {playing=false;play.textContent='Revoir';}
 }
 function narration(text,token,duration){
  if(!playing)return;
  elapsed=setTimeout(()=>proceed(token),duration);
  if(!narrated||!('speechSynthesis' in window))return;
  const voices=speechSynthesis.getVoices().filter(voice=>/^fr(?:-|$)/i.test(voice.lang));
  const voice=voices.find(v=>/audrey|am[ée]lie|denise|hortense|virginie|[ée]lodie|vivienne|fran[çc]ais|julie|c[ée]line|sylvie|louise/i.test(v.name));
  if(!voice){sound.textContent='Voix française indisponible';return;}
  const request=new SpeechSynthesisUtterance(text);
  request.lang=voice.lang;
  request.voice=voice;
  request.rate=.91;
  request.onstart=()=>{if(speech===request)clearTimeout(elapsed);};
  request.onend=()=>{if(speech===request)elapsed=setTimeout(()=>proceed(token),450);};
  speech=request;
  speechSynthesis.speak(request);
 }
 async function render(){
  const token=++generation;
  stop();
  observer?.disconnect();
  clearTimeout(clickTimer);
  target=null;
  overlay.hidden=true;
  overlay.classList.remove('tutorial-click');
  const [path,selector,name,text,click,demo]=steps[stage];
  currentClick=click;
  header.textContent=name+' · '+(stage+1)+' / '+steps.length+(demo?' · Démonstration':'');
  caption.textContent='Chargement de l’écran…';
  previous.disabled=stage===0;
  next.disabled=stage===steps.length-1;
  const doc=await preview(path,demo);
  if(token!==generation||!doc?.body)return;
  if(demo)showDemo(doc,path);
  target=await waitForTarget(doc,selector);
  if(token!==generation)return;
  if(target){
   target.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
   if(path===reader){
    const sample=doc.querySelector('#pdf-text-layer span[role="presentation"]');
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
   if(currentClick)clickTimer=setTimeout(()=>{if(token===generation)overlay.classList.add('tutorial-click');},stage<2?900:1300);
  }
  caption.textContent=text;
  narration(text,token,Math.max(4100,text.split(/\s+/).length*448));
 }
 previous.onclick=()=>{if(stage>0){stage--;void render();}};
 next.onclick=()=>{if(stage<steps.length-1){stage++;void render();}};
 play.onclick=()=>{
  playing=!playing;
  if(playing){if(play.textContent==='Revoir')stage=0;play.textContent='Pause';void render();}
  else {stop();play.textContent='Reprendre';}
 };
 sound.onclick=()=>{
  narrated=!narrated;
  sound.setAttribute('aria-pressed',String(narrated));
  sound.textContent=narrated?'Couper la voix':'Écouter';
  if(narrated&&!playing){playing=true;play.textContent='Pause';}
  if(playing)void render();
 };
 new ResizeObserver(resize).observe(view);
}
for(const host of document.querySelectorAll('[data-tutorial]'))makeGuide(host,paths[host.dataset.tutorial]);
