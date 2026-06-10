import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createPaymentLink as createPaystackPaymentLink } from '@/lib/paystack'
import { createPaymentLink as createStripePaymentLink } from '@/lib/stripe-connect'
import QRCode from 'qrcode'

/**
 * POST /api/pos/payment/link
 *
 * Create a payment link + QR code for card/Apple Pay payments
 *
 * Body:
 *   transaction_id: uuid
 *   payment_method: 'card' | 'apple_pay'
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { transaction_id, payment_method = 'card' } = body

  if (!transaction_id) {
    return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  }

  try {
    // Fetch transaction
    const { data: transaction, error: txError } = await service
      .from('pos_transactions')
      .select('id, total, payment_status')
      .eq('id', transaction_id)
      .eq('owner_id', ownerId)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (transaction.payment_status === 'paid') {
      return NextResponse.json({ error: 'Transaction already paid' }, { status: 400 })
    }

    // Get merchant's payment config
    const { data: config } = await service
      .from('merchant_payment_config')
      .select('payment_provider, paystack_subaccount_id, settlement_account, stripe_connected_account_id, country, is_active, stripe_onboarding_complete')
      .eq('owner_id', ownerId)
      .single()

    if (!config) {
      return NextResponse.json({ error: 'Payment configuration not found' }, { status: 400 })
    }

    if (!config.is_active) {
      return NextResponse.json({ error: 'Payment provider not yet active. Complete setup first.' }, { status: 400 })
    }

    // Detect active providers from stored data — not just payment_provider field,
    // because a merchant may have both Paystack + Stripe (Stripe added later).
    const hasPaystack = config.payment_provider === 'paystack' ||
      !!(config.paystack_subaccount_id) ||
      (config.settlement_account as any)?.type === 'mpesa'

    const hasStripe = !!(config.stripe_connected_account_id) && config.stripe_onboarding_complete

    // Prefer Stripe if fully onboarded, otherwise fall back to Paystack
    const useStripe = hasStripe
    const usePaystack = !useStripe && hasPaystack

    if (!useStripe && !usePaystack) {
      // Stripe exists but KYC not done — nudge merchant
      if (config.stripe_connected_account_id && !config.stripe_onboarding_complete) {
        return NextResponse.json({ error: 'Stripe verification pending. Complete Stripe onboarding in the admin Payments tab.' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Card payments not configured. Set up a payment provider in the admin Payments tab.' }, { status: 400 })
    }

    let link: { url: string; checkoutUrl?: string; reference?: string } | null = null

    if (usePaystack) {
      // Paystack payment link — works with or without a subaccount
      // (subaccount adds split payments but isn't required for basic links)
      link = await createPaystackPaymentLink({
        amount: Math.round(transaction.total * 100),
        currency: 'KES',
        description: `AskBiz POS - Transaction ${transaction_id.slice(0, 8)}`,
        metadata: {
          transaction_id,
          merchant_id: ownerId,
          payment_method,
          subaccount: config.paystack_subaccount_id || undefined,
        },
      })
    } else if (useStripe) {
      // Stripe payment link
      const stripeLink = await createStripePaymentLink({
        amount: Math.round(transaction.total * 100),
        currency: config.country?.toLowerCase() === 'gb' ? 'gbp' : 'usd',
        description: `AskBiz POS - Transaction ${transaction_id.slice(0, 8)}`,
        connected_account_id: config.stripe_connected_account_id!,
        metadata: {
          transaction_id,
          merchant_id: ownerId,
          payment_method,
        },
      })
      link = { checkoutUrl: stripeLink.url }
    }

    // Generate QR code as data URL
    let qrDataUrl: string | null = null
    const checkoutUrl = link?.checkoutUrl || link?.url
    try {
      if (checkoutUrl) {
        qrDataUrl = await QRCode.toDataURL(checkoutUrl, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.95,
          margin: 1,
          width: 300,
        })
      }
    } catch (err) {
      console.error('[payment/link] QR generation failed:', err)
      // Continue without QR, customer can use the URL directly
    }

    // Store payment record
    const externalRef = (link as any)?.reference || (link as any)?.id
    const { data: payment, error: paymentError } = await service
      .from('pos_payments')
      .insert({
        owner_id: ownerId,
        transaction_id,
        amount: transaction.total,
        payment_method: payment_method === 'apple_pay' ? 'apple_pay' : 'card',
        provider: config?.payment_provider || 'paystack',
        external_reference: externalRef,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('[payment/link] Failed to store payment record:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      reference: externalRef,
      checkout_url: checkoutUrl,
      qr_code: qrDataUrl,
      amount: transaction.total,
      message: 'Payment link generated. Display QR code to customer.',
    })
  } catch (error: any) {
    console.error('[payment/link] error:', error)
    return NextResponse.json(
      { error: error.message || 'Link generation failed' },
      { status: 500 }
    )
  }
}
