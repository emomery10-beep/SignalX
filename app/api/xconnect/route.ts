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
    return NextResponse.redirect(new URL('/admin/x?error=no_code', request.url))
  }

  const clientId     = process.env.X_CLIENT_ID!
  const clientSecret = process.env.X_CLIENT_SECRET!

  try {
    const res = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        redirect_uri:  'https://askbiz.co/api/xconnect',
        code_verifier: 'challenge123',
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.access_token) {
      return NextResponse.redirect(
        new URL('/admin/x?error=' + encodeURIComponent(JSON.stringify(data)), request.url)
      )
    }

    // Show the tokens so you can copy them into Vercel
    return new NextResponse(`
      <html><body style="font-family:monospace;padding:24px;background:#f5f5f5">
        <h2 style="color:green">✅ X Connected Successfully!</h2>
        <p>Copy these values into Vercel Environment Variables:</p>
        <hr/>
        <p><strong>X_ACCESS_TOKEN_V2</strong> (add this to Vercel):</p>
        <textarea rows="4" style="width:100%;padding:8px;font-size:12px">${data.access_token}</textarea>
        <p><strong>X_REFRESH_TOKEN_V2</strong> (add this to Vercel):</p>
        <textarea rows="4" style="width:100%;padding:8px;font-size:12px">${data.refresh_token || 'not provided'}</textarea>
        <p><strong>Scope:</strong> ${data.scope}</p>
        <p><strong>Expires in:</strong> ${data.expires_in} seconds</p>
        <hr/>
        <p>After adding to Vercel, redeploy and the X agent will work.</p>
      </body></html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    return NextResponse.redirect(
      new URL('/admin/x?error=' + encodeURIComponent(String(err)), request.url)
    )
  }
}
