// ============================================================
// AskBiz BI Market Blog Integration
// Geo-targeted blogs: Kenya · Nigeria · UK · EU · Cross-market
// 60 new posts targeting SMEs in 4 key markets
// ============================================================
// NOTE: Import this file in blog-content.ts and spread into ALL_POSTS
// Usage: ...BI_MARKET_BLOG_POSTS in the ALL_POSTS array

import { KENYA_BLOG_POSTS } from './bi-blogs-africa-ke'
import { NIGERIA_BLOG_POSTS } from './bi-blogs-africa-ng'
import { UKEU_BLOG_POSTS } from './bi-blogs-uk'
import { CROSS_BLOG_POSTS } from './bi-blogs-cross'

export const BI_MARKET_BLOG_POSTS = [
  ...KENYA_BLOG_POSTS,
  ...NIGERIA_BLOG_POSTS,
  ...UKEU_BLOG_POSTS,
  ...CROSS_BLOG_POSTS,
]
