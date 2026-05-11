'use client'
import { useRouter } from 'next/navigation'
import { getUpgradeMessage, getPlanBadge, type PlanFeatures } from '@/lib/plans'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

interface FeatureGateProps {
  planId:       string
  feature:      keyof PlanFeatures
  featureName?: string
  planNeeded?:  'growth' | 'business'
  children:     React.ReactNode
  // If compact = true, show inline locked badge instead of full wall
  compact?:     boolean
}

export default function FeatureGate({
  planId,
  feature,
  featureName,
  planNeeded,
  children,
  compact = false,
}: FeatureGateProps) {
  const router  = useRouter()
  const message = getUpgradeMessage(feature)
  const plan    = planNeeded || message.plan
  const badge   = getPlanBadge(plan)
  const name    = featureName || message.title

  // Check if user has access
  const PLAN_ORDER = ['free', 'growth', 'business']
  const userIdx   = PLAN_ORDER.indexOf(planId)
  const neededIdx = PLAN_ORDER.indexOf(plan)
  const hasAccess = userIdx >= neededIdx

  if (hasAccess) return <>{children}</>

  // Compact inline lock
  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: EV, border: `1px solid ${B}`, cursor: 'pointer' }}
        onClick={() => router.push('/billing')}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={badge.colour} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span style={{ fontSize: 11, color: badge.colour, fontWeight: 600 }}>{badge.label} feature</span>
      </div>
    )
  }

  // Full gate wall
  return (
    <div style={{ padding: '32px 24px', textAlign: 'center', background: SF, border: `1px solid ${B}`, borderRadius: 16, maxWidth: 480, margin: '0 auto' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={badge.colour} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <div style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 700, color: TX, marginBottom: 8 }}>
        {name}
      </div>
      <p style={{ fontSize: 14, color: TX2, lineHeight: 1.65, marginBottom: 24, maxWidth: 340, margin: '0 auto 24px' }}>
        {message.desc}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/billing')}
          style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: badge.colour, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 2px 12px ${badge.colour}35` }}
        >
          Upgrade to {badge.label} →
        </button>
        <button
          onClick={() => router.push('/billing')}
          style={{ padding: '11px 16px', borderRadius: 10, border: `1px solid ${B}`, background: 'transparent', color: TX2, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          See all plans
        </button>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: TX3 }}>
        You're on the <strong>{planId}</strong> plan
      </div>
    </div>
  )
}
