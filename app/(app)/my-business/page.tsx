'use client'
import RetentionCard from '@/components/RetentionCard'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

interface HealthData {
  score: number
  label: string
  color: 'green' | 'amber' | 'red'
  summary: string
  topIssue?: string
  components?: {
    revenue_trend: number
    margin_health: number
    stock_risk: number
    cash_flow: number
  }
}

interface BriefData {
  improved: string
  worsened: string
  action: string
}

interface QuoteResult {
  service: string
  carrier: string
  service_name: string
  service_description: string
  customs_invoice_required: boolean
  total_price_gross: string
}

interface KPI { label: string; value: string; sub: string; trend: 'up'|'down'|'flat'; color: string; icon: string; bg: string }
interface Insight { id: string; type: 'alert'|'trend'|'tip'|'win'; message: string; action: string; urgency: 'high'|'medium'|'low' }

const URGENCY_COLOR  = { high:'#f48080', medium:'#f5c55a', low:'var(--acc)' }
const URGENCY_BG     = { high:'rgba(244,128,128,.07)', medium:'rgba(245,197,90,.07)', low:'rgba(208,138,89,.07)' }
const URGENCY_BORDER = { high:'rgba(244,128,128,.2)', medium:'rgba(245,197,90,.2)', low:'rgba(208,138,89,.2)' }

const HEALTH = {
  green: { text: '#16a34a', border: 'rgba(34,197,94,.2)',  bg: 'rgba(34,197,94,.06)',  glow: 'rgba(34,197,94,.12)' },
  amber: { text: '#d97706', border: 'rgba(245,158,11,.2)', bg: 'rgba(245,158,11,.06)', glow: 'rgba(245,158,11,.12)' },
  red:   { text: '#dc2626', border: 'rgba(239,68,68,.2)',  bg: 'rgba(239,68,68,.06)',  glow: 'rgba(239,68,68,.12)' },
}

function fmt(n: number, sym = '£') {
  if (n >= 1000) return sym + (n / 1000).toFixed(1) + 'k'
  return sym + n.toFixed(0)
}

function Bars({ data, accent }: { data: number[]; accent: string }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map((v, i) => {
        const h = Math.max(3, (v / max) * 40)
        const isLast = i === data.length - 1
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: '3px 3px 0 0',
              background: isLast ? accent : 'var(--ov)',
              transition: 'height 400ms var(--ease)',
            }}
          />
        )
      })}
    </div>
  )
}

export default function MyBusinessPage() {
  const { tc } = useLang()
  const router = useRouter()
  const supabase = createClient()
  const { user, settings } = useStore()
  const sym = settings?.symbol || '£'
  const plan = user?.plan || 'free'

  const [health, setHealth] = useState<HealthData | null>(null)
  const [brief, setBrief] = useState<BriefData | null>(null)
  const [history, setHistory] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)

  // Dashboard state (from uploaded files)
  const [userName, setUserName] = useState('there')
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [uploads, setUploads] = useState<{id:string;filename:string;row_count:number}[]>([])
  const [greeting, setGreeting] = useState('Good morning')
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chart2Ref = useRef<HTMLCanvasElement>(null)
  const ci1 = useRef<unknown>(null)
  const ci2 = useRef<unknown>(null)

  // Quote state
  const [showQuote, setShowQuote] = useState(false)
  const [nlInput, setNlInput] = useState('')
  const [nlParsing, setNlParsing] = useState(false)
  const [quotes, setQuotes] = useState<QuoteResult[]>([])
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [bookedUrl, setBookedUrl] = useState('')
  const [quoteForm, setQuoteForm] = useState({
    origin: 'GB', destination: '',
    weight_kg: '', length_cm: '', width_cm: '', height_cm: '', goods_value: '',
  })

  // Animate score
  useEffect(() => {
    if (!health) return
    const target = health.score
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / 1400, 1)
      setScore(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [health])

  // Load API data (health + daily brief)
  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? tc('page_mybusiness.greetingMorning') : h < 17 ? tc('page_mybusiness.greetingAfternoon') : tc('page_mybusiness.greetingEvening'))

    const load = async () => {
      try {
        const [hr, br] = await Promise.allSettled([
          fetch('/api/health'),
          fetch('/api/daily-brief'),
        ])
        if (hr.status === 'fulfilled' && hr.value.ok) {
          const d = await hr.value.json()
          if (d.latest) setHealth(d.latest)
          if (d.history?.length) setHistory(d.history.slice(-6).map((h: { score: number }) => Number(h.score) || 0))
        }
        if (br.status === 'fulfilled' && br.value.ok) {
          const d = await br.value.json()
          if (d.brief) setBrief(d.brief)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
    loadFileData()
  }, [])

  // Load file-based dashboard data
  const loadFileData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: profile }, { data: ups }] = await Promise.all([
      supabase.from('profiles').select('full_name, currency_symbol, business_type').eq('id', user.id).single(),
      supabase.from('uploads').select('id, filename, row_count, parsed_sample, column_names').eq('user_id', user.id).eq('status','parsed').order('created_at', { ascending: false }).limit(5),
    ])
    const name = profile?.full_name?.split(' ')[0] || 'there'
    setUserName(name)
    setUploads(ups || [])

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
      }
      setInsights(newInsights)
      setTimeout(() => buildCharts(rows, cols, sym, priceCol, marginCol), 200)
    } else {
      setInsights([
        { id:'1', type:'tip', message:'Upload a CSV or Excel file to see your business KPIs instantly', action:'Upload now', urgency:'low' },
        { id:'2', type:'tip', message:'Connect Shopify or Stripe to get live revenue and inventory data', action:'Connect sources', urgency:'low' },
      ])
    }
  }

  const buildCharts = (rows: Record<string,unknown>[], cols: string[], sym: string, priceCol?: string, marginCol?: string) => {
    if (typeof window === 'undefined') return
    import('chart.js/auto').then(({ default: Chart }) => {
      const font = { family: 'DM Sans, sans-serif', size: 11 }
      const grid = { color: 'rgba(0,0,0,.06)', drawBorder: false }
      const ticks = { color: '#a39e97', font }
      const tooltip = { backgroundColor: '#fff', titleColor: '#1a1916', bodyColor: '#6b6760', borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, padding: 10, cornerRadius: 8 }

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
              y: { grid, ticks: { ...ticks, callback: v => `${sym} ${Number(v).toLocaleString()}` }, beginAtZero: true }
            }
          }
        })
      }

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

  const ask = useCallback((prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }, [router])

  const handleInsightAction = (action: string) => {
    if (action === 'Upload now' || action === 'Upload data') router.push('/files')
    else if (action === 'Connect sources') router.push('/sources')
    else if (action === 'View alerts' || action === 'See which items') router.push('/alerts')
    else if (action === 'Browse templates') router.push('/templates')
    else router.push('/chat')
  }

  const handleNlParse = async () => {
    if (!nlInput.trim()) return
    setNlParsing(true)
    setQuoteError('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'parse', text: nlInput }),
      })
      const data = await res.json()
      if (data.success && data.parsed) {
        const p = data.parsed
        setQuoteForm({
          origin: p.origin || 'GB',
          destination: p.destination || '',
          weight_kg: p.weight_kg?.toString() || '',
          length_cm: p.length_cm?.toString() || '',
          width_cm: p.width_cm?.toString() || '',
          height_cm: p.height_cm?.toString() || '',
          goods_value: p.goods_value?.toString() || '',
        })
        if (!p.missing?.length) await fetchQuotes(p)
      }
    } catch {
      setQuoteError(tc('page_mybusiness.errorNlParse'))
    } finally {
      setNlParsing(false)
    }
  }

  const fetchQuotes = async (overrides?: Record<string, unknown>) => {
    setQuoteLoading(true)
    setQuoteError('')
    setQuotes([])
    setSelectedService('')
    setBookedUrl('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_quotes',
          origin: overrides?.origin || quoteForm.origin,
          destination: overrides?.destination || quoteForm.destination,
          weight_kg: overrides?.weight_kg ?? parseFloat(quoteForm.weight_kg),
          length_cm: overrides?.length_cm ?? parseFloat(quoteForm.length_cm),
          width_cm: overrides?.width_cm ?? parseFloat(quoteForm.width_cm),
          height_cm: overrides?.height_cm ?? parseFloat(quoteForm.height_cm),
          goods_value: overrides?.goods_value ?? parseFloat(quoteForm.goods_value),
        }),
      })
      const data = await res.json()
      if (data.error === 'profile_incomplete') {
        setQuoteError(tc('page_mybusiness.errorSettingsIncomplete'))
      } else if (data.success) {
        setQuotes(data.quotes || [])
      } else {
        setQuoteError(data.error || tc('page_mybusiness.errorNoQuotes'))
      }
    } catch {
      setQuoteError(tc('page_mybusiness.errorFetchQuotes'))
    } finally {
      setQuoteLoading(false)
    }
  }

  const handleBook = async () => {
    if (!selectedService) return
    try {
      const shipRes = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_shipment',
          service: selectedService,
          ...quoteForm,
          weight_kg: parseFloat(quoteForm.weight_kg),
          length_cm: parseFloat(quoteForm.length_cm),
          width_cm: parseFloat(quoteForm.width_cm),
          height_cm: parseFloat(quoteForm.height_cm),
          goods_value: parseFloat(quoteForm.goods_value),
          goods_description: 'Goods',
          recipient: { name: 'Recipient', address1: '1 Example St', town: 'City', county: 'County', postcode: '00000' },
        }),
      })
      const shipData = await shipRes.json()
      if (shipData.success) {
        const linkRes = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'payment_link', shipment_ids: [shipData.shipment.ShipmentId] }),
        })
        const linkData = await linkRes.json()
        if (linkData.success) setBookedUrl(linkData.url)
      }
    } catch {
      setQuoteError(tc('page_mybusiness.errorBookingFailed'))
    }
  }

  const c = health ? (HEALTH[health.color] || HEALTH.amber) : HEALTH.amber
  const circ = 2 * Math.PI * 46
  const dash = circ - (score / 100) * circ
  const revTrend = history.length >= 4 ? history : [55, 60, 58, 65, 70, 78]
  const shipTrend = [18, 20, 19, 22, 24, 42]

  const quickActions = [
    { label: tc('page_mybusiness.qaAskQuestion'), icon:'💬', desc: tc('page_mybusiness.qaAskDesc'),      href:'/chat',      accent:'rgba(208,138,89,.1)',  border:'rgba(208,138,89,.25)' },
    { label: tc('page_mybusiness.qaUploadFile'),  icon:'📂', desc: tc('page_mybusiness.qaUploadDesc'),   href:'/files',     accent:'rgba(140,111,224,.1)',border:'rgba(140,111,224,.25)' },
    { label: tc('page_mybusiness.qaSetAlert'),    icon:'🔔', desc: tc('page_mybusiness.qaAlertDesc'),    href:'/alerts',    accent:'rgba(245,197,90,.1)', border:'rgba(245,197,90,.25)' },
    { label: tc('page_mybusiness.qaRunForecast'), icon:'📈', desc: tc('page_mybusiness.qaForecastDesc'), href:'/forecasts', accent:'rgba(34,197,94,.1)',  border:'rgba(34,197,94,.25)' },
  ]

  return (
    <>
      <style>{`
        .mbc-wrap { min-height:100vh; background:var(--bg); padding-bottom:48px; }
        .mbc-inner { max-width:700px; margin:0 auto; padding:clamp(16px,4vw,28px) clamp(14px,4vw,24px); }
        .mbc-field label { display:block; font-size:11px; color:var(--tx3); margin-bottom:4px; font-weight:500; }
        .mbc-field input { width:100%; padding:9px 11px; font-size:13px; background:var(--bg); border:1px solid var(--b2); border-radius:var(--r-md); color:var(--tx); outline:none; font-family:inherit; box-sizing:border-box; transition:border-color 150ms; }
        .mbc-field input:focus { border-color:var(--acc); }
        .mbc-carrier { padding:12px 14px; border-radius:var(--r-md); border:1px solid var(--b); background:var(--ev); cursor:pointer; transition:border-color 150ms, background 150ms; }
        .mbc-carrier:hover { background:var(--ov); }
        .mbc-carrier.sel { border:2px solid #16a34a; background:rgba(34,197,94,.05); }
        @media(max-width:560px){
          .mbc-metrics { grid-template-columns:1fr 1fr !important; }
          .mbc-trends { grid-template-columns:1fr !important; }
          .mbc-qform { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <div className="mbc-wrap">
        <div className="mbc-inner">

          {/* ── Header ──────────────────────────────────────── */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div>
              <h1 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(18px,3vw,23px)', fontWeight:700, letterSpacing:'-.025em', marginBottom:3 }}>
                {tc('page_mybusiness.greetingHeading', { greeting, name: loading ? '…' : userName })}
              </h1>
              <p style={{ fontSize:17, color:'var(--tx2)' }}>
                {tc('page_mybusiness.headerSubtitle')}
              </p>
            </div>
            <button onClick={() => router.push('/chat')}
              style={{ padding:'9px 18px', borderRadius:9999, border:'none', background:'var(--acc)', color:'#fff', fontFamily:'inherit', fontSize:17, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {tc('page_mybusiness.btnAskAskbiz')}
            </button>
          </div>

          {/* ── KPI Cards (from file data) ─────────────────── */}
          {kpis.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:9, marginBottom:14 }}>
              {kpis.map((k,i) => (
                <div key={i} style={{ padding:'14px 16px', borderRadius:16, border:'1px solid var(--b)', background:'var(--sf)', transition:'transform 200ms, box-shadow 200ms', cursor:'default' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 4px 16px rgba(0,0,0,.08)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='none'; el.style.boxShadow='none' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{k.icon}</div>
                    <div style={{ fontSize:20, color: k.trend==='up'?'#22c55e':k.trend==='down'?'#f48080':'var(--tx3)', fontWeight:500 }}>
                      {k.trend==='up'?'↑':k.trend==='down'?'↓':''}
                    </div>
                  </div>
                  <div style={{ fontFamily:'var(--font-sora)', fontSize:22, fontWeight:700, color:k.color, marginBottom:2, lineHeight:1.2 }}>{k.value}</div>
                  <div style={{ fontSize:15, color:'var(--tx2)', fontWeight:500 }}>{k.label}</div>
                  <div style={{ fontSize:14, color:'var(--tx3)', marginTop:1 }}>{k.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Pulse hero ──────────────────────────────────── */}
          <div style={{
            borderRadius: 'var(--r-xl)',
            border: `1px solid ${c.border}`,
            background: c.bg,
            padding: 'clamp(16px,3vw,22px)',
            marginBottom: 12,
            boxShadow: `0 4px 28px ${c.glow}`,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
              <svg width="88" height="88" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--ov)" strokeWidth="8"/>
                <circle cx="50" cy="50" r="46" fill="none" stroke={c.text} strokeWidth="8"
                  strokeDasharray={circ} strokeDashoffset={loading ? circ : dash}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.06s linear', filter: `drop-shadow(0 0 6px ${c.glow})` }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                  <div style={{ width: 18, height: 18, border: `2px solid ${c.border}`, borderTopColor: c.text, borderRadius: '50%', animation: 'spin .8s linear infinite' }}/>
                ) : (
                  <>
                    <span style={{ fontSize: 28, fontWeight: 700, color: c.text, letterSpacing: '-.04em', lineHeight: 1, fontFamily: 'var(--font-sora)' }}>{score}</span>
                    <span style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 1 }}>{tc('page_mybusiness.pulseScoreSuffix')}</span>
                  </>
                )}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 600, color: c.text }}>
                  {loading ? tc('page_mybusiness.pulseCalculating') : health?.label || 'Business Pulse'}
                </span>
                <span style={{ fontSize: 15, color: 'var(--tx3)' }}>{tc('page_mybusiness.pulseHealthScore')}</span>
              </div>
              <p style={{ fontSize: 17, color: 'var(--tx2)', margin: '0 0 12px', lineHeight: 1.6 }}>
                {loading
                  ? tc('page_mybusiness.pulseFetching')
                  : health?.summary || tc('page_mybusiness.pulseConnectCta')}
              </p>
              {health?.topIssue && (
                <button onClick={() => ask(health.topIssue!)}
                  style={{ fontSize: 16, fontWeight: 600, color: c.text, background: 'transparent', border: `1px solid ${c.border}`, borderRadius: 'var(--rf)', padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 32 }}>
                  {tc('page_mybusiness.pulseWhatToDo')}
                </button>
              )}
              {!health && !loading && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => router.push('/sources')} style={{ fontSize: 16, fontWeight: 600, color: 'var(--acc)', background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 'var(--rf)', padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 32 }}>
                    {tc('page_mybusiness.pulseConnectShopify')}
                  </button>
                  <button onClick={() => router.push('/ask')} style={{ fontSize: 16, color: 'var(--tx2)', background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 'var(--rf)', padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 32 }}>
                    {tc('page_mybusiness.pulseUploadFile')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Insights feed ──────────────────────────────── */}
          {insights.length > 0 && (
            <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'16px 18px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:600, marginBottom:2 }}>{tc('page_mybusiness.insightsTitle')}</div>
                  <div style={{ fontSize:15, color:'var(--tx3)' }}>{tc('page_mybusiness.insightsWatching')}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:15, color:'#22c55e', fontWeight:500 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2s infinite' }}/>
                  {tc('page_mybusiness.insightsLive')}
                </div>
              </div>
              {insights.map(ins => (
                <div key={ins.id} onClick={() => handleInsightAction(ins.action)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 13px', borderRadius:12, border:`1px solid ${URGENCY_BORDER[ins.urgency]}`, background:URGENCY_BG[ins.urgency], marginBottom:7, cursor:'pointer', transition:'transform 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}>
                  <div style={{ fontSize:20, flexShrink:0 }}>{ins.type==='alert'?'⚠️':ins.type==='win'?'🎯':ins.type==='trend'?'📈':'💡'}</div>
                  <div style={{ flex:1, fontSize:17, color:'var(--tx)', lineHeight:1.5 }}>{ins.message}</div>
                  <div style={{ fontSize:15, color:URGENCY_COLOR[ins.urgency], fontWeight:500, flexShrink:0, whiteSpace:'nowrap' }}>{ins.action} →</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Three key metrics ──────────────────────────── */}
          <div className="mbc-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 9, marginBottom: 12 }}>
            {[
              { label: tc('page_mybusiness.metricRevenue30d'),  value: loading ? '–' : fmt(18400, sym), sub: tc('page_mybusiness.metricRevSub'),      warn: false },
              { label: tc('page_mybusiness.metricAvgMargin'),   value: loading ? '–' : '34%',           sub: tc('page_mybusiness.metricMarginSub'),   warn: true },
              { label: tc('page_mybusiness.metricShipping30d'), value: loading ? '–' : fmt(2410, sym),  sub: tc('page_mybusiness.metricShippingSub'), warn: true },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '13px 15px', boxShadow: 'var(--sh)' }}>
                <div style={{ fontSize: 15, color: 'var(--tx3)', marginBottom: 6, fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.02em', fontFamily: 'var(--font-sora)', marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 15, color: m.warn ? '#d97706' : '#16a34a', fontWeight: 500 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Trend charts ───────────────────────────────── */}
          <div className="mbc-trends" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 12 }}>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '14px 15px', boxShadow: 'var(--sh)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx)' }}>{tc('page_mybusiness.chartRevenue')}</div>
                <span style={{ fontSize: 14, padding: '2px 7px', borderRadius: 'var(--rf)', background: 'rgba(34,197,94,.1)', color: '#16a34a', fontWeight: 600 }}>{tc('page_mybusiness.chartRevBadge')}</span>
              </div>
              <Bars data={revTrend} accent="#16a34a"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 14, color: 'var(--tx3)' }}>
                <span>{tc('page_mybusiness.chartSixMonthsAgo')}</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>{tc('page_mybusiness.chartThisMonth')}</span>
              </div>
            </div>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '14px 15px', boxShadow: 'var(--sh)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx)' }}>{tc('page_mybusiness.chartShipping')}</div>
                <span style={{ fontSize: 14, padding: '2px 7px', borderRadius: 'var(--rf)', background: 'rgba(245,158,11,.1)', color: '#d97706', fontWeight: 600 }}>{tc('page_mybusiness.chartShippingBadge')}</span>
              </div>
              <Bars data={shipTrend} accent="var(--acc)"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 14, color: 'var(--tx3)' }}>
                <span>{tc('page_mybusiness.chartSixMonthsAgo')}</span>
                <span style={{ color: 'var(--acc)', fontWeight: 600 }}>{tc('page_mybusiness.chartThisMonth')}</span>
              </div>
            </div>
          </div>

          {/* ── Revenue by product (chart) ─────────────────── */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'16px 18px', marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:600, marginBottom:2 }}>{tc('page_mybusiness.revByProductTitle')}</div>
                <div style={{ fontSize:15, color:'var(--tx3)' }}>{tc('page_mybusiness.revByProductSub')}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:15, color:'var(--tx3)' }}><span style={{ width:10, height:10, borderRadius:3, background:'rgba(208,138,89,.75)', display:'inline-block' }}/> {tc('page_mybusiness.revByProductTop3')}</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:15, color:'var(--tx3)' }}><span style={{ width:10, height:10, borderRadius:3, background:'rgba(140,111,224,.65)', display:'inline-block' }}/> {tc('page_mybusiness.revByProductOthers')}</div>
              </div>
            </div>
            <div style={{ position:'relative', height:180 }}>
              {uploads.length === 0
                ? <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
                    <div style={{ fontSize:32 }}>📊</div>
                    <div style={{ fontSize:17, color:'var(--tx3)', textAlign:'center' }}>{tc('page_mybusiness.revByProductUploadCta')}</div>
                    <button onClick={() => router.push('/files')} style={{ padding:'6px 14px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--acc)', fontFamily:'inherit', fontSize:16, cursor:'pointer' }}>{tc('page_mybusiness.uploadCsvBtn')}</button>
                  </div>
                : <canvas ref={chartRef}/>
              }
            </div>
          </div>

          {/* ── Margin health (donut) ──────────────────────── */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'16px 18px', marginBottom:12 }}>
            <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:600, marginBottom:2 }}>{tc('page_mybusiness.marginHealthTitle')}</div>
            <div style={{ fontSize:15, color:'var(--tx3)', marginBottom:12 }}>{tc('page_mybusiness.marginHealthSub')}</div>
            <div style={{ position:'relative', height:160 }}>
              {uploads.length === 0
                ? <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                    <div style={{ fontSize:28 }}>🍩</div>
                    <div style={{ fontSize:16, color:'var(--tx3)', textAlign:'center' }}>{tc('page_mybusiness.marginHealthUploadCta')}</div>
                  </div>
                : <canvas ref={chart2Ref}/>
              }
            </div>
          </div>

          {/* ── Shipping insight ────────────────────────────── */}
          <div style={{
            background: 'rgba(208,138,89,.06)',
            border: '1px solid rgba(208,138,89,.3)',
            borderRadius: 'var(--r-lg)',
            padding: '14px 16px',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--acc)', marginTop: 5, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>
                  {tc('page_mybusiness.shippingInsightTitle')}
                </div>
                <div style={{ fontSize: 16, color: 'var(--tx2)', lineHeight: 1.6 }}>
                  {tc('page_mybusiness.shippingInsightBody', { spent: fmt(2410, sym), prev: fmt(2042, sym), perParcel: sym + '4.20', low: sym + '2.90', high: sym + '3.40' })}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => { setShowQuote(v => !v); setQuotes([]); setBookedUrl('') }}
                style={{ fontSize: 16, fontWeight: 600, background: 'var(--acc)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '8px 15px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 36, boxShadow: '0 2px 8px rgba(208,138,89,.3)', transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {showQuote ? tc('page_mybusiness.btnCloseQuotes') : tc('page_mybusiness.btnCompareRates')}
              </button>
              <button
                onClick={() => ask('Break down my shipping costs by route and carrier for the last 30 days')}
                style={{ fontSize: 16, color: 'var(--tx2)', background: 'transparent', border: '1px solid var(--b2)', borderRadius: 'var(--r-md)', padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 36 }}>
                {tc('page_mybusiness.btnAnalyseRoute')}
              </button>
            </div>
          </div>

          <RetentionCard symbol={sym} />

          {/* ── Quote panel ─────────────────────────────────── */}
          {showQuote && (
            <div style={{
              background: 'var(--sf)',
              border: '1px solid var(--b2)',
              borderRadius: 'var(--r-xl)',
              padding: '18px',
              marginBottom: 12,
              boxShadow: 'var(--shl)',
              animation: 'scaleIn 200ms var(--ease)',
            }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>
                {tc('page_mybusiness.quotePanelTitle')}
              </div>
              <div style={{ fontSize: 16, color: 'var(--tx3)', marginBottom: 14 }}>
                {tc('page_mybusiness.quotePanelSub')}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input
                  value={nlInput}
                  onChange={e => setNlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNlParse()}
                  placeholder={tc('page_mybusiness.quoteNlPlaceholder')}
                  style={{ flex: 1, padding: '10px 13px', fontSize: 17, background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 'var(--r-md)', color: 'var(--tx)', outline: 'none', fontFamily: 'inherit' }}
                />
                <button
                  onClick={handleNlParse}
                  disabled={nlParsing || !nlInput.trim()}
                  style={{ padding: '10px 16px', fontSize: 17, fontWeight: 600, background: 'var(--tx)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--r-md)', cursor: nlParsing ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: nlParsing ? .6 : 1, whiteSpace: 'nowrap', minHeight: 44 }}>
                  {nlParsing ? tc('page_mybusiness.quoteReading') : tc('page_mybusiness.btnGetQuotes')}
                </button>
              </div>

              <div className="mbc-qform" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 9, marginBottom: 9 }}>
                {[
                  { label: tc('page_mybusiness.formFrom'),   key: 'origin',     ph: 'GB' },
                  { label: tc('page_mybusiness.formTo'),     key: 'destination', ph: 'US' },
                  { label: tc('page_mybusiness.formWeight'), key: 'weight_kg', ph: '2.5' },
                  { label: tc('page_mybusiness.formValue'),  key: 'goods_value', ph: '50' },
                ].map(f => (
                  <div className="mbc-field" key={f.key}>
                    <label>{f.label}</label>
                    <input
                      value={quoteForm[f.key as keyof typeof quoteForm]}
                      onChange={e => setQuoteForm(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                    />
                  </div>
                ))}
              </div>
              <div className="mbc-qform" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 9, marginBottom: 13 }}>
                {[
                  { label: tc('page_mybusiness.formLength'), key: 'length_cm', ph: '30' },
                  { label: tc('page_mybusiness.formWidth'),  key: 'width_cm',  ph: '20' },
                  { label: tc('page_mybusiness.formHeight'), key: 'height_cm', ph: '15' },
                ].map(f => (
                  <div className="mbc-field" key={f.key}>
                    <label>{f.label}</label>
                    <input
                      value={quoteForm[f.key as keyof typeof quoteForm]}
                      onChange={e => setQuoteForm(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => fetchQuotes()}
                disabled={quoteLoading}
                style={{ width: '100%', padding: '11px', fontSize: 17, fontWeight: 600, background: 'var(--acc)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', cursor: quoteLoading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: quoteLoading ? .7 : 1, minHeight: 44, boxShadow: '0 2px 8px rgba(208,138,89,.25)', transition: 'opacity 150ms' }}>
                {quoteLoading ? tc('page_mybusiness.quoteChecking') : tc('page_mybusiness.btnGetQuotes')}
              </button>

              {quoteError && (
                <div style={{ marginTop: 10, padding: '9px 12px', borderRadius: 'var(--r-md)', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', fontSize: 16, color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span>{quoteError}</span>
                  {quoteError.includes('Settings') && (
                    <button onClick={() => router.push('/settings')} style={{ fontSize: 16, color: 'var(--acc)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap', minHeight: 'unset' }}>
                      {tc('page_mybusiness.btnGoSettings')}
                    </button>
                  )}
                </div>
              )}

              {quotes.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 9 }}>
                    {tc('page_mybusiness.quoteServicesAvailable', { count: quotes.length })}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
                    {quotes.slice(0, 5).map((q, i) => (
                      <div
                        key={q.service}
                        className={`mbc-carrier${selectedService === q.service ? ' sel' : ''}`}
                        onClick={() => setSelectedService(q.service)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--tx)' }}>{q.carrier}</span>
                              {i === 0 && <span style={{ fontSize: 14, padding: '1px 6px', borderRadius: 'var(--rf)', background: 'rgba(34,197,94,.12)', color: '#16a34a', fontWeight: 700 }}>{tc('page_mybusiness.quoteCheapest')}</span>}
                              {q.customs_invoice_required && <span style={{ fontSize: 14, padding: '1px 6px', borderRadius: 'var(--rf)', background: 'rgba(208,138,89,.1)', color: 'var(--acc)', fontWeight: 500 }}>{tc('page_mybusiness.quoteCustomsDocs')}</span>}
                            </div>
                            <div style={{ fontSize: 15, color: 'var(--tx3)' }}>{q.service_name} · {q.service_description}</div>
                          </div>
                          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: i === 0 ? '#16a34a' : 'var(--tx)', flexShrink: 0 }}>
                            £{parseFloat(q.total_price_gross).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedService && !bookedUrl && (
                    <button
                      onClick={handleBook}
                      style={{ width: '100%', padding: '11px', fontSize: 17, fontWeight: 600, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontFamily: 'inherit', minHeight: 44, boxShadow: '0 2px 8px rgba(34,197,94,.25)', transition: 'opacity 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                      {tc('page_mybusiness.btnBook', { carrier: quotes.find(q => q.service === selectedService)?.carrier ?? '' })}
                    </button>
                  )}

                  {bookedUrl && (
                    <div style={{ padding: '14px 16px', borderRadius: 'var(--r-lg)', background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)' }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: '#16a34a', marginBottom: 9 }}>
                        {tc('page_mybusiness.shipmentBooked')}
                      </div>
                      <a href={bookedUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 18px', background: '#16a34a', color: '#fff', borderRadius: 'var(--r-md)', fontSize: 17, fontWeight: 600, textDecoration: 'none', minHeight: 44 }}>
                        {tc('page_mybusiness.btnPayPrint')}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Daily Brief ─────────────────────────────────── */}
          {brief && (
            <div style={{
              background: 'rgba(99,102,241,.04)',
              border: '1px solid rgba(99,102,241,.15)',
              borderRadius: 'var(--r-lg)',
              padding: '14px 16px',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                {tc('page_mybusiness.dailyBriefTitle')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 11 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>🟢</span>
                  <p style={{ fontSize: 17, color: 'var(--tx)', margin: 0, lineHeight: 1.55 }}>{brief.improved}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>🔴</span>
                  <p style={{ fontSize: 17, color: 'var(--tx)', margin: 0, lineHeight: 1.55 }}>{brief.worsened}</p>
                </div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#6366F1', margin: 0, flex: 1, lineHeight: 1.4 }}>
                  {tc('page_mybusiness.dailyBriefToday', { action: brief.action })}
                </p>
                <button
                  onClick={() => ask(brief.action)}
                  style={{ fontSize: 15, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 'var(--rf)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 32 }}>
                  {tc('page_mybusiness.btnAsk')}
                </button>
              </div>
            </div>
          )}

          {/* ── Quick actions ──────────────────────────────── */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'16px 18px', marginBottom:12 }}>
            <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:600, marginBottom:3 }}>{tc('page_mybusiness.quickActionsTitle')}</div>
            <div style={{ fontSize:15, color:'var(--tx3)', marginBottom:10 }}>{tc('page_mybusiness.quickActionsSub')}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {quickActions.map((a,i) => (
                <div key={i} onClick={() => router.push(a.href)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, border:`1px solid ${a.border}`, background:a.accent, cursor:'pointer', transition:'transform 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}>
                  <div style={{ fontSize:20, flexShrink:0 }}>{a.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:17, fontWeight:500 }}>{a.label}</div>
                    <div style={{ fontSize:15, color:'var(--tx3)' }}>{a.desc}</div>
                  </div>
                  <div style={{ color:'var(--tx3)', fontSize:16 }}>→</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Your files ─────────────────────────────────── */}
          <div style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:18, padding:'16px 18px', marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:600 }}>{tc('page_mybusiness.filesTitle')}</div>
              <button onClick={() => router.push('/files')} style={{ fontSize:15, color:'var(--acc)', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>{tc('page_mybusiness.filesManage')}</button>
            </div>
            {uploads.length === 0
              ? <label style={{ display:'block', padding:'14px', borderRadius:12, border:'2px dashed var(--b2)', textAlign:'center', cursor:'pointer', color:'var(--tx3)', fontSize:16 }}>
                  {tc('page_mybusiness.filesUploadLabel')}
                  <input type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }} onChange={() => router.push('/files')}/>
                </label>
              : uploads.slice(0,3).map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom: i < Math.min(uploads.length,3)-1 ? '1px solid var(--b)' : 'none' }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:'rgba(208,138,89,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>📄</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:16, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.filename}</div>
                    <div style={{ fontSize:14, color:'var(--tx3)' }}>{tc('page_mybusiness.filesRows', { count: f.row_count?.toLocaleString() })}</div>
                  </div>
                  <button onClick={() => router.push('/chat')} style={{ fontSize:14, padding:'3px 8px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--tx2)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }}>{tc('page_mybusiness.filesAsk')}</button>
                </div>
              ))
            }
          </div>

          {/* ── No data state ──────────────────────────────── */}
          {!health && !loading && uploads.length === 0 && (
            <div style={{ padding: '20px', borderRadius: 'var(--r-xl)', border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center', boxShadow: 'var(--sh)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>
                {tc('page_mybusiness.noDataTitle')}
              </div>
              <p style={{ fontSize: 17, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 16px' }}>
                {tc('page_mybusiness.noDataBody')}
              </p>
              <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => router.push('/sources')} style={{ padding: '10px 20px', borderRadius: 'var(--r-md)', border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 17, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44, boxShadow: '0 2px 8px rgba(208,138,89,.25)' }}>
                  {tc('page_mybusiness.noDataConnectBtn')}
                </button>
                <button onClick={() => router.push('/ask')} style={{ padding: '10px 18px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontSize: 17, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                  {tc('page_mybusiness.noDataUploadBtn')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
