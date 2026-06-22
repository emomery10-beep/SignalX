'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

// ── Design tokens (from CSS variables in globals.css) ──────────────────────
const tokens = {
  bg:        'var(--pos-bg)',
  surface:   'var(--pos-surface)',
  border:    'var(--pos-border)',
  ink:       'var(--pos-ink)',
  muted:     'var(--pos-muted)',
  hint:      'var(--pos-hint)',
  accent:    'var(--pos-accent)',
  danger:    'var(--pos-danger)',
  success:   'var(--pos-success)',
  warning:   'var(--pos-warning)',
  intake:    'var(--factory-intake)',
  output:    'var(--factory-output)',
  wastage:   'var(--factory-wastage)',
  dispatch:  'var(--factory-dispatch)',
}

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'

interface ActiveDowntime {
  id: string
  machine_name: string
  reason: string
  started_at: string
}

interface Capture {
  id: string
  type: CaptureType
  product_name: string | null
  quantity: number | null
  batch_ref: string | null
  notes: string | null
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  captured_by_staff?: { id: string; name: string } | null
}

const buildTypeMeta = (tc: (key: string) => string): Record<CaptureType, { label: string; color: string; bg: string }> => ({
  intake:   { label: tc('factory.type_intake'),   color: tokens.intake,   bg: 'rgba(59,130,246,.08)'   },
  output:   { label: tc('factory.type_output'),   color: tokens.output,   bg: 'rgba(22,163,74,.08)'    },
  wastage:  { label: tc('factory.type_wastage'),  color: tokens.wastage,  bg: 'rgba(220,38,38,.08)'    },
  dispatch: { label: tc('factory.type_dispatch'), color: tokens.dispatch, bg: 'rgba(139,92,246,.08)'   },
})

const STATUS_COLOR = { pending: tokens.warning, approved: tokens.success, rejected: tokens.danger }

function timeAgo(iso: string, tc: (key: string) => string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return tc('factory.time_just_now')
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function isToday(iso: string) {
  const d = new Date(iso), now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
function IconCamera({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function IconClipboard({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  )
}
function IconCheckSquare({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}
function IconChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
  )
}
function IconArrowLeft({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
  )
}
function IconBarcode({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="8" y1="8" x2="8" y2="16"/><line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="16" y1="8" x2="16" y2="16"/><line x1="6" y1="8" x2="6" y2="16"/>
      <line x1="10" y1="8" x2="10" y2="16"/><line x1="14" y1="8" x2="14" y2="16"/>
      <line x1="18" y1="8" x2="18" y2="16"/>
    </svg>
  )
}
function IconShield({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function IconAlertTriangle({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function IconClock({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function IconTruck({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}
function IconUsers({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function elapsedLabel(iso: string, tc: (key: string) => string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1)  return tc('factory.time_just_now')
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function FactoryHub() {
  const router = useRouter()
  const { tc } = useLang()
  const TYPE_META = buildTypeMeta(tc)
  const { session, ready: authReady } = usePosAuth()
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Downtime / OEE state
  const [activeDowntime, setActiveDowntime]     = useState<ActiveDowntime[]>([])
  const [downtimeMinutes, setDowntimeMinutes]   = useState(0)
  const [downtimeLoaded, setDowntimeLoaded]     = useState(false)

  // Quality defect state
  const [qualityCriticals, setQualityCriticals] = useState(0)
  const [qualityOpen, setQualityOpen]           = useState(0)
  const [qualityTotalAffected, setQualityTotalAffected] = useState(0)

  // Batch traceability state
  const [activeBatchCount, setActiveBatchCount] = useState(0)

  // Shift state
  const [activeShift, setActiveShift]     = useState<{ id: string; shift_name: string; custom_name: string | null; started_at: string; target_units: number | null; live_output: number } | null>(null)
  const [shiftLoaded, setShiftLoaded]     = useState(false)

  // Waybill / dispatch state
  const [waybillOnTimeRate, setWaybillOnTimeRate] = useState<number | null>(null)
  const [waybillTotal, setWaybillTotal]           = useState(0)

  const loadCaptures = useCallback(async (silent = false) => {
    if (!session) return
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const r = await fetch('/api/pos/factory/capture?limit=100', { headers: session.headers })
      const d = r.ok ? await r.json() : { captures: [] }
      setCaptures(d.captures || [])
    } catch { /* silent */ } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [session])

  const loadDowntime = useCallback(async () => {
    if (!session) return
    try {
      const [ra, rt] = await Promise.all([
        fetch('/api/pos/factory/downtime?active=true', { headers: session.headers }),
        fetch('/api/pos/factory/downtime', { headers: session.headers }),
      ])
      const da = ra.ok ? await ra.json() : { activeEvents: [] }
      const dt = rt.ok ? await rt.json() : { totalDowntimeMinutes: 0 }
      setActiveDowntime(da.activeEvents || [])
      setDowntimeMinutes(dt.totalDowntimeMinutes || 0)
      setDowntimeLoaded(true)
    } catch { /* silent */ }
  }, [session])

  const loadQuality = useCallback(async () => {
    if (!session) return
    try {
      const r = await fetch('/api/pos/factory/quality', { headers: session.headers })
      const d = r.ok ? await r.json() : {}
      setQualityCriticals(d.criticals || 0)
      setQualityOpen(d.openCount || 0)
      setQualityTotalAffected(d.totalAffected || 0)
    } catch { /* silent */ }
  }, [session])

  const loadBatches = useCallback(async () => {
    if (!session) return
    try {
      const r = await fetch('/api/pos/factory/batch?status=active&limit=100', { headers: session.headers })
      const d = r.ok ? await r.json() : { batches: [] }
      setActiveBatchCount((d.batches || []).length)
    } catch { /* silent */ }
  }, [session])

  const loadShift = useCallback(async () => {
    if (!session) return
    try {
      const r = await fetch('/api/pos/factory/shift', { headers: session.headers })
      const d = r.ok ? await r.json() : {}
      setActiveShift(d.activeShift || null)
      setShiftLoaded(true)
    } catch { /* silent */ }
  }, [session])

  const loadWaybills = useCallback(async () => {
    if (!session) return
    try {
      const r = await fetch('/api/pos/factory/waybill', { headers: session.headers })
      const d = r.ok ? await r.json() : {}
      setWaybillOnTimeRate(d.onTimeRate ?? null)
      setWaybillTotal(d.totalDispatches || 0)
    } catch { /* silent */ }
  }, [session])

  useEffect(() => {
    if (!authReady || !session) return
    loadCaptures()
    loadDowntime()
    loadQuality()
    loadBatches()
    loadShift()
    loadWaybills()
    const interval = setInterval(() => { loadCaptures(true); loadDowntime(); loadQuality(); loadBatches(); loadShift(); loadWaybills() }, 30_000)
    return () => clearInterval(interval)
  }, [authReady, session, loadCaptures, loadDowntime, loadQuality, loadBatches, loadShift, loadWaybills])

  // ── Computed KPIs ────────────────────────────────────────────────────────
  const todays    = captures.filter(c => isToday(c.created_at))
  const outputs   = todays.filter(c => c.type === 'output')
  const intakes   = todays.filter(c => c.type === 'intake')
  const wastages  = todays.filter(c => c.type === 'wastage')
  const dispatches = todays.filter(c => c.type === 'dispatch')

  const unitsOut    = outputs.reduce((s, c) => s + (c.quantity || 0), 0)
  const unitsIn     = intakes.reduce((s, c) => s + (c.quantity || 0), 0)
  const unitsWaste  = wastages.reduce((s, c) => s + (c.quantity || 0), 0)

  const totalFlow   = unitsOut + unitsWaste
  const wastagePct  = totalFlow > 0 ? (unitsWaste / totalFlow) * 100 : 0
  const efficiency  = unitsIn > 0 ? Math.min((unitsOut / unitsIn) * 100, 100) : 0

  // OEE components
  const SHIFT_MINUTES = 8 * 60  // 8-hour shift default
  const oeeAvailability = downtimeLoaded
    ? Math.max(0, ((SHIFT_MINUTES - downtimeMinutes) / SHIFT_MINUTES) * 100)
    : null
  // OEE Performance: live_output ÷ target (only if active shift has a target)
  const oeePerformance = (activeShift?.target_units && activeShift.target_units > 0)
    ? Math.min(((activeShift.live_output || 0) / activeShift.target_units) * 100, 100)
    : null
  // OEE Quality: defect-units ÷ (output + defect-units), falls back to wastage ratio
  const oeeQuality = qualityTotalAffected > 0 && unitsOut > 0
    ? Math.max(0, ((unitsOut - qualityTotalAffected) / unitsOut) * 100)
    : totalFlow > 0
      ? ((unitsOut / totalFlow) * 100)
      : null

  const pending   = captures.filter(c => c.status === 'pending').length
  const recent    = captures.slice(0, 12)

  const kpis = [
    {
      label: tc('factory.kpi_produced'),
      value: unitsOut.toLocaleString(),
      sub: tc('factory.kpi_produced_sub'),
      color: tokens.success,
      status: unitsOut > 0 ? 'good' : 'neutral',
    },
    {
      label: tc('factory.kpi_wastage'),
      value: `${wastagePct.toFixed(1)}%`,
      sub: tc('factory.kpi_wastage_sub', { count: unitsWaste }),
      color: wastagePct <= 3 ? tokens.success : wastagePct <= 8 ? tokens.warning : tokens.danger,
      status: wastagePct <= 3 ? 'good' : wastagePct <= 8 ? 'warn' : 'bad',
    },
    {
      label: tc('factory.kpi_dispatched'),
      value: `${dispatches.length}`,
      sub: tc('factory.kpi_dispatched_sub'),
      color: tokens.dispatch,
      status: 'neutral',
    },
    {
      label: tc('factory.kpi_efficiency'),
      value: unitsIn > 0 ? `${efficiency.toFixed(0)}%` : '—',
      sub: tc('factory.kpi_efficiency_sub'),
      color: efficiency >= 90 ? tokens.success : efficiency >= 70 ? tokens.warning : efficiency > 0 ? tokens.danger : tokens.hint,
      status: efficiency >= 90 ? 'good' : efficiency >= 70 ? 'warn' : efficiency > 0 ? 'bad' : 'neutral',
    },
    {
      label: tc('factory.kpi_pending'),
      value: `${pending}`,
      sub: tc('factory.kpi_pending_sub'),
      color: pending === 0 ? tokens.success : pending <= 5 ? tokens.warning : tokens.danger,
      status: pending === 0 ? 'good' : pending <= 5 ? 'warn' : 'bad',
    },
  ]

  if (!authReady || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.bg }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${tokens.accent}20`, borderTopColor: tokens.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '44px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/pos')} style={{ width: 38, height: 38, borderRadius: '50%', background: tokens.bg, border: `1px solid ${tokens.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.muted }}>
              <IconArrowLeft size={18} />
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: tokens.accent, letterSpacing: '-0.02em' }}>{tc('factory.header_title')}</div>
              <div style={{ fontSize: 12, color: tokens.hint, marginTop: 1 }}>{tc('factory.header_subtitle')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {pending > 0 && (
              <button onClick={() => router.push('/factory/approvals')} style={{ background: `${tokens.danger}15`, border: `1px solid ${tokens.danger}40`, color: tokens.danger, borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {tc('factory.pending_badge', { count: pending })}
              </button>
            )}
            <button onClick={() => loadCaptures(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: tokens.bg, border: `1px solid ${tokens.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.muted }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: refreshing ? 'rotate(180deg)' : 'none', transition: 'transform 600ms' }}>
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', maxWidth: 600, margin: '0 auto' }}>

        {/* ── Active downtime alert banner ─────────────────────────────────── */}
        {activeDowntime.length > 0 && (
          <button onClick={() => router.push('/factory/downtime')}
            style={{ width: '100%', marginBottom: 14, background: `${tokens.danger}10`, border: `1.5px solid ${tokens.danger}40`, borderRadius: 14, padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tokens.danger}15`, border: `1px solid ${tokens.danger}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.danger, flexShrink: 0 }}>
              <IconAlertTriangle size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: tokens.danger }}>
                {tc(activeDowntime.length > 1 ? 'factory.machines_down_other' : 'factory.machines_down_one', { count: activeDowntime.length })}
              </div>
              <div style={{ fontSize: 11, color: tokens.hint, marginTop: 1 }}>
                {activeDowntime.map(e => `${e.machine_name} (${elapsedLabel(e.started_at, tc)})`).join(' · ')}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${tokens.danger}90`} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}

        {/* ── Active shift banner ──────────────────────────────────────────── */}
        {activeShift && (
          <button onClick={() => router.push('/factory/shift')}
            style={{ width: '100%', marginBottom: 10, background: `${tokens.success}10`, border: `1.5px solid ${tokens.success}40`, borderRadius: 14, padding: '11px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.success, boxShadow: `0 0 0 3px ${tokens.success}30`, flexShrink: 0, animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.success }}>
                {tc('factory.shift_active', { name: activeShift.shift_name === 'Custom' ? (activeShift.custom_name || tc('factory.shift_custom')) : activeShift.shift_name, elapsed: elapsedLabel(activeShift.started_at, tc) })}
              </div>
              <div style={{ fontSize: 11, color: tokens.hint, marginTop: 1 }}>
                {tc('factory.shift_units_produced', { count: (activeShift.live_output || 0).toLocaleString() })}
                {activeShift.target_units ? tc('factory.shift_target', { count: activeShift.target_units.toLocaleString() }) : ''}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${tokens.success}90`} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}

        {/* ── Critical defect alert ────────────────────────────────────────── */}
        {qualityCriticals > 0 && (
          <button onClick={() => router.push('/factory/quality')}
            style={{ width: '100%', marginBottom: 10, background: `${tokens.danger}10`, border: `1.5px solid ${tokens.danger}40`, borderRadius: 14, padding: '11px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
            <div style={{ fontSize: 18, flexShrink: 0 }}>🛑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: tokens.danger }}>
                {tc(qualityCriticals > 1 ? 'factory.critical_defect_other' : 'factory.critical_defect_one', { count: qualityCriticals })}
              </div>
              <div style={{ fontSize: 11, color: tokens.hint, marginTop: 1 }}>{tc('factory.critical_defect_review')}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${tokens.danger}90`} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}

        {/* ── Hero CTA ─────────────────────────────────────────────────────── */}
        <button onClick={() => router.push('/factory/capture')}
          style={{ width: '100%', marginBottom: 20, background: tokens.accent, border: 'none', borderRadius: 18, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 4px 12px ${tokens.accent}30`, transition: 'transform 120ms, box-shadow 120ms' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; e.currentTarget.style.boxShadow = `0 2px 6px ${tokens.accent}20` }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 12px ${tokens.accent}30` }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
            <IconCamera size={26} />
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1.1 }}>{tc('factory.hero_title')}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{tc('factory.hero_subtitle')}</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* ── KPI grid ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 14, height: 80, animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {kpis.map((k, i) => (
              <div key={k.label} style={{
                background: tokens.surface,
                border: `1px solid ${k.status === 'bad' ? `${k.color}40` : k.status === 'warn' ? `${k.color}30` : tokens.border}`,
                borderRadius: 14, padding: '12px 14px',
                gridColumn: i === 4 ? 'span 3' : 'auto',
              }}>
                {i === 4 ? (
                  // Pending — spans full width
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 10, color: tokens.hint, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1.1, marginTop: 2 }}>{k.value}</div>
                      <div style={{ fontSize: 10, color: tokens.hint, marginTop: 2 }}>{k.sub}</div>
                    </div>
                    {pending > 0 && (
                      <button onClick={() => router.push('/factory/approvals')} style={{ background: `${k.color}15`, border: `1px solid ${k.color}40`, color: k.color, padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        {tc('factory.kpi_review')}
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 10, color: tokens.hint, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
                    <div style={{ fontSize: 10, color: tokens.hint, marginTop: 4 }}>{k.sub}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── OEE widget ────────────────────────────────────────────────────── */}
        {downtimeLoaded && (
          <div style={{ marginBottom: 20, background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.hint, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tc('factory.oee_title')}</div>
              <button onClick={() => router.push('/factory/downtime')} style={{ background: 'none', border: 'none', fontSize: 11, color: tokens.hint, cursor: 'pointer', padding: 0 }}>
                {tc('factory.oee_downtime_log')}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {/* Availability */}
              {(() => {
                const av = oeeAvailability ?? 0
                const color = av >= 90 ? tokens.success : av >= 75 ? tokens.warning : tokens.danger
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: tokens.hint, marginBottom: 4 }}>{tc('factory.oee_availability')}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color }}>{av.toFixed(0)}%</div>
                    {downtimeMinutes > 0 && <div style={{ fontSize: 9, color: tokens.hint, marginTop: 2 }}>{tc('factory.oee_down_minutes', { count: Math.round(downtimeMinutes) })}</div>}
                    {activeDowntime.length > 0 && <div style={{ fontSize: 9, color: tokens.danger, marginTop: 2 }}>{tc('factory.oee_live')}</div>}
                  </div>
                )
              })()}
              {/* Performance — from active shift target */}
              {(() => {
                const p = oeePerformance
                const color = p === null ? tokens.hint : p >= 90 ? tokens.success : p >= 70 ? tokens.warning : tokens.danger
                return (
                  <div style={{ textAlign: 'center', borderLeft: `1px solid ${tokens.border}`, borderRight: `1px solid ${tokens.border}` }}>
                    <div style={{ fontSize: 10, color: tokens.hint, marginBottom: 4 }}>{tc('factory.oee_performance')}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color }}>{p !== null ? `${p.toFixed(0)}%` : '—'}</div>
                    {p !== null
                      ? <div style={{ fontSize: 9, color, marginTop: 2 }}>{tc('factory.oee_units_progress', { output: (activeShift?.live_output || 0), target: activeShift?.target_units ?? 0 })}</div>
                      : <div style={{ fontSize: 9, color: tokens.hint, marginTop: 2 }}>{tc('factory.oee_set_target')}</div>
                    }
                  </div>
                )
              })()}
              {/* Quality */}
              {(() => {
                const q = oeeQuality
                const color = q === null ? tokens.hint : q >= 97 ? tokens.success : q >= 90 ? tokens.warning : tokens.danger
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: tokens.hint, marginBottom: 4 }}>{tc('factory.oee_quality')}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color }}>{q !== null ? `${q.toFixed(0)}%` : '—'}</div>
                    {qualityOpen > 0
                      ? <div style={{ fontSize: 9, color: qualityCriticals > 0 ? tokens.danger : tokens.warning, marginTop: 2 }}>{tc(qualityOpen > 1 ? 'factory.oee_defects_other' : 'factory.oee_defects_one', { count: qualityOpen })}</div>
                      : q !== null && <div style={{ fontSize: 9, color: tokens.hint, marginTop: 2 }}>{tc('factory.oee_no_defects')}</div>
                    }
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { label: tc('factory.action_production_log'), sub: tc('factory.action_production_log_sub'), icon: <IconClipboard size={20} />, color: tokens.intake, href: '/factory/production', span: false },
            { label: tc('factory.action_approvals'), sub: tc('factory.action_approvals_sub', { count: pending }), icon: <IconCheckSquare size={20} />, color: pending > 0 ? tokens.danger : tokens.success, href: '/factory/approvals', span: false },
            { label: tc('factory.action_quality_check'), sub: qualityOpen > 0 ? tc(qualityOpen > 1 ? 'factory.action_quality_open_other' : 'factory.action_quality_open_one', { count: qualityOpen }) : tc('factory.action_quality_log'), icon: <IconShield size={20} />, color: qualityCriticals > 0 ? tokens.danger : qualityOpen > 0 ? tokens.warning : tokens.intake, href: '/factory/quality', span: false },
            { label: tc('factory.action_batch_scan'), sub: activeBatchCount > 0 ? tc(activeBatchCount > 1 ? 'factory.action_batch_active_other' : 'factory.action_batch_active_one', { count: activeBatchCount }) : tc('factory.action_batch_log'), icon: <IconBarcode size={20} />, color: tokens.dispatch, href: '/factory/batch', span: false },
            { label: activeShift ? tc('factory.action_end_shift') : tc('factory.action_start_shift'), sub: activeShift ? tc('factory.action_shift_running', { elapsed: elapsedLabel(activeShift.started_at, tc) }) : tc('factory.action_shift_track'), icon: <IconClock size={20} />, color: tokens.success, href: '/factory/shift', span: false },
            { label: tc('factory.action_scan_waybill'), sub: waybillTotal > 0 ? (waybillOnTimeRate !== null ? tc('factory.action_waybill_on_time', { rate: waybillOnTimeRate }) : tc('factory.action_waybill_dispatched', { count: waybillTotal })) : tc('factory.action_waybill_log'), icon: <IconTruck size={20} />, color: tokens.warning, href: '/factory/waybill', span: false },
            { label: tc('factory.action_machine_down'), sub: activeDowntime.length > 0 ? tc(activeDowntime.length > 1 ? 'factory.action_downtime_active_other' : 'factory.action_downtime_active_one', { count: activeDowntime.length }) : tc('factory.action_downtime_report'), icon: <IconAlertTriangle size={20} />, color: activeDowntime.length > 0 ? tokens.danger : tokens.hint, href: '/factory/downtime', span: true },
            { label: tc('factory.action_staff'), sub: tc('factory.action_staff_sub'), icon: <IconUsers size={20} />, color: tokens.accent, href: '/factory/staff', span: false },
          ].map(n => (
            <button key={n.href} onClick={() => router.push(n.href)}
              style={{ background: tokens.surface, border: `1px solid ${activeDowntime.length > 0 && n.href === '/factory/downtime' ? `${tokens.danger}40` : tokens.border}`, borderRadius: 14, padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 150ms', display: 'flex', flexDirection: 'column', gap: 10, gridColumn: n.span ? 'span 2' : 'auto' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${n.color}50` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = activeDowntime.length > 0 && n.href === '/factory/downtime' ? `${tokens.danger}40` : tokens.border }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${n.color}15`, border: `1px solid ${n.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.color }}>
                {n.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: tokens.ink }}>{n.label}</div>
                <div style={{ fontSize: 12, color: tokens.hint, marginTop: 2 }}>{n.sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Today at a glance ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
          {([
            { type: 'intake',   count: intakes.length,   units: unitsIn },
            { type: 'output',   count: outputs.length,   units: unitsOut },
            { type: 'wastage',  count: wastages.length,  units: unitsWaste },
            { type: 'dispatch', count: dispatches.length, units: null },
          ] as const).map(({ type, count, units }) => {
            const m = TYPE_META[type]
            return (
              <div key={type} style={{ background: m.bg, border: `1px solid ${m.color}40`, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: m.color, textTransform: 'capitalize', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: tokens.ink, lineHeight: 1 }}>{count}</div>
                {units !== null && <div style={{ fontSize: 9, color: tokens.hint, marginTop: 3 }}>{tc('factory.glance_units', { count: units })}</div>}
                {units === null && <div style={{ fontSize: 9, color: tokens.hint, marginTop: 3 }}>{tc('factory.glance_shipped')}</div>}
              </div>
            )
          })}
        </div>

        {/* ── Recent captures ───────────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: tokens.ink }}>{tc('factory.recent_title')}</div>
            <button onClick={() => router.push('/factory/production')} style={{ background: 'none', border: 'none', color: tokens.hint, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {tc('factory.recent_all')} <IconChevronRight size={12} />
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 12, height: 64, animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div style={{ background: tokens.bg, border: `1px dashed ${tokens.border}`, borderRadius: 14, padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: tokens.ink }}>{tc('factory.empty_title')}</div>
              <div style={{ fontSize: 13, color: tokens.hint }}>{tc('factory.empty_subtitle')}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(c => {
                const m = TYPE_META[c.type]
                const unit = c.batch_ref || ''
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, padding: '12px 14px', transition: 'border-color 150ms', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}40` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border }}
                  >
                    {/* Photo thumb or color dot */}
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photo_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${m.color}40` }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: m.bg, border: `1.5px solid ${m.color}40`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.label}</span>
                        {c.quantity != null && (
                          <span style={{ fontSize: 11, color: tokens.hint }}>{c.quantity}{unit ? ` ${unit}` : ''}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: tokens.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.product_name || tc('factory.capture_unspecified')}
                      </div>
                      <div style={{ fontSize: 11, color: tokens.hint, marginTop: 2 }}>
                        {c.captured_by_staff?.name || tc('factory.capture_operator')} · {timeAgo(c.created_at, tc)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, flexShrink: 0, textTransform: 'capitalize',
                      background: `${STATUS_COLOR[c.status]}18`, color: STATUS_COLOR[c.status], border: `1px solid ${STATUS_COLOR[c.status]}40`
                    }}>{tc('factory.status_' + c.status)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg) } }
        @keyframes pulse    { 0%, 100% { opacity: 0.6 } 50% { opacity: 1 } }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2) } 50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.08) } }
      `}</style>
    </div>
  )
}
