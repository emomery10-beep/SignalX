'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

type Connection = {
  id: string
  merchant_email: string
  status: string
}

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
        .select('id, merchant_email, status')
        .eq('confirmation_token', params.token)
        .single()

      if (cancelled) return
      if (fetchError || !data) setError('Connection request not found, or not addressed to your account.')
      else setConnection(data)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [params.token, router, supabase])

  const respond = async (approve: boolean) => {
    setBusy(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const update = approve
      ? { status: 'active', merchant_user_id: user.id, approved_at: new Date().toISOString() }
      : { status: 'revoked', revoked_at: new Date().toISOString() }

    const { error: updateError } = await supabase
      .from('developer_connections')
      .update(update)
      .eq('confirmation_token', params.token)

    if (updateError) { setError(updateError.message); setBusy(false); return }
    setConnection(c => c ? { ...c, status: update.status } : c)
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl p-6">
        {loading && <p className="text-ink-300 text-sm">Loading…</p>}

        {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && connection && connection.status === 'pending' && (
          <>
            <h1 className="font-display text-lg font-bold mb-1">Connect this app to your AskBiz account?</h1>
            <p className="text-ink-300 text-sm mb-6">
              This app will be able to access your inventory and business data through the AskBiz API until you revoke access.
            </p>
            <button onClick={() => respond(true)} disabled={busy}
              className={`w-full mb-2 py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 ${focusRing}`}>
              {busy ? 'Please wait…' : 'Allow access'}
            </button>
            <button onClick={() => respond(false)} disabled={busy}
              className={`w-full py-3 rounded-lg border border-ink-600 text-ink-300 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`}>
              Decline
            </button>
          </>
        )}

        {!loading && connection && connection.status === 'active' && (
          <>
            <p className="text-ink-300 text-sm mb-4">Connected. This app now has access to your account.</p>
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
