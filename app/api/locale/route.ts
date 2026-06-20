import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isActiveLocale } from '@/lib/i18n-locale'

export const runtime = 'nodejs'

// Persist the signed-in user's interface language to their profile so the choice
// follows them across devices. Guests get 401 and rely on the cookie instead.
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { locale } = await request.json().catch(() => ({ locale: null }))
  if (!isActiveLocale(locale)) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ preferred_locale: locale })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, locale })
}
