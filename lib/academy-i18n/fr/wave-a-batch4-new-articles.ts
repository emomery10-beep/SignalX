// Academy article translations — Français (fr) — Wave A, Batch 4.
//
// The 12 new AskBiz Tutorials articles added in Milestone 1 (commit
// e918cb95, 2026-07-25/26): Purchase Orders, five Sources connectors
// (Marketing & Ads bundle, GoCardless, Linnworks, Xero/FreeAgent, Jumia),
// the redesigned WhatsApp till receipt, the WhatsApp daily P&L brief, the
// self-service PIN reset flow, the Zakat calculator, the Factory sector
// guide, and the POS free trial. These are NOT part of the "Point of Sale &
// Retail" 39-article cluster translated in wave-a-batch1/2/3 — see
// docs/i18n/academy-translation-progress.md, Wave A source breakdown.
//
// Reuses, verbatim, the canonical fr glossary locked by the sibling agent
// that translated Wave A Batch 1 (see that file's header for the base
// list). This batch introduces additional domain vocabulary the original
// glossary didn't need to cover (Sources/connectors, purchase orders,
// factory-floor terms, zakat, billing/trial terms). Full addendum reported
// to the orchestrator alongside this file for reuse by sibling batches.
//
// Merged into lib/academy-i18n/fr/index.ts by a later step — this file is
// NOT imported anywhere yet.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch4NewArticlesTranslations: LocaleTranslations = {
  'purchase-orders-guide-askbiz': {
    title: "Bons de commande : créer, envoyer et réceptionner des commandes fournisseurs dans AskBiz POS",
    description:
      "Comment fonctionne réellement la tuile Bons de commande dans POS > Opérations : créer une commande avec des quantités de réapprovisionnement suggérées automatiquement, l'envoyer à votre fournisseur via WhatsApp, et réceptionner le stock (y compris les livraisons partielles) sans jamais ouvrir un tableur.",
    keywords: [
      "bons de commande",
      "commandes fournisseurs",
      "réapprovisionnement",
      "réassort",
      "PDV",
      "AskBiz",
      "stock",
      "commande en attente",
      "fournisseur WhatsApp",
      "réceptionner le stock",
    ],
    keyTakeaways: [
      "Les bons de commande se trouvent dans POS > Opérations > Commerce de détail, accessibles via la tuile 📋 — c'est un onglet à part entière, pas une fenêtre surgissante greffée sur l'onglet Stock.",
      "Démarrer une nouvelle commande préremplit automatiquement chaque produit dont le stock est au niveau ou en dessous de son seuil de réapprovisionnement, avec une quantité suggérée qui le ramène au double de ce seuil, ainsi que le dernier prix de revient enregistré du produit — vous pouvez toujours modifier ou supprimer n'importe quelle ligne, ou ajouter des produits manuellement.",
      "Envoyer un bon de commande adresse un message détaillé, ligne par ligne, au numéro WhatsApp de votre fournisseur ; si le modèle automatisé n'est pas disponible, AskBiz bascule vers un lien wa.me prérempli que vous appuyez pour envoyer vous-même. Un fournisseur sans numéro de téléphone enregistré ne peut tout simplement pas recevoir de commande.",
      "La réception du stock se fait ligne par ligne, donc les livraisons partielles sont normales : une commande passe au statut « Partielle » dès qu'une ligne est incomplète, et ne bascule en « Reçue » que lorsque toutes les lignes sont intégralement arrivées.",
      "Ce que vous pouvez faire dépend de votre rôle PDV — Propriétaire et Gérant ont un accès complet, le rôle Stock peut créer et réceptionner mais pas envoyer, et Superviseur/Responsable de succursale ne peuvent que consulter.",
    ],
    content: [
      {
        heading: "Où le trouver",
        body: "Les bons de commande se trouvent sous forme de tuile dans POS > Opérations, dans le secteur Commerce de détail — repérez l'icône 📋. En appuyant dessus, vous ouvrez un onglet Bons de commande dédié, avec sa propre liste, des filtres (Toutes / En attente / Reçues) et un bouton « + Nouvelle commande » en haut à droite. Si jusqu'ici votre façon de vous réapprovisionner consistait à écrire à un fournisseur depuis votre propre téléphone en espérant vous souvenir de chaque article, c'est précisément l'outil qui remplace cette habitude — il vit dans la même application que vous utilisez déjà pour vendre, donc il n'y a rien de séparé où se connecter.",
      },
      {
        heading: "Créer une nouvelle commande",
        body: "Appuyez sur « + Nouvelle commande » : on vous demandera d'abord un fournisseur — choisissez-en un existant dans le menu déroulant, ou ajoutez-en un nouveau sur place avec juste un nom et un numéro de téléphone. Le numéro de téléphone compte : c'est lui que l'étape d'envoi WhatsApp utilisera ensuite, et sans lui, cette commande ne pourra pas être envoyée — seulement créée et suivie manuellement.\n\nSous le fournisseur, la liste des articles s'ouvre déjà préremplie : AskBiz repère chaque produit actuellement au niveau ou en dessous de son seuil de réapprovisionnement et l'ajoute comme ligne, avec une quantité suggérée calculée pour ramener le stock à environ le double de ce seuil, et un coût unitaire tiré du dernier prix de revient enregistré du produit. Rien de tout cela n'est obligatoire — modifiez la quantité ou le coût sur n'importe quelle ligne, supprimez les lignes que vous ne voulez pas, ou utilisez le menu déroulant « Ajouter un produit » en dessous pour intégrer autre chose de votre catalogue qui n'était pas en stock faible. Un total s'actualise au fur et à mesure, et un champ de notes en bas est idéal pour des instructions de livraison ou un numéro de référence attendu par votre fournisseur.",
      },
      {
        heading: "Les cinq statuts de commande",
        body: "Chaque commande se trouve dans l'un des cinq états, affiché sous forme de pastille colorée sur sa carte : Brouillon (créée mais pas encore envoyée), Commandée (envoyée au fournisseur, rien de reçu), Partielle, Reçue, ou Annulée. Le statut Partielle mérite qu'on s'y attarde — ce n'est pas une action que vous choisissez, c'est ce que devient automatiquement une commande dès l'instant où vous avez reçu une partie, mais pas la totalité, de ce que vous avez commandé. Si vous commandez 50 unités d'un article et que 30 arrivent aujourd'hui, le reste étant prévu la semaine suivante, la commande passe en Partielle dès que vous enregistrez ces 30 unités, et y reste — en indiquant précisément ce qui manque encore — jusqu'à ce que les 20 restantes arrivent et qu'elle bascule en Reçue d'elle-même. Le filtre En attente en haut de la liste regroupe simplement toutes les commandes actuellement au statut Partielle, pour que vous puissiez voir d'un coup d'œil quelles livraisons vous sont encore dues.",
      },
      {
        heading: "Envoyer une commande à votre fournisseur",
        body: "Ouvrez n'importe quelle commande au statut Brouillon ou Commandée et appuyez sur Envoyer (le bouton affiche Renvoyer une fois que la commande est déjà partie une première fois). AskBiz compose un message détaillé — chaque ligne au format « article x quantité @ coût », le total, et vos notes si vous en avez ajouté — et tente de le livrer sous forme de message-modèle WhatsApp automatisé directement au numéro du fournisseur. Si cette voie automatisée n'est pas disponible, AskBiz bascule vers l'ouverture d'un lien wa.me prérempli dans un nouvel onglet, avec le même message déjà rédigé — il ne vous reste plus qu'à appuyer sur envoyer dans WhatsApp. Dans les deux cas, une commande en Brouillon passe en Commandée dès son premier envoi, et l'horodatage d'envoi est actualisé à chaque envoi ultérieur. Si la fiche fournisseur n'a pas de numéro de téléphone, le bouton Envoyer est désactivé et une indication vous invite à en ajouter un — impossible de contourner l'obligation d'avoir un numéro.",
      },
      {
        heading: "Réceptionner le stock",
        body: "Quand la marchandise arrive, ouvrez la commande et appuyez sur « Réceptionner le stock ». Vous verrez chaque ligne avec un champ déjà préréglé sur la quantité totale restant à recevoir (ce qui a été commandé moins ce qui a déjà été reçu sur cette ligne) — les lignes déjà intégralement reçues sont grisées et ne peuvent plus rien accepter. Ajustez une quantité à la baisse si seule une partie de cette ligne est arrivée, puis confirmez.\n\nC'est la confirmation qui déplace réellement le stock : chaque ligne incrémente de façon atomique le compteur de stock en temps réel de ce produit dans votre inventaire (le même chiffre que lisent votre caisse et l'écran Vue d'ensemble), et le statut de la commande est recalculé à partir des nouveaux chiffres — Reçue si toutes les lignes sont désormais complètes, Partielle si certaines lignes manquent encore, inchangé sinon. Vous pouvez revenir réceptionner sur la même commande plusieurs fois, au fur et à mesure qu'une livraison arrive en plusieurs étapes ; chaque réception ne porte que sur ce qui reste en attente.",
      },
      {
        heading: "Qui peut faire quoi",
        body: "Les actions sur les bons de commande sont soumises à des permissions selon le rôle PDV, et non à un simple interrupteur tout-ou-rien. Propriétaire et Gérant peuvent consulter, créer, envoyer, réceptionner et marquer les commandes comme payées. Le rôle Stock peut créer et réceptionner des commandes (et les marquer comme payées) mais ne peut pas les envoyer — l'envoi est délibérément réservé à l'encadrement. Les rôles Superviseur et Responsable de succursale peuvent consulter les commandes et leur statut, mais ne peuvent ni créer, ni envoyer, ni réceptionner. Si un bouton semble désactivé ou qu'une personne vous dit ne pas voir l'option Envoyer, vérifiez d'abord son rôle attribué avant de penser à un problème technique.",
      },
    ],
    faq: [
      {
        q: "Pourquoi AskBiz a-t-il déjà ajouté des articles à mon nouveau bon de commande avant même que je ne tape quoi que ce soit ?",
        a: "Le formulaire de création préremplit automatiquement chaque produit actuellement au niveau ou en dessous de son seuil de réapprovisionnement, avec une quantité suggérée qui le ramène à environ le double de ce seuil, ainsi que le dernier prix de revient enregistré. C'est un point de départ, pas une commande définitive — modifiez, supprimez ou ajoutez librement des lignes avant d'enregistrer.",
      },
      {
        q: "Que signifie réellement le statut « Partielle » sur une commande ?",
        a: "Cela signifie une commande en attente : une partie, mais pas la totalité, de la quantité commandée est arrivée. Le statut est appliqué automatiquement dès que vous réceptionnez une quantité inférieure au total restant sur au moins une ligne, et la commande reste au statut Partielle jusqu'à ce que toutes les lignes soient intégralement reçues.",
      },
      {
        q: "Puis-je envoyer un bon de commande sans numéro de téléphone fournisseur ?",
        a: "Non. L'envoi livre la commande sous forme de message WhatsApp (ou, à défaut, d'un lien WhatsApp prérempli), donc le fournisseur doit avoir un numéro de téléphone enregistré avant que vous puissiez lui envoyer quoi que ce soit. Vous pouvez tout de même créer et suivre la commande sans numéro — vous ne pourrez simplement pas l'envoyer tant qu'un numéro n'aura pas été ajouté.",
      },
      {
        q: "Si je reçois une partie d'une commande aujourd'hui, puis-je réceptionner le reste plus tard ?",
        a: "Oui. Chaque réception ne porte que sur les quantités encore en attente, et vous pouvez rouvrir la même commande pour réceptionner à nouveau au fur et à mesure des livraisons suivantes. Le stock est ajouté de façon incrémentale à chaque fois — rien n'est annulé ni écrasé entre deux réceptions.",
      },
      {
        q: "Quels rôles du personnel peuvent envoyer un bon de commande à un fournisseur ?",
        a: "Seuls Propriétaire et Gérant peuvent envoyer une commande. Le personnel avec le rôle Stock peut créer et réceptionner des commandes mais pas les envoyer, et les rôles Superviseur/Responsable de succursale peuvent uniquement consulter les commandes, sans pouvoir agir dessus.",
      },
    ],
  },

  'connect-marketing-ads-sources-askbiz': {
    title: "Connecter vos données marketing : Meta Ads, Google Ads, Google Analytics, Mailchimp et Klaviyo",
    description: "Comment connecter les cinq sources Marketing et publicité dans AskBiz — Meta Ads, Google Ads, Google Analytics, Mailchimp et Klaviyo — et ce que chacune synchronise dans votre tableau de bord.",
    keywords: [
      "Meta Ads", "Google Ads", "Google Analytics", "Mailchimp", "Klaviyo",
      "sources Marketing et publicité", "Sources AskBiz", "dépenses publicitaires", "ROAS",
      "email marketing", "connecter ses données marketing",
    ],
    keyTakeaways: [
      "Sources > Marketing et publicité regroupe cinq connecteurs : Meta Ads, Google Ads, Google Analytics, Mailchimp et Klaviyo — chacun apporte une facette différente de votre performance marketing dans AskBiz.",
      "Quatre des cinq se connectent en un clic via OAuth (Meta Ads, Google Ads, Google Analytics, Mailchimp). Klaviyo fait exception — vous y collez une clé API privée à la place, car Klaviyo ne propose pas de parcours d'application OAuth pour ce type d'accès en lecture.",
      "Chaque source alimente des chiffres différents : Meta Ads et Google Ads apportent les dépenses, le ROAS, le CPM et le CPC, Google Analytics apporte le trafic du site et les tunnels de conversion, Mailchimp apporte la performance des campagnes, et Klaviyo apporte le chiffre d'affaires attribué aux e-mails.",
      "Sur le plan Free, vous pouvez connecter jusqu'à 3 sources de données au total, tous secteurs confondus — donc une combinaison comme Meta Ads, Mailchimp et votre PDV épuise déjà tout votre quota. Les plans Growth et Business suppriment entièrement ce plafond.",
      "Ce ne sont pas des connecteurs provisoires — chacun repose sur une véritable logique de synchronisation, donc une fois connectés, ils continuent d'extraire des données réelles en continu, et non une simple importation ponctuelle.",
    ],
    content: [
      {
        heading: "Où les trouver",
        body: "Ouvrez Sources depuis la navigation principale d'AskBiz. Les connecteurs sont regroupés par catégorie, et Marketing et publicité en est une, aux côtés d'E-commerce, Comptabilité, Paiements et les autres. Vous y trouverez cinq cartes : Meta Ads, Google Ads, Google Analytics, Mailchimp et Klaviyo. Vous pouvez aussi utiliser le champ de recherche en haut de la page Sources — taper « ads », « mailchimp » ou « klaviyo » filtre directement jusqu'à la carte correspondante. Chaque carte affiche une brève description de ce qu'elle synchronise, ainsi qu'un bouton Connecter. Une fois connectée, une source remonte dans la liste « Connectées » en haut de la page, où vous pouvez déclencher une synchronisation manuelle ou la déconnecter à tout moment.",
      },
      {
        heading: "Meta Ads — performance publicitaire Facebook et Instagram",
        body: "Meta Ads connecte votre compte publicitaire Facebook et Instagram. Cliquez sur Connecter et AskBiz vous redirige vers Meta pour vous connecter et approuver l'accès en lecture à vos comptes publicitaires — rien à taper ni à coller. Une fois approuvé, il synchronise vos dépenses publicitaires ainsi que le ROAS (retour sur dépense publicitaire), le CPM (coût pour mille impressions) et le CPC (coût par clic), afin que vous puissiez voir ce que votre budget publicitaire rapporte réellement sans ouvrir Ads Manager séparément. C'est utile pour relier ce que vous dépensez en publicités Facebook et Instagram à ce qui atterrit réellement dans vos ventes — surtout si vous utilisez aussi Instagram Shopping ou une boutique Shopify via AskBiz, puisque dépenses et chiffre d'affaires se retrouvent alors côte à côte.",
      },
      {
        heading: "Google Ads — performance des campagnes de recherche",
        body: "Google Ads fonctionne de la même façon que Meta Ads : cliquez sur Connecter, connectez-vous à votre compte Google, et approuvez l'accès en lecture seule à vos comptes publicitaires. Il synchronise les dépenses de vos campagnes de recherche, le ROAS et les conversions, afin que vous puissiez suivre ce que vos publicités Google Search vous coûtent par rapport à ce qu'elles convertissent. Si vous utilisez déjà Google Ads pour générer du trafic vers un site ou une boutique, le connecter ici fait apparaître ces dépenses aux côtés de vos autres chiffres marketing et de chiffre d'affaires, au lieu qu'elles ne vivent que dans une connexion Google Ads séparée.",
      },
      {
        heading: "Google Analytics — trafic du site et tunnels de conversion",
        body: "Google Analytics est un connecteur distinct de Google Ads, même si les deux passent par la connexion Google. Celui-ci se connecte à une propriété GA4 de votre site web — il s'agit de ce qui se passe une fois que quelqu'un atterrit sur votre site, pas de ce que vous avez payé pour l'y amener. Il synchronise le trafic et les sessions, les données de tunnel de conversion (où les visiteurs abandonnent avant de convertir), et le chiffre d'affaires e-commerce si vous avez configuré le suivi e-commerce de GA4. Cliquez sur Connecter, connectez-vous avec le compte Google ayant accès à votre propriété GA4, et approuvez l'accès. Associer ceci à Google Ads ou Meta Ads vous donne une vision plus complète : ce que vous avez dépensé pour amener quelqu'un sur votre site, et ce qu'il a réellement fait une fois arrivé.",
      },
      {
        heading: "Mailchimp — performance des campagnes e-mail",
        body: "Mailchimp se connecte également via OAuth — cliquez sur Connecter, connectez-vous à Mailchimp, et approuvez l'accès. Il synchronise vos campagnes ainsi que les taux d'ouverture, les taux de clic et les données d'audience, afin que votre performance d'email marketing se retrouve dans le même tableau de bord que vos ventes et vos dépenses publicitaires, plutôt que de rester uniquement dans les rapports propres à Mailchimp.",
      },
      {
        heading: "Klaviyo — le cas particulier : une clé API à coller, pas d'OAuth",
        body: "Klaviyo est le cas à part parmi les cinq. Au lieu d'un bouton Connecter qui vous redirige vers une connexion, vous verrez un champ demandant une clé API privée. Pour en obtenir une, connectez-vous à Klaviyo, allez dans Account, puis Settings, puis API Keys, et créez (ou copiez) une clé API privée à partir de là. Collez-la dans le champ correspondant d'AskBiz et connectez. Il s'agit d'une différence volontaire dans le fonctionnement du connecteur, pas d'un parcours OAuth cassé — l'API de Klaviyo pour ce type d'accès en lecture au niveau du compte fonctionne par clé plutôt que par OAuth, donc une clé privée est la façon correcte et attendue de le connecter. Comme une clé API privée est un véritable identifiant, traitez-la comme vous traiteriez un mot de passe : générez-la uniquement depuis votre propre compte Klaviyo, et ne la partagez qu'en la collant directement dans AskBiz. Une fois connecté, Klaviyo synchronise le chiffre d'affaires attribué aux e-mails, vos flows (séquences d'e-mails automatisées), les taux d'ouverture et l'attribution — afin que vous puissiez voir combien de chiffre d'affaires vos e-mails Klaviyo génèrent réellement, et pas seulement combien de personnes les ont ouverts.",
      },
      {
        heading: "Limites de sources du plan Free",
        body: "Le plan Free autorise jusqu'à 3 sources de données connectées au total, et ce plafond s'applique toutes catégories confondues — ce n'est pas 3 par catégorie. Donc si vous connectez Meta Ads, Mailchimp et votre PDV AskBiz, vous avez déjà épuisé votre quota et devrez en déconnecter une avant d'en ajouter une quatrième, que cette quatrième soit Klaviyo, Shopify, ou autre chose. Les plans Growth et Business suppriment entièrement cette limite, vous donnant des connexions de sources illimitées sur toute la liste d'intégrations d'AskBiz. Si les données marketing sont une priorité pour vous, mieux vaut décider à l'avance quelles sources comptent le plus sur le plan Free, ou passer à un plan supérieur si vous voulez les cinq connecteurs Marketing et publicité en même temps que vos sources de ventes et de comptabilité.",
      },
      {
        heading: "Ce qui se passe une fois connecté",
        body: "Une fois une source connectée, elle apparaît dans la liste Connectées en haut de la page Sources, avec un indicateur de statut et une heure de « dernière synchronisation ». Ce ne sont pas des importations ponctuelles — chacune des cinq repose sur une véritable logique de synchronisation qui continue d'extraire des données fraîches en continu, et vous pouvez aussi appuyer sur « Synchroniser maintenant » sur n'importe quelle source connectée si vous voulez les derniers chiffres immédiatement plutôt que d'attendre la prochaine synchronisation automatique. Si une source affiche un jour un statut d'erreur — par exemple si la clé API de Klaviyo a été révoquée, ou qu'un jeton OAuth doit être réapprouvé — le message d'erreur sur cette ligne vous indiquera ce qui a mal tourné, et la reconnexion suit le même processus que la première connexion.",
      },
    ],
    faq: [
      {
        q: "Pourquoi Klaviyo demande-t-il une clé API au lieu de me laisser simplement me connecter comme les autres ?",
        a: "Meta Ads, Google Ads, Google Analytics et Mailchimp utilisent tous OAuth, donc vous vous connectez et approuvez l'accès en un clic. Le connecteur Klaviyo utilise à la place une clé API privée, car c'est la bonne façon d'accorder ce type d'accès en lecture à l'API de Klaviyo. Générez-la depuis Klaviyo sous Account, puis Settings, puis API Keys, et collez-la dans AskBiz.",
      },
      {
        q: "Google Ads et Google Analytics utilisent-ils la même connexion ?",
        a: "Non — ce sont deux connecteurs distincts sur la page Sources, même si les deux vous redirigent via une connexion Google. Google Ads synchronise vos dépenses publicitaires et la performance de vos campagnes ; Google Analytics synchronise le trafic de votre site web et les tunnels de conversion à partir d'une propriété GA4. Vous pouvez connecter l'un des deux séparément, ou les deux ensemble.",
      },
      {
        q: "Je suis sur le plan Free — puis-je connecter les cinq sources Marketing et publicité ?",
        a: "Seulement si ce sont les seules sources que vous connectez. Le plan Free autorise jusqu'à 3 sources de données au total, toutes catégories confondues, pas 3 par catégorie. Connecter les cinq sources Marketing et publicité en plus d'autre chose — votre PDV, Shopify, un logiciel de comptabilité — dépasserait cette limite. Les plans Growth et Business offrent des connexions de sources illimitées.",
      },
      {
        q: "Est-il prudent de coller ma clé API Klaviyo dans AskBiz ?",
        a: "Le champ est un champ de saisie de type mot de passe, et il ne sert qu'à authentifier l'accès en lecture d'AskBiz à votre compte Klaviyo. Traitez la clé elle-même comme n'importe quel autre identifiant de compte : générez-la uniquement depuis votre propre compte Klaviyo, et ne la collez nulle part ailleurs que directement dans le champ de connexion AskBiz.",
      },
      {
        q: "Que synchronise exactement chaque source — s'agit-il d'une importation ponctuelle ?",
        a: "Non, aucune des cinq n'est une importation ponctuelle. Meta Ads et Google Ads synchronisent les dépenses, le ROAS, le CPM/CPC et les conversions ; Google Analytics synchronise le trafic, les sessions, les tunnels de conversion et le chiffre d'affaires e-commerce ; Mailchimp synchronise les campagnes, les taux d'ouverture, les taux de clic et l'audience ; Klaviyo synchronise le chiffre d'affaires e-mail, les flows, les taux d'ouverture et l'attribution. Chacune continue de se synchroniser en continu une fois connectée, et vous pouvez déclencher une synchronisation manuelle à tout moment depuis la liste Connectées.",
      },
    ],
  },

  'connect-gocardless-askbiz': {
    title: "Connecter GoCardless à AskBiz pour les prélèvements automatiques et les paiements par abonnement",
    description: "Comment connecter GoCardless dans Sources AskBiz, ce qu'il synchronise, où atterrissent ces données, et ce que cela signifie pour votre limite de sources du plan Free.",
    keywords: [
      "GoCardless", "prélèvement automatique", "Bacs", "abonnements", "mandats",
      "paiements récurrents", "Sources AskBiz", "connecteur Paiements", "connecter GoCardless",
    ],
    keyTakeaways: [
      "GoCardless se trouve dans Sources > Paiements, aux côtés de Stripe, PayPal, Klarna et SumUp.",
      "C'est une connexion OAuth en un clic — cliquez sur Connecter, connectez-vous à GoCardless, approuvez l'accès en lecture seule. Il n'y a aucune clé API à chercher ni à coller.",
      "Il synchronise vos paiements par prélèvement automatique, chacun associé au mandat qui l'a autorisé, afin que vous puissiez retracer un prélèvement jusqu'à l'accord client qui en est à l'origine.",
      "Les données GoCardless sont écrites dans leur propre table gocardless_payments plutôt que dans votre flux Transactions partagé, car les enregistrements de paiements et de mandats n'ont pas le même format — elles n'apparaîtront donc pas encore dans vos Rapports de ventes habituels comme le font Stripe ou PayPal.",
      "Il compte dans le plafond de 3 sources connectées du plan Free comme tout autre connecteur ; les plans Growth et Business n'ont aucune limite de sources.",
    ],
    content: [
      {
        heading: "Où le trouver",
        body: "Ouvrez Sources depuis la navigation principale d'AskBiz et repérez la catégorie Paiements — elle se trouve entre PayPal et Klarna, à côté de Stripe et SumUp. AskBiz regroupe chaque connecteur par catégorie (E-commerce, Comptabilité, Paiements, Marketing et publicité, etc.), donc Paiements est l'endroit où les cinq sources liées aux paiements vivent ensemble plutôt que d'être éparpillées sur la page. Si vous préférez ne pas faire défiler, le champ de recherche en haut de la page Sources filtre au fur et à mesure que vous tapez, donc taper « gocardless » ou « prélèvement automatique » vous amène directement à sa carte. La carte affiche une brève description — paiements par prélèvement automatique, abonnements, mandats — et un bouton Connecter. Une fois connecté, il remonte dans la liste Connectées en haut de la page aux côtés de vos autres sources, avec un point de statut et une heure de dernière synchronisation, où vous pouvez déclencher une synchronisation manuelle ou le déconnecter à tout moment.",
      },
      {
        heading: "Se connecter : un clic, aucune clé API",
        body: "GoCardless est un connecteur OAuth, pas un connecteur à clé à coller — l'indication sur la carte précise « Redirige vers GoCardless — accès en lecture seule », et c'est exactement ce qui se passe. Cliquez sur Connecter et AskBiz vous envoie vers l'écran de connexion propre à GoCardless, qui demande une portée read_only. Connectez-vous et approuvez-la là-bas, et GoCardless vous redirige directement vers Sources. Vous ne voyez ni ne manipulez jamais de jeton d'accès vous-même, et il n'y a rien à copier au préalable depuis une page de paramètres GoCardless — contrairement, par exemple, à Klarna ou SumUp dans le même groupe Paiements, qui demandent bien de coller des identifiants API. Une fois l'accès approuvé, AskBiz recherche votre compte créancier GoCardless et utilise son nom comme nom d'affichage de la source dans votre liste Connectées, afin qu'elle soit reconnaissable comme votre entreprise plutôt que d'apparaître comme une ligne « GoCardless » générique. Une première synchronisation démarre automatiquement juste après la connexion, donc vous n'avez pas besoin d'appuyer sur Synchroniser maintenant juste pour la voir commencer à fonctionner.",
      },
      {
        heading: "Ce qui est réellement synchronisé",
        body: "Une fois connecté, AskBiz récupère vos paiements depuis GoCardless — chaque prélèvement automatique sur le compte, qu'il soit terminé, en attente ou échoué, en remontant tout votre historique de paiements, puis en restant à jour à chaque synchronisation suivante. Chaque enregistrement de paiement porte le montant et la devise, son statut, la date de prélèvement, et toute description que vous ou GoCardless y avez ajoutée. Élément essentiel : chacun porte aussi le mandat qui l'a autorisé — l'accord de prélèvement automatique sous-jacent auquel le client a souscrit — donc un paiement n'est pas qu'un simple chiffre, il est traçable jusqu'au mandat précis (et par extension l'abonnement ou l'accord) qui l'a généré. C'est en ce sens que le connecteur couvre « paiements, abonnements et mandats » : ce que vous obtenez est un flux complet de paiements, chacun déjà relié au mandat qui le sous-tend, plutôt que trois jeux de données séparés et déconnectés. Comme AskBiz parcourt l'API par pages plutôt que d'extraire un lot fixe, une entreprise avec un historique GoCardless déjà conséquent récupère tout son arriéré dès la première synchronisation, pas seulement les prélèvements les plus récents.",
      },
      {
        heading: "Pourquoi ça n'apparaît pas encore dans vos Rapports habituels",
        body: "La plupart des connecteurs d'AskBiz — Stripe et PayPal compris — alimentent une table partagée qui fait fonctionner votre vue Transactions, votre compte de résultat et vos pages Rapports. GoCardless, délibérément, n'en fait pas partie. Les données de paiements et de mandats ont un format différent de celui d'une commande ou d'une vente — un paiement par prélèvement automatique n'a pas de ligne de produit, de nom de client au même format, ni de canal comme le fait une commande Shopify — donc AskBiz les écrit dans sa propre table dédiée plutôt que de les forcer dans la table partagée. En pratique, cela signifie que vos données GoCardless sont synchronisées, stockées en toute sécurité et tenues à jour — mais elles ne sont pas encore mélangées à la même vue de Rapports de ventes ou de compte de résultat où apparaissent vos paiements Stripe ou PayPal. Si vous comptez sur AskBiz pour une vue de chiffre d'affaires unique et combinée entre processeurs de paiement, GoCardless est le seul connecteur du groupe Paiements qui reste actuellement légèrement en dehors de cette vue plutôt qu'intégré dedans. C'est une raison de continuer à le connecter — les données sont capturées et prêtes dès que les rapports les rattraperont — mais pas une raison de s'attendre à une correspondance immédiate et identique au fonctionnement actuel de Stripe.",
      },
      {
        heading: "Limites de sources du plan Free",
        body: "GoCardless ne bénéficie d'aucun traitement de faveur sur les limites de plan — il compte comme une connexion dans le plafond du plan Free de 3 sources connectées au total, toutes catégories confondues, pas 3 par catégorie. Donc si vous utilisez déjà Shopify et Xero sur Free, GoCardless serait votre troisième et dernière place disponible, à moins d'en déconnecter une autre au préalable. Les plans Growth et Business suppriment entièrement cette limite, afin que vous puissiez faire tourner GoCardless aux côtés de Stripe, PayPal et tout le reste de votre panoplie sans rien sacrifier. Si les prélèvements automatiques et les paiements par abonnement représentent une part importante de votre chiffre d'affaires, mieux vaut décider à l'avance si GoCardless mérite l'une de vos trois places gratuites, ou si passer à un plan supérieur a plus de sens dès lors que vous dépendez de plus de deux ou trois sources à la fois.",
      },
      {
        heading: "En cas de problème",
        body: "Le jeton OAuth de GoCardless pour cette connexion ne dispose pas d'un mécanisme d'actualisation documenté, donc si la connexion cesse un jour de fonctionner, la cause la plus probable est que ce jeton doive être réapprouvé, plutôt qu'un véritable bug de synchronisation. Si une synchronisation échoue, la ligne de la source dans votre liste Connectées passera à un statut d'erreur avec un court message expliquant pourquoi, et la reconnexion est la solution : cliquez à nouveau sur Connecter et réapprouvez l'accès. Une chose à savoir avant de cliquer sur Déconnecter, cependant — ce n'est pas une simple pause. Retirer GoCardless de votre liste Connectées supprime son historique de paiements synchronisé en même temps que la connexion elle-même. Si vous déconnectez pour dépanner plutôt que pour retirer GoCardless définitivement, la reconnexion resynchronisera ensuite votre historique de paiements entièrement depuis GoCardless, plutôt que de reprendre là où les anciennes données s'étaient arrêtées.",
      },
    ],
    faq: [
      {
        q: "Ai-je besoin d'une clé API GoCardless pour me connecter ?",
        a: "Non. GoCardless se connecte via OAuth — cliquez sur Connecter sur sa carte Sources et vous êtes redirigé pour vous connecter et approuver l'accès en lecture seule sur le site même de GoCardless. Il n'y a aucune clé ni jeton à chercher dans vos paramètres GoCardless pour le coller dans AskBiz.",
      },
      {
        q: "Mes paiements GoCardless apparaîtront-ils dans mes Rapports ou mon compte de résultat AskBiz aux côtés de Stripe et PayPal ?",
        a: "Pas encore. Les données de paiements et de mandats GoCardless sont stockées dans leur propre table dédiée plutôt que dans la table partagée qui alimente Rapports, Transactions et le compte de résultat — car ces données n'ont pas le même format qu'une commande ou une vente. Elles sont synchronisées et stockées, mais actuellement séparées de votre vue de chiffre d'affaires combinée.",
      },
      {
        q: "Le connecteur récupère-t-il mes abonnements comme une liste séparée, ou seulement les paiements ?",
        a: "Il synchronise les paiements — chaque prélèvement automatique, qu'il soit terminé, en attente ou échoué — et chaque paiement porte le mandat qui l'a autorisé, afin que vous puissiez retracer un prélèvement jusqu'à l'accord sous-jacent. Ce n'est pas un flux séparé d'objets abonnements ou mandats indépendant des paiements eux-mêmes.",
      },
      {
        q: "Connecter GoCardless consomme-t-il l'une de mes places de source du plan Free ?",
        a: "Oui. Le plan Free autorise jusqu'à 3 sources connectées au total, toutes catégories confondues, et GoCardless compte de la même façon que tout autre connecteur — Stripe, Shopify, Xero, tous. Les plans Growth et Business n'ont aucune limite de sources.",
      },
      {
        q: "Ma connexion GoCardless affiche une erreur — que dois-je faire ?",
        a: "Cliquez à nouveau sur Connecter depuis la page Sources et réapprouvez l'accès via l'écran de connexion de GoCardless — le même parcours que pour la première connexion. Notez que c'est différent d'une déconnexion : un statut d'erreur ne touche pas à votre historique de paiements synchronisé, mais si vous cliquez d'abord sur Déconnecter, cela supprime les données de paiements GoCardless synchronisées en même temps que la connexion, et la reconnexion les resynchronisera entièrement au lieu de restaurer les anciens enregistrements.",
      },
    ],
  },

  'connect-linnworks-askbiz': {
    title: "Connecter Linnworks à AskBiz pour la synchronisation multicanal des stocks",
    description: "Guide pas à pas pour connecter Linnworks à AskBiz : ce que fait le parcours OAuth, quelles données sont réellement synchronisées, et à quelle fréquence.",
    keywords: ["Linnworks", "connecter", "intégration", "AskBiz", "stock", "multicanal", "Sources", "commandes", "traitement des commandes", "OAuth"],
    keyTakeaways: [
      "Linnworks se trouve dans Sources > Stock et logistique, aux côtés de Cin7 et ShipStation, et se connecte via OAuth — vous autorisez l'accès depuis Linnworks lui-même, AskBiz ne voit jamais de mot de passe.",
      "L'accès est en lecture seule : AskBiz peut récupérer vos commandes, mais ne peut rien créer, modifier ou annuler dans votre compte Linnworks.",
      "Ce qui se synchronise, ce sont vos commandes ouvertes — référence (SKU), produit, quantité, prix, canal et statut de traitement pour chaque ligne — qu'AskBiz transforme en chiffres de chiffre d'affaires par canal et de mouvements de stock. Ce n'est pas un flux séparé donnant les niveaux de stock en temps réel de votre entrepôt.",
      "La fréquence de synchronisation suit votre plan AskBiz comme toute autre source : une fois par jour sur Free, toutes les 6 heures sur Growth, toutes les heures sur Business.",
      "Il s'agit d'un véritable connecteur fonctionnel, avec son propre gestionnaire de synchronisation et son propre normalisateur de données — à ne pas confondre avec les anciens articles d'AskBiz qui mentionnent Linnworks uniquement comme exemple de plateforme multicanal que les entreprises pourraient utiliser.",
    ],
    content: [
      {
        heading: "Où le trouver",
        body: "Depuis votre tableau de bord AskBiz, allez dans Sources. Faites défiler jusqu'à la section Stock et logistique — Linnworks s'y trouve aux côtés de Cin7 et ShipStation, avec une brève description en dessous : « Stock multicanal, commandes, traitement des commandes. » Cin7 et ShipStation demandent tous deux de coller une clé API (et, pour Cin7, un identifiant de compte également) avant de se connecter. Linnworks est différent — c'est le seul des trois à utiliser une connexion OAuth complète, donc vous cliquez sur la tuile et tout ce qui suit se passe sur le site même de Linnworks plutôt que dans un formulaire sur AskBiz.",
      },
      {
        heading: "Avant de vous connecter",
        body: "Il vous faudra un accès administrateur, ou au minimum un accès autorisant les applications, sur votre compte Linnworks — le même niveau d'accès que celui requis pour approuver n'importe quelle application tierce à l'intérieur de Linnworks. Vous n'avez besoin de générer ou de copier aucune clé API, secret ou jeton au préalable ; AskBiz ne vous demande rien à coller pour ce connecteur en particulier, ce qui est la principale différence pratique avec Cin7 juste à côté. La page Sources vous indique exactement à quoi vous attendre avant de cliquer sur quoi que ce soit : « Redirige vers Linnworks — accès en lecture seule. » Cette phrase est une description littérale de ce qui va se passer, pas un argument marketing — AskBiz demande la permission de lire vos commandes, rien de plus.",
      },
      {
        heading: "Étapes 1 et 2 : autoriser depuis Linnworks",
        body: "En cliquant sur la tuile Linnworks, vous êtes envoyé vers l'écran d'autorisation OAuth propre à Linnworks, où vous vous connectez (si ce n'est pas déjà fait) et examinez exactement ce qu'AskBiz demande à lire avant de l'approuver. On ne vous demande jamais de mot de passe Linnworks à l'intérieur d'AskBiz lui-même — tout l'échange se déroule sur le domaine de Linnworks, ce qui est la pratique OAuth standard et le même schéma qu'AskBiz utilise pour Shopify, Xero et ses autres sources basées sur OAuth. Si vous décidez de ne pas continuer, vous pouvez simplement fermer cet écran ou revenir en arrière ; rien n'est connecté tant que vous n'avez pas réellement approuvé. Une fois que vous approuvez, Linnworks vous redirige automatiquement et directement vers la page Sources d'AskBiz — il n'y a aucun code à copier ni à coller nulle part.",
      },
      {
        heading: "Étape 3 : ce qui se passe après votre approbation",
        body: "Sur le chemin du retour, AskBiz échange le code d'autorisation que lui remet Linnworks contre un jeton d'accès, puis enregistre ce jeton de façon chiffrée dans votre compte, avec l'URL de serveur Linnworks que Linnworks attribue à votre compte. Ce jeton est permanent — il n'expire pas comme le ferait un jeton de session classique — mais AskBiz ne l'utilise jamais directement contre l'API de commandes de Linnworks. À la place, à chaque synchronisation, il présente ce jeton permanent au point d'entrée AuthorizeByApplication de Linnworks pour générer un nouveau jeton de session de courte durée (les propres jetons de session de Linnworks ne durent qu'environ 20 minutes, bien moins que n'importe quel intervalle de synchronisation réaliste), et c'est ce jeton de session fraîchement généré qui est réellement utilisé pour récupérer vos commandes. Vous ne voyez rien de tout cela se produire — c'est le mécanisme qui maintient la connexion fonctionnelle de façon fiable et indéfinie, sans jamais vous demander de vous reconnecter ou de réautoriser l'accès. Dès que votre connexion est enregistrée, AskBiz déclenche aussi automatiquement une première synchronisation, donc il n'y a rien de plus à cliquer.",
      },
      {
        heading: "Quelles données sont réellement synchronisées",
        body: "Chaque synchronisation récupère vos commandes ouvertes depuis Linnworks. Pour chaque ligne de chaque commande, AskBiz enregistre le SKU, le nom du produit, la quantité, le prix unitaire, le coût unitaire (quand Linnworks en fournit un), le canal de vente par lequel la commande est arrivée, et le statut de la commande. Tout cela est normalisé dans les mêmes champs par enregistrement qu'AskBiz utilise pour chaque autre source connectée — chiffre d'affaires brut, coût, marge, unités vendues et mouvement de stock — de sorte que vos commandes Linnworks se retrouvent dans vos rapports aux côtés de vos ventes Shopify, Amazon ou PDV, plutôt que comme un silo séparé que vous devez consulter à part. Si une commande arrive sans ligne d'article associée, AskBiz l'enregistre tout de même comme une seule ligne en utilisant le total de la commande, afin que rien ne disparaisse silencieusement simplement parce que le détail par article n'était pas disponible. Un point mérite toutefois d'être précisé : ce qui se synchronise aujourd'hui, c'est l'activité des commandes, pas un flux séparé donnant les niveaux de stock en temps réel de votre entrepôt. AskBiz déduit le mouvement de stock à partir des unités vendues par commande, plutôt que de récupérer directement les quantités absolues en stock chez Linnworks — chaque commande synchronisée réduit le chiffre de mouvement de stock pour ce SKU, mais AskBiz ne demande pas à Linnworks « combien m'en reste-t-il en entrepôt en ce moment » comme requête séparée. Si vous vous appuyez sur Linnworks comme véritable source de référence pour vos niveaux de stock, continuez à le faire. La vision d'AskBiz ici est pilotée par les commandes, ce qui est fiable pour l'analyse du chiffre d'affaires, des canaux et de la performance produit, mais ce n'est pas un substitut à la vérification des niveaux de stock en temps réel dans Linnworks lui-même avant de prendre une décision d'achat.",
      },
      {
        heading: "À quelle fréquence il se resynchronise",
        body: "Une fois connecté, Linnworks suit le même calendrier de synchronisation que toute autre source, déterminé par votre plan AskBiz : une fois par jour sur Free, toutes les 6 heures sur Growth, et toutes les heures sur Business. Linnworks n'a pas son propre intervalle plancher plus lent comme c'est le cas pour deux ou trois autres connecteurs — Stripe est plafonné à 3 heures et Etsy à 8 heures même sur Business, car leurs données sous-jacentes ne changent tout simplement pas assez vite pour justifier une interrogation plus fréquente — donc Linnworks suit simplement le rythme que votre plan autorise, comme Shopify, Amazon ou Xero. Si vous voulez des chiffres plus frais juste après une grosse poussée de ventes sur vos canaux, retournez sur la page Sources, trouvez Linnworks dans votre liste de sources connectées, et cliquez sur Synchroniser maintenant — cela déclenche une synchronisation à la demande en dehors du calendrier habituel, sans affecter le moment où la prochaine synchronisation programmée aura lieu. Cette même ligne sur cette page affiche un point de statut (vert quand tout se synchronise normalement, orange ou rouge si quelque chose nécessite votre attention) et une heure de « dernière synchronisation », afin que vous puissiez voir d'un coup d'œil à quel point vos données Linnworks sont à jour avant de vous y fier.",
      },
      {
        heading: "Si vous avez lu le guide AskBiz sur la vente multicanal",
        body: "Le contenu général de l'Academy AskBiz sur la vente multicanal mentionne Linnworks comme exemple du type de plateforme que les entreprises utilisent pour centraliser leurs commandes sur plusieurs canaux — c'est une référence générique à cette catégorie d'outil, écrite avant qu'AskBiz ne se connecte directement à Linnworks. Cet article porte sur autre chose : la connexion directe propre à AskBiz vers votre compte Linnworks, décrite ci-dessus. Si vous utilisez déjà Linnworks comme votre plateforme centrale multicanal, la connecter ici est ce qui fait réellement entrer ces données dans les rapports d'AskBiz.",
      },
    ],
    faq: [
      { q: "AskBiz obtient-il un accès en écriture à mon compte Linnworks ?", a: "Non. La connexion est en lecture seule — AskBiz peut récupérer vos données de commandes mais ne peut rien créer, modifier, annuler ou traiter dans Linnworks. La page Sources l'indique explicitement avant que vous ne vous connectiez." },
      { q: "Cela me montrera-t-il mes niveaux de stock exacts et actuels depuis Linnworks ?", a: "Pas directement. AskBiz synchronise vos commandes ouvertes et en déduit le mouvement de stock (unités vendues par SKU) — il ne récupère pas actuellement un flux séparé donnant les niveaux de stock en temps réel de l'entrepôt. Pour vos quantités en stock faisant référence, consultez Linnworks lui-même." },
      { q: "En quoi est-ce différent de la mention de Linnworks dans l'article d'AskBiz sur la vente multicanal ?", a: "Cet article mentionne Linnworks de façon générique, comme exemple de la catégorie d'outils de gestion multicanal que les entreprises utilisent — il ne décrit pas une connexion à AskBiz. Cet article-ci couvre le véritable connecteur Linnworks d'AskBiz, qui fait entrer de vraies données de commandes dans votre compte." },
      { q: "À quelle fréquence mes données Linnworks se mettront-elles à jour dans AskBiz ?", a: "Cela suit le calendrier de synchronisation normal de votre plan : une fois par jour sur Free, toutes les 6 heures sur Growth, toutes les heures sur Business. Vous pouvez aussi déclencher une synchronisation immédiate à tout moment depuis la page Sources avec le bouton Synchroniser maintenant." },
      { q: "Que faire si je dois me reconnecter ou si quelque chose semble anormal ?", a: "Allez dans Sources, trouvez Linnworks dans votre liste de sources connectées, et utilisez Déconnecter suivi d'une reconnexion via le même parcours OAuth. Si une synchronisation échoue, la ligne de statut affichera un message d'erreur plutôt que de rester silencieuse." },
    ],
  },

  'connect-xero-freeagent-askbiz': {
    title: "Connecter Xero ou FreeAgent à AskBiz",
    description: "Comment connecter Xero ou FreeAgent dans Sources > Comptabilité, ce que chacun synchronise dans AskBiz, et en quoi ils diffèrent de Sage et Wave dans la même catégorie.",
    keywords: [
      "Xero", "FreeAgent", "Sources AskBiz", "connecteurs Comptabilité",
      "connecter Xero", "connecter FreeAgent", "synchronisation des factures", "intégration comptable",
    ],
    keyTakeaways: [
      "Xero et FreeAgent se trouvent tous deux dans Sources > Comptabilité, aux côtés de QuickBooks, Sage et Wave.",
      "Les deux se connectent en un clic via OAuth — vous vous connectez et approuvez l'accès en lecture seule, sans rien à coller. Sage et Wave, dans la même catégorie, demandent au contraire de coller des identifiants API.",
      "Ce qui alimente réellement AskBiz, ce sont vos factures — à la fois l'argent qui entre (factures de vente) et l'argent qui sort (factures fournisseurs) — qui nourrissent vos rapports de chiffre d'affaires et de dépenses AskBiz.",
      "Il s'agit d'une extraction à sens unique et distincte : AskBiz lit les données de Xero/FreeAgent à des fins de reporting. Si vous utilisez aussi AskBiz POS, sa propre intégration Xero (différente) envoie les ventes du PDV vers Xero pour la comptabilité — les deux ne sont pas la même connexion.",
      "La fréquence de resynchronisation dépend de votre plan : une fois par jour sur Free, toutes les 6 heures sur Growth, toutes les heures sur Business.",
    ],
    content: [
      {
        heading: "Où les trouver",
        body: "Ouvrez Sources depuis la navigation principale d'AskBiz. Les connecteurs sont regroupés par catégorie, et Comptabilité en est une — aux côtés d'E-commerce, Paiements, Marketing et publicité et les autres. Dans Comptabilité, vous trouverez cinq cartes : QuickBooks, Xero, Sage, FreeAgent et Wave. Si faire défiler n'est pas votre truc, le champ de recherche en haut de la page Sources filtre directement jusqu'à une carte quand vous tapez « xero » ou « freeagent ». La carte de Xero le décrit comme couvrant les factures, le rapprochement bancaire, le compte de résultat et la paie ; la carte de FreeAgent décrit les factures, les dépenses, l'échéancier fiscal et la trésorerie — c'est le terrain que chaque plateforme couvre en général. Ce qu'AskBiz récupère réellement de l'une ou l'autre, détaillé ci-dessous, est plus étroit et spécifique : vos factures.",
      },
      {
        heading: "Connecter Xero",
        body: "Cliquez sur Connecter sur la carte Xero. AskBiz vous redirige vers Xero pour vous connecter et approuver l'accès en lecture seule à votre organisation — il n'y a aucun identifiant client, secret ou jeton à chercher ni à coller où que ce soit. Une fois que vous l'approuvez, vous êtes renvoyé vers AskBiz et la carte rejoint la liste Connectées en haut de la page, avec un indicateur de statut et une heure de dernière synchronisation.",
      },
      {
        heading: "Connecter FreeAgent",
        body: "FreeAgent fonctionne de la même façon. Cliquez sur Connecter, connectez-vous à FreeAgent, et approuvez l'accès en lecture seule — là encore, aucun identifiant à copier manuellement. Comme un jeton OAuth FreeAgent est limité à une seule entreprise, vous n'avez pas besoin de choisir ensuite un locataire ou une entreprise comme l'exigent certaines plateformes multi-entreprises ; la connexion est liée à l'entreprise FreeAgent pour laquelle vous avez approuvé l'accès.",
      },
      {
        heading: "La différence avec Sage et Wave, juste à côté",
        body: "Xero et FreeAgent sont les deux connexions OAuth du groupe Comptabilité — vous ne voyez jamais de champ de formulaire pour l'un ou l'autre. Sage et Wave, dans la même liste, fonctionnent différemment : Sage demande de coller un Client ID et un Client Secret depuis le Sage Developer Portal, et Wave demande un jeton d'accès généré depuis la page Settings > Developer propre à Wave. Si vous avez l'habitude de coller des identifiants pour Sage ou Wave, ne cherchez pas de champ équivalent pour Xero ou FreeAgent — pour ces deux-là, cliquer sur Connecter et approuver l'accès sur l'écran de connexion du fournisseur constitue tout le processus.",
      },
      {
        heading: "Ce qui se synchronise réellement",
        body: "Une fois connecté, AskBiz récupère vos factures depuis Xero (ou FreeAgent) et les répartit par type. Les factures de vente — l'argent qui vous est dû — deviennent des lignes de chiffre d'affaires dans AskBiz, avec la description du produit/de la ligne, la quantité, le prix, la devise et le statut de paiement (payée, en attente, ou partiellement payée) directement issus de la facture. Les factures fournisseurs — l'argent que vous devez — deviennent des enregistrements de dépenses, associés au fournisseur, au montant, à la date et à la catégorie. À eux deux, c'est ce qui alimente votre compte de résultat et vos rapports de dépenses AskBiz depuis l'une ou l'autre plateforme. Côté Xero, les factures sont récupérées par pages et classées selon leur dernière mise à jour, donc les modifications que vous faites dans Xero — un paiement enregistré, une facture corrigée — sont reprises à la synchronisation suivante, et pas seulement à la date de création initiale de la facture. Les fonctionnalités propres de rapprochement bancaire, de paie et d'échéancier fiscal de Xero et FreeAgent restent à l'intérieur de Xero ou FreeAgent — AskBiz ne récupère pas ces chiffres spécifiques, seulement les données de factures.",
      },
      {
        heading: "Maintenir la connexion active",
        body: "Les jetons OAuth expirent périodiquement par conception, et AskBiz actualise les deux automatiquement en coulisses — pour Xero via son service d'identité, pour FreeAgent via son propre point d'entrée de jeton — donc une synchronisation normale ne vous demandera pas de vous reconnecter. Si une actualisation échoue un jour (par exemple si l'accès a été révoqué du côté de Xero ou de FreeAgent), la source connectée affichera un statut d'erreur sur la page Sources avec un court message, et la reconnexion suit le même processus en un clic que la première fois.",
      },
      {
        heading: "À quelle fréquence il se resynchronise",
        body: "La fréquence de synchronisation est liée à votre plan AskBiz plutôt qu'au connecteur lui-même : une fois par jour sur Free, toutes les 6 heures sur Growth, et toutes les heures sur Business. Ni Xero ni FreeAgent ne se voient appliquer d'intervalle plancher plus lent comme c'est le cas pour deux ou trois autres connecteurs, donc vous bénéficiez de l'intervalle normal de votre plan. Si vous voulez les derniers chiffres sans attendre, appuyez sur « Synchroniser maintenant » sur la ligne de la source connectée dans la page Sources, et elle récupérera les données immédiatement, quel que soit le moment prévu pour la prochaine synchronisation programmée.",
      },
      {
        heading: "Déconnecter ou changer",
        body: "Les deux sources se trouvent dans la liste Connectées une fois configurées, aux côtés de toutes les autres sources que vous avez liées, et chacune a son propre bouton Déconnecter. Déconnecter est un véritable nettoyage, pas une simple pause : AskBiz révoque le jeton auprès du fournisseur et supprime les enregistrements de chiffre d'affaires synchronisés par cette source, afin qu'une connexion ancienne ou erronée ne continue pas à laisser des chiffres dans vos rapports. Si vous devez vous reconnecter plus tard, ou changer l'organisation Xero ou l'entreprise FreeAgent liée, déconnectez d'abord puis repassez par Connecter pour autoriser la nouvelle — la synchronisation suivante repeuple vos données depuis zéro.",
      },
      {
        heading: "Si vous utilisez aussi AskBiz POS avec Xero",
        body: "Un point mérite d'être clarifié, car les noms se recoupent : ce connecteur Sources est une extraction à sens unique vers AskBiz à des fins de reporting — il lit vos données Xero ou FreeAgent pour qu'elles apparaissent dans vos tableaux de bord et votre compte de résultat. Si vous utilisez AskBiz POS, le PDV dispose de sa propre intégration Xero distincte, dans ses propres paramètres, qui fait le travail inverse — elle envoie vos ventes du PDV vers Xero sous forme de factures brouillon, pour votre comptabilité. Les deux ne sont pas liées entre elles et ne partagent pas de connexion : connecter l'une ne connecte ni n'affecte l'autre, et vous pouvez utiliser l'une, les deux, ou aucune selon vos besoins.",
      },
    ],
    faq: [
      {
        q: "Dois-je coller une clé API ou un secret client pour Xero ou FreeAgent ?",
        a: "Non. Les deux sont des connecteurs OAuth — cliquez sur Connecter, connectez-vous à Xero ou FreeAgent, et approuvez l'accès en lecture seule. C'est différent de Sage et Wave dans le même groupe Comptabilité, qui demandent bien de coller des identifiants.",
      },
      {
        q: "Connecter Xero dans Sources met-il aussi en place la synchronisation comptable PDV-vers-Xero ?",
        a: "Non, ce sont des connexions sans rapport entre elles. Ce connecteur Sources récupère vos données Xero dans AskBiz à des fins de reporting. AskBiz POS dispose de sa propre intégration Xero distincte, dans ses propres paramètres, qui envoie les ventes du PDV vers Xero sous forme de factures brouillon. Connecter l'une ne connecte pas l'autre.",
      },
      {
        q: "Quelles données apparaissent réellement dans AskBiz une fois connecté — tout ce qui vient de Xero ?",
        a: "Précisément vos factures : les factures de vente deviennent des enregistrements de chiffre d'affaires (avec quantité, prix, devise et statut de paiement) et les factures fournisseurs deviennent des enregistrements de dépenses (fournisseur, montant, catégorie). Les fonctionnalités propres de rapprochement bancaire, de paie et d'échéancier fiscal de Xero et FreeAgent ne sont pas récupérées — elles restent dans Xero ou FreeAgent.",
      },
      {
        q: "À quelle fréquence les données se mettent-elles à jour une fois connectées ?",
        a: "Cela suit l'intervalle de synchronisation de votre plan AskBiz — une fois par jour sur Free, toutes les 6 heures sur Growth, toutes les heures sur Business. Vous pouvez aussi cliquer sur « Synchroniser maintenant » sur la source connectée à tout moment pour récupérer les dernières données immédiatement plutôt que d'attendre.",
      },
      {
        q: "Que se passe-t-il si ma connexion Xero ou FreeAgent cesse de fonctionner ?",
        a: "AskBiz actualise automatiquement le jeton d'accès sous-jacent à chaque synchronisation, donc cela ne devrait généralement rien exiger de votre part. Si une actualisation échoue malgré tout — par exemple parce que l'accès a été révoqué du côté de Xero ou de FreeAgent — la source affiche un statut d'erreur avec un court message sur la page Sources, et vous vous reconnectez de la même façon que lors de la première connexion.",
      },
    ],
  },

  'connect-jumia-marketplace-askbiz': {
    title: "Connecter Jumia à AskBiz : commandes, versements et stock pour les marketplaces africaines",
    description:
      "Comment relier votre compte Jumia Vendor Center à AskBiz à l'aide d'un Client ID et d'un Refresh Token, ce qui est réellement synchronisé, et ce qui reste hors périmètre.",
    keywords: [
      "Jumia",
      "Jumia Vendor Center",
      "connecteur Jumia",
      "intégration marketplace",
      "e-commerce africain",
      "Sources",
      "AskBiz",
      "synchronisation du stock",
      "synchronisation des commandes",
    ],
    keyTakeaways: [
      "Jumia se trouve dans Sources > E-commerce, aux côtés de Shopify, Amazon FBA, eBay, Etsy, WooCommerce et Walmart — mais contrairement à eux, il n'utilise pas de redirection OAuth en un clic.",
      "Vous le connectez manuellement, en collant un Client ID et un Refresh Token que vous générez vous-même dans Jumia Vendor Center > Settings > Applications (Self Authorisation).",
      "Chaque synchronisation récupère les commandes récentes et les niveaux de stock actuels de vos boutiques Jumia ; le montant de versement affiché par commande est une estimation calculée à partir du chiffre d'affaires de la commande, et non le relevé de versement officiel et arrêté de Jumia.",
      "Le stock Jumia alimente directement votre vue de stock CFO et les alertes de stock faible étiquetées par canal — les expéditions et le suivi de livraison Jumia sont délibérément laissés hors du périmètre de ce connecteur.",
      "Il s'agit d'un connecteur tout juste développé, revu en interne par rapport à l'API de Jumia mais pas encore vérifié de bout en bout sur un compte vendeur réel — mieux vaut vérifier ponctuellement votre première synchronisation par rapport aux chiffres propres de Vendor Center.",
    ],
    content: [
      {
        heading: "Ce que fait le connecteur Jumia",
        body: "Jumia est l'une des sources E-commerce dans Sources sur AskBiz, aux côtés de Shopify, Amazon FBA, eBay, Etsy, WooCommerce et Walmart. Une fois connecté, c'est une synchronisation en lecture seule : AskBiz lit vos commandes récentes et vos niveaux de stock actuels depuis Jumia Vendor Center et les intègre à vos données d'entreprise unifiées, le même endroit où atterrit chaque autre canal — votre caisse physique, votre boutique Shopify, vos annonces Amazon. C'est tout l'intérêt de le connecter : au lieu de vous connecter séparément à Vendor Center pour vérifier comment se porte votre boutique Jumia, ses commandes et son stock apparaissent aux côtés de tout le reste, dans un seul tableau de bord, dans votre devise locale.",
      },
      {
        heading: "Pourquoi il n'y a pas de bouton « Connecter » en un clic",
        body: "Shopify, Amazon FBA, eBay et Etsy utilisent tous OAuth standard — vous cliquez sur Connecter, vous êtes redirigé pour vous connecter sur cette plateforme, vous approuvez l'accès, et vous atterrissez de nouveau dans AskBiz déjà connecté. Le Vendor Center de Jumia ne propose pas cela pour les applications tierces. Il fonctionne à la place sur ce que Jumia appelle le Self Authorization : vous créez votre propre Application à l'intérieur de votre propre compte Vendor Center, ce qui génère un Client ID et un Refresh Token propres à votre boutique. Il n'y a aucune application appartenant à AskBiz que vous approuvez, et aucun mot de passe n'est jamais échangé entre les deux — vous générez une paire d'identifiants que seul votre compte Jumia contrôle, puis vous remettez ces deux valeurs directement à AskBiz.",
      },
      {
        heading: "Connecter votre compte, étape par étape",
        body: "Connectez-vous à Jumia Vendor Center et allez dans Settings, puis Applications. Cliquez sur Create Application et choisissez Self Authorisation comme type. Jumia vous affichera un Client ID — copiez-le — et vous permettra de générer un Refresh Token — copiez-le également. De retour dans AskBiz, allez dans Sources, trouvez Jumia sous E-commerce, et collez le Client ID dans le champ Client ID et le Refresh Token dans le champ Refresh Token (ce dernier est masqué, comme un mot de passe). AskBiz vérifie immédiatement les identifiants en demandant un jeton d'accès à Jumia et en confirmant qu'il peut lire la liste de vos boutiques avant d'enregistrer la connexion. Si cette vérification échoue, la cause la plus courante est que l'Application n'a pas les permissions Order ou Product activées dans Vendor Center — retournez-y pour confirmer que ces rôles sont bien cochés, puis réessayez.",
      },
      {
        heading: "Ce qui se synchronise réellement — et ce qui ne se synchronise pas",
        body: "Chaque synchronisation récupère vos commandes récentes (une fenêtre glissante, les plus récentes en premier) et, pour chacune, les lignes de commande individuelles — le modèle de Jumia renvoie une ligne par unité vendue plutôt qu'un champ de quantité, donc une ligne de 3 unités sur votre boutique revient sous forme de trois articles séparés, chacun portant son propre prix, sa remise, sa taxe et son montant de frais de port. Les niveaux de stock proviennent d'un point d'entrée de catalogue séparé, indexé par SKU. Un point à connaître : le montant de versement que vous verrez associé à une commande Jumia dans AskBiz est calculé à partir du chiffre d'affaires net de cette commande après remises, et non extrait du relevé de règlement officiel de Jumia — Jumia n'expose les véritables déductions de commissions et de frais que sur un point d'entrée séparé de relevé de versement, que ce connecteur ne lit pas actuellement. Considérez le montant de versement comme une estimation utile pour suivre les tendances, pas comme un substitut au relevé de versement à l'intérieur de Vendor Center lui-même quand vous avez besoin du chiffre exact. Le connecteur est aussi en lecture seule dans les deux sens : il n'écrit jamais dans vos annonces, prix ou stock Jumia, et il ne touche délibérément pas aux données d'expédition ou de suivi de livraison de Jumia — ce connecteur porte sur la visibilité des ventes et du stock, pas sur la logistique de traitement des commandes.",
      },
      {
        heading: "Où vous le verrez dans AskBiz",
        body: "Les commandes Jumia comptent dans vos totaux combinés de chiffre d'affaires et de commandes sur tous les canaux connectés, chacune évaluée dans la devise locale propre à la boutique. Les niveaux de stock alimentent votre vue Stock du CFO, fusionnés avec le même produit dans la mesure du possible — notez que le flux de stock de Jumia n'inclut pas de nom de produit, donc jusqu'à ce qu'il soit rapproché d'une annonce nommée provenant d'un autre canal, AskBiz affiche le SKU à sa place. Les alertes de stock faible sont étiquetées par canal, donc un avertissement indiquant qu'un SKU Jumia est en stock faible ne sera pas confondu avec le même SKU qui se porte bien dans votre boutique physique. Et dans le filtre par canal de l'onglet Intelligence, Jumia est une option sélectionnable, afin que vous puissiez examiner la performance de Jumia isolément de tout ce que vous vendez ailleurs.",
      },
      {
        heading: "À savoir avant de vous y fier",
        body: "Ce connecteur a été ajouté récemment. Il a été développé et revu en interne par rapport à l'API documentée du Vendor Center de Jumia, mais n'a pas encore été exécuté de bout en bout sur un compte vendeur Jumia réel et actif — considérez donc votre première synchronisation comme quelque chose à vérifier ponctuellement par rapport aux chiffres de commandes et de stock propres à Vendor Center, plutôt que de la supposer exacte dès le premier jour. Si une synchronisation cesse de fonctionner avec une erreur concernant le refresh token, cela signifie presque toujours qu'il a été révoqué ou a expiré dans Vendor Center — générez un nouveau Client ID et un nouveau Refresh Token et reconnectez-vous depuis Sources. En coulisses, AskBiz génère aussi un nouveau jeton d'accès à partir de votre refresh token à chaque synchronisation plutôt que d'essayer d'en réutiliser un, car les jetons d'accès de Jumia sont de courte durée, et il espace délibérément ses requêtes pour rester sous la limite de débit de Jumia plutôt que de toutes les envoyer d'un coup. Comme chaque synchronisation récupère un lot plafonné de vos commandes les plus récentes, une boutique à très gros volume peut voir son historique récent complet se remplir sur plusieurs synchronisations plutôt que d'un seul coup dès la première exécution.",
      },
    ],
    faq: [
      {
        q: "Connecter Jumia fonctionne-t-il de la même façon que Shopify ou Amazon, avec une redirection de connexion ?",
        a: "Non. Shopify, Amazon FBA, eBay et Etsy utilisent OAuth — vous cliquez sur Connecter et vous vous connectez sur leur site. Jumia ne prend pas cela en charge pour les applications tierces, donc vous générez vous-même un Client ID et un Refresh Token dans Jumia Vendor Center > Settings > Applications, puis vous les collez tous les deux dans AskBiz sous Sources.",
      },
      {
        q: "AskBiz peut-il modifier mes prix, mes annonces ou mes niveaux de stock Jumia ?",
        a: "Non. Le connecteur est en lecture seule — il lit vos commandes et votre stock depuis Jumia, il n'écrit jamais rien dans votre boutique Jumia.",
      },
      {
        q: "Verrai-je le statut d'expédition ou de livraison Jumia dans AskBiz ?",
        a: "Pas actuellement. Les données d'expédition et de suivi de livraison sont délibérément hors du périmètre de ce connecteur — il couvre les commandes, le chiffre d'affaires et le stock, pas la logistique.",
      },
      {
        q: "Le montant de versement d'une commande Jumia ne correspond pas à ce que Jumia me verse réellement — pourquoi ?",
        a: "Ce chiffre est estimé à partir du chiffre d'affaires net de la commande après remises, et non extrait du relevé de versement officiel de Jumia, qui indique séparément les véritables déductions de commissions et de frais. Utilisez le relevé de versement propre à Vendor Center pour connaître le montant exact réglé.",
      },
      {
        q: "Ma synchronisation Jumia a soudainement cessé de fonctionner — que dois-je faire ?",
        a: "Cela signifie presque toujours que votre Refresh Token a été révoqué ou a expiré dans Vendor Center. Générez un nouveau Client ID et un nouveau Refresh Token depuis Settings > Applications, et reconnectez-vous depuis Sources avec les nouvelles valeurs.",
      },
    ],
  },

  'pos-receipt-design-vat-askbiz': {
    title: "Le nouveau reçu de caisse AskBiz : mise en page détaillée et TVA dynamique",
    description:
      "Le reçu WhatsApp qu'AskBiz envoie après une vente est désormais une véritable image façon reçu de magasin — bords déchirés, total encadré, code-barres décoratif — et sa ligne de TVA n'apparaît que pour les entreprises ayant réellement un numéro de TVA enregistré.",
    keywords: [
      "design du reçu",
      "reçu de caisse",
      "reçu WhatsApp",
      "reçu avec TVA",
      "TVA dynamique",
      "AskBiz POS",
      "reçu numérique",
      "image de reçu",
    ],
    keyTakeaways: [
      "Le reçu qu'AskBiz envoie via WhatsApp après une vente est désormais une image générée, mise en forme comme un vrai reçu de caisse — police à chasse fixe Courier Prime, bords supérieur et inférieur déchirés/perforés, un TOTAL encadré, et un code-barres décoratif — et non plus le résumé en texte brut d'avant.",
      "Une ligne « N° TVA » et une mention fiscale « TVA (taux %) » n'apparaissent que si votre entreprise a un numéro de TVA enregistré dans Paramètres. Aucun numéro de TVA enregistré signifie que les clients voient à la place une ligne générique « Taxe » — il n'y a pas d'interrupteur marche/arrêt séparé, le numéro lui-même fait office d'indicateur.",
      "AskBiz essaie toujours d'envoyer l'image en premier ; si cela échoue pour une raison quelconque, il bascule automatiquement vers un message de résumé texte plus court, sans rien à configurer ni à relancer de votre côté.",
      "L'image est générée à nouveau à partir de la transaction réelle à chaque fois qu'elle est récupérée, ce n'est donc jamais une capture d'écran figée — et la récupération elle-même ne nécessite aucune connexion, car c'est l'identifiant de transaction impossible à deviner qui assure la protection.",
    ],
    content: [
      {
        heading: "Ce qui a changé",
        body: "Quand le reçu d'un client était envoyé via WhatsApp après une vente, il arrivait auparavant sous forme de message en texte brut — une ou deux courtes lignes résumant le total, le nom de votre entreprise et le moyen de paiement. Cela existe toujours en secours, mais ce n'est plus ce que voient la plupart des clients. Le reçu principal qu'AskBiz envoie désormais est une véritable image, mise en page et stylisée pour ressembler à un reçu de caisse imprimé, avec chaque article, le sous-total, une éventuelle remise, la taxe, et le total final affichés exactement comme le ferait un reçu papier. Rien ne change de votre côté pour obtenir cela — c'est automatique à chaque vente où un reçu est envoyé.",
      },
      {
        heading: "À quoi ressemble le reçu repensé",
        body: "L'image est composée en Courier Prime, une police à chasse fixe façon machine à écrire, ce qui contribue le plus à la faire ressembler à un reçu plutôt qu'à une carte de message générique. Les bords supérieur et inférieur sont dessinés en zigzag déchiré/perforé, comme un reçu qui vient d'être arraché d'un rouleau. La ligne TOTAL se trouve dans son propre encadré près du bas, afin que ce soit le seul chiffre impossible à manquer. En dessous se trouve un code-barres décoratif — une rangée de barres verticales de hauteurs variables, générée de façon déterministe à partir de l'identifiant de transaction utilisé comme graine, de sorte que le même reçu s'affiche toujours avec les mêmes barres s'il est de nouveau récupéré. Ce n'est pas un vrai code-barres scannable ; il est là pour l'effet visuel d'un authentique reçu de caisse, avec le numéro de reçu imprimé en dessous à la place de ce qu'un code-barres encoderait normalement.",
      },
      {
        heading: "Tout ce qui est imprimé sur le reçu",
        body: "De haut en bas : le nom de votre entreprise (en majuscules), suivi de la ligne d'immatriculation TVA si vous en avez une enregistrée, puis un numéro de reçu — les 8 premiers caractères de l'identifiant de transaction, tirets supprimés et en majuscules — à côté de la date et de l'heure. En dessous, « Servi par [nom du caissier] » apparaît à gauche si la vente a été enregistrée sous une connexion caissier nommée, avec le moyen de paiement affiché en majuscules à droite. Viennent ensuite les lignes détaillées : le nom de chaque produit et le total de la ligne sur une même rangée, avec la quantité et le prix unitaire (« 2 x 4,50 £ ») imprimés en dessous. Après les articles vient le sous-total, une ligne de remise uniquement si une remise a réellement été appliquée à la vente, et une ligne de taxe uniquement si la vente comportait effectivement une taxe — une vente sans taxe n'a tout simplement aucune ligne de taxe. Le TOTAL encadré vient clore le tout, suivi du code-barres, du numéro de reçu à nouveau, et d'une ligne de remerciement.",
      },
      {
        heading: "La TVA est dynamique — elle dépend de vos Paramètres",
        body: "La ligne de taxe n'est pas figée pour toujours afficher « TVA » ou toujours afficher « Taxe » — elle change selon l'entreprise, en fonction d'un seul élément : si vous avez un numéro de TVA enregistré dans Paramètres. Si vous en avez saisi un, le reçu affiche une ligne « N° TVA » juste sous le nom de votre entreprise, et la ligne de taxe elle-même est libellée « TVA », avec le taux ajouté lorsque tous les articles de cette vente partagent un seul et même taux de taxe (par exemple « TVA (20 %) »). Si vos articles sont taxés à des taux différents, elle revient à une simple mention « TVA » plutôt que de deviner un taux. Si vous n'avez pas de numéro de TVA enregistré, rien de tout cela n'apparaît — le reçu affiche à la place une ligne générique « Taxe », sans aucune ligne d'immatriculation au-dessus du nom de l'entreprise. Il n'existe nulle part dans AskBiz d'interrupteur séparé pour cela ; le champ du numéro de TVA lui-même est le seul indicateur d'immatriculation que possède le système, donc l'ajouter ou le retirer dans Paramètres est ce qui active ou désactive le libellé spécifique à la TVA sur le reçu.",
      },
      {
        heading: "Comment AskBiz décide d'envoyer l'image ou de basculer vers le texte",
        body: "Chaque tentative d'envoi de reçu commence par essayer le modèle image. WhatsApp exige que les modèles de message professionnels soient préapprouvés par Meta avant de pouvoir être utilisés, et l'en-tête du modèle image n'est pas une image fixe téléversée — c'est un lien renvoyant vers AskBiz que les serveurs de livraison de Meta eux-mêmes récupèrent au moment où le message est réellement envoyé, ce qui explique précisément pourquoi le reçu reflète toujours la transaction réelle plutôt qu'une image mise en cache antérieurement. Si cet envoi d'image échoue pour une raison quelconque — le plus souvent parce que le modèle est encore dans la file d'attente de révision de Meta — AskBiz réessaie automatiquement avec un modèle texte approuvé séparé et plus court, ne portant que le total, le nom de l'entreprise, la date et le moyen de paiement. Vous ne voyez pas cette décision se produire et il n'y a rien à configurer : celui des deux qui réussit est ce que reçoit le client, et une fois le modèle image entièrement approuvé, les envois réussissent naturellement dès la tentative image.",
      },
      {
        heading: "Pourquoi le lien du reçu ne nécessite aucune connexion",
        body: "Comme ce sont les serveurs de Meta — et non votre navigateur ou votre caisse — qui récupèrent l'image du reçu au moment de la livraison, cette requête ne peut pas porter de session de connexion AskBiz avec elle ; il n'y a personne à authentifier. Le point d'entrée qui génère l'image est donc volontairement laissé ouvert, et sa seule protection est que l'identifiant de transaction dans le lien est un UUID impossible à deviner plutôt qu'un petit numéro séquentiel — le même modèle de confiance qu'AskBiz utilise pour tout autre lien limité à une seule transaction. En pratique, cela signifie que le lien de l'image n'est pas quelque chose que vous voudriez transférer sans réfléchir en dehors de WhatsApp, puisque quiconque possède le lien exact peut consulter ce reçu précis — mais ce n'est rien dont vous devez vous occuper : c'est ainsi que l'envoi automatique est conçu pour fonctionner.",
      },
    ],
    faq: [
      {
        q: "Dois-je activer le nouveau design de reçu quelque part dans Paramètres ?",
        a: "Non — le reçu au format image est désormais ce qu'AskBiz envoie automatiquement pour chaque reçu WhatsApp. Il n'y a aucun interrupteur à chercher ; si l'envoi du modèle image échoue pour une raison quelconque, il bascule de lui-même vers un résumé texte.",
      },
      {
        q: "Pourquoi mon reçu affiche-t-il « Taxe » au lieu de « TVA » ?",
        a: "Le libellé TVA n'apparaît que lorsque votre entreprise a un numéro de TVA enregistré dans Paramètres — ce champ est le seul indicateur d'immatriculation à la TVA dont dispose AskBiz. Ajoutez-y votre numéro de TVA, et la ligne « N° TVA » ainsi que la mention fiscale « TVA » commenceront à apparaître sur les reçus.",
      },
      {
        q: "Pourquoi la ligne de TVA affiche-t-elle parfois juste « TVA » sans pourcentage ?",
        a: "AskBiz n'imprime un taux (comme « TVA (20 %) ») que lorsque tous les articles de cette vente précise partagent un seul taux de taxe. Si la vente mélange des articles taxés à des taux différents, il affiche la simple mention « TVA » plutôt que de choisir un taux qui ne serait pas exact pour l'ensemble du reçu.",
      },
      {
        q: "Le code-barres du reçu est-il quelque chose qu'un client pourrait réellement scanner ?",
        a: "Non — il est décoratif. Les barres sont générées à partir de l'identifiant de transaction, donc le même reçu a toujours la même apparence s'il est consulté à nouveau, mais elles n'encodent rien qu'un scanner puisse lire. La véritable référence d'une transaction est le numéro de reçu imprimé au-dessus et en dessous.",
      },
      {
        q: "Quelqu'un possédant le lien de l'image du reçu peut-il consulter le reçu d'une autre personne ?",
        a: "Le lien n'est pas protégé par une connexion — cela ne peut pas être le cas, puisque ce sont les serveurs de livraison de WhatsApp eux-mêmes qui le récupèrent, et non un navigateur connecté — mais il est protégé par le fait que l'identifiant de transaction est un UUID impossible à deviner. Traitez ce lien comme vous traiteriez tout numéro de référence à usage unique : parfaitement adapté tel qu'envoyé au client via WhatsApp, mais pas quelque chose à publier ou à transférer ailleurs.",
      },
    ],
  },

  'whatsapp-daily-pl-brief-askbiz': {
    title: "Votre bilan quotidien arrive désormais sous forme de rapport de résultats WhatsApp",
    description:
      "Le message quotidien automatique d'AskBiz arrive désormais dans WhatsApp sous forme d'un véritable rapport de ventes, de bénéfices et de pertes sur les dernières 24 heures et les 7 derniers jours — voici comment l'activer et ce que signifient les chiffres.",
    keywords: [
      "bilan quotidien WhatsApp",
      "rapport de résultats WhatsApp",
      "notifications AskBiz",
      "bénéfices et pertes",
      "rapport de ventes quotidien",
      "bilan quotidien PDV",
      "paramètres de notifications WhatsApp",
    ],
    keyTakeaways: [
      "Activez-le dans Paramètres > Notifications, sous Canaux, en activant l'interrupteur WhatsApp — un champ de numéro de téléphone n'apparaît qu'une fois l'interrupteur activé.",
      "Il est envoyé automatiquement une fois par jour, et uniquement aux comptes ayant le PDV activé, avec les notifications WhatsApp activées et un numéro enregistré. Les comptes fonctionnant uniquement par e-mail ne le reçoivent pas.",
      "Chaque message rapporte les ventes, le bénéfice (les ventes moins le coût réel, ligne par ligne, des marchandises vendues), et les pertes issues des remboursements — pour les dernières 24 heures comme pour les 7 derniers jours — plus un lien vers askbiz.co/home.",
      "Les pertes comptabilisent les remboursements à la date à laquelle le remboursement a été traité, et non à celle de la vente d'origine — rembourser aujourd'hui une ancienne vente s'ajoute au chiffre de pertes du jour.",
      "Ceci remplace l'ancienne version par e-mail du message quotidien automatique pour les comptes ayant opté pour WhatsApp. Votre Bilan quotidien dans l'application — avec son indice de santé, ses anomalies et son action suggérée — est une fonctionnalité distincte qui continue de fonctionner exactement comme avant.",
    ],
    content: [
      {
        heading: "Ce qui a réellement changé",
        body: "AskBiz envoyait auparavant un e-mail matinal automatique construit autour de trois lignes générées par IA — quelque chose qui s'était amélioré, quelque chose qui nécessitait de l'attention, et une action suggérée pour la journée. Cet e-mail a été retiré pour les comptes ayant opté pour WhatsApp. À la place, une tâche automatisée quotidienne envoie désormais directement sur WhatsApp un rapport de résultats en langage clair : de vraies ventes, un vrai bénéfice et de vraies pertes, extraits directement de vos données de transactions plutôt que résumés sous forme de récit. Aucune interprétation par IA, aucun jargon — juste les chiffres des dernières 24 heures et des 7 derniers jours, présentés dans la devise de votre compte. L'ancienne version essayait de vous dire ce qui comptait ; celle-ci vous donne simplement les chiffres et vous laisse juger.",
      },
      {
        heading: "L'activer",
        body: "Allez dans Paramètres > Notifications sur AskBiz et repérez la section Canaux. Il y a deux interrupteurs ici : Alertes e-mail et WhatsApp. Activez l'interrupteur WhatsApp, et un champ de numéro de téléphone apparaît immédiatement en dessous — ce champ est masqué tant que l'interrupteur n'est pas activé, donc si vous ne voyez nulle part où saisir un numéro, vérifiez d'abord que l'interrupteur lui-même est activé. Saisissez votre numéro WhatsApp au format international (par exemple +254 700 000000) et enregistrez. C'est toute la configuration — il n'y a pas d'étape d'inscription séparée ni de message de confirmation à approuver, ni de période d'attente avant que le premier message puisse partir. Si vous désactivez ensuite l'interrupteur, le champ de numéro disparaît à nouveau, mais votre numéro enregistré ne reçoit plus rien tant que vous ne le réactivez pas.",
      },
      {
        heading: "Qui le reçoit réellement",
        body: "L'envoi quotidien est soumis à des conditions plus strictes qu'il n'y paraît. Il ne part que vers les comptes où le PDV est activé — si vous utilisez AskBiz uniquement pour des sources connectées comme Shopify ou des flux bancaires sans avoir activé le PDV, ce message précis ne vous est pas envoyé, quels que soient vos paramètres de notification. En plus de cela, il vous faut à la fois l'interrupteur WhatsApp activé et un numéro enregistré ; n'avoir que l'un des deux signifie que vous êtes ignoré, et la tâche automatisée passe simplement au compte suivant sans rien générer pour vous. Et c'est strictement une fois par entreprise et par jour — si un bilan a déjà été généré pour votre compte à la date du jour, le système n'en génère ni n'en envoie pas de second, même si vous vérifiez à nouveau plus tard dans la journée. Il n'existe pas non plus d'option manuelle « envoyer maintenant » ; le message ne part jamais que selon son propre calendrier.",
      },
      {
        heading: "Comment les ventes, le bénéfice et les pertes sont calculés",
        body: "Les ventes correspondent au total de vos transactions PDV terminées sur la période — les paiements par carte ou mobile money encore en attente de confirmation ne sont pas comptabilisés tant qu'ils ne le sont pas. Le bénéfice n'est pas une estimation approximative de marge — c'est le chiffre des ventes moins le coût réel des marchandises vendues, calculé ligne par ligne à partir de la quantité et du prix de revient enregistrés sur chaque produit vendu, puis additionné sur toute la période. Les pertes représentent la valeur des lignes remboursées, et non un simple décompte d'événements de remboursement, et elles sont extraites d'un ensemble de transactions distinct — tout ce qui est marqué comme remboursé ou partiellement remboursé. C'est là que la logique est facile à mal interpréter : les pertes sont attribuées au jour où le remboursement a été traité, pas au jour où la vente d'origine a eu lieu. Si un client a acheté quelque chose il y a trois semaines et que vous traitez le remboursement ce matin, la valeur intégrale de ce remboursement atterrit dans le chiffre de pertes du jour — cela n'ajuste pas rétroactivement le jour de la vente d'origine. Sur une période de 7 jours, cela prête rarement à confusion, mais il est utile de le savoir si vous voyez un jour un chiffre de pertes sur 24 heures qui semble déconnecté de l'activité réelle de cette journée.",
      },
      {
        heading: "Ce que vous verrez, et vers quoi ça renvoie",
        body: "Le message lui-même est un court texte WhatsApp : le nom de votre entreprise en haut, puis Ventes, Bénéfice et Pertes pour les dernières 24 heures, suivis des trois mêmes chiffres pour les 7 derniers jours, et un lien vers askbiz.co/home en bas. Comme c'est un simple message WhatsApp, les chiffres eux-mêmes sont lisibles dès qu'il arrive — aucune application à ouvrir, aucune connexion nécessaire juste pour les voir. Le lien est un raccourci pour retourner dans AskBiz si vous voulez approfondir un chiffre ; l'ouvrir vous demandera tout de même de vous connecter, comme n'importe quel autre lien AskBiz.",
      },
      {
        heading: "Ce que cela ne remplace pas",
        body: "Il vaut la peine d'être clair sur la limite entre les deux. Le rapport WhatsApp est une fonctionnalité distincte de votre Bilan quotidien dans l'application — celui avec un indice de santé de l'entreprise, des signalements d'anomalies et une action suggérée, disponible chaque fois que vous ouvrez AskBiz. Ce point d'accès et ses données n'ont pas été touchés par ce changement et continuent de fonctionner indépendamment du fait que vous ayez ou non les notifications WhatsApp activées. Ce qui a changé, c'est l'envoi automatique poussé : l'ancien récit par e-mail qui arrivait auparavant sans y être invité chaque matin a disparu pour les comptes ayant opté pour WhatsApp, remplacé par ce message de résultats plus littéral. Si vous voulez l'indice de santé et le résumé de type action à mener, cela vit toujours dans l'application — ce n'est simplement plus ce qui est poussé automatiquement sur votre téléphone.",
      },
    ],
    faq: [
      {
        q: "Je n'utilise pas AskBiz POS — vais-je recevoir ce message WhatsApp ?",
        a: "Non. L'envoi quotidien ne part que vers les comptes ayant le PDV activé, car les chiffres de ventes, de bénéfice et de pertes sont calculés à partir des données de transactions et de remboursements du PDV. Si vous utilisez AskBiz uniquement pour des sources connectées comme Shopify ou un flux bancaire, ce message précis ne vous est pas envoyé.",
      },
      {
        q: "J'ai déjà activé les Alertes e-mail — dois-je faire autre chose ?",
        a: "Oui. Alertes e-mail et WhatsApp sont des interrupteurs distincts dans Paramètres > Notifications, et seul l'interrupteur WhatsApp (avec un numéro enregistré) déclenche ce message quotidien. Avoir uniquement les Alertes e-mail activées ne l'active pas.",
      },
      {
        q: "Pourquoi une perte sur le message du jour provient-elle d'une vente que j'ai faite il y a des semaines ?",
        a: "Les pertes sont comptabilisées à la date à laquelle le remboursement a été traité, pas à la date de la vente d'origine. Si vous remboursez aujourd'hui une ancienne transaction, sa valeur compte dans le chiffre de pertes du jour, à la fois dans le total sur 24 heures et dans celui sur 7 jours.",
      },
      {
        q: "Puis-je recevoir plusieurs fois ce message si je revérifie l'application plus tard dans la journée ?",
        a: "Non. Le bilan est généré une fois par entreprise et par jour calendaire — s'il en a déjà été créé un pour aujourd'hui, le système ignore votre compte plutôt que de générer ou d'envoyer un doublon.",
      },
      {
        q: "Cela remplace-t-il le Bilan quotidien que je vois dans l'application, avec l'indice de santé et l'action suggérée ?",
        a: "Non, c'est une fonctionnalité distincte et elle n'a pas été modifiée. Le Bilan quotidien dans l'application continue de calculer indépendamment son propre indice de santé, ses anomalies et son action à mener, et vous pouvez l'ouvrir dans AskBiz à tout moment, quels que soient vos paramètres WhatsApp.",
      },
    ],
  },

  'forgot-pin-reset-whatsapp-askbiz': {
    title: "Code PIN AskBiz oublié ? Réinitialisez-le vous-même via WhatsApp",
    description:
      "Comment récupérer votre propre code PIN de connexion AskBiz sans contacter le support — vérifiez votre téléphone via WhatsApp et définissez un nouveau code PIN à 4 chiffres en moins d'une minute.",
    keywords: [
      "PIN oublié",
      "réinitialiser le PIN",
      "AskBiz",
      "vérification WhatsApp",
      "connexion",
      "connexion par téléphone",
      "récupération de compte",
      "tutoriel",
    ],
    keyTakeaways: [
      "« PIN oublié ? » sur la page de connexion lance une réinitialisation en libre-service — saisissez votre numéro de téléphone, confirmez un code à 6 chiffres envoyé via WhatsApp, puis définissez un nouveau code PIN à 4 chiffres.",
      "Le code expire au bout de 10 minutes, autorise 5 tentatives, et il y a un délai de 60 secondes avant de pouvoir en redemander un autre.",
      "Cela réinitialise votre propre code PIN de connexion en tant que propriétaire pour l'application principale AskBiz — cela n'a rien à voir avec les codes PIN de caisse du personnel PDV, qu'un gérant continue de réinitialiser depuis POS > Personnel > Modifier > Réinitialiser le PIN.",
      "Avant la mise en place de cette fonctionnalité, un propriétaire bloqué n'avait aucune option en libre-service — la seule voie était de contacter le support et d'attendre qu'un administrateur génère et transmette manuellement un code PIN temporaire.",
    ],
    content: [
      {
        heading: "Deux codes PIN différents, et il s'agit ici de l'un d'eux",
        body: "AskBiz possède en réalité deux codes PIN qu'il est facile de confondre. Votre PIN de connexion est celui que vous utilisez pour vous connecter à l'application principale AskBiz avec votre propre numéro de téléphone — c'est ce qui vous permet, en tant que propriétaire du compte, d'accéder à votre tableau de bord, vos rapports et vos paramètres. Un PIN de caisse du personnel PDV est une chose totalement séparée : un court code qu'un gérant attribue à chaque caissier pour qu'il puisse pointer sur la caisse sans partager la connexion du propriétaire. Cet article traite du premier — votre propre PIN de connexion. Si un caissier a oublié son PIN de caisse, cela se règle par un gérant ou un propriétaire qui va dans POS > Personnel, clique sur Modifier à côté de son nom, et choisit Réinitialiser le PIN — rien n'a changé dans ce processus. Ce qui est nouveau, c'est une façon de récupérer votre propre PIN de connexion sans l'aide de personne d'autre.",
      },
      {
        heading: "Où le trouver",
        body: "Sur la page de connexion d'AskBiz, repérez, juste sous le champ du PIN, un lien PIN oublié ?. En cliquant dessus, vous accédez à une page de récupération dédiée, à askbiz.co/forgot-pin, séparée de la carte de connexion principale, conçue comme un écran étroit à usage unique afin qu'il soit évident que vous êtes dans un parcours de récupération plutôt qu'en train de vous connecter normalement.",
      },
      {
        heading: "Étape 1 : confirmez votre numéro de téléphone",
        body: "Saisissez le numéro de téléphone enregistré pour votre compte AskBiz, avec le bon indicatif pays — le même numéro que celui avec lequel vous vous connectez habituellement. Appuyez sur Envoyer le code via WhatsApp. Quel que soit le numéro que vous saisissez, vous verrez ensuite le même message de confirmation : AskBiz ne révèle jamais sur cet écran si ce numéro appartient réellement à un compte. C'est délibéré — cela empêche que le parcours de réinitialisation soit utilisé comme un moyen de vérifier quels numéros de téléphone sont enregistrés sur AskBiz. Si le numéro appartient bien à un compte, un code à 6 chiffres arrive sur WhatsApp en quelques instants.",
      },
      {
        heading: "Étape 2 : saisissez le code et choisissez un nouveau PIN",
        body: "Sur l'écran suivant, saisissez le code à 6 chiffres reçu sur WhatsApp ainsi qu'un nouveau PIN à 4 chiffres, tapé deux fois pour confirmer qu'il correspond. Validez, et — à condition que le code soit correct et toujours valide — votre PIN de connexion est mis à jour immédiatement. Vous êtes redirigé vers un écran de confirmation avec un lien direct vers la connexion, où votre nouveau PIN fonctionne aussitôt.",
      },
      {
        heading: "Les limites, et pourquoi elles existent",
        body: "Quelques limites protègent ce parcours contre les abus. Le code expire 10 minutes après son envoi, afin qu'un ancien code non utilisé qui traînerait dans une conversation WhatsApp ne puisse pas être utilisé plus tard. Vous disposez de 5 tentatives pour le saisir correctement avant qu'il ne soit invalidé et que vous deviez en redemander un nouveau. Et si vous appuyez sur Renvoyer le code, il y a un délai de 60 secondes avant qu'un autre ne parte réellement, ce qui empêche le même numéro d'être inondé de codes. Rien de tout cela ne devrait vous gêner lors d'une réinitialisation normale — saisissez le code une fois, correctement, dans les quelques minutes suivant son arrivée, et c'est terminé. Les limites ne se déclenchent que si quelque chose s'est mal passé, ce qui est exactement le moment où vous voulez qu'elles agissent.",
      },
      {
        heading: "Comment AskBiz relie votre numéro de téléphone à votre compte",
        body: "En coulisses, AskBiz recherche votre numéro de téléphone dans une table dédiée, construite spécifiquement à cette fin, plutôt que de s'appuyer sur le numéro de téléphone stocké dans vos paramètres de profil généraux. Cette distinction compte : le champ téléphone de votre profil n'est qu'une valeur de paramètres modifiable — vous pourriez le mettre à jour à tout moment, et rien n'empêche deux personnes de saisir par erreur un numéro qui se ressemble. Le parcours de réinitialisation a besoin d'un lien fiable et sans ambiguïté entre un numéro de téléphone et exactement un compte avant de laisser quiconque changer un PIN, il utilise donc à la place un enregistrement d'identité séparé, mis en place dès votre première inscription et tenu synchronisé depuis lors.",
      },
      {
        heading: "À quoi ressemblait la récupération avant que cela n'existe",
        body: "Jusqu'à fin juillet 2026, il n'existait aucune option en libre-service. Si vous oubliiez votre PIN de connexion AskBiz, la seule voie était de contacter directement le support — par e-mail ou WhatsApp — d'expliquer qui vous étiez, et d'attendre qu'un administrateur côté AskBiz génère manuellement un PIN temporaire et vous le transmette par un autre canal. Cela fonctionnait, mais cela signifiait que chaque blocage nécessitait une personne à l'autre bout, et vous deviez attendre le temps qu'il fallait à quelqu'un pour s'en occuper. Le parcours vérifié par WhatsApp accomplit la même tâche en moins d'une minute, à tout moment, sans que personne d'autre n'ait besoin d'intervenir.",
      },
    ],
    faq: [
      {
        q: "Est-ce la même chose que de réinitialiser le PIN de caisse d'un caissier ?",
        a: "Non. Cela réinitialise votre propre PIN de connexion en tant que propriétaire pour l'application principale AskBiz. Le PIN de caisse PDV d'un caissier relève d'un système entièrement séparé, et il continue de se réinitialiser exactement comme avant — un gérant ou un propriétaire va dans POS > Personnel, clique sur Modifier à côté de ce membre du personnel, et choisit Réinitialiser le PIN.",
      },
      {
        q: "J'ai saisi mon numéro de téléphone mais je n'ai jamais reçu de code WhatsApp. Qu'est-ce qui ne va pas ?",
        a: "Vous verrez le même message de confirmation « vérifiez WhatsApp », que ce numéro soit réellement enregistré ou non — c'est intentionnel, afin que la page ne puisse pas servir à vérifier quels numéros ont des comptes. Si rien n'arrive, vérifiez que vous avez saisi exactement le numéro avec lequel votre compte est enregistré, indicatif pays compris, et réessayez après le délai de 60 secondes.",
      },
      {
        q: "Combien de temps ai-je pour saisir le code avant qu'il n'expire ?",
        a: "10 minutes à partir de son envoi. Passé ce délai, il n'est plus valide et vous devrez en redemander un depuis l'écran précédent.",
      },
      {
        q: "Que se passe-t-il si je continue à saisir le mauvais code ?",
        a: "Vous disposez de 5 tentatives. Passé ce nombre, le code est invalidé par mesure de sécurité et vous devrez en redemander un nouveau plutôt que de continuer à deviner.",
      },
      {
        q: "Puis-je redemander un autre code immédiatement si je n'ai pas reçu le premier ?",
        a: "Il y a un délai de 60 secondes entre deux demandes de code pour le même numéro. Passé ce délai, appuyez sur Renvoyer le code sur l'écran de vérification pour en obtenir un nouveau.",
      },
    ],
  },

  'zakat-calculator-charity-askbiz': {
    title: "Le calculateur de zakat d'AskBiz : comment il fonctionne et où le trouver",
    description:
      "Comment l'onglet Zakat dans Mon entreprise calcule la position de zakat de votre entreprise à partir du stock, de la trésorerie, des créances et des dettes en temps réel, suit automatiquement le nisab et le hawl, et vous connecte à un annuaire d'œuvres de bienfaisance partenaires — gratuit sur tous les plans.",
    keywords: [
      "calculateur de zakat",
      "calculateur de zakat pour entreprise",
      "calculateur de nisab",
      "suivi du hawl",
      "outil de zakat pour entreprise",
      "finance islamique entreprise",
      "annuaire d'œuvres de bienfaisance zakat",
      "AskBiz",
      "Mon entreprise",
    ],
    keyTakeaways: [
      "Le calculateur de zakat se trouve dans Mon entreprise (/intelligence) sous son propre onglet Zakat — lien direct /intelligence?tab=zakat — et il est gratuit sur tous les plans, y compris Gratuit, sans mise à niveau requise.",
      "Il calcule la zakat uniquement sur les actifs commerciaux : trésorerie + stock (valeur de détail) + créances − dettes, avec un plancher à zéro. Chaque chiffre peut être modifié pour un seul calcul sans toucher à votre inventaire réel ni à vos données financières.",
      "Le nisab est le seuil standard fondé sur le poids (87,48 g d'or ou 612,36 g d'argent, l'argent étant utilisé par défaut) converti dans votre devise via une recherche manuelle « Vérifier le cours actuel » — il ne se met pas à jour tout seul.",
      "Le hawl (l'année lunaire de 355 jours) est suivi automatiquement : la barre de progression démarre le jour où votre base de zakat franchit pour la première fois le nisab, et se réinitialise si elle repasse en dessous avant la fin de l'année.",
      "C'est une aide au calcul, pas une fatwa — cela ne couvre pas les règles propres à chaque école juridique, la zakat agricole ou sur le bétail, l'or ou l'argent détenus à titre personnel, ni le patrimoine personnel en dehors de l'entreprise.",
    ],
    content: [
      {
        heading: "Où le trouver",
        body: "Ouvrez Mon entreprise depuis la navigation principale — c'est la page /intelligence — et sélectionnez l'onglet Zakat. Il se trouve aux côtés d'Aperçu, CFO, Équipe, Logistique, Marché et Actions : c'est donc un onglet à part entière, pas un paramètre caché. Pour y aller directement, le lien est /intelligence?tab=zakat.\n\nUne chose à savoir avant de chercher un autre chemin : le chat IA d'AskBiz ne sait pas encore vous y renvoyer par un lien direct, comme il peut le faire pour certaines autres parties de l'application. Lui demander « emmène-moi à zakat » ne vous déposera pas sur l'onglet — ouvrez plutôt Mon entreprise et cliquez directement sur Zakat.",
      },
      {
        heading: "C'est gratuit sur tous les plans",
        body: "Le calculateur de zakat n'est verrouillé derrière aucun palier Growth, Business ou autre — il est disponible sur le plan Gratuit sans mise à niveau nécessaire. C'est un choix délibéré : la zakat est une obligation religieuse liée à votre position commerciale réelle, pas une fonctionnalité analytique premium, donc AskBiz ne met pas de barrière payante devant.",
      },
      {
        heading: "Ce qu'il calcule réellement : la base de zakat",
        body: "Chaque fois que vous ouvrez le calculateur, AskBiz extrait quatre chiffres en temps réel de vos données d'entreprise et les combine en ce qu'il appelle votre base de zakat :\n\n- Trésorerie — le solde de trésorerie que vous avez saisi dans vos paramètres de coûts CFO. Si vous n'en avez jamais saisi un, la case affiche « Non défini » plutôt que de le traiter silencieusement comme zéro, afin que vous ne sous-estimiez pas accidentellement votre position.\n- Stock — la valeur de détail de votre stock actif, calculée comme prix de vente × quantité disponible pour tout ce que vous détenez actuellement.\n- Créances — l'argent qui vous est dû, tiré de vos créances enregistrées.\n- Dettes — l'argent que vous devez, soustrait du total. Cela inclut tout bon de commande pour lequel vous avez réceptionné du stock mais que vous n'avez pas encore intégralement payé à votre fournisseur.\n\nLa base de zakat correspond à Trésorerie + Stock + Créances − Dettes, avec un plancher à zéro afin qu'elle ne devienne jamais négative. Cela ne couvre que les actifs commerciaux — ce n'est pas un instantané de tout votre bilan, et cela exclut délibérément les actifs immobilisés comme l'équipement ou les locaux, qui ne sont pas soumis à la zakat de la même manière.\n\nChacun de ces quatre chiffres est modifiable d'un simple appui. Si un chiffre vous semble erroné — votre solde de trésorerie est obsolète, ou vous savez qu'une créance vient d'être annulée — appuyez dessus et saisissez une valeur corrigée pour ce calcul. La modification n'affecte que le résultat affiché : elle n'est jamais réécrite dans votre inventaire ou vos données CFO, et elle ne sera pas mémorisée la prochaine fois que vous ouvrirez l'onglet, sauf si vous la saisissez à nouveau.",
      },
      {
        heading: "Le nisab : le seuil qui détermine si vous devez quoi que ce soit",
        body: "La zakat n'est due qu'une fois que votre base de zakat atteint ou dépasse le nisab, le seuil minimum de richesse. AskBiz utilise la définition standard fondée sur le poids : 87,48 g d'or, ou 612,36 g d'argent. L'argent est utilisé par défaut car c'est le seuil le plus bas des deux — vous pouvez basculer vers l'or à tout moment si c'est ce sur quoi vous préférez calculer.\n\nLe calculateur ne met pas à jour les cours des métaux de lui-même. Vous déclenchez une recherche manuellement avec le bouton « Vérifier le cours actuel », qui lance une recherche de prix en direct et convertit le seuil de poids dans votre devise locale. AskBiz met ce résultat en cache avec la date de vérification — il ne recherche donc pas le prix à neuf à chaque ouverture de l'onglet — et chaque métal mémorise séparément son propre dernier cours vérifié et sa date, de sorte que basculer entre l'or et l'argent ne fait perdre aucune des deux valeurs. Considérez ce chiffre comme une estimation de marché indicative plutôt qu'un cours au comptant exact ; si la précision compte vraiment pour votre situation, confirmez-la de façon indépendante avant de vous y fier.",
      },
      {
        heading: "Le hawl : pourquoi être au-dessus du nisab aujourd'hui ne signifie pas devoir la zakat aujourd'hui",
        body: "Franchir le nisab ne signifie pas que la zakat est due immédiatement — votre base de zakat doit rester au niveau ou au-dessus du nisab pendant une année lunaire complète, le hawl, avant que quoi que ce soit ne soit réellement dû. AskBiz suit automatiquement le hawl de 355 jours, sans saisie manuelle requise :\n\n- Le jour où votre base de zakat franchit pour la première fois le nisab, AskBiz démarre le compteur du hawl et affiche une barre de progression.\n- Si votre base de zakat repasse sous le nisab avant la fin de l'année, le compteur se réinitialise. Il repart la prochaine fois que vous franchissez à nouveau le seuil.\n- Une fois qu'un hawl complet s'est écoulé alors que vous êtes toujours au-dessus du nisab, le statut passe à Dû maintenant, indiquant 2,5 % de votre base de zakat comme montant dû.\n\nTant que le hawl n'est pas terminé, le chiffre affiché est une estimation évolutive fondée sur vos chiffres actuels, pas un montant dû — il continuera de bouger à mesure que votre trésorerie, votre stock et vos créances changent au jour le jour. Le badge de statut vous indique exactement où vous en êtes : Vérifier le cours pour commencer (le nisab n'a pas encore été recherché), En dessous du nisab, Au-dessus du nisab (hawl en cours), ou Dû maintenant.",
      },
      {
        heading: "Donner à une œuvre de bienfaisance — et pourquoi vous n'êtes pas limité à la liste d'AskBiz",
        body: "Sous le calculateur, AskBiz répertorie des œuvres de bienfaisance partenaires auxquelles vous pouvez donner directement, filtrées selon votre pays lorsqu'AskBiz a une correspondance. Chaque entrée renvoie vers la propre page de don de l'œuvre — AskBiz ne traite pas le paiement lui-même, il vous y oriente simplement.\n\nL'annuaire est une commodité, pas une obligation. Vous êtes entièrement libre de verser votre zakat à l'œuvre ou au bénéficiaire de votre choix, qu'il figure ou non dans la liste. Si rien n'est encore répertorié pour votre pays, il s'agit d'une lacune d'un annuaire encore en croissance, pas d'un signe que vous n'avez nulle part où donner — utilisez l'œuvre en laquelle vous avez déjà confiance.",
      },
      {
        heading: "Ce que cet outil ne fait pas",
        body: "Le calculateur de zakat est conçu comme une aide au calcul fondée sur la méthodologie standard du nisab, du hawl et des 2,5 % pour la zakat sur les actifs commerciaux — ce n'est pas une fatwa, et il ne cherche pas à en être une. Il ne tient pas compte des différences propres à chaque école juridique dans le calcul de la zakat, ne couvre pas la zakat agricole ou sur le bétail, n'inclut pas l'or ou l'argent détenus à titre personnel, et ne touche pas à votre patrimoine personnel en dehors de l'entreprise. Si votre situation exige une décision religieuse plutôt qu'un chiffre, c'est une conversation à avoir avec votre propre savant ou imam — AskBiz vous donne les chiffres à apporter à cette conversation, pas un substitut à celle-ci.",
      },
    ],
    faq: [
      {
        q: "Le calculateur de zakat est-il vraiment gratuit, ou faut-il un plan payant ?",
        a: "Il est réellement gratuit sur tous les plans, y compris le plan Gratuit — aucune mise à niveau n'est requise pour l'utiliser.",
      },
      {
        q: "Pourquoi mon chiffre de trésorerie affiche-t-il « Non défini » au lieu de zéro ?",
        a: "AskBiz ne connaît votre solde de trésorerie que si vous en avez saisi un dans vos paramètres de coûts CFO. Si ce n'est pas le cas, la case affiche « Non défini » plutôt que de supposer zéro, car supposer zéro pourrait sous-estimer votre base de zakat. Appuyez sur la case pour saisir directement un chiffre de trésorerie pour le calcul.",
      },
      {
        q: "Si je corrige un chiffre dans le calculateur, cela met-il à jour mon inventaire ou mes chiffres CFO réels ?",
        a: "Non. Les modifications n'affectent que le calcul que vous consultez à ce moment-là — elles ne sont jamais réécrites dans votre inventaire, votre CFO ou vos données comptables, et elles ne sont pas mémorisées la prochaine fois que vous ouvrez l'onglet.",
      },
      {
        q: "Être au-dessus du nisab signifie-t-il que je dois la zakat dès maintenant ?",
        a: "Pas nécessairement. Vous devez rester au niveau ou au-dessus du nisab pendant une année lunaire complète (355 jours, le hawl) avant que la zakat ne soit réellement due. AskBiz suit cela avec une barre de progression et la réinitialise si votre base de zakat repasse sous le nisab avant la fin de l'année.",
      },
      {
        q: "Puis-je donner ma zakat à une œuvre de bienfaisance qui ne figure pas dans l'annuaire d'AskBiz ?",
        a: "Oui. La liste d'œuvres partenaires est une commodité pour donner directement depuis AskBiz — vous êtes libre de verser votre zakat à toute œuvre ou à tout bénéficiaire éligible de votre choix.",
      },
    ],
  },

  'factory-sector-guide-askbiz': {
    title: "Gérer une usine dans AskBiz : lots, qualité, arrêts de production, équipes et lettres de voiture",
    description: "Un tour d'horizon complet du mode sectoriel Usine d'AskBiz — les neuf pages dédiées, les quatre étapes de capture photo, les cinq rôles du personnel d'usine, et les 12 modèles de type d'usine qui préremplissent votre processus.",
    keywords: [
      "mode Usine",
      "AskBiz",
      "fabrication",
      "suivi des lots",
      "contrôle qualité",
      "arrêt de production",
      "équipe",
      "lettre de voiture",
      "type d'usine",
      "production",
    ],
    keyTakeaways: [
      "Usine est l'un des six modes sectoriels du PDV (aux côtés de Commerce de détail, Restaurant, Réparation, Salon et Logistique), avec neuf pages dédiées : Capture, Lot, Qualité, Arrêts, Équipe, Lettre de voiture, Production, Personnel, et Approbations.",
      "La capture photo est répartie en quatre étapes — réception, sortie, perte, expédition — chacune protégée par sa propre permission, afin qu'un rôle puisse se voir attribuer uniquement les étapes qu'il doit réellement photographier.",
      "Choisir le type d'entreprise « fabricant » lors de l'intégration (ou plus tard dans les paramètres admin) fait apparaître un sélecteur de type d'usine avec 12 modèles couvrant le pressage d'huile, l'eau, la mouture, les produits laitiers, la boulangerie, le savon, la volaille, le café, le fumage du poisson et plus encore.",
      "Chaque modèle préremplit des consignes par étape et une fourchette de rendement de recette suggérée pour votre processus — les étapes sont partagées, mais les rendements varient énormément selon le produit, d'environ 18 % à 76 % pour les quatre types de graines de pressage d'huile à eux seuls.",
      "Cinq rôles de personnel propres à l'usine existent — opérateur de ligne, inspecteur qualité, superviseur d'équipe, responsable de production, et responsable d'inventaire — chacun associé à un ensemble de permissions distinct plutôt qu'à un rôle caissier générique.",
    ],
    content: [
      {
        heading: "Usine est un mode sectoriel complet, pas un ajout au Commerce de détail",
        body: "AskBiz POS comporte six modes sectoriels : Commerce de détail, Restaurant, Réparation, Salon, Usine, et Logistique. Le Commerce de détail est le mode par défaut pour la plupart des entreprises, mais si vous gérez une activité de production — pressage d'huile, mouture de céréales, boulangerie, embouteillage d'eau, fabrication de savon — le mode Usine remplace le menu Stock/Ventes/Clients de style commerce de détail par un ensemble de pages construites autour des lots, et non des transactions de vente individuelles. Vous accédez au mode Usine depuis POS > Opérations, où il apparaît comme l'un des boutons de sélection de secteur aux côtés des cinq autres. En coulisses, le mode Usine comprend neuf pages dédiées : Capture, Lot, Qualité, Arrêts, Équipe, Lettre de voiture, Production, Personnel, et Approbations. Chacune couvre une partie distincte de la gestion d'un site de production, et elles sont conçues pour être utilisées ensemble plutôt qu'isolément — un enregistrement de lot fait référence aux captures et contrôles qualité effectués pendant sa production, un enregistrement d'équipe montre ce qui s'est passé sur le site pendant cette période, et une lettre de voiture relie une capture d'expédition aux documents qui accompagnent la marchandise.",
      },
      {
        heading: "Capture : quatre étapes, quatre permissions distinctes",
        body: "Capture est le point d'entrée, axé sur la caméra, pour tout ce qui se passe sur le site, et il se divise en quatre types de capture distincts : réception (photographier la matière première à son arrivée), sortie (photographier ce qu'un lot a réellement produit), perte (photographier les défauts, la détérioration ou la perte, avec un motif obligatoire avant l'enregistrement), et expédition (photographier le lot sortant, avec une destination obligatoire avant l'enregistrement). Ce ne sont pas simplement quatre boutons sur un même écran — chaque étape est protégée par sa propre permission (camera.intake, camera.output, camera.wastage, camera.dispatch), ce qui vous permet de confier à un opérateur de ligne junior uniquement la réception et la sortie, de réserver la perte et l'expédition au personnel plus expérimenté, ou de donner à un rôle axé sur la sécurité/logistique uniquement l'expédition. Cette granularité permet de faire correspondre l'accès à la caméra à ce que chacun est réellement censé photographier, plutôt qu'une permission caméra tout-ou-rien.",
      },
      {
        heading: "Lot, Qualité, Arrêts, Équipe et Lettre de voiture",
        body: "Lot suit une série de production de bout en bout — les captures de réception et de sortie qui s'y rattachent, la recette et le rendement attendu par rapport auxquels elle est mesurée, et si le résultat réel se situe dans, au-dessus ou en dessous de cette fourchette. Qualité enregistre les contrôles d'inspection associés à un lot, afin que les défauts soient consignés en lien avec la production spécifique qui les a causés plutôt que comme une note vague. Arrêts consigne les interruptions — une panne de machine, une coupure de courant, une rupture d'approvisionnement — afin que vous puissiez voir où le temps de production est réellement perdu sur une semaine ou un mois, plutôt que de le deviner. Équipe est un enregistrement de poste de production dédié (délibérément distinct de la table existante de poste de caisse utilisée ailleurs dans le PDV, car un poste sur un site d'usine et une session de caisse d'un caissier concernent un travail différent, mesuré différemment). Lettre de voiture génère les documents d'expédition pour les marchandises sortantes, liés à la capture d'expédition et aux notes de destination saisies à cette étape. Production vous donne la vue d'ensemble du site sur tout ce qui précède, et Approbations est l'endroit où un superviseur ou un gérant valide les captures, lots ou lettres de voiture nécessitant une vérification avant d'être finalisés.",
      },
      {
        heading: "Cinq rôles de personnel conçus pour un site d'usine, pas pour une caisse de magasin",
        body: "Le mode Usine s'accompagne de cinq rôles de personnel dédiés, chacun associé à son propre ensemble de permissions plutôt que réutilisé du commerce de détail : opérateur de ligne d'usine, inspecteur qualité d'usine, superviseur d'équipe d'usine, responsable de production d'usine, et responsable d'inventaire d'usine. Un opérateur de ligne est limité au travail quotidien de capture et de suivi des lots sur le site ; un inspecteur qualité obtient les outils de contrôle et de consignation des défauts ; un superviseur d'équipe supervise un poste et approuve ce qui s'y est passé ; un responsable de production et un responsable d'inventaire obtiennent une visibilité plus large sur les lots, les recettes et le stock. Attribuer le bon rôle importe pour davantage que la simple organisation — c'est ce qui détermine quelles étapes de capture et quelles pages Usine un membre du personnel donné peut réellement ouvrir lorsqu'il se connecte avec son PIN.",
      },
      {
        heading: "Douze modèles de type d'usine — une même forme de processus, des rendements très différents",
        body: "Lorsque vous définissez le type d'entreprise sur « fabricant » lors de l'intégration — ou que vous le modifiez plus tard dans les paramètres admin — AskBiz fait apparaître un sélecteur de type d'usine avec 12 modèles : pressage d'huile de cuisson (sésame, arachide, tournesol ou palme), eau potable conditionnée, mouture de maïs, transformation du manioc, décorticage du riz, produits laitiers, boulangerie, savon, blocs de béton, volaille, café, et fumage du poisson. Choisir un modèle préremplit des consignes par étape adaptées à votre processus spécifique — par exemple, le modèle de pressage d'huile parcourt la réception, le nettoyage/torréfaction, le pressage, la filtration/mise en bouteille, et l'expédition — ainsi qu'une recette suggérée avec un pourcentage de rendement attendu et une fourchette min/max réaliste, afin que vous ne partiez pas d'un tableau vide pour le suivi de votre rendement. Les étapes sont largement partagées au sein d'une même famille de modèles, mais ce n'est pas le cas des rendements : le seul pressage d'huile s'étend d'environ 18 % à 76 % selon celui des quatre types de graines utilisé et selon qu'elles ont été torréfiées au préalable, ce qui explique précisément pourquoi le modèle conserve une ligne de recette distincte par graine plutôt qu'un chiffre moyen unique. Vous pouvez accepter les chiffres suggérés d'un modèle comme point de départ, puis les ajuster une fois que vos propres lots révèlent un ratio réel différent.",
      },
      {
        heading: "Ce qui a changé récemment, et pourquoi c'est important si vous avez configuré cela il y a un moment",
        body: "Si vous avez configuré le mode Usine avant fin juillet 2026, sachez que seules Capture et Approbations étaient réellement fonctionnelles en production jusqu'alors — Lot, Qualité, Arrêts, Équipe et Lettre de voiture disposaient de pages front-end entièrement construites, mais les routes API correspondantes n'existaient pas encore, si bien que tout ce qui y était saisi n'était pas enregistré. Un correctif a été déployé en même temps que les 12 modèles de type d'usine, construisant les cinq backends manquants et leurs tables de base de données. Ce même correctif a également résolu un bug de permission où le rôle d'opérateur de ligne d'usine se retrouvait sans aucune permission caméra au lieu de l'accès réception/sortie prévu ; tout rôle d'opérateur de ligne attribué avant le correctif devrait donc être vérifié à nouveau dans Personnel pour confirmer qu'il peut désormais réellement ouvrir la caméra. Si votre équipe a utilisé Lot, Qualité, Arrêts, Équipe ou Lettre de voiture sans rien voir enregistré, voilà l'explication — et c'est désormais résolu, donc il vaut la peine de ressaisir tout ce que vous aviez essayé de consigner pendant cette période.",
      },
    ],
    faq: [
      {
        q: "Comment faire passer mon entreprise en mode Usine ?",
        a: "Dans POS > Opérations, cliquez sur le bouton Usine aux côtés des cinq autres modes sectoriels. Si vous configurez un nouveau compte, choisir le type d'entreprise « fabricant » lors de l'intégration fait aussi apparaître directement le sélecteur de type d'usine ; vous pouvez modifier le type d'usine plus tard depuis les paramètres admin.",
      },
      {
        q: "Quelle est la différence entre la page Lot et la page Capture ?",
        a: "Capture est l'endroit où vous prenez la photo proprement dite pour un moment précis — réception, sortie, perte ou expédition. Lot est l'enregistrement qui relie ces captures entre elles pour une série de production donnée, avec la recette par rapport à laquelle elle est mesurée et si le rendement obtenu correspond à l'objectif.",
      },
      {
        q: "Pourquoi l'un de mes employés ne peut-il pas utiliser la caméra en mode Usine ?",
        a: "L'accès à la caméra en mode Usine est réparti en quatre permissions distinctes — réception, sortie, perte, expédition — et chaque rôle de personnel n'obtient que celles auxquelles il est censé avoir droit. Vérifiez son rôle attribué dans Usine > Personnel ; s'il a le rôle opérateur de ligne d'usine et a été configuré avant le correctif de permission de juillet 2026, vérifiez qu'il dispose désormais bien des permissions camera.intake et camera.output attendues.",
      },
      {
        q: "Les 12 modèles de type d'usine m'enferment-ils dans un processus figé ?",
        a: "Non. Un modèle préremplit des consignes par étape et une recette de départ avec une fourchette de rendement attendue, mais chaque champ est modifiable. Une fois que vous avez traité quelques lots réels et que vous connaissez votre rendement effectif, mettez la recette à jour en conséquence — le modèle est un point de départ, pas une contrainte.",
      },
      {
        q: "Mon usine exerce une activité qui ne figure pas parmi les 12 modèles — puis-je quand même utiliser le mode Usine ?",
        a: "Oui. Les 12 modèles sont des préréglages pratiques pour les secteurs de fabrication africains courants, pas une obligation. Vous pouvez utiliser les pages Capture, Lot, Qualité, Arrêts, Équipe, Lettre de voiture, Production, Personnel et Approbations du mode Usine sans choisir de modèle — vous saisirez simplement vos propres noms d'étapes et chiffres de recette à partir de zéro, au lieu de partir de valeurs préremplies.",
      },
    ],
  },

  'pos-free-trial-explained-askbiz': {
    title: "Comment fonctionne l'essai gratuit d'AskBiz POS",
    description: "AskBiz POS propose un essai gratuit unique de 30 jours, sans carte bancaire requise. Voici exactement comment le réclamer, ce qu'il inclut, et ce qui se passe à son terme.",
    keywords: ["essai gratuit PDV", "AskBiz POS", "essai de 30 jours", "sans carte requise", "pos/activate", "expiration de l'essai", "facturation"],
    keyTakeaways: [
      "L'essai gratuit est réservé au PDV, dure 30 jours, et ne nécessite aucune carte — chaque compte peut le réclamer une seule fois.",
      "Il vous est proposé à deux endroits : une bannière sur l'écran de fin d'intégration pour les inscriptions au profil PDV, et à nouveau sur la page pos/activate si vous ne l'avez pas encore réclamé.",
      "Lorsque les 30 jours s'écoulent sans abonnement payant, AskBiz désactive automatiquement le PDV — vos données restent intactes, mais la caisse cesse de fonctionner jusqu'à ce que vous vous abonniez.",
      "L'essai équivalent du plan Growth (BI) a été supprimé — le PDV est actuellement le seul essai gratuit proposé par AskBiz.",
      "Le statut de votre essai, y compris les jours restants et la date de fin exacte, est toujours visible sur la page Facturation.",
    ],
    content: [
      {
        heading: "Ce que l'essai vous offre réellement",
        body: "L'essai gratuit d'AskBiz POS débloque la caisse complète pendant 30 jours à compter du moment où vous le démarrez, sans qu'aucune carte bancaire ne soit jamais demandée. C'est une offre unique — chaque compte peut la réclamer exactement une fois, ce qu'AskBiz suit côté serveur plutôt que de faire confiance à quoi que ce soit dans le navigateur. Si vous l'avez déjà réclamée auparavant (même depuis un autre appareil ou après avoir effacé vos cookies), le système le sait et ne vous la proposera pas à nouveau. Démarrer l'essai active le PDV immédiatement et provisionne jusqu'à cinq postes pour le personnel, afin que vous puissiez faire embarquer toute votre équipe de caisse — caissiers, gérants, quiconque a besoin d'une connexion — sans atteindre de limite de postes pendant la durée de l'essai.",
      },
      {
        heading: "Où l'essai vous est proposé",
        body: "AskBiz présente l'essai à deux moments, tous deux destinés à vous faire vendre le plus vite possible sans demander de coordonnées bancaires au préalable. Le premier se trouve sur l'écran « terminé » de l'intégration, mais uniquement si vous vous êtes inscrit avec un profil PDV — vous verrez une petite bannière au-dessus du bouton « Configurer ma caisse » annonçant l'essai de 30 jours. Cette bannière n'est qu'une annonce, pas le bouton de réclamation lui-même ; elle vous informe que l'offre existe avant que vous n'alliez plus loin. Le second, celui qui déclenche réellement l'essai, se trouve sur la page pos/activate — l'écran sur lequel vous atterrissez lorsque vous allez activer le PDV. Avant de vous diriger directement vers un paiement, elle vérifie si vous disposez d'un essai non réclamé. Si c'est le cas, une option « Démarrer l'essai gratuit » apparaît au-dessus des boutons de paiement ; si vous l'avez déjà utilisée, cette option n'apparaît tout simplement pas et vous accédez directement aux options de paiement. Dans tous les cas, il n'y a pas d'impasse — si un clic survient après que vous l'avez déjà réclamée ailleurs (par exemple, depuis la page Facturation), AskBiz masque discrètement le bouton et affiche le parcours de paiement à la place, plutôt qu'une erreur.",
      },
      {
        heading: "Le réclamer sur pos/activate",
        body: "Lorsque l'option d'essai est disponible, c'est le bouton du haut sur l'écran pos/activate — libellé pour démarrer l'essai gratuit, avec une note en dessous confirmant qu'aucune carte n'est nécessaire. En dessous se trouve un séparateur, puis vos options de paiement habituelles : M-Pesa pour les comptes kényans, ainsi que le paiement par carte pour tout le monde. Appuyer sur le bouton d'essai ne vous redirige nulle part ; il appelle directement le système de facturation d'AskBiz, qui enregistre l'heure de démarrage de l'essai et une date de fin 30 jours plus tard, active le PDV, et vous emmène directement vers un écran de confirmation. À partir de là, c'est le même parcours « vous êtes prêt » qu'une activation payante — vous retrouvez votre caisse, prête à vendre.",
      },
      {
        heading: "Ce qui se passe au terme des 30 jours",
        body: "AskBiz vérifie l'expiration de l'essai chaque fois que votre statut de facturation est chargé — en pratique, cela signifie qu'au moment même où vos 30 jours s'écoulent, la prochaine fois que quoi que ce soit interroge votre statut de facturation, le système le remarque. S'il n'y a pas d'abonnement PDV payant rattaché à votre compte à ce moment-là, l'accès au PDV est désactivé automatiquement : la caisse cesse d'être utilisable, et les connexions du personnel se heurteront à une porte fermée. Rien de votre historique des ventes, de votre inventaire ou de vos paramètres n'est supprimé — tout reste bien là, en attente. Vous abonner à tout moment par la suite réactive le PDV avec tout exactement comme vous l'avez laissé. La coupure est délibérément nette : pas de période de grâce insistante ni de blocage partiel, juste un basculement automatique d'« actif » à « inactif » si l'essai expire sans abonnement derrière.",
      },
      {
        heading: "Vérifier le statut de votre essai",
        body: "Vous n'avez pas à deviner combien de temps il vous reste. La page Facturation affiche un badge à côté de la section PDV chaque fois que votre essai est actif, indiquant le nombre de jours restants et le nombre de postes que vous utilisez actuellement. Une fois que vous vous abonnez — ou une fois que l'essai expire et que vous payez pour réactiver — ce badge bascule vers un simple statut « actif ». Si vous êtes du genre à anticiper plutôt qu'à être surpris par une caisse verrouillée en plein service, la page Facturation est l'endroit à consulter, idéalement quelques jours avant la fin des 30 jours.",
      },
      {
        heading: "Pourquoi il n'existe pas d'équivalent pour le plan Growth (BI)",
        body: "Si vous avez entendu dire qu'AskBiz proposait autrefois un essai gratuit pour son plan de business intelligence Growth, c'est vrai — mais il n'est plus disponible. Le système de facturation d'AskBiz rejette explicitement toute nouvelle demande d'essai Growth, avec un message clair indiquant qu'il a été supprimé ; ce chemin de code existe uniquement pour refuser les demandes, pas pour les accorder. L'essai PDV est actuellement le seul essai gratuit proposé. Si votre entreprise a besoin à la fois du PDV et des fonctionnalités BI/Growth, l'essai PDV met votre caisse en service immédiatement et sans frais, tandis que l'accès au plan Growth reste une décision payante directe dès le premier jour — sans période d'essai à prendre en compte dans ce choix.",
      },
    ],
    faq: [
      {
        q: "Dois-je saisir une carte bancaire pour démarrer l'essai gratuit du PDV ?",
        a: "Non. Démarrer l'essai ne nécessite absolument aucune coordonnée de paiement — c'est réellement gratuit pendant les 30 jours complets. Vous n'aurez besoin d'ajouter un moyen de paiement que si vous décidez de vous abonner, pendant ou après l'essai.",
      },
      {
        q: "Puis-je réclamer l'essai deux fois — par exemple sur un second compte d'entreprise ?",
        a: "L'essai est unique par compte, suivi côté serveur, et non par appareil ou navigateur. Un second compte AskBiz (une inscription véritablement distincte) serait éligible à son propre essai, mais vous ne pouvez pas le redéclencher sur le même compte en effaçant les cookies ou en réessayant depuis un autre écran.",
      },
      {
        q: "Que devient exactement mes données de ventes lorsque l'essai expire ?",
        a: "Rien n'est supprimé. AskBiz désactive l'accès au PDV — ce qui signifie que la caisse elle-même cesse d'être utilisable — mais chaque vente, produit et paramètre que vous aviez est conservé. Vous abonner à tout moment par la suite restaure l'accès complet, avec vos données exactement telles qu'elles étaient.",
      },
      {
        q: "J'ai démarré l'essai depuis la bannière d'intégration — dois-je faire autre chose ?",
        a: "La bannière d'intégration n'est qu'une annonce indiquant que l'offre existe ; elle ne démarre pas l'essai elle-même. Vous le réclamez sur la page pos/activate, à laquelle vous accédez via « Configurer ma caisse ». Si vous l'avez déjà réclamée à cet endroit, vous ne reverrez pas l'option.",
      },
      {
        q: "Existe-t-il aussi un essai gratuit pour le plan Growth (BI) ?",
        a: "Non — l'essai du plan Growth a été supprimé. En demander un maintenant renvoie une réponse explicite indiquant qu'il « n'est plus disponible ». Le PDV est actuellement le seul plan AskBiz proposé avec un essai gratuit.",
      },
    ],
  },
}
