'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

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

const CONDITION_SLOTS = ['Front', 'Back', 'Screen', 'Sides']

const CHECKLIST_DEFAULT: ChecklistItem[] = [
  { key: 'screen', label: 'Screen test', result: 'untested' },
  { key: 'buttons', label: 'Buttons', result: 'untested' },
  { key: 'camera', label: 'Camera', result: 'untested' },
  { key: 'battery', label: 'Battery health', result: 'untested' },
  { key: 'water', label: 'Water damage indicator', result: 'untested' },
]

const DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Watch', 'Console', 'Other']
const PRIORITIES = ['normal', 'high', 'urgent']

// strip data URL prefix → raw base64 for scan-device API
function toBase64(dataUrl: string) {
  return dataUrl.replace(/^data:image\/\w+;base64,/, '')
}

export default function RepairIntake() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
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
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_DEFAULT)

  // stage 3: details
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [issue, setIssue] = useState('')
  const [deviceType, setDeviceType] = useState('Phone')
  const [estCost, setEstCost] = useState('')
  const [priority, setPriority] = useState('normal')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // stage 4: done
  const [ticketNumber, setTicketNumber] = useState('')
  const [createdJobId, setCreatedJobId] = useState('')

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: { ...session.headers } }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
      if (c.staff_sector && c.staff_sector !== 'repair') router.push('/pos')
    }).catch(() => {})
    return () => stopCamera()
  }, [authReady, session])

  // ── Camera helpers ──────────────────────────────────────
  const openCamera = useCallback(async (purpose: 'scan' | 'condition') => {
    capturePurpose.current = purpose
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setCameraActive(true)
    } catch (err: any) {
      // Permission denied or no camera — fall back to file input (capture attr opens native camera on mobile)
      const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
      setCameraError(denied ? 'Camera permission denied. Use the photo button instead.' : 'Camera unavailable. Use the photo button instead.')
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

  const captureFromVideo = useCallback((): string | null => {
    if (!canvasRef.current || !videoRef.current || !videoRef.current.videoWidth) return null
    const canvas = canvasRef.current, video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.85)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (capturePurpose.current === 'scan') runScan(dataUrl)
      else addConditionPhoto(dataUrl)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  // ── Stage 1: device scan ────────────────────────────────
  const captureForScan = () => {
    const dataUrl = captureFromVideo()
    if (!dataUrl) { setScanError('Could not capture frame'); return }
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
        setScanError(data.error || 'Could not read device label. Try again or enter manually.')
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
      setScanError('Scan failed. Check your connection or enter manually.')
    }
    setScanning(false)
  }

  const skipScan = () => { stopCamera(); setScanError(''); setScanConfidence(null) }

  // ── Stage 2: condition photos ───────────────────────────
  const captureCondition = () => {
    const dataUrl = captureFromVideo()
    if (!dataUrl) return
    addConditionPhoto(dataUrl)
  }

  const addConditionPhoto = (dataUrl: string) => {
    setPhotos(prev => {
      const label = CONDITION_SLOTS[prev.length] || `Photo ${prev.length + 1}`
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
    if (conditionNotes.trim()) parts.push(`Condition: ${conditionNotes.trim()}`)
    const failed = checklist.filter(c => c.result === 'fail').map(c => c.label)
    if (failed.length) parts.push(`Failed checks: ${failed.join(', ')}`)
    const passed = checklist.filter(c => c.result === 'pass').map(c => c.label)
    if (passed.length) parts.push(`Passed checks: ${passed.join(', ')}`)
    return parts.join('. ') || 'Device intake'
  }

  const submit = async () => {
    if (!issue.trim()) { setSubmitError('Issue description is required'); return }
    setSubmitting(true); setSubmitError('')
    try {
      const deviceDesc = [deviceType, device.color, device.storage].filter(Boolean).join(' · ') || null
      const res = await fetch('/api/pos/service-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({
          customer_name: customerName.trim() || null,
          customer_phone: customerPhone.trim() || null,
          device_model: device.model?.trim() || null,
          device_serial: device.serial?.trim() || null,
          device_description: deviceDesc,
          fault_description: buildFaultDescription(),
          quoted_price: estCost ? Number(estCost) : null,
          intake_photo_url: photos[0]?.dataUrl || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to create ticket')
        setSubmitting(false)
        return
      }
      const job = data.job
      setTicketNumber(job?.ticket_number || '')
      setCreatedJobId(job?.id || '')

      // Upload remaining condition photos (first one already saved as intake_photo_url)
      if (job?.id && photos.length > 0) {
        for (const p of photos) {
          fetch('/api/pos/service-jobs/upload-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...session?.headers },
            body: JSON.stringify({ image: p.dataUrl, job_id: job.id, type: 'intake' }),
          }).catch(() => {})
        }
      }
      setStage('done')
    } catch {
      setSubmitError('Failed to create ticket. Check your connection.')
    }
    setSubmitting(false)
  }

  const resetAll = () => {
    setStage('device_scan')
    setDevice({ model: '', serial: '' }); setScanConfidence(null); setWarrantyInfo(null); setScanError('')
    setPhotos([]); setConditionNotes(''); setChecklist(CHECKLIST_DEFAULT)
    setCustomerName(''); setCustomerPhone(''); setIssue(''); setDeviceType('Phone'); setEstCost(''); setPriority('normal')
    setSubmitError(''); setTicketNumber(''); setCreatedJobId('')
  }

  // ── Styles ──────────────────────────────────────────────
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #334155', fontSize: 15, fontFamily: 'inherit', background: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontSize: 12, color: MUTED, marginBottom: 5, display: 'block' }
  const btnPrimary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnSecondary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: '#334155', color: MUTED, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const card: React.CSSProperties = { background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: 18 }

  if (!authReady) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: MUTED, fontFamily: 'system-ui, sans-serif' }}>Loading…</div>

  const stageIndex = ['device_scan', 'condition_photos', 'details', 'done'].indexOf(stage)
  const stageLabels = ['Scan', 'Condition', 'Details', 'Done']

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* shared hidden elements */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { stopCamera(); router.push('/repair') }} style={{ background: '#334155', border: 'none', color: MUTED, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: ACC }}>🔧 New Intake</div>
          <div style={{ fontSize: 12, color: MUTED }}>Camera-first device check-in</div>
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
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Scan device label</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>Point the camera at the IMEI/serial sticker (usually on the back or under the battery).</div>

              {/* viewfinder */}
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4 / 3', marginBottom: 12 }}>
                <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} />
                {!cameraActive && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: DIM, gap: 8 }}>
                    <div style={{ fontSize: 40 }}>📷</div>
                    <div style={{ fontSize: 13 }}>{scanning ? 'Reading label…' : 'Camera off'}</div>
                  </div>
                )}
                {scanning && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, border: '3px solid #fff', borderTopColor: ACC, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Reading device label…</span>
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
                  ? <button onClick={() => openCamera('scan')} disabled={scanning} style={{ ...btnPrimary, opacity: scanning ? 0.6 : 1 }}>📷 Open camera</button>
                  : <button onClick={stopCamera} style={btnSecondary}>Stop camera</button>}
                <button onClick={() => { capturePurpose.current = 'scan'; fileRef.current?.click() }} disabled={scanning} style={{ ...btnSecondary, opacity: scanning ? 0.6 : 1 }}>🖼 Photo</button>
              </div>
            </div>

            {/* warranty alert */}
            {warrantyInfo && (
              <div className="pos-banner" style={{ ...card, borderColor: warrantyInfo.is_under_warranty ? GOOD : WARN, background: warrantyInfo.is_under_warranty ? 'rgba(34,197,94,.08)' : 'rgba(245,158,11,.08)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: warrantyInfo.is_under_warranty ? GOOD : WARN }}>
                  {warrantyInfo.is_under_warranty ? '✓ Under warranty' : 'Warranty expired'}
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                  Previous repair #{warrantyInfo.previous_ticket} — {warrantyInfo.previous_repair}
                  {warrantyInfo.is_under_warranty ? ` · ${warrantyInfo.days_remaining} days remaining` : ''}
                </div>
              </div>
            )}

            {/* extracted / editable device info */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Device details</div>
                {scanConfidence != null && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 12, background: (scanConfidence >= 80 ? GOOD : scanConfidence >= 50 ? WARN : BAD) + '22', color: scanConfidence >= 80 ? GOOD : scanConfidence >= 50 ? WARN : BAD }}>
                    {scanConfidence}% match
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Model</label>
                  <input style={inputStyle} value={device.model || ''} placeholder="e.g. iPhone 14 Pro" onChange={e => setDevice(d => ({ ...d, model: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Serial / IMEI</label>
                  <input style={inputStyle} value={device.serial || ''} placeholder="Serial or IMEI" onChange={e => setDevice(d => ({ ...d, serial: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Storage</label>
                    <input style={inputStyle} value={device.storage || ''} placeholder="128GB" onChange={e => setDevice(d => ({ ...d, storage: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Colour</label>
                    <input style={inputStyle} value={device.color || ''} placeholder="Graphite" onChange={e => setDevice(d => ({ ...d, color: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="pos-btn-primary" onClick={() => { stopCamera(); setStage('condition_photos') }} style={btnPrimary}>Next: Condition →</button>
              <button onClick={skipScan} style={btnSecondary}>Skip scan</button>
            </div>
          </>
        )}

        {/* ══ STAGE 2: CONDITION PHOTOS ══ */}
        {stage === 'condition_photos' && (
          <>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Document condition</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>Capture front, back, screen and sides. Protects you and the customer.</div>

              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4 / 3', marginBottom: 12 }}>
                <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} />
                {!cameraActive && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: DIM, gap: 8 }}>
                    <div style={{ fontSize: 40 }}>📸</div>
                    <div style={{ fontSize: 13 }}>Capture {CONDITION_SLOTS[photos.length] || 'extra'} view</div>
                  </div>
                )}
                {cameraActive && (
                  <button onClick={captureCondition} style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 60, height: 60, borderRadius: 30, border: '4px solid #fff', background: ACC, cursor: 'pointer' }} aria-label="Capture" />
                )}
              </div>

              {cameraError && <div style={{ color: WARN, fontSize: 12, marginBottom: 10 }}>{cameraError}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                {!cameraActive
                  ? <button onClick={() => openCamera('condition')} style={btnPrimary}>📷 Open camera</button>
                  : <button onClick={stopCamera} style={btnSecondary}>Stop camera</button>}
                <button onClick={() => { capturePurpose.current = 'condition'; fileRef.current?.click() }} style={btnSecondary}>🖼 Add photo</button>
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
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Pre-repair checklist</div>
              <div style={{ fontSize: 11, color: DIM, marginBottom: 12 }}>Tap to cycle: untested → pass → fail</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checklist.map(c => {
                  const col = c.result === 'pass' ? GOOD : c.result === 'fail' ? BAD : DIM
                  const txt = c.result === 'pass' ? 'PASS' : c.result === 'fail' ? 'FAIL' : '—'
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
              <label style={labelStyle}>Condition notes (scratches, cracks, etc.)</label>
              <textarea value={conditionNotes} onChange={e => setConditionNotes(e.target.value)} rows={3}
                placeholder="e.g. Hairline crack top-left, scuffs on back…"
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { stopCamera(); setStage('device_scan') }} style={btnSecondary}>← Back</button>
              <button className="pos-btn-primary" onClick={() => { stopCamera(); setStage('details') }} style={btnPrimary}>Next: Details →</button>
            </div>
          </>
        )}

        {/* ══ STAGE 3: DETAILS ══ */}
        {stage === 'details' && (
          <>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Customer & job details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Customer name</label>
                    <input style={inputStyle} value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} inputMode="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Phone number" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Issue description *</label>
                  <textarea value={issue} onChange={e => setIssue(e.target.value)} rows={3} placeholder="What's wrong with the device?" style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Device type</label>
                    <select style={inputStyle} value={deviceType} onChange={e => setDeviceType(e.target.value)}>
                      {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Priority</label>
                    <select style={inputStyle} value={priority} onChange={e => setPriority(e.target.value)}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Estimated cost ({sym})</label>
                  <input style={inputStyle} inputMode="decimal" value={estCost} onChange={e => setEstCost(e.target.value)} placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* summary */}
            <div style={{ ...card, background: '#0f172a' }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Summary</div>
              <div style={{ fontSize: 13, color: '#f1f5f9' }}>{device.model || 'Unknown device'}{device.serial ? ` · ${device.serial}` : ''}</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>{photos.length} photo{photos.length === 1 ? '' : 's'} · {checklist.filter(c => c.result !== 'untested').length}/{checklist.length} checks done</div>
            </div>

            {submitError && <div className="pos-banner" style={{ color: BAD, fontSize: 13 }}>{submitError}</div>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStage('condition_photos')} style={btnSecondary}>← Back</button>
              <button className="pos-btn-primary" onClick={submit} disabled={submitting} style={{ ...btnPrimary, opacity: submitting ? 0.6 : 1 }}>{submitting ? 'Creating…' : '✓ Create ticket'}</button>
            </div>
          </>
        )}

        {/* ══ STAGE 4: DONE ══ */}
        {stage === 'done' && (
          <div className="pos-sheet pos-reveal" style={{ ...card, textAlign: 'center', padding: '40px 24px' }}>
            <div className="pos-success-icon" style={{ width: 72, height: 72, borderRadius: 36, background: 'rgba(34,197,94,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GOOD} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Ticket created</div>
            {ticketNumber && <div style={{ fontSize: 18, color: ACC, fontWeight: 700, marginBottom: 6 }}>#{ticketNumber}</div>}
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{device.model || 'Device'} checked in for {customerName || 'walk-in customer'}. {customerPhone ? 'SMS confirmation sent.' : ''}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
              <button onClick={() => window.print()} style={{ ...btnSecondary, flex: 'none' }}>🖨 Print ticket</button>
              <button onClick={() => router.push('/repair/tickets')} style={{ ...btnSecondary, flex: 'none' }}>🎫 View tickets</button>
              <button className="pos-btn-primary" onClick={resetAll} style={{ ...btnPrimary, flex: 'none' }}>📸 New intake</button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
