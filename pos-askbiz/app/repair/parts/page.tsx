'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import { Button, Banner, Input, Card } from '@/components/ui'

// ── Design tokens (from CSS variables in globals.css) ──────────────────────
// Mirrors app/factory/page.tsx's pattern.
const tokens = {
  bg:        'var(--pos-bg)',
  surface:   'var(--pos-surface)',
  border:    'var(--pos-border)',
  ink:       'var(--pos-ink)',
  muted:     'var(--pos-muted)',
  hint:      'var(--pos-hint)',
  accent:    'var(--pos-accent)',
  danger:      'var(--pos-danger)',
  dangerPale:  'var(--pos-danger-pale)',
  success:   'var(--pos-success)',
  warning:   'var(--pos-warning)',
}

interface Part {
  id: string
  name: string
  sku: string | null
  stock_qty: number | null
  cost_price: number | null
  sale_price: number | null
  low_stock_threshold: number | null
  supplier?: string | null
}

export default function RepairParts() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { config, sym } = usePosConfig(session, authReady)
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // add form
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ name: '', sku: '', stock_qty: '', cost_price: '', sale_price: '', low_stock_threshold: '', supplier: '' })

  useEffect(() => {
    if (config?.staff_sector && config.staff_sector !== 'repair') router.push('/pos')
  }, [config, router])

  const loadParts = useCallback(async () => {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/inventory?sector=repair&limit=200', { headers: { ...session.headers } })
      const data = await res.json()
      setParts(data.inventory || [])
    } catch (e) { console.error('Parts load error:', e); setParts([]) }
    finally { setLoading(false) }
  }, [session])

  useEffect(() => { if (authReady && session) loadParts() }, [authReady, session, loadParts])

  const addPart = async () => {
    if (!form.name.trim()) { setFormError(tc('repair_parts.err_name_required')); return }
    setSaving(true); setFormError('')
    try {
      const res = await fetch('/api/pos/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({
          name: form.name.trim(),
          sku: form.sku.trim() || null,
          stock_qty: form.stock_qty ? Number(form.stock_qty) : 0,
          cost_price: form.cost_price ? Number(form.cost_price) : 0,
          sale_price: form.sale_price ? Number(form.sale_price) : 0,
          low_stock_threshold: form.low_stock_threshold ? Number(form.low_stock_threshold) : 5,
          supplier: form.supplier.trim() || null,
          sector: 'repair',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.error || tc('repair_parts.err_add_failed')); setSaving(false); return }
      setShowForm(false)
      setForm({ name: '', sku: '', stock_qty: '', cost_price: '', sale_price: '', low_stock_threshold: '', supplier: '' })
      loadParts()
    } catch { setFormError(tc('repair_parts.err_add_failed_conn')) }
    setSaving(false)
  }

  const filtered = parts.filter(p => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [p.name, p.sku, p.supplier].filter(Boolean).some(v => (v as string).toLowerCase().includes(q))
  })

  const isLow = (p: Part) => {
    const stock = p.stock_qty ?? 0
    const threshold = p.low_stock_threshold ?? 5
    return stock <= threshold
  }
  const lowCount = parts.filter(isLow).length

  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 14px', fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, borderBottom: `1px solid ${tokens.border}` }
  const td: React.CSSProperties = { padding: '12px 14px', fontSize: 13, borderBottom: `1px solid ${tokens.surface}` }

  if (!authReady) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.bg, color: tokens.muted, fontFamily: 'system-ui, sans-serif' }}>{tc('repair_parts.loading')}</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/repair')} style={{ background: tokens.border, border: 'none', color: tokens.muted, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: tokens.accent }}>{tc('repair_parts.header_title')}</div>
          <div style={{ fontSize: 12, color: tokens.muted }}>{tc('repair_parts.header_parts' + (parts.length === 1 ? '_one' : '_other'), { count: parts.length })}{lowCount > 0 ? tc('repair_parts.header_low_suffix', { count: lowCount }) : ''}</div>
        </div>
        <Button variant="primary" size="md" onClick={() => { setShowForm(s => !s); setFormError('') }}>
          {showForm ? tc('repair_parts.cancel') : tc('repair_parts.add_part')}
        </Button>
      </div>

      <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
        {/* Add form */}
        {showForm && (
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{tc('repair_parts.form_title')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              <Input label={tc('repair_parts.label_name')} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={tc('repair_parts.placeholder_name')} />
              <Input label={tc('repair_parts.label_sku')} value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder={tc('repair_parts.placeholder_sku')} />
              <Input label={tc('repair_parts.label_stock')} inputMode="numeric" value={form.stock_qty} onChange={e => setForm(f => ({ ...f, stock_qty: e.target.value }))} placeholder="0" />
              <Input label={tc('repair_parts.label_cost', { sym })} inputMode="decimal" value={form.cost_price} onChange={e => setForm(f => ({ ...f, cost_price: e.target.value }))} placeholder="0.00" />
              <Input label={tc('repair_parts.label_sale', { sym })} inputMode="decimal" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} placeholder="0.00" />
              <Input label={tc('repair_parts.label_reorder')} inputMode="numeric" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: e.target.value }))} placeholder="5" />
              <Input label={tc('repair_parts.label_supplier')} value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder={tc('repair_parts.placeholder_supplier')} />
            </div>
            {formError && <Banner tone="danger">{formError}</Banner>}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <Button variant="primary" size="md" onClick={addPart} loading={saving} loadingLabel={tc('repair_parts.saving')}>{tc('repair_parts.save_part')}</Button>
              <Button variant="secondary" size="md" onClick={() => setShowForm(false)}>{tc('repair_parts.cancel')}</Button>
            </div>
          </div>
        )}

        {/* Search */}
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={tc('repair_parts.search_placeholder')}
          style={{ background: tokens.surface }} />

        {/* Table */}
        <Card style={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}>
          {loading && parts.length === 0 && <div style={{ padding: 24, color: tokens.hint, fontSize: 13 }}>{tc('repair_parts.loading_parts')}</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: tokens.hint, fontSize: 13 }}>
              {parts.length === 0 ? tc('repair_parts.empty_no_parts') : tc('repair_parts.empty_no_match')}
            </div>
          )}
          {filtered.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                <thead>
                  <tr>
                    <th style={th}>{tc('repair_parts.th_part')}</th>
                    <th style={th}>{tc('repair_parts.th_sku')}</th>
                    <th style={{ ...th, textAlign: 'right' }}>{tc('repair_parts.th_stock')}</th>
                    <th style={{ ...th, textAlign: 'right' }}>{tc('repair_parts.th_cost')}</th>
                    <th style={{ ...th, textAlign: 'right' }}>{tc('repair_parts.th_sale')}</th>
                    <th style={{ ...th, textAlign: 'right' }}>{tc('repair_parts.th_reorder')}</th>
                    <th style={th}>{tc('repair_parts.th_supplier')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => {
                    const low = isLow(p)
                    return (
                      <tr key={p.id} className="pos-item" style={{ background: low ? tokens.dangerPale : 'transparent', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                        <td style={{ ...td, fontWeight: 600, color: tokens.ink }}>{p.name}</td>
                        <td style={{ ...td, color: tokens.muted }}>{p.sku || '—'}</td>
                        <td style={{ ...td, textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: low ? tokens.danger : tokens.success }}>{p.stock_qty ?? 0}</span>
                          {low && <span style={{ fontSize: 10, color: tokens.danger, marginLeft: 6, fontWeight: 700 }}>{tc('repair_parts.low_badge')}</span>}
                        </td>
                        <td style={{ ...td, textAlign: 'right', color: tokens.muted }}>{sym}{Number(p.cost_price ?? 0).toFixed(2)}</td>
                        <td style={{ ...td, textAlign: 'right', color: tokens.muted }}>{sym}{Number(p.sale_price ?? 0).toFixed(2)}</td>
                        <td style={{ ...td, textAlign: 'right', color: tokens.hint }}>{p.low_stock_threshold ?? 5}</td>
                        <td style={{ ...td, color: tokens.muted }}>{p.supplier || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
