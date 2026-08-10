'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { evaluateYield, YIELD_STATUS_COLOR } from '@/lib/factory-yield'
import { compressImageToDataUrl } from '@/lib/pos-image-compress'

type Tc = (key: string, vars?: Record<string, string | number>) => string

const ACC = '#f59e0b'

const GOOD = '#22c55e'
const WARN = '#f59e0b'
const BAD = '#ef4444'

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch' | 'packaging'

interface Capture {
  id: string
  type: CaptureType
  product_name: string | null
  quantity: number | null
  batch_ref: string | null      // holds unit (or container size, for packaging)
  notes: string | null
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: string
  approved_at: string | null
  captured_by_staff?: { id: string; name: string; role: string } | null
  approved_by_staff?: { id: string; name: string; role: string } | null
  // Set only on output/wastage captures marked sold at capture time.
  sale_price?: number | null
  buyer_name?: string | null
  // Set only when a factory-type recipe (or the owner's manual override)
  // carries a decayRule for this product — e.g. bakery's 24h sell-by.
  expires_at?: string | null
  // Optional free-form process-parameter reading (intake/output only).
  param_label?: string | null
  param_value?: number | null
  param_unit?: string | null
  production_run_id?: string | null
  is_intermediate?: boolean
  production_run?: { id: string; run_ref: string | null; input_product_name: string | null } | null
}

interface Hold {
  id: string
  label: string
  releasable_at: string | null
  cleared_at: string | null
  is_open: boolean
  is_blocking: boolean
  cleared_by_staff?: { id: string; name: string } | null
}

function daysLeft(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000))
}

// Expired = red; expiring within 4h = amber; otherwise not shown as a
// badge at all (a decay deadline days away isn't yet worth flagging).
function expiryStatus(iso: string): 'expired' | 'soon' | null {
  const msLeft = new Date(iso).getTime() - Date.now()
  if (msLeft <= 0) return 'expired'
  if (msLeft <= 4 * 3600000) return 'soon'
  return null
}

// Sky-blue matches the "packaging" defect category color on the Quality
// screen and the packaging type pill on the Capture screen — one concept,
// one color, across the sector.
const TYPE_META: Record<CaptureType, { icon: string; color: string }> = {
  intake:    { icon: '📥', color: '#3b82f6' },
  output:    { icon: '📤', color: GOOD },
  packaging: { icon: '📦', color: '#0ea5e9' },
  wastage:   { icon: '🗑️', color: BAD },
  dispatch:  { icon: '🚚', color: '#8b5cf6' },
}

function typeLabel(tc: Tc, type: CaptureType): string {
  return tc('factory_production.type_' + type + '_label')
}

const STATUS_COLOR: Record<string, string> = { pending: WARN, approved: GOOD, rejected: BAD }

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function ProductionLogPage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading] = useState(true)
  const [factoryType, setFactoryType] = useState<string | null>(null)

  // filters
  const [fType, setFType] = useState<'' | CaptureType>('')
  const [fStatus, setFStatus] = useState<'' | 'pending' | 'approved' | 'rejected'>('')
  const [fDate, setFDate] = useState('')
  const [fProduct, setFProduct] = useState('')

  const [detail, setDetail] = useState<Capture | null>(null)

  // Not-yet-releasable holds — heldCaptureIds drives the table-row badge,
  // detailHolds is fetched fresh per capture when the drawer opens (a
  // capture can carry more than one, e.g. concrete's dual milestone).
  const [heldCaptureIds, setHeldCaptureIds] = useState<Set<string>>(new Set())
  const [detailHolds, setDetailHolds] = useState<Hold[]>([])
  const [detailHoldsLoading, setDetailHoldsLoading] = useState(false)
  const [clearingHoldId, setClearingHoldId] = useState<string | null>(null)
  const [clearError, setClearError] = useState('')
  const clearFileRef = useRef<HTMLInputElement>(null)
  const pendingClearHoldId = useRef<string | null>(null)

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: session.headers })
      .then(r => r.json())
      .then(d => setFactoryType(d?.factory_type || null))
      .catch(() => {})
    load()
    loadOpenHolds()
  }, [authReady, session])

  useEffect(() => {
    if (!detail || !session) { setDetailHolds([]); return }
    setDetailHoldsLoading(true)
    fetch(`/api/pos/factory/capture-holds?capture_id=${detail.id}`, { headers: session.headers })
      .then(r => r.json())
      .then(d => setDetailHolds(d.holds || []))
      .catch(() => setDetailHolds([]))
      .finally(() => setDetailHoldsLoading(false))
  }, [detail, session])

  async function load() {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/factory/capture?limit=100', { headers: session.headers })
      const data = res.ok ? await res.json() : { captures: [] }
      setCaptures(data.captures || [])
    } catch (e) {
      console.error('Production log load error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function loadOpenHolds() {
    if (!session) return
    try {
      const res = await fetch('/api/pos/factory/capture-holds?status=open', { headers: session.headers })
      const data = res.ok ? await res.json() : { holds: [] }
      setHeldCaptureIds(new Set((data.holds || []).map((h: any) => h.capture?.id).filter(Boolean)))
    } catch { /* silent — badge just won't show, not fatal */ }
  }

  function startClearHold(holdId: string) {
    setClearError('')
    pendingClearHoldId.current = holdId
    clearFileRef.current?.click()
  }

  async function handleClearFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const holdId = pendingClearHoldId.current
    e.target.value = ''
    if (!file || !holdId || !session) return
    setClearingHoldId(holdId)
    setClearError('')
    try {
      const image = await compressImageToDataUrl(file, { maxEdge: 1600, quality: 0.82 })
      const res = await fetch('/api/pos/factory/capture-holds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({ id: holdId, image }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setClearError(d.error || tc('factory_production.error_hold_clear_failed'))
        return
      }
      setDetailHolds(prev => prev.map(h => h.id === holdId ? { ...h, is_open: false, cleared_at: new Date().toISOString() } : h))
      loadOpenHolds()
    } catch {
      setClearError(tc('factory_production.error_network'))
    } finally {
      setClearingHoldId(null)
    }
  }

  const filtered = captures.filter(c => {
    if (fType && c.type !== fType) return false
    if (fStatus && c.status !== fStatus) return false
    if (fDate && !c.created_at.startsWith(fDate)) return false
    if (fProduct && !(c.product_name || '').toLowerCase().includes(fProduct.toLowerCase())) return false
    return true
  })

  // '__other__' is the raw placeholder the capture form's "Other" option used
  // to save before it required a typed-in product name (and can still show
  // up in older records, or a future write path that skips that guard).
  // Never render it — fall back to a human-readable "unspecified" label.
  const displayProduct = (name: string | null) =>
    (!name || name === '__other__') ? tc('factory_production.yield_unspecified') : name

  // Yield summary: output qty / intake qty per product
  const yieldMap: Record<string, { intake: number; output: number }> = {}
  for (const c of captures) {
    const p = displayProduct(c.product_name)
    if (c.type === 'intake' || c.type === 'output') {
      yieldMap[p] = yieldMap[p] || { intake: 0, output: 0 }
      yieldMap[p][c.type] += c.quantity || 0
    }
  }
  const yields = Object.entries(yieldMap)
    .filter(([, v]) => v.intake > 0 || v.output > 0)
    .map(([product, v]) => {
      const pct = v.intake > 0 ? (v.output / v.intake) * 100 : null
      return { product, ...v, pct, evaluation: evaluateYield(pct, product, factoryType) }
    })
    .sort((a, b) => (b.output + b.intake) - (a.output + a.intake))
    .slice(0, 8)

  // By-production-run breakdown — additive, alongside (not replacing) the
  // global per-product summary above. Only covers captures a worker
  // actually tagged with the same run_ref (app/factory/capture's
  // "Production Run" field) — most captures won't have one, and that's
  // fine, the global summary above still covers those. This exists
  // specifically to fix the case the global summary gets wrong: selling
  // part of a batch as a mid-process intermediate (coffee's dried
  // parchment, rice's parboiled paddy) then continuing to process the
  // rest — the global summary divides by the WHOLE intake for both
  // outputs; this divides each run's own output by only its own intake.
  const runMap: Record<string, { run_ref: string; intake: { product: string; qty: number }[]; outputs: { product: string; qty: number; isIntermediate: boolean }[] }> = {}
  for (const c of captures) {
    if (!c.production_run?.id) continue
    const key = c.production_run.id
    if (!runMap[key]) runMap[key] = { run_ref: c.production_run.run_ref || key.slice(0, 8), intake: [], outputs: [] }
    const p = displayProduct(c.product_name)
    if (c.type === 'intake') runMap[key].intake.push({ product: p, qty: c.quantity || 0 })
    if (c.type === 'output') runMap[key].outputs.push({ product: p, qty: c.quantity || 0, isIntermediate: !!c.is_intermediate })
  }
  const runs = Object.values(runMap)
    .filter(r => r.intake.length > 0 || r.outputs.length > 0)
    .map(r => {
      const totalIntake = r.intake.reduce((s, i) => s + i.qty, 0)
      const totalOutput = r.outputs.reduce((s, o) => s + o.qty, 0)
      return { ...r, totalIntake, totalOutput, pct: totalIntake > 0 ? (totalOutput / totalIntake) * 100 : null }
    })
    .sort((a, b) => (b.totalIntake + b.totalOutput) - (a.totalIntake + a.totalOutput))
    .slice(0, 8)

  if (!authReady || !session) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>{tc('factory_production.loading')}</div>
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hidden camera input for clearing a hold — a lighter one-shot
          capture (matches the retail cashier scan pattern) rather than a
          full live-viewfinder screen, since this is a secondary action off
          an already-open detail drawer, not the primary capture flow. */}
      <input ref={clearFileRef} type="file" accept="image/*" capture="environment" onChange={handleClearFile} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/factory')} style={{ background: '#334155', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>{tc('factory_production.header_title')}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{tc('factory_production.header_captures_count', { shown: filtered.length, total: captures.length })}</div>
          </div>
        </div>
        <button onClick={load} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>{tc('factory_production.header_refresh')}</button>
      </div>

      {/* Account bar — language + sign out, same slim row on every factory screen.
          This file has no `tokens` object (unlike most factory screens); it uses
          literal hex colors throughout, so the bar mirrors that convention
          (#1e293b/#334155/#0f172a/#94a3b8 match this file's own surface/border/bg/muted). */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '6px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <LanguageToggle inline />
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
          style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          {tc('common.sign_out')}
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Yield summary */}
        {yields.length > 0 && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{tc('factory_production.yield_summary_title')} <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>{tc('factory_production.yield_summary_hint')}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {yields.map((y, idx) => (
                <div key={y.product} className="pos-item" style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{y.product}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: YIELD_STATUS_COLOR[y.evaluation.status] }}>
                      {y.pct == null ? '—' : `${y.pct.toFixed(0)}%`}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{tc('factory_production.yield_out_in', { out: y.output.toLocaleString(), in: y.intake.toLocaleString() })}</span>
                  </div>
                  {/* Don't rely on color alone — show what "normal" actually
                      means for this product once a factory-type recipe
                      matches it (e.g. sesame oil's genuine 33-63% range),
                      instead of leaving the color as the only explanation. */}
                  {y.evaluation.matchedRecipe && y.evaluation.min != null && (
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                      {tc('factory_production.yield_expected_range', {
                        min: y.evaluation.min,
                        max: y.evaluation.max ?? y.evaluation.min,
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By production run — additive alongside the global summary above.
            Only shows runs a worker actually tagged (via the optional
            "Production Run" field on Capture) — fixes the case the global
            per-product summary gets wrong: selling part of a batch as an
            intermediate then continuing to process the rest. */}
        {runs.length > 0 && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
              {tc('factory_production.runs_title')} <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>{tc('factory_production.runs_hint')}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {runs.map((r, idx) => (
                <div key={r.run_ref + idx} className="pos-item" style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0ea5e9', fontFamily: 'monospace', marginBottom: 8 }}>{r.run_ref}</div>
                  {r.intake.map((i, ii) => (
                    <div key={ii} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>→ {tc('factory_production.runs_in', { qty: i.qty.toLocaleString(), product: i.product })}</div>
                  ))}
                  {r.outputs.map((o, oi) => (
                    <div key={oi} style={{ fontSize: 12, color: o.isIntermediate ? '#0ea5e9' : '#22c55e', marginBottom: 2 }}>
                      ← {tc('factory_production.runs_out', { qty: o.qty.toLocaleString(), product: o.product })}
                      {o.isIntermediate && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, background: '#0ea5e91a', padding: '1px 5px', borderRadius: 5 }}>{tc('factory_production.intermediate_badge')}</span>}
                    </div>
                  ))}
                  {r.pct != null && (
                    <div style={{ fontSize: 16, fontWeight: 700, color: YIELD_STATUS_COLOR[evaluateYield(r.pct, r.outputs[0]?.product || '', factoryType).status], marginTop: 6 }}>
                      {r.pct.toFixed(0)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <select value={fType} onChange={e => setFType(e.target.value as any)} style={filterStyle}>
            <option value="">{tc('factory_production.filter_all_types')}</option>
            {(Object.keys(TYPE_META) as CaptureType[]).map(t => <option key={t} value={t}>{TYPE_META[t].icon} {typeLabel(tc, t)}</option>)}
          </select>
          <select value={fStatus} onChange={e => setFStatus(e.target.value as any)} style={filterStyle}>
            <option value="">{tc('factory_production.filter_all_statuses')}</option>
            <option value="pending">{tc('factory_production.status_pending')}</option>
            <option value="approved">{tc('factory_production.status_approved')}</option>
            <option value="rejected">{tc('factory_production.status_rejected')}</option>
          </select>
          <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} style={filterStyle} />
          <input value={fProduct} onChange={e => setFProduct(e.target.value)} placeholder={tc('factory_production.filter_search_product')} style={{ ...filterStyle, flex: 1, minWidth: 160 }} />
          {(fType || fStatus || fDate || fProduct) && (
            <button onClick={() => { setFType(''); setFStatus(''); setFDate(''); setFProduct('') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontSize: 13 }}>{tc('factory_production.filter_clear')}</button>
          )}
        </div>

        {/* Table */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>{tc('factory_production.table_loading')}</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>{tc('factory_production.table_empty')}</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#64748b', textAlign: 'left' }}>
                    {[
                      tc('factory_production.col_date'),
                      tc('factory_production.col_type'),
                      tc('factory_production.col_product'),
                      tc('factory_production.col_qty'),
                      tc('factory_production.col_unit'),
                      tc('factory_production.col_status'),
                      tc('factory_production.col_operator'),
                    ].map(h => (
                      <th key={h} style={{ padding: '12px 14px', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, idx) => {
                    const meta = TYPE_META[c.type]
                    return (
                      <tr key={c.id} onClick={() => setDetail(c)}
                        className="pos-item"
                        style={{ borderTop: '1px solid #334155', cursor: 'pointer', animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#0f172a')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmtDate(c.created_at)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: `${meta.color}22`, color: meta.color, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{meta.icon} {typeLabel(tc, c.type)}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 600 }}>
                          {displayProduct(c.product_name)}
                          {c.sale_price != null && (
                            <span title={tc('factory_production.detail_sale_price')} style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: GOOD, background: `${GOOD}1a`, padding: '2px 6px', borderRadius: 6 }}>
                              {tc('factory_production.sold_badge')}
                            </span>
                          )}
                          {heldCaptureIds.has(c.id) && (
                            <span title={tc('factory_production.held_badge_hint')} style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: WARN, background: `${WARN}1a`, padding: '2px 6px', borderRadius: 6 }}>
                              {tc('factory_production.held_badge')}
                            </span>
                          )}
                          {c.expires_at && expiryStatus(c.expires_at) && (
                            <span title={tc('factory_production.expiry_badge_hint')} style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: expiryStatus(c.expires_at) === 'expired' ? BAD : WARN, background: `${expiryStatus(c.expires_at) === 'expired' ? BAD : WARN}1a`, padding: '2px 6px', borderRadius: 6 }}>
                              {expiryStatus(c.expires_at) === 'expired' ? tc('factory_production.expired_badge') : tc('factory_production.expiring_badge')}
                            </span>
                          )}
                          {c.is_intermediate && (
                            <span title={tc('factory_production.intermediate_badge_hint')} style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#0ea5e9', background: '#0ea5e91a', padding: '2px 6px', borderRadius: 6 }}>
                              {tc('factory_production.intermediate_badge')}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#e2e8f0' }}>{c.quantity ?? '—'}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{c.batch_ref || '—'}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: `${STATUS_COLOR[c.status]}22`, color: STATUS_COLOR[c.status], padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{tc('factory_production.status_' + c.status)}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{c.captured_by_staff?.name || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} className="pos-sheet" style={{ background: '#1e293b', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxWidth: 560, maxHeight: '88vh', overflow: 'auto', borderTop: `3px solid ${TYPE_META[detail.type].color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ background: `${TYPE_META[detail.type].color}22`, color: TYPE_META[detail.type].color, padding: '5px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>{TYPE_META[detail.type].icon} {typeLabel(tc, detail.type)}</span>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>

            {detail.photo_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={detail.photo_url} alt="capture" style={{ width: '100%', borderRadius: 12, marginBottom: 16, border: '1px solid #334155' }} />
            )}

            <div className="pos-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <Field label={tc('factory_production.detail_product')} value={displayProduct(detail.product_name)} />
              <Field label={tc('factory_production.detail_quantity')} value={`${detail.quantity ?? '—'} ${detail.batch_ref || ''}`.trim()} />
              <Field label={tc('factory_production.detail_status')} value={tc('factory_production.status_' + detail.status)} valueColor={STATUS_COLOR[detail.status]} />
              <Field label={tc('factory_production.detail_logged')} value={fmtDate(detail.created_at)} />
              <Field label={tc('factory_production.detail_operator')} value={detail.captured_by_staff?.name || '—'} />
              {detail.approved_by_staff && <Field label={detail.status === 'rejected' ? tc('factory_production.detail_reviewed_by') : tc('factory_production.detail_approved_by')} value={detail.approved_by_staff.name} />}
              {detail.sale_price != null && <Field label={tc('factory_production.detail_sale_price')} value={String(detail.sale_price)} valueColor={GOOD} />}
              {detail.buyer_name && <Field label={tc('factory_production.detail_buyer')} value={detail.buyer_name} />}
              {detail.expires_at && (
                <Field
                  label={tc('factory_production.detail_expires')}
                  value={expiryStatus(detail.expires_at) === 'expired' ? tc('factory_production.expired_badge') : fmtDate(detail.expires_at)}
                  valueColor={expiryStatus(detail.expires_at) === 'expired' ? BAD : expiryStatus(detail.expires_at) === 'soon' ? WARN : undefined}
                />
              )}
              {detail.param_label && detail.param_value != null && (
                <Field label={detail.param_label} value={`${detail.param_value}${detail.param_unit ? ` ${detail.param_unit}` : ''}`} />
              )}
              {detail.production_run?.run_ref && <Field label={tc('factory_production.detail_run_ref')} value={detail.production_run.run_ref} />}
              {detail.is_intermediate && <Field label={tc('factory_production.detail_intermediate')} value={tc('factory_production.intermediate_badge')} valueColor="#0ea5e9" />}
            </div>

            {/* Holds — not-yet-releasable gates on this capture (curing,
                regulatory clearance). Fetched fresh per capture since a
                capture can carry more than one (concrete's dual milestone). */}
            {detailHoldsLoading ? (
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{tc('factory_production.holds_loading')}</div>
            ) : detailHolds.length > 0 && (
              <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {detailHolds.map(h => (
                  <div key={h.id} style={{
                    background: h.is_open ? `${WARN}14` : `${GOOD}14`,
                    border: `1px solid ${h.is_open ? WARN : GOOD}40`,
                    borderRadius: 10, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: h.is_open ? WARN : GOOD }}>{h.label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        {!h.is_open
                          ? tc('factory_production.hold_cleared', { name: h.cleared_by_staff?.name || tc('factory_production.hold_cleared_unknown') })
                          : h.releasable_at
                            ? tc('factory_production.hold_days_left', { count: daysLeft(h.releasable_at) })
                            : tc('factory_production.hold_awaiting_clearance')}
                      </div>
                    </div>
                    {h.is_open && (
                      <button onClick={() => startClearHold(h.id)} disabled={clearingHoldId === h.id}
                        style={{ background: WARN, border: 'none', color: '#1a1206', padding: '8px 14px', borderRadius: 8, cursor: clearingHoldId === h.id ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', opacity: clearingHoldId === h.id ? 0.6 : 1 }}>
                        {clearingHoldId === h.id ? tc('factory_production.hold_clearing') : tc('factory_production.hold_clear_button')}
                      </button>
                    )}
                  </div>
                ))}
                {clearError && <div style={{ fontSize: 12, color: BAD }}>{clearError}</div>}
              </div>
            )}

            {detail.notes && (
              <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{tc('factory_production.detail_notes')}</div>
                <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.5 }}>{detail.notes}</div>
              </div>
            )}

            {detail.status === 'rejected' && detail.rejection_reason && (
              <div style={{ background: '#7f1d1d', border: `1px solid ${BAD}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{tc('factory_production.detail_rejection_reason')}</div>
                <div style={{ fontSize: 14, color: '#fee2e2', lineHeight: 1.5 }}>{detail.rejection_reason}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: valueColor || '#f1f5f9', textTransform: valueColor ? 'capitalize' : 'none' }}>{value}</div>
    </div>
  )
}

const filterStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 8,
  color: '#f1f5f9',
  fontSize: 13,
  outline: 'none',
}
