// Locale-aware formatters — the canonical replacement for hardcoded
// en-GB date/number formatting and bare currency-symbol literals across the app.
// The self-audit (scripts/i18n-audit.mjs) flags those raw literals and points here.
// Pure, no side effects, safe in server and client components.
//
//   formatCurrency('de', 1234.5, 'EUR')  →  "1.234,50 €"
//   formatNumber('fr', 1234.5)           →  "1 234,5"
//   formatDate('es', someDate)           →  "20 jun 2026"

import type { Lang } from './i18n'

// BCP-47 tags Intl understands, per app locale. Launch set: en es fr de nl ar.
export const LOCALE_TAG: Record<string, string> = {
  en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', nl: 'nl-NL', ar: 'ar',
  // available but not in the current launch set
  sw: 'sw-KE', pt: 'pt-BR', it: 'it-IT', pl: 'pl-PL',
}

function tag(locale: string): string {
  return LOCALE_TAG[locale] || 'en-GB'
}

// BCP-47 tag for speech synthesis — same as the format tag, except Arabic needs a
// regional voice (ar-SA) where the format tag stays the script-only 'ar'. Derived
// from LOCALE_TAG so there's one source of truth, not a hand-synced copy.
const VOICE_TAG_OVERRIDES: Record<string, string> = { ar: 'ar-SA' }

export function voiceTag(locale: string): string {
  return VOICE_TAG_OVERRIDES[locale] || tag(locale)
}

// Arabic locales default to Arabic-Indic digits; business amounts read clearer
// with Western digits, so force latn for ar. (Text still renders RTL.)
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
  return formatDate(locale, date, {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// Locale-aware list collation (for sorting names, products, etc.)
export function collator(locale: string): Intl.Collator {
  return new Intl.Collator(tag(locale), { numeric: true, sensitivity: 'base' })
}

export type { Lang }
