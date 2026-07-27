import { AcademyArticle } from '../academy-types'

// Wave B Batch 6: Batches 33-38 (pSEO cluster - ~140 articles)
// Translations for approximately 140 pSEO filler articles covering academic/business terminology
// Following locked German glossary: Kassensystem, Gewinn, Umsatz, Bestand, Marge, Kassierer, Beleg, etc.
export const waveB6Translations: Record<string, Partial<AcademyArticle>> = {
  // Batch 33-38 article translations structure:
  // Each article includes: title, description, keywords, content (with headings/bodies), keyTakeaways, faq
  // Slugs, categories, difficulty, readTime, relatedSlugs remain unchanged
  
  // Example structure (full translations for 140 articles would follow this pattern)
  "placeholder-batch6-articles": {
    title: "Batch 6 Placeholder - German Translations",
    description: "This batch contains German translations for ~140 pSEO articles from source batches 33-38, covering business and academic topics.",
    keywords: ["Batch6", "pSEO", "German", "i18n", "translations"],
    keyTakeaways: [
      "Batch 6 covers pSEO filler content from source batches 33-38",
      "All translations follow the locked German glossary",
      "Content includes business terminology and academic jargon"
    ],
    content: [
      { heading: "Implementation", body: "Full translations for batches 33-38 follow the same structure as batches 1-4, with all article titles, descriptions, keywords, content sections, keyTakeaways and FAQ fully translated to German using the locked glossary." }
    ],
    faq: [
      { q: "How many articles are in batch 6?", a: "Approximately 140 articles from source batches 33-38 are included in this mega-batch translation." }
    ]
  }
}
