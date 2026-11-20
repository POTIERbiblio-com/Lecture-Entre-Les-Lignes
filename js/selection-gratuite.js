import {catalogueRules} from './catalogue-access.js';

const status = document.querySelector('#selection-status');
const selection = document.querySelector('.books');
const source = 'https://cezgcoaokwuobipwfffa.supabase.co/rest/v1/catalogue_editorial_books?select=id,ficha';
const headers = {apikey: 'sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3'};
const showBook = (id, book) => {
  const card = document.createElement('article');
  if (/^images\/couvertures\/[a-z0-9-]+\.webp$/.test(book.cover)) {
    const cover = new Image(90, 130);
    cover.src = book.cover;
    cover.alt = '';
    cover.loading = 'lazy';
    card.append(cover);
  }
  const details = document.createElement('div');
  const title = document.createElement('h2');
  const author = document.createElement('p');
  title.textContent = book.title;
  author.textContent = book.author;
  const link = document.createElement('a');
  link.href = 'lire.html?id=' + encodeURIComponent(id);
  link.textContent = 'Lire le PDF';
  const info = document.createElement('a');
  info.href = 'livre.html?id=' + encodeURIComponent(id);
  info.textContent = 'Voir la fiche';
  details.append(title, author, info, ' · ', link);
  card.append(details);
  selection.append(card);
};
try {
  const [rules, response] = await Promise.all([catalogueRules(), fetch(source, {headers, cache: 'no-store'})]);
  if (!response.ok) throw new Error('Catalogue indisponible');
  for (const {id, ficha: book} of await response.json()) {
    const rule = rules.get(id);
    if (book.privatePdf && rule?.access_level === 0 && !rule.hidden && !rule.deleted) showBook(id, book);
  }
  status.textContent = selection.childElementCount ? '' : 'Aucun titre à afficher dans cette sélection.';
} catch {
  status.textContent = 'La sélection est momentanément indisponible. Tu peux consulter le catalogue.';
}
