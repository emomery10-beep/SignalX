import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

// Targets the "mobile POS Somalia" / "POS Soomaaliya" query cluster — where the
// SERP is dominated by $150–$300 handheld POS terminals, and the People-Also-Ask
// is "Can I use my phone as a POS machine?". This page flips the hardware bias
// (the phone IS the POS), answers the PAA directly for rich results / AEO, uses
// USD (Somalia is dollarized) and EVC Plus / Zaad / eDahab, and — since Somalia
// has no eTIMS/KRA — swaps that FAQ for an honest digital-records answer.

export const metadata: Metadata = {
  title: 'Meesha Iibka Mobiilka Soomaaliya — POS Taleefan | AskBiz',
  description:
    'POS mobiilka bilaash ah oo Soomaaliya. Taleefankaaga ka dhig mashiin POS — kamarad ku sawir, qaado EVC Plus, Zaad & eDahab, raadraac kaydka. Wuu shaqeeyaa offline.',
  keywords: [
    'mobile POS Somalia', 'POS Soomaaliya', 'meesha iibka mobiilka Soomaaliya', 'EVC Plus POS',
    'meesha iibka taleefan', 'POS app Somalia', 'bilaash POS Soomaaliya', 'Zaad POS', 'eDahab POS',
    'dukaan POS Soomaaliya', 'taleefan sida mashiinka POS', 'POS system Somalia', 'mashiin POS Muqdisho',
    'camera POS Somalia', 'point of sale app Somalia',
  ],
  alternates: { canonical: 'https://askbiz.co/mobile-pos-somalia' },
  openGraph: {
    type: 'website',
    url: 'https://askbiz.co/mobile-pos-somalia',
    title: 'Meesha Iibka Mobiilka Soomaaliya — Taleefankaaga ka dhig mashiin POS',
    description:
      'Uma baahnid mashiin $200 ah. AskBiz wuxuu taleefan Android ah ama iPhone kasta ka dhigayaa meesha iibka oo dhammaystiran — sawir-baaris kamarad, EVC Plus, Zaad & eDahab, lacag caddaan, kayd iyo faa’iido maalinle. Bilaash ku bilow.',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz — meesha iibka mobiilka Soomaaliya, taleefankaaga' }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Mobile POS · Soomaaliya"
      h1="Meesha iibka mobiilka Soomaaliya: taleefankaaga ka dhig mashiin POS"
      subheading="Uma baahnid mashiin $200 ah. AskBiz wuxuu taleefanka jeebkaaga ku jira ka dhigayaa meel iib oo dhammaystiran — kamaraddaada wax ku sawir, qaado EVC Plus, oo ogow saxda ah waxaad maanta samaysay. Bilaash ku bilow."
      intro="AskBiz waa meesha iibka mobiilka ee Soomaaliya oo ku shaqeeya taleefanka aad hore u haysatid — mashiin kaadh ma jiro, mashiin POS ma jiro, qalab la iibsado ma jiro. Kamaraddaada ku tilmaan badeecad si aad u iibisid, aqbal EVC Plus, Zaad, eDahab ama lacag caddaan, raadraac kaydkaaga, oo fiiday kasta arag dakhligaaga iyo faa’iidadaada. Waa app meesha iibka oo bilaash ah oo loogu talagalay dukaamada, suuqyada, salonnada, kushootada cuntada iyo ganacsiyada adeegga ee Soomaaliya — meesha iibka taleefan-hore oo ku shaqeysa taleefan Android ah ama iPhone kasta, xitaa marka aan internet la haysan. Wuxuu u shaqeeyaa dukaanka Muqdisho, suuqa Bakaaraha, Hargeysa iyo Soomaaliya oo dhan."
      problem={{
        heading: "Waa maxay sababta “meesha iibka mobiilka Soomaaliya” badanaa loola jeedo iibsi mashiin",
        body: "Marka aad raadiso meesha iibka mobiilka ee Soomaaliya, waxaad inta badan heli doontaa mashiinno POS oo gacan lagu qaado oo lagu iibiyo $150 ilaa $300 — iyadoo lagu daray waraaqda rasiidka, chaajarka iyo dejinta. Kushoot, meel suuq ah ama dukaan hal-qof ah, taasi waa lacag badan oo ku xidhan qalab jaban kara, la xadi kara, ama fadhiisan kara. Isla markaana, taleefanka jeebkaaga ku jira wuxuu horeba u leeyahay kamarad, shaashad iyo EVC Plus. Wuu qaban karaa shaqada oo dhan — mashiin gooni ah looma baahna.",
      }}
      solution={{
        heading: "Taleefankaagu waa mashiinka POS",
        body: "AskBiz wuxuu taleefankaas ka dhigayaa meel iib oo dhammaystiran. Kamaraddu waa baaraha — ku tilmaan badeecad, AskBizna wuu magacaabayaa oo qiimeeyaa, sidaas darteed qori baar-koodh ma jiro, qorista ma jirto. Qaado EVC Plus, Zaad, eDahab, lacag caddaan ama kaadh, iib kastana isaga ayaa is-diiwaangeliya. Kaydkaagu wuu is-cusboonaysiiyaa markaad iibisid, dhammaadka maalintana waxaad si sax ah u aragtaa waxaad samaysay iyo faa’iidadaada. Wuu sii shaqeeyaa marka shabakaddu go’do, wuxuuna ku shaqeeyaa taleefan Android ah ama iPhone kasta — mashiin ma leh, app store ma leh, qalab ma leh.",
      }}
      features={[
        { icon: '📷', title: 'Kamaraddaadu waa baaraha', body: 'Ku tilmaan badeecad si aad ugu darto — qori baar-koodh ma leh, qorista ma leh. Waa ka dhaqso badan taabashada mashiinka gacanta.' },
        { icon: '📲', title: 'EVC Plus, Zaad & lacag caddaan', body: 'Qaado EVC Plus, Zaad, eDahab, lacag caddaan ama kaadh. Lacag-bixin kasta waxay iskeed ula socotaa iibka.' },
        { icon: '📱', title: 'Taleefan kasta, qalab ma leh', body: 'Wuxuu ku shaqeeyaa browserka taleefanka Android ama iPhone ee aad hore u haysatid. Mashiin $200 ah lagama iibsado.' },
        { icon: '📶', title: 'Wuu shaqeeyaa offline', body: 'Sii iibi signal la’aan — iibinta lacag caddaan waxay ku kaydsantaa taleefanka wayna is-sync gareysaa marka aad internet ku soo laabatid.' },
        { icon: '📦', title: 'Kayd & dakhliga maalinlaha', body: 'Arag waxa iibinaya, waxa yaraanaya, iyo saxda ah waxaad samaysay oo faa’iidaysay maalin kasta.' },
        { icon: '🧾', title: 'Diiwaan buugaagtaada', body: 'Iib kasta waa la diiwaangeliyaa waana la soo saari karaa — diyaar u ah xisaabaadkaaga iyo xisaabiyahaaga.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Ku fur taleefankaaga', body: 'Mashiin ma leh, khidmad dejin ma leh. Wuxuu ku shaqeeyaa taleefan Android ah ama iPhone kasta oo aad hore u haysatid, toos ah browserka.' },
        { step: '2', title: 'Kamarad ku dar badeecooyinkaaga', body: 'Hal mar sawir alaabtaada. AskBiz wuu magacaabaa oo qiimeeyaa, isagoo dhisaya kataloogga dukaankaaga.' },
        { step: '3', title: 'Iibi oo qaado EVC Plus', body: 'Taabo ama sawir badeecooyinka, qaado EVC Plus, Zaad ama lacag caddaan, oo dhiib alaabta. Iibku isaga ayaa is-diiwaangeliya.' },
        { step: '4', title: 'Arag waxaad caawa samaysay', body: 'Dhammaadka maalinta, arag dakhligaaga, faa’iidadaada, alaabta ugu iibka badan iyo waxa aad dib u buuxin lahayd — xisaab ma leh, xaashi xisaabeed ma leh.' },
      ]}
      faqs={[
        { q: 'Ma isticmaali karaa taleefankayga sida mashiinka POS Soomaaliya?', a: 'Haa. AskBiz wuxuu taleefan Android ah ama iPhone kasta ka dhigayaa meesha iibka mobiilka oo dhammaystiran — kamaraddaadu waa baaraha, waxaadna qaadataa EVC Plus, Zaad, eDahab, lacag caddaan ama kaadh. Uma baahnid mashiin POS gooni ah ama mashiin kaadh; taleefanka jeebkaaga ku jira ayaa ah meesha iibka.' },
        { q: 'Ma jiraa meesha iibka mobiilka oo bilaash ah Soomaaliya?', a: 'Haa — AskBiz waa bilaash lagu bilaabo, kaadh looma baahna. Waxaad iibin kartaa, qaadan kartaa EVC Plus iyo lacag caddaan, raadraaci kartaa kaydka oo aragtaa dakhligaaga maalinlaha ah qorshaha bilaashka ah. Qorshayaasha la bixiyo waxay ku daraan su’aalo AI aan xad lahayn, laamo badan iyo xubno kooxeed.' },
        { q: 'Ma la shaqeeyaa EVC Plus, Zaad iyo eDahab?', a: 'Haa. EVC Plus, Zaad iyo eDahab way ku dhex jiraan, iyada oo ay weheliyaan lacag caddaan iyo kaadh. Lacag-bixin kasta waxaa lala jaanqaadaa iibka si buugaagtaadu isugu dheelitiraan dhammaadka maalinta.' },
        { q: 'Ma iibsan doonaa mashiin POS ama mashiin gacan?', a: 'Maya. Doorashooyinka “meesha iibka mobiilka” ee Soomaaliya intooda badan waa mashiinno gacan oo ku kacaya $150–$300. AskBiz midkaas ma u baahna — wuxuu ku shaqeeyaa taleefanka aad hore u haysatid, sidaas darteed qalab ma jiro, mashiin kaadh ma jiro, kharash hore ma jiro.' },
        { q: 'Ma diiwaan dhijitaal ah ayuu u hayaa iib kasta buugaagtayda?', a: 'Haa. AskBiz wuxuu diiwaan dhijitaal ah oo dhammaystiran u hayaa iib kasta — waqti, qiime iyo hab-bixineed — kaas oo aad u isticmaali kartid buugaagtaada ganacsi oo aad la wadaagi kartid xisaabiyahaaga. Uma baahnid inaad gacan ku qorto; iib kasta wuu iskeed u kaydsanayaa waana la soo dejin karaa markaad rabto.' },
        { q: 'Ma shaqeeyaa iyada oo aan internet lahayn?', a: 'Haa. Iibinta lacag caddaan way socotaa xiriir la’aan — iibka iyo kaydkaaguba wali way is-cusboonaysiiyaan, wax kastana si toos ah ayuu u sync gareeyaa marka aad internet ku soo laabatid. Lacag-bixinta kaadhka iyo lacagta mobiilka waxay u baahan yihiin xiriir toos ah si loo xaqiijiyo bixiyaha, sidaas darteed kuwaas way istaagaan ilaa signalku soo laabto.' },
        { q: 'Ganacsi noocee ah ayuu u yahay?', a: 'Ganacsi kasta oo Soomaali ah oo wax iibiya: dukaamada, suuqyada, kushootada, iibiyeyaasha wadooyinka, salonnada, dukaamada timo-jaridda, kushootada cuntada, dukaamada dayactirka iyo ganacsiyada adeegga — diiwaan-gashan ama maya. Haddii aad taleefan haysato, waad diyaar tahay.' },
      ]}
      cta={{
        heading: 'Taleefankaaga maanta ka dhig meesha iibka',
        body: 'Bilaash ku bilow taleefanka aad hore u sitid. Kamaraddaada wax ku sawir, qaado EVC Plus, oo ogow waxaad samaysay caawa — mashiin ma leh, qalab ma leh.',
      }}
      relatedPages={[
        { href: '/so', label: 'AskBiz Soomaali' },
        { href: '/point-of-sale', label: 'Meesha iibka taleefanka' },
        { href: '/mobile-pos-kenya', label: 'Mobile POS Kenya' },
        { href: '/pos-for-market-vendors', label: 'POS iibiyeyaasha suuqa' },
      ]}
    />
  )
}
