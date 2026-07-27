import Link from 'next/link'

const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]'
const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-signal-500 text-ink-950 hover:bg-signal-400',
  secondary: 'bg-white/[0.04] text-ink-100 ring-1 ring-white/10 hover:bg-white/[0.07] hover:ring-white/20',
  ghost: 'text-ink-300 hover:text-ink-50 hover:bg-white/[0.04]',
}

const ICON_CLASS: Record<Variant, string> = {
  primary: 'bg-black/15',
  secondary: 'bg-white/10',
  ghost: 'bg-white/5',
}

// Pill CTA with a nested "island" icon — the trailing arrow lives in its own
// circular wrapper that translates diagonally on hover, never sitting naked
// next to the label. Scales down slightly on press for tactile feedback.
function content(children: React.ReactNode, variant: Variant, showIcon: boolean) {
  return (
    <>
      <span>{children}</span>
      {showIcon && (
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${ICON_CLASS[variant]} transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      )}
    </>
  )
}

export function Button({
  href,
  children,
  variant = 'primary',
  icon = true,
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: Variant
  icon?: boolean
  className?: string
}) {
  const base = `group inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-sm font-semibold transition-all duration-500 ${EASE} active:scale-[0.98] ${focusRing}`
  const noIconPad = icon ? '' : 'pr-6 py-3'
  return (
    <Link href={href} className={`${base} ${VARIANT_CLASS[variant]} ${noIconPad} ${className}`}>
      {content(children, variant, icon)}
    </Link>
  )
}

export function ButtonExternal({
  href,
  children,
  variant = 'secondary',
  icon = true,
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: Variant
  icon?: boolean
  className?: string
}) {
  const base = `group inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-sm font-semibold transition-all duration-500 ${EASE} active:scale-[0.98] ${focusRing}`
  const noIconPad = icon ? '' : 'pr-6 py-3'
  return (
    <a href={href} className={`${base} ${VARIANT_CLASS[variant]} ${noIconPad} ${className}`}>
      {content(children, variant, icon)}
    </a>
  )
}
