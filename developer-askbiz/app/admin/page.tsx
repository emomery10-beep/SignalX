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
  { id: 'verifications', label: 'Verifications' },
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
type AdminVerificationDocument = { id: string; kind: string; uploaded_at: string; url: string | null }
type AdminVerification = {
  id: string; user_id: string; user_email: string | null; status: 'pending' | 'approved' | 'rejected'
  legal_name: string | null; registration_number: string | null; tax_id: string | null; address: string | null
  submitted_at: string | null; reviewed_at: string | null; rejection_reason: string | null
  documents: AdminVerificationDocument[]
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
      {active === 'verifications' && <VerificationsTab />}
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

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-600/20 text-amber-300',
  approved: 'bg-signal-600/20 text-signal-300',
  rejected: 'bg-red-600/20 text-red-400',
}

function VerificationsTab() {
  const [rows, setRows] = useState<AdminVerification[] | null>(null)
  const [error, setError] = useState('')
  const [reviewing, setReviewing] = useState<AdminVerification | null>(null)

  const load = () => {
    fetch('/api/admin/verifications').then(r => r.json()).then(d => {
      if (d.error) setError(d.error); else setRows(d.verifications)
    })
  }
  useEffect(load, [])

  return (
    <div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {!rows && !error && <p className="text-ink-300 text-sm">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-ink-300 text-sm">No verification submissions yet.</p>}
      {rows && rows.length > 0 && (
        <div className="border border-ink-700 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-700 text-ink-300 text-left bg-ink-900">
                <th className="px-3 py-2.5 font-medium">Business</th>
                <th className="px-3 py-2.5 font-medium">Owner</th>
                <th className="px-3 py-2.5 font-medium">Documents</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Submitted</th>
                <th className="px-3 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(v => (
                <tr key={v.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2.5 text-ink-100">{v.legal_name || '—'}</td>
                  <td className="px-3 py-2.5 text-ink-200">{v.user_email || v.user_id.slice(0, 8)}</td>
                  <td className="px-3 py-2.5 text-ink-300">{v.documents.length}/4</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full ${STATUS_BADGE[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-300">{v.submitted_at ? new Date(v.submitted_at).toLocaleDateString() : '—'}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setReviewing(v)} className={ghostBtnCls}>Review…</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReviewModal verification={reviewing} onClose={() => setReviewing(null)} onReviewed={load} />
    </div>
  )
}

const DOCUMENT_LABEL: Record<string, string> = {
  registration_certificate: 'Registration certificate',
  proof_of_address: 'Proof of address',
  owner_id: "Owner's ID",
  ownership_disclosure: 'Ownership disclosure',
}

function ReviewModal({ verification, onClose, onReviewed }: { verification: AdminVerification | null; onClose: () => void; onReviewed: () => void }) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [saving, setSaving] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { if (verification) { setRejectionReason(''); setError('') } }, [verification])

  const submit = async (action: 'approve' | 'reject') => {
    if (!verification) return
    if (action === 'reject' && !rejectionReason.trim()) {
      setError('A rejection reason is required'); return
    }
    setSaving(action); setError('')
    try {
      const body: Record<string, unknown> = { action, verification_id: verification.id }
      if (action === 'reject') body.rejection_reason = rejectionReason
      const res = await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Could not ${action}`)
      onReviewed(); onClose()
    } catch (e: any) {
      setError(e.message || `Could not ${action}`)
    } finally {
      setSaving(null)
    }
  }

  return (
    <Modal open={verification !== null} onClose={onClose} title={`Review — ${verification?.legal_name || ''}`}>
      {verification && (
        <div className="space-y-4">
          <dl className="space-y-2 text-xs">
            <Row label="Owner" value={verification.user_email || verification.user_id} />
            <Row label="Registration number" value={verification.registration_number || '—'} />
            <Row label="Tax ID" value={verification.tax_id || '—'} />
            <Row label="Address" value={verification.address || '—'} />
          </dl>

          <div>
            <p className={labelCls}>Documents ({verification.documents.length}/4)</p>
            {verification.documents.length === 0 && <p className="text-ink-500 text-xs">None uploaded yet.</p>}
            <ul className="space-y-1">
              {verification.documents.map(d => (
                <li key={d.id} className="text-xs">
                  {d.url ? (
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-signal-300 underline underline-offset-2">
                      {DOCUMENT_LABEL[d.kind] || d.kind}
                    </a>
                  ) : (
                    <span className="text-ink-400">{DOCUMENT_LABEL[d.kind] || d.kind} (link unavailable)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {verification.status !== 'pending' && (
            <p className="text-ink-400 text-xs">
              Already {verification.status}{verification.rejection_reason ? ` — ${verification.rejection_reason}` : ''}. Approving or rejecting again overrides this.
            </p>
          )}

          <div>
            <label htmlFor="rejection-reason" className={labelCls}>Rejection reason (required to reject)</label>
            <input id="rejection-reason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className={inputCls} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button onClick={() => submit('approve')} disabled={saving !== null} className={primaryBtnCls}>
              {saving === 'approve' ? 'Approving…' : 'Approve'}
            </button>
            <button onClick={() => submit('reject')} disabled={saving !== null}
              className={`py-2.5 px-4 rounded-lg border border-red-800 text-red-400 text-sm font-medium hover:bg-red-950/40 transition-colors disabled:opacity-50 ${focusRing}`}>
              {saving === 'reject' ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-800 pb-2 last:border-0 last:pb-0">
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-ink-100 font-medium text-right">{value}</dd>
    </div>
  )
}
