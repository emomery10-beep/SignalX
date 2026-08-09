'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import { compressImageToDataUrl } from '@/lib/pos-image-compress'
import { enqueueOfflineWrite, replayOfflineQueue, generateClientTxId, OfflineQueueQuotaError } from '@/lib/pos-offline-queue'
import { bulkUpsertResourceFromApi, isResourceCacheStale } from '@/lib/pos-resource-cache'
import { getOfflineResourceTypesForRole } from '@/lib/pos-offline-manifest'
import { Banner } from '@/components/ui'

type Tc = (key: string, vars?: Record<string, string | number>) => string

// ── Design tokens (from CSS variables in globals.css) ──────────────────────
// Mirrors app/factory/page.tsx's pattern.
const tokens = {
  bg:        'var(--pos-bg)',
  surface:   'var(--pos-surface)',
  border:    'var(--pos-border)',
  ink:       'var(--pos-ink)',
  muted:     'var(--pos-muted)',
  hint:      'var(--pos-hint)',
  accent:      'var(--pos-accent)',
  accentPale:  'var(--pos-accent-pale)',
  danger:      'var(--pos-danger)',
  dangerPale:  'var(--pos-danger-pale)',
  success:     'var(--pos-success)',
  successPale: 'var(--pos-success-pale)',
  warning:   'var(--pos-warning)',
  // "in_progress" status re-uses the existing factory dispatch-purple var
  // rather than inventing a new colour for this vertical.
  purple:    'var(--factory-dispatch)',
}
// globals.css has no --pos-warning-pale var (Banner.tsx hardcodes the same
// literal for the same reason) — mirrored here rather than invented.
const WARN_PALE = 'rgba(249,115,22,.08)'
const PURPLE_PALE = 'rgba(139,92,246,.14)'

interface Job {
  id: string
  ticket_number: string
  status: string
  customer_name: string | null
  customer_phone: string | null
  device_model: string | null
  device_serial: string | null
  device_description: string | null
  fault_description: string | null
  engineer_notes: string | null
  quoted_price: number | null
  intake_photo_url: string | null
  checkout_photo_url: string | null
  replaced_part_photo_url: string | null
  created_at: string
  estimated_minutes: number | null
  assigned_staff?: { id: string; name: string; role: string } | null
}

interface HistoryEntry { id: string; from_status: string | null; to_status: string; notes: string | null; created_at: string }
interface Part { id: string; name: string; qty: number; unit_cost: number; line_total: number }
interface ProgressPhoto { id: string; photo_url: string; stage: 'in_progress' | 'completed'; caption: string | null; created_at: string; shared_at: string | null }

// Columns map to the real API statuses
const COLUMN_KEYS = ['intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected']
const buildColumns = (tc: Tc): { key: string; label: string }[] =>
  COLUMN_KEYS.map(key => ({ key, label: tc('repair_tickets.col_' + key) }))
const statusLabel = (tc: Tc, status: string) => tc('repair_tickets.status_' + status)
const STATUS_COLOR: Record<string, string> = {
  intake: tokens.muted, quoted: tokens.warning, accepted: tokens.accent, in_progress: tokens.purple,
  completed: tokens.success, collected: tokens.success, cancelled: tokens.danger,
}
// Pale badge backgrounds for each status colour above — kept as a separate
// map because CSS var() strings can't be alpha-suffixed the way the old
// hex + '22' hack did.
const STATUS_BG: Record<string, string> = {
  intake: 'rgba(120,115,109,.14)', quoted: WARN_PALE, accepted: tokens.accentPale, in_progress: PURPLE_PALE,
  completed: tokens.successPale, collected: tokens.successPale, cancelled: tokens.dangerPale,
}
// Valid forward transitions (mirrors the API); label key suffix → tc('repair_tickets.action_*')
const NEXT_STATUS: Record<string, { value: string; labelKey: string }[]> = {
  intake: [{ value: 'quoted', labelKey: 'send_quote' }, { value: 'cancelled', labelKey: 'cancel' }],
  quoted: [{ value: 'accepted', labelKey: 'accept' }, { value: 'cancelled', labelKey: 'cancel' }],
  accepted: [{ value: 'in_progress', labelKey: 'start_repair' }, { value: 'cancelled', labelKey: 'cancel' }],
  in_progress: [{ value: 'completed', labelKey: 'mark_ready' }],
  completed: [{ value: 'collected', labelKey: 'collect' }, { value: 'in_progress', labelKey: 'reopen' }],
  collected: [],
  cancelled: [{ value: 'intake', labelKey: 'reopen' }],
}

function daysOpen(iso: string) { return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)) }
function fmtDate(iso: string) { return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }

export default function RepairTickets() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const { config, sym } = usePosConfig(session, authReady)
  const { tc } = useLang()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'board' | 'list'>('board')

  // detail
  const [selected, setSelected] = useState<Job | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [parts, setParts] = useState<Part[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [detailError, setDetailError] = useState('')
  // job id -> client_tx_id of its most recent not-yet-synced status change,
  // used to show a "sync pending" badge and clear it once replay resolves.
  const [pendingJobTx, setPendingJobTx] = useState<Record<string, string>>({})

  // Progress photo gallery — unlimited photos a technician can add any time
  // a job is 'in_progress' or 'completed'. Nothing sends automatically;
  // "Share update" (below) pushes whatever hasn't been shared yet as one
  // WhatsApp message. See /api/pos/service-jobs/photos[/share].
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [addingPhoto, setAddingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [sharing, setSharing] = useState(false)
  const [shareResult, setShareResult] = useState<'idle' | 'sent' | 'nothing_new' | 'no_phone' | 'error'>('idle')
  const photoFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (config?.staff_sector && config.staff_sector !== 'repair') router.push('/pos')
  }, [config, router])

  const loadJobs = useCallback(async () => {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/service-jobs?limit=500', { headers: { ...session.headers } })
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (e) { console.error('Tickets load error:', e) }
    finally { setLoading(false) }
  }, [session])

  useEffect(() => {
    if (!authReady || !session) return
    loadJobs()
    const interval = setInterval(loadJobs, 30000)

    // Background prefetch so the board is usable offline (throttled).
    for (const entry of getOfflineResourceTypesForRole(session.role)) {
      isResourceCacheStale(entry.resourceType, session.ownerId, 6 * 60 * 60 * 1000).then(stale => {
        if (stale) bulkUpsertResourceFromApi(entry.resourceType, entry.endpoint, session.ownerId, session.staffId || '', { listKey: entry.listKey }).catch(() => {})
      }).catch(() => {})
    }

    return () => clearInterval(interval)
  }, [authReady, session, loadJobs])

  // ── Offline queue replay ────────────────────────────────
  useEffect(() => {
    if (!session) return
    const replay = () => {
      replayOfflineQueue(session.ownerId, session.staffId || '').then(result => {
        if (result.succeededResponses.length === 0) return
        const resolvedTxIds = new Set(result.succeededResponses.map(r => r.client_tx_id))
        setPendingJobTx(prev => {
          const next = { ...prev }
          for (const [jobId, txId] of Object.entries(prev)) {
            if (resolvedTxIds.has(txId)) delete next[jobId]
          }
          return next
        })
        loadJobs()
      }).catch(() => {})
    }
    replay()
    window.addEventListener('online', replay)
    return () => window.removeEventListener('online', replay)
  }, [session, loadJobs])

  const loadPhotos = async (jobId: string) => {
    setPhotosLoading(true)
    try {
      const res = await fetch(`/api/pos/service-jobs/photos?job_id=${jobId}`, { headers: { ...session?.headers } })
      if (res.ok) { const d = await res.json(); setPhotos(d.photos || []) }
    } catch {}
    setPhotosLoading(false)
  }

  const openDetail = async (job: Job) => {
    setSelected(job); setHistory([]); setParts([]); setPhotos([]); setDetailError('')
    setPhotoError(''); setShareResult('idle')
    setDetailLoading(true)
    try {
      const [hRes, pRes] = await Promise.all([
        fetch(`/api/pos/service-jobs/history?job_id=${job.id}`, { headers: { ...session?.headers } }).catch(() => null),
        fetch(`/api/pos/service-jobs/parts?job_id=${job.id}`, { headers: { ...session?.headers } }).catch(() => null),
      ])
      if (hRes && hRes.ok) { const h = await hRes.json(); setHistory(h.history || []) }
      if (pRes && pRes.ok) { const p = await pRes.json(); setParts(p.parts || []) }
    } catch {}
    setDetailLoading(false)
    if (job.status === 'in_progress' || job.status === 'completed') loadPhotos(job.id)
  }

  const changeStatus = async (status: string) => {
    if (!selected || !session) return
    setUpdating(true); setDetailError('')
    const clientTxId = generateClientTxId('job_status')
    const body = { id: selected.id, status, client_tx_id: clientTxId }
    try {
      const res = await fetch('/api/pos/service-jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setDetailError(data.error || tc('repair_tickets.failed_to_update')); setUpdating(false); return }
      setSelected(data.job)
      setJobs(prev => prev.map(j => j.id === data.job.id ? { ...j, ...data.job } : j))
      openDetail(data.job)
    } catch {
      // Network failure — queue for replay. A status PATCH always targets a
      // job that already exists (no dependency-chaining problem, unlike
      // creating-then-modifying something in the same offline session), so
      // this is a straightforward queue-and-replay. Optimistically reflect
      // the intended status locally; the badge clears once replay resolves.
      try {
        await enqueueOfflineWrite({
          client_tx_id: clientTxId, owner_id: session.ownerId, staff_id: session.staffId || '',
          endpoint: '/api/pos/service-jobs', method: 'PATCH', body, created_at: new Date().toISOString(),
        })
        setPendingJobTx(prev => ({ ...prev, [selected.id]: clientTxId }))
        setSelected(prev => prev ? { ...prev, status } : prev)
        setJobs(prev => prev.map(j => j.id === selected.id ? { ...j, status } : j))
      } catch (queueErr) {
        setDetailError(queueErr instanceof OfflineQueueQuotaError ? queueErr.message : tc('repair_tickets.failed_to_update_conn'))
      }
    }
    setUpdating(false)
  }

  // ── Progress photo gallery ──────────────────────────────
  const triggerAddPhoto = () => photoFileRef.current?.click()

  const handlePhotoFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !selected || !session) return
    setAddingPhoto(true); setPhotoError('')
    // Tagged with the job's CURRENT stage — a photo taken while still
    // in_progress reads as a work-in-progress update; one taken once the
    // job is already completed reads as a finished-item photo. Matches
    // "while the work is in progress and complete" from the ask.
    const stage: 'in_progress' | 'completed' = selected.status === 'completed' ? 'completed' : 'in_progress'
    compressImageToDataUrl(file, { maxEdge: 1800, quality: 0.85 }).then(async dataUrl => {
      const res = await fetch('/api/pos/service-jobs/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({ job_id: selected.id, image: dataUrl, stage }),
      })
      const data = await res.json()
      if (!res.ok) { setPhotoError(data.error || tc('repair_tickets.photos_add_failed')); setAddingPhoto(false); return }
      setPhotos(prev => [data.photo, ...prev])
      setAddingPhoto(false)
    }).catch(() => { setPhotoError(tc('repair_tickets.photos_add_failed')); setAddingPhoto(false) })
  }

  const shareUpdate = async () => {
    if (!selected || !session) return
    setSharing(true); setShareResult('idle'); setPhotoError('')
    try {
      const res = await fetch('/api/pos/service-jobs/photos/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({ job_id: selected.id }),
      })
      const data = await res.json()
      if (!res.ok) { setShareResult('error'); setPhotoError(data.error || ''); setSharing(false); return }
      if (data.sent) {
        setShareResult('sent')
        const now = new Date().toISOString()
        setPhotos(prev => prev.map(p => p.shared_at ? p : { ...p, shared_at: now }))
      } else if (data.reason === 'nothing_new') {
        setShareResult('nothing_new')
      } else if (data.reason === 'no_customer_phone') {
        setShareResult('no_phone')
      } else {
        setShareResult('error')
        setPhotoError(data.detail?.error || '')
      }
    } catch {
      setShareResult('error')
    }
    setSharing(false)
  }

  const unsharedCount = photos.filter(p => !p.shared_at).length

  const filtered = jobs.filter(j => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [j.ticket_number, j.customer_name, j.device_model, j.device_serial, j.customer_phone]
      .filter(Boolean).some(v => (v as string).toLowerCase().includes(q))
  })

  const card: React.CSSProperties = { background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12 }
  const COLUMNS = buildColumns(tc)

  if (!authReady) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.bg, color: tokens.muted, fontFamily: 'system-ui, sans-serif' }}>{tc('repair_tickets.loading')}</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      <input ref={photoFileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoFileInput} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/repair')} style={{ background: tokens.border, border: 'none', color: tokens.muted, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: tokens.accent }}>{tc('repair_tickets.header_title')}</div>
          <div style={{ fontSize: 12, color: tokens.muted }}>{filtered.length === 1 ? tc('repair_tickets.ticket_count_one', { count: filtered.length }) : tc('repair_tickets.ticket_count_other', { count: filtered.length })}</div>
        </div>
        <div style={{ display: 'flex', background: tokens.bg, borderRadius: 8, padding: 3, gap: 2 }}>
          {(['board', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: view === v ? tokens.accent : 'transparent', color: view === v ? '#fff' : tokens.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {v === 'board' ? tc('repair_tickets.view_board') : tc('repair_tickets.view_list')}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '14px 20px 0' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tc('repair_tickets.search_placeholder')}
          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${tokens.border}`, background: tokens.surface, color: tokens.ink, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />
      </div>

      <div style={{ padding: 20 }}>
        {loading && jobs.length === 0 && <div style={{ color: tokens.hint, fontSize: 13 }}>{tc('repair_tickets.loading_tickets')}</div>}
        {!loading && filtered.length === 0 && <div style={{ color: tokens.hint, fontSize: 13, textAlign: 'center', padding: '40px 0' }}>{tc('repair_tickets.no_tickets_match')} <button onClick={() => router.push('/repair/intake')} style={{ background: 'none', border: 'none', color: tokens.accent, cursor: 'pointer', fontSize: 13 }}>{tc('repair_tickets.start_new_intake')}</button></div>}

        {/* BOARD VIEW */}
        {view === 'board' && filtered.length > 0 && (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {COLUMNS.map(col => {
              const colJobs = filtered.filter(j => j.status === col.key)
              return (
                <div key={col.key} style={{ minWidth: 240, flex: '0 0 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[col.key] }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{col.label}</span>
                    <span style={{ fontSize: 12, color: tokens.hint }}>{colJobs.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {colJobs.map((j, idx) => (
                      <button key={j.id} onClick={() => openDetail(j)} className="pos-item" style={{ ...card, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.ink }}>{j.device_model || tc('repair_tickets.unknown_device')}</div>
                        <div style={{ fontSize: 11, color: tokens.muted, marginTop: 3 }}>{j.customer_name || tc('repair_tickets.walk_in')} · #{j.ticket_number}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: tokens.hint }}>
                          <span>{tc('repair_tickets.days_open', { days: daysOpen(j.created_at) })}</span>
                          {j.quoted_price ? <span style={{ color: tokens.accent }}>{sym}{Number(j.quoted_price).toFixed(2)}</span> : null}
                        </div>
                        {j.assigned_staff && <div style={{ fontSize: 10, color: tokens.hint, marginTop: 4 }}>👤 {j.assigned_staff.name}</div>}
                      </button>
                    ))}
                    {colJobs.length === 0 && <div style={{ fontSize: 11, color: tokens.hint, textAlign: 'center', padding: '12px 0' }}>{tc('repair_tickets.no_tickets_here')}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((j, idx) => (
              <button key={j.id} onClick={() => openDetail(j)} className="pos-item" style={{ ...card, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{j.device_model || tc('repair_tickets.unknown_device')} <span style={{ color: tokens.hint, fontWeight: 400 }}>#{j.ticket_number}</span></div>
                  <div style={{ fontSize: 12, color: tokens.muted, marginTop: 2 }}>{j.customer_name || tc('repair_tickets.walk_in')} · {j.fault_description?.slice(0, 60) || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: STATUS_BG[j.status] || STATUS_BG.intake, color: STATUS_COLOR[j.status] || tokens.hint }}>{statusLabel(tc, j.status)}</span>
                  <div style={{ fontSize: 11, color: tokens.hint, marginTop: 4 }}>{daysOpen(j.created_at)}d · {j.assigned_staff?.name || tc('repair_tickets.unassigned_short')}{j.quoted_price ? ` · ${sym}${Number(j.quoted_price).toFixed(2)}` : ''}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} className="pos-sheet" style={{ width: 'min(480px, 100%)', height: '100%', background: tokens.bg, borderLeft: `1px solid ${tokens.border}`, overflowY: 'auto' }}>
            {/* drawer header */}
            <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 2 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.device_model || tc('repair_tickets.unknown_device')}</div>
                <div style={{ fontSize: 12, color: tokens.muted }}>#{selected.ticket_number}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: tokens.border, border: 'none', color: tokens.muted, width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* status + actions */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 20, background: STATUS_BG[selected.status] || STATUS_BG.intake, color: STATUS_COLOR[selected.status] || tokens.hint }}>{statusLabel(tc, selected.status)}</span>
                {pendingJobTx[selected.id] && (
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 20, background: WARN_PALE, color: tokens.warning }}>{tc('repair_tickets.sync_pending')}</span>
                )}
                {detailError && <div style={{ marginTop: 10 }}><Banner tone="danger">{detailError}</Banner></div>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {(NEXT_STATUS[selected.status] || []).map(t => (
                    <button key={t.value} onClick={() => changeStatus(t.value)} disabled={updating}
                      className={t.value === 'cancelled' ? undefined : 'pos-btn-primary'}
                      style={{ padding: '9px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', opacity: updating ? 0.6 : 1, background: t.value === 'cancelled' ? tokens.border : tokens.accent, color: t.value === 'cancelled' ? tokens.muted : '#fff' }}>
                      {tc('repair_tickets.action_' + t.labelKey)}
                    </button>
                  ))}
                  {(NEXT_STATUS[selected.status] || []).length === 0 && <span style={{ fontSize: 12, color: tokens.hint }}>{tc('repair_tickets.no_further_actions')}</span>}
                </div>
              </div>

              {/* info */}
              <div style={{ ...card, padding: 16 }}>
                <Row label={tc('repair_tickets.row_customer')} value={selected.customer_name || tc('repair_tickets.walk_in')} />
                <Row label={tc('repair_tickets.row_phone')} value={selected.customer_phone || '—'} />
                <Row label={tc('repair_tickets.row_serial_imei')} value={selected.device_serial || '—'} />
                <Row label={tc('repair_tickets.row_device')} value={selected.device_description || '—'} />
                <Row label={tc('repair_tickets.row_engineer')} value={selected.assigned_staff?.name || tc('repair_tickets.unassigned')} />
                <Row label={tc('repair_tickets.row_quote')} value={selected.quoted_price != null ? `${sym}${Number(selected.quoted_price).toFixed(2)}` : tc('repair_tickets.quote_tbc')} />
                <Row label={tc('repair_tickets.row_opened')} value={tc('repair_tickets.opened_value', { date: fmtDate(selected.created_at), days: daysOpen(selected.created_at) })} />
              </div>

              {/* fault */}
              <div style={{ ...card, padding: 16 }}>
                <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 6 }}>{tc('repair_tickets.fault_description')}</div>
                <div style={{ fontSize: 13, color: tokens.ink, lineHeight: 1.5 }}>{selected.fault_description || '—'}</div>
                {selected.engineer_notes && <>
                  <div style={{ fontSize: 12, color: tokens.muted, margin: '12px 0 6px' }}>{tc('repair_tickets.engineer_notes')}</div>
                  <div style={{ fontSize: 13, color: tokens.ink, lineHeight: 1.5 }}>{selected.engineer_notes}</div>
                </>}
              </div>

              {/* photos */}
              {(selected.intake_photo_url || selected.checkout_photo_url || selected.replaced_part_photo_url) && (
                <div style={{ ...card, padding: 16 }}>
                  <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 10 }}>{tc('repair_tickets.photos')}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selected.intake_photo_url && <img src={selected.intake_photo_url} alt="intake" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: `1px solid ${tokens.border}` }} />}
                    {selected.checkout_photo_url && <img src={selected.checkout_photo_url} alt="checkout" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: `1px solid ${tokens.border}` }} />}
                    {selected.replaced_part_photo_url && <img src={selected.replaced_part_photo_url} alt="replaced part" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: `1px solid ${tokens.border}` }} />}
                  </div>
                </div>
              )}

              {/* progress photo gallery — add anytime while in_progress/completed;
                  nothing sends automatically, "Share update" pushes whatever
                  hasn't gone out yet as one WhatsApp message. */}
              {(selected.status === 'in_progress' || selected.status === 'completed') && (
                <div style={{ ...card, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, color: tokens.muted }}>{tc('repair_tickets.photos_progress_title')}</div>
                    {unsharedCount > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 12, background: WARN_PALE, color: tokens.warning }}>
                        {tc('repair_tickets.photos_unshared_count', { count: unsharedCount })}
                      </span>
                    )}
                  </div>

                  {photosLoading && <div style={{ fontSize: 12, color: tokens.hint, marginBottom: 10 }}>{tc('repair_tickets.loading')}</div>}

                  {photos.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      {photos.map(p => (
                        <div key={p.id} style={{ position: 'relative', width: 84 }}>
                          <img src={p.photo_url} alt={p.stage} style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8, border: `1px solid ${tokens.border}` }} />
                          <span style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, background: p.shared_at ? tokens.successPale : WARN_PALE, color: p.shared_at ? tokens.success : tokens.warning }}>
                            {p.shared_at ? tc('repair_tickets.photos_sent_badge') : tc('repair_tickets.photos_new_badge')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!photosLoading && photos.length === 0 && (
                    <div style={{ fontSize: 12, color: tokens.hint, marginBottom: 12 }}>{tc('repair_tickets.photos_empty')}</div>
                  )}

                  {photoError && <div style={{ marginBottom: 10 }}><Banner tone="danger">{photoError}</Banner></div>}
                  {shareResult === 'sent' && <div style={{ fontSize: 12, color: tokens.success, fontWeight: 600, marginBottom: 10 }}>{tc('repair_tickets.photos_share_sent')}</div>}
                  {shareResult === 'nothing_new' && <div style={{ fontSize: 12, color: tokens.hint, marginBottom: 10 }}>{tc('repair_tickets.photos_share_nothing_new')}</div>}
                  {shareResult === 'no_phone' && <div style={{ fontSize: 12, color: tokens.warning, marginBottom: 10 }}>{tc('repair_tickets.photos_share_no_phone')}</div>}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={triggerAddPhoto} disabled={addingPhoto} style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px dashed ${tokens.border}`, background: tokens.bg, color: tokens.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: addingPhoto ? 0.6 : 1 }}>
                      {addingPhoto ? tc('repair_tickets.photos_adding') : tc('repair_tickets.photos_add')}
                    </button>
                    <button onClick={shareUpdate} disabled={sharing || unsharedCount === 0} className={unsharedCount > 0 ? 'pos-btn-primary' : undefined}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: unsharedCount > 0 ? tokens.accent : tokens.border, color: unsharedCount > 0 ? '#fff' : tokens.hint, fontSize: 12, fontWeight: 700, cursor: unsharedCount > 0 ? 'pointer' : 'default', fontFamily: 'inherit', opacity: sharing ? 0.6 : 1 }}>
                      {sharing ? tc('repair_tickets.photos_sharing') : tc('repair_tickets.photos_share_update')}
                    </button>
                  </div>
                </div>
              )}

              {/* parts */}
              <div style={{ ...card, padding: 16 }}>
                <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 10 }}>{tc('repair_tickets.parts_used')}</div>
                {parts.length === 0 ? <div style={{ fontSize: 13, color: tokens.hint }}>{tc('repair_tickets.no_parts_logged')}</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {parts.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span>{p.name} ×{p.qty}</span>
                        <span style={{ color: tokens.muted }}>{sym}{Number(p.line_total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* timeline */}
              <div style={{ ...card, padding: 16 }}>
                <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 12 }}>{tc('repair_tickets.timeline')}</div>
                {detailLoading && <div style={{ fontSize: 13, color: tokens.hint }}>{tc('repair_tickets.loading')}</div>}
                {!detailLoading && history.length === 0 && <div style={{ fontSize: 13, color: tokens.hint }}>{tc('repair_tickets.no_history_yet')}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {history.map((h, idx) => (
                    <div key={h.id} className="pos-item" style={{ display: 'flex', gap: 10, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[h.to_status] || tokens.hint, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: tokens.ink }}>{statusLabel(tc, h.to_status)}{h.notes ? ` — ${h.notes}` : ''}</div>
                        <div style={{ fontSize: 11, color: tokens.hint, marginTop: 2 }}>{fmtDate(h.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '5px 0', fontSize: 13 }}>
      <span style={{ color: tokens.muted, flexShrink: 0 }}>{label}</span>
      <span style={{ color: tokens.ink, textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}
