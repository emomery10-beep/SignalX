'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsDispatchLevel, isLogisticsBranchLevel, isManagerOrAboveLevel, getRoleHomeRoute } from '@/lib/pos-role-client'

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
  sender_name: string | null; sender_phone: string | null
  receiver_name: string | null; receiver_phone: string | null
  destination_city: string | null; description: string | null
  weight_kg: number | null; fee_charged: number | null
  created_at: string; dispatched_at: string | null
  assigned_truck_id: string | null; assigned_driver_id: string | null
  truck?: { id: string; plate_number: string } | null
  driver?: { id: string; name: string } | null
  sender_branch?: { id: string; name: string } | null
  destination_branch?: { id: string; name: string } | null
  route?: { id: string; name: string } | null
}

interface Truck { id: string; plate_number: string; make_model: string | null; status: string }
interface Driver { id: string; name: string; role: string }
interface Route { id: string; name: string; origin?: { id: string; name: string } | null; destination?: { id: string; name: string } | null }

type Tab = 'pending' | 'assigned' | 'transit' | 'arrived'

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

const TAB_FILTERS: Record<Tab, string[]> = {
  pending: ['received', 'at_branch'],
  assigned: ['assigned', 'loaded'],
  transit: ['in_transit', 'out_for_delivery'],
  arrived: ['at_destination', 'delivered', 'collected', 'failed_delivery'],
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}

export default function DispatchPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('pending')
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Assignment modal
  const [assigning, setAssigning] = useState<Parcel | null>(null)
  const [selTruck, setSelTruck] = useState('')
  const [selDriver, setSelDriver] = useState('')
  const [selRoute, setSelRoute] = useState('')
  const [saving, setSaving] = useState(false)

  // Bulk dispatch
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkSaving, setBulkSaving] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('pos_staff')
    if (!raw) { router.push('/'); return }
    const s = JSON.parse(raw) as Staff
    if (!isLogisticsDispatchLevel(s.role) && !isLogisticsBranchLevel(s.role) && !isManagerOrAboveLevel(s.role)) {
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
      const [pRes, tRes, rRes, dRes] = await Promise.all([
        fetch(`${API}/api/pos/parcels?limit=200`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/trucks`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/routes`, { headers: hdrs(s) }),
        fetch(`${API}/api/pos/staff/list?role=driver`, { headers: hdrs(s) }),
      ])
      const [pData, tData, rData, dData] = await Promise.all([pRes.json(), tRes.json(), rRes.json(), dRes.json()])
      setParcels(pData.parcels || [])
      setTrucks(tData.trucks || [])
      setRoutes(rData.routes || [])
      setDrivers(dData.staff || [])
    } catch {}
    setLoading(false)
  }

  const filtered = parcels.filter(p => {
    const statuses = TAB_FILTERS[tab]
    if (!statuses.includes(p.status)) return false
    if (search) {
      const q = search.toLowerCase()
      return (p.tracking_number?.toLowerCase().includes(q) ||
        p.sender_name?.toLowerCase().includes(q) ||
        p.receiver_name?.toLowerCase().includes(q) ||
        p.destination_city?.toLowerCase().includes(q))
    }
    return true
  })

  const tabCounts = {
    pending: parcels.filter(p => TAB_FILTERS.pending.includes(p.status)).length,
    assigned: parcels.filter(p => TAB_FILTERS.assigned.includes(p.status)).length,
    transit: parcels.filter(p => TAB_FILTERS.transit.includes(p.status)).length,
    arrived: parcels.filter(p => TAB_FILTERS.arrived.includes(p.status)).length,
  }

  const handleAssign = async () => {
    if (!staff || !assigning) return
    setSaving(true)
    try {
      const updates: Record<string, unknown> = { id: assigning.id, status: 'assigned' }
      if (selTruck) updates.assigned_truck_id = selTruck
      if (selDriver) updates.assigned_driver_id = selDriver
      if (selRoute) updates.route_id = selRoute
      await fetch(`${API}/api/pos/parcels`, {
        method: 'PATCH', headers: hdrs(staff), body: JSON.stringify(updates),
      })
      setAssigning(null)
      setSelTruck(''); setSelDriver(''); setSelRoute('')
      await loadAll(staff)
    } catch {}
    setSaving(false)
  }

  const handleBulkDispatch = async () => {
    if (!staff || selected.size === 0 || !selTruck || !selDriver) return
    setBulkSaving(true)
    try {
      const promises = Array.from(selected).map(id =>
        fetch(`${API}/api/pos/parcels`, {
          method: 'PATCH',
          headers: hdrs(staff),
          body: JSON.stringify({
            id, status: 'loaded',
            assigned_truck_id: selTruck,
            assigned_driver_id: selDriver,
            ...(selRoute ? { route_id: selRoute } : {}),
          }),
        })
      )
      await Promise.all(promises)
      setSelected(new Set())
      setBulkMode(false)
      setSelTruck(''); setSelDriver(''); setSelRoute('')
      await loadAll(staff)
    } catch {}
    setBulkSaving(false)
  }

  const markLoaded = async (parcelId: string) => {
    if (!staff) return
    await fetch(`${API}/api/pos/parcels`, {
      method: 'PATCH', headers: hdrs(staff),
      body: JSON.stringify({ id: parcelId, status: 'loaded' }),
    })
    await loadAll(staff)
  }

  const markDispatched = async (parcelId: string) => {
    if (!staff) return
    await fetch(`${API}/api/pos/parcels`, {
      method: 'PATCH', headers: hdrs(staff),
      body: JSON.stringify({ id: parcelId, status: 'in_transit', dispatched_at: new Date().toISOString() }),
    })
    await loadAll(staff)
  }

  if (!ready) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>Loading…</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/logistics')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>🚛 Dispatch</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{staff?.name} · {parcels.length} total parcels</div>
        </div>
        <button onClick={() => staff && loadAll(staff)} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>↻ Refresh</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--pos-border)', background: 'var(--pos-surface)' }}>
        {(['pending', 'assigned', 'transit', 'arrived'] as Tab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); setSelected(new Set()); setBulkMode(false) }}
            style={{ flex: 1, padding: '10px 4px', border: 'none', background: tab === t ? ACC_LIGHT : 'transparent', borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: tab === t ? ACC : 'var(--pos-muted)', textTransform: 'capitalize' }}>
            {t} <span style={{ background: tab === t ? ACC : 'var(--pos-border)', color: tab === t ? 'var(--pos-surface)' : 'var(--pos-muted)', borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{tabCounts[t]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '8px 16px', background: 'var(--pos-surface)' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracking, name, city…"
          style={{ width: '100%', padding: '8px 12px', border: `1px solid var(--pos-border)`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Bulk controls for pending tab */}
      {tab === 'pending' && filtered.length > 0 && (
        <div style={{ padding: '8px 16px', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => { setBulkMode(!bulkMode); setSelected(new Set()) }}
            style={{ background: bulkMode ? 'var(--pos-danger)' : ACC, color: 'var(--pos-surface)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {bulkMode ? '✕ Cancel' : '☐ Bulk assign'}
          </button>
          {bulkMode && selected.size > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: ACC }}>{selected.size} selected</span>
          )}
        </div>
      )}

      {/* Parcel list */}
      <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pos-muted)' }}>Loading parcels…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pos-muted)', fontSize: 13 }}>No parcels in this category yet</div>
        ) : filtered.map((p, idx) => (
          <div key={p.id} className="pos-item" style={{ background: 'var(--pos-surface)', borderRadius: 12, padding: 12, border: `1px solid ${selected.has(p.id) ? ACC : 'var(--pos-border)'}`, boxShadow: selected.has(p.id) ? `0 0 0 2px ${ACC_BORDER}` : 'none', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {bulkMode && tab === 'pending' && (
                <input type="checkbox" checked={selected.has(p.id)} onChange={() => {
                  const s = new Set(selected)
                  s.has(p.id) ? s.delete(p.id) : s.add(p.id)
                  setSelected(s)
                }} style={{ width: 18, height: 18, accentColor: ACC }} />
              )}
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{p.tracking_number}</span>
              <span style={{ marginLeft: 'auto', background: `${STATUS_COLOR[p.status] || '#6b6760'}18`, color: STATUS_COLOR[p.status] || '#6b6760', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{STATUS_LABEL[p.status] || p.status}</span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--pos-muted)', lineHeight: 1.5 }}>
              <div>📦 {p.description || 'No description'} {p.weight_kg ? `· ${p.weight_kg}kg` : ''}</div>
              <div>👤 {p.sender_name || '—'} → {p.receiver_name || '—'}</div>
              <div>📍 {p.destination_city || p.destination_branch?.name || '—'}</div>
              {p.truck && <div>🚛 {p.truck.plate_number}</div>}
              {p.driver && <div>🧑‍✈️ {p.driver.name}</div>}
              {p.route && <div>🛤️ {p.route.name}</div>}
              <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 2 }}>{timeAgo(p.created_at)}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {tab === 'pending' && !bulkMode && (
                <button onClick={() => { setAssigning(p); setSelTruck(p.assigned_truck_id || ''); setSelDriver(p.assigned_driver_id || ''); setSelRoute('') }}
                  style={{ background: ACC, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  Assign →
                </button>
              )}
              {tab === 'assigned' && (
                <>
                  <button onClick={() => markLoaded(p.id)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Mark Loaded</button>
                  <button onClick={() => markDispatched(p.id)} className="pos-btn-primary" style={{ background: 'var(--pos-success)', color: 'var(--pos-surface)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Dispatch ✓</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk assign bottom bar */}
      {bulkMode && selected.size > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--pos-surface)', borderTop: `2px solid ${ACC}`, padding: 16, zIndex: 100 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 8 }}>Assign {selected.size} parcels</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <select value={selTruck} onChange={e => setSelTruck(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13 }}>
              <option value="">Select truck…</option>
              {trucks.filter(t => t.status === 'available').map(t => (
                <option key={t.id} value={t.id}>{t.plate_number} {t.make_model ? `(${t.make_model})` : ''}</option>
              ))}
            </select>
            <select value={selDriver} onChange={e => setSelDriver(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13 }}>
              <option value="">Select driver…</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select value={selRoute} onChange={e => setSelRoute(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13 }}>
              <option value="">Select route (optional)…</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name || `${r.origin?.name} → ${r.destination?.name}`}</option>
              ))}
            </select>
            <button onClick={handleBulkDispatch} disabled={bulkSaving || !selTruck || !selDriver} className="pos-btn-primary"
              style={{ background: (!selTruck || !selDriver) ? '#ccc' : ACC, color: 'var(--pos-surface)', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 800, cursor: (!selTruck || !selDriver) ? 'not-allowed' : 'pointer', opacity: (!selTruck || !selDriver) ? 0.5 : 1 }}>
              {bulkSaving ? 'Assigning…' : `Assign ${selected.size} parcels`}
            </button>
          </div>
        </div>
      )}

      {/* Single assign modal */}
      {assigning && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div className="pos-sheet" style={{ background: 'var(--pos-surface)', borderRadius: '16px 16px 0 0', padding: 20, width: '100%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>Assign {assigning.tracking_number}</div>
              <button onClick={() => setAssigning(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--pos-muted)' }}>×</button>
            </div>

            <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 16 }}>
              <div>📦 {assigning.description || '—'} {assigning.weight_kg ? `· ${assigning.weight_kg}kg` : ''}</div>
              <div>📍 {assigning.receiver_name} — {assigning.destination_city || assigning.destination_branch?.name || '—'}</div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>Truck *</label>
            <select value={selTruck} onChange={e => setSelTruck(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}>
              <option value="">Select truck…</option>
              {trucks.filter(t => t.status === 'available' || t.id === assigning.assigned_truck_id).map(t => (
                <option key={t.id} value={t.id}>{t.plate_number} {t.make_model ? `(${t.make_model})` : ''}</option>
              ))}
            </select>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>Driver *</label>
            <select value={selDriver} onChange={e => setSelDriver(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}>
              <option value="">Select driver…</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>Route</label>
            <select value={selRoute} onChange={e => setSelRoute(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--pos-border)', borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: 'border-box' }}>
              <option value="">Select route (optional)…</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name || `${r.origin?.name} → ${r.destination?.name}`}</option>
              ))}
            </select>

            <button onClick={handleAssign} disabled={saving || !selTruck || !selDriver} className="pos-btn-primary"
              style={{ width: '100%', background: (!selTruck || !selDriver) ? '#ccc' : ACC, color: 'var(--pos-surface)', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 800, cursor: (!selTruck || !selDriver) ? 'not-allowed' : 'pointer', opacity: (!selTruck || !selDriver) ? 0.5 : 1 }}>
              {saving ? 'Assigning…' : 'Assign Parcel'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
