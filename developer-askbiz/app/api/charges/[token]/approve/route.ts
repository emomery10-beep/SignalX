import { NextRequest, NextResponse } from 'next/server'

// Server-to-server proxy — same reasoning as api/dashboard-data/route.ts:
// avoids a cross-origin fetch from the browser to askbiz.co (would need
// CORS headers added there), forwards the session cookie instead.
const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://askbiz.co'

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const cookie = request.headers.get('cookie') || ''
  const upstream = await fetch(`${MAIN_APP_URL}/api/v1/charges/${params.token}/approve`, {
    method: 'POST',
    headers: { cookie },
  })
  const data = await upstream.text()
  return new NextResponse(data, { status: upstream.status, headers: { 'Content-Type': 'application/json' } })
}
