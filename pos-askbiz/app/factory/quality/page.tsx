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

type Stage = 'viewfinder' | 'defect_type' | 'severity' | 'details' | 'submitting' | 'success'

function buildDefectTypes(tc: Tc): { id: string; label: string; icon: string; hint: string; color: string }[] {
  return [
    { id: 'dimensional',    label: tc('factory_quality.defect_dimensional_label'),    icon: '📐', hint: tc('factory_quality.defect_dimensional_hint'),    color: tokens.intake   },
    { id: 'surface',        label: tc('factory_quality.defect_surface_label'),        icon: '🔍', hint: tc('factory_quality.defect_surface_hint'),        color: tokens.warning  },
    { id: 'contamination',  label: tc('factory_quality.defect_contamination_label'),  icon: '⚠️', hint: tc('factory_quality.defect_contamination_hint'),  color: tokens.danger    },
    { id: 'assembly',       label: tc('factory_quality.defect_assembly_label'),       icon: '🔩', hint: tc('factory_quality.defect_assembly_hint'),       color: tokens.dispatch },
    { id: 'packaging',      label: tc('factory_quality.defect_packaging_label'),      icon: '📦', hint: tc('factory_quality.defect_packaging_hint'),      color: '#0ea5e9' },
    { id: 'other',          label: tc('factory_quality.defect_other_label'),          icon: '❓', hint: tc('factory_quality.defect_other_hint'),          color: '#64748b' },
  ]
}

function buildSeverities(tc: Tc): { id: string; label: string; icon: string; desc: string; color: string }[] {
  return [
    { id: 'critical', label: tc('factory_quality.severity_critical_label'), icon: '🔴', desc: tc('factory_quality.severity_critical_desc'), color: tokens.danger   },
    { id: 'major',    label: tc('factory_quality.severity_major_label'),    icon: '🟠', desc: tc('factory_quality.severity_major_desc'),    color: tokens.warning },
    { id: 'minor',    label: tc('factory_quality.severity_minor_label'),    icon: '🟡', desc: tc('factory_quality.severity_minor_desc'),    color: '#eab308' },
  ]
}

function IconArrowLeft({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
}

export default function QualityPage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [stage, setStage]   = useState<Stage>('viewfinder')
  const DEFECT_TYPES = buildDefectTypes(tc)
  const SEVERITIES = buildSeverities(tc)

  // Captured data
  const [photoUrl, setPhotoUrl]             = useState('')
  const [defectType, setDefectType]         = useState('')
  const [severity, setSeverity]             = useState('')
  const [qty, setQty]                       = useState('')
  const [productName, setProductName]       = useState('')
  const [notes, setNotes]                   = useState('')
  const [saveError, setSaveError]           = useState('')

  // Camera
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn]         = useState(false)
  const [cameraErr, setCameraErr]       = useState('')
  const [flashActive, setFlashActive]   = useState(false)

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (authReady && session && stage === 'viewfinder') openCamera()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, session])

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
      setCameraErr(err?.name === 'NotAllowedError' ? tc('factory_quality.camera_access_denied') : tc('factory_quality.camera_unavailable'))
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
    setPhotoUrl(url)
    setStage('defect_type')
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setPhotoUrl(ev.target?.result as string); setStage('defect_type') }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function submitDefect() {
    if (!photoUrl || !defectType || !severity || !session) return
    setSaveError('')
    setStage('submitting')
    try {
      const res = await fetch('/api/pos/factory/quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({
          defect_type: defectType,
          severity,
          image: photoUrl,
          product_name: productName.trim() || undefined,
          quantity_affected: qty ? parseFloat(qty) : undefined,
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error || tc('factory_quality.error_failed_submit'))
        setStage('details')
        return
      }
      setStage('success')
    } catch {
      setSaveError(tc('factory_quality.error_network'))
      setStage('details')
    }
  }

  function reset() {
    setStage('viewfinder')
    setPhotoUrl(''); setDefectType(''); setSeverity(''); setQty(''); setProductName(''); setNotes(''); setSaveError('')
    openCamera()
  }

  if (!authReady || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(239,68,68,.3)`, borderTopColor: tokens.danger, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ── VIEWFINDER ─────────────────────────────────────────────────────────────
  if (stage === 'viewfinder') return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flashActive ? 1 : 0, transition: 'opacity 60ms', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => { stopCamera(); router.push('/factory') }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <IconArrowLeft />
        </button>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{tc('factory_quality.viewfinder_title')}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{tc('factory_quality.viewfinder_subtitle')}</div>
        </div>
      </div>

      {/* Crosshair guide */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 120, height: 120, pointerEvents: 'none' }}>
        {[['0,0','20px,0','0,20px'],['right 0,0','calc(100% - 20px) 0,100% 0,100% 20px'],['0,bottom','0,calc(100% - 20px),20px 100%,0 100%'],['right bottom','calc(100% - 20px) 100%,100% 100%,100% calc(100% - 20px)']].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 24, height: 24,
            top: i < 2 ? 0 : 'auto', bottom: i >= 2 ? 0 : 'auto',
            left: i % 2 === 0 ? 0 : 'auto', right: i % 2 === 1 ? 0 : 'auto',
            borderTop: i < 2 ? '2px solid var(--pos-muted)' : 'none',
            borderBottom: i >= 2 ? '2px solid var(--pos-muted)' : 'none',
            borderLeft: i % 2 === 0 ? '2px solid var(--pos-muted)' : 'none',
            borderRight: i % 2 === 1 ? '2px solid var(--pos-muted)' : 'none',
          }} />
        ))}
      </div>

      {/* Bottom shutter */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 48px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <button onClick={capturePhoto} disabled={!cameraOn}
          style={{ width: 76, height: 76, borderRadius: '50%', background: tokens.danger, border: '4px solid var(--pos-hint)', cursor: cameraOn ? 'pointer' : 'not-allowed', boxShadow: '0 0 0 6px rgba(239,68,68,0.2)', transition: 'transform 100ms' }}
          onMouseDown={e => { if (cameraOn) e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        />
        <div style={{ width: 48 }} />
      </div>

      {cameraErr && (
        <div style={{ position: 'absolute', bottom: 160, left: 20, right: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>
          {tc('factory_quality.viewfinder_camera_error', { error: cameraErr })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ── DEFECT TYPE ────────────────────────────────────────────────────────────
  if (stage === 'defect_type') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setStage('viewfinder'); openCamera() }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
          <IconArrowLeft />
        </button>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '2px solid rgba(239,68,68,0.5)', flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{tc('factory_quality.defect_type_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>{tc('factory_quality.defect_type_subtitle')}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {DEFECT_TYPES.map(d => (
          <button key={d.id} onClick={() => { setDefectType(d.id); setStage('severity') }}
            style={{ background: `${d.color}12`, border: `1.5px solid ${d.color}45`, borderRadius: 16, padding: '18px 10px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 100ms' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.94)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${d.color}18`, border: `2px solid ${d.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {d.icon}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: d.color, lineHeight: 1.2 }}>{d.label}</div>
            <div style={{ fontSize: 10, color: 'var(--pos-hint)', lineHeight: 1.3 }}>{d.hint}</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── SEVERITY ───────────────────────────────────────────────────────────────
  if (stage === 'severity') {
    const selectedDefect = DEFECT_TYPES.find(d => d.id === defectType)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setStage('defect_type')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
            <IconArrowLeft />
          </button>
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: `2px solid ${selectedDefect?.color || tokens.danger}80`, flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{tc('factory_quality.severity_title')}</div>
            <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 1 }}>
              {selectedDefect?.icon} {selectedDefect?.label}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SEVERITIES.map(s => (
            <button key={s.id} onClick={() => { setSeverity(s.id); setStage('details') }}
              style={{ background: `${s.color}10`, border: `1.5px solid ${s.color}40`, borderRadius: 16, padding: '20px 18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 100ms' }}
              onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${s.color}15`, border: `2px solid ${s.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: s.color }}>{s.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{s.desc}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`${s.color}60`} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── DETAILS ────────────────────────────────────────────────────────────────
  if (stage === 'details') {
    const selectedDefect   = DEFECT_TYPES.find(d => d.id === defectType)
    const selectedSeverity = SEVERITIES.find(s => s.id === severity)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--pos-surface)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pos-border)', padding: '44px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setStage('severity')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>
            <IconArrowLeft />
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: `1.5px solid ${selectedSeverity?.color || tokens.danger}60`, flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{tc('factory_quality.details_title')}</div>
              <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 1 }}>
                {selectedDefect?.icon} {selectedDefect?.label} · {selectedSeverity?.icon} {selectedSeverity?.label}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {/* Qty affected */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {tc('factory_quality.details_qty_label')} <span style={{ color: 'rgba(255,255,255,0.2)' }}>{tc('factory_quality.details_optional')}</span>
            </div>
            <input value={qty} onChange={e => setQty(e.target.value)} type="number" inputMode="decimal" placeholder={tc('factory_quality.details_qty_placeholder')}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${qty ? 'rgba(239,68,68,0.5)' : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '14px 16px', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Product name */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {tc('factory_quality.details_product_label')} <span style={{ color: 'rgba(255,255,255,0.2)' }}>{tc('factory_quality.details_optional')}</span>
            </div>
            <input value={productName} onChange={e => setProductName(e.target.value)} placeholder={tc('factory_quality.details_product_placeholder')}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${productName ? 'rgba(239,68,68,0.4)' : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '14px 16px', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {tc('factory_quality.details_notes_label')} <span style={{ color: 'rgba(255,255,255,0.2)' }}>{tc('factory_quality.details_optional')}</span>
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={tc('factory_quality.details_notes_placeholder')} rows={3}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${notes ? 'rgba(239,68,68,0.4)' : 'var(--pos-border)'}`, borderRadius: 12, color: 'var(--pos-ink)', padding: '14px 16px', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
          </div>

          {saveError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: tokens.danger, fontSize: 13, marginBottom: 16 }}>{saveError}</div>
          )}

          {/* CTA — colour matches severity */}
          <button onClick={submitDefect}
            style={{ width: '100%', background: `linear-gradient(135deg, ${selectedSeverity?.color || tokens.danger}, ${selectedSeverity?.id === 'critical' ? '#dc2626' : selectedSeverity?.id === 'major' ? '#d97706' : '#ca8a04'})`, border: 'none', color: '#fff', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 17, boxShadow: `0 4px 20px ${selectedSeverity?.color || tokens.danger}40` }}>
            {selectedSeverity?.icon} {tc('factory_quality.details_log_cta', { severity: selectedSeverity?.label || '' })}
          </button>
        </div>
      </div>
    )
  }

  // ── SUBMITTING ─────────────────────────────────────────────────────────────
  if (stage === 'submitting') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 48, height: 48, border: `4px solid rgba(239,68,68,.3)`, borderTopColor: tokens.danger, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{tc('factory_quality.submitting_label')}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (stage === 'success') {
    const selectedSeverity = SEVERITIES.find(s => s.id === severity)
    const selectedDefect   = DEFECT_TYPES.find(d => d.id === defectType)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', color: 'var(--pos-ink)', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ position: 'relative', marginBottom: 24 }}>
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" style={{ width: 120, height: 120, borderRadius: 20, objectFit: 'cover', border: `3px solid ${selectedSeverity?.color || tokens.danger}`, boxShadow: `0 0 40px ${selectedSeverity?.color || tokens.danger}30` }} />
          )}
          <div style={{ position: 'absolute', bottom: -10, right: -10, width: 36, height: 36, borderRadius: '50%', background: 'var(--pos-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {selectedSeverity?.icon}
          </div>
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{tc('factory_quality.success_title')}</div>
        <div style={{ fontSize: 14, color: 'var(--pos-muted)', marginBottom: 4 }}>
          {selectedDefect?.icon} {selectedDefect?.label} · {selectedSeverity?.label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginBottom: 36 }}>
          {selectedSeverity?.id === 'critical' ? tc('factory_quality.success_critical_note') : tc('factory_quality.success_saved_note')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          <button onClick={reset}
            style={{ width: '100%', background: selectedSeverity?.color || tokens.danger, border: 'none', color: '#fff', padding: '15px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>
            {tc('factory_quality.success_log_another')}
          </button>
          <button onClick={() => router.push('/factory')}
            style={{ width: '100%', background: 'var(--pos-border)', border: '1px solid var(--pos-border)', color: 'var(--pos-muted)', padding: '13px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {tc('factory_quality.success_back_to_hub')}
          </button>
        </div>
      </div>
    )
  }

  return null
}
