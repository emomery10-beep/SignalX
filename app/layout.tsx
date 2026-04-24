import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})
const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['400', '500'],
  display: 'swap',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'AskBiz — Ask Your Business Data Anything',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  description: 'Ask your data anything. Get BI answers instantly. Upload a spreadsheet, ask a plain-English question, get grounded insights with charts and next steps.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'AskBiz — Ask Your Business Data Anything',
    icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  description: 'Conversational BI for every business. Auto-localised to your region and currency.',
    type: 'website',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AskBiz',
  url: 'https://askbiz.co',
  logo: 'https://askbiz.co/logo.svg',
  description: 'AI-powered business intelligence for SME founders. Upload your data, ask plain-English questions, get instant insights with charts and recommendations.',
  foundingDate: '2024',
  areaServed: 'Worldwide',
  serviceType: 'Business Intelligence Software',
  sameAs: [
    'https://twitter.com/askbizco',
    'https://linkedin.com/company/askbiz',
    'https://www.producthunt.com/products/askbiz',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@askbiz.co',
    availableLanguage: ['English', 'French', 'German', 'Spanish'],
  },
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AskBiz',
  url: 'https://askbiz.co',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Ask your business data anything. Conversational BI for SME founders — auto-localised to your region and currency.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'GBP',
    lowPrice: '0',
    highPrice: '49',
    offerCount: '3',
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'GBP' },
      { '@type': 'Offer', name: 'Growth', price: '19', priceCurrency: 'GBP' },
      { '@type': 'Offer', name: 'Business', price: '49', priceCurrency: 'GBP' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dm.variable} ${mono.variable}`}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ELBCMBBMEC"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ELBCMBBMEC');
        ` }} />

        {/* Schema.org structured data — Google Knowledge Panel + Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />

        {/* Canonical logo for Google image search and Knowledge Panel */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
