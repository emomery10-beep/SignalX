'use client'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { useLang } from '@/components/LanguageProvider'

// App-wide, non-dismissible offline indicator — mounted once in the root
// layout. Reuses the existing .pos-banner slide-down animation and semantic
// danger tokens rather than introducing new styles.
export default function PosOfflineBanner() {
  const online = useOnlineStatus()
  const { tc } = useLang()

  if (online) return null

  return (
    <div
      className="pos-banner"
      role="status"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        padding: '10px 16px',
        background: 'var(--pos-danger-pale)',
        borderBottom: '1px solid var(--pos-danger-ring)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--pos-danger)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <span>{tc('sell.offline_banner')}</span>
    </div>
  )
}
