import {reviewThreads,discussion} from './review-discussions.js';
import {auth,requestService} from './request-service.js';

export function bindRecentReviews({books,genres,aliases}) {
  const section=document.getElementById('critiques-recentes');
  const form=document.getElementById('recent-review-filters');
  const status=document.getElementById('recent-reviews-status');
  const list=document.getElementById('recent-reviews-list');
  const more=document.getElementById('recent-reviews-more');
  const fields=form.elements;
  const account=auth.currentUser;
  const current=()=>auth.currentUser?.uid===account?.uid;
  const booksById=new Map(books.map(book=>[book.id,book]));
  const titleOrder=new Intl.Collator('fr',{sensitivity:'base',numeric:true});
  const dates=new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short'});
  const numbers=new Intl.NumberFormat('fr-FR');
  let rows=[],limit=24,loading=false,stale=true,seen=null,latest=null,display=0;
  const normalize=value=>String(value||'').normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('fr').trim().replace(/\s+/g,' ');
  function setOptions(select,entries) {
    const value=select.value;
    const distinct=new Map(entries.filter(([id])=>id));
    select.replaceChildren(select.options[0],...Array.from(distinct).sort((a,b)=>titleOrder.compare(a[1],b[1])).map(([id,label])=>new Option(label,id)));
    if(distinct.has(value))select.value=value;
  }
  function render() {
    if(!current())return;
    setOptions(fields.sub,rows.filter(row=>!fields.genre.value||row.genre===fields.genre.value).map(row=>[row.subkey,row.sub]));
    const terms=normalize(fields.account.value).split(' ').filter(Boolean);
    const filtered=rows.filter(row=>terms.every(term=>normalize(row.accountLabel).includes(term))&&['book','genre','author','rating','sub'].every(key=>{
      const value=fields[key].value;
      return !value||value===String(({book:row.book.id,genre:row.genre,author:row.book.author,rating:row.rating,sub:row.subkey})[key]);
    }));
    const kind=fields.interaction.value;
    const matching=filtered.filter(row=>!kind||(kind==='unread'?row.firebase_uid!==account.uid&&(!seen||Date.parse(row.updated_at)>Date.parse(seen)):row.thread?.[kind]));
    if(fields.order.value==='old')matching.reverse();
    const turn=++display;
    list.replaceChildren(...matching.slice(0,limit).map(row=>{
      const entry=document.createElement('article');
      entry.className='panel';
      const heading=document.createElement('h3');
      const link=document.createElement('a');
      const query=new URLSearchParams({id:row.book.id});
      if(row.book_id!==row.book.id)query.set('source',row.book_id);
      link.href='livre.html?'+query+'#critique-'+row.id;
      link.textContent=row.book.title;
      heading.append(link);
      const score=document.createElement('strong');
      score.textContent='★ '+numbers.format(row.rating)+' / 5';
      const date=document.createElement('time');
      date.dateTime=row.updated_at;
      date.textContent=dates.format(new Date(row.updated_at));
      const meta=document.createElement('p');
      meta.append(score,' · '+row.accountLabel+' · ',date);
      const shelves=document.createElement('p');
      shelves.textContent=[row.book.author,genres[row.genre]?.[0],row.sub].filter(Boolean).join(' · ');
      const top=document.createElement('div');top.className='recent-review-heading';
      if(row.book.cover){
        const cover=document.createElement('img');cover.src=row.book.cover;cover.alt='';cover.loading='lazy';top.append(cover);
      }
      top.append(heading);
      const text=document.createElement('p');text.className='pre-wrap';text.textContent=row.review;
      entry.append(top,meta,shelves);
      if(row.spoiler){
        const spoiler=document.createElement('details');const summary=document.createElement('summary');
        summary.textContent='Lire la critique · contient des révélations';spoiler.append(summary,text);entry.append(spoiler);
      }else entry.append(text);
      const controls=document.createElement('div');controls.dataset.discussionId=row.id;entry.append(controls);
      if(row.thread)controls.append(discussion(row.id,row.thread,3,next=>{row.thread=next;}));
      return entry;
    }));
    status.textContent=matching.length?matching.length+(matching.length===1?' critique':' critiques'):'Aucune critique pour ces filtres.';
    more.hidden=matching.length<=limit;
    const unloaded=matching.slice(0,limit).filter(row=>!row.thread);
    if(unloaded.length)void getThreads(unloaded).then(()=>{
      if(current()&&display===turn)render();
    }).catch(error=>{if(current()&&display===turn)status.textContent=error.message;});
  }
  async function getThreads(entries){
    for(let i=0;i<entries.length;i+=50){
      const page=entries.slice(i,i+50);
      const {threads}=await reviewThreads(page.map(row=>row.id));
      if(!current())return;
      for(const row of page)row.thread=threads[row.id]||{likes:0,liked:false,commented:false,totalComments:0,comments:[]};
    }
  }
  async function updateNotifications(){
    if(!current()||document.visibilityState==='hidden')return;
    try{
      const notification=await requestService('review-notifications',{},account);
      if(!current())return;
      const changed=notification.latest&&notification.latest!==latest;
      latest=notification.latest;seen=notification.seen;
      document.dispatchEvent(new CustomEvent('ell-review-count',{detail:notification.count}));
      const mark=document.getElementById('mark-review-notifications');
      mark.hidden=!notification.count;
      mark.onclick=async()=>{
        try{await requestService('review-notifications-mark',{seen:latest},account);await updateNotifications();render();}
        catch(error){status.textContent=error.message;}
      };
      if(changed&&!section.hidden&&!list.contains(document.activeElement))void refresh();
    }catch(error){if(current())document.dispatchEvent(new CustomEvent('ell-review-count',{detail:0}));}
  }
  async function refresh() {
    if(!current()||loading)return;
    loading=true;
    if(!rows.length)status.textContent='Chargement des critiques…';
    try {
      let cursor=null;
      const data=[];
      do {
        const page=await requestService('recent-reader-reviews',{cursor},account);
        if(!current())return;
        data.push(...page.reviews);
        cursor=page.cursor;
      } while(cursor);
      const labels=new Map(data.filter(row=>row.reviewer_name).reverse().map(row=>[row.firebase_uid,row.reviewer_name]));
      rows=data.flatMap(row=>{
        const book=booksById.get(aliases.get(row.book_id)||row.book_id);
        if(!book)return [];
        return [{...row,book,genre:book.genre,subkey:book.genre+':'+book.sub,
          sub:genres[book.genre]?.[1][book.sub]||'',accountLabel:labels.get(row.firebase_uid)||'Compte '+row.firebase_uid.slice(-10)}];
      });
      setOptions(fields.book,rows.map(row=>[row.book.id,row.book.title]));
      setOptions(fields.genre,rows.map(row=>[row.genre,genres[row.genre]?.[0]||row.genre]));
      setOptions(fields.author,rows.map(row=>[row.book.author,row.book.author]));
      setOptions(fields.rating,rows.map(row=>[String(row.rating),numbers.format(row.rating)+' / 5']));
      if(['liked','commented'].includes(fields.interaction.value))await getThreads(rows);
      stale=false;
      render();
    } catch(error) {
      if(current())status.textContent=error.message;
    } finally {loading=false;}
  }
  fields.account.addEventListener('input',()=>{limit=24;render();});
  form.addEventListener('change',async()=>{
    limit=24;
    if(['liked','commented'].includes(fields.interaction.value)){
      status.textContent='Recherche de tes réactions…';
      try{await getThreads(rows);}catch(error){status.textContent=error.message;return;}
    }
    render();
  });
  form.addEventListener('reset',()=>requestAnimationFrame(()=>{limit=24;render();}));
  more.onclick=()=>{limit+=24;render();};
  function show() {
    section.hidden=location.hash!=='#critiques-recentes';
    if(!section.hidden) {
      if(stale)void refresh();
      requestAnimationFrame(()=>section.scrollIntoView({block:'start'}));
    }
  }
  addEventListener('hashchange',show);
  addEventListener('focus',()=>{stale=true;void updateNotifications();if(!section.hidden)void refresh();});
  const clock=setInterval(()=>void updateNotifications(),15000);
  addEventListener('pagehide',()=>clearInterval(clock),{once:true});
  void updateNotifications();
  show();
}
