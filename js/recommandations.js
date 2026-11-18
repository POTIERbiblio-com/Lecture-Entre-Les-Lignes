/* Recommandations déterministes, sans IA externe et sans données fictives.
   Utilisation: ELLRecommendations.rank(books, likedBooks, stats).
   stats = { [bookId]: {likes: nombre réel, downloads: nombre réel} }.
   Les compteurs doivent provenir du serveur, jamais du navigateur. */
window.ELLRecommendations = (() => {
 const words = value => String(value || '').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(w=>w.length>3);
 const id = b => String(b.id ?? '');
 const safe = n => Math.max(0, Number.isFinite(Number(n)) ? Number(n) : 0);
 function rank(books, likedBooks=[], stats={}) {
  const liked = new Set(likedBooks.map(b=>typeof b==='string'?b:id(b)));
  const seeds = books.filter(b=>liked.has(id(b)));
  const genres = new Map(), authors = new Map(), terms = new Map();
  for(const b of seeds) {
   genres.set(b.genre,(genres.get(b.genre)||0)+1);
   authors.set(b.author,(authors.get(b.author)||0)+1);
   for(const w of new Set(words(b.title+' '+(b.summary||'')+' '+(b.sub||'')))) terms.set(w,(terms.get(w)||0)+1);
  }
  return books.filter(b=>!liked.has(id(b)) && !b.hidden && b.publicationStatus!=='masqué').map(b=>{
   const popularity=stats[id(b)]||{};
   const affinity=8*(genres.get(b.genre)||0)+5*(authors.get(b.author)||0)+
    [...new Set(words(b.title+' '+(b.summary||'')))].reduce((sum,w)=>sum+Math.min(terms.get(w)||0,3),0);
   const popularityScore=Math.log1p(safe(popularity.likes))*2+Math.log1p(safe(popularity.downloads));
   return {book:b,score:affinity+popularityScore,affinity,popularityScore};
  }).sort((a,b)=>b.score-a.score||id(a.book).localeCompare(id(b.book)));
 }
 function trending(books,stats={},metric='likes'){
  if(!['likes','downloads'].includes(metric)) throw Error('Métrique invalide');
  return books.filter(b=>!b.hidden).slice().sort((a,b)=>safe(stats[id(b)]?.[metric])-safe(stats[id(a)]?.[metric])||id(a).localeCompare(id(b)));
 }
 return {rank,trending};
})();
