import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import LandingClient from '@/components/layout/LandingClient'
import { COUNTRY_CURRENCY, CURRENCIES } from '@/lib/geo'
import { COUNTRY_TO_LANG } from '@/lib/i18n'

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'AskBiz — Phone POS App for Kenya, Nigeria & Uganda | Free to Start, M-Pesa Till & Daily Sales',
  description: 'AskBiz is a phone POS and daily sales tracker for market stalls, kiosks, salons and small shops in Kenya, Nigeria, Uganda and across Africa. Free to start — take M-Pesa, MTN Mobile Money, Airtel Money, cash or card and know your profit by tonight.',
  keywords: 'mobile POS Africa, M-Pesa POS, phone POS, market stall app, street vendor app, small shop POS, kiosk POS, spaza shop POS, duuka POS, barbershop POS, salon POS Africa, restaurant POS Africa, courier payment app, boda boda payment, hawker POS, jua kali business app, informal business tracker, sell with phone, mobile money POS, MTN mobile money, Airtel Money, M-Pesa receipt, float management, Kenya POS app, Nigeria small business app, Nairobi POS, Lagos POS, Kampala POS, Accra POS, Dar es Salaam POS, camera barcode scan, no hardware POS, daily sales tracker, daily takings, end of day report, track daily sales, sales book phone, stock management phone, affordable POS Africa, affordable POS Kenya, affordable POS Nigeria, phone till, unregistered business tracker, sole trader Africa',
  authors: [{ name: 'AskBiz' }],
  creator: 'AskBiz',
  publisher: 'AskBiz',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website',
    url: 'https://askbiz.co',
    title: 'AskBiz — Sell With Your Phone. See What You Made Tonight.',
    description: 'Phone-based POS and daily business tracker for market stalls, street vendors, and informal sellers. M-Pesa, cash, or card. See what you made today — on any phone, free to start.',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz — Sell with your phone. See what you made tonight.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskBiz — Sell With Your Phone. See What You Made Tonight.',
    description: 'Phone-based POS and daily tracker for market stalls and informal sellers. M-Pesa, cash, or card. See what you made today — any phone, free to start.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: {
    canonical: 'https://askbiz.co',
    languages: {
      'x-default': 'https://askbiz.co',
      'en': 'https://askbiz.co',
      'en-KE': 'https://askbiz.co',
      'en-NG': 'https://askbiz.co',
      'en-UG': 'https://askbiz.co',
      'en-GB': 'https://askbiz.co',
      'en-US': 'https://askbiz.co',
      'es': 'https://askbiz.co/es',
      'fr': 'https://askbiz.co/fr',
      'de': 'https://askbiz.co/de',
      'nl': 'https://askbiz.co/nl',
      'ar': 'https://askbiz.co/ar',
    },
  },
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
  KE:  { growth: 'KSh 1,900', business: 'KSh 4,900', sym: 'KSh', pos: 'KSh 600'  },
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
  const cookieStore = cookies()
  const lang = cookieStore.get('askbiz_lang')?.value || COUNTRY_TO_LANG[countryCode as keyof typeof COUNTRY_TO_LANG] || 'en'
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
      alternateName: ['AskBiz POS', 'AskBiz Phone Till', 'AskBiz Africa POS', 'AskBiz M-Pesa POS', 'AskBiz Mobile Money Till'],
      description: 'Phone-based POS and daily business tracker for market stalls, street vendors, and informal sellers. Sell with your camera. Take M-Pesa, cash, or card. Know what you made today — on any phone, free to start.',
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
        { '@type': 'SiteNavigationElement', position: 6, name: 'Pricing',       url: 'https://askbiz.co/pricing',        description: 'AskBiz plans from free — Starter, Growth, Business' },
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
          acceptedAnswer: { '@type': 'Answer', text: 'AskBiz has a free plan with 10 questions per month, a Growth plan at £19/month with unlimited questions and all core features, and a Business plan at £39/month with team seats, Decision Memory, Competitor Watch, and CFO Mode. All plans include API access.' },
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
      ],
    },
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
      ))}
      <LandingClient geo={geo} lang={lang}/>
    </>
  )
}
