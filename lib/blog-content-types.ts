// ============================================================
// AskBiz Blog Content Types
// ============================================================

export interface BlogPost {
  slug: string
  title: string
  metaDescription: string
  cluster: string
  pillar: string
  publishDate: string
  readTime: number
  tldr: string
  sections: { heading: string; level: 2 | 3; body: string }[]
  paa?: { q: string; a: string }[]
  cta?: { heading: string; body: string }
  relatedSlugs?: string[]
}
