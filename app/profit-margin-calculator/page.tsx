import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Profit Margin Calculator & Analyser for Small Business | AskBiz',
  description: 'Find out your real profit margin product by product. AskBiz calculates your true margin after all costs and shows exactly which products make money and which lose it.',
  openGraph: { title: 'Profit Margin Calculator for Business | AskBiz', url: 'https://askbiz.co/profit-margin-calculator' },
  alternates: { canonical: 'https://askbiz.co/profit-margin-calculator' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Profit margin calculator for business"
      h1="Find Out Your Real Profit Margin — Product by Product"
      subheading="Most businesses know their revenue. Very few know their real margin after all costs. AskBiz calculates your true profit margin per product and tells you exactly where money is being made and lost."
      intro="Profit margin is the single most important number in any business — and the hardest one to get right. Revenue is easy to see. Real margin, after factoring in cost of goods, shipping, fees, returns, and overhead, is much harder to calculate accurately. Most small business owners have a rough idea of their margins. AskBiz gives you the exact figure, broken down by product, category, and time period — in seconds."
      problem={{
        heading: "Why most businesses are wrong about their profit margins",
        body: "The gap between perceived margin and actual margin is one of the most common financial blind spots in small business. A product that sells well might look profitable until you account for payment processing fees, returns, packaging, and shipping. A product with a modest sales volume might quietly be your highest-margin item. Without precise margin analysis across your entire range, you can't make good decisions about pricing, promotion, or product development. You're driving with an inaccurate dashboard."
      }}
      solution={{
        heading: "AskBiz calculates your real margin — not the simplified version",
        body: "Upload your sales and cost data to AskBiz and ask: 'What is my actual profit margin per product?' AskBiz reads your costs, selling prices, and any additional fees in your data, calculates the true gross margin for each product, ranks them from highest to lowest, and flags the ones where margin is below your threshold. It also compares your cost prices against live AliExpress and eBay market data — so you can see whether you could increase margins by sourcing differently or adjusting your prices."
      }}
      features={[
        { icon: '💰', title: 'True margin calculation', body: 'AskBiz calculates gross margin after COGS, fees, and costs — not just the simplified revenue minus purchase price.' },
        { icon: '📊', title: 'Margin by product', body: 'See every product ranked by profit margin so you know exactly which to promote, reprice, or discontinue.' },
        { icon: '🎯', title: 'Pricing recommendations', body: 'AskBiz tells you which products are underpriced relative to market and what price increase would be reasonable.' },
        { icon: '🔴', title: 'Loss leader identification', body: 'Instantly identify products where you\'re making less than you think — or actively losing money after all costs.' },
        { icon: '📈', title: 'Margin trend tracking', body: 'Upload monthly data and track whether your margins are improving or eroding over time.' },
        { icon: '🌍', title: 'Market price comparison', body: 'Compare your margins against live eBay sold prices and AliExpress supplier costs to find margin improvement opportunities.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Upload your sales and cost data', body: 'Include your product names, selling prices, cost prices, and any fee columns. CSV or Excel works.' },
        { step: '2', title: 'Ask your margin question', body: 'Try: "What is my profit margin per product?" or "Which products have the lowest margin?" or "Am I underpricing anything?"' },
        { step: '3', title: 'Get a ranked margin breakdown', body: 'AskBiz returns a full margin table, highlights risk products, and compares against market prices.' },
        { step: '4', title: 'Act on the pricing insight', body: 'Use the pricing recommendations to adjust underpriced products or switch suppliers on high-cost items.' },
      ]}
      faqs={[
        { q: 'How does AskBiz calculate profit margin?', a: 'AskBiz calculates gross profit margin as: (Selling Price − Cost of Goods) ÷ Selling Price × 100. If your data includes additional cost columns such as shipping, fees, or packaging, AskBiz will include these in the calculation to give you a more accurate net margin figure.' },
        { q: 'What data do I need to calculate margin in AskBiz?', a: 'At minimum, you need product names, selling prices, and cost prices. The more detail you provide — shipping costs, returns, marketplace fees — the more accurate the margin calculation will be.' },
        { q: 'Can AskBiz tell me if my prices are too low?', a: 'Yes. AskBiz compares your selling prices against live market data from eBay (actual sold prices) and identifies products where you appear to be pricing below the market rate. It will flag these with a specific pricing recommendation.' },
        { q: 'How is AskBiz different from a standard margin calculator?', a: 'A standard margin calculator gives you one number for one product. AskBiz analyses your entire product range at once, ranks every product by margin, identifies trends, flags risks, and gives you actionable recommendations — in a single query.' },
        { q: 'Can I track whether my margins are improving over time?', a: 'Yes. Upload files from different time periods and ask AskBiz to compare. It can identify whether specific products are becoming more or less profitable, and flag where costs are rising faster than prices.' },
      ]}
      cta={{
        heading: "Find out where your real margins are hiding",
        body: "Upload your product data and ask AskBiz for a full margin breakdown. Takes 60 seconds."
      }}
      relatedPages={[
        { href: '/business-intelligence-for-small-business', label: 'Business intelligence for SMEs' },
        { href: '/analyse-sales-data', label: 'Analyse sales data' },
        { href: '/stock-management-analytics', label: 'Stock management analytics' },
        { href: '/ai-business-analytics', label: 'AI business analytics' },
      ]}
    />
  )
}
