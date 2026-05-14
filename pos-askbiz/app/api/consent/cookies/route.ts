import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const body = await request.json()

    // Save cookie consent if user is logged in
    if (user) {
      await supabase.from('profiles').update({
        cookie_consent: body,
        cookie_consent_at: new Date().toISOString(),
      }).eq('id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
