import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import LandingClient from '@/components/layout/LandingClient'
import { COUNTRY_CURRENCY, CURRENCIES } from '@/lib/geo'
import { buildLandingMetadata, activeLandingSchemas, COUNTRY_NAMES, PRICING_TIERS } from '@/lib/landing-meta'

// ── Locale-prefixed homepage rewrite target ─────────────────────────────────
// middleware.ts rewrites /es, /fr, /de, /nl, /ar, /sw, /so (i.e. any
// locale-prefixed request whose logical path is "/") onto this file instead
// of app/page.tsx, injecting x-locale. This keeps the flat English `/` route
// (app/page.tsx) free of headers()/searchParams so it can be statically
// generated, while these translated variants keep the dynamic,
// per-request geo+locale rendering they've always had.
//
// Not linked anywhere and intentionally kept out of PUBLIC_PATHS in
// app/robots.ts / marked noindex below — the only valid entry points are the
// locale-prefixed URLs (/es, /sw, …), which the middleware rewrite maps here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = headers().get('x-locale') || 'en'
  const meta = buildLandingMetadata(locale)
  return { ...meta, robots: { index: false, follow: false } }
}

export default async function LocaleHomePage({ searchParams }: { searchParams: { code?: string; token_hash?: string; type?: string; ref?: string; shop?: string; status?: string } }) {
  if (searchParams.code) redirect(`/auth/callback?code=${searchParams.code}`)
  if (searchParams.token_hash && searchParams.type) redirect(`/auth/callback?token_hash=${searchParams.token_hash}&type=${searchParams.type}`)
  // Shopify App Store install — redirect to sign-in with shop context
  if (searchParams.ref === 'shopify' && searchParams.shop) redirect(`/signin?ref=shopify&shop=${searchParams.shop}&status=${searchParams.status || 'install'}`)

  const headersList = headers()
  // Middleware resolves the locale (URL prefix → cookie → geo) and constrains
  // it to the ACTIVE set. Reading COUNTRY_TO_LANG directly here used to leak
  // inactive locales (KE → 'sw'), making every internal link a /sw/* redirect.
  const lang = headersList.get('x-locale') || 'en'
  const city = headersList.get('x-vercel-ip-city') || ''

  // The Somali page is pinned to the Somalia market, priced in USD (Somalia is
  // USD-denominated), so pricing + demo currency don't follow the visitor's own
  // geo (a Somali-speaker browsing from Kenya should still see the Somalia offer,
  // not KSh). Every other locale stays geo-driven.
  const geoCountry = headersList.get('x-vercel-ip-country') || 'US'
  const countryCode = lang === 'so' ? 'SO' : geoCountry

  const country = COUNTRY_NAMES[countryCode] || countryCode
  const currency = lang === 'so' ? 'USD' : (COUNTRY_CURRENCY[countryCode] || 'USD')
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD
  const pricing = lang === 'so' ? PRICING_TIERS.DEFAULT : (PRICING_TIERS[countryCode] || PRICING_TIERS.DEFAULT)

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

  const activeSchemas = activeLandingSchemas(lang)

  return (
    <>
      {activeSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
      ))}
      <LandingClient geo={geo} lang={lang}/>
    </>
  )
}
