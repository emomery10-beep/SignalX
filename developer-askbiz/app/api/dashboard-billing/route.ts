import { NextRequest } from 'next/server'
import { proxyToMainApp } from '@/lib/api-proxy'

// Proxies to the same /api/billing route the main askbiz.co site's own
// /billing page uses — there's one subscription/plan per account, not a
// separate developer-API product, so upgrading from here changes the exact
// same row. Used today for action: 'checkout_embedded' (see UpgradeModal).
export async function POST(request: NextRequest) {
  return proxyToMainApp(request, '/api/billing')
}
