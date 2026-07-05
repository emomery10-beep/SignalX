// ─────────────────────────────────────────────────────────────────────────────
// Registry for the per-country live-demo pages (app/demo/[country]).
// One entry per African market: ties a COUNTRY_HUBS slug (for the SEO copy) to
// its ISO code, currency (→ symbol + magnitude factor from lib/geo), the demo
// widget's language, and the local payment method named in the intro.
//
// Language is limited to the ACTIVE locales (en/fr/ar/sw here); markets whose
// native language isn't installed (Amharic, Portuguese, Somali, …) fall back to
// English by design — see the coverage matrix in the build notes.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from './i18n-locale'
import { CURRENCIES, COUNTRY_CURRENCY } from './geo'
import { COUNTRY_HUBS, type CountryHub } from './country-hub-content'

interface RawMarket {
  slug: string          // must match a COUNTRY_HUBS slug
  code: string          // ISO 3166-1 alpha-2
  lang: Locale          // demo widget language (an ACTIVE locale)
  localPayment: string  // named in the localized intro line
}

// Africa-first, grouped by region. Currency is derived from COUNTRY_CURRENCY.
const RAW_MARKETS: RawMarket[] = [
  // East Africa
  { slug: 'kenya',        code: 'KE', lang: 'sw', localPayment: 'M-Pesa' },
  { slug: 'tanzania',     code: 'TZ', lang: 'sw', localPayment: 'M-Pesa & Tigo Pesa' },
  { slug: 'uganda',       code: 'UG', lang: 'en', localPayment: 'MTN MoMo & Airtel Money' },
  { slug: 'ethiopia',     code: 'ET', lang: 'en', localPayment: 'telebirr' },
  { slug: 'rwanda',       code: 'RW', lang: 'en', localPayment: 'MoMo & Airtel Money' },
  { slug: 'somalia',      code: 'SO', lang: 'en', localPayment: 'EVC Plus & Zaad' },
  { slug: 'djibouti',     code: 'DJ', lang: 'fr', localPayment: 'D-Money' },
  { slug: 'eritrea',      code: 'ER', lang: 'en', localPayment: 'cash' },
  // West Africa
  { slug: 'nigeria',      code: 'NG', lang: 'en', localPayment: 'bank transfer & cash' },
  { slug: 'ghana',        code: 'GH', lang: 'en', localPayment: 'Mobile Money (MoMo)' },
  { slug: 'senegal',      code: 'SN', lang: 'fr', localPayment: 'Orange Money & Wave' },
  { slug: 'ivory-coast',  code: 'CI', lang: 'fr', localPayment: 'Mobile Money & Wave' },
  { slug: 'mali',         code: 'ML', lang: 'fr', localPayment: 'Orange Money' },
  { slug: 'burkina-faso', code: 'BF', lang: 'fr', localPayment: 'Orange Money & Moov' },
  { slug: 'niger',        code: 'NE', lang: 'fr', localPayment: 'Mobile Money' },
  { slug: 'guinea',       code: 'GN', lang: 'fr', localPayment: 'Orange Money' },
  { slug: 'sierra-leone', code: 'SL', lang: 'en', localPayment: 'Orange Money & Africell' },
  { slug: 'liberia',      code: 'LR', lang: 'en', localPayment: 'MoMo & cash' },
  { slug: 'togo',         code: 'TG', lang: 'fr', localPayment: 'T-Money & Flooz' },
  // Central Africa
  { slug: 'cameroon',     code: 'CM', lang: 'fr', localPayment: 'MTN MoMo & Orange Money' },
  { slug: 'gabon',        code: 'GA', lang: 'fr', localPayment: 'Airtel Money & Moov Money' },
  { slug: 'republic-of-congo', code: 'CG', lang: 'fr', localPayment: 'MTN MoMo & Airtel Money' },
  { slug: 'chad',         code: 'TD', lang: 'fr', localPayment: 'Airtel Money & Moov' },
  { slug: 'central-african-republic', code: 'CF', lang: 'fr', localPayment: 'Orange Money' },
  { slug: 'democratic-republic-of-congo', code: 'CD', lang: 'fr', localPayment: 'M-Pesa & Orange Money' },
  // North Africa
  { slug: 'egypt',        code: 'EG', lang: 'ar', localPayment: 'InstaPay & Vodafone Cash' },
  { slug: 'morocco',      code: 'MA', lang: 'fr', localPayment: 'cash & card' },
  { slug: 'tunisia',      code: 'TN', lang: 'fr', localPayment: 'D17 & cash' },
  { slug: 'algeria',      code: 'DZ', lang: 'fr', localPayment: 'CIB & cash' },
  { slug: 'libya',        code: 'LY', lang: 'ar', localPayment: 'cash' },
  { slug: 'sudan',        code: 'SD', lang: 'ar', localPayment: 'Bankak & cash' },
  // Southern Africa
  { slug: 'south-africa', code: 'ZA', lang: 'en', localPayment: 'card, SnapScan & cash' },
  { slug: 'zambia',       code: 'ZM', lang: 'en', localPayment: 'MTN MoMo & Airtel Money' },
  { slug: 'zimbabwe',     code: 'ZW', lang: 'en', localPayment: 'EcoCash' },
  { slug: 'malawi',       code: 'MW', lang: 'en', localPayment: 'Airtel Money & Mpamba' },
  { slug: 'mozambique',   code: 'MZ', lang: 'en', localPayment: 'M-Pesa & e-Mola' },
  { slug: 'angola',       code: 'AO', lang: 'en', localPayment: 'Multicaixa Express' },
  { slug: 'madagascar',   code: 'MG', lang: 'fr', localPayment: 'MVola & Orange Money' },
  { slug: 'botswana',     code: 'BW', lang: 'en', localPayment: 'Orange Money & cash' },
  { slug: 'namibia',      code: 'NA', lang: 'en', localPayment: 'cash & card' },
  { slug: 'lesotho',      code: 'LS', lang: 'en', localPayment: 'M-Pesa & EcoCash' },
  { slug: 'eswatini',     code: 'SZ', lang: 'en', localPayment: 'MoMo & cash' },
]

export interface DemoMarket extends RawMarket {
  currency: string          // ISO code, key of CURRENCIES
  symbol: string
  flag: string
  hub: CountryHub
}

// Only markets that have a matching hub (SEO copy), a mapped currency, and that
// currency present in CURRENCIES. Anything missing is dropped with a warning so
// a typo can't silently ship a broken page.
export const DEMO_MARKETS: DemoMarket[] = RAW_MARKETS.flatMap((m) => {
  const hub = COUNTRY_HUBS.find((h) => h.slug === m.slug)
  const currency = COUNTRY_CURRENCY[m.code]
  const meta = currency ? CURRENCIES[currency] : undefined
  if (!hub || !currency || !meta) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[demo-markets] skipping ${m.slug}: hub=${!!hub} currency=${currency} meta=${!!meta}`)
    }
    return []
  }
  return [{ ...m, currency, symbol: meta.sym, flag: hub.flag, hub }]
})

const BY_SLUG = new Map(DEMO_MARKETS.map((m) => [m.slug, m]))

export function getDemoMarket(slug: string): DemoMarket | undefined {
  return BY_SLUG.get(slug)
}

export const DEMO_MARKET_SLUGS = DEMO_MARKETS.map((m) => m.slug)
