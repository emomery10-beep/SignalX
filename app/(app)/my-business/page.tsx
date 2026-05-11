'use client'
import RetentionCard from '@/components/RetentionCard'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Colour map — uses your actual CSS vars ─────────────────────────────────────

const HEALTH = {
  green: { text: '#16a34a', border: 'rgba(34,197,94,.2)',  bg: 'rgba(34,197,94,.06)',  glow: 'rgba(34,197,94,.12)' },
  amber: { text: '#d97706', border: 'rgba(245,158,11,.2)', bg: 'rgba(245,158,11,.06)', glow: 'rgba(245,158,11,.12)' },
  red:   { text: '#dc2626', border: 'rgba(239,68,68,.2)',  bg: 'rgba(239,68,68,.06)',  glow: 'rgba(239,68,68,.12)' },
}

function fmt(n: number, sym = '£') {
  if (n >= 1000) return sym + (n / 1000).toFixed(1) + 'k'
  return sym + n.toFixed(0)
}

// ── Mini bar chart ─────────────────────────────────────────────────────────────

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

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MyBusinessPage() {
  const router = useRouter()
  const { user, settings } = useStore()
  const sym = settings?.symbol || '£'
  const plan = user?.plan || 'free'

  const [health, setHealth] = useState<HealthData | null>(null)
  const [brief, setBrief] = useState<BriefData | null>(null)
  const [history, setHistory] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)

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

  // Load data
  useEffect(() => {
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
  }, [])

  const ask = useCallback((prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }, [router])

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
      setQuoteError('Could not read that — try filling the form below')
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
        setQuoteError('Add your business address in Settings first')
      } else if (data.success) {
        setQuotes(data.quotes || [])
      } else {
        setQuoteError(data.error || 'No quotes returned')
      }
    } catch {
      setQuoteError('Could not fetch quotes — try again')
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
      setQuoteError('Booking failed — try again')
    }
  }

  const c = health ? (HEALTH[health.color] || HEALTH.amber) : HEALTH.amber
  const circ = 2 * Math.PI * 46
  const dash = circ - (score / 100) * circ

  // Trend data — real from history or placeholder shape
  const revTrend = history.length >= 4 ? history : [55, 60, 58, 65, 70, 78]
  const shipTrend = [18, 20, 19, 22, 24, 42] // spike on last bar

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

          {/* ── Header ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(18px,3vw,23px)', fontWeight: 600, color: 'var(--tx)', letterSpacing: '-.025em', marginBottom: 3 }}>
              My Business
            </h1>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>

          {/* ── Pulse hero ──────────────────────────────────────────── */}
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
            {/* Dial */}
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
                    <span style={{ fontSize: 24, fontWeight: 700, color: c.text, letterSpacing: '-.04em', lineHeight: 1, fontFamily: 'var(--font-sora)' }}>{score}</span>
                    <span style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 1 }}>/100</span>
                  </>
                )}
              </div>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 600, color: c.text }}>
                  {loading ? 'Calculating…' : health?.label || 'Business Pulse'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--tx3)' }}>health score</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--tx2)', margin: '0 0 12px', lineHeight: 1.6 }}>
                {loading
                  ? 'Fetching your latest data…'
                  : health?.summary || 'Connect your data to get a live Business Pulse score.'}
              </p>
              {health?.topIssue && (
                <button
                  onClick={() => ask(health.topIssue!)}
                  style={{ fontSize: 12, fontWeight: 600, color: c.text, background: 'transparent', border: `1px solid ${c.border}`, borderRadius: 'var(--rf)', padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 32 }}>
                  What should I do? →
                </button>
              )}
              {!health && !loading && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => router.push('/sources')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--acc)', background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 'var(--rf)', padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 32 }}>
                    Connect Shopify →
                  </button>
                  <button onClick={() => router.push('/ask')} style={{ fontSize: 12, color: 'var(--tx2)', background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 'var(--rf)', padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 32 }}>
                    Upload a file
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Three key metrics ────────────────────────────────────── */}
          <div className="mbc-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 9, marginBottom: 12 }}>
            {[
              { label: 'Revenue (30d)',  value: loading ? '–' : fmt(18400, sym), sub: '+12% vs last month', warn: false },
              { label: 'Avg margin',     value: loading ? '–' : '34%',           sub: '−2pts vs last month', warn: true },
              { label: 'Shipping (30d)', value: loading ? '–' : fmt(2410, sym),  sub: '+18% vs last month', warn: true },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '13px 15px', boxShadow: 'var(--sh)' }}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 6, fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.02em', fontFamily: 'var(--font-sora)', marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: m.warn ? '#d97706' : '#16a34a', fontWeight: 500 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Trend charts ─────────────────────────────────────────── */}
          <div className="mbc-trends" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 12 }}>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '14px 15px', boxShadow: 'var(--sh)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>Revenue</div>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 'var(--rf)', background: 'rgba(34,197,94,.1)', color: '#16a34a', fontWeight: 600 }}>+12%</span>
              </div>
              <Bars data={revTrend} accent="#16a34a"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: 'var(--tx3)' }}>
                <span>6 months ago</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>This month</span>
              </div>
            </div>

            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '14px 15px', boxShadow: 'var(--sh)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>Shipping costs</div>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 'var(--rf)', background: 'rgba(245,158,11,.1)', color: '#d97706', fontWeight: 600 }}>+18%</span>
              </div>
              <Bars data={shipTrend} accent="var(--acc)"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: 'var(--tx3)' }}>
                <span>6 months ago</span>
                <span style={{ color: 'var(--acc)', fontWeight: 600 }}>This month</span>
              </div>
            </div>
          </div>

          {/* ── Shipping insight ─────────────────────────────────────── */}
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
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>
                  Shipping costs up 18% — your margin is being squeezed
                </div>
                <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>
                  You spent {fmt(2410, sym)} on shipping this month vs {fmt(2042, sym)} last month.
                  You're paying ~{sym}4.20 per parcel on average. Live courier rates suggest you could
                  bring this down to {sym}2.90–{sym}3.40 by switching carrier on your top routes.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => { setShowQuote(v => !v); setQuotes([]); setBookedUrl('') }}
                style={{ fontSize: 12, fontWeight: 600, background: 'var(--acc)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '8px 15px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 36, boxShadow: '0 2px 8px rgba(208,138,89,.3)', transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {showQuote ? 'Close quotes' : 'Compare carrier rates now'}
              </button>
              <button
                onClick={() => ask('Break down my shipping costs by route and carrier for the last 30 days')}
                style={{ fontSize: 12, color: 'var(--tx2)', background: 'transparent', border: '1px solid var(--b2)', borderRadius: 'var(--r-md)', padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 36 }}>
                Analyse by route ↗
              </button>
            </div>
          </div>

          <RetentionCard symbol={sym} />

          {/* ── Quote panel ──────────────────────────────────────────── */}
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
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>
                Live carrier rates
              </div>
              <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 14 }}>
                Describe your parcel or fill in the details below
              </div>

              {/* NL bar */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input
                  value={nlInput}
                  onChange={e => setNlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNlParse()}
                  placeholder='"2kg box 30×20×15cm, London to Paris, value £50"'
                  style={{ flex: 1, padding: '10px 13px', fontSize: 13, background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 'var(--r-md)', color: 'var(--tx)', outline: 'none', fontFamily: 'inherit' }}
                />
                <button
                  onClick={handleNlParse}
                  disabled={nlParsing || !nlInput.trim()}
                  style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, background: 'var(--tx)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--r-md)', cursor: nlParsing ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: nlParsing ? .6 : 1, whiteSpace: 'nowrap', minHeight: 44 }}>
                  {nlParsing ? 'Reading…' : 'Get quotes'}
                </button>
              </div>

              {/* Form */}
              <div className="mbc-qform" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 9, marginBottom: 9 }}>
                {[
                  { label: 'From', key: 'origin',     ph: 'GB' },
                  { label: 'To',   key: 'destination', ph: 'US' },
                  { label: 'Weight (kg)', key: 'weight_kg', ph: '2.5' },
                  { label: 'Value (£)',   key: 'goods_value', ph: '50' },
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
                  { label: 'Length (cm)', key: 'length_cm', ph: '30' },
                  { label: 'Width (cm)',  key: 'width_cm',  ph: '20' },
                  { label: 'Height (cm)', key: 'height_cm', ph: '15' },
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
                style={{ width: '100%', padding: '11px', fontSize: 13, fontWeight: 600, background: 'var(--acc)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', cursor: quoteLoading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: quoteLoading ? .7 : 1, minHeight: 44, boxShadow: '0 2px 8px rgba(208,138,89,.25)', transition: 'opacity 150ms' }}>
                {quoteLoading ? 'Checking rates across carriers…' : 'Get quotes'}
              </button>

              {/* Error */}
              {quoteError && (
                <div style={{ marginTop: 10, padding: '9px 12px', borderRadius: 'var(--r-md)', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span>{quoteError}</span>
                  {quoteError.includes('Settings') && (
                    <button onClick={() => router.push('/settings')} style={{ fontSize: 12, color: 'var(--acc)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap', minHeight: 'unset' }}>
                      Go to Settings →
                    </button>
                  )}
                </div>
              )}

              {/* Results */}
              {quotes.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 9 }}>
                    {quotes.length} services available — cheapest first
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
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{q.carrier}</span>
                              {i === 0 && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--rf)', background: 'rgba(34,197,94,.12)', color: '#16a34a', fontWeight: 700 }}>Cheapest</span>}
                              {q.customs_invoice_required && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--rf)', background: 'rgba(208,138,89,.1)', color: 'var(--acc)', fontWeight: 500 }}>Customs docs</span>}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{q.service_name} · {q.service_description}</div>
                          </div>
                          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: i === 0 ? '#16a34a' : 'var(--tx)', flexShrink: 0 }}>
                            £{parseFloat(q.total_price_gross).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedService && !bookedUrl && (
                    <button
                      onClick={handleBook}
                      style={{ width: '100%', padding: '11px', fontSize: 13, fontWeight: 600, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', cursor: 'pointer', fontFamily: 'inherit', minHeight: 44, boxShadow: '0 2px 8px rgba(34,197,94,.25)', transition: 'opacity 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                      Book {quotes.find(q => q.service === selectedService)?.carrier} →
                    </button>
                  )}

                  {bookedUrl && (
                    <div style={{ padding: '14px 16px', borderRadius: 'var(--r-lg)', background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', marginBottom: 9 }}>
                        Shipment booked — pay to confirm
                      </div>
                      <a href={bookedUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 18px', background: '#16a34a', color: '#fff', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600, textDecoration: 'none', minHeight: 44 }}>
                        Pay and print label →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Daily Brief ──────────────────────────────────────────── */}
          {brief && (
            <div style={{
              background: 'rgba(99,102,241,.04)',
              border: '1px solid rgba(99,102,241,.15)',
              borderRadius: 'var(--r-lg)',
              padding: '14px 16px',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                Today's brief
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 11 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>🟢</span>
                  <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.55 }}>{brief.improved}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>🔴</span>
                  <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.55 }}>{brief.worsened}</p>
                </div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', margin: 0, flex: 1, lineHeight: 1.4 }}>
                  Today: {brief.action}
                </p>
                <button
                  onClick={() => ask(brief.action)}
                  style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 'var(--rf)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 32 }}>
                  Ask
                </button>
              </div>
            </div>
          )}

          {/* ── No data state ────────────────────────────────────────── */}
          {!health && !loading && (
            <div style={{ padding: '20px', borderRadius: 'var(--r-xl)', border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center', boxShadow: 'var(--sh)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>
                Connect your data to unlock My Business
              </div>
              <p style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 16px' }}>
                Link Shopify, Amazon or Stripe — or upload a CSV — and AskBiz will fill this page with your real numbers.
              </p>
              <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => router.push('/sources')} style={{ padding: '10px 20px', borderRadius: 'var(--r-md)', border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44, boxShadow: '0 2px 8px rgba(208,138,89,.25)' }}>
                  Connect data →
                </button>
                <button onClick={() => router.push('/ask')} style={{ padding: '10px 18px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                  Upload a file
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
