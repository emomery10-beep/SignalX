'use client'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

interface PaywallProps {
  type: 'soft_warning' | 'limit_reached' | 'feature_locked'
  questionsUsed?: number
  questionLimit?: number
  feature?: string
  planNeeded?: 'growth' | 'business'
}

function buildFeatures(tc: (k: string) => string) {
  return [
    tc('billing_paywall.feature500Questions'),
    tc('billing_paywall.feature10Uploads'),
    tc('billing_paywall.featureExpansion'),
    tc('billing_paywall.featureLiveSync'),
    tc('billing_paywall.featureAlerts'),
    tc('billing_paywall.featureTrial'),
  ]
}

export default function Paywall({ type, questionsUsed = 0, questionLimit = 10, feature, planNeeded = 'growth' }: PaywallProps) {
  const router = useRouter()
  const { tc } = useLang()

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

  const featureLabel = feature || 'This feature'

  const content = {
    soft_warning: {
      emoji: '📈',
      title: tc('billing_paywall.softWarningTitle'),
      body: tc('billing_paywall.softWarningBody', { questionsUsed, questionLimit }),
      cta: tc('billing_paywall.softWarningCta'),
      secondary: tc('billing_paywall.softWarningSecondary'),
    },
    limit_reached: {
      emoji: '🚀',
      title: tc('billing_paywall.limitReachedTitle'),
      body: tc('billing_paywall.limitReachedBody', { questionLimit }),
      cta: tc('billing_paywall.limitReachedCta'),
      secondary: tc('billing_paywall.limitReachedSecondary'),
    },
    feature_locked: {
      emoji: '✨',
      title: tc('billing_paywall.featureLockedTitle', { feature: featureLabel }),
      body: tc('billing_paywall.featureLockedBody', { feature: featureLabel }),
      cta: tc('billing_paywall.featureLockedCta'),
      secondary: tc('billing_paywall.featureLockedSecondary'),
    },
  }[type]

  const features = buildFeatures(tc)

  return (
    <div onMouseEnter={logTrigger} style={{ maxWidth:460, margin:'16px auto', padding:'24px 26px', borderRadius:18, border:'1px solid rgba(30,212,202,.28)', background:'linear-gradient(135deg,rgba(30,212,202,.06),rgba(146,104,248,.06))', textAlign:'center' }}>
      <div style={{ fontSize:28, marginBottom:12 }}>{content.emoji}</div>
      <div style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:600, marginBottom:8, letterSpacing:'-.02em' }}>
        {content.title}
      </div>
      <div style={{ fontSize:11, color:'var(--tx2)', lineHeight:1.7, marginBottom:20, maxWidth:360, margin:'0 auto 20px' }}>
        {content.body}
      </div>

      {/* Feature highlights */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:20, textAlign:'left' }}>
        {features.map((f, i) => (
          <div key={i} style={{ fontSize:9, color:'var(--tx2)', padding:'6px 10px', borderRadius:8, background:'rgba(30,212,202,.07)', border:'1px solid rgba(30,212,202,.15)' }}>
            ✓ {f}
          </div>
        ))}
      </div>

      <button onClick={upgrade} style={{ width:'100%', padding:'13px', borderRadius:9999, border:'none', background:'linear-gradient(135deg,#1ed4ca,#9268f8)', color:'#04080f', fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:12, fontWeight:700, cursor:'pointer', marginBottom:10 }}>
        {content.cta}
      </button>

      <button onClick={() => router.push('/billing')} style={{ background:'none', border:'none', color:'var(--tx3)', fontSize:10, cursor:'pointer', fontFamily:'inherit' }}>
        {content.secondary}
      </button>

      <div style={{ fontSize:9, color:'var(--tx3)', marginTop:10 }}>
        {tc('billing_paywall.footer')}
      </div>
    </div>
  )
}
