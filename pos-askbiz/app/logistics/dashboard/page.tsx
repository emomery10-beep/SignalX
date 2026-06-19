'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsBranchLevel, isManagerOrAboveLevel, getRoleHomeRoute } from '@/lib/pos-role-client'

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
    if (!staff || !newReg.trim()) { setAddError('Registration is required'); return }
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
      setAddError('Could not add truck. Try again.')
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
        setPlateMsg(data.confidence === 'low' ? '⚠️ Plate read — please double-check it' : '✓ Plate read from photo')
      } else {
        setPlateMsg("Couldn't read the plate — type it in manually")
      }
    } catch {
      setPlateMsg('Scan failed — type the plate in manually')
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

  if (!ready) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>Loading…</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>📊 Branch Dashboard</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{staff?.name} · Branch Manager</div>
        </div>
        <button onClick={() => router.push('/logistics/dispatch')} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🚛 Dispatch</button>
        <button onClick={() => staff && loadAll(staff)} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>↻</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--pos-border)', background: 'var(--pos-surface)' }}>
        {(['overview', 'parcels', 'fleet', 'routes', 'revenue'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '10px 2px', border: 'none', background: tab === t ? ACC_LIGHT : 'transparent', borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent', cursor: 'pointer', fontSize: 10.5, fontWeight: 700, color: tab === t ? ACC : 'var(--pos-muted)' }}>
            {t === 'overview' ? '📋 Overview' : t === 'parcels' ? '📦 Parcels' : t === 'fleet' ? '🚛 Fleet' : t === 'routes' ? '📍 Routes' : '💰 Revenue'}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pos-muted)' }}>Loading dashboard…</div>
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
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 8 }}>💰 Revenue</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Today</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{currency} {todayRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{currency} {totalRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Unpaid</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: unpaid > 0 ? RED : 'var(--pos-muted)' }}>{currency} {unpaid.toLocaleString()}</span>
              </div>
            </div>

            {/* Status breakdown */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>📊 Status Breakdown</div>
              {statusBreakdown.map(([status, count]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[status] || 'var(--pos-muted)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--pos-muted)' }}>{STATUS_LABEL[status] || status}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)' }}>{count}</span>
                  <div style={{ width: 60, height: 6, background: '#f0ede8', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((count / parcels.length) * 100, 100)}%`, height: '100%', background: STATUS_COLOR[status] || 'var(--pos-muted)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Fleet at a glance */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>🚛 Fleet</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <FleetPill label="Available" count={trucksAvailable} color={GREEN} />
                <FleetPill label="In Transit" count={trucksInTransit} color="#6366f1" />
                <FleetPill label="Maintenance" count={trucksMaintenance} color={RED} />
              </div>
            </div>

            {/* Recent activity */}
            <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>🕒 Recent Parcels</div>
              {parcels.slice(0, 8).map((p, idx) => (
                <div key={p.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f0ede8', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--pos-ink)' }}>{p.tracking_number}</span>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--pos-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.receiver_name || p.destination_city || '—'}</span>
                  <span style={{ background: `${STATUS_COLOR[p.status] || 'var(--pos-muted)'}18`, color: STATUS_COLOR[p.status] || 'var(--pos-muted)', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{STATUS_LABEL[p.status] || p.status}</span>
                  <span style={{ fontSize: 10, color: 'var(--pos-hint)', whiteSpace: 'nowrap' }}>{timeAgo(p.created_at)}</span>
                </div>
              ))}
            </div>
          </>
        ) : tab === 'parcels' ? (
          <ParcelList parcels={parcels} currency={currency} />
        ) : tab === 'fleet' ? (
          <FleetView trucks={trucks} parcels={parcels} locations={locations} onAddTruck={() => { setAddError(''); setShowAddTruck(true) }} />
        ) : tab === 'routes' ? (
          <RoutesView routes={routes} branches={branches} currency={currency} homeBranchId={staff?.location_id || null}
            hdrs={staff ? hdrs(staff) : {}} onChanged={() => staff && reloadRoutes(staff)} />
        ) : (
          <RevenueView parcels={parcels} currency={currency} />
        )}
      </div>

      {/* Add Truck modal */}
      {showAddTruck && (
        <div onClick={() => !addingTruck && setShowAddTruck(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} className="pos-sheet" style={{ background: 'var(--pos-surface)', borderRadius: '16px 16px 0 0', padding: 20, width: '100%', maxWidth: 500, maxHeight: '85vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>🚛 Add Truck</div>
              <button onClick={() => setShowAddTruck(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--pos-muted)' }}>×</button>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>Registration *</label>
            <input ref={plateInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) scanPlate(f); e.target.value = '' }} />
            <button type="button" onClick={() => plateInputRef.current?.click()} disabled={scanningPlate}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: scanningPlate ? 'wait' : 'pointer', marginBottom: 8 }}>
              {scanningPlate ? 'Reading plate…' : '📷 Scan plate with camera'}
            </button>
            <input value={newReg} onChange={e => { setNewReg(e.target.value); setPlateMsg('') }} placeholder="e.g. KDA 123A" autoFocus
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, marginBottom: plateMsg ? 4 : 12, boxSizing: 'border-box', outline: 'none' }} />
            {plateMsg && <div style={{ fontSize: 12, color: plateMsg.startsWith('✓') ? GREEN : AMBER, marginBottom: 12 }}>{plateMsg}</div>}

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>Make / Model</label>
            <input value={newModel} onChange={e => setNewModel(e.target.value)} placeholder="e.g. Isuzu FRR"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }} />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>Capacity (kg)</label>
            <input value={newCapacity} onChange={e => setNewCapacity(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="e.g. 5000"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }} />

            {addError && <div style={{ color: RED, fontSize: 13, marginBottom: 12 }}>{addError}</div>}

            <button onClick={addTruck} disabled={addingTruck || !newReg.trim()} className="pos-btn-primary"
              style={{ width: '100%', background: (!newReg.trim()) ? '#ccc' : ACC, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 800, cursor: (!newReg.trim() || addingTruck) ? 'not-allowed' : 'pointer', opacity: (!newReg.trim()) ? 0.5 : 1 }}>
              {addingTruck ? 'Adding…' : 'Add Truck'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function RoutesView({ routes, branches, currency, homeBranchId, hdrs, onChanged }: {
  routes: Route[]; branches: Branch[]; currency: string; homeBranchId: string | null
  hdrs: Record<string, string>; onChanged: () => void
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
    if (!origin || !dest) { setErr('Pick an origin and a destination.'); return }
    if (origin === dest) { setErr('Origin and destination must differ.'); return }
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
      if (!res.ok) { setErr(data.error || 'Could not add route.'); setSaving(false); return }
      setDest(''); setPrice('')
      onChanged()
    } catch { setErr('Network error — try again.') }
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
    if (typeof window !== 'undefined' && !window.confirm(`Delete route ${r.origin?.name} → ${r.destination?.name}?`)) return
    setBusyId(r.id)
    try { await fetch(`${API}/api/pos/routes?id=${r.id}`, { method: 'DELETE', headers: hdrs }); onChanged() } catch {}
    setBusyId('')
  }

  const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: 'var(--pos-surface)' }

  // Group routes by origin branch so it's obvious which clerks see what
  const byOrigin = new Map<string, Route[]>()
  for (const r of routes) {
    const key = r.origin?.name || 'Unknown branch'
    if (!byOrigin.has(key)) byOrigin.set(key, [])
    byOrigin.get(key)!.push(r)
  }

  return (
    <div>
      {/* How routes work */}
      <div style={{ background: ACC_LIGHT, border: `1px solid ${ACC_BORDER}`, borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 12.5, color: 'var(--pos-ink)', lineHeight: 1.5 }}>
        📍 A counter clerk only sees routes that <strong>start at their own branch</strong>. To give a clerk a destination, add a route whose <strong>From</strong> is the branch they work at.
      </div>

      {/* Add route */}
      <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 12 }}>➕ Add a route</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={lbl}>From (clerk&apos;s branch)</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} style={{ ...inp, appearance: 'none' }}>
              <option value="">Origin…</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>To</label>
            <select value={dest} onChange={e => setDest(e.target.value)} style={{ ...inp, appearance: 'none' }}>
              <option value="">Destination…</option>
              {branches.filter(b => b.id !== origin).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <label style={lbl}>Pricing</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {([{ id: 'flat', label: 'Flat rate' }, { id: 'per_kg', label: 'Per kg' }] as const).map(m => (
            <button key={m.id} type="button" onClick={() => setPricingMode(m.id)}
              style={{ flex: 1, padding: '10px', border: `2px solid ${pricingMode === m.id ? ACC : 'var(--pos-border)'}`, borderRadius: 8, background: pricingMode === m.id ? ACC_LIGHT : 'var(--pos-surface)', color: pricingMode === m.id ? ACC : 'var(--pos-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{m.label}</button>
          ))}
        </div>
        <label style={lbl}>{pricingMode === 'flat' ? `Flat price (${currency})` : `Price per kg (${currency})`}</label>
        <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="0.00" style={{ ...inp, marginBottom: 12 }} />
        {err && <div style={{ color: RED, fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button onClick={addRoute} disabled={saving || !origin || !dest}
          style={{ width: '100%', background: (!origin || !dest) ? '#ccc' : ACC, color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 800, cursor: (saving || !origin || !dest) ? 'not-allowed' : 'pointer', opacity: (!origin || !dest) ? 0.6 : 1 }}>
          {saving ? 'Adding…' : 'Add Route'}
        </button>
      </div>

      {/* Route list grouped by origin */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-muted)', marginBottom: 8 }}>{routes.length} route{routes.length === 1 ? '' : 's'}</div>
      {routes.length === 0 ? (
        <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '24px 16px', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 13 }}>
          No routes yet. Add one above so counter clerks can pick destinations.
        </div>
      ) : (
        Array.from(byOrigin.entries()).map(([originName, rs]) => (
          <div key={originName} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ACC, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>Leaving {originName}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rs.map(r => (
                <div key={r.id} style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 12, opacity: r.active ? 1 : 0.55 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)' }}>→ {r.destination?.name || '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 2 }}>
                        {r.flat_rate ? `${currency}${r.flat_rate} flat` : r.price_per_kg ? `${currency}${r.price_per_kg}/kg` : 'No price set'}
                      </div>
                    </div>
                    <button onClick={() => toggleActive(r)} disabled={busyId === r.id}
                      style={{ background: r.active ? 'var(--pos-success-pale)' : 'var(--pos-border)', color: r.active ? GREEN : 'var(--pos-muted)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      {busyId === r.id ? '…' : r.active ? 'Active' : 'Off'}
                    </button>
                  </div>
                  {editId === r.id ? (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                      <input value={editPrice} onChange={e => setEditPrice(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal"
                        placeholder={r.price_per_kg ? `${currency}/kg` : `${currency} flat`} style={{ ...inp, flex: 1, marginBottom: 0 }} autoFocus />
                      <button onClick={() => savePrice(r)} disabled={busyId === r.id} style={{ background: ACC, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditId('')} style={{ background: 'transparent', color: 'var(--pos-muted)', border: '1px solid var(--pos-border)', borderRadius: 8, padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                      <button onClick={() => { setEditId(r.id); setEditPrice(String(r.price_per_kg || r.flat_rate || '')) }}
                        style={{ background: 'none', border: 'none', color: ACC, fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>✏️ Edit price</button>
                      <button onClick={() => removeRoute(r)} disabled={busyId === r.id}
                        style={{ background: 'none', border: 'none', color: RED, fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>🗑 Delete</button>
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
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 12 }}>
          <option value="">All</option>
          {statuses.map(s => <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginBottom: 8 }}>{filtered.length} parcels</div>
      {filtered.map((p, idx) => (
        <div key={p.id} className="pos-item" style={{ background: 'var(--pos-surface)', borderRadius: 10, padding: 10, border: '1px solid var(--pos-border)', marginBottom: 8, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{p.tracking_number}</span>
            <span style={{ marginLeft: 'auto', background: `${STATUS_COLOR[p.status] || 'var(--pos-muted)'}18`, color: STATUS_COLOR[p.status] || 'var(--pos-muted)', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{STATUS_LABEL[p.status] || p.status}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)', lineHeight: 1.5 }}>
            <div>{p.sender_name || '—'} → {p.receiver_name || '—'}</div>
            <div>📍 {p.destination_city || p.destination_branch?.name || '—'} {p.weight_kg ? `· ${p.weight_kg}kg` : ''}</div>
            {p.fee_charged ? <div>💰 {currency} {p.fee_charged.toLocaleString()} · {p.payment_status || '—'}</div> : null}
            {p.truck && <div>🚛 {p.truck.plate_number} {p.driver ? `· ${p.driver.name}` : ''}</div>}
            <div style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{timeAgo(p.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FleetView({ trucks, parcels, locations, onAddTruck }: { trucks: Truck[]; parcels: Parcel[]; locations: TruckLocation[]; onAddTruck: () => void }) {
  const truckParcels = (truckId: string) => parcels.filter(p => p.truck?.id === truckId && ['assigned', 'loaded', 'in_transit', 'out_for_delivery'].includes(p.status))

  const statusStyle = (s: string) => ({
    available: { bg: `${GREEN}18`, color: GREEN, label: 'Available' },
    in_transit: { bg: '#6366f118', color: '#6366f1', label: 'In Transit' },
    maintenance: { bg: `${RED}18`, color: RED, label: 'Maintenance' },
  }[s] || { bg: 'var(--pos-border)', color: 'var(--pos-muted)', label: s })

  return (
    <div>
      {/* Header row: count + add button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{trucks.length} truck{trucks.length !== 1 ? 's' : ''}</div>
        <button onClick={onAddTruck} style={{ background: ACC, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Add Truck</button>
      </div>

      {/* Fleet Locations (live GPS) */}
      <FleetLocations locations={locations} />

      {/* Truck roster */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', margin: '4px 0 8px' }}>🚛 Trucks</div>
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
                📦 {tp.length} parcel{tp.length !== 1 ? 's' : ''} — {tp.map(p => p.tracking_number).join(', ')}
              </div>
            )}
          </div>
        )
      })}
      {trucks.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: 'var(--pos-muted)', fontSize: 13 }}>No trucks registered yet. Tap “+ Add Truck” to get started.</div>}
    </div>
  )
}

function FleetLocations({ locations }: { locations: TruckLocation[] }) {
  const fresh = (iso: string) => (Date.now() - new Date(iso).getTime()) < 2 * 3600_000 // within 2h
  return (
    <div className="pos-reveal" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>📍 Fleet Locations</div>
        <span style={{ fontSize: 10, color: 'var(--pos-hint)' }}>updates every 60s</span>
      </div>
      {locations.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--pos-hint)', padding: '8px 0' }}>No location pings yet. Drivers report position hourly once a truck is selected.</div>
      ) : (
        locations.map(loc => {
          const live = fresh(loc.recorded_at)
          return (
            <div key={loc.truck_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0ede8' }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: live ? GREEN : AMBER, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{loc.registration}</div>
                <div style={{ fontSize: 11, color: 'var(--pos-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {loc.driver_name || 'Unknown driver'} · {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--pos-hint)' }}>last seen {timeAgo(loc.recorded_at)}</div>
              </div>
              <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer"
                style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Map ↗
              </a>
            </div>
          )
        })
      )}
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
      <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>📈 Revenue by Period</div>
        <Row label="Today" count={todayP.length} amount={sum(todayP)} currency={currency} />
        <Row label="Last 7 days" count={weekP.length} amount={sum(weekP)} currency={currency} />
        <Row label="This month" count={monthP.length} amount={sum(monthP)} currency={currency} />
        <Row label="All time" count={parcels.length} amount={sum(parcels)} currency={currency} bold />
      </div>

      {/* Payment status */}
      <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>💳 Payment Status</div>
        <Row label="Paid" count={paid.length} amount={sum(paid)} currency={currency} color={GREEN} />
        <Row label="Unpaid" count={unpaid.length} amount={sum(unpaid)} currency={currency} color={RED} />
        <Row label="Partial" count={partial.length} amount={sum(partial)} currency={currency} color={AMBER} />
      </div>

      {/* Revenue by destination */}
      <div style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 14, border: '1px solid var(--pos-border)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>🗺️ Revenue by Destination</div>
        {byCity.map(([city, data]) => (
          <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--pos-muted)' }}>{city}</span>
            <span style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{data.count} pkgs</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)' }}>{currency} {data.revenue.toLocaleString()}</span>
          </div>
        ))}
        {byCity.length === 0 && <div style={{ fontSize: 12, color: 'var(--pos-hint)' }}>No data yet</div>}
      </div>
    </div>
  )
}

function Row({ label, count, amount, currency, color, bold }: { label: string; count: number; amount: number; currency: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      {color && <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />}
      <span style={{ flex: 1, fontSize: 12, color: 'var(--pos-muted)', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{count} pkgs</span>
      <span style={{ fontSize: 12, fontWeight: bold ? 800 : 700, color: color || 'var(--pos-ink)' }}>{currency} {amount.toLocaleString()}</span>
    </div>
  )
}
