import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import JsonLd from '@/components/docs/JsonLd'
import { webPage, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/terms`
const LAST_UPDATED = '2026-07-19'
const LEGAL_EMAIL = 'legal@askbiz.co'
const PRIVACY_EMAIL = 'privacy@askbiz.co'

export const metadata: Metadata = {
  title: 'Developer API Terms — AskBiz',
  description: 'The terms that apply to registering for AskBiz API keys and building on developer.askbiz.co — API keys, acceptable use, merchant connections, billing-on-behalf-of, fees, rate limits, and liability.',
  alternates: { canonical: URL },
  openGraph: { title: 'Developer API Terms — AskBiz', description: 'The terms that apply to building on the AskBiz API.', url: URL, type: 'article' },
}

export default function DeveloperTermsPage() {
  return (
    <ArticleShell
      title="Developer API Terms"
      description="These API Terms apply to anyone who registers for API keys or otherwise builds on developer.askbiz.co. Last updated 19 July 2026."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Terms', href: '/docs/terms' }]}
    >
      <div className="not-prose mb-8 p-5 rounded-xl border border-ink-700 bg-ink-900">
        <p className="text-ink-200 text-sm leading-relaxed">
          <strong className="text-ink-50">In short:</strong> these are the rules for using the AskBiz API as a
          developer — separate from the terms that apply to running a business on AskBiz itself. They cover your
          API keys, what you can build, how merchant data and consent work, billing-on-behalf-of, what you pay
          us, and the standard liability terms. They don&rsquo;t replace the{' '}
          <a href="https://askbiz.co/terms">general AskBiz Terms of Service</a> — both apply, and if the two
          conflict on a developer-platform matter, this page governs.
        </p>
      </div>

      <h2>1. Scope and how this relates to the AskBiz Terms of Service</h2>
      <p>
        These Developer API Terms (&ldquo;API Terms&rdquo;) are a supplement to, and form part of, the{' '}
        <a href="https://askbiz.co/terms">AskBiz Terms of Service</a>. They apply specifically to your
        registration for API keys, your use of any endpoint under <code>/api/v1/*</code>, and your use of the{' '}
        <code>developer.askbiz.co</code> dashboard (keys, apps, webhooks, usage, console). The general AskBiz
        Terms of Service, <a href="https://askbiz.co/rules/acceptable-use-policy">Acceptable Use Policy</a>, and{' '}
        <a href="https://askbiz.co/rules/prohibited-activities">Prohibited Activities Policy</a> continue to apply
        to your account as a whole. Where these API Terms are silent, the general Terms of Service govern; where
        they conflict on a matter specific to the API or developer platform, these API Terms govern.
      </p>
      <p>
        By generating an API key, calling any <code>/api/v1/*</code> endpoint, or using the{' '}
        <code>developer.askbiz.co</code> dashboard, you accept these API Terms on behalf of yourself or, if you
        are acting for an organization, on behalf of that organization — in which case &ldquo;you&rdquo; means
        that organization and you confirm you have authority to bind it.
      </p>

      <h2>2. Definitions</h2>
      <ul>
        <li><strong>&ldquo;API&rdquo;</strong> means the AskBiz REST API served under <code>/api/v1/*</code>, documented at <a href="/docs">developer.askbiz.co/docs</a>.</li>
        <li><strong>&ldquo;API Key&rdquo;</strong> means a credential of the form <code>abz_live_&hellip;</code> (a Live Key, which can move real money and send real messages) or <code>abz_test_&hellip;</code> (a Test Key, restricted to simulated responses on billed and messaging endpoints) issued to you for authenticating requests.</li>
        <li><strong>&ldquo;Application&rdquo; or &ldquo;App&rdquo;</strong> means software you build that calls the API, optionally grouped under a named App in the dashboard.</li>
        <li><strong>&ldquo;Merchant&rdquo;</strong> means an AskBiz business account holder whose data your Application may request scoped access to.</li>
        <li><strong>&ldquo;Connection&rdquo;</strong> means a scoped grant of access to a specific Merchant&rsquo;s account, created via <code>POST /api/v1/connections</code> and approved by the Merchant on a hosted consent page.</li>
        <li><strong>&ldquo;Scopes&rdquo;</strong> means the specific permissions (for example <code>read_inventory</code>) requested in a Connection and shown to the Merchant before they approve it.</li>
        <li><strong>&ldquo;you&rdquo; / &ldquo;your&rdquo;</strong> means the developer or organization registered to use the API. <strong>&ldquo;we&rdquo; / &ldquo;us&rdquo; / &ldquo;AskBiz&rdquo;</strong> means AskBiz Ltd.</li>
      </ul>

      <h2>3. Eligibility and your account</h2>
      <p>
        You must be able to form a binding contract to accept these API Terms — either as an adult acting for
        yourself, or as someone with actual authority to bind the organization you represent. Registration
        information you give us (including any email or phone number tied to your account) must be accurate, and
        you&rsquo;re responsible for keeping it current. Developer accounts run on the same underlying AskBiz
        account system as the rest of the platform — see the{' '}
        <a href="https://askbiz.co/terms">AskBiz Terms of Service</a> for the account-level rules (one account
        per person/entity absent a separate agreement, suspension for fraud, and so on).
      </p>

      <h2>4. API keys and credentials</h2>
      <p>
        Your API Key is a credential, not a public identifier. You are responsible for every request made with
        it, whether or not you made the request yourself. In particular:
      </p>
      <ul>
        <li>Don&rsquo;t embed a key in client-side code, a mobile app binary, a public repository, or anywhere else an end user or search engine could extract it. Keys are meant to be held server-side.</li>
        <li>Don&rsquo;t share a key between unrelated parties, or let a key stand in for its own authentication system for your end users.</li>
        <li>If a key is exposed or you suspect misuse, disable it immediately from the Keys page in your dashboard and issue a new one — there is no key-rotation feature, so disabling and replacing is the correct response.</li>
        <li>We may disable a key without notice where we reasonably believe it has been compromised, is being used to violate these API Terms, or presents a security risk to AskBiz, a Merchant, or another user — see <a href="/docs/authentication">Authentication</a> for what a disabled key returns.</li>
      </ul>
      <p>
        Keys are issued in <code>account</code> or <code>generic</code> mode, which changes what certain
        endpoints do with a request — see <a href="/docs/authentication">Authentication</a> for the distinction.
        You may optionally group keys under a named <strong>App</strong> (name, logo, redirect URI) purely for
        organization and so Merchants see a recognizable name and logo on the consent screen instead of an
        unbranded request — see <a href="/docs/guides/organize-keys-with-apps">Organize keys with Apps</a>.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Your use of the API is subject to the general{' '}
        <a href="https://askbiz.co/rules/acceptable-use-policy">AskBiz Acceptable Use Policy</a> and{' '}
        <a href="https://askbiz.co/rules/prohibited-activities">Prohibited Activities Policy</a>, both
        incorporated here by reference. In addition, specifically for API and developer-platform use, you must
        not:
      </p>
      <ul>
        <li>Attempt to circumvent a rate limit or quota — including by registering multiple keys or accounts to evade a limit that applies to you.</li>
        <li>Scrape, bulk-extract, or systematically republish the documentation, pricing, or OpenAPI spec in a way that misrepresents it as your own or that isn&rsquo;t reasonable programmatic use (fetching <a href="/docs/api-reference/pricing"><code>GET /api/v1/pricing</code></a> or <code>/api/v1/openapi.json</code> to drive your own integration is exactly what they&rsquo;re for).</li>
        <li>Reverse-engineer, decompile, or attempt to extract the underlying models behind <a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a> or <a href="/docs/api-reference/ask"><code>/api/v1/ask</code></a>, or use API responses to train a directly competing product recognition or business-intelligence model.</li>
        <li>Represent your Application as an official AskBiz product, or represent yourself as AskBiz, when communicating with a Merchant or end user.</li>
        <li>Use <a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a> to send a message to a recipient who hasn&rsquo;t consented to receive it, or otherwise in a way that would violate WhatsApp&rsquo;s own Business Messaging Policy — you&rsquo;re sending through AskBiz&rsquo;s Meta Business API connection, and messaging abuse risks that connection for every developer using it, not just you.</li>
        <li>Submit content through <a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a> or <a href="/docs/api-reference/ask"><code>/api/v1/ask</code></a> that you don&rsquo;t have the right to submit, or that is unlawful, infringing, or contains another person&rsquo;s sensitive personal data without a lawful basis.</li>
      </ul>
      <p>
        We may suspend the specific key or Connection involved, rather than your whole account, where that&rsquo;s
        a proportionate response to a violation.
      </p>

      <h2>6. Merchant connections and scoped access</h2>
      <p>
        <a href="/docs/api-reference/connections"><code>POST /api/v1/connections</code></a> lets you request
        persistent, scoped access to a specific Merchant&rsquo;s account. Access only exists once that Merchant
        has approved it on AskBiz&rsquo;s own hosted consent page, which shows them exactly which Scopes you
        requested and, where your key is grouped under an App, your App&rsquo;s name and logo. You may not:
      </p>
      <ul>
        <li>Request Scopes broader than what your Application actually needs.</li>
        <li>Use data obtained through a Connection for any purpose beyond what was disclosed to the Merchant at the time they approved it.</li>
        <li>Attempt to access Merchant data outside the Scopes actually granted — for example, calling an endpoint with a <code>merchant_id</code> your Connection doesn&rsquo;t have the matching Scope for.</li>
        <li>Continue using previously obtained data, or make further calls against a Connection, once that Merchant has revoked it. Revocation is immediate and effective on our side; you&rsquo;re responsible for stopping use of anything you already retrieved beyond what&rsquo;s reasonably necessary to wind down (for example, honoring an in-flight refund).</li>
      </ul>
      <p>
        A Merchant can revoke a Connection at any time from their own AskBiz account. We are not a party to, and
        don&rsquo;t mediate, the substantive relationship between you and a Merchant — we provide the consent and
        access-control mechanism; the terms of your actual dealings with a Merchant are between you and them.
      </p>

      <h2>7. Billing-on-behalf-of (Charges)</h2>
      <p>
        <a href="/docs/api-reference/charges"><code>POST /api/v1/charges</code></a> lets you create a charge
        request against a Merchant, collected through a hosted Stripe Checkout page — no card details ever touch
        your servers or ours. When you use this endpoint:
      </p>
      <ul>
        <li>You are responsible for the accuracy of every amount and description you submit. A Merchant sees exactly what you sent before they pay.</li>
        <li>AskBiz acts as a billing facilitator between you and the Merchant, using Stripe as the underlying payment processor. We are not a party to whatever underlying product, service, or subscription the charge relates to — that arrangement is between you and the Merchant.</li>
        <li>You must not create a charge request the Merchant hasn&rsquo;t agreed to, or duplicate a charge for something already paid. Combined with <a href="/docs/guides/errors-and-retries">Idempotency-Key on other endpoints</a>, this is why <code>/api/v1/charges</code> deserves extra care in your own retry logic even though the endpoint itself doesn&rsquo;t support an Idempotency-Key today — see <a href="/docs/authentication">Authentication</a> for which endpoints do.</li>
        <li>Refunds and payment disputes are handled per Stripe&rsquo;s own terms for the underlying transaction. For a dispute you can&rsquo;t resolve directly with the Merchant, contact <a href={`mailto:hello@askbiz.co`}>hello@askbiz.co</a>.</li>
      </ul>

      <h2>8. Fees and billing for your use of the API</h2>
      <p>
        Billed endpoints are charged only on success — a failed or rejected call is never charged. Current prices
        are always published, without authentication required, at{' '}
        <a href="/docs/api-reference/pricing"><code>GET /api/v1/pricing</code></a>; that live endpoint is the
        authoritative source of pricing, and takes precedence over any price mentioned in these Terms, the docs
        prose, or other marketing material if the two ever drift apart.
      </p>
      <p>
        Calls are debited against a prepaid credit balance (&ldquo;wallet&rdquo;). A 200 response that pushes your
        balance below the low-balance threshold includes <code>low_balance_warning: true</code> and your current{' '}
        <code>balance_cents</code> in-band, so you find out at the moment it happens rather than only when a
        later call fails with a 402. Once your balance is insufficient, billed endpoints return a 402 with the
        amount needed and a top-up link.
      </p>
      <p>
        Where we make a material change to pricing that affects an endpoint you&rsquo;re actively using, we&rsquo;ll
        record it in the <a href="/docs/changelog">Changelog</a> and make reasonable efforts to notify active
        developers by email in advance of it taking effect. You&rsquo;re responsible for any taxes applicable to
        your use of the API in your own jurisdiction.
      </p>

      <h2>9. Rate limits, quotas, and fair use</h2>
      <p>
        Your plan sets a per-minute rate limit and, on some plans, a monthly quota — see{' '}
        <a href="/docs/authentication">Authentication</a> for the current numbers and how the limit is enforced.
        Regardless of your plan&rsquo;s stated limit, we may throttle or temporarily suspend a key whose traffic
        pattern threatens the stability of the API for other developers, and we&rsquo;ll make reasonable efforts
        to tell you why if that happens.
      </p>

      <h2>10. Idempotency</h2>
      <p>
        <a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a> and{' '}
        <a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a> support an{' '}
        <code>Idempotency-Key</code> header, described in full on the{' '}
        <a href="/docs/authentication">Authentication</a> page. Reusing the same idempotency key value for two{' '}
        <em>different</em> request bodies is undefined behavior — you&rsquo;ll get back whichever response was
        stored against that key first, not a response to your second request. Generate a fresh key per logical
        operation (for example, per unique order or message), not a fixed constant.
      </p>

      <h2>11. Availability, changes, and versioning</h2>
      <p>
        The API is provided on an &ldquo;as available&rdquo; basis. We don&rsquo;t commit to a specific uptime
        percentage under these API Terms absent a separate, signed enterprise agreement that says otherwise. We
        will make reasonable efforts to give advance notice of planned maintenance and of any breaking change to
        an endpoint you&rsquo;re using — in practice, via the <a href="/docs/changelog">Changelog</a> and, where
        we have a way to reach you, by email.
      </p>
      <p>
        The API is path-versioned (<code>/api/v1/*</code>). We may add new endpoints, new optional request
        fields, or new optional response fields at any time without notice — code that ignores fields it
        doesn&rsquo;t recognize won&rsquo;t break. For a change that removes or changes the meaning of an
        existing field or endpoint, we intend to give at least 90 days&rsquo; notice via the Changelog before it
        takes effect, except where an immediate change is required for security or legal reasons.
      </p>

      <h2>12. Intellectual property</h2>
      <p>
        AskBiz owns all right, title, and interest in the API, the documentation, the OpenAPI specification, and
        the underlying models and infrastructure. Subject to your compliance with these API Terms, we grant you a
        limited, non-exclusive, non-transferable, revocable license to access and call the API to build and
        operate your own Application. You retain all rights in your own Application and in content you submit
        through it, subject to the license you grant us to process that content in order to return a response to
        you (for example, an image submitted to <code>/api/v1/scan</code> is processed to generate a match
        result).
      </p>

      <h2>13. Confidentiality</h2>
      <p>
        Each party will use the other&rsquo;s confidential information (including, on our side, non-public API
        behavior, and on your side, your Application&rsquo;s non-public design) only as needed to perform under
        these API Terms, and won&rsquo;t disclose it to third parties except to the extent already public,
        independently developed, rightfully received from someone else, or required to be disclosed by law.
      </p>

      <h2>14. Data protection</h2>
      <p>
        How we handle personal data in connection with the API — your data as a developer, and Merchant data
        accessed through a Connection — is set out in the{' '}
        <a href="/docs/privacy">Developer Privacy Addendum</a>, which supplements the{' '}
        <a href="https://askbiz.co/privacy">AskBiz Privacy Policy</a>. If your Application processes personal
        data on behalf of a Merchant or their customers, you are responsible for having your own lawful basis and
        your own compliant privacy notice for that processing — see Section 12 of the{' '}
        <a href="/docs/privacy">Developer Privacy Addendum</a>. A data processing agreement is available at{' '}
        <a href="https://askbiz.co/dpa">askbiz.co/dpa</a> where one is required for your use case.
      </p>

      <h2>15. Suspension and termination</h2>
      <p>
        You may stop using the API at any time by disabling your keys. We may suspend or terminate your API
        access — a specific key, a specific Connection, or your developer account as a whole, depending on what&rsquo;s
        proportionate — where we reasonably believe you&rsquo;ve violated these API Terms, the Acceptable Use
        Policy, or the Prohibited Activities Policy; where required by law; to prevent harm to AskBiz, a Merchant,
        or another user; or for non-payment of fees owed. Where practical, we&rsquo;ll tell you why. Sections
        that by their nature should survive termination — including Intellectual Property, Confidentiality, Data
        Protection, Warranties and Disclaimers, Limitation of Liability, Indemnification, and Governing Law — do
        survive.
      </p>

      <h2>16. Warranties and disclaimers</h2>
      <p>
        The API is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the fullest extent permitted
        by law, we disclaim all warranties, express or implied, including merchantability, fitness for a
        particular purpose, and non-infringement. We don&rsquo;t warrant that the API will be uninterrupted,
        error-free, or that results from <code>/api/v1/scan</code> or <code>/api/v1/ask</code> will be accurate
        or complete for your purposes — you&rsquo;re responsible for validating that the API is fit for how your
        Application actually uses it, particularly for any decision with real-world financial or safety
        consequences.
      </p>

      <h2>17. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, neither party will be liable for indirect, incidental, special,
        consequential, or punitive damages, or for loss of profits, revenue, or data, arising from these API
        Terms or use of the API. Each party&rsquo;s total liability arising out of or relating to these API Terms
        is limited to the greater of (a) the fees you paid us for the API in the 12 months before the claim
        arose, or (b) $100. These limits don&rsquo;t apply to a party&rsquo;s indemnification obligations, gross
        negligence, willful misconduct, fraud, or anything else that can&rsquo;t lawfully be limited in your
        jurisdiction.
      </p>

      <h2>18. Indemnification</h2>
      <p>
        You will defend and indemnify AskBiz against any third-party claim, and resulting damages and costs,
        arising from your Application, your use of data obtained through a Connection outside its granted
        Scopes, your violation of these API Terms, or your violation of applicable law.
      </p>

      <h2>19. Governing law and disputes</h2>
      <p>
        These API Terms are governed by, and disputes arising from them are resolved under, the same governing
        law and dispute-resolution provisions set out in the{' '}
        <a href="https://askbiz.co/terms">AskBiz Terms of Service</a>, which are incorporated here by reference.
      </p>

      <h2>20. General</h2>
      <ul>
        <li><strong>Changes to these API Terms.</strong> We may update these API Terms from time to time; the &ldquo;last updated&rdquo; date at the top of this page reflects the current version, and a material change will be noted in the <a href="/docs/changelog">Changelog</a>. Continued use of the API after a change takes effect means you accept the update.</li>
        <li><strong>Entire agreement.</strong> These API Terms, together with the AskBiz Terms of Service, Acceptable Use Policy, Prohibited Activities Policy, Privacy Policy, Developer Privacy Addendum, and (where applicable) DPA, are the entire agreement between you and AskBiz regarding the API.</li>
        <li><strong>Assignment.</strong> You may not assign these API Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of substantially all our assets.</li>
        <li><strong>Severability.</strong> If any provision is found unenforceable, the rest remains in effect.</li>
        <li><strong>No waiver.</strong> Failure to enforce a provision isn&rsquo;t a waiver of it.</li>
        <li><strong>Force majeure.</strong> Neither party is liable for a failure to perform caused by circumstances beyond its reasonable control.</li>
      </ul>

      <h2>21. Contact</h2>
      <p>
        <strong>Legal:</strong> <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a><br />
        <strong>Privacy:</strong> <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a><br />
        <strong>Support:</strong> <a href="mailto:hello@askbiz.co">hello@askbiz.co</a><br />
        <strong>Company:</strong> AskBiz Ltd
      </p>

      <JsonLd data={webPage({
        url: URL,
        name: 'Developer API Terms — AskBiz',
        description: 'The terms that apply to registering for AskBiz API keys and building on developer.askbiz.co.',
        dateModified: LAST_UPDATED,
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Terms', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
