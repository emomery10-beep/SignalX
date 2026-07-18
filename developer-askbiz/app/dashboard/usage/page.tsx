'use client'
import { useEffect, useState } from 'react'

type ApiKey = {
  id: string
  name: string
  credit_balance_cents?: number
}

type Transaction = { type: string; amount_cents: number; endpoint: string | null; created_at: string }

type UsageData = {
  summary: { total_requests_month: number; avg_latency_ms: number; error_rate_pct: number; active_keys: number; total_spent_cents: number }
  recent: { created_at: string; status: number; latency_ms: number; question?: string }[]
  recent_transactions: Transaction[]
}

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const ghostBtnCls = `py-2 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`

// £5 / £20 / £100 — fixed bundles, matches the backend's TOPUP_BUNDLES
// (app/api/v1/wallet/topup/route.ts) exactly; keep these in sync if that changes.
const TOPUP_BUNDLES = [
  { cents: 500, label: '£5' },
  { cents: 2000, label: '£20' },
  { cents: 10000, label: '£100' },
]

export default function UsagePage() {
  const [keys, setKeys] = useState<ApiKey[] | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [error, setError] = useState('')
  const [toppingUp, setToppingUp] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard-data').then(r => r.json()).then(data => {
      if (data.error) setError(data.error)
      else { setKeys(data.keys); setUsage(data.usage) }
    })
  }, [])

  const handleTopup = async (keyId: string, amountCents: number) => {
    setToppingUp(`${keyId}-${amountCents}`); setError('')
    try {
      const res = await fetch('/api/wallet-topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_id: keyId, amount_cents: amountCents }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not start checkout')
      window.location.href = data.checkout_url
    } catch (e: any) {
      setError(e.message || 'Could not start checkout')
      setToppingUp(null)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Usage &amp; credits</h1>
      <p className="text-ink-300 text-sm mb-8">Monthly request usage, per-key credit balance, and top-ups.</p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {usage && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <Stat label="Requests this month" value={String(usage.summary.total_requests_month)} />
          <Stat label="Spent (30 days)" value={`£${((usage.summary.total_spent_cents || 0) / 100).toFixed(2)}`} />
          <Stat label="Avg latency" value={`${usage.summary.avg_latency_ms}ms`} />
          <Stat label="Error rate" value={`${usage.summary.error_rate_pct}%`} />
          <Stat label="Active keys" value={String(usage.summary.active_keys)} />
        </div>
      )}

      <h2 className="font-display text-lg font-bold mb-3">Credit balance</h2>
      {!keys && !error && <p className="text-ink-300 text-sm">Loading…</p>}
      {keys && keys.length === 0 && <p className="text-ink-300 text-sm mb-8">No keys yet — create one on the Keys page first.</p>}
      <div className="space-y-3 mb-8">
        {(keys || []).map(k => (
          <div key={k.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium mb-1">{k.name}</p>
              <p className="text-ink-300 text-xs">
                Balance: £{typeof k.credit_balance_cents === 'number' ? (k.credit_balance_cents / 100).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {TOPUP_BUNDLES.map(b => (
                <button key={b.cents} onClick={() => handleTopup(k.id, b.cents)}
                  disabled={toppingUp === `${k.id}-${b.cents}`}
                  className={ghostBtnCls}>
                  {toppingUp === `${k.id}-${b.cents}` ? '…' : `Top up ${b.label}`}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold mb-3">Recent requests</h2>
      {usage && usage.recent.length === 0 && <p className="text-ink-300 text-sm">No requests in the last 30 days.</p>}
      {usage && usage.recent.length > 0 && (
        <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-700 text-ink-300 text-left">
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody>
              {usage.recent.map((r, i) => (
                <tr key={i} className="border-b border-ink-800 last:border-0">
                  <td className="px-4 py-2 text-ink-200">{new Date(r.created_at).toLocaleString()}</td>
                  <td className={`px-4 py-2 ${r.status >= 400 ? 'text-red-400' : 'text-signal-300'}`}>{r.status}</td>
                  <td className="px-4 py-2 text-ink-200">{r.latency_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="font-display text-lg font-bold mb-3 mt-8">Billing history</h2>
      {usage && (usage.recent_transactions || []).length === 0 && <p className="text-ink-300 text-sm">No charges in the last 30 days.</p>}
      {usage && (usage.recent_transactions || []).length > 0 && (
        <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-700 text-ink-300 text-left">
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Endpoint</th>
                <th className="px-4 py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(usage.recent_transactions || []).map((t, i) => (
                <tr key={i} className="border-b border-ink-800 last:border-0">
                  <td className="px-4 py-2 text-ink-200">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-ink-200 capitalize">{t.type}</td>
                  <td className="px-4 py-2 text-ink-300">{t.endpoint || '—'}</td>
                  <td className={`px-4 py-2 ${t.amount_cents < 0 ? 'text-red-400' : 'text-signal-300'}`}>
                    {t.amount_cents < 0 ? '-' : '+'}£{(Math.abs(t.amount_cents) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink-700 rounded-xl p-4 bg-ink-900">
      <p className="text-ink-300 text-xs mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
