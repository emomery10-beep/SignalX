import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import { resolveLocale, localePath } from '@/lib/i18n-locale'
import { t as catalogT } from '@/lib/i18n-catalog'
import { COMPARISONS } from '@/lib/comparisons-content'

export const metadata: Metadata = {
  title: 'AskBiz vs Competitors — Compare Business Intelligence Tools',
  description: 'See how AskBiz compares to Google Looker Studio, Power BI, Tableau, Metabase, Databox, and more — feature by feature, for SME founders.',
  alternates: { canonical: 'https://askbiz.co/vs' },
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

export default function VsIndexPage() {
  const lang = resolveLocale({ urlLocale: headers().get('x-locale'), cookie: cookies().get('askbiz_lang')?.value })
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .vs-card { transition: transform 140ms, box-shadow 140ms; text-decoration: none; }
        .vs-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important; }
      `}</style>

      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href={localePath('/', lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <Link href={localePath('/signin', lang)} style={{ fontSize: 11, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{catalogT(lang, 'vs.try_free')}</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(16px,4vw,32px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14 }}>
            {catalogT(lang, 'vs.vs_the_alternatives')}
          </h1>
          <p style={{ fontSize: 14, color: TX2, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            {catalogT(lang, 'vs.index_subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {COMPARISONS.map(c => (
            <Link
              key={c.slug}
              href={localePath(`/vs/${c.slug}`, lang)}
              className="vs-card"
              style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '24px 22px', display: 'block' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: ACC + '18', border: `1px solid ${ACC}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: ACC, fontFamily: 'Sora, system-ui' }}>A</div>
                <span style={{ fontSize: 14, color: TX3 }}>vs</span>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: c.theirColor + '18', border: `1px solid ${c.theirColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: c.theirColor, fontFamily: 'Sora, system-ui' }}>{c.competitor[0]}</div>
              </div>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, color: TX, marginBottom: 6 }}>{catalogT(lang, 'vs.askbiz_vs', { competitor: c.competitor })}</div>
              <p style={{ fontSize: 11, color: TX2, lineHeight: 1.55, marginBottom: 14 }}>{c.description.slice(0, 100)}…</p>
              <span style={{ fontSize: 10, color: ACC, fontWeight: 600 }}>{catalogT(lang, 'vs.see_comparison')}</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 64, padding: '32px', background: SF, border: `1px solid ${BD}`, borderRadius: 16, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 10 }}>{catalogT(lang, 'vs.ready_heading')}</h2>
          <p style={{ fontSize: 12, color: TX2, marginBottom: 20 }}>{catalogT(lang, 'vs.ready_body')}</p>
          <Link href={localePath('/signin', lang)} style={{ fontSize: 12, fontWeight: 700, color: SF, background: ACC, borderRadius: 10, padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}>{catalogT(lang, 'vs.start_free_trial')}</Link>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
        <span style={{ fontSize: 10, color: TX3 }}>{catalogT(lang, 'vs.footer_copyright')}</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/','vs.footer_home'],['/academy','vs.footer_academy'],['/help','vs.footer_help'],['/privacy','vs.footer_privacy']] as [string,string][]).map(([href, key]) => (
            <Link key={href} href={localePath(href, lang)} style={{ fontSize: 10, color: TX3, textDecoration: 'none' }}>{catalogT(lang, key)}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
