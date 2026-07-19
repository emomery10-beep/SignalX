'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type UsageData = {
  summary: { total_requests_month: number; avg_latency_ms: number; error_rate_pct: number; active_keys: number; total_spent_cents: number }
  recent: { created_at: string; status: number; latency_ms: number; question?: string }[]
}

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/dashboard-data').then(r => r.json()).then(data => {
      if (data.error) setError(data.error)
      else setUsage(data.usage)
    })
  }, [])

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <h1 className="font-display text-2xl font-bold">Usage</h1>
        <Link href="/dashboard/settings" className="text-signal-300 text-xs hover:text-signal-200 underline underline-offset-2">
          Credit balance, top-ups &amp; billing history →
        </Link>
      </div>
      <p className="text-ink-300 text-sm mb-8">Monthly request volume, latency, and error rate across your keys.</p>

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
