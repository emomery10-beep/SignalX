'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

export default function LogisticsAlertBanner() {
  const router = useRouter()
  const { tc } = useLang()
  const [data, setData] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/logistics')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
  }, [])

  if (!data) return null

  const health = data.health || null
  const alerts = Array.isArray(data.alerts) ? data.alerts : []
  const brief = data.brief || null

  // No shipments and no health data — show gentle prompt
  if (!health || health.active_shipments === 0) {
    return (
      <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>📦</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{tc('logistics_alertbanner.trackShipmentsTitle')}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('logistics_alertbanner.trackShipmentsDesc')}</div>
          </div>
        </div>
        <button onClick={() => router.push('/intelligence')} style={{ padding: '7px 14px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {tc('logistics_alertbanner.addShipment')}
        </button>
      </div>
    )
  }

  // No alerts — check if at risk
  if (!alerts.length || dismissed) {
    if (!health || health.score >= 70) return null
    return (
      <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 12, background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14 }}>⚠️</span>
        <div style={{ fontSize: 11, color: '#d97706', flex: 1 }}>
          <strong>{tc(health.at_risk !== 1 ? 'logistics_alertbanner.shipmentsAtRiskPlural' : 'logistics_alertbanner.shipmentsAtRiskSingular', { n: health.at_risk || 0 })}</strong> · {health.summary || ''}
        </div>
        <button onClick={() => router.push('/intelligence')} style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid rgba(245,158,11,.3)', background: 'transparent', color: '#d97706', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {tc('logistics_alertbanner.view')}
        </button>
      </div>
    )
  }

  const top = alerts[0]
  const isCritical = top.level === 'critical'
  const color = isCritical ? '#dc2626' : '#d97706'
  const bg = isCritical ? 'rgba(239,68,68,.06)' : 'rgba(245,158,11,.06)'
  const border = isCritical ? 'rgba(239,68,68,.25)' : 'rgba(245,158,11,.25)'

  return (
    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ padding: '14px 16px', borderRadius: 13, background: bg, border: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>{isCritical ? '🚨' : '⚠️'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color }}>{top.title || tc('logistics_alertbanner.shipmentAlertFallback')}</span>
            {top.financial_impact > 0 && (
              <span style={{ fontSize: 9, fontWeight: 600, color, background: bg, border: `1px solid ${border}`, padding: '1px 7px', borderRadius: 9999 }}>
                {tc('logistics_alertbanner.financialImpact', { amount: (top.financial_impact || 0).toFixed(0) })}
              </span>
            )}
          </div>
          <button onClick={() => setDismissed(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--tx3)', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--tx2)', margin: '0 0 10px', lineHeight: 1.5 }}>{top.message || ''}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/intelligence')} style={{ padding: '7px 14px', borderRadius: 9999, border: 'none', background: color, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {tc('logistics_alertbanner.viewShipment')}
          </button>
          <button onClick={() => { router.push('/ask'); setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: tc('logistics_alertbanner.askBizPrompt', { trackingNumber: top.tracking_number }) })), 400) }}
            style={{ padding: '7px 14px', borderRadius: 9999, border: `1px solid ${border}`, background: 'transparent', color, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
            {tc('logistics_alertbanner.askAskBiz')}
          </button>
        </div>
      </div>

      {brief && (brief.delayed > 0 || brief.customs_holds > 0) && (
        <div style={{ padding: '8px 14px', borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 10, color: 'var(--tx2)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(brief.on_track || 0) > 0 && <span>✅ {tc('logistics_alertbanner.onTrack', { n: brief.on_track })}</span>}
            {(brief.delayed || 0) > 0 && <span style={{ color: '#d97706' }}>⏱ {tc('logistics_alertbanner.delayed', { n: brief.delayed })}</span>}
            {(brief.customs_holds || 0) > 0 && <span style={{ color: '#dc2626' }}>🛃 {tc('logistics_alertbanner.customsHold', { n: brief.customs_holds })}</span>}
          </div>
          <button onClick={() => router.push('/intelligence')} style={{ fontSize: 10, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {tc('logistics_alertbanner.viewAll')}
          </button>
        </div>
      )}
    </div>
  )
}
