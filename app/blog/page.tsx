import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, CLUSTERS } from '@/lib/blog-content'

export const metadata: Metadata = {
  title: 'Business Intelligence Blog | AskBiz',
  description: 'Practical guides on AI-powered business intelligence, strategic planning, data analysis, and growth for SME owners and founders.',
  alternates: { canonical: 'https://askbiz.co/blog' },
}

const C: Record<string, { bg: string; text: string; border: string }> = {
  'AI Chief of Staff':  { bg: 'rgba(146,104,248,.08)', text: '#9268f8', border: 'rgba(146,104,248,.25)' },
  'Data Translator':    { bg: 'rgba(30,212,202,.08)',  text: '#1ed4ca', border: 'rgba(30,212,202,.25)' },
  'Startup Growth':     { bg: 'rgba(208,138,89,.08)',  text: '#d08a59', border: 'rgba(208,138,89,.25)' },
  'Efficiency & Tools': { bg: 'rgba(82,128,204,.08)',  text: '#5280cc', border: 'rgba(82,128,204,.25)' },
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', background: '#f9f8f6', minHeight: '100vh' }}>

      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 12, color: '#1a1916' }}>
            Business Intelligence for SME Owners
          </h1>
          <p style={{ fontSize: 17, color: '#6b6760', lineHeight: 1.7, maxWidth: 580 }}>
            Practical guides on using AI to run a smarter business — strategic planning, data analysis, forecasting, and growth.
          </p>
        </div>

        {CLUSTERS.map(cluster => {
          const clusterPosts = posts.filter(p => p.cluster === cluster)
          const c = C[cluster] || C['AI Chief of Staff']
          return (
            <div key={cluster} style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 9999, padding: '3px 12px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  {cluster}
                </span>
                <div style={{ flex: 1, height: 1, background: '#e8e6e1' }}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {clusterPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: '20px 22px', borderRadius: 16, border: '1px solid #e8e6e1', background: '#fff' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: c.text, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                      {post.pillar} · {post.readTime} min
                    </div>
                    <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 600, lineHeight: 1.4, color: '#1a1916', marginBottom: 8, flex: 1 }}>
                      {post.title}
                    </div>
                    <p style={{ fontSize: 13, color: '#6b6760', lineHeight: 1.6, margin: '0 0 12px' }}>
                      {post.tldr.slice(0, 110)}{post.tldr.length > 110 ? '…' : ''}
                    </p>
                    <div style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>Read more →</div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,32px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#fff' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700, color: '#1a1916' }}>AskBiz © 2026</span>
        </Link>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/privacy', 'Privacy']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
