import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import LandingClient from '@/components/layout/LandingClient'
import { COUNTRY_CURRENCY, CURRENCIES } from '@/lib/geo'
import { COUNTRY_TO_LANG } from '@/lib/i18n'

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'AskBiz — AI Business Intelligence for SME Founders',
  description: 'AskBiz is AI-powered business intelligence for SME founders. Connect Shopify, Amazon, TikTok Shop, or QuickBooks. Ask questions in plain English, get answers with your real numbers. Point of Sale, FX Risk, Landed Cost, Export Markets, Social Commerce. Free to start.',
  keywords: 'AI business intelligence, SME analytics, small business data, Shopify analytics, Amazon seller analytics, TikTok Shop analytics, export market scoring, landed cost calculator, FX risk modeller, supplier scorecard, social commerce intelligence, business health score, plain English business insights',
  authors: [{ name: 'AskBiz' }],
  creator: 'AskBiz',
  publisher: 'AskBiz',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website',
    url: 'https://askbiz.co',
    title: 'AskBiz — AI Business Intelligence for SME Founders',
    description: 'Ask questions about your business in plain English. Get clear answers grounded in your actual data. Free to start — no card needed.',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz — AI Business Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskBiz — AI Business Intelligence for SME Founders',
    description: 'Ask questions about your business in plain English. Get answers in seconds.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co' },
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

const PRICING_TIERS: Record<string, { growth: string; business: string; sym: string }> = {
  GB:  { growth: '£19',      business: '£49',      sym: '£'   },
  IE:  { growth: '€19',      business: '€49',      sym: '€'   },
  DE:  { growth: '€19',      business: '€49',      sym: '€'   },
  FR:  { growth: '€19',      business: '€49',      sym: '€'   },
  NL:  { growth: '€19',      business: '€49',      sym: '€'   },
  ES:  { growth: '€19',      business: '€49',      sym: '€'   },
  IT:  { growth: '€19',      business: '€49',      sym: '€'   },
  US:  { growth: '$19',     business: '$49',     sym: '$'  },
  CA:  { growth: 'CA$25',   business: 'CA$65',   sym: 'CA$'},
  AU:  { growth: 'A$27',    business: 'A$75',    sym: 'A$' },
  SG:  { growth: 'S$25',    business: 'S$65',    sym: 'S$' },
  AE:  { growth: 'AED 69',   business: 'AED 199',  sym: 'AED' },
  IN:  { growth: '₹1,499',   business: '₹3,999',   sym: '₹'   },
  KE:  { growth: 'KSh 1,900',business: 'KSh 4,900',sym: 'KSh' },
  NG:  { growth: '₦9,900',   business: '₦29,900',  sym: '₦'   },
  ZA:  { growth: 'R 290',    business: 'R 890',    sym: 'R'   },
  GH:  { growth: '₵220',     business: '₵690',     sym: '₵'   },
  UG:  { growth: 'USh 59,000',business:'USh 179,000',sym:'USh'},
  TZ:  { growth: 'TSh 39,000',business:'TSh 119,000',sym:'TSh'},
  ET:  { growth: 'Br 890',   business: 'Br 2,900', sym: 'Br'  },
  BR:  { growth: 'R$ 95',   business: 'R$ 245',  sym: 'R$' },
  MX:  { growth: 'MX$ 320', business: 'MX$ 820', sym: 'MX$'},
  DEFAULT: { growth: '$19', business: '$49',      sym: '$'  },
}

export default async function LandingPage({ searchParams }: { searchParams: { code?: string; token_hash?: string; type?: string } }) {
  if (searchParams.code) redirect(`/auth/callback?code=${searchParams.code}`)
  if (searchParams.token_hash && searchParams.type) redirect(`/auth/callback?token_hash=${searchParams.token_hash}&type=${searchParams.type}`)

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
      alternateName: ['AskBiz BI', 'AskBiz Business Intelligence'],
      description: 'AI-powered business intelligence platform for SME founders. Ask questions about your sales data in plain English and get clear answers with next steps.',
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
          price: '49',
          priceCurrency: 'GBP',
          billingIncrement: 'P1M',
          description: 'Everything in Growth plus 5 team seats, Decision Memory, Competitor Watch, CFO Mode',
        },
      ],
      featureList: [
        'Business Pulse health score (0-100)',
        'Daily morning intelligence brief',
        'Anomaly detection and alerts',
        'Predictive inventory management',
        'Decision Memory with 6-week reviews',
        'Team access with role-based permissions',
        'Competitor Watch autopilot',
        'AI strategic sparring',
        'Shopify integration',
        'Amazon integration',
        'TikTok Shop integration',
        'Stripe integration',
        'Google Sheets integration',
        'CSV and Excel file upload',
        'Plain English answers',
        'CFO Mode board-ready reports',
        'What-if scenario simulation',
        'Multi-currency support (40+ currencies)',
        'Point of Sale (register, inventory, receipts)',
        'Multi-branch PoS with per-location tax settings',
        'Staff shift management with OTP login',
        'GDPR tools (data export, deletion, consent)',
        'Xero and QuickBooks PoS integration',
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
    },

    // WebSite with SearchAction (for sitelinks search box)
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://askbiz.co/#website',
      url: 'https://askbiz.co',
      name: 'AskBiz',
      description: 'AI business intelligence for SME founders',
      publisher: { '@id': 'https://askbiz.co/#org' },
    },

    // FAQPage — targets featured snippets and AI Overviews
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is AskBiz?',
          acceptedAnswer: { '@type': 'Answer', text: 'AskBiz is an AI-powered business intelligence tool for SME founders. You connect your Shopify, Amazon, TikTok Shop, or QuickBooks account, then ask questions in plain English and get clear answers grounded in your actual data.' },
        },
        {
          '@type': 'Question',
          name: 'How much does AskBiz cost?',
          acceptedAnswer: { '@type': 'Answer', text: 'AskBiz has a free plan with 10 questions per month, a Growth plan at £19/month with unlimited questions and all core features, and a Business plan at £49/month with team seats, Decision Memory, Competitor Watch, and CFO Mode. All plans include API access.' },
        },
        {
          '@type': 'Question',
          name: 'What data sources does AskBiz support?',
          acceptedAnswer: { '@type': 'Answer', text: 'AskBiz connects to Shopify, Amazon FBA, TikTok Shop, Instagram Shopping, Pinterest, Stripe, QuickBooks, Google Sheets, and Square. You can also upload CSV and Excel files directly.' },
        },
        {
          '@type': 'Question',
          name: 'What is the Business Pulse score?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Business Pulse score is a 0-100 health rating for your business, calculated from five components: margin health, revenue trend, stock position, cash flow, and product mix. It updates every time you upload new data or sync your connected stores.' },
        },
        {
          '@type': 'Question',
          name: 'Does AskBiz include a Point of Sale system?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes — AskBiz includes a full Point of Sale system with register checkout, barcode scanning, inventory management, staff shift tracking, digital receipts, multi-branch support, tax compliance, GDPR tools, and integrations with Xero and QuickBooks. The PoS costs £5 per seat per month and is available on all plans.' },
        },
        {
          '@type': 'Question',
          name: 'Is AskBiz suitable for small businesses?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes — AskBiz is built specifically for SME founders, solo sellers, and small business owners who need business intelligence without a data team. No technical knowledge required.' },
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
