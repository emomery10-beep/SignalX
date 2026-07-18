// ============================================================
// GET /api/tools/preview
// Single-call aggregation for the Intelligence dashboard.
// Returns live mini-snapshots for all 6 tool cards + cross-signals.
// Gated: Growth plan and above.
// ============================================================
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { EXPORT_MARKETS, scoreForQuery } from '@/lib/ai/export-markets'

export const dynamic = 'force-dynamic'
export const runtime  = 'nodejs'

const PLAN_TIERS: Record<string, number> = { free: 0, starter: 0, growth: 1, business: 2, enterprise: 3 }

const GRADE_COL: Record<string, string> = {
  A: '#16a34a', B: '#65a30d', C: '#d97706', D: '#ea580c', F: '#ef4444',
}
const CURRENCY_FLAG: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', CNY: '🇨🇳', INR: '🇮🇳', TRY: '🇹🇷', NGN: '🇳🇬',
  AED: '🇦🇪', JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺', SGD: '🇸🇬',
  MYR: '🇲🇾', BRL: '🇧🇷', ZAR: '🇿🇦', KES: '🇰🇪', GHS: '🇬🇭', KRW: '🇰🇷',
}
const PLATFORM_CFG: Record<string, { colour: string; display: string }> = {
  tiktok_shop: { colour: '#E1306C', display: 'TikTok Shop' },
  instagram:   { colour: '#9333ea', display: 'Instagram' },
  pinterest:   { colour: '#d97706', display: 'Pinterest' },
}

function gradeFromScore(s: number) {
  if (s >= 85) return 'A'
  if (s >= 70) return 'B'
  if (s >= 55) return 'C'
  if (s >= 40) return 'D'
  return 'F'
}

function topFreq(arr: string[]): string | null {
  if (!arr.length) return null
  const c: Record<string, number> = {}
  for (const v of arr) if (v) c[v] = (c[v] || 0) + 1
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || null
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_id, currency_symbol, sector_hints')
    .eq('id', user.id)
    .single()

  // plan_id first — see memory: profiles-plan-column-drift-bug.
  const plan      = profile?.plan_id || profile?.plan || 'free'
  const userTier  = PLAN_TIERS[plan] ?? 0

  if (userTier < 1) {
    return NextResponse.json({
      locked: true,
      message: 'Business Intelligence is available on Growth and above.',
      upgrade_url: '/billing',
    })
  }

  const sym     = profile?.currency_symbol || '£'
  const since90 = new Date(Date.now() - 90 * 86_400_000).toISOString().split('T')[0]
  const since30 = new Date(Date.now() - 30 * 86_400_000).toISOString().split('T')[0]

  const [unifiedRes, shipRes, socialRes, healthRes, srcRes, posRes, posItemsRes] = await Promise.allSettled([
    supabase
      .from('unified_data')
      .select('sku, product_name, category, currency, cost_price, selling_price, gross_margin, gross_revenue, total_cost')
      .eq('user_id', user.id)
      .gte('record_date', since90)
      .order('record_date', { ascending: false })
      .limit(2000),

    supabase
      .from('shipments')
      .select('supplier_name, status, delay_days, financial_impact, customs_hold, total_value, currency')
      .eq('user_id', user.id)
      .limit(200),

    supabase
      .from('social_signals')
      .select('platform, views, saves, orders, gross_revenue, engagement_rate')
      .eq('user_id', user.id)
      .gte('record_date', since30),

    supabase
      .from('health_scores')
      .select('score, label')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),

    supabase
      .from('connected_sources')
      .select('source_type, status')
      .eq('user_id', user.id)
      .eq('status', 'active'),

    // Native POS: check if user has any transactions
    supabase
      .from('pos_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id),

    // Native POS: recent line items for landed cost preview
    supabase
      .from('pos_items')
      .select('name, qty, unit_price, cost_price, line_total, pos_transactions!inner(owner_id, created_at, status)')
      .eq('pos_transactions.owner_id', user.id)
      .eq('pos_transactions.status', 'completed')
      .gte('pos_transactions.created_at', since90)
      .limit(500),
  ])

  const records   = unifiedRes.status === 'fulfilled'   ? (unifiedRes.value.data   || []) : []
  const ships     = shipRes.status === 'fulfilled'       ? (shipRes.value.data      || []) : []
  const social    = socialRes.status === 'fulfilled'     ? (socialRes.value.data    || []) : []
  const health    = healthRes.status === 'fulfilled'     ? healthRes.value.data             : null
  const sources   = srcRes.status === 'fulfilled'        ? (srcRes.value.data       || []) : []
  const posCount  = posRes.status === 'fulfilled'        ? (posRes.value.count      || 0)  : 0
  const posItems  = posItemsRes.status === 'fulfilled'   ? (posItemsRes.value.data  || []) : []
  const hasPOS    = posCount > 0

  // ── FX preview ────────────────────────────────────────────────
  const fxData = (() => {
    const spend: Record<string, number> = {}
    for (const r of records)
      if (r.currency && r.currency !== 'GBP' && r.total_cost)
        spend[r.currency] = (spend[r.currency] || 0) + r.total_cost / 3
    for (const s of ships)
      if (s.currency && s.currency !== 'GBP' && s.total_value)
        spend[s.currency] = (spend[s.currency] || 0) + s.total_value / 3

    const sorted = Object.entries(spend).sort((a, b) => b[1] - a[1]).slice(0, 3)
    if (!sorted.length) return null
    return {
      currencies: sorted.map(([code, amt]) => ({
        code, flag: CURRENCY_FLAG[code] || '🌐', monthly_spend: Math.round(amt),
      })),
      top_exposure: {
        code:           sorted[0][0],
        amount:         Math.round(sorted[0][1]),
        scenario_10pct: Math.round(sorted[0][1] * 0.1),
      },
    }
  })()

  // ── Suppliers preview ─────────────────────────────────────────
  const suppliersData = (() => {
    if (!ships.length) return null
    const groups: Record<string, typeof ships> = {}
    for (const s of ships) {
      const k = (s.supplier_name || 'Unknown').trim()
      ;(groups[k] ||= []).push(s)
    }
    const scored = Object.entries(groups).map(([name, items]) => {
      const delivered = items.filter(s => s.status === 'delivered').length
      const delayed   = items.filter(s => (s.delay_days || 0) > 0).length
      const customs   = items.filter(s => s.customs_hold).length
      const impact    = items.reduce((sum, s) => sum + (s.financial_impact || 0), 0)
      const avgDelay  = items.reduce((sum, s) => sum + (s.delay_days || 0), 0) / items.length
      const otr       = delivered > 0 ? ((delivered - delayed) / delivered) * 100 : 50
      const score     = Math.round(
        (otr / 100) * 50 +
        Math.max(0, 20 - customs * 7) +
        Math.max(0, 15 - (impact / 5000) * 15) +
        Math.max(0, 15 - (avgDelay / 14) * 15),
      )
      const grade = gradeFromScore(score)
      return { name, grade, colour: GRADE_COL[grade], count: items.length }
    }).sort((a, b) => b.count - a.count)

    return {
      top_three:     scored.slice(0, 3).map(s => ({ name: s.name, grade: s.grade, colour: s.colour })),
      at_risk_count: scored.filter(s => ['D', 'F'].includes(s.grade)).length,
      total:         scored.length,
    }
  })()

  // ── Landed Cost preview ───────────────────────────────────────
  const landedData = (() => {
    // Prefer unified_data records that have actual cost data; fall back to native POS items
    const costRecords = records.filter(r => (r.cost_price || 0) > 0)
    const useRecords = costRecords.length > 0
    if (!useRecords && !posItems.length) return null

    if (useRecords) {
      const byKey: Record<string, { name: string; rev: number; costSum: number; sellSum: number; marginSum: number; n: number }> = {}
      for (const r of costRecords) {
        const k = r.sku || r.product_name || 'Unknown'
        const e = byKey[k] ||= { name: r.product_name || r.sku || 'Unknown', rev: 0, costSum: 0, sellSum: 0, marginSum: 0, n: 0 }
        e.rev       += r.gross_revenue || 0
        e.costSum   += r.cost_price    || 0
        e.sellSum   += r.selling_price || 0
        e.marginSum += r.gross_margin  || 0
        e.n++
      }
      const top = Object.values(byKey).sort((a, b) => b.rev - a.rev)[0]
      if (!top || top.costSum === 0) return null
      const cost    = top.costSum / top.n
      const sell    = top.sellSum / top.n
      const freight = cost * 0.12
      const duty    = cost * 0.08
      const vat     = (cost + freight + duty) * 0.2
      const landed  = cost + freight + duty + vat
      const margin  = top.marginSum > 0
        ? top.marginSum / top.n
        : sell > 0 ? ((sell - landed) / sell) * 100 : 0
      return {
        sku:         top.name,
        cost:        parseFloat(cost.toFixed(2)),
        sell_price:  parseFloat(sell.toFixed(2)),
        landed_cost: parseFloat(landed.toFixed(2)),
        margin_pct:  parseFloat(margin.toFixed(1)),
      }
    }

    // POS fallback: aggregate by product name across recent completed sales
    // cost_price is optional in POS — if missing, estimate at 60% of sell price
    const byName: Record<string, { costSum: number; sellSum: number; revenue: number; n: number; hasCost: boolean }> = {}
    for (const item of posItems) {
      if (!item.unit_price) continue
      const k = item.name || 'Unknown'
      const e = byName[k] ||= { costSum: 0, sellSum: 0, revenue: 0, n: 0, hasCost: false }
      const qty = item.qty || 1
      if (item.cost_price) {
        e.costSum += item.cost_price * qty
        e.hasCost  = true
      }
      e.sellSum += item.unit_price * qty
      e.revenue += item.line_total || (item.unit_price * qty)
      e.n       += qty
    }
    const top = Object.entries(byName).sort((a, b) => b[1].revenue - a[1].revenue)[0]
    if (!top) return null
    const [name, agg] = top
    const sell    = agg.sellSum / agg.n
    // If no cost data, estimate at 60% of sell (typical wholesale/retail split)
    const cost    = agg.hasCost ? agg.costSum / agg.n : sell * 0.6
    const freight = cost * 0.12
    const duty    = cost * 0.08
    const vat     = (cost + freight + duty) * 0.2
    const landed  = cost + freight + duty + vat
    const margin  = sell > 0 ? ((sell - landed) / sell) * 100 : 0
    return {
      sku:         name,
      cost:        parseFloat(cost.toFixed(2)),
      sell_price:  parseFloat(sell.toFixed(2)),
      landed_cost: parseFloat(landed.toFixed(2)),
      margin_pct:  parseFloat(margin.toFixed(1)),
    }
  })()

  // ── Export Markets preview ────────────────────────────────────
  const exportData = (() => {
    const cats   = records.map((r: any) => r.category).filter(Boolean)
    const topCat = topFreq(cats)?.toLowerCase() || null
    const query  = {
      regions: [] as string[], categories: topCat ? [topCat] : [],
      preference: 'score' as const, specificMarkets: [] as string[],
    }
    const pLines = topCat ? [{ category: topCat }] : []
    const top3   = EXPORT_MARKETS
      .map(m => ({ ...m, qs: scoreForQuery(m, query, pLines) }))
      .sort((a, b) => b.qs - a.qs)
      .slice(0, 3)
      .map(m => ({ flag: m.flag, name: m.name, score: Math.round(m.qs) }))
    return { top_three: top3 }
  })()

  // ── Social preview ────────────────────────────────────────────
  const socialData = (() => {
    if (!social.length) return null
    const byPlat: Record<string, { views: number; orders: number; saves: number }> = {}
    let demandSignals = 0
    for (const s of social) {
      const p = s.platform || 'unknown'
      const e = byPlat[p] ||= { views: 0, orders: 0, saves: 0 }
      e.views  += s.views  || 0
      e.orders += s.orders || 0
      e.saves  += s.saves  || 0
      if ((s.saves || 0) > 20 && (s.orders || 0) === 0) demandSignals++
    }
    const platforms = Object.entries(byPlat).map(([p, st]) => {
      const convRate = st.views > 0 ? st.orders / st.views : 0
      const status   = convRate > 0.03 ? 'trending' : convRate > 0.01 ? 'rising' : 'stable'
      const cfg      = PLATFORM_CFG[p] || { colour: '#6366F1', display: p }
      const icon     = status === 'trending' ? '🔥' : status === 'rising' ? '📈' : '🟡'
      return { name: cfg.display, status, colour: cfg.colour, status_icon: icon, status_label: status.charAt(0).toUpperCase() + status.slice(1) }
    })
    return {
      platforms,
      demand_signals: demandSignals,
      top_signal: demandSignals > 0
        ? `${demandSignals} product${demandSignals > 1 ? 's' : ''} with high saves · 0 orders`
        : null,
    }
  })()

  // ── Market Intelligence preview ───────────────────────────────
  let marketData: { products: { name: string; price: number; channel: string }[]; query_sku: string } | null = null
  if (landedData?.sku) {
    const words = landedData.sku.split(' ').slice(0, 2).join(' ')
    const { data: products } = await supabase
      .from('global_product_catalogue')
      .select('product_name, price_gbp, channel')
      .ilike('product_name', `%${words}%`)
      .limit(3)
    if (products?.length) {
      marketData = {
        products:  products.map(p => ({ name: p.product_name, price: p.price_gbp, channel: p.channel })),
        query_sku: landedData.sku,
      }
    }
  }

  // ── Cross-signals ─────────────────────────────────────────────
  const signals: Array<{ message: string; tool: string; severity: string }> = []

  if (suppliersData?.at_risk_count) {
    const fxNote = fxData ? ` · check ${fxData.top_exposure.code} exposure` : ''
    signals.push({
      message:  `${suppliersData.at_risk_count} supplier${suppliersData.at_risk_count > 1 ? 's' : ''} at risk${fxNote}`,
      tool:     'suppliers',
      severity: 'warning',
    })
  }
  if (socialData?.demand_signals) {
    signals.push({ message: socialData.top_signal!, tool: 'social', severity: 'critical' })
  }
  if (fxData?.top_exposure && fxData.top_exposure.amount > 2000) {
    signals.push({
      message:  `${fxData.top_exposure.code} ${sym}${fxData.top_exposure.amount.toLocaleString()}/mo · 10% move = ${sym}${fxData.top_exposure.scenario_10pct.toLocaleString()} at risk`,
      tool:     'fx',
      severity: 'info',
    })
  }

  const hasStore = hasPOS || sources.length > 0

  return NextResponse.json({
    sym,
    has_store:    hasStore,
    health:       health ? { score: health.score, label: health.label } : { score: null, label: null },
    source_count: sources.length + (hasPOS ? 1 : 0),
    signals:      signals.slice(0, 3),
    fx:           fxData,
    suppliers:    suppliersData,
    landed:       landedData,
    export_markets: exportData,
    social:       socialData,
    market:       marketData,
  })
}
