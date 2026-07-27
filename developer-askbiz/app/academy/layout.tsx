import JsonLd from '@/components/docs/JsonLd'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import GlowField from '@/components/ui/GlowField'
import { organizationAndWebsite } from '@/lib/schema'

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950 relative">
      <GlowField />
      <PublicHeader current="/academy" />
      <main className="flex-1 relative z-10">{children}</main>
      <PublicFooter />
      <JsonLd data={organizationAndWebsite()} />
    </div>
  )
}
