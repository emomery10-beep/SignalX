/**
 * Stripe Connect Integration Library
 * Handles connected account creation, onboarding, and payment processing
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

interface CreateConnectedAccountParams {
  email: string
  business_name: string
  country: string // 'GB', 'US', 'IE', etc.
}

interface CreatePaymentLinkParams {
  amount: number // in cents
  currency: string // 'gbp', 'usd', etc.
  description?: string
  connected_account_id: string
  metadata?: Record<string, string>
}

interface CreatePaymentIntentParams {
  amount: number // in cents
  currency: string
  connected_account_id: string
  description?: string
  metadata?: Record<string, string>
  application_fee_percent?: number // platform fee as percentage
}

/**
 * Create a Stripe Connected Account for a merchant
 */
export async function createConnectedAccount(params: CreateConnectedAccountParams) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: params.country,
      email: params.email,
      business_profile: {
        name: params.business_name,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    return {
      accountId: account.id,
      createdAt: new Date(account.created * 1000),
    }
  } catch (error: any) {
    console.error('[stripe-connect] createConnectedAccount error:', error)
    throw new Error(`Failed to create Stripe account: ${error.message}`)
  }
}

/**
 * Generate an onboarding link for the merchant to complete KYC
 */
export async function generateOnboardingLink(connectedAccountId: string, returnUrl: string) {
  try {
    const link = await stripe.accountLinks.create({
      account: connectedAccountId,
      type: 'account_onboarding',
      refresh_url: returnUrl,
      return_url: returnUrl,
    })

    return {
      url: link.url,
      expiresAt: new Date(link.expires_at * 1000),
    }
  } catch (error: any) {
    console.error('[stripe-connect] generateOnboardingLink error:', error)
    throw new Error(`Failed to generate onboarding link: ${error.message}`)
  }
}

/**
 * Create a Checkout Session (for QR codes)
 * Customer scans → Stripe checkout → pays with card / Apple Pay / Google Pay
 */
export async function createPaymentLink(params: CreatePaymentLinkParams) {
  try {
    // Use Checkout Session (not Payment Links) — supports price_data, mode, and one-time payments
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: params.currency,
              product_data: {
                name: params.description || 'Payment',
              },
              unit_amount: params.amount,
            },
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        metadata: params.metadata || {},
        // Redirect to a simple success page after payment
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pos.askbiz.co'}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pos.askbiz.co'}/sell`,
        // Expire after 30 minutes — enough for a POS transaction
        expires_at: Math.floor(Date.now() / 1000) + 1800,
      },
      {
        stripeAccount: params.connected_account_id,
      }
    )

    return {
      url: session.url!,
      id: session.id,
    }
  } catch (error: any) {
    console.error('[stripe-connect] createPaymentLink error:', error)
    throw new Error(`Failed to create payment link: ${error.message}`)
  }
}

/**
 * Create a Payment Intent for direct charge with split
 * AskBiz takes application fee, rest goes to merchant
 */
export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  try {
    const applicationFeeAmount = params.application_fee_percent
      ? Math.round((params.amount * params.application_fee_percent) / 100)
      : Math.round(params.amount * 0.02) // Default 2% platform fee

    const intent = await stripe.paymentIntents.create(
      {
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        metadata: params.metadata,
        application_fee_amount: applicationFeeAmount,
        capture_method: 'automatic',
      },
      {
        stripeAccount: params.connected_account_id,
      } as any
    )

    return {
      clientSecret: intent.client_secret,
      id: intent.id,
      status: intent.status,
      applicationFee: applicationFeeAmount,
    }
  } catch (error: any) {
    console.error('[stripe-connect] createPaymentIntent error:', error)
    throw new Error(`Failed to create payment intent: ${error.message}`)
  }
}

/**
 * Retrieve account status (check if onboarding complete)
 */
export async function getAccountStatus(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId)

    return {
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requiresAction: !account.charges_enabled || !account.payouts_enabled,
      status: account.details_submitted ? 'submitted' : 'incomplete',
    }
  } catch (error: any) {
    console.error('[stripe-connect] getAccountStatus error:', error)
    throw new Error(`Failed to retrieve account status: ${error.message}`)
  }
}
