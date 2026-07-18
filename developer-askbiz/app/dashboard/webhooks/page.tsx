'use client'
import { useEffect, useState } from 'react'

type Webhook = {
  id: string
  url: string
  event_types: string[]
  is_active: boolean
  created_at: string
}

type Delivery = {
  id: string
  event_type: string
  status: string
  attempts: number
  last_attempted_at: string | null
  created_at: string
}

const statusColor: Record<string, string> = {
  pending: 'bg-ink-800 text-ink-200',
  delivered: 'bg-signal-600/20 text-signal-300',
  failed: 'bg-amber-600/20 text-amber-300',
  dead: 'bg-red-600/20 text-red-300',
}

const EVENT_TYPES = ['sale.created', 'purchase_order.received', 'stock.low'] as const

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`
const ghostBtnCls = `py-2 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[] | null>(null)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deliveries, setDeliveries] = useState<Record<string, Delivery[]>>({})
  const [testingId, setTestingId] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/dashboard-webhooks')
    const data = await res.json()
    if (data.error) setError(data.error)
    else { setWebhooks(data.webhooks); setError('') }
  }

  useEffect(() => { load() }, [])

  const toggleEvent = (evt: string) => {
    setSelectedEvents(cur => cur.includes(evt) ? cur.filter(e => e !== evt) : [...cur, evt])
  }

  const handleCreate = async () => {
    if (!url || selectedEvents.length === 0) { setError('URL and at least one event are required'); return }
    setCreating(true); setError('')
    try {
      const res = await fetch('/api/dashboard-webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, event_types: selectedEvents }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not create webhook')
      setRevealedSecret(data.webhook.secret)
      setUrl(''); setSelectedEvents([]); setShowCreate(false)
      await load()
    } catch (e: any) {
      setError(e.message || 'Could not create webhook')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    setError('')
    const res = await fetch('/api/dashboard-webhooks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !is_active }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Could not update webhook'); return }
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webhook? Events will stop being delivered immediately.')) return
    setError('')
    const res = await fetch('/api/dashboard-webhooks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Could not delete webhook'); return }
    await load()
  }

  const loadDeliveries = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard-webhooks/${id}/deliveries`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not load deliveries')
      setDeliveries(cur => ({ ...cur, [id]: data.deliveries }))
    } catch {
      setDeliveries(cur => ({ ...cur, [id]: [] }))
      setError('Could not load deliveries — try again in a moment.')
    }
  }

  const handleToggleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    await loadDeliveries(id)
  }

  const handleTest = async (id: string) => {
    setTestingId(id); setError('')
    try {
      const res = await fetch(`/api/dashboard-webhooks/${id}/test`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Could not send test event')
      }
      if (expandedId !== id) { setExpandedId(id) }
      await loadDeliveries(id)
    } catch (e: any) {
      setError(e.message || 'Could not send test event')
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Webhooks</h1>
          <p className="text-ink-300 text-sm max-w-lg">
            Get notified when a connected merchant&rsquo;s sale, purchase order, or stock level changes. Delivered within ~5 minutes, signed with your webhook secret.
          </p>
        </div>
        <button onClick={() => setShowCreate(s => !s)} className={primaryBtnCls}>
          {showCreate ? 'Cancel' : 'New webhook'}
        </button>
      </div>

      {revealedSecret && (
        <div className="border border-signal-600 bg-signal-600/10 rounded-xl p-4 mb-6">
          <p className="text-signal-300 text-xs font-medium mb-2">Copy this secret now — used to verify the x-askbiz-signature header. It will not be shown again.</p>
          <code className="text-ink-50 text-sm break-all">{revealedSecret}</code>
          <div className="mt-3">
            <button onClick={() => { navigator.clipboard.writeText(revealedSecret); setRevealedSecret(null) }} className={ghostBtnCls}>
              Copy &amp; dismiss
            </button>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="border border-ink-700 rounded-xl p-5 mb-6 bg-ink-900">
          <div className="space-y-3 max-w-sm">
            <div>
              <label htmlFor="webhook-url" className={labelCls}>Endpoint URL</label>
              <input id="webhook-url" type="url" placeholder="https://your-app.com/webhooks/askbiz" value={url} onChange={e => setUrl(e.target.value)} className={inputCls} />
            </div>
            <fieldset>
              <legend className={labelCls}>Events</legend>
              <div className="space-y-2">
                {EVENT_TYPES.map(evt => (
                  <label key={evt} className="flex items-center gap-2 text-sm text-ink-200">
                    <input type="checkbox" checked={selectedEvents.includes(evt)} onChange={() => toggleEvent(evt)} />
                    {evt}
                  </label>
                ))}
              </div>
            </fieldset>
            <button onClick={handleCreate} disabled={creating} className={primaryBtnCls}>
              {creating ? 'Creating…' : 'Create webhook'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!webhooks && !error && <p className="text-ink-300 text-sm">Loading…</p>}

      {webhooks && webhooks.length === 0 && (
        <div className="border border-ink-700 rounded-xl p-6 text-center">
          <p className="text-ink-300 text-sm">No webhooks yet — create one above to get started.</p>
        </div>
      )}

      {webhooks && webhooks.length > 0 && (
        <div className="space-y-3">
          {webhooks.map(w => (
            <div key={w.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <code className="text-sm break-all">{w.url}</code>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${w.is_active ? 'bg-signal-600/20 text-signal-300' : 'bg-ink-800 text-ink-200'}`}>
                  {w.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-ink-300 text-xs mb-3">{w.event_types.join(', ')}</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleToggle(w.id, w.is_active)} className={ghostBtnCls}>
                  {w.is_active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleTest(w.id)} disabled={testingId === w.id} className={ghostBtnCls}>
                  {testingId === w.id ? 'Sending…' : 'Send test event'}
                </button>
                <button onClick={() => handleToggleExpand(w.id)} className={ghostBtnCls}>
                  {expandedId === w.id ? 'Hide deliveries' : 'View deliveries'}
                </button>
                <button onClick={() => handleDelete(w.id)} className={ghostBtnCls}>
                  Delete
                </button>
              </div>

              {expandedId === w.id && (
                <div className="mt-4 pt-4 border-t border-ink-800">
                  {!deliveries[w.id] && <p className="text-ink-300 text-xs">Loading deliveries…</p>}
                  {deliveries[w.id] && deliveries[w.id].length === 0 && (
                    <p className="text-ink-300 text-xs">No deliveries yet. Send a test event to see one here.</p>
                  )}
                  {deliveries[w.id] && deliveries[w.id].length > 0 && (
                    <div className="space-y-1.5">
                      {deliveries[w.id].map(d => (
                        <div key={d.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-ink-200">{d.event_type}</span>
                          <span className="text-ink-400">{d.attempts} attempt{d.attempts === 1 ? '' : 's'}</span>
                          <span className="text-ink-400">{new Date(d.created_at).toLocaleString()}</span>
                          <span className={`px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[d.status] || 'bg-ink-800 text-ink-200'}`}>
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
