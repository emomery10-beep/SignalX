import { NextRequest, NextResponse } from 'next/server'

// Phone+PIN account logic (rate limiting, PIN hashing, lockouts) lives on
// the main app and isn't duplicated here. This is a server-to-server proxy
// so the browser only ever talks to its own origin (developer.askbiz.co) —
// a direct cross-origin fetch from the client would need CORS headers added
// to the main app's route, which is a wider change than this app should make.
const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://askbiz.co'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const upstream = await fetch(`${MAIN_APP_URL}/api/auth/phone-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const data = await upstream.text()
  return new NextResponse(data, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
