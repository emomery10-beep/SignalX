// Linnworks OAuth 2.0 — Step 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const appId = process.env.LINNWORKS_APP_ID
  if (!appId) return NextResponse.json({ error: 'Linnworks not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linnworks/callback`

  const authUrl = new URL('https://auth.linnworks.net/OAuth/Authorize')
  authUrl.searchParams.set('applicationId', appId)
  authUrl.searchParams.set('redirectUri', redirectUri)
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl.toString())
}
