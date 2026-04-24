'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'

interface HealthData {
  score: number
  label: string
  color: 'green' | 'amber' | 'red'
  summary: string
  topIssue: string | null
}

interface Anomaly {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  body: string
  prompt?: string
}

interface Brief {
  improved: string
  worsened: string
  action: string
}

const BIZ_QUESTIONS: Record<string, string[]> = {
  retail:      ['Which product is making me the most money right now?', 'Do I have anything about to run out of stock?', 'Where am I losing money without knowing it?'],
  ecommerce:   ['What are my best selling products this month?', 'Which products have the worst margins?', 'Am I priced correctly vs my competitors?'],
  distributor: ['Which customers are most profitable?', 'Where is demand growing fastest?', 'What is my average margin by product line?'],
  exporter:    ['How is currency affecting my margins right now?', 'What is my true landed cost per shipment?', 'Which market should I focus on next?'],
  default:     ['What should I focus on in my business today?', 'Which products are making me the most money?', 'Where am I losing money right now?'],
}

const COLOR_CONFIG = {
  green: { text: '#16a34a', bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.2)', glow: 'rgba(34,197,94,.15)' },
  amber: { text: '#d97706', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.2)', glow: 'rgba(245,158,11,.12)' },
  red:   { text: '#dc2626', bg: 'rgba(239,68,68,.08)', border: 'rgba(239,68,68,.2)', glow: 'rgba(239,68,68,.15)' },
}

export default function HomePage() {
  const router = useRouter()
  const { user, settings } = useStore()
  const [health, setHealth] = useState<HealthData | null>(null)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [greeting, setGreeting] = useState('')

  const questions = BIZ_QUESTIONS[settings.bizType] || BIZ_QUESTIONS.default

  useEffect(() => {
    const hour = new Date().getHours()
    const name = user.name?.split(' ')[0] || 'there'
    if (hour < 12) setGreeting('Good morning, ' + name)
    else if (hour < 17) setGreeting('Good afternoon, ' + name)
    else setGreeting('Good evening, ' + name)
  }, [user.name])

  useEffect(() => {
    if (!health) return
    const target = health.score
    const start = Date.now()
    const duration = 1400
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setScore(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [health])

  useEffect(() => {
    const load = async () => {
      try {
        const [healthRes, briefRes] = await Promise.allSettled([
          fetch('/api/health'),
          fetch('/api/daily-brief'),
        ])
        if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
          const data = await healthRes.value.json()
          if (data.latest) setHealth(data.latest)
          setAnomalies((data.anomalies || []).slice(0, 2))
        }
        if (briefRes.status === 'fulfilled' && briefRes.value.ok) {
          const data = await briefRes.value.json()
          if (data.brief) setBrief(data.brief)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) ask(input.trim())
  }

  const c = health ? COLOR_CONFIG[health.color] : COLOR_CONFIG.amber
  const circ = 2 * Math.PI * 52
  const dashOffset = circ - (score / 100) * circ

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(20px,4vw,36px) clamp(16px,4vw,20px) 120px' }}>

        <div className="animate-fade-down" style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, letterSpacing: '-.025em', color: 'var(--tx)', marginBottom: 4 }}>
            {greeting}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--tx3)', margin: 0 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="animate-fade-up" style={{ borderRadius: 20, border: '1px solid ' + c.border, background: c.bg, padding: '20px 24px', marginBottom: 16, boxShadow: '0 4px 24px ' + c.glow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--ev)" strokeWidth="10"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke={c.text} strokeWidth="10"
                  strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.08s linear', filter: 'drop-shadow(0 0 8px ' + c.glow + ')' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                  <div style={{ width: 28, height: 28, border: '3px solid ' + c.border, borderTopColor: c.text, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                ) : (
                  <>
                    <span style={{ fontSize: 30, fontWeight: 800, color: c.text, letterSpacing: '-.04em', lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>/100</span>
                  </>
                )}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: c.text }}>
                  {health ? health.label : 'Business Pulse'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--tx3)' }}>Your business health</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--tx2)', margin: '0 0 12px', lineHeight: 1.55 }}>
                {loading ? 'Calculating your business health...' : health ? health.summary : 'Upload your data to get your personalised business health score.'}
              </p>
              {health && health.topIssue ? (
                <button onClick={() => ask(health.topIssue!)}
                  style={{ fontSize: 12, fontWeight: 600, color: c.text, background: 'transparent', border: '1px solid ' + c.border, borderRadius: 9999, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  What should I do about this? →
                </button>
              ) : !health && !loading ? (
                <button onClick={() => router.push('/data')}
                  style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 9999, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Upload your data to get started →
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {brief && (
          <div className="animate-fade-up stagger-1" style={{ borderRadius: 16, border: '1px solid rgba(99,102,241,.15)', background: 'rgba(99,102,241,.04)', padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Today&#39;s brief</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>🟢</span>
                <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.improved}</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>🔴</span>
                <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.worsened}</p>
              </div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', margin: 0, flex: 1 }}>Today: {brief.action}</p>
              <button onClick={() => ask(brief.action)}
                style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 9999, padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Ask
              </button>
            </div>
          </div>
        )}

        {anomalies.length > 0 && (
          <div className="animate-fade-up stagger-2" style={{ marginBottom: 16 }}>
            {anomalies.map((a, i) => {
              const sc = a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#6366F1'
              const sb = a.severity === 'critical' ? 'rgba(239,68,68,.07)' : a.severity === 'warning' ? 'rgba(245,158,11,.07)' : 'rgba(99,102,241,.06)'
              const sbo = a.severity === 'critical' ? 'rgba(239,68,68,.2)' : a.severity === 'warning' ? 'rgba(245,158,11,.2)' : 'rgba(99,102,241,.15)'
              return (
                <div key={a.id || i} style={{ padding: '12px 16px', borderRadius: 14, border: '1px solid ' + sbo, background: sb, marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc, flexShrink: 0, marginTop: 4 }}></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{a.body}</div>
                  </div>
                  {a.prompt && (
                    <button onClick={() => ask(a.prompt!)}
                      style={{ fontSize: 11, color: sc, background: 'transparent', border: '1px solid ' + sbo, borderRadius: 9999, padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      Ask →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="animate-fade-up stagger-3" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>Ask your business</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map((q, i) => (
              <button key={i} onClick={() => ask(q)} className="card-hover"
                style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{i === 0 ? '💰' : i === 1 ? '📦' : '📉'}</span>
                <span style={{ fontSize: 14, color: 'var(--tx)', fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-up stagger-4" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'linear-gradient(to top, var(--bg) 70%, transparent)', zIndex: 40 }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 16px', borderRadius: 16, border: '1px solid var(--b2)', background: 'var(--sf)', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about your business..."
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: 'var(--tx)', outline: 'none', fontFamily: 'inherit', padding: 0, minWidth: 0 }}/>
                {input.trim() && (
                  <button type="submit"
                    style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#6366F1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
