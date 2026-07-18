import Link from 'next/link'

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span className="text-ink-200" aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-signal-300 transition-colors">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
