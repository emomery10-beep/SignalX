'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsClerkLevel, isLogisticsBranchLevel, isManagerOrAboveLevel, getRoleHomeRoute } from '@/lib/pos-role-client'

const ACC = '#0891b2'
const ACC_LIGHT = 'rgba(8,145,178,.1)'
const ACC_B = 'rgba(8,145,178,.25)'
const GREEN = 'var(--pos-success)'
const RED = 'var(--pos-danger)'
const API = process.env.NEXT_PUBLIC_API_URL || ''
const ALLOWED_PHOTO = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

interface Staff { id: string; name: string; role: string; owner_id: string; location_id: string | null; currency_symbol: string; business_type: string }
interface Parcel {
  id: string; tracking_number: string; status: string
  sender_name: string | null; receiver_name: string | null; receiver_phone: string | null
  receiver_id_number: string | null; description: string | null
  weight_kg: number | null; parcel_size: string | null
  fee_charged: number | null; payment_status: string | null; payment_method: string | null
  destination_branch_id: string | null; current_branch_id: string | null
  destination_branch?: { id: string; name: string } | null
  sender_branch?: { id: string; name: string } | null
}

async function compressPhoto(file: File, maxEdge = 1600, quality = 0.82): Promise<string> {
  const draw = (src: CanvasImageSource, w: number, h: number): string | null => {
    const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h)
    const ctx = c.getContext('2d'); if (!ctx) return null
    ctx.drawImage(src, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', quality)
  }
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file)
      const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height))
      const out = draw(bmp, Math.round(bmp.width * scale), Math.round(bmp.height * scale))
      bmp.close?.(); if (out && out.length > 120) return out
    } catch { /* fall through */ }
  }
  const dataUrl: string = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(file) })
  try {
    const img: HTMLImageElement = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('decode')); i.src = dataUrl })
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const out = draw(img, Math.round(img.width * scale), Math.round(img.height * scale)); if (out && out.length > 120) return out
  } catch { /* fall through */ }
  return dataUrl
}
async function fetchWithTimeout(url: string, opts: RequestInit, ms = 45000): Promise<Response> {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { ...opts, signal: ctrl.signal }) } finally { clearTimeout(t) }
}

const inputSx: React.CSSProperties = { width: '100%', padding: '11px 12px', border: '1px solid var(--pos-border)', borderRadius: 10, fontSize: 16, outline: 'none', boxSizing: 'border-box', background: 'var(--pos-surface)', color: 'var(--pos-ink)' }

export default function CollectPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [ready, setReady] = useState(false)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Collection sheet
  const [sel, setSel] = useState<Parcel | null>(null)
  const [idNum, setIdNum] = useState('')
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash')
  const [markPaid, setMarkPaid] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanMsg, setScanMsg] = useState('')
  const [releasing, setReleasing] = useState(false)
  const [err, setErr] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)
  const idRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const raw = localStorage.getItem('pos_staff')
    if (!raw) { router.push('/'); return }
    let s: Staff
    try { s = JSON.parse(raw) as Staff } catch { router.push('/'); return }
    if (!isLogisticsClerkLevel(s.role) && !isLogisticsBranchLevel(s.role) && !isManagerOrAboveLevel(s.role)) { router.push(getRoleHomeRoute(s.role)); return }
    setStaff(s); setReady(true); load(s)
  }, [router])

  const hdrs = useCallback((s: Staff) => ({ 'Content-Type': 'application/json', 'x-staff-id': s.id, 'x-owner-id': s.owner_id }), [])

  const load = async (s: Staff) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/parcels?status=awaiting_collection&limit=200`, { headers: hdrs(s) })
      const data = await res.json()
      // Only parcels whose destination is THIS branch
      setParcels((data.parcels || []).filter((p: Parcel) => !s.location_id || p.destination_branch_id === s.location_id || p.current_branch_id === s.location_id))
    } catch {}
    setLoading(false)
  }

  const openSheet = (p: Parcel) => {
    setSel(p); setIdNum(p.receiver_id_number || ''); setPayMethod((p.payment_method as any) || 'cash')
    setMarkPaid(p.payment_status === 'paid'); setPhoto(null); setScanMsg(''); setErr('')
  }
  const closeSheet = () => { setSel(null) }

  const handlePhoto = async (file: File) => {
    setErr('')
    if (file.type && !ALLOWED_PHOTO.includes(file.type)) { setErr('Use a JPEG/PNG/WebP/HEIC image.'); return }
    setPhotoBusy(true)
    try { setPhoto(await compressPhoto(file)) } catch { setErr('Could not process that photo.') }
    setPhotoBusy(false)
  }

  const scanId = async (file: File) => {
    if (!staff) return
    setScanning(true); setScanMsg('')
    try {
      const img = await compressPhoto(file, 1800, 0.85)
      const res = await fetchWithTimeout(`${API}/api/pos/parcels/scan-id`, { method: 'POST', headers: hdrs(staff), body: JSON.stringify({ image: img }) }, 45000)
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.id_number) { setScanMsg('Couldn’t read the ID — type it in.'); return }
      setIdNum(data.id_number)
      setScanMsg(typeof data.confidence === 'number' && data.confidence < 0.6 ? '⚠️ Low confidence — check it matches.' : '✓ ID captured — verify it matches.')
    } catch { setScanMsg('ID scan failed — type it in.') }
    finally { setScanning(false) }
  }

  const release = async () => {
    if (!staff || !sel) return
    const sym = staff.currency_symbol || ''
    if (!idNum.trim()) { setErr('Verify the receiver — scan or type their ID number.'); return }
    if (!photo) { setErr('Take a photo of the parcel at handover.'); return }
    if (sel.payment_status !== 'paid' && !markPaid) { setErr(`This parcel is ${sel.payment_status || 'unpaid'} (${sym}${(sel.fee_charged || 0).toFixed(2)}). Confirm payment before releasing.`); return }
    setReleasing(true); setErr('')
    try {
      // 1. upload handover photo (private bucket → signed url)
      let photoUrl: string | null = null, photoPath: string | null = null
      const up = await fetchWithTimeout(`${API}/api/pos/parcels/photo`, { method: 'POST', headers: hdrs(staff), body: JSON.stringify({ image: photo, tracking_number: sel.tracking_number }) }, 45000)
      const upData = await up.json().catch(() => ({}))
      if (!up.ok) { setErr(upData.error || 'Photo upload failed — retake.'); setReleasing(false); return }
      photoUrl = upData.url || null; photoPath = upData.path || null

      // 2. release → collected
      const res = await fetchWithTimeout(`${API}/api/pos/parcels`, {
        method: 'PATCH', headers: hdrs(staff),
        body: JSON.stringify({
          id: sel.id, status: 'collected',
          receiver_id_number: idNum.trim(),
          collected_by_name: sel.receiver_name || null,
          collection_photo_url: photoUrl, collection_photo_path: photoPath,
          ...(sel.payment_status !== 'paid' && markPaid ? { payment_status: 'paid', payment_method: payMethod } : {}),
        }),
      }, 45000)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Could not release parcel.'); setReleasing(false); return }
      setSel(null)
      await load(staff)
    } catch { setErr('Network error — try again.') }
    finally { setReleasing(false) }
  }

  if (!ready) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>Loading…</div>

  const sym = staff?.currency_symbol || '$'
  const filtered = parcels.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.tracking_number?.toLowerCase().includes(q) || p.receiver_name?.toLowerCase().includes(q) || p.receiver_phone?.toLowerCase().includes(q)
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 40 }}>
      {/* Header */}
      <header style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontSize: 18 }} aria-hidden>📋</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>Parcel Collection</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{staff?.name} · hand parcels to customers</div>
        </div>
        <button onClick={() => staff && load(staff)} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_B}`, borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↻</button>
      </header>

      {/* Outgoing / Incoming switch */}
      <div style={{ display: 'flex', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)' }}>
        <button onClick={() => router.push('/logistics/intake')} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--pos-muted)', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer' }}>📤 Outgoing</button>
        <div style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 12, fontWeight: 800, color: ACC, borderBottom: `2px solid ${ACC}` }}>📥 Incoming</div>
      </div>

      <main style={{ maxWidth: 500, margin: '0 auto', padding: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracking #, name, phone…" style={{ ...inputSx, marginBottom: 12 }} />
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pos-muted)' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '32px 16px', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 13 }}>
            No parcels waiting for collection at your branch. They appear here once the handler receives them in.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(p => {
              const paid = p.payment_status === 'paid'
              return (
                <button key={p.id} onClick={() => openSheet(p)} style={{ textAlign: 'left', background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14, fontWeight: 800, color: 'var(--pos-ink)' }}>{p.tracking_number}</span>
                    <span style={{ marginLeft: 'auto', background: paid ? 'var(--pos-success-pale)' : 'var(--pos-danger-pale)', color: paid ? GREEN : RED, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{paid ? 'Paid' : (p.payment_status || 'unpaid')}{!paid ? ` · ${sym}${(p.fee_charged || 0).toFixed(0)}` : ''}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)', lineHeight: 1.5 }}>
                    <div>📥 To: {p.receiver_name || '—'} {p.receiver_phone ? `· ${p.receiver_phone}` : ''}</div>
                    <div>📦 {p.description || 'Parcel'}{p.weight_kg ? ` · ${p.weight_kg}kg` : ''} · from {p.sender_branch?.name || p.sender_name || '—'}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* Collection sheet */}
      {sel && (
        <div role="dialog" aria-modal="true" aria-label="Release parcel" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={closeSheet}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--pos-surface)', borderRadius: '16px 16px 0 0', padding: 20, width: '100%', maxWidth: 500, maxHeight: '92vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>Release {sel.tracking_number}</div>
              <button onClick={closeSheet} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--pos-muted)' }}>×</button>
            </div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 16 }}>To {sel.receiver_name || '—'} · {sel.receiver_phone || '—'}</div>

            {/* Payment */}
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 6 }}>1 · Payment</div>
            {sel.payment_status === 'paid' ? (
              <div style={{ background: 'var(--pos-success-pale)', color: GREEN, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>✓ Already paid</div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: ACC_LIGHT, border: `1px solid ${ACC_B}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--pos-muted)' }}>Collect on delivery</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: ACC }}>{sym}{(sel.fee_charged || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
                  {([{ id: 'cash', label: '💵 Cash' }, { id: 'card', label: '💳 Card' }, { id: 'mobile_money', label: '📱 Mobile' }] as const).map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)} style={{ padding: '10px 4px', border: `2px solid ${payMethod === m.id ? ACC : 'var(--pos-border)'}`, borderRadius: 10, background: payMethod === m.id ? ACC_LIGHT : 'var(--pos-surface)', color: payMethod === m.id ? ACC : 'var(--pos-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{m.label}</button>
                  ))}
                </div>
                <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--pos-ink)' }}>
                  <input type="checkbox" checked={markPaid} onChange={e => setMarkPaid(e.target.checked)} style={{ width: 20, height: 20, accentColor: ACC }} />
                  Payment received in full
                </label>
              </div>
            )}

            {/* Receiver ID */}
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 6 }}>2 · Verify receiver ID</div>
            <input value={idNum} onChange={e => setIdNum(e.target.value)} maxLength={40} placeholder="National ID / Passport" style={{ ...inputSx, marginBottom: 8 }} />
            <input ref={idRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) scanId(f); e.target.value = '' }} />
            <button onClick={() => idRef.current?.click()} disabled={scanning} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_B}`, borderRadius: 10, padding: '8px 12px', fontSize: 13, fontWeight: 700, cursor: scanning ? 'wait' : 'pointer', marginBottom: scanMsg ? 4 : 16 }}>{scanning ? '⏳ Reading ID…' : '📷 Scan ID to auto-fill'}</button>
            {scanMsg && <div style={{ fontSize: 11.5, marginBottom: 16, color: scanMsg.startsWith('⚠️') ? '#ca8a04' : scanMsg.startsWith('✓') ? GREEN : 'var(--pos-muted)' }}>{scanMsg}</div>}

            {/* Parcel photo */}
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 6 }}>3 · Photo of parcel at handover</div>
            <input ref={photoRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = '' }} />
            {photo ? (
              <div style={{ position: 'relative', marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Parcel at handover" style={{ width: '100%', borderRadius: 12, maxHeight: 220, objectFit: 'cover', border: `2px solid ${GREEN}` }} />
                <button onClick={() => setPhoto(null)} style={{ position: 'absolute', top: 8, right: 8, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Retake</button>
              </div>
            ) : (
              <button onClick={() => photoRef.current?.click()} disabled={photoBusy} style={{ width: '100%', padding: 14, border: `2px dashed ${ACC_B}`, borderRadius: 12, background: 'var(--pos-surface)', color: ACC, fontSize: 14, fontWeight: 700, cursor: photoBusy ? 'wait' : 'pointer', marginBottom: 16 }}>{photoBusy ? 'Processing…' : '📷 Take parcel photo'}</button>
            )}

            {err && <div role="alert" style={{ color: RED, fontSize: 13, marginBottom: 12, padding: '10px 14px', background: 'var(--pos-danger-pale)', borderRadius: 10 }}>{err}</div>}

            <button onClick={release} disabled={releasing} aria-busy={releasing}
              style={{ width: '100%', background: GREEN, color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 900, cursor: releasing ? 'wait' : 'pointer', opacity: releasing ? 0.7 : 1 }}>
              {releasing ? '⏳ Releasing…' : '✅ Release to customer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
