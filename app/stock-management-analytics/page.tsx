import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Stock Management Analytics for Retailers & Ecommerce | AskBiz',
  description: 'Know exactly what to restock before you run out. AskBiz analyses your inventory data and tells you what to reorder, what\'s overstocked, and what\'s draining margins.',
  openGraph: { title: 'Stock Management Analytics | AskBiz', url: 'https://askbiz.co/stock-management-analytics' },
  alternates: { canonical: 'https://askbiz.co/stock-management-analytics' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Stock management analytics"
      h1="Know Exactly What to Restock — Before You Run Out"
      subheading="AskBiz analyses your inventory and sales data to tell you what needs reordering, what's tying up cash, and which products are quietly draining your margins."
      intro="Stock management is one of the most cash-intensive decisions a retail or ecommerce business makes. Overstock the wrong product and you tie up thousands in slow-moving inventory. Understock the right one and you lose sales, disappoint customers, and hand revenue to competitors. Most SME owners manage this with instinct, experience, and a rough eye on the spreadsheet. AskBiz replaces the guesswork with data — analysing your actual sales velocity, margin contribution, and stock levels to give you precise reorder recommendations."
      problem={{
        heading: "The hidden cost of poor stock management",
        body: "Most retail and ecommerce businesses carry 20–35% more stock than they need, while simultaneously running out of their best sellers. The result is a double hit: cash tied up in slow-moving inventory, and lost sales from stockouts on the products that actually move. Traditional stock management tools require integration, configuration, and ongoing maintenance. Most small businesses never implement them properly — so they rely on intuition and end up ordering the same quantities they always have, regardless of what the data shows."
      }}
      solution={{
        heading: "Stock analytics that tells you what to do, not just what happened",
        body: "Upload your inventory and sales data to AskBiz and ask: 'What should I restock this week?' AskBiz analyses your stock levels against your sales velocity, identifies items below reorder threshold, flags slow-moving stock tying up cash, and ranks reorder priorities by margin contribution. It also compares your cost prices against live AliExpress supplier data — so if you're paying more than the current market rate for a product, AskBiz will tell you. The result is a clear, prioritised restock list generated in seconds, not spreadsheet hours."
      }}
      features={[
        { icon: '📦', title: 'Reorder point analysis', body: 'AskBiz calculates which products are at or below reorder threshold based on your current stock and sales velocity.' },
        { icon: '💸', title: 'Cash drain identification', body: 'Instantly see which slow-moving products are tying up your working capital and should be cleared or discounted.' },
        { icon: '📉', title: 'Margin by product', body: 'Know exactly which products contribute the most to your bottom line — so you prioritise restocking the right ones.' },
        { icon: '🏷️', title: 'Supplier price comparison', body: 'AskBiz compares your cost prices against live AliExpress data to identify where you\'re overpaying suppliers.' },
        { icon: '🔔', title: 'Stock alerts', body: 'Set custom alerts for when any product drops below your minimum stock level. Get notified before you run out.' },
        { icon: '📊', title: 'Inventory health dashboard', body: 'Visual overview of your entire inventory — which products are healthy, at risk, and critical — in one view.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Upload your inventory data', body: 'Export your stock report from your POS, Shopify, or spreadsheet. Upload the CSV or Excel file to AskBiz.' },
        { step: '2', title: 'Ask your stock question', body: 'Try: "What do I need to restock urgently?" or "Which products are overstocked?" or "What\'s my slowest-moving inventory?"' },
        { step: '3', title: 'Get a prioritised restock list', body: 'AskBiz returns a ranked list with specific quantities, flagged risks, and the margin impact of each decision.' },
        { step: '4', title: 'Set alerts for next time', body: 'Configure stock alerts so you get notified automatically when products hit your reorder threshold.' },
      ]}
      faqs={[
        { q: 'What stock data does AskBiz need?', a: 'AskBiz works with any spreadsheet that includes product names, current stock levels, unit costs, and ideally recent sales quantities. You can export this from most POS systems, inventory management tools, or Shopify. The more detail you include, the more precise the recommendations.' },
        { q: 'Can AskBiz tell me what quantity to reorder?', a: 'Yes. Based on your sales velocity and current stock levels, AskBiz can calculate recommended reorder quantities. It factors in your average sales rate to estimate how long your current stock will last and how much you need to order.' },
        { q: 'Does AskBiz integrate directly with my POS or Shopify?', a: 'Direct integration with Shopify and other platforms is available on Growth and Business plans via the Sources feature. You can also manually upload export files at any time, which works for all plans.' },
        { q: 'How does AskBiz compare my costs to AliExpress?', a: 'AskBiz connects to the AliExpress API to fetch current supplier prices for products matching your inventory. If a supplier is offering the same product at a significantly lower cost, AskBiz will highlight the saving and the potential margin improvement.' },
        { q: 'Can I use AskBiz for both retail and ecommerce inventory?', a: 'Yes. AskBiz is used by retail shop owners, market traders, Shopify sellers, distributors, and wholesalers across multiple countries. The stock analytics features work the same regardless of your channel.' },
      ]}
      cta={{
        heading: "Stop guessing what to reorder",
        body: "Upload your stock data and ask AskBiz what needs restocking. Get a prioritised list in under 60 seconds."
      }}
      relatedPages={[
        { href: '/business-intelligence-for-small-business', label: 'Business intelligence for SMEs' },
        { href: '/analyse-sales-data', label: 'Analyse sales data' },
        { href: '/profit-margin-calculator', label: 'Profit margin calculator' },
        { href: '/ai-business-analytics', label: 'AI business analytics' },
      ]}
    />
  )
}
