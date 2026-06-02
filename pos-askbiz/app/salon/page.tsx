'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#ec4899' // salon pink accent
const API = process.env.NEXT_PUBLIC_API_URL || ''

const statusColor: Record<string, string> = {
  good: '#22c55e', warn: '#f59e0b', bad: '#ef4444', neutral: '#94a3b8',
}

interface KPI {
  label: string
  value: string
  sub?: string
  status?: 'good' | 'warn' | 'bad' | 'neutral'
}

interface TxItem { name: string; qty: number; unit_price: number; cost_price?: number; inventory_id?: string }
interface Tx {
  id: string
  total: number
  created_at: string
  status: string
  payment_type: string
  pos_items?: TxItem[]
  pos_customers?: { id?: string; name?: string; phone?: string } | null
  cashier?: { id?: string; name?: string; role?: string } | null
}

function isToday(iso: string) {
  const d = new Date(iso)
  const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function serviceLabel(tx: Tx) {
  const items = tx.pos_items || []
  if (!items.length) return 'Service'
  if (items.length === 1) return items[0].name
  return `${items[0].name} +${items.length - 1}`
}

export default function SalonHub() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [kpis, setKpis] = useState<KPI[]>([])
  const [schedule, setSchedule] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    loadAll()
    const interval = setInterval(loadAll, 30000) // auto-refresh every 30s
    return () => clearInterval(interval)
  }, [ready])

  async function loadAll() {
    setLoading(true)
    try {
      // No dedicated salon-booking API yet — derive appointments from POS transactions.
      const res = await fetch(`${API}/api/pos/transactions?limit=500`)
      const data = await res.json()
      const txs: Tx[] = data.transactions || []

      const todayTxs = txs.filter(t => isToday(t.created_at) && t.status !== 'voided')
      const todayRevenue = todayTxs.reduce((s, t) => s + (t.total || 0), 0)
      const avgService = todayTxs.length ? todayRevenue / todayTxs.length : 0

      // Walk-ins = transactions today without a linked customer record (best-effort estimate)
      const walkIns = todayTxs.filter(t => !t.pos_customers || !t.pos_customers.phone).length

      // Top service by frequency across today's items
      const serviceCount: Record<string, number> = {}
      todayTxs.forEach(t => (t.pos_items || []).forEach(it => {
        serviceCount[it.name] = (serviceCount[it.name] || 0) + (it.qty || 1)
      }))
      const topService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]

      // Return-client rate: share of customers (by phone) seen on more than one day in the dataset
      const phoneDays: Record<string, Set<string>> = {}
      txs.forEach(t => {
        const ph = t.pos_customers?.phone
        if (!ph) return
        const day = new Date(t.created_at).toDateString()
        ;(phoneDays[ph] = phoneDays[ph] || new Set()).add(day)
      })
      const phones = Object.values(phoneDays)
      const returning = phones.filter(s => s.size > 1).length
      const returnRate = phones.length ? (returning / phones.length) * 100 : 0

      setKpis([
        { label: "Today's Appointments", value: `${todayTxs.length}`, sub: 'tickets today', status: 'neutral' },
        { label: 'Revenue Today', value: `${sym}${todayRevenue.toFixed(2)}`, sub: `${todayTxs.length} services`, status: 'good' },
        { label: 'Avg Service Value', value: `${sym}${avgService.toFixed(2)}`, sub: 'per ticket', status: 'neutral' },
        { label: 'Walk-ins', value: `${walkIns}`, sub: 'est. no phone on file', status: walkIns > todayTxs.length / 2 ? 'warn' : 'neutral' },
        { label: 'Top Service', value: topService ? topService[0] : '—', sub: topService ? `${topService[1]} booked` : 'no data', status: 'neutral' },
        { label: 'Return Client Rate', value: `${returnRate.toFixed(0)}%`, sub: 'repeat visitors', status: returnRate >= 40 ? 'good' : returnRate >= 20 ? 'warn' : 'bad' },
      ])

      setSchedule(todayTxs.slice().sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)))
    } catch (e) {
      console.error('Salon hub load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const nav = [
    { label: '📅 Bookings', href: '/salon/bookings', desc: 'Appointments & timeline' },
    { label: '👤 Clients', href: '/salon/clients', desc: 'Profiles & before/after photos' },
    { label: '🧴 Products', href: '/salon/products', desc: 'Retail & backbar usage' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>💇 Salon</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Operations dashboard</div>
        </div>
        <button onClick={() => router.push('/pos')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          ← POS
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 24 }}>
          {kpis.length === 0 && loading && (
            <div style={{ color: '#64748b', fontSize: 13 }}>Loading…</div>
          )}
          {kpis.map(kpi => (
            <div key={kpi.label} style={{ background: '#1e293b', border: `1px solid ${kpi.status ? statusColor[kpi.status] + '40' : '#334155'}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: kpi.status ? statusColor[kpi.status] : '#f1f5f9', margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kpi.value}</div>
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
              <div style={{ fontSize: 26, marginBottom: 6 }}>{n.label.split(' ')[0]}</div>
              <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 15 }}>{n.label.split(' ').slice(1).join(' ')}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{n.desc}</div>
            </button>
          ))}
        </div>

        {/* Today's schedule preview */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Today's Schedule</div>
            <button onClick={() => router.push('/salon/bookings')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              All bookings →
            </button>
          </div>
          {schedule.length === 0 && (
            <div style={{ color: '#64748b', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>
              {loading ? 'Loading…' : 'No appointments recorded today.'}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {schedule.map(tx => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: ACC, width: 56 }}>{fmtTime(tx.created_at)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.pos_customers?.name || tx.pos_customers?.phone || 'Walk-in'}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{serviceLabel(tx)} · {tx.cashier?.name || 'Unassigned'}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{sym}{(tx.total || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
