import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import { resolveLocale, localePath } from '@/lib/i18n-locale'
import { t as catalogT } from '@/lib/i18n-catalog'
import { COMPARISONS, getComparison } from '@/lib/comparisons-content'

export async function generateStaticParams() {
  return COMPARISONS.map(c => ({ competitor: c.slug }))
}

export async function generateMetadata({ params }: { params: { competitor: string } }): Promise<Metadata> {
  const c = getComparison(params.competitor)
  if (!c) return { title: 'Comparison Not Found' }
  return {
    title: `${c.tagline} | AskBiz`,
    description: c.metaDescription,
    alternates: { canonical: `https://askbiz.co/vs/${c.slug}` },
    openGraph: {
      title: c.tagline,
      description: c.metaDescription,
      url: `https://askbiz.co/vs/${c.slug}`,
      type: 'website',
      siteName: 'AskBiz',
    },
  }
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'
const GREEN = '#27ae60'
const RED   = '#e74c3c'

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function renderCell(val: string | boolean, winner: boolean) {
  if (val === true)  return <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tick />{winner ? <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>✓</span> : null}</span>
  if (val === false) return <Cross />
  return <span style={{ fontSize: 13, color: TX2 }}>{val}</span>
}

export default function ComparisonPage({ params }: { params: { competitor: string } }) {
  const lang = resolveLocale({ urlLocale: headers().get('x-locale'), cookie: cookies().get('askbiz_lang')?.value })
  const c = getComparison(params.competitor)
  if (!c) notFound()

  const askbizWins = c.features.filter(f => f.winner === 'askbiz').length
  const themWins   = c.features.filter(f => f.winner === 'them').length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>

        {/* Nav */}
        <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <Link href={localePath('/', lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href={localePath('/vs', lang)} style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>{catalogT(lang, 'vs.all_comparisons')}</Link>
            <Link href={localePath('/signin', lang)} style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{catalogT(lang, 'vs.try_free')}</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ background: TX, padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,32px)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 28, color: '#a0a0a0' }}>vs</span>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: c.theirColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: 'white' }}>
              {c.competitor[0]}
            </div>
          </div>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(22px,4vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', marginBottom: 14 }}>
            {c.heroHeading}
          </h1>
          <p style={{ fontSize: 16, color: '#b0b8c8', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {c.heroSubtitle}
          </p>
          <Link href={localePath('/signin', lang)} style={{ fontSize: 14, fontWeight: 700, color: TX, background: ACC, borderRadius: 10, padding: '13px 28px', textDecoration: 'none', display: 'inline-block' }}>
            {catalogT(lang, 'vs.try_free_14')}
          </Link>
        </section>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,32px)' }}>

          {/* Score banner */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 48, background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 36, fontWeight: 700, color: ACC }}>{askbizWins}</div>
              <div style={{ fontSize: 12, color: TX3, marginTop: 2 }}>{catalogT(lang, 'vs.askbiz_wins')}</div>
            </div>
            <div style={{ fontSize: 13, color: TX3, textAlign: 'center', padding: '0 8px' }}>{catalogT(lang, 'vs.out_of_features', { n: c.features.length })}</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 36, fontWeight: 700, color: c.theirColor }}>{themWins}</div>
              <div style={{ fontSize: 12, color: TX3, marginTop: 2 }}>{catalogT(lang, 'vs.them_wins', { competitor: c.competitor })}</div>
            </div>
          </div>

          {/* Best for */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
            <div style={{ background: ACC + '10', border: `1px solid ${ACC}30`, borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{catalogT(lang, 'vs.askbiz_best_for')}</div>
              <div style={{ fontSize: 14, color: TX, lineHeight: 1.5 }}>{c.bestFor.askbiz}</div>
            </div>
            <div style={{ background: c.theirColor + '10', border: `1px solid ${c.theirColor}30`, borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.theirColor, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{catalogT(lang, 'vs.them_best_for', { competitor: c.competitor })}</div>
              <div style={{ fontSize: 14, color: TX, lineHeight: 1.5 }}>{c.bestFor.them}</div>
            </div>
          </div>

          {/* Feature comparison table */}
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>{catalogT(lang, 'vs.feature_comparison')}</h2>
          <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, overflow: 'hidden', marginBottom: 48 }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', background: BG, borderBottom: `1px solid ${BD}`, padding: '12px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{catalogT(lang, 'vs.feature')}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center' }}>{catalogT(lang, 'vs.askbiz')}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.theirColor, textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center' }}>{c.competitor}</div>
            </div>
            {c.features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 120px 120px',
                  padding: '13px 20px', alignItems: 'center',
                  borderBottom: i < c.features.length - 1 ? `1px solid ${BD}` : 'none',
                  background: f.winner === 'askbiz' ? ACC + '06' : 'transparent',
                }}
              >
                <div style={{ fontSize: 14, color: TX }}>{f.feature}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>{renderCell(f.askbiz, f.winner === 'askbiz')}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>{renderCell(f.them, f.winner === 'them')}</div>
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '28px 32px', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 12, letterSpacing: '-.02em' }}>{catalogT(lang, 'vs.the_verdict')}</h2>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.8, margin: 0 }}>{c.verdict}</p>
          </div>

          {/* FAQs */}
          {c.faqs.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>{catalogT(lang, 'vs.common_questions')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
                {c.faqs.map((faq, i) => (
                  <div key={i} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '20px 24px' }}>
                    <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 8 }}>{faq.q}</div>
                    <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <div style={{ background: TX, borderRadius: 16, padding: '36px 32px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{catalogT(lang, 'vs.cta_heading')}</h2>
            <p style={{ fontSize: 14, color: '#b0b8c8', marginBottom: 24 }}>{catalogT(lang, 'vs.cta_body')}</p>
            <Link href={localePath('/signin', lang)} style={{ fontSize: 14, fontWeight: 700, color: TX, background: ACC, borderRadius: 10, padding: '13px 28px', textDecoration: 'none', display: 'inline-block' }}>
              {catalogT(lang, 'vs.start_free_trial')}
            </Link>
          </div>

          {/* Other comparisons */}
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 14 }}>{catalogT(lang, 'vs.other_comparisons')}</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COMPARISONS.filter(x => x.slug !== c.slug).map(x => (
                <Link key={x.slug} href={localePath(`/vs/${x.slug}`, lang)} style={{ fontSize: 13, color: TX2, background: SF, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 14px', textDecoration: 'none' }}>
                  {catalogT(lang, 'vs.vs_competitor', { competitor: x.competitor })}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
          <span style={{ fontSize: 12, color: TX3 }}>{catalogT(lang, 'vs.footer_copyright')}</span>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {([['/','vs.footer_home'],['/vs','vs.footer_comparisons'],['/academy','vs.footer_academy'],['/help','vs.footer_help'],['/privacy','vs.footer_privacy']] as [string,string][]).map(([href, key]) => (
              <Link key={href} href={localePath(href, lang)} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{catalogT(lang, key)}</Link>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}
