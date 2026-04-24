import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Human-Friendly Alternative to the Bloomberg Terminal | AskBiz',
  description: 'Bloomberg translates financial data for institutions. AskBiz translates YOUR business data into plain English. No jargon, no £24,000/year terminal. From £19/month.',
  openGraph: { title: 'Human-Friendly Alternative to Bloomberg Terminal | AskBiz', url: 'https://askbiz.co/bloomberg-alternative' },
  alternates: { canonical: 'https://askbiz.co/bloomberg-alternative' },
  keywords: ['bloomberg alternative', 'financial jargon translator', 'simple business analytics', 'understand market data', 'bloomberg terminal small business'],
}

const comparisons = [
  { terminal: 'EBITDA multiple of 7.2x on trailing twelve months', askbiz: 'Your business is worth about 7 times last year\'s core profit — roughly £720,000 at current performance' },
  { terminal: 'Inventory days of 84 with DSO of 52 and DPO of 31', askbiz: 'Your stock sits for 84 days before selling. Customers take 52 days to pay. You pay suppliers in 31 days. Your cash is being squeezed.' },
  { terminal: 'Gross margin compression of 340bps YoY due to input cost inflation', askbiz: 'Your margins dropped 3.4% compared to last year because your costs went up. You made £3,400 less profit for every £100,000 in sales.' },
  { terminal: 'P/E ratio of 14.2x with EV/EBITDA of 8.6x on normalised earnings', askbiz: 'At current earnings, investors are paying £14.20 for every £1 of annual profit. On an operating basis, the business is valued at 8.6 times annual operating income.' },
  { terminal: 'Working capital cycle of 105 days with current ratio of 0.8', askbiz: 'It takes 105 days to turn your investment into cash. Your current ratio of 0.8 means you owe more short-term than you have — a liquidity risk.' },
  { terminal: 'SKU rationalisation opportunity identified in tail assortment', askbiz: 'You have products in your range that barely sell. Cutting 20% of your slowest lines could free up £14,000 in working capital.' },
]

export default function BloombergAlternativePage() {
  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', color: '#1a1916', background: '#f9f8f6' }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "AskBiz — Bloomberg Alternative",
        "description": "AskBiz translates complex financial and business data into plain English for SME owners — without the Bloomberg Terminal price tag.",
        "url": "https://askbiz.co/bloomberg-alternative",
        "mainEntity": {
          "@type": "SoftwareApplication",
          "name": "AskBiz",
          "applicationCategory": "BusinessApplication",
          "description": "Financial jargon translator and business intelligence tool for SME owners",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
        }
      })}}/>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background:'#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,24px) clamp(32px,5vw,56px)', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: '#8c6fe0', background: 'rgba(140,111,224,.1)', border: '1px solid rgba(140,111,224,.25)', borderRadius: 9999, padding: '4px 14px', marginBottom: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>
          Financial jargon translator
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(26px,5vw,46px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 20, color: '#1a1916' }}>
          The Human-Friendly Alternative<br/>to the Bloomberg Terminal
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#6b6760', lineHeight: 1.75, marginBottom: 14, maxWidth: 600, margin: '0 auto 14px' }}>
          Bloomberg translates global financial data for institutional investors. AskBiz translates <em>your</em> business data into plain English for business owners. No financial jargon. No £24,000/year terminal. No data science degree required.
        </p>
        <p style={{ fontSize: 14, color: '#a39e97', marginBottom: 32 }}>From £19/month. Works with any CSV or Excel file.</p>
        <Link href="/signin" style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '13px 32px', textDecoration: 'none', display: 'inline-block' }}>
          Translate your business data — free →
        </Link>
      </section>

      {/* The translation table */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8, color: '#1a1916', textAlign: 'center' }}>
            Complex terminal data vs. plain English
          </h2>
          <p style={{ fontSize: 15, color: '#6b6760', textAlign: 'center', marginBottom: 36 }}>This is what financial analysis looks like before and after AskBiz.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 16, overflow: 'hidden', border: '1px solid #e8e6e1' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#1a1916' }}>
              <div style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', borderRight: '1px solid #333' }}>
                🖥️ Terminal / Financial jargon
              </div>
              <div style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, color: '#d08a59', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                💬 AskBiz plain English
              </div>
            </div>
            {comparisons.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #e8e6e1', background: i % 2 === 0 ? '#fff' : '#f9f8f6' }}>
                <div style={{ padding: '16px 20px', fontSize: 14, color: '#6b6760', lineHeight: 1.6, borderRight: '1px solid #e8e6e1', fontFamily: 'var(--font-mono, monospace)', fontSize: 13 }}>
                  {row.terminal}
                </div>
                <div style={{ padding: '16px 20px', fontSize: 14, color: '#1a1916', lineHeight: 1.65 }}>
                  {row.askbiz}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why not Bloomberg */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 24, color: '#1a1916' }}>
          Why Bloomberg isn't built for small business
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { icon: '💰', title: '£24,000/year minimum', body: 'Bloomberg Terminal costs approximately £2,000/month per seat. AskBiz starts free.' },
            { icon: '📚', title: 'Steep learning curve', body: 'Bloomberg requires training and a financial background to use effectively. AskBiz requires typing a question.' },
            { icon: '📊', title: 'Built for markets, not operations', body: 'Bloomberg analyses public company data and market prices. AskBiz analyses your actual business data.' },
            { icon: '🔍', title: 'Institutional focus', body: 'Bloomberg is designed for portfolio managers and analysts. AskBiz is designed for the business owner doing everything.' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e8e6e1', background: '#fff' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
              <p style={{ fontSize: 13, color: '#6b6760', lineHeight: 1.6, margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What AskBiz does instead */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 16, color: '#1a1916' }}>
            AskBiz: simple business analytics in plain English
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844', marginBottom: 28 }}>
            AskBiz is a financial jargon translator for your own business data. Instead of deciphering terminal screens and analyst reports, you upload your sales spreadsheet and ask questions like you'd ask a trusted advisor. The AI reads your data, applies commercial analysis, and returns the answer in language you can use to make decisions today.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844' }}>
            It also connects to live market data — AliExpress supplier prices, eBay sold prices, and Google Trends — so your business intelligence is grounded in current market reality, not just your historical records. That's the kind of insight that used to require a Bloomberg subscription, a data analyst, and a procurement consultant. AskBiz delivers it in seconds for £19/month.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,8vw,72px) clamp(16px,4vw,24px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 14 }}>Understand your business data — in plain English</h2>
        <p style={{ fontSize: 16, color: '#6b6760', lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>Upload your CSV, ask your question, get your answer. No financial jargon. No data science degree. No terminal subscription.</p>
        <Link href="/signin" style={{ fontSize: 16, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '14px 36px', textDecoration: 'none', display: 'inline-block' }}>
          Start free — no card needed →
        </Link>
        <p style={{ fontSize: 12, color: '#a39e97', marginTop: 14 }}>10 free questions every month. Growth from £19/month.</p>
      </section>

      {/* Related glossary links */}
      <section style={{ borderTop: '1px solid #e8e6e1', background: '#fff', padding: 'clamp(28px,4vw,40px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Financial terms in plain English</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              ['what-is-ebitda', 'EBITDA'], ['what-is-working-capital', 'Working Capital'],
              ['what-is-gross-profit', 'Gross Profit'], ['what-is-burn-rate', 'Burn Rate'],
              ['what-is-cash-flow', 'Cash Flow'], ['what-is-mrr', 'MRR'],
              ['what-is-contribution-margin', 'Contribution Margin'], ['what-is-churn-rate', 'Churn Rate'],
            ].map(([slug, label]) => (
              <Link key={slug} href={`/translate/${slug}`} style={{ fontSize: 13, color: '#8c6fe0', textDecoration: 'none', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(140,111,224,.25)', background: 'rgba(140,111,224,.04)' }}>
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,32px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background:'#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700, color: '#1a1916' }}>AskBiz</span>
          <span style={{ fontSize: 12, color: '#a39e97' }}>© 2026</span>
        </Link>
        <div style={{ display: 'flex', gap: 16 }}>
          {[['/', 'Home'], ['/translate', 'Glossary'], ['/how-to', 'How-to'], ['/privacy', 'Privacy']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
