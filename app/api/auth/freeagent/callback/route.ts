// FreeAgent OAuth 2.0 — Step 2: Exchange code for access token
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(new URL('/sources?error=freeagent_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/freeagent/callback`
  const credentials = Buffer.from(`${process.env.FREEAGENT_CLIENT_ID}:${process.env.FREEAGENT_CLIENT_SECRET}`).toString('base64')

  const tokenRes = await fetch('https://api.freeagent.com/v2/token_endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=freeagent_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  // Get company name for display name
  const companyRes = await fetch('https://api.freeagent.com/v2/company', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  const companyData = companyRes.ok ? await companyRes.json() : {}
  const displayName = companyData.company?.name || 'FreeAgent'

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'freeagent',
      name: displayName,
      status: 'active',
      credentials: encryptCredentials({ access_token, refresh_token }),
      config: {},
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=freeagent', request.url))
}
