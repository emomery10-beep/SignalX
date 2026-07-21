import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

export async function POST(request: NextRequest) {
  return proxyToMainApp(request, '/api/v1/verification/documents')
}
