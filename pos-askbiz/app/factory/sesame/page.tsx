import { redirect } from 'next/navigation'

// Old link: this screen is now factory-type aware (coconut, groundnut, water, …) and lives at /factory/overview.
export default function SesameProductionRedirect() {
  redirect('/factory/overview')
}
