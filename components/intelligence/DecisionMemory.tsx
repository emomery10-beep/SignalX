'use client'
import { useEffect, useState } from 'react'

interface Decision {
  id: string
  title: string
  description?: string
  decision_type: string
  product?: string
  before_value?: string
  after_value?: string
  review_at: string
  reviewed: boolean
  review_result?: string
  review_verdict?: 'good_call' | 'bad_call' | 'neutral'
  created_at: string
}

interface Props {
  onAsk?: (prompt: string) => void
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  pricing:   { bg: 'rgba(99,102,241,.08)',  color: '#6366F1' },
  stock:     { bg: 'rgba(34,197,94,.08)',   color: '#16a34a' },
  supplier:  { bg: 'rgba(245,158,11,.08)', color: '#d97706' },
  product:   { bg: 'rgba(236,72,153,.08)', color: '#db2777' },
  strategy:  { bg: 'rgba(139,92,246,.08)', color: '#7c3aed' },
}

const VERDICT_STYLE = {
  good_call: { label: '✓ Good call', color: '#16a34a', bg: 'rgba(34,197,94,.1)' },
  bad_call:  { label: '✗ Didn\'t work', color: '#dc2626', bg: 'rgba(239,68,68,.1)' },
  neutral:   { label: '~ Mixed results', color: '#d97706', bg: 'rgba(245,158,11,.1)' },
}

export default function DecisionMemory({ onAsk }: Props) {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [showLog, setShowLog] = useState(false)
  const [logging, setLogging] = useState(false)
  const [form, setForm] = useState({ title: '', decision_type: 'pricing', product: '', before_value: '', after_value: '' })

  useEffect(() => {
    fetch('/api/decisions')
      .then(r => r.json())
      .then(d => setDecisions(d.decisions || []))
      .finally(() => setLoading(false))
  }, [])

  const logDecision = async () => {
    if (!form.title) return
    setLogging(true)
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.decision) {
        setDecisions(d => [data.decision, ...d])
        setForm({ title: '', decision_type: 'pricing', product: '', before_value: '', after_value: '' })
        setShowLog(false)
      }
    } finally {
      setLogging(false)
    }
  }

  const dueForReview = decisions.filter(d => !d.reviewed && new Date(d.review_at) <= new Date())

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Decision Memory</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>AskBiz remembers every decision and checks back in 6 weeks</div>
        </div>
        <button
          onClick={() => setShowLog(!showLog)}
          style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 9999, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          + Log Decision
        </button>
      </div>

      {/* Log form */}
      {showLog && (
        <div className="animate-scale-in" style={{ padding: '14px', borderRadius: 12, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.03)', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', marginBottom: 10 }}>Log a decision</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              placeholder="What did you decide? e.g. Raised price on Wireless Earbuds by £1.50"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <select value={form.decision_type} onChange={e => setForm(f => ({ ...f, decision_type: e.target.value }))}
                style={{ padding: '7px 8px', borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 12, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}>
                {['pricing', 'stock', 'supplier', 'product', 'strategy'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              <input placeholder="Before (e.g. £12.99)" value={form.before_value} onChange={e => setForm(f => ({ ...f, before_value: e.target.value }))}
                style={{ padding: '7px 8px', borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 12, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}/>
              <input placeholder="After (e.g. £14.49)" value={form.after_value} onChange={e => setForm(f => ({ ...f, after_value: e.target.value }))}
                style={{ padding: '7px 8px', borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 12, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}/>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={logDecision} disabled={!form.title || logging}
                style={{ flex: 1, padding: '8px', borderRadius: 9, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {logging ? 'Saving…' : 'Save Decision — AskBiz will check back in 6 weeks'}
              </button>
              <button onClick={() => setShowLog(false)}
                style={{ padding: '8px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Due for review */}
      {dueForReview.length > 0 && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', marginBottom: 6 }}>
            🔔 {dueForReview.length} decision{dueForReview.length > 1 ? 's' : ''} ready for review
          </div>
          {dueForReview.map(d => (
            <div key={d.id} style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 4 }}>
              "{d.title}" — logged {new Date(d.created_at).toLocaleDateString('en-GB')}
            </div>
          ))}
          {onAsk && (
            <button onClick={() => onAsk(`Review my recent business decisions and tell me what the outcomes suggest — what worked and what should I learn from?`)}
              style={{ marginTop: 6, fontSize: 11, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 9999, padding: '3px 9px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Ask AskBiz to review outcomes →
            </button>
          )}
        </div>
      )}

      {/* Decision list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }}></div>)}
        </div>
      ) : decisions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--tx3)', fontSize: 13 }}>
          No decisions logged yet. Every business decision you log will be reviewed in 6 weeks.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {decisions.slice(0, 10).map((d, i) => {
            const tc = TYPE_COLORS[d.decision_type] || TYPE_COLORS.strategy
            const vs = d.review_verdict ? VERDICT_STYLE[d.review_verdict] : null
            return (
              <div key={d.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s`, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: tc.color, background: tc.bg, borderRadius: 6, padding: '2px 7px', flexShrink: 0, textTransform: 'capitalize', marginTop: 1 }}>
                    {d.decision_type}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)', lineHeight: 1.4 }}>{d.title}</div>
                    {(d.before_value || d.after_value) && (
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 3 }}>
                        {d.before_value && <span>{d.before_value}</span>}
                        {d.before_value && d.after_value && <span style={{ margin: '0 4px' }}>→</span>}
                        {d.after_value && <span style={{ color: '#6366F1', fontWeight: 600 }}>{d.after_value}</span>}
                      </div>
                    )}
                    {d.reviewed && d.review_result && (
                      <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: vs?.bg || 'var(--ev)', border: '1px solid var(--b)' }}>
                        {vs && <div style={{ fontSize: 10, fontWeight: 700, color: vs.color, marginBottom: 4 }}>{vs.label}</div>}
                        <p style={{ fontSize: 12, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>{d.review_result}</p>
                      </div>
                    )}
                    {!d.reviewed && (
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>
                        AskBiz checks back: {new Date(d.review_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
