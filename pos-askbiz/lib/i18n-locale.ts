// Locale resolver for the POS app. The POS app is entirely authenticated (no
// public/SEO pages), so locale is COOKIE/preference-driven — no URL prefixing.
import { LANG_NAMES, LANG_FLAGS, COUNTRY_TO_LANG, isRTL as isRtlLang, type Lang } from './i18n'

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'ar' | 'sw'

export const ACTIVE_LOCALES: Locale[] = ['en', 'es', 'fr', 'de', 'nl', 'ar', 'sw']
export const DEFAULT_LOCALE: Locale = 'en'

export function isActiveLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (ACTIVE_LOCALES as string[]).includes(x)
}

export function isRTL(locale: string): boolean {
  return isRtlLang(locale.split(/[-_]/)[0] as Lang)
}

function toActive(x: unknown): Locale | undefined {
  if (typeof x !== 'string' || !x) return undefined
  const base = x.toLowerCase().split(/[-_]/)[0]
  return isActiveLocale(base) ? (base as Locale) : undefined
}

// Resolution priority: cookie (chosen) → profile → geo → Accept-Language → default.
export function resolveLocale(sources: {
  cookie?: string | null
  profile?: string | null
  country?: string | null
  acceptLanguage?: string | null
}): Locale {
  return (
    toActive(sources.cookie) ??
    toActive(sources.profile) ??
    toActive(sources.country ? COUNTRY_TO_LANG[sources.country.toUpperCase()] : undefined) ??
    toActive(sources.acceptLanguage?.split(',')[0]) ??
    DEFAULT_LOCALE
  )
}

// Labels for the POS language switcher — exactly the active set, display order.
export const LOCALE_LABELS: { locale: Locale; name: string; flag: string }[] =
  ACTIVE_LOCALES.map(l => ({ locale: l, name: LANG_NAMES[l as Lang], flag: LANG_FLAGS[l as Lang] }))

export type { Lang }
