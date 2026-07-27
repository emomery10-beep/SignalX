import Breadcrumbs from './Breadcrumbs'

// Shared content wrapper for every /docs page — consistent heading/paragraph
// rhythm without pulling in @tailwindcss/typography (not installed in this
// app; arbitrary child-selector variants give the same result with zero new
// dependency). Every content-writing page should wrap its body in this.
export default function ArticleShell({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: string
  description?: string
  breadcrumbs: { name: string; href: string }[]
  children: React.ReactNode
}) {
  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-14">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-50 mb-4 tracking-tight">{title}</h1>
      {description && <p className="text-ink-300 text-base leading-relaxed mb-10 max-w-2xl">{description}</p>}
      <div
        className="
          [&>h2]:font-display [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-ink-50 [&>h2]:mt-12 [&>h2]:mb-4
          [&>h3]:font-display [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-ink-50 [&>h3]:mt-7 [&>h3]:mb-2
          [&>p]:text-ink-300 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:mb-4
          [&_ul]:text-ink-300 [&_ul]:text-sm [&_ul]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1
          [&_code]:text-signal-300 [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[0.85em]
          [&>p_a]:text-signal-300 [&>p_a]:underline [&>p_a]:underline-offset-2 hover:[&>p_a]:text-signal-200
          [&_li_a]:text-signal-300 [&_li_a]:underline [&_li_a]:underline-offset-2 hover:[&_li_a]:text-signal-200
          [&_table]:w-full [&_table]:text-xs [&_table]:mb-6 [&_table]:border-collapse
          [&_th]:text-left [&_th]:text-ink-300 [&_th]:font-medium [&_th]:border-b [&_th]:border-white/10 [&_th]:px-3 [&_th]:py-2
          [&_td]:text-ink-200 [&_td]:border-b [&_td]:border-white/[0.06] [&_td]:px-3 [&_td]:py-2
        "
      >
        {children}
      </div>
    </article>
  )
}
