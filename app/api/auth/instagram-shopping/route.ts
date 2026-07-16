// Instagram Shopping OAuth 2.0 — Step 1
// Uses the same Meta App as Meta Ads (META_APP_ID/META_APP_SECRET) but requests
// Commerce Platform scopes. These require Meta Business Verification + App Review
// with Advanced Access before real merchant data is reachable — see callback route.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SCOPES = [
  'business_management',
  'catalog_management',
  'commerce_account_read_orders',
  'commerce_account_read_settings',
  'instagram_basic',
  'instagram_shopping_tag_products',
].join(',')

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const appId = process.env.META_APP_ID
  if (!appId) return NextResponse.json({ error: 'Meta not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram-shopping/callback`

  const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth')
  authUrl.searchParams.set('client_id', appId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', SCOPES)
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl.toString())
}
