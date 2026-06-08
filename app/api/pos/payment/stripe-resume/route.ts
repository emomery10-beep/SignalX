import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { generateOnboardingLink } from '@/lib/stripe-connect'

/**
 * GET /api/pos/payment/stripe-resume
 * Generates a fresh Stripe onboarding link for a merchant who has a
 * connected account but hasn't completed KYC yet.
 */
export async function GET(req: NextRequest) {
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
    return NextResponse.json({ already_complete: true })
  }

  try {
    const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'
    const link = await generateOnboardingLink(
      config.stripe_connected_account_id,
      `${baseUrl}/pos?tab=payments&stripe_setup_complete=true`
    )

    // Save the fresh URL
    await service
      .from('merchant_payment_config')
      .update({ stripe_onboarding_url: link.url })
      .eq('owner_id', ownerId)

    return NextResponse.json({ onboarding_url: link.url })
  } catch (err: any) {
    console.error('[stripe-resume] Failed to generate onboarding link:', err)
    return NextResponse.json({ error: err.message || 'Failed to generate Stripe link' }, { status: 500 })
  }
}
