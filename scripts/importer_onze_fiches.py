#!/usr/bin/env python3
"""Ajoute les fiches des onze livres sans publier des PDF soumis à droits."""
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "Extension_11_livres_resumes_critiques.zip"
APP = ROOT / "js/app.js"
CAT = ROOT / "catalogue-documente.json"
MARK = "const LIVRES_INITIAUX=["
PLACEHOLDER = "images/atelier/soucoupes-pastel.jpg"

def main():
    if not ARCHIVE.is_file():
        raise SystemExit("ZIP introuvable")
    if not (ROOT / PLACEHOLDER).is_file():
        raise SystemExit("Illustration du site introuvable")
    with zipfile.ZipFile(ARCHIVE) as z:
        if z.testzip() is not None:
            raise SystemExit("Archive ZIP endommagée")
        books = json.loads(z.read("integration/nouveaux-livres.json"))
        if len(books) != 11 or len({b["id"] for b in books}) != 11:
            raise SystemExit("Métadonnées des onze livres incohérentes")
        existing = json.loads(CAT.read_text(encoding="utf-8"))
        if not isinstance(existing, list):
            raise SystemExit("Format du catalogue non reconnu")
        old_ids = {b["id"] for b in existing}
        if any(b["id"] in old_ids for b in books):
            raise SystemExit("Livres déjà présents ; aucune modification")
        app = APP.read_text(encoding="utf-8")
        if app.count(MARK) != 1:
            raise SystemExit("Point d'insertion du catalogue absent")
        for b in books:
            htmlpath = b["detailPath"]
            if not re.fullmatch(r"ouvrage-new11-[a-z0-9-]+\\.html", htmlpath):
                raise SystemExit("Nom de fiche invalide")
            if (ROOT / htmlpath).exists():
                raise SystemExit("Fiche déjà présente : " + htmlpath)
            html = z.read(htmlpath).decode("utf-8")
            # Désactiver les boutons de lecture/téléchargement tant que les droits
            # de diffusion publique des fichiers PDF ne sont pas établis.
            html, count = re.subn(
                r'<div class="book-file-actions">.*?</div>',
                '<div class="book-file-actions"><p>PDF non diffusé publiquement : autorisation des ayants droit nécessaire.</p></div>',
                html, count=1, flags=re.DOTALL)
            if count != 1:
                raise SystemExit("Zone PDF introuvable : " + htmlpath)
            html = html.replace(b["cover"], PLACEHOLDER)
            # Garder les résumés et les liens externes, sans créer de lien PDF cassé.
            html = re.sub(r'<a\\s+href="lire\\.html[^"]*"[^>]*>.*?</a>',
                          '<span>Lecture du PDF non disponible publiquement</span>',
                          html, flags=re.DOTALL)
            (ROOT / htmlpath).write_text(html, encoding="utf-8")
            b["pdfPath"] = ""
            b["cover"] = PLACEHOLDER
            b.pop("pdfSha256", None)
            b["publicationStatus"] = "Fiche publique ; PDF non diffusé faute d'autorisation vérifiée"
        existing.extend(books)
        CAT.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
        additions = ",\\n".join(json.dumps(b, ensure_ascii=False, indent=2) for b in books)
        APP.write_text(app.replace(MARK, MARK + "\\n" + additions + ",", 1), encoding="utf-8")
        print("11 fiches et résumés intégrés ;", len(existing), "livres au catalogue ; aucun PDF publié")

if __name__ == "__main__":
    main()
