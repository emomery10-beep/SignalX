'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const STATIONS = ['all', 'grill', 'fryer', 'cold', 'drinks', 'dessert']
const STATION_ICONS: Record<string, string> = { all: '🍽️', grill: '🔥', fryer: '🍟', cold: '🥗', drinks: '🍹', dessert: '🍮' }
const ALLERGENS = ['gluten', 'dairy', 'nuts', 'shellfish', 'soy', 'eggs', 'fish', 'sesame']

interface MenuItem {
  id: string; category_id: string; name: string; description?: string
  price: number; food_cost: number; station: string; prep_time_mins: number
  available: boolean; eighty_sixed: boolean; allergens: string[]; tags: string[]
}
interface MenuCategory { id: string; name: string; icon: string; color: string; sort_order: number; items: MenuItem[] }
interface EightySixEntry { id: string; item_name: string; eighty_sixed_at: string }

export default function MenuPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [ready, setReady]         = useState(false)
  const [sym, setSym]             = useState('£')
  const [menu, setMenu]           = useState<MenuCategory[]>([])
  const [eightySix, setEightySix] = useState<EightySixEntry[]>([])
  const [activeCat, setActiveCat] = useState('')
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState<MenuItem | null>(null)
  const [showAddItem, setShowAdd] = useState(false)
  const [showAddCat, setShowCat]  = useState(false)
  const [saving, setSaving]       = useState(false)
  const [search, setSearch]       = useState('')

  const blankItem = (): Partial<MenuItem> => ({
    category_id: activeCat, name: '', description: '', price: 0, food_cost: 0,
    station: 'all', prep_time_mins: 10, available: true, eighty_sixed: false, allergens: [], tags: [],
  })
  const [newItem, setNewItem] = useState<Partial<MenuItem>>(blankItem())
  const [newCat, setNewCat]   = useState({ name: '', icon: '🍽️', color: ACC })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  useEffect(() => { if (ready) { loadMenu(); load86() } }, [ready])

  async function loadMenu() {
    setLoading(true)
    const res = await fetch(`${API}/api/pos/restaurant/menu`)
    const data = await res.json()
    const cats: MenuCategory[] = data.menu || []
    setMenu(cats)
    if (cats.length && !activeCat) setActiveCat(cats[0]?.id || '')
    setLoading(false)
  }

  async function load86() {
    const res = await fetch(`${API}/api/pos/restaurant/eighty-six`)
    const data = await res.json()
    setEightySix(data.eighty_six || [])
  }

  async function saveItem() {
    if (!newItem.name?.trim() || newItem.price == null) return
    setSaving(true)
    await fetch(`${API}/api/pos/restaurant/menu`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'item', ...newItem }),
    })
    setShowAdd(false)
    setNewItem(blankItem())
    setSaving(false)
    await loadMenu()
  }

  async function updateItem(id: string, fields: Partial<MenuItem>) {
    await fetch(`${API}/api/pos/restaurant/menu`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'item', id, ...fields }),
    })
    await loadMenu()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this menu item?')) return
    await fetch(`${API}/api/pos/restaurant/menu?id=${id}&type=item`, { method: 'DELETE' })
    setEditing(null)
    await loadMenu()
  }

  async function toggle86(item: MenuItem) {
    if (item.eighty_sixed) {
      const entry = eightySix.find(e => e.item_name === item.name)
      if (entry) {
        await fetch(`${API}/api/pos/restaurant/eighty-six?id=${entry.id}`, { method: 'DELETE' })
      } else {
        await updateItem(item.id, { eighty_sixed: false })
      }
    } else {
      await fetch(`${API}/api/pos/restaurant/eighty-six`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_item_id: item.id, item_name: item.name, reason: 'Out of stock' }),
      })
    }
    await loadMenu(); await load86()
  }

  async function saveCat() {
    if (!newCat.name.trim()) return
    setSaving(true)
    await fetch(`${API}/api/pos/restaurant/menu`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'category', ...newCat }),
    })
    setShowCat(false); setNewCat({ name: '', icon: '🍽️', color: ACC })
    setSaving(false)
    await loadMenu()
  }

  const currentCat = menu.find(c => c.id === activeCat)
  const displayItems = (currentCat?.items || []).filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase())
  )

  const margin = (item: MenuItem) => item.price > 0
    ? ((item.price - item.food_cost) / item.price * 100).toFixed(0) : '0'

  const marginColor = (item: MenuItem) => {
    const m = parseFloat(margin(item))
    return m >= 70 ? '#22c55e' : m >= 55 ? '#f59e0b' : '#ef4444'
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
    color: '#f1f5f9', padding: '8px 10px', fontSize: 13, boxSizing: 'border-box',
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>🍽️ Menu Management</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => { setShowAdd(true); setNewItem(blankItem()) }}
            className="pos-btn-primary"
            style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>+ Add Item</button>
          <button onClick={() => setShowCat(true)}
            style={{ background: '#334155', border: 'none', color: '#e2e8f0', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>+ Category</button>
        </div>
      </div>

      {/* 86 Board */}
      {eightySix.length > 0 && (
        <div className="pos-banner" style={{ background: '#7f1d1d', border: 'none', borderBottom: '1px solid #ef4444', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#fca5a5', fontWeight: 700, fontSize: 13 }}>🚫 86 Board:</span>
          <span style={{ color: '#fecaca', fontSize: 13 }}>{eightySix.map(e => e.item_name).join(' · ')}</span>
        </div>
      )}

      <div style={{ display: 'flex', height: 'calc(100vh - 68px)' }}>
        {/* Category Sidebar */}
        <div style={{ width: 200, background: '#1e293b', borderRight: '1px solid #334155', overflow: 'auto', paddingTop: 8 }}>
          {menu.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              style={{
                width: '100%', background: 'none', border: 'none', textAlign: 'left',
                color: activeCat === cat.id ? ACC : '#94a3b8', padding: '12px 16px', cursor: 'pointer',
                fontWeight: activeCat === cat.id ? 700 : 400, fontSize: 14,
                borderLeft: activeCat === cat.id ? `3px solid ${ACC}` : '3px solid transparent',
              }}>
              {cat.icon} {cat.name}
              <span style={{ float: 'right', fontSize: 11, color: '#475569' }}>{cat.items?.length || 0}</span>
            </button>
          ))}
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Search in ${currentCat?.name || 'menu'}...`}
            style={{ ...inp, maxWidth: 360, marginBottom: 16 }} />

          {loading && <div style={{ color: '#64748b' }}>Loading menu...</div>}
          {!loading && displayItems.length === 0 && (
            <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
              No items in this category. <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 14 }}>Add one</button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {displayItems.map((item, idx) => (
              <div key={item.id} className="pos-item" style={{
                background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 16,
                opacity: !item.available || item.eighty_sixed ? 0.6 : 1,
                borderLeft: item.eighty_sixed ? '3px solid #ef4444' : '3px solid transparent',
                animationDelay: `${Math.min(idx, 8) * 40}ms`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.name}
                      {item.eighty_sixed && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, background: '#7f1d1d', padding: '2px 6px', borderRadius: 4 }}>86'D</span>}
                    </div>
                    {item.description && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.description}</div>}
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: 8 }}>
                    <div style={{ fontWeight: 700, color: ACC, fontSize: 16 }}>{sym}{item.price?.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: marginColor(item), fontWeight: 600 }}>{margin(item)}% margin</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, background: '#0f172a', color: '#94a3b8', padding: '2px 8px', borderRadius: 10 }}>
                    {STATION_ICONS[item.station] || '🍽️'} {item.station}
                  </span>
                  <span style={{ fontSize: 11, background: '#0f172a', color: '#94a3b8', padding: '2px 8px', borderRadius: 10 }}>
                    ⏱ {item.prep_time_mins}min
                  </span>
                  <span style={{ fontSize: 11, background: '#0f172a', color: '#94a3b8', padding: '2px 8px', borderRadius: 10 }}>
                    Cost: {sym}{item.food_cost?.toFixed(2)}
                  </span>
                  {item.allergens?.map(a => (
                    <span key={a} style={{ fontSize: 10, background: '#7c2d12', color: '#fca5a5', padding: '2px 6px', borderRadius: 10 }}>{a}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(item)}
                    style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '7px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                    Edit
                  </button>
                  <button onClick={() => toggle86(item)}
                    style={{ flex: 1, background: item.eighty_sixed ? '#14532d' : '#7f1d1d', border: 'none', color: item.eighty_sixed ? '#22c55e' : '#ef4444', padding: '7px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                    {item.eighty_sixed ? '✓ Restore' : '86 Item'}
                  </button>
                  <button onClick={() => updateItem(item.id, { available: !item.available })}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: item.available ? '#22c55e' : '#64748b', padding: '7px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                    {item.available ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div className="pos-sheet" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: 480, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Edit — {editing.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Name</label>
                <input value={editing.name} onChange={e => setEditing(p => p ? { ...p, name: e.target.value } : p)} style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Price ({sym})</label>
                  <input type="number" step="0.01" value={editing.price} onChange={e => setEditing(p => p ? { ...p, price: parseFloat(e.target.value) || 0 } : p)} style={inp} /></div>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Food Cost ({sym})</label>
                  <input type="number" step="0.01" value={editing.food_cost} onChange={e => setEditing(p => p ? { ...p, food_cost: parseFloat(e.target.value) || 0 } : p)} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Station</label>
                  <select value={editing.station} onChange={e => setEditing(p => p ? { ...p, station: e.target.value } : p)} style={inp}>
                    {STATIONS.map(s => <option key={s} value={s}>{STATION_ICONS[s]} {s}</option>)}
                  </select></div>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Prep Time (mins)</label>
                  <input type="number" value={editing.prep_time_mins} onChange={e => setEditing(p => p ? { ...p, prep_time_mins: parseInt(e.target.value) || 10 } : p)} style={inp} /></div>
              </div>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>Allergens</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALLERGENS.map(a => (
                    <button key={a} onClick={() => setEditing(p => p ? { ...p, allergens: p.allergens?.includes(a) ? p.allergens.filter(x => x !== a) : [...(p.allergens || []), a] } : p)}
                      style={{ background: editing.allergens?.includes(a) ? '#7c2d12' : '#0f172a', border: `1px solid ${editing.allergens?.includes(a) ? '#ef4444' : '#334155'}`, color: editing.allergens?.includes(a) ? '#fca5a5' : '#64748b', padding: '4px 10px', borderRadius: 10, cursor: 'pointer', fontSize: 12 }}>
                      {a}
                    </button>
                  ))}
                </div></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => deleteItem(editing.id)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Delete</button>
              <button onClick={() => setEditing(null)} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={async () => { await updateItem(editing.id, editing); setEditing(null) }}
                className="pos-btn-primary"
                style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div className="pos-sheet" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: 440, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Add Menu Item</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Name *</label>
                <input value={newItem.name || ''} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder="Grilled Salmon..." style={inp} /></div>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Description</label>
                <input value={newItem.description || ''} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Price ({sym}) *</label>
                  <input type="number" step="0.01" value={newItem.price || ''} onChange={e => setNewItem(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} style={inp} /></div>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Food Cost ({sym})</label>
                  <input type="number" step="0.01" value={newItem.food_cost || ''} onChange={e => setNewItem(p => ({ ...p, food_cost: parseFloat(e.target.value) || 0 }))} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Station</label>
                  <select value={newItem.station || 'all'} onChange={e => setNewItem(p => ({ ...p, station: e.target.value }))} style={inp}>
                    {STATIONS.map(s => <option key={s} value={s}>{STATION_ICONS[s]} {s}</option>)}
                  </select></div>
                <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Prep Time (mins)</label>
                  <input type="number" value={newItem.prep_time_mins || 10} onChange={e => setNewItem(p => ({ ...p, prep_time_mins: parseInt(e.target.value) || 10 }))} style={inp} /></div>
              </div>
              {newItem.price && newItem.food_cost && (
                <div style={{ background: '#0f172a', borderRadius: 6, padding: '8px 12px', fontSize: 13 }}>
                  Margin: <strong style={{ color: parseFloat(margin(newItem as MenuItem)) >= 65 ? '#22c55e' : '#f59e0b' }}>{margin(newItem as MenuItem)}%</strong>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveItem} disabled={saving || !newItem.name?.trim()}
                className="pos-btn-primary"
                style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: saving || !newItem.name?.trim() ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: saving || !newItem.name?.trim() ? 0.5 : 1 }}>
                {saving ? 'Saving...' : 'Add to Menu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCat && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="pos-sheet" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: 340 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Add Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Name *</label>
                <input value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} placeholder="Starters, Mains, Desserts..." style={inp} /></div>
              <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Icon (emoji)</label>
                <input value={newCat.icon} onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))} style={inp} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowCat(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveCat} disabled={saving || !newCat.name.trim()}
                className="pos-btn-primary"
                style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: saving || !newCat.name.trim() ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: saving || !newCat.name.trim() ? 0.5 : 1 }}>
                {saving ? 'Saving...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
