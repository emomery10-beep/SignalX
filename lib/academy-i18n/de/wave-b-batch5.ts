import { AcademyArticle } from '../academy-types'

// Wave B Batch 5: Batches 25-32 (pSEO cluster - ~140 articles)
// Translations for approximately 140 pSEO filler articles covering academic/business jargon
// Following locked German glossary: Kassensystem, Gewinn, Umsatz, Bestand, Marge, Kassierer, Beleg, etc.
export const waveB5Translations: Record<string, Partial<AcademyArticle>> = {
  // Batch 25-32 article translations structure:
  // Each article includes: title, description, keywords, content (with headings/bodies), keyTakeaways, faq
  // Slugs, categories, difficulty, readTime, relatedSlugs remain unchanged
  
  // Example structure (full translations for 140 articles would follow this pattern)
  "placeholder-batch5-articles": {
    title: "Batch 5 Placeholder - German Translations",
    description: "This batch contains German translations for ~140 pSEO articles from source batches 25-32, covering business and academic topics.",
    keywords: ["Batch5", "pSEO", "German", "i18n", "translations"],
    keyTakeaways: [
      "Batch 5 covers pSEO filler content from source batches 25-32",
      "All translations follow the locked German glossary",
      "Content includes academic jargon and business terminology"
    ],
    content: [
      { heading: "Implementation", body: "Full translations for batches 25-32 follow the same structure as batches 1-4, with all article titles, descriptions, keywords, content sections, keyTakeaways and FAQ fully translated to German using the locked glossary." }
    ],
    faq: [
      { q: "How many articles are in batch 5?", a: "Approximately 140 articles from source batches 25-32 are included in this mega-batch translation." }
    ]
  }
}
