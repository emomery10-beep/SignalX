export interface VoiceRoute {
  path: string
  label: string
  description: {
    en: string
    fr: string
    es: string
    nl: string
    de: string
    sw: string
  }
}

export const VALID_ROUTES: VoiceRoute[] = [
  {
    path: '/home',
    label: 'Home',
    description: {
      en: 'Go to the home dashboard overview',
      fr: 'Aller au tableau de bord d’accueil',
      es: 'Ir al panel de inicio',
      nl: 'Ga naar het startdashboard',
      de: 'Zum Start-Dashboard gehen',
      sw: 'Nenda kwenye dashibodi ya nyumbani',
    },
  },
  {
    path: '/dashboards',
    label: 'Dashboards',
    description: {
      en: 'Open business dashboards and reports',
      fr: 'Ouvrir les tableaux de bord et rapports',
      es: 'Abrir los paneles y reportes del negocio',
      nl: 'Open bedrijfsdashboards en rapporten',
      de: 'Unternehmens-Dashboards und Berichte öffnen',
      sw: 'Fungua dashibodi na ripoti za biashara',
    },
  },
  {
    path: '/forecasts',
    label: 'Forecasts',
    description: {
      en: 'View sales and demand forecasts',
      fr: 'Voir les prévisions de ventes et de demande',
      es: 'Ver pronósticos de ventas y demanda',
      nl: 'Bekijk verkoop- en vraagvoorspellingen',
      de: 'Umsatz- und Bedarfsprognosen ansehen',
      sw: 'Angalia utabiri wa mauzo na mahitaji',
    },
  },
  {
    path: '/billing',
    label: 'Billing',
    description: {
      en: 'Manage billing and subscription',
      fr: 'Gérer la facturation et l’abonnement',
      es: 'Gestionar la facturación y suscripción',
      nl: 'Beheer facturering en abonnement',
      de: 'Abrechnung und Abonnement verwalten',
      sw: 'Simamia malipo na usajili',
    },
  },
  {
    path: '/alerts',
    label: 'Alerts',
    description: {
      en: 'Check business alerts and notifications',
      fr: 'Vérifier les alertes et notifications',
      es: 'Revisar alertas y notificaciones',
      nl: 'Controleer waarschuwingen en meldingen',
      de: 'Warnungen und Benachrichtigungen prüfen',
      sw: 'Angalia arifa na tahadhari za biashara',
    },
  },
  {
    path: '/ask',
    label: 'Ask AskBiz',
    description: {
      en: 'Ask AskBiz a question about your business',
      fr: 'Poser une question à AskBiz sur votre entreprise',
      es: 'Hacer una pregunta a AskBiz sobre tu negocio',
      nl: 'Stel AskBiz een vraag over je bedrijf',
      de: 'AskBiz eine Frage zu Ihrem Unternehmen stellen',
      sw: 'Uliza AskBiz swali kuhusu biashara yako',
    },
  },
  {
    path: '/chat',
    label: 'Chat',
    description: {
      en: 'Open the AI chat assistant',
      fr: 'Ouvrir l’assistant de chat IA',
      es: 'Abrir el asistente de chat con IA',
      nl: 'Open de AI-chatassistent',
      de: 'KI-Chat-Assistenten öffnen',
      sw: 'Fungua msaidizi wa mazungumzo wa AI',
    },
  },
  {
    path: '/files',
    label: 'Files',
    description: {
      en: 'Browse uploaded files and documents',
      fr: 'Parcourir les fichiers et documents téléchargés',
      es: 'Explorar archivos y documentos subidos',
      nl: 'Blader door geüploade bestanden en documenten',
      de: 'Hochgeladene Dateien und Dokumente durchsuchen',
      sw: 'Vinjari faili na nyaraka zilizopakiwa',
    },
  },
  {
    path: '/intelligence',
    label: 'Intelligence',
    description: {
      en: 'View business intelligence insights',
      fr: 'Voir les analyses de business intelligence',
      es: 'Ver los insights de inteligencia de negocio',
      nl: 'Bekijk business intelligence-inzichten',
      de: 'Business-Intelligence-Erkenntnisse ansehen',
      sw: 'Angalia maarifa ya akili ya biashara',
    },
  },
  {
    path: '/my-business',
    label: 'My Business',
    description: {
      en: 'Manage your business profile and details',
      fr: 'Gérer le profil et les détails de votre entreprise',
      es: 'Gestionar el perfil y los detalles de tu negocio',
      nl: 'Beheer je bedrijfsprofiel en gegevens',
      de: 'Ihr Unternehmensprofil und Details verwalten',
      sw: 'Simamia wasifu na maelezo ya biashara yako',
    },
  },
  {
    path: '/settings',
    label: 'Settings',
    description: {
      en: 'Open account and app settings',
      fr: 'Ouvrir les paramètres du compte et de l’application',
      es: 'Abrir la configuración de la cuenta y la app',
      nl: 'Open account- en app-instellingen',
      de: 'Konto- und App-Einstellungen öffnen',
      sw: 'Fungua mipangilio ya akaunti na programu',
    },
  },
  {
    path: '/shipments',
    label: 'Shipments',
    description: {
      en: 'Track shipments and logistics',
      fr: 'Suivre les expéditions et la logistique',
      es: 'Rastrear envíos y logística',
      nl: 'Volg zendingen en logistiek',
      de: 'Sendungen und Logistik verfolgen',
      sw: 'Fuatilia usafirishaji na vifaa',
    },
  },
  {
    path: '/sources',
    label: 'Sources',
    description: {
      en: 'Manage connected data sources',
      fr: 'Gérer les sources de données connectées',
      es: 'Gestionar las fuentes de datos conectadas',
      nl: 'Beheer verbonden gegevensbronnen',
      de: 'Verbundene Datenquellen verwalten',
      sw: 'Simamia vyanzo vya data vilivyounganishwa',
    },
  },
  {
    path: '/templates',
    label: 'Templates',
    description: {
      en: 'Browse report and document templates',
      fr: 'Parcourir les modèles de rapports et documents',
      es: 'Explorar plantillas de reportes y documentos',
      nl: 'Blader door rapport- en documentsjablonen',
      de: 'Bericht- und Dokumentvorlagen durchsuchen',
      sw: 'Vinjari violezo vya ripoti na nyaraka',
    },
  },
  {
    path: '/tools',
    label: 'Tools',
    description: {
      en: 'Open the business tools hub, including the FX risk modeller',
      fr: 'Ouvrir le centre d’outils, y compris le modèle de risque de change',
      es: 'Abrir el centro de herramientas, incluido el modelador de riesgo cambiario',
      nl: 'Open het hulpmiddelencentrum, inclusief de valutarisicomodule',
      de: 'Werkzeug-Hub öffnen, einschließlich des FX-Risikomodells',
      sw: 'Fungua kituo cha zana za biashara, ikiwemo kielelezo cha hatari ya fedha za kigeni',
    },
  },
  {
    path: '/expansion',
    label: 'Expansion',
    description: {
      en: 'Explore expansion and growth opportunities',
      fr: 'Explorer les opportunités d’expansion et de croissance',
      es: 'Explorar oportunidades de expansión y crecimiento',
      nl: 'Verken uitbreidings- en groeikansen',
      de: 'Expansions- und Wachstumsmöglichkeiten erkunden',
      sw: 'Chunguza fursa za upanuzi na ukuaji',
    },
  },
  {
    path: '/admin',
    label: 'Admin',
    description: {
      en: 'Open the admin panel',
      fr: 'Ouvrir le panneau d’administration',
      es: 'Abrir el panel de administración',
      nl: 'Open het beheerpaneel',
      de: 'Admin-Panel öffnen',
      sw: 'Fungua paneli ya usimamizi',
    },
  },
  {
    path: '/pos',
    label: 'Point of Sale',
    description: {
      en: 'Open the point of sale system',
      fr: 'Ouvrir le système de point de vente',
      es: 'Abrir el sistema de punto de venta',
      nl: 'Open het kassasysteem',
      de: 'Kassensystem öffnen',
      sw: 'Fungua mfumo wa mauzo (POS)',
    },
  },
  {
    path: '/pos/setup',
    label: 'POS Setup',
    description: {
      en: 'Set up your point of sale system',
      fr: 'Configurer votre système de point de vente',
      es: 'Configurar tu sistema de punto de venta',
      nl: 'Stel je kassasysteem in',
      de: 'Kassensystem einrichten',
      sw: 'Sanidi mfumo wako wa mauzo',
    },
  },
  {
    path: '/inventory',
    label: 'Inventory',
    description: {
      en: 'View and manage stock inventory',
      fr: 'Voir et gérer l’inventaire des stocks',
      es: 'Ver y gestionar el inventario de stock',
      nl: 'Bekijk en beheer de voorraad',
      de: 'Lagerbestand ansehen und verwalten',
      sw: 'Angalia na simamia hesabu za bidhaa',
    },
  },
  {
    path: '/free-tools',
    label: 'Free Tools',
    description: {
      en: 'Browse free business calculators and tools',
      fr: 'Parcourir les calculatrices et outils gratuits',
      es: 'Explorar calculadoras y herramientas gratuitas',
      nl: 'Blader door gratis rekentools',
      de: 'Kostenlose Rechner und Tools durchsuchen',
      sw: 'Vinjari zana na vikokotoo vya bure',
    },
  },
  {
    path: '/free-tools/fx-risk-modeller',
    label: 'FX Risk Modeller',
    description: {
      en: 'Open the foreign exchange risk modeller, also called currency risk analysis',
      fr: 'Ouvrir le modèle de risque de change, aussi appelé analyse de risque devise',
      es: 'Abrir el modelador de riesgo cambiario, también llamado análisis de riesgo de divisas',
      nl: 'Open de valutarisicomodule, ook wel valutarisicoanalyse genoemd',
      de: 'FX-Risikomodell öffnen, auch Währungsrisikoanalyse genannt',
      sw: 'Fungua kielelezo cha hatari ya fedha za kigeni',
    },
  },
  {
    path: '/free-tools/break-even-calculator',
    label: 'Break-Even Calculator',
    description: {
      en: 'Calculate your break-even point',
      fr: 'Calculer votre seuil de rentabilité',
      es: 'Calcular tu punto de equilibrio',
      nl: 'Bereken je break-evenpunt',
      de: 'Break-Even-Punkt berechnen',
      sw: 'Kokotoa kiwango cha kufidia gharama',
    },
  },
  {
    path: '/free-tools/cogs-calculator',
    label: 'COGS Calculator',
    description: {
      en: 'Calculate cost of goods sold, also called cost calculator',
      fr: 'Calculer le coût des marchandises vendues',
      es: 'Calcular el costo de los bienes vendidos, calculadora de costos',
      nl: 'Bereken de kostprijs van verkochte goederen',
      de: 'Wareneinsatz berechnen, Kostenrechner',
      sw: 'Kokotoa gharama za bidhaa zilizouzwa',
    },
  },
  {
    path: '/free-tools/landed-cost-calculator',
    label: 'Landed Cost Calculator',
    description: {
      en: 'Calculate total landed cost of imported goods',
      fr: 'Calculer le coût de revient total des marchandises importées',
      es: 'Calcular el costo total de aterrizaje de mercancías importadas',
      nl: 'Bereken de totale landed cost van geïmporteerde goederen',
      de: 'Gesamtkosten für importierte Waren berechnen',
      sw: 'Kokotoa gharama jumla ya bidhaa zilizoagizwa',
    },
  },
  {
    path: '/free-tools/profit-margin-calculator',
    label: 'Profit Margin Calculator',
    description: {
      en: 'Calculate your profit margin',
      fr: 'Calculer votre marge bénéficiaire',
      es: 'Calcular tu margen de ganancia',
      nl: 'Bereken je winstmarge',
      de: 'Gewinnspanne berechnen',
      sw: 'Kokotoa faida yako',
    },
  },
  {
    path: '/free-tools/vat-calculator',
    label: 'VAT Calculator',
    description: {
      en: 'Calculate VAT and tax amounts',
      fr: 'Calculer la TVA et les montants de taxe',
      es: 'Calcular el IVA y los montos de impuestos',
      nl: 'Bereken btw en belastingbedragen',
      de: 'Mehrwertsteuer und Steuerbeträge berechnen',
      sw: 'Kokotoa VAT na kiasi cha kodi',
    },
  },
  {
    path: '/onboarding',
    label: 'Onboarding',
    description: {
      en: 'Go to the onboarding setup flow',
      fr: 'Aller au processus d’intégration',
      es: 'Ir al flujo de configuración inicial',
      nl: 'Ga naar het onboardingproces',
      de: 'Zum Onboarding-Ablauf gehen',
      sw: 'Nenda kwenye mchakato wa kujiunga',
    },
  },
  {
    path: '/search',
    label: 'Search',
    description: {
      en: 'Search across the app',
      fr: 'Rechercher dans l’application',
      es: 'Buscar en toda la aplicación',
      nl: 'Zoek in de app',
      de: 'In der App suchen',
      sw: 'Tafuta ndani ya programu',
    },
  },
]

export function findRouteByPath(path: string): VoiceRoute | undefined {
  return VALID_ROUTES.find((route) => route.path === path)
}

export const VALID_ROUTE_PATHS: string[] = VALID_ROUTES.map((route) => route.path)
