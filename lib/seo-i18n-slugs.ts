// Single source of truth for the 13 Kenya/Africa SEO pages that get real
// per-locale static variants (not just the shallow "URL translated, content
// English" pattern used elsewhere on the site — see middleware.ts's carve-out
// and app/[locale]/[seoSlug]/page.tsx). Shared by middleware.ts (route
// exemption), the dynamic locale route (generateStaticParams), sitemap.ts,
// and each English page's hreflang alternates — keeping all four in sync.

export const STATIC_LOCALE_SEO_SLUGS = [
  'pos-system-kenya',
  'pos-system-africa',
  'best-pos-kenya',
  'retail-pos-kenya',
  'supermarket-pos-kenya',
  'pharmacy-pos-kenya',
  'restaurant-pos-kenya',
  'cloud-pos-kenya',
  'offline-pos-kenya',
  'kra-etims-pos',
  'mpesa-pos-integration',
  'ecommerce-pos-kenya',
  'inventory-management-kenya',
] as const

export type StaticLocaleSeoSlug = typeof STATIC_LOCALE_SEO_SLUGS[number]

const SITE = 'https://askbiz.co'

// Duplicated (not imported) from lib/seo-i18n/index.ts's READY_LOCALES on
// purpose: this file is imported by middleware.ts (Edge, every request) and
// app/sitemap.ts (revalidate: 0, so it re-runs on every fetch) — and
// lib/seo-i18n/index.ts pulls in ~700KB of translated page content just to
// expose a 6-string list. Keep these two lists in sync by hand; 'so' (Somali)
// stays out until its translation file is verified complete.
export const READY_SEO_LOCALES = ['es', 'fr', 'de', 'nl', 'ar', 'sw'] as const

// Reciprocal hreflang map for a given slug — English unprefixed, each ready
// locale under its /<locale>/ prefix. Used identically by the English flat
// page (app/<slug>/page.tsx) and the translated dynamic route
// (app/[locale]/[seoSlug]/page.tsx) so the cluster is always self-consistent.
// Only emits locales that actually resolve to a real page — a language not
// yet in READY_SEO_LOCALES simply doesn't get a hreflang entry (no
// point advertising a URL that would 404).
export function buildSeoHreflangMap(slug: string): Record<string, string> {
  const locales = ['en', ...READY_SEO_LOCALES] as const
  return Object.fromEntries(
    locales.map(l => [l, l === 'en' ? `${SITE}/${slug}` : `${SITE}/${l}/${slug}`])
  )
}
