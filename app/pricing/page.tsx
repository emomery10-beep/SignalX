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
const GREEN = '#27ae60'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    description: '10 free questions per month. Upload your data, get your Business Pulse score, and explore the tools — no card needed.',
    highlight: false,
    features: [
      '10 questions per month',
      'Upload CSV & Excel files',
      'Business Pulse health score',
      'Connect Shopify, Amazon & more',
      'FX Risk, Landed Cost & Export Tools (manual)',
      'Supplier Scorecard (view)',
      'API access',
      'No credit card required',
    ],
    cta: 'Get started free',
    ctaHref: '/signin',
  },
  {
    name: 'Growth',
    price: 19,
    period: 'month',
    description: 'Unlimited questions, all tools pre-filled from your data, Daily Brief, social commerce, churn intelligence, and market intelligence.',
    highlight: true,
    features: [
      'Unlimited questions',
      'All tools pre-filled from your connected data',
      'Daily Brief — AI-generated morning intelligence',
      'Social Commerce — TikTok, Instagram, Pinterest',
      'Churn Intelligence — monthly at-risk scan',
      'Export Market Scoring — 20 markets with product match',
      'Anomaly alerts',
      'Market intelligence',
      'API access',
    ],
    cta: 'Upgrade to Growth',
    ctaHref: '/signin',
  },
  {
    name: 'Business',
    price: 39,
    period: 'month',
    description: 'Everything in Growth plus team seats, Decision Memory, Competitor Watch, CFO Mode, and priority support.',
    highlight: false,
    features: [
      'Everything in Growth',
      'Team seats — up to 5 members',
      'Decision Memory — 6-week check-ins',
      'Competitor Watch',
      'CFO Mode — board-ready reports',
      'Unlimited shipment intelligence',
      'Role-based access',
      'Priority support',
      'API access',
    ],
    cta: 'Upgrade to Business',
    ctaHref: '/signin',
  },
]

const FAQS = [
  { q: 'Is the Free plan really free forever?', a: 'Yes — the Free plan is free forever with no credit card required. You get 10 questions per month, CSV/Excel uploads, Business Pulse score, and the ability to connect Shopify, Amazon, and more.' },
  { q: 'What\'s the difference between Growth and Business?', a: 'Growth (£19/month) gives you unlimited questions and all the AI-powered tools pre-filled from your data. Business (£39/month) adds team seats for up to 5 members, Decision Memory, Competitor Watch, CFO Mode with board-ready reports, and priority support.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your account settings. If you cancel a paid subscription, you keep access until the end of your billing period. You\'ll drop back to the Free plan automatically.' },
  { q: 'Do you offer annual billing?', a: 'Yes — pay annually and get 2 months free (equivalent to ~17% off). Switch to annual billing at any time from your account settings.' },
  { q: 'What happens to my data if I cancel?', a: 'Your data is retained for 30 days after cancellation, during which you can export everything. After 30 days, your data is permanently deleted.' },
  { q: 'Do you offer discounts for startups or nonprofits?', a: 'Yes — we offer discounts for qualifying early-stage startups and registered charities. Contact us via the Help Centre to apply.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, at any time. Upgrades take effect immediately and are prorated. Downgrades take effect at your next billing date.' },
  { q: 'How does Point of Sale pricing work?', a: 'The PoS is a £5/seat/month add-on available on any plan. Each seat is one cashier or manager login. You get a full register with barcode scanning, inventory management, multi-branch support, staff shifts, tax compliance, GDPR tools, and Xero/QuickBooks sync. Add or remove seats anytime.' },
]

export default function PricingPage() {
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .plan-card { transition: transform 140ms, box-shadow 140ms; }
        .plan-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
      `}</style>

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
      <section style={{ textAlign: 'center', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,32px) 0' }}>
        <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 16, color: TX2, maxWidth: 480, margin: '0 auto 12px', lineHeight: 1.7 }}>
          Start for free, upgrade when you need more. No credit card required on the free plan.
        </p>
        <p style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ Annual billing saves 2 months (17% off)</p>
      </section>

      {/* Plans */}
      <div style={{ maxWidth: 1020, margin: '0 auto', padding: 'clamp(36px,5vw,56px) clamp(16px,4vw,32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className="plan-card"
              style={{
                background: plan.highlight ? TX : SF,
                border: plan.highlight ? `2px solid ${ACC}` : `1px solid ${BD}`,
                borderRadius: 16,
                padding: '28px 26px',
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: ACC, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', borderRadius: 9999, padding: '4px 14px', whiteSpace: 'nowrap' }}>
                  Most popular
                </div>
              )}
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: plan.highlight ? '#fff' : TX, marginBottom: 6 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                {plan.price === 0 ? (
                  <span style={{ fontFamily: 'Sora, system-ui', fontSize: 38, fontWeight: 700, color: plan.highlight ? ACC : TX }}>Free</span>
                ) : (
                  <>
                    <span style={{ fontFamily: 'Sora, system-ui', fontSize: 38, fontWeight: 700, color: plan.highlight ? ACC : TX }}>£{plan.price}</span>
                    <span style={{ fontSize: 14, color: plan.highlight ? '#b0b8c8' : TX3 }}>/{plan.period}</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: 13, color: plan.highlight ? '#b0b8c8' : TX2, lineHeight: 1.6, marginBottom: 22 }}>{plan.description}</p>
              <Link
                href={plan.ctaHref}
                style={{
                  display: 'block', textAlign: 'center', fontSize: 14, fontWeight: 700,
                  color: plan.highlight ? TX : SF,
                  background: plan.highlight ? ACC : TX,
                  borderRadius: 10, padding: '12px', textDecoration: 'none', marginBottom: 22,
                }}
              >
                {plan.cta} →
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 13, color: plan.highlight ? '#d0d8e8' : TX2, lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PoS Add-on */}
        <div style={{ marginTop: 24, background: SF, border: `2px solid ${ACC}`, borderRadius: 16, padding: '28px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -12, left: 24, background: ACC, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', borderRadius: 9999, padding: '3px 12px' }}>Add-on</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 6 }}>Point of Sale</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontFamily: 'Sora, system-ui', fontSize: 34, fontWeight: 700, color: ACC }}>£5</span>
                <span style={{ fontSize: 14, color: TX3 }}>/seat/month</span>
              </div>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 18 }}>
                A full point-of-sale system that plugs into your AskBiz intelligence. Add as many seats as you need — each seat is a cashier or manager login.
              </p>
              <Link href="/signin" style={{ display: 'inline-block', fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9, padding: '10px 22px', textDecoration: 'none' }}>Add PoS seats →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '🧾', label: 'Register & checkout', desc: 'Barcode scanning, split payments, refunds, digital receipts' },
                { icon: '📦', label: 'Inventory management', desc: 'Real-time stock, low-stock alerts, AI reorder suggestions' },
                { icon: '🏪', label: 'Multi-branch', desc: 'Per-location inventory, staff, reporting, and tax settings' },
                { icon: '👥', label: 'Staff & shifts', desc: 'OTP login, shift open/close, per-cashier performance' },
                { icon: '🧮', label: 'Tax & compliance', desc: 'Multi-jurisdiction VAT, consolidated reports, filing previews' },
                { icon: '🔗', label: 'Accounting sync', desc: 'Xero and QuickBooks integration built in' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TX, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: TX3, lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise */}
        <div style={{ marginTop: 24, background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 16, fontWeight: 700, color: TX, marginBottom: 4 }}>Enterprise</div>
            <div style={{ fontSize: 14, color: TX2 }}>Custom data sources, SSO, dedicated infrastructure, SLA, and volume pricing for teams of 20+</div>
          </div>
          <Link href="/help" style={{ fontSize: 13, fontWeight: 600, color: SF, background: TX, borderRadius: 9, padding: '10px 22px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Talk to sales</Link>
        </div>

        {/* Feature comparison */}
        <div style={{ marginTop: 72 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 28, textAlign: 'center', letterSpacing: '-.02em' }}>Everything included</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { icon: '📊', title: 'Pre-built dashboards', desc: 'Revenue, margin, cash flow, and more — ready the moment you connect' },
              { icon: '📬', title: 'Daily briefing', desc: 'Plain-English morning summary of your most important metrics' },
              { icon: '🔔', title: 'Anomaly alerts', desc: 'Get notified when something unusual happens in your data' },
              { icon: '🤖', title: 'AI-powered answers', desc: 'Ask questions about your business in plain English' },
              { icon: '📱', title: 'Mobile-friendly', desc: 'Access your metrics on any device, anywhere' },
              { icon: '🔒', title: 'UK data residency', desc: 'Your data stays in the UK. GDPR compliant by design' },
              { icon: '🧾', title: 'Point of Sale', desc: 'Full register, inventory, multi-branch, staff shifts — £5/seat add-on' },
              { icon: '🏪', title: 'Multi-branch PoS', desc: 'Per-location inventory, tax settings, and reporting across all your shops' },
            ].map((item, i) => (
              <div key={i} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '18px 16px' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 5 }}>{item.title}</div>
                <p style={{ fontSize: 12, color: TX2, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginTop: 72 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 24, textAlign: 'center', letterSpacing: '-.02em' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 8 }}>{faq.q}</div>
                <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 64, background: TX, borderRadius: 16, padding: '44px 32px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Start for free today</h2>
          <p style={{ fontSize: 15, color: '#b0b8c8', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6 }}>
            No credit card required. Connect your first data source in under 10 minutes and upgrade when you&apos;re ready.
          </p>
          <Link href="/signin" style={{ fontSize: 15, fontWeight: 700, color: TX, background: ACC, borderRadius: 10, padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
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
  )
}
