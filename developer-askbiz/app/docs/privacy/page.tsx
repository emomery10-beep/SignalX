import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import JsonLd from '@/components/docs/JsonLd'
import { webPage, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/privacy`
const LAST_UPDATED = '2026-07-19'
const PRIVACY_EMAIL = 'privacy@askbiz.co'

export const metadata: Metadata = {
  title: 'Developer Privacy Addendum — AskBiz',
  description: 'How AskBiz handles personal data specific to the developer API — API keys and usage logs, scan images, WhatsApp sends, scoped merchant connections, charges, webhooks, and your rights.',
  alternates: { canonical: URL },
  openGraph: { title: 'Developer Privacy Addendum — AskBiz', description: 'How AskBiz handles data specific to the developer API.', url: URL, type: 'article' },
}

export default function DeveloperPrivacyPage() {
  return (
    <ArticleShell
      title="Developer Privacy Addendum"
      description="How we handle personal data that's specific to the developer API and the developer.askbiz.co dashboard. Last updated 19 July 2026."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Privacy', href: '/docs/privacy' }]}
    >
      <div className="not-prose mb-8 p-5 rounded-xl border border-ink-700 bg-ink-900">
        <p className="text-ink-200 text-sm leading-relaxed">
          <strong className="text-ink-50">In short:</strong> this page covers what&rsquo;s specific to the API —
          your key and usage data, what happens to a photo you send to <code>/api/v1/scan</code>, scoped merchant
          data accessed through a Connection, and so on. It supplements, and doesn&rsquo;t replace, the{' '}
          <a href="https://askbiz.co/privacy">main AskBiz Privacy Policy</a>, which is the primary document for
          how we handle personal data across AskBiz generally, including the retention table and your deletion
          rights. Where this page doesn&rsquo;t address something, the main Privacy Policy does.
        </p>
      </div>

      <h2>1. Scope and how this relates to the AskBiz Privacy Policy</h2>
      <p>
        This Developer Privacy Addendum supplements the{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a> and covers processing that&rsquo;s specific
        to <code>developer.askbiz.co</code> and the <code>/api/v1/*</code> API — things the main Privacy Policy
        doesn&rsquo;t need to describe because they only exist for developers. A developer account runs on the
        same underlying AskBiz account system as the rest of the platform, so the main Privacy Policy&rsquo;s
        sections on legal bases, international transfers, security, sub-processors, and your rights all apply
        here too — this page adds the API-specific detail on top of them rather than restating them.
      </p>

      <h2>2. Who this page is about</h2>
      <p>There are three distinct people whose data can flow through the API, and this addendum treats them differently:</p>
      <ul>
        <li><strong>You, the developer</strong> — the account holder who registers for API keys. Section 3 covers what we collect about you.</li>
        <li><strong>A Merchant</strong> — an AskBiz business whose data your Application can access, but only what they explicitly grant through a real consent screen. Section 5 covers this.</li>
        <li><strong>A Merchant&rsquo;s own customers or staff</strong> — end users who never interact with AskBiz directly in this flow. We don&rsquo;t have a direct relationship with them; if your Application processes their personal data via API responses, you do, as covered in Section 12.</li>
      </ul>

      <h2>3. Data we collect about you as a developer</h2>
      <p><strong>Account data.</strong> The phone number and PIN, or email, you register with — the same account fields described in the main Privacy Policy, since developer accounts use the same authentication system as the rest of AskBiz.</p>
      <p><strong>API usage data.</strong> For every API call: the endpoint, timestamp, latency, HTTP status, a request ID, and, for billed endpoints, the amount debited. Where you send an <code>Idempotency-Key</code>, we store the key alongside a snapshot of the response so a retry can be replayed — see <a href="/docs/authentication">Authentication</a>. This data is the basis for your Usage dashboard, for rate-limit and quota enforcement, and for billing records.</p>
      <p><strong>Content you send us.</strong> The body of each request — for example, the text of a question sent to <code>/api/v1/ask</code>, an image sent to <code>/api/v1/scan</code>, or a phone number and message text sent to <code>/api/v1/whatsapp/send</code>. See Sections 6 and 7 for how these are specifically handled.</p>
      <p><strong>App metadata.</strong> If you create an App to group your keys, its name, logo URL, and redirect URI — shown to a Merchant on the consent screen so they know who&rsquo;s asking.</p>
      <p><strong>Webhook configuration.</strong> Destination URLs and signing secrets you configure for event delivery, plus a delivery log (status, attempts, timestamps) for events sent to them.</p>
      <p><strong>Billing data.</strong> Your credit balance and top-up history. Card details are handled directly by Stripe — we don&rsquo;t store your card number.</p>

      <h2>4. How we use it</h2>
      <ul>
        <li>To operate the API — authenticate your requests, enforce rate limits and quotas, and return responses.</li>
        <li>To bill you accurately — only for successful calls, replaying an idempotent retry instead of double-charging.</li>
        <li>To detect and prevent abuse — for example, identifying traffic patterns that violate the <a href="/docs/terms">Developer API Terms</a> or threaten platform stability for other developers.</li>
        <li>To provide support when you contact us about your integration.</li>
        <li>To meet legal and accounting obligations, including retaining transaction records for as long as required by law.</li>
      </ul>

      <h2>5. Data from merchant connections</h2>
      <p>
        <a href="/docs/api-reference/connections"><code>POST /api/v1/connections</code></a> is the one place the
        API exposes another person&rsquo;s business data to you, and it only does so within limits a Merchant
        actively agrees to:
      </p>
      <ul>
        <li>A Connection only exists once the Merchant approves it on AskBiz&rsquo;s own hosted consent page, which shows them exactly which Scopes you&rsquo;re requesting.</li>
        <li>You only ever receive data within the Scopes actually granted — for example, <code>read_inventory</code> is what unlocks the <code>merchant_id</code> parameter on <a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a>, and grants nothing beyond inventory read access.</li>
        <li>A Merchant can revoke a Connection at any time from their own account, at which point we stop granting your key any further access under it.</li>
        <li>We log Connection creation and revocation events so a Merchant can see what&rsquo;s connected to their account and when.</li>
      </ul>
      <p>
        We are a processor of the Merchant&rsquo;s data in this flow, acting on the access instructions the
        Merchant themselves set via the consent screen — not a party deciding on your behalf what you should be
        allowed to see.
      </p>

      <h2>6. Images sent to the vision endpoint</h2>
      <p>
        A photo you submit to <a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a> is processed to
        generate a product-match result and, for an <code>account</code>-mode key, matched against the connected
        business&rsquo;s own inventory. This is the same underlying vision pipeline AskBiz&rsquo;s own camera
        features use — see the <strong>camera and photo data</strong> section of the{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a> for how images are processed and retained;
        the same handling applies regardless of whether the photo originates in the AskBiz app or from a
        third-party Application calling the API on a Merchant&rsquo;s behalf.
      </p>

      <h2>7. WhatsApp messages</h2>
      <p>
        <a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a> sends a pre-approved
        template through AskBiz&rsquo;s own Meta Business API connection. The recipient phone number and message
        content pass through Meta&rsquo;s WhatsApp Business Platform as part of delivering the message — Meta
        processes this data under its own terms as the messaging infrastructure provider. Only send a message to
        a recipient who has consented to receive it; see Section 5 of the{' '}
        <a href="/docs/terms">Developer API Terms</a>.
      </p>

      <h2>8. Sub-processors specific to the API</h2>
      <p>
        In addition to the sub-processors listed in the main{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a>, API traffic specifically involves:
      </p>
      <ul>
        <li><strong>Stripe</strong> — card processing for wallet top-ups and for Merchant payments collected through <a href="/docs/api-reference/charges"><code>/api/v1/charges</code></a>.</li>
        <li><strong>Meta (WhatsApp Business Platform)</strong> — message delivery for <code>/api/v1/whatsapp/send</code>.</li>
        <li><strong>Groq</strong> — inference infrastructure used to process <a href="/docs/api-reference/ask"><code>/api/v1/ask</code></a> requests.</li>
        <li><strong>Supabase</strong> — the database underlying API keys, usage logs, Connections, and webhook configuration.</li>
      </ul>

      <h2>9. Retention</h2>
      <p>
        General retention periods are in the <strong>data retention</strong> table of the{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a>. Specific to the API: usage and billing
        records (Section 3) are kept for as long as needed for billing accuracy, dispute resolution, and legal/
        accounting requirements, even after you stop using a key. An idempotency response snapshot is kept
        against its key/idempotency-key pair with no automatic expiry today — don&rsquo;t reuse an idempotency
        key value across logically different requests, since a stored snapshot will be replayed indefinitely for
        that exact key value (see <a href="/docs/terms">Developer API Terms</a>, Section 10).
      </p>

      <h2>10. International transfers</h2>
      <p>
        Data may be processed in a different country than the one you or a Merchant are in, using the same
        safeguards described in the international transfers section of the{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a>.
      </p>

      <h2>11. Your rights</h2>
      <p>
        You have the same rights over your developer account&rsquo;s personal data as any AskBiz account holder —
        access, correction, and deletion — described in the main{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a>. To exercise them, email{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. Note that deleting your account doesn&rsquo;t
        retroactively delete usage and billing records we&rsquo;re required to keep for accounting or legal
        reasons, and doesn&rsquo;t revoke Merchant Connections on your behalf — disable your keys first so any
        integration relying on them stops cleanly.
      </p>

      <h2>12. Your responsibilities as a developer</h2>
      <p>
        If your Application collects, stores, or otherwise processes personal data — your end users&rsquo; data,
        or a Merchant&rsquo;s customer data obtained through a Connection — you are the controller (or processor,
        as the case may be) for that processing, not AskBiz. That means:
      </p>
      <ul>
        <li>You need your own lawful basis for processing that data, and your own privacy notice describing it to the people it belongs to.</li>
        <li>You may not represent AskBiz&rsquo;s Privacy Policy or this addendum as covering your Application&rsquo;s own data practices.</li>
        <li>If you process EU/UK personal data as a processor on behalf of a Merchant, a data processing agreement is available at <a href="https://askbiz.co/dpa">askbiz.co/dpa</a> for the AskBiz-to-you leg of that chain; you&rsquo;re responsible for having your own equivalent agreement with the Merchant.</li>
      </ul>

      <h2>13. Security</h2>
      <p>
        API traffic runs over TLS. Keys are shown once in full at creation and stored hashed thereafter — if you
        lose a key, you can&rsquo;t retrieve it, only disable it and issue a new one. General security measures
        are described in the <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a>. If you discover a
        security vulnerability in the API, report it to <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>{' '}
        rather than testing it against a real Merchant&rsquo;s data.
      </p>

      <h2>14. Children&rsquo;s data</h2>
      <p>
        The developer platform is a business-to-business surface and isn&rsquo;t directed at children. Don&rsquo;t
        use the API to knowingly collect personal data from children.
      </p>

      <h2>15. Changes to this addendum</h2>
      <p>
        We may update this addendum from time to time; the &ldquo;last updated&rdquo; date at the top reflects
        the current version, and a material change will be noted in the <a href="/docs/changelog">Changelog</a>.
      </p>

      <p>
        <strong>Privacy questions:</strong> <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a><br />
        <strong>Support:</strong> <a href="mailto:hello@askbiz.co">hello@askbiz.co</a>
      </p>

      <JsonLd data={webPage({
        url: URL,
        name: 'Developer Privacy Addendum — AskBiz',
        description: 'How AskBiz handles personal data specific to the developer API and developer.askbiz.co dashboard.',
        dateModified: LAST_UPDATED,
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Privacy', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
