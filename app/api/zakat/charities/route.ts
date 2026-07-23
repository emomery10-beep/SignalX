import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'

export const dynamic = 'force-dynamic'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — curated charity directory (curated by AskBiz directly, see
// public.charities RLS — no client insert/update path exists). Filtered to
// the business's country, plus any charity left uncountried (shown everywhere).
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const { countryCode } = await getUserLocale(supabase, user.id, (user.user_metadata as { phone?: string } | undefined)?.phone || user.phone)

  const { data, error } = await supabase
    .from('charities')
    .select('id, name, cause_category, logo_url, donate_url, country_codes')
    .eq('verified', true)
    .order('sort_order', { ascending: true })

  if (error) {
    if (error.code === '42P01') return json({ charities: [], note: 'charities table not yet created' })
    return json({ error: error.message }, 500)
  }

  const all = data || []
  const filtered = countryCode
    ? all.filter((c: any) => !c.country_codes?.length || c.country_codes.includes(countryCode))
    : all

  return json({ charities: filtered })
}
