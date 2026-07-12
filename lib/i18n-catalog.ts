// Catalog-backed translation lookup with guaranteed graceful fallback.
//
//   t('es', 'common.save')                    → "Guardar"
//   t('de', 'common.save_changes')            → "Änderungen speichern"
//   t('fr', 'common.greeting', { name: 'Lee' })→ interpolates {name}
//
// Fallback chain (this is the "never break another language" guarantee):
//   requested locale → English → the key itself
// A missing translation shows English, never a crash or a blank. The self-audit
// (catalogue-parity gate) reports which keys are still falling back so they can
// be filled in, but the app keeps working in the meantime.
//
// Keys are "<namespace>.<path>", where namespace maps to locales/<loc>/<ns>.json.
// To add a namespace: create the JSON in every locale folder, add the import to
// lib/i18n-catalog/<loc>.ts (all 7 locales), and register it in that file's
// CATALOG_<LOC> object. The audit then enforces parity automatically.
//
// Server-only module: this eagerly imports every locale's full namespace set,
// which is fine for server components (never shipped to the client) but must
// never be imported from a 'use client' file — that would re-bundle every
// language into the browser payload. Client components go through
// LanguageProvider, which lazy-loads one locale at a time via
// lib/i18n-catalog-loader.ts instead.

import type { Lang } from './i18n'
import en from './i18n-catalog/en'
import es from './i18n-catalog/es'
import fr from './i18n-catalog/fr'
import de from './i18n-catalog/de'
import nl from './i18n-catalog/nl'
import ar from './i18n-catalog/ar'
import sw from './i18n-catalog/sw'

type Dict = Record<string, unknown>

const CATALOG: Record<string, Record<string, Dict>> = { en, es, fr, de, nl, ar, sw } as Record<string, Record<string, Dict>>

const BASE = 'en'

function resolve(locale: string, key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const dict = CATALOG[locale]?.[ns]
  if (!dict) return undefined
  // walk the remaining dotted path for nested namespaces
  let node: unknown = dict
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

export function t(locale: string, key: string, vars?: Record<string, string | number>): string {
  let s = resolve(locale, key) ?? resolve(BASE, key) ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

// Returns true when a key is genuinely translated in the locale (not falling back).
export function hasTranslation(locale: string, key: string): boolean {
  return locale === BASE || resolve(locale, key) !== undefined
}

// t() only ever returns strings — this is the array-returning sibling, for list-shaped
// content (e.g. a plan's feature list) that doesn't fit the scalar resolve() path.
export function tList(locale: string, key: string): string[] {
  const dot = key.indexOf('.')
  if (dot === -1) return []
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const pick = (loc: string): string[] | undefined => {
    let node: unknown = CATALOG[loc]?.[ns]
    for (const seg of path.split('.')) {
      if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
      else return undefined
    }
    return Array.isArray(node) ? (node as string[]) : undefined
  }
  return pick(locale) ?? pick(BASE) ?? []
}

// Server-side helper for seeding the client LanguageProvider: returns only the
// English fallback layer plus the requested locale (never the full 7-locale
// CATALOG), so the RSC payload carries one language's worth of strings instead
// of all of them. English must be included synchronously here (not lazy-loaded
// client-side) because LanguageProvider is SSR'd too — without it, any key
// missing from the active locale would render as its raw key in the actual
// server-rendered HTML (seen by users and crawlers before hydration), breaking
// the "missing translation shows English, never a blank" guarantee above.
// Used by app/layout.tsx, app/page.tsx, and any page that mounts
// ScopedLangProvider for a fixed locale.
export function getInitialCatalogs(locale: string): Partial<Record<Lang, Record<string, Dict>>> {
  const result: Partial<Record<Lang, Record<string, Dict>>> = { en: CATALOG.en }
  if (locale !== BASE && CATALOG[locale]) result[locale as Lang] = CATALOG[locale]
  return result
}

export type { Lang }
