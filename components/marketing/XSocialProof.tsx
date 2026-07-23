'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface XReply {
  tweet_author: string
  tweet_text: string
  generated_reply: string
  posted_at: string
  tweet_id: string
}

const M = { bg: '#ffffff', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8', card: '#fff' }

export default function XSocialProof({ limit = 6 }: { limit?: number }) {
  const { tc } = useLang()
  const [replies, setReplies] = useState<XReply[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/xagent?action=social_proof&limit=${limit}`)
      .then(r => r.json())
      .then(d => setReplies(d.replies || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) return null
  if (!replies.length) return null

  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }} data-reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '5px 14px', borderRadius: 9999, background: 'rgba(29,155,240,.08)', border: '1px solid rgba(29,155,240,.2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.748-8.855L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#1d9bf0' }}>{tc('marketing_xproof.liveBadge')}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, letterSpacing: '-.02em', color: M.tx, marginBottom: 8 }}>
            {tc('marketing_xproof.heading')}
          </h2>
          <p style={{ fontSize: 12, color: M.tx3, maxWidth: 480, margin: '0 auto' }}>
            {tc('marketing_xproof.subheading')}
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }} data-reveal data-reveal-delay="1">
          {replies.map((item, i) => (
            <a
              key={i}
              href={`https://x.com/i/web/status/${item.tweet_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="x-card"
              style={{ display: 'block', textDecoration: 'none', borderRadius: 14, border: `1px solid ${M.bd}`, background: M.card, padding: 18, cursor: 'pointer' }}
            >
              {/* Original tweet */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: M.bd, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: M.tx3, flexShrink: 0 }}>
                    {item.tweet_author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: M.tx2 }}>@{item.tweet_author}</span>
                </div>
                <p style={{ fontSize: 10, color: M.tx3, margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.tweet_text}
                </p>
              </div>

              {/* Divider with reply arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 1, background: M.bd }}/>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={M.tx3} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                <div style={{ flex: 1, height: 1, background: M.bd }}/>
              </div>

              {/* AskBiz reply */}
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#6366F1' }}>@askbiz_co</span>
                </div>
                <p style={{ fontSize: 11, color: M.tx, margin: 0, lineHeight: 1.55 }}>
                  {item.generated_reply}
                </p>
              </div>

              {/* Footer */}
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: M.tx3 }}>
                  {item.posted_at ? new Date(item.posted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#1d9bf0', fontWeight: 500 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.748-8.855L1.254 2.25H8.08l4.261 5.636 5.903-5.636z"/></svg>
                  {tc('marketing_xproof.viewOnX')}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 32 }} data-reveal>
          <a href="https://askbiz.co" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', borderRadius: 9999, background: '#6366F1', color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            {tc('marketing_xproof.ctaButton')}
          </a>
        </div>
      </div>

      <style>{`
        .x-card{transition:border-color 200ms cubic-bezier(0.22,1,0.36,1),transform 200ms cubic-bezier(0.22,1,0.36,1)}
        .x-card:hover{border-color:rgba(29,155,240,.4);transform:translateY(-2px)}
        .x-card:focus-visible{border-color:rgba(29,155,240,.4);transform:translateY(-2px);outline:2px solid #1d9bf0;outline-offset:2px}
      `}</style>
    </section>
  )
}
