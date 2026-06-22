'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

const ACC = '#22c55e'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const statusColor: Record<string, string> = {
  good: '#22c55e', warn: '#f59e0b', bad: '#ef4444', neutral: '#94a3b8',
}

interface KPI { label: string; value: string; sub?: string; status?: 'good' | 'warn' | 'bad' | 'neutral' }
interface InvItem {
  id: string; name: string; sku?: string; sale_price?: number; cost_price?: number
  stock_qty?: number; low_stock_threshold?: number; category?: string; last_sold_at?: string
}
interface TxnItem { name?: string; qty?: number; quantity?: number; price?: number }
interface Txn {
  id: string; total?: number; created_at?: string; status?: string; cashier?: string
  pos_items?: TxnItem[]; pos_customers?: { name?: string } | null
}

export default function RetailHub() {
  const router = useRouter()
  const { tc } = useLang()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPI[]>([])
  const [recent, setRecent] = useState<Txn[]>([])
  const [lowStock, setLowStock] = useState<InvItem[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    loadAll()
    const interval = setInterval(loadAll, 30000)
    return () => clearInterval(interval)
  }, [ready])

  async function loadAll() {
    setLoading(true)
    try {
      const [invRes, txnRes] = await Promise.all([
        fetch(`${API}/api/pos/inventory`),
        fetch(`${API}/api/pos/transactions?limit=500`),
      ])
      const invData = invRes.ok ? await invRes.json() : {}
      const txnData = txnRes.ok ? await txnRes.json() : {}
      const inventory: InvItem[] = invData.items || invData.inventory || (Array.isArray(invData) ? invData : [])
      const txns: Txn[] = txnData.transactions || (Array.isArray(txnData) ? txnData : [])

      // Today's transactions
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const todays = txns.filter(t => {
        if (!t.created_at) return false
        if (t.status && t.status !== 'completed' && t.status !== 'paid' && t.status !== 'complete') return false
        return new Date(t.created_at) >= today
      })

      const sales = todays.reduce((s, t) => s + (t.total || 0), 0)
      const txnCount = todays.length
      const avgBasket = txnCount ? sales / txnCount : 0
      let itemsSold = 0
      const sellerMap: Record<string, number> = {}
      todays.forEach(t => (t.pos_items || []).forEach(it => {
        const q = it.qty || it.quantity || 1
        itemsSold += q
        if (it.name) sellerMap[it.name] = (sellerMap[it.name] || 0) + q
      }))
      const topSeller = Object.entries(sellerMap).sort((a, b) => b[1] - a[1])[0]

      const low = inventory.filter(i =>
        typeof i.stock_qty === 'number' && i.stock_qty <= (i.low_stock_threshold ?? 5)
      ).sort((a, b) => (a.stock_qty ?? 0) - (b.stock_qty ?? 0))

      setKpis([
        { label: tc('retail.kpi_sales_today'), value: `${sym}${sales.toFixed(2)}`, sub: tc('retail.kpi_sales_today_sub' + (todays.length === 1 ? '_one' : '_other'), { count: todays.length }), status: 'good' },
        { label: tc('retail.kpi_transactions'), value: `${txnCount}`, sub: tc('retail.kpi_transactions_sub'), status: 'neutral' },
        { label: tc('retail.kpi_avg_basket'), value: `${sym}${avgBasket.toFixed(2)}`, sub: tc('retail.kpi_avg_basket_sub'), status: 'neutral' },
        { label: tc('retail.kpi_items_sold'), value: `${itemsSold}`, sub: tc('retail.kpi_items_sold_sub'), status: 'neutral' },
        { label: tc('retail.kpi_low_stock'), value: `${low.length}`, sub: tc('retail.kpi_low_stock_sub'), status: low.length > 0 ? 'warn' : 'good' },
        { label: tc('retail.kpi_top_seller'), value: topSeller ? topSeller[0] : '—', sub: topSeller ? tc('retail.kpi_top_seller_sub' + (topSeller[1] === 1 ? '_one' : '_other'), { count: topSeller[1] }) : tc('retail.kpi_top_seller_sub_none'), status: 'neutral' },
      ])
      setRecent(txns.slice(0, 10))
      setLowStock(low.slice(0, 8))
    } catch (e) {
      console.error('Retail hub load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const nav = [
    { label: tc('retail.nav_products_label'), href: '/retail/products', desc: tc('retail.nav_products_desc') },
    { label: tc('retail.nav_stocktake_label'), href: '/retail/stocktake', desc: tc('retail.nav_stocktake_desc') },
    { label: tc('retail.nav_customers_label'), href: '/retail/customers', desc: tc('retail.nav_customers_desc') },
  ]

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>{tc('retail.header_title')}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{tc('retail.header_subtitle')}</div>
        </div>
        <button onClick={() => router.push('/pos')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          {tc('retail.back_pos')}
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {kpis.map((kpi, idx) => (
            <div key={kpi.label} className="pos-reveal" style={{ background: '#1e293b', border: `1px solid ${kpi.status ? statusColor[kpi.status] + '40' : '#334155'}`, borderRadius: 12, padding: '14px 16px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: kpi.status ? statusColor[kpi.status] : '#f1f5f9', margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kpi.value}</div>
              {kpi.sub && <div style={{ fontSize: 11, color: '#64748b' }}>{kpi.sub}</div>}
            </div>
          ))}
        </div>

        {/* Navigation tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
          {nav.map(n => (
            <button key={n.href} onClick={() => router.push(n.href)}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '20px 18px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>{n.label.split(' ')[0]}</div>
              <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 15 }}>{n.label.split(' ').slice(1).join(' ')}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{n.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent Sales */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>{tc('retail.recent_sales_title')}</div>
            {loading && recent.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>{tc('retail.loading')}</div>}
            {!loading && recent.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>{tc('retail.no_sales_yet')}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map((t, idx) => {
                const count = (t.pos_items || []).reduce((s, it) => s + (it.qty || it.quantity || 1), 0)
                return (
                  <div key={t.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '10px 14px', borderRadius: 8, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.pos_customers?.name || tc('retail.walk_in')}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {tc('retail.sale_items' + (count !== 1 ? '_other' : '_one'), { count })}{t.cashier ? ` · ${t.cashier}` : ''}{t.created_at ? ` · ${new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: ACC }}>{sym}{(t.total || 0).toFixed(2)}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div style={{ background: '#1e293b', border: `1px solid ${lowStock.length ? '#f59e0b' : '#334155'}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15, color: lowStock.length ? '#f59e0b' : '#f1f5f9' }}>
              {lowStock.length ? tc('retail.low_stock_title') : tc('retail.stock_levels_title')}
            </div>
            {lowStock.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>{tc('retail.all_well_stocked')}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lowStock.map((i, idx) => {
                const q = i.stock_qty ?? 0
                const col = q <= 0 ? '#ef4444' : '#f59e0b'
                return (
                  <div key={i.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '10px 14px', borderRadius: 8, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{i.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{i.sku || i.category || '—'}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: col }}>{tc('retail.stock_left', { count: q })}</div>
                  </div>
                )
              })}
            </div>
            {lowStock.length > 0 && (
              <button onClick={() => router.push('/retail/products?low=1')} style={{ width: '100%', marginTop: 14, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                {tc('retail.manage_products')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
