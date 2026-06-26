import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { INTEGRATIONS, getIntegration } from '@/lib/integrations-content'
import { getLocale, getT } from '@/lib/i18n-server'
import { localePath, isRTL } from '@/lib/i18n-locale'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const int = getIntegration(params.slug)
  if (!int) return { title: 'Not Found' }
  const locale = getLocale()
  const canonical = `https://askbiz.co${localePath('/integrations/' + int.slug, locale)}`
  return {
    title: `${int.name} Integration | AskBiz`,
    description: int.metaDescription,
    alternates: {
      canonical,
      languages: {
        en: `https://askbiz.co/integrations/${int.slug}`,
        es: `https://askbiz.co/es/integrations/${int.slug}`,
        fr: `https://askbiz.co/fr/integrations/${int.slug}`,
        de: `https://askbiz.co/de/integrations/${int.slug}`,
        nl: `https://askbiz.co/nl/integrations/${int.slug}`,
        ar: `https://askbiz.co/ar/integrations/${int.slug}`,
      },
    },
    openGraph: {
      title: `Connect ${int.name} to AskBiz`,
      description: int.metaDescription,
      url: canonical,
      type: 'website',
      siteName: 'AskBiz',
    },
  }
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

export default function IntegrationPage({ params }: { params: { slug: string } }) {
  const int = getIntegration(params.slug)
  if (!int) notFound()

  const locale = getLocale()
  const t = getT()
  const rtl = isRTL(locale)
  const dir = rtl ? 'rtl' : 'ltr'
  const sk = int.slug.replace(/-/g, '_')

  const integrationsHref = localePath('/integrations', locale)
  const signinHref = localePath('/signin', locale)

  const tOrFallback = (key: string, fallback: string) => {
    const v = t(key)
    return v !== key ? v : fallback
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh', direction: dir }}>

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
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href={integrationsHref} style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>{t('integrations_page.nav_all_integrations')}</Link>
          <Link href={signinHref} style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{t('integrations_page.try_free')}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,32px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: int.color + '15', border: `1px solid ${int.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>{int.icon}</div>
            <div style={{ width: 32, fontSize: 20, color: TX3, textAlign: 'center' }}>+</div>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
          </div>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14 }}>
            {t('integrations_page.slug_hero_connect', { name: int.name })}
          </h1>
          <p style={{ fontSize: 16, color: TX2, lineHeight: 1.7, marginBottom: 28, maxWidth: 600 }}>
            {tOrFallback(`integrations_page.desc_${sk}`, int.longDescription)}
          </p>
          <Link href={signinHref} style={{ fontSize: 14, fontWeight: 700, color: SF, background: int.color, borderRadius: 10, padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}>
            {t('integrations_page.slug_hero_cta', { name: int.name })}
          </Link>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,32px)' }}>

        {/* What you get */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 18, letterSpacing: '-.02em' }}>
            {t('integrations_page.slug_what_you_get')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {int.whatYouGet.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', background: SF, border: `1px solid ${BD}`, borderRadius: 10 }}>
                <span style={{ color: '#27ae60', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, color: TX, lineHeight: 1.5 }}>{tOrFallback(`integrations_page.${sk}_wyg_${i}`, item)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 18, letterSpacing: '-.02em' }}>
            {t('integrations_page.slug_metrics')}
          </h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {int.metrics.map((m, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: int.color, background: int.color + '12', border: `1px solid ${int.color}30`, borderRadius: 9999, padding: '5px 14px' }}>
                {tOrFallback(`integrations_page.${sk}_metric_${i}`, m)}
              </span>
            ))}
          </div>
        </div>

        {/* How to connect */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 18, letterSpacing: '-.02em' }}>
            {t('integrations_page.slug_how_to_connect')}
          </h2>
          <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, overflow: 'hidden' }}>
            {int.setupSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px', borderBottom: i < int.setupSteps.length - 1 ? `1px solid ${BD}` : 'none' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: int.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: 'white' }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 14, color: TX, lineHeight: 1.55, paddingTop: 3 }}>{tOrFallback(`integrations_page.${sk}_step_${i}`, step)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: TX, borderRadius: 16, padding: '36px 32px', textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
            {t('integrations_page.slug_cta_heading', { name: int.name })}
          </h2>
          <p style={{ fontSize: 14, color: '#b0b8c8', marginBottom: 24 }}>{t('integrations_page.slug_cta_sub')}</p>
          <Link href={signinHref} style={{ fontSize: 14, fontWeight: 700, color: TX, background: ACC, borderRadius: 10, padding: '13px 28px', textDecoration: 'none', display: 'inline-block' }}>
            {t('integrations_page.slug_cta_button', { name: int.name })}
          </Link>
        </div>

        {/* Other integrations */}
        <div>
          <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 14 }}>{t('integrations_page.slug_other_integrations')}</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {INTEGRATIONS.filter(i => i.slug !== int.slug && i.popular).map(other => (
              <Link key={other.slug} href={localePath('/integrations/' + other.slug, locale)} style={{ fontSize: 13, color: TX2, background: SF, border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                {other.icon} {other.name}
              </Link>
            ))}
            <Link href={integrationsHref} style={{ fontSize: 13, color: ACC, background: SF, border: `1px solid ${ACC}30`, borderRadius: 8, padding: '6px 14px', textDecoration: 'none', fontWeight: 600 }}>
              {t('integrations_page.slug_view_all')}
            </Link>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
        <span style={{ fontSize: 12, color: TX3 }}>{t('integrations_page.footer_copy')}</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([
            ['/', 'footer_home'],
            ['/integrations', 'footer_integrations'],
            ['/help', 'footer_help'],
            ['/privacy', 'footer_privacy'],
          ] as [string, string][]).map(([href, key]) => (
            <Link key={href} href={localePath(href, locale)} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>
              {t('integrations_page.' + key)}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
