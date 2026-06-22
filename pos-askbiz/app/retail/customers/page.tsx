'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

type Tc = (key: string, vars?: Record<string, string | number>) => string

const ACC = '#22c55e'
const API = process.env.NEXT_PUBLIC_API_URL || ''

type Segment = 'new' | 'returning' | 'loyal' | 'lapsed'

interface TxnItem { name?: string; qty?: number; quantity?: number; price?: number }
interface Txn {
  id: string; total?: number; created_at?: string; status?: string
  pos_items?: TxnItem[]; pos_customers?: { id?: string; name?: string; phone?: string } | null
}
interface Customer {
  key: string; id: string | null; name: string; phone: string
  orders: number; spend: number; lastVisit: string | null; avgBasket: number
  segment: Segment; txns: Txn[]
}

const SEG_COLOR: Record<Segment, string> = {
  new: '#3b82f6', returning: '#22c55e', loyal: '#a855f7', lapsed: '#ef4444',
}

function buildSegMeta(tc: Tc): Record<Segment, { label: string; color: string; desc: string }> {
  return {
    new:       { label: tc('retail_customers.seg_new_label'),       color: SEG_COLOR.new,       desc: tc('retail_customers.seg_new_desc')       },
    returning: { label: tc('retail_customers.seg_returning_label'), color: SEG_COLOR.returning, desc: tc('retail_customers.seg_returning_desc') },
    loyal:     { label: tc('retail_customers.seg_loyal_label'),     color: SEG_COLOR.loyal,     desc: tc('retail_customers.seg_loyal_desc')     },
    lapsed:    { label: tc('retail_customers.seg_lapsed_label'),    color: SEG_COLOR.lapsed,    desc: tc('retail_customers.seg_lapsed_desc')    },
  }
}

export default function RetailCustomers() {
  const router = useRouter()
  const { tc } = useLang()
  const segMeta = buildSegMeta(tc)
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [segFilter, setSegFilter] = useState<Segment | 'all'>('all')
  const [selected, setSelected] = useState<Customer | null>(null)
  const [exporting, setExporting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [gdprMsg, setGdprMsg] = useState<{ text: string; error?: boolean } | null>(null)

  const [staffHeaders, setStaffHeaders] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pos_staff')
      if (raw) {
        const s = JSON.parse(raw)
        if (s?.id && s?.owner_id) {
          const h = { 'x-staff-id': s.id, 'x-owner-id': s.owner_id }
          setStaffHeaders(h)
          if (s.currency_symbol) setSym(s.currency_symbol)
          setReady(true)
          return
        }
      }
    } catch {}
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  useEffect(() => { if (ready) load() }, [ready])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/transactions?limit=500`, { headers: staffHeaders })
      const data = res.ok ? await res.json() : {}
      const txns: Txn[] = data.transactions || (Array.isArray(data) ? data : [])
      const map: Record<string, Customer> = {}
      const now = Date.now()
      txns.forEach(t => {
        const c = t.pos_customers
        if (!c || !(c.name || c.phone)) return
        const key = c.id || c.phone || c.name || 'unknown'
        if (!map[key]) {
          map[key] = { key, id: c.id || null, name: c.name || tc('retail_customers.unknown_customer'), phone: c.phone || '', orders: 0, spend: 0, lastVisit: null, avgBasket: 0, segment: 'new', txns: [] }
        }
        if (!map[key].id && c.id) map[key].id = c.id
        const cust = map[key]
        cust.orders += 1
        cust.spend += t.total || 0
        cust.txns.push(t)
        if (t.created_at && (!cust.lastVisit || new Date(t.created_at) > new Date(cust.lastVisit))) cust.lastVisit = t.created_at
      })
      const list = Object.values(map).map(c => {
        c.avgBasket = c.orders ? c.spend / c.orders : 0
        const daysSince = c.lastVisit ? (now - new Date(c.lastVisit).getTime()) / 86400000 : Infinity
        if (daysSince > 90) c.segment = 'lapsed'
        else if (c.orders >= 6) c.segment = 'loyal'
        else if (c.orders >= 2) c.segment = 'returning'
        else c.segment = 'new'
        c.txns.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        return c
      })
      list.sort((a, b) => b.spend - a.spend)
      setCustomers(list)
    } catch (e) { console.error('customers load error', e) }
    finally { setLoading(false) }
  }

  function closeDrawer() {
    setSelected(null); setConfirmDelete(false); setGdprMsg(null)
  }

  async function exportData(format: 'json' | 'csv') {
    if (!selected || exporting) return
    setExporting(true); setGdprMsg(null)
    try {
      const body: Record<string, unknown> = { format }
      if (selected.id) body.customer_id = selected.id
      else if (selected.phone) body.customer_phone = selected.phone
      else throw new Error(tc('retail_customers.no_id_to_export'))
      const res = await fetch(`${API}/api/pos/gdpr/customer-data-export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || tc('retail_customers.export_failed_status', { status: res.status }))
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customer_data_${selected.id || selected.phone || 'export'}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setGdprMsg({ text: tc('retail_customers.data_exported', { format: format.toUpperCase() }) })
    } catch (e) {
      setGdprMsg({ text: e instanceof Error ? e.message : tc('retail_customers.export_failed'), error: true })
    } finally {
      setExporting(false)
    }
  }

  async function anonymizeCustomer() {
    if (!selected || deleting) return
    setDeleting(true); setGdprMsg(null)
    try {
      const body: Record<string, unknown> = { deletion_type: 'anonymization', reason: 'customer_request' }
      if (selected.id) body.customer_id = selected.id
      else if (selected.phone) body.customer_phone = selected.phone
      else throw new Error(tc('retail_customers.no_id_to_anonymize'))
      const res = await fetch(`${API}/api/pos/gdpr/delete-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || tc('retail_customers.deletion_failed_status', { status: res.status }))
      }
      setConfirmDelete(false)
      closeDrawer()
      await load()
    } catch (e) {
      setGdprMsg({ text: e instanceof Error ? e.message : tc('retail_customers.deletion_failed'), error: true })
      setDeleting(false)
    }
    setDeleting(false)
  }

  const segCounts: Record<Segment, number> = { new: 0, returning: 0, loyal: 0, lapsed: 0 }
  customers.forEach(c => segCounts[c.segment]++)

  const filtered = customers.filter(c => {
    if (segFilter !== 'all' && c.segment !== segFilter) return false
    if (search && !(`${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  const topSpenders = [...customers].slice(0, 5)

  const inp: React.CSSProperties = { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }
  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #334155' }
  const td: React.CSSProperties = { padding: '12px', fontSize: 13, borderBottom: '1px solid #1e293b' }

  function fmtDate(d: string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString([], { day: '2-digit', month: 'short', year: '2-digit' })
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/retail')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>←</button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>📦 {tc('retail_customers.header_title')}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{tc('retail_customers.header_subtitle')}</div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Segment chips */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <Chip label={tc('retail_customers.chip_all', { count: customers.length })} active={segFilter === 'all'} color="#94a3b8" onClick={() => setSegFilter('all')} />
          {(Object.keys(segMeta) as Segment[]).map(s => (
            <Chip key={s} label={tc('retail_customers.chip_segment', { label: segMeta[s].label, count: segCounts[s] })} active={segFilter === s} color={segMeta[s].color} onClick={() => setSegFilter(s)} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Main list */}
          <div>
            <input placeholder={tc('retail_customers.search_placeholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: '100%', marginBottom: 14 }} />
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={th}>{tc('retail_customers.col_customer')}</th><th style={th}>{tc('retail_customers.col_segment')}</th><th style={th}>{tc('retail_customers.col_orders')}</th>
                  <th style={th}>{tc('retail_customers.col_spend')}</th><th style={th}>{tc('retail_customers.col_avg')}</th><th style={th}>{tc('retail_customers.col_last_visit')}</th>
                </tr></thead>
                <tbody>
                  {loading && <tr><td style={td} colSpan={6}><span style={{ color: '#64748b' }}>{tc('retail_customers.loading')}</span></td></tr>}
                  {!loading && filtered.length === 0 && <tr><td style={td} colSpan={6}><span style={{ color: '#64748b' }}>{search || segFilter !== 'all' ? tc('retail_customers.no_match') : tc('retail_customers.no_customers_yet')}</span></td></tr>}
                  {filtered.map((c, idx) => (
                    <tr key={c.key} className="pos-item" onClick={() => setSelected(c)} style={{ cursor: 'pointer', animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ ...td, fontWeight: 600 }}>{c.name}<div style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}>{c.phone || '—'}</div></td>
                      <td style={td}><span style={{ background: segMeta[c.segment].color + '22', color: segMeta[c.segment].color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{segMeta[c.segment].label}</span></td>
                      <td style={td}>{c.orders}</td>
                      <td style={{ ...td, fontWeight: 700, color: ACC }}>{sym}{c.spend.toFixed(2)}</td>
                      <td style={{ ...td, color: '#94a3b8' }}>{sym}{c.avgBasket.toFixed(2)}</td>
                      <td style={{ ...td, color: '#94a3b8' }}>{fmtDate(c.lastVisit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top spenders */}
          <div>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>🏆 {tc('retail_customers.top_spenders')}</div>
              {topSpenders.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>{tc('retail_customers.no_data_yet')}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topSpenders.map((c, i) => (
                  <button key={c.key} type="button" className="pos-item" onClick={() => setSelected(c)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', animationDelay: `${Math.min(i, 8) * 40}ms`, background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0, color: 'inherit' }}>
                    <span style={{ color: '#64748b', width: 16, textAlign: 'right', fontSize: 12 }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{tc('retail_customers.orders_count', { count: c.orders })}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ACC }}>{sym}{c.spend.toFixed(0)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }} onClick={closeDrawer}>
          <div className="pos-sheet" onClick={e => e.stopPropagation()} style={{ background: '#1e293b', borderLeft: '1px solid #334155', width: '100%', maxWidth: 440, height: '100%', overflowY: 'auto', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{selected.phone || tc('retail_customers.no_phone')}</div>
                <span style={{ display: 'inline-block', marginTop: 8, background: segMeta[selected.segment].color + '22', color: segMeta[selected.segment].color, padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{segMeta[selected.segment].label} · {segMeta[selected.segment].desc}</span>
              </div>
              <button onClick={closeDrawer} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
              <Stat label={tc('retail_customers.stat_orders')} value={`${selected.orders}`} />
              <Stat label={tc('retail_customers.stat_spend')} value={`${sym}${selected.spend.toFixed(2)}`} accent />
              <Stat label={tc('retail_customers.stat_avg')} value={`${sym}${selected.avgBasket.toFixed(2)}`} />
            </div>

            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tc('retail_customers.purchase_history')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.txns.map((t, idx) => {
                const items = (t.pos_items || [])
                return (
                  <div key={t.id} className="pos-item" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '12px 14px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: items.length ? 8 : 0 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.created_at ? new Date(t.created_at).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: ACC }}>{sym}{(t.total || 0).toFixed(2)}</span>
                    </div>
                    {items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1' }}>
                        <span>{(it.qty || it.quantity || 1)}× {it.name || tc('retail_customers.item_fallback')}</span>
                        {it.price != null && <span style={{ color: '#64748b' }}>{sym}{it.price.toFixed(2)}</span>}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* GDPR data-subject actions */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #334155' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{tc('retail_customers.gdpr_title')}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>{tc('retail_customers.gdpr_subtitle')}</div>

              {gdprMsg && (
                <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, fontSize: 12, background: gdprMsg.error ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)', color: gdprMsg.error ? '#fca5a5' : '#86efac', border: `1px solid ${gdprMsg.error ? '#ef4444' : '#22c55e'}33` }}>
                  {gdprMsg.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <button onClick={() => exportData('json')} disabled={exporting} style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '10px 12px', borderRadius: 8, cursor: exporting ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: exporting ? 0.6 : 1 }}>
                  {exporting ? tc('retail_customers.exporting') : tc('retail_customers.export_json')}
                </button>
                <button onClick={() => exportData('csv')} disabled={exporting} style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '10px 12px', borderRadius: 8, cursor: exporting ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: exporting ? 0.6 : 1 }}>
                  {exporting ? tc('retail_customers.exporting') : tc('retail_customers.export_csv')}
                </button>
              </div>

              {!confirmDelete ? (
                <button onClick={() => { setConfirmDelete(true); setGdprMsg(null) }} disabled={selected.id == null && !selected.phone} style={{ width: '100%', background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  {tc('retail_customers.delete_anonymize')}
                </button>
              ) : (
                <div style={{ background: '#0f172a', border: '1px solid #ef4444', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600, marginBottom: 6 }}>{tc('retail_customers.anonymize_confirm_title')}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
                    {tc('retail_customers.anonymize_confirm_body')}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setConfirmDelete(false)} disabled={deleting} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {tc('retail_customers.cancel')}
                    </button>
                    <button onClick={anonymizeCustomer} disabled={deleting} style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8, cursor: deleting ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, opacity: deleting ? 0.6 : 1 }}>
                      {deleting ? tc('retail_customers.anonymizing') : tc('retail_customers.confirm_anonymize')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: active ? color : '#1e293b', border: `1px solid ${active ? color : '#334155'}`, color: active ? '#0f172a' : '#94a3b8', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
      {label}
    </button>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: accent ? ACC : '#f1f5f9', marginTop: 4 }}>{value}</div>
    </div>
  )
}
