import { Metadata } from 'next'
import LandingClient from '@/components/layout/LandingClient'
import { buildLandingMetadata, activeLandingSchemas } from '@/lib/landing-meta'

// ── Bare `/` — English homepage, statically generated ───────────────────────
// This route must stay free of dynamic APIs (headers()/cookies()/searchParams)
// so Next.js can statically generate + cache it — the overwhelming majority of
// real traffic (and all AI-crawler traffic) hits this exact URL. Locale is
// always 'en' here: middleware only reaches this file for unprefixed requests,
// and locale-prefixed requests (/es, /sw, …) are rewritten to
// app/home-i18n/page.tsx instead (see middleware.ts), which keeps the
// x-locale/geo-header-driven dynamic rendering those variants still need.
//
// `force-static` is explicit, not just aspirational: without it Next still
// marked this route dynamic (ƒ) at build time even though nothing here reads
// a dynamic API — verified by adding this flag and confirming the build
// throws no "Dynamic server usage" error (which it would if headers/cookies/
// searchParams were actually touched anywhere in this render tree).
export const dynamic = 'force-static'
//
// Geo-based pricing/currency personalization (previously read from
// x-vercel-ip-country/city headers here) is handled client-side: LandingClient
// already falls back to fetching /api/geo on mount when it receives geo=null
// (see LandingInner's `if (geo) return; fetch('/api/geo')...` effect), so
// personalization still happens — just after hydration instead of on the
// server, which is what makes this render static.
//
// Auth-callback query params (?code=, ?token_hash=&type=, Shopify install
// redirects) that this page used to read via `searchParams` and redirect on
// are now handled by middleware.ts before the request ever reaches this file
// — reading `searchParams` here would itself force this route back into
// dynamic rendering.
export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata('en')
}

const activeSchemas = activeLandingSchemas('en')

export default function LandingPage() {
  return (
    <>
      {activeSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
      ))}
      <LandingClient geo={null} lang="en"/>
    </>
  )
}
