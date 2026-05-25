import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { logPosAudit } from '@/lib/pos-audit'

/**
 * POST /api/pos/shift/open
 *
 * Opens a new shift for a cashier
 * Records opening cash balance and start time
 *
 * Body:
 *   cashier_id: string
 *   location_id: uuid
 *   opening_cash_balance: number (in pence/cents)
 */
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const ownerId = auth.ownerId

  const service = createServiceClient()
  const body = await req.json()
  const { cashier_id, location_id, opening_cash_balance } = body

  if (!cashier_id || !location_id || opening_cash_balance === undefined) {
    return NextResponse.json(
      { error: 'cashier_id, location_id, and opening_cash_balance required' },
      { status: 400 }
    )
  }

  // Check if cashier already has an open shift
  const { data: existingShift } = await service
    .from('pos_shifts')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('cashier_id', cashier_id)
    .eq('closed_at', null)
    .maybeSingle()

  if (existingShift) {
    return NextResponse.json({ error: 'Cashier already has an open shift' }, { status: 400 })
  }

  // Create shift record
  const { data: shift, error } = await service
    .from('pos_shifts')
    .insert({
      owner_id: ownerId,
      cashier_id,
      location_id,
      opened_at: new Date().toISOString(),
      opening_balance: opening_cash_balance,
      opened_by: ownerId, // In real system, would be manager_id
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  logPosAudit({ auth, event: 'shift.opened', entityType: 'shift', entityId: shift.id,
    metadata: { cashier_id: cashier_id, location_id, opening_balance: opening_cash_balance } })

  return NextResponse.json({
    success: true,
    shift_id: shift.id,
    cashier_id,
    opened_at: shift.opened_at,
    opening_balance: Math.round(opening_cash_balance * 100) / 100,
    status: 'open',
  })
}
