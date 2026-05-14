// PayPal OAuth 2.0 — Step 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const clientId = process.env.PAYPAL_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/paypal/callback`

  const authUrl = new URL('https://www.paypal.com/signin/authorize')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'openid profile email https://uri.paypal.com/services/paypalattributes')
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl.toString())
}
