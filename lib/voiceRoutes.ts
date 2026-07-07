// ⚠ GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-voice-routes.mjs from:
//   - static page discovery under app/(app), app/free-tools, app/onboarding, app/search, app/inventory
//   - VOICE_SUBROUTES exports in: components/cfo/CfoDashboard.tsx, app/(app)/intelligence/voiceSubroutes.ts
// Regenerate: node scripts/generate-voice-routes.mjs
// Translations cached in lib/voiceRoutes.translations.cache.json (keyed by
// sha256 of the English text). Missing/failed translations fall back to
// English for that run — see translateAll() in the generator script.
//
// NOTE on 'locked': carried through only as an informational hint for future
// UI consumers (e.g. HelpWidget could show a lock icon next to a paywalled
// suggestion). It has NO effect on whitelist validation — voice-nav's job is
// intent classification/navigation, not authorization, so locked routes are
// classified and navigated exactly like any other route; the destination
// page's own FeatureGate/paywall UI takes over from there, identically to a
// mouse click. Do not add locked-based filtering to app/api/voice-nav/route.ts.

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
  locked?: boolean
}

export const VALID_ROUTES: VoiceRoute[] = [
  {
    path: "/alerts",
    label: "Alerts",
    description: {
      en: "Go to the Alerts page",
      fr: "Allez à la page des alertes",
      es: "Vaya a la página de alertas",
      nl: "Ga naar de meldingenpagina",
      de: "Gehe zu der Warnungen-Seite",
      sw: "Ikiwa kwenye ukurasa wa Habari za Kuwahimiza",
    },
  },
  {
    path: "/ask",
    label: "Ask",
    description: {
      en: "Go to the Ask page",
      fr: "Allez à la page Demande",
      es: "Vaya a la página Preguntas",
      nl: "Ga naar de Vraag pagina",
      de: "Gehe zu der Frage-Seite",
      sw: "Ikiwa kwenye ukurasa wa Swali",
    },
  },
  {
    path: "/billing",
    label: "Billing",
    description: {
      en: "Go to the Billing page",
      fr: "Allez à la page Facturation",
      es: "Vaya a la página de Facturación",
      nl: "Ga naar de Factuur pagina",
      de: "Gehe zu der Rechnung Seite",
      sw: "Ikiwa kwenye ukurasa wa Malipo",
    },
  },
  {
    path: "/chat",
    label: "Chat",
    description: {
      en: "Go to the Chat page",
      fr: "Allez à la page de discussion",
      es: "Vaya a la página de chat",
      nl: "Ga naar de chatpagina",
      de: "Gehe zu der Chatseite",
      sw: "Ikiwa kwenye ukurasa wa mazungumzo",
    },
  },
  {
    path: "/expansion",
    label: "Expansion",
    description: {
      en: "Go to the Expansion page",
      fr: "Allez à la page d'expansion",
      es: "Vaya a la página de expansión",
      nl: "Ga naar de uitbreidingspagina",
      de: "Gehe zu der Erweiterungsseite",
      sw: "Ikiwa kwenye ukurasa wa kuongezeka",
    },
  },
  {
    path: "/files",
    label: "Files",
    description: {
      en: "Go to the Files page",
      fr: "Allez à la page des fichiers",
      es: "Vaya a la página de archivos",
      nl: "Ga naar de bestandenpagina",
      de: "Gehe zu der Dateien-Seite",
      sw: "Ikiwa kwenye ukurasa wa files",
    },
  },
  {
    path: "/forecasts",
    label: "Forecasts",
    description: {
      en: "Go to the Forecasts page",
      fr: "Allez à la page des prévisions météorologiques",
      es: "Vaya a la página de pronósticos",
      nl: "Ga naar de weersvoorspellingen pagina",
      de: "Gehe zu der Wettervorhersage Seite",
      sw: "Ikiwa kwenye orodha ya mawazo ya hali ya hewa",
    },
  },
  {
    path: "/free-tools",
    label: "Free Business Calculators",
    description: {
      en: "Free profit margin, break-even, landed cost, VAT, and FX risk calculators for small business owners. Works in KES, NGN, GBP and more. No sign-up required.",
      fr: "Calcul de marge bénéficiaire gratuite, point de rentabilité, coût de revient, TVA et risque de change pour les propriétaires d'entreprises petites. Fonctionne en KES, NGN, GBP et plus. Pas d'inscription requise.",
      es: "Calculadoras de margen de beneficio gratuito, punto de equilibrio, costo de entrega, IVA y riesgo de cambio para dueños de pequeñas empresas. Funciona en KES, NGN, GBP y más. No se requiere registro.",
      nl: "Gratis winstmargecalculator, breakevenpunt, belasting van toegevoegde waarde en valutaschommelingen voor kleine ondernemers. Werkt in KES, NGN, GBP en meer. Geen registratie vereist.",
      de: "Kostenlose Gewinnmargenrechner, Gleichgewichtspunkt, Einfuhrkosten, Umsatzsteuer und Wechselkursrisiko für kleine Unternehmer. Funktioniert in KES, NGN, GBP und mehr. Keine Registrierung erforderlich.",
      sw: "Mfumo wa kuhesabu faida ya kifedha bila gharama, hatua ya usawa, gharama ya kuingia, kodi ya kubeba na hatari ya mabadiliko wa kifedha kwa wafanyabiashara wadogo. Inafanya kazi katika KES, NGN, GBP na zaidi. Hakuna uajiri wa mtihani.",
    },
  },
  {
    path: "/free-tools/break-even-calculator",
    label: "Free Break-Even Calculator",
    description: {
      en: "Calculate your break-even point in units and revenue. Enter fixed costs, selling price, and variable cost — see contribution margin, profit scenarios, and price sensitivity. Free, no sign-up.",
      fr: "Calculez votre point de rentabilité en unités et en revenus. Entrez les coûts fixes, le prix de vente et le coût variable — voir le marge de contribution, les scénarios de profit et la sensibilité au prix. Gratuit, sans inscription.",
      es: "Calcula tu punto de equilibrio en unidades y en ingresos. Ingresa los costos fijos, el precio de venta y el costo variable — ve la margen de contribución, los escenarios de beneficio y la sensibilidad al precio. Gratis, sin registro.",
      nl: "Bereken je breakevenpunt in eenheden en omzet. Voer vaste kosten, verkoopprijs en variabele kosten in — zie bijdrage marges, winstscenario's en prijsgevoeligheid. Gratis, geen registratie.",
      de: "Berechne dein Break-Even-Punkt in Einheiten und Umsatz. Eingeben Sie Fixkosten, Verkaufspreis und variable Kosten — sehen Sie die Beitragsspanne, Gewinn-Szenarien und Preisempfindlichkeit. Kostenlos, ohne Registrierung.",
      sw: "Tafuta pointi la kujitolea katika vitengo na mapato. Ondoa gharama zilizopitiliza, bei ya kuuza, na gharama zinazotofautiana — tazama faida ya kujitegemea, matokeo ya faida, na uwezo wa bei.",
    },
  },
  {
    path: "/free-tools/cogs-calculator",
    label: "Free Cost of Goods Sold (COGS) Calculator",
    description: {
      en: "Calculate your cost of goods sold per product and in total. Add materials, labour, shipping, and overhead. See COGS ratio, gross profit, and per-unit economics. Free, no sign-up required.",
      fr: "Calculez votre coût de revient par produit et au total. Ajoutez les matières premières, le travail, l'expédition et les surcoûts. Consultez le ratio COGS, le bénéfice brut et l'économie par unité. Gratuit, aucune inscription requise.",
      es: "Calcula tu costo de producción por producto y en total. Agrega materiales, mano de obra, envío y gastos generales. Verifica el ratio COGS, beneficio bruto y economía por unidad. Gratis, sin registro requerido.",
      nl: "Bereken uw kostprijs per product en in totaal. Voeg materialen, arbeid, verzending en overhead toe. Zie uw COGS-verhouding, brutowinst en per-eenheidseconomie. Gratis, geen registratie vereist.",
      de: "Berechnen Sie Ihren Wareneinsatz pro Produkt und insgesamt. Fügen Sie Materialien, Arbeitskosten, Versand und Überhead hinzu. Überprüfen Sie Ihren COGS-Verhältnis, Bruttoluftgewinn und Einheitseconomie. Kostenlos, keine Registrierung erforderlich.",
      sw: "Tafuta gharama ya bidhaa zako kwa kila bidhaa na kwa jumla. Ongeza vifaa, ajira, usafirishaji, na gharama za juu. Tafuta uwiano wa COGS, faida ya kuu, na uchumi wa kila bidhaa. Bila malipo, hakuna uajiri wa mtihani.",
    },
  },
  {
    path: "/free-tools/fx-risk-modeller",
    label: "Free FX Risk Modeller",
    description: {
      en: "Model how exchange rate movements affect your profit margins. See your break-even exchange rate and margin impact across mild, moderate, and severe depreciation scenarios. Free, no sign-up required.",
      fr: "Modélisez comment les mouvements des taux de change affectent vos marges bénéficiaires. Voir votre taux de break-even et l'impact sur vos marges dans des scénarios de dépréciation modérée, modérée et sévère. Gratuit, sans inscription.",
      es: "Modela cómo los movimientos de las tasas de cambio afectan tus márgenes de beneficio. Ver tu tasa de equilibrio y el impacto en tus márgenes en escenarios de depreciación suave, moderada y severa. Gratis, sin registro.",
      nl: "Zie hoe wisselkoersbewegingen uw winstmarges beïnvloeden. Zie uw breakevenwisselkoers en winstimpact in milde, matige en zware devaluatiescenario's. Gratis, geen registratie vereist.",
      de: "Modellieren Sie, wie Wechselkursbewegungen Ihre Gewinnmargen beeinflussen. Sehen Sie Ihren Ausgleichswechselkurs und Ihren Gewinnmargen-Einfluss in milden, moderaten und schweren Abwertungsszenarien. Kostenlos, ohne Registrierung.",
      sw: "Tumia mbinu hiyo kuonyesha jinsi harakati za kiwango cha kuuza kinaathiri faida yako. Onyesha kiwango cha kujitenga na athari ya faida yako katika hali za kupungua kwa kiwango cha kuuza kidogo, ya kati, na ya kubwa. Bila malipo, bila uajiri.",
    },
  },
  {
    path: "/free-tools/landed-cost-calculator",
    label: "Free Landed Cost Calculator",
    description: {
      en: "Calculate the true landed cost of any imported product. Import duty rates for 25+ countries, UK/EU/US VAT, freight cost estimation, and full per-unit breakdown. Free, no sign-up required.",
      fr: "Calculez le coût réel de douane de tout produit importé. Tarifs de droits de douane pour 25+ pays, TVA UK/EU/US, estimation du coût de fret et détail complet par unité. Gratuit, sans inscription.",
      es: "Calcula el costo real de arribo de cualquier producto importado. Tasas de derechos de aduana para +25 países, IVA del Reino Unido/UE/EE.UU, estimación del costo de flete y desglose completo por unidad. Gratis, sin registro.",
      nl: "Bereken de werkelijke belastingkosten van elk ingevoerd product. Douanetarieven voor +25 landen, BTW VK/EE/VS, schatting van de vervoerskosten en volledige per-eenheid breakdown. Gratis, geen registratie vereist.",
      de: "Berechnen Sie die tatsächlichen Zollkosten für jedes importierte Produkt. Zolltarife für +25 Länder, Umsatzsteuer UK/EU/US, Frachtkosten-Schätzung und vollständige pro-Einheit-Brechen. Kostenlos, keine Registrierung erforderlich.",
      sw: "Tafuta gharama halisi ya kubeba kwa bidhaa yoyote iliyopewa. Kiasi cha kodi ya kubeba kwa +25 nchi, kodi ya kodi ya UK/EU/US, uwezekano wa gharama ya malipo na utambuzi wa kina kwa kila bidhaa. Bila gharama, hakuna uajiri.",
    },
  },
  {
    path: "/free-tools/profit-margin-calculator",
    label: "Free Profit Margin Calculator",
    description: {
      en: "Calculate profit margin, markup percentage, and true cost per product. Add multiple products, see ranked margins, and find hidden cost gaps. Free, no sign-up required.",
      fr: "Calculez le marge de profit, le pourcentage de marge et le coût réel par produit. Ajoutez plusieurs produits, voyez les marges classées et trouvez les écarts de coûts cachés. Gratuit, sans inscription.",
      es: "Calcula la margen de ganancia, el porcentaje de aumento y el costo real por producto. Agrega múltiples productos, vea las márgenes clasificadas y encuentre las brechas de costo ocultas. Gratis, sin registro.",
      nl: "Bereken de winstmarge, de verkoopverhoging en de werkelijke kosten per product. Voeg meerdere producten toe, zie de gerangschikte marges en vind de verborgen kostenkloof. Gratis, geen registratie vereist.",
      de: "Berechne den Gewinnmarge, den Umsatzsteigerung und die tatsächlichen Kosten pro Produkt. Fügen Sie mehrere Produkte hinzu, sehen Sie die sortierten Margen und finden Sie die verborgenen Kostenlücken. Kostenlos, ohne Registrierung.",
      sw: "Tafuta upatikanaji wa faida, asilimia ya kuzidisha na gharama halisi kwa bidhaa. Ongeza bidhaa nyingi, tazama upatikanaji uliorangiwa na utafute kikomo cha gharama kilichopitishwa. Bila malipo, hakuna uajiri.",
    },
  },
  {
    path: "/free-tools/vat-calculator",
    label: "Free VAT Calculator",
    description: {
      en: "Calculate VAT, GST, or sales tax instantly for 30 countries. Add VAT to a net price or extract VAT from a gross price. Standard, reduced, and zero rates. Free, no sign-up.",
      fr: "Calculez la TVA, le GST ou la taxe sur les ventes instantanément pour 30 pays. Ajoutez la TVA au prix net ou extrayez la TVA du prix brut. Taux standard, réduit et zéro. Gratuit, sans inscription.",
      es: "Calcula la IVA, el GST o la taxa de ventas instantáneamente para 30 países. Agrega el IVA al precio neto o extrae el IVA del precio bruto. Tasas estándar, reducidas y cero. Gratuito, sin registro.",
      nl: "Bereken BTW, GST of omzetbelasting direct voor 30 landen. Voeg BTW toe aan een netto prijs of trek BTW af van een bruto prijs. Standaard, verlaagd en nul tarieven. Gratis, geen registratie.",
      de: "Berechne MwSt, GST oder Umsatzsteuer sofort für 30 Länder. Füge MwSt zu einem Nettopreis hinzu oder zie MwSt von einem Bruttobetrag ab. Standard, ermäßigte und Null-Steuersätze. Kostenlos, ohne Registrierung.",
      sw: "Tafuta KDV, GST au kodi ya kuuza haraka kwa nchi 30. Ongeza KDV kwenye bei ya chini au utaafute KDV kutoka kwa bei ya juu. Mipaka ya kawaida, kupunguzwa, na sifuri. Bila malipo, bila uajiri.",
    },
  },
  {
    path: "/home",
    label: "Home",
    description: {
      en: "Go to the Home page",
      fr: "Allez à la page d'accueil",
      es: "Vaya a la página de inicio",
      nl: "Ga naar de Home pagina",
      de: "Gehe zu der Startseite",
      sw: "Ikiwa kwenye ukurasa wa nyumbani",
    },
  },
  {
    path: "/intelligence",
    label: "Intelligence",
    description: {
      en: "Go to the Intelligence page",
      fr: "Allez à la page Intelligence",
      es: "Vaya a la página de Inteligencia",
      nl: "Ga naar de Intelligence pagina",
      de: "Gehe zu der Intelligenz Seite",
      sw: "Ikiwa kwenye ukurasa wa Ujuzi",
    },
  },
  {
    path: "/intelligence?tab=actions",
    label: "Actions",
    description: {
      en: "View recommended daily actions",
      fr: "Afficher les actions recommandées pour aujourd'hui",
      es: "Ver las acciones recomendadas para hoy",
      nl: "Toon aanbevolen acties voor vandaag",
      de: "Zeige empfohlene tägliche Aktionen",
      sw: "Tafuta matendo yaliyotajwa kwa siku ya leo",
    },
  },
  {
    path: "/intelligence?tab=cfo",
    label: "CFO Dashboard",
    description: {
      en: "Open the CFO financial intelligence dashboard",
      fr: "Ouvrez l'interface de gestion financière du CFO",
      es: "Abra la consola de inteligencia financiera del CFO",
      nl: "Open het CFO-financiële inzichtsdashboard",
      de: "Öffnen Sie das CFO-Finanzierungs-Intelligenz-Dashboard",
      sw: "Tungane kwenye sanduku la ufahamu wa kiuchumi cha CFO",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=budget",
    label: "Budget vs Actual",
    description: {
      en: "Compare budget against actual spend",
      fr: "Comparer le budget avec les dépenses réelles",
      es: "Comparar el presupuesto con el gasto real",
      nl: "Budget vergelijken met de werkelijke uitgaven",
      de: "Budget gegen die tatsächlichen Ausgaben vergleichen",
      sw: "Kupigia usawa kati ya bajeti na matumizi halisi",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=cashflow",
    label: "Cash Flow",
    description: {
      en: "View cash flow and runway",
      fr: "Afficher le flux de trésorerie et la marge de manœuvre",
      es: "Ver flujo de efectivo y margen de maniobra",
      nl: "Bekijk de cash flow en de actieruimte",
      de: "Ansicht des Cash-Flows und der Luftlinie",
      sw: "Onyesha mchango wa kifedha na mwelekeo",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=dashboard",
    label: "CFO Dashboard",
    description: {
      en: "Open the CFO financial dashboard overview",
      fr: "Ouvrez l'aperçu du tableau de bord financier du CFO",
      es: "Abra el resumen del panel financiero del CFO",
      nl: "Open het overzicht van de CFO-financiële dashboard",
      de: "Öffnen Sie das CFO-Finanzüberblick-Dashboard",
      sw: "Tungane maoni ya kifedha ya CFO",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=expenses",
    label: "Expenses",
    description: {
      en: "View and log business expenses",
      fr: "Voir et enregistrer les dépenses professionnelles",
      es: "Ver y registrar gastos comerciales",
      nl: "Zie en log de zakelijke uitgaven",
      de: "Ansicht und Protokollierung von Geschäftsausgaben",
      sw: "Tazama na kuandika matumizi ya biashara",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=forecasts",
    label: "CFO Forecasts",
    description: {
      en: "View financial forecasts and hiring simulator",
      fr: "Affichez les prévisions financières et le simulateur d'embauche",
      es: "Muestra las previsiones financieras y el simulador de contratación",
      nl: "Toon financiële voorspellingen en een sollicitatiesimulator",
      de: "Zeige Finanzprognosen und einen Einstellungs Simulator",
      sw: "Tunza maadili ya kifedha na simulator ya ajira",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=inventory",
    label: "Inventory Finance",
    description: {
      en: "View inventory value and finance details",
      fr: "Afficher la valeur de l'inventaire et les détails financiers",
      es: "Ver el valor de inventario y detalles financieros",
      nl: "Zie inventariswaarde en financiële details",
      de: "Ansicht Inventarwert und Finanzdetails",
      sw: "Onyesha thamani ya malipo na taarifa za fedha",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=margins",
    label: "Margins",
    description: {
      en: "View profit margin analysis",
      fr: "Afficher l'analyse du marge de profit",
      es: "Ver el análisis de la ganancia",
      nl: "Toon de winstmarge analyse",
      de: "Zeige Gewinnmarge Analyse",
      sw: "Tafuta uchunguzi wa faida ya mapato",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=pnl",
    label: "P&L Statement",
    description: {
      en: "View the profit and loss statement",
      fr: "Affichez le compte de résultat",
      es: "Muestra el estado de ganancias y pérdidas",
      nl: "Toon de winst-en-verliesrekening",
      de: "Zeige die Gewinn- und Verlustrechnung",
      sw: "Tafuta taarifa ya faida na hasara",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=receivables",
    label: "Receivables",
    description: {
      en: "View receivables and payables tracker",
      fr: "Voir le suivi des créances et des dettes",
      es: "Ver el seguimiento de cobros y pagos",
      nl: "Zie de volglijst van ontvangsten en uitgaven",
      de: "Ansicht des Zahlungsverlaufs",
      sw: "Onyesha matokeo ya mapato na malipo",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=reports",
    label: "CFO Reports",
    description: {
      en: "Open CFO board pack and report exports",
      fr: "Ouvrez le pack de la direction financière et les exportations de rapports",
      es: "Abra el paquete de la junta de CFO y exporte informes",
      nl: "Open het CFO bord pakket en rapporten exporteren",
      de: "Öffnen Sie das CFO-Bord-Paket und Berichtsexporte",
      sw: "Tungane kifungu cha CFO na kuweka kwenye sanduku taarifa za kuripoti",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=cfo&sub=tax",
    label: "Tax Estimator",
    description: {
      en: "Estimate tax and compliance obligations",
      fr: "Estimer les obligations fiscales et de conformité",
      es: "Estimar obligaciones fiscales y de cumplimiento",
      nl: "Bereken belasting- en conformiteitsverplichtingen",
      de: "Schätzen steuerliche und konformitätspflichten",
      sw: "Kokotoa wajibu wa kodi na ushirikiano",
    },
    locked: true,
  },
  {
    path: "/intelligence?tab=logistics",
    label: "Logistics",
    description: {
      en: "View shipments and courier logistics",
      fr: "Afficher les expéditions et la logistique des coursiers",
      es: "Ver envíos y logística de mensajeros",
      nl: "Zie verzendingen en logistiek van bezorgers",
      de: "Ansicht von Sendungen und Kurierlogistik",
      sw: "Tazama malipo na uhusiano wa malori",
    },
  },
  {
    path: "/intelligence?tab=market",
    label: "Market",
    description: {
      en: "View market and cross-sector intelligence",
      fr: "Afficher l'intelligence du marché et intersectorielle",
      es: "Ver inteligencia del mercado y transversal",
      nl: "Zie marktinformatie en cross-sector",
      de: "Ansicht Markteinblicke und Cross-Sector-Intelligenz",
      sw: "Tafuta taarifa za soko na kiwango cha sekta",
    },
  },
  {
    path: "/intelligence?tab=team",
    label: "Team",
    description: {
      en: "View team performance panel",
      fr: "Afficher le panneau de performance de l'équipe",
      es: "Ver el panel de rendimiento del equipo",
      nl: "Toon het prestatiepaneel van de team",
      de: "Zeige das Leistungspanel des Teams",
      sw: "Tunza paneli la ujuzi wa timu",
    },
  },
  {
    path: "/inventory",
    label: "Inventory",
    description: {
      en: "Go to the Inventory page",
      fr: "Allez à la page d'inventaire",
      es: "Vaya a la página de inventario",
      nl: "Ga naar de inventaris pagina",
      de: "Gehe zu der Inventar-Seite",
      sw: "Ikiwa kwenye orodha ya malipo",
    },
  },
  {
    path: "/my-business",
    label: "My Business",
    description: {
      en: "Go to the My Business page",
      fr: "Allez à la page Mon entreprise",
      es: "Vaya a la página de Mi negocio",
      nl: "Ga naar de pagina Mijn bedrijf",
      de: "Gehe zu der Seite Meine Firma",
      sw: "Ikiwa kwa ukurasa wa Biashara yangu",
    },
  },
  {
    path: "/onboarding",
    label: "Onboarding",
    description: {
      en: "Go to the Onboarding page",
      fr: "Allez sur la page d'Onboarding",
      es: "Vaya a la página de Onboarding",
      nl: "Ga naar de Onboarding-pagina",
      de: "Gehe zu der Onboarding-Seite",
      sw: "Ikiwa kwenye ukurasa wa Onboarding",
    },
  },
  {
    path: "/onboarding/staff-setup",
    label: "Onboarding Staff Setup",
    description: {
      en: "Go to the Onboarding Staff Setup page",
      fr: "Allez à la page de configuration des personnels d'accueil",
      es: "Vaya a la página de configuración del personal de bienvenida",
      nl: "Ga naar de pagina Instellingen voor de inloopstaf",
      de: "Gehe zu der Einstellungen für die Onboarding-Team",
      sw: "Ikiwa kwa picha ya kuwasilisha kwa wafanyakazi wa kuwasiliana",
    },
  },
  {
    path: "/pos",
    label: "POS",
    description: {
      en: "Go to the POS page",
      fr: "Allez à la page POS",
      es: "Vaya a la página POS",
      nl: "Ga naar de POS-pagina",
      de: "Gehe zu der POS-Seite",
      sw: "Ikiwa kwenye ukurasa wa POS",
    },
  },
  {
    path: "/pos/setup",
    label: "POS Setup",
    description: {
      en: "Go to the POS Setup page",
      fr: "Allez à la page de configuration du POS",
      es: "Vaya a la página de configuración de POS",
      nl: "Ga naar de POS-instellingen pagina",
      de: "Gehe zu der POS-Einstellungen-Seite",
      sw: "Ikiwa kwenye ukurasa wa kuweka mipango ya POS",
    },
  },
  {
    path: "/search",
    label: "Search",
    description: {
      en: "Go to the Search page",
      fr: "Allez à la page Recherche",
      es: "Vaya a la página de Búsqueda",
      nl: "Ga naar de Zoekpagina",
      de: "Gehe zu der Suchseite",
      sw: "Ikiwa kwenye ukurasa wa Habari",
    },
  },
  {
    path: "/settings",
    label: "Settings",
    description: {
      en: "Go to the Settings page",
      fr: "Allez à la page Paramètres",
      es: "Vaya a la página de Configuración",
      nl: "Ga naar de Instellingen pagina",
      de: "Gehe zu der Einstellungen Seite",
      sw: "Ikiwa kwenye ukurasa wa Mawasiliano",
    },
  },
  {
    path: "/shipments",
    label: "Shipments",
    description: {
      en: "Go to the Shipments page",
      fr: "Allez à la page des expéditions",
      es: "Vaya a la página de envíos",
      nl: "Ga naar de verzendingspagina",
      de: "Gehe zu der Sendungen-Seite",
      sw: "Ikiwa kwenye orodha ya malipo",
    },
  },
  {
    path: "/sources",
    label: "Sources",
    description: {
      en: "Go to the Sources page",
      fr: "Allez à la page Sources",
      es: "Vaya a la página de Fuentes",
      nl: "Ga naar de bronnenpagina",
      de: "Gehe zu der Quellen-Seite",
      sw: "Ikiwa kwenye ukurasa wa Mawasiliano",
    },
  },
  {
    path: "/templates",
    label: "Templates",
    description: {
      en: "Go to the Templates page",
      fr: "Allez à la page Modèles",
      es: "Vaya a la página de Plantillas",
      nl: "Ga naar de sjablonenpagina",
      de: "Gehe zu der Vorlagen-Seite",
      sw: "Ikiwa kwenye ukurasa wa Mifano",
    },
  },
  {
    path: "/tools",
    label: "Tools",
    description: {
      en: "Go to the Tools page",
      fr: "Allez sur la page Outils",
      es: "Vaya a la página Herramientas",
      nl: "Ga naar de Tools-pagina",
      de: "Gehe zu der Werkzeuge-Seite",
      sw: "Ikiwa kwenye ukurasa wa Vifaa",
    },
  },
]

export function findRouteByPath(path: string): VoiceRoute | undefined {
  return VALID_ROUTES.find((route) => route.path === path)
}

export const VALID_ROUTE_PATHS: string[] = VALID_ROUTES.map((route) => route.path)
