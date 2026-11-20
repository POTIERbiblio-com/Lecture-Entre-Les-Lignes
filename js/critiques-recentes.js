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
  let rows=[],limit=24,loading=false,stale=true;
  function setOptions(select,entries) {
    const value=select.value;
    const distinct=new Map(entries.filter(([id])=>id));
    select.replaceChildren(select.options[0],...Array.from(distinct).sort((a,b)=>titleOrder.compare(a[1],b[1])).map(([id,label])=>new Option(label,id)));
    if(distinct.has(value))select.value=value;
  }
  function render() {
    if(!current())return;
    setOptions(fields.sub,rows.filter(row=>!fields.genre.value||row.genre===fields.genre.value).map(row=>[row.subkey,row.sub]));
    const filtered=rows.filter(row=>['book','genre','author','account','rating','sub'].every(key=>{
      const value=fields[key].value;
      return !value||value===String(({book:row.book.id,genre:row.genre,author:row.book.author,account:row.firebase_uid,rating:row.rating,sub:row.subkey})[key]);
    }));
    if(fields.order.value==='old')filtered.reverse();
    list.replaceChildren(...filtered.slice(0,limit).map(row=>{
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
      entry.append(heading,meta,shelves);
      return entry;
    }));
    status.textContent=filtered.length?filtered.length+(filtered.length===1?' critique':' critiques'):'Aucune critique pour ces filtres.';
    more.hidden=filtered.length<=limit;
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
      setOptions(fields.account,rows.map(row=>[row.firebase_uid,row.accountLabel+' · '+row.firebase_uid.slice(-6)]));
      setOptions(fields.rating,rows.map(row=>[String(row.rating),numbers.format(row.rating)+' / 5']));
      stale=false;
      render();
    } catch(error) {
      if(current())status.textContent=error.message;
    } finally {loading=false;}
  }
  form.addEventListener('change',()=>{limit=24;render();});
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
  addEventListener('focus',()=>{stale=true;if(!section.hidden)void refresh();});
  show();
}
