import { serperSearch, serperAnswer } from '@/lib/serper'

// Nisab thresholds — the standard weight-based minimums (612.36g silver /
// 87.48g gold). Silver is the conventional default since it's the lower
// bar, letting more zakat flow to recipients.
export const NISAB_GRAMS = { gold: 87.48, silver: 612.36 } as const

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
 *
 * `isoCurrency` must be a real ISO 4217 code (e.g. "KES") — pass
 * `profiles.currency` (via getUserLocale), not a display symbol. An
 * earlier version of this derived the currency from `country_code` via a
 * country→currency guess-map, but `country_code` is never actually
 * populated by onboarding (confirmed by audit), so it always fell through
 * to a raw symbol like "KSh" — ambiguous in search (could read as Kenyan
 * or Somali shilling) and silently missing ~15 African countries the map
 * didn't cover. profiles.currency is set directly during onboarding from
 * phone/IP geo-detection and needs no guessing.
 */
export async function fetchNisabPrice(
  metal: 'gold' | 'silver',
  isoCurrency: string
): Promise<NisabPriceResult | null> {
  const currency = isoCurrency
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
