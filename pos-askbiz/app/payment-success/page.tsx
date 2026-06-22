import { getT } from '@/lib/i18n-server'

export default function PaymentSuccessPage() {
  const t = getT()
  return (
    <div className="pos-screen" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div className="pos-reveal" style={{ textAlign: 'center', maxWidth: 320 }}>
        <div className="pos-success-icon" style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--pos-ink)', margin: '0 0 8px' }}>{t('pos_payment_success.title')}</h1>
        <p style={{ fontSize: 15, color: 'var(--pos-muted)', margin: '0 0 24px' }}>{t('pos_payment_success.subtitle')}</p>
      </div>
    </div>
  )
}
