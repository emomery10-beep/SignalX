'use client'
import { useEffect, useState } from 'react'
import type { AIResult } from '@/lib/ai'

interface Props {
  lastResult: AIResult | null
  onAsk: (q: string) => void
  hasData: boolean
}

interface Signal {
  text: string
  query: string
  level: 'good' | 'warning' | 'risk' | 'neutral'
}

// Derive a Pulse signal from the last AI result
function deriveSignal(result: AIResult): Signal | null {
  if (!result) return null

  const verdict = result.verdict
  const sentence = result.verdict_sentence

  if (verdict === 'problem' && sentence) {
    return {
      text: sentence,
      query: 'Tell me more about this problem and what I should do right now.',
      level: 'risk',
    }
  }

  if (verdict === 'act' && sentence) {
    return {
      text: sentence,
      query: 'Walk me through exactly how to do this step by step.',
      level: 'good',
    }
  }

  if (verdict === 'watch' && sentence) {
    return {
      text: sentence,
      query: 'What should I be watching for over the next 7 days?',
      level: 'warning',
    }
  }

  // Fallback: derive from KPI cards
  const riskCard = result.kpi_cards?.find(c => c.status === 'risk')
  if (riskCard) {
    return {
      text: `${riskCard.label} is at ${riskCard.value} — this needs attention.`,
      query: `Tell me more about ${riskCard.label} and what I should do.`,
      level: 'risk',
    }
  }

  const goodCard = result.kpi_cards?.find(c => c.status === 'good')
  if (goodCard) {
    return {
      text: `${goodCard.label} is looking good at ${goodCard.value}.`,
      query: `How can I build on this momentum with ${goodCard.label}?`,
      level: 'good',
    }
  }

  return null
}

const LEVEL_STYLE = {
  good:    { dot: '#22C55E', text: 'var(--tx2)', border: 'rgba(34,197,94,.2)', bg: 'rgba(34,197,94,.04)' },
  warning: { dot: '#F59E0B', text: 'var(--tx2)', border: 'rgba(245,158,11,.2)', bg: 'rgba(245,158,11,.04)' },
  risk:    { dot: '#EF4444', text: 'var(--tx2)', border: 'rgba(239,68,68,.2)', bg: 'rgba(239,68,68,.04)' },
  neutral: { dot: '#94A3B8', text: 'var(--tx3)', border: 'var(--b)', bg: 'transparent' },
}

const DEFAULT_SIGNALS: Signal[] = [
  { text: 'What should I focus on in my business today?', query: 'What should I focus on in my business today to make the most money?', level: 'neutral' },
  { text: 'Am I pricing my products correctly for my market?', query: 'Are my prices competitive for my market right now?', level: 'neutral' },
  { text: 'Which part of my business needs the most attention?', query: 'Which part of my business needs the most attention right now?', level: 'neutral' },
]

export default function PulseBar({ lastResult, onAsk, hasData }: Props) {
  const [signal, setSignal] = useState<Signal | null>(null)
  const [defaultIdx, setDefaultIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (lastResult) {
      const s = deriveSignal(lastResult as AIResult)
      if (s) setSignal(s)
    }
  }, [lastResult])

  // Cycle default signals when no data
  useEffect(() => {
    if (signal || hasData) return
    const t = setInterval(() => setDefaultIdx(i => (i + 1) % DEFAULT_SIGNALS.length), 6000)
    return () => clearInterval(t)
  }, [signal, hasData])

  const active = signal || DEFAULT_SIGNALS[defaultIdx]
  const style = LEVEL_STYLE[active.level]

  if (!visible) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px 14px',
        marginBottom: 8,
        borderRadius: 10,
        border: `1px solid ${style.border}`,
        background: style.bg,
        cursor: 'pointer',
        transition: 'all 160ms',
        maxWidth: 680,
        margin: '0 auto 8px',
      }}
      onClick={() => onAsk(active.query)}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '.85' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
      title="Click to ask about this"
    >
      {/* Live dot */}
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: style.dot,
        flexShrink: 0,
        animation: active.level !== 'neutral' ? 'pulse 2s ease-in-out infinite' : 'none',
      }}></span>

      {/* Signal text */}
      <span style={{
        fontSize: 12,
        color: style.text,
        flex: 1,
        lineHeight: 1.4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {active.text}
      </span>

      {/* Arrow */}
      <span style={{ fontSize: 11, color: 'var(--tx3)', flexShrink: 0, opacity: 0.6 }}>→</span>

      {/* Dismiss */}
      {signal && (
        <button
          onClick={e => { e.stopPropagation(); setSignal(null); setVisible(false); setTimeout(() => setVisible(true), 30000) }}
          style={{
            width: 16, height: 16, borderRadius: '50%',
            border: 'none', background: 'transparent',
            color: 'var(--tx3)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, flexShrink: 0, padding: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
