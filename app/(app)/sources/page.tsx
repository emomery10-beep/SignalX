'use client'
import { usePlan } from '@/lib/hooks/usePlan'
// FeatureGate removed — data connection open to all plans
import { useState, useEffect } from 'react'

interface Source {
  id: string; source_type: string; name: string; status: string
  last_synced_at: string | null; sync_interval_minutes: number
  error_message: string | null; created_at: string
}

const SOURCES = [
  {
    id: 'shopify', label: 'Shopify', desc: 'Orders, products, inventory, customers',
    icon: '🛍️', accent: '#95bf47', color: 'rgba(149,191,71,.1)',
    oauthFlow: true, hint: "Enter your store domain — you'll approve access in Shopify",
    fields: [{ key: 'shop', label: 'Store domain', placeholder: 'mystore.myshopify.com', type: 'text', required: true }],
  },
  {
    id: 'amazon_fba', label: 'Amazon FBA', desc: 'FBA orders, inventory, fees, returns',
    icon: '📦', accent: '#ff9900', color: 'rgba(255,153,0,.1)',
    oauthFlow: true, hint: 'Redirects to Amazon Seller Central — read-only access',
    fields: [],
  },
  {
    id: 'stripe', label: 'Stripe', desc: 'Payments, payouts, refunds, transactions',
    icon: '💳', accent: '#635bff', color: 'rgba(99,91,255,.1)',
    oauthFlow: true, hint: 'Redirects to Stripe Connect — read-only access',
    fields: [],
  },
  {
    id: 'quickbooks', label: 'QuickBooks', desc: 'P&L, invoices, expenses, cash flow',
    icon: '📒', accent: '#2ca02c', color: 'rgba(44,160,44,.1)',
    oauthFlow: true, hint: 'Redirects to Intuit — read-only access',
    fields: [],
  },
  {
    id: 'google_sheets', label: 'Google Sheets', desc: 'Any spreadsheet — sales, stock, costs, P&L',
    icon: '📊', accent: '#34a853', color: 'rgba(52,168,83,.1)',
    oauthFlow: true, hint: 'Paste a Spreadsheet ID, or leave blank to choose after connecting',
    fields: [{ key: 'spreadsheet_id', label: 'Spreadsheet ID (optional)', placeholder: '1BxiMVs0XRA5...', type: 'text', required: false }],
  },
  {
    id: 'square', label: 'Square', desc: 'Orders, inventory, payments, locations',
    icon: '⬛', accent: '#3d3d3d', color: 'rgba(100,100,100,.08)',
    oauthFlow: false, hint: 'Paste your Square access token from the Developer Dashboard',
    fields: [
      { key: 'access_token', label: 'Access token', placeholder: 'EAAAl...', type: 'password', required: true },
      { key: 'location_id', label: 'Location ID (optional)', placeholder: 'L...', type: 'text', required: false },
    ],
  },
]

const OAUTH_URL: Record<string, (f: Record<string, string>) => string> = {
  shopify: (f) => `/api/auth/shopify?shop=${encodeURIComponent(f.shop || '')}`,
  amazon_fba: () => '/api/auth/amazon',
  stripe: () => '/api/auth/stripe',
  quickbooks: () => '/api/auth/quickbooks',
  google_sheets: (f) => `/api/auth/google?spreadsheet_id=${encodeURIComponent(f.spreadsheet_id || '')}`,
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SourcesPage() {
  const { planId, loading: planLoading } = usePlan()
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const [sources, setSources] = useState<Source[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [modal, setModal] = useState<string | null>(null)
  const [modalFields, setModalFields] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadSources()
    const connected = searchParams?.get('connected')
    const error = searchParams?.get('error')
    if (connected) showToast(`${connected.replace(/_/g, ' ')} connected`, true)
    if (error) showToast(`Connection failed: ${error.replace(/_/g, ' ')}`, false)
  }, [])

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const loadSources = async () => {
    setPageLoading(true)
    try {
      const res = await fetch('/api/sources')
      const data = await res.json()
      setSources(Array.isArray(data) ? data : [])
    } finally { setPageLoading(false) }
  }

  const openModal = (srcId: string) => {
    setModalFields({})
    setModal(srcId)
  }

  const handleConnect = async (srcId: string) => {
    const src = SOURCES.find(s => s.id === srcId)
    if (!src) return

    if (src.oauthFlow) {
      const required = src.fields.filter(f => f.required)
      const missing = required.find(f => !modalFields[f.key]?.trim())
      if (missing) { showToast(`Please enter your ${missing.label}`, false); return }
      const url = OAUTH_URL[srcId]?.(modalFields)
      if (url) window.location.href = url
      return
    }

    const required = src.fields.filter(f => f.required)
    const missing = required.find(f => !modalFields[f.key]?.trim())
    if (missing) { showToast(`Please enter your ${missing.label}`, false); return }

    setConnecting(srcId)
    try {
      const credentials: Record<string, string> = {}
      const config: Record<string, string> = {}
      src.fields.forEach(f => {
        if (f.type === 'password') credentials[f.key] = modalFields[f.key] || ''
        else config[f.key] = modalFields[f.key] || ''
      })
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: srcId, name: src.label, credentials, config }),
      })
      if (!res.ok) throw new Error(await res.text())
      showToast(`${src.label} connected`, true)
      setModal(null)
      await loadSources()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Connection failed', false)
    } finally { setConnecting(null) }
  }

  const syncSource = async (sourceId: string) => {
    setSyncing(sourceId)
    try {
      const res = await fetch('/api/sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: sourceId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      showToast('Sync complete', true)
      await loadSources()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Sync failed', false)
    } finally { setSyncing(null) }
  }

  const disconnectSource = async (id: string) => {
    setDeleting(id)
    try {
      await fetch('/api/sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      showToast('Disconnected', true)
      await loadSources()
    } finally { setDeleting(null) }
  }

  const connectedTypes = new Set(sources.map(s => s.source_type))
  const activeSrc = modal ? SOURCES.find(s => s.id === modal) : null

  return (
    <div className="page-shell">

        <div className="page-shell-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>Data Sources</div>
            <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>Connect your platforms — AskBiz pulls live data automatically</div>
          </div>
          {sources.length > 0 && (
            <button onClick={() => syncSource('all')} disabled={syncing === 'all'}
              style={{ padding: '7px 16px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', fontSize: 12, fontWeight: 600, color: 'var(--tx)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              {syncing === 'all' ? 'Syncing…' : 'Sync all'}
            </button>
          )}
        </div>

        <div className="page-shell-body">

          {toast && (
            <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: toast.ok ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, fontSize: 13, color: toast.ok ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
              {toast.ok ? '✓' : '✗'} {toast.msg}
            </div>
          )}

          {sources.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Connected ({sources.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sources.map(source => {
                  const info = SOURCES.find(s => s.id === source.source_type)
                  return (
                    <div key={source.id} style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 22 }}>{info?.icon || '🔌'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{source.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: source.status === 'active' ? '#22c55e' : source.status === 'error' ? '#ef4444' : '#f59e0b', display: 'inline-block', flexShrink: 0 }}/>
                          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{source.status === 'active' ? 'Connected' : source.status} · Last sync: {timeAgo(source.last_synced_at)}</span>
                          {source.error_message && <span style={{ fontSize: 11, color: '#ef4444' }}>{source.error_message.slice(0, 60)}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                        <button onClick={() => syncSource(source.id)} disabled={syncing === source.id}
                          style={{ padding: '6px 12px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', fontSize: 12, fontWeight: 500, color: 'var(--tx)', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {syncing === source.id ? 'Syncing…' : 'Sync now'}
                        </button>
                        <button onClick={() => disconnectSource(source.id)} disabled={deleting === source.id}
                          style={{ padding: '6px 12px', borderRadius: 9999, border: '1px solid rgba(239,68,68,.3)', background: 'transparent', fontSize: 12, color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {deleting === source.id ? '…' : 'Disconnect'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
            {sources.length === 0 ? 'Connect a platform' : 'Add another source'}
          </div>

          {pageLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
              {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 160, borderRadius: 16, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }}></div>)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
              {SOURCES.map(src => {
                const isConnected = connectedTypes.has(src.id)
                return (
                  <div key={src.id} style={{ padding: 20, borderRadius: 16, border: `1px solid ${isConnected ? 'var(--b2)' : 'var(--b)'}`, background: isConnected ? src.color : 'var(--sf)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 28 }}>{src.icon}</span>
                      {isConnected && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 9999, padding: '2px 8px', letterSpacing: '.06em', textTransform: 'uppercase' }}>Connected</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{src.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.55, marginBottom: 16, flex: 1 }}>{src.desc}</div>
                    {!isConnected ? (
                      <button onClick={() => openModal(src.id)}
                        style={{ width: '100%', padding: '9px 0', borderRadius: 10, border: 'none', background: src.accent, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        Connect {src.label}
                      </button>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
                        Live — syncing automatically
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: 24, padding: '14px 18px', borderRadius: 12, border: '1px dashed var(--b2)', fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6 }}>
            💡 No integration yet? <strong style={{ color: 'var(--tx)' }}>Upload a CSV or Excel file</strong> from the chat page — instant analysis, no connection needed.
          </div>
        </div>

        {modal && activeSrc && (
          <div onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: 'var(--sf)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, border: '1px solid var(--b)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 28 }}>{activeSrc.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>Connect {activeSrc.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>{activeSrc.hint}</div>
                </div>
              </div>
              {activeSrc.fields.map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                    {f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}
                  </label>
                  <input type={f.type} placeholder={f.placeholder} value={modalFields[f.key] || ''}
                    onChange={e => setModalFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}/>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button onClick={() => handleConnect(modal)} disabled={connecting === modal}
                  style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', background: activeSrc.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {connecting === modal ? 'Connecting…' : activeSrc.oauthFlow ? `Authorise via ${activeSrc.label} →` : 'Connect'}
                </button>
                <button onClick={() => setModal(null)}
                  style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', fontSize: 14, color: 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </div>
              {activeSrc.oauthFlow && (
                <p style={{ marginTop: 12, fontSize: 11, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6 }}>
                  🔒 Read-only access. AskBiz never stores your {activeSrc.label} password.
                </p>
              )}
            </div>
          </div>
        )}

      </div>
  )
}
