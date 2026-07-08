import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Minimal callback for this subdomain — no onboarding/locale sync (that's
// main-app concepts), just: exchange the code/token for a session, land on
// the developer dashboard. A signed-in askbiz.co user never hits this route
// at all (shared cookie domain already gives them a session here).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = createClient()

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(`${origin}${next}`)
    }
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as 'email' | 'recovery' | 'invite' | 'magiclink' })
      if (!error) return NextResponse.redirect(`${origin}${next}`)
    }
  } catch (_) {}

  return NextResponse.redirect(`${origin}/signin?error=auth_failed`)
}
