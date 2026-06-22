'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsBranchLevel, isManagerOrAboveLevel, getRoleHomeRoute } from '@/lib/pos-role-client'
import { useLang } from '@/components/LanguageProvider'

type Tc = (key: string, vars?: Record<string, string | number>) => string

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

interface Truck { id: string; plate_number?: string; registration?: string; make_model: string | null; capacity_kg?: number | null; status: string; assigned_driver_id?: string | null }

interface TruckLocation { truck_id: string; registration: string; lat: number; lng: number; recorded_at: string; driver_name: string | null }

type Tab = 'overview' | 'parcels' | 'fleet' | 'routes' | 'revenue'

interface Branch { id: string; name: string }
interface Route {
  id: string; name: string | null; active: boolean
  origin_branch_id: string; destination_branch_id: string
  price_per_kg: number | null; flat_rate: number | null
  origin?: { id: string; name: string } | null
  destination?: { id: string; name: string } | null
}

// Trucks may come back as `registration` (new API) or `plate_number` (legacy)
const truckReg = (t: Truck) => t.registration || t.plate_number || '—'

const statusLabel = (status: string, tc: Tc) => {
  const known = ['received', 'at_branch', 'assigned', 'loaded', 'in_transit', 'at_destination', 'out_for_delivery', 'delivered', 'collected', 'failed_delivery', 'returned']
  return known.includes(status) ? tc('logistics_dashboard.status_' + status) : status
}
const STATUS_COLOR: Record<string, string> = {
  received: AMBER, at_branch: ACC, assigned: ACC, loaded: ACC,
  in_transit: '#6366f1', at_destination: GREEN, out_for_delivery: '#6366f1',
  delivered: GREEN, collected: GREEN, failed_delivery: RED, returned: RED,
}

function timeAgo(iso: string, tc: Tc) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return tc('logistics_dashboard.time_just_now')
  if (s < 3600) return tc('logistics_dashboard.time_minutes_ago', { n: Math.floor(s / 60) })
  if (s < 86400) return tc('logistics_dashboard.time_hours_ago', { n: Math.floor(s / 3600) })
  return new Date(iso).toLocaleDateString()
}

export default function BranchDashboardPage() {
  const router = useRouter()
  const { tc } = useLang()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [locations, setLocations] = useState<TruckLocation[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  // Add-truck modal
  const [showAddTruck, setShowAddTruck] = useState(false)
  const [newReg, setNewReg] = useState('')
  const [newModel, setNewModel] = useState('')
  const [newCapacity, setNewCapacity] = useState('')
  const [addingTruck, setAddingTruck] = useState(false)
  const [addError, setAddError] = useState('')
  const [scanningPlate, setScanningPlate] = useState(false)
  const [plateMsg, setPlateMsg] = useState('')
  const plateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const raw = localStorage.getItem('pos_staff')
    if (!raw) { router.push('/'); return }
    const s = JSON.parse(raw) as Staff
    if (!isLogisticsBranchLevel(s.role) && !isManagerOrAboveLevel(s.role)) {
      router.push(getRoleHomeRoute(s.role))
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
      const [pRes, tRes, rRes, lRes] = await Promise.all([
        fetch(`${API}/api/pos/parcels?limit=200`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/trucks`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/routes`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/locations`, { headers: hdrs(s) }),
      ])
      const [pData, tData, rData, lData] = await Promise.all([pRes.json(), tRes.json(), rRes.json(), lRes.json()])
      setParcels(pData.parcels || [])
      setTrucks(tData.trucks || [])
      setRoutes(rData.routes || [])
      setBranches(lData.locations || [])
    } catch {}
    setLoading(false)
    loadLocations(s)
  }

  const reloadRoutes = useCallback(async (s: Staff) => {
    try {
      const res = await fetch(`${API}/api/pos/routes`, { headers: hdrs(s) })
      const data = await res.json()
      setRoutes(data.routes || [])
    } catch {}
  }, [hdrs])

  const loadLocations = useCallback(async (s: Staff) => {
    try {
      const res = await fetch(`${API}/api/pos/truck-locations?latest=true`, { headers: hdrs(s) })
      const data = await res.json()
      setLocations(data.locations || [])
    } catch {}
  }, [hdrs])

  // Refresh fleet locations every 60s
  useEffect(() => {
    if (!staff) return
    const t = setInterval(() => loadLocations(staff), 60_000)
    return () => clearInterval(t)
  }, [staff, loadLocations])

  const addTruck = async () => {
    if (!staff || !newReg.trim()) { setAddError(tc('logistics_dashboard.err_registration_required')); return }
    setAddingTruck(true); setAddError('')
    try {
      const res = await fetch(`${API}/api/pos/trucks`, {
        method: 'POST',
        headers: hdrs(staff),
        body: JSON.stringify({
          registration: newReg.trim(),
          make_model: newModel.trim() || null,
          capacity_kg: newCapacity ? Number(newCapacity) : null,
        }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      // Optimistically add, then refresh the full list so it stays in sync
      if (data.truck) setTrucks(prev => [data.truck as Truck, ...prev])
      setShowAddTruck(false)
      setNewReg(''); setNewModel(''); setNewCapacity(''); setPlateMsg('')
      await loadAll(staff)
    } catch {
      setAddError(tc('logistics_dashboard.err_add_truck_failed'))
    }
    setAddingTruck(false)
  }

  // Camera-first: read the number plate (and make/model) from a photo
  const scanPlate = async (file: File) => {
    if (!staff) return
    setScanningPlate(true); setPlateMsg(''); setAddError('')
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch(`${API}/api/pos/trucks/scan-plate`, {
        method: 'POST',
        headers: hdrs(staff),
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (data.registration) {
        setNewReg(data.registration)
        if (data.make_model && !newModel.trim()) setNewModel(data.make_model)
        setPlateMsg(data.confidence === 'low' ? tc('logistics_dashboard.plate_low_confidence') : tc('logistics_dashboard.plate_read_ok'))
      } else {
        setPlateMsg(tc('logistics_dashboard.plate_not_read'))
      }
    } catch {
      setPlateMsg(tc('logistics_dashboard.plate_scan_failed'))
    }
    setScanningPlate(false)
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

  if (!ready) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>{tc('logistics_dashboard.loading')}</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>{tc('logistics_dashboard.header_title')}</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{tc('logistics_dashboard.header_role', { name: staff?.name || '' })}</div>
        </div>
        <button onClick={() => router.push('/logistics/dispatch')} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{tc('logistics_dashboard.btn_dispatch')}</button>
        <button onClick={() => staff && loadAll(staff)} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>↻</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--pos-border)', background: 'var(--pos-surface)' }}>
        {(['overview', 'parcels', 'fleet', 'routes', 'revenue'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '10px 2px', border: 'none', background: tab === t ? ACC_LIGHT : 'transparent', borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent', cursor: 'pointer', fontSize: 10.5, fontWeight: 700, color: tab === t ? ACC : 'var(--pos-muted)' }}>
            {tc('logistics_dashboard.tab_' + t)}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pos-muted)' }}>{tc('logistics_dashboard.loading_dashboard')}</div>
        ) : tab === 'overview' ? (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <StatCard label={tc('logistics_dashboard.kpi_today')} value={todayParcels.length} sub={tc('logistics_dashboard.kpi_today_sub')} color={ACC} />
              <StatCard label={tc('logistics_dashboard.kpi_in_transit')} value={inTransit.length} sub={tc('logistics_dashboard.kpi_in_transit_sub')} color="#6366f1" />
              <StatCard label={tc('logistics_dashboard.kpi_at_branch')} value={atBranch.length} sub={tc('logistics_dashboard.kpi_at_branch_sub')} color={AMBER} />
              <StatCard label={tc('logistics_dashboard.kpi_delivered')} value={delivered.length} sub={tc('logistics_dashboard.kpi_delivered_sub', { rate: deliveryRate })} color={GREEN} />
            </div>

            {/* Revenue summary */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 8 }}>{tc('logistics_dashboard.revenue_title')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics_dashboard.revenue_today')}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{currency} {todayRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics_dashboard.revenue_total')}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{currency} {totalRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics_dashboard.revenue_unpaid')}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: unpaid > 0 ? RED : 'var(--pos-muted)' }}>{currency} {unpaid.toLocaleString()}</span>
              </div>
            </div>

            {/* Status breakdown */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_dashboard.status_breakdown_title')}</div>
              {statusBreakdown.map(([status, count]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[status] || 'var(--pos-muted)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--pos-muted)' }}>{statusLabel(status, tc)}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)' }}>{count}</span>
                  <div style={{ width: 60, height: 6, background: '#f0ede8', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((count / parcels.length) * 100, 100)}%`, height: '100%', background: STATUS_COLOR[status] || 'var(--pos-muted)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Fleet at a glance */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_dashboard.fleet_title')}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <FleetPill label={tc('logistics_dashboard.fleet_available')} count={trucksAvailable} color={GREEN} />
                <FleetPill label={tc('logistics_dashboard.fleet_in_transit')} count={trucksInTransit} color="#6366f1" />
                <FleetPill label={tc('logistics_dashboard.fleet_maintenance')} count={trucksMaintenance} color={RED} />
              </div>
            </div>

            {/* Recent activity */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_dashboard.recent_parcels_title')}</div>
              {parcels.slice(0, 8).map((p, idx) => (
                <div key={p.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f0ede8', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--pos-ink)' }}>{p.tracking_number}</span>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--pos-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.receiver_name || p.destination_city || '—'}</span>
                  <span style={{ background: `${STATUS_COLOR[p.status] || 'var(--pos-muted)'}18`, color: STATUS_COLOR[p.status] || 'var(--pos-muted)', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{statusLabel(p.status, tc)}</span>
                  <span style={{ fontSize: 10, color: 'var(--pos-hint)', whiteSpace: 'nowrap' }}>{timeAgo(p.created_at, tc)}</span>
                </div>
              ))}
            </div>
          </>
        ) : tab === 'parcels' ? (
          <ParcelList parcels={parcels} currency={currency} tc={tc} />
        ) : tab === 'fleet' ? (
          <FleetView trucks={trucks} parcels={parcels} locations={locations} onAddTruck={() => { setAddError(''); setShowAddTruck(true) }} tc={tc} />
        ) : tab === 'routes' ? (
          <RoutesView routes={routes} branches={branches} currency={currency} homeBranchId={staff?.location_id || null}
            hdrs={staff ? hdrs(staff) : {}} onChanged={() => staff && reloadRoutes(staff)} tc={tc} />
        ) : (
          <RevenueView parcels={parcels} currency={currency} tc={tc} />
        )}
      </div>

      {/* Add Truck modal */}
      {showAddTruck && (
        <div onClick={() => !addingTruck && setShowAddTruck(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} className="pos-sheet" style={{ background: 'var(--pos-surface)', borderRadius: '16px 16px 0 0', padding: 20, width: '100%', maxWidth: 500, maxHeight: '85vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>{tc('logistics_dashboard.add_truck_title')}</div>
              <button onClick={() => setShowAddTruck(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--pos-muted)' }}>×</button>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>{tc('logistics_dashboard.label_registration')}</label>
            <input ref={plateInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) scanPlate(f); e.target.value = '' }} />
            <button type="button" onClick={() => plateInputRef.current?.click()} disabled={scanningPlate}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: scanningPlate ? 'wait' : 'pointer', marginBottom: 8 }}>
              {scanningPlate ? tc('logistics_dashboard.reading_plate') : tc('logistics_dashboard.scan_plate_with_camera')}
            </button>
            <input value={newReg} onChange={e => { setNewReg(e.target.value); setPlateMsg('') }} placeholder={tc('logistics_dashboard.placeholder_registration')} autoFocus
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, marginBottom: plateMsg ? 4 : 12, boxSizing: 'border-box', outline: 'none' }} />
            {plateMsg && <div style={{ fontSize: 12, color: plateMsg.startsWith('✓') ? GREEN : AMBER, marginBottom: 12 }}>{plateMsg}</div>}

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>{tc('logistics_dashboard.label_make_model')}</label>
            <input value={newModel} onChange={e => setNewModel(e.target.value)} placeholder={tc('logistics_dashboard.placeholder_make_model')}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }} />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>{tc('logistics_dashboard.label_capacity')}</label>
            <input value={newCapacity} onChange={e => setNewCapacity(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={tc('logistics_dashboard.placeholder_capacity')}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }} />

            {addError && <div style={{ color: RED, fontSize: 13, marginBottom: 12 }}>{addError}</div>}

            <button onClick={addTruck} disabled={addingTruck || !newReg.trim()} className="pos-btn-primary"
              style={{ width: '100%', background: (!newReg.trim()) ? '#ccc' : ACC, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 800, cursor: (!newReg.trim() || addingTruck) ? 'not-allowed' : 'pointer', opacity: (!newReg.trim()) ? 0.5 : 1 }}>
              {addingTruck ? tc('logistics_dashboard.adding') : tc('logistics_dashboard.btn_add_truck')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function RoutesView({ routes, branches, currency, homeBranchId, hdrs, onChanged, tc }: {
  routes: Route[]; branches: Branch[]; currency: string; homeBranchId: string | null
  hdrs: Record<string, string>; onChanged: () => void; tc: Tc
}) {
  const [origin, setOrigin] = useState(homeBranchId || '')
  const [dest, setDest] = useState('')
  const [pricingMode, setPricingMode] = useState<'flat' | 'per_kg'>('flat')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [busyId, setBusyId] = useState('')
  const [editId, setEditId] = useState('')
  const [editPrice, setEditPrice] = useState('')

  const addRoute = async () => {
    if (!origin || !dest) { setErr(tc('logistics_dashboard.err_pick_origin_dest')); return }
    if (origin === dest) { setErr(tc('logistics_dashboard.err_origin_dest_differ')); return }
    const amount = parseFloat(price) || 0
    setSaving(true); setErr('')
    try {
      const res = await fetch(`${API}/api/pos/routes`, {
        method: 'POST', headers: hdrs,
        body: JSON.stringify({
          origin_branch_id: origin, destination_branch_id: dest,
          flat_rate: pricingMode === 'flat' ? amount : 0,
          price_per_kg: pricingMode === 'per_kg' ? amount : 0,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || tc('logistics_dashboard.err_add_route_failed')); setSaving(false); return }
      setDest(''); setPrice('')
      onChanged()
    } catch { setErr(tc('logistics_dashboard.err_network_retry')) }
    setSaving(false)
  }

  const toggleActive = async (r: Route) => {
    setBusyId(r.id)
    try { await fetch(`${API}/api/pos/routes`, { method: 'PATCH', headers: hdrs, body: JSON.stringify({ id: r.id, active: !r.active }) }); onChanged() } catch {}
    setBusyId('')
  }

  const savePrice = async (r: Route) => {
    const amount = parseFloat(editPrice) || 0
    setBusyId(r.id)
    try {
      // Keep the same pricing model the route already uses (flat vs per-kg)
      const body = r.price_per_kg ? { id: r.id, price_per_kg: amount } : { id: r.id, flat_rate: amount }
      await fetch(`${API}/api/pos/routes`, { method: 'PATCH', headers: hdrs, body: JSON.stringify(body) })
      setEditId(''); onChanged()
    } catch {}
    setBusyId('')
  }

  const removeRoute = async (r: Route) => {
    if (typeof window !== 'undefined' && !window.confirm(tc('logistics_dashboard.confirm_delete_route', { origin: r.origin?.name || '', destination: r.destination?.name || '' }))) return
    setBusyId(r.id)
    try { await fetch(`${API}/api/pos/routes?id=${r.id}`, { method: 'DELETE', headers: hdrs }); onChanged() } catch {}
    setBusyId('')
  }

  const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: 'var(--pos-surface)' }

  // Group routes by origin branch so it's obvious which clerks see what
  const byOrigin = new Map<string, Route[]>()
  for (const r of routes) {
    const key = r.origin?.name || tc('logistics_dashboard.unknown_branch')
    if (!byOrigin.has(key)) byOrigin.set(key, [])
    byOrigin.get(key)!.push(r)
  }

  return (
    <div>
      {/* How routes work */}
      <div style={{ background: ACC_LIGHT, border: `1px solid ${ACC_BORDER}`, borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 12.5, color: 'var(--pos-ink)', lineHeight: 1.5 }}>
        {tc('logistics_dashboard.routes_help_1')}<strong>{tc('logistics_dashboard.routes_help_start_strong')}</strong>{tc('logistics_dashboard.routes_help_2')}<strong>{tc('logistics_dashboard.routes_help_from_strong')}</strong>{tc('logistics_dashboard.routes_help_3')}
      </div>

      {/* Add route */}
      <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 12 }}>{tc('logistics_dashboard.add_route_title')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={lbl}>{tc('logistics_dashboard.label_from')}</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} style={{ ...inp, appearance: 'none' }}>
              <option value="">{tc('logistics_dashboard.option_origin')}</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>{tc('logistics_dashboard.label_to')}</label>
            <select value={dest} onChange={e => setDest(e.target.value)} style={{ ...inp, appearance: 'none' }}>
              <option value="">{tc('logistics_dashboard.option_destination')}</option>
              {branches.filter(b => b.id !== origin).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <label style={lbl}>{tc('logistics_dashboard.label_pricing')}</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {([{ id: 'flat', label: tc('logistics_dashboard.pricing_flat') }, { id: 'per_kg', label: tc('logistics_dashboard.pricing_per_kg') }] as const).map(m => (
            <button key={m.id} type="button" onClick={() => setPricingMode(m.id)}
              style={{ flex: 1, padding: '10px', border: `2px solid ${pricingMode === m.id ? ACC : 'var(--pos-border)'}`, borderRadius: 8, background: pricingMode === m.id ? ACC_LIGHT : 'var(--pos-surface)', color: pricingMode === m.id ? ACC : 'var(--pos-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{m.label}</button>
          ))}
        </div>
        <label style={lbl}>{pricingMode === 'flat' ? tc('logistics_dashboard.label_flat_price', { currency }) : tc('logistics_dashboard.label_price_per_kg', { currency })}</label>
        <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={tc('logistics_dashboard.placeholder_price')} style={{ ...inp, marginBottom: 12 }} />
        {err && <div style={{ color: RED, fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button onClick={addRoute} disabled={saving || !origin || !dest}
          style={{ width: '100%', background: (!origin || !dest) ? '#ccc' : ACC, color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 800, cursor: (saving || !origin || !dest) ? 'not-allowed' : 'pointer', opacity: (!origin || !dest) ? 0.6 : 1 }}>
          {saving ? tc('logistics_dashboard.adding') : tc('logistics_dashboard.btn_add_route')}
        </button>
      </div>

      {/* Route list grouped by origin */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-muted)', marginBottom: 8 }}>{routes.length === 1 ? tc('logistics_dashboard.route_count', { count: routes.length }) : tc('logistics_dashboard.route_count_plural', { count: routes.length })}</div>
      {routes.length === 0 ? (
        <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '24px 16px', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 13 }}>
          {tc('logistics_dashboard.routes_empty')}
        </div>
      ) : (
        Array.from(byOrigin.entries()).map(([originName, rs]) => (
          <div key={originName} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ACC, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>{tc('logistics_dashboard.leaving_origin', { origin: originName })}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rs.map(r => (
                <div key={r.id} style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 12, opacity: r.active ? 1 : 0.55 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)' }}>→ {r.destination?.name || '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 2 }}>
                        {r.flat_rate ? tc('logistics_dashboard.rate_flat', { currency, amount: r.flat_rate }) : r.price_per_kg ? tc('logistics_dashboard.rate_per_kg', { currency, amount: r.price_per_kg }) : tc('logistics_dashboard.no_price_set')}
                      </div>
                    </div>
                    <button onClick={() => toggleActive(r)} disabled={busyId === r.id}
                      style={{ background: r.active ? 'var(--pos-success-pale)' : 'var(--pos-border)', color: r.active ? GREEN : 'var(--pos-muted)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      {busyId === r.id ? '…' : r.active ? tc('logistics_dashboard.route_active') : tc('logistics_dashboard.route_off')}
                    </button>
                  </div>
                  {editId === r.id ? (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                      <input value={editPrice} onChange={e => setEditPrice(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal"
                        placeholder={r.price_per_kg ? tc('logistics_dashboard.edit_placeholder_per_kg', { currency }) : tc('logistics_dashboard.edit_placeholder_flat', { currency })} style={{ ...inp, flex: 1, marginBottom: 0 }} autoFocus />
                      <button onClick={() => savePrice(r)} disabled={busyId === r.id} style={{ background: ACC, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{tc('logistics_dashboard.btn_save')}</button>
                      <button onClick={() => setEditId('')} style={{ background: 'transparent', color: 'var(--pos-muted)', border: '1px solid var(--pos-border)', borderRadius: 8, padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{tc('logistics_dashboard.btn_cancel')}</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                      <button onClick={() => { setEditId(r.id); setEditPrice(String(r.price_per_kg || r.flat_rate || '')) }}
                        style={{ background: 'none', border: 'none', color: ACC, fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>{tc('logistics_dashboard.btn_edit_price')}</button>
                      <button onClick={() => removeRoute(r)} disabled={busyId === r.id}
                        style={{ background: 'none', border: 'none', color: RED, fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>{tc('logistics_dashboard.btn_delete')}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{sub}</div>
    </div>
  )
}

function FleetPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
      <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color }}>{count}</span>
    </div>
  )
}

function ParcelList({ parcels, currency, tc }: { parcels: Parcel[]; currency: string; tc: Tc }) {
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tc('logistics_dashboard.search_placeholder')}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 12 }}>
          <option value="">{tc('logistics_dashboard.filter_all')}</option>
          {statuses.map(s => <option key={s} value={s}>{statusLabel(s, tc)}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginBottom: 8 }}>{tc('logistics_dashboard.parcel_count', { count: filtered.length })}</div>
      {filtered.map((p, idx) => (
        <div key={p.id} className="pos-item" style={{ background: 'var(--pos-surface)', borderRadius: 10, padding: 10, border: '1px solid var(--pos-border)', marginBottom: 8, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{p.tracking_number}</span>
            <span style={{ marginLeft: 'auto', background: `${STATUS_COLOR[p.status] || 'var(--pos-muted)'}18`, color: STATUS_COLOR[p.status] || 'var(--pos-muted)', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{statusLabel(p.status, tc)}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)', lineHeight: 1.5 }}>
            <div>{p.sender_name || '—'} → {p.receiver_name || '—'}</div>
            <div>📍 {p.destination_city || p.destination_branch?.name || '—'} {p.weight_kg ? `· ${p.weight_kg}kg` : ''}</div>
            {p.fee_charged ? <div>💰 {currency} {p.fee_charged.toLocaleString()} · {p.payment_status || '—'}</div> : null}
            {p.truck && <div>🚛 {p.truck.plate_number} {p.driver ? `· ${p.driver.name}` : ''}</div>}
            <div style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{timeAgo(p.created_at, tc)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FleetView({ trucks, parcels, locations, onAddTruck, tc }: { trucks: Truck[]; parcels: Parcel[]; locations: TruckLocation[]; onAddTruck: () => void; tc: Tc }) {
  const truckParcels = (truckId: string) => parcels.filter(p => p.truck?.id === truckId && ['assigned', 'loaded', 'in_transit', 'out_for_delivery'].includes(p.status))

  const statusStyle = (s: string) => ({
    available: { bg: `${GREEN}18`, color: GREEN, label: tc('logistics_dashboard.truck_status_available') },
    in_transit: { bg: '#6366f118', color: '#6366f1', label: tc('logistics_dashboard.truck_status_in_transit') },
    maintenance: { bg: `${RED}18`, color: RED, label: tc('logistics_dashboard.truck_status_maintenance') },
  }[s] || { bg: 'var(--pos-border)', color: 'var(--pos-muted)', label: s })

  return (
    <div>
      {/* Header row: count + add button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{trucks.length !== 1 ? tc('logistics_dashboard.truck_count_plural', { count: trucks.length }) : tc('logistics_dashboard.truck_count', { count: trucks.length })}</div>
        <button onClick={onAddTruck} style={{ background: ACC, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{tc('logistics_dashboard.btn_add_truck_inline')}</button>
      </div>

      {/* Fleet Locations (live GPS) */}
      <FleetLocations locations={locations} tc={tc} />

      {/* Truck roster */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', margin: '4px 0 8px' }}>{tc('logistics_dashboard.trucks_title')}</div>
      {trucks.map((t, idx) => {
        const st = statusStyle(t.status)
        const tp = truckParcels(t.id)
        return (
          <div key={t.id} className="pos-item" style={{ background: 'var(--pos-surface)', borderRadius: 10, padding: 12, border: '1px solid var(--pos-border)', marginBottom: 8, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pos-ink)' }}>{truckReg(t)}</span>
              {t.make_model && <span style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{t.make_model}</span>}
              {t.capacity_kg ? <span style={{ fontSize: 11, color: 'var(--pos-hint)' }}>· {t.capacity_kg.toLocaleString()}kg</span> : null}
              <span style={{ marginLeft: 'auto', background: st.bg, color: st.color, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{st.label}</span>
            </div>
            {tp.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>
                {tp.length !== 1
                  ? tc('logistics_dashboard.truck_parcels_plural', { count: tp.length, list: tp.map(p => p.tracking_number).join(', ') })
                  : tc('logistics_dashboard.truck_parcels', { count: tp.length, list: tp.map(p => p.tracking_number).join(', ') })}
              </div>
            )}
          </div>
        )
      })}
      {trucks.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: 'var(--pos-muted)', fontSize: 13 }}>{tc('logistics_dashboard.trucks_empty')}</div>}
    </div>
  )
}

function FleetLocations({ locations, tc }: { locations: TruckLocation[]; tc: Tc }) {
  const fresh = (iso: string) => (Date.now() - new Date(iso).getTime()) < 2 * 3600_000 // within 2h
  return (
    <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{tc('logistics_dashboard.fleet_locations_title')}</div>
        <span style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{tc('logistics_dashboard.fleet_locations_updates')}</span>
      </div>
      {locations.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--pos-hint)', padding: '8px 0' }}>{tc('logistics_dashboard.fleet_locations_empty')}</div>
      ) : (
        locations.map(loc => {
          const live = fresh(loc.recorded_at)
          return (
            <div key={loc.truck_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0ede8' }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: live ? GREEN : AMBER, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{loc.registration}</div>
                <div style={{ fontSize: 11, color: 'var(--pos-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {loc.driver_name || tc('logistics_dashboard.unknown_driver')} · {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{tc('logistics_dashboard.last_seen', { time: timeAgo(loc.recorded_at, tc) })}</div>
              </div>
              <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer"
                style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {tc('logistics_dashboard.btn_map')}
              </a>
            </div>
          )
        })
      )}
    </div>
  )
}

function RevenueView({ parcels, currency, tc }: { parcels: Parcel[]; currency: string; tc: Tc }) {
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
      const city = p.destination_city || tc('logistics_dashboard.unknown_city')
      if (!acc[city]) acc[city] = { count: 0, revenue: 0 }
      acc[city].count++
      acc[city].revenue += p.fee_charged || 0
      return acc
    }, {})
  ).sort((a, b) => b[1].revenue - a[1].revenue)

  return (
    <div>
      {/* Period breakdown */}
      <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_dashboard.revenue_by_period_title')}</div>
        <Row label={tc('logistics_dashboard.period_today')} count={todayP.length} amount={sum(todayP)} currency={currency} tc={tc} />
        <Row label={tc('logistics_dashboard.period_last_7_days')} count={weekP.length} amount={sum(weekP)} currency={currency} tc={tc} />
        <Row label={tc('logistics_dashboard.period_this_month')} count={monthP.length} amount={sum(monthP)} currency={currency} tc={tc} />
        <Row label={tc('logistics_dashboard.period_all_time')} count={parcels.length} amount={sum(parcels)} currency={currency} bold tc={tc} />
      </div>

      {/* Payment status */}
      <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_dashboard.payment_status_title')}</div>
        <Row label={tc('logistics_dashboard.payment_paid')} count={paid.length} amount={sum(paid)} currency={currency} color={GREEN} tc={tc} />
        <Row label={tc('logistics_dashboard.payment_unpaid')} count={unpaid.length} amount={sum(unpaid)} currency={currency} color={RED} tc={tc} />
        <Row label={tc('logistics_dashboard.payment_partial')} count={partial.length} amount={sum(partial)} currency={currency} color={AMBER} tc={tc} />
      </div>

      {/* Revenue by destination */}
      <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_dashboard.revenue_by_destination_title')}</div>
        {byCity.map(([city, data]) => (
          <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--pos-muted)' }}>{city}</span>
            <span style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{tc('logistics_dashboard.pkgs', { count: data.count })}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)' }}>{currency} {data.revenue.toLocaleString()}</span>
          </div>
        ))}
        {byCity.length === 0 && <div style={{ fontSize: 12, color: 'var(--pos-hint)' }}>{tc('logistics_dashboard.no_data_yet')}</div>}
      </div>
    </div>
  )
}

function Row({ label, count, amount, currency, color, bold, tc }: { label: string; count: number; amount: number; currency: string; color?: string; bold?: boolean; tc: Tc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      {color && <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />}
      <span style={{ flex: 1, fontSize: 12, color: 'var(--pos-muted)', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{tc('logistics_dashboard.pkgs', { count })}</span>
      <span style={{ fontSize: 12, fontWeight: bold ? 800 : 700, color: color || 'var(--pos-ink)' }}>{currency} {amount.toLocaleString()}</span>
    </div>
  )
}
