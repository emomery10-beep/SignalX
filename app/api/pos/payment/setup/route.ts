import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createSubAccount } from '@/lib/paystack'
import { createConnectedAccount, generateOnboardingLink } from '@/lib/stripe-connect'

/**
 * POST /api/pos/payment/setup
 *
 * Merchant onboarding: configure payment provider based on country
 *
 * Body:
 *   country: 'KE' | 'GB' | 'US' | etc.
 *   business_name: string
 *   contact_email: string
 *   contact_phone: string
 *   settlement_account?: { type: 'mpesa' | 'bank', phone?: string, account?: string }
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { country, business_name, contact_email, contact_phone, settlement_account } = body

  if (!country || !business_name || !contact_email) {
    return NextResponse.json(
      { error: 'country, business_name, contact_email required' },
      { status: 400 }
    )
  }

  try {
    // Determine payment provider based on country
    const PAYSTACK_COUNTRIES = ['KE', 'NG', 'GH', 'UG', 'TZ', 'RW', 'ZA']
    const STRIPE_COUNTRIES = ['GB', 'US', 'IE', 'DE', 'FR', 'NL', 'BE', 'AT', 'SE', 'NO', 'DK', 'FI', 'ES', 'IT', 'PT', 'CZ', 'PL', 'AU', 'NZ', 'CA', 'SG', 'HK', 'JP', 'MY']

    let paymentProvider = 'none'
    let subaccountId: string | null = null
    let stripeAccountId: string | null = null
    let onboardingUrl: string | null = null

    if (PAYSTACK_COUNTRIES.includes(country)) {
      // Africa → Paystack
      paymentProvider = 'paystack'

      // Create Paystack sub-account
      try {
        const subaccount = await createSubAccount({
          business_name,
          settlement_bank: '994', // Kenya M-Pesa (Safaricom)
          account_number: settlement_account?.phone || contact_phone || '',
          contact_email,
          contact_phone,
          percentage_charge: 2, // AskBiz takes 2% platform fee
        })
        subaccountId = subaccount.subaccountCode
      } catch (err: any) {
        console.error('[payment/setup] Failed to create Paystack subaccount:', err)
        return NextResponse.json(
          { error: `Paystack error: ${err.message || 'Failed to create payment account'}` },
          { status: 500 }
        )
      }
    } else if (STRIPE_COUNTRIES.includes(country)) {
      // International → Stripe Connect
      paymentProvider = 'stripe'

      // Create Stripe connected account
      try {
        const account = await createConnectedAccount({
          email: contact_email,
          business_name,
          country: country.toLowerCase(),
        })
        stripeAccountId = account.accountId

        // Generate onboarding link for merchant to complete KYC
        const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://pos.askbiz.co'
        const link = await generateOnboardingLink(
          stripeAccountId,
          `${baseUrl}/billing?stripe_setup_complete=true`
        )
        onboardingUrl = link.url
      } catch (err) {
        console.error('[payment/setup] Failed to create Stripe account:', err)
        return NextResponse.json(
          { error: 'Failed to create payment account. Please contact support.' },
          { status: 500 }
        )
      }
    } else {
      // Country not supported
      return NextResponse.json(
        { error: `Payments not available in ${country}. Please contact support.` },
        { status: 400 }
      )
    }

    // Store payment config
    const { data: config, error: configError } = await service
      .from('merchant_payment_config')
      .upsert(
        {
          owner_id: ownerId,
          country,
          payment_provider: paymentProvider,
          paystack_subaccount_id: subaccountId,
          paystack_business_name: paymentProvider === 'paystack' ? business_name : null,
          stripe_connected_account_id: stripeAccountId,
          stripe_onboarding_url: onboardingUrl,
          stripe_onboarding_complete: false,
          settlement_account: settlement_account || null,
          is_active: paymentProvider !== 'none',
        },
        { onConflict: 'owner_id' }
      )
      .select()
      .single()

    if (configError) {
      console.error('[payment/setup] DB error:', configError)
      return NextResponse.json({ error: 'Failed to save payment config' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment_provider: paymentProvider,
      country,
      business_name,
      is_active: paymentProvider !== 'none',
      onboarding_url: onboardingUrl,
      message:
        paymentProvider === 'paystack'
          ? 'M-Pesa and card payments enabled'
          : paymentProvider === 'stripe'
            ? 'Card payments enabled. Complete onboarding to start accepting payments.'
            : 'No payment methods available in your region',
    })
  } catch (error: any) {
    console.error('[payment/setup] error:', error)
    return NextResponse.json({ error: error.message || 'Setup failed' }, { status: 500 })
  }
}
