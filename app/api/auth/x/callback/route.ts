// app/api/auth/x/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/admin/x?error=' + error, request.url))
  }

  if (!code) {
    return NextResponse.json({ error: 'No code returned' }, { status: 400 })
  }

  // Exchange code for token
  const clientId     = process.env.X_CLIENT_ID!
  const clientSecret = process.env.X_CLIENT_SECRET!
  const redirectUri  = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/x/callback'
  const codeVerifier = 'challenge' // matches code_challenge in the auth URL

  const params = new URLSearchParams({
    code,
    grant_type:    'authorization_code',
    redirect_uri:  redirectUri,
    code_verifier: codeVerifier,
  })

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      Authorization:   'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: params.toString(),
  })

  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.redirect(
      new URL('/admin/x?error=' + encodeURIComponent(JSON.stringify(tokenData)), request.url)
    )
  }

  // Return the token to the user so they can add it to Vercel
  const html = `<!DOCTYPE html>
<html>
<head><title>X Connected</title></head>
<body style="font-family:system-ui;padding:40px;max-width:600px;margin:0 auto">
  <h1 style="color:#16a34a">X Connected!</h1>
  <p>Add this to Vercel Environment Variables as <strong>X_ACCESS_TOKEN_V2</strong>:</p>
  <div style="background:#f1f5f9;padding:16px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px;margin:16px 0">
    ${tokenData.access_token}
  </div>
  <p style="color:#666">Then redeploy Vercel and go back to <a href="/admin/x">/admin/x</a></p>
  ${tokenData.refresh_token ? '<p>Refresh token (save this too as <strong>X_REFRESH_TOKEN</strong>): <br><code style="font-size:11px">' + tokenData.refresh_token + '</code></p>' : ''}
</body>
</html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
