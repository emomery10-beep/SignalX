import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  return proxyToMainApp(request, '/api/admin/developers?resource=charges')
}
