'use client'
import { useState } from 'react'

interface KpiCard { label: string; value: string; trend?: string; status?: string }

interface Props {
  question: string
  result: {
    answer_text: string
    insight_header?: string
    kpi_cards?: KpiCard[]
    chart_type?: string
    chart_labels?: string[]
    chart_values?: number[]
    chart_label?: string
    recommendations?: string[]
  }
}

type State = 'idle' | 'loading' | 'copied' | 'error'

export default function ShareableInsight({ question, result }: Props) {
  const [state, setState] = useState<State>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const handleShare = async () => {
    if (shareUrl) {
      await copyToClipboard(shareUrl)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer_text: result.answer_text,
          insight_header: result.insight_header,
          kpi_cards: result.kpi_cards,
          chart_type: result.chart_type,
          chart_labels: result.chart_labels,
          chart_values: result.chart_values,
          chart_label: result.chart_label,
          recommendations: result.recommendations,
        }),
      })
      if (!res.ok) throw new Error('Share failed')
      const { url } = await res.json()
      setShareUrl(url)
      await copyToClipboard(url)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch (e) {
      setState('error')
      setTimeout(() => setState('idle'), 2500)
    }
  }

  const isGreen = state === 'copied'
  const isRed = state === 'error'

  return (
    <button
      onClick={handleShare}
      disabled={state === 'loading'}
      title={shareUrl ? `Share: ${shareUrl}` : 'Create a shareable link for this insight'}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 9999,
        border: `1px solid ${isGreen ? 'rgba(34,197,94,.3)' : isRed ? 'rgba(239,68,68,.25)' : 'var(--b2)'}`,
        background: isGreen ? 'rgba(34,197,94,.08)' : isRed ? 'rgba(239,68,68,.07)' : 'transparent',
        color: isGreen ? '#16a34a' : isRed ? '#dc2626' : 'var(--tx3)',
        fontSize: 12, fontWeight: 500,
        cursor: state === 'loading' ? 'wait' : 'pointer',
        fontFamily: 'inherit', transition: 'all 180ms', whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (state === 'idle') { const b = e.currentTarget; b.style.background='var(--ev)'; b.style.color='var(--tx)' } }}
      onMouseLeave={e => { if (state === 'idle') { const b = e.currentTarget; b.style.background='transparent'; b.style.color='var(--tx3)' } }}
    >
      {state === 'loading' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{animation:'spin 0.8s linear infinite'}}>
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      )}
      {state === 'copied' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      )}
      {(state === 'idle' || state === 'error') && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      )}
      {state === 'idle' && 'Share'}
      {state === 'loading' && 'Creating link…'}
      {state === 'copied' && 'Link copied!'}
      {state === 'error' && 'Try again'}
    </button>
  )
}

async function copyToClipboard(text: string) {
  try { await navigator.clipboard.writeText(text) }
  catch {
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
    document.body.appendChild(ta); ta.select()
    document.execCommand('copy'); document.body.removeChild(ta)
  }
}
