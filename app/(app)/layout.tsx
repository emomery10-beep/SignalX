import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShellClient from '@/components/layout/AppShellClient'
import { LanguageProvider } from '@/components/LanguageProvider'
import { getCatalog, CATALOG_EN } from '@/lib/i18n-catalog'
import { resolveLocale, DEFAULT_LOCALE } from '@/lib/i18n-locale'
import './app-shell.css'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_type, currency, currency_symbol, plan, region, sector_hints, onboarded')
    .eq('id', user.id)
    .single()

  // First-time users go through onboarding (/onboarding lives outside this route group
  // so this redirect does not loop back through this layout).
  if (profile && !profile.onboarded) {
    redirect('/onboarding')
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  // The root layout no longer reads cookies/headers — it's hardcoded to English
  // so most of the site can be statically cached (see app/layout.tsx). This
  // layout is already unconditionally dynamic (the auth check above), so
  // resolving the signed-in user's real locale here is free. Nesting a second
  // LanguageProvider makes the whole authenticated app render in their saved
  // language again; auth/callback's syncLocaleCookie already copies their
  // profile preference into this cookie at login.
  const lang = resolveLocale({
    cookie: cookies().get('askbiz_lang')?.value,
    country: headers().get('x-vercel-ip-country'),
  })

  return (
    <LanguageProvider
      initialLang={lang}
      initialCatalog={getCatalog(lang)}
      enCatalog={lang !== DEFAULT_LOCALE ? CATALOG_EN : undefined}
    >
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
    </LanguageProvider>
  )
}
