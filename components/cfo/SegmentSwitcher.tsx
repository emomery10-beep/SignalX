'use client'

// Retail / Factory switcher for the CFO. Shown only when the account has at
// least one factory location. Same button vocabulary as PeriodSelector.

export interface CfoFactory { id: string; name: string; type: string | null }
export interface CfoSegment { key: 'all' | 'retail' | 'factory'; factoryId: string | null }

interface Props {
  value: CfoSegment
  factories: CfoFactory[]
  onChange: (s: CfoSegment) => void
}

export default function SegmentSwitcher({ value, factories, onChange }: Props) {
  if (factories.length === 0) return null

  const options: { label: string; seg: CfoSegment }[] = [
    { label: 'All', seg: { key: 'all', factoryId: null } },
    { label: 'Retail', seg: { key: 'retail', factoryId: null } },
    // One factory → a single "Factory" option; several → one per factory.
    ...(factories.length === 1
      ? [{ label: 'Factory', seg: { key: 'factory' as const, factoryId: null } }]
      : [
          { label: 'All factories', seg: { key: 'factory' as const, factoryId: null } },
          ...factories.map(f => ({ label: f.name, seg: { key: 'factory' as const, factoryId: f.id } })),
        ]),
  ]
  const active = (s: CfoSegment) => s.key === value.key && s.factoryId === value.factoryId

  return (
    <div role="group" aria-label="Business segment" style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
      {options.map(o => {
        const on = active(o.seg)
        return (
          <button
            key={o.label}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.seg)}
            style={{
              padding: '8px 12px',
              minHeight: 36,
              borderRadius: 7,
              border: on ? '1px solid #6366F1' : '1px solid var(--b)',
              background: on ? 'rgba(99,102,241,.08)' : 'transparent',
              color: on ? '#6366F1' : 'var(--tx3)',
              fontSize: 12,
              fontWeight: on ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 150ms, color 150ms, border-color 150ms',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
