'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#f59e0b'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const GOOD = '#22c55e'
const WARN = '#f59e0b'
const BAD = '#ef4444'

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'

interface Capture {
  id: string
  type: CaptureType
  product_name: string | null
  quantity: number | null
  batch_ref: string | null
  notes: string | null
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  captured_by_staff?: { id: string; name: string; role: string } | null
  approved_by_staff?: { id: string; name: string; role: string } | null
}

interface InventoryItem { id: string; name: string; stock_qty: number | null; unit: string | null }

interface KPI {
  label: string
  value: string
  sub?: string
  status?: 'good' | 'warn' | 'bad' | 'neutral'
}

const TYPE_META: Record<CaptureType, { label: string; icon: string; color: string }> = {
  intake:   { label: 'Intake',   icon: '📥', color: '#3b82f6' },
  output:   { label: 'Output',   icon: '📤', color: GOOD },
  wastage:  { label: 'Wastage',  icon: '🗑️', color: BAD },
  dispatch: { label: 'Dispatch', icon: '🚚', color: '#8b5cf6' },
}

const STATUS_COLOR: Record<string, string> = {
  pending: WARN, approved: GOOD, rejected: BAD,
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

export default function FactoryHub() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [captures, setCaptures] = useState<Capture[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
        if (c.staff_sector && c.staff_sector !== 'factory') router.push('/pos')
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    loadAll()
    const interval = setInterval(loadAll, 30000)
    return () => clearInterval(interval)
  }, [ready])

  async function loadAll() {
    setLoading(true)
    try {
      const [capRes, invRes] = await Promise.all([
        fetch(`${API}/api/pos/factory/capture?limit=100`),
        fetch(`${API}/api/pos/inventory`),
      ])
      const capData = capRes.ok ? await capRes.json() : { captures: [] }
      const invData = invRes.ok ? await invRes.json() : { inventory: [] }
      setCaptures(capData.captures || [])
      setInventory(invData.inventory || [])
    } catch (e) {
      console.error('Factory hub load error:', e)
    } finally {
      setLoading(false)
    }
  }

  // KPI calculations
  const todays = captures.filter(c => isToday(c.created_at))
  const unitsToday = todays
    .filter(c => c.type === 'output')
    .reduce((sum, c) => sum + (c.quantity || 0), 0)
  const intakeToday = todays
    .filter(c => c.type === 'intake')
    .reduce((sum, c) => sum + (c.quantity || 0), 0)
  const wastageToday = todays
    .filter(c => c.type === 'wastage')
    .reduce((sum, c) => sum + (c.quantity || 0), 0)
  const dispatchToday = todays.filter(c => c.type === 'dispatch').length
  const pending = captures.filter(c => c.status === 'pending').length
  const totalThroughput = unitsToday + wastageToday
  const wastagePct = totalThroughput > 0 ? (wastageToday / totalThroughput) * 100 : 0
  const efficiency = intakeToday > 0 ? (unitsToday / intakeToday) * 100 : 0
  const rawStock = inventory.reduce((sum, i) => sum + (i.stock_qty || 0), 0)

  const kpis: KPI[] = [
    { label: 'Units Produced', value: `${unitsToday.toLocaleString()}`, sub: 'output today', status: 'good' },
    { label: 'Wastage %', value: `${wastagePct.toFixed(1)}%`, sub: `${wastageToday.toLocaleString()} units scrapped`, status: wastagePct <= 5 ? 'good' : wastagePct <= 10 ? 'warn' : 'bad' },
    { label: 'Dispatches', value: `${dispatchToday}`, sub: 'shipped today', status: 'neutral' },
    { label: 'Pending Approvals', value: `${pending}`, sub: 'awaiting sign-off', status: pending === 0 ? 'good' : pending <= 5 ? 'warn' : 'bad' },
    { label: 'Efficiency', value: `${efficiency.toFixed(0)}%`, sub: 'output ÷ intake', status: efficiency >= 90 ? 'good' : efficiency >= 70 ? 'warn' : efficiency > 0 ? 'bad' : 'neutral' },
    { label: 'Raw Material Stock', value: `${rawStock.toLocaleString()}`, sub: `${inventory.length} items`, status: 'neutral' },
  ]

  const statusColor: Record<string, string> = {
    good: GOOD, warn: WARN, bad: BAD, neutral: '#94a3b8',
  }

  const nav = [
    { icon: '📸', label: 'New Capture', href: '/factory/capture', desc: 'Photograph intake, output, wastage & dispatch' },
    { icon: '📋', label: 'Production Log', href: '/factory/production', desc: 'Full capture history & yield' },
    { icon: '✅', label: 'Approvals', href: '/factory/approvals', desc: `${pending} pending sign-off` },
  ]

  const recent = captures.slice(0, 10)

  if (!ready) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>Loading…</div>
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/pos')} style={{ background: '#334155', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🏭 Factory</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Live production operations</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pending > 0 && (
            <div style={{ background: BAD, color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
              {pending} pending approval{pending > 1 ? 's' : ''}
            </div>
          )}
          <button onClick={loadAll} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↻ Refresh</button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Primary CTA */}
        <button className="pos-btn-primary" onClick={() => router.push('/factory/capture')}
          style={{ width: '100%', background: ACC, border: 'none', color: '#1a1206', padding: '16px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 16, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          📸 New Production Capture
        </button>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {kpis.map(kpi => (
            <div key={kpi.label} style={{ background: '#1e293b', border: `1px solid ${kpi.status ? statusColor[kpi.status] + '40' : '#334155'}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: kpi.status ? statusColor[kpi.status] : '#f1f5f9', margin: '4px 0' }}>{kpi.value}</div>
              {kpi.sub && <div style={{ fontSize: 11, color: '#64748b' }}>{kpi.sub}</div>}
            </div>
          ))}
        </div>

        {/* Navigation tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
          {nav.map(n => (
            <button key={n.href} onClick={() => router.push(n.href)}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '20px 18px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{n.icon}</div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>{n.label}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{n.desc}</div>
            </button>
          ))}
        </div>

        {/* Recent captures */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Captures</div>
            <button onClick={() => router.push('/factory/production')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>View all →</button>
          </div>
          {loading && recent.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>Loading…</div>
          ) : recent.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No captures yet. Tap “New Production Capture” to log one.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map((c, idx) => {
                const meta = TYPE_META[c.type]
                return (
                  <div key={c.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 8, padding: '10px 14px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <span style={{ background: `${meta.color}22`, color: meta.color, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{meta.icon} {meta.label}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.product_name || 'Unspecified product'}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {c.quantity != null ? `${c.quantity}${c.batch_ref ? ' ' + c.batch_ref : ''} · ` : ''}{c.captured_by_staff?.name || 'Operator'} · {timeAgo(c.created_at)}
                      </div>
                    </div>
                    <span style={{ background: `${STATUS_COLOR[c.status]}22`, color: STATUS_COLOR[c.status], padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{c.status}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
