// Stripe Connect OAuth — Step 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const clientId = process.env.STRIPE_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64url')
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/stripe/callback`

  const authUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_only&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`

  return NextResponse.redirect(authUrl)
}
