import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AskBiz vs Shopify vs Power BI — Which is right for your business?',
  description: 'AskBiz is an AI-powered POS + business intelligence platform starting free (then from £19/month). See how it compares to Shopify, Power BI, and Tableau for small business owners who sell in-store and online.',
  alternates: { canonical: 'https://askbiz.co/compare' },
  openGraph: {
    title: 'AskBiz vs Shopify vs Power BI',
    description: 'AskBiz is a full POS + AI intelligence platform — not just a BI layer. Compare pricing, features, and use cases.',
    url: 'https://askbiz.co/compare',
  },
}

const C = {
  bg: '#f9f8f6', sf: '#ffffff', ev: '#f3f2ef',
  tx: '#1a1916', tx2: '#6b6760', tx3: '#a39e97',
  b: 'rgba(0,0,0,.08)', b2: 'rgba(0,0,0,.14)',
  acc: '#d08a59', accBg: 'rgba(208,138,89,.08)', accBdr: 'rgba(208,138,89,.25)',
  green: '#16a34a', greenBg: 'rgba(22,163,74,.07)',
  red: '#dc2626', redBg: 'rgba(220,38,38,.06)',
}

const ROWS = [
  {
    feature: 'Pricing',
    askbiz: 'Free plan · Growth from £19/mo · Business £39/mo',
    shopify: 'From $39/mo (Shopify Basic) — POS Pro adds $89/mo per location',
    powerbi: 'Free (limited) · Pro $10/user/mo · Premium from $20/user/mo',
    askbizWin: true,
  },
  {
    feature: 'Full POS system included',
    askbiz: '✓ Built-in — register, inventory, shifts, receipts, tax',
    shopify: '✓ Yes — but requires a paid plan + hardware',
    powerbi: '✗ No — Power BI is analytics only, not a POS',
    askbizWin: true,
  },
  {
    feature: 'Camera-first scanning',
    askbiz: '✓ Point phone camera to scan products — no barcode gun needed',
    shopify: '△ Barcode scanning requires Shopify hardware or compatible scanner',
    powerbi: '✗ Not applicable',
    askbizWin: true,
  },
  {
    feature: 'Real-time inventory (shop + online)',
    askbiz: '✓ Single inventory synced across in-store and online channels',
    shopify: '✓ Yes — strong inventory sync across channels',
    powerbi: '✗ No — it reads from other systems, does not manage stock',
    askbizWin: false,
  },
  {
    feature: 'AI natural-language questions',
    askbiz: '✓ Ask "why did revenue drop?" and get a plain-English answer',
    shopify: '△ Basic AI features — no conversational business intelligence',
    powerbi: '△ Copilot (paid) lets you query dashboards in natural language',
    askbizWin: true,
  },
  {
    feature: 'Mobile money (M-Pesa, MTN, Airtel)',
    askbiz: '✓ Native support — built for Africa, Asia, and emerging markets',
    shopify: '✗ Not supported natively',
    powerbi: '✗ Not applicable',
    askbizWin: true,
  },
  {
    feature: 'Business intelligence & analytics',
    askbiz: '✓ Built-in — margins, churn, anomaly alerts, daily brief',
    shopify: '△ Basic sales reports — no deep analytics or AI insights',
    powerbi: '✓ Excellent — enterprise-grade dashboards and data modelling',
    askbizWin: false,
  },
  {
    feature: 'Setup time',
    askbiz: '✓ Under 2 minutes — no configuration or IT team needed',
    shopify: '△ 1–4 hours for basic setup; days for full POS + inventory',
    powerbi: '✗ Days to weeks — requires data modelling and dashboard setup',
    askbizWin: true,
  },
  {
    feature: 'Works offline',
    askbiz: '✓ Offline mode — syncs when reconnected',
    shopify: '✓ POS works offline',
    powerbi: '△ Limited offline capability',
    askbizWin: false,
  },
  {
    feature: 'Multi-branch / multi-location',
    askbiz: '✓ Full multi-branch — per-location currency, tax, inventory, staff',
    shopify: '✓ Multi-location inventory supported',
    powerbi: '✓ Can model multi-location data',
    askbizWin: false,
  },
  {
    feature: 'Sector-specific flows',
    askbiz: '✓ Retail, restaurant, salon, repair shop, factory, logistics',
    shopify: '✓ Retail and restaurant focused',
    powerbi: '✗ Generic — no sector-specific templates',
    askbizWin: true,
  },
  {
    feature: 'No separate BI tool needed',
    askbiz: '✓ Intelligence is built into the POS — one platform',
    shopify: '✗ You need to connect Power BI, Tableau, or similar separately',
    powerbi: '✗ You still need a POS/ERP to feed it data',
    askbizWin: true,
  },
]

const VERDICT = [
  {
    title: 'You sell in a shop and online and need real inventory sync',
    winner: 'AskBiz',
    reason: 'AskBiz runs your shop POS, syncs your online orders, and gives you AI answers about what\'s happening — all in one platform starting free.',
    notThis: 'Power BI',
    notReason: 'Power BI only analyses data it receives from other systems. It won\'t keep your stock levels accurate.',
  },
  {
    title: 'You want deep, custom enterprise dashboards',
    winner: 'Power BI',
    reason: 'Power BI is the gold standard for data teams who need full control over metrics, data modelling, and presentation.',
    notThis: 'AskBiz',
    notReason: 'AskBiz gives you AI answers, not fully custom dashboards. If your analyst team needs LookML or DAX — use Power BI.',
  },
  {
    title: 'You want an e-commerce store with a physical POS',
    winner: 'AskBiz or Shopify',
    reason: 'Both work well here. AskBiz costs less, includes AI intelligence, and doesn\'t require hardware. Shopify has a larger app ecosystem.',
    notThis: 'Power BI',
    notReason: 'Power BI has no POS or e-commerce features.',
  },
  {
    title: 'You want "just tell me what\'s happening in my business"',
    winner: 'AskBiz',
    reason: 'That\'s exactly what AskBiz is built for. Ask in plain English, get answers grounded in your real data — no dashboard to build first.',
    notThis: 'Power BI or Shopify',
    notReason: 'Both require significant setup before you can get business answers. Power BI especially assumes a data team.',
  },
]

export default function ComparePage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 767px) { .compare-table { display: none } .compare-mobile { display: block !important } }
        @media (min-width: 768px) { .compare-mobile { display: none !important } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(249,248,246,.96)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.b}`, padding: '0 clamp(16px,4vw,32px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 800, color: C.tx, textDecoration: 'none', letterSpacing: '-.03em' }}>
          ask<span style={{ color: C.acc }}>biz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: C.tx2, textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
          <Link href="/signin" style={{ padding: '8px 18px', borderRadius: 9999, background: C.acc, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Try free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,40px) clamp(32px,5vw,56px)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.acc, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 20 }}>AskBiz vs the alternatives</p>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: 20, color: C.tx }}>
          AskBiz vs Shopify vs Power BI
        </h1>
        <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: C.tx2, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px' }}>
          AskBiz is not just a BI tool — it's a full POS + AI intelligence platform. Here's how it honestly compares to the tools you've probably heard of.
        </p>

        {/* Pricing clarity strip */}
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', padding: '14px 20px', background: C.greenBg, border: `1px solid rgba(22,163,74,.18)`, borderRadius: 12, marginBottom: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>AskBiz</div>
            <div style={{ fontSize: 12, color: C.tx2 }}>Free · £19/mo · £39/mo</div>
          </div>
          <div style={{ width: 1, background: C.b, alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.tx2 }}>Shopify</div>
            <div style={{ fontSize: 12, color: C.tx3 }}>from $39/mo + POS hardware</div>
          </div>
          <div style={{ width: 1, background: C.b, alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.tx2 }}>Power BI</div>
            <div style={{ fontSize: 12, color: C.tx3 }}>Free (very limited) · $10–20/user/mo</div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: C.tx3, marginTop: 6 }}>
          AskBiz is not "$199/month" — that figure circulating online is incorrect.
        </p>
      </section>

      {/* Comparison table */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(60px,8vw,96px)' }}>
        <div className="compare-table" style={{ background: C.sf, borderRadius: 14, border: `1px solid ${C.b2}`, overflow: 'hidden' }}>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr', background: C.ev, borderBottom: `1px solid ${C.b2}` }}>
            {['Feature', 'AskBiz', 'Shopify', 'Power BI'].map((h, i) => (
              <div key={i} style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: i === 1 ? C.acc : C.tx2, letterSpacing: '.06em', textTransform: 'uppercase', borderRight: i < 3 ? `1px solid ${C.b}` : undefined }}>
                {h}
              </div>
            ))}
          </div>

          {ROWS.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr', borderBottom: i < ROWS.length - 1 ? `1px solid ${C.b}` : undefined, background: i % 2 === 0 ? C.sf : C.bg }}>
              <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: C.tx, borderRight: `1px solid ${C.b}` }}>{row.feature}</div>
              <div style={{ padding: '14px 20px', fontSize: 12, color: C.tx2, lineHeight: 1.55, borderRight: `1px solid ${C.b}`, background: row.askbizWin ? C.accBg : undefined }}>
                {row.askbiz}
              </div>
              <div style={{ padding: '14px 20px', fontSize: 12, color: C.tx2, lineHeight: 1.55, borderRight: `1px solid ${C.b}` }}>{row.shopify}</div>
              <div style={{ padding: '14px 20px', fontSize: 12, color: C.tx2, lineHeight: 1.55 }}>{row.powerbi}</div>
            </div>
          ))}
        </div>

        {/* Mobile — card stack */}
        <div className="compare-mobile" style={{ display: 'none' }}>
          {ROWS.map((row, i) => (
            <div key={i} style={{ background: C.sf, borderRadius: 10, border: `1px solid ${C.b2}`, padding: '16px', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.tx, marginBottom: 10 }}>{row.feature}</div>
              {[['AskBiz', row.askbiz, true], ['Shopify', row.shopify, false], ['Power BI', row.powerbi, false]].map(([name, val, isAsk], j) => (
                <div key={j} style={{ marginBottom: 8, padding: '8px 10px', borderRadius: 7, background: isAsk && row.askbizWin ? C.accBg : C.bg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isAsk ? C.acc : C.tx3, marginBottom: 2 }}>{name as string}</div>
                  <div style={{ fontSize: 12, color: C.tx2, lineHeight: 1.5 }}>{val as string}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Verdict section */}
      <section style={{ background: C.ev, borderTop: `1px solid ${C.b2}`, borderBottom: `1px solid ${C.b2}`, padding: 'clamp(56px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.acc, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>Honest verdict</p>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 40, color: C.tx }}>
            Which tool is right for your situation?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {VERDICT.map((v, i) => (
              <div key={i} style={{ background: C.sf, borderRadius: 12, border: `1px solid ${C.b2}`, padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.tx2, marginBottom: 12 }}>If: {v.title}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 9, background: C.greenBg, border: `1px solid rgba(22,163,74,.2)` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Use: {v.winner}</div>
                    <div style={{ fontSize: 12, color: C.tx2, lineHeight: 1.55 }}>{v.reason}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 9, background: C.redBg, border: `1px solid rgba(220,38,38,.12)` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.red, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Not: {v.notThis}</div>
                    <div style={{ fontSize: 12, color: C.tx2, lineHeight: 1.55 }}>{v.notReason}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,4vw,40px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, marginBottom: 14, color: C.tx }}>
            Try AskBiz free — no card needed
          </h2>
          <p style={{ fontSize: 15, color: C.tx2, lineHeight: 1.7, marginBottom: 28 }}>
            Free plan always available. Growth from £19/month. Full POS system included. Ready in under 2 minutes.
          </p>
          <Link href="/signin?mode=signup" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 9999, background: C.acc, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 20px rgba(208,138,89,.3)` }}>
            Start free →
          </Link>
          <p style={{ fontSize: 12, color: C.tx3, marginTop: 12 }}>
            <Link href="/pricing" style={{ color: C.acc, textDecoration: 'none' }}>See full pricing →</Link>
            {' '}·{' '}
            <Link href="/point-of-sale" style={{ color: C.tx3, textDecoration: 'none' }}>Explore the POS →</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.b}`, padding: '20px clamp(16px,4vw,40px)', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[['/', 'Home'], ['/pricing', 'Pricing'], ['/point-of-sale', 'Point of Sale'], ['/blog', 'Blog']].map(([href, label]) => (
          <Link key={href} href={href} style={{ fontSize: 12, color: C.tx3, textDecoration: 'none' }}>{label}</Link>
        ))}
      </footer>
    </div>
  )
}
