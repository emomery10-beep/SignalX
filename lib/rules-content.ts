// lib/rules-content.ts
// AskBiz Rules & Policies — all content hardcoded, no database required
// Compliant with: UK GDPR, EU GDPR, EU AI Act, UK Online Safety Act 2023,
// CCPA/CPRA, FTC Act, CAN-SPAM Act, US state breach notification laws
// Last reviewed: April 2026

export interface PolicyArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  lastUpdated: string;
  effectiveDate: string;
  readTime: number;
  legalBasis?: string[]; // applicable laws
  content: PolicySection[];
  related?: string[];
  keywords?: string[];
}

export interface PolicySection {
  heading: string;
  body: string;
}

export interface PolicyCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articles: string[];
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const POLICY_CATEGORIES: PolicyCategory[] = [
  {
    slug: "acceptable-use",
    title: "Acceptable Use",
    description: "What AskBiz may and may not be used for. Prohibited activities, commercial use restrictions, and consequences of misuse.",
    icon: "📋",
    articles: ["acceptable-use-policy", "prohibited-activities", "commercial-use-restrictions"],
  },
  {
    slug: "intellectual-property",
    title: "Intellectual Property",
    description: "Who owns your data, our platform IP, AI-generated outputs, and how we handle copyright claims.",
    icon: "©️",
    articles: ["your-data-ownership", "askbiz-intellectual-property", "ai-generated-content-ownership", "copyright-claims"],
  },
  {
    slug: "ai-policies",
    title: "AI-Specific Policies",
    description: "How AskBiz uses AI, what our AI will and will not do, EU AI Act compliance, and AI transparency obligations.",
    icon: "🤖",
    articles: ["ai-use-policy", "ai-transparency", "ai-act-compliance", "ai-content-restrictions"],
  },
  {
    slug: "platform-integrity",
    title: "Platform Integrity",
    description: "Rules against scraping, API abuse, reverse engineering, automated misuse, and attempts to circumvent platform controls.",
    icon: "🔐",
    articles: ["api-usage-policy", "scraping-and-automation", "platform-abuse"],
  },
  {
    slug: "enforcement",
    title: "Enforcement & Appeals",
    description: "How AskBiz enforces its policies, account suspension and termination, and how to appeal an enforcement decision.",
    icon: "⚖️",
    articles: ["enforcement-actions", "account-suspension", "appeals-process"],
  },
  {
    slug: "law-enforcement",
    title: "Law Enforcement Guidelines",
    description: "How AskBiz responds to legal requests for user data, court orders, data preservation, and government demands.",
    icon: "🏛️",
    articles: ["law-enforcement-requests", "data-preservation-requests", "transparency-reporting"],
  },
  {
    slug: "regulatory-compliance",
    title: "Regulatory Compliance",
    description: "How AskBiz complies with GDPR, UK GDPR, EU AI Act, UK Online Safety Act, CCPA, and FTC regulations — jurisdiction by jurisdiction.",
    icon: "🌍",
    articles: ["gdpr-uk-compliance", "us-regulatory-compliance", "eu-ai-act-compliance-policy", "uk-online-safety-act-compliance"],
  },
];

// ─── ARTICLES ─────────────────────────────────────────────────────────────────

export const POLICY_ARTICLES: PolicyArticle[] = [

  // ── ACCEPTABLE USE ────────────────────────────────────────────────────────
  {
    slug: "acceptable-use-policy",
    title: "Acceptable Use Policy",
    description: "AskBiz's Acceptable Use Policy. What you may use AskBiz for, what is prohibited, and the consequences of violating this policy.",
    category: "Acceptable Use",
    categorySlug: "acceptable-use",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 6,
    legalBasis: ["UK Computer Misuse Act 1990", "EU DSA", "US Computer Fraud and Abuse Act", "FTC Act"],
    keywords: ["askbiz acceptable use policy", "askbiz terms of use", "what can i use askbiz for"],
    content: [
      {
        heading: "Overview",
        body: "This Acceptable Use Policy ('AUP') governs your use of AskBiz and all related services, APIs, and tools. By accessing or using AskBiz, you agree to comply with this policy. This AUP is incorporated into and forms part of AskBiz's Terms of Service.\n\nThis policy applies to all users worldwide, with additional obligations noted for users in the UK, EU, and US where applicable.",
      },
      {
        heading: "Permitted Uses",
        body: "AskBiz is designed for legitimate business intelligence and analytics purposes. Permitted uses include:\n\n- Analysing your own business data (sales, revenue, cash flow, customer metrics)\n- Connecting your own business platform accounts (Shopify, Amazon, QuickBooks, etc.)\n- Using AI-generated insights to inform your own business decisions\n- Using Business Tools (FX Risk, Landed Cost, Export Scoring, etc.) for your own commercial planning\n- Accessing the AskBiz API to build internal tools for your own business\n- Using AskBiz as a business analytics consultant for clients, provided clients' data is handled in accordance with applicable data protection law and you have appropriate authority to process that data",
      },
      {
        heading: "Prohibited Uses",
        body: "You may not use AskBiz to:\n\n**Illegal activities:**\n- Facilitate, plan, or execute any activity that violates applicable law\n- Assist with tax evasion, money laundering, fraud, or deceptive trading\n- Generate false financial data for use in regulated contexts (investor relations, bank applications, insurance claims)\n- Circumvent sanctions, export controls, or trade restrictions\n\n**Harmful activities:**\n- Generate content designed to deceive, mislead, or harm third parties\n- Create false business intelligence reports intended to manipulate investors, partners, or lenders\n- Use AI outputs to make automated decisions about individuals without appropriate human oversight where required by law\n- Stalk, harass, or monitor individuals without their consent using business data analysis\n\n**Platform abuse:**\n- Reverse engineer, decompile, or disassemble AskBiz software\n- Scrape, crawl, or extract data from AskBiz without authorisation\n- Use automated tools to access AskBiz beyond what the published API permits\n- Probe, test, or scan AskBiz systems for vulnerabilities without prior written authorisation\n- Share your account credentials with third parties not authorised under your plan\n\n**Competitive misuse:**\n- Use AskBiz to build a competing product or service\n- Benchmark AskBiz performance for the purpose of publishing competitive intelligence without our consent\n- Access AskBiz under false pretences to extract proprietary methodology or algorithm information",
      },
      {
        heading: "Data You Upload or Connect",
        body: "When you upload data to AskBiz or connect third-party platforms, you represent and warrant that:\n\n- You have the legal right to upload, process, and analyse that data\n- Where the data contains personal information about third parties (your customers, employees, etc.), you have a lawful basis to process it under applicable data protection law\n- You have obtained any necessary consents or met any other legal requirements applicable to your use case\n- The data does not violate any third party's intellectual property, privacy, or other legal rights\n\nAskBiz processes this data as a data processor on your behalf. You remain the data controller and are responsible for your own compliance obligations.",
      },
      {
        heading: "Geographic Restrictions",
        body: "AskBiz is not available to users in jurisdictions subject to UK, EU, or US sanctions programmes, including but not limited to: North Korea, Iran, Cuba, Syria, and Russian-occupied territories of Ukraine. Use of AskBiz in violation of applicable sanctions law is strictly prohibited and may result in immediate account termination and reporting to relevant authorities.",
      },
      {
        heading: "Changes to This Policy",
        body: "We may update this AUP from time to time. Material changes will be notified by email to your account address at least 30 days before taking effect (UK/EU users) or 15 days before taking effect (other users). Continued use of AskBiz after the effective date constitutes acceptance of the updated policy.\n\nFor UK and EU users, we will not make changes that reduce your rights without providing the notice periods required by applicable law.",
      },
    ],
    related: ["prohibited-activities", "enforcement-actions", "appeals-process"],
  },
  {
    slug: "prohibited-activities",
    title: "Prohibited Activities",
    description: "A detailed list of activities that are prohibited on AskBiz, including fraud, deceptive AI use, data misuse, platform abuse, and commercial restrictions.",
    category: "Acceptable Use",
    categorySlug: "acceptable-use",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["Fraud Act 2006 (UK)", "Computer Misuse Act 1990 (UK)", "EU DSA Article 14", "US CFAA", "FTC Act Section 5"],
    keywords: ["askbiz prohibited activities", "what is not allowed askbiz", "askbiz misuse policy"],
    content: [
      {
        heading: "Financial Fraud and Misrepresentation",
        body: "AskBiz must not be used to:\n- Generate false, misleading, or fabricated financial reports, projections, or analyses intended to deceive investors, lenders, auditors, insurers, or regulatory bodies\n- Produce AI-generated content presented as independently verified financial data when it is not\n- Assist with false accounting, fraudulent bookkeeping, or the concealment of financial liabilities\n- Create inflated or deflated business valuations with intent to deceive a counterparty in a transaction\n\nViolations of this category may constitute offences under the Fraud Act 2006 (UK), the Sarbanes-Oxley Act (US), EU financial services directives, and equivalent legislation. We will report credible evidence of financial fraud to the relevant authorities.",
      },
      {
        heading: "Data Protection Violations",
        body: "You must not use AskBiz to:\n- Process personal data without a lawful basis under UK GDPR, EU GDPR, or applicable US state privacy laws\n- Upload personal data relating to individuals who have exercised their right to erasure, restriction, or objection\n- Process special category data (health, biometric, ethnicity, religious or political beliefs, sexual orientation) without explicit consent or another specific lawful basis\n- Transfer personal data to AskBiz in ways that violate your own data protection obligations as a controller\n- Use AskBiz to build profiles of individuals for purposes incompatible with the original collection purpose\n\nAskBiz is a business intelligence tool for business data. It is not designed or licensed for processing large volumes of consumer personal data for profiling or direct marketing purposes.",
      },
      {
        heading: "Intellectual Property Infringement",
        body: "You must not use AskBiz to:\n- Upload or process data that you do not have the legal right to use\n- Reproduce, distribute, or create derivative works from AskBiz's proprietary content, algorithms, or methodology\n- Use AI-generated outputs that incorporate third-party copyrighted material in ways that infringe copyright\n- Circumvent technological protection measures on any connected platform (Shopify, Amazon, etc.)\n\nIf you receive a takedown notice or intellectual property claim, you must cease the infringing activity immediately and notify us at legal@askbiz.co.",
      },
      {
        heading: "Deceptive and Manipulative AI Use",
        body: "You must not use AskBiz's AI to:\n- Generate fake reviews, testimonials, or endorsements\n- Create misleading marketing content that misrepresents product performance, customer satisfaction, or financial results\n- Produce synthetic data designed to game algorithmic systems (e.g. fabricating sales velocity to manipulate a marketplace algorithm)\n- Automate deceptive communications with customers, partners, or regulators\n- Present AI-generated analysis as the output of a human expert without disclosure\n\nThis prohibition aligns with the FTC's guidance on AI-generated endorsements (16 CFR Part 255), the EU AI Act's requirements on transparency in AI interactions (Article 50), and the UK's Consumer Protection from Unfair Trading Regulations 2008.",
      },
      {
        heading: "Sanctions and Export Control Violations",
        body: "AskBiz must not be used to:\n- Conduct business analysis in support of activities that violate UK, EU, or US sanctions\n- Analyse trade routes, suppliers, or markets for the purpose of circumventing export controls on controlled goods or technologies\n- Generate export market analysis for end-users in sanctioned jurisdictions\n- Use the Landed Cost Calculator or Export Market Scoring tool in connection with prohibited exports\n\nWhere we have reasonable grounds to believe AskBiz is being used in violation of sanctions law, we will suspend the account immediately and report to the Office of Financial Sanctions Implementation (OFSI, UK), the Office of Foreign Assets Control (OFAC, US), or relevant EU authority.",
      },
    ],
    related: ["acceptable-use-policy", "enforcement-actions", "law-enforcement-requests"],
  },
  {
    slug: "commercial-use-restrictions",
    title: "Commercial Use Restrictions",
    description: "Rules for using AskBiz commercially — as a consultant, agency, or platform builder. Resale restrictions, white-labelling policy, and sub-processor obligations.",
    category: "Acceptable Use",
    categorySlug: "acceptable-use",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    keywords: ["askbiz commercial use", "askbiz reseller policy", "askbiz agency use", "white label askbiz"],
    content: [
      {
        heading: "Using AskBiz for Client Work",
        body: "You may use AskBiz to analyse data and generate insights on behalf of your clients (e.g. as a business consultant, accountant, or agency), provided:\n- You have written authorisation from your client to process their data using AskBiz\n- You have informed your client that AskBiz (and its sub-processors, including Anthropic's Claude API) will process their data\n- You have a Data Processing Agreement (DPA) in place with your client that covers AskBiz as a sub-processor\n- The client's data is not commingled with other clients' data in your AskBiz account in ways that could cause cross-contamination of insights\n\nAskBiz's DPA (available from Account Settings → Privacy → Download DPA) covers our obligations as your data processor. You are responsible for your obligations as data controller toward your clients.",
      },
      {
        heading: "What You Cannot Do Commercially",
        body: "Without a separate written agreement with AskBiz, you may not:\n- **Resell AskBiz** — you cannot charge third parties for access to AskBiz as if it were your own product\n- **White-label AskBiz** — you cannot rebrand AskBiz and present it as your own analytics platform\n- **Build a competing service** — you cannot use AskBiz access to reverse-engineer our methodology and build a competing product\n- **Multi-tenant sub-licensing** — you cannot create multiple sub-accounts under your account for different clients without a specific enterprise agreement\n- **API resale** — you cannot expose the AskBiz API to third parties as part of a commercial product without an enterprise API agreement\n\nIf you are interested in any of the above, contact hello@askbiz.co to discuss partnership or enterprise arrangements.",
      },
      {
        heading: "Building Internal Tools with the API",
        body: "You may use the AskBiz API (Business plan) to build internal tools for your own business — for example, embedding your Business Pulse score in your internal dashboard, or triggering AskBiz analysis from your own workflow automation.\n\nThis is permitted provided:\n- The tool is for internal use within your own organisation\n- You do not expose the API key or API endpoints to external parties\n- The tool does not effectively create a multi-tenant AskBiz service for other businesses\n\nFor tools serving 50+ internal users, or any tool that will be used by external parties, contact hello@askbiz.co for an enterprise API assessment.",
      },
    ],
    related: ["acceptable-use-policy", "api-usage-policy", "your-data-ownership"],
  },

  // ── INTELLECTUAL PROPERTY ─────────────────────────────────────────────────
  {
    slug: "your-data-ownership",
    title: "Your Data Ownership",
    description: "You own your business data. How AskBiz handles your data, what licence you grant us to process it, and your rights to export and delete it.",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    legalBasis: ["UK GDPR Article 17", "EU GDPR Article 17", "CCPA Section 1798.105"],
    keywords: ["who owns my data askbiz", "data ownership business intelligence", "export my data askbiz", "delete my data askbiz"],
    content: [
      {
        heading: "You Own Your Data — Full Stop",
        body: "All business data you upload to AskBiz, connect via integrations, or generate through your use of the platform belongs to you. AskBiz makes no claim of ownership over:\n- Your sales data, revenue figures, customer metrics, or financial records\n- Data you upload via CSV or connect via Shopify, Amazon, QuickBooks, or any other integration\n- Your chat conversations and questions\n- Reports, analyses, and outputs generated by AskBiz using your data\n- Any intellectual property you bring to the platform",
      },
      {
        heading: "The Limited Licence You Grant AskBiz",
        body: "To operate the service, you grant AskBiz a limited, non-exclusive, non-transferable licence to:\n- Store, process, and analyse your data to generate your Business Pulse score, Daily Brief, and AI responses\n- Transmit relevant excerpts of your data to Anthropic's Claude API for AI processing (transiently — not retained)\n- Generate anonymised, aggregated usage statistics for product improvement (if you have not opted out)\n\nThis licence is strictly limited to providing the service to you. It does not permit AskBiz to:\n- Sell your data to third parties\n- Use your data to train AI models\n- Share your data with other AskBiz customers\n- Use your data for advertising or marketing purposes",
      },
      {
        heading: "Exporting Your Data",
        body: "You can export your data at any time:\n- **Conversation history** — open any conversation → Export as PDF or copy as text\n- **Business Pulse history** — /intelligence → Export 30-day chart as CSV\n- **Connected source data** — the raw data lives in the source (Shopify, QuickBooks, etc.) and is always accessible there directly\n- **Tool results** — FX Risk, Landed Cost, Supplier Scorecard outputs can be exported as PDF from each tool\n- **Full account data export** — Account Settings → Privacy → Export My Data. This generates a ZIP file containing all your stored data in JSON format, delivered to your account email within 24 hours.\n\nData portability is your right under UK GDPR Article 20 and EU GDPR Article 20. We make it easy to exercise, no form-filling required.",
      },
      {
        heading: "Deleting Your Data",
        body: "You can delete:\n- **Individual conversations** — open conversation → Delete\n- **Connected source data** — /sources → Disconnect. Historical synced data is deleted within 30 days.\n- **Uploaded CSV data** — /sources → CSV → Delete dataset. Deleted immediately.\n- **Your entire account** — Account Settings → Privacy → Delete Account. All data is permanently deleted within 30 days, with the exception of data we are legally required to retain (e.g. billing records for tax purposes — retained for 7 years per UK law, not linked to your business data).\n\nOnce deleted, data cannot be recovered. We do not maintain 'soft delete' backups beyond our standard 30-day backup retention window.",
      },
    ],
    related: ["askbiz-intellectual-property", "gdpr-uk-compliance", "ai-training-policy"],
  },
  {
    slug: "askbiz-intellectual-property",
    title: "AskBiz Intellectual Property",
    description: "What AskBiz owns — our platform, algorithms, brand, and content — and what you may and may not do with it.",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 3,
    legalBasis: ["Copyright, Designs and Patents Act 1988 (UK)", "EU Directive 2019/790", "US Copyright Act"],
    keywords: ["askbiz copyright", "askbiz platform ip", "askbiz brand usage"],
    content: [
      {
        heading: "What AskBiz Owns",
        body: "AskBiz and its licensors own all intellectual property in the platform, including:\n- The AskBiz software, source code, and compiled applications\n- The platform's user interface, design, and visual elements\n- The AskBiz name, logo, and brand assets\n- The Business Pulse scoring methodology and algorithm\n- Export Market Scoring models and weighting frameworks\n- Supplier Scorecard grading methodology\n- Help Center content, documentation, and written materials\n- All AI prompting, instruction, and context engineering underlying the AI responses\n\nThese are protected by copyright, trade mark, database rights, and other intellectual property laws in the UK, EU, and US.",
      },
      {
        heading: "What You May Do",
        body: "You may:\n- Use the platform in accordance with your subscription and this policy\n- Reference AskBiz by name in your own marketing materials (e.g. 'We use AskBiz for business intelligence')\n- Share screenshots of your own AskBiz data for your own business purposes\n- Quote brief extracts from AskBiz Help Center articles with attribution\n- Use the AskBiz logo in accordance with our Brand Guidelines (available at askbiz.co/brand)",
      },
      {
        heading: "What You May Not Do",
        body: "You may not:\n- Copy, reproduce, or distribute AskBiz software or source code\n- Reverse engineer, decompile, or disassemble any part of AskBiz\n- Create derivative works based on AskBiz's methodology without written consent\n- Use the AskBiz name or logo to imply endorsement or affiliation without written consent\n- Reproduce substantial portions of AskBiz Help Center or policy content without attribution and a link to the original\n- Use AskBiz brand assets in a way that is misleading, defamatory, or harmful to AskBiz's reputation",
      },
    ],
    related: ["your-data-ownership", "ai-generated-content-ownership", "copyright-claims"],
  },
  {
    slug: "ai-generated-content-ownership",
    title: "AI-Generated Content Ownership",
    description: "Who owns the analysis, reports, and outputs that AskBiz AI generates from your data. How copyright law applies to AI outputs in the UK, EU, and US.",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["CDPA 1988 s9(3) (UK)", "EU AI Act Article 50", "US Copyright Office AI guidance 2024"],
    keywords: ["who owns ai generated content", "ai output copyright", "askbiz ai analysis ownership", "copyright ai business reports"],
    content: [
      {
        heading: "The Core Principle",
        body: "When AskBiz AI analyses your data and generates a report, insight, or recommendation, that output is yours to use for your business purposes. We do not claim ownership of AI-generated outputs created from your data.",
      },
      {
        heading: "The Legal Complexity",
        body: "The ownership of AI-generated content is a genuinely unsettled area of law that varies by jurisdiction:\n\n**UK:** Under the Copyright, Designs and Patents Act 1988, Section 9(3), computer-generated works have copyright protection, and that copyright vests in 'the person by whom the arrangements necessary for the creation of the work are undertaken.' For AskBiz outputs, this is most plausibly you (the user who commissioned the analysis) and/or AskBiz. In practice, we waive any claim to copyright in outputs generated from your data.\n\n**EU:** EU copyright law generally requires human authorship for copyright protection. AI-generated content without sufficient human creative input may not be protected by copyright under the InfoSoc Directive. This means some AskBiz outputs may not qualify for copyright protection in the EU — they exist in a legally uncertain space.\n\n**US:** The US Copyright Office has issued guidance (2024) that AI-generated content without human authorship is not eligible for copyright registration. Content where a human has made sufficient creative choices in how the AI was prompted and directed may be eligible. Individual assessments apply.\n\n**Practical implication:** For most business purposes — using AI-generated reports internally, sharing with advisors, including in business plans — these legal nuances do not matter. If you are using AI-generated content in a context where copyright ownership is commercially significant (e.g. a published report you are selling), seek independent legal advice.",
      },
      {
        heading: "AskBiz's Commitment to You",
        body: "Regardless of the legal complexity:\n- We will not assert copyright ownership over AI outputs generated from your data\n- We will not use your AI outputs to train models or create competing content\n- You have our full permission to use, reproduce, publish, and commercialise AI-generated outputs created within your AskBiz account\n- This permission survives termination of your subscription",
      },
      {
        heading: "Disclosing AI-Generated Content",
        body: "While you own the outputs, you have obligations around disclosure depending on how you use them:\n\n**UK/EU:** The EU AI Act (Article 50) requires disclosure when AI is used to generate content that could influence people's decisions. The UK follows a similar approach under FCA guidance for financial communications. If you share AI-generated financial analysis with investors, lenders, or in regulated contexts, label it as AI-assisted.\n\n**US:** The FTC requires truthful and non-deceptive practices. Presenting AI-generated projections as independently verified analyst forecasts could violate FTC Act Section 5.\n\n**General best practice:** Label AI-generated reports as 'AI-generated analysis from AskBiz' when sharing externally. This protects you legally and builds trust with recipients.",
      },
    ],
    related: ["your-data-ownership", "ai-transparency", "responsible-ai-use"],
  },
  {
    slug: "copyright-claims",
    title: "Copyright Claims",
    description: "How to submit a copyright infringement claim to AskBiz. DMCA takedown procedure, UK copyright complaint process, counter-notices, and repeat infringer policy.",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    legalBasis: ["DMCA 17 USC 512 (US)", "CDPA 1988 (UK)", "EU Directive 2019/790 Article 17"],
    keywords: ["dmca takedown askbiz", "copyright claim askbiz", "report copyright infringement", "askbiz ip claim"],
    content: [
      {
        heading: "Reporting Copyright Infringement",
        body: "If you believe AskBiz content (including Help Center articles, blog posts, or platform content) infringes your copyright, you can submit a notice to legal@askbiz.co.\n\nYour notice must include:\n1. **Your contact information** — name, address, email, and phone number\n2. **Identification of the work** — describe the copyrighted work you claim has been infringed\n3. **Location of the infringing content** — the specific URL(s) on askbiz.co where the infringing content appears\n4. **A statement of good faith** — 'I have a good faith belief that the use of the material in the manner complained of is not authorised by the copyright owner, its agent, or the law'\n5. **A statement of accuracy** — 'The information in this notification is accurate, and I am the copyright owner, or authorised to act on behalf of the copyright owner'\n6. **Your signature** — electronic signature is acceptable",
      },
      {
        heading: "US DMCA Procedure",
        body: "For US rights holders, AskBiz complies with the Digital Millennium Copyright Act (17 U.S.C. § 512). Notices should be addressed to our designated DMCA agent:\n\n**DMCA Agent:** Legal Team, AskBiz\n**Email:** legal@askbiz.co\n**Subject line:** DMCA Takedown Notice\n\nUpon receipt of a valid DMCA notice, we will:\n- Acknowledge receipt within 2 business days\n- Remove or disable access to the allegedly infringing material within 5 business days\n- Notify the user who uploaded the content (where applicable)\n- Provide information about the counter-notice process",
      },
      {
        heading: "Counter-Notice Process",
        body: "If your content was removed following a DMCA notice and you believe the removal was in error or based on misidentification, you may submit a counter-notice to legal@askbiz.co.\n\nA valid counter-notice must include:\n1. Your contact information\n2. Identification of the removed content and its former location\n3. A statement under penalty of perjury that you have a good faith belief the content was removed by mistake or misidentification\n4. Your consent to jurisdiction in the US federal district court for your location\n5. Your signature\n\nUpon receipt of a valid counter-notice, we will notify the original complainant. If the complainant does not file a court action within 10-14 business days, we may restore the content.",
      },
      {
        heading: "UK and EU Copyright Complaints",
        body: "For rights holders in the UK and EU, AskBiz handles copyright complaints under the Copyright, Designs and Patents Act 1988 (UK) and Directive 2019/790 (EU).\n\nSubmit your complaint to legal@askbiz.co with the same information listed above. We will respond within 5 business days and, where the complaint is valid, remove the infringing content promptly.\n\nFor urgent matters involving commercial-scale infringement, contact legal@askbiz.co with the subject line 'Urgent Copyright — Commercial Scale'.",
      },
      {
        heading: "Repeat Infringer Policy",
        body: "AskBiz will terminate the accounts of users who are found to be repeat copyright infringers. A 'repeat infringer' is a user who has had more than two valid copyright notices filed against content they uploaded or generated within a 12-month period.\n\nWe implement this policy in compliance with DMCA Section 512(i) and equivalent EU and UK requirements.",
      },
    ],
    related: ["askbiz-intellectual-property", "enforcement-actions", "appeals-process"],
  },

  // ── AI POLICIES ───────────────────────────────────────────────────────────
  {
    slug: "ai-use-policy",
    title: "AI Use Policy",
    description: "How AskBiz uses AI to generate insights, which AI provider we use, what data is sent to AI systems, and how we control AI outputs.",
    category: "AI-Specific Policies",
    categorySlug: "ai-policies",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["EU AI Act 2024", "UK AI Strategy", "FTC AI Guidance 2023", "ICO Guidance on AI 2024"],
    keywords: ["askbiz ai policy", "how askbiz uses ai", "anthropic claude askbiz", "ai business intelligence policy"],
    content: [
      {
        heading: "The AI System AskBiz Uses",
        body: "AskBiz uses **Claude by Anthropic** as its AI reasoning engine. Claude is a large language model (LLM) developed by Anthropic PBC, incorporated in San Francisco, California.\n\nWhen you ask a question in AskBiz, the following happens:\n1. AskBiz retrieves relevant data from your connected sources\n2. That data, along with your question, is formatted into a prompt\n3. The prompt is sent to Anthropic's Claude API via an encrypted HTTPS connection\n4. Claude generates a response, which is returned to AskBiz\n5. AskBiz presents the response in the interface\n\nThe data transmitted to Anthropic is transient — it is processed to generate your response and not retained by Anthropic beyond the duration of the API call. Anthropic's API terms prohibit using API requests to train models.",
      },
      {
        heading: "What Data Is Sent to the AI",
        body: "The following data may be included in prompts sent to Anthropic's Claude API:\n- Relevant excerpts of your business data (sales figures, product names, revenue metrics) necessary to answer your question\n- The text of your question\n- Contextual information about your business type, sector, and settings (e.g. home currency, connected platforms)\n\nThe following is **never** sent to Anthropic:\n- Full datasets from your connected sources (only relevant excerpts)\n- Customer personal data (email addresses, names) — these are hashed in our system before any processing\n- Your payment details or billing information\n- Credentials or OAuth tokens for connected platforms\n- Other users' data",
      },
      {
        heading: "AI Risk Classification",
        body: "Under the EU AI Act (Regulation 2024/1689), AI systems are classified by risk level. AskBiz is classified as a **limited-risk AI system** (not high-risk) because:\n- It provides analysis and recommendations to support human business decisions\n- It does not make autonomous decisions about individuals with significant legal or economic effects\n- It does not operate in high-risk sectors listed in Annex III (critical infrastructure, employment decisions, access to essential services, law enforcement, etc.)\n- Human review and override is always possible and expected\n\nAskBiz complies with the transparency obligations applicable to limited-risk AI systems under Article 50 of the EU AI Act.",
      },
      {
        heading: "AI Output Accuracy and Liability",
        body: "AI outputs are generated probabilistically and may contain errors. AskBiz:\n- Displays confidence indicators on all AI-generated responses\n- Encourages users to verify important figures against source data\n- Does not guarantee the accuracy of AI-generated analysis\n- Is not liable for business decisions made solely in reliance on AI-generated outputs without independent verification\n\nThis does not limit your statutory rights under UK or EU consumer protection law where applicable. AskBiz's liability limitations are set out in the Terms of Service.",
      },
    ],
    related: ["ai-transparency", "ai-act-compliance", "responsible-ai-use"],
  },
  {
    slug: "ai-transparency",
    title: "AI Transparency",
    description: "How AskBiz discloses AI involvement in outputs, confidence indicators, how to identify AI-generated content, and your right to human review.",
    category: "AI-Specific Policies",
    categorySlug: "ai-policies",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    legalBasis: ["EU AI Act Article 50", "UK ICO Guidance on Explaining AI Decisions", "FTC AI Disclosure Guidance"],
    keywords: ["ai transparency askbiz", "ai disclosure policy", "how to know if content is ai generated", "ai confidence indicators"],
    content: [
      {
        heading: "We Always Disclose AI Involvement",
        body: "AskBiz is an AI-powered platform. Every analysis, recommendation, and insight in the chat interface (/ask) is generated by AI. We do not disguise AI outputs as human-generated content.\n\nSpecifically:\n- The AskBiz interface clearly identifies all chat responses as AI-generated\n- The Daily Brief is labelled as AI-generated\n- Anomaly alerts are identified as AI-detected\n- Business Pulse score methodology is documented and explained\n- No content is presented as coming from a human analyst when it comes from AI",
      },
      {
        heading: "Confidence Indicators",
        body: "Every AI response includes a confidence indicator reflecting how certain the AI is based on data completeness and recency:\n\n- **🟢 High** — Complete, recent, directly connected data. Generally reliable.\n- **🟡 Medium** — Partial data or data older than 30 days. Directionally useful, verify key figures.\n- **🔴 Low** — Limited data. Treat as a starting point, not a conclusion.\n- **〜 Estimate** — No directly relevant data. Based on sector benchmarks or inference. Label clearly if sharing externally.\n\nThis graduated transparency system reflects the ICO's guidance on explaining AI decisions and the EU AI Act's transparency requirements.",
      },
      {
        heading: "Your Right to Human Review",
        body: "Under UK GDPR Article 22 and EU GDPR Article 22, you have the right not to be subject to a decision based solely on automated processing where that decision produces legal or similarly significant effects.\n\nAskBiz is designed as a decision-support tool — not a decision-making system. AskBiz AI:\n- Makes recommendations, not final decisions\n- Always requires human review and sign-off before any action is taken\n- Does not automate any consequential actions on your behalf (it cannot place orders, move money, or communicate with third parties)\n\nIf you use the AskBiz API to trigger automated workflows based on AI outputs, you are responsible for ensuring appropriate human oversight is in place where required by applicable law.",
      },
      {
        heading: "Explaining AI Decisions",
        body: "You can always ask AskBiz to explain how it reached a conclusion:\n- 'How did you calculate that figure?'\n- 'What data are you basing this on?'\n- 'What assumptions did you make?'\n- 'How confident are you in this analysis?'\n\nThese meta-questions are always answered honestly. If the AI used benchmarks or inference rather than your actual data, it will say so.",
      },
    ],
    related: ["ai-use-policy", "ai-act-compliance", "how-answers-work"],
  },
  {
    slug: "ai-act-compliance",
    title: "EU AI Act Compliance",
    description: "How AskBiz complies with the EU Artificial Intelligence Act (Regulation 2024/1689). Risk classification, transparency obligations, prohibited practices, and user rights.",
    category: "AI-Specific Policies",
    categorySlug: "ai-policies",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 6,
    legalBasis: ["EU AI Act Regulation 2024/1689"],
    keywords: ["eu ai act compliance", "ai act saas", "askbiz eu ai act", "ai regulation compliance business"],
    content: [
      {
        heading: "Overview of the EU AI Act",
        body: "The EU Artificial Intelligence Act (Regulation 2024/1689, 'AI Act') entered into force on 1 August 2024, with provisions applying in phases through 2026. It applies to AI systems placed on the market or put into service in the EU, regardless of where the provider is established.\n\nAs AskBiz serves EU-based users, we are subject to the AI Act. This page sets out our compliance approach.",
      },
      {
        heading: "AskBiz's Risk Classification",
        body: "The AI Act classifies AI systems into four risk tiers: unacceptable risk (banned), high risk (strict requirements), limited risk (transparency obligations), and minimal risk.\n\n**AskBiz is classified as limited risk.** Specifically:\n- AskBiz does not fall within the banned practices listed in Article 5 (social scoring, subliminal manipulation, exploitation of vulnerabilities, real-time biometric surveillance)\n- AskBiz is not a high-risk AI system under Annex III (it is not used in critical infrastructure, education admissions, employment decisions, essential services access, law enforcement, migration, justice, or democratic processes)\n- AskBiz is a general-purpose business analytics tool used to support human commercial decision-making\n\nThis classification is reviewed annually and whenever we introduce significant new AI functionality.",
      },
      {
        heading: "Our Transparency Obligations (Article 50)",
        body: "As a limited-risk AI system provider, AskBiz complies with Article 50 transparency obligations:\n\n**AI interaction disclosure:** AskBiz clearly identifies all AI-generated responses. Users are never misled into thinking they are interacting with a human.\n\n**AI-generated content labelling:** Business Pulse scores, Daily Briefs, anomaly alerts, and chat responses are all identified as AI-generated within the interface.\n\n**Synthetic content detection:** AskBiz does not generate synthetic media (deepfakes, AI-generated images or audio). Where AI is used to generate text, it is labelled.\n\n**No emotional inference:** AskBiz does not use AI to infer users' emotional states from biometric data.",
      },
      {
        heading: "General-Purpose AI (GPAI) Model Obligations",
        body: "AskBiz uses Claude by Anthropic — a general-purpose AI model subject to the GPAI provisions of the AI Act (Chapter V). Our compliance approach:\n\n- We use Claude via Anthropic's API. Anthropic, as the GPAI model provider, bears primary obligations under Article 53 for systemic-risk models.\n- AskBiz, as a deployer under Article 26, maintains a post-market monitoring system, provides transparency to users, and cooperates with Anthropic on compliance.\n- We have contractual commitments from Anthropic confirming their AI Act compliance obligations.\n- We conduct annual reviews of our AI system deployment against updated EU guidance.",
      },
      {
        heading: "Prohibited AI Practices — Our Commitments",
        body: "AskBiz will never use AI for the following practices prohibited by Article 5:\n- Subliminal manipulation techniques that impair rational decision-making\n- Exploitation of vulnerabilities based on age, disability, or social/economic situation\n- Social scoring systems that classify people based on social behaviour or personal characteristics\n- Real-time remote biometric identification in publicly accessible spaces\n- Emotion recognition systems in workplace or educational settings\n- Predictive policing or pre-crime assessment\n- Scraping biometric data from the internet or CCTV\n\nThese prohibitions apply regardless of what any user requests.",
      },
      {
        heading: "User Rights Under the AI Act",
        body: "As an EU user of AskBiz, you have the following rights related to AI:\n- **Right to explanation** — you can ask AskBiz to explain any AI-generated output and the data it was based on\n- **Right to contest** — for any AI output that affects a decision of significance to you, you can flag it for review via the thumbs-down feedback mechanism or by emailing support@askbiz.co\n- **Right to human review** — for any AI-assisted decision that may have legal or similarly significant effects, you can request that a human review the analysis. Contact support@askbiz.co.\n- **Right not to be subject to solely automated decisions** with significant legal effects (Article 22 GDPR, reinforced by the AI Act) — AskBiz is designed to support human decisions, not replace them",
      },
    ],
    related: ["ai-use-policy", "ai-transparency", "gdpr-uk-compliance"],
  },
  {
    slug: "ai-content-restrictions",
    title: "AI Content Restrictions",
    description: "What AskBiz AI will and will not generate. Hard limits, content the AI will decline, and how to report an AI response that violated these restrictions.",
    category: "AI-Specific Policies",
    categorySlug: "ai-policies",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    keywords: ["askbiz ai restrictions", "what askbiz ai wont do", "ai content policy", "ai refusal policy"],
    content: [
      {
        heading: "Hard Limits — What the AI Will Never Generate",
        body: "Regardless of how a request is framed, AskBiz AI will never generate:\n- Content that facilitates, assists with, or encourages illegal activity\n- False or fabricated financial data intended to deceive any third party\n- Content that assists with fraud, money laundering, or tax evasion\n- Advice on circumventing legal or regulatory requirements\n- Content that violates sanctions or export control law\n- Defamatory, harassing, or discriminatory content about individuals or groups\n- Content that exploits, harms, or endangers minors in any way\n- Detailed instructions for harmful, dangerous, or illegal activities\n\nThese limits are implemented at both the system level (via Anthropic's Claude model safeguards) and at the AskBiz application level.",
      },
      {
        heading: "Business-Scope Restrictions",
        body: "AskBiz AI is scoped for business intelligence. It will decline requests that fall outside this purpose:\n- Personal advice unrelated to business (medical, legal, relationship advice)\n- Content creation unrelated to business analysis (creative writing, general-purpose text generation)\n- Political commentary or advocacy\n- Requests to roleplay as a different AI system or remove its guidelines\n- Requests to generate content in bulk for SEO manipulation or content farming\n\nIf you have a legitimate business need that the AI is declining, contact support@askbiz.co. We review refusal patterns and adjust where appropriate.",
      },
      {
        heading: "How Restrictions Are Enforced",
        body: "Content restrictions are enforced at two levels:\n\n**Model level:** Anthropic's Claude model has built-in safety guidelines that cannot be overridden by AskBiz or by users. These represent Anthropic's responsible AI commitments.\n\n**Application level:** AskBiz applies additional restrictions appropriate to a business analytics context. These are implemented via system prompts and output filtering.\n\nNeither level is infallible. If you encounter an output that appears to violate these restrictions, use the thumbs-down feedback mechanism immediately and email security@askbiz.co with the conversation context.",
      },
      {
        heading: "What to Do When the AI Declines a Legitimate Request",
        body: "If the AI declines a request you believe is legitimate:\n1. **Rephrase the question** — sometimes the framing triggers a refusal. Try asking more specifically or providing more context.\n2. **Check the scope** — AskBiz AI is focused on business analytics. If your request is outside this scope, it may be declined by design.\n3. **Contact support** — email support@askbiz.co with the context. We review refusal logs and will help where the refusal was incorrect.\n\nWe log all refusals (not the content of your request, just the fact of refusal and general category) to improve the system over time.",
      },
    ],
    related: ["ai-use-policy", "responsible-ai-use", "reporting-a-concern"],
  },

  // ── PLATFORM INTEGRITY ────────────────────────────────────────────────────
  {
    slug: "api-usage-policy",
    title: "API Usage Policy",
    description: "Rules for using the AskBiz API. Permitted uses, prohibited API behaviours, rate limits, key management obligations, and consequences of API abuse.",
    category: "Platform Integrity",
    categorySlug: "platform-integrity",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["Computer Misuse Act 1990 (UK)", "EU DSA Article 23", "US CFAA"],
    keywords: ["askbiz api policy", "api terms of use", "api abuse policy", "askbiz developer rules"],
    content: [
      {
        heading: "API Access Requirements",
        body: "Access to the AskBiz API requires:\n- An active Business plan subscription\n- A valid API key generated from Account Settings → Developer → API Keys\n- Acceptance of this API Usage Policy and the general Acceptable Use Policy\n- Compliance with applicable law in your jurisdiction\n\nAPI access is a privilege, not a right. AskBiz may modify, restrict, or revoke API access at any time with reasonable notice, except where immediate action is required to prevent harm or policy violations.",
      },
      {
        heading: "Permitted API Uses",
        body: "The API may be used to:\n- Integrate AskBiz data into your own internal business tools and dashboards\n- Trigger AskBiz analysis from your own workflow automation (e.g. when a Shopify order threshold is hit)\n- Push data from custom sources not covered by native connectors\n- Retrieve Business Pulse scores, alerts, and Daily Brief content programmatically\n- Build internal tools for your own organisation's use (up to 50 internal users without an enterprise agreement)",
      },
      {
        heading: "Prohibited API Uses",
        body: "You must not use the API to:\n- Build a competing business intelligence product or service\n- Resell API access to third parties\n- Circumvent subscription plan limits (e.g. using the API to get unlimited questions on a Free plan)\n- Send automated requests designed to exhaust rate limits or degrade service for other users\n- Probe, test, or scan AskBiz systems for security vulnerabilities\n- Access or attempt to access data belonging to other AskBiz users\n- Scrape or extract AskBiz's proprietary content, algorithms, or methodology\n- Use the POST /ask endpoint to generate bulk content for marketing, SEO, or automated publishing",
      },
      {
        heading: "API Key Obligations",
        body: "API keys must be treated as credentials:\n- Store keys in environment variables or secrets managers — never in source code or public repositories\n- Use one key per integration — makes it easy to revoke individual integrations\n- Rotate keys every 90 days\n- Revoke keys immediately when integrations are decommissioned or team members leave\n- Monitor usage for anomalies — Account Settings → Developer → API Usage\n\nYou are responsible for all activity that occurs using your API key. If a key is compromised, revoke it immediately and contact security@askbiz.co.",
      },
      {
        heading: "Rate Limits and Fair Use",
        body: "Rate limits are in place to ensure fair access for all users. Deliberately attempting to circumvent rate limits — for example, by rotating API keys, distributing requests across multiple accounts, or using exponential request bursts to exploit rate limit reset windows — is a violation of this policy and may result in account termination.\n\nIf your legitimate use case requires higher limits, contact hello@askbiz.co for an enterprise assessment. We do not accommodate limit increases for use cases that violate this policy.",
      },
    ],
    related: ["scraping-and-automation", "platform-abuse", "rate-limits"],
  },
  {
    slug: "scraping-and-automation",
    title: "Scraping & Automation Policy",
    description: "AskBiz's policy on web scraping, automated access, bots, and crawling. What is permitted, what is prohibited, and the legal framework.",
    category: "Platform Integrity",
    categorySlug: "platform-integrity",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    legalBasis: ["Computer Misuse Act 1990 (UK)", "EU Database Directive 96/9/EC", "US CFAA", "hiQ Labs v. LinkedIn (9th Cir. 2022)"],
    keywords: ["askbiz scraping policy", "web scraping terms", "automated access policy", "bot policy askbiz"],
    content: [
      {
        heading: "General Rule",
        body: "Automated access to AskBiz — other than through the published API — is prohibited without prior written consent from AskBiz.\n\nThis includes: web scraping, crawling, spidering, screen-scraping, data extraction tools, headless browser automation (Puppeteer, Playwright, Selenium), and any other automated means of accessing the AskBiz web interface.",
      },
      {
        heading: "Why This Matters",
        body: "AskBiz invests significant resources in developing its platform, algorithms, and content. Unauthorised automated access:\n- Places disproportionate load on our infrastructure, degrading service for legitimate users\n- May extract proprietary methodology and content in violation of our intellectual property rights\n- Can constitute unlawful access under the Computer Misuse Act 1990 (UK) and the Computer Fraud and Abuse Act (US)\n- May infringe database rights under EU law (Database Directive 96/9/EC)\n\nWe actively monitor for automated access patterns and will take enforcement action, including legal proceedings, against significant violations.",
      },
      {
        heading: "Permitted Automated Access",
        body: "The following automated access is permitted:\n- **Published API** — automated access via the AskBiz API with a valid API key and within rate limits\n- **Standard browser automation for accessibility** — screen readers, accessibility tools, and similar assistive technology\n- **Search engine crawling** — standard web crawlers from major search engines (Googlebot, Bingbot) are welcome to crawl our public pages (Help Center, blog, marketing pages). We maintain a robots.txt file.\n- **Authorised integrations** — integrations explicitly built and published by AskBiz (e.g. Zapier, Make) that access AskBiz within the bounds of the published API",
      },
      {
        heading: "Requesting Crawling or Research Access",
        body: "Academic researchers or organisations with a legitimate reason for automated access may request permission by emailing legal@askbiz.co with:\n- Your name and institutional affiliation\n- The purpose of the automated access\n- The specific data or content you need access to\n- How you plan to store and use the data\n- The duration of access required\n\nWe assess requests on a case-by-case basis. We do not grant commercial scraping access.",
      },
    ],
    related: ["api-usage-policy", "platform-abuse", "askbiz-intellectual-property"],
  },
  {
    slug: "platform-abuse",
    title: "Platform Abuse Policy",
    description: "What constitutes platform abuse on AskBiz. Account sharing, credential stuffing, circumventing access controls, and attempts to degrade service for other users.",
    category: "Platform Integrity",
    categorySlug: "platform-integrity",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 4,
    legalBasis: ["Computer Misuse Act 1990 (UK)", "EU NIS2 Directive", "US CFAA 18 USC 1030"],
    keywords: ["platform abuse policy", "account sharing policy", "credential stuffing", "askbiz abuse"],
    content: [
      {
        heading: "Prohibited Platform Behaviours",
        body: "The following behaviours constitute platform abuse and are strictly prohibited:\n\n**Unauthorised access:**\n- Attempting to access another user's account without their authorisation\n- Using stolen, guessed, or brute-forced credentials\n- Exploiting session vulnerabilities to access other accounts\n- Credential stuffing — using lists of email/password combinations from other data breaches to attempt AskBiz logins\n\n**Service disruption:**\n- Denial-of-service attacks or any attempt to degrade AskBiz's service\n- Sending excessive requests designed to exhaust API rate limits for other users\n- Injecting malicious code, scripts, or content into the platform\n- Attempting to disrupt authentication, session management, or data integrity\n\n**Circumventing controls:**\n- Creating multiple accounts to circumvent Free plan question limits\n- Using VPNs or proxies to circumvent geographic restrictions or sanctions compliance\n- Sharing subscription access with non-authorised users to avoid purchasing additional seats\n- Manipulating the platform to obtain outputs that would otherwise be declined",
      },
      {
        heading: "Account Sharing Policy",
        body: "AskBiz subscriptions are per-user (individual accounts) or per-organisation (Business plan with defined team seats). Account sharing — multiple people using the same login credentials — is not permitted beyond the seats included in your plan.\n\nIf you need multiple team members to access AskBiz, upgrade to the Business plan which includes up to 5 team members, each with their own secure login. Additional seats can be added at a per-seat rate.\n\nWe detect shared account usage through login pattern analysis (simultaneous sessions from different locations, device fingerprinting, etc.) and may restrict or terminate accounts found to be in systematic violation.",
      },
      {
        heading: "Reporting Abuse",
        body: "If you discover or suspect platform abuse — including a security vulnerability that could enable abuse — report it immediately to security@askbiz.co. We investigate all reports and act swiftly on confirmed abuse.\n\nSee our Responsible Disclosure Policy for information on how to report security vulnerabilities safely.",
      },
    ],
    related: ["api-usage-policy", "enforcement-actions", "account-security-guide"],
  },

  // ── ENFORCEMENT ───────────────────────────────────────────────────────────
  {
    slug: "enforcement-actions",
    title: "Enforcement Actions",
    description: "How AskBiz enforces its policies. The range of enforcement actions available, how decisions are made, proportionality principles, and what triggers immediate action.",
    category: "Enforcement & Appeals",
    categorySlug: "enforcement",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["EU DSA Article 17", "UK Online Safety Act 2023", "FTC Act"],
    keywords: ["askbiz enforcement policy", "account suspension askbiz", "policy violation askbiz", "askbiz account terminated"],
    content: [
      {
        heading: "Our Enforcement Principles",
        body: "AskBiz enforces its policies with the following principles:\n\n- **Proportionality** — the severity of the enforcement action matches the severity of the violation\n- **Consistency** — similar violations receive similar treatment, regardless of who committed them\n- **Transparency** — we tell you what policy was violated and what action we are taking\n- **Due process** — except in cases requiring immediate action, we notify you before taking action and give you an opportunity to respond\n- **Appealability** — all enforcement decisions can be appealed through our formal process",
      },
      {
        heading: "Range of Enforcement Actions",
        body: "In increasing order of severity:\n\n**Warning:** A formal notification that a policy has been violated. No immediate restriction on account access. A second violation of the same policy may escalate to a higher action.\n\n**Feature restriction:** Access to specific features is restricted (e.g. API access suspended while investigation is ongoing, or AI chat disabled for an account found to be generating fraudulent content).\n\n**Account suspension:** Temporary suspension of all account access. Duration depends on the violation — from 24 hours for minor violations to 90 days for serious ones. Data is preserved during suspension.\n\n**Account termination:** Permanent closure of the account. Applied for serious or repeated violations. Data is deleted per our retention policy after 30 days.\n\n**Legal referral:** For violations that may constitute criminal offences (fraud, unauthorised computer access, sanctions breaches), we may refer to law enforcement or regulatory authorities.",
      },
      {
        heading: "What Triggers Immediate Action",
        body: "The following violations may result in immediate account suspension without prior notice:\n\n- Active security attack or attempted unauthorised access to other accounts\n- Confirmed fraudulent financial data generation with evidence of intent to deceive a regulated party\n- Sanctions breach — use of AskBiz by or on behalf of a sanctioned entity\n- Active API abuse causing service degradation for other users\n- Confirmed child safety violation\n- Receipt of a valid court order requiring immediate account restriction\n\nIn all other cases, we will notify you and provide an opportunity to respond before taking action.",
      },
      {
        heading: "How Enforcement Decisions Are Made",
        body: "Enforcement decisions are made by trained staff members following documented internal procedures. We do not rely solely on automated systems for enforcement decisions that restrict or terminate access.\n\nFor complex or borderline cases, a second senior staff member reviews the decision before it is implemented. All enforcement decisions are logged and subject to internal audit.\n\nFor users in the EU, our enforcement procedures are designed to comply with the procedural requirements of the EU Digital Services Act (DSA) Article 17.",
      },
    ],
    related: ["account-suspension", "appeals-process", "prohibited-activities"],
  },
  {
    slug: "account-suspension",
    title: "Account Suspension & Termination",
    description: "How AskBiz handles account suspension and termination. What happens to your data, your subscription, your connected integrations, and how to request reinstatement.",
    category: "Enforcement & Appeals",
    categorySlug: "enforcement",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["EU DSA Article 17", "UK Consumer Rights Act 2015", "FTC Act"],
    keywords: ["askbiz account suspended", "account terminated askbiz", "reinstate askbiz account", "what happens when account suspended"],
    content: [
      {
        heading: "Suspension vs Termination",
        body: "**Suspension** is temporary. Your account is locked but your data is preserved. You will receive:\n- A notification email explaining the reason for suspension\n- The duration of the suspension (where applicable)\n- Steps you can take to address the violation\n- Information on how to appeal\n\n**Termination** is permanent. Your account is closed, your subscription is cancelled, and your data is scheduled for deletion. Termination is applied only for serious or repeated violations, or where required by law.",
      },
      {
        heading: "What Happens to Your Data",
        body: "**During suspension:** Your data is preserved. You cannot access it during the suspension period, but it will be restored when suspension ends (unless you are informed otherwise).\n\n**Upon termination:** Your data enters a 30-day grace period during which you can appeal and request data export. After 30 days, all data is permanently deleted per our standard deletion process. Billing records are retained for 7 years for legal compliance.\n\n**Data export during suspension:** If you wish to export your data while suspended, contact support@askbiz.co. We will provide a data export within 5 business days. You have a legal right to your data under UK GDPR Article 20 and EU GDPR Article 20, which we honour even for suspended accounts.",
      },
      {
        heading: "What Happens to Your Subscription",
        body: "**During suspension:** Your subscription continues to run. You will not be charged extra, but you also will not receive a pro-rata refund for the suspension period unless the suspension was caused by an AskBiz error.\n\n**Upon termination for cause:** Your subscription is cancelled immediately. No refund is issued for the current billing period. Refunds for prepaid annual subscriptions are assessed on a case-by-case basis depending on the nature of the violation.\n\n**Upon termination without cause** (AskBiz closes your account for commercial reasons not related to your conduct): You receive a pro-rata refund for the unused portion of your subscription and 30 days' notice.",
      },
      {
        heading: "Connected Integrations",
        body: "When an account is suspended or terminated:\n- OAuth tokens for connected platforms (Shopify, Amazon, etc.) are invalidated\n- API keys are revoked\n- Webhooks stop firing\n- Scheduled syncs cease\n\nThis does not affect your accounts on those platforms — only AskBiz's access to them. You will need to reconnect integrations if your account is reinstated.",
      },
      {
        heading: "Requesting Reinstatement",
        body: "If you believe your suspension or termination was in error, follow the Appeals Process.\n\nIf your suspension was for cause and you have addressed the underlying issue, you may request reinstatement after the suspension period by emailing support@askbiz.co with:\n- Your account email\n- A description of the steps you have taken to ensure the violation will not recur\n- Any relevant context\n\nReinstatement after a first-time suspension for a non-serious violation is generally granted. Reinstatement after termination is at AskBiz's sole discretion.",
      },
    ],
    related: ["enforcement-actions", "appeals-process", "your-data-ownership"],
  },
  {
    slug: "appeals-process",
    title: "Appeals Process",
    description: "How to appeal an AskBiz enforcement decision. The formal appeals process, timelines, who reviews appeals, and escalation options including external dispute resolution.",
    category: "Enforcement & Appeals",
    categorySlug: "enforcement",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["EU DSA Article 20", "UK Online Safety Act 2023 s.22", "UK Consumer Rights Act 2015"],
    keywords: ["appeal askbiz decision", "askbiz appeals process", "account reinstatement appeal", "dispute askbiz enforcement"],
    content: [
      {
        heading: "Your Right to Appeal",
        body: "You have the right to appeal any enforcement action taken against your account. This right applies to:\n- Warnings\n- Feature restrictions\n- Account suspensions\n- Account terminations\n- Content removal decisions\n\nAppeals are reviewed by a senior staff member who was not involved in the original decision. We aim to resolve all appeals within 10 business days.",
      },
      {
        heading: "How to Submit an Appeal",
        body: "To submit an appeal:\n\n1. Email appeals@askbiz.co within **30 days** of receiving the enforcement notification\n2. Use the subject line: 'Appeal — [your account email] — [enforcement type]'\n3. Include:\n   - Your account email address\n   - The enforcement action you are appealing\n   - The date you received the notification\n   - Your grounds for appeal (why you believe the decision was incorrect or disproportionate)\n   - Any supporting evidence\n\nAppeals submitted after 30 days will only be considered in exceptional circumstances.",
      },
      {
        heading: "What Happens During the Appeal",
        body: "Once we receive your appeal:\n1. You receive an acknowledgement within 2 business days\n2. A senior staff member not involved in the original decision reviews the appeal\n3. They may request additional information from you or from the team that made the original decision\n4. A written decision is issued within 10 business days of receiving all required information\n5. The decision letter explains: the outcome, the reasoning, and any further options available to you\n\nDuring a pending appeal, account suspensions remain in force unless we specifically grant interim access pending review.",
      },
      {
        heading: "Possible Appeal Outcomes",
        body: "- **Appeal upheld — full reversal:** The enforcement action is cancelled. Your account is fully restored. If you lost access during the appeal period, you receive a subscription credit for the period of wrongful suspension.\n- **Appeal upheld — partial:** The original action is modified (e.g. termination reduced to suspension, or suspension duration reduced).\n- **Appeal dismissed:** The original enforcement action stands. We provide full written reasons.\n- **Appeal upheld with conditions:** Reinstatement is granted subject to conditions (e.g. you agree to specific restrictions or additional monitoring).",
      },
      {
        heading: "External Dispute Resolution",
        body: "If you are unsatisfied with the outcome of our internal appeals process, you have additional options:\n\n**EU users:** Under the EU Digital Services Act (DSA) Article 21, you have the right to use an out-of-court dispute settlement body certified by an EU member state Digital Services Coordinator. We will engage in good faith with any DSA-certified dispute settlement body. We are not currently listed as a Very Large Online Platform (VLOP) under the DSA.\n\n**UK users:** You may refer disputes to the appropriate UK regulatory body (ICO for data protection matters, CMA for competition matters, FCA for regulated financial services matters).\n\n**US users:** For consumer protection disputes, you may contact the FTC at ftc.gov/complaint or your state Attorney General's office.\n\n**All users:** Unresolved disputes may ultimately be resolved through binding arbitration or litigation in accordance with the governing law provisions of the AskBiz Terms of Service.",
      },
    ],
    related: ["enforcement-actions", "account-suspension", "reporting-a-concern"],
  },

  // ── LAW ENFORCEMENT ───────────────────────────────────────────────────────
  {
    slug: "law-enforcement-requests",
    title: "Law Enforcement Requests",
    description: "How AskBiz responds to legal requests for user data from law enforcement, government agencies, and courts. What we require, what we disclose, and how we protect users.",
    category: "Law Enforcement Guidelines",
    categorySlug: "law-enforcement",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 6,
    legalBasis: ["UK GDPR Article 6(1)(c)", "Investigatory Powers Act 2016 (UK)", "EU GDPR Article 6(1)(c)", "US Electronic Communications Privacy Act", "CLOUD Act"],
    keywords: ["askbiz law enforcement", "government data request askbiz", "court order askbiz", "user data legal request"],
    content: [
      {
        heading: "Our Position",
        body: "AskBiz is committed to protecting the privacy and data of our users. We do not voluntarily disclose user data to law enforcement, government agencies, or regulatory bodies without a valid legal order.\n\nWe review all requests carefully, require valid legal process, and notify affected users where we are legally permitted to do so.",
      },
      {
        heading: "What We Require From Law Enforcement",
        body: "We require the following before disclosing any user data:\n\n**UK:** A production order under the Police and Criminal Evidence Act 1984 (PACE), an order under the Investigatory Powers Act 2016, or equivalent legal compulsion. Informal requests, letters, or phone calls do not constitute sufficient legal basis.\n\n**EU:** A court order or equivalent legal instrument from a court of competent jurisdiction in an EU member state. Requests must comply with applicable EU data protection law, including the requirement that data transfers to non-EU countries comply with GDPR Chapter V.\n\n**US:** A valid subpoena, court order, or search warrant from a court of competent jurisdiction. Emergency requests (involving imminent risk to life) are assessed on the specific circumstances.\n\n**International requests:** Must comply with applicable Mutual Legal Assistance Treaties (MLATs) or equivalent international legal instruments. We do not respond to requests from jurisdictions with which the UK has no extradition treaty or MLAT unless independently confirmed as legally valid.",
      },
      {
        heading: "What We Will and Will Not Disclose",
        body: "**We will disclose in response to valid legal orders:**\n- Account registration information (email address, account creation date, plan type)\n- Billing information (billing name, address, last 4 digits of payment method)\n- Login history and IP addresses\n- Account activity logs\n- Connected platform types (e.g. 'this account has Shopify connected')\n\n**We will not disclose without specific legal basis:**\n- Content of AI conversations\n- Business data uploaded or synced by the user\n- Connected platform data (Shopify sales, Amazon orders, etc.) — this data belongs to you and your platform provider, not us\n\n**We cannot disclose:**\n- Passwords (we store hashed passwords, not the originals)\n- Full payment card numbers (we use Stripe — we never see card numbers)\n- Data we do not hold",
      },
      {
        heading: "User Notification",
        body: "We will notify affected users of legal requests for their data, unless we are legally prohibited from doing so (e.g. by a non-disclosure order, a court gag order, or equivalent).\n\nNotification will be made:\n- By email to the account's primary address\n- Before disclosure where possible, or as soon as permitted after disclosure\n- Including the nature of the request (type of order, jurisdiction) where we are not prohibited from disclosing this\n\nIf you receive a notice from us about a legal request, you may wish to seek independent legal advice.",
      },
      {
        heading: "Submitting Legal Requests",
        body: "Law enforcement and government agencies should direct requests to:\n\n**Email:** legal@askbiz.co\n**Subject line:** Law Enforcement Request — [Jurisdiction] — [Request Type]\n\nRequests should include:\n- The requesting agency's name and contact details\n- The legal instrument authorising the request (attach a copy)\n- The specific account identifier (email address or account ID)\n- The specific data categories requested\n- The legal basis for the request\n- The time period of data required\n- Whether a user notification prohibition is requested (and the legal basis for it)\n\nRequests submitted without complete information will be returned for completion before processing.",
      },
    ],
    related: ["data-preservation-requests", "transparency-reporting", "gdpr-uk-compliance"],
  },
  {
    slug: "data-preservation-requests",
    title: "Data Preservation Requests",
    description: "How AskBiz responds to requests to preserve user data pending legal proceedings. What we preserve, for how long, and the legal framework.",
    category: "Law Enforcement Guidelines",
    categorySlug: "law-enforcement",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 3,
    legalBasis: ["UK PACE 1984 s.22", "EU GDPR Article 17(3)(e)", "US ECPA 18 USC 2703(f)"],
    keywords: ["data preservation order askbiz", "legal hold askbiz", "preserve user data request"],
    content: [
      {
        heading: "What Is a Data Preservation Request?",
        body: "A data preservation request asks AskBiz to retain specific user data that would otherwise be deleted under our normal retention schedule, pending the service of full legal process.\n\nPreservation does not mean disclosure. We preserve the data in a secure, segregated state while the requesting authority obtains the necessary legal orders for actual disclosure.",
      },
      {
        heading: "Preservation Process",
        body: "Upon receipt of a valid preservation request:\n1. We acknowledge receipt within 2 business days\n2. We create a point-in-time snapshot of the specified account data\n3. We retain that snapshot for **90 days** pending service of a formal legal order\n4. If no formal order is received within 90 days, the preserved data is released back to normal retention schedule (one renewal of 90 days is possible upon request)\n5. If a valid legal order is received within the preservation period, we process it per our Law Enforcement Requests policy\n\n**User notification:** We do not notify the account holder of a preservation request unless legally required to do so, as notification could prejudice an investigation.",
      },
      {
        heading: "Requirements for Preservation Requests",
        body: "Preservation requests must come from law enforcement or government agencies with jurisdiction over the matter, and must specify:\n- The account to be preserved (email address or account ID)\n- The data categories to be preserved\n- The investigation or legal proceeding the preservation relates to\n- The authority's contact details\n- The legal basis for the preservation request\n\nSend to legal@askbiz.co with subject line: 'Data Preservation Request — [Jurisdiction]'",
      },
    ],
    related: ["law-enforcement-requests", "transparency-reporting"],
  },
  {
    slug: "transparency-reporting",
    title: "Transparency Reporting",
    description: "AskBiz's commitment to transparency about law enforcement requests, government demands, and content enforcement. How we report on these activities.",
    category: "Law Enforcement Guidelines",
    categorySlug: "law-enforcement",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 3,
    keywords: ["askbiz transparency report", "government requests transparency", "law enforcement data transparency"],
    content: [
      {
        heading: "Our Transparency Commitment",
        body: "AskBiz is committed to being transparent about law enforcement requests and government demands affecting our users. We publish an annual Transparency Report that covers:\n- Number of law enforcement requests received, by jurisdiction (UK, EU, US, other)\n- Number of requests complied with in full, partially, or rejected\n- Number of users affected\n- Number of national security requests (to the extent we are legally permitted to disclose)\n- Number of content removal requests\n- Number of account suspension or termination actions taken for policy violations\n\nThe first Transparency Report will cover calendar year 2026 and will be published at askbiz.co/transparency by Q1 2027.",
      },
      {
        heading: "Canary Statement",
        body: "As of the date of this policy (April 2026), AskBiz has:\n- Not received any national security letters or equivalent instruments\n- Not received any court orders prohibiting disclosure of government requests\n- Not been subject to any classified government demands for user data\n\nWe will update or remove this statement if circumstances change, to the extent we are legally permitted to do so. The absence of this statement in future versions of this policy may indicate that we have received such a demand and are legally prohibited from disclosing it.",
      },
    ],
    related: ["law-enforcement-requests", "data-preservation-requests"],
  },

  // ── REGULATORY COMPLIANCE ─────────────────────────────────────────────────
  {
    slug: "gdpr-uk-compliance",
    title: "GDPR & UK GDPR Compliance",
    description: "How AskBiz complies with EU GDPR and UK GDPR — lawful bases, data subject rights, international transfers, sub-processors, and our Data Processing Agreement.",
    category: "Regulatory Compliance",
    categorySlug: "regulatory-compliance",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 7,
    legalBasis: ["EU GDPR Regulation 2016/679", "UK GDPR / Data Protection Act 2018", "EU-UK Adequacy Decision"],
    keywords: ["askbiz gdpr compliance", "gdpr data processor", "uk gdpr saas", "gdpr data subject rights askbiz"],
    content: [
      {
        heading: "Scope and Applicability",
        body: "EU GDPR applies to AskBiz because we offer services to individuals and businesses in the EU. UK GDPR applies because we are a UK-registered business and process personal data in the UK. Both frameworks impose substantially similar obligations.\n\nAskBiz operates in two distinct capacities under GDPR:\n- **Data Controller** — for personal data of our own users (your name, email, billing information)\n- **Data Processor** — for personal data you upload or sync from connected platforms (your customers' hashed identifiers, order histories, etc.)",
      },
      {
        heading: "Lawful Bases We Rely On",
        body: "**For your account data (as controller):**\n- **Contract (Article 6(1)(b))** — processing your email, billing details, and account information is necessary to provide the service you have contracted for\n- **Legal obligation (Article 6(1)(c))** — retention of billing records for tax compliance\n- **Legitimate interests (Article 6(1)(f))** — product analytics (anonymised), security monitoring, and fraud prevention\n- **Consent (Article 6(1)(a))** — marketing communications (opt-in only)\n\n**For data you upload (as processor):**\nYou determine the lawful basis. AskBiz processes this data on your documented instructions. Our DPA sets out our processor obligations.",
      },
      {
        heading: "International Data Transfers",
        body: "AskBiz's infrastructure is hosted in the EU (AWS Dublin). However, we use Anthropic's Claude API, which involves a transfer of data to the United States.\n\nThis transfer is governed by:\n- **Standard Contractual Clauses (SCCs)** — we have SCCs in place with Anthropic covering the transfer of personal data\n- **Anthropic's sub-processor obligations** — Anthropic processes data transiently (not retained beyond the API call duration)\n- **Transfer Impact Assessment** — we have conducted a TIA and determined that the SCCs provide adequate protection given the transient nature of the transfer and Anthropic's security measures\n\nData processed by Stripe (billing) is subject to Stripe's own GDPR compliance measures and Privacy Shield successor framework.",
      },
      {
        heading: "Sub-Processors",
        body: "AskBiz uses the following sub-processors to deliver the service:\n\n- **Vercel Inc. (US)** — application hosting. EU users' requests are served from Vercel's EU edge network. Data subject to Vercel's DPA and SCCs.\n- **Supabase Inc. (US)** — database hosting, deployed on AWS EU-West-1 (Dublin). Data stored in the EU.\n- **Anthropic PBC (US)** — Claude AI API. Personal data transmitted transiently for AI processing. SCCs in place.\n- **Stripe Inc. (US)** — payment processing. Processes billing data only. Stripe's own GDPR compliance applies.\n- **PostHog Inc. (US)** — product analytics. Anonymised usage data only. PostHog EU deployment used. Consent-based.\n\nWe maintain a full sub-processor list and notify customers of material sub-processor changes with 30 days' notice.",
      },
      {
        heading: "Your Rights as a Data Subject",
        body: "Under EU and UK GDPR, you have the following rights regarding personal data AskBiz holds about you:\n\n- **Access (Article 15)** — request a copy of your personal data\n- **Rectification (Article 16)** — correct inaccurate data\n- **Erasure (Article 17)** — 'right to be forgotten'\n- **Restriction (Article 18)** — restrict processing while a dispute is resolved\n- **Portability (Article 20)** — receive your data in machine-readable format\n- **Object (Article 21)** — object to processing based on legitimate interests\n- **Not to be subject to automated decisions (Article 22)** — AskBiz is designed as a decision-support tool and does not make automated decisions with significant legal effects\n\nExercise any right by emailing privacy@askbiz.co. We respond within 30 days (extendable by 2 months for complex requests with notice).\n\nYou also have the right to lodge a complaint with the ICO (UK): ico.org.uk | 0303 123 1113, or your national supervisory authority (EU).",
      },
    ],
    related: ["us-regulatory-compliance", "eu-ai-act-compliance-policy", "your-data-ownership"],
  },
  {
    slug: "us-regulatory-compliance",
    title: "US Regulatory Compliance",
    description: "How AskBiz complies with US privacy and consumer protection law — CCPA/CPRA, FTC Act, CAN-SPAM, state breach notification laws, and CLOUD Act considerations.",
    category: "Regulatory Compliance",
    categorySlug: "regulatory-compliance",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 6,
    legalBasis: ["CCPA / CPRA (California)", "FTC Act Section 5", "CAN-SPAM Act", "US state breach notification laws"],
    keywords: ["askbiz ccpa compliance", "askbiz us privacy law", "california privacy rights askbiz", "ftc compliance saas"],
    content: [
      {
        heading: "California Consumer Privacy Act (CCPA / CPRA)",
        body: "The California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), grants California residents specific rights regarding their personal information.\n\n**Does CCPA apply to AskBiz?**\nAskBiz is a UK-registered business. CCPA applies to for-profit businesses that collect personal information from California residents and meet certain thresholds (annual gross revenue exceeding $25 million, OR processing data of 100,000+ California consumers, OR deriving 50%+ revenue from selling personal data).\n\nAskBiz does not sell personal data. Our current user base means we may not meet the CCPA threshold. However, we respect and honour CCPA rights for all California-based users regardless of technical applicability.\n\n**Your CCPA rights:**\n- **Right to Know** — what personal information we collect, use, disclose, and sell (we do not sell)\n- **Right to Delete** — request deletion of your personal information\n- **Right to Opt-Out of Sale** — we do not sell personal information; this right is satisfied by default\n- **Right to Non-Discrimination** — we will not discriminate against you for exercising CCPA rights\n- **Right to Correct** — correct inaccurate personal information\n- **Right to Limit Use of Sensitive Personal Information** — we collect minimal sensitive information; contact privacy@askbiz.co to limit use\n\nExercise rights by emailing privacy@askbiz.co. We respond within 45 days (extendable by 45 days with notice).",
      },
      {
        heading: "FTC Act Compliance",
        body: "The Federal Trade Commission Act (Section 5) prohibits unfair or deceptive acts or practices in or affecting commerce. AskBiz complies with FTC guidance on:\n\n**AI disclosure:** We clearly disclose that AskBiz uses AI to generate responses. We do not present AI-generated analysis as independently verified human analysis. See our AI Transparency policy.\n\n**Endorsements and testimonials:** Any testimonials or case studies on askbiz.co reflect genuine user experiences. We do not publish fabricated testimonials or AI-generated fake reviews.\n\n**Data practices:** Our privacy policy and this rules page accurately describe how we collect, use, and share data. We do not engage in undisclosed data practices.\n\n**Marketing claims:** All marketing claims about AskBiz's capabilities are substantiated. We do not make unsubstantiated performance claims.",
      },
      {
        heading: "CAN-SPAM Act",
        body: "AskBiz complies with the CAN-SPAM Act for all commercial email communications to US users:\n\n- All marketing emails include our physical mailing address\n- All marketing emails include a clear and functioning unsubscribe mechanism\n- Unsubscribe requests are processed within 10 business days\n- We do not use deceptive subject lines or sender information\n- We clearly identify commercial emails as advertisements where required\n\nTransactional emails (invoices, security alerts, account notifications) are not marketing emails and are not subject to CAN-SPAM opt-out requirements, though you can configure notification preferences in Account Settings.",
      },
      {
        heading: "US State Breach Notification Laws",
        body: "In the event of a data breach affecting US users, AskBiz complies with applicable state breach notification laws. Key requirements:\n\n- **California (CCPA/CPRA):** Notify within 'in the most expedient time possible and without unreasonable delay'\n- **New York (SHIELD Act):** Notify 'in the most expedient time possible'\n- **Virginia (VCDPA):** Notify within 60 days\n- **Colorado, Connecticut, Utah:** Various timelines (30–60 days)\n\nWhere multiple states' laws apply, we notify on the most demanding timeline. US users receive breach notifications from security@askbiz.co.\n\nNotifications include: what happened, what data was affected, what steps we have taken, what steps you can take, and contact information for questions.",
      },
      {
        heading: "CLOUD Act",
        body: "The US CLOUD Act (Clarifying Lawful Overseas Use of Data Act) allows US law enforcement to issue warrants for data held by US-based companies abroad. AskBiz is a UK company, not a US company, and is therefore not subject to CLOUD Act obligations as a provider.\n\nHowever, our sub-processors (Vercel, Supabase, Anthropic, Stripe) are US-based and may be subject to CLOUD Act demands. We have contractual provisions with sub-processors requiring them to notify us of CLOUD Act demands where legally permitted, so we can seek to challenge demands that are inconsistent with UK or EU data protection law.",
      },
    ],
    related: ["gdpr-uk-compliance", "law-enforcement-requests", "transparency-reporting"],
  },
  {
    slug: "eu-ai-act-compliance-policy",
    title: "EU AI Act — Regulatory Compliance",
    description: "AskBiz's formal regulatory compliance position under EU AI Act Regulation 2024/1689. Our obligations as a deployer, documentation maintained, and how to exercise AI-related rights.",
    category: "Regulatory Compliance",
    categorySlug: "regulatory-compliance",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-08-01",
    readTime: 5,
    legalBasis: ["EU AI Act Regulation 2024/1689"],
    keywords: ["eu ai act compliance", "ai act deployer obligations", "limited risk ai system", "ai regulation compliance 2026"],
    content: [
      {
        heading: "AskBiz's Role Under the AI Act",
        body: "Under the EU AI Act, AskBiz operates as a **deployer** — an entity that uses an AI system (Claude by Anthropic) in the course of a professional activity to provide a service to users.\n\nAnthropic operates as the **provider** of the Claude general-purpose AI model. Our compliance obligations as deployer are set out in Article 26 of the AI Act.",
      },
      {
        heading: "Deployer Obligations We Meet (Article 26)",
        body: "As a deployer of a limited-risk AI system, AskBiz fulfils the following Article 26 obligations:\n\n**Use in accordance with instructions:** We use Claude within the scope of its intended purpose as defined by Anthropic, in accordance with Anthropic's usage policies.\n\n**Human oversight:** We implement appropriate human oversight measures. Our interface presents AI outputs with confidence indicators and encourages human review. The AI cannot take autonomous consequential actions.\n\n**Data governance:** We ensure the input data we use to query the AI is relevant, sufficiently accurate, and appropriate for the intended purpose.\n\n**Monitoring:** We monitor the AI system's operation for risks and report concerns to Anthropic through established channels.\n\n**Transparency to users:** We inform users that they are interacting with an AI system and provide the AI Transparency disclosures required by Article 50.",
      },
      {
        heading: "Documentation We Maintain",
        body: "AskBiz maintains the following documentation in compliance with the AI Act:\n\n- **Risk classification assessment** — documenting why AskBiz is classified as limited-risk\n- **Deployer technical documentation** — describing the AI system, its inputs/outputs, and our use case\n- **Sub-processor agreements** — including data processing terms with Anthropic\n- **Incident log** — record of any AI-related incidents or near-misses\n- **User rights log** — record of user requests to explain or contest AI decisions\n- **Annual review record** — annual assessment of continued compliance\n\nThis documentation is available to EU supervisory authorities on request.",
      },
      {
        heading: "Prohibited AI Practices — Our Compliance",
        body: "The AI Act's Article 5 prohibitions on unacceptable-risk AI practices apply from 2 February 2025. AskBiz complies:\n\n- We do not use AI for social scoring of individuals\n- We do not use AI for subliminal manipulation\n- We do not use real-time biometric identification systems\n- We do not use AI for predictive policing or pre-crime assessment\n- We do not use AI to exploit vulnerabilities of specific groups\n- We do not use AI to infer political, religious, philosophical beliefs, or trade union membership\n- We do not use AI emotion recognition in workplace or educational settings\n\nThese commitments apply regardless of user requests.",
      },
      {
        heading: "Exercising Your AI Act Rights",
        body: "As an EU user, you have rights related to AI under the AI Act:\n\n**Right to explanation:** Ask any AskBiz AI response to explain its reasoning. The AI is instructed to answer these meta-questions transparently.\n\n**Right to contest:** If an AI output influences a decision of significance to you and you believe it is incorrect, email support@askbiz.co with the context. A human will review.\n\n**Right to complain:** If you believe AskBiz has violated the AI Act, you may complain to the national supervisory authority in your EU member state. In Ireland, this is the AI Office (established under the AI Act). In other member states, the relevant authority is typically the data protection authority or a designated AI authority.\n\nContact: support@askbiz.co for all AI-related queries.",
      },
    ],
    related: ["ai-use-policy", "ai-transparency", "gdpr-uk-compliance"],
  },
  {
    slug: "uk-online-safety-act-compliance",
    title: "UK Online Safety Act Compliance",
    description: "AskBiz's compliance position under the UK Online Safety Act 2023. Why AskBiz is not a regulated user-to-user service, our voluntary commitments, and how we protect users.",
    category: "Regulatory Compliance",
    categorySlug: "regulatory-compliance",
    lastUpdated: "2026-04-01",
    effectiveDate: "2026-04-01",
    readTime: 5,
    legalBasis: ["Online Safety Act 2023 (UK)", "Ofcom Codes of Practice 2024"],
    keywords: ["uk online safety act askbiz", "osa compliance saas", "ofcom online safety", "b2b saas online safety act"],
    content: [
      {
        heading: "Does the Online Safety Act Apply to AskBiz?",
        body: "The UK Online Safety Act 2023 (OSA) applies to 'user-to-user services' (platforms where users can interact with each other's content) and 'search services.' The OSA's heaviest duties — age verification, illegal content removal, CSAM detection — apply to these categories.\n\n**AskBiz is not a user-to-user service.** AskBiz is a business analytics platform where:\n- Users interact only with AI-generated analysis of their own data\n- There is no user-generated public content\n- Users cannot see, interact with, or influence other users' content\n- There are no public forums, comments sections, or social features\n\nAs a result, AskBiz is not subject to the OSA's regulated user-to-user service duties. However, we may be considered a 'Part 3 service' accessible to UK users, which carries a duty to assess illegal content risks and implement proportionate measures.",
      },
      {
        heading: "Our Voluntary Commitments",
        body: "Although not subject to the OSA's heaviest requirements, AskBiz voluntarily implements standards aligned with OSA principles because they represent good practice for any platform used by people in the UK:\n\n**Illegal content:** AskBiz AI is configured to refuse requests that would facilitate any of the OSA's listed priority illegal offences (terrorism, CSAM, fraud, hate crime, etc.)\n\n**User safety:** We provide clear reporting mechanisms for safety concerns (security@askbiz.co)\n\n**Transparency:** We publish these policies and our AI content restrictions clearly\n\n**Children:** AskBiz is a professional business tool intended for adults (18+). We do not market to minors. Our Terms of Service require users to be 18 or over.",
      },
      {
        heading: "Illegal Harms Risk Assessment",
        body: "In line with Ofcom's guidance that all services accessible to UK users should consider their exposure to illegal content risks, AskBiz has conducted an informal illegal harms risk assessment:\n\n**Risk level: Low.** Rationale:\n- AskBiz is a closed B2B platform — not publicly accessible without an account\n- The platform has no public content sharing, no user-to-user interaction, and no social features\n- The AI is scoped to business analytics and declines requests outside this scope\n- Users are businesses and business professionals, not anonymous public users\n- The AI is configured to refuse requests relating to OSA priority illegal content categories\n\nWe review this assessment annually and whenever we introduce significant new features.",
      },
      {
        heading: "Reporting Safety Concerns",
        body: "If you encounter content or behaviour on AskBiz that raises a safety concern under the OSA — for example, AI-generated content that appears to facilitate illegal activity — please report it immediately:\n\n- **Email:** security@askbiz.co\n- **Subject:** OSA Safety Concern\n- **Include:** Description of the concern, any relevant screenshots or conversation context\n\nWe will investigate within 3 business days and take appropriate action.",
      },
    ],
    related: ["gdpr-uk-compliance", "ai-content-restrictions", "reporting-a-concern"],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getPolicyBySlug(slug: string): PolicyArticle | undefined {
  return POLICY_ARTICLES.find((a) => a.slug === slug);
}

export function getPoliciesByCategory(categorySlug: string): PolicyArticle[] {
  return POLICY_ARTICLES.filter((a) => a.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): PolicyCategory | undefined {
  return POLICY_CATEGORIES.find((c) => c.slug === slug);
}

export function searchPolicies(query: string): PolicyArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return POLICY_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.content.some(
        (s) => s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
      ) ||
      (a.keywords && a.keywords.some((k) => k.toLowerCase().includes(q))) ||
      (a.legalBasis && a.legalBasis.some((l) => l.toLowerCase().includes(q)))
  );
}

export const LAST_REVIEWED = "April 2026";
export const EFFECTIVE_DATE = "1 April 2026";
export const CONTACT_EMAIL = "legal@askbiz.co";
export const PRIVACY_EMAIL = "privacy@askbiz.co";
export const SECURITY_EMAIL = "security@askbiz.co";
export const APPEALS_EMAIL = "appeals@askbiz.co";
