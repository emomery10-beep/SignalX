'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

type Tc = (key: string, vars?: Record<string, string | number>) => string

const ACC = '#f59e0b'

const GOOD = '#22c55e'
const WARN = '#f59e0b'
const BAD = '#ef4444'

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'

interface Capture {
  id: string
  type: CaptureType
  product_name: string | null
  quantity: number | null
  batch_ref: string | null      // holds unit
  notes: string | null
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: string
  approved_at: string | null
  captured_by_staff?: { id: string; name: string; role: string } | null
  approved_by_staff?: { id: string; name: string; role: string } | null
}

const TYPE_META: Record<CaptureType, { icon: string; color: string }> = {
  intake:   { icon: '📥', color: '#3b82f6' },
  output:   { icon: '📤', color: GOOD },
  wastage:  { icon: '🗑️', color: BAD },
  dispatch: { icon: '🚚', color: '#8b5cf6' },
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

  // filters
  const [fType, setFType] = useState<'' | CaptureType>('')
  const [fStatus, setFStatus] = useState<'' | 'pending' | 'approved' | 'rejected'>('')
  const [fDate, setFDate] = useState('')
  const [fProduct, setFProduct] = useState('')

  const [detail, setDetail] = useState<Capture | null>(null)

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: session.headers }).then(r => r.json()).catch(() => {})
    load()
  }, [authReady, session])

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

  const filtered = captures.filter(c => {
    if (fType && c.type !== fType) return false
    if (fStatus && c.status !== fStatus) return false
    if (fDate && !c.created_at.startsWith(fDate)) return false
    if (fProduct && !(c.product_name || '').toLowerCase().includes(fProduct.toLowerCase())) return false
    return true
  })

  // Yield summary: output qty / intake qty per product
  const yieldMap: Record<string, { intake: number; output: number }> = {}
  for (const c of captures) {
    const p = c.product_name || tc('factory_production.yield_unspecified')
    if (c.type === 'intake' || c.type === 'output') {
      yieldMap[p] = yieldMap[p] || { intake: 0, output: 0 }
      yieldMap[p][c.type] += c.quantity || 0
    }
  }
  const yields = Object.entries(yieldMap)
    .filter(([, v]) => v.intake > 0 || v.output > 0)
    .map(([product, v]) => ({ product, ...v, pct: v.intake > 0 ? (v.output / v.intake) * 100 : null }))
    .sort((a, b) => (b.output + b.intake) - (a.output + a.intake))
    .slice(0, 8)

  if (!authReady || !session) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>{tc('factory_production.loading')}</div>
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
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
                    <span style={{ fontSize: 20, fontWeight: 700, color: y.pct == null ? '#94a3b8' : y.pct >= 90 ? GOOD : y.pct >= 70 ? WARN : BAD }}>
                      {y.pct == null ? '—' : `${y.pct.toFixed(0)}%`}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{tc('factory_production.yield_out_in', { out: y.output.toLocaleString(), in: y.intake.toLocaleString() })}</span>
                  </div>
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
                        <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 600 }}>{c.product_name || '—'}</td>
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
              <Field label={tc('factory_production.detail_product')} value={detail.product_name || '—'} />
              <Field label={tc('factory_production.detail_quantity')} value={`${detail.quantity ?? '—'} ${detail.batch_ref || ''}`.trim()} />
              <Field label={tc('factory_production.detail_status')} value={tc('factory_production.status_' + detail.status)} valueColor={STATUS_COLOR[detail.status]} />
              <Field label={tc('factory_production.detail_logged')} value={fmtDate(detail.created_at)} />
              <Field label={tc('factory_production.detail_operator')} value={detail.captured_by_staff?.name || '—'} />
              {detail.approved_by_staff && <Field label={detail.status === 'rejected' ? tc('factory_production.detail_reviewed_by') : tc('factory_production.detail_approved_by')} value={detail.approved_by_staff.name} />}
            </div>

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
