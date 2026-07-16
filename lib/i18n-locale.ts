// Locale resolver — the single source of truth for "what language is this?".
// Middleware, the locale provider, the switcher, and server components all defer
// here so the answer is consistent everywhere. Constrains to the active launch
// set; anything unknown falls back to the default.
//
// Launch set: en (base) · es · fr · de · nl · ar (RTL). Add a locale here +
// a catalogue folder + LOCALE_LABELS entry to roll it out.

import { LANG_NAMES, LANG_FLAGS, COUNTRY_TO_LANG, isRTL as isRtlLang, type Lang } from './i18n'

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'ar' | 'sw' | 'so'

export const ACTIVE_LOCALES: Locale[] = ['en', 'es', 'fr', 'de', 'nl', 'ar', 'sw', 'so']
export const DEFAULT_LOCALE: Locale = 'en'

export function isActiveLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (ACTIVE_LOCALES as string[]).includes(x)
}

// Narrow any Lang to an active Locale — languages we can detect/redirect from
// but haven't launched UI translations for (pt/it/pl) fall back to the default.
export function toLocale(lang: Lang): Locale {
  return isActiveLocale(lang) ? lang : DEFAULT_LOCALE
}

// Authenticated app routes (the signed-in shell). These render in the user's
// CHOSEN language from the cookie/profile — not the URL — because they're
// per-user and not SEO-indexed, so they need no locale prefix. Public/marketing
// routes stay URL-driven (English unprefixed, others prefixed) for caching + SEO.
export const APP_ROUTES = [
  '/home', '/ask', '/chat', '/intelligence', '/files', '/alerts',
  '/forecasts', '/templates', '/admin', '/sources', '/billing', '/onboarding',
  '/settings', '/expansion', '/invite', '/pos', '/tools', '/shipments',
]

// True if the path (with any locale prefix stripped) is an authenticated app route.
export function isAppPath(pathname: string): boolean {
  const segs = pathname.split('/')
  const path = (ACTIVE_LOCALES as string[]).includes(segs[1]) && segs[1] !== DEFAULT_LOCALE
    ? '/' + segs.slice(2).join('/')
    : pathname
  return APP_ROUTES.some(r => path === r || path.startsWith(r + '/'))
}

// Single source of RTL truth is RTL_LANGS in lib/i18n.ts (via isRtlLang).
export function isRTL(locale: string): boolean {
  return isRtlLang(locale.split(/[-_]/)[0] as Lang)
}

// Coerce any candidate (e.g. "es-MX", "EN", "de_DE") to an active locale, or undefined.
function toActive(x: unknown): Locale | undefined {
  if (typeof x !== 'string' || !x) return undefined
  const base = x.toLowerCase().split(/[-_]/)[0]
  return isActiveLocale(base) ? (base as Locale) : undefined
}

// Resolution priority. First source that yields an active locale wins.
//   1. URL prefix (/es/…)   — explicit, set by the user navigating
//   2. cookie               — remembered choice for guests
//   3. profile              — the signed-in user's saved preference
//   4. geo country          — first-visit best guess
//   5. Accept-Language       — browser preference
//   6. default (en)
export function resolveLocale(sources: {
  urlLocale?: string | null
  cookie?: string | null
  profile?: string | null
  country?: string | null
  acceptLanguage?: string | null
}): Locale {
  return (
    toActive(sources.urlLocale) ??
    toActive(sources.cookie) ??
    toActive(sources.profile) ??
    toActive(sources.country ? COUNTRY_TO_LANG[sources.country.toUpperCase()] : undefined) ??
    toActive(sources.acceptLanguage?.split(',')[0]) ??
    DEFAULT_LOCALE
  )
}

export const PREFIXED_LOCALES = ACTIVE_LOCALES.filter(l => l !== DEFAULT_LOCALE)

// Build the URL for the same page in another locale: strips any existing locale
// prefix, then adds the target's prefix (English stays unprefixed). Preserves any
// ?query and #hash so the switcher doesn't drop pagination/filter/anchor state.
// Used by the switcher to navigate and by hreflang generation.
export function localePath(pathname: string, locale: Locale): string {
  const hashAt = pathname.indexOf('#')
  const hash = hashAt >= 0 ? pathname.slice(hashAt) : ''
  const beforeHash = hashAt >= 0 ? pathname.slice(0, hashAt) : pathname
  const queryAt = beforeHash.indexOf('?')
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : ''
  const path = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash

  const segs = path.split('/')
  if ((PREFIXED_LOCALES as string[]).includes(segs[1])) segs.splice(1, 1)
  const bare = segs.join('/') || '/'
  const localized = locale === DEFAULT_LOCALE ? bare : `/${locale}${bare === '/' ? '' : bare}`
  return localized + query + hash
}

// Labels for the language switcher — exactly the active set, in display order.
// (Fixes the stale dropdown: adds Nederlands, drops out-of-scope entries.)
export const LOCALE_LABELS: { locale: Locale; name: string; flag: string }[] =
  ACTIVE_LOCALES.map(l => ({ locale: l, name: LANG_NAMES[l as Lang], flag: LANG_FLAGS[l as Lang] }))

export type { Lang }
