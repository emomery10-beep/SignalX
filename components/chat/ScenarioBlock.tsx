'use client'
import { useLang } from '@/components/LanguageProvider'

interface ScenarioItem { label: string; value: string }

interface Props {
  before: ScenarioItem[]
  after: ScenarioItem[]
  summary: string | null | undefined
  verdict: 'act' | 'watch' | 'problem' | null | undefined
  modeActive?: boolean
}

function buildVerdictStyle(tc: (k: string) => string) {
  return {
    act:     { color: '#16a34a', bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.2)', label: tc('chat_scenarioblock.verdictAct') },
    watch:   { color: '#d97706', bg: 'rgba(245,158,11,.07)', border: 'rgba(245,158,11,.2)', label: tc('chat_scenarioblock.verdictWatch') },
    problem: { color: '#dc2626', bg: 'rgba(239,68,68,.07)', border: 'rgba(239,68,68,.2)', label: tc('chat_scenarioblock.verdictProblem') },
  }
}

export default function ScenarioBlock({ before, after, summary, verdict, modeActive }: Props) {
  const { tc } = useLang()

  if (!before?.length || !after?.length) {
    if (!modeActive) return null

    return (
      <div style={{
        borderRadius: 16,
        border: '1px solid var(--b)',
        overflow: 'hidden',
        marginBottom: 14,
        padding: '14px',
      }}>
        <div style={{ fontSize: 'var(--fs-md)', color: 'var(--tx3)', lineHeight: 1.5 }}>
          {tc('chat_scenarioblock.noScenarioMessage')}
        </div>
      </div>
    )
  }

  const verdictStyle = buildVerdictStyle(tc)
  const vs = verdict ? verdictStyle[verdict] : verdictStyle.watch

  return (
    <div style={{
      borderRadius: 16,
      border: '1px solid var(--b)',
      overflow: 'hidden',
      marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        background: 'var(--ev)',
        borderBottom: '1px solid var(--b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--tx3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          {tc('chat_scenarioblock.headerLabel')}
        </span>
        <span style={{
          fontSize: 'var(--fs-xs)', fontWeight: 600,
          color: vs.color, background: vs.bg,
          padding: '3px 9px', borderRadius: 9999,
          border: `1px solid ${vs.border}`,
        }}>
          {vs.label}
        </span>
      </div>

      {/* Before / After grid */}
      <div className="scenario-block-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Before */}
        <div className="scenario-block-before" style={{ padding: '14px', borderRight: '1px solid var(--b)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--tx3)', letterSpacing: '.08em', marginBottom: 10, textTransform: 'uppercase' }}>
            {tc('chat_scenarioblock.columnCurrent')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {before.map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx3)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.02em' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* After */}
        <div style={{ padding: '14px' }}>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: '#6366F1', letterSpacing: '.08em', marginBottom: 10, textTransform: 'uppercase' }}>
            {tc('chat_scenarioblock.columnAfter')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {after.map((item, i) => {
              const beforeVal = before[i]?.value || ''
              const changed = item.value !== beforeVal
              return (
                <div key={i}>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx3)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{
                      fontSize: 'var(--fs-lg)', fontWeight: 700, letterSpacing: '-.02em',
                      color: changed ? '#6366F1' : 'var(--tx)',
                    }}>
                      {item.value}
                    </span>
                    {changed && (
                      <span style={{ fontSize: 'var(--fs-xs)', color: '#6366F1', opacity: 0.7 }}>
                        {tc('chat_scenarioblock.wasBadge', { value: beforeVal })}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--b)',
          fontSize: 'var(--fs-md)',
          color: 'var(--tx2)',
          lineHeight: 1.5,
          background: 'var(--sf)',
        }}>
          {summary}
        </div>
      )}
    </div>
  )
}
