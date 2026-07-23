import { SupabaseClient } from '@supabase/supabase-js'
import { countryFromCurrencyUnambiguous } from '@/lib/geo'

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
  // profiles.currency is a real ISO 4217 code (e.g. "KES"), set during onboarding
  // from phone/IP geo-detection on every signup path — reliable. country_code is
  // NOT: onboarding only started writing it 2026-07-17 (app/onboarding/page.tsx),
  // and only when the user completes the location-confirm step, so it's null for
  // most pre-existing accounts with no backfill path. Derive it from currency
  // when missing — but only where that's unambiguous (see
  // countryFromCurrencyUnambiguous), so a Eurozone/CFA-zone user with no
  // country_code gets the honest generic fallback instead of a confidently wrong
  // specific tax authority.
  const currency = data?.currency || 'GBP'
  return {
    currencySymbol: data?.currency_symbol || '£',
    currency,
    countryCode: data?.country_code || countryFromCurrencyUnambiguous(currency),
  }
}
