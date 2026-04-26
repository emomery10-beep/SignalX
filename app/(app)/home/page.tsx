'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'

const BIZ_QUESTIONS = {
  retail:      ['Which product is making me the most money right now?', 'Do I have anything about to run out of stock?', 'Where am I losing money without knowing it?'],
  ecommerce:   ['What are my best selling products this month?', 'Which products have the worst margins?', 'Am I priced correctly vs my competitors?'],
  distributor: ['Which customers are most profitable?', 'Where is demand growing fastest?', 'What is my average margin by product line?'],
  exporter:    ['How is currency affecting my margins right now?', 'What is my true landed cost per shipment?', 'Which market should I focus on next?'],
  default:     ['What should I focus on in my business today?', 'Which products are making me the most money?', 'Where am I losing money right now?'],
}

const PLAN_PRICES = {
  developed: { free: 'Free', growth: '£19/mo', business: '£49/mo' },
  emerging:  { free: 'Free', growth: '$19/mo', business: '$49/mo' },
  africa:    { free: 'Free', growth: '$12/mo', business: '$29/mo' },
}

const COLOR = {
  green: { text: '#16a34a', bg: 'rgba(34,197,94,.08)',  border: 'rgba(34,197,94,.2)',  glow: 'rgba(34,197,94,.15)' },
  amber: { text: '#d97706', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.2)', glow: 'rgba(245,158,11,.12)' },
  red:   { text: '#dc2626', bg: 'rgba(239,68,68,.08)',  border: 'rgba(239,68,68,.2)',  glow: 'rgba(239,68,68,.15)' },
}

export default function HomePage() {
  const router = useRouter()
  const { user, settings } = useStore()
  const [health, setHealth]   = useState(null)
  const [anomalies, setAnomalies] = useState([])
  const [brief, setBrief]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput]     = useState('')
  const [score, setScore]     = useState(0)
  const [greeting, setGreeting] = useState('')
  const [geo, setGeo]         = useState(null)

  const plan = user?.plan || 'free'
  const questions = BIZ_QUESTIONS[settings?.bizType] || BIZ_QUESTIONS.default
  const prices = geo ? (PLAN_PRICES[geo.pricingTier] || PLAN_PRICES.developed) : PLAN_PRICES.developed

  useEffect(() => {
    const h = new Date().getHours()
    const name = user?.name?.split(' ')[0] || 'there'
    setGreeting(h < 12 ? 'Good morning, ' + name : h < 17 ? 'Good afternoon, ' + name : 'Good evening, ' + name)
  }, [user])

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

  useEffect(() => {
    const load = async () => {
      try {
        const [hr, br, gr] = await Promise.allSettled([
          fetch('/api/health'),
          fetch('/api/daily-brief'),
          fetch('/api/geo'),
        ])
        if (hr.status === 'fulfilled' && hr.value.ok) {
          const d = await hr.value.json()
          if (d.latest) setHealth(d.latest)
          setAnomalies((d.anomalies || []).slice(0, 2))
        }
        if (br.status === 'fulfilled' && br.value.ok) {
          const d = await br.value.json()
          if (d.brief) setBrief(d.brief)
        }
        if (gr.status === 'fulfilled' && gr.value.ok) setGeo(await gr.value.json())
      } finally { setLoading(false) }
    }
    load()
    const onUpdate = e => { if (e.detail) setHealth(e.detail) }
    window.addEventListener('askbiz:health_updated', onUpdate)
    return () => window.removeEventListener('askbiz:health_updated', onUpdate)
  }, [])

  const ask = useCallback(prompt => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }, [router])

  const c = health ? (COLOR[health.color] || COLOR.amber) : COLOR.amber
  const circ = 2 * Math.PI * 52
  const dashOffset = circ - (score / 100) * circ

  return (
    <>
      {/* Responsive styles scoped to this page */}
      <style>{`
        .home-wrap {
          min-height: 100vh;
          background: var(--bg);
          overflow-x: hidden;
          /* Account for sticky search bar at bottom */
          padding-bottom: 100px;
        }
        .home-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: clamp(16px, 4vw, 28px) clamp(14px, 4vw, 24px);
          width: 100%;
          box-sizing: border-box;
        }
        .home-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: nowrap;
        }
        .home-pulse-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .home-pulse-dial {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }
        .home-questions {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .home-q-btn {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--b);
          background: var(--sf);
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          transition: background 150ms, transform 100ms;
        }
        .home-q-btn:hover { background: var(--ev); }
        .home-q-btn:active { transform: scale(0.99); }
        .home-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .home-quick-btn {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--b);
          background: var(--sf);
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: background 150ms;
        }
        .home-quick-btn:hover { background: var(--ev); }
        .home-search-bar {
          position: fixed;
          bottom: 0;
          /* On desktop, offset by sidebar width */
          left: 240px;
          right: 0;
          padding: 10px 16px 24px;
          background: linear-gradient(to top, var(--bg) 65%, transparent);
          z-index: 40;
        }
        .home-search-inner {
          max-width: 680px;
          margin: 0 auto;
        }
        .home-search-input {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid var(--b2);
          background: var(--sf);
          box-shadow: 0 4px 20px rgba(0,0,0,.08);
        }

        /* ── Mobile — sidebar hidden, use full width ── */
        @media (max-width: 768px) {
          .home-search-bar {
            left: 0 !important;
            padding-bottom: max(80px, calc(60px + env(safe-area-inset-bottom)));
          }
          .home-pulse-dial {
            width: 80px;
            height: 80px;
          }
          .home-quick-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .home-header {
            flex-wrap: wrap;
          }
        }

        /* ── Very small screens ── */
        @media (max-width: 380px) {
          .home-pulse-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .home-quick-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Large desktop — wider content ── */
        @media (min-width: 1280px) {
          .home-inner {
            max-width: 760px;
          }
        }
      `}</style>

      <div className="home-wrap">

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'AskBiz',
          description: 'AI-powered business intelligence for SME founders.',
          url: 'https://askbiz.co',
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        })}}/>

        <div className="home-inner">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="home-header animate-fade-down">
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(17px,3.5vw,24px)', fontWeight: 700, letterSpacing: '-.025em', color: 'var(--tx)', marginBottom: 3, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {greeting}
              </h1>
              <p style={{ fontSize: 12, color: 'var(--tx3)', margin: 0 }}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                {geo?.city ? ' · ' + geo.city : ''}
              </p>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: plan === 'free' ? '#d97706' : '#16a34a', background: plan === 'free' ? 'rgba(245,158,11,.1)' : 'rgba(34,197,94,.1)', border: plan === 'free' ? '1px solid rgba(245,158,11,.25)' : '1px solid rgba(34,197,94,.25)', borderRadius: 9999, padding: '3px 10px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                {plan} plan
              </span>
              {geo && (
                <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{geo.flag} {geo.currencySymbol} {geo.currency}</span>
              )}
            </div>
          </div>

          {/* ── Upgrade nudge ──────────────────────────────────────────── */}
          {plan === 'free' && health && (
            <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(245,158,11,.07)', border: '1px solid rgba(245,158,11,.2)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <p style={{ fontSize: 12, color: 'var(--tx2)', margin: 0, flex: 1, minWidth: 160 }}>
                Unlock Daily Brief, alerts & unlimited questions from <strong>{prices.growth}</strong>
              </p>
              <button onClick={() => router.push('/billing')}
                style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#d97706', border: 'none', borderRadius: 9999, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Upgrade →
              </button>
            </div>
          )}

          {/* ── Business Pulse card ────────────────────────────────────── */}
          <div style={{ borderRadius: 20, border: '1px solid ' + c.border, background: c.bg, padding: 'clamp(14px,3vw,20px)', marginBottom: 14, boxShadow: '0 4px 24px ' + c.glow }}>
            <div className="home-pulse-card">

              {/* Dial */}
              <div className="home-pulse-dial">
                <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--ev)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="52" fill="none" stroke={c.text} strokeWidth="10"
                    strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.08s linear', filter: 'drop-shadow(0 0 8px ' + c.glow + ')' }}/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {loading ? (
                    <div style={{ width: 22, height: 22, border: '3px solid ' + c.border, borderTopColor: c.text, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  ) : (
                    <>
                      <span style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: c.text, letterSpacing: '-.04em', lineHeight: 1 }}>{score}</span>
                      <span style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 1 }}>/100</span>
                    </>
                  )}
                </div>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, color: c.text }}>
                    {health ? health.label : 'Business Pulse'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--tx3)' }}>Your health score</span>
                </div>
                <p style={{ fontSize: 'clamp(12px,2vw,13px)', color: 'var(--tx2)', margin: '0 0 10px', lineHeight: 1.55 }}>
                  {loading ? 'Calculating...' : health ? health.summary : 'Upload a file or connect your shop to get your Business Pulse score.'}
                </p>
                {health?.topIssue ? (
                  <button onClick={() => ask(health.topIssue)}
                    style={{ fontSize: 11, fontWeight: 600, color: c.text, background: 'transparent', border: '1px solid ' + c.border, borderRadius: 9999, padding: '4px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    What should I do? →
                  </button>
                ) : !health && !loading ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => router.push('/ask')}
                      style={{ fontSize: 11, fontWeight: 600, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 9999, padding: '4px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Upload a file →
                    </button>
                    <button onClick={() => router.push('/sources')}
                      style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 9999, padding: '4px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Connect Shopify / Amazon
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── Daily Brief ────────────────────────────────────────────── */}
          {brief && (
            <div style={{ borderRadius: 14, border: '1px solid rgba(99,102,241,.15)', background: 'rgba(99,102,241,.04)', padding: 'clamp(12px,3vw,16px)', marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Today&#39;s brief</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>🟢</span>
                  <p style={{ fontSize: 12, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.improved}</p>
                </div>
                <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>🔴</span>
                  <p style={{ fontSize: 12, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.worsened}</p>
                </div>
              </div>
              <div style={{ padding: '9px 11px', borderRadius: 9, background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', margin: 0, flex: 1, minWidth: 120 }}>Today: {brief.action}</p>
                <button onClick={() => ask(brief.action)}
                  style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 9999, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Ask
                </button>
              </div>
            </div>
          )}

          {/* ── Anomalies ──────────────────────────────────────────────── */}
          {anomalies.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              {anomalies.map((a, i) => {
                const col = a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#6366F1'
                const bg  = a.severity === 'critical' ? 'rgba(239,68,68,.06)' : a.severity === 'warning' ? 'rgba(245,158,11,.06)' : 'rgba(99,102,241,.05)'
                const bdr = a.severity === 'critical' ? 'rgba(239,68,68,.18)' : a.severity === 'warning' ? 'rgba(245,158,11,.18)' : 'rgba(99,102,241,.15)'
                return (
                  <div key={a.id || i} style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid ' + bdr, background: bg, marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: col, flexShrink: 0, marginTop: 4 }}></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 1 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{a.body}</div>
                    </div>
                    {a.prompt && (
                      <button onClick={() => ask(a.prompt)}
                        style={{ fontSize: 10, color: col, background: 'transparent', border: '1px solid ' + bdr, borderRadius: 9999, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        Ask →
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Geo card when no data ──────────────────────────────────── */}
          {!health && !loading && geo && (
            <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                {geo.flag} {geo.country} · {geo.currencyName}
              </div>
              <p style={{ fontSize: 12, color: 'var(--tx2)', margin: 0, lineHeight: 1.6 }}>
                AskBiz shows your numbers in <strong>{geo.currencySymbol} {geo.currency}</strong>. Connect your data to get your Business Pulse score.
              </p>
            </div>
          )}

          {/* ── One-tap questions ──────────────────────────────────────── */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Ask your business</div>
            <div className="home-questions">
              {questions.map((q, i) => (
                <button key={i} onClick={() => ask(q)} className="home-q-btn">
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{i === 0 ? '💰' : i === 1 ? '📦' : '📉'}</span>
                  <span style={{ fontSize: 'clamp(12px,2vw,13px)', color: 'var(--tx)', fontWeight: 500, lineHeight: 1.4, flex: 1, textAlign: 'left' }}>{q}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* ── Quick links ────────────────────────────────────────────── */}
          <div className="home-quick-grid">
            {[
              { icon: '📊', label: 'Monitor',       sub: 'Health & alerts',   href: '/intelligence' },
              { icon: '🔗', label: 'Connect data',  sub: 'Shopify, Amazon...',href: '/sources' },
              { icon: '📝', label: 'Log decision',  sub: 'Review in 6 weeks', href: '/intelligence' },
              { icon: '👥', label: 'Your team',     sub: 'Invite accountant', href: '/intelligence' },
            ].map((item, i) => (
              <button key={i} onClick={() => router.push(item.href)} className="home-quick-btn">
                <div style={{ fontSize: 'clamp(16px,2.5vw,20px)', marginBottom: 5 }}>{item.icon}</div>
                <div style={{ fontSize: 'clamp(11px,1.8vw,13px)', fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 'clamp(10px,1.5vw,11px)', color: 'var(--tx3)' }}>{item.sub}</div>
              </button>
            ))}
          </div>

          {/* ── Upgrade CTA ────────────────────────────────────────────── */}
          {plan === 'free' && (
            <div style={{ padding: 'clamp(14px,3vw,18px)', borderRadius: 14, background: 'linear-gradient(135deg, rgba(99,102,241,.07), rgba(139,92,246,.05))', border: '1px solid rgba(99,102,241,.18)', marginBottom: 8 }}>
              <div style={{ fontSize: 'clamp(12px,2vw,13px)', fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>
                Unlock everything from {prices.growth}
              </div>
              <p style={{ fontSize: 12, color: 'var(--tx3)', margin: '0 0 12px', lineHeight: 1.6 }}>
                Daily Brief, unlimited questions, anomaly alerts, and more. Cancel any time.
              </p>
              <button onClick={() => router.push('/billing')}
                style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                See plans →
              </button>
            </div>
          )}

        </div>

        {/* ── Sticky search bar ──────────────────────────────────────────── */}
        <div className="home-search-bar">
          <div className="home-search-inner">
            <form onSubmit={e => { e.preventDefault(); if (input.trim()) ask(input.trim()) }}>
              <div className="home-search-input">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about your business..."
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: 'var(--tx)', outline: 'none', fontFamily: 'inherit', padding: 0, minWidth: 0 }}/>
                {input.trim() && (
                  <button type="submit"
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#6366F1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}
