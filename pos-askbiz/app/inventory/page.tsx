'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface StaffSession { id: string; name: string; role: string; owner_id: string }
interface InventoryItem {
  id: string; name: string; sale_price: number; stock_qty: number
  low_stock_threshold: number; last_sold_at: string | null
}

export default function InventoryPage() {
  const router = useRouter()
  const [staff, setStaff]         = useState<StaffSession | null>(null)
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [restocking, setRestocking] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [filter, setFilter]       = useState<'all' | 'low' | 'out'>('all')

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    if (s.role !== 'inventory') { router.push('/sell'); return }
    setStaff(s)
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    const res = await fetch(`${API}/api/pos/inventory`)
    const data = await res.json()
    setItems(data.inventory || [])
    setLoading(false)
  }

  const handleRestock = async (item: InventoryItem) => {
    if (!restockQty || !staff) return
    const qty = parseInt(restockQty)
    if (isNaN(qty) || qty <= 0) return
    await fetch(`${API}/api/pos/inventory`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, restock_qty: qty, staff_id: staff.id }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, stock_qty: i.stock_qty + qty } : i))
    setRestocking(null); setRestockQty('')
  }

  const filtered = items.filter(i => {
    if (filter === 'out') return i.stock_qty === 0
    if (filter === 'low') return i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold
    return true
  })

  const outCount  = items.filter(i => i.stock_qty === 0).length
  const lowCount  = items.filter(i => i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold).length

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6760', fontSize: 14 }}>
      Loading inventory...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1916' }}>Inventory</div>
          <div style={{ fontSize: 12, color: '#6b6760' }}>{staff?.name}</div>
        </div>
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760' }}>
          Sign out
        </button>
      </div>

      {/* Alert summary */}
      {(outCount > 0 || lowCount > 0) && (
        <div style={{ margin: '8px 20px', padding: '12px 16px', borderRadius: 12, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
            {outCount > 0 && `${outCount} out of stock`}
            {outCount > 0 && lowCount > 0 && ' · '}
            {lowCount > 0 && `${lowCount} running low`}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px' }}>
        {([['all', `All (${items.length})`], ['low', `Low (${lowCount})`], ['out', `Out (${outCount})`]] as [typeof filter, string][]).map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: filter === f ? ACC : '#fff', color: filter === f ? '#fff' : '#6b6760', border: filter === f ? 'none' : '1px solid #e5e2dc' } as React.CSSProperties}>
            {label}
          </button>
        ))}
      </div>

      {/* Inventory list */}
      <div style={{ flex: 1, padding: '4px 20px 32px', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6760', fontSize: 14 }}>
            No items in this filter
          </div>
        ) : (
          filtered.map(item => {
            const isOut = item.stock_qty === 0
            const isLow = !isOut && item.stock_qty <= item.low_stock_threshold
            const status = isOut ? { label: 'Out', color: '#dc2626', bg: 'rgba(220,38,38,.08)' }
                         : isLow ? { label: 'Low', color: '#ca8a04', bg: 'rgba(234,179,8,.08)' }
                         :          { label: 'OK',  color: '#16a34a', bg: 'rgba(22,163,74,.08)' }

            return (
              <div key={item.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc', marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#6b6760' }}>£{item.sale_price.toFixed(2)} · {item.stock_qty} in stock</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: status.color, background: status.bg, padding: '3px 9px', borderRadius: 9999 }}>{status.label}</span>
                    <button onClick={() => { setRestocking(restocking === item.id ? null : item.id); setRestockQty('') }}
                      style={{ padding: '7px 12px', borderRadius: 9, background: `rgba(208,138,89,.1)`, border: `1px solid rgba(208,138,89,.2)`, color: ACC, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Restock
                    </button>
                  </div>
                </div>

                {restocking === item.id && (
                  <div style={{ padding: '0 16px 14px', display: 'flex', gap: 10 }}>
                    <input
                      type="number"
                      placeholder="Qty to add"
                      value={restockQty}
                      onChange={e => setRestockQty(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#f9f8f6', color: '#1a1916' }}
                      autoFocus
                    />
                    <button onClick={() => handleRestock(item)} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
