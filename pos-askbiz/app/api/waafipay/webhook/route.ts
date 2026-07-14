import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyWaafiWebhookSignature } from '@/lib/waafipay'

const APPROVED_STATUSES = new Set(['APPROVED'])
const TERMINAL_FAILED_STATUSES = new Set(['FAILED', 'DECLINED', 'CANCELED', 'EXPIRED', 'TIMEOUT'])

/**
 * POST /api/waafipay/webhook
 *
 * Receive payment confirmations from WaafiPay (EVC Plus / WAAFI / Zaad / Sahal).
 *
 * Deliberate deviation from the Paystack webhook template: WaafiPay's signing
 * secret is per-merchant (returned by WEBHOOK_REGISTER), but the payload body
 * carries no merchant identifier — only `order_id`/`transaction_id`. So the
 * merchant must be looked up via `pos_payments.external_reference` BEFORE the
 * signature can be verified, unlike Paystack where one platform-wide secret
 * verifies every payload up front. If that lookup fails, we reject with 401
 * rather than "warn and 200", since verification can't proceed without it.
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
    const orderId = event?.order_id || event?.payment?.order_id

    if (!orderId) {
      console.warn('[waafipay/webhook] No order_id in payload')
      return NextResponse.json({ status: 'processed' })
    }

    const service = createServiceClient()

    // Look up the merchant via the payment record before we can verify the signature
    const { data: payment, error: paymentError } = await service
      .from('pos_payments')
      .select('id, owner_id, transaction_id, status')
      .eq('external_reference', orderId)
      .single()

    if (paymentError || !payment) {
      console.warn(`[waafipay/webhook] Payment not found for order_id ${orderId}`)
      return NextResponse.json({ error: 'Unknown payment' }, { status: 401 })
    }

    const { data: config } = await service
      .from('merchant_payment_config')
      .select('waafipay_webhook_secret')
      .eq('owner_id', payment.owner_id)
      .single()

    if (!config?.waafipay_webhook_secret) {
      console.warn(`[waafipay/webhook] No webhook secret configured for owner ${payment.owner_id}`)
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 401 })
    }

    const validSignature = verifyWaafiWebhookSignature(
      rawBody,
      timestamp,
      eventId,
      signature,
      config.waafipay_webhook_secret
    )

    if (!validSignature) {
      console.warn('[waafipay/webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const paymentStatus: string = event?.payment?.status || event?.status || ''

    if (APPROVED_STATUSES.has(paymentStatus)) {
      await service
        .from('pos_payments')
        .update({
          status: 'completed',
          external_receipt: event?.transaction_id || event?.payment?.transaction_id || null,
          completed_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      await service
        .from('pos_transactions')
        .update({ payment_status: 'paid' })
        .eq('id', payment.transaction_id)
        .eq('owner_id', payment.owner_id)
    } else if (TERMINAL_FAILED_STATUSES.has(paymentStatus)) {
      await service
        .from('pos_payments')
        .update({ status: 'failed' })
        .eq('id', payment.id)
    }

    return NextResponse.json({ status: 'processed' })
  } catch (error: any) {
    console.error('[waafipay/webhook] error:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
