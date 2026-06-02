'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#f59e0b'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const GOOD = '#22c55e'
const BAD = '#ef4444'

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'
type Stage = 'select_type' | 'capture_photo' | 'details' | 'done'

interface TypeMeta {
  label: string
  icon: string
  color: string
  blurb: string
  notesLabel: string
  notesPlaceholder: string
}

const TYPE_META: Record<CaptureType, TypeMeta> = {
  intake:   { label: 'Intake',   icon: '📥', color: '#3b82f6', blurb: 'Raw materials received in', notesLabel: 'Supplier / batch notes', notesPlaceholder: 'e.g. Supplier, delivery note #, condition…' },
  output:   { label: 'Output',   icon: '📤', color: GOOD,      blurb: 'Finished goods produced', notesLabel: 'Production notes', notesPlaceholder: 'e.g. Line, shift, quality notes…' },
  wastage:  { label: 'Wastage',  icon: '🗑️', color: BAD,       blurb: 'Scrap / spoilage', notesLabel: 'Reason for wastage *', notesPlaceholder: 'e.g. Spoiled, damaged in handling, QC reject…' },
  dispatch: { label: 'Dispatch', icon: '🚚', color: '#8b5cf6', blurb: 'Goods shipped out', notesLabel: 'Destination *', notesPlaceholder: 'e.g. Customer / warehouse, vehicle, order #…' },
}

const UNITS = ['kg', 'pcs', 'litres', 'boxes', 'tonnes', 'g', 'packs', 'pallets']

interface InventoryItem { id: string; name: string }

export default function FactoryCapturePage() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)

  const [stage, setStage] = useState<Stage>('select_type')
  const [type, setType] = useState<CaptureType | null>(null)
  const [preview, setPreview] = useState<string | null>(null)   // dataURL of captured photo
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // form
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [product, setProduct] = useState('')
  const [freeProduct, setFreeProduct] = useState('')
  const [useFree, setUseFree] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).catch(() => {})
      fetch(`${API}/api/pos/inventory`).then(r => r.ok ? r.json() : { inventory: [] })
        .then(d => setInventory(d.inventory || [])).catch(() => {})
    })
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  // ── Camera helpers ────────────────────────────────────────────
  async function openCamera() {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setShowCamera(true)
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) }
      }, 100)
    } catch (err: any) {
      // Camera denied / unavailable → fall back to native file picker
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera access was denied. Use “Choose photo” to upload instead.'
          : 'Camera unavailable on this device. Use “Choose photo” to upload instead.'
      )
      cameraInputRef.current?.click()
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCamera(false)
  }

  function captureFromVideo() {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current
    canvasRef.current.width = v.videoWidth
    canvasRef.current.height = v.videoHeight
    canvasRef.current.getContext('2d')?.drawImage(v, 0, 0)
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85)
    closeCamera()
    setPreview(dataUrl)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function retake() {
    setPreview(null)
    setCameraError(null)
  }

  // ── Flow control ──────────────────────────────────────────────
  function pickType(t: CaptureType) {
    setType(t)
    setStage('capture_photo')
  }

  function backToType() {
    closeCamera()
    setPreview(null)
    setType(null)
    setCameraError(null)
    setStage('select_type')
  }

  function proceedToDetails() {
    if (!preview) return
    setStage('details')
  }

  function resetAll() {
    closeCamera()
    setStage('select_type')
    setType(null)
    setPreview(null)
    setProduct('')
    setFreeProduct('')
    setUseFree(false)
    setQuantity('')
    setUnit('kg')
    setNotes('')
    setError(null)
    setCameraError(null)
  }

  const resolvedProduct = useFree ? freeProduct.trim() : product.trim()
  const notesRequired = type === 'wastage' || type === 'dispatch'

  async function submit() {
    if (!type || !preview) return
    if (!resolvedProduct) { setError('Please select or enter a product.'); return }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) { setError('Enter a valid quantity.'); return }
    if (notesRequired && !notes.trim()) {
      setError(type === 'wastage' ? 'A reason for wastage is required.' : 'A destination is required for dispatch.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/pos/factory/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          image: preview,                 // full data URL; API strips prefix
          product_name: resolvedProduct,
          quantity: Number(quantity),
          unit,                           // sent for completeness
          batch_ref: unit,                // round-trips the unit (no dedicated column)
          notes: notes.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit capture.')
        setSubmitting(false)
        return
      }
      setStage('done')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>Loading…</div>
  }

  const meta = type ? TYPE_META[type] : null

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hidden file input fallback (always mounted) */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => { closeCamera(); router.push('/factory') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🏭 Production Capture</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {stage === 'select_type' && 'Choose what you are logging'}
            {stage === 'capture_photo' && `Photograph the ${meta?.label.toLowerCase()} as proof`}
            {stage === 'details' && 'Add the details'}
            {stage === 'done' && 'Capture submitted'}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 640, margin: '0 auto' }}>
        {/* Step indicator */}
        {stage !== 'done' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {(['select_type', 'capture_photo', 'details'] as Stage[]).map((s, i) => {
              const order = ['select_type', 'capture_photo', 'details']
              const active = order.indexOf(stage) >= i
              return <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: active ? ACC : '#334155' }} />
            })}
          </div>
        )}

        {/* ── STAGE 1: select type ───────────────────────────── */}
        {stage === 'select_type' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {(Object.keys(TYPE_META) as CaptureType[]).map(t => {
              const m = TYPE_META[t]
              return (
                <button key={t} onClick={() => pickType(t)}
                  style={{ background: '#1e293b', border: `2px solid ${m.color}55`, borderRadius: 16, padding: '28px 18px', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.15s, transform 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = m.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = `${m.color}55`)}
                >
                  <div style={{ fontSize: 44, marginBottom: 10 }}>{m.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: m.color }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{m.blurb}</div>
                </button>
              )
            })}
          </div>
        )}

        {/* ── STAGE 2: capture photo ─────────────────────────── */}
        {stage === 'capture_photo' && meta && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ background: `${meta.color}22`, color: meta.color, padding: '5px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>{meta.icon} {meta.label}</span>
              <button onClick={backToType} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>change</button>
            </div>

            {!preview ? (
              <div style={{ background: '#1e293b', border: '1px dashed #334155', borderRadius: 16, padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>📷</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Photograph the {meta.label.toLowerCase()}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>This photo is the proof attached to this capture.<br />Make sure the materials / goods are clearly visible.</div>
                {cameraError && <div style={{ color: BAD, fontSize: 12, marginBottom: 14 }}>{cameraError}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
                  <button onClick={openCamera} style={{ background: ACC, border: 'none', color: '#1a1206', padding: '14px', borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>📸 Open Camera</button>
                  <button onClick={() => cameraInputRef.current?.click()} style={{ background: '#334155', border: 'none', color: '#e2e8f0', padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>🖼️ Choose photo</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ borderRadius: 16, overflow: 'hidden', border: `2px solid ${meta.color}55`, marginBottom: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="capture preview" style={{ width: '100%', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={retake} style={{ flex: 1, background: '#334155', border: 'none', color: '#e2e8f0', padding: '14px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>↺ Retake</button>
                  <button onClick={proceedToDetails} style={{ flex: 2, background: ACC, border: 'none', color: '#1a1206', padding: '14px', borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>Continue →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STAGE 3: details ───────────────────────────────── */}
        {stage === 'details' && meta && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              {preview && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={preview} alt="thumb" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: `2px solid ${meta.color}55` }} />
              )}
              <div>
                <span style={{ background: `${meta.color}22`, color: meta.color, padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{meta.icon} {meta.label}</span>
              </div>
              <button onClick={() => setStage('capture_photo')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>retake photo</button>
            </div>

            {/* Product */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Product *</label>
            {!useFree ? (
              <select value={product} onChange={e => { if (e.target.value === '__free__') { setUseFree(true); setProduct('') } else setProduct(e.target.value) }}
                style={inputStyle}>
                <option value="">Select product…</option>
                {inventory.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                <option value="__free__">+ Enter manually…</option>
              </select>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={freeProduct} onChange={e => setFreeProduct(e.target.value)} placeholder="Product name" style={{ ...inputStyle, flex: 1 }} autoFocus />
                {inventory.length > 0 && <button onClick={() => { setUseFree(false); setFreeProduct('') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontSize: 13 }}>list</button>}
              </div>
            )}

            {/* Quantity + unit */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Quantity *</label>
                <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" inputMode="decimal" min="0" placeholder="0" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '16px 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>{meta.notesLabel}</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={meta.notesPlaceholder} rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} />

            {error && <div style={{ color: BAD, fontSize: 13, marginTop: 14 }}>{error}</div>}

            <button onClick={submit} disabled={submitting}
              style={{ width: '100%', marginTop: 20, background: submitting ? '#334155' : ACC, border: 'none', color: submitting ? '#94a3b8' : '#1a1206', padding: '16px', borderRadius: 12, cursor: submitting ? 'default' : 'pointer', fontWeight: 800, fontSize: 16 }}>
              {submitting ? 'Submitting…' : `Submit ${meta.label} Capture`}
            </button>
            <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 10 }}>Will be submitted for supervisor approval.</div>
          </div>
        )}

        {/* ── STAGE 4: done ──────────────────────────────────── */}
        {stage === 'done' && meta && (
          <div style={{ textAlign: 'center', paddingTop: 30 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: `${GOOD}22`, border: `2px solid ${GOOD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, margin: '0 auto 20px' }}>✓</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Capture Logged</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>{meta.icon} {meta.label} · {resolvedProduct} · {quantity} {unit}</div>
            <div style={{ display: 'inline-block', background: `${ACC}22`, color: ACC, padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginTop: 8 }}>⏳ Pending approval</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '32px auto 0' }}>
              <button onClick={resetAll} style={{ background: ACC, border: 'none', color: '#1a1206', padding: '16px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>📸 New Capture</button>
              <button onClick={() => router.push('/factory/production')} style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '14px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>View Production Log</button>
              <button onClick={() => router.push('/factory')} style={{ background: 'none', border: 'none', color: '#64748b', padding: '8px', cursor: 'pointer', fontSize: 13 }}>← Back to Factory hub</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Live camera overlay ──────────────────────────────── */}
      {showCamera && meta && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 300, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
            <button onClick={closeCamera} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>✕ Cancel</button>
            <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: 13 }}>{meta.icon} Frame the {meta.label.toLowerCase()} clearly</div>
          </div>
          <video ref={videoRef} playsInline muted style={{ flex: 1, objectFit: 'cover', width: '100%' }} />
          <div style={{ padding: 28, display: 'flex', justifyContent: 'center' }}>
            <button onClick={captureFromVideo}
              style={{ width: 76, height: 76, borderRadius: '50%', background: '#fff', border: `5px solid ${ACC}`, cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</button>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 10,
  color: '#f1f5f9',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
}
