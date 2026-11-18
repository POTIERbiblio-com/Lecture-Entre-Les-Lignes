#!/usr/bin/env python3
"""Intégration du ZIP autorisé dans le catalogue Entre les lignes."""
import hashlib
import html
import json
from pathlib import Path
import re
import zipfile

ROOT=Path(__file__).resolve().parents[1]
ARCHIVE=ROOT/'imports'/'10-livres.zip'
if not ARCHIVE.is_file():
    raise SystemExit("Ajoute imports/10-livres.zip dans GitHub, puis relance l'action.")
PREFIX='Entre_les_lignes_10_livres/'
with zipfile.ZipFile(ARCHIVE) as z:
    names=set(z.namelist())
    catalogue=json.loads(z.read(PREFIX+'catalogue_10_livres.json'))
    if len(catalogue)!=10 or [b['id'] for b in catalogue]!=[f'liv{i:04d}' for i in range(121,131)]:
        raise SystemExit("Catalogue inattendu : 10 livres liv0121 à liv0130 requis")
    for i,b in enumerate(catalogue,1):
        src_pdf=PREFIX+b['pdf']
        src_cover=PREFIX+b['couverture']
        src_fiche=PREFIX+'fiches/'+b['id']+'.html'
        if not all(p in names for p in [src_pdf,src_cover,src_fiche]):
            raise SystemExit('Fichier manquant pour '+b['id'])
        pdf=z.read(src_pdf)
        if hashlib.sha256(pdf).hexdigest()!=b['sha256']:
            raise SystemExit('PDF modifié ou corrompu : '+b['id'])
        for source,target in [(src_pdf,ROOT/'livres-10'/'pdf'/f'nouveau-{i:02d}.pdf'),(src_cover,ROOT/'livres-10'/'couvertures'/f'nouveau-{i:02d}.jpg')]:
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(z.read(source))
        # Fiche du dossier local adaptée aux chemins du site publié
        fiche=z.read(src_fiche).decode('utf-8')
        fiche=fiche.replace('../pdf/', 'livres-10/pdf/').replace('../couvertures/', 'livres-10/couvertures/')\n        fiche=fiche.replace('href="index.html"', 'href="mes-livres.html"')
        fiche=fiche.replace('href="pdf/', 'href="livres-10/pdf/').replace('src="couvertures/', 'src="livres-10/couvertures/')
        (ROOT/(b['id']+'-fiche.html')).write_text(fiche,encoding='utf-8')
    (ROOT/'livres-10'/'catalogue_10_livres.json').write_text(json.dumps(catalogue,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

entries=[]
for i,b in enumerate(catalogue,1):
    sub='2' if b['genre']=='vie-et-societe' else '1'
    entries.append({'id':b['id'],'title':b['titre'],'author':b['auteur'],'genre':b['genre'],'sub':sub,
        'cover':f'livres-10/couvertures/nouveau-{i:02d}.jpg','presentation':b['resume'],
        'summary':b['resume'],'detailPath':b['id']+'-fiche.html',
        'pdfPath':f'livres-10/pdf/nouveau-{i:02d}.pdf','catalogueRevision':20261118,
        'publicationStatus':'PDF disponible à la lecture et au téléchargement'})
app_path=ROOT/'js'/'app.js'
app=app_path.read_text(encoding='utf-8')
start=app.index('const LIVRES_INITIAUX=[')+len('const LIVRES_INITIAUX=[')
for entry in entries:
    if '"id": "'+entry['id']+'"' in app:
        raise SystemExit('Livre déjà présent : '+entry['id'])
app=app[:start]+'\n'+',\n'.join(json.dumps(b,ensure_ascii=False) for b in entries)+',\n'+app[start:]
app_path.write_text(app,encoding='utf-8')
cat_path=ROOT/'catalogue-documente.json'
cat=json.loads(cat_path.read_text(encoding='utf-8'))
if not isinstance(cat,list):
    raise SystemExit('Format catalogue-documente.json inattendu')
ids={b['id'] for b in cat}
cat=[b for b in cat if b.get('id') not in {e['id'] for e in entries}]
cat.extend(entries)
cat_path.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('10 PDF, 10 couvertures, 10 fiches, résumés et catalogue intégrés.')
