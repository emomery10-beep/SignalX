'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'
import type { PurchaseOrderStatus, PurchaseOrderWithItems, Supplier } from '@/lib/purchase-order-types'

// Palette matches the existing POS surfaces (ACC/AMBER/GREEN used elsewhere).
const ACC = '#d08a59'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const BLUE = '#3b82f6'

// NOTE (i18n — Phase 4): user-facing strings are English literals for now.
// Phase 4 swaps these for tc('pos_app.po_*') keys + Swahili translations.

interface InventoryLite {
  id: string
  name: string
  stock_qty: number
  low_stock_threshold: number
  cost_price: number
  unit: string
  supplier?: string | null
}

interface DraftItem {
  inventory_id: string | null
  name: string
  qty_ordered: number
  unit_cost: number
}

interface Props {
  currencySymbol: string
  selectedLocation: string
  notify: (msg: string, ok?: boolean) => void
}

const STATUS_META: Record<PurchaseOrderStatus, { bg: string; text: string; label: string }> = {
  draft:     { bg: 'rgba(148,163,184,.14)', text: '#64748b', label: 'Draft' },
  ordered:   { bg: 'rgba(59,130,246,.12)',  text: BLUE,      label: 'Ordered' },
  partial:   { bg: 'rgba(202,138,4,.12)',   text: AMBER,     label: 'Partially received' },
  received:  { bg: 'rgba(22,163,74,.12)',   text: GREEN,     label: 'Received' },
  cancelled: { bg: 'rgba(220,38,38,.10)',   text: RED,       label: 'Cancelled' },
}

export default function PurchaseOrdersTab({ currencySymbol, selectedLocation, notify }: Props) {
  const fmt = (n: number) => `${currencySymbol}${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

  const [orders, setOrders] = useState<PurchaseOrderWithItems[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [inventory, setInventory] = useState<InventoryLite[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [detailPo, setDetailPo] = useState<PurchaseOrderWithItems | null>(null)

  // Replace a PO in the list (and the open detail sheet) after send/receive.
  const upsertOrder = useCallback((po: PurchaseOrderWithItems) => {
    setOrders((prev) => prev.map((o) => (o.id === po.id ? po : o)))
    setDetailPo((prev) => (prev && prev.id === po.id ? po : prev))
  }, [])

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/pos/purchase-orders')
      if (!res.ok) throw new Error(String(res.status))
      const json = await res.json()
      setOrders(json.purchase_orders || [])
    } catch {
      notify('Could not load purchase orders', false)
    } finally {
      setLoading(false)
    }
  }, [notify])

  const loadPickers = useCallback(async () => {
    try {
      const locParam = selectedLocation !== 'all' ? `?location_id=${selectedLocation}` : ''
      const [supRes, invRes] = await Promise.all([
        fetch('/api/pos/suppliers'),
        fetch(`/api/pos/inventory${locParam}`),
      ])
      if (supRes.ok) setSuppliers((await supRes.json()).suppliers || [])
      if (invRes.ok) setInventory((await invRes.json()).inventory || [])
    } catch {
      /* pickers are best-effort; create modal still opens */
    }
  }, [selectedLocation])

  useEffect(() => { loadOrders(); loadPickers() }, [loadOrders, loadPickers])

  const lowStock = inventory.filter((i) => (i.stock_qty ?? 0) <= (i.low_stock_threshold ?? 0))

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          {/* i18n — Phase 4 */}
          <div style={{ fontSize: 16, fontWeight: 700 }}>📋 Purchase orders</div>
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Order stock from suppliers and track deliveries</div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40,
            background: ACC, color: '#fff', border: 'none', borderRadius: 9,
            padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'opacity .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <span style={{ fontSize: 16 }}>＋</span> New order
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>Loading…</div>
      ) : orders.length === 0 ? (
        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No purchase orders yet</div>
          <div style={{ fontSize: 13, color: 'var(--tx3)', maxWidth: 380, margin: '0 auto 16px' }}>
            Build an order from your low-stock items, send it to a supplier, then receive stock when it arrives.
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{ minHeight: 40, background: ACC, color: '#fff', border: 'none', borderRadius: 9, padding: '0 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Create your first order
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.map((po) => {
            const meta = STATUS_META[po.status] ?? STATUS_META.draft
            const itemCount = po.items?.length ?? 0
            return (
              <div
                key={po.id}
                onClick={() => setDetailPo(po)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDetailPo(po) } }}
                style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'border-color .15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACC)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--b)')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>
                        {po.supplier?.name || 'No supplier'}
                      </span>
                      <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: meta.text, background: meta.bg, padding: '3px 9px', borderRadius: 9999 }}>
                        {meta.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} · {new Date(po.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(po.total_cost)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <CreateOrderModal
          suppliers={suppliers}
          lowStock={lowStock}
          allInventory={inventory}
          currencySymbol={currencySymbol}
          onClose={() => setShowCreate(false)}
          onCreated={(po) => {
            setOrders((prev) => [po, ...prev])
            setShowCreate(false)
            notify('Purchase order created', true)
          }}
          onSupplierAdded={(s) => setSuppliers((prev) => [...prev, s].sort((a, b) => a.name.localeCompare(b.name)))}
          notify={notify}
        />
      )}

      {detailPo && (
        <PODetailModal
          po={detailPo}
          currencySymbol={currencySymbol}
          onClose={() => setDetailPo(null)}
          onUpdated={upsertOrder}
          notify={notify}
        />
      )}
    </div>
  )
}

// ── Detail sheet (view + Send to supplier) ───────────────────
function PODetailModal({ po, currencySymbol, onClose, onUpdated, notify }: {
  po: PurchaseOrderWithItems
  currencySymbol: string
  onClose: () => void
  onUpdated: (po: PurchaseOrderWithItems) => void
  notify: (msg: string, ok?: boolean) => void
}) {
  const [sending, setSending] = useState(false)
  const [receiveMode, setReceiveMode] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [receiveQtys, setReceiveQtys] = useState<Record<string, string>>({})
  const fmt = (n: number) => `${currencySymbol}${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  const meta = STATUS_META[po.status] ?? STATUS_META.draft
  const supplierPhone = po.supplier?.phone
  const canSend = po.status !== 'received' && po.status !== 'cancelled'
  const canReceive = po.status !== 'received' && po.status !== 'cancelled'
  const receiveInput: CSSProperties = {
    width: '100%', minHeight: 40, background: 'var(--ev)', border: '1px solid var(--b)',
    borderRadius: 8, padding: '0 8px', fontSize: 13, color: 'var(--tx)', fontFamily: 'inherit', textAlign: 'center',
  }

  function startReceive() {
    const init: Record<string, string> = {}
    for (const it of po.items || []) {
      const outstanding = Math.max(0, Number(it.qty_ordered) - Number(it.qty_received))
      if (outstanding > 0) init[it.id] = String(outstanding)
    }
    setReceiveQtys(init)
    setReceiveMode(true)
  }

  async function handleReceive() {
    const receipts = (po.items || [])
      .map((it) => ({ item_id: it.id, qty: parseFloat(receiveQtys[it.id] || '0') || 0 }))
      .filter((r) => r.qty > 0)
    if (receipts.length === 0) { notify('Enter what arrived', false); return }
    setReceiving(true)
    try {
      const res = await fetch(`/api/pos/purchase-orders/${po.id}/receive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts, client_tx_id: `recv-${crypto.randomUUID()}` }),
      })
      if (!res.ok) { notify('Could not receive stock', false); setReceiving(false); return }
      const data = await res.json()
      onUpdated(data.purchase_order)
      setReceiveMode(false)
      notify('Stock received — inventory updated', true)
    } catch {
      notify('Could not receive stock', false)
    } finally {
      setReceiving(false)
    }
  }

  async function handleSend() {
    setSending(true)
    // Pre-open a tab synchronously inside the click gesture — opening it after
    // the await would lose the user-gesture context and get popup-blocked, which
    // is the common path until the Meta template is approved (link fallback).
    const pending = window.open('', '_blank')
    try {
      const res = await fetch(`/api/pos/purchase-orders/${po.id}/send`, { method: 'POST' })
      if (!res.ok) {
        pending?.close()
        const j = await res.json().catch(() => ({}))
        notify(j.error === 'supplier_no_phone' ? 'Add a WhatsApp number to this supplier first' : 'Could not send order', false)
        setSending(false)
        return
      }
      const data = await res.json()
      onUpdated(data.purchase_order)
      if (data.sent_via === 'link' && data.wa_link) {
        if (pending) pending.location.href = data.wa_link
        else window.open(data.wa_link, '_blank')
        notify('Opening WhatsApp…', true)
      } else {
        pending?.close()
        notify('Sent to supplier on WhatsApp', true)
      }
    } catch {
      pending?.close()
      notify('Could not send order', false)
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 20, boxShadow: '0 -8px 30px rgba(0,0,0,.25)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{po.supplier?.name || 'No supplier'}</div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 22, lineHeight: 1, color: 'var(--tx3)', cursor: 'pointer' }}>×</button>
        </div>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: meta.text, background: meta.bg, padding: '3px 9px', borderRadius: 9999, marginBottom: 14 }}>{meta.label}</span>

        <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 84px', padding: '8px 12px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' }}>
            <span>Item</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Total</span>
          </div>
          {(po.items || []).map((it) => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 84px', padding: '8px 12px', fontSize: 13, borderTop: '1px solid var(--b)' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={it.name}>{it.name}</span>
              <span style={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{it.qty_ordered}</span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(it.line_total)}</span>
            </div>
          ))}
        </div>

        {po.notes && <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 14 }}>{po.notes}</div>}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(po.total_cost)}</span>
        </div>

        {canReceive && !receiveMode && (
          <button
            onClick={startReceive}
            style={{ width: '100%', minHeight: 44, background: BLUE, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}
          >
            Receive stock
          </button>
        )}

        {receiveMode && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 8 }}>How much arrived?</div>
            {(po.items || []).map((it) => {
              const outstanding = Math.max(0, Number(it.qty_ordered) - Number(it.qty_received))
              return (
                <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={it.name}>{it.name}</div>
                    <div style={{ fontSize: 11, color: outstanding <= 0 ? GREEN : 'var(--tx3)' }}>
                      {outstanding <= 0 ? 'fully received' : Number(it.qty_received) > 0 ? `received ${it.qty_received} of ${it.qty_ordered}` : `ordered ${it.qty_ordered}`}
                    </div>
                  </div>
                  <input
                    type="number" min={0} inputMode="decimal" disabled={outstanding <= 0}
                    value={receiveQtys[it.id] ?? ''}
                    onChange={(e) => setReceiveQtys((p) => ({ ...p, [it.id]: e.target.value }))}
                    aria-label={`Received now for ${it.name}`}
                    style={{ ...receiveInput, opacity: outstanding <= 0 ? 0.5 : 1 }}
                  />
                </div>
              )
            })}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => setReceiveMode(false)} style={{ minHeight: 44, padding: '0 16px', background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 10, color: 'var(--tx)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleReceive} disabled={receiving} style={{ flex: 1, minHeight: 44, background: receiving ? 'var(--ev)' : GREEN, color: receiving ? 'var(--tx3)' : '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: receiving ? 'default' : 'pointer', fontFamily: 'inherit' }}>{receiving ? 'Saving…' : 'Confirm receipt'}</button>
            </div>
          </div>
        )}

        {canSend && !receiveMode && (
          <>
            <button
              onClick={handleSend}
              disabled={sending || !supplierPhone}
              style={{ width: '100%', minHeight: 44, background: sending || !supplierPhone ? 'var(--ev)' : '#25D366', color: sending || !supplierPhone ? 'var(--tx3)' : '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: sending || !supplierPhone ? 'default' : 'pointer', fontFamily: 'inherit' }}
            >
              {sending ? 'Sending…' : po.status === 'draft' ? 'Send to supplier on WhatsApp' : 'Resend on WhatsApp'}
            </button>
            {!supplierPhone && (
              <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center', marginTop: 8 }}>
                This supplier has no WhatsApp number yet.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Create modal ─────────────────────────────────────────────
interface ModalProps {
  suppliers: Supplier[]
  lowStock: InventoryLite[]
  allInventory: InventoryLite[]
  currencySymbol: string
  onClose: () => void
  onCreated: (po: PurchaseOrderWithItems) => void
  onSupplierAdded: (s: Supplier) => void
  notify: (msg: string, ok?: boolean) => void
}

function CreateOrderModal({ suppliers, lowStock, allInventory, currencySymbol, onClose, onCreated, onSupplierAdded, notify }: ModalProps) {
  const fmt = (n: number) => `${currencySymbol}${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  const [supplierId, setSupplierId] = useState('')
  const [addingSupplier, setAddingSupplier] = useState(suppliers.length === 0)
  const [newSupName, setNewSupName] = useState('')
  const [newSupPhone, setNewSupPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Prefill with low-stock items — suggested qty tops each back up to 2× threshold.
  const [items, setItems] = useState<DraftItem[]>(() =>
    lowStock.map((i) => ({
      inventory_id: i.id,
      name: i.name,
      qty_ordered: Math.max(1, Math.ceil((i.low_stock_threshold || 1) * 2 - (i.stock_qty || 0))),
      unit_cost: i.cost_price || 0,
    })),
  )

  const total = items.reduce((sum, it) => sum + (Number(it.qty_ordered) || 0) * (Number(it.unit_cost) || 0), 0)

  const updateItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx))
  const addItemFromInventory = (invId: string) => {
    const inv = allInventory.find((i) => i.id === invId)
    if (!inv || items.some((it) => it.inventory_id === invId)) return
    setItems((prev) => [...prev, { inventory_id: inv.id, name: inv.name, qty_ordered: 1, unit_cost: inv.cost_price || 0 }])
  }

  async function ensureSupplier(): Promise<string | null> {
    if (!addingSupplier) return supplierId || null
    if (!newSupName.trim()) return null
    const res = await fetch('/api/pos/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSupName.trim(), phone: newSupPhone.trim() || null }),
    })
    if (!res.ok) { notify('Could not save supplier', false); return null }
    const { supplier } = await res.json()
    onSupplierAdded(supplier)
    return supplier.id
  }

  async function handleSave() {
    const validItems = items.filter((it) => it.name.trim() && Number(it.qty_ordered) > 0)
    if (validItems.length === 0) { notify('Add at least one item with a quantity', false); return }
    if (addingSupplier && !newSupName.trim()) { notify('Enter a supplier name', false); return }

    setSaving(true)
    try {
      const resolvedSupplierId = await ensureSupplier()
      const res = await fetch('/api/pos/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: resolvedSupplierId,
          notes: notes.trim() || null,
          client_tx_id: `po-${crypto.randomUUID()}`,
          items: validItems,
        }),
      })
      if (!res.ok) { notify('Could not create order', false); setSaving(false); return }
      const { purchase_order } = await res.json()
      onCreated(purchase_order)
    } catch {
      notify('Could not create order', false)
      setSaving(false)
    }
  }

  const inputStyle: CSSProperties = {
    width: '100%', minHeight: 40, background: 'var(--ev)', border: '1px solid var(--b)',
    borderRadius: 8, padding: '0 10px', fontSize: 13, color: 'var(--tx)', fontFamily: 'inherit',
  }

  const notAdded = allInventory.filter((i) => !items.some((it) => it.inventory_id === i.id))

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, padding: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 20, boxShadow: '0 -8px 30px rgba(0,0,0,.25)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>New purchase order</div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 22, lineHeight: 1, color: 'var(--tx3)', cursor: 'pointer' }}>×</button>
        </div>

        {/* Supplier */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', display: 'block', marginBottom: 6 }}>Supplier</label>
        {addingSupplier ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <input style={inputStyle} placeholder="Supplier name" value={newSupName} onChange={(e) => setNewSupName(e.target.value)} />
            <input style={inputStyle} type="tel" inputMode="tel" placeholder="WhatsApp number (for sending later)" value={newSupPhone} onChange={(e) => setNewSupPhone(e.target.value)} />
            {suppliers.length > 0 && (
              <button onClick={() => setAddingSupplier(false)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: ACC, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                ← Pick an existing supplier
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select style={{ ...inputStyle, flex: 1 }} value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">— Select supplier —</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button onClick={() => setAddingSupplier(true)} style={{ minHeight: 40, background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 8, padding: '0 12px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx)', whiteSpace: 'nowrap' }}>+ New</button>
          </div>
        )}

        {/* Items */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', display: 'block', margin: '14px 0 6px' }}>
          Items {lowStock.length > 0 && <span style={{ fontWeight: 400 }}>· {lowStock.length} low-stock item{lowStock.length === 1 ? '' : 's'} prefilled</span>}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--tx3)', padding: '8px 0' }}>No items yet — add one below.</div>
          )}
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 84px 28px', gap: 6, alignItems: 'center' }}>
              <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={it.name}>{it.name}</div>
              <input style={{ ...inputStyle, textAlign: 'center' }} type="number" min={0} inputMode="decimal" value={it.qty_ordered} onChange={(e) => updateItem(idx, { qty_ordered: parseFloat(e.target.value) || 0 })} aria-label={`Quantity for ${it.name}`} />
              <input style={{ ...inputStyle, textAlign: 'right' }} type="number" min={0} inputMode="decimal" value={it.unit_cost} onChange={(e) => updateItem(idx, { unit_cost: parseFloat(e.target.value) || 0 })} aria-label={`Unit cost for ${it.name}`} />
              <button onClick={() => removeItem(idx)} aria-label={`Remove ${it.name}`} style={{ background: 'none', border: 'none', color: RED, fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>

        {notAdded.length > 0 && (
          <select
            value=""
            onChange={(e) => { addItemFromInventory(e.target.value); e.target.value = '' }}
            style={{ ...inputStyle, marginTop: 8 }}
          >
            <option value="">+ Add another product…</option>
            {notAdded.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        )}

        {/* Notes */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', display: 'block', margin: '14px 0 6px' }}>Notes (optional)</label>
        <textarea style={{ ...inputStyle, minHeight: 56, padding: 10, resize: 'vertical' }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery instructions, reference…" />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Total <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(total)}</span></div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ minHeight: 44, background: saving ? 'var(--ev)' : ACC, color: saving ? 'var(--tx3)' : '#fff', border: 'none', borderRadius: 10, padding: '0 22px', fontSize: 14, fontWeight: 600, cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit' }}
          >
            {saving ? 'Saving…' : 'Create order'}
          </button>
        </div>
      </div>
    </div>
  )
}
