'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

const ACC = '#d08a59'

const CATEGORY_LABELS: Record<string, string> = {
  meat: '🥩 Meat', fish: '🐟 Fish', dairy: '🧀 Dairy', produce: '🥦 Produce',
  dry_goods: '🌾 Dry Goods', beverages: '🍶 Beverages', cleaning: '🧹 Cleaning',
  packaging: '📦 Packaging', other: '📁 Other',
}

interface LineItem {
  name: string
  qty: number
  unit: string
  unit_price: number
  line_total: number
  category: string
  // matched info from API
  menu_item_id: string | null
  menu_item_name: string | null
  current_food_cost: number | null
  menu_base_price: number | null
  suggested_food_cost: number | null
  matched: boolean
  // user edits
  confirmed: boolean
  override_cost: string
}

interface Extraction {
  supplier_name: string
  invoice_date: string | null
  invoice_ref: string | null
  currency: string
  confidence: number
  raw_notes: string
  total_items: number
}

type Stage = 'capture' | 'scanning' | 'review' | 'confirming' | 'done'

const inp: React.CSSProperties = {
  background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
  color: '#f1f5f9', padding: '8px 10px', fontSize: 13,
  boxSizing: 'border-box', width: '100%',
}

export default function DeliveriesPage() {
  const router   = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const [sym, setSym]     = useState('£')
  const [stage, setStage] = useState<Stage>('capture')

  // Image capture
  const fileInputRef   = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef       = useRef<HTMLVideoElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const streamRef      = useRef<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [preview, setPreview]       = useState<string | null>(null) // data URL for thumbnail

  // Extraction results
  const [extraction, setExtraction] = useState<Extraction | null>(null)
  const [items, setItems]           = useState<LineItem[]>([])
  const [error, setError]           = useState<string | null>(null)

  // Supplier override (user can correct what Claude extracted)
  const [supplierOverride, setSupplierOverride] = useState('')
  const [dateOverride, setDateOverride]         = useState('')
  const [refOverride, setRefOverride]           = useState('')

  // Confirm
  const [confirming, setConfirming] = useState(false)
  const [doneMsg, setDoneMsg]       = useState('')

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: session.headers }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
    }).catch(() => {})
  }, [authReady, session])

  // Camera helpers
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setShowCamera(true)
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) } }, 100)
    } catch {
      // Fallback to file picker if camera denied
      cameraInputRef.current?.click()
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCamera(false)
  }

  async function captureFromVideo() {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current
    canvasRef.current.width  = v.videoWidth
    canvasRef.current.height = v.videoHeight
    canvasRef.current.getContext('2d')?.drawImage(v, 0, 0)
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85)
    closeCamera()
    await processImage(dataUrl, 'image/jpeg')
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      const dataUrl = ev.target?.result as string
      await processImage(dataUrl, file.type as any)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function processImage(dataUrl: string, mediaType: string) {
    if (!session) return
    setPreview(dataUrl)
    setStage('scanning')
    setError(null)

    // Strip data URL prefix to get raw base64
    const base64 = dataUrl.split(',')[1]

    try {
      const res = await fetch('/api/pos/restaurant/recognize/invoice', {
        method: 'POST',
        headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, media_type: mediaType || 'image/jpeg' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Scan failed')
        setStage('capture')
        return
      }
      if (!data.matches || data.matches.length === 0) {
        setError('No line items found — try a clearer photo or a different angle.')
        setStage('capture')
        return
      }

      setExtraction(data.extraction)
      setSupplierOverride(data.extraction.supplier_name || '')
      setDateOverride(data.extraction.invoice_date || '')
      setRefOverride(data.extraction.invoice_ref || '')

      const lineItems: LineItem[] = data.matches.map((m: any) => ({
        name:              m.name,
        qty:               m.qty,
        unit:              m.unit,
        unit_price:        m.unit_price,
        line_total:        m.line_total,
        category:          m.category,
        menu_item_id:      m.menu_item_id,
        menu_item_name:    m.menu_item_name,
        current_food_cost: m.current_food_cost,
        menu_base_price:   m.menu_base_price,
        suggested_food_cost: m.suggested_food_cost,
        matched:           m.matched,
        confirmed:         m.matched && m.unit_price > 0, // auto-confirm matched items with a price
        override_cost:     m.unit_price > 0 ? String(m.unit_price) : '',
      }))
      setItems(lineItems)
      setStage('review')
    } catch (err: any) {
      setError(err.message || 'Network error')
      setStage('capture')
    }
  }

  function toggleConfirm(idx: number) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, confirmed: !it.confirmed } : it))
  }

  function updateCost(idx: number, val: string) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, override_cost: val } : it))
  }

  async function confirmUpdates() {
    if (!session) return
    const toUpdate = items.filter(it => it.confirmed && it.menu_item_id)
    if (toUpdate.length === 0) {
      setError('No matched items selected for update.')
      return
    }
    setConfirming(true)
    setStage('confirming')

    const updates = toUpdate.map(it => ({
      menu_item_id: it.menu_item_id,
      food_cost: parseFloat(it.override_cost) || it.unit_price,
    }))

    const totalValue = items.reduce((s, it) => s + (it.line_total || 0), 0)

    try {
      const res = await fetch('/api/pos/restaurant/recognize/invoice', {
        method: 'PATCH',
        headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates,
          delivery_record: {
            supplier_name: supplierOverride || extraction?.supplier_name,
            invoice_ref:   refOverride      || extraction?.invoice_ref,
            invoice_date:  dateOverride     || extraction?.invoice_date,
            total_value:   totalValue,
            currency:      extraction?.currency || 'GBP',
          },
        }),
      })
      const data = await res.json()
      setDoneMsg(data.message || `${toUpdate.length} items updated`)
      setStage('done')
    } catch (err: any) {
      setError(err.message || 'Update failed')
      setStage('review')
    } finally {
      setConfirming(false)
    }
  }

  function reset() {
    setStage('capture')
    setPreview(null)
    setExtraction(null)
    setItems([])
    setError(null)
    setSupplierOverride('')
    setDateOverride('')
    setRefOverride('')
    setDoneMsg('')
  }

  const confirmedCount  = items.filter(it => it.confirmed && it.menu_item_id).length
  const matchedCount    = items.filter(it => it.matched).length
  const totalInvoice    = items.reduce((s, it) => s + (it.line_total || 0), 0)

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>📦 Delivery Scanner</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Scan supplier invoices · Update food costs · Build price history</div>
        </div>
        {stage !== 'capture' && stage !== 'scanning' && (
          <button onClick={reset} style={{ marginLeft: 'auto', background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
            New Scan
          </button>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px' }}>
        {/* Error */}
        {error && (
          <div className="pos-banner" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#fca5a5', fontSize: 13 }}>
            ⚠ {error}
            <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        )}

        {/* ── CAPTURE STAGE ── */}
        {stage === 'capture' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Scan a Delivery Note</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Point your camera at a supplier invoice or delivery note. Claude will extract every line item, match it to your menu, and let you update food costs in one tap.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={openCamera} className="pos-btn-primary"
                style={{ background: ACC, border: 'none', color: '#fff', padding: '14px 28px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                📷 Take Photo
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '14px 28px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                📁 Upload Image
              </button>
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
              Works with printed invoices, handwritten notes, and delivery sheets
            </div>
            <input ref={fileInputRef}   type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
            <input ref={cameraInputRef} type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} capture="environment" />
          </div>
        )}

        {/* ── SCANNING STAGE ── */}
        {stage === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            {preview && (
              <img src={preview} alt="Invoice" style={{ maxWidth: 280, borderRadius: 12, marginBottom: 24, border: '2px solid #334155', maxHeight: 200, objectFit: 'cover' }} />
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Reading your delivery note...</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Claude is extracting line items, prices and quantities</div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: ACC, animation: `pulse 1.2s infinite ${i * 0.2}s ease-in-out` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEW STAGE ── */}
        {stage === 'review' && extraction && (
          <div>
            {/* Confidence banner */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {preview && (
                  <img src={preview} alt="Invoice" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #334155' }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {matchedCount}/{items.length} items matched to your menu
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Confidence: {extraction.confidence}% · {items.length} line items found
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: ACC }}>{sym}{totalInvoice.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>invoice total</div>
                </div>
              </div>
            </div>

            {/* Supplier / invoice header — user can correct */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#94a3b8' }}>Delivery Details (edit if incorrect)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Supplier</label>
                  <input value={supplierOverride} onChange={e => setSupplierOverride(e.target.value)} style={inp} placeholder="Supplier name" />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Invoice / Ref</label>
                  <input value={refOverride} onChange={e => setRefOverride(e.target.value)} style={inp} placeholder="DN-12345" />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Date</label>
                  <input type="date" value={dateOverride} onChange={e => setDateOverride(e.target.value)} style={inp} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 12, color: '#475569' }}>
                    {extraction.raw_notes && <span>📝 {extraction.raw_notes}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
              Review Line Items
              <span style={{ fontWeight: 400, fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                Check the box to update food cost on matched menu items
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {items.map((item, idx) => {
                const margin = item.menu_base_price && item.unit_price > 0
                  ? ((item.menu_base_price - item.unit_price) / item.menu_base_price * 100)
                  : null
                const marginColor = margin === null ? '#64748b' : margin >= 65 ? '#22c55e' : margin >= 50 ? '#f59e0b' : '#ef4444'

                return (
                  <div key={idx} className="pos-item" style={{
                    background: '#1e293b',
                    border: `1px solid ${item.confirmed ? ACC : '#334155'}`,
                    borderRadius: 10, padding: '14px 16px',
                    opacity: !item.matched ? 0.7 : 1,
                    animationDelay: `${Math.min(idx, 8) * 40}ms`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {/* Checkbox — only for matched items */}
                      <div style={{ paddingTop: 2 }}>
                        {item.matched ? (
                          <input type="checkbox" checked={item.confirmed} onChange={() => toggleConfirm(idx)}
                            style={{ width: 18, height: 18, accentColor: ACC, cursor: 'pointer' }} />
                        ) : (
                          <div style={{ width: 18, height: 18, borderRadius: 3, border: '1px solid #334155', background: '#0f172a' }} title="Not matched to menu" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Item name + category */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                          <span style={{ fontSize: 11, color: '#64748b', background: '#0f172a', padding: '2px 6px', borderRadius: 4 }}>
                            {CATEGORY_LABELS[item.category] || item.category}
                          </span>
                          {!item.matched && (
                            <span style={{ fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                              Not in menu
                            </span>
                          )}
                        </div>

                        {/* Qty + unit + prices */}
                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                          {item.qty} {item.unit} · {sym}{item.unit_price.toFixed(2)}/unit
                          {item.line_total > 0 && ` · Total: ${sym}${item.line_total.toFixed(2)}`}
                        </div>

                        {/* Menu match info */}
                        {item.matched && (
                          <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: '#22c55e' }}>
                              ✓ Matches: <strong>{item.menu_item_name}</strong>
                            </span>
                            {item.current_food_cost !== null && (
                              <span style={{ fontSize: 12, color: '#64748b' }}>
                                Current cost: {sym}{item.current_food_cost.toFixed(2)}
                                {item.unit_price > 0 && item.unit_price !== item.current_food_cost && (
                                  <span style={{ color: item.unit_price > item.current_food_cost ? '#ef4444' : '#22c55e', marginLeft: 4 }}>
                                    → {sym}{item.unit_price.toFixed(2)} ({item.unit_price > item.current_food_cost ? '▲' : '▼'})
                                  </span>
                                )}
                              </span>
                            )}
                            {margin !== null && (
                              <span style={{ fontSize: 12, color: marginColor, fontWeight: 600 }}>
                                Margin: {margin.toFixed(0)}%
                              </span>
                            )}
                          </div>
                        )}

                        {/* Editable cost override — only when confirmed */}
                        {item.confirmed && item.matched && (
                          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>Set food cost to:</label>
                            <div style={{ position: 'relative', maxWidth: 120 }}>
                              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>{sym}</span>
                              <input
                                type="number" step="0.01" min="0"
                                value={item.override_cost}
                                onChange={e => updateCost(idx, e.target.value)}
                                style={{ ...inp, paddingLeft: 24, maxWidth: 120 }}
                              />
                            </div>
                            <span style={{ fontSize: 12, color: '#475569' }}>per {item.unit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action bar */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, fontSize: 13, color: '#94a3b8' }}>
                {confirmedCount > 0
                  ? <span style={{ color: ACC, fontWeight: 600 }}>{confirmedCount} food cost{confirmedCount !== 1 ? 's' : ''} will be updated</span>
                  : 'Check items to update their food costs'
                }
              </div>
              <button onClick={reset} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={confirmUpdates} disabled={confirmedCount === 0 || confirming} className="pos-btn-primary"
                style={{ background: confirmedCount > 0 ? '#22c55e' : '#334155', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 8, cursor: confirmedCount > 0 ? 'pointer' : 'default', fontWeight: 700, fontSize: 13, opacity: confirmedCount === 0 ? 0.5 : 1 }}>
                {confirming ? 'Saving...' : `✓ Confirm ${confirmedCount > 0 ? confirmedCount + ' update' + (confirmedCount !== 1 ? 's' : '') : ''}`}
              </button>
            </div>
          </div>
        )}

        {/* ── CONFIRMING STAGE ── */}
        {stage === 'confirming' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💾</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Updating food costs...</div>
          </div>
        )}

        {/* ── DONE STAGE ── */}
        {stage === 'done' && (
          <div className="pos-reveal" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="pos-success-icon" style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#22c55e' }}>{doneMsg}</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
              Margins recalculated. Price data added to the collective intelligence pool.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={reset} className="pos-btn-primary"
                style={{ background: ACC, border: 'none', color: '#fff', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                Scan Another Delivery
              </button>
              <button onClick={() => router.push('/restaurant/menu')}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>
                View Menu Margins →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live camera modal */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={closeCamera} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
              ✕ Cancel
            </button>
            <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: 13 }}>
              Position the invoice to fill the frame
            </div>
          </div>

          <video ref={videoRef} playsInline muted
            style={{ flex: 1, objectFit: 'cover', width: '100%' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
            <button onClick={captureFromVideo}
              style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '4px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              📷
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
