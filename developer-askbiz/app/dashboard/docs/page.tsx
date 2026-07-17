const ENDPOINTS = [
  { method: 'POST', path: '/api/v1/ask', desc: 'Ask a business-intelligence question, grounded in real data.' },
  { method: 'POST', path: '/api/v1/scan', desc: 'Vision recognition — identify a product from a photo, matched against your inventory in account mode.' },
  { method: 'POST', path: '/api/v1/whatsapp/send', desc: 'Send a receipt or purchase-order template over WhatsApp. Requires an account-mode key.' },
  { method: 'POST', path: '/api/v1/charges', desc: 'Create a billing-on-behalf-of charge request against a merchant, identified by email.' },
  { method: 'POST', path: '/api/v1/connections', desc: 'Request persistent access to a merchant’s account, for use with scan’s merchant_id param.' },
  { method: 'GET/POST/PATCH/DELETE', path: '/api/v1/webhooks', desc: 'Manage webhook subscriptions (sale.created, purchase_order.received, stock.low) — also available from the Webhooks page.' },
]

export default function DocsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Docs</h1>
      <p className="text-ink-300 text-sm mb-8 max-w-lg">
        Every endpoint takes an <code className="text-ink-100">x-api-key</code> header. Full machine-readable spec:{' '}
        <a href="https://askbiz.co/api/v1/openapi.json" target="_blank" rel="noreferrer"
          className="text-signal-300 underline underline-offset-2 hover:text-signal-200">openapi.json</a>.
      </p>

      <div className="space-y-3">
        {ENDPOINTS.map(e => (
          <div key={e.path} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-300">{e.method}</span>
              <code className="text-sm">{e.path}</code>
            </div>
            <p className="text-ink-300 text-xs">{e.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-ink-700 rounded-xl p-4 bg-ink-900">
        <h2 className="font-display text-sm font-bold mb-2">Pricing</h2>
        <p className="text-ink-300 text-xs">
          Pay-per-use — see the Usage page for your credit balance and top-up. Vision scans and WhatsApp sends cost more per call than plain data reads, reflecting cost to serve.
        </p>
      </div>
    </div>
  )
}
