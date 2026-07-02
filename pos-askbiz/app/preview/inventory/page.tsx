'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PreviewGate, PreviewBanner } from '@/lib/preview-gate'
import { buildMockSession, usePreviewHarness, previewSessionKey } from '@/lib/preview-mock'
import type { Sector } from '@/lib/preview-fixtures'

const RealInventoryPage = dynamic(() => import('../../inventory/page'), { ssr: false })

const SECTORS: { id: Sector; label: string }[] = [
  { id: 'retail', label: '📦 Retail' },
  { id: 'restaurant', label: '🍴 Restaurant' },
  { id: 'salon', label: '💇 Salon' },
  { id: 'repair', label: '🔧 Repair' },
  { id: 'factory', label: '🏭 Factory' },
]

export default function InventoryPreviewPage() {
  const [sector, setSector] = useState<Sector>('retail')
  const session = buildMockSession('inventory', sector, 'Preview Inventory Clerk')
  const ready = usePreviewHarness(session)

  return (
    <PreviewGate>
      <PreviewBanner label="Inventory screen as it appears to staff" />
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
      </div>
      {ready
        ? <RealInventoryPage key={previewSessionKey(session)} />
        : <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>Loading preview…</div>}
    </PreviewGate>
  )
}
