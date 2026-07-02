import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac, timingSafeEqual } from 'crypto'

export const runtime = 'nodejs'

// ── One-click unsubscribe ─────────────────────────────────────────────────────
// GET  — the footer link in lifecycle emails (renders a small confirmation page)
// POST — RFC 8058 one-click unsubscribe, triggered directly by Gmail/Yahoo via
//        the List-Unsubscribe-Post header (no body/UI expected)
// The token is an HMAC of the user id — no session needed, can't be forged,
// and guessing another user's link requires the server secret.

function verify(uid: string, token: string): boolean {
  const key = process.env.TOKEN_ENCRYPTION_KEY || process.env.CRON_SECRET || ''
  if (!key || !uid || !token) return false
  const expected = createHmac('sha256', key).update(uid).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'))
  } catch {
    return false
  }
}

async function optOut(uid: string): Promise<boolean> {
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { error } = await service.from('profiles').update({ marketing_emails: false }).eq('id', uid)
  return !error
}

function page(title: string, body: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#f4f3f1;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="background:#fff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,.08);padding:40px;max-width:420px;text-align:center;margin:20px;">
    <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#d08a59;margin-bottom:16px;">AskBiz</div>
    <h1 style="margin:0 0 8px;font-size:20px;color:#1a1916;">${title}</h1>
    <p style="margin:0;font-size:14px;color:#6b6760;line-height:1.6;">${body}</p>
  </div>
</body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid') || ''
  const token = searchParams.get('t') || ''

  if (!verify(uid, token)) {
    return page('Link not valid', 'This unsubscribe link is invalid or has expired. If you still want to stop these emails, reply to any AskBiz email and we will sort it.', 400)
  }
  const ok = await optOut(uid)
  return ok
    ? page('You are unsubscribed', 'No more marketing emails from AskBiz. Receipts, login codes, and account emails still arrive as normal. Changed your mind? Just sign back in — settings has a switch.')
    : page('Something went wrong', 'We could not update your preferences just now. Reply to any AskBiz email and we will sort it by hand.', 500)
}

// RFC 8058 one-click: mail providers POST here without rendering anything.
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid') || ''
  const token = searchParams.get('t') || ''
  if (!verify(uid, token)) return NextResponse.json({ error: 'invalid token' }, { status: 400 })
  const ok = await optOut(uid)
  return ok ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'update failed' }, { status: 500 })
}
