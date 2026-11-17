const ELL_URL='https://cezgcoaokwuobipwfffa.supabase.co',ELL_KEY='sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3';let ell=null,ellUser=null;
async function ellConnect(){if(!ell){const m=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');ell=m.createClient(ELL_URL,ELL_KEY);}return ell;}
function ellClear(){state.notes=[];state.highlights=[];state.questions=[];state.reviews={};state.profile={};for(const b of state.books){b.position='';b.pdfPage=1;}}
const GENRES={"fiction": ["Fiction", ["Roman contemporain", "Imaginaire", "Suspense", "Amour et relations", "Histoire et aventure", "BD et manga", "Poésie et théâtre", "Contes et nouvelles", "Horreur"]], "savoirs": ["Savoirs", ["Sciences", "Psychologie", "Philosophie", "Histoire", "Économie et politique", "Management et entrepreneuriat", "Informatique et numérique"]], "arts": ["Arts", ["Musique", "Cinéma", "Architecture", "Peinture et photographie"]], "vie-et-societe": ["Vie et société", ["Biographies", "Témoignages", "Vie pratique", "Sociologie", "Finances personnelles", "Développement personnel"]], "spiritualites": ["Spiritualités et religions", ["Religions", "Spiritualités", "Mythes", "Ésotérisme"]], "jeunesse": ["Jeunesse et pédagogie", ["Albums", "Romans jeunesse", "Documentaires", "Apprentissage"]]};
'use strict';
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db,state,objects=[];const id=new URLSearchParams(location.search).get('id')||$('book-detail')?.dataset.bookId||$('reader-content')?.dataset.bookId;
const LIVRES_INITIAUX=[
  {
    "id": "liv0001",
    "title": "L’Art d’avoir toujours raison",
    "author": "Arthur Schopenhauer",
    "genre": "savoirs",
    "sub": "2",
    "cover": "images/niveau-4-livres/savoirs/philosophie/liv0001-couverture.jpg",
    "presentation": "Un essai sur les procédés employés dans une controverse. Schopenhauer examine la façon dont on peut prendre l’avantage dans un débat, y compris lorsque la solidité des arguments est en question.",
    "summary": "",
    "text": "",
    "publisher": "Mille et une nuits",
    "year": 2021,
    "isbn": "9782755507744",
    "catalogueRevision": 20261113
  },
  {
    "id": "liv0002",
    "title": "Cerveau et odorat",
    "author": "Moustafa Bensafi et Catherine Rouby",
    "genre": "savoirs",
    "sub": "0",
    "cover": "images/niveau-4-livres/savoirs/sciences/liv0002-couverture.jpg",
    "presentation": "Moustafa Bensafi et Catherine Rouby explorent l’odorat et ses liens avec les émotions, la mémoire et la vie sociale.",
    "summary": "",
    "text": "",
    "publisher": "EDP Sciences",
    "year": 2021,
    "isbn": "9782759826384",
    "catalogueRevision": 20261113
  },
  {
    "id": "liv0003",
    "title": "La Science secrète",
    "author": "Dr Ferran, Papus, Eugène Nus, Julien Lejay et S. de Guaïta",
    "genre": "spiritualites",
    "sub": "3",
    "year": 2009,
    "publisher": "Arbre d’Or",
    "isbn": "",
    "edition": "Édition numérique : décembre 2009. Le recueil reproduit des textes publiés à Paris en 1890.",
    "contributors": "Ouvrage collectif ; noms repris sur la page de titre du PDF.",
    "presentation": "La Science secrète est un recueil collectif consacré à des courants ésotériques de la fin du XIXe siècle. L’édition numérique fournie reprend un ensemble daté de 1890 et nomme le Dr Ferran, Papus, Eugène Nus, Julien Lejay et S. de Guaïta. Les contributions se succèdent avec leurs propres perspectives ; il ne s’agit pas d’une seule méthode développée par un auteur unique.\n\nLe volume aborde notamment les symboles et les origines de la franc-maçonnerie, la théosophie, la kabbale et des conceptions occultistes de l’homme et du monde. Ses auteurs rapprochent traditions religieuses, initiation, nombres et interprétations symboliques. Pour suivre le propos, il est utile de relever qui parle, le vocabulaire propre à chaque contribution et la manière dont les rapprochements entre traditions sont construits.\n\nCe livre se lit comme un document sur une culture intellectuelle et spirituelle de son époque. Le terme « science » appartient au titre historique : il ne signifie pas que les affirmations occultistes ont été validées par les méthodes scientifiques contemporaines. Son intérêt documentaire réside dans l’accès aux textes et à leurs raisonnements, avec leurs présupposés. L’année 2009 affichée pour le fichier désigne la publication numérique d’Arbre d’Or ; elle ne doit pas masquer la date ancienne des textes reproduits.",
    "themes": [
      "ésotérisme",
      "occultisme",
      "kabbale",
      "théosophie",
      "franc-maçonnerie",
      "1890"
    ],
    "external": {
      "site": "Réception extérieure",
      "url": null,
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "Aucune note publique vérifiée pour ce recueil et cette édition.",
      "text": "Aucune moyenne ni critique extérieure suffisamment identifiée n’est reproduite. Les livres homonymes et les ouvrages d’autres auteurs ne sont pas utilisés pour attribuer une note à ce recueil.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Ordre Martiniste — bibliographie de Papus",
        "url": "https://www.martiniste.org/papus-1865-1916/"
      }
    ],
    "pdfPath": "pdf/science-secrete.pdf",
    "pdfPages": 90,
    "cover": "images/couvertures/science-secrete.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "8cb21bfb54e08f69961562aa04761aebf226242db3f2e82eef8d73ca7da006a2",
    "detailPath": "ouvrage-science-secrete.html"
  },
  {
    "id": "liv0004",
    "title": "La Pensée positive pour les nuls",
    "author": "Averil Leimon, Gladeana McMahon et Béatrice Millêtre",
    "genre": "vie-et-societe",
    "sub": "2",
    "cover": "images/niveau-4-livres/vie-et-societe/vie-pratique/liv0004-couverture.jpg",
    "presentation": "Un guide de développement personnel consacré à la pensée positive. La notice des médiathèques de La Rochelle identifie Averil Leimon et Gladeana McMahon et mentionne Béatrice Millêtre.",
    "summary": "",
    "text": "",
    "publisher": "First",
    "year": 2010,
    "isbn": "9782754018210",
    "catalogueRevision": 20261113
  },
  {
    "id": "liv0005",
    "title": "Créer et gérer une entreprise",
    "author": "Jacques-Daniel Rochat",
    "genre": "savoirs",
    "sub": "4",
    "cover": "images/niveau-4-livres/savoirs/economie-et-politique/liv0005-couverture.jpg",
    "presentation": "Ce guide aborde la conception et la gestion d’une entreprise avec des exemples portant notamment sur le budget, le financement et la comptabilité.",
    "summary": "",
    "text": "",
    "publisher": "Entraid",
    "year": 2015,
    "isbn": "9782970068532",
    "catalogueRevision": 20261113
  },
  {
    "id": "liv0006",
    "title": "10 bonnes raisons de devenir entrepreneur",
    "author": "Philippe Simo (attribution de la notice Goodreads)",
    "genre": "savoirs",
    "sub": "5",
    "year": 2019,
    "publisher": "Initiative Construire l’Afrique de Demain",
    "isbn": "",
    "edition": "Livret PDF daté 2019. Une édition commerciale homonyme de Philippe Simo est référencée en 2020 ; son ISBN n’est pas attribué au fichier fourni.",
    "contributors": "",
    "presentation": "Ce livret s’adresse à des étudiants, des salariés et des personnes qui envisagent de créer une activité. Il défend l’entrepreneuriat comme un choix de vie, en partant des raisons qui peuvent donner envie de se lancer plutôt que des formalités administratives. Chaque motivation est présentée dans une courte séquence : sortir de la routine, donner du sens à son travail, rechercher de l’autonomie, relever un défi ou contribuer à la vie des autres.\n\nLe texte emploie un ton direct, des comparaisons et des exemples destinés à provoquer une décision. Il insiste notamment sur l’apprentissage, la responsabilité et la possibilité de construire un métier qui corresponde à ses aspirations. La liberté y est associée à une prise de risque : l’auteur oppose la prévisibilité du salariat à l’incertitude de l’activité indépendante. Le document se termine par une invitation à poursuivre la démarche auprès d’Investir au Pays.\n\nIl s’agit donc d’un support de motivation et de découverte, à lire pour clarifier ses envies et ses raisons d’entreprendre. Son organisation ne correspond pas à celle d’un manuel de création d’entreprise : on n’y trouve pas une étude complète du marché, un prévisionnel financier ou un examen des statuts juridiques. La date 2019 appartient au PDF ; la notice extérieure porte sur une édition Kindle publiée le 5 avril 2020.",
    "themes": [
      "entrepreneuriat",
      "motivation",
      "création d’entreprise",
      "Afrique"
    ],
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/book/show/54975786-10-bonnes-raisons-de-devenir-entrepreneur",
      "rating": 4,
      "count": 1,
      "comments": 0,
      "scope": "Édition Kindle de 2020 ; le PDF fourni est daté 2019.",
      "text": "La fiche Goodreads comporte une seule évaluation, à quatre étoiles, et aucune critique rédigée. Ce vote isolé ne permet pas de dégager un avis général sur l’ouvrage. La notice attribue le titre à Philippe Simo ; le livret lui-même ne nomme pas d’auteur sur sa couverture.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Guichet Jeunesse — notice du livret daté 2019",
        "url": "https://www.guichetjeunesse.sn/ressources/12d449d2-1ba4-44a8-9905-19acad61bd74"
      }
    ],
    "pdfPath": "pdf/10-bonnes-raisons-entrepreneur.pdf",
    "pdfPages": 28,
    "cover": "images/couvertures/10-bonnes-raisons-entrepreneur.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "8d6b6cba9fd670296122ab79bd80e4166c2681846efaadaadf7dda1b6b7c334e",
    "detailPath": "ouvrage-10-bonnes-raisons-entrepreneur.html"
  },
  {
    "id": "demo-carnet",
    "title": "Le carnet ouvert",
    "author": "Exercice de lecture · texte original du site",
    "genre": "fiction",
    "sub": "7",
    "cover": "",
    "presentation": "Un texte original court pour essayer le lecteur et les annotations du carnet.",
    "summary": "Une lectrice relit un passage et découvre ce qui l’a marquée.",
    "text": "J’avais posé le livre sur le bord de la table, à côté du carnet que j’ouvrais rarement. Ce soir-là, j’ai relu la même phrase trois fois. La première fois, j’ai suivi l’histoire. La deuxième, j’ai reconnu quelque chose de familier. À la troisième, j’ai compris que je cherchais les mots pour le dire.\n\nDans le carnet, j’ai écrit une seule ligne : « Revenir ici demain. » Le lendemain, la phrase était toujours la même. Ma question, elle, avait changé."
  },
  {
    "id": "liv0007",
    "title": "Devenez riche",
    "author": "Ramit Sethi",
    "genre": "vie-et-societe",
    "sub": "4",
    "year": 2016,
    "publisher": "Alisio",
    "isbn": "9791092928501",
    "edition": "Édition numérique Alisio 2016 ; réédition d’un ouvrage français paru en 2011. ISBN papier associé : 9791092928198.",
    "contributors": "Adaptation : Michaël Ferrari. Traduction : Céline Petit.",
    "presentation": "Ramit Sethi propose une méthode d’organisation des finances personnelles répartie sur six semaines. Le point de départ est concret : faire l’inventaire de ses comptes, comprendre les frais, traiter les dettes et mettre en place un système qui demande moins de décisions répétées. L’adaptation française de Michaël Ferrari accompagne un ouvrage issu du contexte américain.\n\nLes premières étapes portent sur les cartes, les relations avec la banque et les comptes utiles à l’épargne et à l’investissement. Viennent ensuite un plan de dépenses choisies, l’automatisation des mouvements d’argent et une introduction aux placements. Sethi distingue les dépenses auxquelles on tient réellement de celles que l’on peut réduire. Il préfère un dispositif régulier et simple à la recherche permanente du placement parfait ; les exemples et dialogues servent à montrer comment les habitudes et l’inaction influencent les décisions financières.\n\nLe livre se lit comme un programme de mise en ordre : chaque semaine donne un objectif et des actions, tout en expliquant les raisonnements de l’auteur. Il traite aussi de décisions de vie et de la manière d’utiliser l’argent selon ses priorités. Le titre exprime la promesse de la méthode, pas un résultat assuré. Les produits, dispositifs fiscaux et exemples cités correspondent à l’époque de cette édition ; ils ne constituent pas une description actualisée des offres disponibles aujourd’hui.",
    "themes": [
      "budget",
      "épargne",
      "investissement",
      "finances personnelles",
      "six semaines"
    ],
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/book/show/34202475-devenez-riche",
      "rating": 4.2,
      "count": 66125,
      "comments": 5599,
      "scope": "Statistiques de l’œuvre regroupant plusieurs langues, formats et éditions ; elles ne portent pas uniquement sur le PDF Alisio 2016.",
      "text": "La moyenne publiée est favorable et repose sur un grand nombre de votes. Les commentaires regroupent toutefois des versions et des contextes nationaux différents. Les extraits consultés évoquent notamment l’aide apportée à l’organisation des finances ; cela ne mesure pas un enrichissement effectif des lecteurs.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Alisio / Leduc — fiche de l’édition numérique",
        "url": "https://www.editionsleduc.com/produit/803/9791092928501"
      }
    ],
    "pdfPath": "pdf/devenez-riche.pdf",
    "pdfPages": 266,
    "cover": "images/couvertures/devenez-riche.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "d428e9c6f551db3db3acb2e5ddc7ba2ea6452eeec1cfbd74a1b3b42055265028",
    "detailPath": "ouvrage-devenez-riche.html"
  },
  {
    "id": "liv0008",
    "title": "Je ne sais pas dire non…",
    "author": "Karine Danan",
    "genre": "savoirs",
    "sub": "1",
    "year": 2013,
    "publisher": "Eyrolles",
    "isbn": "9782212557459",
    "edition": "Première édition française : 10 octobre 2013. Collection Histoires de divan.",
    "contributors": "Avec la collaboration de Cécile Potel.",
    "presentation": "Karine Danan aborde la difficulté à poser des limites à travers le parcours d’Esther. Cette femme a pris l’habitude de répondre aux attentes des autres et d’effacer ses propres besoins. Le récit suit son travail thérapeutique : ses hésitations, ses relations, son histoire et la façon dont elle commence à identifier ce qui l’empêche de refuser.\n\nL’ouvrage alterne des scènes racontées et des éclairages sur les mécanismes psychologiques à l’œuvre. La culpabilité, la peur de déplaire, la recherche d’affection et les effets de violences anciennes sont abordés à partir de situations vécues par le personnage. Dire non n’est donc pas présenté comme une simple formule à apprendre. Il s’agit de reconnaître son expérience, de comprendre la place que l’on occupe dans ses relations et de retrouver la possibilité de choisir.\n\nCette forme narrative donne à la réflexion un déroulement progressif : on découvre les résistances et les prises de conscience au fil du parcours, plutôt qu’une liste de recettes. Le livre relève du récit thérapeutique accompagné d’explications, ce qui justifie son classement principal en psychologie, avec une dimension romancée signalée dans les mots-clés. Il aborde des traumatismes et des relations éprouvantes ; la présentation conserve les enjeux du récit sans dévoiler l’ensemble du cheminement d’Esther.",
    "themes": [
      "affirmation de soi",
      "limites",
      "récit thérapeutique",
      "psychologie",
      "culpabilité"
    ],
    "external": {
      "site": "Fnac — avis clients",
      "url": "https://www.fnac.com/Je-ne-sais-pas-dire-non/a6256810/avis",
      "rating": 4,
      "count": 1,
      "comments": 1,
      "scope": "Fiche du livre broché ; l’avis peut être rattaché à un autre format par la plateforme.",
      "text": "Le seul commentaire visible, signé Catty le 12 novembre 2014, apprécie l’alternance entre récit et explications théoriques et décrit une forte réaction émotionnelle. C’est un témoignage individuel, pas un consensus critique. La Fnac signale cet avis comme spontané.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Eyrolles — présentation, sommaire et bibliographie",
        "url": "https://www.editions-eyrolles.com/livre/je-ne-sais-pas-dire-non"
      }
    ],
    "pdfPath": "pdf/je-ne-sais-pas-dire-non.pdf",
    "pdfPages": 195,
    "cover": "images/couvertures/je-ne-sais-pas-dire-non.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "71c8cd05d3f5185d60518827f559a889a4c775ac8f20618df4ddd5ee93e15cc1",
    "detailPath": "ouvrage-je-ne-sais-pas-dire-non.html"
  },
  {
    "id": "liv0009",
    "title": "Je sais que vous mentez !",
    "author": "Paul Ekman",
    "genre": "savoirs",
    "sub": "1",
    "year": 2011,
    "publisher": "J’ai lu",
    "isbn": "9782290163436",
    "edition": "Édition française J’ai lu de 2011 ; première traduction française chez Michel Lafon en 2010. Le fichier porte l’ISBN numérique 9782290163436.",
    "contributors": "Traduction : Pascal Loubet.",
    "presentation": "Paul Ekman examine ce qui peut se produire lorsqu’une personne cherche à dissimuler une information ou une émotion. Il distingue différentes formes de mensonge et étudie les indices possibles dans les mots, la voix, les expressions faciales et les gestes. L’enjeu du livre n’est pas seulement de repérer un signe, mais de comprendre pourquoi un mensonge peut réussir ou échouer selon la situation et les personnes concernées.\n\nL’auteur s’intéresse à la peur d’être découvert, à la culpabilité et au plaisir de tromper. Il décrit les difficultés à contrôler l’ensemble de son comportement et les émotions qui peuvent transparaître malgré une tentative de dissimulation. Les exemples vont des relations ordinaires aux interrogatoires et aux enjeux politiques. Le livre discute également des instruments de détection et des conditions dans lesquelles leurs résultats doivent être interprétés.\n\nUne partie essentielle porte sur les erreurs du jugement : une personne sincère peut être anxieuse, tandis qu’un menteur peut ne pas manifester l’émotion attendue. Le texte nomme notamment l’erreur d’Othello et le risque de négliger les différences individuelles. La lecture demande donc de conserver les réserves de l’auteur : les signes décrits ne sont pas des preuves automatiques. Il s’agit d’un essai sur les émotions, la communication et les limites de la détection, plutôt que d’un dictionnaire universel des gestes.",
    "themes": [
      "mensonge",
      "émotions",
      "communication non verbale",
      "micro-expressions",
      "psychologie"
    ],
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/book/show/20412843-je-sais-que-vous-mentez-l-art-de-d-tecter-ceux-qui-vous-trompent",
      "rating": 3.84,
      "count": 3644,
      "comments": 200,
      "scope": "Statistiques de l’œuvre Telling Lies, susceptibles de regrouper plusieurs éditions et langues.",
      "text": "La note publique donne une indication de l’accueil des lecteurs, sans évaluer la validité scientifique de chaque proposition. Aucune synthèse représentative des deux cents critiques n’a été établie ici ; le lien permet de consulter les avis dans leur contexte.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Apple Books — édition française J’ai lu",
        "url": "https://books.apple.com/fr/book/je-sais-que-vous-mentez-lart-de-d%C3%A9tecter-les/id1322005861"
      },
      {
        "label": "BNFA — première édition française 2010",
        "url": "https://www.bnfa.fr/livre?biblionumber=14890"
      }
    ],
    "pdfPath": "pdf/je-sais-que-vous-mentez.pdf",
    "pdfPages": 220,
    "cover": "images/couvertures/je-sais-que-vous-mentez.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "806124713973b21ff7458e8277db4f655d6cc4e002b355f1f59c3c0fc599d0e5",
    "detailPath": "ouvrage-je-sais-que-vous-mentez.html"
  },
  {
    "id": "liv0010",
    "title": "La Philosophie du succès de Napoleon Hill",
    "author": "Napoleon Hill",
    "genre": "vie-et-societe",
    "sub": "5",
    "year": 2021,
    "publisher": "Diateino",
    "isbn": "9782354564759",
    "edition": "Traduction française parue le 18 novembre 2021. ISBN papier : 9782354564742.",
    "contributors": "Traduction : Florence Logerot-Depraz.",
    "presentation": "Ce volume retranscrit dix-sept conférences de Napoleon Hill destinées à transmettre sa méthode du succès. Leur forme orale demeure perceptible : l’auteur interpelle son auditoire, revient sur les principes qu’il juge essentiels et les illustre par des anecdotes. Le livre rassemble ainsi un enseignement suivi plutôt qu’une suite de citations indépendantes.\n\nLa démarche commence par la définition d’un objectif majeur. Hill lui associe la coopération avec d’autres personnes, l’initiative, l’autodiscipline et la disposition à fournir davantage que le strict minimum attendu. D’autres conférences portent sur l’attitude mentale, l’attention, le raisonnement, la persévérance et l’utilisation des habitudes. Les principes se répondent : une intention n’a de valeur, dans cette méthode, que si elle se traduit par des actions régulières et une organisation de l’effort.\n\nLe mot « philosophie » désigne ici une doctrine de développement personnel et de réussite, non un traité universitaire de philosophie. Les références à des figures d’entrepreneurs et les formulations spirituelles appartiennent au cadre de pensée de Hill. Elles doivent être attribuées à l’auteur, plutôt que présentées comme des démonstrations générales. Cette édition intéressera surtout les lecteurs qui souhaitent comprendre l’architecture de sa méthode et sa façon de l’enseigner, avec les répétitions propres à une série de cours.",
    "themes": [
      "développement personnel",
      "objectifs",
      "habitudes",
      "motivation",
      "conférences"
    ],
    "external": {
      "site": "Fnac — avis clients",
      "url": "https://www.fnac.com/a16116052/Napoleon-Hill-La-Philosophie-du-succes-de-Napoleon-Hill",
      "rating": 5,
      "count": 1,
      "comments": 1,
      "scope": "Fiche française de 2021, ISBN papier 9782354564742.",
      "text": "Un seul avis est publié sur la fiche consultée. Alain R., le 12 décembre 2021, juge la lecture accessible et les conseils précis. Cette appréciation favorable repose sur un seul lecteur ; elle ne suffit pas à établir un consensus.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Éditions Trédaniel / Diateino — fiche officielle",
        "url": "https://www.editions-tredaniel.com/la-philosophie-du-succes-de-napoleon-hill-p-9615.html"
      }
    ],
    "pdfPath": "pdf/philosophie-du-succes.pdf",
    "pdfPages": 343,
    "cover": "images/couvertures/philosophie-du-succes.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "9b20d1f705dbdce4e4c2f92bd6da785769acc3600e0472a1cd92e85e7aa14ec4",
    "detailPath": "ouvrage-philosophie-du-succes.html"
  },
  {
    "id": "liv0011",
    "title": "La Boîte à outils du leadership",
    "author": "Jean-Pierre Testa, Jérôme Lafargue et Virginie Tilhet-Coartet",
    "genre": "savoirs",
    "sub": "5",
    "year": 2021,
    "publisher": "Dunod",
    "isbn": "9782100826575",
    "edition": "Deuxième édition, 59 outils et méthodes. Tirage / présentation de 2021, paru le 10 mars 2021 ; le copyright intérieur mentionne 2017. ISBN papier 2021 : 9782100824533.",
    "contributors": "",
    "presentation": "Ce manuel organise le leadership autour de cinquante-neuf outils, répartis en huit dossiers. Il commence par le développement de sa posture de leader et la définition d’une vision, puis aborde la communication de cette vision, l’adhésion, la cohésion de l’équipe, l’accompagnement, la responsabilisation et la reconnaissance. L’ensemble vise des situations de management hiérarchique, transversal ou de conduite de projet.\n\nLes fiches associent une représentation synthétique, les objectifs de l’outil, son contexte d’emploi et des indications de mise en œuvre. Elles abordent notamment la connaissance de soi, l’influence, la communication, la confiance et le feedback. L’organisation permet de partir d’une difficulté concrète, d’identifier une démarche et d’en considérer les conditions d’utilisation, plutôt que de lire systématiquement le volume du début à la fin.\n\nLe livre met l’accent sur des pratiques et des repères d’action. Une vision ne suffit pas : il faut la rendre compréhensible, relier les contributions de chacun et soutenir l’engagement de l’équipe. La couverture annonce également quatre vidéos d’approfondissement liées à l’édition ; leur disponibilité extérieure n’est pas garantie par le PDF. La fiche décrit précisément la deuxième édition à cinquante-neuf outils, sans lui attribuer les ajouts de la troisième édition à soixante-trois outils commercialisée plus récemment.",
    "themes": [
      "leadership",
      "management",
      "équipe",
      "communication",
      "59 outils"
    ],
    "external": {
      "site": "Réception extérieure",
      "url": null,
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "Aucune moyenne vérifiée propre à la deuxième édition fournie.",
      "text": "Certaines plateformes ont remplacé leur fiche par la troisième édition à 63 outils. Leurs notes ne sont pas attribuées à ce PDF de la deuxième édition. La présentation de l’éditeur et le sommaire sont proposés dans les sources, sans les présenter comme une critique indépendante.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Hachette / Dunod — deuxième édition 2021",
        "url": "https://www.hachette.fr/livre/la-boite-outils-du-leadership-2e-ed-59-outils-et-methodes-9782100824533/"
      },
      {
        "label": "Cairn — ouvrage et sommaire, édition 2021",
        "url": "https://stm.cairn.info/numero/DUNOD_TESTA_2021_01?lang=en"
      }
    ],
    "pdfPath": "pdf/boite-outils-leadership.pdf",
    "pdfPages": 440,
    "cover": "images/couvertures/boite-outils-leadership.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "f005f18d4f02f788a2ee7be7cfae71a910727af892bd4fabfd4fc13b4bdafb45",
    "detailPath": "ouvrage-boite-outils-leadership.html"
  },
  {
    "id": "liv0012",
    "title": "Le Petit Livre de Développement Personnel",
    "author": "Rami Mestiri",
    "genre": "vie-et-societe",
    "sub": "5",
    "year": null,
    "publisher": "Éditeur non indiqué dans le PDF",
    "isbn": "",
    "edition": "Date de publication et ISBN non précisés dans le fichier fourni.",
    "contributors": "",
    "presentation": "Rami Mestiri propose une synthèse de lectures de développement personnel, puis la rassemble dans une méthode nommée équilibre BIC. Le livre part d’une interrogation sur le bonheur, les habitudes et la difficulté à organiser sa vie au milieu d’informations et de sollicitations nombreuses. La démarche annoncée consiste à passer des idées à un emploi du temps praticable.\n\nBIC renvoie à trois domaines, nommés en anglais par l’auteur : Body, Ikigai et Connections. Le premier concerne l’entretien du corps et de la santé mentale, notamment à travers le rythme de vie. Le deuxième invite à identifier un travail ou une activité qui apporte du sens et de la satisfaction. Le troisième s’intéresse aux relations et aux connexions positives avec les autres. La méthode cherche à équilibrer ces domaines plutôt qu’à faire reposer toute la réussite sur un seul objectif professionnel ou financier.\n\nLe dernier mouvement porte sur la mise en œuvre en quatre-vingt-dix jours. Il propose de traduire les intentions en habitudes et en organisation hebdomadaire. La présentation distingue la méthode personnelle de l’auteur des connaissances auxquelles il se réfère : les conseils de mode de vie et les promesses de bonheur ne deviennent pas des résultats universellement démontrés parce qu’ils sont rassemblés dans un programme. Le PDF ne donne pas les éléments nécessaires pour fixer avec certitude une date de parution ou un ISBN.",
    "themes": [
      "développement personnel",
      "BIC",
      "Body",
      "Ikigai",
      "Connections",
      "habitudes",
      "90 jours"
    ],
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/book/show/231464440-le-petit-livre-de-d-veloppement-personnel",
      "rating": 5,
      "count": 1,
      "comments": null,
      "scope": "Une fiche de ce titre dans la liste des livres de l’auteur ; une fiche homonyme non notée existe aussi.",
      "text": "La liste Goodreads de Rami Mestiri associe une note de cinq étoiles et un seul vote à cette fiche. Aucun commentaire représentatif n’a pu être vérifié. Ce résultat très limité n’est pas la moyenne générale des livres de l’auteur.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Rami Mestiri — CV et mention de l’ouvrage",
        "url": "https://rami.tn/wp-content/uploads/2025/09/CV-de-Rami-Mestiri.pdf"
      },
      {
        "label": "Goodreads — liste des livres de Rami Mestiri",
        "url": "https://www.goodreads.com/author/show/21723192.Rami_Mestiri"
      }
    ],
    "pdfPath": "pdf/petit-livre-developpement-personnel.pdf",
    "pdfPages": 89,
    "cover": "images/couvertures/petit-livre-developpement-personnel.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "d96e1b4e57502924d4f77912a1e80b29d25d312f41ecc34cae4182ed1a2a7d18",
    "detailPath": "ouvrage-petit-livre-developpement-personnel.html"
  },
  {
    "id": "liv0013",
    "title": "Sapiens — Une brève histoire de l’humanité",
    "author": "Yuval Noah Harari",
    "genre": "savoirs",
    "sub": "3",
    "year": 2015,
    "publisher": "Albin Michel",
    "isbn": "9782226332202",
    "edition": "Édition française parue le 2 septembre 2015. ISBN papier : 9782226257017. Première publication de l’œuvre en hébreu : 2011.",
    "contributors": "Traduction : Pierre-Emmanuel Dauzat.",
    "presentation": "Yuval Noah Harari propose une histoire de l’humanité à grande échelle. Son fil conducteur est la capacité d’Homo sapiens à coopérer avec des individus qu’il ne connaît pas personnellement. Le livre relie cette coopération aux récits, aux institutions et aux représentations partagées, puis examine la façon dont ils organisent les sociétés.\n\nLe parcours se divise en quatre grandes parties : révolution cognitive, révolution agricole, unification de l’humanité et révolution scientifique. Il passe des sociétés de chasseurs-cueilleurs à la sédentarisation, puis aux empires, à la monnaie et aux religions. La dernière partie rapproche l’essor de la science, l’expansion impériale, le capitalisme et les transformations industrielles. Les changements matériels sont mis en relation avec les structures sociales et les manières de donner un sens au monde.\n\nL’auteur pose régulièrement une question qui déplace le récit du progrès : l’accroissement de la puissance collective a-t-il nécessairement amélioré l’existence des individus et des autres êtres vivants ? La condition des agriculteurs, les hiérarchies et le bonheur servent à explorer cette tension. Les derniers chapitres interrogent aussi les transformations futures de l’espèce. C’est un essai de synthèse qui avance une interprétation générale et des hypothèses ; les propositions de Harari sont présentées comme son argumentation, sans confondre toutes ses interprétations avec un consensus historique ou scientifique.",
    "themes": [
      "histoire universelle",
      "anthropologie",
      "civilisation",
      "révolution agricole",
      "Homo sapiens"
    ],
    "external": {
      "site": "Fnac — avis clients",
      "url": "https://www.fnac.com/Sapiens-edition-2022/a8625757/avis",
      "rating": 4.5,
      "count": 396,
      "comments": 396,
      "scope": "Fiche Fnac de l’édition 2022 ; le PDF présent ici correspond à l’édition française 2015. Certains avis concernent le produit ou le vendeur.",
      "text": "L’accueil affiché sur cette fiche est majoritairement favorable. Parmi les commentaires consultés, des lecteurs soulignent l’accès à l’histoire et l’invitation à réfléchir ; un avis de juin 2026 exprime une déception concernant la première partie. La moyenne inclut aussi des appréciations matérielles : elle ne mesure pas à elle seule la qualité historique du texte.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "BnF — notice de l’édition française 2015",
        "url": "https://catalogue.bnf.fr/ark:/12148/cb44403557s"
      },
      {
        "label": "Google Livres — édition 2015 et traduction",
        "url": "https://books.google.com/books/about/Sapiens.html?hl=fr&id=M89yCgAAQBAJ"
      }
    ],
    "pdfPath": "pdf/sapiens.pdf",
    "pdfPages": 498,
    "cover": "images/couvertures/sapiens.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "89eb13e270c23c9281f79a144993aed925be7f8854c19b83ae3ecc97e3c1c4bc",
    "detailPath": "ouvrage-sapiens.html"
  },
  {
    "id": "liv0014",
    "title": "La Chèvre de ma mère",
    "author": "Ricardo Kaniama",
    "genre": "vie-et-societe",
    "sub": "4",
    "year": 2020,
    "publisher": "ISTC",
    "isbn": "9789995181819",
    "edition": "Deuxième édition, copyright 2020. Sous-titre du PDF : Le secret de la prospérité financière.",
    "contributors": "",
    "presentation": "Ricardo Kaniama utilise l’histoire de la chèvre de sa mère pour introduire une réflexion sur l’argent et la création de revenus. L’animal représente une ressource que l’on peut consommer immédiatement ou préserver afin qu’elle produise dans le temps. Cette opposition devient le point de départ d’une méthode d’éducation financière adressée notamment aux jeunes adultes.\n\nLe livre mêle récit personnel, exemples et conseils. Il interroge les habitudes de dépense, la relation au travail, l’apprentissage des finances en dehors de l’école et la différence entre un revenu dépensé et une ressource qui continue de produire. L’auteur défend la formation, la discipline, l’initiative et la construction progressive d’une activité. Le contexte africain et les obligations sociales occupent une place dans sa manière de poser les problèmes.\n\nLa seconde édition revient sur le parcours et les convictions de Kaniama. Les anecdotes ont une fonction pédagogique : rendre visibles des choix et leurs effets possibles, plutôt que proposer un catalogue technique de placements. Les réussites racontées et les conclusions générales sont celles de l’auteur ; elles ne garantissent pas au lecteur un résultat financier comparable. Le classement principal en finances personnelles reflète ce contenu, tandis que les mots-clés conservent sa dimension autobiographique et entrepreneuriale.",
    "themes": [
      "finances personnelles",
      "éducation financière",
      "entrepreneuriat",
      "Afrique",
      "autobiographie"
    ],
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/fr/book/show/51239377-la-ch-vre-de-ma-m-re",
      "rating": 4.2,
      "count": 43,
      "comments": 8,
      "scope": "Fiche Goodreads du titre ; d’autres fiches d’éditions existent et ne sont pas additionnées à celle-ci.",
      "text": "La moyenne de cette fiche est favorable, avec quarante-trois votes. Huit critiques rédigées y sont signalées. Leur contenu n’a pas été vérifié intégralement : aucun consensus détaillé ne leur est attribué ici, et ces avis extérieurs restent séparés de ceux du carnet.",
      "checked": "11 novembre 2026",
      "mode": "Relevé documentaire ; aucune synchronisation automatique"
    },
    "sources": [
      {
        "label": "Institut français du Mali — notice ISTC 2020",
        "url": "https://mediatheque-ifmali.org/index.php?id=22861&lvl=notice_display"
      }
    ],
    "pdfPath": "pdf/chevre-de-ma-mere.pdf",
    "pdfPages": 208,
    "cover": "images/couvertures/chevre-de-ma-mere.jpg",
    "summary": "",
    "text": "",
    "catalogueRevision": 20261111,
    "pdfSha256": "683dcd6a3dc321b830e4774e19b95d0063f13c297674565bd84463c5a36802a7",
    "detailPath": "ouvrage-chevre-de-ma-mere.html"
  },
  {
    "id": "liv0015",
    "title": "Le Grand Livre des métiers",
    "author": "La rédaction de L’Étudiant",
    "genre": "vie-et-societe",
    "sub": "2",
    "publisher": "L’Étudiant",
    "isbn": "978-2-8176-0462-6",
    "edition": "12ᵉ édition, dépôt légal de mai 2015. PDF scanné, 240 pages.",
    "presentation": "Ce guide d’orientation de L’Étudiant rassemble plus de 300 métiers. Quatre entrées permettent de partir d’une envie concrète : organiser et manager, être sur le terrain, inventer et créer, ou travailler au contact des autres.\n\nLes fiches associent les tâches du métier à des indications de formation, de sélectivité, d’insertion et de rémunération. Un même secteur peut revenir sous plusieurs angles. La rubrique transport et logistique, par exemple, est traitée à la fois sous l’angle de l’organisation et dans les métiers de terrain.\n\nLa première partie aide à mettre des mots sur ses goûts et à faire le lien entre les études et les métiers. En fin de volume, deux index permettent de retrouver une profession par nom ou par secteur. Les données de formation et de salaire sont celles d’avril 2015.",
    "themes": [
      "Orientation",
      "Métiers",
      "Formations",
      "Débouchés"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/grand-livre-des-metiers.pdf",
    "pdfPages": 240,
    "cover": "images/couvertures/grand-livre-des-metiers.jpg",
    "detailPath": "ouvrage-grand-livre-des-metiers.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "329ad7d52e746a524a3400515880d56d6feb94ff7a279585c958b45b8efc0ad5",
    "year": 2015,
    "sources": [
      {
        "label": "Référence de la 12ᵉ édition",
        "url": "https://www.chasse-aux-livres.fr/prix/2817604628/le-grand-livre-des-metiers-l-etudiant-9782817604626"
      }
    ]
  },
  {
    "id": "liv0016",
    "title": "Doublez vos contacts",
    "author": "Michael J. Durkin",
    "genre": "savoirs",
    "sub": "5",
    "publisher": "Performance Édition",
    "isbn": "978-2-923746-01-2",
    "edition": "Traduction française, copyright 2009–2010. ISBN imprimé dans le fichier pour la version papier.",
    "presentation": "Michael J. Durkin aborde la prospection dans le marketing de réseau. Le parcours suit les étapes qui mènent d’une première rencontre à un rendez-vous, depuis la constitution d’une liste de contacts jusqu’aux relances.\n\nLa première partie examine les croyances qui facilitent ou freinent la prise de contact, notamment la peur du refus. La deuxième passe à l’entraînement : contacts à froid, appels, scripts de conversation et réponses aux demandes d’information.\n\nLes scénarios visent la prospection commerciale. L’auteur s’attarde sur le ton de la conversation, la régularité des appels et la distinction entre une prise de contact et une présentation plus complète.",
    "themes": [
      "Prospection",
      "Marketing de réseau",
      "Prise de rendez-vous",
      "Suivi"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/doublez-vos-contacts.pdf",
    "pdfPages": 134,
    "cover": "images/couvertures/doublez-vos-contacts.jpg",
    "detailPath": "ouvrage-doublez-vos-contacts.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "ece6be50f16bc02d7062ef50b8be24351c850a4e7ced3d7d4c6d2e78d137ff97",
    "year": 2010,
    "sources": [
      {
        "label": "Performance Édition · présentation du livre",
        "url": "https://www.performance-edition.com/boutique/livres/doublez-vos-contacts"
      }
    ]
  },
  {
    "id": "liv0017",
    "title": "Guide du leadership",
    "author": "Bernard Radon",
    "genre": "savoirs",
    "sub": "5",
    "publisher": "Dunod",
    "isbn": "978-2-10-050715-3",
    "edition": "Progresser vers la fonction de dirigeant. Édition Dunod de 2007.",
    "presentation": "Bernard Radon suit le passage du management d’une petite équipe à la responsabilité d’une unité opérationnelle. Il relie l’autorité du responsable à son rôle dans l’organisation et à la qualité de ses relations de travail.\n\nLa première partie propose des repères pour comprendre les responsabilités qui changent selon le niveau hiérarchique. Le guide aborde notamment la légitimité du manager, ses marges de décision et le passage à une fonction de direction plus politique.\n\nLa seconde partie examine la pratique du leadership à partir d’expériences et de situations d’entreprise. Le lecteur peut y suivre les tensions entre décisions stratégiques, coopération, changement et attentes des équipes.",
    "themes": [
      "Management",
      "Leadership",
      "Équipe",
      "Décision",
      "Organisation"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/guide-du-leadership.pdf",
    "pdfPages": 264,
    "cover": "images/couvertures/guide-du-leadership.jpg",
    "detailPath": "ouvrage-guide-du-leadership.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "f1646c6ca9174a26913369f3c273fd707d97c5b25b51202847c64b6ea5765d7e",
    "year": 2007,
    "sources": [
      {
        "label": "Dunod · notice de l’éditeur",
        "url": "https://www.dunod.com/entreprise-et-economie/guide-du-leadership-progresser-vers-fonction-dirigeant"
      }
    ]
  },
  {
    "id": "liv0018",
    "title": "Introduction à la psychologie sociale · Tome I",
    "author": "Serge Moscovici (dir.)",
    "genre": "savoirs",
    "sub": "1",
    "publisher": "Larousse",
    "isbn": "",
    "edition": "Les phénomènes de base. Édition électronique de Diane Brunet, Les Classiques des sciences sociales, 2013.",
    "presentation": "Ce premier tome collectif étudie la façon dont les personnes perçoivent les autres, ajustent leurs attitudes et s’influencent dans les groupes. Les chapitres présentent plusieurs modèles et traditions de recherche en psychologie sociale.\n\nJozef M. Nuttin Jr. revient sur les changements d’attitude après un jeu de rôle. Serge Moscovici et Philippe Ricateau examinent la conformité et la manière dont une minorité peut exercer une influence. D’autres contributions abordent l’attrait interpersonnel, l’hostilité et les conflits.\n\nLe chapitre d’Henri Tajfel interroge la façon dont le classement en catégories organise la perception et les relations entre groupes. L’édition numérique reprend l’ouvrage de 1972 et donne accès aux bibliographies de chaque contribution.",
    "themes": [
      "Influence sociale",
      "Attitudes",
      "Catégorisation",
      "Conflits",
      "Groupes"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/introduction-psychologie-sociale.pdf",
    "pdfPages": 458,
    "cover": "images/couvertures/introduction-psychologie-sociale.jpg",
    "detailPath": "ouvrage-introduction-psychologie-sociale.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "14fce465d1f49fe098baf126734a9b1c25574f36805ad8da72739bb4fc57b7df",
    "year": 1972,
    "sources": [
      {
        "label": "Les Classiques des sciences sociales · édition et sommaire",
        "url": "https://classiques.uqam.ca/contemporains/moscovici_serge/intro_psycho_soc_t1/intro_psycho_soc_t1.html"
      }
    ]
  },
  {
    "id": "liv0019",
    "title": "L’Art de la confiance en soi",
    "author": "Katty Kay et Claire Shipman",
    "genre": "vie-et-societe",
    "sub": "5",
    "publisher": "Guy Trédaniel / Nouveaux Horizons",
    "isbn": "978-2-35745-442-2",
    "edition": "Extrait de 23 pages. Traduction de Laurence Le Charpentier, copyright français 2017. Original anglais publié en 2014.",
    "presentation": "Katty Kay et Claire Shipman cherchent à comprendre ce qui aide à prendre la parole, à agir et à se sentir légitime. Leur enquête porte sur la confiance en soi des femmes, notamment au travail.\n\nL’introduction part de situations comme l’appréhension de parler en public et croise entretiens, expériences rapportées et questions de recherche. Les auteures s’intéressent à la façon dont la confiance se forme au fil des apprentissages, des attentes sociales et des expériences.\n\nLe fichier disponible contient l’introduction et le sommaire. Le sommaire annonce notamment des chapitres sur le passage à l’action, l’éducation familiale et le rapport à l’échec.",
    "themes": [
      "Confiance",
      "Prise de parole",
      "Éducation",
      "Travail"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/art-confiance-en-soi.pdf",
    "pdfPages": 23,
    "cover": "images/couvertures/art-confiance-en-soi.jpg",
    "detailPath": "ouvrage-art-confiance-en-soi.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "45f4e0ccc7431bb584b5f1a12c23ff4ced5dc385624bca12df416e3f689b4e2a",
    "year": 2017,
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/book/show/21509513",
      "rating": 3.71,
      "count": 17423,
      "comments": 1509,
      "scope": "Œuvre originale en anglais · le PDF est un extrait en français",
      "checked": "11 novembre 2026"
    }
  },
  {
    "id": "liv0020",
    "title": "Astuces & Déblocage · V.1",
    "author": "Traumato (signature du document)",
    "genre": "savoirs",
    "sub": "6",
    "publisher": "",
    "isbn": "",
    "edition": "Version 1. Métadonnées du fichier datées de décembre 2016. Parution non précisée.",
    "presentation": "Ce livret explore l’environnement Android et des fonctions de maintenance des téléphones de son époque. Il passe en revue des termes, plusieurs versions du système et des exemples associés à des modèles Samsung, Alcatel, LG ou Motorola.\n\nLe sommaire regroupe des astuces de navigation, des explications sur le root et une présentation des modes de récupération et de maintenance. Les exemples permettent de comprendre à quoi servent ces outils dans le contexte des appareils cités.\n\nLes captures et références à des générations anciennes de téléphones en font un document daté. La compatibilité des exemples dépend du modèle et de sa version du système.",
    "themes": [
      "Android",
      "Smartphones",
      "Maintenance",
      "Récupération"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/astuces-deblocage.pdf",
    "pdfPages": 33,
    "cover": "images/couvertures/astuces-deblocage.jpg",
    "detailPath": "ouvrage-astuces-deblocage.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "a803a0541cd41372443b315cc94ac22d5ae291a683ea97f8af567ddb0ec663a9"
  },
  {
    "id": "liv0021",
    "title": "Comment se faire des amis",
    "author": "Dale Carnegie",
    "genre": "vie-et-societe",
    "sub": "5",
    "publisher": "",
    "isbn": "",
    "edition": "Première parution de l’original en 1936. Le PDF reproduit une version française révisée, avec une préface de Dorothy Carnegie.",
    "presentation": "Dale Carnegie propose des principes pour rendre les relations quotidiennes plus attentives et les désaccords plus faciles à traverser. L’ouvrage s’adresse à des lecteurs qui veulent mieux écouter, coopérer ou aborder une conversation difficile.\n\nQuatre parties traitent successivement de l’influence, de la sympathie, de la persuasion et de la manière de demander un changement sans humilier. Elles s’appuient sur des situations de travail, des histoires rapportées et des exercices d’application.\n\nParmi les pistes récurrentes figurent l’intérêt sincère pour autrui, l’attention à ce qui compte pour l’interlocuteur et la reconnaissance de ses propres erreurs. La préface explique pourquoi certains exemples ont été renouvelés pour cette édition.",
    "themes": [
      "Écoute",
      "Relations humaines",
      "Communication",
      "Désaccords"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/comment-se-faire-des-amis.pdf",
    "pdfPages": 262,
    "cover": "images/couvertures/comment-se-faire-des-amis.jpg",
    "detailPath": "ouvrage-comment-se-faire-des-amis.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "909809a5cfc4b454d31d8398fd63e3570acabc6548fd073efdbd2325b05af804",
    "year": 1936,
    "external": {
      "site": "Goodreads",
      "url": "https://www.goodreads.com/book/show/5403350-how-to-win-friends-and-influence-people",
      "rating": 4.21,
      "count": 1203043,
      "comments": 31738,
      "scope": "Œuvre originale · avis regroupés sur Goodreads",
      "checked": "11 novembre 2026"
    }
  },
  {
    "id": "liv0022",
    "title": "Les Virus informatiques",
    "author": "Meye Protect Lab",
    "genre": "savoirs",
    "sub": "6",
    "publisher": "Meye Protect Lab",
    "isbn": "",
    "edition": "Guide pratique. Copyright 2023 indiqué dans le PDF.",
    "presentation": "Ce guide d’initiation présente les virus informatiques, leur propagation et les conséquences d’une infection pour les données, les systèmes et les organisations.\n\nL’ouvrage relie les définitions à des épisodes historiques, dont le ver de Morris. Il aborde ensuite les outils de protection, les sauvegardes et les réflexes de prévention. Un chapitre traite des questions juridiques et éthiques à titre introductif.\n\nLes dernières pages reviennent sur des tendances comme les objets connectés et l’intelligence artificielle. Le guide se termine par des recommandations générales pour organiser la protection et réduire les risques au quotidien.",
    "themes": [
      "Cybersécurité",
      "Virus",
      "Prévention",
      "Protection des données"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/virus-informatiques.pdf",
    "pdfPages": 60,
    "cover": "images/couvertures/virus-informatiques.jpg",
    "detailPath": "ouvrage-virus-informatiques.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "d3917e651c8ccbebd1f14a45d9a445d5fbfd122326fc55ba8983e0547f43fcd4",
    "year": 2023
  },
  {
    "id": "liv0023",
    "title": "La Psychologie de l’intelligence",
    "author": "Jean Piaget",
    "genre": "savoirs",
    "sub": "1",
    "publisher": "Armand Colin",
    "isbn": "978-2-200-28364-3",
    "edition": "Première édition en 1947. Réédition de 2012 avec une préface d’Olivier Houdé.",
    "presentation": "Jean Piaget décrit l’intelligence comme une forme d’adaptation qui se construit au fil des interactions avec le milieu. Il pose d’abord les liens entre pensée, logique et équilibre, puis s’intéresse à la formation des opérations intellectuelles.\n\nLe texte passe des actions du jeune enfant à la construction de l’objet et de l’espace, puis au développement de la pensée représentative et des opérations. Piaget examine aussi la place des relations sociales et de l’expérience dans ce développement.\n\nLe volume reprend les leçons données au Collège de France en 1942. Olivier Houdé replace le texte dans l’histoire de la psychologie cognitive et discute certaines limites du modèle à la lumière de recherches ultérieures.",
    "themes": [
      "Développement cognitif",
      "Intelligence",
      "Enfance",
      "Adaptation",
      "Logique"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/psychologie-de-l-intelligence.pdf",
    "pdfPages": 171,
    "cover": "images/couvertures/psychologie-de-l-intelligence.jpg",
    "detailPath": "ouvrage-psychologie-de-l-intelligence.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "bc9fb77fdd0644e70081e36f8ac04d0ea5e8971bfb02ca4f7cac0397c2932d7b",
    "year": 2012,
    "sources": [
      {
        "label": "Fondation Jean Piaget · notice de la première édition",
        "url": "https://www.fondationjeanpiaget.ch/fjp/site/presentation/index.php?DOCID=1417"
      }
    ]
  },
  {
    "id": "liv0024",
    "title": "Reprogrammez votre cerveau pour le succès",
    "author": "Slavica Bogdanov",
    "genre": "vie-et-societe",
    "sub": "5",
    "publisher": "",
    "isbn": "",
    "edition": "Copyright 2012 indiqué dans le fichier. ISBN imprimés incomplets.",
    "presentation": "Slavica Bogdanov propose un programme de réflexion personnelle centré sur les croyances et les automatismes qui orientent les décisions. Elle relie cette démarche aux objectifs que le lecteur se fixe dans plusieurs domaines de sa vie.\n\nLa première partie développe la façon dont l’auteure comprend le cerveau, le langage intérieur et les croyances. La seconde invite à repérer les informations et interprétations qui entretiennent une habitude, puis à mettre en pratique d’autres façons de penser.\n\nLe livre alterne explications, exemples et exercices. Les notions de « reprogrammation » et les résultats attendus correspondent à la démarche de développement personnel présentée par l’auteure.",
    "themes": [
      "Croyances",
      "Habitudes",
      "Objectifs",
      "Développement personnel"
    ],
    "summary": "",
    "text": "",
    "pdfPath": "pdf/reprogrammez-votre-cerveau.pdf",
    "pdfPages": 142,
    "cover": "images/couvertures/reprogrammez-votre-cerveau.jpg",
    "detailPath": "ouvrage-reprogrammez-votre-cerveau.html",
    "catalogueRevision": 20261111,
    "pdfSha256": "9c39322cc03e5f4be675edf00f64cc90fd2a7de3b4e611193a5e99e0dd297422",
    "year": 2012
  }
];
const REFERENCES_CATALOGUE={
  "liv0001": {
    "presentation": "Un essai sur les procédés employés dans une controverse. Schopenhauer examine la façon dont on peut prendre l’avantage dans un débat, y compris lorsque la solidité des arguments est en question.",
    "question": "En lisant, je relève un procédé et j’essaie de le repérer dans un débat que j’ai entendu.",
    "label": "Catalogue général de la BnF",
    "url": "https://catalogue.bnf.fr/ark:/12148/cb36199028s"
  },
  "liv0002": {
    "presentation": "Moustafa Bensafi et Catherine Rouby explorent l’odorat et ses liens avec les émotions, la mémoire et la vie sociale.",
    "question": "Je note un exemple qui m’aide à comprendre pourquoi une odeur peut évoquer un souvenir.",
    "label": "Présentation de l’ouvrage sur Cairn.info",
    "url": "https://stm.cairn.info/cerveau-et-odorat--9782759825097?lang=fr"
  },
  "liv0003": {
    "presentation": "Ce recueil réunit plusieurs textes d’ésotérisme, dont des contributions sur la théosophie et la kabbale.",
    "question": "Je repère les notions propres à chaque contribution et le contexte dans lequel elles sont présentées.",
    "label": "Bibliographie de Papus, notice sur le recueil",
    "url": "https://www.exvibris.com/MBN/2-Stockage/0_GENERALITES_PROLEGOMENES/01_Bibliographie%20m%C3%A9thodique%20de%20la%20science%20occulte%20-%20Papus%201892.pdf"
  },
  "liv0004": {
    "presentation": "Un guide de développement personnel consacré à la pensée positive. La notice des médiathèques de La Rochelle identifie Averil Leimon et Gladeana McMahon et mentionne Béatrice Millêtre.",
    "question": "Je choisis une proposition du livre et je note dans quelle situation elle serait applicable.",
    "label": "Notice des médiathèques de La Rochelle",
    "url": "https://mediatheques.agglo-larochelle.fr/doc/SYRACUSE/1893300/la-pensee-positive-pour-les-nuls-averil-leimon-gladeana-mcmahon"
  },
  "liv0005": {
    "presentation": "Ce guide aborde la conception et la gestion d’une entreprise avec des exemples portant notamment sur le budget, le financement et la comptabilité.",
    "question": "Je distingue ce qui relève de la préparation d’un projet et ce qui relève de son suivi au quotidien.",
    "label": "Présentation du livre sur Shekina",
    "url": "https://www.shekina.com/books/creer-et-gerer-une-entreprise"
  },
  "liv0006": {
    "presentation": "Un document qui présente dix motivations pour entreprendre. La référence ci-dessous le rattache à l’initiative Construire l’Afrique de Demain.",
    "question": "Je classe les motivations qui m’interpellent et je précise ce que chacune implique concrètement.",
    "label": "Fiche du Guichet Jeunesse CJS",
    "url": "https://www.guichetjeunesse.sn/ressources/12d449d2-1ba4-44a8-9905-19acad61bd74"
  }
};
const blank=()=>({version:1,books:[],highlights:[],notes:[],questions:[],reviews:{},profile:{},design:{}});
function message(s,error=false){if($('status')){$('status').textContent=s;$('status').style.color=error?'#963d44':'#456048';}}
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('entre-les-lignes-v1'+(service?.user?'-'+service.user:''),1);req.onupgradeneeded=()=>req.result.createObjectStore('data');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function load(){return new Promise((resolve,reject)=>{const r=db.transaction('data').objectStore('data').get('state');r.onsuccess=()=>resolve(r.result||blank());r.onerror=()=>reject(r.error);});}
function save(){if(!db)return Promise.reject(Error('Le stockage du navigateur est indisponible. Cette critique n’a pas pu être enregistrée.'));return new Promise((resolve,reject)=>{const tx=db.transaction('data','readwrite');tx.objectStore('data').put(state,'state');tx.oncomplete=()=>{message('Enregistré dans ce navigateur.');resolve();};tx.onerror=()=>{message('Échec de l’enregistrement. Exporte une copie et vérifie le stockage du navigateur.',true);reject(tx.error);};});}
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
function dataURL(file){return new Promise((resolve,reject)=>{let r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(file);});}
function siteHref(path){return path;}
function bookLink(b,dest='livre'){if(dest==='livre'&&b.detailPath)return siteHref(b.detailPath);return dest+'.html?id='+encodeURIComponent(b.id);}
function isHorror(book) {
  return book.genre === 'fiction' && String(book.sub) === '8';
}
function horrorMark(book) {
  if (!isHorror(book)) return '';
  return '<span class="horror-book-mark"><img class="horror-book-sticker" src="images/carnet-illustre/frisson-rose.jpg" alt="">Rayon Horreur</span>';
}
function card(b,admin=false,dest='livre'){return '<article class="panel book'+(isHorror(b)?' horror-book':'')+'">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="Couverture de '+esc(b.title)+'">':'<div class="cover">'+esc(b.title)+'</div>')+'<div><h2>'+esc(b.title)+'</h2>'+horrorMark(b)+'<p>'+esc(b.author)+'</p>'+(bookYear(b)?'<p class="book-meta-line">'+esc(bookYear(b))+' · '+esc(b.edition?.publisher ?? b.publisher ?? '')+'</p>':'')+(b.pdfPath?'<p class="book-pdf-label">PDF inclus · '+b.pdfPages+' pages</p>':'')+'<a class="btn" href="'+bookLink(b,dest)+'">'+(dest==='avis'?'Ma critique':'Présentation du livre')+'</a><a class="btn secondary" href="'+bookLink(b,'lire')+'">Lire</a>'+(admin?'<a class="btn secondary" href="'+bookLink(b,'ajouter-livre')+'">Modifier</a><button class="danger" data-delete-book="'+esc(b.id)+'">Supprimer</button>':'')+'</div></article>';}
function searchTerms(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae').match(/[\p{L}\p{N}]+/gu) || [];
}

function bookYear(book){return String(book.edition?.year ?? book.year ?? READING_GUIDES[book.id]?.edition.year ?? '').match(/\b\d{4}\b/)?.[0] || ''; }
function renderBooks() {
  const el = $('books');
  if (!el) return;
  if ($('review-search')) { renderReviewBooks(el); return; }
  const genre = $('search-genre')?.value || el.dataset.genre;
  const terms = searchTerms($('search')?.value || '');
  const items = state.books.filter(book => {
    if (genre && book.genre !== genre) return false;
    if (el.dataset.sub && String(book.sub) !== el.dataset.sub) return false;
    if ($('search-year')?.value && bookYear(book)!==$('search-year').value) return false;
    if ($('pdf-only')?.checked && !book.pdfPath && !book.pdf) return false;
    if (!terms.length) return true;
    const edition = book.edition && typeof book.edition==='object' ? Object.values(book.edition) : [book.edition, ...Object.values(READING_GUIDES[book.id]?.edition || {}).filter(value=>typeof value==='string')];
    const words = searchTerms([book.title,book.author,book.year,book.publisher,book.isbn,...edition,...(book.themes||[])].join(' ')).join(' ');
    return terms.every(term => words.includes(term));
  });
  const order=$('search-sort')?.value;
  if(order==='author') items.sort((a,b)=>a.author.localeCompare(b.author,'fr'));
  if(order==='title') items.sort((a,b)=>a.title.localeCompare(b.title,'fr'));
  if(order==='newest') items.sort((a,b)=>Number(bookYear(b)||0)-Number(bookYear(a)||0));
  if(order==='oldest') items.sort((a,b)=>Number(bookYear(a)||9999)-Number(bookYear(b)||9999));
  const tabs = $('catalogue-tabs');
  if (tabs) {
    tabs.querySelectorAll('[data-genre]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.genre === $('search-genre').value));
    });
  }
  const count = $('search-count');
  const shelfCount = $('shelf-count');
  if (shelfCount) shelfCount.textContent = items.length + (items.length === 1 ? ' livre dans ce rayon' : ' livres dans ce rayon');
  if (count) count.textContent = items.length + (items.length === 1 ? ' livre trouvé' : ' livres trouvés');
  const empty = count
    ? 'Aucun livre pour cette recherche. Essaie un autre mot ou élargis le filtre.'
    : shelfCount
      ? (terms.length ? 'Aucun livre ne correspond à cette recherche dans ce rayon.'
        : 'Ce rayon ne contient pas encore de livre.')
      : 'Aucun livre ici pour le moment. Ajoute ta première lecture pour la retrouver dans ce parcours.';
  el.innerHTML = items.map(b => card(b, el.dataset.admin === 'true' && adminEnabled, el.dataset.destination || 'livre')).join('')
    || '<p class="empty">' + empty + '</p>';
  el.querySelectorAll('[data-delete-book]').forEach(btn=>btn.onclick=async()=>{if(!adminEnabled||!service)return;if(!confirm('Retirer ce livre du catalogue ?'))return;const response=await fetch('/api/catalogue/'+encodeURIComponent(btn.dataset.deleteBook),{method:'DELETE'});if(!response.ok){message('Le catalogue n’a pas été modifié.',true);return;}state.books=state.books.filter(b=>b.id!==btn.dataset.deleteBook);renderBooks();});
}
function selects(){if($('book-select')){$('book-select').innerHTML=state.books.map(b=>'<option value="'+esc(b.id)+'">'+esc(b.title)+'</option>').join('');if(!state.books.length){$('book-select').innerHTML='<option value="">Ajoute un livre avant de commencer</option>';}}}
function subOptions(){if($('sub'))$('sub').innerHTML=GENRES[$('genre').value][1].map((s,i)=>'<option value="'+i+'">'+esc(s)+'</option>').join('');}
function renderHighlights(){let el=$('highlights');if(!el)return;let items=state.highlights.filter(h=>el.dataset.mode!=='annotations'||h.annotation);el.innerHTML=items.map(h=>{let b=state.books.find(b=>b.id===h.book);return '<article class="panel"><a href="'+bookLink(b||{id:h.book})+'">'+esc(b?.title||'Livre supprimé')+'</a><p>'+esc(h.page)+'</p><blockquote style="border-left:6px solid '+esc(h.color)+';padding:12px">'+esc(h.quote)+'</blockquote><p>'+esc(h.annotation)+'</p><button data-remove-highlight="'+esc(h.id)+'">Supprimer</button></article>';}).join('')||'<p class="empty">Aucun passage enregistré pour le moment.</p>';el.querySelectorAll('[data-remove-highlight]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Supprimer ce passage ?'))return;state.highlights=state.highlights.filter(h=>h.id!==btn.dataset.removeHighlight);await save();renderHighlights();});}
function renderNotes(){let el=$('notes');if(!el)return;el.innerHTML=state.notes.filter(n=>n.kind===el.dataset.kind).map(n=>{let b=state.books.find(b=>b.id===n.book);return '<article class="panel"><h2>'+esc(n.title)+'</h2><a href="'+bookLink(b||{id:n.book})+'">'+esc(b?.title||'Livre')+'</a> · '+esc(n.page)+'<p style="white-space:pre-wrap">'+esc(n.body)+'</p><button data-edit-note="'+esc(n.id)+'">Modifier</button><button data-delete-note="'+esc(n.id)+'">Supprimer</button></article>';}).join('')||'<p class="empty">Ton carnet est prêt pour ta première note.</p>';el.querySelectorAll('[data-edit-note]').forEach(btn=>btn.onclick=()=>{let n=state.notes.find(n=>n.id===btn.dataset.editNote);$('note-form').dataset.edit=n.id;$('book-select').value=n.book;$('note-title').value=n.title;$('note-page').value=n.page;$('note-body').value=n.body;$('note-title').focus();});el.querySelectorAll('[data-delete-note]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Supprimer cette note ?'))return;state.notes=state.notes.filter(n=>n.id!==btn.dataset.deleteNote);await save();renderNotes();});}
function renderQuestions(){if(!$('questions'))return;$('questions').innerHTML=state.questions.map(q=>'<article class="panel"><p>'+esc(state.books.find(b=>b.id===q.book)?.title)+'</p><h2>'+esc(q.question)+'</h2><label>Ma réponse</label><textarea aria-label="Ma réponse à la question"></textarea><details><summary>Comparer avec ma réponse attendue</summary><p>'+esc(q.answer)+'</p></details><button data-remove-question="'+esc(q.id)+'">Supprimer la question</button></article>').join('');$('questions').querySelectorAll('[data-remove-question]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Supprimer cette question ?'))return;state.questions=state.questions.filter(q=>q.id!==btn.dataset.removeQuestion);await save();renderQuestions();});}
function applyDesign(){if(state.design.bg)document.body.style.backgroundColor=state.design.bg;let st=$('user-design');if(!st){st=document.createElement('style');st.id='user-design';document.head.appendChild(st);}st.textContent=state.design.accent?'.btn,button{background:'+state.design.accent+'}':'';}
const ORIGINAL_CATALOGUE={"liv0001": {"id": "liv0001", "title": "L’Art d’avoir toujours raison", "author": "Arthur Schopenhauer", "genre": "savoirs", "sub": "2", "cover": "images/niveau-4-livres/savoirs/philosophie/liv0001-couverture.jpg", "presentation": "Un essai sur les procédés employés dans une controverse. Schopenhauer examine la façon dont on peut prendre l’avantage dans un débat, y compris lorsque la solidité des arguments est en question.", "summary": "", "text": ""}, "liv0002": {"id": "liv0002", "title": "Cerveau et odorat", "author": "Moustafa Bensafi et Catherine Rouby", "genre": "savoirs", "sub": "0", "cover": "images/niveau-4-livres/savoirs/sciences/liv0002-couverture.jpg", "presentation": "Moustafa Bensafi et Catherine Rouby explorent l’odorat et ses liens avec les émotions, la mémoire et la vie sociale.", "summary": "", "text": ""}, "liv0003": {"id": "liv0003", "title": "La Science secrète", "author": "Dr Ferran, Papus, Eugène Nus, Julien Lejay et S. de Guaita", "genre": "spiritualites", "sub": "3", "cover": "images/niveau-4-livres/spiritualites/esoterisme/liv0003-couverture.jpg", "presentation": "Ce recueil réunit plusieurs textes d’ésotérisme, dont des contributions sur la théosophie et la kabbale.", "summary": "", "text": ""}, "liv0004": {"id": "liv0004", "title": "La Pensée positive pour les nuls", "author": "Averil Leimon, Gladeana McMahon et Béatrice Millêtre", "genre": "vie-et-societe", "sub": "2", "cover": "images/niveau-4-livres/vie-et-societe/vie-pratique/liv0004-couverture.jpg", "presentation": "Un guide de développement personnel consacré à la pensée positive. La notice des médiathèques de La Rochelle identifie Averil Leimon et Gladeana McMahon et mentionne Béatrice Millêtre.", "summary": "", "text": ""}, "liv0005": {"id": "liv0005", "title": "Créer et gérer une entreprise", "author": "Jacques-Daniel Rochat", "genre": "savoirs", "sub": "4", "cover": "images/niveau-4-livres/savoirs/economie-et-politique/liv0005-couverture.jpg", "presentation": "Ce guide aborde la conception et la gestion d’une entreprise avec des exemples portant notamment sur le budget, le financement et la comptabilité.", "summary": "", "text": ""}, "liv0006": {"id": "liv0006", "title": "10 bonnes raisons de devenir entrepreneur", "author": "Auteur non identifié sur la couverture", "genre": "savoirs", "sub": "4", "cover": "images/niveau-4-livres/savoirs/economie-et-politique/liv0006-couverture.jpg", "presentation": "Un document qui présente dix motivations pour entreprendre. La référence ci-dessous le rattache à l’initiative Construire l’Afrique de Demain.", "summary": "", "text": ""}, "demo-carnet": {"id": "demo-carnet", "title": "Le carnet ouvert", "author": "Exercice de lecture · texte original du site", "genre": "fiction", "sub": "7", "cover": "", "presentation": "Un texte original court pour essayer le lecteur et les annotations du carnet.", "summary": "Une lectrice relit un passage et découvre ce qui l’a marquée.", "text": "J’avais posé le livre sur le bord de la table, à côté du carnet que j’ouvrais rarement. Ce soir-là, j’ai relu la même phrase trois fois. La première fois, j’ai suivi l’histoire. La deuxième, j’ai reconnu quelque chose de familier. À la troisième, j’ai compris que je cherchais les mots pour le dire.\n\nDans le carnet, j’ai écrit une seule ligne : « Revenir ici demain. » Le lendemain, la phrase était toujours la même. Ma question, elle, avait changé."}};
function catalogueBook(b){return LIVRES_INITIAUX.find(x=>x.id===b.id&&x.pdfPath)||null;}
function pdfAddress(b){const file=b.pdf||b.pdfPath;if(!file)return '';if(b.pdfPath&&!b.pdf&&typeof previewPDF==='function')return previewPDF(b.pdfPath);return file;}
function starLine(value){return '<p class="rating-stars" aria-hidden="true"><span class="star-track">★★★★★<span style="width:'+Math.min(100,Math.max(0,Number(value)*20))+'%">★★★★★</span></span></p>';}
function formatNumber(n){return Number(n).toLocaleString('fr-FR',{maximumFractionDigits:2});}
function ratingValue(r){return Number(r.rating)/(r.scale===5?1:2);}
function localReception(b){const r=state.reviews[b.id];const score=r?ratingValue(r):null;return '<section class="reader-reception"><p class="artist-kicker">Entre les lignes · sur cet appareil</p><h2>Les étoiles du carnet</h2><p class="rating-value">'+(r?formatNumber(score)+' / 5':'Pas encore de note')+'</p>'+starLine(score||0)+'<p>'+(r?'1 critique enregistrée':'0 critique · La première page est à écrire.')+'</p><p class="small">Les avis de cette version sont conservés dans ce navigateur. Une moyenne commune à tous les comptes n’est pas connectée.</p><a class="btn secondary" href="'+bookLink(b,'avis')+'">'+(r?'Relire ou modifier mon avis':'Écrire ma critique')+'</a>'+(r?'<details class="reader-opinion"><summary>'+(r.spoiler?'Lire ma critique · contient des révélations':'Lire ma critique')+'</summary><p class="pre-wrap">'+esc(r.text)+'</p></details>':'')+'</section>';}
function externalReception(b){const e=b.external;if(!e||!Number.isFinite(e.rating)||!Number.isFinite(e.count)||e.count<=0)return '';return '<section class="external-reception"><p class="artist-kicker">Réception extérieure · '+esc(e.site)+'</p><h2>Les lecteurs ailleurs</h2><p class="rating-value">'+(e.rating===null?'Note non vérifiée':formatNumber(e.rating)+' / 5')+'</p>'+(e.rating!==null?starLine(e.rating)+'<p>'+formatNumber(e.count)+' '+(e.count===1?'évaluation':'évaluations')+(e.comments!==null?' · '+formatNumber(e.comments)+' '+(e.comments===1?'critique publiée':'critiques publiées'):'')+'</p>':'')+'<p>'+esc(e.text)+'</p><p class="small">'+esc(e.scope)+'</p><p class="small">Relevé documentaire du '+esc(e.checked)+'. Les chiffres peuvent avoir changé depuis l’indexation des pages consultées. Aucun rafraîchissement automatique.</p>'+(e.url?'<a class="editorial-link" href="'+esc(e.url)+'" target="_blank" rel="noopener">Consulter la source et les avis ↗</a>':'')+'</section>';}
function wirePDFLinks(){document.querySelectorAll('[data-pdf-link]').forEach(a=>{const p=a.dataset.pdfLink;if(typeof previewPDF==='function')a.href=previewPDF(p);});}
function drawLocalReview(b){if($('review-local'))$('review-local').innerHTML=localReception(b);}

// Carnet illustré : les notes personnelles restent séparées du catalogue.
let service=null,remoteVersion=null,pendingWrites=0,adminEnabled=false,readerController=null,autosaveQueue=Promise.resolve(),lastSyncedCarnet='',pageReleased=false;
const LEGEND_DEFAULT={'#f4df9c':'Idée importante','#eed0de':'Ressenti','#dbe8cf':'À approfondir','#dfd4f0':'Question','#bcdfee':'À retenir','#f6cdb0':'Citation'};
const BOOK_ART={liv0003:['jardin-secret.jpg','Un passage secret'],liv0006:['train-fleuri.jpg','L’envie de se lancer'],liv0007:['telephone-rose.jpg','Parlons argent'],liv0008:['chuchotement.jpg','Trouver sa voix'],liv0009:['regard-curieux.jpg','Entre les lignes'],liv0010:['ampoule-etoiles.jpg','Faire un premier pas'],liv0011:['lecteur-journal.jpg','À plusieurs, plus loin'],liv0012:['carnets-et-monde.jpg','Un équilibre à inventer'],liv0013:['soucoupes-pastel.jpg','D’où vient notre monde ?'],liv0014:['tiroir-imaginaire.jpg','Ce que l’on fait grandir']};
function assetHref(path){return typeof previewAsset==='function'?previewAsset(path):path;}
function smallCover(b){return b?.cover?'<img class="trace-cover" src="'+esc(assetHref(b.cover))+'" alt="Couverture de '+esc(b.title)+'">':'<img class="trace-cover trace-cover-drawing" src="'+esc(assetHref('images/objets/livre-ouvert.svg'))+'" alt="">';}
function wordsInPaper(text){return String(text).split(/\s+/).map((w,i)=>'<span class="cut-word cut-word-'+i%3+'">'+esc(w)+'</span>').join(' ');}
function localReception(b){const r=state.reviews[b.id],score=r?ratingValue(r):null;return '<section class="reader-reception scrapbook-rating"><img class="rating-drawing" src="'+esc(assetHref('images/objets/avis.svg'))+'" alt=""><p class="artist-kicker">Mon carnet de lecture</p><h2>'+wordsInPaper('Mes étoiles')+'</h2>'+(r?'<p class="rating-value">'+formatNumber(score)+' <small>/ 5</small></p>'+starLine(score)+'<p class="rating-counter">1 critique dans mon carnet</p>':'<p class="rating-invitation">À toi d’écrire la suite…</p><p>0 critique</p>')+'<a class="editorial-link" href="'+bookLink(b,'avis')+'">'+(r?'Modifier ma critique sur ce livre':'Ma critique sur ce livre')+' ↗</a>'+(r?'<details class="reader-opinion"><summary>'+(r.spoiler?'Lire ma critique · révélations':'Lire ma critique')+'</summary><p class="pre-wrap">'+esc(r.text)+'</p></details>':'')+'</section>';}
function externalReception(b){const e=b.external;if(!e||!Number.isFinite(e.rating)||!Number.isFinite(e.count)||e.count<=0)return '';const scope={liv0006:'Édition 2020 · PDF 2019',liv0007:'Œuvre · plusieurs éditions',liv0009:'Œuvre · plusieurs éditions',liv0012:'Une fiche de ce titre',liv0013:'Édition 2022 · PDF 2015',liv0019:'Œuvre originale · PDF extrait',liv0021:'Œuvre · plusieurs éditions'}[b.id]||'';
return '<section class="external-reception scrapbook-rating"><img class="rating-drawing" src="'+esc(assetHref('images/objets/medaillon.svg'))+'" alt=""><p class="artist-kicker">Les étoiles venues d’ailleurs</p><h2>'+esc(e.site)+'</h2><p class="rating-value">'+formatNumber(e.rating)+' <small>/ 5</small></p>'+starLine(e.rating)+'<div class="rating-tallies"><span><b>'+formatNumber(e.count)+'</b> '+(e.count===1?'note':'notes')+'</span>'+(e.comments!==null?'<span><b>'+formatNumber(e.comments)+'</b> '+(e.comments===1?'critique':'critiques')+'</span>':'')+'</div>'+(scope?'<small class="rating-scope">'+esc(scope)+'</small>':'')+'<a class="editorial-link" href="'+esc(e.url)+'" target="_blank" rel="noopener">Lire les avis sur '+esc(e.site.replace(' — avis clients',''))+' ↗</a><small class="rating-date">Relevé du '+esc(e.checked)+'</small></section>';}
function bookFileActions(book, meta) {
  const pdf = meta.pdf || meta.pdfPath;
  const readLabel = pdf ? 'Lire le PDF ici' : 'Ouvrir le texte';
  const readHint = pdf ? 'Lecteur intégré · surlignage et notes' : 'Lire et prendre des notes';
  const downloadHint = meta.pdfPages ? 'PDF · '+meta.pdfPages+' pages' : 'Enregistrer une copie sur ton appareil';
  const fileName = (meta.pdfPath?.startsWith('pdf/') ? meta.pdfPath.slice(4) : book.title.replace(/[\\/:*?"<>|]/g,'-')+'.pdf');
  const download = pdf ? `<a class="book-file-action file-download" href="${esc(pdf)}" ${meta.pdfPath&&!meta.pdf?`data-pdf-link="${esc(meta.pdfPath)}"`:''} download="${esc(fileName)}">
    <span class="file-glyph download-glyph" aria-hidden="true"></span><span><strong>Télécharger le PDF</strong><small>${esc(downloadHint)}</small></span></a>` : '';
  const reader = pdf || book.text ? `<a class="book-file-action file-open" href="${esc(siteHref('lire.html?id='+encodeURIComponent(book.id)+'#reader-content'))}">
    <img src="${esc(assetHref('images/objets/livre-ouvert.svg'))}" alt=""><span><strong>${readLabel}</strong><small>${readHint}</small></span></a>` : '';
  return `<div class="book-file-actions">${reader}${download}</div>`;
}

function reviewTimestamp(book) {
  const date = state.reviews[book.id]?.date;
  const timestamp = date ? Date.parse(date) : NaN;
  return Number.isFinite(timestamp) ? timestamp : null;
}
function reviewDay(timestamp) {
  if (timestamp === null) return '';
  const date = new Date(timestamp);
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}
function renderReviewBooks(el) {
  const terms = searchTerms($('review-search').value);
  const day = $('review-day').value;
  const onlyReviewed = $('review-only').checked;
  const order = $('review-sort').value;
  const compareTitle = (a,b) => a.title.localeCompare(b.title,'fr');
  const rows = state.books.filter(book => {
    if (onlyReviewed && !state.reviews[book.id]) return false;
    if (day && reviewDay(reviewTimestamp(book)) !== day) return false;
    const words = searchTerms(book.title+' '+book.author).join(' ');
    return terms.every(term=>words.includes(term));
  });
  rows.sort((a,b)=>{
    if (order === 'author') return a.author.localeCompare(b.author,'fr') || compareTitle(a,b);
    if (order === 'title') return compareTitle(a,b);
    const left=reviewTimestamp(a), right=reviewTimestamp(b);
    if (left === null || right === null) return Number(left===null)-Number(right===null) || compareTitle(a,b);
    return (order === 'oldest' ? left-right : right-left) || compareTitle(a,b);
  });
  const dateFormat = new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium'});
  $('review-count').textContent = rows.length+' livre'+(rows.length===1?'':'s');
  el.innerHTML = rows.map(book=>{
    const time = reviewTimestamp(book);
    const review = state.reviews[book.id];
    const info = time !== null ? 'Critique du '+dateFormat.format(time) : review ? 'Critique enregistrée' : 'À chroniquer';
    return `<article class="book review-book-card">${smallCover(book)}<div><h2>${esc(book.title)}</h2><p>${esc(book.author)}</p>
      <p class="review-date">${esc(info)}</p><a class="btn" href="${esc(bookLink(book,'avis'))}">${review?'Ma critique sur ce livre':'Écrire ma critique'}</a>
      <a class="editorial-link" href="${esc(bookLink(book))}">Fiche du livre</a></div></article>`;
  }).join('') || '<p class="empty">Aucun livre pour cette recherche ou cette date.</p>';
}

const READING_GUIDES = {
  "liv0003": {
    "unit": "Contributions",
    "chapters": [
      {
        "title": "Rites et symboles maçonniques",
        "summary": "Le Dr Ferran lit les gestes et les emblèmes de la franc-maçonnerie à la lumière de traditions plus anciennes. Il construit une filiation symbolique qui reflète les idées du recueil.",
        "page": 4
      },
      {
        "title": "Les interprétations de la Kabbale",
        "summary": "Papus présente une lecture occultiste de la tradition kabbalistique. Les lettres, les nombres et les correspondances lui servent à relier différents niveaux de réalité.",
        "page": 19
      },
      {
        "title": "La théosophie selon Eugène Nus",
        "summary": "Nus expose une vision de l’existence où l’évolution de l’être humain se prolonge sur le plan spirituel. Il rapproche plusieurs traditions pour expliquer son modèle.",
        "page": 39
      },
      {
        "title": "Occultisme et économie politique",
        "summary": "Julien Lejay applique son cadre ésotérique à l’organisation sociale et aux échanges. Cette contribution déplace la discussion des symboles vers le travail, les richesses et les rapports entre les personnes.",
        "page": 64
      },
      {
        "title": "La réception martiniste",
        "summary": "Le discours final s’adresse à une personne qui entre dans le martinisme. Stanislas de Guaïta décrit l’initiation comme un engagement qui demande discrétion et travail sur soi.",
        "page": 84
      }
    ],
    "summary": "Cinq contributions de la fin du XIXᵉ siècle réunissent franc-maçonnerie, Kabbale, théosophie, économie politique et initiation martiniste. Chacune suit sa propre logique. L’ensemble donne à lire la manière dont certains auteurs de l’époque rapprochaient traditions spirituelles, symboles et organisation de la société.",
    "edition": {
      "original": "1890",
      "note": "Recueil collectif paru en 1890. Édition numérique Arbre d’Or, décembre 2009.",
      "sources": [
        {
          "label": "Arbre d’Or · édition numérique",
          "url": "https://www.arbredor.com/ebooks/ScienceSecrete.pdf"
        }
      ]
    }
  },
  "liv0006": {
    "unit": "Sections",
    "chapters": [
      {
        "title": "Se demander pourquoi entreprendre",
        "summary": "Le livret interpelle aussi bien une personne salariée qu’une personne étudiante. Il l’invite à partir de sa propre trajectoire avant d’évaluer ce qu’elle est prête à changer.",
        "page": 4
      },
      {
        "title": "S’écarter d’un parcours tracé",
        "summary": "L’image de deux lions oppose la stabilité d’une routine au risque de chercher soi-même ses ressources. L’auteur présente le goût de l’aventure comme l’une des motivations possibles.",
        "page": 6
      },
      {
        "title": "Donner une direction à son travail",
        "summary": "Le livret part du sentiment de dépendre de décisions prises par d’autres. Monter une activité devient une manière de rapprocher son travail de ses propres objectifs.",
        "page": 8
      },
      {
        "title": "Agir sur son environnement",
        "summary": "L’entrepreneuriat est présenté comme une façon d’agir sur un problème concret. Le projet prend son intérêt dans ce qu’il peut changer autour de lui.",
        "page": 10
      },
      {
        "title": "Gagner en autonomie",
        "summary": "Cette section met en avant la possibilité de décider de sa direction et de ses priorités. Elle associe cette liberté aux responsabilités du porteur de projet.",
        "page": 12
      },
      {
        "title": "Donner envie à d’autres d’essayer",
        "summary": "L’exemple d’une personne qui se lance peut rendre un parcours plus imaginable pour son entourage. Le livret insiste sur cet effet d’entraînement.",
        "page": 14
      },
      {
        "title": "Faire d’un intérêt son métier",
        "summary": "La section relie création d’activité et envie de consacrer son temps à un sujet qui compte. Elle présente la passion comme une source d’énergie pour poursuivre le projet.",
        "page": 16
      },
      {
        "title": "Choisir un défi",
        "summary": "Les obstacles sont décrits comme des occasions d’apprendre et de mesurer sa progression. Le texte souligne l’attrait que ce type de défi exerce sur certains profils.",
        "page": 18
      },
      {
        "title": "Apporter quelque chose aux autres",
        "summary": "La satisfaction des personnes qui utilisent un produit ou un service devient ici une raison d’entreprendre. La réussite se mesure aussi par l’utilité ressentie.",
        "page": 20
      },
      {
        "title": "Grandir en construisant son projet",
        "summary": "Prendre des décisions et traverser des imprévus oblige à apprendre de nouvelles choses. Le livret présente ce changement personnel comme un bénéfice du parcours.",
        "page": 22
      },
      {
        "title": "Trouver sa propre motivation",
        "summary": "La dernière section ouvre la liste et laisse à chacun la place de formuler sa raison. Elle prolonge la question posée au début du livret.",
        "page": 24
      }
    ],
    "summary": "Ce livret invite à se demander ce que l’on cherche dans l’entrepreneuriat. Ses motivations vont de l’autonomie au plaisir de relever un défi, en passant par l’envie de rendre un service ou d’inspirer d’autres personnes. Chaque section part d’une raison de se lancer.",
    "edition": {
      "note": "Livret de 2019. Le PDF ne porte ni nom d’auteur ni ISBN. Le nom de Philippe Simo renvoie à une notice homonyme.",
      "sources": [],
      "author": "Non signé dans le PDF"
    }
  },
  "liv0007": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Réduire les sorties d’argent inutiles",
        "summary": "Sethi commence par les frais bancaires, les cartes avec réserve de crédit et les dettes. Il propose de faire le point sur les postes qui ponctionnent déjà le budget.",
        "page": 23
      },
      {
        "title": "Organiser ses comptes",
        "summary": "L’auteur explique comment comparer les frais et répartir l’argent entre différents comptes. Il cherche à rendre le fonctionnement de la banque plus lisible au quotidien.",
        "page": 48
      },
      {
        "title": "Préparer l’investissement",
        "summary": "Le livre décrit des étapes entre les premières économies et le placement à long terme. L’adaptation française présente les dispositifs cités dans cette édition.",
        "page": 67
      },
      {
        "title": "Choisir où va son argent",
        "summary": "Sethi propose de prévoir la part consacrée aux charges, à l’épargne et aux dépenses plaisir. On peut ainsi arbitrer en fonction de ce qui compte vraiment pour soi.",
        "page": 83
      },
      {
        "title": "Programmer les virements",
        "summary": "Le chapitre assemble les comptes en un système où plusieurs transferts se déclenchent après la rentrée d’argent. La routine doit demander moins de décisions chaque mois.",
        "page": 123
      },
      {
        "title": "Mettre les pronostics à distance",
        "summary": "Sethi revient sur les limites des prévisions de marché et l’effet des frais sur la durée. Il explique pourquoi il privilégie une organisation simple à suivre.",
        "page": 141
      },
      {
        "title": "Comprendre les placements",
        "summary": "L’auteur introduit la diversification et la répartition entre types de placements. L’objectif est de pouvoir lire les grands choix qui composent un portefeuille.",
        "page": 160
      },
      {
        "title": "Faire évoluer le système",
        "summary": "Ce chapitre aborde le suivi dans la durée, l’ajustement des versements et le retour à une répartition choisie quand elle a dérivé.",
        "page": 199
      },
      {
        "title": "Mettre l’argent au service de sa vie",
        "summary": "Les dernières pages reviennent sur les décisions qui engagent un budget dans la durée, comme le logement ou certaines dépenses de couple. Sethi les relie à sa définition d’une vie riche.",
        "page": 219
      }
    ],
    "summary": "Ramit Sethi propose une progression en six semaines pour reprendre la main sur son argent. Il part des frais et des dettes, puis organise les comptes, les dépenses choisies et l’épargne. L’adaptation française illustre comment rendre ces décisions régulières et les relier à une vie que l’on a envie de mener.",
    "edition": {
      "kind": "ISBN numérique",
      "otherIsbn": "9791092928198 (papier)",
      "sources": [
        {
          "label": "Alisio · édition numérique",
          "url": "https://www.alisio.fr/produit/89/9791092928501/devenez-riche"
        }
      ],
      "original": "2009"
    }
  },
  "liv0008": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Un collègue prend trop de place",
        "summary": "Après sa séparation d’avec Eliott, Esther revient consulter Hédia. Elle évoque un collègue envahissant et la difficulté à lui opposer une limite.",
        "page": 16
      },
      {
        "title": "Dire les choses directement",
        "summary": "Esther revient sur l’échange avec son collègue. Elle s’aperçoit qu’elle attend souvent que l’autre comprenne une limite qu’elle a du mal à formuler.",
        "page": 21
      },
      {
        "title": "Les rôles de l’enfance",
        "summary": "En repensant à ses jeux et à la place qu’elle occupait auprès de ses parents, Esther explore son habitude de divertir les autres et de s’adapter à eux.",
        "page": 25
      },
      {
        "title": "Les demandes de l’ex-conjoint",
        "summary": "Installée dans un nouveau logement, Esther essaie de se réapproprier son espace. Sa relation avec Eliott l’oblige à distinguer ses envies des demandes qu’elle accepte.",
        "page": 30
      },
      {
        "title": "Le regard du superviseur",
        "summary": "Hédia parle de son travail avec Jacques, son superviseur. Le dialogue donne à voir les hypothèses qu’elle construit sur Esther et la façon dont elle choisit d’avancer.",
        "page": 35
      },
      {
        "title": "Le sentiment de vide",
        "summary": "Les réflexions d’Esther sur ses enfants la renvoient à sa propre enfance. Elle commence à parler de son sentiment de décalage et de la honte qui l’accompagne.",
        "page": 39
      },
      {
        "title": "Les protections contre l’angoisse",
        "summary": "Le commentaire relie plusieurs scènes du récit à une même stratégie d’adaptation. Ce qui a pu protéger Esther enfant peut l’empêcher de se sentir libre à l’âge adulte.",
        "page": 43
      },
      {
        "title": "La violence dans la relation",
        "summary": "Une conversation avec Eliott fait apparaître une violence qu’Esther peine à nommer. La séance revient sur ce qu’elle a ressenti et sur les risques auxquels elle est exposée.",
        "page": 47
      },
      {
        "title": "La peur de ce qui change",
        "summary": "Esther mesure ce que lui coûte le fait de parler plus librement. Hédia l’aide à observer cette peur et à constater ce qui se passe quand elle exprime son désaccord.",
        "page": 52
      },
      {
        "title": "Le cauchemar des vampires",
        "summary": "Un premier changement dans sa chambre aide Esther à reprendre possession de son quotidien. Elle relie aussi l’évolution d’un cauchemar récurrent à son sentiment de sécurité.",
        "page": 56
      },
      {
        "title": "Des places inversées",
        "summary": "Dans son rapport à sa mère et à son entourage, Esther reconnaît des attentes qui lui font prendre en charge les réactions des autres.",
        "page": 61
      },
      {
        "title": "Le souvenir de la pension",
        "summary": "Un souvenir de pension revient à Esther pendant qu’elle attend sa fille. La distance avec sa famille prend une signification différente au fil de la séance.",
        "page": 64
      },
      {
        "title": "Quand les limites disparaissent",
        "summary": "Le commentaire théorique revient sur les liens dans lesquels la place de chacun devient floue. Le texte examine comment la violence et l’intrusion peuvent empêcher Esther de se sentir sujet de sa propre vie.",
        "page": 67
      },
      {
        "title": "Un nouveau travail",
        "summary": "Esther présente son changement de poste comme une nouvelle étape. La séance met au jour les ressemblances entre certaines situations qui se répètent.",
        "page": 73
      },
      {
        "title": "La crainte du rejet",
        "summary": "Esther s’interroge sur la réaction de ses proches à sa relation avec Marie. Ces questions la ramènent à ce qu’elle a ressenti enfant quand elle ne correspondait pas aux attentes familiales.",
        "page": 77
      },
      {
        "title": "Une angoisse envahissante",
        "summary": "Un geste banal au travail déclenche un malaise qui persiste. Hédia aide Esther à prendre au sérieux ce qu’elle ressent et à le mettre en mots.",
        "page": 84
      },
      {
        "title": "Mettre fin à la relation avec Marie",
        "summary": "Esther annonce la rupture. En revenant sur sa décision, elle envisage qu’elle ait cherché à se protéger d’une proximité devenue difficile à supporter.",
        "page": 88
      },
      {
        "title": "L’attachement et la distance",
        "summary": "La rupture amène Esther à revenir sur sa rencontre avec Joshua. Elle distingue la possibilité d’un contact respectueux de la peur de s’engager dans un lien durable.",
        "page": 91
      },
      {
        "title": "Des raisons de rester seule",
        "summary": "Hédia laisse Esther choisir ce qu’elle veut aborder. À travers les arguments qu’Esther avance, la séance examine la place que la peur tient dans ses relations.",
        "page": 95
      },
      {
        "title": "Le besoin d’appartenir",
        "summary": "Les autrices relient le sentiment d’être de trop au besoin humain de reconnaissance. Le commentaire éclaire les manières dont Esther a tenté de trouver sa place.",
        "page": 100
      },
      {
        "title": "Un souvenir qui résonne",
        "summary": "Après l’anniversaire de sa fille, Esther éprouve un malaise difficile à situer. La séance fait le lien entre ses sensations présentes et des expériences anciennes.",
        "page": 106
      },
      {
        "title": "Faire une première confidence",
        "summary": "Esther annonce qu’elle a gardé une partie de son histoire pour elle. Hédia l’écoute et lui laisse définir ce qu’elle est prête à dire.",
        "page": 110
      },
      {
        "title": "Entendre sans juger",
        "summary": "La confidence fait naître de la colère chez Hédia. Elle distingue ce qu’Esther se reproche de la responsabilité de la personne qui a abusé d’elle.",
        "page": 116
      },
      {
        "title": "Les circonstances de l’abus",
        "summary": "Esther revient sur un souvenir où un cadeau et la dette qu’il semble créer se mêlent. Le récit montre comment elle s’est retrouvée prise dans une situation qu’elle n’avait pas choisie.",
        "page": 121
      },
      {
        "title": "Dire l’impossibilité d’échapper",
        "summary": "Esther parvient à raconter une autre scène de violence. Hédia comprend mieux le lien entre ces souvenirs, la peur et les réactions de protection de sa patiente.",
        "page": 126
      },
      {
        "title": "Comprendre les effets de l’inceste",
        "summary": "Le commentaire examine la culpabilité, la mémoire et le retour des souvenirs dans certaines circonstances. Il propose une lecture clinique de ce que le récit vient de montrer.",
        "page": 131
      },
      {
        "title": "Réapprendre ses propres limites",
        "summary": "Un changement de fauteuil suffit à réveiller chez Esther un besoin de protection. La séance ouvre une discussion sur l’intimité, le corps et l’espace qu’elle peut demander.",
        "page": 138
      },
      {
        "title": "Parler avec d’autres victimes",
        "summary": "Esther participe à un groupe de parole et envisage de devenir bénévole. Elle découvre des parcours différents du sien et un endroit où son vécu peut être entendu.",
        "page": 142
      },
      {
        "title": "Se reconnaître victime",
        "summary": "Esther fait avancer le projet d’avoir sa propre maison. En parallèle, le groupe et la thérapie l’aident à nommer ce qu’elle a subi sans réduire sa vie à cet événement.",
        "page": 147
      },
      {
        "title": "Se voir autrement",
        "summary": "Esther observe une manière nouvelle de ressentir et de regarder son histoire. La séance fait revenir l’image de l’enfant qu’elle a été et les émotions qui y sont liées.",
        "page": 151
      },
      {
        "title": "Un appel de la mère",
        "summary": "Un appel familial touche Hédia elle-même. Le récit ouvre un écho entre les liens que la thérapeute connaît dans sa vie et ceux qu’Esther explore en séance.",
        "page": 155
      },
      {
        "title": "Le rôle du groupe de parole",
        "summary": "Le commentaire revient sur l’appartenance, la reconnaissance et la possibilité de parler d’un traumatisme auprès de personnes qui ont vécu des situations voisines.",
        "page": 159
      },
      {
        "title": "Faire place à une rencontre",
        "summary": "Esther parle de nouvelles responsabilités et d’une rencontre. Elle se confronte à la fois au regard de son entourage et à sa propre envie de prendre des risques.",
        "page": 164
      },
      {
        "title": "Refuser d’être traitée comme un objet",
        "summary": "Esther revient sur les soins et la tendresse dont elle aurait eu besoin enfant. Cette prise de conscience l’aide à formuler ce qu’elle attend d’une relation adulte.",
        "page": 171
      },
      {
        "title": "Accueillir une nouvelle rupture",
        "summary": "Après la rupture avec Matthias, Esther exprime une douleur vive. Le travail avec Hédia lui permet de reconnaître la valeur de l’expérience qu’elle a tentée.",
        "page": 175
      },
      {
        "title": "Faire le point sur la thérapie",
        "summary": "Esther et Hédia reviennent sur le chemin parcouru. Esther décrit ce qu’elle peut maintenant nommer et les choix qu’elle fait avec davantage de liberté.",
        "page": 181
      },
      {
        "title": "Retrouver une capacité d’agir",
        "summary": "Le dernier commentaire revient sur le corps comme frontière et protection. Il relie cette expérience à la possibilité pour Esther de se donner une place et de poser ses limites.",
        "page": 187
      }
    ],
    "summary": "Esther consulte après une séparation. Au fil des séances, elle revient sur sa difficulté à poser des limites au travail et dans ses relations, puis sur des violences longtemps tues. Karine Danan alterne scènes de thérapie et commentaires cliniques pour montrer comment Esther retrouve peu à peu une marge de choix.",
    "edition": {
      "kind": "ISBN papier",
      "collection": "Histoires de divan",
      "sources": [],
      "pages": 286,
      "year": "10 octobre 2013"
    }
  },
  "liv0009": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Ce qu’Ekman appelle un mensonge",
        "summary": "Ekman distingue le fait de cacher une information de celui de simuler une réalité. Il définit aussi la différence entre une information qui échappe au menteur et un simple indice.",
        "page": 13
      },
      {
        "title": "Les raisons d’un échec",
        "summary": "Un récit peut se fissurer faute de préparation. La peur d’être découvert, la culpabilité ou le plaisir de tromper peuvent aussi modifier la manière dont une personne s’exprime.",
        "page": 25
      },
      {
        "title": "Ce que révèlent les paroles et la voix",
        "summary": "Le chapitre passe de la formulation des réponses à la voix et aux mouvements du corps. Il insiste sur les variations par rapport à la façon habituelle de parler ou de bouger.",
        "page": 48
      },
      {
        "title": "Les indices sur le visage",
        "summary": "Ekman examine les expressions très brèves, interrompues ou décalées. Il explique ce que le rythme et la forme d’un sourire peuvent suggérer dans un contexte précis.",
        "page": 75
      },
      {
        "title": "Les erreurs d’interprétation",
        "summary": "L’exemple d’Othello illustre une confusion entre peur d’être accusé et peur d’être démasqué. L’auteur demande de rechercher les autres raisons possibles d’une émotion.",
        "page": 100
      },
      {
        "title": "Vérifier ses soupçons",
        "summary": "Le chapitre confronte les indices à des situations historiques et judiciaires. Il montre ce qui se perd quand une impression remplace la vérification des faits.",
        "page": 117
      },
      {
        "title": "Tromperie et vie publique",
        "summary": "À travers plusieurs affaires politiques et institutionnelles, Ekman examine la justification du mensonge, le rôle des témoins et la facilité avec laquelle on peut se convaincre soi-même.",
        "page": 141
      },
      {
        "title": "Recherches et nouvelles questions",
        "summary": "Ekman revient sur les motivations des personnes qui mentent et les conditions dans lesquelles les observateurs réussissent leurs jugements. Il relève les limites des résultats.",
        "page": 168
      },
      {
        "title": "Les expressions brèves ou discrètes",
        "summary": "Le dernier chapitre distingue différentes manières dont une émotion apparaît sur un visage. La durée et l’intensité aident à décrire l’expression, avec prudence sur ce qu’elle signifie.",
        "page": 182
      }
    ],
    "summary": "Paul Ekman s’intéresse à ce qui peut trahir une tromperie dans les mots, la voix ou le visage. Il revient aussi sur les erreurs qui guettent la personne qui observe. Les études et les affaires publiques du livre montrent pourquoi un indice demande toujours un contexte et des vérifications.",
    "edition": {
      "kind": "ISBN numérique",
      "original": "1985",
      "note": "Traduction française parue en 2010 chez Michel Lafon, puis en poche chez J’ai lu. L’ISBN désigne le fichier numérique.",
      "sources": [],
      "year": "2011 (poche)",
      "otherIsbn": "9782290163443 (PDF Web) · 9782290033227 (papier)"
    }
  },
  "liv0010": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Définir une direction",
        "summary": "Hill invite à choisir un objectif central pour mieux orienter ses efforts. Il relie ce choix au sentiment de donner une direction à ses décisions.",
        "page": 5
      },
      {
        "title": "Mettre son objectif en pratique",
        "summary": "L’objectif prend forme quand on l’écrit, qu’on le découpe et qu’on décide de ce que l’on est prêt à y consacrer. Le chapitre revient aussi sur le choix des associés.",
        "page": 25
      },
      {
        "title": "Construire une alliance",
        "summary": "Le « mastermind » désigne chez Hill une alliance de personnes qui poursuivent un but partagé. Les partenaires peuvent réunir des compétences et des ressources complémentaires.",
        "page": 42
      },
      {
        "title": "Agir avec conviction",
        "summary": "Hill décrit la conviction comme un moyen de soutenir un effort sur la durée. Il relie cette idée à sa conception personnelle de la foi.",
        "page": 60
      },
      {
        "title": "Aller au-delà du service attendu",
        "summary": "L’auteur présente la qualité du service et l’initiative comme des moyens de créer de la valeur. Il cherche à expliquer comment cette habitude peut devenir durable.",
        "page": 70
      },
      {
        "title": "Soigner sa manière d’être",
        "summary": "La confiance dans les relations se joue aussi dans l’écoute, la façon de parler et la tenue de ses engagements. Hill relie ces comportements à l’image laissée aux autres.",
        "page": 96
      },
      {
        "title": "Prendre l’initiative",
        "summary": "Le chapitre associe le leadership à la capacité de commencer, d’assumer une décision et de rassembler d’autres personnes autour d’une tâche.",
        "page": 114
      },
      {
        "title": "Travailler son attitude",
        "summary": "Hill propose de repérer les pensées qui rendent l’action plus difficile. Il défend une attitude qui laisse une place à l’initiative quand une situation résiste.",
        "page": 140
      },
      {
        "title": "Installer une discipline",
        "summary": "Le texte aborde la maîtrise des impulsions, de la parole et des habitudes. L’auteur y voit un appui pour tenir le cap dans les moments moins motivants.",
        "page": 158
      },
      {
        "title": "Donner de l’élan à son action",
        "summary": "Hill traite l’enthousiasme comme un état qui peut se cultiver et se communiquer. Il insiste sur la façon de le rattacher à un objectif précis.",
        "page": 189
      },
      {
        "title": "Séparer les faits des impressions",
        "summary": "Ce chapitre recommande de vérifier la provenance d’une information et d’en évaluer l’importance. La rumeur et l’opinion reçoivent moins de poids qu’un fait établi.",
        "page": 201
      },
      {
        "title": "Garder son attention sur l’essentiel",
        "summary": "L’auteur invite à choisir une tâche et à lui réserver du temps. La concentration devient une façon de protéger son objectif de la dispersion.",
        "page": 229
      },
      {
        "title": "Tirer parti des revers",
        "summary": "Hill relit les échecs comme des occasions d’examiner ses choix et de modifier sa méthode. Il s’appuie sur des récits de persévérance.",
        "page": 245
      },
      {
        "title": "Faire travailler son imagination",
        "summary": "Deux façons de créer se dégagent du chapitre. On peut recombiner des idées déjà disponibles ou essayer de concevoir une réponse entièrement nouvelle.",
        "page": 269
      },
      {
        "title": "Préserver ses ressources physiques",
        "summary": "Le texte revient sur le repos, les routines et l’énergie nécessaire à l’action. Ces conseils s’inscrivent dans la philosophie de l’auteur et dans l’époque de ses cours.",
        "page": 290
      },
      {
        "title": "Comprendre la répétition",
        "summary": "Hill appelle « force cosmique » l’idée que des gestes et des pensées répétés deviennent des habitudes. Il recommande de donner une direction à cette répétition.",
        "page": 303
      },
      {
        "title": "Répartir son temps et son argent",
        "summary": "Le livre se termine par la mise en pratique. Prévoir des dépenses et réserver du temps aux tâches importantes permettent de relier le quotidien à l’objectif choisi.",
        "page": 322
      }
    ],
    "summary": "Dans cette série de leçons, Napoleon Hill relie la réussite à un objectif clair et à des habitudes qui soutiennent l’action. Il s’intéresse autant aux alliances qu’à l’autodiscipline, à l’imagination et à la manière de réagir aux revers. Le livre rassemble sa propre philosophie du succès.",
    "edition": {
      "kind": "ISBN numérique",
      "otherIsbn": "9782354564742 (papier)",
      "sources": [
        {
          "label": "Kobo · édition numérique Diateino",
          "url": "https://www.kobo.com/fr/fr/ebook/la-philosophie-du-succes-de-napoleon-hill-2"
        }
      ],
      "original": "2020 (publication des leçons)",
      "year": "18 novembre 2021"
    }
  },
  "liv0011": {
    "unit": "Dossiers",
    "chapters": [
      {
        "title": "Construire sa légitimité",
        "summary": "Les premiers outils invitent à identifier ses forces, à mieux lire ses émotions et à prendre sa place. Le dossier traite aussi de confiance, de temps et d’assertivité.",
        "page": 16
      },
      {
        "title": "Formuler une vision",
        "summary": "Le dossier transforme une idée de départ en objectif formulé et partageable. Il présente plusieurs outils pour préciser le résultat voulu et la façon de le décrire.",
        "page": 127
      },
      {
        "title": "Partager ce que l’on veut construire",
        "summary": "Les auteurs travaillent la prise de parole, la structure du message et la présence. Les outils aident à rendre une idée compréhensible pour des interlocuteurs différents.",
        "page": 165
      },
      {
        "title": "Créer l’adhésion",
        "summary": "Cette partie aborde l’influence, les préférences de communication et la négociation. Elle invite à prendre en compte les intérêts et les attentes des personnes concernées.",
        "page": 209
      },
      {
        "title": "Fédérer une équipe",
        "summary": "Les outils donnent des repères pour reconnaître les étapes de vie d’une équipe. Ils proposent d’adapter le pilotage au climat relationnel et au degré de maturité du groupe.",
        "page": 255
      },
      {
        "title": "Accompagner le changement",
        "summary": "Ce dossier s’intéresse aux réactions face à une transformation. Il propose d’observer où se trouvent les freins et d’ajuster son accompagnement au fil du changement.",
        "page": 285
      },
      {
        "title": "Donner une marge de décision",
        "summary": "Les auteurs travaillent la délégation et le développement de l’autonomie. Le responsable doit préciser le cadre et la latitude laissée à la personne qui agit.",
        "page": 316
      },
      {
        "title": "Valoriser le travail",
        "summary": "Le dernier dossier s’attache aux retours, à la reconnaissance et à l’encouragement. Il donne des façons de nommer des progrès concrets et de soutenir l’engagement.",
        "page": 372
      }
    ],
    "summary": "Huit dossiers aident à travailler des situations de leadership. Ils partent de la légitimité personnelle, puis abordent la manière de formuler une vision, de la partager, de fédérer une équipe et d’accompagner le changement. Chaque dossier propose des outils à choisir selon le problème rencontré.",
    "edition": {
      "kind": "ISBN numérique",
      "otherIsbn": "9782100824533 (papier)",
      "collection": "La Boîte à outils",
      "sources": [],
      "year": "10 mars 2021"
    }
  },
  "liv0012": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Le point de départ du livre",
        "summary": "Mestiri présente sa démarche et la question qui l’a poussé à écrire. Il cherche une manière de réfléchir à sa vie qui puisse se traduire dans les habitudes de tous les jours.",
        "page": 4
      },
      {
        "title": "Argent et satisfaction",
        "summary": "L’auteur examine la place de l’argent dans une vie satisfaisante. Il invite à distinguer ce que l’argent rend possible de ce qui donne du sens au quotidien.",
        "page": 6
      },
      {
        "title": "Définir sa réussite",
        "summary": "Le livre propose de regarder les objectifs que l’on a adoptés sans vraiment les choisir. Il ramène la question de la réussite à des critères que chacun peut expliciter.",
        "page": 13
      },
      {
        "title": "Le modèle des trois piliers",
        "summary": "Mestiri décrit trois piliers : le bien-être, les intérêts que l’on développe et les connexions avec les autres. Il explique comment examiner leur place dans sa vie à l’aide d’exemples et d’exercices.",
        "page": 20
      },
      {
        "title": "Se donner quatre-vingt-dix jours",
        "summary": "Le modèle se transforme en programme d’action. L’auteur suggère de choisir des habitudes, d’observer ce qui tient dans la durée et de corriger progressivement sa façon de faire.",
        "page": 72
      },
      {
        "title": "Organiser sa démarche personnelle",
        "summary": "La dernière partie présente un cadre de suivi qui rassemble les objectifs, les actions et les retours d’expérience. Elle invite à revoir le système quand les priorités changent.",
        "page": 82
      }
    ],
    "summary": "Rami Mestiri rassemble des lectures de développement personnel autour de deux questions simples, ce que l’on appelle réussir et ce qui rend la vie satisfaisante. Il présente son modèle d’équilibre BIC, puis propose de l’expérimenter pendant quatre-vingt-dix jours. Le livre se termine par une méthode de suivi personnel.",
    "edition": {
      "publisher": "",
      "note": "Le fichier ne comporte ni date de parution, ni éditeur, ni ISBN vérifiable.",
      "sources": [
        {
          "label": "Rami Mestiri · mention de l’ouvrage",
          "url": "https://rami.tn/wp-content/uploads/2025/11/CV-Rami-Mestiri.pdf"
        }
      ]
    }
  },
  "liv0013": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Une espèce parmi d’autres",
        "summary": "Harari replace Homo sapiens parmi plusieurs espèces humaines. Il part de cette diversité pour demander comment une espèce relativement ordinaire a fini par transformer son environnement.",
        "page": 5
      },
      {
        "title": "Le langage et les récits partagés",
        "summary": "L’auteur avance que raconter des histoires communes permet de coopérer au-delà du cercle des proches. La confiance dans ces récits devient une force collective.",
        "page": 24
      },
      {
        "title": "Le quotidien des chasseurs-cueilleurs",
        "summary": "À partir de traces et de comparaisons, Harari reconstitue quelques aspects de la vie avant l’agriculture. Il rappelle la diversité des groupes et ce qui échappe aux archives.",
        "page": 50
      },
      {
        "title": "Des migrations qui changent les écosystèmes",
        "summary": "Le chapitre rapproche la diffusion de Sapiens et des disparitions d’animaux de grande taille. Il pose tôt la question des effets humains sur le vivant.",
        "page": 77
      },
      {
        "title": "La contrepartie de l’agriculture",
        "summary": "Cultiver nourrit davantage de personnes, mais fixe aussi les populations et peut alourdir leur travail. Harari oppose la réussite démographique à l’expérience des individus.",
        "page": 94
      },
      {
        "title": "Des sociétés plus vastes",
        "summary": "Surplus agricoles, villes et pouvoir politique rendent possibles de grands ensembles. Les hiérarchies et les récits communs contribuent à les maintenir.",
        "page": 117
      },
      {
        "title": "Stocker ce que l’on ne peut pas retenir",
        "summary": "Avec les impôts, les récoltes et les dettes, la mémoire individuelle ne suffit plus. Le chapitre explique le rôle des nombres, de l’écriture et des archives.",
        "page": 141
      },
      {
        "title": "Comment les inégalités se transmettent",
        "summary": "Harari examine des hiérarchies de caste, de race et de genre. Il distingue l’existence de différences de la manière dont une société décide de les transformer en règles.",
        "page": 157
      },
      {
        "title": "Des mondes qui se rapprochent",
        "summary": "L’auteur décrit une tendance de longue durée vers des ensembles plus connectés. Il annonce trois forces de rapprochement, l’argent, les empires et les religions.",
        "page": 190
      },
      {
        "title": "La confiance derrière l’argent",
        "summary": "Le chapitre explique comment des personnes qui ne se connaissent pas acceptent une même unité d’échange. L’argent facilite la circulation des biens entre cultures.",
        "page": 201
      },
      {
        "title": "L’héritage des empires",
        "summary": "Les empires réunissent des populations par la conquête, puis font circuler des institutions, des langues et des usages. Harari observe ce qui survit à leur chute.",
        "page": 220
      },
      {
        "title": "Les règles qui rassemblent",
        "summary": "L’auteur compare diverses traditions religieuses et idéologies. Il s’intéresse à leur manière de donner une légitimité à des normes communes.",
        "page": 242
      },
      {
        "title": "Pourquoi une culture se diffuse",
        "summary": "Le succès d’une croyance ou d’une pratique ne coïncide pas forcément avec le bien-être de ceux qui l’adoptent. Harari interroge la direction et les effets des évolutions culturelles.",
        "page": 276
      },
      {
        "title": "Faire une place à l’inconnu",
        "summary": "Reconnaître les limites du savoir devient un moteur d’enquête. Le chapitre relie cette attitude à l’observation, aux mathématiques et aux usages pratiques de la science.",
        "page": 287
      },
      {
        "title": "La rencontre de la recherche et de la conquête",
        "summary": "Expéditions, cartes et collections savantes se développent avec l’expansion européenne. Harari examine ce que la science et le pouvoir impérial retirent l’un de l’autre.",
        "page": 322
      },
      {
        "title": "Le pari sur la croissance",
        "summary": "Le crédit dépend de la confiance dans des revenus futurs. Le chapitre relie cette logique à l’investissement, à l’expansion des échanges et à leurs coûts humains.",
        "page": 355
      },
      {
        "title": "Les transformations de l’industrie",
        "summary": "Les nouvelles sources d’énergie et l’organisation industrielle changent ce que l’on produit. Harari revient aussi sur la place des animaux dans cette économie.",
        "page": 391
      },
      {
        "title": "Une société en transformation permanente",
        "summary": "Le temps de travail, la famille et les solidarités se recomposent avec l’industrialisation. Les États et les marchés prennent en charge des fonctions auparavant exercées par les communautés.",
        "page": 410
      },
      {
        "title": "La question du bonheur",
        "summary": "Harari demande si l’augmentation des ressources rend effectivement plus heureux. Il compare plusieurs façons de comprendre la satisfaction et l’effet des attentes.",
        "page": 441
      },
      {
        "title": "L’avenir de l’espèce",
        "summary": "Le génie biologique et la possibilité de modifier le corps ouvrent une discussion sur l’avenir de Sapiens. La dernière question porte sur les limites que l’humanité se donnera.",
        "page": 468
      }
    ],
    "summary": "Yuval Noah Harari remonte aux premières sociétés humaines pour comprendre la place prise par Homo sapiens. Il suit le rôle du langage, de l’agriculture, de l’argent, des empires et de la science. Son récit avance une question qui revient d’un chapitre à l’autre, celle de ce que les humains gagnent et perdent en transformant leur monde.",
    "edition": {
      "kind": "ISBN numérique",
      "otherIsbn": "9782226257017 (papier)",
      "original": "2011",
      "sources": [],
      "year": "2 septembre 2015"
    }
  },
  "liv0014": {
    "unit": "Parties",
    "chapters": [
      {
        "title": "La chèvre et l’apprentissage de l’épargne",
        "summary": "Kaniama raconte comment sa mère a constitué une ressource familiale à partir de peu. La chèvre représente une richesse que l’on garde pour ce qu’elle pourra produire.",
        "page": 21
      },
      {
        "title": "Des paliers vers la prospérité",
        "summary": "L’auteur compare différentes manières d’utiliser un revenu. Il distingue la dépense immédiate, la mise de côté et la construction d’un fonds destiné à se développer.",
        "page": 41
      },
      {
        "title": "Construire un fonds",
        "summary": "Les exemples familiaux et les récits de l’auteur illustrent la décision de réserver régulièrement une part de ce que l’on gagne. La difficulté est de tenir cet engagement quand les besoins se multiplient.",
        "page": 61
      },
      {
        "title": "Maîtriser les dépenses",
        "summary": "Kaniama s’intéresse aux arbitrages de la vie courante. Il examine comment un achat peut retarder ou soutenir la constitution d’un capital.",
        "page": 99
      },
      {
        "title": "Faire grandir ce que l’on possède",
        "summary": "La descendance de la chèvre donne une image du réinvestissement. L’auteur s’en sert pour distinguer le fruit d’une ressource et la ressource qui continue de produire.",
        "page": 119
      },
      {
        "title": "Choisir des biens qui gardent une valeur",
        "summary": "Le chapitre aborde ce qu’il faut apprendre avant de décider où placer son argent. Kaniama insiste sur le rôle des connaissances acquises et des occasions que l’on sait reconnaître.",
        "page": 139
      },
      {
        "title": "Développer un jugement financier",
        "summary": "La dernière partie revient sur la consommation, la formation et les décisions répétées. Elle rassemble les enseignements que l’auteur tire de l’exemple familial.",
        "page": 169
      }
    ],
    "summary": "Ricardo Kaniama part d’un souvenir familial. Sa mère a fait grandir des ressources modestes grâce à une chèvre qu’elle a conservée pour ce qu’elle pouvait produire. Il reprend cette histoire pour parler d’épargne, de dépenses et de la manière de faire durer un capital.",
    "edition": {
      "kind": "ISBN de la deuxième édition",
      "sources": [
        {
          "label": "Google Livres · notice et ISBN",
          "url": "https://books.google.com/books/about/La_ch%C3%A8vre_de_ma_m%C3%A8re.html?id=o-kL0AEACAAJ"
        }
      ]
    }
  },
  "liv0015": {
    "unit": "Rubriques",
    "chapters": [
      {
        "title": "Le moment du choix",
        "summary": "Le guide part de l’inquiétude que peut susciter une orientation. Des regards de psychologues éclairent la place des goûts, du rythme de chacun et de la peur de se tromper.",
        "page": 7
      },
      {
        "title": "Des stratégies pour s’orienter",
        "summary": "Cette rubrique compare des parcours qui permettent de choisir tôt une spécialité et d’autres qui laissent du temps pour explorer plusieurs voies.",
        "page": 9
      },
      {
        "title": "Relier études et métiers",
        "summary": "Les auteurs présentent les types de formations et les niveaux de diplôme de l’édition 2015. On peut s’en servir pour comprendre la différence entre une voie courte, une spécialisation et un cursus long.",
        "page": 11
      },
      {
        "title": "Chercher selon ses envies",
        "summary": "Plusieurs entrées aident à chercher par goûts et par niveau d’études. Elles sont utiles lorsque l’on sait quel quotidien de travail on aimerait, sans encore connaître l’intitulé du poste.",
        "page": 18
      },
      {
        "title": "Organiser et manager",
        "summary": "Des fiches décrivent les métiers où l’on planifie, coordonne ou suit une activité. Le guide traverse autant la gestion et les ressources humaines que les secteurs industriels et culturels."
      },
      {
        "title": "Travailler sur le terrain",
        "summary": "Ce regroupement couvre notamment la construction, l’environnement, la sécurité et la logistique. Il aide à repérer les métiers dont une part importante s’exerce hors du bureau."
      },
      {
        "title": "Inventer et créer",
        "summary": "Le guide rapproche les métiers de l’image, de la scène, de la mode et de la communication. Il présente les compétences et les formations qui se cachent derrière des intitulés parfois proches."
      },
      {
        "title": "Travailler au contact des autres",
        "summary": "Les fiches couvrent le soin, l’enseignement, la vente, le tourisme et le social. Le lecteur peut comparer des façons très différentes d’accompagner, de conseiller ou d’accueillir."
      },
      {
        "title": "Passer par les index",
        "summary": "Les index permettent de revenir aux fiches par secteur ou par ordre alphabétique. Ils servent à retrouver rapidement un métier déjà repéré."
      }
    ],
    "summary": "La rédaction de L’Étudiant propose une façon de comparer les métiers à partir du quotidien de travail que l’on imagine. Les fiches donnent des repères sur les missions, les formations et les compétences. Les chiffres et les parcours de formation reflètent l’édition de 2015.",
    "edition": {
      "kind": "ISBN papier",
      "note": "12ᵉ édition, dépôt légal en mai 2015. Le guide est organisé par rubriques et contient des index.",
      "sources": [
        {
          "label": "Notice bibliographique · 12ᵉ édition",
          "url": "https://www.lafontaineauxlivres.fr/product/show/9782817604626/le-grand-livre-des-metiers"
        }
      ],
      "issn": "1262-327X"
    }
  },
  "liv0016": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Ce qui freine les premiers contacts",
        "summary": "Durkin revient sur les idées que les vendeurs se font de la prospection. Il explique comment une croyance sur le rejet peut empêcher d’utiliser une technique pourtant connue.",
        "page": 11
      },
      {
        "title": "Relier méthode et confiance",
        "summary": "Une méthode répétée peut rendre la prise de contact plus prévisible. Le chapitre montre comment les résultats obtenus en pratique modifient peu à peu les attentes.",
        "page": 21
      },
      {
        "title": "Définir le vrai travail de prospection",
        "summary": "L’auteur invite à regarder le métier du point de vue de l’ouverture de nouvelles relations. Il distingue l’entretien d’un réseau des tâches plus visibles de la vente.",
        "page": 25
      },
      {
        "title": "Adopter une posture d’entretien",
        "summary": "Durkin propose de poser des questions pour savoir si l’échange a du sens pour les deux personnes. Cette posture change le ton d’un contact pris uniquement pour obtenir un oui.",
        "page": 47
      },
      {
        "title": "Élargir la liste de contacts",
        "summary": "Le chapitre passe à la recherche de nouveaux interlocuteurs. Il décrit des situations où l’on peut initier un échange et garder une trace de la rencontre.",
        "page": 52
      },
      {
        "title": "Trouver une place pour les appels",
        "summary": "L’auteur examine les prétextes et les moments où l’on reporte une prise de contact. Il recommande de décider à l’avance du temps à y consacrer.",
        "page": 61
      },
      {
        "title": "Préparer ses mots",
        "summary": "Une trame permet de savoir comment ouvrir et orienter un appel. Durkin explique comment s’en servir sans réciter mécaniquement le même texte.",
        "page": 68
      },
      {
        "title": "Garder un ton assuré",
        "summary": "Le chapitre s’intéresse à l’énergie et au ton de la voix pendant un appel. La préparation et la pratique sont présentées comme des moyens de retrouver son élan.",
        "page": 73
      },
      {
        "title": "Savoir écouter au téléphone",
        "summary": "Pour établir un contact, Durkin propose d’écouter les indices sur la situation de l’autre et de reformuler au besoin. La qualité de la réponse dépend de ce que l’on a compris.",
        "page": 78
      },
      {
        "title": "Rendre la prospection régulière",
        "summary": "Le livre analyse l’écart entre une semaine très active et les périodes de creux. Il propose de mettre en place une routine que l’on peut maintenir.",
        "page": 88
      },
      {
        "title": "Suivre ce que l’on fait",
        "summary": "Le suivi des appels, des réponses et des rendez-vous donne une vue plus claire du travail. Il sert à repérer les étapes qui demandent un ajustement.",
        "page": 98
      },
      {
        "title": "Fixer un rendez-vous",
        "summary": "La dernière partie rassemble des manières de mener un appel à une proposition concrète. Elle aborde la formulation de l’invitation et la confirmation du rendez-vous.",
        "page": 105
      }
    ],
    "summary": "Michael J. Durkin suit le chemin entre un premier contact et un rendez-vous. Il commence par les idées qui rendent la prospection difficile, puis passe à la préparation des appels, à l’écoute et au suivi. Son objectif est d’en faire une activité que l’on peut organiser dans la durée.",
    "edition": {
      "kind": "ISBN papier",
      "note": "Copyright 2009–2010 dans le PDF. La notice de l’édition commerciale française indique 2012.",
      "sources": [
        {
          "label": "Mollat · notice et ISBN",
          "url": "https://www.mollat.com/livres/1333602/michael-j-durkin-doublez-vos-contacts-tout-ce-qu-un-reseauteur-doit-savoir-pour-creer-des-contacts-et-fixer-des-rendez-vous"
        }
      ],
      "original": "2005",
      "contributors": "Traduction française de Françoise Légaré."
    }
  },
  "liv0017": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Ce qu’on attend d’un leader",
        "summary": "Radon examine l’idée qu’un dirigeant pourrait, à lui seul, résoudre toutes les difficultés. Il pose la question des conditions dans lesquelles son influence peut vraiment s’exercer.",
        "page": 28
      },
      {
        "title": "Se construire un itinéraire",
        "summary": "Le chapitre aborde l’évolution vers des fonctions de direction. Il fait une place à l’expérience, aux occasions de se tester et aux apprentissages entre deux responsabilités.",
        "page": 34
      },
      {
        "title": "Exercer une influence individuelle",
        "summary": "La relation à une autre personne sert de point de départ. Radon s’intéresse à la façon dont une décision, une parole ou un entretien peuvent susciter l’engagement.",
        "page": 52
      },
      {
        "title": "Faire travailler le collectif",
        "summary": "La culture du « co » rassemble des pratiques de coopération et de construction partagée. Le chapitre examine ce qui change quand l’équipe participe à la recherche d’une réponse.",
        "page": 84
      },
      {
        "title": "Lire le contexte politique",
        "summary": "Le texte élargit l’analyse aux rapports de pouvoir et aux intérêts en présence. Un dirigeant doit comprendre les acteurs qui peuvent soutenir ou faire obstacle à une décision.",
        "page": 102
      },
      {
        "title": "Faire avancer un projet industriel",
        "summary": "Un cas de gestion industrielle illustre l’idée d’attracteur, un point de référence autour duquel un projet peut s’organiser. Le chapitre passe de la notion à une situation de travail.",
        "page": 128
      },
      {
        "title": "Donner une place à la création",
        "summary": "L’auteur explore ce qu’un responsable peut faire pour élargir le champ des réponses. L’expérimentation et les idées qui sortent du cadre y jouent un rôle.",
        "page": 136
      },
      {
        "title": "Revenir sur les situations étudiées",
        "summary": "Une pause rassemble les observations de la première partie. Elle aide à comparer les formes que prend le leadership selon les personnes, l’équipe et le contexte.",
        "page": 154
      },
      {
        "title": "Tenir un journal de bord",
        "summary": "Radon suggère de garder des traces de décisions et de situations vécues. Les relire permet de repérer ses réactions habituelles et de préparer un autre essai.",
        "page": 162
      },
      {
        "title": "Se préparer à un entretien",
        "summary": "Le chapitre examine les attentes d’un recruteur et la façon de présenter un parcours. Il invite à relier ce que l’on raconte à des exemples concrets.",
        "page": 168
      },
      {
        "title": "Relier stratégie et leadership",
        "summary": "La stratégie sert à donner une direction à l’action du responsable. Le chapitre montre pourquoi les décisions du quotidien gagnent à être lues à partir de cette direction.",
        "page": 172
      },
      {
        "title": "Reconnaître les limites des objectifs",
        "summary": "La fixation d’un objectif peut orienter l’effort. Radon discute les situations où cet outil atteint ses limites pour comprendre ou soutenir la motivation.",
        "page": 178
      },
      {
        "title": "Accompagner un leader",
        "summary": "Le chapitre aborde ce que peut apporter un coaching et la manière de travailler sur des situations concrètes. Il pose aussi des questions de cadre et de responsabilité.",
        "page": 190
      },
      {
        "title": "Utiliser l’image du sport",
        "summary": "Radon utilise le sport pour éclairer l’entraînement, la performance et la vie d’une équipe. L’analogie est un moyen de questionner les pratiques de direction.",
        "page": 208
      },
      {
        "title": "Prendre du recul sur les techniques psychologiques",
        "summary": "Le texte discute l’usage de techniques issues de la thérapie dans l’entreprise. Il questionne les frontières entre accompagnement professionnel et intervention personnelle.",
        "page": 214
      },
      {
        "title": "Choisir ses priorités",
        "summary": "Une priorité se construit en comparant les demandes et en réservant du temps aux plus importantes. Le chapitre s’intéresse à ce qui détourne le responsable de ce choix.",
        "page": 222
      },
      {
        "title": "Apprendre à refuser",
        "summary": "Dire non permet de poser des limites et de tenir ses engagements existants. Le chapitre met l’accent sur la manière d’expliquer son refus dans une relation de travail.",
        "page": 234
      },
      {
        "title": "Déléguer avec un cadre",
        "summary": "Le dernier chapitre s’intéresse à la tâche confiée, à l’autonomie laissée et au suivi. Radon aide à distinguer une délégation d’un simple transfert de charge.",
        "page": 242
      }
    ],
    "summary": "Bernard Radon examine ce qui change quand on avance vers une fonction de direction. Il passe de la relation individuelle à la coopération en équipe, puis aux décisions stratégiques. La seconde partie aborde des situations familières, comme déléguer, choisir ses priorités ou refuser une demande.",
    "edition": {
      "kind": "ISBN papier",
      "collection": "Stratégies et management",
      "sources": [
        {
          "label": "Hachette · notice Dunod",
          "url": "https://www.hachette.fr/livre/guide-du-leadership-progresser-vers-la-fonction-de-dirigeant-9782100507153/"
        }
      ],
      "pages": 264
    }
  },
  "liv0018": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Jouer un rôle et changer d’avis",
        "summary": "Jozef Nuttin étudie ce qui se passe quand une personne défend un point de vue qu’elle ne partage pas. Il compare les effets d’une mise en situation sur ce qu’elle dit et sur ses attitudes."
      },
      {
        "title": "Interpréter les situations sociales",
        "summary": "Serge Moscovici examine la manière dont on tire des conclusions sur les autres. Les émotions, le cadre et les informations disponibles orientent les explications de tous les jours."
      },
      {
        "title": "Lire le comportement dans son contexte",
        "summary": "Philip Zimbardo invite à regarder la situation, l’intrigue et les rôles dans lesquels les personnes agissent. Le comportement prend un autre sens quand on change ce cadre."
      },
      {
        "title": "L’équilibre dans les relations",
        "summary": "François Léonard présente le modèle de Heider. Il s’appuie sur des relations entre personnes et objets pour expliquer pourquoi certaines combinaisons nous paraissent plus cohérentes que d’autres."
      },
      {
        "title": "Majorités et minorités",
        "summary": "Moscovici et Ricateau distinguent la formation d’une norme, la conformité à un groupe et les changements que peut provoquer une minorité. Ils s’intéressent à la négociation qui accompagne ces influences."
      },
      {
        "title": "Attrait, rejet et justification",
        "summary": "Dana Bramel étudie le rôle de la ressemblance dans l’attirance. Le chapitre examine également les opinions qui peuvent servir à justifier un tort causé à autrui."
      },
      {
        "title": "Les règles du conflit",
        "summary": "Michel Plon compare des façons de modéliser les conflits et la coopération. Les jeux expérimentaux lui servent à explorer l’effet de l’image que l’on se fait de l’autre."
      },
      {
        "title": "Classer le monde social",
        "summary": "Henri Tajfel montre que les catégories aident à se repérer. Dans le monde social, elles prennent aussi une valeur et participent à la manière dont on définit son groupe et soi-même."
      },
      {
        "title": "Des idées que l’on construit ensemble",
        "summary": "Claudine Herzlich présente la notion de représentation sociale. Elle examine comment les conversations, les valeurs et les conduites donnent une forme commune à une idée."
      }
    ],
    "summary": "Neuf contributions étudient ce qui se passe quand les individus interprètent une situation, se regroupent ou s’influencent. Le volume relie des expériences à des concepts comme la conformité, la catégorisation et la représentation sociale. Chaque chapitre donne le point de vue de ses propres auteurs.",
    "edition": {
      "original": "1972",
      "pages": 325,
      "note": "Tome I, Les phénomènes de base. Édition Larousse de 1972. Numérisation de Diane Brunet, Les Classiques des sciences sociales, 2013.",
      "sources": [
        {
          "label": "UQAC · sommaire du tome",
          "url": "https://classiques.uqam.ca/contemporains/moscovici_serge/intro_psycho_soc_t1/intro_psycho_soc_t1_tdm.html"
        }
      ]
    }
  },
  "liv0019": {
    "unit": "Repères d’après le sommaire",
    "chapters": [
      {
        "title": "Au-delà de la compétence",
        "summary": "Les autrices posent la question de l’écart entre savoir faire quelque chose et oser le montrer. Ce premier chapitre s’intéresse à ses conséquences pour les femmes au travail."
      },
      {
        "title": "Passer à l’action",
        "summary": "Le sommaire annonce une réflexion sur l’hésitation avant de se lancer. La présentation de l’éditeur met en avant l’intérêt de prendre des risques mesurés."
      },
      {
        "title": "Ce qui prépare à l’assurance",
        "summary": "Le chapitre annoncé s’intéresse à la part des dispositions et du contexte dans la confiance. L’éditeur présente cette dernière comme une qualité qui peut se développer."
      },
      {
        "title": "Les obstacles liés au regard social",
        "summary": "Le livre examine les attentes qui pèsent sur les femmes quand elles s’affirment. Le sommaire situe cette question parmi les causes du doute."
      },
      {
        "title": "L’apprentissage dans la famille",
        "summary": "Cette partie annoncée s’intéresse à l’éducation. Elle interroge ce que les enfants apprennent en matière d’audace, de prudence et de réaction à l’erreur."
      },
      {
        "title": "Faire une place à l’échec",
        "summary": "Les autrices lient le développement de la confiance à la pratique. Le chapitre annoncé revient sur les habitudes qui aident à essayer, échouer et recommencer."
      },
      {
        "title": "Transmettre cette confiance",
        "summary": "Le sommaire annonce un passage des changements personnels à ce que l’on peut transmettre. Il invite à regarder comment son entourage peut à son tour être encouragé."
      },
      {
        "title": "Ce que disent les recherches et l’expérience",
        "summary": "Le dernier chapitre annoncé rapproche les résultats de recherche et les pratiques présentées au fil du livre. Il revient sur ce qui aide à transformer une intention en action."
      }
    ],
    "summary": "Katty Kay et Claire Shipman se demandent pourquoi des femmes compétentes peuvent hésiter à prendre la parole ou à se lancer. Elles mêlent récits, recherches et situations de travail pour explorer le rôle du contexte, de l’éducation et de l’expérience. L’extrait du site contient l’introduction et le sommaire.",
    "edition": {
      "kind": "ISBN Nouveaux Horizons",
      "otherIsbn": "9782357454439 (EPUB Nouveaux Horizons) · 9782813214614 (papier Guy Trédaniel)",
      "original": "2014",
      "contributors": "Traduction de Laurence Le Charpentier.",
      "note": "L’extrait de 23 pages contient le sommaire et l’introduction. Les repères s’appuient aussi sur la notice de l’éditeur.",
      "sources": [
        {
          "label": "Guy Trédaniel · édition française",
          "url": "https://www.editions-tredaniel.com/lart-de-la-confiance-en-soi-p-7313.html"
        },
        {
          "label": "HarperCollins · sommaire original",
          "url": "https://www.oreilly.com/library/view/the-confidence-code/9780062230645/Text/32019_TheConfidenceCode_TOC.xhtml"
        }
      ]
    }
  },
  "liv0020": {
    "unit": "Sections",
    "chapters": [
      {
        "title": "Le cadre des manipulations",
        "summary": "Le document introduit son vocabulaire et situe les appareils qu’il prend comme exemples. Il s’agit d’un guide ancien qui reflète les systèmes mobiles de son époque."
      },
      {
        "title": "Outils et différences entre marques",
        "summary": "Cette partie juxtapose des fonctions de localisation et des manipulations propres à plusieurs marques. Elle montre combien les possibilités changent selon l’appareil."
      },
      {
        "title": "Comprendre le root",
        "summary": "Le guide présente les privilèges supplémentaires que donne l’accès administrateur sur Android. Il cite des outils et des modèles datés, dans le cadre d’un aperçu des pratiques de l’époque."
      },
      {
        "title": "Les modes de maintenance",
        "summary": "L’auteur distingue les environnements de récupération et de maintenance d’Android et d’iOS. Ils servent à intervenir sur le système quand le démarrage habituel ne suffit pas."
      },
      {
        "title": "Des cas de déverrouillage",
        "summary": "Le guide compare des situations de blocage sur différents téléphones. Cette rubrique permet de situer les différences entre modèles, sans fournir ici de procédure de contournement."
      },
      {
        "title": "Le rôle d’une ROM",
        "summary": "Le document introduit les fichiers système utilisés pour restaurer ou modifier un téléphone. Il distingue la notion de ROM de l’opération qui l’installe."
      },
      {
        "title": "Exemples de restauration du système",
        "summary": "Deux exemples anciens illustrent le remplacement du système sur des appareils précis. Le chapitre montre le lien entre le modèle du téléphone et les fichiers qu’il utilise."
      }
    ],
    "summary": "Ce document signé Traumato présente le vocabulaire de la maintenance et de la personnalisation de téléphones. Il décrit les différences entre des modèles anciens et distingue plusieurs façons d’intervenir sur leur système. Il témoigne surtout des pratiques et des appareils de son époque.",
    "edition": {
      "note": "Version 1 signée Traumato. Métadonnées du fichier datées de décembre 2016. Date de parution et ISBN non établis.",
      "sources": []
    }
  },
  "liv0021": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Réagir à une faute",
        "summary": "Carnegie explique pourquoi une attaque personnelle pousse souvent l’autre à se justifier. Il propose d’essayer de comprendre ce qui a motivé son comportement.",
        "page": 22
      },
      {
        "title": "Exprimer une reconnaissance réelle",
        "summary": "L’auteur s’intéresse au besoin de se sentir apprécié. Il distingue un compliment fondé sur une observation d’une flatterie faite pour obtenir quelque chose.",
        "page": 39
      },
      {
        "title": "Partir de ce que veut l’autre",
        "summary": "Pour faire accepter une proposition, Carnegie invite à la présenter du point de vue de celui qui va décider. Cela oblige à regarder ce que l’échange peut lui apporter.",
        "page": 54
      },
      {
        "title": "S’intéresser à la personne",
        "summary": "L’intérêt que l’on montre pour les activités et les préoccupations de l’autre crée un terrain de rencontre. Le chapitre donne des exemples de cette attention.",
        "page": 76
      },
      {
        "title": "Accueillir avec chaleur",
        "summary": "Carnegie prend le sourire comme exemple d’un accueil qui peut rendre un premier échange plus facile. Il le rattache à la disposition avec laquelle on aborde les autres.",
        "page": 90
      },
      {
        "title": "Se souvenir d’un nom",
        "summary": "Retenir puis utiliser le nom d’une personne est une manière de montrer qu’on l’a remarquée. Le texte donne des exemples où ce détail change la relation.",
        "page": 99
      },
      {
        "title": "Faire de la place à l’écoute",
        "summary": "Une conversation peut laisser une bonne impression quand on pose des questions sincères et qu’on laisse l’autre aller au bout de son récit.",
        "page": 107
      },
      {
        "title": "Parler de ce qui l’intéresse",
        "summary": "Avant une rencontre, on peut se renseigner sur les sujets que l’autre connaît ou aime. L’auteur y voit un point de départ pour un échange plus vivant.",
        "page": 118
      },
      {
        "title": "Reconnaître l’importance de l’autre",
        "summary": "Le chapitre recommande d’exprimer de façon sincère ce que l’on apprécie chez une personne. Il passe du simple compliment à une attitude de respect.",
        "page": 123
      },
      {
        "title": "Éviter la dispute stérile",
        "summary": "Une dispute peut laisser chacun plus attaché à sa position. Carnegie invite à se demander si l’objectif est de gagner un débat ou de faire avancer la relation.",
        "page": 135
      },
      {
        "title": "Respecter un désaccord",
        "summary": "Dire brutalement à quelqu’un qu’il se trompe ferme souvent la conversation. Le chapitre propose d’examiner les faits en laissant à l’autre une place pour revenir sur son idée.",
        "page": 143
      },
      {
        "title": "Reconnaître sa propre erreur",
        "summary": "Carnegie raconte des situations où admettre une faute rapidement change le ton de l’échange. Ce geste réduit le besoin de se défendre.",
        "page": 154
      },
      {
        "title": "Ouvrir la discussion avec calme",
        "summary": "Un accueil amical facilite le dialogue quand les personnes sont déjà en désaccord. L’auteur fait de cette première impression une condition de la suite.",
        "page": 162
      },
      {
        "title": "Trouver des accords de départ",
        "summary": "Inspiré par les questions de Socrate, le chapitre invite à commencer par les points communs. On peut ensuite aborder le désaccord sur une base partagée.",
        "page": 172
      },
      {
        "title": "Laisser l’autre s’expliquer",
        "summary": "Plus la personne parle de sa situation, plus on a de chances de comprendre ses raisons. Carnegie conseille de résister à l’envie de répondre trop vite.",
        "page": 179
      },
      {
        "title": "Construire une idée ensemble",
        "summary": "Une personne peut s’engager davantage quand elle participe à une décision. L’auteur donne des exemples où le responsable laisse l’initiative à son interlocuteur.",
        "page": 185
      },
      {
        "title": "Adopter son point de vue",
        "summary": "Le chapitre recommande d’imaginer la situation telle que l’autre la voit. Cela aide à faire une proposition qui tient compte de ses contraintes.",
        "page": 191
      },
      {
        "title": "Accueillir ses émotions",
        "summary": "Reconnaître ce que l’autre souhaite ou ce qui l’inquiète peut apaiser l’échange. Le chapitre montre la différence entre entendre un sentiment et trancher le désaccord.",
        "page": 196
      },
      {
        "title": "Faire appel à un motif honorable",
        "summary": "Carnegie observe que beaucoup de personnes aiment se voir comme justes ou fiables. Il s’appuie sur cette image pour expliquer certaines formes d’appel à la coopération.",
        "page": 203
      },
      {
        "title": "Montrer une idée",
        "summary": "Au lieu de s’en tenir à une explication abstraite, le chapitre propose de donner à voir ce que l’on avance. Un exemple concret peut rendre une idée plus mémorable.",
        "page": 209
      },
      {
        "title": "Proposer un défi",
        "summary": "L’auteur décrit des situations où un objectif stimulant redonne de l’élan. Il relie cette motivation au goût de se dépasser.",
        "page": 214
      },
      {
        "title": "Commencer par une qualité réelle",
        "summary": "Pour aborder un point difficile, Carnegie conseille d’abord de reconnaître ce qui est bien fait. Cela donne un cadre plus favorable à la suite de la discussion.",
        "page": 218
      },
      {
        "title": "Signaler une erreur avec tact",
        "summary": "Une correction peut être formulée de manière à éviter l’humiliation. Le chapitre montre comment faire remarquer un problème sans transformer la remarque en attaque.",
        "page": 224
      },
      {
        "title": "Rappeler ses propres erreurs",
        "summary": "En parlant d’un échec qu’il a connu, le responsable diminue la distance avec son interlocuteur. La correction devient plus facile à entendre.",
        "page": 229
      },
      {
        "title": "Inviter plutôt que commander",
        "summary": "Une question donne à l’autre une possibilité de proposer sa façon de faire. L’auteur présente cette méthode comme une voie vers une coopération plus active.",
        "page": 234
      },
      {
        "title": "Préserver la dignité",
        "summary": "Le chapitre rappelle qu’une décision peut être annoncée sans exposer inutilement la personne. Il s’attache à ce qui reste de la relation après un échange délicat.",
        "page": 237
      },
      {
        "title": "Voir les premiers progrès",
        "summary": "Carnegie recommande de relever les améliorations, même modestes. Un retour précis aide à comprendre ce qu’il vaut la peine de répéter.",
        "page": 241
      },
      {
        "title": "Formuler une attente qui encourage",
        "summary": "Une attente positive peut donner envie à quelqu’un d’être à la hauteur. Le texte montre le rôle qu’une réputation favorable joue dans cette dynamique.",
        "page": 247
      },
      {
        "title": "Rendre l’amélioration accessible",
        "summary": "Le chapitre invite à présenter une erreur comme quelque chose que l’on peut corriger. Il montre comment un encouragement rend l’effort plus envisageable.",
        "page": 252
      },
      {
        "title": "Donner une raison de s’engager",
        "summary": "Le dernier chapitre revient sur la façon de présenter une tâche. Il propose de faire comprendre son intérêt à la personne à qui on la confie.",
        "page": 257
      }
    ],
    "summary": "Dale Carnegie rassemble des situations de conversation, de désaccord et de travail pour montrer comment améliorer ses relations. Il revient sur l’attention accordée aux autres, la manière de donner un retour et le besoin de garder sa dignité. Les exemples aident à voir comment une même idée s’applique à des contextes différents.",
    "edition": {
      "original": "1936",
      "year": "",
      "note": "Le PDF reproduit une version française révisée avec une préface de Dorothy Carnegie. Son tirage exact reste à identifier.",
      "otherIsbn": "9782253238713 (autre édition, Le Livre de Poche, 2023)",
      "sources": [
        {
          "label": "Hachette · notice de l’édition de 2023",
          "url": "https://www.hachette.fr/livre/comment-se-faire-des-amis-nouvelle-edition-9782253238713/"
        }
      ]
    }
  },
  "liv0022": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Reconnaître les grandes familles",
        "summary": "Le guide introduit le vocabulaire des logiciels malveillants et retrace les premiers exemples. Il explique pourquoi le mot « virus » est souvent employé dans un sens plus large.",
        "page": 8
      },
      {
        "title": "Suivre la propagation",
        "summary": "Le chapitre décrit les chemins qui permettent à un fichier ou à un programme malveillant d’atteindre une machine. Il aborde aussi les techniques de dissimulation à un niveau général.",
        "page": 13
      },
      {
        "title": "Mesurer les effets",
        "summary": "Des fichiers personnels aux infrastructures collectives, le chapitre suit les conséquences d’une infection. Il distingue le dommage immédiat, les pertes de données et le coût de la remise en état.",
        "page": 19
      },
      {
        "title": "Comprendre des cas connus",
        "summary": "Le guide s’appuie sur Morris, ILOVEYOU, Stuxnet, WannaCry et Zeus pour comparer des programmes aux cibles et aux effets très différents.",
        "page": 25
      },
      {
        "title": "Se protéger au quotidien",
        "summary": "L’auteur aborde les outils de protection, les sauvegardes, les mises à jour et la sensibilisation. Le chapitre rassemble des mesures qui se complètent.",
        "page": 33
      },
      {
        "title": "Responsabilités et questions éthiques",
        "summary": "Le guide pose la question du dommage et de la responsabilité des utilisateurs et des développeurs. Il évoque également la dimension juridique des attaques.",
        "page": 41
      },
      {
        "title": "Les évolutions à surveiller",
        "summary": "Le chapitre présente des tendances observées au moment de la rédaction du guide. Il demande comment la protection peut s’adapter quand les pratiques et les appareils changent.",
        "page": 46
      },
      {
        "title": "Résumer la prévention",
        "summary": "La conclusion réunit les conseils du guide et insiste sur la vigilance, l’apprentissage et la préparation. Elle présente la sécurité comme une démarche à entretenir dans le temps.",
        "page": 54
      }
    ],
    "summary": "Ce guide présente plusieurs familles de logiciels malveillants et les effets qu’ils peuvent avoir sur les personnes et les organisations. Des cas connus rendent les différences plus concrètes. Les derniers chapitres reviennent sur la prévention, les responsabilités et les évolutions observées lors de la rédaction.",
    "edition": {
      "note": "Guide pratique daté de 2023 dans le document. Préface signée Serge Stéphane Meye-Ba-Ntyam.",
      "sources": []
    }
  },
  "liv0023": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Intelligence et adaptation",
        "summary": "Piaget présente l’intelligence comme une forme d’adaptation. Il examine comment nous appliquons des façons de penser déjà acquises et comment nous les modifions devant une situation nouvelle.",
        "page": 24
      },
      {
        "title": "Les opérations logiques",
        "summary": "Le chapitre distingue une opération mentale d’une simple association d’idées. Il explique comment plusieurs actions de pensée se coordonnent et peuvent être inversées.",
        "page": 37
      },
      {
        "title": "De la perception à l’intelligence",
        "summary": "Piaget compare ce que la perception saisit d’un seul coup et ce que le raisonnement peut reconstruire. Il discute notamment la stabilité des formes et des grandeurs.",
        "page": 66
      },
      {
        "title": "Habitude et action",
        "summary": "Chez le jeune enfant, les habitudes motrices sont un point de départ. Piaget examine comment elles deviennent des actions organisées pour atteindre un but.",
        "page": 95
      },
      {
        "title": "La construction de la pensée",
        "summary": "Le livre suit le passage d’une pensée intuitive aux opérations sur des objets et, plus tard, aux raisonnements sur des hypothèses. Il observe ce que chacune de ces étapes permet de faire.",
        "page": 122
      },
      {
        "title": "L’effet du milieu social",
        "summary": "Piaget examine la part du langage, des échanges et de la coopération dans la pensée. Il les relie au niveau de développement qui permet à l’enfant de s’en servir.",
        "page": 153
      }
    ],
    "summary": "Jean Piaget explique comment l’intelligence se construit à partir de l’action et se transforme à mesure que l’enfant coordonne ses raisonnements. Il compare la perception, les habitudes et les opérations logiques. Le dernier chapitre examine la place des échanges sociaux dans ce développement.",
    "edition": {
      "kind": "ISBN de la réédition",
      "original": "1947",
      "contributors": "Préface d’Olivier Houdé.",
      "sources": []
    }
  },
  "liv0024": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Le fonctionnement du cerveau selon l’autrice",
        "summary": "Bogdanov présente sa manière d’expliquer les réactions automatiques et les habitudes de pensée. Le chapitre pose le cadre de développement personnel utilisé dans les exercices.",
        "page": 16
      },
      {
        "title": "Orienter son attention",
        "summary": "L’autrice propose des images et de petites expériences pour montrer ce qui devient visible quand on dirige son attention autrement. Elle rattache cette observation à la définition d’un but.",
        "page": 38
      },
      {
        "title": "L’effet des croyances",
        "summary": "Le chapitre examine les phrases que l’on tient pour acquises sur soi ou sur ses possibilités. Bogdanov propose de reconnaître celles qui influencent les décisions quotidiennes.",
        "page": 44
      },
      {
        "title": "Mettre une croyance à l’épreuve",
        "summary": "L’autrice revient sur plusieurs exercices pour regarder autrement une conviction limitante. Elle raconte aussi une expérience qui lui fait questionner des méthodes trop brutales.",
        "page": 82
      },
      {
        "title": "S’entraîner à changer de réponse",
        "summary": "La dernière partie compare le changement d’habitude à l’apprentissage d’un nouvel itinéraire. Elle insiste sur la répétition et sur la difficulté de maintenir ce changement dans les situations familières.",
        "page": 100
      }
    ],
    "summary": "Slavica Bogdanov s’intéresse aux croyances que l’on répète sur soi et à la place qu’elles prennent dans les décisions. Elle propose de les repérer, d’essayer une autre manière de penser et de l’exercer dans la durée. Le livre présente l’approche de développement personnel de l’autrice.",
    "edition": {
      "year": "",
      "note": "Copyright 2012 dans le PDF. Les numéros imprimés dans le fichier sont incomplets. La notice du broché indique 2013.",
      "otherIsbn": "9781490590813 (broché CreateSpace, 2013)",
      "sources": [
        {
          "label": "Notice du broché CreateSpace",
          "url": "https://www.chasse-aux-livres.fr/prix/1490590811/reprogrammez-votre-cerveau-pour-le-succes-slavica-bogdanov-9781490590813"
        }
      ]
    }
  },
  "liv0001": {
    "unit": "Stratagèmes",
    "chapters": [
      {
        "title": "Élargir une affirmation",
        "summary": "On prête à l’adversaire une thèse plus vaste que celle qu’il a défendue. Une fois étendue à des cas où elle tient moins bien, elle devient plus facile à attaquer."
      },
      {
        "title": "Jouer sur deux sens d’un mot",
        "summary": "Un même mot peut désigner deux choses. Le procédé consiste à déplacer discrètement la discussion de l’un de ces sens vers l’autre."
      },
      {
        "title": "Changer une affirmation relative en règle absolue",
        "summary": "Un propos valable dans un contexte précis est traité comme s’il prétendait s’appliquer partout. On peut alors opposer un exemple qui sort du contexte initial."
      },
      {
        "title": "Faire admettre les étapes séparément",
        "summary": "On obtient l’accord sur plusieurs éléments avant de dévoiler la conclusion à laquelle ils conduisent. Le lien entre les questions reste caché pendant l’échange."
      },
      {
        "title": "Partir des croyances de l’autre",
        "summary": "On se sert d’une prémisse acceptée par l’adversaire pour lui opposer une conclusion. Sa force dans le débat vient de cet accord, même si la prémisse pose problème."
      },
      {
        "title": "Glisser ce qui reste à prouver",
        "summary": "On fait passer l’affirmation à démontrer pour une idée déjà admise, par exemple en l’introduisant sous une autre expression."
      },
      {
        "title": "Guider l’accord par des questions",
        "summary": "Une suite de questions amène l’autre à reconnaître certains points. Le procédé consiste à tirer rapidement une conclusion de ces réponses."
      },
      {
        "title": "Provoquer l’irritation",
        "summary": "L’agacement rend plus difficile l’attention aux détails du raisonnement. Le procédé exploite cette baisse de vigilance."
      },
      {
        "title": "Déplacer l’ordre des questions",
        "summary": "On change la succession des questions pour masquer la direction du raisonnement. L’adversaire devine moins bien la conclusion qu’on prépare."
      },
      {
        "title": "Utiliser le refus d’un contraire",
        "summary": "Face à quelqu’un qui refuse systématiquement les propositions, on peut lui présenter la position contraire. Sa réponse peut alors faire avancer la thèse voulue."
      },
      {
        "title": "Passer des exemples à une règle",
        "summary": "Après plusieurs accords sur des cas particuliers, on énonce la règle générale comme acquise. Le passage entre les deux demande pourtant une justification."
      },
      {
        "title": "Choisir des mots qui orientent",
        "summary": "Le nom donné à une idée peut la faire paraître raisonnable ou choquante avant l’examen des arguments. L’auteur attire l’attention sur cette part du vocabulaire."
      },
      {
        "title": "Rendre le contraire difficile à défendre",
        "summary": "On place sa thèse à côté d’une version particulièrement repoussante de la position opposée. Le choix paraît alors plus simple qu’il ne l’est."
      },
      {
        "title": "Déclarer la victoire",
        "summary": "On annonce avec assurance qu’une conclusion est établie alors que les réponses recueillies ne la démontrent pas. Le ton peut masquer la faiblesse du résultat."
      },
      {
        "title": "Se ménager une issue",
        "summary": "On soumet une proposition que l’autre peut difficilement trancher sur le moment. L’acceptation ou le refus peuvent ensuite être présentés comme favorables."
      },
      {
        "title": "Chercher une contradiction chez l’autre",
        "summary": "On compare la thèse avec des propos ou des engagements que l’adversaire a déjà défendus. La contradiction touche sa cohérence dans le débat."
      },
      {
        "title": "Introduire une distinction",
        "summary": "Quand une objection paraît forte, une différence de sens ou de situation peut rouvrir le raisonnement. Le procédé consiste à chercher une séparation que l’objection avait laissée de côté."
      },
      {
        "title": "Interrompre une démonstration gênante",
        "summary": "Quand l’autre approche d’une conclusion difficile à réfuter, on modifie la direction de la conversation. L’argument initial reste sans réponse."
      },
      {
        "title": "Prendre de la hauteur pour esquiver un détail",
        "summary": "On abandonne le point concret sur lequel on manque de réponse et l’on se rabat sur une affirmation générale. La question précise peut passer au second plan."
      },
      {
        "title": "Conclure avant d’avoir tous les accords",
        "summary": "On tire une conclusion de réponses déjà données sans demander si les éléments restants sont acceptés. La rapidité rend le saut plus difficile à relever."
      },
      {
        "title": "Répliquer sur le même terrain",
        "summary": "Face à un procédé douteux, on en emploie un autre pour y répondre. Schopenhauer oppose ici l’efficacité immédiate à la discussion de fond."
      },
      {
        "title": "Accuser l’autre de supposer la conclusion",
        "summary": "Une demande de reconnaître un point peut être présentée comme une pétition de principe. Le procédé peut aussi servir à refuser une prémisse qui serait pourtant recevable."
      },
      {
        "title": "Pousser l’autre à l’excès",
        "summary": "La contradiction répétée peut conduire une personne à durcir ce qu’elle disait. On critique alors sa formulation excessive."
      },
      {
        "title": "Prêter des conséquences indues",
        "summary": "On rattache à une thèse des effets qu’elle n’implique pas. Ces conséquences peuvent faire paraître la thèse absurde ou dangereuse."
      },
      {
        "title": "Présenter un contre-exemple",
        "summary": "Un seul cas contraire peut suffire face à une affirmation universelle. Encore faut-il que ce cas appartienne bien à l’ensemble discuté."
      },
      {
        "title": "Retourner le raisonnement",
        "summary": "On reprend l’argument de l’adversaire pour montrer qu’il soutient aussi la réponse qu’il voulait écarter."
      },
      {
        "title": "Repérer un point qui fâche",
        "summary": "Une réaction de colère peut signaler une difficulté pour l’autre. Le débatteur insiste alors sur ce point, que la colère prouve ou non une faiblesse."
      },
      {
        "title": "Parler au public",
        "summary": "On formule une objection qui paraît convaincante aux personnes présentes. Une réponse exacte peut être trop technique pour produire le même effet sur le moment."
      },
      {
        "title": "Changer de sujet au dernier moment",
        "summary": "Une diversion éloigne l’échange de la difficulté en cours. Le nouveau sujet peut avoir un lien très mince avec la question posée."
      },
      {
        "title": "Invoquer une autorité",
        "summary": "Le poids d’un nom ou d’une opinion reconnue peut tenir lieu de preuve dans le débat. L’effet dépend de ce que le public respecte déjà."
      },
      {
        "title": "Afficher son incompréhension",
        "summary": "Un débatteur déclare que les propos de l’autre lui paraissent inintelligibles. Dans certains contextes, cela met en cause l’argument sans l’examiner."
      },
      {
        "title": "Associer l’idée à une catégorie mal vue",
        "summary": "On rattache l’argument à une doctrine ou à une étiquette que l’auditoire rejette. Le jugement porté sur la catégorie se reporte alors sur l’idée."
      },
      {
        "title": "Opposer la théorie à l’usage",
        "summary": "On reconnaît la cohérence apparente d’une proposition avant de la rejeter au nom de la pratique. Le procédé évite de nommer les conditions qui poseraient problème."
      },
      {
        "title": "Insister sur ce qui est éludé",
        "summary": "Lorsqu’une question reçoit une réponse détournée, on revient au point précis. Le détour indique au débatteur une difficulté possible à explorer."
      },
      {
        "title": "Faire intervenir les intérêts",
        "summary": "On montre à une personne ou au public ce que la position adverse pourrait lui coûter. Le changement d’intérêt peut peser plus que l’examen du raisonnement."
      },
      {
        "title": "Impressionner avec des paroles obscures",
        "summary": "Un discours confus mais solennel peut donner une impression de profondeur. Schopenhauer décrit la difficulté de contester un propos que l’on ne peut pas reformuler."
      },
      {
        "title": "Profiter d’une mauvaise preuve",
        "summary": "On réfute l’argument que l’autre a choisi et l’on présente la thèse elle-même comme réfutée. Or elle pourrait reposer sur un autre argument."
      },
      {
        "title": "S’en prendre à la personne",
        "summary": "Quand le débatteur ne trouve plus de réponse, il peut attaquer ou insulter son adversaire. Le procédé remplace l’examen des idées par le conflit."
      }
    ],
    "summary": "Schopenhauer démonte trente-huit manières de prendre le dessus dans une controverse. Il montre comment un mot ambigu, un contre-exemple mal choisi ou une attaque personnelle peuvent détourner le débat. L’essai aide à repérer le moment où l’envie d’avoir raison prend le pas sur l’examen des arguments.",
    "edition": {
      "publisher": "Mille et une nuits",
      "year": "15 septembre 2021",
      "isbn": "9782755507744",
      "kind": "ISBN de l’édition de référence",
      "original": "1864",
      "note": "Édition de référence publiée par Mille et une nuits. Les repères suivent l’ordre des 38 stratagèmes.",
      "sources": [
        {
          "label": "Fayard · édition de référence",
          "url": "https://www.fayard.fr/livre/lart-davoir-toujours-raison-9782755507744/"
        },
        {
          "label": "Wikisource · texte et ordre des stratagèmes",
          "url": "https://fr.wikisource.org/wiki/L%27Art_d%27avoir_toujours_raison"
        }
      ],
      "pages": 96,
      "contributors": "Traduction de Dominique Laure Miermont. Postface de Didier Raymond.",
      "otherIsbn": "9782755507980 (numérique)"
    }
  },
  "liv0002": {
    "unit": "Repères d’après le sommaire",
    "chapters": [
      {
        "title": "Du nez aux circuits du cerveau",
        "summary": "Les auteurs suivent le parcours d’une odeur jusqu’aux structures cérébrales qui l’interprètent. Ils expliquent aussi pourquoi sentir une odeur et percevoir l’arôme d’un aliment se recoupent."
      },
      {
        "title": "Pourquoi une odeur n’a pas la même valeur pour tous",
        "summary": "L’expérience, l’âge et la culture contribuent aux différences de perception. Le chapitre interroge ce qui est partagé et ce qui se construit au fil de la vie."
      },
      {
        "title": "Ce qui arrive quand l’odorat change",
        "summary": "Les auteurs distinguent des façons de perdre, d’affaiblir ou de déformer les sensations olfactives. Ils décrivent le retentissement de ces changements sur les repas et le quotidien."
      },
      {
        "title": "La perte d’odorat après une infection",
        "summary": "Cette édition fait une place aux déficits liés aux infections, en particulier à la Covid-19. Les auteurs présentent le sujet à partir des connaissances disponibles au moment de la parution."
      }
    ],
    "summary": "Pourquoi l’odeur d’un plat ravive-t-elle un souvenir, alors qu’une autre personne la remarque à peine ? Bensafi et Rouby expliquent le trajet d’une odeur entre le nez et le cerveau, puis examinent la diversité des perceptions. L’édition révisée réserve une place aux pertes d’odorat et à celles qui suivent une infection.",
    "edition": {
      "publisher": "EDP Sciences",
      "year": "2021",
      "isbn": "9782759826384",
      "kind": "ISBN papier",
      "pages": 152,
      "collection": "Mes cerveaux et moi",
      "note": "Édition révisée de 2021. Les repères s’appuient sur le sommaire et la présentation de cette édition.",
      "sources": [
        {
          "label": "INRAE · notice de l’édition papier",
          "url": "https://belinrae.inrae.fr/index.php?id=270687&lvl=notice_display"
        },
        {
          "label": "EDP Sciences · édition numérique",
          "url": "https://laboutique.edpsciences.fr/produit/1194/9782759826391/cerveau-et-odorat"
        },
        {
          "label": "EDP Sciences · extrait et sommaire",
          "url": "https://media.electre-ng.com/extraits/extrait-id/1261ec8a7b90c21b302656f1b0cd81807df2d6843283ef3c213f2aee987c901f.pdf"
        }
      ],
      "otherIsbn": "9782759826391 (numérique)"
    }
  },
  "liv0004": {
    "unit": "Repères d’après le sommaire",
    "chapters": [
      {
        "title": "Le point de départ de la psychologie positive",
        "summary": "Les autrices introduisent le courant et sa manière d’étudier ce qui aide une personne à se sentir bien. Elles ouvrent une discussion sur le rôle des émotions et des habitudes."
      },
      {
        "title": "Bien-être et santé",
        "summary": "Ce chapitre examine les liens que le guide fait entre l’état d’esprit, l’équilibre de vie et la santé. Il pose des questions que les exercices du livre reprennent ensuite."
      },
      {
        "title": "Relire le passé",
        "summary": "Le lecteur est invité à regarder ses souvenirs et la façon dont il les interprète. Le chapitre ouvre une place à l’acceptation et à ce que l’on peut apprendre d’un événement."
      },
      {
        "title": "Prêter attention au présent",
        "summary": "Cette partie s’intéresse aux moments ordinaires que l’on traverse sans y prêter attention. Elle propose de remarquer davantage ce qui se passe sur le moment."
      },
      {
        "title": "Se représenter l’avenir",
        "summary": "Les autrices mettent en relation l’espoir, les objectifs et la manière dont on imagine la suite. Le chapitre invite à penser à ce que l’on peut réellement faire aujourd’hui."
      },
      {
        "title": "Retrouver du plaisir",
        "summary": "Le guide examine les activités agréables et les occasions de les intégrer au quotidien. L’intérêt porte aussi sur la façon de mieux les apprécier."
      },
      {
        "title": "Repérer ses points forts",
        "summary": "Cette partie porte sur les forces de caractère. Elle propose de les observer dans des situations vécues et de chercher de nouveaux endroits où les exercer."
      },
      {
        "title": "Donner du sens à ses choix",
        "summary": "Le chapitre aborde les valeurs et ce qui rend un engagement important à ses propres yeux. Il aide à distinguer une activité plaisante d’une action qui compte sur la durée."
      },
      {
        "title": "S’engager dans une activité",
        "summary": "Le guide examine la sensation d’être absorbé par une tâche à la hauteur de ses capacités. Il invite à chercher les conditions qui rendent cet engagement possible."
      },
      {
        "title": "Prendre soin de sa santé",
        "summary": "Le chapitre aborde les habitudes de vie et la manière de faire face aux difficultés. Il présente les pistes de l’ouvrage pour prendre soin de soi dans la durée."
      },
      {
        "title": "Entretenir ses relations",
        "summary": "Le sommaire fait place aux relations proches, au couple et aux amitiés. Le chapitre s’intéresse à ce que l’on peut faire pour renforcer des liens qui existent déjà."
      },
      {
        "title": "Cultiver le bien-être en famille",
        "summary": "Les autrices se tournent vers la relation avec les enfants. Elles abordent la manière d’encourager les efforts et d’installer des moments agréables dans la vie familiale."
      },
      {
        "title": "Composer avec une famille élargie",
        "summary": "Cette partie regarde au-delà du foyer. Elle porte sur les relations avec la famille et les équilibres qui se négocient dans les moments partagés."
      },
      {
        "title": "Comprendre ce que le travail représente",
        "summary": "Le chapitre distingue plusieurs façons de vivre son activité professionnelle. Il pose la question du rôle du travail dans la satisfaction générale."
      },
      {
        "title": "Appliquer les idées au travail",
        "summary": "Le guide transporte ses exercices dans la vie professionnelle. Il s’intéresse à la façon d’utiliser ses forces et de construire des relations dans ce cadre."
      },
      {
        "title": "Essayer des activités concrètes",
        "summary": "Cette liste propose de mettre en pratique plusieurs idées abordées auparavant. Les exercices servent à observer ce qui a un effet dans sa propre vie."
      },
      {
        "title": "Trouver d’autres ressources",
        "summary": "Le chapitre oriente vers des livres et des ressources pour poursuivre. Il permet de choisir un sujet à approfondir après le guide."
      },
      {
        "title": "Regarder d’autres parcours",
        "summary": "Le livre se termine sur des sources d’inspiration. Elles donnent d’autres manières de réfléchir au bien-être, à l’engagement et à la réalisation de soi."
      }
    ],
    "summary": "Ce guide explique comment les auteurs de la psychologie positive abordent le bien-être. Il propose des exercices pour repenser ses souvenirs, remarquer ses forces ou trouver ce qui donne du sens à ses activités. Les derniers chapitres appliquent ces idées à la famille, aux relations et au travail.",
    "edition": {
      "publisher": "First",
      "year": "2010",
      "isbn": "9782754018210",
      "kind": "ISBN papier",
      "otherIsbn": "9782754021005 (numérique)",
      "pages": 336,
      "original": "2009",
      "collection": "Pour les Nuls",
      "contributors": "Traduction de Danièle Robert.",
      "note": "Les repères par chapitre sont établis à partir du sommaire détaillé de l’extrait éditorial.",
      "sources": [
        {
          "label": "First · copyright et sommaire",
          "url": "https://storage.googleapis.com/hub-media-eden-prod-northamerica/3f/2ba7e1b920bf417cbebf8150dac344c55e6a8d.pdf"
        },
        {
          "label": "Médiathèques de La Rochelle · notice",
          "url": "https://mediatheques.agglo-larochelle.fr/doc/SYRACUSE/1893300/la-pensee-positive-pour-les-nuls-averil-leimon-gladeana-mcmahon"
        }
      ]
    }
  },
  "liv0005": {
    "unit": "Chapitres",
    "chapters": [
      {
        "title": "Les bases d’un projet utile",
        "summary": "Rochat présente le développement comme une responsabilité humaine et collective. Son approche associe activité économique, valeurs et références bibliques."
      },
      {
        "title": "L’attitude de l’entrepreneur",
        "summary": "Le chapitre s’intéresse à la manière de prendre une initiative, de reconnaître une occasion et d’apprendre d’une situation. Il présente la préparation comme un travail à part entière."
      },
      {
        "title": "D’où vient la valeur créée",
        "summary": "L’auteur met en relation les outils, les compétences et le travail nécessaire à une production. Il montre comment leur combinaison change ce qu’une équipe peut réaliser."
      },
      {
        "title": "Construire le projet",
        "summary": "Le chapitre part d’un besoin, puis passe à l’étude du marché et aux décisions sur le lieu, le statut et l’équipe. Il donne un ordre pour passer d’une idée à une organisation."
      },
      {
        "title": "Préparer les finances",
        "summary": "Rochat distingue le budget de départ, les ressources qui permettent de le financer et les décisions sur l’investissement. Il s’appuie sur des situations chiffrées."
      },
      {
        "title": "Faire vivre l’entreprise",
        "summary": "Les clients, la comptabilité, le personnel et le temps de travail font partie des responsabilités abordées. Le chapitre relie la gestion quotidienne aux décisions initiales."
      },
      {
        "title": "Se servir des modèles",
        "summary": "La dernière partie rassemble des documents pratiques à adapter. Ils aident à préparer des décisions, à formaliser les démarches et à garder des traces du fonctionnement."
      }
    ],
    "summary": "Rochat suit la création d’une entreprise depuis le besoin à satisfaire jusqu’à la gestion des premières activités. Les exemples de budget, de financement et de suivi complètent une réflexion sur les compétences et le travail. L’auteur inscrit sa démarche dans une perspective chrétienne.",
    "edition": {
      "publisher": "Entraid",
      "year": "2015",
      "isbn": "9782970068532",
      "kind": "ISBN papier",
      "note": "Première édition de janvier 2015, d’après les mentions légales.",
      "sources": [
        {
          "label": "Maison de la Bible · notice",
          "url": "https://maisonbible.fr/fr/8910-aide-conseils-creer-et-gerer-une-entreprise-9782970068532.html"
        },
        {
          "label": "Entraid · mentions légales et sommaire",
          "url": "https://shekina.s3.amazonaws.com/uploads/book/book/4/Aide-Entreprise_F98.pdf"
        }
      ]
    }
  },
  "demo-carnet": {
    "unit": "Passage",
    "chapters": [
      {
        "title": "Une phrase à garder",
        "summary": "Le personnage reprend une phrase qui l’a arrêté et hésite à la noter. Ce geste ordinaire ouvre une réflexion sur ce qu’une lecture laisse après la page."
      }
    ],
    "summary": "Un personnage relit une phrase et hésite à la déposer dans son carnet. Ce texte court permet d’essayer la lecture annotée et de voir ce que l’on souhaite garder d’un passage.",
    "edition": {
      "publisher": "Entre les lignes",
      "note": "Texte d’exercice du site.",
      "kind": "ISBN",
      "isbn": "Sans objet",
      "sources": []
    }
  }
};

function bookPassport(book, meta, guide) {
  const edition = {...guide?.edition, ...(typeof book.edition === 'object' ? book.edition : {})};
  const isbn = edition.isbn ?? meta.isbn;
  const facts = [
    ['Auteur', book.edition && typeof book.edition==='object' ? book.author : edition.author || book.author, 'auteur'],
    ['Genre', GENRES[book.genre]?.[0], 'genre'],
    ['Sous-genre', GENRES[book.genre]?.[1][book.sub], 'rayon'],
    ['Éditeur', (edition.publisher ?? meta.publisher) || 'Non renseigné', 'maison'],
    ['Parution de l’édition', (edition.year ?? meta.year) || 'Non établie', 'date'],
    ['Première parution', edition.original, 'originale'],
    [edition.kind || 'ISBN', isbn || 'Non confirmé', 'isbn'],
    ['Autres ISBN', edition.otherIsbn, 'autre-isbn'],
    ['ISSN', edition.issn, 'issn'],
    ['Langue de l’édition', edition.language ?? (guide ? 'Français' : ''), 'langue'],
    ['Collection', edition.collection, 'collection'],
    ['Pagination imprimée', edition.pages && edition.pages + ' pages', 'pagination'],
    ['Fichier du site', meta.pdfPages ? (book.id === 'liv0019' ? 'Extrait PDF · ' : 'PDF · ') + meta.pdfPages + ' pages' : book.text ? 'Texte en ligne' : 'Notice du catalogue', 'pages']
  ];
  const notes = [edition.note ?? (typeof meta.edition === 'string' ? meta.edition : ''), edition.contributors ?? meta.contributors].filter(Boolean);
  return `<section class="book-passport book-passport-lilas" aria-labelledby="book-passport-title">
    <div class="passport-heading">
      <img src="${esc(assetHref('images/objets/medaillon.svg'))}" alt="">
      <h2 id="book-passport-title">Carte d’identité</h2>
    </div>
    <dl class="passport-facts">${facts.filter(([,value]) => value).map(([label,value,kind]) => `
      <div class="passport-fact passport-${kind}"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
    ${notes.length ? `<div class="passport-notes">${notes.map(note=>`<p>${esc(note)}</p>`).join('')}</div>` : ''}
  </section>`;
}

function bookGuideMarkup(book, guide) {
  const summary = Array.isArray(book.chapters) ? book.summary : book.summary && book.id !== 'demo-carnet' ? book.summary : guide?.summary || book.presentation;
  const chapters = book.chapters ?? guide?.chapters ?? [];
  const unit = book.chapterUnit || guide?.unit || 'Chapitres';
  const chapterTitle = unit === 'Chapitres' ? 'Chapitre par chapitre' : unit;
  const entries = chapters.map(({title, page, summary}, index) => `
    <li class="book-chapter">
      <details>
        <summary><span class="book-chapter-index">${String(index + 1).padStart(2,'0')}</span>
          <strong>${esc(title)}</strong>${page ? `<span class="book-chapter-page">PDF p. ${page}</span>` : ''}</summary>
        <div class="book-chapter-text"><p>${esc(summary)}</p>
        ${page && book.pdfPath ? `<a href="${esc(siteHref('lire.html?id=' + encodeURIComponent(book.id) + '&pdfpage=' + page + '#reader-content'))}">Lire à cette page ↗</a>` : ''}</div>
      </details>
    </li>`).join('');
  return `<section class="book-guides" aria-label="Résumés du livre">
    <details class="book-guide book-guide-overview">
      <summary class="book-guide-tab">
        <img src="${esc(assetHref('images/objets/livre-ouvert.svg'))}" alt="">
        <span><strong>Résumé du livre</strong><small>L’essentiel en quelques lignes</small></span>
        <span class="book-guide-arrow" aria-hidden="true">↓</span>
      </summary>
      <div class="book-guide-content"><p>${esc(summary || 'Résumé à compléter.')}</p></div>
    </details>
    <details class="book-guide book-guide-chapters">
      <summary class="book-guide-tab">
        <img src="${esc(assetHref('images/objets/fiches.svg'))}" alt="">
        <span><strong>${esc(chapterTitle)}</strong><small>${chapters.length ? chapters.length + ' ' + (chapters.length === 1 ? 'entrée' : 'entrées') : 'Chapitres de l’ouvrage'}</small></span>
        <span class="book-guide-arrow" aria-hidden="true">↓</span>
      </summary>
      <div class="book-guide-content">
${unit === 'Repères d’après le sommaire' ? '<p class="book-chapter-context">Repères rédigés d’après le sommaire et la présentation de l’éditeur.</p>' : ''}
        ${entries ? '<ol class="book-chapter-list">' + entries + '</ol>' : '<p>Les chapitres de cette fiche restent à documenter.</p>'}
      </div>
    </details>
  </section>`;
}

function detailMarkup(b){const meta={...b};const guide=Object.hasOwn(READING_GUIDES,b.id)?READING_GUIDES[b.id]:null;const sources=[...(guide?.edition.sources||[]),...(meta.sources||[])].filter((source,index,all)=>all.findIndex(item=>item.url===source.url)===index);const art=BOOK_ART[b.id]||({liv0015:['train-fleuri.jpg','Quel chemin prendre ?'],liv0016:['telephone-rose.jpg','Le premier appel'],liv0017:['lecteur-journal.jpg','Diriger une équipe'],liv0018:['chuchotement.jpg','Nos influences'],liv0019:['portrait-bulle.jpg','Prendre la parole'],liv0020:['telephone-pastel.jpg','Le téléphone côté atelier'],liv0021:['conversation-sur-canape.jpg','Le temps d’écouter'],liv0022:['televiseurs-roses.jpg','Derrière l’écran'],liv0023:['regard-curieux.jpg','De l’action à la pensée'],liv0024:['ampoule-etoiles.jpg','Ce que l’on croit possible']})[b.id]||['livre-paysage.jpg','Un monde entre les pages'];const tags=meta.themes||[];
return '<div class="book-dossier album-book"><header class="album-opening"><div class="album-heading"><p class="album-rayon"><a href="'+siteHref('livres-'+b.genre+'-'+b.sub+'.html')+'">'+esc(GENRES[b.genre]?.[1][b.sub])+' ↗</a></p><h1>'+esc(b.title)+'</h1><p class="album-author">'+esc(b.author)+'</p></div><figure class="album-montage"><img class="album-landscape" src="'+esc(assetHref('images/atelier/'+art[0]))+'" alt=""><img class="album-endpaper" src="'+esc(assetHref('images/collage/papier-fleuri.jpg'))+'" alt=""><div class="album-cover-polaroid">'+smallCover({...b,cover:b.cover||meta.cover})+'<img class="album-cover-flower" src="'+esc(assetHref('images/carnet-illustre/sticker-fleur.svg'))+'" alt=""></div></figure>'+bookFileActions(b,meta)+'</header>'+
bookPassport(b,meta,guide)+bookGuideMarkup(b,guide)+
(adminEnabled?'<p><a class="btn secondary" href="'+esc(siteHref('ajouter-livre.html?id='+encodeURIComponent(b.id)))+'">Modifier cette fiche</a></p>':'')+
(tags.length?'<section class="album-threads"><h2>Les fils du livre</h2><div>'+tags.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div><img src="'+esc(assetHref('images/objets/annotation.svg'))+'" alt=""></section>':'')+
'<div class="book-reception-pair">'+externalReception(meta)+localReception(b)+'</div><details class="book-sources"><summary>Les sources et références ↘</summary><ul>'+sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.label)+' ↗</a></li>').join('')+(meta.pdfPath?'<li><a data-pdf-link="'+esc(meta.pdfPath)+'" href="'+esc(meta.pdfPath)+'" target="_blank" rel="noopener">PDF fourni · contenu et mentions éditoriales ↗</a></li>':'')+(meta.external?.url?'<li><a href="'+esc(meta.external.url)+'" target="_blank" rel="noopener">Source de la note extérieure ↗</a> · '+esc(meta.external.scope)+'</li>':'')+'</ul></details><nav class="book-dossier-bottom" aria-label="Garder une trace"><a href="'+siteHref('fiches.html?livre='+encodeURIComponent(b.id))+'">'+smallCover(b)+'Ma fiche de lecture ↗</a><a href="'+siteHref('journaux.html?livre='+encodeURIComponent(b.id))+'"><img src="'+esc(assetHref('images/objets/journal.svg'))+'" alt="">Mon journal ↗</a>'+'<a class="book-review-link" href="'+bookLink(b,'avis')+'"><img src="'+esc(assetHref('images/objets/avis.svg'))+'" alt="">Ma critique sur ce livre ↗</a>'+(adminEnabled?'<a href="'+bookLink(b,'ajouter-livre')+'">Modifier la fiche du catalogue ↗</a>':'')+'</nav></div>';
}
function legend(){return {...LEGEND_DEFAULT,...state.legend};}
function ensureBookSheet(b){let sheet=state.notes.find(n=>n.book===b.id&&n.kind==='fiches'&&n.auto);if(!sheet){sheet={id:'fiche-auto-'+b.id,book:b.id,kind:'fiches',title:b.title,body:'',page:'',auto:true,updated:new Date().toISOString()};state.notes.push(sheet);}return sheet;}
function currentParams(){return new URLSearchParams(typeof previewAsset==='function'?location.hash.slice(1):location.search);}
function jumpToHighlight(b,h){return siteHref('lire.html?id='+encodeURIComponent(b.id)+'&pdfpage='+Number(h.pageNumber||1)+'&highlight='+encodeURIComponent(h.id));}
function traceMarkup(h){const b=state.books.find(x=>x.id===h.book);if(!b)return '';return '<article class="saved-fragment" style="--fragment-color:'+esc(h.color)+'"><header>'+smallCover(b)+'<div><a href="'+bookLink(b)+'">'+esc(b.title)+'</a><p>'+esc(h.page|| (h.pageNumber?'Page '+h.pageNumber:''))+' · '+esc(legend()[h.color]||'Passage choisi')+'</p></div></header><blockquote>'+esc(h.quote)+'</blockquote>'+(h.annotation?'<p class="fragment-note">'+esc(h.annotation)+'</p>':'')+'<div class="trace-actions"><a href="'+jumpToHighlight(b,h)+'">Revenir au passage ↗</a><button type="button" data-remove-highlight="'+esc(h.id)+'" class="text-button">Retirer</button></div></article>';}
function renderHighlights(){const el=$('highlights');if(!el)return;const terms=searchTerms($('highlight-search')?.value||'');const color=$('highlight-color')?.value||'';const book=$('highlight-book')?.value||'';let items=state.highlights.filter(h=>{const b=state.books.find(b=>b.id===h.book);return (el.dataset.mode!=='annotations'||h.annotation)&&(!book||h.book===book)&&(!color||h.color===color)&&terms.every(t=>searchTerms((b?.title||'')+' '+(b?.author||'')).join(' ').includes(t));});items.sort((a,b)=>($('highlight-order')?.value==='color'?(legend()[a.color]||'').localeCompare(legend()[b.color]||'','fr'):(state.books.find(x=>x.id===a.book)?.title||'').localeCompare(state.books.find(x=>x.id===b.book)?.title||'','fr'))||(a.pageNumber||0)-(b.pageNumber||0));el.innerHTML=items.map(traceMarkup).join('')||'<p class="empty">Aucun passage pour ces filtres.</p>';if($('highlight-count'))$('highlight-count').textContent=items.length+' passage'+(items.length>1?'s':'');el.querySelectorAll('[data-remove-highlight]').forEach(btn=>btn.onclick=async()=>{state.highlights=state.highlights.filter(h=>h.id!==btn.dataset.removeHighlight);await save();renderHighlights();});}
function renderNotes(){const el=$('notes');if(!el)return;const term=searchTerms($('notes-search')?.value||'');let notes=state.notes.filter(n=>n.kind===el.dataset.kind&&term.every(t=>searchTerms((state.books.find(b=>b.id===n.book)?.title||'')+' '+n.title).join(' ').includes(t)));el.innerHTML=notes.map(n=>{const b=state.books.find(b=>b.id===n.book);if(!b)return '';const traces=n.auto?state.highlights.filter(h=>h.book===b.id):[];return '<article class="reading-sheet"><header>'+smallCover(b)+'<div><p class="artist-kicker">'+(n.auto?'Fiche du livre':'Page du carnet')+'</p><h2>'+esc(n.title)+'</h2><a href="'+bookLink(b)+'">'+esc(b.title)+' ↗</a><p>'+esc(n.page?'Page / chapitre '+n.page:'')+'</p></div><img class="sheet-sticker" src="'+esc(assetHref('images/objets/fiches.svg'))+'" alt=""></header>'+(n.passage?'<blockquote class="sheet-quotation"><strong>Passage marquant</strong><p>'+esc(n.passage)+'</p></blockquote>':'')+(n.body?'<p class="pre-wrap">'+esc(n.body)+'</p>':'')+(traces.length?'<details><summary>'+traces.length+' passage'+(traces.length>1?'s':'')+' de ce livre ↘</summary>'+traces.map(traceMarkup).join('')+'</details>':'')+'<div class="trace-actions"><button type="button" data-edit-note="'+esc(n.id)+'">Continuer ma fiche</button>'+(n.auto?'':'<button type="button" class="text-button" data-delete-note="'+esc(n.id)+'">Retirer</button>')+'</div></article>';}).join('')||'<p class="empty">Les fiches créées pendant ta lecture se rangeront ici, avec la couverture du livre.</p>';el.querySelectorAll('[data-edit-note]').forEach(btn=>btn.onclick=()=>{const n=state.notes.find(n=>n.id===btn.dataset.editNote);chooseBook(n.book,n);$('note-body').focus();});el.querySelectorAll('[data-delete-note]').forEach(btn=>btn.onclick=async()=>{state.notes=state.notes.filter(n=>n.id!==btn.dataset.deleteNote);await save();renderNotes();});el.querySelectorAll('[data-remove-highlight]').forEach(btn=>btn.onclick=async()=>{state.highlights=state.highlights.filter(h=>h.id!==btn.dataset.removeHighlight);await save();renderNotes();});}
function selects(){if(!$('book-select'))return;if($('book-title-search')){$('book-title-search').oninput=()=>{const terms=searchTerms($('book-title-search').value);$('book-select').value='';const found=terms.length?state.books.filter(b=>terms.every(t=>searchTerms(b.title+' '+b.author).join(' ').includes(t))):[];$('book-search-results').innerHTML=found.slice(0,8).map(b=>'<button type="button" data-choose-book="'+esc(b.id)+'">'+smallCover(b)+'<span>'+esc(b.title)+'<small>'+esc(b.author)+'</small></span></button>').join('')||(terms.length?'<p>Aucun livre trouvé.</p>':'');$('book-search-results').querySelectorAll('[data-choose-book]').forEach(btn=>btn.onclick=()=>chooseBook(btn.dataset.chooseBook));};const requested=currentParams().get('livre');if(requested)chooseBook(requested);}else{$('book-select').innerHTML=state.books.map(b=>'<option value="'+esc(b.id)+'">'+esc(b.title)+'</option>').join('');}}
function bindTraceFilters(){if($('highlight-order'))$('highlight-order').onchange=renderHighlights;if($('highlight-book')){$('highlight-book').innerHTML='<option value="">Tous les livres</option>'+state.books.filter(b=>state.highlights.some(h=>h.book===b.id)).map(b=>'<option value="'+esc(b.id)+'">'+esc(b.title)+'</option>').join('');$('highlight-book').onchange=renderHighlights;}if($('highlight-color')){$('highlight-color').innerHTML='<option value="">Toutes les couleurs</option>'+Object.entries(legend()).map(([color,label])=>'<option value="'+color+'">'+esc(label)+'</option>').join('');$('highlight-color').onchange=renderHighlights;}if($('highlight-search'))$('highlight-search').oninput=renderHighlights;if($('notes-search'))$('notes-search').oninput=renderNotes;}
const NOTE_FIELDS = ['title','page','body','passage'];

function noteFormValues() {
  return Object.fromEntries(NOTE_FIELDS.map(field=>[field,$('note-'+field)?.value || '']));
}
function fillNoteForm(note) {
  for (const field of NOTE_FIELDS) {
    const input = $('note-'+field);
    if (input) input.value = note?.[field] || '';
  }
}
function chooseBook(bookId, selectedNote = null) {
  const form=$('note-form');
  const book=state.books.find(item=>item.id===bookId);
  if (!$('book-select') || !book) return;
  const note=selectedNote || (form?.dataset.kind==='fiches' ? state.notes.find(n=>n.book===book.id&&n.kind==='fiches'&&n.auto) : null);
  if (form) {
    if (note) form.dataset.edit=note.id;
    else delete form.dataset.edit;
    fillNoteForm(note);
  }
  $('book-select').value=book.id;
  if ($('book-title-search')) $('book-title-search').value=book.title;
  if ($('book-search-results')) $('book-search-results').replaceChildren();
  if ($('selected-note-book')) $('selected-note-book').innerHTML=smallCover(book)+'<span>'+esc(book.title)+'</span>';
}
function bindNoteForm() {
  const form=$('note-form');
  if (!form) return;
  if ($('note-new')) $('note-new').onclick=()=>{
    delete form.dataset.edit;
    fillNoteForm(null);
    $('note-body').focus();
  };
  async function store() {
    const book=state.books.find(b=>b.id===$('book-select').value);
    if (!book) { message('Recherche et choisis le livre avant d’écrire.',true); return; }
    const values=noteFormValues();
    if (!Object.values(values).some(value=>value.trim())) return;
    let note=state.notes.find(n=>n.id===form.dataset.edit && n.book===book.id);
    if (!note && form.dataset.kind==='fiches') note=ensureBookSheet(book);
    if (!note) {
      note={id:uid(),kind:form.dataset.kind,book:book.id};
      state.notes.push(note);
    }
    form.dataset.edit=note.id;
    Object.assign(note,{...values,title:values.title.trim()||book.title,updated:new Date().toISOString()});
    await save();
    renderNotes();
  }
  function persist() {
    message('Enregistrement…');
    store().catch(error=>message(error.message,true));
  }
  form.onsubmit=event=>{event.preventDefault();persist();};
  for (const field of NOTE_FIELDS) {
    const input=$('note-'+field);
    if (input) input.oninput=persist;
  }
}

function showCarnetWarning(text) {
  let notice = $('carnet-sync-status');
  if (!notice) {
    notice = document.createElement('p');
    notice.id = 'carnet-sync-status';
    notice.className = 'note';
    notice.setAttribute('role', 'status');
    $('contenu')?.prepend(notice);
  }
  notice.textContent = text;
  notice.hidden = !text;
}

function personalCarnet() {
  return {
    notes: state.notes, highlights: state.highlights, questions: state.questions,
    reviews: state.reviews, profile: state.profile, design: state.design, legend: state.legend || {},
    positions: Object.fromEntries(state.books.map(book => [book.id, {
      position: book.position || '', pdfPage: book.pdfPage || 1,
    }])),
  };
}

function writeLocalState(pendingCarnet) {
  if (!db) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('data', 'readwrite');
    const records = tx.objectStore('data');
    records.put(state, 'state');
    if (pendingCarnet !== undefined) {
      if (pendingCarnet) records.put(pendingCarnet, 'pendingCarnet');
      else records.delete('pendingCarnet');
    }
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function readPendingCarnet() {
  return new Promise((resolve, reject) => {
    const req = db.transaction('data').objectStore('data').get('pendingCarnet');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function syncCarnet(){
 pendingWrites++;autosaveQueue=autosaveQueue.catch(()=>{}).then(async()=>{
 const {error}=await ell.from('user_carnets').upsert({user_id:ellUser.id,data:personalCarnet(),updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;showCarnetWarning('');
 }).finally(()=>pendingWrites--);return autosaveQueue;
}
async function save(){
 if(ellUser){try{await syncCarnet();}catch(e){showCarnetWarning(e.message);throw e;}}
 else await writeLocalState();
 message(ellUser?'Enregistré dans ton compte.':'Enregistré sur cet appareil.');
}
async function connectService(){
 if(location.protocol==='file:')return null;
 try{await ellConnect();const {data:{user}}=await ell.auth.getUser();ellUser=user;
 if(user){await ell.rpc('claim_library_admin');const {data}=await ell.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();adminEnabled=!!data;}else adminEnabled=false;
 service={user:user?.id||null,admin:adminEnabled};return service;
 }catch(e){console.error(e);return null;}
}
function restoreCarnet(data) {
  Object.assign(state, data);
  for (const book of state.books) {
    const position = data.positions?.[book.id];
    book.position = position?.position || '';
    book.pdfPage = position?.pdfPage || 1;
  }
}

async function loadServiceState(){
 if(!ell)return;
 const last=localStorage.getItem('ell_account');
 if(ellUser){
 const {data,error}=await ell.from('user_carnets').select('data').eq('user_id',ellUser.id).maybeSingle();if(error)throw error;
 if(data?.data){ellClear();restoreCarnet(data.data);}else if(last&&last!==ellUser.id){ellClear();}
 localStorage.setItem('ell_account',ellUser.id);
 }else if(last){ellClear();localStorage.removeItem('ell_account');}
 const {data:catalog,error:catalogError}=await ell.from('books').select('*').eq('published',true);
 if(catalogError){console.warn('Catalogue en ligne indisponible',catalogError);return;}
 for(const entry of catalog||[]){
  const original=(entry.original_pdf||entry.pdf_path||'').replace(/^\/+/,''),page=entry.original_page||'';
  const found=state.books.find(b=>(original&&(b.pdfPath===original))||(page&&(b.detailPath===page))||(b.externalCatalogId===entry.id));
  if(found){
   found.externalCatalogId=entry.id;
   if(entry.title)found.title=entry.title;
   if(entry.author)found.author=entry.author;
   if(entry.description)found.presentation=entry.description;
   if(entry.isbn)found.isbn=entry.isbn;
   if(entry.publisher)found.publisher=entry.publisher;
   if(entry.publication_year)found.year=entry.publication_year;
   if(entry.cover_path)found.cover=entry.cover_path;
   if(original)found.pdfPath=original;
   found.reviewLinks=entry.review_links||[];
  }else{
   state.books.push({id:'db-'+entry.id,externalCatalogId:entry.id,title:entry.title,author:entry.author||'',genre:'savoirs',sub:'0',presentation:entry.description||'',cover:entry.cover_path||entry.original_cover||'',pdfPath:original||'',year:entry.publication_year||'',isbn:entry.isbn||'',publisher:entry.publisher||'',reviewLinks:entry.review_links||[]});
  }
 }
}
function lockCatalog(){
 document.querySelectorAll('a[href*="ajouter-livre.html"],[data-admin-only]').forEach(x=>x.hidden=!adminEnabled);
 if($('book-form')){$('book-form').hidden=!adminEnabled;if($('book-access'))$('book-access').hidden=adminEnabled;}
 if($('admin-access'))$('admin-access').innerHTML=adminEnabled?'<a class="btn" href="admin-catalogue.html">Gérer le catalogue</a>':'<p>Réservé au compte administrateur. <a href="mon-espace.html">Se connecter</a></p>';
}
function showAccount(){
 const box=$('account-status');if(!box)return;
 if(location.hash.includes('type=recovery')){box.innerHTML='<h2>Définir un nouveau mot de passe</h2><form id="ell-recovery"><input id="ell-new-pass" type="password" minlength="6" required autocomplete="new-password" placeholder="Nouveau mot de passe"><button type="submit">Enregistrer le mot de passe</button></form><p id="ell-recovery-msg" role="status"></p>'; $('ell-recovery').onsubmit=async e=>{e.preventDefault();const {error}=await ell.auth.updateUser({password:$('ell-new-pass').value});$('ell-recovery-msg').textContent=error?error.message:'Mot de passe modifié. Recharge la page pour accéder à ton compte.';};return;}
 if(!ell){box.textContent='Connexion momentanément indisponible.';return;}
 if(ellUser){
 box.innerHTML='<p>Connecté avec <strong>'+esc(ellUser.email)+'</strong>. Tes carnets sont liés à ton compte.</p>'+(adminEnabled?'<a class="btn" href="admin-catalogue.html">Gérer le catalogue</a>':'')+'<button type="button" id="ell-out">Me déconnecter</button>';
 $('ell-out').onclick=async()=>{await autosaveQueue.catch(()=>{});await ell.auth.signOut();localStorage.removeItem('ell_account');location.reload();};return;
 }
 box.innerHTML='<h2>Se connecter ou créer un compte</h2><form id="ell-form"><label>E-mail <input id="ell-mail" type="email" required></label><label>Mot de passe <input id="ell-pass" type="password" minlength="6" required></label><button type="submit">Se connecter</button><button type="button" id="ell-create">Créer mon compte</button></form><button type="button" id="ell-google">Continuer avec Google</button><button type="button" id="ell-reset">Mot de passe oublié ?</button><p id="ell-result" role="status"></p>';
 const cred=()=>({email:$('ell-mail').value.trim(),password:$('ell-pass').value}),msg=x=>$('ell-result').textContent=x;
 $('ell-form').onsubmit=async e=>{e.preventDefault();const {error}=await ell.auth.signInWithPassword(cred());if(error)msg(error.message);else location.reload();};
 $('ell-create').onclick=async()=>{const {error}=await ell.auth.signUp({...cred(),options:{emailRedirectTo:location.origin+location.pathname}});msg(error?error.message:'Vérifie ton e-mail pour confirmer ton inscription.');};
 $('ell-reset').onclick=async()=>{const email=$('ell-mail').value.trim();if(!email){msg('Indique ton adresse e-mail pour recevoir le lien de réinitialisation.');return;}const {error}=await ell.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});msg(error?error.message:'Si ce compte existe, un e-mail de réinitialisation a été envoyé.');};
 $('ell-google').onclick=async()=>{const {error}=await ell.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)msg('Google OAuth doit être activé et configuré dans Supabase : '+error.message);};
}

async function storeCatalogBook(book){throw Error('Utilise la page Administration du catalogue.');}

async function startBookReader(book) {
 const host = $('reader-content');
 if (!host) return;
 const events = new AbortController();
 const requested = currentParams();
 let pdf, pageTask, textTask, loading, pdfLibrary, renderSequence = 0;
 let currentPage = Math.max(1, Math.floor(Number(requested.get('pdfpage') || book.pdfPage) || 1));
 let currentColor = Object.keys(legend())[0], active = null, draft = null;
 let textRoot, paintText, pageReady = false, hasText = true, mode = 'text', drag = null, mouseSelect = false, selectionTimer;
 const sheet = ensureBookSheet(book);
 const history = [];
 const cleanup = () => {
  events.abort();
  clearTimeout(selectionTimer);
  pageTask?.cancel();
  textTask?.cancel();
  loading?.destroy().catch(() => {});
 };
 readerController = cleanup;

 host.innerHTML = `<section class="annotated-reader">
  <div class="reader-tools">
   <a href="${esc(bookLink(book))}" class="editorial-link">← Fiche du livre</a>
   <div class="page-stepper"><button id="pdf-prev" type="button" aria-label="Page précédente">←</button><label for="pdf-page">Page</label><input id="pdf-page" type="number" min="1" value="${currentPage}"><span id="pdf-total"></span><button id="pdf-next" type="button" aria-label="Page suivante">→</button></div>
   <label class="reader-zoom">Taille <select id="pdf-zoom"><option value="1">À la largeur</option><option value="1.25">125 %</option><option value="1.5">150 %</option><option value="2">200 %</option></select></label>
   <span id="reader-save-status" role="status">Ouverture du livre…</span>
   <div class="reader-mark-tools">
    <div class="reader-mode-tools" role="group" aria-label="Outils du lecteur">
     <button type="button" id="text-mode" aria-pressed="true"><span class="tool-symbol symbol-text" aria-hidden="true"></span>Texte</button>
     <button type="button" id="area-mode" aria-pressed="false" hidden><span class="tool-symbol symbol-zone" aria-hidden="true"></span>Zone</button>
     <button type="button" id="erase-mode" aria-pressed="false"><span class="tool-symbol symbol-erase" aria-hidden="true"></span>Gomme</button>
     <button type="button" id="undo-mark" disabled><span class="tool-symbol symbol-undo" aria-hidden="true">↶</span>Annuler</button>
    </div>
    <div class="reader-palette">
     <span class="palette-title">Couleur</span>
     <div class="reader-pencils" role="group" aria-label="Couleur du surligneur">${Object.entries(legend()).map(([color,label])=>`<button type="button" class="pencil" style="--pencil:${color}" data-pencil="${color}" title="${esc(label)}" aria-label="${esc(label)}" aria-pressed="${color===currentColor}"></button>`).join('')}</div>
     <span id="pencil-label">${esc(legend()[currentColor])}</span>
    </div>
    <div class="reader-actions"><button type="button" id="save-selection" disabled>Surligner la sélection</button></div>
   </div>
  </div>
  <p class="reader-help" id="reader-help-extra"></p>
  <div class="pdf-scroll" id="pdf-scroll"><div class="pdf-paper" id="pdf-paper"><canvas id="pdf-canvas"></canvas><div class="pdf-ink" id="pdf-ink" aria-hidden="true"></div><div class="textLayer" id="pdf-text-layer"></div></div></div>
  <div id="page-traces" class="page-traces"></div>
  <div class="reader-bottom">
   <section class="reader-sheet" id="reader-sheet"><div class="reader-note-heading"><img src="${esc(assetHref('images/objets/fiches.svg'))}" alt=""><h2>Ma fiche de lecture</h2></div>
    <div class="sheet-fields"><div><label for="reader-sheet-title">Titre de la fiche</label><input id="reader-sheet-title" value="${esc(sheet.title||'')}" maxlength="160"></div><div><label for="reader-sheet-page">Page</label><input id="reader-sheet-page" value="${esc(sheet.page||'')}" maxlength="100" placeholder="Ex. 12"></div></div>
    <label for="reader-sheet-passage">Passage marquant</label><textarea id="reader-sheet-passage" maxlength="10000" placeholder="Recopie le passage ou ajoute-le depuis un surlignage.">${esc(sheet.passage||'')}</textarea>
    <label for="reader-sheet-text">Mes notes</label><textarea id="reader-sheet-text" placeholder="Pourquoi ce passage compte pour moi…">${esc(sheet.body||'')}</textarea><a href="${esc(siteHref('fiches.html?livre='+encodeURIComponent(book.id)))}">Retrouver ma fiche de lecture ↗</a></section>
   <section class="reader-comment"><div class="reader-note-heading"><img src="${esc(assetHref('images/objets/annotation.svg'))}" alt=""><h2>Mon passage choisi</h2></div><p id="chosen-excerpt">Choisis un surlignage pour ajouter une note.</p><label for="reader-annotation">Mon annotation</label><textarea id="reader-annotation" disabled placeholder="Pourquoi ce passage compte pour moi…"></textarea><div class="reader-excerpt-actions"><button id="copy-to-sheet" type="button" hidden>Ajouter à ma fiche</button><button id="remove-current-highlight" class="text-button" type="button" hidden>Enlever le surlignage</button></div>
    <details><summary>Personnaliser mes légendes de couleurs ↘</summary>${Object.entries(legend()).map(([color,label],i)=>`<label class="legend-edit" style="--pencil:${color}" for="legend-${i}"><span class="legend-dot"></span><input id="legend-${i}" data-legend-color="${color}" value="${esc(label)}" maxlength="60" aria-label="Légende de couleur ${i+1}"></label>`).join('')}</details>
   </section>
  </div>
 </section>`;
 if (location.hash === '#reader-content' || requested.get('anchor') === 'reader-content') {
  requestAnimationFrame(() => {
   if (!events.signal.aborted) host.scrollIntoView({block:'start',behavior:'instant'});
  });
 }
 $('reader-title').textContent = book.title;
 if ($('reader-review-link')) {
  $('reader-review-link').href = bookLink(book,'avis');
  $('reader-review-link').textContent = 'Ma critique sur ce livre';
 }
 if ($('reader-nav')) $('reader-nav').innerHTML = '';
 const paper = $('pdf-paper'), ink = $('pdf-ink'), layer = $('pdf-text-layer');
 const traceList = $('page-traces'), help = $('reader-help-extra'), annotation = $('reader-annotation');
 const saveSelection = $('save-selection'), areaButton = $('area-mode');
 const textButton = $('text-mode'), eraser = $('erase-mode'), undo = $('undo-mark'), copyToSheet = $('copy-to-sheet');
 const pencils = host.querySelectorAll('[data-pencil]');

 function status(text, error = false) {
  if (events.signal.aborted) return;
  $('reader-save-status').textContent = text;
  $('reader-save-status').classList.toggle('save-error', error);
 }
 async function persist() {
  status('Enregistrement…');
  try {
   await save();
   status(service?.user ? 'Enregistré dans mon espace' : 'Enregistré sur cet appareil');
  } catch (error) { status(error.message, true); }
 }
 function paintPencils() {
  pencils.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pencil === currentColor)));
  $('pencil-label').textContent = legend()[currentColor] || 'Couleur du passage';
 }
 function setDraft(value) {
  draft = value;
  saveSelection.disabled = !draft;
 }
 function openHighlight(highlight) {
  active = highlight;
  setDraft(null);
  $('chosen-excerpt').textContent = highlight?.quote || 'Choisis un surlignage pour ajouter une note.';
  annotation.disabled = !highlight;
  annotation.value = highlight?.annotation || '';
  $('remove-current-highlight').hidden = !highlight;
  copyToSheet.hidden = !highlight || !!highlight.area || highlight.quote === 'Zone surlignée';
  if (highlight) currentColor = highlight.color;
  paintPencils();
 }
 function pageHighlights() {
  return state.highlights.filter(h => h.book === book.id && Number(h.pageNumber || 1) === currentPage);
 }
 function paintMarks() {
  undo.disabled = !history.length;
  if (paintText) paintText();
  ink.replaceChildren();
  const list = pageHighlights();
  for (const h of list) for (const rect of h.rects || []) {
   const mark = document.createElement('span');
   mark.className = 'pdf-highlight' + (active?.id === h.id ? ' is-active' : '');
   mark.style.cssText = `left:${rect.x*100}%;top:${rect.y*100}%;width:${rect.w*100}%;height:${rect.h*100}%;background:${h.color}`;
   ink.appendChild(mark);
  }
  traceList.innerHTML = list.length ? `<h2>Mes surlignages <small>Page ${currentPage}</small></h2>` + list.map(h => `<button type="button" aria-pressed="${h.id===active?.id}" data-open-trace="${esc(h.id)}" style="--pencil:${esc(h.color)}">${esc(h.quote.length>95?h.quote.slice(0,95)+'…':h.quote)}</button>`).join('') : '';
  traceList.querySelectorAll('[data-open-trace]').forEach(button => button.onclick = () => {
   const h = list.find(h => h.id === button.dataset.openTrace);
   if (mode === 'erase') { void removeHighlight(h); return; }
   openHighlight(h);
   paintMarks();
   traceList.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
  });
 }
 function normalizedRect(rect, box) {
  const left = Math.max(box.left, rect.left), top = Math.max(box.top, rect.top);
  const right = Math.min(box.right, rect.right), bottom = Math.min(box.bottom, rect.bottom);
  if (right-left < 2 || bottom-top < 2) return null;
  return {x:(left-box.left)/box.width,y:(top-box.top)/box.height,w:(right-left)/box.width,h:(bottom-top)/box.height};
 }
 function rememberSelection() {
  const selection = window.getSelection();
  if (!pageReady || mode !== 'text' || !hasText || !selection || selection.isCollapsed || !selection.rangeCount ||
      !textRoot?.contains(selection.anchorNode) || !textRoot.contains(selection.focusNode)) return false;
  const range = selection.getRangeAt(0);
  const raw = selection.toString(), quote = raw.trim();
  if (!quote || quote.length > 10000) { setDraft(null); return false; }
  if (textRoot !== layer) {
   const before = range.cloneRange();
   before.selectNodeContents(textRoot);
   before.setEnd(range.startContainer, range.startOffset);
   setDraft({quote,textStart:before.toString().length + raw.length - raw.trimStart().length});
   return true;
  }
  const box = paper.getBoundingClientRect(), rects = [];
  for (const clientRect of range.getClientRects()) {
   const rect = normalizedRect(clientRect, box);
   if (rect && rect.w < 0.995 && !rects.some(r => ['x','y','w','h'].every(key=>Math.abs(r[key]-rect[key])<.001))) rects.push(rect);
  }
  setDraft(rects.length && rects.length <= 1000 ? {quote,rects} : null);
  return !!draft;
 }
 async function saveDraft() {
  if (!draft || !pageReady) return;
  const value = draft;
  const previous = pageHighlights().find(h => h.quote === value.quote &&
    (value.rects ? h.rects?.length === value.rects.length && h.rects.every((r,i) =>
      ['x','y','w','h'].every(key=>Math.abs(r[key]-value.rects[i][key])<.005)) : h.textStart === value.textStart));
  setDraft(null);
  window.getSelection()?.removeAllRanges();
  if (previous) {
   openHighlight(previous);
   return;
  }
  const highlight = {id:uid(),book:book.id,...value,page:'Page '+currentPage,pageNumber:currentPage,color:currentColor,annotation:'',created:new Date().toISOString()};
  state.highlights.push(highlight);
  rememberChange({id:highlight.id});
  openHighlight(highlight);
  paintMarks();
  await persist();
 }
 const doc = window.document;
 const options = {signal:events.signal};
 doc.addEventListener('selectionchange', rememberSelection, options);
 $('pdf-scroll').addEventListener('pointerdown', event => {
  if (textRoot?.contains(event.target) && mode === 'text' && hasText) {
   setDraft(null);
   mouseSelect = event.pointerType === 'mouse' && event.button === 0;
  }
 }, options);
 doc.addEventListener('pointerup', event => {
  if (!mouseSelect || event.pointerType !== 'mouse') return;
  mouseSelect = false;
  clearTimeout(selectionTimer);
  selectionTimer = setTimeout(() => {
   if (rememberSelection()) void saveDraft();
  }, 35);
 }, options);
 doc.addEventListener('pointercancel', () => { mouseSelect = false; }, options);
 saveSelection.onclick = () => { rememberSelection(); void saveDraft(); };
 pencils.forEach(button => {
  button.addEventListener('pointerdown', rememberSelection);
  button.onclick = async () => {
   rememberSelection();
   currentColor = button.dataset.pencil;
   paintPencils();
   if (active && !draft && mode !== 'erase' && active.color !== currentColor) {
    rememberChange({id:active.id,oldColor:active.color});
    active.color = currentColor;
    paintMarks();
    await persist();
   }
  };
 });

 function setMode(next) {
  mode = next;
  clearTimeout(selectionTimer);
  mouseSelect = false;
  if (drag) { drag.preview.remove(); drag = null; }
  setDraft(null);
  window.getSelection()?.removeAllRanges();
  paper.classList.toggle('pdf-area-mode', mode === 'area');
  $('pdf-scroll').classList.toggle('reader-erase-mode', mode === 'erase');
  for (const [button, value] of [[textButton,'text'],[areaButton,'area'],[eraser,'erase']]) {
   button.setAttribute('aria-pressed', String(mode === value));
  }
  textButton.disabled = !hasText;
  if (mode === 'area') help.textContent = 'Fais glisser sur la page pour surligner une zone.';
  else if (mode === 'erase') help.textContent = 'Clique sur un surlignage dans la page ou dans la liste pour l’enlever. Annuler le remet en place.';
  else if (!hasText) help.textContent = 'Page scannée. Choisis « Zone » pour surligner un endroit de la page.';
  else help.textContent = 'Sélectionne le texte à surligner. Sur téléphone, touche ensuite « Surligner la sélection ».';
 }
 textButton.onclick = () => setMode('text');
 areaButton.onclick = () => setMode(mode === 'area' ? (hasText ? 'text' : 'read') : 'area');
 eraser.onclick = () => setMode(mode === 'erase' ? (hasText ? 'text' : 'read') : 'erase');

 function rememberChange(change) {
  history.push(change);
  if (history.length > 50) history.shift();
 }
 async function removeHighlight(highlight) {
  if (!highlight) return;
  const index = state.highlights.findIndex(h => h.id === highlight.id);
  if (index < 0) return;
  rememberChange({id:highlight.id,removed:highlight,index});
  state.highlights.splice(index,1);
  if (active?.id === highlight.id) openHighlight(null);
  paintMarks();
  await persist();
 }
 undo.onclick = async () => {
  const change = history.pop();
  if (!change) return;
  const index = state.highlights.findIndex(h => h.id === change.id);
  if (change.removed) state.highlights.splice(change.index,0,change.removed);
  else if (index >= 0 && change.oldColor) state.highlights[index].color = change.oldColor;
  else if (index >= 0) state.highlights.splice(index,1);
  openHighlight(null);
  paintMarks();
  await persist();
 };
 $('pdf-scroll').addEventListener('click', event => {
  if (mode !== 'erase' || !pageReady) return;
  const list = pageHighlights();
  if (textRoot !== layer) {
   const id = event.target.closest('mark')?.dataset.highlightId;
   if (id) void removeHighlight(list.find(h => h.id === id));
   return;
  }
  if (!paper.contains(event.target)) return;
  const box = paper.getBoundingClientRect();
  const x = (event.clientX-box.left)/box.width, y = (event.clientY-box.top)/box.height;
  void removeHighlight(list.reverse().find(h => h.rects?.some(r => x >= r.x && x <= r.x+r.w && y >= r.y && y <= r.y+r.h)));
 }, options);

 function areaRect(event) {
  return normalizedRect({left:Math.min(drag.x,event.clientX),right:Math.max(drag.x,event.clientX),
   top:Math.min(drag.y,event.clientY),bottom:Math.max(drag.y,event.clientY)},paper.getBoundingClientRect());
 }
 paper.addEventListener('pointerdown', event => {
  if (mode !== 'area' || !pageReady || !event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  const preview = document.createElement('span');
  preview.className = 'pdf-highlight area-preview';
  ink.appendChild(preview);
  drag = {id:event.pointerId,x:event.clientX,y:event.clientY,preview};
  paper.setPointerCapture(event.pointerId);
 });
 paper.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  const rect = areaRect(event);
  if (rect) drag.preview.style.cssText = `left:${rect.x*100}%;top:${rect.y*100}%;width:${rect.w*100}%;height:${rect.h*100}%;background:${currentColor}`;
 });
 function endArea(event) {
  if (drag?.id !== event.pointerId) return;
  const rect = event.type === 'pointerup' ? areaRect(event) : null;
  drag.preview.remove();
  drag = null;
  if (rect) {
   setDraft({quote:'Zone surlignée',rects:[rect],area:true});
   void saveDraft();
  }
 }
 paper.addEventListener('pointerup', endArea);
 paper.addEventListener('pointercancel', endArea);
 paper.addEventListener('lostpointercapture', endArea);

 annotation.oninput = () => { if (active) { active.annotation = annotation.value; void persist(); } };
 $('remove-current-highlight').onclick = () => void removeHighlight(active);
 const sheetInputs = {'reader-sheet-title':'title','reader-sheet-page':'page','reader-sheet-passage':'passage','reader-sheet-text':'body'};
 function saveSheet() {
  for (const [input, field] of Object.entries(sheetInputs)) sheet[field] = $(input).value;
  sheet.title = sheet.title.trim() || book.title;
  sheet.updated = new Date().toISOString();
  void persist();
 }
 Object.keys(sheetInputs).forEach(input => $(input).oninput = saveSheet);
 copyToSheet.onclick = () => {
  if (!active) return;
  const passage = $('reader-sheet-passage');
  if (passage.value.trim() && passage.value.trim() !== active.quote &&
      !window.confirm('Remplacer le passage marquant de cette fiche ?')) return;
  passage.value = active.quote;
  $('reader-sheet-page').value = String(active.pageNumber || currentPage);
  saveSheet();
  passage.focus();
 };
 host.querySelectorAll('[data-legend-color]').forEach(input => input.onchange = async () => {
  state.legend = {...legend(),[input.dataset.legendColor]:input.value.trim() || LEGEND_DEFAULT[input.dataset.legendColor]};
  pencils.forEach(button => {
   button.title = legend()[button.dataset.pencil];
   button.setAttribute('aria-label',button.title);
  });
  paintPencils();
  await persist();
 });

 async function showPage(number) {
  currentPage = Math.max(1,Math.min(pdf.numPages,Math.floor(Number(number) || 1)));
  const turn = ++renderSequence;
  clearTimeout(selectionTimer);
  mouseSelect = false;
  pageReady = false;
  openHighlight(null);
  setMode('read');
  areaButton.hidden = true;
  if (drag) { drag.preview.remove(); drag = null; }
  pageTask?.cancel();
  textTask?.cancel();
  layer.replaceChildren();
  ink.replaceChildren();
  traceList.replaceChildren();
  $('pdf-page').value = currentPage;
  $('pdf-prev').disabled = currentPage === 1;
  $('pdf-next').disabled = currentPage === pdf.numPages;
  status('Ouverture de la page…');
  try {
   const page = await pdf.getPage(currentPage);
   if (events.signal.aborted || turn !== renderSequence) return;
   const width = Math.max(220,$('pdf-scroll').clientWidth - 32) * Number($('pdf-zoom').value);
   const viewport = page.getViewport({scale:width/page.getViewport({scale:1}).width});
   const canvas = $('pdf-canvas'), density = Math.min(2,window.devicePixelRatio || 1);
   canvas.width = Math.floor(viewport.width*density);
   canvas.height = Math.floor(viewport.height*density);
   canvas.style.width = paper.style.width = viewport.width+'px';
   canvas.style.height = paper.style.height = viewport.height+'px';
   paper.style.setProperty('--total-scale-factor', viewport.scale);
   paper.style.setProperty('--scale-factor', viewport.scale);
   pageTask = page.render({canvasContext:canvas.getContext('2d'),viewport,transform:density === 1 ? null : [density,0,0,density,0,0]});
   await pageTask.promise;
   const content = await page.getTextContent();
   if (events.signal.aborted || turn !== renderSequence) return;
   hasText = content.items.some(item => item.str?.trim());
   if (hasText) {
    textTask = new pdfLibrary.TextLayer({textContentSource:content,container:layer,viewport});
    await textTask.render();
   }
   if (events.signal.aborted || turn !== renderSequence) return;
   textRoot = layer;
   pageReady = true;
   areaButton.hidden = false;
   setMode(hasText ? 'text' : 'read');
   paintMarks();
   const wanted = pageHighlights().find(h => h.id === requested.get('highlight'));
   if (wanted) openHighlight(wanted);
   book.pdfPage = currentPage;
   book.position = 'Page '+currentPage;
   await persist();
  } catch (error) {
   if (events.signal.aborted || turn !== renderSequence || ['RenderingCancelledException','AbortException'].includes(error.name)) return;
   status('Cette page ne peut pas être affichée.', true);
  }
 }

 $('pdf-prev').onclick = () => pdf && showPage(currentPage-1);
 $('pdf-next').onclick = () => pdf && showPage(currentPage+1);
 $('pdf-page').onchange = () => pdf && showPage($('pdf-page').value);
 $('pdf-page').onkeydown = event => {
  if (event.key === 'Enter') { event.preventDefault(); if (pdf) void showPage(event.target.value); }
 };
 $('pdf-zoom').onchange = () => pdf && showPage(currentPage);
 try {
  if (book.pdf || book.pdfPath) {
   await ensureOfflinePDF(book);
   pdfLibrary = await getPDFLibrary();
   if (events.signal.aborted) return cleanup;
   const source = pdfAddress(book);
   const input = source.startsWith('data:') ? {data:decodeBinaryAsset(source)} : {url:source};
   loading = pdfLibrary.getDocument({...input,isEvalSupported:false,useSystemFonts:true,disableAutoFetch:true,disableStream:true});
   pdf = await loading.promise;
   if (events.signal.aborted) return cleanup;
   $('pdf-total').textContent = '/ '+pdf.numPages;
   $('pdf-page').max = pdf.numPages;
   await showPage(currentPage);
  } else {
   paper.hidden = true;
   for (const key of ['pdf-prev','pdf-next','pdf-page','pdf-zoom']) $(key).disabled = true;
   currentPage = 1;
   $('pdf-page').value = 1;
   $('pdf-total').textContent = '/ 1';
   const text = document.createElement('div');
   text.className = 'reader reader-original-text';
   text.id = 'book-text';
   $('pdf-scroll').appendChild(text);
   textRoot = text;
   paintText = () => {
    const original = book.text || 'Aucun texte disponible.';
    const ranges = pageHighlights().map(h => ({h,start:Number.isInteger(h.textStart)?h.textStart:original.indexOf(h.quote)}))
     .filter(item => item.start >= 0).sort((a,b)=>a.start-b.start);
    text.replaceChildren();
    let offset = 0;
    for (const {h,start} of ranges) {
     if (start < offset) continue;
     text.appendChild(document.createTextNode(original.slice(offset,start)));
     const mark = document.createElement('mark');
     mark.textContent = original.slice(start,start+h.quote.length);
     mark.style.backgroundColor = h.color;
     mark.dataset.highlightId = h.id;
     text.appendChild(mark);
     offset = start + h.quote.length;
    }
    text.appendChild(document.createTextNode(original.slice(offset)));
   };
   pageReady = true;
   setMode('text');
   paintMarks();
   openHighlight(pageHighlights().find(h => h.id === requested.get('highlight')));
   status('Page prête');
  }
 } catch (error) {
  if (events.signal.aborted) return cleanup;
  status('Le lecteur intégré n’a pas pu ouvrir ce fichier.', true);
  const link = document.createElement('p');
  link.className = 'note';
  link.innerHTML = `<a target="_blank" rel="noopener" href="${esc(pdfAddress(book))}">Ouvrir le PDF dans mon lecteur habituel ↗</a>`;
  host.appendChild(link);
 }
 return cleanup;
}

let pdfLibraryPromise;
function getPDFLibrary(){if(!pdfLibraryPromise)pdfLibraryPromise=(async()=>{if(location.protocol==='file:'&&typeof previewAsset!=='function'){if(!window.ELLPDFJs)await loadClassicScript('js/pdf-offline/engine.js');window.ELLPDFJs.GlobalWorkerOptions.workerSrc=binaryAssetURL(window.ELLPDFWorkerData,'text/javascript');return window.ELLPDFJs;}let moduleURL=assetHref('js/pdfjs/pdf.mjs'),workerURL=assetHref('js/pdfjs/pdf.worker.mjs');if(moduleURL.startsWith('data:'))moduleURL=binaryAssetURL(moduleURL,'text/javascript');if(workerURL.startsWith('data:'))workerURL=binaryAssetURL(workerURL,'text/javascript');const lib=await import(moduleURL.startsWith('blob:')?moduleURL:new URL(moduleURL,location.href).href);lib.GlobalWorkerOptions.workerSrc=workerURL.startsWith('blob:')?workerURL:new URL(workerURL,location.href).href;return lib;})();return pdfLibraryPromise;}
function decodeBinaryAsset(data){
 const encoded=data.slice(data.indexOf(',')+1);
 if (typeof Uint8Array.fromBase64==='function') return Uint8Array.fromBase64(encoded);
 const decoded=atob(encoded), bytes=new Uint8Array(decoded.length);
 for(let i=0;i<decoded.length;i++) bytes[i]=decoded.charCodeAt(i);
 return bytes;
}
function binaryAssetURL(data,mime){const bytes=decodeBinaryAsset(data);const url=URL.createObjectURL(new Blob([bytes],{type:mime}));objects.push(url);return url;}

function releaseCurrentPage(){pageReleased=true;readerController?.();objects.forEach(url=>URL.revokeObjectURL(url));}


function loadClassicScript(path){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=path;script.onload=resolve;script.onerror=()=>reject(Error('Le fichier local du lecteur est introuvable.'));document.head.appendChild(script);});}
async function ensureOfflinePDF(book){if(location.protocol!=='file:'||typeof previewAsset==='function'||!book.pdfPath||book.pdf)return;if(window.ELLPDFData?.[book.pdfPath])return;const slug=book.pdfPath.replace(/^pdf\//,'').replace(/\.pdf$/,'');if(!/^[a-z0-9-]+$/.test(slug))return;await loadClassicScript('js/pdf-offline/'+slug+'.js');}
function pdfAddress(b){if(b.pdf)return b.pdf;if(location.protocol==='file:'&&typeof previewAsset!=='function'&&window.ELLPDFData?.[b.pdfPath])return window.ELLPDFData[b.pdfPath];return b.pdfPath&&typeof previewPDF==='function'?previewPDF(b.pdfPath):b.pdfPath||'';}

async function start(){try{await connectService();
const privatePages=new Set(['mon-espace.html','surlignages.html','annotations.html','fiches.html','journaux.html','profil.html','sauvegardes.html','tests.html','critiques.html']);
const currentPage=location.pathname.split('/').pop().toLowerCase();
if(privatePages.has(currentPage)&&!ellUser){
 const main=$('contenu')||document.querySelector('main');
 if(main){main.innerHTML='<section class="account-login-gate" style="max-width:680px;margin:3rem auto;padding:2rem"><h1>Mon espace personnel</h1><p>Connecte-toi ou crée ton compte pour retrouver tes lectures, annotations, fiches et journaux. Chaque carnet est privé et rattaché à son propriétaire.</p><div id="account-status"></div></section>';showAccount();}
 return;
}
try{db=await openDB();state=await load();}catch(storageError){state=blank();db=null;let warning=document.createElement('p');warning.className='note';warning.textContent='Le catalogue et ses PDF restent consultables. Le stockage de ce navigateur est indisponible : les nouveaux avis et notes ne pourront pas être conservés.';$('contenu').prepend(warning);}let changed=false;
for(const book of LIVRES_INITIAUX){
  const existing=state.books.find(item=>item.id===book.id);
  if(!existing){
    state.books.push({...book});
    changed=true;
  }else if(book.catalogueRevision && existing.catalogueRevision!==book.catalogueRevision){
    const previous=ORIGINAL_CATALOGUE[book.id];
    const keep={};
    for(const key of ['title','author','presentation','summary','text','cover','genre','sub']) if(previous && existing[key] && existing[key]!==previous[key])keep[key]=existing[key];
    Object.assign(existing,book,keep);
    changed=true;
  }else if(book.cover && existing.cover===book.cover.replace(/\.jpg$/,'.webp')){
    existing.cover=book.cover;
    changed=true;
  }
}
try { await loadServiceState(); } catch(error) { showCarnetWarning(error.message); }
if(changed&&db)await writeLocalState();
if(!document.body.isConnected)return;
applyDesign();
if($('search-year')){$('search-year').innerHTML='<option value="">Toutes les dates</option>'+[...new Set(state.books.map(b=>bookYear(b)).filter(Boolean))].sort((a,b)=>Number(b)-Number(a)).map(y=>'<option>'+esc(y)+'</option>').join('');}
if($('review-search')){
 $('review-search').oninput=renderBooks;
 for(const field of ['review-sort','review-day','review-only']) $(field).onchange=renderBooks;
 $('review-filters').onsubmit=event=>{event.preventDefault();renderBooks();};
 $('review-filters').onreset=()=>requestAnimationFrame(renderBooks);
}
for(const field of ['search-year','search-sort','pdf-only'])if($(field))$(field).onchange=renderBooks;
renderBooks();selects();bindTraceFilters();renderHighlights();renderNotes();renderQuestions();if ($('search')) $('search').oninput = renderBooks;
if ($('search-genre')) $('search-genre').onchange = renderBooks;
if ($('catalogue-tabs')) {
  $('catalogue-tabs').hidden = false;
  $('catalogue-tabs').querySelectorAll('[data-genre]').forEach(button => {
    button.onclick = () => {
      $('search-genre').value = button.dataset.genre;
      renderBooks();
    };
  });
}
if ($('catalogue-search')) {
  $('catalogue-search').onsubmit = event => {
    event.preventDefault();
    renderBooks();
  };
  $('catalogue-search').onreset = () => requestAnimationFrame(renderBooks);
}
let b=state.books.find(b=>b.id===id);
if($('book-form')&&adminEnabled){
const parameters=new URLSearchParams(location.search);
const requestedGenre=parameters.get('genre');
const requestedSub=parameters.get('sub');
if(!b && Object.hasOwn(GENRES,requestedGenre)) $('genre').value=requestedGenre;
subOptions();
if(!b && requestedSub!==null && Array.from($('sub').options).some(option=>option.value===requestedSub)){
  $('sub').value=requestedSub;
}
$('genre').onchange=subOptions;
const guide = b && Object.hasOwn(READING_GUIDES,b.id) ? READING_GUIDES[b.id] : null;
const editionFields = ['publisher','year','original','isbn','kind','otherIsbn','issn','language','collection','pages','contributors','note'];
const edition = {...guide?.edition, ...(typeof b?.edition === 'object' ? b.edition : {})};
const fields = ['title','author','genre','sub','presentation','summary','text'];
if (b) {
  $('book-save-title').textContent = 'Modifier la fiche';
  fields.filter(key=>key!=='sub').forEach(key=>{$(key).value=b[key]||'';});
  subOptions();
  $('sub').value = b.sub;
  $('summary').value = b.summary || guide?.summary || b.presentation || '';
}
for (const key of editionFields) {
  $('edition-'+key).value = edition[key] ?? (typeof b?.[key] === 'string' ? b[key] : '') ?? '';
}
$('edition-language').value ||= guide ? 'Français' : '';
$('chapter-unit').value = b?.chapterUnit || guide?.unit || 'Chapitres';
const chapterRows = $('chapter-fields');
function updateChapterNumbers() {
  chapterRows.querySelectorAll('fieldset').forEach((row,index)=> {
    row.querySelector('legend').textContent = 'Entrée ' + (index + 1);
  });
}
function addChapter(chapter={}) {
  if (chapterRows.children.length >= 120) return;
  const row = document.createElement('fieldset');
  row.className = 'chapter-editor-row';
  row.innerHTML = '<legend></legend><label>Titre<input data-chapter="title" maxlength="300" required></label><label>Page du PDF (facultative)<input data-chapter="page" type="number" min="1"></label><label>Résumé<textarea data-chapter="summary" maxlength="5000" rows="3" required></textarea></label><div class="chapter-editor-actions"><button type="button" data-chapter-move="up" class="secondary">Monter</button><button type="button" data-chapter-move="down" class="secondary">Descendre</button><button type="button" data-chapter-remove class="secondary">Retirer</button></div>';
  for (const input of row.querySelectorAll('[data-chapter]')) input.value = chapter[input.dataset.chapter] ?? '';
  row.querySelector('[data-chapter-remove]').onclick = () => {row.remove();updateChapterNumbers();};
  for (const button of row.querySelectorAll('[data-chapter-move]')) {
    button.onclick = () => {
      if (button.dataset.chapterMove==='up' && row.previousElementSibling) chapterRows.insertBefore(row,row.previousElementSibling);
      if (button.dataset.chapterMove==='down' && row.nextElementSibling) chapterRows.insertBefore(row.nextElementSibling,row);
      updateChapterNumbers();
    };
  }
  chapterRows.append(row);
  updateChapterNumbers();
  return row;
}
for (const chapter of b?.chapters ?? guide?.chapters ?? []) addChapter(chapter);
$('chapter-add').onclick = () => addChapter()?.querySelector('input').focus();
$('book-form').onsubmit = async event => {
  event.preventDefault();
  const button = $('book-save');
  button.disabled = true;
  try {
    const book={...(b||{}),id:b?.id||uid()};
    for (const key of fields) book[key]=$(key).value.trim();
    book.edition=Object.fromEntries(editionFields.map(key=>[key,$('edition-'+key).value.trim()]));
    book.chapterUnit=$('chapter-unit').value;
    book.chapters=Array.from(chapterRows.children,row=>{
      const read = key => row.querySelector('[data-chapter="'+key+'"]').value.trim();
      const page = read('page');
      return {title:read('title'),summary:read('summary'),...(page ? {page:Number(page)} : {})};
    });
    const file=$('file').files[0], cover=$('cover').files[0];
    if (file) {
      if (file.size>20*1024*1024) throw Error('Le fichier dépasse 20 Mo.');
      if (file.name.toLowerCase().endsWith('.txt')) {
        book.text=await file.text();
        delete book.pdf;
        delete book.pdfPath;
        delete book.pdfPages;
      } else if (file.name.toLowerCase().endsWith('.pdf')) {
        book.pdf=await dataURL(file);
        book.text='';
        const pdfjs=await getPDFLibrary();
        const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,useSystemFonts:true}).promise;
        try {
          book.pdfPages=pdf.numPages;
          if (!cover && !book.cover) {
            const front=await pdf.getPage(1);
            const view=front.getViewport({scale:500/front.getViewport({scale:1}).width});
            const canvas=document.createElement('canvas');
            canvas.width=Math.ceil(view.width);
            canvas.height=Math.ceil(view.height);
            await front.render({canvasContext:canvas.getContext('2d'),viewport:view}).promise;
            book.cover=canvas.toDataURL('image/jpeg',.9);
          }
        } finally { await pdf.destroy(); }
      } else throw Error('Choisis un fichier TXT ou PDF.');
    }
    if (cover) {
      if (!['image/png','image/jpeg','image/webp'].includes(cover.type)) throw Error('La couverture doit être PNG, JPEG ou WebP.');
      if (cover.size>4*1024*1024) throw Error('La couverture dépasse 4 Mo.');
      book.cover=await dataURL(cover);
    }
    if (book.chapters.some(chapter=>!chapter.title||!chapter.summary)) throw Error('Renseigne le titre et le résumé de chaque entrée.');
    if (book.chapters.some(chapter=>chapter.page && (!book.pdfPages || chapter.page>book.pdfPages))) {
      throw Error('Vérifie les numéros de page indiqués dans les chapitres.');
    }
    delete book.position;
    delete book.pdfPage;
    await storeCatalogBook(book);
    location.href=bookLink(book);
  } catch(error) { message(error.message,true); }
  finally { button.disabled=false; }
};
}

if($('book-detail')){$('book-detail').innerHTML=b?detailMarkup(b):'<p class="empty">Choisis un livre dans Genres ou dans Mes lectures.</p>';wirePDFLinks();}
if($('reader-content')){if(b)startBookReader(b).then(cleanup=>{if(pageReleased)cleanup?.();else readerController=cleanup;});else $('reader-content').textContent='Choisis un livre dans la bibliothèque.';}
if($('review-form')){if(!b){$('review-book').textContent='Choisis d’abord un livre dans Critiques.';$('review-form').hidden=true;}else{
$('review-book').innerHTML='<a href="'+bookLink(b)+'">'+esc(b.title)+'</a>';
let review=state.reviews[id];if(review){if(!Array.from($('rating').options).some(o=>o.value===String(ratingValue(review))))$('rating').innerHTML+='<option value="'+ratingValue(review)+'">'+formatNumber(ratingValue(review))+' / 5</option>';$('rating').value=ratingValue(review);$('review').value=review.text;$('spoiler').checked=review.spoiler;}
const paint=()=>document.querySelectorAll('[data-star]').forEach(button=>{button.setAttribute('aria-pressed',String(Number(button.dataset.star)===Number($('rating').value)));button.textContent=Number(button.dataset.star)<=Number($('rating').value)?'★':'☆';});
document.querySelectorAll('[data-star]').forEach(button=>button.onclick=()=>{$('rating').value=button.dataset.star;paint();});$('rating').onchange=paint;paint();drawLocalReview(b);
if($('delete-review')){$('delete-review').hidden=!review;$('delete-review').onclick=async()=>{if(!confirm('Supprimer ta critique enregistrée sur cet appareil ?'))return;delete state.reviews[id];await save();$('review-form').reset();paint();$('delete-review').hidden=true;drawLocalReview(b);};}
$('review-form').onsubmit=async e=>{e.preventDefault();const score=Number($('rating').value);if(!Number.isFinite(score)||score<0||score>5||!$('review').value.trim()){message('Choisis une note sur cinq et rédige ta critique.',true);return;}
state.reviews[id]={rating:score,scale:5,text:$('review').value.trim(),spoiler:$('spoiler').checked,date:new Date().toISOString()};try{await save();drawLocalReview(b);$('delete-review').hidden=false;}catch(err){message(err.message,true);}};}}
if($('profile-form')){$('name').value=state.profile.name||'';$('bio').value=state.profile.bio||'';$('profile-form').onsubmit=async e=>{e.preventDefault();state.profile={name:$('name').value,bio:$('bio').value};await save();};}
bindNoteForm();
lockCatalog();showAccount();
if (service?.user) document.body.addEventListener('click', async event => {
  if (!pendingWrites || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link=event.target.closest?.('a[href]');
  if (!link || link.download || link.target || link.origin!==location.origin || link.getAttribute('href').startsWith('#')) return;
  event.preventDefault();
  await autosaveQueue.catch(()=>{});
  location.href=link.href;
});
if($('question-form'))$('question-form').onsubmit=async e=>{e.preventDefault();state.questions.push({id:uid(),book:$('book-select').value,question:$('question').value,answer:$('answer').value});await save();e.target.reset();renderQuestions();};
if($('design-form')){$('bg').value=state.design.bg||'#f9e9ef';$('accent').value=state.design.accent||'#a95472';$('design-form').onsubmit=async e=>{e.preventDefault();state.design={bg:$('bg').value,accent:$('accent').value};await save();applyDesign();};$('reset-design').onclick=async()=>{state.design={};await save();location.reload();};}
if($('export'))$('export').onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');let url=URL.createObjectURL(blob);a.href=url;a.download='mes-lectures-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);message('Export téléchargé, avec les fichiers importés.');};
if($('import'))$('import').onclick=async()=>{try{let f=$('restore').files[0];if(!f)throw Error('Choisis une sauvegarde JSON.');let data=JSON.parse(await f.text());validate(data);if(!confirm('Remplacer les données locales par cette sauvegarde ? Exporte d’abord si nécessaire.'))return;data.books=state.books;state=data;await save();applyDesign();message('Sauvegarde restaurée.');}catch(err){message(err.message,true);}};
}catch(err){let warning=document.createElement('p');warning.className='note';warning.setAttribute('role','alert');warning.textContent='Le stockage local est indisponible. Utilise un navigateur moderne, autorise son stockage et ouvre le site à une adresse locale stable. Aucune sauvegarde confirmée.';document.getElementById('contenu').prepend(warning);document.querySelectorAll('form button').forEach(x=>x.disabled=true);}}
function validate(data){if(!data||data.version!==1||!['books','notes','highlights','questions'].every(k=>Array.isArray(data[k]))||!data.profile||!data.reviews||!data.design)throw Error('Ce fichier n’est pas une sauvegarde compatible.');for(let b of data.books){if(typeof b.id!=='string'||typeof b.title!=='string'||typeof b.author!=='string'||!GENRES[b.genre]||!Number.isInteger(Number(b.sub))||Number(b.sub)<0||Number(b.sub)>=GENRES[b.genre][1].length)throw Error('Livre invalide dans la sauvegarde.');if(b.cover&&!(/^\/api\/files\/[a-f0-9-]+$/.test(b.cover)||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(b.cover)||/^images\/[a-z0-9\/-]+\.(png|jpg|jpeg|webp)$/.test(b.cover)))throw Error('Couverture invalide.');if(b.detailPath&&!LIVRES_INITIAUX.some(item=>item.id===b.id&&item.detailPath===b.detailPath))throw Error('Page de livre invalide.');if(b.pdfPath&&!/^\/api\/files\/[a-f0-9-]+$/.test(b.pdfPath)&&!LIVRES_INITIAUX.some(item=>item.id===b.id&&item.pdfPath===b.pdfPath))throw Error('Référence PDF invalide.');if(b.pdf&&!/^data:application\/pdf;base64,[A-Za-z0-9+/=\s]+$/.test(b.pdf))throw Error('PDF invalide.');}for(const [bookId,review] of Object.entries(data.reviews)){if(!review||!Number.isFinite(Number(review.rating))||Number(review.rating)<0||Number(review.rating)>(review.scale===5?5:10)||typeof review.text!=='string')throw Error('Critique invalide.');}
for(let h of data.highlights){if(!/^#[0-9a-f]{6}$/i.test(h.color))throw Error('Couleur invalide.');}for(let k of ['bg','accent'])if(data.design[k]&&!/^#[0-9a-f]{6}$/i.test(data.design[k]))throw Error('Couleur du design invalide.');}
// Le portrait remplit l’écran au repos. Le tutoriel garde ensuite son format entier.
document.body?.addEventListener('play', event => {
  if(event.target.matches?.('video.tele-ecran')) event.target.classList.add('tele-en-lecture');
}, true);
window.addEventListener('beforeunload',releaseCurrentPage);
start();
