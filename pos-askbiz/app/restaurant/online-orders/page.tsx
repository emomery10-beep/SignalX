'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { tokens, Button, Input, Select, ListItem } from '@/components/ui'

const NS = 'restaurant_online_orders.'

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  pending:   { color: tokens.warning, bg: 'rgba(249,115,22,.08)', dot: tokens.warning },
  accepted:  { color: tokens.success, bg: tokens.successPale,     dot: tokens.success },
  ready:     { color: tokens.accent,  bg: tokens.accentPale,      dot: tokens.accent  },
  collected: { color: tokens.muted,   bg: 'rgba(107,103,96,0.08)', dot: tokens.muted  },
  rejected:  { color: tokens.danger,  bg: tokens.dangerPale,      dot: tokens.danger  },
}

const SOURCE_ICONS: Record<string, string> = {
  website: '🌐', phone: '📞', uber_eats: '🚗', deliveroo: '🦘', just_eat: '🍕',
}

interface OnlineOrder {
  id: string; status: string; customer_name: string; customer_phone: string | null
  subtotal: number; total: number; source: string; requested_time: string | null
  accepted_at: string | null; ready_at: string | null; collected_at: string | null
  created_at: string; order_id: string | null
  items_json: { name: string; qty: number; price?: number; notes?: string }[]
}

// Recessed field style for the compact item-grid inputs (not a clean fit for
// the shared <Input> — see FormField.tsx for the labeled equivalent used
// elsewhere on this page).
const inp: React.CSSProperties = {
  background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 6,
  color: tokens.ink, padding: '8px 10px', fontSize: 13,
  boxSizing: 'border-box', width: '100%',
}

export default function OnlineOrdersPage() {
  const router   = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
  const [orders, setOrders]   = useState<OnlineOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('pending')
  const [actioning, setActioning] = useState<string | null>(null)

  // Manual entry form
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [addForm, setAddForm] = useState({
    customer_name: '', customer_phone: '', source: 'phone', notes: '',
    items: [{ name: '', qty: '1', price: '' }],
  })

  const load = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const res  = await fetch('/api/pos/restaurant/online-orders?days=2', { headers: session.headers })
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }, [session])

  useEffect(() => { if (authReady && session) load() }, [authReady, session, load])

  // Poll every 30s for new pending orders
  useEffect(() => {
    if (!authReady || !session) return
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [authReady, session, load])

  async function accept(id: string) {
    if (!session) return
    setActioning(id)
    await fetch('/api/pos/restaurant/online-orders', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'accept' }),
    })
    setActioning(null)
    await load()
  }

  async function reject(id: string) {
    if (!confirm(tc(NS + 'confirm_reject')) || !session) return
    setActioning(id)
    await fetch('/api/pos/restaurant/online-orders', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'reject' }),
    })
    setActioning(null)
    await load()
  }

  async function markReady(id: string) {
    if (!session) return
    setActioning(id)
    await fetch('/api/pos/restaurant/online-orders', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'ready' }),
    })
    setActioning(null)
    await load()
  }

  async function markCollected(id: string) {
    if (!session) return
    setActioning(id)
    await fetch('/api/pos/restaurant/online-orders', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'collect' }),
    })
    setActioning(null)
    await load()
  }

  function addFormItem() {
    setAddForm(f => ({ ...f, items: [...f.items, { name: '', qty: '1', price: '' }] }))
  }

  function removeFormItem(idx: number) {
    setAddForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))
  }

  function updateFormItem(idx: number, key: string, val: string) {
    setAddForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [key]: val } : it) }))
  }

  async function saveManualOrder() {
    if (!addForm.customer_name || addForm.items.every(i => !i.name) || !session) return
    setSaving(true)
    const items = addForm.items.filter(i => i.name).map(i => ({
      name: i.name, qty: parseInt(i.qty) || 1, price: parseFloat(i.price) || 0,
    }))
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    await fetch('/api/pos/restaurant/online-orders', {
      method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: addForm.customer_name,
        customer_phone: addForm.customer_phone || null,
        source: addForm.source,
        items_json: items,
        subtotal, total: subtotal,
        notes: addForm.notes || null,
      }),
    })
    setSaving(false)
    setShowAdd(false)
    setAddForm({ customer_name: '', customer_phone: '', source: 'phone', notes: '', items: [{ name: '', qty: '1', price: '' }] })
    await load()
  }

  const pending   = orders.filter(o => o.status === 'pending')
  const filtered  = orders.filter(o => filterStatus === 'all' || o.status === filterStatus)
  const todayRev  = orders.filter(o => o.status === 'collected').reduce((s, o) => s + (o.total || 0), 0)

  function elapsed(iso: string) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    return mins < 60
      ? tc(NS + 'elapsed_minutes', { mins })
      : tc(NS + 'elapsed_hours', { hours: Math.floor(mins / 60), mins: mins % 60 })
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: tokens.accent }}>{tc(NS + 'header_title')}</div>
          <div style={{ fontSize: 11, color: tokens.muted }}>{tc(NS + 'header_subtitle')}</div>
        </div>
        {pending.length > 0 && (
          <div style={{ background: tokens.danger, color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
            {tc(NS + 'pending_badge', { count: pending.length })}
          </div>
        )}
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          {tc(NS + 'add_order')}
        </Button>
      </div>

      {/* Account bar — language + sign out, same slim row on every restaurant screen */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '6px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <LanguageToggle inline />
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
          style={{ background: tokens.bg, border: `1px solid ${tokens.border}`, color: tokens.muted, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          {tc('common.sign_out')}
        </button>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: tc(NS + 'kpi_pending'),   value: String(pending.length),                          color: pending.length > 0 ? tokens.danger : tokens.muted },
            { label: tc(NS + 'kpi_today_revenue'), value: `${sym}${todayRev.toFixed(2)}`,              color: tokens.accent },
            { label: tc(NS + 'kpi_total_today'),   value: String(orders.filter(o => {
              const d = new Date(o.created_at); const t = new Date(); t.setHours(0,0,0,0); return d >= t
            }).length),                                                                     color: tokens.hint },
            { label: tc(NS + 'kpi_accepted'),   value: String(orders.filter(o => o.status === 'accepted' || o.status === 'ready').length), color: tokens.success },
          ].map(k => (
            <div key={k.label} style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, marginTop: 4 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {['pending', 'accepted', 'ready', 'collected', 'rejected', 'all'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ background: filterStatus === s ? (STATUS_CONFIG[s]?.dot || tokens.accent) : tokens.surface, border: `1px solid ${filterStatus === s ? (STATUS_CONFIG[s]?.dot || tokens.accent) : tokens.border}`, color: filterStatus === s ? '#fff' : tokens.hint, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: filterStatus === s ? 700 : 400 }}>
              {s === 'all' ? tc(NS + 'filter_all') : (STATUS_CONFIG[s] ? tc(NS + 'status_' + s) : s)}
            </button>
          ))}
        </div>

        {/* Pending alert */}
        {filterStatus === 'pending' && pending.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: tokens.success }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700 }}>{tc(NS + 'all_clear_heading')}</div>
          </div>
        )}

        {/* Order cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((order, idx) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isPending  = order.status === 'pending'
            const isAccepted = order.status === 'accepted'
            const isReady    = order.status === 'ready'
            const urgencyColor = isPending ? tokens.danger : cfg.color

            return (
              <ListItem key={order.id} index={idx} style={{ background: tokens.surface, border: `2px solid ${isPending ? tokens.danger : tokens.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{ background: cfg.bg, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {SOURCE_ICONS[order.source] || '📦'} {order.customer_name}
                    </div>
                    <div style={{ fontSize: 12, color: tokens.hint, marginTop: 2 }}>
                      {order.source} · {elapsed(order.created_at)}
                      {order.customer_phone && ` · ${order.customer_phone}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: urgencyColor }}>{sym}{(order.total || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.dot}`, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                      {STATUS_CONFIG[order.status] ? tc(NS + 'status_' + order.status) : order.status}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '10px 16px' }}>
                  {(order.items_json || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 0', borderBottom: i < (order.items_json?.length ?? 0) - 1 ? `1px solid ${tokens.border}` : 'none' }}>
                      <span style={{ background: tokens.bg, color: tokens.accent, fontWeight: 800, borderRadius: 4, padding: '1px 7px', fontSize: 13, minWidth: 28, textAlign: 'center' }}>{item.qty}</span>
                      <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                      {item.notes && <span style={{ fontSize: 12, color: tokens.warning, fontStyle: 'italic' }}>✎ {item.notes}</span>}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {(isPending || isAccepted || isReady) && (
                  <div style={{ padding: '10px 16px', display: 'flex', gap: 8, borderTop: `1px solid ${tokens.border}` }}>
                    {isPending && (
                      <>
                        <Button variant="primary" size="lg" onClick={() => accept(order.id)} disabled={actioning === order.id}
                          loading={actioning === order.id} loadingLabel={tc(NS + 'working')}
                          style={{ flex: 2, background: tokens.success }}>
                          {tc(NS + 'accept')}
                        </Button>
                        <Button variant="danger" size="lg" onClick={() => reject(order.id)} disabled={actioning === order.id}
                          style={{ flex: 1 }}>
                          {tc(NS + 'reject')}
                        </Button>
                      </>
                    )}
                    {isAccepted && (
                      <Button variant="primary" size="lg" onClick={() => markReady(order.id)} disabled={actioning === order.id}
                        loading={actioning === order.id} loadingLabel={tc(NS + 'working')}
                        style={{ flex: 1 }}>
                        {tc(NS + 'mark_ready')}
                      </Button>
                    )}
                    {isReady && (
                      <Button variant="primary" size="lg" onClick={() => markCollected(order.id)} disabled={actioning === order.id}
                        loading={actioning === order.id} loadingLabel={tc(NS + 'working')}
                        style={{ flex: 1, background: tokens.success }}>
                        {tc(NS + 'collected')}
                      </Button>
                    )}
                  </div>
                )}
              </ListItem>
            )
          })}
        </div>

        {!loading && filtered.length === 0 && filterStatus !== 'pending' && (
          <div style={{ textAlign: 'center', padding: 60, color: tokens.muted }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
            <div>{tc(NS + 'no_orders_status')}</div>
          </div>
        )}
      </div>

      {/* Add Manual Order Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{tc(NS + 'modal_title')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label={tc(NS + 'label_customer_name')} value={addForm.customer_name} onChange={e => setAddForm(f => ({ ...f, customer_name: e.target.value }))} placeholder={tc(NS + 'placeholder_customer_name')} style={{ fontSize: 13 }} />
                <Input label={tc(NS + 'label_phone')} value={addForm.customer_phone} onChange={e => setAddForm(f => ({ ...f, customer_phone: e.target.value }))} placeholder={tc(NS + 'placeholder_phone')} style={{ fontSize: 13 }} />
              </div>
              <Select label={tc(NS + 'label_source')} value={addForm.source} onChange={e => setAddForm(f => ({ ...f, source: e.target.value }))} style={{ fontSize: 13 }}>
                <option value="phone">{tc(NS + 'source_phone')}</option>
                <option value="website">{tc(NS + 'source_website')}</option>
                <option value="uber_eats">{tc(NS + 'source_uber_eats')}</option>
                <option value="deliveroo">{tc(NS + 'source_deliveroo')}</option>
                <option value="just_eat">{tc(NS + 'source_just_eat')}</option>
              </Select>

              {/* Items */}
              <div>
                <div style={{ fontSize: 11, color: tokens.muted, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{tc(NS + 'items_label')}</span>
                  <button onClick={addFormItem} style={{ background: 'none', border: 'none', color: tokens.accent, cursor: 'pointer', fontSize: 12 }}>{tc(NS + 'add_item')}</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {addForm.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 30px', gap: 6 }}>
                      <input value={item.name} onChange={e => updateFormItem(idx, 'name', e.target.value)} style={inp} placeholder={tc(NS + 'placeholder_item_name')} />
                      <input type="number" min="1" value={item.qty} onChange={e => updateFormItem(idx, 'qty', e.target.value)} style={{ ...inp, textAlign: 'center' }} placeholder={tc(NS + 'placeholder_qty')} />
                      <input type="number" step="0.01" value={item.price} onChange={e => updateFormItem(idx, 'price', e.target.value)} style={inp} placeholder={tc(NS + 'placeholder_price')} />
                      <button onClick={() => removeFormItem(idx)} disabled={addForm.items.length === 1}
                        style={{ background: 'none', border: 'none', color: tokens.danger, cursor: 'pointer', fontSize: 16, opacity: addForm.items.length === 1 ? 0.3 : 1 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'right', marginTop: 6, fontSize: 13, color: tokens.accent, fontWeight: 700 }}>
                  {tc(NS + 'modal_total', { sym, total: addForm.items.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 1), 0).toFixed(2) })}
                </div>
              </div>

              <Input label={tc(NS + 'label_notes')} value={addForm.notes} onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))} placeholder={tc(NS + 'placeholder_notes')} style={{ fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <Button variant="secondary" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '11px' }}>{tc(NS + 'cancel')}</Button>
              <Button variant="primary" onClick={saveManualOrder} disabled={saving || !addForm.customer_name}
                loading={saving} loadingLabel={tc(NS + 'working')}
                style={{ flex: 2, padding: '11px' }}>
                {tc(NS + 'add_order')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
