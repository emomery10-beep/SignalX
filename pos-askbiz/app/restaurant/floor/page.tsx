'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface Table {
  id: string; name: string; section: string; capacity: number
  shape: string; x_pos: number; y_pos: number; width: number; height: number
  status: string; current_order_id?: string; server_id?: string
  seated_at?: string; reservation_name?: string; reservation_at?: string
  server?: { id: string; name: string }
  current_order?: {
    id: string; status: string; covers: number; total: number; created_at: string; seated_at: string
    order_items: { id: string; name: string; qty: number; status: string }[]
  }
}

const TABLE_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: 'Available',  color: '#22c55e', bg: '#14532d' },
  occupied:  { label: 'Occupied',   color: '#f87171', bg: '#7f1d1d' },
  reserved:  { label: 'Reserved',   color: '#a78bfa', bg: '#4c1d95' },
  cleaning:  { label: 'Cleaning',   color: '#fbbf24', bg: '#78350f' },
  closed:    { label: 'Closed',     color: '#475569', bg: '#1e293b' },
}

function elapsed(from?: string): string {
  if (!from) return ''
  const mins = Math.floor((Date.now() - new Date(from).getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function FloorPlan() {
  const router  = useRouter()
  const supabase = createClient()
  const [ready, setReady]           = useState(false)
  const [sym, setSym]               = useState('£')
  const [tables, setTables]         = useState<Table[]>([])
  const [sections, setSections]     = useState<string[]>([])
  const [activeSection, setSection] = useState('All')
  const [selected, setSelected]     = useState<Table | null>(null)
  const [loading, setLoading]       = useState(true)
  const [staff, setStaff]           = useState<{ id: string; name: string }[]>([])
  const [dragging, setDragging]     = useState<string | null>(null)
  const [showAddTable, setShowAdd]  = useState(false)
  const [newTable, setNewTable]     = useState({ name: '', section: 'Main', capacity: 4, shape: 'rectangle' })
  const [saving, setSaving]         = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

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
    loadTables()
    loadStaff()
    const interval = setInterval(loadTables, 15000)
    return () => clearInterval(interval)
  }, [ready])

  async function loadTables() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/restaurant/tables`)
      const data = await res.json()
      const t: Table[] = data.tables || []
      setTables(t)
      const secs = ['All', ...Array.from(new Set(t.map((x: Table) => x.section)))]
      setSections(secs)
    } finally { setLoading(false) }
  }

  async function loadStaff() {
    const res = await fetch(`${API}/api/pos/staff`)
    const data = await res.json()
    setStaff((data.staff || []).filter((s: any) => s.active))
  }

  async function setTableStatus(id: string, status: string) {
    await fetch(`${API}/api/pos/restaurant/tables`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await loadTables()
    setSelected(null)
  }

  async function assignServer(tableId: string, serverId: string) {
    await fetch(`${API}/api/pos/restaurant/tables`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tableId, server_id: serverId || null }),
    })
    await loadTables()
  }

  async function addTable() {
    if (!newTable.name.trim()) return
    setSaving(true)
    await fetch(`${API}/api/pos/restaurant/tables`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTable }),
    })
    setShowAdd(false)
    setNewTable({ name: '', section: 'Main', capacity: 4, shape: 'rectangle' })
    setSaving(false)
    await loadTables()
  }

  async function deleteTable(id: string) {
    if (!confirm('Delete this table? Active orders will not be affected.')) return
    await fetch(`${API}/api/pos/restaurant/tables?id=${id}`, { method: 'DELETE' })
    setSelected(null)
    await loadTables()
  }

  const displayTables = activeSection === 'All' ? tables : tables.filter(t => t.section === activeSection)

  const CELL = 80 // px per grid unit
  const maxX  = Math.max(...tables.map(t => t.x_pos + t.width), 10)
  const maxY  = Math.max(...tables.map(t => t.y_pos + t.height), 8)

  function handleDragStart(e: React.DragEvent, id: string) {
    setDragging(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (!dragging || !gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.floor((e.clientX - rect.left) / CELL))
    const y = Math.max(0, Math.floor((e.clientY - rect.top) / CELL))
    await fetch(`${API}/api/pos/restaurant/tables`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dragging, x_pos: x, y_pos: y }),
    })
    setDragging(null)
    await loadTables()
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
    color: '#f1f5f9', padding: '8px 10px', fontSize: 13, boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>🗺️ Floor Plan</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Drag tables to reposition · Click to manage</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/restaurant/orders?new=1')}
            style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            + New Order
          </button>
          <button onClick={() => setShowAdd(true)}
            style={{ background: '#334155', border: 'none', color: '#e2e8f0', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            + Add Table
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 20px', display: 'flex', gap: 4 }}>
        {sections.map(s => (
          <button key={s} onClick={() => setSection(s)}
            style={{ background: 'none', border: 'none', color: activeSection === s ? ACC : '#64748b', padding: '10px 14px', cursor: 'pointer', fontWeight: activeSection === s ? 700 : 400, borderBottom: activeSection === s ? `2px solid ${ACC}` : '2px solid transparent', fontSize: 13 }}>
            {s}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ padding: '10px 20px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(TABLE_STATUS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: v.color }} />
            <span style={{ color: '#94a3b8' }}>{v.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 160px)' }}>
        {/* Floor Grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <div
            ref={gridRef}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              position: 'relative',
              width: (maxX + 2) * CELL,
              height: (maxY + 2) * CELL,
              background: '#1e293b',
              borderRadius: 12,
              backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
              backgroundSize: `${CELL}px ${CELL}px`,
            }}
          >
            {displayTables.map(table => {
              const st = TABLE_STATUS[table.status] || TABLE_STATUS.available
              const isCircle = table.shape === 'circle'
              const w = table.width * CELL - 8
              const h = table.height * CELL - 8
              return (
                <div
                  key={table.id}
                  draggable
                  onDragStart={e => handleDragStart(e, table.id)}
                  onClick={() => setSelected(selected?.id === table.id ? null : table)}
                  style={{
                    position: 'absolute',
                    left: table.x_pos * CELL + 4,
                    top:  table.y_pos * CELL + 4,
                    width: w, height: h,
                    background: st.bg,
                    border: `2px solid ${selected?.id === table.id ? '#fff' : st.color}`,
                    borderRadius: isCircle ? '50%' : 10,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    userSelect: 'none',
                    transition: 'border-color 0.1s',
                    boxShadow: selected?.id === table.id ? `0 0 0 3px ${st.color}40` : 'none',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: Math.min(14, w / 4), color: st.color, textAlign: 'center', lineHeight: 1.2 }}>{table.name}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{table.capacity}p</div>
                  {table.status === 'occupied' && table.seated_at && (
                    <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700 }}>{elapsed(table.seated_at)}</div>
                  )}
                  {table.server && (
                    <div style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>{table.server.name}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Side Panel */}
        {selected && (
          <div style={{ width: 300, background: '#1e293b', borderLeft: '1px solid #334155', padding: 20, overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>{selected.name}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
              {selected.section} · {selected.capacity} covers · {TABLE_STATUS[selected.status]?.label}
            </div>

            {/* Current Order */}
            {selected.current_order && (
              <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#e2e8f0', marginBottom: 8 }}>
                  Current Order · {selected.current_order.covers} covers
                </div>
                {selected.current_order.order_items?.slice(0, 5).map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', color: '#94a3b8' }}>
                    <span>{item.qty}× {item.name}</span>
                    <span style={{ color: item.status === 'ready' ? '#22c55e' : item.status === 'preparing' ? '#f59e0b' : '#64748b' }}>{item.status}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #334155', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: '#94a3b8' }}>Total</span>
                  <span style={{ color: ACC }}>£{selected.current_order.total?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => router.push(`/restaurant/orders?order=${selected.current_order?.id}`)}
                    style={{ flex: 1, background: '#334155', border: 'none', color: '#e2e8f0', padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                    View Order
                  </button>
                  <button onClick={() => router.push(`/restaurant/orders?pay=${selected.current_order?.id}`)}
                    style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    Pay Bill
                  </button>
                </div>
              </div>
            )}

            {/* Server Assignment */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Assigned Server</label>
              <select
                value={selected.server_id || ''}
                onChange={e => { assignServer(selected.id, e.target.value); setSelected(prev => prev ? { ...prev, server_id: e.target.value } : null) }}
                style={{ ...inp }}
              >
                <option value="">— Unassigned —</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {/* Status Actions */}
            <div style={{ fontWeight: 600, fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Change Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {Object.entries(TABLE_STATUS).filter(([k]) => k !== selected.status).map(([k, v]) => (
                <button key={k} onClick={() => setTableStatus(selected.id, k)}
                  style={{ background: v.bg, border: `1px solid ${v.color}`, color: v.color, padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* New Order for this table */}
            {selected.status !== 'occupied' && (
              <button onClick={() => router.push(`/restaurant/orders?new=1&table=${selected.id}`)}
                style={{ width: '100%', background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, marginBottom: 8 }}>
                + New Order for {selected.name}
              </button>
            )}

            <button onClick={() => deleteTable(selected.id)}
              style={{ width: '100%', background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
              Delete Table
            </button>
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: 340 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Add Table</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Name *</label>
                <input value={newTable.name} onChange={e => setNewTable(p => ({ ...p, name: e.target.value }))}
                  placeholder="Table 1, Bar, Terrace A..." style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Section</label>
                <input value={newTable.section} onChange={e => setNewTable(p => ({ ...p, section: e.target.value }))}
                  placeholder="Main, Outdoor, Bar..." style={inp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Capacity</label>
                  <input type="number" value={newTable.capacity} onChange={e => setNewTable(p => ({ ...p, capacity: parseInt(e.target.value) || 4 }))} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Shape</label>
                  <select value={newTable.shape} onChange={e => setNewTable(p => ({ ...p, shape: e.target.value }))} style={inp}>
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={addTable} disabled={saving || !newTable.name.trim()}
                style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                {saving ? 'Adding...' : 'Add Table'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
