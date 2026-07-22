import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SeoPage from '@/components/SeoPage'
import { localePath, type Locale } from '@/lib/i18n-locale'
import { STATIC_LOCALE_SEO_SLUGS, buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'
import { READY_LOCALES, getSeoI18nEntry, type ReadyLocale } from '@/lib/seo-i18n'

// Real, statically-generated per-locale variants of the 13 Kenya/Africa SEO
// pages (see lib/seo-i18n-slugs.ts) — self-canonical, reciprocal hreflang,
// translated content. Deliberately NOT header/x-locale driven: the locale
// comes from the URL segment (params.locale), known at build time, so this
// stays fully static/CDN-cacheable like app/[locale]/page.tsx (the homepage)
// — see middleware.ts's carve-out for why these paths skip the generic
// flat-rewrite-with-header treatment every other locale-prefixed path gets.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return READY_LOCALES.flatMap(locale =>
    STATIC_LOCALE_SEO_SLUGS.map(seoSlug => ({ locale, seoSlug }))
  )
}

function resolve(params: { locale: string; seoSlug: string }) {
  if (!(READY_LOCALES as readonly string[]).includes(params.locale)) return null
  if (!(STATIC_LOCALE_SEO_SLUGS as readonly string[]).includes(params.seoSlug)) return null
  const entry = getSeoI18nEntry(params.seoSlug, params.locale)
  return entry ? { entry, locale: params.locale as ReadyLocale, slug: params.seoSlug } : null
}

export async function generateMetadata({ params }: { params: { locale: string; seoSlug: string } }): Promise<Metadata> {
  const resolved = resolve(params)
  if (!resolved) return {}
  const { entry, locale, slug } = resolved
  const base = 'https://askbiz.co'
  const path = `${base}/${locale}/${slug}`
  return {
    title: entry.meta.title,
    description: entry.meta.description,
    keywords: entry.meta.keywords,
    openGraph: { title: entry.meta.ogTitle, description: entry.meta.ogDescription, url: path },
    alternates: { canonical: path, languages: buildSeoHreflangMap(slug) },
  }
}

export default function Page({ params }: { params: { locale: string; seoSlug: string } }) {
  const resolved = resolve(params)
  if (!resolved) notFound()
  const { entry, locale } = resolved
  const relatedPages = entry.relatedPages.map(p => ({ ...p, href: localePath(p.href, locale as Locale) }))
  return <SeoPage {...entry} relatedPages={relatedPages} lang={locale as Locale} />
}
