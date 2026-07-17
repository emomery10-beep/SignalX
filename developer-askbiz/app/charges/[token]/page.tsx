'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

type Charge = {
  id: string
  merchant_email: string
  amount_cents: number
  currency: string
  description: string
  status: string
}

// Merchant-facing confirmation screen for the Phase 3 billing-on-behalf-of
// flow (see app/api/v1/charges/route.ts on the main app for the developer
// side). Fetches the charge directly via the Supabase client — RLS
// (developer_charges_creator_select) already scopes it to the logged-in
// merchant's own email, no service-role proxy needed for reads.
export default function ChargeConfirmationPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [charge, setCharge] = useState<Charge | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/signin?next=/charges/${params.token}`); return }

      const { data, error: fetchError } = await supabase
        .from('developer_charges')
        .select('id, merchant_email, amount_cents, currency, description, status')
        .eq('confirmation_token', params.token)
        .single()

      if (cancelled) return
      if (fetchError || !data) setError('Charge not found, or not addressed to your account.')
      else setCharge(data)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [params.token, router, supabase])

  const handleApprove = async () => {
    setBusy(true); setError('')
    try {
      const res = await fetch(`/api/charges/${params.token}/approve`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not start checkout')
      window.location.href = data.checkout_url
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setBusy(false)
    }
  }

  const handleDecline = async () => {
    setBusy(true); setError('')
    const { error: updateError } = await supabase
      .from('developer_charges')
      .update({ status: 'declined' })
      .eq('confirmation_token', params.token)
    if (updateError) { setError(updateError.message); setBusy(false); return }
    setCharge(c => c ? { ...c, status: 'declined' } : c)
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl p-6">
        {loading && <p className="text-ink-300 text-sm">Loading…</p>}

        {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && charge && charge.status === 'pending' && (
          <>
            <h1 className="font-display text-lg font-bold mb-1">Approve this charge?</h1>
            <p className="text-ink-300 text-sm mb-4">{charge.description}</p>
            <p className="text-2xl font-bold mb-6">
              {(charge.amount_cents / 100).toFixed(2)} {charge.currency.toUpperCase()}
            </p>
            {/* py-3 (not py-2.5) + focus-visible ring — audit found ~40px
                touch targets platform-wide (below the 44px minimum) and
                weak/default-only focus indication. */}
            <button onClick={handleApprove} disabled={busy}
              className={`w-full mb-2 py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 ${focusRing}`}>
              {busy ? 'Please wait…' : 'Approve & pay'}
            </button>
            <button onClick={handleDecline} disabled={busy}
              className={`w-full py-3 rounded-lg border border-ink-600 text-ink-300 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`}>
              Decline
            </button>
          </>
        )}

        {!loading && charge && charge.status !== 'pending' && (
          <p className="text-ink-300 text-sm">This charge is {charge.status}.</p>
        )}
      </div>
    </div>
  )
}
