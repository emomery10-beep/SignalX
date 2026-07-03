'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import { compressImageToDataUrl } from '@/lib/pos-image-compress'
import { enqueueOfflineWrite, replayOfflineQueue, generateClientTxId, OfflineQueueQuotaError } from '@/lib/pos-offline-queue'
import { bulkUpsertResourceFromApi, isResourceCacheStale } from '@/lib/pos-resource-cache'
import { getOfflineResourceTypesForRole } from '@/lib/pos-offline-manifest'

type Tc = (key: string, vars?: Record<string, string | number>) => string

const ACC = '#6366f1'
const GOOD = '#22c55e', WARN = '#f59e0b', BAD = '#ef4444', MUTED = '#94a3b8', DIM = '#64748b'

type Stage = 'device_scan' | 'condition_photos' | 'details' | 'done'

interface DeviceInfo {
  model: string | null
  serial: string | null
  manufacture_date?: string | null
  storage?: string | null
  color?: string | null
  model_number?: string | null
  confidence?: number
}

interface ConditionPhoto { label: string; dataUrl: string }

interface ChecklistItem { key: string; label: string; result: 'untested' | 'pass' | 'fail' }

// slot label keys → tc('repair_intake.slot_*'); index used for stage-2 photo labelling
const CONDITION_SLOT_KEYS = ['slot_front', 'slot_back', 'slot_screen', 'slot_sides']
const buildConditionSlots = (tc: Tc) => CONDITION_SLOT_KEYS.map(k => tc('repair_intake.' + k))

const CHECKLIST_KEYS = ['screen', 'buttons', 'camera', 'battery', 'water']
const checklistLabel = (tc: Tc, key: string) => tc('repair_intake.check_' + key)
const buildChecklistDefault = (tc: Tc): ChecklistItem[] =>
  CHECKLIST_KEYS.map(key => ({ key, label: checklistLabel(tc, key), result: 'untested' as const }))

// option value → label-key suffix
const DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Watch', 'Console', 'Other']
const deviceTypeLabel = (tc: Tc, t: string) => tc('repair_intake.device_type_' + t.toLowerCase())
const PRIORITIES = ['normal', 'high', 'urgent']
const priorityLabel = (tc: Tc, p: string) => tc('repair_intake.priority_' + p)

// strip data URL prefix → raw base64 for scan-device API
function toBase64(dataUrl: string) {
  return dataUrl.replace(/^data:image\/\w+;base64,/, '')
}

export default function RepairIntake() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const { tc } = useLang()
  const [sym, setSym] = useState('£')

  const [stage, setStage] = useState<Stage>('device_scan')

  // camera
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  // what the camera shutter should do for the current capture
  const capturePurpose = useRef<'scan' | 'condition'>('scan')

  // stage 1: device scan
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [device, setDevice] = useState<DeviceInfo>({ model: '', serial: '' })
  const [scanConfidence, setScanConfidence] = useState<number | null>(null)
  const [warrantyInfo, setWarrantyInfo] = useState<any>(null)

  // stage 2: condition
  const [photos, setPhotos] = useState<ConditionPhoto[]>([])
  const [conditionNotes, setConditionNotes] = useState('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => buildChecklistDefault(tc))
  const conditionSlots = buildConditionSlots(tc)

  // stage 3: details
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [issue, setIssue] = useState('')
  const [deviceType, setDeviceType] = useState('Phone')
  const [estCost, setEstCost] = useState('')
  const [priority, setPriority] = useState('normal')
  const [assignedTo, setAssignedTo] = useState('')
  const [engineers, setEngineers] = useState<{ id: string; name: string; role: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // stage 4: done
  const [ticketNumber, setTicketNumber] = useState('')
  const [createdJobId, setCreatedJobId] = useState('')
  const [pendingSync, setPendingSync] = useState(false)
  const [pendingClientTxId, setPendingClientTxId] = useState('')

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: { ...session.headers } }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
      if (c.staff_sector && c.staff_sector !== 'repair') router.push('/pos')
    }).catch(() => {})
    // Load engineers for assignment dropdown
    fetch('/api/pos/staff/list', { headers: { ...session.headers } })
      .then(r => r.json()).then(d => {
        const all: { id: string; name: string; role: string }[] = d.staff || []
        setEngineers(all.filter(s =>
          s.role === 'engineer' || s.role === 'repair' ||
          s.role.includes('engineer') || s.role.includes('technician')
        ))
      }).catch(() => {})

    // Background prefetch so recent jobs are visible offline (throttled).
    // Role → resource-types mapping lives in one place (pos-offline-manifest.ts)
    // rather than each screen hardcoding its own list.
    for (const entry of getOfflineResourceTypesForRole(session.role)) {
      isResourceCacheStale(entry.resourceType, session.ownerId, 6 * 60 * 60 * 1000).then(stale => {
        if (stale) bulkUpsertResourceFromApi(entry.resourceType, entry.endpoint, session.ownerId, session.staffId || '', { listKey: entry.listKey }).catch(() => {})
      }).catch(() => {})
    }

    return () => stopCamera()
  }, [authReady, session])

  // ── Offline queue replay ────────────────────────────────
  useEffect(() => {
    if (!session) return
    const replay = () => {
      replayOfflineQueue(session.ownerId, session.staffId || '').then(result => {
        if (!pendingSync || !pendingClientTxId) return
        const match = result.succeededResponses.find(r => r.client_tx_id === pendingClientTxId)
        if (!match) return
        if (match.body?.job) {
          setTicketNumber(match.body.job.ticket_number || '')
          setCreatedJobId(match.body.job.id || '')
          setPendingSync(false)
        } else {
          setSubmitError(match.body?.error || tc('repair_intake.create_ticket_failed'))
        }
      }).catch(() => {})
    }
    replay()
    window.addEventListener('online', replay)
    return () => window.removeEventListener('online', replay)
  }, [session, pendingSync, pendingClientTxId, tc])

  // ── Camera helpers ──────────────────────────────────────
  const openCamera = useCallback(async (purpose: 'scan' | 'condition') => {
    capturePurpose.current = purpose
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) }
      setCameraActive(true)
    } catch (err: any) {
      // Permission denied or no camera — fall back to file input (capture attr opens native camera on mobile)
      const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
      setCameraError(denied ? tc('repair_intake.camera_permission_denied') : tc('repair_intake.camera_unavailable'))
      setCameraActive(false)
      fileRef.current?.click()
    }
  }, [])

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraActive(false)
  }, [])

  // Compressed (maxEdge/quality match logistics' ID-scan settings) —
  // uncompressed photos would blow through the offline outbox's IndexedDB
  // quota fast once queued, and a device-scan + 4 condition photos in one
  // intake is 5+ full-resolution camera frames.
  const captureFromVideo = useCallback(async (): Promise<string | null> => {
    if (!canvasRef.current || !videoRef.current || !videoRef.current.videoWidth) return null
    const canvas = canvasRef.current, video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    return compressImageToDataUrl(canvas, { maxEdge: 1800, quality: 0.85 })
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    compressImageToDataUrl(file, { maxEdge: 1800, quality: 0.85 }).then(dataUrl => {
      if (capturePurpose.current === 'scan') runScan(dataUrl)
      else addConditionPhoto(dataUrl)
    }).catch(() => {})
    e.target.value = ''
  }, [])

  // ── Stage 1: device scan ────────────────────────────────
  const captureForScan = async () => {
    const dataUrl = await captureFromVideo()
    if (!dataUrl) { setScanError(tc('repair_intake.could_not_capture_frame')); return }
    stopCamera()
    runScan(dataUrl)
  }

  const runScan = async (dataUrl: string) => {
    setScanning(true); setScanError('')
    try {
      const res = await fetch('/api/pos/service-jobs/scan-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({ image: toBase64(dataUrl) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setScanError(data.error || tc('repair_intake.scan_read_failed'))
        setScanning(false)
        return
      }
      const d: DeviceInfo = data.device || {}
      setDevice({
        model: d.model || '',
        serial: d.serial || '',
        storage: d.storage || '',
        color: d.color || '',
        model_number: d.model_number || '',
      })
      setScanConfidence(typeof d.confidence === 'number' ? d.confidence : null)
      setWarrantyInfo(data.warranty_info || null)
    } catch {
      setScanError(tc('repair_intake.scan_failed'))
    }
    setScanning(false)
  }

  const skipScan = () => { stopCamera(); setScanError(''); setScanConfidence(null) }

  // ── Stage 2: condition photos ───────────────────────────
  const captureCondition = async () => {
    const dataUrl = await captureFromVideo()
    if (!dataUrl) return
    addConditionPhoto(dataUrl)
  }

  const addConditionPhoto = (dataUrl: string) => {
    setPhotos(prev => {
      const label = conditionSlots[prev.length] || tc('repair_intake.photo_n', { n: prev.length + 1 })
      return [...prev, { label, dataUrl }]
    })
  }

  const removePhoto = (idx: number) => setPhotos(prev => prev.filter((_, i) => i !== idx))

  const cycleChecklist = (key: string) => {
    setChecklist(prev => prev.map(c => {
      if (c.key !== key) return c
      const next = c.result === 'untested' ? 'pass' : c.result === 'pass' ? 'fail' : 'untested'
      return { ...c, result: next }
    }))
  }

  // ── Stage 3: submit ─────────────────────────────────────
  const buildFaultDescription = () => {
    const parts: string[] = []
    if (issue.trim()) parts.push(issue.trim())
    if (conditionNotes.trim()) parts.push(tc('repair_intake.fault_condition_prefix', { notes: conditionNotes.trim() }))
    const failed = checklist.filter(c => c.result === 'fail').map(c => c.label)
    if (failed.length) parts.push(tc('repair_intake.fault_failed_checks', { checks: failed.join(', ') }))
    const passed = checklist.filter(c => c.result === 'pass').map(c => c.label)
    if (passed.length) parts.push(tc('repair_intake.fault_passed_checks', { checks: passed.join(', ') }))
    return parts.join('. ') || tc('repair_intake.fault_default')
  }

  const submit = async () => {
    if (!issue.trim()) { setSubmitError(tc('repair_intake.issue_required')); return }
    if (!session) return
    setSubmitting(true); setSubmitError('')
    const deviceDesc = [deviceType, device.color, device.storage].filter(Boolean).join(' · ') || null
    const clientTxId = generateClientTxId('job')
    // All photos (device scan already consumed by scan-device separately;
    // condition photos here) travel inline in this one request — not as a
    // separate fire-and-forget upload loop, which silently lost photos
    // when offline and couldn't be queued at all.
    const body = {
      customer_name: customerName.trim() || null,
      customer_phone: customerPhone.trim() || null,
      device_model: device.model?.trim() || null,
      device_serial: device.serial?.trim() || null,
      device_description: deviceDesc,
      fault_description: buildFaultDescription(),
      quoted_price: estCost ? Number(estCost) : null,
      intake_photo_url: photos[0]?.dataUrl || null,
      condition_photos: photos.map(p => p.dataUrl),
      assigned_to: assignedTo || null,
      client_tx_id: clientTxId,
    }
    try {
      const res = await fetch('/api/pos/service-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || tc('repair_intake.create_ticket_failed'))
        setSubmitting(false)
        return
      }
      const job = data.job
      setTicketNumber(job?.ticket_number || '')
      setCreatedJobId(job?.id || '')
      setStage('done')
    } catch {
      // Network failure — queue for replay when back online. Ticket
      // number is server-generated, so it isn't known yet; the done
      // screen shows a pending-sync placeholder until reconciliation.
      try {
        await enqueueOfflineWrite({
          client_tx_id: clientTxId, owner_id: session.ownerId, staff_id: session.staffId || '',
          endpoint: '/api/pos/service-jobs', method: 'POST', body, created_at: new Date().toISOString(),
        })
        setPendingSync(true)
        setPendingClientTxId(clientTxId)
        setStage('done')
      } catch (queueErr) {
        setSubmitError(queueErr instanceof OfflineQueueQuotaError ? queueErr.message : tc('repair_intake.create_ticket_failed_conn'))
      }
    }
    setSubmitting(false)
  }

  const resetAll = () => {
    setStage('device_scan')
    setDevice({ model: '', serial: '' }); setScanConfidence(null); setWarrantyInfo(null); setScanError('')
    setPhotos([]); setConditionNotes(''); setChecklist(buildChecklistDefault(tc))
    setCustomerName(''); setCustomerPhone(''); setIssue(''); setDeviceType('Phone'); setEstCost(''); setPriority('normal'); setAssignedTo('')
    setSubmitError(''); setTicketNumber(''); setCreatedJobId('')
    setPendingSync(false); setPendingClientTxId('')
  }

  // ── Styles ──────────────────────────────────────────────
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #334155', fontSize: 15, fontFamily: 'inherit', background: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontSize: 12, color: MUTED, marginBottom: 5, display: 'block' }
  const btnPrimary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnSecondary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: '#334155', color: MUTED, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const card: React.CSSProperties = { background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: 18 }

  if (!authReady) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{tc('repair_intake.loading')}</div>

  const stageIndex = ['device_scan', 'condition_photos', 'details', 'done'].indexOf(stage)
  const stageLabels = [tc('repair_intake.stage_scan'), tc('repair_intake.stage_condition'), tc('repair_intake.stage_details'), tc('repair_intake.stage_done')]

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* shared hidden elements */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { stopCamera(); router.push('/repair') }} style={{ background: '#334155', border: 'none', color: MUTED, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: ACC }}>{tc('repair_intake.header_title')}</div>
          <div style={{ fontSize: 12, color: MUTED }}>{tc('repair_intake.header_subtitle')}</div>
        </div>
      </div>

      {/* Stage progress */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 20px 0', maxWidth: 640, margin: '0 auto' }}>
        {stageLabels.map((lbl, i) => (
          <div key={lbl} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 4, borderRadius: 2, background: i <= stageIndex ? ACC : '#334155', marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: i <= stageIndex ? ACC : DIM, textTransform: 'uppercase', letterSpacing: 0.5 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '18px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ══ STAGE 1: DEVICE SCAN ══ */}
        {stage === 'device_scan' && (
          <>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tc('repair_intake.scan_title')}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>{tc('repair_intake.scan_subtitle')}</div>

              {/* viewfinder */}
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4 / 3', marginBottom: 12 }}>
                <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} />
                {!cameraActive && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: DIM, gap: 8 }}>
                    <div style={{ fontSize: 40 }}>📷</div>
                    <div style={{ fontSize: 13 }}>{scanning ? tc('repair_intake.reading_label_short') : tc('repair_intake.camera_off')}</div>
                  </div>
                )}
                {scanning && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, border: '3px solid #fff', borderTopColor: ACC, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{tc('repair_intake.reading_device_label')}</span>
                  </div>
                )}
                {cameraActive && !scanning && (
                  <button onClick={captureForScan} style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 60, height: 60, borderRadius: 30, border: '4px solid #fff', background: ACC, cursor: 'pointer' }} aria-label="Capture" />
                )}
              </div>

              {cameraError && <div style={{ color: WARN, fontSize: 12, marginBottom: 10 }}>{cameraError}</div>}
              {scanError && <div style={{ color: BAD, fontSize: 13, marginBottom: 10 }}>{scanError}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                {!cameraActive
                  ? <button onClick={() => openCamera('scan')} disabled={scanning} style={{ ...btnPrimary, opacity: scanning ? 0.6 : 1 }}>{tc('repair_intake.open_camera')}</button>
                  : <button onClick={stopCamera} style={btnSecondary}>{tc('repair_intake.stop_camera')}</button>}
                <button onClick={() => { capturePurpose.current = 'scan'; fileRef.current?.click() }} disabled={scanning} style={{ ...btnSecondary, opacity: scanning ? 0.6 : 1 }}>{tc('repair_intake.photo_btn')}</button>
              </div>
            </div>

            {/* warranty alert */}
            {warrantyInfo && (
              <div className="pos-banner" style={{ ...card, borderColor: warrantyInfo.is_under_warranty ? GOOD : WARN, background: warrantyInfo.is_under_warranty ? 'rgba(34,197,94,.08)' : 'rgba(245,158,11,.08)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: warrantyInfo.is_under_warranty ? GOOD : WARN }}>
                  {warrantyInfo.is_under_warranty ? tc('repair_intake.under_warranty') : tc('repair_intake.warranty_expired')}
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                  {tc('repair_intake.previous_repair_line', { ticket: warrantyInfo.previous_ticket, repair: warrantyInfo.previous_repair })}
                  {warrantyInfo.is_under_warranty ? tc('repair_intake.days_remaining_suffix', { days: warrantyInfo.days_remaining }) : ''}
                </div>
              </div>
            )}

            {/* extracted / editable device info */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{tc('repair_intake.device_details')}</div>
                {scanConfidence != null && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 12, background: (scanConfidence >= 80 ? GOOD : scanConfidence >= 50 ? WARN : BAD) + '22', color: scanConfidence >= 80 ? GOOD : scanConfidence >= 50 ? WARN : BAD }}>
                    {tc('repair_intake.percent_match', { percent: scanConfidence })}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>{tc('repair_intake.model')}</label>
                  <input style={inputStyle} value={device.model || ''} placeholder={tc('repair_intake.model_placeholder')} onChange={e => setDevice(d => ({ ...d, model: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>{tc('repair_intake.serial_imei')}</label>
                  <input style={inputStyle} value={device.serial || ''} placeholder={tc('repair_intake.serial_imei_placeholder')} onChange={e => setDevice(d => ({ ...d, serial: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>{tc('repair_intake.storage')}</label>
                    <input style={inputStyle} value={device.storage || ''} placeholder={tc('repair_intake.storage_placeholder')} onChange={e => setDevice(d => ({ ...d, storage: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>{tc('repair_intake.colour')}</label>
                    <input style={inputStyle} value={device.color || ''} placeholder={tc('repair_intake.colour_placeholder')} onChange={e => setDevice(d => ({ ...d, color: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="pos-btn-primary" onClick={() => { stopCamera(); setStage('condition_photos') }} style={btnPrimary}>{tc('repair_intake.next_condition')}</button>
              <button onClick={skipScan} style={btnSecondary}>{tc('repair_intake.skip_scan')}</button>
            </div>
          </>
        )}

        {/* ══ STAGE 2: CONDITION PHOTOS ══ */}
        {stage === 'condition_photos' && (
          <>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tc('repair_intake.condition_title')}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>{tc('repair_intake.condition_subtitle')}</div>

              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4 / 3', marginBottom: 12 }}>
                <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} />
                {!cameraActive && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: DIM, gap: 8 }}>
                    <div style={{ fontSize: 40 }}>📸</div>
                    <div style={{ fontSize: 13 }}>{tc('repair_intake.capture_view', { view: conditionSlots[photos.length] || tc('repair_intake.extra') })}</div>
                  </div>
                )}
                {cameraActive && (
                  <button onClick={captureCondition} style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 60, height: 60, borderRadius: 30, border: '4px solid #fff', background: ACC, cursor: 'pointer' }} aria-label="Capture" />
                )}
              </div>

              {cameraError && <div style={{ color: WARN, fontSize: 12, marginBottom: 10 }}>{cameraError}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                {!cameraActive
                  ? <button onClick={() => openCamera('condition')} style={btnPrimary}>{tc('repair_intake.open_camera')}</button>
                  : <button onClick={stopCamera} style={btnSecondary}>{tc('repair_intake.stop_camera')}</button>}
                <button onClick={() => { capturePurpose.current = 'condition'; fileRef.current?.click() }} style={btnSecondary}>{tc('repair_intake.add_photo')}</button>
              </div>

              {/* thumbnails */}
              {photos.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  {photos.map((p, i) => (
                    <div key={i} className="pos-item" style={{ position: 'relative', width: 76, animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                      <img src={p.dataUrl} alt={p.label} style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 8, border: '1px solid #334155' }} />
                      <div style={{ fontSize: 9, color: MUTED, textAlign: 'center', marginTop: 2 }}>{p.label}</div>
                      <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, background: BAD, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* pre-repair checklist */}
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{tc('repair_intake.checklist_title')}</div>
              <div style={{ fontSize: 11, color: DIM, marginBottom: 12 }}>{tc('repair_intake.checklist_hint')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checklist.map(c => {
                  const col = c.result === 'pass' ? GOOD : c.result === 'fail' ? BAD : DIM
                  const txt = c.result === 'pass' ? tc('repair_intake.result_pass') : c.result === 'fail' ? tc('repair_intake.result_fail') : tc('repair_intake.result_untested')
                  return (
                    <button key={c.key} onClick={() => cycleChecklist(c.key)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', border: `1px solid ${c.result === 'untested' ? '#334155' : col + '66'}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <span style={{ fontSize: 13, color: '#f1f5f9' }}>{c.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: col, padding: '3px 10px', borderRadius: 12, background: col + '22' }}>{txt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* condition notes */}
            <div style={card}>
              <label style={labelStyle}>{tc('repair_intake.condition_notes_label')}</label>
              <textarea value={conditionNotes} onChange={e => setConditionNotes(e.target.value)} rows={3}
                placeholder={tc('repair_intake.condition_notes_placeholder')}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { stopCamera(); setStage('device_scan') }} style={btnSecondary}>{tc('repair_intake.back')}</button>
              <button className="pos-btn-primary" onClick={() => { stopCamera(); setStage('details') }} style={btnPrimary}>{tc('repair_intake.next_details')}</button>
            </div>
          </>
        )}

        {/* ══ STAGE 3: DETAILS ══ */}
        {stage === 'details' && (
          <>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{tc('repair_intake.details_title')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>{tc('repair_intake.customer_name')}</label>
                    <input style={inputStyle} value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder={tc('repair_intake.customer_name_placeholder')} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>{tc('repair_intake.phone')}</label>
                    <input style={inputStyle} inputMode="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder={tc('repair_intake.phone_placeholder')} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{tc('repair_intake.issue_description')}</label>
                  <textarea value={issue} onChange={e => setIssue(e.target.value)} rows={3} placeholder={tc('repair_intake.issue_placeholder')} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>{tc('repair_intake.device_type')}</label>
                    <select style={inputStyle} value={deviceType} onChange={e => setDeviceType(e.target.value)}>
                      {DEVICE_TYPES.map(t => <option key={t} value={t}>{deviceTypeLabel(tc, t)}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>{tc('repair_intake.priority')}</label>
                    <select style={inputStyle} value={priority} onChange={e => setPriority(e.target.value)}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{priorityLabel(tc, p)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{tc('repair_intake.estimated_cost', { sym })}</label>
                  <input style={inputStyle} inputMode="decimal" value={estCost} onChange={e => setEstCost(e.target.value)} placeholder={tc('repair_intake.estimated_cost_placeholder')} />
                </div>
                {engineers.length > 0 && (
                  <div>
                    <label style={labelStyle}>{tc('repair_intake.assign_engineer')}</label>
                    <select style={inputStyle} value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                      <option value="">{tc('repair_intake.unassigned')}</option>
                      {engineers.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* summary */}
            <div style={{ ...card, background: '#0f172a' }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{tc('repair_intake.summary')}</div>
              <div style={{ fontSize: 13, color: '#f1f5f9' }}>{device.model || tc('repair_intake.unknown_device')}{device.serial ? ' · ' + device.serial : ''}</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>{tc('repair_intake.photos_checks_line', { photos: photos.length, photoWord: photos.length === 1 ? tc('repair_intake.photo_singular') : tc('repair_intake.photo_plural'), done: checklist.filter(c => c.result !== 'untested').length, total: checklist.length })}</div>
            </div>

            {submitError && <div className="pos-banner" style={{ color: BAD, fontSize: 13 }}>{submitError}</div>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStage('condition_photos')} style={btnSecondary}>{tc('repair_intake.back')}</button>
              <button className="pos-btn-primary" onClick={submit} disabled={submitting} style={{ ...btnPrimary, opacity: submitting ? 0.6 : 1 }}>{submitting ? tc('repair_intake.creating') : tc('repair_intake.create_ticket')}</button>
            </div>
          </>
        )}

        {/* ══ STAGE 4: DONE ══ */}
        {stage === 'done' && (
          <div className="pos-sheet pos-reveal" style={{ ...card, textAlign: 'center', padding: '40px 24px' }}>
            <div className="pos-success-icon" style={{ width: 72, height: 72, borderRadius: 36, background: 'rgba(34,197,94,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GOOD} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{tc('repair_intake.ticket_created')}</div>
            {pendingSync ? (
              <div style={{ fontSize: 13, color: WARN, fontWeight: 600, marginBottom: 6 }}>{tc('repair_intake.pending_sync')}</div>
            ) : ticketNumber ? (
              <div style={{ fontSize: 18, color: ACC, fontWeight: 700, marginBottom: 6 }}>#{ticketNumber}</div>
            ) : null}
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{tc('repair_intake.checked_in_for', { device: device.model || tc('repair_intake.device_fallback'), customer: customerName || tc('repair_intake.walk_in_customer') })}{customerPhone ? tc('repair_intake.sms_sent') : ''}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
              <button onClick={() => window.print()} style={{ ...btnSecondary, flex: 'none' }}>{tc('repair_intake.print_ticket')}</button>
              <button onClick={() => router.push('/repair/tickets')} style={{ ...btnSecondary, flex: 'none' }}>{tc('repair_intake.view_tickets')}</button>
              <button className="pos-btn-primary" onClick={resetAll} style={{ ...btnPrimary, flex: 'none' }}>{tc('repair_intake.new_intake')}</button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
