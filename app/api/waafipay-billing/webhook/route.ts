import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { verifyWaafiBillingWebhookSignature } from '@/lib/waafipay-billing'
import { provisionStaffDrafts } from '@/lib/pos-staff-provision'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const APPROVED_STATUSES = new Set(['APPROVED'])
const TERMINAL_FAILED_STATUSES = new Set(['FAILED', 'DECLINED', 'CANCELED', 'EXPIRED', 'TIMEOUT'])

/**
 * POST /api/waafipay-billing/webhook
 *
 * Receive payment confirmations for AskBiz's own subscription billing.
 * Single platform-level secret (WAAFIPAY_ASKBIZ_WEBHOOK_SECRET) — unlike
 * pos-askbiz's per-merchant webhook, there's only ever one AskBiz WaafiPay
 * account here, so no owner lookup is needed before verifying the signature.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-webhook-signature') || ''
    const timestamp = req.headers.get('x-webhook-timestamp') || ''

    let event: any
    try {
      event = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // WaafiPay's registration handshake/test-ping — ack without touching the DB
    if (event?.event === 'webhook.test') {
      return NextResponse.json({ status: 'ok' })
    }

    const eventId = event?.event_id || event?.transaction_id || event?.order_id || ''
    const referenceId = event?.order_id || event?.payment?.order_id

    if (!referenceId) {
      console.warn('[waafipay-billing/webhook] No order_id in payload')
      return NextResponse.json({ status: 'processed' })
    }

    const validSignature = verifyWaafiBillingWebhookSignature(rawBody, timestamp, eventId, signature)
    if (!validSignature) {
      console.warn('[waafipay-billing/webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('waafipay_billing_payments')
      .select('*')
      .eq('reference_id', referenceId)
      .single()

    if (paymentError || !payment) {
      console.warn(`[waafipay-billing/webhook] Payment not found for reference ${referenceId}`)
      return NextResponse.json({ status: 'processed' })
    }

    const paymentStatus: string = event?.payment?.status || event?.status || ''

    if (APPROVED_STATUSES.has(paymentStatus)) {
      await supabaseAdmin
        .from('waafipay_billing_payments')
        .update({
          status: 'completed',
          external_receipt: event?.transaction_id || event?.payment?.transaction_id || null,
          completed_at: new Date().toISOString(),
        })
        .eq('reference_id', referenceId)

      const plan = payment.plan as string
      const userId = payment.user_id as string

      // Same target tables/update shape as app/api/pesapal/callback/route.ts,
      // just triggered by WaafiPay instead of PesaPal.
      if (plan.startsWith('pos_seats_')) {
        const seats = parseInt(plan.replace('pos_seats_', ''), 10)
        await supabaseAdmin
          .from('profiles')
          .update({ pos_enabled: true, pos_seat_count: seats })
          .eq('id', userId)
        await supabaseAdmin.from('trials').update({ converted: true }).eq('user_id', userId).eq('trial_type', 'pos')
        await provisionStaffDrafts(userId).catch(() => {})
      } else {
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_id: plan,
            status: 'active',
            payment_provider: 'waafipay',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }, { onConflict: 'user_id' })
        if (plan === 'growth' || plan === 'business') {
          await supabaseAdmin.from('trials').update({ converted: true }).eq('user_id', userId).eq('trial_type', 'growth')
        }
      }

      console.log(`[waafipay-billing/webhook] Payment completed: ${referenceId} -> ${plan} for ${userId}`)
    } else if (TERMINAL_FAILED_STATUSES.has(paymentStatus)) {
      await supabaseAdmin
        .from('waafipay_billing_payments')
        .update({ status: 'failed' })
        .eq('reference_id', referenceId)
    }

    return NextResponse.json({ status: 'processed' })
  } catch (error: any) {
    console.error('[waafipay-billing/webhook] error:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
