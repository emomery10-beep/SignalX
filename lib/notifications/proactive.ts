// ── Proactive Intelligence Engine ────────────────────────────────────────────
// Runs per-user checks and returns notifications to fire.
// Called by the cron job — never by user-facing routes.

import { tavilySearch } from '@/lib/tavily'
import { createServiceClient } from '@/lib/supabase/server'

export interface ProactiveAlert {
  type: 'stock' | 'anomaly' | 'news' | 'shipment' | 'summary' | 'insight' | 'source'
  severity: 'critical' | 'warning' | 'info'
  title: string
  body: string
  metadata?: Record<string, unknown>
}

// ── 1. Low stock check ────────────────────────────────────────
export function checkLowStock(
  rows: Record<string, unknown>[],
  symbol: string,
): ProactiveAlert[] {
  const alerts: ProactiveAlert[] = []

  // Find stock-level columns
  const stockCol = Object.keys(rows[0] || {}).find(k =>
    /stock|inventory|qty|quantity|units.*left|remaining/i.test(k)
  )
  const nameCol = Object.keys(rows[0] || {}).find(k =>
    /product|name|item|sku|title/i.test(k)
  )
  if (!stockCol) return alerts

  for (const row of rows) {
    const stock = Number(row[stockCol])
    const name  = nameCol ? String(row[nameCol]) : 'Unknown product'
    if (isNaN(stock)) continue

    if (stock <= 0) {
      alerts.push({
        type: 'stock', severity: 'critical',
        title: `Out of stock: ${name}`,
        body: `${name} has 0 units remaining. Reorder immediately to avoid lost sales.`,
        metadata: { product: name, stock_level: stock },
      })
    } else if (stock <= 5) {
      alerts.push({
        type: 'stock', severity: 'warning',
        title: `Low stock: ${name}`,
        body: `${name} has only ${stock} units left. Consider reordering soon.`,
        metadata: { product: name, stock_level: stock },
      })
    }
  }

  return alerts.slice(0, 5) // cap at 5 stock alerts per run
}

// ── 2. Revenue / margin anomaly check ────────────────────────
export function checkAnomalies(
  rows: Record<string, unknown>[],
  symbol: string,
): ProactiveAlert[] {
  const alerts: ProactiveAlert[] = []
  if (rows.length < 14) return alerts // need enough history

  const revenueCol = Object.keys(rows[0] || {}).find(k =>
    /revenue|sales|amount|total|gross/i.test(k)
  )
  const marginCol = Object.keys(rows[0] || {}).find(k =>
    /margin|profit.*pct|margin.*pct/i.test(k)
  )

  if (revenueCol) {
    const values = rows.map(r => Number(r[revenueCol])).filter(v => !isNaN(v) && v > 0)
    if (values.length >= 7) {
      const recent  = values.slice(-7).reduce((a, b) => a + b, 0) / 7
      const prior   = values.slice(-14, -7).reduce((a, b) => a + b, 0) / 7
      const changePct = prior > 0 ? ((recent - prior) / prior) * 100 : 0

      if (changePct <= -30) {
        alerts.push({
          type: 'anomaly', severity: 'critical',
          title: `Revenue down ${Math.abs(changePct).toFixed(0)}% this week`,
          body: `Your 7-day average revenue (${symbol}${recent.toFixed(0)}) is ${Math.abs(changePct).toFixed(0)}% below the prior week (${symbol}${prior.toFixed(0)}). Investigate now.`,
          metadata: { change_pct: changePct, recent_avg: recent, prior_avg: prior },
        })
      } else if (changePct <= -15) {
        alerts.push({
          type: 'anomaly', severity: 'warning',
          title: `Revenue dipped ${Math.abs(changePct).toFixed(0)}% vs last week`,
          body: `7-day average revenue is down ${Math.abs(changePct).toFixed(0)}% week-on-week. Worth keeping an eye on.`,
          metadata: { change_pct: changePct },
        })
      } else if (changePct >= 25) {
        alerts.push({
          type: 'anomaly', severity: 'info',
          title: `Revenue up ${changePct.toFixed(0)}% this week 🚀`,
          body: `Strong week — your 7-day average revenue is ${changePct.toFixed(0)}% above the prior week. Check which products are driving it.`,
          metadata: { change_pct: changePct },
        })
      }
    }
  }

  if (marginCol) {
    const margins = rows.map(r => Number(r[marginCol])).filter(v => !isNaN(v))
    if (margins.length >= 7) {
      const recentAvg = margins.slice(-7).reduce((a, b) => a + b, 0) / 7
      const priorAvg  = margins.slice(-14, -7).reduce((a, b) => a + b, 0) / 7
      const drop = priorAvg - recentAvg

      if (drop >= 5) {
        alerts.push({
          type: 'anomaly', severity: 'warning',
          title: `Margin compressed ${drop.toFixed(1)}pp this week`,
          body: `Your average margin dropped from ${priorAvg.toFixed(1)}% to ${recentAvg.toFixed(1)}% over the last 7 days. Check for rising costs or discounting.`,
          metadata: { margin_drop: drop, recent_margin: recentAvg },
        })
      }
    }
  }

  return alerts
}

// ── 3. Regional / sector news check ──────────────────────────
export async function checkNewsSignals(
  region: string,
  sectorHints: string,
  businessType: string,
): Promise<ProactiveAlert[]> {
  const alerts: ProactiveAlert[] = []
  if (!region && !sectorHints) return alerts

  const query = `${sectorHints || businessType} business news ${region} tariff regulation supply chain disruption 2025`

  try {
    const response = await tavilySearch(query, { maxResults: 5, days: 3, topic: 'news' })
    const results = response?.results
    if (!results?.length) return alerts

    // Pick the most relevant result
    const top = results[0]
    if (top && top.score > 0.5) {
      alerts.push({
        type: 'news', severity: 'info',
        title: top.title?.slice(0, 80) || 'Market update relevant to your business',
        body: top.content?.slice(0, 200) || 'New developments in your sector. Tap to read more.',
        metadata: { url: top.url, source: top.title },
      })
    }
  } catch {
    // Non-blocking
  }

  return alerts
}

// ── 4. Shipment risk check ────────────────────────────────────
export async function checkShipmentRisks(
  userId: string,
  symbol: string,
): Promise<ProactiveAlert[]> {
  const alerts: ProactiveAlert[] = []
  const supabase = createServiceClient()

  try {
    const { data: shipments } = await supabase
      .from('shipments')
      .select('tracking_number, sku, supplier_name, delay_days, customs_hold, financial_impact, expected_arrival')
      .eq('user_id', userId)
      .not('track_status', 'in', '("Delivered","Undelivered","Expired")')
      .order('delay_days', { ascending: false })
      .limit(10)

    if (!shipments?.length) return alerts

    for (const s of shipments) {
      if (s.customs_hold) {
        alerts.push({
          type: 'shipment', severity: 'critical',
          title: `Customs hold: ${s.sku || s.tracking_number}`,
          body: `Shipment ${s.tracking_number}${s.supplier_name ? ` from ${s.supplier_name}` : ''} is held in customs.${s.financial_impact > 0 ? ` Potential impact: ${symbol}${s.financial_impact}.` : ''}`,
          metadata: { tracking_number: s.tracking_number },
        })
      } else if (s.delay_days >= 7) {
        alerts.push({
          type: 'shipment', severity: 'warning',
          title: `Shipment delayed ${s.delay_days} days`,
          body: `${s.sku || s.tracking_number}${s.supplier_name ? ` from ${s.supplier_name}` : ''} is ${s.delay_days} days late.${s.financial_impact > 0 ? ` Est. impact: ${symbol}${s.financial_impact}.` : ''}`,
          metadata: { tracking_number: s.tracking_number, delay_days: s.delay_days },
        })
      }
    }
  } catch {}

  return alerts.slice(0, 3)
}
