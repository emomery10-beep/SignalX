// eBay OAuth 2.0 — Step 1: Redirect to eBay consent
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const clientId = process.env.EBAY_CLIENT_ID?.trim()
  if (!clientId) return NextResponse.json({ error: 'eBay not configured' }, { status: 500 })

  const ruName = process.env.EBAY_RUNAME?.trim()
  if (!ruName) return NextResponse.json({ error: 'eBay RuName not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')

  const scopes = [
    'https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.account',
    'https://api.ebay.com/oauth/api_scope/sell.finances',
    'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly',
  ].join(' ')

  const authUrl =
    `https://auth.ebay.com/oauth2/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(ruName)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=${state}`

  return NextResponse.redirect(authUrl)
}
