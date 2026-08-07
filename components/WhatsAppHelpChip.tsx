'use client'
import { useLang } from '@/components/LanguageProvider'
import { ONBOARDING_WHATSAPP_GROUP_URL } from '@/lib/whatsapp'
import { trackFunnelEvent } from '@/lib/funnel-track'

// Shared "stuck? get help" affordance for the POS setup/activate flow.
// Reuses the same live WhatsApp group + style language already approved
// and shipped on the onboarding "done" screen (app/onboarding/page.tsx) —
// this component just gets it in front of people on the screens where they
// actually drop off (catalogue setup, activate) instead of only at the start.
const TX = '#1a1916'
const TX2 = '#6b6760'

function WhatsAppIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M12.04 2.13c-5.45 0-9.9 4.45-9.9 9.9 0 1.75.46 3.45 1.33 4.95L2 22l5.15-1.35a9.9 9.9 0 0 0 4.89 1.28h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.64-1.03-5.13-2.9-7-1.86-1.87-4.35-2.9-7-2.9Zm5.8 14.14c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.8-.11a16 16 0 0 1-1.62-.6c-2.85-1.23-4.7-4.1-4.85-4.3-.14-.2-1.15-1.53-1.15-2.92 0-1.4.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.18 0 .42-.03.65.5.24.55.82 1.9.89 2.04.07.14.12.3.02.49-.1.19-.15.3-.3.46-.14.17-.3.37-.43.5-.14.14-.3.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.44.28.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.1 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.66-.17 1.3Z" />
    </svg>
  )
}

export default function WhatsAppHelpChip({ variant, screen }: { variant: 'chip' | 'card'; screen: string }) {
  const { tc } = useLang()
  const handleClick = () => trackFunnelEvent('pos_help_clicked', { metadata: { screen, variant } })

  if (variant === 'card') {
    return (
      <a
        href={ONBOARDING_WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', maxWidth: 340, margin: '0 auto 20px', padding: '14px 16px', borderRadius: 14, background: 'rgba(37,211,102,.08)', border: '1px solid rgba(37,211,102,.25)', textDecoration: 'none' }}
      >
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(37,211,102,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-hidden="true">
          <WhatsAppIcon size={18} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX, marginBottom: 2 }}>{tc('pos_setup.whatsapp_help_title')}</div>
          <div style={{ fontSize: 12, color: TX2, lineHeight: 1.5, marginBottom: 4 }}>{tc('pos_setup.whatsapp_help_body')}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#128C7E' }}>{tc('pos_setup.whatsapp_help_cta')}</div>
        </div>
      </a>
    )
  }

  // Compact fixed pill for dense working screens — mirrors SpeakButton's
  // proven right:16,bottom:80,zIndex:90 corner (pos/setup/page.tsx), placed
  // on the opposite side so the two never collide.
  return (
    <a
      href={ONBOARDING_WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={tc('pos_setup.whatsapp_help_title')}
      style={{ position: 'fixed', left: 16, bottom: 80, zIndex: 90, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 10px 12px', borderRadius: 9999, background: '#fff', border: '1px solid rgba(37,211,102,.35)', boxShadow: '0 2px 12px rgba(0,0,0,.14)', textDecoration: 'none', color: '#128C7E', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}
    >
      <WhatsAppIcon size={20} />
      {tc('pos_setup.whatsapp_help_chip')}
    </a>
  )
}
