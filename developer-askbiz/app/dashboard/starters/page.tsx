import Link from 'next/link'
import CodeTabs from '@/components/docs/CodeTabs'
import { STARTERS } from '@/lib/starters'

const primaryBtnCls = 'inline-block py-2.5 px-4 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

export default function StartersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Starters</h1>
        <p className="text-ink-300 text-sm max-w-lg">
          Four working requests, ready to run — no blank endpoint picker, no request body to write from scratch.
          Every one of these is safe to try on a test key: nothing real happens.{' '}
          <Link href="/docs/guides/sandbox-keys" className="text-signal-300 underline underline-offset-2">How sandbox keys work →</Link>
        </p>
      </div>

      <div className="space-y-4">
        {STARTERS.map(s => (
          <div key={s.slug} className="border border-ink-700 rounded-xl p-5 bg-ink-900">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
              <div>
                <h2 className="font-display text-base font-bold mb-0.5">{s.title}</h2>
                <p className="text-ink-300 text-sm max-w-md">{s.outcome}</p>
              </div>
              <Link
                href={`/dashboard/console?path=${encodeURIComponent(s.path)}&starter=${s.slug}`}
                className={primaryBtnCls}
              >
                Try it in the console →
              </Link>
            </div>
            <CodeTabs samples={[{ label: 'cURL', lang: 'bash', code: s.curl }]} />
          </div>
        ))}
      </div>
    </div>
  )
}
