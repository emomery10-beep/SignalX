import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * POST /api/pos/shift/close
 *
 * Closes a shift and reconciles cash
 * Compares expected cash vs. physical count
 * Flags discrepancies for investigation
 *
 * Body:
 *   shift_id: uuid
 *   physical_cash_count: number (in pence/cents, actual count from register)
 *   variance_reason?: string (if discrepancy > threshold)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { shift_id, physical_cash_count, variance_reason } = body

  if (!shift_id || physical_cash_count === undefined) {
    return NextResponse.json({ error: 'shift_id and physical_cash_count required' }, { status: 400 })
  }

  // Get shift details
  const { data: shift } = await service
    .from('pos_shifts')
    .select('id, cashier_id, opening_balance, closed_at, opened_at')
    .eq('id', shift_id)
    .eq('owner_id', ownerId)
    .single()

  if (!shift) {
    return NextResponse.json({ error: 'Shift not found' }, { status: 404 })
  }

  if (shift.closed_at) {
    return NextResponse.json({ error: 'Shift already closed' }, { status: 400 })
  }

  // Get all transactions in this shift
  const { data: transactions } = await service
    .from('pos_transactions')
    .select('total, payment_type')
    .eq('shift_id', shift_id)
    .eq('owner_id', ownerId)
    .eq('status', 'completed')

  const cashSales = (transactions || [])
    .filter((tx: any) => tx.payment_type === 'cash' || !tx.payment_type)
    .reduce((sum: number, tx: any) => sum + (tx.total || 0), 0)

  // Logistics: a counter clerk's drawer also holds cash parcel fees, which
  // live in pos_parcels (not pos_transactions). Count cash parcels this
  // cashier took in during the shift so reconciliation isn't a false variance.
  let parcelCash = 0
  if (shift.cashier_id) {
    const { data: parcels } = await service
      .from('pos_parcels')
      .select('fee_charged')
      .eq('owner_id', ownerId)
      .eq('received_by', shift.cashier_id)
      .eq('payment_method', 'cash')
      .eq('payment_status', 'paid')
      .gte('created_at', shift.opened_at)
    parcelCash = (parcels || []).reduce((sum: number, p: any) => sum + (p.fee_charged || 0), 0)
  }

  // Calculate expected cash
  const expectedCash = shift.opening_balance + cashSales + parcelCash

  // Calculate variance
  const variance = physical_cash_count - expectedCash
  const variancePercent = expectedCash > 0 ? (Math.abs(variance) / expectedCash) * 100 : 0

  // Flag if variance exceeds threshold (£5 or 2%)
  const VARIANCE_THRESHOLD_PENCE = 500 // £5
  const VARIANCE_PERCENT_THRESHOLD = 2
  const hasSignificantVariance = Math.abs(variance) > VARIANCE_THRESHOLD_PENCE || variancePercent > VARIANCE_PERCENT_THRESHOLD

  if (hasSignificantVariance && !variance_reason) {
    return NextResponse.json(
      {
        error: 'Variance exceeds threshold - reason required',
        variance_amount: Math.round(variance * 100) / 100,
        variance_percent: variancePercent.toFixed(2),
        requires_reason: true,
      },
      { status: 400 }
    )
  }

  // Close shift
  const { data: closedShift, error: closeError } = await service
    .from('pos_shifts')
    .update({
      closed_at: new Date().toISOString(),
      closing_balance: physical_cash_count,
      expected_balance: expectedCash,
      variance_amount: variance,
      variance_reason: variance_reason || null,
      status: hasSignificantVariance ? 'reconciled_with_variance' : 'reconciled',
    })
    .eq('id', shift_id)
    .select()
    .single()

  if (closeError) {
    return NextResponse.json({ error: closeError.message }, { status: 500 })
  }

  // Create audit log entry
  await service.from('pos_shift_audit_log').insert({
    owner_id: ownerId,
    shift_id,
    event: 'shift_closed',
    details_json: {
      opening_balance: shift.opening_balance,
      closing_balance: physical_cash_count,
      expected_balance: expectedCash,
      variance: variance,
      variance_reason,
      cash_sales: cashSales,
      parcel_cash: parcelCash,
      transaction_count: transactions?.length || 0,
    },
    logged_at: new Date().toISOString(),
  })

  return NextResponse.json({
    success: true,
    shift_id,
    closed_at: closedShift.closed_at,
    reconciliation: {
      opening_balance: Math.round(shift.opening_balance * 100) / 100,
      cash_sales: Math.round(cashSales * 100) / 100,
      parcel_cash: Math.round(parcelCash * 100) / 100,
      expected_balance: Math.round(expectedCash * 100) / 100,
      physical_count: Math.round(physical_cash_count * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      variance_percent: variancePercent.toFixed(2),
      status: closedShift.status,
      variance_reason,
    },
    alerts: hasSignificantVariance ? [`Cash variance: £${Math.abs(variance / 100).toFixed(2)}`] : [],
  })
}
