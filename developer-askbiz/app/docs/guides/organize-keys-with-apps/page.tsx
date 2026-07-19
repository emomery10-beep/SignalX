import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/organize-keys-with-apps`

export const metadata: Metadata = {
  title: 'Organize keys with Apps — AskBiz API guide',
  description: 'Group your AskBiz API keys under a named, brandable App so merchants see who’s asking on the /connect consent screen instead of an unbranded request. Purely additive — a key with no App keeps working exactly as before.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Organize keys with Apps — AskBiz API',
    description: 'Group your API keys under a named, brandable App.',
    url: URL,
    type: 'article',
  },
}

const linkKeyToApp = `// Run from your browser's console while logged into developer.askbiz.co —
// PATCH /api/v1/keys is session-authenticated (it's an account setting,
// not something a third-party server calls with an x-api-key). Grab both
// ids from GET /api/dashboard-apps and GET /api/dashboard-data first.
await fetch('/api/v1/keys', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '<your key id>',
    app_id: '<your app id>',
  }),
}).then(r => r.json())`

const unlinkKeyFromApp = `// Same call with app_id set to null ungroups the key — it keeps working,
// merchants just see an unbranded request again on future connections.
await fetch('/api/v1/keys', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: '<your key id>', app_id: null }),
}).then(r => r.json())`

const steps = [
  {
    name: 'Create an App from the dashboard',
    text: 'Go to the Apps page in your developer.askbiz.co dashboard and click "New app." A name is required; logo URL and redirect URI are both optional, and both must be https:// if set. You can hold up to 10 apps per account.',
  },
  {
    name: 'Link an existing key to it',
    text: 'There isn’t a dashboard control for this yet — the underlying API supports it today via a direct PATCH call with app_id, made from your own logged-in browser session (this endpoint is session-authenticated, the same as key creation itself, not something a third-party server calls with an x-api-key). Find your key’s id and your app’s id from the dashboard, then run this once.',
    code: <CodeTabs samples={[{ label: 'Browser console', lang: 'js', code: linkKeyToApp }]} />,
  },
  {
    name: 'See it reflected on the consent screen',
    text: 'The next time that key requests a Connection via POST /api/v1/connections, the merchant’s consent page shows your App’s name and logo instead of an unbranded request. Nothing else about the key changes — its mode, quota, and existing Connections are unaffected.',
  },
  {
    name: 'Unlink or delete without breaking anything',
    text: 'Set app_id back to null the same way to ungroup a key, or delete the App entirely from the Apps page — either way, the key and any Connections it created keep working exactly as before, they just stop showing a branded name.',
    code: <CodeTabs samples={[{ label: 'Browser console', lang: 'js', code: unlinkKeyFromApp }]} />,
  },
]

export default function OrganizeKeysWithAppsGuide() {
  return (
    <ArticleShell
      title="Organize keys with Apps"
      description="Apps are an optional, purely additive grouping layer on top of raw API keys — give a set of keys a name and logo so a merchant sees a real integration on the consent screen, not a bare, unbranded request."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Organize keys with Apps', href: '/docs/guides/organize-keys-with-apps' },
      ]}
    >
      <p>
        If you only ever use one key for one integration, you don&rsquo;t need this — everything works identically
        with no App assigned. Apps start to matter once a merchant should recognize <em>who&rsquo;s asking</em> when
        your key requests a <a href="/docs/guides/connect-to-a-merchant">Connection</a>: an agency running keys for
        several client integrations, or a product with a distinct public name different from your account name,
        both benefit from the merchant seeing that name and logo on the real consent page rather than an anonymous
        request.
      </p>

      <HowToSteps steps={steps} />

      <h2>What changes, and what doesn&rsquo;t</h2>
      <p>
        An App is metadata — a name, an optional logo, an optional redirect URI — attached to one or more keys.
        It has no effect on authentication, rate limits, quota, or billing. The only visible difference is what a
        merchant sees on the <code>/connect/&lbrace;token&rbrace;</code> consent page when a grouped key requests
        access.
      </p>

      <FaqBlock
        heading="Apps FAQ"
        items={[
          {
            question: 'Do I need to create an App to use the API?',
            answer: 'No. Apps are entirely optional. A key with no App assigned works exactly the same as one grouped under an App — the only difference is what a merchant sees on the consent screen when that key requests a Connection.',
          },
          {
            question: 'Can one App have multiple keys?',
            answer: 'Yes — an App is just a label with a name and logo; assign as many of your keys to it as you like via the app_id field on PATCH /api/v1/keys.',
          },
          {
            question: 'What happens to existing Connections if I delete an App?',
            answer: 'They keep working. Deleting an App only removes the grouping metadata — the keys and any Connections or webhooks tied to them are unaffected, they just stop showing a branded name on future consent screens.',
          },
          {
            question: 'Is there a REST endpoint a third-party server calls to manage Apps?',
            answer: 'No — like webhook management, App management (create, rename, delete) is a session-authenticated, dashboard-only account setting, not an x-api-key endpoint. See the "Account management" section of the API Reference.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Organize keys with Apps',
        description: 'Create a named App in the AskBiz developer dashboard, link an existing API key to it, and see the change reflected on the merchant consent screen.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Organize keys with Apps', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
