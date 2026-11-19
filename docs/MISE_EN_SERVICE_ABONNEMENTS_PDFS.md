# Entre les lignes — Mise en service des abonnements, PDF et propositions

État constaté le 19 novembre 2026. **Ne pas activer de vente réelle tant que les droits de diffusion des ouvrages et les tests complets ne sont pas établis.**

## 1. Fichiers PDF et droit d'accès

- Dépôt public GitHub : 97 chemins `.pdf`, représentant **52 contenus distincts** (empreintes de blobs Git). Inventaire complet : `catalogue-pdf-inventaire.json`.
- **0 PDF dans le stockage privé Supabase** au moment de cette mise à jour.
- Le compartiment `book-pdfs` est privé. Une fiche de livre peut conserver librement couverture, présentation, résumé, bibliographie et critiques.
- Gestion : `admin-moderation.html` ; audit : `admin-pdf-inventaire.html`.
- L'administration peut attribuer 0 = gratuit ; 1 = cadenas **orange** Découverte ; 2 = **jaune** Passion ; 3 = **rouge** Illimité, masquer et retirer les fiches.
- Pour importer un PDF dans le compartiment privé, un administrateur doit fournir une copie et **attester disposer des droits de diffusion aux abonnés**. La déclaration de l'administrateur n'est pas une vérification juridique indépendante.
- L'accès à un PDF privé utilise un jeton Firebase vérifié côté serveur, un niveau d'abonnement confirmé par Stripe et un lien signé expirant au bout de 60 secondes. Les quotas sont vérifiés avant l'émission du lien.
- Le dépôt GitHub étant **public**, même une suppression du fichier dans la branche principale ne garantit pas la suppression de ses anciennes versions dans l'historique Git, les forks ni les caches. Ces copies ne sont pas protégées par le cadenas. Il faut revoir la diffusion publique et les droits de chaque ouvrage avant commercialisation.

## 2. Connexion, comptes, propositions et messages

- Compte lecteur via Firebase ; données et annotations personnelles isolées par `firebase_uid` dans les fonctions serveur.
- `demander-un-livre.html` : le lecteur propose titre, auteur et informations, ajoute éventuellement couverture et PDF en stockage privé. Les fichiers ne sont pas automatiquement publiés.
- `admin-propositions.html` : compte administrateur **avec e-mail vérifié**, notamment `quentinmorel1912@gmail.com`, pour consulter, décider, répondre.
- `mon-espace.html` : suivi des propositions, notifications internes et nombre de réponses non lues.
- E-mails transactionnels préparés dans la fonction Supabase `secure-account` ; l'envoi dépend d'une **adresse expéditrice vérifiée chez Resend** et de la configuration serveur ci-dessous. Les propositions sont enregistrées même si un e-mail ne part pas. Les réponses sont envoyées par e-mail seulement vers une adresse de lecteur vérifiée.
- Quotas de propositions mensuels : gratuit 3, Découverte 5, Passion 10, Illimité sans limite commerciale par mois. Les listes personnelles sont limitées côté serveur à 10, 20, 35 et 500 (borne anti-abus technique pour Illimité).

## 3. Stripe, uniquement en mode TEST

Les prix suivants ont été vérifiés directement dans le compte Stripe de test connecté :

| Formule | Prix test mensuel | Price ID |
|---|---|---|
| Découverte | 2,99 € | `price_1UdDq83kaCHShBmDpPAaPTNA` |
| Passion | 4,99 € | `price_1UdDqC3kaCHShBmD2QT86CeB` |
| Illimité | 9,99 € | `price_1UdDqG3kaCHShBmDZZpASTUf` |

Ces prix ont `tax_behavior=exclusive`. Le montant fiscal final doit être confirmé selon les paramètres Stripe et la situation du client ; les montants ci-dessus ne sont pas une promesse TTC.

- Les actions `checkout` et `portal` sont codées dans `secure-account`. Elles nécessitent une clé Stripe **test** et n'acceptent pas de clé de production.
- Le webhook `stripe-subscription-webhook` accepte les événements `customer.subscription.created`, `updated`, `deleted` après contrôle de signature et associe l'abonnement au Firebase UID. Seuls `active` et `trialing` pendant une période valide ouvrent l'accès.
- Le portail Stripe de test `bpc_1UdQhb3kaCHShBmDnegC0maA` a été créé, avec annulation en fin de période, factures, changement de carte et changement de formule.
- Une redirection de réussite du paiement **n'active jamais directement** les droits : le statut doit venir du webhook signé.
- Résiliation en fin de période : l'abonnement reste accessible jusqu'à la date d'expiration. En cas de statut non actif ou de période expirée, l'accès premium devient gratuit.

## 4. Secrets à saisir dans la console Supabase

Projet : `cezgcoaokwuobipwfffa` → Edge Functions → Secrets.

```text
STRIPE_SECRET_KEY = sk_test_...                  (clé privée Stripe du compte de test)
STRIPE_WEBHOOK_SECRET = whsec_...                (signature de l'endpoint Stripe créé pour le webhook)
RESEND_API_KEY = re_...                          (clé API Resend)
BOOK_REQUEST_FROM_EMAIL = Bibliothèque <...>     (adresse expéditrice/domaine validé chez Resend)
```

Ne pas ajouter de secrets à GitHub, aux fichiers HTML/JS ni aux conversations. La fonction et le webhook sont déjà déployés côté Supabase, mais l'intégration de paiement et les e-mails ne peuvent pas être considérés comme **vérifiés** sans ces valeurs et des tests bout en bout.

Webhook Stripe de **test** : `https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/stripe-subscription-webhook`. Configurer les trois événements d'abonnement. Ne pas confondre `whsec_` de test et production.

## 5. Plan de vérification avant mise en ligne

- [ ] Tester inscription et reconnexion avec deux comptes Firebase : aucune liste, favori, annotation ou fiche du compte A ne doit être visible sur B.
- [ ] Tester une proposition de livre avec une couverture et un fichier PDF valide ; vérifier sa réception par Quentin et l'isolement des pièces jointes.
- [ ] Tester réponse administrateur, notification interne non lue, confirmation de lecture et e-mails réellement reçus.
- [ ] Tester l'absence de droits d'administration sur un compte lecteur ordinaire.
- [ ] Vérifier les 52 empreintes de PDF et les droits de diffusion pour chaque fichier ; retirer les copies publiques avant vente si elles ne sont pas autorisées.
- [ ] Tester un livre de chacun des trois niveaux avec compte gratuit, Découverte, Passion, Illimité, connexion expirée et lien direct.
- [ ] Tester paiements Stripe **en mode test**, webhook signé, changement de niveau, échec de renouvellement, annulation immédiate et annulation en fin de période.
- [ ] Vérifier le portail Stripe, le calcul de taxe et les règles de résiliation/conformité.
- [ ] Auditer les pages statiques anciennes, leurs liens directs PDF, les anciennes branches, les forks et l'historique Git.
- [ ] Valider la PR #36 après tests sur la branche ; déployer sans mettre en vente d'ouvrages dont la diffusion n'est pas autorisée.

## Sources techniques

- https://docs.stripe.com/billing/quickstart
- https://docs.stripe.com/billing/subscriptions/build-subscriptions
- https://supabase.com/docs/guides/storage/serving/downloads
- https://supabase.com/docs/guides/storage/buckets/fundamentals
- https://www.simonandschuster.com/books/How-to-Win-Friends-and-Influence-People/Dale-Carnegie/Dale-Carnegie-Books/9780671027032
