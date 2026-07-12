import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale, getT } from '@/lib/i18n-server'
import { localePath } from '@/lib/i18n-locale'

export async function generateMetadata(): Promise<Metadata> {
  const t = getT()
  return {
    title: t('terms.meta_title'),
    description: t('terms.meta_description'),
  }
}

const COMPANY = 'AskBiz Ltd'
const EMAIL = 'legal@askbiz.co'
const PRIVACY_EMAIL = 'privacy@askbiz.co'

export default function TermsPage() {
  const t = getT()
  const locale = getLocale()
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-dm, DM Sans, sans-serif)' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, background: 'rgba(249,248,246,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--b)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
        <Link href={localePath('/', locale)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--tx)' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background:'#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 13, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href={localePath('/signin', locale)} style={{ padding: '7px 16px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
          {t('terms.nav_cta')}
        </Link>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '52px 24px 80px' }}>

        {locale !== 'en' && (
          <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 10, background: 'rgba(234,179,8,.08)', border: '1px solid rgba(234,179,8,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>⚠️ {t('common.legal_mt_notice')}</span>
            <Link href="/terms" style={{ fontSize: 11, fontWeight: 600, color: 'var(--acc, #d08a59)', whiteSpace: 'nowrap', textDecoration: 'none' }}>{t('common.legal_mt_link')}</Link>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>{t('terms.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 34, fontWeight: 700, letterSpacing: '-.025em', marginBottom: 12 }}>{t('terms.h1')}</h1>
          <p style={{ fontSize: 13, color: 'var(--tx2)' }}>{t('terms.last_updated_line')}</p>
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.2)', fontSize: 12, color: 'var(--tx2)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--tx)' }}>{t('terms.summary_label')}</strong> {t('terms.summary_body')}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          <Section title={t('terms.sec_1_title')}>
            <p>{t('terms.sec_1_p1')}</p>
            <p>{t('terms.sec_1_p2')}</p>
            <p>{t('terms.sec_1_p3')}</p>
          </Section>

          <Section title={t('terms.sec_2_title')}>
            <p>{t('terms.sec_2_p1')}</p>
            <ul>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <li key={i}><strong>{t('terms.sec_2_li_' + i + '_term')}</strong>{t('terms.sec_2_li_' + i + '_body')}</li>
              ))}
            </ul>
          </Section>

          <Section title={t('terms.sec_3_title')}>
            <p>{t('terms.sec_3_p1_a')}<strong>{t('terms.sec_3_p1_strong')}</strong>{t('terms.sec_3_p1_b')}</p>
            <p>{t('terms.sec_3_p2')}</p>
            <p>{t('terms.sec_3_p3')}</p>
            <ul>
              <li>{t('terms.sec_3_li_0')}</li>
              <li>{t('terms.sec_3_li_1')}</li>
              <li>{t('terms.sec_3_li_2_a')}<a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a></li>
              <li>{t('terms.sec_3_li_3')}</li>
            </ul>
            <p>{t('terms.sec_3_p4')}</p>
            <p>{t('terms.sec_3_p5')}</p>
          </Section>

          <Section title={t('terms.sec_4_title')}>
            <SubSection title={t('terms.sec_4_1_title')}>
              <p>{t('terms.sec_4_1_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_4_2_title')}>
              <p>{t('terms.sec_4_2_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_4_3_title')}>
              <p>{t('terms.sec_4_3_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_4_4_title')}>
              <p>{t('terms.sec_4_4_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_4_5_title')}>
              <p>{t('terms.sec_4_5_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_4_6_title')}>
              <p>{t('terms.sec_4_6_p1')}</p>
            </SubSection>
          </Section>

          <Section title={t('terms.sec_5_title')}>
            <p>{t('terms.sec_5_p1')}</p>
            <ul>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <li key={i}>{t('terms.sec_5_li_' + i)}</li>
              ))}
            </ul>
            <p>{t('terms.sec_5_p2')}</p>
          </Section>

          <Section title={t('terms.sec_6_title')}>
            <SubSection title={t('terms.sec_6_1_title')}>
              <p>{t('terms.sec_6_1_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_6_2_title')}>
              <p>{t('terms.sec_6_2_p1')}</p>
              <p>{t('terms.sec_6_2_p2')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_6_3_title')}>
              <p>{t('terms.sec_6_3_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_6_4_title')}>
              <p>{t('terms.sec_6_4_p1')}</p>
            </SubSection>
          </Section>

          <Section title={t('terms.sec_7_title')}>
            <p>{t('terms.sec_7_p1_a')}<Link href={localePath('/privacy', locale)} style={{ color: 'var(--acc)' }}>{t('terms.sec_7_p1_link')}</Link>{t('terms.sec_7_p1_b')}</p>
            <p>{t('terms.sec_7_p2')}</p>
            <ul>
              <li>{t('terms.sec_7_li_0')}</li>
              <li>{t('terms.sec_7_li_1')}</li>
              <li>{t('terms.sec_7_li_2')}</li>
              <li>{t('terms.sec_7_li_3')}</li>
            </ul>
            <p>{t('terms.sec_7_p3_a')}<Link href={localePath('/privacy', locale)} style={{ color: 'var(--acc)' }}>{t('terms.sec_7_p3_link')}</Link>{t('terms.sec_7_p3_b')}</p>
            <p>{t('terms.sec_7_p4_a')}<a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--acc)' }}>{PRIVACY_EMAIL}</a>{t('terms.sec_7_p4_b')}</p>
          </Section>

          <Section title={t('terms.sec_8_title')}>
            <p>{t('terms.sec_8_p1')}</p>
            <p>{t('terms.sec_8_p2')}</p>
          </Section>

          <Section title={t('terms.sec_9_title')}>
            <p>{t('terms.sec_9_p1')}</p>
            <ul>
              {[0, 1, 2, 3, 4].map(i => (
                <li key={i}>{t('terms.sec_9_li_' + i)}</li>
              ))}
            </ul>
            <p>{t('terms.sec_9_p2')}</p>
          </Section>

          <Section title={t('terms.sec_10_title')}>
            <p>{t('terms.sec_10_p1')}</p>
            <ul>
              <li>{t('terms.sec_10_li_0')}</li>
              <li>{t('terms.sec_10_li_1')}</li>
              <li>{t('terms.sec_10_li_2')}</li>
            </ul>
            <p>{t('terms.sec_10_p2')}</p>
          </Section>

          <Section title={t('terms.sec_11_title')}>
            <p>{t('terms.sec_11_p1')}</p>
            <ul>
              <li>{t('terms.sec_11_li_0')}</li>
              <li>{t('terms.sec_11_li_1')}</li>
            </ul>
            <p>{t('terms.sec_11_p2')}</p>
            <p>{t('terms.sec_11_p3')}</p>
          </Section>

          <Section title={t('terms.sec_12_title')}>
            <p>{t('terms.sec_12_p1')}</p>
            <ul>
              {[0, 1, 2, 3].map(i => (
                <li key={i}>{t('terms.sec_12_li_' + i)}</li>
              ))}
            </ul>
          </Section>

          <Section title={t('terms.sec_13_title')}>
            <SubSection title={t('terms.sec_13_1_title')}>
              <p>{t('terms.sec_13_1_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_13_2_title')}>
              <p>{t('terms.sec_13_2_p1_a')}<a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a>{t('terms.sec_13_2_p1_b')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_13_3_title')}>
              <p>{t('terms.sec_13_3_p1')}</p>
              <p>{t('terms.sec_13_3_p2')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_13_4_title')}>
              <p>{t('terms.sec_13_4_p1')}</p>
            </SubSection>
          </Section>

          <Section title={t('terms.sec_14_title')}>
            <p>{t('terms.sec_14_p1')}</p>
            <p>{t('terms.sec_14_p2')}</p>
          </Section>

          <Section title={t('terms.sec_15_title')}>
            <p>{t('terms.sec_15_p1')}</p>
            <p>{t('terms.sec_15_p2')}</p>
            <p>{t('terms.sec_15_p3_a')}<a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a>{t('terms.sec_15_p3_b')}</p>
          </Section>

          <Section title={t('terms.sec_16_title')}>
            <SubSection title={t('terms.sec_16_1_title')}>
              <p>{t('terms.sec_16_1_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_16_2_title')}>
              <p>{t('terms.sec_16_2_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_16_3_title')}>
              <p>{t('terms.sec_16_3_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_16_4_title')}>
              <p>{t('terms.sec_16_4_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_16_5_title')}>
              <p>{t('terms.sec_16_5_p1')}</p>
            </SubSection>
            <SubSection title={t('terms.sec_16_6_title')}>
              <p>{t('terms.sec_16_6_p1_a')}<a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a>{t('terms.sec_16_6_p1_b')}</p>
            </SubSection>
          </Section>

          <Section title={t('terms.sec_17_title')}>
            <p><strong>{t('terms.sec_17_legal_label')}</strong> <a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a></p>
            <p><strong>{t('terms.sec_17_privacy_label')}</strong> <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--acc)' }}>{PRIVACY_EMAIL}</a></p>
            <p><strong>{t('terms.sec_17_support_label')}</strong> <a href="mailto:hello@askbiz.co" style={{ color: 'var(--acc)' }}>hello@askbiz.co</a></p>
            <p><strong>{t('terms.sec_17_company_label')}</strong> {t('terms.sec_17_company_value')}</p>
          </Section>

        </div>

        {/* Footer links */}
        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--b)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href={localePath('/privacy', locale)} style={{ fontSize: 12, color: 'var(--acc)', textDecoration: 'none' }}>{t('terms.footer_privacy')}</Link>
          <Link href={localePath('/', locale)} style={{ fontSize: 12, color: 'var(--tx3)', textDecoration: 'none' }}>{t('terms.footer_back')}</Link>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: '-.01em', paddingBottom: 10, borderBottom: '1px solid var(--b)' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, lineHeight: 1.75, color: 'var(--tx2)' }}>
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 8 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}
