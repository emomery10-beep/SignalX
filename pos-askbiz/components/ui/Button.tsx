'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { tokens, radius } from './tokens'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  loadingLabel?: string
  children: ReactNode
}

// Every variant relies on globals.css for its press/hover feedback
// (button:active scale, .pos-btn-primary:hover brighten) — never redeclare
// transitions here, just wire up the classNames so the shared system applies.
const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  primary:   { background: tokens.accent, color: '#fff', border: 'none' },
  secondary: { background: 'transparent', color: tokens.ink, border: `1px solid ${tokens.border}` },
  danger:    { background: tokens.danger, color: '#fff', border: 'none' },
  ghost:     { background: 'transparent', color: tokens.muted, border: 'none' },
}

const SIZE_STYLE: Record<Size, React.CSSProperties> = {
  md: { padding: '9px 18px', fontSize: 13, borderRadius: radius.sm },
  lg: { padding: '13px 22px', fontSize: 15, borderRadius: radius.md },
}

export function Button({ variant = 'primary', size = 'md', loading, loadingLabel, disabled, className, style, children, ...rest }: Props) {
  return (
    <button
      className={[variant === 'primary' ? 'pos-btn-primary' : '', className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      style={{
        ...VARIANT_STYLE[variant],
        ...SIZE_STYLE[size],
        fontWeight: 600,
        cursor: disabled || loading ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      {loading ? (loadingLabel ?? children) : children}
    </button>
  )
}
