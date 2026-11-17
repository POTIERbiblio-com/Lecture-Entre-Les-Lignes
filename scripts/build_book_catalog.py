#!/usr/bin/env python3
"""Build the public catalogue from verified per-book metadata. No AI, no invented data."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS = ROOT / "livres"
GENRES = {
 "Fiction": ["Roman contemporain","Imaginaire","Suspense","Amour et relations","Histoire et aventure","BD et manga","Poésie et théâtre","Contes et nouvelles","Horreur"],
 "Savoirs": ["Sciences","Psychologie","Philosophie","Histoire","Économie et politique","Management et entrepreneuriat","Informatique et numérique"],
 "Arts": ["Musique","Cinéma","Architecture","Peinture et photographie"],
 "Vie et société": ["Biographies","Témoignages","Vie pratique","Sociologie","Finances personnelles","Développement personnel"],
 "Spiritualités et religions": ["Religions","Spiritualités","Mythes","Ésotérisme"],
 "Jeunesse et pédagogie": ["Albums","Romans jeunesse","Documentaires","Apprentissage"]
}
entries=[]
for folder in sorted(BOOKS.iterdir()):
 if not folder.is_dir() or not (folder/"fiche.json").is_file(): continue
 try: d=json.loads((folder/"fiche.json").read_text(encoding="utf-8"))
 except Exception as exc: print(f"IGNORÉ {folder.name}: JSON invalide ({exc})");continue
 if d.get("published") is not True: continue
 if d.get("rights_verified") is not True:
  print(f"BROUILLON {folder.name}: droits de diffusion non confirmés");continue
 if d.get("category") not in GENRES or d.get("subcategory") not in GENRES[d["category"]]:
  print(f"IGNORÉ {folder.name}: genre ou sous-genre non reconnu");continue
 if not d.get("title") or not d.get("author"):
  print(f"IGNORÉ {folder.name}: titre ou auteur absent");continue
 pdf=folder/"livre.pdf"
 if not pdf.is_file():
  print(f"IGNORÉ {folder.name}: livre.pdf manquant");continue
 cover=next((folder/name for name in ("couverture.jpg","couverture.png","couverture.webp") if (folder/name).is_file()),None)
 if not cover:
  print(f"IGNORÉ {folder.name}: couverture manquante");continue
 d["id"]=folder.name
 d["pdf_path"]=pdf.relative_to(ROOT).as_posix()
 d["cover_path"]=cover.relative_to(ROOT).as_posix()
 d["review_links"]=[u for u in d.get("review_links",[]) if isinstance(u,str) and u.startswith("https://")]
 entries.append(d)
out=BOOKS/"catalogue-public.json"
out.write_text(json.dumps({"books":entries},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"Catalogue: {len(entries)} livre(s) publiés dans {out}")
