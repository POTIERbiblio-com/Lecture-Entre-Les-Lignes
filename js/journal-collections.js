export function bindJournalBuilder({state,readerLevel,genres,bookLanguage,fillLanguageOptions,save,uid,renderNotes,bookLink}){
 const get=id=>document.getElementById(id);
 const host=get('journal-builder'), form=get('journal-collection-form');
 const list=get('journal-collections'), candidates=get('journal-candidates');
 const feedback=get('journal-collection-status'), filter=get('journal-list-language');
 const fields=form.elements;
 const kind='journal-collection';
 const text=(tag,value)=>Object.assign(document.createElement(tag),{textContent:value});
 const button=(label,action)=>Object.assign(text('button',label),{type:'button',className:'secondary',onclick:action});
 const normalize=value=>String(value||'').normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('fr');
 fillLanguageOptions(filter,state.books);
 filter.onchange=()=>{renderNotes();if(readerLevel>=2)renderJournals();};
 host.hidden=false;
 get('journal-plan-offer').hidden=readerLevel>=2;
 if(readerLevel<2)return;
 form.hidden=false;

 const books=new Map(state.books.map(book=>[book.id,book]));
 let editing=null, selected={book:new Set(),highlight:new Set(),sheet:new Set()}, visible=[];
 for(const author of [...new Set(state.books.map(b=>b.author).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'))){
  fields.author.add(new Option(author,author));
 }
 for(const [id,[label]] of Object.entries(genres))fields.genre.add(new Option(label,id));
 fillLanguageOptions(fields.language,state.books);
 function subgenres(){
  fields.sub.replaceChildren(new Option('Tous les sous-genres',''),...(genres[fields.genre.value]?.[1]||[]).map((label,index)=>new Option(label,index)));
  fields.sub.disabled=!fields.genre.value;
 }
 function selectionCount(){
  get('journal-selection-count').textContent=selected.book.size+' livre(s) entier(s) · '+selected.highlight.size+' surlignage(s) · '+selected.sheet.size+' fiche(s)';
 }
 function item(group,id,label){
  visible.push([group,id]);
  const row=text('label','');
  const input=Object.assign(document.createElement('input'),{type:'checkbox',checked:selected[group].has(id)});
  input.onchange=()=>{if(input.checked)selected[group].add(id);else selected[group].delete(id);selectionCount();};
  row.append(input,' '+label);
  return row;
 }
 function renderCandidates(){
  visible=[];
  candidates.replaceChildren();
  const term=normalize(fields.titleFilter.value);
  const available=state.books.filter(book=>(!term||normalize(book.title).includes(term))
   &&(!fields.author.value||fields.author.value===book.author)
   &&(!fields.genre.value||fields.genre.value===book.genre)
   &&(!fields.sub.value||fields.sub.value===String(book.sub))
   &&(!fields.language.value||fields.language.value===bookLanguage(book)));
  for(const book of available){
   const row=document.createElement('details');
   row.className='publication-option';
   const marks=state.highlights.filter(mark=>mark.book===book.id);
   const sheets=state.notes.filter(note=>note.book===book.id&&note.kind==='fiches');
   row.append(text('summary',book.title+' · '+marks.length+' surlignage(s) · '+sheets.length+' fiche(s)'));
   row.append(item('book',book.id,'Inclure le livre entier dans le journal'));
   for(const mark of marks)row.append(item('highlight',mark.id,'Surlignage · '+(mark.quote||mark.annotation||'Passage').slice(0,170)));
   for(const sheet of sheets)row.append(item('sheet',sheet.id,'Fiche · '+sheet.title));
   candidates.append(row);
  }
  if(!available.length)candidates.append(text('p','Aucun livre pour ces filtres.'));
  selectionCount();
 }
 fields.genre.onchange=()=>{subgenres();renderCandidates();};
 for(const key of ['author','sub','language'])fields[key].onchange=renderCandidates;
 fields.titleFilter.oninput=renderCandidates;
 for(const selectAll of form.querySelectorAll('[data-journal-all]'))selectAll.onclick=()=>{
  for(const [group,id] of visible)if(group===selectAll.dataset.journalAll)selected[group].add(id);
  renderCandidates();
 };
 form.querySelector('[data-journal-none]').onclick=()=>{
  for(const group of Object.values(selected))group.clear();
  renderCandidates();
 };
 function edit(note){
  editing=note?.id||null;
  fields.title.value=note?.title||'';
  fields.body.value=note?.body||'';
  selected=Object.fromEntries(['book','highlight','sheet'].map(group=>[group,new Set(note?.selection?.[group]||[])]));
  renderCandidates();
  fields.title.focus();
 }
 get('journal-new').onclick=()=>edit(null);
 form.onsubmit=async event=>{
  event.preventDefault();
  const title=fields.title.value.trim();
  if(!title){fields.title.focus();return;}
  const previous=state.notes;
  const note={id:editing||uid(),kind,title,body:fields.body.value,selection:Object.fromEntries(Object.entries(selected).map(([key,ids])=>[key,[...ids]])),updated:new Date().toISOString()};
  const submit=form.querySelector('[type=submit]');
  submit.disabled=true;
  state.notes=[...state.notes.filter(row=>row.id!==note.id),note];
  try{await save();editing=note.id;feedback.textContent='Journal enregistré.';renderJournals();}
  catch(error){state.notes=previous;feedback.textContent=error.message;}
  finally{submit.disabled=false;}
 };
 function renderJournals(){
  list.replaceChildren();
  for(const note of state.notes.filter(item=>item.kind===kind)){
   const chosen=note.selection||{};
   const whole=(chosen.book||[]).map(id=>books.get(id)).filter(Boolean);
   const marks=state.highlights.filter(mark=>chosen.highlight?.includes(mark.id)&&books.has(mark.book));
   const sheets=state.notes.filter(sheet=>sheet.kind==='fiches'&&chosen.sheet?.includes(sheet.id)&&books.has(sheet.book));
   if(filter.value&&![...whole,...marks.map(x=>books.get(x.book)),...sheets.map(x=>books.get(x.book))].some(book=>bookLanguage(book)===filter.value))continue;
   const card=document.createElement('article');
   card.className='reading-sheet';
   const heading=text('h3',note.title);
   const body=text('p',note.body||'');
   body.className='pre-wrap';
   card.append(heading,body);
   for(const book of whole){
    const p=text('p','');
    p.append(Object.assign(text('a','Ouvrir le livre entier · '+book.title),{href:bookLink(book,'lire')}));
    card.append(p);
   }
   for(const mark of marks){
    const book=books.get(mark.book);
    const p=text('blockquote',mark.quote||'');
    const url=bookLink(book,'lire')+'&pdfpage='+encodeURIComponent(mark.pageNumber||1);
    p.append(text('p',mark.annotation||''),Object.assign(text('a',book.title+' · page '+(mark.pageNumber||1)),{href:url}));
    card.append(p);
   }
   for(const sheet of sheets){
    const item=document.createElement('details');
    item.append(text('summary','Fiche · '+sheet.title+' · '+books.get(sheet.book).title),text('p',sheet.body||sheet.passage||''));
    card.append(item);
   }
   card.append(button('Modifier',()=>edit(note)),button('Retirer',async()=>{
    if(!confirm('Retirer ce journal ?'))return;
    const previous=state.notes;
    state.notes=state.notes.filter(item=>item.id!==note.id);
    try{await save();if(editing===note.id)edit(null);renderJournals();}
    catch(error){state.notes=previous;feedback.textContent=error.message;}
   }));
   list.append(card);
  }
 }
 subgenres();
 renderCandidates();
 renderJournals();
}
