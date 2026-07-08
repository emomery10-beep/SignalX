import { NextRequest, NextResponse } from 'next/server'

// Server-to-server proxy to the main app's /api/v1/* routes. A direct
// client-side fetch from developer.askbiz.co to askbiz.co would be
// cross-origin and blocked by CORS (shared cookie *domain* doesn't grant
// cross-origin fetch access — that's a separate browser policy). Forwarding
// the Cookie header here works because the session cookie's Domain is
// .askbiz.co, valid on both origins server-side.
const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://askbiz.co'

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie') || ''

  const [keysRes, usageRes] = await Promise.all([
    fetch(`${MAIN_APP_URL}/api/v1/keys`, { headers: { cookie }, cache: 'no-store' }),
    fetch(`${MAIN_APP_URL}/api/v1/usage`, { headers: { cookie }, cache: 'no-store' }),
  ])

  if (keysRes.status === 401 || usageRes.status === 401) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [keys, usage] = await Promise.all([keysRes.json(), usageRes.json()])
  return NextResponse.json({ keys: keys.keys || [], usage: usage.usage || usage })
}
