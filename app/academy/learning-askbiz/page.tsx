'use client'

import Link from 'next/link'
import { ASKBIZ_TRAINING_ARTICLES } from '@/lib/askbiz-training-articles'
import { ASKBIZ_POS_TRAINING_ARTICLES } from '@/lib/askbiz-pos-training-articles'
import { ASKBIZ_POS_RETAIL_ARTICLES } from '@/lib/askbiz-pos-retail-articles'
import { ASKBIZ_POS_LOGISTICS_ARTICLES } from '@/lib/askbiz-pos-logistics-articles'
import { ASKBIZ_POS_TILL_ARTICLES } from '@/lib/askbiz-pos-till-articles'

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
const ARTICLES = [...GETTING_STARTED, ...POS_ARTICLES, ...POS_RETAIL_ARTICLES, ...POS_LOGISTICS_ARTICLES, ...POS_TILL_ARTICLES]

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

export default function LearningAskBizPage() {
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
        </div>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      {/* Breadcrumbs */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: '10px clamp(16px,4vw,48px)', fontSize: 13, color: TX3 }}>
        <Link href="/" style={{ color: TX3, textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href="/academy" style={{ color: TX3, textDecoration: 'none' }}>Academy</Link>
        {' / '}
        <span style={{ color: TX }}>All About Learning AskBiz</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${TX} 0%, #2c2a26 100%)`, padding: 'clamp(40px,6vw,72px) clamp(24px,4vw,48px)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
        <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, letterSpacing: '-.025em', color: SF, marginBottom: 12 }}>
          All About Learning AskBiz
        </h1>
        <p style={{ fontSize: 'clamp(14px,1.6vw,17px)', color: TX3, maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.6 }}>
          {ARTICLES.length} step-by-step training articles to help you master AskBiz — from your first login through every feature of the Point of Sale.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: '#a39e97' }}>
          <span>📚 {ARTICLES.length} articles</span>
          <span>⏱ {ARTICLES.reduce((s, a) => s + a.readTime, 0)} min total</span>
          <span>🆓 Free to read</span>
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,24px)' }}>

        {/* Intro */}
        <div style={{ background: SF, border: `1.5px solid ${BD}`, borderRadius: 14, padding: 'clamp(20px,3vw,32px)', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 8, letterSpacing: '-.02em' }}>
            How to use this training
          </h2>
          <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: 0 }}>
            These articles are designed to be read in order. Start with getting set up, learn how to navigate the platform, then explore the features that matter most to your business. Each article takes 4–6 minutes to read and includes practical steps you can follow along with in your own AskBiz account.
          </p>
        </div>

        {/* Section helper */}
        {([
          { label: '🚀 Getting Started', sublabel: 'Your first steps on the platform', articles: GETTING_STARTED, offset: 0 },
          { label: '🛒 Point of Sale', sublabel: 'Every POS feature, step by step', articles: POS_ARTICLES, offset: GETTING_STARTED.length },
          { label: '🏪 POS Retail Section', sublabel: 'Products, stock, pricing, and supplier workflows', articles: POS_RETAIL_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length },
          { label: '🚚 POS Logistics Section', sublabel: 'Deliveries, drivers, fleet, and route management', articles: POS_LOGISTICS_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length + POS_RETAIL_ARTICLES.length },
          { label: '🛒 POS Till & Checkout', sublabel: 'Payments, discounts, receipts, cash management, and cashier tools', articles: POS_TILL_ARTICLES, offset: GETTING_STARTED.length + POS_ARTICLES.length + POS_RETAIL_ARTICLES.length + POS_LOGISTICS_ARTICLES.length },
        ] as { label: string; sublabel: string; articles: typeof ARTICLES; offset: number }[]).map(({ label, sublabel, articles, offset }) => (
          <div key={label} style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 16, fontWeight: 700, color: TX, letterSpacing: '-.02em', margin: '0 0 2px' }}>{label}</h2>
              <p style={{ fontSize: 13, color: TX3, margin: 0 }}>{sublabel}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {articles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/academy/${article.slug}`}
                  className="lab-card"
                  style={{ background: SF, border: `1.5px solid ${BD}`, borderRadius: 14, padding: 0, overflow: 'hidden' }}
                >
                  <div className="lab-step" style={{ display: 'flex', gap: 'clamp(12px,2vw,20px)', alignItems: 'flex-start', padding: 'clamp(16px,2vw,24px)' }}>
                    {/* Step number */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: `${ACC}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: ACC, flexShrink: 0
                    }}>
                      {offset + i + 1}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: DIFF_COLOR[article.difficulty] ?? TX2,
                          background: `${DIFF_COLOR[article.difficulty] ?? TX2}14`,
                          padding: '2px 8px', borderRadius: 6
                        }}>
                          {article.difficulty}
                        </span>
                        <span style={{ fontSize: 12, color: TX3 }}>{article.readTime} min read</span>
                      </div>

                      <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(15px,1.4vw,17px)', fontWeight: 600, color: TX, letterSpacing: '-.02em', marginBottom: 4, lineHeight: 1.35 }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: 13, color: TX2, margin: 0, lineHeight: 1.5 }}>
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
            Ready to try AskBiz?
          </h2>
          <p style={{ fontSize: 14, color: TX3, marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
            Start free — no credit card needed. Connect your data and get your first insight in under 30 minutes.
          </p>
          <Link href="/signin" style={{
            display: 'inline-block', fontSize: 14, fontWeight: 600, color: TX,
            background: ACC, borderRadius: 9999, padding: '12px 28px', textDecoration: 'none'
          }}>
            Start free — no card needed
          </Link>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BD}`, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {([
            ['Academy Home', '/academy'],
            ['Learning Paths', '/academy/learning-paths'],
            ['Checklists', '/academy/checklists'],
            ['Free Tools', '/free-tools'],
            ['Pricing', '/pricing'],
          ] as [string, string][]).map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </main>
    </div>
  )
}
