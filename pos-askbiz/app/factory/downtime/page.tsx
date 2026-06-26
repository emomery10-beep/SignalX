'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

type Tc = (key: string, vars?: Record<string, string | number>) => string

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

type Stage = 'active_check' | 'viewfinder' | 'reason' | 'machine_name' | 'submitting' | 'success'
           | 'close_viewfinder' | 'close_success'

interface ActiveDowntime {
  id: string
  machine_name: string
  reason: string
  started_at: string
  start_photo_url: string
}

function buildReasons(tc: Tc): { id: string; label: string; icon: string; color: string }[] {
  return [
    { id: 'breakdown',          label: tc('factory_downtime.reason_breakdown'),          icon: '🔧', color: tokens.danger    },
    { id: 'changeover',         label: tc('factory_downtime.reason_changeover'),         icon: '🔄', color: tokens.warning  },
    { id: 'no_materials',       label: tc('factory_downtime.reason_no_materials'),       icon: '📦', color: tokens.warning  },
    { id: 'quality_hold',       label: tc('factory_downtime.reason_quality_hold'),       icon: '🚫', color: '#8b5cf6' },
    { id: 'planned_maintenance',label: tc('factory_downtime.reason_planned_maintenance'),icon: '🛠️', color: '#3b82f6' },
    { id: 'other',              label: tc('factory_downtime.reason_other'),              icon: '❓', color: '#64748b' },
  ]
}

function elapsedLabel(tc: Tc, iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1)  return tc('factory_downtime.elapsed_just_now')
  if (mins < 60) return tc('factory_downtime.elapsed_minutes', { count: mins })
  return tc('factory_downtime.elapsed_hours', { hours: Math.floor(mins / 60), mins: mins % 60 })
}

function IconArrowLeft({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
  )
}

export default function DowntimePage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [stage, setStage]         = useState<Stage>('active_check')
  const REASONS = buildReasons(tc)

  // Active downtime events (currently open)
  const [activeEvents, setActiveEvents]     = useState<ActiveDowntime[]>([])
  const [loadingActive, setLoadingActive]   = useState(true)

  // New downtime report
  const [photoUrl, setPhotoUrl]       = useState('')
  const [reason, setReason]           = useState('')
  const [machineName, setMachineName] = useState('')
  const [saveError, setSaveError]     = useState('')

  // Close-downtime flow
  const [closingEvent, setClosingEvent]     = useState<ActiveDowntime | null>(null)
  const [closePhotoUrl, setClosePhotoUrl]   = useState('')

  // Camera
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn]       = useState(false)
  const [cameraErr, setCameraErr]     = useState('')
  const [flashActive, setFlashActive] = useState(false)

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (!authReady || !session) return
    loadActive()
  }, [authReady, session])

  async function loadActive() {
    if (!session) return
    setLoadingActive(true)
    try {
      const r = await fetch('/api/pos/factory/downtime?active=true', { headers: session.headers })
      const d = r.ok ? await r.json() : { activeEvents: [] }
      setActiveEvents(d.activeEvents || [])
    } catch { /* silent */ } finally {
      setLoadingActive(false)
    }
  }

  // ── Camera ─────────────────────────────────────────────────────────────────
  const openCamera = useCallback(async () => {
    setCameraErr('')
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) }
      setCameraOn(true)
    } catch (err: any) {
      setCameraErr(err?.name === 'NotAllowedError' ? tc('factory_downtime.camera_access_denied') : tc('factory_downtime.camera_unavailable'))
      setCameraOn(false)
    }
  }, [tc])

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  function capturePhoto(target: 'start' | 'close') {
    if (!canvasRef.current || !videoRef.current) return
    const v = videoRef.current, c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    const url = c.toDataURL('image/jpeg', 0.88)
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 180)
    stopCamera()
    if (target === 'start') { setPhotoUrl(url); setStage('reason') }
    else                    { setClosePhotoUrl(url); submitClose(url) }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, target: 'start' | 'close') {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      if (target === 'start') { setPhotoUrl(url); setStage('reason') }
      else { setClosePhotoUrl(url); submitClose(url) }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Submit new downtime ────────────────────────────────────────────────────
  async function submitDowntime() {
    if (!photoUrl || !reason || !session) return
    setSaveError('')
    setStage('submitting')
    try {
      const res = await fetch('/api/pos/factory/downtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({
          machine_name: machineName.trim() || 'Machine',
          reason,
          image: photoUrl,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error || tc('factory_downtime.error_failed_submit'))
        setStage('machine_name')
        return
      }
      await loadActive()
      setStage('success')
    } catch {
      setSaveError(tc('factory_downtime.error_network'))
      setStage('machine_name')
    }
  }

  // ── Close existing downtime ────────────────────────────────────────────────
  async function submitClose(photo: string) {
    if (!closingEvent || !session) return
    setStage('submitting')
    try {
      const res = await fetch('/api/pos/factory/downtime', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({ id: closingEvent.id, image: photo }),
      })
      if (!res.ok) {
        setSaveError(tc('factory_downtime.error_failed_close'))
        setStage('active_check')
        return
      }
      await loadActive()
      setStage('close_success')
    } catch {
      setSaveError(tc('factory_downtime.error_network'))
      setStage('active_check')
    }
  }

  function resetAll() {
    setStage('active_check')
    setPhotoUrl(''); setReason(''); setMachineName(''); setSaveError('')
    setClosingEvent(null); setClosePhotoUrl('')
  }

  if (!authReady || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(239,68,68,.3)', borderTopColor: tokens.danger, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN: Active check — show currently open events + "Report new" button
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'active_check') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/factory')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: tokens.danger }}>{tc('factory_downtime.active_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>{tc('factory_downtime.active_subtitle')}</div>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
        {/* Report new downtime CTA */}
        <button onClick={() => { setStage('viewfinder'); openCamera() }}
          style={{ width: '100%', marginBottom: 24, background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: 18, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 32px rgba(239,68,68,0.3)', transition: 'transform 120ms' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>🔴</div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.1 }}>{tc('factory_downtime.active_report_cta_title')}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{tc('factory_downtime.active_report_cta_subtitle')}</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pos-muted)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Active events */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.danger, boxShadow: `0 0 0 3px rgba(239,68,68,0.25)`, animation: activeEvents.length > 0 ? 'pulse-dot 1.4s ease-in-out infinite' : 'none' }} />
            {tc('factory_downtime.active_currently_down')}
            {activeEvents.length > 0 && <span style={{ background: 'rgba(239,68,68,0.15)', color: tokens.danger, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{activeEvents.length}</span>}
          </div>

          {loadingActive ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, height: 72, animation: 'pulse-fade 1.6s ease-in-out infinite' }} />
          ) : activeEvents.length === 0 ? (
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: tokens.success }}>{tc('factory_downtime.active_all_running_title')}</div>
                <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{tc('factory_downtime.active_all_running_subtitle')}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeEvents.map(ev => {
                const r = REASONS.find(r => r.id === ev.reason)
                return (
                  <div key={ev.id} style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                      {ev.start_photo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ev.start_photo_url} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(239,68,68,0.4)' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--pos-ink)' }}>{ev.machine_name}</div>
                        <div style={{ fontSize: 12, color: tokens.danger, marginTop: 2 }}>{r?.icon} {r?.label || ev.reason}</div>
                        <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 3 }}>{tc('factory_downtime.active_down_for', { duration: elapsedLabel(tc, ev.started_at) })}</div>
                      </div>
                    </div>
                    {/* Close button */}
                    <button onClick={() => { setClosingEvent(ev); setStage('close_viewfinder'); openCamera() }}
                      style={{ width: '100%', background: tokens.success, border: 'none', color: '#fff', padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {tc('factory_downtime.active_close_event')}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {saveError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: tokens.danger, fontSize: 13 }}>{saveError}</div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.25) } 50% { box-shadow: 0 0 0 6px rgba(239,68,68,0.1) } }
        @keyframes pulse-fade { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }
      `}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN: Viewfinder — photograph the stopped machine
  // ══════════════════════════════════════════════════════════════════════════
  const isCloseFlow = stage === 'close_viewfinder'
  if (stage === 'viewfinder' || stage === 'close_viewfinder') return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        onChange={e => handleFile(e, isCloseFlow ? 'close' : 'start')} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flashActive ? 1 : 0, transition: 'opacity 60ms', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => { stopCamera(); setStage(isCloseFlow ? 'active_check' : 'active_check') }}
          style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            {isCloseFlow ? tc('factory_downtime.viewfinder_back_up_title', { machine: closingEvent?.machine_name || '' }) : tc('factory_downtime.viewfinder_down_title')}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
            {isCloseFlow ? tc('factory_downtime.viewfinder_back_up_subtitle') : tc('factory_downtime.viewfinder_down_subtitle')}
          </div>
        </div>
      </div>

      {/* Pulsing red indicator for "machine down" shoots */}
      {!isCloseFlow && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(239,68,68,0.7)', animation: 'ring-pulse 1.6s ease-out infinite' }} />
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, background: 'var(--pos-surface)', backdropFilter: 'blur(6px)', padding: '4px 12px', borderRadius: 20 }}>{tc('factory_downtime.viewfinder_frame_hint')}</div>
        </div>
      )}

      {/* Bottom shutter */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 48px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <button onClick={() => capturePhoto(isCloseFlow ? 'close' : 'start')} disabled={!cameraOn}
          style={{ width: 76, height: 76, borderRadius: '50%', background: isCloseFlow ? tokens.success : tokens.danger, border: `4px solid var(--pos-hint)`, cursor: cameraOn ? 'pointer' : 'not-allowed', boxShadow: `0 0 0 6px ${isCloseFlow ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, transition: 'transform 100ms' }}
          onMouseDown={e => { if (cameraOn) e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        />
        <div style={{ width: 48 }} />
      </div>

      {cameraErr && (
        <div style={{ position: 'absolute', bottom: 160, left: 20, right: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{tc('factory_downtime.viewfinder_camera_error', { error: cameraErr })}</div>
      )}

      <style>{`
        @keyframes ring-pulse { 0% { transform: scale(1); opacity: 0.8 } 100% { transform: scale(2.2); opacity: 0 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN: Reason picker — 6 icon cards
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'reason') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStage('active_check')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '2px solid rgba(239,68,68,0.5)', flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{tc('factory_downtime.reason_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>{tc('factory_downtime.reason_subtitle')}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {REASONS.map(r => (
          <button key={r.id} onClick={() => { setReason(r.id); setStage('machine_name') }}
            style={{ background: `${r.color}12`, border: `1.5px solid ${r.color}45`, borderRadius: 16, padding: '20px 12px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 100ms' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.94)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.94)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${r.color}18`, border: `2px solid ${r.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {r.icon}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: r.color, lineHeight: 1.2 }}>{r.label}</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN: Machine name + confirm
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'machine_name') {
    const selectedReason = REASONS.find(r => r.id === reason)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setStage('reason')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
            <IconArrowLeft />
          </button>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{tc('factory_downtime.machine_title')}</div>
            <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>
              {selectedReason?.icon} {selectedReason?.label}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 20px' }}>
          {/* Photo + reason summary */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
            {photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(239,68,68,0.5)', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginBottom: 4 }}>{tc('factory_downtime.machine_reason_label')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: selectedReason?.color }}>{selectedReason?.icon} {selectedReason?.label}</div>
            </div>
          </div>

          {/* Machine name input */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_downtime.machine_name_label')} <span style={{ color: 'rgba(255,255,255,0.25)' }}>{tc('factory_downtime.machine_name_optional')}</span></div>
            <input
              value={machineName}
              onChange={e => setMachineName(e.target.value)}
              placeholder={tc('factory_downtime.machine_name_placeholder')}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${machineName ? 'rgba(239,68,68,0.5)' : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '16px', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
            />
            {/* Quick name pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {[
                { value: 'Mixer',    label: tc('factory_downtime.machine_pill_mixer') },
                { value: 'Cutter',   label: tc('factory_downtime.machine_pill_cutter') },
                { value: 'Press',    label: tc('factory_downtime.machine_pill_press') },
                { value: 'Conveyor', label: tc('factory_downtime.machine_pill_conveyor') },
                { value: 'Packer',   label: tc('factory_downtime.machine_pill_packer') },
                { value: 'Boiler',   label: tc('factory_downtime.machine_pill_boiler') },
              ].map(n => (
                <button key={n.value} onClick={() => setMachineName(n.value)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: machineName === n.value ? 'rgba(239,68,68,0.15)' : 'transparent', color: machineName === n.value ? tokens.danger : 'var(--pos-muted)', fontSize: 13, cursor: 'pointer' }}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {saveError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: tokens.danger, fontSize: 13, marginBottom: 16 }}>{saveError}</div>
          )}

          <button onClick={submitDowntime}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', color: '#fff', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 17, boxShadow: '0 4px 20px rgba(239,68,68,0.3)' }}>
            {tc('factory_downtime.machine_report_button')}
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN: Submitting spinner
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'submitting') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 48, height: 48, border: `4px solid rgba(239,68,68,0.3)`, borderTopColor: tokens.danger, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{tc('factory_downtime.submitting_label')}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SCREEN: Success
  // ══════════════════════════════════════════════════════════════════════════
  const isCloseSuccess = stage === 'close_success'
  if (stage === 'success' || stage === 'close_success') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ width: 128, height: 128, borderRadius: '50%', background: isCloseSuccess ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', position: 'absolute', top: -16, left: -16 }} />
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: isCloseSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `3px solid ${isCloseSuccess ? tokens.success : tokens.danger}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 44 }}>
          {isCloseSuccess ? '✅' : '🔴'}
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
        {isCloseSuccess ? tc('factory_downtime.success_back_up_title') : tc('factory_downtime.success_down_title')}
      </div>
      <div style={{ fontSize: 14, color: 'var(--pos-muted)', marginBottom: 4 }}>
        {isCloseSuccess ? tc('factory_downtime.success_back_up_subtitle') : tc('factory_downtime.success_down_subtitle')}
      </div>
      <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginBottom: 40 }}>
        {isCloseSuccess ? tc('factory_downtime.success_back_up_oee') : tc('factory_downtime.success_down_oee')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        {!isCloseSuccess && (
          <button onClick={() => { resetAll(); setStage('active_check') }}
            style={{ width: '100%', background: tokens.danger, border: 'none', color: '#fff', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>
            {tc('factory_downtime.success_report_another')}
          </button>
        )}
        <button onClick={() => router.push('/factory')}
          style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', color: 'var(--pos-muted)', padding: '14px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
          {tc('factory_downtime.success_back_to_hub')}
        </button>
      </div>
    </div>
  )

  return null
}
