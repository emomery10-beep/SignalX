// ── /api/market-climate ───────────────────────────────────────────────────────
// Turns today's macro + product-level conditions into a personalised business
// warning. Reads: POS/receipt scan history, supplier sourcing context, location.
// Searches: Tavily + Google (Serper) in parallel for product prices, shipping
// disruptions, and market rates — all specific to what THIS business sells and
// where they source it from.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'
import { marketSearch } from '@/lib/market-search'
import { tavilySearch } from '@/lib/tavily'
import {
  getCountryClimate, isCountryMapped, getCountryName,
  detectSector, detectShippingLanes, getPortWatch,
  detectBusinessCommodities, SIGNAL_KIND_WEIGHT,
  classifyChannel, buildRetailSignals,
  type MarketSignalSpec, type CountryClimate, type ChannelMix,
} from '@/lib/market-climate-config'
import type { SupplierSource } from '@/app/api/supplier-context/route'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

// Persistent cache: the expensive result (signals + supply + narrative) is kept
// in Supabase for 12h so the Tavily/Claude work runs at most ~twice a day per
// business. A forced refresh is only honoured once the cache is older than
// FORCE_MIN_MS, so the refresh button can't burn credits on repeat taps.
const CACHE_TTL_MS = 12 * 60 * 60 * 1000
const FORCE_MIN_MS = 11 * 60 * 60 * 1000

interface SignalReading {
  key: string
  label: string
  kind: string
  value: string          // e.g. '₦1,620' or '▼ 3.2%'
  direction: 'up' | 'down' | 'flat'
  changePct: number | null
  summary: string        // one-line plain-English read
  hasData: boolean       // true only when Tavily returned a real reading
}

interface SupplyReading {
  lanes: Array<{ lane: string; route: string; status: string; severity: 'ok' | 'watch' | 'alert' }>
  port: { port: string; status: string; severity: 'ok' | 'watch' | 'alert' } | null
}

// Pull a single signal using dual search (Tavily + Google). Falls back to a
// rephrased query so transient Tavily outages don't leave cards blank.
async function readSignal(spec: MarketSignalSpec): Promise<SignalReading> {
  const fallbackQuery = spec.query
    .replace(/today/gi, 'latest')
    .replace(/current/gi, 'recent')
  const res = await marketSearch(spec.query, {
    topic: 'news',
    days: 3,
    fallbackQuery,
  })
  const answer = res.answer
  const hasData = res.hasData
  const { value, direction, changePct } = parseSignal(answer, spec.kind)
  return {
    key: spec.key, label: spec.label, kind: spec.kind,
    value: hasData ? value : '—', direction, changePct,
    summary: hasData ? answer.slice(0, 160).trim() : 'No fresh reading available.',
    hasData,
  }
}

// Build product-specific signal specs from supplier context.
// e.g. "Vaseline sourced from UK" → query "Vaseline petroleum jelly wholesale
// price UK 2025" + "GBP/KES exchange rate today"
function buildSupplierSignals(
  sources: SupplierSource[],
  climate: CountryClimate,
): MarketSignalSpec[] {
  const specs: MarketSignalSpec[] = []
  const seen = new Set<string>()

  for (const src of sources.slice(0, 6)) {
    const p = src.product.trim()
    const country = src.sourceCountry.trim()
    const currency = src.currency || ''

    // Product price in source market
    const priceKey = `price_${p.toLowerCase().replace(/\s+/g, '_').slice(0, 16)}`
    if (!seen.has(priceKey)) {
      seen.add(priceKey)
      specs.push({
        key: priceKey,
        label: `${p.slice(0, 20)} price`,
        query: `${p} wholesale price ${country} ${new Date().getFullYear()} supplier cost`,
        kind: 'commodity',
      })
    }

    // FX pair if they pay in a foreign currency
    if (currency && currency !== climate.currency) {
      const fxKey = `fx_${currency.toLowerCase()}`
      if (!seen.has(fxKey)) {
        seen.add(fxKey)
        specs.push({
          key: fxKey,
          label: `${currency} / ${climate.currency}`,
          query: `${currency} to ${climate.currency} exchange rate today`,
          kind: 'fx',
        })
      }
    }

    // Shipping disruption for the source country → destination
    const laneKey = `lane_${country.toLowerCase().replace(/\s+/g, '_').slice(0, 12)}`
    if (!seen.has(laneKey)) {
      seen.add(laneKey)
      specs.push({
        key: laneKey,
        label: `${country} → ${climate.name}`,
        query: `shipping freight disruption ${country} to ${climate.name} 2025 delay`,
        kind: 'demand',
      })
    }
  }

  return specs.slice(0, 8)
}

// Lightweight numeric/direction parser — best-effort, degrades to neutral.
function parseSignal(text: string, kind: string): { value: string; direction: 'up' | 'down' | 'flat'; changePct: number | null } {
  if (!text) return { value: '—', direction: 'flat', changePct: null }
  const lower = text.toLowerCase()
  // direction cues
  let direction: 'up' | 'down' | 'flat' = 'flat'
  if (/(fell|fall|drop|down|declin|lower|weaken|slump|loss|slid|tumbl|plunge)/.test(lower)) direction = 'down'
  else if (/(rose|rise|gain|up|higher|surge|climb|strengthen|jump|rally|advanc)/.test(lower)) direction = 'up'
  // percent change
  const pctMatch = text.match(/(-?\d+(?:\.\d+)?)\s?(?:%|percent)/)
  const changePct = pctMatch ? Math.abs(parseFloat(pctMatch[1])) : null
  // headline number for the value chip
  let value = '—'
  if (kind === 'fx') {
    const fxMatch = text.match(/([₦$£€]\s?\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?\s?(?:naira|shilling|cedi|rand))/i)
    value = fxMatch ? fxMatch[0].trim() : (changePct != null ? `${direction === 'down' ? '▼' : direction === 'up' ? '▲' : ''} ${changePct}%` : '—')
  } else if (changePct != null) {
    value = `${direction === 'down' ? '▼' : direction === 'up' ? '▲' : ''} ${changePct}%`
  } else {
    const numMatch = text.match(/\d[\d,]*(?:\.\d+)?/)
    value = numMatch ? numMatch[0] : '—'
  }
  return { value, direction, changePct }
}

// Map a freight/port Tavily answer to a coarse severity.
function gradeDisruption(text: string): { status: string; severity: 'ok' | 'watch' | 'alert' } {
  if (!text) return { status: 'No major disruption reported', severity: 'ok' }
  const lower = text.toLowerCase()
  const status = text.slice(0, 140).trim()
  if (/(severe|crisis|halt|blockage|surge|spike|major delay|congest|backlog|reroute|diversion|attack)/.test(lower))
    return { status, severity: 'alert' }
  if (/(delay|elevated|rising|pressure|slow|disrupt|risk|caution)/.test(lower))
    return { status, severity: 'watch' }
  return { status, severity: 'ok' }
}

// Choose the signals that actually move THIS business. LLM picks commodities/
// demand specific to what they trade; falls back to a keyword map + country
// anchors. Local FX is always included (it's the universal import-cost driver).
async function selectBusinessSignals(input: {
  climate: CountryClimate
  businessTerms: string[]
  sectorLabel: string
  channelMix: ChannelMix
  userId: string
}): Promise<MarketSignalSpec[]> {
  const { climate, channelMix } = input
  const dedupe = (specs: MarketSignalSpec[]) => {
    const seen = new Set<string>(); const out: MarketSignalSpec[] = []
    for (const s of specs) if (s && !seen.has(s.key)) { seen.add(s.key); out.push(s) }
    return out.slice(0, 6)
  }
  // Deterministic fallback: local FX + what they trade. Commodity businesses get
  // commodity prices + index; retail/ecommerce businesses get consumer-demand and
  // ad-cost signals tuned to how they sell.
  const kwCommodities = detectBusinessCommodities(input.businessTerms)
  const retail = buildRetailSignals(climate, channelMix)
  const fallback = dedupe(
    kwCommodities.length
      ? [climate.fx, ...kwCommodities, climate.index, climate.centralBank]
      : [climate.fx, ...retail, climate.centralBank]
  )

  if (!process.env.GROQ_API_KEY || input.businessTerms.length === 0) return fallback

  const channelLine = channelMix.hasEcommerce && channelMix.hasPos
    ? `They sell both online (${channelMix.ecommercePct}% of revenue via ecommerce) and in-store (${channelMix.posPct}% via POS).`
    : channelMix.hasEcommerce ? 'They sell primarily ONLINE (ecommerce).'
    : channelMix.hasPos ? 'They sell primarily IN-STORE (POS / physical shop).'
    : 'Channel mix unknown.'

  const prompt = `A business in ${climate.name} (sector: ${input.sectorLabel}) trades in: ${input.businessTerms.join(', ')}.
${channelLine}

Pick the 4–5 LIVE market signals that most affect THIS business's costs, selling prices, or demand — specific to what they actually trade and how they sell, not generic national indices.
- Commodity producer/exporter → the commodity's world price AND its key import-market demand.
- Importer/retailer → the relevant input/import price and FX.
- ONLINE sellers → include a digital ad-cost / CAC signal (Meta/Google) and consumer demand — these drive their economics.
- IN-STORE sellers → include local consumer spending / footfall.

Always include the local currency vs USD (${climate.fx.label}). Return ONLY JSON:
{"signals":[{"key":"short_slug","label":"≤3 words","query":"web search for today's price/level/demand","kind":"commodity|demand|fx|index|rate"}]}`

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: GROQ_MODEL, max_tokens: 700, messages: [{ role: 'user', content: prompt }] }),
    })
    const groqData = await groqRes.json()
    logUsage({ route: '/api/market-climate#select', model: GROQ_MODEL, usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 }, userId: input.userId })
    const m = (groqData.choices?.[0]?.message?.content || '').match(/\{[\s\S]*\}/)
    if (!m) return fallback
    const parsed = JSON.parse(m[0]) as { signals?: Array<{ key?: string; label?: string; query?: string; kind?: string }> }
    const picked: MarketSignalSpec[] = (parsed.signals || [])
      .filter(s => s.key && s.label && s.query)
      .map(s => ({
        key: String(s.key).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 24),
        label: String(s.label).slice(0, 28),
        query: String(s.query).slice(0, 160),
        kind: (['commodity', 'demand', 'fx', 'index', 'rate'].includes(s.kind || '') ? s.kind : 'commodity') as MarketSignalSpec['kind'],
      }))
    if (!picked.length) return fallback
    // Guarantee local FX is present.
    if (!picked.some(p => p.kind === 'fx')) picked.unshift(climate.fx)
    return dedupe(picked)
  } catch {
    return fallback
  }
}

// Cheap, deterministic fields derived from the (cached or fresh) signals.
// Recomputed every request so they stay correct without re-hitting any API.
function computeDerived(signals: SignalReading[], supply: SupplyReading) {
  let weightedAdverse = 0, weightSum = 0
  for (const s of signals) {
    const w = SIGNAL_KIND_WEIGHT[s.kind] ?? 0.3
    weightSum += w
    if (s.changePct == null) continue
    const adverse = s.direction === 'down' || s.kind === 'fx'
    if (adverse) weightedAdverse += w * Math.min(s.changePct / 5, 1)
  }
  const base = Math.min(100, Math.round((weightedAdverse / Math.max(weightSum, 0.1)) * 100))
  const supplyPenalty = supply.lanes.filter(l => l.severity === 'alert').length * 12
    + supply.lanes.filter(l => l.severity === 'watch').length * 6
    + (supply.port?.severity === 'alert' ? 12 : supply.port?.severity === 'watch' ? 6 : 0)
  const totalSeverity = Math.min(100, base + supplyPenalty)
  const condition = totalSeverity >= 66 ? 'Stormy' : totalSeverity >= 33 ? 'Unsettled' : 'Calm'
  const conditionIcon = totalSeverity >= 66 ? '⛈️' : totalSeverity >= 33 ? '🌥️' : '☀️'
  const fxMovePct = signals.find(s => s.kind === 'fx')?.changePct ?? 0
  return { totalSeverity, condition, conditionIcon, fxMovePct }
}

function estExtraCost(fxMovePct: number, monthlyImportSpend: number, supply: SupplyReading) {
  const fxExtra = Math.round(monthlyImportSpend * (fxMovePct / 100))
  const freightExtra = supply.lanes.some(l => l.severity !== 'ok') ? Math.round(monthlyImportSpend * 0.04) : 0
  return Math.max(0, fxExtra + freightExtra)
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const params = new URL(request.url).searchParams
  const { currencySymbol: sym, countryCode: profileCountry } = await getUserLocale(supabase, user.id)

  // Location: profile country first, then Vercel IP geo header, then default.
  const ipCountry = request.headers.get('x-vercel-ip-country')
  const countryCode = profileCountry || ipCountry || null
  const climate = getCountryClimate(countryCode)
  const mapped = isCountryMapped(countryCode)
  const requestedCountry = getCountryName(countryCode)
  const forceRefresh = params.get('refresh') === '1'

  // Cash position bridged from the cost config (same pattern as the snapshot route).
  const cashBalance = Number(params.get('cash_balance') || 0)
  const monthlyFixed = Number(params.get('monthly_fixed_costs') || 0)

  // ── 1. Read this business's exposure from scanned/unified data (90 days) ─────
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const [{ data: records }, { data: posRecords }, { data: overridesRow }] = await Promise.all([
    supabase
      .from('unified_data')
      .select('category, product_name, currency, cost_price, units_sold, gross_revenue, channel, source_type')
      .eq('user_id', user.id)
      .gte('record_date', since)
      .limit(2000),
    // Also pull directly from POS scan history for product names
    supabase
      .from('pos_items')
      .select('name, category, sku')
      .eq('user_id', user.id)
      .limit(200),
    // Supplier context saved by user
    supabase
      .from('cost_profile_overrides')
      .select('overrides')
      .eq('user_id', user.id)
      .single(),
  ])

  const rows = records || []
  const posItems = posRecords || []

  // Merge product names from unified_data AND pos_items for richer signal selection
  const categories = Array.from(new Set(rows.map(r => r.category || r.product_name || '').filter(Boolean)))
  const productNames = Array.from(new Set([
    ...rows.map(r => r.product_name || ''),
    ...posItems.map(p => p.name || p.category || ''),
  ].filter(Boolean)))
  const sector = detectSector(categories)
  // Everything the business actually trades — feeds signal selection.
  const businessTerms = Array.from(new Set([...categories, ...productNames])).slice(0, 40)

  // Supplier sourcing context saved by user (where they buy each product from)
  const overrides = (overridesRow?.overrides as Record<string, unknown>) || {}
  const supplierContext = overrides.supplier_sources as { sources: SupplierSource[] } | undefined
  const supplierSources: SupplierSource[] = supplierContext?.sources || []

  // Products we know about but have no supplier origin for — these become prompts in the UI
  const knownProductsWithoutSource = businessTerms
    .filter(t => !supplierSources.some(s => s.product.toLowerCase() === t.toLowerCase()))
    .slice(0, 5)
    .map(product => ({ product }))

  // Channel mix — online vs in-store revenue share decides which demand signals
  // matter (ad cost / CAC for ecommerce; footfall / local spend for POS).
  let ecomRev = 0, posRev = 0, channelRev = 0
  for (const r of rows) {
    const rev = r.gross_revenue || 0
    const cls = classifyChannel(r.source_type || r.channel || '')
    if (cls === 'ecommerce') { ecomRev += rev; channelRev += rev }
    else if (cls === 'pos') { posRev += rev; channelRev += rev }
  }
  const channelMix: ChannelMix = {
    ecommercePct: channelRev > 0 ? Math.round((ecomRev / channelRev) * 100) : 0,
    posPct: channelRev > 0 ? Math.round((posRev / channelRev) * 100) : 0,
    hasEcommerce: ecomRev > 0,
    hasPos: posRev > 0,
  }

  // Spend by currency → import exposure + shipping lanes.
  const currencySpend = new Map<string, number>()
  let totalSpend = 0
  for (const r of rows) {
    const spend = (r.cost_price || 0) * (r.units_sold || 0)
    const cur = (r.currency || climate.currency).toUpperCase()
    currencySpend.set(cur, (currencySpend.get(cur) || 0) + spend)
    totalSpend += spend
  }
  const importCurrencies = Array.from(currencySpend.keys()).filter(c => c !== climate.currency && c !== 'GBP')
  const importSpend = importCurrencies.reduce((s, c) => s + (currencySpend.get(c) || 0), 0)
  const importPct = totalSpend > 0 ? Math.round((importSpend / totalSpend) * 100) : Math.round(sector.importIntensity * 100)
  const monthlyImportSpend = Math.round((importSpend / 3) || 0)
  const lanes = detectShippingLanes(importCurrencies.length ? importCurrencies : [climate.currency])
  const portWatch = getPortWatch(countryCode)

  // ── 2. Live signals (persistent 12h cache, capped force-refresh) ────────────
  // Keyed by what the business trades + how it sells, so two businesses in the
  // same country get different signals. Runway/cash params are NOT in the key —
  // those drive only cheap per-request maths, not the cached API result.
  const runwayMonths = (cashBalance > 0 && monthlyFixed > 0) ? Math.round((cashBalance / monthlyFixed) * 10) / 10 : null
  const termSig = businessTerms.join('|').toLowerCase().slice(0, 120)
  const chanSig = `${channelMix.hasEcommerce ? 'e' : ''}${channelMix.hasPos ? 'p' : ''}`
  const supplierSig = supplierSources.map(s => `${s.product}:${s.sourceCountry}`).join('|').slice(0, 80)
  const cacheKey = `${climate.code}:${sector.key}:${chanSig}:${termSig}:${supplierSig}`

  type CacheRow = { payload: { signals: SignalReading[]; supply: SupplyReading; narrative: Narrative }; fetched_at: string }
  let cacheRow: CacheRow | null = null
  try {
    const { data } = await supabase
      .from('market_climate_cache')
      .select('payload, fetched_at')
      .eq('user_id', user.id).eq('cache_key', cacheKey).maybeSingle()
    cacheRow = (data as unknown as CacheRow) || null
  } catch { cacheRow = null }  // table may not exist yet → treat as miss

  const ageMs = cacheRow ? Date.now() - new Date(cacheRow.fetched_at).getTime() : Infinity
  const forceAllowed = forceRefresh && ageMs >= FORCE_MIN_MS
  const useCache = !!cacheRow && ageMs < CACHE_TTL_MS && !forceAllowed

  let signals: SignalReading[]
  let supply: SupplyReading
  let narrative: Narrative
  let fetchedAt: string

  if (useCache && cacheRow) {
    signals = cacheRow.payload.signals
    supply = cacheRow.payload.supply
    narrative = cacheRow.payload.narrative
    fetchedAt = cacheRow.fetched_at
  } else {
    // Select signals: supplier-specific specs first, then AI-selected macro signals
    const supplierSpecs = buildSupplierSignals(supplierSources, climate)
    const macroSpecs = await selectBusinessSignals({ climate, businessTerms, sectorLabel: sector.label, channelMix, userId: user.id })
    // Merge: supplier specs take priority (they're the most personalised), then macro
    const seenKeys = new Set(supplierSpecs.map(s => s.key))
    const combinedSpecs = [
      ...supplierSpecs,
      ...macroSpecs.filter(s => !seenKeys.has(s.key)),
    ].slice(0, 8)

    // Supplier shipping lanes: derive from supplier source countries + currency lanes
    const supplierCountries = supplierSources.map(s => s.sourceCountry).filter(Boolean)
    const supplierCurrencies = supplierSources.map(s => s.currency).filter(Boolean) as string[]
    const allImportCurrencies = Array.from(new Set([...importCurrencies, ...supplierCurrencies]))
    const allLanes = detectShippingLanes(allImportCurrencies.length ? allImportCurrencies : [climate.currency])

    const [signalReadings, laneReadings, portReading] = await Promise.all([
      Promise.all(combinedSpecs.map(readSignal)),
      Promise.all(allLanes.map(async l => {
        const res = await marketSearch(l.freightQuery, { topic: 'news', days: 5,
          fallbackQuery: `${l.lane} shipping freight latest news disruption` })
        const graded = gradeDisruption(res.answer)
        return { lane: l.lane, route: l.route, status: graded.status, severity: graded.severity }
      })),
      portWatch
        ? marketSearch(portWatch.query, { topic: 'news', days: 7,
            fallbackQuery: `${portWatch.port} port shipping congestion latest` })
            .then(res => { const g = gradeDisruption(res.answer); return { port: portWatch.port, status: g.status, severity: g.severity } })
        : Promise.resolve(null),
    ])
    signals = signalReadings
    supply = { lanes: laneReadings, port: portReading }

    // Narrative needs provisional severity/cost; compute from the raw readings.
    const d0 = computeDerived(signals, supply)
    const estExtra0 = estExtraCost(d0.fxMovePct, monthlyImportSpend, supply)
    narrative = await buildNarrative({
      sym, condition: d0.condition, totalSeverity: d0.totalSeverity, climate, sector, signals, supply,
      importPct, estExtraMonthly: estExtra0, monthlyImportSpend, runwayMonths, userId: user.id,
    })
    // Merge Claude-cleaned values so cards show a real reading instead of "—",
    // but ONLY where Tavily actually returned data — never let the model invent
    // a value for a signal that had no live reading.
    const byKey = new Map((narrative.readings || []).map(r => [r.key, r]))
    signals = signals.map(s => {
      if (!s.hasData) return { ...s, value: '—', direction: 'flat', changePct: null }
      const r = byKey.get(s.key)
      return r && r.value && r.value !== '—'
        ? { ...s, value: r.value, direction: r.direction || s.direction, changePct: r.changePct ?? s.changePct }
        : s
    })
    fetchedAt = new Date().toISOString()
    try {
      await supabase.from('market_climate_cache').upsert(
        { user_id: user.id, cache_key: cacheKey, payload: { signals, supply, narrative }, fetched_at: fetchedAt },
        { onConflict: 'user_id,cache_key' },
      )
    } catch { /* table may not exist yet — serve fresh, don't break */ }
  }

  // ── 3. Cheap derived fields (fresh every request, from current cash config) ──
  const { totalSeverity, condition, conditionIcon } = computeDerived(signals, supply)
  const estExtraMonthly = estExtraCost(computeDerived(signals, supply).fxMovePct, monthlyImportSpend, supply)

  return NextResponse.json({
    currency_symbol: sym,
    country: mapped ? climate.name : requestedCountry,
    country_code: climate.code,
    mapped,
    requested_country: requestedCountry,
    sector: { key: sector.key, label: sector.label, icon: sector.icon, import_pct: importPct },
    tracking: {
      sector: sector.label,
      channel: channelMix.hasEcommerce && channelMix.hasPos ? 'ecommerce + POS'
        : channelMix.hasEcommerce ? 'online'
        : channelMix.hasPos ? 'in-store' : null,
    },
    condition,
    condition_icon: conditionIcon,
    severity: totalSeverity,
    signals,
    supply,
    exposure: {
      est_extra_monthly: estExtraMonthly,
      monthly_import_spend: monthlyImportSpend,
      import_pct: importPct,
      runway_months: runwayMonths,
      cash_balance: cashBalance,
      monthly_fixed: monthlyFixed,
    },
    narrative,
    // Supplier intelligence
    supplier_sources: supplierSources,
    // Products we track but don't know the source country for — shown as prompts in UI
    missing_context: knownProductsWithoutSource,
    updated_at: fetchedAt,
    cached: useCache,
  })
}

interface NarrativeInput {
  sym: string; condition: string; totalSeverity: number
  climate: ReturnType<typeof getCountryClimate>
  sector: ReturnType<typeof detectSector>
  signals: SignalReading[]; supply: SupplyReading
  importPct: number; estExtraMonthly: number; monthlyImportSpend: number
  runwayMonths: number | null; userId: string
}

interface Narrative {
  headline: string
  body: string
  opportunity: string | null
  timeline: Array<{ when: string; title: string; detail: string; severity: 'alert' | 'watch' | 'info' }>
  actions: Array<{ urgency: 'urgent' | 'soon' | 'watch'; title: string; detail: string }>
  readings?: Array<{ key: string; value: string; direction: 'up' | 'down' | 'flat'; changePct: number | null }>
}

async function buildNarrative(input: NarrativeInput): Promise<Narrative> {
  const fallback: Narrative = {
    headline: `${input.condition} conditions for ${input.sector.label.toLowerCase()}`,
    body: `Market signals are ${input.condition.toLowerCase()} today. About ${input.importPct}% of your stock is import-exposed.`,
    opportunity: null,
    timeline: [],
    actions: [],
  }
  if (!process.env.GROQ_API_KEY) return fallback

  const signalLines = input.signals.map(s => `- [${s.key}] ${s.label}: ${s.value} (${s.direction}${s.changePct != null ? `, ${s.changePct}%` : ''}) — ${s.summary}`).join('\n')
  const supplyLines = [
    ...input.supply.lanes.map(l => `- Lane ${l.lane} via ${l.route}: ${l.severity.toUpperCase()} — ${l.status}`),
    input.supply.port ? `- Port ${input.supply.port.port}: ${input.supply.port.severity.toUpperCase()} — ${input.supply.port.status}` : '',
  ].filter(Boolean).join('\n')

  const prompt = `You advise a small business owner in ${input.climate.name}. Their business is ${input.sector.label}. About ${input.importPct}% of their stock cost is import-exposed, ~${input.sym}${input.monthlyImportSpend.toLocaleString()}/month. ${input.runwayMonths != null ? `Cash runway: ${input.runwayMonths} months.` : ''} Estimated extra cost from today's conditions: ${input.sym}${input.estExtraMonthly.toLocaleString()}/month.

Today's market signals:
${signalLines}

Supply chain:
${supplyLines || '- No supply chain data'}

Write a tight, plain-English read for this specific owner. No jargon, no hedging. Return ONLY valid JSON:
{
  "readings": [ {"key":"<the [key] from each signal>","value":"a clean current value taken from the snippet e.g. '$1,820/t' or '▼ 2.3%' or 'KSh 162'. ONLY if the snippet contains a real figure or clear qualitative move. If the snippet says 'No fresh reading' or has no real data, return null — never invent a value or a state.","direction":"up|down|flat","changePct": number or null} , ... one per signal ],
  "headline": "max 7 words, concrete",
  "body": "2 sentences max. What today's conditions mean for THEIR costs specifically.",
  "opportunity": "1 sentence if there's a hidden upside (e.g. local sourcing now cheaper), else null",
  "timeline": [ {"when":"Today","title":"...","detail":"1 sentence","severity":"alert|watch|info"}, ... up to 4 entries spanning today → 30 days ],
  "actions": [ {"urgency":"urgent|soon|watch","title":"max 8 words","detail":"1 sentence, specific to their sector/imports"}, ... 3-5 actions ]
}`

  try {
    const groqNarrRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: GROQ_MODEL, max_tokens: 1200, messages: [{ role: 'user', content: prompt }] }),
    })
    const groqNarrData = await groqNarrRes.json()
    logUsage({ route: '/api/market-climate', model: GROQ_MODEL, usage: { input_tokens: groqNarrData.usage?.prompt_tokens || 0, output_tokens: groqNarrData.usage?.completion_tokens || 0 }, userId: input.userId })
    const text = groqNarrData.choices?.[0]?.message?.content || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0]) as Narrative
    return {
      headline: parsed.headline || fallback.headline,
      body: parsed.body || fallback.body,
      opportunity: parsed.opportunity ?? null,
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline.slice(0, 4) : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 5) : [],
      readings: Array.isArray(parsed.readings) ? parsed.readings : [],
    }
  } catch {
    return fallback
  }
}
