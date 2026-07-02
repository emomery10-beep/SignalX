import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale, getT } from '@/lib/i18n-server'
import { localePath } from '@/lib/i18n-locale'

export async function generateMetadata(): Promise<Metadata> {
  const t = getT()
  const locale = getLocale()
  return {
    title: t('changelog.meta_title'),
    description: t('changelog.meta_description'),
    alternates: { canonical: `https://askbiz.co${localePath('/changelog', locale)}` },
  }
}

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const BD   = '#e8e6e1'
const BG   = '#f9f8f6'
const SF   = '#ffffff'

type ChangeType = 'new' | 'improved' | 'fixed' | 'removed'

interface Change {
  type: ChangeType
  text: string
}

interface Release {
  version: string
  date: string
  summary: string
  changes: Change[]
}

const TYPE_STYLE: Record<ChangeType, { labelKey: string; bg: string; color: string; border: string }> = {
  new:      { labelKey: 'changelog.type_new',      bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  improved: { labelKey: 'changelog.type_improved', bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  fixed:    { labelKey: 'changelog.type_fixed',    bg: '#fff8e1', color: '#e65100', border: '#ffcc80' },
  removed:  { labelKey: 'changelog.type_removed',  bg: '#fce4ec', color: '#880e4f', border: '#f48fb1' },
}

const buildReleases = (t: (key: string) => string): Release[] => [
  { version: '2.20.0', date: '2026-07-02', summary: t('changelog.rel_16_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_16_change_0') },
    { type: 'new',      text: t('changelog.rel_16_change_1') },
    { type: 'new',      text: t('changelog.rel_16_change_2') },
    { type: 'new',      text: t('changelog.rel_16_change_3') },
    { type: 'new',      text: t('changelog.rel_16_change_4') },
    { type: 'improved', text: t('changelog.rel_16_change_5') },
    { type: 'improved', text: t('changelog.rel_16_change_6') },
    { type: 'improved', text: t('changelog.rel_16_change_7') },
    { type: 'improved', text: t('changelog.rel_16_change_8') },
    { type: 'improved', text: t('changelog.rel_16_change_9') },
    { type: 'improved', text: t('changelog.rel_16_change_10') },
    { type: 'improved', text: t('changelog.rel_16_change_11') },
    { type: 'improved', text: t('changelog.rel_16_change_12') },
    { type: 'improved', text: t('changelog.rel_16_change_13') },
    { type: 'fixed',    text: t('changelog.rel_16_change_14') },
    { type: 'fixed',    text: t('changelog.rel_16_change_15') },
    { type: 'fixed',    text: t('changelog.rel_16_change_16') },
    { type: 'fixed',    text: t('changelog.rel_16_change_17') },
    { type: 'fixed',    text: t('changelog.rel_16_change_18') },
    { type: 'fixed',    text: t('changelog.rel_16_change_19') },
    { type: 'fixed',    text: t('changelog.rel_16_change_20') },
  ] },
  { version: '2.19.0', date: '2026-07-01', summary: t('changelog.rel_15_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_15_change_0') },
    { type: 'new',      text: t('changelog.rel_15_change_1') },
    { type: 'new',      text: t('changelog.rel_15_change_2') },
    { type: 'improved', text: t('changelog.rel_15_change_3') },
    { type: 'fixed',    text: t('changelog.rel_15_change_4') },
    { type: 'fixed',    text: t('changelog.rel_15_change_5') },
    { type: 'improved', text: t('changelog.rel_15_change_6') },
    { type: 'improved', text: t('changelog.rel_15_change_7') },
    { type: 'fixed',    text: t('changelog.rel_15_change_8') },
    { type: 'fixed',    text: t('changelog.rel_15_change_9') },
  ] },
  { version: '2.18.0', date: '2026-06-27', summary: t('changelog.rel_14_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_14_change_0') },
    { type: 'fixed',    text: t('changelog.rel_14_change_1') },
    { type: 'fixed',    text: t('changelog.rel_14_change_2') },
    { type: 'improved', text: t('changelog.rel_14_change_3') },
    { type: 'fixed',    text: t('changelog.rel_14_change_4') },
    { type: 'fixed',    text: t('changelog.rel_14_change_5') },
    { type: 'fixed',    text: t('changelog.rel_14_change_6') },
    { type: 'fixed',    text: t('changelog.rel_14_change_7') },
    { type: 'fixed',    text: t('changelog.rel_14_change_8') },
    { type: 'improved', text: t('changelog.rel_14_change_9') },
    { type: 'fixed',    text: t('changelog.rel_14_change_10') },
    { type: 'fixed',    text: t('changelog.rel_14_change_11') },
  ] },
  { version: '2.17.0', date: '2026-06-17', summary: t('changelog.rel_0_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_0_change_0') },
    { type: 'new',      text: t('changelog.rel_0_change_1') },
    { type: 'new',      text: t('changelog.rel_0_change_2') },
    { type: 'new',      text: t('changelog.rel_0_change_3') },
    { type: 'new',      text: t('changelog.rel_0_change_4') },
    { type: 'new',      text: t('changelog.rel_0_change_5') },
    { type: 'new',      text: t('changelog.rel_0_change_6') },
    { type: 'improved', text: t('changelog.rel_0_change_7') },
    { type: 'improved', text: t('changelog.rel_0_change_8') },
    { type: 'improved', text: t('changelog.rel_0_change_9') },
    { type: 'fixed',    text: t('changelog.rel_0_change_10') },
    { type: 'removed',  text: t('changelog.rel_0_change_11') },
  ] },
  { version: '2.16.0', date: '2026-06-16', summary: t('changelog.rel_1_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_1_change_0') },
    { type: 'improved', text: t('changelog.rel_1_change_1') },
    { type: 'improved', text: t('changelog.rel_1_change_2') },
    { type: 'improved', text: t('changelog.rel_1_change_3') },
    { type: 'improved', text: t('changelog.rel_1_change_4') },
    { type: 'removed',  text: t('changelog.rel_1_change_5') },
    { type: 'improved', text: t('changelog.rel_1_change_6') },
  ] },
  { version: '2.15.0', date: '2026-06-16', summary: t('changelog.rel_2_summary'), changes: [
    { type: 'fixed',    text: t('changelog.rel_2_change_0') },
    { type: 'fixed',    text: t('changelog.rel_2_change_1') },
    { type: 'improved', text: t('changelog.rel_2_change_2') },
    { type: 'improved', text: t('changelog.rel_2_change_3') },
    { type: 'fixed',    text: t('changelog.rel_2_change_4') },
    { type: 'fixed',    text: t('changelog.rel_2_change_5') },
    { type: 'fixed',    text: t('changelog.rel_2_change_6') },
    { type: 'improved', text: t('changelog.rel_2_change_7') },
    { type: 'fixed',    text: t('changelog.rel_2_change_8') },
    { type: 'improved', text: t('changelog.rel_2_change_9') },
    { type: 'improved', text: t('changelog.rel_2_change_10') },
  ] },
  { version: '2.14.0', date: '2026-06-14', summary: t('changelog.rel_3_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_3_change_0') },
    { type: 'new',      text: t('changelog.rel_3_change_1') },
    { type: 'new',      text: t('changelog.rel_3_change_2') },
    { type: 'new',      text: t('changelog.rel_3_change_3') },
    { type: 'new',      text: t('changelog.rel_3_change_4') },
    { type: 'new',      text: t('changelog.rel_3_change_5') },
    { type: 'new',      text: t('changelog.rel_3_change_6') },
    { type: 'new',      text: t('changelog.rel_3_change_7') },
    { type: 'improved', text: t('changelog.rel_3_change_8') },
    { type: 'improved', text: t('changelog.rel_3_change_9') },
    { type: 'improved', text: t('changelog.rel_3_change_10') },
    { type: 'fixed',    text: t('changelog.rel_3_change_11') },
    { type: 'fixed',    text: t('changelog.rel_3_change_12') },
    { type: 'fixed',    text: t('changelog.rel_3_change_13') },
    { type: 'removed',  text: t('changelog.rel_3_change_14') },
    { type: 'improved', text: t('changelog.rel_3_change_15') },
    { type: 'improved', text: t('changelog.rel_3_change_16') },
    { type: 'improved', text: t('changelog.rel_3_change_17') },
    { type: 'improved', text: t('changelog.rel_3_change_18') },
    { type: 'improved', text: t('changelog.rel_3_change_19') },
    { type: 'improved', text: t('changelog.rel_3_change_20') },
    { type: 'improved', text: t('changelog.rel_3_change_21') },
    { type: 'improved', text: t('changelog.rel_3_change_22') },
    { type: 'fixed',    text: t('changelog.rel_3_change_23') },
  ] },
  { version: '2.13.0', date: '2026-06-04', summary: t('changelog.rel_4_summary'), changes: [
    { type: 'fixed',    text: t('changelog.rel_4_change_0') },
    { type: 'fixed',    text: t('changelog.rel_4_change_1') },
    { type: 'fixed',    text: t('changelog.rel_4_change_2') },
    { type: 'fixed',    text: t('changelog.rel_4_change_3') },
    { type: 'improved', text: t('changelog.rel_4_change_4') },
    { type: 'improved', text: t('changelog.rel_4_change_5') },
    { type: 'improved', text: t('changelog.rel_4_change_6') },
    { type: 'improved', text: t('changelog.rel_4_change_7') },
    { type: 'improved', text: t('changelog.rel_4_change_8') },
    { type: 'improved', text: t('changelog.rel_4_change_9') },
  ] },
  { version: '2.12.0', date: '2026-06-04', summary: t('changelog.rel_5_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_5_change_0') },
    { type: 'new',      text: t('changelog.rel_5_change_1') },
    { type: 'new',      text: t('changelog.rel_5_change_2') },
    { type: 'new',      text: t('changelog.rel_5_change_3') },
    { type: 'new',      text: t('changelog.rel_5_change_4') },
    { type: 'new',      text: t('changelog.rel_5_change_5') },
    { type: 'improved', text: t('changelog.rel_5_change_6') },
    { type: 'improved', text: t('changelog.rel_5_change_7') },
    { type: 'improved', text: t('changelog.rel_5_change_8') },
    { type: 'improved', text: t('changelog.rel_5_change_9') },
    { type: 'fixed',    text: t('changelog.rel_5_change_10') },
  ] },
  { version: '2.11.0', date: '2026-05-19', summary: t('changelog.rel_6_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_6_change_0') },
    { type: 'new',      text: t('changelog.rel_6_change_1') },
    { type: 'new',      text: t('changelog.rel_6_change_2') },
    { type: 'new',      text: t('changelog.rel_6_change_3') },
    { type: 'new',      text: t('changelog.rel_6_change_4') },
    { type: 'new',      text: t('changelog.rel_6_change_5') },
    { type: 'improved', text: t('changelog.rel_6_change_6') },
    { type: 'improved', text: t('changelog.rel_6_change_7') },
    { type: 'improved', text: t('changelog.rel_6_change_8') },
    { type: 'fixed',    text: t('changelog.rel_6_change_9') },
    { type: 'fixed',    text: t('changelog.rel_6_change_10') },
  ] },
  { version: '2.10.0', date: '2026-05-16', summary: t('changelog.rel_7_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_7_change_0') },
    { type: 'new',      text: t('changelog.rel_7_change_1') },
    { type: 'new',      text: t('changelog.rel_7_change_2') },
    { type: 'new',      text: t('changelog.rel_7_change_3') },
    { type: 'new',      text: t('changelog.rel_7_change_4') },
    { type: 'new',      text: t('changelog.rel_7_change_5') },
    { type: 'improved', text: t('changelog.rel_7_change_6') },
    { type: 'improved', text: t('changelog.rel_7_change_7') },
    { type: 'improved', text: t('changelog.rel_7_change_8') },
    { type: 'improved', text: t('changelog.rel_7_change_9') },
  ] },
  { version: '2.9.0', date: '2026-05-12', summary: t('changelog.rel_8_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_8_change_0') },
    { type: 'new',      text: t('changelog.rel_8_change_1') },
    { type: 'new',      text: t('changelog.rel_8_change_2') },
    { type: 'new',      text: t('changelog.rel_8_change_3') },
    { type: 'new',      text: t('changelog.rel_8_change_4') },
    { type: 'new',      text: t('changelog.rel_8_change_5') },
    { type: 'new',      text: t('changelog.rel_8_change_6') },
    { type: 'new',      text: t('changelog.rel_8_change_7') },
    { type: 'new',      text: t('changelog.rel_8_change_8') },
    { type: 'new',      text: t('changelog.rel_8_change_9') },
    { type: 'new',      text: t('changelog.rel_8_change_10') },
    { type: 'new',      text: t('changelog.rel_8_change_11') },
    { type: 'new',      text: t('changelog.rel_8_change_12') },
    { type: 'new',      text: t('changelog.rel_8_change_13') },
    { type: 'new',      text: t('changelog.rel_8_change_14') },
    { type: 'new',      text: t('changelog.rel_8_change_15') },
    { type: 'improved', text: t('changelog.rel_8_change_16') },
  ] },
  { version: '2.8.0', date: '2026-05-09', summary: t('changelog.rel_9_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_9_change_0') },
    { type: 'new',      text: t('changelog.rel_9_change_1') },
    { type: 'new',      text: t('changelog.rel_9_change_2') },
    { type: 'new',      text: t('changelog.rel_9_change_3') },
    { type: 'new',      text: t('changelog.rel_9_change_4') },
    { type: 'new',      text: t('changelog.rel_9_change_5') },
    { type: 'new',      text: t('changelog.rel_9_change_6') },
    { type: 'new',      text: t('changelog.rel_9_change_7') },
    { type: 'new',      text: t('changelog.rel_9_change_8') },
    { type: 'new',      text: t('changelog.rel_9_change_9') },
    { type: 'improved', text: t('changelog.rel_9_change_10') },
    { type: 'improved', text: t('changelog.rel_9_change_11') },
    { type: 'improved', text: t('changelog.rel_9_change_12') },
    { type: 'improved', text: t('changelog.rel_9_change_13') },
  ] },
  { version: '2.7.2', date: '2026-04-22', summary: t('changelog.rel_10_summary'), changes: [
    { type: 'improved', text: t('changelog.rel_10_change_0') },
    { type: 'improved', text: t('changelog.rel_10_change_1') },
    { type: 'fixed',    text: t('changelog.rel_10_change_2') },
    { type: 'fixed',    text: t('changelog.rel_10_change_3') },
  ] },
  { version: '2.7.1', date: '2026-04-10', summary: t('changelog.rel_11_summary'), changes: [
    { type: 'improved', text: t('changelog.rel_11_change_0') },
    { type: 'improved', text: t('changelog.rel_11_change_1') },
    { type: 'fixed',    text: t('changelog.rel_11_change_2') },
    { type: 'fixed',    text: t('changelog.rel_11_change_3') },
  ] },
  { version: '2.7.0', date: '2026-03-28', summary: t('changelog.rel_12_summary'), changes: [
    { type: 'new',      text: t('changelog.rel_12_change_0') },
    { type: 'new',      text: t('changelog.rel_12_change_1') },
    { type: 'new',      text: t('changelog.rel_12_change_2') },
    { type: 'improved', text: t('changelog.rel_12_change_3') },
    { type: 'removed',  text: t('changelog.rel_12_change_4') },
  ] },
  { version: '2.6.5', date: '2026-03-08', summary: t('changelog.rel_13_summary'), changes: [
    { type: 'improved', text: t('changelog.rel_13_change_0') },
    { type: 'fixed',    text: t('changelog.rel_13_change_1') },
    { type: 'fixed',    text: t('changelog.rel_13_change_2') },
  ] },
]

function TypeBadge({ type, t }: { type: ChangeType; t: (key: string) => string }) {
  const s = TYPE_STYLE[type]
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
      padding: '3px 10px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      flexShrink: 0, lineHeight: 1, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {t(s.labelKey)}
    </span>
  )
}

export default function ChangelogPage() {
  const t = getT()
  const locale = getLocale()
  const RELEASES = buildReleases(t)
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href={localePath('/', locale)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
              <rect x="3"  y="22" width="5" height="7"  rx="1.5" fill="white" opacity="0.5"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="19" y="9"  width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href={localePath('/help', locale)} style={{ fontSize: 13, color: TX2, textDecoration: 'none', fontWeight: 500 }}>{t('changelog.nav_help')}</Link>
          <Link href={localePath('/signin', locale)} style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{t('changelog.nav_try_free')} →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: 'clamp(40px,6vw,72px) clamp(16px,6vw,80px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 12px' }}>{t('changelog.hero_eyebrow')}</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(28px,4.5vw,42px)', fontWeight: 700, color: TX, margin: '0 0 14px', letterSpacing: '-.03em', lineHeight: 1.1 }}>
            {t('changelog.hero_title')}
          </h1>
          <p style={{ fontSize: 16, color: TX2, margin: '0 0 24px', lineHeight: 1.7, maxWidth: 520 }}>
            {t('changelog.hero_subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:hello@askbiz.co?subject=Changelog feedback" style={{ fontSize: 13, color: TX2, textDecoration: 'none', border: `1px solid ${BD}`, borderRadius: 8, padding: '8px 18px', fontWeight: 500, transition: 'border-color .15s' }}>
              {t('changelog.hero_feedback')} →
            </a>
            <Link href={localePath('/help', locale)} style={{ fontSize: 13, color: ACC, textDecoration: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 18px', fontWeight: 600 }}>
              {t('changelog.hero_help')} →
            </Link>
          </div>
        </div>
      </div>

      {/* Releases */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {RELEASES.map((rel, i) => (
            <article key={rel.version} style={{
              background: SF,
              border: `1px solid ${i === 0 ? ACC : BD}`,
              borderRadius: 14,
              padding: 'clamp(20px,3vw,28px)',
              boxShadow: i === 0 ? `0 0 0 1px ${ACC}22, 0 4px 20px rgba(0,0,0,.06)` : '0 1px 4px rgba(0,0,0,.04)',
              position: 'relative',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, letterSpacing: '-.01em',
                }}>
                  v{rel.version}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: TX3, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: TX3, fontWeight: 500 }}>
                  {new Date(rel.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {i === 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: SF, background: ACC,
                    padding: '3px 10px', borderRadius: 9999, letterSpacing: '.06em', textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    {t('changelog.latest_badge')}
                  </span>
                )}
              </div>

              {/* Summary */}
              <p style={{ fontSize: 14, color: TX2, margin: '0 0 18px', lineHeight: 1.6 }}>
                {rel.summary}
              </p>

              {/* Changes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rel.changes.map((c, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '8px 12px',
                    background: BG,
                    borderRadius: 8,
                  }}>
                    <div style={{ paddingTop: 2, flexShrink: 0 }}>
                      <TypeBadge type={c.type} t={t} />
                    </div>
                    <span style={{ fontSize: 13, color: TX, lineHeight: 1.55, flex: 1 }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${BD}`, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 12px' }}>
            {t('changelog.footer_older')} <a href="mailto:hello@askbiz.co" style={{ color: ACC, textDecoration: 'none', fontWeight: 600 }}>{t('changelog.footer_contact')}</a>.
          </p>
          <Link href={localePath('/help', locale)} style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>{t('changelog.footer_back')}</Link>
        </div>
      </div>
    </div>
  )
}
