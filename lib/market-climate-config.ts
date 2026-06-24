// ── MARKET CLIMATE CONFIG ─────────────────────────────────────────────────────
// Maps a business's location → which macro signals matter, its sector → how
// heavily to weight each signal, and its supplier currencies → which shipping
// lanes it's exposed to. This is what turns a generic market headline into a
// personalised business warning.
// ─────────────────────────────────────────────────────────────────────────────

export interface MarketSignalSpec {
  key: string                 // stable id, e.g. 'index', 'fx', 'oil'
  label: string               // display name, e.g. 'NGX All-Share'
  query: string               // Tavily search query to fetch today's move
  kind: 'index' | 'fx' | 'commodity' | 'rate' | 'demand'
}

export interface CountryClimate {
  code: string
  name: string
  currency: string            // local currency code
  index: MarketSignalSpec      // primary local stock exchange
  fx: MarketSignalSpec         // local currency vs USD
  commodities: MarketSignalSpec[]
  centralBank: MarketSignalSpec
}

// ── Per-country signal map ────────────────────────────────────────────────────
const COUNTRIES: Record<string, CountryClimate> = {
  NG: {
    code: 'NG', name: 'Nigeria', currency: 'NGN',
    index: { key: 'index', label: 'NGX All-Share', query: 'Nigeria NGX All-Share Index today points change percent', kind: 'index' },
    fx:    { key: 'fx', label: 'USD / NGN', query: 'USD to NGN Naira exchange rate today official', kind: 'fx' },
    commodities: [
      { key: 'oil', label: 'Brent Crude', query: 'Brent crude oil price today per barrel change', kind: 'commodity' },
    ],
    centralBank: { key: 'rate', label: 'CBN Rate', query: 'Central Bank of Nigeria CBN monetary policy rate MPR latest', kind: 'rate' },
  },
  KE: {
    code: 'KE', name: 'Kenya', currency: 'KES',
    index: { key: 'index', label: 'NSE 20', query: 'Nairobi Securities Exchange NSE 20 index today change', kind: 'index' },
    fx:    { key: 'fx', label: 'USD / KES', query: 'USD to KES Kenyan shilling exchange rate today', kind: 'fx' },
    commodities: [
      { key: 'tea', label: 'Tea Price', query: 'Kenya tea auction Mombasa price per kg latest', kind: 'commodity' },
      { key: 'oil', label: 'Brent Crude', query: 'Brent crude oil price today per barrel change', kind: 'commodity' },
    ],
    centralBank: { key: 'rate', label: 'CBK Rate', query: 'Central Bank of Kenya CBK benchmark rate latest', kind: 'rate' },
  },
  GH: {
    code: 'GH', name: 'Ghana', currency: 'GHS',
    index: { key: 'index', label: 'GSE Composite', query: 'Ghana Stock Exchange GSE Composite Index today change', kind: 'index' },
    fx:    { key: 'fx', label: 'USD / GHS', query: 'USD to GHS Ghana cedi exchange rate today', kind: 'fx' },
    commodities: [
      { key: 'cocoa', label: 'Cocoa Price', query: 'cocoa price per tonne today change', kind: 'commodity' },
      { key: 'gold', label: 'Gold Price', query: 'gold price per ounce today change', kind: 'commodity' },
    ],
    centralBank: { key: 'rate', label: 'BoG Rate', query: 'Bank of Ghana policy rate latest', kind: 'rate' },
  },
  ZA: {
    code: 'ZA', name: 'South Africa', currency: 'ZAR',
    index: { key: 'index', label: 'JSE All-Share', query: 'Johannesburg JSE All Share Index today change percent', kind: 'index' },
    fx:    { key: 'fx', label: 'USD / ZAR', query: 'USD to ZAR South African rand exchange rate today', kind: 'fx' },
    commodities: [
      { key: 'gold', label: 'Gold Price', query: 'gold price per ounce today change', kind: 'commodity' },
      { key: 'platinum', label: 'Platinum', query: 'platinum price per ounce today change', kind: 'commodity' },
    ],
    centralBank: { key: 'rate', label: 'SARB Rate', query: 'South African Reserve Bank SARB repo rate latest', kind: 'rate' },
  },
  GB: {
    code: 'GB', name: 'United Kingdom', currency: 'GBP',
    index: { key: 'index', label: 'FTSE 100', query: 'FTSE 100 index today points change percent', kind: 'index' },
    fx:    { key: 'fx', label: 'GBP / USD', query: 'GBP to USD pound dollar exchange rate today', kind: 'fx' },
    commodities: [
      { key: 'oil', label: 'Brent Crude', query: 'Brent crude oil price today per barrel change', kind: 'commodity' },
    ],
    centralBank: { key: 'rate', label: 'BoE Base Rate', query: 'Bank of England base rate latest decision', kind: 'rate' },
  },
  US: {
    code: 'US', name: 'United States', currency: 'USD',
    index: { key: 'index', label: 'S&P 500', query: 'S&P 500 index today points change percent', kind: 'index' },
    fx:    { key: 'fx', label: 'US Dollar Index', query: 'US dollar index DXY today change', kind: 'fx' },
    commodities: [
      { key: 'oil', label: 'WTI Crude', query: 'WTI crude oil price today per barrel change', kind: 'commodity' },
    ],
    centralBank: { key: 'rate', label: 'Fed Funds Rate', query: 'Federal Reserve federal funds rate latest decision', kind: 'rate' },
  },
}

const DEFAULT_COUNTRY = COUNTRIES.GB

export function getCountryClimate(countryCode?: string | null): CountryClimate {
  if (!countryCode) return DEFAULT_COUNTRY
  return COUNTRIES[countryCode.toUpperCase()] || DEFAULT_COUNTRY
}

/** True when we have a dedicated signal map for this country (not the fallback). */
export function isCountryMapped(countryCode?: string | null): boolean {
  return !!countryCode && !!COUNTRIES[countryCode.toUpperCase()]
}

// ISO code → display name, for surfacing the user's actual country even when unmapped.
const COUNTRY_NAMES: Record<string, string> = {
  NG: 'Nigeria', KE: 'Kenya', GH: 'Ghana', ZA: 'South Africa', GB: 'United Kingdom', US: 'United States',
  TZ: 'Tanzania', UG: 'Uganda', RW: 'Rwanda', ET: 'Ethiopia', EG: 'Egypt', CI: "Côte d'Ivoire",
  SN: 'Senegal', CM: 'Cameroon', ZM: 'Zambia', ZW: 'Zimbabwe', IE: 'Ireland', IN: 'India',
}
export function getCountryName(countryCode?: string | null): string {
  if (!countryCode) return 'your region'
  return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode.toUpperCase()
}

// ── Sector detection + signal weighting ───────────────────────────────────────
// A business's dominant product category decides which signal hits it hardest.
// `importIntensity` (0-1) estimates how much of COGS is exposed to FX/freight.
export interface SectorProfile {
  key: string
  label: string
  icon: string
  // signal key → weight (0-1). Higher = this signal moves this sector more.
  weights: Record<string, number>
  importIntensity: number
}

const SECTORS: Record<string, SectorProfile> = {
  electronics: { key: 'electronics', label: 'Electronics / Repair', icon: '📱', weights: { fx: 1.0, index: 0.4, oil: 0.3, rate: 0.6 }, importIntensity: 0.85 },
  fmcg:        { key: 'fmcg',        label: 'Food / FMCG',          icon: '🛒', weights: { fx: 0.6, oil: 0.8, index: 0.5, rate: 0.4, cocoa: 0.5, tea: 0.5 }, importIntensity: 0.45 },
  fashion:     { key: 'fashion',     label: 'Fashion / Clothing',   icon: '👗', weights: { fx: 0.8, index: 0.6, rate: 0.5 }, importIntensity: 0.7 },
  logistics:   { key: 'logistics',   label: 'Logistics / Courier',  icon: '🚚', weights: { oil: 1.0, fx: 0.5, rate: 0.4 }, importIntensity: 0.3 },
  beauty:      { key: 'beauty',      label: 'Beauty / Cosmetics',   icon: '💄', weights: { fx: 0.8, index: 0.5, rate: 0.4 }, importIntensity: 0.65 },
  hardware:    { key: 'hardware',    label: 'Hardware / Building',   icon: '🔧', weights: { fx: 0.7, oil: 0.6, index: 0.4, rate: 0.6 }, importIntensity: 0.6 },
  general:     { key: 'general',     label: 'General Retail',       icon: '🏪', weights: { fx: 0.6, index: 0.6, oil: 0.5, rate: 0.5 }, importIntensity: 0.5 },
}

// Keyword → sector. First match wins. Lowercase substrings.
const SECTOR_KEYWORDS: Array<[string[], string]> = [
  [['phone', 'laptop', 'electronic', 'computer', 'charger', 'gadget', 'device', 'repair', 'screen', 'battery'], 'electronics'],
  [['food', 'drink', 'beverage', 'grocer', 'snack', 'rice', 'beer', 'water', 'fmcg', 'provision', 'restaurant', 'kitchen'], 'fmcg'],
  [['cloth', 'fashion', 'apparel', 'shoe', 'wear', 'textile', 'fabric', 'dress', 'shirt', 'bag'], 'fashion'],
  [['courier', 'logistics', 'freight', 'delivery', 'shipping', 'transport', 'haulage'], 'logistics'],
  [['beauty', 'cosmetic', 'makeup', 'skincare', 'skin', 'hair', 'salon', 'perfume', 'lotion'], 'beauty'],
  [['hardware', 'building', 'cement', 'tool', 'pipe', 'paint', 'tile', 'construction', 'plumbing'], 'hardware'],
]

export function detectSector(categories: string[]): SectorProfile {
  const blob = categories.join(' ').toLowerCase()
  for (const [keywords, sectorKey] of SECTOR_KEYWORDS) {
    if (keywords.some(k => blob.includes(k))) return SECTORS[sectorKey]
  }
  return SECTORS.general
}

// ── Business-specific commodity signals (deterministic fallback) ──────────────
// Maps what a business actually trades → the specific commodity/demand signals
// that move its margins. Used when the LLM selector is unavailable, so a sesame
// trader sees sesame + edible-oil demand, not a generic national index.
// [keywords, signal] — first matches win, deduped by key.
const COMMODITY_KEYWORDS: Array<[string[], MarketSignalSpec[]]> = [
  [['sesame', 'simsim', 'sim sim'], [
    { key: 'sesame', label: 'Sesame Seed Price', query: 'sesame seed price per tonne world market today change', kind: 'commodity' },
    { key: 'sesame_demand', label: 'Export Demand', query: 'sesame seed import demand China Japan Turkey latest', kind: 'demand' },
  ]],
  [['coffee'], [{ key: 'coffee', label: 'Coffee Price', query: 'arabica coffee price per pound today change', kind: 'commodity' }]],
  [['tea'], [{ key: 'tea', label: 'Tea Price', query: 'tea auction price per kg Mombasa today', kind: 'commodity' }]],
  [['cocoa'], [{ key: 'cocoa', label: 'Cocoa Price', query: 'cocoa price per tonne today change', kind: 'commodity' }]],
  [['cashew'], [{ key: 'cashew', label: 'Cashew Price', query: 'raw cashew nut price per tonne today', kind: 'commodity' }]],
  [['maize', 'corn'], [{ key: 'maize', label: 'Maize Price', query: 'maize corn price per tonne today change', kind: 'commodity' }]],
  [['avocado'], [{ key: 'avocado', label: 'Avocado Export', query: 'avocado export price demand Europe today', kind: 'demand' }]],
  [['macadamia'], [{ key: 'macadamia', label: 'Macadamia Price', query: 'macadamia nut price per kg today', kind: 'commodity' }]],
  [['cotton'], [{ key: 'cotton', label: 'Cotton Price', query: 'cotton price per pound today change', kind: 'commodity' }]],
  [['rubber'], [{ key: 'rubber', label: 'Rubber Price', query: 'natural rubber price per kg today', kind: 'commodity' }]],
  [['gold', 'jewel'], [{ key: 'gold', label: 'Gold Price', query: 'gold price per ounce today change', kind: 'commodity' }]],
  [['cattle', 'beef', 'livestock'], [{ key: 'cattle', label: 'Livestock Price', query: 'live cattle beef price today change', kind: 'commodity' }]],
  [['fish', 'seafood'], [{ key: 'fish', label: 'Seafood Demand', query: 'fish seafood export price demand today', kind: 'demand' }]],
  [['sugar'], [{ key: 'sugar', label: 'Sugar Price', query: 'sugar price per pound today change', kind: 'commodity' }]],
  [['wheat', 'flour'], [{ key: 'wheat', label: 'Wheat Price', query: 'wheat price per bushel today change', kind: 'commodity' }]],
  [['palm', 'cooking oil', 'vegetable oil', 'edible oil'], [{ key: 'palmoil', label: 'Edible Oil Price', query: 'palm oil edible oil price per tonne today', kind: 'commodity' }]],
]

export function detectBusinessCommodities(terms: string[]): MarketSignalSpec[] {
  const blob = terms.join(' ').toLowerCase()
  const out: MarketSignalSpec[] = []
  const seen = new Set<string>()
  for (const [keywords, signals] of COMMODITY_KEYWORDS) {
    if (keywords.some(k => blob.includes(k))) {
      for (const s of signals) if (!seen.has(s.key)) { seen.add(s.key); out.push(s) }
    }
  }
  return out
}

// Severity weight by signal kind — used so dynamically-selected signals (whose
// keys aren't in the fixed sector table) still score sensibly.
export const SIGNAL_KIND_WEIGHT: Record<string, number> = {
  fx: 0.95, commodity: 0.85, demand: 0.75, rate: 0.5, index: 0.4,
}

// ── Channel mix (ecommerce vs POS vs wholesale) ───────────────────────────────
// Drives which DEMAND signals matter: online sellers live and die by ad cost /
// CAC; in-store shops by local footfall and consumer spending.
export interface ChannelMix { ecommercePct: number; posPct: number; hasEcommerce: boolean; hasPos: boolean }

const ECOMMERCE_SOURCES = ['shopify', 'woocommerce', 'amazon', 'ebay', 'etsy', 'tiktok', 'jumia', 'takealot', 'online', 'web', 'stripe']
const POS_SOURCES = ['pos', 'square', 'in-store', 'instore', 'shop', 'counter']

export function classifyChannel(sourceOrChannel: string): 'ecommerce' | 'pos' | 'other' {
  const s = (sourceOrChannel || '').toLowerCase()
  if (ECOMMERCE_SOURCES.some(k => s.includes(k))) return 'ecommerce'
  if (POS_SOURCES.some(k => s.includes(k))) return 'pos'
  return 'other'
}

// Consumer/demand signals for retail (non-commodity) businesses, tuned to how
// they sell. Used in the fallback path and to nudge the LLM selector.
export function buildRetailSignals(climate: CountryClimate, mix: ChannelMix): MarketSignalSpec[] {
  const out: MarketSignalSpec[] = [
    { key: 'consumer', label: 'Consumer Demand', query: `${climate.name} consumer spending retail demand confidence latest`, kind: 'demand' },
  ]
  if (mix.hasEcommerce) {
    out.push({ key: 'adcost', label: 'Digital Ad Cost', query: `Meta Google online advertising cost CPM CPC trend ${climate.name} latest`, kind: 'demand' })
  }
  if (mix.hasPos && !mix.hasEcommerce) {
    out.push({ key: 'footfall', label: 'Retail Footfall', query: `${climate.name} retail footfall high street store spending latest`, kind: 'demand' })
  }
  return out
}

// ── Supplier currency → shipping lane exposure ────────────────────────────────
// The currency a supplier invoices in is a proxy for where goods ship FROM,
// which tells us which trade-lane disruptions to watch.
export interface ShippingLane {
  currencies: string[]
  lane: string                // human label
  route: string               // chokepoint / route
  freightQuery: string        // Tavily query for current freight/disruption state
}

const SHIPPING_LANES: ShippingLane[] = [
  { currencies: ['CNY', 'HKD', 'RMB'], lane: 'China → Africa/Europe', route: 'Red Sea / Suez', freightQuery: 'China container freight rate Red Sea Suez disruption shipping delay latest' },
  { currencies: ['INR'],               lane: 'India → Africa',        route: 'Arabian Sea',     freightQuery: 'India export container shipping freight rate delay latest' },
  { currencies: ['EUR'],               lane: 'Europe → Africa',       route: 'Mediterranean',   freightQuery: 'Europe Africa container freight rate shipping delay latest' },
  { currencies: ['AED'],               lane: 'UAE/Dubai → Africa',    route: 'Gulf / Red Sea',  freightQuery: 'Dubai UAE re-export container shipping freight Red Sea latest' },
  { currencies: ['USD', 'GBP'],        lane: 'Global / US → market',  route: 'Atlantic',        freightQuery: 'global container freight rate index Drewry latest change' },
]

export function detectShippingLanes(currencies: string[]): ShippingLane[] {
  const set = new Set(currencies.map(c => c.toUpperCase()))
  const matched = SHIPPING_LANES.filter(l => l.currencies.some(c => set.has(c)))
  // Always fall back to the global lane if nothing else matched
  return matched.length ? matched : [SHIPPING_LANES[SHIPPING_LANES.length - 1]]
}

// ── Per-country port congestion watch ─────────────────────────────────────────
export const PORT_BY_COUNTRY: Record<string, { port: string; query: string }> = {
  NG: { port: 'Apapa / Tin Can (Lagos)', query: 'Apapa Tin Can Lagos port congestion clearance delay latest' },
  KE: { port: 'Mombasa', query: 'Mombasa port congestion clearance delay latest' },
  GH: { port: 'Tema', query: 'Tema port Ghana congestion clearance delay latest' },
  ZA: { port: 'Durban', query: 'Durban port congestion backlog delay latest' },
  GB: { port: 'Felixstowe', query: 'Felixstowe port UK congestion delay latest' },
  US: { port: 'LA / Long Beach', query: 'Los Angeles Long Beach port congestion delay latest' },
}

export function getPortWatch(countryCode?: string | null) {
  if (!countryCode) return null
  return PORT_BY_COUNTRY[countryCode.toUpperCase()] || null
}
