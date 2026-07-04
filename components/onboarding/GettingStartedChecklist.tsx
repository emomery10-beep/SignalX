'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#d08a59'
const ACC_BG = 'rgba(208,138,89,.08)'
const ACC_BORDER = 'rgba(208,138,89,.2)'
const GREEN = '#16a34a'

const DISMISS_KEY = 'askbiz_checklist_dismissed_v1'

type ChecklistStep = {
  label: string
  done: boolean
  href: string
}

// Business types that run the till day-to-day — steps point at selling/inventory.
const POS_SELLER_TYPES = new Set(['retail', 'market_stall', 'food_bev', 'salon'])
const COURIER_TYPES = new Set(['courier', 'distributor'])
// Everyone else (ecommerce, services, manufacturer, importer, exporter) — data/BI-first.

export default function GettingStartedChecklist() {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(true) // start hidden until we know it's safe to show
  const [loading, setLoading] = useState(true)
  const [businessType, setBusinessType] = useState('')
  const [steps, setSteps] = useState<ChecklistStep[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem(DISMISS_KEY) === '1') {
      setLoading(false)
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const profile = await fetch('/api/profile').then(r => r.ok ? r.json() : null).catch(() => null)
        const bizType = (profile?.business_type || '').toLowerCase()
        if (cancelled) return
        setBusinessType(bizType)

        const built = await buildSteps(bizType)
        if (cancelled) return

        setSteps(built)
        const allDone = built.length > 0 && built.every(s => s.done)
        if (allDone && typeof window !== 'undefined') {
          window.localStorage.setItem(DISMISS_KEY, '1')
        }
        setDismissed(allDone)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') window.localStorage.setItem(DISMISS_KEY, '1')
  }

  if (loading || dismissed || steps.length === 0) return null

  const doneCount = steps.filter(s => s.done).length

  return (
    <div style={{
      border: `1.5px solid ${ACC_BORDER}`, background: ACC_BG, borderRadius: 14,
      padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Getting started</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>{doneCount} of {steps.length} done</div>
        </div>
        <button
          onClick={dismiss}
          title="Dismiss"
          style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => router.push(s.href)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b)',
              background: 'var(--sf)', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: s.done ? GREEN : 'transparent', border: s.done ? 'none' : `1.5px solid ${ACC_BORDER}`,
            }}>
              {s.done && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span style={{
              fontSize: 13, fontWeight: 500, color: s.done ? 'var(--tx3)' : 'var(--tx)',
              textDecoration: s.done ? 'line-through' : 'none',
            }}>
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

async function buildSteps(bizType: string): Promise<ChecklistStep[]> {
  const safeCount = async (path: string, pick: (d: any) => number): Promise<number> => {
    try {
      const d = await fetch(path).then(r => r.ok ? r.json() : null)
      return d ? pick(d) : 0
    } catch { return 0 }
  }

  if (POS_SELLER_TYPES.has(bizType)) {
    const [products, sales, staff] = await Promise.all([
      safeCount('/api/pos/inventory', d => d.total ?? (d.inventory?.length || 0)),
      safeCount(`/api/pos/transactions?from=2000-01-01T00:00:00.000Z`, d => d.transactions?.length || 0),
      safeCount('/api/pos/staff', d => d.staff?.length || 0),
    ])
    return [
      { label: 'Scan or add your first product', done: products > 0, href: '/pos' },
      { label: 'Make your first sale', done: sales > 0, href: '/pos' },
      { label: 'Invite a staff member', done: staff > 0, href: '/pos?tab=staff' },
    ]
  }

  if (COURIER_TYPES.has(bizType)) {
    const [staff, parcels] = await Promise.all([
      safeCount('/api/pos/staff', d => d.staff?.length || 0),
      safeCount('/api/pos/parcels?limit=1', d => d.parcels?.length || 0),
    ])
    return [
      { label: 'Add your first driver or handler', done: staff > 0, href: '/pos?tab=staff' },
      { label: 'Log your first parcel', done: parcels > 0, href: '/pos?tab=logistics' },
      { label: 'Invite your team', done: staff > 1, href: '/pos?tab=staff' },
    ]
  }

  // Data/BI-first businesses: ecommerce, services, manufacturer, importer, exporter, unknown
  const [sources, staff] = await Promise.all([
    safeCount('/api/sources', d => Array.isArray(d) ? d.length : 0),
    safeCount('/api/pos/staff', d => d.staff?.length || 0),
  ])
  return [
    { label: 'Connect a data source', done: sources > 0, href: '/sources' },
    { label: 'Ask AskBiz your first business question', done: false, href: '/ask' },
    { label: 'Invite your team', done: staff > 0, href: '/settings' },
  ]
}
