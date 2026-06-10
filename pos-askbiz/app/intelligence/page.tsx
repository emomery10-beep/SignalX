'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface GeoSale {
  id: string
  lat: number
  lng: number
  total: number
  payment_type: string
  created_at: string
  cashier_name: string
  cleanNotes: string
}

type Period = '1' | '7' | '30' | '90'

export default function IntelligencePage() {
  const router = useRouter()
  const supabase = createClient()

  const [ready, setReady]       = useState(false)
  const [sym, setSym]           = useState('£')
  const [loading, setLoading]   = useState(true)
  const [period, setPeriod]     = useState<Period>('30')
  const [geoPoints, setGeoPoints] = useState<GeoSale[]>([])
  const [allCount, setAllCount] = useState(0)
  const [revenue, setRevenue]   = useState(0)
  const [selected, setSelected] = useState<GeoSale | null>(null)

  // Map refs — never triggers re-render
  const mapDivRef      = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const markersRef     = useRef<any[]>([])
  const leafletLoaded  = useRef(false)

  // ── Auth: owner must be signed in via Supabase ────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      // Fetch currency from owner profile
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  // ── Load data when ready or period changes ────────────────
  useEffect(() => {
    if (!ready) return
    fetchData()
  }, [ready, period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const from = new Date()
      from.setDate(from.getDate() - parseInt(period))
      const res = await fetch(
        `${API}/api/pos/transactions?from=${from.toISOString()}&limit=500`
      )
      const data = await res.json()
      const txns: any[] = data.transactions || []

      setAllCount(txns.length)
      setRevenue(txns.reduce((s: number, t: any) => s + (t.total || 0), 0))

      const points: GeoSale[] = []
      for (const t of txns) {
        if (!t.notes) continue
        const m = t.notes.match(/\|__geo:([-\d.]+),([-\d.]+)/)
        if (!m) continue
        points.push({
          id:           t.id,
          lat:          parseFloat(m[1]),
          lng:          parseFloat(m[2]),
          total:        t.total || 0,
          payment_type: t.payment_type || 'cash',
          created_at:   t.created_at,
          cashier_name: t.cashier?.name || t.pos_staff?.name || '',
          cleanNotes:   t.notes.replace(/\s*\|__geo:[^\s|]+/, '').trim(),
        })
      }
      setGeoPoints(points)
    } catch {}
    setLoading(false)
  }

  // ── Bootstrap Leaflet once on mount ──────────────────────
  useEffect(() => {
    if (leafletLoaded.current) return
    leafletLoaded.current = true

    // CSS
    if (!document.getElementById('lf-css')) {
      const link = document.createElement('link')
      link.id   = 'lf-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // JS
    const existing = document.getElementById('lf-js')
    if (existing) {
      initMap()
      return
    }
    const script   = document.createElement('script')
    script.id      = 'lf-js'
    script.src     = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async   = true
    script.onload  = () => initMap()
    document.head.appendChild(script)

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  function initMap() {
    const L = (window as any).L
    if (!L || !mapDivRef.current || mapRef.current) return

    const map = L.map(mapDivRef.current, { center: [20, 0], zoom: 2, zoomControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map

    // Trigger a marker refresh if points already loaded
    setGeoPoints(prev => [...prev])
  }

  // ── Refresh markers whenever geoPoints, sym or selected change ─
  useEffect(() => {
    const L   = (window as any).L
    const map = mapRef.current
    if (!L || !map) return

    // Remove old markers
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    if (geoPoints.length === 0) return

    const bounds: [number, number][] = []

    geoPoints.forEach(p => {
      const isSelected = selected?.id === p.id
      const marker = L.circleMarker([p.lat, p.lng], {
        radius:      isSelected ? 14 : 10,
        fillColor:   isSelected ? 'var(--pos-danger)' : ACC,
        color:       '#fff',
        weight:      2.5,
        fillOpacity: 0.9,
      }).addTo(map)

      const dt  = new Date(p.created_at)
      const lbl = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
                  ' ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

      marker.bindPopup(`
        <div style="font-family:-apple-system,sans-serif;min-width:150px;padding:2px 0">
          <div style="font-weight:800;font-size:16px;color:var(--pos-ink)">${sym}${p.total.toFixed(2)}</div>
          <div style="font-size:12px;color:var(--pos-muted);margin-top:2px">${lbl}</div>
          ${p.cashier_name ? `<div style="font-size:12px;color:var(--pos-muted)">by ${p.cashier_name}</div>` : ''}
          <div style="font-size:12px;color:var(--pos-muted);text-transform:capitalize">${p.payment_type}</div>
          ${p.cleanNotes ? `<div style="font-size:11px;color:var(--pos-hint);margin-top:2px">${p.cleanNotes}</div>` : ''}
        </div>
      `)

      marker.on('click', () => {
        setSelected(p)
        marker.openPopup()
      })

      markersRef.current.push(marker)
      bounds.push([p.lat, p.lng])
    })

    if (bounds.length > 0) {
      try { map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 }) } catch {}
    }
  }, [geoPoints, sym, selected])

  const flyTo = (p: GeoSale) => {
    setSelected(p)
    if (mapRef.current) {
      mapRef.current.flyTo([p.lat, p.lng], 15, { duration: 0.8 })
    }
  }

  const payIcon = (t: string) => t === 'cash' ? '💵' : t === 'card' ? '💳' : '📱'

  const periodLabel = (p: Period) =>
    ({ '1': 'Today', '7': '7 days', '30': '30 days', '90': '90 days' }[p])

  // Show nothing while checking auth
  if (!ready) return null

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '14px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--pos-ink)' }}>Sales Map</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Geo-tagged transactions</div>
        </div>
        <button onClick={() => router.back()} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--pos-muted)' }}>
          ← Back
        </button>
      </div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 20px', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)' }}>
        {(['1', '7', '30', '90'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: period === p ? ACC : 'var(--pos-bg)', color: period === p ? '#fff' : 'var(--pos-muted)' }}>
            {periodLabel(p)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)' }}>
        {[
          { label: 'Sales',   value: loading ? '…' : String(allCount) },
          { label: 'Revenue', value: loading ? '…' : `${sym}${revenue.toFixed(2)}` },
          { label: 'On map',  value: loading ? '…' : String(geoPoints.length) },
        ].map((s, i) => (
          <div key={i} style={{ padding: '10px 16px', borderRight: i < 2 ? '1px solid var(--pos-border)' : 'none' }}>
            <div style={{ fontSize: 10, color: 'var(--pos-hint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--pos-ink)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Map container */}
      <div style={{ position: 'relative', height: 320, flexShrink: 0, background: '#d4e2d1' }}>
        <div ref={mapDivRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Overlay when no points */}
        {!loading && geoPoints.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,248,246,0.93)', gap: 8, zIndex: 999 }}>
            <div style={{ fontSize: 36 }}>🗺️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--pos-ink)' }}>No location data yet</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', textAlign: 'center', maxWidth: 260, lineHeight: 1.5 }}>
              Allow location access on the cashier's device when making a sale — each sale will appear as a pin here
            </div>
          </div>
        )}

        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,248,246,0.8)', zIndex: 999 }}>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)' }}>Loading…</div>
          </div>
        )}
      </div>

      {/* Selected sale */}
      {selected && (
        <div className="pos-reveal" style={{ margin: '10px 20px 0', padding: '12px 16px', borderRadius: 14, background: 'rgba(208,138,89,.07)', border: '1px solid rgba(208,138,89,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 2 }}>
              {new Date(selected.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: ACC }}>{sym}{selected.total.toFixed(2)} {payIcon(selected.payment_type)}</div>
          </div>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--pos-hint)', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Sale list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 40px' }}>
        {geoPoints.length > 0 && (
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            {geoPoints.length} geo-tagged sale{geoPoints.length !== 1 ? 's' : ''}
          </div>
        )}

        {geoPoints.slice().reverse().map((p, idx) => (
          <button type="button" key={p.id} className="pos-item" onClick={() => flyTo(p)}
            style={{ background: 'var(--pos-surface)', borderRadius: 12, border: `1.5px solid ${selected?.id === p.id ? ACC : 'var(--pos-border)'}`, marginBottom: 8, padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${Math.min(idx, 8) * 40}ms`, width: '100%', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--pos-ink)' }}>{sym}{p.total.toFixed(2)} {payIcon(p.payment_type)}</div>
              <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 2 }}>
                {new Date(p.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                {p.cashier_name ? ` · ${p.cashier_name}` : ''}
              </div>
              {p.cleanNotes && <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 1 }}>{p.cleanNotes}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: selected?.id === p.id ? 'var(--pos-danger)' : ACC }} />
              <div style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{p.lat.toFixed(3)}, {p.lng.toFixed(3)}</div>
            </div>
          </button>
        ))}

        {!loading && geoPoints.length === 0 && allCount > 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 4 }}>{allCount} sales — none geo-tagged yet</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)' }}>The cashier device must allow location access before checking out.</div>
          </div>
        )}

        {!loading && allCount === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 14 }}>No sales in this period yet — try a different date range.</div>
        )}
      </div>
    </div>
  )
}
