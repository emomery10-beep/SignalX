'use client'

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This Week' },
  { key: 'this_month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'this_quarter', label: 'This Quarter' },
  { key: 'ytd', label: 'YTD' },
  { key: 'last_90', label: 'Last 90 Days' },
] as const

interface Props {
  value: string
  onChange: (key: string) => void
}

export default function PeriodSelector({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {PERIODS.map(p => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          style={{
            padding: '5px 10px',
            borderRadius: 7,
            border: value === p.key ? '1px solid #6366F1' : '1px solid var(--b)',
            background: value === p.key ? 'rgba(99,102,241,.08)' : 'transparent',
            color: value === p.key ? '#6366F1' : 'var(--tx3)',
            fontSize: 11,
            fontWeight: value === p.key ? 600 : 400,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 120ms',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
