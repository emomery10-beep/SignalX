import { AcademyArticle } from "./academy-types";

// ─────────────────────────────────────────────────────────────────────────────
// POS kwa Kiswahili — jinsi ya kutumia AskBiz POS, hatua kwa hatua.
// Original Swahili-language content (not a translation of the English corpus,
// which deliberately stays English — see sw-content-scope decision). Written
// for East African shopkeepers and market vendors: short sentences, concrete
// steps, M-Pesa-framed payments.
// ─────────────────────────────────────────────────────────────────────────────

export const ACADEMY_POS_SWAHILI_ARTICLES: AcademyArticle[] = [
  {
    slug: "pos-kuanza-na-askbiz-kiswahili",
    title: "Kuanza na AskBiz POS: Kuingia na PIN Yako",
    description: "Mwongozo wa kwanza kabisa wa AskBiz POS kwa Kiswahili — jinsi ya kuingia kwa PIN yako, kuelewa skrini ya mwanzo, na kujaribu mauzo bila hofu kwa kutumia hali ya mazoezi.",
    category: "POS kwa Kiswahili",
    categorySlug: "pos-kwa-kiswahili",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["POS", "Kiswahili", "kuingia", "PIN", "AskBiz", "duka", "mauzo", "mwanzo", "mazoezi"],
    keyTakeaways: [
      "Unaingia kwenye AskBiz POS kwa namba yako ya simu na PIN fupi — hakuna barua pepe wala nenosiri refu la kukumbuka.",
      "Kila mfanyakazi ana PIN yake mwenyewe, hivyo mauzo ya kila mtu yanahesabika kando.",
      "Tumia hali ya mazoezi (practice mode) kujifunza bila kuogopa — hakuna kitu kinachorekodiwa kwenye mauzo halisi.",
    ],
    content: [
      {
        heading: "POS ni nini, na kwa nini AskBiz?",
        body: "POS (Point of Sale) ni mahali pa kuuzia — programu inayokusaidia kurekodi kila mauzo, kufuatilia bidhaa zako, na kujua faida yako kila siku. AskBiz POS imetengenezwa kwa ajili ya wafanyabiashara wa Afrika Mashariki: inafanya kazi kwenye simu yako ya kawaida, inapokea M-Pesa moja kwa moja, na inaendelea kufanya kazi hata mtandao ukikatika. Hauhitaji kompyuta wala mashine ya bei ghali.",
      },
      {
        heading: "Kuingia kwa mara ya kwanza",
        body: "Fungua kivinjari cha simu yako (Chrome au Safari) na uende pos.askbiz.co. Weka namba yako ya simu, kisha weka PIN uliyopewa na mmiliki wa biashara. PIN ni namba fupi — kama PIN ya M-Pesa — hivyo ni rahisi kukumbuka. Ukiingia mara moja, simu yako itakumbuka: siku inayofuata unafungua tu na kuendelea. Unaweza pia kuiweka kama app: bonyeza 'Add to Home Screen' na AskBiz POS itaonekana kama app ya kawaida kwenye simu yako.",
      },
      {
        heading: "Kuelewa skrini ya mwanzo",
        body: "Ukishaingia, utaona skrini ya mwanzo yenye vitufe vikubwa: Uza (kuanza mauzo mapya), Bidhaa (kuona na kuongeza bidhaa), na Ripoti (kuona mauzo ya leo). Juu ya skrini utaona jina lako na mauzo ya leo — idadi ya mauzo na jumla ya pesa. Kila kitu kimewekwa kwa vitufe vikubwa ili uweze kubonyeza haraka hata ukiwa na haraka dukani.",
      },
      {
        heading: "Jaribu kwanza bila hofu: hali ya mazoezi",
        body: "Kama ni mara yako ya kwanza, AskBiz itakupa nafasi ya kufanya mazoezi. Hali ya mazoezi inakuonyesha bidhaa za mfano na inakuruhusu kufanya mauzo ya kujaribu — hakuna kitu kinachorekodiwa kwenye hesabu halisi za duka. Fanya mauzo mawili matatu ya mazoezi mpaka ujisikie huru, kisha bonyeza kumaliza mazoezi na uanze kazi halisi. Hii ndiyo njia bora ya kujifunza bila kuogopa kuharibu kitu.",
      },
      {
        heading: "Kwa wamiliki: kuwapa wafanyakazi PIN zao",
        body: "Kama wewe ndiye mmiliki, unaweza kumwongeza kila mfanyakazi na kumpa PIN yake mwenyewe kupitia sehemu ya Wafanyakazi kwenye dashibodi. Kila muuzaji akiingia kwa PIN yake, kila mauzo yanarekodiwa kwa jina lake — hivyo mwisho wa siku unajua nani ameuza nini, na hesabu za pesa taslimu zinakuwa wazi. Usimpe mtu PIN yako ya umiliki; yeye apewe PIN yake ya kazi.",
      },
    ],
    relatedSlugs: [
      "pos-kuongeza-bidhaa-kwa-kamera-kiswahili",
      "pos-kufanya-mauzo-kiswahili",
      "pos-kusimamia-stoo-kiswahili",
      "pos-risiti-wateja-na-mikopo-kiswahili",
      "pos-kufunga-siku-na-ripoti-kiswahili",
    ],
    faq: [
      {
        q: "Nikisahau PIN yangu nifanye nini?",
        a: "Mwambie mmiliki wa biashara — anaweza kukuwekea PIN mpya kupitia sehemu ya Wafanyakazi kwenye dashibodi yake. PIN mpya inaanza kufanya kazi mara moja.",
      },
      {
        q: "Je, ninahitaji simu ya bei ghali?",
        a: "Hapana. AskBiz POS inafanya kazi kwenye kivinjari cha simu yoyote ya Android au iPhone. Hakuna app ya kupakua wala mashine maalum ya kununua.",
      },
    ],
  },
  {
    slug: "pos-kuongeza-bidhaa-kwa-kamera-kiswahili",
    title: "Kuongeza Bidhaa kwa Kamera: Piga Picha, Maliza",
    description: "Jinsi ya kuongeza bidhaa kwenye AskBiz POS kwa kupiga picha tu — AI inapendekeza jina, wewe unaweka bei na idadi. Hakuna kuandika kwa muda mrefu.",
    category: "POS kwa Kiswahili",
    categorySlug: "pos-kwa-kiswahili",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["bidhaa", "kamera", "picha", "AI", "stoo", "kuongeza bidhaa", "POS", "Kiswahili", "AskBiz"],
    keyTakeaways: [
      "Njia ya haraka zaidi ya kuongeza bidhaa ni kuipiga picha — AI ya AskBiz inaitambua na kupendekeza jina lake.",
      "Unachohitaji kuweka mwenyewe ni bei ya kuuzia, bei ya kununulia, na idadi uliyonayo.",
      "Ukikosea, kuna kitufe cha kurudisha nyuma (undo) — hakuna kosa lisiloweza kurekebishwa.",
    ],
    content: [
      {
        heading: "Kwa nini kamera badala ya kuandika?",
        body: "Duka la kawaida lina bidhaa mia kadhaa. Kuandika kila jina kwa mkono kunachukua siku nzima na kunachosha. AskBiz inatumia kamera: unapiga picha ya bidhaa, na akili bandia (AI) inaitambua na kupendekeza jina — 'Unga wa Dola 2kg', 'Soda Coca-Cola 500ml'. Kazi yako ni kuthibitisha jina, kuweka bei, na kuweka idadi. Bidhaa moja inachukua sekunde chache tu.",
      },
      {
        heading: "Hatua kwa hatua: kuongeza bidhaa mpya",
        body: "Kwenye skrini ya mwanzo, bonyeza Bidhaa, kisha bonyeza kitufe cha kuongeza (+). Kamera itafunguka. Ishike bidhaa vizuri mbele ya kamera — mwanga wa kutosha unasaidia — kisha piga picha. Subiri sekunde moja au mbili: AI itapendekeza jina la bidhaa. Kama jina ni sahihi, liache; kama si sahihi, ligusa na ulirekebishe. Kisha weka bei ya kuuzia, bei ya kununulia (ili faida ihesabike), na idadi uliyonayo kwenye stoo. Bonyeza Hifadhi — bidhaa iko tayari kuuzwa.",
      },
      {
        heading: "Picha ya bidhaa inakusaidia baadaye",
        body: "Picha uliyopiga inabaki kwenye bidhaa. Wakati wa mauzo, muuzaji anaona picha — si maneno tu — hivyo anapata bidhaa sahihi haraka, hata kama hasomi vizuri au bidhaa zina majina yanayofanana. Hii inapunguza makosa ya kuuza bidhaa isiyo sahihi, hasa kwa wafanyakazi wapya.",
      },
      {
        heading: "Kurekebisha makosa: undo na kuhariri",
        body: "Ukiweka bei isiyo sahihi au jina lisilo sahihi, usihofu. Baada ya kuhifadhi bidhaa, unaweza kuigusa wakati wowote kwenye orodha ya Bidhaa na kuhariri jina, bei, au idadi. Na kama umehifadhi kwa bahati mbaya kabisa, kitufe cha kurudisha nyuma (undo) kinakupa nafasi ya kufuta hatua ya mwisho mara moja.",
      },
      {
        heading: "Kuhamisha bidhaa kutoka mfumo mwingine",
        body: "Kama tayari una orodha ya bidhaa kwenye mfumo mwingine wa POS au kwenye daftari, hauhitaji kuanza upya. Unaweza kuongeza bidhaa nyingi kwa kupiga picha moja baada ya nyingine — dakika kumi zinatosha kwa bidhaa hamsini. Kwa orodha kubwa zaidi, wasiliana na AskBiz kupitia sehemu ya msaada ili wakusaidie kuhamisha orodha yako yote kwa pamoja.",
      },
    ],
    relatedSlugs: [
      "pos-kuanza-na-askbiz-kiswahili",
      "pos-kufanya-mauzo-kiswahili",
      "pos-kusimamia-stoo-kiswahili",
      "pos-risiti-wateja-na-mikopo-kiswahili",
      "pos-kufunga-siku-na-ripoti-kiswahili",
    ],
    faq: [
      {
        q: "AI ikikosea jina la bidhaa je?",
        a: "Gusa jina lililopendekezwa na uliandike sahihi. AI inapendekeza tu — wewe ndiye unayeamua jina la mwisho kabla ya kuhifadhi.",
      },
      {
        q: "Je, ni lazima niweke bei ya kununulia?",
        a: "Si lazima, lakini inashauriwa sana. Bila bei ya kununulia, AskBiz haiwezi kukuhesabia faida yako halisi — utaona mauzo tu, si faida.",
      },
    ],
  },
  {
    slug: "pos-kufanya-mauzo-kiswahili",
    title: "Kufanya Mauzo: Pesa Taslimu na M-Pesa",
    description: "Jinsi ya kufanya mauzo kwenye AskBiz POS kwa Kiswahili — kuchagua bidhaa, kupokea pesa taslimu na kuhesabu chenji, na kutuma ombi la M-Pesa moja kwa moja kwa simu ya mteja.",
    category: "POS kwa Kiswahili",
    categorySlug: "pos-kwa-kiswahili",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["mauzo", "M-Pesa", "pesa taslimu", "chenji", "STK push", "kuuza", "POS", "Kiswahili", "AskBiz"],
    keyTakeaways: [
      "Mauzo yana hatua tatu tu: chagua bidhaa, chagua njia ya malipo, maliza.",
      "Kwa pesa taslimu, weka kiasi alicholipa mteja na AskBiz itakuhesabia chenji papo hapo.",
      "Kwa M-Pesa, weka namba ya simu ya mteja — ombi la malipo linamfikia moja kwa moja, anaweka PIN yake, na mauzo yanathibitishwa yenyewe.",
    ],
    content: [
      {
        heading: "Kuanza mauzo mapya",
        body: "Bonyeza Uza kwenye skrini ya mwanzo. Tafuta bidhaa kwa kuandika jina lake, au piga picha yake kwa kamera — AskBiz itaitambua. Gusa bidhaa ili kuiongeza kwenye kikapu. Mteja akinunua vitu vingi, endelea kuongeza; idadi ya kila bidhaa unaweza kuibadilisha kwa kugusa. Jumla inaonekana chini ya skrini wakati wote, kwa herufi kubwa.",
      },
      {
        heading: "Malipo ya pesa taslimu na chenji",
        body: "Bonyeza Lipa, kisha chagua Pesa Taslimu. Weka kiasi alichokupa mteja — kwa mfano, jumla ni TSh 7,500 na mteja amekupa TSh 10,000. AskBiz itakuonyesha chenji mara moja: TSh 2,500. Hakuna kuhesabu kichwani, hakuna makosa ya chenji. Bonyeza Maliza na mauzo yamerekodiwa. Kumbuka: mauzo ya pesa taslimu yanafanya kazi hata bila mtandao — yanahifadhiwa kwenye simu na kutumwa mtandao ukirudi.",
      },
      {
        heading: "Malipo ya M-Pesa: ombi linamfikia mteja moja kwa moja",
        body: "Chagua M-Pesa kama njia ya malipo, kisha weka namba ya simu ya mteja (07XX XXX XXX). Bonyeza Tuma Ombi. Mteja atapokea taarifa kwenye simu yake ikimwomba athibitishe malipo kwa PIN yake ya M-Pesa. Akiweka PIN, AskBiz inapokea uthibitisho yenyewe — skrini yako itaonyesha alama ya kijani, na utasikia sauti ya kufanikiwa. Hauhitaji kumwomba mteja akuonyeshe meseji ya M-Pesa; mfumo unathibitisha wenyewe.",
      },
      {
        heading: "Ombi la M-Pesa lisipofika au mteja akikataa",
        body: "Wakati mwingine mteja anaweka namba isiyo sahihi, au anachelewa kuweka PIN. Kama ombi halijajibiwa, skrini itaonyesha kuwa bado inasubiri; unaweza kubonyeza 'Namba si sahihi? Tuma tena' na kurekebisha namba. Ombi likikataliwa au muda ukiisha, mauzo hayajakamilika — hakuna pesa iliyorekodiwa. Unaweza kujaribu tena au kumwomba mteja alipe kwa pesa taslimu.",
      },
      {
        heading: "Punguzo na maelezo ya mauzo",
        body: "Kabla ya kumaliza mauzo, unaweza kuweka punguzo — kwa kiasi (TSh 500) au kwa asilimia (5%). Punguzo linaonekana wazi kwenye jumla na kwenye ripoti, hivyo mmiliki anajua punguzo gani limetolewa na nani. Pia unaweza kuweka namba ya simu ya mteja hata kwa mauzo ya pesa taslimu — hii inamwezesha kupokea risiti kwa WhatsApp, na inasaidia kujenga orodha ya wateja wako.",
      },
    ],
    relatedSlugs: [
      "pos-kuanza-na-askbiz-kiswahili",
      "pos-kuongeza-bidhaa-kwa-kamera-kiswahili",
      "pos-kusimamia-stoo-kiswahili",
      "pos-risiti-wateja-na-mikopo-kiswahili",
      "pos-kufunga-siku-na-ripoti-kiswahili",
    ],
    faq: [
      {
        q: "Mtandao ukikatika katikati ya siku je?",
        a: "Mauzo ya pesa taslimu yanaendelea kama kawaida — yanahifadhiwa kwenye simu yako na kutumwa yenyewe mtandao ukirudi. Malipo ya M-Pesa yanahitaji mtandao, hivyo wakati huo pokea pesa taslimu tu.",
      },
      {
        q: "Naweza kufuta mauzo niliyokosea?",
        a: "Ndiyo. Mauzo yanaweza kurudishwa (refund) au kurekebishwa na mtu mwenye ruhusa — kwa kawaida mmiliki au msimamizi. Kila marekebisho yanarekodiwa, hivyo hesabu zinabaki wazi.",
      },
    ],
  },
  {
    slug: "pos-kusimamia-stoo-kiswahili",
    title: "Kusimamia Stoo: Usiishiwe na Bidhaa Bila Kujua",
    description: "Jinsi AskBiz POS inavyofuatilia stoo yako yenyewe kila unapouza — tahadhari za bidhaa zinazokaribia kuisha, kuongeza stoo mpya, na kuagiza kwa wasambazaji.",
    category: "POS kwa Kiswahili",
    categorySlug: "pos-kwa-kiswahili",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["stoo", "bidhaa", "tahadhari", "kuagiza", "wasambazaji", "POS", "Kiswahili", "AskBiz"],
    keyTakeaways: [
      "Kila mauzo yanapunguza stoo yenyewe — hauhitaji kuhesabu tena mwenyewe.",
      "Bidhaa zinazokaribia kuisha zinaonekana kwa rangi ya njano; zilizoisha kabisa kwa nyekundu.",
      "Unaweza kutengeneza oda ya kuagiza (purchase order) na kuituma kwa msambazaji wako moja kwa moja kwa WhatsApp.",
    ],
    content: [
      {
        heading: "Stoo inayojihesabu yenyewe",
        body: "Ulipoweka idadi ya bidhaa wakati wa kuiongeza — kwa mfano, soda 24 — AskBiz inaanza kuifuatilia. Kila unapouza soda moja, idadi inapungua yenyewe: 24, 23, 22. Hauhitaji daftari la stoo wala kuhesabu kila jioni. Wakati wowote, fungua Bidhaa na uone idadi halisi iliyobaki ya kila bidhaa dukani kwako.",
      },
      {
        heading: "Tahadhari kabla ya kuishiwa",
        body: "Kwa kila bidhaa unaweza kuweka kiwango cha chini — kwa mfano, 'nionye soda zikifika 5'. Bidhaa ikifika kiwango hicho, inaonekana kwa rangi ya njano kwenye sehemu ya Tahadhari za Stoo, ikiwa na idadi iliyobaki ('5 zimebaki'). Bidhaa ikiisha kabisa inaonekana kwa nyekundu — IMEISHA — na haiwezi kuuzwa mpaka uongeze stoo. Angalia sehemu hii kila asubuhi kabla ya kufungua duka: dakika moja inakuokoa na aibu ya kumwambia mteja 'imeisha'.",
      },
      {
        heading: "Kuongeza stoo mpya ikifika",
        body: "Mzigo mpya ukifika, fungua bidhaa husika na uongeze idadi mpya kwenye stoo — kwa mfano, ulikuwa na soda 3, umepokea kreti ya 24, sasa unaweka 27. Kama bei ya kununulia imebadilika, irekebishe hapa pia ili hesabu za faida zibaki sahihi. Kila ongezeko linarekodiwa, hivyo unaweza kuona historia ya stoo ya bidhaa yoyote.",
      },
      {
        heading: "Kuagiza kwa msambazaji kwa WhatsApp",
        body: "AskBiz ina sehemu ya Oda za Kuagiza (Purchase Orders). Tengeneza oda mpya, chagua bidhaa zinazohitajika na idadi, kisha ituma kwa msambazaji wako moja kwa moja kwa WhatsApp — anapokea orodha kamili na safi. Mzigo ukifika, fungua oda ile ile na ubonyeze Pokea Mzigo: stoo ya kila bidhaa inaongezeka yenyewe kulingana na ulichopokea. Hakuna kuandika mara mbili.",
      },
      {
        heading: "Kuhesabu stoo halisi (stock take)",
        body: "Mara kwa mara — kila wiki au kila mwezi — ni vizuri kulinganisha stoo ya kwenye mfumo na bidhaa halisi zilizopo. Tofauti ndogo zinaweza kutokea kwa kuvunjika, kuibiwa, au makosa. Sehemu ya kuhesabu stoo inakuwezesha kupitia bidhaa moja baada ya nyingine na kuweka idadi halisi uliyoihesabu; mfumo unaonyesha tofauti na kurekebisha. Hesabu safi ya stoo ndiyo msingi wa ripoti za faida za kuaminika.",
      },
    ],
    relatedSlugs: [
      "pos-kuanza-na-askbiz-kiswahili",
      "pos-kuongeza-bidhaa-kwa-kamera-kiswahili",
      "pos-kufanya-mauzo-kiswahili",
      "pos-risiti-wateja-na-mikopo-kiswahili",
      "pos-kufunga-siku-na-ripoti-kiswahili",
    ],
    faq: [
      {
        q: "Nikisahau kuweka kiwango cha tahadhari je?",
        a: "Bidhaa itaendelea kuuzwa kama kawaida mpaka iishe, kisha itaonekana nyekundu kama IMEISHA. Ni bora kuweka kiwango cha tahadhari kwa bidhaa zako zinazouzwa zaidi ili upate taarifa mapema.",
      },
      {
        q: "Bidhaa inayouzwa kwa kilo au kipimo je?",
        a: "Wakati wa mauzo, weka kiasi halisi kilichouzwa — kwa mfano kilo 2.5 — na stoo itapungua kwa kiasi hicho hicho.",
      },
    ],
  },
  {
    slug: "pos-risiti-wateja-na-mikopo-kiswahili",
    title: "Risiti za WhatsApp, Wateja, na Mauzo ya Mkopo (Deni)",
    description: "Jinsi ya kumtumia mteja risiti kwa WhatsApp, kujenga orodha ya wateja wako, na kusimamia mauzo ya mkopo (deni) kwenye AskBiz POS bila daftari la madeni.",
    category: "POS kwa Kiswahili",
    categorySlug: "pos-kwa-kiswahili",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["risiti", "WhatsApp", "wateja", "mkopo", "deni", "malipo", "POS", "Kiswahili", "AskBiz"],
    keyTakeaways: [
      "Weka namba ya simu ya mteja na anapokea risiti kamili kwa WhatsApp — hakuna karatasi, hakuna printa.",
      "Kila mteja mwenye namba anajengewa historia: ananunua nini, mara ngapi, na anadaiwa kiasi gani.",
      "Mauzo ya deni yanarekodiwa kwenye mfumo — unajua nani anadaiwa nini, tangu lini, na unarekodi kila malipo ya sehemu.",
    ],
    content: [
      {
        heading: "Risiti bila printa: WhatsApp inatosha",
        body: "Printa za risiti ni gharama — mashine, karatasi, wino. AskBiz inatuma risiti kwa WhatsApp badala yake. Mwisho wa mauzo, weka namba ya simu ya mteja na ubonyeze Tuma Risiti. Mteja anapokea risiti kamili: bidhaa, bei, jumla, jina la duka lako, na muda. Risiti ya WhatsApp haipotei kama karatasi — mteja anaweza kuirudia wakati wowote, na wewe una nakala kwenye mfumo.",
      },
      {
        heading: "Orodha ya wateja inajijenga yenyewe",
        body: "Kila unapoweka namba ya mteja kwenye mauzo, mteja huyo anaingia kwenye orodha yako ya Wateja yenyewe. Baada ya muda, unajenga hazina ya thamani: wateja wako ni akina nani, wananunua nini, na wanarudi mara ngapi. Ukifungua mteja mmoja, unaona historia yake yote ya manunuzi — hii inakusaidia kujua wateja wako bora na kuwahudumia vizuri zaidi.",
      },
      {
        heading: "Mauzo ya mkopo (deni): kwaheri daftari",
        body: "Biashara nyingi za Afrika Mashariki zinauza kwa deni — mteja wa kuaminika anachukua bidhaa leo, analipa mwisho wa mwezi. Tatizo la daftari ni kuwa linapotea, linafutika, na linaleta ugomvi. Kwenye AskBiz, wakati wa malipo chagua Deni na uweke jina au namba ya mteja. Mauzo yanarekodiwa kama kawaida, lakini yanabaki kama deni linalodaiwa — kwenye akaunti ya mteja huyo, na kwenye jumla ya madeni yote unayodai.",
      },
      {
        heading: "Kupokea malipo ya deni",
        body: "Mteja akija kulipa deni — lote au sehemu — fungua akaunti yake kwenye Wateja, bonyeza Pokea Malipo, na uweke kiasi alicholipa. Deni linapungua papo hapo, na mteja anaweza kupokea uthibitisho kwa WhatsApp. Kama analipa nusu, nusu iliyobaki inaendelea kuonekana. Hakuna kubishana tena kuhusu 'nililipa wiki iliyopita' — kila malipo yana tarehe na muda.",
      },
      {
        heading: "Kusimamia madeni kwa busara",
        body: "Sehemu ya madeni inakuonyesha jumla ya pesa zote unazodai, na orodha ya wadaiwa kuanzia deni kubwa zaidi. Angalia orodha hii kila wiki: deni la muda mrefu ni pesa yako iliyokaa mfukoni mwa mtu mwingine. Weka utaratibu — kwa mfano, hakuna deni jipya kwa mteja ambaye hajalipa la zamani — na tumia historia ya kila mteja kuamua nani wa kumwamini. Mfumo unakupa ukweli; maamuzi ni yako.",
      },
    ],
    relatedSlugs: [
      "pos-kuanza-na-askbiz-kiswahili",
      "pos-kuongeza-bidhaa-kwa-kamera-kiswahili",
      "pos-kufanya-mauzo-kiswahili",
      "pos-kusimamia-stoo-kiswahili",
      "pos-kufunga-siku-na-ripoti-kiswahili",
    ],
    faq: [
      {
        q: "Mteja hana WhatsApp je?",
        a: "Mauzo yanakamilika kama kawaida — risiti ya WhatsApp ni hiari. Rekodi kamili ya mauzo inabaki kwenye mfumo wako hata kama mteja hakupokea risiti.",
      },
      {
        q: "Nani anaweza kuona madeni yote?",
        a: "Mmiliki na wasimamizi wanaona madeni yote ya duka. Muuzaji wa kawaida anaweza kurekodi mauzo ya deni, lakini usimamizi wa madeni unabaki kwa wenye ruhusa.",
      },
    ],
  },
  {
    slug: "pos-kufunga-siku-na-ripoti-kiswahili",
    title: "Kufunga Siku: Kuhesabu Pesa na Kusoma Ripoti Zako",
    description: "Jinsi ya kufunga siku kwenye AskBiz POS — kulinganisha pesa taslimu zilizopo na mauzo yaliyorekodiwa, kusoma ripoti ya siku, na kuelewa faida yako halisi.",
    category: "POS kwa Kiswahili",
    categorySlug: "pos-kwa-kiswahili",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["kufunga siku", "ripoti", "faida", "pesa taslimu", "hesabu", "mauzo ya siku", "POS", "Kiswahili", "AskBiz"],
    keyTakeaways: [
      "Mwisho wa siku, AskBiz inakuambia pesa taslimu ngapi zinapaswa kuwepo kwenye droo — wewe unahesabu na kulinganisha.",
      "Ripoti ya siku inaonyesha mauzo yote, njia za malipo, muuzaji bora, na bidhaa zilizouzwa zaidi.",
      "Faida halisi (si mauzo tu) inaonekana kila siku — kwa sababu uliweka bei za kununulia kwenye bidhaa zako.",
    ],
    content: [
      {
        heading: "Kwa nini kufunga siku ni muhimu",
        body: "Kufunga siku ni tabia inayotenganisha biashara inayojua hesabu zake na inayobahatisha. Dakika tano kila jioni zinakuambia: pesa zote zipo? Nani ameuza nini? Faida ya leo ni ngapi? Bila utaratibu huu, upotevu mdogo wa kila siku unajificha — na mwisho wa mwezi unashangaa pesa zilipoenda.",
      },
      {
        heading: "Kulinganisha pesa taslimu (till reconciliation)",
        body: "Muuzaji anapofunga zamu yake, AskBiz inaonyesha jumla ya mauzo ya pesa taslimu yaliyorekodiwa kwenye zamu hiyo — kwa mfano, TSh 145,000. Sasa hesabu pesa halisi zilizopo droo na uweke kiasi ulichokihesabu. Kama zinalingana — safi. Kama kuna tofauti, mfumo unaionyesha wazi: pungufu ya TSh 5,000, au ziada. Tofauti zinarekodiwa kwa zamu na kwa muuzaji, hivyo mtindo wowote wa upotevu unaonekana mapema, si baada ya miezi.",
      },
      {
        heading: "Kusoma ripoti ya siku",
        body: "Fungua Ripoti na uchague Leo. Utaona: jumla ya mauzo, idadi ya miamala, wastani wa kila mauzo, na mgawanyo wa njia za malipo — pesa taslimu ngapi, M-Pesa ngapi. Chini yake, bidhaa zilizouzwa zaidi na utendaji wa kila muuzaji. Linganisha na jana au wiki iliyopita kwa kubadilisha tarehe: mauzo yanapanda au yanashuka? Siku gani za wiki ni bora zaidi? Ripoti hizi ndizo macho yako ya biashara.",
      },
      {
        heading: "Faida halisi, si mauzo tu",
        body: "Mauzo makubwa hayamaanishi faida kubwa. Kwa sababu uliweka bei ya kununulia kwenye kila bidhaa, AskBiz inahesabu faida ghafi (gross profit) yenyewe: mauzo ukiondoa gharama ya bidhaa zilizouzwa. Unaona pia asilimia ya faida (margin). Bidhaa inayouzwa sana lakini kwa faida ndogo si sawa na inayouzwa kidogo kwa faida kubwa — ripoti hizi zinakusaidia kuamua bidhaa gani za kusukuma na bei gani za kurekebisha.",
      },
      {
        heading: "Utaratibu wa jioni wa dakika tano",
        body: "Jenga tabia hii kila jioni: (1) Funga zamu na ulinganishe pesa taslimu. (2) Angalia ripoti ya siku — mauzo, faida, njia za malipo. (3) Pitia tahadhari za stoo kwa ajili ya kesho. (4) Angalia madeni mapya ya leo. Dakika tano tu — lakini baada ya mwezi, utajua biashara yako kwa undani ambao wafanyabiashara wengi hawaufikii kamwe. Taarifa hizi zote zinamfikia pia mmiliki popote alipo, kwa sababu mfumo uko mtandaoni.",
      },
    ],
    relatedSlugs: [
      "pos-kuanza-na-askbiz-kiswahili",
      "pos-kuongeza-bidhaa-kwa-kamera-kiswahili",
      "pos-kufanya-mauzo-kiswahili",
      "pos-kusimamia-stoo-kiswahili",
      "pos-risiti-wateja-na-mikopo-kiswahili",
    ],
    faq: [
      {
        q: "Pesa droo zikipungua kuliko mfumo unavyosema je?",
        a: "Mfumo unarekodi tofauti hiyo kwenye zamu ya muuzaji husika. Chunguza siku hiyo hiyo: inaweza kuwa chenji iliyotolewa vibaya, mauzo yaliyosahaulika kurekodiwa, au tatizo kubwa zaidi. Muhimu ni kuwa unaliona siku ile ile, si mwisho wa mwezi.",
      },
      {
        q: "Mmiliki anaweza kuona ripoti bila kuwa dukani?",
        a: "Ndiyo. Mmiliki anafungua dashibodi yake popote alipo — simu au kompyuta — na kuona mauzo, faida, na zamu za siku hiyo hiyo moja kwa moja.",
      },
    ],
  },
];
