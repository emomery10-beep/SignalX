import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import LandingClient from '@/components/layout/LandingClient'
import { COUNTRY_CURRENCY, CURRENCIES } from '@/lib/geo'
import { getInitialCatalogs } from '@/lib/i18n-catalog'

// ── SEO Metadata ─────────────────────────────────────────────────────────────
// Locale-aware: middleware rewrites /es, /fr, … to this page with x-locale set.
// Each variant self-canonicalizes to its own URL and carries the full
// reciprocal hreflang set — a canonical pointing at the English page would
// tell Google to never index the translated homepages.
const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: 'AskBiz — Phone POS with M-Pesa for Kenya, Nigeria & Uganda',
    description: 'Phone POS and daily sales tracker for market stalls and small shops. Take M-Pesa, MTN, Airtel Money, cash or card. Free to start — see your profit tonight. Also known as Utauza in East & Central Africa.',
  },
  sw: {
    title: 'Utauza (AskBiz) — Uza kwa Simu Yako, Chukua M-Pesa',
    description: 'Utauza ni POS ya simu na kifuatiliaji cha mauzo ya kila siku kwa bustani za soko, kiosk, na maduka madogo. Chukua M-Pesa, MTN, Airtel Money, taslimu au kadi. Bure kuanza — ona faida yako leo.',
  },
  es: {
    title: 'AskBiz — Vende con tu teléfono. TPV y ventas del día',
    description: 'TPV móvil y control diario de ventas para puestos, kioscos y tiendas pequeñas. Cobra en efectivo, tarjeta o dinero móvil. Gratis para empezar.',
  },
  fr: {
    title: 'AskBiz — Vendez avec votre téléphone. Caisse mobile',
    description: 'Caisse mobile et suivi des ventes pour étals, kiosques et petites boutiques. Encaissez espèces, carte ou mobile money. Gratuit pour commencer.',
  },
  de: {
    title: 'AskBiz — Verkaufen mit dem Handy. Kasse und Tagesumsatz',
    description: 'Mobile Kasse und tägliche Umsatzübersicht für Marktstände, Kioske und kleine Läden. Bargeld, Karte oder Mobile Money. Kostenlos starten.',
  },
  nl: {
    title: 'AskBiz — Verkopen met je telefoon. Kassa en dagomzet',
    description: 'Mobiele kassa en dagelijkse omzet voor marktkramen, kiosken en kleine winkels. Contant, kaart of mobile money. Gratis te starten.',
  },
  ar: {
    title: 'AskBiz — بِع بهاتفك واعرف ربحك الليلة',
    description: 'نقطة بيع بالهاتف وتتبع يومي للمبيعات للأكشاك والمحلات الصغيرة. اقبل الدفع نقدًا أو بالبطاقة أو بالمحفظة المحمولة. ابدأ مجانًا.',
  },
}

const HREFLANG_LANGUAGES = {
  'x-default': 'https://askbiz.co',
  'en': 'https://askbiz.co',
  'es': 'https://askbiz.co/es',
  'fr': 'https://askbiz.co/fr',
  'de': 'https://askbiz.co/de',
  'nl': 'https://askbiz.co/nl',
  'ar': 'https://askbiz.co/ar',
  'sw': 'https://askbiz.co/sw',
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = headers().get('x-locale') || 'en'
  const meta = META_BY_LOCALE[locale] || META_BY_LOCALE.en
  const url = locale === 'en' ? 'https://askbiz.co' : `https://askbiz.co/${locale}`

  return {
    title: meta.title,
    description: meta.description,
    keywords: 'phone POS, mobile POS Africa, M-Pesa POS, market stall app, small shop POS, daily sales tracker, mobile money POS, Kenya POS app, Nigeria POS app, camera barcode scanner POS, Utauza, Utauza app, uza kwa simu, uza kwa simu yako, biashara app East Africa, sell with your phone Africa, camera POS Africa, phone till Africa, scan and sell app, phone POS app Africa, no barcode scanner needed, digital till app Africa, shop till app, multi-branch POS Africa, small shop POS Africa, M-Pesa POS app, MTN Mobile Money POS, Airtel Money app, mobile money business app, Paga POS Nigeria, OPay business app, Chipper Cash business tool, cash and mobile money till, camera barcode scanner Africa, phone camera checkout, inventory app for small shops Africa, stock tracker phone app, market stall inventory app, shop stock management Africa, daily sales tracker Africa, see your profit tonight, daily takings app, business profit tracker Africa, track sales without spreadsheet, app for market stall sellers, app for street vendors, informal business app Africa, unregistered business app, app for hawkers, app for kiosk owners, small business app Africa, notebook replacement app, digital sales book app, barbershop POS app, salon POS app, food stand sales app, courier business app, restaurant till app Africa, spaza shop app, duka app, offline POS app Africa, sales app without internet, works without network, staff shift tracking app, multi-staff POS Africa, VAT app Kenya, tax compliance small business Africa, KRA compliant app, FIRS compliant app, SARS compliant app, free POS app Africa, start free no card needed, free business tracker app, POS app Nigeria, POS app Kenya, POS app Uganda, POS app Tanzania, POS app Ghana, POS app Rwanda, POS app South Africa, business app DRC, business app Lagos, business app Nairobi, business app Accra, business app Kampala, business app Dar es Salaam, business app Kigali, business app Johannesburg, phone POS East Africa, phone POS West Africa, phone POS Central Africa, mobile business app pan-Africa, Africa business app, mobile POS for African markets, camera-first business app Africa, programu ya Utauza, Utauza biashara, Utauza — utauza leo, kuuza kwa simu, piga picha uza, kamera yako ni rejista, rejista ya mauzo kwa simu, mfumo wa mauzo kwa simu, POS ya simu, programu ya POS Afrika Mashariki, simu badala ya mashine ya POS, dukani bila kompyuta, risiti za kidijitali, matawi mengi ya duka, mauzo ya M-Pesa, kupokea M-Pesa dukani, malipo ya simu dukani, pesa za simu na biashara, MTN Mobile Money app, Airtel Money POS, taslimu na kadi mauzo, skani bidhaa kwa kamera, bila mashine ya bar kodi, mauzo ya bidhaa kwa kamera, hesabu ya bidhaa dukani, usimamizi wa stock kwa simu, programu ya kuhesabu bidhaa, mfumo wa hisa dukani, programu ya bei ya bidhaa, ripoti ya mauzo ya siku, taarifa ya faida ya leo, ulichopata leo, faida ya biashara kila siku, faida na hasara dukani, kufuatilia mauzo kila siku, kujua faida ya duka, rekodi za mauzo kwa simu, programu ya biashara ndogo, programu ya duka dogo, muuzaji wa soko, mfanyabiashara mdogo, biashara isiyosajiliwa, duka la mtaani, gengeni mauzo, mama ntilie mauzo, mauzo bila karatasi, acha daftari la mauzo, programu ya wafanyabiashara wadogo, muuzaji wa nguo sokoni, muuzaji wa chakula barabarani, kiosk ya rejareja, saluni na mauzo, kinyozi na malipo, rejista ya simu bila mtandao, mauzo bila intaneti, kazi bila mtandao dukani, usajili wa wafanyakazi dukani, zamu za wafanyakazi, kodi ya biashara Kenya, VAT na biashara ndogo, programu ya kodi, anza bure programu ya biashara, jaribu bure Utauza, programu ya bei nafuu ya biashara, programu ya mauzo Kenya, programu ya mauzo Tanzania, programu ya mauzo Uganda, programu ya mauzo Rwanda, programu ya biashara DRC, mauzo Nairobi, mauzo Dar es Salaam, mauzo Kampala, mauzo Kigali, mauzo Bukavu, programu ya biashara Afrika Mashariki, programu ya biashara Afrika ya Kati, programu ya mauzo bila karatasi',
    authors: [{ name: 'AskBiz' }],
    creator: 'AskBiz',
    publisher: 'AskBiz',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    openGraph: {
      type: 'website',
      url,
      title: meta.title,
      description: meta.description,
      siteName: 'AskBiz',
      images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz — Sell with your phone. See what you made tonight.' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['https://askbiz.co/og-image.png'],
    },
    alternates: {
      canonical: url,
      languages: HREFLANG_LANGUAGES,
    },
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  KE: 'Kenya', NG: 'Nigeria', ZA: 'South Africa', UG: 'Uganda',
  TZ: 'Tanzania', GH: 'Ghana', ET: 'Ethiopia', RW: 'Rwanda',
  ZM: 'Zambia', ZW: 'Zimbabwe', US: 'United States', GB: 'United Kingdom',
  AE: 'UAE', IN: 'India', SG: 'Singapore', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands',
  BR: 'Brazil', MX: 'Mexico', PK: 'Pakistan', BD: 'Bangladesh',
  EG: 'Egypt', MA: 'Morocco', JP: 'Japan', KR: 'South Korea',
}

const PRICING_TIERS: Record<string, { growth: string; business: string; sym: string; pos: string }> = {
  GB:  { growth: '£19',       business: '£39',       sym: '£',   pos: '£5'       },
  IE:  { growth: '€19',       business: '€39',       sym: '€',   pos: '€5'       },
  DE:  { growth: '€19',       business: '€39',       sym: '€',   pos: '€5'       },
  FR:  { growth: '€19',       business: '€39',       sym: '€',   pos: '€5'       },
  NL:  { growth: '€19',       business: '€39',       sym: '€',   pos: '€5'       },
  ES:  { growth: '€19',       business: '€39',       sym: '€',   pos: '€5'       },
  IT:  { growth: '€19',       business: '€39',       sym: '€',   pos: '€5'       },
  US:  { growth: '$19',       business: '$39',       sym: '$',   pos: '$5'       },
  CA:  { growth: 'CA$25',     business: 'CA$65',     sym: 'CA$', pos: 'CA$7'     },
  AU:  { growth: 'A$27',      business: 'A$75',      sym: 'A$',  pos: 'A$8'      },
  SG:  { growth: 'S$25',      business: 'S$65',      sym: 'S$',  pos: 'S$7'      },
  AE:  { growth: 'AED 69',    business: 'AED 199',   sym: 'AED', pos: 'AED 18'   },
  IN:  { growth: '₹1,499',    business: '₹3,999',    sym: '₹',   pos: '₹400'     },
  KE:  { growth: 'KSh 1,900', business: 'KSh 4,900', sym: 'KSh', pos: 'KSh 500'  },
  NG:  { growth: '₦9,900',    business: '₦29,900',   sym: '₦',   pos: '₦2,500'   },
  ZA:  { growth: 'R 290',     business: 'R 890',     sym: 'R',   pos: 'R 90'     },
  GH:  { growth: '₵220',      business: '₵690',      sym: '₵',   pos: '₵25'      },
  UG:  { growth: 'USh 59,000',business: 'USh 179,000',sym:'USh', pos: 'USh 18,000'},
  TZ:  { growth: 'TSh 39,000',business: 'TSh 119,000',sym:'TSh', pos: 'TSh 12,000'},
  ET:  { growth: 'Br 890',    business: 'Br 2,900',  sym: 'Br',  pos: 'Br 250'   },
  BR:  { growth: 'R$ 95',     business: 'R$ 245',    sym: 'R$',  pos: 'R$ 25'    },
  MX:  { growth: 'MX$ 320',   business: 'MX$ 820',   sym: 'MX$', pos: 'MX$ 90'   },
  JP:  { growth: '¥2,800',    business: '¥7,200',    sym: '¥',   pos: '¥700'     },
  DEFAULT: { growth: '$19',   business: '$39',        sym: '$',   pos: '$5'       },
}

export default async function LandingPage({ searchParams }: { searchParams: { code?: string; token_hash?: string; type?: string; ref?: string; shop?: string; status?: string } }) {
  if (searchParams.code) redirect(`/auth/callback?code=${searchParams.code}`)
  if (searchParams.token_hash && searchParams.type) redirect(`/auth/callback?token_hash=${searchParams.token_hash}&type=${searchParams.type}`)
  // Shopify App Store install — redirect to sign-in with shop context
  if (searchParams.ref === 'shopify' && searchParams.shop) redirect(`/signin?ref=shopify&shop=${searchParams.shop}&status=${searchParams.status || 'install'}`)

  const headersList = headers()
  const countryCode = headersList.get('x-vercel-ip-country') || 'US'
  // Middleware resolves the locale (URL prefix → cookie → geo) and constrains
  // it to the ACTIVE set. Reading COUNTRY_TO_LANG directly here used to leak
  // inactive locales (KE → 'sw'), making every internal link a /sw/* redirect.
  const lang = headersList.get('x-locale') || 'en'
  const city = headersList.get('x-vercel-ip-city') || ''

  const country = COUNTRY_NAMES[countryCode] || countryCode
  const currency = COUNTRY_CURRENCY[countryCode] || 'USD'
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD
  const pricing = PRICING_TIERS[countryCode] || PRICING_TIERS.DEFAULT

  const geo = {
    country,
    countryCode,
    city: city ? decodeURIComponent(city) : '',
    currency,
    currencySymbol: currencyInfo.sym,
    currencyName: currencyInfo.name,
    flag: currencyInfo.flag || '🌍',
    pricing,
  }

  // ── Advanced Schema Markup (JSON-LD) ────────────────────────────────────────
  const schemas = [
    // SoftwareApplication — primary entity
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': 'https://askbiz.co/#software',
      name: 'AskBiz',
      alternateName: ['AskBiz POS', 'AskBiz Phone Till', 'AskBiz Africa POS', 'AskBiz M-Pesa POS', 'AskBiz Mobile Money Till', 'Utauza', 'Utauza App'],
      description: 'Phone-based POS and daily business tracker for market stalls, street vendors, and informal sellers across East and Central Africa. Sell with your camera. Take M-Pesa, cash, or card. Know what you made today — on any phone, free to start. Also known as Utauza — Swahili for "you will sell."',
      url: 'https://askbiz.co',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          price: '0',
          priceCurrency: 'GBP',
          description: '10 questions per month, file upload, Business Pulse health score, API access',
        },
        {
          '@type': 'Offer',
          name: 'Growth Plan',
          price: '19',
          priceCurrency: 'GBP',
          billingIncrement: 'P1M',
          description: 'Unlimited questions, Daily Brief, anomaly alerts, market intelligence',
        },
        {
          '@type': 'Offer',
          name: 'Business Plan',
          price: '39',
          priceCurrency: 'GBP',
          billingIncrement: 'P1M',
          description: 'Everything in Growth plus 5 team seats, Decision Memory, Competitor Watch, CFO Mode',
        },
      ],
      featureList: [
        'M-Pesa payment acceptance',
        'MTN Mobile Money integration',
        'Airtel Money integration',
        'Camera barcode scanning — no barcode gun needed',
        'Offline mode — cash sales continue with no internet, auto-sync when reconnected',
        'Daily takings report',
        'End of day reconciliation',
        'M-Pesa receipt generation',
        'Staff OTP login — no password sharing',
        'Stock alert — low stock warning before you run out',
        'Morning brief — daily sales summary on your phone',
        'Multi-branch POS with per-location stock',
        'Works for shops, restaurants, salons, barbershops, couriers, market stalls',
        'Free to start — no card required',
        'No hardware — any phone or tablet',
        'Business Pulse health score (0-100)',
        'Daily morning intelligence brief',
        'Anomaly detection and alerts',
        'Predictive inventory management',
        'Decision Memory with 6-week reviews',
        'Team access with role-based permissions',
        'Competitor Watch autopilot',
        'Shopify integration',
        'Amazon integration',
        'TikTok Shop integration',
        'Stripe integration',
        'Google Sheets integration',
        'CSV and Excel file upload',
        'Plain English answers',
        'CFO Mode board-ready reports',
        'What-if scenario simulation',
        'Multi-currency support (150+ currencies)',
        'Till reconciliation',
        'Petty cash tracking',
        'Xero and QuickBooks sync',
        'GDPR tools (data export, deletion, consent)',
      ],
      screenshot: 'https://askbiz.co/og-image.png',
    },

    // Organization
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://askbiz.co/#org',
      name: 'AskBiz',
      url: 'https://askbiz.co',
      logo: 'https://askbiz.co/logo.svg',
      sameAs: [
        'https://twitter.com/askbizco',
        'https://www.linkedin.com/company/askbiz',
        'https://www.facebook.com/share/g/17wFxNYZRH/',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hello@askbiz.co',
      },
      areaServed: [
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Nigeria' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'Ghana' },
        { '@type': 'Country', name: 'South Africa' },
        { '@type': 'Country', name: 'Tanzania' },
        { '@type': 'Country', name: 'Rwanda' },
        { '@type': 'Country', name: 'Zambia' },
        { '@type': 'Country', name: 'Zimbabwe' },
        { '@type': 'Country', name: 'Ethiopia' },
        { '@type': 'Country', name: 'Ivory Coast' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'City', name: 'Nairobi' },
        { '@type': 'City', name: 'Lagos' },
        { '@type': 'City', name: 'Kampala' },
        { '@type': 'City', name: 'Accra' },
        { '@type': 'City', name: 'Dar es Salaam' },
        { '@type': 'City', name: 'Abuja' },
        { '@type': 'City', name: 'Abidjan' },
        { '@type': 'City', name: 'Lusaka' },
        { '@type': 'City', name: 'Harare' },
        { '@type': 'City', name: 'Kigali' },
      ],
      knowsAbout: [
        'mobile POS Africa', 'phone POS', 'M-Pesa payments', 'MTN Mobile Money', 'Airtel Money',
        'informal business management', 'market stall POS', 'street vendor POS', 'kiosk POS',
        'spaza shop POS', 'duuka POS', 'small shop POS', 'barbershop POS', 'salon POS Africa',
        'restaurant POS Africa', 'courier payment app', 'delivery business tracker',
        'boda boda payment tracking', 'hawker POS', 'jua kali business tracker',
        'camera barcode scan', 'stock management phone', 'daily sales tracker',
        'daily takings report', 'end of day report', 'mobile money receipt', 'M-Pesa receipt',
        'affordable POS Africa', 'affordable POS Kenya', 'affordable POS Nigeria', 'phone till',
        'no hardware POS', 'unregistered business tracker', 'sole trader POS Africa',
        'roadside business app', 'float management', 'till reconciliation',
      ],
    },

    // WebSite with SearchAction (enables sitelinks search box in Google/DDG)
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://askbiz.co/#website',
      url: 'https://askbiz.co',
      name: 'AskBiz',
      description: 'Phone POS and daily money tracker for market stalls, street vendors, and small shops. Take M-Pesa, cash, or card on any phone.',
      publisher: { '@id': 'https://askbiz.co/#org' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://askbiz.co/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },

    // SiteNavigationElement — tells search engines which pages are primary nav
    // This is the primary signal that generates sitelinks in Google/DuckDuckGo
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'AskBiz Main Navigation',
      itemListElement: [
        { '@type': 'SiteNavigationElement', position: 1, name: 'Free Tools',    url: 'https://askbiz.co/free-tools',     description: 'Free calculators: landed cost, FX risk, VAT, profit margin, break-even' },
        { '@type': 'SiteNavigationElement', position: 2, name: 'Point of Sale', url: 'https://askbiz.co/point-of-sale',  description: 'AI-powered point of sale system for retail and hospitality' },
        { '@type': 'SiteNavigationElement', position: 3, name: 'Integrations',  url: 'https://askbiz.co/integrations',   description: 'Connect Shopify, Amazon, Stripe, QuickBooks and more' },
        { '@type': 'SiteNavigationElement', position: 4, name: 'Blog',          url: 'https://askbiz.co/blog',           description: 'Guides on phone-based selling, M-Pesa and mobile money, stock and daily takings' },
        { '@type': 'SiteNavigationElement', position: 5, name: 'Academy',       url: 'https://askbiz.co/academy',        description: '420+ free guides on selling with your phone, mobile money, and growing a small business' },
        { '@type': 'SiteNavigationElement', position: 6, name: 'Pricing',       url: 'https://askbiz.co/pricing',        description: 'AskBiz plans — Free, Growth, Business. Paid plans start with 3 months free.' },
        { '@type': 'SiteNavigationElement', position: 7, name: 'Help',          url: 'https://askbiz.co/help',           description: 'Help centre, FAQ and how-to guides' },
        { '@type': 'SiteNavigationElement', position: 8, name: 'Compare',       url: 'https://askbiz.co/compare',        description: 'Compare AskBiz vs other POS and phone till apps' },
      ],
    },

    // FAQPage — targets featured snippets and AI Overviews
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does AskBiz actually do?',
          acceptedAnswer: { '@type': 'Answer', text: 'AskBiz is your till, your stock tracker, and your daily business report — all in one phone app. You sell with your camera, take M-Pesa, cash, or card, and at the end of the day you see exactly what you made and where it went. No spreadsheet. No accountant. Just your phone.' },
        },
        {
          '@type': 'Question',
          name: 'How much does AskBiz cost?',
          acceptedAnswer: { '@type': 'Answer', text: 'AskBiz has a free plan with 10 questions per month, a Growth plan at £19/month with unlimited questions and all core features, and a Business plan at £39/month with team seats, Decision Memory, Competitor Watch, and CFO Mode. Growth and Business both come with a 3-month free trial. The Point of Sale add-on is £5 per seat per month on any plan.' },
        },
        {
          '@type': 'Question',
          name: 'What payments does AskBiz accept?',
          acceptedAnswer: { '@type': 'Answer', text: 'M-Pesa, MTN Mobile Money, Airtel Money, cash, credit card, Stripe, and more. If your customer can pay it, AskBiz can take it. UK plans include Stripe integration for card payments.' },
        },
        {
          '@type': 'Question',
          name: 'What is the Business Pulse score?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Business Pulse score is a 0-100 health rating for your business, calculated from five components: margin health, revenue trend, stock position, cash flow, and product mix. It updates every time you upload new data or sync your connected stores.' },
        },
        {
          '@type': 'Question',
          name: 'Does AskBiz include a Point of Sale system?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes — AskBiz includes a full Point of Sale system with register checkout, barcode scanning, inventory management, staff shift tracking, digital receipts, multi-branch support, tax compliance, GDPR tools, and integrations with Xero and QuickBooks. The POS costs £5 per seat per month and is available on all plans.' },
        },
        {
          '@type': 'Question',
          name: 'I am not a registered business — does AskBiz work for me?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. AskBiz works for market stalls, street sellers, food stands, and anyone who sells anything. You do not need to be registered, have a bank account, or own a card machine. If you have a phone, you are ready.' },
        },
        {
          '@type': 'Question',
          name: 'Is my business data safe?',
          acceptedAnswer: { '@type': 'Answer', text: 'Your data is encrypted at rest and in transit. We never use your business data to train AI models. UK data residency with SOC 2-aligned controls.' },
        },
        {
          '@type': 'Question',
          name: 'I already use a notebook — why would I switch to AskBiz?',
          acceptedAnswer: { '@type': 'Answer', text: 'A notebook tells you what happened. AskBiz tells you what to do next. You will see which items are actually making you money, which are sitting unsold, and whether today was better or worse than yesterday — in 4 minutes, not 2 hours.' },
        },
        {
          '@type': 'Question',
          name: 'What happens if my network drops mid-sale?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cash sales keep going with no connection at all — your stock and till still update. The app queues the sale and syncs it automatically the moment you are back online. Card and mobile money payments need a live connection to confirm with the provider, so those pause until signal returns — everything else keeps working.' },
        },
        {
          '@type': 'Question',
          name: 'What is Utauza? Is it the same as AskBiz?',
          acceptedAnswer: { '@type': 'Answer', text: '"Utauza" is Swahili for "you will sell" — it is AskBiz\'s name for the East and Central Africa market. Utauza and AskBiz are the same app, same features: scan it with your camera, sell it, and see what you made — on any phone, in Kenya, Tanzania, Uganda, Rwanda, and the DRC.' },
        },
      ],
    },
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
      ))}
      <LandingClient geo={geo} lang={lang} initialCatalogs={getInitialCatalogs(lang)}/>
    </>
  )
}
