// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW ONLY — geo → currency for the staff-screen demo (/preview/*).
//
// The pos-askbiz app is a separate Next project from the marketing site, so it
// can't import the site's lib/geo. This is a deliberately small, self-contained
// mirror of the pieces the preview needs: pick a currency from the visitor's
// location, and scale the mock catalogue (authored in ~USD/GBP units) up to a
// realistic local magnitude so KSh / ₦ / USh amounts look like real takings
// rather than a symbol swapped onto British-pound-sized numbers.
//
// Pure helpers only (no React, no 'use client') so preview-fixtures.ts can
// import scaleMoney without pulling in a client boundary. The React hook +
// selector live in preview-currency-ui.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export interface CurrencyMeta {
  sym: string
  flag: string
  // Multiplier from the catalogue's authored base unit (≈ 1 USD) to this
  // currency's typical magnitude. Roughly FX-aligned — exactness doesn't
  // matter, plausible order-of-magnitude does. 1 = keep base numbers as-is.
  factor: number
}

// Currencies the demo can render. Mirrors the served-market set in the site's
// lib/geo CURRENCIES, plus the factor used for magnitude scaling.
export const CURRENCY_META: Record<string, CurrencyMeta> = {
  KES: { sym: 'KSh', flag: '🇰🇪', factor: 155 },
  NGN: { sym: '₦',   flag: '🇳🇬', factor: 1550 },
  UGX: { sym: 'USh', flag: '🇺🇬', factor: 3800 },
  TZS: { sym: 'TSh', flag: '🇹🇿', factor: 2550 },
  GHS: { sym: '₵',   flag: '🇬🇭', factor: 15 },
  ZAR: { sym: 'R',   flag: '🇿🇦', factor: 18 },
  ETB: { sym: 'Br',  flag: '🇪🇹', factor: 130 },
  SOS: { sym: 'SOS', flag: '🇸🇴', factor: 570 },
  RWF: { sym: 'RF',  flag: '🇷🇼', factor: 1350 },
  ZMW: { sym: 'ZK',  flag: '🇿🇲', factor: 27 },
  USD: { sym: '$',   flag: '🇺🇸', factor: 1 },
  GBP: { sym: '£',   flag: '🇬🇧', factor: 1 },
  EUR: { sym: '€',   flag: '🇪🇺', factor: 1 },
  AED: { sym: 'AED', flag: '🇦🇪', factor: 3.7 },
  INR: { sym: '₹',   flag: '🇮🇳', factor: 84 },
}

export const DEFAULT_CURRENCY = 'KES'

// Country → currency (subset of the site's COUNTRY_CURRENCY covering the
// markets the demo cares about; unknowns fall back to DEFAULT_CURRENCY).
export const COUNTRY_CURRENCY: Record<string, string> = {
  KE: 'KES', NG: 'NGN', UG: 'UGX', TZ: 'TZS', GH: 'GHS', ZA: 'ZAR',
  ET: 'ETB', RW: 'RWF', ZM: 'ZMW', SO: 'SOS',
  US: 'USD', GB: 'GBP', AE: 'AED', IN: 'INR',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
}

// IANA timezone → currency, the no-network client fallback (mirrors the site's
// TZ_CURRENCY). Timezone is a decent proxy for country when we have no IP.
const TZ_CURRENCY: Record<string, string> = {
  'Africa/Nairobi': 'KES', 'Africa/Lagos': 'NGN', 'Africa/Kampala': 'UGX',
  'Africa/Dar_es_Salaam': 'TZS', 'Africa/Accra': 'GHS', 'Africa/Johannesburg': 'ZAR',
  'Africa/Addis_Ababa': 'ETB', 'Africa/Kigali': 'RWF', 'Africa/Lusaka': 'ZMW',
  'Europe/London': 'GBP', 'America/New_York': 'USD', 'America/Chicago': 'USD',
  'America/Los_Angeles': 'USD', 'Asia/Dubai': 'AED', 'Asia/Kolkata': 'INR',
  'Europe/Paris': 'EUR', 'Europe/Berlin': 'EUR', 'Europe/Madrid': 'EUR',
}

// Markets offered in the demo's currency selector, Africa-first to match the
// primary audience. Everything here must be a key of CURRENCY_META.
export const MARKETS: { code: string; currency: string; label: string }[] = [
  { code: 'SO', currency: 'SOS', label: 'Somalia' },
  { code: 'KE', currency: 'KES', label: 'Kenya' },
  { code: 'NG', currency: 'NGN', label: 'Nigeria' },
  { code: 'UG', currency: 'UGX', label: 'Uganda' },
  { code: 'TZ', currency: 'TZS', label: 'Tanzania' },
  { code: 'GH', currency: 'GHS', label: 'Ghana' },
  { code: 'ZA', currency: 'ZAR', label: 'South Africa' },
  { code: 'GB', currency: 'GBP', label: 'United Kingdom' },
  { code: 'US', currency: 'USD', label: 'United States' },
]

export interface PreviewCurrency {
  currency: string
  symbol: string
  flag: string
  factor: number
}

export function currencyToPreview(currency: string): PreviewCurrency {
  const meta = CURRENCY_META[currency] || CURRENCY_META[DEFAULT_CURRENCY]
  const code = CURRENCY_META[currency] ? currency : DEFAULT_CURRENCY
  return { currency: code, symbol: meta.sym, flag: meta.flag, factor: meta.factor }
}

// Round a scaled amount to a clean, locally-plausible increment so we never
// surface things like "KSh 6,975.30" — real till amounts land on round figures.
function roundNice(n: number): number {
  if (n >= 100000) return Math.round(n / 1000) * 1000
  if (n >= 10000)  return Math.round(n / 500) * 500
  if (n >= 1000)   return Math.round(n / 50) * 50
  if (n >= 100)    return Math.round(n / 10) * 10
  if (n >= 20)     return Math.round(n)
  return Math.round(n * 2) / 2   // keep small base-currency prices like 4.50
}

/** Scale an authored (≈USD) amount into the target currency's magnitude.
 *  factor 1 (USD/GBP/EUR) returns the value untouched so the existing
 *  base-currency demo renders exactly as before. */
export function scaleMoney(base: number, factor: number): number {
  if (factor === 1) return base
  return roundNice(base * factor)
}

/** Pick the demo currency, in priority order:
 *   1. ?currency=KES or ?country=KE  (explicit override — used for demo links)
 *   2. browser timezone              (no-network geo proxy)
 *   3. navigator.language country     (last-ditch)
 *   4. DEFAULT_CURRENCY (KES)          (Africa-first fallback)
 *  Synchronous and side-effect-free, so it paints instantly on first render. */
export function detectPreviewCurrency(search?: string): PreviewCurrency {
  if (typeof window === 'undefined') return currencyToPreview(DEFAULT_CURRENCY)

  const params = new URLSearchParams(search ?? window.location.search)
  const curParam = params.get('currency')?.toUpperCase()
  if (curParam && CURRENCY_META[curParam]) return currencyToPreview(curParam)
  const ctryParam = params.get('country')?.toUpperCase()
  if (ctryParam && COUNTRY_CURRENCY[ctryParam]) return currencyToPreview(COUNTRY_CURRENCY[ctryParam])

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && TZ_CURRENCY[tz]) return currencyToPreview(TZ_CURRENCY[tz])
  } catch { /* ignore */ }

  const cc = (navigator.language || '').split('-')[1]?.toUpperCase()
  if (cc && COUNTRY_CURRENCY[cc]) return currencyToPreview(COUNTRY_CURRENCY[cc])

  return currencyToPreview(DEFAULT_CURRENCY)
}
