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
