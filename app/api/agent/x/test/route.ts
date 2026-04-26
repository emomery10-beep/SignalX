import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const crypto = require('crypto')

  const ck  = process.env.X_API_KEY || ''
  const cs  = process.env.X_API_SECRET || ''
  const at  = process.env.X_ACCESS_TOKEN || ''
  const ats = process.env.X_ACCESS_TOKEN_SECRET || ''

  // Log what we have (masked)
  const envCheck = {
    X_API_KEY:             ck  ? ck.slice(0,6)  + '...' + ck.slice(-4)  : 'MISSING',
    X_API_SECRET:          cs  ? cs.slice(0,6)  + '...' + cs.slice(-4)  : 'MISSING',
    X_ACCESS_TOKEN:        at  ? at.slice(0,10) + '...' + at.slice(-4)  : 'MISSING',
    X_ACCESS_TOKEN_SECRET: ats ? ats.slice(0,6) + '...' + ats.slice(-4) : 'MISSING',
  }

  // Build OAuth 1.0a header manually step by step
  const url       = 'https://api.twitter.com/2/users/me'
  const method    = 'GET'
  const timestamp = String(Math.floor(Date.now() / 1000))
  const nonce     = crypto.randomBytes(16).toString('hex')

  // Step 1: collect oauth params
  const oauthParams = {
    oauth_consumer_key:     ck,
    oauth_nonce:            nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        timestamp,
    oauth_token:            at,
    oauth_version:          '1.0',
  }

  // Step 2: percent encode and sort
  const enc = (s: string) => encodeURIComponent(s)
  const paramStr = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => enc(k) + '=' + enc(v))
    .join('&')

  // Step 3: base string
  const baseString = method + '&' + enc(url) + '&' + enc(paramStr)

  // Step 4: signing key
  const signingKey = enc(cs) + '&' + enc(ats)

  // Step 5: sign
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64')

  // Step 6: build header
  const headerParams = { ...oauthParams, oauth_signature: signature }
  const authHeader = 'OAuth ' + Object.entries(headerParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => enc(k) + '="' + enc(v) + '"')
    .join(', ')

  // Step 7: call X
  const xRes  = await fetch(url, { headers: { Authorization: authHeader } })
  const xBody = await xRes.text()

  return NextResponse.json({
    envCheck,
    request: {
      url,
      method,
      paramStr: paramStr.slice(0, 100) + '...',
      baseString: baseString.slice(0, 100) + '...',
    },
    response: {
      status: xRes.status,
      body: xBody,
    },
  })
}
