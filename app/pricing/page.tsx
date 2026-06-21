import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale, getT } from '@/lib/i18n-server'
import { localePath } from '@/lib/i18n-locale'

export async function generateMetadata(): Promise<Metadata> {
  const t = getT()
  const locale = getLocale()
  return {
    title: t('pricing.meta_title'),
    description: t('pricing.meta_description'),
    alternates: { canonical: `https://askbiz.co${localePath('/pricing', locale)}` },
  }
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'
const GREEN = '#16a34a'

type T = (key: string, vars?: Record<string, string | number>) => string

const buildPlans = (t: T) => [
  {
    name: t('pricing.plan_free_name'), label: t('pricing.plan_free_label'),
    description: t('pricing.plan_free_desc'), primary: false,
    features: [0, 1, 2, 3, 4, 5].map(i => t('pricing.plan_free_feat_' + i)),
    cta: t('pricing.plan_free_cta'), ctaHref: '/signin', note: t('pricing.plan_free_note'),
  },
  {
    name: t('pricing.plan_growth_name'), label: t('pricing.plan_growth_label'),
    description: t('pricing.plan_growth_desc'), primary: true,
    features: [0, 1, 2, 3, 4, 5, 6, 7].map(i => t('pricing.plan_growth_feat_' + i)),
    cta: t('pricing.plan_growth_cta'), ctaHref: '/signin', note: t('pricing.plan_growth_note'),
  },
  {
    name: t('pricing.plan_business_name'), label: t('pricing.plan_business_label'),
    description: t('pricing.plan_business_desc'), primary: false,
    features: [0, 1, 2, 3, 4, 5, 6, 7].map(i => t('pricing.plan_business_feat_' + i)),
    cta: t('pricing.plan_business_cta'), ctaHref: '/signin', note: t('pricing.plan_business_note'),
  },
]

const buildFaqs = (t: T) =>
  [0, 1, 2, 3, 4, 5, 6].map(i => ({ q: t('pricing.faq_' + i + '_q'), a: t('pricing.faq_' + i + '_a') }))

const JSON_LD_SOFTWARE: object = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AskBiz',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://askbiz.co',
  description: 'AI business intelligence platform for SME founders. Ask questions about your revenue, margins, stock, and forecasts in plain English.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'GBP', description: '10 questions per month, CSV/Excel uploads, Business Pulse score.' },
    { '@type': 'Offer', name: 'Growth', price: '19', priceCurrency: 'GBP', description: 'Unlimited questions, all AI tools pre-filled from your data, Daily Brief, social commerce, churn intelligence.' },
    { '@type': 'Offer', name: 'Business', price: '39', priceCurrency: 'GBP', description: 'Team seats, Decision Memory, Competitor Watch, CFO Mode with board-ready reports, priority support.' },
  ],
  publisher: { '@type': 'Organization', name: 'AskBiz', url: 'https://askbiz.co' },
}

export default function PricingPage() {
  const locale = getLocale()
  const t = getT()
  const PLANS = buildPlans(t)
  const FAQS = buildFaqs(t)
  const JSON_LD_FAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SOFTWARE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FAQ) }} />
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .pricing-plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; align-items: start; }
        @media (max-width: 720px) { .pricing-plans { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) and (min-width: 721px) { .pricing-plans { grid-template-columns: 1fr 1fr !important; } }
        .pos-addon { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
        @media (max-width: 640px) { .pos-addon { grid-template-columns: 1fr !important; } }
      `}</style>

      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,32px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
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
        <Link href={localePath('/signin', locale)} style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{t('pricing.try_free')} →</Link>
      </nav>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,32px)' }}>

        {/* ── Header — left-aligned, no centered AI template ── */}
        <div style={{ maxWidth: 560, marginBottom: 52 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>{t('pricing.eyebrow')}</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14, lineHeight: 1.08 }}>
            {t('pricing.h1_line1')}<br/>{t('pricing.h1_line2')}
          </h1>
          <p style={{ fontSize: 15, color: TX2, lineHeight: 1.7, marginBottom: 10 }}>
            {t('pricing.subtitle')}
          </p>
          <p style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ {t('pricing.annual_note')}</p>
        </div>

        {/* ── Plans — all equal weight, Growth marked by border only ── */}
        <div className="pricing-plans">
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: SF,
              border: plan.primary ? `2px solid ${ACC}` : `1px solid ${BD}`,
              borderRadius: 14,
              padding: '28px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'Sora, system-ui', fontSize: 16, fontWeight: 700, color: TX }}>{plan.name}</span>
                {plan.primary && <span style={{ fontSize: 11, fontWeight: 600, color: ACC }}>{t('pricing.most_used')}</span>}
              </div>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 26, fontWeight: 700, color: plan.primary ? ACC : TX, marginBottom: 12 }}>
                {plan.label}
              </div>
              <p style={{ fontSize: 13, color: TX2, lineHeight: 1.6, marginBottom: 20, minHeight: 60 }}>{plan.description}</p>
              <Link href={localePath(plan.ctaHref, locale)} style={{
                display: 'block', textAlign: 'center', fontSize: 14, fontWeight: 700,
                color: plan.primary ? SF : TX,
                background: plan.primary ? ACC : 'transparent',
                border: plan.primary ? 'none' : `1.5px solid ${TX3}`,
                borderRadius: 9, padding: '11px', textDecoration: 'none', marginBottom: 8,
              }}>
                {plan.cta} →
              </Link>
              <p style={{ fontSize: 11, color: TX3, textAlign: 'center', marginBottom: 20 }}>{plan.note}</p>
              <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 13, color: TX2, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── PoS Add-on — horizontal strip, no floating pill ── */}
        <div className="pos-addon" style={{ background: `${ACC}07`, border: `1px solid ${BD}`, borderTop: `2px solid ${ACC}`, borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>{t('pricing.addon_label')}</div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 4 }}>{t('pricing.addon_title')}</div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 28, fontWeight: 700, color: ACC, marginBottom: 12 }}>£5 <span style={{ fontSize: 14, fontWeight: 400, color: TX3 }}>{t('pricing.addon_per_seat')}</span></div>
            <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 18 }}>
              {t('pricing.addon_desc')}
            </p>
            <Link href={localePath('/signin', locale)} style={{ display: 'inline-block', fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 8, padding: '9px 20px', textDecoration: 'none' }}>{t('pricing.addon_cta')} →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              [t('pricing.addon_feat_register_t'), t('pricing.addon_feat_register_d')],
              [t('pricing.addon_feat_inventory_t'), t('pricing.addon_feat_inventory_d')],
              [t('pricing.addon_feat_branch_t'), t('pricing.addon_feat_branch_d')],
              [t('pricing.addon_feat_staff_t'), t('pricing.addon_feat_staff_d')],
              [t('pricing.addon_feat_tax_t'), t('pricing.addon_feat_tax_d')],
              [t('pricing.addon_feat_accounting_t'), t('pricing.addon_feat_accounting_d')],
            ].map(([label, desc], i) => (
              <div key={i}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TX, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: TX3, lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Enterprise ── */}
        <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 72 }}>
          <div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 3 }}>{t('pricing.enterprise_title')}</div>
            <div style={{ fontSize: 13, color: TX2 }}>{t('pricing.enterprise_desc')}</div>
          </div>
          <Link href={localePath('/help', locale)} style={{ fontSize: 13, fontWeight: 600, color: SF, background: TX, borderRadius: 8, padding: '9px 20px', textDecoration: 'none', whiteSpace: 'nowrap' }}>{t('pricing.enterprise_cta')}</Link>
        </div>

        {/* ── What's included — clean list, no emoji icon grid ── */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 28, letterSpacing: '-.02em' }}>{t('pricing.included_title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 48px' }}>
            {[
              [t('pricing.inc_dashboards_t'), t('pricing.inc_dashboards_d')],
              [t('pricing.inc_ai_t'), t('pricing.inc_ai_d')],
              [t('pricing.inc_brief_t'), t('pricing.inc_brief_d')],
              [t('pricing.inc_anomaly_t'), t('pricing.inc_anomaly_d')],
              [t('pricing.inc_price_t'), t('pricing.inc_price_d')],
              [t('pricing.inc_social_t'), t('pricing.inc_social_d')],
              [t('pricing.inc_supplier_t'), t('pricing.inc_supplier_d')],
              [t('pricing.inc_landed_t'), t('pricing.inc_landed_d')],
              [t('pricing.inc_cfo_t'), t('pricing.inc_cfo_d')],
              [t('pricing.inc_whatsapp_t'), t('pricing.inc_whatsapp_d')],
              [t('pricing.inc_pos_t'), t('pricing.inc_pos_d')],
              [t('pricing.inc_residency_t'), t('pricing.inc_residency_d')],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: `1px solid ${BD}` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 3 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, color: TX }}>{title}</span>
                  <span style={{ fontSize: 13, color: TX3 }}> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQs ── */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 24, letterSpacing: '-.02em' }}>{t('pricing.faq_title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderTop: i === 0 ? `1px solid ${BD}` : 'none', borderBottom: `1px solid ${BD}`, padding: '20px 0' }}>
                <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 8 }}>{faq.q}</div>
                <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Guarantee ── */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '28px 0', borderTop: `1px solid ${BD}`, marginBottom: 64 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 6 }}>{t('pricing.guarantee_title')}</div>
            <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
              {t('pricing.guarantee_desc')}
            </p>
          </div>
        </div>

        {/* ── Bottom CTA — editorial strip, not a rounded dark card ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, padding: '32px 0', borderTop: `2px solid ${TX}` }}>
          <div>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 6, letterSpacing: '-.02em' }}>{t('pricing.cta_title')}</h2>
            <p style={{ fontSize: 14, color: TX2, margin: 0 }}>{t('pricing.cta_desc')}</p>
          </div>
          <Link href={localePath('/signin', locale)} style={{ fontSize: 15, fontWeight: 700, color: SF, background: ACC, borderRadius: 10, padding: '14px 32px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {t('pricing.cta_button')} →
          </Link>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF, marginTop: 48 }}>
        <span style={{ fontSize: 12, color: TX3 }}>{t('pricing.footer_copy')}</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'home'], ['/help', 'help'], ['/privacy', 'privacy'], ['/terms', 'terms']] as [string, string][]).map(([href, key]) => (
            <Link key={href} href={localePath(href, locale)} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{t('nav.' + key)}</Link>
          ))}
        </div>
      </footer>
    </div>
    </>
  )
}
