# Entre les lignes — Ajout de livres par dossiers GitHub

## Fonctionnement
Un dossier = un livre : `livres/identifiant-livre/` avec `fiche.json`, `livre.pdf`, `couverture.jpg` (ou PNG/WebP).
La même page `livre.html?id=github-identifiant-livre` et le lecteur `lire.html?id=github-identifiant-livre` réutilisent le design existant.
Le script `scripts/build_book_catalog.py` vérifie les fiches, les catégories, les chemins et les droits confirmés. GitHub Actions regénère `livres/catalogue-public.json` à chaque modification de `livres/`.

## Important
Le PDF seul ne permet **pas** de générer des résumés exacts, une bibliographie vérifiée ou des critiques réelles par magie. Renseigner `fiche.json` après lecture du document. Ne pas inventer les pages ou les critiques.
Les nouveaux dossiers sont en **brouillon** par défaut. Publication uniquement avec `published:true`, `rights_verified:true` et PDF + couverture présents.
Le dépôt et GitHub Pages sont publics : ne déposer aucun PDF sous droits sans autorisation de diffusion. `published:false` ne rend **pas** un fichier présent sur GitHub privé. Ne téléversez pas de PDF protégé, même en brouillon.
Les données du catalogue Firebase (atelier Quentin) sont lues séparément et demandent des règles Firestore autorisant la lecture des livres publiés.
Les champs `chapters` acceptent `number`, `title`, `page_start`, `page_end`, `summary`. Les numéros sont ceux du PDF sauf indication contraire.
Les illustrations réutilisent les éléments graphiques existants ; la couverture doit provenir du PDF réel ou d'un visuel autorisé.

## Exemple
```json
{
 "title": "Titre exact",
 "author": "Auteur vérifié",
 "category": "Savoirs",
 "subcategory": "Psychologie",
 "description": "Présentation vérifiée",
 "summary": "Résumé général vérifié",
 "publisher": "",
 "publication_year": null,
 "isbn": "",
 "chapters": [{"number":1,"title":"Titre réel","page_start":1,"page_end":8,"summary":"Résumé vérifié"}],
 "review_links": [],
 "published": false,
 "rights_verified": false
}
```

## Étapes
1. Compléter le dossier localement. Pour une œuvre protégée sans droits de diffusion, conserver le PDF hors du dépôt public.
2. Envoyer le dossier dans `livres/` sur GitHub.
3. Contrôler l'exécution GitHub Actions et le fichier `livres/catalogue-public.json`.
4. Tester la fiche, le lecteur et le téléchargement sur le site GitHub Pages.
5. Vérifier l'autorisation de diffusion avant toute mise en ligne publique.
