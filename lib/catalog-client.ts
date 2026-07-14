// Client-side lazy loader for locale catalogs.
//
// Each `import('@/lib/catalog/<locale>')` is a STATIC dynamic import, so webpack
// emits one chunk per locale. A page therefore downloads only the locale(s) it
// actually renders instead of the whole 8-locale catalog. The active locale is
// primed synchronously from a server-rendered prop (see LanguageProvider), so
// initial paint never waits on a fetch; only client-side locale *switches* load
// a new chunk on demand.

import type { LocaleDict } from '@/lib/i18n-catalog-core'

const cache: Record<string, LocaleDict> = {}

/** Seed the cache with a dict already delivered by the server (no fetch). */
export function primeLocale(locale: string, dict: LocaleDict | undefined): void {
  if (dict && !cache[locale]) cache[locale] = dict
}

export function getCachedLocale(locale: string): LocaleDict | undefined {
  return cache[locale]
}

/** Load a locale's catalog chunk on demand, caching the result. */
export async function loadLocale(locale: string): Promise<LocaleDict> {
  if (cache[locale]) return cache[locale]
  let mod: { default: LocaleDict }
  switch (locale) {
    case 'es': mod = await import('@/lib/catalog/es'); break
    case 'fr': mod = await import('@/lib/catalog/fr'); break
    case 'de': mod = await import('@/lib/catalog/de'); break
    case 'nl': mod = await import('@/lib/catalog/nl'); break
    case 'ar': mod = await import('@/lib/catalog/ar'); break
    case 'sw': mod = await import('@/lib/catalog/sw'); break
    case 'so': mod = await import('@/lib/catalog/so'); break
    case 'en':
    default:  mod = await import('@/lib/catalog/en'); break
  }
  cache[locale] = mod.default
  return mod.default
}
