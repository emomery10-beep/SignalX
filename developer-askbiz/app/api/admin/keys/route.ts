import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

// The root endpoint (app/api/admin/developers) IS the real authorization
// boundary — see lib/admin-auth.ts. This proxy, and the /admin section's
// client-side guard, are UX convenience only; a non-admin hitting either
// still gets a 401 straight from the root app.
export async function GET(request: NextRequest) {
  return proxyToMainApp(request, '/api/admin/developers?resource=keys')
}
export async function POST(request: NextRequest) {
  return proxyToMainApp(request, '/api/admin/developers')
}
