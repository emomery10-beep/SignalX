import { Metadata } from 'next'
import LandingClient from '@/components/layout/LandingClient'
import { buildLandingMetadata, activeLandingSchemas } from '@/lib/landing-meta'
import { PREFIXED_LOCALES } from '@/lib/i18n-locale'

// ── Locale-prefixed homepages (/es /fr /de /nl /ar /sw /so) ─────────────────
// One statically-generated page per non-English active locale — the translated
// twins of the static English `/` (app/page.tsx). The locale comes from the URL
// segment (params.locale), NOT from the x-locale request header, so this route
// touches no dynamic API and Next.js can prerender + CDN-cache each variant.
// That is the whole point of this file: /sw and /so used to be rewritten onto
// the header-driven app/home-i18n route, which read headers() and so rendered
// dynamically (Cache-Control: private, no-store) on every request.
//
// Only the exact homepage URLs land here. Middleware still rewrites deeper
// locale-prefixed paths (/sw/blog, /es/pricing, …) onto the flat English route
// tree with x-locale injected; this dynamic segment only ever matches a single
// path segment, i.e. the homepage.
//
// Geo/currency/pricing personalization is deferred to the client exactly like
// the English page: LandingClient receives geo={null} and fetches /api/geo on
// mount (see LandingInner's `if (geo) return; fetch('/api/geo')` effect), so the
// server shell stays static. RTL for /ar is applied client-side by
// LanguageProvider (document.dir = 'rtl'), unchanged.
export const dynamic = 'force-static'
// Only the pre-listed locales are valid; any other single segment 404s instead
// of rendering the homepage under a bogus locale.
export const dynamicParams = false

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // Full per-locale SEO: translated title/description, self-canonical
  // (https://askbiz.co/<locale>) and the reciprocal hreflang set. These are the
  // canonical, indexable homepage variants listed in app/sitemap.ts.
  return buildLandingMetadata(params.locale)
}

export default function LocaleLandingPage({ params }: { params: { locale: string } }) {
  const locale = params.locale
  const activeSchemas = activeLandingSchemas(locale)
  return (
    <>
      {activeSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
      ))}
      <LandingClient geo={null} lang={locale}/>
    </>
  )
}
