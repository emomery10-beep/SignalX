'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import MenuMatrix from '@/components/MenuMatrix'
import ShiftProfitability from '@/components/ShiftProfitability'
import WhatsAppAutopilot from '@/components/WhatsAppAutopilot'
import { tokens, Button, Card, ListItem } from '@/components/ui'

const ACC = tokens.accent

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
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
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
  const [readinessScore, setReadinessScore] = useState<number | null>(null)

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/restaurant/readiness', { headers: session.headers })
      .then(r => r.json())
      .then(d => setReadinessScore(d.readiness?.readiness_score ?? 0))
      .catch(() => {})
  }, [authReady, session])

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: session.headers }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
      // If staff_sector is set, this is a staff session — redirect to appropriate section
      if (c.staff_sector && c.staff_sector !== 'restaurant') {
        router.push('/pos')
      }
    }).catch(() => {})
  }, [authReady, session])

  useEffect(() => {
    if (!authReady || !session) return
    loadAll()
    const interval = setInterval(loadAll, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [authReady, session])

  async function loadAll() {
    if (!session) return
    setLoading(true)
    try {
      const [analyticsRes, tablesRes, onlineRes, eightySixRes, briefRes, anomalyRes] = await Promise.all([
        fetch('/api/pos/restaurant/analytics?days=1', { headers: session.headers }),
        fetch('/api/pos/restaurant/tables', { headers: session.headers }),
        fetch('/api/pos/restaurant/online-orders?status=pending', { headers: session.headers }),
        fetch('/api/pos/restaurant/eighty-six', { headers: session.headers }),
        fetch('/api/pos/restaurant/daily-brief', { headers: session.headers }),
        fetch('/api/pos/restaurant/anomalies', { headers: session.headers }),
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
      const orderCount = k.total_orders || 0
      setKpis([
        { label: tc('restaurant.kpi_revenue_today'), value: `${sym}${(k.total_revenue || 0).toFixed(2)}`, sub: tc('restaurant.kpi_revenue_today_sub_' + (orderCount === 1 ? 'one' : 'other'), { count: orderCount }), status: 'good' },
        { label: tc('restaurant.kpi_covers'), value: `${k.total_covers || 0}`, sub: tc('restaurant.kpi_covers_sub', { sym, amount: (k.avg_per_cover || 0).toFixed(2) }), status: 'neutral' },
        { label: tc('restaurant.kpi_avg_ticket'), value: `${sym}${(k.avg_ticket || 0).toFixed(2)}`, sub: tc('restaurant.kpi_avg_ticket_sub'), status: 'neutral' },
        { label: tc('restaurant.kpi_food_cost'), value: `${k.food_cost_pct || 0}%`, sub: tc('restaurant.kpi_food_cost_sub'), status: foodOk ? 'good' : 'bad' },
        { label: tc('restaurant.kpi_labour_cost'), value: `${k.labor_cost_pct || 0}%`, sub: tc('restaurant.kpi_labour_cost_sub'), status: laborOk ? 'good' : 'warn' },
        { label: tc('restaurant.kpi_prime_cost'), value: `${k.prime_cost_pct || 0}%`, sub: tc('restaurant.kpi_prime_cost_sub'), status: primeOk ? 'good' : 'bad' },
        { label: tc('restaurant.kpi_avg_dwell'), value: tc('restaurant.kpi_avg_dwell_value', { mins: k.avg_dwell_mins || 0 }), sub: tc('restaurant.kpi_avg_dwell_sub'), status: 'neutral' },
        { label: tc('restaurant.kpi_avg_prep'), value: tc('restaurant.kpi_avg_prep_value', { mins: k.avg_prep_mins || 0 }), sub: tc('restaurant.kpi_avg_prep_sub'), status: (k.avg_prep_mins || 0) <= 15 ? 'good' : 'warn' },
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
    if (!session) return
    setAccepting(id)
    await fetch('/api/pos/restaurant/online-orders', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
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
    good: tokens.success, warn: tokens.warning, bad: tokens.danger, neutral: tokens.hint,
  }
  const statusRing: Record<string, string> = {
    good: tokens.successRing, warn: 'rgba(249,115,22,.25)', bad: tokens.dangerRing, neutral: tokens.border,
  }

  const nav = [
    { label: tc('restaurant.nav_get_listed_label'),  href: '/restaurant/get-listed',     desc: tc('restaurant.nav_get_listed_desc') },
    { label: tc('restaurant.nav_floor_label'),       href: '/restaurant/floor',         desc: tc('restaurant.nav_floor_desc') },
    { label: tc('restaurant.nav_orders_label'),      href: '/restaurant/orders',        desc: tc('restaurant.nav_orders_desc') },
    { label: tc('restaurant.nav_kitchen_label'),     href: '/restaurant/kitchen',       desc: tc('restaurant.nav_kitchen_desc') },
    { label: tc('restaurant.nav_menu_label'),        href: '/restaurant/menu',          desc: tc('restaurant.nav_menu_desc') },
    { label: tc('restaurant.nav_labour_label'),      href: '/restaurant/labor',         desc: tc('restaurant.nav_labour_desc') },
    { label: tc('restaurant.nav_online_label'),      href: '/restaurant/online-orders', desc: tc('restaurant.nav_online_desc') },
    { label: tc('restaurant.nav_reservations_label'), href: '/restaurant/reservations', desc: tc('restaurant.nav_reservations_desc') },
    { label: tc('restaurant.nav_deliveries_label'),  href: '/restaurant/deliveries',    desc: tc('restaurant.nav_deliveries_desc') },
    { label: tc('restaurant.nav_waste_label'),       href: '/restaurant/waste',         desc: tc('restaurant.nav_waste_desc') },
    { label: tc('restaurant.nav_staff_label'),       href: '/restaurant/staff',         desc: tc('restaurant.nav_staff_desc') },
  ]

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>{tc('restaurant.header_title')}</div>
          <div style={{ fontSize: 12, color: tokens.hint }}>{tc('restaurant.header_subtitle')}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pendingOnline.length > 0 && (
            <div style={{ background: tokens.danger, color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, animation: 'pulse 1s infinite' }}>
              {tc('restaurant.online_orders_pending_' + (pendingOnline.length === 1 ? 'one' : 'other'), { count: pendingOnline.length })}
            </div>
          )}
          <Button variant="secondary" onClick={() => router.push('/pos')}>
            {tc('restaurant.back_pos')}
          </Button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Pending Online Orders — top alert */}
        {pendingOnline.length > 0 && (
          <div className="pos-banner" style={{ background: tokens.dangerPale, border: `1px solid ${tokens.dangerRing}`, borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: tokens.danger, marginBottom: 12 }}>{tc('restaurant.online_awaiting')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingOnline.map((o, idx) => (
                <ListItem key={o.id} index={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: tokens.surface, padding: '10px 14px', borderRadius: 8 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: tokens.ink }}>{o.customer_name || tc('restaurant.customer_fallback')}</span>
                    <span style={{ color: tokens.danger, marginLeft: 8 }}>{sym}{o.total?.toFixed(2)}</span>
                    <span style={{ color: tokens.hint, marginLeft: 8, fontSize: 12 }}>{tc('restaurant.via_source', { source: o.source })}</span>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => acceptOnline(o.id)}
                    disabled={accepting === o.id}
                    style={{ padding: '6px 16px', borderRadius: 6 }}
                  >
                    {accepting === o.id ? '...' : tc('restaurant.accept')}
                  </Button>
                </ListItem>
              ))}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {kpis.map(kpi => (
            <Card key={kpi.label} style={{ border: `1px solid ${kpi.status ? statusRing[kpi.status] : tokens.border}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: kpi.status ? statusColor[kpi.status] : tokens.ink, margin: '4px 0' }}>{kpi.value}</div>
              {kpi.sub && <div style={{ fontSize: 11, color: tokens.muted }}>{kpi.sub}</div>}
            </Card>
          ))}
        </div>

        {/* Anomaly alerts */}
        {anomalies.length > 0 && (
          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {anomalies.map((a, i) => {
              const bg = a.severity === 'critical' ? tokens.dangerPale : a.severity === 'warning' ? 'rgba(249,115,22,.08)' : tokens.accentPale
              const border = a.severity === 'critical' ? tokens.dangerRing : a.severity === 'warning' ? 'rgba(249,115,22,.25)' : tokens.accentRing
              const icon = a.severity === 'critical' ? '🚨' : a.severity === 'warning' ? '⚠️' : 'ℹ️'
              return (
                <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 420 }}>
                  <span>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: tokens.ink }}>{a.title}</div>
                  </div>
                  {a.prompt && (
                    <button
                      onClick={() => router.push(`/pos?q=${encodeURIComponent(a.prompt)}`)}
                      style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, color: tokens.muted, padding: '3px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}
                    >
                      {tc('restaurant.ask_ai')}
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (!session) return
                      await fetch('/api/pos/restaurant/anomalies', { method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: (a as any).id }) })
                      setAnomalies(prev => prev.filter((_, idx) => idx !== i))
                    }}
                    style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
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
          <div className="pos-reveal" style={{ background: tokens.surface, border: `1px solid ${tokens.accentRing}`, borderRadius: 12, padding: '18px 20px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {/* Health score ring */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <svg width={64} height={64} viewBox="0 0 64 64">
                <circle cx={32} cy={32} r={26} fill="none" stroke={tokens.border} strokeWidth={6} />
                <circle
                  cx={32} cy={32} r={26} fill="none"
                  stroke={brief.health_score >= 75 ? tokens.success : brief.health_score >= 50 ? tokens.warning : tokens.danger}
                  strokeWidth={6} strokeLinecap="round"
                  strokeDasharray={`${(brief.health_score / 100) * 163.4} 163.4`}
                  transform="rotate(-90 32 32)"
                />
                <text x={32} y={37} textAnchor="middle" fill={tokens.ink} fontSize={14} fontWeight={700}>{brief.health_score}</text>
              </svg>
              <div style={{ fontSize: 10, color: tokens.muted, marginTop: 2 }}>{tc('restaurant.brief_health')}</div>
            </div>
            {/* Brief text */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.success, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{tc('restaurant.brief_going_well')}</div>
                <div style={{ fontSize: 13, color: tokens.ink, lineHeight: 1.4 }}>{brief.improved}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: tokens.warning, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{tc('restaurant.brief_watch_out')}</div>
                <div style={{ fontSize: 13, color: tokens.ink, lineHeight: 1.4 }}>{brief.worsened}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: ACC, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{tc('restaurant.brief_action')}</div>
                <div style={{ fontSize: 13, color: tokens.ink, lineHeight: 1.4 }}>{brief.action}</div>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push('/pos?q=Give+me+a+full+restaurant+performance+analysis+for+today')}
              style={{ flexShrink: 0 }}
            >
              {tc('restaurant.brief_deep_dive')}
            </Button>
          </div>
        )}

        {/* 86 Board */}
        {eightySix.length > 0 && (
          <div style={{ background: tokens.surface, border: `1px solid ${tokens.warning}`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>🚫</span>
            <div>
              <div style={{ fontWeight: 700, color: tokens.warning, fontSize: 13 }}>{tc('restaurant.eighty_six_title')}</div>
              <div style={{ color: tokens.ink, fontSize: 13, marginTop: 2 }}>{eightySix.join(' · ')}</div>
            </div>
            <Button variant="secondary" onClick={() => router.push('/restaurant/menu')} style={{ marginLeft: 'auto' }}>
              {tc('restaurant.manage_menu')}
            </Button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Table Status */}
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{tc('restaurant.table_status')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: tc('restaurant.table_occupied'), count: tablesByStatus.occupied, color: tokens.danger },
                { label: tc('restaurant.table_available'), count: tablesByStatus.available, color: tokens.success },
                { label: tc('restaurant.table_cleaning'), count: tablesByStatus.cleaning, color: tokens.warning },
                { label: tc('restaurant.table_reserved'), count: tablesByStatus.reserved, color: 'var(--factory-dispatch)' },
              ].map(s => (
                <div key={s.label} style={{ background: tokens.bg, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: tokens.hint }}>{s.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
            <Button variant="primary" onClick={() => router.push('/restaurant/floor')} style={{ width: '100%' }}>
              {tc('restaurant.open_floor_plan')}
            </Button>
          </Card>

          {/* Top Dishes */}
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>{tc('restaurant.top_dishes_title')}</div>
            {topDishes.length === 0 && <div style={{ color: tokens.muted, fontSize: 13 }}>{tc('restaurant.no_orders_yet')}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topDishes.map((dish, i) => (
                <ListItem key={dish.name} index={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: tokens.muted, fontSize: 12, width: 16, textAlign: 'right' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{dish.name}</div>
                    <div style={{ fontSize: 11, color: tokens.muted }}>{tc('restaurant.dish_sold_revenue', { qty: dish.qty, sym, revenue: dish.revenue?.toFixed(2) ?? '0.00' })}</div>
                  </div>
                  <div style={{ fontSize: 12, color: dish.margin_pct >= 65 ? tokens.success : dish.margin_pct >= 50 ? tokens.warning : tokens.danger, fontWeight: 700 }}>
                    {dish.margin_pct}%
                  </div>
                </ListItem>
              ))}
            </div>
          </Card>
        </div>

        {/* Menu Engineering Matrix */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <MenuMatrix sym={sym} />
        </Card>

        {/* Shift Profitability */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <ShiftProfitability sym={sym} />
        </Card>

        {/* WhatsApp Autopilot */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <WhatsAppAutopilot />
        </Card>

        {/* Navigation tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {nav.map((n, idx) => {
            const isGetListed = n.href === '/restaurant/get-listed'
            const badge = isGetListed && readinessScore != null
              ? (readinessScore >= 100 ? tc('restaurant.get_listed_done') : tc('restaurant.get_listed_ready', { score: readinessScore }))
              : null
            const done = readinessScore != null && readinessScore >= 100
            return (
            <button key={n.href} onClick={() => router.push(n.href)}
              className="pos-item"
              style={{ position: 'relative', background: tokens.surface, border: `1px solid ${isGetListed ? tokens.accentRing : tokens.border}`, borderRadius: 12, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s', animationDelay: `${Math.min(idx, 8) * 40}ms` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = isGetListed ? tokens.accentRing : tokens.border)}
            >
              {badge && <span style={{ position: 'absolute', top: 12, right: 12, background: done ? tokens.success : ACC, color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, fontVariantNumeric: 'tabular-nums' }}>{badge}</span>}
              <div style={{ fontSize: 22, marginBottom: 6 }}>{n.label.split(' ')[0]}</div>
              <div style={{ fontWeight: 600, color: tokens.ink, fontSize: 14 }}>{n.label.split(' ').slice(1).join(' ')}</div>
              <div style={{ color: tokens.muted, fontSize: 12, marginTop: 2 }}>{n.desc}</div>
            </button>
          )})}
        </div>
      </div>
    </div>
  )
}
