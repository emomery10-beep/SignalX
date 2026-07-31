'use client'
import { ReactNode } from 'react'
import { tokens, radius } from './tokens'

type Tone = 'danger' | 'success' | 'warning' | 'info'

const TONE: Record<Tone, { bg: string; ring: string; fg: string; icon: string }> = {
  danger:  { bg: tokens.dangerPale,  ring: tokens.dangerRing,  fg: tokens.danger,  icon: '⚠️' },
  success: { bg: tokens.successPale, ring: tokens.successRing, fg: tokens.success, icon: '✓' },
  warning: { bg: 'rgba(249,115,22,.08)', ring: 'rgba(249,115,22,.25)', fg: tokens.warning, icon: '⚠️' },
  info:    { bg: tokens.accentPale,  ring: tokens.accentRing,  fg: tokens.accent,  icon: 'ℹ️' },
}

// Uses the .pos-banner slide-down-and-fade animation from globals.css —
// every error/success/info banner in the app should render through this
// instead of a one-off inline div, so entrances are consistent everywhere.
export function Banner({ tone = 'danger', children }: { tone?: Tone; children: ReactNode }) {
  const t = TONE[tone]
  return (
    <div
      className="pos-banner"
      role={tone === 'danger' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '10px 14px',
        borderRadius: radius.md,
        background: t.bg,
        border: `1px solid ${t.ring}`,
        marginBottom: 16,
      }}
    >
      <span aria-hidden style={{ lineHeight: 1.4 }}>{t.icon}</span>
      <p style={{ margin: 0, fontSize: 13.5, color: t.fg, lineHeight: 1.5 }}>{children}</p>
    </div>
  )
}
