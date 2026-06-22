'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

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
  dispatch: 'var(--factory-dispatch)',
}

type Stage = 'hub' | 'start_viewfinder' | 'shift_name' | 'end_viewfinder' | 'submitting' | 'start_success' | 'end_success'

interface Shift {
  id: string
  shift_name: string
  custom_name: string | null
  start_photo_url: string
  end_photo_url: string | null
  started_at: string
  ended_at: string | null
  duration_minutes: number | null
  target_units: number | null
  actual_output?: number
  live_output?: number
  status: string
  started_by_staff?: { id: string; name: string } | null
}

function buildShiftNames(tc: (key: string) => string): { id: string; label: string; icon: string; hours: string; color: string }[] {
  return [
    { id: 'Morning',   label: tc('factory_shift.shift_morning'),   icon: '🌅', hours: tc('factory_shift.hours_morning'),   color: tokens.warning },
    { id: 'Afternoon', label: tc('factory_shift.shift_afternoon'), icon: '🌤️', hours: tc('factory_shift.hours_afternoon'), color: tokens.intake  },
    { id: 'Night',     label: tc('factory_shift.shift_night'),     icon: '🌙', hours: tc('factory_shift.hours_night'),     color: '#6366f1' },
    { id: 'Custom',    label: tc('factory_shift.shift_custom'),    icon: '⚙️', hours: tc('factory_shift.hours_custom'),    color: tokens.success  },
  ]
}

function autoDetectShift() {
  const h = new Date().getHours()
  if (h >= 6  && h < 14) return 'Morning'
  if (h >= 14 && h < 22) return 'Afternoon'
  return 'Night'
}

function elapsed(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60), m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function IconArrowLeft({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
}

export default function ShiftPage() {
  const router  = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const SHIFT_NAMES = buildShiftNames(tc)
  const [stage, setStage] = useState<Stage>('hub')

  // Data
  const [activeShift, setActiveShift]   = useState<Shift | null>(null)
  const [recentShifts, setRecentShifts] = useState<Shift[]>([])
  const [dataLoading, setDataLoading]   = useState(true)

  // New shift form
  const [shiftName, setShiftName]       = useState(autoDetectShift())
  const [customName, setCustomName]     = useState('')
  const [targetUnits, setTargetUnits]   = useState('')
  const [startPhoto, setStartPhoto]     = useState('')
  const [endPhoto, setEndPhoto]         = useState('')
  const [saveError, setSaveError]       = useState('')
  const [completedShift, setCompletedShift] = useState<Shift | null>(null)

  // Camera
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef   = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn]       = useState(false)
  const [cameraErr, setCameraErr]     = useState('')
  const [flashActive, setFlashActive] = useState(false)
  const captureTargetRef = useRef<'start' | 'end'>('start')

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (authReady && session) loadData()
  }, [authReady, session])

  const loadData = useCallback(async () => {
    if (!session) return
    setDataLoading(true)
    try {
      const r = await fetch('/api/pos/factory/shift', { headers: session.headers })
      const d = r.ok ? await r.json() : {}
      setActiveShift(d.activeShift || null)
      setRecentShifts(d.recentShifts || [])
    } catch { /* silent */ } finally { setDataLoading(false) }
  }, [session])

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
      setCameraErr(err?.name === 'NotAllowedError' ? tc('factory_shift.camera_access_denied') : tc('factory_shift.camera_unavailable'))
      setCameraOn(false)
    }
  }, [tc])

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
    const url = c.toDataURL('image/jpeg', 0.88)
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 180)
    stopCamera()
    if (captureTargetRef.current === 'start') {
      setStartPhoto(url); setStage('shift_name')
    } else {
      setEndPhoto(url); submitEndShift(url)
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      if (captureTargetRef.current === 'start') {
        setStartPhoto(url); setStage('shift_name')
      } else {
        setEndPhoto(url); submitEndShift(url)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Start shift ─────────────────────────────────────────────────────────────
  async function submitStartShift() {
    if (!startPhoto || !shiftName || !session) return
    setSaveError('')
    setStage('submitting')
    try {
      const res = await fetch('/api/pos/factory/shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({
          shift_name:   shiftName,
          custom_name:  shiftName === 'Custom' ? customName.trim() : undefined,
          image:        startPhoto,
          target_units: targetUnits ? parseFloat(targetUnits) : undefined,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error || tc('factory_shift.error_start_shift'))
        setStage('shift_name')
        // If a shift is already active, reload to show it
        if (res.status === 409) { await loadData(); setStage('hub') }
        return
      }
      await loadData()
      setStage('start_success')
    } catch {
      setSaveError(tc('factory_shift.error_network'))
      setStage('shift_name')
    }
  }

  // ── End shift ───────────────────────────────────────────────────────────────
  async function submitEndShift(photo: string) {
    if (!activeShift || !session) return
    setSaveError('')
    setStage('submitting')
    try {
      const res = await fetch('/api/pos/factory/shift', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({ id: activeShift.id, image: photo }),
      })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error || tc('factory_shift.error_end_shift'))
        setStage('hub')
        return
      }
      const d = await res.json()
      setCompletedShift(d.shift)
      await loadData()
      setStage('end_success')
    } catch {
      setSaveError(tc('factory_shift.error_network'))
      setStage('hub')
    }
  }

  function resetForm() {
    setStartPhoto(''); setEndPhoto(''); setCustomName(''); setTargetUnits(''); setSaveError(''); setCompletedShift(null)
    setShiftName(autoDetectShift())
  }

  if (!authReady || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(20,184,166,.3)`, borderTopColor: tokens.success, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // HUB
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'hub') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/factory')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: tokens.success }}>{tc('factory_shift.header_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>{tc('factory_shift.header_subtitle')}</div>
        </div>
        <button onClick={loadData} style={{ marginLeft: 'auto', width: 36, height: 36, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
        </button>
      </div>

      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>

        {/* ── Active shift card ─────────────────────────────────────────────── */}
        {dataLoading ? (
          <div style={{ height: 140, borderRadius: 18, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite', marginBottom: 20 }} />
        ) : activeShift ? (
          <div style={{ marginBottom: 20, background: `linear-gradient(135deg, rgba(20,184,166,0.12), rgba(20,184,166,0.05))`, border: '1.5px solid rgba(20,184,166,0.4)', borderRadius: 18, overflow: 'hidden' }}>
            {/* Start photo strip */}
            <div style={{ display: 'flex', gap: 0 }}>
              {activeShift.start_photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeShift.start_photo_url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.success, boxShadow: '0 0 0 3px rgba(34,197,94,0.25)', animation: 'pulse-dot 1.4s ease-in-out infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: tokens.success }}>{tc('factory_shift.active_label')}</span>
                  <span style={{ fontSize: 11, color: 'var(--pos-hint)', marginLeft: 'auto' }}>{elapsed(activeShift.started_at)}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  {SHIFT_NAMES.find(s => s.id === activeShift.shift_name)?.icon} {activeShift.custom_name || activeShift.shift_name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>
                  {tc('factory_shift.started_at_by').replace('{time}', fmtTime(activeShift.started_at)).replace('{name}', activeShift.started_by_staff?.name || tc('factory_shift.default_worker'))}
                </div>
              </div>
            </div>

            {/* Live output */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{tc('factory_shift.output_so_far')}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.success }}>
                  {(activeShift.live_output || 0).toLocaleString()}
                  {activeShift.target_units && (
                    <span style={{ fontSize: 13, color: 'var(--pos-hint)', fontWeight: 500, marginLeft: 6 }}>{tc('factory_shift.target_suffix').replace('{target}', activeShift.target_units.toLocaleString())}</span>
                  )}
                </div>
              </div>
              {/* Progress bar if target set */}
              {activeShift.target_units && activeShift.target_units > 0 && (() => {
                const pct = Math.min((activeShift.live_output || 0) / activeShift.target_units * 100, 100)
                const color = pct >= 90 ? tokens.success : pct >= 60 ? tokens.warning : tokens.danger
                return (
                  <div style={{ flex: 1, marginLeft: 16 }}>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 600ms ease' }} />
                    </div>
                    <div style={{ fontSize: 10, color, textAlign: 'right', marginTop: 3 }}>{pct.toFixed(0)}%</div>
                  </div>
                )
              })()}
            </div>

            {/* End shift button */}
            <div style={{ padding: '0 16px 16px' }}>
              <button onClick={() => { captureTargetRef.current = 'end'; setStage('end_viewfinder'); openCamera() }}
                style={{ width: '100%', background: 'linear-gradient(135deg, #14b8a6, #0f766e)', border: 'none', color: '#fff', padding: '14px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {tc('factory_shift.end_shift_button')}
              </button>
            </div>
          </div>
        ) : (
          /* No active shift — start CTA */
          <button onClick={() => { captureTargetRef.current = 'start'; setStage('start_viewfinder'); openCamera() }}
            style={{ width: '100%', marginBottom: 20, background: `linear-gradient(135deg, ${tokens.success}, #0f766e)`, border: 'none', borderRadius: 18, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 8px 32px rgba(20,184,166,0.3)`, transition: 'transform 120ms' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>📷</div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.1 }}>{tc('factory_shift.start_shift_title')}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{tc('factory_shift.start_shift_subtitle')}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pos-muted)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}

        {saveError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: tokens.danger, fontSize: 13, marginBottom: 16 }}>{saveError}</div>
        )}

        {/* Recent shifts */}
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tc('factory_shift.recent_shifts')}</div>
        {dataLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ height: 72, borderRadius: 14, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />)}
          </div>
        ) : recentShifts.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏱️</div>
            <div style={{ fontSize: 13, color: 'var(--pos-hint)' }}>{tc('factory_shift.no_completed_shifts')}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentShifts.map(s => {
              const meta = SHIFT_NAMES.find(n => n.id === s.shift_name)
              const target = s.target_units
              const actual = s.actual_output ?? 0
              const hitTarget = target ? actual >= target : null
              const color = hitTarget === true ? tokens.success : hitTarget === false ? tokens.danger : tokens.success
              return (
                <div key={s.id} style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--pos-border)', borderRadius: 14, padding: '12px 14px', alignItems: 'flex-start' }}>
                  {/* Photos */}
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                    {s.start_photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.start_photo_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1.5px solid var(--pos-border)' }} />
                    )}
                    {s.end_photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.end_photo_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: `1.5px solid ${color}60` }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {meta?.icon} {s.custom_name || s.shift_name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 2 }}>
                      {fmtDate(s.started_at)} · {fmtTime(s.started_at)}–{s.ended_at ? fmtTime(s.ended_at) : '?'}
                      {s.duration_minutes != null && ` · ${Math.round(s.duration_minutes)}m`}
                    </div>
                    {target != null && (
                      <div style={{ fontSize: 11, color, marginTop: 3, fontWeight: 600 }}>
                        {tc('factory_shift.units_vs_target').replace('{actual}', actual.toLocaleString()).replace('{target}', target.toLocaleString()).replace('{mark}', hitTarget ? '✓' : '✗')}
                      </div>
                    )}
                    {target == null && actual > 0 && (
                      <div style={{ fontSize: 11, color: tokens.success, marginTop: 3 }}>{tc('factory_shift.units_produced').replace('{actual}', actual.toLocaleString())}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: s.status === 'completed' ? 'rgba(34,197,94,0.12)' : 'var(--pos-border)', color: s.status === 'completed' ? tokens.success : 'var(--pos-hint)', flexShrink: 0 }}>
                    {s.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes pulse   { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.25) } 50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.1) } }
      `}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // VIEWFINDERS (start / end)
  // ══════════════════════════════════════════════════════════════════════════
  const isEndFlow = stage === 'end_viewfinder'
  if (stage === 'start_viewfinder' || stage === 'end_viewfinder') return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flashActive ? 1 : 0, transition: 'opacity 60ms', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => { stopCamera(); setStage('hub') }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            {isEndFlow ? tc('factory_shift.viewfinder_end_title') : tc('factory_shift.viewfinder_start_title')}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
            {isEndFlow ? tc('factory_shift.viewfinder_end_subtitle') : tc('factory_shift.viewfinder_start_subtitle')}
          </div>
        </div>
      </div>

      {/* Contextual overlay label */}
      <div style={{ position: 'absolute', bottom: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '6px 16px', fontSize: 12, color: 'var(--pos-muted)', border: `1px solid rgba(20,184,166,0.3)` }}>
          {isEndFlow ? tc('factory_shift.overlay_end') : tc('factory_shift.overlay_start')}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 48px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <button onClick={capturePhoto} disabled={!cameraOn}
          style={{ width: 76, height: 76, borderRadius: '50%', background: tokens.success, border: '4px solid var(--pos-hint)', cursor: cameraOn ? 'pointer' : 'not-allowed', boxShadow: `0 0 0 6px rgba(20,184,166,0.2)`, transition: 'transform 100ms' }}
          onMouseDown={e => { if (cameraOn) e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        />
        <div style={{ width: 48 }} />
      </div>

      {cameraErr && (
        <div style={{ position: 'absolute', bottom: 160, left: 20, right: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>
          {tc('factory_shift.camera_err_gallery').replace('{error}', cameraErr)}
        </div>
      )}
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SHIFT NAME + CONFIRM
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'shift_name') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setStage('start_viewfinder'); openCamera() }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        {startPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={startPhoto} alt="" style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', border: `2px solid ${tokens.success}60`, flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{tc('factory_shift.which_shift')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>{tc('factory_shift.set_shift_type')}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {/* Shift name pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {SHIFT_NAMES.map(s => (
            <button key={s.id} onClick={() => setShiftName(s.id)}
              style={{ background: shiftName === s.id ? `${s.color}20` : 'rgba(255,255,255,0.05)', border: `1.5px solid ${shiftName === s.id ? s.color : 'rgba(255,255,255,0.1)'}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 120ms' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: shiftName === s.id ? s.color : '#e2e8f0' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 2 }}>{s.hours}</div>
            </button>
          ))}
        </div>

        {/* Custom name input */}
        {shiftName === 'Custom' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('factory_shift.shift_name_label')}</div>
            <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder={tc('factory_shift.custom_name_placeholder')}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${customName ? tokens.success : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '14px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        {/* Target units (optional) */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {tc('factory_shift.target_output_label')} <span style={{ color: 'rgba(255,255,255,0.2)' }}>{tc('factory_shift.optional_suffix')}</span>
          </div>
          <input value={targetUnits} onChange={e => setTargetUnits(e.target.value)} type="number" inputMode="numeric" placeholder={tc('factory_shift.target_units_placeholder')}
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${targetUnits ? `${tokens.success}60` : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '14px 16px', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 6 }}>{tc('factory_shift.target_units_hint')}</div>
        </div>

        {saveError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: tokens.danger, fontSize: 13, marginBottom: 16 }}>{saveError}</div>
        )}

        <button onClick={submitStartShift}
          style={{ width: '100%', background: `linear-gradient(135deg, ${tokens.success}, #0f766e)`, border: 'none', color: '#fff', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 17, boxShadow: `0 4px 20px rgba(20,184,166,0.3)` }}>
          {tc('factory_shift.start_shift_named').replace('{name}', shiftName === 'Custom' ? (customName || tc('factory_shift.shift_custom')) : (SHIFT_NAMES.find(s => s.id === shiftName)?.label || shiftName))}
        </button>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // SUBMITTING
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'submitting') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 48, height: 48, border: `4px solid rgba(20,184,166,.3)`, borderTopColor: tokens.success, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{tc('factory_shift.saving')}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // START SUCCESS
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'start_success') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      {startPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={startPhoto} alt="" style={{ width: 120, height: 120, borderRadius: 20, objectFit: 'cover', border: `3px solid ${tokens.success}`, boxShadow: `0 0 40px rgba(20,184,166,0.3)`, marginBottom: 20 }} />
      )}
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{tc('factory_shift.shift_started')}</div>
      <div style={{ fontSize: 14, color: 'var(--pos-muted)', marginBottom: 4 }}>
        {SHIFT_NAMES.find(s => s.id === shiftName)?.icon} {tc('factory_shift.shift_now_active').replace('{name}', customName || (SHIFT_NAMES.find(s => s.id === shiftName)?.label || shiftName))}
      </div>
      {targetUnits && (
        <div style={{ fontSize: 12, color: tokens.success, marginBottom: 4 }}>{tc('factory_shift.target_units_label').replace('{target}', Number(targetUnits).toLocaleString())}</div>
      )}
      <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginBottom: 36 }}>{tc('factory_shift.floor_photographed')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
        <button onClick={() => router.push('/factory/capture')}
          style={{ width: '100%', background: `linear-gradient(135deg, ${tokens.success}, #0f766e)`, border: 'none', color: '#fff', padding: '15px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>
          {tc('factory_shift.log_production')}
        </button>
        <button onClick={() => { resetForm(); setStage('hub') }}
          style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', color: 'var(--pos-muted)', padding: '13px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          {tc('factory_shift.back_to_hub_full')}
        </button>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // END SUCCESS
  // ══════════════════════════════════════════════════════════════════════════
  if (stage === 'end_success' && completedShift) {
    const target = completedShift.target_units
    const actual = completedShift.actual_output ?? 0
    const hitTarget = target ? actual >= target : null
    const resultColor = hitTarget === true ? tokens.success : hitTarget === false ? tokens.danger : tokens.success
    const durMins = completedShift.duration_minutes ? Math.round(completedShift.duration_minutes) : null
    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        {/* Before / after photos */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
          {completedShift.start_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={completedShift.start_photo_url} alt={tc('factory_shift.alt_start')} style={{ width: 90, height: 90, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', opacity: 0.7 }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.2)' }} />
            {durMins != null && <div style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{durMins}m</div>}
          </div>
          {completedShift.end_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={completedShift.end_photo_url} alt={tc('factory_shift.alt_end')} style={{ width: 90, height: 90, borderRadius: 14, objectFit: 'cover', border: `2px solid ${resultColor}`, boxShadow: `0 0 24px ${resultColor}40` }} />
          )}
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{tc('factory_shift.shift_complete')}</div>

        {/* Output vs target */}
        <div style={{ fontSize: 28, fontWeight: 800, color: resultColor, marginBottom: 4 }}>
          {tc('factory_shift.units_count').replace('{actual}', actual.toLocaleString())}
        </div>
        {target && (
          <div style={{ fontSize: 13, color: 'var(--pos-hint)', marginBottom: 4 }}>
            {hitTarget ? tc('factory_shift.target_met') : tc('factory_shift.below_target')} {tc('factory_shift.target_goal').replace('{target}', target.toLocaleString())}
          </div>
        )}
        {durMins != null && (
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginBottom: 32 }}>
            {tc('factory_shift.duration_label').replace('{duration}', (Math.floor(durMins / 60) > 0 ? Math.floor(durMins / 60) + 'h ' : '') + (durMins % 60) + 'm')}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          <button onClick={() => { resetForm(); captureTargetRef.current = 'start'; setStage('start_viewfinder'); openCamera() }}
            style={{ width: '100%', background: `linear-gradient(135deg, ${tokens.success}, #0f766e)`, border: 'none', color: '#fff', padding: '15px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>
            {tc('factory_shift.start_next_shift')}
          </button>
          <button onClick={() => { resetForm(); setStage('hub') }}
            style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', color: 'var(--pos-muted)', padding: '13px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {tc('factory_shift.back_to_hub')}
          </button>
        </div>
      </div>
    )
  }

  return null
}
