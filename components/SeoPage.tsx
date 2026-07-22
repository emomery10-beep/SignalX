import Link from 'next/link'
import type { Metadata } from 'next'
import { localePath, isRTL, type Locale } from '@/lib/i18n-locale'

export interface SeoPageProps {
  h1: string
  subheading: string
  keyword: string
  intro: string
  problem: { heading: string; body: string }
  solution: { heading: string; body: string }
  features: { icon: string; title: string; body: string }[]
  howItWorks: { step: string; title: string; body: string }[]
  faqs: { q: string; a: string }[]
  cta: { heading: string; body: string }
  relatedPages?: { href: string; label: string }[]
  // Locale the page is rendering in — drives chrome-string translation, RTL
  // layout, and locale-prefixed internal links. Defaults to English so the
  // original (pre-i18n) call sites keep behaving exactly as before.
  lang?: Locale
}

// Short, reused UI strings (nav, buttons, section labels, footer) — NOT the
// long-form page content, which is fully authored per locale by the caller.
// Kept here rather than in the tc() catalogue because these ~15 strings only
// exist on this one component, not sitewide.
const CHROME: Record<Locale, {
  signIn: string; tryFree: string; startFree: string; seeHowItWorks: string
  heroNote: string; featuresHeading: string; featuresSubheading: string
  howItWorksHeading: string; faqHeading: string; ctaNote: string
  relatedGuides: string; footerHome: string; footerPrivacy: string
  footerTerms: string; footerContact: string
}> = {
  en: { signIn: 'Sign in', tryFree: 'Try free →', startFree: 'Start free — no card needed →', seeHowItWorks: 'See how it works', heroNote: '10 free questions every month. No credit card required.', featuresHeading: "Everything you need. Nothing you don't.", featuresSubheading: 'Built for business owners, not data scientists.', howItWorksHeading: 'How it works', faqHeading: 'Frequently asked questions', ctaNote: "10 free questions every month. Upgrade when you're ready. Cancel anytime.", relatedGuides: 'Related guides', footerHome: 'Home', footerPrivacy: 'Privacy', footerTerms: 'Terms', footerContact: 'Contact' },
  es: { signIn: 'Iniciar sesión', tryFree: 'Pruébalo gratis →', startFree: 'Empieza gratis — sin tarjeta →', seeHowItWorks: 'Ver cómo funciona', heroNote: '10 preguntas gratis cada mes. No se requiere tarjeta de crédito.', featuresHeading: 'Todo lo que necesitas. Nada que no.', featuresSubheading: 'Creado para dueños de negocio, no científicos de datos.', howItWorksHeading: 'Cómo funciona', faqHeading: 'Preguntas frecuentes', ctaNote: 'Mejora cuando quieras. Cancela cuando quieras.', relatedGuides: 'Guías relacionadas', footerHome: 'Inicio', footerPrivacy: 'Privacidad', footerTerms: 'Términos', footerContact: 'Contacto' },
  fr: { signIn: 'Connexion', tryFree: 'Essayer gratuitement →', startFree: 'Commencer gratuitement — sans carte →', seeHowItWorks: 'Voir comment ça marche', heroNote: '10 questions gratuites chaque mois. Aucune carte bancaire requise.', featuresHeading: "Tout ce qu'il vous faut. Rien de superflu.", featuresSubheading: 'Conçu pour les commerçants, pas pour les data scientists.', howItWorksHeading: 'Comment ça marche', faqHeading: 'Questions fréquentes', ctaNote: "Passez à l'offre supérieure quand vous voulez. Annulez à tout moment.", relatedGuides: 'Guides associés', footerHome: 'Accueil', footerPrivacy: 'Confidentialité', footerTerms: 'Conditions', footerContact: 'Contact' },
  de: { signIn: 'Anmelden', tryFree: 'Kostenlos testen →', startFree: 'Kostenlos starten — keine Karte nötig →', seeHowItWorks: "So funktioniert's", heroNote: '10 kostenlose Fragen pro Monat. Keine Kreditkarte erforderlich.', featuresHeading: 'Alles, was du brauchst. Nichts, was du nicht brauchst.', featuresSubheading: 'Gemacht für Unternehmer, nicht für Data Scientists.', howItWorksHeading: 'So funktioniert es', faqHeading: 'Häufig gestellte Fragen', ctaNote: 'Jederzeit upgraden oder kündigen.', relatedGuides: 'Weitere Themen', footerHome: 'Startseite', footerPrivacy: 'Datenschutz', footerTerms: 'AGB', footerContact: 'Kontakt' },
  nl: { signIn: 'Inloggen', tryFree: 'Gratis proberen →', startFree: 'Gratis starten — geen kaart nodig →', seeHowItWorks: 'Bekijk hoe het werkt', heroNote: '10 gratis vragen per maand. Geen creditcard nodig.', featuresHeading: 'Alles wat je nodig hebt. Niets overbodigs.', featuresSubheading: 'Gemaakt voor ondernemers, niet voor data scientists.', howItWorksHeading: 'Hoe het werkt', faqHeading: 'Veelgestelde vragen', ctaNote: 'Upgrade wanneer je wilt. Altijd opzegbaar.', relatedGuides: 'Gerelateerde gidsen', footerHome: 'Home', footerPrivacy: 'Privacy', footerTerms: 'Voorwaarden', footerContact: 'Contact' },
  ar: { signIn: 'تسجيل الدخول', tryFree: 'جرّب مجانًا', startFree: 'ابدأ مجانًا — بدون بطاقة', seeHowItWorks: 'شاهد كيف يعمل', heroNote: '10 أسئلة مجانية كل شهر. لا حاجة لبطاقة ائتمان.', featuresHeading: 'كل ما تحتاجه. لا شيء غير ذلك.', featuresSubheading: 'مصمم لأصحاب الأعمال، وليس لعلماء البيانات.', howItWorksHeading: 'كيف يعمل', faqHeading: 'الأسئلة الشائعة', ctaNote: 'رقّي عند الحاجة. يمكنك الإلغاء في أي وقت.', relatedGuides: 'أدلة ذات صلة', footerHome: 'الرئيسية', footerPrivacy: 'الخصوصية', footerTerms: 'الشروط', footerContact: 'تواصل معنا' },
  sw: { signIn: 'Ingia', tryFree: 'Jaribu bure →', startFree: 'Anza bure — hakuna kadi inayohitajika →', seeHowItWorks: 'Ona jinsi inavyofanya kazi', heroNote: 'Maswali 10 bila malipo kila mwezi. Hakuna kadi ya benki inayohitajika.', featuresHeading: 'Kila kitu unachohitaji. Hakuna kinachozidi.', featuresSubheading: 'Imetengenezwa kwa ajili ya wafanyabiashara, si wanasayansi wa data.', howItWorksHeading: 'Jinsi inavyofanya kazi', faqHeading: 'Maswali yanayoulizwa mara kwa mara', ctaNote: 'Boresha wakati wowote. Ghairi wakati wowote.', relatedGuides: 'Miongozo inayohusiana', footerHome: 'Nyumbani', footerPrivacy: 'Faragha', footerTerms: 'Masharti', footerContact: 'Wasiliana nasi' },
  so: { signIn: 'Gal', tryFree: 'Bilaash isku day →', startFree: 'Bilaash ku bilow — kaarka lama baahna →', seeHowItWorks: 'Eeg sida ay u shaqeyso', heroNote: "10 su'aalood oo bilaash ah bishiiba. Kaarka deynta lama baahna.", featuresHeading: 'Wax kasta oo aad u baahan tahay. Waxba lagama tegin.', featuresSubheading: 'Loogu talagalay ganacsatada, ma aha khubarada xogta.', howItWorksHeading: 'Sida ay u shaqeyso', faqHeading: "Su'aalaha inta badan la isweydiiyo", ctaNote: 'Hagaaji marka aad doonto. Jooji goor kasta.', relatedGuides: 'Hagayaal la xiriira', footerHome: 'Guriga', footerPrivacy: 'Asturnaanta', footerTerms: 'Shuruudaha', footerContact: 'Nala soo xiriir' },
}

export default function SeoPage({
  h1, subheading, keyword, intro, problem, solution,
  features, howItWorks, faqs, cta, relatedPages, lang = 'en',
}: SeoPageProps) {
  const t = CHROME[lang] ?? CHROME.en
  const rtl = isRTL(lang)
  const nav = (href: string) => localePath(href, lang)

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} style={{ fontFamily: 'var(--font-dm, system-ui)', color: '#1a1916', background: '#f9f8f6' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href={nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background:'#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href={nav('/signin')} style={{ fontSize: 11, color: '#6b6760', textDecoration: 'none', padding: '7px 14px' }}>{t.signIn}</Link>
          <Link href={nav('/signin')} style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{t.tryFree}</Link>
        </div>
      </nav>

      <main>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,24px) clamp(40px,6vw,64px)', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#d08a59', background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 9999, padding: '4px 14px', marginBottom: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>
          {keyword}
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(26px,5vw,44px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 18, color: '#1a1916' }}>
          {h1}
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#6b6760', lineHeight: 1.7, marginBottom: 32, maxWidth: 580, margin: '0 auto 32px' }}>
          {subheading}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={nav('/signin')} style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}>
            {t.startFree}
          </Link>
          <Link href={nav('/')} style={{ fontSize: 13, color: '#6b6760', borderRadius: 9999, padding: '12px 22px', textDecoration: 'none', border: '1px solid #e8e6e1', background: '#fff', display: 'inline-block' }}>
            {t.seeHowItWorks}
          </Link>
        </div>
        <p style={{ fontSize: 10, color: '#a39e97', marginTop: 14 }}>{t.heroNote}</p>
      </section>

      {/* Intro paragraph — keyword-rich */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(16px,4vw,24px) clamp(40px,6vw,64px)' }}>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: '#4a4844' }}>{intro}</p>
      </section>

      {/* Problem */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 16, color: '#1a1916' }}>
            {problem.heading}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: '#4a4844' }}>{problem.body}</p>
        </div>
      </section>

      {/* Solution */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 16, color: '#1a1916' }}>
          {solution.heading}
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: '#4a4844' }}>{solution.body}</p>
      </section>

      {/* Features grid */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8, textAlign: 'center', color: '#1a1916' }}>
            {t.featuresHeading}
          </h2>
          <p style={{ fontSize: 13, color: '#6b6760', textAlign: 'center', marginBottom: 40, lineHeight: 1.6 }}>{t.featuresSubheading}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '20px 22px', borderRadius: 16, border: '1px solid #e8e6e1', background: '#f9f8f6' }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#1a1916' }}>{f.title}</div>
                <p style={{ fontSize: 12, color: '#6b6760', lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 36, color: '#1a1916' }}>
          {t.howItWorksHeading}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {howItWorks.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#d08a59', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sora, system-ui)', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#1a1916' }}>{s.title}</div>
                <p style={{ fontSize: 12, color: '#6b6760', lineHeight: 1.65, margin: 0 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — structured data friendly */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 32, color: '#1a1916' }}>
            {t.faqHeading}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }} itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #e8e6e1' : 'none', padding: '20px 0' }}
                itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1a1916' }} itemProp="name">{faq.q}</div>
                <div style={{ fontSize: 12, color: '#6b6760', lineHeight: 1.7 }} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <span itemProp="text">{faq.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,24px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 14, color: '#1a1916' }}>{cta.heading}</h2>
        <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.7, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>{cta.body}</p>
        <Link href={nav('/signin')} style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '14px 36px', textDecoration: 'none', display: 'inline-block' }}>
          {t.startFree}
        </Link>
        <p style={{ fontSize: 10, color: '#a39e97', marginTop: 14 }}>{t.ctaNote}</p>
      </section>

      {/* Related pages */}
      {relatedPages && relatedPages.length > 0 && (
        <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', padding: 'clamp(32px,5vw,48px) clamp(16px,4vw,24px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>{t.relatedGuides}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {relatedPages.map((p, i) => (
                <Link key={i} href={p.href} style={{ fontSize: 11, color: '#d08a59', textDecoration: 'none', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(208,138,89,.3)', background: 'rgba(208,138,89,.05)' }}>
                  {p.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background:'#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 11, fontWeight: 700 }}>AskBiz</span>
          <span style={{ fontSize: 10, color: '#a39e97', marginLeft: 8 }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[[nav('/'), t.footerHome], [nav('/privacy'), t.footerPrivacy], [nav('/terms'), t.footerTerms], ['mailto:hello@askbiz.co', t.footerContact]].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 11, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AskBiz",
        "applicationCategory": "BusinessApplication",
        "description": "Camera-first phone POS and daily business tracker for African market stalls, street vendors, and small shops. Scan to sell, take mobile money, and see your profit every night.",
        "url": "https://askbiz.co",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GBP",
          "description": "Free plan available. Growth from £19/month."
        },
        "operatingSystem": "Web browser"
      })}}/>

    </div>
  )
}
