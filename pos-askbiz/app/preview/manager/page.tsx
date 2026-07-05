'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PreviewGate, PreviewBanner } from '@/lib/preview-gate'
import { buildMockSession, usePreviewHarness, previewSessionKey } from '@/lib/preview-mock'
import { usePreviewCurrency, CurrencySelect } from '@/lib/preview-currency-ui'
import type { Sector } from '@/lib/preview-fixtures'

const RealDashboardPage = dynamic(() => import('../../dashboard/page'), { ssr: false })

// Confirmed against pos-askbiz/app/dashboard/page.tsx's renderDashboard():
// role.startsWith('retail-') → RetailManagerDashboard, 'repair-' → RepairSectorDashboard,
// 'factory-' → FactorySectorDashboard, 'engineer'/'repair'/'supervisor' → their named
// dashboards, anything else (incl. 'manager') → the generic ManagerDashboard.
const ROLES: { role: string; label: string; sector: Sector }[] = [
  { role: 'manager', label: 'Manager (generic)', sector: 'retail' },
  { role: 'retail-manager', label: 'Retail Manager', sector: 'retail' },
  { role: 'repair-manager', label: 'Repair Sector Manager', sector: 'repair' },
  { role: 'factory-manager', label: 'Factory Sector Manager', sector: 'factory' },
  { role: 'supervisor', label: 'Supervisor', sector: 'repair' },
  { role: 'engineer', label: 'Engineer', sector: 'repair' },
  { role: 'repair', label: 'Repair (legacy)', sector: 'repair' },
]

export default function ManagerPreviewPage() {
  const [roleIdx, setRoleIdx] = useState(0)
  const active = ROLES[roleIdx]
  const cur = usePreviewCurrency()
  const session = buildMockSession(active.role, active.sector, 'Preview Manager', cur.currency)
  const ready = usePreviewHarness(session)

  return (
    <PreviewGate>
      <PreviewBanner label={`Manager dashboard — ${active.label}`} />
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', flexWrap: 'wrap', background: '#fff', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
        {ROLES.map((r, i) => (
          <button key={r.role} onClick={() => setRoleIdx(i)}
            style={{ padding: '7px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              fontWeight: roleIdx === i ? 700 : 500,
              border: roleIdx === i ? '2px solid #d08a59' : '1px solid rgba(0,0,0,.12)',
              background: roleIdx === i ? '#d08a5914' : '#fff',
              color: roleIdx === i ? '#d08a59' : '#555' }}>
            {r.label}
          </button>
        ))}
        <CurrencySelect value={cur.currency} onChange={cur.setCurrency} />
      </div>
      {ready
        ? <RealDashboardPage key={previewSessionKey(session)} />
        : <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>Loading preview…</div>}
    </PreviewGate>
  )
}
