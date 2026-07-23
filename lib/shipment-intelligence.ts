// lib/shipment-intelligence.ts
// Core engine: connects shipment data to business intelligence
import { createClient } from '@/lib/supabase/server'

export interface ShipmentAlert {
  level: 'critical' | 'warning' | 'info'
  type: 'stockout_risk' | 'customs_hold' | 'delay' | 'delivery' | 'working_capital'
  title: string
  message: string
  action: string
  financial_impact: number
  shipment_id: string
  tracking_number: string
  sku?: string
}

export interface LogisticsHealth {
  score: number // 0-100
  label: string
  color: 'green' | 'amber' | 'red' | 'grey'
  active_shipments: number
  at_risk: number
  customs_holds: number
  total_working_capital: number
  daily_financing_cost: number
  on_time_rate: number
  summary: string
}

export interface DailyLogisticsBrief {
  on_track: number
  delayed: number
  customs_holds: number
  critical_alerts: ShipmentAlert[]
  warning_alerts: ShipmentAlert[]
  total_financial_impact: number
  most_urgent_action: string | null
  working_capital_in_transit: number
}

// ── Get active shipments with risk calculation ────────────────────────────────
export async function getActiveShipments(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('shipments')
    .select('*')
    .eq('user_id', userId)
    .not('track_status', 'in', '("Delivered","Undelivered","Expired")')
    .order('is_at_risk', { ascending: false })
    .order('financial_impact', { ascending: false })
  return data || []
}

// ── Get unread alerts ─────────────────────────────────────────────────────────
export async function getUnreadAlerts(userId: string): Promise<ShipmentAlert[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('shipment_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('alert_level', { ascending: true }) // critical first
    .order('created_at', { ascending: false })
    .limit(10)

  return (data || []).map(a => ({
    level: a.alert_level,
    type: a.alert_type,
    title: a.alert_type === 'customs_hold' ? '🛃 Customs Hold'
      : a.alert_type === 'critical' ? '🚨 Shipment Exception'
      : a.alert_type === 'delay' ? '⏱ Shipment Delayed'
      : '📦 Shipment Update',
    message: a.message,
    action: a.alert_type === 'customs_hold'
      ? 'Contact your customs broker immediately'
      : a.alert_type === 'delay'
      ? 'Check alternative sourcing or adjust stock strategy'
      : 'Review shipment status',
    financial_impact: a.financial_impact || 0,
    shipment_id: a.shipment_id,
    tracking_number: a.tracking_number,
    sku: a.sku,
  }))
}

// ── Calculate logistics health score ─────────────────────────────────────────
export async function calculateLogisticsHealth(userId: string): Promise<LogisticsHealth> {
  const supabase = createClient()

  const [{ data: active }, { data: last30 }] = await Promise.all([
    supabase.from('shipments').select('*')
      .eq('user_id', userId)
      .not('track_status', 'in', '("Delivered","Undelivered","Expired")'),
    supabase.from('shipments').select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
  ])

  const shipments = active || []
  const recent = last30 || []

  // No active shipments AND nothing in the last 30 days — there's genuinely nothing to
  // score yet. Without this branch, onTimeRate below defaults to 100 and produces a
  // "100/100 Healthy" badge that's visually identical to a real strong track record.
  if (shipments.length === 0 && recent.length === 0) {
    return {
      score: 0,
      label: 'No Shipment Data',
      color: 'grey',
      active_shipments: 0,
      at_risk: 0,
      customs_holds: 0,
      total_working_capital: 0,
      daily_financing_cost: 0,
      on_time_rate: 0,
      summary: 'No active shipments. Add tracking numbers to monitor your supply chain.',
    }
  }

  const atRisk = shipments.filter(s => s.is_at_risk).length
  const customsHolds = shipments.filter(s => s.customs_hold).length
  const totalWorkingCapital = shipments.reduce((sum, s) => sum + (s.total_value || 0), 0)
  const dailyFinancingCost = shipments.reduce((sum, s) => sum + (s.daily_financing_cost || 0), 0)

  // On-time rate from recent delivered shipments
  const delivered = recent.filter(s => s.track_status === 'Delivered')
  const onTime = delivered.filter(s => (s.delay_days || 0) === 0).length
  const onTimeRate = delivered.length > 0 ? Math.round((onTime / delivered.length) * 100) : 100

  // Score calculation (0-100)
  let score = 100
  score -= atRisk * 12          // -12 per at-risk shipment
  score -= customsHolds * 20    // -20 per customs hold
  score -= Math.max(0, (100 - onTimeRate) * 0.5) // -0.5 per % below 100% on-time
  score -= Math.min(20, Math.floor(dailyFinancingCost / 50) * 5) // -5 per £50/day financing
  score = Math.max(0, Math.min(100, Math.round(score)))

  const color = score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red'
  const label = score >= 70 ? 'Logistics Healthy'
    : score >= 40 ? 'Logistics at Risk'
    : 'Logistics Critical'

  const summary = shipments.length === 0
    ? 'No active shipments. Add tracking numbers to monitor your supply chain.'
    : customsHolds > 0
    ? `${customsHolds} shipment${customsHolds > 1 ? 's' : ''} in customs. Daily cost: £${dailyFinancingCost.toFixed(0)}.`
    : atRisk > 0
    ? `${atRisk} of ${shipments.length} shipments at risk. £${totalWorkingCapital.toLocaleString()} in transit.`
    : `${shipments.length} shipments on track. £${totalWorkingCapital.toLocaleString()} in transit.`

  return {
    score, label, color,
    active_shipments: shipments.length,
    at_risk: atRisk,
    customs_holds: customsHolds,
    total_working_capital: totalWorkingCapital,
    daily_financing_cost: dailyFinancingCost,
    on_time_rate: onTimeRate,
    summary,
  }
}

// ── Generate Daily Brief logistics section ────────────────────────────────────
export async function generateDailyLogisticsBrief(userId: string): Promise<DailyLogisticsBrief> {
  const [shipments, alerts] = await Promise.all([
    getActiveShipments(userId),
    getUnreadAlerts(userId),
  ])

  const onTrack = shipments.filter(s => !s.is_at_risk).length
  const delayed = shipments.filter(s => (s.delay_days || 0) > 0 && !s.customs_hold).length
  const customsHolds = shipments.filter(s => s.customs_hold).length
  const totalFinancialImpact = shipments.reduce((sum, s) => sum + (s.financial_impact || 0), 0)
  const workingCapitalInTransit = shipments.reduce((sum, s) => sum + (s.total_value || 0), 0)

  const critical = alerts.filter(a => a.level === 'critical')
  const warnings = alerts.filter(a => a.level === 'warning')

  // Most urgent action
  let mostUrgentAction: string | null = null
  if (customsHolds > 0) {
    const hold = shipments.find(s => s.customs_hold)
    mostUrgentAction = `Contact your customs broker about ${hold?.tracking_number || 'customs hold'}. Each day costs £${(hold?.daily_financing_cost || 0).toFixed(0)} in demurrage.`
  } else if (critical.length > 0) {
    mostUrgentAction = critical[0].action
  } else if (delayed > 0 && totalFinancialImpact > 100) {
    mostUrgentAction = `Review ${delayed} delayed shipment${delayed > 1 ? 's' : ''} — total financial impact: £${totalFinancialImpact.toFixed(0)}.`
  }

  return {
    on_track: onTrack,
    delayed,
    customs_holds: customsHolds,
    critical_alerts: critical,
    warning_alerts: warnings,
    total_financial_impact: totalFinancialImpact,
    most_urgent_action: mostUrgentAction,
    working_capital_in_transit: workingCapitalInTransit,
  }
}

// ── Supplier reliability score ────────────────────────────────────────────────
export async function getSupplierScores(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('shipments')
    .select('supplier_name, delay_days, customs_hold, track_status, total_value, order_date, actual_arrival')
    .eq('user_id', userId)
    .not('supplier_name', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200)

  if (!data?.length) return []

  // Group by supplier
  const bySupplier: Record<string, any[]> = {}
  for (const s of data) {
    if (!bySupplier[s.supplier_name]) bySupplier[s.supplier_name] = []
    bySupplier[s.supplier_name].push(s)
  }

  return Object.entries(bySupplier).map(([name, shipments]) => {
    const total = shipments.length
    const delivered = shipments.filter(s => s.track_status === 'Delivered')
    const onTime = delivered.filter(s => (s.delay_days || 0) === 0).length
    const avgDelay = delivered.length
      ? delivered.reduce((sum, s) => sum + (s.delay_days || 0), 0) / delivered.length
      : 0
    const customsRate = shipments.filter(s => s.customs_hold).length / total
    const onTimeRate = delivered.length ? Math.round((onTime / delivered.length) * 100) : null
    const score = onTimeRate !== null
      ? Math.max(0, onTimeRate - customsRate * 20 - Math.min(20, avgDelay * 2))
      : null

    return {
      supplier_name: name,
      total_shipments: total,
      on_time_rate: onTimeRate,
      avg_delay_days: parseFloat(avgDelay.toFixed(1)),
      customs_exception_rate: parseFloat((customsRate * 100).toFixed(1)),
      reliability_score: score !== null ? Math.round(score) : null,
      color: score === null ? 'grey' : score >= 80 ? 'green' : score >= 60 ? 'amber' : 'red',
    }
  }).sort((a, b) => (b.reliability_score || 0) - (a.reliability_score || 0))
}

// ── Check stockout risk for a shipment ────────────────────────────────────────
export function checkStockoutRisk(shipment: any, currentStock: number, dailySalesVelocity: number) {
  if (!currentStock || !dailySalesVelocity) return null

  const daysOfStockRemaining = Math.floor(currentStock / dailySalesVelocity)
  const expectedArrival = shipment.expected_arrival
    ? new Date(shipment.expected_arrival)
    : null
  const delayBuffer = shipment.delay_days || 0

  if (!expectedArrival) return null

  const today = new Date()
  const daysUntilArrival = Math.ceil(
    (expectedArrival.getTime() - today.getTime()) / 86400000
  ) + delayBuffer

  const willStockout = daysOfStockRemaining < daysUntilArrival
  const daysShort = Math.max(0, daysUntilArrival - daysOfStockRemaining)

  return {
    at_risk: willStockout,
    days_of_stock_remaining: daysOfStockRemaining,
    days_until_arrival: daysUntilArrival,
    days_short: daysShort,
    recommendation: willStockout
      ? daysShort <= 3
        ? 'CRITICAL: Source emergency stock immediately or suspend advertising to slow sales.'
        : 'WARNING: Consider air freight or emergency reorder. Reduce ad spend to extend stock.'
      : 'On track — sufficient stock until shipment arrives.',
  }
}
