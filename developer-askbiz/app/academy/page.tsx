import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/docs/JsonLd'
import Eyebrow from '@/components/ui/Eyebrow'
import Card from '@/components/ui/Card'
import Reveal from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { webPage, SITE } from '@/lib/schema'
import { TRACKS, LESSONS } from '@/lib/academy'

const URL = `${SITE}/academy`

export const metadata: Metadata = {
  title: 'AskBiz Academy — Learn to Build on the AskBiz API',
  description: 'Structured learning paths and project tutorials for developers building on the AskBiz API — from your first API key to a production-ready integration.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'AskBiz Academy',
    description: 'Structured learning paths and project tutorials for building on the AskBiz API.',
    url: URL,
    siteName: 'AskBiz Developers',
    type: 'website',
  },
}

const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'bg-signal-500/10 text-signal-300 ring-signal-400/20',
  Intermediate: 'bg-pulse-500/10 text-pulse-300 ring-pulse-400/20',
  Advanced: 'bg-white/[0.06] text-ink-200 ring-white/10',
}

export default function AcademyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <Reveal>
        <div className="max-w-2xl mb-16">
          <div className="mb-4"><Eyebrow>AskBiz Academy</Eyebrow></div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-50 mb-5 tracking-tight">
            Learn to build on AskBiz
          </h1>
          <p className="text-ink-300 text-base leading-relaxed mb-8">
            Four tracks, beginner to advanced, plus stand-alone lessons on the things reference docs don&rsquo;t
            cover well — project tutorials and the reasoning behind design decisions like billing and idempotency.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/academy/build-your-first-integration">Start the first lesson</Button>
            <Button href="/docs/quickstart" variant="secondary">Jump to quickstart</Button>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <h2 className="font-display text-lg font-bold text-ink-50 mb-6">Learning tracks</h2>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {TRACKS.map((track, i) => (
          <Reveal key={track.slug} delay={i * 60}>
            <Card interactive={false} padding="p-6" className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ${LEVEL_COLOR[track.level]}`}>
                  {track.level}
                </span>
                <span className="text-ink-500 text-[10px]">{track.steps.length} steps</span>
              </div>
              <h3 className="text-ink-50 text-base font-bold mb-1.5">{track.title}</h3>
              <p className="text-ink-400 text-xs leading-relaxed mb-4">{track.summary}</p>
              <ol className="space-y-2">
                {track.steps.map((step, si) => (
                  <li key={step.href}>
                    <Link href={step.href} className="group flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/[0.06] text-ink-400 text-[10px] font-bold flex items-center justify-center mt-0.5 group-hover:bg-signal-500/20 group-hover:text-signal-300 transition-colors">
                        {si + 1}
                      </span>
                      <span className="text-ink-300 text-xs leading-relaxed group-hover:text-ink-100 transition-colors">
                        <span className="font-medium text-ink-100 group-hover:text-signal-300">{step.title}</span> — {step.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="font-display text-lg font-bold text-ink-50 mb-6">Lessons</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-5">
        {LESSONS.map((lesson, i) => (
          <Reveal key={lesson.slug} delay={i * 60}>
            <Card href={`/academy/${lesson.slug}`} padding="p-6" className="h-full">
              <p className="text-ink-500 text-[10px] font-semibold uppercase tracking-wide mb-3">{lesson.readMinutes} min read</p>
              <h3 className="text-ink-50 text-sm font-bold mb-2 leading-snug">{lesson.title}</h3>
              <p className="text-ink-400 text-xs leading-relaxed">{lesson.summary}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <JsonLd data={webPage({
        url: URL,
        name: 'AskBiz Academy',
        description: 'Structured learning paths and project tutorials for building on the AskBiz API.',
        dateModified: '2026-07-27',
        breadcrumb: [{ name: 'Academy', url: URL }],
      })} />
    </div>
  )
}
