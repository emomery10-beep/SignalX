import { getAllPosts } from '@/lib/blog-content'

const BASE = 'https://askbiz.co'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .slice(0, 100)
    .map(post => {
      const url     = `${BASE}/blog/${post.slug}`
      const pubDate = new Date(post.publishDate).toUTCString()
      const desc    = (post.tldr || post.metaDescription || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const title   = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.tldr || post.metaDescription}]]></description>
      <category><![CDATA[${post.cluster}]]></category>
      ${post.pillar ? `<category><![CDATA[${post.pillar}]]></category>` : ''}
      <author>hello@askbiz.co (AskBiz)</author>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AskBiz Blog — Selling, Money & Growth for Small Businesses</title>
    <link>${BASE}/blog</link>
    <description>Practical guides on selling, mobile money, stock, and growth for market stalls, shops and small businesses. ${posts.length} articles.</description>
    <language>en-gb</language>
    <managingEditor>hello@askbiz.co (AskBiz)</managingEditor>
    <webMaster>hello@askbiz.co (AskBiz)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${BASE}/logo.svg</url>
      <title>AskBiz Blog</title>
      <link>${BASE}/blog</link>
    </image>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
