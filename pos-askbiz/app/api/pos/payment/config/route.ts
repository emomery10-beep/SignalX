import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/payment/config
 *
 * Fetch current payment configuration for the merchant
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  try {
    const { data: config } = await service
      .from('merchant_payment_config')
      .select('*')
      .eq('owner_id', ownerId)
      .single()

    if (!config) {
      return NextResponse.json({
        is_active: false,
        payment_provider: 'none',
      })
    }

    return NextResponse.json(config)
  } catch (error: any) {
    console.error('[payment/config] error:', error)
    return NextResponse.json(
      { is_active: false, payment_provider: 'none' },
      { status: 200 }
    )
  }
}
