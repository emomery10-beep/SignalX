'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ENDPOINTS = [
  { method: 'POST', path: '/api/v1/ask', desc: 'Ask a business-intelligence question, grounded in real data.' },
  { method: 'POST', path: '/api/v1/scan', desc: 'Vision recognition — identify a product from a photo, matched against your inventory in account mode.' },
  { method: 'POST', path: '/api/v1/whatsapp/send', desc: 'Send a receipt or purchase-order template over WhatsApp. Requires an account-mode key.' },
  { method: 'POST', path: '/api/v1/charges', desc: 'Create a billing-on-behalf-of charge request against a merchant, identified by email.' },
  { method: 'POST', path: '/api/v1/connections', desc: 'Request persistent access to a merchant’s account, for use with scan’s merchant_id param.' },
  { method: 'GET/POST/PATCH/DELETE', path: '/api/v1/webhooks', desc: 'Manage webhook subscriptions (sale.created, purchase_order.received, stock.low) — also available from the Webhooks page.' },
]

type Pricing = { endpoints: { path: string; price_cents: number }[]; plans: Record<string, { month: number; minute: number }> }

export default function DocsPage() {
  const [pricing, setPricing] = useState<Pricing | null>(null)

  useEffect(() => {
    fetch('/api/dashboard-pricing').then(r => r.json()).then(setPricing).catch(() => {})
  }, [])

  const priceFor = (path: string) => pricing?.endpoints.find(e => e.path === path)?.price_cents

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Docs</h1>
      <p className="text-ink-300 text-sm mb-4 max-w-lg">
        Every endpoint takes an <code className="text-ink-100">x-api-key</code> header. Send an{' '}
        <code className="text-ink-100">Idempotency-Key</code> header on any billed call to safely retry without being
        charged twice. Full machine-readable spec:{' '}
        <a href="https://askbiz.co/api/v1/openapi.json" target="_blank" rel="noreferrer"
          className="text-signal-300 underline underline-offset-2 hover:text-signal-200">openapi.json</a>.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <a href="/docs" target="_blank" rel="noreferrer"
          className="flex flex-col justify-between gap-2 border border-signal-600 bg-signal-600/10 rounded-xl p-4 hover:bg-signal-600/15 transition-colors">
          <div>
            <p className="text-signal-300 text-sm font-semibold mb-0.5">Full documentation, guides &amp; FAQ →</p>
            <p className="text-ink-300 text-xs">Quickstart, per-endpoint reference with code samples, task guides, and a public link you can share with your team.</p>
          </div>
        </a>
        <Link href="/dashboard/console"
          className="flex flex-col justify-between gap-2 border border-ink-700 rounded-xl p-4 bg-ink-900 hover:border-signal-600 transition-colors">
          <div>
            <p className="text-ink-50 text-sm font-semibold mb-0.5">Try it in the console →</p>
            <p className="text-ink-300 text-xs">Fire a real request with one of your keys and see the actual response, before you write any code.</p>
          </div>
        </Link>
      </div>

      <div className="space-y-3">
        {ENDPOINTS.map(e => {
          const price = priceFor(e.path)
          return (
            <div key={e.path} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
              <div className="flex items-center gap-3 mb-1 flex-wrap justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-300">{e.method}</span>
                  <code className="text-sm">{e.path}</code>
                </div>
                {typeof price === 'number' && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-signal-600/20 text-signal-300">
                    {price}¢ / call
                  </span>
                )}
              </div>
              <p className="text-ink-300 text-xs">{e.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 border border-ink-700 rounded-xl p-4 bg-ink-900">
        <h2 className="font-display text-sm font-bold mb-2">Pricing</h2>
        <p className="text-ink-300 text-xs mb-3">
          Pay-per-use, billed only on success — a failed or rejected call is never charged. Live prices above come
          straight from <code className="text-ink-100">/api/v1/pricing</code> (public, no auth required) — check it
          any time before you integrate, not just when you hit a 402.
        </p>
        {pricing && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-ink-400">
                <th className="pr-4 py-1 font-medium">Plan</th>
                <th className="pr-4 py-1 font-medium">Requests / month</th>
                <th className="py-1 font-medium">Requests / minute</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pricing.plans).map(([plan, limits]) => (
                <tr key={plan} className="border-t border-ink-800">
                  <td className="pr-4 py-1.5 capitalize text-ink-100">{plan}</td>
                  <td className="pr-4 py-1.5 text-ink-300">{limits.month === -1 ? 'Unlimited' : limits.month}</td>
                  <td className="py-1.5 text-ink-300">{limits.minute}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
