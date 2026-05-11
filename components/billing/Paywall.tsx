'use client'
import { useRouter } from 'next/navigation'

interface PaywallProps {
  type: 'soft_warning' | 'limit_reached' | 'feature_locked'
  questionsUsed?: number
  questionLimit?: number
  feature?: string
  planNeeded?: 'growth' | 'business'
}

export default function Paywall({ type, questionsUsed = 0, questionLimit = 10, feature, planNeeded = 'growth' }: PaywallProps) {
  const router = useRouter()

  const upgrade = async () => {
    const res = await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkout', plan: planNeeded }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const logTrigger = async () => {
    await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_trigger',
        trigger: type,
        feature: feature || 'general',
        plan: planNeeded,
      }),
    })
  }

  const content = {
    soft_warning: {
      emoji: '📈',
      title: "You're getting a lot out of AskBiz",
      body: `You've used ${questionsUsed} of your ${questionLimit} monthly questions. You're clearly finding value — unlock more so you never have to stop mid-analysis.`,
      cta: 'Unlock more questions →',
      secondary: 'View plans',
    },
    limit_reached: {
      emoji: '🚀',
      title: "You've made the most of your free plan",
      body: `You've used all ${questionLimit} free questions this month. Upgrade to keep going — your data and conversations are all saved and waiting.`,
      cta: 'Continue with Growth — £19/month →',
      secondary: 'View all plans',
    },
    feature_locked: {
      emoji: '✨',
      title: `${feature || 'This feature'} is on Growth`,
      body: `${feature || 'This'} is available on the Growth plan. Upgrade to unlock expansion intelligence, live sync, alerts, forecasts, and more.`,
      cta: 'Unlock Growth — £19/month →',
      secondary: 'See what else is included',
    },
  }[type]

  return (
    <div onMouseEnter={logTrigger} style={{ maxWidth:460, margin:'16px auto', padding:'24px 26px', borderRadius:18, border:'1px solid rgba(30,212,202,.28)', background:'linear-gradient(135deg,rgba(30,212,202,.06),rgba(146,104,248,.06))', textAlign:'center' }}>
      <div style={{ fontSize:30, marginBottom:12 }}>{content.emoji}</div>
      <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:600, marginBottom:8, letterSpacing:'-.02em' }}>
        {content.title}
      </div>
      <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.7, marginBottom:20, maxWidth:360, margin:'0 auto 20px' }}>
        {content.body}
      </div>

      {/* Feature highlights */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:20, textAlign:'left' }}>
        {[
          '500 AI questions/month',
          '10 file uploads',
          'Expansion intelligence',
          'Live data sync',
          'Alerts & forecasts',
          '7-day free trial',
        ].map((f, i) => (
          <div key={i} style={{ fontSize:11, color:'var(--tx2)', padding:'6px 10px', borderRadius:8, background:'rgba(30,212,202,.07)', border:'1px solid rgba(30,212,202,.15)' }}>
            ✓ {f}
          </div>
        ))}
      </div>

      <button onClick={upgrade} style={{ width:'100%', padding:'13px', borderRadius:9999, border:'none', background:'linear-gradient(135deg,#1ed4ca,#9268f8)', color:'#04080f', fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:10 }}>
        {content.cta}
      </button>

      <button onClick={() => router.push('/billing')} style={{ background:'none', border:'none', color:'var(--tx3)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
        {content.secondary}
      </button>

      <div style={{ fontSize:11, color:'var(--tx3)', marginTop:10 }}>
        7-day free trial · Cancel anytime · Price locked for early adopters
      </div>
    </div>
  )
}
