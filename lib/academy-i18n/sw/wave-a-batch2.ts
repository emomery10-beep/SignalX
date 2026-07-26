import type { LocaleTranslations } from '../../academy-i18n-loader'

// Wave A, Batch 2 — Swahili (sw) translations for POS Academy articles.
// Glossary locked with sibling batch 1 agent — reuse terms exactly:
// faida=margin/profit, mapato=revenue, hisa=stock/inventory, keshia=cashier
// (makeshia=plural), kifurushi=parcel, dashibodi=dashboard, Hifadhi=Save,
// Futa=Cancel/Void, mfumo wa POS=POS system, sehemu ya mauzo=point of sale,
// risiti=receipt, marejesho=refund (kamili=full, ya sehemu=partial),
// VAT=VAT, wafanyakazi=staff, jukumu/majokumu=role/roles, Mmiliki=Owner,
// Meneja/Msimamizi=Manager, Keshia=Cashier, Magic Link=magic link (kept),
// bakodi=barcode, kikapu=cart, punguzo=discount, kufuta (muamala)=void,
// rekodi ya ukaguzi=audit trail, kiwango cha kuagiza tena=reorder point,
// arifa ya hisa kidogo=low-stock alert, agizo la ununuzi=purchase order,
// muamala=transaction, mauzo=sale, mapato ya kila siku=daily revenue,
// usimamizi wa hisa=inventory management, maelezo=annotation/note,
// AskBiz/WhatsApp=proper nouns, never translated.

export const wave_a_batch2Translations: LocaleTranslations = {
  'pos-vat-calculations': {
    title: 'Hesabu za VAT na Uzingatiaji wa Kodi kwa Miamala ya POS',
    description:
      'Pata hesabu za VAT sahihi tangu mauzo ya kwanza. Mfumo wa POS wa AskBiz huhesabu VAT kiotomatiki kwenye kila muamala na kukuweka tayari kwa Making Tax Digital.',
    keywords: [
      'hesabu ya VAT ya POS',
      'uzingatiaji wa VAT kwa POS',
      'Making Tax Digital POS',
      'kiwango cha VAT rejareja',
      'hesabu ya VAT kiotomatiki',
      'taarifa ya kodi ya POS UK',
      'bei inayojumuisha VAT',
    ],
    keyTakeaways: [
      'Mfumo wa POS wa AskBiz huhesabu VAT kiotomatiki kwenye kila mauzo kulingana na kiwango cha VAT kilichowekwa kwa kila bidhaa.',
      'Bidhaa zinaweza kuwekewa kiwango cha kawaida (20%), kilichopunguzwa (5%), sifuri (0%), au msamaha — AskBiz hushughulikia vikapu vyenye mchanganyiko wa viwango kwa usahihi.',
      'Data ya VAT ya kila muamala huingia moja kwa moja kwenye taarifa zako, jambo linalorahisisha uwasilishaji wa Making Tax Digital.',
    ],
    content: [
      {
        heading: 'Jinsi AskBiz POS inavyoshughulikia VAT',
        body: 'Unapoongeza bidhaa kwenye orodha yako ya AskBiz, unaipa kiwango cha VAT: cha kawaida (20%), kilichopunguzwa (5%), sifuri (0%), au msamaha. Kuanzia hapo, kila mauzo yanayohusisha bidhaa hiyo hupata hesabu ya VAT kiotomatiki. Ikiwa mteja ananunua vitu vitatu vyenye viwango tofauti vya VAT — kwa mfano, kifaa chenye kiwango cha kawaida, kiti cha gari cha mtoto chenye kiwango kilichopunguzwa, na kitabu chenye kiwango cha sifuri — AskBiz huhesabu VAT sahihi kwa kila kitu na kuonyesha muhtasari wa pamoja wa VAT kwenye risiti. Huhitaji kufikiria juu ya hili wakati wa mauzo; mfumo hufanya kazi hiyo nyuma ya pazia. Risiti huonyesha kiasi halisi (net), kiasi cha VAT, na jumla kamili (gross), ambayo ndiyo wateja wako waliosajiliwa kwa VAT wanahitaji kwa rekodi zao wenyewe. Kwa bei zinazojumuisha VAT (ambapo bei ya rafuni tayari inajumuisha VAT), AskBiz hurudisha nyuma kuhesabu kiasi halisi na sehemu ya VAT kwa kutumia fomula ya kawaida.',
      },
      {
        heading: 'Bei zinazojumuisha VAT dhidi ya zisizojumuisha VAT',
        body: 'Katika biashara ya rejareja ya UK, bei zinazoonyeshwa kwa wateja karibu kila mara zinajumuisha VAT — bei iliyo kwenye rafu ndiyo bei mteja analipa, ikiwa na VAT ndani yake. Mfumo wa POS wa AskBiz unasaidia mifumo yote miwili. Kwa mauzo ya rejareja kwa wateja wa kawaida, weka bidhaa zako kwenye bei zinazojumuisha VAT na AskBiz itaonyesha bei kamili kwa mteja huku ikifuatilia kiasi halisi na sehemu ya VAT kando nyuma ya pazia. Kwa wateja wa jumla au biashara wanaohitaji kuona bei halisi, unaweza kubadilisha kwenda kwenye bei zisizojumuisha VAT, ambapo bei inayoonyeshwa ni kabla ya VAT na mfumo huongeza VAT wakati wa malipo. Unaweza hata kufanya kazi kwa mchanganyiko — bei zinazojumuisha VAT kwa wateja wanaotembelea moja kwa moja na zisizojumuisha VAT kwa akaunti za biashara — kwa kusanidi mapendeleo ya maonyesho kwa kila mteja au kila muamala. Unyumbufu huu ni wa manufaa hasa kwa biashara zinazohudumia wateja wa rejareja na wa jumla kutoka eneo moja.',
      },
      {
        heading: 'Making Tax Digital na data yako ya POS',
        body: 'Making Tax Digital (MTD) ni mpango wa HMRC wa kuhamisha usimamizi wa kodi mtandaoni. Ikiwa umesajiliwa kwa VAT, tayari unahitajika kutunza rekodi za kidijitali na kuwasilisha taarifa za VAT kupitia programu inayoendana na MTD. Mfumo wa POS wa AskBiz huzalisha rekodi za kidijitali za kila muamala kiotomatiki, jambo linalomaanisha data yako ya POS tayari iko tayari kwa MTD. Kila mauzo hurekodi tarehe, kiasi halisi, kiwango cha VAT, kiasi cha VAT, na jumla kamili. Rekodi hizi huhifadhiwa kidijitali, zenye alama ya muda, na haziwezi kubadilishwa (kutokana na muundo wa muamala usiobadilika), jambo linalotimiza matakwa yote ya HMRC. Wakati wa kuandaa taarifa yako ya VAT, unaweza kutoa data yako ya miamala ya POS na kuiingiza kwenye programu yako ya uhasibu inayoendana na MTD. AskBiz hutoa data katika mfumo sahihi, ikipunguza uingizaji wa mkono na makosa yanayoambatana nayo.',
      },
      {
        heading: 'Makosa ya kawaida ya VAT kwa watumiaji wa POS',
        body: 'Kosa la kawaida zaidi ni kuweka kiwango kisicho sahihi cha VAT kwenye bidhaa. Nchini UK, sheria ni za kina na wakati mwingine hazionekani wazi — kwa mfano, biskuti wa kawaida ana kiwango cha sifuri, lakini biskuti wenye chokoleti ana kiwango cha kawaida. Chakula cha moto cha kuchukua ana kiwango cha kawaida, lakini chakula baridi cha kuchukua kwa kawaida ana kiwango cha sifuri. Nguo za watoto zina kiwango cha sifuri, lakini nguo za watu wazima zina kiwango cha kawaida. Ikiwa huna uhakika kuhusu hali ya VAT ya bidhaa, angalia mwongozo wa VAT wa HMRC kwa sekta yako au muulize mhasibu wako. Kukosea kunaweza kusababisha kulipa VAT kidogo au nyingi kuliko inavyostahili, yote mawili yanaleta matatizo. AskBiz hukuruhusu kusasisha viwango vya VAT kwa wingi ukigundua kosa, na marekebisho hayo huonekana kwenye kipindi chako kijacho cha taarifa. Jambo muhimu ni kuweka viwango sahihi tangu mwanzo na kuyakagua kila wakati HMRC inaposasisha sheria.',
      },
    ],
    faq: [
      {
        q: 'Je, nahitaji kuwa nimesajiliwa kwa VAT ili nitumie AskBiz POS?',
        a: 'Hapana. Ikiwa hujasajiliwa kwa VAT, unaweza kuweka bidhaa zote kwenye VAT sifuri na AskBiz haitaongeza kodi yoyote. Ukisajiliwa kwa VAT, sasisha tu viwango vya VAT vya bidhaa zako.',
      },
      {
        q: 'Je, AskBiz inaweza kuwasilisha taarifa yangu ya VAT moja kwa moja kwa HMRC?',
        a: 'AskBiz hutoa data ya miamala unayohitaji kwa taarifa yako ya VAT. Unawasilisha taarifa hiyo kupitia programu yako ya uhasibu inayoendana na MTD. Uwasilishaji wa moja kwa moja kwa HMRC kutoka AskBiz uko kwenye ramani ya baadaye.',
      },
    ],
  },

  'pos-audit-trail': {
    title: 'Rekodi za Ukaguzi: Kila Muamala, Ukifuatiliwa na Usiobadilika',
    description:
      'Mfumo wa POS wa AskBiz hutunza rekodi kamili na isiyobadilika ya kila mauzo, marejesho, kufuta muamala, na marekebisho. Hii ndiyo sababu jambo hilo ni muhimu na jinsi ya kulitumia.',
    keywords: [
      'rekodi ya ukaguzi ya POS',
      'kumbukumbu ya ukaguzi wa muamala',
      'rekodi zisizobadilika',
      'uzingatiaji wa POS',
      'rekodi ya ukaguzi rejareja',
      'historia ya muamala ya POS',
      'ukaguzi wa HMRC POS',
    ],
    keyTakeaways: [
      'Kila hatua kwenye AskBiz POS — mauzo, marejesho, kufuta muamala, mabadiliko ya bei — hurekodiwa kwenye rekodi ya ukaguzi isiyobadilika.',
      'Rekodi za ukaguzi hukukinga wakati wa ukaguzi wa HMRC, uchunguzi wa udanganyifu, na migogoro ya wateja.',
      'Unaweza kutafuta, kuchuja, na kutoa data ya rekodi ya ukaguzi kwa kipindi chochote cha tarehe.',
    ],
    content: [
      {
        heading: 'Rekodi ya ukaguzi ni nini na kwa nini ni muhimu',
        body: 'Rekodi ya ukaguzi ni kumbukumbu ya matukio yote yanayotokea kwenye mfumo wako wa POS kwa mpangilio wa wakati. Kwenye AskBiz, hii inajumuisha mauzo, marejesho, kufuta muamala, mabadiliko ya bei, matumizi ya punguzo, marekebisho ya hisa, kuingia kwa wafanyakazi, mabadiliko ya jukumu, na mabadiliko ya mipangilio. Kila kipengele hurekodi ni nini kilichotokea, ni lini, na nani aliyefanya. Rekodi hiyo haibadiliki — vipengele haviwezi kuhaririwa au kufutwa, hata na mmiliki wa akaunti. Jambo hili ni muhimu kwa sababu tatu. Kwanza, uzingatiaji: HMRC inaweza kuomba rekodi zako za miamala wakati wa ukaguzi wa VAT, na rekodi ya ukaguzi isiyokatika na isiyobadilika ndiyo kiwango cha juu cha ushahidi. Pili, kuzuia udanganyifu: ikiwa mtu anachakata marejesho ya uongo au kubadilisha bei bila sababu za msingi, rekodi ya ukaguzi itaonyesha hilo. Tatu, kutatua migogoro: mteja anapodai alichajiwa kupita kiasi au hakupokea bidhaa, rekodi ya ukaguzi hukupa ukweli wa kutatua hali kwa haki na haraka.',
      },
      {
        heading: 'Kinachorekodiwa kwenye AskBiz POS',
        body: 'AskBiz hurekodi zaidi ya miamala ya kifedha pekee. Hii ni orodha isiyokamilika ya matukio yanayonaswa kwenye rekodi ya ukaguzi. Mauzo: kila kitu kilichouzwa, bei, idadi, VAT, njia ya malipo, mfanyakazi, na wakati. Marejesho na kufuta muamala: rejea ya muamala wa asili, kiasi cha marejesho, sababu, na mfanyakazi aliyeidhinisha. Mabadiliko ya bei: bei ya asili, bei iliyobadilishwa, na sababu. Punguzo: aina ya punguzo (asilimia au kiasi kilichowekwa), kiasi, na kama lilitumika kwa kitu kimoja au kikapu kizima. Marekebisho ya hisa: bidhaa, idadi ya zamani, idadi mpya, na sababu ya marekebisho. Matukio ya wafanyakazi: kuingia, kutoka, mabadiliko ya jukumu, na mialiko mipya ya wafanyakazi. Mabadiliko ya mipangilio: mipangilio ya risiti, viwango vya arifa, na mabadiliko ya njia za malipo. Kila kipengele kina alama ya muda sahihi hadi sekunde na utambulisho wa mtumiaji aliyefanya hatua hiyo.',
      },
      {
        heading: 'Jinsi ya kutumia rekodi ya ukaguzi',
        body: 'Rekodi ya ukaguzi inapatikana kwenye sehemu ya Taarifa (Reports) kwenye AskBiz POS. Unaweza kuchuja kwa kipindi cha tarehe, aina ya tukio, mfanyakazi, au bidhaa. Matumizi ya kawaida ni pamoja na kuchunguza tofauti kwenye pesa taslimu (chuja kwa tarehe na tazama kufuta muamala, marejesho, na mabadiliko ya bei), kukagua shughuli za mfanyakazi (chuja kwa kitambulisho cha mfanyakazi kuona kila hatua aliyoifanya), na kujiandaa kwa ukaguzi wa kodi (toa rekodi kamili kwa kipindi husika). Kipengele cha utafutaji hukuruhusu kutafuta miamala mahususi kwa kiasi, jina la bidhaa, au namba ya muamala. Kwa usimamizi wa kila siku, kichujio muhimu zaidi ni "matukio yasiyo ya kawaida" — matukio yanayotoka nje ya mifumo ya kawaida, kama punguzo kubwa lisilo la kawaida, marejesho yaliyozidi kiwango fulani, au kufuta muamala wakati wa vipindi visivyosimamiwa. AskBiz inaweza kuibua matukio haya kiotomatiki, ikikuepusha kukagua miamala mia kwa mkono ili kupata yale machache yanayohitaji uangalizi.',
      },
      {
        heading: 'Rekodi ya ukaguzi na uzingatiaji wa HMRC',
        body: 'Ikiwa HMRC itafanya ukaguzi wa uzingatiaji kwenye biashara yako, watataka kuona rekodi zako za miamala. Matakwa mahususi hutegemea hali yako, lakini kwa ujumla HMRC inatarajia rekodi za kidijitali za mauzo na manunuzi yote, zenye kiasi cha VAT kilichoainishwa wazi. Rekodi ya ukaguzi ya AskBiz hutimiza matakwa haya kikamilifu. Kila muamala ni wa kidijitali, wenye alama ya muda, na maelezo ya VAT, na umeunganishwa na njia ya malipo. Marejesho na kufuta muamala vimeandikwa pamoja na sababu na idhini. Marekebisho ya hisa yameelezwa. Data inaweza kutolewa kwa mifumo ya kawaida (CSV, Excel) kwa uwasilishaji au ukaguzi. Kuwa na kiwango hiki cha nyaraka hakuridhishi tu matakwa ya uzingatiaji — huweka biashara yako katika hali nzuri. Rekodi ya ukaguzi iliyotunzwa vizuri na isiyobadilika inaonyesha kwa HMRC kuwa unachukulia utunzaji wa rekodi kwa uzito, jambo linaloweza kufanya ukaguzi kuwa mfupi na usio na msuguano.',
      },
    ],
    faq: [
      {
        q: 'Je, ninaweza kufuta vipengele kutoka kwenye rekodi ya ukaguzi?',
        a: 'Hapana. Rekodi ya ukaguzi haibadiliki kwa muundo wake. Vipengele haviwezi kuhaririwa au kufutwa, hata na wamiliki wa akaunti. Hili hulinda uadilifu wa rekodi zako.',
      },
      {
        q: 'Je, rekodi ya ukaguzi inarudi nyuma kiasi gani?',
        a: 'AskBiz huhifadhi rekodi yako kamili ya ukaguzi kwa muda wote akaunti yako inapokuwa hai. HMRC inahitaji biashara kutunza rekodi kwa angalau miaka sita, na AskBiz huzidi matakwa hayo.',
      },
    ],
  },

  'pos-30-day-export': {
    title: 'Kutoa Data ya Siku 30 za POS kwa Mhasibu Wako',
    description:
      'Unahitaji kutuma data yako ya POS kwa mhasibu wako? Mfumo wa POS wa AskBiz hukuruhusu kutoa siku 30 za data ya miamala kwa sekunde chache — hivi ndivyo unavyofanya.',
    keywords: [
      'utoaji wa data ya POS',
      'kutoa miamala ya POS',
      'data ya POS kwa mhasibu',
      'utoaji wa siku 30',
      'utoaji wa CSV wa POS',
      'utoaji wa taarifa za POS',
      'kupakua data ya mauzo ya POS',
    ],
    keyTakeaways: [
      'Mfumo wa POS wa AskBiz hukuruhusu kutoa hadi siku 30 za data ya miamala katika muundo wa CSV au Excel kwa mibofyo michache.',
      'Utoaji huo hujumuisha kila mauzo, marejesho, na kufuta muamala pamoja na uchambuzi kamili wa VAT — kila kitu mhasibu wako anachohitaji.',
      'Kutoa data mara kwa mara hufanya uwekaji vitabu, taarifa za VAT, na hesabu za mwisho wa mwaka kuwa rahisi zaidi.',
    ],
    content: [
      {
        heading: 'Kwa nini utoaji wa mara kwa mara ni muhimu',
        body: 'Hata na mfumo wa POS ulioandaliwa vizuri kabisa, mhasibu wako anahitaji data ghafi. Wanapatanisha miamala yako ya POS dhidi ya taarifa za benki, wanaandaa taarifa zako za VAT, na kuandaa hesabu zako za mwisho wa mwaka. Kadri unavyowarahisishia kupata data safi na ya kina ya miamala, ndivyo muda wanaotumia unavyopungua (na kiasi wanachokutoza kinapungua). Wafanyabiashara wengi wadogo bado hukabidhi mhasibu wao mfuko wa risiti za karatasi na muhtasari uliyoandikwa kwa mkono mwishoni mwa kila robo mwaka. Hili husababisha masaa ya uingizaji wa data kwa mkono, makosa yasiyoepukika, na bili kubwa zaidi. Kwa AskBiz POS, unaweza kutoa data kamili inayohusisha kila muamala — ikiwa na tarehe, viasi, uchambuzi wa VAT, njia za malipo, na maelezo ya marejesho — kwa chini ya dakika moja. Mhasibu wako anapata anachohitaji, unaokoa pesa, na namba zinakuwa sahihi.',
      },
      {
        heading: 'Kinachojumuishwa kwenye utoaji',
        body: 'Utoaji wa data wa AskBiz POS unajumuisha kila muamala uliyochakatwa ndani ya kipindi cha tarehe ulichochagua. Kwa kila mauzo, utoaji hurekodi tarehe na wakati, namba ya muamala, vitu vilivyouzwa (pamoja na bei na idadi ya kila kimoja), punguzo lililotumika, kiwango na kiasi cha VAT kwa kila kitu, jumla ya kiasi halisi, jumla ya VAT, jumla kamili, njia ya malipo, na mfanyakazi aliyechakata mauzo. Marejesho na kufuta muamala vimeorodheshwa kando pamoja na rejea kwa miamala ya asili, jambo linalorahisisha mhasibu wako kupatanisha. Utoaji pia hujumuisha karatasi ya muhtasari yenye jumla: jumla ya mapato (halisi na kamili), jumla ya VAT iliyokusanywa, jumla ya marejesho, jumla ya punguzo, na idadi ya miamala kwa njia ya malipo. Muhtasari huu mara nyingi ndiyo yote mhasibu wako anayohitaji kwa uwekaji vitabu wa kawaida; maelezo ya mstari kwa mstari yapo kwa upatanishi wa kina zaidi au ikiwa HMRC itauliza maswali.',
      },
      {
        heading: 'Jinsi ya kufanya utoaji',
        body: 'Kwenye AskBiz POS, nenda kwenye Taarifa (Reports), kisha gusa Toa Data (Export Data). Chagua kipindi chako cha tarehe — unaweza kuchagua kipindi chochote hadi siku thelathini. Kwa biashara nyingi, utoaji wa kila mwezi (unaojumuisha mwezi wa kalenda) hufanya vizuri. Chagua muundo wako: CSV ndiyo inayoendana kwa upana zaidi na inaweza kufunguliwa kwenye Excel, Google Sheets, au kuingizwa kwenye programu ya uhasibu. Muundo wa Excel hujumuisha uumbizaji na karatasi ya muhtasari. Gusa Toa (Export) na faili huzalishwa ndani ya sekunde. Unaweza kuipakua moja kwa moja kwenye kifaa chako, kuituma kwa barua pepe kwako, au kuishiriki na mhasibu wako kupitia njia yoyote unayoitumia kwa kawaida. Ikiwa mhasibu wako anapendelea muundo au mpangilio tofauti, CSV ina unyumbufu wa kutosha kubadilishwa kwenye zana yoyote ya spredishiti. Watumiaji wengine wa AskBiz huweka kikumbusho cha kila mwezi cha kutoa data yao tarehe ya kwanza ya kila mwezi, ikijumuisha mwezi uliopita wa biashara.',
      },
      {
        heading: 'Vidokezo vya kukabidhi vizuri kwa mhasibu wako',
        body: 'Mazoea machache rahisi hufanya mchakato wa utoaji wa data kuwa wa manufaa zaidi. Kwanza, kuwa thabiti na ratiba yako ya utoaji. Utoaji wa kila mwezi unaolingana na vipindi vyako vya VAT huweka kila kitu sawa. Pili, weka lebo wazi kwenye faili zako — "AskBiz-POS-Januari-2026.csv" ni bora kuliko "export(3).csv". Tatu, jumuisha maelezo mafupi na kila utoaji ukitaja chochote kisicho cha kawaida: marejesho makubwa, marekebisho ya hisa yanayoathiri gharama ya bidhaa zilizouzwa, au mabadiliko ya viwango vya VAT. Nne, ikiwa mhasibu wako anatumia programu mahususi (Xero, QuickBooks, FreeAgent), muulize muundo gani wa kuingiza anaupendelea — AskBiz huenda tayari inatoa data kwa mpangilio unaoendana. Mwisho, tunza nakala ya ndani ya kila utoaji. Ijapokuwa AskBiz huhifadhi data yako kwa usalama kwenye wingu, kuwa na nakala ya ndani kwenye hifadhi yako mwenyewe hukupa kinga ya ziada na inamaanisha unaweza kutuma tena data wakati wowote inapohitajika.',
      },
    ],
    faq: [
      {
        q: 'Je, ninaweza kutoa zaidi ya siku 30 kwa wakati mmoja?',
        a: 'Utoaji wa kawaida unahusisha hadi siku 30. Kwa vipindi virefu zaidi, fanya utoaji mara kadhaa au wasiliana na huduma kwa wateja kwa uchambuzi maalum wa data.',
      },
      {
        q: 'Je, utoaji unaendana na Xero na QuickBooks?',
        a: 'Utoaji wa CSV unaweza kuingizwa kwenye programu nyingi za uhasibu, ikiwa ni pamoja na Xero na QuickBooks. Angalia mwongozo wa kuingiza wa programu yako kwa matakwa yoyote mahususi ya muundo.',
      },
    ],
  },

  'pos-multi-staff-performance': {
    title: 'Vipimo vya Utendaji wa Wafanyakazi: Mauzo kwa Keshia, Mapato kwa Jukumu',
    description:
      'Fuatilia wafanyakazi wanaouza zaidi, wanaozalisha mapato mengi zaidi, na wanaofanya makosa machache zaidi — yote kutoka kwenye dashibodi yako ya AskBiz POS.',
    keywords: [
      'utendaji wa wafanyakazi wa POS',
      'mauzo kwa keshia',
      'mapato kwa mfanyakazi',
      'vipimo vya wafanyakazi wa POS',
      'utendaji wa mfanyakazi rejareja',
      'ufuatiliaji wa utendaji wa keshia',
      'KPI za wafanyakazi rejareja',
    ],
    keyTakeaways: [
      'AskBiz POS huhusisha kila muamala na mfanyakazi aliyeuchakata, ikiruhusu ufuatiliaji wa utendaji wa mtu mmoja mmoja.',
      'Vipimo muhimu ni pamoja na miamala kwa saa, wastani wa thamani ya muamala, kiwango cha marejesho, na jumla ya mapato kwa kila mfanyakazi.',
      'Data ya utendaji wa wafanyakazi hukusaidia kupanga ratiba za zamu, kutambua mahitaji ya mafunzo, na kuwatuza wafanyakazi bora.',
    ],
    content: [
      {
        heading: 'Kwa nini kufuatilia utendaji wa wafanyakazi ni muhimu',
        body: 'Katika biashara ya mtu mmoja, unajua vizuri jinsi unavyofanya. Mara unapoongeza wafanyakazi, uwazi hupungua. Unajua namba za jumla za duka, lakini si nani anachangia nini. Bila data ya utendaji ya mtu mmoja mmoja, huwezi kujibu maswali muhimu: Je, mfanyakazi mpya ameshakuwa na uzoefu wa kutosha? Je, keshia mmoja huuza zaidi kila mara kuliko mwingine — na ikiwa ndivyo, wanafanya nini tofauti? Je, viwango vya marejesho ni vya juu zaidi kwenye zamu fulani? Mfumo wa POS wa AskBiz hujibu maswali haya yote kwa kuhusisha kila muamala na mfanyakazi aliyeuchakata. Kwa muda, hili hujenga picha ya kina ya mchango wa kila mtu. Data hii siyo kuhusu ufuatiliaji wa siri — ni kuhusu kuelewa timu yako, kutambua uwezo wa kuiga, kutambua mapungufu ya kushughulikia, na kufanya maamuzi sahihi kuhusu ratiba, mafunzo, na tuzo.',
      },
      {
        heading: 'Vipimo muhimu AskBiz inavyofuatilia kwa kila mfanyakazi',
        body: 'AskBiz POS hurekodi vipimo kadhaa vya utendaji kwa kila mfanyakazi. Jumla ya mapato ndiyo rahisi zaidi — mtu huyu alipiga kiasi gani kwenye mashine? Lakini si mara zote ndiyo ya kufichua zaidi. Miamala kwa saa hupima kasi ya kazi — keshia anayechakata miamala thelathini kwa saa anafuta foleni haraka zaidi kuliko anayechakata kumi na tano. Wastani wa thamani ya muamala (ATV) huonyesha nani anayeuza vikapu vyenye thamani ya juu, jambo linaloweza kuashiria uuzaji wa ziada uliofanikiwa. Kiwango cha marejesho kwa kila mfanyakazi huangazia matatizo yanayoweza kuwa ya mafunzo au, mara chache, udanganyifu. Kiwango cha punguzo kwa kila mfanyakazi huonyesha nani anayetumia punguzo na mara ngapi. Idadi ya vitu kwa muamala hufichua ukubwa wa kikapu. AskBiz huonyesha vipimo hivi kwenye dashibodi safi, ikilinganisha wafanyakazi bega kwa bega kwa kipindi chochote cha tarehe unachochagua. Unaweza kuona data kwa siku, wiki, au mwezi.',
      },
      {
        heading: 'Kutumia data ya utendaji kwa njia yenye manufaa',
        body: 'Watumiaji wa AskBiz waliofanikiwa zaidi hutumia data ya utendaji wa wafanyakazi kama zana ya kuwaelekeza, si fimbo. Ikiwa ATV ya keshia mmoja ni ya juu kwa asilimia 30 kuliko wastani kila mara, chunguza data ili kuelewa kwa nini. Je, wanapendekeza bidhaa zinazoendana? Je, wanawasalimia wateja kwa njia inayowahamasisha kutazama zaidi? Shiriki tabia hizo na timu. Ikiwa kiwango cha marejesho cha keshia ni cha juu isivyo kawaida, fanya mazungumzo ya kusaidia kabla ya kudhania jambo baya — huenda wanashughulikia marejesho kutoka kwa wafanyakazi wengine wa zamu, au huenda kuna tatizo la ubora wa bidhaa kwenye vitu wanavyouza zaidi. Kwa maamuzi ya ratiba, data ya utendaji ni ya thamani kubwa. Panga wauzaji wako wenye nguvu zaidi wakati wa saa za kilele. Ikiwa mfanyakazi mpya ana kasi ya chini, mwoanishe na keshia mwenye uzoefu wakati wa vipindi vya shughuli nyingi badala ya kumwacha peke yake wakati wa msongamano wa Jumamosi.',
      },
      {
        heading: 'Faragha, haki, na mambo ya kisheria',
        body: 'Kufuatilia utendaji wa wafanyakazi kunaibua maswali halali kuhusu faragha na haki. Nchini UK, unahitajika kuwaeleza wafanyakazi data gani unayokusanya kuwahusu na jinsi inavyotumika. Hili linapaswa kuainishwa kwenye mkataba wako wa ajira au kitabu cha wafanyakazi. AskBiz hufuatilia vipimo vinavyohusiana na kazi wakati wa saa za kazi — haifuatilii shughuli za kibinafsi, eneo, au chochote nje ya mfumo wa POS. Kuwa wazi na timu yako kuhusu vipimo unavyokagua na kwa nini. Wafanyabiashara wengi wa rejareja hushiriki dashibodi za utendaji kwa uwazi, jambo linalozalisha utamaduni wa uwajibikaji wenye afya badala ya ufuatiliaji wa siri. Ikiwa unatumia data ya utendaji kufanya maamuzi ya ajira (kama vile kufukuza kazi au kupandisha cheo), hakikisha maamuzi hayo ni thabiti, yameandikwa, na yanategemea sampuli ya haki ya data, si siku moja mbaya. AskBiz huhifadhi data ya utendaji wa wafanyakazi kwa muda wote akaunti inapokuwa hai, lakini unaweza kuficha utambulisho wa data kwa wafanyakazi wa zamani kulingana na sera yako ya utunzaji wa data.',
      },
    ],
    faq: [
      {
        q: 'Je, wafanyakazi wanaweza kuona vipimo vyao wenyewe vya utendaji?',
        a: 'Wasimamizi na Wamiliki wanaweza kuona vipimo vya wafanyakazi wote. Makeshia wanaweza kuona idadi yao wenyewe ya miamala na mapato kwa siku, lakini si data ya kulinganisha kuhusu wafanyakazi wengine.',
      },
      {
        q: 'Je, AskBiz huwapanga wafanyakazi kwa cheo?',
        a: 'AskBiz huonyesha data bega kwa bega lakini haitengenezi upangaji rasmi wa cheo. Jinsi unavyotafsiri na kuwasilisha data ni jukumu lako kama mmiliki wa biashara.',
      },
    ],
  },

  'pos-security-best-practices': {
    title: 'Usalama wa POS: Kulinda Miamala na Data za Wateja',
    description:
      'POS yako hushughulikia pesa na data za wateja kila siku. Haya ndiyo mazoea bora ya usalama ambayo kila muuzaji mdogo anapaswa kufuata.',
    keywords: [
      'usalama wa POS',
      'ulinzi wa data rejareja',
      'kuzuia udanganyifu wa POS',
      'mfumo wa POS salama',
      'GDPR POS',
      'usalama wa malipo rejareja',
      'mazoea bora ya usalama wa POS',
    ],
    keyTakeaways: [
      'Ruhusa thabiti za wafanyakazi, kuingia kwa Magic Link, na ufikiaji unaotegemea jukumu ndiyo ulinzi wako wa kwanza wa usalama wa POS.',
      'AskBiz POS huhifadhi data kwenye miundombinu ya wingu iliyosimbwa — hakuna data nyeti inayokaa kwenye kifaa chako cha ndani.',
      'Ukaguzi wa mara kwa mara wa rekodi za ukaguzi, mifumo ya marejesho, na kumbukumbu za ufikiaji husaidia kunasa matatizo kabla hayajawa ya gharama kubwa.',
    ],
    content: [
      {
        heading: 'Nguzo tatu za usalama wa POS',
        body: 'Usalama wa POS unategemea nguzo tatu: udhibiti wa ufikiaji, ulinzi wa data, na ufuatiliaji. Udhibiti wa ufikiaji unamaanisha kuhakikisha ni watu walioidhinishwa tu wanaotumia mfumo na kila mtu anaweza kufanya tu kile jukumu lake linalohitaji. Ruhusa za AskBiz zinazotegemea jukumu (Mmiliki, Meneja, Keshia) na kuingia kwa Magic Link hushughulikia hili kwa ukamilifu. Ulinzi wa data unamaanisha kuhakikisha data za miamala, taarifa za wateja, na rekodi za kifedha zinahifadhiwa kwa usalama na kupitishwa kwa usalama. AskBiz huhifadhi data zote kwenye miundombinu ya wingu iliyosimbwa kwa kutumia itifaki za kiwango cha kimataifa — data husimbwa wakati wa kusafiri (inaposogea kati ya kifaa chako na seva) na wakati wa kutulia (inapohifadhiwa kwenye seva). Hakuna data nyeti ya miamala inayohifadhiwa kwa kudumu kwenye kifaa chako cha ndani. Ufuatiliaji unamaanisha kuangalia kinachotokea kwenye mfumo na kutambua yasiyo ya kawaida mapema. Rekodi ya ukaguzi ya AskBiz hutoa data ghafi; arifa za matukio yasiyo ya kawaida huangazia matukio yanayostahili uchunguzi.',
      },
      {
        heading: 'Kujilinda dhidi ya vitisho vya ndani',
        body: 'Ukweli usiopendeza ni kwamba udanganyifu mwingi wa POS kwenye rejareja ndogo hufanywa na wafanyakazi, si washambuliaji wa nje. Marejesho ya uongo, mikataba ya kupendelea (kutoa marafiki bidhaa bure au zenye punguzo), kunyofoa (kuchukua pesa taslimu na kufuta muamala), na wizi wa muda ndiyo aina za kawaida zaidi. AskBiz hupunguza hatari hizi kupitia mbinu kadhaa. Kuwazuia makeshia na kuwaruhusu wasimamizi na wamiliki tu kufanya marejesho na kufuta miamala huondoa njia kuu ya udanganyifu wa ngazi ya keshia. Rekodi ya ukaguzi isiyobadilika huzalisha uwajibikaji — kila hatua imerekodiwa dhidi ya mtu mahususi. Arifa za matukio yasiyo ya kawaida huangazia mifumo isiyo ya kawaida, kama ongezeko la marejesho au kiwango kisicho cha kawaida cha punguzo kwenye zamu fulani. Zana za upatanishi wa pesa taslimu hulinganisha pesa zinazotarajiwa kwenye mashine (kulingana na rekodi za POS) na kiasi kilichohesabiwa halisi, kikionyesha tofauti mara moja. Kizuia madhara chenye ufanisi zaidi, hata hivyo, ni kuwaambia tu wafanyakazi wako kwamba udhibiti huu upo. Watu wanapojua matendo yao yanafuatiliwa na kukaguliwa, wengi hawatafikiria kutenda kwa udanganyifu.',
      },
      {
        heading: 'Kulinda data za wateja na uzingatiaji wa GDPR',
        body: 'Ikiwa unakusanya data yoyote ya wateja kupitia POS yako — namba za simu kwa risiti za WhatsApp, anwani za barua pepe kwa ankara za kidijitali, au majina ya wateja kwa mipango ya uaminifu — upo chini ya GDPR. Kanuni muhimu ni: kusanya tu unachohitaji, waambie wateja unachokusanya na kwa nini, kihifadhi kwa usalama, na kifute kisipohitajika tena. AskBiz hushughulikia upande wa kiufundi wa uhifadhi salama na usimbaji. Jukumu lako ni upande wa sera: onyesha taarifa ya faragha dukani au kwenye tovuti yako, hakikisha una msingi halali wa kuchakata kila aina ya data (kwa kawaida "maslahi halali" kwa uwasilishaji wa risiti na "idhini" kwa mawasiliano ya masoko), na jibu maombi yoyote ya mteja ya kupata au kufuta data ndani ya mwezi mmoja. AskBiz hukuruhusu kutafuta na kutoa data yote inayoshikiliwa kuhusu mteja mahususi, jambo linalorahisisha kujibu Maombi ya Ufikiaji wa Somo (Subject Access Requests).',
      },
      {
        heading: 'Usalama wa kimwili kwa vifaa vya POS',
        body: 'Usalama wa programu ni nusu tu ya picha. Kifaa chako cha POS — simu, kompyuta kibao, au mashine — pia kinahitaji ulinzi wa kimwili. Ikiwa mtu ataiba kompyuta yako kibao, huenda ana ufikiaji wa mfumo wako wa POS (ikiwa bado umeingia) na data yoyote iliyohifadhiwa kwa muda kwenye kifaa. Haya ni hatua za vitendo za kupunguza hatari hii. Kwanza, washa kufuli ya kifaa — hitaji PIN, alama ya kidole, au utambuzi wa uso kufungua kifaa. Pili, sanidi muda wa kuisha wa kipindi kwenye AskBiz ili POS ijifunge kiotomatiki baada ya kipindi cha kutotumika. Tatu, ikiwa kifaa kimeibiwa, ondoa mara moja kama kifaa kilichoidhinishwa kwenye mipangilio ya AskBiz na badilisha vitambulisho vyovyote vilivyoshirikiwa. Nne, usiache kamwe vifaa vya POS bila usimamizi katika maeneo yanayoonekana na umma. Wakati wa biashara, kifaa kinapaswa kuwa ndani ya uonekano na ufikiaji wa mfanyakazi kila wakati. Baada ya saa za kazi, kihifadhi kwa usalama. Hatua hizi ni rahisi lakini zenye ufanisi — wizi mwingi wa kimwili wa POS ni wa fursa, na tahadhari za msingi huondoa fursa hiyo.',
      },
    ],
    faq: [
      {
        q: 'Je, AskBiz POS inazingatia PCI DSS?',
        a: 'AskBiz POS haichakati malipo ya kadi moja kwa moja — mashine yako ya kadi hufanya hivyo. Hii inamaanisha AskBiz yenyewe iko nje ya wigo wa PCI DSS. Hata hivyo, mazoea ya AskBiz ya kushughulikia data yanaendana na mazoea bora ya usalama kwa mfumo wowote unaorekodi taarifa za njia ya malipo.',
      },
      {
        q: 'Nifanye nini nikishuku udanganyifu wa POS na mfanyakazi?',
        a: 'Kagua rekodi ya ukaguzi kwa ushahidi, ukilenga marejesho, kufuta miamala, mabadiliko ya bei, na tofauti za pesa taslimu. Ukipata ushahidi wa udanganyifu, wasiliana na mshauri wako wa kisheria kabla ya kuchukua hatua za kinidhamu ili kuhakikisha unafuata taratibu sahihi.',
      },
    ],
  },

  'pos-pwa-mobile-setup': {
    title: 'Kusanidi AskBiz POS kwenye Simu: Mwongozo wa Usakinishaji wa PWA',
    description:
      'Mfumo wa POS wa AskBiz hufanya kazi kama Programu ya Wavuti Inayoendelea (PWA) kwenye simu au kompyuta kibao yoyote ya kisasa. Hivi ndivyo unavyoisakinisha kwa uzoefu bora.',
    keywords: [
      'usanidi wa PWA POS',
      'kusakinisha POS kwenye simu',
      'AskBiz PWA',
      'programu ya wavuti inayoendelea POS',
      'POS kwenye simu',
      'kusakinisha POS kwenye kompyuta kibao',
      'usanidi wa sehemu ya mauzo ya simu',
    ],
    keyTakeaways: [
      'AskBiz POS hufanya kazi kama Programu ya Wavuti Inayoendelea (PWA) — isakinishe kwenye skrini yako ya nyumbani kwa uzoefu wa programu asilia bila duka la programu.',
      'Usakinishaji wa PWA huchukua chini ya dakika mbili kwenye vifaa vya iOS na Android.',
      'Ukishasakinishwa, AskBiz POS hufanya kazi kwenye skrini nzima, husaidia hali ya nje ya mtandao, na huanza mara moja kutoka skrini yako ya nyumbani.',
    ],
    content: [
      {
        heading: 'Programu ya Wavuti Inayoendelea (PWA) ni nini?',
        body: 'Programu ya Wavuti Inayoendelea ni tovuti inayofanya kazi kama programu asilia. Unaposakinisha PWA kwenye skrini yako ya nyumbani, hupata alama yake mwenyewe, hufunguka kwenye hali ya skrini nzima (bila upau wa anwani wa kivinjari), hupakia haraka, na hata inaweza kufanya kazi nje ya mtandao. Huipakui kutoka App Store au Google Play — unaisakinisha moja kwa moja kutoka kwenye kivinjari. Mbinu hii ina faida kubwa kwa mfumo wa POS. Masasisho hutokea kiotomatiki — kila unapofungua programu, unapata toleo jipya zaidi bila kupakua chochote. Hakuna mchakato wa ukaguzi wa programu unaochelewesha utoaji wa vipengele vipya. Hufanya kazi kwenye kifaa chochote chenye kivinjari cha kisasa, hivyo hujafungwa kwenye mfumo wa uendeshaji mahususi. Na kwa sababu AskBiz POS ni PWA, unaweza kuwa tayari kufanya kazi kwenye kifaa kipya ndani ya dakika, jambo lenye thamani kubwa ikiwa kifaa chako kikuu kitaharibika katikati ya zamu na unahitaji mbadala wa haraka.',
      },
      {
        heading: 'Kusakinisha kwenye Android',
        body: 'Fungua Chrome (au kivinjari kingine chochote kinachotegemea Chromium) kwenye simu yako au kompyuta kibao ya Android. Nenda kwenye anwani ya AskBiz POS na uingie kwenye akaunti yako. Chrome itaonyesha bango au arifa inayopendekeza usakinishe programu — igusa na ufuate maelekezo. Ikiwa bango halionekani, gusa menyu ya nukta tatu kwenye kona ya juu kulia na uchague "Ongeza kwenye Skrini ya Nyumbani" au "Sakinisha programu". Alama ya AskBiz huonekana kwenye skrini yako ya nyumbani mara moja. Unapoigusa, POS hufunguka kwenye hali ya skrini nzima, isiyotofautiana na programu asilia. Usakinishaji huchukua nafasi kidogo sana ya hifadhi kwa sababu sehemu kubwa ya data ya programu huhifadhiwa kwenye wingu. Ukishasakinisha, AskBiz itahifadhi rasilimali muhimu kwa muda kwenye kifaa chako, ikimaanisha programu hupakia haraka hata kwenye muunganisho wa polepole na uwezo wa msingi wa kuuza unapatikana nje ya mtandao.',
      },
      {
        heading: 'Kusakinisha kwenye iOS (iPhone na iPad)',
        body: 'Fungua Safari kwenye iPhone au iPad yako — hili ni muhimu kwa sababu iOS inasaidia usakinishaji wa PWA kupitia Safari pekee, si Chrome au vivinjari vingine. Nenda kwenye anwani ya AskBiz POS na uingie. Gusa kitufe cha Kushiriki (mraba wenye mshale unaoelekea juu) chini ya skrini. Sogeza chini na ugusa "Ongeza kwenye Skrini ya Nyumbani". Ipe njia ya mkato jina (jina la kawaida "AskBiz POS" linafaa) na ugusa Ongeza. Alama huonekana kwenye skrini yako ya nyumbani. Unapoifungua, AskBiz POS hufanya kazi kwenye hali ya skrini nzima. Kumbuka kuwa PWA za iOS zina baadhi ya mipaka ikilinganishwa na za Android — arifa za kusukuma kwa arifa za hisa zinaweza kuishi tofauti, na programu inaweza wakati mwingine kuhitaji kupakia upya baada ya kipindi cha kutotumika. Haya ni mipaka ya kiwango cha iOS, si mipaka ya AskBiz, na Apple imekuwa ikiboresha msaada wa PWA kwa kila toleo la iOS.',
      },
      {
        heading: 'Kuboresha kifaa chako kwa matumizi ya POS',
        body: 'Ukishasakinisha AskBiz POS, mabadiliko machache ya kiwango cha kifaa huboresha uzoefu. Kwanza, zima kufuli-kiotomatiki au weka muda mrefu wa kusubiri — skrini ya POS inayozimika kila sekunde thelathini ni ya kukatisha tamaa wakati wa zamu ya shughuli nyingi. Weka kufuli-kiotomatiki kwa dakika tano au kumi, au izime kabisa wakati wa saa za biashara (kumbuka tu kufunga kwa mkono wakati kifaa hakisimamiwi). Pili, rekebisha mwangaza wa skrini kwa kiwango cha starehe. Skrini yenye mwangaza mwingi hupunguza betri haraka; skrini yenye mwangaza kidogo ni ngumu kusoma katika duka lenye mwangaza mzuri. Tatu, washa hali ya "Usinisumbue" wakati wa biashara ili kuzuia simu na arifa zinazoingia kuvuruga kiolesura cha POS katikati ya muamala. Nne, weka kifaa kikiwa kimeunganishwa au karibu na chaja. Uskani wa kamera hutumia betri, na zamu kamili ya kuuza inaweza kumaliza betri ya simu kufikia mchana. Kebo rahisi ya kuchaji kwenye mashine hutatua hili. Mwisho, funga programu zisizo za lazima za nyuma ili kuongeza kumbukumbu inayopatikana na kuhakikisha POS inafanya kazi kwa ulaini.',
      },
    ],
    faq: [
      {
        q: 'Je, ninaweza kutumia AskBiz POS kwenye kompyuta ya mezani?',
        a: 'Ndiyo. AskBiz POS hufanya kazi kwenye kivinjari chochote cha kisasa kwenye kompyuta ya mezani. Hata hivyo, uskani wa kamera unahitaji kamera ya wavuti. Kwa wauzaji wengi, simu au kompyuta kibao ni chaguo la vitendo zaidi.',
      },
      {
        q: 'Je, nahitaji kusasisha PWA kwa mkono?',
        a: 'Hapana. PWA hujisasisha kiotomatiki. AskBiz inapotoa toleo jipya, sasisho hutumika mara ijayo unapofungua programu. Hakuna upakuaji au usakinishaji wa mkono unaohitajika.',
      },
    ],
  },

  'pos-troubleshooting': {
    title: 'Utatuzi wa Matatizo ya POS: Kamera, Kuingia, na Usanikishaji',
    description:
      'Umekwama na kamera isiyoskani, kuingia kusikofanya kazi, au data isiyosanikishwa? Haya ni marekebisho ya haraka kwa matatizo ya kawaida zaidi ya AskBiz POS.',
    keywords: [
      'utatuzi wa matatizo ya POS',
      'skana ya bakodi haifanyi kazi',
      'matatizo ya kuingia POS',
      'matatizo ya usanikishaji wa POS',
      'kamera haiskani POS',
      'msaada wa AskBiz POS',
      'kutatua matatizo ya kawaida ya POS',
    ],
    keyTakeaways: [
      'Matatizo mengi ya AskBiz POS huanguka kwenye makundi matatu: kamera/uskani, kuingia/uthibitisho, na usanikishaji wa data.',
      'Matatizo mengi hutatuliwa kwa kutoa ruhusa za kivinjari, kusafisha akiba (cache), au kuangalia muunganisho wako wa mtandao.',
      'AskBiz hurekodi matukio na makosa ya usanikishaji, jambo linalorahisisha kuchunguza matatizo bila kubahatisha.',
    ],
    content: [
      {
        heading: 'Matatizo ya kamera na uskani',
        body: 'Ikiwa kamera haiwaki unapogusa kitufe cha kuskani, sababu ya kawaida zaidi ni ruhusa ya kivinjari isiyotolewa. Kivinjari chako kinahitaji ruhusa dhahiri ya kufikia kamera, na hii lazima itolewe kwa eneo la AskBiz mahususi. Kwenye Android, nenda kwenye Mipangilio ya Chrome, kisha Mipangilio ya Tovuti, kisha Kamera, na uhakikishe anwani ya AskBiz imeorodheshwa kama "Imeruhusiwa". Kwenye iOS, nenda kwenye Mipangilio, kisha Safari, kisha Kamera, na uweke kwenye "Ruhusu". Ikiwa kamera inawaka lakini bakodi hazitambuliki, angalia mwangaza — mwanga hafifu ndiyo sababu ya kawaida ya utambuzi wa polepole au uliofeli. Shikilia simu sentimita 15 hadi 30 kutoka kwenye bakodi na uishikilie ikiwa thabiti. Safisha lensi ya kamera ikiwa ina uchafu. Ikiwa bakodi mahususi inashindwa mara kwa mara, huenda imeharibika au imechapishwa kwa ukubwa mdogo sana — jaribu kuingiza bidhaa kwa mkono kama njia mbadala. Ikiwa uskani ulikuwa unafanya kazi hapo awali na umesimama, jaribu kufunga na kufungua tena PWA ya AskBiz, au safisha akiba ya kivinjari kwa tovuti ya AskBiz.',
      },
      {
        heading: 'Matatizo ya kuingia na uthibitisho',
        body: 'AskBiz POS hutumia kuingia kwa Magic Link, ambayo inamaanisha kiungo cha mara moja hutumwa kwa anwani yako ya barua pepe kila unapoingia. Ikiwa hupokei Magic Link, angalia folda yako ya spam au taka kwanza — watoa huduma za barua pepe wakati mwingine huainisha vibaya barua pepe za kiotomatiki. Hakikisha unaingiza anwani halisi ya barua pepe iliyotumika akaunti yako ya mfanyakazi ilipoundwa (angalia herufi kubwa na makosa ya kuandika). Ikiwa barua pepe bado haifiki baada ya dakika chache, muulize mmiliki wa akaunti kuthibitisha kuwa anwani yako ya barua pepe imesajiliwa kwa usahihi kwenye mfumo. Ikiwa unapokea Magic Link lakini haifanyi kazi unapoigusa, kiungo huenda kimeisha muda — Magic Links ni za muda mfupi kwa usalama. Omba nyingine na uigusa mara moja. Pia hakikisha unafungua kiungo kwenye kivinjari kile kile unachotumia AskBiz POS; baadhi ya programu za barua pepe hufungua viungo kwenye kivinjari cha ndani ya programu kisichoshirikiana kipindi na kivinjari chako kikuu. Kwenye iOS, ikiwa Magic Link inafunguka kwenye kivinjari kisicho sahihi, nakili kiungo na ukibandike kwenye Safari kwa mkono.',
      },
      {
        heading: 'Matatizo ya usanikishaji wa data na muunganisho',
        body: 'AskBiz POS husanikisha data kwenye wingu baada ya kila muamala. Ikiwa muunganisho wako wa mtandao ukikatika, programu hubadilika kwenda hali ya nje ya mtandao na kuhifadhi miamala kwa ndani hadi muunganisho urejee. Muunganisho unaporejea, miamala inayosubiri husanikishwa kiotomatiki. Ikiwa unaona data haisanikishwi (kwa mfano, unachakata mauzo kwenye POS lakini hayaonekani kwenye taarifa zako kwenye kifaa kingine), angalia muunganisho wako wa mtandao kwanza. Fungua tovuti yoyote kuthibitisha uko mtandaoni. Ikiwa muunganisho ni mzuri lakini usanikishaji bado umechelewa, jaribu kulazimisha-usasishe PWA: kwenye vivinjari vingi, buruta chini kusasisha au funga na ufungue tena programu. Matatizo ya usanikishaji yanayoendelea ni nadra lakini yanaweza kutokea ikiwa hifadhi ya ndani ya kivinjari imejaa (jambo la kawaida kwenye vifaa vyenye hifadhi ndogo sana). Kusafisha akiba ya kivinjari kwa tovuti ya AskBiz kwa kawaida hutatua hili — data yako iko salama kwenye wingu, hivyo kusafisha akiba ya ndani hakupotezi chochote.',
      },
      {
        heading: 'Wakati wa kuwasiliana na huduma kwa wateja',
        body: 'Matatizo mengi ya AskBiz POS hutatuliwa kwa hatua zilizo hapo juu, lakini baadhi ya hali huhitaji kuwasiliana na huduma kwa wateja. Ukiona namba au ujumbe mahususi wa kosa, andika chini na uujumuishe kwenye ombi lako la msaada — hili huharakisha uchunguzi kwa kiasi kikubwa. Ikiwa miamala haipo (si tu imechelewa kusanikishwa), wasiliana na huduma kwa wateja mara moja pamoja na muda wa takribani na kifaa kilichotumika. Ikiwa mfanyakazi hawezi kuondolewa au mabadiliko ya jukumu hayafanyi kazi, hili linaweza kuashiria mgongano wa ruhusa unaohitaji uchunguzi wa ndani. Ikiwa utendaji unashuka kwa muda (programu inakuwa polepole au isiyoitikia), hili linaweza kuashiria tatizo la kiwango cha kifaa au tatizo la kiasi cha data ambalo huduma kwa wateja inaweza kusaidia kuchunguza. Huduma kwa wateja ya AskBiz inapatikana kupitia mazungumzo ndani ya programu, barua pepe, na kituo cha msaada. Unapotoa taarifa ya tatizo, jumuisha aina ya kifaa chako, jina na toleo la kivinjari, na maelezo ya hatua zilizosababisha tatizo. Picha za skrini au rekodi za skrini husaidia sana kwa matatizo ya kuonekana.',
      },
    ],
    faq: [
      {
        q: 'Je, nitapoteza miamala ikiwa betri ya simu yangu itakwisha katikati ya mauzo?',
        a: 'Ikiwa mauzo yalikuwa yamethibitishwa kabla ya kifaa kuzima, huhifadhiwa kwa ndani na kusanikishwa kifaa kitakapochajiwa na kuunganishwa tena. Ikiwa mauzo hayakuwa yamethibitishwa bado, utahitaji kuyaingiza upya.',
      },
      {
        q: 'Ninaweza vipi kusafisha akiba ya AskBiz bila kupoteza data?',
        a: 'Data yako imehifadhiwa kwenye wingu, si kwenye akiba ya kivinjari. Kusafisha akiba huondoa faili za muda zinazosaidia programu kupakia haraka lakini hakufuti data yoyote ya miamala, bidhaa, au mipangilio.',
      },
      {
        q: 'POS inafanya kazi kwa polepole — nifanye nini?',
        a: 'Funga programu za nyuma ili kuachia kumbukumbu, hakikisha kifaa chako kina angalau MB 500 za hifadhi bila kutumika, na uwashe upya kivinjari. Ikiwa tatizo linaendelea, jaribu kuwasha upya kifaa chenyewe.',
      },
    ],
  },

  'pos-data-in-dashboards': {
    title: 'Jinsi Data ya POS Inavyoendesha Dashibodi Yako ya AskBiz',
    description:
      'Miamala yako ya POS haikai tu kwenye hifadhidata — inalisha dashibodi za wakati halisi, chati za mapato, na mionekano ya utendaji wa bidhaa ndani ya AskBiz.',
    keywords: [
      'dashibodi ya POS',
      'uchambuzi wa sehemu ya mauzo',
      'dashibodi ya taarifa za pos',
      'dashibodi ya rejareja',
      'uonyeshaji wa data ya pos',
      'dashibodi ya askbiz pos',
    ],
    keyTakeaways: [
      'Kila muamala wa POS huonekana kiotomatiki kwenye dashibodi yako ya AskBiz ndani ya sekunde.',
      'Vipengele vya dashibodi vinaweza kuonyesha mapato, vitengo vilivyouzwa, wastani wa ukubwa wa kikapu, na bidhaa bora zaidi — vyote kutoka data ya POS.',
      'Kuunganisha data ya POS na mauzo ya mtandaoni hukupa mtazamo wa kweli wa njia nyingi (omnichannel) wa biashara yako.',
    ],
    content: [
      {
        heading: 'Kutoka mashine hadi dashibodi kwa wakati halisi',
        body: 'Kila mauzo yaliyochakatwa kupitia AskBiz POS hurekodiwa kwenye hifadhi yako kuu ya data mara moja. Ndani ya sekunde, muamala huo husasisha dashibodi yako: jumla ya mapato huongezeka, orodha ya bidhaa bora hupangwa upya, na kihesabu cha mauzo ya kila siku huongezeka. Hakuna uingizaji wa kundi, hakuna usanikishaji wa usiku kucha, na hakuna utoaji wa mkono. Hii ndiyo tofauti ya msingi kati ya mashine huru na POS iliyounganishwa — safu yako ya akili huona kila muamala mara tu unapotokea. Kwa mmiliki wa duka, hii inamaanisha unaweza kuangalia simu yako wakati wa mchana na kujua asubuhi ilikwendaje, bidhaa gani zilizosonga, na kama uko kwenye mstari wa kufikia lengo lako la siku.',
      },
      {
        heading: 'Vipengele muhimu vya POS kwa dashibodi yako',
        body: 'AskBiz hufanya vipengele kadhaa mahususi vya POS kupatikana kiotomatiki wakati moduli hiyo ikiwa hai. **Mapato ya Leo** huonyesha jumla inayoendelea pamoja na kulinganisha na siku ile ile wiki iliyopita. **Vitengo Vilivyouzwa** hufuatilia kiasi kando na thamani — cha manufaa kwa kutambua kama ongezeko la mapato linatokana na kuuza vitu vingi zaidi au vitu ghali zaidi. **Wastani wa Ukubwa wa Kikapu** huhesabu wastani wa thamani ya muamala kwenye mauzo yote ya leo. **Bidhaa Bora** hupanga wauzaji wako bora kwa mapato au kiasi kwa kipindi chochote unachochagua. **Mauzo kwa Mfanyakazi** huonyesha makeshia gani wanaochakata miamala mingi zaidi — cha manufaa kwa upangaji wa zamu na ukaguzi wa utendaji. Unaweza kubandika kipengele chochote kati ya hivi kwenye dashibodi yako ya nyumbani ya kawaida ili ipakie kwanza kila asubuhi.',
      },
      {
        heading: 'Kuunganisha POS na mauzo ya mtandaoni',
        body: 'Ikiwa pia unauza kupitia Shopify, Amazon, Etsy, au jukwaa lingine lililounganishwa, AskBiz huchanganya data yako ya POS na data ya mtandaoni kuwa mtazamo mmoja. Hapa ndipo akili halisi inapoibuka. Unaweza kuona kwamba bidhaa fulani inauzwa vizuri mtandaoni lakini hairuki mno dukani, au kwamba mapato ya siku za wiki dukani yanashinda ya wikendi wakati kinyume chake ni kweli mtandaoni. Kipengele cha **Mapato ya Njia Nyingi** huonyesha njia zote bega kwa bega. Mwonekano wa **Utendaji wa Bidhaa** hukuruhusu kulinganisha SKU ile ile kwenye njia mbalimbali. Uonekano huu wa njia nyingi ni kitu ambacho kwa kawaida hugharimu maelfu ya paundi kwa wachuuzi wakubwa kwa uchambuzi maalum — AskBiz hukupatia kiotomatiki kwa sababu POS imejengwa ndani badala ya kuunganishwa baadaye.',
      },
      {
        heading: 'Kusanidi dashibodi yako ya POS',
        body: 'Nenda kwenye **Dashibodi → Unda Dashibodi** na uchague kigezo cha POS, au tengeneza moja kutoka mwanzo kwa kuongeza vipengele kutoka kwenye kategoria ya POS. Vipangilie kwa mpangilio unaolingana na ukaguzi wako wa kila siku — wamiliki wengi huweka mapato na vitengo vilivyouzwa juu kushoto, utendaji wa bidhaa chini yake, na vipimo vya wafanyakazi upande wa kulia. Ihifadhi kama mwonekano wako wa kawaida ili ipakie kiotomatiki unapofungua AskBiz. Ukishiriki dashibodi na meneja wa duka, wataona data ile ile ya wakati halisi bila kuhitaji ufikiaji wa usimamizi kamili wa AskBiz. Kushiriki dashibodi huheshimu ruhusa za jukumu, hivyo meneja huona data ya mauzo lakini si malipo au mipangilio ya akaunti.',
      },
    ],
    faq: [
      {
        q: 'Data ya POS huonekana haraka kiasi gani kwenye dashibodi yangu?',
        a: 'Ndani ya sekunde. AskBiz POS huandika miamala moja kwa moja kwenye hifadhi yako kuu ya data, na dashibodi huchota kutoka chanzo kile kile kwa wakati halisi.',
      },
      {
        q: 'Je, ninaweza kuona mauzo ya POS na ya mtandaoni kwenye chati ile ile?',
        a: 'Ndiyo. Kipengele cha Mapato ya Njia Nyingi huchanganya njia zote zilizounganishwa — ikiwa ni pamoja na POS — kwenye mwonekano mmoja, ulioainishwa kwa chanzo.',
      },
    ],
  },

  'pos-ai-chat-questions': {
    title: 'Muulize AskBiz Kuhusu Data Yako ya POS: Maswali 25 Yanayofungua Ufahamu wa Rejareja',
    description:
      'AI ya AskBiz inaweza kujibu maswali kuhusu miamala yako ya POS kwa lugha ya kawaida. Haya ni maswali 25 ambayo kila mmiliki wa duka anapaswa kuwa akiuliza.',
    keywords: [
      'muulize askbiz pos',
      'maswali ya ai ya pos',
      'uchambuzi wa ai wa rejareja',
      'hoja ya lugha ya kawaida ya pos',
      'mazungumzo ya ai ya askbiz rejareja',
      'ufahamu wa ai wa sehemu ya mauzo',
    ],
    keyTakeaways: [
      'AI ya AskBiz inaelewa data yako ya POS — uliza tu maswali kwa lugha ya kawaida.',
      'Maswali kuhusu mielekeo ya mapato, utendaji wa bidhaa, na vipimo vya wafanyakazi vyote hufanya kazi bila usanidi wa ziada.',
      'Kuunganisha maswali ya POS na maswali ya data ya mtandaoni hukupa ufahamu ambao hakuna mfumo mmoja unaoweza kutoa peke yake.',
    ],
    content: [
      {
        heading: 'Jinsi AI inavyoelewa data yako ya POS',
        body: 'Unapoandika swali kwenye AskBiz, AI huangalia vyanzo vyako vyote vilivyounganishwa vya data — ikiwa ni pamoja na kila muamala uliochakatwa kupitia POS. Inaelewa majina ya bidhaa, bei, wafanyakazi, njia za malipo, sababu za marejesho, na vipindi vya muda. Huhitaji kuandika hoja au kuchagua vichujio. Uliza tu kwa lugha ya kawaida: "Ni bidhaa gani iliyouzwa zaidi Jumanne iliyopita?" au "Ni keshia gani aliyechakata marejesho mengi zaidi mwezi huu?" AI hubadilisha swali lako kuwa hoja ya data, huiendesha dhidi ya historia yako ya miamala, na kurudisha jibu kwenye sentensi au chati — chochote kinachosaidia zaidi. Hii ndiyo injini ile ile ya AI inayoendesha sehemu nyingine ya AskBiz, sasa ikiwa na uwezo kamili wa kuona data yako halisi ya rejareja.',
      },
      {
        heading: 'Maswali ya mapato na mauzo',
        body: 'Anza na msingi. **"Mapato yangu ya jumla ya POS wiki hii yalikuwa kiasi gani?"** hukupa namba kuu. **"Wiki hii inalinganishwaje na wiki ile ile mwezi uliopita?"** huongeza muktadha. **"Wastani wangu wa ukubwa wa kikapu ni kiasi gani?"** hukuambia kama wateja wananunua vitu vingi zaidi au vitu ghali zaidi tu. **"Ni siku gani ya wiki yenye mapato ya juu zaidi ya POS?"** husaidia maamuzi ya wafanyakazi. **"Ni asilimia ngapi ya mapato yangu inayotoka kwenye pesa taslimu dhidi ya kadi?"** huongoza mkakati wako wa uchakataji wa malipo. **"Nionyeshe mapato ya kila siku ya POS kwa siku 30 zilizopita kama chati"** hukupa mwelekeo wa kuona. Kila swali kati ya haya huchukua sekunde chache kujibiwa na lingehitaji kazi ya mkono ya spredishiti bila AI.',
      },
      {
        heading: 'Maswali ya bidhaa na hisa',
        body: 'Ufahamu wa bidhaa ndipo data ya POS inang\'aa zaidi. **"Ni bidhaa zangu 10 bora kwa vitengo vilivyouzwa mwezi huu?"** hutambua wauzaji wako bora. **"Ni bidhaa gani zenye kiwango cha juu zaidi cha marejesho?"** huashiria matatizo ya ubora au ukubwa. **"Ni bidhaa gani ambazo hazijauzwa katika siku 30 zilizopita?"** huangazia hisa iliyokwama. **"Faida wastani ya kila kategoria ya bidhaa ni kiasi gani?"** huonyesha unapopata faida halisi dhidi ya unapohamisha tu kiasi. **"Ni bidhaa zipi zinazonunuliwa mara kwa mara pamoja?"** hufichua fursa za mauzo ya ziada ambazo huenda unazikosa. **"Tabiri ni bidhaa zipi zitakwisha kwenye hisa katika siku 7 zijazo kulingana na kasi ya sasa ya mauzo"** hubadilisha data yako ya POS kuwa zana ya kupanga ya mbeleni.',
      },
      {
        heading: 'Maswali ya wafanyakazi na uendeshaji',
        body: 'Data yako ya POS ina hazina ya ufahamu wa uendeshaji. **"Ni mfanyakazi gani mwenye thamani ya juu zaidi ya wastani ya kikapu?"** hutambua wauzaji wako bora wa ziada. **"Muda wastani wa muamala kwa kila keshia ni upi?"** huangazia fursa za mafunzo. **"Kila keshia anachakata miamala mingapi kwa saa?"** hupima kasi ya kazi. **"Nionyeshe marejesho kwa mfanyakazi mwezi huu"** husaidia kutambua mifumo inayoweza kuhitaji uangalizi. **"Ni saa zipi za kilele za biashara wiki hii?"** huboresha ratiba yako ya zamu. **"Linganisha utendaji wa wafanyakazi wa mwezi huu na mwezi uliopita"** hufuatilia maboresho kwa muda. Maswali haya hubadilisha kumbukumbu ghafi za miamala kuwa akili ya usimamizi inayokusaidia kuendesha duka bora zaidi.',
      },
    ],
    faq: [
      {
        q: 'Je, ninaweza kuuliza AI kulinganisha mauzo ya POS na duka langu la mtandaoni?',
        a: 'Ndiyo. Jaribu: "Linganisha mapato yangu ya dukani na mapato ya Shopify mwezi huu." AI huchota kutoka vyanzo vyote viwili na kutoa mlinganisho bega kwa bega.',
      },
      {
        q: 'Nifanye nini AI ikitoa jibu lisilo sahihi kuhusu data yangu ya POS?',
        a: 'Angalia kama kipindi cha muda na majina ya bidhaa kwenye jibu yanaendana na swali lako. Ikiwa data inaonekana si sahihi, thibitisha kuwa miamala yote ya POS imesanikishwa kwa kuangalia kumbukumbu ya muamala. Unaweza kuripoti majibu yasiyo sahihi kwa kutumia kitufe cha kidole gumba chini.',
      },
    ],
  },

  'pos-daily-brief-integration': {
    title: 'Jinsi Data ya POS Inavyoonekana kwenye Muhtasari Wako wa Kila Siku',
    description:
      'Muhtasari wako wa Kila Siku wa AskBiz hujumuisha kiotomatiki ufahamu wa POS — mapato ya jana, bidhaa bora, arifa za hisa, na matukio yasiyo ya kawaida kutoka duka lako halisi.',
    keywords: [
      'muhtasari wa kila siku wa pos',
      'muhtasari wa kila siku wa rejareja',
      'ripoti ya asubuhi ya pos',
      'muhtasari wa kila siku wa askbiz pos',
      'ripoti ya kiotomatiki ya pos',
      'ufahamu wa kila siku wa rejareja',
    ],
    keyTakeaways: [
      'Muhtasari wa Kila Siku hujumuisha kiotomatiki data ya POS wakati moduli hiyo ikiwa hai — hakuna usanidi unaohitajika.',
      'Huangazia mapato ya jana, bidhaa bora, arifa za hisa, na mifumo yoyote isiyo ya kawaida.',
      'Kulinganisha Muhtasari wako wa Kila Siku kwa siku mbalimbali hufichua mielekeo ambayo kumbukumbu za muamala mmoja mmoja haziwezi kuonyesha.',
    ],
    content: [
      {
        heading: 'Kinachojumuishwa kwenye Muhtasari wa Kila Siku kutoka POS yako',
        body: 'Unapokuwa na AskBiz POS imewashwa, Muhtasari wako wa Kila Siku wa asubuhi huongeza kiotomatiki sehemu ya rejareja. Hii inajumuisha jumla ya mapato ya jana ya POS na jinsi yanavyolinganishwa na siku ile ile wiki iliyopita, bidhaa tatu bora kwa vitengo vilivyouzwa, bidhaa zozote zilizoibua arifa za hisa ndogo au kuisha kwa hisa usiku kucha, na orodha ya wafanyakazi bora inayoonyesha miamala na mapato kwa kila keshia. Ikiwa pia una njia za mtandaoni zilizounganishwa, Muhtasari huonyesha mgawanyo wa njia ili uweze kuona utendaji wa dukani ulivyolinganishwa na mauzo ya kidijitali. Yote haya hufika kwenye barua pepe yako au skrini ya nyumbani ya AskBiz kabla haujafungua duka — hukupa picha kamili ya jana na mwanzo mzuri wa leo.',
      },
      {
        heading: 'Utambuzi wa yasiyo ya kawaida kwa rejareja',
        body: 'Muhtasari wa Kila Siku hauripoti namba tu — huangazia chochote kisicho cha kawaida. Ikiwa mapato ya jana yalikuwa juu au chini kwa kiasi kikubwa kuliko wastani wa hivi karibuni, Muhtasari hulitaja na kupendekeza sababu zinazowezekana (tukio la eneo hilo, mabadiliko ya bei, kutokuwepo kwa mfanyakazi). Ikiwa bidhaa inayouzwa kawaida vitengo kumi kwa siku ghafla iliuza sifuri, hilo pia huangaziwa — huenda inaashiria tatizo la maonyesho, tatizo la hisa, au kosa la uskani. Matukio haya yasiyo ya kawaida huibuliwa kiotomatiki kwa kutumia injini ile ile ya utambuzi inayofuatilia njia zako za mtandaoni. Kwa mmiliki wa duka aliye na shughuli nyingi, hii inamaanisha huhitaji kulinganisha spredishiti kwa mkono ili kutambua matatizo — Muhtasari hufanya hivyo kwa ajili yako kila asubuhi.',
      },
      {
        heading: 'Kubinafsisha Muhtasari wako wa POS',
        body: 'Muhtasari wa Kila Siku umeundwa kufanya kazi mara moja, lakini unaweza kuubadilisha. Nenda kwenye **Mipangilio → Muhtasari wa Kila Siku → Sehemu ya POS** kuchagua vipimo gani vinavyoonekana, kuweka vipindi vya kulinganisha (siku hadi siku, wiki hadi wiki, au mwezi hadi mwezi), na kuongeza au kuondoa orodha ya wafanyakazi bora. Ikiwa unaendesha maeneo mengi, unaweza kupokea Muhtasari tofauti kwa kila eneo au mwonekano wa pamoja. Unaweza pia kuweka muda wa kuwasilisha — wamiliki wengi wa maduka wanapendelea kuupokea dakika 30 kabla ya kufungua, ili wawe na muda wa kuukagua wakiwa na kahawa kabla mteja wa kwanza hajafika.',
      },
      {
        heading: 'Kutenda kulingana na Muhtasari wako',
        body: 'Muhtasari wa Kila Siku bora zaidi ni ule unaoongoza kwenye hatua. Ikiwa mapato yalishuka jana, muulize AI kwa nini: "Kwa nini mapato ya POS yalikuwa chini kuliko kawaida jana?" Ikiwa bidhaa inaisha, iongeze kabla ya duka kufunguliwa. Ikiwa keshia mmoja anaendelea kufanya vizuri zaidi kuliko wengine kwenye thamani ya kikapu, elewa wanachofanya tofauti na ushirikishe timu. Muhtasari si ripoti ya kuhifadhi — ni kichocheo cha maamuzi. Kwa muda wa wiki na miezi, kukagua Muhtasari wako kila siku hujenga uelewa wa asili wa mienendo ya biashara yako ambao hakuna kiasi cha taarifa za mara kwa mara zinazoweza kubadilisha.',
      },
    ],
    faq: [
      {
        q: 'Je, nahitaji kusanidi kitu chochote ili data ya POS ionekane kwenye Muhtasari wangu?',
        a: 'Hapana. POS ikishawashwa, Muhtasari wa Kila Siku hujumuisha kiotomatiki data ya rejareja kuanzia asubuhi ijayo. Unaweza kubinafsisha vipimo vinavyoonekana kwenye Mipangilio.',
      },
      {
        q: 'Je, ninaweza kupata Muhtasari wa mchana pia?',
        a: 'Ndiyo. Nenda kwenye Mipangilio → Muhtasari wa Kila Siku → Ratiba na uongeze uwasilishaji wa pili kwa muda unaoupendelea. Baadhi ya wamiliki wa maduka huweka mmoja wa ufunguzi na mmoja baada ya msongamano wa mchana.',
      },
    ],
  },

  'pos-business-pulse-impact': {
    title: 'Jinsi Miamala ya POS Inavyoathiri Alama Yako ya Mapigo ya Biashara',
    description:
      'Alama yako ya Mapigo ya Biashara huzingatia mielekeo ya mapato ya POS, afya ya hisa, na mifumo ya miamala. Hivi ndivyo hasa jinsi inavyofanya kazi.',
    keywords: [
      'mapigo ya biashara pos',
      'alama ya afya ya pos',
      'alama ya biashara rejareja',
      'mapigo ya askbiz pos',
      'alama ya utendaji wa pos',
      'afya ya biashara rejareja',
    ],
    keyTakeaways: [
      'Mielekeo ya mapato ya POS, afya ya hisa, na viwango vya marejesho vyote huingia kwenye alama yako ya Mapigo ya Biashara.',
      'Mapato thabiti ya kila siku ya POS huboresha sehemu ya uthabiti ya alama yako.',
      'Viwango vya juu vya marejesho au matukio ya mara kwa mara ya kuisha kwa hisa vitapunguza alama yako.',
    ],
    content: [
      {
        heading: 'Alama ya Mapigo ya Biashara inapima nini',
        body: 'Mapigo ya Biashara ni alama ya pamoja kutoka 0 hadi 100 inayoakisi afya ya jumla ya biashara yako. Huchanganya vipimo vitano: afya ya mapato (mwelekeo, uthabiti, ukuaji), afya ya mtiririko wa fedha (muda wa kuendelea, madeni yanayodaiwa), afya ya wateja (uhifadhi, hatari ya kupoteza wateja), afya ya uendeshaji (marejesho, utekelezaji, uaminifu wa wasambazaji), na dalili za soko. POS ikiwashwa, data yako ya miamala ya dukani hulisha moja kwa moja vipimo vya mapato na uendeshaji. Hii inamaanisha kila mauzo unayochakata — na kila marejesho unayotoa — vina athari inayopimika kwenye alama yako ya Mapigo. Alama hiyo huhesabiwa upya kila siku kwa watumiaji wa kiwango cha bure na kwa wakati halisi kwa watumiaji wa mipango ya Growth na Business.',
      },
      {
        heading: 'Jinsi data ya POS inavyoathiri kila kipimo',
        body: '**Afya ya Mapato** ndiyo inayoathiriwa moja kwa moja zaidi. Mapigo hufuatilia mwelekeo wa mapato yako ya POS kwa vipindi vya siku 7 na siku 30 vinavyozunguka. Mapato thabiti au yanayokua huongeza alama; mapato yanayopungua huipunguza. Kutofautiana pia ni muhimu — duka linalopata £500 kila siku hupata alama ya juu kwenye uthabiti kuliko lile linalobadilika kati ya £200 na £800, hata kama wastani ni sawa. **Afya ya Uendeshaji** huzingatia kiwango chako cha marejesho (marejesho kama asilimia ya jumla ya mauzo), mara ngapi hisa inaisha, na mzunguko wa hisa. Kiwango cha juu cha marejesho huashiria matatizo ya ubora wa bidhaa au kuridhika kwa wateja. Matukio ya mara kwa mara ya kuisha kwa hisa huashiria upangaji dhaifu wa hisa. Vyote viwili hupunguza alama yako ya uendeshaji.',
      },
      {
        heading: 'Kuboresha Mapigo yako kwa data ya POS',
        body: 'Zingatia vidhibiti unavyoweza kudhibiti. Ili kuboresha uthabiti wa mapato, changanua mifumo yako ya mauzo ya kila siku na shughulikia mianya — je, Jumatatu daima ni tulivu? Fikiria matangazo ya Jumatatu. Ili kuboresha kiwango chako cha marejesho, ingiza sababu kwa undani: je, bidhaa fulani zinarejeshwa mara nyingi zaidi? Je, marejesho yamejikita kwa mfanyakazi mmoja? Ili kuboresha afya ya hisa, sanidi arifa za hisa ndogo kwenye AskBiz POS na uongeze hisa kwa mapema badala ya kujibu baada ya kuisha. Kila moja ya hatua hizi hushughulikia kipimo mahususi cha Mapigo na inapaswa kutoa maboresho yanayopimika ndani ya wiki moja hadi mbili za utekelezaji thabiti.',
      },
      {
        heading: 'Kusoma mwelekeo wa Mapigo yako kwa muda',
        body: 'Alama moja ya Mapigo ni picha ya wakati mmoja. Thamani halisi iko kwenye mwelekeo. Nenda kwenye **Akili → Mapigo ya Biashara → Mwelekeo** kuona alama yako kwa siku 90 zilizopita. Angalia sehemu za mabadiliko — nyakati ambapo alama ilibadilisha mwelekeo — na uzihusishe na kilichotokea kwenye biashara. Je, alama ilishuka bidhaa muhimu ilipoisha? Je, ilipanda ulipoongeza keshia mpya na kupunguza muda wa foleni? Uhusiano huu hubadilisha Mapigo kutoka kipimo cha starehe kuwa zana halisi ya uchunguzi. Kwa muda, utakuza hisia ya asili ya kile kinachobadilisha alama yako, na hisia hiyo itaongoza maamuzi bora ya kila siku.',
      },
    ],
    faq: [
      {
        q: 'Je, alama ya Mapigo huzingatia mapato ya POS na ya mtandaoni sawa?',
        a: 'Ndiyo. Mapato ni mapato bila kujali njia. Mapigo huchanganya vyanzo vyote vilivyounganishwa kuwa tathmini moja ya afya ya mapato, iliyopimwa kwa mgao wao wa jumla ya mapato.',
      },
      {
        q: 'Marejesho ya POS huathiri Mapigo yangu haraka kiasi gani?',
        a: 'Kwenye mipango ya Growth na Business, Mapigo husasishwa kwa wakati halisi. Kwenye kiwango cha bure, huhesabiwa upya usiku kucha. Marejesho moja kwenye biashara yenye afya nzuri yatakuwa na athari ndogo sana — alama huitikia mifumo, si miamala ya mtu mmoja.',
      },
    ],
  },

  'pos-offline-mode': {
    title: 'Hali ya Nje ya Mtandao: Kinachotokea Mtandao Wako Ukikatika Katikati ya Mauzo',
    description:
      'AskBiz POS ni PWA inayoweza kushughulikia kukatika kwa mtandao kwa muda mfupi. Hivi ndivyo kinachofanya kazi nje ya mtandao, kisichofanya kazi, na jinsi ya kurejea kwa ulaini.',
    keywords: [
      'hali ya nje ya mtandao ya pos',
      'pos bila mtandao',
      'sehemu ya mauzo nje ya mtandao',
      'pwa nje ya mtandao rejareja',
      'matatizo ya muunganisho wa pos',
      'askbiz pos nje ya mtandao',
    ],
    keyTakeaways: [
      'AskBiz POS huhifadhi orodha yako ya bidhaa kwa ndani ili uendelee kuongeza vitu kwenye kikapu wakati wa kukatika kwa muda mfupi.',
      'Miamala husubiri kwa ndani na kusanikishwa kiotomatiki muunganisho unaporejea.',
      'Kukatika kwa muda mrefu (zaidi ya dakika 30) huhitaji upatanishi wa mkono — daima rejesha muunganisho haraka iwezekanavyo.',
    ],
    content: [
      {
        heading: 'Jinsi hali ya nje ya mtandao inavyofanya kazi',
        body: 'AskBiz POS hufanya kazi kama Programu ya Wavuti Inayoendelea, ikimaanisha msimbo wa programu na orodha yako ya bidhaa huhifadhiwa kwenye kifaa baada ya kupakia mara ya kwanza. Ikiwa muunganisho wako wa mtandao ukikatika wakati wa mauzo, programu inaendelea kufanya kazi — unaweza kuendelea kuskani bidhaa, kuongeza vitu kwenye kikapu, kurekebisha idadi, na kukamilisha mchakato wa malipo. Muamala huhifadhiwa kwa ndani kwenye kifaa na kuwekwa kwenye foleni ya usanikishaji. Muunganisho unaporejea, foleni hujichakata kiotomatiki na miamala yote inayosubiri hupakiwa kwenye seva. Utaona bango dogo juu ya skrini likionyesha hali ya nje ya mtandao, na uthibitisho mwingine usanikishaji unapokamilika.',
      },
      {
        heading: 'Kinachofanya kazi na kisichofanya kazi',
        body: '**Hufanya kazi nje ya mtandao:** kutazama orodha yako ya bidhaa, kuongeza vitu kwenye kikapu, kuchakata mauzo (pesa taslimu tu — mashine za kadi zinahitaji muunganisho), kuzalisha risiti ya ndani. **Hakifanyi kazi nje ya mtandao:** uskani wa kamera kwa bidhaa mpya zisizokuwa tayari kwenye orodha yako (API ya utambuzi inahitaji muunganisho wa seva), ukaguzi wa kiwango cha hisa wa wakati halisi, kutuma risiti za WhatsApp, kuingia kwa wafanyakazi kupitia Magic Link, na usanikishaji na dashibodi. Malipo ya kadi yanahitaji muunganisho hai na mchakataji wa malipo — ukiwa nje ya mtandao, unaweza kupokea pesa taslimu pekee. Kikwazo hiki kinatoka kwenye mtandao wa kadi, siyo AskBiz.',
      },
      {
        heading: 'Kurejea kutoka kukatika kwa muda mrefu',
        body: 'Kukatika kwa muda mfupi kwa dakika chache hushughulikiwa kwa ulaini — foleni ya usanikishaji hujichakata na kila kitu hupatanika kiotomatiki. Kukatika kwa muda mrefu wa dakika 30 au zaidi huzalisha foleni ndefu zaidi ambayo inaweza kuchukua dakika kusanikishwa muunganisho unaporejea. Wakati huu, data ya dashibodi na viwango vya hisa vitakuwa vimepitwa na wakati kwa muda. Ikiwa kifaa kitapoteza umeme au kivinjari kitaharibika wakati miamala ya nje ya mtandao imo kwenye foleni, service worker ya PWA huhifadhi foleni hiyo kwenye hifadhi ya ndani. Ukifungua tena programu, itajaribu kusanikisha miamala yoyote inayosubiri. Katika hali nadra ambapo muamala umepotea, unaweza kupatanisha kwa mkono kwa kutumia risiti za karatasi au za ndani ulizotoa wakati wa kukatika.',
      },
      {
        heading: 'Mazoea bora kwa muunganisho',
        body: 'Kuzuia ni bora kuliko kurejesha. Tumia muunganisho maalum wa broadband kwa kifaa chako cha POS badala ya kutegemea Wi-Fi ya umma. Tunza hotspot ya simu ya 4G/5G kama mbadala — SIM rahisi ya £10/mwezi inaweza kukuokoa kutoka mauzo yaliyopotea wakati wa kukatika kwa broadband. Weka kifaa chako cha POS ndani ya eneo lenye Wi-Fi imara — kuta nene na rafu za chuma zinaweza kupunguza mawimbi. Ikiwa unafanya kazi kwenye masoko, matukio ya mara moja, au matukio ya nje ambako muunganisho hautegemewi, pakia mapema orodha yako kamili ya bidhaa kabla ya kuondoka na ubebe hotspot ya simu. Jaribu uwezo wako wa nje ya mtandao kabla hujauhitaji — weka kifaa chako kwenye hali ya ndege na uendeshe muamala wa mazoezi kuthibitisha kila kitu kinafanya kazi.',
      },
    ],
    faq: [
      {
        q: 'Je, nitapoteza data ya mauzo ikiwa mtandao wangu utakatika?',
        a: 'Hapana. Miamala huhifadhiwa kwa ndani kwenye kifaa na kusanikishwa muunganisho unaporejea. Data iko hatarini tu ikiwa kifaa kinapoteza umeme NA akiba ya kivinjari inasafishwa kabla ya kuunganisha tena — jambo ambalo ni nadra sana.',
      },
      {
        q: 'Je, ninaweza kuchakata malipo ya kadi nikiwa nje ya mtandao?',
        a: 'Hapana. Malipo ya kadi yanahitaji muunganisho hai na mchakataji wa malipo. Wakati wa kukatika, unaweza kupokea pesa taslimu pekee. Hiki ni kikwazo cha mitandao ya kadi, si cha AskBiz.',
      },
    ],
  },

  'multi-location-retail-management': {
    title: 'Usimamizi wa Rejareja wa Maeneo Mengi: Mwongozo Kamili',
    description:
      'Kwa nini kutenganisha hisa kwa kila tawi ni muhimu, jinsi ya kupanga uendeshaji wa maeneo mengi, na makosa ya kawaida yanayowanasa wachuuzi wanaokua.',
    keywords: [
      'rejareja ya maeneo mengi',
      'usimamizi wa maduka mengi',
      'usimamizi wa matawi',
      'upanuzi wa rejareja',
      'duka la pili',
      'rejareja ya maeneo mengi',
    ],
    keyTakeaways: [
      'Kila tawi linapaswa kutunza hisa huru ili kuzuia kuuza zaidi ya inavyopatikana na kuwezesha taarifa sahihi za kila eneo.',
      'Umiliki wa kati na uendeshaji uliogatuliwa ndiyo muundo wa kawaida — wafanyakazi hufanya kazi kwa eneo lao, mmiliki huona kila kitu.',
      'Kosa la kawaida zaidi la kufungua eneo la pili ni kutibu hisa kama hazina moja ya pamoja.',
    ],
    content: [
      {
        heading: 'Kwa nini duka moja ni rahisi na maduka mawili ni magumu',
        body: 'Kuendesha duka moja ni rahisi: seti moja ya hisa, timu moja, mashine moja ya pesa. Mara unapofungua eneo la pili, utata huongezeka mara nyingi. Hisa ambazo zilikuwa orodha moja huwa orodha mbili zinazoweza kutofautiana. Wafanyakazi waliojua kila kitu sasa wanajua tawi lao pekee. Mapato yaliyokuwa namba moja huwa namba mbili zinazohitaji kulinganishwa, kuchanganywa, na kuwekewa muktadha. Wachuuzi wanaofanikiwa kukua ni wale wanaojenga mifumo kwa utata huu kabla ya kufungua mlango wa pili.',
      },
      {
        heading: 'Kanuni ya hisa tofauti',
        body: 'Kanuni muhimu zaidi ya rejareja ya maeneo mengi ni kwamba kila tawi lazima litunze idadi yake ya hisa. Bidhaa yenye vitengo 20 kwenye hisa haimaanishi chochote ikiwa hujui kama vitengo hivyo 20 viko kwenye duka lako la mtaani au kwenye ghala lako. Hisa tofauti inamaanisha kila tawi hufuatilia viwango vyake vya hisa, huamsha arifa zake za hisa ndogo, na huonyesha upatikanaji wake wa bidhaa. Hii huzuia kosa la kawaida zaidi la maeneo mengi: mteja kwenye Tawi A kuambiwa bidhaa ipo wakati kwa kweli imo kwenye rafu ya Tawi B.',
      },
      {
        heading: 'Uonekano wa kati, uendeshaji uliogatuliwa',
        body: 'Mmiliki au meneja anahitaji kuona data iliyounganishwa kwenye matawi yote — jumla ya mapato, thamani ya hisa iliyounganishwa, faida ya jumla. Lakini keshia kwenye kila tawi anahitaji kuona bidhaa zake mwenyewe na mauzo yake mwenyewe pekee. Muundo huu wa mionekano miwili ndiyo kawaida kwenye mifumo ya kisasa ya POS. Wafanyakazi wamefungwa kwenye tawi lao kwa uwazi wa uendeshaji na usalama, wakati mmiliki ana dashibodi inayounganisha kila kitu pamoja na uwezo wa kuchimba ndani ya eneo lolote mahususi.',
      },
      {
        heading: 'Makosa ya kawaida wakati wa kupanua',
        body: 'Makosa ya mara kwa mara wachuuzi wanayoyafanya wanapofungua eneo la pili: kutibu hisa kama hazina moja ya pamoja (husababisha kuuza zaidi ya inavyopatikana), kutokuweka wafanyakazi kwa matawi mahususi (husababisha mkanganyiko wa data), kushindwa kulinganisha utendaji wa tawi (eneo moja hufanya vibaya kimya kimya), na kutokuwa na mchakato wa uhamishaji wa hisa (ziada kwenye tawi moja wakati lingine linaishiwa). Mfumo mzuri wa POS wa matawi mengi huzuia haya yote kwa kutekeleza mgawanyiko kwenye ngazi ya data.',
      },
      {
        heading: 'Wakati wa kuongeza eneo la tatu',
        body: 'Ikiwa tawi lako la pili lina faida, ni thabiti kiuendeshaji, na mifumo yako inashughulikia utata wa maeneo mawili bila mbinu za mkono, uko tayari kwa la tatu. Kuruka kutoka mawili hadi matatu ni rahisi zaidi kuliko kutoka moja hadi mawili kwa sababu tayari umeshatatua matatizo ya kimuundo. Kipimo muhimu cha kuangalia ni ikiwa faida za kila tawi zinabaki thabiti unapoongeza maeneo — ikiwa faida zinapungua kwa kila tawi jipya, unajinyoosha kupita kiasi.',
      },
    ],
    faq: [
      {
        q: 'Je, nitumie mifumo tofauti ya POS kwa kila tawi?',
        a: 'Hapana. Mfumo mmoja wa POS wenye uwezo wa matawi mengi hukupa taarifa zilizounganishwa, usimamizi rahisi wa wafanyakazi, na uwezo wa kuhamisha hisa kati ya maeneo. Mifumo tofauti huzalisha visiwa vya data.',
      },
      {
        q: 'Ni matawi mangapi biashara ndogo inaweza kusimamia kwa uhalisia?',
        a: 'Inategemea biashara, lakini biashara ndogo na za kati nyingi hupata matawi 2-5 yanaweza kusimamiwa kwa mifumo mizuri. Zaidi ya hapo, kwa kawaida unahitaji wasimamizi wa kanda au wasimamizi wa eneo ili kudumisha ubora.',
      },
    ],
  },
}
