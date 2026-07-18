// Single source of truth for every real /api/v1/* endpoint — the public
// docs section (app/docs/**), the authenticated in-app docs page
// (app/dashboard/docs), and (later) an interactive console all read from
// this list instead of each hardcoding their own copy that drifts out of
// sync. Every field here is ground-truthed against the actual route
// handler in the main app (askbiz.co repo root, app/api/v1/**) — do not
// add a field here that the route doesn't actually implement.

export type EndpointAuth = 'api_key' | 'session' | 'public'

export type Endpoint = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'GET/POST/PATCH/DELETE'
  path: string
  /** URL slug under /docs/api-reference/[slug] */
  slug: string
  authType: EndpointAuth
  /** Callable directly by a third-party developer with their own key, vs an
   * account-management action only exposed through the dashboard UI. */
  category: 'core' | 'account'
  summary: string
  priceCents?: number
  requiresAccountMode?: boolean
  supportsIdempotency?: boolean
}

export const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/ask',
    slug: 'ask',
    authType: 'api_key',
    category: 'core',
    summary: 'Ask a plain-English business-intelligence question and get an answer grounded in real sales, stock, and margin data.',
  },
  {
    method: 'POST',
    path: '/api/v1/scan',
    slug: 'scan',
    authType: 'api_key',
    category: 'core',
    summary: 'Vision recognition — identify a product from a photo. Account-mode keys get results matched against the caller’s own AskBiz inventory.',
    priceCents: 3,
    supportsIdempotency: true,
  },
  {
    method: 'POST',
    path: '/api/v1/whatsapp/send',
    slug: 'whatsapp-send',
    authType: 'api_key',
    category: 'core',
    summary: 'Send a pre-approved receipt or purchase-order template over WhatsApp via AskBiz’s Meta Business API connection.',
    priceCents: 2,
    requiresAccountMode: true,
    supportsIdempotency: true,
  },
  {
    method: 'POST',
    path: '/api/v1/connections',
    slug: 'connections',
    authType: 'api_key',
    category: 'core',
    summary: 'Request scoped, persistent access to a specific merchant’s account — the merchant approves via a hosted confirmation page.',
  },
  {
    method: 'POST',
    path: '/api/v1/charges',
    slug: 'charges',
    authType: 'api_key',
    category: 'core',
    summary: 'Create a billing-on-behalf-of charge request against a merchant, collected via a hosted Stripe Checkout page.',
  },
  {
    method: 'GET',
    path: '/api/v1/pricing',
    slug: 'pricing',
    authType: 'public',
    category: 'core',
    summary: 'Public, unauthenticated endpoint returning live per-endpoint prices and plan limits — check it before you integrate, not after a 402.',
  },
  {
    method: 'GET/POST/PATCH/DELETE',
    path: '/api/v1/webhooks',
    slug: 'webhooks',
    authType: 'session',
    category: 'account',
    summary: 'Manage webhook subscriptions for sale.created, purchase_order.received, and stock.low events — an account-settings action, managed from the dashboard.',
  },
]

export function getEndpoint(slug: string) {
  return ENDPOINTS.find(e => e.slug === slug)
}

export const CORE_ENDPOINTS = ENDPOINTS.filter(e => e.category === 'core')
export const ACCOUNT_ENDPOINTS = ENDPOINTS.filter(e => e.category === 'account')
