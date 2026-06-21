// Locale resolver — the single source of truth for "what language is this?".
// Middleware, the locale provider, the switcher, and server components all defer
// here so the answer is consistent everywhere. Constrains to the active launch
// set; anything unknown falls back to the default.
//
// Launch set: en (base) · es · fr · de · nl · ar (RTL). Add a locale here +
// a catalogue folder + LOCALE_LABELS entry to roll it out.

import { LANG_NAMES, LANG_FLAGS, COUNTRY_TO_LANG, isRTL as isRtlLang, type Lang } from './i18n'

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'ar'

export const ACTIVE_LOCALES: Locale[] = ['en', 'es', 'fr', 'de', 'nl', 'ar']
export const DEFAULT_LOCALE: Locale = 'en'

export function isActiveLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (ACTIVE_LOCALES as string[]).includes(x)
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

const PREFIXED_LOCALES = ACTIVE_LOCALES.filter(l => l !== DEFAULT_LOCALE)

// Build the URL for the same page in another locale: strips any existing locale
// prefix, then adds the target's prefix (English stays unprefixed). Used by the
// switcher to navigate and by hreflang generation.
export function localePath(pathname: string, locale: Locale): string {
  const segs = pathname.split('/')
  if ((PREFIXED_LOCALES as string[]).includes(segs[1])) segs.splice(1, 1)
  const bare = segs.join('/') || '/'
  if (locale === DEFAULT_LOCALE) return bare
  return `/${locale}${bare === '/' ? '' : bare}`
}

// Labels for the language switcher — exactly the active set, in display order.
// (Fixes the stale dropdown: adds Nederlands, drops out-of-scope entries.)
export const LOCALE_LABELS: { locale: Locale; name: string; flag: string }[] =
  ACTIVE_LOCALES.map(l => ({ locale: l, name: LANG_NAMES[l as Lang], flag: LANG_FLAGS[l as Lang] }))

export type { Lang }
