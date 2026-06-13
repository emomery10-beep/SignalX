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
  intake:  'var(--factory-intake)',
  output:  'var(--factory-output)',
  wastage: 'var(--factory-wastage)',
  dispatch: 'var(--factory-dispatch)',
}

type Stage = 'hub' | 'viewfinder' | 'batch_ref' | 'checkpoint' | 'submitting' | 'success'

interface BatchEvent { id: string; checkpoint: string; photo_url: string; created_at: string }
interface Batch {
  id: string; batch_ref: string; product_name: string | null
  status: string; updated_at: string; events: BatchEvent[]
}

const CHECKPOINTS: { id: string; label: string; icon: string; color: string; hint: string }[] = [
  { id: 'intake',      label: 'Intake',      icon: '📥', color: tokens.intake,   hint: 'Raw materials arrived'     },
  { id: 'in_progress', label: 'In Progress', icon: '⚙️', color: tokens.warning,  hint: 'Currently being processed' },
  { id: 'qc_pass',     label: 'QC Pass',     icon: '✅', color: tokens.success,  hint: 'Quality check passed'      },
  { id: 'qc_fail',     label: 'QC Fail',     icon: '❌', color: tokens.danger,    hint: 'Quality check failed'      },
  { id: 'dispatch',    label: 'Dispatch',    icon: '🚚', color: tokens.dispatch, hint: 'Shipped out'               },
]

const CP_COLOR: Record<string, string> = {
  intake: tokens.intake, in_progress: tokens.warning, qc_pass: tokens.success, qc_fail: tokens.danger, dispatch: tokens.dispatch,
}
const CP_LABEL: Record<string, string> = {
  intake: 'Intake', in_progress: 'In Progress', qc_pass: 'QC Pass', qc_fail: 'QC Fail', dispatch: 'Dispatch',
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function IconArrowLeft({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
}

export default function BatchPage() {
  const router  = useRouter()
  const supabase = createClient()
  const [ready, setReady]   = useState(false)
  const [stage, setStage]   = useState<Stage>('hub')

  // Hub data
  const [batches, setBatches]       = useState<Batch[]>([])
  const [batchLoading, setBatchLoading] = useState(true)

  // Scan flow state
  const [photoUrl, setPhotoUrl]         = useState('')
  const [batchRef, setBatchRef]         = useState('')
  const [productName, setProductName]   = useState('')
  const [checkpoint, setCheckpoint]     = useState('')
  const [saveError, setSaveError]       = useState('')
  const [successBatch, setSuccessBatch] = useState<Batch | null>(null)

  // Camera
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn]         = useState(false)
  const [cameraErr, setCameraErr]       = useState('')
  const [flashActive, setFlashActive]   = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
    })
    return () => stopCamera()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { if (ready) loadBatches() }, [ready])

  async function loadBatches() {
    setBatchLoading(true)
    try {
      const r = await fetch(`${API}/api/pos/factory/batch?status=active&limit=30`)
      const d = r.ok ? await r.json() : { batches: [] }
      setBatches(d.batches || [])
    } catch { /* silent */ } finally { setBatchLoading(false) }
  }

  // ── Camera ──────────────────────────────────────────────────────────────────
  const openCamera = useCallback(async () => {
    setCameraErr('')
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setCameraOn(true)
    } catch (err: any) {
      setCameraErr(err?.name === 'NotAllowedError' ? 'Camera access denied' : 'Camera unavailable')
      setCameraOn(false)
    }
  }, [])

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  function capturePhoto() {
    if (!canvasRef.current || !videoRef.current) return
    const v = videoRef.current, c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 180)
    stopCamera()
    setPhotoUrl(c.toDataURL('image/jpeg', 0.88))
    setStage('batch_ref')
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setPhotoUrl(ev.target?.result as string); setStage('batch_ref') }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Submit scan ─────────────────────────────────────────────────────────────
  async function submitScan() {
    if (!photoUrl || !batchRef.trim() || !checkpoint) return
    setSaveError('')
    setStage('submitting')
    try {
      const res = await fetch(`${API}/api/pos/factory/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_ref:        batchRef.trim(),
          checkpoint,
          image:            photoUrl,
          product_name:     productName.trim() || undefined,
          create_if_missing: true,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error || 'Failed to submit')
        setStage('checkpoint')
        return
      }
      const d = await res.json()
      setSuccessBatch(d.batch)
      await loadBatches()
      setStage('success')
    } catch {
      setSaveError('Network error — try again')
      setStage('checkpoint')
    }
  }

  function reset() {
    setPhotoUrl(''); setBatchRef(''); setProductName(''); setCheckpoint(''); setSaveError(''); setSuccessBatch(null)
    setStage('viewfinder')
    openCamera()
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(6,182,212,.3)`, borderTopColor: tokens.dispatch, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // HUB — active batches + scan CTA
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'hub') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/factory')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: tokens.dispatch }}>Batch Traceability</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>Scan labels at every checkpoint</div>
        </div>
        <button onClick={loadBatches} style={{ marginLeft: 'auto', width: 36, height: 36, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
        </button>
      </div>

      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
        {/* Scan CTA */}
        <button onClick={() => { setStage('viewfinder'); openCamera() }}
          style={{ width: '100%', marginBottom: 24, background: `linear-gradient(135deg, ${tokens.dispatch}, #0891b2)`, border: 'none', borderRadius: 18, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 8px 32px rgba(6,182,212,0.3)`, transition: 'transform 120ms' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>
            📷
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.1 }}>Scan Batch Label</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>Photograph to log a checkpoint</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pos-muted)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Active batches */}
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          Active Batches
          {batches.length > 0 && (
            <span style={{ background: `rgba(6,182,212,0.15)`, color: tokens.dispatch, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{batches.length}</span>
          )}
        </div>

        {batchLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : batches.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>📦</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>No active batches</div>
            <div style={{ fontSize: 13, color: 'var(--pos-hint)' }}>Scan a batch label to start tracking</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {batches.map(b => {
              const latest = b.events?.[b.events.length - 1]
              const latestColor = latest ? (CP_COLOR[latest.checkpoint] || 'var(--pos-hint)') : 'var(--pos-hint)'
              return (
                <div key={b.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--pos-border)', borderRadius: 14, padding: '14px 16px', cursor: 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: b.events?.length > 0 ? 12 : 0 }}>
                    {/* Latest photo */}
                    {latest?.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={latest.photo_url} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${latestColor}50` }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1.5px solid var(--pos-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--pos-ink)' }}>{b.batch_ref}</div>
                      {b.product_name && <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{b.product_name}</div>}
                      {latest && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: latestColor, background: `${latestColor}18`, border: `1px solid ${latestColor}30`, padding: '2px 8px', borderRadius: 20 }}>
                            {CP_LABEL[latest.checkpoint] || latest.checkpoint}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--pos-hint)' }}>{timeAgo(latest.created_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo trail dots */}
                  {b.events?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {b.events.map((ev, idx) => {
                        const c = CP_COLOR[ev.checkpoint] || 'var(--pos-hint)'
                        return (
                          <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {idx > 0 && <div style={{ width: 12, height: 1, background: 'rgba(255,255,255,0.1)' }} />}
                            <div style={{ width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${c}70`, flexShrink: 0 }}>
                              {ev.photo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={ev.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', background: `${c}20` }} />
                              )}
                            </div>
                          </div>
                        )
                      })}
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>{b.events.length} scan{b.events.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }
      `}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // VIEWFINDER
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'viewfinder') return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flashActive ? 1 : 0, transition: 'opacity 60ms', pointerEvents: 'none' }} />

      {/* Top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => { stopCamera(); setStage('hub') }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Scan Batch Label</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>Frame the batch label or packaging</div>
        </div>
      </div>

      {/* Bracket guide — wider for labels */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', width: 240, height: 140, pointerEvents: 'none' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute', width: 28, height: 28,
            top: i < 2 ? 0 : 'auto', bottom: i >= 2 ? 0 : 'auto',
            left: i % 2 === 0 ? 0 : 'auto', right: i % 2 === 1 ? 0 : 'auto',
            borderTop: i < 2 ? `2px solid ${tokens.dispatch}` : 'none',
            borderBottom: i >= 2 ? `2px solid ${tokens.dispatch}` : 'none',
            borderLeft: i % 2 === 0 ? `2px solid ${tokens.dispatch}` : 'none',
            borderRight: i % 2 === 1 ? `2px solid ${tokens.dispatch}` : 'none',
          }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, border: `1px solid rgba(6,182,212,0.2)`, borderRadius: 4 }} />
      </div>

      {/* Shutter */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 48px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <button onClick={capturePhoto} disabled={!cameraOn}
          style={{ width: 76, height: 76, borderRadius: '50%', background: tokens.dispatch, border: '4px solid var(--pos-hint)', cursor: cameraOn ? 'pointer' : 'not-allowed', boxShadow: `0 0 0 6px rgba(6,182,212,0.2)`, transition: 'transform 100ms' }}
          onMouseDown={e => { if (cameraOn) e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        />
        <div style={{ width: 48 }} />
      </div>

      {cameraErr && (
        <div style={{ position: 'absolute', bottom: 160, left: 20, right: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>
          {cameraErr} — use gallery instead
        </div>
      )}
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // BATCH REF — confirm / enter batch ID
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'batch_ref') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setStage('viewfinder'); openCamera() }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', border: `2px solid ${tokens.dispatch}60`, flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Batch ID</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>Enter or confirm the batch reference</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 20px' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Batch Reference *</div>
          <input value={batchRef} onChange={e => setBatchRef(e.target.value.toUpperCase())}
            placeholder="e.g. LOT-2024-001, BATCH-A3"
            autoFocus
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${batchRef ? tokens.dispatch : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '16px', fontSize: 18, fontWeight: 700, outline: 'none', boxSizing: 'border-box', letterSpacing: '0.04em', fontFamily: 'monospace' }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Product <span style={{ color: 'rgba(255,255,255,0.2)' }}>(optional)</span>
          </div>
          <input value={productName} onChange={e => setProductName(e.target.value)}
            placeholder="e.g. Wheat Flour 50kg"
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${productName ? `${tokens.dispatch}60` : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '14px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <button onClick={() => { if (batchRef.trim()) setStage('checkpoint') }} disabled={!batchRef.trim()}
          style={{ width: '100%', background: batchRef.trim() ? `linear-gradient(135deg, ${tokens.dispatch}, #0891b2)` : 'var(--pos-border)', border: 'none', color: batchRef.trim() ? '#fff' : 'var(--pos-hint)', padding: '16px', borderRadius: 14, cursor: batchRef.trim() ? 'pointer' : 'not-allowed', fontWeight: 800, fontSize: 17, boxShadow: batchRef.trim() ? `0 4px 20px rgba(6,182,212,0.3)` : 'none' }}>
          Next — Select Checkpoint →
        </button>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // CHECKPOINT PICKER
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'checkpoint') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStage('batch_ref')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', border: `1.5px solid ${tokens.dispatch}50`, flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Where is it now?</div>
          <div style={{ fontSize: 11, color: tokens.dispatch, marginTop: 1, fontFamily: 'monospace', fontWeight: 700 }}>{batchRef}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CHECKPOINTS.map(cp => (
          <button key={cp.id} onClick={() => { setCheckpoint(cp.id); submitScan() }}
            style={{ background: `${cp.color}10`, border: `1.5px solid ${cp.color}40`, borderRadius: 16, padding: '18px 18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 100ms' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${cp.color}15`, border: `2px solid ${cp.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {cp.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: cp.color }}>{cp.label}</div>
              <div style={{ fontSize: 13, color: 'var(--pos-hint)', marginTop: 2 }}>{cp.hint}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`${cp.color}60`} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}

        {saveError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: tokens.danger, fontSize: 13 }}>{saveError}</div>
        )}
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SUBMITTING
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'submitting') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 48, height: 48, border: `4px solid rgba(6,182,212,.3)`, borderTopColor: tokens.dispatch, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Logging scan…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SUCCESS — photo trail
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'success' && successBatch) {
    const cpMeta = CHECKPOINTS.find(c => c.id === checkpoint)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>{cpMeta?.icon}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Scan logged</div>
        <div style={{ fontSize: 14, color: 'var(--pos-muted)', marginBottom: 2 }}>
          <span style={{ color: tokens.dispatch, fontFamily: 'monospace', fontWeight: 700 }}>{successBatch.batch_ref}</span> → <span style={{ color: cpMeta?.color }}>{cpMeta?.label}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginBottom: 32 }}>
          {successBatch.events?.length} scan{successBatch.events?.length !== 1 ? 's' : ''} in trail
        </div>

        {/* Photo trail */}
        {successBatch.events?.length > 0 && (
          <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 360 }}>
            {successBatch.events.map((ev, idx) => {
              const c = CP_COLOR[ev.checkpoint] || 'var(--pos-hint)'
              return (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {idx > 0 && <div style={{ width: 20, height: 1.5, background: `rgba(255,255,255,0.15)`, flexShrink: 0 }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', border: `2px solid ${c}`, flexShrink: 0, boxShadow: idx === successBatch.events.length - 1 ? `0 0 16px ${c}60` : 'none' }}>
                      {ev.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ev.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: `${c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                          {CHECKPOINTS.find(cp => cp.id === ev.checkpoint)?.icon}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 9, color: c, fontWeight: 700 }}>{CP_LABEL[ev.checkpoint]}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          <button onClick={reset}
            style={{ width: '100%', background: `linear-gradient(135deg, ${tokens.dispatch}, #0891b2)`, border: 'none', color: '#fff', padding: '15px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 15, boxShadow: `0 4px 20px rgba(6,182,212,0.3)` }}>
            Scan Another Batch
          </button>
          <button onClick={() => router.push('/factory')}
            style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', color: 'var(--pos-muted)', padding: '13px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Back to Hub
          </button>
        </div>
      </div>
    )
  }

  return null
}
