import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTranslate } from '@/lib/seo-content'

export const metadata: Metadata = {
  title: 'Business & Financial Glossary in Plain English | AskBiz',
  description: 'EBITDA, working capital, burn rate, churn rate — every business and financial term explained in plain English. No jargon, no degree required.',
  alternates: { canonical: 'https://askbiz.co/translate' },
}

export default function TranslateIndex() {
  const entries = getAllTranslate()
  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', background: '#f9f8f6', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg></div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 16px', textDecoration: 'none' }}>Try free →</Link>
      </nav>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(26px,4.5vw,38px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 10 }}>Business Terms in Plain English</h1>
        <p style={{ fontSize: 16, color: '#6b6760', lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>Every piece of financial jargon your accountant, investor, or analyst uses — translated into language you can actually use to run your business.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {entries.map(e => (
            <Link key={e.slug} href={`/translate/${e.slug}`} style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e8e6e1', background: '#fff', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 14, fontWeight: 700, color: '#8c6fe0', marginBottom: 4 }}>{e.term}</div>
              <div style={{ fontSize: 13, color: '#6b6760', lineHeight: 1.6 }}>{e.shortDefinition}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
