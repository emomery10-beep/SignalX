'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import { tokens, Button, Banner, Input, Card, ListItem } from '@/components/ui'

const NS = 'restaurant_deliveries.'

const CATEGORY_KEYS = new Set([
  'meat', 'fish', 'dairy', 'produce', 'dry_goods',
  'beverages', 'cleaning', 'packaging', 'other',
])

function categoryLabel(tc: (key: string, vars?: Record<string, string | number>) => string, category: string): string {
  return CATEGORY_KEYS.has(category) ? tc(NS + 'cat_' + category) : category
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

// Recessed field style for compact inline inputs that aren't a clean fit
// for the shared <Input> (e.g. the per-line cost override with an inline
// currency prefix) — see FormField.tsx for the labeled equivalent used
// elsewhere on this page.
const inp: React.CSSProperties = {
  background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 6,
  color: tokens.ink, padding: '8px 10px', fontSize: 13,
  boxSizing: 'border-box', width: '100%',
}

export default function DeliveriesPage() {
  const router   = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
  const [stage, setStage] = useState<Stage>('capture')

  // Image capture
  const fileInputRef   = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef       = useRef<HTMLVideoElement | null>(null)
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

  // Camera helpers
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setShowCamera(true)
    } catch {
      // Fallback to file picker if camera denied
      cameraInputRef.current?.click()
    }
  }

  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && streamRef.current) { el.srcObject = streamRef.current; el.play().catch(() => {}) }
  }, [])

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
        setError(data.error || tc(NS + 'error_scan_failed'))
        setStage('capture')
        return
      }
      if (!data.matches || data.matches.length === 0) {
        setError(tc(NS + 'error_no_line_items'))
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
      setError(err.message || tc(NS + 'error_network'))
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
      setError(tc(NS + 'error_no_matched_selected'))
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
      setDoneMsg(data.message || tc(NS + 'items_updated', { count: toUpdate.length }))
      setStage('done')
    } catch (err: any) {
      setError(err.message || tc(NS + 'error_update_failed'))
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
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: tokens.accent }}>{tc(NS + 'header_title')}</div>
          <div style={{ fontSize: 11, color: tokens.muted }}>{tc(NS + 'header_subtitle')}</div>
        </div>
        {stage !== 'capture' && stage !== 'scanning' && (
          <Button variant="secondary" size="md" onClick={reset} style={{ marginLeft: 'auto' }}>
            {tc(NS + 'new_scan')}
          </Button>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px' }}>
        {/* Error */}
        {error && (
          <Banner tone="danger">
            {error}
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 16, marginLeft: 8 }}>×</button>
          </Banner>
        )}

        {/* ── CAPTURE STAGE ── */}
        {stage === 'capture' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{tc(NS + 'capture_heading')}</div>
            <div style={{ fontSize: 14, color: tokens.muted, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              {tc(NS + 'capture_blurb')}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" onClick={openCamera}>
                {tc(NS + 'take_photo')}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => fileInputRef.current?.click()}>
                {tc(NS + 'upload_image')}
              </Button>
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: tokens.muted }}>
              {tc(NS + 'capture_works_with')}
            </div>
            <input ref={fileInputRef}   type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
            <input ref={cameraInputRef} type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} capture="environment" />
          </div>
        )}

        {/* ── SCANNING STAGE ── */}
        {stage === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            {preview && (
              <img src={preview} alt={tc(NS + 'img_alt_invoice')} style={{ maxWidth: 280, borderRadius: 12, marginBottom: 24, border: `2px solid ${tokens.border}`, maxHeight: 200, objectFit: 'cover' }} />
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{tc(NS + 'scanning_heading')}</div>
            <div style={{ fontSize: 13, color: tokens.muted }}>{tc(NS + 'scanning_blurb')}</div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.accent, animation: `pulse 1.2s infinite ${i * 0.2}s ease-in-out` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEW STAGE ── */}
        {stage === 'review' && extraction && (
          <div>
            {/* Confidence banner */}
            <Card style={{ padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {preview && (
                  <img src={preview} alt={tc(NS + 'img_alt_invoice')} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: `1px solid ${tokens.border}` }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {tc(NS + 'items_matched', { matched: matchedCount, total: items.length })}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.muted, marginTop: 2 }}>
                    {tc(NS + 'confidence_line', { confidence: extraction.confidence, total: items.length })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: tokens.accent }}>{sym}{totalInvoice.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: tokens.muted }}>{tc(NS + 'invoice_total')}</div>
                </div>
              </div>
            </Card>

            {/* Supplier / invoice header — user can correct */}
            <Card style={{ padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: tokens.hint }}>{tc(NS + 'delivery_details')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label={tc(NS + 'label_supplier')} value={supplierOverride} onChange={e => setSupplierOverride(e.target.value)} placeholder={tc(NS + 'placeholder_supplier')} style={{ fontSize: 13 }} />
                <Input label={tc(NS + 'label_invoice_ref')} value={refOverride} onChange={e => setRefOverride(e.target.value)} placeholder={tc(NS + 'placeholder_invoice_ref')} style={{ fontSize: 13 }} />
                <Input label={tc(NS + 'label_date')} type="date" value={dateOverride} onChange={e => setDateOverride(e.target.value)} style={{ fontSize: 13 }} />
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 12, color: tokens.muted }}>
                    {extraction.raw_notes && <span>📝 {extraction.raw_notes}</span>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Line items */}
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
              {tc(NS + 'review_line_items')}
              <span style={{ fontWeight: 400, fontSize: 12, color: tokens.muted, marginLeft: 8 }}>
                {tc(NS + 'review_line_items_hint')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {items.map((item, idx) => {
                const margin = item.menu_base_price && item.unit_price > 0
                  ? ((item.menu_base_price - item.unit_price) / item.menu_base_price * 100)
                  : null
                const marginColor = margin === null ? tokens.muted : margin >= 65 ? tokens.success : margin >= 50 ? tokens.warning : tokens.danger

                return (
                  <ListItem key={idx} index={idx} style={{
                    background: tokens.surface,
                    border: `1px solid ${item.confirmed ? tokens.accent : tokens.border}`,
                    borderRadius: 10, padding: '14px 16px',
                    opacity: !item.matched ? 0.7 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {/* Checkbox — only for matched items */}
                      <div style={{ paddingTop: 2 }}>
                        {item.matched ? (
                          <input type="checkbox" checked={item.confirmed} onChange={() => toggleConfirm(idx)}
                            style={{ width: 18, height: 18, accentColor: tokens.accent, cursor: 'pointer' }} />
                        ) : (
                          <div style={{ width: 18, height: 18, borderRadius: 3, border: `1px solid ${tokens.border}`, background: tokens.bg }} title={tc(NS + 'not_matched_title')} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Item name + category */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                          <span style={{ fontSize: 11, color: tokens.muted, background: tokens.bg, padding: '2px 6px', borderRadius: 4 }}>
                            {categoryLabel(tc, item.category)}
                          </span>
                          {!item.matched && (
                            <span style={{ fontSize: 11, color: tokens.warning, background: 'rgba(249,115,22,.08)', padding: '2px 6px', borderRadius: 4 }}>
                              {tc(NS + 'not_in_menu')}
                            </span>
                          )}
                        </div>

                        {/* Qty + unit + prices */}
                        <div style={{ fontSize: 13, color: tokens.hint, marginTop: 4 }}>
                          {tc(NS + 'qty_unit_price', { qty: item.qty, unit: item.unit, sym, price: item.unit_price.toFixed(2) })}
                          {item.line_total > 0 && tc(NS + 'line_total_suffix', { sym, total: item.line_total.toFixed(2) })}
                        </div>

                        {/* Menu match info */}
                        {item.matched && (
                          <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: tokens.success }}>
                              {tc(NS + 'matches_label')} <strong>{item.menu_item_name}</strong>
                            </span>
                            {item.current_food_cost !== null && (
                              <span style={{ fontSize: 12, color: tokens.muted }}>
                                {tc(NS + 'current_cost', { sym, cost: item.current_food_cost.toFixed(2) })}
                                {item.unit_price > 0 && item.unit_price !== item.current_food_cost && (
                                  <span style={{ color: item.unit_price > item.current_food_cost ? tokens.danger : tokens.success, marginLeft: 4 }}>
                                    {tc(NS + 'cost_change', { sym, price: item.unit_price.toFixed(2), arrow: item.unit_price > item.current_food_cost ? '▲' : '▼' })}
                                  </span>
                                )}
                              </span>
                            )}
                            {margin !== null && (
                              <span style={{ fontSize: 12, color: marginColor, fontWeight: 600 }}>
                                {tc(NS + 'margin_label', { margin: margin.toFixed(0) })}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Editable cost override — only when confirmed */}
                        {item.confirmed && item.matched && (
                          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label style={{ fontSize: 12, color: tokens.muted, whiteSpace: 'nowrap' }}>{tc(NS + 'set_food_cost_to')}</label>
                            <div style={{ position: 'relative', maxWidth: 120 }}>
                              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: tokens.muted, fontSize: 13 }}>{sym}</span>
                              <input
                                type="number" step="0.01" min="0"
                                value={item.override_cost}
                                onChange={e => updateCost(idx, e.target.value)}
                                style={{ ...inp, paddingLeft: 24, maxWidth: 120 }}
                              />
                            </div>
                            <span style={{ fontSize: 12, color: tokens.muted }}>{tc(NS + 'per_unit', { unit: item.unit })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </ListItem>
                )
              })}
            </div>

            {/* Action bar */}
            <Card style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, fontSize: 13, color: tokens.hint }}>
                {confirmedCount > 0
                  ? <span style={{ color: tokens.accent, fontWeight: 600 }}>{tc(NS + (confirmedCount === 1 ? 'costs_will_update_one' : 'costs_will_update_other'), { count: confirmedCount })}</span>
                  : tc(NS + 'check_items_to_update')
                }
              </div>
              <Button variant="secondary" onClick={reset}>
                {tc(NS + 'cancel')}
              </Button>
              <Button variant="primary" onClick={confirmUpdates} disabled={confirmedCount === 0 || confirming}
                style={{ background: confirmedCount > 0 ? tokens.success : tokens.border }}>
                {confirming
                  ? tc(NS + 'saving')
                  : confirmedCount > 0
                    ? tc(NS + (confirmedCount === 1 ? 'confirm_one' : 'confirm_other'), { count: confirmedCount })
                    : tc(NS + 'confirm_plain')}
              </Button>
            </Card>
          </div>
        )}

        {/* ── CONFIRMING STAGE ── */}
        {stage === 'confirming' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💾</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{tc(NS + 'confirming_heading')}</div>
          </div>
        )}

        {/* ── DONE STAGE ── */}
        {stage === 'done' && (
          <div className="pos-reveal" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="pos-success-icon" style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: tokens.success }}>{doneMsg}</div>
            <div style={{ fontSize: 14, color: tokens.muted, marginBottom: 32 }}>
              {tc(NS + 'done_blurb')}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={reset}>
                {tc(NS + 'scan_another')}
              </Button>
              <Button variant="secondary" onClick={() => router.push('/restaurant/menu')}>
                {tc(NS + 'view_menu_margins')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Live camera modal — a genuine full-screen viewfinder feed, kept on
          its native black background (same rationale as get-listed's shoot
          screen and components/ui/CameraCapture.tsx): translucent white
          overlay controls read correctly against live video regardless of
          the app's light theme, and flipping the background here would sit
          behind the video with no visible effect while risking control
          contrast. Left untouched by design. */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={closeCamera} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
              {tc(NS + 'camera_cancel')}
            </button>
            <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: 13 }}>
              {tc(NS + 'camera_position')}
            </div>
          </div>

          <video ref={attachVideo} autoPlay playsInline muted
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
