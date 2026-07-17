import { NextRequest, NextResponse } from 'next/server'

// Shared server-to-server proxy body for every /api/dashboard-* route.
// Same reasoning as api/dashboard-data/route.ts: avoids a cross-origin
// fetch from the browser to askbiz.co (would need CORS added there),
// forwards the session cookie instead — works because the cookie's Domain
// is .askbiz.co, valid on both origins server-side.
const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://askbiz.co'

export async function proxyToMainApp(request: NextRequest, mainAppPath: string) {
  const cookie = request.headers.get('cookie') || ''
  const hasBody = request.method === 'POST' || request.method === 'PATCH' || request.method === 'DELETE'
  const upstream = await fetch(`${MAIN_APP_URL}${mainAppPath}`, {
    method: request.method,
    headers: { cookie, ...(hasBody ? { 'Content-Type': 'application/json' } : {}) },
    body: hasBody ? await request.text() : undefined,
  })
  const data = await upstream.text()
  return new NextResponse(data, { status: upstream.status, headers: { 'Content-Type': 'application/json' } })
}
