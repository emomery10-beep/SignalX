import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createSubAccount } from '@/lib/paystack'
import { createConnectedAccount, generateOnboardingLink } from '@/lib/stripe-connect'

/**
 * POST /api/pos/payment/setup
 *
 * Merchant onboarding: configure payment provider based on country.
 * Supports adding a second provider (Stripe) on top of existing Paystack.
 *
 * Body:
 *   country: 'KE' | 'GB' | 'US' | etc.
 *   business_name: string
 *   contact_email: string
 *   contact_phone?: string
 *   settlement_bank?: string
 *   account_number?: string
 *   settlement_account?: { type: 'mpesa' | 'bank', phone?: string, account?: string }
 *   add_provider?: 'stripe'   // set when adding Stripe to an existing Paystack config
 */

const PAYSTACK_COUNTRIES = ['KE', 'NG', 'GH', 'UG', 'TZ', 'RW', 'ZA']
const STRIPE_COUNTRIES = ['GB', 'US', 'IE', 'DE', 'FR', 'NL', 'BE', 'AT', 'SE', 'NO', 'DK', 'FI', 'ES', 'IT', 'PT', 'CZ', 'PL', 'AU', 'NZ', 'CA', 'SG', 'HK', 'JP', 'MY']
const MOBILE_MONEY_CODES = ['MPESA', 'ATL_KE', 'MPTILL', 'MPPAYBILL']

export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { data: config } = await service
    .from('merchant_payment_config')
    .select('payment_provider, is_active, stripe_onboarding_complete, stripe_connected_account_id, paystack_subaccount_id, paystack_business_name, settlement_account, country')
    .eq('owner_id', ownerId)
    .single()

  if (!config) return NextResponse.json({ configured: false })

  // Derive individual provider statuses from stored data
  const hasPaystack = config.payment_provider === 'paystack' ||
    !!(config.paystack_subaccount_id) ||
    (config.settlement_account as any)?.type === 'mpesa'

  const hasStripe = !!(config.stripe_connected_account_id)

  return NextResponse.json({
    configured: true,
    payment_provider: config.payment_provider,
    is_active: config.is_active,
    paystack_active: hasPaystack && config.is_active,
    stripe_active: hasStripe,
    stripe_onboarding_complete: config.stripe_onboarding_complete,
    country: config.country,
    business_name: config.paystack_business_name,
  })
}

export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const {
    country, business_name, contact_email, contact_phone,
    settlement_bank, account_number, settlement_account,
    add_provider,
  } = body

  if (!country || !business_name || !contact_email) {
    return NextResponse.json(
      { error: 'country, business_name, contact_email required' },
      { status: 400 }
    )
  }

  try {
    // ── Adding Stripe on top of existing Paystack ──
    if (add_provider === 'stripe' || STRIPE_COUNTRIES.includes(country)) {
      let stripeAccountId: string | null = null
      let onboardingUrl: string | null = null

      try {
        const account = await createConnectedAccount({ email: contact_email, business_name, country })
        stripeAccountId = account.accountId

        const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'
        const link = await generateOnboardingLink(
          stripeAccountId,
          `${baseUrl}/pos?tab=payments&stripe_setup_complete=true`
        )
        onboardingUrl = link.url
      } catch (err: any) {
        console.error('[payment/setup] Failed to create Stripe account:', err)
        return NextResponse.json(
          { error: `Stripe error: ${err.message || 'Failed to create payment account. Please contact support.'}` },
          { status: 500 }
        )
      }

      // Fetch existing config to decide insert vs update
      const { data: existing } = await service
        .from('merchant_payment_config')
        .select('owner_id, payment_provider')
        .eq('owner_id', ownerId)
        .single()

      if (existing) {
        // Add Stripe alongside existing Paystack — do NOT overwrite payment_provider.
        // Keeping payment_provider='paystack' lets the POS M-Pesa/card endpoints
        // keep working. Stripe is detected via stripe_connected_account_id presence.
        const { error: updateError } = await service
          .from('merchant_payment_config')
          .update({
            stripe_connected_account_id: stripeAccountId,
            stripe_onboarding_url: onboardingUrl,
            stripe_onboarding_complete: false,
            is_active: true,
          })
          .eq('owner_id', ownerId)

        if (updateError) {
          console.error('[payment/setup] DB update error:', updateError)
          return NextResponse.json({ error: `Failed to save config: ${updateError.message}` }, { status: 500 })
        }
      } else {
        // Fresh Stripe-only setup
        const { error: insertError } = await service
          .from('merchant_payment_config')
          .insert({
            owner_id: ownerId,
            country,
            payment_provider: 'stripe',
            stripe_connected_account_id: stripeAccountId,
            stripe_onboarding_url: onboardingUrl,
            stripe_onboarding_complete: false,
            is_active: true,
          })

        if (insertError) {
          console.error('[payment/setup] DB insert error:', insertError)
          return NextResponse.json({ error: `Failed to save config: ${insertError.message}` }, { status: 500 })
        }
      }

      return NextResponse.json({
        success: true,
        payment_provider: 'stripe',
        country,
        business_name,
        is_active: true,
        onboarding_url: onboardingUrl,
        message: 'Stripe connected. Complete KYC on Stripe to start accepting international payments.',
      })
    }

    // ── Paystack setup ──
    if (PAYSTACK_COUNTRIES.includes(country)) {
      let subaccountId: string | null = null

      const isMobileMoney = settlement_account?.type === 'mpesa' ||
        (settlement_bank && MOBILE_MONEY_CODES.includes(settlement_bank))

      if (!isMobileMoney) {
        // Bank account → try to create Paystack subaccount
        try {
          const bankCode = settlement_bank || settlement_account?.bank_code
          const acctNumber = account_number || ''

          if (!bankCode || !acctNumber) {
            return NextResponse.json(
              { error: 'Please select a bank and enter your account number' },
              { status: 400 }
            )
          }

          const subaccount = await createSubAccount({
            business_name,
            settlement_bank: bankCode,
            account_number: acctNumber,
            contact_email,
            contact_phone,
            percentage_charge: 2,
          })
          subaccountId = subaccount.subaccountCode
        } catch (err: any) {
          console.error('[payment/setup] Failed to create Paystack subaccount:', err)
          return NextResponse.json(
            { error: `Paystack error: ${err.message || 'Failed to create payment account'}` },
            { status: 500 }
          )
        }
      }
      // M-Pesa: subaccountId stays null — payments flow through main Paystack account

      const { error: configError } = await service
        .from('merchant_payment_config')
        .upsert(
          {
            owner_id: ownerId,
            country,
            payment_provider: 'paystack',
            paystack_subaccount_id: subaccountId,
            paystack_business_name: business_name,
            settlement_account: settlement_account || null,
            is_active: true,
          },
          { onConflict: 'owner_id' }
        )

      if (configError) {
        console.error('[payment/setup] DB error:', configError)
        return NextResponse.json({ error: `Failed to save payment config: ${configError.message}` }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        payment_provider: 'paystack',
        country,
        business_name,
        is_active: true,
        onboarding_url: null,
        message: isMobileMoney
          ? 'M-Pesa and card payments enabled'
          : 'Card and bank payments enabled',
      })
    }

    return NextResponse.json(
      { error: `Payments not available in ${country}. Please contact support.` },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('[payment/setup] error:', error)
    return NextResponse.json({ error: error.message || 'Setup failed' }, { status: 500 })
  }
}
