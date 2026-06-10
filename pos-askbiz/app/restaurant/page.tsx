'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import MenuMatrix from '@/components/MenuMatrix'
import ShiftProfitability from '@/components/ShiftProfitability'
import WhatsAppAutopilot from '@/components/WhatsAppAutopilot'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface KPI {
  label: string
  value: string
  sub?: string
  status?: 'good' | 'warn' | 'bad' | 'neutral'
}

interface OnlineOrder { id: string; customer_name: string; total: number; source: string; created_at: string }
interface TableSummary { id: string; name: string; section: string; status: string; covers?: number; seated_at?: string }
interface TopDish { name: string; qty: number; revenue: number; margin_pct: number }

export default function RestaurantHub() {
  const router  = useRouter()
  const supabase = createClient()
  const [ready, setReady]               = useState(false)
  const [sym, setSym]                   = useState('£')
  const [kpis, setKpis]                 = useState<KPI[]>([])
  const [tables, setTables]             = useState<TableSummary[]>([])
  const [topDishes, setTopDishes]       = useState<TopDish[]>([])
  const [pendingOnline, setPendingOnline] = useState<OnlineOrder[]>([])
  const [eightySix, setEightySix]       = useState<string[]>([])
  const [loading, setLoading]           = useState(true)
  const [accepting, setAccepting]       = useState<string | null>(null)
  const [brief, setBrief]               = useState<{ improved: string; worsened: string; action: string; health_score: number } | null>(null)
  const [anomalies, setAnomalies]       = useState<{ title: string; severity: string; prompt: string }[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
        // If staff_sector is set, this is a staff session — redirect to appropriate section
        if (c.staff_sector && c.staff_sector !== 'restaurant') {
          router.push('/pos')
        }
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    loadAll()
    const interval = setInterval(loadAll, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [ready])

  async function loadAll() {
    setLoading(true)
    try {
      const [analyticsRes, tablesRes, onlineRes, eightySixRes, briefRes, anomalyRes] = await Promise.all([
        fetch(`${API}/api/pos/restaurant/analytics?days=1`),
        fetch(`${API}/api/pos/restaurant/tables`),
        fetch(`${API}/api/pos/restaurant/online-orders?status=pending`),
        fetch(`${API}/api/pos/restaurant/eighty-six`),
        fetch(`${API}/api/pos/restaurant/daily-brief`),
        fetch(`${API}/api/pos/restaurant/anomalies`),
      ])

      const [analytics, tablesData, onlineData, eightySixData, briefData, anomalyData] = await Promise.all([
        analyticsRes.json(), tablesRes.json(), onlineRes.json(), eightySixRes.json(),
        briefRes.ok ? briefRes.json() : Promise.resolve(null),
        anomalyRes.ok ? anomalyRes.json() : Promise.resolve(null),
      ])

      // Build KPIs
      const k = analytics.kpis || {}
      const foodOk = k.food_cost_pct <= 35
      const laborOk = k.labor_cost_pct <= 35
      const primeOk = k.prime_cost_pct <= 65
      setKpis([
        { label: 'Revenue Today', value: `${sym}${(k.total_revenue || 0).toFixed(2)}`, sub: `${k.total_orders || 0} orders`, status: 'good' },
        { label: 'Covers', value: `${k.total_covers || 0}`, sub: `${sym}${(k.avg_per_cover || 0).toFixed(2)}/cover`, status: 'neutral' },
        { label: 'Avg Ticket', value: `${sym}${(k.avg_ticket || 0).toFixed(2)}`, sub: 'per order', status: 'neutral' },
        { label: 'Food Cost', value: `${k.food_cost_pct || 0}%`, sub: 'target ≤35%', status: foodOk ? 'good' : 'bad' },
        { label: 'Labour Cost', value: `${k.labor_cost_pct || 0}%`, sub: 'target ≤35%', status: laborOk ? 'good' : 'warn' },
        { label: 'Prime Cost', value: `${k.prime_cost_pct || 0}%`, sub: 'food+labour ≤65%', status: primeOk ? 'good' : 'bad' },
        { label: 'Avg Dwell', value: `${k.avg_dwell_mins || 0} min`, sub: 'time at table', status: 'neutral' },
        { label: 'Avg Prep', value: `${k.avg_prep_mins || 0} min`, sub: 'kitchen speed', status: (k.avg_prep_mins || 0) <= 15 ? 'good' : 'warn' },
      ])

      const topByRevenue = Object.values(analytics.top_items || []) as TopDish[]
      setTopDishes(topByRevenue.slice(0, 6))
      setTables(tablesData.tables || [])
      setPendingOnline(onlineData.online_orders || [])
      setEightySix((eightySixData.eighty_six || []).map((e: any) => e.item_name))
      if (briefData?.brief) setBrief(briefData.brief)
      if (anomalyData?.anomalies) setAnomalies(anomalyData.anomalies)
    } catch (e) {
      console.error('Hub load error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function acceptOnline(id: string) {
    setAccepting(id)
    await fetch(`${API}/api/pos/restaurant/online-orders`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'accept' }),
    })
    await loadAll()
    setAccepting(null)
  }

  const tablesByStatus = {
    occupied:  tables.filter(t => t.status === 'occupied').length,
    available: tables.filter(t => t.status === 'available').length,
    cleaning:  tables.filter(t => t.status === 'cleaning').length,
    reserved:  tables.filter(t => t.status === 'reserved').length,
  }

  const statusColor: Record<string, string> = {
    good: '#22c55e', warn: '#f59e0b', bad: '#ef4444', neutral: '#94a3b8',
  }

  const nav = [
    { label: '🗺️ Floor Plan',  href: '/restaurant/floor',      desc: 'Table status & orders' },
    { label: '📋 Orders',      href: '/restaurant/orders',      desc: 'Active order management' },
    { label: '🍳 Kitchen',     href: '/restaurant/kitchen',     desc: 'Kitchen display system' },
    { label: '🍽️ Menu',        href: '/restaurant/menu',        desc: 'Edit menu & modifiers' },
    { label: '⏱️ Labour',      href: '/restaurant/labor',       desc: 'Clock in/out & costs' },
    { label: '📱 Online Orders', href: '/restaurant/online-orders', desc: 'Accept & manage online orders' },
    { label: '📅 Reservations', href: '/restaurant/reservations',  desc: 'Bookings & covers management' },
    { label: '📦 Deliveries',   href: '/restaurant/deliveries',    desc: 'Scan invoices & food costs' },
    { label: '🗑️ Waste',        href: '/restaurant/waste',         desc: 'Log & track food waste' },
    { label: '👥 Staff',        href: '/restaurant/staff',         desc: 'Server revenue & shifts' },
  ]

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🍴 Restaurant</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Live operations dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pendingOnline.length > 0 && (
            <div style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, animation: 'pulse 1s infinite' }}>
              {pendingOnline.length} online order{pendingOnline.length > 1 ? 's' : ''} pending
            </div>
          )}
          <button onClick={() => router.push('/pos')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            ← POS
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Pending Online Orders — top alert */}
        {pendingOnline.length > 0 && (
          <div className="pos-banner" style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: '#fca5a5', marginBottom: 12 }}>⚠️ Online Orders Awaiting Acceptance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingOnline.map((o, idx) => (
                <div key={o.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 8, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{o.customer_name || 'Customer'}</span>
                    <span style={{ color: '#fca5a5', marginLeft: 8 }}>{sym}{o.total?.toFixed(2)}</span>
                    <span style={{ color: '#94a3b8', marginLeft: 8, fontSize: 12 }}>via {o.source}</span>
                  </div>
                  <button
                    onClick={() => acceptOnline(o.id)}
                    disabled={accepting === o.id}
                    className="pos-btn-primary"
                    style={{ background: ACC, border: 'none', color: '#fff', padding: '6px 16px', borderRadius: 6, cursor: accepting === o.id ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, opacity: accepting === o.id ? 0.5 : 1 }}
                  >
                    {accepting === o.id ? '...' : 'Accept'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Anomaly alerts */}
        {anomalies.length > 0 && (
          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {anomalies.map((a, i) => {
              const bg = a.severity === 'critical' ? '#7f1d1d' : a.severity === 'warning' ? '#451a03' : '#1e1b4b'
              const border = a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#6366f1'
              const icon = a.severity === 'critical' ? '🚨' : a.severity === 'warning' ? '⚠️' : 'ℹ️'
              return (
                <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 420 }}>
                  <span>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#f1f5f9' }}>{a.title}</div>
                  </div>
                  {a.prompt && (
                    <button
                      onClick={() => router.push(`/pos?q=${encodeURIComponent(a.prompt)}`)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94a3b8', padding: '3px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}
                    >
                      Ask AI →
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      await fetch(`${API}/api/pos/restaurant/anomalies`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: (a as any).id }) })
                      setAnomalies(prev => prev.filter((_, idx) => idx !== i))
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Daily Brief card */}
        {brief && (
          <div className="pos-reveal" style={{ background: '#1e293b', border: `1px solid ${ACC}40`, borderRadius: 12, padding: '18px 20px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {/* Health score ring */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <svg width={64} height={64} viewBox="0 0 64 64">
                <circle cx={32} cy={32} r={26} fill="none" stroke="#334155" strokeWidth={6} />
                <circle
                  cx={32} cy={32} r={26} fill="none"
                  stroke={brief.health_score >= 75 ? '#22c55e' : brief.health_score >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth={6} strokeLinecap="round"
                  strokeDasharray={`${(brief.health_score / 100) * 163.4} 163.4`}
                  transform="rotate(-90 32 32)"
                />
                <text x={32} y={37} textAnchor="middle" fill="#f1f5f9" fontSize={14} fontWeight={700}>{brief.health_score}</text>
              </svg>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Health</div>
            </div>
            {/* Brief text */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>↑ Going well</div>
                <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{brief.improved}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>↓ Watch out</div>
                <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{brief.worsened}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: ACC, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>→ Action</div>
                <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{brief.action}</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/pos?q=Give+me+a+full+restaurant+performance+analysis+for+today')}
              style={{ flexShrink: 0, background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
            >
              Deep dive →
            </button>
          </div>
        )}

        {/* 86 Board */}
        {eightySix.length > 0 && (
          <div style={{ background: '#1e293b', border: '1px solid #f59e0b', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>🚫</span>
            <div>
              <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: 13 }}>86 Board — Currently Out</div>
              <div style={{ color: '#e2e8f0', fontSize: 13, marginTop: 2 }}>{eightySix.join(' · ')}</div>
            </div>
            <button onClick={() => router.push('/restaurant/menu')} style={{ marginLeft: 'auto', background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Manage menu
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Table Status */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Table Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Occupied', count: tablesByStatus.occupied, color: '#ef4444' },
                { label: 'Available', count: tablesByStatus.available, color: '#22c55e' },
                { label: 'Cleaning', count: tablesByStatus.cleaning, color: '#f59e0b' },
                { label: 'Reserved', count: tablesByStatus.reserved, color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} style={{ background: '#0f172a', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{s.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/restaurant/floor')} className="pos-btn-primary" style={{ width: '100%', background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Open Floor Plan →
            </button>
          </div>

          {/* Top Dishes */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Today's Top Dishes</div>
            {topDishes.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>No orders yet today</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topDishes.map((dish, i) => (
                <div key={dish.name} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 10, animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <span style={{ color: '#64748b', fontSize: 12, width: 16, textAlign: 'right' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{dish.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{dish.qty} sold · {sym}{dish.revenue?.toFixed(2)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: dish.margin_pct >= 65 ? '#22c55e' : dish.margin_pct >= 50 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                    {dish.margin_pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Engineering Matrix */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
          <MenuMatrix sym={sym} />
        </div>

        {/* Shift Profitability */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
          <ShiftProfitability sym={sym} />
        </div>

        {/* WhatsApp Autopilot */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
          <WhatsAppAutopilot />
        </div>

        {/* Navigation tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {nav.map((n, idx) => (
            <button key={n.href} onClick={() => router.push(n.href)}
              className="pos-item"
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s', animationDelay: `${Math.min(idx, 8) * 40}ms` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{n.label.split(' ')[0]}</div>
              <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 14 }}>{n.label.split(' ').slice(1).join(' ')}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{n.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
