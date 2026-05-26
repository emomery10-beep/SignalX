import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'cashier')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '30')
  const since = new Date(Date.now() - days * 86400000).toISOString()

  // Get closed shifts
  const { data: shifts } = await service
    .from('pos_shifts')
    .select('id, cashier_id, opened_at, closed_at, opening_balance, closing_balance, expected_balance, variance_amount, status, location_id')
    .eq('owner_id', auth.ownerId)
    .not('closed_at', 'is', null)
    .gte('opened_at', since)
    .order('opened_at', { ascending: false })
    .limit(100)

  if (!shifts?.length) {
    return NextResponse.json({ shifts: [], summary: null })
  }

  const shiftIds = shifts.map(s => s.id)

  // Get transactions for these shifts
  const { data: transactions } = await service
    .from('pos_transactions')
    .select('id, shift_id, total, subtotal, discount_amount, payment_type, status')
    .in('shift_id', shiftIds)
    .eq('status', 'completed')
    .limit(5000)

  // Get items for margin calculation
  const txIds = (transactions || []).map(t => t.id)
  let itemsByTx: Record<string, { revenue: number; cost: number }> = {}

  if (txIds.length > 0) {
    const { data: items } = await service
      .from('pos_items')
      .select('transaction_id, unit_price, cost_price, qty')
      .in('transaction_id', txIds)
      .limit(10000)

    for (const item of items || []) {
      if (!itemsByTx[item.transaction_id]) itemsByTx[item.transaction_id] = { revenue: 0, cost: 0 }
      const qty = item.qty || 1
      itemsByTx[item.transaction_id].revenue += (item.unit_price || 0) * qty
      itemsByTx[item.transaction_id].cost += (item.cost_price || 0) * qty
    }
  }

  // Get staff names
  const cashierIds = [...new Set(shifts.map(s => s.cashier_id).filter(Boolean))]
  let staffMap: Record<string, string> = {}
  if (cashierIds.length > 0) {
    const { data: staffRows } = await service
      .from('pos_staff')
      .select('id, name')
      .in('id', cashierIds)
    for (const s of staffRows || []) staffMap[s.id] = s.name
  }

  // Aggregate per shift
  const txByShift: Record<string, typeof transactions> = {}
  for (const tx of transactions || []) {
    if (!tx.shift_id) continue
    if (!txByShift[tx.shift_id]) txByShift[tx.shift_id] = []
    txByShift[tx.shift_id]!.push(tx)
  }

  const scoredShifts = shifts.map(shift => {
    const shiftTx = txByShift[shift.id] || []
    const revenue = shiftTx.reduce((s, t) => s + (t.total || 0), 0)
    const discounts = shiftTx.reduce((s, t) => s + (t.discount_amount || 0), 0)

    let totalCost = 0
    let totalItemRevenue = 0
    for (const tx of shiftTx) {
      const itemData = itemsByTx[tx.id]
      if (itemData) {
        totalCost += itemData.cost
        totalItemRevenue += itemData.revenue
      }
    }

    const grossProfit = revenue - totalCost
    const margin = revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0

    const durationMs = shift.closed_at && shift.opened_at
      ? new Date(shift.closed_at).getTime() - new Date(shift.opened_at).getTime()
      : 0
    const durationHours = durationMs / 3600000

    const revenuePerHour = durationHours > 0 ? revenue / durationHours : 0
    const profitPerHour = durationHours > 0 ? grossProfit / durationHours : 0
    const txPerHour = durationHours > 0 ? shiftTx.length / durationHours : 0

    const cashTx = shiftTx.filter(t => t.payment_type === 'cash' || !t.payment_type)
    const cardTx = shiftTx.filter(t => t.payment_type === 'card')
    const cashRevenue = cashTx.reduce((s, t) => s + (t.total || 0), 0)
    const cardRevenue = cardTx.reduce((s, t) => s + (t.total || 0), 0)

    // Score: composite of revenue/hr, margin, tx volume, variance
    const varianceAbs = Math.abs(shift.variance_amount || 0)
    const variancePenalty = varianceAbs > 5 ? Math.min(varianceAbs * 2, 30) : 0

    let score = 0
    score += Math.min(revenuePerHour / 5, 30) // up to 30 pts for revenue/hr
    score += Math.min(margin, 30) // up to 30 pts for margin
    score += Math.min(txPerHour * 3, 20) // up to 20 pts for tx volume
    score += shiftTx.length > 0 ? 10 : 0 // 10 pts for having sales
    score += discounts === 0 ? 10 : Math.max(0, 10 - (discounts / revenue) * 100) // up to 10 pts for discount control
    score -= variancePenalty
    score = Math.max(0, Math.min(100, Math.round(score)))

    let grade: 'A' | 'B' | 'C' | 'D' | 'F'
    if (score >= 80) grade = 'A'
    else if (score >= 65) grade = 'B'
    else if (score >= 50) grade = 'C'
    else if (score >= 35) grade = 'D'
    else grade = 'F'

    return {
      shift_id: shift.id,
      cashier: staffMap[shift.cashier_id] || shift.cashier_id || 'Unknown',
      opened_at: shift.opened_at,
      closed_at: shift.closed_at,
      duration_hours: Math.round(durationHours * 10) / 10,
      tx_count: shiftTx.length,
      revenue: Math.round(revenue * 100) / 100,
      cost: Math.round(totalCost * 100) / 100,
      gross_profit: Math.round(grossProfit * 100) / 100,
      margin_pct: Math.round(margin * 10) / 10,
      revenue_per_hour: Math.round(revenuePerHour * 100) / 100,
      profit_per_hour: Math.round(profitPerHour * 100) / 100,
      tx_per_hour: Math.round(txPerHour * 10) / 10,
      cash_revenue: Math.round(cashRevenue * 100) / 100,
      card_revenue: Math.round(cardRevenue * 100) / 100,
      discounts: Math.round(discounts * 100) / 100,
      variance: Math.round((shift.variance_amount || 0) * 100) / 100,
      score,
      grade,
    }
  })

  // Summary
  const totalShifts = scoredShifts.length
  const avgScore = totalShifts > 0 ? Math.round(scoredShifts.reduce((s, sh) => s + sh.score, 0) / totalShifts) : 0
  const avgRevPerHour = totalShifts > 0 ? Math.round(scoredShifts.reduce((s, sh) => s + sh.revenue_per_hour, 0) / totalShifts * 100) / 100 : 0
  const avgMargin = totalShifts > 0 ? Math.round(scoredShifts.reduce((s, sh) => s + sh.margin_pct, 0) / totalShifts * 10) / 10 : 0
  const bestShift = scoredShifts.length ? scoredShifts.reduce((a, b) => a.score > b.score ? a : b) : null
  const worstShift = scoredShifts.length ? scoredShifts.reduce((a, b) => a.score < b.score ? a : b) : null

  // By cashier
  const byCashier: Record<string, { shifts: number; totalScore: number; totalRevenue: number; totalHours: number }> = {}
  for (const sh of scoredShifts) {
    if (!byCashier[sh.cashier]) byCashier[sh.cashier] = { shifts: 0, totalScore: 0, totalRevenue: 0, totalHours: 0 }
    byCashier[sh.cashier].shifts++
    byCashier[sh.cashier].totalScore += sh.score
    byCashier[sh.cashier].totalRevenue += sh.revenue
    byCashier[sh.cashier].totalHours += sh.duration_hours
  }

  const cashierLeaderboard = Object.entries(byCashier)
    .map(([name, d]) => ({
      name,
      shifts: d.shifts,
      avg_score: Math.round(d.totalScore / d.shifts),
      total_revenue: Math.round(d.totalRevenue * 100) / 100,
      rev_per_hour: d.totalHours > 0 ? Math.round((d.totalRevenue / d.totalHours) * 100) / 100 : 0,
    }))
    .sort((a, b) => b.avg_score - a.avg_score)

  return NextResponse.json({
    shifts: scoredShifts,
    summary: {
      total_shifts: totalShifts,
      avg_score: avgScore,
      avg_rev_per_hour: avgRevPerHour,
      avg_margin: avgMargin,
      best_shift: bestShift ? { cashier: bestShift.cashier, score: bestShift.score, date: bestShift.opened_at } : null,
      worst_shift: worstShift ? { cashier: worstShift.cashier, score: worstShift.score, date: worstShift.opened_at } : null,
      days,
    },
    leaderboard: cashierLeaderboard,
  })
}
