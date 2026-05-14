// eBay OAuth 2.0 — Step 1
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

  // Only use the basic scope — sell.inventory.readonly requires eBay approval
  const authUrl =
    `https://auth.ebay.com/oauth2/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(ruName)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('https://api.ebay.com/oauth/api_scope')}` +
    `&state=${state}`

  // DEBUG — remove after confirming OAuth works
  if (request.nextUrl.searchParams.get('debug') === '1') {
    return NextResponse.json({
      clientId,
      ruName,
      authUrl,
    })
  }

  return NextResponse.redirect(authUrl)
}
