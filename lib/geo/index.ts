// ============================================================
// SignalX Geolocation Engine
// IP → country → currency + sector hints + trends
// ============================================================

export interface GeoResult {
  country: string
  countryCode: string
  city: string
  region: string
  currency: string
  currencySymbol: string
  currencyName: string
  locale: string
  sectorHints: string
  trendTopics: string[]
  pricingTier: 'africa' | 'emerging' | 'developed'
  flag: string
}

// ── Currency map ──────────────────────────────────────────────
export const CURRENCIES: Record<string, { sym: string; name: string; flag: string; locale: string }> = {
  KES: { sym: 'KSh', name: 'Kenyan Shilling',     flag: '🇰🇪', locale: 'sw-KE' },
  NGN: { sym: '₦',   name: 'Nigerian Naira',       flag: '🇳🇬', locale: 'en-NG' },
  ZAR: { sym: 'R',   name: 'South African Rand',   flag: '🇿🇦', locale: 'en-ZA' },
  UGX: { sym: 'USh', name: 'Ugandan Shilling',     flag: '🇺🇬', locale: 'sw-UG' },
  TZS: { sym: 'TSh', name: 'Tanzanian Shilling',   flag: '🇹🇿', locale: 'sw-TZ' },
  GHS: { sym: '₵',   name: 'Ghanaian Cedi',        flag: '🇬🇭', locale: 'en-GH' },
  ETB: { sym: 'Br',  name: 'Ethiopian Birr',       flag: '🇪🇹', locale: 'am-ET' },
  RWF: { sym: 'RF',  name: 'Rwandan Franc',        flag: '🇷🇼', locale: 'rw-RW' },
  ZMW: { sym: 'ZK',  name: 'Zambian Kwacha',       flag: '🇿🇲', locale: 'en-ZM' },
  USD: { sym: '$',   name: 'US Dollar',            flag: '🇺🇸', locale: 'en-US' },
  GBP: { sym: '£',   name: 'British Pound',        flag: '🇬🇧', locale: 'en-GB' },
  EUR: { sym: '€',   name: 'Euro',                 flag: '🇪🇺', locale: 'en-EU' },
  AED: { sym: 'AED', name: 'UAE Dirham',           flag: '🇦🇪', locale: 'ar-AE' },
  INR: { sym: '₹',   name: 'Indian Rupee',         flag: '🇮🇳', locale: 'en-IN' },
  CAD: { sym: 'CA$', name: 'Canadian Dollar',      flag: '🇨🇦', locale: 'en-CA' },
  AUD: { sym: 'A$',  name: 'Australian Dollar',    flag: '🇦🇺', locale: 'en-AU' },
  SGD: { sym: 'S$',  name: 'Singapore Dollar',     flag: '🇸🇬', locale: 'en-SG' },
  MXN: { sym: 'MX$', name: 'Mexican Peso',         flag: '🇲🇽', locale: 'es-MX' },
  BRL: { sym: 'R$',  name: 'Brazilian Real',       flag: '🇧🇷', locale: 'pt-BR' },
  ZWL: { sym: 'ZWL', name: 'Zimbabwean Dollar',    flag: '🇿🇼', locale: 'en-ZW' },
}

// ── Country → currency ────────────────────────────────────────
export const COUNTRY_CURRENCY: Record<string, string> = {
  KE: 'KES', NG: 'NGN', ZA: 'ZAR', UG: 'UGX', TZ: 'TZS', GH: 'GHS',
  ET: 'ETB', RW: 'RWF', ZM: 'ZMW', ZW: 'ZWL', MW: 'MWK', MZ: 'MZN',
  US: 'USD', CA: 'CAD', GB: 'GBP', AU: 'AUD', SG: 'SGD',
  AE: 'AED', IN: 'INR', MX: 'MXN', BR: 'BRL',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
}

// ── Sector hints per country ──────────────────────────────────
export const SECTOR_HINTS: Record<string, string> = {
  KE: 'FMCG distribution, M-Pesa mobile payments, tea & coffee export, horticulture, construction materials',
  NG: 'oil & gas supply chain, telecoms reselling, FMCG distribution, fashion retail, agritech startups',
  ZA: 'retail chain suppliers, mining equipment, wine & citrus export, automotive parts, financial services',
  UG: 'coffee & vanilla export, agriculture inputs, mobile money (MTN MoMo), FMCG distribution',
  TZ: 'tourism supplies, cashew & sesame export, FMCG, construction, telecom accessories',
  GH: 'cocoa & gold supply chain, telecoms, FMCG, fintech (Mobile Money), import trading',
  ET: 'coffee export, leather goods, flowers, import distribution, manufacturing',
  RW: 'coffee & tea export, tourism, fintech, agri-processing, logistics',
  ZM: 'copper mining supply, agriculture, FMCG, mobile money',
  US: 'SaaS, ecommerce, healthcare, fintech, logistics, food service',
  GB: 'financial services, retail, logistics, proptech, professional services',
  AE: 'real estate, logistics & re-export, F&B, hospitality, import/export trading',
  IN: 'textile exports, pharma, IT services, FMCG, agriculture, jewellery',
  SG: 'logistics, finance, F&B, tech, regional trading hub',
  DEFAULT: 'retail, ecommerce, distribution, logistics, import/export',
}

// ── Pricing tiers ────────────────────────────────────────────
export const PRICING_TIERS: Record<string, 'africa' | 'emerging' | 'developed'> = {
  africa: 'africa', KE: 'africa', NG: 'africa', ZA: 'africa', GH: 'africa',
  UG: 'africa', TZ: 'africa', ET: 'africa', RW: 'africa', ZM: 'africa',
}

// ── Localised pricing (starter / growth / business) ──────────
export const PRICING: Record<string, [number, number, number]> = {
  // Africa — PPP adjusted, 20% discount applied, rounded to clean numbers
  KES: [0, 1900,   4900],   // KSh — feels local, not a messy Stripe conversion
  NGN: [0, 9900,  29900],   // ₦ — rounded, feels premium
  ZAR: [0,  290,    890],   // R — clean
  UGX: [0, 59000, 179000],  // USh — rounded 000s
  TZS: [0, 39000, 119000],  // TSh — clean
  GHS: [0,  220,    690],   // ₵ — round
  ETB: [0,  890,   2900],   // Br — round
  // Developed markets — standard
  USD: [0,   19,     49],
  GBP: [0,   15,     39],
  EUR: [0,   17,     45],
  AED: [0,   69,    199],
  INR: [0, 1499,   3999],
  CAD: [0,   25,     65],
  AUD: [0,   27,     75],
  SGD: [0,   25,     65],
  DEFAULT: [0, 19, 49],
}

// Emerging market discount codes — auto-applied at checkout
export const MARKET_DISCOUNT: Record<string, { code: string; pct: number }> = {
  KES: { code: 'KENYA20', pct: 20 },
  NGN: { code: 'NIGERIA20', pct: 20 },
  GHS: { code: 'GHANA20', pct: 20 },
  ZAR: { code: 'SA20', pct: 20 },
  UGX: { code: 'UGANDA20', pct: 20 },
  TZS: { code: 'TZ20', pct: 20 },
  ETB: { code: 'ET20', pct: 20 },
  INR: { code: 'INDIA15', pct: 15 },
  BRL: { code: 'BR15', pct: 15 },
}

// ── Timezone → currency fallback ─────────────────────────────
const TZ_CURRENCY: Record<string, string> = {
  'Africa/Nairobi': 'KES', 'Africa/Lagos': 'NGN', 'Africa/Johannesburg': 'ZAR',
  'Africa/Kampala': 'UGX', 'Africa/Dar_es_Salaam': 'TZS', 'Africa/Accra': 'GHS',
  'Africa/Addis_Ababa': 'ETB', 'Africa/Kigali': 'RWF', 'Africa/Lusaka': 'ZMW',
  'Europe/London': 'GBP', 'Europe/Paris': 'EUR', 'Europe/Berlin': 'EUR',
  'America/New_York': 'USD', 'America/Chicago': 'USD', 'America/Los_Angeles': 'USD',
  'America/Toronto': 'CAD', 'Asia/Dubai': 'AED', 'Asia/Kolkata': 'INR',
  'Australia/Sydney': 'AUD', 'Asia/Singapore': 'SGD',
}

// ── Google Trends RSS (no API key, public) ───────────────────
export async function fetchTrendingTopics(countryCode: string): Promise<string[]> {
  // Map country codes to Google Trends geo codes
  const geoMap: Record<string, string> = {
    KE: 'KE', NG: 'NG', ZA: 'ZA', UG: 'UG', TZ: 'TZ', GH: 'GH',
    US: 'US', GB: 'GB', AE: 'AE', IN: 'IN', SG: 'SG',
  }
  const geo = geoMap[countryCode]
  if (!geo) return []

  try {
    const url = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
      headers: { 'User-Agent': 'SignalX/1.0' },
    })
    if (!res.ok) return []
    const xml = await res.text()
    // Extract <title> tags from RSS items (skip first — it's the feed title)
    const matches = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || []
    return matches
      .slice(1, 8)  // top 7 trending
      .map(m => m.replace(/<title><!\[CDATA\[|\]\]><\/title>/g, '').trim())
      .filter(Boolean)
  } catch (_) {
    return []
  }
}

// ── Server-side geo detection (Route Handler) ────────────────
export async function detectGeoFromIP(ip: string): Promise<GeoResult> {
  let countryCode = 'US'
  let country = 'United States'
  let city = ''
  let region = ''

  // Try ipapi.co (free: 1000/day, no key needed)
  try {
    const apiKey = process.env.IPAPI_KEY
    const url = apiKey
      ? `https://ipapi.co/${ip}/json/?key=${apiKey}`
      : `https://ipapi.co/${ip}/json/`

    const res = await Promise.race([
      fetch(url, { next: { revalidate: 86400 } }),  // cache 24h
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]) as Response

    if (res.ok) {
      const d = await res.json()
      if (!d.error) {
        countryCode = d.country_code || 'US'
        country = d.country_name || 'United States'
        city = d.city || ''
        region = d.region || ''
      }
    }
  } catch (_) {
    // Fall back to US defaults
  }

  const currency = COUNTRY_CURRENCY[countryCode] || 'USD'
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD
  const sectorHints = SECTOR_HINTS[countryCode] || SECTOR_HINTS.DEFAULT
  const trendTopics = await fetchTrendingTopics(countryCode)
  const pricingTier: 'africa' | 'emerging' | 'developed' =
    ['KE','NG','ZA','GH','UG','TZ','ET','RW','ZM'].includes(countryCode) ? 'africa'
    : ['IN','BR','MX','AE','SG'].includes(countryCode) ? 'emerging'
    : 'developed'

  return {
    country,
    countryCode,
    city,
    region,
    currency,
    currencySymbol: currencyInfo.sym,
    currencyName: currencyInfo.name,
    locale: currencyInfo.locale,
    sectorHints,
    trendTopics,
    pricingTier,
    flag: currencyInfo.flag,
  }
}

// ── Client-side fallback (timezone + locale) ─────────────────
export function detectGeoFromTimezone(): { currency: string; symbol: string } {
  if (typeof window === 'undefined') return { currency: 'USD', symbol: '$' }
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const locale = navigator.language || ''
  let currency = TZ_CURRENCY[tz] || 'USD'
  if (currency === 'USD') {
    const cc = locale.split('-')[1]
    if (cc && COUNTRY_CURRENCY[cc]) currency = COUNTRY_CURRENCY[cc]
  }
  const info = CURRENCIES[currency] || CURRENCIES.USD
  return { currency, symbol: info.sym }
}

export function formatCurrency(amount: number, currency: string): string {
  const info = CURRENCIES[currency] || CURRENCIES.USD
  // Round to clean psychological price points
  const rounded = amount >= 1000 ? Math.ceil(amount / 100) * 100
    : amount >= 100 ? Math.ceil(amount / 10) * 10
    : Math.round(amount)
  return `${info.sym}${rounded.toLocaleString()}`
}

export function getMarketDiscount(currency: string): { code: string; pct: number } | null {
  return MARKET_DISCOUNT[currency] || null
}

export function getPricing(currency: string) {
  return PRICING[currency] || PRICING.DEFAULT
}
