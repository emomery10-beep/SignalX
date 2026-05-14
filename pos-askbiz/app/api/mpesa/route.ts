import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { initiateStkPush, queryStkStatus } from '@/lib/mpesa'

// POST — initiate STK Push or query status
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { action } = body

    if (action === 'stk_push') {
      const { phone, plan, seats } = body
      if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

      const isPosSeats = !!seats
      const amount = isPosSeats
        ? Math.max(1, Math.min(50, parseInt(seats, 10))) * 500
        : plan === 'business' ? 4900 : 2400
      const accountRef = isPosSeats ? `ASKBIZ-POS-${seats}` : `ASKBIZ-${(plan || 'growth').toUpperCase()}`

      const result = await initiateStkPush({
        phone,
        amount,
        accountRef,
        description: isPosSeats ? `AskBiz POS ${seats} seat(s)` : `AskBiz ${plan} plan`,
      })

      // Store pending payment for callback reconciliation
      await supabase.from('mpesa_payments').insert({
        user_id: user.id,
        checkout_request_id: result.CheckoutRequestID,
        merchant_request_id: result.MerchantRequestID,
        phone: phone,
        amount,
        plan: isPosSeats ? `pos_seats_${seats}` : plan,
        status: 'pending',
      })

      return NextResponse.json({
        success: true,
        checkoutRequestId: result.CheckoutRequestID,
        message: result.CustomerMessage,
      })
    }

    if (action === 'query') {
      const { checkoutRequestId } = body
      if (!checkoutRequestId) return NextResponse.json({ error: 'Missing checkoutRequestId' }, { status: 400 })

      const result = await queryStkStatus(checkoutRequestId)
      const resultCode = parseInt(result.ResultCode, 10)

      return NextResponse.json({
        completed: resultCode === 0,
        cancelled: resultCode === 1032,
        pending: isNaN(resultCode),
        resultCode,
        resultDesc: result.ResultDesc,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[mpesa] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
