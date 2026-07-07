import { serperSearch, serperAnswer } from '@/lib/serper'

// Nisab thresholds — the standard weight-based minimums (612.36g silver /
// 87.48g gold). Silver is the conventional default since it's the lower
// bar, letting more zakat flow to recipients.
export const NISAB_GRAMS = { gold: 87.48, silver: 612.36 } as const

// ISO 4217 currency code by ISO country code — makes the search query
// unambiguous ("KES" resolves far more reliably than the symbol "KSh").
// Not exhaustive: falls back to the profile's currency_symbol for any
// country missing here, which still works, just less precisely.
const CURRENCY_BY_COUNTRY: Record<string, string> = {
  KE: 'KES', NG: 'NGN', GH: 'GHS', ZA: 'ZAR', TZ: 'TZS', UG: 'UGX',
  ET: 'ETB', EG: 'EGP', MA: 'MAD', RW: 'RWF', ZM: 'ZMW', MW: 'MWK',
  SN: 'XOF', CI: 'XOF', BF: 'XOF', ML: 'XOF', NE: 'XOF', BJ: 'XOF', TG: 'XOF',
  CM: 'XAF', TD: 'XAF', GA: 'XAF', CG: 'XAF', GQ: 'XAF', CF: 'XAF',
  SL: 'SLE', LR: 'LRD', MZ: 'MZN', MG: 'MGA', ZW: 'ZWG', AO: 'AOA',
  CD: 'CDF', TN: 'TND', DZ: 'DZD', GN: 'GNF', SO: 'SOS', DJ: 'DJF',
  ER: 'ERN', NA: 'NAD', BW: 'BWP', SZ: 'SZL', LS: 'LSL', KM: 'KMF',
  MU: 'MUR', SC: 'SCR', SD: 'SDG', LY: 'LYD',
}

export interface NisabPriceResult {
  metal: 'gold' | 'silver'
  pricePerGram: number
  nisabValue: number
  currency: string
  checkedAt: string
}

/**
 * On-demand only — callers must gate this behind an explicit user action.
 * Never poll or schedule this; that's the whole point of checking live
 * metal prices via search instead of a paid market-data subscription.
 */
export async function fetchNisabPrice(
  metal: 'gold' | 'silver',
  countryCode: string | null,
  currencySymbol: string
): Promise<NisabPriceResult | null> {
  const currency = (countryCode && CURRENCY_BY_COUNTRY[countryCode.toUpperCase()]) || currencySymbol
  const query = `price of 1 gram of ${metal} in ${currency}`

  const res = await serperSearch(query, { num: 3 })
  const answer = serperAnswer(res)
  const pricePerGram = extractPrice(answer, currency)
  if (pricePerGram == null) return null

  const grams = NISAB_GRAMS[metal]
  return {
    metal,
    pricePerGram,
    nisabValue: Math.round(pricePerGram * grams * 100) / 100,
    currency,
    checkedAt: new Date().toISOString(),
  }
}

// Free-text search snippets can contain several number-shaped substrings
// (a percentage change, a year, the price itself) — matching the first one
// isn't reliable. Two passes: prefer a number sitting right next to the
// currency code we searched for (very likely the actual price, since that's
// how these answers are phrased); otherwise fall back to the LARGEST number
// in the text, since a per-gram metal price in a local currency is almost
// always much bigger than a percentage or a year.
function extractPrice(text: string, currency: string): number | null {
  if (!text) return null
  const numPattern = '\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?'
  const escapedCurrency = currency.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const nearCurrency = new RegExp(
    `(?:${escapedCurrency}\\s*(${numPattern}))|(?:(${numPattern})\\s*${escapedCurrency})`,
    'i'
  )
  const near = text.match(nearCurrency)
  const nearValue = near ? parseNum(near[1] || near[2]) : null
  if (nearValue != null) return nearValue

  const matches = text.match(new RegExp(numPattern, 'g')) || []
  const candidates = matches.map(parseNum).filter((n): n is number => n != null)
  return candidates.length ? Math.max(...candidates) : null
}

function parseNum(raw: string | undefined): number | null {
  if (!raw) return null
  const num = parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(num) && num > 0 ? num : null
}
