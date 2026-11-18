#!/usr/bin/env python3
"""Crée des couvertures typographiques originales pour les onze fiches."""
import json
import html
import textwrap
from pathlib import Path

root = Path(__file__).resolve().parents[1]
catalog = root / "catalogue-documente.json"
books = json.loads(catalog.read_text(encoding="utf-8"))
selected = [b for b in books if b.get("id", "") in {f"liv{i}" for i in range(110, 121)}]
if len(selected) != 11:
    raise SystemExit(f"11 livres attendus, {len(selected)} trouvés")
out = root / "images" / "couvertures" / "nouveaux-11"
out.mkdir(parents=True, exist_ok=True)
palettes = [
    ("#f9e5e7","#8e4c66","#f3b8c4"), ("#e1e9ed","#2c5665","#9bbdc6"),
    ("#f4ead6","#765c42","#d7bd8e"), ("#e6e1f3","#5e5186","#b6a9db"),
    ("#f2e4d9","#845b4d","#dbb7a6"), ("#e1ede4","#456d5c","#a5cbb0"),
    ("#f5e4ed","#81516f","#d9a7c5"), ("#e7eaf6","#52648b","#b5c2e4"),
    ("#f7e9d8","#805b45","#e2c29c"), ("#e5edf0","#466978","#abcbd5"),
    ("#f0e4ed","#755b83","#c9acd3")
]
def lines(value, width, limit):
    arr = textwrap.wrap(value, width=width, break_long_words=False, break_on_hyphens=False)
    if len(arr) > limit:
        arr = arr[:limit-1] + [" ".join(arr[limit-1:])]
    return arr

changed = 0
for i,b in enumerate(selected):
    bg,ink,accent=palettes[i]
    title=lines(b["title"].split(" : ")[0].split(" — ")[0], 20, 5)
    author=lines(b.get("author",""), 30, 3)
    y=270-(len(title)-1)*27
    titles="".join(f'<text x="300" y="{y+j*66}" text-anchor="middle" font-size="43" font-weight="700">{html.escape(t)}</text>' for j,t in enumerate(title))
    auth="".join(f'<text x="300" y="{670+j*29}" text-anchor="middle" font-size="23">{html.escape(t)}</text>' for j,t in enumerate(author))
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
<rect width="600" height="850" fill="{bg}"/>
<rect x="29" y="29" width="542" height="792" rx="12" fill="none" stroke="{ink}" stroke-width="2"/>
<circle cx="300" cy="154" r="65" fill="{accent}" opacity=".7"/>
<path d="M 100 555 Q 300 490 500 555" fill="none" stroke="{accent}" stroke-width="12"/>
<g font-family="Georgia,serif" fill="{ink}">{titles}{auth}
<text x="300" y="93" text-anchor="middle" font-size="18" letter-spacing="5">ENTRE LES LIGNES</text>
<text x="300" y="785" text-anchor="middle" font-size="17" letter-spacing="3">BIBLIOTHÈQUE</text></g>
</svg>'''
    rel=f'images/couvertures/nouveaux-11/{b["id"]}.svg'
    (root / rel).write_text(svg,encoding="utf-8")
    old=b.get("cover","")
    b["cover"]=rel
    page=root/b["detailPath"]
    txt=page.read_text(encoding="utf-8")
    if old not in txt:
        raise SystemExit(f"Ancienne couverture absente de {page.name}")
    page.write_text(txt.replace(old,rel),encoding="utf-8")
    changed+=1
catalog.write_text(json.dumps(books,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
app=root/"js/app.js"
txt=app.read_text(encoding="utf-8")
for b in selected:
    # Remplace uniquement la couverture dans l'entrée de ce livre.
    import re
    pattern=r'("id"\s*:\s*"'+re.escape(b["id"])+r'"[\s\S]*?"cover"\s*:\s*")[^"]+(")'
    txt,n=re.subn(pattern,lambda m:m.group(1)+b["cover"]+m.group(2),txt,count=1)
    if n!=1:
        raise SystemExit(f"Couverture non trouvée dans js/app.js : {b['id']}")
app.write_text(txt,encoding="utf-8")
print(f"{changed} couvertures originales créées et chemins corrigés")
