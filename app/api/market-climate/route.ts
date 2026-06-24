// ── /api/market-climate ───────────────────────────────────────────────────────
// Turns today's macro conditions into a personalised business warning.
// Reads: the user's location, sector (from scanned data), supplier currencies,
// and cash position. Fetches: live market + shipping signals via Tavily.
// Returns: a weighted severity score, a real cash-impact estimate, a time-horizon
// playbook, ranked actions, and a supply-chain read — all specific to this business.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'
import { tavilySearch } from '@/lib/tavily'
import {
  getCountryClimate, isCountryMapped, getCountryName,
  detectSector, detectShippingLanes, getPortWatch,
  detectBusinessCommodities, SIGNAL_KIND_WEIGHT,
  type MarketSignalSpec, type CountryClimate,
} from '@/lib/market-climate-config'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Module-level cache: keyed by country+sector, TTL 3h ───────────────────────
// Avoids hammering Tavily/Claude on every dashboard load. Per-instance is fine —
// signals move slowly relative to a 3h window.
type Cached = { at: number; signals: SignalReading[]; supply: SupplyReading }
const SIGNAL_TTL = 3 * 60 * 60 * 1000
const signalCache = new Map<string, Cached>()

interface SignalReading {
  key: string
  label: string
  kind: string
  value: string          // e.g. '₦1,620' or '▼ 3.2%'
  direction: 'up' | 'down' | 'flat'
  changePct: number | null
  summary: string        // one-line plain-English read
}

interface SupplyReading {
  lanes: Array<{ lane: string; route: string; status: string; severity: 'ok' | 'watch' | 'alert' }>
  port: { port: string; status: string; severity: 'ok' | 'watch' | 'alert' } | null
}

// Pull a single signal from Tavily and parse a rough direction/number from the answer.
async function readSignal(spec: MarketSignalSpec): Promise<SignalReading> {
  const res = await tavilySearch(spec.query, {
    searchDepth: 'basic', maxResults: 3, includeAnswer: true, topic: 'news', days: 3,
  })
  const answer = res?.answer || res?.results?.[0]?.content || ''
  const { value, direction, changePct } = parseSignal(answer, spec.kind)
  return {
    key: spec.key, label: spec.label, kind: spec.kind,
    value, direction, changePct,
    summary: answer ? answer.slice(0, 160).trim() : 'No fresh reading available.',
  }
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
  userId: string
}): Promise<MarketSignalSpec[]> {
  const { climate } = input
  const dedupe = (specs: MarketSignalSpec[]) => {
    const seen = new Set<string>(); const out: MarketSignalSpec[] = []
    for (const s of specs) if (s && !seen.has(s.key)) { seen.add(s.key); out.push(s) }
    return out.slice(0, 6)
  }
  // Deterministic fallback: local FX + what they trade (keyword map) + anchors.
  const kwCommodities = detectBusinessCommodities(input.businessTerms)
  const fallback = dedupe([
    climate.fx,
    ...kwCommodities,
    ...(kwCommodities.length ? [] : climate.commodities), // only use country default if nothing matched
    climate.index,
    climate.centralBank,
  ])

  if (!process.env.ANTHROPIC_API_KEY || input.businessTerms.length === 0) return fallback

  const prompt = `A business in ${climate.name} (sector: ${input.sectorLabel}) trades in: ${input.businessTerms.join(', ')}.

Pick the 4–5 LIVE market signals that most affect THIS business's costs, selling prices, or demand — specific to what they actually trade, not generic national indices. For a commodity producer/exporter include the commodity's world price AND its key import-market demand; for an importer include the relevant input price and FX.

Always include the local currency vs USD (${climate.fx.label}). Return ONLY JSON:
{"signals":[{"key":"short_slug","label":"≤3 words","query":"web search for today's price/level/demand","kind":"commodity|demand|fx|index|rate"}]}`

  try {
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [{ role: 'user', content: prompt }],
    })
    logUsage({ route: '/api/market-climate#select', model: 'claude-haiku-4-5-20251001', usage: res.usage, userId: input.userId })
    const textBlock = res.content.find(b => b.type === 'text') as { text: string } | undefined
    const m = textBlock?.text.match(/\{[\s\S]*\}/)
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
  const { data: records } = await supabase
    .from('unified_data')
    .select('category, product_name, currency, cost_price, units_sold, gross_revenue')
    .eq('user_id', user.id)
    .gte('record_date', since)
    .limit(2000)

  const rows = records || []
  const categories = Array.from(new Set(rows.map(r => r.category || r.product_name || '').filter(Boolean)))
  const productNames = Array.from(new Set(rows.map(r => r.product_name || '').filter(Boolean)))
  const sector = detectSector(categories)
  // Everything the business actually trades — feeds signal selection.
  const businessTerms = Array.from(new Set([...categories, ...productNames])).slice(0, 40)

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

  // ── 2. Fetch live signals (cached) ──────────────────────────────────────────
  // Cache is keyed by what the business actually trades, so two businesses in the
  // same country with different products get different signals.
  const termSig = businessTerms.join('|').toLowerCase().slice(0, 120)
  const cacheKey = `${climate.code}:${sector.key}:${termSig}`
  const cached = signalCache.get(cacheKey)
  let signals: SignalReading[]
  let supply: SupplyReading

  if (!forceRefresh && cached && Date.now() - cached.at < SIGNAL_TTL) {
    signals = cached.signals
    supply = cached.supply
  } else {
    const specs = await selectBusinessSignals({ climate, businessTerms, sectorLabel: sector.label, userId: user.id })
    const [signalReadings, laneReadings, portReading] = await Promise.all([
      Promise.all(specs.map(readSignal)),
      Promise.all(lanes.map(async l => {
        const r = await tavilySearch(l.freightQuery, { searchDepth: 'basic', maxResults: 2, includeAnswer: true, topic: 'news', days: 5 })
        const graded = gradeDisruption(r?.answer || r?.results?.[0]?.content || '')
        return { lane: l.lane, route: l.route, status: graded.status, severity: graded.severity }
      })),
      portWatch
        ? tavilySearch(portWatch.query, { searchDepth: 'basic', maxResults: 2, includeAnswer: true, topic: 'news', days: 7 })
            .then(r => { const g = gradeDisruption(r?.answer || r?.results?.[0]?.content || ''); return { port: portWatch.port, status: g.status, severity: g.severity } })
        : Promise.resolve(null),
    ])
    signals = signalReadings
    supply = { lanes: laneReadings, port: portReading }
    signalCache.set(cacheKey, { at: Date.now(), signals, supply })
  }

  // ── 3. Weighted severity score (0-100) ──────────────────────────────────────
  // Each signal's adverse move, scaled by how much this sector cares about it.
  let weightedAdverse = 0
  let weightSum = 0
  for (const s of signals) {
    const w = SIGNAL_KIND_WEIGHT[s.kind] ?? 0.3
    weightSum += w
    if (s.changePct == null) continue
    // adverse = down for index/commodity/demand; any FX move is treated as cost risk.
    const adverse = s.direction === 'down' || s.kind === 'fx'
    if (adverse) weightedAdverse += w * Math.min(s.changePct / 5, 1) // 5%+ move = full weight
  }
  const severity = Math.min(100, Math.round((weightedAdverse / Math.max(weightSum, 0.1)) * 100))
  const supplyPenalty = supply.lanes.filter(l => l.severity === 'alert').length * 12
    + supply.lanes.filter(l => l.severity === 'watch').length * 6
    + (supply.port?.severity === 'alert' ? 12 : supply.port?.severity === 'watch' ? 6 : 0)
  const totalSeverity = Math.min(100, severity + supplyPenalty)

  const condition = totalSeverity >= 66 ? 'Stormy' : totalSeverity >= 33 ? 'Unsettled' : 'Calm'
  const conditionIcon = totalSeverity >= 66 ? '⛈️' : totalSeverity >= 33 ? '🌥️' : '☀️'

  // ── 4. Estimated extra monthly cost ─────────────────────────────────────────
  // FX move on import spend + a freight uplift when lanes are disrupted.
  const fxSignal = signals.find(s => s.key === 'fx')
  const fxMovePct = fxSignal?.changePct ?? 0
  const fxExtra = Math.round(monthlyImportSpend * (fxMovePct / 100))
  const freightDisrupted = supply.lanes.some(l => l.severity !== 'ok')
  const freightExtra = freightDisrupted ? Math.round(monthlyImportSpend * 0.04) : 0
  const estExtraMonthly = Math.max(0, fxExtra + freightExtra)
  const runwayMonths = (cashBalance > 0 && monthlyFixed > 0) ? Math.round((cashBalance / monthlyFixed) * 10) / 10 : null

  // ── 5. Claude: translate the numbers into a business narrative ──────────────
  const narrative = await buildNarrative({
    sym, condition, totalSeverity, climate, sector, signals, supply,
    importPct, estExtraMonthly, monthlyImportSpend, runwayMonths,
    userId: user.id,
  })

  // Merge Claude-cleaned values back into the signals so cards show a real
  // reading instead of "—" when the regex couldn't parse the raw snippet.
  if (narrative.readings?.length) {
    const byKey = new Map(narrative.readings.map(r => [r.key, r]))
    signals = signals.map(s => {
      const r = byKey.get(s.key)
      if (!r) return s
      return {
        ...s,
        value: r.value && r.value !== '—' ? r.value : s.value,
        direction: r.direction || s.direction,
        changePct: r.changePct ?? s.changePct,
      }
    })
  }

  return NextResponse.json({
    currency_symbol: sym,
    country: mapped ? climate.name : requestedCountry,
    country_code: climate.code,
    mapped,
    requested_country: requestedCountry,
    sector: { key: sector.key, label: sector.label, icon: sector.icon, import_pct: importPct },
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
    updated_at: new Date().toISOString(),
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
  if (!process.env.ANTHROPIC_API_KEY) return fallback

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
  "readings": [ {"key":"<the [key] from each signal>","value":"a clean current value from the snippet e.g. '$1,820/t' or '▼ 2.3%' or 'KSh 162'; if the snippet truly has no number, a 2-3 word state like 'Holding steady'","direction":"up|down|flat","changePct": number or null} , ... one per signal ],
  "headline": "max 7 words, concrete",
  "body": "2 sentences max. What today's conditions mean for THEIR costs specifically.",
  "opportunity": "1 sentence if there's a hidden upside (e.g. local sourcing now cheaper), else null",
  "timeline": [ {"when":"Today","title":"...","detail":"1 sentence","severity":"alert|watch|info"}, ... up to 4 entries spanning today → 30 days ],
  "actions": [ {"urgency":"urgent|soon|watch","title":"max 8 words","detail":"1 sentence, specific to their sector/imports"}, ... 3-5 actions ]
}`

  try {
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    })
    logUsage({ route: '/api/market-climate', model: 'claude-haiku-4-5-20251001', usage: res.usage, userId: input.userId })
    const textBlock = res.content.find(b => b.type === 'text') as { text: string } | undefined
    const text = textBlock?.text || ''
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
