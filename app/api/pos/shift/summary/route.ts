import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/shift/summary
 *
 * Shift performance dashboard and analytics
 * Query params:
 *   start_date: ISO date
 *   end_date: ISO date
 *   cashier_id?: string (filter by cashier)
 *   include_variances?: boolean (default true)
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)

  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const cashierId = searchParams.get('cashier_id')
  const includeVariances = searchParams.get('include_variances') !== 'false'

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'start_date and end_date required' }, { status: 400 })
  }

  // Get shifts in period
  let query = service
    .from('pos_shifts')
    .select(`
      id,
      cashier_id,
      opening_balance,
      closing_balance,
      expected_balance,
      variance_amount,
      opened_at,
      closed_at,
      status
    `)
    .eq('owner_id', ownerId)
    .gte('opened_at', `${startDate}T00:00:00Z`)
    .lte('closed_at', `${endDate}T23:59:59Z`)
    .not('closed_at', 'is', null) // Only closed shifts

  if (cashierId) {
    query = query.eq('cashier_id', cashierId)
  }

  const { data: shifts } = await query.order('closed_at', { ascending: false })

  if (!shifts || shifts.length === 0) {
    return NextResponse.json({ shifts: [], summary: { total_shifts: 0 } })
  }

  // Aggregate by cashier
  const byCashier: Record<string, any> = {}
  let totalOpened = 0
  let totalClosed = 0
  let totalVariance = 0
  let varianceCount = 0
  let totalDuration = 0

  for (const shift of shifts) {
    if (!byCashier[shift.cashier_id]) {
      byCashier[shift.cashier_id] = {
        cashier_id: shift.cashier_id,
        shifts_count: 0,
        total_sales: 0,
        total_variance: 0,
        variance_count: 0,
        avg_variance_percent: 0,
      }
    }

    const cashier = byCashier[shift.cashier_id]

    totalOpened += shift.opening_balance || 0
    totalClosed += shift.closing_balance || 0

    const variance = shift.variance_amount || 0
    if (variance !== 0) {
      totalVariance += Math.abs(variance)
      varianceCount++
    }

    cashier.shifts_count++
    cashier.total_variance += Math.abs(variance)
    if (variance !== 0) {
      cashier.variance_count++
    }

    const expected = shift.expected_balance || 0
    const variancePercent = expected > 0 ? (Math.abs(variance) / expected) * 100 : 0
    cashier.avg_variance_percent = (
      (cashier.avg_variance_percent * (cashier.shifts_count - 1) + variancePercent) /
      cashier.shifts_count
    ).toFixed(2)

    const shiftDuration = shift.closed_at ? new Date(shift.closed_at).getTime() - new Date(shift.opened_at).getTime() : 0
    totalDuration += shiftDuration
  }

  // Calculate stats
  const averageShiftDuration = shifts.length > 0 ? totalDuration / shifts.length / (1000 * 60 * 60) : 0 // hours

  // Find cash variance patterns
  const variances = shifts.map((s) => ({
    amount: Math.abs(s.variance_amount || 0),
    percent: s.expected_balance ? (Math.abs(s.variance_amount || 0) / s.expected_balance) * 100 : 0,
    cashier: s.cashier_id,
  }))

  const avgVariance = variances.length > 0 ? variances.reduce((sum, v) => sum + v.amount, 0) / variances.length : 0
  const largestVariances = variances.sort((a, b) => b.amount - a.amount).slice(0, 5)

  // Alerts
  const alerts = []
  if (varianceCount > shifts.length * 0.5) {
    alerts.push(`${varianceCount} out of ${shifts.length} shifts have variances - investigate cash handling`)
  }
  if (largestVariances[0]?.amount > 10000) {
    alerts.push(`Largest variance: £${(largestVariances[0].amount / 100).toFixed(2)} - review shift procedures`)
  }

  const topCashiersByVariance = Object.values(byCashier)
    .sort((a: any, b: any) => parseFloat(b.avg_variance_percent) - parseFloat(a.avg_variance_percent))
    .slice(0, 3)

  if (topCashiersByVariance.length > 0 && parseFloat(topCashiersByVariance[0].avg_variance_percent) > 2) {
    alerts.push(`Cashier ${topCashiersByVariance[0].cashier_id} has high variance (${topCashiersByVariance[0].avg_variance_percent}%)`)
  }

  return NextResponse.json({
    period: { start_date: startDate, end_date: endDate },
    summary: {
      total_shifts: shifts.length,
      total_cash_opened: Math.round(totalOpened * 100) / 100,
      total_cash_closed: Math.round(totalClosed * 100) / 100,
      total_variance: Math.round(totalVariance * 100) / 100,
      shifts_with_variance: varianceCount,
      avg_variance_per_shift: Math.round(avgVariance * 100) / 100,
      average_shift_duration_hours: averageShiftDuration.toFixed(1),
      reconciliation_rate: ((shifts.length - varianceCount) / shifts.length * 100).toFixed(1) + '%',
    },
    by_cashier: Object.values(byCashier).map((cashier: any) => ({
      cashier_id: cashier.cashier_id,
      shifts: cashier.shifts_count,
      total_variance: Math.round(cashier.total_variance * 100) / 100,
      avg_variance_percent: cashier.avg_variance_percent,
      variance_shifts: cashier.variance_count,
    })),
    largest_variances: includeVariances
      ? largestVariances.map((v) => ({
          amount: Math.round(v.amount * 100) / 100,
          percent: v.percent.toFixed(2),
          cashier: v.cashier,
        }))
      : [],
    alerts,
  })
}
