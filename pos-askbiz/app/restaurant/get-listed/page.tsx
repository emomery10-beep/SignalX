'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import { compressImageToDataUrl } from '@/lib/pos-image-compress'

// ── Design tokens (match the POS dark theme / factory-capture language) ──────
const BG     = '#0a0f1e'
const ACCENT = '#f59e0b'
const GREEN  = '#22c55e'
const RED    = '#ef4444'
// 0.6 (not 0.45) so muted text clears WCAG AA (~4.5:1) on the dark ground.
const MUTED  = 'rgba(255,255,255,0.6)'

type Stage = 'intro' | 'shoot' | 'reading' | 'review' | 'saving' | 'gauge'
interface MenuItem { name: string; price: number; description?: string | null }

// ── SVG icons ────────────────────────────────────────────────────────────────
function IconCamera({ size = 28, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function IconCheck({ size = 28, color = '#fff' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function IconArrowLeft({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
}
function IconPlus({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
function IconUndo({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
}

export default function GetListedPage() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const { tc, fmtNumber } = useLang()

  const [stage, setStage] = useState<Stage>('intro')

  // Camera
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef   = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn]   = useState(false)
  const [cameraErr, setCameraErr] = useState('')
  const [photoUrl, setPhotoUrl]   = useState('')
  const [flash, setFlash]         = useState(false)

  // Menu
  const [items, setItems]       = useState<MenuItem[]>([])
  const [editIdx, setEditIdx]   = useState<number | null>(null)
  const [priceBuf, setPriceBuf] = useState('')
  const [saveError, setSaveError] = useState('')

  // Undo for an accidental item delete (no re-typing to recover)
  const [undo, setUndo] = useState<{ item: MenuItem; index: number } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Readiness (from save response)
  const [readiness, setReadiness] = useState<Record<string, any> | null>(null)

  // Honour the OS reduced-motion setting for the gauge fill.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    setReduceMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }, [])

  const openCamera = useCallback(async () => {
    setCameraErr('')
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) }
      setCameraOn(true)
    } catch {
      setCameraErr(tc('onboarding_listing.camera_denied'))
      setCameraOn(false)
    }
  }, [tc])

  useEffect(() => () => { stopCamera(); if (undoTimer.current) clearTimeout(undoTimer.current) }, [stopCamera])

  function startShoot() { setStage('shoot'); openCamera() }

  async function readMenu(dataUrl: string) {
    setPhotoUrl(dataUrl)
    setFlash(true); setTimeout(() => setFlash(false), 180)
    stopCamera()
    setStage('reading')
    try {
      const res = await fetch('/api/pos/restaurant/menu/from-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.headers || {}) },
        body: JSON.stringify({ image: dataUrl }),
      })
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setItems([])
    }
    setStage('review')
  }

  async function capture() {
    if (!canvasRef.current || !videoRef.current) return
    const v = videoRef.current, c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    readMenu(await compressImageToDataUrl(c, { maxEdge: 1600, quality: 0.82 }))
  }
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    try { readMenu(await compressImageToDataUrl(file, { maxEdge: 1600, quality: 0.82 })) } catch {}
    e.target.value = ''
  }
  function retake() { setPhotoUrl(''); setItems([]); setStage('shoot'); openCamera() }

  // Price numpad
  function openPrice(i: number) { setEditIdx(i); setPriceBuf(items[i].price ? String(items[i].price) : '') }
  function pricePress(k: string) {
    setPriceBuf(prev => {
      if (k === '⌫') return prev.slice(0, -1)
      if (k === '.' && prev.includes('.')) return prev
      if (prev === '0' && k !== '.') return k
      return prev + k
    })
  }
  function priceDone() {
    if (editIdx === null) return
    setItems(prev => prev.map((it, i) => i === editIdx ? { ...it, price: Number(priceBuf) || 0 } : it))
    setEditIdx(null); setPriceBuf('')
  }
  function setName(i: number, name: string) { setItems(prev => prev.map((it, idx) => idx === i ? { ...it, name } : it)) }
  function removeItem(i: number) {
    setUndo({ item: items[i], index: i })
    setItems(prev => prev.filter((_, idx) => idx !== i))
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setUndo(null), 6000)
  }
  function undoRemove() {
    if (!undo) return
    setItems(prev => { const next = [...prev]; next.splice(Math.min(undo.index, next.length), 0, undo.item); return next })
    setUndo(null)
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }
  function addItem() { setItems(prev => [...prev, { name: '', price: 0 }]) }

  async function saveMenu() {
    const clean = items.filter(it => it.name.trim())
    if (clean.length === 0) { retake(); return }
    setStage('saving'); setSaveError('')
    try {
      const res = await fetch('/api/pos/restaurant/menu/from-photo/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.headers || {}) },
        body: JSON.stringify({ image: photoUrl, items: clean }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); setSaveError(d.error || tc('onboarding_listing.save_error')); setStage('review'); return }
      const data = await res.json()
      setReadiness(data.readiness || null)
      setStage('gauge')
    } catch {
      setSaveError(tc('onboarding_listing.save_error')); setStage('review')
    }
  }

  // ── Loading / auth gate ──────────────────────────────────────────────────
  if (!authReady || !session) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(245,158,11,.3)', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ══ SCREEN: INTRO ═════════════════════════════════════════════════════════
  if (stage === 'intro') return (
    <div style={{ minHeight: '100dvh', background: BG, color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center' }}>
      <button onClick={() => router.push('/restaurant')} style={{ position: 'absolute', top: 44, left: 20, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconArrowLeft size={18} />
      </button>
      <div style={{ width: 116, height: 116, borderRadius: '50%', background: `${ACCENT}18`, border: `2px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <IconCamera size={52} color={ACCENT} />
      </div>
      <div style={{ fontSize: 27, fontWeight: 800, marginBottom: 12, maxWidth: 320, lineHeight: 1.15 }}>{tc('onboarding_listing.intro_title')}</div>
      <div style={{ fontSize: 16, color: MUTED, marginBottom: 40, maxWidth: 300, lineHeight: 1.4 }}>{tc('onboarding_listing.intro_sub')}</div>
      <button onClick={startShoot}
        style={{ width: '100%', maxWidth: 340, background: ACCENT, border: 'none', color: '#1a1206', padding: '18px', borderRadius: 16, cursor: 'pointer', fontWeight: 800, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }} onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}>
        <IconCamera size={24} color="#1a1206" /> {tc('onboarding_listing.intro_start')}
      </button>
    </div>
  )

  // ══ SCREEN: SHOOT (fullscreen camera) ═════════════════════════════════════
  if (stage === 'shoot') return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flash ? 1 : 0, transition: 'opacity 60ms', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => { stopCamera(); setStage('intro') }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconArrowLeft size={18} />
        </button>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, lineHeight: 1 }}>{tc('onboarding_listing.shoot_title')}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 3 }}>{tc('onboarding_listing.shoot_hint')}</div>
        </div>
      </div>

      {cameraErr && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,68,68,.15)', border: '2px solid rgba(239,68,68,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCamera size={32} color={RED} /></div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, textAlign: 'center', maxWidth: 260 }}>{cameraErr}</div>
          <button onClick={() => fileRef.current?.click()} style={{ background: ACCENT, border: 'none', color: '#1a1206', padding: '15px 30px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>{tc('onboarding_listing.shoot_gallery')}</button>
        </div>
      )}

      {/* Shutter */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 46px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <button onClick={capture} disabled={!cameraOn}
          style={{ width: 82, height: 82, borderRadius: '50%', background: cameraOn ? '#fff' : 'rgba(255,255,255,0.3)', border: '5px solid rgba(255,255,255,0.4)', cursor: cameraOn ? 'pointer' : 'not-allowed', boxShadow: cameraOn ? '0 0 0 6px rgba(255,255,255,0.12)' : 'none', transition: 'transform 100ms' }}
          onMouseDown={e => { if (cameraOn) e.currentTarget.style.transform = 'scale(0.92)' }} onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }} />
        <div style={{ width: 52 }} />
      </div>
    </div>
  )

  // ══ SCREEN: READING (AI extraction spinner) ═══════════════════════════════
  if (stage === 'reading' || stage === 'saving') return (
    <div style={{ minHeight: '100dvh', background: BG, color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 18, border: `2px solid ${ACCENT}40`, marginBottom: 28, opacity: 0.85 }} />
      )}
      <div style={{ width: 40, height: 40, border: '4px solid rgba(245,158,11,.25)', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginBottom: 20 }} />
      <div style={{ fontSize: 18, fontWeight: 700 }}>{tc(stage === 'saving' ? 'onboarding_listing.saving' : 'onboarding_listing.reading')}</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ══ SCREEN: REVIEW (extracted items, tap price to edit) ═══════════════════
  if (stage === 'review') return (
    <div style={{ minHeight: '100dvh', background: BG, color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '48px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={retake} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconArrowLeft size={18} /></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{tc('onboarding_listing.review_title')}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{tc('onboarding_listing.review_hint')}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 120px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: MUTED }}>
            <div style={{ fontSize: 15, marginBottom: 20 }}>{tc('onboarding_listing.review_empty')}</div>
            <button onClick={retake} style={{ background: ACCENT, border: 'none', color: '#1a1206', padding: '14px 28px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>{tc('onboarding_listing.retake')}</button>
          </div>
        )}

        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 12px', marginBottom: 10 }}>
            <input value={it.name} onChange={e => setName(i, e.target.value)} placeholder={tc('onboarding_listing.item_name_placeholder')} aria-label={tc('onboarding_listing.item_name_placeholder')}
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', color: '#f1f5f9', fontSize: 17, fontWeight: 600, outline: 'none' }} />
            <button onClick={() => openPrice(i)} aria-label={tc('onboarding_listing.price_title')}
              style={{ background: it.price ? `${GREEN}18` : 'rgba(255,255,255,0.06)', border: `1.5px solid ${it.price ? GREEN + '55' : 'rgba(255,255,255,0.15)'}`, borderRadius: 12, padding: '10px 14px', minHeight: 44, cursor: 'pointer', color: it.price ? GREEN : MUTED, fontWeight: 800, fontSize: 18, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {it.price ? fmtNumber(it.price) : tc('onboarding_listing.set_price')}
            </button>
            <button onClick={() => removeItem(i)} aria-label={tc('onboarding_listing.delete_item')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', color: RED, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, lineHeight: 1 }}>×</button>
          </div>
        ))}

        {items.length > 0 && (
          <button onClick={addItem} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', border: '1.5px dashed rgba(255,255,255,0.2)', borderRadius: 14, padding: '14px', cursor: 'pointer', color: MUTED, fontWeight: 600, fontSize: 15, marginTop: 4 }}>
            <IconPlus size={18} color={MUTED} /> {tc('onboarding_listing.add_item')}
          </button>
        )}
      </div>

      {undo && (
        <div style={{ position: 'fixed', bottom: 98, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 12, background: '#1c2436', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: '8px 8px 8px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.45)', zIndex: 40 }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 15, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tc('onboarding_listing.removed')}{undo.item.name ? ` · ${undo.item.name}` : ''}</span>
          <button onClick={undoRemove} style={{ display: 'flex', alignItems: 'center', gap: 6, background: ACCENT, border: 'none', color: '#1a1206', padding: '11px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
            <IconUndo size={16} color="#1a1206" /> {tc('onboarding_listing.undo')}
          </button>
        </div>
      )}

      {saveError && <div style={{ position: 'fixed', bottom: 152, left: 16, right: 16, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 14, textAlign: 'center' }}>{saveError}</div>}

      {items.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 16px 28px', background: 'linear-gradient(to top, #0a0f1e 70%, transparent)' }}>
          <button onClick={saveMenu}
            style={{ width: '100%', background: GREEN, border: 'none', color: '#052e16', padding: '17px', borderRadius: 16, cursor: 'pointer', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <IconCheck size={22} color="#052e16" /> {tc('onboarding_listing.review_confirm')}
          </button>
        </div>
      )}

      {/* Price numpad sheet */}
      {editIdx !== null && (
        <div onClick={priceDone} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#131a2c', borderRadius: '20px 20px 0 0', padding: '20px 16px 28px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center', color: MUTED, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{tc('onboarding_listing.price_title')}</div>
            <div style={{ textAlign: 'center', fontSize: 44, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, fontVariantNumeric: 'tabular-nums', minHeight: 52 }}>{priceBuf || '0'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
              {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
                <button key={k} onClick={() => pricePress(k)}
                  style={{ background: k === '⌫' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${k === '⌫' ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '18px 0', fontSize: 24, fontWeight: 700, color: k === '⌫' ? RED : '#f1f5f9', cursor: 'pointer' }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)' }} onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}>{k}</button>
              ))}
            </div>
            <button onClick={priceDone} style={{ width: '100%', background: ACCENT, border: 'none', color: '#1a1206', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 17 }}>{tc('onboarding_listing.price_done')}</button>
          </div>
        </div>
      )}
    </div>
  )

  // ══ SCREEN: GAUGE (readiness) ═════════════════════════════════════════════
  const score = readiness?.readiness_score ?? 0
  const GATES = [
    { key: 'gate_menu', label: tc('onboarding_listing.gate_menu') },
    { key: 'gate_id', label: tc('onboarding_listing.gate_id') },
    { key: 'gate_payout', label: tc('onboarding_listing.gate_payout') },
    { key: 'gate_permit', label: tc('onboarding_listing.gate_permit') },
    { key: 'gate_health', label: tc('onboarding_listing.gate_health') },
    { key: 'gate_food_handler', label: tc('onboarding_listing.gate_food_handler') },
  ]
  const R = 84, C = 2 * Math.PI * R
  return (
    <div style={{ minHeight: '100dvh', background: BG, color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '48px 20px 8px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => router.push('/restaurant')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconArrowLeft size={18} /></button>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{tc('onboarding_listing.gauge_title')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Ring gauge */}
        <div style={{ position: 'relative', width: 200, height: 200, margin: '12px 0 8px' }}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
            <circle cx="100" cy="100" r={R} fill="none" stroke={score >= 100 ? GREEN : ACCENT} strokeWidth="16" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (C * score) / 100} style={{ transition: reduceMotion ? 'none' : 'stroke-dashoffset 700ms ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{score}%</div>
            {score >= 100 && <div style={{ color: GREEN, fontSize: 14, fontWeight: 700, marginTop: 4 }}>{tc('onboarding_listing.gauge_ready')}</div>}
          </div>
        </div>

        {/* Gate list */}
        <div style={{ width: '100%', maxWidth: 380, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GATES.map(g => {
            const st = readiness?.[g.key]
            const done = st === 'confirmed' || st === 'not_applicable'
            return (
              <div key={g.key} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', border: `1px solid ${done ? GREEN + '40' : 'rgba(255,255,255,0.1)'}`, borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: done ? GREEN : 'rgba(255,255,255,0.08)', border: done ? 'none' : '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done && <IconCheck size={16} color="#052e16" />}
                </div>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: done ? '#f1f5f9' : 'rgba(255,255,255,0.6)' }}>{g.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: done ? GREEN : MUTED }}>{tc(done ? 'onboarding_listing.status_done' : 'onboarding_listing.status_todo')}</div>
              </div>
            )
          })}
        </div>

        <button onClick={() => router.push('/restaurant')}
          style={{ width: '100%', maxWidth: 380, marginTop: 24, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9', padding: '16px', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>
          {tc('onboarding_listing.back')}
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
