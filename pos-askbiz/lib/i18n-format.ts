// Locale-aware formatters for the POS app — canonical replacement for hardcoded
// en-GB date/number formatting and bare currency-symbol literals.
import type { Lang } from './i18n'

export const LOCALE_TAG: Record<string, string> = {
  en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', nl: 'nl-NL', ar: 'ar',
  sw: 'sw-KE', pt: 'pt-BR', it: 'it-IT', pl: 'pl-PL',
}

function tag(locale: string): string {
  return LOCALE_TAG[locale] || 'en-GB'
}

// Arabic: force Western digits for business amounts (text still renders RTL).
function extra(locale: string): Intl.NumberFormatOptions {
  return locale === 'ar' ? { numberingSystem: 'latn' } : {}
}

export function formatNumber(locale: string, n: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(tag(locale), { ...extra(locale), ...opts }).format(n)
}

export function formatCurrency(locale: string, n: number, currency = 'GBP', opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(tag(locale), { style: 'currency', currency, ...extra(locale), ...opts }).format(n)
}

export function formatPercent(locale: string, fraction: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(tag(locale), { style: 'percent', maximumFractionDigits: 1, ...extra(locale), ...opts }).format(fraction)
}

export function formatDate(
  locale: string,
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  const d = date instanceof Date ? date : new Date(date)
  const o: Intl.DateTimeFormatOptions = locale === 'ar' ? { numberingSystem: 'latn', ...opts } : opts
  return new Intl.DateTimeFormat(tag(locale), o).format(d)
}

export function formatDateTime(locale: string, date: Date | string | number): string {
  return formatDate(locale, date, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export type { Lang }
