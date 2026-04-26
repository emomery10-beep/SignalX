import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  results.env = {
    X_BEARER_TOKEN:        process.env.X_BEARER_TOKEN        ? 'set:' + process.env.X_BEARER_TOKEN.slice(0, 10)        : 'MISSING',
    X_API_KEY:             process.env.X_API_KEY             ? 'set:' + process.env.X_API_KEY.slice(0, 10)             : 'MISSING',
    X_API_SECRET:          process.env.X_API_SECRET          ? 'set:' + process.env.X_API_SECRET.slice(0, 10)          : 'MISSING',
    X_ACCESS_TOKEN:        process.env.X_ACCESS_TOKEN        ? 'set:' + process.env.X_ACCESS_TOKEN.slice(0, 10)        : 'MISSING',
    X_ACCESS_TOKEN_SECRET: process.env.X_ACCESS_TOKEN_SECRET ? 'set:' + process.env.X_ACCESS_TOKEN_SECRET.slice(0, 10) : 'MISSING',
  }

  try {
    const bearerRes = await fetch(
      'https://api.twitter.com/2/tweets/search/recent?query=hello&max_results=10',
      { headers: { Authorization: 'Bearer ' + process.env.X_BEARER_TOKEN } }
    )
    results.bearer_test = { status: bearerRes.status, body: await bearerRes.json() }
  } catch (e) {
    results.bearer_test = { error: String(e) }
  }

  try {
    const crypto = require('crypto')
    const url = 'https://api.twitter.com/2/users/me'
    const ck  = process.env.X_API_KEY || ''
    const cs  = process.env.X_API_SECRET || ''
    const at  = process.env.X_ACCESS_TOKEN || ''
    const as2 = process.env.X_ACCESS_TOKEN_SECRET || ''
    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const ts = Math.floor(Date.now() / 1000).toString()
    const op: Record<string, string> = {
      oauth_consumer_key: ck, oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: ts, oauth_token: at, oauth_version: '1.0',
    }
    const sp = Object.keys(op).sort().map(k => encodeURIComponent(k) + '=' + encodeURIComponent(op[k])).join('&')
    const bs = 'GET&' + encodeURIComponent(url) + '&' + encodeURIComponent(sp)
    const sk = encodeURIComponent(cs) + '&' + encodeURIComponent(as2)
    op.oauth_signature = crypto.createHmac('sha1', sk).update(bs).digest('base64')
    const ah = 'OAuth ' + Object.keys(op).sort().map(k => encodeURIComponent(k) + '="' + encodeURIComponent(op[k]) + '"').join(', ')
    const r = await fetch(url, { headers: { Authorization: ah } })
    results.oauth_test = { status: r.status, body: await r.json() }
  } catch (e) {
    results.oauth_test = { error: String(e) }
  }

  return NextResponse.json(results, { status: 200 })
}
