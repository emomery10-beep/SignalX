import Link from 'next/link'
import type { Metadata } from 'next'

export interface SeoPageProps {
  h1: string
  subheading: string
  keyword: string
  intro: string
  problem: { heading: string; body: string }
  solution: { heading: string; body: string }
  features: { icon: string; title: string; body: string }[]
  howItWorks: { step: string; title: string; body: string }[]
  faqs: { q: string; a: string }[]
  cta: { heading: string; body: string }
  relatedPages?: { href: string; label: string }[]
}

export default function SeoPage({
  h1, subheading, keyword, intro, problem, solution,
  features, howItWorks, faqs, cta, relatedPages
}: SeoPageProps) {
  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', color: '#1a1916', background: '#f9f8f6' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/signin" style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none', padding: '7px 14px' }}>Sign in</Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,24px) clamp(40px,6vw,64px)', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: '#d08a59', background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 9999, padding: '4px 14px', marginBottom: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>
          {keyword}
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(26px,5vw,44px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 18, color: '#1a1916' }}>
          {h1}
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#6b6760', lineHeight: 1.7, marginBottom: 32, maxWidth: 580, margin: '0 auto 32px' }}>
          {subheading}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signin" style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}>
            Start free — no card needed →
          </Link>
          <Link href="/" style={{ fontSize: 15, color: '#6b6760', borderRadius: 9999, padding: '12px 22px', textDecoration: 'none', border: '1px solid #e8e6e1', background: '#fff', display: 'inline-block' }}>
            See how it works
          </Link>
        </div>
        <p style={{ fontSize: 12, color: '#a39e97', marginTop: 14 }}>10 free questions every month. No credit card required.</p>
      </section>

      {/* Intro paragraph — keyword-rich */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(16px,4vw,24px) clamp(40px,6vw,64px)' }}>
        <p style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844' }}>{intro}</p>
      </section>

      {/* Problem */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 16, color: '#1a1916' }}>
            {problem.heading}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844' }}>{problem.body}</p>
        </div>
      </section>

      {/* Solution */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 16, color: '#1a1916' }}>
          {solution.heading}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844' }}>{solution.body}</p>
      </section>

      {/* Features grid */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8, textAlign: 'center', color: '#1a1916' }}>
            Everything you need. Nothing you don't.
          </h2>
          <p style={{ fontSize: 15, color: '#6b6760', textAlign: 'center', marginBottom: 40, lineHeight: 1.6 }}>Built for business owners, not data scientists.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '20px 22px', borderRadius: 16, border: '1px solid #e8e6e1', background: '#f9f8f6' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1a1916' }}>{f.title}</div>
                <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 36, color: '#1a1916' }}>
          How it works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {howItWorks.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#d08a59', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sora, system-ui)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 16, fontWeight: 600, marginBottom: 4, color: '#1a1916' }}>{s.title}</div>
                <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.65, margin: 0 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — structured data friendly */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 32, color: '#1a1916' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }} itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #e8e6e1' : 'none', padding: '20px 0' }}
                itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1a1916' }} itemProp="name">{faq.q}</div>
                <div style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.7 }} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <span itemProp="text">{faq.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,24px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 14, color: '#1a1916' }}>{cta.heading}</h2>
        <p style={{ fontSize: 16, color: '#6b6760', lineHeight: 1.7, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>{cta.body}</p>
        <Link href="/signin" style={{ fontSize: 16, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '14px 36px', textDecoration: 'none', display: 'inline-block' }}>
          Start free — no card needed →
        </Link>
        <p style={{ fontSize: 12, color: '#a39e97', marginTop: 14 }}>10 free questions every month. Upgrade when you're ready. Cancel anytime.</p>
      </section>

      {/* Related pages */}
      {relatedPages && relatedPages.length > 0 && (
        <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', padding: 'clamp(32px,5vw,48px) clamp(16px,4vw,24px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Related guides</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {relatedPages.map((p, i) => (
                <Link key={i} href={p.href} style={{ fontSize: 13, color: '#d08a59', textDecoration: 'none', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(208,138,89,.3)', background: 'rgba(208,138,89,.05)' }}>
                  {p.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700 }}>AskBiz</span>
          <span style={{ fontSize: 12, color: '#a39e97', marginLeft: 8 }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['/', 'Home'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['mailto:hello@askbiz.co', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AskBiz",
        "applicationCategory": "BusinessApplication",
        "description": "AI-powered business intelligence tool for small business owners. Upload your sales data and ask questions in plain English.",
        "url": "https://askbiz.co",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GBP",
          "description": "Free plan available. Growth from £19/month."
        },
        "operatingSystem": "Web browser"
      })}}/>

    </div>
  )
}
