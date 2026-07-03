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
  classifyChannel, buildRetailSignals, isKnownCountryName,
  type MarketSignalSpec, type CountryClimate, type ChannelMix,
} from '@/lib/market-climate-config'
import type { SupplierSource } from '@/app/api/supplier-context/route'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

// Billing / SaaS metadata terms that must never appear as market signals or product sourcing prompts
const SERVICE_NOISE = ['subscription', 'invoice', 'charge', 'payment', 'fee', 'refund', 'credit', 'trial', 'plan', 'seat', 'license', 'renewal', 'setup', 'onboarding', 'consulting', 'support', 'maintenance', 'hosting', 'saas', 'addon', 'add-on', 'upgrade', 'downgrade']

// Persistent cache: the expensive result (signals + supply + narrative) is kept
// in Supabase for 12h so the Tavily/Claude work runs at most ~twice a day per
// business. A forced refresh is only honoured once the cache is older than
// FORCE_MIN_MS, so the refresh button can't burn credits on repeat taps.
const CACHE_TTL_MS      = 12 * 60 * 60 * 1000
const FORCE_MIN_MS      = 11 * 60 * 60 * 1000
// If every signal came back with no data (search keys missing / quota hit),
// cache for only 15 min so it self-heals as soon as keys are added.
const EMPTY_CACHE_TTL_MS = 15 * 60 * 1000

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

interface WorstSeller {
  product: string
  revenue_7d: number
  units_7d: number
  your_price: number | null
  reason: string
  action: string
}

interface LocalPrice {
  product: string
  your_price: number | null
  market_note: string
  market_value: string
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
    // Skip if the source is local: same country as the user, a multi-word
    // place name that contains the user's country/capital (e.g. "China Square
    // Nyali Mombasa" is a local market in Kenya, not an international origin),
    // or — the main check — doesn't resolve to a real country at all. Without
    // that last check, a single-word local place name like "Lamu" or "Wajir"
    // (real Kenyan towns) sailed past the old heuristics and generated a
    // "shipping disruption Lamu to Kenya" query, which an LLM later wrote up
    // as a nonsensical international trade-lane story.
    const countryLower = country.toLowerCase()
    const climateLower = climate.name.toLowerCase()
    const isLocal =
      countryLower === climateLower ||
      countryLower.includes(climateLower) ||
      (climate.capital && countryLower.includes(climate.capital.toLowerCase())) ||
      // Heuristic: more than 3 words usually means a local place name, not a country
      country.trim().split(/\s+/).length > 3 ||
      !isKnownCountryName(country)

    if (!isLocal) {
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
  // headline value chip
  let value = '—'
  if (kind === 'fx') {
    const fxMatch = text.match(/(KSh\s?\d[\d,]*(?:\.\d+)?)|([₦$£€]\s?\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?\s?(?:naira|shilling|cedi|rand|KSh|KES))/i)
    value = fxMatch ? fxMatch[0].trim() : (changePct != null ? `${direction === 'down' ? '▼' : direction === 'up' ? '▲' : ''} ${changePct}%` : '—')
  } else if (changePct != null) {
    value = `${direction === 'down' ? '▼' : direction === 'up' ? '▲' : ''} ${changePct}%`
  } else if (kind !== 'commodity' && kind !== 'rate') {
    // Supply/demand/weather/export signals: a bare number is meaningless (often a year or quantity).
    // Show a status word based on the detected direction instead.
    value = direction === 'down' ? 'Disrupted' : direction === 'up' ? 'Elevated' : 'Normal'
  } else {
    // Commodity/rate: try a currency-anchored price first to avoid matching years or product dimensions.
    const currMatch = text.match(/(?:KSh|KES|NGN|₦|\$|£|€|GHS|ZAR|USD|EUR|GBP)\s*\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s*(?:KSh|KES|NGN|GHS|ZAR)/i)
    if (currMatch) {
      value = currMatch[0].trim().slice(0, 20)
    } else {
      // Fallback: first number that is NOT a 4-digit year (19xx / 20xx)
      const nums = [...text.matchAll(/\b(\d[\d,]*(?:\.\d+)?)\b/g)]
      const nonYear = nums.find(m => !/^(19|20)\d{2}$/.test(m[1]))
      value = nonYear ? nonYear[1] : '—'
    }
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

// Maps raw source_type/channel strings to display names for UI
function getSourceDisplayName(s: string): string {
  const sl = (s || '').toLowerCase()
  if (sl.includes('shopify')) return 'Shopify'
  if (sl.includes('amazon')) return 'Amazon'
  if (sl.includes('stripe')) return 'Stripe'
  if (sl.includes('ebay')) return 'eBay'
  if (sl.includes('etsy')) return 'Etsy'
  if (sl.includes('woocommerce')) return 'WooCommerce'
  if (sl.includes('jumia')) return 'Jumia'
  if (sl.includes('tiktok')) return 'TikTok Shop'
  if (sl.includes('takealot')) return 'Takealot'
  if (sl.includes('square')) return 'Square'
  if (sl.includes('paystack')) return 'Paystack'
  if (sl.includes('pos') || sl.includes('instore') || sl.includes('in-store') || sl.includes('counter') || sl.includes('shop')) return 'POS'
  return s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'Sales'
}

// Choose the signals that actually move THIS business. LLM picks commodities/
// demand specific to what they trade; falls back to a keyword map + country
// anchors. Local FX is always included (it's the universal import-cost driver).
async function selectBusinessSignals(input: {
  climate: CountryClimate
  businessTerms: string[]
  rankedProducts: Array<{ name: string; revPct: number }>
  sectorLabel: string
  channelMix: ChannelMix
  userId: string
  city: string
  supplierSources: Array<{ product: string; sourceCountry?: string }>
}): Promise<MarketSignalSpec[]> {
  const { climate, channelMix } = input
  const dedupe = (specs: MarketSignalSpec[]) => {
    const seen = new Set<string>(); const out: MarketSignalSpec[] = []
    for (const s of specs) if (s && !seen.has(s.key)) { seen.add(s.key); out.push(s) }
    return out.slice(0, 6)
  }
  const kwCommodities = detectBusinessCommodities(input.businessTerms)
  const retail = buildRetailSignals(climate, channelMix)
  const fallback = dedupe(
    kwCommodities.length
      ? [climate.fx, ...kwCommodities, climate.index, climate.centralBank]
      : [climate.fx, ...retail, climate.centralBank]
  )

  if (!process.env.GROQ_API_KEY || input.rankedProducts.length === 0) return fallback

  // Revenue-ranked product list — Groq knows which products matter most to THIS business
  const productLines = input.rankedProducts.slice(0, 8)
    .map(p => p.revPct > 0 ? `${p.name} (${p.revPct}% of revenue)` : p.name)
    .join(', ')
  const supplierLine = input.supplierSources.filter(s => s.sourceCountry)
    .map(s => `${s.product} sourced from ${s.sourceCountry}`).join(', ')

  const prompt = `A small business owner is based in ${input.city}, ${climate.name}.

Their actual top-selling products (from their connected sales: Shopify, POS, Amazon, etc.), ranked by revenue:
${productLines}
${supplierLine ? `\nThey source: ${supplierLine}` : ''}

Generate exactly 5 targeted web search queries to find news that directly affects their highest-revenue products RIGHT NOW. Focus on the top earners first.

Each query must target one of these angles — pick whichever 5 fit best:
- Current local price of their top product in ${input.city} / ${climate.name}
- Supply shortage, harvest shortfall, or commodity price movement for their main goods
- Weather or crop cycle that will affect future supply or price of their products
- Port, export, or trade conditions for their specific goods at ${input.city} port / ${climate.name}
- ${climate.region} regional trade or demand news for their products
- ${climate.fx.label} exchange rate (always include — affects all import costs)

Rules:
- Use the ACTUAL product names from their sales data in every query
- Prioritise the highest revenue-share products
- Never use generic terms like "consumer demand", "footfall", or "digital ad cost" unless they sell SaaS/digital products
- Queries must be specific enough to return real news articles (product name + location)

Return ONLY JSON:
{"signals":[{"key":"short_slug","label":"≤4 words describing what it tracks","query":"exact search query using their real product names","kind":"commodity|supply|weather|export|fx"}]}`

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
        kind: (['commodity', 'supply', 'weather', 'export', 'demand', 'fx', 'index', 'rate'].includes(s.kind || '') ? s.kind : 'commodity') as MarketSignalSpec['kind'],
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
    // Native POS items — joined via pos_transactions to filter by owner
    supabase
      .from('pos_items')
      .select('name, qty, unit_price, line_total, pos_transactions!inner(owner_id, status, created_at)')
      .eq('pos_transactions.owner_id', user.id)
      .eq('pos_transactions.status', 'completed')
      .gte('pos_transactions.created_at', since)
      .limit(500),
    // Supplier context saved by user
    supabase
      .from('cost_profile_overrides')
      .select('overrides')
      .eq('user_id', user.id)
      .single(),
  ])

  // ── 1b. Channel + product velocity (30d vs prior 30d) ───────────────────────
  // 30-day window gives meaningful data even for businesses that sync weekly/monthly
  const thirtyDaysAgo  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const sixtyDaysAgo   = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const [{ data: thisWeekRows }, { data: prevWeekRows }, { data: posTxThis }, { data: posTxPrev }] = await Promise.all([
    supabase.from('unified_data')
      .select('source_type, channel, product_name, gross_revenue, units_sold')
      .eq('user_id', user.id).gte('record_date', thirtyDaysAgo).neq('source_type', 'pos').limit(1000),
    supabase.from('unified_data')
      .select('source_type, channel, gross_revenue')
      .eq('user_id', user.id).gte('record_date', sixtyDaysAgo).lt('record_date', thirtyDaysAgo).neq('source_type', 'pos').limit(1000),
    supabase.from('pos_transactions')
      .select('total')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo + 'T00:00:00')
      .limit(2000),
    supabase.from('pos_transactions')
      .select('total')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', sixtyDaysAgo + 'T00:00:00')
      .lt('created_at', thirtyDaysAgo + 'T00:00:00')
      .limit(2000),
  ])

  const rows = records || []
  const posItems = posRecords || []

  const categories = Array.from(new Set(rows.map(r => r.category || r.product_name || '').filter(Boolean)))
  const sector = detectSector(categories)

  // Build revenue-ranked product list from unified_data (all connected sources: Shopify, POS, Amazon, etc.)
  // This is what Groq uses to know what this business ACTUALLY sells and how important each product is.
  const revMap = new Map<string, number>()
  for (const r of thisWeekRows || []) {
    const pn = (r.product_name || '').trim()
    if (!pn || SERVICE_NOISE.some(n => pn.toLowerCase().includes(n))) continue
    revMap.set(pn, (revMap.get(pn) || 0) + (r.gross_revenue || 0))
  }
  const totalRev = Array.from(revMap.values()).reduce((a, b) => a + b, 0)
  // Products ranked by revenue — most important to the business comes first
  const revenueRankedProducts = Array.from(revMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, rev]) => ({
      name,
      revPct: totalRev > 0 ? Math.round((rev / totalRev) * 100) : 0,
    }))

  // Supplement with POS item names not yet seen in unified_data
  const seenNames = new Set(revenueRankedProducts.map(p => p.name.toLowerCase()))
  const posOnlyTerms = posItems
    .map(p => (p.name || p.category || '').trim())
    .filter(n => n && !seenNames.has(n.toLowerCase()) && !SERVICE_NOISE.some(s => n.toLowerCase().includes(s)))
    .slice(0, 10)
    .map(name => ({ name, revPct: 0 }))

  const rankedProducts = [...revenueRankedProducts, ...posOnlyTerms]

  // Flat list for cache key + supplier prompts (order preserved = revenue order)
  const businessTerms = rankedProducts
    .map(p => p.name)
    .filter(t => t.length > 2)
    .slice(0, 40)

  // Supplier sourcing context saved by user (where they buy each product from)
  const overrides = (overridesRow?.overrides as Record<string, unknown>) || {}
  const supplierContext = overrides.supplier_sources as { sources: SupplierSource[] } | undefined
  const supplierSources: SupplierSource[] = supplierContext?.sources || []

  // Products we know about but have no supplier origin for — these become prompts in the UI
  const knownProductsWithoutSource = businessTerms
    .filter(t => t.length > 2)
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

  // ── Channel activity: this week vs prior week by source ───────────────────
  const chanMap = new Map<string, { tw: number; pw: number }>()
  for (const r of thisWeekRows || []) {
    const name = getSourceDisplayName(r.source_type || r.channel || '')
    const c = chanMap.get(name) || { tw: 0, pw: 0 }
    c.tw += r.gross_revenue || 0
    chanMap.set(name, c)
  }
  for (const r of prevWeekRows || []) {
    const name = getSourceDisplayName(r.source_type || r.channel || '')
    const c = chanMap.get(name) || { tw: 0, pw: 0 }
    c.pw += r.gross_revenue || 0
    chanMap.set(name, c)
  }
  // Supplement with native POS register revenue (pos_transactions, not unified_data)
  const posThisRev = (posTxThis || []).reduce((s: number, t: any) => s + (t.total || 0), 0)
  const posPrevRev = (posTxPrev || []).reduce((s: number, t: any) => s + (t.total || 0), 0)
  if (posThisRev > 0 || posPrevRev > 0) {
    const posEntry = chanMap.get('POS') || { tw: 0, pw: 0 }
    posEntry.tw += posThisRev
    posEntry.pw += posPrevRev
    chanMap.set('POS', posEntry)
  }
  const chanStats = Array.from(chanMap.entries())
    .filter(([, v]) => v.tw > 0 || v.pw > 0)
    .map(([name, { tw, pw }]) => {
      const cp = pw > 0 ? Math.round(((tw - pw) / pw) * 100) : null
      const trend: 'up' | 'down' | 'flat' = cp == null ? 'flat' : cp > 3 ? 'up' : cp < -3 ? 'down' : 'flat'
      return { name, revenue_7d: tw, prev_7d: pw, trend, change_pct: cp }
    })
    .sort((a, b) => b.revenue_7d - a.revenue_7d)
  const total7d     = chanStats.reduce((s, c) => s + c.revenue_7d, 0)
  const prevTotal7d = chanStats.reduce((s, c) => s + c.prev_7d, 0)
  const chanTrend: 'up' | 'down' | 'flat' = total7d > prevTotal7d * 1.03 ? 'up' : total7d < prevTotal7d * 0.97 ? 'down' : 'flat'
  const channelActivity = { channels: chanStats.slice(0, 6), total_7d: total7d, prev_7d: prevTotal7d, trend: chanTrend }

  // ── Top products this week (from all connected sources + POS) ─────────────
  const prodMap = new Map<string, { rev: number; units: number }>()
  for (const r of thisWeekRows || []) {
    const pn = (r.product_name || '').trim()
    if (!pn || pn.toLowerCase() === 'other' || SERVICE_NOISE.some(n => pn.toLowerCase().includes(n))) continue
    const c = prodMap.get(pn) || { rev: 0, units: 0 }
    c.rev += r.gross_revenue || 0
    c.units += r.units_sold || 0
    prodMap.set(pn, c)
  }
  // Supplement prodMap with native POS items from last 30 days
  for (const item of posItems) {
    const tx = (item.pos_transactions as unknown as { created_at: string }) || null
    if (!tx || tx.created_at < thirtyDaysAgo) continue
    const pn = (item.name || '').trim()
    if (!pn || SERVICE_NOISE.some(n => pn.toLowerCase().includes(n))) continue
    const c = prodMap.get(pn) || { rev: 0, units: 0 }
    c.rev += item.line_total || (item.unit_price * (item.qty || 1)) || 0
    c.units += item.qty || 1
    prodMap.set(pn, c)
  }
  const topProducts = Array.from(prodMap.entries())
    .sort((a, b) => b[1].rev - a[1].rev)
    .slice(0, 5)
    .map(([product, { rev, units }]) => ({ product, revenue_7d: rev, units_7d: units }))

  // ── 2. Live signals (persistent 12h cache, capped force-refresh) ────────────
  // Keyed by what the business trades + how it sells, so two businesses in the
  // same country get different signals. Runway/cash params are NOT in the key —
  // those drive only cheap per-request maths, not the cached API result.
  const runwayMonths = (cashBalance > 0 && monthlyFixed > 0) ? Math.round((cashBalance / monthlyFixed) * 10) / 10 : null
  const termSig = businessTerms.join('|').toLowerCase().slice(0, 120)
  const chanSig = `${channelMix.hasEcommerce ? 'e' : ''}${channelMix.hasPos ? 'p' : ''}`
  const supplierSig = supplierSources.map(s => `${s.product}:${s.sourceCountry}`).join('|').slice(0, 80)
  const cacheKey = `${climate.code}:${sector.key}:${chanSig}:${termSig}:${supplierSig}`
  const userCity = (() => {
    try { return decodeURIComponent(request.headers.get('x-vercel-ip-city') || '') || climate.capital } catch { return climate.capital }
  })()
  const sectorLabel = sector.label

  type GeoSig = { level: 'city' | 'country' | 'region'; location: string; summary: string; severity: 'ok' | 'watch' | 'alert' }
  type CacheRow = { payload: { signals: SignalReading[]; supply: SupplyReading; narrative: Narrative; geo_signals?: GeoSig[]; worst_sellers?: WorstSeller[]; local_prices?: LocalPrice[] }; fetched_at: string }

  // Ensure the cache table exists — self-heals on any fresh environment
  try {
    await supabase.rpc('run_sql' as never, { query: `
      CREATE TABLE IF NOT EXISTS public.market_climate_cache (
        user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        cache_key  text        NOT NULL,
        payload    jsonb       NOT NULL,
        fetched_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, cache_key)
      );
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_climate_cache') THEN
          ALTER TABLE public.market_climate_cache ENABLE ROW LEVEL SECURITY;
          CREATE POLICY mc_cache_own ON public.market_climate_cache FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;
    ` } as never)
  } catch { /* table already exists — normal path */ }

  let cacheRow: CacheRow | null = null
  try {
    const { data } = await supabase
      .from('market_climate_cache')
      .select('payload, fetched_at')
      .eq('user_id', user.id).eq('cache_key', cacheKey).maybeSingle()
    cacheRow = (data as unknown as CacheRow) || null
  } catch { cacheRow = null }

  const ageMs = cacheRow ? Date.now() - new Date(cacheRow.fetched_at).getTime() : Infinity
  const forceAllowed = forceRefresh && ageMs >= FORCE_MIN_MS
  // If the cached result had zero live signals, treat it as stale after 15 min
  // so the API self-heals once search keys are added to the environment.
  const cachedAllEmpty = !!cacheRow && (cacheRow.payload.signals || []).every(s => !s.hasData)
  const effectiveTTL = cachedAllEmpty ? EMPTY_CACHE_TTL_MS : CACHE_TTL_MS
  const useCache = !!cacheRow && ageMs < effectiveTTL && !forceAllowed

  let signals: SignalReading[]
  let supply: SupplyReading
  let narrative: Narrative
  let fetchedAt: string
  let geoSignals: GeoSig[] = []
  let worstSellers: WorstSeller[] = []
  let localPrices: LocalPrice[] = []

  if (useCache && cacheRow) {
    signals = cacheRow.payload.signals
    supply = cacheRow.payload.supply
    narrative = cacheRow.payload.narrative
    geoSignals = cacheRow.payload.geo_signals || []
    worstSellers = cacheRow.payload.worst_sellers || []
    localPrices = cacheRow.payload.local_prices || []
    fetchedAt = cacheRow.fetched_at
  } else {
    // Select signals: supplier-specific specs first, then AI-selected macro signals
    const supplierSpecs = buildSupplierSignals(supplierSources, climate)
    const macroSpecs = await selectBusinessSignals({ climate, businessTerms, rankedProducts, sectorLabel: sector.label, channelMix, userId: user.id, city: userCity, supplierSources })
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
      businessTerms, rankedProducts, city: userCity, supplierSources,
    })
    // Merge Claude-cleaned values so cards show a real reading instead of "—",
    // but ONLY where Tavily actually returned data — never let the model invent
    // a value for a signal that had no live reading.
    const byKey = new Map((narrative.readings || []).map(r => [r.key, r]))
    signals = signals.map(s => {
      if (!s.hasData) return { ...s, value: '—', direction: 'flat', changePct: null }
      const r = byKey.get(s.key)
      if (r === undefined) return s  // Groq didn't cover this key — keep parseSignal result
      // Groq explicitly returned null/empty → it saw the text but found no real figure; trust that over parseSignal's guess
      if (!r.value || r.value === '—') return { ...s, value: '—', direction: r.direction || s.direction, changePct: r.changePct ?? s.changePct }
      return { ...s, value: r.value, direction: r.direction || s.direction, changePct: r.changePct ?? s.changePct }
    })
    // Geo signals: city → country → region, sector-specific (cached with everything else)
    try {
      const [cityRes, countryRes, regionRes] = await Promise.all([
        marketSearch(
          `${userCity} ${sectorLabel} business disruption supply roads trade protest today`,
          { topic: 'news', days: 2, fallbackQuery: `${userCity} business conditions today` },
        ),
        marketSearch(
          `${climate.name} ${sectorLabel} supply chain market business conditions`,
          { topic: 'news', days: 7, fallbackQuery: `${climate.name} business conditions this week` },
        ),
        marketSearch(
          climate.regionQuery,
          { topic: 'news', days: 14, fallbackQuery: `${climate.region} trade supply news` },
        ),
      ])
      const toGeo = (res: typeof cityRes, level: GeoSig['level'], location: string): GeoSig | null => {
        if (!res.hasData) return null
        const graded = gradeDisruption(res.answer)
        return { level, location, summary: res.answer.slice(0, 200).trim(), severity: graded.severity }
      }
      geoSignals = [
        toGeo(cityRes, 'city', userCity),
        toGeo(countryRes, 'country', climate.name),
        toGeo(regionRes, 'region', climate.region),
      ].filter(Boolean) as GeoSig[]
    } catch { /* non-critical */ }

    // ── Worst sellers + local competitive pricing ────────────────────────────
    // Bottom performers: low sellers from unified_data + items never sold from POS catalog
    const worstFromSales = Array.from(prodMap.entries())
      .filter(([, v]) => v.rev > 0)
      .sort((a, b) => a[1].rev - b[1].rev)
      .slice(0, 3)
      .map(([product, { rev, units }]) => ({ product, revenue_7d: rev, units_7d: units, your_price: null as number | null }))

    const seenInSalesSet = new Set(Array.from(prodMap.keys()).map(k => k.toLowerCase()))
    const zeroFromCatalog = posItems
      .filter((p: { name?: string; unit_price?: number }) => {
        const name = (p.name || '').trim()
        return name && !seenInSalesSet.has(name.toLowerCase()) && !SERVICE_NOISE.some(n => name.toLowerCase().includes(n))
      })
      .slice(0, 3)
      .map((p: { name: string; unit_price?: number }) => ({ product: p.name, revenue_7d: 0, units_7d: 0, your_price: (p.unit_price as number) || null }))

    const allWorst = [...worstFromSales, ...zeroFromCatalog].slice(0, 5)
    const topForPricing = rankedProducts.slice(0, 3)

    try {
      const worstReasonPromise: Promise<Array<{ product: string; reason: string; action: string }>> =
        allWorst.length > 0 && process.env.GROQ_API_KEY
          ? (async () => {
              const worstLines = allWorst.map(w =>
                `- ${w.product}: ${w.revenue_7d > 0 ? `${sym}${Math.round(w.revenue_7d).toLocaleString()} revenue, ${w.units_7d} units sold in 30 days` : 'no sales in last 30 days'}`
              ).join('\n')
              const signalSummary = signals.slice(0, 3).map(s => `${s.label}: ${s.value} (${s.direction})`).join(', ')
              const worstPrompt = `You advise a small business in ${userCity}, ${climate.name} (${sector.label} sector).

These products are their WORST performers in the last 30 days:
${worstLines}

Current market signals: ${signalSummary}

For each underperforming product, explain in ONE short sentence WHY it might not be selling (consider: seasonality, price vs competitors, low local demand, supply issues, wrong target market). Then suggest ONE concrete action to improve sales.

Return ONLY valid JSON: {"items":[{"product":"exact product name","reason":"one sentence why","action":"one concrete action"}]}`
              const gr = await fetch(GROQ_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
                body: JSON.stringify({ model: GROQ_MODEL, max_tokens: 500, messages: [{ role: 'user', content: worstPrompt }] }),
              })
              const gd = await gr.json()
              logUsage({ route: '/api/market-climate#worst', model: GROQ_MODEL, usage: { input_tokens: gd.usage?.prompt_tokens || 0, output_tokens: gd.usage?.completion_tokens || 0 }, userId: user.id })
              const m = (gd.choices?.[0]?.message?.content || '').match(/\{[\s\S]*\}/)
              if (!m) return []
              const p = JSON.parse(m[0]) as { items?: Array<{ product: string; reason: string; action: string }> }
              return p.items || []
            })()
          : Promise.resolve([])

      const pricingPromises = topForPricing.map(p =>
        marketSearch(`${p.name} price ${userCity} ${climate.name} retail today`, {
          topic: 'general', days: 14,
          fallbackQuery: `${p.name} retail price ${climate.name}`,
        }).then(r => ({ product: p.name, answer: r.answer || '', hasData: r.hasData }))
          .catch(() => ({ product: p.name, answer: '', hasData: false }))
      )

      const [worstReasonsData, ...priceData] = await Promise.all([worstReasonPromise, ...pricingPromises])
      const worstReasonsList = worstReasonsData as Array<{ product: string; reason: string; action: string }>

      worstSellers = allWorst.map(w => {
        const posItem = posItems.find((p: { name?: string; unit_price?: number }) => p.name?.toLowerCase() === w.product.toLowerCase())
        const yourPrice = posItem?.unit_price ?? w.your_price
        const reasonObj = worstReasonsList.find(r => r.product?.toLowerCase() === w.product.toLowerCase())
        return {
          product: w.product,
          revenue_7d: w.revenue_7d,
          units_7d: w.units_7d,
          your_price: yourPrice,
          reason: reasonObj?.reason || '',
          action: reasonObj?.action || '',
        }
      })

      localPrices = (priceData as Array<{ product: string; answer: string; hasData: boolean }>)
        .filter(r => r.hasData && r.answer)
        .map(r => {
          const posItem = posItems.find((p: { name?: string; unit_price?: number }) => p.name?.toLowerCase() === r.product.toLowerCase())
          const yourPrice = posItem?.unit_price ?? null
          // Best-effort: extract a price value from the search answer
          const numMatch = r.answer.match(/[\₦\$\£\€]?\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:per|each|\/unit|KSh|NGN|KES|GHS|ZAR))?/i)
          const marketValue = numMatch ? numMatch[0].trim().slice(0, 24) : '—'
          return { product: r.product, your_price: yourPrice, market_note: r.answer.slice(0, 200).trim(), market_value: marketValue }
        })
    } catch { /* non-critical — don't block the response */ }

    fetchedAt = new Date().toISOString()
    try {
      await supabase.from('market_climate_cache').upsert(
        { user_id: user.id, cache_key: cacheKey, payload: { signals, supply, narrative, geo_signals: geoSignals, worst_sellers: worstSellers, local_prices: localPrices }, fetched_at: fetchedAt },
        { onConflict: 'user_id,cache_key' },
      )
    } catch { /* table may not exist yet — serve fresh, don't break */ }
  }

  // Derive local_conditions from the cached city-level geo signal (Now tab banner)
  const cityGeoSignal = geoSignals.find(g => g.level === 'city')
  const localConditions: { event: string; severity: 'ok' | 'watch' | 'alert' } | null =
    cityGeoSignal && cityGeoSignal.severity !== 'ok'
      ? { event: cityGeoSignal.summary, severity: cityGeoSignal.severity }
      : null

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
    // Fresh per-request: channel velocity, top products, local conditions
    channel_activity: channelActivity,
    top_products: topProducts,
    worst_sellers: worstSellers,
    local_prices: localPrices,
    local_conditions: localConditions,
    geo_signals: geoSignals,
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
  businessTerms: string[]
  rankedProducts: Array<{ name: string; revPct: number }>
  city: string
  supplierSources: Array<{ product: string; sourceCountry?: string }>
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

  const productLines = input.rankedProducts.slice(0, 8)
    .map(p => p.revPct > 0 ? `${p.name} (${p.revPct}% of revenue)` : p.name)
    .join(', ') || input.sector.label
  const supplierCtx = input.supplierSources?.filter((s: {sourceCountry?: string}) => s.sourceCountry)
    .map((s: {product: string; sourceCountry?: string}) => `${s.product} from ${s.sourceCountry}`).join(', ') || ''
  const prompt = `You advise a small business owner based in ${input.city}, ${input.climate.name}.

Their top-selling products (from their actual sales — Shopify, POS, Amazon, etc.), ranked by revenue:
${productLines}
${supplierCtx ? `They source: ${supplierCtx}` : ''}
~${input.importPct}% of stock cost is import-exposed (~${input.sym}${input.monthlyImportSpend.toLocaleString()}/month).${input.runwayMonths != null ? ` Cash runway: ${input.runwayMonths} months.` : ''} Extra cost today: ${input.sym}${input.estExtraMonthly.toLocaleString()}/month.

Today's signals (specific to their products and location):
${signalLines}

Supply chain:
${supplyLines || '- No supply chain data'}

Write a brutally practical read for THIS owner selling THESE specific products in ${input.city}. Mention their actual products by name. Be specific — if sesame prices are rising, say by how much and why. If a port issue affects their exports, name the port. If a drought will affect next season's crop, say when prices will likely move and by how much. If they should stock up now, say how much extra to hold.

No generic sector talk. No hedging. Every sentence must be about what they sell. Return ONLY valid JSON:
{
  "readings": [ {"key":"<the [key] from each signal>","value":"a clean current value e.g. '$1,820/t' or '▼ 2.3%' or 'KSh 162'. ONLY if the snippet contains a real figure. If no real data, return null — never invent.","direction":"up|down|flat","changePct": number or null} , ... one per signal ],
  "headline": "max 7 words, names their actual product",
  "body": "2 sentences. What today's conditions mean for the price/supply of THEIR specific products. Name the products.",
  "opportunity": "1 sentence about a specific buying, stocking, or pricing opportunity for their products, or null",
  "timeline": [ {"when":"Today|This week|Next 2 weeks|Next month","title":"concrete event affecting their products","detail":"1 sentence with specific numbers or %","severity":"alert|watch|info"}, ... up to 4 entries ],
  "actions": [ {"urgency":"urgent|soon|watch","title":"max 8 words, product-specific","detail":"1 sentence with specific numbers e.g. 'Stock 20% more sesame now before harvest shortfall'"}, ... 3-5 actions ]
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
