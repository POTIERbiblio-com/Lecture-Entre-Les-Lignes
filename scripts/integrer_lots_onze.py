#!/usr/bin/env python3
"""Intègre les 11 notices et leurs couvertures au catalogue principal, sans publier les PDF."""
import json, re, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
src=(ROOT/'lot_01/js/app.js').read_text(encoding='utf-8')
dst=ROOT/'js/app.js'
text=dst.read_text(encoding='utf-8')
mark='const LIVRES_INITIAUX=['
assert src.count(mark)==1 and text.count(mark)==1
decoder=json.JSONDecoder()
pos=src.index(mark)+len(mark)
books=[]
while len(books)<11:
    pos=re.search(r'\S',src[pos:]).start()+pos
    book,end=decoder.raw_decode(src[pos:])
    books.append(book)
    pos+=end
    pos+=len(re.match(r'\s*,?',src[pos:]).group())
assert len(books)==11 and len({b['id'] for b in books})==11
catalog_path=ROOT/'catalogue-documente.json'
catalog=json.loads(catalog_path.read_text(encoding='utf-8'))
existing={b['id'] for b in catalog}
for book in books:
    if book['id'] in existing: continue
    b={k:v for k,v in book.items() if k not in ('chapters','pdfSha256','pdfPages','pdfPath','text')}
    b['pdfPath']=''
    b['publicationStatus']='Notice et couverture publiques ; PDF non proposé'
    cover=Path(book['cover'])
    source=next((ROOT/lot/cover for lot in ('lot_03','lot_04','lot_01','lot_02') if (ROOT/lot/cover).is_file()),None)
    if not source: raise RuntimeError('Couverture manquante : '+str(cover))
    target=ROOT/cover
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,target)
    detail=ROOT/'lot_01'/book['detailPath']
    if not detail.is_file(): raise RuntimeError('Fiche manquante : '+book['detailPath'])
    page=detail.read_text(encoding='utf-8')
    page=re.sub(r'<div class="book-file-actions">.*?</div>','<div class="book-file-actions"><p>PDF non disponible en lecture publique.</p></div>',page,flags=re.S)
    page=re.sub(r'<a\s+href="(?:lire\.html|pdf/)[^"]*"[^>]*>.*?</a>','<span>Lecture PDF indisponible</span>',page,flags=re.S)
    page=page.replace('href="css/','href="css/').replace('src="images/','src="images/')
    (ROOT/book['detailPath']).write_text(page,encoding='utf-8')
    catalog.append(b)
    text=text.replace(mark,mark+'\n'+json.dumps(b,ensure_ascii=False)+',',1)
    existing.add(b['id'])
dst.write_text(text,encoding='utf-8')
catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('11 notices intégrées, sans PDF')
