import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/create-notification'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/paystack/webhook
 *
 * Receive payment confirmations from Paystack.
 * Handles: charge.success, charge.failed
 * Verifies HMAC-SHA512 signature, updates pos_payments + pos_transactions.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature')
    const webhookHash = process.env.PAYSTACK_WEBHOOK_HASH

    // Verify webhook signature
    if (webhookHash && signature) {
      const hash = crypto.createHmac('sha512', webhookHash).update(rawBody).digest('hex')
      if (hash !== signature) {
        console.warn('[paystack/webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(rawBody)
    const service = createServiceClient()
    const charge = event.data
    const reference = charge?.reference

    if (!reference) {
      return NextResponse.json({ status: 'no-reference' })
    }

    // ── charge.success ──────────────────────────────────────
    if (event.event === 'charge.success') {
      // Find payment record
      const { data: payment } = await service
        .from('pos_payments')
        .select('id, owner_id, transaction_id, status')
        .eq('external_reference', reference)
        .single()

      if (!payment) {
        console.warn(`[paystack/webhook] Payment not found for ref ${reference}`)
        return NextResponse.json({ status: 'processed' })
      }

      // Update payment → completed
      await service
        .from('pos_payments')
        .update({
          status: 'completed',
          external_receipt: charge.receipt_number || charge.id || reference,
          completed_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      // Update transaction → paid
      await service
        .from('pos_transactions')
        .update({
          payment_status: 'paid',
          payment_type: charge.metadata?.payment_method || charge.channel || 'card',
          paid_at: new Date().toISOString(),
        })
        .eq('id', payment.transaction_id)
        .eq('owner_id', payment.owner_id)

      // Notify on large payments (≥ 5,000 in local currency)
      const paidAmount = (charge.amount || 0) / 100
      if (paidAmount >= 5000) {
        await createNotification({
          userId: payment.owner_id,
          type: 'insight',
          title: `Large payment received — ${charge.currency || 'KES'} ${paidAmount.toLocaleString()}`,
          body: `A ${charge.channel || 'card'} payment of ${charge.currency || 'KES'} ${paidAmount.toLocaleString()} was confirmed via Paystack.`,
          metadata: { payment_id: payment.id, amount: paidAmount, channel: charge.channel },
          dedupHours: 1,
        })
      }

      return NextResponse.json({ status: 'processed' })
    }

    // ── charge.failed ───────────────────────────────────────
    if (event.event === 'charge.failed') {
      const { data: payment } = await service
        .from('pos_payments')
        .select('id, owner_id, transaction_id')
        .eq('external_reference', reference)
        .single()

      if (payment) {
        const failReason = charge.gateway_response || charge.message || 'Payment failed'
        const failAmount = (charge.amount || 0) / 100

        await service
          .from('pos_payments')
          .update({
            status: 'failed',
            error_message: failReason,
          })
          .eq('id', payment.id)

        await service
          .from('pos_transactions')
          .update({
            payment_status: 'failed',
            payment_failure_reason: failReason,
          })
          .eq('id', payment.transaction_id)
          .eq('owner_id', payment.owner_id)

        // Notify the merchant
        await createNotification({
          userId: payment.owner_id,
          type: 'alert',
          title: `Payment failed — ${charge.currency || 'KES'} ${failAmount.toLocaleString()}`,
          body: `A ${charge.channel || 'card'} payment of ${charge.currency || 'KES'} ${failAmount.toLocaleString()} failed: ${failReason}. Check Payment Recovery to retry.`,
          metadata: { payment_id: payment.id, amount: failAmount, reason: failReason, channel: charge.channel },
          dedupHours: 1,
        })
      }

      return NextResponse.json({ status: 'processed' })
    }

    // Ignore other events
    return NextResponse.json({ status: 'ignored' })
  } catch (error) {
    console.error('[paystack/webhook] error:', error)
    // Always return 200 so Paystack doesn't keep retrying
    return NextResponse.json({ status: 'processed' })
  }
}
