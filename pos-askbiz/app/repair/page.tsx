'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

const ACC = '#6366f1'
const GOOD = '#22c55e', WARN = '#f59e0b', BAD = '#ef4444', MUTED = '#94a3b8', DIM = '#64748b'
const ACC_BG = 'rgba(99,102,241,.12)', ACC_BORDER = 'rgba(99,102,241,.3)'

interface Job {
  id: string
  ticket_number: string
  status: string
  customer_name: string | null
  customer_phone: string | null
  device_model: string | null
  device_serial: string | null
  fault_description: string | null
  quoted_price: number | null
  created_at: string
  completed_at?: string | null
  updated_at?: string | null
  estimated_minutes: number | null
  assigned_staff?: { id: string; name: string; role: string } | null
  checked_in_staff?: { id: string; name: string } | null
}

const STATUS_LABEL: Record<string, string> = {
  intake: 'Intake', quoted: 'Quoted', accepted: 'Accepted',
  in_progress: 'In Progress', completed: 'Ready', collected: 'Collected', cancelled: 'Cancelled',
}
const STATUS_COLOR: Record<string, string> = {
  intake: MUTED, quoted: WARN, accepted: ACC, in_progress: '#8b5cf6',
  completed: GOOD, collected: '#64748b', cancelled: BAD,
}

function isToday(iso: string) {
  const d = new Date(iso), n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
}
function isCompletedToday(j: Job) {
  const ts = j.completed_at || j.updated_at
  return ts ? isToday(ts) : false
}
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
function daysOpen(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000))
}
function toBase64(dataUrl: string) {
  return dataUrl.replace(/^data:image\/\w+;base64,/, '')
}

export default function RepairHub() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const [sym, setSym] = useState('KSh')
  const [jobs, setJobs] = useState<Job[]>([])
  const [lowStockCount, setLowStockCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Ticket scan via camera
  const [showScan, setShowScan] = useState(false)
  const [scanMsg, setScanMsg] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanHit, setScanHit] = useState<Job | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const isEngineer = session?.role === 'engineer' || (session?.role || '').includes('technician')

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: { ...session.headers } })
      .then(r => r.json()).then(c => { if (c.currency_symbol) setSym(c.currency_symbol) }).catch(() => {})
  }, [authReady, session])

  const loadJobs = useCallback(async () => {
    if (!session) return
    setLoading(true)
    try {
      const [jobsRes, invRes] = await Promise.all([
        fetch('/api/pos/service-jobs?limit=500', { headers: { ...session.headers } }),
        fetch('/api/pos/inventory?sector=repair', { headers: { ...session.headers } }).catch(() => null),
      ])
      const data = await jobsRes.json()
      setJobs(data.jobs || [])
      if (invRes && invRes.ok) {
        const inv = await invRes.json()
        const items: any[] = inv.products || inv.inventory || inv.items || (Array.isArray(inv) ? inv : [])
        setLowStockCount(items.filter(p => Number(p.stock_qty) <= Number(p.low_stock_threshold || 0)).length)
      }
    } catch (e) { console.error('Repair hub load:', e) }
    finally { setLoading(false) }
  }, [session])

  useEffect(() => {
    if (!authReady || !session) return
    loadJobs()
    const t = setInterval(loadJobs, 30000)
    return () => clearInterval(t)
  }, [authReady, session, loadJobs])

  // Derived lists
  const active        = jobs.filter(j => ['intake', 'quoted', 'accepted', 'in_progress'].includes(j.status))
  const readyPickup   = jobs.filter(j => j.status === 'completed')
  const collectedToday = jobs.filter(j => j.status === 'collected' && isCompletedToday(j))
  const revenueToday  = collectedToday.reduce((s, j) => s + (Number(j.quoted_price) || 0), 0)
  const myJobs        = jobs.filter(j => j.assigned_staff?.id === session?.staffId && !['collected', 'cancelled'].includes(j.status))
  const unassigned    = active.filter(j => !j.assigned_staff && j.status === 'intake')
  const collected     = jobs.filter(j => ['collected', 'completed'].includes(j.status))
  const avgTurnaround = collected.length
    ? collected.reduce((s, j) => {
        const end = j.completed_at ? new Date(j.completed_at).getTime() : Date.now()
        return s + Math.max(0, (end - new Date(j.created_at).getTime()) / 86400000)
      }, 0) / collected.length
    : 0
  const recent = [...jobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8)

  // ── Camera helpers ─────────────────────────────────────────
  const startCamera = async () => {
    setScanMsg(''); setScanHit(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setShowScan(true)
    } catch {
      fileRef.current?.click()
    }
  }
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setShowScan(false)
  }
  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current) return
    const v = videoRef.current, c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    const dataUrl = c.toDataURL('image/jpeg', 0.85)
    stopCamera()
    await runScan(dataUrl)
  }
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => runScan(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  const runScan = async (dataUrl: string) => {
    setScanning(true); setScanMsg('Scanning device…'); setScanHit(null)
    try {
      const res = await fetch('/api/pos/service-jobs/scan-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({ image: toBase64(dataUrl) }),
      })
      const data = await res.json()
      const serial = data.device?.serial
      const model  = data.device?.model
      // Try to find a matching open ticket by serial or model
      const hit = jobs.find(j =>
        (serial && j.device_serial && j.device_serial.toLowerCase().includes(serial.toLowerCase())) ||
        (model  && j.device_model  && j.device_model.toLowerCase().includes(model.toLowerCase()))
      )
      if (hit) {
        setScanHit(hit)
        setScanMsg(`Found: ${hit.device_model} — Ticket #${hit.ticket_number}`)
      } else {
        setScanMsg(serial
          ? `Serial ${serial} not found. Check manually or start new intake.`
          : 'Could not read device. Try again or search manually.')
      }
    } catch {
      setScanMsg('Scan failed. Check connection.')
    }
    setScanning(false)
  }

  if (!authReady) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: MUTED, fontFamily: 'system-ui, sans-serif' }}>Loading…</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/pos')} style={{ background: '#334155', border: 'none', color: MUTED, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🔧 Repair</div>
            <div style={{ fontSize: 12, color: MUTED }}>{isEngineer ? `${session?.name || 'Engineer'} · My jobs` : 'Workshop operations'}</div>
          </div>
        </div>
        <button onClick={loadJobs} style={{ background: '#334155', border: 'none', color: MUTED, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↻ Refresh</button>
      </div>

      <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── CAMERA-FIRST QUICK ACTIONS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isEngineer ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 10 }}>
          {!isEngineer && (
            <button onClick={() => router.push('/repair/intake')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '16px 8px', borderRadius: 14, border: `1px solid ${ACC_BORDER}`, background: ACC_BG, cursor: 'pointer' }}>
              <span style={{ fontSize: 28 }}>📸</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: ACC }}>New Intake</span>
              <span style={{ fontSize: 10, color: DIM }}>scan device label</span>
            </button>
          )}
          <button onClick={() => { setScanHit(null); setScanMsg(''); startCamera() }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '16px 8px', borderRadius: 14, border: '1px solid #334155', background: '#1e293b', cursor: 'pointer' }}>
            <span style={{ fontSize: 28 }}>🔍</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Scan Ticket</span>
            <span style={{ fontSize: 10, color: DIM }}>scan device to find job</span>
          </button>
          <button onClick={() => router.push('/repair/tickets')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '16px 8px', borderRadius: 14, border: '1px solid #334155', background: '#1e293b', cursor: 'pointer' }}>
            <span style={{ fontSize: 28 }}>🎫</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>All Tickets</span>
            <span style={{ fontSize: 10, color: DIM }}>{jobs.length} total</span>
          </button>
        </div>

        {/* ── SCAN MODAL ── */}
        {showScan && (
          <div style={{ background: '#1e293b', border: `1px solid ${ACC_BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '12px 16px', display: 'flex', gap: 10 }}>
              <button onClick={captureAndScan} disabled={scanning}
                style={{ flex: 1, padding: '12px', borderRadius: 10, background: ACC, color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: scanning ? 0.6 : 1 }}>
                {scanning ? 'Scanning…' : '📷 Scan'}
              </button>
              <button onClick={stopCamera} style={{ padding: '12px 20px', borderRadius: 10, background: '#334155', color: MUTED, border: 'none', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        )}
        {!showScan && scanMsg && (
          <div style={{ background: '#1e293b', border: `1px solid ${scanHit ? GOOD : WARN}40`, borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ fontSize: 13, color: scanHit ? GOOD : WARN, fontWeight: 600, marginBottom: scanHit ? 10 : 0 }}>{scanMsg}</div>
            {scanHit && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', borderRadius: 10, padding: '12px 14px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{scanHit.device_model} <span style={{ color: DIM, fontWeight: 400 }}>#{scanHit.ticket_number}</span></div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{scanHit.customer_name || 'Walk-in'} · <span style={{ color: STATUS_COLOR[scanHit.status] }}>{STATUS_LABEL[scanHit.status]}</span></div>
                </div>
                <button onClick={() => router.push('/repair/tickets')}
                  style={{ padding: '8px 14px', borderRadius: 8, background: ACC, color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Open →
                </button>
              </div>
            )}
            <button onClick={() => { setScanMsg(''); setScanHit(null) }} style={{ marginTop: 8, fontSize: 11, color: DIM, background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
          </div>
        )}

        {/* ── ALERT: READY FOR PICKUP (counter staff) ── */}
        {!isEngineer && readyPickup.length > 0 && (
          <div style={{ background: 'rgba(22,163,74,.1)', border: `1px solid ${GOOD}40`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: GOOD }}>🔔 {readyPickup.length} device{readyPickup.length !== 1 ? 's' : ''} ready for pickup</div>
              <button onClick={() => router.push('/repair/tickets')} style={{ fontSize: 12, color: GOOD, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>View all →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {readyPickup.slice(0, 3).map(j => (
                <div key={j.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', borderRadius: 10, padding: '10px 14px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{j.device_model || 'Device'} <span style={{ color: DIM, fontWeight: 400, fontSize: 12 }}>#{j.ticket_number}</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                      {j.customer_name || 'Walk-in'}{j.customer_phone ? ` · ${j.customer_phone}` : ''} · waiting {timeAgo(j.completed_at || j.created_at)}
                    </div>
                  </div>
                  {j.quoted_price && <div style={{ fontWeight: 800, color: GOOD, fontSize: 15 }}>{sym}{Number(j.quoted_price).toFixed(2)}</div>}
                </div>
              ))}
              {readyPickup.length > 3 && <div style={{ fontSize: 12, color: DIM, textAlign: 'center' }}>+{readyPickup.length - 3} more waiting</div>}
            </div>
          </div>
        )}

        {/* ── ALERT: UNASSIGNED JOBS (counter staff) ── */}
        {!isEngineer && unassigned.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,.08)', border: `1px solid ${WARN}40`, borderRadius: 14, padding: '12px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: WARN, marginBottom: 8 }}>
              ⚠ {unassigned.length} new intake{unassigned.length !== 1 ? 's' : ''} need an engineer assigned
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {unassigned.slice(0, 3).map(j => (
                <div key={j.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{j.device_model || 'Device'} <span style={{ color: DIM, fontWeight: 400 }}>#{j.ticket_number}</span></div>
                  <button onClick={() => router.push('/repair/tickets')} style={{ fontSize: 11, color: WARN, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Assign →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MY JOBS (engineer view) ── */}
        {isEngineer && (
          <div style={{ background: '#1e293b', border: `1px solid ${ACC_BORDER}`, borderRadius: 14, padding: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: ACC, marginBottom: 12 }}>
              My Jobs {myJobs.length > 0 ? `(${myJobs.length})` : ''}
            </div>
            {myJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: DIM, fontSize: 14 }}>
                No jobs assigned to you yet. Ask your manager to assign a ticket.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {myJobs.map(j => (
                  <button key={j.id} onClick={() => router.push('/repair/tickets')}
                    style={{ background: '#0f172a', border: `1px solid ${STATUS_COLOR[j.status]}40`, borderRadius: 12, padding: '14px 16px', textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{j.device_model || 'Unknown device'}</span>
                        <span style={{ color: DIM, fontSize: 12, marginLeft: 8 }}>#{j.ticket_number}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: STATUS_COLOR[j.status] + '22', color: STATUS_COLOR[j.status] }}>
                        {STATUS_LABEL[j.status]}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED }}>
                      {j.fault_description?.slice(0, 80) || 'No description'}
                    </div>
                    <div style={{ fontSize: 11, color: DIM, marginTop: 6 }}>
                      {j.customer_name || 'Walk-in'} · {daysOpen(j.created_at)}d open
                      {j.quoted_price ? ` · ${sym}${Number(j.quoted_price).toFixed(2)}` : ''}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── KPI STRIP ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
          {[
            { label: 'Active Jobs',      value: `${active.length}`,               color: active.length > 0 ? ACC : MUTED },
            { label: 'Ready Pickup',     value: `${readyPickup.length}`,           color: readyPickup.length > 0 ? GOOD : MUTED },
            { label: 'Collected Today',  value: `${collectedToday.length}`,        color: GOOD },
            { label: 'Revenue Today',    value: `${sym}${revenueToday.toFixed(2)}`, color: GOOD },
            { label: 'Avg Turnaround',   value: `${avgTurnaround.toFixed(1)}d`,    color: avgTurnaround <= 3 ? GOOD : avgTurnaround <= 7 ? WARN : BAD },
            { label: 'Parts Low Stock',  value: lowStockCount == null ? '—' : `${lowStockCount}`, color: lowStockCount && lowStockCount > 0 ? WARN : MUTED },
          ].map((k, i) => (
            <div key={k.label} className="pos-reveal" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '14px 16px', animationDelay: `${i * 40}ms` }}>
              <div style={{ fontSize: 11, color: DIM, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* ── NAV GRID (counter staff) ── */}
        {!isEngineer && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
            {[
              { icon: '📸', label: 'New Intake',  href: '/repair/intake', desc: 'Camera-first check-in' },
              { icon: '🎫', label: 'Tickets',     href: '/repair/tickets', desc: 'Manage & update jobs' },
              { icon: '🔩', label: 'Parts',       href: '/repair/parts', desc: 'Spare parts stock' },
            ].map(n => (
              <button key={n.href} onClick={() => router.push(n.href)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{n.icon}</div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>{n.label}</div>
                <div style={{ color: DIM, fontSize: 12, marginTop: 2 }}>{n.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── RECENT TICKETS ── */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{isEngineer ? 'All Workshop Jobs' : 'Recent Tickets'}</div>
            <button onClick={() => router.push('/repair/tickets')} style={{ background: '#334155', border: 'none', color: MUTED, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              View all →
            </button>
          </div>
          {loading && jobs.length === 0 && <div style={{ color: DIM, fontSize: 13 }}>Loading…</div>}
          {!loading && recent.length === 0 && (
            <div style={{ color: DIM, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              No tickets yet.{' '}
              {!isEngineer && <button onClick={() => router.push('/repair/intake')} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Start a new intake →</button>}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map((j, idx) => (
              <button key={j.id} onClick={() => router.push('/repair/tickets')}
                className="pos-item"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
                    {j.device_model || 'Unknown device'}
                    <span style={{ color: DIM, fontWeight: 400, marginLeft: 8, fontSize: 12 }}>#{j.ticket_number}</span>
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                    {j.customer_name || 'Walk-in'} · {timeAgo(j.created_at)}
                    {j.assigned_staff ? ` · 👤 ${j.assigned_staff.name}` : ' · ⚠ unassigned'}
                    {j.quoted_price ? ` · ${sym}${Number(j.quoted_price).toFixed(2)}` : ''}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: (STATUS_COLOR[j.status] || DIM) + '22', color: STATUS_COLOR[j.status] || DIM, whiteSpace: 'nowrap', marginLeft: 10 }}>
                  {STATUS_LABEL[j.status] || j.status}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
