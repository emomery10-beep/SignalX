// Academy article translations — Français (fr) — Wave A, Batch 1.
//
// Point of Sale & Retail category: 13 articles covering POS fundamentals,
// staff management, camera scanning, checkout flow, cart management,
// payments, WhatsApp receipts, revenue tracking, inventory, low-stock
// alerts, refunds, and transaction amendments.
//
// Glossary used across this batch (see also the report accompanying this
// file for the full canonical list other fr batches should reuse):
//   profit -> bénéfice | margin -> marge | revenue -> chiffre d'affaires
//   stock/inventory -> stock / gestion des stocks | cashier -> caissier
//   receipt -> reçu | refund -> remboursement | VAT -> TVA
//   dashboard -> tableau de bord | staff -> personnel | role -> rôle
//   low-stock alert -> alerte de stock faible | purchase order -> bon de commande
//   POS system -> système de point de vente (PDV) | barcode -> code-barres
//   cart -> panier | discount -> remise | void -> annulation
//   audit trail -> piste d'audit | reorder point -> seuil de réapprovisionnement
//   Owner -> Propriétaire | Manager -> Gérant | magic link -> lien magique
//
// Merged into lib/academy-i18n/fr/index.ts by a later step — this file is
// NOT imported anywhere yet.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch1Translations: LocaleTranslations = {
  'what-is-a-pos-system': {
    title: 'Qu’est-ce qu’un système de point de vente (PDV) ? Le guide complet pour les petits commerçants',
    description:
      "Un système de point de vente est au cœur de chaque transaction commerciale. Découvrez ce que fait un logiciel de caisse, pourquoi c'est important, et comment choisir celui qui convient à votre boutique.",
    keywords: [
      'système de point de vente',
      'point de vente',
      'PDV commerce',
      'caisse pour petite entreprise',
      'logiciel de caisse',
      'point de vente électronique',
      "système d'encaissement",
    ],
    keyTakeaways: [
      'Un système de point de vente combine matériel et logiciel pour traiter les ventes, suivre les stocks et générer des reçus.',
      'Les solutions de PDV modernes basées sur le cloud fonctionnent sur tablettes et téléphones — plus besoin de caisses enregistreuses encombrantes.',
      "Choisir le bon PDV influence tout, de la rapidité d'encaissement à la précision des stocks et à la conformité fiscale.",
    ],
    content: [
      {
        heading: 'Que signifie réellement PDV ?',
        body: "PDV signifie Point De Vente — le moment et l'endroit où un client paie des biens ou des services. Autrefois, cela signifiait une caisse enregistreuse boulonnée sur un comptoir. Aujourd'hui, un système de point de vente est un logiciel (souvent basé sur le cloud) qui fonctionne sur une tablette, un téléphone ou un terminal dédié, et qui fait bien plus que simplement encaisser un paiement. Il enregistre chaque transaction, met à jour vos niveaux de stock en temps réel, calcule la TVA, génère des reçus numériques ou imprimés, et alimente des rapports qui vous indiquent précisément la performance de votre entreprise. Si vous avez déjà payé par carte dans un café et regardé la tablette du barista se mettre à jour instantanément, vous avez vu un PDV moderne en action. Le passage des caisses mécaniques aux systèmes pilotés par logiciel a été l'un des plus grands changements du commerce de détail britannique au cours de la dernière décennie, et il est désormais accessible même au plus petit étal de marché ou à la boutique éphémère.",
      },
      {
        heading: 'Les fonctionnalités essentielles de tout système de point de vente',
        body: "Au minimum, un système de point de vente doit vous permettre de scanner ou de rechercher des produits, de les ajouter à un panier, d'appliquer des remises ou des promotions, d'accepter plusieurs moyens de paiement (espèces, carte, sans contact) et d'émettre un reçu. Au-delà de cette base, recherchez une gestion des stocks — le système doit déduire automatiquement le stock lorsque vous vendez un article et vous alerter lorsque les niveaux sont bas. La gestion du personnel est tout aussi importante : vous devez pouvoir attribuer des rôles, savoir qui a traité quelle vente, et contrôler l'accès aux fonctions sensibles comme les remboursements et les annulations. Les rapports complètent l'essentiel. Un bon PDV vous donne des résumés de chiffre d'affaires quotidiens, des listes de produits les plus vendus, et des répartitions fiscales sans que vous ayez besoin d'exporter quoi que ce soit vers un tableur. Si vous êtes assujetti à la TVA, le système doit calculer et distinguer la TVA sur chaque transaction afin que vos déclarations soient simples.",
      },
      {
        heading: 'PDV en cloud contre EPOS traditionnel',
        body: "Les systèmes EPOS (Electronic Point of Sale) traditionnels fonctionnent généralement sur du matériel dédié avec des données stockées localement. Ils sont fiables mais coûteux, difficiles à mettre à jour, et limités à un seul emplacement. Les systèmes de PDV en cloud stockent les données sur des serveurs distants et se synchronisent entre les appareils. Les avantages sont considérables : vous pouvez consulter vos ventes depuis votre téléphone lorsque vous êtes loin de la boutique, les mises à jour se font automatiquement, et il n'y a pas de point unique de défaillance si un appareil tombe en panne. La contrepartie est que les systèmes en cloud ont besoin d'une connexion internet, bien que la plupart des bons systèmes — dont AskBiz POS — proposent un mode hors ligne pour continuer à vendre pendant de brèves coupures et se synchroniser dès le retour de la connexion. Pour la plupart des petites entreprises britanniques, un PDV basé sur le cloud fonctionnant sur une tablette ou un téléphone existant est l'option la plus économique et la plus flexible.",
      },
      {
        heading: 'Comment choisir le bon PDV pour votre entreprise',
        body: "Commencez par vos critères non négociables. Avez-vous besoin du scan de codes-barres ? De connexions multi-personnel ? D'une intégration avec votre logiciel de comptabilité ? Notez-les avant de regarder le moindre produit. Ensuite, considérez le coût total de possession — pas seulement l'abonnement mensuel, mais aussi les frais de traitement des cartes, les coûts du matériel, et les éventuels frais par transaction. Les formules gratuites s'accompagnent souvent de frais de traitement plus élevés qui s'accumulent rapidement avec le volume. Enfin, testez vous-même le parcours d'encaissement. Chronométrez le temps nécessaire pour traiter une vente de trois articles, du scan au reçu. Si cela prend plus de soixante secondes, vos clients le remarqueront. AskBiz POS est conçu pour accomplir ce parcours en moins de soixante secondes en utilisant simplement l'appareil photo du téléphone pour le scan, sans matériel supplémentaire requis.",
      },
    ],
    faq: [
      {
        q: 'Ai-je besoin de matériel spécial pour un système de point de vente ?',
        a: "Pas nécessairement. De nombreux systèmes de PDV modernes, dont AskBiz POS, fonctionnent sur des smartphones et tablettes standards. Vous pouvez ajouter une imprimante de reçus ou un lecteur de carte en option, mais ils ne sont pas nécessaires pour commencer à vendre.",
      },
      {
        q: 'Un système de point de vente est-il la même chose qu’un terminal de paiement ?',
        a: "Non. Un terminal de paiement ne fait que traiter les paiements par carte. Un système de point de vente gère l'ensemble de la vente — sélection des produits, tarification, mise à jour des stocks, reçus et rapports — le traitement des cartes n'étant qu'un élément parmi d'autres.",
      },
      {
        q: 'Combien coûte un système de point de vente au Royaume-Uni ?',
        a: "Les coûts vont de gratuit (avec des frais par transaction) à 50–100 £ par mois pour des systèmes complets. Le matériel peut ajouter 200–1 000 £ selon que vous utilisez des appareils existants ou que vous achetez des terminaux dédiés.",
      },
    ],
  },

  'askbiz-pos-overview': {
    title: 'AskBiz POS : comment fonctionne notre point de vente intégré',
    description:
      "AskBiz inclut un module de point de vente entièrement intégré. Voici comment il fonctionne, ce qu'il coûte, et en quoi il diffère des caisses autonomes.",
    keywords: [
      'AskBiz POS',
      'PDV intégré',
      'point de vente intégré',
      'AskBiz commerce',
      'module de caisse',
      'logiciel de caisse petite entreprise',
    ],
    keyTakeaways: [
      "AskBiz POS est intégré à la plateforme — aucune intégration tierce ni abonnement supplémentaire n'est nécessaire.",
      "Il utilise l'appareil photo de votre téléphone pour scanner les codes-barres, éliminant le besoin de matériel dédié.",
      "Chaque vente alimente automatiquement les analyses d'AskBiz, vous offrant une intelligence d'affaires en temps réel.",
    ],
    content: [
      {
        heading: 'Pourquoi nous avons intégré un PDV à AskBiz',
        body: "La plupart des petits commerçants finissent par accumuler un patchwork d'outils : un système pour vendre, un autre pour les stocks, un troisième pour la comptabilité, et peut-être un quatrième pour l'analyse. Chacun a son propre identifiant, son propre format de données et son propre abonnement mensuel. Quand quelque chose ne va pas — un écart de stock, une transaction manquante, un numéro de TVA qui ne correspond pas — vous passez des heures à recouper des tableurs. Nous avons créé AskBiz POS pour éliminer cette friction. Comme le PDV vit à l'intérieur d'AskBiz, chaque vente que vous traitez met instantanément à jour votre stock, alimente vos tableaux de bord de chiffre d'affaires, et devient partie intégrante de votre intelligence d'affaires. Il n'y a ni synchronisation, ni export CSV, ni réconciliation. Les données circulent en temps réel, ce qui signifie que les informations que vous voyez dans AskBiz sont toujours à jour.",
      },
      {
        heading: 'Comment cela fonctionne en pratique',
        body: "Lorsque vous ouvrez le module PDV, vous voyez une interface de vente claire. Appuyez sur l'icône appareil photo pour scanner un code-barres — AskBiz utilise la caméra de votre appareil et l'apprentissage automatique embarqué pour reconnaître les codes-barres instantanément. Le produit apparaît dans votre panier avec son nom, son prix et son niveau de stock actuel. Ajoutez d'autres articles, ajustez les quantités, appliquez des remises si besoin, puis choisissez un moyen de paiement : espèces, carte, ou une combinaison des deux. Une fois la vente confirmée, AskBiz génère un reçu que vous pouvez imprimer, afficher à l'écran, ou envoyer directement au client via WhatsApp. L'ensemble du parcours — du premier scan au reçu — prend généralement moins de soixante secondes. En coulisses, les niveaux de stock sont décrémentés, le chiffre d'affaires est enregistré au nom du bon membre du personnel, la TVA est calculée, et la transaction entre dans votre piste d'audit.",
      },
      {
        heading: 'Ce qui le distingue des systèmes de PDV autonomes',
        body: "Les systèmes de PDV autonomes sont des outils transactionnels — ils traitent les ventes, et c'est globalement là que s'arrête leur rôle. AskBiz POS est un outil d'intelligence d'affaires qui, accessoirement, traite aussi les ventes. Chaque transaction génère des données qu'AskBiz analyse automatiquement. Vous ne voyez pas seulement que vous avez vendu quarante-deux unités du Produit X aujourd'hui ; vous voyez que les ventes du Produit X ont augmenté de 18 % sur une semaine, que c'est votre article à plus forte marge, et qu'au rythme actuel d'écoulement, vous serez en rupture de stock dans neuf jours. Ce contexte transforme un PDV, d'une simple caisse enregistreuse glorifiée, en un véritable outil d'aide à la décision. Vous obtenez également des indicateurs de performance du personnel, un suivi du chiffre d'affaires quotidien, des alertes de stock faible, et des rapports exportables — le tout sans quitter la plateforme.",
      },
      {
        heading: 'Bien démarrer avec AskBiz POS',
        body: "La mise en place prend environ quinze minutes. Commencez par ajouter vos produits — vous pouvez le faire manuellement, en important un fichier CSV, ou en scannant les codes-barres et en saisissant les détails au fur et à mesure. Ensuite, invitez votre personnel et attribuez les rôles (Propriétaire, Gérant ou Caissier) afin que chacun dispose du bon niveau d'accès. Enfin, configurez vos paramètres de reçu : choisissez entre l'impression, l'affichage à l'écran, ou l'envoi par WhatsApp. Il n'y a aucun matériel à acheter, sauf si vous souhaitez une imprimante de reçus Bluetooth pour plus de confort. AskBiz POS fonctionne comme une Progressive Web App (PWA), donc il fonctionne sur n'importe quel téléphone ou tablette moderne et peut être installé sur l'écran d'accueil pour un accès en un seul geste. Si vous utilisez déjà AskBiz pour l'analyse ou les stocks, votre catalogue de produits est déjà là — activez simplement le module PDV et commencez à vendre.",
      },
    ],
    faq: [
      {
        q: 'AskBiz POS est-il inclus dans mon abonnement ?',
        a: "Oui. Le module PDV est inclus dans tous les forfaits AskBiz, sans coût supplémentaire. AskBiz ne facture aucuns frais par transaction — vous ne payez que ce que votre prestataire de paiement par carte facture.",
      },
      {
        q: 'Puis-je utiliser AskBiz POS hors ligne ?',
        a: "AskBiz POS prend en charge un mode hors ligne pour la vente de base. Les transactions sont stockées localement et se synchronisent automatiquement lorsque votre appareil se reconnecte à internet.",
      },
      {
        q: 'Dois-je acheter un lecteur de codes-barres ?',
        a: "Non. AskBiz utilise l'appareil photo de votre téléphone ou de votre tablette pour scanner les codes-barres. Un lecteur Bluetooth dédié est facultatif, si vous préférez la rapidité et l'ergonomie d'un appareil physique.",
      },
    ],
  },

  'pos-staff-management': {
    title: 'Gérer le personnel du PDV : rôles, autorisations et connexion par lien magique',
    description:
      "Contrôlez qui peut faire quoi dans votre PDV. Apprenez à configurer les rôles du personnel, à gérer les autorisations, et à utiliser la connexion par lien magique pour un accès rapide et sécurisé.",
    keywords: [
      'gestion du personnel PDV',
      'rôles du personnel PDV',
      'autorisations PDV',
      'connexion par lien magique',
      'connexion caissier',
      'gestion des utilisateurs PDV',
      'accès personnel commerce',
    ],
    keyTakeaways: [
      'AskBiz POS prend en charge trois rôles — Propriétaire, Gérant et Caissier — chacun avec des niveaux d’autorisation différents.',
      'La connexion par lien magique permet au personnel de se connecter en un seul geste, sans mot de passe à retenir ou à réinitialiser.',
      'Des autorisations précises protègent les opérations sensibles comme les remboursements, les annulations et les exports de données.',
    ],
    content: [
      {
        heading: 'Pourquoi les rôles du personnel comptent dans un PDV',
        body: "Lorsque vous êtes seul derrière la caisse, les autorisations n'ont pas d'importance — vous pouvez tout faire. Dès l'instant où vous embauchez une deuxième personne, tout change. Un vendeur du samedi devrait pouvoir traiter des ventes et imprimer des reçus, mais devrait-il pouvoir émettre des remboursements, annuler des transactions, ou exporter vos données de chiffre d'affaires ? Presque certainement pas. Les rôles du personnel vous permettent de définir précisément ce que chaque personne peut et ne peut pas faire dans le PDV. Cela protège votre entreprise des erreurs accidentelles (un stagiaire annulant par mégarde une journée entière de ventes) et des abus délibérés (un employé émettant des remboursements frauduleux). Cela simplifie également l'interface pour chaque utilisateur — un caissier ne voit que les écrans dont il a besoin, ce qui accélère la formation et réduit les erreurs.",
      },
      {
        heading: 'Les trois rôles dans AskBiz POS',
        body: "Propriétaire est le rôle de plus haut niveau, avec un accès sans restriction. Les propriétaires peuvent ajouter et retirer du personnel, modifier les prix, émettre des remboursements, accéder à tous les rapports, et exporter des données. Il devrait généralement y avoir un ou deux propriétaires par entreprise. Gérant se situe au milieu. Les gérants peuvent traiter les ventes, gérer les remboursements et les annulations, consulter les rapports quotidiens, et gérer les stocks — mais ils ne peuvent ni ajouter ni retirer d'autres membres du personnel, ni modifier les paramètres d'abonnement, ni accéder aux analyses globales de l'entreprise. C'est le rôle approprié pour un chef d'équipe de confiance ou un responsable de boutique. Caissier est le rôle le plus restreint. Les caissiers peuvent traiter les ventes, scanner les articles, accepter les paiements, et envoyer des reçus. Ils ne peuvent pas émettre de remboursements, annuler des transactions, consulter des rapports, ni accéder à des paramètres d'administration. C'est le rôle par défaut pour le personnel à temps partiel ou nouvellement embauché.",
      },
      {
        heading: 'La connexion par lien magique expliquée',
        body: "Les systèmes de PDV traditionnels utilisent des codes PIN ou des mots de passe pour la connexion du personnel. Les codes PIN se partagent, les mots de passe s'oublient, et on finit avec un post-it collé sur la caisse — ce qui va plutôt à l'encontre du contrôle d'accès. AskBiz POS utilise à la place la connexion par lien magique. Lorsqu'un membre du personnel doit se connecter, il saisit son adresse e-mail et reçoit un lien à usage unique par e-mail. En appuyant sur ce lien, il se connecte instantanément, avec le bon rôle et les bonnes autorisations déjà appliqués. Il n'y a rien à retenir, rien à partager, et le lien expire après une courte période, donc même s'il est intercepté, il ne peut pas être réutilisé. Pour plus de rapidité, le personnel qui utilise régulièrement le même appareil peut rester connecté d'un service à l'autre, la session expirant automatiquement après une période d'inactivité configurable.",
      },
      {
        heading: 'Configurer le personnel dans AskBiz POS',
        body: "Pour ajouter un membre du personnel, allez dans Paramètres du PDV et appuyez sur Ajouter du personnel. Saisissez son nom et son adresse e-mail, choisissez son rôle (Propriétaire, Gérant ou Caissier), et appuyez sur Inviter. Il recevra un e-mail avec un lien magique pour configurer sa session. Vous pouvez changer le rôle de quelqu'un à tout moment — utile lorsqu'un caissier est promu gérant, ou lorsque vous devez temporairement élever des autorisations pour un service spécifique. Retirer un membre du personnel révoque immédiatement son accès ; toute session active est interrompue. AskBiz consigne chaque changement de rôle dans la piste d'audit, afin que vous ayez toujours une trace de qui avait quel accès et à quel moment. Si vous exploitez plusieurs emplacements à l'avenir, le personnel pourra être affecté à des sites spécifiques avec des autorisations propres à chaque emplacement.",
      },
    ],
    faq: [
      {
        q: 'Un caissier peut-il voir le chiffre d’affaires réalisé par l’entreprise ?',
        a: "Non. Les caissiers ne voient que l'interface de vente. Les rapports de chiffre d'affaires, les analyses et les fonctions d'export sont réservés aux rôles Gérant et Propriétaire.",
      },
      {
        q: 'Que se passe-t-il si un membre du personnel perd l’accès à son e-mail ?',
        a: "Un propriétaire peut supprimer l'ancien e-mail et réinviter le membre du personnel avec une nouvelle adresse. Le changement est instantané et les anciens liens magiques cessent immédiatement de fonctionner.",
      },
    ],
  },

  'pos-camera-scanning': {
    title: 'Scan par appareil photo et reconnaissance de codes-barres dans AskBiz POS',
    description:
      "Découvrez comment AskBiz POS utilise l'appareil photo de votre téléphone pour scanner instantanément les codes-barres — sans lecteur dédié.",
    keywords: [
      'scan de codes-barres',
      'scan par appareil photo PDV',
      'lecteur de codes-barres téléphone',
      'code-barres AskBiz',
      'code-barres EAN',
      'scan UPC',
      'lecteur de codes-barres commerce',
    ],
    keyTakeaways: [
      "AskBiz POS utilise l'apprentissage automatique embarqué pour reconnaître les codes-barres via l'appareil photo de votre téléphone ou de votre tablette.",
      "Il prend en charge tous les formats de codes-barres courants du commerce, dont l'EAN-13, l'UPC-A, le Code 128 et les codes QR.",
      "Le scan par appareil photo élimine le coût d'un lecteur de codes-barres dédié pour la plupart des petits commerçants.",
    ],
    content: [
      {
        heading: 'Comment fonctionne le scan par appareil photo',
        body: "Lorsque vous appuyez sur le bouton de scan dans AskBiz POS, la caméra de votre appareil s'active et un viseur apparaît à l'écran. Pointez la caméra vers un code-barres — tenez-la à environ 15 à 30 centimètres de distance — et le système le reconnaît en moins d'une seconde. Il n'y a pas de déclencheur à presser ; la reconnaissance est continue et automatique. La technologie derrière cela est l'apprentissage automatique embarqué. Plutôt que d'envoyer une image à un serveur pour traitement (ce qui ajouterait de la latence et nécessiterait une connexion réseau), AskBiz traite le code-barres entièrement sur votre téléphone ou votre tablette. Cela signifie que le scan fonctionne même lorsque votre connexion internet est instable, ce qui est particulièrement utile pour les vendeurs de marché, les boutiques éphémères, et les lieux avec un Wi-Fi peu fiable. Une fois le code-barres reconnu, AskBiz le recherche dans votre catalogue de produits et ajoute l'article correspondant au panier.",
      },
      {
        heading: 'Formats de codes-barres pris en charge',
        body: "AskBiz POS prend en charge tous les formats de codes-barres couramment utilisés dans le commerce britannique. L'EAN-13 est la norme pour la plupart des produits de consommation vendus en Europe — c'est le numéro à treize chiffres que vous voyez sous les barres sur pratiquement tous les articles de supermarché. L'UPC-A est l'équivalent nord-américain et se trouve couramment sur les produits importés. Le Code 128 est utilisé pour les articles à poids variable, les étiquettes d'expédition, et les codes de stock internes. Les codes QR sont de plus en plus utilisés par les commerçants indépendants pour des produits personnalisés qui n'ont pas de code-barres fabricant. Si vous créez vos propres produits (pâtisseries, articles faits main, assortiments personnalisés), vous pouvez générer et imprimer des codes QR directement depuis AskBiz et les coller sur votre emballage. Le scanner les reconnaîtra aussi rapidement qu'un code-barres standard.",
      },
      {
        heading: 'Conseils pour un scan fiable',
        body: "Le scan par appareil photo est remarquablement fiable sur les téléphones modernes, mais quelques pratiques simples le rendent encore meilleur. D'abord, assurez un éclairage adéquat — la caméra doit voir clairement le code-barres, donc les environnements très sombres peuvent nécessiter une source de lumière à proximité. Ensuite, tenez l'appareil stable et légèrement incliné plutôt que parfaitement parallèle au code-barres ; cela réduit les reflets, surtout sur les emballages brillants. Troisièmement, gardez l'objectif de la caméra propre. Un objectif taché est la cause la plus fréquente d'une reconnaissance lente. Quatrièmement, si un code-barres est endommagé ou partiellement masqué, vous pouvez toujours recourir à la recherche manuelle — tapez les premières lettres du nom du produit et sélectionnez-le dans la liste. Enfin, pour les environnements à fort volume où la rapidité est essentielle (comme un stand de marché très fréquenté le samedi), envisagez d'associer un lecteur de codes-barres Bluetooth. Ce n'est pas obligatoire, mais cela permet de gagner une ou deux secondes par scan par rapport à la reconnaissance par caméra.",
      },
      {
        heading: 'Que se passe-t-il lorsqu’un code-barres n’est pas dans votre catalogue',
        body: "Si vous scannez un code-barres qu'AskBiz ne reconnaît pas, il vous invite à ajouter le produit. Vous saisissez le nom du produit, le prix, et la catégorie, et le code-barres est lié à ce produit de façon permanente. La prochaine fois que quelqu'un scanne le même code-barres, le produit apparaît instantanément. Cela rend la construction du catalogue organique — vous n'avez pas besoin de vous asseoir et de saisir des centaines de produits avant de commencer à vendre. De nombreux utilisateurs d'AskBiz construisent l'intégralité de leur catalogue simplement en scannant les articles à leur arrivée des fournisseurs. Au cours des première ou deux semaines de vente, le catalogue se remplit de lui-même. Vous pouvez également importer des produits en masse via un fichier CSV si vous préférez tout configurer à l'avance.",
      },
    ],
    faq: [
      {
        q: 'Le scan par appareil photo fonctionne-t-il sur les anciens téléphones ?',
        a: "Il fonctionne sur tout téléphone ou tablette doté d'une caméra prenant en charge les normes web modernes. Les appareils à partir de 2018 fonctionnent généralement bien. Les appareils très anciens peuvent scanner plus lentement.",
      },
      {
        q: 'Puis-je scanner plusieurs articles rapidement l’un après l’autre ?',
        a: "Oui. Après chaque scan réussi, AskBiz ajoute l'article au panier et réactive immédiatement le scanner. Vous pouvez scanner les articles aussi vite que vous pouvez pointer la caméra.",
      },
    ],
  },

  'pos-processing-a-sale': {
    title: 'Traiter une vente : du scan au reçu en moins de 60 secondes',
    description:
      "Parcourez étape par étape le processus d'encaissement complet d'AskBiz POS — scan, vérification du panier, paiement et reçu.",
    keywords: [
      'traiter une vente PDV',
      "processus d'encaissement PDV",
      'du scan au reçu',
      'processus de vente AskBiz',
      "rapidité d'encaissement commerce",
      'étapes de transaction PDV',
    ],
    keyTakeaways: [
      'Une vente complète dans AskBiz POS prend moins de soixante secondes, du premier scan à l’envoi du reçu.',
      "Le processus d'encaissement comporte quatre étapes : scanner, vérifier le panier, accepter le paiement, et émettre le reçu.",
      'Chaque vente met automatiquement à jour les stocks, le suivi du chiffre d’affaires, et les indicateurs de performance du personnel.',
    ],
    content: [
      {
        heading: 'Étape 1 — Scanner ou rechercher des articles',
        body: "La vente commence dès que le client pose des articles sur votre comptoir. Appuyez sur le bouton de scan pour activer votre caméra et pointez-la vers le premier code-barres. Le produit apparaît dans le panier en une seconde, affichant son nom, son prix et son statut de TVA. Pour les articles sans code-barres, appuyez sur l'icône de recherche et tapez les premières lettres du nom du produit — AskBiz utilise une correspondance approximative, donc vous n'avez pas besoin de l'orthographier parfaitement. Si un client veut plusieurs exemplaires du même article, vous pouvez soit scanner le code-barres plusieurs fois, soit appuyer sur le champ de quantité dans le panier et taper directement le nombre. Les deux méthodes sont rapides, mais pour de grandes quantités (disons, vingt du même article), taper le nombre est plus rapide. Vous pouvez combiner scan et recherche au sein de la même transaction — il n'y a pas de mode à basculer.",
      },
      {
        heading: 'Étape 2 — Vérifier et ajuster le panier',
        body: "Avant d'accepter le paiement, vous et le client pouvez vérifier le panier. AskBiz affiche chaque article avec son nom, son prix unitaire, sa quantité, et le total de la ligne. Le total en cours et la répartition de la TVA apparaissent en bas de l'écran. Si un client change d'avis, faites glisser un article pour le retirer ou appuyez sur la quantité pour l'ajuster. Besoin d'appliquer une remise ? Appuyez sur le bouton remise pour saisir un pourcentage ou un montant fixe — elle s'applique à l'ensemble du panier ou à des articles individuels, à votre choix. Le panier est également l'endroit où vous ajouteriez une note à la transaction (par exemple, « le client a demandé un emballage cadeau ») ou lieriez la vente à une fiche client existante pour le suivi de fidélité. Cette étape de vérification ne prend que quelques secondes pour un panier typique de trois à cinq articles, mais elle évite des erreurs qui nécessiteraient sinon un remboursement plus tard.",
      },
      {
        heading: 'Étape 3 — Accepter le paiement',
        body: "Appuyez sur le bouton Payer et AskBiz présente vos options de paiement. Les choix les plus courants sont les espèces et la carte, mais vous pouvez aussi répartir un paiement entre plusieurs moyens — par exemple, le client paie une partie en espèces et le reste par carte. Pour les paiements en espèces, saisissez le montant remis et AskBiz calcule la monnaie à rendre. Pour les paiements par carte, traitez la transaction via votre terminal de paiement comme d'habitude, puis confirmez dans AskBiz que le paiement a été reçu. AskBiz ne remplace pas votre terminal de paiement ; il enregistre le moyen de paiement aux côtés de la transaction pour vos registres. Si vous utilisez un prestataire de paiement par carte qui s'intègre à AskBiz (la prise en charge des principaux prestataires britanniques s'étend), la confirmation peut être automatique. Le point essentiel est qu'AskBiz doit connaître le moyen de paiement afin que vos rapports reflètent fidèlement le ratio espèces/carte.",
      },
      {
        heading: 'Étape 4 — Émettre le reçu',
        body: "Une fois le paiement confirmé, AskBiz génère un reçu. Vous avez trois options de remise. D'abord, vous pouvez l'afficher à l'écran — le client voit la liste détaillée et le total sur votre appareil, ce qui convient bien pour les transactions rapides où une trace papier n'est pas nécessaire. Ensuite, vous pouvez l'imprimer via une imprimante de reçus Bluetooth connectée. Enfin — et c'est l'option que la plupart des utilisateurs d'AskBiz préfèrent — vous pouvez envoyer le reçu directement sur le WhatsApp du client. Saisissez simplement son numéro de téléphone (ou sélectionnez-le dans votre liste de clients) et le reçu arrive sous forme de message WhatsApp mis en forme en quelques secondes. Les reçus numériques réduisent le gaspillage de papier, offrent au client une trace permanente qu'il ne peut pas perdre, et créent une opportunité d'engagement futur. Une fois le reçu émis, le panier se vide et AskBiz est prêt pour le client suivant.",
      },
    ],
    faq: [
      {
        q: 'Puis-je traiter une vente sans scanner de code-barres ?',
        a: "Oui. Vous pouvez rechercher des produits par nom, parcourir votre catalogue par catégorie, ou ajouter un article personnalisé avec un prix saisi manuellement. Le scan de codes-barres est la méthode la plus rapide, mais ce n'est pas la seule.",
      },
      {
        q: 'Que se passe-t-il si ma connexion internet coupe en pleine vente ?',
        a: "AskBiz POS dispose d'une capacité hors ligne. La vente se termine localement et se synchronise avec le cloud dès le retour de votre connexion. Vous ne perdrez pas la transaction.",
      },
    ],
  },

  'pos-cart-management': {
    title: 'Gestion du panier : ajouter, modifier et retirer des articles',
    description:
      "Maîtrisez le panier d'AskBiz POS — ajoutez des articles, ajustez les quantités, appliquez des remises, et gérez les changements d'avis des clients sans ralentir la file d'attente.",
    keywords: [
      'gestion du panier PDV',
      'modifier le panier PDV',
      'ajouter des articles PDV',
      'retirer des articles du panier',
      'remise PDV',
      'modification du panier commerce',
      "modifier les articles d'une vente",
    ],
    keyTakeaways: [
      'Le panier d’AskBiz POS se met à jour en temps réel au fur et à mesure que vous scannez, recherchez, ou ajoutez manuellement des produits.',
      'Vous pouvez ajuster les quantités, retirer des articles, et appliquer des remises à tout moment avant le paiement.',
      'Les modifications du panier se reflètent instantanément dans le total en cours et le calcul de la TVA.',
    ],
    content: [
      {
        heading: 'Ajouter des articles au panier',
        body: "Il existe trois façons d'ajouter des articles dans AskBiz POS. La plus rapide est le scan de codes-barres — appuyez sur le bouton de scan, pointez votre caméra, et le produit apparaît dans le panier. Deuxièmement, vous pouvez rechercher par nom à l'aide de la barre de recherche en haut de l'écran de vente. AskBiz utilise une correspondance approximative, donc taper « choc » fera apparaître « Brownie au chocolat », « Sachet de chocolat chaud », et tout ce qui contient ces lettres. Troisièmement, vous pouvez parcourir votre catalogue de produits par catégorie — utile lorsque vous connaissez la catégorie mais pas le nom exact. Chaque fois que vous ajoutez un article, il apparaît comme une nouvelle ligne dans le panier avec son nom, son prix unitaire, et une quantité fixée à un. Si vous scannez un article déjà présent dans le panier, la quantité s'incrémente automatiquement plutôt que d'ajouter une ligne en double. Le panier défile en douceur si vous avez une longue liste, et le total se met à jour instantanément à chaque ajout.",
      },
      {
        heading: 'Modifier les quantités et les prix',
        body: "Les clients changent d'avis. Ils veulent trois exemplaires d'un article au lieu d'un, ou ils décident finalement qu'ils ne veulent plus les chips. Dans AskBiz POS, appuyez sur le champ de quantité à côté de n'importe quel article et tapez directement le nouveau nombre — inutile d'appuyer plusieurs fois sur un bouton plus. Pour retirer un seul article, faites glisser la ligne vers la gauche et appuyez sur Supprimer, ou réglez la quantité à zéro. Si vous devez modifier un prix (par exemple, un article endommagé vendu à prix réduit), appuyez sur le champ prix et saisissez le nouveau montant. Les modifications de prix sont consignées dans la piste d'audit afin que vous puissiez les revoir plus tard et vous assurer qu'elles sont légitimes. Tous ces changements se produisent en temps réel : le total en cours, la répartition de la TVA, et le nombre d'articles se mettent à jour dès que vous effectuez une modification, afin que le client voie toujours un chiffre exact.",
      },
      {
        heading: 'Appliquer des remises',
        body: "AskBiz POS prend en charge deux types de remises : en pourcentage et à montant fixe. Une remise en pourcentage réduit le prix d'une proportion définie — par exemple, 10 % de réduction. Une remise à montant fixe réduit le prix d'un chiffre précis — disons, 2 £ de réduction. Vous pouvez appliquer des remises à des articles individuels ou à l'ensemble du panier. Pour appliquer une remise au niveau d'un article, appuyez sur l'article dans le panier et sélectionnez Remise. Pour appliquer une remise au niveau du panier, appuyez sur le bouton remise sous le total du panier. Les remises sont clairement indiquées sur le reçu afin que le client voie ce qu'il a économisé, et elles sont enregistrées dans vos données de vente afin que vous puissiez analyser combien vous accordez de remises et si cela génère du volume supplémentaire. Si vous organisez des promotions régulières (comme « achetez-en deux, obtenez 10 % de réduction »), vous pouvez configurer des modèles de remise réutilisables afin que votre personnel n'ait pas à calculer les pourcentages sur place.",
      },
      {
        heading: 'Gérer des scénarios de panier complexes',
        body: "Le commerce réel amène des situations qu'un panier basique ne gère pas bien. Un client veut diviser son achat en deux transactions — peut-être l'une payée personnellement et l'autre sur une carte professionnelle. Dans AskBiz, vous pouvez mettre en attente le panier en cours (en le sauvegardant temporairement), commencer une nouvelle transaction, puis revenir au panier en attente ensuite. Un autre scénario courant est celui d'un client qui se rend compte en plein encaissement qu'il a oublié un article et court le chercher au rayon. Vous n'avez pas besoin d'annuler la transaction — le panier attend patiemment qu'il rapporte l'article, et vous l'ajoutez à son retour. Si vous devez ajouter une note à la transaction (par exemple, « le client a demandé un reçu TVA par e-mail »), appuyez sur le champ Notes en bas du panier. Les notes sont associées à la transaction et visibles dans votre piste d'audit et vos rapports.",
      },
    ],
    faq: [
      {
        q: 'Puis-je sauvegarder un panier et y revenir plus tard ?',
        a: "Oui. AskBiz POS dispose d'une fonction de « mise en attente du panier » qui sauvegarde la transaction en cours. Vous pouvez commencer une nouvelle vente, puis revenir au panier en attente quand vous êtes prêt. C'est utile pour les clients qui doivent s'absenter brièvement.",
      },
      {
        q: 'Y a-t-il une limite au nombre d’articles que je peux ajouter à un panier ?',
        a: "Il n'y a pas de limite pratique. Le panier prend en charge des centaines de lignes d'articles, bien que la plupart des transactions commerciales en comptent moins de vingt.",
      },
    ],
  },

  'pos-cash-vs-card-payments': {
    title: 'Espèces contre carte : choisir la bonne combinaison pour votre entreprise',
    description:
      "Devriez-vous passer au tout-numérique ? Accepter les deux ? Voici comment réfléchir aux moyens de paiement, aux frais de traitement, et à ce que vos clients préfèrent réellement.",
    keywords: [
      'espèces contre carte',
      'moyens de paiement commerce',
      'frais de traitement carte Royaume-Uni',
      'entreprise sans espèces',
      'accepter les paiements par carte',
      'combinaison de paiement commerce',
      'paiement sans contact Royaume-Uni',
    ],
    keyTakeaways: [
      'Les paiements par carte représentent désormais plus de 80 % des transactions commerciales britanniques, mais les espèces restent importantes pour certains segments de clientèle.',
      'Les frais de traitement des cartes se situent généralement entre 1,2 % et 2,5 % par transaction — tenez-en compte dans votre tarification.',
      'AskBiz POS suit votre ratio espèces/carte afin que vous puissiez prendre des décisions fondées sur les données concernant les moyens de paiement.',
    ],
    content: [
      {
        heading: 'Le paysage des paiements au Royaume-Uni en 2026',
        body: "Le Royaume-Uni s'est résolument tourné vers les paiements par carte et sans contact. Selon les données d'UK Finance, les cartes de débit ont dépassé les espèces comme moyen de paiement le plus courant en 2017, et l'écart s'est creusé chaque année depuis. Le sans contact à lui seul représente désormais la majorité des transactions par carte, avec un plafond par transaction relevé à 100 £ en 2021 et largement adopté depuis. Les portefeuilles mobiles — Apple Pay, Google Pay, et Samsung Pay — ont ajouté une couche supplémentaire, permettant aux clients de payer avec leur téléphone ou leur montre. Pour la plupart des commerçants urbains, passer entièrement au sans-espèces est désormais réalisable. Cependant, environ un adulte britannique sur dix dépend encore principalement des espèces, et cette proportion est plus élevée chez les clients plus âgés, ceux sans compte bancaire, et dans certaines zones rurales. Si votre clientèle inclut ces groupes, refuser les espèces revient à renoncer à du chiffre d'affaires.",
      },
      {
        heading: 'Comprendre les frais de traitement des cartes',
        body: "Chaque transaction par carte vous coûte de l'argent. Un paiement par carte implique au moins trois parties en plus de vous et du client : le réseau de cartes (Visa, Mastercard), la banque émettrice (la banque du client), et la banque acquéreuse ou le prestataire de paiement (votre fournisseur de services). Chacun prélève une petite part. Pour une petite entreprise britannique typique, attendez-vous à payer entre 1,2 % et 2,5 % par transaction, selon votre prestataire, votre volume, et le type de carte utilisé. Les cartes premium et professionnelles entraînent des frais d'interchange plus élevés que les cartes de débit standards. Certains prestataires facturent des frais fixes par transaction en plus du pourcentage. Pour les petits montants (moins de 5 £), les frais peuvent absorber une part significative de votre marge — c'est pourquoi certains petits cafés préfèrent encore les espèces pour les petits achats. AskBiz POS enregistre le moyen de paiement de chaque transaction, ce qui vous permet de calculer précisément combien vous payez en frais de traitement chaque mois.",
      },
      {
        heading: 'Les arguments en faveur du tout-numérique',
        body: "Les espèces ont des coûts cachés que de nombreux petits commerçants sous-estiment. Compter la caisse prend du temps au début et à la fin de chaque service. Les erreurs de manipulation d'espèces entraînent des écarts difficiles à tracer. Les trajets de dépôt en banque consomment du temps et présentent un risque de sécurité. Les espèces sont également plus difficiles à réconcilier à des fins fiscales — HMRC s'intéresse de plus près aux entreprises à forte utilisation d'espèces précisément parce qu'elles sont plus difficiles à suivre. Passer au sans-espèces élimine tous ces problèmes. Votre caisse est toujours équilibrée au centime près car chaque transaction a une trace numérique. La réconciliation est automatique. Le risque de vol diminue car il n'y a rien de physique à voler. Et votre comptable dispose d'une trace numérique parfaite pour chaque vente. La contrepartie est le frais de traitement sur chaque transaction, mais de nombreuses entreprises constatent que les économies de temps et de risque compensent le coût.",
      },
      {
        heading: 'Trouver la bonne combinaison pour votre entreprise',
        body: "La meilleure approche pour la plupart des petites entreprises britanniques est d'accepter à la fois les espèces et la carte, mais d'optimiser en fonction de ce que vos clients préfèrent. AskBiz POS vous donne les données pour prendre cette décision. Après un mois de vente, consultez la répartition de vos moyens de paiement dans la section rapports. Si 90 % de vos ventes se font par carte, l'infrastructure et le temps que vous consacrez à la gestion des espèces ne se justifient peut-être plus. Si 30 % de vos ventes se font en espèces — peut-être parce que vous servez un marché où de nombreux clients préfèrent les espèces — alors les supprimer signifierait perdre près d'un tiers de votre chiffre d'affaires. Certaines entreprises adoptent une approche hybride : elles acceptent les deux moyens mais offrent une petite incitation (comme un tampon de fidélité) pour les paiements par carte, faisant progressivement évoluer les comportements sans s'aliéner les clients en espèces. Quelle que soit votre décision, affichez clairement votre politique à la caisse afin que les clients sachent à quoi s'attendre avant d'arriver au comptoir.",
      },
    ],
    faq: [
      {
        q: 'Puis-je fixer un montant minimum pour les paiements par carte ?',
        a: "Légalement, vous pouvez fixer un montant minimum de transaction pour les paiements par carte au Royaume-Uni. Cependant, cela peut frustrer les clients et pourrait ne pas être conforme aux conditions de votre prestataire de paiement. Vérifiez votre contrat marchand avant d'en instaurer un.",
      },
      {
        q: 'AskBiz POS s’intègre-t-il à mon terminal de paiement ?',
        a: "AskBiz POS enregistre le moyen de paiement aux côtés de la vente. Pour certains prestataires, cela peut être automatique. Pour d'autres, vous confirmez le moyen manuellement après que le terminal a approuvé le paiement. Consultez la page des intégrations pour votre prestataire spécifique.",
      },
    ],
  },

  'pos-whatsapp-receipts': {
    title: 'Reçus WhatsApp : envoyez une preuve d’achat numérique instantanément',
    description:
      "Remplacez les reçus papier par des messages WhatsApp. Découvrez comment AskBiz POS envoie des reçus numériques mis en forme directement sur le téléphone de votre client.",
    keywords: [
      'reçus WhatsApp',
      'reçus numériques PDV',
      'envoyer un reçu par WhatsApp',
      'reçus sans papier',
      'reçu AskBiz',
      'reçu électronique Royaume-Uni',
      'preuve d’achat numérique',
    ],
    keyTakeaways: [
      'AskBiz POS peut envoyer un reçu entièrement détaillé à n’importe quel numéro WhatsApp en quelques secondes.',
      'Les reçus numériques réduisent le gaspillage de papier, ne peuvent pas être perdus, et créent un canal de communication avec le client.',
      'Les clients n’ont rien besoin d’installer — le reçu arrive sous forme de message WhatsApp standard.',
    ],
    content: [
      {
        heading: 'Comment fonctionnent les reçus WhatsApp dans AskBiz POS',
        body: "Une fois la vente terminée, AskBiz vous donne la possibilité d'envoyer le reçu via WhatsApp. Appuyez sur l'icône WhatsApp, saisissez le numéro de téléphone du client (ou sélectionnez-le dans votre liste de clients s'il est déjà enregistré), et AskBiz compose un message mis en forme contenant le reçu complet : date, heure, nom de la boutique, chaque article avec prix et quantité, remises appliquées, répartition de la TVA, total payé, et moyen de paiement. Le message est envoyé via le protocole de partage de WhatsApp, qui ouvre WhatsApp sur votre appareil avec le message déjà rédigé. Un seul geste suffit pour l'envoyer. L'ensemble du processus ajoute environ cinq secondes à la transaction — bien moins de temps qu'à manipuler une imprimante de reçus. Comme il utilise la messagerie WhatsApp standard, le client n'a besoin d'installer aucune application spéciale, de créer un compte, ni de scanner de code QR. S'il a WhatsApp — et plus de 75 % des adultes britanniques l'ont — cela fonctionne simplement.",
      },
      {
        heading: 'Pourquoi les reçus numériques sont meilleurs pour vos clients',
        body: "Les reçus papier ont tendance à finir dans la machine à laver, la poubelle, ou au fond d'un sac à main où ils s'effacent jusqu'à devenir illisibles. Un reçu numérique vit en permanence dans la conversation WhatsApp du client. S'il doit retourner un article trois semaines plus tard, il peut chercher dans ses messages et retrouver le reçu en quelques secondes. Cela réduit également les litiges de votre côté — vous passez moins de temps à essayer de vérifier des achats lorsque le client a déjà une preuve claire. Les reçus numériques donnent aussi une image plus moderne et professionnelle. Pour une petite entreprise indépendante, envoyer un reçu WhatsApp bien présenté signale que vous prenez votre activité au sérieux et utilisez de vrais systèmes. C'est un petit détail, mais les clients le remarquent. Certains utilisateurs d'AskBiz rapportent que le reçu WhatsApp est devenu un sujet de conversation avec les clients — les gens apprécient la commodité et demandent comment cela fonctionne.",
      },
      {
        heading: 'Avantages pour votre entreprise',
        body: "Au-delà de la commodité pour le client, les reçus numériques vous font économiser de l'argent et génèrent des données. Les rouleaux de papier pour imprimante de reçus représentent un coût récurrent qui s'accumule sur des milliers de transactions. Le papier thermique n'est pas recyclable dans la plupart des filières de collecte locales britanniques, il y a donc aussi un aspect environnemental. Plus important encore, lorsqu'un client fournit son numéro de téléphone pour un reçu WhatsApp, vous disposez d'un canal de communication. Vous pouvez faire un suivi avec un message de remerciement, l'informer de promotions, ou lui envoyer des alertes de réapprovisionnement pour des articles qu'il a achetés précédemment — le tout dans le respect des directives de messagerie professionnelle de WhatsApp. AskBiz suit quels clients ont reçu des reçus WhatsApp et relie ces reçus à leur historique de transactions, construisant ainsi au fil du temps un profil client plus riche. Ces données alimentent votre intelligence client, vous aidant à comprendre les habitudes et préférences d'achat.",
      },
      {
        heading: 'Configurer les reçus WhatsApp',
        body: "La configuration nécessite très peu d'étapes. Dans Paramètres du PDV, activez Reçus WhatsApp et personnalisez le modèle de reçu avec le nom de votre entreprise, son adresse, et tout message de bas de page que vous souhaitez inclure (comme votre politique de retour ou un mot de remerciement). Vous pouvez aussi ajouter votre logo, qui apparaîtra en haut du reçu. Lors du traitement d'une vente, l'option WhatsApp apparaît aux côtés des autres moyens de remise du reçu. Si vous préférez faire de WhatsApp l'option par défaut, vous pouvez le définir dans les préférences — l'invite d'envoi proposera alors WhatsApp par défaut plutôt que l'impression. Pour les clients réguliers, AskBiz mémorise leur numéro de téléphone, donc vous n'avez besoin de le saisir qu'une seule fois. Le personnel de tous les niveaux de rôle (Caissier, Gérant, Propriétaire) peut envoyer des reçus WhatsApp, car cela fait partie du parcours de vente de base.",
      },
    ],
    faq: [
      {
        q: 'L’envoi de reçus WhatsApp coûte-t-il quelque chose ?',
        a: "AskBiz ne facture rien. Les tarifs standards de messagerie WhatsApp s'appliquent, gratuits pour la plupart des utilisateurs en Wi-Fi ou avec un forfait data incluant les données. Aucune API WhatsApp Business n'est requise.",
      },
      {
        q: 'Les clients peuvent-ils refuser les reçus WhatsApp ?',
        a: "Absolument. Le reçu WhatsApp est toujours facultatif. Si un client ne veut pas de reçu numérique, vous pouvez en imprimer un, l'afficher à l'écran, ou vous passer entièrement de reçu.",
      },
      {
        q: 'L’envoi d’un reçu via WhatsApp est-il conforme au RGPD ?',
        a: "Oui, à condition d'avoir une base légitime pour le traitement des données. L'envoi d'un reçu fait partie de l'exécution de la transaction de vente. Vous devriez inclure un avis de confidentialité dans votre boutique ou sur votre site web expliquant comment les données des clients sont utilisées.",
      },
    ],
  },

  'pos-daily-revenue-tracking': {
    title: 'Suivi du chiffre d’affaires quotidien : connaissez vos chiffres avant midi',
    description:
      "Arrêtez de deviner combien vous avez gagné aujourd'hui. AskBiz POS vous donne des chiffres de chiffre d'affaires quotidiens en direct, des répartitions espèces/carte, et des comparaisons de tendances.",
    keywords: [
      'suivi du chiffre d’affaires quotidien',
      'rapport de chiffre d’affaires PDV',
      'rapport de ventes quotidien',
      'suivi du chiffre d’affaires commerce',
      'recettes quotidiennes PDV',
      'tableau de bord des ventes PDV',
      'suivre les ventes quotidiennes',
    ],
    keyTakeaways: [
      'AskBiz POS affiche le chiffre d’affaires quotidien en direct dès que vous traitez la première vente de la journée.',
      'Le chiffre d’affaires est réparti par moyen de paiement, membre du personnel, et catégorie de produits.',
      'Comparer la performance du jour à celle du même jour la semaine dernière vous aide à repérer les tendances tôt.',
    ],
    content: [
      {
        heading: 'Pourquoi la visibilité du chiffre d’affaires quotidien compte',
        body: "Dans le commerce traditionnel, de nombreux commerçants ne connaissent leur véritable chiffre d'affaires quotidien qu'au moment où la caisse est comptée à la fermeture. Cela fait douze heures de vente dans le noir. Avec AskBiz POS, le chiffre d'affaires se met à jour en temps réel après chaque transaction. En milieu de matinée, vous savez si aujourd'hui est en avance ou en retard par rapport à votre moyenne. À l'heure du déjeuner, vous avez assez de données pour prendre des décisions : devriez-vous lancer une promotion l'après-midi ? Retirer un produit qui se vend mal de la vitrine ? Ajuster les effectifs pour le reste du service ? Ce type de visibilité en cours de journée était autrefois réservé aux enseignes possédant des plateformes d'analyse coûteuses. AskBiz le met sur votre téléphone. L'écran du chiffre d'affaires quotidien se trouve à un geste de l'interface de vente, donc consulter vos chiffres prend des secondes, pas des minutes.",
      },
      {
        heading: 'Ce que montre l’écran du chiffre d’affaires quotidien',
        body: "L'écran du chiffre d'affaires quotidien dans AskBiz POS affiche un total courant de toutes les ventes traitées aujourd'hui, réparti par moyen de paiement (espèces, carte, ou mixte). Sous le total, vous voyez une répartition par catégorie de produits — vous pouvez ainsi constater d'un coup d'œil que les boissons chaudes se vendent deux fois plus que les boissons froides, ou que les accessoires connaissent une journée calme. Il y a aussi une répartition par membre du personnel, précieuse si vous avez plusieurs personnes à la caisse. L'écran comprend une comparaison avec le même jour la semaine dernière et le même jour le mois dernier. Si nous sommes mardi, vous voyez le chiffre d'affaires du mardi précédent à côté du chiffre du jour, ce qui vous donne un contexte immédiat. Une flèche verte signifie que vous êtes en avance ; une flèche rouge signifie que vous êtes en retard. En bas, AskBiz affiche la valeur moyenne des transactions et le nombre total de transactions, ce qui vous aide à distinguer entre quelques grosses ventes et de nombreuses petites.",
      },
      {
        heading: 'Utiliser les données quotidiennes pour de meilleures décisions',
        body: "La véritable puissance du suivi du chiffre d'affaires quotidien ne réside pas seulement dans la connaissance du chiffre — elle réside dans le fait d'agir en conséquence. Voici des exemples concrets. Si votre chiffre d'affaires à 11h est inférieur de 40 % à celui de la même heure la semaine dernière, quelque chose a changé. La fréquentation a-t-elle baissé ? Un concurrent a-t-il ouvert à proximité ? La météo garde-t-elle les gens chez eux ? Vous pouvez enquêter et réagir. Si votre ratio carte/espèces a changé radicalement, vous avez peut-être un problème de terminal de paiement à vérifier. Si un membre du personnel génère systématiquement des valeurs moyennes de transaction plus élevées, vous pouvez apprendre ce qu'il fait différemment et former les autres à faire de même. AskBiz fait apparaître ces tendances automatiquement grâce à son moteur d'analyse, mais même un coup d'œil rapide à l'écran du chiffre d'affaires quotidien vous en apprendra plus sur la santé de votre entreprise que d'attendre la fin du mois pour examiner vos relevés bancaires.",
      },
      {
        heading: 'Résumé et rapport de fin de journée',
        body: "À la fin de la journée de vente — ou dès que vous décidez de fermer la caisse — AskBiz génère un résumé complet de fin de journée. Cela inclut le chiffre d'affaires total, le nombre de transactions, la valeur moyenne des transactions, la répartition des moyens de paiement, le chiffre d'affaires par catégorie, le chiffre d'affaires par membre du personnel, les remboursements traités, et les remises accordées. Vous pouvez consulter ce résumé à l'écran, vous l'envoyer par e-mail, ou l'exporter en CSV pour votre comptable. Si vous gérez les espèces dans votre caisse, AskBiz peut comparer le montant d'espèces attendu (basé sur les transactions en espèces traitées) avec votre montant compté afin d'identifier tout écart. Ce processus de clôture de caisse prend quelques minutes plutôt que la demi-heure que de nombreux commerçants passent à pointer manuellement les reçus par rapport au contenu de la caisse. Au fil du temps, les résumés quotidiens alimentent des rapports de tendances hebdomadaires et mensuels, vous donnant une vision de plus en plus claire de la trajectoire de votre entreprise.",
      },
    ],
    faq: [
      {
        q: 'Puis-je consulter le chiffre d’affaires quotidien depuis mon téléphone en dehors de la boutique ?',
        a: "Oui. AskBiz est basé sur le cloud, vous pouvez donc consulter le chiffre d'affaires en direct depuis n'importe quel appareil avec vos identifiants. De nombreux propriétaires vérifient les chiffres depuis chez eux le soir.",
      },
      {
        q: 'Le chiffre d’affaires quotidien inclut-il les remboursements ?',
        a: "Les remboursements sont déduits du total quotidien pour afficher le chiffre d'affaires net. Vous pouvez également voir le chiffre d'affaires brut et le total des remboursements séparément dans la répartition détaillée.",
      },
    ],
  },

  'pos-inventory-management': {
    title: 'Gestion des stocks du PDV : niveaux de stock, alertes et réapprovisionnement',
    description:
      "Gardez vos rayons pleins et votre trésorerie saine. Découvrez comment AskBiz POS suit les stocks en temps réel et vous indique précisément quand réapprovisionner.",
    keywords: [
      'gestion des stocks PDV',
      'suivi des stocks PDV',
      'alertes de stock',
      'gestion des stocks commerce',
      'alertes de réapprovisionnement',
      'niveaux de stock en temps réel',
      'contrôle des stocks petite entreprise',
    ],
    keyTakeaways: [
      'AskBiz POS déduit le stock automatiquement à chaque vente, gardant votre compte de stock précis en temps réel.',
      'Vous pouvez définir des seuils de réapprovisionnement pour chaque produit afin qu’AskBiz vous alerte avant la rupture.',
      'Des données de stock précises vous aident à éviter à la fois les ruptures de stock (ventes perdues) et le surstockage (trésorerie immobilisée).',
    ],
    content: [
      {
        heading: 'Comment fonctionne le suivi des stocks en temps réel',
        body: "Chaque fois que vous traitez une vente dans AskBiz POS, les articles vendus sont automatiquement déduits de votre compte de stock. Il n'y a aucune étape manuelle — dès que la transaction est confirmée, les niveaux de stock se mettent à jour. Si vous vendez trois unités du Produit A, votre compte de stock diminue de trois. Si un remboursement est traité et que l'article est remis en stock, le compte augmente. Cela se produit simultanément sur tous les appareils, donc si deux personnes vendent sur des tablettes séparées, elles voient toutes deux les mêmes niveaux de stock à jour. La précision que cela offre est transformatrice pour les petits commerçants qui, traditionnellement, dépendaient d'inventaires périodiques. Au lieu de découvrir que votre meilleure vente est en rupture de stock depuis trois jours (et d'avoir perdu un nombre inconnu de ventes), vous savez à l'instant où le stock atteint zéro. Mieux encore, vous pouvez configurer des alertes pour être prévenu avant que cela n'arrive.",
      },
      {
        heading: 'Configurer les seuils de réapprovisionnement et les alertes',
        body: "Un seuil de réapprovisionnement est le niveau de stock auquel vous devez passer une nouvelle commande auprès de votre fournisseur. Le bon niveau dépend de la rapidité de vente de l'article et du délai de livraison de votre fournisseur. Par exemple, si vous vendez dix unités du Produit B par semaine et que votre fournisseur met deux semaines à livrer, votre seuil de réapprovisionnement devrait être d'au moins vingt unités — vingt unités de stock tampon pour couvrir le délai de livraison. Dans AskBiz, vous définissez le seuil de réapprovisionnement pour chaque produit dans les paramètres de stock. Lorsque le stock atteint ce niveau, vous recevez une alerte — soit dans l'application, par e-mail, ou les deux. Vous pouvez également définir un niveau critique (le point où vous êtes sur le point d'être en rupture) pour une notification plus urgente. AskBiz peut suggérer des seuils de réapprovisionnement basés sur votre vitesse de vente historique, éliminant les incertitudes du calcul.",
      },
      {
        heading: 'Réception de stock et ajustements',
        body: "Lorsqu'une nouvelle livraison arrive de votre fournisseur, vous devez ajouter ces articles à votre stock. Dans AskBiz, allez dans la section Stocks, trouvez le produit, et appuyez sur Recevoir le stock. Saisissez la quantité reçue et le prix de revient (s'il a changé). Le compte de stock se met à jour immédiatement. Si vous découvrez un écart lors d'un inventaire physique — peut-être que certains articles ont été endommagés, volés, ou mal comptés — vous pouvez effectuer un ajustement de stock manuel. Saisissez la raison de l'ajustement (dommage, vol, erreur de comptage) et AskBiz consigne le changement dans la piste d'audit. Ces ajustements sont importants pour maintenir la précision et pour identifier des tendances : si un produit particulier subit régulièrement des pertes de stock inexpliquées, cela peut indiquer un problème de vol ou un souci d'emballage causant des dommages.",
      },
      {
        heading: 'Utiliser les données de stock pour améliorer la trésorerie',
        body: "Le stock, c'est de la trésorerie posée sur vos rayons. Chaque produit que vous possédez mais n'avez pas vendu représente de l'argent qui pourrait générer des intérêts, rembourser une dette, ou financer la croissance. AskBiz vous aide à trouver l'équilibre entre avoir assez de stock pour répondre à la demande et ne pas immobiliser trop de trésorerie. Le tableau de bord des stocks vous montre les taux d'écoulement (la vitesse à laquelle chaque produit se vend), les jours de stock restants, et le stock dormant (les produits qui ne se sont pas vendus depuis trente jours ou plus). Si un produit a quatre-vingt-dix jours de stock restant selon la vitesse de vente actuelle, vous avez presque certainement trop commandé. Si un autre produit a trois jours de stock restant, vous devez réapprovisionner de toute urgence. AskBiz fait apparaître les deux extrêmes afin que vous puissiez agir : démarquer les articles à rotation lente pour libérer de la trésorerie, et accélérer les réapprovisionnements de vos meilleures ventes.",
      },
    ],
    faq: [
      {
        q: 'Puis-je gérer le stock de produits sans code-barres ?',
        a: "Oui. Chaque produit dans AskBiz dispose d'un compte de stock, qu'il ait un code-barres ou non. Vous pouvez suivre le stock des articles à code-barres, des articles saisis manuellement, et des produits personnalisés de la même manière.",
      },
      {
        q: 'AskBiz prend-il en charge les stocks sur plusieurs emplacements ?',
        a: "La gestion des stocks multi-sites figure sur notre feuille de route. Actuellement, le stock est suivi au niveau du compte. Si vous opérez depuis plusieurs sites, vous pouvez utiliser des catalogues de produits séparés ou ajouter des étiquettes de site aux noms de produits comme solution provisoire.",
      },
    ],
  },

  'pos-low-stock-alerts': {
    title: 'Alertes de stock faible et de rupture de stock : ne manquez jamais un réapprovisionnement',
    description:
      "Configurez des notifications automatiques lorsque le stock devient faible. AskBiz POS vous alerte avant que vos meilleures ventes ne s'épuisent.",
    keywords: [
      'alertes de stock faible',
      'notification de rupture de stock',
      'alerte de réapprovisionnement PDV',
      'système d’alerte de stock',
      'avertissement de niveau de stock',
      'notification de réapprovisionnement',
      'ne jamais être en rupture de stock',
    ],
    keyTakeaways: [
      'AskBiz POS envoie des alertes lorsque le stock atteint votre seuil de réapprovisionnement prédéfini ou tombe à zéro.',
      'Les alertes peuvent être envoyées dans l’application, par e-mail, ou les deux — garantissant que vous ne manquiez jamais un réapprovisionnement critique.',
      'Un réapprovisionnement à temps évite les ventes perdues et maintient une satisfaction client élevée.',
    ],
    content: [
      {
        heading: 'Le coût d’une rupture de stock',
        body: "Une rupture de stock n'est pas seulement une vente manquée — c'est une relation manquée. Quand un client entre dans votre boutique à la recherche d'un produit précis et que vous ne l'avez pas, il l'achète ailleurs. Si cela se produit deux fois, il cesse complètement de venir chez vous. Les études montrent systématiquement que les ruptures de stock sont l'une des principales raisons pour lesquelles les clients se tournent vers des concurrents dans le commerce physique. Au-delà de la perte directe de chiffre d'affaires, il y a le coût de réputation : votre boutique paraît mal gérée si les rayons sont vides. AskBiz POS est conçu pour éviter cela en vous donnant une visibilité sur les niveaux de stock et en vous alertant bien avant d'atteindre zéro. L'objectif est simple — aucun client ne devrait jamais entendre « désolé, nous n'en avons plus » si une commande passée à temps aurait pu l'éviter.",
      },
      {
        heading: 'Comment fonctionnent les alertes dans AskBiz POS',
        body: "AskBiz utilise un système d'alerte à deux niveaux. Le premier niveau est l'alerte de réapprovisionnement, déclenchée lorsque le stock atteint le seuil de réapprovisionnement que vous avez défini pour ce produit. C'est votre signal pour passer commande auprès de votre fournisseur. Le seuil de réapprovisionnement doit tenir compte du délai de livraison de votre fournisseur — si la livraison prend cinq jours et que vous vendez deux unités par jour, fixez le seuil à au moins dix. Le second niveau est l'alerte critique, déclenchée lorsque le stock atteint un niveau dangereusement bas (vous définissez ce que signifie « dangereusement bas » pour chaque produit). C'est votre signal que vous êtes sur le point d'être en rupture et que vous devez soit accélérer une commande, soit retirer le produit de l'affichage pour réserver le stock restant aux clients importants. Les deux alertes peuvent être envoyées sous forme de notifications dans l'application, par e-mail, ou les deux. Les propriétaires et les gérants reçoivent les alertes par défaut ; les caissiers non, afin d'éviter de surcharger de notifications le personnel de première ligne.",
      },
      {
        heading: 'Suggestions intelligentes de réapprovisionnement',
        body: "Définir manuellement des seuils de réapprovisionnement pour chaque produit est fastidieux, surtout si vous gérez des centaines de références. AskBiz peut suggérer des seuils de réapprovisionnement basés sur votre historique de ventes. Il analyse la vitesse à laquelle chaque produit se vend (la vitesse de vente), comment cette vitesse varie selon le jour de la semaine ou la saison, et le temps qu'ont pris les précédents réapprovisionnements. À partir de ces données, il calcule un seuil de réapprovisionnement recommandé qui équilibre le risque de rupture de stock contre le coût de détention d'un excédent de stock. Vous pouvez accepter la suggestion, l'ajuster, ou définir votre propre niveau. Pour les nouveaux produits sans historique de ventes, AskBiz applique par défaut un seuil de réapprovisionnement prudent que vous pouvez affiner à mesure que les données s'accumulent. Les suggestions s'améliorent avec le temps à mesure qu'AskBiz apprend vos habitudes de vente et les délais de livraison de vos fournisseurs.",
      },
      {
        heading: 'Agir efficacement sur les alertes',
        body: "Une alerte n'est utile que si vous agissez rapidement. AskBiz facilite cela en incluant le contexte dans chaque alerte. Lorsque vous recevez une notification de stock faible, elle vous indique le niveau de stock actuel, les ventes moyennes journalières, le nombre de jours estimés avant la rupture, et le dernier prix de revient du produit. Vous disposez de suffisamment d'informations pour passer commande immédiatement sans avoir besoin de rechercher quoi que ce soit. Si vous utilisez régulièrement les mêmes fournisseurs, vous pouvez intégrer leurs coordonnées dans AskBiz afin qu'en appuyant sur « Réapprovisionner » depuis une alerte, un bon de commande soit préparé et que vous puissiez l'envoyer directement. Cela réduit le délai entre l'alerte et la commande, de plusieurs heures (voire plusieurs jours si l'alerte se perd dans votre boîte de réception) à quelques minutes. Moins il y a d'étapes entre la notification et l'action, moins votre entreprise connaîtra de ruptures de stock.",
      },
    ],
    faq: [
      {
        q: 'Puis-je définir des seuils d’alerte différents pour différents produits ?',
        a: "Oui. Chaque produit a son propre seuil de réapprovisionnement et son propre niveau critique. Un produit qui se vend vite peut avoir un seuil de réapprovisionnement de cinquante unités, tandis qu'un produit à rotation lente peut être fixé à cinq.",
      },
      {
        q: 'Les alertes fonctionnent-elles si je ne suis pas connecté au PDV ?',
        a: "Oui. Les alertes par e-mail sont envoyées que vous soyez connecté ou non. Les notifications dans l'application apparaissent la prochaine fois que vous ouvrez AskBiz.",
      },
      {
        q: 'Puis-je désactiver les alertes pour des produits spécifiques ?',
        a: "Oui. Si vous avez des articles que vous laissez délibérément s'épuiser (des produits saisonniers, par exemple), vous pouvez désactiver les alertes pour ces articles individuellement.",
      },
    ],
  },

  'pos-refunds-guide': {
    title: 'Gérer les remboursements : total, partiel, et tout ce qui se trouve entre les deux',
    description:
      "Les remboursements font partie du quotidien du commerce. Apprenez à traiter les remboursements totaux et partiels dans AskBiz POS tout en gardant des registres impeccables.",
    keywords: [
      'remboursements PDV',
      'traiter un remboursement PDV',
      'remboursement partiel commerce',
      'guide du remboursement total',
      'remboursement AskBiz',
      'retour et remboursement PDV',
      'droits des consommateurs remboursement Royaume-Uni',
    ],
    keyTakeaways: [
      'AskBiz POS prend en charge les remboursements totaux, partiels, et par article — tous liés à la transaction d’origine.',
      'Les autorisations de remboursement sont réservées aux rôles Gérant et Propriétaire afin de prévenir les abus.',
      'Chaque remboursement est consigné dans la piste d’audit avec la raison, le montant, le membre du personnel, et l’horodatage.',
    ],
    content: [
      {
        heading: 'Comprendre vos obligations de remboursement au Royaume-Uni',
        body: "Avant d'aborder la mécanique, il vaut la peine de comprendre votre position légale. En vertu du Consumer Rights Act 2015, les clients ont droit à un remboursement si un produit est défectueux, non conforme à sa description, ou impropre à l'usage. Pour les articles défectueux, ce droit dure jusqu'à trente jours pour un remboursement intégral et jusqu'à six mois pour une réparation ou un remplacement (avec remboursement si cela échoue). Pour les retours liés à un simple changement d'avis — lorsque le produit est en bon état mais que le client a simplement changé d'avis — vous n'avez aucune obligation légale de proposer un remboursement, mais de nombreux commerçants le font par geste commercial pour fidéliser leur clientèle. AskBiz POS vous permet de traiter les deux types de remboursement, et vous pouvez configurer votre politique de remboursement dans les paramètres afin que le personnel connaisse les règles sans avoir besoin de demander à un gérant à chaque fois.",
      },
      {
        heading: 'Traiter un remboursement total',
        body: "Pour traiter un remboursement total dans AskBiz POS, allez dans la section Transactions et trouvez la vente d'origine. Vous pouvez rechercher par numéro de transaction, date, nom du client, ou les articles vendus. Une fois la transaction trouvée, appuyez sur Rembourser. AskBiz affiche chaque article de la vente d'origine et vous permet de confirmer que vous remboursez le montant total. Sélectionnez le moyen de remboursement — idéalement le même que le paiement d'origine (rembourser une transaction par carte sur la même carte est une bonne pratique et souvent exigé par votre prestataire de paiement). Ajoutez une raison au remboursement (défectueux, non désiré, double facturation, etc.) et confirmez. Le montant du remboursement est déduit de votre chiffre d'affaires quotidien, les articles remboursés sont remis en stock (le cas échéant), et l'ensemble de la transaction — vente d'origine et remboursement — est relié dans la piste d'audit afin qu'il y ait une trace complète.",
      },
      {
        heading: 'Traiter un remboursement partiel',
        body: "Les remboursements partiels sont plus courants que la plupart des gens ne le pensent. Un client retourne un article d'un achat de trois articles. Un produit présente un défaut mineur et vous acceptez une remise de 20 % plutôt qu'un retour complet. Un client a été surfacturé en raison d'une erreur de tarification et doit être remboursé de la différence. AskBiz gère tous ces cas. Depuis la transaction d'origine, appuyez sur Rembourser puis sélectionnez uniquement les articles (ou le montant spécifique) à rembourser. Pour un remboursement au niveau des articles, cochez les articles retournés et AskBiz calcule le montant correct, y compris tout ajustement de TVA. Pour un remboursement à montant fixe (comme une remise commerciale), saisissez le montant manuellement. Les remboursements partiels sont enregistrés avec le même niveau de détail que les remboursements totaux — raison, montant, membre du personnel, horodatage, et un lien vers la transaction d'origine. Votre stock n'est mis à jour que pour les articles physiquement retournés ; si vous remboursez un écart de tarification, les niveaux de stock restent inchangés.",
      },
      {
        heading: 'Prévenir la fraude au remboursement',
        body: "La fraude au remboursement est l'une des sources de pertes les plus courantes dans le commerce. Elle inclut les faux remboursements (traiter un remboursement pour une vente qui n'a jamais eu lieu), le favoritisme (rembourser l'achat d'un ami pour qu'il obtienne le produit gratuitement), et la fraude au retour (retourner un produit usagé ou différent). AskBiz POS atténue ces risques de plusieurs façons. D'abord, les remboursements doivent être liés à une transaction d'origine — vous ne pouvez pas créer un remboursement autonome. Ensuite, seuls les gérants et les propriétaires peuvent traiter les remboursements ; les caissiers ne le peuvent pas, ce qui élimine le vecteur d'attaque le plus courant. Troisièmement, chaque remboursement est consigné avec l'identité du membre du personnel, l'horodatage, la raison, et le montant, créant un moyen de dissuasion et une piste d'audit. Quatrièmement, AskBiz signale les schémas de remboursement inhabituels — comme un nombre disproportionné de remboursements traités par un seul membre du personnel, ou des remboursements dépassant un pourcentage défini des ventes quotidiennes — afin que vous puissiez enquêter avant que les pertes ne s'accumulent.",
      },
    ],
    faq: [
      {
        q: 'Un caissier peut-il traiter un remboursement ?',
        a: "Non. Les remboursements sont réservés aux rôles Gérant et Propriétaire. Si un caissier doit traiter un retour, il doit faire appel à un gérant pour autoriser et finaliser le remboursement.",
      },
      {
        q: 'Que faire si je ne trouve pas la transaction d’origine ?',
        a: "AskBiz vous permet de rechercher par date, nom du produit, numéro de transaction, ou coordonnées du client. Si le client dispose d'un reçu WhatsApp, il peut vous montrer directement l'identifiant de la transaction.",
      },
    ],
  },

  'pos-transaction-amendments': {
    title: 'Modifications et corrections de transactions dans AskBiz POS',
    description:
      "Une erreur sur une vente ? Voici comment modifier, corriger, ou annoter des transactions dans AskBiz POS sans compromettre votre piste d'audit.",
    keywords: [
      'modification de transaction PDV',
      'corriger une vente PDV',
      'annuler une transaction PDV',
      'modifier une vente après paiement',
      'correction PDV',
      'modifier un reçu',
      'corriger une erreur de transaction',
    ],
    keyTakeaways: [
      'Les transactions terminées dans AskBiz POS ne peuvent pas être modifiées silencieusement — chaque changement crée une entrée visible dans la piste d’audit.',
      'Les corrections les plus courantes sont les remboursements partiels, les annulations (dans une fenêtre limitée), et les notes d’annotation.',
      'Cette approche protège vos registres pour la conformité fiscale et la prévention de la fraude.',
    ],
    content: [
      {
        heading: 'Pourquoi les transactions sont immuables',
        body: "Une fois qu'une vente est finalisée dans AskBiz POS, l'enregistrement de transaction d'origine ne peut pas être modifié. Ce n'est pas une limitation — c'est une fonctionnalité. Les transactions immuables sont le fondement d'une piste d'audit fiable. Si n'importe qui pouvait discrètement modifier une vente terminée — en changeant le montant, en retirant un article, ou en altérant le moyen de paiement — vos registres ne seraient plus dignes de confiance. HMRC attend des entreprises qu'elles maintiennent des registres de transactions précis et inviolables, et les exigences de Making Tax Digital renforcent cela. AskBiz applique l'immuabilité au niveau de la base de données, ce qui signifie que même les administrateurs système ne peuvent pas modifier une transaction terminée. À la place, les corrections se font en créant de nouveaux enregistrements liés : remboursements, annulations, et modifications qui se placent aux côtés de l'original et montrent clairement ce qui a été changé, quand, et par qui.",
      },
      {
        heading: 'Annuler une transaction',
        body: "Une annulation annule entièrement une transaction, comme si elle n'avait jamais eu lieu. Dans AskBiz POS, l'annulation n'est disponible que dans une courte fenêtre après la finalisation de la vente — généralement quelques minutes. Cela couvre le scénario où un caissier confirme accidentellement le paiement sur la mauvaise transaction, ou où le client se rend compte immédiatement qu'il a pris le mauvais article. Pour annuler, allez sur la transaction et appuyez sur Annuler. Vous devez saisir une raison (confirmation accidentelle, changement d'avis du client, transaction en double). L'annulation est traitée, les articles sont remis en stock, et la transaction d'origine ainsi que l'annulation apparaissent toutes deux dans la piste d'audit. Une fois la fenêtre d'annulation fermée, les modifications passent par le processus de remboursement à la place. Cette restriction de temps existe parce que les annulations interagissent avec les rétrofacturations de paiement par carte — plus vite vous annulez une transaction par carte, plus il est probable que la rétrofacturation soit traitée comme une annulation plutôt qu'un remboursement, ce qui est plus rapide et plus propre sur le relevé bancaire du client.",
      },
      {
        heading: 'Annoter une transaction',
        body: "Parfois, une transaction n'a pas besoin d'une correction financière — elle a juste besoin d'une note. Peut-être que le client a mentionné qu'il reviendra chercher l'article plus tard. Peut-être que la vente incluait un accord verbal sur une future remise. Peut-être qu'une circonstance inhabituelle s'est produite et que vous souhaitez la documenter pour vos registres. AskBiz vous permet d'ajouter des annotations à n'importe quelle transaction terminée. Appuyez sur la transaction, appuyez sur Ajouter une note, et tapez votre annotation. La note est horodatée et attribuée au membre du personnel qui l'a rédigée. Les annotations ne modifient pas l'enregistrement financier — ce sont des informations supplémentaires. Elles sont visibles dans la vue détaillée de la transaction et dans la piste d'audit, et elles peuvent être recherchées, ce qui est utile lorsqu'un client rappelle des semaines plus tard et que vous devez retrouver le contexte de son achat.",
      },
      {
        heading: 'Scénarios de modification courants et comment les gérer',
        body: "Prix erroné facturé : traitez un remboursement partiel pour la différence si vous avez surfacturé, ou notez le manque à gagner et ajustez la tarification pour les ventes futures. Mauvais produit scanné : annulez la transaction si vous êtes dans la fenêtre d'annulation ; sinon, remboursez l'article incorrect et traitez une nouvelle vente pour le bon article. Moyen de paiement mal enregistré : ajoutez une annotation notant le moyen de paiement correct. Cela n'affecte pas votre chiffre d'affaires mais corrige la répartition des moyens de paiement dans vos rapports. Litige client : si un client affirme avoir été facturé pour un article qu'il n'a pas reçu, examinez la transaction, vérifiez toute vidéosurveillance disponible, et traitez un remboursement si la réclamation est valide. La piste d'audit fournit une trace claire si le litige s'aggrave. Dans tous les cas, le principe est le même : ne jamais altérer l'enregistrement d'origine. À la place, créez un nouvel enregistrement (remboursement, annulation, ou annotation) qui corrige la situation de manière transparente.",
      },
    ],
    faq: [
      {
        q: 'Puis-je changer le moyen de paiement d’une vente terminée ?',
        a: "Vous ne pouvez pas changer le moyen de paiement d'une transaction terminée, mais vous pouvez ajouter une annotation indiquant le moyen correct. Pour vos rapports, l'annotation fournit la correction.",
      },
      {
        q: 'Combien de temps ai-je pour annuler une transaction ?',
        a: "La fenêtre d'annulation est configurable mais est par défaut de quelques minutes après la finalisation de la vente. Passé ce délai, les corrections passent par le processus de remboursement.",
      },
    ],
  },
}
