#!/usr/bin/env python3
"""Retire uniquement les onze livres ajoutés au catalogue public."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
ids = {f"liv{i:04d}" for i in range(110,121)}
catalog_path = root / "catalogue-documente.json"
books = json.loads(catalog_path.read_text(encoding="utf-8"))
removed = [b for b in books if b.get("id") in ids]
if len(removed) != 11:
    raise SystemExit(f"Annulation : 11 livres attendus, {len(removed)} trouvés")
remaining = [b for b in books if b.get("id") not in ids]
if len(remaining) != 26:
    raise SystemExit(f"Annulation : 26 livres restants attendus, {len(remaining)} trouvés")
app_path = root / "js/app.js"
app = app_path.read_text(encoding="utf-8")
marker = "const LIVRES_INITIAUX="
start = app.index(marker)+len(marker)
end = app.index(";\nconst REFERENCES_CATALOGUE=",start)
initial = json.loads(app[start:end])
if len([b for b in initial if b.get("id") in ids]) != 11:
    raise SystemExit("Annulation : données JS inattendues")
clean = [b for b in initial if b.get("id") not in ids]
app_path.write_text(app[:start]+json.dumps(clean,ensure_ascii=False,indent=2)+app[end:],encoding="utf-8")
catalog_path.write_text(json.dumps(remaining,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
for b in removed:
    for rel in [b.get("detailPath"),b.get("cover")]:
        if not rel:
            continue
        p = root / rel
        if not p.resolve().is_relative_to(root.resolve()):
            raise SystemExit("Chemin dangereux")
        if p.is_file():
            p.unlink()
archive=root/"Extension_11_livres_resumes_critiques.zip"
if archive.is_file():
    archive.unlink()
print("Onze fiches et couvertures retirées ; catalogue : 26 livres ; archive ZIP publique supprimée.")
