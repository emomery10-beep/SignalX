'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Tabs from '@/components/Tabs'
import UpgradeModal from '@/components/UpgradeModal'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`
const ghostBtnCls = `py-2 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`
const dangerBtnCls = `py-2 px-4 rounded-md border border-red-800 text-red-400 text-xs font-medium hover:bg-red-950/40 transition-colors disabled:opacity-50 ${focusRing}`
const cardCls = 'border border-ink-700 rounded-xl p-5 bg-ink-900'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
  { id: 'api', label: 'API preferences' },
  { id: 'danger', label: 'Danger zone' },
]

const PLAN_LABEL: Record<string, string> = { free: 'Free', growth: 'Growth', business: 'Business' }
const TOPUP_BUNDLES = [
  { cents: 500, label: '£5' },
  { cents: 2000, label: '£20' },
  { cents: 10000, label: '£100' },
]

export default function SettingsPage() {
  const [active, setActive] = useState('profile')

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Settings</h1>
      <p className="text-ink-300 text-sm mb-8">Your profile, security, notifications, billing, and API defaults.</p>

      <div className="grid md:grid-cols-[180px_1fr] gap-6 md:gap-10">
        <Tabs items={TABS} active={active} onChange={setActive} />
        <div className="min-w-0">
          {active === 'profile' && <ProfileTab />}
          {active === 'security' && <SecurityTab />}
          {active === 'notifications' && <NotificationsTab />}
          {active === 'billing' && <BillingTab />}
          {active === 'api' && <ApiPreferencesTab />}
          {active === 'danger' && <DangerZoneTab />}
        </div>
      </div>
    </div>
  )
}

// ── Profile ──────────────────────────────────────────────────────────────────
function ProfileTab() {
  const [profile, setProfile] = useState<Record<string, any> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/dashboard-profile').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setProfile(d)
    })
  }, [])

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1">Profile</h2>
      <p className="text-ink-400 text-xs mb-5">
        Read-only here — this is the same identity as your main AskBiz account. Edit it at{' '}
        <a href="https://askbiz.co/settings" className="text-signal-300 underline underline-offset-2">askbiz.co/settings</a>.
      </p>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!profile && !error && <p className="text-ink-300 text-sm">Loading…</p>}
      {profile && (
        <dl className="space-y-3 text-sm">
          <Row label="Name" value={[profile.first_name, profile.last_name].filter(Boolean).join(' ') || '—'} />
          <Row label="Business" value={profile.business_name || '—'} />
          <Row label="Phone" value={profile.phone || profile.whatsapp_number || '—'} />
          <Row label="Country" value={profile.registration_country || profile.region || '—'} />
        </dl>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-800 pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-ink-100 font-medium">{value}</dd>
    </div>
  )
}

// ── Security ─────────────────────────────────────────────────────────────────
function SecurityTab() {
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError(''); setSuccess(false)
    if (!/^\d{4}$/.test(pin)) { setError('PIN must be exactly 4 digits'); return }
    if (pin !== pinConfirm) { setError('PINs do not match'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard-change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not change PIN')
      setSuccess(true); setPin(''); setPinConfirm('')
    } catch (e: any) {
      setError(e.message || 'Could not change PIN')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1">Security</h2>
      <p className="text-ink-400 text-xs mb-5">
        Change the 4-digit PIN used to sign in — applies to your whole AskBiz account, same as on the main app.
      </p>
      <div className="space-y-3 max-w-xs">
        <div>
          <label htmlFor="new-pin" className={labelCls}>New PIN</label>
          <input id="new-pin" type="password" inputMode="numeric" maxLength={4} value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))} className={inputCls} />
        </div>
        <div>
          <label htmlFor="confirm-pin" className={labelCls}>Confirm new PIN</label>
          <input id="confirm-pin" type="password" inputMode="numeric" maxLength={4} value={pinConfirm}
            onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ''))} className={inputCls} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-signal-300 text-sm">PIN updated.</p>}
        <button onClick={handleSubmit} disabled={saving} className={primaryBtnCls}>
          {saving ? 'Saving…' : 'Update PIN'}
        </button>
      </div>
    </div>
  )
}

// ── Notifications ────────────────────────────────────────────────────────────
function NotificationsTab() {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/dashboard-profile').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setEnabled(d.notify_email_alerts ?? true)
    })
  }, [])

  const toggle = async () => {
    if (enabled === null) return
    const next = !enabled
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dashboard-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notify_email_alerts: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save')
      setEnabled(next)
    } catch (e: any) {
      setError(e.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1">Notifications</h2>
      <p className="text-ink-400 text-xs mb-5">
        This is an account-wide preference shared with the rest of AskBiz, not a developer-specific setting — there&rsquo;s
        no separate toggle yet for things like low-balance or webhook-failure emails specifically.
      </p>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input type="checkbox" checked={enabled ?? true} disabled={enabled === null || saving} onChange={toggle}
          className="w-4 h-4 accent-signal-500" />
        Email me account alerts
      </label>
    </div>
  )
}

// ── Billing ──────────────────────────────────────────────────────────────────
function BillingTab() {
  const [keys, setKeys] = useState<{ id: string; name: string; plan?: string; credit_balance_cents?: number }[] | null>(null)
  const [usage, setUsage] = useState<{ recent_transactions?: { type: string; amount_cents: number; endpoint: string | null; created_at: string }[] } | null>(null)
  const [error, setError] = useState('')
  const [toppingUp, setToppingUp] = useState<string | null>(null)
  const [upgradeTarget, setUpgradeTarget] = useState<'growth' | 'business' | null>(null)

  const load = () => {
    fetch('/api/dashboard-data').then(r => r.json()).then(data => {
      if (data.error) setError(data.error)
      else { setKeys(data.keys); setUsage(data.usage) }
    })
  }
  useEffect(load, [])

  const currentPlan = keys?.[0]?.plan || 'free'

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
    <div className="space-y-6">
      <div className={cardCls}>
        <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
          <div>
            <h2 className="font-display text-base font-bold">Plan</h2>
            <p className="text-ink-400 text-xs mt-1">
              Current plan: <span className="text-ink-100 font-medium">{PLAN_LABEL[currentPlan] || currentPlan}</span> — applies to every key on your account.
            </p>
          </div>
          <div className="flex gap-2">
            {currentPlan !== 'growth' && currentPlan !== 'business' && (
              <button onClick={() => setUpgradeTarget('growth')} className={ghostBtnCls}>Upgrade to Growth</button>
            )}
            {currentPlan !== 'business' && (
              <button onClick={() => setUpgradeTarget('business')} className={primaryBtnCls}>Upgrade to Business</button>
            )}
          </div>
        </div>
        <p className="text-ink-500 text-xs mt-3">
          See <Link href="/pricing" className="text-signal-300 underline underline-offset-2">/pricing</Link> for what each plan includes.
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div>
        <h2 className="font-display text-base font-bold mb-3">Credit balance &amp; top-ups</h2>
        {!keys && !error && <p className="text-ink-300 text-sm">Loading…</p>}
        {keys && keys.length === 0 && <p className="text-ink-300 text-sm">No keys yet — create one on the Keys page first.</p>}
        <div className="space-y-3">
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
                    disabled={toppingUp === `${k.id}-${b.cents}`} className={ghostBtnCls}>
                    {toppingUp === `${k.id}-${b.cents}` ? '…' : `Top up ${b.label}`}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-base font-bold mb-3">Billing history</h2>
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

      <UpgradeModal
        open={upgradeTarget !== null}
        onClose={() => setUpgradeTarget(null)}
        targetPlan={upgradeTarget || 'growth'}
        onUpgraded={load}
      />
    </div>
  )
}

// ── API preferences ──────────────────────────────────────────────────────────
const DEFAULT_MODE_KEY = 'askbiz_default_key_mode'

function ApiPreferencesTab() {
  const [mode, setMode] = useState<'generic' | 'account'>('account')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(DEFAULT_MODE_KEY) : null
    if (saved === 'generic' || saved === 'account') setMode(saved)
  }, [])

  const handleChange = (next: 'generic' | 'account') => {
    setMode(next)
    window.localStorage.setItem(DEFAULT_MODE_KEY, next)
  }

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1">API preferences</h2>
      <p className="text-ink-400 text-xs mb-5">
        Saved on this device only — pre-fills the mode selector when you create a new key on the{' '}
        <Link href="/dashboard" className="text-signal-300 underline underline-offset-2">Keys page</Link>, nothing more.
      </p>
      <fieldset className="space-y-2">
        <legend className={labelCls}>Default key mode for new keys</legend>
        <label className="flex items-start gap-2.5 text-sm cursor-pointer">
          <input type="radio" name="default-mode" checked={mode === 'account'} onChange={() => handleChange('account')} className="mt-1 accent-signal-500" />
          <span><span className="text-ink-100 font-medium">account</span> — <span className="text-ink-400">tied to your AskBiz business.</span></span>
        </label>
        <label className="flex items-start gap-2.5 text-sm cursor-pointer">
          <input type="radio" name="default-mode" checked={mode === 'generic'} onChange={() => handleChange('generic')} className="mt-1 accent-signal-500" />
          <span><span className="text-ink-100 font-medium">generic</span> — <span className="text-ink-400">not tied to a real AskBiz business.</span></span>
        </label>
      </fieldset>
    </div>
  )
}

// ── Danger zone ──────────────────────────────────────────────────────────────
function DangerZoneTab() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'requested' | 'cancelled'>('idle')
  const [scheduledFor, setScheduledFor] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard-account').then(r => r.json()).then(d => {
      if (d.deletionRequest) { setStatus('requested'); setScheduledFor(d.deletionRequest.scheduled_for) }
    }).catch(() => {})
  }, [])

  const requestDeletion = async () => {
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/dashboard-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_deletion' }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Could not request deletion')
      setStatus('requested'); setScheduledFor(data.scheduled_for); setConfirming(false)
    } catch (e: any) {
      setError(e.message || 'Could not request deletion'); setStatus('idle')
    }
  }

  const cancelDeletion = async () => {
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/dashboard-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel_deletion' }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Could not cancel deletion')
      setStatus('cancelled')
    } catch (e: any) {
      setError(e.message || 'Could not cancel deletion'); setStatus('requested')
    }
  }

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1 text-red-400">Danger zone</h2>
      <p className="text-ink-400 text-xs mb-5">
        This deletes your entire AskBiz account — POS, developer API keys, everything — not just developer platform access.
      </p>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {status === 'requested' && (
        <div className="border border-red-900 bg-red-950/30 rounded-lg p-4">
          <p className="text-red-300 text-sm mb-3">
            Deletion scheduled for{' '}
            <strong>{scheduledFor ? new Date(scheduledFor).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'a future date'}</strong>.
          </p>
          <button onClick={cancelDeletion} disabled={status !== 'requested'} className={ghostBtnCls}>Cancel deletion</button>
        </div>
      )}

      {status === 'cancelled' && (
        <p className="text-signal-300 text-sm">Deletion cancelled — your account is safe.</p>
      )}

      {(status === 'idle' || status === 'loading') && !confirming && (
        <button onClick={() => setConfirming(true)} disabled={status === 'loading'} className={dangerBtnCls}>
          Delete my account
        </button>
      )}

      {confirming && (
        <div className="border border-red-900 bg-red-950/30 rounded-lg p-4">
          <p className="text-red-300 text-sm mb-3">Are you sure? This affects your whole AskBiz account, not just this site.</p>
          <div className="flex gap-2">
            <button onClick={requestDeletion} disabled={status === 'loading'} className={dangerBtnCls}>
              {status === 'loading' ? 'Requesting…' : 'Yes, delete my account'}
            </button>
            <button onClick={() => setConfirming(false)} className={ghostBtnCls}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
