/**
 * Payment Provider Router
 * Routes payment operations to the correct provider (Paystack or Stripe) based on merchant config
 */

import { createClient } from '@supabase/supabase-js'

export interface MerchantPaymentConfig {
  payment_provider: 'paystack' | 'stripe' | 'none'
  paystack_subaccount_id?: string | null
  stripe_connected_account_id?: string | null
  country: string
}

/**
 * Get merchant's payment configuration
 */
export async function getMerchantPaymentConfig(
  ownerId: string,
  supabaseClient: ReturnType<typeof createClient>
): Promise<MerchantPaymentConfig | null> {
  try {
    const { data } = await supabaseClient
      .from('merchant_payment_config')
      .select('payment_provider, paystack_subaccount_id, stripe_connected_account_id, country')
      .eq('owner_id', ownerId)
      .single()

    return data as MerchantPaymentConfig | null
  } catch (error) {
    console.error('[payment-router] Failed to get merchant config:', error)
    return null
  }
}

/**
 * Determine which payment provider to use based on country
 */
export function getProviderForCountry(country: string): 'paystack' | 'stripe' | 'none' {
  const PAYSTACK_COUNTRIES = ['KE', 'NG', 'GH', 'UG', 'TZ', 'RW', 'ZA']
  const STRIPE_COUNTRIES = ['GB', 'US', 'IE', 'DE', 'FR', 'NL', 'BE', 'AT', 'SE', 'NO', 'DK', 'FI', 'ES', 'IT', 'PT', 'CZ', 'PL', 'AU', 'NZ', 'CA', 'SG', 'HK', 'JP', 'MY']

  if (PAYSTACK_COUNTRIES.includes(country)) {
    return 'paystack'
  } else if (STRIPE_COUNTRIES.includes(country)) {
    return 'stripe'
  } else {
    return 'none'
  }
}

/**
 * Check if merchant has a valid payment provider configured
 */
export function isPaymentConfigured(config: MerchantPaymentConfig | null): boolean {
  if (!config) return false
  if (config.payment_provider === 'paystack' && config.paystack_subaccount_id) return true
  if (config.payment_provider === 'stripe' && config.stripe_connected_account_id) return true
  return false
}

/**
 * Format currency code for the payment provider
 */
export function formatCurrencyForProvider(
  provider: 'paystack' | 'stripe',
  countryCode: string
): string {
  if (provider === 'paystack') {
    // Paystack uses uppercase codes like 'KES', 'NGN'
    if (countryCode === 'KE') return 'KES'
    if (countryCode === 'NG') return 'NGN'
    if (countryCode === 'GH') return 'GHS'
    return 'KES' // Default
  } else {
    // Stripe uses lowercase codes like 'gbp', 'usd'
    if (countryCode === 'GB') return 'gbp'
    if (countryCode === 'US') return 'usd'
    if (countryCode === 'IE') return 'eur'
    if (countryCode === 'CA') return 'cad'
    if (countryCode === 'AU') return 'aud'
    return 'gbp' // Default
  }
}
