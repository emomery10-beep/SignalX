// QuickBooks OAuth 2.0 — Step 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const clientId = process.env.QUICKBOOKS_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'QuickBooks not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/quickbooks/callback`
  const scopes = 'com.intuit.quickbooks.accounting'

  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`

  return NextResponse.redirect(authUrl)
}
