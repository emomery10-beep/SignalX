// Amazon SP-API OAuth (Login with Amazon) — Step 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const clientId = process.env.AMAZON_LWA_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'Amazon not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/amazon/callback`

  // Amazon Seller Central OAuth — requests SP-API access
  const authUrl = new URL('https://sellercentral.amazon.com/apps/authorize/consent')
  authUrl.searchParams.set('application_id', process.env.AMAZON_APP_ID || '')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('redirect_uri', redirectUri)

  return NextResponse.redirect(authUrl.toString())
}
