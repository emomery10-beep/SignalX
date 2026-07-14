import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

// NOTE: Kiswahili-language SEO landing page targeting "app ya kuuza duka" /
// "POS ya duka". Body content is Swahili; needs a native-speaker QA pass
// before / shortly after launch (same process used for the sw + so builds).
export const metadata: Metadata = {
  title: 'App ya Kuuza Duka kwa Simu — Chukua M-Pesa | Utauza (AskBiz)',
  description: 'App ya kuuza duka kwa simu yako: chukua M-Pesa, Airtel na MTN, fuatilia stock, na uone faida yako leo. Hakuna mashine, bure kuanza. Utauza (AskBiz).',
  keywords: ['app ya kuuza duka', 'app ya duka', 'POS ya duka Kenya', 'app ya kuuza kwa simu', 'M-Pesa POS duka', 'programu ya kuuza duka'],
  openGraph: {
    title: 'App ya Kuuza Duka kwa Simu — Chukua M-Pesa',
    description: 'Geuza simu yako kuwa POS: chukua M-Pesa, fuatilia stock, uone faida yako leo. Bure kuanza.',
    url: 'https://askbiz.co/app-ya-duka',
  },
  alternates: {
    canonical: 'https://askbiz.co/app-ya-duka',
    languages: {
      'sw': 'https://askbiz.co/app-ya-duka',
      'en': 'https://askbiz.co/free-mpesa-pos',
    },
  },
}

export default function Page() {
  return (
    <SeoPage
      keyword="App ya kuuza duka"
      h1="App ya Kuuza Duka kwa Simu Yako — Chukua M-Pesa"
      subheading="Geuza simu uliyo nayo kuwa POS kamili. Chukua M-Pesa, Airtel Money, MTN au taslimu, fuatilia stock, na uone ulichoingiza leo. Bure kuanza — hakuna mashine, hakuna ada ya kila mwezi."
      intro="Wafanyabiashara wengi wa maduka madogo, vibanda na masoko wanaendesha biashara nzima kwenye daftari, kwa sababu mifumo mingi ya POS imetengenezwa kwa ajili ya maduka makubwa yenye kompyuta, mashine ya kadi na ada ya kila mwezi. Utauza (inayojulikana kama AskBiz nje ya Afrika Mashariki) imetengenezwa kwa ajili ya mtumiaji wa daftari — si mwenye duka kubwa. Unafungua app kwenye simu yoyote ya Android au iPhone, unaongeza bidhaa kwa kupiga picha au kuscan na kamera, na unachukua malipo kwa M-Pesa, Airtel Money, MTN Mobile Money au taslimu. Mauzo yanajirekodi yenyewe, stock inapungua yenyewe, na jioni unaona ulichouza, ulichoingiza na kinachokaribia kuisha — bila spreadsheet wala mashine yoyote ya kununua. Ni app halisi ya kuuza duka kwa simu, si mfumo wa duka kubwa uliobanwa kwenye simu."
      problem={{
        heading: "Kwa nini POS za kawaida hazifai duka dogo",
        body: "Mwenye duka dogo hawezi kusimama katikati ya mauzo aandike jina la bidhaa kwenye skrini, hawezi kununua mashine ya POS ya KES 45,000 kwa kibanda kinachofungwa kila jioni, na mara nyingi hana muda wa kusoma maelekezo marefu ya Kiingereza wakati foleni inaongezeka. POS nyingi zinadhania kuna kaunta ya kudumu, umeme wa uhakika, internet ya uhakika na mtu anayeweza kusoma manual. Duka la sokoni halina hivyo. Ndiyo maana app zinabaki bila kutumika, na mfanyabiashara anabaki kwenye daftari — akipoteza kumbukumbu ya kinachouzwa, kinachoisha, na faida halisi baada ya kuhesabu stock na M-Pesa.",
      }}
      solution={{
        heading: "Utauza inatumia kamera, hivyo kuuza ni haraka kuliko kuandika",
        body: "Badala ya kuandika, unatumia kamera. Piga picha ya bidhaa, Utauza itaipa jina na bei; scan barcode, itaingia kwenye kikapu. Chukua M-Pesa, Airtel, MTN au taslimu, na mauzo yanajirekodi. Vitufe vikubwa, picha badala ya maandishi marefu, na kufuta kwa mguso mmoja — inafanya kazi hata kwa mfanyabiashara mwenye shughuli asiyeweza kusoma manual, na inaendelea kufanya kazi hata mtandao ukikatika. Jioni unaona mapato yako, bidhaa zinazouzwa zaidi, na cha kuongeza stock — vyote kwenye simu ile ile. Hakuna mashine, hakuna kaunta, hakuna spreadsheet — ni daftari lako lile lile, ila haraka na wazi zaidi.",
      }}
      features={[
        { icon: '📷', title: 'Kamera ndiyo POS', body: 'Piga picha au scan bidhaa ili kuiongeza. Utauza inaweza kuipa jina na bei kutoka picha — haraka kuliko kuandika daftarini.' },
        { icon: '📲', title: 'M-Pesa, Airtel & MTN', body: 'Chukua pesa za simu moja kwa moja. Malipo yanaunganishwa na mauzo na jumla ya siku bila kuhesabu kwa mkono.' },
        { icon: '👆', title: 'Kwa mikono yenye shughuli', body: 'Vitufe vikubwa, picha za bidhaa badala ya maandishi marefu, na kufuta kwa mguso mmoja — inatumika kwa kasi.' },
        { icon: '📶', title: 'Inafanya kazi bila mtandao', body: 'Endelea kuuza mtandao ukikatika. Mauzo yanahifadhiwa simuni na kusawazishwa mtandao ukirudi.' },
        { icon: '📦', title: 'Inajua stock yako', body: 'Kila mauzo yanapunguza stock, hivyo unaona kinachokaribia kuisha kabla hakijaisha siku ya shughuli.' },
        { icon: '🌙', title: 'Siku nzima kwa mtazamo mmoja', body: 'Mapato ya jioni, bidhaa bora na orodha ya kuongeza stock — bila kuhesabu daftari wala spreadsheet.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Fungua kwenye simu yako', body: 'Hakuna mashine, hakuna kaunta, hakuna ada ya kuanza. Inafanya kazi kwenye simu yoyote ya Android au iPhone uliyo nayo.' },
        { step: '2', title: 'Piga picha bidhaa zako mara moja', body: 'Ongeza bidhaa kwa picha au barcode. Utauza inazipa jina na bei, ikijenga orodha ya duka lako.' },
        { step: '3', title: 'Uza haraka', body: 'Gusa bidhaa au scan, chukua M-Pesa au taslimu, mpe mteja bidhaa. Mauzo yanarekodiwa papo hapo.' },
        { step: '4', title: 'Funga na uangalie', body: 'Ona ulichoingiza na cha kuongeza stock jioni — kisha funga. Vitabu tayari vimekamilika.' },
      ]}
      faqs={[
        { q: 'Utauza ni nini? Ni sawa na AskBiz?', a: 'Ndiyo — Utauza na AskBiz ni bidhaa moja. AskBiz ni jina la kimataifa; Utauza (“utauza” kwa Kiswahili) ni jina la Afrika Mashariki. App moja, akaunti moja, taarifa zile zile. Ukituona kwa jina lolote, uko mahali sahihi.' },
        { q: 'Je, ni app ya bure kweli ya kuuza duka?', a: 'Ndiyo. Mpango wa bure unakuruhusu kuuza, kuchukua pesa za simu na taslimu, kufuatilia stock, na kuona mapato ya siku bila kadi na bila muda wa majaribio kuisha. Unalipa tu ukitaka nyongeza kama maswali ya AI bila kikomo, matawi mengi, au wafanyakazi.' },
        { q: 'Je, inachukua M-Pesa kweli?', a: 'Ndiyo — M-Pesa, Airtel Money na MTN Mobile Money zinaungwa mkono moja kwa moja. Mteja analipa kwenye namba yako na malipo yanaunganishwa na mauzo na jumla ya siku bila wewe kuhesabu kwa mkono jioni.' },
        { q: 'Je, ninahitaji mashine ya kadi au kifaa chochote?', a: 'Hapana. Simu uliyo nayo ndiyo POS nzima. Kamera inafanya kazi ya kuscan, pesa za simu na taslimu zinafanya malipo, na hakuna mashine, printa wala scanner ya kununua. Ndiyo maana inaweza kuwa bure kuanza.' },
        { q: 'Je, itafanya kazi bila internet?', a: 'Ndiyo. Unaweza kuendelea kuuza bila mtandao — mauzo yanahifadhiwa simuni na kusawazishwa mtandao ukirudi, hivyo eneo lisilo na mtandao sokoni halikupotezei mauzo.' },
        { q: 'Je, inafaa kwa KRA na eTIMS?', a: 'Utauza inatunza kumbukumbu safi ya kila mauzo, ambayo ndiyo unayohitaji wakati wa eTIMS, VAT, au kumpa mhasibu takwimu. Imetengenezwa ili kumbukumbu zako ziwe tayari badala ya kitu unachotakiwa kujenga upya baadaye.' },
      ]}
      cta={{
        heading: "Weka daftari chini",
        body: "Piga picha bidhaa zako, chukua M-Pesa, na funga siku ukijua hasa ulichoingiza. Bure kuanza kwenye simu uliyo nayo.",
      }}
      relatedPages={[
        { href: '/sw', label: 'Utauza kwa Kiswahili' },
        { href: '/utauza', label: 'Utauza ni nini?' },
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS (English)' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
      ]}
    />
  )
}
