import { SupabaseClient } from '@supabase/supabase-js'
import { countryFromCurrencyUnambiguous, countryFromPhone } from '@/lib/geo'

/** Fetch the user's currency symbol from their profile, default '£' */
export async function getCurrencySymbol(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('currency_symbol')
    .eq('id', userId)
    .single()
  return data?.currency_symbol || '£'
}

/**
 * Fetch the user's currency symbol, ISO currency code, and country code.
 *
 * `phone` is optional and, when passed, should be the account's E.164
 * SIGNUP phone — `user.user_metadata?.phone ?? user.phone` from the same
 * `supabase.auth.getUser()` call every caller already makes before calling
 * this (mirrors app/onboarding/page.tsx's own phone-first detection).
 * Do NOT pass `profiles.phone`: that's an unrelated, free-text business/
 * shipping-contact phone set later via the Settings page (see
 * app/api/profile/route.ts) — never the signup phone, usually empty, and
 * never validated as E.164, unlike the auth metadata phone which is.
 */
export async function getUserLocale(supabase: SupabaseClient, userId: string, phone?: string | null): Promise<{ currencySymbol: string; currency: string; countryCode: string | null }> {
  const { data } = await supabase
    .from('profiles')
    .select('currency_symbol, currency, country_code')
    .eq('id', userId)
    .single()
  // profiles.currency is a real ISO 4217 code (e.g. "KES"), set during onboarding
  // from phone/IP geo-detection on every signup path — reliable. country_code is
  // NOT: onboarding only started writing it 2026-07-17 (app/onboarding/page.tsx),
  // and only when the user completes the location-confirm step, so it's null for
  // most pre-existing accounts with no backfill path. Derive it when missing:
  // first from the signup phone's dial code, if we have one — a real E.164
  // number matches exactly one COUNTRY_DIAL prefix, so this is unambiguous where
  // it's available (phone-PIN signups only; null for email/OAuth accounts).
  // Otherwise fall back to currency, but only where THAT's unambiguous (see
  // countryFromCurrencyUnambiguous), so a Eurozone/CFA-zone/USD-zone user with
  // neither signal gets the honest generic fallback instead of a confidently
  // wrong specific tax authority.
  const currency = data?.currency || 'GBP'
  return {
    currencySymbol: data?.currency_symbol || '£',
    currency,
    countryCode: data?.country_code || countryFromPhone(phone) || countryFromCurrencyUnambiguous(currency),
  }
}
