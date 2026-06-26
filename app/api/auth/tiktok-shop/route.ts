// GET /api/auth/tiktok-shop
// Generates a TikTok Shop OAuth authorization URL.
// Returns { auth_url, state } — the frontend renders auth_url as a QR code.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appKey = process.env.TIKTOK_APP_KEY
  if (!appKey) return NextResponse.json({ error: 'TikTok not configured' }, { status: 500 })

  const state       = Buffer.from(JSON.stringify({ userId: user.id, ts: Date.now() })).toString('base64url')
  const redirectUri = `${APP_URL}/api/auth/tiktok-shop/callback`
  const authUrl     = `https://services.tiktokshop.com/open/authorize?service_id=${appKey}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

  return NextResponse.json({ auth_url: authUrl, state })
}
