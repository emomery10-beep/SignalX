'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PreviewGate, PreviewBanner } from '@/lib/preview-gate'
import { buildMockSession, usePreviewHarness, previewSessionKey } from '@/lib/preview-mock'

const HandlerHome = dynamic(() => import('../../logistics/page'), { ssr: false })
const Dispatch = dynamic(() => import('../../logistics/dispatch/page'), { ssr: false })
const Intake = dynamic(() => import('../../logistics/intake/page'), { ssr: false })
const Collect = dynamic(() => import('../../logistics/collect/page'), { ssr: false })
const BranchDashboard = dynamic(() => import('../../logistics/dashboard/page'), { ssr: false })

// Roles confirmed against each sub-page's own auth-guard in pos-askbiz/lib/pos-role-client.ts.
const SCREENS = [
  { id: 'handler', label: '📦 Handler / Driver Home', role: 'logistics-handler', Component: HandlerHome },
  { id: 'dispatch', label: '🚚 Dispatch', role: 'logistics-dispatcher', Component: Dispatch },
  { id: 'intake', label: '📥 Intake', role: 'logistics-counter-clerk', Component: Intake },
  { id: 'collect', label: '📤 Collect', role: 'logistics-counter-clerk', Component: Collect },
  { id: 'branch', label: '🏢 Branch Dashboard', role: 'logistics-branch-manager', Component: BranchDashboard },
] as const

export default function LogisticsPreviewPage() {
  const [screenIdx, setScreenIdx] = useState(0)
  const active = SCREENS[screenIdx]
  const session = buildMockSession(active.role, 'logistics', 'Preview Logistics Staff')
  const ready = usePreviewHarness(session)
  const Active = active.Component

  return (
    <PreviewGate>
      <PreviewBanner label={`Logistics — ${active.label}`} />
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', flexWrap: 'wrap', background: '#fff', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
        {SCREENS.map((s, i) => (
          <button key={s.id} onClick={() => setScreenIdx(i)}
            style={{ padding: '7px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              fontWeight: screenIdx === i ? 700 : 500,
              border: screenIdx === i ? '2px solid #d08a59' : '1px solid rgba(0,0,0,.12)',
              background: screenIdx === i ? '#d08a5914' : '#fff',
              color: screenIdx === i ? '#d08a59' : '#555' }}>
            {s.label}
          </button>
        ))}
      </div>
      {ready
        ? <Active key={`${active.id}:${previewSessionKey(session)}`} />
        : <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>Loading preview…</div>}
    </PreviewGate>
  )
}
