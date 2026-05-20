'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#0891b2'
const ACC_LIGHT = 'rgba(8,145,178,.1)'
const ACC_BORDER = 'rgba(8,145,178,.25)'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface Staff { id: string; name: string; role: string; owner_id: string; location_id: string | null; currency_symbol: string; business_type: string }

interface Parcel {
  id: string; tracking_number: string; status: string
  sender_name: string | null; receiver_name: string | null
  destination_city: string | null; description: string | null
  weight_kg: number | null; fee_charged: number | null
  payment_status: string | null; created_at: string
  dispatched_at: string | null; delivered_at: string | null
  truck?: { id: string; plate_number: string } | null
  driver?: { id: string; name: string } | null
  sender_branch?: { id: string; name: string } | null
  destination_branch?: { id: string; name: string } | null
}

interface Truck { id: string; plate_number: string; make_model: string | null; status: string }

type Tab = 'overview' | 'parcels' | 'fleet' | 'revenue'

const STATUS_LABEL: Record<string, string> = {
  received: 'Received', at_branch: 'At Branch', assigned: 'Assigned',
  loaded: 'Loaded', in_transit: 'In Transit', at_destination: 'At Destination',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  collected: 'Collected', failed_delivery: 'Failed', returned: 'Returned',
}
const STATUS_COLOR: Record<string, string> = {
  received: AMBER, at_branch: ACC, assigned: ACC, loaded: ACC,
  in_transit: '#6366f1', at_destination: GREEN, out_for_delivery: '#6366f1',
  delivered: GREEN, collected: GREEN, failed_delivery: RED, returned: RED,
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}

export default function BranchDashboardPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('pos_staff')
    if (!raw) { router.push('/'); return }
    const s = JSON.parse(raw) as Staff
    if (!['branch_manager', 'manager'].includes(s.role)) {
      router.push(s.role === 'handler' || s.role === 'driver' ? '/logistics' : s.role === 'dispatcher' ? '/logistics/dispatch' : '/')
      return
    }
    setStaff(s)
    setReady(true)
    loadAll(s)
  }, [router])

  const hdrs = useCallback((s: Staff) => ({
    'Content-Type': 'application/json',
    'x-staff-id': s.id,
    'x-owner-id': s.owner_id,
  }), [])

  const loadAll = async (s: Staff) => {
    setLoading(true)
    try {
      const [pRes, tRes] = await Promise.all([
        fetch(`${API}/api/pos/parcels?limit=200`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/trucks`, { headers: hdrs(s) }),
      ])
      const [pData, tData] = await Promise.all([pRes.json(), tRes.json()])
      setParcels(pData.parcels || [])
      setTrucks(tData.trucks || [])
    } catch {}
    setLoading(false)
  }

  // Stats
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const todayParcels = parcels.filter(p => new Date(p.created_at) >= today)
  const inTransit = parcels.filter(p => ['in_transit', 'out_for_delivery'].includes(p.status))
  const atBranch = parcels.filter(p => ['received', 'at_branch', 'assigned', 'loaded', 'at_destination'].includes(p.status))
  const delivered = parcels.filter(p => ['delivered', 'collected'].includes(p.status))
  const failed = parcels.filter(p => p.status === 'failed_delivery')

  const totalRevenue = parcels.reduce((sum, p) => sum + (p.fee_charged || 0), 0)
  const todayRevenue = todayParcels.reduce((sum, p) => sum + (p.fee_charged || 0), 0)
  const unpaid = parcels.filter(p => p.payment_status === 'unpaid').reduce((sum, p) => sum + (p.fee_charged || 0), 0)
  const currency = staff?.currency_symbol || 'KES'

  const trucksAvailable = trucks.filter(t => t.status === 'available').length
  const trucksInTransit = trucks.filter(t => t.status === 'in_transit').length
  const trucksMaintenance = trucks.filter(t => t.status === 'maintenance').length

  // Delivery rate
  const completedTotal = delivered.length + failed.length
  const deliveryRate = completedTotal > 0 ? Math.round((delivered.length / completedTotal) * 100) : 0

  // Status breakdown
  const statusBreakdown = Object.entries(
    parcels.reduce<Record<string, number>>((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1])

  if (!ready) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f8f6' }}>Loading…</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e2dc', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1916' }}>📊 Branch Dashboard</div>
          <div style={{ fontSize: 11, color: '#6b6760' }}>{staff?.name} · Branch Manager</div>
        </div>
        <button onClick={() => router.push('/logistics/dispatch')} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🚛 Dispatch</button>
        <button onClick={() => staff && loadAll(staff)} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>↻</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e2dc', background: '#fff' }}>
        {(['overview', 'parcels', 'fleet', 'revenue'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '10px 4px', border: 'none', background: tab === t ? ACC_LIGHT : 'transparent', borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: tab === t ? ACC : '#6b6760', textTransform: 'capitalize' }}>
            {t === 'overview' ? '📋 Overview' : t === 'parcels' ? '📦 Parcels' : t === 'fleet' ? '🚛 Fleet' : '💰 Revenue'}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b6760' }}>Loading dashboard…</div>
        ) : tab === 'overview' ? (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <StatCard label="Today" value={todayParcels.length} sub="parcels received" color={ACC} />
              <StatCard label="In Transit" value={inTransit.length} sub="on the road" color="#6366f1" />
              <StatCard label="At Branch" value={atBranch.length} sub="pending action" color={AMBER} />
              <StatCard label="Delivered" value={delivered.length} sub={`${deliveryRate}% success rate`} color={GREEN} />
            </div>

            {/* Revenue summary */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 8 }}>💰 Revenue</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#6b6760' }}>Today</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{currency} {todayRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#6b6760' }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1916' }}>{currency} {totalRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#6b6760' }}>Unpaid</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: unpaid > 0 ? RED : '#6b6760' }}>{currency} {unpaid.toLocaleString()}</span>
              </div>
            </div>

            {/* Status breakdown */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 10 }}>📊 Status Breakdown</div>
              {statusBreakdown.map(([status, count]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[status] || '#6b6760', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: '#6b6760' }}>{STATUS_LABEL[status] || status}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1916' }}>{count}</span>
                  <div style={{ width: 60, height: 6, background: '#f0ede8', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((count / parcels.length) * 100, 100)}%`, height: '100%', background: STATUS_COLOR[status] || '#6b6760', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Fleet at a glance */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 10 }}>🚛 Fleet</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <FleetPill label="Available" count={trucksAvailable} color={GREEN} />
                <FleetPill label="In Transit" count={trucksInTransit} color="#6366f1" />
                <FleetPill label="Maintenance" count={trucksMaintenance} color={RED} />
              </div>
            </div>

            {/* Recent activity */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 10 }}>🕒 Recent Parcels</div>
              {parcels.slice(0, 8).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f0ede8' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#1a1916' }}>{p.tracking_number}</span>
                  <span style={{ flex: 1, fontSize: 11, color: '#6b6760', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.receiver_name || p.destination_city || '—'}</span>
                  <span style={{ background: `${STATUS_COLOR[p.status] || '#6b6760'}18`, color: STATUS_COLOR[p.status] || '#6b6760', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{STATUS_LABEL[p.status] || p.status}</span>
                  <span style={{ fontSize: 10, color: '#9b978f', whiteSpace: 'nowrap' }}>{timeAgo(p.created_at)}</span>
                </div>
              ))}
            </div>
          </>
        ) : tab === 'parcels' ? (
          <ParcelList parcels={parcels} currency={currency} />
        ) : tab === 'fleet' ? (
          <FleetView trucks={trucks} parcels={parcels} />
        ) : (
          <RevenueView parcels={parcels} currency={currency} />
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6760', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#9b978f' }}>{sub}</div>
    </div>
  )
}

function FleetPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
      <span style={{ fontSize: 12, color: '#6b6760' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color }}>{count}</span>
    </div>
  )
}

function ParcelList({ parcels, currency }: { parcels: Parcel[]; currency: string }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = parcels.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (p.tracking_number?.toLowerCase().includes(q) ||
        p.sender_name?.toLowerCase().includes(q) ||
        p.receiver_name?.toLowerCase().includes(q) ||
        p.destination_city?.toLowerCase().includes(q))
    }
    return true
  })

  const statuses = [...new Set(parcels.map(p => p.status))]

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e2dc', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid #e5e2dc', borderRadius: 8, fontSize: 12 }}>
          <option value="">All</option>
          {statuses.map(s => <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 8 }}>{filtered.length} parcels</div>
      {filtered.map(p => (
        <div key={p.id} style={{ background: '#fff', borderRadius: 10, padding: 10, border: '1px solid #e5e2dc', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{p.tracking_number}</span>
            <span style={{ marginLeft: 'auto', background: `${STATUS_COLOR[p.status] || '#6b6760'}18`, color: STATUS_COLOR[p.status] || '#6b6760', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{STATUS_LABEL[p.status] || p.status}</span>
          </div>
          <div style={{ fontSize: 11, color: '#6b6760', lineHeight: 1.5 }}>
            <div>{p.sender_name || '—'} → {p.receiver_name || '—'}</div>
            <div>📍 {p.destination_city || p.destination_branch?.name || '—'} {p.weight_kg ? `· ${p.weight_kg}kg` : ''}</div>
            {p.fee_charged ? <div>💰 {currency} {p.fee_charged.toLocaleString()} · {p.payment_status || '—'}</div> : null}
            {p.truck && <div>🚛 {p.truck.plate_number} {p.driver ? `· ${p.driver.name}` : ''}</div>}
            <div style={{ fontSize: 10, color: '#9b978f' }}>{timeAgo(p.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FleetView({ trucks, parcels }: { trucks: Truck[]; parcels: Parcel[] }) {
  const truckParcels = (truckId: string) => parcels.filter(p => p.truck?.id === truckId && ['assigned', 'loaded', 'in_transit', 'out_for_delivery'].includes(p.status))

  const statusStyle = (s: string) => ({
    available: { bg: `${GREEN}18`, color: GREEN, label: 'Available' },
    in_transit: { bg: '#6366f118', color: '#6366f1', label: 'In Transit' },
    maintenance: { bg: `${RED}18`, color: RED, label: 'Maintenance' },
  }[s] || { bg: '#e5e2dc', color: '#6b6760', label: s })

  return (
    <div>
      <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 8 }}>{trucks.length} trucks</div>
      {trucks.map(t => {
        const st = statusStyle(t.status)
        const tp = truckParcels(t.id)
        return (
          <div key={t.id} style={{ background: '#fff', borderRadius: 10, padding: 12, border: '1px solid #e5e2dc', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1916' }}>{t.plate_number}</span>
              {t.make_model && <span style={{ fontSize: 11, color: '#6b6760' }}>{t.make_model}</span>}
              <span style={{ marginLeft: 'auto', background: st.bg, color: st.color, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{st.label}</span>
            </div>
            {tp.length > 0 && (
              <div style={{ fontSize: 11, color: '#6b6760' }}>
                📦 {tp.length} parcel{tp.length !== 1 ? 's' : ''} — {tp.map(p => p.tracking_number).join(', ')}
              </div>
            )}
          </div>
        )
      })}
      {trucks.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#6b6760', fontSize: 13 }}>No trucks registered yet</div>}
    </div>
  )
}

function RevenueView({ parcels, currency }: { parcels: Parcel[]; currency: string }) {
  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
  const weekStart = new Date(now); weekStart.setDate(weekStart.getDate() - 7)
  const monthStart = new Date(now); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0)

  const sum = (ps: Parcel[]) => ps.reduce((a, p) => a + (p.fee_charged || 0), 0)
  const todayP = parcels.filter(p => new Date(p.created_at) >= todayStart)
  const weekP = parcels.filter(p => new Date(p.created_at) >= weekStart)
  const monthP = parcels.filter(p => new Date(p.created_at) >= monthStart)

  const paid = parcels.filter(p => p.payment_status === 'paid')
  const unpaid = parcels.filter(p => p.payment_status === 'unpaid')
  const partial = parcels.filter(p => p.payment_status === 'partial')

  const byCity = Object.entries(
    parcels.reduce<Record<string, { count: number; revenue: number }>>((acc, p) => {
      const city = p.destination_city || 'Unknown'
      if (!acc[city]) acc[city] = { count: 0, revenue: 0 }
      acc[city].count++
      acc[city].revenue += p.fee_charged || 0
      return acc
    }, {})
  ).sort((a, b) => b[1].revenue - a[1].revenue)

  return (
    <div>
      {/* Period breakdown */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 10 }}>📈 Revenue by Period</div>
        <Row label="Today" count={todayP.length} amount={sum(todayP)} currency={currency} />
        <Row label="Last 7 days" count={weekP.length} amount={sum(weekP)} currency={currency} />
        <Row label="This month" count={monthP.length} amount={sum(monthP)} currency={currency} />
        <Row label="All time" count={parcels.length} amount={sum(parcels)} currency={currency} bold />
      </div>

      {/* Payment status */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 10 }}>💳 Payment Status</div>
        <Row label="Paid" count={paid.length} amount={sum(paid)} currency={currency} color={GREEN} />
        <Row label="Unpaid" count={unpaid.length} amount={sum(unpaid)} currency={currency} color={RED} />
        <Row label="Partial" count={partial.length} amount={sum(partial)} currency={currency} color={AMBER} />
      </div>

      {/* Revenue by destination */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e5e2dc' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1916', marginBottom: 10 }}>🗺️ Revenue by Destination</div>
        {byCity.map(([city, data]) => (
          <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ flex: 1, fontSize: 12, color: '#6b6760' }}>{city}</span>
            <span style={{ fontSize: 11, color: '#9b978f' }}>{data.count} pkgs</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1916' }}>{currency} {data.revenue.toLocaleString()}</span>
          </div>
        ))}
        {byCity.length === 0 && <div style={{ fontSize: 12, color: '#9b978f' }}>No data yet</div>}
      </div>
    </div>
  )
}

function Row({ label, count, amount, currency, color, bold }: { label: string; count: number; amount: number; currency: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      {color && <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />}
      <span style={{ flex: 1, fontSize: 12, color: '#6b6760', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 11, color: '#9b978f' }}>{count} pkgs</span>
      <span style={{ fontSize: 12, fontWeight: bold ? 800 : 700, color: color || '#1a1916' }}>{currency} {amount.toLocaleString()}</span>
    </div>
  )
}
