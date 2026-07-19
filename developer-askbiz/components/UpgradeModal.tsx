'use client'
import { useEffect, useState } from 'react'
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Modal from './Modal'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const primaryBtnCls = `w-full py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`

const PLAN_LABEL: Record<string, string> = { growth: 'Growth', business: 'Business' }

// Loaded once, module-level — loadStripe() memoizes internally too, but
// this avoids re-reading the env var / re-triggering the dynamic import on
// every modal open.
let stripePromise: Promise<StripeJs | null> | null = null
function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    stripePromise = key ? loadStripe(key) : Promise.resolve(null)
  }
  return stripePromise
}

type Phase = 'loading' | 'ready' | 'no_payment_due' | 'confirming' | 'reconciling' | 'done' | 'error' | 'not_configured'

export default function UpgradeModal({
  open,
  onClose,
  targetPlan,
  onUpgraded,
}: {
  open: boolean
  onClose: () => void
  targetPlan: 'growth' | 'business'
  onUpgraded?: () => void
}) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setPhase('loading'); setClientSecret(null); setError('')

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setPhase('not_configured')
      return
    }

    fetch('/api/dashboard-billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkout_embedded', plan: targetPlan, annual: false }),
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Could not start upgrade')
        if (!data.requires_payment) { setPhase('no_payment_due'); return }
        setClientSecret(data.client_secret)
        setPhase('ready')
      })
      .catch(e => { setError(e.message || 'Could not start upgrade'); setPhase('error') })
  }, [open, targetPlan])

  // No card needed (trial, or a $0 proration) — the webhook still does the
  // real write, so still reconcile before declaring success rather than
  // trusting this response alone.
  useEffect(() => {
    if (phase !== 'no_payment_due') return
    setPhase('reconciling')
    pollForPlanChange(targetPlan).then(caughtUp => setPhase(caughtUp ? 'done' : 'done'))
  }, [phase, targetPlan])

  useEffect(() => {
    if (phase === 'done') onUpgraded?.()
  }, [phase, onUpgraded])

  return (
    <Modal open={open} onClose={onClose} title={`Upgrade to ${PLAN_LABEL[targetPlan]}`}>
      {phase === 'loading' && <p className="text-ink-300 text-sm">Preparing checkout…</p>}

      {phase === 'not_configured' && (
        <div>
          <p className="text-ink-300 text-sm mb-4">
            Card payments aren&rsquo;t set up yet on this environment. Contact{' '}
            <a href="mailto:hello@askbiz.co" className="text-signal-300 underline underline-offset-2">hello@askbiz.co</a>{' '}
            to upgrade for now.
          </p>
          <button onClick={onClose} className={primaryBtnCls}>Close</button>
        </div>
      )}

      {phase === 'error' && (
        <div>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button onClick={onClose} className={primaryBtnCls}>Close</button>
        </div>
      )}

      {(phase === 'reconciling') && (
        <p className="text-ink-300 text-sm">Finalizing your upgrade…</p>
      )}

      {phase === 'done' && (
        <div>
          <p className="text-signal-300 text-sm font-medium mb-4">
            You&rsquo;re now on the {PLAN_LABEL[targetPlan]} plan — new limits apply to every key on your account immediately.
          </p>
          <button onClick={onClose} className={primaryBtnCls}>Done</button>
        </div>
      )}

      {phase === 'ready' && clientSecret && (
        <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#12b8af' } } }}>
          <PaymentForm
            targetPlan={targetPlan}
            onConfirming={() => setPhase('confirming')}
            onConfirmed={() => { setPhase('reconciling'); pollForPlanChange(targetPlan).then(() => setPhase('done')) }}
            onError={(msg) => { setError(msg); setPhase('error') }}
          />
        </Elements>
      )}

      {phase === 'confirming' && <p className="text-ink-300 text-sm mt-4">Confirming payment…</p>}
    </Modal>
  )
}

function PaymentForm({
  targetPlan,
  onConfirming,
  onConfirmed,
  onError,
}: {
  targetPlan: string
  onConfirming: () => void
  onConfirmed: () => void
  onError: (msg: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setSubmitting(true)
    onConfirming()

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      setSubmitting(false)
      onError(error.message || 'Payment failed — check your card details and try again.')
      return
    }

    if (paymentIntent && (paymentIntent.status === 'requires_action' || paymentIntent.status === 'processing')) {
      setSubmitting(false)
      onError('Your bank needs extra verification for this card. Please try again or use a different card.')
      return
    }

    onConfirmed()
  }

  return (
    <div>
      <PaymentElement />
      <button onClick={handleSubmit} disabled={submitting || !stripe} className={`${primaryBtnCls} mt-5`}>
        {submitting ? 'Confirming…' : `Confirm and upgrade to ${PLAN_LABEL[targetPlan] || targetPlan}`}
      </button>
      <p className="text-ink-500 text-xs mt-3 text-center">Your card is processed directly by Stripe — it never touches AskBiz&rsquo;s servers.</p>
    </div>
  )
}

// After confirming payment (or when no payment was due at all), the plan
// write itself happens in the Stripe webhook, not this request/response —
// poll briefly rather than trusting client-side state, so the UI never
// claims "upgraded" before it's actually true. Absorbs both orderings (webhook
// lands first or last) since the first poll just finds it already done.
async function pollForPlanChange(targetPlan: string, timeoutMs = 15000, intervalMs = 1500): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch('/api/dashboard-data')
      const data = await res.json()
      const keys: { plan?: string }[] = data.keys || []
      if (keys.some(k => k.plan === targetPlan)) return true
    } catch {
      // transient network error while polling — keep trying until the deadline
    }
    await new Promise(r => setTimeout(r, intervalMs))
  }
  return false
}
