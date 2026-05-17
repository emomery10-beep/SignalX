'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const ACC = '#d08a59'
const ACC_BG = 'rgba(208,138,89,.08)'
const ACC_BORDER = 'rgba(208,138,89,.2)'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'

type JobStatus = 'intake' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'collected' | 'cancelled'
type SubView = 'queue' | 'new_job' | 'job_detail'

interface ServiceJob {
  id: string; ticket_number: string; status: JobStatus
  customer_phone?: string; customer_name?: string; customer_id?: string
  device_model?: string; device_serial?: string; device_description?: string
  fault_description: string
  intake_photo_url?: string; checkout_photo_url?: string
  preset_id?: string; original_quoted_price?: number; quoted_price?: number
  checked_in_by?: string; assigned_to?: string; checked_out_by?: string
  engineer_notes?: string; additional_issues?: string
  estimated_minutes?: number; due_by?: string
  paid_by_transaction?: string
  location_id?: string; intake_lat?: number; intake_lng?: number
  cancel_reason?: string; warranty_expires_at?: string; warranty_job_id?: string
  created_at: string; updated_at: string
  checked_in_staff?: { id: string; name: string; role?: string } | null
  assigned_staff?: { id: string; name: string; role?: string } | null
  checked_out_staff?: { id: string; name: string; role?: string } | null
  customer?: { id: string; phone: string; name?: string } | null
  location?: { id: string; name: string } | null
  preset?: { id: string; name: string; category: string } | null
}

interface ServicePreset {
  id: string; name: string; category: string; price: number; estimated_minutes: number; active: boolean
}

interface HistoryEntry {
  id: string; from_status: string | null; to_status: string; notes?: string; created_at: string
  staff?: { id: string; name: string; role?: string } | null
}

interface StaffMember {
  id: string; name: string; role: string; active: boolean; location_id?: string
}

interface Props {
  currencySymbol: string
  selectedLocation: string
  staff: StaffMember[]
  notify: (msg: string, ok?: boolean) => void
}

const STATUS_COLORS: Record<JobStatus, { bg: string; text: string; label: string }> = {
  intake: { bg: 'rgba(99,102,241,.1)', text: '#6366f1', label: 'Intake' },
  quoted: { bg: 'rgba(202,138,4,.1)', text: AMBER, label: 'Quoted' },
  accepted: { bg: 'rgba(59,130,246,.1)', text: '#3b82f6', label: 'Accepted' },
  in_progress: { bg: 'rgba(168,85,247,.1)', text: '#a855f7', label: 'In Progress' },
  completed: { bg: 'rgba(22,163,74,.1)', text: GREEN, label: 'Completed' },
  collected: { bg: 'rgba(22,163,74,.2)', text: GREEN, label: 'Collected' },
  cancelled: { bg: 'rgba(220,38,38,.1)', text: RED, label: 'Cancelled' },
}

function StatusBadge({ status }: { status: JobStatus }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.intake
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.text, background: s.bg, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function fmt(symbol: string, amount: number): string {
  const num = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const needsSpace = symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${needsSpace ? ' ' : ''}${num}`
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function ServiceJobsTab({ currencySymbol, selectedLocation, staff, notify }: Props) {
  const defaultHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
  const [view, setView] = useState<SubView>('queue')
  const [jobs, setJobs] = useState<ServiceJob[]>([])
  const [presets, setPresets] = useState<ServicePreset[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Multi-device / post-creation
  const [showAddAnother, setShowAddAnother] = useState(false)
  const [lastCreatedJob, setLastCreatedJob] = useState<ServiceJob | null>(null)

  // New job form state
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [warrantyInfo, setWarrantyInfo] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [formData, setFormData] = useState({
    customer_phone: '', customer_name: '', device_model: '', device_serial: '',
    device_description: '', fault_description: '', preset_id: '', quoted_price: '',
    estimated_minutes: '', intake_photo_url: '',
  })

  // ── Fetch jobs ─────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (selectedLocation !== 'all') params.set('location_id', selectedLocation)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/pos/service-jobs?${params}`)
      const data = await res.json()
      if (data.jobs) setJobs(data.jobs)
    } catch (err) {
      console.error('Failed to fetch service jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, selectedLocation, searchQuery])

  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch('/api/pos/service-jobs/presets')
      const data = await res.json()
      if (data.presets) setPresets(data.presets)
    } catch (err) {
      console.error('Failed to fetch presets:', err)
    }
  }, [])

  useEffect(() => { fetchJobs(); fetchPresets() }, [fetchJobs, fetchPresets])

  // ── Fetch history for selected job ─────────────────────────
  const fetchHistory = useCallback(async (jobId: string) => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`/api/pos/service-jobs/history?job_id=${jobId}`)
      const data = await res.json()
      if (data.history) setHistory(data.history)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  // ── Camera for device scan ─────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setScanning(true)
    } catch (err) {
      notify('Camera access denied', false)
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setScanning(false)
  }

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)

    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.85).split(',')[1]
    stopCamera()

    notify('Scanning device label...')
    try {
      const res = await fetch('/api/pos/service-jobs/scan-device', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()

      if (data.device) {
        setScanResult(data.device)
        setWarrantyInfo(data.warranty_info)
        setFormData(prev => ({
          ...prev,
          device_model: data.device.model || prev.device_model,
          device_serial: data.device.serial || prev.device_serial,
          device_description: [data.device.color, data.device.storage, data.device.model_number].filter(Boolean).join(', ') || prev.device_description,
          intake_photo_url: `data:image/jpeg;base64,${base64}`, // stored temporarily, uploaded properly after job creation
        }))
        notify(`Identified: ${data.device.model || 'Unknown device'}`)
      } else {
        notify('Could not read device label — fill in manually', false)
      }
    } catch (err) {
      notify('Scan failed', false)
    }
  }

  // ── Create job ─────────────────────────────────────────────
  const createJob = async () => {
    if (!formData.fault_description.trim()) {
      notify('Fault description is required', false)
      return
    }

    // Get geolocation
    let intake_lat: number | null = null
    let intake_lng: number | null = null
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      )
      intake_lat = pos.coords.latitude
      intake_lng = pos.coords.longitude
    } catch {}

    try {
      const res = await fetch('/api/pos/service-jobs', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          ...formData,
          quoted_price: formData.quoted_price ? Number(formData.quoted_price) : null,
          estimated_minutes: formData.estimated_minutes ? parseInt(formData.estimated_minutes) : null,
          preset_id: formData.preset_id || null,
          intake_lat, intake_lng,
          location_id: selectedLocation !== 'all' ? selectedLocation : null,
          warranty_job_id: warrantyInfo?.previous_job_id || null,
        }),
      })
      const data = await res.json()
      if (data.error) {
        notify(data.error, false)
        return
      }
      // Upload intake photo via storage if present
      if (formData.intake_photo_url && data.job.id) {
        fetch('/api/pos/service-jobs/upload-photo', {
          method: 'POST',
          headers: defaultHeaders,
          body: JSON.stringify({ image: formData.intake_photo_url, job_id: data.job.id, type: 'intake' }),
        }).catch(err => console.error('Intake photo upload failed:', err))
      }

      notify(`Job created: ${data.job.ticket_number}`)
      setLastCreatedJob(data.job)
      // Keep customer info but clear device-specific fields for multi-device flow
      const keepCustomer = { customer_phone: formData.customer_phone, customer_name: formData.customer_name }
      setFormData({ ...keepCustomer, device_model: '', device_serial: '', device_description: '', fault_description: '', preset_id: '', quoted_price: '', estimated_minutes: '', intake_photo_url: '' })
      setScanResult(null)
      setWarrantyInfo(null)
      setShowAddAnother(true)
      fetchJobs()
    } catch (err) {
      notify('Failed to create job', false)
    }
  }

  // ── Update job status ──────────────────────────────────────
  const updateJob = async (jobId: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/pos/service-jobs', {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify({ id: jobId, ...updates }),
      })
      const data = await res.json()
      if (data.error) {
        notify(data.error, false)
        return
      }
      notify('Job updated')
      setSelectedJob(data.job)
      fetchJobs()
      if (selectedJob) fetchHistory(jobId)
    } catch (err) {
      notify('Failed to update job', false)
    }
  }

  // ── Checkout photo capture ─────────────────────────────────
  const [captureCheckout, setCaptureCheckout] = useState(false)
  const checkoutVideoRef = useRef<HTMLVideoElement>(null)
  const checkoutStreamRef = useRef<MediaStream | null>(null)

  const startCheckoutCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
      })
      checkoutStreamRef.current = stream
      if (checkoutVideoRef.current) {
        checkoutVideoRef.current.srcObject = stream
        await checkoutVideoRef.current.play()
      }
      setCaptureCheckout(true)
    } catch {
      notify('Camera access denied', false)
    }
  }

  const captureCheckoutPhoto = async (jobId: string) => {
    if (!checkoutVideoRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    canvasRef.current.width = checkoutVideoRef.current.videoWidth
    canvasRef.current.height = checkoutVideoRef.current.videoHeight
    ctx.drawImage(checkoutVideoRef.current, 0, 0)

    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.85)
    checkoutStreamRef.current?.getTracks().forEach(t => t.stop())
    setCaptureCheckout(false)

    // Upload via storage API
    try {
      const res = await fetch('/api/pos/service-jobs/upload-photo', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ image: base64, job_id: jobId, type: 'checkout' }),
      })
      const data = await res.json()
      if (data.url) {
        setSelectedJob(prev => prev ? { ...prev, checkout_photo_url: data.url } : prev)
        notify('Checkout photo saved')
        fetchJobs()
      } else {
        notify(data.error || 'Upload failed', false)
      }
    } catch {
      notify('Photo upload failed', false)
    }
  }

  // ── Send quote via SMS ─────────────────────────────────────
  const sendQuoteLink = async (jobId: string) => {
    try {
      const res = await fetch('/api/pos/service-jobs/quote-link', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ job_id: jobId }),
      })
      const data = await res.json()
      if (data.error) { notify(data.error, false); return }
      notify(data.message || 'Quote sent')
      if (selectedJob) fetchHistory(jobId)
    } catch {
      notify('Failed to send quote', false)
    }
  }

  // ── Open job detail ────────────────────────────────────────
  const openJobDetail = (job: ServiceJob) => {
    setSelectedJob(job)
    setView('job_detail')
    fetchHistory(job.id)
  }

  // ── Styles ─────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${ACC_BORDER}`,
    background: 'var(--sf)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit',
  }
  const btnPrimary: React.CSSProperties = {
    padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff',
    fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  }
  const btnSecondary: React.CSSProperties = {
    padding: '10px 20px', borderRadius: 10, background: 'transparent', color: 'var(--tx)',
    fontSize: 13, fontWeight: 600, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit',
  }

  // ═══════════════════ RENDER ════════════════════════════════

  // ── NEW JOB FORM ──────────────────────────────────────────
  if (view === 'new_job') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => { setView('queue'); stopCamera() }} style={{ ...btnSecondary, padding: '6px 14px' }}>← Back</button>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>New Service Job</div>
      </div>

      {/* Camera / Scan section */}
      <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, border: `1px solid ${ACC_BORDER}`, background: ACC_BG }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Scan Device Label</div>
        {!scanning ? (
          <button onClick={startCamera} style={btnPrimary}>📷 Open Camera</button>
        ) : (
          <div>
            <video ref={videoRef} style={{ width: '100%', maxWidth: 400, borderRadius: 8 }} playsInline muted />
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={captureAndScan} style={btnPrimary}>📸 Capture & Scan</button>
              <button onClick={stopCamera} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {scanResult && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 6 }}>Device Identified (confidence: {scanResult.confidence}%)</div>
            <div style={{ fontSize: 13 }}>{scanResult.model || 'Unknown'}{scanResult.storage ? ` · ${scanResult.storage}` : ''}{scanResult.color ? ` · ${scanResult.color}` : ''}</div>
            {scanResult.serial && <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>Serial: {scanResult.serial}</div>}
          </div>
        )}

        {warrantyInfo && (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: warrantyInfo.is_under_warranty ? 'rgba(22,163,74,.08)' : 'rgba(220,38,38,.08)', border: `1px solid ${warrantyInfo.is_under_warranty ? GREEN : RED}40` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: warrantyInfo.is_under_warranty ? GREEN : RED }}>
              {warrantyInfo.is_under_warranty ? `Under Warranty (${warrantyInfo.days_remaining} days left)` : 'Warranty Expired'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
              Previous repair: {warrantyInfo.previous_ticket} — {warrantyInfo.previous_repair}
            </div>
          </div>
        )}
      </div>

      {/* Form fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Customer Phone</label>
          <input value={formData.customer_phone} onChange={e => setFormData(p => ({ ...p, customer_phone: e.target.value }))} style={inputStyle} placeholder="+44..." />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Customer Name</label>
          <input value={formData.customer_name} onChange={e => setFormData(p => ({ ...p, customer_name: e.target.value }))} style={inputStyle} placeholder="Name" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Device Model</label>
          <input value={formData.device_model} onChange={e => setFormData(p => ({ ...p, device_model: e.target.value }))} style={inputStyle} placeholder="iPhone 14 Pro" />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Serial / IMEI</label>
          <input value={formData.device_serial} onChange={e => setFormData(p => ({ ...p, device_serial: e.target.value }))} style={inputStyle} placeholder="Serial number" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Device Description</label>
        <input value={formData.device_description} onChange={e => setFormData(p => ({ ...p, device_description: e.target.value }))} style={inputStyle} placeholder="Color, storage, physical condition..." />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Fault Description *</label>
        <textarea value={formData.fault_description} onChange={e => setFormData(p => ({ ...p, fault_description: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Describe the issue..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Service Preset</label>
          <select value={formData.preset_id} onChange={e => {
            const preset = presets.find(p => p.id === e.target.value)
            setFormData(p => ({
              ...p,
              preset_id: e.target.value,
              quoted_price: preset ? String(preset.price) : p.quoted_price,
              estimated_minutes: preset ? String(preset.estimated_minutes) : p.estimated_minutes,
            }))
          }} style={inputStyle}>
            <option value="">Select preset...</option>
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {fmt(currencySymbol, p.price)}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Quoted Price</label>
          <input type="number" value={formData.quoted_price} onChange={e => setFormData(p => ({ ...p, quoted_price: e.target.value }))} style={inputStyle} placeholder="0.00" step="0.01" />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4, display: 'block' }}>Est. Minutes</label>
          <input type="number" value={formData.estimated_minutes} onChange={e => setFormData(p => ({ ...p, estimated_minutes: e.target.value }))} style={inputStyle} placeholder="60" />
        </div>
      </div>

      {/* Add Another Device prompt */}
      {showAddAnother && lastCreatedJob && (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: `1px solid ${GREEN}40`, background: 'rgba(22,163,74,.05)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 6 }}>
            Job {lastCreatedJob.ticket_number} created successfully
          </div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 12 }}>
            Same customer ({formData.customer_name || formData.customer_phone || 'Walk-in'}) dropping off another device?
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setShowAddAnother(false); setLastCreatedJob(null) }} style={btnPrimary}>
              + Add Another Device
            </button>
            <button onClick={() => { setShowAddAnother(false); setLastCreatedJob(null); setFormData({ customer_phone: '', customer_name: '', device_model: '', device_serial: '', device_description: '', fault_description: '', preset_id: '', quoted_price: '', estimated_minutes: '', intake_photo_url: '' }); setView('queue') }} style={btnSecondary}>
              Done
            </button>
          </div>
        </div>
      )}

      {!showAddAnother && (
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={createJob} style={btnPrimary}>Create Job</button>
          <button onClick={() => setView('queue')} style={btnSecondary}>Cancel</button>
        </div>
      )}
    </div>
  )

  // ── JOB DETAIL ────────────────────────────────────────────
  if (view === 'job_detail' && selectedJob) {
    const j = selectedJob
    const canAssign = ['intake', 'quoted', 'accepted'].includes(j.status)
    const engineers = staff.filter(s => s.role === 'engineer' && s.active)
    const noCheckoutPhoto = !j.checkout_photo_url && ['completed'].includes(j.status)

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setView('queue'); setSelectedJob(null) }} style={{ ...btnSecondary, padding: '6px 14px' }}>← Back</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>{j.ticket_number}</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{j.device_model || 'Unknown device'} · {timeAgo(j.created_at)}</div>
          </div>
          <StatusBadge status={j.status} />
        </div>

        {/* Job info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4 }}>Customer</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{j.customer_name || j.customer_phone || 'Walk-in'}</div>
            {j.customer_phone && <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{j.customer_phone}</div>}
          </div>
          <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4 }}>Device</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{j.device_model || 'Not scanned'}</div>
            {j.device_serial && <div style={{ fontSize: 12, color: 'var(--tx3)' }}>SN: {j.device_serial}</div>}
          </div>
          <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4 }}>Price</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{j.quoted_price ? fmt(currencySymbol, j.quoted_price) : 'Not quoted'}</div>
            {j.original_quoted_price && j.original_quoted_price !== j.quoted_price && (
              <div style={{ fontSize: 12, color: AMBER }}>Originally: {fmt(currencySymbol, j.original_quoted_price)}</div>
            )}
          </div>
        </div>

        {/* Fault & notes */}
        <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4 }}>Fault Description</div>
          <div style={{ fontSize: 13 }}>{j.fault_description}</div>
        </div>

        {j.engineer_notes && (
          <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 4 }}>Engineer Notes</div>
            <div style={{ fontSize: 13 }}>{j.engineer_notes}</div>
          </div>
        )}

        {j.additional_issues && (
          <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${AMBER}40`, background: `rgba(202,138,4,.05)`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: AMBER, marginBottom: 4 }}>Additional Issues Found</div>
            <div style={{ fontSize: 13 }}>{j.additional_issues}</div>
          </div>
        )}

        {/* Assignment */}
        {canAssign && (
          <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${ACC_BORDER}`, background: ACC_BG, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Assign to Engineer</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {engineers.length === 0 && <div style={{ fontSize: 12, color: 'var(--tx3)' }}>No engineers added yet — add staff with the "engineer" role</div>}
              {engineers.map(eng => (
                <button key={eng.id} onClick={() => updateJob(j.id, { assigned_to: eng.id, status: j.status === 'accepted' ? 'in_progress' : j.status })}
                  style={{ ...btnSecondary, padding: '6px 12px', fontSize: 12, background: j.assigned_to === eng.id ? ACC_BG : 'transparent', borderColor: j.assigned_to === eng.id ? ACC : ACC_BORDER }}>
                  {eng.name} {j.assigned_to === eng.id && '✓'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warranty info */}
        {j.warranty_expires_at && (
          <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${GREEN}40`, background: 'rgba(22,163,74,.05)', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: GREEN, marginBottom: 4 }}>Warranty</div>
            <div style={{ fontSize: 13 }}>
              Expires: {new Date(j.warranty_expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              {new Date(j.warranty_expires_at) > new Date()
                ? ` (${Math.ceil((new Date(j.warranty_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left)`
                : ' (expired)'}
            </div>
          </div>
        )}

        {/* Checkout photo warning */}
        {noCheckoutPhoto && (
          <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${AMBER}40`, background: 'rgba(202,138,4,.05)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: AMBER }}>No checkout photo attached</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Recommended: take a photo of the repaired device before handing back to customer</div>
            </div>
            <button onClick={startCheckoutCamera} style={{ ...btnSecondary, padding: '6px 12px', fontSize: 12, marginLeft: 'auto' }}>📷 Take Photo</button>
          </div>
        )}

        {captureCheckout && (
          <div style={{ marginBottom: 16 }}>
            <video ref={checkoutVideoRef} style={{ width: '100%', maxWidth: 400, borderRadius: 8 }} playsInline muted />
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => captureCheckoutPhoto(j.id)} style={btnPrimary}>📸 Capture</button>
              <button onClick={() => { checkoutStreamRef.current?.getTracks().forEach(t => t.stop()); setCaptureCheckout(false) }} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {j.status === 'intake' && (
            <button onClick={() => {
              const price = prompt('Enter quoted price:')
              if (price) updateJob(j.id, { status: 'quoted', quoted_price: Number(price) })
            }} style={btnPrimary}>Set Quote</button>
          )}
          {j.status === 'quoted' && (
            <>
              <button onClick={() => updateJob(j.id, { status: 'accepted' })} style={btnPrimary}>Customer Accepted</button>
              <button onClick={() => sendQuoteLink(j.id)} style={btnSecondary}>Send Quote via SMS</button>
            </>
          )}
          {j.status === 'accepted' && j.assigned_to && (
            <button onClick={() => updateJob(j.id, { status: 'in_progress' })} style={btnPrimary}>Start Repair</button>
          )}
          {j.status === 'in_progress' && (
            <>
              <button onClick={() => updateJob(j.id, { status: 'completed' })} style={{ ...btnPrimary, background: GREEN }}>Mark Complete</button>
              <button onClick={() => {
                const notes = prompt('Describe additional issues:')
                const price = prompt('New quoted price:')
                if (notes && price) updateJob(j.id, { status: 'quoted', additional_issues: notes, quoted_price: Number(price), history_note: `Re-quoted: ${notes}` })
              }} style={{ ...btnSecondary, borderColor: AMBER, color: AMBER }}>Found More Issues</button>
            </>
          )}
          {j.status === 'completed' && (
            <button onClick={() => updateJob(j.id, { status: 'collected' })} style={{ ...btnPrimary, background: GREEN }}>Customer Collected & Paid</button>
          )}
          {!['collected', 'cancelled'].includes(j.status) && (
            <button onClick={() => {
              const reason = prompt('Cancel reason:')
              if (reason) updateJob(j.id, { status: 'cancelled', cancel_reason: reason })
            }} style={{ ...btnSecondary, borderColor: RED, color: RED }}>Cancel Job</button>
          )}
        </div>

        {/* Engineer notes input (for engineers working on the job) */}
        {j.status === 'in_progress' && (
          <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Update Engineer Notes</div>
            <textarea
              defaultValue={j.engineer_notes || ''}
              onBlur={e => { if (e.target.value !== (j.engineer_notes || '')) updateJob(j.id, { engineer_notes: e.target.value }) }}
              style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
              placeholder="Notes about the repair work..."
            />
          </div>
        )}

        {/* Timeline / History */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Timeline</div>
          {historyLoading ? (
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Loading...</div>
          ) : history.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>No history yet</div>
          ) : (
            <div style={{ borderLeft: `2px solid ${ACC_BORDER}`, paddingLeft: 16 }}>
              {history.map((h, i) => (
                <div key={h.id} style={{ marginBottom: i < history.length - 1 ? 16 : 0, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%', background: ACC, border: '2px solid var(--sf)' }} />
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    {h.from_status ? <><StatusBadge status={h.from_status as JobStatus} /> → </> : null}
                    <StatusBadge status={h.to_status as JobStatus} />
                  </div>
                  {h.notes && <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>{h.notes}</div>}
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>
                    {h.staff?.name || 'System'} · {new Date(h.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {j.intake_photo_url && (
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Intake Photo</div>
              <img src={j.intake_photo_url} alt="Intake" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
            </div>
          )}
          {j.checkout_photo_url && (
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Checkout Photo</div>
              <img src={j.checkout_photo_url} alt="Checkout" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── JOB QUEUE (default view) ──────────────────────────────
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, flex: 1 }}>Service Jobs</div>
        <button onClick={() => setView('new_job')} style={btnPrimary}>+ New Job</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {(['all', 'intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected', 'cancelled'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '5px 12px', borderRadius: 8, border: statusFilter === s ? `1.5px solid ${ACC}` : '1px solid var(--b)',
            background: statusFilter === s ? ACC_BG : 'var(--sf)', color: statusFilter === s ? ACC : 'var(--tx3)',
            fontSize: 12, fontWeight: statusFilter === s ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {s === 'all' ? 'All' : STATUS_COLORS[s]?.label || s}
            {s !== 'all' && <span style={{ marginLeft: 4, opacity: 0.6 }}>({jobs.filter(j => j.status === s).length})</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{ ...inputStyle, maxWidth: 300 }} placeholder="Search ticket, customer, device..." />
      </div>

      {/* Jobs list */}
      {loading ? (
        <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx3)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔧</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>No service jobs yet</div>
          <div style={{ fontSize: 13, marginTop: 8, maxWidth: 300, margin: '8px auto 0' }}>
            Create your first job by clicking "New Job" and scanning a device.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {jobs.map(j => (
            <div key={j.id} onClick={() => openJobDetail(j)}
              style={{ padding: 14, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', transition: 'border-color .15s', display: 'flex', alignItems: 'center', gap: 14 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b)')}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{j.ticket_number}</span>
                  <StatusBadge status={j.status} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {j.device_model || 'Unknown device'} — {j.fault_description}
                </div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                  {j.customer_name || j.customer_phone || 'Walk-in'}
                  {j.assigned_staff && ` · Engineer: ${j.assigned_staff.name}`}
                  {j.location && ` · ${j.location.name}`}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {j.quoted_price && <div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(currencySymbol, j.quoted_price)}</div>}
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{timeAgo(j.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
