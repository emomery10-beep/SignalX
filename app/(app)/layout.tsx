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
    .select('full_name, business_name, business_type, currency, currency_symbol, plan, plan_id, region, sector_hints, onboarded, must_change_pin')
    .eq('id', user.id)
    .single()

  // Investors (team role) only ever see their own page: no business onboarding, no
  // navigation into the rest of the app. Every business API also refuses them.
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()
  if (membership?.role === 'investor') {
    if (profile?.must_change_pin) redirect('/change-pin')
    const logicalPath = headers().get('x-pathname') || ''
    // Only redirect when the path is known — an empty header must never cause a redirect loop.
    if (logicalPath && !logicalPath.startsWith('/investor')) redirect('/investor')
    const investorLang = resolveLocale({
      cookie: cookies().get('askbiz_lang')?.value,
      country: headers().get('x-vercel-ip-country'),
    })
    return (
      <LanguageProvider
        initialLang={investorLang}
        initialCatalog={getCatalog(investorLang)}
        enCatalog={investorLang !== DEFAULT_LOCALE ? CATALOG_EN : undefined}
      >
        {children}
      </LanguageProvider>
    )
  }

  // First-time users go through onboarding (/onboarding lives outside this route group
  // so this redirect does not loop back through this layout).
  if (profile && !profile.onboarded) {
    redirect('/onboarding')
  }

  // Admin-issued temporary PIN — force a real replacement before the app is usable.
  // /change-pin lives outside this route group so this redirect does not loop.
  if (profile?.must_change_pin) {
    redirect('/change-pin')
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
          businessName: profile?.business_name || '',
          // plan_id, not the legacy `plan` column — see memory:
          // profiles-plan-column-drift-bug. `plan`'s own default ('starter')
          // isn't even a real plan in the pricing/limits vocabulary
          // (free|growth|business|enterprise), so it's a last-resort fallback only.
          plan: profile?.plan_id || profile?.plan || 'free',
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
