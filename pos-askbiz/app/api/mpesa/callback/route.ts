import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Safaricom sends the STK Push result here
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const callback = body.Body?.stkCallback
    if (!callback) return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = callback

    const supabase = createServiceClient()

    const mpesaReceipt = callback.CallbackMetadata?.Item?.find(
      (i: { Name: string }) => i.Name === 'MpesaReceiptNumber'
    )?.Value

    const { data: payment } = await supabase
      .from('mpesa_payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .maybeSingle()

    if (!payment) {
      console.warn('[mpesa/callback] no matching payment for', CheckoutRequestID)
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    if (ResultCode === 0) {
      // Payment successful
      await supabase
        .from('mpesa_payments')
        .update({
          status: 'completed',
          mpesa_receipt: mpesaReceipt || null,
          completed_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', CheckoutRequestID)

      // Activate the plan or POS seats
      const plan = payment.plan as string
      if (plan.startsWith('pos_seats_')) {
        const seatCount = parseInt(plan.replace('pos_seats_', ''), 10)
        await supabase
          .from('profiles')
          .update({ pos_enabled: true, pos_seat_count: seatCount })
          .eq('id', payment.user_id)
      } else {
        // Activate subscription plan
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: payment.user_id,
            plan_id: plan,
            status: 'active',
            payment_method: 'mpesa',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
          }, { onConflict: 'user_id' })

        await supabase
          .from('profiles')
          .update({ plan_id: plan, plan: plan })
          .eq('id', payment.user_id)
      }
    } else {
      await supabase
        .from('mpesa_payments')
        .update({ status: 'failed', result_desc: ResultDesc })
        .eq('checkout_request_id', CheckoutRequestID)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err) {
    console.error('[mpesa/callback] error:', err)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}
