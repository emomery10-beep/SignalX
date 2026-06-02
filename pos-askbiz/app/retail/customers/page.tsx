'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#22c55e'
const API = process.env.NEXT_PUBLIC_API_URL || ''

type Segment = 'new' | 'returning' | 'loyal' | 'lapsed'

interface TxnItem { name?: string; qty?: number; quantity?: number; price?: number }
interface Txn {
  id: string; total?: number; created_at?: string; status?: string
  pos_items?: TxnItem[]; pos_customers?: { id?: string; name?: string; phone?: string } | null
}
interface Customer {
  key: string; name: string; phone: string
  orders: number; spend: number; lastVisit: string | null; avgBasket: number
  segment: Segment; txns: Txn[]
}

const segMeta: Record<Segment, { label: string; color: string; desc: string }> = {
  new:       { label: 'New', color: '#3b82f6', desc: '1 order' },
  returning: { label: 'Returning', color: '#22c55e', desc: '2–5 orders' },
  loyal:     { label: 'Loyal', color: '#a855f7', desc: '6+ orders' },
  lapsed:    { label: 'Lapsed', color: '#ef4444', desc: '>90 days' },
}

export default function RetailCustomers() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [segFilter, setSegFilter] = useState<Segment | 'all'>('all')
  const [selected, setSelected] = useState<Customer | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
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
      const res = await fetch(`${API}/api/pos/transactions?limit=500`)
      const data = res.ok ? await res.json() : {}
      const txns: Txn[] = data.transactions || (Array.isArray(data) ? data : [])
      const map: Record<string, Customer> = {}
      const now = Date.now()
      txns.forEach(t => {
        const c = t.pos_customers
        if (!c || !(c.name || c.phone)) return
        const key = c.id || c.phone || c.name || 'unknown'
        if (!map[key]) {
          map[key] = { key, name: c.name || 'Unknown', phone: c.phone || '', orders: 0, spend: 0, lastVisit: null, avgBasket: 0, segment: 'new', txns: [] }
        }
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
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/retail')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>←</button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>📦 Customers</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Profiles & segments</div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Segment chips */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <Chip label={`All (${customers.length})`} active={segFilter === 'all'} color="#94a3b8" onClick={() => setSegFilter('all')} />
          {(Object.keys(segMeta) as Segment[]).map(s => (
            <Chip key={s} label={`${segMeta[s].label} (${segCounts[s]})`} active={segFilter === s} color={segMeta[s].color} onClick={() => setSegFilter(s)} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Main list */}
          <div>
            <input placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: '100%', marginBottom: 14 }} />
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={th}>Customer</th><th style={th}>Segment</th><th style={th}>Orders</th>
                  <th style={th}>Spend</th><th style={th}>Avg</th><th style={th}>Last Visit</th>
                </tr></thead>
                <tbody>
                  {loading && <tr><td style={td} colSpan={6}><span style={{ color: '#64748b' }}>Loading…</span></td></tr>}
                  {!loading && filtered.length === 0 && <tr><td style={td} colSpan={6}><span style={{ color: '#64748b' }}>No customers found</span></td></tr>}
                  {filtered.map(c => (
                    <tr key={c.key} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}
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
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>🏆 Top Spenders</div>
              {topSpenders.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>No data yet</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topSpenders.map((c, i) => (
                  <div key={c.key} onClick={() => setSelected(c)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <span style={{ color: '#64748b', width: 16, textAlign: 'right', fontSize: 12 }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{c.orders} orders</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ACC }}>{sym}{c.spend.toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', borderLeft: '1px solid #334155', width: '100%', maxWidth: 440, height: '100%', overflowY: 'auto', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{selected.phone || 'No phone'}</div>
                <span style={{ display: 'inline-block', marginTop: 8, background: segMeta[selected.segment].color + '22', color: segMeta[selected.segment].color, padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{segMeta[selected.segment].label} · {segMeta[selected.segment].desc}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
              <Stat label="Orders" value={`${selected.orders}`} />
              <Stat label="Spend" value={`${sym}${selected.spend.toFixed(2)}`} accent />
              <Stat label="Avg" value={`${sym}${selected.avgBasket.toFixed(2)}`} />
            </div>

            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Purchase History</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.txns.map(t => {
                const items = (t.pos_items || [])
                return (
                  <div key={t.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: items.length ? 8 : 0 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.created_at ? new Date(t.created_at).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: ACC }}>{sym}{(t.total || 0).toFixed(2)}</span>
                    </div>
                    {items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1' }}>
                        <span>{(it.qty || it.quantity || 1)}× {it.name || 'Item'}</span>
                        {it.price != null && <span style={{ color: '#64748b' }}>{sym}{it.price.toFixed(2)}</span>}
                      </div>
                    ))}
                  </div>
                )
              })}
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
