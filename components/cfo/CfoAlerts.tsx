'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Alert {
  type: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  tab?: string
}

interface Props {
  alerts: Alert[]
  onNavigate?: (tab: string) => void
}

const SEVERITY_STYLE: Record<string, { bg: string; border: string; icon: string; color: string }> = {
  critical: { bg: 'rgba(239,68,68,.05)', border: 'rgba(239,68,68,.2)', icon: '🔴', color: '#EF4444' },
  warning: { bg: 'rgba(245,158,11,.05)', border: 'rgba(245,158,11,.2)', icon: '🟡', color: '#F59E0B' },
  info: { bg: 'rgba(99,102,241,.05)', border: 'rgba(99,102,241,.15)', icon: '🔵', color: '#6366F1' },
}

export default function CfoAlerts({ alerts, onNavigate }: Props) {
  const { tc } = useLang()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = alerts.filter(a => !dismissed.has(a.type))
  if (!visible.length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {visible.map(alert => {
        const s = SEVERITY_STYLE[alert.severity] || SEVERITY_STYLE.info
        return (
          <div
            key={alert.type}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderRadius: 10,
              background: s.bg, border: `1px solid ${s.border}`,
            }}
          >
            <span style={{ fontSize: 12, flexShrink: 0 }}>{s.icon}</span>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--tx)', fontWeight: 500 }}>
              {alert.message}
            </span>
            {alert.tab && onNavigate && (
              <button
                onClick={() => onNavigate(alert.tab!)}
                style={{
                  fontSize: 10, fontWeight: 600, color: '#6366F1',
                  background: 'rgba(99,102,241,.08)', border: 'none',
                  borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}
              >
                {tc('cfo_alerts.viewDetails')}
              </button>
            )}
            <button
              onClick={() => setDismissed(prev => new Set(prev).add(alert.type))}
              style={{
                fontSize: 14, color: 'var(--tx3)', background: 'transparent',
                border: 'none', cursor: 'pointer', padding: '0 2px',
                lineHeight: 1, fontFamily: 'inherit',
              }}
              title={tc('cfo_alerts.dismiss')}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
