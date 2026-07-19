// schema.org JSON-LD builders for the public /docs section. Every builder
// returns plain data (no rendering) — components/docs/JsonLd.tsx serializes
// it. Only mark up content that is actually visible on the page — schema
// spam (claims not backed by real page content) gets filtered by Google and
// erodes trust with AI answer engines that cross-check structured data
// against the rendered page.

export const SITE = 'https://developer.askbiz.co'
export const ORG_NAME = 'AskBiz'
export const ORG_URL = 'https://askbiz.co'

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Site-wide identity — include once, in the root /docs layout. */
export function organizationAndWebsite() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${ORG_URL}#organization`,
      name: ORG_NAME,
      url: ORG_URL,
      logo: `${ORG_URL}/icon.svg`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE}#website`,
      name: 'AskBiz Developers',
      url: SITE,
      publisher: { '@id': `${ORG_URL}#organization` },
    },
  ]
}

/** For each API reference page — describes it as a technical article about
 * a specific part of the SoftwareApplication (the AskBiz API). */
export function techArticle(opts: {
  url: string
  headline: string
  description: string
  breadcrumb: { name: string; url: string }[]
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${opts.url}#article`,
        headline: opts.headline,
        description: opts.description,
        url: opts.url,
        mainEntityOfPage: opts.url,
        inLanguage: 'en',
        dateModified: opts.dateModified || '2026-07-17',
        author: { '@id': `${ORG_URL}#organization` },
        publisher: { '@id': `${ORG_URL}#organization` },
      },
      breadcrumbs(opts.breadcrumb),
    ],
  }
}

/** For How-to guides — numbered steps become eligible for HowTo rich results. */
export function howTo(opts: {
  url: string
  name: string
  description: string
  steps: { name: string; text: string }[]
  breadcrumb: { name: string; url: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${opts.url}#howto`,
        name: opts.name,
        description: opts.description,
        step: opts.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      },
      breadcrumbs(opts.breadcrumb),
    ],
  }
}

/** Generic WebPage schema for content that isn't an article, guide, or FAQ —
 * legal pages (Terms, Privacy) and the human-readable sitemap. Mirrors the
 * WebPage type used by askbiz.co's app/rules/[policy]/page.tsx. For Terms
 * specifically: there's no schema.org "TermsOfService" type — WebPage +
 * dateModified is the correct, widely-supported choice search engines
 * actually key off for legal-content freshness. */
export function webPage(opts: {
  url: string
  name: string
  description: string
  dateModified: string
  breadcrumb: { name: string; url: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${opts.url}#webpage`,
        name: opts.name,
        description: opts.description,
        url: opts.url,
        inLanguage: 'en',
        dateModified: opts.dateModified,
        isPartOf: { '@id': `${SITE}#website` },
        publisher: { '@id': `${ORG_URL}#organization` },
      },
      breadcrumbs(opts.breadcrumb),
    ],
  }
}

/** For any page with real Q&A content — AEO's highest-leverage schema,
 * increases citation likelihood in AI answer engines even with 2-3 questions. */
export function faqPage(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}
