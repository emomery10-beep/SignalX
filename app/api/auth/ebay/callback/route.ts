// eBay OAuth 2.0 — Step 2: Exchange code for access token
import { NextRequest, NextResponse } from 'next/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    const msg = error ? `ebay_error_${error}` : 'ebay_cancelled'
    return NextResponse.redirect(new URL(`/sources?error=${msg}`, request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  // eBay requires Base64-encoded client_id:client_secret + RuName as redirect_uri
  const ruName = process.env.EBAY_RUNAME || ''
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString('base64')

  const tokenRes = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: ruName,
    }),
  })

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text().catch(() => 'unknown')
    console.error('eBay token exchange failed:', tokenRes.status, errBody)
    return NextResponse.redirect(new URL('/sources?error=ebay_token_failed', request.url))
  }

  const tokenData = await tokenRes.json()
  const { access_token, refresh_token } = tokenData

  if (!access_token) {
    console.error('eBay token response missing access_token:', JSON.stringify(tokenData))
    return NextResponse.redirect(new URL('/sources?error=ebay_token_failed', request.url))
  }

  try {
    // Use service client to bypass RLS
    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = createServiceClient()

    // Remove existing eBay connection for this user, then insert fresh
    await supabase
      .from('connected_sources')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'ebay')

    const encrypted = encryptCredentials({ access_token, refresh_token })

    const { data: source, error: insertError } = await supabase
      .from('connected_sources')
      .insert({
        user_id: userId,
        source_type: 'ebay',
        name: 'eBay Store',
        status: 'active',
        credentials: encrypted,
        config: {},
        sync_interval_minutes: 60,
      })
      .select()
      .single()

    if (insertError) {
      console.error('eBay insert failed:', JSON.stringify(insertError))
      return NextResponse.redirect(new URL('/sources?error=ebay_save_failed', request.url))
    }

    if (source) {
      try { await runSync(userId) } catch (_) {}
    }

    return NextResponse.redirect(new URL('/sources?connected=ebay', request.url))
  } catch (err) {
    console.error('eBay save error:', err instanceof Error ? err.message : err)
    return NextResponse.redirect(new URL('/sources?error=ebay_save_failed', request.url))
  }
}
