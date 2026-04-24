'use client'
import { useEffect, useState } from 'react'

interface Anomaly {
  id: string
  type: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  body: string
  product?: string
  prompt?: string
  created_at: string
  seen: boolean
}

interface Props {
  anomalies: Anomaly[]
  onAsk?: (prompt: string) => void
  onDismiss?: (id: string) => void
  compact?: boolean
}

const SEV = {
  critical: { bg: 'rgba(239,68,68,.08)', border: 'rgba(239,68,68,.2)', dot: '#EF4444', label: 'CRITICAL', labelColor: '#dc2626' },
  warning:  { bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.2)', dot: '#F59E0B', label: 'WARNING',  labelColor: '#d97706' },
  info:     { bg: 'rgba(99,102,241,.06)', border: 'rgba(99,102,241,.15)', dot: '#6366F1', label: 'INFO',    labelColor: '#6366F1' },
}

const TYPE_ICON: Record<string, string> = {
  stockout_risk: '📦',
  margin_drop: '📉',
  velocity_spike: '📊',
  cost_increase: '💸',
  revenue_anomaly: '⚠️',
}

export default function AnomalyFeed({ anomalies, onAsk, onDismiss, compact = false }: Props) {
  if (!anomalies.length) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
        No alerts right now — everything looks normal.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {anomalies.map((a, i) => {
        const s = SEV[a.severity]
        const icon = TYPE_ICON[a.type] || '⚡'

        return (
          <div key={a.id || i}
            className="animate-fade-up"
            style={{
              animationDelay: `${i * 0.06}s`,
              padding: compact ? '10px 12px' : '12px 14px',
              borderRadius: 12,
              border: `1px solid ${s.border}`,
              background: s.bg,
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {/* Severity dot */}
              <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0, marginTop: 4 }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%', background: s.dot,
                  ...(a.severity === 'critical' ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}),
                }}/>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.labelColor, letterSpacing: '.08em' }}>{icon} {s.label}</span>
                  {a.product && <span style={{ fontSize: 11, color: 'var(--tx3)', background: 'var(--ev)', borderRadius: 4, padding: '1px 6px' }}>{a.product}</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>{a.title}</div>
                {!compact && <p style={{ fontSize: 12, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>{a.body}</p>}
              </div>
            </div>

            {!compact && (a.prompt || onDismiss) && (
              <div style={{ display: 'flex', gap: 7, marginTop: 10, paddingLeft: 18 }}>
                {a.prompt && onAsk && (
                  <button
                    onClick={() => onAsk(a.prompt!)}
                    style={{ fontSize: 11, fontWeight: 600, color: s.labelColor, background: 'transparent', border: `1px solid ${s.border}`, borderRadius: 9999, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Ask AskBiz about this →
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(a.id)}
                    style={{ fontSize: 11, color: 'var(--tx3)', background: 'transparent', border: '1px solid var(--b)', borderRadius: 9999, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Dismiss
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
