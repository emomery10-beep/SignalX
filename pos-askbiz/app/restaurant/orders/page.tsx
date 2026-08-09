'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { tokens, Button, Input, ListItem } from '@/components/ui'

const ACC = tokens.accent

const NS = 'restaurant_orders.'

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

const STATUS_COLOR: Record<string, string> = {
  open:       tokens.accent,
  sent:       tokens.warning,
  all_served: tokens.success,
  paid:       tokens.muted,
  void:       tokens.danger,
}
// Pale background counterpart for each status pill — mirrors the accentPale/
// dangerPale/successPale tokens since a translucent hex suffix (e.g. `+'20'`)
// can't be appended to a CSS var() string.
const STATUS_BG: Record<string, string> = {
  open:       tokens.accentPale,
  sent:       'rgba(249,115,22,.08)',
  all_served: tokens.successPale,
  paid:       tokens.border,
  void:       tokens.dangerPale,
}

function elapsed(from?: string): string {
  if (!from) return ''
  const mins = Math.floor((Date.now() - new Date(from).getTime()) / 60000)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function OrdersPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)

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

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>{tc(NS + 'header_title')}</div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <Button variant="primary" onClick={() => { setSelected(null); setView('add_items') }}>
            {tc(NS + 'new_order')}
          </Button>
        </div>
      </div>

      {/* Account bar — language + sign out, same slim row on every restaurant screen */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '6px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <LanguageToggle inline />
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
          style={{ background: tokens.bg, border: `1px solid ${tokens.border}`, color: tokens.muted, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          {tc('common.sign_out')}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Orders List */}
        <div style={{ width: 320, borderRight: `1px solid ${tokens.border}`, overflow: 'auto' }}>
          {loading && <div style={{ padding: 20, color: tokens.muted, fontSize: 13 }}>{tc(NS + 'loading_orders')}</div>}
          {!loading && orders.length === 0 && (
            <div style={{ padding: 30, textAlign: 'center', color: tokens.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
              <div>{tc(NS + 'no_active_orders')}</div>
            </div>
          )}
          {orders.map((order, idx) => {
            const stColor = STATUS_COLOR[order.status] || STATUS_COLOR.open
            const stBg = STATUS_BG[order.status] || STATUS_BG.open
            const isSelected = selected?.id === order.id
            return (
              <button key={order.id} type="button" className="pos-item"
                onClick={() => { setSelected(order); setView('active') }}
                style={{ animationDelay: `${Math.min(idx, 8) * 40}ms`,
                  padding: '14px 16px', borderBottom: `1px solid ${tokens.border}`, cursor: 'pointer',
                  background: isSelected ? tokens.surface : 'transparent',
                  borderLeft: isSelected ? `3px solid ${ACC}` : '3px solid transparent',
                  width: '100%', textAlign: 'left', borderTop: 'none', borderRight: 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {order.table?.name || order.order_type} {order.customer_name ? `· ${order.customer_name}` : ''}
                  </div>
                  <span style={{ background: stBg, color: stColor, borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{tc(NS + 'status_' + order.status)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: tokens.muted }}>
                  <span>{tc(NS + 'covers_items', { covers: order.covers, items: order.order_items?.length || 0 })}</span>
                  <span style={{ color: ACC, fontWeight: 600 }}>{sym}{order.total?.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 11, color: tokens.muted, marginTop: 2 }}>{elapsed(order.seated_at)}</div>
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
                  <div style={{ color: tokens.muted, fontSize: 13 }}>{tc(NS + 'covers_elapsed', { covers: selected.covers, elapsed: elapsed(selected.seated_at) })}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" onClick={() => setView('add_items')}>
                    {tc(NS + 'add_items')}
                  </Button>
                  <Button variant="primary" onClick={() => setView('pay')}>
                    {tc(NS + 'pay_bill')}
                  </Button>
                </div>
              </div>

              {selected.order_items?.map((item, idx) => {
                const st = item.status
                const stColor = st === 'ready' ? tokens.success : st === 'preparing' ? tokens.warning : st === 'served' ? tokens.muted : tokens.hint
                const stLabel = (st === 'ready' || st === 'preparing' || st === 'served') ? tc(NS + 'item_status_' + st) : st
                return (
                  <ListItem key={item.id} index={idx} style={{ background: tokens.surface, borderRadius: 10, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: tokens.bg, color: ACC, fontWeight: 800, fontSize: 18, borderRadius: 6, padding: '2px 10px', minWidth: 36, textAlign: 'center' }}>{item.qty}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      {item.notes && <div style={{ fontSize: 12, color: tokens.warning, fontStyle: 'italic' }}>✎ {item.notes}</div>}
                      {item.modifiers?.map(m => (
                        <div key={m.id} style={{ fontSize: 11, color: tokens.muted }}>+ {m.name}{m.price_adjustment ? ` (+${sym}${m.price_adjustment.toFixed(2)})` : ''}</div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: ACC }}>{sym}{(item.unit_price * item.qty).toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: stColor, fontWeight: 600 }}>{stLabel}</div>
                    </div>
                  </ListItem>
                )
              })}

              <div style={{ background: tokens.surface, borderRadius: 10, padding: '14px 16px', marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.hint, fontSize: 14, marginBottom: 4 }}>
                  <span>{tc(NS + 'subtotal')}</span><span>{sym}{selected.subtotal?.toFixed(2)}</span>
                </div>
                {(selected.discount_amount || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.success, fontSize: 14, marginBottom: 4 }}>
                    <span>{tc(NS + 'discount')}</span><span>−{sym}{selected.discount_amount?.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: tokens.ink, borderTop: `1px solid ${tokens.border}`, paddingTop: 10, marginTop: 6 }}>
                  <span>{tc(NS + 'total')}</span><span style={{ color: ACC }}>{sym}{selected.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Add Items */}
          {view === 'add_items' && (
            <div style={{ display: 'flex', height: '100%', gap: 16 }}>
              {/* Menu */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{selected ? tc(NS + 'add_to_order_named', { name: selected.table?.name || tc(NS + 'add_to_order_fallback') }) : tc(NS + 'new_order_select_items')}</div>
                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  {menu.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                      style={{ background: activeCat === cat.id ? ACC : tokens.surface, border: 'none', color: activeCat === cat.id ? '#fff' : tokens.hint, padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: activeCat === cat.id ? 700 : 400 }}>
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
                          background: tokens.surface, border: inCart ? `2px solid ${ACC}` : `1px solid ${tokens.border}`,
                          borderRadius: 10, padding: '12px', cursor: item.eighty_sixed ? 'not-allowed' : 'pointer',
                          textAlign: 'left', opacity: item.eighty_sixed ? 0.4 : 1, position: 'relative',
                        }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: tokens.ink }}>{item.name}</div>
                        <div style={{ color: ACC, fontWeight: 700, fontSize: 15 }}>{sym}{item.price?.toFixed(2)}</div>
                        {item.eighty_sixed && <div style={{ color: tokens.danger, fontSize: 11, marginTop: 2 }}>{tc(NS + 'eighty_sixed')}</div>}
                        {inCart > 0 && (
                          <div style={{ position: 'absolute', top: 6, right: 8, background: ACC, color: '#fff', borderRadius: 10, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{inCart}</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Cart */}
              <div style={{ width: 280, background: tokens.surface, borderRadius: 12, padding: 16, height: 'fit-content', position: 'sticky', top: 0 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>{tc(NS + 'order_total', { sym, total: cartTotal.toFixed(2) })}</div>
                {!selected && (
                  <Input
                    label={tc(NS + 'covers_label')}
                    type="number" value={covers} min={1} max={20}
                    onChange={e => setCovers(parseInt(e.target.value) || 1)}
                  />
                )}
                {cart.length === 0 && <div style={{ color: tokens.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>{tc(NS + 'tap_items_to_add')}</div>}
                {cart.map(c => (
                  <div key={c.item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.item.name}</div>
                      <div style={{ fontSize: 11, color: ACC }}>{sym}{(c.item.price * c.qty).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button onClick={() => removeFromCart(c.item.id)} style={{ background: tokens.border, border: 'none', color: tokens.ink, width: 24, height: 24, borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{c.qty}</span>
                      <button onClick={() => addToCart(c.item)} style={{ background: ACC, border: 'none', color: '#fff', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <Button variant="secondary" onClick={() => setView('active')} style={{ flex: 1, padding: '10px' }}>{tc(NS + 'cancel')}</Button>
                  <Button
                    variant="primary"
                    onClick={sendOrder}
                    disabled={!cart.length || saving}
                    loading={saving}
                    loadingLabel={tc(NS + 'sending')}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    {tc(NS + 'send_to_kitchen')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pay */}
          {view === 'pay' && selected && (
            <div className="pos-sheet" style={{ maxWidth: 420, margin: '0 auto' }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>{tc(NS + 'pay_named', { name: selected.table?.name || tc(NS + 'pay_fallback') })}</div>
              <div style={{ background: tokens.surface, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.hint, fontSize: 14, marginBottom: 8 }}>
                  <span>{tc(NS + 'subtotal')}</span><span>{sym}{selected.subtotal?.toFixed(2)}</span>
                </div>
                <Input
                  label={tc(NS + 'discount_label', { sym })}
                  type="number" value={discount} min={0}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  style={{ marginBottom: 0 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 22, borderTop: `1px solid ${tokens.border}`, paddingTop: 12, marginTop: 10 }}>
                  <span>{tc(NS + 'total')}</span>
                  <span style={{ color: ACC }}>{sym}{Math.max(0, (selected.subtotal || 0) - discount).toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{tc(NS + 'payment_method')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {['card', 'cash', 'contactless', 'split', 'voucher', 'mpesa'].map(m => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      style={{ background: payMethod === m ? ACC : tokens.surface, border: payMethod === m ? 'none' : `1px solid ${tokens.border}`, color: payMethod === m ? '#fff' : tokens.hint, padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>
                      {tc(NS + 'pay_' + m)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" onClick={() => setView('active')} style={{ flex: 1, padding: '14px' }}>{tc(NS + 'back')}</Button>
                {/* Deliberately kept native + tokens.success (not Button variant="primary"/ACC) — the
                    charge/confirm action is intentionally green to signal "complete payment", distinct
                    from the app's accent CTA color; Button has no success variant to express that. */}
                <button onClick={payOrder} disabled={paying}
                  style={{ flex: 2, background: tokens.success, border: 'none', color: '#fff', padding: '14px', borderRadius: 10, cursor: paying ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 16, opacity: paying ? 0.5 : 1 }}>
                  {paying ? tc(NS + 'processing') : tc(NS + 'charge', { sym, amount: Math.max(0, (selected.subtotal || 0) - discount).toFixed(2) })}
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
