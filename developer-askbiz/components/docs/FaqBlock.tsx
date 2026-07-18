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
    <section className="not-prose mt-10">
      <h2 className="font-display text-lg font-bold text-ink-50 mb-4">{heading}</h2>
      <div className="space-y-3">
        {items.map(item => (
          <details key={item.question} className="group border border-ink-700 rounded-xl bg-ink-900 p-4">
            <summary className="cursor-pointer text-sm font-medium text-ink-100 list-none flex items-center justify-between gap-3">
              {item.question}
              <span className="text-ink-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
            </summary>
            <p className="text-ink-300 text-sm mt-3 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqPage(items)} />
    </section>
  )
}
