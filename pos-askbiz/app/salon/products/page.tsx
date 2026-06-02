'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#ec4899' // salon pink accent
const API = process.env.NEXT_PUBLIC_API_URL || ''
const C = { good: '#22c55e', warn: '#f59e0b', bad: '#ef4444', muted: '#94a3b8', dim: '#64748b' }

interface InvItem {
  id: string
  name: string
  sku?: string
  stock_qty: number
  sale_price: number
  cost_price: number
  low_stock_threshold?: number
  unit?: string
}

interface TxItem { name: string; qty: number; inventory_id?: string }
interface Tx { pos_items?: TxItem[]; status: string }

interface UsageLog {
  id: string
  product_name: string
  amount_used: number
  unit: string
  service_name: string | null
  cost: number
  created_at: string
  inventory_id?: string | null
}

export default function SalonProducts() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<InvItem[]>([])
  const [soldMap, setSoldMap] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')

  // Backbar usage logging
  const [usage, setUsage] = useState<UsageLog[]>([])
  const [form, setForm] = useState({ product: '', amount: '', service: '' })

  // Optional barcode scan via camera
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanActive, setScanActive] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

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
    load()
    loadUsage()
    return () => stopScan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  async function loadUsage() {
    try {
      const res = await fetch(`${API}/api/pos/salon/product-usage`)
      const data = await res.json()
      setUsage(data.usage || [])
    } catch (e) {
      console.error('Backbar usage load error:', e)
    }
  }

  async function load() {
    setLoading(true)
    try {
      const [invRes, txRes] = await Promise.all([
        fetch(`${API}/api/pos/inventory?limit=200`),
        fetch(`${API}/api/pos/transactions?limit=500`),
      ])
      const invData = await invRes.json()
      const txData = await txRes.json()
      setInventory(invData.inventory || [])

      // Units sold per inventory item (by inventory_id, falling back to name)
      const byId: Record<string, number> = {}
      const byName: Record<string, number> = {}
      ;(txData.transactions || []).forEach((t: Tx) => {
        if (t.status === 'voided') return
        ;(t.pos_items || []).forEach(it => {
          if (it.inventory_id) byId[it.inventory_id] = (byId[it.inventory_id] || 0) + (it.qty || 0)
          if (it.name) byName[it.name.toLowerCase()] = (byName[it.name.toLowerCase()] || 0) + (it.qty || 0)
        })
      })
      const sold: Record<string, number> = {}
      ;(invData.inventory || []).forEach((p: InvItem) => {
        sold[p.id] = byId[p.id] ?? byName[p.name.toLowerCase()] ?? 0
      })
      setSoldMap(sold)
    } catch (e) {
      console.error('Products load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q ? inventory.filter(p => p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)) : inventory
    return list.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [inventory, search])

  const lowStock = useMemo(
    () => inventory.filter(p => p.stock_qty <= (p.low_stock_threshold || 5)),
    [inventory]
  )

  function margin(p: InvItem) {
    if (!p.sale_price) return 0
    return ((p.sale_price - (p.cost_price || 0)) / p.sale_price) * 100
  }

  async function logUsage(e: React.FormEvent) {
    e.preventDefault()
    if (!form.product.trim()) return
    // Logs backbar (professional-use) product consumption per service, capturing cost-per-service.
    const matched = inventory.find(p => p.name.toLowerCase() === form.product.toLowerCase())
    const cost = matched ? (matched.cost_price || 0) : 0
    // Parse free-text amount (e.g. "30ml") into a numeric amount + unit
    const amountMatch = form.amount.trim().match(/^([\d.]+)\s*(.*)$/)
    const amount_used = amountMatch ? parseFloat(amountMatch[1]) : 0
    const unit = (amountMatch && amountMatch[2].trim()) || 'g'
    try {
      const res = await fetch(`${API}/api/pos/salon/product-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory_id: matched?.id || null,
          product_name: form.product,
          amount_used,
          unit,
          cost,
          service_name: form.service || null,
        }),
      })
      const data = await res.json()
      if (data.usage) setUsage(prev => [data.usage, ...prev])
    } catch (err) {
      console.error('Log usage error:', err)
    }
    setForm({ product: '', amount: '', service: '' })
  }

  async function startScan() {
    setScanError(null)
    if (!navigator.mediaDevices?.getUserMedia) { setScanError('Camera not available. Type the product name instead.'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setScanActive(true)
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) } }, 50)
    } catch (err: any) {
      const name = err?.name || ''
      if (name === 'NotAllowedError') setScanError('Camera permission denied. Enable it in browser settings or type the product name.')
      else if (name === 'NotFoundError') setScanError('No camera found. Type the product name instead.')
      else setScanError('Could not start camera. Type the product name instead.')
    }
  }

  function stopScan() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setScanActive(false)
  }

  const inputStyle: React.CSSProperties = { background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit' }
  const card: React.CSSProperties = { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/salon')} style={{ background: '#334155', border: 'none', color: C.muted, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Salon</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>💇 Products</div>
            <div style={{ fontSize: 12, color: C.muted }}>Retail & backbar usage</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Low stock alerts */}
        {lowStock.length > 0 && (
          <div style={{ background: '#451a03', border: `1px solid ${C.warn}`, borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: C.warn, fontSize: 13 }}>Low Stock — {lowStock.length} item{lowStock.length !== 1 ? 's' : ''}</div>
              <div style={{ color: '#e2e8f0', fontSize: 13, marginTop: 2 }}>
                {lowStock.map(p => `${p.name} (${p.stock_qty})`).join(' · ')}
              </div>
            </div>
          </div>
        )}

        {/* Retail products table */}
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Retail Products</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ ...inputStyle, width: 200 }} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 720 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr', gap: 8, padding: '12px 20px', borderBottom: '1px solid #334155', fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: 1 }}>
                <div>Name</div><div>Stock</div><div>Price</div><div>Cost</div><div>Margin</div><div>Units Sold</div>
              </div>
              {loading && <div style={{ padding: 20, color: C.dim, fontSize: 13 }}>Loading…</div>}
              {!loading && filtered.length === 0 && <div style={{ padding: 20, color: C.dim, fontSize: 13, textAlign: 'center' }}>No products found.</div>}
              {filtered.map(p => {
                const m = margin(p)
                const low = p.stock_qty <= (p.low_stock_threshold || 5)
                return (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr', gap: 8, padding: '12px 20px', borderBottom: '1px solid #283548', fontSize: 13, alignItems: 'center' }}>
                    <div style={{ fontWeight: 600 }}>{p.name}{p.sku && <span style={{ color: C.dim, fontWeight: 400, marginLeft: 6, fontSize: 11 }}>{p.sku}</span>}</div>
                    <div style={{ color: low ? C.bad : '#e2e8f0', fontWeight: low ? 700 : 400 }}>{p.stock_qty}{low && ' ⚠️'}</div>
                    <div>{sym}{(p.sale_price || 0).toFixed(2)}</div>
                    <div style={{ color: C.muted }}>{sym}{(p.cost_price || 0).toFixed(2)}</div>
                    <div style={{ color: m >= 50 ? C.good : m >= 30 ? C.warn : C.bad, fontWeight: 700 }}>{m.toFixed(0)}%</div>
                    <div style={{ color: C.muted }}>{soldMap[p.id] || 0}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Backbar usage logging */}
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Backbar Usage Log</div>
          <div style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>Track professional-use product per service to capture cost-per-service.</div>

          {scanError && (
            <div style={{ background: '#451a03', border: `1px solid ${C.warn}`, borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#fcd34d' }}>⚠️ {scanError}</div>
          )}
          {scanActive && (
            <div style={{ marginBottom: 14 }}>
              <video ref={videoRef} playsInline muted style={{ width: '100%', maxWidth: 360, borderRadius: 10, background: '#000', display: 'block' }} />
              <div style={{ fontSize: 12, color: C.dim, margin: '8px 0' }}>Point at the product barcode, then type the matched product name below. (Barcode decoding can be wired to a scanner library later.)</div>
              <button onClick={stopScan} style={{ background: '#334155', border: 'none', color: C.muted, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Stop Camera</button>
            </div>
          )}

          <form onSubmit={logUsage} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', gap: 10, alignItems: 'center' }}>
            <input list="salon-products" style={inputStyle} placeholder="Product" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
            <datalist id="salon-products">{inventory.map(p => <option key={p.id} value={p.name} />)}</datalist>
            <input style={inputStyle} placeholder="Amount used (e.g. 30ml)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <input style={inputStyle} placeholder="Linked service" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              {!scanActive && <button type="button" onClick={startScan} style={{ background: '#334155', border: 'none', color: '#e2e8f0', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>📷 Scan</button>}
              <button type="submit" style={{ background: ACC, border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Log</button>
            </div>
          </form>

          {usage.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {usage.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                  <span style={{ fontWeight: 600, flex: 1 }}>{u.product_name}</span>
                  <span style={{ color: C.muted }}>{u.amount_used ? `${u.amount_used}${u.unit || ''}` : '—'}</span>
                  <span style={{ color: C.muted }}>{u.service_name || 'General'}</span>
                  <span style={{ color: ACC, fontWeight: 700 }}>{sym}{(u.cost || 0).toFixed(2)}/svc</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
