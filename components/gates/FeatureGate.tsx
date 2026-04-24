'use client'
import { useRouter } from 'next/navigation'

interface FeatureGateProps {
  planId: string
  feature: string
  featureName: string
  planNeeded: 'growth' | 'business'
  children: React.ReactNode
}

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0, growth: 1, business: 2, enterprise: 3
}

const FEATURE_HIGHLIGHTS: Record<string, string[]> = {
  expansion_intel: ['Ranked expansion opportunities', 'Profit simulator with sliders', 'Cannibalization risk analysis', 'Launch plan with opening order'],
  live_sync: ['Live Shopify sync', 'Stripe revenue data', 'Google Sheets connection', 'Auto-updates every 6 hours'],
  forecasts: ['Linear regression forecasting', 'Seasonal demand modelling', 'Moving average analysis', 'Exportable forecast reports'],
  alerts: ['Stock level alerts', 'Margin drop alerts', 'Custom threshold alerts', 'Email notifications'],
  templates: ['Retail industry templates', 'Ecommerce templates', 'Distributor templates', 'Exporter templates'],
  export: ['Export charts as PNG', 'Export data as CSV', 'Share insights link', 'Download full report'],
  candidate_simulator: ['Adjust price, cost, MOQ', 'See real-time margin impact', 'Break-even calculation', 'Stockout risk assessment'],
}

export default function FeatureGate({ planId, feature, featureName, planNeeded, children }: FeatureGateProps) {
  const router = useRouter()
  const userLevel = PLAN_HIERARCHY[planId] ?? 0
  const requiredLevel = PLAN_HIERARCHY[planNeeded] ?? 1
  const hasAccess = userLevel >= requiredLevel

  if (hasAccess) return <>{children}</>

  const highlights = FEATURE_HIGHLIGHTS[feature] || ['Unlock this feature', 'And many more']
  const price = planNeeded === 'growth' ? '£19/month' : '£49/month'
  const planName = planNeeded === 'growth' ? 'Growth' : 'Business'

  const upgrade = async () => {
    const res = await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkout', plan: planNeeded }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,rgba(208,138,89,.15),rgba(140,111,224,.15))', border: '1px solid rgba(208,138,89,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>
          ✦
        </div>

        <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, marginBottom: 10, letterSpacing: '-.02em' }}>
          {featureName} is on {planName}
        </h2>

        <p style={{ fontSize: 14, color: 'var(--tx2)', lineHeight: 1.7, marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
          You're on the Free plan. Upgrade to {planName} to unlock {featureName.toLowerCase()} and everything else included.
        </p>

        {/* Feature list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28, textAlign: 'left' }}>
          {highlights.map((h, i) => (
            <div key={i} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(208,138,89,.2)', background: 'rgba(208,138,89,.05)', fontSize: 13, color: 'var(--tx2)', display: 'flex', gap: 7, alignItems: 'flex-start', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--acc)', flexShrink: 0 }}>✓</span> {h}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={upgrade}
          style={{ width: '100%', padding: '13px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10, boxShadow: '0 4px 20px rgba(208,138,89,.25)' }}>
          Unlock {planName} — {price} →
        </button>

        <button onClick={() => router.push('/billing')}
          style={{ background: 'none', border: 'none', color: 'var(--tx3)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          View all plans
        </button>

        <p style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 10 }}>
          7-day free trial · Cancel anytime · Early adoption price
        </p>
      </div>
    </div>
  )
}
