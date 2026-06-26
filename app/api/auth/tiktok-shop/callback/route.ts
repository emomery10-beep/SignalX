// TikTok Shop OAuth — Step 2: Exchange auth code for access/refresh tokens
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(`${APP_URL}/sources?error=tiktok_missing_params`)
  }

  // Decode state to get userId
  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'))
    userId = decoded.userId
    if (!userId) throw new Error('no userId in state')
  } catch {
    return NextResponse.redirect(`${APP_URL}/sources?error=tiktok_invalid_state`)
  }

  const appKey    = process.env.TIKTOK_APP_KEY
  const appSecret = process.env.TIKTOK_APP_SECRET
  if (!appKey || !appSecret) {
    return NextResponse.redirect(`${APP_URL}/sources?error=tiktok_not_configured`)
  }

  // Exchange auth code for access + refresh tokens
  const tokenRes = await fetch(
    `https://auth.tiktok-shops.com/api/v2/token/get?app_key=${appKey}&app_secret=${appSecret}&auth_code=${code}&grant_type=authorized_code`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  ).catch(() => null)

  if (!tokenRes?.ok) {
    return NextResponse.redirect(`${APP_URL}/sources?error=tiktok_token_fetch_failed`)
  }

  const tokenData = await tokenRes.json().catch(() => null)
  if (!tokenData || tokenData.code !== 0 || !tokenData.data?.access_token) {
    console.error('TikTok token exchange error:', tokenData)
    return NextResponse.redirect(`${APP_URL}/sources?error=tiktok_token_invalid`)
  }

  const {
    access_token,
    refresh_token,
    access_token_expire_in,  // seconds from now
    refresh_token_expire_in, // seconds from now
    open_id,
    seller_name,
  } = tokenData.data

  const now              = Date.now()
  const accessExpiresAt  = new Date(now + access_token_expire_in  * 1000).toISOString()
  const refreshExpiresAt = new Date(now + refresh_token_expire_in * 1000).toISOString()

  const supabase = createClient()

  // Remove any existing TikTok Shop connection for this user, then insert fresh
  await supabase
    .from('connected_sources')
    .delete()
    .eq('user_id', userId)
    .eq('source_type', 'tiktok_shop')

  const { data: source, error: insertError } = await supabase
    .from('connected_sources')
    .insert({
      user_id: userId,
      source_type: 'tiktok_shop',
      name: seller_name || 'TikTok Shop',
      status: 'active',
      credentials: encryptCredentials({
        access_token,
        refresh_token,
        access_token_expires_at:  accessExpiresAt,
        refresh_token_expires_at: refreshExpiresAt,
      }),
      config: { open_id, seller_name },
      sync_interval_minutes: 60,
    })
    .select()
    .single()

  if (insertError) {
    console.error('TikTok Shop insert failed:', insertError)
    return NextResponse.redirect(`${APP_URL}/sources?error=tiktok_save_failed`)
  }

  if (source) {
    try { await runSync(userId) } catch (_) {}
  }

  return NextResponse.redirect(`${APP_URL}/sources?connected=tiktok_shop&syncing=true`)
}
