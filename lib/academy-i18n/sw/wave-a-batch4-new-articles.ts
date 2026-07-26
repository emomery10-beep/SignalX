import type { LocaleTranslations } from "../../academy-i18n-loader";

// Kiswahili (sw) translations — Wave A batch 4 (new articles).
// Glossary reused exactly from sibling batch 1 agent — see PR/task notes.
export const waveABatch4NewArticlesTranslations: LocaleTranslations = {
  "purchase-orders-guide-askbiz": {
    title: "Maagizo ya Ununuzi: Unda, Tuma na Pokea Maagizo ya Wasambazaji katika AskBiz POS",
    description:
      "Jinsi tile ya Maagizo ya Ununuzi katika POS > Operations inavyofanya kazi kwa uhalisia — kutengeneza agizo lenye kiasi kinachopendekezwa kiotomatiki cha kuagiza tena, kulituma kwa msambazaji wako kupitia WhatsApp, na kupokea hisa (ikiwa ni pamoja na uwasilishaji wa sehemu) bila kugusa jedwali la excel.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "maagizo ya ununuzi",
      "maagizo ya wasambazaji",
      "kujaza tena hisa",
      "kuagiza tena",
      "POS",
      "AskBiz",
      "hisa",
      "agizo lililobaki",
      "msambazaji WhatsApp",
      "kupokea hisa",
    ],
    keyTakeaways: [
      "Maagizo ya Ununuzi yako katika POS > Operations > Retail, yanafunguliwa kupitia tile ya 📋 — ni kichupo maalum, si dirisha ibukizi lililobandikwa juu ya Hisa.",
      "Kuanzisha agizo jipya kunajaza kiotomatiki kila bidhaa iliyofikia au chini ya kiwango chake cha hisa kidogo, ikiwa na kiasi kinachopendekezwa cha kujaza tena hadi mara mbili ya kiwango hicho na bei ya mwisho ya gharama iliyorekodiwa ya bidhaa — bado unaweza kuhariri au kuondoa mstari wowote, au kuongeza bidhaa mwenyewe.",
      "Kutuma agizo la ununuzi (PO) hutuma ujumbe kwenye nambari ya WhatsApp ya msambazaji wako ukiwa na orodha ya bidhaa; kama kiolezo cha kiotomatiki hakipatikani, hurudi kwenye kiungo cha wa.me kilichojazwa awali unachobonyeza wewe mwenyewe kutuma. Msambazaji asiye na nambari ya simu kwenye rekodi hawezi kutumiwa kabisa.",
      "Kupokea hisa hufanywa kwa kila mstari, hivyo uwasilishaji wa sehemu ni jambo la kawaida: agizo huwa 'Sehemu' mara tu mstari wowote unapokosa kiasi, na hubadilika kuwa 'Limepokelewa' tu pale kila mstari unapokuwa umekamilika.",
      "Unachoweza kufanya kunategemea jukumu lako la POS — Mmiliki na Meneja wana ufikiaji kamili, Hisa (Inventory) inaweza kuunda na kupokea lakini si kutuma, na Msimamizi/Meneja wa Tawi wanaweza kuangalia tu.",
    ],
    content: [
      {
        heading: "Mahali pa kuipata",
        body: "Maagizo ya Ununuzi ni tile ndani ya POS > Operations, katika sekta ya Retail — tafuta ikoni ya 📋. Kuigusa hufungua kichupo maalum cha Maagizo ya Ununuzi kikiwa na orodha yake, vichujio (Yote / Maagizo Yaliyobaki / Yaliyopokelewa), na kitufe cha '+ Agizo Jipya' kona ya juu kulia. Kama mtiririko wako wa kujaza tena hisa mpaka sasa umekuwa ni kutuma ujumbe kwa msambazaji kutoka simu yako mwenyewe na kutumaini ulikumbuka kila bidhaa, hii ndiyo zana inayobadilisha tabia hiyo — inaishi ndani ya programu ile ile unayotumia kuuza, hivyo hakuna kitu tofauti cha kuingia.",
      },
      {
        heading: "Kuanzisha agizo jipya",
        body: "Gusa '+ Agizo Jipya' na utaulizwa msambazaji kwanza — chagua aliyepo kutoka kwenye orodha, au ongeza mpya papo hapo kwa jina na nambari ya simu tu. Nambari ya simu ni muhimu — ndiyo inayotumika baadaye katika hatua ya kutuma kwa WhatsApp, na bila hiyo, agizo hilo haliwezi kutumwa, linaweza tu kuundwa na kufuatiliwa kwa mkono.\n\nChini ya msambazaji, orodha ya bidhaa hufunguka tayari imejaa: AskBiz huangalia kila bidhaa iliyopo au chini ya kiwango chake cha hisa kidogo na kuiongeza kama mstari, ikiwa na kiasi kinachopendekezwa cha kuagiza kilichokokotolewa kujaza hisa hadi karibu mara mbili ya kiwango hicho, na gharama ya kila kitu iliyotolewa kutoka bei ya mwisho ya gharama iliyorekodiwa ya bidhaa. Si lazima ukubali chochote kati ya hivi — hariri kiasi au gharama kwenye mstari wowote, futa mistari usiyoitaka, au tumia orodha ya 'Ongeza bidhaa' chini kuleta chochote kingine kutoka katalogi yako ambacho hakikuwa na hisa kidogo. Jumla inayoendelea husasishwa unavyoendelea, na sehemu ya maelezo chini ni mahali pazuri pa maagizo ya usafirishaji au namba ya rejea anayohitaji msambazaji wako.",
      },
      {
        heading: "Hali tano za agizo",
        body: "Kila agizo liko katika mojawapo ya hali tano, linaonyeshwa kama kibonge chenye rangi kwenye kadi yake: Rasimu (limeundwa lakini halijatumwa bado), Limeagizwa (limetumwa kwa msambazaji, hakuna kilichopokelewa), Sehemu, Limepokelewa, au Limefutwa. Sehemu inafaa kueleweka peke yake — si hatua tofauti unayochagua, ni kile agizo linakuwa kiotomatiki mara tu unapokuwa umepokea baadhi lakini si vyote ulivyoagiza. Kama uliagiza vipande 50 vya kitu fulani na 30 vikafika leo huku vilivyobaki vikija wiki ijayo, agizo hubadilika kuwa Sehemu mara tu unaporekodi vile 30, na hubaki hapo — likionyesha hasa kilichobaki — hadi vile 20 vilivyobaki vinapofika na kubadilika kuwa Limepokelewa lenyewe. Kichujio cha Maagizo Yaliyobaki juu ya orodha ni maagizo yote yaliyo katika hali ya Sehemu kwa sasa, hivyo unaweza kuona kwa haraka ni uwasilishaji gani bado unadaiwa kwako.",
      },
      {
        heading: "Kutuma agizo kwa msambazaji wako",
        body: "Fungua agizo lolote la Rasimu au Limeagizwa kisha gusa Tuma (huandikwa Tuma Tena mara agizo linapokuwa limeshatumwa mara moja). AskBiz hutengeneza ujumbe wenye orodha ya bidhaa — kila mstari kama \"bidhaa x kiasi @ gharama\", jumla, na maelezo yako kama uliongeza — na hujaribu kuutuma kama ujumbe wa kiolezo cha kiotomatiki cha WhatsApp moja kwa moja kwa nambari ya msambazaji. Kama njia hiyo ya kiotomatiki haipatikani, hurudi kwenye kufungua kiungo cha wa.me kilichojazwa awali kwenye kichupo kipya chenye ujumbe uleule tayari umeandikwa, hivyo unabofya tu kutuma mwenyewe katika WhatsApp. Vyovyote vile, agizo la Rasimu hubadilika kuwa Limeagizwa mara ya kwanza linapotumwa, na muda wa kutuma husasishwa kila linapotumwa tena. Kama rekodi ya msambazaji haina nambari ya simu, kitufe cha Tuma huzimwa na kidokezo hukueleza kuongeza moja — hakuna njia ya kuzunguka hitaji la nambari.",
      },
      {
        heading: "Kupokea hisa",
        body: "Bidhaa zinapofika, fungua agizo na gusa 'Pokea hisa'. Utaona kila mstari ukiwa na sehemu ya kuingiza tayari imewekwa kiasi kizima kilichobaki (kilichoagizwa ukiondoa kilichokwisha pokelewa kwenye mstari huo) — mistari iliyoshapokelewa kamili huonekana ya kijivu na haiwezi kupokea zaidi. Punguza kiasi chochote kama sehemu tu ya mstari huo imefika, kisha thibitisha.\n\nKuthibitisha ndiyo kunaposogeza hisa kwa uhalisia: kila mstari huongeza moja kwa moja idadi ya hisa hai ya bidhaa hiyo katika hisa yako (takwimu ileile ambayo tili yako na skrini ya Muhtasari zinasoma), na hali ya agizo hukokotolewa upya kutoka takwimu mpya — Limepokelewa kama kila mstari sasa umekamilika, Sehemu kama baadhi ya mistari bado inakosa kiasi, au haibadiliki vinginevyo. Unaweza kurudi na kupokea dhidi ya agizo lilelile zaidi ya mara moja kadri uwasilishaji unavyofika kwa hatua; kila upokeaji huuliza tu kuhusu kilichobaki.",
      },
      {
        heading: "Nani anaweza kufanya nini",
        body: "Vitendo vya agizo la ununuzi vimefungwa kulingana na jukumu la POS, si swichi moja ya wote-au-hakuna. Mmiliki na Meneja wanaweza kuangalia, kuunda, kutuma, kupokea, na kuweka maagizo kama yamelipwa. Jukumu la Hisa (Inventory) linaweza kuunda na kupokea maagizo (na kuyaweka kama yamelipwa) lakini haliwezi kuyatuma — kutuma kumeachwa kwa makusudi kwa uongozi. Majukumu ya Msimamizi na Meneja wa Tawi yanaweza kuangalia maagizo na hali yake lakini hayawezi kuunda, kutuma, au kupokea dhidi yao. Kama kitufe kinaonekana kimezimwa au mtu anakuambia hawezi kuona chaguo la Tuma, angalia jukumu lake alilopewa kabla ya kudhani kuna hitilafu.",
      },
    ],
    keyTakeawaysNote: undefined,
    faq: [
      {
        q: "Kwa nini AskBiz iliongeza bidhaa kwenye agizo langu jipya la ununuzi kabla sijaandika chochote?",
        a: "Fomu ya kuunda hujaza kiotomatiki kila bidhaa iliyopo au chini ya kiwango chake cha hisa kidogo, ikiwa na kiasi kinachopendekezwa cha kujaza tena hadi karibu mara mbili ya kiwango hicho na bei ya mwisho ya gharama kwenye rekodi. Ni mwanzo tu, si agizo la mwisho — hariri, ondoa, au ongeza mistari kwa uhuru kabla ya kuhifadhi.",
      },
      {
        q: "'Sehemu' inamaanisha nini kwa uhalisia kwenye agizo?",
        a: "Inamaanisha agizo lililobaki: baadhi lakini si vyote vilivyoagizwa vimefika. Huwekwa kiotomatiki mara tu unapopokea kiasi chochote kilicho chini ya kiasi kizima kilichobaki kwenye angalau mstari mmoja, na agizo hubaki Sehemu hadi kila mstari upokelewe kamili.",
      },
      {
        q: "Naweza kutuma agizo la ununuzi bila nambari ya simu ya msambazaji?",
        a: "Hapana. Kutuma huwasilisha agizo kama ujumbe wa WhatsApp (au kiungo cha WhatsApp kilichojazwa awali kama njia mbadala), hivyo msambazaji anahitaji nambari ya simu kwenye rekodi kabla hujamtumia. Bado unaweza kuunda na kufuatilia agizo bila hiyo — huwezi tu kulituma hadi nambari iongezwe.",
      },
      {
        q: "Nikipokea sehemu ya agizo leo, naweza kupokea kilichobaki baadaye?",
        a: "Ndiyo. Kila upokeaji huuliza tu kuhusu kiasi kilichobaki, na unaweza kufungua agizo lilelile na kupokea dhidi yake tena kadri uwasilishaji wa baadaye unavyofika. Hisa huongezwa kidogo kidogo kila wakati — hakuna kinachofutwa au kuandikwa upya kati ya upokeaji.",
      },
      {
        q: "Ni majukumu gani ya wafanyakazi yanaweza kutuma agizo la ununuzi kwa msambazaji?",
        a: "Ni Mmiliki na Meneja pekee wanaoweza kutuma. Wafanyakazi wa jukumu la Hisa wanaweza kuunda na kupokea maagizo lakini si kuyatuma, na majukumu ya Msimamizi/Meneja wa Tawi yanaweza kuangalia maagizo pekee, si kuyafanyia kitendo.",
      },
    ],
  },
  "connect-marketing-ads-sources-askbiz": {
    title: "Unganisha Data Yako ya Masoko: Meta Ads, Google Ads, Google Analytics, Mailchimp na Klaviyo",
    description: "Jinsi ya kuunganisha vyanzo vitano vya Masoko na Matangazo katika AskBiz — Meta Ads, Google Ads, Google Analytics, Mailchimp na Klaviyo — na kile kila kimoja kinacholetea dashibodi yako.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "Meta Ads", "Google Ads", "Google Analytics", "Mailchimp", "Klaviyo",
      "vyanzo vya Masoko na Matangazo", "AskBiz Sources", "matumizi ya matangazo", "ROAS",
      "masoko ya barua pepe", "kuunganisha data ya masoko",
    ],
    keyTakeaways: [
      "Sources > Marketing & Ads ina viunganishi vitano: Meta Ads, Google Ads, Google Analytics, Mailchimp na Klaviyo — kila kimoja huleta sehemu tofauti ya utendaji wako wa masoko ndani ya AskBiz.",
      "Vinne kati ya vitano huunganishwa kwa bofya moja kupitia OAuth (Meta Ads, Google Ads, Google Analytics, Mailchimp). Klaviyo ni tofauti — unabandika ufunguo wa siri wa API badala yake, kwa sababu Klaviyo haitoi mtiririko wa programu ya OAuth kwa aina hii ya ufikiaji wa kusoma.",
      "Kila chanzo huleta namba tofauti: Meta Ads na Google Ads huleta matumizi/ROAS/CPM/CPC, Google Analytics huleta trafiki ya tovuti na funeli, Mailchimp huleta utendaji wa kampeni, na Klaviyo huleta mapato yanayohusishwa na barua pepe.",
      "Katika mpango wa Free unaweza kuunganisha vyanzo vitatu vya data kwa jumla, katika kategoria yoyote — hivyo mchanganyiko wa mfano Meta Ads, Mailchimp na POS yako tayari hutumia nafasi yako yote. Mipango ya Growth na Business huondoa kikomo kabisa.",
      "Hivi si viunganishi vya kujaza tu — kila kimoja kina mantiki halisi ya usawazishaji nyuma yake, hivyo baada ya kuunganishwa hupokea data hai kwa mfululizo, si uingizaji wa mara moja tu.",
    ],
    content: [
      {
        heading: "Mahali pa kuvipata",
        body: "Fungua Sources kutoka menyu kuu ya AskBiz. Viunganishi vimepangwa kwa kategoria, na Marketing & Ads ni mojawapo ya makundi hayo, ikiwa karibu na E-Commerce, Accounting, Payments na mengineyo. Ndani yake utapata kadi tano: Meta Ads, Google Ads, Google Analytics, Mailchimp na Klaviyo. Unaweza pia kutumia sanduku la utafutaji juu ya ukurasa wa Sources — kuandika \"ads\", \"mailchimp\" au \"klaviyo\" huchuja moja kwa moja hadi kadi husika. Kila kadi huonyesha maelezo mafupi ya kile inachosawazisha, na kitufe cha Connect. Baada ya kuunganishwa, chanzo huhamia juu kwenye orodha ya \"Connected\" juu ya ukurasa, ambako unaweza kuanzisha usawazishaji wa mkono au kukatisha muunganisho wakati wowote.",
      },
      {
        heading: "Meta Ads — utendaji wa matangazo ya Facebook na Instagram",
        body: "Meta Ads huunganisha akaunti yako ya matangazo ya Facebook na Instagram. Bofya Connect na AskBiz itakupeleka kwa Meta kuingia na kuidhinisha ufikiaji wa kusoma kwenye akaunti zako za matangazo — hakuna cha kuandika au kubandika. Baada ya kuidhinishwa, husawazisha matumizi yako ya matangazo pamoja na ROAS (kurudi kwa matumizi ya matangazo), CPM (gharama kwa maonyesho elfu moja) na CPC (gharama kwa bofya), hivyo unaweza kuona bajeti yako ya matangazo inarudisha nini kwa uhalisia bila kufungua Ads Manager tofauti. Hii ni muhimu kwa kuunganisha unachotumia kwenye matangazo ya Facebook na Instagram na kile kinachoingia kwenye mauzo yako — hasa kama pia unaendesha Instagram Shopping au duka la Shopify kupitia AskBiz, kwa kuwa matumizi na mapato huketi bega kwa bega.",
      },
      {
        heading: "Google Ads — utendaji wa kampeni za utafutaji",
        body: "Google Ads hufanya kazi vivyo hivyo na Meta Ads: bofya Connect, ingia kwenye akaunti yako ya Google, na uidhinishe ufikiaji wa kusoma tu kwenye akaunti zako za matangazo. Husawazisha matumizi ya kampeni yako ya utafutaji, ROAS na uongofu, hivyo unaweza kufuatilia kile matangazo yako ya utafutaji ya Google yanachogharimu dhidi ya yanachobadilisha kuwa. Kama tayari unaendesha Google Ads kuleta trafiki kwenye tovuti au duka, kuiunganisha hapa kunamaanisha matumizi hayo yanaonekana karibu na namba zako nyingine za masoko na mapato badala ya kukaa peke yake katika akaunti tofauti ya Google Ads.",
      },
      {
        heading: "Google Analytics — trafiki ya tovuti na funeli",
        body: "Google Analytics ni kiunganishi tofauti na Google Ads, ingawa vyote viwili hupitia kuingia kwa Google. Hiki huunganisha kwa mali ya GA4 kwenye tovuti yako — kinahusu kinachotokea baada ya mtu kufika kwenye tovuti yako, si ulichotumia kumleta hapo. Husawazisha trafiki na vipindi, data ya funeli (mahali watembeleaji wanapoacha kabla ya kuongoka), na mapato ya biashara ya kielektroniki kama una ufuatiliaji wa e-commerce wa GA4 umewekwa. Bofya Connect, ingia kwa akaunti ya Google inayofikia mali yako ya GA4, na uidhinishe ufikiaji. Kuoanisha hii na Google Ads au Meta Ads inakupa picha kamili zaidi: ulichotumia kumleta mtu tovuti yako, na alichofanya baada ya kufika.",
      },
      {
        heading: "Mailchimp — utendaji wa kampeni za barua pepe",
        body: "Mailchimp pia huunganisha kupitia OAuth — bofya Connect, ingia Mailchimp, na uidhinishe ufikiaji. Husawazisha kampeni zako pamoja na viwango vya kufungua, viwango vya kubofya na data ya hadhira, hivyo utendaji wako wa masoko ya barua pepe huketi kwenye dashibodi ileile na mauzo na matumizi ya matangazo yako badala ya kuwa katika ripoti za Mailchimp pekee.",
      },
      {
        heading: "Klaviyo — kile kilicho tofauti: ufunguo wa API uliobandikwa, si OAuth",
        body: "Klaviyo ndicho kigeni miongoni mwa vitano. Badala ya kitufe cha Connect kinachokupeleka kuingia, utaona sehemu inayoomba ufunguo wa siri wa API. Kuupata, ingia Klaviyo, nenda Account, kisha Settings, kisha API Keys, na uunde (au unakili) ufunguo wa siri wa API kutoka pale. Bandika kwenye sehemu husika katika AskBiz na uunganishe. Hii ni tofauti ya makusudi katika jinsi kiunganishi kinavyofanya kazi, si mtiririko wa OAuth uliovunjika — API ya Klaviyo kwa aina hii ya ufikiaji wa kusoma wa akaunti ni ya ufunguo, si ya OAuth, hivyo ufunguo wa siri ndiyo njia sahihi na inayotarajiwa ya kuunganisha. Kwa kuwa ufunguo wa siri wa API ni kitambulisho halisi, uutendee kama unavyotendea nenosiri: uzalishe tu kutoka akaunti yako mwenyewe ya Klaviyo, na usiushiriki popote isipokuwa kubandika moja kwa moja kwenye AskBiz. Baada ya kuunganishwa, Klaviyo husawazisha mapato yanayohusishwa na barua pepe, mitiririko yako (mfululizo wa barua pepe wa kiotomatiki), viwango vya kufungua na uhusishaji — hivyo unaweza kuona ni kiasi gani cha mapato barua pepe zako za Klaviyo zinazoleta, si tu ni watu wangapi walifungua.",
      },
      {
        heading: "Kikomo cha vyanzo katika mpango wa Free",
        body: "Mpango wa Free huruhusu vyanzo vitatu vya data vilivyounganishwa kwa jumla, na kikomo hicho hutumika katika kategoria zote pamoja — si vitatu kwa kila kategoria. Hivyo ukiunganisha Meta Ads, Mailchimp na POS yako ya AskBiz, umekwisha tumia nafasi yako yote na ungehitaji kukatisha kimoja kabla ya kuongeza cha nne, kiwe Klaviyo, Shopify, au kingine chochote. Mipango ya Growth na Business huondoa kikomo hiki kabisa, ikikupa muunganisho usio na kikomo katika orodha nzima ya viunganishi vya AskBiz. Kama data ya masoko ni kipaumbele kwako, inafaa kuamua mapema ni vyanzo vipi muhimu zaidi katika mpango wa Free, au kupandisha daraja kama unataka viunganishi vyote vitano vya Marketing & Ads pamoja na vyanzo vyako vya mauzo na uhasibu kwa wakati mmoja.",
      },
      {
        heading: "Kinachotokea baada ya kuunganisha",
        body: "Chanzo kikishaunganishwa, huonekana kwenye orodha ya Connected juu ya ukurasa wa Sources ikiwa na kiashiria cha hali na muda wa \"usawazishaji wa mwisho\". Hivi si uingizaji wa mara moja — kila kimoja cha vitano kina mantiki halisi ya usawazishaji nyuma yake inayoendelea kuleta data mpya kwa mfululizo, na unaweza pia kubofya \"Sawazisha sasa\" kwenye chanzo chochote kilichounganishwa kama unataka namba za hivi karibuni mara moja badala ya kusubiri usawazishaji unaofuata wa kiotomatiki. Kama chanzo kikionyesha hali ya hitilafu — kwa mfano kama ufunguo wa API wa Klaviyo umeondolewa, au tokeni ya OAuth inahitaji kuidhinishwa upya — ujumbe wa hitilafu kwenye mstari huo utakuambia kilichoharibika, na kuunganisha upya ni mchakato uleule wa kuunganisha mara ya kwanza.",
      },
    ],
    faq: [
      {
        q: "Kwa nini Klaviyo inaomba ufunguo wa API badala ya kuniachia niingie tu kama vingine?",
        a: "Meta Ads, Google Ads, Google Analytics na Mailchimp zote hutumia OAuth, hivyo unaingia na kuidhinisha ufikiaji kwa bofya moja. Kiunganishi cha Klaviyo hutumia ufunguo wa siri wa API badala yake, kwa sababu hiyo ndiyo njia sahihi ya kutoa aina hii ya ufikiaji wa kusoma kwa API ya Klaviyo. Uzalishe kutoka Klaviyo chini ya Account, kisha Settings, kisha API Keys, kisha ubandike kwenye AskBiz.",
      },
      {
        q: "Je, Google Ads na Google Analytics zinatumia muunganisho ule ule?",
        a: "Hapana — ni viunganishi viwili tofauti kwenye ukurasa wa Sources, ingawa vyote viwili vinakupeleka kupitia kuingia kwa Google. Google Ads husawazisha matumizi yako ya matangazo na utendaji wa kampeni; Google Analytics husawazisha trafiki ya tovuti yako na funeli kutoka mali ya GA4. Unaweza kuunganisha moja peke yake, au zote mbili.",
      },
      {
        q: "Niko kwenye mpango wa Free — naweza kuunganisha vyanzo vyote vitano vya Marketing & Ads?",
        a: "Ni kama ndivyo vyanzo pekee unavyounganisha. Mpango wa Free huruhusu vyanzo vitatu vya data kwa jumla, katika kategoria zote pamoja, si vitatu kwa kategoria. Kuunganisha vyanzo vyote vitano vya Marketing & Ads pamoja na kitu kingine chochote — POS yako, Shopify, programu ya uhasibu — kutazidi kikomo hicho. Mipango ya Growth na Business yana muunganisho usio na kikomo.",
      },
      {
        q: "Je, ni salama kubandika ufunguo wangu wa API wa Klaviyo katika AskBiz?",
        a: "Sehemu hiyo ni ya aina ya nenosiri, na hutumika tu kuthibitisha ufikiaji wa kusoma wa AskBiz kwenye akaunti yako ya Klaviyo. Uutendee ufunguo huo kama unavyotendea kitambulisho kingine chochote cha akaunti — uzalishe tu kutoka akaunti yako mwenyewe ya Klaviyo, na usiubandike mahali popote isipokuwa moja kwa moja kwenye sehemu ya muunganisho ya AskBiz.",
      },
      {
        q: "Ni nini hasa kila chanzo kinachosawazisha — ni uingizaji wa mara moja?",
        a: "Hapana, hakuna hata kimoja cha vitano kilicho uingizaji wa mara moja. Meta Ads na Google Ads husawazisha matumizi, ROAS, CPM/CPC na uongofu; Google Analytics husawazisha trafiki, vipindi, funeli na mapato ya biashara ya kielektroniki; Mailchimp husawazisha kampeni, viwango vya kufungua, viwango vya kubofya na hadhira; Klaviyo husawazisha mapato ya barua pepe, mitiririko, viwango vya kufungua na uhusishaji. Kila kimoja huendelea kusawazisha kwa mfululizo baada ya kuunganishwa, na unaweza kuanzisha usawazishaji wa mkono wakati wowote kutoka orodha ya Connected.",
      },
    ],
  },
  "connect-gocardless-askbiz": {
    title: "Unganisha GoCardless na AskBiz kwa Malipo ya Direct Debit na Michango",
    description: "Jinsi ya kuunganisha GoCardless katika AskBiz Sources, kile kinachosawazisha, mahali data hiyo inapoishia, na maana yake kwa kikomo cha vyanzo cha mpango wa Free.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "GoCardless", "direct debit", "Bacs", "michango", "mamlaka (mandates)",
      "malipo ya mara kwa mara", "AskBiz Sources", "Kiunganishi cha Payments", "kuunganisha GoCardless",
    ],
    keyTakeaways: [
      "GoCardless iko katika Sources > Payments, karibu na Stripe, PayPal, Klarna na SumUp.",
      "Ni muunganisho wa OAuth wa bofya moja — bofya Connect, ingia GoCardless, idhinisha ufikiaji wa kusoma tu. Hakuna ufunguo wa API wa kutafuta au kubandika.",
      "Husawazisha malipo yako ya direct debit, kila moja likiwa limewekwa alama ya mamlaka (mandate) iliyoliidhinisha, hivyo unaweza kufuatilia malipo hadi mkataba wa mteja uliohusika.",
      "Data ya GoCardless huandikwa kwenye jedwali lake mwenyewe la gocardless_payments badala ya mkondo wako wa pamoja wa Transactions, kwa sababu rekodi za malipo na mamlaka hazina umbo linalofaa hilo — hivyo bado haitaonekana kwenye Ripoti zako za kawaida za mauzo kama Stripe au PayPal inavyoonekana.",
      "Inahesabika kwenye kikomo cha vyanzo vitatu vilivyounganishwa cha mpango wa Free kama kiunganishi kingine chochote; mipango ya Growth na Business hayana kikomo cha vyanzo.",
    ],
    content: [
      {
        heading: "Mahali pa kuipata",
        body: "Fungua Sources kutoka menyu kuu ya AskBiz na uangalie chini ya kategoria ya Payments — iko kati ya PayPal na Klarna, karibu na Stripe na SumUp. AskBiz hupanga kila kiunganishi kwa kategoria (E-Commerce, Accounting, Payments, Marketing & Ads, na mengineyo), hivyo Payments ndipo vyanzo vyote vitano vinavyohusiana na malipo vinapoishi pamoja badala ya kutawanywa kwenye ukurasa. Kama hutaki kutafuta kwa kusogeza, sanduku la utafutaji juu ya ukurasa wa Sources huchuja unapoandika, hivyo kuandika \"gocardless\" au \"direct debit\" huruka moja kwa moja kwenye kadi yake. Kadi huonyesha maelezo mafupi — malipo ya direct debit, michango, mamlaka — na kitufe cha Connect. Baada ya kuunganishwa, huhamia juu kwenye orodha ya Connected juu ya ukurasa karibu na vyanzo vyako vingine, ikionyesha nukta ya hali na muda wa usawazishaji wa mwisho, ambako unaweza kuanzisha usawazishaji wa mkono au kukatisha muunganisho wakati wowote.",
      },
      {
        heading: "Kuunganisha: bofya moja, hakuna ufunguo wa API",
        body: "GoCardless ni kiunganishi cha OAuth, si cha kubandika ufunguo — kidokezo cha kadi husomeka \"Inaelekeza kwa GoCardless — ufikiaji wa kusoma tu\", na hilo ndilo hasa linalotokea. Bofya Connect na AskBiz itakupeleka kwenye skrini ya kuingia ya GoCardless yenyewe, ikiomba wigo wa read_only. Ingia na uidhinishe hapo, na GoCardless itakurudisha moja kwa moja Sources. Kamwe hutaona au kushughulikia tokeni ya ufikiaji wewe mwenyewe, na hakuna cha kunakili kutoka ukurasa wa mipangilio wa GoCardless kwanza — tofauti na, kwa mfano, Klarna au SumU kwenye kundi lilelile la Payments, ambazo huomba ubandike vitambulisho vya API. Baada ya kuidhinisha ufikiaji, AskBiz hutafuta akaunti yako ya mkopeshaji (creditor) ya GoCardless na kutumia jina lake kama jina la kuonyesha la chanzo katika orodha yako ya Connected, hivyo inatambulika kama biashara yako badala ya kuonekana kama mstari wa jumla wa \"GoCardless\". Usawazishaji wa kwanza huanza kiotomatiki mara tu unapounganisha, hivyo huhitaji kubofya Sawazisha sasa ili kuona ikianza kufanya kazi.",
      },
      {
        heading: "Kinachosawazishwa hasa",
        body: "Baada ya kuunganishwa, AskBiz huchota malipo yako kutoka GoCardless — kila malipo ya direct debit kwenye akaunti, likiwa limekamilika, linasubiri, au limeshindikana, likirudi nyuma katika historia yako kamili ya malipo kisha kubaki hai kwa kila usawazishaji baadaye. Kila rekodi ya malipo hubeba kiasi na sarafu, hali yake, tarehe ya malipo, na maelezo yoyote uliyoyaongeza wewe au GoCardless. Muhimu zaidi, kila moja pia hubeba mamlaka (mandate) iliyoliidhinisha — mkataba wa Direct Debit ambao mteja alisajili — hivyo malipo si namba tu, yanaweza kufuatiliwa hadi mamlaka mahususi (na kwa upanuzi mchango au mkataba) iliyoyazalisha. Hiyo ndiyo maana kiunganishi kinasema \"malipo, michango, na mamlaka\": unachopata ni mkondo kamili wa malipo, kila moja likiwa tayari limeunganishwa na mamlaka nyuma yake, badala ya seti tatu tofauti zisizounganishwa. Kwa sababu AskBiz hupitia kurasa za API badala ya kuchota kundi lisilobadilika, biashara yenye historia kubwa ya GoCardless iliyopo hupata mrundikano wake kamili katika usawazishaji wa kwanza, si tu malipo ya hivi karibuni zaidi.",
      },
      {
        heading: "Kwa nini haionekani kwenye Ripoti zako za kawaida bado",
        body: "Viunganishi vingi vya AskBiz — Stripe na PayPal vikiwemo — hulisha jedwali la pamoja linaloendesha mwonekano wako wa Transactions, P&L, na kurasa za Ripoti. GoCardless kwa makusudi haifanyi hivyo. Data ya malipo na mamlaka ina umbo tofauti na oda au mauzo — malipo ya direct debit hayana mstari wa bidhaa, jina la mteja katika muundo uleule, au chaneli kama vile oda ya Shopify — hivyo AskBiz huandika kwenye jedwali lake maalum badala ya kulazimisha kwenye lile la pamoja. Kwa uhalisia, hii inamaanisha data yako ya GoCardless inasawazishwa, kuhifadhiwa kwa usalama, na kuendelea kuwa mpya — lakini bado haijachanganywa katika ripoti zilezile za mauzo au mwonekano wa P&L unaoonyesha malipo yako ya Stripe au PayPal. Kama unategemea AskBiz kwa mwonekano mmoja wa mapato uliochanganywa katika wasindikaji wa malipo, GoCardless ndicho kiunganishi pekee katika kundi la Payments ambacho kwa sasa kiko kando kidogo ya picha hiyo badala ya ndani yake. Hilo ni sababu ya kuendelea kukiunganisha — data inakusanywa na tayari mara ripoti zitakapofikia hatua hiyo — si sababu ya kutarajia inayolingana papo hapo na jinsi Stripe inavyofanya kazi leo.",
      },
      {
        heading: "Kikomo cha vyanzo katika mpango wa Free",
        body: "GoCardless haipati matibabu maalum kwenye vikomo vya mpango — huhesabika kama muunganisho mmoja dhidi ya kikomo cha vyanzo vitatu vilivyounganishwa vya mpango wa Free kwa jumla, katika kategoria zote pamoja, si vitatu kwa kategoria. Hivyo kama tayari unaendesha Shopify na Xero kwenye Free, GoCardless itakuwa nafasi yako ya tatu na ya mwisho isipokuwa ukatishe kitu kingine kwanza. Mipango ya Growth na Business huondoa kikomo hiki kabisa, hivyo unaweza kuendesha GoCardless pamoja na Stripe, PayPal, na kila kitu kingine katika mfumo wako bila kubadilishana chochote. Kama malipo ya direct debit na michango ni sehemu muhimu ya mapato yako, inafaa kuamua mapema kama GoCardless inastahili moja ya nafasi zako tatu za bure, au kama kupandisha daraja kunafaa zaidi mara unapotegemea zaidi ya vyanzo viwili kwa wakati mmoja.",
      },
      {
        heading: "Kama kitu kikienda vibaya",
        body: "Tokeni ya OAuth ya GoCardless kwa muunganisho huu haiji na mtiririko wa kusasisha ulioandikwa, hivyo kama muunganisho ukiacha kufanya kazi, sababu inayowezekana zaidi ni tokeni hiyo kuhitaji kuidhinishwa upya badala ya hitilafu halisi ya usawazishaji. Kama usawazishaji ukishindwa, mstari wa chanzo kwenye orodha yako ya Connected utabadilika kuwa hali ya hitilafu ukiwa na ujumbe mfupi unaoeleza sababu, na kuunganisha upya ndiyo suluhisho: bofya Connect tena na uidhinishe ufikiaji upya. Kitu kimoja cha kujua kabla ya kubofya Disconnect, ingawa — si kusitisha tu. Kuondoa GoCardless kutoka orodha yako ya Connected hufuta historia yake ya malipo iliyosawazishwa pamoja nayo, si muunganisho tu. Kama unakatisha kwa ajili ya kutatua tatizo badala ya kuondoa GoCardless kabisa, kuunganisha tena baadaye husawazisha upya historia yako ya malipo upya kutoka GoCardless badala ya kuendelea pale data ya zamani ilipoishia.",
      },
    ],
    faq: [
      {
        q: "Nahitaji ufunguo wa API wa GoCardless kuunganisha?",
        a: "Hapana. GoCardless huunganisha kupitia OAuth — bofya Connect kwenye kadi yake ya Sources na utaelekezwa kuingia na kuidhinisha ufikiaji wa kusoma tu kwenye tovuti ya GoCardless yenyewe. Hakuna ufunguo au tokeni ya kutafuta katika mipangilio yako ya GoCardless na kubandika kwenye AskBiz.",
      },
      {
        q: "Je, malipo yangu ya GoCardless yataonekana kwenye Ripoti au P&L ya AskBiz pamoja na Stripe na PayPal?",
        a: "Bado hapana. Data ya malipo na mamlaka ya GoCardless huhifadhiwa kwenye jedwali lake maalum badala ya jedwali la pamoja linalolisha Ripoti, Transactions na P&L — kwa sababu data hiyo haina umbo lilelile na oda au mauzo. Inasawazishwa na kuhifadhiwa, lakini kwa sasa iko kando na mwonekano wako wa mapato uliochanganywa.",
      },
      {
        q: "Je, kiunganishi hukusanya michango yangu kama orodha tofauti, au malipo tu?",
        a: "Husawazisha malipo — kila malipo ya direct debit, likiwa limekamilika, linasubiri au limeshindikana — na kila malipo hubeba mamlaka iliyoliidhinisha, hivyo unaweza kufuatilia malipo hadi mkataba wa msingi. Si mkondo tofauti wa vitu vya michango au mamlaka bila kutegemea malipo yenyewe.",
      },
      {
        q: "Je, kuunganisha GoCardless kunatumia moja ya nafasi zangu za chanzo za mpango wa Free?",
        a: "Ndiyo. Mpango wa Free huruhusu vyanzo vitatu vilivyounganishwa kwa jumla katika kategoria zote pamoja, na GoCardless huhesabika sawa na kiunganishi kingine chochote — Stripe, Shopify, Xero, vyote. Mipango ya Growth na Business hayana kikomo cha vyanzo.",
      },
      {
        q: "Muunganisho wangu wa GoCardless unaonyesha hitilafu — nifanye nini?",
        a: "Bofya Connect tena kutoka ukurasa wa Sources na uidhinishe upya ufikiaji kupitia skrini ya kuingia ya GoCardless — mtiririko uleule wa kuunganisha mara ya kwanza. Kumbuka hii ni tofauti na kukatisha muunganisho: hali ya hitilafu haigusi historia yako ya malipo iliyosawazishwa, lakini ukibofya Disconnect kwanza, hiyo huondoa data ya malipo ya GoCardless iliyosawazishwa pamoja na muunganisho, na kuunganisha tena husawazisha upya badala ya kurejesha rekodi za zamani.",
      },
    ],
  },
  "connect-linnworks-askbiz": {
    title: "Unganisha Linnworks na AskBiz kwa Usawazishaji wa Hisa wa Chaneli Nyingi",
    description: "Mwongozo wa hatua kwa hatua wa kuunganisha Linnworks na AskBiz — kile mtiririko wa OAuth unachofanya, data inayosawazishwa kwa uhalisia, na mara ngapi husasishwa.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: ["Linnworks", "unganisha", "muunganisho", "AskBiz", "hisa", "chaneli nyingi", "Sources", "oda", "utekelezaji", "OAuth"],
    keyTakeaways: [
      "Linnworks iko chini ya Sources > Inventory & Logistics, karibu na Cin7 na ShipStation, na huunganisha kupitia OAuth — unaidhinisha ndani ya Linnworks yenyewe, AskBiz haioni nenosiri kamwe.",
      "Ufikiaji ni wa kusoma tu: AskBiz inaweza kuchota oda zako, haiwezi kuunda, kuhariri, au kufuta chochote katika akaunti yako ya Linnworks.",
      "Kinachosawazishwa ni oda zako wazi — SKU, bidhaa, kiasi, bei, chaneli, na hali ya utekelezaji kwa kila kipengele — ambayo AskBiz hubadilisha kuwa mapato ya kila chaneli na takwimu za mienendo ya hisa. Si mkondo tofauti wa hesabu ya hisa ya ghala ulio hai.",
      "Mzunguko wa usawazishaji hufuata mpango wako wa AskBiz kama kila chanzo kingine: kila siku katika Free, kila saa 6 katika Growth, kila saa katika Business.",
      "Hiki ni kiunganishi halisi kinachofanya kazi chenye kishikizi chake cha usawazishaji na kirekebishaji data — si sawa na makala za zamani za AskBiz zinazotaja Linnworks kama mfano tu wa jukwaa la chaneli nyingi biashara zinazoweza kutumia.",
    ],
    content: [
      {
        heading: "Mahali pa kuipata",
        body: "Kutoka dashibodi yako ya AskBiz, nenda Sources. Sogeza chini hadi sehemu ya Inventory & Logistics — Linnworks iko pale karibu na Cin7 na ShipStation, ikiwa na maelezo mafupi chini yake: \"Hisa ya chaneli nyingi, oda, utekelezaji.\" Cin7 na ShipStation zote mbili huomba ubandike ufunguo wa API (na, kwa Cin7, kitambulisho cha akaunti pia) kabla ya kuunganisha. Linnworks ni tofauti — ndicho pekee kati ya vitatu kinachotumia muunganisho kamili wa OAuth, hivyo unabofya tile na kila kitu baada ya hapo hutokea kwenye tovuti ya Linnworks yenyewe badala ya fomu ndani ya AskBiz.",
      },
      {
        heading: "Kabla ya kuunganisha",
        body: "Utahitaji ufikiaji wa msimamizi, au angalau wa kuidhinisha programu, kwenye akaunti yako ya Linnworks — kiwango kilekile cha ufikiaji ungehitaji kuidhinisha programu yoyote ya tatu ndani ya Linnworks yenyewe. Hauhitaji kutengeneza au kunakili ufunguo wowote wa API, siri, au tokeni mapema; AskBiz haikuombi ubandike chochote kwa kiunganishi hiki mahususi, ambacho ndiyo tofauti kuu na Cin7 iliyo karibu nacho. Ukurasa wa Sources hukuambia hasa cha kutarajia kabla hujabofya chochote: \"Inaelekeza kwa Linnworks — ufikiaji wa kusoma tu.\" Mstari huo ni maelezo halisi ya kinachofuata, si maandishi ya matangazo — AskBiz inaomba idhini ya kusoma oda zako, na hakuna zaidi ya hapo.",
      },
      {
        heading: "Hatua 1 na 2: Idhinisha katika Linnworks",
        body: "Kubofya tile ya Linnworks hukupeleka kwenye skrini ya idhini ya OAuth ya Linnworks yenyewe, ambapo unaingia (kama huja) na kuangalia hasa AskBiz inachoomba kusoma kabla ya kuidhinisha. Kamwe huulizwi nenosiri la Linnworks ndani ya AskBiz yenyewe — mabadilishano yote hutokea kwenye kikoa cha Linnworks, ambayo ni desturi ya kawaida ya OAuth na muundo uleule AskBiz hutumia kwa Shopify, Xero, na vyanzo vyake vingine vya OAuth. Ukiamua usiendelee, unaweza tu kufunga au kurudi nyuma kutoka skrini hiyo; hakuna kinachounganishwa hadi uidhinishe kwa uhalisia. Ukishaidhinisha, Linnworks hukurudisha moja kwa moja kwenye ukurasa wa Sources wa AskBiz kiotomatiki — hakuna msimbo wa kunakili au kubandika popote.",
      },
      {
        heading: "Hatua ya 3: Kinachotokea baada ya kuidhinisha",
        body: "Njiani kurudi, AskBiz hubadilishana msimbo wa idhini ambao Linnworks inaupa kwa tokeni ya ufikiaji, kisha huhifadhi tokeni hiyo ikiwa imefichwa katika akaunti yako pamoja na anwani ya seva ya Linnworks ambayo Linnworks huipangia akaunti yako. Tokeni hiyo ni ya kudumu — haiishi muda kama tokeni ya kawaida ya kipindi — lakini AskBiz kamwe haitumii moja kwa moja dhidi ya API ya oda ya Linnworks. Badala yake, katika kila usawazishaji huwasilisha tokeni hiyo ya kudumu kwa kipengele cha AuthorizeByApplication cha Linnworks kuzalisha tokeni mpya, fupi ya kipindi (tokeni za kipindi za Linnworks zenyewe hudumu dakika 20 hivi, chache zaidi kuliko muda wowote halisi wa usawazishaji), na ni tokeni hiyo mpya ya kipindi inayotumika hasa kuchota oda zako. Huoni yoyote kati ya haya yakitokea — ndiyo utaratibu unaoweka muunganisho ukifanya kazi vizuri milele bila kukuhitaji kuunganisha au kuidhinisha upya kamwe. Mara muunganisho wako unapohifadhiwa, AskBiz pia huanzisha usawazishaji wa kwanza kiotomatiki, hivyo hakuna zaidi ya kubofya.",
      },
      {
        heading: "Data inayosawazishwa kwa uhalisia",
        body: "Kila usawazishaji huchota oda zako wazi kutoka Linnworks. Kwa kila kipengele cha mstari katika kila oda, AskBiz hurekodi SKU, jina la bidhaa, kiasi, bei ya kitengo, gharama ya kitengo (ambapo Linnworks inatoa moja), chaneli ipi ya mauzo oda ilitokea, na hali ya oda hiyo. Hiyo hurekebishwa kuwa sehemu zilezile za rekodi AskBiz hutumia kwa kila chanzo kingine kilichounganishwa — mapato ghafi, gharama, faida, vipande vilivyouzwa, na mienendo ya hisa — hivyo oda zako za Linnworks huketi katika ripoti zako karibu na mauzo yako ya Shopify, Amazon, au POS badala ya kuwa sehemu tofauti unayoangalia peke yake. Kama oda inafika bila vipengele vya mstari vilivyoambatanishwa, AskBiz bado huirekodi kama mstari mmoja kwa kutumia jumla ya oda, hivyo hakuna kinachopotea kimya kimya kwa sababu tu maelezo ya kiwango cha kipengele hayakupatikana. Inafaa kuwa sahihi kuhusu jambo moja, ingawa: kinachosawazishwa leo ni shughuli ya oda, si mkondo huru wa hesabu hai ya hisa ya ghala. AskBiz hukisia mienendo ya hisa kutoka vipande vilivyouzwa kwa kila oda badala ya kuchota kiasi halisi cha Linnworks kilichopo moja kwa moja — kila oda iliyosawazishwa hupunguza takwimu ya mienendo ya hisa kwa SKU hiyo, lakini AskBiz haitauliza Linnworks \"nina vingapi vimebaki ghalani sasa hivi\" kama swali tofauti. Kama unategemea Linnworks kama chanzo chako halisi cha hesabu ya hisa, endelea kufanya hivyo. Mwonekano wa AskBiz hapa unaongozwa na oda, ambao ni sahihi kwa uchambuzi wa mapato, chaneli, na utendaji wa bidhaa, lakini si mbadala wa kuangalia hesabu hai ya ghala katika Linnworks yenyewe kabla ya kufanya uamuzi wa ununuzi.",
      },
      {
        heading: "Mara ngapi husawazisha upya",
        body: "Baada ya kuunganishwa, Linnworks hufuata ratiba ileile ya usawazishaji na kila chanzo kingine, ikiongozwa na mpango wako wa AskBiz: mara moja kwa siku katika Free, kila saa 6 katika Growth, na kila saa katika Business. Linnworks haina kiwango chake cha chini cha polepole zaidi kama viunganishi vingine viwili vinavyofanya — Stripe imewekwa kikomo cha saa 3 na Etsy saa 8 hata katika Business, kwa sababu data yao ya msingi haibadiliki haraka vya kutosha kuhalalisha kuuliza mara nyingi zaidi — hivyo Linnworks hufuata tu mzunguko wowote mpango wako unauruhusu, sawa na Shopify, Amazon, au Xero. Kama unataka namba mpya zaidi mara baada ya msukumo mkubwa wa mauzo katika chaneli zako, rudi kwenye ukurasa wa Sources, tafuta Linnworks katika orodha yako ya vyanzo vilivyounganishwa, na ubofye Sync Now — hilo huanzisha usawazishaji wa papo hapo nje ya ratiba ya kawaida, bila kuathiri wakati usawazishaji unaofuata utakapotokea. Mstari uleule kwenye ukurasa huo unaonyesha nukta ya hali (kijani ikisawazisha vizuri, njano au nyekundu kama kitu kinahitaji uangalizi) na muda wa \"usawazishaji wa mwisho\", hivyo unaweza kuona kwa haraka jinsi data yako ya Linnworks ilivyo mpya kabla ya kuitegemea.",
      },
      {
        heading: "Kama umesoma mwongozo wa AskBiz kuhusu uuzaji wa chaneli nyingi",
        body: "Maudhui ya jumla ya Academy ya AskBiz kuhusu uuzaji wa chaneli nyingi hutaja Linnworks kama mfano wa aina ya jukwaa biashara hutumia kuunganisha oda katika chaneli — hiyo ni rejea ya jumla ya kategoria ya zana, iliyoandikwa kabla AskBiz kuunganishwa moja kwa moja na Linnworks. Makala hii ni kuhusu kitu tofauti: muunganisho wa moja kwa moja wa AskBiz na akaunti yako ya Linnworks, ulioelezwa hapo juu. Kama unatumia Linnworks kama kitovu chako cha chaneli nyingi tayari, kuiunganisha hapa ndiko kunakoleta data hiyo kwa uhalisia kwenye ripoti za AskBiz.",
      },
    ],
    faq: [
      { q: "Je, AskBiz inapata ufikiaji wa kuandika kwenye akaunti yangu ya Linnworks?", a: "Hapana. Muunganisho ni wa kusoma tu — AskBiz inaweza kuchota data yako ya oda lakini haiwezi kuunda, kuhariri, kufuta, au kutekeleza chochote katika Linnworks. Ukurasa wa Sources unaeleza hili wazi kabla hujaunganisha." },
      { q: "Je, hii itanionyesha viwango vyangu halisi vya sasa vya hisa kutoka Linnworks?", a: "Sio moja kwa moja. AskBiz husawazisha oda zako wazi na kupata mienendo ya hisa (vipande vilivyouzwa kwa kila SKU) kutoka kwazo — kwa sasa haichoti mkondo tofauti wa hesabu hai ya hisa ya ghala. Kwa kiasi chako halisi kilichopo, angalia Linnworks yenyewe." },
      { q: "Hii inatofautianaje na kutajwa kwa Linnworks katika makala ya uuzaji wa chaneli nyingi wa AskBiz?", a: "Makala hiyo hutaja Linnworks kwa jumla, kama mfano wa kategoria ya zana za usimamizi wa chaneli nyingi biashara hutumia — haielezi muunganisho na AskBiz. Makala hii inashughulikia kiunganishi halisi cha Linnworks cha AskBiz, kinachochota data halisi ya oda ndani ya akaunti yako." },
      { q: "Data yangu ya Linnworks itasasishwa mara ngapi katika AskBiz?", a: "Inafuata ratiba ya kawaida ya usawazishaji ya mpango wako: kila siku katika Free, kila saa 6 katika Growth, kila saa katika Business. Unaweza pia kuanzisha usawazishaji wa papo hapo wakati wowote kutoka ukurasa wa Sources kwa kitufe cha Sync Now." },
      { q: "Ni nini kama nahitaji kuunganisha upya au kitu kinaonekana si sahihi?", a: "Nenda Sources, tafuta Linnworks katika orodha yako ya vyanzo vilivyounganishwa, na tumia Disconnect ikifuatiwa na kuunganisha tena kupitia mtiririko uleule wa OAuth. Kama usawazishaji unashindwa, mstari wa hali utaonyesha ujumbe wa hitilafu badala ya kubaki kimya." },
    ],
  },
  "connect-xero-freeagent-askbiz": {
    title: "Unganisha Xero au FreeAgent na AskBiz",
    description: "Jinsi ya kuunganisha Xero au FreeAgent chini ya Sources > Accounting, kile kila kimoja kinachosawazisha ndani ya AskBiz, na jinsi vinavyotofautiana na Sage na Wave katika kategoria ileile.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "Xero", "FreeAgent", "AskBiz Sources", "Viunganishi vya Accounting",
      "unganisha Xero", "unganisha FreeAgent", "usawazishaji wa ankara", "muunganisho wa uhasibu",
    ],
    keyTakeaways: [
      "Xero na FreeAgent zote ziko chini ya Sources > Accounting, karibu na QuickBooks, Sage na Wave.",
      "Zote mbili huunganisha kwa bofya moja kupitia OAuth — unaingia na kuidhinisha ufikiaji wa kusoma tu, hakuna cha kubandika. Sage na Wave, katika kategoria ileile, badala yake huomba ubandike vitambulisho vya API.",
      "Kinachoingia AskBiz kwa uhalisia ni ankara zako — fedha zinazoingia (ankara za mauzo) na fedha zinazotoka (bili) — zinazolisha ripoti zako za mapato na matumizi za AskBiz.",
      "Huu ni uchotaji tofauti, wa upande mmoja: AskBiz husoma kutoka Xero/FreeAgent kwa ripoti. Kama pia unatumia AskBiz POS, muunganisho wake tofauti wa Xero hutuma mauzo ya POS kwenda Xero kwa uhasibu — hivi si muunganisho uleule.",
      "Mara ngapi husawazisha upya hutegemea mpango wako: kila siku katika Free, kila saa 6 katika Growth, kila saa katika Business.",
    ],
    content: [
      {
        heading: "Mahali pa kuvipata",
        body: "Fungua Sources kutoka menyu kuu ya AskBiz. Viunganishi vimepangwa kwa kategoria, na Accounting ni mojawapo ya makundi hayo — ikiwa karibu na E-Commerce, Payments, Marketing & Ads na mengineyo. Ndani ya Accounting utapata kadi tano: QuickBooks, Xero, Sage, FreeAgent na Wave. Kama kusogeza si mtindo wako, sanduku la utafutaji juu ya ukurasa wa Sources huchuja moja kwa moja hadi kadi unapoandika \"xero\" au \"freeagent\". Kadi ya Xero inaielezea ikijumuisha ankara, upatanisho wa benki, P&L na malipo ya mishahara; kadi ya FreeAgent inaelezea ankara, matumizi, ratiba ya kodi na mtiririko wa fedha — hilo ndilo eneo kila jukwaa linalofunika kwa jumla. Kinachochotwa hasa na AskBiz kutoka kwoyote, kilichoelezwa hapa chini, ni finyu na mahususi: ankara zako.",
      },
      {
        heading: "Kuunganisha Xero",
        body: "Bofya Connect kwenye kadi ya Xero. AskBiz itakupeleka kwa Xero kuingia na kuidhinisha ufikiaji wa kusoma tu kwa shirika lako — hakuna kitambulisho cha mteja, siri, au tokeni ya kutafuta na kubandika popote. Ukishaidhinisha, unarudishwa AskBiz na kadi huhamia kwenye orodha ya Connected juu ya ukurasa ikiwa na kiashiria cha hali na muda wa usawazishaji wa mwisho.",
      },
      {
        heading: "Kuunganisha FreeAgent",
        body: "FreeAgent hufanya kazi vivyo hivyo. Bofya Connect, ingia FreeAgent, na uidhinishe ufikiaji wa kusoma tu — tena, hakuna vitambulisho vya kunakili kwa mkono. Kwa kuwa tokeni ya OAuth ya FreeAgent inaelekezwa kwa kampuni moja, huhitaji kuchagua mpangaji au kampuni baadaye kama majukwaa mengine ya kampuni nyingi yanavyohitaji; muunganisho umefungwa na kampuni ya FreeAgent uliyoidhinisha ufikiaji wake.",
      },
      {
        heading: "Tofauti na Sage na Wave, karibu nazo",
        body: "Xero na FreeAgent ndizo miunganisho miwili ya OAuth katika kundi la Accounting — kamwe huoni sehemu ya fomu kwa yoyote kati yao. Sage na Wave, ziko katika orodha ileile, hufanya kazi tofauti: Sage huomba ubandike Client ID na Client Secret kutoka Sage Developer Portal, na Wave huomba tokeni ya ufikiaji iliyozalishwa kutoka ukurasa wa Wave wa Settings > Developer. Kama umezoea kubandika vitambulisho kwa Sage au Wave, usitafute sehemu inayolingana kwa Xero au FreeAgent — kwa hizi mbili, kubofya Connect na kuidhinisha ufikiaji kwenye skrini ya kuingia ya mtoa huduma ndiyo mchakato mzima.",
      },
      {
        heading: "Kinachosawazishwa kwa uhalisia",
        body: "Baada ya kuunganishwa, AskBiz huchota ankara zako kutoka Xero (au FreeAgent) na kuzigawanya kwa aina. Ankara za mauzo — fedha zinazokudaiwa — huwa vipengele vya mstari wa mapato katika AskBiz, vikibeba maelezo ya bidhaa/mstari, kiasi, bei, sarafu, na hali ya malipo (imelipwa, inasubiri, au imelipwa sehemu) moja kwa moja kutoka ankara. Bili — fedha unazodaiwa — huwa rekodi za matumizi, zikiwa na alama ya muuzaji, kiasi, tarehe na kategoria. Kati ya hizo mbili, hicho ndicho kinacholisha ripoti yako ya P&L na matumizi ya AskBiz kutoka jukwaa lolote. Upande wa Xero, ankara huchotwa kwa kurasa na kupangwa kwa mpangilio wa lini zilisasishwa mwisho, hivyo mabadiliko unayofanya katika Xero — malipo yaliyorekodiwa, ankara iliyorekebishwa — huchukuliwa katika usawazishaji unaofuata badala ya tarehe ya asili ya kuundwa kwa ankara pekee. Vipengele vya upatanisho wa benki, malipo ya mishahara, na ratiba ya kodi vya Xero na FreeAgent vinabaki ndani ya Xero au FreeAgent — AskBiz haichoti takwimu hizo mahususi.",
      },
      {
        heading: "Kuweka muunganisho wa tokeni hai",
        body: "Tokeni za OAuth huisha muda mara kwa mara kwa muundo, na AskBiz husasisha zote mbili kiotomatiki nyuma ya pazia — kwa Xero kupitia huduma yake ya utambulisho, kwa FreeAgent kupitia kipengele chake mwenyewe cha tokeni — hivyo usawazishaji wa kawaida hautakuomba kuingia tena. Kama kusasisha kukishindwa (kwa mfano, kama ufikiaji ulibatilishwa upande wa Xero au FreeAgent), chanzo kilichounganishwa kitaonyesha hali ya hitilafu kwenye ukurasa wa Sources ukiwa na ujumbe mfupi, na kuunganisha tena ni mchakato uleule wa bofya moja wa mara ya kwanza.",
      },
      {
        heading: "Mara ngapi husawazisha upya",
        body: "Mzunguko wa usawazishaji umefungwa na mpango wako wa AskBiz badala ya kiunganishi chenyewe: kila siku katika Free, kila saa 6 katika Growth, na kila saa katika Business. Xero wala FreeAgent hazina kiwango maalum cha chini cha polepole zaidi kama viunganishi vingine viwili vinavyofanya, hivyo unapata mzunguko wa kawaida wa mpango wako. Kama unataka namba za hivi karibuni bila kusubiri, bofya \"Sawazisha sasa\" kwenye mstari wa chanzo kilichounganishwa katika ukurasa wa Sources na kitachota mara moja, bila kujali usawazishaji unaofuata umewekwa lini.",
      },
      {
        heading: "Kukatisha muunganisho au kubadilisha",
        body: "Vyanzo vyote viwili viko kwenye orodha ya Connected mara vikiwekwa, karibu na kila chanzo kingine ulichounganisha, na kila kimoja kina kitufe chake cha Disconnect. Kukatisha ni usafishaji halisi, si kusitisha tu: AskBiz hubatilisha tokeni na mtoa huduma na kuondoa rekodi za mapato ambazo chanzo hicho kilisawazisha, hivyo muunganisho wa zamani au usio sahihi haubaki ukiacha namba nyuma katika ripoti zako. Kama unahitaji kuunganisha tena baadaye, au kubadilisha shirika la Xero au kampuni ya FreeAgent iliyounganishwa, katisha kwanza kisha upitie Connect tena kuidhinisha mpya — usawazishaji unaofuata hujaza upya data yako kutoka mwanzo.",
      },
      {
        heading: "Kama pia unatumia AskBiz POS na Xero",
        body: "Inafaa kuwa wazi kuhusu hili, kwa sababu majina yanapatana: kiunganishi hiki cha Sources ni uchotaji wa upande mmoja kwenda AskBiz kwa ripoti — husoma data yako ya Xero au FreeAgent hivyo inaonekana kwenye dashibodi zako na P&L. Kama unatumia AskBiz POS, POS ina muunganisho wake tofauti wa Xero chini ya mipangilio yake mwenyewe, unaofanya kazi kinyume — hutuma mauzo yako ya POS kwenda Xero kama ankara za rasimu, kwa uhasibu wako. Hazijaunganishwa moja na nyingine na hazishirikiani muunganisho: kuunganisha moja hakuunganishi au kuathiri nyingine, na unaweza kutumia moja, zote mbili, au hakuna kutegemea unachohitaji.",
      },
    ],
    faq: [
      {
        q: "Nahitaji kubandika ufunguo wa API au client secret kwa Xero au FreeAgent?",
        a: "Hapana. Zote mbili ni viunganishi vya OAuth — bofya Connect, ingia Xero au FreeAgent, na uidhinishe ufikiaji wa kusoma tu. Hii ni tofauti na Sage na Wave katika kundi lilelile la Accounting, ambazo huomba ubandike vitambulisho.",
      },
      {
        q: "Je, kuunganisha Xero na Sources pia huanzisha usawazishaji wa uhasibu wa POS-kwenda-Xero?",
        a: "Hapana, ni miunganisho isiyohusiana. Kiunganishi hiki cha Sources huchota data yako ya Xero kwenda AskBiz kwa ripoti. AskBiz POS ina muunganisho wake tofauti wa Xero katika mipangilio yake mwenyewe unaotuma mauzo ya POS kwenda Xero kama ankara za rasimu. Kuunganisha moja hakuunganishi nyingine.",
      },
      {
        q: "Ni data gani hasa inayoonekana katika AskBiz baada ya kuunganisha — kila kitu kutoka Xero?",
        a: "Hasa ankara zako: ankara za mauzo huwa rekodi za mapato (na kiasi, bei, sarafu na hali ya malipo) na bili huwa rekodi za matumizi (muuzaji, kiasi, kategoria). Vipengele vya upatanisho wa benki, malipo ya mishahara na ratiba ya kodi vya Xero na FreeAgent havichotwi — vinabaki katika Xero au FreeAgent.",
      },
      {
        q: "Data husasishwa mara ngapi baada ya kuunganishwa?",
        a: "Inafuata mzunguko wa usawazishaji wa mpango wako wa AskBiz — kila siku katika Free, kila saa 6 katika Growth, kila saa katika Business. Unaweza pia kubofya \"Sawazisha sasa\" kwenye chanzo kilichounganishwa wakati wowote kuchota data ya hivi karibuni mara moja badala ya kusubiri.",
      },
      {
        q: "Ni nini kinachotokea kama muunganisho wangu wa Xero au FreeAgent ukiacha kufanya kazi?",
        a: "AskBiz husasisha kiotomatiki tokeni ya ufikiaji ya msingi katika kila usawazishaji, hivyo hii kwa kawaida haitakuhitaji chochote. Kama kusasisha kukishindwa — kwa mfano kwa sababu ufikiaji ulibatilishwa upande wa Xero au FreeAgent — chanzo huonyesha hali ya hitilafu ukiwa na ujumbe mfupi kwenye ukurasa wa Sources, na unaunganisha tena kwa njia ileile uliyounganisha mara ya kwanza.",
      },
    ],
  },
  "connect-jumia-marketplace-askbiz": {
    title: "Unganisha Jumia na AskBiz: Oda, Malipo na Hisa kwa Masoko ya Kiafrika",
    description:
      "Jinsi ya kuunganisha akaunti yako ya Jumia Vendor Center na AskBiz kwa kutumia Client ID na Refresh Token, kinachosawazishwa kwa uhalisia, na kilichobaki nje ya wigo.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "Jumia",
      "Jumia Vendor Center",
      "kiunganishi cha Jumia",
      "muunganisho wa soko",
      "biashara ya kielektroniki ya Kiafrika",
      "Sources",
      "AskBiz",
      "usawazishaji wa hisa",
      "usawazishaji wa oda",
    ],
    keyTakeaways: [
      "Jumia iko chini ya Sources > E-Commerce karibu na Shopify, Amazon FBA, eBay, Etsy, WooCommerce na Walmart — lakini tofauti na hizo, haitumii uelekezaji wa bofya moja wa OAuth.",
      "Unaunganisha kwa mkono, kwa kubandika Client ID na Refresh Token unayozalisha mwenyewe katika Jumia Vendor Center > Settings > Applications (Self Authorisation).",
      "Kila usawazishaji huchota oda za hivi karibuni na viwango vya sasa vya hisa kutoka madukani mwako ya Jumia; kiasi cha malipo kinachoonyeshwa kwa kila oda ni makadirio kutoka mapato ya oda, si taarifa rasmi ya malipo yaliyokamilika ya Jumia.",
      "Hisa ya Jumia hulisha moja kwa moja mwonekano wako wa hisa wa CFO na arifa za hisa kidogo zilizowekwa alama ya chaneli — usafirishaji wa Jumia na ufuatiliaji wa uwasilishaji vimeachwa kwa makusudi nje ya wigo wa kiunganishi hiki.",
      "Hiki ni kiunganishi kipya kilichojengwa, kilichopitiwa ndani dhidi ya API ya Jumia lakini bado hakijathibitishwa mwanzo hadi mwisho kwenye akaunti hai ya muuzaji — inafaa kuangalia usawazishaji wako wa kwanza dhidi ya namba za Vendor Center yenyewe.",
    ],
    content: [
      {
        heading: "Kiunganishi cha Jumia kinachofanya nini",
        body: "Jumia ni mojawapo ya vyanzo vya E-Commerce chini ya Sources katika AskBiz, karibu na Shopify, Amazon FBA, eBay, Etsy, WooCommerce na Walmart. Baada ya kuunganishwa, ni usawazishaji wa kuchota tu: AskBiz husoma oda zako za hivi karibuni na viwango vya sasa vya hisa kutoka Jumia Vendor Center na kuziunganisha katika data yako ya biashara iliyounganishwa, mahali palepale kila chaneli nyingine — tili yako halisi, duka lako la Shopify, orodha zako za Amazon — hufika. Hilo ndilo lengo la kuiunganisha kabisa: badala ya kuingia Vendor Center peke yake kuangalia jinsi duka lako la Jumia linavyofanya, oda na hisa yake huonekana karibu na kila kitu kingine unachouza, kwenye dashibodi moja, katika sarafu yako ya nchi.",
      },
      {
        heading: "Kwa nini hakuna kitufe cha bofya moja cha 'Connect'",
        body: "Shopify, Amazon FBA, eBay na Etsy zote hutumia OAuth ya kawaida — unabofya Connect, unaelekezwa kuingia kwenye jukwaa hilo, kuidhinisha ufikiaji, na kurudi AskBiz ukiwa tayari umeunganishwa. Jumia Vendor Center haitoi hilo kwa programu za tatu. Badala yake huendesha kile Jumia inachokiita Self Authorization: unaunda Application yako mwenyewe ndani ya akaunti yako ya Vendor Center, na hiyo huzalisha Client ID na Refresh Token iliyoelekezwa kwa duka lako. Hakuna programu inayomilikiwa na AskBiz unayoidhinisha na hakuna nenosiri linalopita kati ya hizo mbili wakati wowote — unazalisha jozi ya vitambulisho ambayo akaunti yako ya Jumia pekee inaidhibiti, kisha unampa AskBiz thamani hizo mbili moja kwa moja.",
      },
      {
        heading: "Kuunganisha akaunti yako, hatua kwa hatua",
        body: "Ingia Jumia Vendor Center na nenda Settings, kisha Applications. Bofya Create Application na uchague Self Authorisation kama aina. Jumia itakuonyesha Client ID — nakili — na kukuachia uzalishe Refresh Token — nakili hiyo pia. Rudi AskBiz, nenda Sources, tafuta Jumia chini ya E-Commerce, na ubandike Client ID kwenye sehemu ya Client ID na Refresh Token kwenye sehemu ya Refresh Token (hii imefichwa, kama nenosiri). AskBiz huthibitisha vitambulisho mara moja kwa kuomba tokeni ya ufikiaji kutoka Jumia na kuthibitisha inaweza kusoma orodha yako ya maduka kabla ya kuhifadhi muunganisho. Kama uthibitisho huo ukishindwa, sababu ya kawaida zaidi ni Application haina ruhusa za Order au Product zilizowashwa katika Vendor Center — rudi uthibitishe majukumu hayo yamewekwa alama, kisha jaribu tena.",
      },
      {
        heading: "Kinachosawazishwa kwa uhalisia — na kisichosawazishwa",
        body: "Kila usawazishaji huchota oda zako za hivi karibuni (dirisha linaloendelea, za hivi karibuni zaidi kwanza) na, kwa kila moja, vipengele vya mstari wa oda vya mtu binafsi — muundo wa Jumia hurudisha mstari mmoja kwa kila kipande kilichouzwa badala ya sehemu ya kiasi, hivyo mstari wa vipande 3 kwenye duka lako hurudi kama vipengele vitatu tofauti, kila kimoja kikibeba bei yake, punguzo, kodi na takwimu ya usafirishaji. Viwango vya hisa hutoka kwenye kipengele tofauti cha katalogi, kilichowekwa alama kwa SKU. Inafaa kujua: kiasi cha malipo utakachokiona dhidi ya oda ya Jumia katika AskBiz kimekokotolewa kutoka mapato halisi ya oda hiyo baada ya punguzo, si kuchotwa kutoka ripoti rasmi ya malipo ya Jumia — Jumia hufichua tozo halisi za kamisheni na ada tu kwenye kipengele tofauti cha taarifa ya malipo ambacho kiunganishi hiki hakisomi kwa sasa. Chukulia kiasi cha malipo kama makadirio muhimu kwa kufuatilia mwelekeo, si mbadala wa ripoti ya malipo ndani ya Vendor Center yenyewe unapohitaji namba halisi. Kiunganishi pia ni cha kuchota tu katika pande zote za wigo: kamwe hakiandiki tena kwenye orodha zako za Jumia, bei au hisa, na kwa makusudi hakigusi data ya usafirishaji au ufuatiliaji wa uwasilishaji wa Jumia — kiunganishi hiki kinahusu mwonekano wa mauzo na hisa, si mantiki ya usafirishaji.",
      },
      {
        heading: "Mahali utakapoiona katika AskBiz",
        body: "Oda za Jumia huhesabika kwenye jumla yako ya mapato na oda iliyounganishwa katika kila chaneli iliyounganishwa, kila moja ikiwa na bei katika sarafu ya nchi ya duka lenyewe. Viwango vya hisa hulisha mwonekano wako wa Hisa wa CFO, vikiunganishwa na bidhaa ileile inapowezekana — kumbuka mkondo wa hisa wa Jumia haujumuishi jina la bidhaa, hivyo hadi kilinganishwe na orodha yenye jina kutoka chaneli nyingine, AskBiz huonyesha SKU mahali pake. Arifa za hisa kidogo zimewekwa alama kwa chaneli, hivyo onyo kwamba SKU ya Jumia inapungua haitachanganywa na SKU ileile ikiwa sawa katika duka lako halisi. Na katika kichujio cha chaneli cha kichupo cha Intelligence, Jumia ni chaguo linalochaguliwa, hivyo unaweza kuangalia utendaji wa Jumia peke yake mbali na kila kitu kingine unachouza.",
      },
      {
        heading: "Inafaa kujua kabla ya kuitegemea",
        body: "Kiunganishi hiki kiliongezwa hivi karibuni. Kimejengwa na kupitiwa ndani dhidi ya API ya Jumia Vendor Center iliyoandikwa, lakini bado hakijaendeshwa mwanzo hadi mwisho dhidi ya akaunti hai, inayofanya kazi ya muuzaji wa Jumia — hivyo chukulia usawazishaji wako wa kwanza kama kitu cha kuangalia dhidi ya namba za oda na hisa za Vendor Center yenyewe badala ya kudhani ni sahihi tangu siku ya kwanza. Kama usawazishaji ukiacha kufanya kazi ukiwa na hitilafu kuhusu refresh token, hilo mara nyingi humaanisha ilibatilishwa au kuisha muda katika Vendor Center — zalisha Client ID na Refresh Token mpya kisha uunganishe tena kutoka Sources. Nyuma ya pazia, AskBiz pia huzalisha tokeni mpya ya ufikiaji kutoka refresh token yako kwenye kila usawazishaji badala ya kujaribu kutumia iliyopo, kwa kuwa tokeni za ufikiaji za Jumia zina muda mfupi, na kwa makusudi hupunguza kasi ya maombi yake kubaki chini ya kikomo cha Jumia cha kiwango badala ya kuyafyatua yote mara moja. Kwa kuwa kila usawazishaji huchota kundi lililowekwa kikomo la oda zako za hivi karibuni, duka lenye kiasi kikubwa sana cha mauzo linaweza kuona historia yake kamili ya hivi karibuni ikijaa katika usawazishaji zaidi ya mmoja badala ya wote mara moja katika mzunguko wa kwanza.",
      },
    ],
    faq: [
      {
        q: "Je, kuunganisha Jumia kunafanya kazi sawa na Shopify au Amazon, kwa uelekezaji wa kuingia?",
        a: "Hapana. Shopify, Amazon FBA, eBay na Etsy hutumia OAuth — unabofya Connect na kuingia kwenye tovuti yao. Jumia haitoi hilo kwa programu za tatu, hivyo unazalisha Client ID na Refresh Token mwenyewe katika Jumia Vendor Center > Settings > Applications, kisha ubandike zote mbili katika AskBiz chini ya Sources.",
      },
      {
        q: "Je, AskBiz inaweza kubadilisha bei, orodha au viwango vya hisa vyangu vya Jumia?",
        a: "Hapana. Kiunganishi ni cha kuchota tu — husoma oda na hisa zako kutoka Jumia, kamwe hakiandiki tena chochote kwenye duka lako la Jumia.",
      },
      {
        q: "Je, nitaona hali ya usafirishaji au uwasilishaji wa Jumia katika AskBiz?",
        a: "Kwa sasa hapana. Data ya usafirishaji na ufuatiliaji wa uwasilishaji imeachwa kwa makusudi nje ya wigo wa kiunganishi hiki — kinashughulikia oda, mapato na hisa, si mantiki.",
      },
      {
        q: "Kiasi cha malipo kwenye oda ya Jumia hakilingani na kile Jumia hunilipa kweli — kwa nini?",
        a: "Takwimu hiyo imekadiriwa kutoka mapato halisi ya oda baada ya punguzo, si kuchotwa kutoka taarifa rasmi ya malipo ya Jumia, ambayo huripoti tozo halisi za kamisheni na ada tofauti. Tumia ripoti ya malipo ya Vendor Center yenyewe kwa kiasi halisi kilicholipwa.",
      },
      {
        q: "Usawazishaji wangu wa Jumia uliacha ghafla kufanya kazi — nifanye nini?",
        a: "Hii mara nyingi humaanisha Refresh Token yako ilibatilishwa au kuisha muda katika Vendor Center. Zalisha Client ID na Refresh Token mpya kutoka Settings > Applications kisha uunganishe tena kutoka Sources kwa thamani mpya.",
      },
    ],
  },
  "pos-receipt-design-vat-askbiz": {
    title: "Risiti Mpya ya Tili ya AskBiz: Muundo wa Orodha ya Bidhaa na VAT Inayobadilika",
    description:
      "Risiti ya WhatsApp AskBiz inayotuma baada ya mauzo sasa ni picha halisi yenye mtindo wa risiti ya duka — kingo zilizoraruliwa, jumla yenye boksi, bakodi ya mapambo — na mstari wake wa VAT huonekana tu kwa biashara zenye nambari halisi ya VAT kwenye rekodi.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "muundo wa risiti",
      "risiti ya tili",
      "risiti ya WhatsApp",
      "risiti ya VAT",
      "VAT inayobadilika",
      "AskBiz POS",
      "risiti ya kidijitali",
      "picha ya risiti",
    ],
    keyTakeaways: [
      "Risiti AskBiz inayotuma kupitia WhatsApp baada ya mauzo sasa ni picha iliyotengenezwa kwa mtindo wa risiti halisi ya tili — aina ya herufi ya Courier Prime, kingo zilizoraruliwa/zenye matundu juu na chini, TOTAL yenye boksi, na bakodi ya mapambo — si muhtasari wa maandishi tambarare kama zamani.",
      "Mstari wa 'VAT Reg. No.' na lebo ya kodi ya 'VAT (kiwango%)' huonekana tu kama biashara yako ina nambari ya VAT iliyohifadhiwa katika Settings. Kutokuwa na nambari ya VAT kwenye rekodi kunamaanisha wateja huona mstari wa jumla wa 'Tax' badala yake — hakuna swichi tofauti ya kuwasha/kuzima, nambari yenyewe ndiyo alama.",
      "AskBiz daima hujaribu kutuma picha kwanza; kama hilo likishindwa kwa sababu yoyote, hurudi kiotomatiki kwenye ujumbe mfupi wa muhtasari wa maandishi, bila chochote cha kuweka mipangilio au kujaribu tena.",
      "Picha huzalishwa upya kutoka muamala halisi kila inapochotwa, hivyo si picha ya zamani iliyokwisha pitwa na wakati kamwe — na kuchotwa kwenyewe hakuhitaji kuingia, kwa sababu ni kitambulisho cha muamala kisichoweza kubashiriwa ndicho kinachoweka mipaka.",
    ],
    content: [
      {
        heading: "Kilichobadilika",
        body: "Risiti ya mteja inapotoka kupitia WhatsApp baada ya mauzo, zamani ilifika kama ujumbe wa maandishi tambarare — mstari mfupi mmoja au mbili ukieleza jumla, jina la biashara yako, na njia ya malipo. Hiyo bado ipo kama njia mbadala, lakini si tena kile wateja wengi wanaona. Risiti kuu AskBiz inayotuma sasa ni picha halisi, iliyopangwa na kupambwa kuonekana kama risiti ya tili iliyochapishwa, ikiwa na kila kipengele cha mstari, jumla ndogo, punguzo lolote, kodi, na jumla ya mwisho zikionyeshwa hasa kama risiti ya karatasi ingezionyesha. Hakuna kinachobadilika upande wako kupata hii — ni cha kiotomatiki kwenye kila mauzo ambapo risiti hutumwa.",
      },
      {
        heading: "Risiti mpya inavyoonekana",
        body: "Picha imewekwa katika Courier Prime, aina ya herufi ya mtindo wa taipurayta ya kipimo sawa, ambayo ndiyo sehemu kubwa inayoifanya isomeke kama risiti badala ya kadi ya ujumbe wa kawaida. Kingo za juu na chini zimechorwa kama mstari wa ziga-ziga uliopasuka/wenye matundu, jinsi risiti inavyoonekana ikiwa imeraruliwa kutoka kwenye roli. Mstari wa TOTAL uko ndani ya boksi lake mwenyewe karibu na chini, hivyo ndiyo takwimu moja isiyoweza kukosekana. Chini yake kuna bakodi ya mapambo — mstari wa vijiti wima vya urefu tofauti, uliozalishwa kwa uhakika kutoka kitambulisho cha muamala kama mbegu, hivyo risiti ileile daima huonekana na vijiti vilevile ikiwa itachotwa tena. Si bakodi halisi, inayoweza kusomwa; ipo kwa athari ya kuonekana ya risiti halisi ya tili, ikiwa na nambari ya risiti imechapishwa chini yake mahali ambapo bakodi kwa kawaida ingesimba.",
      },
      {
        heading: "Kila kinachochapishwa kwenye risiti",
        body: "Kusoma kutoka juu hadi chini: jina lako la biashara (kwa herufi kubwa), likifuatiwa na mstari wa usajili wa VAT kama una moja kwenye rekodi, kisha nambari ya risiti — herufi 8 za kwanza za kitambulisho cha muamala, mistari ikiondolewa na kubadilishwa kuwa herufi kubwa — pamoja na tarehe na muda. Chini yake, 'Served by [jina la keshia]' huonekana upande wa kushoto kama mauzo yalipigwa chini ya akaunti ya keshia mwenye jina, ukiwa na njia ya malipo ikionyeshwa kwa herufi kubwa upande wa kulia. Kisha mistari ya orodha ya bidhaa: jina la kila bidhaa na jumla kamili ya mstari kwenye mstari mmoja, ikiwa na kiasi na bei ya kitengo ('2 x £4.50') imechapishwa chini yake. Baada ya bidhaa huja jumla ndogo, mstari wa punguzo tu kama punguzo lilitumika kwenye mauzo, na mstari wa kodi tu kama mauzo yalibeba kodi yoyote — mauzo yasiyo na kodi hayana mstari wa kodi kabisa. TOTAL yenye boksi hufunga, ikifuatiwa na bakodi, nambari ya risiti tena, na mstari wa shukrani.",
      },
      {
        heading: "VAT inabadilika — inategemea Settings zako",
        body: "Mstari wa kodi hausemi 'VAT' au 'Tax' daima kwa kudumu — hubadilika kwa kila biashara, kutokana na jambo moja: kama una nambari ya VAT iliyohifadhiwa chini ya Settings. Kama umeingiza moja, risiti huonyesha mstari wa 'VAT Reg. No.' chini ya jina lako la biashara, na mstari wa kodi wenyewe umewekwa alama 'VAT', ukiwa na kiwango kimeongezwa pale kila bidhaa kwenye mauzo hayo inashiriki kiwango kimoja cha kodi (kwa mfano 'VAT (20%)'). Kama bidhaa zako zina kodi za viwango tofauti, hurudi kwenye lebo tambarare ya 'VAT' badala ya kubashiri kiwango kimoja. Kama huna nambari ya VAT kwenye rekodi, hakuna hilo linaonekana — risiti huonyesha mstari wa jumla wa 'Tax' badala yake, bila mstari wa usajili juu ya jina la biashara kabisa. Hakuna swichi tofauti kwa hili popote katika AskBiz; sehemu ya nambari ya VAT yenyewe ndiyo alama pekee ya usajili mfumo unao, hivyo kuongeza au kuondoa katika Settings ndiko kunakogeuza maneno mahususi ya VAT kwenye risiti kuwasha au kuzima.",
      },
      {
        heading: "Jinsi AskBiz inavyoamua kutuma picha au kurudi kwenye maandishi",
        body: "Kila jaribio la kutuma risiti huanza kwa kujaribu kiolezo cha picha. WhatsApp inahitaji violezo vya ujumbe wa biashara kuidhinishwa mapema na Meta kabla ya kutumika, na kichwa cha kiolezo cha picha si picha iliyopakiwa isiyobadilika — ni kiungo kinachorudi AskBiz ambacho seva za utoaji za Meta zenyewe huchota wakati wa ujumbe unapotumwa hasa, ambayo ndiyo sababu hasa risiti daima huonyesha muamala halisi badala ya picha iliyohifadhiwa kutoka mapema. Kama utumaji huo wa picha ukishindwa kwa sababu yoyote — mara nyingi kwa sababu kiolezo bado kiko kwenye foleni ya ukaguzi wa Meta — AskBiz hujaribu tena kiotomatiki kwa kiolezo tofauti, kifupi cha maandishi kilichoidhinishwa badala yake, kikibeba tu jumla, jina la biashara, tarehe, na njia ya malipo. Huoni uamuzi huu ukitokea na hakuna cha kuweka mipangilio: chochote kinachofaulu ndicho mteja hupata, na mara kiolezo cha picha kikishaidhinishwa kikamilifu, utumaji hufaulu kwenye jaribio la picha kama jambo la kawaida.",
      },
      {
        heading: "Kwa nini kiungo cha risiti hakihitaji kuingia",
        body: "Kwa sababu ni seva za Meta — si kivinjari chako au tili yako — zinazochota picha ya risiti wakati wa utoaji, ombi hilo haliwezi kubeba kipindi cha kuingia cha AskBiz pamoja nalo; hakuna mtumiaji wa kuthibitisha. Hivyo kipengele kinachozalisha picha kimeachwa wazi kwa makusudi, na ulinzi wake pekee ni kwamba kitambulisho cha muamala kwenye kiungo ni UUID isiyoweza kubashiriwa badala ya nambari ndogo ya mfululizo — muundo uleule wa uaminifu AskBiz hutumia kwa kila kiungo kingine kilichoelekezwa kwa muamala mmoja. Kwa uhalisia hii inamaanisha kiungo cha picha si kitu unachotaka kusambaza kiholela nje ya WhatsApp, kwa kuwa yeyote mwenye kiungo halisi anaweza kuona risiti hiyo moja, lakini si kitu unachohitaji kufanya chochote kuhusu — ndiyo jinsi utumaji wa kiotomatiki umeundwa kufanya kazi.",
      },
    ],
    faq: [
      {
        q: "Je, nahitaji kuwasha muundo mpya wa risiti mahali fulani katika Settings?",
        a: "Hapana — risiti ya mtindo wa picha ndiyo AskBiz inatuma kiotomatiki kwenye kila risiti ya WhatsApp sasa. Hakuna swichi ya kutafuta; kama utumaji wa kiolezo cha picha ukishindwa kwa sababu yoyote hurudi kwenye muhtasari wa maandishi wenyewe.",
      },
      {
        q: "Kwa nini risiti yangu inasema 'Tax' badala ya 'VAT'?",
        a: "Maneno ya VAT huonekana tu wakati biashara yako ina nambari ya VAT iliyohifadhiwa chini ya Settings — sehemu hiyo ndiyo alama pekee ya usajili wa VAT AskBiz inayo. Ongeza nambari yako ya VAT hapo na mstari wa 'VAT Reg. No.' pamoja na lebo ya kodi ya 'VAT' vitaanza kuonekana kwenye risiti.",
      },
      {
        q: "Kwa nini mstari wa VAT wakati mwingine unasema 'VAT' tu bila asilimia?",
        a: "AskBiz huchapisha kiwango (kama 'VAT (20%)') tu wakati kila bidhaa kwenye mauzo hayo mahususi inashiriki kiwango kimoja cha kodi. Kama mauzo yanachanganya bidhaa zenye kodi za viwango tofauti, huonyesha lebo tambarare ya 'VAT' badala ya kuchagua kiwango kimoja ambacho hakingekuwa sahihi kwa risiti nzima.",
      },
      {
        q: "Je, bakodi kwenye risiti ni kitu ambacho mteja angeweza kukisoma kwa kifaa halisi?",
        a: "Hapana — ni ya mapambo. Vijiti vinazalishwa kutoka kitambulisho cha muamala hivyo risiti ileile daima huonekana sawa ikiangaliwa tena, lakini havisimbi chochote kifaa cha kusoma kingeweza kusoma. Rejea halisi ya muamala ni nambari ya risiti iliyochapishwa juu na chini yake.",
      },
      {
        q: "Je, yeyote mwenye kiungo cha picha ya risiti anaweza kuona risiti ya mtu mwingine?",
        a: "Kiungo hakilindwi na kuingia — hakiwezi kuwa hivyo, kwa kuwa ni seva za utoaji za WhatsApp zenyewe zinazokichota, si kivinjari kilichoingia — lakini kimelindwa na kitambulisho cha muamala kuwa UUID isiyobashirika. Tendea kiungo jinsi ungetendea nambari yoyote ya rejea ya matumizi moja: sawa kikitumwa kwa mteja kupitia WhatsApp, si kitu cha kuchapisha au kusambaza mahali pengine.",
      },
    ],
  },
  "whatsapp-daily-pl-brief-askbiz": {
    title: "Muhtasari Wako wa Kila Siku Sasa Unafika kama Ripoti ya P&L ya WhatsApp",
    description:
      "Ujumbe wa kiotomatiki wa kila siku wa AskBiz sasa unafika kwenye WhatsApp kama ripoti halisi ya mauzo, faida, na hasara ya masaa 24 na siku 7 zilizopita — hivi ndivyo unavyowasha na maana ya namba hizo.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "muhtasari wa kila siku wa WhatsApp",
      "ripoti ya P&L ya WhatsApp",
      "arifa za AskBiz",
      "faida na hasara",
      "ripoti ya mauzo ya kila siku",
      "muhtasari wa kila siku wa POS",
      "mipangilio ya arifa za WhatsApp",
    ],
    keyTakeaways: [
      "Iwashe katika Settings > Notifications, chini ya Channels, kwa kuwasha swichi ya WhatsApp — sehemu ya nambari ya simu huonekana tu baada ya swichi kuwashwa.",
      "Hutumwa kiotomatiki mara moja kwa siku, na kwa akaunti zenye POS iliyowashwa tu zenye arifa za WhatsApp zimewashwa na nambari iliyohifadhiwa. Akaunti za barua pepe pekee hazipokei.",
      "Kila ujumbe huripoti mauzo, faida (mauzo ukiondoa gharama halisi ya kila kipengele ya bidhaa zilizouzwa), na hasara kutoka marejesho — kwa masaa 24 yaliyopita na siku 7 zilizopita, pamoja na kiungo cha kurudi askbiz.co/home.",
      "Hasara huhesabu marejesho kwa tarehe ya kufanywa kwa marejesho, si tarehe ya mauzo ya awali — kurejesha mauzo ya zamani leo huongeza kwenye takwimu ya hasara ya leo.",
      "Hii ilibadilisha toleo la awali la barua pepe la ujumbe wa kiotomatiki wa kila siku kwa akaunti zilizojiunga na WhatsApp. Muhtasari wako wa Kila Siku ndani ya programu — wenye alama yake ya afya, hitilafu, na hatua iliyopendekezwa — ni kipengele tofauti na kinaendelea kufanya kazi kama zamani.",
    ],
    content: [
      {
        heading: "Kilichobadilika kwa uhalisia",
        body: "AskBiz zamani ilituma barua pepe ya asubuhi ya kiotomatiki iliyojengwa kwenye mistari mitatu iliyozalishwa na AI — kitu kilichoboreka, kitu kinachohitaji uangalizi, na hatua iliyopendekezwa kwa siku. Barua pepe hiyo imestaafishwa kwa akaunti zinazojiunga na WhatsApp. Badala yake, kazi ya kiotomatiki ya kila siku sasa hutuma ripoti ya P&L ya Kiingereza rahisi moja kwa moja kwa WhatsApp: mauzo halisi, faida halisi, na hasara halisi, zikichotwa moja kwa moja kutoka data yako ya muamala badala ya kufanywa muhtasari kama hadithi. Hakuna ufafanuzi wa AI, hakuna maneno magumu — ni namba tu za masaa 24 na siku 7 zilizopita, zikiwa katika sarafu ya akaunti yako. Toleo la zamani lilijaribu kukuambia nini muhimu; toleo hili linakupa tu takwimu na kukuachia uamue.",
      },
      {
        heading: "Kuiwasha",
        body: "Nenda Settings > Notifications katika AskBiz na utafute sehemu ya Channels. Kuna swichi mbili hapa: Email Alerts na WhatsApp. Washa swichi ya WhatsApp, na sehemu ya nambari ya simu huonekana mara moja chini yake — sehemu hii imefichwa hadi uwashe swichi, hivyo kama huoni mahali pa kuingiza nambari, angalia kwanza kama swichi yenyewe imewashwa. Ingiza nambari yako ya WhatsApp katika muundo wa kimataifa (kwa mfano +254 700 000000) na uhifadhi. Hiyo ndiyo mipangilio yote — hakuna hatua tofauti ya kujiunga au ujumbe wa kuthibitisha wa kuidhinisha, na hakuna kipindi cha kusubiri kabla ujumbe wa kwanza kutumwa. Ukizima swichi tena baadaye, sehemu ya nambari hupotea tena, lakini nambari yako iliyohifadhiwa haitumiwi chochote zaidi mpaka uiwashe tena.",
      },
      {
        heading: "Nani hasa anayepokea",
        body: "Utumaji wa kila siku umefungwa kwa ukali zaidi kuliko inavyoweza kuonekana. Hutumwa tu kwa akaunti ambapo POS imewashwa — kama unatumia AskBiz kwa vyanzo vilivyounganishwa tu kama Shopify au mkondo wa benki bila POS kuwashwa, ujumbe huu maalum hautumwi kwako, bila kujali mipangilio yako ya arifa. Zaidi ya hilo, unahitaji swichi ya WhatsApp imewashwa na nambari iliyohifadhiwa; kuwa na moja tu kati ya hizo mbili kunamaanisha unarukwa, na kazi ya kiotomatiki huendelea tu kwenye akaunti inayofuata bila kuzalisha chochote kwako. Na ni mara moja kabisa kwa biashara kwa siku — kama muhtasari umekwisha zalishwa kwa akaunti yako kwa tarehe ya leo, kazi ya kiotomatiki haitazalisha au kutuma mwingine, hata ukiangalia tena baadaye siku hiyo. Hakuna chaguo la kutuma kwa mkono pia — ujumbe hutoka tu kwenye ratiba yake.",
      },
      {
        heading: "Jinsi mauzo, faida, na hasara zinavyokokotolewa",
        body: "Mauzo ni jumla ya miamala yako kamili ya POS katika dirisha hilo — malipo ya kadi au pesa za simu yanayosubiri ambayo hayajathibitishwa bado hayahesabiwi hadi yathibitike. Faida si makadirio mabaya ya faida — ni mauzo ukiondoa gharama halisi ya bidhaa zilizouzwa, ikikokotolewa kipengele kwa kipengele kutoka kiasi na bei ya gharama iliyorekodiwa kwa kila bidhaa iliyouzwa, kisha kujumlishwa kwenye dirisha hilo. Hasara zinaonyesha thamani ya vipengele vilivyorejeshwa, si tu hesabu ya matukio ya marejesho, na zinachotwa kutoka seti tofauti ya miamala — chochote kilichowekwa alama kimerejeshwa au kimerejeshwa sehemu. Hapa ndipo mantiki inaweza kusomwa vibaya kwa urahisi: hasara huhesabiwa kwa siku ambayo marejesho yalifanywa, si siku ambayo mauzo ya awali yalifanyika. Kama mteja alinunua kitu wiki tatu zilizopita na ukafanya marejesho asubuhi ya leo, thamani kamili ya marejesho hayo huingia kwenye takwimu ya hasara ya leo — hairekebishi tena siku ya mauzo ya awali. Katika dirisha la siku 7 hii mara chache husababisha mkanganyiko, lakini inafaa kujua kama utawahi kuona takwimu ya hasara ya masaa 24 inayoonekana haihusiani na biashara halisi ya siku hiyo.",
      },
      {
        heading: "Utakachoona, na kinachounganisha",
        body: "Ujumbe wenyewe ni maandishi mafupi ya WhatsApp: jina lako la biashara juu, kisha Mauzo, Faida, na Hasara kwa masaa 24 yaliyopita, ikifuatiwa na takwimu zilezile tatu kwa siku 7 zilizopita, na kiungo cha askbiz.co/home chini. Kwa kuwa ni ujumbe tambarare wa WhatsApp, namba zenyewe zinasomeka mara tu unapofika — hakuna programu ya kufungua, hakuna kuingia kunahitajika tu kuziona. Kiungo ni njia ya mkato kurudi AskBiz kama unataka kuchimba zaidi kwenye takwimu; kukifungua bado kutakuomba kuingia kama kiungo kingine chochote cha AskBiz kingefanya.",
      },
      {
        heading: "Kisichobadilishwa na hili",
        body: "Inafaa kuwa wazi kuhusu mpaka hapa. Ripoti ya WhatsApp ni kipengele tofauti na Muhtasari wako wa Kila Siku ndani ya programu — ile yenye Alama ya Afya ya Biashara, alama za hitilafu, na hatua iliyopendekezwa, inayopatikana wakati wowote unapofungua AskBiz. Kipengele hicho na data yake havikuguswa na mabadiliko haya na vinaendelea kufanya kazi bila kutegemea kama una arifa za WhatsApp zimewashwa. Kilichobadilika ni utumaji wa kiotomatiki: hadithi ya zamani ya barua pepe iliyokuwa ikifika bila kuombwa kila asubuhi imekwisha kwa akaunti zilizojiunga na WhatsApp, ikibadilishwa na ujumbe huu wa P&L wa moja kwa moja zaidi. Kama unataka mtindo wa alama ya afya na muhtasari wa hatua, hiyo bado inaishi ndani ya programu — ni tu si tena kile kinachotumwa kwenye simu yako kiotomatiki.",
      },
    ],
    faq: [
      {
        q: "Situmii AskBiz POS — je, nitapata ujumbe huu wa WhatsApp?",
        a: "Hapana. Utumaji wa kila siku huenda tu kwa akaunti zenye POS imewashwa, kwa sababu takwimu za mauzo, faida, na hasara zinakokotolewa kutoka data ya muamala na marejesho ya POS. Kama unatumia AskBiz tu kwa vyanzo vilivyounganishwa kama Shopify au mkondo wa benki, ujumbe huu mahususi hautumwi kwako.",
      },
      {
        q: "Tayari nina Email Alerts imewashwa — nahitaji kufanya kitu kingine?",
        a: "Ndiyo. Email Alerts na WhatsApp ni swichi tofauti katika Settings > Notifications, na swichi ya WhatsApp pekee (pamoja na nambari iliyohifadhiwa) ndiyo inayowasha ujumbe huu wa kila siku. Kuwa na Email Alerts imewashwa peke yake hakuiwashi.",
      },
      {
        q: "Kwa nini hasara kwenye ujumbe wa leo inatoka kwenye mauzo niliyofanya wiki zilizopita?",
        a: "Hasara zinahesabiwa kwa tarehe ambayo marejesho yalifanywa, si tarehe ya mauzo ya awali. Ukirejesha muamala wa zamani leo, thamani yake huhesabika kwenye takwimu ya hasara ya leo katika jumla zote za masaa 24 na siku 7.",
      },
      {
        q: "Je, naweza kupata zaidi ya ujumbe mmoja kama nikiangalia programu tena baadaye siku hiyo?",
        a: "Hapana. Muhtasari huzalishwa mara moja kwa biashara kwa siku ya kalenda — kama tayari umeundwa kwa siku ya leo, kazi ya kiotomatiki huruka akaunti yako badala ya kuzalisha au kutuma nakala nyingine.",
      },
      {
        q: "Je, hii inabadilisha Muhtasari wa Kila Siku ninaouona ndani ya programu, wenye alama ya afya na hatua iliyopendekezwa?",
        a: "Hapana, hicho ni kipengele tofauti na hakikuguswa. Muhtasari wa Kila Siku ndani ya programu bado unakokotoa alama yake ya afya, hitilafu, na kipengele cha hatua kwa uhuru, na unaweza kuufungua katika AskBiz wakati wowote bila kujali mipangilio yako ya WhatsApp.",
      },
    ],
  },
  "forgot-pin-reset-whatsapp-askbiz": {
    title: "Umesahau PIN Yako ya AskBiz? Ijirekebishe Mwenyewe kupitia WhatsApp",
    description:
      "Jinsi ya kurejesha PIN yako mwenyewe ya kuingia AskBiz bila kuwasiliana na msaada — thibitisha simu yako kupitia WhatsApp na uweke PIN mpya ya tarakimu 4 chini ya dakika moja.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "nimesahau PIN",
      "rekebisha PIN",
      "AskBiz",
      "uthibitisho wa WhatsApp",
      "kuingia",
      "kuingia kwa simu",
      "kurejesha akaunti",
      "mafunzo",
    ],
    keyTakeaways: [
      "Forgot PIN? kwenye ukurasa wa kuingia huanzisha urekebishaji wa mwenyewe — ingiza nambari yako ya simu, thibitisha msimbo wa tarakimu 6 uliotumwa kupitia WhatsApp, kisha weka PIN mpya ya tarakimu 4.",
      "Msimbo huisha muda baada ya dakika 10, huruhusu majaribio 5, na kuna muda wa kusubiri wa sekunde 60 kabla ya kuomba mwingine.",
      "Hii hurekebisha PIN yako mwenyewe ya kuingia ya mmiliki kwa programu kuu ya AskBiz — haihusiani na PIN za tili za wafanyakazi wa POS, ambazo meneja bado anazirekebisha kutoka POS > Staff > Edit > Reset PIN.",
      "Kabla ya hii kuanza kutumika, mmiliki aliyefungiwa hakuwa na chaguo la mwenyewe kabisa — njia pekee ilikuwa kuwasiliana na msaada na kusubiri msimamizi kuzalisha na kuwasilisha PIN ya muda kwa mkono.",
    ],
    content: [
      {
        heading: "PIN mbili tofauti, na hii ni kuhusu moja tu",
        body: "AskBiz kwa uhalisia ina PIN mbili ambazo ni rahisi kuchanganya. PIN yako ya kuingia ndiyo unayotumia kuingia programu kuu ya AskBiz kwa nambari yako ya simu — ndiyo jinsi wewe (mmiliki wa akaunti) unavyoingia dashibodi yako, ripoti, na mipangilio. PIN ya tili ya mfanyakazi wa POS ni kitu tofauti kabisa: msimbo mfupi meneja anampa kila keshia ili aweze kuingia tili bila kushiriki kuingia kwa mmiliki. Makala hii ni kuhusu ile ya kwanza — PIN yako mwenyewe ya kuingia. Kama keshia amesahau PIN yake ya tili, hilo linarekebishwa na meneja au mmiliki kwenda POS > Staff, kubofya Edit karibu na jina lake, na kuchagua Reset PIN — hakuna kilichobadilika kuhusu mchakato huo. Kilicho kipya ni njia yako mwenyewe ya kurejesha PIN yako ya kuingia bila msaada wa mtu mwingine yeyote.",
      },
      {
        heading: "Mahali pa kuipata",
        body: "Kwenye ukurasa wa kuingia wa AskBiz, tafuta chini kidogo ya sehemu ya PIN kiungo cha Forgot PIN?. Kukibofya hukupeleka kwenye ukurasa maalum wa urejeshaji katika askbiz.co/forgot-pin, tofauti na kadi kuu ya kuingia, iliyojengwa kama skrini nyembamba, ya kusudi moja hivyo ni dhahiri uko kwenye mtiririko wa urejeshaji badala ya kuingia kwa kawaida.",
      },
      {
        heading: "Hatua ya 1: Thibitisha nambari yako ya simu",
        body: "Ingiza nambari ya simu iliyosajiliwa kwenye akaunti yako ya AskBiz, ukiwa na msimbo sahihi wa nchi — nambari ileile unayoingia nayo kwa kawaida. Gusa Send code via WhatsApp. Nambari yoyote uliyoingiza, utaona ujumbe uleule wa uthibitisho unaofuata: AskBiz kamwe haifichui kwenye skrini hii kama nambari hiyo kwa uhalisia ni ya akaunti fulani. Hilo ni la makusudi — hukomesha mtiririko wa urejeshaji kutumika kama njia ya kuangalia ni nambari zipi za simu zilizosajiliwa AskBiz. Kama nambari hiyo ni ya akaunti fulani, msimbo wa tarakimu 6 huwasili kwenye WhatsApp ndani ya muda mfupi.",
      },
      {
        heading: "Hatua ya 2: Ingiza msimbo na chagua PIN mpya",
        body: "Kwenye skrini inayofuata, ingiza msimbo wa tarakimu 6 kutoka WhatsApp pamoja na PIN mpya ya tarakimu 4, iliyoandikwa mara mbili kuthibitisha inalingana. Wasilisha, na — ikiwa msimbo ni sahihi na bado halali — PIN yako ya kuingia husasishwa mara moja. Unapelekwa kwenye skrini ya uthibitisho yenye kiungo cha kurudi moja kwa moja kuingia, ambako PIN yako mpya inafanya kazi papo hapo.",
      },
      {
        heading: "Vikomo, na kwa nini vipo",
        body: "Vikomo vichache hulinda mtiririko huu dhidi ya matumizi mabaya. Msimbo huisha muda dakika 10 baada ya kutumwa, hivyo msimbo wa zamani, usiotumika uliokaa kwenye mazungumzo ya WhatsApp hauwezi kutumika baadaye. Unapata majaribio 5 kuuingiza kwa usahihi kabla haujabatilishwa na ukalazimika kuomba mpya. Na ukigusa Resend code, kuna muda wa kusubiri wa sekunde 60 kabla mwingine kutoka kwa uhalisia, ambao hukomesha nambari ileile kufurikishwa na misimbo. Hakuna kati ya haya kinachopaswa kukuzuia wakati wa urejeshaji wa kawaida — ingiza msimbo mara moja, kwa usahihi, ndani ya dakika chache za kuwasili kwake, na umemaliza. Vikomo huuma tu kama kitu kimeharibika, ambapo ndipo unavihitaji.",
      },
      {
        heading: "Jinsi AskBiz inavyolinganisha nambari yako ya simu na akaunti yako",
        body: "Nyuma ya pazia, AskBiz hutafuta nambari yako ya simu kwenye jedwali maalum lililojengwa hasa kwa kusudi hili, badala ya kutegemea nambari ya simu iliyohifadhiwa kwenye mipangilio yako ya jumla ya wasifu. Tofauti hiyo ni muhimu: sehemu ya simu ya wasifu wako ni thamani ya mipangilio inayoweza kuhaririwa tu — unaweza kuisasisha wakati wowote, na hakuna kinachozuia watu wawili kuingiza nambari inayofanana kwa bahati mbaya. Mtiririko wa urejeshaji unahitaji uhusiano usio na utata, wa kuaminika kati ya nambari ya simu na akaunti moja kabla ya kuruhusu mtu yeyote kubadilisha PIN, hivyo hutumia rekodi tofauti ya utambulisho badala yake, iliyowekwa unapojiunga kwanza na kudumishwa tangu hapo.",
      },
      {
        heading: "Urejeshaji ulivyokuwa kabla ya hii kuwepo",
        body: "Hadi mwishoni mwa Julai 2026, hakukuwa na chaguo la mwenyewe kabisa. Kama ulisahau PIN yako ya kuingia ya AskBiz, njia pekee ilikuwa kuwasiliana na msaada moja kwa moja — kwa barua pepe au WhatsApp — kueleza wewe ni nani, na kusubiri msimamizi upande wa AskBiz kuzalisha kwa mkono PIN ya muda na kuiwasilisha kwako nje ya mfumo. Hilo lilifanya kazi, lakini lilimaanisha kila kufungiwa moja kulihitaji binadamu upande mwingine, na ulikuwa umekwama ukisubiri muda wowote ambao mtu angeliochukua kuuchukua. Mtiririko ulioidhinishwa na WhatsApp hufanya kazi ileile chini ya dakika moja, wakati wowote, bila mtu mwingine yeyote kuhitajika kushiriki.",
      },
    ],
    faq: [
      {
        q: "Je, hii ni sawa na kurekebisha PIN ya tili ya keshia?",
        a: "Hapana. Hii hurekebisha PIN yako mwenyewe ya kuingia ya mmiliki kwa programu kuu ya AskBiz. PIN ya tili ya POS ya keshia ni mfumo tofauti kabisa, na bado inarekebishwa vilevile kama zamani — meneja au mmiliki huenda POS > Staff, kubofya Edit karibu na mfanyakazi huyo, na kuchagua Reset PIN.",
      },
      {
        q: "Niliingiza nambari yangu ya simu lakini sikupata msimbo wa WhatsApp. Kuna nini?",
        a: "Utaona ujumbe uleule wa uthibitisho wa 'angalia WhatsApp' bila kujali kama nambari hiyo kwa uhalisia imesajiliwa — hilo ni la makusudi, hivyo ukurasa hauwezi kutumika kuangalia ni nambari zipi zina akaunti. Kama hakuna kinachofika, hakikisha uliingiza nambari halisi ambayo akaunti yako imesajiliwa nayo, ikiwa na msimbo wa nchi, na ujaribu tena baada ya muda wa kusubiri wa sekunde 60.",
      },
      {
        q: "Nina muda gani wa kuingiza msimbo kabla haujaisha muda?",
        a: "Dakika 10 kutoka wakati unapotumwa. Baada ya hapo hauko halali tena na utahitaji kuomba mpya kutoka skrini iliyotangulia.",
      },
      {
        q: "Nini kinatokea nikiendelea kuingiza msimbo usio sahihi?",
        a: "Unapata majaribio 5. Baada ya hapo, msimbo hubatilishwa kwa usalama na utahitaji kuomba mpya badala ya kuendelea kubashiri.",
      },
      {
        q: "Naweza kuomba msimbo mwingine mara moja kama sikupata wa kwanza?",
        a: "Kuna muda wa kusubiri wa sekunde 60 kati ya maombi ya misimbo kwa nambari ileile. Baada ya dirisha hilo, gusa Resend code kwenye skrini ya uthibitisho kupata mpya.",
      },
    ],
  },
  "zakat-calculator-charity-askbiz": {
    title: "Kikokotoo cha Zaka cha AskBiz: Jinsi Kinavyofanya Kazi na Mahali pa Kukipata",
    description:
      "Jinsi kichupo cha Zaka katika My Business kinavyokokotoa hali yako ya zaka ya biashara kutoka hisa hai, fedha, madeni ya kupokea na kulipwa, kufuatilia nisabu na haul kiotomatiki, na kukuunganisha na saraka ya hisani mshirika — bure kwa kila mpango.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: [
      "kikokotoo cha zaka",
      "kikokotoo cha zaka kwa biashara",
      "kikokotoo cha nisabu",
      "kifuatiliaji cha haul",
      "zana ya zaka ya biashara",
      "fedha za kiislamu za biashara",
      "saraka ya hisani ya zaka",
      "AskBiz",
      "My Business",
    ],
    keyTakeaways: [
      "Kikokotoo cha zaka kiko katika My Business (/intelligence) chini ya kichupo chake cha Zaka — kiungo cha moja kwa moja /intelligence?tab=zakat — na ni bure kwa kila mpango, ikiwa ni pamoja na Free, bila kuhitaji kupandisha daraja.",
      "Hukokotoa zaka kwenye mali za biashara pekee: fedha + hisa (thamani ya rejareja) + madeni ya kupokea − madeni ya kulipwa, ikiwa haizidi chini ya sifuri. Takwimu yoyote inaweza kubadilishwa kwa kikokotoo kimoja pekee bila kugusa hisa yako halisi au rekodi za CFO.",
      "Nisabu ni kiwango cha kawaida cha kizani (gramu 87.48 za dhahabu au gramu 612.36 za fedha, fedha ikitumika kwa kawaida) kilichobadilishwa kuwa sarafu yako kupitia utafutaji wa mkono wa 'Check current price' — haisasishwi lenyewe.",
      "Haul (mwaka wa kilunari wa siku 355) hufuatiliwa kiotomatiki: pau ya maendeleo huanza siku ambayo msingi wako wa zaka unavuka nisabu kwa mara ya kwanza na hurudi mwanzo ikiwa itashuka chini kabla mwaka kukamilika.",
      "Ni chombo cha kusaidia kukokotoa, si fatwa — hakijumuishi hukumu maalum za madhehebu, zaka ya kilimo au mifugo, dhahabu/fedha za binafsi, au mali ya kibinafsi nje ya biashara.",
    ],
    content: [
      {
        heading: "Mahali pa kukipata",
        body: "Fungua My Business kutoka menyu kuu — hiyo ni ukurasa wa /intelligence — na uchague kichupo cha Zaka. Kiko karibu na Overview, CFO, Team, Logistics, Market na Actions, hivyo ni kichupo cha daraja la kwanza, si mpangilio uliofichwa. Kama unataka kuruka moja kwa moja pale, kiungo cha moja kwa moja ni /intelligence?tab=zakat.\n\nKitu kimoja cha kujua kabla ya kukitafuta kwa njia nyingine: mazungumzo ya AI ya AskBiz bado hayawezi kukupeleka moja kwa moja kwenye kichupo hiki, jinsi yanavyoweza kwa sehemu nyingine za programu. Kuuliza \"nipeleke zaka\" hakutakuweka kwenye kichupo hicho — fungua My Business na ubofye Zaka moja kwa moja badala yake.",
      },
      {
        heading: "Ni bure kwa kila mpango",
        body: "Kikokotoo cha zaka hakijafungiwa nyuma ya Growth, Business, au daraja lolote lingine — kinapatikana katika Free bila kuhitaji kupandisha daraja. Hilo ni la makusudi: zaka ni wajibu wa kidini uliounganishwa na msimamo wako halisi wa biashara, si kipengele cha uchambuzi wa kulipia, hivyo AskBiz haiweki ukuta wa malipo mbele yake.",
      },
      {
        heading: "Kinachokokotolewa kwa uhalisia: msingi wa zaka",
        body: "Kila unapofungua kikokotoo, AskBiz huchota takwimu nne hai kutoka data yako ya biashara na kuzichanganya kuwa kile inachokiita msingi wako wa zaka:\n\n- Fedha — salio la fedha ulilolingiza katika mipangilio yako ya gharama ya CFO. Kama hujaingiza moja kamwe, kigae huonyesha 'Not set' badala ya kuchukulia kimya kimya kuwa sifuri, hivyo hutopunguza kimakosa msimamo wako.\n- Hisa — thamani ya rejareja ya hisa yako hai, ikikokotolewa kama bei ya kuuza × kiasi kilichopo kwa kila kitu unachobeba kwa sasa.\n- Madeni ya kupokea — fedha unazodaiwa, zikichotwa kutoka madeni yako ya kupokea yaliyorekodiwa.\n- Madeni ya kulipwa — fedha unazodaiwa, zikitolewa kwenye jumla. Hii inajumuisha agizo lolote la ununuzi ulilopokea hisa dhidi yake lakini bado hujamlipa msambazaji wako kikamilifu.\n\nMsingi wa zaka ni Fedha + Hisa + Madeni ya kupokea − Madeni ya kulipwa, ikiwa haizidi chini ya sifuri. Hii inajumuisha mali za biashara pekee — si picha ya karatasi yako yote ya mizani, na kwa makusudi haijumuishi mali za kudumu kama vifaa au majengo, ambazo hazina zaka kwa namna sawa.\n\nKila moja ya takwimu hizo nne inaweza kuguswa. Kama namba inaonekana si sahihi — salio lako la fedha ni la zamani, au unajua deni la kupokea limekwisha andikwa kama hasara — gusa na uingize thamani sahihi kwa kikokotoo hicho. Marekebisho hayaathiri isipokuwa matokeo yaliyo mbele yako: hayaandikwi tena kwenye hisa yako au rekodi za CFO, na hayatakumbukwa mara ijayo unapofungua kichupo isipokuwa uyaingize tena.",
      },
      {
        heading: "Nisabu: kiwango kinachoamua kama unadaiwa chochote kabisa",
        body: "Zaka huwa lazima tu wakati msingi wako wa zaka umefikia au kuzidi nisabu, kiwango cha chini cha utajiri. AskBiz hutumia ufafanuzi wa kawaida wa kizani: gramu 87.48 za dhahabu, au gramu 612.36 za fedha. Fedha hutumika kwa kawaida kwa sababu ndiyo kiwango cha chini kati ya viwili — unaweza kubadilisha kuwa dhahabu wakati wowote kama ndiyo unayotaka kukokotoa dhidi yake.\n\nKikokotoo hakisasishi bei za madini yenyewe. Unaanzisha utafutaji kwa mkono na kitufe cha 'Check current price', kinachofanya utafutaji wa bei hai na kubadilisha kiwango cha uzani kuwa sarafu yako ya nchi. AskBiz huhifadhi matokeo hayo pamoja na tarehe iliyoangaliwa, hivyo haitafuti bei upya kila unapofungua kichupo — na kila madini hukumbuka bei na tarehe yake ya mwisho kuangaliwa tofauti, hivyo kubadilisha kati ya dhahabu na fedha hakupotezi thamani yoyote. Chukulia takwimu hiyo kama makadirio ya soko dalili badala ya kiwango halisi cha wakati huo; kama usahihi unahitajika kweli kwa hali yako, uthibitishe kwa uhuru kabla ya kuitegemea.",
      },
      {
        heading: "Haul: kwa nini kuwa juu ya nisabu leo si sawa na kudaiwa zaka leo",
        body: "Kuvuka nisabu haimaanishi zaka inadaiwa mara moja — msingi wako wa zaka unahitaji kubaki katika au juu ya nisabu kwa mwaka mzima wa kilunari, haul, kabla chochote kikweli kudaiwa. AskBiz hufuatilia haul ya siku 355 kiotomatiki, bila kuhitaji kuingiza kwa mkono:\n\n- Siku msingi wako wa zaka unapovuka nisabu kwa mara ya kwanza, AskBiz huanzisha saa ya haul na kuonyesha pau ya maendeleo.\n- Kama msingi wako wa zaka ukishuka chini ya nisabu kabla mwaka kukamilika, saa hurudi mwanzo. Huanza tena mara unayovuka kiwango hicho tena.\n- Mara haul kamili inapokamilika ukiwa bado juu ya nisabu, hali hubadilika kuwa Due now, ikionyesha 2.5% ya msingi wako wa zaka kama kiasi kinachodaiwa.\n\nHadi haul kamilike, takwimu yoyote inayoonyeshwa ni makadirio yanayoendelea kutokana na namba zako za sasa, si kiasi kinachodaiwa — kitaendelea kubadilika kadri fedha, hisa, na madeni ya kupokea yako yanavyobadilika siku baada ya siku. Alama ya hali hukuambia hasa unaposimama: Check price to begin (nisabu haijaangaliwa bado), Below nisab, Above nisab (haul running), au Due now.",
      },
      {
        heading: "Kutoa kwa hisani — na kwa nini hujafungwa na orodha ya AskBiz",
        body: "Chini ya kikokotoo, AskBiz huorodhesha hisani washirika unaoweza kutoa moja kwa moja, zikichujwa kwa nchi yako pale AskBiz ina mlinganisho. Kila kiingilio kinaunganisha na ukurasa wa michango wa hisani hiyo yenyewe — AskBiz haifanyi malipo yenyewe, inakuelekeza tu huko.\n\nSaraka ni urahisi, si sharti. Uko huru kabisa kulipa zaka yako kwa hisani au mpokeaji yeyote wa uchaguzi wako mwenyewe, ndani au nje ya orodha. Kama hakuna kilichoorodheshwa bado kwa nchi yako, hiyo ni pengo katika saraka inayoendelea kukua, si ishara kwamba huna pa kutoa — tumia hisani yoyote unayoiamini tayari.",
      },
      {
        heading: "Kisichofanya chombo hiki",
        body: "Kikokotoo cha zaka kimejengwa kama chombo cha kusaidia kukokotoa, kikizingatia mbinu ya kawaida ya nisabu, haul, na 2.5% kwa zaka ya mali za biashara au biashara — si fatwa, na hakijaribu kuwa hivyo. Hakizingatii tofauti maalum za madhehebu jinsi zaka inavyokokotolewa, hakijumuishi zaka ya kilimo au mifugo, hakijumuishi dhahabu au fedha za binafsi, na haligusi mali yako ya kibinafsi nje ya biashara. Kama hali yako inahitaji hukumu badala ya namba, hiyo ni mazungumzo kwa msomi wako mwenyewe au imamu — AskBiz inakupa takwimu za kuleta kwenye mazungumzo hayo, si mbadala wake.",
      },
    ],
    faq: [
      {
        q: "Je, kikokotoo cha Zaka ni bure kweli, au kinahitaji mpango wa kulipia?",
        a: "Ni bure kweli kwa kila mpango, ikiwa ni pamoja na Free — hakuna kupandisha daraja kunahitajika kukitumia.",
      },
      {
        q: "Kwa nini takwimu yangu ya fedha inaonyesha 'Not set' badala ya sifuri?",
        a: "AskBiz inajua salio lako la fedha tu kama umeingiza moja katika mipangilio yako ya gharama ya CFO. Kama hujafanya hivyo, kigae huonyesha 'Not set' badala ya kudhania sifuri, kwa kuwa kudhania sifuri kunaweza kupunguza kimakosa msingi wako wa zaka. Gusa kigae kuingiza takwimu ya fedha moja kwa moja kwa kikokotoo hicho badala yake.",
      },
      {
        q: "Nikirekebisha takwimu kwenye kikokotoo, je, husasisha hisa yangu halisi au namba za CFO?",
        a: "Hapana. Marekebisho huathiri tu kikokotoo unachoangalia wakati huo — kamwe hayaandikwi tena kwenye hisa, CFO, au data yako ya uhasibu, na hayakumbukwi mara ijayo unapofungua kichupo.",
      },
      {
        q: "Je, kuwa juu ya nisabu kunamaanisha nadaiwa zaka sasa hivi?",
        a: "Sio lazima. Unahitaji kubaki katika au juu ya nisabu kwa mwaka mzima wa kilunari (siku 355, haul) kabla zaka kikweli kudaiwa. AskBiz hufuatilia hii na pau ya maendeleo na kuirudisha mwanzo kama msingi wako wa zaka ukishuka chini ya nisabu kabla mwaka kukamilika.",
      },
      {
        q: "Je, naweza kutoa zaka yangu kwa hisani isiyo katika saraka ya AskBiz?",
        a: "Ndiyo. Orodha ya hisani washirika ni urahisi wa kutoa moja kwa moja kutoka ndani ya AskBiz — uko huru kulipa zaka yako kwa hisani au mpokeaji yeyote unaostahili kwa uchaguzi wako mwenyewe.",
      },
    ],
  },
  "factory-sector-guide-askbiz": {
    title: "Kuendesha Kiwanda katika AskBiz: Vipande vya Uzalishaji, Ubora, Muda wa Kusimama, Zamu na Nyaraka za Usafirishaji",
    description: "Ziara kamili ya modi ya sekta ya Kiwanda ya AskBiz — kurasa tisa maalum, hatua nne za upigaji picha, majukumu matano ya wafanyakazi wa kiwanda, na violezo 12 vya aina za viwanda vinavyojaza mchakato wako mapema.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    keywords: [
      "Modi ya Kiwanda",
      "AskBiz",
      "utengenezaji",
      "ufuatiliaji wa vipande vya uzalishaji",
      "udhibiti wa ubora",
      "muda wa kusimama",
      "zamu",
      "nyaraka za usafirishaji",
      "aina ya kiwanda",
      "uzalishaji",
    ],
    keyTakeaways: [
      "Kiwanda ni mojawapo ya modi sita za sekta za POS (pamoja na Retail, Restaurant, Repair, Salon na Logistics), zenye kurasa tisa maalum: Capture, Batch, Quality, Downtime, Shift, Waybill, Production, Staff, na Approvals.",
      "Upigaji picha umegawanywa katika hatua nne — mapokezi, matokeo, upotevu, usafirishaji — kila moja ikilindwa na ruhusa yake mwenyewe, hivyo jukumu linaweza kupewa hatua zile tu ambazo linapaswa kupiga picha kwa uhalisia.",
      "Kuchagua aina ya biashara 'mtengenezaji' wakati wa kujiunga (au baadaye katika mipangilio ya msimamizi) huonyesha kichaguzi cha aina ya kiwanda chenye violezo 12 vinavyojumuisha kukamua mafuta, maji, kusaga, maziwa, mikate, sabuni, kuku, kahawa, kuvuta samaki na zaidi.",
      "Kila kiolezo kinajaza mapema mwongozo wa hatua na kiwango cha mavuno kilichopendekezwa cha resipe kwa mchakato wako — hatua zinashirikiwa, lakini mavuno hutofautiana sana kulingana na bidhaa, kutoka takribani 18% hadi 76% kwa aina nne za mbegu za kukamua mafuta pekee.",
      "Majukumu matano maalum ya kiwanda yapo — mwendeshaji wa mstari, mkaguzi wa ubora, msimamizi wa zamu, meneja wa uzalishaji, na meneja wa hisa — kila moja likilinganishwa na kundi tofauti la ruhusa badala ya jukumu la jumla la keshia.",
    ],
    content: [
      {
        heading: "Kiwanda ni modi kamili ya sekta, si nyongeza ya Retail",
        body: "AskBiz POS ina modi sita za sekta: Retail, Restaurant, Repair, Salon, Factory, na Logistics. Retail ndiyo chaguo-msingi kwa biashara nyingi, lakini kama unaendesha biashara ya uzalishaji — kukamua mafuta, kusaga nafaka, kuoka, kubandika maji, kutengeneza sabuni — Modi ya Kiwanda hubadilisha menyu ya mtindo wa retail ya Hisa/Mauzo/Wateja na seti ya kurasa zilizojengwa kuzunguka vipande vya uzalishaji, si miamala ya mauzo ya mtu binafsi. Unafika Modi ya Kiwanda kutoka POS > Operations, ambako huonekana kama mojawapo ya vitufe vya pill vya sekta karibu na tano nyingine. Chini ya kifuniko, Kiwanda huja na kurasa tisa maalum: Capture, Batch, Quality, Downtime, Shift, Waybill, Production, Staff, na Approvals. Kila moja hufunika sehemu tofauti ya kuendesha eneo la uzalishaji, na zimeundwa kutumika pamoja badala ya peke yake — rekodi ya vipande vya uzalishaji hurejea picha na ukaguzi wa ubora ulioahidiwa wakati wake, rekodi ya zamu huonyesha kilichotokea sakafuni wakati wa dirisha hilo, na nyaraka ya usafirishaji hufunga picha ya usafirishaji na karatasi zinazoondoka na bidhaa.",
      },
      {
        heading: "Capture: hatua nne, ruhusa nne tofauti",
        body: "Capture ndiyo mahali pa kuingia kwa kamera kwanza kwa kila kitu kinachotokea sakafuni, na imegawanywa katika aina nne tofauti za upigaji picha: mapokezi (kupiga picha ya malighafi inapofika), matokeo (kupiga picha ya kile kipande cha uzalishaji kilichozalisha kwa uhalisia), upotevu (kupiga picha ya kasoro, uharibifu au upotevu, likiwa na sababu inayohitajika kabla ya kuhifadhi), na usafirishaji (kupiga picha ya kipande cha uzalishaji kinachotoka, likiwa na marudio yanayohitajika kabla ya kuhifadhi). Hizi si vitufe vinne tu kwenye skrini moja — kila hatua imelindwa na ruhusa yake mwenyewe (camera.intake, camera.output, camera.wastage, camera.dispatch), hivyo unaweza kumpa mwendeshaji mdogo wa mstari mapokezi na matokeo tu, ukiweka upotevu na usafirishaji vikizuiliwa kwa wafanyakazi wakuu zaidi, au kumpa jukumu la usalama/usafirishaji usafirishaji peke yake. Uhuru huo ndio unaokuruhusu kulinganisha ufikiaji wa kamera na anayepaswa kupiga picha nini, badala ya ruhusa moja ya kamera ya wote-au-hakuna.",
      },
      {
        heading: "Batch, Quality, Downtime, Shift na Waybill",
        body: "Batch hufuatilia mzunguko wa uzalishaji mwanzo hadi mwisho — picha za mapokezi na matokeo zilizoahidiwa nayo, resipe na mavuno yanayotarajiwa inayopimwa dhidi yake, na kama matokeo halisi yalifika ndani, juu au chini ya kiwango hicho. Quality hurekodi ukaguzi wa ukaguzi dhidi ya kipande cha uzalishaji, hivyo kasoro hurekodiwa dhidi ya mzunguko mahususi uliozizalisha badala ya kuwa dokezo lisilo wazi. Downtime hurekodi kusimama — hitilafu ya mashine, kukatika kwa umeme, pengo la usambazaji — hivyo unaweza kuona wapi muda wa uzalishaji unapotea kwa uhalisia katika wiki au mwezi, si kubashiri tu. Shift ni rekodi maalum ya zamu ya uzalishaji (imewekwa kwa makusudi tofauti na jedwali lililopo la zamu ya tili ya fedha linalotumika mahali pengine katika POS, kwa kuwa zamu ya sakafu ya kiwanda na kipindi cha tili cha keshia ni vitu tofauti vinavyopima kazi tofauti). Waybill huzalisha karatasi ya usafirishaji kwa bidhaa zinazotoka, zikiunganishwa na picha ya usafirishaji na maelezo ya marudio yaliyoingizwa katika hatua hiyo. Production hukupa mwonekano wa kiwango cha sakafu katika yote hapo juu, na Approvals ni mahali msimamizi au meneja huidhinisha picha, vipande vya uzalishaji au nyaraka za usafirishaji zinazohitaji ukaguzi kabla ya kufungwa.",
      },
      {
        heading: "Majukumu matano ya wafanyakazi yaliyojengwa kwa sakafu ya kiwanda, si tili ya duka",
        body: "Modi ya Kiwanda huja na majukumu matano maalum ya wafanyakazi, kila moja likilinganishwa na kundi lake la ruhusa badala ya kutumiwa tena kutoka retail: factory-line-operator, factory-quality-inspector, factory-shift-supervisor, factory-production-manager, na factory-inventory-manager. Mwendeshaji wa mstari amefungwa kwenye kazi ya kila siku ya picha na vipande vya uzalishaji sakafuni; mkaguzi wa ubora hupata zana za ukaguzi na kurekodi kasoro; msimamizi wa zamu husimamia zamu na kuidhinisha kilichotokea wakati wake; meneja wa uzalishaji na meneja wa hisa hupata mwonekano mpana zaidi katika vipande vya uzalishaji, resipe na hisa. Kupanga jukumu sahihi ni muhimu kwa zaidi ya usafi tu — ndicho kinachoamua ni hatua zipi za kamera na kurasa zipi za Kiwanda mfanyakazi fulani anaweza kufungua hasa anapoingia kwa PIN yake.",
      },
      {
        heading: "Violezo kumi na mbili vya aina za viwanda — umbo moja la mchakato, mavuno tofauti sana",
        body: "Unapoweka aina ya biashara kuwa 'mtengenezaji' wakati wa kujiunga — au kubadilisha baadaye katika mipangilio ya msimamizi — AskBiz huonyesha kichaguzi cha aina ya kiwanda chenye violezo 12: Kukamua Mafuta ya Kupikia (ufuta, karanga, alizeti au mchikichi), Maji ya Kunywa yaliyofungashwa, Kusaga Mahindi, Uchakataji wa Mihogo, Kusaga Mchele, Maziwa, Mikate, Sabuni, Matofali ya Zege, Kuku, Kahawa, na Kuvuta Samaki. Kuchagua kimoja hujaza mapema mwongozo wa hatua kwa mchakato wako mahususi — kwa mfano, kiolezo cha kukamua mafuta hupitia mapokezi, kusafisha/kukaanga, kukamua, kuchuja/kubandika chupa, na usafirishaji — pamoja na resipe iliyopendekezwa yenye asilimia ya mavuno inayotarajiwa na kiwango halisi cha chini/juu, hivyo huanzi kufuatilia mavuno yako kutoka jedwali tupu. Hatua zinashirikiwa kwa kiasi kikubwa katika familia moja ya kiolezo, lakini mavuno hayashirikiwi: kukamua mafuta peke yake huanzia takribani 18% hadi 76% kutegemea ni aina gani kati ya nne za mbegu unazoendesha na kama zilikaangwa kwanza, ambayo ndiyo hasa sababu kiolezo kinaweka mstari tofauti wa resipe kwa kila aina ya mbegu badala ya namba moja iliyochanganywa. Unaweza kukubali takwimu zilizopendekezwa za kiolezo kama mwanzo na kuzirekebisha mara vipande vyako vya uzalishaji vinapoonyesha uwiano tofauti wa ulimwengu halisi.",
      },
      {
        heading: "Kilichobadilika hivi karibuni, na kwa nini ni muhimu kama uliweka hii muda mrefu uliopita",
        body: "Kama uliweka Modi ya Kiwanda kabla ya mwishoni mwa Julai 2026, inafaa kujua kwamba Capture na Approvals pekee ndizo zilikuwa zikifanya kazi kwa uhalisia hadi wakati huo — Batch, Quality, Downtime, Shift na Waybill zilikuwa na kurasa za mbele zilizojengwa kikamilifu, lakini njia za API nyuma yake hazikuwepo bado, hivyo chochote kilichoingizwa pale hakikuwa kikihifadhiwa. Marekebisho yalitolewa pamoja na violezo 12 vya aina za viwanda, yakijenga nyuma tano zote zilizokosekana na majedwali yao ya hifadhidata. Marekebisho yaleyale pia yalirekebisha hitilafu ya ruhusa ambapo factory-line-operator ilikuwa ikitatuliwa kuwa ruhusa sifuri za kamera badala ya ufikiaji wa mapokezi/matokeo iliyopaswa kuwa nao, hivyo jukumu lolote la mwendeshaji wa mstari lililopewa kabla ya marekebisho linafaa kuangaliwa mara mbili katika Staff kuthibitisha wanaweza sasa kufungua kamera kwa uhalisia. Kama timu yako imekuwa ikitumia Batch, Quality, Downtime, Shift au Waybill na kutokupata chochote kimehifadhiwa, hiyo ndiyo maelezo — na sasa imetatuliwa, hivyo inafaa kurudi na kuingiza upya chochote ulichojaribu kurekodi wakati wa dirisha hilo.",
      },
    ],
    faq: [
      {
        q: "Nabadilisha vipi biashara yangu kuwa Modi ya Kiwanda?",
        a: "Katika POS > Operations, bofya pill ya Factory karibu na modi tano nyingine za sekta. Kama unaweka akaunti mpya, kuchagua aina ya biashara 'mtengenezaji' wakati wa kujiunga pia huonyesha kichaguzi cha aina ya kiwanda moja kwa moja; unaweza kubadilisha aina ya kiwanda baadaye kutoka mipangilio ya msimamizi.",
      },
      {
        q: "Ni tofauti gani kati ya ukurasa wa Batch na ukurasa wa Capture?",
        a: "Capture ndipo unapopiga picha halisi kwa wakati mahususi — mapokezi, matokeo, upotevu au usafirishaji. Batch ni rekodi inayounganisha picha hizo pamoja kwa mzunguko mmoja wa uzalishaji, pamoja na resipe inayopimwa dhidi yake na kama mavuno yalifika kwa kiwango kilichokusudiwa.",
      },
      {
        q: "Kwa nini mfanyakazi wangu mmoja hawezi kutumia kamera katika Modi ya Kiwanda?",
        a: "Ufikiaji wa kamera katika Modi ya Kiwanda umegawanywa katika ruhusa nne tofauti — mapokezi, matokeo, upotevu, usafirishaji — na kila jukumu la wafanyakazi hupata tu zile linazopaswa kuwa nazo. Angalia jukumu lake lililopewa katika Factory > Staff; kama yuko kwenye factory-line-operator na aliwekwa kabla ya marekebisho ya ruhusa ya Julai 2026, angalia tena kama sasa ana camera.intake na camera.output kama ilivyotarajiwa.",
      },
      {
        q: "Je, violezo 12 vya aina za viwanda vinanifungia kwenye mchakato usiobadilika?",
        a: "Hapana. Kiolezo hujaza mapema mwongozo wa hatua na resipe ya mwanzo yenye kiwango cha mavuno kinachotarajiwa, lakini kila sehemu inaweza kuhaririwa. Mara ukiendesha vipande halisi vya uzalishaji na kujua mavuno yako halisi, sasisha resipe kulingana nayo — kiolezo ni mwanzo, si sharti.",
      },
      {
        q: "Kiwanda changu hufanya kitu ambacho hakiko kwenye violezo 12 — bado naweza kutumia Modi ya Kiwanda?",
        a: "Ndiyo. Violezo 12 ni mapendekezo ya urahisi kwa sekta za kawaida za utengenezaji za Kiafrika, si sharti. Unaweza kutumia kurasa za Capture, Batch, Quality, Downtime, Shift, Waybill, Production, Staff na Approvals za Modi ya Kiwanda bila kuchagua kiolezo — utakuwa tu ukiingiza majina yako mwenyewe ya hatua na takwimu za resipe kutoka mwanzo badala ya kuanzia zilizojazwa mapema.",
      },
    ],
  },
  "pos-free-trial-explained-askbiz": {
    title: "Jinsi Kipindi cha Majaribio Bure cha POS cha AskBiz Kinavyofanya Kazi",
    description: "AskBiz POS hutoa kipindi cha majaribio bure cha siku 30, cha mara moja, bila kuhitaji kadi. Hivi ndivyo hasa vya kukidai, kinachojumuisha, na kinachotokea kinapoisha.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    keywords: ["majaribio bure ya POS", "AskBiz POS", "majaribio ya siku 30", "hakuna kadi inayohitajika", "pos/activate", "kumalizika kwa majaribio", "malipo"],
    keyTakeaways: [
      "Kipindi cha majaribio bure ni cha POS tu, hudumu siku 30, na hakihitaji kadi — kila akaunti inaweza kukidai mara moja.",
      "Utaona kikitolewa mahali pawili: bendera kwenye skrini ya kumaliza kujiunga kwa usajili wa mtu wa POS, na tena kwenye ukurasa wa pos/activate kama hujakidai bado.",
      "Wakati siku 30 zinapoisha bila usajili wa kulipia, AskBiz huzima POS kiotomatiki — data yako inabaki salama, lakini tili huacha kufanya kazi hadi ujisajili.",
      "Kipindi kinacholingana cha majaribio cha mpango wa Growth (BI) kimeondolewa — POS ndicho kipindi pekee cha majaribio bure AskBiz inachotoa kwa sasa.",
      "Hali yako ya majaribio, ikijumuisha siku zilizobaki na tarehe halisi ya mwisho, inaonekana daima kwenye ukurasa wa Billing.",
    ],
    content: [
      {
        heading: "Kinachotolewa hasa na kipindi cha majaribio",
        body: "Kipindi cha majaribio bure cha POS cha AskBiz hufungua tili kamili kwa siku 30 kutoka wakati unaanza, bila kadi ya malipo kuombwa wakati wowote. Ni ofa ya mara moja — kila akaunti inaweza kukidai mara moja tu, ambayo AskBiz hufuatilia upande wa seva badala ya kuamini chochote kwenye kivinjari. Kama ulishakidai zamani (hata kwenye kifaa tofauti au baada ya kufuta vidakuzi vyako), mfumo unajua na hautatoa tena. Kuanzisha majaribio huwasha POS mara moja na kutoa hadi nafasi tano za wafanyakazi, hivyo unaweza kuleta timu yako yote ya tili — makeshia, mameneja, yeyote anayehitaji kuingia — bila kufikia kikomo cha nafasi wakati wa majaribio yenyewe.",
      },
      {
        heading: "Mahali utakapotolewa",
        body: "AskBiz hutoa majaribio katika sehemu mbili, zote mbili zikilenga kukupata ukiuza haraka iwezekanavyo bila kuomba maelezo ya kadi mapema. Ya kwanza ni kwenye skrini ya \"kumaliza\" ya kujiunga, lakini tu kama ulijiunga kama mtu wa POS — utaona bendera ndogo juu ya kitufe cha \"Set up my till\" ikitangaza majaribio ya siku 30. Bendera hiyo ni tangazo tu, si kitufe cha kudai chenyewe; inakuambia ofa ipo kabla hujaenda mbele zaidi. Ya pili, na ile inayoanzisha kweli majaribio, iko kwenye ukurasa wa pos/activate — skrini unayofika unapoenda kuwasha POS. Kabla ya kukusukuma moja kwa moja kwenye malipo ya kulipia, huangalia kama una majaribio yasiyodaiwa. Kama unayo, chaguo la \"Start free trial\" huonekana juu ya vitufe vya malipo; kama ulishakitumia, chaguo hilo halionekani kabisa na unaenda moja kwa moja kwenye chaguo za malipo badala yake. Vyovyote vile, hakuna mwisho wa kufa — kama bofya likifika baada ya ulishakidai mahali pengine (tuseme, ukurasa wa Billing), AskBiz huficha kimya kimya kitufe na kuonyesha njia ya malipo badala yake, badala ya hitilafu.",
      },
      {
        heading: "Kukidai kwenye pos/activate",
        body: "Wakati chaguo la majaribio linapopatikana, ni kitufe cha juu kwenye skrini ya pos/activate — kimeandikwa kuanzisha majaribio bure, kikiwa na kidokezo chini kikithibitisha hakuna kadi inayohitajika. Chini yake kuna mstari wa kugawanya kisha chaguo zako za kawaida za malipo — M-Pesa kwa akaunti za Kenya, pamoja na malipo ya kadi kwa kila mtu. Kugusa kitufe cha majaribio hakukuelekezi popote; huita mfumo wa malipo wa AskBiz moja kwa moja, ambao hurekodi muda wa kuanza kwa majaribio na tarehe ya mwisho ya siku 30 baadaye, huwasha POS, na kukupeleka moja kwa moja kwenye skrini ya uthibitisho. Kutoka pale ni mtiririko uleule wa \"umeshakamilisha\" kama uwashaji wa kulipia — unarudi kwenye tili yako, tayari kuuza.",
      },
      {
        heading: "Kinachotokea siku 30 zinapoisha",
        body: "AskBiz huangalia kumalizika kwa majaribio kila hali yako ya malipo inapopakiwa — kwa uhalisia, hii inamaanisha mara siku zako 30 zinapopita, wakati ujao chochote kinachogusa hali yako ya malipo, mfumo hutambua. Kama hakuna usajili wa kulipia wa POS uliounganishwa na akaunti yako wakati huo, ufikiaji wa POS huzimwa kiotomatiki: tili huacha kutumika, na kuingia kwa wafanyakazi kutakuta mlango umefungwa. Hakuna kinachohusiana na historia yako ya mauzo, hisa, au mipangilio kinachofutwa — vyote bado vipo, vikisubiri. Kujisajili wakati wowote baadaye huwasha POS tena na kila kitu kikiwa hasa jinsi ulivyoacha. Mwisho umewekwa wazi kwa makusudi: hakuna kipindi cha neema cha kusumbua au kufungiwa nusu, ni tu badiliko la kiotomatiki kutoka \"kimewashwa\" hadi \"kimezimwa\" kama majaribio yanaisha bila chochote kulipwa nyuma yake.",
      },
      {
        heading: "Kuangalia hali yako ya majaribio",
        body: "Huhitaji kubashiri ni muda gani umebaki. Ukurasa wa Billing huonyesha beji karibu na sehemu ya POS wakati wowote majaribio yako yanapokuwa hai, ikieleza idadi ya siku zilizobaki na nafasi ngapi unatumia kwa sasa. Ukishasajili — au majaribio yakiisha na ukalipa kuiwasha tena — beji hiyo hubadilika kuwa hali tambarare ya \"active\" badala yake. Kama wewe ni aina ya mmiliki anayependa kupanga mbele badala ya kushtukizwa na tili iliyofungwa katikati ya zamu, ukurasa wa Billing ndipo mahali pa kuangalia, ikiwezekana siku chache kabla siku 30 hazijaisha.",
      },
      {
        heading: "Kwa nini hakuna kinacholingana kwa mpango wa Growth (BI)",
        body: "Kama umesikia kwamba AskBiz zamani ilitoa majaribio bure kwa mpango wake wa ujasusi wa biashara wa Growth, hilo ni kweli — lakini halipatikani tena. Mfumo wa malipo wa AskBiz hukataa waziwazi ombi lolote jipya la majaribio ya Growth ukiwa na ujumbe wazi kwamba umeondolewa; njia ya msimbo ipo tu kukataa maombi, si kutoa. Majaribio ya POS ndicho kipindi pekee cha majaribio bure kinachotolewa kwa sasa. Kama biashara yako inahitaji POS na vipengele vya BI/Growth, majaribio ya POS hukuwezesha tili yako kufanya kazi mara moja bila gharama, wakati ufikiaji wa mpango wa Growth ni uamuzi wa moja kwa moja wa kulipia tangu siku ya kwanza — hakuna kipindi cha majaribio cha kuzingatia katika uamuzi huo.",
      },
    ],
    faq: [
      {
        q: "Je, nahitaji kuingiza kadi kuanzisha majaribio bure ya POS?",
        a: "Hapana. Kuanzisha majaribio hakuhitaji maelezo yoyote ya malipo — ni bure kabisa kwa siku 30 nzima. Utahitaji tu kuongeza njia ya malipo kama ukiamua kujisajili, ama wakati wa au baada ya majaribio.",
      },
      {
        q: "Naweza kudai majaribio mara mbili — kwa mfano kwenye akaunti ya biashara ya pili?",
        a: "Majaribio ni ya mara moja kwa akaunti, yakifuatiliwa upande wa seva, si kwa kifaa au kivinjari. Akaunti ya pili ya AskBiz (usajili tofauti kwa kweli) itastahili majaribio yake mwenyewe, lakini huwezi kuyaanzisha upya kwenye akaunti ileile kwa kufuta vidakuzi au kujaribu tena kutoka skrini tofauti.",
      },
      {
        q: "Ni nini hasa kinachotokea kwa data yangu ya mauzo majaribio yanapoisha?",
        a: "Hakuna kinachofutwa. AskBiz huzima ufikiaji wa POS — kumaanisha tili yenyewe huacha kutumika — lakini kila mauzo, bidhaa, na mpangilio uliokuwa nao huhifadhiwa. Kujisajili wakati wowote baadaye hurejesha ufikiaji kamili na data yako hasa jinsi ilivyokuwa.",
      },
      {
        q: "Nilianzisha majaribio kutoka bendera ya kujiunga — nahitaji kufanya kitu kingine?",
        a: "Bendera ya kujiunga ni tangazo tu kwamba ofa ipo; haianzishi majaribio yenyewe. Unayadai kwenye ukurasa wa pos/activate, unaoufikia kupitia \"Set up my till.\" Kama tayari umeyadai pale, hutaona chaguo tena.",
      },
      {
        q: "Je, kuna majaribio bure kwa mpango wa Growth (BI) pia?",
        a: "Hapana — majaribio ya mpango wa Growth yameondolewa. Kuomba moja sasa hurudisha jibu wazi la \"hayapatikani tena\". POS ndicho pekee mpango wa AskBiz unaotolewa kwa majaribio bure kwa sasa.",
      },
    ],
  },
};
