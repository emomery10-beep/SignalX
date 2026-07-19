'use client'
import { useEffect, useState } from 'react'
import Tabs from '@/components/Tabs'
import Modal from '@/components/Modal'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-2.5 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-2.5 px-4 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 ${focusRing}`
const ghostBtnCls = `py-1.5 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors ${focusRing}`

const TABS = [
  { id: 'keys', label: 'Developers & keys' },
  { id: 'connections', label: 'Connections' },
  { id: 'charges', label: 'Charges' },
]

type AdminKey = {
  id: string; name: string; user_id: string; user_email: string | null
  plan: string; mode: string; is_active: boolean
  requests_month: number; request_limit_month: number
  credit_balance_cents: number; created_at: string; last_used_at: string | null
}
type AdminConnection = {
  id: string; key_id: string; merchant_email: string; status: string
  scopes: string[]; created_at: string; approved_at: string | null; revoked_at: string | null
}
type AdminCharge = {
  id: string; key_id: string; merchant_email: string; amount_cents: number
  currency: string; status: string; created_at: string
}

export default function AdminPage() {
  const [active, setActive] = useState('keys')
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Developer platform admin</h1>
      <p className="text-ink-300 text-sm mb-6">Oversight and support actions across every developer account.</p>
      <div className="mb-6"><Tabs items={TABS} active={active} onChange={setActive} /></div>
      {active === 'keys' && <KeysTab />}
      {active === 'connections' && <ConnectionsTab />}
      {active === 'charges' && <ChargesTab />}
    </div>
  )
}

function KeysTab() {
  const [keys, setKeys] = useState<AdminKey[] | null>(null)
  const [error, setError] = useState('')
  const [grantFor, setGrantFor] = useState<AdminKey | null>(null)

  const load = () => {
    fetch('/api/admin/keys').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setKeys(d.keys)
    })
  }
  useEffect(load, [])

  return (
    <div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {!keys && !error && <p className="text-ink-300 text-sm">Loading…</p>}
      {keys && keys.length === 0 && <p className="text-ink-300 text-sm">No keys on the platform yet.</p>}
      {keys && keys.length > 0 && (
        <div className="border border-ink-700 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-700 text-ink-300 text-left bg-ink-900">
                <th className="px-3 py-2.5 font-medium">Owner</th>
                <th className="px-3 py-2.5 font-medium">Key</th>
                <th className="px-3 py-2.5 font-medium">Plan</th>
                <th className="px-3 py-2.5 font-medium">Mode</th>
                <th className="px-3 py-2.5 font-medium">Usage</th>
                <th className="px-3 py-2.5 font-medium">Balance</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2.5 text-ink-200">{k.user_email || k.user_id.slice(0, 8)}</td>
                  <td className="px-3 py-2.5 text-ink-100">{k.name}</td>
                  <td className="px-3 py-2.5 text-ink-200 capitalize">{k.plan}</td>
                  <td className="px-3 py-2.5 text-ink-300">{k.mode}</td>
                  <td className="px-3 py-2.5 text-ink-300">{k.requests_month}/{k.request_limit_month === -1 ? '∞' : k.request_limit_month}</td>
                  <td className="px-3 py-2.5 text-ink-300">£{(k.credit_balance_cents / 100).toFixed(2)}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full ${k.is_active ? 'bg-signal-600/20 text-signal-300' : 'bg-red-600/20 text-red-400'}`}>
                      {k.is_active ? 'active' : 'disabled'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setGrantFor(k)} className={ghostBtnCls}>Grant…</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GrantModal keyRow={grantFor} onClose={() => setGrantFor(null)} onGranted={load} />
    </div>
  )
}

function GrantModal({ keyRow, onClose, onGranted }: { keyRow: AdminKey | null; onClose: () => void; onGranted: () => void }) {
  const [plan, setPlan] = useState('')
  const [creditCents, setCreditCents] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (keyRow) { setPlan(''); setCreditCents(''); setError('') } }, [keyRow])

  const submit = async () => {
    if (!keyRow) return
    setSaving(true); setError('')
    try {
      const body: Record<string, unknown> = { action: 'grant', key_id: keyRow.id }
      if (plan) body.plan = plan
      if (creditCents) body.credit_cents = Math.round(parseFloat(creditCents) * 100)
      if (!plan && !creditCents) throw new Error('Set a plan, a credit amount, or both')

      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Grant failed')
      onGranted(); onClose()
    } catch (e: any) {
      setError(e.message || 'Grant failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={keyRow !== null} onClose={onClose} title={`Grant — ${keyRow?.name || ''}`}>
      <p className="text-ink-400 text-xs mb-4">
        A manual override for support cases — no payment behind it. Recorded honestly (provider: &ldquo;admin&rdquo;)
        in the account&rsquo;s own billing history, not disguised as a real top-up.
      </p>
      <div className="space-y-3">
        <div>
          <label htmlFor="grant-plan" className={labelCls}>Set plan (optional)</label>
          <select id="grant-plan" value={plan} onChange={e => setPlan(e.target.value)} className={inputCls}>
            <option value="">No change</option>
            <option value="free">free</option>
            <option value="growth">growth</option>
            <option value="business">business</option>
          </select>
        </div>
        <div>
          <label htmlFor="grant-credit" className={labelCls}>Grant credit — £ (optional)</label>
          <input id="grant-credit" type="number" min="0" step="0.01" value={creditCents}
            onChange={e => setCreditCents(e.target.value)} placeholder="0.00" className={inputCls} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={submit} disabled={saving} className={primaryBtnCls}>{saving ? 'Applying…' : 'Apply'}</button>
      </div>
    </Modal>
  )
}

function ConnectionsTab() {
  const [rows, setRows] = useState<AdminConnection[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/connections').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setRows(d.connections)
    })
  }, [])

  return (
    <div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {!rows && !error && <p className="text-ink-300 text-sm">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-ink-300 text-sm">No connections yet.</p>}
      {rows && rows.length > 0 && (
        <div className="border border-ink-700 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-700 text-ink-300 text-left bg-ink-900">
                <th className="px-3 py-2.5 font-medium">Merchant</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Scopes</th>
                <th className="px-3 py-2.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2.5 text-ink-200">{c.merchant_email}</td>
                  <td className="px-3 py-2.5 text-ink-300">{c.status}</td>
                  <td className="px-3 py-2.5 text-ink-300">{(c.scopes || []).join(', ') || '—'}</td>
                  <td className="px-3 py-2.5 text-ink-300">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ChargesTab() {
  const [rows, setRows] = useState<AdminCharge[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/charges').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setRows(d.charges)
    })
  }, [])

  return (
    <div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {!rows && !error && <p className="text-ink-300 text-sm">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-ink-300 text-sm">No charges yet.</p>}
      {rows && rows.length > 0 && (
        <div className="border border-ink-700 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-700 text-ink-300 text-left bg-ink-900">
                <th className="px-3 py-2.5 font-medium">Merchant</th>
                <th className="px-3 py-2.5 font-medium">Amount</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2.5 text-ink-200">{c.merchant_email}</td>
                  <td className="px-3 py-2.5 text-ink-100">{(c.amount_cents / 100).toFixed(2)} {c.currency?.toUpperCase()}</td>
                  <td className="px-3 py-2.5 text-ink-300">{c.status}</td>
                  <td className="px-3 py-2.5 text-ink-300">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
