import { SupabaseClient } from '@supabase/supabase-js'

/** Fetch the user's currency symbol from their profile, default '£' */
export async function getCurrencySymbol(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('currency_symbol')
    .eq('id', userId)
    .single()
  return data?.currency_symbol || '£'
}

/** Fetch the user's currency symbol, ISO currency code, and country code */
export async function getUserLocale(supabase: SupabaseClient, userId: string): Promise<{ currencySymbol: string; currency: string; countryCode: string | null }> {
  const { data } = await supabase
    .from('profiles')
    .select('currency_symbol, currency, country_code')
    .eq('id', userId)
    .single()
  return {
    currencySymbol: data?.currency_symbol || '£',
    // profiles.currency is a real ISO 4217 code (e.g. "KES"), set during onboarding
    // from phone/IP geo-detection — reliable, unlike country_code which onboarding
    // never actually writes (confirmed by audit: always null in practice).
    currency: data?.currency || 'GBP',
    countryCode: data?.country_code || null,
  }
}
