'use client'
import { useEffect, useRef, useState, useCallback, useId } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsClerkLevel, isLogisticsBranchLevel, isManagerOrAboveLevel, getRoleHomeRoute } from '@/lib/pos-role-client'
import { useLang } from '@/components/LanguageProvider'
import { compressImageToDataUrl, approxDataUrlBytes } from '@/lib/pos-image-compress'
import { fetchResource } from '@/lib/pos-resource-fetch'
import { bulkUpsertResourceFromApi, isResourceCacheStale } from '@/lib/pos-resource-cache'
import { enqueueOfflineWrite, replayOfflineQueue, generateClientTxId, getOutboxCount, OfflineQueueQuotaError } from '@/lib/pos-offline-queue'

type Tc = (key: string, vars?: Record<string, string | number>) => string

// ── Palette (logistics cyan sub-brand, matches /logistics/dispatch) ──
const ACC       = '#0891b2'
const ACC_LIGHT = 'rgba(8,145,178,.1)'
const ACC_B     = 'rgba(8,145,178,.25)'
const GREEN     = 'var(--pos-success)'
const RED       = 'var(--pos-danger)'
const AMBER     = '#ca8a04'
const API       = process.env.NEXT_PUBLIC_API_URL || ''

// Photo constraints — must mirror the server route + bucket
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const ALLOWED_PHOTO   = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

// ── Types ─────────────────────────────────────────────────────
interface Staff {
  id: string; name: string; role: string
  owner_id: string; location_id: string | null
  currency_symbol: string; business_type: string
}
interface Branch { id: string; name: string; address?: string | null }
interface Route {
  id: string; name: string | null
  destination_branch_id: string
  destination?: { id: string; name: string } | null
  flat_rate: number | null; price_per_kg: number | null
  active: boolean
}
interface Shift  { id: string; opened_at: string; opening_balance: number }

type Step = 'shift' | 'sender' | 'receiver' | 'parcel' | 'photo' | 'payment' | 'confirm' | 'done'

// ── Helpers ───────────────────────────────────────────────────
// fetch that aborts instead of hanging forever on a stalled mobile connection
async function fetchWithTimeout(url: string, opts: RequestInit, ms = 45000): Promise<Response> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { ...opts, signal: ctrl.signal }) }
  finally { clearTimeout(t) }
}

const inputSx: React.CSSProperties = {
  width: '100%', padding: '11px 12px', border: '1px solid var(--pos-border)',
  borderRadius: 10, fontSize: 16, outline: 'none', boxSizing: 'border-box',
  background: 'var(--pos-surface)', color: 'var(--pos-ink)',
}
const selectSx: React.CSSProperties = { ...inputSx, appearance: 'none', cursor: 'pointer' }

// Labelled single control — <label> wraps the input for implicit association
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block' }}>
        <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>{label}</span>
        {children}
      </label>
      {hint && <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

// Labelled group of choice buttons (role=group, not a <label> — a label must wrap one control)
function ChoiceGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const labelId = useId()
  return (
    <div style={{ marginBottom: 14 }}>
      <div id={labelId} style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>{label}</div>
      <div role="group" aria-labelledby={labelId}>{children}</div>
      {hint && <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <div role="alert" style={{ color: RED, fontSize: 13, marginBottom: 12, padding: '10px 14px', background: 'var(--pos-danger-pale)', borderRadius: 10 }}>
      {children}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function IntakePage() {
  const router  = useRouter()
  const { tc }  = useLang()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [ready, setReady] = useState(false)

  // Shift
  const [shift, setShift]        = useState<Shift | null>(null)
  const [openFloat, setOpenFloat] = useState('')
  const [shiftBusy, setShiftBusy] = useState(false)
  const [shiftErr, setShiftErr]   = useState('')

  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [feeEdited, setFeeEdited] = useState(false) // clerk manually overrode the auto-price
  const [step, setStep] = useState<Step>('shift')

  // Sender
  const [senderName,  setSenderName]  = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [senderIdNum, setSenderIdNum] = useState('')
  // Receiver
  const [recvName,  setRecvName]  = useState('')
  const [recvPhone, setRecvPhone] = useState('')
  const [recvIdNum, setRecvIdNum] = useState('')
  // Delivery
  const [deliveryType, setDeliveryType]    = useState<'branch_to_branch' | 'door_to_door'>('branch_to_branch')
  const [destBranchId, setDestBranchId]    = useState('')
  const [destCity, setDestCity]            = useState('')
  const [deliveryAddress, setDelivAddress] = useState('')
  // Parcel
  const [description, setDescription]   = useState('')
  const [weightKg, setWeightKg]          = useState('')
  const [parcelSize, setParcelSize]      = useState<'S' | 'M' | 'L' | 'XL'>('M')
  const [declaredValue, setDeclaredVal]  = useState('')
  const [feeCharged, setFeeCharged]      = useState('')
  // Photo — stored as a compressed JPEG data URL (small, upload-ready)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [photoBusy, setPhotoBusy]       = useState(false)
  const [photoErr, setPhotoErr]         = useState('')
  const fileRef   = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  // ID OCR
  const [scanningId, setScanningId] = useState<null | 'sender' | 'receiver'>(null)
  const [idScanMsg, setIdScanMsg]   = useState('')
  const [idMsgFor, setIdMsgFor]     = useState<null | 'sender' | 'receiver'>(null)
  const senderIdCamRef = useRef<HTMLInputElement>(null)
  const recvIdCamRef   = useRef<HTMLInputElement>(null)
  // Payment
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash')
  const [payStatus, setPayStatus] = useState<'paid' | 'unpaid' | 'partial'>('paid')
  // Consent (GDPR)
  const [dataConsent, setDataConsent]       = useState(false)
  const [receiptConsent, setReceiptConsent] = useState(false)
  // Submit
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr]   = useState('')
  const [createdParcel, setCreatedParcel] = useState<{ tracking_number: string | null; id: string | null; receipt_consent: boolean; pendingSync?: boolean; client_tx_id?: string } | null>(null)
  const [outboxPending, setOutboxPending] = useState(0)
  // Close shift
  const [showClose, setShowClose]       = useState(false)
  const [closeCash, setCloseCash]       = useState('')
  const [closingShift, setClosingShift]  = useState(false)
  const [closeErr, setCloseErr]          = useState('')

  // ── Auth guard ───────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('pos_staff')
    if (!raw) { router.push('/'); return }
    let s: Staff
    try { s = JSON.parse(raw) as Staff } catch { localStorage.removeItem('pos_staff'); router.push('/'); return }
    if (!s?.role) { router.push('/'); return }
    if (!isLogisticsClerkLevel(s.role) && !isLogisticsBranchLevel(s.role) && !isManagerOrAboveLevel(s.role)) {
      router.push(getRoleHomeRoute(s.role)); return
    }
    setStaff(s)
    const shiftRaw = localStorage.getItem('pos_logistics_shift')
    if (shiftRaw) { try { setShift(JSON.parse(shiftRaw)); setStep('sender') } catch { localStorage.removeItem('pos_logistics_shift') } }
    setReady(true)
    loadRoutes(s)

    // Background catalog prefetch so parcels/routes are usable offline —
    // throttled so a screen visit doesn't re-download on every mount.
    isResourceCacheStale('parcels', s.owner_id, 6 * 60 * 60 * 1000).then(stale => {
      if (stale) bulkUpsertResourceFromApi('parcels', '/api/pos/parcels', s.owner_id, s.id, { listKey: 'parcels' }).catch(() => {})
    }).catch(() => {})
    isResourceCacheStale('routes', s.owner_id, 6 * 60 * 60 * 1000).then(stale => {
      if (stale) bulkUpsertResourceFromApi('routes', '/api/pos/routes', s.owner_id, s.id, { listKey: 'routes' }).catch(() => {})
    }).catch(() => {})

    getOutboxCount(s.owner_id).then(setOutboxPending).catch(() => {})
  }, [router])

  const replayQueue = useCallback(async () => {
    if (!staff) return
    const result = await replayOfflineQueue(staff.owner_id, staff.id).catch(() => null)
    getOutboxCount(staff.owner_id).then(setOutboxPending).catch(() => {})
    // If the currently-displayed "pending sync" parcel just synced in the
    // background, reconcile the UI with the real server-assigned fields
    // instead of leaving it stuck showing a placeholder forever.
    const pendingTxId = createdParcel?.pendingSync ? createdParcel.client_tx_id : undefined
    const match = pendingTxId ? result?.succeededResponses.find(r => r.client_tx_id === pendingTxId) : undefined
    if (!match) return
    if (match.body?.parcel) {
      setCreatedParcel({ tracking_number: match.body.parcel.tracking_number, id: match.body.parcel.id, receipt_consent: createdParcel!.receipt_consent, client_tx_id: pendingTxId })
    } else {
      // Dropped as permanently invalid (400) — surface that instead of "pending" forever
      setSubmitErr(match.body?.error || tc('logistics_intake.err_register_status', { status: 400 }))
    }
  }, [staff, createdParcel, tc])

  useEffect(() => {
    if (!staff) return
    replayQueue()
    window.addEventListener('online', replayQueue)
    return () => window.removeEventListener('online', replayQueue)
  }, [staff, replayQueue])

  const hdrs = useCallback((s: Staff) => ({
    'Content-Type': 'application/json',
    'x-staff-id': s.id,
    'x-owner-id': s.owner_id,
  }), [])

  // Destinations are admin-defined routes from THIS branch — never a raw branch list
  const loadRoutes = async (s: Staff) => {
    try {
      const res = await fetch(`${API}/api/pos/routes?active=true`, { headers: hdrs(s) })
      if (!res.ok) return
      const data = await res.json()
      const mine = (data.routes || []).filter((r: any) => r.origin_branch_id === s.location_id)
      setRoutes(mine)
    } catch { /* non-fatal — door-to-door still works */ }
  }

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || null

  // Auto-price from the route unless the clerk has overridden it
  const applyRoutePrice = (route: Route | null, weight: string) => {
    if (!route || feeEdited) return
    if (route.flat_rate != null) { setFeeCharged(String(route.flat_rate)); return }
    if (route.price_per_kg != null) {
      const w = parseFloat(weight) || 0
      setFeeCharged(w > 0 ? String(Math.round(route.price_per_kg * w * 100) / 100) : '')
    }
  }

  // ── Shift ────────────────────────────────────────────────
  const openShift = async () => {
    if (!staff) return
    if (!staff.location_id) { setShiftErr(tc('logistics_intake.err_no_branch')); return }
    setShiftBusy(true); setShiftErr('')
    try {
      const res  = await fetch(`${API}/api/pos/shift/open`, {
        method: 'POST', headers: hdrs(staff),
        body: JSON.stringify({ cashier_id: staff.id, location_id: staff.location_id, opening_cash_balance: parseFloat(openFloat) || 0 }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setShiftErr(data.error || tc('logistics_intake.err_open_shift_status', { status: res.status })); return }
      const sh = { id: data.shift_id, opened_at: data.opened_at, opening_balance: data.opening_balance }
      setShift(sh)
      localStorage.setItem('pos_logistics_shift', JSON.stringify(sh))
      setStep('sender')
    } catch { setShiftErr(tc('logistics_intake.err_network_retry')) }
    finally { setShiftBusy(false) }
  }

  const closeShift = async () => {
    if (!staff || !shift) return
    const physical = parseFloat(closeCash)
    if (isNaN(physical) || physical < 0) { setCloseErr(tc('logistics_intake.err_valid_cash')); return }
    setClosingShift(true); setCloseErr('')
    try {
      const res  = await fetch(`${API}/api/pos/shift/close`, {
        method: 'POST', headers: hdrs(staff),
        body: JSON.stringify({ shift_id: shift.id, physical_cash_count: physical }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.requires_reason) { setCloseErr(tc('logistics_intake.err_cash_variance', { symbol: staff.currency_symbol, amount: Math.abs(data.variance_amount).toFixed(2) })); return }
      if (!res.ok) { setCloseErr(data.error || tc('logistics_intake.err_close_shift_status', { status: res.status })); return }
      localStorage.removeItem('pos_logistics_shift')
      setShift(null); setShowClose(false); setStep('shift'); setOpenFloat(''); setCloseCash('')
    } catch { setCloseErr(tc('logistics_intake.err_network_retry')) }
    finally { setClosingShift(false) }
  }

  // ── Photo ─────────────────────────────────────────────────
  const handlePhoto = async (file: File) => {
    setPhotoErr('')
    if (file.type && !ALLOWED_PHOTO.includes(file.type)) { setPhotoErr(tc('logistics_intake.err_photo_type')); return }
    if (file.size > MAX_PHOTO_BYTES)                     { setPhotoErr(tc('logistics_intake.err_photo_too_big')); return }
    setPhotoBusy(true)
    try {
      const compressed = await compressImageToDataUrl(file)
      if (approxDataUrlBytes(compressed) > 4 * 1024 * 1024) { setPhotoErr(tc('logistics_intake.err_photo_too_big_processed')); return }
      setPhotoDataUrl(compressed)
    } catch { setPhotoErr(tc('logistics_intake.err_photo_process')) }
    finally { setPhotoBusy(false) }
  }

  const clearPhoto = () => { setPhotoDataUrl(null); setPhotoErr('') }

  // ── ID OCR ────────────────────────────────────────────────
  const handleIdScan = async (file: File, which: 'sender' | 'receiver') => {
    if (!staff) return
    setIdScanMsg(''); setIdMsgFor(which); setScanningId(which)
    try {
      if (file.type && !ALLOWED_PHOTO.includes(file.type)) { setIdScanMsg(tc('logistics_intake.err_id_type')); return }
      const compressed = await compressImageToDataUrl(file, { maxEdge: 1800, quality: 0.85 })
      const res  = await fetchWithTimeout(`${API}/api/pos/parcels/scan-id`, {
        method: 'POST', headers: hdrs(staff), body: JSON.stringify({ image: compressed }),
      }, 45000)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setIdScanMsg(data.error || tc('logistics_intake.err_id_read')); return }
      if (!data.id_number) { setIdScanMsg(tc('logistics_intake.err_id_no_number')); return }
      if (which === 'sender') {
        setSenderIdNum(data.id_number)
        if (data.full_name && !senderName.trim()) setSenderName(data.full_name)
      } else {
        setRecvIdNum(data.id_number)
        if (data.full_name && !recvName.trim()) setRecvName(data.full_name)
      }
      const low = typeof data.confidence === 'number' && data.confidence < 0.6
      setIdScanMsg(low ? tc('logistics_intake.id_low_confidence') : tc('logistics_intake.id_captured'))
    } catch (e: any) {
      setIdScanMsg(e?.name === 'AbortError' ? tc('logistics_intake.err_id_timeout') : tc('logistics_intake.err_id_failed'))
    } finally { setScanningId(null) }
  }

  // ── Submit ────────────────────────────────────────────────
  // Photo travels inline (base64) in the same request as the parcel create —
  // not as a separate pre-upload step, which can't happen offline. The
  // server (app/api/pos/parcels/route.ts) uploads it to the private
  // parcel-photos bucket itself.
  const submit = async () => {
    if (!staff) return
    if (!dataConsent) { setSubmitErr(tc('logistics_intake.err_consent_required')); return }
    setSubmitting(true); setSubmitErr('')

    const clientTxId = generateClientTxId('parcel')
    const body = {
      sender_name: senderName.trim(), sender_phone: senderPhone.trim(), sender_id_number: senderIdNum.trim() || null,
      sender_branch_id: staff.location_id,
      receiver_name: recvName.trim(), receiver_phone: recvPhone.trim(), receiver_id_number: recvIdNum.trim() || null,
      destination_branch_id: deliveryType === 'branch_to_branch' ? (selectedRoute?.destination_branch_id || null) : null,
      destination_city: deliveryType === 'branch_to_branch' ? (selectedRoute?.destination?.name || null) : destCity.trim() || null,
      route_id: deliveryType === 'branch_to_branch' ? (selectedRouteId || null) : null,
      delivery_type: deliveryType,
      delivery_address: deliveryType === 'door_to_door' ? deliveryAddress.trim() : null,
      description: description.trim() || null,
      weight_kg: parseFloat(weightKg) || null,
      parcel_size: parcelSize,
      declared_value: parseFloat(declaredValue) || 0,
      fee_charged: parseFloat(feeCharged) || 0,
      payment_status: payStatus, payment_method: payMethod,
      intake_photo: photoDataUrl || null,
      sender_consent: dataConsent, receipt_consent: receiptConsent,
      client_tx_id: clientTxId,
    }

    try {
      const res = await fetchWithTimeout(`${API}/api/pos/parcels`, {
        method: 'POST', headers: hdrs(staff), body: JSON.stringify(body),
      }, 45000)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setSubmitErr(data.error || tc('logistics_intake.err_register_status', { status: res.status })); setSubmitting(false); return }
      setCreatedParcel({ tracking_number: data.parcel.tracking_number, id: data.parcel.id, receipt_consent: receiptConsent })
      setStep('done')
    } catch (e: any) {
      // Network failure (not a rejected request) — queue for replay when
      // back online. The server generates the tracking number, so it isn't
      // known yet; the done screen shows a "pending sync" placeholder.
      try {
        await enqueueOfflineWrite({
          client_tx_id: clientTxId, owner_id: staff.owner_id, staff_id: staff.id,
          endpoint: '/api/pos/parcels', method: 'POST', body, created_at: new Date().toISOString(),
        })
        setOutboxPending(await getOutboxCount(staff.owner_id))
        setCreatedParcel({ tracking_number: null, id: null, receipt_consent: receiptConsent, pendingSync: true, client_tx_id: clientTxId })
        setStep('done')
      } catch (queueErr) {
        setSubmitErr(queueErr instanceof OfflineQueueQuotaError
          ? queueErr.message
          : (e?.name === 'AbortError' ? tc('logistics_intake.err_submit_timeout') : tc('logistics_intake.err_submit_network')))
      }
    } finally { setSubmitting(false) }
  }

  const resetForm = () => {
    setSenderName(''); setSenderPhone(''); setSenderIdNum('')
    setRecvName(''); setRecvPhone(''); setRecvIdNum('')
    setDeliveryType('branch_to_branch'); setDestBranchId(''); setSelectedRouteId(''); setDestCity(''); setDelivAddress('')
    setDescription(''); setWeightKg(''); setParcelSize('M'); setDeclaredVal(''); setFeeCharged(''); setFeeEdited(false)
    clearPhoto(); setIdScanMsg('')
    setPayMethod('cash'); setPayStatus('paid')
    setDataConsent(false); setReceiptConsent(false)
    setSubmitErr(''); setCreatedParcel(null)
    setStep('sender')
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }} aria-busy="true">{tc('logistics_intake.loading')}</div>
  )

  const sym = staff?.currency_symbol || '$'

  // ── STEP: Open Shift ──────────────────────────────────────
  if (step === 'shift') return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header tc={tc} title={tc('logistics_intake.shift_title')} subtitle={tc('logistics_intake.shift_subtitle', { name: staff?.name || '' })} />
      <main style={{ maxWidth: 440, margin: '40px auto', padding: '0 16px' }}>
        <div style={{ background: 'var(--pos-surface)', borderRadius: 16, padding: 24, border: '1px solid var(--pos-border)' }}>
          <div style={{ fontSize: 22, marginBottom: 8 }} aria-hidden>{tc('logistics_intake.shift_card_emoji')}</div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.shift_heading')}</h1>
          <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 20px' }}>{tc('logistics_intake.shift_intro')}</p>
          <Field label={tc('logistics_intake.shift_float_label', { symbol: sym })}>
            <input value={openFloat} onChange={e => setOpenFloat(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" placeholder={tc('logistics_intake.shift_float_placeholder')} style={inputSx} />
          </Field>
          <ErrorText>{shiftErr}</ErrorText>
          <button onClick={openShift} disabled={shiftBusy} aria-busy={shiftBusy}
            style={{ width: '100%', background: ACC, color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 800, cursor: shiftBusy ? 'wait' : 'pointer', opacity: shiftBusy ? 0.6 : 1 }}>
            {shiftBusy ? tc('logistics_intake.shift_opening') : tc('logistics_intake.shift_open_button')}
          </button>
        </div>
      </main>
    </div>
  )

  // ── STEP: Done ────────────────────────────────────────────
  if (step === 'done' && createdParcel) return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header tc={tc} title={tc('logistics_intake.done_title')} subtitle={staff?.name || ''} onClose={() => setShowClose(true)} />
      <main style={{ maxWidth: 440, margin: '40px auto', padding: '0 16px', textAlign: 'center' }}>
        <div style={{ background: 'var(--pos-surface)', borderRadius: 20, padding: '32px 24px', border: `2px solid ${GREEN}` }}>
          <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden>{tc('logistics_intake.done_emoji')}</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 8 }}>{tc('logistics_intake.done_tracking_label')}</div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: createdParcel.pendingSync ? 20 : 42, fontWeight: 900, color: createdParcel.pendingSync ? RED : ACC, letterSpacing: createdParcel.pendingSync ? 0 : 2, padding: '16px 24px', background: createdParcel.pendingSync ? 'var(--pos-danger-pale)' : ACC_LIGHT, borderRadius: 12, border: `2px dashed ${createdParcel.pendingSync ? 'var(--pos-danger-ring)' : ACC_B}`, marginBottom: 16, wordBreak: 'break-all' }}>
            {createdParcel.pendingSync ? tc('logistics_intake.done_pending_sync') : createdParcel.tracking_number}
          </div>
          <p style={{ fontSize: 14, color: 'var(--pos-muted)', margin: '0 0 24px' }}>
            {createdParcel.pendingSync ? tc('logistics_intake.done_pending_sync_note') : tc('logistics_intake.done_write_note')}
          </p>
          {createdParcel.receipt_consent && (
            <div style={{ background: 'var(--pos-success-pale)', border: '1px solid var(--pos-success-ring)', borderRadius: 10, padding: '10px 14px', marginBottom: 24, fontSize: 12, color: GREEN }}>
              {tc('logistics_intake.done_receipt_consent')}
            </div>
          )}
          <button onClick={resetForm} style={{ width: '100%', background: ACC, color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>{tc('logistics_intake.done_next_parcel')}</button>
          <button onClick={() => setShowClose(true)} style={{ width: '100%', background: 'transparent', color: 'var(--pos-muted)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{tc('logistics_intake.done_close_shift')}</button>
        </div>
      </main>
      {showClose && <CloseShiftModal tc={tc} sym={sym} closeCash={closeCash} setCloseCash={setCloseCash} closingShift={closingShift} closeErr={closeErr} onClose={closeShift} onCancel={() => { setShowClose(false); setCloseErr('') }} />}
    </div>
  )

  // ── MAIN FORM ─────────────────────────────────────────────
  const steps: { id: Step; emoji: string }[] = [
    { id: 'sender', emoji: '👤' }, { id: 'receiver', emoji: '📬' }, { id: 'parcel', emoji: '📦' },
    { id: 'photo', emoji: '📷' }, { id: 'payment', emoji: '💳' }, { id: 'confirm', emoji: '✅' },
  ]
  const stepIdx = steps.findIndex(s => s.id === step)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: 80 }}>
      <Header tc={tc} title={tc('logistics_intake.main_title')} subtitle={tc('logistics_intake.main_subtitle', { name: staff?.name || '' })} sticky onClose={() => setShowClose(true)} />

      {/* Outgoing / Incoming switch */}
      <div style={{ display: 'flex', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)' }}>
        <div style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 12, fontWeight: 800, color: ACC, borderBottom: `2px solid ${ACC}` }}>{tc('logistics_intake.tab_outgoing')}</div>
        <button onClick={() => router.push('/logistics/collect')} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--pos-muted)', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer' }}>{tc('logistics_intake.tab_incoming')}</button>
      </div>

      {/* Progress (decorative; current step announced via aria-current) */}
      <div style={{ padding: '10px 16px', background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', display: 'flex', gap: 4 }} aria-hidden>
        {steps.map((s, i) => (
          <div key={s.id} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 4, borderRadius: 4, marginBottom: 4, background: i < stepIdx ? GREEN : i === stepIdx ? ACC : 'var(--pos-border)' }} />
            <div style={{ fontSize: 9, fontWeight: 700, color: i === stepIdx ? ACC : i < stepIdx ? GREEN : 'var(--pos-hint)' }}>{s.emoji}</div>
          </div>
        ))}
      </div>

      <main style={{ maxWidth: 500, margin: '0 auto', padding: '16px 16px 0' }}>

        {/* SENDER */}
        {step === 'sender' && (
          <section aria-labelledby="h-sender">
            <h1 id="h-sender" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.sender_heading')}</h1>
            <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 18px' }}>{tc('logistics_intake.sender_intro')}</p>
            <Field label={tc('logistics_intake.field_full_name_required')}><input value={senderName} onChange={e => setSenderName(e.target.value)} maxLength={120} autoComplete="off" placeholder={tc('logistics_intake.sender_name_placeholder')} style={inputSx} /></Field>
            <Field label={tc('logistics_intake.field_phone_required')}><input value={senderPhone} onChange={e => setSenderPhone(e.target.value)} type="tel" inputMode="tel" maxLength={32} autoComplete="off" placeholder={tc('logistics_intake.sender_phone_placeholder')} style={inputSx} /></Field>
            <Field label={tc('logistics_intake.field_id_optional')} hint={tc('logistics_intake.sender_id_hint')}>
              <input value={senderIdNum} onChange={e => setSenderIdNum(e.target.value)} maxLength={40} autoComplete="off" placeholder={tc('logistics_intake.id_placeholder')} style={inputSx} />
            </Field>
            <ScanIdButton tc={tc} busy={scanningId === 'sender'} msg={idMsgFor === 'sender' ? idScanMsg : ''} onClick={() => senderIdCamRef.current?.click()} />
            <input ref={senderIdCamRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} aria-label={tc('logistics_intake.aria_photograph_sender_id')} onChange={e => { const f = e.target.files?.[0]; if (f) handleIdScan(f, 'sender'); e.target.value = '' }} />
            <NextButton disabled={!senderName.trim() || !senderPhone.trim()} onClick={() => setStep('receiver')}>{tc('logistics_intake.next_receiver')}</NextButton>
          </section>
        )}

        {/* RECEIVER */}
        {step === 'receiver' && (
          <section aria-labelledby="h-recv">
            <BackButton onClick={() => setStep('sender')} />
            <h1 id="h-recv" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.receiver_heading')}</h1>
            <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 18px' }}>{tc('logistics_intake.receiver_intro')}</p>
            <Field label={tc('logistics_intake.field_full_name_required')}><input value={recvName} onChange={e => setRecvName(e.target.value)} maxLength={120} autoComplete="off" placeholder={tc('logistics_intake.recv_name_placeholder')} style={inputSx} /></Field>
            <Field label={tc('logistics_intake.field_phone_required')}><input value={recvPhone} onChange={e => setRecvPhone(e.target.value)} type="tel" inputMode="tel" maxLength={32} autoComplete="off" placeholder={tc('logistics_intake.recv_phone_placeholder')} style={inputSx} /></Field>
            <Field label={tc('logistics_intake.field_id_optional')} hint={tc('logistics_intake.recv_id_hint')}><input value={recvIdNum} onChange={e => setRecvIdNum(e.target.value)} maxLength={40} autoComplete="off" placeholder={tc('logistics_intake.id_placeholder')} style={inputSx} /></Field>
            <ScanIdButton tc={tc} busy={scanningId === 'receiver'} msg={idMsgFor === 'receiver' ? idScanMsg : ''} onClick={() => recvIdCamRef.current?.click()} />
            <input ref={recvIdCamRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} aria-label={tc('logistics_intake.aria_photograph_receiver_id')} onChange={e => { const f = e.target.files?.[0]; if (f) handleIdScan(f, 'receiver'); e.target.value = '' }} />

            <ChoiceGroup label={tc('logistics_intake.delivery_type_label')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['branch_to_branch', 'door_to_door'] as const).map(dt => (
                  <button key={dt} type="button" aria-pressed={deliveryType === dt} onClick={() => setDeliveryType(dt)}
                    style={choiceSx(deliveryType === dt)}>{dt === 'branch_to_branch' ? tc('logistics_intake.delivery_branch_to_branch') : tc('logistics_intake.delivery_door_to_door')}</button>
                ))}
              </div>
            </ChoiceGroup>

            {deliveryType === 'branch_to_branch' ? (
              routes.length === 0 ? (
                <div style={{ background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, fontSize: 13, color: 'var(--pos-ink)' }}>
                  {tc('logistics_intake.no_routes_notice')}
                </div>
              ) : (
                <Field label={tc('logistics_intake.destination_label')} hint={tc('logistics_intake.destination_hint')}>
                  <select value={selectedRouteId} style={selectSx}
                    onChange={e => {
                      const r = routes.find(x => x.id === e.target.value) || null
                      setSelectedRouteId(e.target.value)
                      setDestBranchId(r?.destination_branch_id || '')
                      setFeeEdited(false)
                      applyRoutePrice(r, weightKg)
                    }}>
                    <option value="">{tc('logistics_intake.destination_placeholder')}</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.destination?.name || r.name || tc('logistics_intake.route_fallback')}{r.flat_rate != null ? ` · ${sym}${r.flat_rate}` : r.price_per_kg != null ? ` · ${sym}${r.price_per_kg}/kg` : ''}
                      </option>
                    ))}
                  </select>
                </Field>
              )
            ) : (
              <>
                <Field label={tc('logistics_intake.delivery_address_label')}><input value={deliveryAddress} onChange={e => setDelivAddress(e.target.value)} maxLength={200} placeholder={tc('logistics_intake.delivery_address_placeholder')} style={inputSx} /></Field>
                <Field label={tc('logistics_intake.destination_city_label')}><input value={destCity} onChange={e => setDestCity(e.target.value)} maxLength={80} placeholder={tc('logistics_intake.destination_city_placeholder')} style={inputSx} /></Field>
              </>
            )}
            <NextButton
              disabled={!recvName.trim() || !recvPhone.trim() || (deliveryType === 'branch_to_branch' ? !selectedRouteId : !deliveryAddress.trim() || !destCity.trim())}
              onClick={() => setStep('parcel')}>{tc('logistics_intake.next_parcel')}</NextButton>
          </section>
        )}

        {/* PARCEL */}
        {step === 'parcel' && (
          <section aria-labelledby="h-parcel">
            <BackButton onClick={() => setStep('receiver')} />
            <h1 id="h-parcel" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.parcel_heading')}</h1>
            <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 18px' }}>{tc('logistics_intake.parcel_intro')}</p>
            <Field label={tc('logistics_intake.field_description')}><input value={description} onChange={e => setDescription(e.target.value)} maxLength={200} placeholder={tc('logistics_intake.description_placeholder')} style={inputSx} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 0 }}>
              <Field label={tc('logistics_intake.field_weight')}><input value={weightKg} onChange={e => { setWeightKg(e.target.value); applyRoutePrice(selectedRoute, e.target.value) }} type="number" min="0" step="0.1" inputMode="decimal" placeholder={tc('logistics_intake.weight_placeholder')} style={inputSx} /></Field>
              <Field label={tc('logistics_intake.field_declared_value', { symbol: sym })}><input value={declaredValue} onChange={e => setDeclaredVal(e.target.value)} type="number" min="0" step="1" inputMode="decimal" placeholder={tc('logistics_intake.declared_value_placeholder')} style={inputSx} /></Field>
            </div>
            <ChoiceGroup label={tc('logistics_intake.parcel_size_label')} hint={tc('logistics_intake.parcel_size_hint')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {(['S', 'M', 'L', 'XL'] as const).map(sz => (
                  <button key={sz} type="button" aria-pressed={parcelSize === sz} onClick={() => setParcelSize(sz)} style={{ ...choiceSx(parcelSize === sz), padding: '10px 4px', fontSize: 15, fontWeight: 800 }}>{sz}</button>
                ))}
              </div>
            </ChoiceGroup>
            <Field label={tc('logistics_intake.shipping_fee_label', { symbol: sym })} hint={selectedRoute && !feeEdited ? tc('logistics_intake.shipping_fee_hint_auto') : tc('logistics_intake.shipping_fee_hint_manual')}>
              <input value={feeCharged} onChange={e => { setFeeEdited(true); setFeeCharged(e.target.value) }} type="number" min="0" step="1" inputMode="decimal" placeholder={tc('logistics_intake.fee_placeholder')} style={{ ...inputSx, fontSize: 20, fontWeight: 800, color: ACC }} />
            </Field>
            <NextButton disabled={false} onClick={() => setStep('photo')}>{tc('logistics_intake.next_photo')}</NextButton>
          </section>
        )}

        {/* PHOTO */}
        {step === 'photo' && (
          <section aria-labelledby="h-photo">
            <BackButton onClick={() => setStep('parcel')} />
            <h1 id="h-photo" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.photo_heading')}</h1>
            <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 18px' }}>{tc('logistics_intake.photo_intro')}</p>
            <ErrorText>{photoErr}</ErrorText>
            {photoDataUrl ? (
              <div style={{ position: 'relative', marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoDataUrl} alt={tc('logistics_intake.alt_captured_parcel')} style={{ width: '100%', borderRadius: 12, maxHeight: 260, objectFit: 'cover', border: `2px solid ${GREEN}` }} />
                <button type="button" onClick={clearPhoto} style={{ position: 'absolute', top: 8, right: 8, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{tc('logistics_intake.photo_retake')}</button>
              </div>
            ) : (
              <button type="button" onClick={() => cameraRef.current?.click()} disabled={photoBusy} aria-busy={photoBusy} style={{ width: '100%', aspectRatio: '4/3', background: 'var(--pos-surface)', border: `2px dashed ${ACC_B}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: photoBusy ? 'wait' : 'pointer', marginBottom: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }} aria-hidden>📷</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: ACC }}>{photoBusy ? tc('logistics_intake.photo_processing') : tc('logistics_intake.photo_tap_open_camera')}</div>
                <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics_intake.photo_formats')}</div>
              </button>
            )}
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = '' }} aria-label={tc('logistics_intake.aria_take_parcel_photo_camera')} />
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = '' }} aria-label={tc('logistics_intake.aria_choose_parcel_photo_gallery')} />
            {!photoDataUrl && (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} style={{ width: '100%', background: 'transparent', color: ACC, border: `1px solid ${ACC_B}`, borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>{tc('logistics_intake.photo_choose_gallery')}</button>
            )}
            <NextButton disabled={photoBusy} variant={photoDataUrl ? 'primary' : 'muted'} onClick={() => setStep('payment')}>{photoDataUrl ? tc('logistics_intake.next_payment') : tc('logistics_intake.photo_skip')}</NextButton>
          </section>
        )}

        {/* PAYMENT */}
        {step === 'payment' && (
          <section aria-labelledby="h-pay">
            <BackButton onClick={() => setStep('photo')} />
            <h1 id="h-pay" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.payment_heading')}</h1>
            <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 18px' }}>{tc('logistics_intake.payment_intro')}</p>
            <div style={{ background: ACC_LIGHT, border: `1px solid ${ACC_B}`, borderRadius: 12, padding: '14px 16px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{tc('logistics_intake.payment_shipping_fee')}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: ACC }}>{sym}{(parseFloat(feeCharged || '0') || 0).toFixed(2)}</div>
            </div>
            <ChoiceGroup label={tc('logistics_intake.payment_method_label')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {([{ id: 'cash', label: tc('logistics_intake.pay_method_cash') }, { id: 'card', label: tc('logistics_intake.pay_method_card') }, { id: 'mobile_money', label: tc('logistics_intake.pay_method_mobile') }] as const).map(pm => (
                  <button key={pm.id} type="button" aria-pressed={payMethod === pm.id} onClick={() => setPayMethod(pm.id)} style={choiceSx(payMethod === pm.id)}>{pm.label}</button>
                ))}
              </div>
            </ChoiceGroup>
            <ChoiceGroup label={tc('logistics_intake.payment_status_label')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {([{ id: 'paid', label: tc('logistics_intake.pay_status_paid'), c: GREEN }, { id: 'partial', label: tc('logistics_intake.pay_status_partial'), c: AMBER }, { id: 'unpaid', label: tc('logistics_intake.pay_status_unpaid'), c: RED }] as const).map(ps => (
                  <button key={ps.id} type="button" aria-pressed={payStatus === ps.id} onClick={() => setPayStatus(ps.id)}
                    style={{ padding: '12px 4px', border: `2px solid ${payStatus === ps.id ? ps.c : 'var(--pos-border)'}`, borderRadius: 10, background: payStatus === ps.id ? `color-mix(in srgb, ${ps.c} 12%, transparent)` : 'var(--pos-surface)', color: payStatus === ps.id ? ps.c : 'var(--pos-ink)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{ps.label}</button>
                ))}
              </div>
            </ChoiceGroup>
            <NextButton disabled={false} onClick={() => setStep('confirm')}>{tc('logistics_intake.review_confirm')}</NextButton>
          </section>
        )}

        {/* CONFIRM + CONSENT */}
        {step === 'confirm' && (
          <section aria-labelledby="h-confirm">
            <BackButton onClick={() => setStep('payment')} />
            <h1 id="h-confirm" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.confirm_heading')}</h1>
            <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 18px' }}>{tc('logistics_intake.confirm_intro')}</p>

            <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
              <Row label={tc('logistics_intake.row_sender')} value={`${senderName} · ${senderPhone}${senderIdNum ? tc('logistics_intake.row_id_prefix') + senderIdNum : ''}`} />
              <Row label={tc('logistics_intake.row_receiver')} value={`${recvName} · ${recvPhone}${recvIdNum ? tc('logistics_intake.row_id_prefix') + recvIdNum : ''}`} />
              <Row label={tc('logistics_intake.row_delivery')} value={deliveryType === 'branch_to_branch' ? tc('logistics_intake.delivery_branch_arrow', { dest: selectedRoute?.destination?.name || tc('logistics_intake.delivery_dash') }) : tc('logistics_intake.delivery_door_summary', { address: deliveryAddress, city: destCity })} />
              <Row label={tc('logistics_intake.row_parcel')} value={description ? tc('logistics_intake.parcel_summary_desc', { size: parcelSize, weight: weightKg || tc('logistics_intake.weight_unknown'), description }) : tc('logistics_intake.parcel_summary', { size: parcelSize, weight: weightKg || tc('logistics_intake.weight_unknown') })} />
              {photoDataUrl && <Row label={tc('logistics_intake.row_photo')} value={tc('logistics_intake.photo_attached')} />}
              <Row label={tc('logistics_intake.row_payment')} value={tc('logistics_intake.payment_summary', { symbol: sym, fee: (parseFloat(feeCharged || '0') || 0).toFixed(2), method: payMethod.replace('_', ' '), status: payStatus })} bold />
            </div>

            {/* GDPR consent */}
            <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('logistics_intake.privacy_heading')}</div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={dataConsent} onChange={e => setDataConsent(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1, accentColor: ACC, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--pos-ink)', lineHeight: 1.5 }}>
                  {tc('logistics_intake.consent_data_text')} <span style={{ fontWeight: 700, color: RED }}>{tc('logistics_intake.consent_required_word')}</span>
                </span>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={receiptConsent} onChange={e => setReceiptConsent(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1, accentColor: ACC, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--pos-ink)', lineHeight: 1.5 }}>
                  {tc('logistics_intake.consent_receipt_text', { phone: senderPhone || tc('logistics_intake.consent_their_number') })} <span style={{ color: 'var(--pos-muted)' }}>{tc('logistics_intake.consent_optional_word')}</span>
                </span>
              </label>
            </div>

            <ErrorText>{submitErr}</ErrorText>
            <button onClick={submit} disabled={submitting || !dataConsent} aria-busy={submitting}
              style={{ width: '100%', background: !dataConsent ? 'var(--pos-border)' : GREEN, color: !dataConsent ? 'var(--pos-muted)' : '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 17, fontWeight: 900, cursor: submitting ? 'wait' : !dataConsent ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? tc('logistics_intake.registering_parcel') : tc('logistics_intake.register_parcel')}
            </button>
          </section>
        )}
      </main>

      {showClose && <CloseShiftModal tc={tc} sym={sym} closeCash={closeCash} setCloseCash={setCloseCash} closingShift={closingShift} closeErr={closeErr} onClose={closeShift} onCancel={() => { setShowClose(false); setCloseErr('') }} />}
    </div>
  )
}

// ── Small presentational helpers ──────────────────────────────
function choiceSx(active: boolean): React.CSSProperties {
  return { padding: '12px 8px', border: `2px solid ${active ? ACC : 'var(--pos-border)'}`, borderRadius: 10, background: active ? ACC_LIGHT : 'var(--pos-surface)', color: active ? ACC : 'var(--pos-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }
}

function Header({ tc, title, subtitle, sticky, onClose }: { tc: Tc; title: string; subtitle: string; sticky?: boolean; onClose?: () => void }) {
  return (
    <header style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, ...(sticky ? { position: 'sticky', top: 0, zIndex: 50 } : {}) }}>
      <div style={{ fontSize: 18 }} aria-hidden>{tc('logistics_intake.header_emoji')}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{subtitle}</div>
      </div>
      {onClose && <button type="button" onClick={onClose} style={{ background: 'transparent', color: 'var(--pos-muted)', border: '1px solid var(--pos-border)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{tc('logistics_intake.header_close_shift')}</button>}
    </header>
  )
}

function ScanIdButton({ tc, busy, msg, onClick }: { tc: Tc; busy: boolean; msg: string; onClick: () => void }) {
  const low = msg.startsWith('⚠️'); const ok = msg.startsWith('✓')
  return (
    <div style={{ marginTop: -6, marginBottom: 14 }}>
      <button type="button" onClick={onClick} disabled={busy} aria-busy={busy}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_B}`, borderRadius: 10, padding: '8px 12px', fontSize: 13, fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>
        {busy ? tc('logistics_intake.scan_reading_id') : tc('logistics_intake.scan_id_autofill')}
      </button>
      {msg && <div role="status" style={{ fontSize: 11.5, marginTop: 6, color: low ? AMBER : ok ? 'var(--pos-success)' : 'var(--pos-muted)' }}>{msg}</div>}
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  const { tc } = useLang()
  return <button type="button" onClick={onClick} aria-label={tc('logistics_intake.aria_go_back')} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', marginBottom: 8, padding: 0, color: 'var(--pos-ink)' }}>←</button>
}

function NextButton({ children, disabled, onClick, variant = 'primary' }: { children: React.ReactNode; disabled: boolean; onClick: () => void; variant?: 'primary' | 'muted' }) {
  const enabled = !disabled
  const bg = !enabled ? 'var(--pos-border)' : variant === 'muted' ? 'var(--pos-border)' : ACC
  const col = !enabled || variant === 'muted' ? 'var(--pos-muted)' : '#fff'
  return (
    <button type="button" onClick={() => enabled && onClick()} disabled={disabled}
      style={{ width: '100%', background: bg, color: col, border: 'none', borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 800, cursor: enabled ? 'pointer' : 'not-allowed', marginTop: 4 }}>
      {children}
    </button>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', padding: '10px 14px', borderBottom: '1px solid var(--pos-border)', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--pos-muted)', flexShrink: 0, minWidth: 90 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: bold ? 800 : 600, color: 'var(--pos-ink)', textAlign: 'right', wordBreak: 'break-word', minWidth: 0 }}>{value}</div>
    </div>
  )
}

function CloseShiftModal({ tc, sym, closeCash, setCloseCash, closingShift, closeErr, onClose, onCancel }: {
  tc: Tc; sym: string; closeCash: string; setCloseCash: (v: string) => void; closingShift: boolean; closeErr: string; onClose: () => void; onCancel: () => void
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label={tc('logistics_intake.close_aria')} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onCancel}>
      <div style={{ background: 'var(--pos-surface)', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 4px' }}>{tc('logistics_intake.close_heading')}</h2>
        <p style={{ fontSize: 13, color: 'var(--pos-muted)', margin: '0 0 16px' }}>{tc('logistics_intake.close_intro')}</p>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 4 }}>
          {tc('logistics_intake.close_cash_label', { symbol: sym })}
          <input value={closeCash} onChange={e => setCloseCash(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" placeholder={tc('logistics_intake.close_cash_placeholder')}
            style={{ width: '100%', padding: '11px 12px', border: '1px solid var(--pos-border)', borderRadius: 10, fontSize: 18, fontWeight: 800, outline: 'none', boxSizing: 'border-box', margin: '4px 0 12px', textAlign: 'center' }} />
        </label>
        {closeErr && <div role="alert" style={{ color: RED, fontSize: 13, marginBottom: 12, padding: '10px 14px', background: 'var(--pos-danger-pale)', borderRadius: 10 }}>{closeErr}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button type="button" onClick={onCancel} style={{ padding: 13, border: '1px solid var(--pos-border)', borderRadius: 12, background: 'transparent', color: 'var(--pos-ink)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{tc('logistics_intake.close_cancel')}</button>
          <button type="button" onClick={onClose} disabled={closingShift} aria-busy={closingShift} style={{ padding: 13, border: 'none', borderRadius: 12, background: RED, color: '#fff', fontSize: 15, fontWeight: 800, cursor: closingShift ? 'wait' : 'pointer', opacity: closingShift ? 0.6 : 1 }}>{closingShift ? tc('logistics_intake.close_closing') : tc('logistics_intake.close_button')}</button>
        </div>
      </div>
    </div>
  )
}
