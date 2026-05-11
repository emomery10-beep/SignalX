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
}
