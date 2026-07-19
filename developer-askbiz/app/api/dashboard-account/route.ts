import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

// Proxies to the same account-deletion endpoint askbiz.co/settings uses —
// a developer account is the same AskBiz account, so this deletes
// everything (POS, developer API, all of it), not just API access. The
// Settings UI here says so explicitly rather than implying a scoped delete.
export async function GET(request: NextRequest) {
  return proxyToMainApp(request, '/api/account')
}
export async function POST(request: NextRequest) {
  return proxyToMainApp(request, '/api/account')
}
