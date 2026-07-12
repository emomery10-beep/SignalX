import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale, getT } from '@/lib/i18n-server'
import { localePath } from '@/lib/i18n-locale'

export async function generateMetadata(): Promise<Metadata> {
  const t = getT()
  const locale = getLocale()
  return {
    title: t('compare.meta_title'),
    description: t('compare.meta_description'),
    alternates: {
      canonical: `https://askbiz.co${localePath('/compare', locale)}`,
      languages: {
        'x-default': 'https://askbiz.co/compare',
        'en': 'https://askbiz.co/compare',
        'en-KE': 'https://askbiz.co/compare',
        'en-NG': 'https://askbiz.co/compare',
        'en-UG': 'https://askbiz.co/compare',
        'en-GB': 'https://askbiz.co/compare',
        'en-US': 'https://askbiz.co/compare',
      },
    },
    openGraph: {
      title: t('compare.og_title'),
      description: t('compare.og_description'),
      url: `https://askbiz.co${localePath('/compare', locale)}`,
      type: 'website',
      siteName: 'AskBiz',
      images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz vs Shopify vs Power BI — phone POS comparison' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('compare.og_title'),
      description: t('compare.og_description'),
      images: ['https://askbiz.co/og-image.png'],
    },
  }
}

const COMPARE_BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://askbiz.co' },
    { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://askbiz.co/compare' },
  ],
}

const COMPARE_SOFTWARE_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AskBiz',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android, iOS',
  url: 'https://askbiz.co',
  description: 'Phone POS and daily business tracker for market stalls, street vendors, and small businesses. Take M-Pesa, cash, or card. Camera scan, no hardware needed.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP', description: 'Free to start — no card required. POS add-on from £5/seat/month.' },
  publisher: { '@type': 'Organization', name: 'AskBiz', url: 'https://askbiz.co' },
}

const COMPARE_FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does AskBiz compare to Shopify?',
      acceptedAnswer: { '@type': 'Answer', text: 'Shopify is an ecommerce platform built for online stores. AskBiz is a phone POS built for in-person selling — market stalls, street vendors, and physical shops. AskBiz supports M-Pesa, MTN, and Airtel natively and requires no hardware. It starts free vs Shopify\'s $29/month minimum.' },
    },
    {
      '@type': 'Question',
      name: 'How does AskBiz compare to Power BI?',
      acceptedAnswer: { '@type': 'Answer', text: 'Power BI is a business intelligence tool requiring a data team and technical setup. AskBiz is designed for business owners who want to know what they made today without a spreadsheet or IT department. It combines POS, stock tracking, and daily reporting in one phone app.' },
    },
    {
      '@type': 'Question',
      name: 'Does AskBiz work without internet?',
      acceptedAnswer: { '@type': 'Answer', text: 'AskBiz works best with a data connection. For low-connectivity environments, it is optimised for 2G/3G speeds common in Kenya, Nigeria, and Uganda.' },
    },
    {
      '@type': 'Question',
      name: 'How does AskBiz compare to Square?',
      acceptedAnswer: { '@type': 'Answer', text: 'Square requires a card reader (hardware) and charges transaction fees from day one. AskBiz requires no hardware — your phone is your till. AskBiz also supports M-Pesa, MTN Mobile Money, and Airtel Money, which Square does not. AskBiz is free to start with no card required.' },
    },
    {
      '@type': 'Question',
      name: 'How does AskBiz compare to SumUp or iZettle?',
      acceptedAnswer: { '@type': 'Answer', text: 'SumUp and iZettle both require a physical card reader to take payments. AskBiz takes M-Pesa, MTN Mobile Money, Airtel Money, and cash — all from your phone, with no hardware. For businesses in Africa where mobile money is the primary payment method, SumUp and iZettle are not viable alternatives.' },
    },
    {
      '@type': 'Question',
      name: 'How does AskBiz compare to Yoco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yoco is a South Africa-focused card payment solution that requires a card machine. AskBiz works across all of Africa with no hardware — just a phone. AskBiz supports M-Pesa (Kenya), MTN Mobile Money (Nigeria, Uganda, Ghana), and Airtel Money, plus cash and card via Stripe. It also includes stock management, daily reporting, and staff tracking that Yoco does not offer.' },
    },
    {
      '@type': 'Question',
      name: 'What cities and countries does AskBiz serve?',
      acceptedAnswer: { '@type': 'Answer', text: 'AskBiz is used by businesses in Nairobi, Lagos, Kampala, Accra, Dar es Salaam, Abuja, Abidjan, Lusaka, Harare, Kigali, and across Africa, as well as the United Kingdom. Pricing is available in KES, NGN, GHS, UGX, ZAR, GBP, USD, and more.' },
    },
  ],
}

type T = (key: string) => string

const C = {
  bg: '#f9f8f6', sf: '#ffffff', ev: '#f3f2ef',
  tx: '#1a1916', tx2: '#6b6760', tx3: '#a39e97',
  b: 'rgba(0,0,0,.08)', b2: 'rgba(0,0,0,.14)',
  acc: '#d08a59', accBg: 'rgba(208,138,89,.08)', accBdr: 'rgba(208,138,89,.25)',
  green: '#16a34a', greenBg: 'rgba(22,163,74,.07)',
  red: '#dc2626', redBg: 'rgba(220,38,38,.06)',
}

const buildRows = (t: T) => [
  {
    feature: t('compare.row_pricing_feature'),
    askbiz: t('compare.row_pricing_askbiz'),
    shopify: t('compare.row_pricing_shopify'),
    powerbi: t('compare.row_pricing_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_pos_feature'),
    askbiz: t('compare.row_pos_askbiz'),
    shopify: t('compare.row_pos_shopify'),
    powerbi: t('compare.row_pos_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_camera_feature'),
    askbiz: t('compare.row_camera_askbiz'),
    shopify: t('compare.row_camera_shopify'),
    powerbi: t('compare.row_camera_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_inventory_feature'),
    askbiz: t('compare.row_inventory_askbiz'),
    shopify: t('compare.row_inventory_shopify'),
    powerbi: t('compare.row_inventory_powerbi'),
    askbizWin: false,
  },
  {
    feature: t('compare.row_ai_feature'),
    askbiz: t('compare.row_ai_askbiz'),
    shopify: t('compare.row_ai_shopify'),
    powerbi: t('compare.row_ai_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_mobilemoney_feature'),
    askbiz: t('compare.row_mobilemoney_askbiz'),
    shopify: t('compare.row_mobilemoney_shopify'),
    powerbi: t('compare.row_mobilemoney_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_bi_feature'),
    askbiz: t('compare.row_bi_askbiz'),
    shopify: t('compare.row_bi_shopify'),
    powerbi: t('compare.row_bi_powerbi'),
    askbizWin: false,
  },
  {
    feature: t('compare.row_setup_feature'),
    askbiz: t('compare.row_setup_askbiz'),
    shopify: t('compare.row_setup_shopify'),
    powerbi: t('compare.row_setup_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_offline_feature'),
    askbiz: t('compare.row_offline_askbiz'),
    shopify: t('compare.row_offline_shopify'),
    powerbi: t('compare.row_offline_powerbi'),
    askbizWin: false,
  },
  {
    feature: t('compare.row_multibranch_feature'),
    askbiz: t('compare.row_multibranch_askbiz'),
    shopify: t('compare.row_multibranch_shopify'),
    powerbi: t('compare.row_multibranch_powerbi'),
    askbizWin: false,
  },
  {
    feature: t('compare.row_sector_feature'),
    askbiz: t('compare.row_sector_askbiz'),
    shopify: t('compare.row_sector_shopify'),
    powerbi: t('compare.row_sector_powerbi'),
    askbizWin: true,
  },
  {
    feature: t('compare.row_nobi_feature'),
    askbiz: t('compare.row_nobi_askbiz'),
    shopify: t('compare.row_nobi_shopify'),
    powerbi: t('compare.row_nobi_powerbi'),
    askbizWin: true,
  },
]

const buildVerdict = (t: T) =>
  [0, 1, 2, 3].map(i => ({
    title: t('compare.verdict_' + i + '_title'),
    winner: t('compare.verdict_' + i + '_winner'),
    reason: t('compare.verdict_' + i + '_reason'),
    notThis: t('compare.verdict_' + i + '_notThis'),
    notReason: t('compare.verdict_' + i + '_notReason'),
  }))

export default function ComparePage() {
  const t = getT()
  const locale = getLocale()
  const ROWS = buildRows(t)
  const VERDICT = buildVerdict(t)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COMPARE_BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COMPARE_SOFTWARE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COMPARE_FAQ_LD) }} />
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 767px) { .compare-table { display: none } .compare-mobile { display: block !important } }
        @media (min-width: 768px) { .compare-mobile { display: none !important } }
      `}</style>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ background: 'rgba(249,248,246,.9)', borderBottom: `1px solid ${C.b}`, padding: '0 clamp(16px,4vw,32px)' }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: '7px 0', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.tx3 }}>
          <li><Link href={localePath('/', locale)} style={{ color: C.tx3, textDecoration: 'none' }}>Home</Link></li>
          <li style={{ margin: '0 2px' }}>›</li>
          <li style={{ color: C.tx2, fontWeight: 500 }}>Compare</li>
        </ol>
      </nav>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(249,248,246,.96)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.b}`, padding: '0 clamp(16px,4vw,32px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={localePath('/', locale)} style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 800, color: C.tx, textDecoration: 'none', letterSpacing: '-.03em' }}>
          ask<span style={{ color: C.acc }}>biz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href={localePath('/pricing', locale)} style={{ fontSize: 11, color: C.tx2, textDecoration: 'none', fontWeight: 500 }}>{t('compare.nav_pricing')}</Link>
          <Link href={localePath('/signin', locale)} style={{ padding: '8px 18px', borderRadius: 9999, background: C.acc, color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
            {t('compare.nav_try_free')}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,40px) clamp(32px,5vw,56px)', textAlign: 'center' }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: C.acc, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 20 }}>{t('compare.hero_eyebrow')}</p>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: 20, color: C.tx }}>
          {t('compare.hero_h1')}
        </h1>
        <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: C.tx2, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px' }}>
          {t('compare.hero_subtitle')}
        </p>

        {/* Pricing clarity strip */}
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', padding: '14px 20px', background: C.greenBg, border: `1px solid rgba(22,163,74,.18)`, borderRadius: 12, marginBottom: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{t('compare.strip_askbiz_name')}</div>
            <div style={{ fontSize: 10, color: C.tx2 }}>{t('compare.strip_askbiz_price')}</div>
          </div>
          <div style={{ width: 1, background: C.b, alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.tx2 }}>{t('compare.strip_shopify_name')}</div>
            <div style={{ fontSize: 10, color: C.tx3 }}>{t('compare.strip_shopify_price')}</div>
          </div>
          <div style={{ width: 1, background: C.b, alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.tx2 }}>{t('compare.strip_powerbi_name')}</div>
            <div style={{ fontSize: 10, color: C.tx3 }}>{t('compare.strip_powerbi_price')}</div>
          </div>
        </div>
        <p style={{ fontSize: 9, color: C.tx3, marginTop: 6 }}>
          {t('compare.strip_note')}
        </p>
      </section>

      {/* Comparison table */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(60px,8vw,96px)' }}>
        <div className="compare-table" style={{ background: C.sf, borderRadius: 14, border: `1px solid ${C.b2}`, overflow: 'hidden' }}>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr', background: C.ev, borderBottom: `1px solid ${C.b2}` }}>
            {[t('compare.col_feature'), t('compare.col_askbiz'), t('compare.col_shopify'), t('compare.col_powerbi')].map((h, i) => (
              <div key={i} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: i === 1 ? C.acc : C.tx2, letterSpacing: '.06em', textTransform: 'uppercase', borderRight: i < 3 ? `1px solid ${C.b}` : undefined }}>
                {h}
              </div>
            ))}
          </div>

          {ROWS.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr', borderBottom: i < ROWS.length - 1 ? `1px solid ${C.b}` : undefined, background: i % 2 === 0 ? C.sf : C.bg }}>
              <div style={{ padding: '14px 20px', fontSize: 11, fontWeight: 600, color: C.tx, borderRight: `1px solid ${C.b}` }}>{row.feature}</div>
              <div style={{ padding: '14px 20px', fontSize: 10, color: C.tx2, lineHeight: 1.55, borderRight: `1px solid ${C.b}`, background: row.askbizWin ? C.accBg : undefined }}>
                {row.askbiz}
              </div>
              <div style={{ padding: '14px 20px', fontSize: 10, color: C.tx2, lineHeight: 1.55, borderRight: `1px solid ${C.b}` }}>{row.shopify}</div>
              <div style={{ padding: '14px 20px', fontSize: 10, color: C.tx2, lineHeight: 1.55 }}>{row.powerbi}</div>
            </div>
          ))}
        </div>

        {/* Mobile — card stack */}
        <div className="compare-mobile" style={{ display: 'none' }}>
          {ROWS.map((row, i) => (
            <div key={i} style={{ background: C.sf, borderRadius: 10, border: `1px solid ${C.b2}`, padding: '16px', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.tx, marginBottom: 10 }}>{row.feature}</div>
              {[[t('compare.col_askbiz'), row.askbiz, true], [t('compare.col_shopify'), row.shopify, false], [t('compare.col_powerbi'), row.powerbi, false]].map(([name, val, isAsk], j) => (
                <div key={j} style={{ marginBottom: 8, padding: '8px 10px', borderRadius: 7, background: isAsk && row.askbizWin ? C.accBg : C.bg }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: isAsk ? C.acc : C.tx3, marginBottom: 2 }}>{name as string}</div>
                  <div style={{ fontSize: 10, color: C.tx2, lineHeight: 1.5 }}>{val as string}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Verdict section */}
      <section style={{ background: C.ev, borderTop: `1px solid ${C.b2}`, borderBottom: `1px solid ${C.b2}`, padding: 'clamp(56px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: C.acc, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>{t('compare.verdict_eyebrow')}</p>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 40, color: C.tx }}>
            {t('compare.verdict_heading')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {VERDICT.map((v, i) => (
              <div key={i} style={{ background: C.sf, borderRadius: 12, border: `1px solid ${C.b2}`, padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.tx2, marginBottom: 12 }}>{t('compare.verdict_if_label')} {v.title}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 9, background: C.greenBg, border: `1px solid rgba(22,163,74,.2)` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>{t('compare.verdict_use_label')} {v.winner}</div>
                    <div style={{ fontSize: 10, color: C.tx2, lineHeight: 1.55 }}>{v.reason}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 9, background: C.redBg, border: `1px solid rgba(220,38,38,.12)` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.red, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>{t('compare.verdict_not_label')} {v.notThis}</div>
                    <div style={{ fontSize: 10, color: C.tx2, lineHeight: 1.55 }}>{v.notReason}</div>
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
            {t('compare.cta_heading')}
          </h2>
          <p style={{ fontSize: 13, color: C.tx2, lineHeight: 1.7, marginBottom: 28 }}>
            {t('compare.cta_subtitle')}
          </p>
          <Link href={localePath('/signin?mode=signup', locale)} style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 9999, background: C.acc, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 20px rgba(208,138,89,.3)` }}>
            {t('compare.cta_button')}
          </Link>
          <p style={{ fontSize: 10, color: C.tx3, marginTop: 12 }}>
            <Link href={localePath('/pricing', locale)} style={{ color: C.acc, textDecoration: 'none' }}>{t('compare.cta_pricing_link')}</Link>
            {' '}·{' '}
            <Link href={localePath('/point-of-sale', locale)} style={{ color: C.tx3, textDecoration: 'none' }}>{t('compare.cta_pos_link')}</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.b}`, padding: '20px clamp(16px,4vw,40px)', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {([['/', t('compare.footer_home')], ['/pricing', t('compare.footer_pricing')], ['/point-of-sale', t('compare.footer_pos')], ['/blog', t('compare.footer_blog')]] as [string, string][]).map(([href, label]) => (
          <Link key={href} href={localePath(href, locale)} style={{ fontSize: 10, color: C.tx3, textDecoration: 'none' }}>{label}</Link>
        ))}
      </footer>
    </div>
    </>
  )
}
