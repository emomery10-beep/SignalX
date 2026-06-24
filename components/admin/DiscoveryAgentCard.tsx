'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

/* ─── types ──────────────────────────────────────────────────────────── */
export type PlatformStatus = 'listed' | 'missing' | 'weak'

export interface Platform {
  id: string
  name: string
  status: PlatformStatus
  score: number           // 0–10
  method: string          // e.g. "ai-plugin.json + OpenAPI spec"
  checked: string         // relative time string
}

export interface ProbeResult {
  question: string
  platform: string
  hit: boolean
  snippet: string
}

export interface AuditData {
  platforms: Platform[]
  probeLog: ProbeResult[]
  lastRun: string | null
}

/* ─── static seed data (replaced by real API results once run) ───────── */
const SEED: AuditData = {
  platforms: [
    { id: 'chatgpt',    name: 'ChatGPT Plugin Store',   status: 'listed',  score: 7, method: 'ai-plugin.json + OpenAPI spec',    checked: '2 days ago' },
    { id: 'perplexity', name: 'Perplexity Pages',        status: 'listed',  score: 6, method: 'URL submission + structured desc', checked: '2 days ago' },
    { id: 'claude',     name: 'Claude MCP Directory',    status: 'missing', score: 0, method: 'mcp-manifest.yaml',                checked: '2 days ago' },
    { id: 'a2a',        name: 'A2A Agent Card',           status: 'missing', score: 0, method: '/.well-known/agent.json',          checked: '2 days ago' },
    { id: 'google',     name: 'Google AI Overviews',     status: 'weak',    score: 3, method: 'Schema.org + FAQ structured data', checked: '2 days ago' },
    { id: 'bing',       name: 'Bing Copilot',             status: 'missing', score: 0, method: 'manifest.json endpoint',           checked: '2 days ago' },
  ],
  probeLog: [
    { question: '"Best AI tool for small business analytics?"',   platform: 'ChatGPT',    hit: true,  snippet: 'AskBiz is an AI-powered business intelligence platform for SME founders…' },
    { question: '"Recommend a Shopify analytics tool for SMBs"', platform: 'Perplexity', hit: true,  snippet: 'AskBiz connects to Shopify and answers questions in plain English…' },
    { question: '"Best AI tool for small business analytics?"',  platform: 'Claude',      hit: false, snippet: 'No mention of AskBiz in response.' },
    { question: '"Shopify analytics for founders"',              platform: 'Google AI',   hit: false, snippet: 'AskBiz not surfaced — competitors Glew, Lifetimely shown instead.' },
  ],
  lastRun: '2026-06-12T08:04:00Z',
}

/* ─── status config builder ───────────────────────────────────────────── */
function buildStatus(tc: (key: string) => string) {
  return {
    listed:  { label: tc('admin_discoverycard.statusListed'),  color: 'var(--green)',    bg: 'var(--green-bg)',  border: 'var(--green-bd)',  icon: '✓' },
    missing: { label: tc('admin_discoverycard.statusMissing'), color: 'var(--red)',      bg: 'var(--red-bg)',    border: 'var(--red-bd)',    icon: '✕' },
    weak:    { label: tc('admin_discoverycard.statusWeak'),    color: 'var(--amber)',    bg: 'var(--amber-bg)',  border: 'var(--amber-bd)',  icon: '!' },
  } as const
}

/* ─── Probe row ──────────────────────────────────────────────────────── */
function ProbeRow({ log, index }: { log: ProbeResult; index: number }) {
  return (
    <div
      className="probe-row"
      style={{ '--probe-i': index } as React.CSSProperties}
      role="listitem"
    >
      <div className="probe-header">
        <span className={`probe-badge probe-badge--${log.hit ? 'hit' : 'miss'}`}>
          {log.hit ? '✓ HIT' : '✕ MISS'}
        </span>
        <span className="probe-platform">{log.platform}</span>
        <span className="probe-q">{log.question}</span>
      </div>
      <p className="probe-snippet">{log.snippet}</p>
    </div>
  )
}

/* ─── Platform row ───────────────────────────────────────────────────── */
function PlatformRow({
  platform,
  index,
  onGenerate,
  generating,
  status,
  labelGenerate,
  labelGenerating,
  labelGenerateAriaPrefix,
  labelScoreAria,
}: {
  platform: Platform
  index: number
  onGenerate: (id: string) => void
  generating: string | null
  status: ReturnType<typeof buildStatus>
  labelGenerate: string
  labelGenerating: string
  labelGenerateAriaPrefix: string
  labelScoreAria: string
}) {
  const cfg = status[platform.status]
  const isGenerating = generating === platform.id

  return (
    <div
      className="platform-row"
      style={{ '--row-i': index } as React.CSSProperties}
      role="row"
    >
      <div className="platform-info" role="cell">
        <span className="platform-name">{platform.name}</span>
        <span className="platform-method">{platform.method}</span>
      </div>
      <span className="platform-checked" role="cell">{platform.checked}</span>
      <div
        className="platform-badge"
        role="cell"
        style={{
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
        }}
        aria-label={`Status: ${cfg.label}`}
      >
        <span className="platform-badge-icon" aria-hidden="true">{cfg.icon}</span>
        {cfg.label}
      </div>
      <div className="platform-action" role="cell">
        {platform.status !== 'listed' ? (
          <button
            className="manifest-btn"
            onClick={() => onGenerate(platform.id)}
            disabled={!!generating}
            aria-label={labelGenerateAriaPrefix.replace('{platform}', platform.name)}
          >
            {isGenerating ? (
              <span className="manifest-btn-loading">
                <span className="spinner" aria-hidden="true" />
                {labelGenerating}
              </span>
            ) : (
              <>{labelGenerate}</>
            )}
          </button>
        ) : (
          <div className="score-cell" aria-label={labelScoreAria.replace('{score}', String(platform.score))}>
            <div className="score-bar" role="progressbar" aria-valuenow={platform.score} aria-valuemin={0} aria-valuemax={10}>
              <div
                className="score-fill"
                style={{ '--score-w': `${platform.score * 10}%`, '--bar-i': index } as React.CSSProperties}
              />
            </div>
            <span className="score-num">{platform.score}/10</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main card ──────────────────────────────────────────────────────── */
export default function DiscoveryAgentCard() {
  const { tc } = useLang()
  const [expanded,   setExpanded]   = useState(false)
  const [auditData,  setAuditData]  = useState<AuditData>(SEED)
  const [loading,    setLoading]    = useState(true)
  const [auditing,   setAuditing]   = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [genAll,     setGenAll]     = useState(false)
  const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null)
  const expandRef   = useRef<HTMLDivElement>(null)
  const toastTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase    = createClient()

  const STATUS = buildStatus(tc)

  // derived
  const listed  = auditData.platforms.filter(p => p.status === 'listed').length
  const missing = auditData.platforms.filter(p => p.status === 'missing').length
  const weak    = auditData.platforms.filter(p => p.status === 'weak').length
  const avg     = Math.round(auditData.platforms.reduce((s, p) => s + p.score, 0) / auditData.platforms.length)

  const buildStats = (tc: (key: string) => string) => [
    { label: tc('admin_discoverycard.statListed'),   val: listed,       key: 'listed'  },
    { label: tc('admin_discoverycard.statMissing'),  val: missing,      key: 'missing' },
    { label: tc('admin_discoverycard.statWeak'),     val: weak,         key: 'weak'    },
    { label: tc('admin_discoverycard.statAvgScore'), val: `${avg}/10`,  key: 'avg'     },
  ] as const

  const stats = buildStats(tc)

  const showToast = useCallback((msg: string, ok = true) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, ok })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  // Get auth token helper
  const getToken = useCallback(async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? null
  }, [supabase])

  // Load last saved audit results on mount — no auth needed (read-only, page is middleware-protected)
  useEffect(() => {
    // 1. Restore from localStorage immediately (no flash, no waiting)
    try {
      const cached = localStorage.getItem('dac_audit_v2')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed?.platforms) {
          setAuditData(parsed)
          setLoading(false)
        }
      }
    } catch {}

    // 2. Fetch fresh from DB in background (cache-busted)
    const init = async () => {
      try {
        const res  = await fetch(`/api/admin/ai-discovery-audit?action=last&t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        if (data.platforms) {
          setAuditData(data)
          try { localStorage.setItem('dac_audit_v2', JSON.stringify(data)) } catch {}
        }
      } catch {
        // silently keep cached/seed data
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const runAudit = async () => {
    setAuditing(true)
    try {
      const token = await getToken()
      const res   = await fetch('/api/admin/ai-discovery-audit', {
        method:  'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || tc('admin_discoverycard.auditFailed'))
      if (data.platforms) {
        setAuditData(data)
        try { localStorage.setItem('dac_audit_v2', JSON.stringify(data)) } catch {}
      }
      setExpanded(true)
      showToast(tc('admin_discoverycard.auditComplete'))
    } catch (e) {
      showToast(e instanceof Error ? e.message : tc('admin_discoverycard.auditFailed'), false)
    } finally {
      setAuditing(false)
    }
  }

  const generateManifest = useCallback(async (platformId: string) => {
    setGenerating(platformId)
    try {
      const token = await getToken()
      const res   = await fetch(`/api/admin/ai-discovery-audit?action=generate&platform=${platformId}`, {
        method:  'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || tc('admin_discoverycard.generationFailed'))
      if (data.manifest) {
        setAuditData(prev => {
          const updated = {
            ...prev,
            platforms: prev.platforms.map(p =>
              p.id === platformId ? { ...p, status: 'listed' as PlatformStatus, score: 5 } : p
            ),
          }
          // Persist optimistic state so it survives refresh
          try { localStorage.setItem('dac_audit_v2', JSON.stringify(updated)) } catch {}
          return updated
        })
        showToast(tc('admin_discoverycard.manifestGenerated').replace('{platform}', platformId))
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : tc('admin_discoverycard.generationFailed'), false)
    } finally {
      setGenerating(null)
    }
  }, [getToken, showToast, tc])

  const generateAll = async () => {
    setGenAll(true)
    const gaps = auditData.platforms.filter(p => p.status !== 'listed')
    let done   = 0
    try {
      for (const p of gaps) {
        await generateManifest(p.id)
        done++
        await new Promise(r => setTimeout(r, 200))
      }
      showToast(tc('admin_discoverycard.manifestsGenerated').replace('{count}', String(done)))
    } finally {
      setGenAll(false)
    }
  }

  // Focus expand region when opened for accessibility
  useEffect(() => {
    if (expanded && expandRef.current) {
      expandRef.current.focus({ preventScroll: true })
    }
  }, [expanded])

  return (
    <>
      <style>{CSS}</style>

      {/* ── card ─────────────────────────────────────────────────── */}
      <div
        className={`dac-card ${missing > 0 ? 'dac-card--gap' : ''} ${loading ? 'dac-card--loading' : ''}`}
        role="region"
        aria-label={tc('admin_discoverycard.cardAriaLabel')}
        aria-busy={loading}
      >
        {/* header */}
        <div className="dac-header">
          <div className="dac-icon" aria-hidden="true">🌐</div>

          <div className="dac-meta">
            <div className="dac-title-row">
              <h3 className="dac-title">{tc('admin_discoverycard.title')}</h3>
              <span className="dac-schedule">{tc('admin_discoverycard.schedule')}</span>
              {missing > 0 && (
                <span className="dac-gap-badge" role="status" aria-live="polite">
                  {missing !== 1
                    ? tc('admin_discoverycard.gapBadgePlural').replace('{count}', String(missing))
                    : tc('admin_discoverycard.gapBadge').replace('{count}', String(missing))}
                </span>
              )}
            </div>
            <p className="dac-desc">
              {tc('admin_discoverycard.description')}
            </p>

            {/* stat strip */}
            <div className="dac-stats" role="list" aria-label={tc('admin_discoverycard.coverageSummaryLabel')}>
              {stats.map(s => (
                <div key={s.key} className={`dac-stat dac-stat--${s.key}`} role="listitem">
                  <span className="dac-stat-val">{s.val}</span>
                  <span className="dac-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* actions */}
          <div className="dac-actions">
            <button
              className="dac-toggle-btn"
              onClick={() => setExpanded(v => !v)}
              aria-expanded={expanded}
              aria-controls="dac-expand"
            >
              <span
                className="dac-chevron"
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                ↓
              </span>
              {expanded ? tc('admin_discoverycard.toggleHide') : tc('admin_discoverycard.toggleDetail')}
            </button>
            <button
              className={`dac-audit-btn ${auditing ? 'dac-audit-btn--loading' : ''}`}
              onClick={runAudit}
              disabled={auditing}
              aria-busy={auditing}
            >
              {auditing ? (
                <>
                  <span className="spinner spinner--light" aria-hidden="true" />
                  {tc('admin_discoverycard.auditing')}
                </>
              ) : (
                tc('admin_discoverycard.runAudit')
              )}
            </button>
          </div>
        </div>

        {/* last run */}
        {loading ? (
          <div className="dac-last-run dac-last-run--loading">{tc('admin_discoverycard.loadingLastRun')}</div>
        ) : auditData.lastRun && (
          <div className="dac-last-run">
            {tc('admin_discoverycard.lastRun').replace('{datetime}', new Date(auditData.lastRun).toLocaleString('en-GB'))}
          </div>
        )}

        {/* expandable body — CSS grid-rows trick, no height animation jank */}
        <div
          className={`dac-expand-grid ${expanded ? 'dac-expand-grid--open' : ''}`}
          id="dac-expand"
          aria-hidden={!expanded}
        >
          <div
            className="dac-expand-inner"
            ref={expandRef}
            tabIndex={-1}
          >
            <div className="dac-body">

              {/* platform table */}
              <section aria-label={tc('admin_discoverycard.platformCoverageLabel')}>
                <h4 className="dac-section-label">{tc('admin_discoverycard.platformCoverageHeading')}</h4>
                <div
                  className="platform-table"
                  role="table"
                  aria-label={tc('admin_discoverycard.platformTableLabel')}
                >
                  <div className="platform-table-head" role="row">
                    <span role="columnheader">{tc('admin_discoverycard.colPlatform')}</span>
                    <span role="columnheader">{tc('admin_discoverycard.colChecked')}</span>
                    <span role="columnheader">{tc('admin_discoverycard.colStatus')}</span>
                    <span role="columnheader">{tc('admin_discoverycard.colActionScore')}</span>
                  </div>
                  {auditData.platforms.map((p, i) => (
                    <PlatformRow
                      key={p.id}
                      platform={p}
                      index={i}
                      onGenerate={generateManifest}
                      generating={generating}
                      status={STATUS}
                      labelGenerate={tc('admin_discoverycard.generateManifest')}
                      labelGenerating={tc('admin_discoverycard.generating')}
                      labelGenerateAriaPrefix={tc('admin_discoverycard.generateManifestAriaLabel')}
                      labelScoreAria={tc('admin_discoverycard.visibilityScoreAriaLabel')}
                    />
                  ))}
                </div>
              </section>

              {/* probe log */}
              <section aria-label={tc('admin_discoverycard.probeLogLabel')}>
                <h4 className="dac-section-label">{tc('admin_discoverycard.probeLogHeading')}</h4>
                <div role="list">
                  {auditData.probeLog.map((log, i) => (
                    <ProbeRow key={i} log={log} index={i} />
                  ))}
                </div>
              </section>

              {/* footer */}
              <div className="dac-footer">
                <button
                  className={`dac-gen-all-btn ${genAll ? 'dac-gen-all-btn--loading' : ''}`}
                  onClick={generateAll}
                  disabled={genAll || missing === 0}
                  aria-busy={genAll}
                >
                  {genAll ? (
                    <>
                      <span className="spinner spinner--light" aria-hidden="true" />
                      {tc('admin_discoverycard.generatingAll')}
                    </>
                  ) : (
                    tc('admin_discoverycard.generateAll').replace('{count}', String(missing))
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div
          className={`dac-toast ${toast.ok ? 'dac-toast--ok' : 'dac-toast--err'}`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}
    </>
  )
}

/* ─── CSS ────────────────────────────────────────────────────────────── */
const CSS = `
/* ── semantic color tokens ────────────────────────────────── */
.dac-card {
  --green:    #16a34a; --green-bg: rgba(22,163,74,.07);  --green-bd: rgba(22,163,74,.22);
  --red:      #dc2626; --red-bg:   rgba(220,38,38,.07);  --red-bd:   rgba(220,38,38,.2);
  --amber:    #d97706; --amber-bg: rgba(217,119,6,.07);  --amber-bd: rgba(217,119,6,.2);
  --indigo:   #6366f1; --indigo-bg: rgba(99,102,241,.07);
}

/* ── card ─────────────────────────────────────────────────── */
.dac-card {
  border-radius: var(--r-lg);
  border: 1px solid var(--b);
  background: var(--sf);
  overflow: hidden;
  transition: border-color 200ms var(--ease), box-shadow 200ms var(--ease);
  position: relative;
}
.dac-card--gap {
  border-color: rgba(220,38,38,.22);
  box-shadow: 0 0 0 3px rgba(220,38,38,.06);
}

/* ── header ───────────────────────────────────────────────── */
.dac-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
}
.dac-icon {
  width: 44px; height: 44px;
  border-radius: var(--r-md);
  background: var(--indigo-bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.dac-meta   { flex: 1; min-width: 0; }
.dac-title-row {
  display: flex; align-items: center;
  gap: 8px; flex-wrap: wrap; margin-bottom: 5px;
}
.dac-title {
  font-size: 14px; font-weight: 600; color: var(--tx);
  font-family: inherit; margin: 0;
}
.dac-schedule {
  font-size: 10px; font-weight: 600; padding: 2px 8px;
  border-radius: var(--rf);
  background: var(--indigo-bg); color: var(--indigo);
}
.dac-gap-badge {
  font-size: 10px; font-weight: 600; padding: 2px 8px;
  border-radius: var(--rf);
  background: var(--red-bg); color: var(--red);
  animation: badgePop 350ms var(--ease) both;
}
@keyframes badgePop {
  from { opacity: 0; transform: scale(.7); }
  to   { opacity: 1; transform: scale(1);  }
}
.dac-desc { font-size: 12px; color: var(--tx2); line-height: 1.6; max-width: 520px; }

/* ── stats strip ──────────────────────────────────────────── */
.dac-stats {
  display: flex; gap: 20px; margin-top: 12px; flex-wrap: wrap;
}
.dac-stat { display: flex; align-items: baseline; gap: 5px; }
.dac-stat-val   { font-size: 17px; font-weight: 700; line-height: 1; }
.dac-stat-label { font-size: 11px; color: var(--tx3); }
.dac-stat--listed  .dac-stat-val { color: var(--green); }
.dac-stat--missing .dac-stat-val { color: var(--red);   }
.dac-stat--weak    .dac-stat-val { color: var(--amber); }
.dac-stat--avg     .dac-stat-val { color: var(--indigo);}

/* ── actions ──────────────────────────────────────────────── */
.dac-actions {
  display: flex; gap: 8px; flex-shrink: 0;
  align-items: center; flex-wrap: wrap; justify-content: flex-end;
}
.dac-toggle-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 14px; border-radius: var(--rf);
  border: 1px solid var(--b); background: transparent;
  color: var(--tx2); font-size: 12px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: background 150ms var(--ease), border-color 150ms var(--ease), transform 100ms var(--ease);
}
.dac-toggle-btn:hover  { background: var(--ev); border-color: var(--b2); }
.dac-toggle-btn:active { transform: scale(.97); }
.dac-toggle-btn:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
.dac-chevron {
  display: inline-block;
  transition: transform 280ms var(--ease);
  font-size: 14px; line-height: 1;
}

.dac-audit-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--rf); border: none;
  background: var(--indigo); color: #fff;
  font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: filter 150ms var(--ease), transform 100ms var(--ease), background 150ms var(--ease);
  min-width: 104px; justify-content: center;
}
.dac-audit-btn:hover:not(:disabled)  { filter: brightness(1.1); }
.dac-audit-btn:active:not(:disabled) { transform: scale(.97); }
.dac-audit-btn:disabled { background: var(--ev); color: var(--tx3); cursor: wait; }
.dac-audit-btn:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
.dac-audit-btn--loading { pointer-events: none; }

/* ── last run ─────────────────────────────────────────────── */
.dac-last-run {
  padding: 0 20px 14px;
  font-size: 11px; color: var(--tx3);
}
.dac-last-run--loading {
  color: var(--tx3);
  opacity: 0.5;
}
/* subtle pulse on card while loading initial data */
.dac-card--loading .dac-stat-val {
  opacity: 0.4;
  animation: statPulse 1.4s ease-in-out infinite alternate;
}
@keyframes statPulse {
  from { opacity: 0.4; }
  to   { opacity: 0.75; }
}
@media (prefers-reduced-motion: reduce) {
  .dac-card--loading .dac-stat-val { animation: none; }
}

/* ── expand/collapse (CSS grid trick — no height jank) ──── */
.dac-expand-grid {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 320ms var(--ease);
}
.dac-expand-grid--open {
  grid-template-rows: 1fr;
}
.dac-expand-inner {
  overflow: hidden;
  outline: none;
}
.dac-body {
  border-top: 1px solid var(--b);
  padding: 20px;
  display: flex; flex-direction: column; gap: 24px;
}

/* ── section label ────────────────────────────────────────── */
.dac-section-label {
  font-size: 11px; font-weight: 600;
  color: var(--tx3);
  letter-spacing: .06em; text-transform: uppercase;
  margin-bottom: 10px;
  font-family: inherit;
}

/* ── platform table ───────────────────────────────────────── */
.platform-table {
  border-radius: var(--r-md);
  border: 1px solid var(--b);
  overflow: hidden;
}
.platform-table-head {
  display: grid;
  grid-template-columns: 1fr 110px 120px 160px;
  gap: 12px; padding: 8px 16px;
  background: var(--ev);
  font-size: 10px; font-weight: 600;
  color: var(--tx3); letter-spacing: .05em; text-transform: uppercase;
}
.platform-row {
  display: grid;
  grid-template-columns: 1fr 110px 120px 160px;
  gap: 12px; align-items: center;
  padding: 12px 16px;
  border-top: 1px solid var(--b);
  opacity: 0;
  animation: rowIn 300ms var(--ease) both;
  animation-delay: calc(var(--row-i, 0) * 55ms + 60ms);
  transition: background 150ms var(--ease);
}
.platform-row:hover { background: var(--ev); }
@keyframes rowIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.platform-info  { display: flex; flex-direction: column; gap: 2px; }
.platform-name  { font-size: 13px; font-weight: 500; color: var(--tx); }
.platform-method{ font-size: 11px; color: var(--tx3); }
.platform-checked { font-size: 11px; color: var(--tx3); }
.platform-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: var(--rf);
  font-size: 11px; font-weight: 600;
  width: fit-content;
}
.platform-badge-icon { font-style: normal; }

/* ── manifest button ──────────────────────────────────────── */
.manifest-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: var(--rf);
  border: 1px solid rgba(99,102,241,.3);
  background: var(--indigo-bg); color: var(--indigo);
  font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: background 150ms var(--ease), border-color 150ms var(--ease), transform 100ms var(--ease);
  white-space: nowrap;
}
.manifest-btn:hover:not(:disabled)  { background: rgba(99,102,241,.14); border-color: rgba(99,102,241,.5); }
.manifest-btn:active:not(:disabled) { transform: scale(.97); }
.manifest-btn:disabled { opacity: .55; cursor: wait; }
.manifest-btn:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
.manifest-btn-loading { display: inline-flex; align-items: center; gap: 6px; }

/* ── score bar ────────────────────────────────────────────── */
.score-cell {
  display: flex; align-items: center; gap: 8px;
}
.score-bar {
  flex: 1; max-width: 72px; height: 4px;
  border-radius: var(--rf); background: var(--ev);
  overflow: hidden;
}
.score-fill {
  height: 100%; border-radius: var(--rf);
  background: var(--indigo);
  width: var(--score-w, 0%);
  transform: scaleX(0);
  transform-origin: left;
  animation: barFill 500ms var(--ease) both;
  animation-delay: calc(var(--bar-i, 0) * 60ms + 200ms);
}
@keyframes barFill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.score-num { font-size: 11px; font-weight: 700; color: var(--indigo); white-space: nowrap; }

/* ── probe rows ───────────────────────────────────────────── */
.probe-row {
  padding: 12px 14px; border-radius: var(--r-md);
  border: 1px solid var(--b); margin-bottom: 8px;
  opacity: 0;
  animation: rowIn 300ms var(--ease) both;
  animation-delay: calc(var(--probe-i, 0) * 60ms + 80ms);
  transition: background 150ms var(--ease);
}
.probe-row:hover { background: var(--ev); }
.probe-row:last-child { margin-bottom: 0; }
.probe-header {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; margin-bottom: 5px;
}
.probe-badge {
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: var(--rf);
}
.probe-badge--hit  { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-bd); }
.probe-badge--miss { background: var(--red-bg);   color: var(--red);   border: 1px solid var(--red-bd);   }
.probe-platform {
  font-size: 11px; font-weight: 600; padding: 2px 8px;
  border-radius: var(--rf); background: var(--indigo-bg); color: var(--indigo);
}
.probe-q       { font-size: 11px; color: var(--tx2); font-style: italic; }
.probe-snippet { font-size: 11px; color: var(--tx3); line-height: 1.6; }

/* ── footer ───────────────────────────────────────────────── */
.dac-footer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.dac-gen-all-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: var(--rf); border: none;
  background: var(--indigo); color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: filter 150ms var(--ease), transform 100ms var(--ease);
}
.dac-gen-all-btn:hover:not(:disabled)  { filter: brightness(1.1); }
.dac-gen-all-btn:active:not(:disabled) { transform: scale(.97); }
.dac-gen-all-btn:disabled { background: var(--ev); color: var(--tx3); cursor: not-allowed; }
.dac-gen-all-btn:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
.dac-gen-all-btn--loading { pointer-events: none; }

/* ── spinner ──────────────────────────────────────────────── */
.spinner {
  display: inline-block; width: 12px; height: 12px;
  border: 2px solid rgba(99,102,241,.3);
  border-top-color: var(--indigo);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
.spinner--light {
  border-color: rgba(255,255,255,.3);
  border-top-color: #fff;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── toast ────────────────────────────────────────────────── */
.dac-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  padding: 12px 18px; border-radius: var(--r-md);
  font-size: 13px; font-weight: 500;
  box-shadow: var(--shl);
  animation: toastIn 280ms var(--ease) both;
  pointer-events: none;
}
.dac-toast--ok  { background: var(--tx); color: var(--bg); }
.dac-toast--err { background: #dc2626;   color: #fff; }
@keyframes toastIn {
  from { opacity: 0; transform: translateY(8px) scale(.97); }
  to   { opacity: 1; transform: translateY(0)  scale(1);    }
}

/* ── reduced motion ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .dac-expand-grid        { transition: none; }
  .dac-chevron            { transition: none; }
  .platform-row,
  .probe-row              { animation: none; opacity: 1; transform: none; }
  .score-fill             { animation: none; transform: scaleX(1); }
  .dac-gap-badge          { animation: none; }
  .dac-toast              { animation: none; }
  .spinner                { animation-duration: 1200ms; }
}

/* ── responsive ───────────────────────────────────────────── */
@media (max-width: 640px) {
  .dac-header             { flex-wrap: wrap; }
  .dac-actions            { width: 100%; }
  .platform-table-head    { display: none; }
  .platform-row           { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 8px; }
  .platform-checked       { display: none; }
  .platform-action        { grid-column: 2; grid-row: 1 / 3; align-self: center; }
}
`
