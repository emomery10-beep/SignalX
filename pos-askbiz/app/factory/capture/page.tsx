'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

// ── Design tokens ────────────────────────────────────────────────────────────
const AMBER  = '#f59e0b'
const GREEN  = '#22c55e'
const RED    = '#ef4444'
const BLUE   = '#3b82f6'
const PURPLE = '#8b5cf6'

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'
type Stage = 'viewfinder' | 'confirm_type' | 'details' | 'success'

function buildTypes(tc: (key: string) => string): { id: CaptureType; label: string; color: string; bg: string; hint: string }[] {
  return [
    { id: 'intake',   label: tc('factory_capture.type_intake_label'),   color: BLUE,   bg: 'rgba(59,130,246,.15)',  hint: tc('factory_capture.type_intake_hint') },
    { id: 'output',   label: tc('factory_capture.type_output_label'),   color: GREEN,  bg: 'rgba(34,197,94,.15)',   hint: tc('factory_capture.type_output_hint') },
    { id: 'wastage',  label: tc('factory_capture.type_wastage_label'),  color: RED,    bg: 'rgba(239,68,68,.15)',   hint: tc('factory_capture.type_wastage_hint') },
    { id: 'dispatch', label: tc('factory_capture.type_dispatch_label'), color: PURPLE, bg: 'rgba(139,92,246,.15)',  hint: tc('factory_capture.type_dispatch_hint') },
  ]
}

const UNITS = ['kg', 'pcs', 'litres', 'boxes', 'tonnes', 'g', 'packs', 'pallets', 'bags']

const WASTAGE_REASON_KEYS = ['reason_damaged', 'reason_spoiled', 'reason_qc_reject', 'reason_machine_fault', 'reason_contamination', 'reason_overproduction', 'reason_other']

interface InventoryItem { id: string; name: string; unit: string | null }

// ── SVG icons ─────────────────────────────────────────────────────────────────
function IconCamera({ size = 28, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function IconCheck({ size = 28, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconArrowLeft({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}
function IconRotateCcw({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  )
}

export default function FactoryCapturePage() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const { tc } = useLang()
  const TYPES = buildTypes(tc)
  const WASTAGE_REASONS = WASTAGE_REASON_KEYS.map(k => tc('factory_capture.' + k))

  // Stage
  const [stage, setStage]       = useState<Stage>('viewfinder')
  const [captureType, setCaptureType] = useState<CaptureType | null>(null)

  // Camera
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn]       = useState(false)
  const [cameraErr, setCameraErr]     = useState('')
  const [photoUrl, setPhotoUrl]       = useState('')
  const [flashActive, setFlashActive] = useState(false)

  // Details form
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [product, setProduct]     = useState('')
  const [quantity, setQuantity]   = useState('')
  const [unit, setUnit]           = useState('kg')
  const [notes, setNotes]         = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')

  // ── Auth + inventory load ──────────────────────────────────────────────
  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/inventory', { headers: session.headers })
      .then(r => r.ok ? r.json() : { inventory: [] })
      .then(d => setInventory((d.inventory || []).slice(0, 60)))
      .catch(() => {})
    openCamera()
    return () => stopCamera()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, session])

  // Open camera as soon as ready
  useEffect(() => {
    if (authReady && session && stage === 'viewfinder') openCamera()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, session])

  // ── Camera ────────────────────────────────────────────────────────────────
  const openCamera = useCallback(async () => {
    setCameraErr('')
    // Stop any existing stream first
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
    } catch (err: any) {
      const denied = err?.name === 'NotAllowedError'
      setCameraErr(denied ? tc('factory_capture.camera_access_denied') : tc('factory_capture.camera_unavailable'))
      setCameraOn(false)
    }
  }, [tc])

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  function capture() {
    if (!canvasRef.current || !videoRef.current) return
    const v = videoRef.current
    const c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    const url = c.toDataURL('image/jpeg', 0.88)
    setPhotoUrl(url)
    // Flash animation
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 180)
    stopCamera()
    setStage('confirm_type')
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setPhotoUrl(ev.target?.result as string)
      stopCamera()
      setStage('confirm_type')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function retake() {
    setPhotoUrl('')
    setCaptureType(null)
    setStage('viewfinder')
    openCamera()
  }

  function proceedToDetails(t: CaptureType) {
    setCaptureType(t)
    setUnit(inventory.length > 0 ? (inventory[0].unit || 'kg') : 'kg')
    setStage('details')
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submit() {
    if (!captureType || !photoUrl || !session) return
    const resolvedNotes = captureType === 'wastage' ? selectedReason || notes.trim() : notes.trim()
    if (!product.trim()) { setSaveError(tc('factory_capture.error_select_product')); return }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) { setSaveError(tc('factory_capture.error_valid_quantity')); return }
    if (captureType === 'wastage' && !resolvedNotes) { setSaveError(tc('factory_capture.error_wastage_reason')); return }
    if (captureType === 'dispatch' && !notes.trim()) { setSaveError(tc('factory_capture.error_destination')); return }
    setSaving(true); setSaveError('')
    try {
      const res = await fetch('/api/pos/factory/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({
          type: captureType,
          image: photoUrl,
          product_name: product.trim(),
          quantity: Number(quantity),
          batch_ref: unit,
          notes: resolvedNotes || null,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error || tc('factory_capture.error_failed_save'))
        setSaving(false)
        return
      }
      setStage('success')
    } catch {
      setSaveError(tc('factory_capture.error_network'))
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setStage('viewfinder')
    setCaptureType(null)
    setPhotoUrl('')
    setProduct('')
    setQuantity('')
    setUnit('kg')
    setNotes('')
    setSelectedReason('')
    setSaveError('')
    openCamera()
  }

  // ── Numpad ────────────────────────────────────────────────────────────────
  function numpadPress(v: string) {
    setQuantity(prev => {
      if (v === '⌫') return prev.slice(0, -1)
      if (v === '.' && prev.includes('.')) return prev
      if (v === '.' && prev === '') return '0.'
      if (prev === '0' && v !== '.') return v
      return prev + v
    })
  }

  const selectedType = captureType ? TYPES.find(t => t.id === captureType)! : null

  if (!authReady || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(245,158,11,.3)', borderTopColor: AMBER, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN 1 — LIVE VIEWFINDER (fullscreen camera, type pills at bottom)
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'viewfinder') return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hidden inputs */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Live video */}
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Flash overlay */}
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flashActive ? 1 : 0, transition: 'opacity 60ms', pointerEvents: 'none' }} />

      {/* Corner grid guide (subtle) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
          <div key={v + h} style={{
            position: 'absolute', [v]: 80, [h]: 28,
            width: 28, height: 28,
            borderTop: v === 'top' ? '2px solid rgba(255,255,255,0.4)' : 'none',
            borderBottom: v === 'bottom' ? '2px solid rgba(255,255,255,0.4)' : 'none',
            borderLeft: h === 'left' ? '2px solid rgba(255,255,255,0.4)' : 'none',
            borderRight: h === 'right' ? '2px solid rgba(255,255,255,0.4)' : 'none',
          }} />
        ))}
      </div>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => router.push('/factory')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconArrowLeft size={18} />
        </button>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>{tc('factory_capture.viewfinder_title')}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
            {captureType ? tc('factory_capture.viewfinder_type_selected', { label: TYPES.find(t => t.id === captureType)!.label }) : tc('factory_capture.viewfinder_prompt')}
          </div>
        </div>
      </div>

      {/* Camera error state */}
      {cameraErr && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,68,68,.15)', border: '2px solid rgba(239,68,68,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCamera size={32} color={RED} />
          </div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, textAlign: 'center' }}>{cameraErr}</div>
          <button onClick={() => fileRef.current?.click()} style={{ background: AMBER, border: 'none', color: '#1a1206', padding: '14px 28px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>{tc('factory_capture.choose_photo_instead')}</button>
        </div>
      )}

      {/* Bottom controls */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 44px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
        {/* Type selector pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
          {TYPES.map(t => {
            const active = captureType === t.id
            return (
              <button key={t.id} onClick={() => setCaptureType(prev => prev === t.id ? null : t.id)}
                style={{ padding: '7px 16px', borderRadius: 24, border: `1.5px solid ${active ? t.color : 'rgba(255,255,255,0.25)'}`, background: active ? t.bg : 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', color: active ? t.color : 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Shutter row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          {/* Gallery fallback */}
          <button onClick={() => fileRef.current?.click()} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          {/* Shutter */}
          <button onClick={capture} disabled={!cameraOn}
            style={{ width: 76, height: 76, borderRadius: '50%', background: cameraOn ? '#fff' : 'rgba(255,255,255,0.3)', border: '4px solid rgba(255,255,255,0.4)', cursor: cameraOn ? 'pointer' : 'not-allowed', transition: 'transform 100ms, background 100ms', boxShadow: cameraOn ? '0 0 0 6px rgba(255,255,255,0.12)' : 'none' }}
            onMouseDown={e => { if (cameraOn) e.currentTarget.style.transform = 'scale(0.92)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          />
          {/* Placeholder for symmetry */}
          <div style={{ width: 48 }} />
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN 2 — CONFIRM TYPE (photo preview + 4 big type cards)
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'confirm_type') return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Top bar */}
      <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '48px 20px 14px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={retake} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconArrowLeft size={18} />
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{tc('factory_capture.confirm_title')}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{tc('factory_capture.confirm_subtitle')}</div>
        </div>
        <button onClick={retake} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13 }}>
          <IconRotateCcw size={14} /> {tc('factory_capture.retake')}
        </button>
      </div>

      {/* Photo strip */}
      {photoUrl && (
        <div style={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt={tc('factory_capture.photo_alt')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #0a0f1e)' }} />
          {/* Checkmark badge */}
          <div style={{ position: 'absolute', bottom: 12, right: 16, width: 32, height: 32, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 4px rgba(34,197,94,.25)` }}>
            <IconCheck size={16} />
          </div>
        </div>
      )}

      {/* Type cards */}
      <div style={{ flex: 1, padding: '20px 20px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => proceedToDetails(t.id)}
            style={{ background: t.bg, border: `1.5px solid ${t.color}50`, borderRadius: 18, padding: '28px 16px', cursor: 'pointer', textAlign: 'center', transition: 'transform 120ms, border-color 120ms', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.color}50` }}
          >
            {/* Coloured circle icon */}
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${t.color}20`, border: `2px solid ${t.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {t.id === 'intake'   && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round"><path d="M12 2v10M8 10l4 4 4-4"/><rect x="3" y="16" width="18" height="6" rx="1"/></svg>}
              {t.id === 'output'   && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round"><path d="M12 22V12M8 14l4-4 4 4"/><rect x="3" y="2" width="18" height="6" rx="1"/></svg>}
              {t.id === 'wastage'  && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>}
              {t.id === 'dispatch' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: t.color }}>{t.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>{t.hint}</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN 3 — DETAILS (quantity numpad + product + notes)
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'details' && selectedType) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '48px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setStage('confirm_type')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconArrowLeft size={18} />
        </button>
        {/* Photo thumb + type badge */}
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: `2px solid ${selectedType.color}60`, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{tc('factory_capture.details_title')}</div>
          <div style={{ fontSize: 12, marginTop: 1 }}>
            <span style={{ color: selectedType.color, fontWeight: 700 }}>{selectedType.label}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}> · {selectedType.hint}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* Product selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_capture.product_label')}</div>
          {inventory.length > 0 ? (
            <div style={{ position: 'relative' }}>
              <select
                value={product}
                onChange={e => setProduct(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${product ? selectedType.color + '60' : 'rgba(255,255,255,0.12)'}`, borderRadius: 12, color: product ? '#f1f5f9' : 'rgba(255,255,255,0.35)', padding: '14px 16px', fontSize: 15, cursor: 'pointer', appearance: 'none', outline: 'none' }}
              >
                <option value="">{tc('factory_capture.product_select_placeholder')}</option>
                {inventory.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                <option value="__other__">{tc('factory_capture.product_other_option')}</option>
              </select>
              <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          ) : null}
          {(product === '__other__' || inventory.length === 0) && (
            <input
              value={product === '__other__' ? '' : product}
              onChange={e => setProduct(e.target.value)}
              placeholder={tc('factory_capture.product_type_placeholder')}
              style={{ width: '100%', marginTop: inventory.length > 0 ? 8 : 0, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#f1f5f9', padding: '14px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          )}
        </div>

        {/* Quantity display */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_capture.quantity_label')}</div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${quantity ? selectedType.color + '60' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: quantity ? '#f1f5f9' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>{quantity || '0'}</span>
            {/* Unit pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 160 }}>
              {UNITS.slice(0, 5).map(u => (
                <button key={u} onClick={() => setUnit(u)} style={{ padding: '4px 10px', borderRadius: 20, border: `1.5px solid ${unit === u ? selectedType.color : 'rgba(255,255,255,0.15)'}`, background: unit === u ? `${selectedType.color}20` : 'transparent', color: unit === u ? selectedType.color : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: unit === u ? 700 : 400, cursor: 'pointer' }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(key => (
            <button key={key} onClick={() => numpadPress(key)}
              style={{ background: key === '⌫' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)', border: `1px solid ${key === '⌫' ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '16px 0', fontSize: key === '⌫' ? 18 : 22, fontWeight: 700, color: key === '⌫' ? RED : '#f1f5f9', cursor: 'pointer', transition: 'transform 80ms' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
              onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.93)' }}
              onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Wastage reason picker */}
        {captureType === 'wastage' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_capture.reason_label')} <span style={{ color: RED }}>*</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {WASTAGE_REASONS.map(r => (
                <button key={r} onClick={() => setSelectedReason(prev => prev === r ? '' : r)}
                  style={{ padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${selectedReason === r ? RED : 'rgba(255,255,255,0.15)'}`, background: selectedReason === r ? 'rgba(239,68,68,0.15)' : 'transparent', color: selectedReason === r ? RED : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: selectedReason === r ? 700 : 400, cursor: 'pointer' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dispatch destination */}
        {captureType === 'dispatch' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_capture.destination_label')} <span style={{ color: RED }}>*</span></div>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={tc('factory_capture.destination_placeholder')}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${notes ? PURPLE + '60' : 'rgba(255,255,255,0.12)'}`, borderRadius: 12, color: '#f1f5f9', padding: '14px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Optional notes for intake/output */}
        {(captureType === 'intake' || captureType === 'output') && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_capture.notes_label')} <span style={{ color: 'rgba(255,255,255,0.25)' }}>{tc('factory_capture.notes_optional')}</span></div>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={captureType === 'intake' ? tc('factory_capture.notes_intake_placeholder') : tc('factory_capture.notes_output_placeholder')}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#f1f5f9', padding: '14px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {saveError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: RED, fontSize: 13, marginBottom: 16 }}>{saveError}</div>
        )}

        {/* Submit */}
        <button onClick={submit} disabled={saving}
          style={{ width: '100%', background: saving ? 'rgba(255,255,255,0.1)' : selectedType.color, border: 'none', color: saving ? 'rgba(255,255,255,0.4)' : (captureType === 'output' || captureType === 'dispatch' ? '#fff' : '#1a1206'), padding: '16px', borderRadius: 14, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 17, transition: 'all 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {saving ? (
            <div style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <><IconCheck size={20} color={captureType === 'output' || captureType === 'dispatch' ? '#fff' : '#1a1206'} /> {tc('factory_capture.submit_prefix')} {selectedType.label}</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN 4 — SUCCESS
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'success' && selectedType) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      {/* Pulsing circle */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: `${selectedType.color}15`, position: 'absolute', inset: -16, animation: 'pulse 1.8s ease-out infinite' }} />
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: `${selectedType.color}25`, border: `3px solid ${selectedType.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <IconCheck size={44} color={selectedType.color} />
        </div>
      </div>

      <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{tc('factory_capture.success_title')}</div>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
        <span style={{ color: selectedType.color, fontWeight: 700 }}>{selectedType.label}</span>
        {quantity && ` · ${quantity} ${unit}`}
        {product && ` · ${product}`}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 40 }}>{tc('factory_capture.success_awaiting')}</div>

      {/* Photo preview */}
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 14, border: `2px solid ${selectedType.color}40`, marginBottom: 36 }} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <button onClick={reset}
          style={{ width: '100%', background: selectedType.color, border: 'none', color: captureType === 'output' || captureType === 'dispatch' ? '#fff' : '#1a1206', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>
          {tc('factory_capture.log_another')}
        </button>
        <button onClick={() => router.push('/factory')}
          style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '14px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
          {tc('factory_capture.back_to_hub')}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0% { opacity: 0.6; transform: scale(1); } 100% { opacity: 0; transform: scale(1.8); } }
      `}</style>
    </div>
  )

  return null
}
