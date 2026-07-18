import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  return proxyToMainApp(request, '/api/v1/apps')
}
export async function POST(request: NextRequest) {
  return proxyToMainApp(request, '/api/v1/apps')
}
export async function PATCH(request: NextRequest) {
  return proxyToMainApp(request, '/api/v1/apps')
}
export async function DELETE(request: NextRequest) {
  return proxyToMainApp(request, '/api/v1/apps')
}
