import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'How to Analyse Sales Data for Your Business | AskBiz',
  description: 'Upload your sales data and ask questions in plain English. AskBiz analyses your CSV or Excel file and gives clear answers with charts in seconds. Free to start.',
  openGraph: { title: 'How to Analyse Sales Data | AskBiz', description: 'AI-powered sales data analysis for SME owners.', url: 'https://askbiz.co/analyse-sales-data' },
  alternates: { canonical: 'https://askbiz.co/analyse-sales-data' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="How to analyse sales data"
      h1="Analyse Your Sales Data Without a Spreadsheet Expert"
      subheading="Upload your CSV or Excel file and ask questions in plain English. AskBiz reads your sales data and gives you clear answers, charts, and recommendations in seconds."
      intro="Analysing sales data is one of the most valuable things a business owner can do — and one of the most time-consuming. Most small businesses sit on months of untapped sales data locked inside spreadsheets, accounting exports, or Shopify reports. The data contains answers to their biggest questions: which products are actually profitable, which customers spend the most, which months are at risk of a cashflow crunch. AskBiz unlocks those answers instantly, without pivot tables, VLOOKUP formulas, or a data analyst on payroll."
      problem={{
        heading: "Why most small businesses don't properly analyse their sales data",
        body: "It's not a lack of data — it's a lack of time and tools. Properly analysing a sales spreadsheet means knowing which formulas to write, which pivot tables to build, and which charts to create. Most business owners learned just enough Excel to keep records, not enough to extract insights. So the data sits there, unused, while decisions get made on instinct. The ones who do manage to analyse their data often spend hours doing it manually — hours that could be spent running the business."
      }}
      solution={{
        heading: "AskBiz analyses your sales data in plain English",
        body: "Instead of formulas and pivot tables, you type a question. 'What was my best-selling product last month?' 'Which product category has the highest margin?' 'Are my sales trending up or down?' AskBiz reads your uploaded data, performs the analysis automatically, and returns a direct answer with a chart and recommendations. It handles the technical analysis so you can focus on the decision. And because it connects to live market data, it can also tell you how your sales performance compares to current market prices and trends."
      }}
      features={[
        { icon: '📂', title: 'Upload any sales file', body: 'CSV, XLSX, or XLS — exported from Shopify, WooCommerce, QuickBooks, Xero, or any spreadsheet.' },
        { icon: '🔍', title: 'Ask anything about your data', body: 'Revenue trends, margin analysis, best sellers, worst performers, seasonal patterns — ask it all in plain English.' },
        { icon: '📈', title: 'Automatic chart generation', body: 'Every data answer comes with a relevant chart — line trends, bar comparisons, or breakdowns — generated automatically.' },
        { icon: '🎯', title: 'Prioritised recommendations', body: 'After every analysis, AskBiz gives you 3–5 specific actions ranked by impact on your revenue or margins.' },
        { icon: '⚡', title: 'Results in seconds', body: 'No waiting, no loading. Ask your question and get your answer while you\'re still thinking about the question.' },
        { icon: '🔄', title: 'Upload multiple files', body: 'Compare months, track trends over time, or analyse different product lines across separate uploads.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Export your sales data', body: 'Download a CSV or Excel report from your POS, accounting software, or ecommerce platform. Or use an existing spreadsheet.' },
        { step: '2', title: 'Upload to AskBiz', body: 'Drag and drop your file. AskBiz reads the structure automatically — no mapping, no configuration.' },
        { step: '3', title: 'Ask your sales questions', body: 'Type any question about your data. Start with: "What\'s my total revenue this period?" or "Which product has the lowest margin?"' },
        { step: '4', title: 'Read the analysis', body: 'Get a direct answer, a chart, KPI breakdown, and specific recommendations. Share or export the insight.' },
      ]}
      faqs={[
        { q: 'What types of sales data can AskBiz analyse?', a: 'AskBiz can analyse any structured sales data in CSV or Excel format. This includes point-of-sale exports, Shopify order reports, WooCommerce exports, accounting software reports, and manually maintained spreadsheets. As long as your data has columns for products, quantities, prices, and dates, AskBiz can work with it.' },
        { q: 'Do I need to format my spreadsheet in a specific way?', a: 'No. AskBiz reads your data as-is and identifies the relevant columns automatically. It works with a wide variety of layouts, column naming conventions, and data formats. You don\'t need to clean or reformat your file before uploading.' },
        { q: 'How long does it take to analyse a sales file?', a: 'The upload and analysis takes seconds. Once your file is uploaded, AskBiz answers questions about it instantly. Most users have their first meaningful insight within 3 minutes of signing up.' },
        { q: 'Can AskBiz analyse sales data across multiple time periods?', a: 'Yes. You can upload files from different periods and ask comparative questions. AskBiz can identify trends, seasonal patterns, and month-over-month changes from your data.' },
        { q: 'What does AskBiz do with my sales data?', a: 'Your data is used only to answer your questions. AskBiz does not sell your data or share it with third parties. If you opt in to data personalisation, aggregated financial metrics may be stored to improve your experience, but raw data is never retained beyond your session.' },
      ]}
      cta={{
        heading: "Analyse your sales data in 3 minutes",
        body: "Upload your file, ask your first question, get your first insight. No spreadsheet skills required."
      }}
      relatedPages={[
        { href: '/business-intelligence-for-small-business', label: 'Business intelligence for SMEs' },
        { href: '/profit-margin-calculator', label: 'Profit margin calculator' },
        { href: '/stock-management-analytics', label: 'Stock management analytics' },
        { href: '/ai-business-analytics', label: 'AI business analytics' },
      ]}
    />
  )
}
