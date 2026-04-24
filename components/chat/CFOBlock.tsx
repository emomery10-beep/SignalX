'use client'

interface CfoMetric {
  label: string
  value: string
  change: string
  direction: 'up' | 'down' | 'flat'
}

interface Props {
  summary: string | null | undefined
  metrics: CfoMetric[] | null | undefined
  onExportPdf?: () => void
}

const dirStyle = {
  up:   { color: '#16a34a', icon: '▲' },
  down: { color: '#dc2626', icon: '▼' },
  flat: { color: '#94a3b8', icon: '–' },
}

export default function CFOBlock({ summary, metrics, onExportPdf }: Props) {
  if (!summary && !metrics?.length) return null

  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid rgba(99,102,241,.25)',
      background: 'rgba(99,102,241,.03)',
      overflow: 'hidden',
      marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid rgba(99,102,241,.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            CFO Summary
          </span>
        </div>
        {onExportPdf && (
          <button
            onClick={onExportPdf}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 7,
              border: '1px solid rgba(99,102,241,.25)',
              background: 'transparent', color: '#6366F1',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Export PDF
          </button>
        )}
      </div>

      {/* Executive summary */}
      {summary && (
        <div style={{
          padding: '14px',
          fontSize: 13,
          color: 'var(--tx)',
          lineHeight: 1.65,
          fontStyle: 'normal',
          borderBottom: metrics?.length ? '1px solid rgba(99,102,241,.1)' : 'none',
        }}>
          {summary}
        </div>
      )}

      {/* Metrics grid */}
      {metrics && metrics.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 1,
          background: 'rgba(99,102,241,.08)',
        }}>
          {metrics.map((m, i) => {
            const ds = dirStyle[m.direction] || dirStyle.flat
            return (
              <div key={i} style={{
                padding: '12px 14px',
                background: 'var(--sf)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx)', letterSpacing: '-.02em', marginBottom: 3 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: ds.color, fontWeight: 600 }}>
                  {ds.icon} {m.change}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
