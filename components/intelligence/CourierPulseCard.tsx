'use client'
import { useState, useEffect } from 'react'

const TEAL = '#0891b2'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#d97706'

interface CourierHealth {
  totalParcels: number
  todayIn: number
  inTransit: number
  atBranch: number
  delivered: number
  failed: number
  deliveryRate: number
  totalRevenue: number
  unpaidRevenue: number
  trucksAvailable: number
  trucksInTransit: number
  trucksMaintenance: number
  stuckOver48h: number
}

export default function CourierPulseCard({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const [data, setData] = useState<CourierHealth | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/pos/parcels?limit=200').then(r => r.json()),
      fetch('/api/pos/trucks').then(r => r.json()),
    ]).then(([pData, tData]) => {
      const parcels = pData.parcels || []
      const trucks = tData.trucks || []

      const today = new Date(); today.setHours(0, 0, 0, 0)
      const todayP = parcels.filter((p: any) => new Date(p.created_at) >= today)
      const inTransit = parcels.filter((p: any) => ['in_transit', 'out_for_delivery'].includes(p.status))
      const atBranch = parcels.filter((p: any) => ['received', 'at_branch', 'assigned', 'loaded', 'at_destination'].includes(p.status))
      const delivered = parcels.filter((p: any) => ['delivered', 'collected'].includes(p.status))
      const failed = parcels.filter((p: any) => p.status === 'failed_delivery')
      const completedTotal = delivered.length + failed.length
      const now = Date.now()
      const stuck = parcels.filter((p: any) => ['received', 'at_branch'].includes(p.status) && (now - new Date(p.created_at).getTime()) > 48 * 3600000)

      setData({
        totalParcels: parcels.length,
        todayIn: todayP.length,
        inTransit: inTransit.length,
        atBranch: atBranch.length,
        delivered: delivered.length,
        failed: failed.length,
        deliveryRate: completedTotal > 0 ? Math.round((delivered.length / completedTotal) * 100) : 0,
        totalRevenue: parcels.reduce((s: number, p: any) => s + (p.fee_charged || 0), 0),
        unpaidRevenue: parcels.filter((p: any) => p.payment_status === 'unpaid').reduce((s: number, p: any) => s + (p.fee_charged || 0), 0),
        trucksAvailable: trucks.filter((t: any) => t.status === 'available').length,
        trucksInTransit: trucks.filter((t: any) => t.status === 'in_transit').length,
        trucksMaintenance: trucks.filter((t: any) => t.status === 'maintenance').length,
        stuckOver48h: stuck.length,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ height: 120, borderRadius: 14, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }} />
  if (!data || data.totalParcels === 0) return null

  const score = Math.min(100, Math.max(0,
    Math.round(
      (data.deliveryRate > 0 ? data.deliveryRate * 0.4 : 40) +
      (data.stuckOver48h === 0 ? 20 : data.stuckOver48h < 5 ? 10 : 0) +
      (data.failed === 0 ? 20 : data.failed < 3 ? 10 : 0) +
      (data.trucksMaintenance === 0 ? 20 : 10)
    )
  ))
  const color = score >= 70 ? GREEN : score >= 45 ? AMBER : RED
  const bg = score >= 70 ? 'rgba(22,163,74,.08)' : score >= 45 ? 'rgba(217,119,6,.08)' : 'rgba(220,38,38,.08)'
  const border = score >= 70 ? 'rgba(22,163,74,.2)' : score >= 45 ? 'rgba(217,119,6,.2)' : 'rgba(220,38,38,.2)'
  const label = score >= 70 ? 'Healthy' : score >= 45 ? 'At Risk' : 'Critical'

  const circ = 2 * Math.PI * 36
  const dashOffset = circ - (score / 100) * circ

  return (
    <div style={{ padding: 16, borderRadius: 14, border: `1px solid ${border}`, background: bg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="38" cy="38" r="36" fill="none" stroke="var(--b)" strokeWidth="6" />
            <circle cx="38" cy="38" r="36" fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-sora)', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 8, color: 'var(--tx3)' }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>🚛 Courier Operations</span>
            <span style={{ fontSize: 10, fontWeight: 600, color, background: bg, border: `1px solid ${border}`, padding: '1px 6px', borderRadius: 9999 }}>{label}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--tx2)' }}><strong>{data.todayIn}</strong> today</span>
            <span style={{ fontSize: 11, color: '#6366f1' }}><strong>{data.inTransit}</strong> in transit</span>
            <span style={{ fontSize: 11, color: AMBER }}><strong>{data.atBranch}</strong> at branch</span>
            {data.failed > 0 && <span style={{ fontSize: 11, color: RED }}><strong>{data.failed}</strong> failed</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: GREEN }}>{data.deliveryRate}% delivery rate</span>
            {data.stuckOver48h > 0 && <span style={{ fontSize: 11, color: RED }}>{data.stuckOver48h} stuck &gt;48h</span>}
            {data.unpaidRevenue > 0 && <span style={{ fontSize: 11, color: AMBER }}>KES {data.unpaidRevenue.toLocaleString()} unpaid</span>}
          </div>
        </div>
      </div>

      {/* Fleet strip */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${border}` }}>
        {[
          { l: 'Available', v: data.trucksAvailable, c: GREEN },
          { l: 'In Transit', v: data.trucksInTransit, c: '#6366f1' },
          { l: 'Maintenance', v: data.trucksMaintenance, c: RED },
        ].map(f => (
          <div key={f.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: f.c }} />
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{f.l}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: f.c }}>{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
