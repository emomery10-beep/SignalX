import Link from 'next/link'

const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]'
const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// Double-bezel card: an outer "shell" (hairline ring, soft tint, large
// radius) housing an inner "core" (its own background + inset top
// highlight, concentric smaller radius) — reads as machined hardware
// instead of a flat bordered div. Interactive variant adds a hover lift
// and brightens the ring; every card in the app should route through this
// instead of a raw border/rounded-xl div.
export default function Card({
  href,
  children,
  className = '',
  interactive = true,
  padding = 'p-5',
}: {
  href?: string
  children: React.ReactNode
  className?: string
  interactive?: boolean
  padding?: string
}) {
  const shell = `rounded-[1.75rem] p-1.5 bg-white/[0.02] ring-1 ring-white/[0.06] transition-all duration-500 ${EASE} ${
    interactive ? 'hover:ring-signal-400/25 hover:bg-white/[0.035] hover:-translate-y-0.5' : ''
  }`
  const core = `rounded-[calc(1.75rem-0.375rem)] bg-ink-900/80 ${padding} h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`

  const inner = <div className={core}>{children}</div>

  if (href) {
    return (
      <Link href={href} className={`group block ${shell} ${className} ${focusRing}`}>
        {inner}
      </Link>
    )
  }
  return <div className={`${shell} ${className}`}>{inner}</div>
}
