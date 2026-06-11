import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

/**
 * POST /api/pos/payment/stripe-verify
 *
 * Called when merchant returns from Stripe onboarding (stripe_setup_complete=true).
 * Checks if the connected account now has charges_enabled and updates DB.
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { data: config } = await service
    .from('merchant_payment_config')
    .select('stripe_connected_account_id, stripe_onboarding_complete')
    .eq('owner_id', ownerId)
    .single()

  if (!config?.stripe_connected_account_id) {
    return NextResponse.json({ error: 'No Stripe account found' }, { status: 404 })
  }

  if (config.stripe_onboarding_complete) {
    return NextResponse.json({ verified: true, already_complete: true })
  }

  try {
    const account = await stripe.accounts.retrieve(config.stripe_connected_account_id)
    const isVerified = account.charges_enabled && account.details_submitted

    if (isVerified) {
      await service
        .from('merchant_payment_config')
        .update({ stripe_onboarding_complete: true })
        .eq('owner_id', ownerId)

      return NextResponse.json({ verified: true })
    }

    return NextResponse.json({
      verified: false,
      charges_enabled: account.charges_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements?.currently_due || [],
    })
  } catch (err: any) {
    console.error('[stripe-verify] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to verify Stripe account' }, { status: 500 })
  }
}
