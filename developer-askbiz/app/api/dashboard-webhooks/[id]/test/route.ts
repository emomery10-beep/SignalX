import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyToMainApp(request, `/api/v1/webhooks/${params.id}/test`)
}
