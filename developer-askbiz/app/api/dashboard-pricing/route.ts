import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

// /api/v1/pricing is public/unauthenticated on the main app, but proxying
// through here (instead of a direct client fetch to askbiz.co) keeps the
// same convention as every other dashboard-* route and avoids a second CORS
// story for one endpoint.
export async function GET(request: NextRequest) {
  return proxyToMainApp(request, '/api/v1/pricing')
}
