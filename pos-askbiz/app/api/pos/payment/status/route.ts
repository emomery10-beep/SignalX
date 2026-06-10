import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/payment/status?payment_id=xxx
 *
 * Check payment status for polling
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const paymentId = req.nextUrl.searchParams.get('payment_id')
  if (!paymentId) {
    return NextResponse.json({ error: 'payment_id required' }, { status: 400 })
  }

  const service = createServiceClient()

  try {
    const { data: payment, error } = await service
      .from('pos_payments')
      .select('status, completed_at')
      .eq('id', paymentId)
      .eq('owner_id', ownerId)
      .single()

    if (error || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: payment.status,
      completed_at: payment.completed_at,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
