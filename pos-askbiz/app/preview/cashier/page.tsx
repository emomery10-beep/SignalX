'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PreviewGate, PreviewBanner } from '@/lib/preview-gate'
import { buildMockSession, usePreviewHarness, previewSessionKey } from '@/lib/preview-mock'
import { usePreviewCurrency, CurrencySelect } from '@/lib/preview-currency-ui'
import type { Sector } from '@/lib/preview-fixtures'

// Each sector's REAL front-of-house screen — not the same checkout reskinned.
// Retail genuinely is a generic till, so it alone uses /sell; the other 4
// sectors have their own structurally distinct daily-use screen in pos-askbiz.
const RealSellPage        = dynamic(() => import('../../sell/page'), { ssr: false })
const RealRestaurantFloor = dynamic(() => import('../../restaurant/floor/page'), { ssr: false })
const RealSalonBookings   = dynamic(() => import('../../salon/bookings/page'), { ssr: false })
const RealRepairIntake    = dynamic(() => import('../../repair/intake/page'), { ssr: false })
const RealFactoryCapture  = dynamic(() => import('../../factory/capture/page'), { ssr: false })

const SECTORS: { id: Sector; label: string; screenLabel: string; Component: React.ComponentType }[] = [
  { id: 'retail',     label: '📦 Retail',     screenLabel: 'Checkout',           Component: RealSellPage },
  { id: 'restaurant', label: '🍴 Restaurant', screenLabel: 'Floor & orders',     Component: RealRestaurantFloor },
  { id: 'salon',      label: '💇 Salon',      screenLabel: 'Bookings',           Component: RealSalonBookings },
  { id: 'repair',     label: '🔧 Repair',     screenLabel: 'Job intake',         Component: RealRepairIntake },
  { id: 'factory',    label: '🏭 Factory',    screenLabel: 'Production capture', Component: RealFactoryCapture },
]

export default function CashierPreviewPage() {
  const [sector, setSector] = useState<Sector>('retail')
  const active = SECTORS.find(s => s.id === sector)!
  // Role stays fixed at 'cashier' — none of these screens gate on role, only
  // on session presence (usePosAuth) and, for repair, on staff_sector via the
  // /api/pos/config response, which already carries the selected sector.
  const cur = usePreviewCurrency()
  const session = buildMockSession('cashier', sector, 'Preview Staff', cur.currency)
  const ready = usePreviewHarness(session)
  const Active = active.Component

  return (
    <PreviewGate>
      <PreviewBanner label={`${active.label.replace(/^\S+\s/, '')} — ${active.screenLabel}`} />
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', flexWrap: 'wrap', background: '#fff', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
        {SECTORS.map(s => (
          <button key={s.id} onClick={() => setSector(s.id)}
            style={{ padding: '7px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              fontWeight: sector === s.id ? 700 : 500,
              border: sector === s.id ? '2px solid #d08a59' : '1px solid rgba(0,0,0,.12)',
              background: sector === s.id ? '#d08a5914' : '#fff',
              color: sector === s.id ? '#d08a59' : '#555' }}>
            {s.label}
          </button>
        ))}
        <CurrencySelect value={cur.currency} onChange={cur.setCurrency} />
      </div>
      {ready
        ? <Active key={previewSessionKey(session)} />
        : <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>Loading preview…</div>}
    </PreviewGate>
  )
}
