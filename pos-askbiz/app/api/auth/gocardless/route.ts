// GoCardless OAuth 2.0 — Step 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const clientId = process.env.GOCARDLESS_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'GoCardless not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gocardless/callback`

  const authUrl = new URL('https://connect.gocardless.com/oauth/authorize')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'read_only')
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl.toString())
}
