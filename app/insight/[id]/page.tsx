import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

interface KpiCard { label: string; value: string; trend?: string; status?: string }

interface SharedInsight {
  id: string
  question: string
  answer_text: string
  insight_header?: string
  kpi_cards?: KpiCard[]
  chart_type?: string
  chart_labels?: string[]
  chart_values?: number[]
  chart_label?: string
  recommendations?: string[]
  view_count: number
  created_at: string
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('shared_insights')
    .select('question, insight_header, answer_text')
    .eq('id', params.id)
    .single()

  if (!data) return { title: 'AskBiz Insight' }

  return {
    title: `${data.insight_header || data.question} — AskBiz`,
    description: data.answer_text.slice(0, 155),
    openGraph: {
      title: data.insight_header || data.question,
      description: data.answer_text.slice(0, 155),
      type: 'article',
      siteName: 'AskBiz',
    },
    twitter: {
      card: 'summary',
      title: data.insight_header || data.question,
      description: data.answer_text.slice(0, 155),
    },
  }
}

export default async function InsightPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: insight, error } = await supabase
    .from('shared_insights')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !insight) notFound()

  // Increment views
  await supabase.rpc('increment_insight_views', { insight_id: params.id })

  const statusColor = (s?: string) =>
    s === 'good' ? '#22c55e' : s === 'warning' ? '#f59e0b' : s === 'risk' ? '#ef4444' : '#6366F1'
  const statusBg = (s?: string) =>
    s === 'good' ? 'rgba(34,197,94,.08)' : s === 'warning' ? 'rgba(245,158,11,.08)' : s === 'risk' ? 'rgba(239,68,68,.08)' : 'rgba(99,102,241,.06)'
  const trendIcon = (t?: string) => t === 'up' ? '↑' : t === 'down' ? '↓' : ''
  const trendColor = (t?: string) => t === 'up' ? '#22c55e' : t === 'down' ? '#ef4444' : '#94a3b8'

  const formattedDate = new Date(insight.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── TOP NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(248,250,252,.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-.02em' }}>
            ask<span style={{ color: '#6366F1' }}>biz</span>
          </span>
        </Link>

        <Link href="/signin" style={{
          padding: '8px 18px',
          borderRadius: 9999,
          background: '#6366F1',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity 150ms',
        }}>
          Get your own insights →
        </Link>
      </nav>

      {/* ── MAIN CARD ── */}
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Meta: date + views */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, fontSize: 12, color: '#94A3B8' }}>
          <span>📅 {formattedDate}</span>
          {insight.view_count > 1 && <span>👀 {insight.view_count.toLocaleString()} views</span>}
          <span style={{
            padding: '3px 10px',
            borderRadius: 9999,
            background: 'rgba(99,102,241,.08)',
            color: '#6366F1',
            fontWeight: 600,
            fontSize: 11,
          }}>
            AskBiz Insight
          </span>
        </div>

        {/* Question */}
        <div style={{
          padding: '20px 24px',
          borderRadius: 16,
          background: '#fff',
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,.04)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '.08em', marginBottom: 10, textTransform: 'uppercase' }}>
            Question asked
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#0F172A', lineHeight: 1.5 }}>
            {insight.question}
          </div>
        </div>

        {/* Insight header */}
        {insight.insight_header && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 14,
            background: 'rgba(99,102,241,.05)',
            border: '1px solid rgba(99,102,241,.2)',
            marginBottom: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.6 }}>
              {insight.insight_header}
            </p>
          </div>
        )}

        {/* KPI cards */}
        {insight.kpi_cards && insight.kpi_cards.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10,
            marginBottom: 16,
          }}>
            {(insight.kpi_cards as KpiCard[]).map((card, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: statusBg(card.status),
                border: `1px solid ${statusColor(card.status)}30`,
                boxShadow: '0 1px 3px rgba(0,0,0,.03)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {card.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: card.status ? statusColor(card.status) : '#0F172A', letterSpacing: '-.02em' }}>
                    {card.value}
                  </span>
                  {card.trend && (
                    <span style={{ fontSize: 13, color: trendColor(card.trend), fontWeight: 600 }}>
                      {trendIcon(card.trend)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Answer */}
        <div style={{
          padding: '20px 24px',
          borderRadius: 16,
          background: '#fff',
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          fontSize: 14,
          lineHeight: 1.75,
          color: '#334155',
          boxShadow: '0 1px 4px rgba(0,0,0,.04)',
        }}
          dangerouslySetInnerHTML={{
            __html: insight.answer_text
              .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0F172A;font-weight:600">$1</strong>')
              .replace(/\n/g, '<br/>')
          }}
        />

        {/* Recommendations */}
        {insight.recommendations && insight.recommendations.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: '#fff',
            border: '1px solid #E2E8F0',
            marginBottom: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,.04)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              🎯 Recommendations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(insight.recommendations as string[]).map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(99,102,241,.1)',
                    color: '#6366F1',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA CARD ── */}
        <div style={{
          marginTop: 32,
          padding: '28px 28px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,.3)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', opacity: 0.75, marginBottom: 10, textTransform: 'uppercase' }}>
            Powered by AskBiz
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: '-.02em', lineHeight: 1.3 }}>
            Want insights like this<br/>for your own business?
          </div>
          <div style={{ fontSize: 14, opacity: 0.82, marginBottom: 24, lineHeight: 1.6 }}>
            Upload your data and ask anything — in plain English.<br/>No spreadsheets. No jargon. Just answers.
          </div>
          <Link href="/signin" style={{
            display: 'inline-block',
            padding: '13px 32px',
            borderRadius: 9999,
            background: '#fff',
            color: '#6366F1',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,.15)',
            letterSpacing: '-.01em',
          }}>
            Try AskBiz free →
          </Link>
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 12 }}>
            Free plan available · No credit card needed
          </div>
        </div>

      </main>
    </div>
  )
}
