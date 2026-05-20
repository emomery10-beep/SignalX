'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:   { label: 'Pending',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
  accepted:  { label: 'Accepted',   color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  dot: '#22c55e' },
  ready:     { label: 'Ready',      color: ACC,        bg: 'rgba(208,138,89,0.12)', dot: ACC       },
  collected: { label: 'Collected',  color: '#64748b', bg: 'rgba(100,116,139,0.1)', dot: '#64748b' },
  rejected:  { label: 'Rejected',   color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  dot: '#ef4444' },
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

const inp: React.CSSProperties = {
  background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
  color: '#f1f5f9', padding: '8px 10px', fontSize: 13,
  boxSizing: 'border-box', width: '100%',
}

export default function OnlineOrdersPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym]     = useState('£')
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch(`${API}/api/pos/restaurant/online-orders?days=2`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }, [])

  useEffect(() => { if (ready) load() }, [ready, load])

  // Poll every 30s for new pending orders
  useEffect(() => {
    if (!ready) return
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [ready, load])

  async function accept(id: string) {
    setActioning(id)
    await fetch(`${API}/api/pos/restaurant/online-orders`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'accept' }),
    })
    setActioning(null)
    await load()
  }

  async function reject(id: string) {
    if (!confirm('Reject this order?')) return
    setActioning(id)
    await fetch(`${API}/api/pos/restaurant/online-orders`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'reject' }),
    })
    setActioning(null)
    await load()
  }

  async function markReady(id: string) {
    setActioning(id)
    await fetch(`${API}/api/pos/restaurant/online-orders`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'ready' }),
    })
    setActioning(null)
    await load()
  }

  async function markCollected(id: string) {
    setActioning(id)
    await fetch(`${API}/api/pos/restaurant/online-orders`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
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
    if (!addForm.customer_name || addForm.items.every(i => !i.name)) return
    setSaving(true)
    const items = addForm.items.filter(i => i.name).map(i => ({
      name: i.name, qty: parseInt(i.qty) || 1, price: parseFloat(i.price) || 0,
    }))
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    await fetch(`${API}/api/pos/restaurant/online-orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>📱 Online Orders</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Phone · Website · Delivery apps</div>
        </div>
        {pending.length > 0 && (
          <div style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
            {pending.length} pending!
          </div>
        )}
        <button onClick={() => setShowAdd(true)}
          style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          + Add Order
        </button>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Pending',   value: String(pending.length),                          color: pending.length > 0 ? '#ef4444' : '#64748b' },
            { label: 'Today Revenue', value: `${sym}${todayRev.toFixed(2)}`,              color: ACC },
            { label: 'Total Today',   value: String(orders.filter(o => {
              const d = new Date(o.created_at); const t = new Date(); t.setHours(0,0,0,0); return d >= t
            }).length),                                                                     color: '#94a3b8' },
            { label: 'Accepted',   value: String(orders.filter(o => o.status === 'accepted' || o.status === 'ready').length), color: '#22c55e' },
          ].map(k => (
            <div key={k.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, marginTop: 4 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {['pending', 'accepted', 'ready', 'collected', 'rejected', 'all'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ background: filterStatus === s ? (STATUS_CONFIG[s]?.dot || ACC) : '#1e293b', border: `1px solid ${filterStatus === s ? (STATUS_CONFIG[s]?.dot || ACC) : '#334155'}`, color: filterStatus === s ? '#fff' : '#94a3b8', padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: filterStatus === s ? 700 : 400 }}>
              {s === 'all' ? 'All' : (STATUS_CONFIG[s]?.label ?? s)}
            </button>
          ))}
        </div>

        {/* Pending alert */}
        {filterStatus === 'pending' && pending.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#22c55e' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700 }}>All clear — no pending orders</div>
          </div>
        )}

        {/* Order cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isPending  = order.status === 'pending'
            const isAccepted = order.status === 'accepted'
            const isReady    = order.status === 'ready'
            const urgencyColor = isPending ? '#ef4444' : cfg.color

            return (
              <div key={order.id} style={{ background: '#1e293b', border: `2px solid ${isPending ? '#ef4444' : '#334155'}`, borderRadius: 12, overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{ background: cfg.bg, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {SOURCE_ICONS[order.source] || '📦'} {order.customer_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      {order.source} · {elapsed(order.created_at)}
                      {order.customer_phone && ` · ${order.customer_phone}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: urgencyColor }}>{sym}{(order.total || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.dot}`, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                      {cfg.label}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '10px 16px' }}>
                  {(order.items_json || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 0', borderBottom: i < (order.items_json?.length ?? 0) - 1 ? '1px solid #0f172a' : 'none' }}>
                      <span style={{ background: '#0f172a', color: ACC, fontWeight: 800, borderRadius: 4, padding: '1px 7px', fontSize: 13, minWidth: 28, textAlign: 'center' }}>{item.qty}</span>
                      <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                      {item.notes && <span style={{ fontSize: 12, color: '#f59e0b', fontStyle: 'italic' }}>✎ {item.notes}</span>}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {(isPending || isAccepted || isReady) && (
                  <div style={{ padding: '10px 16px', display: 'flex', gap: 8, borderTop: '1px solid #0f172a' }}>
                    {isPending && (
                      <>
                        <button onClick={() => accept(order.id)} disabled={actioning === order.id}
                          style={{ flex: 2, background: '#22c55e', border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                          {actioning === order.id ? '...' : '✓ Accept'}
                        </button>
                        <button onClick={() => reject(order.id)} disabled={actioning === order.id}
                          style={{ flex: 1, background: '#334155', border: 'none', color: '#ef4444', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                          Reject
                        </button>
                      </>
                    )}
                    {isAccepted && (
                      <button onClick={() => markReady(order.id)} disabled={actioning === order.id}
                        style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                        {actioning === order.id ? '...' : '🔔 Mark Ready'}
                      </button>
                    )}
                    {isReady && (
                      <button onClick={() => markCollected(order.id)} disabled={actioning === order.id}
                        style={{ flex: 1, background: '#22c55e', border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                        {actioning === order.id ? '...' : '✅ Collected'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!loading && filtered.length === 0 && filterStatus !== 'pending' && (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
            <div>No orders with this status.</div>
          </div>
        )}
      </div>

      {/* Add Manual Order Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Add Phone/Walk-in Order</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Customer Name *</label>
                  <input value={addForm.customer_name} onChange={e => setAddForm(f => ({ ...f, customer_name: e.target.value }))} style={inp} placeholder="John Smith" />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Phone</label>
                  <input value={addForm.customer_phone} onChange={e => setAddForm(f => ({ ...f, customer_phone: e.target.value }))} style={inp} placeholder="+44 7700..." />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Source</label>
                <select value={addForm.source} onChange={e => setAddForm(f => ({ ...f, source: e.target.value }))} style={inp}>
                  <option value="phone">📞 Phone</option>
                  <option value="website">🌐 Website</option>
                  <option value="uber_eats">🚗 Uber Eats</option>
                  <option value="deliveroo">🦘 Deliveroo</option>
                  <option value="just_eat">🍕 Just Eat</option>
                </select>
              </div>

              {/* Items */}
              <div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items</span>
                  <button onClick={addFormItem} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 12 }}>+ Add item</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {addForm.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 30px', gap: 6 }}>
                      <input value={item.name} onChange={e => updateFormItem(idx, 'name', e.target.value)} style={inp} placeholder="Item name" />
                      <input type="number" min="1" value={item.qty} onChange={e => updateFormItem(idx, 'qty', e.target.value)} style={{ ...inp, textAlign: 'center' }} placeholder="Qty" />
                      <input type="number" step="0.01" value={item.price} onChange={e => updateFormItem(idx, 'price', e.target.value)} style={inp} placeholder="Price" />
                      <button onClick={() => removeFormItem(idx)} disabled={addForm.items.length === 1}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, opacity: addForm.items.length === 1 ? 0.3 : 1 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'right', marginTop: 6, fontSize: 13, color: ACC, fontWeight: 700 }}>
                  Total: {sym}{addForm.items.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 1), 0).toFixed(2)}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Notes</label>
                <input value={addForm.notes} onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))} style={inp} placeholder="Special instructions..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '11px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveManualOrder} disabled={saving || !addForm.customer_name}
                style={{ flex: 2, background: ACC, border: 'none', color: '#fff', padding: '11px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, opacity: !addForm.customer_name ? 0.5 : 1 }}>
                {saving ? '...' : '+ Add Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
