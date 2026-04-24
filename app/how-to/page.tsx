import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllHowTo } from '@/lib/seo-content'

export const metadata: Metadata = {
  title: 'Business How-To Guides | AskBiz',
  description: 'Step-by-step guides to calculating profit margins, inventory turnover, break-even points, cash flow forecasts, and more — with worked examples and AskBiz automation.',
  alternates: { canonical: 'https://askbiz.co/how-to' },
}

export default function HowToIndex() {
  const entries = getAllHowTo()
  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', background: '#f9f8f6', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background:'#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 16px', textDecoration: 'none' }}>Try free →</Link>
      </nav>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(26px,4.5vw,38px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 10 }}>Business How-To Guides</h1>
        <p style={{ fontSize: 16, color: '#6b6760', lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>Step-by-step guides to the calculations every business owner needs to know — with plain English explanations and AskBiz automation.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {entries.map(e => (
            <Link key={e.slug} href={`/how-to/${e.slug}`} style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e8e6e1', background: '#fff', textDecoration: 'none', display: 'block', transition: 'border-color 150ms' }}>
              <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 14, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>{e.title}</div>
              <div style={{ fontSize: 13, color: '#6b6760', lineHeight: 1.6 }}>{e.shortDefinition}</div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 48, padding: '24px', borderRadius: 16, background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.2)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Skip the manual calculation</div>
          <p style={{ fontSize: 14, color: '#6b6760', marginBottom: 16 }}>Upload your data and ask AskBiz to calculate any of these automatically.</p>
          <Link href="/signin" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '10px 24px', textDecoration: 'none', display: 'inline-block' }}>Try free →</Link>
        </div>
      </div>
    </div>
  )
}
