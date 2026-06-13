'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const API    = process.env.NEXT_PUBLIC_API_URL || ''
const tokens = {
  bg:      'var(--pos-bg)',
  surface: 'var(--pos-surface)',
  border:  'var(--pos-border)',
  ink:     'var(--pos-ink)',
  muted:   'var(--pos-muted)',
  hint:    'var(--pos-hint)',
  accent:  'var(--pos-accent)',
  success: 'var(--pos-success)',
  danger:  'var(--pos-danger)',
  warning: 'var(--pos-warning)',
}

type Stage = 'hub' | 'viewfinder' | 'details' | 'submitting' | 'success'

interface Waybill {
  id: string
  waybill_ref: string | null
  destination: string
  product_name: string | null
  quantity: number | null
  photo_url: string | null
  scheduled_at: string | null
  dispatched_at: string
  is_on_time: boolean | null
  vehicle_ref: string | null
}

interface HubData {
  waybills: Waybill[]
  totalDispatches: number
  onTime: number
  late: number
  onTimeRate: number | null
  totalUnits: number
  withScheduleCount: number
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

function IconArrowLeft({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
  )
}
function IconTruck({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}
function IconCamera({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

export default function WaybillPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [stage, setStage] = useState<Stage>('hub')

  // Hub data
  const [hubData, setHubData] = useState<HubData | null>(null)
  const [hubLoading, setHubLoading] = useState(true)

  // Camera
  const videoRef  = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [flashVisible, setFlashVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // Details form
  const [destination, setDestination] = useState('')
  const [waybillRef,  setWaybillRef]  = useState('')
  const [productName, setProductName] = useState('')
  const [quantity,    setQuantity]    = useState('')
  const [vehicleRef,  setVehicleRef]  = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [notes,       setNotes]       = useState('')

  // Success result
  const [successWaybill, setSuccessWaybill] = useState<Waybill | null>(null)
  const [error,          setError]          = useState('')

  // Auth guard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load hub data
  const loadHub = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/pos/factory/waybill`)
      const d = r.ok ? await r.json() : null
      setHubData(d)
    } catch { /* silent */ } finally {
      setHubLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    loadHub()
  }, [ready, loadHub])

  // Open camera
  const openCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch { setError('Camera access denied'); setStage('hub') }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    if (stage === 'viewfinder') openCamera()
    else stopCamera()
  }, [stage, openCamera, stopCamera])

  useEffect(() => () => stopCamera(), [stopCamera])

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
    setCapturedImage(dataUrl)
    setFlashVisible(true)
    setTimeout(() => setFlashVisible(false), 180)
    stopCamera()
    setStage('details')
  }

  // Submit waybill
  const handleSubmit = async () => {
    if (!destination.trim()) { setError('Destination is required'); return }
    if (!capturedImage)      { setError('Photo is required'); return }
    setError('')
    setStage('submitting')
    try {
      const body: Record<string, unknown> = {
        destination: destination.trim(),
        image:       capturedImage,
      }
      if (waybillRef.trim())  body.waybill_ref  = waybillRef.trim()
      if (productName.trim()) body.product_name = productName.trim()
      if (quantity)           body.quantity      = Number(quantity)
      if (vehicleRef.trim())  body.vehicle_ref  = vehicleRef.trim()
      if (scheduledAt)        body.scheduled_at = new Date(scheduledAt).toISOString()
      if (notes.trim())       body.notes        = notes.trim()

      const r = await fetch(`${API}/api/pos/factory/waybill`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Failed to log waybill'); setStage('details'); return }
      setSuccessWaybill(d.waybill)
      await loadHub()
      setStage('success')
    } catch { setError('Network error — please retry'); setStage('details') }
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(249,115,22,.3)', borderTopColor: tokens.warning, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ── Viewfinder ────────────────────────────────────────────────────────────
  if (stage === 'viewfinder') return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Flash */}
        {flashVisible && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0.85, pointerEvents: 'none' }} />}
        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 20px 20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setStage('hub')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-surface)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <IconArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>Photograph Waybill</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Delivery note or shipping label</div>
          </div>
        </div>
        {/* Frame guide */}
        <div style={{ position: 'absolute', inset: '20%', border: '2px solid rgba(249,115,22,0.5)', borderRadius: 12, pointerEvents: 'none' }} />
        {/* Shutter */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px 44px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={capturePhoto}
            style={{ width: 72, height: 72, borderRadius: '50%', background: tokens.warning, border: '4px solid var(--pos-hint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 8px rgba(249,115,22,0.2)`, color: '#fff' }}>
            <IconCamera size={28} />
          </button>
        </div>
      </div>
    </div>
  )

  // ── Details ───────────────────────────────────────────────────────────────
  if (stage === 'details') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStage('viewfinder')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft size={18} />
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: tokens.warning }}>Dispatch Details</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>Fill in the shipment info</div>
        </div>
      </div>

      <div style={{ padding: '20px 20px', maxWidth: 600, margin: '0 auto' }}>
        {/* Photo preview */}
        {capturedImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={capturedImage} alt="waybill" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 14, marginBottom: 20, border: `2px solid ${tokens.warning}40` }} />
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: tokens.danger }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Destination — required */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Destination *</label>
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Accra Main Depot"
              style={{ width: '100%', background: 'var(--pos-border)', border: `1px solid ${destination.trim() ? `${tokens.warning}50` : 'var(--pos-border)'}`, borderRadius: 10, padding: '12px 14px', color: 'var(--pos-ink)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Scheduled time */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Scheduled Dispatch Time <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              style={{ width: '100%', background: 'var(--pos-border)', border: `1px solid ${scheduledAt ? `${tokens.warning}50` : 'var(--pos-border)'}`, borderRadius: 10, padding: '12px 14px', color: 'var(--pos-ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
            />
            {scheduledAt && <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 4 }}>On-time if dispatched within 15 min of this time</div>}
          </div>

          {/* Two-column: Waybill ref + Vehicle ref */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Waybill Ref</label>
              <input
                value={waybillRef}
                onChange={e => setWaybillRef(e.target.value.toUpperCase())}
                placeholder="WB-001"
                style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', borderRadius: 10, padding: '11px 12px', color: 'var(--pos-ink)', fontSize: 14, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Vehicle Ref</label>
              <input
                value={vehicleRef}
                onChange={e => setVehicleRef(e.target.value.toUpperCase())}
                placeholder="GH-1234"
                style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', borderRadius: 10, padding: '11px 12px', color: 'var(--pos-ink)', fontSize: 14, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }}
              />
            </div>
          </div>

          {/* Two-column: Product + Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Product</label>
              <input
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="Product name"
                style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', borderRadius: 10, padding: '11px 12px', color: 'var(--pos-ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                min="1"
                style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', borderRadius: 10, padding: '11px 12px', color: 'var(--pos-ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>Notes <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional information…"
              rows={2}
              style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', borderRadius: 10, padding: '11px 12px', color: 'var(--pos-ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'none' }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!destination.trim()}
          style={{
            marginTop: 24,
            width: '100%',
            background: destination.trim() ? `linear-gradient(135deg, ${tokens.warning}, #ea580c)` : 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: 14,
            padding: '16px',
            color: destination.trim() ? '#fff' : 'var(--pos-hint)',
            fontWeight: 800,
            fontSize: 16,
            cursor: destination.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 150ms',
          }}
        >
          Log Dispatch
        </button>
      </div>
    </div>
  )

  // ── Submitting ────────────────────────────────────────────────────────────
  if (stage === 'submitting') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(249,115,22,.3)`, borderTopColor: tokens.warning, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ fontSize: 15, color: 'var(--pos-muted)' }}>Logging dispatch…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ── Success ───────────────────────────────────────────────────────────────
  if (stage === 'success' && successWaybill) {
    const isOnTime = successWaybill.is_on_time
    const onTimeRate = hubData?.onTimeRate ?? null
    const statusColor = isOnTime === true ? tokens.success : isOnTime === false ? tokens.danger : tokens.warning
    const statusIcon  = isOnTime === true ? '✓' : isOnTime === false ? '✗' : '—'
    const statusLabel = isOnTime === true ? 'On Time' : isOnTime === false ? 'Late' : 'No schedule set'

    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/factory')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
            <IconArrowLeft size={18} />
          </button>
          <div style={{ fontWeight: 800, fontSize: 18, color: tokens.warning }}>Dispatch Logged</div>
        </div>

        <div style={{ padding: '28px 20px', maxWidth: 600, margin: '0 auto' }}>
          {/* Photo + on-time badge */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={successWaybill.photo_url || ''} alt="waybill" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 16, border: `3px solid ${statusColor}50` }} />
            <div style={{ position: 'absolute', top: 12, right: 12, background: statusColor, borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{statusIcon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{statusLabel}</span>
            </div>
          </div>

          {/* Summary card */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 4 }}>{successWaybill.destination}</div>
            {successWaybill.waybill_ref && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', marginBottom: 10 }}>{successWaybill.waybill_ref}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {successWaybill.vehicle_ref && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Vehicle</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>{successWaybill.vehicle_ref}</div>
                </div>
              )}
              {successWaybill.quantity != null && (
                <div>
                  <div style={{ fontSize: 10, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Qty</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{successWaybill.quantity.toLocaleString()}</div>
                </div>
              )}
              {successWaybill.product_name && (
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: 10, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Product</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{successWaybill.product_name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Daily on-time rate */}
          {onTimeRate !== null && (
            <div style={{ background: `rgba(249,115,22,0.06)`, border: `1px solid rgba(249,115,22,0.2)`, borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginBottom: 2 }}>Today's on-time rate</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: onTimeRate >= 90 ? tokens.success : onTimeRate >= 70 ? tokens.warning : tokens.danger }}>
                  {onTimeRate}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{hubData?.onTime ?? 0} on time</div>
                <div style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{hubData?.late ?? 0} late</div>
                <div style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{hubData?.totalDispatches ?? 0} total</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => { setCapturedImage(null); setDestination(''); setWaybillRef(''); setProductName(''); setQuantity(''); setVehicleRef(''); setScheduledAt(''); setNotes(''); setStage('viewfinder') }}
              style={{ padding: '14px', background: `rgba(249,115,22,0.1)`, border: `1px solid rgba(249,115,22,0.3)`, borderRadius: 14, color: tokens.warning, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Scan Another
            </button>
            <button onClick={() => router.push('/factory')}
              style={{ padding: '14px', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', borderRadius: 14, color: '#e2e8f0', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Hub ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/factory')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
            <IconArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: tokens.warning }}>Dispatch</div>
            <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>Waybill scan &amp; on-time tracking</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>

        {/* On-time stats */}
        {!hubLoading && hubData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {/* On-time rate */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '14px', textAlign: 'center', gridColumn: 'span 3' }}>
              <div style={{ fontSize: 10, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Today's On-Time Rate</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: hubData.onTimeRate === null ? 'rgba(255,255,255,0.2)' : hubData.onTimeRate >= 90 ? tokens.success : hubData.onTimeRate >= 70 ? tokens.warning : tokens.danger }}>
                    {hubData.onTimeRate !== null ? `${hubData.onTimeRate}%` : '—'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 4 }}>
                    {hubData.withScheduleCount > 0 ? `${hubData.withScheduleCount} scheduled` : 'No scheduled dispatches'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.success }} />
                    <span style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{hubData.onTime} on time</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.danger }} />
                    <span style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{hubData.late} late</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pos-hint)' }} />
                    <span style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{hubData.totalDispatches} total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan CTA */}
        <button onClick={() => setStage('viewfinder')}
          style={{ width: '100%', marginBottom: 20, background: `linear-gradient(135deg, ${tokens.warning}, #ea580c)`, border: 'none', borderRadius: 18, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 8px 32px rgba(249,115,22,0.3)` }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
            <IconTruck size={26} />
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1.1 }}>Scan Waybill</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 3 }}>Photograph the delivery note before goods leave</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Recent dispatches */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Today's Dispatches</div>
          {hubLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, height: 68, animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          ) : !hubData || hubData.waybills.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 14, padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🚚</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No dispatches yet</div>
              <div style={{ fontSize: 13, color: 'var(--pos-hint)' }}>Scan the first waybill to start tracking</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hubData.waybills.map(w => {
                const isOnTime   = w.is_on_time
                const badgeColor = isOnTime === true ? tokens.success : isOnTime === false ? tokens.danger : 'rgba(255,255,255,0.25)'
                const badgeLabel = isOnTime === true ? 'On time' : isOnTime === false ? 'Late' : 'No sched.'
                return (
                  <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${isOnTime === false ? 'rgba(239,68,68,0.2)' : 'var(--pos-border)'}`, borderRadius: 14, padding: '12px 14px' }}>
                    {w.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={w.photo_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${badgeColor}40` }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(249,115,22,0.1)`, border: `1.5px solid rgba(249,115,22,0.3)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.warning }}>
                        <IconTruck size={18} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.destination}</div>
                      <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 2 }}>
                        {w.waybill_ref && `${w.waybill_ref} · `}
                        {w.vehicle_ref && `${w.vehicle_ref} · `}
                        {timeAgo(w.dispatched_at)}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, flexShrink: 0, background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30` }}>
                      {badgeLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 1 } }
      `}</style>
    </div>
  )
}
