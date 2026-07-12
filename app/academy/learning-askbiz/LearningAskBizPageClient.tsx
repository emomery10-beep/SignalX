'use client'

import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { ASKBIZ_TRAINING_ARTICLES } from '@/lib/askbiz-training-articles'
import { ASKBIZ_POS_TRAINING_ARTICLES } from '@/lib/askbiz-pos-training-articles'
import { ASKBIZ_POS_RETAIL_ARTICLES } from '@/lib/askbiz-pos-retail-articles'
import { ASKBIZ_POS_LOGISTICS_ARTICLES } from '@/lib/askbiz-pos-logistics-articles'
import { ASKBIZ_POS_TILL_ARTICLES } from '@/lib/askbiz-pos-till-articles'
import { ASKBIZ_POS_HACKS_ARTICLES } from '@/lib/askbiz-pos-hacks-articles'
import { ASKBIZ_POS_REPORTS_ARTICLES } from '@/lib/askbiz-pos-reports-articles'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

const DIFF_COLOR: Record<string, string> = {
  Beginner:     '#27ae60',
  Intermediate: '#e8734a',
  Advanced:     '#e74c3c',
}

const GETTING_STARTED = ASKBIZ_TRAINING_ARTICLES
const POS_ARTICLES = ASKBIZ_POS_TRAINING_ARTICLES
const POS_RETAIL_ARTICLES = ASKBIZ_POS_RETAIL_ARTICLES
const POS_LOGISTICS_ARTICLES = ASKBIZ_POS_LOGISTICS_ARTICLES
const POS_TILL_ARTICLES = ASKBIZ_POS_TILL_ARTICLES
const POS_HACKS_ARTICLES = ASKBIZ_POS_HACKS_ARTICLES
const POS_REPORTS_ARTICLES = ASKBIZ_POS_REPORTS_ARTICLES
const ARTICLES = [...GETTING_STARTED, ...POS_ARTICLES, ...POS_RETAIL_ARTICLES, ...POS_LOGISTICS_ARTICLES, ...POS_TILL_ARTICLES, ...POS_HACKS_ARTICLES, ...POS_REPORTS_ARTICLES]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'All About Learning AskBiz',
  description: '10 step-by-step training articles to help you master AskBiz — from your first login to advanced features.',
  url: 'https://askbiz.co/academy/learning-askbiz',
  numberOfItems: ARTICLES.length,
  itemListElement: ARTICLES.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: a.title,
    description: a.description,
    url: `https://askbiz.co/academy/${a.slug}`,
  })),
}

export default function LearningAskBizPageClient() {
  const { lang, tc } = useLang()
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .lab-card       { transition: transform 140ms, box-shadow 140ms; text-decoration: none; color: inherit; display: block; }
        .lab-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .lab-step       { transition: background 100ms; }
        .lab-step:hover { background: rgba(208,138,89,.06); }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href={localePath('/', lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
          </Link>
        </div>
        <Link href={localePath('/signin', lang)} style={{ fontSize: 11, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{tc('academy.lab_try_free')}</Link>
      </nav>

      {/* Breadcrumbs */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: '10px clamp(16px,4vw,48px)', fontSize: 11, color: TX3 }}>
        <Link href={localePath('/', lang)} style={{ color: TX3, textDecoration: 'none' }}>{tc('academy.lab_breadcrumb_home')}</Link>
        {' / '}
        <Link href={localePath('/academy', lang)} style={{ color: TX3, textDecoration: 'none' }}>{tc('academy.lab_breadcrumb_academy')}</Link>
        {' / '}
        <span style={{ color: TX }}>{tc('academy.lab_hero_title')}</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${TX} 0%, #2c2a26 100%)`, padding: 'clamp(40px,6vw,72px) clamp(24px,4vw,48px)', textAlign: 'center' }}>
        <div style={{ fontSize: 38, marginBottom: 12 }}>🎓</div>
        <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, letterSpacing: '-.025em', color: SF, marginBottom: 12 }}>
          {tc('academy.lab_hero_title')}
        </h1>
        <p style={{ fontSize: 'clamp(14px,1.6vw,17px)', color: TX3, maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.6 }}>
          {ARTICLES.length} {tc('academy.lab_hero_subtitle_suffix')}
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', fontSize: 11, color: '#a39e97' }}>
          <span>📚 {ARTICLES.length} {tc('academy.lab_hero_stat_articles')}</span>
          <span>⏱ {ARTICLES.reduce((s, a) => s + a.readTime, 0)} {tc('academy.lab_hero_stat_min')}</span>
          <span>🆓 {tc('academy.lab_hero_stat_free')}</span>
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,24px)' }}>

        {/* Intro */}
        <div style={{ background: SF, border: `1.5px solid ${BD}`, borderRadius: 14, padding: 'clamp(20px,3vw,32px)', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 16, fontWeight: 700, color: TX, marginBottom: 8, letterSpacing: '-.02em' }}>
            {tc('academy.lab_how_to_title')}
          </h2>
          <p style={{ fontSize: 12, color: TX2, lineHeight: 1.7, margin: 0 }}>
            {tc('academy.lab_how_to_body')}
          </p>
        </div>

        {/* Section helper */}
        {([
          { label: '🚀 Getting Started', sublabel: 'Your first steps on the platform', articles: GETTING_STARTED, offset: 0 },
          { label: '🛒 Point of Sale', sublabel: 'Every POS feature, step by step', articles: POS_ARTICLES, offset: GETTING_STARTED.length },
          { label: '🏪 POS Retail Section', sublabel: 'Products, stock, pricing, and supplier workflows', articles: POS_RETAIL_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length },
          { label: '🚚 POS Logistics Section', sublabel: 'Deliveries, drivers, fleet, and route management', articles: POS_LOGISTICS_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length + POS_RETAIL_ARTICLES.length },
          { label: '🛒 POS Till & Checkout', sublabel: 'Payments, discounts, receipts, cash management, and cashier tools', articles: POS_TILL_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length + POS_RETAIL_ARTICLES.length + POS_LOGISTICS_ARTICLES.length },
          { label: '⚡ POS Shortcuts & Hacks', sublabel: 'Power-user tips to work faster at the till and in the back office', articles: POS_HACKS_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length + POS_RETAIL_ARTICLES.length + POS_LOGISTICS_ARTICLES.length + POS_TILL_ARTICLES.length },
          { label: '📊 POS Reports & Analytics', sublabel: 'Read every report, spot trends, and make data-driven decisions', articles: POS_REPORTS_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length + POS_RETAIL_ARTICLES.length + POS_LOGISTICS_ARTICLES.length + POS_TILL_ARTICLES.length + POS_HACKS_ARTICLES.length },
        ] as { label: string; sublabel: string; articles: typeof ARTICLES; offset: number }[]).map(({ label, sublabel, articles, offset }) => (
          <div key={label} style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, letterSpacing: '-.02em', margin: '0 0 2px' }}>{label}</h2>
              <p style={{ fontSize: 11, color: TX3, margin: 0 }}>{sublabel}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {articles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={localePath(`/academy/${article.slug}`, lang)}
                  className="lab-card"
                  style={{ background: SF, border: `1.5px solid ${BD}`, borderRadius: 14, padding: 0, overflow: 'hidden' }}
                >
                  <div className="lab-step" style={{ display: 'flex', gap: 'clamp(12px,2vw,20px)', alignItems: 'flex-start', padding: 'clamp(16px,2vw,24px)' }}>
                    {/* Step number */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: `${ACC}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: ACC, flexShrink: 0
                    }}>
                      {offset + i + 1}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 600, color: DIFF_COLOR[article.difficulty] ?? TX2,
                          background: `${DIFF_COLOR[article.difficulty] ?? TX2}14`,
                          padding: '2px 8px', borderRadius: 6
                        }}>
                          {article.difficulty}
                        </span>
                        <span style={{ fontSize: 10, color: TX3 }}>{article.readTime} {tc('academy.lab_min_read')}</span>
                      </div>

                      <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(15px,1.4vw,17px)', fontWeight: 600, color: TX, letterSpacing: '-.02em', marginBottom: 4, lineHeight: 1.35 }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: 11, color: TX2, margin: 0, lineHeight: 1.5 }}>
                        {article.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <svg style={{ flexShrink: 0, marginTop: 14 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${TX} 0%, #2c2a26 100%)`,
          borderRadius: 16, padding: 'clamp(28px,4vw,44px)', textAlign: 'center', marginTop: 40
        }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: SF, marginBottom: 8, letterSpacing: '-.025em' }}>
            {tc('academy.lab_cta_title')}
          </h2>
          <p style={{ fontSize: 12, color: TX3, marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            {tc('academy.lab_cta_body')}
          </p>
          <Link href={localePath('/signin', lang)} style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600, color: TX,
            background: ACC, borderRadius: 9999, padding: '12px 28px', textDecoration: 'none'
          }}>
            {tc('academy.lab_cta_button')}
          </Link>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BD}`, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {([
            [tc('academy.lab_footer_academy'), '/academy'],
            [tc('academy.lab_footer_paths'), '/academy/learning-paths'],
            [tc('academy.lab_footer_checklists'), '/academy/checklists'],
            [tc('academy.lab_footer_free_tools'), '/free-tools'],
            [tc('academy.lab_footer_pricing'), '/pricing'],
          ] as [string, string][]).map(([label, href]) => (
            <Link key={href} href={localePath(href, lang)} style={{ fontSize: 11, color: TX2, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </main>
    </div>
  )
}
