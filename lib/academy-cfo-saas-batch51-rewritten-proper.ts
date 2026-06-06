import { AcademyArticle } from "@/types/academy";

export const batch51Articles: AcademyArticle[] = [
  {
    slug: "demand-generation-roi",
    title: "Demand Generation ROI: Measuring and Optimizing Lead Generation Programs",
    description: "Optimize demand generation spending for maximum ROI. Track cost per qualified lead, conversion rates, and program effectiveness across channels.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "demand generation",
      "lead generation",
      "demand gen ROI",
      "CPL",
      "cost per lead",
      "lead nurturing",
      "conversion funnel",
      "demand program",
      "lead quality",
      "marketing funnel"
    ],
    keyTakeaways: [
      "Cost per qualified lead (CPL) varies 10x by channel: content/organic £50-100, paid search £150-300, events £200-500, cold outreach £100-200; focus spend on channels with lowest CPL first, then expand to higher CPL if conversion rates justify it",
      "Qualified lead = person who matches ICP (ideal customer profile), has authority/budget, and is in buying cycle; many programs confuse MQL (marketing qualified lead) with SQL (sales qualified lead), missing 30-50% of pipeline quality assessment",
      "Lead nurturing ROI: leads that are nurtured have 2x higher conversion rates (e.g., 15% vs. 8%); invest in email sequences, content, and sales follow-up to improve conversion from lead to customer"
    ],
    content: [
      {
        heading: "Demand Generation Economics",
        body: `Demand generation is the engine of sales pipeline. Without leads, there's nothing to sell.

But demand gen spending can be wasted if not measured properly.

Budget allocation example, £5M ARR SaaS:

Annual marketing budget: £2M
- Demand generation: 60% = £1.2M
- Content marketing: 20% = £400K
- Brand/awareness: 20% = £400K

Demand gen breakdown:
- Paid ads (Google, LinkedIn): £500K
- Events (conferences, webinars): £300K
- Cold outreach (sales development): £200K
- Sales tools (CRM, dialing): £100K
- Lead nurturing (email, marketing automation): £100K

Expected ROI:
- Demand gen cost: £1.2M
- Qualified leads generated: 2,400 leads
- CPL (cost per lead): £1.2M ÷ 2,400 = £500
- Conversion rate (lead to customer): 10% = 240 customers
- Cost per customer: £1.2M ÷ 240 = £5K
- Average customer value: £50K (£5M ARR ÷ 100 customers, if all from marketing)
- Demand gen ROI: (240 customers × £50K - £1.2M) ÷ £1.2M = 9x

This is the target: 9x ROI on demand gen spend.

**Measuring Lead Quality**

Not all leads are equal. A lead from a Fortune 500 company is worth more than a lead from a startup.

Define "qualified lead":
- Matches ICP (industry, company size, revenue, location)
- Has relevant job title (decision maker or influencer)
- Has stated business need/problem
- Is actively evaluating solutions (not just curious)
- Has budget allocated (or access to budget)

Example: ICP for an HR SaaS
- Industry: Technology, finance, consulting (high-growth, high-need)
- Company size: 100-500 employees
- Revenue: £10M-£100M
- Title: VP/Head of People Operations, HR Director
- Need: Optimizing people/culture, retention, scaling HR team

Lead scoring example:

| Criteria | Points | Example |
|----------|--------|---------|
| Right industry | 10 | Tech company: 10 pts |
| Right company size | 10 | 200 employees: 10 pts |
| Right title | 20 | "VP People Operations": 20 pts |
| Active buying signal | 20 | Downloaded ROI calculator: 20 pts |
| Engaged with content | 10 | Attended webinar: 10 pts |
| **Total** | **70** | **Score: 70/100** |

Score >60: Marketing qualified lead (MQL) - ready for sales
Score 30-60: Nurture (need more engagement)
Score <30: Not qualified (wrong fit)

This scoring process is critical: an MQL from good-fit company is worth 3-5x more than random lead.

**Cost Per Lead vs. Cost Per Qualified Lead**

CPL = Total marketing spend ÷ Total leads
Cost per qualified lead = Total marketing spend ÷ Total qualified leads

Example:

Paid search campaign: £10K spend
- Total leads: 50 (download whitepaper, sign up for webinar, etc.)
- CPL: £10K ÷ 50 = £200
- Qualified leads (score >60): 15
- Cost per qualified lead: £10K ÷ 15 = £667

Content marketing: £10K spend
- Total leads: 200 (blog readers who download something)
- CPL: £10K ÷ 200 = £50
- Qualified leads: 80 (many visitors are already researching, well-qualified)
- Cost per qualified lead: £10K ÷ 80 = £125

Insight: Paid search has higher CPL but lower cost per qualified lead (more intent-driven). Content has lower CPL but higher cost per qualified lead (lower quality, more tire-kickers).

Focus spend on channels with lowest cost per QUALIFIED lead, not CPL.

**Lead-to-Customer Conversion Rates**

Not all qualified leads convert to customers:

| Stage | Count | Conversion |
|-------|-------|----------|
| Marketing qualified leads (MQL) | 100 | - |
| Sales accepted leads (SAL) | 70 | 70% |
| Sales qualified leads (SQL) | 50 | 71% |
| Opportunities | 30 | 60% |
| Closed won | 12 | 40% |

MQL to customer conversion: 12 ÷ 100 = 12%

If you have 2,400 MQLs annually:
- Conversion to customer: 2,400 × 12% = 288 customers
- Cost per customer: £1.2M ÷ 288 = £4,167

If you improve MQL quality (higher lead score threshold):
- New MQL count: 1,800 (higher quality threshold, fewer leads)
- New conversion rate: 18% (higher quality, better conversion)
- New customer count: 1,800 × 18% = 324 customers
- New cost per customer: £1.2M ÷ 324 = £3,704 (lower!)

Lesson: Fewer, higher-quality leads often convert better and cost less per customer.

**Lead Nurturing ROI**

Many leads aren't ready to buy immediately. They need nurturing (education, relationship building).

Nurture impact:

Leads not nurtured:
- 8% convert to opportunity
- 2% convert to customer
- Cost per customer: £1.2M ÷ (2,400 × 2%) = £25K

Leads nurtured (email sequence, content, sales touches):
- 15% convert to opportunity
- 4% convert to customer
- Cost per customer: £1.2M ÷ (2,400 × 4%) = £12.5K (50% reduction!)

Nurturing cost (email automation, sales time): £200K annually
Net impact: Reduce cost per customer from £25K to £12.5K = £12.5K savings per customer × 288 customers = £3.6M savings
ROI on nurturing: (£3.6M savings - £200K cost) ÷ £200K = 17x

Nurturing is highly valuable. Invest in it.

**Lead Velocity and Pipeline Impact**

Lead velocity = Number of qualified leads generated per month × Average sales cycle

Example:

Qualified leads per month: 200
Sales cycle: 90 days (3 months)
Lead velocity: 200 × 3 = 600 leads in pipeline at any time

If conversion rate is 15%:
- Expected customers per quarter: 600 × 15% = 90 customers
- Revenue (at £50K ACV): 90 × £50K = £4.5M per quarter

This is how demand gen impacts revenue: more qualified leads = larger pipeline = more revenue.

If demand gen improves lead quality (conversion 15% → 18%):
- Same 600 leads in pipeline
- New customers: 600 × 18% = 108 (vs. 90)
- New revenue: 108 × £50K = £5.4M per quarter
- Incremental value: £900K per quarter = £3.6M annually

This shows the compounding value of lead quality improvements.

**Demand Gen Channel Comparison**

| Channel | Monthly spend | MQL/month | CPL | Qualified % | Cost per SQL | Conversion | Cost per customer |
|---------|-------|----------|-----|----------|----------|----------|----------|
| Paid search | £50K | 250 | £200 | 60% | £333 | 15% | £2,222 |
| Content | £30K | 400 | £75 | 40% | £188 | 12% | £1,563 |
| Events | £25K | 200 | £125 | 70% | £179 | 20% | £893 |
| LinkedIn ads | £40K | 300 | £133 | 50% | £267 | 18% | £1,481 |
| Webinars | £20K | 150 | £133 | 80% | £167 | 25% | £667 |
| Cold outreach | £15K | 100 | £150 | 90% | £167 | 20% | £833 |
| **Total** | **£180K** | **1,400** | **£129** | **60%** | **£214** | **17%** | **£1,302** |

Insights:
- Webinars have best cost per customer (£667) due to high quality + conversion
- Cold outreach also strong (£833) but limited scale
- Paid search expensive per customer (£2,222) but scales well
- Content good for volume (400 MQL/month) but lower quality

Strategy: Maximize webinar spend (best ROI), grow cold outreach (scales to £1M), maintain paid search for volume, use content for awareness.

**Demand Gen Benchmarks by Company Stage**

Early-stage SaaS (£1M ARR):
- CPL: £100-200 (lower spend, more organic)
- Lead-to-customer: 5-10% (less polished process)
- Demand gen % of budget: 30% (heavy on founders selling)

Growth-stage SaaS (£5M ARR):
- CPL: £200-400 (more competitive, higher spend)
- Lead-to-customer: 10-15% (better process, qualification)
- Demand gen % of budget: 50-60% (dedicated demand gen team)

Mature SaaS (£20M+ ARR):
- CPL: £300-600 (mature market, more competition)
- Lead-to-customer: 12-20% (highly optimized process)
- Demand gen % of budget: 40-50% (efficient, scaling)

**Optimizing Demand Gen**

Levers to improve ROI:

1. **Improve lead quality (lead scoring)**
   - Impact: Higher conversion (12% → 18%), lower cost per customer
   - Effort: Medium (data analysis, CRM configuration)
   - Timeline: 4-8 weeks

2. **Increase conversion rates (better sales follow-up, nurturing)**
   - Impact: Same leads, higher conversion (12% → 15%), lower cost per customer
   - Effort: Medium (process improvement, training)
   - Timeline: 4-12 weeks

3. **Reduce CPL (optimize paid spend, improve organic)**
   - Impact: Lower cost to generate same leads
   - Effort: High (ongoing optimization, testing)
   - Timeline: Ongoing

4. **Shift to high-ROI channels (cut low-ROI, expand high-ROI)**
   - Impact: Lower cost per customer by 20-30%
   - Effort: Medium (reallocation, testing)
   - Timeline: 8-12 weeks

Most impact: Focus on lead quality. A 20% improvement in qualification saves more than 5% CPL reduction.

Demand generation ROI is the foundation of growth. Get it right, and sales pipeline overflows. Get it wrong, and you're wasting budget.
`
      }
    ],
    relatedSlugs: [
      "marketing-roi-and-attribution",
      "sales-pipeline-health-forecasting",
      "customer-acquisition-cost-optimization",
      "marketing-efficiency-metrics",
      "lead-nurturing-conversion"
    ],
    faq: [
      {
        q: "What's a good CPL for my business?",
        a: "Depends on ACV. Rule of thumb: CPL should be <5% of ACV. For £50K ACV, target <£2,500 CPL. For £5K ACV, target <£250 CPL."
      },
      {
        q: "How do I know if a lead is qualified?",
        a: "Create ICP (ideal customer profile) with criteria: industry, company size, title, budget, use case. Score leads on these. >60/100 = qualified."
      },
      {
        q: "Should I prioritize lead volume or lead quality?",
        a: "Quality > volume. Fewer high-quality leads convert better and cost less per customer. But need minimum volume (600+ pipeline leads for 100 customers)."
      },
      {
        q: "What's the impact of lead nurturing?",
        a: "2x conversion improvement typical. Leads that are nurtured convert 15%+ vs. 8% for non-nurtured. ROI is 10x+ on nurturing spend."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "accounting-standards-revenue-recognition-asc-606",
    title: "Revenue Recognition Under ASC 606: SaaS Accounting Standards in Depth",
    description: "Master ASC 606 revenue recognition standards for SaaS. Understand performance obligations, variable consideration, and contract accounting.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "ASC 606",
      "revenue recognition",
      "GAAP",
      "accounting standards",
      "performance obligations",
      "SaaS accounting",
      "variable consideration",
      "contract modifications",
      "revenue contracts"
    ],
    keyTakeaways: [
      "ASC 606 requires revenue recognition when customer obtains control of promised good/service; for SaaS subscription, control is obtained monthly (monthly subscription service is delivered), so recognize 1/12 of contract value each month, not upfront despite upfront cash payment",
      "Variable consideration (discounts, refunds, credits) must be recognized as reduction to transaction price; if customer gets £10 discount upfront, recognize £500 revenue upfront (vs. £510) and adjust deferred revenue liability accordingly",
      "Contract modifications (upsells, downgrades mid-contract) are treated as new contracts; if customer upgrades from £50K to £60K annual, recognize (£60K - £50K) ÷ 12 = £833/month additional revenue starting upgrade month, not retroactively"
    ],
    content: [
      {
        heading: "ASC 606 Five-Step Framework",
        body: `ASC 606 (Revenue from Contracts with Customers) is the GAAP standard for recognizing revenue.

It replaces older standards (SAB Topic 13) and applies to all industries, including SaaS.

The five-step framework:

**Step 1: Identify the contract with a customer**
A contract exists when:
- Customer has commitment to pay (signed agreement or accepted terms)
- Payment terms are agreed (amount, timing)
- Contract has commercial substance (not a test, not internally related)

Example: Customer signs 1-year subscription agreement for £50K, payable upfront.
This is a valid contract.

**Step 2: Identify performance obligations**
Performance obligation = Customer's promised benefit (good/service).

For SaaS, typical obligations:
- Subscription access (monthly, yearly)
- Onboarding/implementation
- Support/maintenance
- Professional services
- Add-on modules

Example: Subscription + implementation + support
- Performance obligation 1: Subscription service (monthly over 12 months)
- Performance obligation 2: Implementation (one-time, delivered in month 1)
- Performance obligation 3: Annual support (over 12 months)

Each obligation is satisfied at different times/rates, so revenue must be split.

**Step 3: Determine transaction price**
Transaction price = Amount company expects to receive from customer.

Include:
- Base contract amount
- Variable consideration (see below)
- Non-cash consideration (if any)

Exclude:
- Sales tax (collected on behalf of customer)
- Amounts due to third parties

Example contract:
- Base amount: £50K
- Setup fee: £2K (included in transaction price)
- Variable: Customer pays an extra £1K if they hit 100 users (variable consideration, estimate using expected value = £1K × 70% probability = £700)
- Transaction price: £50K + £2K + £700 = £52.7K

This full amount is recognized over the service period.

**Step 4: Allocate transaction price to performance obligations**
If contract has multiple obligations, split revenue based on standalone selling price.

Example: Subscription (£50K standalone) + Implementation (£5K standalone) + Support (£3K standalone) = £58K total standalone value

Customer contract: £50K for all three
Allocation:
- Subscription: (£50K ÷ £58K) × £50K = £43.1K
- Implementation: (£5K ÷ £58K) × £50K = £4.3K
- Support: (£3K ÷ £58K) × £50K = £2.6K

Revenue recognition:
- Implementation: £4.3K in month 1 (delivered immediately)
- Subscription: £43.1K ÷ 12 = £3.6K monthly
- Support: £2.6K ÷ 12 = £216 monthly

Month 1 revenue: £4.3K + £3.6K + £216 = £8.1K
Months 2-12 revenue: £3.6K + £216 = £3.8K each

Full-year revenue: £8.1K + (£3.8K × 11) = £50K (matches customer contract)

**Step 5: Recognize revenue when (or as) obligation is satisfied**
Obligations satisfied:
- Over time: Subscription (delivered monthly), support (delivered over year)
- At a point in time: Implementation (one-time delivery)

Example revenue schedule:

| Month | Implementation | Subscription | Support | Total |
|-------|---|---|---|---|
| 1 | £4.3K | £3.6K | £216 | £8.1K |
| 2 | - | £3.6K | £216 | £3.8K |
| 3-12 | - | £3.6K | £216 | £3.8K |
| **Year 1** | **£4.3K** | **£43.1K** | **£2.6K** | **£50K** |

**Variable Consideration Example**

Customer contract: Base £50K + bonus £5K if customer reaches 150 users (currently at 50 users)

Question: Should the £5K be included in revenue?

ASC 606 guidance: Include variable consideration if it's "highly probable" it will not be reversed.

Analysis:
- Company estimates 60% probability customer reaches 150 users
- If included, transaction price = £55K
- If not included, transaction price = £50K

Conservative approach (most SaaS): Only include if >90% probability
- 60% probability doesn't meet >90% threshold
- Don't include in initial transaction price

Revenue recognition:
- Year 1: £50K (base only)
- If customer reaches 150 users during year: Adjust revenue upward by estimated £5K (update estimate to 90%+ probability)
- Revenue adjustment recognized in month when milestone achieved

Example:
- Month 6: Customer hits 150 users, achievement is certain
- Adjust transaction price upward: £50K → £55K
- Adjustment: £5K
- Split over remaining 6 months: £833/month (June-December)
- June revenue: Base £4,167 (£50K ÷ 12) + Adjustment £833 = £5K
- July-Dec revenue: Base £4,167 + Adjustment £833 = £5K each month

**Contract Modifications**

What happens when customer upgrades or downgrades mid-contract?

Scenario 1: Upgrade (original contract £50K, customer upgrades to £60K)
- Original contract remaining: 8 months (4 months elapsed, 8 remaining)
- Upgrade to: £60K annual = £5K monthly
- Modification treatment: New contract (separate from original)

Original contract revenue:
- Already recognized (4 months × £4.167 = £16.7K)
- Remaining: £33.3K (8 months × £4.167)

New contract revenue:
- Additional value: £5K (£60K annual - £50K annual) ÷ 12 × 8 months remaining = £3.3K
- Recognized: £3.3K over remaining 8 months

Month 5 revenue (first upgrade month):
- Original contract: £4.167K (continue as planned)
- New contract: £3.3K ÷ 8 months = £412/month
- Total: £4.167K + £412 = £4.579K

Year 1 total revenue:
- Original contract: £50K (full annual)
- Additional from upgrade: £3.3K (8 months of additional service)
- Total: £53.3K

Scenario 2: Downsell (customer reduces from £50K to £40K)
- Treatment depends on if customer committed to £50K for full year or if contract allows changes
- If customer breaches (committed to £50K but only pays £40K), recognize £40K revenue
- If contract allows downsells, treat as contract modification with variable consideration adjustment

Most SaaS: Treat downgrades as new contracts, recognize change going forward.

**Performance Obligations for Different SaaS Models**

Model 1: Pure subscription (most SaaS)
- Single obligation: Access to software over contract term
- Revenue recognized: Straight-line over contract term
- Example: £50K annual = £4.167K monthly

Model 2: Subscription + implementation
- Obligation 1: Implementation (one-time)
- Obligation 2: Subscription (over term)
- Revenue recognized: Implementation upfront, subscription straight-line
- Example: £50K total (£5K implementation + £45K subscription)
  - Month 1: £5K (implementation) + £3.75K (subscription) = £8.75K
  - Months 2-12: £3.75K (subscription only)

Model 3: Usage-based (consumption pricing)
- Obligation: Provide access + usage tracking
- Revenue recognized: Based on usage (variable consideration)
- Challenge: How much usage will occur? (estimate required)
- Example: £0.10 per API call, customer makes 1M calls annually
  - Revenue: 1M × £0.10 = £100K
  - But actual usage unknown at contract start
  - Estimate £100K, adjust if actual differs

Model 4: Tiered pricing (overages)
- Base: £50K annual
- Overage: £0.50 per additional user above 100
- Revenue: £50K base + estimated overage
- If customer expected to have 120 users: £50K + 20 × £0.50 = £50K + £10K = £60K
- Recognize over contract term

**Deferred Revenue and ASC 606**

Deferred revenue (also called "unearned revenue") is the liability on balance sheet.

Example:
- Customer pays £50K upfront on January 1
- Service delivered over 12 months

Journal entries:

Day 1:
- Debit: Cash £50K
- Credit: Deferred revenue £50K

(Deferred revenue is a liability, not revenue)

Each month (starting month 1):
- Debit: Deferred revenue £4,167
- Credit: Revenue £4,167

End of year:
- Deferred revenue: £0 (fully earned)
- Revenue: £50K (fully recognized)

On balance sheet:
- Jan 1: Deferred revenue £50K (liability)
- Jun 30: Deferred revenue £25K (liability, 6 months remaining)
- Dec 31: Deferred revenue £0 (fully earned)

Note: Cash is received upfront (£50K), but revenue is recognized monthly. This is why SaaS with upfront annual contracts have high deferred revenue balance.

**Practical ASC 606 Implementation for SaaS**

Steps to implement:
1. Document revenue recognition policy for each contract type (subscription, professional services, etc.)
2. Create revenue recognition schedule for all customer contracts
3. Set up deferred revenue tracking (monthly updates)
4. Implement contract amendment procedures (document upsells, downgrades, modifications)
5. Quarterly review (reconcile revenue to deferred revenue movement)
6. Annual audit with external auditors

Most SaaS: Use accounting software (Zuora, Stripe Billing, or similar) to automate revenue recognition.

ASC 606 is complex. For early-stage startups, many use simplified straight-line recognition. As you scale and approach audit, ensure full ASC 606 compliance. Investors and acquirers will require it.
`
      }
    ],
    relatedSlugs: [
      "gaap-vs-non-gaap-metrics",
      "financial-modeling-for-saas",
      "subscription-billing-recurring-revenue",
      "board-reporting-governance",
      "investor-updates-reporting"
    ],
    faq: [
      {
        q: "If customer pays upfront, why don't I recognize all revenue upfront?",
        a: "Because the customer hasn't received the service yet. ASC 606 requires revenue recognition when customer obtains control of the service. For subscription, that's monthly."
      },
      {
        q: "What happens if customer cancels mid-year?",
        a: "Revenue already recognized stays on P&L. Refund reduces revenue in the month issued. If customer paid £50K annual and cancels in month 6, you've recognized £25K revenue (5 months × £4.167), refund balance (£25K), and report £25K revenue for year (plus £25K refund)."
      },
      {
        q: "How do I account for discounts given upfront?",
        a: "Include discount in transaction price. If list price is £50K, you offer £5K discount upfront, transaction price is £45K. Recognize £45K over 12 months (£3.75K monthly)."
      },
      {
        q: "What's the difference between a contract modification and a new contract?",
        a: "If modification is minor/separate (like adding a module), treat as new contract. If modification is substantial (like extending term), treat as contract update. Consult accountant on judgment calls."
      }
    ],
    videoUrl: ""
  }
];

export default batch51Articles;
