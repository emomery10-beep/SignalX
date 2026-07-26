// Academy article translations — Soomaali (so) — Wave A, Batch 2.
//
// Point of Sale & Retail / POS-BI-Integration / Multi-Branch category:
// 13 articles covering VAT calculations, audit trails, 30-day export, staff
// performance, security, PWA mobile setup, troubleshooting, dashboards, AI
// chat questions, Daily Brief integration, Business Pulse impact, offline
// mode, and multi-location retail management.
//
// Glossary REUSED VERBATIM from the Batch 1 sibling agent — see the full
// list reported alongside this file. Key terms used in this batch:
//   faa'iido = profit / margin (glossed on first use where distinct)
//   dakhli = revenue | kayd = stock/inventory | kharashaad = expenses
//   deyn = debt/credit | hadhaaga/baaqi = balance | saadaal = forecast
//   canshuur = tax | keeshiye = cashier | maareeye = manager
//   milkiile = owner | dukaan = shop | macmiil = customer
//   POS = POS (untranslated) | rasiid = receipt
//   macaamil-dhaqaaleed = transaction | celin lacag/soo-celin lacageed = refund
//   shaqaale = staff | door = role | dambiil = cart
//   qiimo-dhimis = discount | barcode = barcode (kept) | koodhka QR = QR code
//   baabi'i/baabi'inta = void | diiwaanka hubinta = audit trail
//   heerka dib-u-dalabka = reorder point | dib u dalbo = reorder (verb)
//   hel kayd = receive stock | dib u buuxi kaydka = restock (verb)
//   xisaabinta iibka / iibka fulinta = checkout / process a sale
//   habka lacag-bixinta = payment method | lacag caddaan = cash | kaadh = card
//   iib = sale | kayd la'aan / kaydka oo dhammaaday = stockout
//   xawaaraha iibka = sales velocity/sell-through rate
//   kayd dhimatay = dead stock | digniin/ogeysiis = alert/notification
//   xiriir hal-mar ah = magic link | ganacsi yar = small business
//   oggolaansho / awood gelitaan = permission(s)
//   maareynta kaydka = inventory management
// Product/proper nouns kept English: AskBiz, AskBiz POS, WhatsApp, Owner/
// Manager/Cashier (glossed with milkiile/maareeye/keeshiye on first mention),
// UI button/section names (Add Staff, Invite, POS Settings, Refund, Void,
// Add Note, Receive Stock, Discount, Pay, Notes, Transactions, Inventory).
// UK legal/institutional names untranslated: HMRC, Consumer Rights Act 2015,
// Making Tax Digital, UK Finance, GDPR. Numbers/currency (£)/percentages
// preserved exactly as in English source.
//
// Merged into lib/academy-i18n/so/index.ts by a later step — this file is
// NOT imported anywhere yet.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch2Translations: LocaleTranslations = {
  'pos-vat-calculations': {
    title: 'Xisaabinta Canshuurta VAT iyo Waafiqidda Canshuuraha Macaamilada POS',
    description:
      "Canshuurta VAT si sax ah u helo iibkaaga ugu horreeya. AskBiz POS wuxuu si toos ah u xisaabiyaa VAT-ka macaamil kasta, wuxuuna kaa dhigayaa mid diyaar u ah Making Tax Digital.",
    keywords: [
      'xisaabinta VAT POS',
      'waafiqidda VAT POS',
      'Making Tax Digital POS',
      'heerka VAT tafaariiqda',
      'xisaabinta VAT toos ah',
      'warbixinta canshuurta POS UK',
      'qiimaha VAT ku jirta',
    ],
    keyTakeaways: [
      "AskBiz POS wuxuu si toos ah u xisaabiyaa VAT-ka iib kasta, isagoo ku salaynaya heerka VAT ee la siiyay alaab kasta.",
      "Alaabta waxaa loo dejin karaa heerka caadiga ah (20%), heer dhimis (5%), heer eber (0%), ama mid ka madax banaan — AskBiz wuxuu si sax ah u maareeyaa dambiillaha isku dhafan.",
      "Xogta VAT ee heerka macaamil-dhaqaaleed ayaa si toos ah u geliya warbixinnadaada, taasoo fududaynaysa gudbinta Making Tax Digital.",
    ],
    content: [
      {
        heading: 'Sida AskBiz POS u xisaabiyo VAT-ka',
        body: "Marka aad alaab ku darto liiskaaga AskBiz, waxaad u qoondaysaa heer VAT: caadiga ah (20%), dhimis (5%), eber (0%), ama mid madax banaan. Laga bilaabo taas, iib kasta oo ka mid ah alaabtaas waxaa si toos ah loogu xisaabiyaa VAT. Haddii macmiil uu iibsado saddex alaabood oo heer VAT kala duwan leh — tusaale ahaan, qalab heer caadi leh, kursi carruureed oo heer dhimis leh, iyo buug heer eber ah — AskBiz wuxuu si sax ah u xisaabiyaa VAT-ka alaab kasta, wuxuuna rasiidka ku muujiyaa jajabinta guud ee VAT. Ma aha inaad ka fikirto intii lagu jiray iibka; nidaamku wuu qabtaa gadaal. Rasiidku wuxuu muujiyaa lacagta net-ka ah, lacagta VAT-ka, iyo wadarta guud, taasoo ay u baahan yihiin macaamiisha diiwaangashan ee VAT si ay diiwaanadooda u dhigtaan. Qiimaha VAT-ku ku jiro (halka qiimaha shelf-ka uu VAT ka koobnaado), AskBiz wuxuu dib u xisaabiyaa lacagta net iyo qaybta VAT isagoo adeegsanaya qaacidada caadiga ah.",
      },
      {
        heading: 'VAT-ku ku jiro iyo VAT-ka aan ku jirin',
        body: "Tafaariiqda UK, qiimaha loo muujiyo macaamiisha si joogto ah waa mid VAT-ku ku jiro — qiimaha shelf-ka waa isla qiimaha macmiilku bixinayo, VAT-na wuu ku jiraa. AskBiz POS wuxuu taageeraa labadaba habab. Ganacsiyada macaamiisha caadiga ah, dejii alaabtaada si VAT-ku ku jiro, AskBiz-na wuxuu macmiilka u muujin doonaa qiimaha buuxa isagoo si gaar ah u kaydiyaya lacagta net iyo qaybta VAT gadaal. Macaamiisha ganacsiga ama jumladda ee u baahan inay arkaan qiimaha net, waxaad u beddeli kartaa qiimaha VAT-ka aan ku jirin, halkaas oo qiimaha la muujiyo uu VAT ka horreeyo oo nidaamku VAT ku daro xisaabinta. Xitaa waxaad ku shaqayn kartaa habka isku dhafan — VAT-ku ku jiro macaamiisha soo booqda, VAT-ka aan ku jirin macaamiisha ganacsiga — adigoo u qeexaya doorbidaadda muujinta macmiil kasta ama macaamil-dhaqaaleed kasta. Dabacsanaanta ayaa gaar ahaan faa'iido u leh ganacsiyada u adeega labada macmiil ee tafaariiqda iyo ganacsiga isla goobta.",
      },
      {
        heading: 'Making Tax Digital iyo xogtaada POS',
        body: "Making Tax Digital (MTD) waa barnaamijka HMRC ee wareejinta maamulka canshuuraha internet-ka. Haddii aad ka diiwaangashan tahay VAT, horeba waxaa lagaa rabaa inaad hayso diiwaanno dhijitaal ah oo aad ku soo gudbiso soo-celinta VAT-kaaga adigoo isticmaalaya software MTD-compatible ah. AskBiz POS wuxuu si toos ah u soo saaraa diiwaanno dhijitaal ah macaamil kasta, taasoo macnaheedu yahay xogtaada POS ayaa dabeecad ahaan diyaar u ah MTD. Iibka kastaa wuxuu diiwaan geliyaa taariikhda, lacagta net, heerka VAT, lacagta VAT, iyo wadarta guud. Diiwaanadan waxaa lagu kaydiyaa si dhijitaal ah, taariikh la calaamadeeyay, mana beddeli karo (mudnaanta qaabka macaamil-dhaqaaleedka aan la beddeli karin), taasoo buuxinaysa dhammaan shuruudaha HMRC ay filayso. Marka ay tahay wakhtiga aad diyaarinayso soo-celinta VAT-kaaga, waxaad soo dejin kartaa xogta macaamil-dhaqaaleedka POS-kaaga oo aad ku geli kartaa software xisaabaadka ee MTD-compatible ah. AskBiz wuxuu ku siiyaa xogta qaabka saxda ah, kuwaas oo yareeya geliddda gacanta iyo qaladaadka la xiriira.",
      },
      {
        heading: 'Qaladaadka VAT ee caadiga ah ee isticmaalayaasha POS',
        body: "Qaladka ugu badan waa in la siiyo heer VAT khaldan alaab. UK, xeerarku waa kuwo faahfaahsan, mararna aan la filayn — tusaale ahaan, buskud caadi ah waa heer eber, laakiin buskud shukulaato lagu daboolay waa heer caadi. Cuntada kulul ee la qaadanayo waa heer caadi, laakiin cuntada qaboow ee la qaadanayo guud ahaan waa heer eber. Dharka carruurta waa heer eber, laakiin dharka dadka waaweyn waa heer caadi. Haddii aadan hubin sida loo xisaabiyo VAT alaabtaada, hubi tilmaanta VAT ee HMRC ee qaybtaada ama la xaajoodo xisaabiyahaaga. Khalad ahaan ku qaadista wuxuu keeni karaa inaad ka yar bixiso ama kaga badan bixiso VAT, labaduba dhibaato bay abuuraan. AskBiz wuxuu kuu ogolaanayaa inaad tiro badan wax ka beddesho heerarka VAT haddii aad ogaato khalad, isbedelkuna wuxuu ku muuqan doonaa xilliga xisaabaadkaaga xiga. Furaha waa in heerarka laga bilaabo si sax ah, oo dib loo eego mar kasta oo HMRC uu bedelo xeerarka.",
      },
    ],
    faq: [
      {
        q: 'Ma u baahan tahay inaad diiwaangashan tahay VAT si aad u isticmaasho AskBiz POS?',
        a: 'Maya. Haddii aadan ka diiwaangashaneen VAT, waxaad alaabtaada oo dhan u dejin kartaa VAT eber, AskBiz-na canshuur kuma dari doono. Marka aad VAT diiwaangashato, kaliya cusbooneysii heerarka VAT ee alaabtaada.',
      },
      {
        q: 'Ma uu AskBiz-ku si toos ah ugu gudbin karaa soo-celinta VAT-kaaga HMRC?',
        a: 'AskBiz wuxuu ku siiyaa xogta macaamil-dhaqaaleedka ee aad u baahan tahay soo-celintaada VAT. Soo-celinta waxaad ku gudbisaa software-kaaga xisaabaadka ee MTD-compatible ah. Gudbinta toosan ee HMRC ee AskBiz waa mid la qorsheeyay mustaqbalka.',
      },
    ],
  },

  'pos-audit-trail': {
    title: "Diiwaanka Hubinta: Macaamil-Dhaqaaleed Kasta, La Raadraaco oo Aan La Bedeli Karin",
    description:
      "AskBiz POS wuxuu hayaa diiwaan hubin oo buuxa oo aan la beddeli karin oo ku saabsan iib kasta, celin lacag, baabi'in, iyo wax ka beddel. Halkan waa sababta ay muhiim u tahay iyo sida loo isticmaalo.",
    keywords: [
      'diiwaanka hubinta POS',
      'log-ga hubinta macaamil-dhaqaaleedka',
      'diiwaan aan la beddeli karin',
      'waafiqidda POS',
      'diiwaanka hubinta tafaariiqda',
      'taariikhda macaamil-dhaqaaleedka POS',
      'hubinta HMRC POS',
    ],
    keyTakeaways: [
      "Ficil kasta oo ka dhaca AskBiz POS — iibabka, celinta lacagta, baabi'inta, wax ka beddelka qiimaha, isbedelka shaqaalaha — waxaa lagu diiwaan geliyaa diiwaanka hubinta ee aan la beddeli karin.",
      "Diiwaanka hubinta wuxuu kaa ilaaliyaa xilliga baaritaannada HMRC, baaritaannada khiyaanada, iyo khilaafaadka macaamiisha.",
      "Waad raadin, kala saari, oo soo dejin kartaa xogta diiwaanka hubinta muddo taariikheed kasta.",
    ],
    content: [
      {
        heading: 'Waxa diiwaanka hubinta yahay iyo sababta uu muhiim u yahay',
        body: "Diiwaanka hubinta waa diiwaan taariikhi ah oo dhacdo kasta oo ka dhacda nidaamkaaga POS. AskBiz, tan waxaa ka mid ah iibabka, celinta lacagta, baabi'inta, wax ka beddelka qiimaha, isticmaalka qiimo-dhimista, wax ka beddelka kaydka, gelitaanka shaqaalaha, isbedelka doorka, iyo isbedelka dejinta. Gelitaan kasta wuxuu diiwaan geliyaa waxa dhacay, goorta ay dhacday, iyo qofka sameeyay. Diiwaanka lama beddeli karo — gelitaannada lama tirtiri karo lamana beddeli karo, xitaa milkiilaha xisaabta. Tan waxay muhiim u tahay saddex sabab. Marka hore, waafiqidda: HMRC waxay codsan kartaa diiwaanadaada macaamil-dhaqaaleedka xilli baaritaan VAT ah, diiwaan hubin oo aan jabin oo aan la beddeli karin ayaa ah caddaymaha ugu sarreeya. Labaad, ka hortagga khiyaanada: haddii qof uu qabanayo celin lacag oo been abuur ah ama wax ka beddelayo qiimaha si aan habboonayn, diiwaanka hubinta ayaa taas soo bandhigi doona. Saddexaad, xallinta khilaafaadka: marka macmiil uu sheegto in lacag dheeraad ah laga qaaday ama uusan helin alaab, diiwaanka hubinta ayaa ku siin doona xaqiiqooyinka aad ku xallin karto xaalada si cadaalad ah oo degdeg ah.",
      },
      {
        heading: 'Waxa lagu diiwaan geliyo AskBiz POS',
        body: "AskBiz wuxuu diiwaan geliyaa in ka badan macaamil-dhaqaaleedyada oo keliya. Halkan waa liis aan buuxin ahayn oo ka kooban dhacdooyinka lagu qabto diiwaanka hubinta. Iibabka: alaab kasta oo la iibiyay, qiimaha, tirada, VAT-ka, habka lacag-bixinta, shaqaalaha, iyo taariikhda. Celinta lacagta iyo baabi'inta: tixraaca macaamil-dhaqaaleedka asalka ah, lacagta la celinayo, sababta, iyo shaqaalaha ansixiyay. Wax ka beddelka qiimaha: qiimaha asalka ah, qiimaha la beddelay, iyo sababta. Qiimo-dhimista: nooca qiimo-dhimista (boqolkiiba ama qiime go'an), lacagta, iyo in loo dabaqay alaab ama dambiilka oo dhan. Wax ka beddelka kaydka: alaabta, tirada hore, tirada cusub, iyo sababta wax ka beddelka. Dhacdooyinka shaqaalaha: gelitaanka, ka bixista, isbedelka doorka, iyo martiqaadyada shaqaale cusub. Isbedelka dejinta: dejinta rasiidka, heerarka digniinta, iyo isbedelka habka lacag-bixinta. Gelitaan kasta wuxuu ka kooban yahay taariikh la calaamadeeyay ilaa ilbiriqsiga iyo aqoonsiga isticmaalaha sameeyay ficilka.",
      },
      {
        heading: 'Sida loo isticmaalo diiwaanka hubinta',
        body: "Diiwaanka hubinta waa laga heli karaa qaybta Warbixinnada ee AskBiz POS. Waad kala saari kartaa taariikh, nooca dhacdada, shaqaalaha, ama alaabta. Isticmaalka caadiga ah waxaa ka mid ah baaritaanka farqiga kaashka (kala saar taariikh oo raadi baabi'in, celin lacag, iyo wax ka beddelka qiimaha), dib u eegista howlaha shaqaale (kala saar aqoonsiga shaqaalaha si aad u aragto ficil kasta oo ay qaadeen), iyo diyaarinta baaritaan canshuureed (soo dejii diiwaanka buuxa ee xilliga khuseeya). Shaqada raadinta ayaa kuu ogolaanaysa inaad hesho macaamil-dhaqaaleed gaar ah lacagta, magaca alaabta, ama aqoonsiga macaamil-dhaqaaleedka. Maalinlaha, kala sooca ugu qiimaha sarreeya waa 'exceptions' — dhacdooyin ka baxsan qaababka caadiga ah, sida qiimo-dhimis aad u weyn, celin lacag oo ka sarreeya heerka, ama baabi'in xilliga aan la kormeerin. AskBiz wuxuu si toos ah u soo saari karaa kala-soocyadan, kaa badbaadinaya dib u eegista gacanta ee boqolaal macaamil-dhaqaaleed oo caadi ah si aad u hesho dhawrka mudan feejignaan.",
      },
      {
        heading: 'Diiwaanka hubinta iyo waafiqidda HMRC',
        body: "Haddii HMRC uu sameeyo hubin waafiqid ganacsigaaga, waxay rabi doonaan inay arkaan diiwaanadaada macaamil-dhaqaaleedka. Shuruudaha gaarka ah waxay ku xiran yihiin xaaladdaada, laakiin guud ahaan HMRC waxay filaysaa diiwaanno dhijitaal ah oo dhammaan iib iyo iibsi ah, VAT-kana si cad loogu muujiyay. Diiwaanka hubinta ee AskBiz wuxuu si buuxda u buuxinayaa shuruudahan. Macaamil-dhaqaaleed kasta waa dhijitaal, taariikh la calaamadeeyay, VAT faahfaahsan, xiriirna la leh habka lacag-bixinta. Celinta lacagta iyo baabi'intu waxay ku diiwaan gashan yihiin sababo iyo ansixin. Wax ka beddelka kaydka waa la sharaxaa. Xogta waxaa lagu soo saari karaa qaababka caadiga ah (CSV, Excel) si loogu gudbiyo ama loo eego. Heerka faahfaahintan ma aha oo kaliya buuxinaya shuruudaha waafiqidda — waxay ka dhigaysaa ganacsigaaga mid la aamini karo. Diiwaan hubin oo si wanaagsan loo hayo, aan la beddeli karin, ayaa u sheegaysa HMRC inaad si dhab ah ula dhaqmayso hab-dhaqanka diiwaanka, taasoo ka dhigi karta baaritaannada kuwo gaaban oo aan khilaaf lahayn.",
      },
    ],
    faq: [
      {
        q: 'Ma tirtiri karaa gelitaanno ka mid ah diiwaanka hubinta?',
        a: "Maya. Diiwaanka hubinta uma dhisna in la beddelo. Gelitaannada lama tafatiran karo lamana tirtiri karo, xitaa milkiilayaasha xisaabta. Tani waxay ilaalinaysaa daacadnimada diiwaanadaada.",
      },
      {
        q: 'Ilaa intee ayay diiwaanka hubinta dib u socon karaa?',
        a: 'AskBiz wuxuu haynayaa diiwaankaaga hubinta buuxa intii xisaabtaadu firfircoon tahay. HMRC waxay ganacsiyada ka rabtaa inay diiwaanada haystaan ugu yaraan lix sano, AskBiz-na wuxuu ka badan yahay shuruudan.',
      },
    ],
  },

  'pos-30-day-export': {
    title: 'Soo Dejinta 30 Maalmood oo Xog POS ah oo loogu talagalay Xisaabiyahaaga',
    description:
      "Ma u baahan tahay inaad xogtaada POS u dirto xisaabiyahaaga? AskBiz POS wuxuu kuu ogolaanayaa inaad soo dejiso 30 maalmood oo xog macaamil-dhaqaaleed ah ilbiriqsiyo gudahood — halkan waa sida.",
    keywords: [
      'soo dejinta xogta POS',
      'soo dejinta macaamil-dhaqaaleedka POS',
      'xogta xisaabiyaha POS',
      'soo dejinta 30 maalmood',
      'soo dejinta CSV POS',
      'soo dejinta warbixinta POS',
      'soo dejinta xogta iibka POS',
    ],
    keyTakeaways: [
      "AskBiz POS wuxuu kuu ogolaanayaa inaad soo dejiso ilaa 30 maalmood oo xog macaamil-dhaqaaleed ah, qaabka CSV ama Excel, dhawr taabasho gudahood.",
      "Soo dejintu waxay ka kooban tahay iib, celin lacag, iyo baabi'in kasta oo jajabinta VAT-ka oo buuxda leh — waxa uu xisaabiyahaagu u baahan yahay oo dhan.",
      'Soo dejinta joogtada ah ayaa dhisaha xisaabaadka, soo-celinta VAT, iyo xisaabaadka sannad-dhammaadka ka dhigaysa mid aad u fudud.',
    ],
    content: [
      {
        heading: 'Sababta soo dejinta joogtada ah muhiim u tahay',
        body: "Xitaa nidaam POS oo si fiican loo maareeyo, xisaabiyahaagu wuxuu u baahan yahay xogta asalka ah. Waxay isbarbardhigaan macaamil-dhaqaaleedyadaada POS oo ka soo horjeeda xisaabaadka bangigaaga, waxay diyaariyaan soo-celinta VAT-kaaga, waxayna ururiyaan xisaabaadka sannad-dhammaadka. Sida ugu fudud ee aad xisaabiyahaaga u hesho xog macaamil-dhaqaaleed oo saafi ah oo faahfaahsan, ayaa ka dhigaysa waqti ka yar (iyo lacag ka yar oo kaa qaado). Tafaariiq-ganacsato badan ayaa wali xisaabiyahooda siiya bac warqado rasiid ah iyo koob gacan lagu qoray, saddex-biloodle kasta. Tani waxay keentaa saacado gelitaan gacan ah, qaladaad aan laga maarmin, iyo biil sarreeya. AskBiz POS, waxaad soo dejin kartaa xog buuxda oo ka kooban macaamil-dhaqaaleed kasta — oo leh taariikho, lacago, jajabinta VAT, habab lacag-bixineed, iyo faahfaahinta celinta — daqiiqad gudaheed. Xisaabiyahaagu wuxuu helayaa waxa uu u baahan yahay, adiguna waad kaydinaysaa lacag, tirooyinkuna waa saxsan yihiin.",
      },
      {
        heading: 'Waxa soo dejintu ay ka kooban tahay',
        body: "Soo dejinta xogta AskBiz POS waxay ka kooban tahay macaamil-dhaqaaleed kasta oo la geliyay muddadaada la doortay. Iib kasta, soo dejintu waxay diiwaan gelisaa taariikhda iyo waqtiga, aqoonsiga macaamil-dhaqaaleedka, alaabta la iibiyay (qiimaha iyo tirada gaarka ah), qiimo-dhimista la dabaqay, heerka VAT iyo lacagta alaab kasta, wadarta guud ee net, wadarta VAT, wadarta guud, habka lacag-bixinta, iyo shaqaalaha geliyay iibka. Celinta lacagta iyo baabi'intu waxaa loo taxaa gooni, iyagoo tixraacaya macaamil-dhaqaaleedyada asalka ah, taasoo u fududaynaysa xisaabiyahaaga inuu dib u eego. Soo dejintu waxay sidoo kale ka kooban tahay xaashi soo koobid ah oo leh wadarro: wadarta dakhliga (net iyo guud), wadarta VAT la ururiyay, wadarta celinta lacagta, wadarta qiimo-dhimista, iyo tirada macaamil-dhaqaaleedyada habka lacag-bixinta kasta. Soo koobiddan waa waxa xisaabiyahaagu u baahan yahay xisaabaadka joogtada ah; faahfaahinta khadka-khad ayaa jirta dib u eegis dheeraad ah ama haddii HMRC ay su'aalo weydiiso.",
      },
      {
        heading: 'Sida loo qabsado soo dejin',
        body: "AskBiz POS, aad Warbixinnada, ka dibna taabo Soo Dejinta Xogta. Dooro muddadaada — waxaad dooran kartaa muddo kasta oo laga bilaabo hal ilaa 30 maalmood. Ganacsiyada intooda badan, soo dejin billood kasta (oo ka koobantahay bisha kalandarka) ayaa si fiican u shaqaysa. Dooro qaabkaaga: CSV waa mid caalami ah oo la fur karo Excel, Google Sheets, ama software xisaabaad. Qaabka Excel wuxuu ka kooban yahay qaabaynta iyo xaashida soo koobidda. Taabo Soo Dejin, faylkuna wuxuu soo saarmaa ilbiriqsiyo gudahood. Waxaad si toos ah ugu soo dejin kartaa qalabkaaga, email ugu diri kartaa naftaada, ama la wadaagi kartaa xisaabiyahaaga hab kasta oo aad caadiyahay u isticmaasho. Haddii xisaabiyahaagu doorbido qaab ama nooc kale, CSV-ku waa mid dabacsan oo lagu bedeli karo software xaashi kasta. Isticmaalayaal AskBiz qaar ayaa dejiya xasuusin billood kasta si ay xogta u soo dejiyaan bisha kasta bilaheeda, taasoo daboolaysa ganacsiga bisha hore.",
      },
      {
        heading: 'Talooyin loogu talagalay dhiibitaan wanaagsan oo la xisaabiyahaaga',
        body: "Waxaa jira dhawr wax caadi ah oo ka dhigaya soo dejinta xogta mid ka sii qiimo badan. Marka hore, joogto ku ahow jadwalka soo dejintaada. Soo dejinno bil kasta oo la jaan qaadaya xilliyada VAT-kaaga ayaa wax kasta si fiican u kaydiya. Labaad, calaamadi si cad faylashaada — 'AskBiz-POS-Janaayo-2026.csv' ayaa ka wanaagsan 'export(3).csv'. Saddexaad, ku dar qoraal gaaban soo dejin kasta oo sheegaya wax kasta oo aan caadi ahayn: celin lacag oo weyn, wax ka beddel kayd ah oo saameynaya kharashka alaabta la iibiyay, ama isbedel heerka VAT. Afraad, haddii xisaabiyahaagu isticmaalo software gaar ah (Xero, QuickBooks, FreeAgent), weydii doorbidiisa qaabka soo dejinta — AskBiz mararka qaarkood waxaa laga yaabaa inuu horeba u soo dejiyo qaab la waafaqsan. Ugu dambeyntii, hay nuqul lagu kaydiyay meel gaar ah oo aad leedahay soo dejin kasta. Inkastoo AskBiz uu si ammaan ah xogtaada ugu kaydiyo daruuraha, haynta nuqul gaar ah oo qalabkaaga ku yaal ayaa ku siinaya lakab dheeraad ah oo ilaalin ah, taasoo macnaheedu yahay had iyo jeer waad dib u diri kartaa xogta haddii loo baahdo.",
      },
    ],
    faq: [
      {
        q: 'Ma soo dejin karaa in ka badan 30 maalmood mar keliya?',
        a: 'Soo dejinta caadiga ahi waxay daboolaysaa ilaa 30 maalmood. Muddooyinka ka dheer, samee dhawr soo dejin ama la xiriir taageerada si aad u hesho xog dheeraad ah oo gaar ah.',
      },
      {
        q: 'Soo dejintu ma la waafaqsan tahay Xero iyo QuickBooks?',
        a: 'Soo dejinta CSV waxaa loo geli karaa software xisaabaad badan, oo ay ku jiraan Xero iyo QuickBooks. Hubi hage-soo-dejinta software-kaaga shuruudo qaabaynta gaar ah.',
      },
    ],
  },

  'pos-multi-staff-performance': {
    title: 'Cabbirrada Waxqabadka Shaqaalaha: Iibka Keeshiye kasta, Dakhliga Doorka kasta',
    description:
      "La socoso shaqaalaha ugu iib badan, dakhliga ugu sarreeya soo saara, iyo kuwa qaladka ugu yar geliya — dhammaan boortada AskBiz POS.",
    category: '',
    keywords: [
      'waxqabadka shaqaalaha POS',
      'iibka keeshiye kasta',
      'dakhliga shaqaale kasta',
      'cabbirrada shaqaalaha POS',
      'waxqabadka shaqaalaha tafaariiqda',
      'la socodka waxqabadka keeshiye',
      'KPI tafaariiqda shaqaalaha',
    ],
    keyTakeaways: [
      "AskBiz POS wuxuu u nisbeeyaa macaamil-dhaqaaleed kasta shaqaalihii geliyay, taasoo suurtagelinaysa la socodka waxqabadka shaqaale kasta.",
      "Cabbirrada muhiimka ah waxaa ka mid ah macaamil-dhaqaaleedyada saacadda, celceliska qiimaha macaamil-dhaqaaleedka, heerka celinta lacagta, iyo wadarta dakhliga shaqaale kasta.",
      'Xogta waxqabadka shaqaalaha waxay kaa caawisaa jadwalinta shiftiyada, aqoonsiga baahida tababarka, iyo abaalmarinta kuwa ugu wanaagsan.',
    ],
    content: [
      {
        heading: 'Sababta la socodka waxqabadka shaqaalaha muhiim u yahay',
        body: "Ganacsi hal-qof ah, waad ogtahay sida ay tahay waxqabadkaagu si sax ah. Isla marka aad shaqaale ku darto, muuqaalku wuu dhinta. Waad ogtahay tirooyinka guud ee dukaanka, laakiin ma ogid qofka geeyay maxaa. Xog waxqabad gaar ah oo aan la haysan, ma awoodi doontid inaad ka jawaabto su'aalaha muhiimka ah: Ma diyaar u yahay shaqaalaha cusub? Miyuu hal keeshiye si joogto ah uga sii wanaagsanaa iibinta mid kale — haddii ay tahay sidaas, maxay kala duwan yihiin? Heerarka celinta lacagta miyaa ka sarreeya shiftiyada qaar? AskBiz POS wuxuu ka jawaabaa dhammaan kuwan isagoo u nisbeeya macaamil-dhaqaaleed kasta shaqaalihii geliyay. Waqti ka dib, tani waxay dhistaa sawir faahfaahsan oo qofka kasta wax ku darsigiisa. Xogtu maaha kormeer — waa fahamka kooxdaada, aqoonsiga xoogagga la nuqul qaado, aqoonsiga farqiga looga baahan yahay, iyo qaadashada go'aamo caqli gal ah oo ku saabsan jadwalinta, tababarka, iyo abaalmarinta.",
      },
      {
        heading: 'Cabbirrada muhiimka ah ee AskBiz ay la socoto shaqaale kasta',
        body: "AskBiz POS wuxuu diiwaan geliyaa dhawr cabbir waxqabad oo shaqaale kasta. Wadarta dakhliga waa tan ugu sahlan — intee in le'eg ayuu qofkani ku geliyay kaashka? Laakiin mar walba maaha tan ugu muhiimsan. Macaamil-dhaqaaleedyada saacadda waxay cabbiraan xawaaraha shaqada — keeshiye qabta soddon macaamil-dhaqaaleed saacaddiiba wuxuu safka ka nadiifinayaa si ka dheereysa mid qabta shan iyo toban. Celceliska qiimaha macaamil-dhaqaaleedka (ATV) wuxuu muujinayaa kuma iibinaya dambiillo qiimo sarreeya, taasoo tilmaami karta iibin wax-ku-dar oo waxtar leh. Heerka celinta lacagta shaqaale kasta wuxuu muujinayaa dhibaatooyin tababareed suurtagal ah ama, xaalado dhif ah, khiyaano. Heerka qiimo-dhimista shaqaale kasta wuxuu muujinayaa qofka isticmaala qiimo-dhimista iyo intee jeer. Alaabta macaamil-dhaqaaleed kasta ayaa muujinaya cabbirka dambiilka. AskBiz wuxuu ku bandhigaa cabbirradan boortada saafiga ah, isagoo isbarbardhigaya shaqaalaha taariikh la doortay kasta. Waxaad ku eegi kartaa xogta maalin, toddobaad, ama bil kasta.",
      },
      {
        heading: 'Isticmaalka xogta waxqabadka si wax-dhis ah',
        body: "Isticmaalayaasha AskBiz ee ugu guulaha badan waxay xogta waxqabadka shaqaalaha u arkaan qalab tababareed, ma ahan ul lagu qaboojiyo. Haddii ATV keeshiye uu si joogto ah uga sarreeyo 30% celceliska, gal xogta si aad u fahanto sababta. Miyay ku talinayaan alaab isku dheelli ah? Miyay macaamiisha ku salaamayaan hab dhiirigaliya isla-eegis? La wadaag dabeecadahan kooxda. Haddii heerka celinta lacagta keeshiye uu aad u sarreeyo, hore u samee wada hadal taageero ah ka hor intaanad u malaynin ugu xumaanta — waxay laga yaabaa inay maareynayaan celinta shiftiyada shaqaale kale, ama waxaa jiri kara dhibaato tayo alaab ah oo ku saabsan alaabta ay ugu badan iibiyaan. Go'aamada jadwalinta, xogta waxqabadku waa qiimo weyn leedahay. Jadwalso iibiyayaashaada ugu xoogga badan saacadaha ganacsiga ugu sarreeya. Haddii xubin cusub oo koox ah ay leedahay xawaare hoose, isla iyada iyo keeshiye khibrad leh shiftiyada mashquulka ah, halkii aad kaligeed uga tagi lahayd rushka Sabtida.",
      },
      {
        heading: 'Sirta shaqsiyeed, caddaaladda, iyo tixgelinta sharciga',
        body: "La socodka waxqabadka shaqaalaha wuxuu kiciyaa su'aalo sax ah oo ku saabsan sirta shaqsiyeed iyo caddaaladda. UK, waxaa lagaa rabaa inaad shaqaalaha u sheegto xogta aad ka ururiso oo ku saabsan iyaga iyo sida loo isticmaalo. Tani waa in lagu daboolo qandaraaska shaqadooda ama buugga shaqaalaha. AskBiz wuxuu la socdaa cabbirro la xiriira shaqada muddo shaqada — ma kormeerto waxqabad shaqsiyeed, goobta, ama wax kasta oo ka baxsan nidaamka POS. La furfuran kooxdaada waxa ka mid ah cabbirrada aad dib u eegto iyo sababta. Tafaariiq-ganacsato badan ayaa si furan u wadaagta boortada waxqabadka, taasoo abuurta dhaqan xisaab-celin caafimaad leh halkii ay noqon lahayd kormeer qarsoodi ah. Haddii aad xogta waxqabadka u isticmaasho go'aan shaqo (sida shaqo ka saarid ama sare u qaadid), hubi in go'aamadaas ay yihiin kuwo joogto ah, la qoray, waxayna ku salaysan yihiin muunad cadaalad ah oo xog ah, ma ahan hal maalin oo xun. AskBiz wuxuu hayaa xogta waxqabadka shaqaalaha intii xisaabtu firfircoon tahay, laakiin waad ku aqoonsan la'aan garayn kartaa xogta shaqaalihii hore sida siyaasaddaada haynta xogta.",
      },
    ],
    faq: [
      {
        q: 'Shaqaalihu ma arki karaan cabbirradooda waxqabad naftooda?',
        a: 'Maareeyayaasha iyo Milkiillayaashu waxay arki karaan dhammaan cabbirrada shaqaalaha. Keeshiyayaashu waxay arki karaan tirada macaamil-dhaqaaleedka iyo dakhliga maalinta, laakiin xogta isbarbardhigga ee shaqaalaha kale ma arki karaan.',
      },
      {
        q: 'AskBiz ma darajeeyaa shaqaalaha?',
        a: 'AskBiz wuxuu bandhigaa xogta si isbarbardhig ah laakiin ma abuurin darajeyn rasmi ah. Sida aad u fasirto oo u sheegto xogta waa go\'aankaaga adiga oo ah milkiilaha ganacsiga.',
      },
    ],
  },

  'pos-security-best-practices': {
    title: 'Ammaanka POS: Ilaalinta Macaamil-dhaqaaleedyada iyo Xogta Macaamiisha',
    description:
      "POS-kaagu wuxuu maareeyaa lacag iyo xogta macaamiisha maalin kasta. Halkan waa hab-dhaqannada ammaanka ugu wanaagsan ee tafaariiq-ganacsade yaru kasta ay tahay inuu raaco.",
    keywords: [
      'ammaanka POS',
      'ilaalinta xogta tafaariiqda',
      'ka hortagga khiyaanada POS',
      'nidaamka POS ee ammaan ah',
      'GDPR POS',
      'ammaanka lacag-bixinta tafaariiqda',
      'hab-dhaqannada ugu wanaagsan ee ammaanka POS',
    ],
    keyTakeaways: [
      "Oggolaanshaha shaqaalaha oo xooggan, gelitaanka xiriirka hal-mar ah, iyo gelitaanka ku salaysan doorka ayaa ah difaacaaga ugu horreeya ee ammaanka POS.",
      "AskBiz POS wuxuu xogta ku kaydiyaa infrastructure daruuraha ah oo la sirdoonaystay — xog xasaasi ah kuma jirto qalabkaaga gudaha.",
      'Dib u eegista joogtada ah ee diiwaanadaha hubinta, qaababka celinta lacagta, iyo diiwaanada gelitaanka ayaa kaa caawinaya inaad qabsato dhibaatooyinka ka hor inta aysan qaali noqon.',
    ],
    content: [
      {
        heading: 'Saddexda tiir ee ammaanka POS',
        body: "Ammaanka POS wuxuu ku salaysan yahay saddex tiir: xakamaynta gelitaanka, ilaalinta xogta, iyo la socodka. Xakamaynta gelitaanku waxay ka dhigan tahay in la hubiyo in kaliya dadka la ansixiyay ay isticmaali karaan nidaamka, iyo in qof kasta uu kaliya samayn karo waxa doorkiisu u baahan yahay. Oggolaanshaha AskBiz ee ku salaysan doorka (Milkiile, Maareeye, Keeshiye) iyo gelitaanka xiriirka hal-mar ah ayaa si buuxda u xakameeya arrintan. Ilaalinta xogtu waxay ka dhigan tahay in la hubiyo xogta macaamil-dhaqaaleedka, macluumaadka macaamiisha, iyo diiwaanada dhaqaale si ammaan ah loo kaydiyo oo si ammaan ah loo gudbiyo. AskBiz wuxuu dhammaan xogta ku kaydiyaa infrastructure daruuraha ah oo la sirdoonaystay isagoo isticmaalaya qaacidooyin heer-caalami ah — xogta waa la sirdoonaystaa marka la gudbinayo (marka u dhaqaaqayso qalabkaaga iyo server-ka) iyo marka la kaydinayo (marka server-ka lagu kaydiyo). Xog macaamil-dhaqaaleed oo xasaasi ah oo joogto ah kuma jirto qalabkaaga gudaha. La socodku waxay ka dhigan tahay inaad ilaaliso waxa nidaamka ka dhacaya oo aad si hore ugu aqoonsato wax aan caadi ahayn. Diiwaanka hubinta ee AskBiz wuxuu bixiyaa xogta asalka ah; digniinaha kala-soocidu waxay muujiyaan dhacdooyinka mudan baaritaan.",
      },
      {
        heading: 'Ka ilaalinta khataraha gudaha',
        body: "Runta aan raaxada lahayn waa in khiyaanada POS-ka ugu badan ee tafaariiqda yaru lagu sameeyo shaqaale, ma ahan weerarayaal dibadeed. Celinta lacagta been abuurka ah, heshiisyada 'sweetheart' (siinta saaxiibbo alaab bilaash ah ama qiimo-dhimis leh), 'skimming' (qaadista lacagta oo baabi'inta macaamil-dhaqaaleedka), iyo xayirida waqtiga ayaa ah qaababka ugu badan. AskBiz waxay ku yareysaa tan iyadoo adeegsanaysa dhowr qalab. Xaddidida celinta lacagta iyo baabi'inta ilaa Maareeyayaasha iyo Milkiillayaasha ayaa ka saaraysa habka ugu weyn ee khiyaanada heerka keeshiye. Diiwaanka hubinta ee aan la beddeli karin wuxuu abuuraa xisaab-celin — ficil kasta waxaa lagu diiwaan geliyaa qof la magacaabay. Digniinaha kala-soocidu waxay calaamadeeyaan qaababka aan caadiga ahayn, sida kordhinta celinta lacagta ama heer qiimo-dhimis aan caadi ahayn shiftiga gaar ah. Qalabka isku-dheelitirka lacagta wuxuu isbarbardhigaa lacagta la filayo ee kaashka (ku salaysan diiwaanada POS) lacagta dhabta ah ee la tiriyay, isagoo si degdeg ah u muujiya farqiga. Ka hortagga ugu waxtarka badan, si fudud, waa in shaqaalaha lagu sheego in xakamaynahan ay jiraan. Marka dadku ogaadaan ficiladooda in la raadraacayo oo la eegayo, badankoodu waligood ma fikireen inay dhaqan-daacadaro fasho.",
      },
      {
        heading: 'Ilaalinta xogta macaamiisha iyo waafiqidda GDPR',
        body: "Haddii aad ururiso xog macaamiil kasta oo POS-kaaga ah — lambarada telefoonka rasiidyada WhatsApp, ciwaannada email-ka rasiidyada dhijitaalka ah, ama magacyada macaamiisha barnaamijyada daacadnimada — GDPR ayaa kula xiriirta. Mabaadi'da ugu muhiimsan waa: ururi oo kaliya waxa aad u baahan tahay, u sheeg macaamiisha waxa aad ururineyso iyo sababta, si ammaan ah u kaydi, oo tirtir marka aanay ka baahnayn. AskBiz wuxuu qabtaa dhinaca farsamada ee kaydinta ammaan iyo sirdoonaynta. Mas'uuliyadaadu waa dhinaca siyaasadda: soo bandhig ogeysiis sir ah dukaankaaga ama website-kaaga, hubi inaad haysato salka sharciga ah ee habaynta nooc kasta oo xog ah (guud ahaan 'danaha sharciga ah' rasiidka gudbinta iyo 'oggolaanshaha' isgaarsiinta suuqgeynta), oo ka jawaab codsiyada gelitaanka ama tirtirida xogta macaamiisha bil gudaheed. AskBiz wuxuu kuu ogolaanayaa inaad raadiso oo soo dejiso dhammaan xogta lagu haysto macmiil gaar ah, taasoo fududaynaysa ka jawaabista Codsiyada Gelitaanka Mawduuca.",
      },
      {
        heading: 'Ammaanka jireed ee qalabka POS',
        body: "Ammaanka software-ku waa kaliya nuska sawirka. Qalabkaaga POS — telefoon, tablet, ama terminal — wuxuu sidoo kale u baahan yahay ilaalin jireed. Haddii qof uu xado tablet-kaaga, wuxuu suurtagal u yahay inuu helo gelitaanka nidaamkaaga POS (haddii uu weli galay) iyo xog kasta oo gudaha ku kaydsan. Halkan waa tallaabooyin dhabta ah oo yareeya khatarahan. Marka hore, dami xiritaanka qalabka — u baahan PIN, faraha, ama aqoonsiga wejiga si loo furo qalabka. Labaad, dejii wakhtiga fasax ee AskBiz si POS-ku si toos ah u baxo marka aan waxba dhicin muddo. Saddexaad, haddii qalab la xado, si degdeg ah uga saar qalab la ansixiyay dejinta AskBiz oo bedel aqoonsiyada la wadaagay. Afraad, waligaa ha ka tegin qalabka POS meel bulsho ah adigoo aan la joogin. Xilliga ganacsiga, qalabku waa inuu ku jiraa aragga iyo gaarsiinta shaqaale had iyo jeer. Kadib xilliga shaqada, si ammaan ah u kaydi. Tallaabooyinkan waa kuwo fudud laakiin waxtar leh — xadgudubka jireed ee POS-ka intiisa badan waa fursad la helay, tallaabooyinka aasaasiga ahna waxay ka saaraan fursadda.",
      },
    ],
    relatedSlugs: [],
    faq: [
      {
        q: 'AskBiz POS ma waafaqsan tahay PCI DSS?',
        a: "AskBiz POS ma habeeyo lacag-bixinno kaadhka si toos ah — terminal-ka kaadhkaagu ayaa taas qabta. Tani waxay ka dhigan tahay in AskBiz laftiisu ka baxsan yahay baaxadda PCI DSS. Si kastaba ha ahaatee, habaynta xogta AskBiz waxay la jaan qaadaan hab-dhaqannada ammaanka ugu wanaagsan ee nidaam kasta oo diiwaan geliya macluumaadka habka lacag-bixinta.",
      },
      {
        q: 'Maxaan sameeyaa haddii aan ka shakiyo khiyaano POS oo shaqaale ah?',
        a: "Dib u eeg diiwaanka hubinta caddaymo, iyadoo diiradu saarnaato celinta lacagta, baabi'inta, wax ka beddelka qiimaha, iyo farqiga lacagta. Haddii aad hesho caddaymo khiyaano ah, la xaajoowga taliyahaaga sharciga ka hor intaadan qaadin tallaabo edbin ah si aad u raacdo hababka habboon.",
      },
    ],
  },

  'pos-pwa-mobile-setup': {
    title: 'Dejinta AskBiz POS Mobile: Hage Rakibidda PWA',
    description:
      "AskBiz POS wuxuu u shaqeeyaa sida App Web Horumarsan (PWA) telefoon ama tablet kasta oo casri ah. Halkan waa sida loo rakibo si aad u hesho khibradda ugu wanaagsan.",
    keywords: [
      'dejinta PWA POS',
      'rakibidda POS mobile',
      'AskBiz PWA',
      'app web horumarsan POS',
      'POS telefoon',
      'rakibidda POS tablet',
      'dejinta iibka meesha ee mobile-ka',
    ],
    keyTakeaways: [
      "AskBiz POS wuxuu u shaqeeyaa sida App Web Horumarsan — ku rakib shaashada guriga si aad u hesho khibrad la mid ah app dabiici ah la'aan bakhaar app.",
      'Rakibidda PWA waxay qaadataa in ka yar laba daqiiqo labadaba iOS iyo Android.',
      'Marka la rakibo, AskBiz POS wuxuu u shaqeeyaa shaashad buuxda, wuxuu taageeraa habka offline, wuxuuna ka bilaabmaa isla markiiba shaashadaada guriga.',
    ],
    content: [
      {
        heading: 'Waa maxay App Web Horumarsan (PWA)?',
        body: "App Web Horumarsan waa website u dhaqma sida app dabiici ah. Marka aad ku rakibto PWA shaashadaada guriga, waxay heshaa sawirkeeda gaarka ah, waxay ku furataa shaashad buuxda (adoo aan lahayn baarka cinwaanka browser-ka), way si degdeg ah u soo shubantaa, xitaa waxay u shaqayn kartaa offline. Kama soo dejisid App Store ama Google Play — waxaad si toos ah uga rakibtaa browser-ka. Habkani wuxuu leeyahay faa'iidooyin muhiim ah nidaam POS. Cusboonaysiintu waxay dhacdaa si toos ah — mar kasta oo aad furto app-ka, waxaad hesho nooca ugu dambeeya adigoo aan waxba soo dejin. Ma jiro hab dib-u-eegis app ah oo hakinaya sii deynta astaamaha. Wuxuu u shaqeeyaa qalab kasta oo leh browser casri ah, sidaas darteed kuma xidhna nidaam hawlgal gaar ah. Sababtoo ah AskBiz POS waa PWA, waxaad ku bilaabi kartaa qalab cusub daqiiqado gudahood, taasoo aad u qiimo badan tahay haddii qalabkaaga aasaasiga ahi jabo shift-ka dhexdiisa oo aad u baahan tahay beddelaad degdeg ah.",
      },
      {
        heading: 'Rakibidda Android',
        body: "Fur Chrome (ama browser kasta oo Chromium ku salaysan) telefoonkaaga ama tablet-kaaga Android. U gudub URL-ka AskBiz POS oo geli xisaabtaada. Chrome wuxuu muujin doonaa banner ama ogeysiis soo jeedinaya inaad rakibto app-ka — taabo isla markaana raac talooyinka. Haddii banner-ku aanu muuqan, taabo menu-ga saddexda dhibcood ee geeska sare-midig, dooro 'Add to Home screen' ama 'Install app'. Astaanta AskBiz waxay ku muuqataa shaashadaada guriga isla markiiba. Marka aad taabato, POS-ku wuxuu ku furmaa shaashad buuxda, aan laga garan karin app dabiici ah. Rakibiddu waxay qaadataa meel kaydin oo yar sababtoo ah inta badan xogta app-ka waxaa lagu kaydiyaa daruuraha. Marka la rakibo, AskBiz wuxuu si gaar ah u kaydin doonaa agabka aasaasiga ah gudaha, taasoo macnaheedu yahay app-ku wuu soo shubmaa xitaa xiriirro gaabis ah, waxaana suurtagal ah shaqada iibinta aasaasiga ah offline.",
      },
      {
        heading: 'Rakibidda iOS (iPhone iyo iPad)',
        body: "Fur Safari iPhone-kaaga ama iPad-kaaga — tani waa muhiim sababtoo ah iOS wuxuu kaliya taageeraa rakibidda PWA Safari, ma ahan Chrome ama browser-yo kale. U gudub URL-ka AskBiz POS oo geli. Taabo badhanka Wadaagida (labajibbaaraha leh fallaarta kor u jeedda) ee hoose shaashadda. Hoos u dhaadhac oo taabo 'Add to Home Screen'. Sii magac gaaban (default-ka 'AskBiz POS' wuu fiicanyahay) oo taabo Add. Astaantu waxay ku muuqataa shaashadaada guriga. Marka aad furto, AskBiz POS wuxuu ku shaqeeyaa shaashad buuxda. Ogow in PWA-yada iOS ay leeyihiin xaddid yar marka la barbardhigo Android — ogeysiisyada riixista digniinaha kaydka ayaa laga yaabaa inay si kala duwan u dhaqmaan, app-kuna mararka qaarkood wuxuu u baahan yahay dib u soo shubid ka dib muddo aan la isticmaalin. Kuwan waa xaddidaad heer-iOS ah, ma ahan xaddidaadyo AskBiz, Apple-na wuxuu horumarinayaa taageerada PWA nooc iOS kasta.",
      },
      {
        heading: 'Hagaajinta qalabkaaga isticmaalka POS',
        body: "Marka AskBiz POS la rakibo, dhowr wax ka beddel heer-qalab ah ayaa hagaajiya khibradda. Marka hore, dami xiritaanka toos ah ama dejin wakhti dheer — shaashad POS oo mugdiyaysa 30 ilbiriqsi kasta waa qas xilliga shift-ka mashquulka ah. Dejii xiritaanka toos ah shan ama toban daqiiqo, ama joojii gebi ahaanba xilliga ganacsiga (kaliya xasuuso inaad gacan ku xidhid marka aan la joogin). Labaad, hagaaji nuurka shaashadda heer ku habboon. Nuur aad u sarreeya wuxuu si dhaqso ah u dhammeeyaa batteriga; nuur aad u hooseeya wuu adag yahay in la akhriyo dukaan iftiin fiican leh. Saddexaad, dami habka 'Ha Fadeexan' xilliga ganacsiga si loo joojiyo wicitaannada iyo ogeysiisyada soo galaya inay carqaladeeyaan interface-ka POS dhexda macaamil-dhaqaaleedka. Afraad, qalabka ku hay batteri ama u dhow shaxan-shaqeeye. Iskaanka kamaraduhu wuxuu isticmaalaa batteri, shift buuxdana wax iibineed ayaa dhammayn kara batteriga telefoonka duhurka dambe. Wire shaxan-shaqeeye oo fudud kaashka ayaa xallinaya tan. Ugu dambeyntii, xidh app-yada background aan loo baahnayn si aad u kordhiso xasuusta la heli karo oo aad u hubiso POS-ku si fiican u shaqeeyo.",
      },
    ],
    faq: [
      {
        q: 'Ma isticmaali karaa AskBiz POS computer miis?',
        a: 'Haa. AskBiz POS wuxuu ku shaqeeyaa browser kasta oo casri ah oo computer miis ah. Si kastaba ha ahaatee, iskaanka kamaraduhu wuxuu u baahan yahay webcam. Tafaariiq-ganacsato badan, telefoon ama tablet ayaa ah doorashada wax ku oolka ah.',
      },
      {
        q: 'Ma u baahan tahay inaan gacanta ku cusboonaysiiyo PWA-ga?',
        a: 'Maya. PWA-yadu waxay isku cusboonaysiiyaan iyaga naftooda. Marka AskBiz uu sii daayo nooc cusub, cusboonaysiintu waxay dhacdaa marka xigta ee aad furto app-ka. Ma jiro soo dejin ama rakibid gacan ah oo loo baahan yahay.',
      },
    ],
  },

  'pos-troubleshooting': {
    title: 'Xallinta Dhibaatooyinka POS: Kamarada, Gelitaanka, iyo Isku-dheelitirka',
    description:
      "Ma ku dhibaatoowday kamarad aan iskaanin, gelitaan aan shaqaynayn, ama xog aan isku-dheelitirin? Halkan waa xalal degdeg ah oo loogu talagalay dhibaatooyinka ugu badan ee AskBiz POS.",
    keywords: [
      'xallinta dhibaatooyinka POS',
      'barcode scanner aan shaqaynayn',
      'dhibaatooyinka gelitaanka POS',
      'dhibaatooyinka isku-dheelitirka POS',
      'kamarad aan iskaanin POS',
      'caawinta AskBiz POS',
      'xallinta dhibaatooyinka caadiga ah ee POS',
    ],
    keyTakeaways: [
      'Dhibaatooyinka AskBiz POS intooda badan waxay ku dhacaan saddex qaybood: kamarad/iskaanid, gelitaan/xaqiijin, iyo isku-dheelitirka xogta.',
      'Inta badan dhibaatooyinka waxaa lagu xalliyaa oggolaanshaha browser-ka, nadiifinta kaydka, ama hubinta xiriirka internet-ka.',
      'AskBiz wuxuu diiwaan geliyaa dhacdooyinka isku-dheelitirka iyo qaladaadka, taasoo fududaynaysa aqoonsiga dhibaatada aan la male-awaalin.',
    ],
    content: [
      {
        heading: 'Dhibaatooyinka kamarada iyo iskaanidda',
        body: "Haddii kamaradu aysan shaqayn marka aad taabato badhanka iskaanka, sababta ugu badani waa oggolaansho browser oo maqan. Browser-kaagu wuxuu u baahan yahay oggolaansho cad si uu u helo kamarada, tanina waa in la siiyaa domain-ka AskBiz gaar ahaan. Android, aad Dejinta Chrome, ka dibna Dejinta Goobta, ka dibna Kamarada, oo hubi in URL-ka AskBiz uu ku jiro liiska 'Allowed'. iOS, aad Dejinta, ka dibna Safari, ka dibna Kamarada, oo dejii 'Allow'. Haddii kamaradu firfircoon tahay laakiin barcode-yada aan la aqoonsan, hubi iftiinka — iftiin xun ayaa ah sababta ugu badan aqoonsiga gaabis ah ama fashilan. Qabo telefoonka 15 ilaa 30 sentimeter oo ka fog barcode-ka, isla markaana deggan hay. Nadiifi lenska kamarada haddii uu wasakhaysan yahay. Haddii barcode gaar ah uu si joogto ah u fashilmo, waxaa laga yaabaa inuu jabay ama la daabacay cabbir yar oo aad ah — isku day inaad alaabta gacanta ku geliso. Haddii iskaankan hore u shaqaynayay uu joojiyay shaqada, isku day inaad xidho oo mar labaad furto PWA-ga AskBiz, ama nadiifi kaydka browser-ka ee bogga AskBiz.",
      },
      {
        heading: 'Dhibaatooyinka gelitaanka iyo xaqiijinta',
        body: "AskBiz POS wuxuu isticmaalaa gelitaan xiriir hal-mar ah, taasoo macnaheedu yahay xiriir hal-mar ah ayaa loo diraa ciwaankaaga email-ka mar kasta oo aad gasho. Haddii aadan helin xiriirka hal-mar ah, marka hore hubi galka 'spam' ama 'junk' — email adeegayaashu mararka qaarkood si khaldan bay u aqoonsan karaan emailka toosan. Hubi inaad gelinayso ciwaanka email-ka saxda ah ee la isticmaalay markii xisaabtaada shaqaalaha la abuuray (hubi xarfaha waaweyn iyo qaladaadka). Haddii email-ku aanu wali imaan dhawr daqiiqo ka dib, weydii milkiilaha xisaabta si uu u hubiyo ciwaankaaga email si sax ah loogu diiwaan geliyay nidaamka. Haddii aad hesho xiriirka hal-mar ah laakiin uu shaqayn waayo marka aad taabato, xiriirku wuu dhici karaa — xiriirrada hal-mar ah waa kuwo wakhti xaddidan ammaan darteed. Codso mid cusub oo taabo isla markiiba. Sidoo kale hubi inaad ku furayso isla browser-ka aad ku isticmaasho AskBiz POS; app-yada email-ka qaarkood waxay ku furaan xiriirrada browser gudaha ah oo aan wadaagin session-yada browser-kaaga asalka ah. iOS, haddii xiriirka hal-mar ah uu ku furmo browser khaldan, koobi xiriirka oo ku dheji Safari gacanta.",
      },
      {
        heading: 'Dhibaatooyinka isku-dheelitirka xogta iyo xiriirka',
        body: "AskBiz POS wuxuu xogta ku wareejiyaa daruuraha macaamil-dhaqaaleed kasta ka dib. Haddii xiriirkaaga internet-ku go'o, app-ku wuxuu u beddelmaa habka offline oo wuxuu si gaar ah u kaydiyaa macaamil-dhaqaaleedyada ilaa xiriirku soo noqdo. Marka xiriirku soo noqdo, macaamil-dhaqaaleedyada sugaya way isku-dheeliyaan si toos ah. Haddii aad ogaato in xogtu aysan isku-dheelin (tusaale ahaan, waxaad geliso iib POS-ka laakiin uusan ka muuqan warbixinnadaada qalab kale), marka hore hubi xiriirkaaga internet. Fur website kasta si aad u hubiso inaad online tahay. Haddii xiriirku fiicnaa laakiin isku-dheelitirku wali dib u dhacayo, isku day inaad si qasab ah u cusboonaysiiso PWA-ga: browser-yada intiisa badan, hoos u jiid si aad u cusboonaysiiso ama xidh oo mar labaad fur app-ka. Dhibaatooyinka isku-dheelitirka joogtada ah waa dhif laakiin waxay dhici karaan haddii kaydka lakabka browser-ka uu buuxsamo (caadi qalabka kaydka yar leh). Nadiifinta kaydka browser-ka ee bogga AskBiz badiyaa way xallisaa tan — xogtaadu waa ammaan daruuraha, sidaas darteed nadiifinta kaydka gudaha ma lumiso waxba.",
      },
      {
        heading: 'Goorta la xiriiro taageerada',
        body: "Dhibaatooyinka AskBiz POS badankood waxaa lagu xalliyaa tallaabooyinka kore, laakiin xaaladaha qaar waxay u baahan yihiin la xiriirka taageerada. Haddii aad aragto koodh qalad ama fariin gaar ah, qor oo ku dar codsigaaga taageerada — tani waxay xawaarayneysaa aqoonsiga dhibaatada. Haddii macaamil-dhaqaaleedyo maqan yihiin (ma ahan oo keliya isku-dheelitir dib u dhacay), la xiriir taageerada isla markiiba oo sheeg wakhtiga qiyaasta iyo qalabka la isticmaalay. Haddii shaqaale aan la saari karin ama isbedelka doorka aanu dhaqan gelin, tani waxay tilmaami kartaa khilaaf oggolaansho oo u baahan baaritaan gadaal-ka ah. Haddii waxqabadku hoos u dhaco waqti ka dib (app-ku noqdo mid gaabis ah ama aan jawaabin), tani waxay tilmaami kartaa dhibaato heer-qalab ah ama dhibaato cabbir xog ah oo taageeradu ku caawin karto. Taageerada AskBiz waxaa laga heli karaa sheeko-wadaag app-ka gudaha, email-ka, iyo xarunta caawinta. Marka aad soo warbixiso dhibaato, ku dar nooca qalabkaaga, magaca browser-ka iyo noocaisa, iyo sharaxaad ku saabsan tallaabooyinkii keenay dhibaatada. Sawirro shaashadeed ama duub shaashadeed ayaa aad u waxtar leh dhibaatooyinka muuqaalka.",
      },
    ],
    faq: [
      {
        q: 'Ma lumin doonaa macaamil-dhaqaaleedyada haddii batteriga telefoonkaygu uu dhammaado xilliga iibka?',
        a: "Haddii iibku la xaqiijiyay ka hor qalabku dhinto, waxaa si gaar ah loo kaydiyaa waxayna isku-dheeli doontaa marka qalabka la dalajiyo oo dib loo xiro. Haddii iibku aan wali la xaqiijin, waxaad u baahan doontaa inaad mar kale gasho.",
      },
      {
        q: 'Sidee ayaan u nadiifiyaa kaydka AskBiz iyada oo aan xogta lumin?',
        a: 'Xogtaadu waxay ku kaydsan tahay daruuraha, ma ahan kaydka browser-ka. Nadiifinta kaydku waxay saartaa faylal ku meel gaadh ah oo caawiya app-ka inuu si degdeg ah u soo shubmo laakiin ma tirtirto xog macaamil-dhaqaaleed, alaab, ama dejinno.',
      },
      {
        q: 'POS-ku aad buu u gaabis yahay — maxaan sameeyaa?',
        a: 'Xidh app-yada background si aad u xoreyso xasuusta, hubi qalabkaagu uu leeyahay ugu yaraan 500MB oo kaydin ah oo bilaash ah, oo dib u bilow browser-ka. Haddii dhibaatadu sii socoto, isku day inaad dib u bilowdo qalabka laftiisa.',
      },
    ],
  },

  'pos-data-in-dashboards': {
    title: 'Sida Xogta POS ay u Shaqaysiiso Dashboard-kaaga AskBiz',
    description:
      "Macaamil-dhaqaaleedyada POS-kaagu kuma fadhiyaan oo keliya database — waxay quudiyaan dashboard-yo waqti-dhabta ah, jaantusyada dakhliga, iyo muuqaalka waxqabadka alaabta gudaha AskBiz.",
    keywords: [
      'dashboard POS',
      'falanqaynta iibka meesha',
      'dashboard warbixinta pos',
      'dashboard tafaariiqda',
      'muuqaalka xogta pos',
      'dashboard askbiz pos',
    ],
    keyTakeaways: [
      'Macaamil-dhaqaaleed POS kasta si toos ah ayuu ugu muuqdaa dashboard-kaaga AskBiz ilbiriqsiyo gudahood.',
      'Widget-yada dashboard-ku waxay tusi karaan dakhliga, unugyada la iibiyay, celceliska cabbirka dambiilka, iyo alaabta ugu wanaagsan — dhammaan xogta POS ayaa laga helayaa.',
      'Isku-darka xogta POS iyo iibka online ayaa ku siinaya muuqaal dhab ah oo omnichannel ah oo ganacsigaaga ah.',
    ],
    content: [
      {
        heading: 'Kaashka ilaa dashboard-ka waqti-dhabta ah',
        body: "Iib kasta oo lagu geliyo AskBiz POS waxaa lagu diiwaan geliyaa xarunta xogtaada dhexe isla markiiba. Ilbiriqsiyo gudahood, macaamil-dhaqaaleedkaasi wuxuu cusboonaysiiyaa dashboard-kaaga: wadarta dakhliga ayaa kor u kacda, liiska alaabta ugu wanaagsani wuu isbeddelaa, tirakoobka iibka maalinlaha ahna wuu kordhaa. Ma jiro soo dejin gaari-tirooyin ah, ma jiro isku-dheelitir habeenimo, mana jirto soo dejin gacan ah. Tan ayaa ah farqiga aasaasiga ah ee u dhexeeya kaash keligiis taagan iyo POS la isku daray — lakabkaaga aragtiga ayaa arka macaamil-dhaqaaleed kasta isla markiiba markuu dhaco. Milkiilaha dukaan ahaan, tani waxay macnaheedu yahay waad hubin kartaa telefoonkaaga qadada si aad u ogaato saxda ah sida subaxdu u dhacday, alaabta soo baxday, iyo haddii aad ku jirto jidka gaarsiisho bartilmaameedka maalinlaha ah.",
      },
      {
        heading: 'Widget-yada POS ee muhiimka ah ee dashboard-kaaga',
        body: "AskBiz wuxuu si toos ah u helaa dhowr widget oo POS-gaar ah marka module-ku firfircoon yahay. **Dakhliga Maanta** wuxuu muujiyaa wadar socda oo isbarbardhig la leh isla maalinta toddobaadkii hore. **Unugyada La Iibiyay** wuxuu la socdaa mugga si gaar ah ka soocan qiimaha — waxtar leh aqoonsiga in kororka dakhliga ka yimid iibinta alaab badan mise alaab qaali ah. **Celceliska Cabbirka Dambiilka** wuxuu xisaabiyaa celceliska qiimaha macaamil-dhaqaaleedka dhammaan iibabka maanta. **Alaabta Ugu Wanaagsan** wuxuu kala saaraa alaabtaada ugu iibsan sarreysa dakhliga ama mugga muddo aad dooratay. **Iibka Shaqaale kasta** wuxuu muujiyaa keeshiyayaasha geliya macaamil-dhaqaaleedka ugu badan — waxtar leh qorshaynta shiftiyada iyo dib u eegista waxqabadka. Waxaad ku dhejin kartaa mid kasta oo kuwan dashboard-kaaga guriga si ay u soo shubmaan marka hore subax kasta.",
      },
      {
        heading: 'Isku-darka POS iyo iibka online',
        body: "Haddii aad sidoo kale ku iibiso Shopify, Amazon, Etsy, ama madal kale oo isku xidhan, AskBiz wuxuu isku daraa xogtaada POS iyo xogta online muuqaal keliya. Halkan ayaa ka dhaca caqliga dhabta ah. Waad arki kartaa in alaab si fiican u iibiso online laakiin si yar u dhaqaaqi dukaanka, ama dakhliga dukaanka maalinta shaqada ka sarreeya usbuucyada halka arrintu dhinaca kale tahay online. Widget-ka **Dakhliga Kanaalka-badan** wuxuu muujiyaa kanaalada oo dhan labo dhinac ah. Aragtida **Waxqabadka Alaabta** waxay kuu ogolaanaysaa inaad isbarbardhigto isla SKU-ga kanaalada kala duwan. Aragtidan omnichannel-ka ah waa arrin caadi ahaan tafaariiq-ganacsatada waaweyn ku kaashi kartaa kumanaan bond oo falanqayn gaar ah — AskBiz wuxuu si toos ah u soo bandhigaa sababtoo ah POS-ka waa la dhisay, ma ahan mid lagu daray.",
      },
      {
        heading: 'Dejinta dashboard-kaaga POS',
        body: "Aad **Dashboards → Create Dashboard** oo dooro template-ka POS, ama dhis mid ka bilaabmaya eber adigoo ka darsanaya widget-yo qaybta POS. Habee habka aad maalin kasta dib u eegto — milkiilayaal badan waxay dhigaan dakhliga iyo unugyada la iibiyay geeska bidix ee sare, waxqabadka alaabta hoos, iyo cabbirrada shaqaalaha midig. Kaydso u ah aragtidaada default-ka ah si ay si toos ah u soo shubmo marka aad furto AskBiz. Haddii aad dashboard-ka la wadaagto maareeyaha dukaanka, waxay arkaan isla xogta waqti-dhabta ah adoo aan u baahnayn gelitaanka maamulka buuxa ee AskBiz. Wadaagida dashboard-ku wuxuu ixtiraamaa oggolaanshaha doorka, sidaas darteed maareeyuhu wuxuu arkaa xogta iibka laakiin ma arko biilasha ama dejinta xisaabta.",
      },
    ],
    faq: [
      {
        q: 'Immisa dhaqso ayay xogta POS ku muuqataa dashboard-kaygu?',
        a: 'Ilbiriqsiyo gudahood. AskBiz POS wuxuu si toos ah macaamil-dhaqaaleedyada ugu qoraa xarunta xogtaada dhexe, dashboard-yaduna waxay ka helaan isla ilaha waqti-dhabta ah.',
      },
      {
        q: 'Ma arki karaa iibka POS iyo online isla jaantuska?',
        a: 'Haa. Widget-ka Dakhliga Kanaalka-badan wuxuu isku darsaa dhammaan kanaalada la xiriira — oo ay ku jiraan POS-ka — muuqaal keliya, kanaal ahaan la kala saaray.',
      },
    ],
  },

  'pos-ai-chat-questions': {
    title: "Weydii AskBiz Xogta POS-kaaga: 25 Su'aal oo Kala Furaya Aragtiyaha Tafaariiqda",
    description:
      "AI-ga AskBiz wuxuu ka jawaabi karaa su'aalaha ku saabsan macaamil-dhaqaaleedyadaada POS luqad caadi ah. Halkan waa 25 su'aal oo milkiile dukaan kasta uu weydiin lahaa.",
    keywords: [
      'weydii askbiz pos',
      "su'aalaha AI pos",
      'falanqaynta AI tafaariiqda',
      'weydiinta xogta pos luqad caadi ah',
      'sheeko-wadaag ai askbiz tafaariiqda',
      'aragti AI iibka meesha',
    ],
    keyTakeaways: [
      'AI-ga AskBiz wuxuu fahmaa xogtaada POS — kaliya luqad caadi ah ku weydii.',
      "Su'aalaha ku saabsan qaababka dakhliga, waxqabadka alaabta, iyo cabbirrada shaqaalaha oo dhammi way shaqeeyaan bilaash.",
      "Isku-darka su'aalaha POS iyo su'aalaha xogta online ayaa ku siinaya aragtiyo aan nidaam kaligiis bixin karin.",
    ],
    content: [
      {
        heading: 'Sida AI-gu u fahmo xogtaada POS',
        body: "Marka aad su'aal ku qorto AskBiz, AI-gu wuxuu eegaa dhammaan ilaha xogtaada la xiriira — oo ay ku jiraan macaamil-dhaqaaleed kasta oo lagu geliyay POS-ka. Wuxuu fahmaa magacyada alaabta, qiimaha, shaqaalaha, habka lacag-bixinta, sababaha celinta lacagta, iyo muddooyinka waqtiga. Uma baahnid inaad qorto codsi ama dooratid kala-soocyo. Kaliya luqad caadi ah ku weydii: 'Waa maxay alaabtayda ugu iibsanayd Talaadadii hore?' ama 'Keeshiyaha ayaa geliyay celinta lacagta ugu badan bishan?' AI-gu wuxuu su'aashaada u beddelaa weydiin xog ah, wuxuu ku dhex socodsiiyaa taariikhda macaamil-dhaqaaleedkaaga, wuxuuna soo celiyaa jawaabta jumlad ama jaantus ahaan — kuwa ka faa'iido badan. Kani waa isla injinka AI-ga taageeraya inta kale ee AskBiz, hadda leh aragti buuxda oo ku saabsan xogtaada tafaariiqda jireed ah.",
      },
      {
        heading: 'Su\'aalaha dakhliga iyo iibka',
        body: "Bilaab aasaasiga ah. **'Immisa ayaa ahayd wadarta dakhligayga POS toddobaadkan?'** wuxuu ku siinayaa lambarka ugu weyn. **'Sideeda ayaa toddobaadkan ula mid yahay isla toddobaadka bisha hore?'** wuxuu ku daraa macnaha. **'Waa maxay celceliska cabbirka dambiilkayga?'** wuxuu ku sheegayaa in macaamiisha ay soo iibinayaan alaab badan ama kaliya kuwo qaali ah. **'Maalintee toddobaadka ayaa ku leh dakhliga POS-ka ugu sarreeya?'** wuxuu kaa caawinayaa go'aannada shaqaalaynta. **'Boqolkiiba dakhligayga waa lacag caddaan mise kaadh?'** wuxuu wax ka sheegaa xeeladaada habaynta lacag-bixinta. **'I tus dakhliga maalinlaha POS ee 30-kii maalmood ee ugu dambeeyay jaantus ahaan'** wuxuu ku siinayaa isbeddelka muuqaalka ah. Mid kasta oo kuwan su'aalaha ah ayaa ilbiriqsiyo qaadanaya oo waxay u baahan lahaayeen shaqo xaashi gacan ah AI la'aan.",
      },
      {
        heading: "Su'aalaha alaabta iyo kaydka",
        body: "Aragtida alaabta ayaa halkaas ka dhaca caqliga xogta POS ee dhabta ah. **'Waa maxay 10-kayga alaabta sare ee unugyada la iibiyay bishan?'** wuxuu aqoonsadaa dhaqdhaqaaqayaashaada ugu wanaagsan. **'Alaabtee ayaa leh heerka celinta lacagta ugu sarreeya?'** wuxuu calaamadeeyaa arrimaha tayada ama cabbirka. **'Alaabtee ayaan la iibin 30-kii maalmood ee ugu dambeeyay?'** wuxuu muujiyaa kayd dhimatay. **'Waa maxay celceliska faa'iidada nooc kasta oo alaab ah?'** wuxuu muujiyaa halka aad dhab ahaan lacag ka samayso iyo halka aad kaliya mugga wax ku qaadaneyso. **'Alaabtee ayaa inta badan la isku iibiya?'** wuxuu muujiyaa fursado iibinta wax-ku-dar ee laga yaabo inaad seegto. **'Saadaali alaabtee ayaa kaydka ka dhammaan doonta 7-da maalmood ee soo socota ku salaysan xawaaraha iibka hadda?'** wuxuu xogtaada POS u beddelaa qalab qorshayn mustaqbal-eegis ah.",
      },
      {
        heading: "Su'aalaha shaqaalaha iyo hawlgalka",
        body: "Xogtaada POS waxaa ku jira aragti hawlgal oo qiimo weyn leh. **'Shaqaale kee ayaa leh celceliska qiimaha dambiilka ugu sarreeya?'** wuxuu aqoonsadaa iibiyayaashaada ugu fiican ee wax-ku-darka. **'Waa maxay celceliska waqtiga macaamil-dhaqaaleedka keeshiye kasta?'** wuxuu muujiyaa fursadaha tababarka. **'Immisa macaamil-dhaqaaleed ayay keeshiye kasta geliyaan saacadiiba?'** wuxuu cabbiraa xawaaraha shaqada. **'I tus celinta lacagta shaqaale kasta bishan'** wuxuu kaa caawinaa aqoonsiga qaababka u baahan feejignaan. **'Waa maxay saacadaha ganacsiga ugu sarreeya toddobaadkan?'** wuxuu hagaajiyaa jadwalkaaga shiftiyada. **'Isbarbardhig waxqabadka shaqaalaha bishan iyo bisha hore'** wuxuu la socdaa horumarka waqtiga. Su'aalahan waxay diiwaanada macaamil-dhaqaaleedka ceyriin ah u beddelaan aragti maamul oo kaa caawisa inaad si fiican u maamusho dukaanka.",
      },
    ],
    faq: [
      {
        q: 'Ma weydiin karaa AI-ga inuu isbarbardhigo iibka POS iyo dukaankayga online?',
        a: "Haa. Isku day: 'Isbarbardhig dakhligayga dukaanka iyo dakhliga Shopify bishan.' AI-gu wuxuu ka soo qaataa labada il oo wuxuu soo bandhigaa isbarbardhig dhinac-dhinac ah.",
      },
      {
        q: 'Maxaa dhacaya haddii AI-gu jawaab khaldan ka bixiyo xogtayda POS?',
        a: "Hubi muddada waqtiga iyo magacyada alaabta ee jawaabta ay la mid yihiin su'aashaada. Haddii xogtu u muuqato mid khaldan, hubi in dhammaan macaamil-dhaqaaleedyada POS ay isku-dheeleen adoo hubinaya diiwaanka macaamil-dhaqaaleedka. Waxaad calaamadin kartaa jawaabaha khaldan adoo isticmaalaya badhanka suulka-hoose.",
      },
    ],
  },

  'pos-daily-brief-integration': {
    title: 'Sida Xogta POS ay ugu Muuqato Warbixintaada Maalinlaha ah',
    description:
      "Warbixintaada Maalinlaha ee AskBiz si toos ah ayay ugu jirtaa aragtiyada POS — dakhliga shalay, alaabta ugu wanaagsan, digniinaha kaydka, iyo waxyaabaha aan caadiga ahayn ee dukaankaaga jireed ah.",
    keywords: [
      'warbixin maalinle pos',
      'soo koobid maalinle tafaariiqda',
      'warbixin subaxeed pos',
      'warbixin maalinle askbiz pos',
      'warbixin pos toos ah',
      'aragtiyada tafaariiqda maalinlaha',
    ],
    keyTakeaways: [
      "Warbixinta Maalinlaha si toos ah ayay ugu jirtaa xogta POS marka module-ku firfircoon yahay — dejin dheeraad ah looma baahna.",
      'Waxay calaamadeysaa dakhliga shalay, alaabta ugu wanaagsan, digniinaha kaydka, iyo qaab kasta oo aan caadi ahayn.',
      'Isbarbardhigidda Warbixintaada Maalinlaha maalmaha ka dhexeeya waxay muujisaa isbedelo aan diiwaanka macaamil-dhaqaaleedka gaarka ahi tusi karin.',
    ],
    content: [
      {
        heading: 'Waxa Warbixinta Maalinlaha ka kooban tahay xogtaada POS',
        body: "Marka aad hayso AskBiz POS oo firfircoon, Warbixintaada Maalinlaha ee subaxda ah si toos ah ayay ku darsataa qaybta tafaariiqda. Tan waxaa ka mid ah wadarta dakhliga POS shalay iyo sida ay ula mid tahay isla maalinta toddobaadkii hore, saddexda alaab ee ugu sarreysa unugyada la iibiyay, alaab kasta oo dhaliyay digniin kayd yar ama kayd dhammaaday habeenkii hore, iyo liis-horeed shaqaale oo muujiya macaamil-dhaqaaleedyo iyo dakhli keeshiye kasta. Haddii aad sidoo kale ku hayso kanaalo online, Warbixintu waxay muujisaa qaybinta kanaalka si aad u aragto sida waxqabadka dukaanka jireed ah ula tacaali karo iibka dhijitaalka ah. Dhammaan tan waxay ku soo gaartaa boostadaada ama shaashadda guriga AskBiz ka hor inta aadan furin dukaanka — kaa siinaysa sawir buuxa oo shalay ah iyo bilow hore oo maanta ah.",
      },
      {
        heading: 'Aqoonsiga wax aan caadi ahayn ee tafaariiqda',
        body: "Warbixinta Maalinlaha ma ahan oo kaliya soo warbixin lambaro ah — waxay calaamadeysaa wax kasta oo aan caadi ahayn. Haddii dakhligii shalay uu si weyn uga sarreeyay ama ka hooseeyay celceliska dhawaan, Warbixintu way tilmaamaysaa taas oo soo jeedinaysa sababo suurtagal ah (dhacdo maxalli ah, isbedel qiime, maqnaanshaha shaqaale). Haddii alaab caadi ahaan iibisa toban unug maalintii ay si kadis ah u iibsan eber, taasna waa la calaamadeeyaa — waxay tilmaami kartaa dhibaato bandhig, dhibaato kayd, ama qalad iskaan. Wax aan caadi ahaanahaan waxaa si toos ah loo soo bandhigaa isla injinka aqoonsiga adeegsanaya kanaaladaada online. Milkiile dukaan mashquul ah ahaan, tan waxay macnaheedu yahay uma baahnid inaad gacan ku isbarbardhigto xaashiyo si aad u aragto dhibaatooyinka — Warbixintu way kuu qabataa subax kasta.",
      },
      {
        heading: 'U habeynta Warbixintaada POS',
        body: "Warbixinta Maalinlaha waxaa loogu talagalay inay shaqeyso adigoo aan wax dejin ah, laakiin waad u habeyn kartaa. Aad **Settings → Daily Brief → POS Section** si aad u dooratid cabbirrada muuqda, dejii muddooyinka isbarbardhigga (maalin-ilaa-maalin, toddobaad-ilaa-toddobaad, ama bil-ilaa-bil), oo ku dar ama ka saar liiska-horeedka shaqaalaha. Haddii aad hayso dhowr goobood, waxaad heli kartaa Warbixin gaar ah goob kasta ama aragti isku-darsan. Waxaad sidoo kale dejin kartaa wakhtiga gaarsiinta — milkiillo dukaan badan waxay doorbidaan inay helaan 30 daqiiqo ka hor furitaanka, si ay u helaan waqti ay ku dib u eegaan qaxwaha ka hor macmiilka ugu horreeya.",
      },
      {
        heading: 'Ficil ku qaadista Warbixintaada',
        body: "Warbixinta Maalinlaha ugu fiican waa mid keenta ficil. Haddii dakhligii shalay uu hoos u dhacay, weydii AI-ga sababta: 'Sababta dakhliga POS uu ka hooseeyay caadiga shalay?' Haddii alaab kayd hoose leedahay, dib u buuxi kaydka ka hor dukaankaaga furitaankiisa. Haddii keeshiye gaar ah uu si joogto ah uga wanaagsan yahay kuwa kale qiimaha dambiilka, fahan waxa ay ka duwan tahay oo la wadaag kooxda. Warbixintu maaha warbixin lagu kaydiyo — waa dhiirigelin go'aan. Todobaadyo iyo bilo, dib u eegista Warbixintaada maalin kasta waxay dhistaa fahamka dabiiciga ah ee caaduugaha ganacsigaaga oo aan warbixin gacan ah ku beddeli karin.",
      },
    ],
    faq: [
      {
        q: 'Ma u baahan tahay inaan wax dejiyo si xogta POS ay ugu muuqato Warbixintayda?',
        a: 'Maya. Marka POS firfircoon yahay, Warbixinta Maalinlaha si toos ah ayay ugu jirtaa xogta tafaariiqda subaxda xigta. Waxaad u habeyn kartaa cabbirrada muuqda Dejinta.',
      },
      {
        q: 'Ma heli karaa Warbixin dhexe maalin oo?',
        a: 'Haa. Aad Settings → Daily Brief → Schedule oo ku dar gaarsiinta labaad wakhtiga aad doorbidayso. Milkiillo dukaan qaar waxay dejiyaan mid furitaanka iyo mid rushka qadada ka dib.',
      },
    ],
  },

  'pos-business-pulse-impact': {
    title: "Sida Macaamil-dhaqaaleedyada POS ay u Saameeyaan Dhibcaha Business Pulse-kaaga",
    description:
      "Dhibcahaaga Business Pulse waxay ku xisaabtamaan qaababka dakhliga POS, caafimaadka kaydka, iyo qaababka macaamil-dhaqaaleedka. Halkan waa sida ay si sax ah u shaqayso.",
    keywords: [
      'business pulse pos',
      'dhibcaha caafimaadka pos',
      'dhibco ganacsi tafaariiq',
      'askbiz pulse pos',
      'dhibcaha waxqabadka pos',
      'caafimaadka ganacsiga tafaariiqda',
    ],
    keyTakeaways: [
      'Qaababka dakhliga POS, caafimaadka kaydka, iyo heerarka celinta lacagta oo dhammi waxay ku biiraan dhibcahaaga Business Pulse.',
      'Dakhliga POS ee joogtada ah ee maalinlaha ah wuxuu hagaajiyaa qaybta xasilloonida dhibcahaaga.',
      'Heerarka celinta lacagta oo sarreeya ama dhacdooyinka kayd la\'aan oo joogto ah waxay dhibcahaaga hoos u dejin doonaan.',
    ],
    content: [
      {
        heading: 'Waxa dhibcaha Business Pulse cabbiraan',
        body: "Business Pulse waa dhibco isku dhafan oo laga bilaabo 0 ilaa 100 oo muujinaya caafimaadka guud ee ganacsigaaga. Waxay isku darsataa shan cabbir: caafimaadka dakhliga (qaabka, joogtaynta, korriinka), caafimaadka dhaqaalaha socda (muddada, deymaha la sugayo), caafimaadka macmiisha (haynta, khatarta bixidda), caafimaadka hawlgalka (celinta lacagta, dhammaystirka, la-kalsoonaanta iibiyaha), iyo astaamaha suuqa. Marka POS firfircoon yahay, xogta macaamil-dhaqaaleedkaaga dukaanka jireed ah waxay si toos ah ugu quudisaa cabbirrada dakhliga iyo hawlgalka. Tani waxay macnaheedu yahay iib kasta oo aad geliso — iyo celin lacag kasta oo aad bixiso — waxay leedahay saameyn la cabbiri karo dhibcahaaga Pulse. Dhibcaha waxaa dib loo xisaabiyaa maalin kasta isticmaalayaasha heerka bilaashka ah iyo waqti-dhab ahaan isticmaalayaasha qorshaha Growth iyo Business.",
      },
      {
        heading: 'Sida xogta POS ay u saameyso cabbir kasta',
        body: "**Caafimaadka Dakhliga** ayaa ah kan si toos ah loogu saameeyo. Pulse-ku wuxuu la socdaa qaabka dakhliga POS-kaaga 7-maalmood iyo 30-maalmood dhaadheer. Dakhli joogto ah ama koraya wuxuu kor u qaadaa dhibcaha; dakhli hoos u dhacaya wuu hoos u dejiyaa. Isbeddelku sidoo kale waa muhiim — dukaan kasoo galo £500 maalin kasta wuxuu ka dhibco sarreeyaa joogtaynta mid u dhexeeya £200 iyo £800, xitaa haddii celceliska ay isku mid yihiin. **Caafimaadka Hawlgalka** waxay ka fikiraan heerka celinta lacagtaada (celinta lacagta boqolkiiba iibka guud), inta jeer ee kaydku dhammaado, iyo isbeddelka kaydka. Heer celin lacag oo sarreeya wuxuu muujiyaa dhibaato tayo alaab ah ama qanacsanaanta macmiilka. Dhacdooyinka kayd dhammaadka oo joogto ah waxay muujiyaan qorsheyn kayd oo xun. Labaduba way hoos u dejiyaan dhibcahaaga hawlgalka.",
      },
      {
        heading: 'Hagaajinta Pulse-kaaga xogta POS',
        body: "Diirad saar kontrolayaasha aad xakami karto. Si aad u hagaajiso joogtaynta dakhliga, falanqee qaababka iibkaaga maalinlaha oo wax ka qabo dhicis kasta — Isniinta had iyo jeer ma aabbi tahay? Tixgeli dallacsi Isniin ah. Si aad u hagaajiso heerka celinta lacagtaada, gal sababaha: alaab qaar miyaa in ka badan lagu celiyaa? Celinta lacagtu miyay ku urursan yihiin hal shaqaale? Si aad u hagaajiso caafimaadka kaydka, dejii digniinaha kayd hoose AskBiz POS oo dib u buuxi kaydka si horudhac ah halkii aad u samayn lahayd falcelin. Mid kasta oo tallaabooyinkan ka mid ah wuxuu wax ka qabtaa cabbir gaar ah oo Pulse-ka, waana in uu soo saaraa hagaajin la cabbiri karo hal ilaa laba toddobaad fulinta joogtada ah.",
      },
      {
        heading: 'Akhrinta isbeddelka Pulse-kaaga waqtiga',
        body: "Dhibcaha Pulse hal keliya waa sawir. Qiimaha dhabta ah waa isbeddelka. Aad **Intelligence → Business Pulse → Trend** si aad u aragto dhibcahaaga 90-kii maalmood ee ugu dambeeyay. Raadi meelaha isbeddelka jihada — waqtiyada dhibcuhu jihadiisa isbeddelay — oo la xiriiri waxa dhacay ganacsiga. Miyay dhibcuhu hoos u dhacday markii aad kaydka alaab muhiim ah ka dhammaatay? Miyay kor u kacday markii aad keeshiye cusub ku dartay oo aad yareysay saacadaha safka? Isku xirnaantan waxay Pulse ka dhigaan qalab dhab ah oo baaritaan ah, ma ahan cabbir muuqaal ah oo keliya. Waqti ka dib, waxaad dhisi doontaa dareen dabiici ah oo ku saabsan waxa dhaqaaqiya dhibcahaaga, dareenkaasna wuxuu ku wargelin doonaa go'aammada maalinlaha ah ee hagaagsan.",
      },
    ],
    faq: [
      {
        q: 'Dhibcaha Pulse-ku ma u dhaqmaa dakhliga POS iyo online si isku mid ah?',
        a: 'Haa. Dakhligu waa dakhli iyada oo aan loo eegin kanaalka. Pulse-ku wuxuu isku darsadaa dhammaan ilaha la xiriira qiimayn caafimaad dakhli oo keliya, oo lagu miisaamayo qaybtooda dakhliga guud.',
      },
      {
        q: 'Immisa dhaqso ayay celinta lacagta POS ay u saameyso Pulse-kayga?',
        a: 'Qorshayaasha Growth iyo Business, Pulse-ku wuxuu cusboonaysiiyaa waqti-dhab ahaan. Heerka bilaashka ah, wuxuu dib u xisaabiyaa habeenkii. Celin lacag keliya oo ganacsi caafimaad qabo ah wuxuu yeelan doonaa saameyn aan micno lahayn — dhibcuhu waxay ka jawaabaan qaababka, ma ahan macaamil-dhaqaaleedyada gaarka ah.',
      },
    ],
  },

  'pos-offline-mode': {
    title: 'Habka Offline: Waxa Dhaca Marka Internetkaagu Go\'o Iibka Dhexdiisa',
    description:
      "AskBiz POS waa PWA kara maareynta lumitaanka xiriirka gaaban. Halkan waa waxa shaqeeya offline, waxa aan shaqeynin, iyo sida loo soo kabsado si nadiif ah.",
    keywords: [
      'habka offline pos',
      'pos internet la\'aan',
      'iibka meesha offline',
      'pwa offline tafaariiq',
      'dhibaatooyinka xiriirka pos',
      'askbiz pos offline',
    ],
    keyTakeaways: [
      'AskBiz POS wuxuu si gaar ah ugu kaydiyaa liiskaaga alaabta qalabka si aad u sii wadi karto ku darista alaabta dambiilka xilliga xiriir la\'aanta gaaban.',
      'Macaamil-dhaqaaleedyadu waxay safnaadaan si gaar ah oo waxay si toos ah isku-dheeliyaan marka xiriirku soo noqdo.',
      'Xiriir la\'aanta dheer (in ka badan 30 daqiiqo) waxay u baahan tahay isku-dheelitir gacan ah — had iyo jeer si dhaqso ah u soo celi xiriirka.',
    ],
    content: [
      {
        heading: 'Sida habka offline u shaqeeyo',
        body: "AskBiz POS wuxuu u shaqeeyaa sida App Web Horumarsan, taasoo macnaheedu yahay koodhka app-ka iyo liiska alaabtaada waxaa lagu kaydiyaa qalabka ka dib soo shubidda ugu horreysa. Haddii xiriirkaaga internet-ku go'o iibka dhexdiisa, app-ku wuu sii socon karaa — waxaad sii wadi kartaa iskaanidda alaabta, ku darista dambiilka, hagaajinta tirooyinka, oo dhammaystirid hawsha xisaabinta iibka. Macaamil-dhaqaaleedka waxaa si gaar ah loogu kaydiyaa qalabka waxaana la geliyaa safka isku-dheelitirka. Marka xiriirku soo noqdo, safku wuu si toos ah u shaqeeyaa dhammaan macaamil-dhaqaaleedyadu sugayo waxaa lagu soo shubaa server-ka. Waxaad arki doontaa banner yar oo shaashadda sare ah oo muujinaya xaaladda offline, iyo xaqiijin kale marka isku-dheelitirku dhammaado.",
      },
      {
        heading: 'Waxa shaqeeya iyo waxa aan shaqeynin',
        body: "**Waxa offline shaqeeya:** eegista liiska alaabtaada, ku darista alaabta dambiilka, habaynta iibabka (lacag caddaan oo keliya — akhriyayaasha kaadhku waxay u baahan yihiin xiriir), soo saarista rasiid gaar ah. **Waxa aan offline shaqeynin:** iskaanka kamarada alaab cusub oo aan horeba u ku jirin liiskaaga (API-ga aqoonsiga wuxuu u baahan yahay xiriir server), hubinta heerarka kaydka waqti-dhabta ah, dirista rasiidyada WhatsApp, gelitaanka shaqaalaha xiriirka hal-mar ah, iyo isku-dheelitirka dashboard-yada. Lacag-bixinta kaadhku waxay u baahan tahay xiriir firfircoon oo habeeyaha lacag-bixinta ah — haddii aad offline tahay, waxaad kaliya aqbali kartaa lacag caddaan. Xaddidaadan waxay ka timaadaa shabakadda kaadhka, ma ahan AskBiz.",
      },
      {
        heading: 'Ka soo kabashada xiriir la\'aan dheer',
        body: "Xiriir la\'aanta gaaban ee dhawr daqiiqo waxaa lagu maareeyaa si nadiif ah — safku wuu shaqeeyaa oo wax kasta si toos ah isku-dheeleeyaa. Xiriir la\'aanta dheer ee 30 daqiiqo ama in ka badan waxay abuurtaa saf dheer oo laga yaabo inuu qaato daqiiqo si uu isku-dheelo marka xiriirku soo noqdo. Xilligan, xogta dashboard-ka iyo heerarka kaydku waxay ku noqon doonaan kuwo hore ku meel gaadh ah. Haddii qalabku uu awoodda batteriga waayo ama browser-ku uu jabo intii macaamil-dhaqaaleedyo offline ah ay saf ku jiraan, service worker-ka PWA-ga wuxuu ku hayaa safka kaydka gudaha. Marka aad mar labaad furto app-ka, wuxuu isku dayi doonaa inuu isku-dheelo macaamil-dhaqaaleed kasta oo sugaya. Xaalad dhif ah oo macaamil-dhaqaaleed lumo, waxaad si gacan ah u xisaabin kartaa adoo isticmaalaya rasiidyada warqadda ama kuwa gudaha ah ee aad soo saartay xilliga xiriir la\'aanta.",
      },
      {
        heading: 'Hab-dhaqannada ugu wanaagsan ee xiriirka',
        body: "Ka hortagu waa ka fiican yahay soo kabashada. Isticmaal xiriir broadband gaar ah oo loogu talagalay qalabkaaga POS halkii aad ku tiirsanaan lahayd Wi-Fi dadweynaha. Hay hotspot mobile 4G/5G ah sidii backup — SIM £10/bishii oo fudud ayaa kaa badbaadin kara iib la lumiyay xilliga broadband uu joogsado. Dhig qalabkaaga POS meel Wi-Fi xoog leh — darbiyo dhumuc leh iyo qalab bir ah ayaa yaraynaya calaamada. Haddii aad ka shaqeyso suuqyo, pop-up-yo, ama dhacdooyin banaan oo xiriirku aan lagu kalsoonaan karin, hore u soo shub liiskaaga alaabta buuxa ka hor inta aadan ka tegin oo hay hotspot mobile ah. Tijaabi awoodaada offline ka hor inta aadan u baahnaan — dejii qalabkaaga aeroplane mode oo samee macaamil-dhaqaaleed tijaabo ah si aad u xaqiijiso wax walba way shaqeeyaan.",
      },
    ],
    faq: [
      {
        q: 'Ma lumin doonaa xogta iibka haddii internetkaygu uu joogsado?',
        a: "Maya. Macaamil-dhaqaaleedyada waxaa si gaar ah loogu kaydiyaa qalabka waxayna isku-dheeli doonaan marka xiriirku soo noqdo. Xogtu waxay khatar ku jirtaa kaliya haddii qalabku awoodda batteriga waayo OO kaydka browser-ka la nadiifiyo ka hor inta aan dib loo xiriirin — taasoo aad u dhif ah.",
      },
      {
        q: 'Ma habayn karaa lacag-bixinno kaadh offline?',
        a: "Maya. Lacag-bixinnada kaadhku waxay u baahan yihiin xiriir firfircoon oo habeeyaha lacag-bixinta ah. Xilliga xiriir la'aanta, waxaad aqbali kartaa lacag caddaan oo keliya. Tani waa xaddidaad shabakadaha kaadhka, ma ahan AskBiz.",
      },
    ],
  },

  'multi-location-retail-management': {
    title: 'Maareynta Tafaariiqda Goobo-badan: Hage Buuxa',
    description:
      "Sababta kayd gaar ah oo laan kasta uu muhiim u yahay, sida loo qaabeeyo hawlgallada goobo-badan, iyo qaladaadka caadiga ah ee qabta tafaariiq-ganacsatada koraya.",
    keywords: [
      'tafaariiq goobo badan',
      'maareynta dukaanno badan',
      'maareynta laanta',
      'ballaarinta tafaariiqda',
      'dukaanka labaad',
      'tafaariiq goobo-badan',
    ],
    keyTakeaways: [
      'Laan kasta waa inay hayso kayd madax banaan si looga hortago iibin ka badan kaydka iyo si loo suurtageliyo warbixin sax ah oo laan kasta.',
      'Milkiilaha dhexe ee hawlgallada la firfircoonaadey ayaa ah qaabka caadiga ah — shaqaaluhu waxay ka shaqeeyaan meel gaar ah, milkiiluhuna wuxuu arkaa wax walba.',
      'Khaladka ugu badan marka dukaan labaad la furayo waa in kaydka loo arko sida hal keriin oo la wadaago.',
    ],
    content: [
      {
        heading: 'Sababta dukaan keliya u fudud yahay dukaan-labaadna ay adag tahay',
        body: "Ka shaqaynta dukaan keliya waa mid fudud: hal kayd, hal koox, hal xisaab-dhige. Isla marka aad furto goob labaad, isku-dhafnaantu way tarantaa. Kaydka hore ee hal liis ahaa wuxuu noqdaa laba liis oo kala duwan noqon kara. Shaqaalaha aqoon dhan lahaa haddana wax walba kaliya laan hadda waxay yaqaanaan. Dakhliga hore ee hal lambar ahaa wuxuu noqdaa laba lambar oo loo baahan yahay in la isbarbardhigo, la isku daro, oo macno lala siiyo. Tafaariiq-ganacsatada si guul leh u ballaarsha waa kuwa dhisa nidaamyo si ay ula qabsadaan isku-dhafnaantan ka hor inta aysan furin albaabka labaad.",
      },
      {
        heading: 'Mabda\'a kaydka madax banaan',
        body: "Xeerka ugu muhiimsan ee tafaariiqda goobo-badan waa in laan kasta ay hayso tirakoobkeeda kaydka gaarka ah. Alaab 20 unug ah oo kaydka ku jira ma sameynayso waxba haddii aadan ogeyn haddii 20-kaas unug ay ku jiraan dukaankaaga jidka weyn ee sare ama bakhaarkaaga. Kayd madax banaan waxay ka dhigan tahay laan kasta ayaa la socota heerarka kaydkeeda, dhaliya digniimaha kaydka hoose, oo muujiya heshiga alaabteeda gaarka ah. Tani waxay ka hortagtaa khaladka ugu badan ee goobo-badan: macmiil Laanta A ah oo lagu sheegayo alaab in kaydka ku jirto halka ay dhab ahaan taal shelf Laanta B.",
      },
      {
        heading: 'Aragti dhexe, hawlgal la firfircoonaaday',
        body: "Milkiilaha ama maareeyuhu waxay u baahan yihiin inay arkaan xog isku-darsan oo dhammaan laamaha — wadarta dakhliga, qiimaha kaydka isku-darsan, faa'iidada guud. Laakiin keeshiyaha laan kasta wuxuu kaliya u baahan yahay inuu arko alaabtiisa iyo iibkiisa gaarka ah. Habka aragtida labanlaabku waa caadiga ah nidaamyada POS-ka casriga ah. Shaqaaluhu waxay ku xiran yihiin laantooda si toos ah oo ammaan ah, halka milkiilaha uu leeyahay dashboard isku darsanaya wax walba isagoo awood u leh inuu gal goob gaar ah oo kasta.",
      },
      {
        heading: 'Qaladaadka caadiga ah marka la ballaarinayo',
        body: "Khaladaadka ugu badan ee tafaariiq-ganacsatadu sameeyaan marka ay furayaan goob labaad: kayd loo arko hal keriin oo la wadaago (waxay keentaa iibin ka badan kaydka), aan shaqaale loo qoondeyn laamo gaar ah (waxay keentaa isku qas xog), la fashilo isbarbardhigga waxqabadka laamaha (goob keliya oo si aan la ogeyn u liidata), iyo la'aanta hab wareejinta kaydka (badeeco laan ka soo maray inta laanta kale ay dhammaato). Nidaam POS goobo-badan oo wanaagsan wuxuu ka hortagayaa dhammaan kuwan isagoo ku dhaqmaya kala-soocid heer-xog ah.",
      },
      {
        heading: 'Goorta laga daro laan saddexaad',
        body: "Haddii laantaada labaad ay faa'iido leedahay, xasilloon tahay hawlgal ahaan, oo nidaamyadaadu ay maareeyaan isku-dhafnaanta laba-goob la'aan xallal gacan ah, waxaad diyaar u tahay saddexaad. Boodka ka bilaabma laba ilaa saddex waa ka fudud mid ilaa laba sababtoo ah horeba waad xallisay dhibaatooyinka qaabdhismeedka. Cabbirka muhiimka ah ee la eego waa in faa'iidooyinka laan-kasta ay sii socdaan xasilloon marka aad ku darto goobo — haddii faa'iidooyinku yaraadaan laan kasta oo aad ku dartid, waxaad si aad ah u kala firdhinaysaa.",
      },
    ],
    faq: [
      {
        q: 'Miyaan isticmaali karaa nidaamyo POS gooni gooni ah laan kasta?',
        a: 'Maya. Hal nidaam POS oo taageera goobo-badan ayaa ku siinaya warbixinno isku-darsan, maareynta shaqaalaha oo fudud, iyo awoodda inaad kayd u wareejiso goobaha. Nidaamyo gooni gooni ah waxay abuuraan qaybo xog oo kala go\'an.',
      },
      {
        q: 'Immisa laan ayuu ganacsi yar dhab ahaan si wanaagsan u maareyn karaa?',
        a: 'Waxay ku xiran tahay ganacsiga, laakiin ganacsiyada SME intooda badan waxay ogaan doonaan in 2-5 goob ay maareyn karaan haddii nidaamyo wanaagsan la haysto. Ka baxsan taas, waxaa caadi ahaan loo baahan yahay maareeye gobolo ah ama kormeerayaal aag si tayada loo ilaaliyo.',
      },
    ],
  },
}
