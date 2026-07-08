import { redirect } from 'next/navigation'

// Superseded by the dedicated developer.askbiz.co portal (own subdomain,
// own Vercel project — see developers-askbiz/). Redirect rather than
// maintain two copies of API docs that will drift out of sync.
export default function DevelopersPageRedirect() {
  redirect('https://developer.askbiz.co')
}
