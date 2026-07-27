import JsonLd from './JsonLd'
import { faqPage } from '@/lib/schema'

export type Faq = { question: string; answer: string }

// Renders a visible Q&A block AND emits FAQPage JSON-LD for it — per the
// AEO skill, this is the single highest-leverage schema for AI citation,
// worth adding even for 2-3 questions. Only use for genuine, page-relevant
// questions; never pad with generic filler just to trigger the schema.
export default function FaqBlock({ items, heading = 'Frequently asked questions' }: { items: Faq[]; heading?: string }) {
  if (items.length === 0) return null
  return (
    <section className="not-prose mt-12">
      <h2 className="font-display text-lg font-bold text-ink-50 mb-5">{heading}</h2>
      <div className="space-y-3">
        {items.map(item => (
          <details key={item.question} className="group rounded-2xl p-1.5 bg-white/[0.02] ring-1 ring-white/[0.06] open:ring-signal-400/20 transition-colors duration-300">
            <summary className="cursor-pointer text-sm font-medium text-ink-100 list-none flex items-center justify-between gap-3 rounded-xl bg-ink-900/60 px-4 py-3.5">
              {item.question}
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/[0.06] text-ink-400 flex items-center justify-center group-open:rotate-45 transition-transform duration-300 text-sm leading-none">+</span>
            </summary>
            <p className="text-ink-300 text-sm mt-1 leading-relaxed px-4 pb-3.5 pt-2">{item.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqPage(items)} />
    </section>
  )
}
