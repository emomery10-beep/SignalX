// Academy article translations — Français (fr) — Wave A, Batch 2.
//
// Point of Sale & Retail / POS-BI-Integration / Multi-Branch category:
// 13 articles covering VAT calculations, audit trails, data export, staff
// performance, security, PWA mobile setup, troubleshooting, dashboards, AI
// chat questions, Daily Brief integration, Business Pulse impact, offline
// mode, and multi-location retail management.
//
// Glossary reused verbatim from the Batch 1 sibling agent (see also the
// report accompanying this file for the full canonical list other fr
// batches should reuse):
//   profit -> bénéfice | margin -> marge (bénéficiaire) | revenue -> chiffre d'affaires
//   stock/inventory -> stock / gestion des stocks | cashier -> caissier / caissière
//   receipt -> reçu | refund -> remboursement (rembourser) | VAT/tax -> TVA
//   dashboard -> tableau de bord | staff -> personnel | role -> rôle
//   low-stock alert -> alerte de stock faible | purchase order -> bon de commande
//   POS system -> système de point de vente (PDV) | barcode -> code-barres
//   cart -> panier | discount -> remise | void -> annulation (annuler)
//   audit trail -> piste d'audit | reorder point -> seuil de réapprovisionnement
//   Owner -> Propriétaire | Manager -> Gérant | magic link -> lien magique
//   stockout/out-of-stock -> rupture de stock | dead stock -> stock dormant
//   sell-through rate -> taux d'écoulement | checkout -> encaissement / parcours d'encaissement
//   GDPR -> RGPD | transaction -> transaction (cognate, unchanged)
//
// Merged into lib/academy-i18n/fr/index.ts by a later step — this file is
// NOT imported anywhere yet.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch2Translations: LocaleTranslations = {
  'pos-vat-calculations': {
    title: 'Calcul de la TVA et conformité fiscale pour les transactions PDV',
    description:
      "Calculez la TVA correctement dès la première vente. AskBiz POS calcule automatiquement la TVA sur chaque transaction et vous maintient prêt pour Making Tax Digital.",
    keywords: [
      'calcul de la TVA PDV',
      'conformité TVA PDV',
      'Making Tax Digital PDV',
      'taux de TVA commerce de détail',
      'calcul automatique de la TVA',
      'déclaration fiscale PDV Royaume-Uni',
      'prix TVA incluse',
    ],
    keyTakeaways: [
      'AskBiz POS calcule automatiquement la TVA sur chaque vente en fonction du taux de TVA attribué à chaque produit.',
      'Les produits peuvent être définis au taux normal (20 %), au taux réduit (5 %), au taux zéro (0 %) ou exonérés — AskBiz gère correctement les paniers mixtes.',
      "Les données de TVA au niveau de chaque transaction alimentent directement vos rapports, ce qui simplifie les déclarations Making Tax Digital.",
    ],
    content: [
      {
        heading: 'Comment AskBiz POS gère la TVA',
        body: "Lorsque vous ajoutez un produit à votre catalogue AskBiz, vous lui attribuez un taux de TVA : normal (20 %), réduit (5 %), zéro (0 %) ou exonéré. À partir de là, chaque vente impliquant ce produit voit sa TVA calculée automatiquement. Si un client achète trois articles à des taux de TVA différents — par exemple un gadget au taux normal, un siège auto pour enfant au taux réduit et un livre au taux zéro — AskBiz calcule la TVA correcte pour chaque article et affiche une ventilation combinée sur le reçu. Vous n'avez pas à y penser pendant la vente ; le système s'en charge en coulisses. Le reçu indique le montant net, le montant de TVA et le total TTC, ce dont vos clients assujettis à la TVA ont besoin pour leur propre comptabilité. Pour les prix TVA incluse (lorsque le prix affiché en rayon comprend la TVA), AskBiz recalcule le montant net et la part de TVA à partir de la formule standard.",
      },
      {
        heading: 'Prix TVA incluse ou TVA exclue',
        body: "Dans le commerce de détail au Royaume-Uni, les prix affichés aux consommateurs sont presque toujours TVA incluse — le prix en rayon est celui que le client paie, TVA comprise. AskBiz POS prend en charge les deux modèles. Pour la vente au détail grand public, configurez vos produits en prix TVA incluse : AskBiz affiche le prix total au client tout en suivant séparément, en arrière-plan, le montant net et la part de TVA. Pour les clients professionnels ou grossistes qui doivent voir le prix net, vous pouvez basculer en prix TVA exclue, où le prix affiché est hors taxe et le système ajoute la TVA lors de l'encaissement. Vous pouvez même fonctionner en mode mixte — TVA incluse pour les clients de passage et TVA exclue pour les comptes professionnels — en configurant la préférence d'affichage par client ou par transaction. Cette flexibilité est particulièrement utile pour les commerces qui servent à la fois une clientèle de détail et une clientèle professionnelle depuis le même point de vente.",
      },
      {
        heading: 'Making Tax Digital et vos données PDV',
        body: "Making Tax Digital (MTD) est le programme de HMRC visant à numériser entièrement la gestion fiscale. Si vous êtes assujetti à la TVA, vous êtes déjà tenu de conserver des registres numériques et de soumettre vos déclarations de TVA via un logiciel compatible MTD. AskBiz POS génère automatiquement des registres numériques pour chaque transaction, ce qui signifie que vos données PDV sont d'emblée conformes MTD. Chaque vente enregistre la date, le montant net, le taux de TVA, le montant de TVA et le total TTC. Ces registres sont stockés numériquement, horodatés et ne peuvent être modifiés (grâce au modèle de transaction immuable), ce qui coche toutes les cases attendues par HMRC. Le moment venu de préparer votre déclaration de TVA, vous pouvez exporter vos données de transactions PDV et les importer dans votre logiciel comptable compatible MTD. AskBiz fournit les données dans le bon format, réduisant la saisie manuelle et les erreurs qui l'accompagnent.",
      },
      {
        heading: 'Pièges courants liés à la TVA pour les utilisateurs de PDV',
        body: "L'erreur la plus fréquente consiste à attribuer un taux de TVA incorrect à un produit. Au Royaume-Uni, les règles sont détaillées et parfois contre-intuitives — par exemple, un biscuit nature est au taux zéro, mais un biscuit enrobé de chocolat est au taux normal. Les plats à emporter chauds sont au taux normal, tandis que les plats à emporter froids sont généralement au taux zéro. Les vêtements pour enfants sont au taux zéro, mais les vêtements pour adultes sont au taux normal. En cas de doute sur le traitement TVA d'un produit, consultez le guide TVA de HMRC pour votre secteur ou demandez à votre comptable. Une erreur peut entraîner un sous-paiement ou un sur-paiement de TVA, ce qui pose problème dans les deux cas. AskBiz vous permet de mettre à jour les taux de TVA en masse si vous découvrez une erreur, et l'ajustement se reflète dans votre prochaine période de déclaration. L'essentiel est de définir les taux correctement dès le départ et de les revoir chaque fois que HMRC modifie les règles.",
      },
    ],
    faq: [
      {
        q: 'Dois-je être assujetti à la TVA pour utiliser AskBiz POS ?',
        a: "Non. Si vous n'êtes pas assujetti à la TVA, vous pouvez définir tous vos produits à TVA zéro et AskBiz n'ajoutera aucune taxe. Lorsque vous vous immatriculez à la TVA, il vous suffit de mettre à jour les taux de TVA de vos produits.",
      },
      {
        q: 'AskBiz peut-il soumettre ma déclaration de TVA directement à HMRC ?',
        a: "AskBiz fournit les données de transactions nécessaires à votre déclaration de TVA. Vous soumettez la déclaration via votre logiciel comptable compatible MTD. La soumission directe à HMRC depuis AskBiz figure sur la feuille de route.",
      },
    ],
  },

  'pos-audit-trail': {
    title: "Piste d'audit : chaque transaction tracée et infalsifiable",
    description:
      "AskBiz POS conserve une piste d'audit complète et immuable de chaque vente, remboursement, annulation et modification. Voici pourquoi c'est important et comment l'utiliser.",
    keywords: [
      "piste d'audit PDV",
      'journal d’audit des transactions',
      'registres infalsifiables',
      'conformité PDV',
      "piste d'audit commerce de détail",
      'historique des transactions PDV',
      'audit HMRC PDV',
    ],
    keyTakeaways: [
      'Chaque action dans AskBiz POS — ventes, remboursements, annulations, modifications de prix, changements de personnel — est consignée dans une piste d’audit immuable.',
      "La piste d'audit vous protège lors des contrôles HMRC, des enquêtes pour fraude et des litiges avec les clients.",
      "Vous pouvez rechercher, filtrer et exporter les données de la piste d'audit pour n'importe quelle période.",
    ],
    content: [
      {
        heading: "Qu'est-ce qu'une piste d'audit et pourquoi est-ce important",
        body: "Une piste d'audit est un enregistrement chronologique de chaque événement survenant dans votre système de point de vente. Dans AskBiz, cela comprend les ventes, les remboursements, les annulations, les modifications de prix, les applications de remises, les ajustements de stock, les connexions du personnel, les changements de rôle et les modifications de configuration. Chaque entrée indique ce qui s'est passé, quand cela s'est passé et qui en est l'auteur. La piste est immuable — les entrées ne peuvent être modifiées ni supprimées, même par le propriétaire du compte. Cela compte pour trois raisons. D'abord, la conformité : HMRC peut demander vos registres de transactions lors d'un contrôle de TVA, et une piste d'audit continue et infalsifiable constitue la référence en matière de preuve. Ensuite, la prévention de la fraude : si quelqu'un traite des remboursements fictifs ou modifie des prix de manière abusive, la piste d'audit le révélera. Enfin, la résolution des litiges : lorsqu'un client affirme avoir été surfacturé ou ne jamais avoir reçu un article, la piste d'audit vous donne les faits pour résoudre la situation équitablement et rapidement.",
      },
      {
        heading: 'Ce qui est consigné dans AskBiz POS',
        body: "AskBiz consigne bien plus que les seules transactions financières. Voici une liste non exhaustive des événements capturés dans la piste d'audit. Ventes : chaque article vendu, le prix, la quantité, la TVA, le mode de paiement, le membre du personnel et l'horodatage. Remboursements et annulations : la référence de la transaction d'origine, le montant remboursé, le motif et le membre du personnel ayant autorisé l'opération. Modifications de prix : le prix d'origine, le prix modifié et le motif. Remises : le type de remise (pourcentage ou montant fixe), le montant, et si elle a été appliquée à un article ou à l'ensemble du panier. Ajustements de stock : le produit, l'ancienne quantité, la nouvelle quantité et le motif de l'ajustement. Événements liés au personnel : connexions, déconnexions, changements de rôle et nouvelles invitations. Modifications de configuration : paramètres de reçu, seuils d'alerte et changements de mode de paiement. Chaque entrée comporte un horodatage précis à la seconde près et l'identité de l'utilisateur ayant réalisé l'action.",
      },
      {
        heading: "Comment utiliser la piste d'audit",
        body: "La piste d'audit est accessible depuis la section Rapports d'AskBiz POS. Vous pouvez filtrer par période, type d'événement, membre du personnel ou produit. Les cas d'usage courants incluent l'investigation d'un écart de caisse (filtrer par date et rechercher les annulations, remboursements et modifications de prix), l'examen de l'activité d'un membre du personnel (filtrer par identifiant pour voir chacune de ses actions), et la préparation d'un contrôle fiscal (exporter la piste complète pour la période concernée). La fonction de recherche permet de retrouver des transactions précises par montant, nom de produit ou identifiant de transaction. Pour la gestion quotidienne, le filtre le plus utile est « exceptions » — les événements qui sortent des schémas habituels, comme des remises anormalement élevées, des remboursements dépassant un seuil, ou des annulations survenues pendant des périodes sans supervision. AskBiz peut faire remonter ces exceptions automatiquement, vous évitant de passer en revue manuellement des centaines de transactions courantes pour repérer les quelques-unes qui méritent votre attention.",
      },
      {
        heading: 'Piste d’audit et conformité HMRC',
        body: "Si HMRC effectue un contrôle de conformité sur votre entreprise, il voudra consulter vos registres de transactions. Les exigences précises dépendent de votre situation, mais HMRC attend généralement des registres numériques de toutes les ventes et achats, avec les montants de TVA clairement identifiés. La piste d'audit d'AskBiz répond à ces exigences de façon complète. Chaque transaction est numérique, horodatée, détaillée en TVA et liée au mode de paiement. Les remboursements et annulations sont documentés avec leurs motifs et autorisations. Les ajustements de stock sont expliqués. Les données peuvent être exportées dans des formats standards (CSV, Excel) pour soumission ou examen. Disposer de ce niveau de documentation ne fait pas que satisfaire les exigences de conformité — cela positionne favorablement votre entreprise. Une piste d'audit bien tenue et infalsifiable indique à HMRC que vous prenez la tenue de vos registres au sérieux, ce qui peut rendre les contrôles plus courts et moins conflictuels.",
      },
    ],
    faq: [
      {
        q: "Puis-je supprimer des entrées de la piste d'audit ?",
        a: "Non. La piste d'audit est immuable par conception. Les entrées ne peuvent être ni modifiées ni supprimées, même par les propriétaires de compte. Cela protège l'intégrité de vos registres.",
      },
      {
        q: "Sur quelle période remonte la piste d'audit ?",
        a: "AskBiz conserve l'intégralité de votre piste d'audit tant que votre compte est actif. HMRC exige que les entreprises conservent leurs registres pendant au moins six ans, et AskBiz dépasse cette exigence.",
      },
    ],
  },

  'pos-30-day-export': {
    title: 'Exporter 30 jours de données PDV pour votre comptable',
    description:
      'Besoin d’envoyer vos données PDV à votre comptable ? AskBiz POS vous permet d’exporter 30 jours de données de transactions en quelques secondes — voici comment faire.',
    keywords: [
      'export de données PDV',
      'exporter les transactions PDV',
      'données PDV pour comptable',
      'export sur 30 jours',
      'export CSV PDV',
      'export des rapports PDV',
      'télécharger les données de ventes PDV',
    ],
    keyTakeaways: [
      'AskBiz POS vous permet d’exporter jusqu’à 30 jours de données de transactions au format CSV ou Excel en quelques appuis.',
      "L'export inclut chaque vente, remboursement et annulation, avec le détail complet de la TVA — tout ce dont votre comptable a besoin.",
      'Des exports réguliers simplifient considérablement la comptabilité, les déclarations de TVA et les comptes de fin d’exercice.',
    ],
    content: [
      {
        heading: 'Pourquoi des exports réguliers sont importants',
        body: "Même avec un système de point de vente parfaitement tenu, votre comptable a besoin des données brutes. Il rapproche vos transactions PDV de vos relevés bancaires, prépare vos déclarations de TVA et établit vos comptes de fin d'exercice. Plus vous lui facilitez l'accès à des données de transactions propres et détaillées, moins il y passe de temps (et moins cela vous coûte). De nombreux petits commerçants remettent encore à leur comptable un sac de tickets de caisse en papier et un résumé manuscrit à la fin de chaque trimestre. Cela se traduit par des heures de saisie manuelle, des erreurs inévitables et une facture plus élevée. Avec AskBiz POS, vous pouvez exporter un jeu de données complet couvrant chaque transaction — avec les dates, les montants, le détail de la TVA, les modes de paiement et les remboursements — en moins d'une minute. Votre comptable obtient ce dont il a besoin, vous économisez de l'argent, et les chiffres sont exacts.",
      },
      {
        heading: "Ce que contient l'export",
        body: "Un export de données AskBiz POS contient chaque transaction traitée sur la période sélectionnée. Pour chaque vente, l'export enregistre la date et l'heure, l'identifiant de la transaction, les articles vendus (avec prix unitaires et quantités), les remises appliquées, le taux et le montant de TVA par article, le montant net total, la TVA totale, le total TTC, le mode de paiement, et le membre du personnel qui a traité la vente. Les remboursements et annulations sont listés séparément avec des références aux transactions d'origine, ce qui facilite le rapprochement pour votre comptable. L'export comprend également une feuille de synthèse avec les totaux : chiffre d'affaires total (net et TTC), TVA totale collectée, total des remboursements, total des remises et nombre de transactions par mode de paiement. Cette synthèse suffit souvent à votre comptable pour la comptabilité courante ; le détail ligne par ligne est là pour un rapprochement plus poussé ou si HMRC pose des questions.",
      },
      {
        heading: 'Comment lancer un export',
        body: "Dans AskBiz POS, rendez-vous dans Rapports, puis appuyez sur Exporter les données. Sélectionnez votre période — vous pouvez choisir n'importe quelle plage allant jusqu'à trente jours. Pour la plupart des commerces, un export mensuel (couvrant le mois calendaire) convient bien. Choisissez votre format : le CSV est le plus universellement compatible et peut être ouvert dans Excel, Google Sheets, ou importé dans un logiciel comptable. Le format Excel inclut la mise en forme et la feuille de synthèse. Appuyez sur Exporter et le fichier est généré en quelques secondes. Vous pouvez le télécharger directement sur votre appareil, vous l'envoyer par e-mail, ou le partager avec votre comptable via le moyen que vous utilisez habituellement. Si votre comptable préfère un format ou une mise en page différente, le CSV est suffisamment flexible pour être manipulé dans n'importe quel tableur. Certains utilisateurs d'AskBiz programment un rappel mensuel pour exporter leurs données le premier de chaque mois, couvrant l'activité du mois précédent.",
      },
      {
        heading: 'Conseils pour une transmission fluide à votre comptable',
        body: "Quelques pratiques simples rendent le processus d'export encore plus utile. D'abord, soyez régulier dans votre calendrier d'export. Des exports mensuels alignés sur vos périodes de TVA maintiennent tout synchronisé. Ensuite, nommez clairement vos fichiers — « AskBiz-POS-Janvier-2026.csv » vaut mieux que « export(3).csv ». Troisièmement, ajoutez une brève note à chaque export mentionnant tout élément inhabituel : un remboursement important, un ajustement de stock affectant le coût des marchandises, ou un changement de taux de TVA. Quatrièmement, si votre comptable utilise un logiciel spécifique (Xero, QuickBooks, FreeAgent), demandez-lui quel format d'import il préfère — AskBiz exporte peut-être déjà dans une mise en page compatible. Enfin, conservez une sauvegarde locale de chaque export. Bien qu'AskBiz stocke vos données en toute sécurité dans le cloud, disposer d'une copie locale sur votre propre disque vous offre une protection supplémentaire et vous permet de renvoyer les données à tout moment si nécessaire.",
      },
    ],
    faq: [
      {
        q: 'Puis-je exporter plus de 30 jours à la fois ?',
        a: "L'export standard couvre jusqu'à 30 jours. Pour des périodes plus longues, effectuez plusieurs exports ou contactez le support pour obtenir un extrait de données personnalisé.",
      },
      {
        q: 'L’export est-il compatible avec Xero et QuickBooks ?',
        a: 'L’export CSV peut être importé dans la plupart des logiciels comptables, y compris Xero et QuickBooks. Consultez le guide d’import de votre logiciel pour connaître les éventuelles exigences de mise en forme spécifiques.',
      },
    ],
  },

  'pos-multi-staff-performance': {
    title: 'Indicateurs de performance du personnel : ventes par caissier, chiffre d’affaires par rôle',
    description:
      'Suivez quels membres du personnel vendent le plus, génèrent le plus de chiffre d’affaires et commettent le moins d’erreurs — directement depuis votre tableau de bord AskBiz POS.',
    keywords: [
      'performance du personnel PDV',
      'ventes par caissier',
      'chiffre d’affaires par membre du personnel',
      'indicateurs personnel PDV',
      'performance des employés commerce de détail',
      'suivi de performance des caissiers',
      'KPI personnel commerce de détail',
    ],
    keyTakeaways: [
      'AskBiz POS attribue chaque transaction au membre du personnel qui l’a traitée, permettant un suivi individuel des performances.',
      'Les indicateurs clés incluent les transactions par heure, la valeur moyenne des transactions, le taux de remboursement et le chiffre d’affaires total par membre du personnel.',
      'Les données de performance du personnel vous aident à planifier les équipes, à identifier les besoins de formation et à récompenser les plus performants.',
    ],
    content: [
      {
        heading: 'Pourquoi le suivi de la performance du personnel est important',
        body: "Lorsque vous travaillez seul, vous savez exactement où vous en êtes. Dès que vous embauchez du personnel, cette visibilité diminue. Vous connaissez les chiffres globaux du magasin, mais pas qui contribue à quoi. Sans données de performance individuelles, vous ne pouvez pas répondre à des questions essentielles : la nouvelle recrue est-elle opérationnelle ? Un caissier vend-il systématiquement plus qu'un autre — et si oui, que fait-il différemment ? Les taux de remboursement sont-ils plus élevés sur certaines équipes ? AskBiz POS répond à toutes ces questions en attribuant chaque transaction au membre du personnel qui l'a traitée. Au fil du temps, cela dresse un tableau détaillé de la contribution de chacun. Ces données ne visent pas la surveillance — elles vous aident à comprendre votre équipe, à repérer les points forts à reproduire, à identifier les lacunes à combler et à prendre des décisions éclairées en matière de planning, de formation et de récompenses.",
      },
      {
        heading: 'Indicateurs clés suivis par AskBiz pour chaque membre du personnel',
        body: "AskBiz POS enregistre plusieurs indicateurs de performance pour chaque membre du personnel. Le chiffre d'affaires total est le plus simple à comprendre — combien cette personne a-t-elle fait passer en caisse ? Mais ce n'est pas toujours le plus révélateur. Les transactions par heure mesurent le débit — un caissier qui traite trente transactions par heure écoule la file plus vite qu'un autre qui en traite quinze. La valeur moyenne des transactions (VMT) montre qui vend des paniers de plus grande valeur, ce qui peut indiquer une vente incitative efficace. Le taux de remboursement par membre du personnel met en évidence d'éventuels besoins de formation ou, plus rarement, une fraude. Le taux de remise par membre du personnel montre qui applique des remises et à quelle fréquence. Le nombre d'articles par transaction révèle la taille du panier. AskBiz présente ces indicateurs dans un tableau de bord clair, comparant les membres du personnel côte à côte pour la période de votre choix. Vous pouvez consulter les données par jour, par semaine ou par mois.",
      },
      {
        heading: 'Utiliser les données de performance de façon constructive',
        body: "Les utilisateurs d'AskBiz qui réussissent le mieux traitent les données de performance du personnel comme un outil d'accompagnement, pas comme un bâton. Si la VMT d'un caissier est systématiquement supérieure de 30 % à la moyenne, creusez les données pour comprendre pourquoi. Recommande-t-il des produits complémentaires ? Accueille-t-il les clients d'une manière qui encourage à flâner dans le magasin ? Partagez ces comportements avec l'équipe. Si le taux de remboursement d'un caissier est anormalement élevé, engagez d'abord une conversation bienveillante avant de supposer le pire — il traite peut-être des retours provenant des équipes d'autres membres du personnel, ou il existe peut-être un problème de qualité sur les produits qu'il vend le plus souvent. Pour les décisions de planning, les données de performance sont précieuses. Placez vos meilleurs vendeurs aux heures de pointe. Si un nouveau membre de l'équipe a un débit plus faible, associez-le à un caissier expérimenté pendant les périodes chargées plutôt que de le laisser seul pendant l'affluence du samedi.",
      },
      {
        heading: 'Confidentialité, équité et considérations légales',
        body: "Le suivi de la performance du personnel soulève des questions légitimes de confidentialité et d'équité. Au Royaume-Uni, vous êtes tenu d'informer vos employés des données que vous collectez à leur sujet et de leur usage. Cela doit figurer dans le contrat de travail ou le règlement intérieur. AskBiz suit des indicateurs liés au travail pendant les heures de travail — il ne surveille ni l'activité personnelle, ni la localisation, ni quoi que ce soit en dehors du système de point de vente. Soyez transparent avec votre équipe sur les indicateurs que vous consultez et pourquoi. De nombreux commerçants partagent ouvertement les tableaux de bord de performance, ce qui crée une culture de responsabilisation saine plutôt qu'une surveillance secrète. Si vous utilisez les données de performance pour prendre des décisions d'emploi (licenciement ou promotion), veillez à ce que ces décisions soient cohérentes, documentées et fondées sur un échantillon de données équitable, et non sur une seule mauvaise journée. AskBiz conserve les données de performance du personnel tant que le compte est actif, mais vous pouvez anonymiser les données des anciens employés conformément à votre politique de conservation des données.",
      },
    ],
    faq: [
      {
        q: 'Le personnel peut-il consulter ses propres indicateurs de performance ?',
        a: 'Les Gérants et les Propriétaires peuvent consulter les indicateurs de tout le personnel. Les Caissiers peuvent voir leur propre nombre de transactions et leur chiffre d’affaires du jour, mais pas de données comparatives concernant les autres membres du personnel.',
      },
      {
        q: 'AskBiz classe-t-il les membres du personnel ?',
        a: 'AskBiz présente les données côte à côte mais ne crée pas de classement formel. C’est à vous, en tant que propriétaire de l’entreprise, d’interpréter et de communiquer ces données.',
      },
    ],
  },

  'pos-security-best-practices': {
    title: 'Sécurité du PDV : protéger les transactions et les données clients',
    description:
      'Votre PDV traite de l’argent et des données clients chaque jour. Voici les bonnes pratiques de sécurité que tout petit commerçant devrait suivre.',
    keywords: [
      'sécurité du PDV',
      'protection des données commerce de détail',
      'prévention de la fraude PDV',
      'système de point de vente sécurisé',
      'RGPD PDV',
      'sécurité des paiements commerce de détail',
      'bonnes pratiques de sécurité PDV',
    ],
    keyTakeaways: [
      'Des permissions de personnel solides, une connexion par lien magique et un accès basé sur les rôles constituent votre première ligne de défense en matière de sécurité PDV.',
      'AskBiz POS stocke les données dans une infrastructure cloud chiffrée — aucune donnée sensible ne reste sur votre appareil local.',
      'L’examen régulier de la piste d’audit, des schémas de remboursement et des journaux d’accès permet de détecter les problèmes avant qu’ils ne deviennent coûteux.',
    ],
    content: [
      {
        heading: 'Les trois piliers de la sécurité PDV',
        body: "La sécurité du PDV repose sur trois piliers : le contrôle des accès, la protection des données et la surveillance. Le contrôle des accès consiste à garantir que seules les personnes autorisées peuvent utiliser le système et que chacune ne peut faire que ce que son rôle exige. Les permissions basées sur les rôles d'AskBiz (Propriétaire, Gérant, Caissier) et la connexion par lien magique couvrent cela de façon complète. La protection des données consiste à garantir que les données de transaction, les informations clients et les registres financiers sont stockés en toute sécurité et transmis de manière sûre. AskBiz stocke toutes les données dans une infrastructure cloud chiffrée, selon des protocoles standards du secteur — les données sont chiffrées à la fois en transit (lorsqu'elles circulent entre votre appareil et le serveur) et au repos (lorsqu'elles sont stockées sur le serveur). Aucune donnée de transaction sensible n'est stockée en permanence sur votre appareil local. La surveillance consiste à garder un œil sur ce qui se passe dans le système et à repérer rapidement les anomalies. La piste d'audit d'AskBiz fournit les données brutes ; les alertes d'exception mettent en évidence les événements qui méritent d'être examinés.",
      },
      {
        heading: 'Se protéger contre les menaces internes',
        body: "La vérité, inconfortable, est que la majorité des fraudes au PDV dans le petit commerce sont commises par le personnel, et non par des attaquants externes. Les remboursements fictifs, les arrangements de complaisance (offrir des produits gratuits ou réduits à des proches), l'écrémage (empocher de l'argent liquide et annuler la transaction) et le vol de temps sont les formes les plus courantes. AskBiz atténue ces risques par plusieurs mécanismes. Restreindre les remboursements et les annulations aux Gérants et aux Propriétaires supprime la principale voie de fraude au niveau des caissiers. La piste d'audit immuable crée une responsabilisation — chaque action est consignée au nom d'une personne identifiée. Les alertes d'exception signalent des schémas inhabituels, comme un pic de remboursements ou un taux de remise anormal sur une équipe donnée. Les outils de rapprochement de caisse comparent le montant attendu en caisse (d'après les registres du PDV) avec le montant réellement compté, mettant immédiatement en évidence les écarts. Le moyen de dissuasion le plus efficace reste toutefois simplement d'informer votre personnel que ces contrôles existent. Lorsque les gens savent que leurs actions sont suivies et examinées, la plupart n'envisageront jamais d'agir malhonnêtement.",
      },
      {
        heading: 'Protéger les données clients et se conformer au RGPD',
        body: "Si vous collectez des données clients via votre PDV — numéros de téléphone pour les reçus WhatsApp, adresses e-mail pour les factures numériques, ou noms de clients pour un programme de fidélité — vous êtes soumis au RGPD. Les principes clés sont les suivants : ne collectez que ce dont vous avez besoin, informez les clients de ce que vous collectez et pourquoi, stockez-le en toute sécurité, et supprimez-le lorsque cela n'est plus nécessaire. AskBiz gère l'aspect technique du stockage sécurisé et du chiffrement. Votre responsabilité porte sur l'aspect politique : afficher une notice de confidentialité dans votre magasin ou sur votre site web, vous assurer de disposer d'une base légale pour traiter chaque type de donnée (généralement « l'intérêt légitime » pour l'envoi des reçus et le « consentement » pour les communications marketing), et répondre à toute demande d'accès ou de suppression de données clients dans un délai d'un mois. AskBiz vous permet de rechercher et d'exporter toutes les données détenues sur un client donné, ce qui simplifie la réponse aux demandes d'accès des personnes concernées.",
      },
      {
        heading: 'Sécurité physique des appareils PDV',
        body: "La sécurité logicielle n'est que la moitié du tableau. Votre appareil PDV — téléphone, tablette ou terminal — a aussi besoin d'une protection physique. Si quelqu'un vole votre tablette, il a potentiellement accès à votre système de point de vente (s'il est encore connecté) ainsi qu'à toute donnée mise en cache localement. Voici des mesures concrètes pour atténuer ce risque. D'abord, activez le verrouillage de l'appareil — exigez un code PIN, une empreinte digitale ou une reconnaissance faciale pour le déverrouiller. Ensuite, configurez le délai d'expiration de session dans AskBiz afin que le PDV se déconnecte automatiquement après une période d'inactivité. Troisièmement, si un appareil est volé, retirez-le immédiatement des appareils autorisés dans les paramètres d'AskBiz et changez tous les identifiants partagés. Quatrièmement, ne laissez jamais un appareil PDV sans surveillance dans une zone accessible au public. Pendant les heures d'ouverture, l'appareil doit rester en permanence à portée de vue et de main d'un membre du personnel. En dehors des heures d'ouverture, rangez-le en lieu sûr. Ces mesures sont simples mais efficaces — la plupart des vols physiques de PDV sont opportunistes, et des précautions basiques suffisent à en supprimer l'occasion.",
      },
    ],
    faq: [
      {
        q: 'AskBiz POS est-il conforme à la norme PCI DSS ?',
        a: "AskBiz POS ne traite pas directement les paiements par carte — c'est votre terminal de paiement qui s'en charge. Cela signifie qu'AskBiz lui-même est en dehors du champ d'application de la norme PCI DSS. Cela dit, les pratiques de gestion des données d'AskBiz s'alignent sur les bonnes pratiques de sécurité de tout système qui enregistre des informations sur le mode de paiement.",
      },
      {
        q: 'Que dois-je faire si je soupçonne une fraude au PDV commise par un membre du personnel ?',
        a: "Examinez la piste d'audit à la recherche de preuves, en vous concentrant sur les remboursements, les annulations, les modifications de prix et les écarts de caisse. Si vous trouvez des preuves de fraude, consultez votre conseiller juridique avant de prendre une mesure disciplinaire afin de vous assurer de suivre les procédures appropriées.",
      },
    ],
  },

  'pos-pwa-mobile-setup': {
    title: 'Installer AskBiz POS sur mobile : guide d’installation PWA',
    description:
      'AskBiz POS fonctionne comme une Progressive Web App sur tout smartphone ou toute tablette récente. Voici comment l’installer pour profiter de la meilleure expérience.',
    keywords: [
      'installation PWA PDV',
      'installer le PDV sur mobile',
      'PWA AskBiz',
      'progressive web app PDV',
      'PDV sur téléphone',
      'installer le PDV sur tablette',
      'configuration du point de vente mobile',
    ],
    keyTakeaways: [
      'AskBiz POS fonctionne comme une Progressive Web App — installez-la sur votre écran d’accueil pour une expérience proche d’une application native, sans passer par une boutique d’applications.',
      'L’installation de la PWA prend moins de deux minutes, aussi bien sur iOS que sur Android.',
      'Une fois installé, AskBiz POS fonctionne en plein écran, prend en charge le mode hors ligne et se lance instantanément depuis votre écran d’accueil.',
    ],
    content: [
      {
        heading: 'Qu’est-ce qu’une Progressive Web App (PWA) ?',
        body: "Une Progressive Web App est un site web qui se comporte comme une application native. Lorsque vous installez une PWA sur votre écran d'accueil, elle obtient sa propre icône, s'ouvre en plein écran (sans la barre d'adresse du navigateur), se charge rapidement et peut même fonctionner hors ligne. Vous ne la téléchargez pas depuis l'App Store ou Google Play — vous l'installez directement depuis le navigateur. Cette approche présente des avantages importants pour un système de point de vente. Les mises à jour se font automatiquement — à chaque ouverture de l'application, vous obtenez la dernière version sans rien télécharger. Il n'y a pas de processus de validation d'application qui retarde la sortie des nouvelles fonctionnalités. Elle fonctionne sur tout appareil doté d'un navigateur récent, vous n'êtes donc pas enfermé dans un système d'exploitation particulier. Et comme AskBiz POS est une PWA, vous pouvez être opérationnel sur un nouvel appareil en quelques minutes, ce qui est précieux si votre appareil principal tombe en panne en plein service et que vous avez besoin d'un remplacement rapide.",
      },
      {
        heading: 'Installation sur Android',
        body: "Ouvrez Chrome (ou tout navigateur basé sur Chromium) sur votre téléphone ou tablette Android. Accédez à l'URL d'AskBiz POS et connectez-vous à votre compte. Chrome affichera une bannière ou une notification vous suggérant d'installer l'application — appuyez dessus et suivez les instructions. Si la bannière n'apparaît pas, appuyez sur le menu à trois points en haut à droite et sélectionnez « Ajouter à l'écran d'accueil » ou « Installer l'application ». L'icône AskBiz apparaît immédiatement sur votre écran d'accueil. Lorsque vous appuyez dessus, le PDV s'ouvre en plein écran, indiscernable d'une application native. L'installation occupe un espace de stockage minimal car la majorité des données de l'application sont stockées dans le cloud. Une fois installé, AskBiz met en cache localement les ressources essentielles, ce qui permet à l'application de se charger rapidement même sur une connexion lente, et rend les fonctions de vente de base disponibles hors ligne.",
      },
      {
        heading: 'Installation sur iOS (iPhone et iPad)',
        body: "Ouvrez Safari sur votre iPhone ou iPad — c'est important, car iOS ne prend en charge l'installation des PWA que via Safari, pas via Chrome ou d'autres navigateurs. Accédez à l'URL d'AskBiz POS et connectez-vous. Appuyez sur le bouton Partager (le carré avec une flèche vers le haut) en bas de l'écran. Faites défiler vers le bas et appuyez sur « Sur l'écran d'accueil ». Donnez un nom au raccourci (le nom par défaut « AskBiz POS » convient) et appuyez sur Ajouter. L'icône apparaît sur votre écran d'accueil. Lorsque vous l'ouvrez, AskBiz POS fonctionne en plein écran. Notez que les PWA sous iOS présentent quelques limitations par rapport à leur équivalent Android — les notifications push pour les alertes de stock peuvent se comporter différemment, et l'application peut occasionnellement avoir besoin de se recharger après une période d'inactivité. Ce sont des limitations propres à iOS, pas à AskBiz, et Apple améliore progressivement le support des PWA à chaque version d'iOS.",
      },
      {
        heading: 'Optimiser votre appareil pour l’usage PDV',
        body: "Une fois AskBiz POS installé, quelques réglages au niveau de l'appareil optimisent l'expérience. D'abord, désactivez le verrouillage automatique ou définissez un délai long — un écran de PDV qui s'éteint toutes les trente secondes est frustrant pendant un service chargé. Réglez le verrouillage automatique sur cinq ou dix minutes, ou désactivez-le complètement pendant les heures d'ouverture (pensez simplement à verrouiller manuellement en cas d'absence). Ensuite, ajustez la luminosité de l'écran à un niveau confortable. Un écran très lumineux épuise la batterie plus vite ; un écran trop sombre est difficile à lire dans un magasin bien éclairé. Troisièmement, activez le mode Ne pas déranger pendant les heures d'ouverture pour éviter que les appels entrants et les notifications n'interrompent l'interface du PDV en pleine transaction. Quatrièmement, gardez l'appareil branché ou à proximité d'un chargeur. La numérisation par caméra consomme de la batterie, et un service complet de vente peut vider la batterie d'un téléphone en milieu d'après-midi. Un simple câble de charge à la caisse résout ce problème. Enfin, fermez les applications inutiles en arrière-plan pour maximiser la mémoire disponible et garantir un fonctionnement fluide du PDV.",
      },
    ],
    faq: [
      {
        q: 'Puis-je utiliser AskBiz POS sur un ordinateur de bureau ?',
        a: 'Oui. AskBiz POS fonctionne dans tout navigateur récent sur ordinateur de bureau. Cependant, la numérisation par caméra nécessite une webcam. Pour la plupart des commerçants, un téléphone ou une tablette reste le choix le plus pratique.',
      },
      {
        q: 'Dois-je mettre à jour la PWA manuellement ?',
        a: 'Non. Les PWA se mettent à jour automatiquement. Lorsqu’AskBiz publie une nouvelle version, la mise à jour s’applique à la prochaine ouverture de l’application. Aucun téléchargement ni installation manuelle n’est nécessaire.',
      },
    ],
  },

  'pos-troubleshooting': {
    title: 'Dépannage du PDV : problèmes de caméra, de connexion et de synchronisation',
    description:
      'Une caméra qui ne scanne pas, une connexion qui ne fonctionne pas, ou des données qui ne se synchronisent pas ? Voici des solutions rapides pour les problèmes les plus courants d’AskBiz POS.',
    keywords: [
      'dépannage PDV',
      'scanner de code-barres ne fonctionne pas',
      'problèmes de connexion PDV',
      'problèmes de synchronisation PDV',
      'caméra ne scanne pas PDV',
      'aide AskBiz POS',
      'résoudre les problèmes courants du PDV',
    ],
    keyTakeaways: [
      'La plupart des problèmes d’AskBiz POS se répartissent en trois catégories : caméra/numérisation, connexion/authentification, et synchronisation des données.',
      'La majorité des problèmes se résolvent en accordant les permissions au navigateur, en vidant le cache, ou en vérifiant votre connexion internet.',
      'AskBiz consigne les événements et erreurs de synchronisation, ce qui facilite le diagnostic des problèmes sans avoir à deviner.',
    ],
    content: [
      {
        heading: 'Problèmes de caméra et de numérisation',
        body: "Si la caméra ne s'active pas lorsque vous appuyez sur le bouton de numérisation, la cause la plus fréquente est une permission de navigateur manquante. Votre navigateur a besoin d'une autorisation explicite pour accéder à la caméra, et celle-ci doit être accordée spécifiquement pour le domaine AskBiz. Sur Android, allez dans Paramètres Chrome, puis Paramètres du site, puis Caméra, et vérifiez que l'URL d'AskBiz est bien listée comme « Autorisée ». Sur iOS, allez dans Réglages, puis Safari, puis Caméra, et réglez sur « Autoriser ». Si la caméra s'active mais que les codes-barres ne sont pas reconnus, vérifiez l'éclairage — un éclairage insuffisant est la cause la plus courante d'une reconnaissance lente ou échouée. Tenez le téléphone à 15-30 centimètres du code-barres et gardez-le stable. Nettoyez l'objectif de la caméra s'il est sale. Si un code-barres précis échoue systématiquement, il est peut-être endommagé ou imprimé trop petit — essayez de saisir le produit manuellement en solution de contournement. Si la numérisation fonctionnait auparavant et a cessé de fonctionner, essayez de fermer puis de rouvrir la PWA AskBiz, ou videz le cache du navigateur pour le site AskBiz.",
      },
      {
        heading: 'Problèmes de connexion et d’authentification',
        body: "AskBiz POS utilise une connexion par lien magique, ce qui signifie qu'un lien à usage unique est envoyé à votre adresse e-mail à chaque connexion. Si vous ne recevez pas le lien magique, vérifiez d'abord votre dossier spam ou courrier indésirable — les fournisseurs de messagerie classent parfois par erreur les e-mails automatiques. Assurez-vous de saisir exactement l'adresse e-mail utilisée lors de la création de votre compte personnel (vérifiez la casse et les fautes de frappe). Si l'e-mail n'arrive toujours pas après quelques minutes, demandez au propriétaire du compte de vérifier que votre adresse e-mail est correctement enregistrée dans le système. Si vous recevez le lien magique mais qu'il ne fonctionne pas lorsque vous appuyez dessus, il a peut-être expiré — les liens magiques sont limités dans le temps pour des raisons de sécurité. Demandez-en un nouveau et appuyez dessus rapidement. Assurez-vous également d'ouvrir le lien dans le même navigateur que celui où vous utilisez AskBiz POS ; certaines applications de messagerie ouvrent les liens dans un navigateur intégré qui ne partage pas les sessions avec votre navigateur principal. Sur iOS, si le lien magique s'ouvre dans le mauvais navigateur, copiez-le et collez-le manuellement dans Safari.",
      },
      {
        heading: 'Problèmes de synchronisation des données et de connectivité',
        body: "AskBiz POS synchronise les données avec le cloud après chaque transaction. Si votre connexion internet est interrompue, l'application bascule en mode hors ligne et stocke les transactions localement jusqu'au retour de la connectivité. Une fois la connexion rétablie, les transactions en attente se synchronisent automatiquement. Si vous remarquez que les données ne se synchronisent pas (par exemple, vous traitez une vente sur le PDV mais elle n'apparaît pas dans vos rapports sur un autre appareil), vérifiez d'abord votre connexion internet. Ouvrez un site web quelconque pour confirmer que vous êtes en ligne. Si la connexion est bonne mais que la synchronisation est toujours retardée, essayez de forcer l'actualisation de la PWA : sur la plupart des navigateurs, tirez vers le bas pour actualiser ou fermez puis rouvrez l'application. Les problèmes de synchronisation persistants sont rares mais peuvent survenir si le stockage local du navigateur est saturé (fréquent sur les appareils disposant d'un espace de stockage très limité). Vider le cache du navigateur pour le site AskBiz résout généralement ce problème — vos données sont en sécurité dans le cloud, donc vider le cache local ne fait perdre aucune donnée.",
      },
      {
        heading: 'Quand contacter le support',
        body: "La plupart des problèmes d'AskBiz POS se résolvent avec les étapes ci-dessus, mais certaines situations justifient de contacter le support. Si vous voyez un code d'erreur ou un message précis, notez-le et incluez-le dans votre demande de support — cela accélère considérablement le diagnostic. Si des transactions sont manquantes (et pas simplement retardées dans la synchronisation), contactez immédiatement le support en précisant l'heure approximative et l'appareil utilisé. Si un membre du personnel ne peut pas être retiré ou si un changement de rôle ne prend pas effet, cela peut indiquer un conflit de permissions nécessitant une investigation côté serveur. Si les performances se dégradent au fil du temps (l'application devient lente ou ne répond plus), cela peut indiquer un problème au niveau de l'appareil ou un problème de volume de données que le support peut vous aider à diagnostiquer. Le support AskBiz est disponible via le chat intégré à l'application, par e-mail et via le centre d'aide. Lorsque vous signalez un problème, précisez le type d'appareil, le nom et la version du navigateur, ainsi qu'une description des étapes ayant conduit au problème. Les captures d'écran ou enregistrements d'écran sont extrêmement utiles pour les problèmes visuels.",
      },
    ],
    faq: [
      {
        q: 'Vais-je perdre des transactions si la batterie de mon téléphone s’éteint pendant une vente ?',
        a: 'Si la vente a été confirmée avant que l’appareil ne s’éteigne, elle est stockée localement et se synchronisera une fois l’appareil rechargé et reconnecté. Si la vente n’avait pas encore été confirmée, vous devrez la ressaisir.',
      },
      {
        q: 'Comment vider le cache d’AskBiz sans perdre de données ?',
        a: 'Vos données sont stockées dans le cloud, pas dans le cache du navigateur. Vider le cache supprime des fichiers temporaires qui aident l’application à se charger plus vite, mais ne supprime aucune donnée de transaction, aucun produit ni aucun paramètre.',
      },
      {
        q: 'Le PDV fonctionne lentement — que dois-je faire ?',
        a: 'Fermez les applications en arrière-plan pour libérer de la mémoire, assurez-vous que votre appareil dispose d’au moins 500 Mo d’espace de stockage libre, et redémarrez le navigateur. Si le problème persiste, essayez de redémarrer l’appareil lui-même.',
      },
    ],
  },

  'pos-data-in-dashboards': {
    title: 'Comment les données PDV alimentent votre tableau de bord AskBiz',
    description:
      'Vos transactions PDV ne se contentent pas de dormir dans une base de données — elles alimentent en temps réel les tableaux de bord, les graphiques de chiffre d’affaires et les vues de performance produit dans AskBiz.',
    keywords: [
      'tableau de bord PDV',
      'analytique point de vente',
      'tableau de bord des rapports PDV',
      'tableau de bord commerce de détail',
      'visualisation des données PDV',
      'tableau de bord askbiz pos',
    ],
    keyTakeaways: [
      'Chaque transaction PDV apparaît automatiquement dans votre tableau de bord AskBiz en quelques secondes.',
      'Les widgets du tableau de bord peuvent afficher le chiffre d’affaires, les unités vendues, la taille moyenne du panier et les meilleurs produits — le tout à partir des données PDV.',
      'Combiner les données PDV avec les ventes en ligne vous offre une véritable vue omnicanale de votre entreprise.',
    ],
    content: [
      {
        heading: 'De la caisse au tableau de bord, en temps réel',
        body: "Chaque vente traitée via AskBiz POS est enregistrée immédiatement dans votre base de données centrale. En quelques secondes, cette transaction met à jour votre tableau de bord : le chiffre d'affaires total augmente, le classement des produits se réorganise, et le compteur de ventes du jour s'incrémente. Il n'y a ni import par lots, ni synchronisation nocturne, ni export manuel. C'est la différence fondamentale entre une caisse autonome et un PDV intégré — votre couche d'intelligence voit chaque transaction au moment où elle se produit. Pour un commerçant, cela signifie que vous pouvez consulter votre téléphone à l'heure du déjeuner et savoir exactement comment la matinée s'est déroulée, quels produits se sont vendus, et si vous êtes en bonne voie pour atteindre votre objectif du jour.",
      },
      {
        heading: 'Les widgets PDV essentiels pour votre tableau de bord',
        body: "AskBiz rend automatiquement disponibles plusieurs widgets spécifiques au PDV lorsque le module est actif. **Chiffre d'affaires du jour** affiche un total en temps réel avec une comparaison au même jour la semaine précédente. **Unités vendues** suit le volume indépendamment de la valeur — utile pour repérer si une hausse du chiffre d'affaires provient d'une vente de davantage d'articles ou d'articles plus chers. **Taille moyenne du panier** calcule la valeur moyenne des transactions sur l'ensemble des ventes du jour. **Meilleurs produits** classe vos best-sellers par chiffre d'affaires ou par volume sur la période de votre choix. **Ventes par membre du personnel** indique quels caissiers traitent le plus de transactions — utile pour la planification des équipes et les évaluations de performance. Vous pouvez épingler n'importe lequel de ces widgets à votre tableau de bord d'accueil par défaut afin qu'il se charge en premier chaque matin.",
      },
      {
        heading: 'Combiner le PDV avec les ventes en ligne',
        body: "Si vous vendez également via Shopify, Amazon, Etsy ou une autre plateforme connectée, AskBiz fusionne vos données PDV avec les données en ligne dans une vue unique. C'est là que l'intelligence réelle émerge. Vous pouvez constater qu'un produit se vend bien en ligne mais bouge à peine en magasin, ou que le chiffre d'affaires en magasin en semaine surpasse celui du week-end alors que c'est l'inverse en ligne. Le widget **Chiffre d'affaires multicanal** affiche tous les canaux côte à côte. La vue **Performance produit** vous permet de comparer la même référence entre les canaux. Cette visibilité omnicanale coûte généralement aux grands détaillants des milliers de livres en analytique sur mesure — AskBiz la fournit automatiquement, car le PDV est intégré nativement plutôt que rajouté après coup.",
      },
      {
        heading: 'Configurer votre tableau de bord PDV',
        body: "Rendez-vous dans **Tableaux de bord → Créer un tableau de bord** et sélectionnez le modèle PDV, ou construisez-en un depuis zéro en ajoutant des widgets de la catégorie PDV. Organisez-les dans l'ordre qui correspond à votre revue quotidienne — la plupart des propriétaires placent le chiffre d'affaires et les unités vendues en haut à gauche, la performance produit en dessous, et les indicateurs du personnel à droite. Enregistrez-le comme vue par défaut afin qu'il se charge automatiquement à l'ouverture d'AskBiz. Si vous partagez le tableau de bord avec un responsable de magasin, il voit les mêmes données en temps réel sans avoir besoin d'accéder à l'administration complète d'AskBiz. Le partage de tableau de bord respecte les permissions liées aux rôles, un Gérant voit donc les données de vente mais pas la facturation ni les paramètres du compte.",
      },
    ],
    faq: [
      {
        q: 'À quelle vitesse les données PDV apparaissent-elles sur mon tableau de bord ?',
        a: 'En quelques secondes. AskBiz POS écrit les transactions directement dans votre base de données centrale, et les tableaux de bord puisent dans cette même source en temps réel.',
      },
      {
        q: 'Puis-je voir les ventes PDV et en ligne sur le même graphique ?',
        a: 'Oui. Le widget Chiffre d’affaires multicanal combine tous les canaux connectés — y compris le PDV — dans une vue unique, ventilée par source.',
      },
    ],
  },

  'pos-ai-chat-questions': {
    title: 'Interrogez AskBiz sur vos données PDV : 25 questions qui révèlent des insights sur votre commerce',
    description:
      'L’IA d’AskBiz peut répondre à des questions sur vos transactions PDV en langage naturel. Voici 25 questions que tout commerçant devrait poser.',
    keywords: [
      'interroger askbiz pos',
      'questions IA PDV',
      'analytique IA commerce de détail',
      'requête en langage naturel PDV',
      'chat IA askbiz commerce',
      'insights IA point de vente',
    ],
    keyTakeaways: [
      'L’IA d’AskBiz comprend vos données PDV — il suffit de poser vos questions en langage naturel.',
      'Les questions sur les tendances de chiffre d’affaires, la performance produit et les indicateurs du personnel fonctionnent d’emblée.',
      'Combiner des questions sur le PDV avec des questions sur les données en ligne vous donne des insights qu’aucun système pris isolément ne pourrait fournir.',
    ],
    content: [
      {
        heading: 'Comment l’IA comprend vos données PDV',
        body: "Lorsque vous tapez une question dans AskBiz, l'IA examine toutes vos sources de données connectées — y compris chaque transaction traitée via le PDV. Elle comprend les noms de produits, les prix, les membres du personnel, les modes de paiement, les motifs de remboursement et les périodes. Vous n'avez pas besoin d'écrire de requêtes ni de sélectionner des filtres. Posez simplement votre question en langage naturel : « Quel a été mon produit le plus vendu mardi dernier ? » ou « Quel caissier a traité le plus de remboursements ce mois-ci ? » L'IA traduit votre question en requête de données, l'exécute sur votre historique de transactions, et vous renvoie la réponse sous forme de phrase ou de graphique — selon ce qui est le plus utile. Il s'agit du même moteur IA qui fait fonctionner le reste d'AskBiz, désormais avec une visibilité complète sur vos données de commerce physique.",
      },
      {
        heading: 'Questions sur le chiffre d’affaires et les ventes',
        body: "Commencez par les fondamentaux. **« Quel a été mon chiffre d'affaires PDV total cette semaine ? »** vous donne le chiffre clé. **« Comment cette semaine se compare-t-elle à la même semaine le mois dernier ? »** ajoute du contexte. **« Quelle est la taille moyenne de mon panier ? »** vous indique si les clients achètent plus d'articles ou simplement des articles plus chers. **« Quel jour de la semaine génère le plus de chiffre d'affaires PDV ? »** aide à la planification du personnel. **« Quel pourcentage de mon chiffre d'affaires provient des espèces contre la carte ? »** éclaire votre stratégie de traitement des paiements. **« Montre-moi le chiffre d'affaires PDV quotidien des 30 derniers jours sous forme de graphique »** vous donne la tendance visuelle. Chacune de ces questions obtient sa réponse en quelques secondes et nécessiterait un travail manuel sur tableur sans l'IA.",
      },
      {
        heading: 'Questions sur les produits et le stock',
        body: "C'est sur les produits que les données PDV brillent vraiment. **« Quels sont mes 10 meilleurs produits par unités vendues ce mois-ci ? »** identifie vos articles qui tournent le mieux. **« Quels produits ont le taux de remboursement le plus élevé ? »** signale des problèmes de qualité ou de taille. **« Quels produits ne se sont pas vendus au cours des 30 derniers jours ? »** met en évidence le stock dormant. **« Quelle est ma marge moyenne par catégorie de produits ? »** montre où vous gagnez réellement de l'argent par rapport à où vous ne faites que du volume. **« Quels produits sont fréquemment achetés ensemble ? »** révèle des opportunités de vente croisée que vous pourriez manquer. **« Prédis quels produits seront en rupture de stock dans les 7 prochains jours en fonction du taux d'écoulement actuel »** transforme vos données PDV en outil de planification prospectif.",
      },
      {
        heading: 'Questions sur le personnel et les opérations',
        body: "Vos données PDV renferment une mine d'informations opérationnelles. **« Quel membre du personnel a la valeur moyenne de panier la plus élevée ? »** identifie vos meilleurs vendeurs en vente incitative. **« Quel est le temps de transaction moyen par caissier ? »** met en évidence des besoins de formation. **« Combien de transactions chaque caissier traite-t-il par heure ? »** mesure le débit. **« Montre-moi les remboursements par membre du personnel ce mois-ci »** aide à repérer des schémas qui pourraient nécessiter votre attention. **« Quelles sont les heures de pointe cette semaine ? »** optimise votre planning d'équipes. **« Compare la performance du personnel de ce mois-ci à celle du mois dernier »** suit l'évolution dans le temps. Ces questions transforment de simples journaux de transactions en une intelligence de gestion qui vous aide à mieux diriger votre commerce.",
      },
    ],
    faq: [
      {
        q: 'Puis-je demander à l’IA de comparer les ventes PDV avec ma boutique en ligne ?',
        a: 'Oui. Essayez : « Compare mon chiffre d’affaires en magasin à mon chiffre d’affaires Shopify ce mois-ci. » L’IA puise dans les deux sources et présente une comparaison côte à côte.',
      },
      {
        q: 'Que faire si l’IA donne une réponse incorrecte sur mes données PDV ?',
        a: 'Vérifiez que la période et les noms de produits dans la réponse correspondent à votre question. Si les données semblent incorrectes, vérifiez que toutes les transactions PDV se sont bien synchronisées en consultant le journal des transactions. Vous pouvez signaler une réponse inexacte à l’aide du bouton pouce vers le bas.',
      },
    ],
  },

  'pos-daily-brief-integration': {
    title: 'Comment les données PDV apparaissent dans votre Daily Brief',
    description:
      'Votre Daily Brief AskBiz inclut automatiquement des insights PDV — le chiffre d’affaires d’hier, les meilleurs produits, les alertes de stock et les anomalies de votre magasin physique.',
    keywords: [
      'daily brief pdv',
      'résumé quotidien commerce de détail',
      'rapport matinal pdv',
      'daily brief askbiz pdv',
      'rapport pdv automatisé',
      'insights quotidiens commerce de détail',
    ],
    keyTakeaways: [
      'Le Daily Brief inclut automatiquement les données PDV lorsque le module est actif — aucune configuration n’est nécessaire.',
      'Il met en évidence le chiffre d’affaires d’hier, les meilleures ventes, les alertes de stock et tout schéma inhabituel.',
      'Comparer votre Daily Brief d’un jour à l’autre révèle des tendances que les journaux de transactions pris individuellement ne peuvent pas montrer.',
    ],
    content: [
      {
        heading: 'Ce que le Daily Brief inclut à partir de votre PDV',
        body: "Lorsque AskBiz POS est activé, votre Daily Brief du matin ajoute automatiquement une section commerce de détail. Elle comprend le chiffre d'affaires PDV total d'hier et sa comparaison avec le même jour la semaine précédente, les trois meilleurs produits par unités vendues, tout produit ayant déclenché une alerte de stock faible ou une rupture de stock pendant la nuit, ainsi qu'un classement du personnel montrant les transactions et le chiffre d'affaires par caissier. Si vous avez également des canaux en ligne connectés, le Brief affiche une répartition par canal afin que vous puissiez voir comment la performance en magasin se compare aux ventes numériques. Tout cela arrive dans votre boîte de réception ou sur l'écran d'accueil AskBiz avant l'ouverture du magasin — vous offrant un tableau complet de la veille et une longueur d'avance pour la journée.",
      },
      {
        heading: 'Détection d’anomalies pour le commerce de détail',
        body: "Le Daily Brief ne se contente pas de rapporter des chiffres — il signale tout ce qui sort de l'ordinaire. Si le chiffre d'affaires d'hier était nettement supérieur ou inférieur à la moyenne récente, le Brief le souligne et suggère des raisons possibles (un événement local, un changement de prix, une absence du personnel). Si un produit qui se vend normalement à dix unités par jour n'en a vendu aucune, cela est également signalé — cela peut indiquer un problème de mise en rayon, un problème de stock ou une erreur de numérisation. Ces anomalies remontent automatiquement grâce au même moteur de détection qui surveille vos canaux en ligne. Pour un commerçant occupé, cela signifie que vous n'avez pas besoin de comparer manuellement des tableurs pour repérer les problèmes — le Brief le fait pour vous chaque matin.",
      },
      {
        heading: 'Personnaliser votre Brief PDV',
        body: "Le Daily Brief est conçu pour fonctionner d'emblée, mais vous pouvez le personnaliser. Rendez-vous dans **Paramètres → Daily Brief → Section PDV** pour choisir les indicateurs affichés, définir des périodes de comparaison (jour par jour, semaine par semaine ou mois par mois), et ajouter ou retirer le classement du personnel. Si vous gérez plusieurs établissements, vous pouvez recevoir un Brief distinct par établissement ou une vue consolidée. Vous pouvez également définir l'heure de livraison — la plupart des commerçants préfèrent le recevoir 30 minutes avant l'ouverture, afin d'avoir le temps de le consulter devant un café avant l'arrivée du premier client.",
      },
      {
        heading: 'Agir en fonction de votre Brief',
        body: "Le meilleur Daily Brief est celui qui conduit à une action. Si le chiffre d'affaires a baissé hier, demandez à l'IA pourquoi : « Pourquoi le chiffre d'affaires PDV était-il inférieur à la normale hier ? » Si un produit vient à manquer, réapprovisionnez-le avant l'ouverture du magasin. Si un caissier surpasse systématiquement les autres sur la valeur du panier, comprenez ce qu'il fait différemment et partagez-le avec l'équipe. Le Brief n'est pas un rapport à classer — c'est une invitation à décider. Semaine après semaine, mois après mois, consulter votre Brief quotidiennement développe une compréhension intuitive des rythmes de votre entreprise qu'aucun reporting ponctuel ne peut remplacer.",
      },
    ],
    faq: [
      {
        q: 'Dois-je configurer quoi que ce soit pour que les données PDV apparaissent dans mon Brief ?',
        a: 'Non. Une fois le PDV activé, le Daily Brief inclut automatiquement les données commerce de détail dès le lendemain matin. Vous pouvez personnaliser les indicateurs affichés dans les Paramètres.',
      },
      {
        q: 'Puis-je recevoir également un Brief en milieu de journée ?',
        a: 'Oui. Allez dans Paramètres → Daily Brief → Planification et ajoutez une seconde livraison à l’heure de votre choix. Certains commerçants en programment un pour l’ouverture et un autre après le rush du déjeuner.',
      },
    ],
  },

  'pos-business-pulse-impact': {
    title: 'Comment les transactions PDV affectent votre score Business Pulse',
    description:
      'Votre score Business Pulse prend en compte les tendances de chiffre d’affaires PDV, la santé du stock et les schémas de transactions. Voici exactement comment cela fonctionne.',
    keywords: [
      'business pulse pdv',
      'score de santé pdv',
      'score commerce de détail',
      'askbiz pulse pdv',
      'score de performance pdv',
      'santé de l’entreprise commerce de détail',
    ],
    keyTakeaways: [
      'Les tendances de chiffre d’affaires PDV, la santé du stock et les taux de remboursement alimentent tous votre score Business Pulse.',
      'Un chiffre d’affaires PDV quotidien régulier améliore la composante de stabilité de votre score.',
      'Des taux de remboursement élevés ou des ruptures de stock fréquentes feront baisser votre score.',
    ],
    content: [
      {
        heading: 'Ce que mesure le score Business Pulse',
        body: "Le Business Pulse est un score composite de 0 à 100 qui reflète la santé globale de votre entreprise. Il combine cinq dimensions : la santé du chiffre d'affaires (tendance, régularité, croissance), la santé de la trésorerie (autonomie financière, créances), la santé client (rétention, risque d'attrition), la santé opérationnelle (remboursements, exécution, fiabilité des fournisseurs) et les signaux de marché. Lorsque le PDV est activé, vos données de transactions en magasin alimentent directement les dimensions chiffre d'affaires et opérationnelle. Cela signifie que chaque vente que vous traitez — et chaque remboursement que vous effectuez — a un impact mesurable sur votre score Pulse. Le score est recalculé chaque jour pour les utilisateurs du niveau gratuit et en temps réel pour les utilisateurs des forfaits Growth et Business.",
      },
      {
        heading: 'Comment les données PDV influencent chaque dimension',
        body: "**La santé du chiffre d'affaires** est la plus directement affectée. Le Pulse suit la tendance de votre chiffre d'affaires PDV sur des fenêtres glissantes de 7 et 30 jours. Un chiffre d'affaires stable ou croissant fait monter le score ; un chiffre d'affaires en baisse le fait descendre. La volatilité compte également — un magasin qui gagne 500 £ chaque jour obtient un meilleur score de régularité qu'un autre qui oscille entre 200 £ et 800 £, même si les moyennes sont identiques. **La santé opérationnelle** prend en compte votre taux de remboursement (remboursements en pourcentage des ventes brutes), la fréquence des ruptures de stock et la rotation des stocks. Un taux de remboursement élevé signale des problèmes de qualité produit ou de satisfaction client. Des ruptures de stock fréquentes signalent une mauvaise planification du stock. Les deux réduisent votre score opérationnel.",
      },
      {
        heading: 'Améliorer votre Pulse grâce aux données PDV',
        body: "Concentrez-vous sur les leviers que vous pouvez contrôler. Pour améliorer la régularité du chiffre d'affaires, analysez vos schémas de ventes quotidiens et corrigez les creux — le lundi est-il toujours calme ? Envisagez une promotion du lundi. Pour améliorer votre taux de remboursement, examinez les motifs en détail : certains produits sont-ils retournés plus souvent ? Les remboursements sont-ils concentrés autour d'un seul membre du personnel ? Pour améliorer la santé du stock, configurez des alertes de stock faible dans AskBiz POS et réapprovisionnez de façon proactive plutôt que réactive. Chacune de ces actions agit sur une dimension précise du Pulse et devrait produire une amélioration mesurable en une à deux semaines d'exécution régulière.",
      },
      {
        heading: 'Lire l’évolution de votre Pulse dans le temps',
        body: "Un score Pulse isolé n'est qu'un instantané. La véritable valeur réside dans la tendance. Rendez-vous dans **Intelligence → Business Pulse → Tendance** pour voir votre score sur les 90 derniers jours. Repérez les points d'inflexion — les moments où le score a changé de direction — et mettez-les en relation avec ce qui s'est passé dans l'entreprise. Le score a-t-il chuté lorsque vous étiez en rupture de stock sur un produit clé ? A-t-il augmenté lorsque vous avez ajouté un nouveau caissier et réduit les temps d'attente en caisse ? Ces corrélations transforment le Pulse d'un indicateur de vanité en un véritable outil de diagnostic. Avec le temps, vous développerez une intuition de ce qui fait bouger votre score, et cette intuition éclairera de meilleures décisions au quotidien.",
      },
    ],
    faq: [
      {
        q: 'Le score Pulse traite-t-il le chiffre d’affaires PDV et en ligne de la même façon ?',
        a: 'Oui. Le chiffre d’affaires reste du chiffre d’affaires, quel que soit le canal. Le Pulse combine toutes les sources connectées en une seule évaluation de santé du chiffre d’affaires, pondérée par leur part dans le chiffre d’affaires total.',
      },
      {
        q: 'À quelle vitesse un remboursement PDV affecte-t-il mon Pulse ?',
        a: 'Sur les forfaits Growth et Business, le Pulse se met à jour en temps réel. Sur le niveau gratuit, il se recalcule pendant la nuit. Un remboursement isolé sur une entreprise en bonne santé aura un impact négligeable — le score réagit aux schémas, pas aux transactions individuelles.',
      },
    ],
  },

  'pos-offline-mode': {
    title: 'Mode hors ligne : que se passe-t-il quand votre connexion internet coupe en pleine vente',
    description:
      'AskBiz POS est une PWA capable de gérer de brèves pertes de connectivité. Voici ce qui fonctionne hors ligne, ce qui ne fonctionne pas, et comment récupérer en douceur.',
    keywords: [
      'mode hors ligne pdv',
      'pdv sans internet',
      'point de vente hors ligne',
      'pwa hors ligne commerce',
      'problèmes de connectivité pdv',
      'askbiz pos hors ligne',
    ],
    keyTakeaways: [
      'AskBiz POS met en cache localement votre catalogue produits afin que vous puissiez continuer à ajouter des articles au panier pendant de brèves coupures.',
      'Les transactions sont mises en file d’attente localement et se synchronisent automatiquement au retour de la connectivité.',
      'Les coupures prolongées (plus de 30 minutes) nécessitent un rapprochement manuel — rétablissez toujours la connectivité aussi vite que possible.',
    ],
    content: [
      {
        heading: 'Comment fonctionne le mode hors ligne',
        body: "AskBiz POS fonctionne comme une Progressive Web App, ce qui signifie que le code de l'application et votre catalogue produits sont mis en cache sur l'appareil après le premier chargement. Si votre connexion internet est interrompue en pleine vente, l'application reste fonctionnelle — vous pouvez continuer à scanner des produits, ajouter des articles au panier, ajuster les quantités et terminer le parcours d'encaissement. La transaction est enregistrée localement sur l'appareil et placée dans une file d'attente de synchronisation. Au retour de la connectivité, la file se traite automatiquement et toutes les transactions en attente sont téléversées vers le serveur. Une petite bannière en haut de l'écran indique le statut hors ligne, et une autre confirme la fin de la synchronisation.",
      },
      {
        heading: 'Ce qui fonctionne et ce qui ne fonctionne pas',
        body: "**Fonctionne hors ligne :** parcourir votre catalogue produits, ajouter des articles au panier, traiter des ventes (en espèces uniquement — les terminaux de paiement par carte nécessitent une connexion), générer un reçu local. **Ne fonctionne pas hors ligne :** la numérisation par caméra pour les nouveaux produits absents de votre catalogue (l'API de reconnaissance nécessite une connexion serveur), la vérification des niveaux de stock en temps réel, l'envoi de reçus WhatsApp, la connexion du personnel par lien magique, et la synchronisation avec les tableaux de bord. Les paiements par carte nécessitent une connexion active au prestataire de paiement — si vous êtes hors ligne, vous ne pouvez accepter que les espèces. Cette limitation vient du réseau de cartes bancaires, pas d'AskBiz.",
      },
      {
        heading: 'Récupérer après une coupure prolongée',
        body: "Les brèves coupures de quelques minutes sont gérées de façon transparente — la file de synchronisation se traite et tout se rapproche automatiquement. Les coupures prolongées de 30 minutes ou plus créent une file plus longue qui peut prendre une minute à se synchroniser au retour de la connectivité. Pendant ce temps, les données du tableau de bord et les niveaux de stock seront temporairement obsolètes. Si l'appareil s'éteint ou si le navigateur plante alors que des transactions hors ligne sont en file d'attente, le service worker de la PWA conserve la file dans le stockage local. Lorsque vous rouvrez l'application, elle tentera de synchroniser toute transaction en attente. Dans le rare cas où une transaction serait perdue, vous pouvez effectuer un rapprochement manuel à l'aide des reçus papier ou locaux émis pendant la coupure.",
      },
      {
        heading: 'Bonnes pratiques pour la connectivité',
        body: "Mieux vaut prévenir que guérir. Utilisez une connexion haut débit dédiée pour votre appareil PDV plutôt que de vous fier au Wi-Fi public. Gardez un point d'accès mobile 4G/5G en secours — une simple carte SIM à 10 £/mois peut vous éviter de perdre des ventes lors d'une coupure de la connexion haut débit. Positionnez votre appareil PDV dans une zone de bonne couverture Wi-Fi — les murs épais et les étagères métalliques peuvent dégrader le signal. Si vous opérez sur des marchés, des pop-up stores ou des événements en extérieur où la connectivité est peu fiable, préchargez l'intégralité de votre catalogue produits avant de partir et emportez un point d'accès mobile. Testez votre capacité hors ligne avant d'en avoir besoin — mettez votre appareil en mode avion et effectuez une transaction test pour confirmer que tout fonctionne.",
      },
    ],
    faq: [
      {
        q: 'Vais-je perdre des données de vente si mon internet tombe en panne ?',
        a: 'Non. Les transactions sont enregistrées localement sur l’appareil et se synchronisent au retour de la connectivité. Les données ne sont en risque que si l’appareil s’éteint ET que le cache du navigateur est vidé avant la reconnexion — un cas de figure extrêmement rare.',
      },
      {
        q: 'Puis-je traiter des paiements par carte hors ligne ?',
        a: 'Non. Les paiements par carte nécessitent une connexion active au prestataire de paiement. Pendant une coupure, vous ne pouvez accepter que les espèces. Il s’agit d’une limitation des réseaux de cartes bancaires, pas d’AskBiz.',
      },
    ],
  },

  'multi-location-retail-management': {
    title: 'Gestion multi-sites du commerce de détail : le guide complet',
    description:
      'Pourquoi un stock distinct par succursale est essentiel, comment structurer des opérations multi-sites, et les pièges courants qui piègent les commerçants en pleine croissance.',
    keywords: [
      'commerce multi-sites',
      'gestion de plusieurs magasins',
      'gestion de succursales',
      'expansion commerciale',
      'deuxième magasin',
      'commerce de détail multi-sites',
    ],
    keyTakeaways: [
      'Chaque succursale doit maintenir un stock indépendant pour éviter la survente et permettre des rapports précis par site.',
      'Une propriété centralisée avec des opérations décentralisées est le modèle standard — le personnel travaille localement, le propriétaire voit tout.',
      'L’erreur la plus courante lors de l’ouverture d’un deuxième site est de traiter le stock comme un seul pool partagé.',
    ],
    content: [
      {
        heading: 'Pourquoi un seul magasin est simple et deux magasins sont difficiles',
        body: "Gérer un seul magasin est simple : un seul stock, une seule équipe, une seule caisse. Dès que vous ouvrez un deuxième site, la complexité se multiplie. Le stock, qui était une liste unique, devient deux listes susceptibles de diverger. Le personnel, qui connaissait tout, ne connaît désormais plus que sa propre succursale. Le chiffre d'affaires, qui était un seul chiffre, devient deux chiffres qu'il faut comparer, combiner et mettre en contexte. Les commerçants qui réussissent leur expansion sont ceux qui mettent en place des systèmes pour gérer cette complexité avant même d'ouvrir la deuxième porte.",
      },
      {
        heading: 'Le principe du stock distinct',
        body: "La règle la plus importante du commerce multi-sites est que chaque succursale doit tenir son propre décompte de stock. Un produit affichant 20 unités en stock ne veut rien dire si vous ignorez si ces 20 unités se trouvent dans votre magasin de rue principale ou dans votre entrepôt. Un stock distinct signifie que chaque succursale suit ses propres niveaux de stock, déclenche ses propres alertes de stock faible et affiche sa propre disponibilité produit. Cela évite l'erreur multi-sites la plus courante de toutes : un client de la succursale A à qui l'on dit qu'un produit est en stock alors qu'il se trouve en réalité sur une étagère de la succursale B.",
      },
      {
        heading: 'Visibilité centralisée, opérations décentralisées',
        body: "Le propriétaire ou le Gérant doit avoir accès à des données consolidées sur l'ensemble des succursales — chiffre d'affaires total, valeur de stock combinée, marge globale. Mais le caissier de chaque succursale n'a besoin de voir que ses propres produits et ses propres ventes. Ce modèle à double vue est la norme dans les systèmes de point de vente modernes. Le personnel est cantonné à sa succursale par souci de clarté opérationnelle et de sécurité, tandis que le propriétaire dispose d'un tableau de bord agrégeant l'ensemble des données, avec la possibilité de zoomer sur un site en particulier.",
      },
      {
        heading: 'Pièges courants lors de l’expansion',
        body: "Les erreurs les plus fréquentes commises par les commerçants lors de l'ouverture d'un deuxième site : traiter le stock comme un seul pool partagé (entraîne de la survente), ne pas affecter le personnel à des succursales précises (entraîne une confusion des données), ne pas comparer la performance des succursales (un site sous-performe silencieusement), et ne pas disposer de processus de transfert de stock (surplus dans une succursale pendant qu'une autre est en rupture). Un bon système de point de vente multi-succursales prévient tout cela en imposant une séparation au niveau des données.",
      },
      {
        heading: 'Quand ouvrir un troisième site',
        body: "Si votre deuxième succursale est rentable, opérationnellement stable, et que vos systèmes gèrent la complexité à deux sites sans contournements manuels, vous êtes prêt pour un troisième. Le passage de deux à trois sites est plus facile que celui de un à deux, car vous avez déjà résolu les problèmes d'architecture. L'indicateur clé à surveiller est de savoir si vos marges par succursale restent stables à mesure que vous ajoutez des sites — si les marges se réduisent à chaque nouvelle succursale, vous vous éparpillez trop.",
      },
    ],
    faq: [
      {
        q: 'Dois-je utiliser des systèmes de point de vente distincts pour chaque succursale ?',
        a: 'Non. Un système de point de vente unique prenant en charge le multi-succursales vous offre des rapports consolidés, une gestion du personnel simplifiée, et la possibilité de transférer du stock entre les sites. Des systèmes distincts créent des silos de données.',
      },
      {
        q: 'Combien de succursales une petite entreprise peut-elle raisonnablement gérer ?',
        a: 'Cela dépend de l’entreprise, mais la plupart des PME constatent que 2 à 5 sites restent gérables avec de bons systèmes. Au-delà, il faut généralement des responsables régionaux ou des superviseurs de secteur pour maintenir la qualité.',
      },
    ],
  },
}
