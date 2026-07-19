import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  return proxyToMainApp(request, '/api/profile')
}
export async function PATCH(request: NextRequest) {
  return proxyToMainApp(request, '/api/profile')
}
