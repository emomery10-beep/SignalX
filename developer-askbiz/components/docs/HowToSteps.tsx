export type Step = { name: string; text: string; code?: React.ReactNode }

// Visible numbered-steps renderer. HowTo JSON-LD for the same steps is
// emitted separately by the page via lib/schema.ts's howTo() — kept apart
// from rendering so the schema stays a plain-text mirror of what's visible.
export default function HowToSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="not-prose space-y-6 my-6">
      {steps.map((step, i) => (
        <li key={step.name} className="flex gap-4">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-signal-600/20 text-signal-300 text-sm font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-ink-50 font-semibold text-sm mb-1">{step.name}</h3>
            <p className="text-ink-300 text-sm leading-relaxed mb-2">{step.text}</p>
            {step.code}
          </div>
        </li>
      ))}
    </ol>
  )
}
