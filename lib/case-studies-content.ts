export interface CaseStudy {
  slug: string;
  company: string;
  logo: string;
  industry: string;
  location: string;
  employees: string;
  headline: string;
  metaDescription: string;
  challenge: string;
  solution: string;
  results: { metric: string; before: string; after: string; improvement: string }[];
  quote: { text: string; author: string; role: string };
  timeline: string;
  productsUsed: string[];
  sections: { heading: string; body: string }[];
  publishDate: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "brewdog-pop-up-pos",
    company: "BrewDog Pop-Up Events",
    logo: "🍺",
    industry: "Food & Beverage",
    location: "London, UK",
    employees: "12 event staff",
    headline: "How a craft beer pop-up cut checkout time by 40% with AskBiz POS",
    metaDescription: "BrewDog pop-up events reduced checkout time by 40% and eliminated stock discrepancies using AskBiz POS with real-time inventory tracking across 3 locations.",
    challenge: "Running pop-up bars at festivals and markets across London meant managing inventory across 3 temporary locations with no reliable internet. Staff were using paper tallies, leading to stock discrepancies of 8–12% per event and long queues at peak times. End-of-day reconciliation took 2 hours.",
    solution: "Deployed AskBiz POS with offline-first syncing across all 3 pop-up locations. Staff used tablet-based checkout with barcode scanning. Real-time inventory sync meant stock could be transferred between locations mid-event when one ran low.",
    results: [
      { metric: "Checkout time", before: "45 seconds", after: "27 seconds", improvement: "40% faster" },
      { metric: "Stock discrepancy", before: "8–12%", after: "< 1%", improvement: "90% reduction" },
      { metric: "End-of-day reconciliation", before: "2 hours", after: "12 minutes", improvement: "90% faster" },
      { metric: "Revenue per event", before: "£8,200", after: "£9,400", improvement: "+15%" },
    ],
    quote: { text: "We were losing stock and losing sales because of queues. AskBiz POS paid for itself in the first weekend.", author: "James K.", role: "Events Manager" },
    timeline: "3 days from signup to first live event",
    productsUsed: ["AskBiz POS", "Inventory Management", "Multi-location Sync"],
    sections: [
      { heading: "The Problem", body: "Festival pop-ups are high-pressure environments. You have a 6-hour window to serve as many customers as possible, and every minute spent fumbling with paper tallies or reconciling stock is lost revenue. The team was also losing product to miscounts — kegs marked as empty that still had 10 pints, or stock moved between tents without being logged." },
      { heading: "Why AskBiz", body: "The team needed something that worked offline (festival Wi-Fi is unreliable), could sync across locations when connectivity returned, and was simple enough for temporary staff to learn in 10 minutes. Most POS systems required merchant accounts and long setup processes — AskBiz was running in 3 days." },
      { heading: "The Rollout", body: "Three iPads were set up with AskBiz POS, one per location. Products were pre-loaded with barcodes. Staff were trained in a 15-minute session. The first event was a Saturday craft market in Bermondsey — 1,200 transactions processed with zero issues." },
      { heading: "The Impact", body: "Faster checkout meant shorter queues, which meant more customers served during peak hours. Real-time inventory visibility meant they could transfer popular lines between locations before they ran out. The 15% revenue increase came from serving more customers and reducing stockouts, not from raising prices." },
    ],
    publishDate: "2026-04-22",
  },
  {
    slug: "nairobi-spice-trader-import",
    company: "Nairobi Spice Traders",
    logo: "🌶️",
    industry: "Import / Export",
    location: "Nairobi, Kenya",
    employees: "8",
    headline: "How a Kenyan spice importer saved 22% on landed costs with AskBiz",
    metaDescription: "Nairobi Spice Traders reduced their landed cost per shipment by 22% using AskBiz's AI-powered cost analysis and supplier comparison tools.",
    challenge: "Importing spices from India and Sri Lanka to Kenya involved multiple hidden costs — fluctuating freight rates, duty miscalculations, and FX losses from paying suppliers in USD while selling in KES. The owner was pricing products based on supplier quotes alone, missing 18–25% of the true landed cost.",
    solution: "Connected Mpesa and supplier invoices to AskBiz. Used the AI chat to ask questions like 'what is my true landed cost for cardamom per kg including duty and FX?' and 'which supplier gives me the best margin after all costs?' AskBiz calculated the full landed cost breakdown for each product and supplier.",
    results: [
      { metric: "Landed cost accuracy", before: "Off by 18–25%", after: "Within 2%", improvement: "Accurate pricing" },
      { metric: "Average margin per product", before: "14%", after: "28%", improvement: "+14 percentage points" },
      { metric: "Supplier comparison time", before: "2 days", after: "5 minutes", improvement: "99% faster" },
      { metric: "Monthly savings on FX", before: "Untracked", after: "KSh 47,000/mo saved", improvement: "New saving" },
    ],
    quote: { text: "I thought I was making money on every shipment. AskBiz showed me I was losing money on 3 of my top 5 products after duty and FX.", author: "Amina W.", role: "Founder" },
    timeline: "1 week to full visibility",
    productsUsed: ["AskBiz Chat", "Landed Cost Analysis", "FX Risk Alerts", "Mpesa Integration"],
    sections: [
      { heading: "The Problem", body: "Small importers in East Africa face a compounding cost problem. Supplier prices are quoted in USD, freight fluctuates with fuel surcharges, Kenya Revenue Authority duty rates vary by HS code, and the KES/USD rate moves daily. Without modelling all of these together, you cannot know your true margin until weeks after the shipment arrives." },
      { heading: "Why AskBiz", body: "Amina tried spreadsheets but couldn't keep up with exchange rate changes and varying duty rates across her 40+ SKUs. She needed something that pulled her real transaction data (from Mpesa and bank statements) and calculated costs automatically. AskBiz was the only tool she found that supported Mpesa natively and let her ask questions in plain English." },
      { heading: "The Discovery", body: "Within the first week, AskBiz flagged that 3 of her top 5 products by revenue were loss-making after duty and FX costs. Cardamom pods — her highest-volume product — had a 14% gross margin on paper but a -3% true margin after landed costs. She immediately renegotiated with her supplier and adjusted retail pricing." },
      { heading: "The Outcome", body: "Six months later, every product has a positive true margin. She dropped one supplier entirely after AskBiz showed their freight costs were 40% above market. Monthly FX savings of KSh 47,000 came from timing purchases based on AskBiz's currency alerts instead of converting on the day invoices arrived." },
    ],
    publishDate: "2026-03-15",
  },
  {
    slug: "yorkshire-candle-co-shopify",
    company: "Yorkshire Candle Co.",
    logo: "🕯️",
    industry: "E-commerce / DTC",
    location: "Leeds, UK",
    employees: "4",
    headline: "How a Shopify candle brand grew revenue 35% using AI sales insights",
    metaDescription: "Yorkshire Candle Co. used AskBiz to identify underperforming products and seasonal trends in their Shopify data, growing monthly revenue by 35% in 4 months.",
    challenge: "A 4-person DTC candle brand selling through Shopify had 180+ SKUs but no way to understand which scents, sizes, and bundles were actually profitable. Shopify's built-in reports showed revenue but not margin. Seasonal patterns were invisible until it was too late to adjust stock levels.",
    solution: "Connected Shopify to AskBiz. The founder used the daily brief and AI chat to ask questions like 'which products have the highest margin?', 'what scents sell best in Q4?', and 'which products should I discontinue?' AskBiz surfaced actionable patterns from 2 years of sales data.",
    results: [
      { metric: "Monthly revenue", before: "£12,400", after: "£16,700", improvement: "+35%" },
      { metric: "SKU count", before: "180+", after: "95", improvement: "47% reduction" },
      { metric: "Average order value", before: "£18.50", after: "£24.20", improvement: "+31%" },
      { metric: "Time on analytics", before: "6 hours/week", after: "20 min/week", improvement: "95% less" },
    ],
    quote: { text: "I was making candles nobody bought because I had no idea what the data was telling me. Now I ask AskBiz and it just tells me.", author: "Sophie R.", role: "Founder" },
    timeline: "Connected in 30 minutes, first insights same day",
    productsUsed: ["AskBiz Chat", "Shopify Integration", "Daily Brief", "Product Analytics"],
    sections: [
      { heading: "The Problem", body: "With 180+ SKUs across different scents, sizes (mini, standard, large), and bundles, Sophie was drowning in data she couldn't interpret. Shopify showed total revenue by product but not margin — she didn't know that her best-selling scent (Lavender Fields) was actually her lowest-margin product because of the premium essential oil cost." },
      { heading: "Why AskBiz", body: "Sophie needed to ask questions in plain English and get answers without building spreadsheets. She'd tried Google Analytics and Shopify's reports but found them overwhelming. AskBiz was the first tool where she could type 'which candles make the most profit per unit?' and get a clear ranked answer." },
      { heading: "The Turnaround", body: "AskBiz's first daily brief flagged that 60% of her SKUs generated less than 5% of total profit. She discontinued the bottom 85 SKUs over 2 months, freeing up storage space and reducing production complexity. She then doubled down on her top 20 products and introduced bundle pricing that AskBiz suggested based on purchase correlation patterns." },
      { heading: "The Growth", body: "Revenue grew 35% in 4 months — not from more traffic, but from better product mix and higher AOV. The bundles AskBiz suggested (pairing Fireside Oak with Cinnamon Bark) became her best seller. She now spends 20 minutes a week reading the daily brief instead of 6 hours in spreadsheets." },
    ],
    publishDate: "2026-05-01",
  },
  {
    slug: "dubai-electronics-multichannel",
    company: "Gulf Electronics Trading",
    logo: "📱",
    industry: "Electronics Wholesale",
    location: "Dubai, UAE",
    employees: "22",
    headline: "How a Dubai electronics trader unified 4 sales channels in one dashboard",
    metaDescription: "Gulf Electronics Trading connected Amazon UAE, Noon, their Shopify store, and B2B orders into AskBiz — reducing reporting time from 3 days to 15 minutes.",
    challenge: "Selling consumer electronics across Amazon UAE, Noon, their own Shopify store, and direct B2B orders meant managing 4 separate dashboards, 4 different fee structures, and manual Excel reconciliation. Monthly reporting took 3 days and was always out of date by the time it was finished.",
    solution: "Connected all 4 channels to AskBiz. Used the unified dashboard for real-time cross-channel visibility, and the AI chat to compare channel profitability after marketplace fees, shipping, and returns.",
    results: [
      { metric: "Monthly reporting time", before: "3 days", after: "15 minutes", improvement: "99% faster" },
      { metric: "Channel profitability visibility", before: "Monthly (delayed)", after: "Real-time", improvement: "Always current" },
      { metric: "Return rate (Amazon)", before: "12%", after: "7%", improvement: "42% reduction" },
      { metric: "Net margin", before: "8%", after: "14%", improvement: "+6 percentage points" },
    ],
    quote: { text: "We thought Amazon was our most profitable channel. AskBiz showed us it was actually the least profitable after fees and returns. That changed our entire strategy.", author: "Khalid M.", role: "Managing Director" },
    timeline: "2 weeks to connect all 4 channels",
    productsUsed: ["AskBiz Chat", "Amazon Integration", "Shopify Integration", "Unified Dashboard", "Channel Analytics"],
    sections: [
      { heading: "The Problem", body: "Each sales channel had its own fee structure, return policy, and reporting format. Amazon UAE charges referral fees (8–15%), FBA fees, and advertising costs. Noon has different commission tiers. The Shopify store has payment processing fees but no marketplace commissions. Comparing true profitability across channels was practically impossible without a unified view." },
      { heading: "Why AskBiz", body: "Khalid needed a single place to ask 'which channel gives me the highest net margin on the Galaxy S24 case?' and get an answer that accounted for all fees, shipping costs, and return rates. AskBiz was the only platform that could connect all 4 of their channels and normalise the data into a single view." },
      { heading: "The Insight", body: "AskBiz revealed that Amazon UAE — their highest-revenue channel — was actually their lowest-margin channel after accounting for the 15% referral fee, FBA costs, and a 12% return rate on electronics accessories. Their Shopify direct store had 3x the net margin despite lower volume." },
      { heading: "The Strategy Shift", body: "They shifted ad spend toward driving traffic to their Shopify store for high-margin products, while keeping commodity products on Amazon where volume mattered more. They also used AskBiz's return analysis to identify products with abnormally high return rates and improved product descriptions to set better expectations. Net margin grew from 8% to 14% in 3 months." },
    ],
    publishDate: "2026-04-08",
  },
  {
    slug: "brighton-bakery-inventory",
    company: "Flour & Foster Bakery",
    logo: "🥐",
    industry: "Food & Beverage",
    location: "Brighton, UK",
    employees: "6",
    headline: "How a bakery reduced food waste by 30% with AI demand forecasting",
    metaDescription: "Flour & Foster Bakery in Brighton used AskBiz's demand forecasting to reduce food waste by 30% and save £800/month on ingredient costs.",
    challenge: "A busy artisan bakery producing 40+ items daily had a persistent waste problem — overproducing on slow days and selling out on busy ones. The head baker estimated production based on gut feel, leading to 15–20% daily waste and frequent sell-outs of popular items by 11am.",
    solution: "Connected their POS sales data to AskBiz and used the forecasting feature to predict daily demand by product. The AI analysed 18 months of sales data against day of week, weather, local events, and school holidays to generate production recommendations each morning.",
    results: [
      { metric: "Daily food waste", before: "15–20%", after: "5–8%", improvement: "30% reduction" },
      { metric: "Sell-out rate (by 11am)", before: "4–5 items daily", after: "< 1 item daily", improvement: "80% fewer sell-outs" },
      { metric: "Monthly ingredient savings", before: "Baseline", after: "£800/month saved", improvement: "New saving" },
      { metric: "Weekend revenue", before: "£2,100", after: "£2,600", improvement: "+24%" },
    ],
    quote: { text: "Saturday mornings used to be chaos. Now I check the AskBiz forecast Friday night and know exactly how many sourdough loaves to proof.", author: "Tom F.", role: "Head Baker & Owner" },
    timeline: "Connected POS in 1 hour, forecasts accurate within 2 weeks",
    productsUsed: ["AskBiz POS", "Demand Forecasting", "Daily Brief", "Inventory Management"],
    sections: [
      { heading: "The Problem", body: "Bakeries face a unique inventory challenge: products are perishable (most items last 1 day), production decisions must be made at 4am for the day ahead, and demand varies dramatically by day, weather, and season. Tom was throwing away £200+ of product every week while simultaneously losing revenue from sell-outs." },
      { heading: "Why AskBiz", body: "Tom needed forecasting that understood the patterns in his own sales data — not generic industry averages. He needed it to account for the fact that rainy Saturdays sell more soup and fewer iced coffees, and that school holidays mean fewer morning pastry sales but more weekend foot traffic. AskBiz's AI learned these patterns from his POS data automatically." },
      { heading: "The Learning Period", body: "The first two weeks were calibration — AskBiz's forecasts were within 15% accuracy. By week 3, they were within 8%. The system learned that Tuesday is consistently the slowest day, that the first sunny Saturday above 18°C triggers a 40% spike in iced drinks, and that half-term weeks shift the demand curve toward weekends." },
      { heading: "The Results", body: "After 3 months, daily waste dropped from 15–20% to 5–8%. Weekend revenue increased 24% because popular items stayed in stock until closing. The £800/month ingredient saving was reinvested into a new product line (artisan sandwiches) that AskBiz's market analysis suggested based on local demand data." },
    ],
    publishDate: "2026-03-28",
  },
  {
    slug: "lagos-fashion-marketplace",
    company: "Adura Lagos",
    logo: "👗",
    industry: "Fashion / Marketplace",
    location: "Lagos, Nigeria",
    employees: "15",
    headline: "How a Nigerian fashion brand grew marketplace sales 60% with data-driven pricing",
    metaDescription: "Adura Lagos used AskBiz to optimise pricing across Jumia and Instagram Shop, growing total sales by 60% and improving margins by 11 percentage points.",
    challenge: "A fast-growing Lagos fashion brand selling through Jumia, Instagram Shop, and their own website had no unified view of sales performance. Pricing was inconsistent across channels, and they had no way to measure which Instagram campaigns actually drove sales. Returns on Jumia were eating into margins with no visibility into why.",
    solution: "Connected Jumia seller portal and payment data to AskBiz. Used the AI chat to analyse pricing gaps, return patterns, and campaign ROI. AskBiz identified that 40% of Jumia returns were due to sizing issues and recommended specific product description changes.",
    results: [
      { metric: "Total monthly sales", before: "₦4.2M", after: "₦6.7M", improvement: "+60%" },
      { metric: "Jumia return rate", before: "28%", after: "14%", improvement: "50% reduction" },
      { metric: "Gross margin", before: "32%", after: "43%", improvement: "+11 pp" },
      { metric: "Campaign ROI tracking", before: "None", after: "Per-campaign attribution", improvement: "Full visibility" },
    ],
    quote: { text: "Before AskBiz, I was guessing which Instagram posts drove sales. Now I know exactly which campaigns pay for themselves and which ones don't.", author: "Chioma A.", role: "CEO & Creative Director" },
    timeline: "Full setup in 5 days",
    productsUsed: ["AskBiz Chat", "Social Commerce Intelligence", "Channel Analytics", "Return Analysis"],
    sections: [
      { heading: "The Problem", body: "African e-commerce brands face unique challenges: marketplace commission rates are high (12–20% on Jumia), payment reconciliation is complex (bank transfers, Paystack, cash on delivery), and return rates for fashion can exceed 25%. Without unified analytics, Chioma couldn't tell if her business was growing profitably or just growing revenue while losing margin." },
      { heading: "Why AskBiz", body: "Chioma needed a tool that understood the Nigerian e-commerce ecosystem — Jumia's fee structure, Paystack reconciliation, and the nuances of cash-on-delivery (where non-delivery rates can hit 15%). AskBiz was the first analytics tool she found that could ingest her Paystack data and Jumia seller reports in a single view." },
      { heading: "The Pricing Fix", body: "AskBiz discovered that identical products were priced 8–15% lower on Jumia than on the website, despite Jumia charging a 15% commission. The AI recommended channel-specific pricing that maintained competitive positioning on Jumia while protecting margins. It also identified that adding a detailed size chart (with measurements in cm, not just S/M/L) reduced return rates by half." },
      { heading: "The Growth", body: "With accurate channel profitability data, Chioma doubled ad spend on campaigns that AskBiz confirmed were profitable and cut three campaigns that showed high engagement but low conversion. The 60% revenue growth came from both pricing corrections and smarter marketing allocation — not from new products or new channels." },
    ],
    publishDate: "2026-05-10",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}

export function getAllCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}
