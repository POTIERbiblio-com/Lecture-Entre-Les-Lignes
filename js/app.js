const ELL_URL='https://cezgcoaokwuobipwfffa.supabase.co',ELL_KEY='sb_publishable_rT-YdocnvHDGqRpwF1Zvkg_EGs_bjj3';let ell=null,ellUser=null,ellFirebaseAuth=null,editorialAdmin=false,catalogueManager=false,readerLevel=0;
async function ellConnect(){if(!ell){const m=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');ell=m.createClient(ELL_URL,ELL_KEY);}return ell;}
async function ellPrivate(action,data){
 const {auth,requestService}=await import('./request-service.js');
 const account=auth.currentUser;
 if(!account||account.uid!==ellUser?.id)throw Error('Le compte a changé. Recharge ton espace.');
 return requestService(action,{kind:'carnet',data},account);
}
function ellClear(){state.notes=[];state.highlights=[];state.questions=[];state.reviews={};state.profile={};state.design={};state.legend={};for(const b of state.books){b.position='';b.pdfPage=1;}}
const GENRES={"fiction":["Fiction",["Roman contemporain","Imaginaire","Suspense","Amour et relations","Histoire et aventure","BD et manga","Poésie et théâtre","Contes et nouvelles","Horreur"]],"savoirs":["Savoirs",["Sciences","Psychologie","Philosophie","Histoire","Économie et politique","Management et entrepreneuriat","Informatique et numérique"]],"arts":["Arts",["Musique","Cinéma","Architecture","Peinture et photographie"]],"vie-et-societe":["Vie et société",["Biographies","Témoignages","Vie pratique","Sociologie","Finances personnelles","Développement personnel"]],"spiritualites":["Spiritualités et religions",["Religions","Spiritualités","Mythes","Ésotérisme"]],"jeunesse":["Jeunesse et pédagogie",["Albums","Romans jeunesse","Documentaires","Apprentissage"]],"voyages":["Voyages et nature",["Récits de voyage","Nature et écologie","Aventure et plein air"]],"creativite":["Créativité et loisirs",["Écriture et carnets","Arts manuels","Mode et design"]],"a-classer":["À classer",["Sans sous-genre"]]};
'use strict';
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db,state,objects=[];let id=new URLSearchParams(location.search).get('id')||$('book-detail')?.dataset.bookId||$('reader-content')?.dataset.bookId;
const LIVRES_INITIAUX=[
{"id":"liv0131","privatePdf":true,"title":"Plus haut que mes rêves","author":"Nicolas Hulot","genre":"vie-et-societe","summary":"Récit personnel dans lequel Nicolas Hulot revient sur son parcours, ses engagements et les liens entre expériences de vie, nature et écologie.","presentation":"Récit personnel dans lequel Nicolas Hulot revient sur son parcours, ses engagements et les liens entre expériences de vie, nature et écologie.","cover":"images/couvertures/liv0131.jpg","pdfPages":259,"chapters":[{"title":"1. EN REGARDANT LES MARÉES","page":4,"summary":"Cette section aborde « 1. EN REGARDANT LES MARÉES ». Les pages correspondantes développent notamment les thèmes de campagne, village, toutes, ainsi que aurait, années. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"2. MA MAISON EST LE MONDE","page":87,"summary":"Cette section aborde « 2. MA MAISON EST LE MONDE ». Les pages correspondantes développent notamment les thèmes de jamais, maison, appris, ainsi que années, peut-être. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"3. USHUAÏA, L’EXTRÊME","page":125,"summary":"Cette section aborde « 3. USHUAÏA, L’EXTRÊME ». Les pages correspondantes développent notamment les thèmes de ushuaïa, émission, jamais, ainsi que aventure, moment. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"4. J’AI VU…","page":217,"summary":"Cette section aborde « 4. J’AI VU… ». Les pages correspondantes développent notamment les thèmes de nature, planète, aujourd, ainsi que autres, beauté. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"5. UNE COMMUNAUTÉ DE CŒUR ET D’ESPRIT","page":234,"summary":"Cette section aborde « 5. UNE COMMUNAUTÉ DE CŒUR ET D’ESPRIT ». Les pages correspondantes développent notamment les thèmes de fondation, quelques, théodore, ainsi que encore, parfois. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"6. L’ESSENTIEL","page":252,"summary":"Cette section aborde « 6. L’ESSENTIEL ». Les pages correspondantes développent notamment les thèmes de enfants, planète, souvent, ainsi que beauté, lorsque. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}]},
{"id":"liv0132","privatePdf":true,"title":"Les survivants de l’Atlantide","author":"Albert Slosman","genre":"fiction","summary":"Récit d’Albert Slosman qui développe une interprétation légendaire des survivants de l’Atlantide et de leurs liens supposés avec l’Égypte ancienne ; ses affirmations historiques ne constituent pas un consensus scientifique.","presentation":"Récit d’Albert Slosman qui développe une interprétation légendaire des survivants de l’Atlantide et de leurs liens supposés avec l’Égypte ancienne ; ses affirmations historiques ne constituent pas un consensus scientifique.","cover":"images/couvertures/liv0132.jpg","pdfPages":289,"chapters":[{"title":"LES PORTES DE L’ÉTRANGE - Collection dirigée par Francis Mazière","page":4,"summary":"Cette section aborde « LES PORTES DE L’ÉTRANGE - Collection dirigée par Francis Mazière ». Les pages correspondantes développent notamment les thèmes de mouvement, platon, trouve, ainsi que centre, fausse. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"... EN GUISE DE PROLÉGOMÈNE","page":5,"summary":"Cette section aborde « ... EN GUISE DE PROLÉGOMÈNE ». Les pages correspondantes développent notamment les thèmes de egypte, atlantide, mouvement, ainsi que platon, trouve. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Introduction","page":7,"summary":"Cette section aborde « Introduction ». Les pages correspondantes développent notamment les thèmes de furent, egypte, rescapés, ainsi que sirius, cataclysme. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE PREMIER - TA MANA ! (Lieu-du-soleil-couchant)","page":28,"summary":"Cette section aborde « Chapitre PREMIER - TA MANA ! (Lieu-du-soleil-couchant) ». Les pages correspondantes développent notamment les thèmes de avaient, rescapés, premier, ainsi que toutes, nouvelle. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE DEUXIÈME - LA VIE REPREND","page":47,"summary":"Cette section aborde « Chapitre DEUXIÈME - LA VIE REPREND ». Les pages correspondantes développent notamment les thèmes de encore, étaient, survivants, ainsi que soleil, durant. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE TROISIÈME - OUSIR-LE-RESSUSCITE","page":64,"summary":"Cette section aborde « Chapitre TROISIÈME - OUSIR-LE-RESSUSCITE ». Les pages correspondantes développent notamment les thèmes de nek-bet, encore, pontife, ainsi que devait, toutes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE QUATRIÈME - HORUS-LE-PUR","page":81,"summary":"Cette section aborde « Chapitre QUATRIÈME - HORUS-LE-PUR ». Les pages correspondantes développent notamment les thèmes de autres, protection, chacun, ainsi que peuple, toujours. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE CINQUIÈME - L’ALLIANCE AVEC DIEU","page":99,"summary":"Cette section aborde « Chapitre CINQUIÈME - L’ALLIANCE AVEC DIEU ». Les pages correspondantes développent notamment les thèmes de pontife, épouse, soleil, ainsi que serait, enseignement. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE SIXIÈME - LA PARABOLIQUE DES NOMBRES","page":114,"summary":"Cette section aborde « Chapitre SIXIÈME - LA PARABOLIQUE DES NOMBRES ». Les pages correspondantes développent notamment les thèmes de soleil, pontife, nouveau, ainsi que ancêtres, dynastie. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE SEPTIÈME - LES RA-SIT-OU (Les rebelles de Sit-Soleil)","page":132,"summary":"Cette section aborde « Chapitre SEPTIÈME - LES RA-SIT-OU (Les rebelles de Sit-Soleil) ». Les pages correspondantes développent notamment les thèmes de soleil, rebelles, arrière, ainsi que encore, pourtant. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE HUITIÈME - « TA OUZ » (La « Demeure » d’Ousir)","page":149,"summary":"Cette section aborde « Chapitre HUITIÈME - « TA OUZ » (La « Demeure » d’Ousir) ». Les pages correspondantes développent notamment les thèmes de avaient, étaient, cuivre, ainsi que premières, ouvertes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE NEUVIÈME - LE GRAND DEUIL","page":165,"summary":"Cette section aborde « Chapitre NEUVIÈME - LE GRAND DEUIL ». Les pages correspondantes développent notamment les thèmes de encore, soleil, premier, ainsi que anepou, avaient. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE DIXIÈME - « LES FORGERONS D’HORUS » (Les masnitiou-hor)","page":179,"summary":"Cette section aborde « Chapitre DIXIÈME - « LES FORGERONS D’HORUS » (Les masnitiou-hor) ». Les pages correspondantes développent notamment les thèmes de forgerons, pêr-ahâ, hor-ou-tit, ainsi que conseil, hommes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE ONZIÈME - LE « SA-AHA-RA » (La terre « Brûlée-par-le-Soleil-Ancien »)","page":194,"summary":"Cette section aborde « Chapitre ONZIÈME - LE « SA-AHA-RA » (La terre « Brûlée-par-le-Soleil-Ancien ») ». Les pages correspondantes développent notamment les thèmes de serait, pontife, familles, ainsi que endroit, méri-net. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE DOUZIÈME - LES TREPANEURS (L’école des « serk-kers », les « ouvreurs-de-crânes ! »)","page":211,"summary":"Cette section aborde « Chapitre DOUZIÈME - LES TREPANEURS (L’école des « serk-kers », les « ouvreurs-de-crânes ! ») ». Les pages correspondantes développent notamment les thèmes de encore, étaient, anepou-sen, ainsi que autres, outils. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE TREIZIÈME - CHRONOLOGIE DES « QUATRE TEMPS »","page":229,"summary":"Cette section aborde « Chapitre TREIZIÈME - CHRONOLOGIE DES « QUATRE TEMPS » ». Les pages correspondantes développent notamment les thèmes de dynasties, royales, annales, ainsi que manéthon, celles. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE QUATORZIÈME - L’ERE DES GEMEAUX (... ou la lutte prédynastique des « Deux Frères »)","page":247,"summary":"Cette section aborde « Chapitre QUATORZIÈME - L’ERE DES GEMEAUX (... ou la lutte prédynastique des « Deux Frères ») ». Les pages correspondantes développent notamment les thèmes de durant, soleil, dynastie, ainsi que premiers, siècles. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"NOTE A : A PROPOS DU TIMÉE DE PLATON.","page":265,"summary":"Cette section aborde « NOTE A : A PROPOS DU TIMÉE DE PLATON ». Les pages correspondantes développent notamment les thèmes de platon, sicile, lettres, ainsi que philosophe, république. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"NOTE B : SUR L’ANTIQUITÉ DU ZODIAQUE DE DENDÉRAH","page":267,"summary":"Cette section aborde « NOTE B : SUR L’ANTIQUITÉ DU ZODIAQUE DE DENDÉRAH ». Les pages correspondantes développent notamment les thèmes de dendérah, afrique, histoire, ainsi que solaire, secondes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Achevé de numériser","page":283,"summary":"Cette section aborde « Achevé de numériser ». Les pages correspondantes développent notamment les thèmes de chapitre, édition, numérique, ainsi que société, support. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Quatrième de couverture","page":286,"summary":"Cette section aborde « Quatrième de couverture ». Les pages correspondantes développent notamment les thèmes de z-library, gateway, knowledge, ainsi que culture, accessible. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}]},
{"id":"liv0133","privatePdf":true,"title":"Les secrets de la loi de l’attraction","author":"Xavier Cornette de Saint-Cyr","genre":"vie-et-societe","summary":"L’auteur examine la loi de l’attraction, ses croyances et ses limites, puis propose un travail sur les objectifs, les motivations et l’imagination.","presentation":"L’auteur examine la loi de l’attraction, ses croyances et ses limites, puis propose un travail sur les objectifs, les motivations et l’imagination.","cover":"images/couvertures/liv0133.jpg","pdfPages":224,"chapters":[{"title":"Introduction","page":7,"summary":"Cette section aborde « Introduction ». Les pages correspondantes développent notamment les thèmes de attraction, autres, quatre, ainsi que vraiment, voulez. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Partie 1. Ce qu’est la loi de l’attraction… et surtout ce qu’elle n’est pas","page":11,"summary":"Cette section aborde « Partie 1. Ce qu’est la loi de l’attraction… et surtout ce qu’elle n’est pas ». Les pages correspondantes développent notamment les thèmes de attraction, pensée, pensées, ainsi que corrélation, illusion. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Partie 2. Qu’est-ce que je veux vraiment ?","page":85,"summary":"Cette section aborde « Partie 2. Qu’est-ce que je veux vraiment ? ». Les pages correspondantes développent notamment les thèmes de est-ce, voulez, vouloir, ainsi que demande, attraction. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Partie 3. La loi de l’attraction pas à pas","page":161,"summary":"Cette section aborde « Partie 3. La loi de l’attraction pas à pas ». Les pages correspondantes développent notamment les thèmes de croyances, autres, vérité, ainsi que comment, attraction. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Conclusion","page":215,"summary":"Cette section aborde « Conclusion ». Les pages correspondantes développent notamment les thèmes de attraction, demande, comment, ainsi que besoin, donner. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Les éditions Leduc.s","page":224,"summary":"Cette section aborde « Les éditions Leduc.s ». Les pages correspondantes développent notamment les thèmes de livres, également, numérique, ainsi que editionsleduc, conseils. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}]},
{"id":"liv0134","privatePdf":true,"title":"L’idéologie néolibérale : ses fondements, ses dégâts","author":"Claude Simon","genre":"savoirs","summary":"Essai critique sur les fondements intellectuels du néolibéralisme, sa diffusion politique et ses conséquences économiques et sociales.","presentation":"Essai critique sur les fondements intellectuels du néolibéralisme, sa diffusion politique et ses conséquences économiques et sociales.","cover":"images/couvertures/liv0134.jpg","pdfPages":136,"chapters":[{"title":"PREMIÈRE PARTIE : Le libéralisme, un système complet et complexe : philosophique, économique et politique","page":14,"summary":"Cette section aborde « PREMIÈRE PARTIE : Le libéralisme, un système complet et complexe : philosophique, économique et politique ». Les pages correspondantes développent notamment les thèmes de libéralisme, première, politique, ainsi que siècle, économique. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"1. Les sources philosophiques, économiques et politiques du libéralisme","page":18,"summary":"Cette section aborde « 1. Les sources philosophiques, économiques et politiques du libéralisme ». Les pages correspondantes développent notamment les thèmes de ricardo, portugal, sources, ainsi que politique, morale. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"2. Les grandes lignes de l'idéologie libérale","page":33,"summary":"Cette section aborde « 2. Les grandes lignes de l'idéologie libérale ». Les pages correspondantes développent notamment les thèmes de libéralisme, individus, pensée, ainsi que propriété, citoyen. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"3. Le libéralisme en jugement","page":42,"summary":"Cette section aborde « 3. Le libéralisme en jugement ». Les pages correspondantes développent notamment les thèmes de libéralisme, économique, société, ainsi que individus, encore. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"DEUXIÈME PARTIE : L'idéologie néolibérale","page":54,"summary":"Cette section aborde « DEUXIÈME PARTIE : L'idéologie néolibérale ». Les pages correspondantes développent notamment les thèmes de l'idéologie, libéralisme, néolibérale, ainsi que néolibéralisme, économique. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"4. Les sources de l'idéologie néolibérale","page":56,"summary":"Cette section aborde « 4. Les sources de l'idéologie néolibérale ». Les pages correspondantes développent notamment les thèmes de économique, société, l'idéologie, ainsi que néoubérale, politique. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"5. L'idéologie néo libérale","page":64,"summary":"Cette section aborde « 5. L'idéologie néo libérale ». Les pages correspondantes développent notamment les thèmes de friedman, l'idéologie, sociale, ainsi que l'état, l'économie. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"6. La mise en oeuvre de l'idéologie néolibérale depuis la décennie quatre-vingt","page":72,"summary":"Cette section aborde « 6. La mise en oeuvre de l'idéologie néolibérale depuis la décennie quatre-vingt ». Les pages correspondantes développent notamment les thèmes de marchés, entreprises, l'idéologie, ainsi que niveau, diminution. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"TROISIÈME PARTIE : Une société future sous l'empire du néolibéralisme ?","page":88,"summary":"Cette section aborde « TROISIÈME PARTIE : Une société future sous l'empire du néolibéralisme ? ». Les pages correspondantes développent notamment les thèmes de finance, société, politique, ainsi que droits, néolibéralisme. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"7. Une finance toujours plus dominante ?","page":90,"summary":"Cette section aborde « 7. Une finance toujours plus dominante ? ». Les pages correspondantes développent notamment les thèmes de finance, financiers, entreprises, ainsi que marchés, activités. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"8. Des individus en concurrence permanente ?","page":94,"summary":"Cette section aborde « 8. Des individus en concurrence permanente ? ». Les pages correspondantes développent notamment les thèmes de concurrence, permanente, surtout, ainsi que compétition, siècle. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"9. Un État servile ou mis sous tension pour mieux servir l'économie ?","page":102,"summary":"Cette section aborde « 9. Un État servile ou mis sous tension pour mieux servir l'économie ? ». Les pages correspondantes développent notamment les thèmes de secret, servile, affaires, ainsi que contre, serait. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}]},
{"id":"liv0135","privatePdf":true,"title":"400 citations pour le manager stratège","author":"Luc Boyer et Romain Bureau","genre":"savoirs","summary":"Recueil de citations organisées autour des décisions, de l’innovation, de la mise en œuvre, des relations humaines et de l’éthique managériale.","presentation":"Recueil de citations organisées autour des décisions, de l’innovation, de la mise en œuvre, des relations humaines et de l’éthique managériale.","cover":"images/couvertures/liv0135.jpg","pdfPages":125,"chapters":[{"title":"Anticiper et décider","page":11,"summary":"Cette section traite de « Anticiper et décider ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Innover et remettre en cause","page":27,"summary":"Cette section traite de « Innover et remettre en cause ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Mettre en œuvre","page":41,"summary":"Cette section traite de « Mettre en œuvre ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Produire et vendre","page":59,"summary":"Cette section traite de « Produire et vendre ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Manager les ressources humaines","page":67,"summary":"Cette section traite de « Manager les ressources humaines ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Comprendre les attitudes et comportements","page":79,"summary":"Cette section traite de « Comprendre les attitudes et comportements ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Communiquer","page":87,"summary":"Cette section traite de « Communiquer ». Le document original reste la référence pour le détail des arguments et des exemples."},{"title":"Respecter l’éthique","page":103,"summary":"Cette section traite de « Respecter l’éthique ». Le document original reste la référence pour le détail des arguments et des exemples."}]},
{"id":"liv0136","privatePdf":true,"title":"L’Ego est l’ennemi","author":"Ryan Holiday","genre":"vie-et-societe","summary":"Ryan Holiday explore la manière dont l’ego peut perturber les ambitions, la réussite et la réaction à l’échec.","presentation":"Ryan Holiday explore la manière dont l’ego peut perturber les ambitions, la réussite et la réaction à l’échec.","cover":"images/couvertures/liv0136.jpg","pdfPages":191,"chapters":[{"title":"Le prologue qui fait mal","page":11,"summary":"Cette section aborde « Le prologue qui fait mal ». Les pages correspondantes développent notamment les thèmes de peut-être, autres, étaient, ainsi que personnes, réussite. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Introduction","page":17,"summary":"Cette section aborde « Introduction ». Les pages correspondantes développent notamment les thèmes de sherman, autres, isocrate, ainsi que humilité, général. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Première partie: L’aspiration","page":25,"summary":"Cette section aborde « Première partie: L’aspiration ». Les pages correspondantes développent notamment les thèmes de talent, sherman, autres, ainsi que serez-vous, ennemi. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Quelles que soient vos aspirations, l’ego est votre ennemi…","page":26,"summary":"Cette section aborde « Quelles que soient vos aspirations, l’ego est votre ennemi… ». Les pages correspondantes développent notamment les thèmes de parler, campagne, silence, ainsi que autres, encore. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Parler, parler et parler encore","page":33,"summary":"Cette section aborde « Parler, parler et parler encore ». Les pages correspondantes développent notamment les thèmes de est-ce, quelque, autres, ainsi que devenir, travail. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Être ou faire?","page":38,"summary":"Cette section aborde « Être ou faire? ». Les pages correspondantes développent notamment les thèmes de hammett, satriani, apprendre, ainsi que guitariste, devenir. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"L’éternel étudiant","page":44,"summary":"Cette section aborde « L’éternel étudiant ». Les pages correspondantes développent notamment les thèmes de passion, autres, objectif, ainsi que eleanor, étaient. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Éviter de s’emballer","page":50,"summary":"Cette section aborde « Éviter de s’emballer ». Les pages correspondantes développent notamment les thèmes de autres, personne, stratégie, ainsi que martial, franklin. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"La stratégie de la toile vierge","page":56,"summary":"Cette section aborde « La stratégie de la toile vierge ». Les pages correspondantes développent notamment les thèmes de robinson, jackie, joueur, ainsi que jamais, baseball. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Se retenir","page":62,"summary":"Cette section aborde « Se retenir ». Les pages correspondantes développent notamment les thèmes de mcclellan, encore, sommes, ainsi que réalité, fiction. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Sortir de sa tête","page":67,"summary":"Cette section aborde « Sortir de sa tête ». Les pages correspondantes développent notamment les thèmes de orgueil, fierté, encore, ainsi que franklin, travail. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Le danger de l’orgueil précoce","page":73,"summary":"Cette section aborde « Le danger de l’orgueil précoce ». Les pages correspondantes développent notamment les thèmes de travail, travailler, est-ce, ainsi que ambition, simplement. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Travailler, travailler et travailler encore","page":78,"summary":"Cette section aborde « Travailler, travailler et travailler encore ». Les pages correspondantes développent notamment les thèmes de hughes, entreprise, dollars, ainsi que millions, travail. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Pour toute la suite, l’ego est l’ennemi…","page":83,"summary":"Cette section aborde « Pour toute la suite, l’ego est l’ennemi… ». Les pages correspondantes développent notamment les thèmes de hughes, howard, réussite, ainsi que dollars, affaires. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Deuxième partie: La réussite","page":86,"summary":"Cette section aborde « Deuxième partie: La réussite ». Les pages correspondantes développent notamment les thèmes de gengis, culture, valeurs, ainsi que réussite, mongols. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Quelle que soit votre réussite, l’ego en est l’ennemi","page":87,"summary":"Cette section aborde « Quelle que soit votre réussite, l’ego en est l’ennemi ». Les pages correspondantes développent notamment les thèmes de apprendre, mongols, apprentissage, ainsi que histoire, culture. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Toujours apprendre","page":93,"summary":"Cette section aborde « Toujours apprendre ». Les pages correspondantes développent notamment les thèmes de victoire, histoire, normes, ainsi que étaient, vision. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Ne pas se raconter d’histoires","page":98,"summary":"Cette section aborde « Ne pas se raconter d’histoires ». Les pages correspondantes développent notamment les thèmes de autres, important, choses, ainsi que savoir, pourquoi. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Qu’est-ce qui est important à vos yeux?","page":104,"summary":"Cette section aborde « Qu’est-ce qui est important à vos yeux? ». Les pages correspondantes développent notamment les thèmes de pouvoir, eisenhower, réalité, ainsi que choses, président. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Droit, contrôle et paranoïa","page":109,"summary":"Cette section aborde « Droit, contrôle et paranoïa ». Les pages correspondantes développent notamment les thèmes de delorean, autres, étaient, ainsi que choses, marshall. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Se gérer","page":114,"summary":"Cette section aborde « Se gérer ». Les pages correspondantes développent notamment les thèmes de marshall, autres, sommes, ainsi que général, partie. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Gare à la maladie du moi","page":119,"summary":"Cette section aborde « Gare à la maladie du moi ». Les pages correspondantes développent notamment les thèmes de sommes, toujours, angela, ainsi que merkel, pouvoir. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Méditer sur l’immensité","page":124,"summary":"Cette section aborde « Méditer sur l’immensité ». Les pages correspondantes développent notamment les thèmes de aristote, merkel, autres, ainsi que toujours, pouvoir. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Rester sobre","page":128,"summary":"Cette section aborde « Rester sobre ». Les pages correspondantes développent notamment les thèmes de katharine, graham, peut-être, ainsi que objectif, société. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Pour ce qui arrive souvent par la suite, l’ego est l’ennemi…","page":133,"summary":"Cette section aborde « Pour ce qui arrive souvent par la suite, l’ego est l’ennemi… ». Les pages correspondantes développent notamment les thèmes de katharine, graham, autres, ainsi que années, conseil. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Troisième partie: L’échec","page":136,"summary":"Cette section aborde « Troisième partie: L’échec ». Les pages correspondantes développent notamment les thèmes de graham, choses, problème, ainsi que pourquoi, autres. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"De tous les échecs et défis que vous rencontrerez, l’ego est l’ennemi","page":137,"summary":"Cette section aborde « De tous les échecs et défis que vous rencontrerez, l’ego est l’ennemi ». Les pages correspondantes développent notamment les thèmes de prison, malcolm, années, ainsi que choses, comment. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Temps vif ou temps mort?","page":146,"summary":"Cette section aborde « Temps vif ou temps mort? ». Les pages correspondantes développent notamment les thèmes de travail, résultat, autres, ainsi que aurait, serait. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"L’effort est suffisant","page":150,"summary":"Cette section aborde « L’effort est suffisant ». Les pages correspondantes développent notamment les thèmes de choses, moment, personne, ainsi que comment, parfois. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Les moments Fight Club","page":155,"summary":"Cette section aborde « Les moments Fight Club ». Les pages correspondantes développent notamment les thèmes de société, avaient, choses, ainsi que situation, toutes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}]},
{"id":"liv0137","title":"Vendre ou perdre","author":"Grant Cardone","genre":"savoirs","summary":"Grant Cardone présente la vente comme une compétence qui dépasse le commerce : savoir convaincre, comprendre l’acheteur, établir la confiance, traiter les objections et entretenir une relation. Les chapitres sont accompagnés de questions de mise en pratique.","cover":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/couvertures/liv0137.jpg","pdfPath":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/pdf/liv0137.pdf","pdfPages":223,"chapters":[{"title":"Chapitre Un - La Vente — Un mode de Vie","page":19,"summary":"Cette section aborde « Chapitre Un - La Vente — Un mode de Vie ». Les pages correspondantes développent notamment les thèmes de vendre, commission, personne, ainsi que convaincre, quelque. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Deux - Les commerciaux font tourner le monde","page":29,"summary":"Cette section aborde « Chapitre Deux - Les commerciaux font tourner le monde ». Les pages correspondantes développent notamment les thèmes de vendre, commerciaux, écoles, ainsi que pouvez, perdre. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Trois - Professionnel ou amateur","page":35,"summary":"Cette section aborde « Chapitre Trois - Professionnel ou amateur ». Les pages correspondantes développent notamment les thèmes de vendre, professionnel, devenir, ainsi que vendeurs, perdre. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre quatre - Les grands","page":41,"summary":"Cette section aborde « Chapitre quatre - Les grands ». Les pages correspondantes développent notamment les thèmes de carrière, résultats, vendre, ainsi que j'étais, prédire. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre cinq - La vente la plus importante","page":53,"summary":"Cette section aborde « Chapitre cinq - La vente la plus importante ». Les pages correspondantes développent notamment les thèmes de convaincu, produit, vendre, ainsi que conviction, quelque. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre six - Le mythe du prix","page":65,"summary":"Cette section aborde « Chapitre six - Le mythe du prix ». Les pages correspondantes développent notamment les thèmes de produit, problème, vendre, ainsi que vraiment, est-ce. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre sept - L'argent de vos acheteurs","page":75,"summary":"Cette section aborde « Chapitre sept - L'argent de vos acheteurs ». Les pages correspondantes développent notamment les thèmes de l'argent, d'argent, décision, ainsi que qu'ils, vendre. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre huit - Vous êtes dans le business des relations sociales","page":83,"summary":"Cette section aborde « Chapitre huit - Vous êtes dans le business des relations sociales ». Les pages correspondantes développent notamment les thèmes de produit, produits, business, ainsi que vendre, relations. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre neuf - La magie d'être en accord","page":93,"summary":"Cette section aborde « Chapitre neuf - La magie d'être en accord ». Les pages correspondantes développent notamment les thèmes de d'accord, raison, client, ainsi que accord, désaccord. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Dix - Établir la confiance","page":101,"summary":"Cette section aborde « Chapitre Dix - Établir la confiance ». Les pages correspondantes développent notamment les thèmes de l'acheteur, confiance, qu'ils, ainsi que méfiance, lorsque. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Onze - Donner, donner, donner","page":111,"summary":"Cette section aborde « Chapitre Onze - Donner, donner, donner ». Les pages correspondantes développent notamment les thèmes de donner, service, vendre, ainsi que client, clients. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Douze - La vente agressive","page":119,"summary":"Cette section aborde « Chapitre Douze - La vente agressive ». Les pages correspondantes développent notamment les thèmes de agressive, conclure, vendre, ainsi que perdre, jamais. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre treize - Actions massives","page":125,"summary":"Cette section aborde « Chapitre treize - Actions massives ». Les pages correspondantes développent notamment les thèmes de actions, d'actions, quantité, ainsi que jamais, massives. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre quatorze - Sa base de contacts","page":133,"summary":"Cette section aborde « Chapitre quatorze - Sa base de contacts ». Les pages correspondantes développent notamment les thèmes de contacts, personnes, vendre, ainsi que qu'ils, contact. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre quinze - Le temps","page":141,"summary":"Cette section aborde « Chapitre quinze - Le temps ». Les pages correspondantes développent notamment les thèmes de déjeuner, clients, combien, ainsi que vendre, qu'ils. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre seize - L'attitude","page":147,"summary":"Cette section aborde « Chapitre seize - L'attitude ». Les pages correspondantes développent notamment les thèmes de attitude, produit, personne, ainsi que positive, qu'elle. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre dix-sept - La plus grosse vente de ma vie","page":157,"summary":"Cette section aborde « Chapitre dix-sept - La plus grosse vente de ma vie ». Les pages correspondantes développent notamment les thèmes de qu'elle, j'étais, vendre, ainsi que voulez, j'avais. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"chapitre dix-sept","page":161,"summary":"Cette section aborde « chapitre dix-sept ». Les pages correspondantes développent notamment les thèmes de l'acheteur, comment, chapitre, ainsi que procédé, processus. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre dix-huit - Le procédé de vente parfait","page":163,"summary":"Cette section aborde « Chapitre dix-huit - Le procédé de vente parfait ». Les pages correspondantes développent notamment les thèmes de processus, client, produit, ainsi que choses, l'acheteur. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre dix-neuf - Le succès dans la vente","page":171,"summary":"Cette section aborde « Chapitre dix-neuf - Le succès dans la vente ». Les pages correspondantes développent notamment les thèmes de succès, qu'ils, devoir, ainsi que honnête, vendre. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Vingt - Astuces sur la formation à la vente","page":177,"summary":"Cette section aborde « Chapitre Vingt - Astuces sur la formation à la vente ». Les pages correspondantes développent notamment les thèmes de formation, vendre, sociaux, ainsi que comment, ventes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre Vingt-et-un - Créez une présence sur les réseaux sociaux","page":181,"summary":"Cette section aborde « Chapitre Vingt-et-un - Créez une présence sur les réseaux sociaux ». Les pages correspondantes développent notamment les thèmes de sociaux, réseaux, réputation, ainsi que vendre, perdre. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}],"favoritesEnabled":true,"readingListsEnabled":true,"reviews":{"analyse":"Le ton énergique et les exercices peuvent aider à prendre confiance dans une activité commerciale. Certaines méthodes insistent fortement sur la persuasion et l’intensité de l’action ; elles doivent être mises en balance avec l’écoute, le consentement et une éthique commerciale durable.","public_cible":"Commerciaux débutants, indépendants et entrepreneurs.","nature":"Analyse originale rédigée pour le catalogue, et non avis publié par un tiers"},"externalReviews":[],"presentation":"Grant Cardone présente la vente comme une compétence qui dépasse le commerce : savoir convaincre, comprendre l’acheteur, établir la confiance, traiter les objections et entretenir une relation. Les chapitres sont accompagnés de questions de mise en pratique.","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","sub":"0"},
{"id":"liv0138","title":"10 points clés pour réussir","author":"Jean-Philippe Tixier","genre":"savoirs","summary":"Jean-Philippe Tixier organise son guide autour de dix points de pilotage d’une petite entreprise : choix de direction, stratégie, clientèle, développement et gestion. Il privilégie les questions concrètes auxquelles un dirigeant isolé doit répondre.","cover":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/couvertures/liv0138.jpg","pdfPath":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/pdf/liv0138.pdf","pdfPages":205,"chapters":[{"title":"Clé n° 1 D'ABORD, OÙ VOULEZ-VOUS ALLER ?","page":17,"summary":"Cette section aborde « Clé n° 1 D'ABORD, OÙ VOULEZ-VOUS ALLER ? ». Les pages correspondantes développent notamment les thèmes de comment, objectifs, objectif, ainsi que etes-vous, d'abord. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 2 ET SAVEZ-VOUS COMMENT Y ALLER ?","page":25,"summary":"Cette section aborde « Clé n° 2 ET SAVEZ-VOUS COMMENT Y ALLER ? ». Les pages correspondantes développent notamment les thèmes de stratégie, qualité, entreprise, ainsi que choisir, marché. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 3 QUELS CLENTS VOULEZ-VOUS CONQUÉRIR ?","page":51,"summary":"Cette section aborde « Clé n° 3 QUELS CLENTS VOULEZ-VOUS CONQUÉRIR ? ». Les pages correspondantes développent notamment les thèmes de clients, comment, clientèle, ainsi que sont-ils, combien. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 4 COMMENT ATTIREZ-VOUS LA CLIENTÈLE ?","page":55,"summary":"Cette section aborde « Clé n° 4 COMMENT ATTIREZ-VOUS LA CLIENTÈLE ? ». Les pages correspondantes développent notamment les thèmes de client, clientèle, enance, ainsi que comment, devant. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 5 VOUS SERVEZ-VOUS BIEN DU TÉLÉPHONE ?","page":87,"summary":"Cette section aborde « Clé n° 5 VOUS SERVEZ-VOUS BIEN DU TÉLÉPHONE ? ». Les pages correspondantes développent notamment les thèmes de téléphone, ennemi, téléphonique, ainsi que interlocuteur, client. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 6 VOS DEVIS SONT-ILS VENDEURS ?","page":101,"summary":"Cette section aborde « Clé n° 6 VOS DEVIS SONT-ILS VENDEURS ? ». Les pages correspondantes développent notamment les thèmes de client, décideur, motivations, ainsi que outils, fournisseur. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 7 SAVEZ-VOUS DÉFENDRE VOS PRIX ?","page":119,"summary":"Cette section aborde « Clé n° 7 SAVEZ-VOUS DÉFENDRE VOS PRIX ? ». Les pages correspondantes développent notamment les thèmes de client, défendre, prendre, ainsi que vendre, entretien. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 8 VOUS APPUYEZ-VOUS BIEN SUR VOS COLLABORATEURS ?","page":131,"summary":"Cette section aborde « Clé n° 8 VOUS APPUYEZ-VOUS BIEN SUR VOS COLLABORATEURS ? ». Les pages correspondantes développent notamment les thèmes de entreprise, collaborateurs, motivation, ainsi que travail, théorie. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 9 APRÈS LES TRAVAUX, QUE FAITES-VOUS ?","page":159,"summary":"Cette section aborde « Clé n° 9 APRÈS LES TRAVAUX, QUE FAITES-VOUS ? ». Les pages correspondantes développent notamment les thèmes de client, bonjour, lettre, ainsi que magasin, clients. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Clé n° 10 QUELLE EST VOTRE IMAGE ?","page":181,"summary":"Cette section aborde « Clé n° 10 QUELLE EST VOTRE IMAGE ? ». Les pages correspondantes développent notamment les thèmes de dépliant, comment, événement, ainsi que autres, maintenant. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}],"favoritesEnabled":true,"readingListsEnabled":true,"reviews":{"analyse":"L’approche par questions est utile pour structurer un projet et éviter de négliger les fondamentaux. Les exemples et le cadre réglementaire peuvent avoir vieilli : les aspects juridiques, fiscaux et administratifs doivent être vérifiés avec des sources actuelles.","public_cible":"Autoentrepreneurs, artisans, indépendants et dirigeants de TPE.","nature":"Analyse originale rédigée pour le catalogue, et non avis publié par un tiers"},"externalReviews":[],"presentation":"Jean-Philippe Tixier organise son guide autour de dix points de pilotage d’une petite entreprise : choix de direction, stratégie, clientèle, développement et gestion. Il privilégie les questions concrètes auxquelles un dirigeant isolé doit répondre.","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","sub":"0"},
{"id":"liv0139","title":"La puissance de votre subconscient","author":"Joseph Murphy","genre":"spiritualites","summary":"Joseph Murphy défend l’idée que les croyances et les suggestions adressées au subconscient influencent les habitudes, la confiance et les comportements. Il présente des récits et des exercices d’affirmation ou de visualisation.","cover":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/couvertures/liv0139.jpg","pdfPath":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/pdf/liv0139.pdf","pdfPages":322,"chapters":[{"title":"CHAPITRE 1 - Le trésor qui est en vous","page":23,"summary":"Cette section aborde « Chapitre 1 - Le trésor qui est en vous ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, puissance, ainsi que pouvez, conscient. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 2 - Le mécanisme de votre esprit","page":39,"summary":"Cette section aborde « Chapitre 2 - Le mécanisme de votre esprit ». Les pages correspondantes développent notamment les thèmes de esprit, subconscient, conscient, ainsi que pensées, suggestion. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 3 - La puissance miraculeuse de votre subconscient","page":60,"summary":"Cette section aborde « Chapitre 3 - La puissance miraculeuse de votre subconscient ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, puissance, ainsi que conscient, pensées. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 4 - Les guérisons par l’esprit dans l’Antiquité","page":74,"summary":"Cette section aborde « Chapitre 4 - Les guérisons par l’esprit dans l’Antiquité ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, puissance, ainsi que guérisons, toutes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 5 - Les guérisons par l’esprit dans les temps modernes","page":89,"summary":"Cette section aborde « Chapitre 5 - Les guérisons par l’esprit dans les temps modernes ». Les pages correspondantes développent notamment les thèmes de esprit, subconscient, puissance, ainsi que guérison, principe. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 6 - Les techniques de guérison mentale","page":102,"summary":"Cette section aborde « Chapitre 6 - Les techniques de guérison mentale ». Les pages correspondantes développent notamment les thèmes de esprit, subconscient, prière, ainsi que pensée, technique. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 7 - Le subconscient tend vers la vie","page":122,"summary":"Cette section aborde « Chapitre 7 - Le subconscient tend vers la vie ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, harmonie, ainsi que conscient, système. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 8 - La voie vers la réussite","page":131,"summary":"Cette section aborde « Chapitre 8 - La voie vers la réussite ». Les pages correspondantes développent notamment les thèmes de subconscient, lorsque, esprit, ainsi que imagination, réponse. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 9 - Le subconscient, la voie vers la richesse","page":142,"summary":"Cette section aborde « Chapitre 9 - Le subconscient, la voie vers la richesse ». Les pages correspondantes développent notamment les thèmes de richesse, subconscient, esprit, ainsi que déclaration, toujours. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 10 - Le droit à la richesse","page":152,"summary":"Cette section aborde « Chapitre 10 - Le droit à la richesse ». Les pages correspondantes développent notamment les thèmes de argent, richesse, subconscient, ainsi que esprit, toujours. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 11 - Le subconscient, l’auxiliaire du succès","page":164,"summary":"Cette section aborde « Chapitre 11 - Le subconscient, l’auxiliaire du succès ». Les pages correspondantes développent notamment les thèmes de succès, subconscient, esprit, ainsi que maison, comment. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 12 - Les savants recourent au subconscient","page":180,"summary":"Cette section aborde « Chapitre 12 - Les savants recourent au subconscient ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, réponse, ainsi que problème, comment. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 13 - Le subconscient et les merveilles du sommeil","page":193,"summary":"Cette section aborde « Chapitre 13 - Le subconscient et les merveilles du sommeil ». Les pages correspondantes développent notamment les thèmes de sommeil, subconscient, toutes, ainsi que esprit, problèmes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 14 - Le subconscient et les problèmes conjugaux","page":205,"summary":"Cette section aborde « Chapitre 14 - Le subconscient et les problèmes conjugaux ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, mariage, ainsi que problèmes, qualités. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 15 - Le subconscient et le bonheur","page":220,"summary":"Cette section aborde « Chapitre 15 - Le subconscient et le bonheur ». Les pages correspondantes développent notamment les thèmes de bonheur, toutes, heureux, ainsi que aujourd, subconscient. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 16 - Le subconscient et les relations harmonieuses","page":231,"summary":"Cette section aborde « Chapitre 16 - Le subconscient et les relations harmonieuses ». Les pages correspondantes développent notamment les thèmes de autres, subconscient, esprit, ainsi que envers, faites. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 17 - Le subconscient, un outil de pardon","page":248,"summary":"Cette section aborde « Chapitre 17 - Le subconscient, un outil de pardon ». Les pages correspondantes développent notamment les thèmes de pardon, pardonner, subconscient, ainsi que esprit, consiste. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 18 - Le subconscient, un outil pour supprimer les blocages mentaux","page":265,"summary":"Cette section aborde « Chapitre 18 - Le subconscient, un outil pour supprimer les blocages mentaux ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, habitude, ainsi que lorsque, mentale. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 19 - Le subconscient, un outil pour vaincre la peur","page":280,"summary":"Cette section aborde « Chapitre 19 - Le subconscient, un outil pour vaincre la peur ». Les pages correspondantes développent notamment les thèmes de subconscient, esprit, lorsque, ainsi que pensées, devant. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"CHAPITRE 20 - Le subconscient, un outil pour rester jeune d’esprit","page":297,"summary":"Cette section aborde « Chapitre 20 - Le subconscient, un outil pour rester jeune d’esprit ». Les pages correspondantes développent notamment les thèmes de esprit, vieillesse, années, ainsi que jamais, sagesse. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}],"favoritesEnabled":true,"readingListsEnabled":true,"reviews":{"analyse":"Le livre peut encourager une réflexion sur le dialogue intérieur et les habitudes de pensée. Il mêle toutefois témoignages et affirmations très larges sur les effets du subconscient ; celles-ci ne doivent pas être considérées comme des preuves scientifiques ou des traitements médicaux.","public_cible":"Lecteurs curieux de psychologie populaire et de méthodes d’autosuggestion.","nature":"Analyse originale rédigée pour le catalogue, et non avis publié par un tiers"},"externalReviews":[],"presentation":"Joseph Murphy défend l’idée que les croyances et les suggestions adressées au subconscient influencent les habitudes, la confiance et les comportements. Il présente des récits et des exercices d’affirmation ou de visualisation.","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","sub":"0"},
{"id":"liv0140","title":"À la poursuite du Soleil","author":"Linda Geddes","genre":"savoirs","summary":"Linda Geddes enquête sur les effets de la lumière solaire sur la santé, le sommeil, l’horloge biologique et les rythmes de vie. Elle relie études scientifiques, rencontres et observations sur l’exposition quotidienne à la lumière.","cover":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/couvertures/liv0140.jpg","pdfPath":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/pdf/liv0140.pdf","pdfPages":288,"chapters":[{"title":"Introduction","page":5,"summary":"Cette section aborde « Introduction ». Les pages correspondantes développent notamment les thèmes de soleil, lumière, organisme, ainsi que désert, plantes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Les horloges biologiques","page":25,"summary":"Cette section aborde « Les horloges biologiques ». Les pages correspondantes développent notamment les thèmes de horloge, horloges, heures, ainsi que cellules, journée. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Le corps électrique","page":55,"summary":"Cette section aborde « Le corps électrique ». Les pages correspondantes développent notamment les thèmes de lumière, lampes, lorsque, ainsi que électrique, étaient. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Le travail posté","page":89,"summary":"Cette section aborde « Le travail posté ». Les pages correspondantes développent notamment les thèmes de sommeil, heures, lumière, ainsi que pendant, décalage. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Docteur Soleil","page":117,"summary":"Cette section aborde « Docteur Soleil ». Les pages correspondantes développent notamment les thèmes de soleil, lumière, finsen, ainsi que visage, rayons. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Un facteur de protection","page":144,"summary":"Cette section aborde « Un facteur de protection ». Les pages correspondantes développent notamment les thèmes de vitamine, soleil, sclérose, ainsi que plaques, personnes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Un côté sombre","page":164,"summary":"Cette section aborde « Un côté sombre ». Les pages correspondantes développent notamment les thèmes de lumière, personnes, humeur, ainsi que dépression, patients. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Le soleil de minuit","page":186,"summary":"Cette section aborde « Le soleil de minuit ». Les pages correspondantes développent notamment les thèmes de soleil, lumière, solstice, ainsi que chambre, newgrange. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Une cure de lumière","page":199,"summary":"Cette section aborde « Une cure de lumière ». Les pages correspondantes développent notamment les thèmes de patients, sommeil, dépression, ainsi que lumière, rythmes. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Le réglage de l'horloge","page":226,"summary":"Cette section aborde « Le réglage de l'horloge ». Les pages correspondantes développent notamment les thèmes de lumière, horaire, astronautes, ainsi que station, sommeil. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Les horloges sociales","page":241,"summary":"Cette section aborde « Les horloges sociales ». Les pages correspondantes développent notamment les thèmes de kissingen, sommeil, horaires, ainsi que changement, heures. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Épilogue","page":261,"summary":"Cette section aborde « Épilogue ». Les pages correspondantes développent notamment les thèmes de soleil, solstice, cercle, ainsi que stonehenge, pendant. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}],"favoritesEnabled":true,"readingListsEnabled":true,"reviews":{"analyse":"L’ouvrage se distingue par une démarche de vulgarisation fondée sur des travaux scientifiques et par ses exemples accessibles. Il ne faut pas transformer ses observations en conseils universels d’exposition : les risques liés aux UV et les situations médicales individuelles restent déterminants.","public_cible":"Lecteurs de sciences, sommeil, santé publique et environnement.","nature":"Analyse originale rédigée pour le catalogue, et non avis publié par un tiers"},"externalReviews":[],"presentation":"Linda Geddes enquête sur les effets de la lumière solaire sur la santé, le sommeil, l’horloge biologique et les rythmes de vie. Elle relie études scientifiques, rencontres et observations sur l’exposition quotidienne à la lumière.","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","sub":"0"},
{"id":"liv0141","title":"Soigner avec l’énergie : les thérapies quantiques et psycho-énergétiques","author":"Luc Bodin","genre":"savoirs","summary":"Luc Bodin présente des traditions et pratiques dites énergétiques, puis décrit des dispositifs et approches qu’il associe aux « thérapies quantiques » ou psycho-énergétiques. L’ouvrage mêle histoire des pratiques et interprétations personnelles.","cover":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/couvertures/liv0141.jpg","pdfPath":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/pdf/liv0141.pdf","pdfPages":194,"chapters":[{"title":"Chapitre 1 : L’énergie dans les médecines traditionnelles","page":16,"summary":"Cette section aborde « Chapitre 1 : L’énergie dans les médecines traditionnelles ». Les pages correspondantes développent notamment les thèmes de énergie, heures, énergies, ainsi que esprit, guérisseurs. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 2 : Les médecines modernes","page":37,"summary":"Cette section aborde « Chapitre 2 : Les médecines modernes ». Les pages correspondantes développent notamment les thèmes de médecine, conventionnelle, maladie, ainsi que maladies, médecines. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 3 : Les appareils énergétiques","page":48,"summary":"Cette section aborde « Chapitre 3 : Les appareils énergétiques ». Les pages correspondantes développent notamment les thèmes de appareil, appareils, résultats, ainsi que malade, énergies. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 4 : Le trait d’union","page":52,"summary":"Cette section aborde « Chapitre 4 : Le trait d’union ». Les pages correspondantes développent notamment les thèmes de énergie, physique, quantique, ainsi que matière, univers. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 5 : Constitution énergétique de l’être humain","page":63,"summary":"Cette section aborde « Chapitre 5 : Constitution énergétique de l’être humain ». Les pages correspondantes développent notamment les thèmes de énergie, physique, énergies, ainsi que énergétiques, humain. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 6 : Les soins énergétiques Premium®","page":70,"summary":"Cette section aborde « Chapitre 6 : Les soins énergétiques Premium® ». Les pages correspondantes développent notamment les thèmes de énergétiques, niveau, subtils, ainsi que énergétique, personne. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre7 : Les thérapies psycho-énergétiques","page":111,"summary":"Cette section aborde « Chapitre7 : Les thérapies psycho-énergétiques ». Les pages correspondantes développent notamment les thèmes de problème, points, technique, ainsi que traiter, énergétiques. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 8 : Développez votre pouvoir créateur","page":124,"summary":"Cette section aborde « Chapitre 8 : Développez votre pouvoir créateur ». Les pages correspondantes développent notamment les thèmes de méditation, pouvoir, univers, ainsi que autres, télévision. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Chapitre 9 : Les nouvelles énergies","page":173,"summary":"Cette section aborde « Chapitre 9 : Les nouvelles énergies ». Les pages correspondantes développent notamment les thèmes de énergies, nouvelles, années, ainsi que énergétiques, subtils. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}],"favoritesEnabled":true,"readingListsEnabled":true,"reviews":{"analyse":"Le livre offre un panorama des croyances et pratiques du secteur. Le vocabulaire quantique employé ne constitue pas, à lui seul, une validation physique ou clinique : plusieurs techniques décrites n’ont pas démontré leur efficacité thérapeutique. Ne pas substituer ces pratiques à un diagnostic ou à des soins éprouvés.","public_cible":"Lecteurs étudiant les médecines alternatives avec un regard critique.","nature":"Analyse originale rédigée pour le catalogue, et non avis publié par un tiers"},"externalReviews":[],"presentation":"Luc Bodin présente des traditions et pratiques dites énergétiques, puis décrit des dispositifs et approches qu’il associe aux « thérapies quantiques » ou psycho-énergétiques. L’ouvrage mêle histoire des pratiques et interprétations personnelles.","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","sub":"0"},
{"id":"liv0142","title":"Optimiser son temps facilement","author":"Aurélien Vezzani","genre":"savoirs","summary":"Aurélien Vezzani propose des techniques pour organiser son quotidien, définir des priorités, planifier les activités et limiter la dispersion. Il s’appuie sur son expérience et sur des outils pratiques de gestion du temps.","cover":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/couvertures/liv0142.jpg","pdfPath":"Entre_les_lignes_lot_02_6_livres_favoris_listes/lot_02_6_livres/pdf/liv0142.pdf","pdfPages":75,"chapters":[{"title":"Qui suis-je ?","page":2,"summary":"Cette section aborde « Qui suis-je ? ». Les pages correspondantes développent notamment les thèmes de organisation, gestion, souhaitez, ainsi que ingénieur, confort. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Introduction","page":4,"summary":"Cette section aborde « Introduction ». Les pages correspondantes développent notamment les thèmes de organisation, techniques, gestion, ainsi que différentes, heures. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Comprendre son temps disponible","page":9,"summary":"Cette section aborde « Comprendre son temps disponible ». Les pages correspondantes développent notamment les thèmes de objectif, objectifs, réaliser, ainsi que apprendre, mettre. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Planifier","page":17,"summary":"Cette section aborde « Planifier ». Les pages correspondantes développent notamment les thèmes de faites, exemple, objectif, ainsi que actions, semaine. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Arbitrer ses priorités","page":35,"summary":"Cette section aborde « Arbitrer ses priorités ». Les pages correspondantes développent notamment les thèmes de important, tâches, urgent, ainsi que minutes, journée. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."},{"title":"Organisation et outils","page":54,"summary":"Cette section aborde « Organisation et outils ». Les pages correspondantes développent notamment les thèmes de important, horloge, boussole, ainsi que urgent, souhaite. Ce repérage thématique sert de guide de lecture ; il ne prétend pas restituer tous les arguments de la section."}],"favoritesEnabled":true,"readingListsEnabled":true,"reviews":{"analyse":"Les conseils sont directement applicables et conviennent à une première mise en place de routines. Le résultat dépend toutefois des contraintes de chacun : aucun outil de productivité ne compense, à lui seul, une charge de travail excessive.","public_cible":"Étudiants, salariés et indépendants qui cherchent des méthodes simples d’organisation.","nature":"Analyse originale rédigée pour le catalogue, et non avis publié par un tiers"},"externalReviews":[],"presentation":"Aurélien Vezzani propose des techniques pour organiser son quotidien, définir des priorités, planifier les activités et limiter la dispersion. Il s’appuie sur son expérience et sur des outils pratiques de gestion du temps.","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","sub":"0"},
{"id":"liv0121","title":"600 citations pour réfléchir avant d’agir","author":"Luc Boyer et Romain Bureau","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-01.jpg","presentation":"Ce recueil organise 600 citations autour des choix et des responsabilités du manager. Les premières sections confrontent anticipation et décision : agir suppose de juger une situation sans disposer de certitudes absolues. Viennent ensuite l'innovation, la remise en cause des habitudes et le passage des intentions à l'exécution. Le livre aborde aussi la production, la vente, la motivation et la reconnaissance au sein des équipes. Les dernières parties interrogent les comportements humains, la communication, l'image et les exigences éthiques. Ce n'est pas un manuel qui défend une méthode unique : les formules, parfois contradictoires, constituent surtout des points de départ pour discuter une situation et examiner plusieurs manières d'agir.","summary":"Ce recueil organise 600 citations autour des choix et des responsabilités du manager. Les premières sections confrontent anticipation et décision : agir suppose de juger une situation sans disposer de certitudes absolues. Viennent ensuite l'innovation, la remise en cause des habitudes et le passage des intentions à l'exécution. Le livre aborde aussi la production, la vente, la motivation et la reconnaissance au sein des équipes. Les dernières parties interrogent les comportements humains, la communication, l'image et les exigences éthiques. Ce n'est pas un manuel qui défend une méthode unique : les formules, parfois contradictoires, constituent surtout des points de départ pour discuter une situation et examiner plusieurs manières d'agir.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-01.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"Anticipation et décision","page":11,"summary":"Les citations opposent l’urgence d’agir à la nécessité de prévoir. Elles invitent le décideur à articuler information, jugement, intuition et prise de risque, tout en rappelant que les décisions ont des conséquences durables."},{"title":"Innovation, remise en cause et changement","page":23,"summary":"Les auteurs rapprochent des pensées sur la nouveauté, la remise en question des habitudes et la difficulté de transformer l’existant. Le chapitre sert de réservoir de formulations pour discuter des résistances et de l’adaptation."},{"title":"Mise en œuvre et action","page":43,"summary":"Cette section déplace l’attention des intentions vers la réalisation. Les extraits interrogent la volonté, la persévérance et l’écart entre ce que l’on affirme et ce que l’on fait effectivement."},{"title":"Travail, production, vente et conquête","page":55,"summary":"Les citations abordent l’effort professionnel, la création de valeur, les échanges et l’ambition. Elles permettent de mettre en perspective la performance et le sens accordé au travail."},{"title":"Animation, motivation et récompense","page":79,"summary":"Les extraits rassemblent des idées sur la conduite des équipes, la reconnaissance et les ressorts de l’engagement. La motivation n’y apparaît pas comme un simple ordre, mais comme une question de relations et de responsabilités."},{"title":"Attitudes et comportements : compréhension et développement","page":101,"summary":"Le chapitre explore les comportements humains, leurs contradictions et la possibilité d’apprendre à se connaître. Il propose des points de départ pour réfléchir aux réactions individuelles et à l’évolution personnelle."},{"title":"Communication et image","page":123,"summary":"Les formules rassemblées éclairent les effets de la parole, de l’apparence et de la réputation. Elles peuvent servir à interroger la sincérité d’un message et les malentendus qu’il produit."},{"title":"Éthique et finalités","page":141,"summary":"Les citations conduisent à se demander au service de quoi l’on décide et l’on agit. Elles rappellent que le succès immédiat ne dispense pas d’examiner les valeurs, les responsabilités et la destination de l’action."}],"chapterUnit":"Chapitres et sections","pdfPages":177,"reviewLinks":["https://www.editions-eyrolles.com/livre/600-citations-pour-reflechir-avant-d-agir"]},
{"id":"liv0122","title":"L’Ego est l’ennemi : maîtrisez votre plus grand adversaire","author":"Ryan Holiday","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-02.jpg","presentation":"Ryan Holiday étudie l'ego à trois moments décisifs : lorsque l'on aspire à réussir, lorsque l'on obtient des résultats et lorsque l'on traverse un échec. Au début, il met en garde contre le besoin de parler de ses projets, de construire une image flatteuse ou de rechercher un statut avant d'avoir accompli le travail. Pendant la réussite, il insiste sur l'humilité, l'apprentissage continu et la capacité à ne pas confondre reconnaissance et valeur personnelle. Face aux revers, il invite à reconnaître les faits, à accepter sa part de responsabilité et à reprendre un travail patient. À travers des exemples historiques et des réflexions pratiques, son argument central est que l'ambition peut être utile, mais que l'obsession de soi fragilise le jugement et la progression.","summary":"Ryan Holiday étudie l'ego à trois moments décisifs : lorsque l'on aspire à réussir, lorsque l'on obtient des résultats et lorsque l'on traverse un échec. Au début, il met en garde contre le besoin de parler de ses projets, de construire une image flatteuse ou de rechercher un statut avant d'avoir accompli le travail. Pendant la réussite, il insiste sur l'humilité, l'apprentissage continu et la capacité à ne pas confondre reconnaissance et valeur personnelle. Face aux revers, il invite à reconnaître les faits, à accepter sa part de responsabilité et à reprendre un travail patient. À travers des exemples historiques et des réflexions pratiques, son argument central est que l'ambition peut être utile, mais que l'obsession de soi fragilise le jugement et la progression.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-02.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"L’aspiration : se préparer sans se surestimer","page":19,"summary":"Ryan Holiday présente l’ego comme un obstacle dès le début d’un projet : l’ambition et le discours sur soi peuvent détourner du travail concret. Il recommande de conserver une attitude d’apprenant."},{"title":"Parler, parler et parler encore","page":27,"summary":"Le chapitre critique la tentation de raconter ses ambitions avant de les avoir réalisées. Pour l’auteur, la parole peut procurer une satisfaction prématurée qui remplace l’effort."},{"title":"Être ou faire ?","page":32,"summary":"Holiday oppose la recherche d’un statut ou d’une image à la volonté de produire quelque chose d’utile. L’enjeu est de choisir l’action plutôt que la reconnaissance."},{"title":"L’éternel étudiant","page":38,"summary":"Le progrès exige d’accepter de ne pas savoir et de recevoir des corrections. La posture d’élève devient un antidote à l’arrogance."},{"title":"Éviter de s’emballer","page":44,"summary":"L’enthousiasme initial n’est pas une preuve de maîtrise. Le chapitre recommande de garder le sens des proportions et d’éviter les grands récits sur sa propre destinée."},{"title":"La stratégie de la toile vierge","page":50,"summary":"À ses débuts, il peut être plus utile d’aider les autres et de créer des occasions d’apprendre que de chercher immédiatement à être au premier plan. Holiday valorise le travail discret."},{"title":"Se retenir","page":56,"summary":"La maîtrise de soi consiste notamment à ne pas répondre à chaque provocation. L’auteur met en garde contre les réactions dictées par l’orgueil blessé."},{"title":"Sortir de sa tête","page":61,"summary":"Une vie entièrement occupée par ses projections et son image favorise les illusions. Holiday invite à confronter ses idées à la réalité extérieure et aux tâches présentes."},{"title":"Le danger de l’orgueil précoce","page":67,"summary":"Une réussite partielle peut susciter un sentiment de supériorité dangereux. L’auteur recommande de garder un jugement lucide sur son niveau réel."},{"title":"Travailler, travailler et travailler encore","page":72,"summary":"Les résultats viennent d’un effort poursuivi plutôt que de l’auto-promotion. Le chapitre valorise la répétition, l’apprentissage et la discipline."},{"title":"La réussite : rester lucide","page":80,"summary":"Une fois le succès obtenu, l’ego peut entraîner autosatisfaction, besoin de contrôle et aveuglement. Le livre propose de maintenir la modestie et l’exigence."},{"title":"Toujours apprendre","page":87,"summary":"L’expérience et la réputation ne dispensent jamais de se remettre en question. La progression dépend de la capacité à écouter des avis contraires."},{"title":"Ne pas se raconter d’histoires","page":92,"summary":"Holiday critique les récits arrangés qui transforment le hasard ou les aides reçues en preuve de génie personnel. Il privilégie une lecture précise des faits."},{"title":"Qu’est-ce qui est important à vos yeux ?","page":98,"summary":"Le chapitre invite à distinguer ses priorités profondes des signes extérieurs de prestige. Sans hiérarchie claire, la réussite peut devenir une course sans fin."},{"title":"Droit, contrôle et paranoïa","page":103,"summary":"La réussite peut créer le sentiment de tout mériter, puis la peur de perdre sa place. Holiday décrit les impasses d’une volonté excessive de contrôler les autres."},{"title":"Se gérer","page":108,"summary":"Au-delà de la compétence technique, la responsabilité suppose de gérer son temps, ses impulsions et ses décisions. L’auteur insiste sur la discipline personnelle."},{"title":"Gare à la maladie du moi","page":113,"summary":"Le danger survient lorsque chaque événement est interprété à travers sa propre importance. Le chapitre encourage à se détacher de l’obsession de sa personne."},{"title":"Méditer sur l’immensité","page":118,"summary":"Remettre son parcours dans une perspective historique et collective aide à relativiser sa réussite. L’humilité devient un outil de lucidité."},{"title":"Rester sobre","page":122,"summary":"Holiday prône une conduite mesurée même quand la reconnaissance augmente. Il oppose la stabilité de caractère à l’excès et à l’autocélébration."},{"title":"L’échec : traverser la difficulté","page":130,"summary":"La troisième partie traite des moments où les projets se brisent. L’auteur y distingue la souffrance réelle du drame supplémentaire créé par un ego qui refuse la contradiction."},{"title":"Temps vif ou temps mort ?","page":140,"summary":"Les périodes d’attente et de revers peuvent être perdues dans l’amertume ou utilisées pour apprendre. Holiday propose de transformer ce temps en travail utile."},{"title":"L’effort est suffisant","page":144,"summary":"Le résultat n’est jamais entièrement sous notre contrôle ; l’engagement et la qualité du travail le sont davantage. L’auteur propose de ne pas conditionner toute estime de soi à la victoire."},{"title":"Les moments Fight Club","page":149,"summary":"Les revers exposent brutalement les illusions que l’on entretient sur soi. Le chapitre recommande de regarder ces faits en face plutôt que de chercher des excuses."},{"title":"Fixer les limites","page":154,"summary":"Savoir reconnaître l’existence d’une situation difficile évite de prolonger une lutte dictée seulement par l’orgueil. La lucidité permet de réorienter ses efforts."},{"title":"Tenir un tableau des résultats","page":160,"summary":"L’auteur demande d’évaluer ses actes selon des critères réels, et non à partir d’une narration flatteuse. La confrontation aux résultats soutient l’apprentissage."},{"title":"Aimer toujours","page":164,"summary":"Face à l’injustice ou à l’échec, entretenir le ressentiment risque d’emprisonner durablement. Le chapitre encourage à ne pas laisser l’amertume guider la suite."},{"title":"Épilogue : vigilance durable","page":172,"summary":"L’ego réapparaît aux différentes étapes du parcours. Le livre se conclut sur la nécessité de cultiver l’humilité, le travail et la capacité d’adaptation sans les considérer comme acquis."}],"chapterUnit":"Chapitres et sections","pdfPages":191,"reviewLinks":["https://www.fnac.com/L-ego-est-l-ennemi/a13700660/avis"]},
{"id":"liv0123","title":"Comment attirer le meilleur dans votre vie","author":"Votre Efficacité Personnelle (éditeur indiqué sur le PDF ; auteur individuel non identifié)","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-03.jpg","presentation":"Ce court ouvrage présente la pensée positive et la concentration comme des moyens d'orienter l'attention vers les possibilités plutôt que vers les obstacles. Il développe l'idée d'un « magnétisme » personnel lié aux pensées, aux dispositions intérieures et à la manière d'aborder les événements. Les sections suivantes expliquent comment la répétition des idées et la focalisation sur un objectif pourraient influencer les habitudes et les décisions. La fin propose de travailler la concentration de façon régulière. Il convient de distinguer les conseils pratiques sur l'attention et l'engagement, qui peuvent être discutés, des affirmations selon lesquelles la pensée attirerait directement des événements : ces dernières relèvent du cadre de croyance de l'auteur et ne sont pas établies comme une loi scientifique.","summary":"Ce court ouvrage présente la pensée positive et la concentration comme des moyens d'orienter l'attention vers les possibilités plutôt que vers les obstacles. Il développe l'idée d'un « magnétisme » personnel lié aux pensées, aux dispositions intérieures et à la manière d'aborder les événements. Les sections suivantes expliquent comment la répétition des idées et la focalisation sur un objectif pourraient influencer les habitudes et les décisions. La fin propose de travailler la concentration de façon régulière. Il convient de distinguer les conseils pratiques sur l'attention et l'engagement, qui peuvent être discutés, des affirmations selon lesquelles la pensée attirerait directement des événements : ces dernières relèvent du cadre de croyance de l'auteur et ne sont pas établies comme une loi scientifique.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-03.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"Préface et introduction","page":5,"summary":"Le livret présente la pensée positive comme une façon de diriger son attention et de mieux utiliser ses ressources. Son vocabulaire de magnétisme relève de l’approche développée par le document, pas d’un mécanisme scientifique établi."},{"title":"La puissance du magnétisme","page":9,"summary":"Le texte affirme que l’attitude personnelle et la disposition d’esprit modifieraient la relation aux circonstances. Il appelle le lecteur à observer ses attentes et à développer confiance et volonté."},{"title":"La force magnétique de la pensée","page":11,"summary":"L’auteur associe les pensées répétées aux habitudes, aux choix et à la manière d’interpréter les événements. Les explications en termes de vibrations sont des croyances présentées dans le livret et ne démontrent pas une causalité physique."},{"title":"La concentration est essentielle","page":28,"summary":"Le livret insiste sur l’attention soutenue pour orienter les efforts vers un objectif. Il oppose la dispersion mentale à une démarche plus ordonnée et persévérante."},{"title":"Conseils pour renforcer la concentration","page":32,"summary":"La dernière partie présente des exercices d’attention et une invitation à pratiquer régulièrement. Le bénéfice suggéré concerne surtout la discipline et la focalisation, sans garantie de résultat matériel."}],"chapterUnit":"Chapitres et sections","pdfPages":37,"reviewLinks":[]},
{"id":"liv0124","title":"Faire face aux émotions","author":"Christine Chevalier","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-04.jpg","presentation":"Christine Chevalier commence par définir les émotions et leur rôle dans la vie relationnelle. Elle explique comment les manifestations corporelles, les réactions et les besoins associés à une émotion peuvent être reconnus avant d'intervenir. L'ouvrage propose ensuite une démarche d'accompagnement : accueillir ce qui est ressenti, permettre l'expression, soutenir l'apaisement et aider à réparer ce qui a été abîmé dans la relation. Des situations concrètes portent notamment sur la colère, la peur, la tristesse et la joie. L'autrice examine également les conflits et les conditions dans lesquelles une intervention aide réellement. Le fil conducteur est qu'accompagner une émotion ne signifie ni la nier ni la laisser décider de tout : il s'agit de la comprendre et de retrouver une capacité d'action.","summary":"Christine Chevalier commence par définir les émotions et leur rôle dans la vie relationnelle. Elle explique comment les manifestations corporelles, les réactions et les besoins associés à une émotion peuvent être reconnus avant d'intervenir. L'ouvrage propose ensuite une démarche d'accompagnement : accueillir ce qui est ressenti, permettre l'expression, soutenir l'apaisement et aider à réparer ce qui a été abîmé dans la relation. Des situations concrètes portent notamment sur la colère, la peur, la tristesse et la joie. L'autrice examine également les conflits et les conditions dans lesquelles une intervention aide réellement. Le fil conducteur est qu'accompagner une émotion ne signifie ni la nier ni la laisser décider de tout : il s'agit de la comprendre et de retrouver une capacité d'action.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-04.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"Les émotions : de quoi s’agit-il ?","page":16,"summary":"Christine Chevalier définit les émotions et leurs fonctions dans les interactions. Elle introduit des outils d’analyse transactionnelle afin de distinguer ce qui se passe chez une personne de la réaction que cela suscite chez son interlocuteur."},{"title":"Comprendre l’émotion pour pouvoir aider","page":33,"summary":"Le chapitre décrit le déroulement émotionnel, les signes corporels et les bénéfices d’une expression adaptée. Il propose de reconnaître l’émotion avant de vouloir résoudre immédiatement le problème."},{"title":"Accompagner les émotions","page":78,"summary":"L’autrice organise l’accompagnement autour de gestes successifs : recevoir, supporter, permettre, aider, apaiser et réparer. Chaque étape suppose de tenir compte de la personne et du contexte plutôt que d’imposer une réponse standard."},{"title":"Quelques exemples d’interventions","page":114,"summary":"Des situations illustrent la régulation de la colère, de la peur, de la tristesse et de la joie. Ces cas montrent comment adapter l’écoute, les paroles et les limites à l’émotion rencontrée."},{"title":"Accompagner ou non les conflits","page":132,"summary":"Chevalier analyse les manifestations d’un conflit et les résistances qui empêchent sa résolution. Elle détaille les conditions minimales nécessaires avant d’intervenir, et les situations où une médiation improvisée peut être inadaptée."},{"title":"La violence et l’agressivité","page":143,"summary":"Le texte distingue les signes, les mécanismes et les contextes de la violence. Il met l’accent sur le repérage des risques et sur les précautions à prendre lorsqu’une réaction devient menaçante."},{"title":"La situation de choc émotionnel","page":200,"summary":"Le dernier chapitre décrit les réactions de crise et les besoins immédiats de la personne touchée. Les outils proposés visent un accompagnement adapté, sans confondre aide relationnelle et prise en charge clinique."}],"chapterUnit":"Chapitres et sections","pdfPages":266,"reviewLinks":["https://www.chasse-aux-livres.fr/prix/2100497014/faire-face-aux-emotions-christine-chevalier-9782100497010"]},
{"id":"liv0125","title":"Histoire de la psychologie : des origines à nos jours","author":"Clément Rizet","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-05.jpg","presentation":"Cette histoire de la psychologie suit les transformations des conceptions de l'esprit humain depuis l'Antiquité jusqu'aux courants modernes. Les premiers chapitres présentent les questions anciennes sur l'âme, la perception et la connaissance de soi, puis leurs reformulations au Moyen Âge. La Renaissance et l'âge classique modifient les rapports entre raison, expérience et étude du corps. Le siècle des Lumières renouvelle les réflexions sur la sensibilité, l'éducation et l'individu. Les étapes suivantes montrent comment la psychologie se constitue progressivement comme champ de recherche et comment des écoles différentes proposent leurs propres objets et méthodes. L'intérêt du livre est de replacer les théories dans leur contexte intellectuel plutôt que de raconter une progression simple et continue vers une seule vérité.","summary":"Cette histoire de la psychologie suit les transformations des conceptions de l'esprit humain depuis l'Antiquité jusqu'aux courants modernes. Les premiers chapitres présentent les questions anciennes sur l'âme, la perception et la connaissance de soi, puis leurs reformulations au Moyen Âge. La Renaissance et l'âge classique modifient les rapports entre raison, expérience et étude du corps. Le siècle des Lumières renouvelle les réflexions sur la sensibilité, l'éducation et l'individu. Les étapes suivantes montrent comment la psychologie se constitue progressivement comme champ de recherche et comment des écoles différentes proposent leurs propres objets et méthodes. L'intérêt du livre est de replacer les théories dans leur contexte intellectuel plutôt que de raconter une progression simple et continue vers une seule vérité.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-05.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"Les origines antiques","page":12,"summary":"Clément Rizet retrace les premières représentations de la vie psychique dans les textes et mythes de l’Antiquité. Il examine ensuite la contribution de Socrate, de Platon et d’Aristote, notamment les questions de l’âme, du désir, de la connaissance et des facultés humaines."},{"title":"L’ère médiévale","page":61,"summary":"Le chapitre passe de la psychologie augustinienne aux réflexions sur la personne et la connaissance de soi. Il présente aussi les apports des traditions philosophiques arabe et hébraïque, puis leur articulation avec la scolastique chrétienne."},{"title":"La Renaissance","page":77,"summary":"Rizet montre comment l’humanisme et les transformations culturelles renouvellent les interrogations sur l’individu. Les auteurs étudiés éclairent l’évolution des conceptions de la liberté, de la personnalité et du comportement."},{"title":"L’âge classique","page":88,"summary":"La période classique confronte raison, expérience et mécanismes du corps. Le chapitre replace l’étude de l’esprit dans les débats philosophiques qui précèdent l’autonomisation de la psychologie."},{"title":"Le siècle des Lumières","page":137,"summary":"L’auteur examine les réflexions sur la sensibilité, l’éducation et la connaissance au XVIIIe siècle. Il suit la montée des démarches d’observation et les discussions concernant les rapports entre nature, société et sujet."},{"title":"Le XIXe siècle","page":191,"summary":"Le développement des sciences expérimentales et de la médecine modifie les approches du psychisme. Rizet présente les étapes qui conduisent à la constitution de la psychologie comme discipline plus autonome."},{"title":"De l’inconscient aux sciences cognitives","page":300,"summary":"Le chapitre suit les débats autour de l’inconscient et les transformations des méthodes psychologiques au XXe siècle. Il situe les courants successifs dans leurs contextes théoriques, cliniques et scientifiques."},{"title":"XXIe siècle : neurosciences et psychologies","page":443,"summary":"La dernière partie décrit les liens entre neurosciences, cognition et différentes pratiques psychologiques contemporaines. Elle souligne la pluralité des objets et des méthodes plutôt qu’une théorie unique de l’esprit."}],"chapterUnit":"Chapitres et sections","pdfPages":560,"reviewLinks":["https://www.fnac.com/a15668942/Clement-Rizet-Histoire-de-la-Psychologie-Des-origines-a-nos-jours"]},
{"id":"liv0126","title":"L’Art de la séduction","author":"Robert Greene","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-06.jpg","presentation":"Robert Greene présente la séduction comme un ensemble de dynamiques sociales et psychologiques, illustrées par des récits historiques. Il distingue d'abord plusieurs figures de séducteurs, dont la Sirène, le Libertin, l'Amant idéal, le Dandy et l'Éternel enfant, chacune reposant sur une forme particulière d'attraction. Il examine ensuite les attentes, les vulnérabilités et les situations dans lesquelles une personne devient sensible à une mise en scène. La suite décrit des stratégies de rapprochement, de création d'attente et d'influence. Le livre doit être lu avec un regard critique : ses exemples sont interprétés à travers la grille de l'auteur et certaines tactiques reposent sur la manipulation, l'ambiguïté ou l'exploitation des fragilités d'autrui. Il s'agit d'une analyse de stratégies d'influence, pas d'un modèle de relations respectueuses.","summary":"Robert Greene présente la séduction comme un ensemble de dynamiques sociales et psychologiques, illustrées par des récits historiques. Il distingue d'abord plusieurs figures de séducteurs, dont la Sirène, le Libertin, l'Amant idéal, le Dandy et l'Éternel enfant, chacune reposant sur une forme particulière d'attraction. Il examine ensuite les attentes, les vulnérabilités et les situations dans lesquelles une personne devient sensible à une mise en scène. La suite décrit des stratégies de rapprochement, de création d'attente et d'influence. Le livre doit être lu avec un regard critique : ses exemples sont interprétés à travers la grille de l'auteur et certaines tactiques reposent sur la manipulation, l'ambiguïté ou l'exploitation des fragilités d'autrui. Il s'agit d'une analyse de stratégies d'influence, pas d'un modèle de relations respectueuses.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-06.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"La Sirène","page":12,"summary":"Greene décrit un archétype fondé sur le pouvoir d’attraction de l’apparence et de l’imaginaire. Il prend des exemples historiques pour montrer comment une image séduisante capte l’attention."},{"title":"Le Libertin","page":18,"summary":"Le personnage mise sur l’intensité affichée du désir et l’impression d’exclusivité. L’analyse porte sur l’effet émotionnel d’une passion ostensible."},{"title":"L’Amant idéal","page":23,"summary":"Cet archétype cherche à incarner les attentes intimes de l’autre. L’auteur examine la façon dont l’écoute et la mise en scène d’un idéal produisent de l’attachement."},{"title":"Le Dandy","page":28,"summary":"Le dandy se distingue des codes attendus et cultive une singularité visible. Cette indépendance devient, dans la grille de Greene, un ressort d’attraction."},{"title":"L’Éternel enfant","page":35,"summary":"La spontanéité et le jeu constituent ici une figure de séduction. Greene relie la légèreté apparente à un désir de retrouver des émotions moins contraintes."},{"title":"La Coquette","page":40,"summary":"Le chapitre analyse l’alternance entre attention et distance. Il décrit comment l’incertitude entretenue peut renforcer l’attente, tout en reposant sur une dynamique potentiellement manipulatrice."},{"title":"Le Charmeur","page":45,"summary":"La séduction passe par l’art de mettre l’autre en valeur et d’éviter les confrontations directes. Le chapitre illustre le poids de la sociabilité et des attentions."},{"title":"La Figure charismatique","page":50,"summary":"Greene s’intéresse à l’assurance, au récit personnel et à l’effet de présence. Il explique comment ces traits peuvent créer une adhésion collective."},{"title":"La Star","page":58,"summary":"La star entretient une image partiellement inaccessible qui laisse place aux projections. Le mystère et la distance participent ici à la fascination."},{"title":"Choisir sa victime","page":67,"summary":"La seconde partie traite de la sélection d’une personne jugée réceptive. L’auteur présente une stratégie d’influence ; ce cadre instrumental doit être distingué d’une relation consentie et réciproque."},{"title":"Inspirer confiance","page":71,"summary":"Greene décrit la création d’un climat rassurant avant de rechercher une proximité. Il montre comment une attitude apparemment naturelle peut être planifiée."},{"title":"Souffler le chaud et le froid","page":76,"summary":"La stratégie repose sur une alternance d’attention et de retrait. Le texte décrit l’incertitude émotionnelle ainsi produite, qui peut constituer une forme de manipulation."},{"title":"Susciter la jalousie","page":81,"summary":"Le chapitre présente la concurrence et la valeur attribuée par autrui comme instruments d’attraction. Il s’agit d’un mécanisme social décrit par l’auteur, non d’une recommandation relationnelle saine."},{"title":"Créer des besoins sans les satisfaire","page":86,"summary":"Greene étudie la création d’un manque et son entretien. Cette tactique met le désir au service d’une asymétrie de pouvoir."},{"title":"Maîtriser l’art de l’insinuation","page":92,"summary":"L’auteur insiste sur les suggestions indirectes plutôt que sur des demandes explicites. Le chapitre examine comment un message ambigu peut être interprété comme une idée personnelle."},{"title":"Habiter l’esprit de l’autre","page":97,"summary":"La stratégie consiste à s’aligner sur les centres d’intérêt et les préoccupations de l’interlocuteur. Greene traite cet ajustement comme un moyen d’influence."},{"title":"Proposer la tentation","page":101,"summary":"Le chapitre décrit une offre conçue pour correspondre à un désir déjà présent. Il distingue l’attrait de la proposition de la décision effective de celui qui la reçoit."},{"title":"Entretenir le suspense","page":106,"summary":"L’attente et le rythme des événements deviennent des outils d’attention. Greene présente le suspense comme une manière de maintenir l’investissement émotionnel."},{"title":"Troubler par la magie du discours","page":110,"summary":"Le chapitre porte sur la forme du langage, l’imagination et la suggestion. L’auteur montre comment la parole peut embellir ou orienter une perception."},{"title":"Soigner les détails","page":116,"summary":"Des gestes précis, un cadre ou une attention personnalisée contribuent à créer une impression. Greene s’intéresse ici à la force des signes apparemment secondaires."},{"title":"S’auréoler de poésie","page":121,"summary":"La mise en récit et les images culturelles servent à donner une dimension idéalisée à une rencontre. Le chapitre insiste sur les effets de l’imaginaire."},{"title":"Être désarmant","page":125,"summary":"L’auteur présente la vulnérabilité affichée comme une manière d’abaisser les défenses. Il en souligne les effets possibles sur la perception de sincérité."},{"title":"Créer l’illusion","page":130,"summary":"Greene examine les mises en scène qui modifient la lecture d’une situation. Ce chapitre souligne la proximité entre charme, fiction et tromperie."},{"title":"Isoler la victime","page":135,"summary":"Le chapitre décrit l’éloignement des autres influences comme une tactique de contrôle. Cette dynamique peut présenter des risques réels pour l’autonomie d’une personne."},{"title":"Faire ses preuves","page":141,"summary":"L’auteur explique comment la démonstration d’efforts ou de sacrifices peut renforcer l’impression de dévouement. Le chapitre analyse la valeur symbolique des actes."},{"title":"Provoquer une régression","page":146,"summary":"Greene s’intéresse au retour d’émotions liées à l’enfance ou à une dépendance affective. Il le traite comme une forme d’influence psychologique."},{"title":"Offrir le fruit défendu","page":151,"summary":"L’interdit peut augmenter la valeur perçue d’une possibilité. Le chapitre analyse la tension entre normes sociales et désir de transgression."},{"title":"Convoquer le sublime","page":157,"summary":"Les images, les lieux et les émotions élevées peuvent transformer une expérience ordinaire. L’auteur en décrit les effets d’intensification."},{"title":"Mêler la douleur au plaisir","page":162,"summary":"Greene décrit des alternances émotionnelles destinées à renforcer l’attachement. Cette approche expose les risques d’une relation déséquilibrée."},{"title":"Devenir proie","page":168,"summary":"La tactique inverse momentanément les rôles en laissant l’autre prendre l’initiative. L’auteur l’analyse comme un changement de position dans le rapport de pouvoir."},{"title":"Réveiller la bête","page":175,"summary":"Le chapitre traite de l’intensification du désir et des pulsions. Il fait de cette mobilisation émotionnelle une étape du processus de séduction décrit."},{"title":"Savoir porter le coup final","page":181,"summary":"Greene décrit le moment décisif où une longue progression débouche sur une action directe. Le chapitre aborde le tempo et les risques d’une pression excessive."},{"title":"Survivre aux lendemains qui déchantent","page":187,"summary":"L’auteur s’intéresse à ce qui se produit après la phase d’intensité. Il évoque la difficulté de maintenir l’image et l’attention créées durant la séduction."}],"chapterUnit":"Chapitres et sections","pdfPages":199,"reviewLinks":["https://www.fnac.com/L-art-de-la-seduction/a13302130/avis"]},
{"id":"liv0127","title":"La puissance de votre subconscient","author":"Joseph Murphy","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-07.jpg","presentation":"Joseph Murphy soutient que les croyances profondes et les suggestions adressées au subconscient influencent la conduite de la vie. Il commence par distinguer esprit conscient et subconscient, puis développe le rôle qu'il attribue à la répétition, à l'imagination et à la conviction. Plusieurs chapitres présentent des récits de guérison et de transformation personnelle que l'auteur relie à la foi et à l'activité mentale. D'autres appliquent cette conception aux relations, à la réussite, à la peur et aux habitudes. Le livre appartient à la littérature de développement personnel spirituel : ses témoignages et explications sur les guérisons ne constituent pas des preuves médicales. On peut en retenir une réflexion sur l'influence des représentations personnelles sans considérer les effets extraordinaires annoncés comme scientifiquement démontrés.","summary":"Joseph Murphy soutient que les croyances profondes et les suggestions adressées au subconscient influencent la conduite de la vie. Il commence par distinguer esprit conscient et subconscient, puis développe le rôle qu'il attribue à la répétition, à l'imagination et à la conviction. Plusieurs chapitres présentent des récits de guérison et de transformation personnelle que l'auteur relie à la foi et à l'activité mentale. D'autres appliquent cette conception aux relations, à la réussite, à la peur et aux habitudes. Le livre appartient à la littérature de développement personnel spirituel : ses témoignages et explications sur les guérisons ne constituent pas des preuves médicales. On peut en retenir une réflexion sur l'influence des représentations personnelles sans considérer les effets extraordinaires annoncés comme scientifiquement démontrés.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-07.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"Le trésor qui est en vous","page":23,"summary":"Murphy présente le subconscient comme une réserve de possibilités et affirme que les convictions profondes orientent l’existence. Le chapitre invite à identifier des croyances habituelles, dans le cadre spirituel propre à l’auteur."},{"title":"Le mécanisme de votre esprit","page":39,"summary":"L’auteur distingue esprit conscient et subconscient, puis décrit les effets qu’il attribue à la suggestion et à la répétition. Ses formulations ne constituent pas une description scientifique consensuelle du cerveau."},{"title":"La puissance miraculeuse de votre subconscient","page":60,"summary":"Des récits et affirmations illustrent la capacité supposée du subconscient à produire des changements. Le lecteur est invité à accueillir ces exemples comme des thèses de l’auteur, non comme des preuves médicales."},{"title":"Les guérisons par l’esprit dans l’Antiquité","page":74,"summary":"Murphy retrace des traditions anciennes où les croyances et les rites étaient associés à la guérison. Il les utilise pour soutenir son interprétation spirituelle des pouvoirs de l’esprit."},{"title":"Les guérisons par l’esprit dans les temps modernes","page":89,"summary":"Le chapitre rassemble des exemples plus récents de guérisons attribuées à la foi ou aux suggestions mentales. Les anecdotes rapportées ne permettent pas de vérifier un effet thérapeutique spécifique."},{"title":"Les techniques de guérison mentale","page":102,"summary":"L’auteur propose des visualisations, des affirmations et des pratiques de concentration. Elles sont décrites comme exercices spirituels ; elles ne doivent pas se substituer à des soins médicaux."},{"title":"Le subconscient tend vers la vie","page":122,"summary":"Le texte présente le subconscient comme orienté vers la conservation et l’équilibre. Murphy recommande d’entretenir des représentations mentales positives."},{"title":"La voie vers la réussite","page":131,"summary":"Le chapitre associe objectifs précis, confiance et préparation intérieure. La réussite y est interprétée à travers l’influence supposée des pensées."},{"title":"Le subconscient, la voie vers la richesse","page":142,"summary":"Murphy soutient que certaines croyances limitantes empêchent la prospérité. Il propose de modifier le rapport psychologique à l’argent par la répétition de pensées favorables."},{"title":"Le droit à la richesse","page":152,"summary":"L’auteur conteste la culpabilité liée au désir de confort matériel. Il cherche à présenter l’abondance comme compatible avec une vie intérieure équilibrée."},{"title":"Le subconscient, l’auxiliaire du succès","page":164,"summary":"Le texte aborde l’imagination et la confiance dans les activités professionnelles. Les exemples visent à encourager une orientation mentale cohérente avec ses projets."},{"title":"Les savants recourent au subconscient","page":180,"summary":"Murphy raconte des découvertes et intuitions attribuées à un travail mental en dehors de l’attention consciente. Il en déduit un rôle créatif pour le subconscient."},{"title":"Le subconscient et les merveilles du sommeil","page":193,"summary":"Le sommeil est présenté comme favorable à la résolution de problèmes et à la maturation des idées. L’auteur suggère d’orienter ses pensées avant de s’endormir."},{"title":"Le subconscient et les problèmes conjugaux","page":205,"summary":"Le chapitre relie la qualité des relations aux représentations et attentes que l’on entretient. Murphy insiste sur les paroles et attitudes qui nourrissent la confiance."},{"title":"Le subconscient et le bonheur","page":220,"summary":"L’auteur défend l’idée que le bonheur se cultive dans les habitudes de pensée. Il propose de travailler les interprétations et réactions quotidiennes."},{"title":"Le subconscient et les relations harmonieuses","page":231,"summary":"Murphy encourage une disposition moins hostile envers les autres. Il relie les relations apaisées à une transformation des ressentiments."},{"title":"Le subconscient, un outil de pardon","page":248,"summary":"Le pardon est présenté comme une façon de ne plus alimenter une blessure intérieure. L’auteur recommande de renoncer à la rumination sans nier les faits subis."},{"title":"Le subconscient, un outil pour supprimer les blocages mentaux","page":265,"summary":"Les résistances, l’indécision et les habitudes sont reliées à des croyances récurrentes. Murphy propose la suggestion positive pour les remplacer."},{"title":"Le subconscient, un outil pour vaincre la peur","page":280,"summary":"Le chapitre examine les peurs anticipatoires et la manière de leur opposer des représentations rassurantes. Ses méthodes relèvent du développement personnel et ne remplacent pas un accompagnement professionnel."},{"title":"Le subconscient, un outil pour rester jeune d’esprit","page":297,"summary":"Murphy associe la vitalité intellectuelle à la curiosité et à la confiance dans la vie. Il invite à ne pas réduire les capacités personnelles à l’âge."}],"chapterUnit":"Chapitres et sections","pdfPages":322,"reviewLinks":["https://www.goodreads.com/book/show/2420111.The_Power_of_Your_Subconscious_Mind"]},
{"id":"liv0128","title":"Les lois de la nature humaine","author":"Robert Greene","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-08.jpg","presentation":"Robert Greene examine dix-huit tendances qu'il présente comme des lois du comportement humain. Il commence par l'irrationalité et les biais émotionnels, puis aborde le narcissisme, l'image sociale et les habitudes qui révèlent le caractère. D'autres chapitres s'intéressent au désir, à l'envie, à l'agressivité, aux rapports de pouvoir et aux dynamiques de groupe. Chaque thème associe des récits, des interprétations psychologiques et des conseils d'observation de soi et d'autrui. Le livre invite à prendre du recul sur les apparences et à mieux repérer les motivations qui traversent les relations. Ses « lois » sont toutefois des catégories proposées par l'auteur, non des lois scientifiques universelles ; les exemples historiques et les généralisations demandent donc une lecture critique.","summary":"Robert Greene examine dix-huit tendances qu'il présente comme des lois du comportement humain. Il commence par l'irrationalité et les biais émotionnels, puis aborde le narcissisme, l'image sociale et les habitudes qui révèlent le caractère. D'autres chapitres s'intéressent au désir, à l'envie, à l'agressivité, aux rapports de pouvoir et aux dynamiques de groupe. Chaque thème associe des récits, des interprétations psychologiques et des conseils d'observation de soi et d'autrui. Le livre invite à prendre du recul sur les apparences et à mieux repérer les motivations qui traversent les relations. Ses « lois » sont toutefois des catégories proposées par l'auteur, non des lois scientifiques universelles ; les exemples historiques et les généralisations demandent donc une lecture critique.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-08.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"La loi de l’irrationalité","page":24,"summary":"Greene montre comment les émotions et les biais perturbent les décisions. Il décrit des méthodes d’observation de soi pour limiter les emballements et gagner en recul."},{"title":"La loi du narcissisme","page":73,"summary":"Le chapitre distingue les besoins ordinaires de reconnaissance des formes d’égocentrisme qui étouffent l’attention à autrui. L’auteur présente l’empathie comme une compétence à développer."},{"title":"La loi de la persona","page":125,"summary":"Greene s’intéresse à l’image sociale que chacun compose et aux signes qui échappent à cette mise en scène. Il propose d’observer les comportements dans la durée plutôt que de croire uniquement aux déclarations."},{"title":"La loi du comportement compulsif","page":175,"summary":"Le chapitre examine les habitudes répétitives qui révèlent le caractère sous pression. Greene met en garde contre les jugements fondés sur une seule impression."},{"title":"La loi de la convoitise","page":224,"summary":"L’auteur décrit le désir de ce qui semble rare ou inaccessible. Il montre comment l’imagination peut rendre un objet plus attrayant que sa valeur réelle."},{"title":"La loi du manque de vision","page":256,"summary":"Greene critique les réactions de court terme qui font perdre de vue les conséquences. Il encourage à considérer la durée et les effets indirects d’une décision."},{"title":"La loi de la défensive","page":291,"summary":"Le chapitre analyse la résistance des personnes qui se sentent jugées ou menacées. L’auteur présente des procédés d’influence fondés sur la reconnaissance de leur perspective."},{"title":"La loi de l’auto-sabotage","page":341,"summary":"La manière d’interpréter le monde peut entretenir des comportements défaitistes. Greene examine le rôle des attitudes dans les interactions et les occasions saisies."},{"title":"La loi du refoulement","page":385,"summary":"L’auteur décrit des aspects de soi que l’on refuse de reconnaître et qui peuvent réapparaître indirectement. Il invite à observer ses contradictions au lieu de les attribuer systématiquement aux autres."},{"title":"La loi de l’envie","page":432,"summary":"Greene s’intéresse à la comparaison sociale et à l’hostilité parfois dissimulée qu’elle produit. Il détaille des signes possibles et rappelle la difficulté d’interpréter les intentions."},{"title":"La loi de la mégalomanie","page":479,"summary":"Le succès peut susciter une illusion d’infaillibilité et conduire à des décisions excessives. Le chapitre souligne l’importance des limites et des retours critiques."},{"title":"La loi de l’inflexibilité des sexes","page":524,"summary":"Greene explore les représentations du masculin et du féminin dans le psychisme. Ses interprétations s’inscrivent dans son cadre théorique et ne valent pas description universelle des identités."},{"title":"La loi du désœuvrement","page":579,"summary":"Le livre défend le rôle d’un but personnel dans la persévérance et l’organisation des choix. Greene relie le sentiment de direction à la capacité de traverser les difficultés."},{"title":"La loi de la conformité","page":632,"summary":"L’auteur examine les pressions du groupe, les dynamiques de pouvoir et les effets de l’appartenance. Il souligne la nécessité de conserver un jugement indépendant."},{"title":"La loi de l’inconstance","page":705,"summary":"Le chapitre interroge la légitimité et la construction de l’autorité. Greene distingue les apparences de leadership de la confiance durable qu’inspirent les actes."},{"title":"La loi de l’agressivité","page":762,"summary":"Greene étudie les manifestations indirectes de l’hostilité, notamment les comportements passifs-agressifs. Il propose de repérer les contradictions entre les paroles et les actes."},{"title":"La loi de la myopie générationnelle","page":836,"summary":"Chaque génération est façonnée par un contexte historique et culturel. Le chapitre propose de comprendre les attitudes collectives en regardant l’époque qui les a produites."},{"title":"La loi du déni de mort","page":906,"summary":"L’auteur examine les réactions humaines à la finitude et les manières de l’écarter de la conscience. Il présente la conscience de la mortalité comme une invitation à mieux hiérarchiser sa vie."}],"chapterUnit":"Chapitres et sections","pdfPages":954,"reviewLinks":["https://www.fr.fnac.ch/a13530068/Robert-Greene-Les-lois-de-la-nature-humaine"]},
{"id":"liv0129","title":"Qui es-tu ?","author":"Lise Bourbeau","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-09.jpg","presentation":"Lise Bourbeau développe une approche spirituelle de la connaissance de soi. Le livre propose d'examiner les expériences quotidiennes comme autant de miroirs de l'état intérieur : ce que l'on voit chez les autres, ce que l'on entend, ce que l'on dit et ce que l'on pense deviennent des occasions d'interroger ses réactions et ses croyances. Les chapitres abordent progressivement les dimensions émotionnelles, relationnelles et personnelles de cette démarche. L'autrice invite à reconnaître sa responsabilité dans ses choix et à rechercher davantage de cohérence avec soi-même. Ses interprétations de l'âme, des expériences et de leurs significations relèvent d'une conception spirituelle particulière ; elles ne doivent pas être présentées comme des résultats scientifiques établis.","summary":"Lise Bourbeau développe une approche spirituelle de la connaissance de soi. Le livre propose d'examiner les expériences quotidiennes comme autant de miroirs de l'état intérieur : ce que l'on voit chez les autres, ce que l'on entend, ce que l'on dit et ce que l'on pense deviennent des occasions d'interroger ses réactions et ses croyances. Les chapitres abordent progressivement les dimensions émotionnelles, relationnelles et personnelles de cette démarche. L'autrice invite à reconnaître sa responsabilité dans ses choix et à rechercher davantage de cohérence avec soi-même. Ses interprétations de l'âme, des expériences et de leurs significations relèvent d'une conception spirituelle particulière ; elles ne doivent pas être présentées comme des résultats scientifiques établis.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-09.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"Tu es une âme en évolution","page":5,"summary":"Lise Bourbeau expose sa conception spirituelle d’une existence conçue comme apprentissage. Elle invite à examiner la responsabilité personnelle et l’acceptation de soi ; ses références au karma relèvent de ses croyances."},{"title":"Tu es ce que tu vois","page":16,"summary":"Le chapitre utilise la métaphore du miroir : ce qui attire ou irrite chez autrui pourrait servir d’indice pour réfléchir à soi. Cette lecture symbolique n’établit pas une causalité objective entre les personnes."},{"title":"Tu es ce que tu entends","page":25,"summary":"L’autrice examine les réactions aux paroles, aux critiques et à l’autorité. Elle encourage à écouter ce que ces réactions révèlent des besoins ou jugements personnels."},{"title":"Tu es ce que tu dis","page":33,"summary":"Les formulations habituelles et les réactions verbales sont présentées comme des signes de croyances internes. Bourbeau invite à observer son langage pour mieux identifier ses positions."},{"title":"Tu es ce que tu penses","page":46,"summary":"L’autrice insiste sur les pensées récurrentes et leur influence présumée sur la perception et les comportements. Elle propose de remplacer l’autocritique par une attention plus consciente."},{"title":"Tu es ce que tu ressens","page":57,"summary":"Le chapitre invite à reconnaître les émotions plutôt qu’à les refouler. Il décrit les ressentis comme des informations sur les besoins et les situations vécues."},{"title":"Tu es ce que tu manges","page":61,"summary":"Bourbeau interprète les préférences et les habitudes alimentaires comme des indices symboliques du rapport à soi. Ces liens relèvent de son cadre de développement personnel."},{"title":"Tu es ce que tu portes","page":69,"summary":"Les choix vestimentaires deviennent un support pour interroger la liberté personnelle et l’influence du regard des autres. L’autrice propose d’observer ses habitudes sans les considérer comme de simples contraintes extérieures."},{"title":"Tu es ta demeure","page":76,"summary":"Le chapitre associe les espaces de vie aux habitudes, aux besoins et à la façon d’organiser son quotidien. Il s’agit d’une grille symbolique de réflexion, pas d’un diagnostic de personnalité."},{"title":"Tu es la forme de ton corps","page":83,"summary":"L’autrice développe des interprétations de la morphologie et de la posture. Ces associations ne constituent pas des indicateurs médicaux ou psychologiques validés."},{"title":"Tu es tes malaises et maladies","page":112,"summary":"Bourbeau attribue diverses affections à des conflits émotionnels ou spirituels. Ces affirmations ne sont pas médicalement établies et ne doivent jamais servir à expliquer une maladie ni retarder une consultation."},{"title":"Conclusion et cheminement personnel","page":205,"summary":"La fin de l’ouvrage invite à faire le bilan de ses observations et à poursuivre une réflexion sur ses croyances. L’accent porte sur la liberté de choisir sa réponse aux événements."}],"chapterUnit":"Chapitres et sections","pdfPages":218,"reviewLinks":["https://www.fnac.com/Qui-es-tu/a16741706/avis"]},
{"id":"liv0130","title":"Stratégie : les 33 lois de la guerre","author":"Robert Greene","genre":"savoirs","sub":"1","cover":"10-livres/Entre_les_lignes_10_livres/couvertures/nouveau-10.jpg","presentation":"Dans cet ouvrage, Robert Greene transpose des épisodes de guerre et des stratégies militaires aux conflits de la vie professionnelle et sociale. Les premières lois portent sur la définition de ses adversités, la souplesse tactique, le sang-froid, l'urgence et la conduite d'un groupe. Les chapitres suivants examinent notamment l'initiative, l'information, le rapport de forces, la préparation, la défense et les moyens d'éviter un affrontement inutile. Chaque stratégie est illustrée par des situations historiques que l'auteur interprète comme des leçons de décision et d'influence. Le livre se lit comme un répertoire de scénarios stratégiques, pas comme un ensemble de règles à appliquer mécaniquement : les analogies entre guerre et relations ordinaires ont leurs limites, et certaines tactiques soulèvent des questions éthiques.","summary":"Dans cet ouvrage, Robert Greene transpose des épisodes de guerre et des stratégies militaires aux conflits de la vie professionnelle et sociale. Les premières lois portent sur la définition de ses adversités, la souplesse tactique, le sang-froid, l'urgence et la conduite d'un groupe. Les chapitres suivants examinent notamment l'initiative, l'information, le rapport de forces, la préparation, la défense et les moyens d'éviter un affrontement inutile. Chaque stratégie est illustrée par des situations historiques que l'auteur interprète comme des leçons de décision et d'influence. Le livre se lit comme un répertoire de scénarios stratégiques, pas comme un ensemble de règles à appliquer mécaniquement : les analogies entre guerre et relations ordinaires ont leurs limites, et certaines tactiques soulèvent des questions éthiques.","pdfPath":"10-livres/Entre_les_lignes_10_livres/pdf/nouveau-10.pdf","catalogueRevision":20261118,"publicationStatus":"PDF disponible à la lecture et au téléchargement","chapters":[{"title":"La stratégie de la polarité","page":25,"summary":"Greene recommande d’identifier clairement les oppositions pour concentrer ses efforts. Il transpose des conflits historiques à la définition d’une stratégie personnelle."},{"title":"La stratégie de la guérilla psychologique","page":37,"summary":"La deuxième loi invite à se défaire des méthodes devenues inadaptées. L’auteur valorise la souplesse tactique et la capacité de surprendre."},{"title":"La stratégie de l’équilibre","page":49,"summary":"Garder son sang-froid permet de décider malgré la pression. Greene souligne les dangers d’une réaction émotionnelle précipitée."},{"title":"La stratégie du dernier carré","page":63,"summary":"L’auteur examine comment un sentiment d’urgence peut mobiliser l’énergie d’un groupe. Il en illustre les effets dans des circonstances extrêmes."},{"title":"La stratégie du commandement contrôlé","page":77,"summary":"Le chapitre porte sur la coordination et la répartition des responsabilités dans un collectif. Greene distingue l’unité de direction du contrôle de chaque détail."},{"title":"La stratégie du chaos contrôlé","page":91,"summary":"L’auteur décrit la nécessité d’adapter ses forces aux circonstances plutôt que de figer l’organisation. La rapidité des décisions devient un avantage."},{"title":"La stratégie du moral","page":101,"summary":"Une cause partagée peut soutenir la cohésion et la motivation. Greene analyse la place des convictions dans l’action collective."},{"title":"La stratégie de l’économie","page":121,"summary":"Il faut sélectionner les conflits qui valent l’énergie engagée. L’auteur recommande de comparer le coût d’une confrontation à son utilité réelle."},{"title":"La stratégie de la contre-attaque","page":135,"summary":"Greene décrit la défense active qui utilise l’engagement de l’adversaire pour retourner la situation. Le moment choisi compte autant que la force mobilisée."},{"title":"La stratégie de la dissuasion","page":149,"summary":"Une posture crédible peut éviter certains affrontements. Le chapitre examine la réputation et la capacité perçue à répondre."},{"title":"La stratégie du repli","page":165,"summary":"L’auteur souligne que céder du terrain n’est pas nécessairement perdre. Le recul peut préserver ses ressources et préparer une autre manœuvre."},{"title":"La grande stratégie","page":179,"summary":"Greene distingue les succès locaux de l’objectif à long terme. Il invite à construire des plans cohérents plutôt qu’à enchaîner des victoires isolées."},{"title":"La stratégie du renseignement","page":193,"summary":"Connaître les motivations et contraintes d’un adversaire éclaire ses décisions. Le chapitre présente l’observation comme préalable à toute manœuvre."},{"title":"La stratégie de la blitzkrieg","page":207,"summary":"Le mouvement rapide et la surprise peuvent empêcher une réaction organisée. Greene l’illustre par des exemples militaires."},{"title":"La stratégie de la manipulation","page":215,"summary":"Le chapitre étudie le contrôle du rythme des événements et des choix offerts. Il décrit des tactiques d’influence qu’il faut lire avec recul critique."},{"title":"La stratégie du centre de gravité","page":231,"summary":"Greene recommande de chercher l’élément décisif dont dépend la force opposée. La concentration des efforts évite de se disperser sur des points secondaires."},{"title":"La stratégie de la conquête par la division","page":241,"summary":"L’auteur montre comment des forces unies peuvent être affaiblies par leur séparation. Il analyse la fragmentation comme tactique de conflit."},{"title":"La stratégie du pivotement","page":257,"summary":"La confrontation frontale peut renforcer les défenses adverses. Greene propose de déplacer l’effort vers des zones moins protégées."},{"title":"La stratégie de l’annihilation","page":271,"summary":"Le chapitre décrit un encerclement visant à supprimer les possibilités de riposte. Cette logique militaire radicale ne doit pas être confondue avec une conduite éthique des relations."},{"title":"La stratégie de la manœuvre","page":281,"summary":"Greene souligne l’intérêt de créer une position défavorable à l’adversaire avant une confrontation. Le terrain et la configuration comptent davantage que la seule puissance."},{"title":"La stratégie de la guerre diplomatique","page":299,"summary":"L’auteur décrit la négociation accompagnée de mesures concrètes. Il s’intéresse au rapport entre parole, position et concessions."},{"title":"La stratégie de sortie","page":311,"summary":"Le chapitre insiste sur la nécessité de prévoir une conclusion. Une victoire mal terminée peut compromettre l’ensemble des efforts."},{"title":"La stratégie de la perception","page":325,"summary":"Greene analyse la façon dont récits et apparences influencent la compréhension d’un conflit. Il présente la mise en scène comme instrument tactique."},{"title":"La stratégie de l’imprévisibilité","page":337,"summary":"Le chapitre s’intéresse aux effets de l’incertitude sur les calculs adverses. Il montre comment la variabilité d’action peut modifier un rapport de forces."},{"title":"La stratégie de la vertu","page":351,"summary":"L’auteur explique que la dimension morale d’un conflit peut influencer le soutien des tiers. Il examine la différence entre légitimité revendiquée et motivations réelles."},{"title":"La stratégie de l’ombre","page":365,"summary":"Greene décrit des objectifs dissimulés derrière une action visible. La prudence critique s’impose face à ces tactiques de tromperie."},{"title":"La stratégie de l’alliance","page":383,"summary":"Le chapitre montre comment les alliances modifient l’équilibre des ressources. Il insiste sur les partenaires, leurs intérêts et la fragilité des coalitions."},{"title":"La stratégie de la domination","page":397,"summary":"L’auteur décrit des tactiques destinées à laisser l’adversaire s’exposer lui-même. Il examine les rivalités cachées au sein d’un même camp."},{"title":"La stratégie des petits pas","page":413,"summary":"La progression graduelle peut réduire les résistances et rendre possible une évolution importante. Greene souligne l’importance du rythme."},{"title":"La stratégie de la communication","page":423,"summary":"Le chapitre analyse la manière dont un message façonne la perception d’un groupe. Il s’intéresse à la persuasion et à l’orientation des attentes."},{"title":"La stratégie de la cinquième colonne","page":437,"summary":"L’auteur examine la déstabilisation intérieure d’une organisation par des alliés apparents. Cette analyse des conflits peut aussi servir à reconnaître les comportements de sabotage."},{"title":"La stratégie de la résistance passive","page":449,"summary":"Le texte présente le refus indirect et la docilité de façade comme tactiques de pouvoir. Il montre les risques d’une relation marquée par la dissimulation."},{"title":"La stratégie de la réaction en chaîne","page":465,"summary":"La dernière loi décrit la terreur comme instrument de paralysie. C’est une analyse d’une méthode de violence, non une recommandation ; le texte doit être lu avec distance éthique."}],"chapterUnit":"Chapitres et sections","pdfPages":491,"reviewLinks":["https://www.fnac.com/Strategie-les-33-lois-de-la-guerre/a12059807/avis"]},
{"id": "liv0120", "title": "Comment retrouver toute son énergie : la fatigue n’est pas une fatalité", "author": "Maurice Tran Dinh Can et Juliette Jarre", "genre": "vie-et-societe", "sub": "2", "cover": "images/couvertures/new11-retrouver-energie.jpg", "presentation": "Le Dr Maurice Tran Dinh Can et Juliette Jarre abordent la fatigue à partir d’une réflexion sur les habitudes de vie, les sensations corporelles et l’expérience clinique du médecin. Ils invitent le lecteur à reconnaître les signes d’épuisement, à examiner son quotidien et à réfléchir aux moyens de retrouver un meilleur équilibre. L’ouvrage accorde une place importante à l’acupuncture et à l’interprétation de la fatigue proposée par le praticien. Ces propositions reflètent son expérience ; elles ne remplacent ni un diagnostic médical ni la recherche des causes d’une fatigue persistante.", "summary": "Le Dr Maurice Tran Dinh Can et Juliette Jarre abordent la fatigue à partir d’une réflexion sur les habitudes de vie, les sensations corporelles et l’expérience clinique du médecin. Ils invitent le lecteur à reconnaître les signes d’épuisement, à examiner son quotidien et à réfléchir aux moyens de retrouver un meilleur équilibre. L’ouvrage accorde une place importante à l’acupuncture et à l’interprétation de la fatigue proposée par le praticien. Ces propositions reflètent son expérience ; elles ne remplacent ni un diagnostic médical ni la recherche des causes d’une fatigue persistante.", "detailPath": "ouvrage-new11-retrouver-energie.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-retrouver-energie.pdf"},
{"id": "liv0119", "title": "Divorcer d’un manipulateur : un emploi à plein-temps", "author": "Christel Petitcollin", "genre": "vie-et-societe", "sub": "2", "cover": "images/couvertures/new11-divorcer-manipulateur.jpg", "presentation": "Christel Petitcollin décrit les difficultés particulières d’une séparation lorsqu’un partenaire utilise, selon son analyse, des stratégies de manipulation. Elle suit le cheminement qui va de la prise de conscience à la décision de partir, puis aborde la préparation matérielle, la protection de soi, les démarches judiciaires et les conflits qui peuvent persister après la rupture. Le livre cherche à aider le lecteur à anticiper les tensions et à retrouver une marge de décision. Ses catégories psychologiques ne remplacent pas une évaluation clinique et ses conseils juridiques doivent être vérifiés selon la situation et le droit applicable.", "summary": "Christel Petitcollin décrit les difficultés particulières d’une séparation lorsqu’un partenaire utilise, selon son analyse, des stratégies de manipulation. Elle suit le cheminement qui va de la prise de conscience à la décision de partir, puis aborde la préparation matérielle, la protection de soi, les démarches judiciaires et les conflits qui peuvent persister après la rupture. Le livre cherche à aider le lecteur à anticiper les tensions et à retrouver une marge de décision. Ses catégories psychologiques ne remplacent pas une évaluation clinique et ses conseils juridiques doivent être vérifiés selon la situation et le droit applicable.", "detailPath": "ouvrage-new11-divorcer-manipulateur.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-divorcer-manipulateur.pdf"},
{"id": "liv0118", "title": "Surmonter ses complexes : les comprendre pour les assumer", "author": "Bénédicte Nadaud et Karine Zagaroli", "genre": "savoirs", "sub": "1", "cover": "images/couvertures/new11-surmonter-complexes.jpg", "presentation": "Bénédicte Nadaud et Karine Zagaroli examinent la manière dont une caractéristique physique, psychologique ou sociale peut devenir un complexe. Elles distinguent les complexes subjectifs, liés à la perception de soi et au regard d’autrui, des complexes fondés sur une différence plus tangible. Elles interrogent l’influence des normes, des comparaisons et de l’histoire personnelle, puis proposent des pistes pour réduire l’emprise de ces jugements. L’objectif n’est pas de promettre une perfection impossible, mais d’apprendre à vivre avec ses particularités sans les laisser définir toute son identité.", "summary": "Bénédicte Nadaud et Karine Zagaroli examinent la manière dont une caractéristique physique, psychologique ou sociale peut devenir un complexe. Elles distinguent les complexes subjectifs, liés à la perception de soi et au regard d’autrui, des complexes fondés sur une différence plus tangible. Elles interrogent l’influence des normes, des comparaisons et de l’histoire personnelle, puis proposent des pistes pour réduire l’emprise de ces jugements. L’objectif n’est pas de promettre une perfection impossible, mais d’apprendre à vivre avec ses particularités sans les laisser définir toute son identité.", "detailPath": "ouvrage-new11-surmonter-complexes.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-surmonter-complexes.pdf"},
{"id": "liv0117", "title": "Petit traité de sagesse bouddhiste à l’usage des Occidentaux", "author": "Xavier Cornette de Saint Cyr", "genre": "spiritualites", "sub": "1", "cover": "images/couvertures/new11-sagesse-bouddhiste.jpg", "presentation": "Xavier Cornette de Saint Cyr présente des notions de sagesse bouddhiste à un lectorat occidental. Il explore la souffrance, l’attachement, les habitudes de pensée et la possibilité de transformer son rapport aux événements. L’ouvrage privilégie une approche accessible, qui relie les enseignements à des situations ordinaires et à une pratique attentive de soi. Il ne s’agit pas d’un traité exhaustif sur toutes les écoles du bouddhisme, mais d’une invitation à réfléchir à la bienveillance, à la lucidité et au détachement.", "summary": "Xavier Cornette de Saint Cyr présente des notions de sagesse bouddhiste à un lectorat occidental. Il explore la souffrance, l’attachement, les habitudes de pensée et la possibilité de transformer son rapport aux événements. L’ouvrage privilégie une approche accessible, qui relie les enseignements à des situations ordinaires et à une pratique attentive de soi. Il ne s’agit pas d’un traité exhaustif sur toutes les écoles du bouddhisme, mais d’une invitation à réfléchir à la bienveillance, à la lucidité et au détachement.", "detailPath": "ouvrage-new11-sagesse-bouddhiste.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-sagesse-bouddhiste.pdf"},
{"id": "liv0116", "title": "Les Lois du succès — Tome 4 (leçons 13 à 17)", "author": "Napoleon Hill", "genre": "vie-et-societe", "sub": "5", "cover": "images/couvertures/new11-lois-succes-4.jpg", "presentation": "Le dernier tome rassemble cinq leçons qui donnent une dimension collective et morale au succès. La coopération et la capacité à apprendre des échecs ouvrent la réflexion. Hill traite ensuite de la tolérance et de la Règle d’Or, qui invitent à considérer les autres dans ses décisions. Il clôt son cours par une loi des habitudes, présentée comme une force qui façonnerait progressivement la conduite. Ce volume insiste sur la persévérance, les relations et les comportements répétés ; certaines affirmations relèvent de la philosophie personnelle de l’auteur.", "summary": "Le dernier tome rassemble cinq leçons qui donnent une dimension collective et morale au succès. La coopération et la capacité à apprendre des échecs ouvrent la réflexion. Hill traite ensuite de la tolérance et de la Règle d’Or, qui invitent à considérer les autres dans ses décisions. Il clôt son cours par une loi des habitudes, présentée comme une force qui façonnerait progressivement la conduite. Ce volume insiste sur la persévérance, les relations et les comportements répétés ; certaines affirmations relèvent de la philosophie personnelle de l’auteur.", "detailPath": "ouvrage-new11-lois-succes-4.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-lois-succes-4.pdf"},
{"id": "liv0115", "title": "Les Lois du succès — Tome 3 (leçons 9 à 12)", "author": "Napoleon Hill", "genre": "vie-et-societe", "sub": "5", "cover": "images/couvertures/new11-lois-succes-3.jpg", "presentation": "Le troisième tome développe des habitudes professionnelles et intellectuelles. Hill défend d’abord l’idée de fournir un travail supérieur au strict minimum attendu, puis étudie l’importance d’une personnalité agréable dans les relations. La leçon sur la pensée exacte encourage à distinguer les faits des opinions et à examiner les informations reçues. Enfin, la concentration vise à maintenir l’attention sur un objectif sans se disperser. Ces principes forment un programme de conduite personnelle, illustré par les exemples et convictions de l’auteur.", "summary": "Le troisième tome développe des habitudes professionnelles et intellectuelles. Hill défend d’abord l’idée de fournir un travail supérieur au strict minimum attendu, puis étudie l’importance d’une personnalité agréable dans les relations. La leçon sur la pensée exacte encourage à distinguer les faits des opinions et à examiner les informations reçues. Enfin, la concentration vise à maintenir l’attention sur un objectif sans se disperser. Ces principes forment un programme de conduite personnelle, illustré par les exemples et convictions de l’auteur.", "detailPath": "ouvrage-new11-lois-succes-3.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-lois-succes-3.pdf"},
{"id": "liv0114", "title": "Les Lois du succès — Tome 2 (leçons 5 à 8)", "author": "Napoleon Hill", "genre": "vie-et-societe", "sub": "5", "cover": "images/couvertures/new11-lois-succes-2.jpg", "presentation": "Le deuxième tome regroupe quatre qualités que Napoleon Hill juge indispensables à l’action. L’initiative et le leadership concernent la capacité à décider et à entraîner les autres ; l’imagination permet de concevoir des solutions et des possibilités nouvelles. L’enthousiasme est présenté comme une énergie communicative, tandis que la maîtrise de soi vise à éviter que les émotions et les impulsions ne détournent l’effort. Ensemble, ces leçons prolongent le travail sur les objectifs abordé dans le premier tome.", "summary": "Le deuxième tome regroupe quatre qualités que Napoleon Hill juge indispensables à l’action. L’initiative et le leadership concernent la capacité à décider et à entraîner les autres ; l’imagination permet de concevoir des solutions et des possibilités nouvelles. L’enthousiasme est présenté comme une énergie communicative, tandis que la maîtrise de soi vise à éviter que les émotions et les impulsions ne détournent l’effort. Ensemble, ces leçons prolongent le travail sur les objectifs abordé dans le premier tome.", "detailPath": "ouvrage-new11-lois-succes-2.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-lois-succes-2.pdf"},
{"id": "liv0113", "title": "Les Lois du succès — Tome 1 (leçons 1 à 4)", "author": "Napoleon Hill", "genre": "vie-et-societe", "sub": "5", "cover": "images/couvertures/new11-lois-succes-1.jpg", "presentation": "Ce premier tome présente les fondations du programme de Napoleon Hill. Le « cerveau collectif » désigne la coopération organisée entre personnes qui partagent un projet. L’auteur invite ensuite à définir un objectif précis, puis à renforcer la confiance en soi pour agir malgré l’incertitude. Il termine par l’habitude de l’épargne, comprise comme une discipline de gestion personnelle. Les leçons mêlent arguments, anecdotes et exercices d’auto-observation ; elles reflètent une philosophie de réussite plutôt qu’un modèle scientifique validé.", "summary": "Ce premier tome présente les fondations du programme de Napoleon Hill. Le « cerveau collectif » désigne la coopération organisée entre personnes qui partagent un projet. L’auteur invite ensuite à définir un objectif précis, puis à renforcer la confiance en soi pour agir malgré l’incertitude. Il termine par l’habitude de l’épargne, comprise comme une discipline de gestion personnelle. Les leçons mêlent arguments, anecdotes et exercices d’auto-observation ; elles reflètent une philosophie de réussite plutôt qu’un modèle scientifique validé.", "detailPath": "ouvrage-new11-lois-succes-1.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-lois-succes-1.pdf"},
{"id": "liv0112", "title": "La prodigieuse machine à vendre", "author": "Chet Holmes", "genre": "savoirs", "sub": "5", "cover": "images/couvertures/new11-machine-vendre.jpg", "presentation": "Chet Holmes propose une méthode pour rendre la performance commerciale moins dépendante de l’improvisation. Ses douze leviers concernent notamment la gestion des priorités, la formation répétée, le marketing éducatif, la prospection, la qualité des présentations et l’organisation des équipes. L’auteur insiste sur la discipline d’exécution : sélectionner quelques pratiques décisives et les répéter jusqu’à ce qu’elles deviennent des habitudes collectives. Le livre s’adresse aux responsables commerciaux et dirigeants qui souhaitent structurer leur activité plutôt que multiplier des initiatives dispersées. Les exemples et résultats annoncés sont ceux de l’auteur et ne constituent pas une garantie de performance.", "summary": "Chet Holmes propose une méthode pour rendre la performance commerciale moins dépendante de l’improvisation. Ses douze leviers concernent notamment la gestion des priorités, la formation répétée, le marketing éducatif, la prospection, la qualité des présentations et l’organisation des équipes. L’auteur insiste sur la discipline d’exécution : sélectionner quelques pratiques décisives et les répéter jusqu’à ce qu’elles deviennent des habitudes collectives. Le livre s’adresse aux responsables commerciaux et dirigeants qui souhaitent structurer leur activité plutôt que multiplier des initiatives dispersées. Les exemples et résultats annoncés sont ceux de l’auteur et ne constituent pas une garantie de performance.", "detailPath": "ouvrage-new11-machine-vendre.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-machine-vendre.pdf"},
{"id": "liv0111", "title": "La Chute", "author": "Albert Camus", "genre": "fiction", "sub": "0", "cover": "images/couvertures/new11-la-chute.jpg", "presentation": "À Amsterdam, Jean-Baptiste Clamence engage une conversation avec un interlocuteur silencieux. Ancien avocat parisien, il décrit d’abord une existence flatteuse, faite de générosité apparente, de réussite sociale et de bonne conscience. Au fil de son monologue, des souvenirs plus troubles ébranlent cette image : il découvre l’écart entre la vertu qu’il affichait et ses motivations profondes. Le récit se transforme en examen de la culpabilité, de l’hypocrisie et du besoin de juger autrui. Camus construit une confession ambiguë : en s’accusant, Clamence cherche aussi à entraîner son auditeur dans une culpabilité commune.", "summary": "À Amsterdam, Jean-Baptiste Clamence engage une conversation avec un interlocuteur silencieux. Ancien avocat parisien, il décrit d’abord une existence flatteuse, faite de générosité apparente, de réussite sociale et de bonne conscience. Au fil de son monologue, des souvenirs plus troubles ébranlent cette image : il découvre l’écart entre la vertu qu’il affichait et ses motivations profondes. Le récit se transforme en examen de la culpabilité, de l’hypocrisie et du besoin de juger autrui. Camus construit une confession ambiguë : en s’accusant, Clamence cherche aussi à entraîner son auditeur dans une culpabilité commune.", "detailPath": "ouvrage-new11-la-chute.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-la-chute.pdf"},
{"id": "liv0110", "title": "Les Secrets de la Loi d’Attraction", "author": "Sié Issa", "genre": "vie-et-societe", "sub": "5", "cover": "images/couvertures/new11-loi-attraction.jpg", "presentation": "Sié Issa présente la loi d’attraction comme une démarche où les pensées, les croyances et les attentes orienteraient les expériences vécues. Il commence par décrire trois étapes — demander, croire, recevoir — avant d’examiner les croyances limitantes et les habitudes mentales qui, selon lui, empêchent d’atteindre un objectif. Les exercices invitent à identifier ses convictions, à les reformuler, à pratiquer la gratitude et à agir dans différents domaines : travail, relations, santé et finances. Le texte relève du développement personnel : ses explications sur les « ondes » et le pouvoir causal des pensées sont des affirmations de l’auteur, non des mécanismes scientifiquement démontrés.", "summary": "Sié Issa présente la loi d’attraction comme une démarche où les pensées, les croyances et les attentes orienteraient les expériences vécues. Il commence par décrire trois étapes — demander, croire, recevoir — avant d’examiner les croyances limitantes et les habitudes mentales qui, selon lui, empêchent d’atteindre un objectif. Les exercices invitent à identifier ses convictions, à les reformuler, à pratiquer la gratitude et à agir dans différents domaines : travail, relations, santé et finances. Le texte relève du développement personnel : ses explications sur les « ondes » et le pouvoir causal des pensées sont des affirmations de l’auteur, non des mécanismes scientifiquement démontrés.", "detailPath": "ouvrage-new11-loi-attraction.html", "catalogueRevision": 20261118, "publicationStatus": "Notice et couverture publiques ; PDF non proposé", "pdfPath": "lot_01/pdf/new11-loi-attraction.pdf"},
  {
    "id": "liv0101",
    "title": "Avoir le courage de ne pas être aimé",
    "author": "Ichiro Kishimi et Fumitake Koga",
    "genre": "savoirs",
    "sub": "1",
    "year": 2018,
    "publisher": "Guy Trédaniel",
    "isbn": "9782813216458",
    "edition": "Informations vérifiées dans le PDF fourni ; autres données non confirmées laissées vides.",
    "contributors": "",
    "presentation": "Dialogue philosophique présentant la psychologie d’Alfred Adler. Un jeune homme interroge un philosophe sur la possibilité de changer, les relations avec autrui, le besoin de reconnaissance et la liberté de choisir sa vie.",
    "themes": [],
    "external": {
      "site": "",
      "url": null,
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "",
      "text": ""
    },
    "sources": [],
    "pdfPath": "pdf/nouveau-courage.pdf",
    "pdfPages": 268,
    "cover": "images/couvertures/nouveau-courage.jpg",
    "summary": "Le dialogue progresse en cinq nuits. Il confronte les explications centrées sur le passé à une approche fondée sur les buts, examine les difficultés relationnelles, puis la séparation des tâches, le sentiment de communauté et la manière de vivre le présent.",
    "text": "",
    "catalogueRevision": 20261118,
    "pdfSha256": "3b0f0a49702c3e66c2721a167ddfdf0c08586807427a0e6049d293b6f4c5f946",
    "detailPath": "ouvrage-nouveau-courage.html"
  },
  {
    "id": "liv0102",
    "title": "Une histoire populaire de l’humanité",
    "author": "Chris Harman",
    "genre": "savoirs",
    "sub": "3",
    "year": 2012,
    "publisher": "Boréal",
    "isbn": "9782764621660",
    "edition": "Informations vérifiées dans le PDF fourni ; autres données non confirmées laissées vides.",
    "contributors": "",
    "presentation": "Une histoire mondiale racontée en donnant une place centrale aux populations ordinaires, aux conflits sociaux et aux transformations des sociétés.",
    "themes": [],
    "external": {
      "site": "Avis lecteurs Fnac",
      "url": "https://www.fnac.com/Une-histoire-populaire-de-l-humanite/a3399287/avis",
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "Avis sur le titre, édition ou format potentiellement différent du PDF fourni.",
      "text": "Consulter les avis sur le site source."
    },
    "sources": [],
    "pdfPath": "pdf/nouveau-harman.pdf",
    "pdfPages": 1050,
    "cover": "images/couvertures/nouveau-harman.jpg",
    "summary": "De la préhistoire au monde contemporain, Harman examine les transformations des modes de production, des empires, des religions, des révolutions et des rapports de classe. Son récit revendique une perspective d’histoire sociale.",
    "text": "",
    "catalogueRevision": 20261118,
    "pdfSha256": "02cf47c0e3e904d3cbdb8acb11a4c83a4628b65c449fb1a91072b966b257fe09",
    "detailPath": "ouvrage-nouveau-harman.html"
  },
  {
    "id": "liv0103",
    "title": "La pensée positive",
    "author": "Marcello Borelli",
    "genre": "vie-et-societe",
    "sub": "5",
    "year": 2020,
    "publisher": "Non indiqué dans le PDF",
    "isbn": "9798621428907",
    "edition": "Informations vérifiées dans le PDF fourni ; autres données non confirmées laissées vides.",
    "contributors": "",
    "presentation": "Guide pratique sur les pensées négatives, la confiance en soi et les habitudes destinées à favoriser une attitude plus positive.",
    "themes": [],
    "external": {
      "site": "",
      "url": null,
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "",
      "text": ""
    },
    "sources": [],
    "pdfPath": "pdf/nouveau-positive.pdf",
    "pdfPages": 93,
    "cover": "images/couvertures/nouveau-positive.jpg",
    "summary": "Le texte décrit les effets attribués aux pensées négatives, les bénéfices espérés de la pensée positive et vingt conseils pratiques. Certaines affirmations relèvent de la démarche de développement personnel et ne doivent pas être assimilées à des résultats scientifiques établis.",
    "text": "",
    "catalogueRevision": 20261118,
    "pdfSha256": "153a6704c69e76795d3512c4534a6b8333f565efc553598a87921f2449eb71d8",
    "detailPath": "ouvrage-nouveau-positive.html"
  },
  {
    "id": "liv0104",
    "title": "Le guide de l’apprenti millionnaire",
    "author": "Christopher Sojtarov",
    "genre": "vie-et-societe",
    "sub": "4",
    "year": 2018,
    "publisher": "Éditions Bergame",
    "isbn": "",
    "edition": "Informations vérifiées dans le PDF fourni ; autres données non confirmées laissées vides.",
    "contributors": "",
    "presentation": "Un ouvrage de développement personnel et d’éducation à l’enrichissement, fondé sur les habitudes, les décisions et la conduite de projets.",
    "themes": [],
    "external": {
      "site": "",
      "url": null,
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "",
      "text": ""
    },
    "sources": [],
    "pdfPath": "pdf/nouveau-millionnaire.pdf",
    "pdfPages": 379,
    "cover": "images/couvertures/nouveau-millionnaire.jpg",
    "summary": "L’auteur mêle expérience personnelle, motivation, gestion des obstacles et stratégies qu’il présente comme favorables à la réussite financière. Les promesses de richesse sont celles de l’auteur, non des résultats garantis.",
    "text": "",
    "catalogueRevision": 20261118,
    "pdfSha256": "255a23face37363f7b8201f81fd963bd54627bf290d241b4e7d8e0113fba1c02",
    "detailPath": "ouvrage-nouveau-millionnaire.html"
  },
  {
    "id": "liv0105",
    "title": "Le Manuscrit inachevé",
    "author": "Franck Thilliez",
    "genre": "fiction",
    "sub": "2",
    "year": 2018,
    "publisher": "Non vérifié dans ce fichier",
    "isbn": "",
    "edition": "Informations vérifiées dans le PDF fourni ; autres données non confirmées laissées vides.",
    "contributors": "",
    "presentation": "Thriller à énigmes autour d’un manuscrit fictif, de disparitions et d’une enquête aux ramifications troublantes.",
    "themes": [],
    "external": {
      "site": "Avis lecteurs Livraddict",
      "url": "https://www.livraddict.com/biblio/livre/le-manuscrit-inacheve.html",
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "Avis sur le titre, édition ou format potentiellement différent du PDF fourni.",
      "text": "Consulter les avis sur le site source."
    },
    "sources": [],
    "pdfPath": "pdf/nouveau-manuscrit.pdf",
    "pdfPages": 437,
    "cover": "images/couvertures/nouveau-manuscrit.jpg",
    "summary": "Le roman utilise une mise en abyme : une préface présente le manuscrit inachevé d’un écrivain fictif, puis le récit multiplie les indices et les mystères. Les résumés de chapitres ci-dessous évitent de révéler les solutions.",
    "text": "",
    "catalogueRevision": 20261118,
    "pdfSha256": "b0fb14c182d570826fa23efbc60d9c4b0ad2afe1171e4a343435b146a94a9c9d",
    "detailPath": "ouvrage-nouveau-manuscrit.html"
  },
  {
    "id": "liv0106",
    "title": "Les bons leaders se posent les bonnes questions",
    "author": "John C. Maxwell",
    "genre": "savoirs",
    "sub": "5",
    "year": null,
    "publisher": "Non vérifié dans ce fichier",
    "isbn": "",
    "edition": "Informations vérifiées dans le PDF fourni ; autres données non confirmées laissées vides.",
    "contributors": "",
    "presentation": "Un ouvrage consacré à l’art de poser des questions pour mieux apprendre, diriger, résoudre les conflits et développer d’autres leaders.",
    "themes": [],
    "external": {
      "site": "",
      "url": null,
      "rating": null,
      "count": null,
      "comments": null,
      "scope": "",
      "text": ""
    },
    "sources": [],
    "pdfPath": "pdf/nouveau-leaders.pdf",
    "pdfPages": 540,
    "cover": "images/couvertures/nouveau-leaders.jpg",
    "summary": "L’auteur organise son propos en deux parties : les questions qu’il se pose et celles que lui adressent d’autres dirigeants. Il traite notamment du leadership personnel, des équipes, des conflits et de la transmission.",
    "text": "",
    "catalogueRevision": 20261118,
    "pdfSha256": "5c8dcb8b9448445d44c3b11990571ccca46d69426defaf46294ba6f89e1a024b",
    "detailPath": "ouvrage-nouveau-leaders.html"
  },
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
function bookLink(b,dest='livre'){if(dest==='livre'&&b.detailPath&&!b.accessLevel)return siteHref(b.detailPath);return dest+'.html?id='+encodeURIComponent(b.id);}
function isHorror(book) {
  return book.genre === 'fiction' && String(book.sub) === '8';
}
function horrorMark(book) {
  if (!isHorror(book)) return '';
  return '<span class="horror-book-mark"><img class="horror-book-sticker" src="images/carnet-illustre/frisson-rose.jpg" alt="">Rayon Horreur</span>';
}
const accessLabels=['','Jaune · Découverte','Orange · Passion','Rouge · Illimité'];
const accessColors=['','#fbec9a','#ffcc9f','#f4a7b0'];
function lockBadge(book){const level=book.accessLevel;return level?'<span class="book-access" style="background:'+accessColors[level]+';color:#412b35;border-radius:1em;padding:.2em .6em">🔒 '+accessLabels[level]+'</span>':'';}
function bookSubscriptionOffer(book){
 const level=Number(book.accessLevel);
 const plans=['','Découverte','Passion','Illimité'];
 if(!plans[level])return '';
 if(!document.querySelector('link[href*="livres-cercle.css"]')){
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=siteHref('css/livres-cercle.css');document.head.append(sheet);
 }
 return '<aside class="cercle-book-offer cercle-book-offer-'+level+'"><img src="'+esc(assetHref('images/atelier/revue-ouverte.jpg'))+'" alt=""><div><span class="cercle-book-tier">🔒 '+plans[level]+'</span><h2>Ce livre fait partie du Cercle</h2><p>Retrouve cette lecture dans la formule <strong>'+plans[level]+'</strong>'+(level<3?' et les formules supérieures':'')+'.</p><a class="btn" href="'+siteHref('le-cercle.html#comparatif')+'">Découvrir les formules ↗</a></div></aside>';
}
function editorialControl(book){return siteHref('admin-catalogue.html?livre='+encodeURIComponent(book.accessBookId||book.id)+'#catalogue-access-admin');}
function catalogueControls(book){
 if(!catalogueManager)return '';
 const labels=['Gratuit','Jaune · Découverte','Orange · Passion','Rouge · Illimité'];
 const options=labels.map((label,level)=>'<option value="'+level+'"'+(Number(book.accessLevel||0)===level?' selected':'')+'>'+label+'</option>').join('');
 return '<details class="book-moderation" data-moderation-book="'+esc(book.id)+'"><summary>Gérer ce livre</summary><label>Accès PDF <select data-moderation-level>'+options+'</select></label><div class="book-moderation-actions"><button class="btn secondary" type="button" data-moderation-action="lock">'+(book.accessLevel?'Modifier le cadenas':'Ajouter un cadenas')+'</button><button class="btn secondary" type="button" data-moderation-action="delete">Supprimer le livre</button></div><a href="'+esc(editorialControl(book))+'">Importer un PDF privé ↗</a><p role="status"></p></details>';
}
function bindCatalogueControls(){
 if(!catalogueManager)return;
 if(!document.querySelector('link[href*="book-moderation.css"]')){
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=siteHref('css/book-moderation.css');document.head.append(sheet);
 }
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-moderation-action]');
  if(!button||button.disabled)return;
  const panel=button.closest('[data-moderation-book]');
  const book=state.books.find(item=>item.id===panel.dataset.moderationBook);
  if(!book)return;
  const remove=button.dataset.moderationAction==='delete';
  if(remove&&!window.confirm('Es-tu sûr de vouloir supprimer « '+book.title+' » du catalogue pour tout le monde ?'))return;
  const level=remove?Number(book.accessLevel||0):Number(panel.querySelector('[data-moderation-level]').value);
  const status=panel.querySelector('[role="status"]');
  const buttons=Array.from(panel.querySelectorAll('button'));
  buttons.forEach(item=>item.disabled=true);
  status.textContent=remove?'Suppression en cours…':'Enregistrement du cadenas…';
  try{
   const {auth,requestService}=await import('./request-service.js');
   const account=auth.currentUser;
   if(account?.uid!==ellUser?.id)throw Error('Le compte a changé. Recharge la page.');
   await requestService('catalogue-moderate',{bookId:book.accessBookId||book.id,level,hidden:false,deleted:remove},account);
   if(remove&&$('book-detail')){location.assign(siteHref('mes-livres.html'));return;}
   if(remove){
    state.books=state.books.filter(item=>item.id!==book.id);
    renderBooks();renderRecommendations();
    const results=$('search-count')||$('shelf-count');
    if(results)results.textContent='« '+book.title+' » a été retiré. '+results.textContent;
    return;
   }
   status.textContent=level?'Cadenas enregistré.':'Le livre est en accès gratuit.';
   location.reload();
  }catch(error){status.textContent=error.message;}
  finally{buttons.forEach(item=>item.disabled=false);}
 });
}
function card(b,admin=false,dest='livre'){return '<article data-ell-book-id="'+esc(b.id)+'" class="panel book'+(isHorror(b)?' horror-book':'')+'">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="Couverture de '+esc(b.title)+'">':'<div class="cover">'+esc(b.title)+'</div>')+'<div><h2>'+esc(b.title)+'</h2>'+lockBadge(b)+''+horrorMark(b)+'<p>'+esc(b.author)+'</p>'+(bookYear(b)?'<p class="book-meta-line">'+esc(bookYear(b))+' · '+esc(b.edition?.publisher ?? b.publisher ?? '')+'</p>':'')+(b.privatePdf?'<p class="book-pdf-label">PDF disponible</p>':b.pdfPath?'<p class="book-pdf-label">PDF inclus · '+b.pdfPages+' pages</p>':'')+'<a class="btn" href="'+bookLink(b,dest)+'">'+(dest==='avis'?'Ma critique':'Présentation du livre')+'</a><a class="btn secondary" href="'+bookLink(b,'lire')+'">Lire</a>'+catalogueControls(b)+(admin?'<a class="btn secondary" href="'+bookLink(b,'ajouter-livre')+'">Modifier</a><button class="danger" data-delete-book="'+esc(b.id)+'">Supprimer</button>':'')+'</div></article>';}
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
  const subgenre = $('search-subgenre')?.value || el.dataset.sub;
  const terms = searchTerms($('search')?.value || '');
  const favorites=window.ELLCollections?.read().favorites||[];
  const items = state.books.filter(book => {
    if (genre && book.genre !== genre) return false;
    if (subgenre && String(book.sub) !== subgenre) return false;
    if ($('search-favorites')?.checked && !favorites.some(favorite=>(catalogueAliases.get(favorite)||favorite)===book.id)) return false;
    if ($('search-year')?.value && bookYear(book)!==$('search-year').value) return false;
    if ($('pdf-only')?.checked && !book.pdfPath && !book.pdf && !book.privatePdf && !book.accessLevel) return false;
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
  const published=$('search-publication');
  if(published){const book=items.find(item=>item.id===new URLSearchParams(location.search).get('publie'));published.textContent=book?'« '+book.title+' » est publié dans '+GENRES[book.genre][0]+' · '+GENRES[book.genre][1][book.sub]+'.':'';}
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
  if(book.accessLevel>readerLevel)return bookSubscriptionOffer(book);
  if(book.accessLevel||book.privatePdf){
    const read='lire.html?id='+encodeURIComponent(book.id)+'#reader-content';
    return '<div class="book-file-actions">'+lockBadge(book)+' <a class="btn" href="'+read+'">Ouvrir le lecteur</a> <button class="btn" type="button" data-private-download="'+esc(book.accessBookId||book.id)+'" data-public-download="'+String(!book.accessLevel)+'">Télécharger le PDF</button></div>';
  }
  const pdf = meta.pdf || meta.pdfPath;
  const readLabel = pdf ? 'Lire le PDF ici' : 'Ouvrir le texte';
  const readHint = pdf ? 'Lecteur intégré · surlignage et notes' : 'Lire et prendre des notes';
  const downloadHint = meta.pdfPages ? 'PDF · '+meta.pdfPages+' pages' : 'Enregistrer une copie sur ton appareil';
  const fileName = (meta.pdfPath?.startsWith('pdf/') ? meta.pdfPath.slice(4) : book.title.replace(/[\\/:*?"<>|]/g,'-')+'.pdf');
  const download = pdf ? `<a class="book-file-action file-download" data-count-download="${esc(book.id)}" href="${esc(pdf)}" ${meta.pdfPath&&!meta.pdf?`data-pdf-link="${esc(meta.pdfPath)}"`:''} download="${esc(fileName)}">
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
"liv0121": {"unit":"Chapitres et sections","chapters":[{"title":"Anticipation et décision","page":11,"summary":"Les citations opposent l’urgence d’agir à la nécessité de prévoir. Elles invitent le décideur à articuler information, jugement, intuition et prise de risque, tout en rappelant que les décisions ont des conséquences durables."},{"title":"Innovation, remise en cause et changement","page":23,"summary":"Les auteurs rapprochent des pensées sur la nouveauté, la remise en question des habitudes et la difficulté de transformer l’existant. Le chapitre sert de réservoir de formulations pour discuter des résistances et de l’adaptation."},{"title":"Mise en œuvre et action","page":43,"summary":"Cette section déplace l’attention des intentions vers la réalisation. Les extraits interrogent la volonté, la persévérance et l’écart entre ce que l’on affirme et ce que l’on fait effectivement."},{"title":"Travail, production, vente et conquête","page":55,"summary":"Les citations abordent l’effort professionnel, la création de valeur, les échanges et l’ambition. Elles permettent de mettre en perspective la performance et le sens accordé au travail."},{"title":"Animation, motivation et récompense","page":79,"summary":"Les extraits rassemblent des idées sur la conduite des équipes, la reconnaissance et les ressorts de l’engagement. La motivation n’y apparaît pas comme un simple ordre, mais comme une question de relations et de responsabilités."},{"title":"Attitudes et comportements : compréhension et développement","page":101,"summary":"Le chapitre explore les comportements humains, leurs contradictions et la possibilité d’apprendre à se connaître. Il propose des points de départ pour réfléchir aux réactions individuelles et à l’évolution personnelle."},{"title":"Communication et image","page":123,"summary":"Les formules rassemblées éclairent les effets de la parole, de l’apparence et de la réputation. Elles peuvent servir à interroger la sincérité d’un message et les malentendus qu’il produit."},{"title":"Éthique et finalités","page":141,"summary":"Les citations conduisent à se demander au service de quoi l’on décide et l’on agit. Elles rappellent que le succès immédiat ne dispense pas d’examiner les valeurs, les responsabilités et la destination de l’action."}],"edition":{"pages":177},"summary":"Ce recueil organise 600 citations autour des choix et des responsabilités du manager. Les premières sections confrontent anticipation et décision : agir suppose de juger une situation sans disposer de certitudes absolues. Viennent ensuite l'innovation, la remise en cause des habitudes et le passage des intentions à l'exécution. Le livre aborde aussi la production, la vente, la motivation et la reconnaissance au sein des équipes. Les dernières parties interrogent les comportements humains, la communication, l'image et les exigences éthiques. Ce n'est pas un manuel qui défend une méthode unique : les formules, parfois contradictoires, constituent surtout des points de départ pour discuter une situation et examiner plusieurs manières d'agir."},
"liv0122": {"unit":"Chapitres et sections","chapters":[{"title":"L’aspiration : se préparer sans se surestimer","page":19,"summary":"Ryan Holiday présente l’ego comme un obstacle dès le début d’un projet : l’ambition et le discours sur soi peuvent détourner du travail concret. Il recommande de conserver une attitude d’apprenant."},{"title":"Parler, parler et parler encore","page":27,"summary":"Le chapitre critique la tentation de raconter ses ambitions avant de les avoir réalisées. Pour l’auteur, la parole peut procurer une satisfaction prématurée qui remplace l’effort."},{"title":"Être ou faire ?","page":32,"summary":"Holiday oppose la recherche d’un statut ou d’une image à la volonté de produire quelque chose d’utile. L’enjeu est de choisir l’action plutôt que la reconnaissance."},{"title":"L’éternel étudiant","page":38,"summary":"Le progrès exige d’accepter de ne pas savoir et de recevoir des corrections. La posture d’élève devient un antidote à l’arrogance."},{"title":"Éviter de s’emballer","page":44,"summary":"L’enthousiasme initial n’est pas une preuve de maîtrise. Le chapitre recommande de garder le sens des proportions et d’éviter les grands récits sur sa propre destinée."},{"title":"La stratégie de la toile vierge","page":50,"summary":"À ses débuts, il peut être plus utile d’aider les autres et de créer des occasions d’apprendre que de chercher immédiatement à être au premier plan. Holiday valorise le travail discret."},{"title":"Se retenir","page":56,"summary":"La maîtrise de soi consiste notamment à ne pas répondre à chaque provocation. L’auteur met en garde contre les réactions dictées par l’orgueil blessé."},{"title":"Sortir de sa tête","page":61,"summary":"Une vie entièrement occupée par ses projections et son image favorise les illusions. Holiday invite à confronter ses idées à la réalité extérieure et aux tâches présentes."},{"title":"Le danger de l’orgueil précoce","page":67,"summary":"Une réussite partielle peut susciter un sentiment de supériorité dangereux. L’auteur recommande de garder un jugement lucide sur son niveau réel."},{"title":"Travailler, travailler et travailler encore","page":72,"summary":"Les résultats viennent d’un effort poursuivi plutôt que de l’auto-promotion. Le chapitre valorise la répétition, l’apprentissage et la discipline."},{"title":"La réussite : rester lucide","page":80,"summary":"Une fois le succès obtenu, l’ego peut entraîner autosatisfaction, besoin de contrôle et aveuglement. Le livre propose de maintenir la modestie et l’exigence."},{"title":"Toujours apprendre","page":87,"summary":"L’expérience et la réputation ne dispensent jamais de se remettre en question. La progression dépend de la capacité à écouter des avis contraires."},{"title":"Ne pas se raconter d’histoires","page":92,"summary":"Holiday critique les récits arrangés qui transforment le hasard ou les aides reçues en preuve de génie personnel. Il privilégie une lecture précise des faits."},{"title":"Qu’est-ce qui est important à vos yeux ?","page":98,"summary":"Le chapitre invite à distinguer ses priorités profondes des signes extérieurs de prestige. Sans hiérarchie claire, la réussite peut devenir une course sans fin."},{"title":"Droit, contrôle et paranoïa","page":103,"summary":"La réussite peut créer le sentiment de tout mériter, puis la peur de perdre sa place. Holiday décrit les impasses d’une volonté excessive de contrôler les autres."},{"title":"Se gérer","page":108,"summary":"Au-delà de la compétence technique, la responsabilité suppose de gérer son temps, ses impulsions et ses décisions. L’auteur insiste sur la discipline personnelle."},{"title":"Gare à la maladie du moi","page":113,"summary":"Le danger survient lorsque chaque événement est interprété à travers sa propre importance. Le chapitre encourage à se détacher de l’obsession de sa personne."},{"title":"Méditer sur l’immensité","page":118,"summary":"Remettre son parcours dans une perspective historique et collective aide à relativiser sa réussite. L’humilité devient un outil de lucidité."},{"title":"Rester sobre","page":122,"summary":"Holiday prône une conduite mesurée même quand la reconnaissance augmente. Il oppose la stabilité de caractère à l’excès et à l’autocélébration."},{"title":"L’échec : traverser la difficulté","page":130,"summary":"La troisième partie traite des moments où les projets se brisent. L’auteur y distingue la souffrance réelle du drame supplémentaire créé par un ego qui refuse la contradiction."},{"title":"Temps vif ou temps mort ?","page":140,"summary":"Les périodes d’attente et de revers peuvent être perdues dans l’amertume ou utilisées pour apprendre. Holiday propose de transformer ce temps en travail utile."},{"title":"L’effort est suffisant","page":144,"summary":"Le résultat n’est jamais entièrement sous notre contrôle ; l’engagement et la qualité du travail le sont davantage. L’auteur propose de ne pas conditionner toute estime de soi à la victoire."},{"title":"Les moments Fight Club","page":149,"summary":"Les revers exposent brutalement les illusions que l’on entretient sur soi. Le chapitre recommande de regarder ces faits en face plutôt que de chercher des excuses."},{"title":"Fixer les limites","page":154,"summary":"Savoir reconnaître l’existence d’une situation difficile évite de prolonger une lutte dictée seulement par l’orgueil. La lucidité permet de réorienter ses efforts."},{"title":"Tenir un tableau des résultats","page":160,"summary":"L’auteur demande d’évaluer ses actes selon des critères réels, et non à partir d’une narration flatteuse. La confrontation aux résultats soutient l’apprentissage."},{"title":"Aimer toujours","page":164,"summary":"Face à l’injustice ou à l’échec, entretenir le ressentiment risque d’emprisonner durablement. Le chapitre encourage à ne pas laisser l’amertume guider la suite."},{"title":"Épilogue : vigilance durable","page":172,"summary":"L’ego réapparaît aux différentes étapes du parcours. Le livre se conclut sur la nécessité de cultiver l’humilité, le travail et la capacité d’adaptation sans les considérer comme acquis."}],"edition":{"pages":191},"summary":"Ryan Holiday étudie l'ego à trois moments décisifs : lorsque l'on aspire à réussir, lorsque l'on obtient des résultats et lorsque l'on traverse un échec. Au début, il met en garde contre le besoin de parler de ses projets, de construire une image flatteuse ou de rechercher un statut avant d'avoir accompli le travail. Pendant la réussite, il insiste sur l'humilité, l'apprentissage continu et la capacité à ne pas confondre reconnaissance et valeur personnelle. Face aux revers, il invite à reconnaître les faits, à accepter sa part de responsabilité et à reprendre un travail patient. À travers des exemples historiques et des réflexions pratiques, son argument central est que l'ambition peut être utile, mais que l'obsession de soi fragilise le jugement et la progression."},
"liv0123": {"unit":"Chapitres et sections","chapters":[{"title":"Préface et introduction","page":5,"summary":"Le livret présente la pensée positive comme une façon de diriger son attention et de mieux utiliser ses ressources. Son vocabulaire de magnétisme relève de l’approche développée par le document, pas d’un mécanisme scientifique établi."},{"title":"La puissance du magnétisme","page":9,"summary":"Le texte affirme que l’attitude personnelle et la disposition d’esprit modifieraient la relation aux circonstances. Il appelle le lecteur à observer ses attentes et à développer confiance et volonté."},{"title":"La force magnétique de la pensée","page":11,"summary":"L’auteur associe les pensées répétées aux habitudes, aux choix et à la manière d’interpréter les événements. Les explications en termes de vibrations sont des croyances présentées dans le livret et ne démontrent pas une causalité physique."},{"title":"La concentration est essentielle","page":28,"summary":"Le livret insiste sur l’attention soutenue pour orienter les efforts vers un objectif. Il oppose la dispersion mentale à une démarche plus ordonnée et persévérante."},{"title":"Conseils pour renforcer la concentration","page":32,"summary":"La dernière partie présente des exercices d’attention et une invitation à pratiquer régulièrement. Le bénéfice suggéré concerne surtout la discipline et la focalisation, sans garantie de résultat matériel."}],"edition":{"pages":37},"summary":"Ce court ouvrage présente la pensée positive et la concentration comme des moyens d'orienter l'attention vers les possibilités plutôt que vers les obstacles. Il développe l'idée d'un « magnétisme » personnel lié aux pensées, aux dispositions intérieures et à la manière d'aborder les événements. Les sections suivantes expliquent comment la répétition des idées et la focalisation sur un objectif pourraient influencer les habitudes et les décisions. La fin propose de travailler la concentration de façon régulière. Il convient de distinguer les conseils pratiques sur l'attention et l'engagement, qui peuvent être discutés, des affirmations selon lesquelles la pensée attirerait directement des événements : ces dernières relèvent du cadre de croyance de l'auteur et ne sont pas établies comme une loi scientifique."},
"liv0124": {"unit":"Chapitres et sections","chapters":[{"title":"Les émotions : de quoi s’agit-il ?","page":16,"summary":"Christine Chevalier définit les émotions et leurs fonctions dans les interactions. Elle introduit des outils d’analyse transactionnelle afin de distinguer ce qui se passe chez une personne de la réaction que cela suscite chez son interlocuteur."},{"title":"Comprendre l’émotion pour pouvoir aider","page":33,"summary":"Le chapitre décrit le déroulement émotionnel, les signes corporels et les bénéfices d’une expression adaptée. Il propose de reconnaître l’émotion avant de vouloir résoudre immédiatement le problème."},{"title":"Accompagner les émotions","page":78,"summary":"L’autrice organise l’accompagnement autour de gestes successifs : recevoir, supporter, permettre, aider, apaiser et réparer. Chaque étape suppose de tenir compte de la personne et du contexte plutôt que d’imposer une réponse standard."},{"title":"Quelques exemples d’interventions","page":114,"summary":"Des situations illustrent la régulation de la colère, de la peur, de la tristesse et de la joie. Ces cas montrent comment adapter l’écoute, les paroles et les limites à l’émotion rencontrée."},{"title":"Accompagner ou non les conflits","page":132,"summary":"Chevalier analyse les manifestations d’un conflit et les résistances qui empêchent sa résolution. Elle détaille les conditions minimales nécessaires avant d’intervenir, et les situations où une médiation improvisée peut être inadaptée."},{"title":"La violence et l’agressivité","page":143,"summary":"Le texte distingue les signes, les mécanismes et les contextes de la violence. Il met l’accent sur le repérage des risques et sur les précautions à prendre lorsqu’une réaction devient menaçante."},{"title":"La situation de choc émotionnel","page":200,"summary":"Le dernier chapitre décrit les réactions de crise et les besoins immédiats de la personne touchée. Les outils proposés visent un accompagnement adapté, sans confondre aide relationnelle et prise en charge clinique."}],"edition":{"pages":266},"summary":"Christine Chevalier commence par définir les émotions et leur rôle dans la vie relationnelle. Elle explique comment les manifestations corporelles, les réactions et les besoins associés à une émotion peuvent être reconnus avant d'intervenir. L'ouvrage propose ensuite une démarche d'accompagnement : accueillir ce qui est ressenti, permettre l'expression, soutenir l'apaisement et aider à réparer ce qui a été abîmé dans la relation. Des situations concrètes portent notamment sur la colère, la peur, la tristesse et la joie. L'autrice examine également les conflits et les conditions dans lesquelles une intervention aide réellement. Le fil conducteur est qu'accompagner une émotion ne signifie ni la nier ni la laisser décider de tout : il s'agit de la comprendre et de retrouver une capacité d'action."},
"liv0125": {"unit":"Chapitres et sections","chapters":[{"title":"Les origines antiques","page":12,"summary":"Clément Rizet retrace les premières représentations de la vie psychique dans les textes et mythes de l’Antiquité. Il examine ensuite la contribution de Socrate, de Platon et d’Aristote, notamment les questions de l’âme, du désir, de la connaissance et des facultés humaines."},{"title":"L’ère médiévale","page":61,"summary":"Le chapitre passe de la psychologie augustinienne aux réflexions sur la personne et la connaissance de soi. Il présente aussi les apports des traditions philosophiques arabe et hébraïque, puis leur articulation avec la scolastique chrétienne."},{"title":"La Renaissance","page":77,"summary":"Rizet montre comment l’humanisme et les transformations culturelles renouvellent les interrogations sur l’individu. Les auteurs étudiés éclairent l’évolution des conceptions de la liberté, de la personnalité et du comportement."},{"title":"L’âge classique","page":88,"summary":"La période classique confronte raison, expérience et mécanismes du corps. Le chapitre replace l’étude de l’esprit dans les débats philosophiques qui précèdent l’autonomisation de la psychologie."},{"title":"Le siècle des Lumières","page":137,"summary":"L’auteur examine les réflexions sur la sensibilité, l’éducation et la connaissance au XVIIIe siècle. Il suit la montée des démarches d’observation et les discussions concernant les rapports entre nature, société et sujet."},{"title":"Le XIXe siècle","page":191,"summary":"Le développement des sciences expérimentales et de la médecine modifie les approches du psychisme. Rizet présente les étapes qui conduisent à la constitution de la psychologie comme discipline plus autonome."},{"title":"De l’inconscient aux sciences cognitives","page":300,"summary":"Le chapitre suit les débats autour de l’inconscient et les transformations des méthodes psychologiques au XXe siècle. Il situe les courants successifs dans leurs contextes théoriques, cliniques et scientifiques."},{"title":"XXIe siècle : neurosciences et psychologies","page":443,"summary":"La dernière partie décrit les liens entre neurosciences, cognition et différentes pratiques psychologiques contemporaines. Elle souligne la pluralité des objets et des méthodes plutôt qu’une théorie unique de l’esprit."}],"edition":{"pages":560},"summary":"Cette histoire de la psychologie suit les transformations des conceptions de l'esprit humain depuis l'Antiquité jusqu'aux courants modernes. Les premiers chapitres présentent les questions anciennes sur l'âme, la perception et la connaissance de soi, puis leurs reformulations au Moyen Âge. La Renaissance et l'âge classique modifient les rapports entre raison, expérience et étude du corps. Le siècle des Lumières renouvelle les réflexions sur la sensibilité, l'éducation et l'individu. Les étapes suivantes montrent comment la psychologie se constitue progressivement comme champ de recherche et comment des écoles différentes proposent leurs propres objets et méthodes. L'intérêt du livre est de replacer les théories dans leur contexte intellectuel plutôt que de raconter une progression simple et continue vers une seule vérité."},
"liv0126": {"unit":"Chapitres et sections","chapters":[{"title":"La Sirène","page":12,"summary":"Greene décrit un archétype fondé sur le pouvoir d’attraction de l’apparence et de l’imaginaire. Il prend des exemples historiques pour montrer comment une image séduisante capte l’attention."},{"title":"Le Libertin","page":18,"summary":"Le personnage mise sur l’intensité affichée du désir et l’impression d’exclusivité. L’analyse porte sur l’effet émotionnel d’une passion ostensible."},{"title":"L’Amant idéal","page":23,"summary":"Cet archétype cherche à incarner les attentes intimes de l’autre. L’auteur examine la façon dont l’écoute et la mise en scène d’un idéal produisent de l’attachement."},{"title":"Le Dandy","page":28,"summary":"Le dandy se distingue des codes attendus et cultive une singularité visible. Cette indépendance devient, dans la grille de Greene, un ressort d’attraction."},{"title":"L’Éternel enfant","page":35,"summary":"La spontanéité et le jeu constituent ici une figure de séduction. Greene relie la légèreté apparente à un désir de retrouver des émotions moins contraintes."},{"title":"La Coquette","page":40,"summary":"Le chapitre analyse l’alternance entre attention et distance. Il décrit comment l’incertitude entretenue peut renforcer l’attente, tout en reposant sur une dynamique potentiellement manipulatrice."},{"title":"Le Charmeur","page":45,"summary":"La séduction passe par l’art de mettre l’autre en valeur et d’éviter les confrontations directes. Le chapitre illustre le poids de la sociabilité et des attentions."},{"title":"La Figure charismatique","page":50,"summary":"Greene s’intéresse à l’assurance, au récit personnel et à l’effet de présence. Il explique comment ces traits peuvent créer une adhésion collective."},{"title":"La Star","page":58,"summary":"La star entretient une image partiellement inaccessible qui laisse place aux projections. Le mystère et la distance participent ici à la fascination."},{"title":"Choisir sa victime","page":67,"summary":"La seconde partie traite de la sélection d’une personne jugée réceptive. L’auteur présente une stratégie d’influence ; ce cadre instrumental doit être distingué d’une relation consentie et réciproque."},{"title":"Inspirer confiance","page":71,"summary":"Greene décrit la création d’un climat rassurant avant de rechercher une proximité. Il montre comment une attitude apparemment naturelle peut être planifiée."},{"title":"Souffler le chaud et le froid","page":76,"summary":"La stratégie repose sur une alternance d’attention et de retrait. Le texte décrit l’incertitude émotionnelle ainsi produite, qui peut constituer une forme de manipulation."},{"title":"Susciter la jalousie","page":81,"summary":"Le chapitre présente la concurrence et la valeur attribuée par autrui comme instruments d’attraction. Il s’agit d’un mécanisme social décrit par l’auteur, non d’une recommandation relationnelle saine."},{"title":"Créer des besoins sans les satisfaire","page":86,"summary":"Greene étudie la création d’un manque et son entretien. Cette tactique met le désir au service d’une asymétrie de pouvoir."},{"title":"Maîtriser l’art de l’insinuation","page":92,"summary":"L’auteur insiste sur les suggestions indirectes plutôt que sur des demandes explicites. Le chapitre examine comment un message ambigu peut être interprété comme une idée personnelle."},{"title":"Habiter l’esprit de l’autre","page":97,"summary":"La stratégie consiste à s’aligner sur les centres d’intérêt et les préoccupations de l’interlocuteur. Greene traite cet ajustement comme un moyen d’influence."},{"title":"Proposer la tentation","page":101,"summary":"Le chapitre décrit une offre conçue pour correspondre à un désir déjà présent. Il distingue l’attrait de la proposition de la décision effective de celui qui la reçoit."},{"title":"Entretenir le suspense","page":106,"summary":"L’attente et le rythme des événements deviennent des outils d’attention. Greene présente le suspense comme une manière de maintenir l’investissement émotionnel."},{"title":"Troubler par la magie du discours","page":110,"summary":"Le chapitre porte sur la forme du langage, l’imagination et la suggestion. L’auteur montre comment la parole peut embellir ou orienter une perception."},{"title":"Soigner les détails","page":116,"summary":"Des gestes précis, un cadre ou une attention personnalisée contribuent à créer une impression. Greene s’intéresse ici à la force des signes apparemment secondaires."},{"title":"S’auréoler de poésie","page":121,"summary":"La mise en récit et les images culturelles servent à donner une dimension idéalisée à une rencontre. Le chapitre insiste sur les effets de l’imaginaire."},{"title":"Être désarmant","page":125,"summary":"L’auteur présente la vulnérabilité affichée comme une manière d’abaisser les défenses. Il en souligne les effets possibles sur la perception de sincérité."},{"title":"Créer l’illusion","page":130,"summary":"Greene examine les mises en scène qui modifient la lecture d’une situation. Ce chapitre souligne la proximité entre charme, fiction et tromperie."},{"title":"Isoler la victime","page":135,"summary":"Le chapitre décrit l’éloignement des autres influences comme une tactique de contrôle. Cette dynamique peut présenter des risques réels pour l’autonomie d’une personne."},{"title":"Faire ses preuves","page":141,"summary":"L’auteur explique comment la démonstration d’efforts ou de sacrifices peut renforcer l’impression de dévouement. Le chapitre analyse la valeur symbolique des actes."},{"title":"Provoquer une régression","page":146,"summary":"Greene s’intéresse au retour d’émotions liées à l’enfance ou à une dépendance affective. Il le traite comme une forme d’influence psychologique."},{"title":"Offrir le fruit défendu","page":151,"summary":"L’interdit peut augmenter la valeur perçue d’une possibilité. Le chapitre analyse la tension entre normes sociales et désir de transgression."},{"title":"Convoquer le sublime","page":157,"summary":"Les images, les lieux et les émotions élevées peuvent transformer une expérience ordinaire. L’auteur en décrit les effets d’intensification."},{"title":"Mêler la douleur au plaisir","page":162,"summary":"Greene décrit des alternances émotionnelles destinées à renforcer l’attachement. Cette approche expose les risques d’une relation déséquilibrée."},{"title":"Devenir proie","page":168,"summary":"La tactique inverse momentanément les rôles en laissant l’autre prendre l’initiative. L’auteur l’analyse comme un changement de position dans le rapport de pouvoir."},{"title":"Réveiller la bête","page":175,"summary":"Le chapitre traite de l’intensification du désir et des pulsions. Il fait de cette mobilisation émotionnelle une étape du processus de séduction décrit."},{"title":"Savoir porter le coup final","page":181,"summary":"Greene décrit le moment décisif où une longue progression débouche sur une action directe. Le chapitre aborde le tempo et les risques d’une pression excessive."},{"title":"Survivre aux lendemains qui déchantent","page":187,"summary":"L’auteur s’intéresse à ce qui se produit après la phase d’intensité. Il évoque la difficulté de maintenir l’image et l’attention créées durant la séduction."}],"edition":{"pages":199},"summary":"Robert Greene présente la séduction comme un ensemble de dynamiques sociales et psychologiques, illustrées par des récits historiques. Il distingue d'abord plusieurs figures de séducteurs, dont la Sirène, le Libertin, l'Amant idéal, le Dandy et l'Éternel enfant, chacune reposant sur une forme particulière d'attraction. Il examine ensuite les attentes, les vulnérabilités et les situations dans lesquelles une personne devient sensible à une mise en scène. La suite décrit des stratégies de rapprochement, de création d'attente et d'influence. Le livre doit être lu avec un regard critique : ses exemples sont interprétés à travers la grille de l'auteur et certaines tactiques reposent sur la manipulation, l'ambiguïté ou l'exploitation des fragilités d'autrui. Il s'agit d'une analyse de stratégies d'influence, pas d'un modèle de relations respectueuses."},
"liv0127": {"unit":"Chapitres et sections","chapters":[{"title":"Le trésor qui est en vous","page":23,"summary":"Murphy présente le subconscient comme une réserve de possibilités et affirme que les convictions profondes orientent l’existence. Le chapitre invite à identifier des croyances habituelles, dans le cadre spirituel propre à l’auteur."},{"title":"Le mécanisme de votre esprit","page":39,"summary":"L’auteur distingue esprit conscient et subconscient, puis décrit les effets qu’il attribue à la suggestion et à la répétition. Ses formulations ne constituent pas une description scientifique consensuelle du cerveau."},{"title":"La puissance miraculeuse de votre subconscient","page":60,"summary":"Des récits et affirmations illustrent la capacité supposée du subconscient à produire des changements. Le lecteur est invité à accueillir ces exemples comme des thèses de l’auteur, non comme des preuves médicales."},{"title":"Les guérisons par l’esprit dans l’Antiquité","page":74,"summary":"Murphy retrace des traditions anciennes où les croyances et les rites étaient associés à la guérison. Il les utilise pour soutenir son interprétation spirituelle des pouvoirs de l’esprit."},{"title":"Les guérisons par l’esprit dans les temps modernes","page":89,"summary":"Le chapitre rassemble des exemples plus récents de guérisons attribuées à la foi ou aux suggestions mentales. Les anecdotes rapportées ne permettent pas de vérifier un effet thérapeutique spécifique."},{"title":"Les techniques de guérison mentale","page":102,"summary":"L’auteur propose des visualisations, des affirmations et des pratiques de concentration. Elles sont décrites comme exercices spirituels ; elles ne doivent pas se substituer à des soins médicaux."},{"title":"Le subconscient tend vers la vie","page":122,"summary":"Le texte présente le subconscient comme orienté vers la conservation et l’équilibre. Murphy recommande d’entretenir des représentations mentales positives."},{"title":"La voie vers la réussite","page":131,"summary":"Le chapitre associe objectifs précis, confiance et préparation intérieure. La réussite y est interprétée à travers l’influence supposée des pensées."},{"title":"Le subconscient, la voie vers la richesse","page":142,"summary":"Murphy soutient que certaines croyances limitantes empêchent la prospérité. Il propose de modifier le rapport psychologique à l’argent par la répétition de pensées favorables."},{"title":"Le droit à la richesse","page":152,"summary":"L’auteur conteste la culpabilité liée au désir de confort matériel. Il cherche à présenter l’abondance comme compatible avec une vie intérieure équilibrée."},{"title":"Le subconscient, l’auxiliaire du succès","page":164,"summary":"Le texte aborde l’imagination et la confiance dans les activités professionnelles. Les exemples visent à encourager une orientation mentale cohérente avec ses projets."},{"title":"Les savants recourent au subconscient","page":180,"summary":"Murphy raconte des découvertes et intuitions attribuées à un travail mental en dehors de l’attention consciente. Il en déduit un rôle créatif pour le subconscient."},{"title":"Le subconscient et les merveilles du sommeil","page":193,"summary":"Le sommeil est présenté comme favorable à la résolution de problèmes et à la maturation des idées. L’auteur suggère d’orienter ses pensées avant de s’endormir."},{"title":"Le subconscient et les problèmes conjugaux","page":205,"summary":"Le chapitre relie la qualité des relations aux représentations et attentes que l’on entretient. Murphy insiste sur les paroles et attitudes qui nourrissent la confiance."},{"title":"Le subconscient et le bonheur","page":220,"summary":"L’auteur défend l’idée que le bonheur se cultive dans les habitudes de pensée. Il propose de travailler les interprétations et réactions quotidiennes."},{"title":"Le subconscient et les relations harmonieuses","page":231,"summary":"Murphy encourage une disposition moins hostile envers les autres. Il relie les relations apaisées à une transformation des ressentiments."},{"title":"Le subconscient, un outil de pardon","page":248,"summary":"Le pardon est présenté comme une façon de ne plus alimenter une blessure intérieure. L’auteur recommande de renoncer à la rumination sans nier les faits subis."},{"title":"Le subconscient, un outil pour supprimer les blocages mentaux","page":265,"summary":"Les résistances, l’indécision et les habitudes sont reliées à des croyances récurrentes. Murphy propose la suggestion positive pour les remplacer."},{"title":"Le subconscient, un outil pour vaincre la peur","page":280,"summary":"Le chapitre examine les peurs anticipatoires et la manière de leur opposer des représentations rassurantes. Ses méthodes relèvent du développement personnel et ne remplacent pas un accompagnement professionnel."},{"title":"Le subconscient, un outil pour rester jeune d’esprit","page":297,"summary":"Murphy associe la vitalité intellectuelle à la curiosité et à la confiance dans la vie. Il invite à ne pas réduire les capacités personnelles à l’âge."}],"edition":{"pages":322},"summary":"Joseph Murphy soutient que les croyances profondes et les suggestions adressées au subconscient influencent la conduite de la vie. Il commence par distinguer esprit conscient et subconscient, puis développe le rôle qu'il attribue à la répétition, à l'imagination et à la conviction. Plusieurs chapitres présentent des récits de guérison et de transformation personnelle que l'auteur relie à la foi et à l'activité mentale. D'autres appliquent cette conception aux relations, à la réussite, à la peur et aux habitudes. Le livre appartient à la littérature de développement personnel spirituel : ses témoignages et explications sur les guérisons ne constituent pas des preuves médicales. On peut en retenir une réflexion sur l'influence des représentations personnelles sans considérer les effets extraordinaires annoncés comme scientifiquement démontrés."},
"liv0128": {"unit":"Chapitres et sections","chapters":[{"title":"La loi de l’irrationalité","page":24,"summary":"Greene montre comment les émotions et les biais perturbent les décisions. Il décrit des méthodes d’observation de soi pour limiter les emballements et gagner en recul."},{"title":"La loi du narcissisme","page":73,"summary":"Le chapitre distingue les besoins ordinaires de reconnaissance des formes d’égocentrisme qui étouffent l’attention à autrui. L’auteur présente l’empathie comme une compétence à développer."},{"title":"La loi de la persona","page":125,"summary":"Greene s’intéresse à l’image sociale que chacun compose et aux signes qui échappent à cette mise en scène. Il propose d’observer les comportements dans la durée plutôt que de croire uniquement aux déclarations."},{"title":"La loi du comportement compulsif","page":175,"summary":"Le chapitre examine les habitudes répétitives qui révèlent le caractère sous pression. Greene met en garde contre les jugements fondés sur une seule impression."},{"title":"La loi de la convoitise","page":224,"summary":"L’auteur décrit le désir de ce qui semble rare ou inaccessible. Il montre comment l’imagination peut rendre un objet plus attrayant que sa valeur réelle."},{"title":"La loi du manque de vision","page":256,"summary":"Greene critique les réactions de court terme qui font perdre de vue les conséquences. Il encourage à considérer la durée et les effets indirects d’une décision."},{"title":"La loi de la défensive","page":291,"summary":"Le chapitre analyse la résistance des personnes qui se sentent jugées ou menacées. L’auteur présente des procédés d’influence fondés sur la reconnaissance de leur perspective."},{"title":"La loi de l’auto-sabotage","page":341,"summary":"La manière d’interpréter le monde peut entretenir des comportements défaitistes. Greene examine le rôle des attitudes dans les interactions et les occasions saisies."},{"title":"La loi du refoulement","page":385,"summary":"L’auteur décrit des aspects de soi que l’on refuse de reconnaître et qui peuvent réapparaître indirectement. Il invite à observer ses contradictions au lieu de les attribuer systématiquement aux autres."},{"title":"La loi de l’envie","page":432,"summary":"Greene s’intéresse à la comparaison sociale et à l’hostilité parfois dissimulée qu’elle produit. Il détaille des signes possibles et rappelle la difficulté d’interpréter les intentions."},{"title":"La loi de la mégalomanie","page":479,"summary":"Le succès peut susciter une illusion d’infaillibilité et conduire à des décisions excessives. Le chapitre souligne l’importance des limites et des retours critiques."},{"title":"La loi de l’inflexibilité des sexes","page":524,"summary":"Greene explore les représentations du masculin et du féminin dans le psychisme. Ses interprétations s’inscrivent dans son cadre théorique et ne valent pas description universelle des identités."},{"title":"La loi du désœuvrement","page":579,"summary":"Le livre défend le rôle d’un but personnel dans la persévérance et l’organisation des choix. Greene relie le sentiment de direction à la capacité de traverser les difficultés."},{"title":"La loi de la conformité","page":632,"summary":"L’auteur examine les pressions du groupe, les dynamiques de pouvoir et les effets de l’appartenance. Il souligne la nécessité de conserver un jugement indépendant."},{"title":"La loi de l’inconstance","page":705,"summary":"Le chapitre interroge la légitimité et la construction de l’autorité. Greene distingue les apparences de leadership de la confiance durable qu’inspirent les actes."},{"title":"La loi de l’agressivité","page":762,"summary":"Greene étudie les manifestations indirectes de l’hostilité, notamment les comportements passifs-agressifs. Il propose de repérer les contradictions entre les paroles et les actes."},{"title":"La loi de la myopie générationnelle","page":836,"summary":"Chaque génération est façonnée par un contexte historique et culturel. Le chapitre propose de comprendre les attitudes collectives en regardant l’époque qui les a produites."},{"title":"La loi du déni de mort","page":906,"summary":"L’auteur examine les réactions humaines à la finitude et les manières de l’écarter de la conscience. Il présente la conscience de la mortalité comme une invitation à mieux hiérarchiser sa vie."}],"edition":{"pages":954},"summary":"Robert Greene examine dix-huit tendances qu'il présente comme des lois du comportement humain. Il commence par l'irrationalité et les biais émotionnels, puis aborde le narcissisme, l'image sociale et les habitudes qui révèlent le caractère. D'autres chapitres s'intéressent au désir, à l'envie, à l'agressivité, aux rapports de pouvoir et aux dynamiques de groupe. Chaque thème associe des récits, des interprétations psychologiques et des conseils d'observation de soi et d'autrui. Le livre invite à prendre du recul sur les apparences et à mieux repérer les motivations qui traversent les relations. Ses « lois » sont toutefois des catégories proposées par l'auteur, non des lois scientifiques universelles ; les exemples historiques et les généralisations demandent donc une lecture critique."},
"liv0129": {"unit":"Chapitres et sections","chapters":[{"title":"Tu es une âme en évolution","page":5,"summary":"Lise Bourbeau expose sa conception spirituelle d’une existence conçue comme apprentissage. Elle invite à examiner la responsabilité personnelle et l’acceptation de soi ; ses références au karma relèvent de ses croyances."},{"title":"Tu es ce que tu vois","page":16,"summary":"Le chapitre utilise la métaphore du miroir : ce qui attire ou irrite chez autrui pourrait servir d’indice pour réfléchir à soi. Cette lecture symbolique n’établit pas une causalité objective entre les personnes."},{"title":"Tu es ce que tu entends","page":25,"summary":"L’autrice examine les réactions aux paroles, aux critiques et à l’autorité. Elle encourage à écouter ce que ces réactions révèlent des besoins ou jugements personnels."},{"title":"Tu es ce que tu dis","page":33,"summary":"Les formulations habituelles et les réactions verbales sont présentées comme des signes de croyances internes. Bourbeau invite à observer son langage pour mieux identifier ses positions."},{"title":"Tu es ce que tu penses","page":46,"summary":"L’autrice insiste sur les pensées récurrentes et leur influence présumée sur la perception et les comportements. Elle propose de remplacer l’autocritique par une attention plus consciente."},{"title":"Tu es ce que tu ressens","page":57,"summary":"Le chapitre invite à reconnaître les émotions plutôt qu’à les refouler. Il décrit les ressentis comme des informations sur les besoins et les situations vécues."},{"title":"Tu es ce que tu manges","page":61,"summary":"Bourbeau interprète les préférences et les habitudes alimentaires comme des indices symboliques du rapport à soi. Ces liens relèvent de son cadre de développement personnel."},{"title":"Tu es ce que tu portes","page":69,"summary":"Les choix vestimentaires deviennent un support pour interroger la liberté personnelle et l’influence du regard des autres. L’autrice propose d’observer ses habitudes sans les considérer comme de simples contraintes extérieures."},{"title":"Tu es ta demeure","page":76,"summary":"Le chapitre associe les espaces de vie aux habitudes, aux besoins et à la façon d’organiser son quotidien. Il s’agit d’une grille symbolique de réflexion, pas d’un diagnostic de personnalité."},{"title":"Tu es la forme de ton corps","page":83,"summary":"L’autrice développe des interprétations de la morphologie et de la posture. Ces associations ne constituent pas des indicateurs médicaux ou psychologiques validés."},{"title":"Tu es tes malaises et maladies","page":112,"summary":"Bourbeau attribue diverses affections à des conflits émotionnels ou spirituels. Ces affirmations ne sont pas médicalement établies et ne doivent jamais servir à expliquer une maladie ni retarder une consultation."},{"title":"Conclusion et cheminement personnel","page":205,"summary":"La fin de l’ouvrage invite à faire le bilan de ses observations et à poursuivre une réflexion sur ses croyances. L’accent porte sur la liberté de choisir sa réponse aux événements."}],"edition":{"pages":218},"summary":"Lise Bourbeau développe une approche spirituelle de la connaissance de soi. Le livre propose d'examiner les expériences quotidiennes comme autant de miroirs de l'état intérieur : ce que l'on voit chez les autres, ce que l'on entend, ce que l'on dit et ce que l'on pense deviennent des occasions d'interroger ses réactions et ses croyances. Les chapitres abordent progressivement les dimensions émotionnelles, relationnelles et personnelles de cette démarche. L'autrice invite à reconnaître sa responsabilité dans ses choix et à rechercher davantage de cohérence avec soi-même. Ses interprétations de l'âme, des expériences et de leurs significations relèvent d'une conception spirituelle particulière ; elles ne doivent pas être présentées comme des résultats scientifiques établis."},
"liv0130": {"unit":"Chapitres et sections","chapters":[{"title":"La stratégie de la polarité","page":25,"summary":"Greene recommande d’identifier clairement les oppositions pour concentrer ses efforts. Il transpose des conflits historiques à la définition d’une stratégie personnelle."},{"title":"La stratégie de la guérilla psychologique","page":37,"summary":"La deuxième loi invite à se défaire des méthodes devenues inadaptées. L’auteur valorise la souplesse tactique et la capacité de surprendre."},{"title":"La stratégie de l’équilibre","page":49,"summary":"Garder son sang-froid permet de décider malgré la pression. Greene souligne les dangers d’une réaction émotionnelle précipitée."},{"title":"La stratégie du dernier carré","page":63,"summary":"L’auteur examine comment un sentiment d’urgence peut mobiliser l’énergie d’un groupe. Il en illustre les effets dans des circonstances extrêmes."},{"title":"La stratégie du commandement contrôlé","page":77,"summary":"Le chapitre porte sur la coordination et la répartition des responsabilités dans un collectif. Greene distingue l’unité de direction du contrôle de chaque détail."},{"title":"La stratégie du chaos contrôlé","page":91,"summary":"L’auteur décrit la nécessité d’adapter ses forces aux circonstances plutôt que de figer l’organisation. La rapidité des décisions devient un avantage."},{"title":"La stratégie du moral","page":101,"summary":"Une cause partagée peut soutenir la cohésion et la motivation. Greene analyse la place des convictions dans l’action collective."},{"title":"La stratégie de l’économie","page":121,"summary":"Il faut sélectionner les conflits qui valent l’énergie engagée. L’auteur recommande de comparer le coût d’une confrontation à son utilité réelle."},{"title":"La stratégie de la contre-attaque","page":135,"summary":"Greene décrit la défense active qui utilise l’engagement de l’adversaire pour retourner la situation. Le moment choisi compte autant que la force mobilisée."},{"title":"La stratégie de la dissuasion","page":149,"summary":"Une posture crédible peut éviter certains affrontements. Le chapitre examine la réputation et la capacité perçue à répondre."},{"title":"La stratégie du repli","page":165,"summary":"L’auteur souligne que céder du terrain n’est pas nécessairement perdre. Le recul peut préserver ses ressources et préparer une autre manœuvre."},{"title":"La grande stratégie","page":179,"summary":"Greene distingue les succès locaux de l’objectif à long terme. Il invite à construire des plans cohérents plutôt qu’à enchaîner des victoires isolées."},{"title":"La stratégie du renseignement","page":193,"summary":"Connaître les motivations et contraintes d’un adversaire éclaire ses décisions. Le chapitre présente l’observation comme préalable à toute manœuvre."},{"title":"La stratégie de la blitzkrieg","page":207,"summary":"Le mouvement rapide et la surprise peuvent empêcher une réaction organisée. Greene l’illustre par des exemples militaires."},{"title":"La stratégie de la manipulation","page":215,"summary":"Le chapitre étudie le contrôle du rythme des événements et des choix offerts. Il décrit des tactiques d’influence qu’il faut lire avec recul critique."},{"title":"La stratégie du centre de gravité","page":231,"summary":"Greene recommande de chercher l’élément décisif dont dépend la force opposée. La concentration des efforts évite de se disperser sur des points secondaires."},{"title":"La stratégie de la conquête par la division","page":241,"summary":"L’auteur montre comment des forces unies peuvent être affaiblies par leur séparation. Il analyse la fragmentation comme tactique de conflit."},{"title":"La stratégie du pivotement","page":257,"summary":"La confrontation frontale peut renforcer les défenses adverses. Greene propose de déplacer l’effort vers des zones moins protégées."},{"title":"La stratégie de l’annihilation","page":271,"summary":"Le chapitre décrit un encerclement visant à supprimer les possibilités de riposte. Cette logique militaire radicale ne doit pas être confondue avec une conduite éthique des relations."},{"title":"La stratégie de la manœuvre","page":281,"summary":"Greene souligne l’intérêt de créer une position défavorable à l’adversaire avant une confrontation. Le terrain et la configuration comptent davantage que la seule puissance."},{"title":"La stratégie de la guerre diplomatique","page":299,"summary":"L’auteur décrit la négociation accompagnée de mesures concrètes. Il s’intéresse au rapport entre parole, position et concessions."},{"title":"La stratégie de sortie","page":311,"summary":"Le chapitre insiste sur la nécessité de prévoir une conclusion. Une victoire mal terminée peut compromettre l’ensemble des efforts."},{"title":"La stratégie de la perception","page":325,"summary":"Greene analyse la façon dont récits et apparences influencent la compréhension d’un conflit. Il présente la mise en scène comme instrument tactique."},{"title":"La stratégie de l’imprévisibilité","page":337,"summary":"Le chapitre s’intéresse aux effets de l’incertitude sur les calculs adverses. Il montre comment la variabilité d’action peut modifier un rapport de forces."},{"title":"La stratégie de la vertu","page":351,"summary":"L’auteur explique que la dimension morale d’un conflit peut influencer le soutien des tiers. Il examine la différence entre légitimité revendiquée et motivations réelles."},{"title":"La stratégie de l’ombre","page":365,"summary":"Greene décrit des objectifs dissimulés derrière une action visible. La prudence critique s’impose face à ces tactiques de tromperie."},{"title":"La stratégie de l’alliance","page":383,"summary":"Le chapitre montre comment les alliances modifient l’équilibre des ressources. Il insiste sur les partenaires, leurs intérêts et la fragilité des coalitions."},{"title":"La stratégie de la domination","page":397,"summary":"L’auteur décrit des tactiques destinées à laisser l’adversaire s’exposer lui-même. Il examine les rivalités cachées au sein d’un même camp."},{"title":"La stratégie des petits pas","page":413,"summary":"La progression graduelle peut réduire les résistances et rendre possible une évolution importante. Greene souligne l’importance du rythme."},{"title":"La stratégie de la communication","page":423,"summary":"Le chapitre analyse la manière dont un message façonne la perception d’un groupe. Il s’intéresse à la persuasion et à l’orientation des attentes."},{"title":"La stratégie de la cinquième colonne","page":437,"summary":"L’auteur examine la déstabilisation intérieure d’une organisation par des alliés apparents. Cette analyse des conflits peut aussi servir à reconnaître les comportements de sabotage."},{"title":"La stratégie de la résistance passive","page":449,"summary":"Le texte présente le refus indirect et la docilité de façade comme tactiques de pouvoir. Il montre les risques d’une relation marquée par la dissimulation."},{"title":"La stratégie de la réaction en chaîne","page":465,"summary":"La dernière loi décrit la terreur comme instrument de paralysie. C’est une analyse d’une méthode de violence, non une recommandation ; le texte doit être lu avec distance éthique."}],"edition":{"pages":491},"summary":"Dans cet ouvrage, Robert Greene transpose des épisodes de guerre et des stratégies militaires aux conflits de la vie professionnelle et sociale. Les premières lois portent sur la définition de ses adversités, la souplesse tactique, le sang-froid, l'urgence et la conduite d'un groupe. Les chapitres suivants examinent notamment l'initiative, l'information, le rapport de forces, la préparation, la défense et les moyens d'éviter un affrontement inutile. Chaque stratégie est illustrée par des situations historiques que l'auteur interprète comme des leçons de décision et d'influence. Le livre se lit comme un répertoire de scénarios stratégiques, pas comme un ensemble de règles à appliquer mécaniquement : les analogies entre guerre et relations ordinaires ont leurs limites, et certaines tactiques soulèvent des questions éthiques."},
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
        ${page && (book.pdfPath||book.privatePdf) ? `<a href="${esc(siteHref('lire.html?id=' + encodeURIComponent(book.id) + '&pdfpage=' + page + '#reader-content'))}">Lire à cette page ↗</a>` : ''}</div>
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
return '<div class="book-dossier album-book"><header class="album-opening"><div class="album-heading"><p class="album-rayon"><a href="'+siteHref(b.genre==='a-classer'?'mes-livres.html?genre=a-classer':'livres-'+b.genre+'-'+b.sub+'.html')+'">'+esc(GENRES[b.genre]?.[1][b.sub])+' ↗</a></p><h1>'+esc(b.title)+'</h1><p class="album-author">'+esc(b.author)+'</p></div><figure class="album-montage"><img class="album-landscape" src="'+esc(assetHref('images/atelier/'+art[0]))+'" alt=""><img class="album-endpaper" src="'+esc(assetHref('images/collage/papier-fleuri.jpg'))+'" alt=""><div class="album-cover-polaroid">'+smallCover({...b,cover:b.cover||meta.cover})+'<img class="album-cover-flower" src="'+esc(assetHref('images/carnet-illustre/sticker-fleur.svg'))+'" alt=""></div></figure>'+bookFileActions(b,meta)+'</header>'+
bookPassport(b,meta,guide)+bookGuideMarkup(b,guide)+
(meta.reviewLinks?.length?'<section class="book-guides"><h2>Critiques et avis externes</h2><ul>'+meta.reviewLinks.filter(url=>typeof url==='string'&&/^https:\/\//.test(url)).map((url,i)=>'<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Consulter la source externe '+(i+1)+'</a></li>').join('')+'</ul></section>':'')+
catalogueControls(b)+(adminEnabled?'<p><a class="btn secondary" href="'+esc(siteHref('ajouter-livre.html?id='+encodeURIComponent(b.id)))+'">Modifier cette fiche</a></p>':'')+
(tags.length?'<section class="album-threads"><h2>Les fils du livre</h2><div>'+tags.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div><img src="'+esc(assetHref('images/objets/annotation.svg'))+'" alt=""></section>':'')+
'<div class="book-reception-pair">'+externalReception(meta)+localReception(b)+'</div><details class="book-sources"><summary>Les sources et références ↘</summary><ul>'+sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.label)+' ↗</a></li>').join('')+(meta.pdfPath?'<li><a data-pdf-link="'+esc(meta.pdfPath)+'" href="'+esc(meta.pdfPath)+'" target="_blank" rel="noopener">PDF fourni · contenu et mentions éditoriales ↗</a></li>':'')+(meta.external?.url?'<li><a href="'+esc(meta.external.url)+'" target="_blank" rel="noopener">Source de la note extérieure ↗</a> · '+esc(meta.external.scope)+'</li>':'')+'</ul></details><nav class="book-dossier-bottom" aria-label="Garder une trace"><a href="'+siteHref('fiches.html?livre='+encodeURIComponent(b.id))+'">'+smallCover(b)+'Ma fiche de lecture ↗</a><a href="'+siteHref('journaux.html?livre='+encodeURIComponent(b.id))+'"><img src="'+esc(assetHref('images/objets/journal.svg'))+'" alt="">Mon journal ↗</a>'+'<a class="book-review-link" href="'+bookLink(b,'avis')+'"><img src="'+esc(assetHref('images/objets/avis.svg'))+'" alt="">Ma critique sur ce livre ↗</a>'+(adminEnabled?'<a href="'+bookLink(b,'ajouter-livre')+'">Modifier la fiche du catalogue ↗</a>':'')+'</nav></div>';
}
function legend(){return {...LEGEND_DEFAULT,...state.legend};}
function ensureBookSheet(b){let sheet=state.notes.find(n=>n.book===b.id&&n.kind==='fiches'&&n.auto);if(!sheet){sheet={id:uid(),book:b.id,kind:'fiches',title:b.title,body:'',page:'',auto:true,updated:new Date().toISOString()};state.notes.push(sheet);}return sheet;}
function currentParams(){return new URLSearchParams(typeof previewAsset==='function'?location.hash.slice(1):location.search);}
function jumpToHighlight(b,h){return siteHref('lire.html?id='+encodeURIComponent(b.id)+'&pdfpage='+Number(h.pageNumber||1)+'&highlight='+encodeURIComponent(h.id));}
function traceMarkup(h){const b=state.books.find(x=>x.id===h.book);if(!b)return '';return '<article class="saved-fragment" style="--fragment-color:'+esc(h.color)+'"><header>'+smallCover(b)+'<div><a href="'+bookLink(b)+'">'+esc(b.title)+'</a><p>'+esc(h.page|| (h.pageNumber?'Page '+h.pageNumber:''))+' · '+esc(legend()[h.color]||'Passage choisi')+'</p></div></header><blockquote>'+esc(h.quote)+'</blockquote>'+(h.annotation?'<p class="fragment-note">'+esc(h.annotation)+'</p>':'')+'<div class="trace-actions"><a href="'+jumpToHighlight(b,h)+'">Revenir au passage ↗</a><button type="button" data-remove-highlight="'+esc(h.id)+'" class="text-button">Retirer</button></div></article>';}
function renderHighlights(){
 const el=$('highlights');if(!el)return;
 const value=id=>{const input=$(id);return input&&!input.disabled?input.value:'';};
 const terms=searchTerms(value('highlight-search')),color=value('highlight-color'),book=value('highlight-book'),author=value('highlight-author'),page=value('highlight-page');
 const byId=new Map(state.books.map(item=>[item.id,item]));
 const items=state.highlights.filter(mark=>{
  const record=byId.get(mark.book);
  return record&&(el.dataset.mode!=='annotations'||mark.annotation)&&(!book||mark.book===book)&&(!color||mark.color===color)
   &&(!author||record.author===author)&&(!page||Number(mark.pageNumber||1)===Number(page))
   &&terms.every(term=>searchTerms(record.title+' '+(record.author||'')).join(' ').includes(term));
 });
 const order=value('highlight-order');
 const key=mark=>order==='color'?(legend()[mark.color]||''):order==='author'?(byId.get(mark.book)?.author||''):(byId.get(mark.book)?.title||'');
 const pageOf=mark=>Number(mark.pageNumber||1);
 items.sort((a,b)=>order==='page'?pageOf(a)-pageOf(b):key(a).localeCompare(key(b),'fr')||pageOf(a)-pageOf(b));
 el.innerHTML=items.map(traceMarkup).join('')||'<p class="empty">Aucun passage pour ces filtres.</p>';if($('highlight-count'))$('highlight-count').textContent=items.length+' passage'+(items.length>1?'s':'');el.querySelectorAll('[data-remove-highlight]').forEach(btn=>btn.onclick=async()=>{state.highlights=state.highlights.filter(h=>h.id!==btn.dataset.removeHighlight);await save();renderHighlights();});}
function renderNotes(){const el=$('notes');if(!el)return;const term=searchTerms($('notes-search')?.value||'');let notes=state.notes.filter(n=>n.kind===el.dataset.kind&&term.every(t=>searchTerms((state.books.find(b=>b.id===n.book)?.title||'')+' '+n.title).join(' ').includes(t)));el.innerHTML=notes.map(n=>{const b=state.books.find(b=>b.id===n.book);if(!b)return '';const traces=n.auto?state.highlights.filter(h=>h.book===b.id):[];return '<article class="reading-sheet"><header>'+smallCover(b)+'<div><p class="artist-kicker">'+(n.auto?'Fiche du livre':'Page du carnet')+'</p><h2>'+esc(n.title)+'</h2><a href="'+bookLink(b)+'">'+esc(b.title)+' ↗</a><p>'+esc(n.page?'Page / chapitre '+n.page:'')+'</p></div><img class="sheet-sticker" src="'+esc(assetHref('images/objets/fiches.svg'))+'" alt=""></header>'+(n.passage?'<blockquote class="sheet-quotation"><strong>Passage marquant</strong><p>'+esc(n.passage)+'</p></blockquote>':'')+(n.body?'<p class="pre-wrap">'+esc(n.body)+'</p>':'')+(traces.length?'<details><summary>'+traces.length+' passage'+(traces.length>1?'s':'')+' de ce livre ↘</summary>'+traces.map(traceMarkup).join('')+'</details>':'')+'<div class="trace-actions"><button type="button" data-edit-note="'+esc(n.id)+'">Continuer ma fiche</button>'+(n.auto?'':'<button type="button" class="text-button" data-delete-note="'+esc(n.id)+'">Retirer</button>')+'</div></article>';}).join('')||'<p class="empty">Les fiches créées pendant ta lecture se rangeront ici, avec la couverture du livre.</p>';el.querySelectorAll('[data-edit-note]').forEach(btn=>btn.onclick=()=>{const n=state.notes.find(n=>n.id===btn.dataset.editNote);chooseBook(n.book,n);$('note-body').focus();});el.querySelectorAll('[data-delete-note]').forEach(btn=>btn.onclick=async()=>{state.notes=state.notes.filter(n=>n.id!==btn.dataset.deleteNote);await save();renderNotes();});el.querySelectorAll('[data-remove-highlight]').forEach(btn=>btn.onclick=async()=>{state.highlights=state.highlights.filter(h=>h.id!==btn.dataset.removeHighlight);await save();renderNotes();});}
function selects(){if(!$('book-select'))return;if($('book-title-search')){$('book-title-search').oninput=()=>{const terms=searchTerms($('book-title-search').value);$('book-select').value='';const found=terms.length?state.books.filter(b=>terms.every(t=>searchTerms(b.title+' '+b.author).join(' ').includes(t))):[];$('book-search-results').innerHTML=found.slice(0,8).map(b=>'<button type="button" data-choose-book="'+esc(b.id)+'">'+smallCover(b)+'<span>'+esc(b.title)+'<small>'+esc(b.author)+'</small></span></button>').join('')||(terms.length?'<p>Aucun livre trouvé.</p>':'');$('book-search-results').querySelectorAll('[data-choose-book]').forEach(btn=>btn.onclick=()=>chooseBook(btn.dataset.chooseBook));};const requested=currentParams().get('livre');if(requested)chooseBook(requested);}else{$('book-select').innerHTML=state.books.map(b=>'<option value="'+esc(b.id)+'">'+esc(b.title)+'</option>').join('');}}
function premiumPreview(title,plans){
 return '<details class="premium-preview"><summary>'+esc(title)+'</summary><p>Disponible avec '+esc(plans)+'.</p><a class="btn secondary" href="'+siteHref('le-cercle.html#comparatif')+'">Comparer les formules ↗</a></details>';
}
function bindTraceFilters(){
 const order=$('highlight-order');
 if(!order)return;
 const filters=[['highlight-search',1],['highlight-book',1],['highlight-author',2],['highlight-color',2],['highlight-page',3]];
 const enabled=[];
 for(const [id,level] of filters){
  const field=$(id);if(!field)continue;
  if(readerLevel<level){field.disabled=true;field.parentElement.insertAdjacentHTML('beforeend',premiumPreview('🔒 '+field.labels[0].textContent,level===1?'Découverte, Passion et Illimité':level===2?'Passion et Illimité':'Illimité'));continue;}
  enabled.push(field);
  field.addEventListener('input',()=>{
   const limit=readerLevel===1?1:readerLevel===2?2:Infinity;
   const active=enabled.filter(other=>other!==field&&other.value);
   if(field.value&&active.length>=limit){
    active[0].value='';
    const status=$('highlight-filter-status');
    if(status)status.textContent='Le filtre précédent a été retiré · maximum '+limit+' filtre'+(limit===1?'':'s')+' avec ta formule.';
   }
   renderHighlights();
  });
 }
 const fill=(id,options)=>{const select=$(id);if(select)select.append(...options.map(([value,label])=>new Option(label,value)));};
 fill('highlight-book',state.books.filter(b=>state.highlights.some(h=>h.book===b.id)).map(b=>[b.id,b.title]));
 fill('highlight-author',[...new Set(state.books.filter(b=>state.highlights.some(h=>h.book===b.id)).map(b=>b.author).filter(Boolean))].sort().map(author=>[author,author]));
 fill('highlight-color',Object.entries(legend()));
 for(const option of order.options)option.disabled=readerLevel<({book:1,author:2,color:2,page:3}[option.value]||1);
 order.disabled=readerLevel<1;
 order.onchange=renderHighlights;
 const feedback=document.createElement('p');feedback.id='highlight-filter-status';feedback.setAttribute('role','status');order.parentElement.append(feedback);
}

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
    const catalogue = {
      ...state,
      books:state.books.map(({position,pdfPage,...book})=>book),
      notes:[],highlights:[],questions:[],reviews:{},profile:{},design:{},legend:{}
    };
    records.put(catalogue, 'state');
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
 const userId=ellUser?.id;
 if(!userId)return Promise.reject(Error('Connecte-toi pour enregistrer ton carnet personnel.'));
 if(!carnetLoaded)return Promise.reject(Error('Recharge la page pour récupérer ton carnet avant d’enregistrer.'));
 const snapshot=structuredClone(personalCarnet());
 pendingWrites++;
 autosaveQueue=autosaveQueue.catch(()=>{}).then(async()=>{
  if(ellFirebaseAuth?.currentUser?.uid!==userId)throw Error('Compte modifié : sauvegarde annulée.');
  await ellPrivate('write',snapshot);
  showCarnetWarning('');
 }).finally(()=>pendingWrites--);
 return autosaveQueue;
}
async function save(){
 if(!ellUser)throw Error('Connecte-toi pour enregistrer des annotations, fiches et surlignages privés.');
 try{await syncCarnet();}catch(e){showCarnetWarning(e.message);throw e;}
 message('Enregistré dans ton compte.');
}
async function connectService(){
 if(location.protocol==='file:')return null;
 try{
  const {auth,requestService}=await import('./request-service.js');
  ellFirebaseAuth=auth;
  await auth.authStateReady();
  const account=auth.currentUser;
  ellUser=account?{id:account.uid,email:account.email}:null;
  editorialAdmin=account?.emailVerified===true&&['quentinmorel1912@gmail.com','juliepotier2006@gmail.com'].includes(account.email?.toLowerCase());
  catalogueManager=account?.emailVerified===true&&account.email?.toLowerCase()==='quentinmorel1912@gmail.com';
  service={user:ellUser?.id||null,admin:false};
  if(account&&($('reader-content')||$('highlights')||$('book-detail'))){try{readerLevel=(await requestService('status',{},account)).subscription.access_level||0;}catch(error){console.warn(error);}}
  return service;
 }catch(error){console.error('Connexion indisponible',error);return null;}
}
let remoteCarnet=null,carnetLoaded=false;
function restoreCarnet(data) {
  // Never replace the public catalogue or copy a different account's data.
  const safe=data&&typeof data==='object'?data:{};
  for(const field of ['notes','highlights','questions'])state[field]=Array.isArray(safe[field])?safe[field]:[];
  for(const field of ['reviews','profile','design','legend'])state[field]=safe[field]&&typeof safe[field]==='object'&&!Array.isArray(safe[field])?safe[field]:{};
  for(const book of state.books){
    const position=safe.positions?.[book.id];
    book.position=typeof position?.position==='string'?position.position:'';
    book.pdfPage=Number.isFinite(Number(position?.pdfPage))&&Number(position.pdfPage)>0?Number(position.pdfPage):1;
  }
}

async function loadServiceState(){
 // Clear local data before loading: no notes/highlights from a prior session can flash on screen.
 ellClear();
 if(ellUser){
  const userId=ellUser.id;
  if(ellFirebaseAuth?.currentUser?.uid!==userId)throw Error('Le compte a changé pendant le chargement.');
  const {data}=await ellPrivate('read');
  if(ellUser?.id!==userId)throw Error('Le compte a changé pendant le chargement.');
  remoteCarnet=data??null;
  carnetLoaded=true;
  localStorage.setItem('ell_account',userId);
 }else{
  localStorage.removeItem('ell_account');
 }
 await ellConnect();
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
 if($('editorial-publish-link'))$('editorial-publish-link').hidden=!editorialAdmin;
 document.querySelectorAll('a[href*="ajouter-livre.html"],[data-admin-only]').forEach(x=>x.hidden=!adminEnabled);
 if($('book-form')){$('book-form').hidden=!adminEnabled;if($('book-access'))$('book-access').hidden=adminEnabled;}
 if($('admin-access'))$('admin-access').innerHTML=adminEnabled?'<a class="btn" href="admin-catalogue.html">Gérer le catalogue</a>':'<p>Réservé au compte administrateur. <a href="mon-espace.html">Se connecter</a></p>';
}
function showAccount(){
 const box=$('account-status');
 if(!box)return;
 if(!ellUser){box.innerHTML='<a class="btn" href="connexion-firebase.html">Se connecter ou créer un compte</a>';return;}
 box.innerHTML='<p>Connecté avec <strong>'+esc(ellUser.email)+'</strong>.</p><button type="button" id="ell-out">Se déconnecter</button>';
 $('ell-out').onclick=async()=>{
   await autosaveQueue.catch(()=>{});
   await ellFirebaseAuth.signOut();
   localStorage.removeItem('ell_account');
   location.replace('connexion-firebase.html');
 };
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
 let sheet = ensureBookSheet(book);
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
   <label class="reader-zoom">Zoom <select id="pdf-zoom"><option value="0.5">50 %</option><option value="0.65">65 %</option><option value="0.75">75 %</option><option value="0.9">90 %</option><option value="1" selected>100 % · largeur</option><option value="1.1">110 %</option><option value="1.25">125 %</option><option value="1.5">150 %</option><option value="1.75">175 %</option><option value="2">200 %</option><option value="2.5">250 %</option><option value="3">300 %</option></select></label><button id="reader-expand" type="button" aria-pressed="false">⛶ Plein écran</button>
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
     <div class="reader-pencils" role="group" aria-label="Couleur du surligneur">${Object.entries(legend()).slice(0,readerLevel===0?6:readerLevel===1?8:readerLevel===2?10:Infinity).map(([color,label])=>`<button type="button" class="pencil" style="--pencil:${color}" data-pencil="${color}" title="${esc(label)}" aria-label="${esc(label)}" aria-pressed="${color===currentColor}"></button>`).join('')}</div>
     <span id="pencil-label">${esc(legend()[currentColor])}</span>${readerLevel?`<label>Nouvelle couleur ${readerLevel===3?'<input id="new-pencil" type="color" value="#ec849e">':'<select id="new-pencil"><option value="#ec849e">Rose framboise</option><option value="#8dc4ae">Vert menthe</option><option value="#a689c6">Violet</option><option value="#70b9d1">Bleu lagon</option><option value="#e2a56f">Abricot</option><option value="#d5ba69">Moutarde</option></select>'}</label><button type="button" id="add-pencil">Ajouter</button>`:premiumPreview('🔒 Ajouter des couleurs','Découverte, Passion et Illimité')}
    </div>
    <div class="reader-actions"><button type="button" id="save-selection" disabled>Surligner la sélection</button></div>
   </div>
  </div>
  <p class="reader-help" id="reader-help-extra"></p>
  <div class="pdf-scroll" id="pdf-scroll"><div class="pdf-paper" id="pdf-paper"><canvas id="pdf-canvas"></canvas><div class="pdf-ink" id="pdf-ink" aria-hidden="true"></div><div class="textLayer" id="pdf-text-layer"></div></div></div>
  <div class="reader-exports">${readerLevel>=2?'<button class="btn secondary" type="button" data-annotated-export="pdf">Exporter le PDF annoté</button> <button class="btn secondary" type="button" data-annotated-export="docx">Exporter en Word</button>':premiumPreview('🔒 Exporter le livre avec tes surlignages','Passion et Illimité')}</div>
  <div id="page-traces" class="page-traces"></div>
  <div class="reader-bottom">
   <section class="reader-sheet" id="reader-sheet"><div class="reader-note-heading"><img src="${esc(assetHref('images/objets/fiches.svg'))}" alt=""><h2>Ma fiche de lecture</h2></div>
    <div class="sheet-fields"><div><label for="reader-sheet-title">Titre de la fiche</label><input id="reader-sheet-title" value="${esc(sheet.title||'')}" maxlength="160"></div><div><label for="reader-sheet-page">Page</label><input id="reader-sheet-page" value="${esc(sheet.page||'')}" maxlength="100" placeholder="Ex. 12"></div></div>
    <label for="reader-sheet-passage">Passage marquant</label><textarea id="reader-sheet-passage" maxlength="10000" placeholder="Recopie le passage ou ajoute-le depuis un surlignage.">${esc(sheet.passage||'')}</textarea>
    <label for="reader-sheet-text">Mes notes</label><textarea id="reader-sheet-text" placeholder="Pourquoi ce passage compte pour moi…">${esc(sheet.body||'')}</textarea><button class="btn" id="save-reader-sheet" type="button">Enregistrer la fiche</button> <a href="${esc(siteHref('fiches.html?livre='+encodeURIComponent(book.id)))}">Retrouver mes fiches de lecture ↗</a></section>
   <section class="reader-comment"><div class="reader-note-heading"><img src="${esc(assetHref('images/objets/annotation.svg'))}" alt=""><h2>Mon passage choisi</h2></div><p class="reader-passage-book">${esc(book.title)}</p><p id="chosen-excerpt">Choisis un surlignage pour ajouter une note.</p><label for="reader-annotation">Mon annotation</label><textarea id="reader-annotation" disabled placeholder="Pourquoi ce passage compte pour moi…"></textarea><div class="reader-excerpt-actions"><button class="btn" id="save-reader-passage" type="button" disabled>Enregistrer le passage</button><button id="copy-to-sheet" type="button" hidden>Ajouter à ma fiche</button><button id="remove-current-highlight" class="text-button" type="button" hidden>Enlever le surlignage</button></div>
    <details id="reader-legends"><summary>Légendes des couleurs ↘</summary>${readerLevel?'':premiumPreview('🔒 Modifier les légendes','Découverte, Passion et Illimité')}${Object.entries(legend()).map(([color,label],i)=>`<label class="legend-edit" style="--pencil:${color}" for="legend-${i}"><span class="legend-dot"></span><input id="legend-${i}" data-legend-color="${color}" ${readerLevel?'':'disabled'} value="${esc(label)}" maxlength="60" aria-label="Légende de couleur ${i+1}"></label>`).join('')}</details>
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
 const pencils = Array.from(host.querySelectorAll('[data-pencil]'));
 host.querySelectorAll('[data-annotated-export]').forEach(button=>button.onclick=async()=>{
  if(!pdf){status('Ouvre un PDF avant de lancer un export.',true);return;}
  const buttons=Array.from(host.querySelectorAll('[data-annotated-export]'));buttons.forEach(item=>item.disabled=true);
  try{
   const {exportAnnotated}=await import('./annotated-export.js');
   const marks=structuredClone(state.highlights.filter(mark=>mark.book===book.id));
   const format=button.dataset.annotatedExport;
   const result=await exportAnnotated(pdf,marks,format,message=>status(message));
   const {requestService}=await import('./request-service.js');
   await requestService('reserve-annotated-export',{bookId:book.accessBookId||book.id});
   const url=URL.createObjectURL(result),link=document.createElement('a');
   link.href=url;link.download=book.title.replace(/[\\/:*?"<>|]/g,'-')+' - surlignages.'+format;
   link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
   status('Export annoté prêt.');
  }catch(error){status(error.message,true);}
  finally{buttons.forEach(item=>item.disabled=false);}
 });

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
  $('save-reader-passage').disabled=!highlight;
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
   mark.dataset.eraseMark=h.id;
   mark.className = 'pdf-highlight' + (active?.id === h.id ? ' is-active' : '');
   mark.style.cssText = `left:${rect.x*100}%;top:${rect.y*100}%;width:${rect.w*100}%;height:${rect.h*100}%;background:${h.color}`;
   ink.appendChild(mark);
  }
  traceList.innerHTML = list.length ? `<h2>Mes surlignages <small>Page ${currentPage}</small></h2>` + list.map(h => `<span class="reader-trace-pair"><button type="button" aria-pressed="${h.id===active?.id}" data-open-trace="${esc(h.id)}" style="--pencil:${esc(h.color)}">${esc(h.quote.length>95?h.quote.slice(0,95)+'…':h.quote)}</button><button type="button" class="reader-trace-delete" data-delete-trace="${esc(h.id)}" aria-label="Effacer ce surlignage" title="Effacer ce surlignage">×</button></span>`).join('') : '';
  traceList.querySelectorAll('[data-delete-trace]').forEach(button=>button.onclick=()=>removeHighlight(list.find(h=>h.id===button.dataset.deleteTrace)));
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
 function bindPencil(button){
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
 }
 pencils.forEach(bindPencil);
 if($('add-pencil'))$('add-pencil').onclick=async()=>{
  const button=$('add-pencil');
  const color=$('new-pencil').value.toLowerCase(),colors=legend(),limit=readerLevel===1?8:readerLevel===2?10:Infinity;
  if(Object.hasOwn(colors,color)){status('Cette couleur est déjà dans ta palette.',true);return;}
  if(Object.keys(colors).length>=limit){status('Ta palette a atteint '+limit+' couleurs.',true);return;}
  const previous=state.legend;
  state.legend={...previous,[color]:'Couleur '+(Object.keys(colors).length+1)};
  button.disabled=true;
  try{
   await save();
   const pencil=document.createElement('button');
   pencil.type='button';pencil.className='pencil';pencil.dataset.pencil=color;
   pencil.style.setProperty('--pencil',color);
   pencil.title=legend()[color];pencil.setAttribute('aria-label',pencil.title);
   host.querySelector('.reader-pencils').append(pencil);
   pencils.push(pencil);
   bindPencil(pencil);currentColor=color;paintPencils();
   const legends=$('reader-legends');
   const label=document.createElement('label');
   label.className='legend-edit';label.style.setProperty('--pencil',color);
   const dot=document.createElement('span');dot.className='legend-dot';
   const input=document.createElement('input');input.dataset.legendColor=color;input.value=legend()[color];input.maxLength=60;input.setAttribute('aria-label','Légende de la nouvelle couleur');
   label.append(dot,input);legends.append(label);bindLegend(input);legends.open=true;input.focus();input.select();
   status('Couleur enregistrée dans ton espace.');
  }catch(error){state.legend=previous;status(error.message,true);}
  finally{button.disabled=false;}
 };

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
  else if (mode === 'erase') help.textContent = 'Clique près du surlignage à effacer, ou utilise le × dans la liste. Annuler le remet en place.';
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
 const eraseTarget=(event,list)=>{
  const textId=event.target.closest('mark')?.dataset.highlightId;
  if(textId)return list.find(item=>item.id===textId);
  if(!paper.contains(event.target))return null;
  const box=paper.getBoundingClientRect();
  if(!box.width||!box.height)return null;
  const x=event.clientX-box.left,y=event.clientY-box.top;
  let closest=null,distance=12;
  for(const mark of [...list].reverse())for(const rect of mark.rects||[]){
   const dx=Math.max(rect.x*box.width-x,x-(rect.x+rect.w)*box.width,0);
   const dy=Math.max(rect.y*box.height-y,y-(rect.y+rect.h)*box.height,0);
   const gap=Math.hypot(dx,dy);
   if(gap<distance){distance=gap;closest=mark;}
  }
  return closest;
 };
 undo.onclick = async () => {
  const change = history.pop();
  if (!change) return;
  const index = state.highlights.findIndex(h => h.id === change.id);
  if (change.removed) state.highlights.splice(change.index,0,change.removed);
  else if (index >= 0 && Object.hasOwn(change,'oldAnnotation')) state.highlights[index].annotation=change.oldAnnotation;
  else if (index >= 0 && change.oldColor) state.highlights[index].color = change.oldColor;
  else if (index >= 0) state.highlights.splice(index,1);
  openHighlight(null);
  paintMarks();
  await persist();
 };
 const scroller=$('pdf-scroll');
 scroller.addEventListener('pointermove',event=>{
  if(mode!=='erase'||!pageReady)return;
  const target=eraseTarget(event,pageHighlights());
  for(const mark of scroller.querySelectorAll('[data-erase-mark]'))mark.classList.toggle('erase-target',mark.dataset.eraseMark===target?.id);
 },options);
 scroller.addEventListener('pointerleave',()=>scroller.querySelectorAll('.erase-target').forEach(mark=>mark.classList.remove('erase-target')),options);
 scroller.addEventListener('click', event => {
  if(mode==='erase'&&pageReady)void removeHighlight(eraseTarget(event,pageHighlights()));
 },options);

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

 let annotationEdit=null;
 annotation.onblur=()=>{annotationEdit=null;};
 annotation.oninput=()=>{
  if(!active)return;
  if(annotationEdit!==active.id||history.at(-1)?.id!==active.id||!Object.hasOwn(history.at(-1),'oldAnnotation')){
   rememberChange({id:active.id,oldAnnotation:active.annotation||''});
   annotationEdit=active.id;
  }
  active.annotation=annotation.value;
  undo.disabled=false;
  void persist();
 };
 $('save-reader-passage').onclick=async()=>{
  if(!active)return;
  const button=$('save-reader-passage');
  button.disabled=true;
  try{
   await save();
   openHighlight(null);
   status('Passage enregistré pour « '+book.title+' ». Choisis un nouveau passage.');
  }catch(error){status(error.message,true);button.disabled=!active;}
 };
 $('remove-current-highlight').onclick = () => void removeHighlight(active);
 const sheetInputs = {'reader-sheet-title':'title','reader-sheet-page':'page','reader-sheet-passage':'passage','reader-sheet-text':'body'};
 function saveSheet() {
  for (const [input, field] of Object.entries(sheetInputs)) sheet[field] = $(input).value;
  sheet.title = sheet.title.trim() || book.title;
  sheet.updated = new Date().toISOString();
  void persist();
 }
 Object.keys(sheetInputs).forEach(input => $(input).oninput = saveSheet);
 $('save-reader-sheet').onclick=async()=>{
  const button=$('save-reader-sheet');
  button.disabled=true;
  const completed=sheet;
  completed.auto=false;
  try{
   await save();
   sheet=ensureBookSheet(book);
   for(const [input,field] of Object.entries(sheetInputs))$(input).value=sheet[field]||'';
   status('Fiche enregistrée. Une nouvelle fiche est prête.');
  }catch(error){completed.auto=true;status(error.message,true);}
  finally{button.disabled=false;}
 };
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
 function bindLegend(input){input.onchange = async () => {
  state.legend = {...legend(),[input.dataset.legendColor]:input.value.trim() || legend()[input.dataset.legendColor] || 'Couleur personnalisée'};
  pencils.forEach(button => {
   button.title = legend()[button.dataset.pencil];
   button.setAttribute('aria-label',button.title);
  });
  paintPencils();
  await persist();
 };}
 host.querySelectorAll('[data-legend-color]').forEach(bindLegend);

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
 const readerSection=host.querySelector('.annotated-reader');
 const expand=$('reader-expand');
 expand.onclick=async()=>{
  const active=readerSection.classList.toggle('reader-expanded');
  document.body.classList.toggle('reader-fullscreen-active',active);
  expand.setAttribute('aria-pressed',String(active));
  expand.textContent=active?'✕ Quitter le grand lecteur':'⛶ Plein écran';
  if(pdf)await showPage(currentPage);
 };
 events.signal.addEventListener('abort',()=>document.body.classList.remove('reader-fullscreen-active'),{once:true});
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


/* Catalogue partagé : fiches GitHub validées et fiches publiées par l'atelier Firebase. */

const catalogueAliases=new Map();
function catalogueIdentity(book){
 const title=searchTerms(String(book.title||'').split(/[:：]/)[0]).join(' ');
 const author=searchTerms(String(book.author||'')).join(' ');
 return title&&author?title+'|'+author:book.id;
}
function mergeCatalogueDuplicates(rules){
 const groups=new Map();
 for(const book of state.books){
  const key=catalogueIdentity(book);
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(book);
 }
 const selected=[];
 for(const group of groups.values()){
  const rows=group.map(book=>({book,rule:rules.get(book.id)||rules.get('db-'+book.externalCatalogId)}));
  if(rows.some(({rule})=>rule?.deleted||rule?.hidden))continue;
  rows.sort((a,b)=>Number(b.rule?.access_level||0)-Number(a.rule?.access_level||0)
   ||Number(Boolean(b.book.pdfPath||b.book.pdf))-Number(Boolean(a.book.pdfPath||a.book.pdf)));
  const {book,rule}=rows[0];
  for(const {book:other} of rows.slice(1)){
   catalogueAliases.set(other.id,book.id);
   for(const field of ['cover','presentation','summary','external','edition'])if(!book[field]&&other[field])book[field]=other[field];
   for(const field of ['chapters','reviewLinks','sources'])if(!book[field]?.length&&other[field]?.length)book[field]=other[field];
  }
  book.accessLevel=Number(rule?.access_level||0);
  book.accessBookId=rule?.book_id||book.id;
  if(book.accessLevel){delete book.pdf;delete book.pdfPath;}
  // Only the inventory, rather than the presence of a catalogue entry, confirms a PDF.
  if(book.pdfPath||book.pdf)book.privatePdf=false;
  selected.push(book);
 }
 state.books=selected;
 id=catalogueAliases.get(id)||id;
}
async function applyCatalogueAccess(){
 if(location.protocol==='file:')return;
 try{
  const {catalogueRules}=await import('./catalogue-access.js');
  mergeCatalogueDuplicates(await catalogueRules());
 }catch(error){console.warn(error);}
}
async function applyCatalogueSuppressions(){
 if(location.protocol==='file:')return;
 try{
  const client=await ellConnect();
  const {data,error}=await client.from('catalogue_suppressions').select('book_id');
  if(error)throw error;
  const removed=new Set((data||[]).map(item=>item.book_id));
  state.books=state.books.filter(book=>!removed.has(book.id)&&!removed.has(String(book.externalCatalogId||'')));
 }catch(error){console.warn('Suppression catalogue : chargement indisponible',error);}
}
async function loadPublicCatalogue(){
 const mapping=Object.fromEntries(Object.entries(GENRES).map(([slug,[name,subs]])=>[name,{slug,subs}]));
 const normalize=(entry,source)=>{
  const categoryName=String(entry.category||entry.genre||'').trim();
  const aliases={'Savoir':'Savoirs','Savoirs':'Savoirs','Développement personnel':'Vie et société','Spiritualité':'Spiritualités et religions'};
  const resolvedCategory=aliases[categoryName]||categoryName;
  const genre=mapping[resolvedCategory];
  const genreSlug=genre?.slug||(GENRES[resolvedCategory]?resolvedCategory:null);
  if(!genreSlug||!entry.title)return null;
  const subs=GENRES[genreSlug][1];
  const requestedSub=String(entry.subcategory||'').trim();
  const subIndex=entry.sub!==undefined&&/^\d+$/.test(String(entry.sub))?Number(entry.sub):subs.findIndex(x=>x.toLowerCase()===requestedSub.toLowerCase());
  if(subIndex<0||subIndex>=subs.length)return null;
  const path=entry.pdf_path||entry.pdfPath||'';
  const safePath=/^(?:pdf\/|livres\/)[^?#]+\.pdf$/i.test(path)?path:(/^https:\/\/potierbiblio-com\.github\.io\/Lecture-Entre-Les-Lignes\/(?:pdf|livres)\/[^?#]+\.pdf$/i.test(path)?path:'');
  const cover=entry.cover_path||entry.cover||'';
  const safeCover=/^(?:images\/|livres\/)[^?#]+\.(?:png|jpe?g|webp)$/i.test(cover)?cover:(/^https:\/\/potierbiblio-com\.github\.io\/Lecture-Entre-Les-Lignes\/(?:images|livres)\/[^?#]+\.(?:png|jpe?g|webp)$/i.test(cover)?cover:'');
  return {id:source+'-'+entry.id,title:entry.title,author:entry.author||'',genre:genreSlug,sub:String(subIndex),
   cover:safeCover,pdfPath:safePath,presentation:entry.description||entry.presentation||'',summary:entry.summary||entry.description||'',
   publisher:entry.publisher||'',year:entry.publication_year||entry.year||'',isbn:entry.isbn||'',
   reviewLinks:Array.isArray(entry.review_links)?entry.review_links:[],chapters:Array.isArray(entry.chapters)?entry.chapters:[],
   catalogueSource:source};
 };
 state.books=state.books.filter(b=>!b.catalogueSource);
 const add=(entry,source)=>{
  const book=normalize(entry,source);if(!book)return;
  const existing=state.books.find(b=>b.id===book.id||book.pdfPath&&b.pdfPath===book.pdfPath);
  if(existing)Object.assign(existing,book);
  else state.books.push(book);
 };
 try{
  const response=await fetch('livres/catalogue-public.json',{cache:'no-store'});
  if(response.ok){const data=await response.json();for(const item of data.books||[])if(item.published===true)add(item,'github');}
 }catch(err){console.warn('Catalogue GitHub non chargé',err);}
 try{
  const [{initializeApp,getApps,getApp},{getFirestore,collection,getDocs,query,where}]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js')
  ]);
  const app=getApps().length?getApp():initializeApp({apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'});
  const snap=await getDocs(query(collection(getFirestore(app),'books'),where('published','==',true)));
  const published=snap.docs.map(d=>({id:d.id,...d.data()}));
  for(const item of published){
   try{
    const chapterSnap=await getDocs(query(collection(getFirestore(app),'book_chapters'),where('book_id','==',item.id)));
    item.chapters=chapterSnap.docs.map(d=>d.data()).sort((a,b)=>Number(a.chapter_number||0)-Number(b.chapter_number||0)).map(c=>({
      title:c.title||'Chapitre sans titre',summary:c.summary||'',page:Number(c.page_start||c.page||0)||null,number:Number(c.chapter_number||0)
    }));
   }catch(error){console.warn('Chapitres indisponibles pour '+item.id,error);}
   add(item,'firebase');
  }
 }catch(err){console.warn('Catalogue Firebase indisponible (vérifier les règles Firestore)',err);}
}

async function showDownloadCount(book){
 const host=$('book-detail');if(!host)return;
 const id=book.accessBookId||book.id;
 try{
  const query=new URLSearchParams({select:'downloads',book_id:'eq.'+id});
  const response=await fetch(ELL_URL+'/rest/v1/catalogue_download_totals?'+query,{headers:{apikey:ELL_KEY},cache:'no-store'});
  if(!response.ok)return;
  const [stat]=await response.json();
  const total=Number(stat?.downloads||0);
  const count=$('book-download-total')||document.createElement('p');
  count.id='book-download-total';count.className='note';count.setAttribute('aria-live','polite');
  count.textContent=new Intl.NumberFormat('fr-FR').format(total)+' téléchargement'+(total===1?'':'s')+' enregistré'+(total===1?'':'s');
  (host.querySelector('.book-file-actions')||host.querySelector('.album-heading')||host).append(count);
 }catch(error){console.warn(error);}
}
function renderRecommendations(){
 const shelf=$('recommended-books'),engine=window.ELLRecommendations;
 if(!shelf||!engine)return;
 const favorites=window.ELLCollections?.read().favorites||[];
 const picks=favorites.length?engine.rank(state.books,favorites,{}).filter(item=>item.affinity>0).slice(0,4):[];
 shelf.hidden=!picks.length;
 shelf.querySelector('.catalogue-results').innerHTML=picks.map(({book})=>card(book)).join('');
}
function addGenreCounts(){
 for(const link of document.querySelectorAll('a.genre-plate, a.rayon-image')){
  const file=new URL(link.href,location.href).pathname.split('/').pop();
  const rayon=file.match(/^livres-(.+)-(\d+)\.html$/);
  const genre=rayon?.[1]||file.replace(/\.html$/,'');
  if(!Object.hasOwn(GENRES,genre))continue;
  const count=state.books.filter(book=>book.genre===genre&&(!rayon||String(book.sub)===rayon[2])).length;
  const badge=document.createElement('span');
  badge.className='genre-book-count';
  badge.textContent=count+(count===1?' livre':' livres');
  badge.style.cssText='position:absolute;right:.55rem;bottom:.55rem;z-index:3;padding:.28rem .58rem;border-radius:2rem;background:#fff5fa;color:#64324e;font-size:.85rem;font-weight:700;box-shadow:0 1px 4px #63354c33';
  if(getComputedStyle(link).position==='static')link.style.position='relative';
  link.append(badge);
 }
}
async function loadEditorialCatalogue(){
 try{
  const response=await fetch(ELL_URL+'/rest/v1/catalogue_editorial_books?select=id,ficha',{headers:{apikey:ELL_KEY},cache:'no-store'});
  if(!response.ok)throw Error('Catalogue éditorial indisponible.');
  const books=await response.json();
  for(const {id,ficha} of books){
   if(!GENRES[ficha.genre]?.[1][ficha.sub])continue;
   state.books.push({...ficha,id,catalogueSource:'editorial'});
  }
 }catch(error){console.warn(error);}
}

async function start(){try{await connectService();
const privatePages=new Set(['mon-espace.html','surlignages.html','annotations.html','fiches.html','journaux.html','profil.html','sauvegardes.html','tests.html']);
const currentPage=location.pathname.split('/').pop().toLowerCase();
if(privatePages.has(currentPage)&&!ellUser){
 const main=$('contenu')||document.querySelector('main');
 if(main){main.innerHTML='<section class="account-login-gate" style="max-width:800px;margin:3rem auto;padding:2rem;text-align:center"><img src="images/carnet-illustre/carnet-studieux.jpg" alt="Carnet de lecture illustré" style="width:100%;max-height:250px;object-fit:cover;border-radius:22px"><h1>Bienvenue dans ton carnet ♡</h1><p>Un espace rien qu’à toi pour tes lectures, annotations, fiches et journaux. Connecte-toi pour retrouver tes souvenirs de lecture.</p><div id="account-status" style="text-align:left"></div></section>';showAccount();}
 return;
}
try{db=await openDB();state=await load();}catch(storageError){state=blank();db=null;let warning=document.createElement('p');warning.className='note';warning.textContent='Le catalogue et ses PDF restent consultables. Le stockage de ce navigateur est indisponible : les nouveaux avis et notes ne pourront pas être conservés.';$('contenu').prepend(warning);}
for(const book of LIVRES_INITIAUX){
  const existing=state.books.find(item=>item.id===book.id);
  if(!existing){
    state.books.push({...book});
  }else if(book.catalogueRevision && existing.catalogueRevision!==book.catalogueRevision){
    const previous=ORIGINAL_CATALOGUE[book.id];
    const keep={};
    for(const key of ['title','author','presentation','summary','text','cover','genre','sub']) if(previous && existing[key] && existing[key]!==previous[key])keep[key]=existing[key];
    Object.assign(existing,book,keep);
  }else if(book.cover && existing.cover===book.cover.replace(/\.jpg$/,'.webp')){
    existing.cover=book.cover;
  }
}
try { await loadServiceState(); } catch(error) { showCarnetWarning('Impossible de charger ton carnet personnel : '+error.message); }
if(ellUser){
  const owner=ellUser.id;
  const unsubscribe=ellFirebaseAuth.onAuthStateChanged(account=>{
    if(account?.uid!==owner){unsubscribe();ellUser=null;ellClear();document.body.hidden=true;location.reload();}
  });
}
await Promise.all([loadPublicCatalogue(),loadEditorialCatalogue()]);
await applyCatalogueSuppressions();
await applyCatalogueAccess();
if($('reader-content')||$('highlights')){const css=document.createElement('link');css.rel='stylesheet';css.href=siteHref('css/reader-interactions.css');document.head.append(css);}
addGenreCounts();
if(remoteCarnet&&ellUser)restoreCarnet(remoteCarnet);
if(db)await writeLocalState(null);
if(!document.body.isConnected)return;
applyDesign();
if($('search-year')){$('search-year').innerHTML='<option value="">Toutes les dates</option>'+[...new Set(state.books.map(b=>bookYear(b)).filter(Boolean))].sort((a,b)=>Number(b)-Number(a)).map(y=>'<option>'+esc(y)+'</option>').join('');}
if($('review-search')){
 $('review-search').oninput=renderBooks;
 for(const field of ['review-sort','review-day','review-only']) $(field).onchange=renderBooks;
 $('review-filters').onsubmit=event=>{event.preventDefault();renderBooks();};
 $('review-filters').onreset=()=>requestAnimationFrame(renderBooks);
}
for(const field of ['search-year','search-sort','pdf-only','search-favorites'])if($(field))$(field).onchange=renderBooks;
if(($('books')||$('book-detail'))&&!document.querySelector('script[src*="favoris-catalogue.js"]')){
 const hearts=document.createElement('script');hearts.src='js/favoris-catalogue.js?v=coeur-20261119-3';document.head.append(hearts);
}
if($('search-subgenre')){
 const genre=$('search-genre'),sub=$('search-subgenre');
 const updateSubgenres=()=>{
  sub.replaceChildren(new Option('Tous les sous-genres',''),...(GENRES[genre.value]?.[1]||[]).map((name,index)=>new Option(name,String(index))));
  sub.disabled=!genre.value;
 };
 const query=new URLSearchParams(location.search);
 if(Object.hasOwn(GENRES,query.get('genre')))genre.value=query.get('genre');
 updateSubgenres();
 if(Array.from(sub.options).some(option=>option.value===query.get('sub')))sub.value=query.get('sub');
 genre.addEventListener('change',()=>{updateSubgenres();renderBooks();});
 sub.addEventListener('change',renderBooks);
 $('catalogue-search')?.addEventListener('reset',()=>requestAnimationFrame(()=>{updateSubgenres();renderBooks();}));
}
bindCatalogueControls();
renderBooks();renderRecommendations();if($('recommended-books'))addEventListener('ell-lists-change',renderRecommendations);if($('search-favorites'))addEventListener('ell-lists-change',()=>{if($('search-favorites').checked)renderBooks()});selects();bindTraceFilters();renderHighlights();renderNotes();renderQuestions();if ($('search')) $('search').oninput = renderBooks;
if ($('search-genre')) $('search-genre').onchange = renderBooks;
if ($('catalogue-tabs')) {
  $('catalogue-tabs').hidden = false;
  $('catalogue-tabs').querySelectorAll('[data-genre]').forEach(button => {
    button.onclick = () => {
      $('search-genre').value = button.dataset.genre;
      $('search-genre').dispatchEvent(new Event('change'));
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
if(b&&(b.accessLevel||b.privatePdf)&&$('reader-content')){
  if(b.accessLevel>readerLevel){$('reader-content').innerHTML=bookSubscriptionOffer(b);return;}
  try{
    const {cataloguePdf}=await import('./catalogue-access.js');
    b={...b,pdf:await cataloguePdf(b.accessBookId||b.id,{publicAccess:!b.accessLevel})};
  }catch(error){
    const reader=$('reader-content');
    reader.replaceChildren(document.createTextNode(error.message+' '));
    if(!b.accessLevel)return;
    const link=document.createElement('a');
    link.href=ellUser?'le-cercle.html':'connexion-firebase.html';
    link.textContent=ellUser?'Voir les abonnements':'Se connecter';
    reader.append(link);
    return;
  }
}
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

if($('book-detail')){$('book-detail').innerHTML=b?detailMarkup(b):'<p class="empty">Choisis un livre dans Genres ou dans Mes lectures.</p>';wirePDFLinks();if(b)showDownloadCount(b);}
document.querySelectorAll('[data-count-download]').forEach(link=>link.addEventListener('click',async event=>{
 if(typeof previewAsset==='function')return;
 event.preventDefault();
 if(link.dataset.pending)return;
 if(!ellUser){location.assign(siteHref('connexion-firebase.html'));return;}
 link.dataset.pending='true';
 try{
  const {requestService}=await import('./request-service.js');
  await requestService('record-public-download',{bookId:link.dataset.countDownload});
  const download=document.createElement('a');download.href=link.href;download.download=link.download;download.click();
  if(b)await showDownloadCount(b);
 }catch(error){alert(error.message);}
 finally{delete link.dataset.pending;}
}));
document.querySelectorAll('[data-private-download]').forEach(button=>button.onclick=async()=>{
  button.disabled=true;
  try{
    const {cataloguePdf}=await import('./catalogue-access.js');
    location.assign(await cataloguePdf(button.dataset.privateDownload,{download:true,publicAccess:false}));
    if(b)void showDownloadCount(b);
  }catch(error){alert(error.message);}
  finally{button.disabled=false;}
});
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

window.ELL_FAVORITES_BOOKS=LIVRES_INITIAUX.map(b=>({id:b.id,detailPath:b.detailPath||''}));
// Actions Favoris et Listes disponibles sur toutes les fiches et cartes du catalogue.
if(!document.querySelector('script[src*="favoris-catalogue.js"]')){
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='css/favoris-listes.css';document.head.append(sheet);
 const script=document.createElement('script');script.src='js/favoris-catalogue.js?v=20261118';document.body.append(script);
}
