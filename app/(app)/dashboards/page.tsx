'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface KPI { label: string; value: string; sub: string; trend: 'up'|'down'|'flat'; color: string; icon: string; bg: string }
interface Insight { id: string; type: 'alert'|'trend'|'tip'|'win'; message: string; action: string; urgency: 'high'|'medium'|'low' }

const URGENCY_COLOR  = { high:'#f48080', medium:'#f5c55a', low:'var(--acc)' }
const URGENCY_BG     = { high:'rgba(244,128,128,.07)', medium:'rgba(245,197,90,.07)', low:'rgba(208,138,89,.07)' }
const URGENCY_BORDER = { high:'rgba(244,128,128,.2)', medium:'rgba(245,197,90,.2)', low:'rgba(208,138,89,.2)' }

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState('there')
  const [currency, setCurrency] = useState('$')
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [uploads, setUploads] = useState<{id:string;filename:string;row_count:number}[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('Good morning')
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chart2Ref = useRef<HTMLCanvasElement>(null)
  const ci1 = useRef<unknown>(null)
  const ci2 = useRef<unknown>(null)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: profile }, { data: ups }] = await Promise.all([
      supabase.from('profiles').select('full_name, currency_symbol, business_type').eq('id', user.id).single(),
      supabase.from('uploads').select('id, filename, row_count, parsed_sample, column_names').eq('user_id', user.id).eq('status','parsed').order('created_at', { ascending: false }).limit(5),
    ])
    const name = profile?.full_name?.split(' ')[0] || 'there'
    const sym  = profile?.currency_symbol || 'KSh'
    setUserName(name); setCurrency(sym); setUploads(ups || [])

    const latestUpload = ups?.[0]
    if (latestUpload?.parsed_sample) {
      const rows = latestUpload.parsed_sample as Record<string,unknown>[]
      const cols = (latestUpload.column_names as string[]) || []
      const priceCol  = cols.find(c => /price|revenue|sales|amount/i.test(c))
      const stockCol  = cols.find(c => /stock|qty|quantity|inventory/i.test(c))
      const marginCol = cols.find(c => /margin/i.test(c))
      const totalRev  = priceCol ? rows.reduce((s,r) => s + Number(r[priceCol]||0), 0) : 0
      const avgMargin = marginCol ? rows.reduce((s,r) => s + Number(r[marginCol]||0), 0) / rows.length : 0
      const lowStock  = stockCol ? rows.filter(r => Number(r[stockCol]) < 10).length : 0
      const bestItem  = priceCol ? [...rows].sort((a,b) => Number(b[priceCol]||0) - Number(a[priceCol]||0))[0] : null
      const bestName  = bestItem ? String(bestItem[cols[0]] || 'Top item') : '—'

      setKpis([
        { label:'Total revenue',    value: totalRev > 0 ? `${sym} ${Math.round(totalRev).toLocaleString()}` : 'Upload data', sub:'From your latest file',   trend:'up',   color:'#d08a59', bg:'rgba(208,138,89,.08)',  icon:'💰' },
        { label:'Avg margin',       value: avgMargin > 0 ? `${avgMargin.toFixed(1)}%` : '—',                                  sub:'Across all products',    trend: avgMargin>20?'up':'down', color: avgMargin>20?'#22c55e':'#f48080', bg: avgMargin>20?'rgba(34,197,94,.08)':'rgba(244,128,128,.08)', icon:'📊' },
        { label:'Low stock items',  value: lowStock > 0 ? `${lowStock} items` : '✓ All good',                                 sub:'Need restocking soon',   trend: lowStock>0?'down':'up', color: lowStock>0?'#f48080':'#22c55e', bg: lowStock>0?'rgba(244,128,128,.08)':'rgba(34,197,94,.08)', icon:'📦' },
        { label:'Top product',      value: bestName.length > 18 ? bestName.slice(0,18)+'…' : bestName,                        sub:'Highest revenue item',   trend:'up',   color:'#8c6fe0', bg:'rgba(140,111,224,.08)', icon:'🏆' },
      ])

      const newInsights: Insight[] = []
      if (stockCol) {
        const critical = rows.filter(r => Number(r[stockCol]) < 5)
        if (critical.length > 0) {
          const names = critical.slice(0,3).map(r => String(r[cols[0]])).join(', ')
          newInsights.push({ id:'1', type:'alert', message:`${critical.length} item${critical.length>1?'s':''} critically low — ${names}`, action:'See which items', urgency:'high' })
        }
      }
      if (marginCol) {
        const low = rows.filter(r => Number(r[marginCol]) < 15)
        if (low.length > 0) newInsights.push({ id:'2', type:'trend', message:`${low.length} products have margins below 15% — worth reviewing pricing`, action:'Ask AskBiz', urgency:'medium' })
      }
      if (newInsights.length === 0) {
        newInsights.push({ id:'3', type:'tip', message:'Ask AskBiz "What should I restock this week?" for a personalised recommendation', action:'Ask now', urgency:'low' })
        newInsights.push({ id:'4', type:'tip', message:'Try our industry templates — pre-built questions for retail, ecommerce, distributors, and exporters.', action:'Browse templates', urgency:'low' })
      }
      setInsights(newInsights)
      setLoading(false)
      setTimeout(() => buildCharts(rows, cols, sym, priceCol, marginCol), 200)
    } else {
      setKpis([
        { label:'Total revenue',   value:'Upload data', sub:'Connect your first file', trend:'flat', color:'var(--tx3)', bg:'var(--ev)', icon:'💰' },
        { label:'Avg margin',      value:'—',           sub:'No data yet',             trend:'flat', color:'var(--tx3)', bg:'var(--ev)', icon:'📊' },
        { label:'Low stock items', value:'—',           sub:'No data yet',             trend:'flat', color:'var(--tx3)', bg:'var(--ev)', icon:'📦' },
        { label:'Top product',     value:'—',           sub:'No data yet',             trend:'flat', color:'var(--tx3)', bg:'var(--ev)', icon:'🏆' },
      ])
      setInsights([
        { id:'1', type:'tip', message:'Upload a CSV or Excel file to see your business KPIs instantly', action:'Upload now', urgency:'low' },
        { id:'2', type:'tip', message:'Connect Shopify or Stripe to get live revenue and inventory data', action:'Connect sources', urgency:'low' },
      ])
      setLoading(false)
    }
  }

  const buildCharts = (rows: Record<string,unknown>[], cols: string[], sym: string, priceCol?: string, marginCol?: string) => {
    if (typeof window === 'undefined') return
    import('chart.js/auto').then(({ default: Chart }) => {
      const font = { family: 'DM Sans, sans-serif', size: 11 }
      const grid = { color: 'rgba(0,0,0,.06)', drawBorder: false }
      const ticks = { color: '#a39e97', font }
      const tooltip = { backgroundColor: '#fff', titleColor: '#1a1916', bodyColor: '#6b6760', borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, padding: 10, cornerRadius: 8 }

      // Bar chart — top 6 products by revenue
      if (chartRef.current) {
        if (ci1.current) (ci1.current as {destroy:()=>void}).destroy()
        const nameCol = cols[0]
        const sorted = priceCol ? [...rows].sort((a,b) => Number(b[priceCol]||0) - Number(a[priceCol]||0)).slice(0,6) : []
        const labels = sorted.map(r => { const n = String(r[nameCol]||''); return n.length > 14 ? n.slice(0,14)+'…' : n })
        const data   = sorted.map(r => Math.round(Number(r[priceCol!]||0)))
        const colors = data.map((_,i) => i < 3 ? 'rgba(208,138,89,.75)' : 'rgba(140,111,224,.65)')

        ci1.current = new Chart(chartRef.current.getContext('2d')!, {
          type: 'bar',
          data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 8, borderSkipped: false }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip },
            scales: {
              x: { grid: { display: false }, ticks },
              y: { grid, ticks: { ...ticks, callback: (v: number) => `${sym} ${Number(v).toLocaleString()}` }, beginAtZero: true }
            }
          }
        })
      }

      // Donut — margin health
      if (chart2Ref.current) {
        if (ci2.current) (ci2.current as {destroy:()=>void}).destroy()
        let high = 0, mid = 0, low = 0
        if (rows && marginCol) {
          rows.forEach(r => { const m = Number(r[marginCol]||0); if(m>25) high++; else if(m>15) mid++; else low++ })
        } else { high = 4; mid = 5; low = 3 }

        ci2.current = new Chart(chart2Ref.current.getContext('2d')!, {
          type: 'doughnut',
          data: {
            labels: ['High >25%', 'Mid 15–25%', 'Low <15%'],
            datasets: [{ data: [high, mid, low], backgroundColor: ['rgba(34,197,94,.75)', 'rgba(208,138,89,.75)', 'rgba(244,128,128,.7)'], borderWidth: 0, hoverOffset: 6 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: {
              legend: { position: 'bottom', labels: { color: '#6b6760', font, boxWidth: 10, padding: 10 } },
              tooltip
            }
          }
        })
      }
    })
  }

  const handleAction = (action: string) => {
    if (action === 'Upload now' || action === 'Upload data') router.push('/files')
    else if (action === 'Connect sources') router.push('/sources')
    else if (action === 'View alerts' || action === 'See which items') router.push('/alerts')
    else if (action === 'Browse templates') router.push('/templates')
    else router.push('/chat')
  }

  const quickActions = [
    { label:'Ask a question', icon:'💬', desc:'Talk to your data in plain English', href:'/chat',      accent:'rgba(208,138,89,.1)',  border:'rgba(208,138,89,.25)' },
    { label:'Upload a file',  icon:'📂', desc:'CSV or Excel file',                  href:'/files',     accent:'rgba(140,111,224,.1)',border:'rgba(140,111,224,.25)' },
    { label:'Set an alert',   icon:'🔔', desc:'Get notified on changes',            href:'/alerts',    accent:'rgba(245,197,90,.1)', border:'rgba(245,197,90,.25)' },
    { label:'Run a forecast', icon:'📈', desc:'Predict future demand',              href:'/forecasts', accent:'rgba(34,197,94,.1)',  border:'rgba(34,197,94,.25)' },
  ]

  return (
    <div className="page-shell">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ padding:'clamp(14px,4vw,22px) clamp(14px,3vw,24px) 0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-sora)', fontSize:22, fontWeight:700, letterSpacing:'-.025em', marginBottom:3 }}>
              {greeting}, {loading ? '…' : userName} 👋
            </h1>
            <p style={{ fontSize:13, color:'var(--tx2)' }}>
              {loading ? 'Loading your snapshot…' : uploads.length > 0 ? "Here's what's happening in your business right now." : 'Upload your first file to get started.'}
            </p>
          </div>
          <button onClick={() => router.push('/chat')}
            style={{ padding:'9px 18px', borderRadius:9999, border:'none', background:'var(--acc)', color:'#fff', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Ask AskBiz
          </button>
        </div>

        {/* ── KPI CARDS ─────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:22 }}>
          {(loading ? [{label:'…',value:'…',sub:'',trend:'flat',color:'var(--tx3)',bg:'var(--ev)',icon:'💰'},{label:'…',value:'…',sub:'',trend:'flat',color:'var(--tx3)',bg:'var(--ev)',icon:'📊'},{label:'…',value:'…',sub:'',trend:'flat',color:'var(--tx3)',bg:'var(--ev)',icon:'📦'},{label:'…',value:'…',sub:'',trend:'flat',color:'var(--tx3)',bg:'var(--ev)',icon:'🏆'}] as KPI[] : kpis).map((k,i) => (
            <div key={i} style={{ padding:'16px 18px', borderRadius:16, border:'1px solid var(--b)', background:'var(--sf)', transition:'transform 200ms, box-shadow 200ms', cursor:'default' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 4px 16px rgba(0,0,0,.08)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='none'; el.style.boxShadow='none' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{k.icon}</div>
                <div style={{ fontSize:18, color: k.trend==='up'?'#22c55e':k.trend==='down'?'#f48080':'var(--tx3)', fontWeight:500 }}>
                  {k.trend==='up'?'↑':k.trend==='down'?'↓':''}
                </div>
              </div>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:20, fontWeight:700, color:k.color, marginBottom:3, lineHeight:1.2, animation: loading?'shimmer 1.4s infinite':'' }}>{loading ? '' : k.value}</div>
              <div style={{ fontSize:12, color:'var(--tx2)', fontWeight:500 }}>{k.label}</div>
              <div style={{ fontSize:11, color:'var(--tx3)', marginTop:2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────── */}
      <div style={{ padding:'0 24px 24px', display:'grid', gridTemplateColumns:'1fr', gap:16, flex:1, minHeight:0 }}>

        {/* ── LEFT COLUMN ────────────────────────────────── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>

          {/* Insights feed */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, marginBottom:2 }}>Business insights</div>
                <div style={{ fontSize:11, color:'var(--tx3)' }}>AskBiz is watching your data</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#22c55e', fontWeight:500 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2s infinite' }}/>
                Live
              </div>
            </div>
            {loading
              ? [1,2].map(i => <div key={i} style={{ height:52, borderRadius:12, background:'var(--ev)', marginBottom:8, animation:'shimmer 1.4s infinite', backgroundSize:'200% 100%' }}></div>)
              : insights.map(ins => (
                <div key={ins.id} onClick={() => handleAction(ins.action)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:12, border:`1px solid ${URGENCY_BORDER[ins.urgency]}`, background:URGENCY_BG[ins.urgency], marginBottom:8, cursor:'pointer', transition:'transform 150ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform='translateX(3px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform='none'}>
                  <div style={{ fontSize:18, flexShrink:0 }}>{ins.type==='alert'?'⚠️':ins.type==='win'?'🎯':ins.type==='trend'?'📈':'💡'}</div>
                  <div style={{ flex:1, fontSize:13, color:'var(--tx)', lineHeight:1.5 }}>{ins.message}</div>
                  <div style={{ fontSize:11, color:URGENCY_COLOR[ins.urgency], fontWeight:500, flexShrink:0, whiteSpace:'nowrap' }}>{ins.action} →</div>
                </div>
              ))
            }
          </div>

          {/* Bar chart */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, marginBottom:2 }}>Revenue by product</div>
                <div style={{ fontSize:11, color:'var(--tx3)' }}>Top 6 products from your latest file</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--tx3)' }}><span style={{ width:10, height:10, borderRadius:3, background:'rgba(208,138,89,.75)', display:'inline-block' }}/> Top 3</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--tx3)' }}><span style={{ width:10, height:10, borderRadius:3, background:'rgba(140,111,224,.65)', display:'inline-block' }}/> Others</div>
              </div>
            </div>
            <div style={{ position:'relative', height:180 }}>
              {uploads.length === 0
                ? <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
                    <div style={{ fontSize:28 }}>📊</div>
                    <div style={{ fontSize:13, color:'var(--tx3)', textAlign:'center' }}>Upload a file to see your revenue chart</div>
                    <button onClick={() => router.push('/files')} style={{ padding:'6px 14px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--acc)', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>Upload CSV →</button>
                  </div>
                : <canvas ref={chartRef}/>
              }
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────────── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Quick actions */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'18px 18px' }}>
            <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, marginBottom:3 }}>Quick actions</div>
            <div style={{ fontSize:11, color:'var(--tx3)', marginBottom:12 }}>What do you want to do?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {quickActions.map((a,i) => (
                <div key={i} onClick={() => router.push(a.href)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, border:`1px solid ${a.border}`, background:a.accent, cursor:'pointer', transition:'transform 150ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform='translateX(3px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform='none'}>
                  <div style={{ fontSize:18, flexShrink:0 }}>{a.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{a.label}</div>
                    <div style={{ fontSize:11, color:'var(--tx3)' }}>{a.desc}</div>
                  </div>
                  <div style={{ color:'var(--tx3)', fontSize:12 }}>→</div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'18px 18px' }}>
            <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, marginBottom:2 }}>Margin health</div>
            <div style={{ fontSize:11, color:'var(--tx3)', marginBottom:12 }}>How are your margins distributed?</div>
            <div style={{ position:'relative', height:160 }}>
              {uploads.length === 0
                ? <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                    <div style={{ fontSize:24 }}>🍩</div>
                    <div style={{ fontSize:12, color:'var(--tx3)', textAlign:'center' }}>Upload data to see margins</div>
                  </div>
                : <canvas ref={chart2Ref}/>
              }
            </div>
          </div>

          {/* Files */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'18px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600 }}>Your files</div>
              <button onClick={() => router.push('/files')} style={{ fontSize:11, color:'var(--acc)', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Manage →</button>
            </div>
            {uploads.length === 0
              ? <label style={{ display:'block', padding:'14px', borderRadius:12, border:'2px dashed var(--b2)', textAlign:'center', cursor:'pointer', color:'var(--tx3)', fontSize:12 }}>
                  📂 Upload a CSV or Excel file
                  <input type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }} onChange={() => router.push('/files')}/>
                </label>
              : uploads.slice(0,3).map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom: i < Math.min(uploads.length,3)-1 ? '1px solid var(--b)' : 'none' }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:'rgba(208,138,89,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>📄</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.filename}</div>
                    <div style={{ fontSize:10, color:'var(--tx3)' }}>{f.row_count?.toLocaleString()} rows</div>
                  </div>
                  <button onClick={() => router.push('/chat')} style={{ fontSize:10, padding:'3px 8px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--tx2)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }}>Ask →</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
