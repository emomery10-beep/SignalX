'use client'
import { useEffect, useState } from 'react'

type ApiKey = {
  id: string
  name: string
  key: string
  plan: string
  is_active: boolean
  requests_month: number
  request_limit_month: number
  credit_balance_cents?: number
  created_at: string
}

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`
const ghostBtnCls = `py-2 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`

export default function DashboardKeysPage() {
  const [keys, setKeys] = useState<ApiKey[] | null>(null)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyMode, setNewKeyMode] = useState<'generic' | 'account'>('account')
  const [creating, setCreating] = useState(false)
  // Shown exactly once after creation — the full key value never comes
  // back from the API again, same "copy it now" pattern as everywhere
  // else this codebase handles secrets (webhook secrets, Stripe keys).
  const [revealedKey, setRevealedKey] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/dashboard-data')
    const data = await res.json()
    if (data.error) setError(data.error)
    else { setKeys(data.keys); setError('') }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    setCreating(true); setError('')
    try {
      const res = await fetch('/api/dashboard-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'My API Key', mode: newKeyMode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not create key')
      setRevealedKey(data.key.key)
      setNewKeyName('')
      setShowCreate(false)
      await load()
    } catch (e: any) {
      setError(e.message || 'Could not create key')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    setError('')
    const res = await fetch('/api/dashboard-keys', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !is_active }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Could not update key'); return }
    await load()
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this key? Any app using it will stop working immediately.')) return
    setError('')
    const res = await fetch('/api/dashboard-keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Could not revoke key'); return }
    await load()
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">API keys</h1>
          <p className="text-ink-300 text-sm max-w-lg">
            Manage keys for the AskBiz API — vision recognition, WhatsApp send, inventory, and purchase orders.
          </p>
        </div>
        <button onClick={() => setShowCreate(s => !s)} className={primaryBtnCls}>
          {showCreate ? 'Cancel' : 'New key'}
        </button>
      </div>

      {revealedKey && (
        <div className="border border-signal-600 bg-signal-600/10 rounded-xl p-4 mb-6">
          <p className="text-signal-300 text-xs font-medium mb-2">Copy this key now — it will not be shown again.</p>
          <code className="text-ink-50 text-sm break-all">{revealedKey}</code>
          <div className="mt-3">
            <button onClick={() => { navigator.clipboard.writeText(revealedKey); setRevealedKey(null) }} className={ghostBtnCls}>
              Copy &amp; dismiss
            </button>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="border border-ink-700 rounded-xl p-5 mb-6 bg-ink-900">
          <div className="space-y-3 max-w-sm">
            <div>
              <label htmlFor="key-name" className={labelCls}>Key name</label>
              <input id="key-name" type="text" placeholder="My API Key" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} className={inputCls} />
            </div>
            <fieldset>
              <legend className={labelCls}>Mode</legend>
              <div className="flex gap-4 text-sm text-ink-200">
                <label className="flex items-center gap-2">
                  <input type="radio" name="mode" checked={newKeyMode === 'account'} onChange={() => setNewKeyMode('account')} />
                  Account — acts on my own AskBiz data
                </label>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-ink-200">
                <input type="radio" name="mode" checked={newKeyMode === 'generic'} onChange={() => setNewKeyMode('generic')} />
                <label>Generic — no catalog access, raw API only</label>
              </div>
            </fieldset>
            <button onClick={handleCreate} disabled={creating} className={primaryBtnCls}>
              {creating ? 'Creating…' : 'Create key'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!keys && !error && <p className="text-ink-300 text-sm">Loading…</p>}

      {keys && keys.length === 0 && (
        <div className="border border-ink-700 rounded-xl p-6 text-center">
          <p className="text-ink-300 text-sm">No API keys yet — create one above to get started.</p>
        </div>
      )}

      {keys && keys.length > 0 && (
        <div className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="font-medium text-sm">{k.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${k.is_active ? 'bg-signal-600/20 text-signal-300' : 'bg-ink-800 text-ink-200'}`}>
                  {k.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <code className="text-xs text-ink-300 block mb-3">{k.key}</code>
              <div className="flex gap-4 text-xs text-ink-300 mb-3 flex-wrap">
                <span>Plan: {k.plan}</span>
                <span>
                  Usage: {k.requests_month}
                  {k.request_limit_month >= 0 ? ` / ${k.request_limit_month}` : ' / unlimited'} this month
                </span>
                {typeof k.credit_balance_cents === 'number' && (
                  <span>Credit balance: £{(k.credit_balance_cents / 100).toFixed(2)}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(k.id, k.is_active)} className={ghostBtnCls}>
                  {k.is_active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleRevoke(k.id)} className={ghostBtnCls}>
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
