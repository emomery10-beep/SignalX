import Link from 'next/link'
import type { SeoEntry } from '@/lib/seo-content'

export default function ProgrammaticPage({ entry, related }: { entry: SeoEntry; related: SeoEntry[] }) {
  const isHowTo = entry.category === 'how-to'

  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', color: '#1a1916', background: '#f9f8f6' }}>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": isHowTo ? "HowTo" : "DefinedTerm",
        "name": entry.title,
        "description": entry.metaDescription,
        ...(isHowTo ? {
          "step": entry.howAskBizDoesIt ? [{ "@type": "HowToStep", "name": "Upload your data", "text": "Export your sales data as a CSV or Excel file and upload it to AskBiz." }, { "@type": "HowToStep", "name": "Ask your question", "text": `Type: "${entry.term}" in the AskBiz chat.` }, { "@type": "HowToStep", "name": "Get your answer", "text": "AskBiz returns the calculation with a chart and recommendations in seconds." }] : []
        } : {
          "termCode": entry.slug,
          "inDefinedTermSet": { "@type": "DefinedTermSet", "name": "AskBiz Business Glossary", "url": "https://askbiz.co/translate" }
        }),
      })}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": entry.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      })}}/>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={isHowTo ? '/how-to' : '/translate'} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none', padding: '6px 12px' }}>
            ← {isHowTo ? 'How-to guides' : 'Glossary'}
          </Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 16px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,24px) clamp(48px,8vw,80px)' }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#a39e97', marginBottom: 28, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#a39e97', textDecoration: 'none' }}>AskBiz</Link>
          <span>›</span>
          <Link href={isHowTo ? '/how-to' : '/translate'} style={{ color: '#a39e97', textDecoration: 'none' }}>{isHowTo ? 'How-to guides' : 'Business glossary'}</Link>
          <span>›</span>
          <span style={{ color: '#6b6760' }}>{entry.term}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#d08a59', background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '3px 12px', marginBottom: 14, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            {isHowTo ? 'How-to guide' : 'Plain English definition'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(24px,4.5vw,38px)', fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.2, color: '#1a1916', marginBottom: 14 }}>
            {entry.title}
          </h1>
          <p style={{ fontSize: 'clamp(15px,2.5vw,17px)', color: '#6b6760', lineHeight: 1.7 }}>
            {entry.shortDefinition}
          </p>
        </div>

        {/* Term highlight box */}
        <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(140,111,224,.06)', border: '1px solid rgba(140,111,224,.2)', marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8c6fe0', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{entry.term} — in plain English</div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#1a1916', margin: 0 }}>{entry.simpleEnglish}</p>
        </div>

        {/* Formula if exists */}
        {entry.formula && (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: '#1a1916', marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#a39e97', marginBottom: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>Formula</div>
            <code style={{ fontSize: 14, color: '#d08a59', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1.6 }}>{entry.formula}</code>
          </div>
        )}

        {/* Why it matters */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 12, color: '#1a1916' }}>
            Why {entry.term} matters for your business
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#4a4844' }}>{entry.whyItMatters}</p>
        </section>

        {/* How AskBiz does it */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 16, color: '#1a1916' }}>
            How AskBiz calculates {entry.term} from your data
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#4a4844', marginBottom: 20 }}>{entry.howAskBizDoesIt}</p>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { n: '1', t: 'Upload your data', d: 'Export a CSV or Excel file from your POS, accounting software, or spreadsheet and upload it to AskBiz.' },
              { n: '2', t: `Ask about ${entry.term}`, d: `Type your question in plain English. Try: "What is my ${entry.term.toLowerCase()}?" or "${entry.title}"` },
              { n: '3', t: 'Get your answer instantly', d: 'AskBiz returns the calculation with a chart, KPI breakdown, and specific recommendations — in seconds.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#d08a59', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sora, system-ui)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 14, fontWeight: 600, marginBottom: 3, color: '#1a1916' }}>{s.t}</div>
                  <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.6, margin: 0 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real example */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 14, color: '#1a1916' }}>
            Real-world example
          </h2>
          <div style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e8e6e1', background: '#fff' }}>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: '#4a4844', margin: 0 }}>{entry.example}</p>
          </div>
        </section>

        {/* CTA */}
        <div style={{ padding: 'clamp(24px,4vw,36px)', borderRadius: 20, background: 'linear-gradient(135deg,rgba(208,138,89,.08),rgba(140,111,224,.06))', border: '1px solid rgba(208,138,89,.2)', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, marginBottom: 10, color: '#1a1916' }}>
            Ask AskBiz about your {entry.term}
          </div>
          <p style={{ fontSize: 15, color: '#6b6760', lineHeight: 1.6, marginBottom: 22, maxWidth: 480, margin: '0 auto 22px' }}>
            Upload your CSV or Excel file and ask "{entry.title}" — get the answer with a chart and recommendations in under 60 seconds.
          </p>
          <Link href="/signin" style={{ display: 'inline-block', fontSize: 15, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '12px 28px', textDecoration: 'none' }}>
            Upload your data — free →
          </Link>
          <p style={{ fontSize: 12, color: '#a39e97', marginTop: 10 }}>No card required · 10 free questions · Results in seconds</p>
        </div>

        {/* FAQs */}
        <section style={{ marginBottom: 40 }} itemScope itemType="https://schema.org/FAQPage">
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 20, color: '#1a1916' }}>
            Frequently asked questions about {entry.term}
          </h2>
          {entry.faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < entry.faqs.length - 1 ? '1px solid #e8e6e1' : 'none', padding: '18px 0' }}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1a1916' }} itemProp="name">{faq.q}</div>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.75, margin: 0 }} itemProp="text">{faq.a}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Related terms</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/${r.category}/${r.slug}`} style={{ fontSize: 13, color: '#d08a59', textDecoration: 'none', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(208,138,89,.3)', background: 'rgba(208,138,89,.05)' }}>
                  {r.term} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,32px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#fff' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700, color: '#1a1916' }}>AskBiz</span>
          <span style={{ fontSize: 12, color: '#a39e97' }}>© 2026</span>
        </Link>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[['/', 'Home'], ['/how-to', 'How-to guides'], ['/translate', 'Glossary'], ['/privacy', 'Privacy']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
