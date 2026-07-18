'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// Mirrors ALLOWED_SCOPES in app/api/v1/connections/route.ts — only one
// scope exists today because that's the only thing any connection-gated
// endpoint (scan) actually reads.
const SCOPE_LABELS: Record<string, string> = {
  read_inventory: 'View your product inventory — names, stock levels, cost and sale prices',
}

type Connection = {
  id: string
  merchant_email: string
  status: string
  scopes: string[]
  app_id: string | null
}

type App = { id: string; name: string; logo_url: string | null }

// Merchant-facing approval screen for Phase 4 (see app/api/v1/connections
// on the main app for the developer side, and the migration
// 20260708000007_developer_connections.sql for the scope decision behind
// this being a persistent connection rather than full OAuth scopes).
// Unlike the Phase 3 charge confirmation page, approval here has no
// payment step, so it's a direct client-side Supabase write — RLS
// (developer_connections_merchant_update) is the only enforcement needed,
// no server proxy required.
export default function ConnectConfirmationPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [connection, setConnection] = useState<Connection | null>(null)
  const [app, setApp] = useState<App | null>(null)
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/signin?next=/connect/${params.token}`); return }

      const { data, error: fetchError } = await supabase
        .from('developer_connections')
        .select('id, merchant_email, status, scopes, app_id')
        .eq('confirmation_token', params.token)
        .single()

      if (cancelled) return
      if (fetchError || !data) { setError('Connection request not found, or not addressed to your account.'); setLoading(false); return }
      setConnection(data); setSelectedScopes(data.scopes || [])

      // Resolve the requesting app's name/logo, if the key that created
      // this connection was grouped under one — a merchant sees "App XYZ
      // wants..." instead of a bare, unnamed request. Not every connection
      // has an app (grouping is opt-in), so a miss here is normal, not an error.
      if (data.app_id) {
        const { data: appData } = await supabase.from('developer_apps').select('id, name, logo_url').eq('id', data.app_id).maybeSingle()
        if (!cancelled && appData) setApp(appData)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [params.token, router, supabase])

  const toggleScope = (scope: string) => {
    setSelectedScopes(cur => cur.includes(scope) ? cur.filter(s => s !== scope) : [...cur, scope])
  }

  const respond = async (approve: boolean) => {
    setBusy(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // A merchant can only ever narrow what was requested, never grant a
    // scope the developer didn't ask for — selectedScopes starts as a copy
    // of the requested set and checkboxes only remove from it.
    const update = approve
      ? { status: 'active', merchant_user_id: user.id, approved_at: new Date().toISOString(), scopes: selectedScopes }
      : { status: 'revoked', revoked_at: new Date().toISOString() }

    const { error: updateError } = await supabase
      .from('developer_connections')
      .update(update)
      .eq('confirmation_token', params.token)

    if (updateError) { setError(updateError.message); setBusy(false); return }
    setConnection(c => c ? { ...c, status: update.status, scopes: approve ? selectedScopes : c.scopes } : c)
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl p-6">
        {loading && <p className="text-ink-300 text-sm">Loading…</p>}

        {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && connection && connection.status === 'pending' && (
          <>
            {app && (
              <div className="flex items-center gap-2.5 mb-3">
                {app.logo_url
                  ? <img src={app.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  : <div className="w-8 h-8 rounded-lg bg-signal-600/20 flex-shrink-0" />}
                <span className="text-ink-100 text-sm font-semibold">{app.name}</span>
              </div>
            )}
            <h1 className="font-display text-lg font-bold mb-1">
              {app ? `Connect ${app.name} to your AskBiz account?` : 'Connect this app to your AskBiz account?'}
            </h1>
            <p className="text-ink-300 text-sm mb-4">
              {app ? app.name : 'This app'} is requesting the following access to your account. Untick anything you
              don&rsquo;t want to grant — you can revoke everything at any time from your AskBiz settings.
            </p>
            <fieldset className="mb-6 space-y-2">
              <legend className="sr-only">Requested permissions</legend>
              {(connection.scopes && connection.scopes.length > 0 ? connection.scopes : ['read_inventory']).map(scope => (
                <label key={scope} className="flex items-start gap-2.5 text-sm text-ink-200 bg-ink-800/60 rounded-lg p-3">
                  <input type="checkbox" className="mt-0.5" checked={selectedScopes.includes(scope)} onChange={() => toggleScope(scope)} />
                  <span>{SCOPE_LABELS[scope] || scope}</span>
                </label>
              ))}
            </fieldset>
            <button onClick={() => respond(true)} disabled={busy || selectedScopes.length === 0}
              className={`w-full mb-2 py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 ${focusRing}`}>
              {busy ? 'Please wait…' : selectedScopes.length === 0 ? 'Select at least one permission' : 'Allow access'}
            </button>
            <button onClick={() => respond(false)} disabled={busy}
              className={`w-full py-3 rounded-lg border border-ink-600 text-ink-300 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`}>
              Decline
            </button>
          </>
        )}

        {!loading && connection && connection.status === 'active' && (
          <>
            <p className="text-ink-300 text-sm mb-2">Connected. This app has the following access:</p>
            <ul className="text-ink-300 text-xs mb-4 list-disc list-inside space-y-0.5">
              {(connection.scopes || []).map(scope => <li key={scope}>{SCOPE_LABELS[scope] || scope}</li>)}
            </ul>
            <button onClick={() => respond(false)} disabled={busy}
              className={`w-full py-3 rounded-lg border border-ink-600 text-ink-300 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`}>
              {busy ? 'Please wait…' : 'Revoke access'}
            </button>
          </>
        )}

        {!loading && connection && connection.status === 'revoked' && (
          <p className="text-ink-300 text-sm">Access has been revoked.</p>
        )}
      </div>
    </div>
  )
}
