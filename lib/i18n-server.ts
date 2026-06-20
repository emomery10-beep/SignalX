// Server-only locale helpers for Server Components. Reads the x-locale header
// set by middleware (the URL-derived content locale). Client components use the
// LanguageProvider/useLang() instead — this module imports next/headers and must
// never be pulled into a client bundle.
import { headers } from 'next/headers'
import { resolveLocale, type Locale } from './i18n-locale'
import { t as catalogT } from './i18n-catalog'

export function getLocale(): Locale {
  const h = headers()
  return resolveLocale({
    urlLocale: h.get('x-locale'),
    country: h.get('x-vercel-ip-country'),
  })
}

// Bound translator for a Server Component: const t = getT(); t('errors.not_found_title')
export function getT(): (key: string, vars?: Record<string, string | number>) => string {
  const locale = getLocale()
  return (key, vars) => catalogT(locale, key, vars)
}

export type { Locale }
