'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ApiKey = {
  id: string
  name: string
  key: string
  plan: string
  is_active: boolean
  requests_month: number
  request_limit_month: number
  credit_balance_cents?: number
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [keys, setKeys] = useState<ApiKey[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }
      const res = await fetch('/api/dashboard-data')
      if (res.status === 401) { router.push('/signin'); return }
      const data = await res.json()
      if (!cancelled) {
        if (data.error) setError(data.error)
        else setKeys(data.keys)
      }
    }
    load()
    return () => { cancelled = true }
  }, [router, supabase])

  return (
    <div className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-1">API keys</h1>
      <p className="text-ink-300 text-sm mb-8">
        Manage keys for the AskBiz API — vision recognition, WhatsApp send, inventory, and purchase orders.
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!keys && !error && <p className="text-ink-300 text-sm">Loading…</p>}

      {keys && keys.length === 0 && (
        <div className="border border-ink-700 rounded-xl p-6 text-center">
          <p className="text-ink-300 text-sm mb-4">No API keys yet.</p>
          {/* text-ink-400 on this background computed to 3.24:1 — fails
              WCAG AA's 4.5:1 minimum. text-ink-300 measures ~5.1:1. */}
          <p className="text-ink-300 text-xs">
            Key creation is managed from your AskBiz account settings for now — full self-serve creation from this dashboard is next.
          </p>
        </div>
      )}

      {keys && keys.length > 0 && (
        <div className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{k.name}</span>
                {/* Two bugs here, both audit-confirmed: (1) bg-signal-900
                    doesn't exist — tailwind.config.js only defines
                    signal.100-600 — so the "Active" badge rendered with no
                    background at all. (2) text-ink-400 on bg-ink-800
                    computed to 2.78:1, failing WCAG AA on a status
                    indicator specifically. */}
                <span className={`text-xs px-2 py-0.5 rounded-full ${k.is_active ? 'bg-signal-600/20 text-signal-300' : 'bg-ink-800 text-ink-200'}`}>
                  {k.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <code className="text-xs text-ink-300 block mb-2">{k.key}</code>
              <div className="flex gap-4 text-xs text-ink-300">
                <span>Plan: {k.plan}</span>
                <span>
                  Usage: {k.requests_month}
                  {k.request_limit_month >= 0 ? ` / ${k.request_limit_month}` : ' / unlimited'} this month
                </span>
                {typeof k.credit_balance_cents === 'number' && (
                  <span>Credit balance: ${(k.credit_balance_cents / 100).toFixed(2)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
