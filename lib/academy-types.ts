export interface AcademyCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
}

export interface AcademyArticleSection {
  heading: string;
  body: string;
  /** Optional illustrative image path shown beneath the section heading. */
  image?: string;
}

export interface AcademyArticleFAQ {
  q: string;
  a: string;
}

export interface AcademyArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: number;
  keywords: string[];
  keyTakeaways: string[];
  content: AcademyArticleSection[];
  relatedSlugs: string[];
  faq?: AcademyArticleFAQ[];
  /** YouTube video URL or ID — if present, a watch-first embed is shown above the article body */
  videoUrl?: string;
}
