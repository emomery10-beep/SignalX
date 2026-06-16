'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

const ACC = '#d08a59'

interface OrderItem {
  id: string; name: string; unit_price: number; food_cost: number
  qty: number; status: string; course: string; station: string; notes?: string
  modifiers: { id: string; group_name: string; name: string; price_adjustment: number }[]
}
interface Order {
  id: string; status: string; order_type: string; covers: number
  subtotal: number; discount_amount: number; tax_amount: number; total: number
  payment_type?: string; customer_name?: string; notes?: string
  created_at: string; seated_at?: string; paid_at?: string
  table?: { id: string; name: string; section: string }
  server?: { id: string; name: string }
  order_items: OrderItem[]
}

interface MenuItem {
  id: string; name: string; price: number; food_cost: number; station: string
  course?: string; category_id: string; eighty_sixed: boolean; available: boolean
  modifier_groups: { id: string; name: string; selection_type: string; required: boolean; modifiers: { id: string; name: string; price_adjustment: number }[] }[]
}
interface MenuCategory { id: string; name: string; icon: string; items: MenuItem[] }

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  open:       { label: 'Open',       color: '#3b82f6' },
  sent:       { label: 'In Kitchen', color: '#f59e0b' },
  all_served: { label: 'Ready',      color: '#22c55e' },
  paid:       { label: 'Paid',       color: '#64748b' },
  void:       { label: 'Void',       color: '#ef4444' },
}

function elapsed(from?: string): string {
  if (!from) return ''
  const mins = Math.floor((Date.now() - new Date(from).getTime()) / 60000)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function OrdersPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { session, ready: authReady } = usePosAuth()

  const [sym, setSym]           = useState('£')
  const [orders, setOrders]     = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [menu, setMenu]         = useState<MenuCategory[]>([])
  const [loading, setLoading]   = useState(true)
  const [view, setView]         = useState<'active' | 'add_items' | 'pay'>('active')
  const [activeCat, setActiveCat] = useState('')
  const [cart, setCart]         = useState<{ item: MenuItem; qty: number; notes: string; mods: any[] }[]>([])
  const [covers, setCovers]     = useState(1)
  const [payMethod, setPayMethod] = useState('card')
  const [discount, setDiscount] = useState(0)
  const [paying, setPaying]     = useState(false)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: session.headers }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
    }).catch(() => {})
  }, [authReady, session])

  const loadOrders = useCallback(async () => {
    if (!session) return
    const res = await fetch('/api/pos/restaurant/orders?active=true', { headers: session.headers })
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }, [session])

  const loadMenu = useCallback(async () => {
    if (!session) return
    const res = await fetch('/api/pos/restaurant/menu', { headers: session.headers })
    const data = await res.json()
    const cats: MenuCategory[] = data.menu || []
    setMenu(cats)
    if (cats.length && !activeCat) setActiveCat(cats[0]?.id || '')
  }, [session])

  useEffect(() => {
    if (!authReady || !session) return
    loadOrders()
    loadMenu()
    // Open specific order from URL
    const orderId = searchParams.get('order') || searchParams.get('pay')
    const isNew   = searchParams.get('new')
    if (orderId) {
      // Will be selected after orders load
    }
    if (isNew) setView('add_items')
    const interval = setInterval(loadOrders, 15000)
    return () => clearInterval(interval)
  }, [authReady, session])

  // Select order from URL params after orders load
  useEffect(() => {
    const orderId = searchParams.get('order') || searchParams.get('pay')
    if (orderId && orders.length) {
      const o = orders.find(o => o.id === orderId)
      if (o) { setSelected(o); if (searchParams.get('pay')) setView('pay') }
    }
  }, [orders])

  function addToCart(item: MenuItem) {
    if (item.eighty_sixed) return
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id)
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { item, qty: 1, notes: '', mods: [] }]
    })
  }

  function removeFromCart(itemId: string) {
    setCart(prev => {
      const ex = prev.find(c => c.item.id === itemId)
      if (!ex) return prev
      if (ex.qty > 1) return prev.map(c => c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c)
      return prev.filter(c => c.item.id !== itemId)
    })
  }

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0)

  async function sendOrder() {
    if (!cart.length || !session) return
    setSaving(true)
    const tableId = searchParams.get('table')
    const items = cart.map(c => ({
      menu_item_id: c.item.id, name: c.item.name,
      unit_price: c.item.price, food_cost: c.item.food_cost || 0,
      qty: c.qty, station: c.item.station || 'all',
      course: c.item.course || 'main', notes: c.notes || null,
      modifiers: c.mods,
    }))

    if (selected) {
      // Add items to existing order
      await fetch('/api/pos/restaurant/orders', {
        method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, action: 'add_items', items }),
      })
    } else {
      // New order
      await fetch('/api/pos/restaurant/orders', {
        method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_id: tableId || null, covers, items }),
      })
    }
    setCart([])
    setSaving(false)
    setView('active')
    await loadOrders()
  }

  async function payOrder() {
    if (!selected || !session) return
    setPaying(true)
    await fetch('/api/pos/restaurant/orders', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, action: 'pay', payment_type: payMethod, discount_amount: discount }),
    })
    setPaying(false)
    setSelected(null)
    setView('active')
    await loadOrders()
  }

  const inp: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
    color: '#f1f5f9', padding: '8px 10px', fontSize: 13,
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>📋 Orders</div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button onClick={() => { setSelected(null); setView('add_items') }}
            style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            + New Order
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Orders List */}
        <div style={{ width: 320, borderRight: '1px solid #1e293b', overflow: 'auto' }}>
          {loading && <div style={{ padding: 20, color: '#64748b', fontSize: 13 }}>Loading orders...</div>}
          {!loading && orders.length === 0 && (
            <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
              <div>No active orders — tap &ldquo;+ New Order&rdquo; to start one</div>
            </div>
          )}
          {orders.map((order, idx) => {
            const st = STATUS_BADGE[order.status] || STATUS_BADGE.open
            const isSelected = selected?.id === order.id
            return (
              <button key={order.id} type="button" className="pos-item"
                onClick={() => { setSelected(order); setView('active') }}
                style={{ animationDelay: `${Math.min(idx, 8) * 40}ms`,
                  padding: '14px 16px', borderBottom: '1px solid #1e293b', cursor: 'pointer',
                  background: isSelected ? '#1e293b' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${ACC}` : '3px solid transparent',
                  width: '100%', textAlign: 'left', borderTop: 'none', borderRight: 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {order.table?.name || order.order_type} {order.customer_name ? `· ${order.customer_name}` : ''}
                  </div>
                  <span style={{ background: st.color + '20', color: st.color, borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                  <span>{order.covers} covers · {order.order_items?.length || 0} items</span>
                  <span style={{ color: ACC, fontWeight: 600 }}>{sym}{order.total?.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{elapsed(order.seated_at)}</div>
              </button>
            )
          })}
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>

          {/* Order Detail */}
          {view === 'active' && selected && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{selected.table?.name || selected.order_type}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{selected.covers} covers · {elapsed(selected.seated_at)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setView('add_items')}
                    style={{ background: '#334155', border: 'none', color: '#e2e8f0', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                    + Add Items
                  </button>
                  <button onClick={() => setView('pay')} className="pos-btn-primary"
                    style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                    Pay Bill
                  </button>
                </div>
              </div>

              {selected.order_items?.map((item, idx) => {
                const st = item.status
                const stColor = st === 'ready' ? '#22c55e' : st === 'preparing' ? '#f59e0b' : st === 'served' ? '#64748b' : '#94a3b8'
                return (
                  <div key={item.id} className="pos-item" style={{ animationDelay: `${Math.min(idx, 8) * 40}ms`, background: '#1e293b', borderRadius: 10, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: '#0f172a', color: ACC, fontWeight: 800, fontSize: 18, borderRadius: 6, padding: '2px 10px', minWidth: 36, textAlign: 'center' }}>{item.qty}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      {item.notes && <div style={{ fontSize: 12, color: '#f59e0b', fontStyle: 'italic' }}>✎ {item.notes}</div>}
                      {item.modifiers?.map(m => (
                        <div key={m.id} style={{ fontSize: 11, color: '#64748b' }}>+ {m.name}{m.price_adjustment ? ` (+${sym}${m.price_adjustment.toFixed(2)})` : ''}</div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: ACC }}>{sym}{(item.unit_price * item.qty).toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: stColor, fontWeight: 600 }}>{st}</div>
                    </div>
                  </div>
                )
              })}

              <div style={{ background: '#1e293b', borderRadius: 10, padding: '14px 16px', marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14, marginBottom: 4 }}>
                  <span>Subtotal</span><span>{sym}{selected.subtotal?.toFixed(2)}</span>
                </div>
                {(selected.discount_amount || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e', fontSize: 14, marginBottom: 4 }}>
                    <span>Discount</span><span>−{sym}{selected.discount_amount?.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: '#f1f5f9', borderTop: '1px solid #334155', paddingTop: 10, marginTop: 6 }}>
                  <span>Total</span><span style={{ color: ACC }}>{sym}{selected.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Add Items */}
          {view === 'add_items' && (
            <div style={{ display: 'flex', height: '100%', gap: 16 }}>
              {/* Menu */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{selected ? `Add to ${selected.table?.name || 'order'}` : 'New Order — Select Items'}</div>
                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  {menu.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                      style={{ background: activeCat === cat.id ? ACC : '#1e293b', border: 'none', color: activeCat === cat.id ? '#fff' : '#94a3b8', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: activeCat === cat.id ? 700 : 400 }}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
                {/* Items grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {(menu.find(c => c.id === activeCat)?.items || []).map(item => {
                    const inCart = cart.find(c => c.item.id === item.id)?.qty || 0
                    return (
                      <button key={item.id} onClick={() => addToCart(item)} disabled={item.eighty_sixed}
                        style={{
                          background: '#1e293b', border: inCart ? `2px solid ${ACC}` : '1px solid #334155',
                          borderRadius: 10, padding: '12px', cursor: item.eighty_sixed ? 'not-allowed' : 'pointer',
                          textAlign: 'left', opacity: item.eighty_sixed ? 0.4 : 1, position: 'relative',
                        }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#e2e8f0' }}>{item.name}</div>
                        <div style={{ color: ACC, fontWeight: 700, fontSize: 15 }}>{sym}{item.price?.toFixed(2)}</div>
                        {item.eighty_sixed && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>86'd</div>}
                        {inCart > 0 && (
                          <div style={{ position: 'absolute', top: 6, right: 8, background: ACC, color: '#fff', borderRadius: 10, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{inCart}</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Cart */}
              <div style={{ width: 280, background: '#1e293b', borderRadius: 12, padding: 16, height: 'fit-content', position: 'sticky', top: 0 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Order {sym}{cartTotal.toFixed(2)}</div>
                {!selected && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Covers</label>
                    <input type="number" value={covers} min={1} max={20} onChange={e => setCovers(parseInt(e.target.value) || 1)}
                      style={{ ...inp, width: '100%' }} />
                  </div>
                )}
                {cart.length === 0 && <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Tap items to add</div>}
                {cart.map(c => (
                  <div key={c.item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.item.name}</div>
                      <div style={{ fontSize: 11, color: ACC }}>{sym}{(c.item.price * c.qty).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button onClick={() => removeFromCart(c.item.id)} style={{ background: '#334155', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{c.qty}</span>
                      <button onClick={() => addToCart(c.item)} style={{ background: ACC, border: 'none', color: '#fff', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button onClick={() => setView('active')} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={sendOrder} disabled={!cart.length || saving} className="pos-btn-primary"
                    style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: (!cart.length || saving) ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: (!cart.length || saving) ? 0.5 : 1 }}>
                    {saving ? '...' : '🍳 Send to Kitchen'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pay */}
          {view === 'pay' && selected && (
            <div className="pos-sheet" style={{ maxWidth: 420, margin: '0 auto' }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Pay — {selected.table?.name || 'Order'}</div>
              <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
                  <span>Subtotal</span><span>{sym}{selected.subtotal?.toFixed(2)}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Discount ({sym})</label>
                  <input type="number" value={discount} min={0} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} style={{ ...inp, width: '100%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 22, borderTop: '1px solid #334155', paddingTop: 12 }}>
                  <span>Total</span>
                  <span style={{ color: ACC }}>{sym}{Math.max(0, (selected.subtotal || 0) - discount).toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Payment Method</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {['card', 'cash', 'contactless', 'split', 'voucher', 'mpesa'].map(m => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      style={{ background: payMethod === m ? ACC : '#1e293b', border: payMethod === m ? 'none' : '1px solid #334155', color: payMethod === m ? '#fff' : '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setView('active')} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '14px', borderRadius: 10, cursor: 'pointer' }}>Back</button>
                <button onClick={payOrder} disabled={paying} className="pos-btn-primary"
                  style={{ flex: 2, background: '#22c55e', border: 'none', color: '#fff', padding: '14px', borderRadius: 10, cursor: paying ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 16, opacity: paying ? 0.5 : 1 }}>
                  {paying ? 'Processing...' : `✓ Charge ${sym}${Math.max(0, (selected.subtotal || 0) - discount).toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OrdersPageWrapper() { return <Suspense><OrdersPage /></Suspense> }
