'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import { PLAN_HIGHLIGHTS, PLAN_PRICES, PLAN_DESCRIPTIONS } from '@/lib/plans'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    color: '#6b6760',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    color: '#6366F1',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    color: '#7c3aed',
    popular: false,
  },
]

export default function BillingPage() {
  const { user } = useStore()
  const currentPlan = user?.plan || 'free'
  const [loading, setLoading] = useState('')

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return
    setLoading(planId)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout', plan: planId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error('Billing error:', e)
    } finally {
      setLoading('')
    }
  }

  return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>Upgrade plan</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
              You are on the <strong>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</strong> plan
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell-body">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 8 }}>
              Simple, honest pricing
            </h1>
            <p style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.6 }}>
              Cancel any time. No hidden fees. API access included on every plan.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PLANS.map(plan => {
              const price = PLAN_PRICES[plan.id as keyof typeof PLAN_PRICES]
              const highlights = PLAN_HIGHLIGHTS[plan.id as keyof typeof PLAN_HIGHLIGHTS]
              const desc = PLAN_DESCRIPTIONS[plan.id as keyof typeof PLAN_DESCRIPTIONS]
              const isCurrent = currentPlan === plan.id
              const isPopular = plan.popular

              return (
                <div key={plan.id}
                  style={{
                    borderRadius: 16,
                    border: isPopular ? '2px solid #6366F1' : '1px solid var(--b)',
                    background: isPopular ? 'rgba(99,102,241,.03)' : 'var(--sf)',
                    padding: '20px 24px',
                    position: 'relative',
                  }}>

                  {isPopular && (
                    <div style={{ position: 'absolute', top: -11, left: 24, fontSize: 11, fontWeight: 700, color: '#fff', background: '#6366F1', borderRadius: 9999, padding: '2px 10px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                      Most popular
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: plan.color }}>{plan.name}</span>
                        {isCurrent && <span style={{ fontSize: 11, fontWeight: 600, color: plan.color, background: plan.color + '18', borderRadius: 9999, padding: '2px 8px' }}>Current plan</span>}
                      </div>
                      <div style={{ fontSize: 'clamp(26px,4vw,32px)', fontWeight: 800, color: 'var(--tx)', letterSpacing: '-.03em', lineHeight: 1 }}>
                        {price.display}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--tx3)', margin: '6px 0 0', lineHeight: 1.5, maxWidth: 340 }}>{desc}</p>
                    </div>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrent || plan.id === 'free' || loading === plan.id}
                      style={{
                        padding: '11px 22px',
                        borderRadius: 10,
                        border: isCurrent || plan.id === 'free' ? '1px solid var(--b)' : 'none',
                        background: isCurrent || plan.id === 'free' ? 'transparent' : plan.color,
                        color: isCurrent || plan.id === 'free' ? 'var(--tx3)' : '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isCurrent || plan.id === 'free' ? 'default' : 'pointer',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                      {loading === plan.id ? 'Loading…' : isCurrent ? 'Current plan' : plan.id === 'free' ? 'Free forever' : 'Upgrade →'}
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid var(--b)', paddingTop: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '6px 16px' }}>
                      {highlights.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--tx2)' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* API access note */}
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <p style={{ fontSize: 13, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--tx)' }}>API access included on every plan</strong> — including Free. Build on top of AskBiz from day one.
            </p>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Common questions</div>
            {[
              { q: 'Can I cancel anytime?', a: 'Yes — cancel in one click, no questions asked. You keep access until the end of your billing period.' },
              { q: 'What counts as a question?', a: 'Every time you ask AskBiz something — whether in chat, on the home screen, or via the API — it counts as one question. Free plan gets 10 per month.' },
              { q: 'How do team seats work?', a: 'Business plan includes up to 5 team members. Each person gets their own login with a role — accountant, analyst, buyer, or viewer. Everyone sees the same data filtered to their role.' },
              { q: 'Is my data safe?', a: 'Your data is encrypted at rest and in transit. We never use your business data to train AI models. Your data belongs to you.' },
            ].map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--b)', padding: '14px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 5 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
