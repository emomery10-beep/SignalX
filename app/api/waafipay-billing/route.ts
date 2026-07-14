import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { initiateWaafiBillingPurchase } from '@/lib/waafipay-billing'

// USD pricing — matches Somalia's existing USD framing on the landing page,
// not Somali Shillings (mirrors PRICING.USD in lib/geo/index.ts, kept local
// here since that shared map isn't authoritative for Somalia yet).
const USD_PLAN_PRICE: Record<string, number> = { growth: 19, business: 49 }
const USD_SEAT_PRICE = 5

function normalizeSomaliPhone(raw: string): string | null {
  let phone = raw.replace(/[\s\-()]/g, '')
  if (phone.startsWith('+252')) phone = phone
  else if (phone.startsWith('252')) phone = `+${phone}`
  else if (phone.startsWith('0')) phone = `+252${phone.slice(1)}`
  else phone = `+252${phone}`
  // TODO(waafipay-verify): confirm exact Somali MSISDN length per carrier
  return /^\+252\d{8,9}$/.test(phone) ? phone : null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { action } = body

    if (action === 'submit_order') {
      const { plan, seats, phone } = body
      if (!plan && !seats) return NextResponse.json({ error: 'Plan or seats required' }, { status: 400 })
      if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

      const normalizedPhone = normalizeSomaliPhone(phone)
      if (!normalizedPhone) {
        return NextResponse.json({ error: 'Please enter a valid Somali phone number (e.g. 061 234 5678)' }, { status: 400 })
      }

      const isPosSeats = !!seats
      const seatCount = isPosSeats ? Math.max(1, Math.min(50, parseInt(seats, 10))) : 0
      const amount = isPosSeats
        ? seatCount * USD_SEAT_PRICE
        : USD_PLAN_PRICE[plan]

      if (!isPosSeats && !amount) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }

      const referenceId = randomUUID()
      const planLabel = isPosSeats ? `pos_seats_${seatCount}` : plan

      const purchase = await initiateWaafiBillingPurchase({
        accountNo: normalizedPhone.replace('+', ''),
        referenceId,
        invoiceId: referenceId,
        amount: amount.toFixed(2),
        currency: 'USD',
        description: isPosSeats ? `AskBiz POS ${seatCount} seat(s)` : `AskBiz ${plan} plan`,
      })

      const { error: insertError } = await supabase.from('waafipay_billing_payments').insert({
        user_id: user.id,
        reference_id: referenceId,
        amount,
        currency: 'USD',
        plan: planLabel,
        phone: normalizedPhone,
        status: 'pending',
      })

      if (insertError) {
        console.error('[waafipay-billing] Failed to record payment:', insertError)
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        reference_id: referenceId,
        message: `Payment request sent to ${normalizedPhone}`,
        amount,
        status: 'pending',
        _waafiState: purchase.state, // debugging aid, not relied on by the client
      })
    }

    if (action === 'check_status') {
      const { reference_id } = body
      if (!reference_id) return NextResponse.json({ error: 'Missing reference_id' }, { status: 400 })

      const { data: payment, error } = await supabase
        .from('waafipay_billing_payments')
        .select('status, plan')
        .eq('reference_id', reference_id)
        .eq('user_id', user.id)
        .single()

      if (error || !payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

      return NextResponse.json({
        completed: payment.status === 'completed',
        failed: payment.status === 'failed',
        status: payment.status,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[waafipay-billing] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
