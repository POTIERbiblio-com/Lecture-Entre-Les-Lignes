#!/usr/bin/env python3
"""Importe les six livres du ZIP déjà déposé sur GitHub, sans remplacer le site."""
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "Correctif_6_livres_a_fusionner.zip"
CATALOGUE = ROOT / "catalogue-documente.json"
APP = ROOT / "js/app.js"
IDS = [f"liv01{i:02d}" for i in range(1, 7)]
PREFIX = "const LIVRES_INITIAUX=["
EXPECTED_FILES = [
    "pdf/nouveau-courage.pdf",
    "pdf/nouveau-harman.pdf",
    "pdf/nouveau-positive.pdf",
    "pdf/nouveau-millionnaire.pdf",
    "pdf/nouveau-manuscrit.pdf",
    "pdf/nouveau-leaders.pdf",
    "images/couvertures/nouveau-courage.jpg",
    "images/couvertures/nouveau-harman.jpg",
    "images/couvertures/nouveau-positive.jpg",
    "images/couvertures/nouveau-millionnaire.jpg",
    "images/couvertures/nouveau-manuscrit.jpg",
    "images/couvertures/nouveau-leaders.jpg",
    "ouvrage-nouveau-courage.html",
    "ouvrage-nouveau-harman.html",
    "ouvrage-nouveau-positive.html",
    "ouvrage-nouveau-millionnaire.html",
    "ouvrage-nouveau-manuscrit.html",
    "ouvrage-nouveau-leaders.html",
]

def main():
    if not ARCHIVE.is_file():
        raise SystemExit("Archive des six livres manquante.")
    with zipfile.ZipFile(ARCHIVE) as z:
        names = set(z.namelist())
        required = set(EXPECTED_FILES) | {"catalogue-documente.json"}
        missing = required - names
        if missing:
            raise SystemExit(f"Archive incomplète : {sorted(missing)}")
        source = json.loads(z.read("catalogue-documente.json"))
        added = [b for b in source if b.get("id") in IDS]
        if len(added) != 6 or {b["id"] for b in added} != set(IDS):
            raise SystemExit("Métadonnées des six livres incohérentes.")
        added.sort(key=lambda b: b["id"])
        for b in added:
            for field, allowed_prefix in [
                ("pdfPath", "pdf/"),
                ("cover", "images/couvertures/"),
                ("detailPath", "ouvrage-nouveau-"),
            ]:
                value = b.get(field)
                if not isinstance(value, str) or not value.startswith(allowed_prefix) or value not in required:
                    raise SystemExit(f"Chemin invalide pour {b['id']}: {field}")
            pdf = z.read(b["pdfPath"])
            if not pdf.startswith(b"%PDF-"):
                raise SystemExit(f"PDF invalide: {b['pdfPath']}")
            checksum = hashlib.sha256(pdf).hexdigest()
            if b.get("pdfSha256") != checksum:
                raise SystemExit(f"Somme SHA-256 incorrecte: {b['pdfPath']}")
        for rel in EXPECTED_FILES:
            target = ROOT / rel
            raw = z.read(rel)
            if target.is_file():
                if target.read_bytes() != raw:
                    raise SystemExit(f"Fichier existant différent ; pas d'écrasement: {rel}")
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
            print("Ajout:", rel)

    current = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    if not isinstance(current, list):
        raise SystemExit("Format du catalogue existant inattendu.")
    existing_ids = {b.get("id") for b in current}
    if set(IDS) & existing_ids and not set(IDS).issubset(existing_ids):
        raise SystemExit("Catalogue partiellement importé : vérification manuelle requise.")
    if not set(IDS).issubset(existing_ids):
        current.extend(added)
        CATALOGUE.write_text(
            json.dumps(current, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print("Catalogue documentaire actualisé :", len(current), "livres")

    app = APP.read_text(encoding="utf-8")
    present = {book_id for book_id in IDS if f'"id": "{book_id}"' in app}
    if present and present != set(IDS):
        raise SystemExit("js/app.js contient seulement une partie des six livres.")
    if not present:
        if app.count(PREFIX) != 1:
            raise SystemExit("Début de LIVRES_INITIAUX introuvable ou ambigu.")
        snippet = ",\n".join(json.dumps(b, ensure_ascii=False, indent=2) for b in added)
        app = app.replace(PREFIX, PREFIX + "\n" + snippet + ",", 1)
        APP.write_text(app, encoding="utf-8")
        print("Six livres ajoutés à js/app.js sans écraser les fonctionnalités existantes.")
    print("Contrôle terminé : six PDF, six couvertures, six fiches et références catalogue.")

if __name__ == "__main__":
    main()
