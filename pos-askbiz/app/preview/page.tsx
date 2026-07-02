'use client'
import Link from 'next/link'
import { PreviewGate, PreviewBanner } from '@/lib/preview-gate'

const SCREENS = [
  { href: '/preview/cashier', emoji: '💳', title: 'Cashier', desc: 'Checkout, cart, camera scan, card & mobile payment' },
  { href: '/preview/inventory', emoji: '📦', title: 'Inventory', desc: 'Stock list, restock, low-stock alerts' },
  { href: '/preview/manager', emoji: '📊', title: 'Manager', desc: '7 sector-specific manager dashboards' },
  { href: '/preview/logistics', emoji: '🚚', title: 'Logistics (Courier)', desc: 'Parcel intake, dispatch, collect, branch tracking' },
]

export default function PreviewIndexPage() {
  return (
    <PreviewGate>
      <PreviewBanner label="Staff-screen demo index" />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#1a1916' }}>AskBiz staff screens</h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>The real, interactive UI each staff role sees — running on mock data only.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {SCREENS.map(s => (
            <Link key={s.href} href={s.href} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
              borderRadius: 12, border: '1px solid rgba(0,0,0,.08)', background: '#fff',
              textDecoration: 'none', color: 'inherit',
            }}>
              <span style={{ fontSize: 26 }}>{s.emoji}</span>
              <span>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{s.desc}</div>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PreviewGate>
  )
}
