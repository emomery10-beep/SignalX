'use client'
import { useEffect, useState } from 'react'

interface XReply {
  tweet_author: string
  tweet_text: string
  generated_reply: string
  posted_at: string
  tweet_id: string
}

export default function XSocialProof({ limit = 6 }: { limit?: number }) {
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
    <section style={{ padding: '48px 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '5px 14px', borderRadius: 9999, background: 'rgba(29,155,240,.08)', border: '1px solid rgba(29,155,240,.2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.748-8.855L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1d9bf0' }}>Live from our community</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8 }}>
            Real answers for real business problems
          </h2>
          <p style={{ fontSize: 14, color: 'var(--tx3)', maxWidth: 480, margin: '0 auto' }}>
            We help business owners on X every day — here's what that looks like.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {replies.map((item, i) => (
            <a
              key={i}
              href={`https://x.com/i/web/status/${item.tweet_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: 18, transition: 'border-color 150ms, transform 150ms', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(29,155,240,.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--b)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
            >
              {/* Original tweet */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ev)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', flexShrink: 0 }}>
                    {item.tweet_author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)' }}>@{item.tweet_author}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--tx3)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.tweet_text}
                </p>
              </div>

              {/* Divider with reply arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--b)' }}/>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                <div style={{ flex: 1, height: 1, background: 'var(--b)' }}/>
              </div>

              {/* AskBiz reply */}
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6366F1' }}>@askbiz_co</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.55 }}>
                  {item.generated_reply}
                </p>
              </div>

              {/* Footer */}
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--tx3)' }}>
                  {item.posted_at ? new Date(item.posted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#1d9bf0', fontWeight: 500 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.748-8.855L1.254 2.25H8.08l4.261 5.636 5.903-5.636z"/></svg>
                  View on X
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="https://askbiz.co" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', borderRadius: 9999, background: '#6366F1', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sora)' }}>
            Get answers for your business →
          </a>
        </div>
      </div>
    </section>
  )
}
