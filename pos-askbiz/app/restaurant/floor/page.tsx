'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import { tokens, Button, Banner, Input, Select } from '@/components/ui'

const ACC = tokens.accent

const NS = 'restaurant_floor.'

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

const TABLE_STATUS: Record<string, { color: string; bg: string }> = {
  available: { color: tokens.success, bg: tokens.successPale },
  occupied:  { color: tokens.danger, bg: tokens.dangerPale },
  reserved:  { color: tokens.accent, bg: tokens.accentPale },
  cleaning:  { color: tokens.warning, bg: 'rgba(249,115,22,.08)' },
  closed:    { color: tokens.muted, bg: tokens.border },
}

function elapsed(from?: string): string {
  if (!from) return ''
  const mins = Math.floor((Date.now() - new Date(from).getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function FloorPlan() {
  const router  = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
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
  const [addError, setAddError]     = useState<string | null>(null)
  const [loadError, setLoadError]   = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (!authReady || !session) return
    loadTables()
    loadStaff()
    const interval = setInterval(loadTables, 15000)
    return () => clearInterval(interval)
  }, [authReady, session])

  async function loadTables() {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/restaurant/tables', { headers: session.headers })
      const data = await res.json()
      if (!res.ok) {
        setLoadError(data.error || tc(NS + 'load_error_generic'))
        setTables([])
        return
      }
      setLoadError(null)
      const t: Table[] = data.tables || []
      setTables(t)
      const secs = ['All', ...Array.from(new Set(t.map((x: Table) => x.section)))]
      setSections(secs)
    } catch {
      setLoadError(tc(NS + 'load_error_generic'))
      setTables([])
    } finally { setLoading(false) }
  }

  async function loadStaff() {
    if (!session) return
    const res = await fetch('/api/pos/staff', { headers: session.headers })
    const data = await res.json()
    setStaff((data.staff || []).filter((s: any) => s.active))
  }

  async function setTableStatus(id: string, status: string) {
    if (!session) return
    await fetch('/api/pos/restaurant/tables', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await loadTables()
    setSelected(null)
  }

  async function assignServer(tableId: string, serverId: string) {
    if (!session) return
    await fetch('/api/pos/restaurant/tables', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tableId, server_id: serverId || null }),
    })
    await loadTables()
  }

  async function addTable() {
    if (!newTable.name.trim() || !session) return
    setSaving(true)
    setAddError(null)
    try {
      const res = await fetch('/api/pos/restaurant/tables', {
        method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTable }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAddError(data.error || tc(NS + 'add_error_generic'))
        return
      }
      setShowAdd(false)
      setNewTable({ name: '', section: 'Main', capacity: 4, shape: 'rectangle' })
      await loadTables()
    } catch {
      setAddError(tc(NS + 'add_error_generic'))
    } finally {
      setSaving(false)
    }
  }

  async function deleteTable(id: string) {
    if (!confirm(tc(NS + 'confirm_delete_table')) || !session) return
    await fetch(`/api/pos/restaurant/tables?id=${id}`, { method: 'DELETE', headers: session.headers })
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
    if (!dragging || !gridRef.current || !session) return
    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.floor((e.clientX - rect.left) / CELL))
    const y = Math.max(0, Math.floor((e.clientY - rect.top) / CELL))
    await fetch('/api/pos/restaurant/tables', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dragging, x_pos: x, y_pos: y }),
    })
    setDragging(null)
    await loadTables()
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>{tc(NS + 'header_title')}</div>
          <div style={{ fontSize: 11, color: tokens.muted }}>{tc(NS + 'header_subtitle')}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={() => router.push('/restaurant/orders?new=1')}>
            {tc(NS + 'new_order')}
          </Button>
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            {tc(NS + 'add_table')}
          </Button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '0 20px', display: 'flex', gap: 4 }}>
        {sections.map(s => (
          <button key={s} onClick={() => setSection(s)}
            style={{ background: 'none', border: 'none', color: activeSection === s ? ACC : tokens.muted, padding: '10px 14px', cursor: 'pointer', fontWeight: activeSection === s ? 700 : 400, borderBottom: activeSection === s ? `2px solid ${ACC}` : '2px solid transparent', fontSize: 13 }}>
            {s === 'All' ? tc(NS + 'all_sections') : s}
          </button>
        ))}
      </div>

      {/* Load error banner */}
      {loadError && (
        <div style={{ margin: '12px 20px 0' }}>
          <Banner tone="danger">{loadError}</Banner>
        </div>
      )}

      {/* Legend */}
      <div style={{ padding: '10px 20px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(TABLE_STATUS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: v.color }} />
            <span style={{ color: tokens.hint }}>{tc(NS + 'status_' + k)}</span>
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
              background: tokens.surface,
              borderRadius: 12,
              backgroundImage: `radial-gradient(circle, ${tokens.border} 1px, transparent 1px)`,
              backgroundSize: `${CELL}px ${CELL}px`,
            }}
          >
            {displayTables.map((table, idx) => {
              const st = TABLE_STATUS[table.status] || TABLE_STATUS.available
              const isCircle = table.shape === 'circle'
              const w = table.width * CELL - 8
              const h = table.height * CELL - 8
              return (
                <div
                  key={table.id}
                  className="pos-item"
                  draggable
                  onDragStart={e => handleDragStart(e, table.id)}
                  onClick={() => setSelected(selected?.id === table.id ? null : table)}
                  style={{
                    animationDelay: `${Math.min(idx, 8) * 40}ms`,
                    position: 'absolute',
                    left: table.x_pos * CELL + 4,
                    top:  table.y_pos * CELL + 4,
                    width: w, height: h,
                    background: st.bg,
                    border: `2px solid ${selected?.id === table.id ? tokens.ink : st.color}`,
                    borderRadius: isCircle ? '50%' : 10,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    userSelect: 'none',
                    transition: 'border-color 0.1s',
                    boxShadow: selected?.id === table.id ? `0 0 0 3px ${st.color}` : 'none',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: Math.min(14, w / 4), color: st.color, textAlign: 'center', lineHeight: 1.2 }}>{table.name}</div>
                  <div style={{ fontSize: 10, color: tokens.hint, marginTop: 2 }}>{tc(NS + 'person_suffix', { count: table.capacity })}</div>
                  {table.status === 'occupied' && table.seated_at && (
                    <div style={{ fontSize: 10, color: tokens.danger, fontWeight: 700 }}>{elapsed(table.seated_at)}</div>
                  )}
                  {table.server && (
                    <div style={{ fontSize: 9, color: tokens.muted, marginTop: 1 }}>{table.server.name}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Side Panel */}
        {selected && (
          <div style={{ width: 300, background: tokens.surface, borderLeft: `1px solid ${tokens.border}`, padding: 20, overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>{selected.name}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 12 }}>
              {tc(NS + 'table_summary', { section: selected.section, capacity: selected.capacity, status: tc(NS + 'status_' + selected.status) })}
            </div>

            {/* Current Order */}
            {selected.current_order && (
              <div className="pos-reveal" style={{ background: tokens.bg, borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: tokens.ink, marginBottom: 8 }}>
                  {tc(NS + 'current_order_covers', { covers: selected.current_order.covers })}
                </div>
                {selected.current_order.order_items?.slice(0, 5).map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', color: tokens.hint }}>
                    <span>{item.qty}× {item.name}</span>
                    <span style={{ color: item.status === 'ready' ? tokens.success : item.status === 'preparing' ? tokens.warning : tokens.muted }}>{item.status}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${tokens.border}`, marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: tokens.hint }}>{tc(NS + 'total')}</span>
                  <span style={{ color: ACC }}>£{selected.current_order.total?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button variant="secondary" onClick={() => router.push(`/restaurant/orders?order=${selected.current_order?.id}`)} style={{ flex: 1, padding: '8px', fontSize: 12 }}>
                    {tc(NS + 'view_order')}
                  </Button>
                  <Button variant="primary" onClick={() => router.push(`/restaurant/orders?pay=${selected.current_order?.id}`)} style={{ flex: 1, padding: '8px', fontSize: 12 }}>
                    {tc(NS + 'pay_bill')}
                  </Button>
                </div>
              </div>
            )}

            {/* Server Assignment */}
            <div style={{ marginBottom: 12 }}>
              <Select
                label={tc(NS + 'assigned_server')}
                value={selected.server_id || ''}
                onChange={e => { assignServer(selected.id, e.target.value); setSelected(prev => prev ? { ...prev, server_id: e.target.value } : null) }}
              >
                <option value="">{tc(NS + 'unassigned')}</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>

            {/* Status Actions */}
            <div style={{ fontWeight: 600, fontSize: 12, color: tokens.hint, marginBottom: 8 }}>{tc(NS + 'change_status')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {Object.entries(TABLE_STATUS).filter(([k]) => k !== selected.status).map(([k, v]) => (
                <button key={k} onClick={() => setTableStatus(selected.id, k)}
                  style={{ background: v.bg, border: `1px solid ${v.color}`, color: v.color, padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {tc(NS + 'status_' + k)}
                </button>
              ))}
            </div>

            {/* New Order for this table */}
            {selected.status !== 'occupied' && (
              <Button variant="primary" onClick={() => router.push(`/restaurant/orders?new=1&table=${selected.id}`)} style={{ width: '100%', marginBottom: 8 }}>
                {tc(NS + 'new_order_for', { name: selected.name })}
              </Button>
            )}

            <Button variant="danger" onClick={() => deleteTable(selected.id)} style={{ width: '100%', fontSize: 12 }}>
              {tc(NS + 'delete_table')}
            </Button>
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: 340 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{tc(NS + 'modal_add_table')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label={tc(NS + 'label_name')} value={newTable.name} onChange={e => setNewTable(p => ({ ...p, name: e.target.value }))}
                placeholder={tc(NS + 'placeholder_name')} style={{ marginBottom: 0 }} />
              <Input label={tc(NS + 'label_section')} value={newTable.section} onChange={e => setNewTable(p => ({ ...p, section: e.target.value }))}
                placeholder={tc(NS + 'placeholder_section')} style={{ marginBottom: 0 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Input label={tc(NS + 'label_capacity')} type="number" value={newTable.capacity} onChange={e => setNewTable(p => ({ ...p, capacity: parseInt(e.target.value) || 4 }))} style={{ marginBottom: 0 }} />
                <Select label={tc(NS + 'label_shape')} value={newTable.shape} onChange={e => setNewTable(p => ({ ...p, shape: e.target.value }))}>
                  <option value="rectangle">{tc(NS + 'shape_rectangle')}</option>
                  <option value="circle">{tc(NS + 'shape_circle')}</option>
                  <option value="square">{tc(NS + 'shape_square')}</option>
                </Select>
              </div>
            </div>
            {addError && (
              <div style={{ marginTop: 12 }}>
                <Banner tone="danger">{addError}</Banner>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="secondary" onClick={() => { setShowAdd(false); setAddError(null) }} style={{ flex: 1, padding: '10px' }}>{tc(NS + 'cancel')}</Button>
              <Button
                variant="primary"
                onClick={addTable}
                disabled={saving || !newTable.name.trim()}
                loading={saving}
                loadingLabel={tc(NS + 'adding')}
                style={{ flex: 1, padding: '10px' }}
              >
                {tc(NS + 'modal_add_table')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
