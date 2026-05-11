import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getEntry, getAllTranslate, getRelatedEntries } from '@/lib/seo-content'
import ProgrammaticPage from '@/components/ProgrammaticPage'

export async function generateStaticParams() {
  return getAllTranslate().map(e => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const entry = getEntry('translate', params.slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.metaDescription,
    openGraph: { title: entry.title, description: entry.metaDescription, url: `https://askbiz.co/translate/${entry.slug}` },
    alternates: { canonical: `https://askbiz.co/translate/${entry.slug}` },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const entry = getEntry('translate', params.slug)
  if (!entry) notFound()
  const related = getRelatedEntries(entry)
  return <ProgrammaticPage entry={entry} related={related}/>
}
