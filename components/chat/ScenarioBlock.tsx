'use client'
import { useLang } from '@/components/LanguageProvider'

interface ScenarioItem { label: string; value: string }

interface Props {
  before: ScenarioItem[]
  after: ScenarioItem[]
  summary: string | null | undefined
  verdict: 'act' | 'watch' | 'problem' | null | undefined
}

function buildVerdictStyle(tc: (k: string) => string) {
  return {
    act:     { color: '#16a34a', bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.2)', label: tc('chat_scenarioblock.verdictAct') },
    watch:   { color: '#d97706', bg: 'rgba(245,158,11,.07)', border: 'rgba(245,158,11,.2)', label: tc('chat_scenarioblock.verdictWatch') },
    problem: { color: '#dc2626', bg: 'rgba(239,68,68,.07)', border: 'rgba(239,68,68,.2)', label: tc('chat_scenarioblock.verdictProblem') },
  }
}

export default function ScenarioBlock({ before, after, summary, verdict }: Props) {
  const { tc } = useLang()
  if (!before?.length || !after?.length) return null

  const verdictStyle = buildVerdictStyle(tc)
  const vs = verdict ? verdictStyle[verdict] : verdictStyle.watch

  return (
    <div style={{
      borderRadius: 14,
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
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          {tc('chat_scenarioblock.headerLabel')}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 600,
          color: vs.color, background: vs.bg,
          padding: '3px 9px', borderRadius: 9999,
          border: `1px solid ${vs.border}`,
        }}>
          {vs.label}
        </span>
      </div>

      {/* Before / After grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Before */}
        <div style={{ padding: '14px', borderRight: '1px solid var(--b)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', letterSpacing: '.08em', marginBottom: 10, textTransform: 'uppercase' }}>
            {tc('chat_scenarioblock.columnCurrent')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {before.map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.02em' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* After */}
        <div style={{ padding: '14px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', letterSpacing: '.08em', marginBottom: 10, textTransform: 'uppercase' }}>
            {tc('chat_scenarioblock.columnAfter')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {after.map((item, i) => {
              const beforeVal = before[i]?.value || ''
              const changed = item.value !== beforeVal
              return (
                <div key={i}>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{
                      fontSize: 14, fontWeight: 700, letterSpacing: '-.02em',
                      color: changed ? '#6366F1' : 'var(--tx)',
                    }}>
                      {item.value}
                    </span>
                    {changed && (
                      <span style={{ fontSize: 9, color: '#6366F1', opacity: 0.7 }}>
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
          fontSize: 11,
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
