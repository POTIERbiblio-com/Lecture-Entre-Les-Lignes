# E-mails de bienvenue et de vérification — Entre les lignes

Le modèle HTML `email-verification-entre-les-lignes.html` utilise la variable `%LINK%` pour le lien de confirmation **Firebase Authentication**. Il est à coller/configurer dans la console Firebase, sous Authentication → Templates → Email address verification, après avoir validé le domaine expéditeur et les domaines autorisés. Le nom et le logo Entre les lignes sont inclus, avec des couleurs rose poudré et mauve.

**Ne pas envoyer cet HTML directement via Resend sans remplacer `%LINK%` par un lien sécurisé généré par Firebase.** Le lien de vérification doit être créé par le fournisseur d'identité et non par le site.

Pour Google, activer Google dans Firebase Authentication → Sign-in method et ajouter le domaine GitHub Pages aux domaines autorisés. Pour e-mail/mot de passe, activer le fournisseur Email/Password et le mode de vérification. Le script `js/app.js` utilise désormais Firebase Auth et non Supabase Auth pour la connexion de l'interface de lecture.

Un e-mail de remerciement après création d'abonnement est également préparé dans `supabase/functions/stripe-subscription-webhook/index.ts` (webhook version 3). Il nécessite `RESEND_API_KEY`, `BOOK_REQUEST_FROM_EMAIL`, `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` configurés côté serveur. Aucun envoi réel n'a été testé ni confirmé. Il ne faut pas lancer de vente de PDF sans les droits de diffusion.

Les modèles et les liens de marque nécessitent que l'adresse GitHub Pages soit effectivement l'adresse de production. Si le site est publié sur un autre domaine, remplacer les URLs du modèle et configurer les domaines autorisés.
