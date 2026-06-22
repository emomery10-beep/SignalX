// Server-only locale helpers for the POS app's Server Components. Cookie-driven
// (the app is all-authenticated). Client components use useLang() instead.
import { cookies, headers } from 'next/headers'
import { resolveLocale, type Locale } from './i18n-locale'
import { t as catalogT } from './i18n-catalog'

export function getLocale(): Locale {
  const c = cookies()
  const h = headers()
  return resolveLocale({
    cookie: c.get('askbiz_lang')?.value,
    country: h.get('x-vercel-ip-country'),
  })
}

export function getT(): (key: string, vars?: Record<string, string | number>) => string {
  const locale = getLocale()
  return (key, vars) => catalogT(locale, key, vars)
}

export type { Locale }
