'use client'

import { useLang } from '@/components/LanguageProvider'

const buildPeriods = (tc: (k: string) => string) => [
  { key: 'today', label: tc('cfo_period.today') },
  { key: 'this_week', label: tc('cfo_period.thisWeek') },
  { key: 'this_month', label: tc('cfo_period.thisMonth') },
  { key: 'last_month', label: tc('cfo_period.lastMonth') },
  { key: 'this_quarter', label: tc('cfo_period.thisQuarter') },
  { key: 'ytd', label: tc('cfo_period.ytd') },
  { key: 'last_90', label: tc('cfo_period.last90Days') },
]

interface Props {
  value: string
  onChange: (key: string) => void
}

export default function PeriodSelector({ value, onChange }: Props) {
  const { tc } = useLang()
  const PERIODS = buildPeriods(tc)

  return (
    <div style={{
      display: 'flex',
      gap: 4,
      overflowX: 'auto',

      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      paddingBottom: 2,
    }}>
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
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
