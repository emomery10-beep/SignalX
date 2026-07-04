import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submitOrder, getTransactionStatus, isPaymentComplete, isPaymentFailed } from '@/lib/pesapal'
import { PRICING } from '@/lib/geo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { action } = body

    if (action === 'submit_order') {
      const { plan, seats } = body
      if (!plan && !seats) return NextResponse.json({ error: 'Plan or seats required' }, { status: 400 })

      const isPosSeats = !!seats
      const seatCount = isPosSeats ? Math.max(1, Math.min(50, parseInt(seats, 10))) : 0
      const kesPricing = PRICING.KES
      const amount = isPosSeats
        ? seatCount * 500
        : plan === 'business' ? kesPricing[2] : kesPricing[1]

      const orderId = `ASKBIZ-${isPosSeats ? `POS-${seatCount}` : plan.toUpperCase()}-${Date.now()}`

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const names = ((profile as { full_name?: string } | null)?.full_name || '').split(' ')

      const result = await submitOrder({
        orderId,
        amount,
        currency: 'KES',
        description: isPosSeats ? `AskBiz POS ${seatCount} seat(s)` : `AskBiz ${plan} plan`,
        email: user.email!,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        // Whitelisted return path — vendor setup flow returns to its own
        // activation screen. Exact match only; default stays /billing.
        callbackUrl: body.return_path === '/pos/activate'
          ? `${APP_URL}/pos/activate?pesapal=complete`
          : `${APP_URL}/billing?pesapal=complete`,
      })

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      await supabase.from('pesapal_payments').insert({
        user_id: user.id,
        order_tracking_id: result.order_tracking_id,
        merchant_reference: result.merchant_reference,
        amount,
        plan: isPosSeats ? `pos_seats_${seatCount}` : plan,
        status: 'pending',
      }).then(() => {}, () => {})

      return NextResponse.json({
        success: true,
        redirectUrl: result.redirect_url,
        orderTrackingId: result.order_tracking_id,
      })
    }

    if (action === 'check_status') {
      const { orderTrackingId } = body
      if (!orderTrackingId) return NextResponse.json({ error: 'Missing orderTrackingId' }, { status: 400 })

      const status = await getTransactionStatus(orderTrackingId)

      return NextResponse.json({
        completed: isPaymentComplete(status),
        failed: isPaymentFailed(status),
        statusCode: status.status_code,
        paymentMethod: status.payment_method,
        confirmationCode: status.confirmation_code,
        description: status.payment_status_description,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[pesapal] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
