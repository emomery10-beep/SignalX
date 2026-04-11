'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect } from 'react'

interface Source {
  id: string; source_type: string; name: string; status: string
  last_synced_at: string | null; sync_interval_minutes: number
  error_message: string | null
}

interface SyncResult { sourceName: string; status: string; recordsSynced: number; error?: string }

const SOURCE_INFO: Record<string, { label: string; icon: string; color: string; desc: string; fields: { key: string; label: string; type: string; placeholder: string }[] }> = {
  shopify: {
    label: 'Shopify', icon: '🛍️', color: 'rgba(149,191,71,.15)',
    desc: 'Orders, products, inventory, refunds, customers',
    fields: [
      { key: 'shop_domain',   label: 'Shop domain',    type: 'text',     placeholder: 'mystore.myshopify.com' },
      { key: 'access_token',  label: 'Access token',   type: 'password', placeholder: 'shpat_...' },
    ]
  },
  stripe: {
    label: 'Stripe', icon: '💳', color: 'rgba(99,91,255,.15)',
    desc: 'Payments, payouts, refunds, transactions',
    fields: [
      { key: 'secret_key', label: 'Secret key', type: 'password', placeholder: 'sk_live_...' },
    ]
  },
  square: {
    label: 'Square', icon: '⬛', color: 'rgba(255,255,255,.08)',
    desc: 'Orders, inventory, payments, locations',
    fields: [
      { key: 'access_token', label: 'Access token', type: 'password', placeholder: 'EAAAl...' },
      { key: 'location_id',  label: 'Location ID',  type: 'text',     placeholder: 'L...' },
    ]
  },
  quickbooks: {
    label: 'QuickBooks', icon: '📒', color: 'rgba(44,160,44,.15)',
    desc: 'P&L, invoices, expenses, cash flow',
    fields: [
      { key: 'company_id',    label: 'Company ID',    type: 'text',     placeholder: '1234567890' },
      { key: 'access_token',  label: 'Access token',  type: 'password', placeholder: 'eyJ...' },
      { key: 'refresh_token', label: 'Refresh token', type: 'password', placeholder: 'AB11...' },
    ]
  },
  google_sheets: {
    label: 'Google Sheets', icon: '📊', color: 'rgba(52,168,83,.15)',
    desc: 'Any spreadsheet — sales, stock, costs, P&L',
    fields: [
      { key: 'spreadsheet_id', label: 'Spreadsheet ID', type: 'text',     placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs...' },
      { key: 'sheet_name',     label: 'Sheet name',     type: 'text',     placeholder: 'Sheet1' },
      { key: 'access_token',   label: 'Access token',   type: 'password', placeholder: 'ya29...' },
    ]
  },
}

const STATUS_COLOR: Record<string, string> = {
  active: '#22c55e', paused: '#f5c55a', error: '#f48080'
}

export default function SourcesPage() {
  const { planId, loading: planLoading } = usePlan()
  const [sources, setSources] = useState<Source[]>([])
  const [showConnect, setShowConnect] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState<SyncResult[]>([])
  const [lastSyncMsg, setLastSyncMsg] = useState('')

  useEffect(() => { loadSources() }, [])

  const loadSources = async () => {
    const res = await fetch('/api/sources')
    const data = await res.json()
    setSources(Array.isArray(data) ? data : [])
  }

  const connect = async () => {
    if (!selectedType || !name) return
    setSaving(true)
    const info = SOURCE_INFO[selectedType]
    const credentials: Record<string, string> = {}
    const config: Record<string, string> = {}

    // Separate credentials from config
    info.fields.forEach(f => {
      if (f.type === 'password' || f.key.includes('token') || f.key.includes('key')) {
        credentials[f.key] = fields[f.key] || ''
      } else {
        config[f.key] = fields[f.key] || ''
      }
    })

    const res = await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_type: selectedType, name, credentials, config }),
    })

    if (res.ok) {
      setShowConnect(false)
      setSelectedType(''); setName(''); setFields({})
      await loadSources()
    }
    setSaving(false)
  }

  const disconnect = async (id: string) => {
    if (!confirm('Disconnect this source? Your synced data will remain.')) return
    await fetch('/api/sources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadSources()
  }

  const syncNow = async (sourceId?: string) => {
    setSyncing(true)
    setSyncResults([])
    setLastSyncMsg('Syncing…')
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId }),
    })
    const data = await res.json()
    setSyncResults(data.results || [])
    const total = (data.results || []).reduce((s: number, r: SyncResult) => s + (r.recordsSynced || 0), 0)
    setLastSyncMsg(`✓ Synced ${total} records`)
    setTimeout(() => setLastSyncMsg(''), 5000)
    setSyncing(false)
    loadSources()
  }

  const formatSyncTime = (ts: string | null) => {
    if (!ts) return 'Never'
    const diff = (Date.now() - new Date(ts).getTime()) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return new Date(ts).toLocaleDateString()
  }

  const info = selectedType ? SOURCE_INFO[selectedType] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>Data Sources</div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>Connect your tools — everything syncs into one clean model</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {sources.length > 0 && (
            <button onClick={() => syncNow()} disabled={syncing}
              style={{ padding: '8px 16px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 12, cursor: syncing ? 'not-allowed' : 'pointer' }}>
              {syncing ? '⟳ Syncing…' : '⟳ Sync all now'}
            </button>
          )}
          <button onClick={() => setShowConnect(true)}
            style={{ padding: '8px 18px', borderRadius: 9999, border: 'none', background: '#1ed4ca', color: '#04080f', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Connect source
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Sync result message */}
        {lastSyncMsg && (
          <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', fontSize: 13, color: '#22c55e' }}>
            {lastSyncMsg}
          </div>
        )}

        {/* Sync results */}
        {syncResults.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Last sync results</div>
            {syncResults.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.status === 'success' ? '#22c55e' : '#f48080', flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.sourceName}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{r.recordsSynced} records synced · {r.status}{r.error ? ` · ${r.error}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* What gets synced */}
        <div style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(30,212,202,.2)', background: 'rgba(30,212,202,.05)', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#47e2da', marginBottom: 8 }}>📋 Unified data model — everything maps to this</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {['SKU','Product name','Date','Units sold','Selling price','Cost price','Discount','Gross margin','Net margin','Stock level','Channel','Customer region','Ad spend','Campaign','Shipping cost','Marketplace fee'].map((f, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--tx2)', padding: '4px 8px', borderRadius: 6, background: 'rgba(30,212,202,.08)', border: '1px solid rgba(30,212,202,.15)' }}>{f}</div>
            ))}
          </div>
        </div>

        {/* Connected sources */}
        {sources.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Connected</div>
            {sources.map(s => {
              const info = SOURCE_INFO[s.source_type]
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, border: '1px solid var(--b2)', background: 'var(--sf)', marginBottom: 10 }}>
                  <div style={{ fontSize: 26 }}>{info?.icon || '🔌'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                      {info?.label} · Last synced {formatSyncTime(s.last_synced_at)} · Every {s.sync_interval_minutes / 60}h
                      {s.error_message && <span style={{ color: '#f48080' }}> · {s.error_message}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 9999, background: `${STATUS_COLOR[s.status]}22`, border: `1px solid ${STATUS_COLOR[s.status]}44`, fontSize: 11, color: STATUS_COLOR[s.status], fontWeight: 500 }}>
                      {s.status}
                    </span>
                    <button onClick={() => syncNow(s.id)} disabled={syncing}
                      style={{ padding: '6px 12px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 11, cursor: 'pointer' }}>
                      Sync now
                    </button>
                    <button onClick={() => disconnect(s.id)}
                      style={{ padding: '6px 12px', borderRadius: 9999, border: '1px solid rgba(232,64,64,.28)', background: 'rgba(232,64,64,.08)', color: '#f48080', fontFamily: 'inherit', fontSize: 11, cursor: 'pointer' }}>
                      Disconnect
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Available sources */}
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>
          {sources.length > 0 ? 'Add another source' : 'Available sources'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {Object.entries(SOURCE_INFO).map(([type, info]) => {
            const connected = sources.some(s => s.source_type === type)
            return (
              <div key={type} onClick={() => { setSelectedType(type); setShowConnect(true); setName(info.label + ' — My Store') }}
                style={{ padding: 18, borderRadius: 14, border: `1px solid ${connected ? 'rgba(34,197,94,.3)' : 'var(--b)'}`, background: connected ? 'rgba(34,197,94,.05)' : 'var(--sf)', cursor: 'pointer', transition: 'all 180ms', textAlign: 'center' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = connected ? 'rgba(34,197,94,.5)' : 'var(--b2)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = connected ? 'rgba(34,197,94,.3)' : 'var(--b)'}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{info.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{info.label}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>{info.desc}</div>
                {connected && <div style={{ fontSize: 10, color: '#22c55e', marginTop: 6, fontWeight: 500 }}>✓ Connected</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Connect modal */}
      {showConnect && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowConnect(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,15,.75)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--b2)', borderRadius: 20, width: '100%', maxWidth: 480, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
              Connect {info ? `${info.icon} ${info.label}` : 'a source'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 20 }}>{info?.desc}</div>

            {!selectedType ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(SOURCE_INFO).map(([type, si]) => (
                  <div key={type} onClick={() => { setSelectedType(type); setName(si.label + ' — My Store') }}
                    style={{ padding: 14, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--ev)', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{si.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{si.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx2)', marginBottom: 5 }}>Connection name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={`e.g. My ${info?.label} Store`}
                    style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 10, padding: '10px 13px', outline: 'none', width: '100%' }}/>
                </div>
                {info?.fields.map(f => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx2)', marginBottom: 5 }}>{f.label}</label>
                    <input type={f.type} value={fields[f.key] || ''} onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 10, padding: '10px 13px', outline: 'none', width: '100%' }}/>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 20, padding: '10px 12px', borderRadius: 9, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                  🔒 Your credentials are stored encrypted and never shared. SignalX only reads data — it never writes back.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setShowConnect(false); setSelectedType('') }}
                    style={{ flex: 1, padding: 10, borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={connect} disabled={saving || !name}
                    style={{ flex: 1, padding: 10, borderRadius: 9999, border: 'none', background: saving ? 'var(--b2)' : '#1ed4ca', color: '#04080f', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                    {saving ? 'Connecting…' : `Connect ${info?.label}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
