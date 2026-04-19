import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'AI Business Analytics Tool for SMEs | AskBiz',
  description: 'AskBiz uses AI to answer your business questions from your own data. Ask about revenue, margins, stock, pricing, and forecasts. Powered by Claude AI. From £19/month.',
  openGraph: { title: 'AI Business Analytics for SMEs | AskBiz', url: 'https://askbiz.co/ai-business-analytics' },
  alternates: { canonical: 'https://askbiz.co/ai-business-analytics' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="AI business analytics tool for SMEs"
      h1="AI Business Analytics — Without the £40,000 Price Tag"
      subheading="AskBiz uses AI to answer your business questions directly from your own data. Revenue analysis, margin breakdowns, stock alerts, cashflow forecasts — all in plain English. From £19/month."
      intro="AI-powered business analytics tools have existed for years — but they've been priced for enterprises with data science teams and six-figure software budgets. AskBiz brings the same capability to every SME owner. It uses Claude AI, one of the most advanced language models available, to read your business data and answer your questions with the accuracy of a trained commercial analyst. You don't need to understand AI to use it. You just need to know what you want to find out."
      problem={{
        heading: "Enterprise AI analytics tools aren't built for SMEs",
        body: "Most AI analytics tools on the market require data warehouses, API integrations, business intelligence certifications, and implementation consultants. The entry price is tens of thousands of pounds per year before you've seen a single insight. Small business owners are left with basic spreadsheet tools, disconnected apps, and no way to combine their data into a coherent picture of their business. The AI revolution in business intelligence hasn't reached the businesses that need it most."
      }}
      solution={{
        heading: "AskBiz brings AI analytics to every SME",
        body: "AskBiz is powered by Claude AI and purpose-built for small and medium business owners. You upload your data — a simple spreadsheet — and ask questions in plain English. The AI reads your data, applies commercial business logic, and returns structured answers with charts, KPI cards, and prioritised recommendations. It doesn't require integration, configuration, or technical expertise. And it's connected to live market data from AliExpress, eBay, and Google Trends — so your AI analytics are grounded in real market conditions, not just historical records."
      }}
      features={[
        { icon: '🤖', title: 'Powered by Claude AI', body: 'AskBiz uses Anthropic\'s Claude AI — one of the most capable and accurate language models available — to analyse your business data.' },
        { icon: '💬', title: 'Conversational analytics', body: 'Ask follow-up questions in context. "Now show me just the top 5." "What if I increased prices by 10%?" The AI understands the conversation.' },
        { icon: '📊', title: 'Structured insight output', body: 'Every AI response includes an insight summary, KPI cards with colour-coded status, a chart, and numbered recommendations.' },
        { icon: '🌐', title: 'Live market intelligence', body: 'The AI is connected to real-time data from AliExpress, eBay, and Google Trends — giving context beyond just your own numbers.' },
        { icon: '🔮', title: 'AI-powered forecasting', body: 'Ask for next-month revenue projections, cashflow forecasts, or demand predictions based on your historical data patterns.' },
        { icon: '🎯', title: 'Expansion intelligence', body: 'Ask the AI what new products you should launch, which markets to enter, and what adjacent opportunities your data suggests.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Upload your business data', body: 'Drop in a CSV or Excel file. AskBiz works with sales reports, inventory files, P&L exports — anything structured.' },
        { step: '2', title: 'Ask the AI a business question', body: 'Type in plain English: "What\'s happening with my margins?" "Which products should I focus on?" "Am I going to have a cashflow problem next month?"' },
        { step: '3', title: 'Get AI-powered analysis', body: 'The AI returns a structured answer: insight summary, KPI breakdown, chart, and specific recommendations — in seconds.' },
        { step: '4', title: 'Dig deeper with follow-ups', body: 'Ask follow-up questions, click action buttons, or export the analysis. The AI remembers your data and context throughout the session.' },
      ]}
      faqs={[
        { q: 'What AI model does AskBiz use?', a: 'AskBiz is powered by Claude by Anthropic — one of the most advanced and accurate AI language models currently available. Claude is specifically designed for complex reasoning and analysis, making it well-suited for business data questions.' },
        { q: 'How accurate is AI business analytics?', a: 'AskBiz grounds every answer in your actual data — it doesn\'t make up numbers or hallucinate figures. The AI reads your uploaded data directly and calculates from it. Every answer includes a source note confirming the analysis is based on your data, not assumptions.' },
        { q: 'Can the AI forecast future performance?', a: 'Yes. Based on your historical data patterns, AskBiz can project future revenue, flag potential cashflow crunches, and estimate demand for upcoming periods. Forecasts are clearly marked as projections and include a confidence indicator.' },
        { q: 'Is AI business analytics suitable for non-technical business owners?', a: 'Absolutely. AskBiz is specifically designed for business owners without technical backgrounds. You interact with the AI the same way you\'d talk to a knowledgeable business advisor — in plain English. No technical training required.' },
        { q: 'How is AskBiz different from ChatGPT for business analytics?', a: 'ChatGPT is a general-purpose AI. AskBiz is a purpose-built business intelligence tool that connects the AI directly to your uploaded data, formats answers as structured business insights, integrates live market data, and provides specific commercial recommendations rather than general advice.' },
      ]}
      cta={{
        heading: "Try AI business analytics — free",
        body: "Upload your data, ask your first question, and see what AI-powered analytics can tell you about your business in under 3 minutes."
      }}
      relatedPages={[
        { href: '/business-intelligence-for-small-business', label: 'Business intelligence for SMEs' },
        { href: '/analyse-sales-data', label: 'Analyse sales data' },
        { href: '/profit-margin-calculator', label: 'Profit margin calculator' },
        { href: '/stock-management-analytics', label: 'Stock management analytics' },
      ]}
    />
  )
}
