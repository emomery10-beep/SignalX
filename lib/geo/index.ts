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
// `factor` is the magnitude multiplier from the demo's authored ~USD units to
// this currency's typical scale (roughly FX-aligned — order of magnitude is
// what matters, not precision). 1 = keep base numbers as-is. Single source of
// truth for demo money-scaling (see app/pos-preview + app/demo/[country]).
export const CURRENCIES: Record<string, { sym: string; name: string; flag: string; locale: string; factor: number }> = {
  KES: { sym: 'KSh',  name: 'Kenyan Shilling',           flag: '🇰🇪', locale: 'sw-KE', factor: 155 },
  NGN: { sym: '₦',    name: 'Nigerian Naira',            flag: '🇳🇬', locale: 'en-NG', factor: 1550 },
  ZAR: { sym: 'R',    name: 'South African Rand',        flag: '🇿🇦', locale: 'en-ZA', factor: 18 },
  UGX: { sym: 'USh',  name: 'Ugandan Shilling',          flag: '🇺🇬', locale: 'sw-UG', factor: 3800 },
  TZS: { sym: 'TSh',  name: 'Tanzanian Shilling',        flag: '🇹🇿', locale: 'sw-TZ', factor: 2550 },
  GHS: { sym: '₵',    name: 'Ghanaian Cedi',             flag: '🇬🇭', locale: 'en-GH', factor: 15 },
  ETB: { sym: 'Br',   name: 'Ethiopian Birr',            flag: '🇪🇹', locale: 'am-ET', factor: 125 },
  RWF: { sym: 'RF',   name: 'Rwandan Franc',             flag: '🇷🇼', locale: 'rw-RW', factor: 1350 },
  ZMW: { sym: 'ZK',   name: 'Zambian Kwacha',            flag: '🇿🇲', locale: 'en-ZM', factor: 27 },
  // ── Rest of Africa ──
  XOF: { sym: 'FCFA', name: 'West African CFA Franc',    flag: '🌍', locale: 'fr-SN', factor: 600 },
  XAF: { sym: 'FCFA', name: 'Central African CFA Franc', flag: '🌍', locale: 'fr-CM', factor: 600 },
  EGP: { sym: 'E£',   name: 'Egyptian Pound',            flag: '🇪🇬', locale: 'ar-EG', factor: 48 },
  MAD: { sym: 'DH',   name: 'Moroccan Dirham',           flag: '🇲🇦', locale: 'fr-MA', factor: 10 },
  TND: { sym: 'DT',   name: 'Tunisian Dinar',            flag: '🇹🇳', locale: 'fr-TN', factor: 3.1 },
  DZD: { sym: 'DA',   name: 'Algerian Dinar',            flag: '🇩🇿', locale: 'fr-DZ', factor: 135 },
  LYD: { sym: 'LD',   name: 'Libyan Dinar',              flag: '🇱🇾', locale: 'ar-LY', factor: 4.8 },
  SDG: { sym: 'SDG',  name: 'Sudanese Pound',            flag: '🇸🇩', locale: 'ar-SD', factor: 600 },
  MWK: { sym: 'MK',   name: 'Malawian Kwacha',           flag: '🇲🇼', locale: 'en-MW', factor: 1730 },
  MZN: { sym: 'MT',   name: 'Mozambican Metical',        flag: '🇲🇿', locale: 'pt-MZ', factor: 64 },
  AOA: { sym: 'Kz',   name: 'Angolan Kwanza',            flag: '🇦🇴', locale: 'pt-AO', factor: 910 },
  CDF: { sym: 'FC',   name: 'Congolese Franc',           flag: '🇨🇩', locale: 'fr-CD', factor: 2800 },
  GNF: { sym: 'FG',   name: 'Guinean Franc',             flag: '🇬🇳', locale: 'fr-GN', factor: 8600 },
  SLE: { sym: 'Le',   name: 'Sierra Leonean Leone',      flag: '🇸🇱', locale: 'en-SL', factor: 22 },
  LRD: { sym: 'L$',   name: 'Liberian Dollar',           flag: '🇱🇷', locale: 'en-LR', factor: 190 },
  MGA: { sym: 'Ar',   name: 'Malagasy Ariary',           flag: '🇲🇬', locale: 'fr-MG', factor: 4600 },
  SOS: { sym: 'Sh',   name: 'Somali Shilling',           flag: '🇸🇴', locale: 'so-SO', factor: 570 },
  DJF: { sym: 'Fdj',  name: 'Djiboutian Franc',          flag: '🇩🇯', locale: 'fr-DJ', factor: 178 },
  ERN: { sym: 'Nfk',  name: 'Eritrean Nakfa',            flag: '🇪🇷', locale: 'ti-ER', factor: 15 },
  BWP: { sym: 'P',    name: 'Botswana Pula',             flag: '🇧🇼', locale: 'en-BW', factor: 13.5 },
  NAD: { sym: 'N$',   name: 'Namibian Dollar',           flag: '🇳🇦', locale: 'en-NA', factor: 18 },
  LSL: { sym: 'L',    name: 'Lesotho Loti',              flag: '🇱🇸', locale: 'en-LS', factor: 18 },
  SZL: { sym: 'E',    name: 'Eswatini Lilangeni',        flag: '🇸🇿', locale: 'en-SZ', factor: 18 },
  // ── Non-Africa (existing) ──
  USD: { sym: '$',    name: 'US Dollar',                 flag: '🇺🇸', locale: 'en-US', factor: 1 },
  GBP: { sym: '£',    name: 'British Pound',             flag: '🇬🇧', locale: 'en-GB', factor: 1 },
  EUR: { sym: '€',    name: 'Euro',                      flag: '🇪🇺', locale: 'en-EU', factor: 1 },
  AED: { sym: 'AED',  name: 'UAE Dirham',                flag: '🇦🇪', locale: 'ar-AE', factor: 3.7 },
  INR: { sym: '₹',    name: 'Indian Rupee',              flag: '🇮🇳', locale: 'en-IN', factor: 84 },
  CAD: { sym: 'CA$',  name: 'Canadian Dollar',           flag: '🇨🇦', locale: 'en-CA', factor: 1.4 },
  AUD: { sym: 'A$',   name: 'Australian Dollar',         flag: '🇦🇺', locale: 'en-AU', factor: 1.5 },
  SGD: { sym: 'S$',   name: 'Singapore Dollar',          flag: '🇸🇬', locale: 'en-SG', factor: 1.35 },
  MXN: { sym: 'MX$',  name: 'Mexican Peso',              flag: '🇲🇽', locale: 'es-MX', factor: 18 },
  BRL: { sym: 'R$',   name: 'Brazilian Real',            flag: '🇧🇷', locale: 'pt-BR', factor: 5.5 },
  ZWL: { sym: 'ZWL',  name: 'Zimbabwean Dollar',         flag: '🇿🇼', locale: 'en-ZW', factor: 36 },
}

// ── Country → currency ────────────────────────────────────────
export const COUNTRY_CURRENCY: Record<string, string> = {
  // East Africa
  KE: 'KES', UG: 'UGX', TZ: 'TZS', ET: 'ETB', RW: 'RWF', SO: 'USD', DJ: 'DJF', ER: 'ERN',
  // West Africa
  NG: 'NGN', GH: 'GHS', SN: 'XOF', CI: 'XOF', ML: 'XOF', BF: 'XOF', NE: 'XOF', TG: 'XOF',
  BJ: 'XOF', GW: 'XOF', GN: 'GNF', SL: 'SLE', LR: 'LRD',
  // Central Africa
  CM: 'XAF', GA: 'XAF', CG: 'XAF', TD: 'XAF', CF: 'XAF', GQ: 'XAF', CD: 'CDF',
  // North Africa
  EG: 'EGP', MA: 'MAD', TN: 'TND', DZ: 'DZD', LY: 'LYD', SD: 'SDG',
  // Southern Africa
  ZA: 'ZAR', ZM: 'ZMW', ZW: 'ZWL', MW: 'MWK', MZ: 'MZN', AO: 'AOA', MG: 'MGA',
  BW: 'BWP', NA: 'NAD', LS: 'LSL', SZ: 'SZL',
  // Rest of world
  US: 'USD', CA: 'CAD', GB: 'GBP', AU: 'AUD', SG: 'SGD',
  AE: 'AED', IN: 'INR', MX: 'MXN', BR: 'BRL',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
}

// ── Country → phone dial code (E.164 prefix) ─────────────────
// Ordered Africa-first to match the primary audience; drives the
// country selector on phone sign-in.
export const COUNTRY_DIAL: { code: string; dial: string; flag: string }[] = [
  { code: 'KE', dial: '+254', flag: '🇰🇪' },
  { code: 'NG', dial: '+234', flag: '🇳🇬' },
  { code: 'UG', dial: '+256', flag: '🇺🇬' },
  { code: 'TZ', dial: '+255', flag: '🇹🇿' },
  { code: 'GH', dial: '+233', flag: '🇬🇭' },
  { code: 'ZA', dial: '+27',  flag: '🇿🇦' },
  { code: 'RW', dial: '+250', flag: '🇷🇼' },
  { code: 'ZM', dial: '+260', flag: '🇿🇲' },
  { code: 'ET', dial: '+251', flag: '🇪🇹' },
  { code: 'SO', dial: '+252', flag: '🇸🇴' },
  { code: 'DJ', dial: '+253', flag: '🇩🇯' },
  { code: 'ZW', dial: '+263', flag: '🇿🇼' },
  { code: 'MW', dial: '+265', flag: '🇲🇼' },
  { code: 'MZ', dial: '+258', flag: '🇲🇿' },
  { code: 'US', dial: '+1',   flag: '🇺🇸' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧' },
  { code: 'IE', dial: '+353', flag: '🇮🇪' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷' },
  { code: 'ES', dial: '+34',  flag: '🇪🇸' },
  { code: 'IT', dial: '+39',  flag: '🇮🇹' },
  { code: 'NL', dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', dial: '+32',  flag: '🇧🇪' },
  { code: 'PT', dial: '+351', flag: '🇵🇹' },
  { code: 'AT', dial: '+43',  flag: '🇦🇹' },
  { code: 'FI', dial: '+358', flag: '🇫🇮' },
  { code: 'AE', dial: '+971', flag: '🇦🇪' },
  { code: 'IN', dial: '+91',  flag: '🇮🇳' },
  { code: 'SG', dial: '+65',  flag: '🇸🇬' },
  { code: 'AU', dial: '+61',  flag: '🇦🇺' },
  { code: 'MX', dial: '+52',  flag: '🇲🇽' },
  { code: 'BR', dial: '+55',  flag: '🇧🇷' },
]

// Reverse currency → country, for the timezone fallback when /api/geo
// is unreachable (first match wins; EUR intentionally resolves to DE).
export function countryFromCurrency(currency: string): string | null {
  for (const [cc, cur] of Object.entries(COUNTRY_CURRENCY)) {
    if (cur === currency) return cc
  }
  return null
}

// Same reverse lookup, but only when the currency belongs to exactly one
// country — shared-currency zones (EUR across 9 countries here, XOF across 8,
// XAF across 6) are genuinely ambiguous. countryFromCurrency() above picks a
// "good enough" single guess for a phone dial-code default; for anything shown
// to the user as a specific fact (e.g. "your tax authority is..."), confidently
// naming the wrong country is worse than admitting it's unknown.
export function countryFromCurrencyUnambiguous(currency: string): string | null {
  const matches = Object.entries(COUNTRY_CURRENCY).filter(([, cur]) => cur === currency)
  return matches.length === 1 ? matches[0][0] : null
}

// Normalise user input to E.164. Accepts local formats with a leading 0
// (e.g. Kenyan 0712…), international 00-prefix, or already-+prefixed.
// Returns null when the result isn't a plausible E.164 number.
export function toE164(dial: string, raw: string): string | null {
  let n = raw.replace(/[\s\-().]/g, '')
  if (n.startsWith('00')) n = '+' + n.slice(2)
  if (!n.startsWith('+')) n = dial + n.replace(/^0+/, '')
  return /^\+[1-9]\d{6,14}$/.test(n) ? n : null
}

// Country code → display name (mirror of the map in app/api/geo/route.ts).
export const COUNTRY_NAMES: Record<string, string> = {
  KE: 'Kenya', NG: 'Nigeria', ZA: 'South Africa', UG: 'Uganda', TZ: 'Tanzania',
  GH: 'Ghana', ET: 'Ethiopia', RW: 'Rwanda', ZM: 'Zambia', ZW: 'Zimbabwe',
  MW: 'Malawi', MZ: 'Mozambique', US: 'United States', GB: 'United Kingdom',
  IE: 'Ireland', DE: 'Germany', FR: 'France', ES: 'Spain', IT: 'Italy',
  NL: 'Netherlands', BE: 'Belgium', PT: 'Portugal', AT: 'Austria', FI: 'Finland',
  AE: 'UAE', IN: 'India', SG: 'Singapore', AU: 'Australia', CA: 'Canada',
  MX: 'Mexico', BR: 'Brazil',
}

// E.164 phone → ISO country code, by longest matching dial prefix. This is
// the RELIABLE location signal for mobile-money vendors: African carriers
// often present a non-local IP, so the signup phone number beats IP geo.
// Shared codes (+1) resolve to the first COUNTRY_DIAL entry (US); returns
// null when nothing matches (malformed / not +-prefixed).
export function countryFromPhone(e164: string | null | undefined): string | null {
  if (!e164) return null
  const n = e164.replace(/[^\d+]/g, '')
  if (!n.startsWith('+')) return null
  const sorted = [...COUNTRY_DIAL].sort((a, b) => b.dial.length - a.dial.length)
  for (const c of sorted) {
    if (n.startsWith(c.dial)) return c.code
  }
  return null
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

// ── POS seat price, per profile currency (display strings) ───
// Mirrors APP_PRICING.pos in app/api/geo/route.ts (which is keyed by
// country for the marketing site); this map is keyed by the currency the
// user confirmed at onboarding, covering every currency onboarding offers.
// NOTE: the KES price is what PesaPal actually charges (KSh 500). Card
// payments charge the STRIPE_PRICE_POS_SEAT price object — these display
// amounts are only exact for cards if that Stripe price carries matching
// multi-currency options; otherwise Stripe falls back to its base currency.
// Per-seat monthly price by profile currency (amount + symbol), so a total
// can be computed for any seat count. Amounts mirror the marketing site's
// POS pricing (app/api/geo/route.ts APP_PRICING.pos).
export const POS_SEAT: Record<string, { amount: number; sym: string }> = {
  GBP: { amount: 5, sym: '£' },
  USD: { amount: 5, sym: '$' },
  EUR: { amount: 5, sym: '€' },
  KES: { amount: 500, sym: 'KSh ' },
  NGN: { amount: 2500, sym: '₦' },
  GHS: { amount: 25, sym: '₵' },
  ZAR: { amount: 90, sym: 'R ' },
  AED: { amount: 18, sym: 'AED ' },
  INR: { amount: 400, sym: '₹' },
  AUD: { amount: 8, sym: 'A$' },
  CAD: { amount: 7, sym: 'CA$' },
  SGD: { amount: 7, sym: 'S$' },
  UGX: { amount: 18000, sym: 'USh ' },
  TZS: { amount: 12000, sym: 'TSh ' },
  ETB: { amount: 250, sym: 'Br ' },
}

// Formatted price for N seats in the user's currency, e.g.
// posSeatPrice('KES', 3) → "KSh 1,500". Defaults to GBP when unknown.
export function posSeatPrice(currency: string, seats = 1): string {
  const c = POS_SEAT[currency] || { amount: 5, sym: '£' }
  return `${c.sym}${(c.amount * Math.max(1, seats)).toLocaleString()}`
}

// Back-compat single-seat display map (used by existing callers).
export const POS_SEAT_PRICE_DISPLAY: Record<string, string> = {
  GBP: '£5', USD: '$5', EUR: '€5', KES: 'KSh 500', NGN: '₦2,500', GHS: '₵25',
  ZAR: 'R 90', AED: 'AED 18', INR: '₹400', AUD: 'A$8', CAD: 'CA$7', SGD: 'S$7',
  UGX: 'USh 18,000', TZS: 'TSh 12,000', ETB: 'Br 250', DEFAULT: '£5',
}

// ── Developer API wallet top-up bundles, per profile currency ─
// Three tiers per currency (mirrors app/api/v1/wallet/topup/route.ts's
// TOPUP_BUNDLES = [500, 2000, 10000] pence, i.e. £5/£20/£100), in major
// units. Values are POS_SEAT's approved "~£5" reference point scaled ×4/×20
// — deliberately PPP-discounted local price points, NOT FX conversion (e.g.
// NGN here is roughly a third of raw FX-equivalent). This is a confirmed
// pricing decision, not an oversight: API usage itself debits flat
// GBP-pence everywhere regardless of currency (lib/api-pricing.ts), so a
// developer topping up in a discounted currency gets more real-terms API
// credit per unit of local cash — consistent with growth being prioritised
// over revenue optimisation right now, and with how POS_SEAT already prices.
//
// Every entry is charged via `unit_amount = amount * 100` (standard
// 2-decimal handling — confirmed correct for all 15, including UGX, which
// Stripe special-cases as "conceptually zero-decimal but still represented
// ×100 with a forced .00"). Do NOT add a currency here without checking
// it isn't one of Stripe's true zero-decimal currencies (BIF, CLP, DJF,
// GNF, JPY, KMF, KRW, MGA, PYG, RWF, VND, VUV, XAF, XOF, XPF) — those need a
// different multiplier, or ×100 silently overcharges 100x.
export const WALLET_TOPUP_BUNDLES: Record<string, [number, number, number]> = {
  GBP: [5, 20, 100],
  USD: [5, 20, 100],
  EUR: [5, 20, 100],
  KES: [500, 2000, 10000],
  NGN: [2500, 10000, 50000],
  GHS: [25, 100, 500],
  ZAR: [90, 360, 1800],
  AED: [18, 72, 360],
  INR: [400, 1600, 8000],
  AUD: [8, 32, 160],
  CAD: [7, 28, 140],
  SGD: [7, 28, 140],
  UGX: [18000, 72000, 360000],
  TZS: [12000, 48000, 240000],
  ETB: [250, 1000, 5000],
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
