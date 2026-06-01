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

/** Fetch the user's currency symbol and country code */
export async function getUserLocale(supabase: SupabaseClient, userId: string): Promise<{ currencySymbol: string; countryCode: string | null }> {
  const { data } = await supabase
    .from('profiles')
    .select('currency_symbol, country_code')
    .eq('id', userId)
    .single()
  return {
    currencySymbol: data?.currency_symbol || '£',
    countryCode: data?.country_code || null,
  }
}
