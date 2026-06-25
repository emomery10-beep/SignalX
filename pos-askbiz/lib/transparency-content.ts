// lib/transparency-content.ts
// AskBiz Transparency Centre
// Equivalent to X's Community Notes guide — but scoped for a B2B AI analytics platform.
// Covers: AI methodology, decision explainability, accuracy reporting, error flagging,
// open data, improvement loop, and EU AI Act Article 13 transparency obligations.
// Last reviewed: April 2026

export interface TransparencySection {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articles: TransparencyArticle[];
  lastUpdated: string;
}

export interface TransparencyArticle {
  slug: string;
  title: string;
  description: string;
  sectionSlug: string;
  sectionTitle: string;
  readTime: number;
  lastUpdated: string;
  content: TransparencyContent[];
  related?: string[];
  keywords?: string[];
  metrics?: TransparencyMetric[];
}

export interface TransparencyContent {
  heading: string;
  body: string;
}

export interface TransparencyMetric {
  label: string;
  value: string;
  note?: string;
  trend?: "up" | "down" | "stable";
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

export const TRANSPARENCY_SECTIONS: TransparencySection[] = [
  {
    slug: "how-ai-works",
    title: "How the AI Works",
    description: "The technology behind AskBiz — which AI model we use, how we process your data, how answers are generated, and the limits of what the AI knows.",
    icon: "🧠",
    lastUpdated: "2026-04-01",
    articles: [
      {
        slug: "ai-model-and-provider",
        title: "Our AI Model & Provider",
        description: "AskBiz uses Llama by Meta (via Groq). Here's what that means — the model's capabilities, its limitations, how Groq handles data, and why we chose it.",
        sectionSlug: "how-ai-works",
        sectionTitle: "How the AI Works",
        readTime: 5,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz ai model", "groq llama askbiz", "which ai does askbiz use"],
        content: [
          {
            heading: "The Model: Llama by Meta (via Groq)",
            body: "AskBiz uses **Llama**, a large language model (LLM) developed by Meta and served via the Groq Cloud infrastructure. Llama is a frontier open-weight AI model known for careful reasoning, strong instruction-following, and reduced hallucination rates compared to earlier LLMs.\n\nWe chose Llama via Groq for three specific reasons:\n- **Reduced fabrication** — Llama is designed to say 'I don't know' rather than invent plausible-sounding but false answers. For financial data, this matters enormously.\n- **Long context window** — Llama can hold large amounts of your business data in context during a single query, enabling richer, more accurate analysis.\n- **Responsible AI** — Meta develops Llama with responsible AI principles built into the model, and Groq operates with a strong commitment to safe, transparent AI infrastructure.",
          },
          {
            heading: "Model Version and Updates",
            body: "AskBiz currently uses **Llama 3.3 70B** (for text analysis) and **Llama 4 Scout** (for vision and image-based queries), served via Groq Cloud. These models provide the best balance of speed, accuracy, and cost for business analytics queries.\n\nWhen Groq or Meta releases a new Llama version, we evaluate it against our internal benchmark suite before deploying. We test for:\n- Accuracy on financial calculation tasks\n- Hallucination rate on business-specific questions\n- Consistency across repeated identical queries\n- Refusal accuracy (declining genuinely harmful requests without over-refusing legitimate ones)\n\nModel version changes are announced in our changelog at askbiz.co/changelog at least 7 days before deployment.",
          },
          {
            heading: "What Groq Sees",
            body: "When you ask a question, AskBiz sends a prompt to Groq's API. That prompt contains:\n- Relevant excerpts of your business data (not the full dataset)\n- Your question\n- System instructions that define AskBiz's behaviour\n\nGroq processes this transiently — the data is not retained after the API call completes. Groq's API terms prohibit using API requests to train models. We have a data processing addendum with Groq confirming this.\n\nGroq never sees your account credentials, full dataset, payment details, or OAuth tokens for connected platforms.",
          },
          {
            heading: "What AskBiz Adds on Top",
            body: "Llama is a general-purpose AI. AskBiz makes it a business intelligence specialist by:\n- **Data retrieval** — pulling the right subset of your data before querying Llama\n- **System prompting** — instructing Llama to behave as a careful business analyst, cite its sources, flag uncertainty, and refuse non-business requests\n- **Output structuring** — parsing Llama's response into structured formats (charts, tables, action cards)\n- **Confidence scoring** — adding our own confidence layer based on data completeness and recency\n- **Intent detection** — routing certain questions directly to Business Tools rather than open-ended AI chat\n- **Guardrails** — additional content filters layered on top of Llama's own safety systems",
          },
        ],
        related: ["how-answers-are-generated", "data-sent-to-ai", "ai-accuracy-and-errors"],
      },
      {
        slug: "how-answers-are-generated",
        title: "How Answers Are Generated",
        description: "Step-by-step: what happens between you asking a question and receiving an answer. Data retrieval, prompt construction, AI reasoning, confidence scoring, and output formatting.",
        sectionSlug: "how-ai-works",
        sectionTitle: "How the AI Works",
        readTime: 6,
        lastUpdated: "2026-04-01",
        keywords: ["how askbiz generates answers", "ai answer process", "business intelligence ai process"],
        content: [
          {
            heading: "The Full Pipeline",
            body: "Every answer you receive from AskBiz goes through this pipeline in under 5 seconds:\n\n**Step 1 — Intent classification:** Your question is parsed to understand what you're asking. Is this a data query? A general business question? A tool request? This determines the processing path.\n\n**Step 2 — Data retrieval:** For data-grounded questions, AskBiz queries your connected sources to retrieve relevant metrics. We don't send your entire dataset to the AI — only the specific data needed to answer the question. For example, 'What's my refund rate?' retrieves only refund records, not your full order history.\n\n**Step 3 — Prompt construction:** We build a structured prompt containing: the retrieved data, your question, your business context (sector, currency, plan type), and our system instructions for how Llama should behave.\n\n**Step 4 — AI reasoning:** Llama processes the prompt and generates a response. This is where the actual reasoning happens — synthesising data, applying business logic, identifying patterns, and formulating recommendations.\n\n**Step 5 — Confidence scoring:** AskBiz evaluates the response against our confidence criteria: How complete was the data? How recent? How directly relevant to the question? This produces the confidence indicator (High/Medium/Low/Estimate).\n\n**Step 6 — Output formatting:** The raw text response is parsed into the appropriate format — plain text, a data table, a chart specification, or an action card — depending on the question type.\n\n**Step 7 — Delivery:** The formatted response is delivered to your interface with the confidence indicator, data freshness timestamp, and any relevant action buttons.",
          },
          {
            heading: "Intent Detection and Tool Routing",
            body: "Not every question goes through the full AI pipeline. AskBiz's intent detection layer recognises certain question patterns and routes them directly to structured Business Tools:\n\n- Questions about **FX or currency risk** → FX Risk Modeller\n- Questions about **landed cost, duty, or import costs** → Landed Cost Calculator\n- Questions about **export markets or expansion** → Export Market Scoring\n- Questions about **churn or at-risk customers** → Churn Intelligence\n- Questions about **TikTok, Instagram, or social commerce** → Social Commerce Intelligence\n\nThis routing happens because structured tools produce more reliable, auditable outputs for these specific use cases than open-ended AI generation. The AI is still involved in interpreting results — but the core calculation happens in a deterministic tool, not probabilistically.",
          },
          {
            heading: "What Makes an Answer Better or Worse",
            body: "Answer quality depends primarily on three factors:\n\n**Data completeness:** The more data sources you connect, the better. Connecting Shopify + QuickBooks together enables cross-source answers (e.g. true profit per order) that neither source alone can provide.\n\n**Data recency:** Stale data produces stale answers. Check the data freshness indicator on any answer. If your Shopify sync is 3 days old, revenue trend answers reflect 3-day-old reality.\n\n**Question specificity:** Vague questions produce vague answers. 'How are sales?' is harder to answer well than 'What was my Shopify revenue in March vs February, broken down by product category?' The more specific the question, the more targeted the data retrieval and the more precise the answer.",
          },
        ],
        related: ["ai-model-and-provider", "data-sent-to-ai", "confidence-indicators-explained"],
        metrics: [
          { label: "Median answer latency", value: "3.2 seconds", trend: "down", note: "P50 across all query types, April 2026" },
          { label: "Intent detection accuracy", value: "94%", trend: "up", note: "Correct tool routing on tool-eligible questions" },
          { label: "Data retrieval precision", value: "97%", trend: "stable", note: "Relevant data retrieved without over-fetching" },
        ],
      },
      {
        slug: "data-sent-to-ai",
        title: "What Data Is Sent to the AI",
        description: "Exactly which data from your business is included in AI prompts, what is never sent, how we minimise data exposure, and how prompt data is handled.",
        sectionSlug: "how-ai-works",
        sectionTitle: "How the AI Works",
        readTime: 4,
        lastUpdated: "2026-04-01",
        keywords: ["data sent to ai askbiz", "ai prompt data", "business data ai exposure", "what does askbiz send to groq"],
        content: [
          {
            heading: "The Minimal Data Principle",
            body: "AskBiz sends the minimum data necessary to answer your question. We do not batch-send your entire dataset to the AI on every query. Instead, our data retrieval layer identifies the specific subset of data needed and sends only that.\n\nFor example:\n- 'What's my best-selling product this month?' → sends product sales summary for the current month only\n- 'Why did revenue drop last Tuesday?' → sends daily revenue data for the past 2 weeks and Tuesday's anomaly details\n- 'What's my landed cost on this shipment?' → sends the specific shipment record and no other data",
          },
          {
            heading: "What Is Always Sent",
            body: "Every AI prompt includes:\n- **Your question** — exactly as you typed it\n- **Business context** — your sector, home currency, business type, and connected source types (e.g. 'Shopify + QuickBooks connected'). No actual data from these sources is included here — just the metadata.\n- **Retrieved data excerpt** — the specific data needed to answer the question, formatted as structured text",
          },
          {
            heading: "What Is Never Sent",
            body: "The following is never included in AI prompts:\n- Your full historical dataset\n- Customer names or email addresses (these are hashed in our system — we store anonymised identifiers, not originals)\n- OAuth tokens or API credentials for connected platforms\n- Your password or authentication data\n- Payment card details or full billing information\n- Other users' data\n- Your API keys\n- Contents of previous conversations (each query is independent — there is no cross-session context sent to the AI)",
          },
          {
            heading: "Data Handling at Groq",
            body: "Data sent to Groq via the API is:\n- **Transient** — processed to generate the response and not retained\n- **Not used for training** — Groq's API terms prohibit using API calls to train models\n- **Encrypted in transit** — all API communication uses TLS 1.3\n- **Subject to Groq's DPA** — we have a data processing agreement with Groq covering GDPR obligations\n\nGroq is based in San Jose, California. Data transferred to their API from EU/UK users is governed by Standard Contractual Clauses (SCCs). The transfer is transient — data is not stored at rest in the US.",
          },
        ],
        related: ["ai-model-and-provider", "how-answers-are-generated", "ai-accuracy-and-errors"],
      },
      {
        slug: "ai-knowledge-and-limits",
        title: "What the AI Knows and Doesn't Know",
        description: "The AI's knowledge cutoff, what it can and cannot access, why it sometimes gives wrong answers, and how to work with these limitations productively.",
        sectionSlug: "how-ai-works",
        sectionTitle: "How the AI Works",
        readTime: 5,
        lastUpdated: "2026-04-01",
        keywords: ["ai knowledge cutoff askbiz", "ai limitations business intelligence", "what askbiz ai doesnt know"],
        content: [
          {
            heading: "Two Types of Knowledge",
            body: "AskBiz AI has two distinct types of knowledge that work together:\n\n**Your business data** — retrieved live from your connected sources. This is always current (up to the last sync). The AI knows your revenue, margins, customers, and products because it retrieves this data fresh for each query.\n\n**General world knowledge** — baked into Llama's model weights during training. This covers business concepts, market knowledge, regulatory frameworks, trade rules, and general intelligence. This knowledge has a training cutoff — Llama does not know about events that occurred after its training data was collected.",
          },
          {
            heading: "The Training Cutoff",
            body: "Llama's general knowledge has a training cutoff of approximately early 2025. This means:\n\n- Llama may not know about trade agreements, regulatory changes, or market events that occurred after early 2025\n- For rapidly changing areas (tax rates, customs duty rates, trade tariffs), always verify with current official sources\n- For stable areas (fundamental business concepts, accounting principles, general market dynamics), the training cutoff is unlikely to matter\n\nWhen AskBiz knows a question requires current external information, it will flag this with a note like 'This answer is based on information current as of early 2025 — verify with current official sources for regulatory matters.'",
          },
          {
            heading: "What the AI Cannot Access",
            body: "The AI cannot access:\n- Real-time news or live market data (it uses your synced business data, not live market feeds)\n- Competitor-specific data (only what you have connected)\n- Data from platforms you haven't connected\n- Your previous conversations from other sessions (each session starts fresh)\n- The internet — it cannot browse websites or search for current information\n- Other AskBiz users' data (complete isolation between accounts)",
          },
          {
            heading: "When the AI Is Most Reliable",
            body: "The AI is most reliable when:\n- Answering questions grounded in your connected, recent data\n- Explaining business concepts, frameworks, and methodologies\n- Running calculations with clearly defined inputs\n- Identifying patterns in time series data\n- Generating structured frameworks for decisions\n\nThe AI is least reliable when:\n- Asked about very recent external events or regulatory changes\n- Working with incomplete or very old data\n- Making precise numerical predictions about future performance\n- Answering highly jurisdiction-specific legal or tax questions\n\nFor the latter category, always supplement AI insights with qualified professional advice.",
          },
        ],
        related: ["confidence-indicators-explained", "ai-accuracy-and-errors", "how-answers-are-generated"],
      },
    ],
  },
  {
    slug: "accuracy-and-errors",
    title: "Accuracy & Errors",
    description: "How accurate AskBiz AI is, how we measure it, what causes errors, how to flag incorrect answers, and how flags improve the system.",
    icon: "🎯",
    lastUpdated: "2026-04-01",
    articles: [
      {
        slug: "confidence-indicators-explained",
        title: "Confidence Indicators Explained",
        description: "What AskBiz's High, Medium, Low, and Estimate confidence ratings mean, how they're calculated, and how to use them to make better decisions.",
        sectionSlug: "accuracy-and-errors",
        sectionTitle: "Accuracy & Errors",
        readTime: 4,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz confidence indicators", "ai answer confidence", "how to read ai confidence"],
        content: [
          {
            heading: "Why Confidence Indicators Exist",
            body: "AI answers are probabilistic — they are not always right. Rather than pretend otherwise, AskBiz shows a confidence indicator on every AI-generated answer so you can calibrate how much weight to give it. This is a transparency commitment, not a disclaimer — we want you to use AI insights effectively, and that means knowing when to trust them and when to verify.",
          },
          {
            heading: "The Four Confidence Levels",
            body: "**🟢 High Confidence**\nBased on complete, recent, directly connected data. The AI has everything it needs to answer accurately.\n- Data: 100% from your connected sources, synced within 6 hours\n- Calculation: deterministic or near-deterministic\n- Recommendation: act on this with normal business judgement\n\n**🟡 Medium Confidence**\nBased on partial data, data older than 30 days, or requiring inference across sources.\n- Data: present but incomplete, or slightly stale\n- Calculation: involves some estimation or interpolation\n- Recommendation: directionally reliable — verify key figures before major decisions\n\n**🔴 Low Confidence**\nLimited relevant data available. The AI is doing its best with what exists.\n- Data: sparse, old, or indirectly relevant\n- Calculation: significant inference or assumption required\n- Recommendation: treat as a starting point for investigation, not a conclusion\n\n**〜 Estimate**\nNo directly relevant data available. The AI is using sector benchmarks, industry averages, or general inference.\n- Data: not from your connected sources\n- Calculation: based on external benchmarks\n- Recommendation: explicitly label as an estimate if sharing externally. Do not use as a basis for significant financial decisions without independent verification.",
          },
          {
            heading: "How Confidence Is Calculated",
            body: "Confidence is determined by four factors, each weighted:\n\n- **Data completeness (40%)** — what percentage of the data needed to answer exists in your connected sources\n- **Data recency (30%)** — how recently the relevant data was synced\n- **Source directness (20%)** — whether the data comes directly from the relevant platform or is inferred from another source\n- **Question specificity (10%)** — whether the question is narrow enough that the available data is sufficient to answer it precisely\n\nThese four scores are combined into the final confidence level. The thresholds:\n- 85–100: High\n- 60–84: Medium\n- 35–59: Low\n- Below 35: Estimate",
          },
          {
            heading: "Improving Your Confidence Levels",
            body: "The fastest ways to raise confidence across your answers:\n- **Connect more data sources** — each additional connector raises completeness scores across related questions\n- **Sync more frequently** — Business plan users get real-time syncs; Growth users get 6-hour syncs. Stale data is the most common cause of Medium confidence.\n- **Ask more specific questions** — narrow questions can be answered with less data than broad ones\n- **Connect accounting software** — QuickBooks or Xero dramatically improves confidence on any financial question",
          },
        ],
        related: ["ai-accuracy-and-errors", "how-answers-are-generated", "flagging-incorrect-answers"],
        metrics: [
          { label: "High confidence answers", value: "71%", trend: "up", note: "Of all queries answered, April 2026" },
          { label: "Medium confidence answers", value: "21%", trend: "stable" },
          { label: "Low confidence / Estimate", value: "8%", trend: "down" },
        ],
      },
      {
        slug: "ai-accuracy-and-errors",
        title: "AI Accuracy & Known Error Types",
        description: "What AskBiz's AI accuracy rates are across different question categories, the most common error types, what causes them, and how we track and reduce them.",
        sectionSlug: "accuracy-and-errors",
        sectionTitle: "Accuracy & Errors",
        readTime: 6,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz ai accuracy", "ai error types business", "business intelligence ai errors", "ai hallucination rate"],
        content: [
          {
            heading: "Our Accuracy Commitment",
            body: "We publish accuracy metrics because transparency about AI limitations is more useful than projecting false confidence. These numbers are measured against our internal benchmark suite — a set of test queries with known correct answers, run against each new model version before deployment.\n\nOur benchmark covers four question categories:\n- **Calculation questions** — precise arithmetic on your data (revenue totals, margin calculations, landed costs)\n- **Pattern questions** — identifying trends, anomalies, and comparisons\n- **Factual questions** — explaining business concepts, regulatory frameworks, definitions\n- **Recommendation questions** — strategic suggestions based on data analysis",
          },
          {
            heading: "Accuracy by Category",
            body: "**Calculation questions: 98.2% accuracy**\nMath on your data is where AI is most reliable. Given complete, correctly formatted data, arithmetic errors are rare. The 1.8% error rate is almost entirely caused by ambiguous date ranges or currency conversion edge cases.\n\n**Pattern questions: 94.7% accuracy**\nTrend identification, anomaly detection, and comparisons are highly reliable. Errors typically occur when seasonal patterns are misidentified, or when very short time series are compared.\n\n**Factual questions: 91.3% accuracy**\nBusiness concept explanations, regulatory summaries, and methodology explanations are generally accurate. Error rates increase for jurisdiction-specific regulatory questions (where rules change frequently) and for niche sector-specific knowledge.\n\n**Recommendation questions: 87.6% accuracy**\nStrategic recommendations are the most variable category. 'Accuracy' here means alignment with what an experienced business analyst would recommend given the same data — assessed by our internal review team on a sample basis. Errors are typically overly conservative recommendations or failure to weight a key data signal appropriately.",
          },
          {
            heading: "Common Error Types",
            body: "**Hallucination (fabrication):** The AI states something as fact that is not in your data or Llama's training. Rate: approximately 1.2% of responses. Most common in: factual questions about specific regulations or market data not in our training set.\n\n**Data misinterpretation:** The AI reads your data correctly but draws an incorrect conclusion. Rate: approximately 2.8% of responses. Most common in: seasonal pattern analysis on short time series.\n\n**Overconfidence:** The AI gives a High confidence answer that should be Medium or Low, because it did not correctly identify gaps in the data. Rate: approximately 3.1% of responses. We are actively working to reduce this.\n\n**Under-specificity:** The AI gives a correct but vague answer when a more specific one was possible. Rate: approximately 4.2% of responses. Most common in: recommendation questions where the data supports a clear recommendation but the AI hedges unnecessarily.\n\n**Currency/unit errors:** Confusion between currencies, units of measure, or time zones. Rate: approximately 0.9% of responses. Mitigated by always specifying your home currency and timezone in account settings.",
          },
          {
            heading: "How We Measure and Improve Accuracy",
            body: "Accuracy is measured through three mechanisms:\n\n**Automated benchmarking:** Every model update is tested against our benchmark suite of 2,400+ test queries before deployment. A model update is rejected if accuracy drops more than 0.5% in any category.\n\n**User feedback loop:** Every thumbs-down on an AI response creates a flagged example that our team reviews. High-volume error patterns are used to improve our system prompting and, where appropriate, fed back to Groq.\n\n**Quarterly manual audit:** Our team manually reviews a random sample of 200 AI responses per quarter, graded against expert business analyst standards. Results are published in this Transparency Centre.",
          },
        ],
        related: ["confidence-indicators-explained", "flagging-incorrect-answers", "how-we-improve-the-ai"],
        metrics: [
          { label: "Calculation accuracy", value: "98.2%", trend: "up" },
          { label: "Pattern accuracy", value: "94.7%", trend: "up" },
          { label: "Factual accuracy", value: "91.3%", trend: "stable" },
          { label: "Recommendation accuracy", value: "87.6%", trend: "up" },
          { label: "Overall hallucination rate", value: "1.2%", trend: "down" },
        ],
      },
      {
        slug: "flagging-incorrect-answers",
        title: "How to Flag an Incorrect Answer",
        description: "How to report an AI answer you believe is wrong, what happens after you flag it, and how your flags improve AskBiz for everyone.",
        sectionSlug: "accuracy-and-errors",
        sectionTitle: "Accuracy & Errors",
        readTime: 3,
        lastUpdated: "2026-04-01",
        keywords: ["flag wrong answer askbiz", "report ai error", "incorrect ai response"],
        content: [
          {
            heading: "Why Flagging Matters",
            body: "Every flag you submit makes AskBiz more accurate — not just for you, but for all users. Your flags are the primary signal we use to identify systematic errors in the AI's reasoning. An AI that never receives feedback cannot improve. We take every flag seriously, review them individually, and act on patterns.",
          },
          {
            heading: "How to Flag an Answer",
            body: "**In the chat interface:**\n1. Find the response you believe is incorrect\n2. Click the thumbs-down icon (👎) below the response\n3. A feedback panel opens — select the error type:\n   - **Wrong number** — the calculation or figure is incorrect\n   - **Wrong interpretation** — the data is correct but the conclusion is wrong\n   - **Outdated information** — the answer references something that has changed\n   - **Hallucination** — the AI stated something as fact that isn't true\n   - **Missing context** — the answer is incomplete in a way that could mislead\n   - **Other** — anything else\n4. Add a note explaining what the correct answer should be (optional but very helpful)\n5. Submit — your flag is logged immediately\n\n**Via email:**\nFor complex issues or answers that caused a significant business decision error, email support@askbiz.co with:\n- The exact question you asked\n- The answer you received\n- What the correct answer should be and why\n- Any supporting data",
          },
          {
            heading: "What Happens After You Flag",
            body: "**Within 24 hours:** Your flag is reviewed by a member of our team. We check the answer against your data to confirm whether it was genuinely incorrect.\n\n**Within 5 business days:** If the error is confirmed, we:\n- Update our system prompting to prevent the same error type\n- Add the example to our benchmark test suite so future model updates are tested against it\n- Notify you that the issue has been addressed (if you provided contact details)\n\n**Monthly:** Error patterns from flags are analysed. High-frequency error types are escalated to model-level improvements and, where relevant, reported to Groq.\n\nYou will not be penalised, deprioritised, or treated differently for submitting flags — we actively encourage them.",
          },
        ],
        related: ["ai-accuracy-and-errors", "how-we-improve-the-ai", "confidence-indicators-explained"],
      },
    ],
  },
  {
    slug: "methodology",
    title: "Our Methodology",
    description: "How AskBiz's core intelligence features work under the hood — Business Pulse scoring, anomaly detection, churn prediction, and export market scoring.",
    icon: "📐",
    lastUpdated: "2026-04-01",
    articles: [
      {
        slug: "business-pulse-methodology",
        title: "Business Pulse Score — Methodology",
        description: "How the Business Pulse 0–100 score is calculated. The five dimensions, their weights, how each dimension is scored, and the statistical model behind the composite score.",
        sectionSlug: "methodology",
        sectionTitle: "Our Methodology",
        readTime: 7,
        lastUpdated: "2026-04-01",
        keywords: ["business pulse score methodology", "how is business pulse calculated", "askbiz score formula"],
        content: [
          {
            heading: "Overview",
            body: "The Business Pulse score is a single 0–100 number summarising your business health. It is a weighted composite across five dimensions, each scored 0–100 independently. The composite is not a simple average — dimensions are weighted differently, and each dimension uses a normalised scoring model that accounts for your business type, sector, and historical baseline.",
          },
          {
            heading: "The Five Dimensions",
            body: "**1. Revenue Health (25% weight)**\nMeasures: revenue trend direction, consistency, and seasonality-adjusted growth rate.\n\nScoring model:\n- Trend direction: positive trend = base score boost; negative trend = base score penalty\n- Consistency: standard deviation of weekly revenue over 90 days (lower volatility = higher score)\n- Seasonality adjustment: your revenue is compared against the same period last year, not simply against the previous period. A Christmas retailer with declining November revenue is not penalised if November is historically their slow month.\n- Growth rate: compared against sector-specific benchmarks for your business type\n\n**2. Cash Flow Health (25% weight)**\nMeasures: runway, burn rate, and receivables velocity. Requires accounting software (QuickBooks/Xero) for full scoring. Without it, this dimension is estimated from payment processing data.\n\nScoring model:\n- Cash runway: days of operating expenses covered by current cash position\n- AR aging: weighted average days outstanding for unpaid invoices\n- Burn rate trend: is operating expenditure increasing or decreasing relative to revenue?\n\n**3. Customer Health (20% weight)**\nMeasures: retention rate, churn risk distribution, and lifetime value trends.\n\nScoring model:\n- Repeat purchase rate over 90 days\n- Churn risk score distribution (proportion of customer base in each risk band)\n- Average LTV trend (increasing, stable, or declining)\n\n**4. Operational Health (20% weight)**\nMeasures: refund rate, fulfilment reliability, and supplier performance.\n\nScoring model:\n- Refund rate as % of orders (benchmarked against sector average)\n- Fulfilment speed consistency (standard deviation of delivery time)\n- Supplier Scorecard average (if suppliers are tracked)\n\n**5. Market Signals (10% weight)**\nMeasures: external signals relevant to your business — social commerce demand, export market conditions, FX risk exposure.\n\nScoring model:\n- Social commerce demand signal strength in your product category\n- FX risk exposure vs your revenue currency mix\n- Export market health for your active markets",
          },
          {
            heading: "Normalisation and Baseline",
            body: "Each dimension is scored relative to your own historical baseline, not against other businesses. A business with £500k annual revenue is not compared against one with £5m — they are each measured against their own 90-day rolling baseline.\n\nSector benchmarks are applied as a secondary adjustment — if your refund rate is 8% but the sector average is 12%, your Operational Health score is boosted relative to what it would be without sector context.\n\nSector benchmarks are sourced from:\n- Shopify's published commerce data (publicly available)\n- Our own anonymised aggregate data across AskBiz users (no individual data is used — only aggregate distributions)\n- Third-party industry reports (Statista, IBISWorld, Retail Economics)",
          },
          {
            heading: "Score Update Frequency",
            body: "- **Free plan:** Daily update at midnight UTC\n- **Growth plan:** Every 6 hours\n- **Business plan:** Real-time — score updates within 60 seconds of a data sync event\n\nThe score displayed always reflects the most recent calculation. Historical scores are stored and accessible for the previous 90 days (Growth) or 365 days (Business).",
          },
          {
            heading: "Limitations of the Model",
            body: "The Business Pulse model has known limitations we disclose openly:\n\n- **New businesses:** The model requires at least 30 days of data for meaningful scoring. Scores in the first 30 days are marked as provisional.\n- **Highly seasonal businesses:** The seasonality adjustment improves score accuracy but may lag for businesses with unusual seasonal profiles. Retailers launching in a new market may see temporarily low scores until the model builds a baseline.\n- **Single data source:** Connecting only one source limits the model. A business with only Shopify connected will have an incomplete Cash Flow dimension. Connect accounting software for the most accurate score.\n- **B2B businesses:** The Customer Health model is calibrated for B2C purchase frequency. B2B businesses with long contract cycles may see lower Customer Health scores than their actual business health warrants. Set your business type to B2B in Account Settings to apply B2B-calibrated thresholds.",
          },
        ],
        related: ["anomaly-detection-methodology", "churn-prediction-methodology"],
        metrics: [
          { label: "Model version", value: "Pulse v3.2", note: "Deployed January 2026" },
          { label: "Backtesting accuracy", value: "89%", note: "Score correctly predicted directional business health change 30 days later" },
          { label: "Minimum data required", value: "30 days", note: "For provisional scoring" },
        ],
      },
      {
        slug: "anomaly-detection-methodology",
        title: "Anomaly Detection — Methodology",
        description: "How AskBiz detects anomalies in your business data. The statistical model, thresholds, seasonality handling, and why certain events trigger alerts.",
        sectionSlug: "methodology",
        sectionTitle: "Our Methodology",
        readTime: 5,
        lastUpdated: "2026-04-01",
        keywords: ["anomaly detection methodology", "how askbiz detects anomalies", "business alert algorithm"],
        content: [
          {
            heading: "The Core Model",
            body: "AskBiz uses a **seasonal decomposition** approach to anomaly detection. Instead of a simple threshold ('alert if revenue drops 20%'), we model the expected value of each metric on each specific day, accounting for:\n- Day-of-week patterns (Tuesday is typically different from Saturday)\n- Week-of-month patterns (first week of month often differs from last)\n- Seasonal patterns (December differs from June)\n- Recent trend (if revenue has been growing 10% week-on-week, the expected value this week is 10% higher than last week)\n\nAn anomaly is flagged when a metric deviates more than **2 standard deviations** from its expected value under this model.",
          },
          {
            heading: "Why 2 Standard Deviations?",
            body: "Two standard deviations is a well-established statistical threshold. Under a normal distribution, approximately 95.4% of values fall within 2 standard deviations of the mean. Values outside this range occur by chance roughly 4.6% of the time.\n\nIn practice, this means: for a business tracking 10 daily metrics, you'd expect roughly one anomaly alert every 2–3 days by pure chance — without any genuine business problem. To reduce false positive rates, we apply a secondary confirmation filter: an anomaly must persist for at least 2 consecutive measurement periods before triggering an alert (except for critical metrics like cash position, which alert immediately).",
          },
          {
            heading: "Building the Baseline",
            body: "The anomaly detection model requires a **minimum of 14 days of data** to build a reliable baseline. For the first 14 days after connecting a data source, anomaly detection is in 'learning mode' — it observes but does not alert.\n\nWith 30+ days of data, seasonal patterns begin to emerge. With 90+ days, the model becomes significantly more accurate — it can distinguish 'low Sunday sales' (expected) from 'abnormally low Sunday sales' (potential anomaly).\n\nThis is why connecting a data source immediately and letting it sync for several months — even before you actively use AskBiz — pays dividends later.",
          },
          {
            heading: "Alert Sensitivity Settings",
            body: "You can adjust sensitivity in Intelligence → Alerts → Settings:\n\n**High sensitivity (1.5 standard deviations):** More alerts. Catches smaller deviations. Higher false positive rate. Recommended for: high-stakes periods (peak season, product launch, new market entry) where you want maximum visibility.\n\n**Medium sensitivity (2 standard deviations, default):** Balanced. Catches genuine anomalies with manageable false positive rate. Recommended for: normal business operation.\n\n**Low sensitivity (2.5 standard deviations):** Fewer alerts. Only significant anomalies surface. Lower false positive rate but may miss early warning signs. Recommended for: stable, predictable businesses or periods when you want to reduce notification noise.",
          },
        ],
        related: ["business-pulse-methodology", "churn-prediction-methodology"],
      },
      {
        slug: "churn-prediction-methodology",
        title: "Churn Prediction — Methodology",
        description: "How AskBiz's Churn Intelligence model identifies at-risk customers. The RFM model, machine learning approach, score calculation, and known limitations.",
        sectionSlug: "methodology",
        sectionTitle: "Our Methodology",
        readTime: 5,
        lastUpdated: "2026-04-01",
        keywords: ["churn prediction methodology", "how askbiz predicts churn", "rfm model business intelligence"],
        content: [
          {
            heading: "The RFM Foundation",
            body: "AskBiz's churn model is built on **RFM analysis** — a well-established customer analytics framework that scores customers on three dimensions:\n\n- **Recency (R):** How recently did this customer purchase?\n- **Frequency (F):** How often do they purchase?\n- **Monetary (M):** How much do they spend?\n\nRFM alone is a strong predictor of churn — customers who used to buy frequently but haven't recently are high churn risk. But AskBiz extends the basic RFM model with additional signals.",
          },
          {
            heading: "Extended Signals",
            body: "Beyond RFM, the churn model incorporates:\n\n- **Frequency trend:** Is purchase frequency increasing, stable, or declining over the past 90 days? A declining frequency trend is a stronger churn signal than low frequency alone.\n- **Category breadth:** Is the customer buying from multiple product categories, or narrowing to fewer? Narrowing breadth often precedes churn.\n- **Average order value trend:** Is their spend per order increasing or decreasing?\n- **Support interactions:** Has the customer had issues recently? (Where support data is available)\n- **Cohort comparison:** How does this customer's pattern compare to similar customers (same acquisition channel, same first product) who have previously churned?\n\nThe cohort comparison is the most powerful signal — it allows the model to identify churn patterns before they are obvious in the individual customer's metrics alone.",
          },
          {
            heading: "The Churn Score",
            body: "Each customer receives a churn risk score from 0–100:\n- **0–40:** Low risk. Normal retention activity recommended.\n- **41–70:** Medium risk. Watch and consider proactive outreach.\n- **71–85:** High risk. Prioritised for win-back campaigns.\n- **86–100:** Critical risk. Immediate action recommended.\n\nScores are recalculated monthly (Growth plan) or on-demand (Business plan). The model is calibrated so that customers scoring above 70 churn at approximately 3x the rate of customers scoring below 40, based on our backtesting.",
          },
          {
            heading: "Data Requirements and Limitations",
            body: "The churn model requires:\n- At least **3 months** of customer order history\n- A consistent customer identifier (customer ID or hashed email)\n- At least **50 unique customers** with repeat purchase history\n\nKnown limitations:\n- **B2B businesses:** Long contract cycles make RFM signals less relevant. Set business type to B2B for calibrated thresholds.\n- **Gift purchasers:** Customers who buy gifts may appear to churn but simply don't have a personal repeat purchase pattern. The model cannot distinguish gift buyers from regular customers without explicit tagging.\n- **New customers:** Customers with fewer than 2 purchases cannot be reliably scored. The model marks them as 'insufficient data'.\n- **External causes:** The model predicts churn based on behavioural signals but cannot account for external causes (customer relocation, business closure, competitor win). These will only appear in the data after the fact.",
          },
        ],
        related: ["business-pulse-methodology", "anomaly-detection-methodology"],
      },
    ],
  },
  {
    slug: "open-data",
    title: "Open Data & Transparency Reports",
    description: "Data we publish openly about how AskBiz operates — accuracy metrics, enforcement statistics, law enforcement requests, AI model versions, and improvement logs.",
    icon: "📊",
    lastUpdated: "2026-04-01",
    articles: [
      {
        slug: "accuracy-metrics-report",
        title: "Accuracy Metrics — Live Report",
        description: "Current AI accuracy rates across all question categories, confidence level distribution, flagging rates, and quarter-on-quarter improvement trends.",
        sectionSlug: "open-data",
        sectionTitle: "Open Data & Transparency Reports",
        readTime: 4,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz accuracy report", "ai accuracy metrics", "business intelligence ai performance"],
        content: [
          {
            heading: "Q1 2026 Accuracy Summary",
            body: "These figures are measured against our internal benchmark suite of 2,400+ test queries, updated quarterly. They reflect performance of the currently deployed model version.\n\n**By question category:**\n- Calculation questions: 98.2% (↑ from 97.8% in Q4 2025)\n- Pattern questions: 94.7% (↑ from 93.1% in Q4 2025)\n- Factual questions: 91.3% (→ stable from Q4 2025)\n- Recommendation questions: 87.6% (↑ from 85.2% in Q4 2025)\n\n**Error type distribution:**\n- Hallucination/fabrication: 1.2% of responses\n- Data misinterpretation: 2.8% of responses\n- Overconfidence: 3.1% of responses\n- Under-specificity: 4.2% of responses\n- Currency/unit errors: 0.9% of responses\n\n**Confidence level distribution (all queries, April 2026):**\n- High confidence: 71%\n- Medium confidence: 21%\n- Low confidence: 6%\n- Estimate: 2%",
          },
          {
            heading: "User-Flagged Errors",
            body: "**Q1 2026 flagging summary:**\n- Total flags received: 847\n- Confirmed errors: 312 (36.8%)\n- Not confirmed (correct answer): 398 (47.0%)\n- Ambiguous / additional context needed: 137 (16.2%)\n\n**Most common confirmed error types flagged by users:**\n1. Incorrect date range interpretation (23% of confirmed errors)\n2. Incorrect currency conversion (18%)\n3. Seasonality misattribution (15%)\n4. Missing data source not flagged (14%)\n5. Regulatory information outdated (11%)\n6. Other / miscellaneous (19%)\n\n**Actions taken:**\n- System prompt updates addressing top error types: 6\n- New benchmark test cases added: 89\n- Escalated to Groq for model-level review: 3",
          },
          {
            heading: "Improvement Trend",
            body: "Overall accuracy has improved consistently since launch:\n\n- Q1 2025 (launch): 84.2% overall accuracy\n- Q2 2025: 86.7%\n- Q3 2025: 88.4%\n- Q4 2025: 90.1%\n- Q1 2026: 93.0% (weighted average across all categories)\n\nThe most significant single improvement was the deployment of our custom financial domain fine-tuning layer in Q3 2025, which reduced currency and calculation errors by 34%.",
          },
        ],
        related: ["ai-accuracy-and-errors", "how-we-improve-the-ai", "flagging-incorrect-answers"],
        metrics: [
          { label: "Overall accuracy (Q1 2026)", value: "93.0%", trend: "up" },
          { label: "Flags received Q1 2026", value: "847", trend: "stable" },
          { label: "Confirmed error rate from flags", value: "36.8%", trend: "down" },
          { label: "Benchmark test cases", value: "2,400+", trend: "up" },
        ],
      },
      {
        slug: "enforcement-transparency-report",
        title: "Enforcement Transparency Report",
        description: "Statistics on AskBiz policy enforcement actions — warnings, suspensions, terminations, and appeals — published quarterly for accountability.",
        sectionSlug: "open-data",
        sectionTitle: "Open Data & Transparency Reports",
        readTime: 3,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz enforcement report", "policy enforcement statistics", "account suspension statistics"],
        content: [
          {
            heading: "Q1 2026 Enforcement Summary",
            body: "AskBiz publishes enforcement statistics quarterly as part of our commitment to operational transparency.\n\n**Enforcement actions taken, Q1 2026:**\n- Warnings issued: 23\n- Feature restrictions: 7\n- Account suspensions: 4\n- Account terminations: 2\n- Legal referrals: 0\n\n**Most common policy violation categories:**\n1. Acceptable use — AI misuse attempts: 14 cases\n2. Platform integrity — API abuse / rate limit circumvention: 9 cases\n3. Account sharing: 6 cases\n4. Data protection violations: 4 cases\n5. Commercial use restrictions: 3 cases\n\n**Appeals filed:** 3\n**Appeals upheld (full reversal):** 1\n**Appeals upheld (partial):** 1\n**Appeals dismissed:** 1",
          },
          {
            heading: "Law Enforcement Requests",
            body: "**Q1 2026 law enforcement summary:**\n- Requests received: 2\n- Requests complied with (full): 1\n- Requests complied with (partial): 0\n- Requests rejected (insufficient legal basis): 1\n- Users notified: 1 (1 subject to non-disclosure order)\n- Data preservation requests: 0\n\nAll requests came from UK law enforcement. No requests from US, EU, or other jurisdictions in Q1 2026.\n\nThis information is published in accordance with our Transparency Reporting policy and the canary statement in that policy.",
          },
        ],
        related: ["how-we-handle-safety-incidents", "law-enforcement-requests"],
      },
      {
        slug: "ai-changelog",
        title: "AI Model & System Changelog",
        description: "A running log of all significant changes to AskBiz's AI model, system prompting, confidence scoring, and business intelligence methodology.",
        sectionSlug: "open-data",
        sectionTitle: "Open Data & Transparency Reports",
        readTime: 4,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz ai changelog", "model update history", "ai system changes"],
        content: [
          {
            heading: "About This Changelog",
            body: "We publish a log of all significant changes to AskBiz's AI system. 'Significant' means any change that could affect the answers you receive, the confidence levels shown, or the behaviour of Business Tools. Minor infrastructure changes and security patches are not logged here.",
          },
          {
            heading: "2026",
            body: "**April 2026 — Pulse v3.2 deployed**\nUpdated Business Pulse scoring model. Changes: B2B customer health thresholds recalibrated (addresses known limitation for B2B businesses). Seasonal decomposition window extended from 90 to 180 days for businesses with sufficient history. No change to dimension weights.\n\n**March 2026 — Churn model v2.1**\nChurn prediction model updated. Changes: cohort comparison signal weight increased from 15% to 22%. Category breadth signal added. Backtesting accuracy improved from 81% to 89%.\n\n**February 2026 — Llama model update**\nUpgraded from Llama 3.3 70B (Feb 2025 version) to Llama 3.3 70B (Jan 2026 version) via Groq. Benchmark results: calculation accuracy +0.4%, factual accuracy +1.2%, hallucination rate -0.3%. Recommendation accuracy unchanged.\n\n**January 2026 — Confidence scoring v2**\nConfidence scoring model updated. Changes: source directness weighting added as a fourth factor. Previously confidence was calculated from completeness, recency, and specificity only. This change primarily affects answers that use inferred data from secondary sources — these now more accurately receive Medium rather than High confidence.",
          },
          {
            heading: "2025",
            body: "**Q3 2025 — Financial domain fine-tuning layer**\nDeployed custom post-processing layer for financial calculations. Reduces currency conversion errors by 34%, date range interpretation errors by 28%. This layer sits between Llama's output and AskBiz's response delivery — it validates numerical outputs against your source data before delivering the answer.\n\n**Q2 2025 — Anomaly detection v2**\nMigrated anomaly detection from simple threshold model to seasonal decomposition model. False positive rate reduced by 61%. Alert accuracy improved significantly for businesses with strong seasonal patterns.\n\n**Q1 2025 — Launch**\nInitial deployment. Llama 3.3 70B (via Groq, Dec 2024 version). Business Pulse v1.0. Basic anomaly detection. Churn model v1.0.",
          },
        ],
        related: ["ai-model-and-provider", "ai-accuracy-and-errors"],
      },
    ],
  },
  {
    slug: "improvement-loop",
    title: "How We Improve the AI",
    description: "How user feedback, flags, and usage patterns drive continuous improvement to AskBiz's AI — the feedback loop, what we do with flags, and how we test improvements before deploying them.",
    icon: "🔄",
    lastUpdated: "2026-04-01",
    articles: [
      {
        slug: "how-we-improve-the-ai",
        title: "The Improvement Loop",
        description: "How AskBiz continuously improves AI accuracy through user feedback, automated benchmarking, and structured review cycles — and what role you play in making it better.",
        sectionSlug: "improvement-loop",
        sectionTitle: "How We Improve the AI",
        readTime: 5,
        lastUpdated: "2026-04-01",
        keywords: ["how askbiz improves ai", "ai feedback loop", "ai improvement process", "user feedback ai"],
        content: [
          {
            heading: "The Four-Stage Improvement Loop",
            body: "AskBiz operates a continuous improvement loop across four stages:\n\n**Stage 1 — Signal collection**\nWe collect three types of signals:\n- **Explicit flags** — thumbs-down feedback from users with error type and notes\n- **Implicit signals** — when a user immediately asks the same question again after receiving an answer, this suggests the first answer was unsatisfactory\n- **Confidence discrepancy signals** — when an answer marked High confidence is subsequently corrected by user data, we log this as a potential overconfidence case\n\n**Stage 2 — Pattern analysis**\nSignals are aggregated weekly. Our team looks for patterns:\n- Which question types generate the most flags?\n- Are errors clustered around specific data source types?\n- Are there systematic biases (e.g. always under-estimating a particular metric)?\n- Are errors increasing or decreasing after model updates?\n\n**Stage 3 — Intervention design**\nBased on patterns, we design improvements:\n- **System prompt updates** — adjusting the instructions Llama receives for specific question types\n- **Data retrieval changes** — improving which data is pulled for particular query patterns\n- **Confidence threshold adjustments** — recalibrating when High/Medium/Low confidence is assigned\n- **Benchmark additions** — adding new test cases based on error patterns\n- **Model-level feedback** — for systematic errors that appear to be model-level issues, we report to Groq\n\n**Stage 4 — Testing and deployment**\nEvery change is tested against our full benchmark suite before deployment. A change is only deployed if it improves accuracy on the targeted error type without degrading accuracy on any other category by more than 0.2%.",
          },
          {
            heading: "Your Role in the Loop",
            body: "Every flag you submit directly enters Stage 1 of the improvement loop. Flags are not just logged and ignored — they are the primary driver of Stage 2 pattern analysis.\n\nThe most impactful flags include:\n- A clear description of why the answer was wrong\n- The correct answer (or what the correct answer should look like)\n- The data source the correct answer should have come from\n\nWe don't require all three — even a bare thumbs-down helps us identify that an answer was unsatisfactory. But the more detail you provide, the faster we can identify and fix the underlying issue.",
          },
          {
            heading: "What We Do Not Do",
            body: "To be explicit about the limits of our improvement process:\n\n- We do **not** use your individual business data to train AI models\n- We do **not** share your specific flagged examples with other users\n- We do **not** use the content of your questions to build user profiles\n- We do **not** deploy model changes without benchmark testing\n- We do **not** make improvement claims we have not measured\n\nAll improvement claims in this Transparency Centre are based on measured benchmark results, not subjective assessment.",
          },
          {
            heading: "Timelines",
            body: "- **System prompt updates:** deployed within 5–10 business days of identifying a pattern\n- **Confidence threshold adjustments:** deployed monthly as part of scheduled updates\n- **Data retrieval improvements:** deployed within 2–4 weeks of identifying the issue\n- **Model-level improvements:** depend on Groq's and Meta's release cycle — typically 4–12 weeks after reporting\n- **Methodology updates** (Business Pulse, anomaly detection, churn): quarterly, with 7-day advance notice to users",
          },
        ],
        related: ["flagging-incorrect-answers", "ai-accuracy-and-errors", "ai-changelog"],
      },
      {
        slug: "user-research-and-experiments",
        title: "User Research & Experiments",
        description: "How AskBiz conducts product research and experiments — what we test, how we select participants, what data we use, and your right to opt out.",
        sectionSlug: "improvement-loop",
        sectionTitle: "How We Improve the AI",
        readTime: 4,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz user research", "product experiments opt out", "ab testing business ai"],
        content: [
          {
            heading: "Why We Run Experiments",
            body: "AskBiz continuously experiments with improvements to the AI, interface, and business tools. Without controlled experiments, we cannot reliably distinguish genuine improvements from changes that happen to coincide with external factors. Experiments let us measure impact accurately before rolling out changes to all users.",
          },
          {
            heading: "What We Experiment On",
            body: "Current active experiment areas:\n- **Confidence indicator presentation** — testing different ways of displaying confidence levels to help users calibrate trust effectively\n- **Answer format** — testing whether structured formats (tables, bullet points) or prose answers produce better outcomes for different question types\n- **Proactive suggestions** — testing whether surfacing related questions improves user outcomes\n- **Daily Brief format** — testing different structures for the morning brief to identify which formats lead to most user action\n\nWe do not experiment on:\n- Core AI accuracy (all users get the best available model)\n- Pricing or plan features (no differential pricing experiments)\n- Data handling or privacy settings",
          },
          {
            heading: "How Participants Are Selected",
            body: "Experiment participants are selected randomly from the eligible user population for a given experiment. Eligibility criteria vary by experiment — for example, a Daily Brief format experiment only runs on users who have the Daily Brief enabled.\n\nYou may be in an experiment without knowing it. Where an experiment involves a meaningful change to your experience (not just minor UI differences), we display an experiment indicator in the relevant interface section.",
          },
          {
            heading: "Opting Out",
            body: "You can opt out of all product experiments at any time:\n1. Go to **Account Settings → Privacy → Product Experiments**\n2. Toggle off **Participate in product experiments**\n\nOpting out means you will always receive the current standard version of AskBiz without experimental variations. It does not affect your AI answer quality, data processing, or any other aspect of the service.\n\nOpting out also disables PostHog session analytics collection from your account.",
          },
        ],
        related: ["how-we-improve-the-ai", "ai-changelog", "responsible-ai-use"],
      },
    ],
  },
  {
    slug: "regulatory-transparency",
    title: "Regulatory & Legal Transparency",
    description: "Our compliance position across key regulations — EU AI Act Article 13, GDPR, UK OSA — and our commitments to users about how we operate within these frameworks.",
    icon: "🏛️",
    lastUpdated: "2026-04-01",
    articles: [
      {
        slug: "eu-ai-act-article13",
        title: "EU AI Act — Article 13 Transparency Obligations",
        description: "How AskBiz fulfils the transparency obligations of EU AI Act Article 13 for limited-risk AI systems. What we disclose, where, and how.",
        sectionSlug: "regulatory-transparency",
        sectionTitle: "Regulatory & Legal Transparency",
        readTime: 5,
        lastUpdated: "2026-04-01",
        keywords: ["eu ai act article 13", "ai transparency obligations", "limited risk ai transparency"],
        content: [
          {
            heading: "Article 13 Requirements",
            body: "Article 13 of the EU AI Act (Regulation 2024/1689) requires providers of limited-risk AI systems to ensure that users are provided with sufficient information to make informed use of the AI system. Specifically, Article 13 requires disclosure of:\n\n- The nature and purpose of the AI system\n- The provider and, where different, the deployer of the system\n- The capabilities and limitations of the AI system\n- The human oversight measures in place\n- How to exercise user rights in relation to the AI system",
          },
          {
            heading: "How AskBiz Meets Article 13",
            body: "**Nature and purpose:** AskBiz is an AI-powered business analytics tool that uses Llama (by Meta, via Groq) to generate insights from users' business data. This is disclosed on our homepage, in onboarding, and throughout the interface. AI-generated responses are always labelled as such.\n\n**Provider and deployer:** The AI model is developed by Meta and served via Groq Inc. (San Jose, CA). The deployer is AskBiz (registered in England and Wales). Both are identified in our AI Use Policy and these transparency pages.\n\n**Capabilities and limitations:** This Transparency Centre — specifically the 'How the AI Works' and 'Accuracy & Errors' sections — provides comprehensive disclosure of capabilities, accuracy rates, known error types, and limitations. This exceeds the typical disclosure standard for limited-risk AI systems.\n\n**Human oversight:** All AI outputs are recommendations requiring human review. The AI cannot execute transactions, place orders, or take autonomous actions. Our interface presents AI outputs as analysis for human decision-making, not as decisions themselves. Confidence indicators are displayed on every response.\n\n**User rights:** The 'Flagging Incorrect Answers' article and our Appeals Process (in Rules & Policies) document how users can contest AI outputs. Users can request human review of any AI-generated analysis by contacting support@askbiz.co.",
          },
          {
            heading: "Ongoing Obligations",
            body: "Article 13 is not a one-time disclosure — it requires that information remains accurate and up to date. AskBiz meets this through:\n- **AI Changelog:** updated whenever the AI model or methodology changes\n- **Accuracy Metrics Report:** updated quarterly with current performance data\n- **This Transparency Centre:** reviewed and updated at minimum quarterly\n\nWe also maintain internal documentation required by Article 26 (deployer obligations) and make this available to EU supervisory authorities on request.",
          },
        ],
        related: ["ai-model-and-provider", "ai-accuracy-and-errors", "how-we-improve-the-ai"],
      },
      {
        slug: "our-transparency-commitments",
        title: "Our Transparency Commitments",
        description: "AskBiz's commitments to users about what we will always disclose, what we will never hide, and how we hold ourselves accountable.",
        sectionSlug: "regulatory-transparency",
        sectionTitle: "Regulatory & Legal Transparency",
        readTime: 4,
        lastUpdated: "2026-04-01",
        keywords: ["askbiz transparency commitments", "ai transparency policy", "business intelligence transparency"],
        content: [
          {
            heading: "What We Always Disclose",
            body: "AskBiz commits to always disclosing:\n\n- **Which AI model we use** — model provider, model name, and version. Published in the AI Changelog and on this page.\n- **When the AI model changes** — minimum 7 days advance notice for model updates, published in the Changelog.\n- **Accuracy metrics** — updated quarterly. We will never selectively publish only good metrics.\n- **Known limitations** — documented in our methodology articles and the 'What the AI Knows and Doesn't Know' article. We expand this list as we discover new limitations.\n- **Enforcement actions** — aggregate statistics published quarterly in the Enforcement Transparency Report.\n- **Law enforcement requests** — aggregate statistics published in the Annual Transparency Report.\n- **Material changes to data handling** — 30 days advance notice for UK/EU users, per GDPR requirements.\n- **Sub-processor changes** — 30 days advance notice.",
          },
          {
            heading: "What We Will Never Hide",
            body: "Regardless of business pressure, reputational concerns, or competitive considerations, AskBiz commits to never hiding:\n\n- A confirmed data breach (we will notify within 72 hours of discovery, per GDPR)\n- A significant decline in AI accuracy (we publish actual measured numbers, not curated ones)\n- A known systematic error pattern in the AI (we will disclose in the Changelog and notify affected users)\n- A law enforcement request that results in user data disclosure (we notify users where legally permitted)\n- A material change to how we use your data (we notify before the change takes effect, not after)",
          },
          {
            heading: "How We Hold Ourselves Accountable",
            body: "These are commitments, not just aspirations. The mechanisms that hold us to them:\n\n- **Public record:** This Transparency Centre is public and indexed by search engines. Changes to commitments are visible in the page's version history.\n- **Regulatory obligations:** GDPR, EU AI Act Article 13, and UK Online Safety Act create legal obligations that overlap with many of these commitments. Breaching them is not just a trust issue — it carries regulatory consequences.\n- **User rights:** UK and EU users have legally enforceable rights to accurate information about AI systems. Any material misrepresentation here is actionable.\n- **Quarterly review:** This Transparency Centre is reviewed by our legal and product teams every quarter. The last review date is shown at the top of each article.",
          },
        ],
        related: ["eu-ai-act-article13", "how-we-handle-safety-incidents", "transparency-reporting"],
      },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getAllArticles(): TransparencyArticle[] {
  return TRANSPARENCY_SECTIONS.flatMap((s) => s.articles);
}

export function getArticleBySlug(slug: string): TransparencyArticle | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getSectionBySlug(slug: string): TransparencySection | undefined {
  return TRANSPARENCY_SECTIONS.find((s) => s.slug === slug);
}

export function getArticlesBySection(sectionSlug: string): TransparencyArticle[] {
  const section = getSectionBySlug(sectionSlug);
  return section ? section.articles : [];
}

export function searchTransparency(query: string): TransparencyArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getAllArticles().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.sectionTitle.toLowerCase().includes(q) ||
      a.content.some(
        (c) => c.heading.toLowerCase().includes(q) || c.body.toLowerCase().includes(q)
      ) ||
      (a.keywords && a.keywords.some((k) => k.toLowerCase().includes(q)))
  );
}

export const TRANSPARENCY_LAST_UPDATED = "April 2026";
export const TOTAL_ARTICLES = TRANSPARENCY_SECTIONS.reduce((n, s) => n + s.articles.length, 0);
