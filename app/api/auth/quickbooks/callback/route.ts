// QuickBooks OAuth 2.0 — Step 2
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const realmId = searchParams.get('realmId') // QuickBooks company ID
  const error = searchParams.get('error')

  if (error || !code || !state || !realmId) {
    return NextResponse.redirect(new URL('/sources?error=quickbooks_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const clientId = process.env.QUICKBOOKS_CLIENT_ID!
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/quickbooks/callback`
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const tokenRes = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=quickbooks_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  // Get company info
  const companyRes = await fetch(
    `https://quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}?minorversion=65`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    }
  )
  const companyData = companyRes.ok ? await companyRes.json() : {}
  const companyName = companyData.CompanyInfo?.CompanyName || 'QuickBooks'

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'quickbooks',
      name: companyName,
      status: 'active',
      credentials: { access_token, refresh_token },
      config: { realm_id: realmId },
      sync_interval_minutes: 360,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=quickbooks', request.url))
}
