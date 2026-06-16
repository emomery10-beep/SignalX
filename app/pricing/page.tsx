import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing | AskBiz — Business Intelligence for SMEs',
  description: 'Simple, transparent pricing for AskBiz. Free plan available, then from £19/month. No setup fees, no hidden costs, cancel anytime.',
  alternates: { canonical: 'https://askbiz.co/pricing' },
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'
const GREEN = '#16a34a'

const PLANS = [
  {
    name: 'Free',
    price: null,
    label: 'Free forever',
    description: '10 questions a month. Upload your data, get your Business Pulse score, explore the tools — no card needed.',
    primary: false,
    features: [
      '10 questions / month',
      'CSV & Excel uploads',
      'Business Pulse health score',
      'Connect Shopify, Amazon & more',
      'FX Risk, Landed Cost & Export Tools',
      'API access',
    ],
    cta: 'Get started free',
    ctaHref: '/signin',
    note: 'No credit card · free forever',
  },
  {
    name: 'Growth',
    price: 19,
    label: '£19 / month',
    description: 'Unlimited questions, all tools pre-filled from your data, Daily Brief, social commerce, churn intelligence, market intelligence.',
    primary: true,
    features: [
      'Unlimited questions',
      'All tools pre-filled from your data',
      'Daily Brief — AI morning intelligence',
      'TikTok / Instagram / Pinterest tracking',
      'Churn Intelligence — monthly scan',
      'Export Market Scoring — 20 markets',
      'Anomaly alerts',
      'API access',
    ],
    cta: 'Start Growth free',
    ctaHref: '/signin',
    note: 'Start free · upgrade anytime',
  },
  {
    name: 'Business',
    price: 39,
    label: '£39 / month',
    description: 'Everything in Growth plus team seats, Decision Memory, Competitor Watch, CFO Mode, and priority support.',
    primary: false,
    features: [
      'Everything in Growth',
      'Team seats — up to 5 members',
      'Decision Memory — 6-week check-ins',
      'Competitor Watch',
      'CFO Mode — board-ready reports',
      'Unlimited shipment intelligence',
      'Role-based access',
      'Priority support',
    ],
    cta: 'Start Business free',
    ctaHref: '/signin',
    note: 'Start free · upgrade anytime',
  },
]

const FAQS = [
  { q: 'Is the Free plan really free forever?', a: 'Yes — the Free plan is free forever with no credit card required. You get 10 questions per month, CSV/Excel uploads, Business Pulse score, and the ability to connect Shopify, Amazon, and more.' },
  { q: 'What\'s the difference between Growth and Business?', a: 'Growth (£19/month) gives you unlimited questions and all the AI-powered tools pre-filled from your data. Business (£39/month) adds team seats for up to 5 members, Decision Memory, Competitor Watch, CFO Mode with board-ready reports, and priority support.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your account settings. If you cancel a paid subscription, you keep access until the end of your billing period. You\'ll drop back to the Free plan automatically.' },
  { q: 'Do you offer annual billing?', a: 'Yes — pay annually and get 2 months free (equivalent to ~17% off). Switch to annual billing at any time from your account settings.' },
  { q: 'What happens to my data if I cancel?', a: 'Your data is retained for 30 days after cancellation, during which you can export everything. After 30 days, your data is permanently deleted.' },
  { q: 'Do you offer discounts for startups or nonprofits?', a: 'Yes — we offer discounts for qualifying early-stage startups and registered charities. Contact us via the Help Centre to apply.' },
  { q: 'How does Point of Sale pricing work?', a: 'The PoS is a £5/seat/month add-on available on any plan. Each seat is one cashier or manager login. You get a full register with barcode scanning, inventory management, multi-branch support, staff shifts, tax compliance, GDPR tools, and Xero/QuickBooks sync.' },
]

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

const JSON_LD_FAQ: object = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function PricingPage() {
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
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,32px)' }}>

        {/* ── Header — left-aligned, no centered AI template ── */}
        <div style={{ maxWidth: 560, marginBottom: 52 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Pricing</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14, lineHeight: 1.08 }}>
            No hidden fees.<br/>Free to start.
          </h1>
          <p style={{ fontSize: 15, color: TX2, lineHeight: 1.7, marginBottom: 10 }}>
            Connect your first data source and ask your first questions for free. Upgrade when you need more.
          </p>
          <p style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ Annual billing saves 2 months (17% off)</p>
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
                {plan.primary && <span style={{ fontSize: 11, fontWeight: 600, color: ACC }}>most used</span>}
              </div>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 26, fontWeight: 700, color: plan.primary ? ACC : TX, marginBottom: 12 }}>
                {plan.label}
              </div>
              <p style={{ fontSize: 13, color: TX2, lineHeight: 1.6, marginBottom: 20, minHeight: 60 }}>{plan.description}</p>
              <Link href={plan.ctaHref} style={{
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
            <div style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>Add-on</div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 4 }}>Point of Sale</div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 28, fontWeight: 700, color: ACC, marginBottom: 12 }}>£5 <span style={{ fontSize: 14, fontWeight: 400, color: TX3 }}>/seat/month</span></div>
            <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 18 }}>
              A full point-of-sale system connected to your AskBiz intelligence. Each seat is a cashier or manager login.
            </p>
            <Link href="/signin" style={{ display: 'inline-block', fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 8, padding: '9px 20px', textDecoration: 'none' }}>Add PoS →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Register & checkout', 'Barcode scanning, split payments, refunds, digital receipts'],
              ['Inventory', 'Real-time stock, low-stock alerts, AI reorder suggestions'],
              ['Multi-branch', 'Per-location inventory, staff, reporting, tax settings'],
              ['Staff & shifts', 'OTP login, shift open/close, per-cashier performance'],
              ['Tax & compliance', 'Multi-jurisdiction VAT, reports, filing previews'],
              ['Accounting sync', 'Xero and QuickBooks built in'],
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
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 3 }}>Enterprise</div>
            <div style={{ fontSize: 13, color: TX2 }}>Custom data sources, SSO, dedicated infrastructure, SLA, and volume pricing for teams of 20+</div>
          </div>
          <Link href="/help" style={{ fontSize: 13, fontWeight: 600, color: SF, background: TX, borderRadius: 8, padding: '9px 20px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Talk to sales</Link>
        </div>

        {/* ── What's included — clean list, no emoji icon grid ── */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 28, letterSpacing: '-.02em' }}>Everything included</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 48px' }}>
            {[
              ['Pre-built dashboards', 'Revenue, margin, cash flow — ready the moment you connect'],
              ['AI-powered answers', 'Ask questions about your business in plain English'],
              ['Daily briefing', 'Plain-English morning summary of your most important metrics'],
              ['Anomaly alerts', 'Get notified when something unusual happens in your data'],
              ['Price sensitivity', 'Find which products can sustain a price increase'],
              ['Social commerce', 'TikTok Shop, Instagram, and Pinterest tracking'],
              ['Supplier management', 'Auto-graded scorecards, negotiation briefs, delay cost analysis'],
              ['Landed cost & FX risk', 'Import cost breakdowns with duty, VAT, shipping and FX hedging'],
              ['CFO Mode', 'Board-ready P&L, cash runway, margin analysis'],
              ['WhatsApp commerce', 'Browse, order, and updates via WhatsApp — fully integrated'],
              ['Point of Sale', 'Full register, inventory, multi-branch, staff shifts'],
              ['UK data residency', 'Your data stays in the UK. GDPR compliant by design'],
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
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 24, letterSpacing: '-.02em' }}>Questions</h2>
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
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 6 }}>14-day money-back guarantee</div>
            <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
              Try any paid plan completely risk-free. If AskBiz doesn&apos;t save you time in the first 14 days, email us and we&apos;ll refund you in full — no questions asked.
            </p>
          </div>
        </div>

        {/* ── Bottom CTA — editorial strip, not a rounded dark card ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, padding: '32px 0', borderTop: `2px solid ${TX}` }}>
          <div>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 6, letterSpacing: '-.02em' }}>Start for free today</h2>
            <p style={{ fontSize: 14, color: TX2, margin: 0 }}>No credit card required. Connect your first data source in under 10 minutes.</p>
          </div>
          <Link href="/signin" style={{ fontSize: 15, fontWeight: 700, color: SF, background: ACC, borderRadius: 10, padding: '14px 32px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Get started free →
          </Link>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF, marginTop: 48 }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz Ltd. Prices shown in GBP, excluding VAT.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'Home'], ['/help', 'Help'], ['/privacy', 'Privacy'], ['/terms', 'Terms']] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
    </>
  )
}
