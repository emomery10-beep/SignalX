import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

// Proxies to the same route the forced post-admin-reset flow uses
// (app/api/auth/change-pin) — that route only checks the caller has a
// valid session, it never actually required must_change_pin to be true, so
// it's safe to reuse for genuine self-service "change my PIN anytime."
export async function POST(request: NextRequest) {
  return proxyToMainApp(request, '/api/auth/change-pin')
}
