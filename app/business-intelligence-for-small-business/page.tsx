import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Business Intelligence for Small Business | AskBiz',
  description: 'AskBiz gives small business owners instant answers from their sales data. No analysts, no dashboards. Upload your data, ask a question, get the answer. Free to try.',
  openGraph: { title: 'Business Intelligence for Small Business | AskBiz', description: 'AI-powered BI built for SME owners. From £19/month.', url: 'https://askbiz.co/business-intelligence-for-small-business' },
  alternates: { canonical: 'https://askbiz.co/business-intelligence-for-small-business' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Business intelligence for small business"
      h1="Business Intelligence Built for Small Business Owners"
      subheading="Stop guessing what's happening in your business. AskBiz connects to your sales data and answers your questions in plain English — with charts, KPI cards, and recommendations. No analyst needed."
      intro="Business intelligence used to be reserved for large companies with dedicated data teams and six-figure software budgets. AskBiz changes that. It gives every small business owner — from a corner shop in Manchester to an ecommerce seller in Lagos — the same data insight that enterprise teams rely on, at a price that makes sense for an SME. Upload your CSV or Excel file, ask a plain-English question about your revenue, margins, or stock levels, and get a clear answer with charts and recommendations in seconds."
      problem={{
        heading: "The problem with business intelligence tools for small businesses",
        body: "Most BI tools are built for enterprise. They require technical setup, data engineering, and weeks of configuration before you see a single number. Small business owners don't have the time, the budget, or the data science team to make those tools work. The result? Most SME owners make decisions based on gut feeling, rough spreadsheet estimates, and experience — when their data already contains the answers. The gap between what business owners know and what their data shows is where profit disappears, stock runs out, and pricing mistakes go unnoticed for months."
      }}
      solution={{
        heading: "AskBiz: business intelligence that actually works for SMEs",
        body: "AskBiz is built from the ground up for small business owners. You don't configure dashboards, write SQL, or hire a consultant. You upload your sales data — the same spreadsheet you already keep — and you ask questions like you'd ask a colleague. 'What's my best margin product this month?' 'Which products are draining cash?' 'Should I increase my prices?' AskBiz reads your data, applies business logic, and gives you a direct answer with a chart and a clear recommendation. It also connects to live market data from AliExpress, eBay, and Google Trends — so it can tell you not just what's happening in your business, but how you compare to the market."
      }}
      features={[
        { icon: '💬', title: 'Ask in plain English', body: 'No SQL, no formulas. Type your question like you\'d ask a smart colleague and get a straight answer.' },
        { icon: '📊', title: 'Instant charts and KPIs', body: 'Every answer comes with relevant charts, KPI cards, and trend indicators so you can see the data, not just read about it.' },
        { icon: '🎯', title: 'Specific recommendations', body: 'AskBiz doesn\'t just describe your data. It tells you what to do about it — with numbered, prioritised actions.' },
        { icon: '🌍', title: 'Live market data', body: 'Compare your prices and costs against live data from AliExpress, eBay, and Google Trends. Know if you\'re underpricing before your competitors do.' },
        { icon: '📈', title: 'Forecasts and alerts', body: 'Set stock alerts, run cashflow forecasts, and get notified when margins drop below your threshold.' },
        { icon: '🔒', title: 'Your data stays yours', body: 'GDPR compliant. Your financial data is never sold or shared. Full transparency on what\'s stored and why.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Upload your sales data', body: 'Drop in a CSV or Excel file — the same spreadsheet you already use. Takes 30 seconds.' },
        { step: '2', title: 'Ask your first question', body: 'Type any business question in plain English. "What\'s my best product by margin?" or "Which stock should I reorder?"' },
        { step: '3', title: 'Get a clear answer', body: 'AskBiz returns a direct answer with a chart, KPI cards, and 3–5 specific recommendations. No interpretation needed.' },
        { step: '4', title: 'Act on the insight', body: 'Use the action buttons to dig deeper — cashflow forecast, pricing analysis, stock risk — or export your findings.' },
      ]}
      faqs={[
        { q: 'What is business intelligence for small business?', a: 'Business intelligence (BI) for small business is the practice of using your own sales and operations data to make better decisions. It covers understanding your margins, identifying your best products, forecasting demand, and spotting risks before they become problems. AskBiz makes BI accessible to every SME owner without the technical complexity of traditional BI tools.' },
        { q: 'Do I need technical skills to use AskBiz?', a: 'No. AskBiz is designed for business owners, not data scientists. If you can write an email, you can use AskBiz. You upload your data, type your question in plain English, and get a clear answer. No SQL, no dashboards to configure, no training required.' },
        { q: 'What data formats does AskBiz support?', a: 'AskBiz accepts CSV and Excel (.xlsx, .xls) files. These are the most common formats exported from accounting software, Shopify, WooCommerce, point-of-sale systems, and manual spreadsheets.' },
        { q: 'How much does AskBiz cost?', a: 'AskBiz has a free plan with 10 questions per month — no credit card required. The Growth plan is £19/month and includes 500 questions, expansion intelligence, alerts, and forecasts. The Business plan is £49/month for unlimited uploads and team access.' },
        { q: 'Is my business data safe with AskBiz?', a: 'Yes. AskBiz is GDPR compliant and does not sell your data. Your financial data is stored securely and only used to answer your questions. You can delete your data at any time from the privacy settings.' },
      ]}
      cta={{
        heading: "Start making data-driven decisions today",
        body: "Upload your first file, ask your first question, and get your first insight in under 3 minutes. No card required to start."
      }}
      relatedPages={[
        { href: '/analyse-sales-data', label: 'How to analyse sales data' },
        { href: '/profit-margin-calculator', label: 'Profit margin calculator' },
        { href: '/stock-management-analytics', label: 'Stock management analytics' },
        { href: '/ai-business-analytics', label: 'AI business analytics' },
      ]}
    />
  )
}
