import { AcademyArticle } from "./academy-types";

// ─────────────────────────────────────────────────────────────────────────────
// POS af-Soomaali — sida loo isticmaalo AskBiz POS, tallaabo tallaabo.
// Original Somali-language content (not a translation of the English corpus).
// Written for Somali shopkeepers and market vendors: short sentences, concrete
// steps, EVC Plus/WAAFI-framed payments, USD pricing framing.
// ─────────────────────────────────────────────────────────────────────────────

export const ACADEMY_POS_SOMALI_ARTICLES: AcademyArticle[] = [
  {
    slug: "pos-ku-bilow-askbiz-soomaali",
    title: "Ku Bilow AskBiz POS: Gelitaanka PIN-kaaga",
    description: "Tilmaanta ugu horreysa ee AskBiz POS oo af-Soomaali ah — sida aad ku gasho PIN-kaaga, sida aad u fahanto shaashadda hore, iyo sida aad ugu tababbarto adigoon waxba khaldin.",
    category: "POS af-Soomaali",
    categorySlug: "pos-af-soomaali",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["POS", "Soomaali", "gelitaan", "PIN", "AskBiz", "dukaan", "iib", "bilow", "tababar"],
    keyTakeaways: [
      "Waxaad ku gashaa AskBiz POS lambarka taleefankaaga iyo PIN gaaban — iimayl iyo furaha dheer looma baahna.",
      "Shaqaale kastaa wuxuu leeyahay PIN u gaar ah, sidaas darteed iibka qof kastaa si gooni ah ayuu u xisaabmaa.",
      "Isticmaal habka tababarka (practice mode) si aad u barato adigoon cabsanayn — waxba laguma diiwaangelinayo xisaabta rasmiga ah.",
    ],
    content: [
      {
        heading: "Waa maxay POS, maxaadse u dooranaysaa AskBiz?",
        body: "POS (Point of Sale) waa goobta iibka — barnaamij kaa caawiya inaad diiwaangeliso iib kasta, aad la socoto alaabtaada, oo aad ogaato faa'iidadaada maalin kasta. AskBiz POS waxaa loo dhisay ganacsatada Soomaalida: wuxuu ku shaqeeyaa taleefankaaga caadiga ah, wuxuu si toos ah u aqbalaa EVC Plus iyo WAAFI, wuxuuna sii shaqeeyaa xitaa marka internetku go'o. Uma baahnid kombuyuutar iyo mashiin qaali ah midna.",
      },
      {
        heading: "Gelitaanka markii ugu horreysay",
        body: "Fur biraawsarka taleefankaaga (Chrome ama Safari) oo aad pos.askbiz.co. Geli lambarka taleefankaaga, kaddibna geli PIN-ka uu ku siiyay mulkiilaha ganacsiga. PIN-ku waa lambar gaaban — sida PIN-ka EVC Plus — sidaas darteed way fududahay in la xasuusto. Markaad hal mar gasho, taleefankaagu wuu xasuusanayaa: maalinta xigta waad furaysaa oo kaliya. Waxaad sidoo kale ka dhigi kartaa app: taabo 'Add to Home Screen', AskBiz POS-na wuxuu ka muuqan doonaa taleefankaaga sida app caadi ah.",
      },
      {
        heading: "Fahamka shaashadda hore",
        body: "Markaad gasho, waxaad arki doontaa shaashadda hore oo leh badhamo waaweyn: Iibi (inaad iib cusub bilowdo), Alaab (inaad aragto oo aad ku darto alaabta), iyo Warbixin (inaad aragto iibka maanta). Shaashadda kore waxaad ku arki doontaa magacaaga iyo iibka maanta — tirada iibka iyo wadarta lacagta. Wax kastaa wuxuu leeyahay badhamo waaweyn si aad si degdeg ah u taabato xitaa markaad dukaanka mashquul ku tahay.",
      },
      {
        heading: "Marka hore tababbaro, cabsi la'aan",
        body: "Haddii ay tahay markaaga ugu horreysa, AskBiz wuxuu ku siinayaa fursad aad ku tababbarto. Habka tababarku wuxuu ku tusayaa alaab tusaale ah, wuxuuna kuu oggolaanayaa inaad iib tijaabo ah samayso — waxba laguma diiwaangelinayo xisaabta rasmiga ah ee dukaanka. Samee laba ama saddex iib oo tababar ah ilaa aad isku kalsoonaato, kaddibna taabo dhammee tababarka oo bilow shaqada rasmiga ah. Tani waa habka ugu fiican ee wax loogu barto cabsi la'aan.",
      },
      {
        heading: "Mulkiilayaasha: siinta shaqaalaha PIN-kooda",
        body: "Haddii adigu tahay mulkiilaha, waxaad shaqaale kasta ku dari kartaa oo aad PIN u gaar ah siin kartaa qaybta Shaqaalaha ee dashboard-kaaga. Iibiye kastaa markuu PIN-kiisa ku galo, iib kastaa wuxuu ku diiwaangashan yahay magaciisa — sidaas darteed dhammaadka maalinta waxaad ogtahay yaa maxay iibiyay, xisaabta lacagta gacantana way caddahay. Qofna ha siin PIN-kaaga mulkiilaha; isaga ha la siiyo PIN shaqo oo u gaar ah.",
      },
    ],
    relatedSlugs: [
      "pos-alaab-ku-dar-kamerada-soomaali",
      "pos-iib-samee-soomaali",
      "pos-maamul-alaabta-soomaali",
      "pos-risiidh-macaamiil-iyo-deyn-soomaali",
      "pos-xir-maalinta-warbixinta-soomaali",
    ],
    faq: [
      {
        q: "Haddii aan PIN-kayga ilaawo maxaan sameeyaa?",
        a: "U sheeg mulkiilaha ganacsiga — wuxuu kuu dejin karaa PIN cusub qaybta Shaqaalaha ee dashboard-kiisa. PIN-ka cusubi isla markiiba wuu shaqeeyaa.",
      },
      {
        q: "Ma u baahanahay taleefan qaali ah?",
        a: "Maya. AskBiz POS wuxuu ku shaqeeyaa biraawsarka taleefan kasta oo Android ama iPhone ah. App la soo dejiyo iyo mashiin gaar ah midna looma baahna.",
      },
    ],
  },
  {
    slug: "pos-alaab-ku-dar-kamerada-soomaali",
    title: "Alaab Ku Dar Kamerada: Sawir Qaad, Dhammee",
    description: "Sida alaab loogu daro AskBiz POS adigoo sawir kaliya qaadaya — AI-gu wuxuu soo jeedinayaa magaca, adiguna waxaad gelinaysaa qiimaha iyo tirada. Qorid dheer looma baahna.",
    category: "POS af-Soomaali",
    categorySlug: "pos-af-soomaali",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["alaab", "kamera", "sawir", "AI", "bakhaar", "alaab ku darid", "POS", "Soomaali", "AskBiz"],
    keyTakeaways: [
      "Habka ugu dhaqsaha badan ee alaab lagu daro waa in la sawiro — AI-ga AskBiz ayaa garanaya oo magaceeda soo jeedinaya.",
      "Waxa kaliya ee aad adigu gelinayso waa qiimaha iibka, qiimaha gadashada, iyo tirada aad haysato.",
      "Haddii aad khaldanto, waxaa jira badhan dib-u-celin (undo) — khalad aan la saxi karin ma jiro.",
    ],
    content: [
      {
        heading: "Maxaa kamerada looga doorbidayaa qoridda?",
        body: "Dukaan caadi ahi wuxuu leeyahay boqolaal nooc oo alaab ah. In magac kasta gacanta lagu qoro waxay qaadataa maalin dhan, wayna daalisaa. AskBiz wuxuu isticmaalaa kamerada: waxaad sawirtaa alaabta, garaadka macmalka ah (AI) ayaana garanaya oo magaceeda soo jeedinaya — 'Bariis Basmati 1kg', 'Shaah Cadaani 500g'. Shaqadaadu waa inaad xaqiijiso magaca, aad geliso qiimaha, aad gelisona tirada. Hal alaab waxay qaadataa dhawr ilbiriqsi oo kaliya.",
      },
      {
        heading: "Tallaabo tallaabo: alaab cusub ku darid",
        body: "Shaashadda hore, taabo Alaab, kaddibna taabo badhanka ku-darista (+). Kameradu way furmi doontaa. Alaabta si fiican ugu qabo kamerada hortiisa — iftiin ku filan ayaa caawiya — kaddibna sawir qaad. Sug hal ama laba ilbiriqsi: AI-gu wuxuu soo jeedin doonaa magaca alaabta. Haddii magacu sax yahay, iska daa; haddii kale taabo oo sax. Kaddib geli qiimaha iibka, qiimaha gadashada (si faa'iidadu u xisaabmato), iyo tirada aad bakhaarka ku haysato. Taabo Kaydi — alaabtu diyaar bay u tahay in la iibiyo.",
      },
      {
        heading: "Sawirka alaabtu wuu ku caawiyaa mustaqbalka",
        body: "Sawirka aad qaaddo wuxuu ku hadhaa alaabta. Wakhtiga iibka, iibiyuhu wuxuu arkaa sawirka — ma aha qoraal kaliya — sidaas darteed si degdeg ah ayuu u helaa alaabta saxda ah, xitaa haddii uusan si fiican wax u akhriyin ama alaabtu leedahay magacyo isu eg. Tani waxay yaraysaa khaladaadka alaab qaldan la iibiyo, gaar ahaan shaqaalaha cusub.",
      },
      {
        heading: "Saxidda khaladaadka: undo iyo wax-ka-beddel",
        body: "Haddii aad geliso qiimo qaldan ama magac qaldan, ha werwerin. Kaddib markaad alaabta kaydiso, wakhti kasta waad taaban kartaa liiska Alaabta oo waad beddeli kartaa magaca, qiimaha, ama tirada. Haddii aad si lama filaan ah u kaydisay, badhanka dib-u-celinta (undo) ayaa kuu oggolaanaya inaad isla markiiba tirtirto tallaabadii ugu dambeysay.",
      },
      {
        heading: "Alaab ka soo wareejinta nidaam kale",
        body: "Haddii aad horey liiska alaabtaada ugu haysay nidaam POS kale ama buug, uma baahnid inaad bilow ka bilowdo. Waxaad alaab badan ku dari kartaa adigoo sawir sawir ka dambeeya qaadaya — toban daqiiqo ayaa ku filan konton alaab. Liis ka weyn, kala xiriir AskBiz qaybta caawimada si ay kaaga caawiyaan soo wareejinta liiskaaga oo dhan hal mar.",
      },
    ],
    relatedSlugs: [
      "pos-ku-bilow-askbiz-soomaali",
      "pos-iib-samee-soomaali",
      "pos-maamul-alaabta-soomaali",
      "pos-risiidh-macaamiil-iyo-deyn-soomaali",
      "pos-xir-maalinta-warbixinta-soomaali",
    ],
    faq: [
      {
        q: "Haddii AI-gu magaca alaabta khaldo?",
        a: "Taabo magaca la soo jeediyay oo qor kan saxda ah. AI-gu wuu soo jeedinayaa oo kaliya — adiga ayaa go'aaminaya magaca kama dambaysta ah kahor inta aadan kaydin.",
      },
      {
        q: "Ma qasab baa inaan geliyo qiimaha gadashada?",
        a: "Qasab ma aha, laakiin aad ayaa loogu talagalay. Qiimaha gadashada la'aantiis, AskBiz kuuma xisaabin karo faa'iidadaada dhabta ah — waxaad arki doontaa iibka oo kaliya, ma aha faa'iidada.",
      },
    ],
  },
  {
    slug: "pos-iib-samee-soomaali",
    title: "Iib Samee: Lacag Gacanta, EVC Plus iyo WAAFI",
    description: "Sida iib loogu sameeyo AskBiz POS oo af-Soomaali ah — alaab dooro, lacag gacanta qaado oo baaqiga xisaabi, ama codsi lacag-bixineed si toos ah ugu dir taleefanka macmiilka EVC Plus ama WAAFI.",
    category: "POS af-Soomaali",
    categorySlug: "pos-af-soomaali",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["iib", "EVC Plus", "WAAFI", "Zaad", "Sahal", "lacag gacanta", "baaqi", "POS", "Soomaali", "AskBiz"],
    keyTakeaways: [
      "Iibku wuxuu leeyahay saddex tallaabo oo kaliya: alaab dooro, hab lacag-bixineed dooro, dhammee.",
      "Lacagta gacanta, geli inta uu macmiilku bixiyay — AskBiz-na isla markiiba wuu kuu xisaabinayaa baaqiga.",
      "EVC Plus, WAAFI, Zaad iyo Sahal: geli lambarka macmiilka — codsigu si toos ah ayuu ugu tagayaa, wuxuu geliyaa PIN-kiisa, iibkuna si otomaatig ah ayuu u xaqiijmayaa.",
    ],
    content: [
      {
        heading: "Iib cusub bilaabid",
        body: "Taabo Iibi shaashadda hore. Alaabta ku raadi magaceeda, ama sawir kamerada — AskBiz ayaa garanaya. Taabo alaabta si aad dambiisha ugu darto. Haddii macmiilku waxyaabo badan gadanayo, sii wad ku-darista; tirada alaab kastana taabasho ayaad ku beddeli kartaa. Wadartu shaashadda hoose ayay ka muuqataa wakhtiga oo dhan, far waaweyn.",
      },
      {
        heading: "Lacagta gacanta iyo baaqiga",
        body: "Taabo Bixi, kaddibna dooro Lacag Gacanta. Geli inta uu macmiilku ku siiyay — tusaale, wadartu waa $7.50, macmiilkuna wuxuu ku siiyay $10. AskBiz isla markiiba wuxuu ku tusayaa baaqiga: $2.50. Madax lagu xisaabin maayo, khalad baaqina ma jiro. Taabo Dhammee, iibkuna wuu diiwaangashan yahay. Xasuusnow: iibka lacagta gacantu wuxuu shaqeeyaa xitaa internet la'aan — wuxuu ku kaydsamaa taleefanka, wuxuuna baxaa marka internetku soo noqdo.",
      },
      {
        heading: "EVC Plus iyo WAAFI: codsigu macmiilka ayuu u tagaa",
        body: "Dooro Lacagta Mobiilka, kaddibna dooro jeebka macmiilku isticmaalo — EVC Plus, WAAFI, Zaad, ama Sahal. Geli lambarka taleefanka macmiilka (061 XXX XXXX), kaddibna taabo Dir Codsiga. Macmiilku wuxuu taleefankiisa ku heli doonaa fariin ka codsanaysa inuu lacag-bixinta ku xaqiijiyo PIN-kiisa. Markuu PIN-ka geliyo, AskBiz ayaa si toos ah u helaya xaqiijinta — shaashaddaadu waxay muujin doontaa calaamad cagaaran iyo cod guul ah. Uma baahnid inaad macmiilka weydiiso inuu ku tuso fariinta; nidaamku isagaa xaqiijinaya.",
      },
      {
        heading: "Haddii codsigu gaari waayo ama macmiilku diido",
        body: "Mararka qaar macmiilku lambar qaldan ayuu sheegaa, ama wuu raagaa gelinta PIN-ka. Haddii codsiga aan laga jawaabin, shaashaddu waxay muujinaysaa in la sugayo; waxaad taaban kartaa 'Lambar qaldan? Dir mar kale' oo aad lambarka saxdaa. Haddii codsiga la diido ama wakhtigu dhammaado, iibku ma dhammaystirna — lacag lama diiwaangelin. Waad isku dayi kartaa mar kale ama macmiilka weydiiso inuu lacag gacanta ku bixiyo.",
      },
      {
        heading: "Qiimo-dhimis iyo faahfaahinta iibka",
        body: "Kahor intaadan iibka dhammaystirin, waxaad geli kartaa qiimo-dhimis — lacag ahaan ($0.50) ama boqolkiiba (5%). Qiimo-dhimistu si cad ayay uga muuqataa wadarta iyo warbixinta, sidaas darteed mulkiiluhu wuxuu ogaanayaa qiimo-dhimis kasta iyo qofkii sameeyay. Waxaad sidoo kale geli kartaa lambarka macmiilka xitaa iibka lacagta gacanta — tani waxay u oggolaanaysaa inuu risiidh ku helo WhatsApp, waxayna kaa caawinaysaa dhisidda liiska macaamiishaada.",
      },
    ],
    relatedSlugs: [
      "pos-ku-bilow-askbiz-soomaali",
      "pos-alaab-ku-dar-kamerada-soomaali",
      "pos-maamul-alaabta-soomaali",
      "pos-risiidh-macaamiil-iyo-deyn-soomaali",
      "pos-xir-maalinta-warbixinta-soomaali",
    ],
    faq: [
      {
        q: "Haddii internetku maalinta dhexdeeda go'o?",
        a: "Iibka lacagta gacantu sidiisii buu u socdaa — taleefankaaga ayuu ku kaydsamaa, si toos ahna wuu u baxaa marka internetku soo noqdo. Lacagta mobiilku (EVC Plus/WAAFI) waxay u baahan tahay internet, markaas lacag gacanta oo kaliya qaado.",
      },
      {
        q: "Ma tirtiri karaa iib aan khaldamay?",
        a: "Haa. Iibka waa la celin karaa (refund) ama waa la saxi karaa qof ruqsad leh — caadi ahaan mulkiilaha ama kormeeraha. Sax kastaa wuu diiwaangashan yahay, sidaas darteed xisaabtu way caddaataa.",
      },
    ],
  },
  {
    slug: "pos-maamul-alaabta-soomaali",
    title: "Maamul Alaabtaada: Yaanay Kaa Dhammaan Adigoon Ogayn",
    description: "Sida AskBiz POS si toos ah ula socdo bakhaarkaaga iib kasta kaddib — digniinaha alaabta sii dhammaanaysa, alaab cusub ku darid, iyo dalab u dirid alaab-qeybiyayaasha.",
    category: "POS af-Soomaali",
    categorySlug: "pos-af-soomaali",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["bakhaar", "alaab", "digniin", "dalab", "alaab-qeybiye", "stock", "POS", "Soomaali", "AskBiz"],
    keyTakeaways: [
      "Iib kastaa si toos ah ayuu bakhaarka u dhimayaa — uma baahnid inaad mar kale gacanta ku tiriso.",
      "Alaabta sii dhammaanaysa waxay ku muuqataa midab huruud ah; tan gebi ahaanba dhammaatay midab guduud ah.",
      "Waxaad samayn kartaa dalab (purchase order) oo aad si toos ah WhatsApp ugu diri kartaa alaab-qeybiyahaaga.",
    ],
    content: [
      {
        heading: "Bakhaar is-xisaabiya",
        body: "Markaad alaabta ku darto tirada — tusaale, 24 cadar — AskBiz ayaa bilaabaya inuu la socdo. Mar kasta oo aad hal cadar iibiso, tiradu si toos ah ayay u dhimmaysaa: 24, 23, 22. Uma baahnid buug bakhaar iyo tirin habeen kasta midna. Wakhti kasta, fur Alaab oo arag tirada dhabta ah ee alaab kasta oo dukaankaaga ku hadhay.",
      },
      {
        heading: "Digniin kahor inta aysan dhammaan",
        body: "Alaab kasta waxaad u dejin kartaa heer hoose — tusaale, 'ii digniin geli cadarku markuu 5 gaaro'. Alaabtu markay heerkaas gaarto, waxay ku muuqataa midab huruud ah qaybta Digniinaha Bakhaarka, iyadoo wadata tirada hadhay ('5 ayaa hadhay'). Alaabta gebi ahaanba dhammaatay waxay ku muuqataa guduud — WAY DHAMMAATAY — lamana iibin karo ilaa aad alaab ku darto. Qaybtan fiiri subax kasta kahor furitaanka dukaanka: hal daqiiqo ayaa kaa badbaadinaysa ceebta ah in macmiilka lagu yiraahdo 'way dhammaatay'.",
      },
      {
        heading: "Alaab cusub ku darid markay timaado",
        body: "Marka xamuul cusubi yimaado, fur alaabta khusaysa oo tirada cusub bakhaarka ku dar — tusaale, waxaad haysatay 3 cadar, waxaad heshay kartoon 24 ah, hadda waxaad gelinaysaa 27. Haddii qiimaha gadashadu is-beddelay, halkan ku sax si xisaabta faa'iidadu u sii saxnaato. Kordhin kastaa wuu diiwaangashan yahay, sidaas darteed waxaad arki kartaa taariikhda bakhaarka ee alaab kasta.",
      },
      {
        heading: "Dalab WhatsApp ugu dir alaab-qeybiyaha",
        body: "AskBiz wuxuu leeyahay qayb Dalabyada (Purchase Orders). Samee dalab cusub, dooro alaabta loo baahan yahay iyo tirada, kaddibna si toos ah WhatsApp ugu dir alaab-qeybiyahaaga — wuxuu helayaa liis dhammaystiran oo nadiif ah. Marka xamuulku yimaado, fur isla dalabkii oo taabo Alaabta Qaado: bakhaarka alaab kastaa si toos ah ayuu u kordhaa sida aad heshay. Laba jeer wax lama qorayo.",
      },
      {
        heading: "Tirinta bakhaarka dhabta ah (stock take)",
        body: "Marar joogto ah — usbuuc kasta ama bil kasta — waxaa fiican in la isbarbardhigo bakhaarka nidaamka iyo alaabta dhabta ah ee taagan. Farqi yar ayaa dhici kara jabniin, xatooyo, ama khaladaad awgood. Qaybta tirinta bakhaarku waxay kuu oggolaanaysaa inaad alaab alaab u marto oo aad geliso tirada dhabta ah ee aad tirisay; nidaamku wuxuu muujinayaa farqiga wuuna saxayaa. Xisaab bakhaar oo nadiif ah ayaa saldhig u ah warbixino faa'iido oo la isku halleyn karo.",
      },
    ],
    relatedSlugs: [
      "pos-ku-bilow-askbiz-soomaali",
      "pos-alaab-ku-dar-kamerada-soomaali",
      "pos-iib-samee-soomaali",
      "pos-risiidh-macaamiil-iyo-deyn-soomaali",
      "pos-xir-maalinta-warbixinta-soomaali",
    ],
    faq: [
      {
        q: "Haddii aan ilaawo dejinta heerka digniinta?",
        a: "Alaabtu sidii caadiga ahayd ayay u iibsanaysaa ilaa ay dhammaato, kaddibna waxay u muuqanaysaa guduud sida WAY DHAMMAATAY. Waxaa fiican inaad heer digniin u dejiso alaabtaada ugu iibka badan si aad war hore u hesho.",
      },
      {
        q: "Alaab kiilo ama miisaan lagu iibiyo?",
        a: "Wakhtiga iibka, geli tirada dhabta ah ee la iibiyay — tusaale 2.5 kiilo — bakhaarkuna isla intaas ayuu dhimmayaa.",
      },
    ],
  },
  {
    slug: "pos-risiidh-macaamiil-iyo-deyn-soomaali",
    title: "Risiidhyada WhatsApp, Macaamiisha, iyo Iibka Deynta",
    description: "Sida macmiilka risiidh WhatsApp loogu diro, sida liiska macaamiishaada u dhismo, iyo sida iibka deynta (daynta) loogu maamulo AskBiz POS buug deyn la'aan.",
    category: "POS af-Soomaali",
    categorySlug: "pos-af-soomaali",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["risiidh", "WhatsApp", "macaamiil", "deyn", "dayn", "lacag-bixin", "POS", "Soomaali", "AskBiz"],
    keyTakeaways: [
      "Geli lambarka macmiilka, wuxuuna WhatsApp ku helayaa risiidh dhammaystiran — warqad iyo mashiin daabacaad midna looma baahna.",
      "Macmiil kasta oo lambar leh waxaa loo dhisayaa taariikh: muxuu gataa, immisa jeer, immisase lagu leeyahay.",
      "Iibka deyntu nidaamka ayuu ku diiwaangashan yahay — waxaad ogtahay yaa lagu leeyahay maxay, ilaa goorma, lacag-bixin kastana waad diiwaangelinaysaa.",
    ],
    content: [
      {
        heading: "Risiidh mashiin la'aan: WhatsApp ayaa ku filan",
        body: "Mashiinnada risiidhyadu waa kharash — mashiinka, warqadda, khadka. AskBiz wuxuu risiidhka ku dirayaa WhatsApp beddelkeeda. Dhammaadka iibka, geli lambarka taleefanka macmiilka oo taabo Dir Risiidh. Macmiilku wuxuu helayaa risiidh dhammaystiran: alaabta, qiimaha, wadarta, magaca dukaankaaga, iyo wakhtiga. Risiidhka WhatsApp-ku ma lumo sida warqadda — macmiilku wakhti kasta wuu dib ugu noqon karaa, adiguna nuqul ayaad nidaamka ku haysataa.",
      },
      {
        heading: "Liiska macaamiishu iskiis buu isu dhisaa",
        body: "Mar kasta oo aad lambarka macmiilka iibka geliso, macmiilkaasi si toos ah ayuu u galaa liiskaaga Macaamiisha. Wakhti kaddib, waxaad dhisaysaa khasnad qiimo leh: macaamiishaadu waa ayo, maxay gataan, immisa jeerse ay soo noqdaan. Haddii aad hal macmiil furto, waxaad arkaysaa taariikhdiisa gadashada oo dhan — tani waxay kaa caawinaysaa inaad garato macaamiishaada ugu fiican oo aad si wanaagsan ugu adeegto.",
      },
      {
        heading: "Iibka deynta: nabadgelyo buugga deynta",
        body: "Ganacsiyo badan oo Soomaali ah ayaa deyn ku iibiya — macmiil la aamini karo ayaa alaab maanta qaata, dhammaadka bishana bixiya. Dhibaatada buuggu waa inuu lumo, tirtirmo, murankana keeno. AskBiz dhexdiisa, wakhtiga lacag-bixinta dooro Deyn oo geli magaca ama lambarka macmiilka. Iibku sidii caadiga ahayd ayuu u diiwaangashan yahay, laakiin wuxuu u hadhayaa deyn la sugayo — akoonka macmiilkaas, iyo wadarta deynta guud ee lagugu leeyahay.",
      },
      {
        heading: "Qaadashada lacagta deynta",
        body: "Marka macmiilku yimaado inuu deynta bixiyo — dhammaan ama qayb — fur akoonkiisa qaybta Macaamiisha, taabo Qaado Lacag, oo geli inta uu bixiyay. Deyntu isla markiiba way dhimmaysaa, macmiilkuna xaqiijin WhatsApp ah ayuu heli karaa. Haddii uu nus bixiyo, nuska hadhay wuu sii muuqanayaa. Muran dambe ma jiro oo ah 'usbuucii hore ayaan bixiyay' — lacag-bixin kastaa waxay leedahay taariikh iyo wakhti.",
      },
      {
        heading: "Deynta si caqli leh u maamul",
        body: "Qaybta deyntu waxay ku tusaysaa wadarta lacagta lagugu leeyahay oo dhan, iyo liiska deyn-qabayaasha laga bilaabo kan ugu badan. Liiskan usbuuc kasta fiiri: deyn wakhti dheer taagani waa lacagtaadii oo jeebka qof kale ku jirta. Nidaam samee — tusaale, deyn cusub ma jirto macmiil aan kii hore bixin — oo taariikhda macmiil kasta ku isticmaal go'aaminta qofka la aamini karo. Nidaamku runta ayuu ku siinayaa; go'aannadu adigay kuu taallaan.",
      },
    ],
    relatedSlugs: [
      "pos-ku-bilow-askbiz-soomaali",
      "pos-alaab-ku-dar-kamerada-soomaali",
      "pos-iib-samee-soomaali",
      "pos-maamul-alaabta-soomaali",
      "pos-xir-maalinta-warbixinta-soomaali",
    ],
    faq: [
      {
        q: "Haddii macmiilku WhatsApp lahayn?",
        a: "Iibku sidii caadiga ahayd ayuu u dhammaystirmayaa — risiidhka WhatsApp waa ikhtiyaar. Diiwaanka dhammaystiran ee iibku nidaamkaaga ayuu ku hadhayaa xitaa haddii macmiilku risiidh helin.",
      },
      {
        q: "Yaa arki kara dhammaan deynta?",
        a: "Mulkiilaha iyo kormeerayaashu waxay arkaan deynta dukaanka oo dhan. Iibiyaha caadigu wuu diiwaangelin karaa iib deyn ah, laakiin maamulka deyntu wuxuu u hadhaa kuwa ruqsadda leh.",
      },
    ],
  },
  {
    slug: "pos-xir-maalinta-warbixinta-soomaali",
    title: "Xir Maalinta: Tiri Lacagta oo Akhri Warbixintaada",
    description: "Sida maalinta loogu xiro AskBiz POS — isbarbardhigga lacagta gacanta ee taagan iyo iibka diiwaangashan, akhrinta warbixinta maalinta, iyo fahamka faa'iidadaada dhabta ah.",
    category: "POS af-Soomaali",
    categorySlug: "pos-af-soomaali",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["maalin xirid", "warbixin", "faa'iido", "lacag gacanta", "xisaab", "iibka maalinta", "POS", "Soomaali", "AskBiz"],
    keyTakeaways: [
      "Dhammaadka maalinta, AskBiz wuxuu kuu sheegayaa inta lacag gacanta ah ee khasnadda ku jiri lahayd — adigu waad tirinaysaa oo isbarbardhigaysaa.",
      "Warbixinta maalintu waxay muujinaysaa dhammaan iibka, hababka lacag-bixinta, iibiyaha ugu fiican, iyo alaabta ugu iibka badan.",
      "Faa'iidada dhabta ah (ma aha iibka oo kaliya) maalin kasta way muuqataa — sababtoo ah waxaad gelisay qiimaha gadashada alaabtaada.",
    ],
    content: [
      {
        heading: "Maxay maalin-xiriddu muhiim u tahay",
        body: "Maalin-xiriddu waa caado kala saarta ganacsiga xisaabtiisa yaqaan iyo kan malaynaya. Shan daqiiqo fiid kasta waxay kuu sheegayaan: lacagtii oo dhan ma taagan tahay? Yaa maxay iibiyay? Faa'iidada maantu waa immisa? Nidaamkan la'aantiis, luminta yar-yar ee maalin kastaa way qarsoomaysaa — dhammaadka bishana waxaad la yaabaysaa meesha lacagtu aadday.",
      },
      {
        heading: "Isbarbardhigga lacagta gacanta (till reconciliation)",
        body: "Marka iibiyuhu shiftigiisa xirayo, AskBiz wuxuu muujinayaa wadarta iibka lacagta gacanta ee shiftigaas diiwaangashan — tusaale, $145. Hadda tiri lacagta dhabta ah ee khasnadda ku taal oo geli inta aad tirisay. Haddii ay is-le'ekaadaan — fiican. Haddii farqi jiro, nidaamku si cad ayuu u muujinayaa: $5 oo dhiman, ama dheeraad. Farqigu wuxuu ku diiwaangashan yahay shiftiga iyo iibiyaha, sidaas darteed hab kasta oo lumis ah goor hore ayuu muuqdaa, ma aha bilo kaddib.",
      },
      {
        heading: "Akhrinta warbixinta maalinta",
        body: "Fur Warbixin oo dooro Maanta. Waxaad arkaysaa: wadarta iibka, tirada macaamilaadka, celceliska iib kasta, iyo qaybsanaanta hababka lacag-bixinta — immisa lacag gacanta, immisa EVC Plus iyo WAAFI. Hoostiisa, alaabta ugu iibka badan iyo waxqabadka iibiye kasta. Isbarbardhig shalay ama usbuucii hore adigoo taariikhda beddelaya: iibku ma kordhayaa mise wuu hoos u dhacayaa? Maalmaha usbuuca kee baa ugu fiican? Warbixintani waa indhaha ganacsigaaga.",
      },
      {
        heading: "Faa'iido dhab ah, ma aha iib oo kaliya",
        body: "Iib badan macnihiisu ma aha faa'iido badan. Sababtoo ah waxaad gelisay qiimaha gadashada alaab kasta, AskBiz si toos ah ayuu u xisaabiyaa faa'iidada guud (gross profit): iibka laga jaray qiimaha alaabta la iibiyay. Waxaad sidoo kale arkaysaa boqolkiiba faa'iidada (margin). Alaab aad loo iibiyo laakiin faa'iido yar leh lama mid aha mid yar la iibiyo oo faa'iido weyn leh — warbixintani waxay kaa caawinaysaa go'aaminta alaabta la dhiirrigeliyo iyo qiimaha la saxo.",
      },
      {
        heading: "Nidaamka fiidka ee shanta daqiiqo",
        body: "Caadadan fiid kasta samee: (1) Xir shiftiga oo isbarbardhig lacagta gacanta. (2) Fiiri warbixinta maalinta — iibka, faa'iidada, hababka lacag-bixinta. (3) Dib u eeg digniinaha bakhaarka ee berrito. (4) Fiiri deynta cusub ee maanta. Shan daqiiqo oo kaliya — laakiin bil kaddib, waxaad ganacsigaaga u garan doontaa si qoto dheer oo ganacsato badani weligood gaari waayaan. Warbixintan oo dhami waxay sidoo kale gaaraysaa mulkiilaha meel kasta oo uu joogo, sababtoo ah nidaamku internetka ayuu ku jiraa.",
      },
    ],
    relatedSlugs: [
      "pos-ku-bilow-askbiz-soomaali",
      "pos-alaab-ku-dar-kamerada-soomaali",
      "pos-iib-samee-soomaali",
      "pos-maamul-alaabta-soomaali",
      "pos-risiidh-macaamiil-iyo-deyn-soomaali",
    ],
    faq: [
      {
        q: "Haddii lacagta khasnaddu ka yar tahay inta nidaamku sheegayo?",
        a: "Nidaamku farqigaas wuxuu ku diiwaangelinayaa shiftiga iibiyaha khuseeya. Isla maalintaas baar: waxay noqon kartaa baaqi si khaldan loo bixiyay, iib la ilaaway in la diiwaangeliyo, ama dhibaato ka weyn. Muhiimadu waa inaad isla maalintaas aragto, ma aha dhammaadka bisha.",
      },
      {
        q: "Mulkiiluhu ma arki karaa warbixinta isagoon dukaanka joogin?",
        a: "Haa. Mulkiiluhu wuxuu dashboard-kiisa ka furaa meel kasta — taleefan ama kombuyuutar — wuxuuna si toos ah u arkaa iibka, faa'iidada, iyo shiftiyada isla maalintaas.",
      },
    ],
  },
];
