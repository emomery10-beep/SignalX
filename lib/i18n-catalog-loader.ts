// Client-safe counterpart to lib/i18n-catalog.ts: instead of eagerly importing
// every locale's namespace set, this dynamically imports ONE locale's module at
// a time so webpack code-splits each language into its own chunk. Only the
// active locale (plus the English fallback layer) is ever fetched by a browser.
//
// LanguageProvider seeds itself synchronously from the server-rendered
// `initialCatalogs` prop (see lib/i18n-catalog.ts's getInitialCatalogs), then
// uses loadLocaleCatalog() here to fetch additional locales on demand — e.g.
// when the visitor manually switches language via LanguageToggle.

import type { Lang } from './i18n'

type Dict = Record<string, unknown>
type LocaleCatalog = Record<string, Dict>

const loaders: Record<string, () => Promise<{ default: LocaleCatalog }>> = {
  en: () => import('./i18n-catalog/en'),
  es: () => import('./i18n-catalog/es'),
  fr: () => import('./i18n-catalog/fr'),
  de: () => import('./i18n-catalog/de'),
  nl: () => import('./i18n-catalog/nl'),
  ar: () => import('./i18n-catalog/ar'),
  sw: () => import('./i18n-catalog/sw'),
}

const BASE: Lang = 'en'

// pt/it/nl-adjacent/etc. outside the 7 catalogued locales aren't in the
// namespace catalog (only in the small lib/i18n.ts landing-copy dictionary) —
// they fall back to the English catalog entirely, same as the server's CATALOG[locale] lookup miss.
export async function loadLocaleCatalog(lang: string): Promise<LocaleCatalog> {
  const load = loaders[lang] ?? loaders[BASE]
  const mod = await load()
  return mod.default
}

function resolveFrom(catalogs: Partial<Record<string, LocaleCatalog>>, locale: string, key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const dict = catalogs[locale]?.[ns]
  if (!dict) return undefined
  let node: unknown = dict
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

export function tFromCatalogs(catalogs: Partial<Record<string, LocaleCatalog>>, locale: string, key: string, vars?: Record<string, string | number>): string {
  let s = resolveFrom(catalogs, locale, key) ?? resolveFrom(catalogs, BASE, key) ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

export type { LocaleCatalog }
