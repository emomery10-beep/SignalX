'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid rgba(208,138,89,.3)' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 12, ...style }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 6 }}>{children}</li>
}

function ConsentBox({ type, label, description, stored, notStored, storedTitle, notStoredTitle }: {
  type: string; label: string; description: string; stored: string[]; notStored: string[]; storedTitle: string; notStoredTitle: string
}) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid var(--b2)', background: 'var(--ev)', marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{label}</div>
      <p style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 10, lineHeight: 1.65 }}>{description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>{storedTitle}</div>
          {stored.map((s, i) => <div key={i} style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 3 }}>• {s}</div>)}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f48080', marginBottom: 4 }}>{notStoredTitle}</div>
          {notStored.map((s, i) => <div key={i} style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 3 }}>• {s}</div>)}
        </div>
      </div>
    </div>
  )
}

function DeleteSection({ tc }: { tc: (key: string) => string }) {
  const [status, setStatus] = React.useState<'idle'|'loading'|'requested'|'cancelled'>('idle')
  const [scheduledFor, setScheduledFor] = React.useState<string|null>(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    fetch('/api/account').then(r => r.json()).then(d => {
      if (d.deletionRequest) { setStatus('requested'); setScheduledFor(d.deletionRequest.scheduled_for) }
    }).catch(() => {})
  }, [])

  if (status === 'requested') return (
    <div style={{ padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(244,128,128,.3)', background: 'rgba(244,128,128,.06)' }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#f48080' }}>{tc('privacy.delete_requested_heading')}</div>
      <P>{tc('privacy.delete_requested_body_pre')}<strong>{scheduledFor ? new Date(scheduledFor).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : tc('privacy.delete_requested_fallback_date')}</strong>{tc('privacy.delete_requested_body_post')}</P>
      <button onClick={async () => { setStatus('loading'); const d = await fetch('/api/account', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'cancel_deletion' }) }).then(r=>r.json()); if(d.success) setStatus('cancelled'); else { setError(d.error); setStatus('requested') } }}
        style={{ padding: '9px 20px', borderRadius: 9999, border: 'none', background: '#22c55e', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        {tc('privacy.delete_cancel_button')}
      </button>
    </div>
  )

  if (status === 'cancelled') return (
    <div style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(34,197,94,.3)', background: 'rgba(34,197,94,.06)', fontSize: 14, color: '#22c55e', fontWeight: 500 }}>
      {tc('privacy.delete_cancelled')}
    </div>
  )

  return (
    <div style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid var(--b2)', background: 'var(--ev)' }}>
      {error && <P>{error}</P>}
      <P>{tc('privacy.delete_body')}</P>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
        <button onClick={async () => { if(!confirm(tc('privacy.delete_confirm_prompt'))) return; setStatus('loading'); const d = await fetch('/api/account', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'request_deletion' }) }).then(r=>r.json()); if(d.success) { setStatus('requested'); setScheduledFor(d.scheduled_for) } else { setError(d.error); setStatus('idle') } }}
          disabled={status === 'loading'}
          style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid rgba(244,128,128,.5)', background: 'transparent', color: '#f48080', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {status === 'loading' ? tc('privacy.delete_request_processing') : tc('privacy.delete_request_button')}
        </button>
        <a href="mailto:privacy@askbiz.co" style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          {tc('privacy.delete_email_button')}
        </a>
      </div>
    </div>
  )
}

function buildLegalBasisRows(tc: (key: string) => string): string[][] {
  const rows: string[][] = []
  for (let i = 0; i < 11; i++) {
    rows.push([
      tc('privacy.sec_4_row_' + i + '_0'),
      tc('privacy.sec_4_row_' + i + '_1'),
      tc('privacy.sec_4_row_' + i + '_2'),
    ])
  }
  return rows
}

function buildRetentionRows(tc: (key: string) => string): string[][] {
  const rows: string[][] = []
  for (let i = 0; i < 16; i++) {
    rows.push([
      tc('privacy.sec_9_row_' + i + '_0'),
      tc('privacy.sec_9_row_' + i + '_1'),
      tc('privacy.sec_9_row_' + i + '_2'),
    ])
  }
  return rows
}

function POSGroup({ tc, heading, prefix, count }: { tc: (key: string) => string; heading: string; prefix: string; count: number }) {
  const items: number[] = []
  for (let i = 0; i < count; i++) items.push(i)
  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--tx)' }}>{heading}</div>
      <ul style={{ paddingLeft: 24 }}>
        {items.map(i => (
          <Li key={i}><strong>{tc('privacy.' + prefix + '_' + i + '_bold')}</strong>{tc('privacy.' + prefix + '_' + i + '_post')}</Li>
        ))}
      </ul>
    </div>
  )
}

export default function PrivacyPage() {
  const { tc, lang } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-dm, DM Sans)' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(14px, 4vw, 24px) 80px' }}>

        {lang !== 'en' && (
          <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 10, background: 'rgba(234,179,8,.08)', border: '1px solid rgba(234,179,8,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.5 }}>⚠️ {tc('common.legal_mt_notice')}</span>
            <Link href={localePath('/privacy', lang)} style={{ fontSize: 13, fontWeight: 600, color: 'var(--acc, #d08a59)', whiteSpace: 'nowrap', textDecoration: 'none' }}>{tc('common.legal_mt_link')}</Link>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link href={localePath('/', lang)} style={{ fontSize: 13, color: 'var(--tx3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>{tc('privacy.back_to_askbiz')}</Link>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-.025em' }}>{tc('privacy.page_title')}</h1>
          <p style={{ fontSize: 14, color: 'var(--tx3)' }}>{tc('privacy.page_meta')}</p>
        </div>

        <Section title={tc('privacy.sec_1_title')}>
          <P>{tc('privacy.sec_1_p1')}</P>
          <P>{tc('privacy.sec_1_p2')}</P>
        </Section>

        <Section title={tc('privacy.sec_2_title')}>
          <P><strong>{tc('privacy.sec_2_account_label')}</strong> {tc('privacy.sec_2_account_body')}</P>
          <P><strong>{tc('privacy.sec_2_usage_label')}</strong> {tc('privacy.sec_2_usage_body')}</P>
          <P><strong>{tc('privacy.sec_2_technical_label')}</strong> {tc('privacy.sec_2_technical_body')}</P>
          <P><strong>{tc('privacy.sec_2_payment_label')}</strong> {tc('privacy.sec_2_payment_body')}</P>
          <P><strong>{tc('privacy.sec_2_camera_label')}</strong> {tc('privacy.sec_2_camera_body')}</P>
          <P><strong>{tc('privacy.sec_2_logistics_label')}</strong> {tc('privacy.sec_2_logistics_body')}</P>
          <P><strong>{tc('privacy.sec_2_location_label')}</strong> {tc('privacy.sec_2_location_body')}</P>
          <P><strong>{tc('privacy.sec_2_trial_label')}</strong> {tc('privacy.sec_2_trial_body')}</P>
          <P><strong>{tc('privacy.sec_2_financial_label')}</strong> {tc('privacy.sec_2_financial_body')}</P>
        </Section>

        <Section title={tc('privacy.sec_3_title')}>
          <ul style={{ paddingLeft: 24 }}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
              <Li key={i}>{tc('privacy.sec_3_item_' + i)}</Li>
            ))}
          </ul>
        </Section>

        <Section title={tc('privacy.sec_4_title')}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {[tc('privacy.sec_4_th_0'), tc('privacy.sec_4_th_1'), tc('privacy.sec_4_th_2')].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--b2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buildLegalBasisRows(tc).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--b)', background: i % 2 === 0 ? 'var(--sf)' : 'var(--bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 14px', fontSize: 13, color: 'var(--tx2)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={tc('privacy.sec_5_title')}>
          <P>{tc('privacy.sec_5_p1_pre')}<strong>{tc('privacy.sec_5_p1_bold')}</strong>{tc('privacy.sec_5_p1_post')}</P>
          <ul style={{ paddingLeft: 24 }}>
            {[0,1,2,3].map(i => (
              <Li key={i}>{tc('privacy.sec_5_item_' + i)}</Li>
            ))}
          </ul>
          <P><strong>{tc('privacy.sec_5_p2')}</strong>{tc('privacy.sec_5_p2_post')}</P>
        </Section>

        <Section title={tc('privacy.sec_6_title')}>
          <P>{tc('privacy.sec_6_p1_pre')}<strong>{tc('privacy.sec_6_p1_bold')}</strong>{tc('privacy.sec_6_p1_post')}</P>

          <ConsentBox
            type="financial"
            label={tc('privacy.sec_6_box1_label')}
            description={tc('privacy.sec_6_box1_description')}
            storedTitle={'✓ ' + tc('privacy.consent_stored_title')}
            notStoredTitle={'✗ ' + tc('privacy.consent_notstored_title')}
            stored={[
              tc('privacy.sec_6_box1_stored_0'),
              tc('privacy.sec_6_box1_stored_1'),
              tc('privacy.sec_6_box1_stored_2'),
              tc('privacy.sec_6_box1_stored_3'),
              tc('privacy.sec_6_box1_stored_4'),
            ]}
            notStored={[
              tc('privacy.sec_6_box1_notstored_0'),
              tc('privacy.sec_6_box1_notstored_1'),
              tc('privacy.sec_6_box1_notstored_2'),
              tc('privacy.sec_6_box1_notstored_3'),
              tc('privacy.sec_6_box1_notstored_4'),
              tc('privacy.sec_6_box1_notstored_5'),
            ]}
          />

          <ConsentBox
            type="training"
            label={tc('privacy.sec_6_box2_label')}
            description={tc('privacy.sec_6_box2_description')}
            storedTitle={'✓ ' + tc('privacy.consent_stored_title')}
            notStoredTitle={'✗ ' + tc('privacy.consent_notstored_title')}
            stored={[
              tc('privacy.sec_6_box2_stored_0'),
              tc('privacy.sec_6_box2_stored_1'),
              tc('privacy.sec_6_box2_stored_2'),
            ]}
            notStored={[
              tc('privacy.sec_6_box2_notstored_0'),
              tc('privacy.sec_6_box2_notstored_1'),
              tc('privacy.sec_6_box2_notstored_2'),
              tc('privacy.sec_6_box2_notstored_3'),
            ]}
          />

          <P>{tc('privacy.sec_6_p2_pre')}<strong>{tc('privacy.sec_6_p2_bold')}</strong>{tc('privacy.sec_6_p2_post')}</P>
          <P>{tc('privacy.sec_6_p3_pre')}<Link href={localePath('/settings', lang)} style={{ color: 'var(--acc)', textDecoration: 'none' }}>{tc('privacy.sec_6_p3_link')}</Link>{tc('privacy.sec_6_p3_post')}</P>
        </Section>

        <Section title={tc('privacy.sec_7_title')}>
          <P>{tc('privacy.sec_7_p1')}</P>
          <ul style={{ paddingLeft: 24 }}>
            {[0,1,2,3].map(i => (
              <Li key={i}><strong>{tc('privacy.sec_7_item_' + i + '_bold')}</strong>{tc('privacy.sec_7_item_' + i + '_post')}</Li>
            ))}
          </ul>
        </Section>

        <Section title={tc('privacy.sec_8_title')}>
          <P>{tc('privacy.sec_8_p1')}</P>
          <ul style={{ paddingLeft: 24 }}>
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <Li key={i}><strong>{tc('privacy.sec_8_item_' + i + '_bold')}</strong>{tc('privacy.sec_8_item_' + i + '_post')}</Li>
            ))}
          </ul>
          <P>{tc('privacy.sec_8_p2')}</P>
          <P>{tc('privacy.sec_8_p3_pre')}<Link href={localePath('/dpa', lang)} style={{ color: 'var(--ac, #d08a59)' }}>{tc('privacy.sec_8_p3_link')}</Link>{tc('privacy.sec_8_p3_post')}</P>
        </Section>

        <Section title={tc('privacy.sec_9_title')}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {[tc('privacy.sec_9_th_0'), tc('privacy.sec_9_th_1'), tc('privacy.sec_9_th_2')].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--b2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buildRetentionRows(tc).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--b)', background: i % 2 === 0 ? 'var(--sf)' : 'var(--bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 14px', fontSize: 13, color: 'var(--tx2)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={tc('privacy.sec_10_title')}>
          <P><strong>{tc('privacy.sec_10_intro_bold')}</strong>{tc('privacy.sec_10_intro_post')}</P>

          <POSGroup tc={tc} heading={tc('privacy.sec_10_phone_heading')} prefix="sec_10_phone" count={6} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_transaction_heading')} prefix="sec_10_transaction" count={5} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_staff_heading')} prefix="sec_10_staff" count={5} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_inventory_heading')} prefix="sec_10_inventory" count={5} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_camera_heading')} prefix="sec_10_camera" count={6} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_logistics_heading')} prefix="sec_10_logistics" count={5} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_offline_heading')} prefix="sec_10_offline" count={4} />
          <POSGroup tc={tc} heading={tc('privacy.sec_10_mobilemoney_heading')} prefix="sec_10_mobilemoney" count={6} />

          <P style={{ marginTop: 24, padding: '16px 18px', borderRadius: 12, background: 'rgba(22,163,74,.06)', borderLeft: '4px solid #16a34a' }}>
            <strong>{tc('privacy.sec_10_summary_bold')}</strong>{tc('privacy.sec_10_summary_post')}
          </P>
        </Section>

        <Section title={tc('privacy.sec_11_title')}>
          <P>{tc('privacy.sec_11_p1')}</P>
          <ul style={{ paddingLeft: 24 }}>
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <Li key={i}><strong>{tc('privacy.sec_11_item_' + i + '_bold')}</strong>{tc('privacy.sec_11_item_' + i + '_post')}</Li>
            ))}
          </ul>
          <P>{tc('privacy.sec_11_p2_pre')}<strong>{tc('privacy.sec_11_p2_bold')}</strong>{tc('privacy.sec_11_p2_post')}</P>
          <P>{tc('privacy.sec_11_p3')}</P>
        </Section>

        <Section title={tc('privacy.sec_12_title')}>
          <P>{tc('privacy.sec_12_p1_pre')}<strong>{tc('privacy.sec_12_p1_bold')}</strong>{tc('privacy.sec_12_p1_post')}</P>
          <P><strong>{tc('privacy.sec_12_p2_bold')}</strong>{tc('privacy.sec_12_p2_post')}</P>
          <DeleteSection tc={tc} />
        </Section>

        <Section title={tc('privacy.sec_13_title')}>
          <P>{tc('privacy.sec_13_p1')}</P>
          <ul style={{ paddingLeft: 24 }}>
            {[0,1].map(i => (
              <Li key={i}><strong>{tc('privacy.sec_13_item_' + i + '_bold')}</strong>{tc('privacy.sec_13_item_' + i + '_post')}</Li>
            ))}
          </ul>
        </Section>

        <Section title={tc('privacy.sec_14_title')}>
          <P>{tc('privacy.sec_14_p1')}</P>
          <P><strong>{tc('privacy.sec_14_p2_bold')}</strong>{tc('privacy.sec_14_p2_post')}</P>
          <ul style={{ paddingLeft: 24 }}>
            <Li>{tc('privacy.sec_14_item_0_pre')}<strong>{tc('privacy.sec_14_item_0_bold')}</strong>{tc('privacy.sec_14_item_0_post')}</Li>
            <Li>{tc('privacy.sec_14_item_1_pre')}<strong>{tc('privacy.sec_14_item_1_bold')}</strong>{tc('privacy.sec_14_item_1_post')}</Li>
            <Li>{tc('privacy.sec_14_item_2')}</Li>
          </ul>
          <P>{tc('privacy.sec_14_p3_pre')}<strong>{tc('privacy.sec_14_p3_bold')}</strong>{tc('privacy.sec_14_p3_post')}</P>
        </Section>

        <Section title={tc('privacy.sec_15_title')}>
          <P>{tc('privacy.sec_15_p1')}</P>
        </Section>

        <div style={{ padding: '20px', borderRadius: 14, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 13, color: 'var(--tx2)' }}>
          <strong>{tc('privacy.contact_heading')}</strong><br/>
          {tc('privacy.contact_privacy')}<br/>
          {tc('privacy.contact_security')}<br/>
          {tc('privacy.contact_legal')}<br/>
          {tc('privacy.contact_general')}<br/>
          {tc('privacy.contact_footer')}
        </div>
      </div>
    </div>
  )
}
