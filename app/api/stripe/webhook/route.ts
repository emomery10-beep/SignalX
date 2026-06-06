import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

if (!WEBHOOK_SECRET) {
  console.warn('[stripe/webhook] STRIPE_WEBHOOK_SECRET not configured')
}

/**
 * POST /api/stripe/webhook
 *
 * Receive Stripe webhook events for connected account updates
 * Specifically: account.updated - when merchant KYC verification completes
 *
 * Verifies webhook signature and updates merchant_payment_config status
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')

    // Verify webhook signature
    if (!WEBHOOK_SECRET || !signature) {
      console.warn('[stripe/webhook] Missing webhook secret or signature')
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 401 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET)
    } catch (err: any) {
      console.warn('[stripe/webhook] Signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const service = createServiceClient()

    // Handle account updates (KYC verification status changes)
    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account
      const accountId = account.id

      console.log(`[stripe/webhook] Account updated: ${accountId}`)

      // Check if account is now ready to accept charges
      const isVerified = account.charges_enabled && account.payouts_enabled
      const requirementsCompleted = !account.requirements?.eventually_due?.length

      if (!isVerified) {
        console.log(`[stripe/webhook] Account ${accountId} not yet verified`)
        return NextResponse.json({ status: 'processed' })
      }

      // Find merchant with this Stripe account ID
      const { data: config, error: configError } = await service
        .from('merchant_payment_config')
        .select('id, owner_id')
        .eq('stripe_connected_account_id', accountId)
        .single()

      if (configError || !config) {
        console.warn(`[stripe/webhook] No merchant found for Stripe account ${accountId}`)
        return NextResponse.json({ status: 'processed' })
      }

      // Update merchant payment config to active
      const { error: updateError } = await service
        .from('merchant_payment_config')
        .update({
          stripe_onboarding_complete: true,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', config.id)

      if (updateError) {
        console.error(
          `[stripe/webhook] Failed to update config for merchant ${config.owner_id}:`,
          updateError
        )
        return NextResponse.json({ status: 'processed' })
      }

      console.log(`[stripe/webhook] ✓ Merchant ${config.owner_id} Stripe account verified`)
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'processed' })
  } catch (error: any) {
    console.error('[stripe/webhook] error:', error)
    // Return 200 to prevent Stripe from retrying
    return NextResponse.json({ status: 'processed' })
  }
}
