'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import { tokens, Button, Banner, Input, Card } from '@/components/ui'

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
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<InvItem[]>([])
  const [soldMap, setSoldMap] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')

  // Add product (retail/backbar stock tagged sector='salon' — mirrors /repair/parts)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [productForm, setProductForm] = useState({ name: '', sku: '', stock_qty: '', cost_price: '', sale_price: '', unit: '', low_stock_threshold: '' })

  // Backbar usage logging
  const [usage, setUsage] = useState<UsageLog[]>([])
  const [form, setForm] = useState({ product: '', amount: '', service: '' })

  // Optional barcode scan via camera
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanActive, setScanActive] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: { ...session.headers } }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
    }).catch(() => {})
  }, [authReady, session])

  useEffect(() => {
    if (!authReady || !session) return
    load()
    loadUsage()
    return () => stopScan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, session])

  async function loadUsage() {
    try {
      const res = await fetch('/api/pos/salon/product-usage', { headers: { ...session?.headers } })
      const data = await res.json()
      setUsage(data.usage || [])
    } catch (e) {
      console.error('Backbar usage load error:', e)
    }
  }

  async function load() {
    setLoading(true)
    try {
      // sector=salon restricts this to products actually tagged for the salon
      // vertical (retail/backbar items) instead of the owner's whole inventory —
      // without it this page showed every business-wide product (groceries,
      // general retail stock, etc.), matching the pattern already used by
      // /repair/parts (?sector=repair).
      const [invRes, txRes] = await Promise.all([
        fetch('/api/pos/inventory?sector=salon&limit=200', { headers: { ...session!.headers } }),
        fetch('/api/pos/transactions?limit=500', { headers: { ...session!.headers } }),
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

  async function addProduct() {
    if (!productForm.name.trim()) { setFormError(tc('salon_products.err_name_required')); return }
    setSaving(true); setFormError('')
    try {
      const res = await fetch('/api/pos/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({
          name: productForm.name.trim(),
          sku: productForm.sku.trim() || null,
          stock_qty: productForm.stock_qty ? Number(productForm.stock_qty) : 0,
          cost_price: productForm.cost_price ? Number(productForm.cost_price) : 0,
          sale_price: productForm.sale_price ? Number(productForm.sale_price) : 0,
          unit: productForm.unit.trim() || 'item',
          low_stock_threshold: productForm.low_stock_threshold ? Number(productForm.low_stock_threshold) : 5,
          // sector='salon' is what keeps this product scoped to the salon
          // vertical's /repair/parts-style inventory view (?sector=salon)
          // instead of leaking into — or being invisible from — other verticals.
          sector: 'salon',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.error || tc('salon_products.err_add_failed')); setSaving(false); return }
      setShowForm(false)
      setProductForm({ name: '', sku: '', stock_qty: '', cost_price: '', sale_price: '', unit: '', low_stock_threshold: '' })
      await load()
    } catch (err) {
      console.error('Add product error:', err)
      setFormError(tc('salon_products.err_add_failed_conn'))
    }
    setSaving(false)
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
      const res = await fetch('/api/pos/salon/product-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
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
    if (!navigator.mediaDevices?.getUserMedia) { setScanError(tc('salon_products.scan_err_unavailable')); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setScanActive(true)
    } catch (err: any) {
      const name = err?.name || ''
      if (name === 'NotAllowedError') setScanError(tc('salon_products.scan_err_denied'))
      else if (name === 'NotFoundError') setScanError(tc('salon_products.scan_err_notfound'))
      else setScanError(tc('salon_products.scan_err_generic'))
    }
  }

  function stopScan() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setScanActive(false)
  }

  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && streamRef.current) { el.srcObject = streamRef.current; el.play().catch(() => {}) }
  }, [])

  // Compact inline controls (search box in the table header, the usage-log
  // product/amount/service row) stay hand-styled — wrapping them in the shared
  // FormField components would inject a 16px margin-bottom wrapper that breaks
  // these tight single-line layouts.
  const inputStyle: React.CSSProperties = { background: tokens.bg, border: `1px solid ${tokens.border}`, color: tokens.ink, borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit' }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Button variant="secondary" onClick={() => router.push('/salon')}>← {tc('salon_products.back_salon')}</Button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: tokens.accent }}>{tc('salon_products.header_title')}</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{tc('salon_products.header_subtitle')}</div>
          </div>
        </div>
        <Button variant="primary" onClick={() => { setShowForm(s => !s); setFormError('') }}>
          {showForm ? tc('salon_products.cancel') : tc('salon_products.add_product')}
        </Button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Add product form */}
        {showForm && (
          <div className="pos-reveal" style={{ marginBottom: 20 }}>
          <Card style={{ border: `1px solid ${tokens.accentRing}` }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>{tc('salon_products.form_title')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              <Input label={tc('salon_products.label_name')} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder={tc('salon_products.placeholder_name')} />
              <Input label={tc('salon_products.label_sku')} value={productForm.sku} onChange={e => setProductForm(f => ({ ...f, sku: e.target.value }))} placeholder={tc('salon_products.placeholder_sku')} />
              <Input label={tc('salon_products.label_stock')} inputMode="numeric" value={productForm.stock_qty} onChange={e => setProductForm(f => ({ ...f, stock_qty: e.target.value }))} placeholder="0" />
              <Input label={tc('salon_products.label_cost', { sym })} inputMode="decimal" value={productForm.cost_price} onChange={e => setProductForm(f => ({ ...f, cost_price: e.target.value }))} placeholder="0.00" />
              <Input label={tc('salon_products.label_price', { sym })} inputMode="decimal" value={productForm.sale_price} onChange={e => setProductForm(f => ({ ...f, sale_price: e.target.value }))} placeholder="0.00" />
              <Input label={tc('salon_products.label_unit')} value={productForm.unit} onChange={e => setProductForm(f => ({ ...f, unit: e.target.value }))} placeholder={tc('salon_products.placeholder_unit')} />
              <Input label={tc('salon_products.label_reorder')} inputMode="numeric" value={productForm.low_stock_threshold} onChange={e => setProductForm(f => ({ ...f, low_stock_threshold: e.target.value }))} placeholder="5" />
            </div>
            {formError && <Banner tone="danger">{formError}</Banner>}
            <div style={{ display: 'flex', gap: 10, marginTop: -4 }}>
              <Button variant="primary" onClick={addProduct} loading={saving} loadingLabel={tc('salon_products.saving')}>{tc('salon_products.save_product')}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setFormError('') }}>{tc('salon_products.cancel')}</Button>
            </div>
          </Card>
          </div>
        )}

        {/* Low stock alerts */}
        {lowStock.length > 0 && (
          <Banner tone="warning">
            <strong>{lowStock.length === 1 ? tc('salon_products.low_stock_one', { count: lowStock.length }) : tc('salon_products.low_stock_many', { count: lowStock.length })}</strong>
            <br />
            {lowStock.map(p => `${p.name} (${p.stock_qty})`).join(' · ')}
          </Banner>
        )}

        {/* Retail products table */}
        <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${tokens.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{tc('salon_products.retail_products')}</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tc('salon_products.search_placeholder')} style={{ ...inputStyle, width: 200 }} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 720 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr', gap: 8, padding: '12px 20px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1 }}>
                <div>{tc('salon_products.col_name')}</div><div>{tc('salon_products.col_stock')}</div><div>{tc('salon_products.col_price')}</div><div>{tc('salon_products.col_cost')}</div><div>{tc('salon_products.col_margin')}</div><div>{tc('salon_products.col_units_sold')}</div>
              </div>
              {loading && <div style={{ padding: 20, color: tokens.hint, fontSize: 13 }}>{tc('salon_products.loading')}</div>}
              {!loading && filtered.length === 0 && <div style={{ padding: 20, color: tokens.hint, fontSize: 13, textAlign: 'center' }}>{search.trim() ? tc('salon_products.empty_search') : tc('salon_products.empty_products')}</div>}
              {filtered.map((p, idx) => {
                const m = margin(p)
                const low = p.stock_qty <= (p.low_stock_threshold || 5)
                return (
                  <div key={p.id} className="pos-item" style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr', gap: 8, padding: '12px 20px', borderBottom: `1px solid ${tokens.border}`, fontSize: 13, alignItems: 'center', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <div style={{ fontWeight: 600 }}>{p.name}{p.sku && <span style={{ color: tokens.hint, fontWeight: 400, marginLeft: 6, fontSize: 11 }}>{p.sku}</span>}</div>
                    <div style={{ color: low ? tokens.danger : tokens.ink, fontWeight: low ? 700 : 400 }}>{p.stock_qty}{low && ' ⚠️'}</div>
                    <div>{sym}{(p.sale_price || 0).toFixed(2)}</div>
                    <div style={{ color: tokens.muted }}>{sym}{(p.cost_price || 0).toFixed(2)}</div>
                    <div style={{ color: m >= 50 ? tokens.success : m >= 30 ? tokens.warning : tokens.danger, fontWeight: 700 }}>{m.toFixed(0)}%</div>
                    <div style={{ color: tokens.muted }}>{soldMap[p.id] || 0}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Backbar usage logging */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tc('salon_products.backbar_title')}</div>
          <div style={{ fontSize: 12, color: tokens.hint, marginBottom: 14 }}>{tc('salon_products.backbar_subtitle')}</div>

          {scanError && <Banner tone="warning">{scanError}</Banner>}
          {scanActive && (
            <div className="pos-reveal" style={{ marginBottom: 14 }}>
              <video ref={attachVideo} autoPlay playsInline muted style={{ width: '100%', maxWidth: 360, borderRadius: 10, background: '#000', display: 'block' }} />
              <div style={{ fontSize: 12, color: tokens.hint, margin: '8px 0' }}>{tc('salon_products.scan_hint')}</div>
              <Button variant="secondary" onClick={stopScan}>{tc('salon_products.stop_camera')}</Button>
            </div>
          )}

          <form onSubmit={logUsage} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', gap: 10, alignItems: 'center' }}>
            <input list="salon-products" style={inputStyle} placeholder={tc('salon_products.form_product')} value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
            <datalist id="salon-products">{inventory.map(p => <option key={p.id} value={p.name} />)}</datalist>
            <input style={inputStyle} placeholder={tc('salon_products.form_amount')} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <input style={inputStyle} placeholder={tc('salon_products.form_service')} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              {!scanActive && <Button type="button" variant="secondary" onClick={startScan}>{tc('salon_products.scan')}</Button>}
              <Button type="submit" variant="primary">{tc('salon_products.log')}</Button>
            </div>
          </form>

          {usage.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {usage.map((u, idx) => (
                <div key={u.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 12, background: tokens.bg, borderRadius: 8, padding: '10px 14px', fontSize: 13, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <span style={{ fontWeight: 600, flex: 1 }}>{u.product_name}</span>
                  <span style={{ color: tokens.muted }}>{u.amount_used ? `${u.amount_used}${u.unit || ''}` : tc('salon_products.usage_dash')}</span>
                  <span style={{ color: tokens.muted }}>{u.service_name || tc('salon_products.usage_general')}</span>
                  <span style={{ color: tokens.accent, fontWeight: 700 }}>{tc('salon_products.usage_per_svc', { sym, cost: (u.cost || 0).toFixed(2) })}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
