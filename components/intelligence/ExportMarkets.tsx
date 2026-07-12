'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EXPORT_MARKETS, parseExportQuery, scoreForQuery } from '@/lib/ai/export-markets'
import { useLang } from '@/components/LanguageProvider'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

// ── Market detail data (UI-only, not needed in AI lib) ────────────────────────
const MARKET_DETAIL: Record<string, {
  notes: string; logistics_note: string; entry_route: string
  barriers: string[]; post_brexit: boolean; min_order: number; population: number; gdp_per_capita: number
}> = {
  us:  { notes: 'The world\'s largest consumer market. English language, no Brexit friction, strong appetite for British brands. Amazon.com, Shopify DTC, and wholesale are all viable.', logistics_note: 'Air freight 8-10hrs. Sea freight 10-14 days East Coast, 18-25 days West Coast.', entry_route: 'Amazon.com, Shopify DTC, or US distributor', barriers: ['FDA registration for food/health', 'State-by-state sales tax', 'Returns logistics cost'], post_brexit: false, min_order: 3000, population: 335, gdp_per_capita: 65000 },
  de:  { notes: 'Europe\'s largest economy. Amazon.de and Otto dominate. German consumers value quality — UK brand quality positioning works well. Largest EU ecommerce market by volume.', logistics_note: 'Road freight 1-2 days from UK. Excellent infrastructure.', entry_route: 'Amazon.de, Otto marketplace, or German distributor', barriers: ['Post-Brexit customs declarations', 'EORI number required', 'VAT registration in Germany for B2C', 'German language content preferred'], post_brexit: true, min_order: 2000, population: 84, gdp_per_capita: 48000 },
  fr:  { notes: 'Second largest EU ecommerce market. French consumers have strong brand consciousness — premium British positioning resonates strongly in fashion, beauty, and food.', logistics_note: 'Eurotunnel 2.5hrs, road freight 1-2 days.', entry_route: 'Amazon.fr, Cdiscount, or French distributor', barriers: ['Post-Brexit customs declarations', 'French language requirement', 'VAT registration for B2C', 'EORI number required'], post_brexit: true, min_order: 2000, population: 68, gdp_per_capita: 43000 },
  nl:  { notes: 'Europe\'s logistics hub. Rotterdam is the EU\'s largest port — ideal entry point for EU distribution. High English proficiency. Bol.com dominates ecommerce.', logistics_note: 'Rotterdam port is the EU gateway. 1-day road freight from UK.', entry_route: 'Bol.com marketplace or Dutch distributor as EU hub', barriers: ['Post-Brexit customs at Rotterdam', 'EORI number required', 'VAT registration required'], post_brexit: true, min_order: 1500, population: 18, gdp_per_capita: 56000 },
  au:  { notes: 'Strong cultural affinity with UK. English language, high disposable income, love of British brands. Australia-UK Free Trade Agreement (2023) eliminates most tariffs.', logistics_note: 'Air freight 22-24hrs. Sea freight 25-35 days. Sydney and Melbourne are hubs.', entry_route: 'Amazon.com.au, Catch.com.au, or Australian distributor', barriers: ['Long transit times increase stock requirements', 'AUD/GBP volatility', 'Strict biosecurity for food'], post_brexit: false, min_order: 2000, population: 26, gdp_per_capita: 55000 },
  ca:  { notes: 'CPTPP member — preferential UK access. English and French markets. Strong UK brand affinity. Amazon.ca and Shopify (Canadian company) are the main channels.', logistics_note: 'Air freight 8-10hrs. Sea freight 12-18 days to East Coast.', entry_route: 'Amazon.ca or Canadian distributor', barriers: ['Bilingual labelling required', 'Provincial tax complexity', 'Health Canada approval for health products'], post_brexit: false, min_order: 2000, population: 38, gdp_per_capita: 52000 },
  jp:  { notes: 'Highest UK brand premium in Asia. Japanese consumers pay significant premiums for quality British goods — food, whisky, fashion, and homeware all strong.', logistics_note: 'Air freight 12hrs. Sea freight 25-35 days.', entry_route: 'Amazon.co.jp, Rakuten, or Japanese trading company', barriers: ['Japanese language required', 'Complex product regulations', 'Trading company structure often needed'], post_brexit: false, min_order: 3000, population: 125, gdp_per_capita: 34000 },
  kr:  { notes: 'World\'s most digitally advanced ecommerce market. Coupang dominates. K-beauty trend means strong interest in UK skincare. Young, high-spending urban population.', logistics_note: 'Air freight 11-13hrs. Sea freight 25-30 days to Busan.', entry_route: 'Coupang marketplace or Korean distributor', barriers: ['Korean language mandatory', 'KC safety certification for electronics', 'Complex customs documentation'], post_brexit: false, min_order: 2500, population: 52, gdp_per_capita: 32000 },
  in:  { notes: 'World\'s fastest-growing major ecommerce market. English widely spoken in business. Strong UK brand heritage. Flipkart and Amazon.in dominate. 300m+ middle class consumers.', logistics_note: 'Air freight 9-11hrs. Sea freight 18-25 days to Mumbai or Chennai.', entry_route: 'Amazon.in, Flipkart, or Indian distributor', barriers: ['High import duties (20-40%)', 'Complex GST regime', 'Local content requirements', 'Regulatory approval for food/health'], post_brexit: false, min_order: 2000, population: 1400, gdp_per_capita: 2500 },
  sg:  { notes: 'Asia\'s premier business hub. English-speaking, zero import duties on most goods, world-class logistics. Gateway to ASEAN — goods sold in Singapore often distribute across Southeast Asia.', logistics_note: 'Air freight 13-14hrs. Changi Airport is Asia\'s best connected.', entry_route: 'Lazada, Shopee, or Singapore distributor as ASEAN hub', barriers: ['Small domestic market — value is ASEAN gateway', 'High operational costs', 'GST registration above threshold'], post_brexit: false, min_order: 1500, population: 6, gdp_per_capita: 65000 },
  my:  { notes: 'Strong British heritage, high English proficiency, CPTPP member. Lazada and Shopee dominate. Growing middle class. Halal certification opens the wider ASEAN Muslim market.', logistics_note: 'Air freight 13hrs. Sea freight 22-28 days to Port Klang.', entry_route: 'Lazada or Shopee Malaysia, or Malaysian distributor', barriers: ['Halal certification needed for food/health', 'SST registration', 'Malay language content preferred'], post_brexit: false, min_order: 1500, population: 33, gdp_per_capita: 12000 },
  br:  { notes: 'Latin America\'s largest economy and ecommerce market. Mercado Livre dominates. High appetite for international brands. Complex tax structure but significant premium opportunity.', logistics_note: 'Air freight 11-14hrs. Sea freight 18-25 days to Santos or Rio.', entry_route: 'Mercado Livre marketplace or Brazilian distributor', barriers: ['Very high import duties (60%+ on many goods)', 'Complex ICMS state tax', 'Portuguese language required', 'Customs clearance can take weeks'], post_brexit: false, min_order: 3000, population: 215, gdp_per_capita: 9000 },
  ae:  { notes: 'Highest purchasing power in MENA. 5% flat import duty. Noon.com and Amazon.ae dominate. Strong demand for premium UK brands. Dubai is the MENA logistics hub.', logistics_note: 'Dubai 7hrs from London. World-class logistics.', entry_route: 'Noon.com, Amazon.ae, or UAE distributor', barriers: ['Halal requirements for food', 'Arabic labelling required', 'Product registration for health/beauty'], post_brexit: false, min_order: 3000, population: 10, gdp_per_capita: 44000 },
  sa:  { notes: 'Fastest-growing ecommerce in the Gulf. Vision 2030 driving consumer spending surge. Young population (70% under 35). Noon.com is the leading platform.', logistics_note: 'Riyadh 6.5hrs from London.', entry_route: 'Noon.com or local Saudi distributor', barriers: ['SASO product certification required', 'Arabic labelling mandatory', 'Halal certification for food'], post_brexit: false, min_order: 2500, population: 36, gdp_per_capita: 23000 },
  ng:  { notes: 'Largest market in sub-Saharan Africa. Strong UK brand preference. English-speaking. Jumia and Konga active. Invoice in USD to protect against Naira volatility.', logistics_note: 'Lagos air freight 6.5hrs. Sea freight 18-22 days.', entry_route: 'Jumia Nigeria or Lagos-based distributor', barriers: ['Naira currency volatility', 'Complex import clearance', 'SON product certification', 'Port congestion at Apapa'], post_brexit: false, min_order: 2000, population: 220, gdp_per_capita: 2100 },
  za:  { notes: 'Africa\'s most developed consumer market. Takealot dominates ecommerce. Consumer behaviour closest to UK. Rand weakness creates export competitiveness.', logistics_note: 'Cape Town/Johannesburg 11hrs. Well-developed infrastructure.', entry_route: 'Takealot marketplace or South African distributor', barriers: ['Rand volatility', 'SABS product standards', 'Load shedding affects retail'], post_brexit: false, min_order: 2000, population: 60, gdp_per_capita: 6000 },
  ke:  { notes: 'East Africa\'s commercial hub. Strong UK affinity. Nairobi is a gateway to East Africa. M-Pesa enables mobile payments. Growing fintech ecosystem.', logistics_note: 'Nairobi air freight 8.5hrs. Good road to Uganda, Tanzania, Rwanda.', entry_route: 'Jumia Kenya or Nairobi distributor', barriers: ['EAC import duties', 'Standards compliance (KEBS)', 'KES currency risk'], post_brexit: false, min_order: 1500, population: 55, gdp_per_capita: 2100 },
  gh:  { notes: 'West Africa\'s most stable and business-friendly market. High UK brand affinity. ECOWAS member — gateway to wider West Africa. English-speaking throughout.', logistics_note: 'Accra air freight 6hrs. Tema port for sea freight.', entry_route: 'Local Accra distributor or direct to retailers', barriers: ['High import duties', 'GHS currency volatility', 'Limited ecommerce infrastructure'], post_brexit: false, min_order: 1000, population: 33, gdp_per_capita: 2500 },
  eg:  { notes: 'Fastest-growing ecommerce in Africa by rate. 105m population. Currency devaluation creates UK export competitiveness. Noon.com and Jumia Egypt active.', logistics_note: 'Cairo 5hrs from London. Suez Canal proximity is an advantage.', entry_route: 'Noon.com Egypt or Egyptian distributor', barriers: ['EGP volatility', 'Arabic labelling required', 'Import licensing', 'Halal certification'], post_brexit: false, min_order: 1500, population: 105, gdp_per_capita: 3800 },
  mx:  { notes: 'Latin America\'s second largest ecommerce market. Mercado Livre and Amazon.com.mx active. Growing middle class. Possible nearshore US distribution.', logistics_note: 'Air freight 11-13hrs. Sea freight 18-25 days.', entry_route: 'Mercado Livre Mexico or Mexican distributor', barriers: ['Spanish language required', 'Complex import duties', 'MXN volatility', 'COFEPRIS for health/beauty'], post_brexit: false, min_order: 2000, population: 130, gdp_per_capita: 10000 },
}

// ── Score market for query or profile ────────────────────────
function getScore(market: typeof EXPORT_MARKETS[0], sectorHints: string, preference: string): number {
  const q = parseExportQuery(sectorHints + ' ' + preference)
  return scoreForQuery(market, q)
}

function getLabel(score: number, tc: (k: string) => string): { label: string; colour: string } {
  if (score >= 75) return { label: tc('intel_exportmarkets.fitStrong'),   colour: '#16a34a' }
  if (score >= 60) return { label: tc('intel_exportmarkets.fitGood'),     colour: ACC }
  if (score >= 45) return { label: tc('intel_exportmarkets.fitPossible'), colour: '#d97706' }
  return                  { label: tc('intel_exportmarkets.fitWeak'),     colour: '#9ca3af' }
}

function buildDutyLabel(tc: (k: string) => string): Record<string, { label: string; colour: string }> {
  return {
    very_favourable: { label: tc('intel_exportmarkets.dutyVeryFavourable'), colour: '#16a34a' },
    favourable:      { label: tc('intel_exportmarkets.dutyFavourable'),     colour: '#16a34a' },
    post_brexit:     { label: tc('intel_exportmarkets.dutyPostBrexit'),     colour: '#d97706' },
    moderate:        { label: tc('intel_exportmarkets.dutyModerate'),       colour: '#d97706' },
    complex:         { label: tc('intel_exportmarkets.dutyComplex'),        colour: '#dc2626' },
  }
}

function buildTierLabel(tc: (k: string) => string): Record<number, string> {
  return {
    1: tc('intel_exportmarkets.tier1'),
    2: tc('intel_exportmarkets.tier2'),
    3: tc('intel_exportmarkets.tier3'),
  }
}

// ── Main component ────────────────────────────────────────────
export default function ExportMarkets({ onAsk, sym = '£' }: { onAsk: (prompt: string) => void; sym?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tc } = useLang()

  const DUTY_LABEL = buildDutyLabel(tc)
  const TIER_LABEL = buildTierLabel(tc)

  const [profile,      setProfile]      = useState<any>(null)
  const [loading,      setLoading]      = useState(true)
  const [expanded,     setExpanded]     = useState<string | null>(null)
  const [sortBy,       setSortBy]       = useState<'score' | 'growth' | 'duty' | 'logistics' | 'premium'>('score')
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [filterTier,   setFilterTier]   = useState<number | 'all'>('all')
  const [searchQuery,  setSearchQuery]  = useState('')
  const [ukPremium,    setUkPremium]    = useState(18)
  const [hasProducts,  setHasProducts]  = useState(false)
  const [sectorHints,  setSectorHints]  = useState('')
  const [homeMarketId, setHomeMarketId] = useState<string | null>(null)

  useEffect(() => {
    // Load user profile to personalise
    Promise.all([
      fetch('/api/profile').then(r => r.ok ? r.json() : null),
      fetch('/api/cost-profile').then(r => r.ok ? r.json() : null),
    ]).then(([prof, cost]) => {
      if (prof) {
        setSectorHints((prof.sector_hints || '') + ' ' + (prof.business_type || ''))
        // Determine home market from currency
        const cur = (prof.currency || 'GBP').toUpperCase()
        const home = EXPORT_MARKETS.find(m => m.currency === cur)
        setHomeMarketId(home?.id || null)
        // UK brand premium — adjust if user is not UK-based
        if (cur === 'USD') setUkPremium(12)
        else if (cur === 'AUD') setUkPremium(20)
        else setUkPremium(18)
      }
      if (cost?.product_lines?.length > 0) setHasProducts(true)
      setProfile({ prof, cost })
    }).finally(() => setLoading(false))

    // Check if deep-linked to a specific market
    const marketParam = searchParams?.get('market')
    if (marketParam) setExpanded(marketParam)
  }, [])

  // ── Filter + sort markets ─────────────────────────────────────
  const regions = ['all', ...Array.from(new Set(EXPORT_MARKETS.map(m => m.region)))]

  const scored = EXPORT_MARKETS
    .filter(m => m.id !== homeMarketId)  // exclude home market
    .map(m => {
      const pref = sortBy === 'score' ? '' : sortBy
      const score = getScore(m, sectorHints, pref)
      return { ...m, score, ...getLabel(score, tc) }
    })

  const filtered = scored
    .filter(m => filterRegion === 'all' || m.region === filterRegion)
    .filter(m => filterTier === 'all' || m.tier === filterTier)
    .filter(m => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      // Direct match: market name, region, or category slug
      if (m.name.toLowerCase().includes(q) ||
          m.region.toLowerCase().includes(q) ||
          m.hot_categories.some(c => c.includes(q))) return true
      // Category inference: e.g. "sesame" → food_beverage via parseExportQuery
      const parsed = parseExportQuery(q)
      if (parsed.specificMarkets.length > 0) return parsed.specificMarkets.includes(m.id)
      if (parsed.regions.length > 0) return parsed.regions.some(r => m.region === r || m.region.includes(r))
      if (parsed.categories.length > 0) return m.hot_categories.some(c => parsed.categories.includes(c))
      // Unknown product keyword — show all markets ranked by score rather than 0 results
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score')     return b.score - a.score
      if (sortBy === 'growth')    return b.ecommerce_growth - a.ecommerce_growth
      if (sortBy === 'duty')      return ['very_favourable','favourable','post_brexit','moderate','complex'].indexOf(a.duty_environment) - ['very_favourable','favourable','post_brexit','moderate','complex'].indexOf(b.duty_environment)
      if (sortBy === 'logistics') return b.logistics_score - a.logistics_score
      if (sortBy === 'premium')   return b.uk_brand_premium - a.uk_brand_premium
      return 0
    })

  const hasBrexit = filtered.some(m => m.duty_environment === 'post_brexit')
  const topMarket = filtered[0]

  // Was the search a direct hit, or did we fall back to showing all markets?
  const searchIsDirectHit = searchQuery
    ? scored.some(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hot_categories.some(c => c.includes(searchQuery.toLowerCase())) ||
        (() => { const p = parseExportQuery(searchQuery.toLowerCase()); return p.specificMarkets.length > 0 || p.regions.length > 0 || p.categories.length > 0 })()
      )
    : true

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 14, background: EV }}/>)}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 4 }}>
          {tc('intel_exportmarkets.heading')}
        </div>
        <div style={{ fontSize: 11, color: TX2, lineHeight: 1.6 }}>
          {sectorHints.trim()
            ? tc('intel_exportmarkets.subheadingWithSector').replace('{count}', String(EXPORT_MARKETS.length))
            : tc('intel_exportmarkets.subheading').replace('{count}', String(EXPORT_MARKETS.length))}
          {hasProducts ? tc('intel_exportmarkets.subheadingWithProducts') : ''}
        </div>
      </div>

      {/* Post-Brexit banner if EU markets visible */}
      {hasBrexit && (
        <div style={{ padding: '11px 14px', background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 11, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <div style={{ fontSize: 10, color: TX2, lineHeight: 1.55 }}>
            <strong style={{ color: '#d97706' }}>{tc('intel_exportmarkets.brexitBannerTitle')}</strong> {tc('intel_exportmarkets.brexitBannerBody')}
            <button onClick={() => onAsk(tc('intel_exportmarkets.brexitBannerAskPrompt'))}
              style={{ display: 'inline', marginLeft: 8, fontSize: 10, color: '#d97706', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0 }}>
              {tc('intel_exportmarkets.brexitBannerCta')}
            </button>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={tc('intel_exportmarkets.searchPlaceholder')}
          style={{ width: '100%', padding: '9px 12px 9px 32px', fontSize: 11, background: SF, border: `1px solid ${B2}`, borderRadius: 10, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: TX3, fontSize: 14, lineHeight: 1 }}>×</button>
        )}
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Region filter */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {regions.map(r => (
            <button key={r} onClick={() => setFilterRegion(r)}
              style={{ fontSize: 9, fontWeight: filterRegion === r ? 600 : 400, color: filterRegion === r ? ACC : TX3, background: filterRegion === r ? 'rgba(208,138,89,.08)' : 'transparent', border: `1px solid ${filterRegion === r ? 'rgba(208,138,89,.3)' : B}`, borderRadius: 9999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {r === 'all' ? tc('intel_exportmarkets.allRegions') : r}
            </button>
          ))}
        </div>

        {/* Tier filter */}
        <div style={{ display: 'flex', gap: 5 }}>
          {(['all', 1, 2, 3] as const).map(t => (
            <button key={t} onClick={() => setFilterTier(t)}
              style={{ fontSize: 9, fontWeight: filterTier === t ? 600 : 400, color: filterTier === t ? '#6366F1' : TX3, background: filterTier === t ? 'rgba(99,102,241,.08)' : 'transparent', border: `1px solid ${filterTier === t ? 'rgba(99,102,241,.3)' : B}`, borderRadius: 9999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {t === 'all' ? tc('intel_exportmarkets.allTiers') : tc('intel_exportmarkets.tierLabel').replace('{n}', String(t))}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: TX3 }}>{tc('intel_exportmarkets.sortLabel')}</span>
          {([['score', tc('intel_exportmarkets.sortScore')], ['growth', tc('intel_exportmarkets.sortGrowth')], ['duty', tc('intel_exportmarkets.sortDuty')], ['logistics', tc('intel_exportmarkets.sortLogistics')], ['premium', tc('intel_exportmarkets.sortPremium')]] as const).map(([s, label]) => (
            <button key={s} onClick={() => setSortBy(s as typeof sortBy)}
              style={{ fontSize: 9, fontWeight: sortBy === s ? 600 : 400, color: sortBy === s ? ACC : TX3, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 5px', whiteSpace: 'nowrap' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* No product data nudge */}
      {!hasProducts && (
        <div style={{ padding: '10px 14px', background: 'rgba(208,138,89,.04)', border: '1px solid rgba(208,138,89,.15)', borderRadius: 10, marginBottom: 12, fontSize: 10, color: TX3 }}>
          💡 <strong style={{ color: TX2 }}>{tc('intel_exportmarkets.noProductsNudgeCta')}</strong> {tc('intel_exportmarkets.noProductsNudge')}
        </div>
      )}

      {/* Results count */}
      <div style={{ fontSize: 10, color: TX3, marginBottom: 10 }}>
        {filtered.length !== 1
          ? tc('intel_exportmarkets.resultsCountPlural').replace('{n}', String(filtered.length))
          : tc('intel_exportmarkets.resultsCount').replace('{n}', String(filtered.length))}
        {searchQuery && searchIsDirectHit ? tc('intel_exportmarkets.resultsMatching').replace('{query}', searchQuery) : ''}
        {searchQuery && !searchIsDirectHit ? ` · no exact match for "${searchQuery}" — showing all markets` : ''}
        {topMarket && !searchQuery ? tc('intel_exportmarkets.topOpportunity').replace('{flag}', topMarket.flag).replace('{name}', topMarket.name) : ''}
      </div>

      {/* Market cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', background: SF, border: `1px solid ${B}`, borderRadius: 14 }}>
          <div style={{ fontSize: 11, color: TX3 }}>{tc('intel_exportmarkets.noMarketsMessage')}</div>
          <button onClick={() => { setSearchQuery(''); setFilterRegion('all'); setFilterTier('all') }}
            style={{ marginTop: 10, fontSize: 10, color: ACC, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{tc('intel_exportmarkets.clearFilters')}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {filtered.map(m => {
            const detail = MARKET_DETAIL[m.id]
            const isOpen = expanded === m.id
            const duty = DUTY_LABEL[m.duty_environment] || { label: m.duty_environment, colour: TX3 }
            const tierLabel = TIER_LABEL[m.tier]

            return (
              <div key={m.id} style={{ background: SF, border: `1px solid ${isOpen ? 'rgba(208,138,89,.35)' : B}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 200ms' }}>

                {/* Header row */}
                <div onClick={() => setExpanded(isOpen ? null : m.id)}
                  style={{ padding: '13px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>

                  {/* Flag + score */}
                  <div style={{ width: 44, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, lineHeight: 1 }}>{m.flag}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: m.colour, marginTop: 2 }}>{m.score}</div>
                  </div>

                  {/* Name + metrics */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>{m.name}</span>
                      <span style={{ fontSize: 9, color: TX3 }}>{m.region}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: m.colour, background: `${m.colour}15`, padding: '1px 7px', borderRadius: 9999 }}>{m.label}</span>
                      <span style={{ fontSize: 9, color: TX3, background: EV, padding: '1px 7px', borderRadius: 9999 }}>{tierLabel}</span>
                      {detail?.post_brexit && <span style={{ fontSize: 9, fontWeight: 600, color: '#d97706', background: 'rgba(245,158,11,.1)', padding: '1px 7px', borderRadius: 9999 }}>{tc('intel_exportmarkets.postBrexitChecks')}</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '0 14px' }}>
                      {[
                        { label: tc('intel_exportmarkets.metricGrowth'),    value: `+${m.ecommerce_growth}%`, colour: m.ecommerce_growth >= 30 ? '#16a34a' : TX },
                        { label: tc('intel_exportmarkets.metricUkPremium'), value: `+${m.uk_brand_premium}%`, colour: m.uk_brand_premium >= 20 ? '#16a34a' : TX },
                        { label: tc('intel_exportmarkets.metricLogistics'), value: `${m.logistics_score}/100`, colour: m.logistics_score >= 85 ? '#16a34a' : m.logistics_score >= 70 ? TX : '#d97706' },
                        { label: tc('intel_exportmarkets.metricDuty'),      value: duty.label, colour: duty.colour },
                        { label: tc('intel_exportmarkets.metricCurrency'),  value: m.currency, colour: TX3 },
                      ].map((item, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 9, color: TX3 }}>{item.label}</div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: item.colour, whiteSpace: 'nowrap' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {/* Expanded detail */}
                {isOpen && detail && (
                  <div style={{ borderTop: `1px solid ${B}`, padding: '15px 15px 17px', background: EV }}>

                    {/* Overview */}
                    <div style={{ background: SF, borderRadius: 11, padding: '12px 14px', marginBottom: 13, fontSize: 11, color: TX2, lineHeight: 1.65 }}>
                      {detail.notes}
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 9, marginBottom: 13 }}>
                      {[
                        { label: tc('intel_exportmarkets.detailPopulation'), value: `${detail.population}m` },
                        { label: tc('intel_exportmarkets.detailGdp'),        value: `$${detail.gdp_per_capita.toLocaleString()}` },
                        { label: tc('intel_exportmarkets.detailMinOrder'),   value: `${sym}${detail.min_order.toLocaleString()}` },
                        { label: tc('intel_exportmarkets.detailEntryRoute'), value: detail.entry_route.split(',')[0].split(' or ')[0] },
                      ].map((item, i) => (
                        <div key={i} style={{ background: SF, borderRadius: 9, padding: '9px 11px', border: `1px solid ${B}` }}>
                          <div style={{ fontSize: 9, color: TX3, marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: TX }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Logistics + barriers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 13 }}>
                      <div style={{ background: SF, borderRadius: 10, padding: '11px 13px', border: `1px solid ${B}` }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intel_exportmarkets.sectionLogistics')}</div>
                        <div style={{ fontSize: 10, color: TX2, lineHeight: 1.55 }}>{detail.logistics_note}</div>
                        <div style={{ marginTop: 6, fontSize: 10, color: TX2 }}>{tc('intel_exportmarkets.logisticsEntry').replace('{route}', detail.entry_route)}</div>
                      </div>
                      <div style={{ background: 'rgba(239,68,68,.04)', borderRadius: 10, padding: '11px 13px', border: '1px solid rgba(239,68,68,.15)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intel_exportmarkets.sectionBarriers')}</div>
                        {detail.barriers.map((b, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'flex-start' }}>
                            <span style={{ color: '#dc2626', fontSize: 9, marginTop: 2, flexShrink: 0 }}>▸</span>
                            <span style={{ fontSize: 10, color: TX2, lineHeight: 1.45 }}>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hot categories */}
                    <div style={{ marginBottom: 13 }}>
                      <div style={{ fontSize: 9, color: TX3, marginBottom: 7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('intel_exportmarkets.sectionHotCategories').replace('{market}', m.name)}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {m.hot_categories.map(c => (
                          <span key={c} style={{ fontSize: 9, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '2px 10px', textTransform: 'capitalize' }}>
                            {c.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ask buttons */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => onAsk(tc('intel_exportmarkets.askStartExportingPrompt').replace('{market}', m.name).replace('{score}', String(m.score)))}
                        style={{ fontSize: 10, fontWeight: 600, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9, padding: '7px 13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {tc('intel_exportmarkets.askStartExportingButton').replace('{market}', m.name)}
                      </button>
                      {detail.post_brexit && (
                        <button
                          onClick={() => onAsk(tc('intel_exportmarkets.brexitGuidePrompt').replace('{market}', m.name))}
                          style={{ fontSize: 10, color: '#d97706', background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 9, padding: '7px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {tc('intel_exportmarkets.brexitGuideButton')}
                        </button>
                      )}
                      <button
                        onClick={() => onAsk(tc('intel_exportmarkets.dutyRatesPrompt').replace('{market}', m.name))}
                        style={{ fontSize: 10, color: TX3, background: 'transparent', border: `1px solid ${B2}`, borderRadius: 9, padding: '7px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {tc('intel_exportmarkets.dutyRatesButton')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 14, fontSize: 9, color: TX3, textAlign: 'center', lineHeight: 1.6 }}>
        {sectorHints.trim()
          ? tc('intel_exportmarkets.footerWithSector').replace('{count}', String(EXPORT_MARKETS.length))
          : tc('intel_exportmarkets.footer').replace('{count}', String(EXPORT_MARKETS.length))}
        {' '}{tc('intel_exportmarkets.footerCta')}
      </div>
    </div>
  )
}
