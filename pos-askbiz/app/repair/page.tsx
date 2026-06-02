'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#6366f1'
const API = process.env.NEXT_PUBLIC_API_URL || ''
const GOOD = '#22c55e', WARN = '#f59e0b', BAD = '#ef4444', MUTED = '#94a3b8', DIM = '#64748b'

interface Job {
  id: string
  ticket_number: string
  status: string
  customer_name: string | null
  device_model: string | null
  device_serial: string | null
  fault_description: string | null
  quoted_price: number | null
  created_at: string
  completed_at?: string | null
  estimated_minutes: number | null
  assigned_staff?: { id: string; name: string } | null
  paid_by_transaction?: any
}

interface KPI {
  label: string
  value: string
  sub?: string
  status?: 'good' | 'warn' | 'bad' | 'neutral'
}

const STATUS_LABEL: Record<string, string> = {
  intake: 'Intake', quoted: 'Quoted', accepted: 'Accepted',
  in_progress: 'In Progress', completed: 'Ready', collected: 'Collected', cancelled: 'Cancelled',
}
const STATUS_COLOR: Record<string, string> = {
  intake: MUTED, quoted: WARN, accepted: ACC, in_progress: '#8b5cf6',
  completed: GOOD, collected: GOOD, cancelled: BAD,
}

function isToday(iso: string) {
  const d = new Date(iso); const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
}
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function RepairHub() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [jobs, setJobs] = useState<Job[]>([])
  const [lowStockCount, setLowStockCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
        if (c.staff_sector && c.staff_sector !== 'repair') router.push('/pos')
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    loadJobs()
    const interval = setInterval(loadJobs, 30000)
    return () => clearInterval(interval)
  }, [ready])

  async function loadJobs() {
    setLoading(true)
    try {
      const [jobsRes, invRes] = await Promise.all([
        fetch(`${API}/api/pos/service-jobs?limit=500`),
        fetch(`${API}/api/pos/inventory?sector=repair`).catch(() => null),
      ])
      const data = await jobsRes.json()
      setJobs(data.jobs || [])

      // Parts low-stock count (repair-sector inventory at/below threshold)
      if (invRes && invRes.ok) {
        const inv = await invRes.json()
        const items: any[] = inv.products || inv.inventory || inv.items || (Array.isArray(inv) ? inv : [])
        const low = items.filter(p => {
          const qty = Number(p.stock_qty) || 0
          const thr = Number(p.low_stock_threshold) || 0
          return qty <= thr
        }).length
        setLowStockCount(low)
      }
    } catch (e) {
      console.error('Repair hub load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const active = jobs.filter(j => ['intake', 'quoted', 'accepted', 'in_progress'].includes(j.status))
  const ready_pickup = jobs.filter(j => j.status === 'completed')
  const completedToday = jobs.filter(j => j.status === 'collected' && isToday(j.created_at))
  const revenueToday = jobs
    .filter(j => j.status === 'collected' && isToday(j.created_at))
    .reduce((sum, j) => sum + (Number(j.quoted_price) || 0), 0)

  // Avg turnaround (days) — uses the real completed_at stamp (set when a job
  // enters completed/collected); falls back to created_at→now only if absent.
  const collected = jobs.filter(j => j.status === 'collected' || j.status === 'completed')
  const avgTurnaround = collected.length
    ? collected.reduce((sum, j) => {
        const end = j.completed_at ? new Date(j.completed_at).getTime() : Date.now()
        const days = (end - new Date(j.created_at).getTime()) / 86400000
        return sum + Math.max(0, days)
      }, 0) / collected.length
    : 0

  const kpis: KPI[] = [
    { label: 'Active Jobs', value: `${active.length}`, sub: 'in workshop', status: 'neutral' },
    { label: 'Ready for Pickup', value: `${ready_pickup.length}`, sub: 'awaiting collection', status: ready_pickup.length > 0 ? 'good' : 'neutral' },
    { label: 'Completed Today', value: `${completedToday.length}`, sub: 'collected', status: 'good' },
    { label: 'Revenue Today', value: `${sym}${revenueToday.toFixed(2)}`, sub: 'collected jobs', status: 'good' },
    { label: 'Avg Turnaround', value: `${avgTurnaround.toFixed(1)}d`, sub: 'days to collect', status: avgTurnaround <= 3 ? 'good' : avgTurnaround <= 7 ? 'warn' : 'bad' },
    { label: 'Parts Low Stock', value: lowStockCount === null ? '—' : `${lowStockCount}`, sub: 'at/below reorder', status: lowStockCount && lowStockCount > 0 ? 'warn' : 'neutral' },
  ]

  const statusColor: Record<string, string> = { good: GOOD, warn: WARN, bad: BAD, neutral: MUTED }

  const nav = [
    { icon: '📸', label: 'New Intake', href: '/repair/intake', desc: 'Camera-first device check-in' },
    { icon: '🎫', label: 'Tickets', href: '/repair/tickets', desc: 'Manage repair tickets' },
    { icon: '🔩', label: 'Parts', href: '/repair/parts', desc: 'Spare parts inventory' },
  ]

  const recent = [...jobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/pos')} style={{ background: '#334155', border: 'none', color: MUTED, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🔧 Repair</div>
            <div style={{ fontSize: 12, color: MUTED }}>Workshop operations dashboard</div>
          </div>
        </div>
        <button onClick={() => router.push('/repair/intake')} style={{ background: ACC, border: 'none', color: '#fff', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          📸 New Intake
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {kpis.map(kpi => (
            <div key={kpi.label} style={{ background: '#1e293b', border: `1px solid ${kpi.status ? statusColor[kpi.status] + '40' : '#334155'}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: DIM, textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: kpi.status ? statusColor[kpi.status] : '#f1f5f9', margin: '4px 0' }}>{kpi.value}</div>
              {kpi.sub && <div style={{ fontSize: 11, color: DIM }}>{kpi.sub}</div>}
            </div>
          ))}
        </div>

        {/* Nav grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {nav.map(n => (
            <button key={n.href} onClick={() => router.push(n.href)}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '22px 20px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>{n.icon}</div>
              <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 16 }}>{n.label}</div>
              <div style={{ color: DIM, fontSize: 12, marginTop: 3 }}>{n.desc}</div>
            </button>
          ))}
        </div>

        {/* Recent tickets */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Tickets</div>
            <button onClick={() => router.push('/repair/tickets')} style={{ background: '#334155', border: 'none', color: MUTED, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              View all →
            </button>
          </div>
          {loading && jobs.length === 0 && <div style={{ color: DIM, fontSize: 13 }}>Loading…</div>}
          {!loading && recent.length === 0 && <div style={{ color: DIM, fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No repair tickets yet. Start with a new intake.</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map(j => (
              <button key={j.id} onClick={() => router.push('/repair/tickets')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
                    {j.device_model || 'Unknown device'}
                    <span style={{ color: DIM, fontWeight: 400, marginLeft: 8 }}>#{j.ticket_number}</span>
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                    {j.customer_name || 'Walk-in'} · {timeAgo(j.created_at)}
                    {j.quoted_price ? ` · ${sym}${Number(j.quoted_price).toFixed(2)}` : ''}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: (STATUS_COLOR[j.status] || DIM) + '22', color: STATUS_COLOR[j.status] || DIM, whiteSpace: 'nowrap' }}>
                  {STATUS_LABEL[j.status] || j.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
