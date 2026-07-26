// Academy article translations — Nederlands (nl).
// Wave A, batch 4: new-articles cluster (12 articles: purchase orders,
// Sources connectors, POS product features).
//
// See lib/academy-i18n/README.md for the on-disk contract. This file is
// merged into ./index.ts's `translations` export, not imported directly by
// the loader.
//
// GLOSSARY (nl) — reused verbatim from wave-a-batch1 (the first nl
// translation batch for Academy content). Keep using these terms
// identically in every later nl batch:
//
//   POS system / kassasysteem          cashier / kassamedewerker
//   receipt / kassabon                 refund / terugbetaling
//   VAT / btw                          dashboard / dashboard (unchanged)
//   staff / personeel (medewerker)     role / rol
//   low-stock alert / voorraadwaarschuwing
//   purchase order / inkooporder       profit / winst
//   margin / marge                     revenue / omzet
//   stock, inventory / voorraad        cart (POS basket) / winkelmandje
//   discount / korting                 barcode / barcode (unchanged)
//   transaction / transactie           void / annuleren, annulering
//   audit trail / controlespoor        reorder point / bestelpunt
//   checkout, process a sale / afrekenen
//   payment method / betaalmethode
//   small business (owner) / kleine onderneming, ondernemer
//   sale / verkoop                     stockout / voorraadtekort
//   sales velocity, sell-through rate / verkoopsnelheid
//   dead stock / dode voorraad         reorder (verb) / bijbestellen
//   restock (verb) / voorraad aanvullen
//   magic link / magic link (kept as loanword; gloss "eenmalige inloglink" on first mention)
//
// Product/proper nouns kept in English throughout: AskBiz, AskBiz POS,
// WhatsApp, role labels (Owner, Manager, Cashier), and literal UI
// button/section names as they appear capitalized in the English source
// (Add Staff, Invite, POS Settings, Refund, Void, Add Note, Receive Stock,
// Discount [as a tap target], Pay, Notes, Transactions, Inventory).
// Official UK legal/institutional names are also left untranslated:
// HMRC, Consumer Rights Act 2015, Making Tax Digital, UK Finance.
// GDPR is localized to "AVG" (Algemene Verordening Gegevensbescherming),
// the standard Dutch-language term for the same regulation.
// Numbers: decimal points rendered as Dutch commas (1,2%), thousands as
// Dutch periods (£1.000); GBP amounts and all facts/figures preserved
// as in the English source (this is UK-market source content).

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch4NewArticlesTranslations: LocaleTranslations = {
  "purchase-orders-guide-askbiz": {
    title: "Inkooporders: leveranciersbestellingen aanmaken, versturen en ontvangen in AskBiz POS",
    description:
      "Hoe de tegel Inkooporders in POS > Bewerkingen echt werkt — een order opstellen met automatisch voorgestelde bestelhoeveelheden, deze via WhatsApp naar je leverancier sturen, en voorraad ontvangen (ook bij deelleveringen) zonder een spreadsheet aan te raken.",
    keywords: [
      "inkooporders",
      "leveranciersbestellingen",
      "voorraad aanvullen",
      "bijbestellen",
      "POS",
      "AskBiz",
      "voorraad",
      "backorder",
      "WhatsApp leverancier",
      "voorraad ontvangen",
    ],
    keyTakeaways: [
      "Inkooporders bevindt zich in POS > Bewerkingen > Retail, geopend via de tegel 📋 — het is een volwaardig tabblad, geen pop-up die bovenop Voorraad is geplakt.",
      "Bij het starten van een nieuwe order worden automatisch alle producten voorgevuld die op of onder hun voorraadwaarschuwingsdrempel zitten, met een voorgestelde hoeveelheid die de voorraad aanvult tot dubbel de drempel en de laatst geregistreerde kostprijs van het product — je kunt elke regel nog aanpassen of verwijderen, of handmatig producten toevoegen.",
      "Het versturen van een inkooporder stuurt een gespecificeerd bericht naar het WhatsApp-nummer van je leverancier; als de geautomatiseerde template niet beschikbaar is, valt het systeem terug op een vooraf ingevulde wa.me-link die je zelf verstuurt. Een leverancier zonder telefoonnummer kan helemaal niet worden benaderd.",
      "Voorraad ontvangen gebeurt per regel, dus deelleveringen zijn heel normaal: een order wordt 'Gedeeltelijk' zodra één regel niet volledig is geleverd, en wordt pas 'Ontvangen' zodra elke regel volledig binnen is.",
      "Wat je kunt doen hangt af van je POS-rol — Owner en Manager hebben volledige toegang, Inventory kan orders aanmaken en ontvangen maar niet versturen, en Supervisor/Branch Manager kunnen alleen bekijken.",
    ],
    content: [
      {
        heading: "Waar je het vindt",
        body: "Inkooporders is een tegel binnen POS > Bewerkingen, in de sector Retail — let op het icoon 📋. Als je erop tikt, opent een apart tabblad Inkooporders met een eigen lijst, filters (Alle / Backorders / Ontvangen) en een knop '+ Nieuwe order' rechtsboven. Als je bijbestelproces tot nu toe betekende dat je zelf een leverancier appte en hoopte dat je alle artikelen had onthouden, dan is dit de tool die dat gewoontegedrag vervangt — het zit in dezelfde app waarmee je al verkoopt, dus er is niets aparts om op in te loggen.",
      },
      {
        heading: "Een nieuwe order starten",
        body: "Tik op '+ Nieuwe order' en je wordt eerst gevraagd naar een leverancier — kies een bestaande uit de dropdown, of voeg direct een nieuwe toe met alleen een naam en een telefoonnummer. Dat telefoonnummer is belangrijk: het wordt later gebruikt voor de WhatsApp-verzendstap, en zonder nummer kan die order niet worden verstuurd, alleen handmatig aangemaakt en bijgehouden.\n\nOnder de leverancier opent de artikellijst al gevuld: AskBiz kijkt naar elk product dat momenteel op of onder zijn voorraadwaarschuwingsdrempel zit en voegt het toe als regel, met een voorgestelde bestelhoeveelheid die berekend is om de voorraad terug te brengen naar ongeveer het dubbele van die drempel, en een stukprijs die is overgenomen van de laatst geregistreerde kostprijs van het product. Je hoeft hier niets van te accepteren — pas de hoeveelheid of kostprijs op elke regel aan, verwijder regels die je niet wilt, of gebruik de dropdown 'Product toevoegen' eronder om iets anders uit je assortiment toe te voegen dat niet laag in voorraad was. Een lopend totaal wordt bijgewerkt terwijl je bezig bent, en een notitieveld onderaan is een goede plek voor leveringsinstructies of een referentienummer dat je leverancier verwacht.",
      },
      {
        heading: "De vijf orderstatussen",
        body: "Elke order heeft een van vijf statussen, weergegeven als een gekleurde pil op de kaart: Concept (aangemaakt maar nog niet verstuurd), Besteld (verstuurd naar de leverancier, nog niets ontvangen), Gedeeltelijk, Ontvangen of Geannuleerd. Gedeeltelijk is het waard om apart te begrijpen — het is geen aparte actie die je kiest, het is wat een order automatisch wordt zodra je een deel maar niet alles hebt ontvangen van wat je hebt besteld. Als je 50 stuks van iets bestelt en er komen er vandaag 30 binnen met de rest volgende week, verandert de order naar Gedeeltelijk op het moment dat je die 30 registreert, en blijft daar — precies tonend wat nog openstaat — totdat de resterende 20 binnenkomen en de status vanzelf naar Ontvangen springt. Het filter Backorders bovenaan de lijst toont simpelweg elke order die momenteel op Gedeeltelijk staat, zodat je in één oogopslag ziet welke leveringen nog uitstaan.",
      },
      {
        heading: "Een order naar je leverancier versturen",
        body: "Open een order met status Concept of Besteld en tik op Versturen (dit wordt Opnieuw versturen zodra een order al eens verstuurd is). AskBiz stelt een gespecificeerd bericht samen — elke regel als \"artikel x aantal @ kostprijs\", het totaal, en je notities als je die hebt toegevoegd — en probeert dit af te leveren als een geautomatiseerd WhatsApp-templatebericht rechtstreeks naar het nummer van de leverancier. Als dat geautomatiseerde pad niet beschikbaar is, valt het terug op het openen van een vooraf ingevulde wa.me-link in een nieuw tabblad met hetzelfde bericht al ingetypt, zodat je zelf op versturen tikt in WhatsApp. In beide gevallen gaat een order met status Concept over naar Besteld bij de eerste verzending, en wordt de verzendtijdstempel bij elke volgende verzending vernieuwd. Als het leveranciersrecord geen telefoonnummer heeft, is de knop Versturen uitgeschakeld en verschijnt een hint dat je er een moet toevoegen — er is geen manier omheen.",
      },
      {
        heading: "Voorraad ontvangen",
        body: "Wanneer goederen aankomen, open je de order en tik je op 'Voorraad ontvangen'. Je ziet elke regel met een invoerveld dat standaard is ingesteld op de volledige openstaande hoeveelheid (wat besteld is minus wat al op die regel is ontvangen) — regels die al volledig ontvangen zijn, zijn grijs en kunnen niet meer worden aangepast. Pas een hoeveelheid naar beneden aan als er maar een deel van die regel is aangekomen, en bevestig dan.\n\nBevestigen is wat de voorraad daadwerkelijk verplaatst: elke regel verhoogt automatisch de actuele voorraadtelling van dat product in je voorraad (hetzelfde cijfer waar je kassa en Overzichtscherm uit lezen), en de status van de order wordt herberekend op basis van de nieuwe cijfers — Ontvangen als elke regel nu volledig binnen is, Gedeeltelijk als sommige regels nog tekortschieten, ongewijzigd in andere gevallen. Je kunt terugkomen en meerdere keren tegen dezelfde order voorraad ontvangen naarmate een levering in fasen binnenkomt; elke ontvangst vraagt alleen naar wat nog openstaat.",
      },
      {
        heading: "Wie wat kan doen",
        body: "Acties met inkooporders zijn afgeschermd per POS-rol, niet met één alles-of-niets-schakelaar. Owner en Manager kunnen orders bekijken, aanmaken, versturen, ontvangen en als betaald markeren. De rol Inventory kan orders aanmaken en ontvangen (en als betaald markeren) maar kan ze niet versturen — versturen is bewust voorbehouden aan het management. De rollen Supervisor en Branch Manager kunnen orders en hun status bekijken, maar kunnen niet aanmaken, versturen of ontvangen. Als een knop uitgeschakeld lijkt of iemand vertelt je dat ze de optie Versturen niet zien, controleer dan eerst hun toegewezen rol voordat je aanneemt dat er iets kapot is.",
      },
    ],
    keyTakeawaysHeadingNote: undefined,
    faq: [
      {
        q: "Waarom had AskBiz al artikelen toegevoegd aan mijn nieuwe inkooporder voordat ik iets had getypt?",
        a: "Het aanmaakformulier vult automatisch elk product in dat momenteel op of onder zijn voorraadwaarschuwingsdrempel zit, met een voorgestelde hoeveelheid die de voorraad terugbrengt tot ongeveer het dubbele van die drempel, en de laatst geregistreerde kostprijs. Het is een startpunt, geen definitieve order — bewerk, verwijder of voeg regels vrij toe voordat je opslaat.",
      },
      {
        q: "Wat betekent 'Gedeeltelijk' precies bij een order?",
        a: "Het betekent een backorder: een deel maar niet alles van de bestelde hoeveelheid is aangekomen. De status wordt automatisch ingesteld zodra je op ten minste één regel minder ontvangt dan de volledige openstaande hoeveelheid, en de order blijft Gedeeltelijk totdat elke regel volledig is ontvangen.",
      },
      {
        q: "Kan ik een inkooporder versturen zonder telefoonnummer van de leverancier?",
        a: "Nee. Versturen levert de order af als een WhatsApp-bericht (of een vooraf ingevulde WhatsApp-link als terugvaloptie), dus een leverancier heeft een telefoonnummer nodig voordat je kunt versturen. Je kunt de order nog steeds aanmaken en bijhouden zonder nummer — je kunt hem alleen niet versturen totdat er een nummer is toegevoegd.",
      },
      {
        q: "Als ik vandaag een deel van een order ontvang, kan ik de rest later ontvangen?",
        a: "Ja. Elke ontvangst vraagt alleen naar hoeveelheden die nog openstaan, en je kunt dezelfde order opnieuw openen en er weer tegen ontvangen naarmate latere leveringen binnenkomen. Elke keer wordt voorraad stapsgewijs toegevoegd — niets wordt tussen ontvangsten ongedaan gemaakt of overschreven.",
      },
      {
        q: "Welke personeelsrollen kunnen een inkooporder naar een leverancier versturen?",
        a: "Alleen Owner en Manager kunnen versturen. Personeel met de rol Inventory kan orders aanmaken en ontvangen maar niet versturen, en de rollen Supervisor/Branch Manager kunnen orders alleen bekijken, niet ermee handelen.",
      },
    ],
  },
  "connect-marketing-ads-sources-askbiz": {
    title: "Koppel je marketinggegevens: Meta Ads, Google Ads, Google Analytics, Mailchimp & Klaviyo",
    description: "Hoe je de vijf bronnen onder Marketing & Advertenties in AskBiz koppelt — Meta Ads, Google Ads, Google Analytics, Mailchimp en Klaviyo — en wat elke bron synchroniseert naar je dashboard.",
    keywords: [
      "Meta Ads", "Google Ads", "Google Analytics", "Mailchimp", "Klaviyo",
      "Marketing & Advertenties bronnen", "AskBiz Sources", "advertentiekosten", "ROAS",
      "e-mailmarketing", "marketinggegevens koppelen",
    ],
    keyTakeaways: [
      "Sources > Marketing & Advertenties heeft vijf connectoren: Meta Ads, Google Ads, Google Analytics, Mailchimp en Klaviyo — elk haalt een ander deel van je marketingprestaties naar AskBiz.",
      "Vier van de vijf verbind je met één klik via OAuth (Meta Ads, Google Ads, Google Analytics, Mailchimp). Klaviyo is de uitzondering — je plakt een privé-API-sleutel in plaats daarvan, omdat Klaviyo geen OAuth-appflow biedt voor dit soort leestoegang.",
      "Elke bron voedt andere cijfers: Meta Ads en Google Ads brengen advertentiekosten/ROAS/CPM/CPC, Google Analytics brengt sitebezoek en funnels, Mailchimp brengt campagneprestaties, en Klaviyo brengt aan e-mail toegeschreven omzet.",
      "Op het gratis abonnement kun je in totaal maximaal 3 databronnen koppelen, in elke categorie samen — dus een mix van bijvoorbeeld Meta Ads, Mailchimp en je kassasysteem gebruikt je hele quotum al. Growth- en Business-abonnementen heffen deze limiet volledig op.",
      "Dit zijn geen placeholder-connectoren — elke connector heeft echte synchronisatielogica erachter, dus eenmaal gekoppeld halen ze doorlopend live gegevens op, niet slechts een eenmalige import.",
    ],
    content: [
      {
        heading: "Waar je ze vindt",
        body: "Open Sources vanuit de hoofdnavigatie van AskBiz. De connectoren zijn gegroepeerd per categorie, en Marketing & Advertenties is een van die groepen, naast E-commerce, Boekhouding, Betalingen en de rest. Daarin vind je vijf kaarten: Meta Ads, Google Ads, Google Analytics, Mailchimp en Klaviyo. Je kunt ook het zoekvak bovenaan de Sources-pagina gebruiken — door \"ads\", \"mailchimp\" of \"klaviyo\" te typen, filter je meteen naar de juiste kaart. Elke kaart toont een korte beschrijving van wat er wordt gesynchroniseerd, en een Connect-knop. Eenmaal gekoppeld verplaatst een bron naar de lijst \"Verbonden\" bovenaan de pagina, waar je op elk moment een handmatige synchronisatie kunt starten of de koppeling kunt verbreken.",
      },
      {
        heading: "Meta Ads — Facebook- en Instagram-advertentieprestaties",
        body: "Meta Ads koppelt je Facebook- en Instagram-advertentieaccount. Klik op Connect en AskBiz stuurt je door naar Meta om in te loggen en leestoegang tot je advertentieaccounts goed te keuren — er is niets te typen of te plakken. Eenmaal goedgekeurd synchroniseert het je advertentiekosten samen met ROAS (rendement op advertentie-uitgaven), CPM (kosten per duizend vertoningen) en CPC (kosten per klik), zodat je ziet wat je advertentiebudget daadwerkelijk oplevert zonder Ads Manager apart te openen. Dit is handig om de link te leggen tussen wat je uitgeeft aan Facebook- en Instagram-advertenties en wat er daadwerkelijk terechtkomt in je verkopen — vooral als je ook Instagram Shopping of een Shopify-winkel via AskBiz gebruikt, aangezien uitgaven en omzet dan naast elkaar staan.",
      },
      {
        heading: "Google Ads — prestaties van zoekcampagnes",
        body: "Google Ads werkt op dezelfde manier als Meta Ads: klik op Connect, log in bij je Google-account en keur alleen-lezen toegang tot je advertentieaccounts goed. Het synchroniseert je uitgaven aan zoekcampagnes, ROAS en conversies, zodat je kunt bijhouden wat je Google-zoekadvertenties kosten versus wat ze opleveren. Als je al Google Ads gebruikt om verkeer naar een website of winkel te sturen, betekent het koppelen hier dat die uitgaven naast je andere marketing- en omzetcijfers verschijnen in plaats van alleen in een aparte Google Ads-login te staan.",
      },
      {
        heading: "Google Analytics — sitebezoek en funnels",
        body: "Google Analytics is een aparte connector van Google Ads, ook al gaan beide via Google's login. Deze verbindt met een GA4-property op je website — het gaat over wat er gebeurt zodra iemand op je site landt, niet over wat je hebt betaald om ze daar te krijgen. Het synchroniseert bezoek en sessies, funnelgegevens (waar bezoekers afhaken voordat ze converteren), en e-commerce-omzet als je GA4's e-commerce-tracking hebt ingesteld. Klik op Connect, log in met het Google-account dat toegang heeft tot je GA4-property, en keur de toegang goed. Dit combineren met Google Ads of Meta Ads geeft je het volledige plaatje: wat je hebt uitgegeven om iemand naar je site te krijgen, en wat ze daar daadwerkelijk hebben gedaan.",
      },
      {
        heading: "Mailchimp — prestaties van e-mailcampagnes",
        body: "Mailchimp koppelt eveneens via OAuth — klik op Connect, log in bij Mailchimp en keur de toegang goed. Het synchroniseert je campagnes samen met openpercentages, klikpercentages en publieksgegevens, zodat je e-mailmarketingprestaties in hetzelfde dashboard staan als je verkopen en advertentiekosten, in plaats van alleen in de eigen rapportage van Mailchimp.",
      },
      {
        heading: "Klaviyo — de uitzondering: een geplakte API-sleutel, geen OAuth",
        body: "Klaviyo is de uitzondering onder de vijf. In plaats van een Connect-knop die je doorstuurt om in te loggen, zie je een veld dat vraagt om een privé-API-sleutel. Om er een te krijgen, log je in bij Klaviyo, ga je naar Account, dan Settings, dan API Keys, en maak (of kopieer) je daar een privé-API-sleutel. Plak deze in het veld in AskBiz en verbind. Dit is een bewust verschil in hoe de connector werkt, geen kapotte OAuth-flow — Klaviyo's API voor dit soort leestoegang op accountniveau is sleutelgebaseerd in plaats van OAuth-gebaseerd, dus een privésleutel is de juiste en verwachte manier om te koppelen. Omdat een privé-API-sleutel een echte inlogcode is, behandel je die net zo als een wachtwoord: genereer hem alleen vanuit je eigen Klaviyo-account, en deel hem nergens anders dan direct in het AskBiz-veld. Eenmaal gekoppeld synchroniseert Klaviyo aan e-mail toegeschreven omzet, je flows (geautomatiseerde e-mailreeksen), openpercentages en attributie — zodat je ziet hoeveel omzet je Klaviyo-e-mails daadwerkelijk opleveren, niet alleen hoeveel mensen ze hebben geopend.",
      },
      {
        heading: "Bronlimieten op het gratis abonnement",
        body: "Het gratis abonnement staat in totaal maximaal 3 gekoppelde databronnen toe, en die limiet geldt over alle categorieën samen — het is niet 3 per categorie. Dus als je Meta Ads, Mailchimp en je AskBiz-kassasysteem koppelt, heb je je volledige quotum al gebruikt en moet je er eerst een loskoppelen voordat je een vierde toevoegt, of dat vierde nu Klaviyo, Shopify, of iets anders is. Growth- en Business-abonnementen heffen deze limiet volledig op, waardoor je onbeperkt bronnen uit AskBiz's volledige integratielijst kunt koppelen. Als marketinggegevens voor jou een prioriteit zijn, is het de moeite waard om vooraf te bepalen welke bronnen het belangrijkst zijn op het gratis abonnement, of te upgraden als je alle vijf Marketing & Advertenties-connectoren wilt naast je verkoop- en boekhoudbronnen tegelijk.",
      },
      {
        heading: "Wat er gebeurt nadat je hebt gekoppeld",
        body: "Eenmaal gekoppeld verschijnt een bron in de lijst Verbonden bovenaan de Sources-pagina met een statusindicator en een \"laatst gesynchroniseerd\"-tijdstip. Dit zijn geen eenmalige imports — elk van de vijf heeft echte synchronisatielogica erachter die doorlopend verse gegevens ophaalt, en je kunt ook op \"Nu synchroniseren\" drukken bij elke gekoppelde bron als je meteen de laatste cijfers wilt in plaats van te wachten op de volgende automatische synchronisatie. Als een bron ooit een foutstatus toont — bijvoorbeeld als Klaviyo's API-sleutel is ingetrokken, of een OAuth-token opnieuw moet worden goedgekeurd — vertelt het foutbericht op die rij wat er mis is gegaan, en opnieuw koppelen is hetzelfde proces als de eerste keer koppelen.",
      },
    ],
    faq: [
      {
        q: "Waarom vraagt Klaviyo om een API-sleutel in plaats van me gewoon te laten inloggen zoals de andere?",
        a: "Meta Ads, Google Ads, Google Analytics en Mailchimp gebruiken allemaal OAuth, dus je logt in en keurt toegang goed met één klik. De Klaviyo-connector gebruikt in plaats daarvan een privé-API-sleutel, omdat dat de juiste manier is om dit soort leestoegang tot Klaviyo's API te verlenen. Genereer hem in Klaviyo onder Account, dan Settings, dan API Keys, en plak hem in AskBiz.",
      },
      {
        q: "Gebruiken Google Ads en Google Analytics dezelfde verbinding?",
        a: "Nee — het zijn twee aparte connectoren op de Sources-pagina, ook al leiden beide je via een Google-login. Google Ads synchroniseert je advertentiekosten en campagneprestaties; Google Analytics synchroniseert je websitebezoek en funnels vanuit een GA4-property. Je kunt elk apart koppelen, of allebei.",
      },
      {
        q: "Ik zit op het gratis abonnement — kan ik alle vijf Marketing & Advertenties-bronnen koppelen?",
        a: "Alleen als het de enige bronnen zijn die je koppelt. Het gratis abonnement staat in totaal maximaal 3 databronnen toe, over alle categorieën samen, niet 3 per categorie. Alle vijf Marketing & Advertenties-bronnen koppelen plus nog iets anders — je kassasysteem, Shopify, boekhoudsoftware — zou die limiet overschrijden. Growth- en Business-abonnementen hebben onbeperkte bronkoppelingen.",
      },
      {
        q: "Is het veilig om mijn Klaviyo-API-sleutel in AskBiz te plakken?",
        a: "Het veld is een wachtwoordachtige invoer, en wordt alleen gebruikt om de leestoegang van AskBiz tot je Klaviyo-account te verifiëren. Behandel de sleutel zelf net zoals je elke andere inlogcode zou behandelen — genereer hem alleen vanuit je eigen Klaviyo-account, en plak hem nergens anders dan direct in het AskBiz-koppelingsveld.",
      },
      {
        q: "Wat synchroniseert elke bron precies — is het een eenmalige import?",
        a: "Nee, geen van de vijf is een eenmalige import. Meta Ads en Google Ads synchroniseren uitgaven, ROAS, CPM/CPC en conversies; Google Analytics synchroniseert bezoek, sessies, funnels en e-commerce-omzet; Mailchimp synchroniseert campagnes, openpercentages, klikpercentages en publiek; Klaviyo synchroniseert e-mailomzet, flows, openpercentages en attributie. Elke bron blijft doorlopend synchroniseren eenmaal gekoppeld, en je kunt op elk moment een handmatige synchronisatie starten vanuit de lijst Verbonden.",
      },
    ],
  },
  "connect-gocardless-askbiz": {
    title: "Koppel GoCardless aan AskBiz voor automatische incasso en abonnementsbetalingen",
    description: "Hoe je GoCardless koppelt in AskBiz Sources, wat het synchroniseert, waar die gegevens terechtkomen, en wat het betekent voor je bronlimiet op het gratis abonnement.",
    keywords: [
      "GoCardless", "automatische incasso", "Bacs", "abonnementen", "machtigingen",
      "terugkerende betalingen", "AskBiz Sources", "Betalingen connector", "GoCardless koppelen",
    ],
    keyTakeaways: [
      "GoCardless bevindt zich in Sources > Betalingen, naast Stripe, PayPal, Klarna en SumUp.",
      "Het is een OAuth-verbinding met één klik — klik op Connect, log in bij GoCardless, keur alleen-lezen toegang goed. Er is geen API-sleutel om op te zoeken of te plakken.",
      "Het synchroniseert je automatische-incassobetalingen, elk voorzien van de machtiging die de betaling autoriseerde, zodat je een betaling kunt terugvoeren naar de klantovereenkomst erachter.",
      "GoCardless-gegevens worden weggeschreven naar een eigen gocardless_payments-tabel in plaats van je gedeelde Transacties-feed, omdat betalings- en machtigingsrecords niet in die vorm passen — dus het verschijnt nog niet in je normale verkooprapporten zoals Stripe of PayPal.",
      "Het telt mee voor de limiet van 3 gekoppelde bronnen op het gratis abonnement, net als elke andere connector; Growth- en Business-abonnementen hebben geen bronlimiet.",
    ],
    content: [
      {
        heading: "Waar je het vindt",
        body: "Open Sources vanuit de hoofdnavigatie van AskBiz en kijk onder de categorie Betalingen — het staat tussen PayPal en Klarna, naast Stripe en SumUp. AskBiz groepeert elke connector per categorie (E-commerce, Boekhouding, Betalingen, Marketing & Advertenties, enzovoort), dus Betalingen is waar alle vijf betaalgerelateerde bronnen samen staan in plaats van verspreid over de pagina. Als je liever niet scrolt, filtert het zoekvak bovenaan de Sources-pagina terwijl je typt, dus \"gocardless\" of \"automatische incasso\" typen springt direct naar de kaart. De kaart toont een korte beschrijving — automatische-incassobetalingen, abonnementen, machtigingen — en een Connect-knop. Eenmaal gekoppeld verplaatst het naar de lijst Verbonden bovenaan de pagina naast je andere bronnen, met een statuspunt en een laatst-gesynchroniseerd-tijdstip, waar je op elk moment een handmatige synchronisatie kunt starten of de koppeling kunt verbreken.",
      },
      {
        heading: "Koppelen: één klik, geen API-sleutel",
        body: "GoCardless is een OAuth-connector, geen sleutel-plakken-connector — de hint op de kaart luidt \"Doorverwijzing naar GoCardless — alleen-lezen toegang\", en dat is precies wat er gebeurt. Klik op Connect en AskBiz stuurt je naar het eigen inlogscherm van GoCardless, waar read_only-toegang wordt gevraagd. Log daar in en keur het goed, en GoCardless stuurt je meteen terug naar Sources. Je ziet of hanteert zelf nooit een toegangstoken, en er is niets om eerst uit een GoCardless-instellingenpagina te kopiëren — in tegenstelling tot bijvoorbeeld Klarna of SumUp in dezelfde groep Betalingen, die je wél vragen om API-gegevens te plakken. Zodra je toegang goedkeurt, zoekt AskBiz je GoCardless-crediteurenaccount op en gebruikt de naam ervan als weergavenaam van de bron in je lijst Verbonden, zodat het herkenbaar is als jouw bedrijf in plaats van te verschijnen als een generieke \"GoCardless\"-regel. Een eerste synchronisatie start automatisch direct nadat je hebt gekoppeld, dus je hoeft niet op Nu synchroniseren te drukken om het te zien werken.",
      },
      {
        heading: "Wat er daadwerkelijk wordt gesynchroniseerd",
        body: "Eenmaal gekoppeld haalt AskBiz je betalingen op uit GoCardless — elke automatische-incassoafschrijving op het account, of deze nu voltooid, in behandeling of mislukt is, teruggaand door je volledige betalingsgeschiedenis en daarna bijgewerkt bij elke synchronisatie erna. Elk betalingsrecord bevat het bedrag en de valuta, de status, de afschrijvingsdatum, en elke omschrijving die jij of GoCardless eraan heeft toegevoegd. Cruciaal is dat elk record ook de machtiging bevat die de betaling autoriseerde — de onderliggende automatische-incasso-overeenkomst die de klant heeft ondertekend — zodat een betaling niet zomaar een getal is, maar te herleiden tot de specifieke machtiging (en dus het abonnement of de overeenkomst) die deze heeft gegenereerd. In die zin dekt de connector \"betalingen, abonnementen en machtigingen\": je krijgt een volledige feed van betalingen, elk al gekoppeld aan de machtiging erachter, in plaats van drie afzonderlijke, losstaande datasets. Omdat AskBiz door de API bladert in plaats van een vaste batch op te halen, krijgt een bedrijf met een grote bestaande GoCardless-geschiedenis zijn volledige achterstand bij de eerste synchronisatie, niet alleen de meest recente afschrijvingen.",
      },
      {
        heading: "Waarom het nog niet in je normale rapporten verschijnt",
        body: "De meeste connectoren van AskBiz — Stripe en PayPal inbegrepen — voeden een gedeelde tabel die je Transacties-weergave, W&V en Rapporten-pagina's aandrijft. GoCardless doet dat bewust niet. Betalings- en machtigingsgegevens hebben een andere vorm dan een order of verkoop — een automatische-incassobetaling heeft geen productregel, geen klantnaam in hetzelfde formaat, of een kanaal zoals een Shopify-order dat heeft — dus schrijft AskBiz het naar een eigen, aparte tabel in plaats van het in de gedeelde tabel te dwingen. In de praktijk betekent dit dat je GoCardless-gegevens worden gesynchroniseerd, veilig opgeslagen en actueel gehouden — maar nog niet zijn samengevoegd met dezelfde verkooprapporten of W&V-weergave waar je Stripe- of PayPal-betalingen verschijnen. Als je op AskBiz vertrouwt voor één gecombineerd omzetoverzicht over betaalverwerkers heen, is GoCardless momenteel de ene connector in de groep Betalingen die net iets buiten dat beeld staat in plaats van erin. Dat is een reden om het toch te blijven koppelen — de gegevens worden vastgelegd en zijn klaar zodra de rapportage het inhaalt — maar geen reden om een directe één-op-één-match met hoe Stripe zich vandaag gedraagt te verwachten.",
      },
      {
        heading: "Bronlimieten op het gratis abonnement",
        body: "GoCardless krijgt geen speciale behandeling wat betreft abonnementslimieten — het telt als één koppeling tegen de limiet van 3 gekoppelde bronnen in totaal van het gratis abonnement, gecombineerd over alle categorieën, niet 3 per categorie. Dus als je al Shopify en Xero draait op Gratis, is GoCardless je derde en laatste plek tenzij je eerst iets anders loskoppelt. Growth- en Business-abonnementen heffen deze limiet volledig op, zodat je GoCardless naast Stripe, PayPal en al het andere in je stack kunt draaien zonder ergens voor te moeten kiezen. Als automatische incasso en abonnementsbetalingen een betekenisvol deel van je omzet zijn, is het de moeite waard om vooraf te bepalen of GoCardless een van je drie gratis plekken verdient, of dat upgraden logischer is zodra je op meer dan een paar bronnen tegelijk vertrouwt.",
      },
      {
        heading: "Als er iets misgaat",
        body: "Het OAuth-token van GoCardless voor deze koppeling heeft geen gedocumenteerde vernieuwingsflow, dus als de verbinding ooit stopt met werken, is de meest waarschijnlijke oorzaak dat het token opnieuw moet worden goedgekeurd, eerder dan een echte synchronisatiebug. Als een synchronisatie mislukt, schakelt de rij van de bron in je lijst Verbonden over naar een foutstatus met een kort bericht dat uitlegt waarom, en opnieuw koppelen is de oplossing: klik nogmaals op Connect en keur toegang opnieuw goed. Iets om te weten voordat je op Loskoppelen klikt: het is geen pauze. GoCardless verwijderen uit je lijst Verbonden verwijdert ook de gesynchroniseerde betalingsgeschiedenis, niet alleen de koppeling zelf. Als je loskoppelt om te troubleshooten in plaats van GoCardless definitief te verwijderen, synchroniseert opnieuw koppelen je betalingsgeschiedenis vers vanuit GoCardless in plaats van waar de oude gegevens waren gebleven.",
      },
    ],
    faq: [
      {
        q: "Heb ik een GoCardless-API-sleutel nodig om te koppelen?",
        a: "Nee. GoCardless koppelt via OAuth — klik op Connect op de Sources-kaart en je wordt doorgestuurd om in te loggen en alleen-lezen toegang goed te keuren op de eigen site van GoCardless. Er is geen sleutel of token om op te zoeken in je GoCardless-instellingen en in AskBiz te plakken.",
      },
      {
        q: "Verschijnen mijn GoCardless-betalingen in mijn AskBiz-rapporten of W&V naast Stripe en PayPal?",
        a: "Nog niet. GoCardless-betalings- en machtigingsgegevens worden opgeslagen in een eigen, aparte tabel in plaats van de gedeelde tabel die Rapporten, Transacties en W&V voedt — omdat die gegevens niet in dezelfde vorm passen als een order of verkoop. Ze worden gesynchroniseerd en opgeslagen, maar staan momenteel apart van je gecombineerde omzetoverzicht.",
      },
      {
        q: "Haalt de connector mijn abonnementen op als aparte lijst, of alleen betalingen?",
        a: "Het synchroniseert betalingen — elke automatische-incassoafschrijving, of deze nu voltooid, in behandeling of mislukt is — en elke betaling bevat de machtiging die deze autoriseerde, zodat je een betaling kunt terugvoeren naar de onderliggende overeenkomst. Het is geen aparte feed van abonnements- of machtigingsobjecten los van de betalingen zelf.",
      },
      {
        q: "Gebruikt het koppelen van GoCardless een van mijn gratis-abonnement-bronplekken?",
        a: "Ja. Het gratis abonnement staat in totaal maximaal 3 gekoppelde bronnen toe over alle categorieën samen, en GoCardless telt hetzelfde als elke andere connector — Stripe, Shopify, Xero, allemaal. Growth- en Business-abonnementen hebben geen bronlimiet.",
      },
      {
        q: "Mijn GoCardless-verbinding toont een fout — wat moet ik doen?",
        a: "Klik opnieuw op Connect vanaf de Sources-pagina en keur toegang opnieuw goed via het inlogscherm van GoCardless — dezelfde flow als de eerste keer koppelen. Let op: dit is anders dan loskoppelen — een foutstatus raakt je gesynchroniseerde betalingsgeschiedenis niet aan, maar als je eerst op Loskoppelen klikt, verwijdert dat de gesynchroniseerde GoCardless-betalingsgegevens samen met de koppeling, en synchroniseert opnieuw koppelen ze vers in plaats van de oude records te herstellen.",
      },
    ],
  },
  "connect-linnworks-askbiz": {
    title: "Koppel Linnworks aan AskBiz voor voorraadsynchronisatie via meerdere kanalen",
    description: "Stap-voor-stap gids voor het koppelen van Linnworks aan AskBiz — wat de OAuth-flow doet, welke gegevens daadwerkelijk worden gesynchroniseerd, en hoe vaak ze worden ververst.",
    keywords: ["Linnworks", "koppelen", "integratie", "AskBiz", "voorraad", "meerdere kanalen", "Sources", "orders", "orderafhandeling", "OAuth"],
    keyTakeaways: [
      "Linnworks bevindt zich onder Sources > Voorraad & Logistiek, naast Cin7 en ShipStation, en koppelt via OAuth — je autoriseert in Linnworks zelf, AskBiz ziet nooit een wachtwoord.",
      "Toegang is alleen-lezen: AskBiz kan je orders ophalen, maar kan niets aanmaken, bewerken of annuleren in je Linnworks-account.",
      "Wat wordt gesynchroniseerd zijn je openstaande orders — SKU, product, hoeveelheid, prijs, kanaal en afhandelingsstatus per orderregel — waar AskBiz omzet- en voorraadmutatiecijfers per kanaal van maakt. Het is geen aparte live-magazijnvoorraadfeed.",
      "Synchronisatiefrequentie volgt je AskBiz-abonnement zoals elke andere bron: dagelijks op Gratis, elke 6 uur op Growth, elk uur op Business.",
      "Dit is een volwaardig werkende connector met een eigen synchronisatiehandler en gegevensnormalisator — niet hetzelfde als AskBiz's oudere artikelen die Linnworks alleen noemen als voorbeeld van een multichannelplatform dat bedrijven zouden kunnen gebruiken.",
    ],
    content: [
      {
        heading: "Waar je het vindt",
        body: "Ga vanuit je AskBiz-dashboard naar Sources. Scrol naar beneden naar de sectie Voorraad & Logistiek — Linnworks staat daar naast Cin7 en ShipStation, met een korte beschrijving eronder: \"Voorraad, orders, orderafhandeling voor meerdere kanalen.\" Zowel Cin7 als ShipStation vragen je een API-sleutel te plakken (en bij Cin7 ook een account-ID) voordat ze koppelen. Linnworks is anders — het is de enige van de drie die een volledige OAuth-verbinding gebruikt, dus je klikt op de tegel en alles daarna gebeurt op de eigen site van Linnworks in plaats van in een formulier in AskBiz.",
      },
      {
        heading: "Voordat je koppelt",
        body: "Je hebt beheerder- of ten minste app-autorisatietoegang nodig op je Linnworks-account — hetzelfde toegangsniveau dat je nodig hebt om elke externe app binnen Linnworks zelf goed te keuren. Je hoeft vooraf geen API-sleutels, geheimen of tokens te genereren of kopiëren; AskBiz vraagt je niets te plakken voor deze specifieke connector, wat het belangrijkste praktische verschil is met Cin7 direct ernaast. De Sources-pagina vertelt je precies wat je kunt verwachten voordat je ergens op klikt: \"Doorverwijzing naar Linnworks — alleen-lezen toegang.\" Die regel is een letterlijke beschrijving van wat er hierna gebeurt, geen marketingtekst — AskBiz vraagt toestemming om je orders te lezen, en niets meer.",
      },
      {
        heading: "Stap 1 & 2: autoriseren in Linnworks",
        body: "Als je op de Linnworks-tegel klikt, kom je op het eigen OAuth-autorisatiescherm van Linnworks, waar je inlogt (als je dat nog niet bent) en precies bekijkt wat AskBiz wil lezen voordat je het goedkeurt. Je wordt nooit binnen AskBiz zelf om een Linnworks-wachtwoord gevraagd — de hele uitwisseling vindt plaats op het domein van Linnworks, wat standaard OAuth-praktijk is en hetzelfde patroon dat AskBiz gebruikt voor Shopify, Xero en zijn andere OAuth-gebaseerde bronnen. Als je besluit niet door te gaan, kun je dat scherm gewoon sluiten of verlaten; er wordt niets gekoppeld totdat je daadwerkelijk goedkeurt. Zodra je dat wel doet, stuurt Linnworks je automatisch rechtstreeks terug naar de Sources-pagina van AskBiz — er is geen code om ergens te kopiëren of te plakken.",
      },
      {
        heading: "Stap 3: wat er gebeurt nadat je hebt goedgekeurd",
        body: "Op de terugweg wisselt AskBiz de autorisatiecode die Linnworks doorgeeft in voor een toegangstoken, en slaat dat token vervolgens versleuteld op in je account, samen met de Linnworks-server-URL die Linnworks aan je account toewijst. Dat token is permanent — het verloopt niet zoals een normaal sessietoken — maar AskBiz gebruikt het nooit rechtstreeks tegen de order-API van Linnworks. In plaats daarvan presenteert het bij elke synchronisatie dat permanente token aan het AuthorizeByApplication-eindpunt van Linnworks om een vers, kortlevend sessietoken aan te maken (Linnworks' eigen sessietokens duren slechts ongeveer 20 minuten, veel korter dan elk realistisch synchronisatie-interval), en dat vers aangemaakte sessietoken wordt daadwerkelijk gebruikt om je orders op te halen. Je ziet hier niets van gebeuren — het is het mechanisme dat de verbinding betrouwbaar en onbeperkt in werking houdt, zonder je ooit te vragen opnieuw te koppelen of te autoriseren. Zodra je verbinding is opgeslagen, start AskBiz ook automatisch een eerste synchronisatie, dus er is niets meer te klikken.",
      },
      {
        heading: "Welke gegevens daadwerkelijk worden gesynchroniseerd",
        body: "Elke synchronisatie haalt je openstaande orders op uit Linnworks. Voor elke orderregel in elke order registreert AskBiz de SKU, productnaam, hoeveelheid, stukprijs, kostprijs per stuk (waar Linnworks er een levert), via welk verkoopkanaal de order binnenkwam, en de status van de order. Dat wordt genormaliseerd naar dezelfde velden per record die AskBiz gebruikt voor elke andere gekoppelde bron — bruto-omzet, kosten, marge, verkochte eenheden en voorraadmutatie — zodat je Linnworks-orders in je rapporten naast je Shopify-, Amazon- of POS-verkopen staan in plaats van als een aparte silo die je apart moet controleren. Als een order binnenkomt zonder orderregels, registreert AskBiz deze nog steeds als één rij met het ordertotaal, zodat er niets stilletjes verdwijnt alleen omdat het regelniveaudetail niet beschikbaar was. Het is de moeite waard om hier precies over te zijn: wat vandaag wordt gesynchroniseerd is orderactiviteit, geen op zichzelf staande live-magazijnvoorraadfeed. AskBiz leidt voorraadmutatie af van verkochte eenheden per order in plaats van rechtstreeks de absolute voorradige hoeveelheden van Linnworks op te halen — elke gesynchroniseerde order verlaagt het voorraadmutatiecijfer voor die SKU, maar AskBiz vraagt Linnworks niet apart \"hoeveel heb ik er nu nog in het magazijn\". Als je op Linnworks vertrouwt als je echte voorraadtelbron, blijf dat dan doen. AskBiz's weergave hier is ordergedreven, wat accuraat is voor omzet-, kanaal- en productprestatieanalyse, maar het is geen vervanging voor het controleren van live magazijntellingen in Linnworks zelf voordat je een inkoopbeslissing neemt.",
      },
      {
        heading: "Hoe vaak het opnieuw synchroniseert",
        body: "Eenmaal gekoppeld volgt Linnworks hetzelfde synchronisatieschema als elke andere bron, bepaald door je AskBiz-abonnement: eenmaal per dag op Gratis, elke 6 uur op Growth, en elk uur op Business. Linnworks heeft geen eigen tragere ondergrens zoals een paar andere connectoren dat wel hebben — Stripe is beperkt tot 3 uur en Etsy tot 8 uur zelfs op Business, omdat hun onderliggende gegevens simpelweg niet snel genoeg veranderen om vaker pollen te rechtvaardigen — dus Linnworks volgt gewoon welk tempo je abonnement toestaat, net als Shopify, Amazon of Xero. Als je vlak na een grote verkoopactie over je kanalen heen frissere cijfers wilt, ga dan terug naar de Sources-pagina, zoek Linnworks in je lijst met gekoppelde bronnen, en klik op Nu synchroniseren — dat start een synchronisatie op aanvraag buiten het reguliere schema, zonder invloed op wanneer de volgende geplande synchronisatie plaatsvindt. Dezelfde rij op die pagina toont een statuspunt (groen zodra het probleemloos synchroniseert, oranje of rood als er iets aandacht nodig heeft) en een \"laatst gesynchroniseerd\"-tijdstip, zodat je in één oogopslag ziet hoe actueel je Linnworks-gegevens zijn voordat je erop vertrouwt.",
      },
      {
        heading: "Als je AskBiz's gids over multichannelverkoop hebt gelezen",
        body: "AskBiz's algemene Academy-content over multichannelverkoop noemt Linnworks als voorbeeld van het soort platform dat bedrijven gebruiken om orders over kanalen heen te centraliseren — dat is een generieke verwijzing naar de categorie tool, geschreven voordat AskBiz rechtstreeks met Linnworks koppelde. Dit artikel gaat over iets anders: AskBiz's eigen directe koppeling met je Linnworks-account, hierboven beschreven. Als je Linnworks al gebruikt als je multichannelhub, dan is het koppelen hier wat die gegevens daadwerkelijk in de rapporten van AskBiz krijgt.",
      },
    ],
    faq: [
      { q: "Krijgt AskBiz schrijftoegang tot mijn Linnworks-account?", a: "Nee. De koppeling is alleen-lezen — AskBiz kan je ordergegevens ophalen maar kan niets aanmaken, bewerken, annuleren of afhandelen in Linnworks. De Sources-pagina vermeldt dit expliciet voordat je koppelt." },
      { q: "Laat dit me mijn exacte huidige voorraadniveaus uit Linnworks zien?", a: "Niet rechtstreeks. AskBiz synchroniseert je openstaande orders en leidt daaruit voorraadmutatie af (verkochte eenheden per SKU) — het haalt momenteel geen aparte live-magazijnvoorraadfeed op. Controleer Linnworks zelf voor je gezaghebbende voorradige hoeveelheden." },
      { q: "Hoe verschilt dit van de Linnworks-vermelding in AskBiz's artikel over multichannelverkoop?", a: "Dat artikel noemt Linnworks generiek, als voorbeeld van de categorie multichannelbeheertools die bedrijven gebruiken — het beschrijft geen koppeling met AskBiz. Dit artikel gaat over AskBiz's daadwerkelijke Linnworks-connector, die echte ordergegevens in je account haalt." },
      { q: "Hoe vaak worden mijn Linnworks-gegevens bijgewerkt in AskBiz?", a: "Dit volgt het normale synchronisatieschema van je abonnement: dagelijks op Gratis, elke 6 uur op Growth, elk uur op Business. Je kunt ook op elk moment een directe synchronisatie starten vanaf de Sources-pagina met de knop Nu synchroniseren." },
      { q: "Wat als ik opnieuw moet koppelen of iets er niet goed uitziet?", a: "Ga naar Sources, zoek Linnworks in je lijst met gekoppelde bronnen, en gebruik Loskoppelen gevolgd door opnieuw koppelen via dezelfde OAuth-flow. Als een synchronisatie mislukt, toont de statusrij een foutbericht in plaats van stil te blijven." },
    ],
  },
  "connect-xero-freeagent-askbiz": {
    title: "Koppel Xero of FreeAgent aan AskBiz",
    description: "Hoe je Xero of FreeAgent koppelt onder Sources > Boekhouding, wat elke bron synchroniseert naar AskBiz, en hoe ze verschillen van Sage en Wave in dezelfde categorie.",
    keywords: [
      "Xero", "FreeAgent", "AskBiz Sources", "Boekhouding connectoren",
      "Xero koppelen", "FreeAgent koppelen", "facturen synchroniseren", "boekhoudintegratie",
    ],
    keyTakeaways: [
      "Xero en FreeAgent bevinden zich beide onder Sources > Boekhouding, naast QuickBooks, Sage en Wave.",
      "Beide koppel je met één klik via OAuth — je logt in en keurt alleen-lezen toegang goed, zonder iets te plakken. Sage en Wave, in dezelfde categorie, vragen je in plaats daarvan API-gegevens te plakken.",
      "Wat daadwerkelijk in AskBiz binnenkomt zijn je facturen — zowel binnenkomend geld (verkoopfacturen) als uitgaand geld (rekeningen) — die je AskBiz-omzet- en kostenrapporten voeden.",
      "Dit is een aparte, eenrichtingsverbinding: AskBiz leest uit Xero/FreeAgent voor rapportagedoeleinden. Als je ook AskBiz POS gebruikt, stuurt zijn eigen (andere) Xero-integratie POS-verkopen naar Xero voor de boekhouding — dat zijn niet dezelfde verbindingen.",
      "Hoe vaak het opnieuw synchroniseert hangt af van je abonnement: dagelijks op Gratis, elke 6 uur op Growth, elk uur op Business.",
    ],
    content: [
      {
        heading: "Waar je ze vindt",
        body: "Open Sources vanuit de hoofdnavigatie van AskBiz. Connectoren zijn gegroepeerd per categorie, en Boekhouding is een van die groepen — naast E-commerce, Betalingen, Marketing & Advertenties en de rest. Binnen Boekhouding vind je vijf kaarten: QuickBooks, Xero, Sage, FreeAgent en Wave. Als scrollen niets voor je is, filtert het zoekvak bovenaan de Sources-pagina meteen naar een kaart wanneer je \"xero\" of \"freeagent\" typt. De kaart van Xero beschrijft facturen, bankreconciliatie, W&V en loonadministratie; de kaart van FreeAgent beschrijft facturen, uitgaven, belastingtijdlijn en cashflow — dat is in algemene zin het terrein dat elk platform bestrijkt. Wat AskBiz daadwerkelijk uit een van beide haalt, hierna behandeld, is smaller en specifiek: je facturen.",
      },
      {
        heading: "Xero koppelen",
        body: "Klik op Connect op de Xero-kaart. AskBiz stuurt je door naar Xero om in te loggen en alleen-lezen toegang tot je organisatie goed te keuren — er is geen client-ID, geheim of token om ergens op te zoeken en te plakken. Zodra je het goedkeurt, word je teruggestuurd naar AskBiz en verplaatst de kaart naar de lijst Verbonden bovenaan de pagina, met een statusindicator en een laatst-gesynchroniseerd-tijdstip.",
      },
      {
        heading: "FreeAgent koppelen",
        body: "FreeAgent werkt op dezelfde manier. Klik op Connect, log in bij FreeAgent, en keur alleen-lezen toegang goed — ook hier geen gegevens om handmatig te kopiëren. Omdat een FreeAgent-OAuth-token gekoppeld is aan één bedrijf, hoef je daarna geen tenant of bedrijf te kiezen zoals sommige multi-bedrijfsplatforms vereisen; de koppeling is gebonden aan het FreeAgent-bedrijf waarvoor je toegang hebt goedgekeurd.",
      },
      {
        heading: "Het verschil met Sage en Wave, er direct naast",
        body: "Xero en FreeAgent zijn de twee OAuth-koppelingen in de groep Boekhouding — je ziet bij geen van beide een formulierveld. Sage en Wave, in dezelfde lijst, werken anders: Sage vraagt je een Client ID en Client Secret te plakken van het Sage Developer Portal, en Wave vraagt om een toegangstoken gegenereerd vanuit Wave's eigen Settings > Developer-pagina. Als je gewend bent gegevens te plakken voor Sage of Wave, hoef je voor Xero of FreeAgent niet naar een vergelijkbaar veld te zoeken — voor deze twee is klikken op Connect en toegang goedkeuren in het eigen inlogscherm van de provider het hele proces.",
      },
      {
        heading: "Wat daadwerkelijk wordt gesynchroniseerd",
        body: "Eenmaal gekoppeld haalt AskBiz je facturen op uit Xero (of FreeAgent) en splitst ze op type. Verkoopfacturen — geld dat aan jou verschuldigd is — worden omzetposten in AskBiz, met de product-/regelomschrijving, hoeveelheid, prijs, valuta en betaalstatus (betaald, in behandeling of gedeeltelijk betaald) rechtstreeks van de factuur. Rekeningen — geld dat jij verschuldigd bent — worden kostenrecords, gelabeld met leverancier, bedrag, datum en categorie. Samen voeden die twee je AskBiz-W&V en kostenrapportage vanuit welk platform dan ook. Aan de Xero-kant worden facturen in pagina's opgehaald en gesorteerd op wanneer ze het laatst zijn bijgewerkt, dus wijzigingen die je in Xero aanbrengt — een betaling geregistreerd, een factuur aangepast — worden bij de volgende synchronisatie opgepikt in plaats van alleen op de oorspronkelijke aanmaakdatum van de factuur. De eigen bankreconciliatie-, loonadministratie- en belastingtijdlijnfuncties van Xero en FreeAgent blijven binnen Xero of FreeAgent zelf — AskBiz haalt die specifieke cijfers niet over, alleen de factuur- en rekeninggegevens.",
      },
      {
        heading: "De tokenverbinding actief houden",
        body: "OAuth-tokens verlopen periodiek van nature, en AskBiz vernieuwt beide automatisch op de achtergrond — voor Xero via zijn identiteitsservice, voor FreeAgent via zijn eigen token-eindpunt — zodat een normale synchronisatie je niet vraagt opnieuw in te loggen. Als een vernieuwing ooit mislukt (bijvoorbeeld als toegang is ingetrokken vanuit Xero of FreeAgent), toont de gekoppelde bron een foutstatus op de Sources-pagina met een kort bericht, en opnieuw koppelen is hetzelfde proces met één klik als de eerste keer.",
      },
      {
        heading: "Hoe vaak het opnieuw synchroniseert",
        body: "De synchronisatiefrequentie is gekoppeld aan je AskBiz-abonnement in plaats van aan de connector zelf: dagelijks op Gratis, elke 6 uur op Growth, en elk uur op Business. Noch Xero noch FreeAgent heeft een speciale tragere ondergrens zoals een paar andere connectoren dat wel hebben, dus je krijgt het normale interval van je abonnement. Als je de laatste cijfers wilt zonder te wachten, druk dan op \"Nu synchroniseren\" op de rij van de gekoppelde bron op de Sources-pagina en het haalt meteen op, ongeacht wanneer de volgende geplande synchronisatie verwacht wordt.",
      },
      {
        heading: "Loskoppelen of wisselen",
        body: "Beide bronnen staan eenmaal ingesteld in de lijst Verbonden, naast elke andere bron die je hebt gekoppeld, en elk heeft een eigen Loskoppelen-knop. Loskoppelen is een echte opschoning, geen pauze: AskBiz trekt het token in bij de provider en verwijdert de omzetrecords die die bron heeft gesynchroniseerd, zodat een oude of verkeerde koppeling geen cijfers achterlaat in je rapporten. Als je later opnieuw moet koppelen, of moet wisselen welke Xero-organisatie of FreeAgent-bedrijf is gekoppeld, koppel dan eerst los en ga daarna opnieuw via Connect om de nieuwe te autoriseren — de volgende synchronisatie vult je gegevens helemaal opnieuw.",
      },
      {
        heading: "Als je ook AskBiz POS met Xero gebruikt",
        body: "Het is de moeite waard om dit duidelijk te maken, omdat de namen overlappen: deze Sources-connector is een eenrichtingsverbinding naar AskBiz voor rapportagedoeleinden — het leest je Xero- of FreeAgent-gegevens zodat ze verschijnen in je dashboards en W&V. Als je AskBiz POS gebruikt, heeft POS zijn eigen aparte Xero-integratie onder zijn eigen instellingen, die het omgekeerde doet — het stuurt je POS-verkopen naar Xero als conceptfacturen, voor je boekhouding. De twee zijn niet aan elkaar gekoppeld en delen geen verbinding: de ene koppelen koppelt of beïnvloedt de andere niet, en je kunt de ene, beide, of geen van beide gebruiken, afhankelijk van wat je nodig hebt.",
      },
    ],
    faq: [
      {
        q: "Moet ik een API-sleutel of client secret plakken voor Xero of FreeAgent?",
        a: "Nee. Beide zijn OAuth-connectoren — klik op Connect, log in bij Xero of FreeAgent, en keur alleen-lezen toegang goed. Dat is anders dan Sage en Wave in dezelfde groep Boekhouding, die je wél vragen om gegevens te plakken.",
      },
      {
        q: "Stelt het koppelen van Xero aan Sources ook de POS-naar-Xero-boekhoudsynchronisatie in?",
        a: "Nee, dat zijn losstaande verbindingen. Deze Sources-connector haalt je Xero-gegevens naar AskBiz voor rapportagedoeleinden. AskBiz POS heeft zijn eigen, aparte Xero-integratie in zijn eigen instellingen die POS-verkopen naar Xero stuurt als conceptfacturen. De ene koppelen koppelt de andere niet.",
      },
      {
        q: "Welke gegevens verschijnen daadwerkelijk in AskBiz nadat ik koppel — alles uit Xero?",
        a: "Specifiek je facturen: verkoopfacturen worden omzetrecords (met hoeveelheid, prijs, valuta en betaalstatus) en rekeningen worden kostenrecords (leverancier, bedrag, categorie). De eigen bankreconciliatie-, loonadministratie- en belastingtijdlijnfuncties van Xero en FreeAgent worden niet overgehaald — die blijven in Xero of FreeAgent.",
      },
      {
        q: "Hoe vaak worden de gegevens ververst zodra ze gekoppeld zijn?",
        a: "Dit volgt het synchronisatie-interval van je AskBiz-abonnement — dagelijks op Gratis, elke 6 uur op Growth, elk uur op Business. Je kunt ook op elk moment op \"Nu synchroniseren\" klikken bij de gekoppelde bron om meteen de laatste gegevens op te halen in plaats van te wachten.",
      },
      {
        q: "Wat gebeurt er als mijn Xero- of FreeAgent-verbinding stopt met werken?",
        a: "AskBiz vernieuwt het onderliggende toegangstoken automatisch bij elke synchronisatie, dus dit zou normaal gesproken niets van jou vereisen. Als een vernieuwing wel mislukt — bijvoorbeeld omdat toegang is ingetrokken vanuit Xero of FreeAgent — toont de bron een foutstatus met een kort bericht op de Sources-pagina, en koppel je opnieuw op dezelfde manier als de eerste keer.",
      },
    ],
  },
  "connect-jumia-marketplace-askbiz": {
    title: "Koppel Jumia aan AskBiz: orders, uitbetalingen en voorraad voor Afrikaanse marktplaatsen",
    description:
      "Hoe je je Jumia Vendor Center-account koppelt aan AskBiz met een Client ID en Refresh Token, wat er daadwerkelijk wordt gesynchroniseerd, en wat nog buiten scope valt.",
    keywords: [
      "Jumia",
      "Jumia Vendor Center",
      "Jumia connector",
      "marktplaatsintegratie",
      "Afrikaanse e-commerce",
      "Sources",
      "AskBiz",
      "voorraadsynchronisatie",
      "ordersynchronisatie",
    ],
    keyTakeaways: [
      "Jumia bevindt zich onder Sources > E-commerce naast Shopify, Amazon FBA, eBay, Etsy, WooCommerce en Walmart — maar in tegenstelling tot die bronnen gebruikt het geen OAuth-verbinding met één klik.",
      "Je koppelt het handmatig, door een Client ID en Refresh Token te plakken die je zelf genereert in Jumia Vendor Center > Settings > Applications (Self Authorisation).",
      "Elke synchronisatie haalt recente orders en actuele voorraadniveaus op uit je Jumia-winkels; het uitbetalingscijfer dat per order wordt getoond, is een schatting op basis van orderomzet, niet Jumia's officiële afgehandelde uitbetalingsoverzicht.",
      "Jumia-voorraad voedt rechtstreeks je CFO-voorraadweergave en per kanaal gelabelde voorraadwaarschuwingen — Jumia-verzendingen en bezorgtracking vallen bewust buiten de scope van deze connector.",
      "Dit is een nieuw gebouwde connector, intern getoetst aan Jumia's API maar nog niet end-to-end geverifieerd op een live verkopersaccount — het is de moeite waard je eerste synchronisatie te controleren tegen de eigen cijfers van Vendor Center.",
    ],
    content: [
      {
        heading: "Wat de Jumia-connector doet",
        body: "Jumia is een van de E-commerce-bronnen onder Sources in AskBiz, naast Shopify, Amazon FBA, eBay, Etsy, WooCommerce en Walmart. Eenmaal gekoppeld is het een alleen-ophalen-synchronisatie: AskBiz leest je recente orders en actuele voorraadniveaus uit Jumia Vendor Center en verwerkt ze in je uniforme bedrijfsgegevens, dezelfde plek waar elk ander kanaal — je fysieke kassa, je Shopify-winkel, je Amazon-listings — terechtkomt. Dat is het hele punt van koppelen: in plaats van apart in te loggen bij Vendor Center om te checken hoe je Jumia-winkel het doet, verschijnen de orders en voorraad naast al het andere, in één dashboard, in je lokale valuta.",
      },
      {
        heading: "Waarom er geen knop 'Connect' met één klik is",
        body: "Shopify, Amazon FBA, eBay en Etsy gebruiken allemaal standaard OAuth — je klikt op Connect, wordt doorgestuurd om bij dat platform in te loggen, keurt toegang goed, en landt terug in AskBiz al gekoppeld. Jumia's Vendor Center biedt dat niet voor apps van derden. In plaats daarvan werkt het met wat Jumia Self Authorization noemt: je maakt je eigen Applicatie aan binnen je eigen Vendor Center-account, en dat genereert een Client ID en een Refresh Token die specifiek zijn voor jouw winkel. Er is geen door AskBiz beheerde app die je goedkeurt en er wordt nooit een wachtwoord tussen de twee doorgegeven — je genereert een inloggegevenspaar dat alleen jouw Jumia-account beheert, en geeft die twee waarden vervolgens rechtstreeks door aan AskBiz.",
      },
      {
        heading: "Je account koppelen, stap voor stap",
        body: "Log in bij Jumia Vendor Center en ga naar Settings, dan Applications. Klik op Create Application en kies Self Authorisation als type. Jumia toont je een Client ID — kopieer die — en laat je een Refresh Token genereren — kopieer die ook. Terug in AskBiz ga je naar Sources, zoek je Jumia onder E-commerce, en plak je het Client ID in het veld Client ID en het Refresh Token in het veld Refresh Token (dit laatste is gemaskeerd, zoals een wachtwoord). AskBiz controleert de gegevens meteen door een toegangstoken van Jumia op te vragen en te bevestigen dat het je winkellijst kan lezen voordat de koppeling wordt opgeslagen. Als die controle mislukt, is de meest voorkomende oorzaak dat de Applicatie geen Order- of Product-machtigingen heeft ingeschakeld in Vendor Center — ga terug en controleer of die rollen zijn aangevinkt, en probeer het dan opnieuw.",
      },
      {
        heading: "Wat er daadwerkelijk wordt gesynchroniseerd — en wat niet",
        body: "Elke synchronisatie haalt je recente orders op (een doorlopend venster, meest recente eerst) en, voor elke order, de individuele orderregels — Jumia's model levert één rij per verkocht stuk in plaats van een hoeveelheidsveld, dus een regel van 3 stuks in je winkel komt terug als drie afzonderlijke items, elk met zijn eigen prijs, korting, belasting en verzendcijfer. Voorraadniveaus komen van een apart catalogus-eindpunt, gesorteerd op SKU. Goed om te weten: het uitbetalingsbedrag dat je ziet bij een Jumia-order in AskBiz is berekend op basis van de netto-omzet van die order na kortingen, niet opgehaald uit Jumia's officiële afrekeningsoverzicht — Jumia toont echte commissie- en kostenaftrekken alleen via een apart uitbetalingsoverzicht-eindpunt dat deze connector momenteel niet leest. Behandel het uitbetalingscijfer als een bruikbare schatting om trends te volgen, niet als vervanging voor het uitbetalingsoverzicht binnen Vendor Center zelf wanneer je het exacte bedrag nodig hebt. De connector is ook aan beide kanten alleen-ophalen in scope: hij schrijft nooit terug naar je Jumia-listings, prijzen of voorraad, en raakt bewust nooit de verzend- of bezorgtrackinggegevens van Jumia — deze connector gaat over verkoop- en voorraadinzicht, niet over logistiek.",
      },
      {
        heading: "Waar je het terugziet in AskBiz",
        body: "Jumia-orders tellen mee voor je gecombineerde omzet- en ordertotalen over elk gekoppeld kanaal, elk geprijsd in de eigen lokale valuta van de winkel. Voorraadniveaus voeden je CFO-voorraadweergave, samengevoegd met hetzelfde product waar mogelijk — let op: Jumia's voorraadfeed bevat geen productnaam, dus totdat deze is gekoppeld aan een benoemde listing uit een ander kanaal, toont AskBiz in plaats daarvan de SKU. Voorraadwaarschuwingen zijn gelabeld per kanaal, zodat een waarschuwing dat een Jumia-SKU bijna op is niet wordt verward met dezelfde SKU die het prima doet in je fysieke winkel. En in het kanaalfilter van het tabblad Intelligence is Jumia een selecteerbare optie, zodat je Jumia-prestaties los van al het andere dat je verkoopt kunt bekijken.",
      },
      {
        heading: "Goed om te weten voordat je erop vertrouwt",
        body: "Deze connector is recent toegevoegd. Hij is intern gebouwd en getoetst aan Jumia's gedocumenteerde Vendor Center-API, maar is nog niet end-to-end getest tegen een live, actief Jumia-verkopersaccount — behandel je eerste synchronisatie dus als iets om te controleren tegen de eigen order- en voorraadcijfers van Vendor Center, in plaats van aan te nemen dat het vanaf dag één exact is. Als een synchronisatie stopt met werken met een fout over het refresh-token, betekent dat vrijwel altijd dat het is ingetrokken of verlopen in Vendor Center — genereer een nieuw Client ID en Refresh Token en koppel opnieuw vanuit Sources. Achter de schermen genereert AskBiz bij elke synchronisatie ook een vers toegangstoken vanuit je refresh-token in plaats van te proberen er een te hergebruiken, aangezien Jumia's toegangstokens kortlevend zijn, en het spreidt bewust zijn verzoeken om onder Jumia's snelheidslimiet te blijven in plaats van ze allemaal tegelijk af te vuren. Omdat elke synchronisatie een beperkte batch van je meest recente orders ophaalt, kan een winkel met zeer hoog volume zijn volledige recente geschiedenis over een paar synchronisaties zien invullen in plaats van in één keer bij de eerste run.",
      },
    ],
    faq: [
      {
        q: "Werkt het koppelen van Jumia op dezelfde manier als Shopify of Amazon, met een inlogomleiding?",
        a: "Nee. Shopify, Amazon FBA, eBay en Etsy gebruiken OAuth — je klikt op Connect en logt in op hun site. Jumia ondersteunt dat niet voor apps van derden, dus genereer je zelf een Client ID en Refresh Token in Jumia Vendor Center > Settings > Applications, en plak je beide in AskBiz onder Sources.",
      },
      {
        q: "Kan AskBiz mijn Jumia-prijzen, listings of voorraadniveaus wijzigen?",
        a: "Nee. De connector is alleen-ophalen — hij leest je orders en voorraad uit Jumia, maar schrijft nooit iets terug naar je Jumia-winkel.",
      },
      {
        q: "Zie ik Jumia-verzend- of bezorgstatus in AskBiz?",
        a: "Momenteel niet. Verzend- en bezorgtrackinggegevens vallen bewust buiten de scope van deze connector — hij bestrijkt orders, omzet en voorraad, geen logistiek.",
      },
      {
        q: "Het uitbetalingsbedrag bij een Jumia-order komt niet overeen met wat Jumia me daadwerkelijk betaalt — waarom?",
        a: "Dat cijfer is geschat op basis van de netto-omzet van de order na kortingen, niet opgehaald uit Jumia's officiële uitbetalingsoverzicht, dat echte commissie- en kostenaftrekken apart rapporteert. Gebruik het eigen uitbetalingsoverzicht van Vendor Center voor het exacte afgerekende bedrag.",
      },
      {
        q: "Mijn Jumia-synchronisatie stopte plotseling met werken — wat moet ik doen?",
        a: "Dit betekent vrijwel altijd dat je Refresh Token is ingetrokken of verlopen in Vendor Center. Genereer een nieuw Client ID en Refresh Token vanuit Settings > Applications en koppel opnieuw vanuit Sources met de nieuwe waarden.",
      },
    ],
  },
  "pos-receipt-design-vat-askbiz": {
    title: "AskBiz's vernieuwde kassabon: gespecificeerde lay-out & dynamische btw",
    description:
      "De kassabon die AskBiz na een verkoop via WhatsApp verstuurt, is nu een echte afbeelding in winkelbon-stijl — gescheurde randen, omkaderd totaal, decoratieve barcode — en de btw-regel verschijnt alleen voor bedrijven die daadwerkelijk een btw-nummer hebben geregistreerd.",
    keywords: [
      "kassabon-ontwerp",
      "kassabon",
      "WhatsApp-kassabon",
      "btw-kassabon",
      "dynamische btw",
      "AskBiz POS",
      "digitale kassabon",
      "kassabon-afbeelding",
    ],
    keyTakeaways: [
      "De kassabon die AskBiz na een verkoop via WhatsApp verstuurt, is nu een gerenderde afbeelding in de stijl van een echte kassabon — Courier Prime-monospace-lettertype, gescheurde/geperforeerde boven- en onderrand, een omkaderd TOTAAL en een decoratieve barcode — niet de platte tekstsamenvatting van vroeger.",
      "Een regel 'Btw-nr.' en een btw-belastinglabel ('Btw (tarief%)') verschijnen alleen als je bedrijf een btw-nummer heeft opgeslagen onder Instellingen. Geen btw-nummer geregistreerd betekent dat klanten in plaats daarvan een generieke 'Belasting'-regel zien — er is geen aparte aan/uit-schakelaar, het nummer zelf is de indicator.",
      "AskBiz probeert altijd eerst de afbeelding te versturen; als dat om welke reden dan ook mislukt, valt het automatisch terug op een kortere tekstsamenvatting, zonder dat jij iets hoeft in te stellen of opnieuw te proberen.",
      "De afbeelding wordt elke keer opnieuw gegenereerd op basis van de daadwerkelijke transactie zodra deze wordt opgehaald, dus het is nooit een verouderde schermafbeelding — en het ophalen zelf vereist geen inloggen, omdat het onraadbare transactie-ID zelf de toegang beperkt.",
    ],
    content: [
      {
        heading: "Wat er is veranderd",
        body: "Wanneer de kassabon van een klant na een verkoop via WhatsApp wordt verstuurd, kwam die vroeger binnen als een platte tekstbericht — een korte regel of twee met een samenvatting van het totaal, je bedrijfsnaam en de betaalmethode. Dat bestaat nog steeds als terugvaloptie, maar het is niet meer wat de meeste klanten zien. De primaire kassabon die AskBiz nu verstuurt, is een echte afbeelding, opgemaakt en vormgegeven om eruit te zien als een geprinte kassabon, met elk artikel, het subtotaal, elke korting, belasting en het eindtotaal precies zoals een papieren bon ze zou tonen. Aan jouw kant verandert er niets om dit te krijgen — het gaat automatisch bij elke verkoop waarbij een kassabon wordt verstuurd.",
      },
      {
        heading: "Hoe een vernieuwde kassabon eruitziet",
        body: "De afbeelding is gezet in Courier Prime, een monospace-lettertype in typemachinestijl, wat er grotendeels voor zorgt dat het aanvoelt als een kassabon in plaats van een generieke berichtkaart. De boven- en onderrand zijn getekend als een gescheurde/geperforeerde zigzaglijn, zoals een kassabon eruitziet als hij van een rol is afgescheurd. De TOTAAL-regel staat in een eigen omkaderd vak onderaan, zodat dit het ene cijfer is dat onmogelijk te missen valt. Daaronder staat een decoratieve barcode — een rij verticale streepjes van wisselende hoogte, deterministisch gegenereerd met het transactie-ID als kiemwaarde, zodat dezelfde kassabon altijd dezelfde streepjes toont als hij ooit opnieuw wordt opgehaald. Het is geen echte, scanbare barcode; hij staat er voor het visuele effect van een echte kassabon, met het bonnummer eronder afgedrukt op de plek waar een barcode normaal iets zou coderen.",
      },
      {
        heading: "Alles wat op de kassabon staat",
        body: "Van boven naar beneden gelezen: je bedrijfsnaam (in hoofdletters), gevolgd door de btw-registratieregel als je die hebt geregistreerd, dan een bonnummer — de eerste 8 tekens van het transactie-ID, streepjes verwijderd en in hoofdletters — samen met de datum en tijd. Daaronder verschijnt links 'Geholpen door [naam kassamedewerker]' als de verkoop is afgerekend onder een ingelogde kassamedewerker, met de betaalmethode in hoofdletters rechts. Dan de gespecificeerde regels: elke productnaam en het volledige regeltotaal op één regel, met de hoeveelheid en stukprijs eronder afgedrukt ('2 x £4,50'). Na de artikelen komt het subtotaal, een kortingsregel alleen als er daadwerkelijk een korting op de verkoop is toegepast, en een belastingregel alleen als de verkoop daadwerkelijk belasting droeg — een verkoop zonder belasting heeft simpelweg helemaal geen belastingregel. Het omkaderde TOTAAL sluit het af, gevolgd door de barcode, het bonnummer nogmaals, en een bedankregel.",
      },
      {
        heading: "Btw is dynamisch — het hangt af van je Instellingen",
        body: "De belastingregel staat niet vast op altijd 'Btw' of altijd 'Belasting' — het verandert per bedrijf, op basis van één ding: of je een btw-nummer hebt opgeslagen onder Instellingen. Als je er een hebt ingevoerd, toont de kassabon een regel 'Btw-nr.' direct onder je bedrijfsnaam, en wordt de belastingregel zelf gelabeld als 'Btw', met het tarief erbij als elk artikel op die verkoop hetzelfde belastingtarief deelt (bijvoorbeeld 'Btw (20%)'). Als je artikelen tegen gemengde tarieven worden belast, valt het terug op een gewoon 'Btw'-label in plaats van een tarief te raden. Als je geen btw-nummer hebt geregistreerd, verschijnt niets daarvan — de kassabon toont in plaats daarvan een generieke 'Belasting'-regel, zonder registratieregel boven de bedrijfsnaam. Er is nergens in AskBiz een aparte schakelaar hiervoor; het btw-nummerveld zelf is de enige registratie-indicator die het systeem heeft, dus het toevoegen of verwijderen ervan in Instellingen bepaalt of de btw-specifieke tekst op de kassabon aan of uit staat.",
      },
      {
        heading: "Hoe AskBiz beslist of de afbeelding wordt verstuurd of teruggevallen wordt op tekst",
        body: "Elke poging om een kassabon te versturen begint met het proberen van de afbeeldingstemplate. WhatsApp vereist dat zakelijke berichttemplates vooraf zijn goedgekeurd door Meta voordat ze kunnen worden gebruikt, en de header van de afbeeldingstemplate is geen vaste geüploade afbeelding — het is een link terug naar AskBiz die de eigen bezorgservers van Meta ophalen op het moment dat het bericht daadwerkelijk wordt verstuurd, wat precies de reden is waarom de kassabon altijd de echte transactie weerspiegelt in plaats van een gecachete afbeelding van eerder. Als die afbeeldingsverzending om welke reden dan ook mislukt — meestal omdat de template nog in Meta's controlewachtrij staat — probeert AskBiz automatisch een aparte, kortere goedgekeurde tekstsjabloon in plaats daarvan, met alleen het totaal, de bedrijfsnaam, de datum en de betaalmethode. Je ziet deze beslissing niet gebeuren en er is niets in te stellen: wat er ook lukt, is wat de klant krijgt, en zodra de afbeeldingstemplate volledig is goedgekeurd, lukken verzendingen als vanzelfsprekend op de afbeeldingspoging.",
      },
      {
        heading: "Waarom de link naar de kassabon geen inloggen vereist",
        body: "Omdat het de servers van Meta zijn — niet je browser of je kassa — die de kassabonafbeelding ophalen op het moment van bezorging, kan dat verzoek geen AskBiz-inlogsessie meedragen; er is geen gebruiker om te authenticeren. Daarom staat het eindpunt dat de afbeelding genereert bewust open, en de enige bescherming is dat het transactie-ID in de link een onraadbare UUID is in plaats van een klein oplopend nummer — hetzelfde vertrouwensmodel dat AskBiz gebruikt voor elke andere link die is beperkt tot één transactie. In de praktijk betekent dit dat de afbeeldingslink niet iets is dat je zomaar buiten WhatsApp zou willen doorsturen, aangezien iedereen met de exacte link die ene kassabon kan bekijken, maar het is niets waar je zelf iets aan hoeft te doen — het is de manier waarop de automatische verzending is ontworpen om te werken.",
      },
    ],
    faq: [
      {
        q: "Moet ik het nieuwe kassabon-ontwerp ergens inschakelen in Instellingen?",
        a: "Nee — de afbeelding-stijl kassabon is wat AskBiz nu automatisch verstuurt bij elke WhatsApp-kassabon. Er is geen schakelaar te vinden; als de verzending van de afbeeldingstemplate om welke reden dan ook mislukt, valt het systeem vanzelf terug op een tekstsamenvatting.",
      },
      {
        q: "Waarom staat er op mijn kassabon 'Belasting' in plaats van 'Btw'?",
        a: "De btw-tekst verschijnt alleen als je bedrijf een btw-nummer heeft opgeslagen onder Instellingen — dat veld is de enige btw-registratie-indicator die AskBiz heeft. Voeg daar je btw-nummer toe en zowel de regel 'Btw-nr.' als het btw-belastinglabel gaan op kassabonnen verschijnen.",
      },
      {
        q: "Waarom staat er soms gewoon 'Btw' zonder percentage bij de btw-regel?",
        a: "AskBiz drukt alleen een tarief af (zoals 'Btw (20%)') als elk artikel op die specifieke verkoop hetzelfde belastingtarief deelt. Als de verkoop artikelen mengt die tegen verschillende tarieven worden belast, toont het het gewone 'Btw'-label in plaats van één tarief te kiezen dat niet accuraat zou zijn voor de hele kassabon.",
      },
      {
        q: "Is de barcode op de kassabon iets dat een klant daadwerkelijk kan scannen?",
        a: "Nee — het is decoratief. De streepjes worden gegenereerd op basis van het transactie-ID, zodat dezelfde kassabon er altijd hetzelfde uitziet als hij opnieuw wordt bekeken, maar ze coderen niets dat een scanner kan lezen. De echte referentie voor een transactie is het bonnummer dat erboven en eronder is afgedrukt.",
      },
      {
        q: "Kan iedereen met de link naar de kassabonafbeelding de kassabon van iemand anders bekijken?",
        a: "De link is niet beschermd door een login — dat kan ook niet, aangezien WhatsApp's eigen bezorgservers hem ophalen, niet een ingelogde browser — maar hij is wel beschermd doordat het transactie-ID een onraadbare UUID is. Behandel de link zoals je elk eenmalig referentienummer zou behandelen: prima zoals verstuurd naar de klant via WhatsApp, niet iets om ergens anders te publiceren of door te sturen.",
      },
    ],
  },
  "whatsapp-daily-pl-brief-askbiz": {
    title: "Je dagelijkse update komt nu binnen als een WhatsApp-w&v-rapport",
    description:
      "Het automatische dagelijkse bericht van AskBiz komt nu binnen op WhatsApp als een echt verkoop-, winst- en verliesrapport over de afgelopen 24 uur en de afgelopen 7 dagen — zo schakel je het in en dit betekenen de cijfers.",
    keywords: [
      "WhatsApp dagelijkse update",
      "WhatsApp w&v-rapport",
      "AskBiz meldingen",
      "winst en verlies",
      "dagelijks verkooprapport",
      "POS dagelijkse update",
      "WhatsApp meldingsinstellingen",
    ],
    keyTakeaways: [
      "Schakel het in bij Instellingen > Meldingen, onder Kanalen, door WhatsApp aan te zetten — een telefoonnummerveld verschijnt alleen zodra de schakelaar is ingeschakeld.",
      "Het wordt automatisch eenmaal per dag verstuurd, en alleen naar accounts met POS ingeschakeld die WhatsApp-meldingen aan hebben staan met een opgeslagen nummer. E-mail-only accounts ontvangen het niet.",
      "Elk bericht rapporteert verkopen, winst (verkopen minus de echte kostprijs per regel van de verkochte goederen) en verliezen door terugbetalingen — zowel voor de afgelopen 24 uur als de afgelopen 7 dagen — plus een link terug naar askbiz.co/home.",
      "Verliezen worden geteld op basis van wanneer de terugbetaling is verwerkt, niet wanneer de oorspronkelijke verkoop plaatsvond — het terugbetalen van een oude verkoop vandaag telt mee bij het verliescijfer van vandaag.",
      "Dit verving de vorige e-mailversie van het automatische dagelijkse bericht voor accounts die zich hebben aangemeld voor WhatsApp. Je Dagelijkse Update in de app — met de gezondheidsscore, afwijkingen en voorgestelde actie — is een aparte functie en werkt precies zoals voorheen.",
    ],
    content: [
      {
        heading: "Wat er precies is veranderd",
        body: "AskBiz stuurde vroeger automatisch een ochtend-e-mail opgebouwd rond drie AI-gegenereerde regels — iets dat verbeterde, iets dat aandacht nodig had, en een voorgestelde actie voor de dag. Die e-mail is teruggetrokken voor accounts die zich aanmelden voor WhatsApp. In plaats daarvan stuurt een dagelijkse cron-job nu een klare-taal w&v-rapport rechtstreeks naar WhatsApp: echte verkopen, echte winst en echte verliezen, rechtstreeks uit je transactiegegevens gehaald in plaats van samengevat in een verhaal. Geen AI-interpretatie, geen jargon — gewoon de cijfers voor de afgelopen 24 uur en de afgelopen 7 dagen, opgemaakt in de valuta van je account. De oude versie probeerde je te vertellen wat ertoe deed; deze versie geeft je gewoon de cijfers en laat jou beslissen.",
      },
      {
        heading: "Het inschakelen",
        body: "Ga naar Instellingen > Meldingen in AskBiz en zoek de sectie Kanalen. Hier staan twee schakelaars: E-mailwaarschuwingen en WhatsApp. Zet de WhatsApp-schakelaar aan, en er verschijnt meteen een telefoonnummerveld eronder — dit veld is verborgen totdat je de schakelaar inschakelt, dus als je nergens een nummer kunt invoeren, controleer dan eerst of de schakelaar zelf aanstaat. Voer je WhatsApp-nummer in internationale notatie in (bijvoorbeeld +254 700 000000) en sla op. Dat is de hele instelling — er is geen aparte aanmeldstap of bevestigingsbericht om goed te keuren, en geen wachttijd voordat het eerste bericht kan worden verstuurd. Als je de schakelaar later weer uitzet, verdwijnt het nummerveld weer, maar je opgeslagen nummer ontvangt niets meer totdat je hem weer inschakelt.",
      },
      {
        heading: "Wie het daadwerkelijk ontvangt",
        body: "De dagelijkse verzending is strenger afgeschermd dan het lijkt. Het gaat alleen naar accounts waarbij POS is ingeschakeld — als je AskBiz puur gebruikt voor gekoppelde bronnen zoals Shopify of bankfeeds zonder POS aan te zetten, wordt dit specifieke bericht niet naar jou verstuurd, ongeacht je meldingsinstellingen. Daarbovenop heb je zowel de WhatsApp-schakelaar aan als een opgeslagen nummer nodig; als je maar één van de twee hebt, wordt je overgeslagen en gaat de cron gewoon door naar het volgende account zonder iets voor jou te genereren. En het is strikt eenmaal per bedrijf per dag — als er al een update is gegenereerd voor je account voor de datum van vandaag, genereert of verstuurt de cron geen tweede, zelfs niet als je later die dag opnieuw kijkt. Er is ook geen handmatige 'nu versturen'-optie — het bericht gaat alleen op zijn eigen schema uit.",
      },
      {
        heading: "Hoe verkopen, winst en verliezen worden berekend",
        body: "Verkopen is het totaal van je voltooide POS-transacties in het venster — lopende kaart- of mobiele-geldbetalingen die nog niet bevestigd zijn, tellen niet mee totdat ze dat wel zijn. Winst is geen ruwe margeschatting — het is verkopen minus de daadwerkelijke kostprijs van de verkochte goederen, regel voor regel berekend op basis van de hoeveelheid en kostprijs die op elk verkocht product is geregistreerd, en dan opgeteld over het venster. Verliezen vertegenwoordigen de waarde van teruggenomen regelitems, niet slechts een telling van terugbetalingsgebeurtenissen, en worden gehaald uit een aparte set transacties — alles gemarkeerd als terugbetaald of gedeeltelijk terugbetaald. Hier is de logica makkelijk verkeerd te lezen: verliezen worden toegewezen aan de dag waarop de terugbetaling is verwerkt, niet de dag waarop de oorspronkelijke verkoop plaatsvond. Als een klant drie weken geleden iets kocht en je verwerkt de terugbetaling vanochtend, komt de volledige waarde van die terugbetaling in het verliescijfer van vandaag terecht — het past de dag van de oorspronkelijke verkoop niet met terugwerkende kracht aan. Over een periode van 7 dagen zorgt dit zelden voor verwarring, maar het is goed om te weten als je ooit een verliescijfer over 24 uur ziet dat los lijkt te staan van de daadwerkelijke handel van die dag.",
      },
      {
        heading: "Wat je te zien krijgt, en waar het naartoe linkt",
        body: "Het bericht zelf is een kort WhatsApp-tekstbericht: je bedrijfsnaam bovenaan, dan Verkopen, Winst en Verliezen over de afgelopen 24 uur, gevolgd door dezelfde drie cijfers over de afgelopen 7 dagen, en een link naar askbiz.co/home onderaan. Omdat het een gewoon WhatsApp-bericht is, zijn de cijfers zelf meteen leesbaar zodra het binnenkomt — geen app om te openen, geen login nodig alleen om ze te zien. De link is een snelkoppeling terug naar AskBiz als je verder in een cijfer wilt duiken; hem openen vraagt je nog steeds in te loggen, zoals elke andere AskBiz-link dat zou doen.",
      },
      {
        heading: "Wat dit niet vervangt",
        body: "Het is goed om hier de grens duidelijk te maken. Het WhatsApp-rapport is een aparte functie van je Dagelijkse Update in de app — die met een Bedrijfsgezondheidsscore, afwijkingsmeldingen en een voorgestelde actie, beschikbaar wanneer je AskBiz opent. Dat eindpunt en zijn gegevens zijn door deze wijziging niet aangeraakt en blijven onafhankelijk werken van of je WhatsApp-meldingen aan hebt staan. Wat wel is veranderd is de automatische push: het oude e-mailverhaal dat vroeger ongevraagd elke ochtend binnenkwam, is verdwenen voor accounts die zich hebben aangemeld voor WhatsApp, vervangen door dit meer letterlijke w&v-bericht. Als je de gezondheidsscore en de samenvatting in actie-item-stijl wilt, staat die nog steeds in de app — hij wordt alleen niet meer automatisch naar je telefoon gepusht.",
      },
    ],
    faq: [
      {
        q: "Ik gebruik AskBiz POS niet — krijg ik dit WhatsApp-bericht?",
        a: "Nee. De dagelijkse verzending gaat alleen naar accounts met POS ingeschakeld, omdat de verkoop-, winst- en verliescijfers worden berekend uit POS-transactie- en terugbetalingsgegevens. Als je AskBiz alleen gebruikt voor gekoppelde bronnen zoals Shopify of een bankfeed, wordt dit specifieke bericht niet naar jou verstuurd.",
      },
      {
        q: "Ik heb E-mailwaarschuwingen al aanstaan — moet ik nog iets anders doen?",
        a: "Ja. E-mailwaarschuwingen en WhatsApp zijn aparte schakelaars in Instellingen > Meldingen, en alleen de WhatsApp-schakelaar (plus een opgeslagen nummer) activeert dit dagelijkse bericht. Alleen E-mailwaarschuwingen aan hebben staan schakelt het niet in.",
      },
      {
        q: "Waarom komt een verlies in het bericht van vandaag van een verkoop die weken geleden is gedaan?",
        a: "Verliezen worden geteld op basis van de datum waarop de terugbetaling is verwerkt, niet de datum van de oorspronkelijke verkoop. Als je vandaag een oude transactie terugbetaalt, telt de waarde ervan mee bij het verliescijfer van vandaag, zowel in de 24-uurs- als de 7-dagen-totalen.",
      },
      {
        q: "Kan ik meer dan één van deze berichten krijgen als ik later die dag opnieuw in de app kijk?",
        a: "Nee. De update wordt eenmaal per bedrijf per kalenderdag gegenereerd — als er al een is aangemaakt voor vandaag, slaat de cron je account over in plaats van een duplicaat te genereren of te versturen.",
      },
      {
        q: "Vervangt dit de Dagelijkse Update die ik in de app zie, met de gezondheidsscore en voorgestelde actie?",
        a: "Nee, dat is een aparte functie en die is onaangeroerd. De Dagelijkse Update in de app berekent nog steeds zelfstandig zijn eigen gezondheidsscore, afwijkingen en actie-item, en je kunt hem op elk moment openen in AskBiz, ongeacht je WhatsApp-instellingen.",
      },
    ],
  },
  "forgot-pin-reset-whatsapp-askbiz": {
    title: "Je AskBiz-pincode vergeten? Reset hem zelf via WhatsApp",
    description:
      "Hoe je je eigen AskBiz-inlogpincode herstelt zonder contact op te nemen met support — verifieer je telefoon via WhatsApp en stel in minder dan een minuut een nieuwe 4-cijferige pincode in.",
    keywords: [
      "pincode vergeten",
      "pincode resetten",
      "AskBiz",
      "WhatsApp-verificatie",
      "inloggen",
      "telefooninloggen",
      "accountherstel",
      "handleiding",
    ],
    keyTakeaways: [
      "Pincode vergeten? op de inlogpagina start een self-service reset — voer je telefoonnummer in, bevestig een 6-cijferige code die via WhatsApp is verstuurd, en stel dan een nieuwe 4-cijferige pincode in.",
      "De code verloopt na 10 minuten, staat 5 pogingen toe, en er geldt een afkoelperiode van 60 seconden voordat je een nieuwe kunt aanvragen.",
      "Dit reset je eigen owner-inlogpincode voor de hoofd-AskBiz-app — het heeft niets te maken met POS-personeelspincodes voor de kassa, die een manager nog steeds reset via POS > Personeel > Bewerken > Pincode resetten.",
      "Voordat dit werd gelanceerd, had een uitgesloten eigenaar helemaal geen self-service optie — de enige weg was contact opnemen met support en wachten tot een beheerder handmatig een tijdelijke pincode genereerde en doorgaf.",
    ],
    content: [
      {
        heading: "Twee verschillende pincodes, en dit gaat over één ervan",
        body: "AskBiz heeft eigenlijk twee pincodes die je makkelijk kunt verwarren. Je inlogpincode is wat je gebruikt om op je eigen telefoonnummer in te loggen op de hoofd-AskBiz-app — het is hoe jij (de accounteigenaar) toegang krijgt tot je dashboard, rapporten en instellingen. Een POS-personeelspincode voor de kassa is iets volledig anders: een korte code die een manager toewijst aan elke kassamedewerker zodat ze kunnen inklokken bij de kassa zonder de login van de eigenaar te delen. Dit artikel gaat over de eerste — je eigen inlogpincode. Als een kassamedewerker zijn kassapincode is vergeten, wordt dat opgelost doordat een manager of eigenaar naar POS > Personeel gaat, op Bewerken klikt naast hun naam, en Pincode resetten kiest — daar is niets aan veranderd. Nieuw is een manier waarop jij je eigen inlogpincode kunt herstellen zonder de hulp van iemand anders."
      },
      {
        heading: "Waar je het vindt",
        body: "Kijk op de AskBiz-inlogpagina net onder het pincodeveld naar een link Pincode vergeten?. Als je erop klikt, kom je op een aparte herstelpagina op askbiz.co/forgot-pin, los van de hoofdinlogkaart, gebouwd als een smal, eendoelig scherm zodat het duidelijk is dat je in een herstelproces zit in plaats van normaal in te loggen."
      },
      {
        heading: "Stap 1: bevestig je telefoonnummer",
        body: "Voer het telefoonnummer in dat is geregistreerd bij je AskBiz-account, inclusief de juiste landcode — hetzelfde nummer waarmee je normaal inlogt. Tik op Verstuur code via WhatsApp. Welk nummer je ook invoert, je ziet daarna hetzelfde bevestigingsbericht: AskBiz onthult op dit scherm nooit of dat nummer daadwerkelijk bij een account hoort. Dat is bewust — het voorkomt dat het herstelproces kan worden gebruikt om te controleren welke telefoonnummers bij AskBiz zijn geregistreerd. Als het nummer wel bij een account hoort, komt er binnen enkele ogenblikken een 6-cijferige code binnen via WhatsApp."
      },
      {
        heading: "Stap 2: voer de code in en kies een nieuwe pincode",
        body: "Op het volgende scherm voer je de 6-cijferige code uit WhatsApp in samen met een nieuwe 4-cijferige pincode, twee keer getypt om te bevestigen dat hij overeenkomt. Bevestig, en — ervan uitgaande dat de code correct is en nog geldig — wordt je inlogpincode meteen bijgewerkt. Je komt op een bevestigingsscherm met een link rechtstreeks terug naar inloggen, waar je nieuwe pincode direct werkt."
      },
      {
        heading: "De limieten, en waarom ze er zijn",
        body: "Een paar limieten beschermen dit proces tegen misbruik. De code verloopt 10 minuten nadat hij is verstuurd, zodat een oude, ongebruikte code die ergens in een WhatsApp-gesprek staat niet later kan worden gebruikt. Je krijgt 5 pogingen om hem correct in te voeren voordat hij ongeldig wordt en je een nieuwe moet aanvragen. En als je op Code opnieuw versturen tikt, geldt er een afkoelperiode van 60 seconden voordat er daadwerkelijk een nieuwe uitgaat, wat voorkomt dat hetzelfde nummer met codes wordt overspoeld. Niets hiervan zou je bij een normale reset in de weg moeten staan — voer de code eenmaal correct in, binnen een paar minuten na aankomst, en je bent klaar. De limieten bijten alleen als er iets misgaat, precies wanneer je ze wilt hebben."
      },
      {
        heading: "Hoe AskBiz je telefoonnummer koppelt aan je account",
        body: "Achter de schermen zoekt AskBiz je telefoonnummer op in een speciaal daarvoor gebouwde tabel, in plaats van te vertrouwen op het telefoonnummer dat is opgeslagen in je algemene profielinstellingen. Dat onderscheid is belangrijk: het telefoonveld in je profiel is gewoon een bewerkbare instellingswaarde — je zou het op elk moment kunnen bijwerken, en niets voorkomt dat twee mensen per ongeluk een vergelijkbaar nummer invoeren. Het resetproces heeft een ondubbelzinnige, betrouwbare koppeling nodig tussen een telefoonnummer en precies één account voordat het iemand een pincode laat wijzigen, dus gebruikt het in plaats daarvan een apart identiteitsrecord, aangemaakt toen je je voor het eerst aanmeldde en sindsdien gesynchroniseerd gehouden."
      },
      {
        heading: "Hoe herstel er vroeger uitzag voordat dit bestond",
        body: "Tot eind juli 2026 was er helemaal geen self-service optie. Als je je AskBiz-inlogpincode vergat, was de enige weg om rechtstreeks contact op te nemen met support — via e-mail of WhatsApp — uit te leggen wie je was, en te wachten tot een beheerder aan de AskBiz-kant handmatig een tijdelijke pincode genereerde en die buiten het systeem om aan je doorgaf. Dat werkte, maar het betekende dat elke uitsluiting een mens aan de andere kant nodig had, en je was afhankelijk van hoe lang het duurde voordat iemand het oppakte. Het via WhatsApp geverifieerde proces doet hetzelfde werk in minder dan een minuut, op elk moment, zonder dat iemand anders erbij betrokken hoeft te zijn."
      },
    ],
    faq: [
      {
        q: "Is dit hetzelfde als de kassapincode van een kassamedewerker resetten?",
        a: "Nee. Dit reset je eigen owner-inlogpincode voor de hoofd-AskBiz-app. De kassapincode van een kassamedewerker is een volledig apart systeem, en die wordt nog steeds op dezelfde manier gereset — een manager of eigenaar gaat naar POS > Personeel, klikt op Bewerken naast dat personeelslid, en kiest Pincode resetten."
      },
      {
        q: "Ik heb mijn telefoonnummer ingevoerd maar nooit een WhatsApp-code ontvangen. Wat is er mis?",
        a: "Je ziet dezelfde 'controleer WhatsApp'-bevestiging, ongeacht of dat nummer daadwerkelijk is geregistreerd — dat is bewust zo, zodat de pagina niet kan worden gebruikt om te controleren welke nummers een account hebben. Als er niets binnenkomt, controleer dan of je het exacte nummer hebt ingevoerd waarmee je account is geregistreerd, inclusief de landcode, en probeer het opnieuw na de afkoelperiode van 60 seconden."
      },
      {
        q: "Hoeveel tijd heb ik om de code in te voeren voordat hij verloopt?",
        a: "10 minuten vanaf het moment dat hij is verstuurd. Daarna is hij niet meer geldig en moet je een nieuwe aanvragen vanaf het vorige scherm."
      },
      {
        q: "Wat gebeurt er als ik steeds de verkeerde code invoer?",
        a: "Je krijgt 5 pogingen. Daarna wordt de code om veiligheidsredenen ongeldig gemaakt en moet je een nieuwe aanvragen in plaats van te blijven raden."
      },
      {
        q: "Kan ik meteen een nieuwe code aanvragen als ik de eerste niet heb ontvangen?",
        a: "Er geldt een afkoelperiode van 60 seconden tussen codeaanvragen voor hetzelfde nummer. Tik na die periode op Code opnieuw versturen op het verificatiescherm om een nieuwe te krijgen."
      },
    ],
  },
  "zakat-calculator-charity-askbiz": {
    title: "De AskBiz Zakat-calculator: hoe hij werkt en waar je hem vindt",
    description:
      "Hoe het tabblad Zakat in Mijn Bedrijf je zakatpositie berekent op basis van live voorraad, contanten, vorderingen en schulden, nisab en hawl automatisch bijhoudt, en je verbindt met een directory van partnergoede doelen — gratis op elk abonnement.",
    keywords: [
      "zakat-calculator",
      "zakat-calculator voor bedrijven",
      "nisab-calculator",
      "hawl-tracker",
      "zakat-tool voor bedrijven",
      "islamitische financiën bedrijf",
      "zakat goede-doelen-directory",
      "AskBiz",
      "Mijn Bedrijf",
    ],
    keyTakeaways: [
      "De zakat-calculator bevindt zich in Mijn Bedrijf (/intelligence) onder zijn eigen tabblad Zakat — directe link /intelligence?tab=zakat — en is gratis op elk abonnement, ook Gratis, zonder upgrade vereist.",
      "Hij berekent zakat alleen over handelsvermogen: contanten + voorraad (verkoopwaarde) + vorderingen − schulden, met een ondergrens van nul. Elk cijfer kan worden overschreven voor één berekening zonder je echte voorraad of CFO-gegevens aan te raken.",
      "Nisab is de standaard gewichtsgebaseerde drempel (87,48g goud of 612,36g zilver, standaard zilver) omgerekend naar jouw valuta via een handmatige 'Huidige prijs controleren'-opzoeking — deze ververst niet vanzelf.",
      "Hawl (het maanjaar van 355 dagen) wordt automatisch bijgehouden: de voortgangsbalk begint op de dag dat je zakatbasis voor het eerst nisab overschrijdt en wordt gereset als deze er weer onder zakt voordat het jaar om is.",
      "Het is een rekenhulpmiddel, geen fatwa — het dekt geen madhhab-specifieke oordelen, landbouw- of veezakat, persoonlijk gedragen goud/zilver, of persoonlijk vermogen buiten het bedrijf.",
    ],
    content: [
      {
        heading: "Waar je het vindt",
        body: "Open Mijn Bedrijf vanuit de hoofdnavigatie — dat is de pagina op /intelligence — en selecteer het tabblad Zakat. Het staat naast Overzicht, CFO, Team, Logistiek, Markt en Acties, dus het is een volwaardig tabblad, geen verborgen instelling. Als je er direct naartoe wilt springen, is de directe link /intelligence?tab=zakat.\n\nGoed om te weten voordat je op een andere manier gaat zoeken: de AI-chat van AskBiz kan je nog niet direct naar dit tabblad linken, zoals hij dat wel kan voor sommige andere delen van de app. Vragen om \"neem me mee naar zakat\" brengt je niet op het tabblad — open Mijn Bedrijf en klik direct op Zakat in plaats daarvan.",
      },
      {
        heading: "Het is gratis op elk abonnement",
        body: "De zakat-calculator zit niet achter Growth, Business of een ander niveau — hij is beschikbaar op Gratis zonder dat je hoeft te upgraden. Dat is bewust: zakat is een religieuze verplichting gekoppeld aan je daadwerkelijke handelspositie, geen premium analysefunctie, dus AskBiz zet er geen betaalmuur voor.",
      },
      {
        heading: "Wat het daadwerkelijk berekent: de zakatbasis",
        body: "Elke keer dat je de calculator opent, haalt AskBiz vier live cijfers op uit je bedrijfsgegevens en combineert ze tot wat het de zakatbasis noemt:\n\n- Contanten — het kassaldo dat je hebt ingevoerd in je CFO-kosteninstellingen. Als je er nooit een hebt ingevoerd, toont de tegel 'Niet ingesteld' in plaats van dit stilzwijgend als nul te behandelen, zodat je je positie niet per ongeluk te laag inschat.\n- Voorraad — de verkoopwaarde van je actieve voorraad, berekend als verkoopprijs × aantal in voorraad voor alles wat je momenteel voert.\n- Vorderingen — geld dat aan jou verschuldigd is, gehaald uit je geregistreerde vorderingen.\n- Schulden — geld dat jij verschuldigd bent, afgetrokken van het totaal. Dit omvat elke inkooporder waar je voorraad tegen hebt ontvangen maar je leverancier nog niet volledig hebt betaald.\n\nDe zakatbasis is Contanten + Voorraad + Vorderingen − Schulden, met een ondergrens van nul zodat hij nooit negatief wordt. Dit dekt alleen handelsvermogen — het is geen momentopname van je hele balans, en het sluit bewust vaste activa zoals apparatuur of bedrijfspand uit, die niet op dezelfde manier zakatplichtig zijn.\n\nElk van die vier cijfers is aantikbaar. Als een cijfer verkeerd lijkt — je kassaldo is verouderd, of je weet dat een vordering net is afgeschreven — tik erop en voer een gecorrigeerde waarde in voor deze berekening. De overschrijving heeft alleen invloed op het resultaat voor je: hij wordt niet teruggeschreven naar je voorraad of CFO-gegevens, en wordt de volgende keer dat je het tabblad opent niet onthouden tenzij je hem opnieuw invoert.",
      },
      {
        heading: "Nisab: de drempel die bepaalt of je überhaupt iets verschuldigd bent",
        body: "Zakat wordt pas verschuldigd zodra je zakatbasis op of boven nisab ligt, de minimale vermogensdrempel. AskBiz gebruikt de standaard gewichtsgebaseerde definitie: 87,48g goud, of 612,36g zilver. Zilver is standaard omdat het de lagere van de twee drempels is — je kunt op elk moment overschakelen naar goud als je liever daartegen wilt rekenen.\n\nDe calculator ververst metaalprijzen niet vanzelf. Je activeert een opzoeking handmatig met de knop 'Huidige prijs controleren', die een live prijszoekopdracht uitvoert en de gewichtsdrempel omzet naar jouw lokale valuta. AskBiz cachet dat resultaat samen met de datum waarop het is gecontroleerd, dus het zoekt de prijs niet elke keer opnieuw op als je het tabblad opent — en elk metaal onthoudt zijn eigen laatst gecontroleerde prijs en datum apart, zodat wisselen tussen goud en zilver geen van beide waarden verliest. Behandel het cijfer als een indicatieve marktschatting in plaats van een exacte spotkoers; als precisie voor jouw situatie echt belangrijk is, bevestig het dan onafhankelijk voordat je erop vertrouwt.",
      },
      {
        heading: "Hawl: waarom boven nisab zitten vandaag niet hetzelfde is als vandaag zakat verschuldigd zijn",
        body: "Nisab overschrijden betekent niet dat zakat meteen verschuldigd is — je zakatbasis moet een vol maanjaar, de hawl, op of boven nisab blijven voordat er daadwerkelijk iets verschuldigd is. AskBiz houdt de hawl van 355 dagen automatisch bij, zonder handmatige invoer:\n\n- De dag dat je zakatbasis nisab voor het eerst overschrijdt, start AskBiz de hawl-klok en toont een voortgangsbalk.\n- Als je zakatbasis weer onder nisab zakt voordat het jaar voltooid is, wordt de klok gereset. Hij begint opnieuw de volgende keer dat je de drempel weer overschrijdt.\n- Zodra een volledige hawl is voltooid terwijl je nog boven nisab zit, verandert de status naar Nu verschuldigd, met 2,5% van je zakatbasis als het verschuldigde bedrag.\n\nTot de hawl is voltooid, is het getoonde cijfer een lopende schatting op basis van je huidige cijfers, geen verschuldigd bedrag — het blijft dag na dag bewegen naarmate je contanten, voorraad en vorderingen veranderen. Het statuslabel vertelt je precies waar je staat: Controleer prijs om te beginnen (nisab is nog niet opgezocht), Onder nisab, Boven nisab (hawl loopt), of Nu verschuldigd.",
      },
      {
        heading: "Geven aan goede doelen — en waarom je niet beperkt bent tot AskBiz's lijst",
        body: "Onder de calculator toont AskBiz partnergoededoelen waaraan je rechtstreeks kunt geven, gefilterd op je land waar AskBiz een match heeft. Elke vermelding linkt naar de eigen donatiepagina van het goede doel — AskBiz verwerkt de betaling zelf niet, het wijst je alleen de weg.\n\nDe directory is een gemak, geen vereiste. Je bent volledig vrij om je zakat te betalen aan elk goed doel of elke ontvanger van je eigen keuze, binnen of buiten de lijst. Als er nog niets is vermeld voor jouw land, is dat een leemte in een nog groeiende directory, geen teken dat je nergens naartoe kunt geven — gebruik welk goed doel je ook al vertrouwt.",
      },
      {
        heading: "Wat deze tool niet doet",
        body: "De zakat-calculator is gebouwd als rekenhulpmiddel, gebaseerd op de standaard nisab-, hawl- en 2,5%-methodologie voor zakat op bedrijfs- of handelsvermogen — het is geen fatwa, en probeert dat ook niet te zijn. Hij houdt geen rekening met madhhab-specifieke verschillen in hoe zakat wordt berekend, dekt geen landbouw- of veezakat, omvat geen persoonlijk gedragen goud of zilver, en raakt je persoonlijke vermogen buiten het bedrijf niet aan. Als jouw situatie een oordeel vereist in plaats van een cijfer, is dat een gesprek voor je eigen geleerde of imam — AskBiz geeft je de cijfers om naar dat gesprek mee te nemen, geen vervanging ervoor.",
      },
    ],
    faq: [
      {
        q: "Is de zakat-calculator echt gratis, of heb ik een betaald abonnement nodig?",
        a: "Hij is echt gratis op elk abonnement, ook Gratis — er is geen upgrade vereist om hem te gebruiken.",
      },
      {
        q: "Waarom toont mijn contantencijfer 'Niet ingesteld' in plaats van nul?",
        a: "AskBiz kent je kassaldo alleen als je er een hebt ingevoerd in je CFO-kosteninstellingen. Als je dat niet hebt gedaan, toont de tegel 'Niet ingesteld' in plaats van nul aan te nemen, aangezien nul aannemen je zakatbasis te laag zou kunnen inschatten. Tik op de tegel om direct een contantcijfer in te voeren voor de berekening.",
      },
      {
        q: "Als ik een cijfer corrigeer in de calculator, werkt dat mijn echte voorraad- of CFO-cijfers bij?",
        a: "Nee. Overschrijvingen beïnvloeden alleen de berekening die je op dat moment bekijkt — ze worden nooit teruggeschreven naar je voorraad-, CFO- of boekhoudgegevens, en worden niet onthouden de volgende keer dat je het tabblad opent.",
      },
      {
        q: "Betekent boven nisab zitten dat ik nu zakat verschuldigd ben?",
        a: "Niet noodzakelijk. Je moet een vol maanjaar (355 dagen, de hawl) op of boven nisab blijven voordat zakat daadwerkelijk verschuldigd is. AskBiz houdt dit bij met een voortgangsbalk en reset deze als je zakatbasis weer onder nisab zakt voordat het jaar voltooid is.",
      },
      {
        q: "Kan ik mijn zakat geven aan een goed doel dat niet in de directory van AskBiz staat?",
        a: "Ja. De lijst met partnergoededoelen is een gemak om rechtstreeks vanuit AskBiz te geven — je bent vrij om je zakat te betalen aan elk in aanmerking komend goed doel of elke ontvanger van je eigen keuze.",
      },
    ],
  },
  "factory-sector-guide-askbiz": {
    title: "Een fabriek runnen in AskBiz: batches, kwaliteit, stilstand, ploegen & vrachtbrieven",
    description: "Een volledige rondleiding door AskBiz's Factory-sectormodus — de negen speciale pagina's, de vier camera-opnamefasen, de vijf fabriekspersoneelsrollen, en de 12 fabriekstype-templates die je proces vooraf invullen.",
    keywords: [
      "Factory-modus",
      "AskBiz",
      "productie",
      "batchregistratie",
      "kwaliteitscontrole",
      "stilstand",
      "ploeg",
      "vrachtbrief",
      "fabriekstype",
      "productie",
    ],
    keyTakeaways: [
      "Factory is een van zes POS-sectormodi (naast Retail, Restaurant, Reparatie, Salon en Logistiek), met negen speciale pagina's: Opname, Batch, Kwaliteit, Stilstand, Ploeg, Vrachtbrief, Productie, Personeel en Goedkeuringen.",
      "Cameraopname is opgesplitst in vier fasen — inkomend, uitkomend, verspilling, verzending — elk afgeschermd door zijn eigen machtiging, zodat een rol alleen de fasen krijgt die hij daadwerkelijk zou moeten fotograferen.",
      "Het kiezen van bedrijfstype 'fabrikant' tijdens onboarding (of later in beheerinstellingen) toont een fabriekstype-kiezer met 12 templates voor onder meer oliepersen, water, malen, zuivel, bakkerij, zeep, pluimvee, koffie en visroken.",
      "Elke template vult vooraf stapbegeleiding en een voorgesteld receptrendementbereik in voor jouw proces — de fasen zijn gedeeld, maar de rendementen variëren enorm per product, van ongeveer 18% tot 76% voor alleen al de vier oliepersende zaadtypen.",
      "Er bestaan vijf fabriekspecifieke personeelsrollen — lijnoperator, kwaliteitsinspecteur, ploegsupervisor, productiemanager en voorraadmanager — elk gekoppeld aan een eigen machtigingsblok in plaats van een generieke kassamedewerkerrol.",
    ],
    content: [
      {
        heading: "Factory is een volwaardige sectormodus, geen Retail-extra",
        body: "AskBiz POS heeft zes sectormodi: Retail, Restaurant, Reparatie, Salon, Factory en Logistiek. Retail is de standaard voor de meeste bedrijven, maar als je een productiebedrijf runt — olie persen, graan malen, bakken, water bottelen, zeep maken — vervangt Factory-modus het retail-achtige menu Voorraad/Verkoop/Klanten door een set pagina's opgebouwd rond batches, niet individuele verkooptransacties. Je komt in Factory-modus via POS > Bewerkingen, waar het verschijnt als een van de sector-pilknoppen naast de andere vijf. Onder de motorkap wordt Factory geleverd met negen speciale pagina's: Opname, Batch, Kwaliteit, Stilstand, Ploeg, Vrachtbrief, Productie, Personeel en Goedkeuringen. Elk dekt een apart deel van het runnen van een productievloer, en ze zijn ontworpen om samen te worden gebruikt in plaats van los van elkaar — een batchrecord verwijst naar de opnames en kwaliteitscontroles die tijdens die batch zijn gemaakt, een ploegrecord toont wat er tijdens dat tijdvenster op de vloer is gebeurd, en een vrachtbrief koppelt een verzendopname aan de papieren die met de goederen meegaan."
      },
      {
        heading: "Opname: vier fasen, vier aparte machtigingen",
        body: "Opname is het camera-eerste startpunt voor alles wat er op de vloer gebeurt, en is opgesplitst in vier verschillende opnametypes: inkomend (fotografeer grondstof zodra deze aankomt), uitkomend (fotografeer wat een batch daadwerkelijk heeft geproduceerd), verspilling (fotografeer defecten, bederf of verlies, met een reden vereist voordat het wordt opgeslagen), en verzending (fotografeer de uitgaande batch, met een bestemming vereist voordat het wordt opgeslagen). Dit zijn niet zomaar vier knoppen op één scherm — elke fase is afgeschermd door zijn eigen machtiging (camera.inkomend, camera.uitkomend, camera.verspilling, camera.verzending), zodat je een junior lijnoperator alleen inkomend en uitkomend kunt geven, verspilling en verzending kunt voorbehouden aan senior personeel, of een op beveiliging/logistiek gerichte rol alleen verzending kunt geven. Die granulariteit zorgt ervoor dat camera-toegang overeenkomt met wie daadwerkelijk zou moeten fotograferen, in plaats van een alles-of-niets cameramachtiging."
      },
      {
        heading: "Batch, Kwaliteit, Stilstand, Ploeg en Vrachtbrief",
        body: "Batch volgt een productierun van begin tot eind — de inkomende en uitkomende opnames eraan gekoppeld, het recept en verwachte rendement waaraan het wordt gemeten, en of het daadwerkelijke resultaat binnen, boven of onder dat bereik lag. Kwaliteit registreert inspectiecontroles tegen een batch, zodat defecten worden vastgelegd tegen de specifieke run die ze heeft veroorzaakt in plaats van als vage notitie. Stilstand registreert stops — een machinestoring, een stroomuitval, een aanvoertekort — zodat je ziet waar productietijd daadwerkelijk verloren gaat over een week of maand, in plaats van te gissen. Ploeg is een speciaal productieploegrecord (bewust gescheiden gehouden van de bestaande kassa-shifttabel elders in POS, aangezien een fabrieksvloerploeg en een kassasessie van een kassamedewerker verschillende dingen zijn die verschillend werk meten). Vrachtbrief genereert de verzendpapieren voor uitgaande goederen, gekoppeld aan de verzendopname en bestemmingsnotities die in die fase zijn ingevoerd. Productie geeft je het vloeroverzicht over al het bovenstaande, en Goedkeuringen is waar een supervisor of manager opnames, batches of vrachtbrieven afvinkt die beoordeling nodig hebben voordat ze worden afgerond."
      },
      {
        heading: "Vijf personeelsrollen gebouwd voor een fabrieksvloer, niet een winkelkassa",
        body: "Factory-modus wordt geleverd met vijf speciale personeelsrollen, elk gekoppeld aan een eigen onderliggend machtigingsblok in plaats van hergebruikt van retail: factory-line-operator, factory-quality-inspector, factory-shift-supervisor, factory-production-manager en factory-inventory-manager. Een lijnoperator is beperkt tot het dagelijkse opname- en batchwerk op de vloer; een kwaliteitsinspecteur krijgt de controle- en defectregistratietools; een ploegsupervisor houdt toezicht op een ploeg en keurt goed wat er tijdens die ploeg is gebeurd; een productiemanager en voorraadmanager krijgen breder inzicht in batches, recepten en voorraad. De juiste rol toewijzen doet meer dan alleen netjes zijn — het bepaalt welke camerafasen en welke Factory-pagina's een bepaald personeelslid daadwerkelijk kan openen wanneer hij inlogt met zijn pincode."
      },
      {
        heading: "Twaalf fabriekstype-templates — dezelfde procesvorm, heel verschillende rendementen",
        body: "Wanneer je bedrijfstype instelt op 'fabrikant' tijdens onboarding — of dit later wijzigt in beheerinstellingen — toont AskBiz een fabriekstype-kiezer met 12 templates: Oliepersen (sesam, aardnoot, zonnebloem of palm), Verpakt drinkwater, Maïsmalen, Cassaveverwerking, Rijstmalen, Zuivel, Bakkerij, Zeep, Betonblokken, Pluimvee, Koffie en Visroken. Een template kiezen vult vooraf stapbegeleiding in voor jouw specifieke proces — bijvoorbeeld de oliepersen-template doorloopt inkomend, reinigen/roosteren, persen, filteren/bottelen en verzending — plus een voorgesteld recept met een verwacht rendementpercentage en een realistisch min/max-bereik, zodat je niet vanaf een leeg tabel begint met je rendementregistratie. De fasen zijn grotendeels gedeeld binnen een gegeven templatefamilie, maar de rendementen niet: oliepersen alleen al varieert van ongeveer 18% tot 76% afhankelijk van welk van de vier zaadtypen je gebruikt en of het eerst is geroosterd, wat precies de reden is waarom de template een aparte receptregel per zaadtype aanhoudt in plaats van één gemengd getal. Je kunt de voorgestelde cijfers van een template accepteren als startpunt en ze aanpassen zodra je eigen batches een andere werkelijke verhouding laten zien."
      },
      {
        heading: "Wat er recent is veranderd, en waarom het belangrijk is als je dit al een tijdje geleden hebt ingesteld",
        body: "Als je Factory-modus vóór eind juli 2026 hebt ingesteld, is het goed om te weten dat tot dat moment alleen Opname en Goedkeuringen daadwerkelijk functioneel waren in productie — Batch, Kwaliteit, Stilstand, Ploeg en Vrachtbrief hadden volledig gebouwde front-endpagina's, maar de API-routes erachter bestonden nog niet, dus alles wat daar werd ingevoerd, werd niet opgeslagen. Een fix is uitgerold samen met de 12 fabriekstype-templates, waarbij alle vijf ontbrekende backends en hun databasetabellen zijn opgebouwd. Dezelfde fix corrigeerde ook een machtigingsbug waarbij factory-line-operator uitkwam op nul cameramachtigingen in plaats van de inkomend/uitkomend-toegang die het zou moeten hebben, dus elke lijnoperatorrol die vóór de fix is toegewezen, moet dubbel worden gecontroleerd in Personeel om te bevestigen dat ze nu daadwerkelijk de camera kunnen openen. Als je team Batch, Kwaliteit, Stilstand, Ploeg of Vrachtbrief heeft gebruikt en niets opgeslagen vond, is dat de verklaring — en het is nu opgelost, dus het is de moeite waard om terug te gaan en alles opnieuw in te voeren wat je tijdens dat venster hebt geprobeerd vast te leggen."
      }
    ],
    faq: [
      {
        q: "Hoe schakel ik mijn bedrijf over naar Factory-modus?",
        a: "Klik in POS > Bewerkingen op de Factory-pil naast de andere vijf sectormodi. Als je een nieuw account instelt, toont het kiezen van bedrijfstype 'fabrikant' tijdens onboarding ook direct de fabriekstype-kiezer; je kunt het fabriekstype later wijzigen via beheerinstellingen."
      },
      {
        q: "Wat is het verschil tussen de pagina Batch en de pagina Opname?",
        a: "Opname is waar je de daadwerkelijke foto neemt voor een specifiek moment — inkomend, uitkomend, verspilling of verzending. Batch is het record dat die opnames samenbrengt voor één productierun, samen met het recept waaraan het wordt gemeten en of het rendement op doel is uitgekomen."
      },
      {
        q: "Waarom kan een van mijn personeelsleden de camera niet gebruiken in Factory-modus?",
        a: "Cameratoegang in Factory-modus is opgesplitst in vier aparte machtigingen — inkomend, uitkomend, verspilling, verzending — en elke personeelsrol krijgt alleen de machtigingen die hij hoort te hebben. Controleer hun toegewezen rol in Factory > Personeel; als ze op factory-line-operator staan en vóór de machtigingsfix van juli 2026 zijn ingesteld, controleer dan opnieuw of ze nu camera.inkomend en camera.uitkomend hebben zoals verwacht."
      },
      {
        q: "Leggen de 12 fabriekstype-templates me vast op een vast proces?",
        a: "Nee. Een template vult vooraf stapbegeleiding en een startrecept met een verwacht rendementbereik in, maar elk veld is bewerkbaar. Zodra je een paar echte batches hebt gedraaid en je werkelijke rendement kent, werk je het recept bij zodat het overeenkomt — de template is een startpunt, geen beperking."
      },
      {
        q: "Mijn fabriek doet iets dat niet in de 12 templates staat — kan ik Factory-modus nog steeds gebruiken?",
        a: "Ja. De 12 templates zijn handige voorinstellingen voor veelvoorkomende Afrikaanse productiesectoren, geen vereiste. Je kunt de pagina's Opname, Batch, Kwaliteit, Stilstand, Ploeg, Vrachtbrief, Productie, Personeel en Goedkeuringen van Factory-modus gebruiken zonder een template te kiezen — je voert dan gewoon je eigen stapnamen en receptcijfers helemaal opnieuw in in plaats van vanaf vooraf ingevulde waarden te starten."
      }
    ]
  },
  "pos-free-trial-explained-askbiz": {
    title: "Hoe de gratis proefperiode van AskBiz POS werkt",
    description: "AskBiz POS biedt een eenmalige, gratis proefperiode van 30 dagen zonder kaart vereist. Hier lees je precies hoe je hem aanvraagt, wat hij omvat, en wat er gebeurt als hij afloopt.",
    keywords: ["gratis proefperiode POS", "AskBiz POS", "30-dagen proefperiode", "geen kaart vereist", "pos/activate", "verlopen proefperiode", "facturering"],
    keyTakeaways: [
      "De gratis proefperiode is alleen voor POS, duurt 30 dagen, en vereist geen kaart — elk account kan hem eenmalig aanvragen.",
      "Je ziet hem op twee plekken aangeboden: een banner op het onboarding-afrondingsscherm voor POS-persona-aanmeldingen, en opnieuw op de pos/activate-pagina als je hem nog niet hebt aangevraagd.",
      "Als de 30 dagen verstrijken zonder betaald abonnement, schakelt AskBiz POS automatisch uit — je gegevens blijven intact, maar de kassa stopt met werken totdat je je abonneert.",
      "De gelijkwaardige gratis proefperiode voor het Growth-abonnement (BI) is stopgezet — POS is momenteel de enige gratis proefperiode die AskBiz aanbiedt.",
      "Je proefperiodestatus, inclusief resterende dagen en de exacte einddatum, is altijd zichtbaar op de Facturering-pagina.",
    ],
    content: [
      {
        heading: "Wat de proefperiode je daadwerkelijk geeft",
        body: "De gratis proefperiode van AskBiz POS ontgrendelt de volledige kassa voor 30 dagen vanaf het moment dat je hem start, zonder dat er op enig moment een betaalkaart wordt gevraagd. Het is een eenmalig aanbod — elk account kan hem precies één keer aanvragen, wat AskBiz server-side bijhoudt in plaats van iets in de browser te vertrouwen. Als je hem eerder al hebt aangevraagd (ook op een ander apparaat of na het wissen van je cookies), weet het systeem dat en biedt hem niet opnieuw aan. Het starten van de proefperiode schakelt POS meteen in en voorziet in tot vijf personeelsplaatsen, zodat je je hele kassateam aan boord kunt krijgen — kassamedewerkers, managers, wie dan ook een login nodig heeft — zonder tijdens de proefperiode tegen een plaatsenlimiet aan te lopen.",
      },
      {
        heading: "Waar hij je wordt aangeboden",
        body: "AskBiz toont de proefperiode op twee momenten, beide gericht op je zo snel mogelijk aan het verkopen te krijgen zonder vooraf om kaartgegevens te vragen. Het eerste is op het onboarding-'klaar'-scherm, maar alleen als je je hebt aangemeld als POS-persona — je ziet een kleine banner boven de knop \"Mijn kassa instellen\" die de gratis proefperiode van 30 dagen aankondigt. Die banner is alleen een aankondiging, niet de aanvraagknop zelf; hij vertelt je dat het aanbod bestaat voordat je verdergaat. Het tweede, en degene die de proefperiode daadwerkelijk start, is op de pagina pos/activate — het scherm waarop je terechtkomt wanneer je POS gaat inschakelen. Voordat je rechtstreeks naar een betaalde afrekening wordt gestuurd, controleert het of je een niet-aangevraagde proefperiode hebt. Als dat zo is, verschijnt een optie \"Start gratis proefperiode\" boven de betaalknoppen; als je hem al hebt gebruikt, verschijnt die optie simpelweg niet en ga je rechtstreeks naar de betaalopties. Hoe dan ook, er is geen doodlopend pad — als een klik binnenkomt nadat je hem al ergens anders hebt aangevraagd (bijvoorbeeld de Facturering-pagina), verbergt AskBiz de knop rustig en toont het betaalpad in plaats van een foutmelding.",
      },
      {
        heading: "Aanvragen op pos/activate",
        body: "Wanneer de proefperiodeoptie beschikbaar is, is het de bovenste knop op het pos/activate-scherm — gelabeld om de gratis proefperiode te starten, met een notitie eronder die bevestigt dat geen kaart nodig is. Daaronder staat een scheidingslijn en dan je normale betaalopties: M-Pesa voor Keniaanse accounts, plus kaartbetaling voor iedereen. Op de proefperiodeknop tikken stuurt je nergens naartoe; het roept rechtstreeks het facturatiesysteem van AskBiz aan, dat de starttijd van de proefperiode en een einddatum 30 dagen later registreert, POS aanzet, en je rechtstreeks naar een bevestigingsscherm brengt. Vanaf daar is het dezelfde \"je bent helemaal klaar\"-flow als bij een betaalde activering — je komt terug op je kassa, klaar om te verkopen.",
      },
      {
        heading: "Wat er gebeurt als de 30 dagen aflopen",
        body: "AskBiz controleert het verlopen van de proefperiode elke keer dat je factureringsstatus wordt geladen — in de praktijk betekent dit dat zodra je 30 dagen voorbij zijn, het systeem het opmerkt de eerstvolgende keer dat er iets je factureringsstatus aanraakt. Als er op dat moment geen betaald POS-abonnement aan je account is gekoppeld, wordt POS-toegang automatisch uitgeschakeld: de kassa stopt bruikbaar te zijn, en personeelslogins vinden de deur gesloten. Er wordt niets van je verkoopgeschiedenis, voorraad of instellingen verwijderd — alles blijft er, wachtend. Op elk moment daarna abonneren schakelt POS weer aan met alles precies zoals je het achterliet. De afsluiting is bewust schoon: geen dralende genadetermijn of gedeeltelijke uitsluiting, gewoon een automatische schakeling van \"aan\" naar \"uit\" als de proefperiode verstrijkt zonder dat er iets betaald tegenover staat.",
      },
      {
        heading: "Je proefperiodestatus controleren",
        body: "Je hoeft niet te raden hoeveel tijd je nog hebt. De Facturering-pagina toont een badge naast de POS-sectie zolang je proefperiode actief is, met het aantal resterende dagen en hoeveel plaatsen je momenteel gebruikt. Zodra je je abonneert — of zodra de proefperiode afloopt en je betaalt om opnieuw te activeren — verandert die badge in plaats daarvan naar een gewone \"actief\"-status. Als je het type eigenaar bent dat liever vooruit plant dan verrast te worden door een afgesloten kassa midden in een dienst, is de Facturering-pagina de plek om te controleren, idealiter een paar dagen voordat de 30 dagen om zijn.",
      },
      {
        heading: "Waarom er geen equivalent is voor het Growth-abonnement (BI)",
        body: "Als je hebt gehoord dat AskBiz vroeger een gratis proefperiode aanbood voor zijn Growth-bedrijfsintelligentie-abonnement, klopt dat — maar het is niet langer beschikbaar. Het facturatiesysteem van AskBiz wijst elk nieuw verzoek om een Growth-proefperiode expliciet af met een duidelijk bericht dat deze is stopgezet; het codepad bestaat alleen om verzoeken af te wijzen, niet om ze toe te kennen. De POS-proefperiode is momenteel de enige gratis proefperiode die wordt aangeboden. Als je bedrijf zowel POS als de BI-/Growth-functies nodig heeft, krijgt de POS-proefperiode je kassa meteen kosteloos draaiende, terwijl toegang tot het Growth-abonnement vanaf dag één een eenvoudige betaalde beslissing is — geen proefperiode om in die afweging mee te nemen.",
      },
    ],
    faq: [
      {
        q: "Moet ik een kaart invoeren om de gratis POS-proefperiode te starten?",
        a: "Nee. Het starten van de proefperiode vereist geen betaalgegevens — hij is echt gratis voor de volledige 30 dagen. Je hoeft alleen een betaalmethode toe te voegen als je besluit je te abonneren, tijdens of na de proefperiode.",
      },
      {
        q: "Kan ik de proefperiode twee keer aanvragen — bijvoorbeeld op een tweede bedrijfsaccount?",
        a: "De proefperiode is eenmalig per account, server-side bijgehouden, niet per apparaat of browser. Een tweede AskBiz-account (een echt aparte aanmelding) komt wel in aanmerking voor zijn eigen proefperiode, maar je kunt hem niet opnieuw activeren op hetzelfde account door cookies te wissen of het vanaf een ander scherm opnieuw te proberen.",
      },
      {
        q: "Wat gebeurt er precies met mijn verkoopgegevens als de proefperiode afloopt?",
        a: "Er wordt niets verwijderd. AskBiz schakelt POS-toegang uit — wat betekent dat de kassa zelf stopt bruikbaar te zijn — maar elke verkoop, elk product en elke instelling die je had, blijft bewaard. Op elk moment daarna abonneren herstelt volledige toegang met je gegevens precies zoals ze waren.",
      },
      {
        q: "Ik heb de proefperiode gestart vanuit de onboarding-banner — moet ik nog iets anders doen?",
        a: "De onboarding-banner is alleen een aankondiging dat het aanbod bestaat; hij start de proefperiode niet zelf. Je vraagt hem aan op de pos/activate-pagina, die je bereikt via \"Mijn kassa instellen\". Als je hem daar al hebt aangevraagd, zie je de optie niet nogmaals.",
      },
      {
        q: "Is er ook een gratis proefperiode voor het Growth-abonnement (BI)?",
        a: "Nee — de proefperiode voor het Growth-abonnement is stopgezet. Een verzoek nu levert een expliciete \"niet langer beschikbaar\"-reactie op. POS is momenteel het enige AskBiz-abonnement dat met een gratis proefperiode wordt aangeboden.",
      },
    ],
  },
}
