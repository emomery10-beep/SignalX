'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import { tokens, Button, Banner, Input, Select, ListItem } from '@/components/ui'

const NS = 'restaurant_menu.'

const STATIONS = ['all', 'grill', 'fryer', 'cold', 'drinks', 'dessert']
const STATION_ICONS: Record<string, string> = { all: '🍽️', grill: '🔥', fryer: '🍟', cold: '🥗', drinks: '🍹', dessert: '🍮' }
const ALLERGENS = ['gluten', 'dairy', 'nuts', 'shellfish', 'soy', 'eggs', 'fish', 'sesame']

// Stored data default (category.color persisted to the DB), not a style
// role — kept as a literal hex rather than a CSS-var token string.
const DEFAULT_CAT_COLOR = '#d08a59'

interface MenuItem {
  id: string; category_id: string; name: string; description?: string
  price: number; food_cost: number; station: string; prep_time_mins: number
  available: boolean; eighty_sixed: boolean; allergens: string[]; tags: string[]
}
interface MenuCategory { id: string; name: string; icon: string; color: string; sort_order: number; items: MenuItem[] }
interface EightySixEntry { id: string; item_name: string; eighty_sixed_at: string }

export default function MenuPage() {
  const router   = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
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
  const [newCat, setNewCat]   = useState({ name: '', icon: '🍽️', color: DEFAULT_CAT_COLOR })

  useEffect(() => { if (authReady && session) { loadMenu(); load86() } }, [authReady, session])

  async function loadMenu() {
    if (!session) return
    setLoading(true)
    const res = await fetch('/api/pos/restaurant/menu', { headers: session.headers })
    const data = await res.json()
    const cats: MenuCategory[] = data.menu || []
    setMenu(cats)
    if (cats.length && !activeCat) setActiveCat(cats[0]?.id || '')
    setLoading(false)
  }

  async function load86() {
    if (!session) return
    const res = await fetch('/api/pos/restaurant/eighty-six', { headers: session.headers })
    const data = await res.json()
    setEightySix(data.eighty_six || [])
  }

  async function saveItem() {
    if (!newItem.name?.trim() || newItem.price == null || !session) return
    setSaving(true)
    await fetch('/api/pos/restaurant/menu', {
      method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'item', ...newItem }),
    })
    setShowAdd(false)
    setNewItem(blankItem())
    setSaving(false)
    await loadMenu()
  }

  async function updateItem(id: string, fields: Partial<MenuItem>) {
    if (!session) return
    await fetch('/api/pos/restaurant/menu', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'item', id, ...fields }),
    })
    await loadMenu()
  }

  async function deleteItem(id: string) {
    if (!confirm(tc(NS + 'confirm_delete_item')) || !session) return
    await fetch(`/api/pos/restaurant/menu?id=${id}&type=item`, { method: 'DELETE', headers: session.headers })
    setEditing(null)
    await loadMenu()
  }

  async function toggle86(item: MenuItem) {
    if (!session) return
    if (item.eighty_sixed) {
      const entry = eightySix.find(e => e.item_name === item.name)
      if (entry) {
        await fetch(`/api/pos/restaurant/eighty-six?id=${entry.id}`, { method: 'DELETE', headers: session.headers })
      } else {
        await updateItem(item.id, { eighty_sixed: false })
      }
    } else {
      await fetch('/api/pos/restaurant/eighty-six', {
        method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_item_id: item.id, item_name: item.name, reason: tc(NS + 'out_of_stock') }),
      })
    }
    await loadMenu(); await load86()
  }

  async function saveCat() {
    if (!newCat.name.trim() || !session) return
    setSaving(true)
    await fetch('/api/pos/restaurant/menu', {
      method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'category', ...newCat }),
    })
    setShowCat(false); setNewCat({ name: '', icon: '🍽️', color: DEFAULT_CAT_COLOR })
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
    return m >= 70 ? tokens.success : m >= 55 ? tokens.warning : tokens.danger
  }

  const inp: React.CSSProperties = {
    width: '100%', background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 6,
    color: tokens.ink, padding: '8px 10px', fontSize: 13, boxSizing: 'border-box',
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 16, color: tokens.accent }}>{tc(NS + 'header_title')}</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={() => { setShowAdd(true); setNewItem(blankItem()) }} style={{ fontSize: 13 }}>
            {tc(NS + 'add_item')}
          </Button>
          <Button variant="secondary" onClick={() => setShowCat(true)} style={{ fontSize: 13 }}>
            {tc(NS + 'add_category')}
          </Button>
        </div>
      </div>

      {/* 86 Board */}
      {eightySix.length > 0 && (
        <Banner tone="danger">
          <strong>{tc(NS + 'eighty_six_board')}</strong> {eightySix.map(e => e.item_name).join(' · ')}
        </Banner>
      )}

      <div style={{ display: 'flex', height: 'calc(100vh - 68px)' }}>
        {/* Category Sidebar */}
        <div style={{ width: 200, background: tokens.surface, borderRight: `1px solid ${tokens.border}`, overflow: 'auto', paddingTop: 8 }}>
          {menu.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              style={{
                width: '100%', background: 'none', border: 'none', textAlign: 'left',
                color: activeCat === cat.id ? tokens.accent : tokens.hint, padding: '12px 16px', cursor: 'pointer',
                fontWeight: activeCat === cat.id ? 700 : 400, fontSize: 14,
                borderLeft: activeCat === cat.id ? `3px solid ${tokens.accent}` : '3px solid transparent',
              }}>
              {cat.icon} {cat.name}
              <span style={{ float: 'right', fontSize: 11, color: tokens.muted }}>{cat.items?.length || 0}</span>
            </button>
          ))}
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tc(NS + 'search_placeholder', { category: currentCat?.name || tc(NS + 'menu_fallback') })}
            style={{ ...inp, maxWidth: 360, marginBottom: 16 }} />

          {loading && <div style={{ color: tokens.muted }}>{tc(NS + 'loading_menu')}</div>}
          {!loading && displayItems.length === 0 && (
            <div style={{ color: tokens.muted, textAlign: 'center', padding: 40 }}>
              {tc(NS + 'no_items_in_category')} <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 'none', color: tokens.accent, cursor: 'pointer', fontSize: 14 }}>{tc(NS + 'add_one')}</button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {displayItems.map((item, idx) => (
              <ListItem key={item.id} index={idx} style={{
                background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: 16,
                opacity: !item.available || item.eighty_sixed ? 0.6 : 1,
                borderLeft: item.eighty_sixed ? `3px solid ${tokens.danger}` : '3px solid transparent',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.name}
                      {item.eighty_sixed && <span style={{ fontSize: 10, color: tokens.danger, fontWeight: 700, background: tokens.dangerPale, padding: '2px 6px', borderRadius: 4 }}>{tc(NS + 'eighty_sixd_badge')}</span>}
                    </div>
                    {item.description && <div style={{ fontSize: 12, color: tokens.muted, marginTop: 2 }}>{item.description}</div>}
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: 8 }}>
                    <div style={{ fontWeight: 700, color: tokens.accent, fontSize: 16 }}>{sym}{item.price?.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: marginColor(item), fontWeight: 600 }}>{tc(NS + 'margin_suffix', { margin: margin(item) })}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, background: tokens.bg, color: tokens.hint, padding: '2px 8px', borderRadius: 10 }}>
                    {STATIONS.includes(item.station) ? tc(NS + 'station_' + item.station) : ((STATION_ICONS[item.station] || '🍽️') + ' ' + item.station)}
                  </span>
                  <span style={{ fontSize: 11, background: tokens.bg, color: tokens.hint, padding: '2px 8px', borderRadius: 10 }}>
                    {tc(NS + 'prep_time_min', { mins: item.prep_time_mins })}
                  </span>
                  <span style={{ fontSize: 11, background: tokens.bg, color: tokens.hint, padding: '2px 8px', borderRadius: 10 }}>
                    {tc(NS + 'cost_label', { sym, cost: item.food_cost?.toFixed(2) })}
                  </span>
                  {item.allergens?.map(a => (
                    <span key={a} style={{ fontSize: 10, background: 'rgba(249,115,22,.08)', color: tokens.warning, padding: '2px 6px', borderRadius: 10 }}>{a}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(item)}
                    style={{ flex: 1, background: tokens.border, border: 'none', color: tokens.hint, padding: '7px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                    {tc(NS + 'edit')}
                  </button>
                  <button onClick={() => toggle86(item)}
                    style={{ flex: 1, background: item.eighty_sixed ? tokens.successPale : tokens.dangerPale, border: 'none', color: item.eighty_sixed ? tokens.success : tokens.danger, padding: '7px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                    {item.eighty_sixed ? tc(NS + 'restore') : tc(NS + 'eighty_six_item')}
                  </button>
                  <button onClick={() => updateItem(item.id, { available: !item.available })}
                    style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, color: item.available ? tokens.success : tokens.muted, padding: '7px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                    {item.available ? tc(NS + 'on') : tc(NS + 'off')}
                  </button>
                </div>
              </ListItem>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: 480, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{tc(NS + 'edit_heading', { name: editing.name })}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label={tc(NS + 'label_name')} value={editing.name} onChange={e => setEditing(p => p ? { ...p, name: e.target.value } : p)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label={tc(NS + 'label_price', { sym })} type="number" step="0.01" value={editing.price} onChange={e => setEditing(p => p ? { ...p, price: parseFloat(e.target.value) || 0 } : p)} />
                <Input label={tc(NS + 'label_food_cost', { sym })} type="number" step="0.01" value={editing.food_cost} onChange={e => setEditing(p => p ? { ...p, food_cost: parseFloat(e.target.value) || 0 } : p)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Select label={tc(NS + 'label_station')} value={editing.station} onChange={e => setEditing(p => p ? { ...p, station: e.target.value } : p)}>
                  {STATIONS.map(s => <option key={s} value={s}>{tc(NS + 'station_' + s)}</option>)}
                </Select>
                <Input label={tc(NS + 'label_prep_time')} type="number" value={editing.prep_time_mins} onChange={e => setEditing(p => p ? { ...p, prep_time_mins: parseInt(e.target.value) || 10 } : p)} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: tokens.muted, display: 'block', marginBottom: 6 }}>{tc(NS + 'label_allergens')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALLERGENS.map(a => (
                    <button key={a} onClick={() => setEditing(p => p ? { ...p, allergens: p.allergens?.includes(a) ? p.allergens.filter(x => x !== a) : [...(p.allergens || []), a] } : p)}
                      style={{ background: editing.allergens?.includes(a) ? tokens.dangerPale : tokens.bg, border: `1px solid ${editing.allergens?.includes(a) ? tokens.danger : tokens.border}`, color: editing.allergens?.includes(a) ? tokens.danger : tokens.muted, padding: '4px 10px', borderRadius: 10, cursor: 'pointer', fontSize: 12 }}>
                      {a}
                    </button>
                  ))}
                </div></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="danger" onClick={() => deleteItem(editing.id)} style={{ fontSize: 13 }}>{tc(NS + 'delete')}</Button>
              <Button variant="secondary" onClick={() => setEditing(null)} style={{ flex: 1 }}>{tc(NS + 'cancel')}</Button>
              <Button variant="primary" onClick={async () => { await updateItem(editing.id, editing); setEditing(null) }} style={{ flex: 1 }}>
                {tc(NS + 'save_changes')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: 440, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{tc(NS + 'add_item_heading')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label={tc(NS + 'label_name_required')} value={newItem.name || ''} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder={tc(NS + 'placeholder_item_name')} />
              <Input label={tc(NS + 'label_description')} value={newItem.description || ''} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} placeholder={tc(NS + 'placeholder_description')} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label={tc(NS + 'label_price_required', { sym })} type="number" step="0.01" value={newItem.price || ''} onChange={e => setNewItem(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
                <Input label={tc(NS + 'label_food_cost', { sym })} type="number" step="0.01" value={newItem.food_cost || ''} onChange={e => setNewItem(p => ({ ...p, food_cost: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Select label={tc(NS + 'label_station')} value={newItem.station || 'all'} onChange={e => setNewItem(p => ({ ...p, station: e.target.value }))}>
                  {STATIONS.map(s => <option key={s} value={s}>{tc(NS + 'station_' + s)}</option>)}
                </Select>
                <Input label={tc(NS + 'label_prep_time')} type="number" value={newItem.prep_time_mins || 10} onChange={e => setNewItem(p => ({ ...p, prep_time_mins: parseInt(e.target.value) || 10 }))} />
              </div>
              {newItem.price && newItem.food_cost && (
                <div style={{ background: tokens.bg, borderRadius: 6, padding: '8px 12px', fontSize: 13 }}>
                  {tc(NS + 'margin_preview')} <strong style={{ color: parseFloat(margin(newItem as MenuItem)) >= 65 ? tokens.success : tokens.warning }}>{margin(newItem as MenuItem)}%</strong>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="secondary" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>{tc(NS + 'cancel')}</Button>
              <Button variant="primary" onClick={saveItem} disabled={saving || !newItem.name?.trim()} style={{ flex: 1 }}>
                {saving ? tc(NS + 'saving') : tc(NS + 'add_to_menu')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCat && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: 340 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{tc(NS + 'add_category_heading')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label={tc(NS + 'label_name_required')} value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} placeholder={tc(NS + 'placeholder_category_name')} />
              <Input label={tc(NS + 'label_icon')} value={newCat.icon} onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="secondary" onClick={() => setShowCat(false)} style={{ flex: 1 }}>{tc(NS + 'cancel')}</Button>
              <Button variant="primary" onClick={saveCat} disabled={saving || !newCat.name.trim()} style={{ flex: 1 }}>
                {saving ? tc(NS + 'saving') : tc(NS + 'add_category_btn')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
