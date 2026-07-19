'use client'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

export type TabItem = { id: string; label: string }

// Vertical tab list — settings-page convention (Stripe/GitHub-style), not
// the horizontal underline style components/docs/CodeTabs.tsx uses for code
// samples. No reusable tabs component existed anywhere in the monorepo
// before this (checked) — this is deliberately minimal, single-purpose.
export default function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <nav aria-label="Settings sections" className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
          className={`text-left px-3 py-2.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${focusRing} ${
            active === item.id ? 'bg-ink-700 text-ink-50' : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
