import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { cashier_id, location_id, opening_cash_balance } = body

  if (!cashier_id || !location_id) {
    return NextResponse.json({ error: 'cashier_id and location_id required' }, { status: 400 })
  }

  // Close any stale open shift for this cashier first (safety net)
  await service
    .from('pos_shifts')
    .update({ closed_at: new Date().toISOString() })
    .eq('owner_id', ownerId)
    .eq('cashier_id', cashier_id)
    .is('closed_at', null)

  // Open new shift
  const { data: shift, error } = await service
    .from('pos_shifts')
    .insert({
      owner_id:        ownerId,
      cashier_id,
      location_id,
      opening_balance: Number(opening_cash_balance) || 0,
      opened_at:       new Date().toISOString(),
      opened_by:       cashier_id,
    })
    .select('id, opened_at, opening_balance')
    .single()

  if (error) {
    console.error('Shift open error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success:         true,
    shift_id:        shift.id,
    opened_at:       shift.opened_at,
    opening_balance: shift.opening_balance,
  })
}
