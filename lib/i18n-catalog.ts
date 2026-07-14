// Server-side catalog API with guaranteed graceful fallback.
//
//   t('es', 'common.save')                     → "Guardar"
//   t('fr', 'common.greeting', { name: 'Lee' }) → interpolates {name}
//
// Fallback chain (the "never break another language" guarantee):
//   requested locale → English → the key itself.
//
// IMPORTANT: this module statically imports ALL locale chunks, so it must stay
// SERVER-ONLY. Client components must NOT import it — they receive the active
// locale as a prop and lazy-load others via lib/catalog-client.ts. Keeping every
// locale out of the client bundle is what fixes the homepage LCP (previously
// ~6.9MB of catalog shipped to every page). Only server files import this:
// app/layout.tsx, app/demo/[country], app/vs/*, app/blog/[slug], lib/email.ts.
import type { Lang } from '@/lib/i18n'
import { tFrom, tListFrom, isTranslatedIn, BASE, type LocaleDict } from '@/lib/i18n-catalog-core'

import en from '@/lib/catalog/en'
import es from '@/lib/catalog/es'
import fr from '@/lib/catalog/fr'
import de from '@/lib/catalog/de'
import nl from '@/lib/catalog/nl'
import ar from '@/lib/catalog/ar'
import sw from '@/lib/catalog/sw'
import so from '@/lib/catalog/so'

const CATALOG: Record<string, LocaleDict> = { en, es, fr, de, nl, ar, sw, so }

/** The active locale's dict, for handing to the client provider as a prop. */
export function getCatalog(locale: string): LocaleDict | undefined {
  return CATALOG[locale]
}

/** English dict — the universal client-side fallback for non-English pages. */
export const CATALOG_EN: LocaleDict = en

export function t(locale: string, key: string, vars?: Record<string, string | number>): string {
  return tFrom(CATALOG[locale], CATALOG[BASE], key, vars)
}

/** True when a key is genuinely translated in the locale (not falling back). */
export function hasTranslation(locale: string, key: string): boolean {
  return locale === BASE || isTranslatedIn(CATALOG[locale], key)
}

export function tList(locale: string, key: string): string[] {
  return tListFrom(CATALOG[locale], CATALOG[BASE], key)
}

export type { Lang }
