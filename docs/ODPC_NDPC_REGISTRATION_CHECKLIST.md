# Kenya ODPC / Nigeria NDPC Registration — Readiness Checklist

**Prepared:** 2026-08-07. This is a checklist, not a filing — an AI assistant cannot register AskBiz with a government data-protection regulator on your behalf (it requires attesting, as the business, to facts about your own operations, and typically a company registration number / director details / payment for the filing fee). Everything below is what's needed so you (or whoever holds that authority for AskBiz) can complete it directly.

## Why this likely applies now, not "eventually"

Both registrations have a **mandatory-regardless-of-size carve-out for financial services / payment processing**, and AskBiz's own DPA (`docs/../locales/en/dpa.json` §6) already discloses M-Pesa (Safaricom Daraja) and Paystack/GoCardless/PayPal/WaafiPay as payment sub-processors. That plus ~4,000+ signups (per internal tracking) makes it likely both thresholds below are already crossed:

- **Kenya:** ODPC registration is mandatory regardless of turnover/staff count for businesses in financial services — a POS product that processes M-Pesa payments plausibly falls in that bucket. Even setting the sector question aside, AskBiz's scale likely exceeds the small-business exemption (turnover under KES 5M *and* fewer than 10 employees — both conditions must hold to be exempt).
- **Nigeria:** NDPC's "Data Controller/Processor of Major Importance" threshold is **200+ data subjects in a rolling 6-month window**, with no small-business exemption once crossed. At reported signup volume this is almost certainly already exceeded, independent of any sector question.

**Recommendation: treat both as due now**, not as a future to-do. If this is wrong for a reason specific to AskBiz's corporate structure (e.g. registered entity location, exact revenue figures), that's exactly the kind of thing worth a short call with local counsel to confirm before or instead of filing — the assessment above is directional, not a legal opinion.

---

## Kenya — Office of the Data Protection Commissioner (ODPC)

**Where:** ODPC's online registration portal (odpc.go.ke).

**You'll need to provide / decide:**
- [ ] Business registration details (certificate of incorporation, KRA PIN)
- [ ] Description of processing purposes — this document's companion, [`DPIA_MARKET_INTELLIGENCE.md`](./DPIA_MARKET_INTELLIGENCE.md), plus `dpa.json` §3–4 already describe this in the detail ODPC typically asks for (nature of processing, categories of data subjects, categories of personal data)
- [ ] Security measures summary — `dpa.json` §5 already lists these (encryption in transit, hashed staff PINs, RLS, access controls) and can likely be copied close to verbatim
- [ ] A named Data Protection Officer / contact — `dpa.json` §9 lists `dpa@askbiz.co` / `privacy@askbiz.co`; confirm someone actually monitors these before listing them on a government filing
- [ ] Fee, by size tier (self-declared, so confirm which tier actually applies before submitting):

| Tier | Turnover | Employees | Registration fee | Renewal (24mo) |
|---|---|---|---|---|
| Micro/Small | ≤ KES 5M | 1–50 | KES 4,000 | ~KES 2,000 |
| Medium | KES 5M–50M | 51–99 | KES 16,000 | ~KES 9,000 |
| Large | > KES 50M | 100+ | KES 40,000 | ~KES 25,000 |

**After registering:** the certificate lasts 24 months and must be renewed 30 days before expiry — worth a calendar reminder once the actual registration date is known.

---

## Nigeria — Nigeria Data Protection Commission (NDPC)

**Where:** NDPC's registration process for Data Controllers/Processors of Major Importance (DCPMI).

**You'll need to provide / decide:**
- [ ] Which tier AskBiz falls into — this determines both the fee and whether an annual Compliance Audit Return is required:

| Tier | Data subjects (6-mo window) | Fee | Annual audit? |
|---|---|---|---|
| Ordinary High Level | 200+ | ₦10,000 | No — renewal only |
| Extra-High Level | 1,000+ | ₦100,000 | Yes |
| Ultra-High Level | 5,000+ | ₦250,000 | Yes |

  *(One law firm's more recent GAID-specific analysis cites materially higher audit fees for the higher tiers — confirm the current fee schedule directly with NDPC before budgeting, don't rely on the table above alone.)*
- [ ] A licensed Data Protection Compliance Organisation (DPCO) if you want to outsource the audit/compliance side rather than handle it in-house — not required to register, but common
- [ ] The same processing-description material as the Kenya filing (`DPIA_MARKET_INTELLIGENCE.md`, `dpa.json`) — Nigeria's filing asks for similar substance
- [ ] Filing deadline: 31 March annually for existing entities, or within 15 months of establishment then annually for new entities — if AskBiz has been operating and processing Nigerian users' data for a while, this may already be overdue and worth prioritizing accordingly

---

## Before either filing — worth fixing first

The Kenya/Nigeria filings both ask you to describe your processing and its legal basis. Right now that description would have to disclose the issue flagged as the #1 finding in `DPIA_MARKET_INTELLIGENCE.md` §2: `market_intelligence_opt_in` defaults to `true` for new signups, which doesn't meet either country's express-consent standard for commercial use of personal data. **Deciding on that default is worth doing before either registration is filed**, not after — filing first and fixing the consent default second means the filing itself describes a processing basis that wasn't actually valid at the time you attested to it.
