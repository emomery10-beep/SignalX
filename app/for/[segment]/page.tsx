import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { USE_CASES, getUseCase } from '@/lib/use-cases-content'

export async function generateStaticParams() {
  return USE_CASES.map(u => ({ segment: u.slug }))
}

export async function generateMetadata({ params }: { params: { segment: string } }): Promise<Metadata> {
  const u = getUseCase(params.segment)
  if (!u) return { title: 'Not Found' }
  return {
    title: `AskBiz for ${u.title} | Business Intelligence for ${u.title}`,
    description: u.metaDescription,
    alternates: { canonical: `https://askbiz.co/for/${u.slug}` },
    openGraph: { title: u.headline, description: u.metaDescription, url: `https://askbiz.co/for/${u.slug}`, type: 'website', siteName: 'AskBiz' },
  }
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

export default function UseCasePage({ params }: { params: { segment: string } }) {
  const u = getUseCase(params.segment)
  if (!u) notFound()

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${u.color}18 0%, ${BG} 60%)`, padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,32px)', textAlign: 'center', borderBottom: `1px solid ${BD}` }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>{u.icon}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: u.color, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14 }}>AskBiz for {u.title}</div>
        <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(24px,4vw,44px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 16, maxWidth: 720, margin: '0 auto 16px' }}>
          {u.headline}
        </h1>
        <p style={{ fontSize: 17, color: TX2, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}>
          {u.subheadline}
        </p>
        <Link href="/signin" style={{ fontSize: 15, fontWeight: 700, color: SF, background: u.color, borderRadius: 10, padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
          {u.cta} →
        </Link>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(16px,4vw,32px)' }}>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18, marginBottom: 72 }}>
          {u.metrics.map((m, i) => (
            <div key={i} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '24px 22px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 32, fontWeight: 700, color: u.color, marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: TX3, lineHeight: 1.5 }}>{m.description}</div>
            </div>
          ))}
        </div>

        {/* Pain points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 72, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 20, letterSpacing: '-.02em' }}>
              Sound familiar?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {u.painPoints.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', background: SF, border: `1px solid ${BD}`, borderRadius: 10 }}>
                  <span style={{ color: '#e74c3c', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✕</span>
                  <span style={{ fontSize: 14, color: TX2, lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 20, letterSpacing: '-.02em' }}>
              AskBiz fixes this
            </h2>
            <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '24px', lineHeight: 1.8 }}>
              <p style={{ fontSize: 14, color: TX2, margin: '0 0 16px' }}>{u.description}</p>
              <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: u.color, borderRadius: 8, padding: '9px 20px', textDecoration: 'none', display: 'inline-block' }}>
                Try free for 14 days →
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 28, letterSpacing: '-.02em', textAlign: 'center' }}>
            Everything you need, nothing you don&apos;t
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {u.features.map((f, i) => (
              <div key={i} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '22px 20px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 8 }}>{f.title}</div>
                <p style={{ fontSize: 13, color: TX2, lineHeight: 1.6, margin: 0 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ background: u.color + '10', border: `1px solid ${u.color}30`, borderRadius: 16, padding: '32px 36px', marginBottom: 72, textAlign: 'center' }}>
          <div style={{ fontSize: 36, color: u.color, marginBottom: 16, opacity: 0.4 }}>"</div>
          <p style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 600, color: TX, lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic', maxWidth: 600, margin: '0 auto 20px' }}>
            {u.testimonialQuote}
          </p>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX }}>{u.testimonialName}</div>
          <div style={{ fontSize: 12, color: TX3, marginTop: 3 }}>{u.testimonialRole}</div>
        </div>

        {/* CTA */}
        <div style={{ background: TX, borderRadius: 16, padding: '40px 32px', textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-.02em' }}>
            Start your free trial today
          </h2>
          <p style={{ fontSize: 15, color: '#b0b8c8', marginBottom: 28, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Connect your first data source in under 10 minutes. No credit card required. No dashboards to build.
          </p>
          <Link href="/signin" style={{ fontSize: 15, fontWeight: 700, color: TX, background: ACC, borderRadius: 10, padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
            {u.cta} →
          </Link>
        </div>

        {/* Other use cases */}
        <div>
          <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 14 }}>AskBiz also works for</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {USE_CASES.filter(x => x.slug !== u.slug).map(x => (
              <Link key={x.slug} href={`/for/${x.slug}`} style={{ fontSize: 13, color: TX2, background: SF, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 14px', textDecoration: 'none' }}>
                {x.icon} {x.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz Ltd.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'Home'], ['/academy', 'Academy'], ['/help', 'Help'], ['/vs', 'Comparisons'], ['/privacy', 'Privacy']] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
