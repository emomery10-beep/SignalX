import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShellClient from '@/components/layout/AppShellClient'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_type, currency, currency_symbol, plan, region, sector_hints')
    .eq('id', user.id)
    .single()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  return (
    <AppShellClient
      user={{
        id: user.id,
        name: profile?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        plan: profile?.plan || 'starter',
        currency: profile?.currency || 'USD',
        currencySymbol: profile?.currency_symbol || '$',
        bizType: profile?.business_type || 'retail',
        region: profile?.region || '',
        sectorHints: profile?.sector_hints || '',
      }}
      conversations={conversations || []}
    >
      {children}
    </AppShellClient>
  )
}
