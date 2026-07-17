'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Connection = {
  id: string
  merchant_email: string
  status: string
  created_at: string
}

// Read-only, same RLS-direct pattern as the Charges page. Note: only the
// MERCHANT can revoke a connection (developer_connections_merchant_update
// in 20260708000007_developer_connections.sql) — there's no policy letting
// the developer revoke one themselves from here. That's a deliberate scope
// cut, not an oversight; a developer-initiated revoke needs its own RLS
// policy or API route, which hasn't been built.
export default function ConnectionsPage() {
  const supabase = createClient()
  const [connections, setConnections] = useState<Connection[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('developer_connections')
      .select('id, merchant_email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        else setConnections(data)
      })
  }, [supabase])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Connections</h1>
      <p className="text-ink-300 text-sm mb-8 max-w-lg">
        Merchants who&rsquo;ve granted your key access via the API (POST /api/v1/connections). Only the merchant can revoke access — this is a read-only view.
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {!connections && !error && <p className="text-ink-300 text-sm">Loading…</p>}

      {connections && connections.length === 0 && (
        <div className="border border-ink-700 rounded-xl p-6 text-center">
          <p className="text-ink-300 text-sm">No connections yet.</p>
        </div>
      )}

      {connections && connections.length > 0 && (
        <div className="space-y-3">
          {connections.map(c => (
            <div key={c.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900 flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm">{c.merchant_email}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-signal-600/20 text-signal-300' : 'bg-ink-800 text-ink-200'}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
