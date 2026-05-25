import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

// Supabase redirects here after staff clicks magic link in email
// e.g. https://askbiz.co/api/pos/callback?token_hash=xxx&type=magiclink
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const code       = searchParams.get('code')
  const type       = searchParams.get('type') ?? 'magiclink'

  const supabase = createClient()
  let email: string | null = null

  try {
    if (token_hash) {
      // Implicit flow — verify OTP token hash
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as 'magiclink' | 'email',
      })
      if (!error) email = data.user?.email ?? null
    } else if (code) {
      // PKCE flow fallback
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) email = data.user?.email ?? null
    }
  } catch (e) {
    console.error('[pos/callback] auth error:', e)
  }

  if (!email) {
    return NextResponse.redirect('https://pos.askbiz.co?error=auth_failed')
  }

  const service = createServiceClient()

  // Look up staff by email
  const { data: staff } = await service
    .from('pos_staff')
    .select('id, name, role, owner_id, active')
    .eq('email', email.toLowerCase())
    .eq('active', true)
    .maybeSingle()

  if (!staff) {
    return NextResponse.redirect('https://pos.askbiz.co?error=not_staff')
  }

  // Generate a short-lived session token for pos.askbiz.co
  const token = randomBytes(32).toString('hex')
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

  await service.from('pos_magic_links').insert({
    staff_id:   staff.id,
    token,
    email:      email.toLowerCase(),
    expires_at,
  })

  await service.from('pos_staff')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', staff.id)

  // Redirect to pos.askbiz.co with the token — page exchanges it for staff details
  return NextResponse.redirect(`https://pos.askbiz.co?token=${token}`)
}
