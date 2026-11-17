# Attribution du rôle d'éditeur du catalogue (Firebase Spark)

Ce script est à exécuter **localement** par un propriétaire autorisé du projet Firebase. Il ne nécessite pas Cloud Functions ni le forfait Blaze.

## Préparation

1. Installer Node.js LTS depuis https://nodejs.org/.
2. Dans un dossier privé **en dehors du dépôt GitHub**, exécuter `npm init -y` puis `npm install firebase-admin`.
3. Depuis la console Firebase du projet `lecture-entre-les-lignes`, ouvrir Paramètres du projet > Comptes de service > Générer une clé privée. Conserver le JSON **uniquement sur votre ordinateur**. Ne jamais l'envoyer par message, ni le publier sur GitHub. Une autre méthode d'authentification avec identifiants d'application par défaut peut être utilisée.
4. Placer le fichier `grant-catalog-editor.cjs` de ce dépôt dans le dossier privé.
5. Dans PowerShell : `$env:GOOGLE_APPLICATION_CREDENTIALS='C:\\chemin\\prive\\service-account.json'` (adapter le chemin), puis `node grant-catalog-editor.cjs`.
6. Demander à Quentin de se déconnecter puis de se reconnecter à son compte Firebase pour rafraîchir son jeton.

Le script conserve les autres claims existants et vérifie que l'UID correspond à l'adresse e-mail attendue. Il ne donne aucun accès aux paramètres Firebase du projet.

**Important :** les règles Firestore doivent avoir été publiées. Le catalogue `admin-catalogue.html` utilise encore Supabase et doit être migré vers Firestore pour que le rôle Firebase suffise à l'ouvrir et à enregistrer les livres. Le bouton Mon espace dépend déjà du claim Firebase.
