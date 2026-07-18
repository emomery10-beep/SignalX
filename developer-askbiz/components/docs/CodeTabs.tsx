'use client'
import { useState } from 'react'

export type CodeSample = { label: string; lang: string; code: string }

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// Tabbed multi-language code block — cURL / JavaScript / Python is the
// baseline industry expectation (Stripe, Twilio) for any endpoint reference.
// Kept dependency-free (no syntax highlighter) to match this app's existing
// zero-icon-library, zero-component-library convention.
export default function CodeTabs({ samples }: { samples: CodeSample[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="border border-ink-700 rounded-xl overflow-hidden bg-ink-950 not-prose">
      <div className="flex border-b border-ink-700 bg-ink-900">
        {samples.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors ${focusRing} ${
              active === i ? 'text-signal-300 border-b-2 border-signal-500 -mb-px' : 'text-ink-300 hover:text-ink-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-ink-100"><code>{samples[active].code}</code></pre>
    </div>
  )
}
