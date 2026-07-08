'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Charge = {
  id: string
  merchant_email: string
  amount_cents: number
  currency: string
  description: string
  status: string
  created_at: string
}

// Read-only — created only via the API (POST /api/v1/charges), never from
// this dashboard. Fetched directly via the Supabase client: RLS
// (developer_charges_creator_select) already scopes this to charges
// created by the caller's own keys, same as the merchant confirmation page
// does for its side — no proxy/service-role route needed for a read.
export default function ChargesPage() {
  const supabase = createClient()
  const [charges, setCharges] = useState<Charge[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('developer_charges')
      .select('id, merchant_email, amount_cents, currency, description, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        else setCharges(data)
      })
  }, [supabase])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Charges</h1>
      <p className="text-ink-300 text-sm mb-8 max-w-lg">
        Billing-on-behalf-of requests you&rsquo;ve created via the API (POST /api/v1/charges). Create new charges from your app — this is a read-only view.
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {!charges && !error && <p className="text-ink-300 text-sm">Loading…</p>}

      {charges && charges.length === 0 && (
        <div className="border border-ink-700 rounded-xl p-6 text-center">
          <p className="text-ink-300 text-sm">No charges yet.</p>
        </div>
      )}

      {charges && charges.length > 0 && (
        <div className="space-y-3">
          {charges.map(c => (
            <div key={c.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <span className="text-sm font-medium">{c.description}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusCls(c.status)}`}>{c.status}</span>
              </div>
              <p className="text-ink-300 text-xs">
                £{(c.amount_cents / 100).toFixed(2)} {c.currency.toUpperCase()} — {c.merchant_email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function statusCls(status: string) {
  if (status === 'approved') return 'bg-signal-600/20 text-signal-300'
  if (status === 'declined' || status === 'expired' || status === 'failed') return 'bg-red-500/10 text-red-400'
  return 'bg-ink-800 text-ink-200'
}
