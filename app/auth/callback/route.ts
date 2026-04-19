import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/chat'

  const supabase = createClient()

  try {
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error && data.user) {
        await recordSignupIP(request, data.user.id, data.session?.access_token ? true : false)
        const profile = await supabase.from('profiles').select('onboarded').eq('id', data.user.id).single()
        const isNew = !profile.data?.onboarded
        return NextResponse.redirect(`${origin}${isNew ? '/onboarding' : next}`)
      }
    }

    if (token_hash && type) {
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: type as 'email' | 'recovery' | 'invite' | 'magiclink' })
      if (!error && data.user) {
        await recordSignupIP(request, data.user.id, false)
        const profile = await supabase.from('profiles').select('onboarded').eq('id', data.user.id).single()
        const isNew = !profile.data?.onboarded
        return NextResponse.redirect(`${origin}${isNew ? '/onboarding' : next}`)
      }
    }
  } catch (_) {}

  return NextResponse.redirect(`${origin}/signin?error=auth_failed`)
}

async function recordSignupIP(request: NextRequest, userId: string, isReturning: boolean) {
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
    const country = request.headers.get('x-vercel-ip-country') || null

    // Hash the IP — never store raw IP (GDPR compliant)
    const ipHash = createHash('sha256').update(ip + process.env.IP_HASH_SALT || 'signalx-salt').digest('hex')

    const serviceClient = createServiceClient()

    // Record IP in registry and check for abuse
    const { data } = await serviceClient.rpc('record_signup_ip', {
      p_user_id: userId,
      p_ip_hash: ipHash,
      p_country: country,
    })

    // If suspicious (4+ accounts from same IP) — downgrade to free immediately
    if (data?.is_suspicious && !isReturning) {
      await serviceClient.from('subscriptions').upsert({
        user_id: userId,
        plan_id: 'free',
        status: 'active',
      }, { onConflict: 'user_id' })
    }
  } catch (_) {
    // Non-blocking — don't fail auth if IP recording fails
  }
}
