'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Connection = {
  id: string
  merchant_email: string
  status: string
  scopes: string[]
  app_id: string | null
  created_at: string
}

const SCOPE_LABELS: Record<string, string> = {
  read_inventory: 'Read inventory',
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
  const [appNames, setAppNames] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('developer_connections')
      .select('id, merchant_email, status, scopes, app_id, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: fetchError }) => {
        if (fetchError) { setError(fetchError.message); return }
        setConnections(data)
        // One batched lookup of the developer's own apps (RLS-owned, so this
        // is cheap and always allowed) rather than a query per connection row.
        supabase.from('developer_apps').select('id, name').then(({ data: apps }) => {
          if (apps) setAppNames(Object.fromEntries(apps.map(a => [a.id, a.name])))
        })
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
              <div>
                <span className="text-sm block mb-1">{c.merchant_email}</span>
                <span className="text-ink-400 text-xs">{(c.scopes || []).map(s => SCOPE_LABELS[s] || s).join(', ') || 'No scopes granted'}</span>
                {c.app_id && appNames[c.app_id] && (
                  <span className="block text-signal-300 text-xs mt-0.5">via {appNames[c.app_id]}</span>
                )}
              </div>
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
