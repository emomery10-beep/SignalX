import type { Metadata } from 'next'
import { getLocale, getT } from '@/lib/i18n-server'
import { localePath } from '@/lib/i18n-locale'
import BlogIndexClient from './BlogIndexClient'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale()
  const t = getT()
  const title = t('blog_index.meta_title')
  const description = t('blog_index.meta_description')
  const canonical = `https://askbiz.co${localePath('/blog', locale)}`
  return {
    title,
    description,
    keywords: 'business intelligence blog, SME founder guides, eCommerce analytics, POS insights, export market analysis, small business strategy',
    openGraph: {
      title, description, url: canonical, type: 'website', siteName: 'AskBiz',
      images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Blog' }],
    },
    twitter: {
      card: 'summary_large_image', title, description,
      images: ['https://askbiz.co/og-image.png'],
    },
    alternates: {
      canonical,
      languages: {
        en: 'https://askbiz.co/blog',
        es: 'https://askbiz.co/es/blog',
        fr: 'https://askbiz.co/fr/blog',
        de: 'https://askbiz.co/de/blog',
        nl: 'https://askbiz.co/nl/blog',
        ar: 'https://askbiz.co/ar/blog',
      },
    },
  }
}

export default function BlogPage() {
  return <BlogIndexClient />
}
