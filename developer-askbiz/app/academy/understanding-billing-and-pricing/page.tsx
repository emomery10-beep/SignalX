import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/academy/understanding-billing-and-pricing`

export const metadata: Metadata = {
  title: 'Understanding AskBiz billing and pricing — AskBiz Academy',
  description: 'The wallet model in full: what’s billed per call, what’s covered by your plan quota, and the three places currency conventions genuinely differ across the platform.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Understanding AskBiz billing and pricing — AskBiz Academy',
    description: 'The wallet model, per-call pricing, and where currencies diverge — explained once, precisely.',
    url: URL,
    type: 'article',
  },
}

export default function UnderstandingBillingLesson() {
  return (
    <ArticleShell
      title="Understanding AskBiz billing and pricing"
      description="Three separate billing mechanisms live under one API — a wallet, a plan quota, and billing-on-behalf-of. Confusing them is the single most common integration mistake. This lesson explains each one precisely enough to reason about, not just react to."
      breadcrumbs={[
        { name: 'Academy', href: '/academy' },
        { name: 'Understanding billing & pricing', href: '/academy/understanding-billing-and-pricing' },
      ]}
    >
      <h2>Three mechanisms, not one</h2>
      <p>
        It&rsquo;s tempting to think of API usage as a single meter that goes up. AskBiz actually runs three
        independent mechanisms, and an integration that doesn&rsquo;t distinguish them will eventually build the
        wrong assumption into its billing logic.
      </p>
      <ul>
        <li><strong>Per-call wallet debits</strong> — only <code>POST /api/v1/scan</code> (3¢) and <code>POST /api/v1/whatsapp/send</code> (2¢) touch your wallet, and only on success.</li>
        <li><strong>Plan quota</strong> — <code>POST /api/v1/ask</code> is free but capped by your plan&rsquo;s monthly and per-minute limits; there&rsquo;s no wallet debit at all.</li>
        <li><strong>Billing-on-behalf-of</strong> — <code>POST /api/v1/charges</code> collects money from a merchant&rsquo;s customer via Stripe Checkout. That money is not charged to you, and it is not (yet) automatically paid out to you either.</li>
      </ul>
      <p>
        Get the live numbers for the first mechanism from <a href="/docs/api-reference/pricing">GET /api/v1/pricing</a> before
        you hardcode a price anywhere — it&rsquo;s public, unauthenticated, and it is the source of truth over any
        number written in prose (including this lesson).
      </p>

      <h2>Why only two endpoints are billed per call</h2>
      <p>
        Scan and WhatsApp-send are the two endpoints with a real, variable marginal cost behind every call — a
        Groq vision inference, and a Meta-billed WhatsApp message send. <code>POST /api/v1/ask</code> runs against
        a shared LLM budget that&rsquo;s cheaper to cap with a plan quota than to meter per call, which is why it&rsquo;s
        free-within-quota rather than wallet-billed. This isn&rsquo;t an arbitrary pricing choice — it tracks actual
        cost structure, and it&rsquo;s worth designing your own usage limits around the same distinction: cap the
        free endpoint by request volume, budget the paid ones by wallet balance.
      </p>

      <h2>What &ldquo;billed only on success&rdquo; actually means</h2>
      <p>
        Every 4xx and 5xx response on scan and whatsapp/send is unbilled by construction — the debit only fires
        after the underlying action actually completes (a real vision match came back, Meta confirmed the send).
        This has a direct consequence for how you should build retry logic: a failed call costs you nothing to
        retry, so the only thing an <code>Idempotency-Key</code> protects against is a <em>successful</em> call
        whose response you never received — not a failed one. Don&rsquo;t withhold retries out of fear of double
        billing on errors; the billing model already handles that case for you.
      </p>

      <h2>Where currency conventions genuinely diverge</h2>
      <p>
        This is the part worth being precise about, because assuming one unified currency across the platform is
        the most common mistake here:
      </p>
      <ul>
        <li><code>GET /api/v1/pricing</code> labels per-call prices generically in cents (<code>usd_cents</code>) — a unit, not a live FX-converted charge.</li>
        <li>Wallet top-ups are billed in GBP, in fixed £5 / £20 / £100 bundles — there is no arbitrary top-up amount.</li>
        <li><code>POST /api/v1/charges</code> defaults its <code>currency</code> field to <code>gbp</code> if you don&rsquo;t specify one, and accepts <code>amount_cents</code> between 100 and 10,000,000 (£1–£100,000 at the default currency).</li>
      </ul>
      <p>
        Each of these is internally consistent and accurate in its own context. The mistake isn&rsquo;t in any one
        of them — it&rsquo;s in assuming they share a currency because they share an API.
      </p>

      <h2>What this means for your own pricing display</h2>
      <p>
        If your integration shows a merchant or end-customer a price derived from any of these three mechanisms,
        show the currency explicitly rather than inferring it from context. A charge you create defaults to GBP;
        don&rsquo;t assume it matches the merchant&rsquo;s local currency without checking what you passed as
        <code>currency</code>.
      </p>

      <FaqBlock
        heading="Billing questions this lesson doesn't already answer"
        items={[
          {
            question: 'Does AskBiz automatically pay out money collected through charges?',
            answer: 'Not currently. A charge is confirmed by a real Stripe webhook once the customer pays, but there is no automatic payout mechanism from AskBiz to the developer’s own account yet. Charges collect on the merchant’s behalf; they don’t yet move that money to you.',
          },
          {
            question: 'If I never call scan or whatsapp/send, do I need a wallet balance at all?',
            answer: 'No. If your integration only uses POST /api/v1/ask, connections, and charges, your wallet balance is irrelevant — none of those debit it. A zero balance only blocks scan and whatsapp/send calls.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'Understanding AskBiz billing and pricing',
        description: 'The wallet model, per-call pricing, and where currencies diverge across the AskBiz API.',
        breadcrumb: [
          { name: 'Academy', url: `${SITE}/academy` },
          { name: 'Understanding billing & pricing', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
