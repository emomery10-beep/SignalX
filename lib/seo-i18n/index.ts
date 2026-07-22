// Combines the per-language translation files into one lookup keyed by
// [slug][locale], consumed by app/[locale]/[seoSlug]/page.tsx. Each language
// file is independently authored (see lib/seo-i18n/<lang>.ts) — this file's
// only job is wiring them together.
//
// The ready-locale list itself lives in lib/seo-i18n-slugs.ts (READY_SEO_LOCALES),
// not here — that file is imported by middleware.ts (Edge) and app/sitemap.ts
// (revalidate: 0), and needs the list WITHOUT pulling in the ~700KB of actual
// translated content this file imports. This file re-exports the same list
// under the established name so the page route only needs one import path.

import type { SeoI18nEntry } from './de'
import { de } from './de'
import { es } from './es'
import { fr } from './fr'
import { nl } from './nl'
import { ar } from './ar'
import { sw } from './sw'
import { so } from './so'
import { READY_SEO_LOCALES } from '@/lib/seo-i18n-slugs'

export type { SeoI18nEntry }

export const READY_LOCALES = READY_SEO_LOCALES
export type ReadyLocale = typeof READY_LOCALES[number]

const BY_LOCALE: Record<ReadyLocale, Record<string, SeoI18nEntry>> = { de, es, fr, nl, ar, sw, so }

export function getSeoI18nEntry(slug: string, locale: string): SeoI18nEntry | undefined {
  if (!(READY_LOCALES as readonly string[]).includes(locale)) return undefined
  return BY_LOCALE[locale as ReadyLocale]?.[slug]
}
