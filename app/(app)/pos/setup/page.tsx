'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

// ── AskBiz tokens (match onboarding) ──────────────────────────
const ACC = '#d08a59'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'
const B2  = 'rgba(0,0,0,.14)'
const SF  = '#ffffff'
const EV  = '#f3f2ef'
const BG  = '#f9f8f6'
const OK  = '#2e7d54'

type Item = { id: string; name: string; sale_price: number; stock_qty: number; image_url?: string | null }
type Screen = 'list' | 'capture' | 'ready'

// Sound + haptic feedback — a channel beyond sight and text for users who
// can't lean on reading. Best-effort everywhere: silently no-ops when the
// device/browser doesn't support it.
const feedback = (kind: 'ok' | 'err') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(kind === 'ok' ? 30 : [60, 40, 60])
    }
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    gain.gain.value = 0.04
    if (kind === 'ok') {
      osc.frequency.value = 880
      osc.start()
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.09)
      osc.stop(ctx.currentTime + 0.18)
    } else {
      osc.frequency.value = 220
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    }
    osc.onended = () => { ctx.close().catch(() => {}) }
  } catch { /* no-op */ }
}

export default function PosSetupPage() {
  const router = useRouter()
  const supabase = createClient()
  const { tc } = useLang()

  const [screen, setScreen]     = useState<Screen>('list')
  const [items, setItems]       = useState<Item[]>([])
  const [loading, setLoading]   = useState(true)
  const [firstName, setFirstName] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('£')
  const [alreadyEnabled, setAlreadyEnabled] = useState(false)

  // Item being captured
  const [photo, setPhoto]       = useState<string | null>(null)
  const [name, setName]         = useState('')
  const [price, setPrice]       = useState('')
  const [qty, setQty]           = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [aiNaming, setAiNaming] = useState(false)

  // Delete-with-undo: removal is a deactivation (PATCH active:false), so
  // "Undo" is a reactivation — never a destructive loss from a mis-tap.
  const [undoItem, setUndoItem] = useState<Item | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // ── Load profile + ensure a "Main" branch exists (idempotent) ──
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, currency_symbol, pos_enabled')
        .eq('id', user.id)
        .maybeSingle()

      if (cancelled) return
      if (profile?.full_name) setFirstName(profile.full_name.trim().split(/\s+/)[0] || '')
      if (profile?.currency_symbol) setCurrencySymbol(profile.currency_symbol)
      // Already paying / trialing — no need for the pre-pay setup flow.
      if (profile?.pos_enabled) { setAlreadyEnabled(true) }

      // Ensure a default branch. The locations POST is idempotent on
      // (owner_id, name) — a 409 just means it already exists, which is fine.
      try {
        await fetch('/api/pos/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Main' }),
        })
      } catch { /* non-fatal — the sell flow re-checks branches later */ }

      // Load whatever items already exist (so a resumed setup shows progress).
      try {
        const res = await fetch('/api/pos/inventory?limit=200')
        if (res.ok) {
          const d = await res.json()
          if (!cancelled) setItems((d.inventory || []).map((p: any) => ({ id: p.id, name: p.name, sale_price: p.sale_price, stock_qty: p.stock_qty, image_url: p.image_url || null })))
        }
      } catch { /* empty catalogue is the expected first-run state */ }

      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Camera ────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch {
      // No camera / denied — the flow still works without a photo.
    }
  }, [])

  const openCapture = async () => {
    setPhoto(null); setName(''); setPrice(''); setQty(''); setError('')
    setScreen('capture')
    await startCamera()
  }

  // Camera-first naming: after the photo, ask the vision endpoint what the
  // item is and pre-fill name/price — the vendor confirms instead of typing.
  // Only fills fields still empty (never overwrites what they typed), and
  // fails silently: manual entry always works.
  const recognizeItem = async (dataUrl: string) => {
    setAiNaming(true)
    try {
      const res = await fetch('/api/pos/scan-product-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ front: dataUrl.replace(/^data:image\/\w+;base64,/, '') }),
      })
      if (res.ok) {
        const d = await res.json()
        const p = d?.product
        if (p?.name) setName(prev => prev.trim() ? prev : p.name)
        if (p?.sale_price != null && Number(p.sale_price) > 0) {
          setPrice(prev => prev.trim() ? prev : String(p.sale_price))
        }
      }
    } catch { /* silent — the manual fields are the flow */ }
    finally { setAiNaming(false) }
  }

  const takePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 640, h = video.videoHeight || 480
    canvas.width = w; canvas.height = h
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    setPhoto(dataUrl)
    stopCamera()
    recognizeItem(dataUrl)
  }

  const retakePhoto = async () => { setPhoto(null); await startCamera() }

  // Clean up the camera and any pending undo timer on unmount.
  useEffect(() => () => {
    stopCamera()
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }, [stopCamera])

  const resolvedName = () => name.trim() || tc('pos_setup.item_default_name')

  const saveItem = async () => {
    const priceNum = parseFloat(price)
    if (!(priceNum >= 0)) { setError(tc('pos_setup.err_price')); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/pos/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resolvedName(),
          sale_price: priceNum,
          stock_qty: qty.trim() ? Math.max(0, parseFloat(qty)) : 0,
          unit: 'item',
          image: photo || undefined,
        }),
      })
      const d = await res.json()
      if (!res.ok) { feedback('err'); setError(d.error || tc('pos_setup.err_save')); setSaving(false); return }
      feedback('ok')
      setItems(prev => [...prev, { id: d.product.id, name: d.product.name, sale_price: d.product.sale_price, stock_qty: d.product.stock_qty, image_url: d.product.image_url || null }])
      stopCamera()
      setScreen('list')
    } catch {
      feedback('err')
      setError(tc('pos_setup.err_save'))
    } finally {
      setSaving(false)
    }
  }

  // Remove = deactivate with a 6s undo window; the list updates instantly.
  const removeItem = (it: Item) => {
    setItems(prev => prev.filter(x => x.id !== it.id))
    setUndoItem(it)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setUndoItem(null), 6000)
    fetch('/api/pos/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: it.id, active: false }),
    }).catch(() => { /* worst case: item reappears on next load */ })
  }

  const undoRemove = (it: Item) => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setUndoItem(null)
    setItems(prev => [...prev, it])
    fetch('/api/pos/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: it.id, active: true }),
    }).catch(() => { /* worst case: item disappears on next load */ })
  }

  const bigBtn: React.CSSProperties = {
    width: '100%', padding: '16px', borderRadius: 14, border: 'none',
    background: ACC, color: '#fff', fontSize: 17, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(208,138,89,.3)',
  }
  const ghostBtn: React.CSSProperties = {
    width: '100%', padding: '15px', borderRadius: 14, border: `1.5px solid ${B2}`,
    background: 'transparent', color: TX2, fontSize: 16, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  }

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TX3, fontFamily: 'DM Sans, sans-serif' }}>
        {tc('pos_setup.loading')}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100%', background: BG, fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* On mobile the app shell floats a menu button top-left; clear it so
          the page heading isn't overlapped. No effect on desktop. */}
      <style>{`@media (max-width: 768px) { .pos-setup-shell { padding-top: 56px !important; } }`}</style>
      <div className="pos-setup-shell" style={{ width: '100%', maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px', flex: 1 }}>

        {/* Already enabled — nudge to the real POS instead of the pre-pay flow */}
        {alreadyEnabled && screen === 'list' && (
          <div role="status" style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(46,125,84,.08)', border: '1px solid rgba(46,125,84,.25)', color: OK, fontSize: 13, marginBottom: 16 }}>
            {tc('pos_setup.already_active')}{' '}
            <button onClick={() => router.push('/pos')} style={{ background: 'none', border: 'none', color: OK, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>
              {tc('pos_setup.go_to_pos')}
            </button>
          </div>
        )}

        {/* ── LIST: your items so far ── */}
        {screen === 'list' && (
          <>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 6 }}>
              {items.length === 0
                ? (firstName ? tc('pos_setup.title_empty_named', { name: firstName }) : tc('pos_setup.title_empty'))
                : items.length === 1
                  ? tc('pos_setup.title_count_one')
                  : tc('pos_setup.title_count', { count: items.length })}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 24 }}>
              {tc('pos_setup.subtitle')}
            </p>

            {items.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {items.map(it => (
                  <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: SF, border: `1px solid ${B}` }}>
                    {it.image_url ? (
                      <img src={it.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: EV }} />
                    ) : (
                      <div aria-hidden style={{ width: 44, height: 44, borderRadius: 10, background: EV, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                      </div>
                    )}
                    <span style={{ fontSize: 15, fontWeight: 600, color: TX, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: ACC, flexShrink: 0 }}>{currencySymbol}{it.sale_price}</span>
                    <button onClick={() => removeItem(it)} aria-label={tc('pos_setup.removed_toast', { name: it.name })}
                      style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, border: 'none', background: 'transparent', color: TX3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Undo bar — a mis-tap is never a loss */}
            {undoItem && (
              <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 15px', borderRadius: 12, background: TX, color: '#fff', marginBottom: 16 }}>
                <span style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tc('pos_setup.removed_toast', { name: undoItem.name })}
                </span>
                <button onClick={() => undoRemove(undoItem)}
                  style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 9999, border: 'none', background: ACC, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tc('pos_setup.undo')}
                </button>
              </div>
            )}

            <button style={{ ...bigBtn, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} onClick={openCapture}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              {items.length === 0 ? tc('pos_setup.add_first_item') : tc('pos_setup.add_another_item')}
            </button>

            {items.length > 0 && (
              <button style={ghostBtn} onClick={() => setScreen('ready')}>
                {tc('pos_setup.im_ready')}
              </button>
            )}
          </>
        )}

        {/* ── CAPTURE: photo + name + price ── */}
        {screen === 'capture' && (
          <>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 16 }}>
              {photo ? (
                <img src={photo} alt={tc('pos_setup.photo_alt')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {!photo ? (
              <button style={{ ...bigBtn, marginBottom: 20 }} onClick={takePhoto}>
                {tc('pos_setup.take_photo')}
              </button>
            ) : (
              <button style={{ ...ghostBtn, marginBottom: 20 }} onClick={retakePhoto}>
                {tc('pos_setup.retake')}
              </button>
            )}

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>
              {tc('pos_setup.name_label')}
              {aiNaming && <span style={{ marginLeft: 8, color: ACC, fontWeight: 500 }}>{tc('pos_setup.ai_naming')}</span>}
            </label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder={tc('pos_setup.name_placeholder')}
              style={{ width: '100%', padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 }}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.price_label')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: TX }}>{currencySymbol}</span>
              <input
                value={price} onChange={e => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
                inputMode="decimal" placeholder="0"
                style={{ flex: 1, padding: '14px 16px', fontSize: 26, fontWeight: 700, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.qty_label')}</label>
            <input
              value={qty} onChange={e => setQty(e.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric" placeholder={tc('pos_setup.qty_placeholder')}
              style={{ width: '100%', padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 20 }}
            />

            {error && <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button style={{ ...bigBtn, marginBottom: 10, opacity: saving ? .7 : 1 }} onClick={saveItem} disabled={saving}>
              {saving ? tc('pos_setup.saving') : tc('pos_setup.save_item')}
            </button>
            <button style={ghostBtn} onClick={() => { stopCamera(); setScreen('list') }} disabled={saving}>
              {tc('pos_setup.cancel')}
            </button>
          </>
        )}

        {/* ── READY: hand off to checkout ── */}
        {screen === 'ready' && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,125,84,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 10 }}>
              {firstName ? tc('pos_setup.ready_title_named', { name: firstName }) : tc('pos_setup.ready_title')}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 28 }}>
              {items.length === 1 ? tc('pos_setup.ready_subtitle_one') : tc('pos_setup.ready_subtitle', { count: items.length })}
            </p>
            <button style={{ ...bigBtn, marginBottom: 10 }} onClick={() => router.push('/pos/activate')}>
              {tc('pos_setup.ready_cta')}
            </button>
            <button style={ghostBtn} onClick={() => setScreen('list')}>
              {tc('pos_setup.ready_back')}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
