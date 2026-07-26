import type { LocaleTranslations } from "../../academy-i18n-loader";

// German (de) translations for Wave A, Batch 4 — new-article batch.
// Glossary locked by the sibling de/wave-a-batch1.ts session — reused verbatim here.
// Key terms in use below: Kassensystem, Gewinn, Marge, Umsatz, Bestand,
// Kassierer, Manager, Inhaber, Beleg, Rückerstattung, stornieren/Stornierung,
// Mehrwertsteuer (MwSt.), Dashboard, Mitarbeiter/Personal, Bestandswarnung,
// Bestellung/Nachbestellung, Meldebestand, Rabatt, Warenkorb, Transaktion/Verkauf,
// Audit-Trail, Kasse, Kassiervorgang, Barcode, Inventur, Wareneingang buchen,
// Fehlbestand, Ladenhüter.
export const waveABatch4NewArticlesTranslations: LocaleTranslations = {
  "purchase-orders-guide-askbiz": {
    title: "Bestellungen: Bestellungen bei Lieferanten erstellen, senden und empfangen in AskBiz POS",
    description:
      "Wie die Kachel „Bestellungen\" unter POS > Betrieb tatsächlich funktioniert — eine Bestellung mit automatisch vorgeschlagenen Nachbestellmengen erstellen, sie per WhatsApp an Ihren Lieferanten senden und Wareneingänge (auch Teillieferungen) buchen, ohne eine Tabellenkalkulation anzufassen.",
    keywords: [
      "Bestellungen",
      "Lieferantenbestellungen",
      "Nachfüllen",
      "Nachbestellung",
      "POS",
      "AskBiz",
      "Bestand",
      "Rückstand",
      "WhatsApp Lieferant",
      "Wareneingang buchen",
    ],
    keyTakeaways: [
      "Bestellungen finden Sie unter POS > Betrieb > Einzelhandel, geöffnet über die Kachel 📋 — es ist ein eigener Tab, kein Popup, das an die Bestandsverwaltung angeflanscht wurde.",
      "Beim Start einer neuen Bestellung werden automatisch alle Produkte vorausgefüllt, die auf oder unter ihrem Meldebestand liegen, mit einer vorgeschlagenen Menge, die den Bestand auf das Doppelte des Meldebestands auffüllt, sowie dem zuletzt erfassten Einkaufspreis des Produkts — Sie können jede Zeile weiterhin bearbeiten oder entfernen oder Produkte manuell hinzufügen.",
      "Das Senden einer Bestellung schickt eine aufgeschlüsselte Bestellung an die WhatsApp-Nummer Ihres Lieferanten; ist die automatisierte Vorlage nicht verfügbar, greift ein vorausgefüllter wa.me-Link, den Sie selbst zum Senden antippen. Ein Lieferant ohne hinterlegte Telefonnummer kann gar nicht angeschrieben werden.",
      "Der Wareneingang wird pro Zeile gebucht, Teillieferungen sind also normal: Eine Bestellung wird in dem Moment „Teilweise\", in dem eine Zeile unvollständig ist, und wechselt erst zu „Erhalten\", sobald jede Zeile vollständig eingegangen ist.",
      "Was Sie tun können, hängt von Ihrer POS-Rolle ab: Inhaber und Manager haben vollen Zugriff, die Rolle Bestand kann erstellen und Wareneingänge buchen, aber nicht senden, und Aufsicht/Filialleitung können nur einsehen.",
    ],
    content: [
      {
        heading: "Wo Sie es finden",
        body: "Bestellungen ist eine Kachel unter POS > Betrieb, im Bereich Einzelhandel — achten Sie auf das Symbol 📋. Ein Tipp darauf öffnet einen eigenen Bestellungen-Tab mit eigener Liste, Filtern (Alle / Rückstände / Erhalten) und einer Schaltfläche „+ Neue Bestellung\" oben rechts. Wenn Ihr Nachbestellprozess bisher bedeutet hat, einen Lieferanten von Ihrem eigenen Handy aus anzuschreiben und zu hoffen, dass Sie an alles gedacht haben, ist dies das Werkzeug, das diese Gewohnheit ersetzt — es steckt in derselben App, die Sie ohnehin zum Verkaufen nutzen, es gibt also nichts Separates, in das Sie sich einloggen müssen.",
      },
      {
        heading: "Eine neue Bestellung starten",
        body: "Tippen Sie auf „+ Neue Bestellung\", und Sie werden zunächst nach einem Lieferanten gefragt — wählen Sie einen bestehenden aus dem Dropdown-Menü, oder legen Sie spontan einen neuen mit nur Name und Telefonnummer an. Die Telefonnummer ist wichtig: Sie wird später beim WhatsApp-Versand benötigt, und ohne sie kann die Bestellung nicht gesendet, nur erstellt und manuell nachverfolgt werden.\n\nUnter dem Lieferanten öffnet sich die Artikelliste bereits vorausgefüllt: AskBiz prüft jedes Produkt, das aktuell auf oder unter seinem Meldebestand liegt, und fügt es als Zeile hinzu, mit einer vorgeschlagenen Bestellmenge, die den Bestand wieder auf etwa das Doppelte dieses Meldebestands anhebt, sowie einem Einzelkostenpreis aus dem zuletzt erfassten Einkaufspreis des Produkts. Sie müssen davon nichts übernehmen — bearbeiten Sie Menge oder Kosten in jeder Zeile, löschen Sie Zeilen, die Sie nicht wollen, oder nutzen Sie das Dropdown „Produkt hinzufügen\" darunter, um etwas anderes aus Ihrem Katalog aufzunehmen, das nicht knapp war. Eine laufende Summe aktualisiert sich, während Sie arbeiten, und ein Notizfeld am Ende eignet sich gut für Lieferhinweise oder eine Referenznummer, die Ihr Lieferant erwartet.",
      },
      {
        heading: "Die fünf Bestellstatus",
        body: "Jede Bestellung befindet sich in einem von fünf Zuständen, dargestellt als farbige Pille auf ihrer Karte: Entwurf (erstellt, aber noch nicht gesendet), Bestellt (an den Lieferanten gesendet, noch nichts erhalten), Teilweise, Erhalten oder Storniert. Teilweise lohnt sich, genauer zu verstehen — es ist keine separate Aktion, die Sie wählen, sondern das, was eine Bestellung automatisch wird, sobald Sie einen Teil, aber nicht alles erhalten haben, was Sie bestellt haben. Wenn Sie 50 Einheiten von etwas bestellen und heute 30 ankommen, der Rest aber erst nächste Woche kommt, wechselt die Bestellung in dem Moment zu Teilweise, in dem Sie diese 30 buchen, und bleibt dort — und zeigt genau, was noch offen ist — bis die restlichen 20 eintreffen und sie von selbst auf Erhalten wechselt. Der Filter Rückstände oben in der Liste zeigt einfach jede Bestellung, die sich aktuell im Status Teilweise befindet, sodass Sie auf einen Blick sehen, welche Lieferungen Ihnen noch geschuldet werden.",
      },
      {
        heading: "Eine Bestellung an Ihren Lieferanten senden",
        body: "Öffnen Sie eine beliebige Bestellung im Status Entwurf oder Bestellt und tippen Sie auf Senden (nach dem ersten Versand steht dort Erneut senden). AskBiz erstellt eine aufgeschlüsselte Nachricht — jede Zeile als „Artikel x Menge @ Kosten\", die Summe und Ihre Notizen, falls vorhanden — und versucht, sie als automatisierte WhatsApp-Vorlagen-Nachricht direkt an die Nummer des Lieferanten zuzustellen. Ist dieser automatisierte Weg nicht verfügbar, greift ersatzweise ein vorausgefüllter wa.me-Link in einem neuen Tab mit derselben bereits eingetippten Nachricht, sodass Sie nur noch selbst auf Senden in WhatsApp tippen müssen. So oder so wechselt eine Entwurfsbestellung beim ersten Versand zu Bestellt, und der Sendezeitstempel wird bei jedem weiteren Versand aktualisiert. Hat der Lieferantendatensatz keine Telefonnummer, ist die Schaltfläche Senden deaktiviert, und ein Hinweis fordert Sie auf, eine hinzuzufügen — an der Notwendigkeit einer Nummer führt kein Weg vorbei.",
      },
      {
        heading: "Wareneingang buchen",
        body: "Wenn die Ware eintrifft, öffnen Sie die Bestellung und tippen auf „Wareneingang buchen\". Sie sehen jede Zeile mit einem bereits auf die vollständige offene Menge voreingestellten Eingabefeld (das, was bestellt minus das, was auf dieser Zeile bereits erhalten wurde) — Zeilen, die bereits vollständig erhalten wurden, sind ausgegraut und können nichts mehr aufnehmen. Passen Sie eine Menge nach unten an, falls nur ein Teil dieser Zeile eingetroffen ist, und bestätigen Sie dann.\n\nDie Bestätigung ist es, was den Bestand tatsächlich bewegt: Jede Zeile erhöht atomar den aktuellen Lagerbestand dieses Produkts (dieselbe Zahl, die Ihre Kasse und der Übersichtsbildschirm auslesen), und der Status der Bestellung wird anhand der neuen Zahlen neu berechnet — Erhalten, wenn jede Zeile jetzt vollständig eingegangen ist, Teilweise, wenn einige Zeilen noch fehlen, ansonsten unverändert. Sie können mehrmals zu derselben Bestellung zurückkehren und Wareneingänge buchen, während eine Lieferung stufenweise eintrifft; jede Buchung fragt nur nach dem, was noch offen ist.",
      },
      {
        heading: "Wer was tun kann",
        body: "Aktionen bei Bestellungen sind nach POS-Rolle berechtigungsgesteuert, nicht über einen einzigen Alles-oder-nichts-Schalter. Inhaber und Manager können Bestellungen ansehen, erstellen, senden, Wareneingänge buchen und als bezahlt markieren. Die Rolle Bestand kann Bestellungen erstellen und Wareneingänge buchen (und als bezahlt markieren), aber nicht senden — das Senden bleibt bewusst dem Management vorbehalten. Die Rollen Aufsicht und Filialleitung können Bestellungen und ihren Status einsehen, aber nichts daran erstellen, senden oder buchen. Wenn eine Schaltfläche deaktiviert aussieht oder jemand Ihnen sagt, dass die Option Senden nicht sichtbar ist, prüfen Sie zuerst die zugewiesene Rolle dieser Person, bevor Sie von einem Fehler ausgehen.",
      },
    ],
    faq: [
      {
        q: "Warum hat AskBiz meiner neuen Bestellung schon Artikel hinzugefügt, bevor ich etwas eingetippt habe?",
        a: "Das Erstellungsformular füllt automatisch jedes Produkt vor, das aktuell auf oder unter seinem Meldebestand liegt, mit einer vorgeschlagenen Menge, die ihn wieder auf etwa das Doppelte dieses Meldebestands auffüllt, sowie dem zuletzt erfassten Einkaufspreis. Das ist ein Ausgangspunkt, keine fertige Bestellung — bearbeiten, entfernen oder ergänzen Sie Zeilen frei, bevor Sie speichern.",
      },
      {
        q: "Was bedeutet „Teilweise\" bei einer Bestellung genau?",
        a: "Es bedeutet einen Rückstand: Ein Teil, aber nicht die gesamte bestellte Menge ist eingetroffen. Der Status wird automatisch gesetzt, sobald Sie eine geringere Menge als die vollständige offene Menge auf mindestens einer Zeile erhalten, und die Bestellung bleibt Teilweise, bis jede Zeile vollständig eingegangen ist.",
      },
      {
        q: "Kann ich eine Bestellung ohne Telefonnummer des Lieferanten senden?",
        a: "Nein. Das Senden liefert die Bestellung als WhatsApp-Nachricht (oder als vorausgefüllten WhatsApp-Link als Ausweichlösung) aus, ein Lieferant braucht also eine hinterlegte Telefonnummer, bevor Sie ihm etwas senden können. Sie können die Bestellung weiterhin ohne Nummer erstellen und nachverfolgen — Sie können sie nur nicht senden, bis eine Nummer hinzugefügt wurde.",
      },
      {
        q: "Wenn ich heute einen Teil einer Bestellung erhalte, kann ich den Rest später buchen?",
        a: "Ja. Jede Buchung fragt nur nach den noch offenen Mengen, und Sie können dieselbe Bestellung erneut öffnen und Wareneingänge buchen, während weitere Lieferungen eintreffen. Der Bestand wird bei jeder Buchung schrittweise erhöht — zwischen den Buchungen wird nichts rückgängig gemacht oder überschrieben.",
      },
      {
        q: "Welche Mitarbeiterrollen können eine Bestellung an einen Lieferanten senden?",
        a: "Nur Inhaber und Manager können senden. Mitarbeiter mit der Rolle Bestand können Bestellungen erstellen und Wareneingänge buchen, aber nicht senden, und die Rollen Aufsicht/Filialleitung können Bestellungen nur einsehen, nicht bearbeiten.",
      },
    ],
  },

  "connect-marketing-ads-sources-askbiz": {
    title: "Ihre Marketingdaten verbinden: Meta Ads, Google Ads, Google Analytics, Mailchimp & Klaviyo",
    description: "So verbinden Sie die fünf Marketing-&-Ads-Quellen in AskBiz — Meta Ads, Google Ads, Google Analytics, Mailchimp und Klaviyo — und was jede davon in Ihr Dashboard synchronisiert.",
    keywords: [
      "Meta Ads", "Google Ads", "Google Analytics", "Mailchimp", "Klaviyo",
      "Marketing & Ads Quellen", "AskBiz Sources", "Werbeausgaben", "ROAS",
      "E-Mail-Marketing", "Marketingdaten verbinden",
    ],
    keyTakeaways: [
      "Sources > Marketing & Ads hat fünf Konnektoren: Meta Ads, Google Ads, Google Analytics, Mailchimp und Klaviyo — jeder bringt einen anderen Ausschnitt Ihrer Marketingleistung in AskBiz.",
      "Vier der fünf verbinden sich mit einem Klick per OAuth (Meta Ads, Google Ads, Google Analytics, Mailchimp). Klaviyo ist die Ausnahme — Sie fügen stattdessen einen privaten API-Schlüssel ein, weil Klaviyo für diese Art von Lesezugriff keinen OAuth-App-Ablauf anbietet.",
      "Jede Quelle liefert andere Zahlen: Meta Ads und Google Ads bringen Werbeausgaben/ROAS/CPM/CPC, Google Analytics bringt Website-Traffic und Trichter, Mailchimp bringt Kampagnenleistung, und Klaviyo bringt E-Mail-zugeordneten Umsatz.",
      "Im Free-Plan können Sie insgesamt bis zu 3 Datenquellen verbinden, über alle Kategorien hinweg — eine Kombination aus z. B. Meta Ads, Mailchimp und Ihrer Kasse nutzt also bereits Ihr komplettes Kontingent. Growth- und Business-Pläne heben die Obergrenze vollständig auf.",
      "Das sind keine Platzhalter-Konnektoren — jeder hat echte Synchronisierungslogik dahinter, sodass sie nach dem Verbinden laufend Live-Daten abrufen, nicht nur einmalig importieren.",
    ],
    content: [
      {
        heading: "Wo Sie sie finden",
        body: "Öffnen Sie Sources über die AskBiz-Hauptnavigation. Die Konnektoren sind nach Kategorie gruppiert, und Marketing & Ads ist eine dieser Gruppen, neben E-Commerce, Buchhaltung, Zahlungen und den übrigen. Darin finden Sie fünf Karten: Meta Ads, Google Ads, Google Analytics, Mailchimp und Klaviyo. Sie können auch das Suchfeld oben auf der Sources-Seite nutzen — die Eingabe von „ads\", „mailchimp\" oder „klaviyo\" filtert direkt auf die passende Karte. Jede Karte zeigt eine kurze Beschreibung dessen, was sie synchronisiert, und eine Schaltfläche Verbinden. Sobald eine Quelle verbunden ist, rutscht sie nach oben in die Liste „Verbunden\", wo Sie jederzeit eine manuelle Synchronisierung auslösen oder die Verbindung trennen können.",
      },
      {
        heading: "Meta Ads — Werbeleistung auf Facebook & Instagram",
        body: "Meta Ads verbindet Ihr Facebook- und Instagram-Werbekonto. Klicken Sie auf Verbinden, und AskBiz leitet Sie zu Meta weiter, um sich anzumelden und Lesezugriff auf Ihre Werbekonten zu genehmigen — es gibt nichts einzutippen oder einzufügen. Nach der Genehmigung werden Ihre Werbeausgaben zusammen mit ROAS (Return on Ad Spend), CPM (Kosten pro tausend Impressionen) und CPC (Kosten pro Klick) synchronisiert, sodass Sie sehen, was Ihr Werbebudget tatsächlich einbringt, ohne den Ads Manager separat zu öffnen. Das ist nützlich, um die Verbindung herzustellen zwischen dem, was Sie für Facebook- und Instagram-Anzeigen ausgeben, und dem, was tatsächlich in Ihren Verkäufen ankommt — besonders wenn Sie außerdem Instagram Shopping oder einen Shopify-Shop über AskBiz betreiben, da Ausgaben und Umsatz dann nebeneinander stehen.",
      },
      {
        heading: "Google Ads — Leistung von Suchkampagnen",
        body: "Google Ads funktioniert genauso wie Meta Ads: Klicken Sie auf Verbinden, melden Sie sich bei Ihrem Google-Konto an und genehmigen Sie Lesezugriff auf Ihre Werbekonten. Es synchronisiert Ihre Ausgaben für Suchkampagnen, ROAS und Conversions, sodass Sie nachverfolgen können, was Ihre Google-Suchanzeigen kosten im Vergleich zu dem, was sie tatsächlich einbringen. Wenn Sie bereits Google Ads betreiben, um Traffic auf eine Website oder einen Shop zu lenken, erscheinen diese Ausgaben durch das Verbinden hier neben Ihren übrigen Marketing- und Umsatzzahlen, statt nur in einem separaten Google-Ads-Login zu leben.",
      },
      {
        heading: "Google Analytics — Website-Traffic und Trichter",
        body: "Google Analytics ist ein eigener Konnektor, getrennt von Google Ads, auch wenn beide über den Google-Login laufen. Dieser verbindet sich mit einer GA4-Property auf Ihrer Website — es geht darum, was passiert, nachdem jemand auf Ihrer Seite gelandet ist, nicht darum, was Sie bezahlt haben, um ihn dorthin zu bringen. Er synchronisiert Traffic und Sitzungen, Trichterdaten (wo Besucher vor der Conversion abspringen) und E-Commerce-Umsatz, falls Sie das E-Commerce-Tracking von GA4 eingerichtet haben. Klicken Sie auf Verbinden, melden Sie sich mit dem Google-Konto an, das Zugriff auf Ihre GA4-Property hat, und genehmigen Sie den Zugriff. Kombiniert mit Google Ads oder Meta Ads ergibt sich das vollständigere Bild: was Sie ausgegeben haben, um jemanden auf Ihre Website zu bringen, und was diese Person dort tatsächlich getan hat.",
      },
      {
        heading: "Mailchimp — E-Mail-Kampagnenleistung",
        body: "Mailchimp verbindet sich ebenfalls über OAuth — klicken Sie auf Verbinden, melden Sie sich bei Mailchimp an und genehmigen Sie den Zugriff. Es synchronisiert Ihre Kampagnen zusammen mit Öffnungsraten, Klickraten und Zielgruppendaten, sodass Ihre E-Mail-Marketing-Leistung im selben Dashboard steht wie Ihre Verkäufe und Werbeausgaben, statt nur in Mailchimps eigenem Reporting.",
      },
      {
        heading: "Klaviyo — der Ausreißer: ein eingefügter API-Schlüssel statt OAuth",
        body: "Klaviyo ist der Ausreißer unter den fünf. Statt einer Schaltfläche Verbinden, die Sie zum Anmelden weiterleitet, sehen Sie ein Feld, das nach einem privaten API-Schlüssel fragt. Um einen zu erhalten, melden Sie sich bei Klaviyo an, gehen zu Account, dann Settings, dann API Keys, und erstellen (oder kopieren) dort einen privaten API-Schlüssel. Fügen Sie ihn in das Feld in AskBiz ein und verbinden Sie. Das ist ein bewusster Unterschied in der Funktionsweise dieses Konnektors, kein defekter OAuth-Ablauf — Klaviyos API für diese Art von Lesezugriff auf Kontoebene ist schlüsselbasiert statt OAuth-basiert, ein privater Schlüssel ist also der korrekte und erwartete Weg, ihn zu verbinden. Da ein privater API-Schlüssel ein echtes Zugangsdatum ist, behandeln Sie ihn wie ein Passwort: erzeugen Sie ihn nur aus Ihrem eigenen Klaviyo-Konto, und geben Sie ihn außerhalb des direkten Einfügens in AskBiz nicht weiter. Einmal verbunden, synchronisiert Klaviyo E-Mail-zugeordneten Umsatz, Ihre Flows (automatisierte E-Mail-Sequenzen), Öffnungsraten und Attribution — sodass Sie sehen, wie viel Umsatz Ihre Klaviyo-E-Mails tatsächlich erzielen, nicht nur, wie viele Personen sie geöffnet haben.",
      },
      {
        heading: "Quellenlimits im Free-Plan",
        body: "Der Free-Plan erlaubt insgesamt bis zu 3 verbundene Datenquellen, und diese Obergrenze gilt über alle Kategorien zusammen — nicht 3 pro Kategorie. Wenn Sie also Meta Ads, Mailchimp und Ihre AskBiz-Kasse verbinden, haben Sie Ihr komplettes Kontingent ausgeschöpft und müssten eine Quelle trennen, bevor Sie eine vierte hinzufügen, egal ob diese vierte Klaviyo, Shopify oder etwas anderes ist. Growth- und Business-Pläne heben dieses Limit vollständig auf und ermöglichen unbegrenzte Quellenverbindungen über AskBiz' gesamte Integrationsliste. Wenn Marketingdaten für Sie Priorität haben, lohnt es sich, im Free-Plan im Voraus zu entscheiden, welche Quellen am wichtigsten sind, oder zu upgraden, wenn Sie alle fünf Marketing-&-Ads-Konnektoren gleichzeitig neben Ihren Verkaufs- und Buchhaltungsquellen nutzen möchten.",
      },
      {
        heading: "Was nach dem Verbinden passiert",
        body: "Sobald eine Quelle verbunden ist, erscheint sie oben auf der Sources-Seite in der Liste Verbunden mit einer Statusanzeige und einer „zuletzt synchronisiert\"-Zeit. Das sind keine einmaligen Importe — jede der fünf hat echte Synchronisierungslogik dahinter, die laufend frische Daten abruft, und Sie können außerdem jederzeit „Jetzt synchronisieren\" bei einer verbundenen Quelle drücken, wenn Sie sofort die aktuellsten Zahlen möchten, statt auf die nächste automatische Synchronisierung zu warten. Zeigt eine Quelle jemals einen Fehlerstatus — etwa wenn Klaviyos API-Schlüssel widerrufen wurde oder ein OAuth-Token erneut genehmigt werden muss — sagt Ihnen die Fehlermeldung in dieser Zeile, was schiefgelaufen ist, und das erneute Verbinden läuft genauso ab wie beim ersten Mal.",
      },
    ],
    faq: [
      {
        q: "Warum fragt Klaviyo nach einem API-Schlüssel, statt mich einfach anmelden zu lassen wie die anderen?",
        a: "Meta Ads, Google Ads, Google Analytics und Mailchimp nutzen alle OAuth, Sie melden sich also an und genehmigen den Zugriff mit einem Klick. Klaviyos Konnektor nutzt stattdessen einen privaten API-Schlüssel, weil das die korrekte Art ist, dieser Art von Lesezugriff bei Klaviyos API zu gewähren. Erzeugen Sie ihn bei Klaviyo unter Account, dann Settings, dann API Keys, und fügen Sie ihn in AskBiz ein.",
      },
      {
        q: "Nutzen Google Ads und Google Analytics dieselbe Verbindung?",
        a: "Nein — es sind zwei separate Konnektoren auf der Sources-Seite, auch wenn beide Sie über einen Google-Login weiterleiten. Google Ads synchronisiert Ihre Werbeausgaben und Kampagnenleistung; Google Analytics synchronisiert Ihren Website-Traffic und Ihre Trichter aus einer GA4-Property. Sie können jede der beiden einzeln oder auch beide verbinden.",
      },
      {
        q: "Ich bin im Free-Plan — kann ich alle fünf Marketing-&-Ads-Quellen verbinden?",
        a: "Nur, wenn es die einzigen Quellen sind, die Sie verbinden. Der Free-Plan erlaubt insgesamt bis zu 3 Datenquellen, über alle Kategorien zusammen, nicht 3 pro Kategorie. Alle fünf Marketing-&-Ads-Quellen plus alles andere zu verbinden — Ihre Kasse, Shopify, Buchhaltungssoftware — würde dieses Limit überschreiten. Growth- und Business-Pläne haben unbegrenzte Quellenverbindungen.",
      },
      {
        q: "Ist es sicher, meinen Klaviyo-API-Schlüssel in AskBiz einzufügen?",
        a: "Das Feld ist eine passwortartige Eingabe und wird nur genutzt, um AskBiz' Lesezugriff auf Ihr Klaviyo-Konto zu authentifizieren. Behandeln Sie den Schlüssel selbst wie jedes andere Zugangsdatum — erzeugen Sie ihn nur aus Ihrem eigenen Klaviyo-Konto, und fügen Sie ihn nirgendwo außer direkt in das AskBiz-Verbindungsfeld ein.",
      },
      {
        q: "Was genau synchronisiert jede Quelle — ist es ein einmaliger Import?",
        a: "Nein, keine der fünf ist ein einmaliger Import. Meta Ads und Google Ads synchronisieren Ausgaben, ROAS, CPM/CPC und Conversions; Google Analytics synchronisiert Traffic, Sitzungen, Trichter und E-Commerce-Umsatz; Mailchimp synchronisiert Kampagnen, Öffnungsraten, Klickraten und Zielgruppe; Klaviyo synchronisiert E-Mail-Umsatz, Flows, Öffnungsraten und Attribution. Jede synchronisiert nach dem Verbinden laufend weiter, und Sie können jederzeit eine manuelle Synchronisierung aus der Liste Verbunden auslösen.",
      },
    ],
  },

  "connect-gocardless-askbiz": {
    title: "GoCardless mit AskBiz verbinden für Lastschrift- und Abonnementzahlungen",
    description: "So verbinden Sie GoCardless in AskBiz Sources, was dabei synchronisiert wird, wo diese Daten landen und was das für Ihr Free-Plan-Quellenlimit bedeutet.",
    keywords: [
      "GoCardless", "Lastschrift", "Bacs", "Abonnements", "Mandate",
      "wiederkehrende Zahlungen", "AskBiz Sources", "Zahlungskonnektor", "GoCardless verbinden",
    ],
    keyTakeaways: [
      "GoCardless finden Sie unter Sources > Zahlungen, neben Stripe, PayPal, Klarna und SumUp.",
      "Es ist eine Ein-Klick-OAuth-Verbindung — klicken Sie auf Verbinden, melden Sie sich bei GoCardless an, genehmigen Sie Nur-Lese-Zugriff. Es gibt keinen API-Schlüssel zu suchen oder einzufügen.",
      "Es synchronisiert Ihre Lastschriftzahlungen, jede versehen mit dem Mandat, das sie autorisiert hat, sodass Sie eine Zahlung bis zur zugrunde liegenden Kundenvereinbarung zurückverfolgen können.",
      "GoCardless-Daten werden in eine eigene Tabelle namens gocardless_payments geschrieben statt in Ihren gemeinsamen Transaktions-Feed, weil Zahlungs- und Mandatsdatensätze nicht in diese Form passen — sie erscheinen also noch nicht in Ihren regulären Verkaufsberichten wie Stripe oder PayPal.",
      "Es zählt wie jeder andere Konnektor zur 3-Quellen-Obergrenze des Free-Plans; Growth- und Business-Pläne haben kein Quellenlimit.",
    ],
    content: [
      {
        heading: "Wo Sie es finden",
        body: "Öffnen Sie Sources über die AskBiz-Hauptnavigation und schauen Sie unter der Kategorie Zahlungen — es sitzt zwischen PayPal und Klarna, neben Stripe und SumUp. AskBiz gruppiert jeden Konnektor nach Kategorie (E-Commerce, Buchhaltung, Zahlungen, Marketing & Ads und so weiter), sodass Zahlungen der Ort ist, an dem alle fünf zahlungsbezogenen Quellen zusammen leben, statt über die Seite verstreut zu sein. Wenn Sie nicht scrollen möchten, filtert das Suchfeld oben auf der Sources-Seite beim Tippen, sodass „gocardless\" oder „lastschrift\" direkt zu seiner Karte springt. Die Karte zeigt eine kurze Beschreibung — Lastschriftzahlungen, Abonnements, Mandate — und eine Schaltfläche Verbinden. Einmal verbunden, rutscht sie nach oben in die Liste Verbunden neben Ihren anderen Quellen, mit einem Statuspunkt und einer zuletzt-synchronisiert-Zeit, wo Sie jederzeit eine manuelle Synchronisierung auslösen oder die Verbindung trennen können.",
      },
      {
        heading: "Verbinden: ein Klick, kein API-Schlüssel",
        body: "GoCardless ist ein OAuth-Konnektor, kein schlüsselbasierter — der Hinweis auf der Karte lautet „Leitet zu GoCardless weiter — Nur-Lese-Zugriff\", und genau das passiert. Klicken Sie auf Verbinden, und AskBiz schickt Sie zum eigenen Login-Bildschirm von GoCardless, der einen read_only-Scope anfordert. Melden Sie sich dort an und genehmigen Sie ihn, und GoCardless leitet Sie direkt zurück zu Sources. Sie sehen oder handhaben nie selbst ein Zugriffstoken, und es gibt nichts aus einer GoCardless-Einstellungsseite zu kopieren — anders als etwa Klarna oder SumUp in derselben Zahlungsgruppe, die Sie bitten, API-Zugangsdaten einzufügen. Sobald Sie den Zugriff genehmigt haben, sucht AskBiz Ihr GoCardless-Gläubigerkonto und verwendet dessen Namen als Anzeigenamen der Quelle in Ihrer Liste Verbunden, sodass sie als Ihr Unternehmen erkennbar ist statt als generische „GoCardless\"-Zeile zu erscheinen. Direkt nach dem Verbinden startet automatisch eine erste Synchronisierung, Sie müssen also nicht extra auf Jetzt synchronisieren drücken, damit es losgeht.",
      },
      {
        heading: "Was tatsächlich synchronisiert wird",
        body: "Einmal verbunden, ruft AskBiz Ihre Zahlungen von GoCardless ab — jede Lastschriftbuchung auf dem Konto, ob abgeschlossen, ausstehend oder fehlgeschlagen, zurückreichend durch Ihre vollständige Zahlungshistorie und danach bei jeder weiteren Synchronisierung aktuell gehalten. Jeder Zahlungsdatensatz enthält Betrag und Währung, seinen Status, das Buchungsdatum und jede Beschreibung, die Sie oder GoCardless hinzugefügt haben. Entscheidend: Jeder trägt auch das Mandat, das ihn autorisiert hat — die zugrunde liegende Lastschriftvereinbarung, der der Kunde zugestimmt hat — eine Zahlung ist also nicht nur eine Zahl, sondern bis zum konkreten Mandat (und damit dem Abonnement oder der Vereinbarung, die sie erzeugt hat) zurückverfolgbar. In diesem Sinne deckt der Konnektor „Zahlungen, Abonnements und Mandate\" ab: Sie erhalten einen vollständigen Feed von Zahlungen, jede bereits mit dem dahinterliegenden Mandat verknüpft, statt drei separater, unverbundener Datensätze. Da AskBiz sich seitenweise durch die API arbeitet statt einen festen Stapel abzurufen, erhält ein Unternehmen mit umfangreicher bestehender GoCardless-Historie beim ersten Sync seinen vollständigen Rückstand, nicht nur die jüngsten Buchungen.",
      },
      {
        heading: "Warum es noch nicht in Ihren regulären Berichten erscheint",
        body: "Die meisten AskBiz-Konnektoren — einschließlich Stripe und PayPal — speisen eine gemeinsame Tabelle, die Ihre Transaktionsansicht, GuV und Berichte-Seiten antreibt. GoCardless tut das bewusst nicht. Zahlungs- und Mandatsdaten haben eine andere Form als eine Bestellung oder ein Verkauf — eine Lastschriftzahlung hat keine Produktzeile, keinen Kundennamen im selben Format oder einen Kanal wie eine Shopify-Bestellung — daher schreibt AskBiz sie in eine eigene, dedizierte Tabelle statt sie in die gemeinsame zu zwingen. In der Praxis bedeutet das: Ihre GoCardless-Daten werden synchronisiert, sicher gespeichert und aktuell gehalten — sind aber noch nicht in dieselben Verkaufsberichte oder GuV-Ansichten eingemischt, in denen Ihre Stripe- oder PayPal-Zahlungen erscheinen. Wenn Sie sich auf AskBiz für eine einzige kombinierte Umsatzansicht über Zahlungsdienstleister hinweg verlassen, ist GoCardless der eine Konnektor in der Zahlungsgruppe, der aktuell etwas abseits dieses Bilds sitzt statt darin. Das ist ein Grund, weiter zu verbinden — die Daten sind erfasst und bereit, sobald das Reporting nachzieht — nur kein Grund, eine sofortige Eins-zu-eins-Übereinstimmung mit dem heutigen Verhalten von Stripe zu erwarten.",
      },
      {
        heading: "Quellenlimits im Free-Plan",
        body: "GoCardless bekommt keine Sonderbehandlung bei Planlimits — es zählt als eine Verbindung zur Obergrenze von 3 verbundenen Quellen im Free-Plan, insgesamt über alle Kategorien kombiniert, nicht 3 pro Kategorie. Wenn Sie im Free-Plan also bereits Shopify und Xero laufen haben, wäre GoCardless Ihr dritter und letzter Platz, es sei denn, Sie trennen zuerst etwas anderes. Growth- und Business-Pläne heben dieses Limit vollständig auf, sodass Sie GoCardless neben Stripe, PayPal und allem anderen in Ihrem Stack betreiben können, ohne etwas eintauschen zu müssen. Wenn Lastschrift- und Abonnementzahlungen einen wesentlichen Teil Ihres Umsatzes ausmachen, lohnt es sich, im Voraus zu entscheiden, ob GoCardless einen Ihrer drei kostenlosen Plätze verdient, oder ob ein Upgrade mehr Sinn ergibt, sobald Sie auf mehr als ein paar Quellen gleichzeitig angewiesen sind.",
      },
      {
        heading: "Wenn etwas schiefgeht",
        body: "GoCardlesss OAuth-Token für diese Verbindung kommt ohne dokumentierten Refresh-Ablauf, wenn die Verbindung also jemals aufhört zu funktionieren, liegt es am wahrscheinlichsten daran, dass das Token erneut genehmigt werden muss, statt an einem echten Sync-Fehler. Schlägt eine Synchronisierung fehl, wechselt die Zeile der Quelle in Ihrer Liste Verbunden zu einem Fehlerstatus mit einer kurzen Erklärung, und erneutes Verbinden ist die Lösung: Klicken Sie erneut auf Verbinden und genehmigen Sie den Zugriff erneut. Eines lohnt sich zu wissen, bevor Sie auf Trennen klicken: Es ist keine Pause. Das Entfernen von GoCardless aus Ihrer Liste Verbunden löscht auch dessen synchronisierte Zahlungshistorie, nicht nur die Verbindung selbst. Wenn Sie zur Fehlerbehebung trennen statt GoCardless dauerhaft zu entfernen, synchronisiert das erneute Verbinden Ihre Zahlungshistorie frisch von GoCardless, statt dort weiterzumachen, wo die alten Daten aufgehört haben.",
      },
    ],
    faq: [
      {
        q: "Brauche ich einen GoCardless-API-Schlüssel zum Verbinden?",
        a: "Nein. GoCardless verbindet sich per OAuth — klicken Sie auf der Sources-Karte auf Verbinden, und Sie werden weitergeleitet, um sich anzumelden und Nur-Lese-Zugriff auf GoCardlesss eigener Website zu genehmigen. Es gibt keinen Schlüssel oder Token, den Sie in Ihren GoCardless-Einstellungen suchen und in AskBiz einfügen müssen.",
      },
      {
        q: "Erscheinen meine GoCardless-Zahlungen in meinen AskBiz-Berichten oder der GuV neben Stripe und PayPal?",
        a: "Noch nicht. GoCardless-Zahlungs- und Mandatsdaten werden in einer eigenen dedizierten Tabelle gespeichert statt in der gemeinsamen Tabelle, die Berichte, Transaktionen und GuV speist — weil diese Daten nicht in dieselbe Form passen wie eine Bestellung oder ein Verkauf. Sie werden synchronisiert und gespeichert, sind aber derzeit getrennt von Ihrer gemischten Umsatzansicht.",
      },
      {
        q: "Ruft der Konnektor meine Abonnements als separate Liste ab, oder nur Zahlungen?",
        a: "Er synchronisiert Zahlungen — jede Lastschriftbuchung, ob abgeschlossen, ausstehend oder fehlgeschlagen — und jede Zahlung trägt das Mandat, das sie autorisiert hat, sodass Sie eine Buchung bis zur zugrunde liegenden Vereinbarung zurückverfolgen können. Es ist kein separater Feed von Abonnement- oder Mandatsobjekten unabhängig von den Zahlungen selbst.",
      },
      {
        q: "Verbraucht das Verbinden von GoCardless einen meiner Free-Plan-Quellenplätze?",
        a: "Ja. Der Free-Plan erlaubt insgesamt bis zu 3 verbundene Quellen über alle Kategorien zusammen, und GoCardless zählt genauso wie jeder andere Konnektor — Stripe, Shopify, Xero, alle. Growth- und Business-Pläne haben kein Quellenlimit.",
      },
      {
        q: "Meine GoCardless-Verbindung zeigt einen Fehler — was mache ich?",
        a: "Klicken Sie erneut auf der Sources-Seite auf Verbinden und genehmigen Sie den Zugriff über GoCardlesss Login-Bildschirm erneut — derselbe Ablauf wie beim ersten Verbinden. Beachten Sie, dass dies etwas anderes ist als das Trennen: Ein Fehlerstatus rührt Ihre synchronisierte Zahlungshistorie nicht an, aber wenn Sie zuerst auf Trennen klicken, entfernt das die synchronisierten GoCardless-Zahlungsdaten zusammen mit der Verbindung, und erneutes Verbinden synchronisiert sie frisch statt die alten Datensätze wiederherzustellen.",
      },
    ],
  },

  "connect-linnworks-askbiz": {
    title: "Linnworks mit AskBiz verbinden für kanalübergreifende Bestandssynchronisierung",
    description: "Schritt-für-Schritt-Anleitung zum Verbinden von Linnworks mit AskBiz — was der OAuth-Ablauf macht, welche Daten tatsächlich synchronisieren und wie oft sie aktualisiert werden.",
    keywords: ["Linnworks", "verbinden", "Integration", "AskBiz", "Bestand", "Multichannel", "Sources", "Bestellungen", "Auftragsabwicklung", "OAuth"],
    keyTakeaways: [
      "Linnworks finden Sie unter Sources > Bestand & Logistik, neben Cin7 und ShipStation, und verbindet sich per OAuth — Sie autorisieren in Linnworks selbst, AskBiz sieht nie ein Passwort.",
      "Der Zugriff ist nur lesend: AskBiz kann Ihre Bestellungen abrufen, aber in Ihrem Linnworks-Konto nichts erstellen, bearbeiten oder stornieren.",
      "Synchronisiert werden Ihre offenen Bestellungen — SKU, Produkt, Menge, Preis, Kanal und Abwicklungsstatus pro Position —, die AskBiz in kanalbezogenen Umsatz und Bestandsbewegungszahlen umwandelt. Es ist kein separater Live-Lagerbestandsfeed.",
      "Die Synchronisierungshäufigkeit folgt wie bei jeder anderen Quelle Ihrem AskBiz-Plan: täglich im Free-Plan, alle 6 Stunden im Growth-Plan, stündlich im Business-Plan.",
      "Das ist ein echter, funktionierender Konnektor mit eigenem Sync-Handler und Daten-Normalisierer — nicht dasselbe wie ältere AskBiz-Artikel, die Linnworks nur als Beispiel für eine Multichannel-Plattform erwähnen, die Unternehmen nutzen könnten.",
    ],
    content: [
      {
        heading: "Wo Sie es finden",
        body: "Gehen Sie von Ihrem AskBiz-Dashboard aus zu Sources. Scrollen Sie zum Abschnitt Bestand & Logistik — Linnworks sitzt dort neben Cin7 und ShipStation, mit einer kurzen Beschreibung darunter: „Kanalübergreifender Bestand, Bestellungen, Auftragsabwicklung.\" Cin7 und ShipStation bitten Sie beide, einen API-Schlüssel einzufügen (bei Cin7 zusätzlich eine Konto-ID), bevor sie sich verbinden. Linnworks ist anders — es ist der einzige der drei, der eine vollständige OAuth-Verbindung nutzt, Sie klicken also auf die Kachel, und alles Weitere passiert auf der eigenen Seite von Linnworks statt in einem Formular in AskBiz.",
      },
      {
        heading: "Bevor Sie sich verbinden",
        body: "Sie benötigen Admin- oder zumindest App-Autorisierungszugriff auf Ihr Linnworks-Konto — dieselbe Zugriffsebene, die Sie brauchen würden, um eine beliebige Drittanbieter-App innerhalb von Linnworks selbst zu genehmigen. Sie müssen vorab keine API-Schlüssel, Secrets oder Tokens erzeugen oder kopieren; AskBiz bittet Sie bei diesem Konnektor um nichts zum Einfügen, was der wesentliche praktische Unterschied zu Cin7 direkt daneben ist. Die Sources-Seite sagt Ihnen genau, was Sie erwartet, bevor Sie irgendetwas anklicken: „Leitet zu Linnworks weiter — Nur-Lese-Zugriff.\" Diese Zeile ist eine wörtliche Beschreibung dessen, was als Nächstes passiert, kein Marketingtext — AskBiz fordert die Erlaubnis an, Ihre Bestellungen zu lesen, und nichts weiter.",
      },
      {
        heading: "Schritt 1 & 2: In Linnworks autorisieren",
        body: "Ein Klick auf die Linnworks-Kachel schickt Sie zu Linnworks' eigenem OAuth-Autorisierungsbildschirm, wo Sie sich anmelden (falls noch nicht geschehen) und genau prüfen, worum AskBiz zum Lesen bittet, bevor Sie es genehmigen. Sie werden nie innerhalb von AskBiz nach einem Linnworks-Passwort gefragt — der gesamte Austausch findet auf der Domain von Linnworks statt, was Standard-OAuth-Praxis ist und demselben Muster folgt, das AskBiz für Shopify, Xero und seine anderen OAuth-basierten Quellen verwendet. Entscheiden Sie sich dagegen, können Sie diesen Bildschirm einfach schließen oder zurückgehen; nichts wird verbunden, bis Sie tatsächlich genehmigen. Sobald Sie genehmigen, leitet Linnworks Sie automatisch direkt zurück zur Sources-Seite von AskBiz — es gibt keinen Code, den Sie irgendwo kopieren oder einfügen müssen.",
      },
      {
        heading: "Schritt 3: Was nach der Genehmigung passiert",
        body: "Auf dem Rückweg tauscht AskBiz den Autorisierungscode, den Linnworks ihm übergibt, gegen ein Zugriffstoken ein und speichert dieses Token verschlüsselt in Ihrem Konto zusammen mit der Linnworks-Server-URL, die Linnworks Ihrem Konto zuweist. Dieses Token ist dauerhaft — es läuft nicht wie ein typisches Sitzungstoken ab — aber AskBiz nutzt es nie direkt gegen Linnworks' Bestell-API. Stattdessen präsentiert es bei jeder Synchronisierung dieses dauerhafte Token dem AuthorizeByApplication-Endpunkt von Linnworks, um ein frisches, kurzlebiges Sitzungstoken zu erzeugen (Linnworks' eigene Sitzungstokens halten nur etwa 20 Minuten, weit kürzer als jedes realistische Synchronisierungsintervall), und genau dieses frisch erzeugte Sitzungstoken wird tatsächlich verwendet, um Ihre Bestellungen abzurufen. Sie sehen davon nichts — es ist der Mechanismus, der die Verbindung zuverlässig unbegrenzt am Laufen hält, ohne Sie je zum erneuten Verbinden oder Autorisieren aufzufordern. In dem Moment, in dem Ihre Verbindung gespeichert ist, startet AskBiz außerdem automatisch eine erste Synchronisierung, es gibt also nichts weiter zu klicken.",
      },
      {
        heading: "Welche Daten tatsächlich synchronisieren",
        body: "Jede Synchronisierung ruft Ihre offenen Bestellungen aus Linnworks ab. Für jede Position in jeder Bestellung erfasst AskBiz SKU, Produktname, Menge, Einzelpreis, Einzelkosten (sofern Linnworks eine angibt), über welchen Verkaufskanal die Bestellung einging, und den Status der Bestellung. Das wird in dieselben Datensatzfelder normalisiert, die AskBiz für jede andere verbundene Quelle nutzt — Bruttoumsatz, Kosten, Marge, verkaufte Einheiten und Bestandsbewegung —, sodass Ihre Linnworks-Bestellungen in Ihren Berichten neben Ihren Shopify-, Amazon- oder Kassen-Verkäufen stehen statt als separate Insel, die Sie extra prüfen müssen. Kommt eine Bestellung ohne Positionen an, erfasst AskBiz sie trotzdem als eine einzelne Zeile mit dem Bestellgesamtbetrag, sodass nichts stillschweigend verschwindet, nur weil die Positionsdetails nicht verfügbar waren. Es lohnt sich, hier präzise zu sein: Was heute synchronisiert, ist Bestellaktivität, kein eigenständiger Live-Lagerbestandsfeed. AskBiz leitet Bestandsbewegung aus verkauften Einheiten pro Bestellung ab, statt Linnworks' absolute Bestandsmengen direkt abzurufen — jede synchronisierte Bestellung senkt die Bestandsbewegungszahl für diese SKU, aber AskBiz fragt Linnworks nicht separat „wie viele habe ich gerade noch im Lager\". Wenn Sie sich auf Linnworks als Ihre wahre Bestandsquelle verlassen, tun Sie das weiterhin. AskBiz' Sicht hier ist bestellungsgetrieben, was für Umsatz-, Kanal- und Produktleistungsanalyse zutreffend ist, aber kein Ersatz für die Prüfung der Live-Lagerbestände in Linnworks selbst vor einer Einkaufsentscheidung.",
      },
      {
        heading: "Wie oft neu synchronisiert wird",
        body: "Einmal verbunden, folgt Linnworks demselben Sync-Zeitplan wie jede andere Quelle, gesteuert von Ihrem AskBiz-Plan: einmal täglich im Free-Plan, alle 6 Stunden im Growth-Plan, stündlich im Business-Plan. Linnworks hat kein eigenes langsameres Mindestintervall, wie es ein paar andere Konnektoren haben — Stripe ist selbst im Business-Plan auf 3 Stunden begrenzt und Etsy auf 8 Stunden, weil sich deren zugrunde liegende Daten schlicht nicht schnell genug ändern, um häufigeres Abfragen zu rechtfertigen — Linnworks folgt also einfach dem Rhythmus, den Ihr Plan erlaubt, genau wie Shopify, Amazon oder Xero. Wenn Sie nach einem großen Verkaufsschub über Ihre Kanäle hinweg aktuellere Zahlen möchten, gehen Sie zurück zur Sources-Seite, finden Sie Linnworks in Ihrer Liste verbundener Quellen und klicken Sie auf Jetzt synchronisieren — das löst eine sofortige Synchronisierung außerhalb des regulären Zeitplans aus, ohne zu beeinflussen, wann die nächste geplante Synchronisierung läuft. Dieselbe Zeile auf dieser Seite zeigt einen Statuspunkt (grün, wenn es sauber synchronisiert, gelb oder rot, wenn etwas Aufmerksamkeit braucht) und eine „zuletzt synchronisiert\"-Zeit, sodass Sie auf einen Blick sehen, wie aktuell Ihre Linnworks-Daten sind, bevor Sie sich darauf verlassen.",
      },
      {
        heading: "Wenn Sie AskBiz' Leitfaden zum Multichannel-Verkauf gelesen haben",
        body: "AskBiz' allgemeine Academy-Inhalte zum Multichannel-Verkauf erwähnen Linnworks als Beispiel für die Art von Plattform, die Unternehmen nutzen, um Bestellungen über Kanäle hinweg zu zentralisieren — das ist ein generischer Verweis auf die Werkzeugkategorie, geschrieben, bevor AskBiz sich direkt mit Linnworks verbunden hat. Dieser Artikel handelt von etwas anderem: AskBiz' eigener direkter Verbindung zu Ihrem Linnworks-Konto, oben beschrieben. Wenn Sie Linnworks bereits als Ihre Multichannel-Zentrale nutzen, bringt das Verbinden hier diese Daten tatsächlich in AskBiz' Berichte.",
      },
    ],
    faq: [
      { q: "Erhält AskBiz Schreibzugriff auf mein Linnworks-Konto?", a: "Nein. Die Verbindung ist nur lesend — AskBiz kann Ihre Bestelldaten abrufen, aber in Linnworks nichts erstellen, bearbeiten, stornieren oder abwickeln. Die Sources-Seite gibt das ausdrücklich an, bevor Sie sich verbinden." },
      { q: "Zeigt mir das meine genauen aktuellen Lagerbestände aus Linnworks?", a: "Nicht direkt. AskBiz synchronisiert Ihre offenen Bestellungen und leitet daraus die Bestandsbewegung ab (verkaufte Einheiten pro SKU) — es ruft derzeit keinen separaten Live-Lagerbestandsfeed ab. Für Ihre verbindlichen Bestandsmengen prüfen Sie Linnworks selbst." },
      { q: "Wie unterscheidet sich das von der Linnworks-Erwähnung im Multichannel-Verkaufsartikel von AskBiz?", a: "Dieser Artikel erwähnt Linnworks generisch, als Beispiel für die Kategorie von Multichannel-Management-Tools, die Unternehmen nutzen — er beschreibt keine Verbindung zu AskBiz. Dieser Artikel behandelt AskBiz' tatsächlichen Linnworks-Konnektor, der echte Bestelldaten in Ihr Konto bringt." },
      { q: "Wie oft aktualisieren sich meine Linnworks-Daten in AskBiz?", a: "Es folgt dem normalen Sync-Zeitplan Ihres Plans: täglich im Free-Plan, alle 6 Stunden im Growth-Plan, stündlich im Business-Plan. Sie können jederzeit auch eine sofortige Synchronisierung über die Schaltfläche Jetzt synchronisieren auf der Sources-Seite auslösen." },
      { q: "Was tue ich, wenn ich neu verbinden muss oder etwas falsch aussieht?", a: "Gehen Sie zu Sources, finden Sie Linnworks in Ihrer Liste verbundener Quellen, und nutzen Sie Trennen, gefolgt von erneutem Verbinden über denselben OAuth-Ablauf. Wenn eine Synchronisierung fehlschlägt, zeigt die Statuszeile eine Fehlermeldung, statt stillschweigend nichts zu tun." },
    ],
  },

  "connect-xero-freeagent-askbiz": {
    title: "Xero oder FreeAgent mit AskBiz verbinden",
    description: "So verbinden Sie Xero oder FreeAgent unter Sources > Buchhaltung, was jede davon in AskBiz synchronisiert und wie sie sich von Sage und Wave in derselben Kategorie unterscheiden.",
    keywords: [
      "Xero", "FreeAgent", "AskBiz Sources", "Buchhaltungskonnektoren",
      "Xero verbinden", "FreeAgent verbinden", "Rechnungen synchronisieren", "Buchhaltungsintegration",
    ],
    keyTakeaways: [
      "Xero und FreeAgent finden Sie beide unter Sources > Buchhaltung, neben QuickBooks, Sage und Wave.",
      "Beide verbinden sich mit einem Klick per OAuth — Sie melden sich an und genehmigen Nur-Lese-Zugriff, es gibt nichts einzufügen. Sage und Wave in derselben Kategorie bitten stattdessen um das Einfügen von API-Zugangsdaten.",
      "Was tatsächlich in AskBiz einfließt, sind Ihre Rechnungen — sowohl eingehendes Geld (Verkaufsrechnungen) als auch ausgehendes Geld (Eingangsrechnungen) —, die Ihre AskBiz-Umsatz- und Ausgabenberichte speisen.",
      "Das ist ein separater, einseitiger Abruf: AskBiz liest von Xero/FreeAgent fürs Reporting. Wenn Sie auch AskBiz POS nutzen, sendet dessen eigene (andere) Xero-Integration POS-Verkäufe zur Buchhaltung an Xero — die beiden sind nicht dieselbe Verbindung.",
      "Wie oft neu synchronisiert wird, hängt von Ihrem Plan ab: täglich im Free-Plan, alle 6 Stunden im Growth-Plan, stündlich im Business-Plan.",
    ],
    content: [
      {
        heading: "Wo Sie sie finden",
        body: "Öffnen Sie Sources über die AskBiz-Hauptnavigation. Konnektoren sind nach Kategorie gruppiert, und Buchhaltung ist eine dieser Gruppen — neben E-Commerce, Zahlungen, Marketing & Ads und den übrigen. Innerhalb von Buchhaltung finden Sie fünf Karten: QuickBooks, Xero, Sage, FreeAgent und Wave. Wenn Scrollen nichts für Sie ist, filtert das Suchfeld oben auf der Sources-Seite direkt auf eine Karte, wenn Sie „xero\" oder „freeagent\" eintippen. Xeros Karte beschreibt Rechnungen, Kontoabgleich, GuV und Gehaltsabrechnung; FreeAgents Karte beschreibt Rechnungen, Ausgaben, Steuer-Zeitplan und Cashflow — das ist der Bereich, den jede Plattform allgemein abdeckt. Was AskBiz tatsächlich von einer der beiden abruft, ist enger gefasst und konkret: Ihre Rechnungen.",
      },
      {
        heading: "Xero verbinden",
        body: "Klicken Sie auf der Xero-Karte auf Verbinden. AskBiz leitet Sie zu Xero weiter, um sich anzumelden und Nur-Lese-Zugriff auf Ihre Organisation zu genehmigen — es gibt keine Client-ID, kein Secret und kein Token, das Sie suchen und einfügen müssen. Nach der Genehmigung werden Sie zurück zu AskBiz geschickt, und die Karte rutscht mit einer Statusanzeige und einer zuletzt-synchronisiert-Zeit in die Liste Verbunden oben auf der Seite.",
      },
      {
        heading: "FreeAgent verbinden",
        body: "FreeAgent funktioniert genauso. Klicken Sie auf Verbinden, melden Sie sich bei FreeAgent an und genehmigen Sie Nur-Lese-Zugriff — auch hier gibt es keine Zugangsdaten manuell zu kopieren. Da ein FreeAgent-OAuth-Token auf ein einzelnes Unternehmen begrenzt ist, müssen Sie danach nicht wie bei manchen Multi-Unternehmens-Plattformen einen Mandanten oder ein Unternehmen auswählen; die Verbindung ist an das FreeAgent-Unternehmen gebunden, für das Sie den Zugriff genehmigt haben.",
      },
      {
        heading: "Der Unterschied zu Sage und Wave, direkt daneben",
        body: "Xero und FreeAgent sind die beiden OAuth-Verbindungen in der Buchhaltungsgruppe — bei keinem der beiden sehen Sie ein Formularfeld. Sage und Wave, in derselben Liste, funktionieren anders: Sage bittet Sie, eine Client-ID und ein Client-Secret aus dem Sage Developer Portal einzufügen, und Wave bittet um ein Zugriffstoken, das Sie unter Waves eigener Seite Settings > Developer erzeugen. Wenn Sie es gewohnt sind, für Sage oder Wave Zugangsdaten einzufügen, suchen Sie bei Xero oder FreeAgent nicht nach einem entsprechenden Feld — bei diesen beiden ist der gesamte Vorgang: Auf Verbinden klicken und den Zugriff im eigenen Login-Bildschirm des Anbieters genehmigen.",
      },
      {
        heading: "Was tatsächlich synchronisiert",
        body: "Einmal verbunden, ruft AskBiz Ihre Rechnungen von Xero (oder FreeAgent) ab und teilt sie nach Typ auf. Verkaufsrechnungen — Geld, das Ihnen geschuldet wird — werden zu Umsatzposten in AskBiz, mit Produkt-/Zeilenbeschreibung, Menge, Preis, Währung und Zahlungsstatus (bezahlt, ausstehend oder teilweise bezahlt) direkt von der Rechnung übernommen. Eingangsrechnungen — Geld, das Sie schulden — werden zu Ausgabenposten, versehen mit Lieferant, Betrag, Datum und Kategorie. Zusammen ist das, was Ihre AskBiz-GuV und Ihr Ausgaben-Reporting von beiden Plattformen speist. Bei Xero werden Rechnungen seitenweise abgerufen und danach sortiert, wann sie zuletzt aktualisiert wurden, sodass Änderungen, die Sie in Xero vornehmen — eine Zahlung erfasst, eine Rechnung geändert — bei der nächsten Synchronisierung erfasst werden, nicht nur zum ursprünglichen Erstellungsdatum der Rechnung. Xeros und FreeAgents eigene Funktionen für Kontoabgleich, Gehaltsabrechnung und Steuer-Zeitplan bleiben in Xero bzw. FreeAgent selbst — AskBiz ruft diese konkreten Zahlen nicht ab, nur die Rechnungs- und Eingangsrechnungsdaten.",
      },
      {
        heading: "Die Token-Verbindung am Leben halten",
        body: "OAuth-Tokens laufen konstruktionsbedingt regelmäßig ab, und AskBiz erneuert beide automatisch im Hintergrund — bei Xero über dessen Identitätsdienst, bei FreeAgent über dessen eigenen Token-Endpunkt —, sodass eine normale Synchronisierung Sie nicht zum erneuten Anmelden auffordert. Schlägt eine Erneuerung fehl (zum Beispiel, weil der Zugriff auf Xero- oder FreeAgent-Seite widerrufen wurde), zeigt die verbundene Quelle einen Fehlerstatus mit einer kurzen Meldung auf der Sources-Seite, und erneutes Verbinden ist derselbe Ein-Klick-Vorgang wie beim ersten Mal.",
      },
      {
        heading: "Wie oft neu synchronisiert wird",
        body: "Die Synchronisierungshäufigkeit ist an Ihren AskBiz-Plan gebunden, nicht an den Konnektor selbst: täglich im Free-Plan, alle 6 Stunden im Growth-Plan, stündlich im Business-Plan. Weder Xero noch FreeAgent hat ein besonderes langsameres Mindestintervall, wie es ein paar andere Konnektoren haben, Sie erhalten also das normale Intervall Ihres Plans. Wenn Sie die aktuellsten Zahlen ohne Wartezeit möchten, drücken Sie „Jetzt synchronisieren\" bei der verbundenen Quelle auf der Sources-Seite, und es wird sofort abgerufen, unabhängig davon, wann die nächste geplante Synchronisierung fällig ist.",
      },
      {
        heading: "Trennen oder wechseln",
        body: "Beide Quellen sitzen einmal eingerichtet in der Liste Verbunden, neben jeder anderen verknüpften Quelle, jede mit eigener Schaltfläche Trennen. Trennen ist eine echte Bereinigung, keine bloße Pause: AskBiz widerruft das Token beim Anbieter und entfernt die Umsatzdatensätze, die diese Quelle synchronisiert hat, sodass eine alte oder falsche Verbindung nicht weiterhin Zahlen in Ihren Berichten hinterlässt. Müssen Sie später erneut verbinden oder wechseln, welche Xero-Organisation oder welches FreeAgent-Unternehmen verknüpft ist, trennen Sie zuerst und gehen Sie dann erneut über Verbinden, um das neue zu autorisieren — die nächste Synchronisierung befüllt Ihre Daten von Grund auf neu.",
      },
      {
        heading: "Wenn Sie auch AskBiz POS mit Xero nutzen",
        body: "Wegen der Namensüberschneidung lohnt sich Klarheit: Dieser Sources-Konnektor ist ein einseitiger Abruf in AskBiz fürs Reporting — er liest Ihre Xero- oder FreeAgent-Daten, damit sie in Ihren Dashboards und der GuV erscheinen. Wenn Sie AskBiz POS nutzen, hat POS unter seinen eigenen Einstellungen eine separate Xero-Integration, die das Gegenteil tut — sie sendet Ihre POS-Verkäufe als Rechnungsentwürfe an Xero, für Ihre Buchhaltung. Die beiden sind nicht miteinander verknüpft und teilen sich keine Verbindung: Das Verbinden der einen verbindet oder beeinflusst die andere nicht, und Sie können je nach Bedarf eine, beide oder keine nutzen.",
      },
    ],
    faq: [
      {
        q: "Muss ich für Xero oder FreeAgent einen API-Schlüssel oder ein Client-Secret einfügen?",
        a: "Nein. Beide sind OAuth-Konnektoren — klicken Sie auf Verbinden, melden Sie sich bei Xero oder FreeAgent an und genehmigen Sie Nur-Lese-Zugriff. Das unterscheidet sich von Sage und Wave in derselben Buchhaltungsgruppe, die um das Einfügen von Zugangsdaten bitten.",
      },
      {
        q: "Richtet das Verbinden von Xero mit Sources auch die POS-zu-Xero-Buchhaltungssynchronisierung ein?",
        a: "Nein, das sind unabhängige Verbindungen. Dieser Sources-Konnektor zieht Ihre Xero-Daten fürs Reporting in AskBiz. AskBiz POS hat in seinen eigenen Einstellungen eine separate Xero-Integration, die POS-Verkäufe als Rechnungsentwürfe an Xero sendet. Das Verbinden der einen verbindet nicht die andere.",
      },
      {
        q: "Welche Daten erscheinen nach dem Verbinden tatsächlich in AskBiz — alles aus Xero?",
        a: "Konkret Ihre Rechnungen: Verkaufsrechnungen werden zu Umsatzdatensätzen (mit Menge, Preis, Währung und Zahlungsstatus), und Eingangsrechnungen werden zu Ausgabendatensätzen (Lieferant, Betrag, Kategorie). Xeros und FreeAgents eigene Funktionen für Kontoabgleich, Gehaltsabrechnung und Steuer-Zeitplan werden nicht übernommen — die bleiben in Xero bzw. FreeAgent.",
      },
      {
        q: "Wie oft aktualisieren sich die Daten, sobald verbunden?",
        a: "Es folgt dem Sync-Intervall Ihres AskBiz-Plans — täglich im Free-Plan, alle 6 Stunden im Growth-Plan, stündlich im Business-Plan. Sie können außerdem jederzeit auf „Jetzt synchronisieren\" bei der verbundenen Quelle klicken, um die aktuellsten Daten sofort abzurufen, statt zu warten.",
      },
      {
        q: "Was passiert, wenn meine Xero- oder FreeAgent-Verbindung aufhört zu funktionieren?",
        a: "AskBiz erneuert das zugrunde liegende Zugriffstoken bei jeder Synchronisierung automatisch, sodass das normalerweise nichts von Ihnen erfordert. Schlägt eine Erneuerung dennoch fehl — etwa weil der Zugriff auf Xero- oder FreeAgent-Seite widerrufen wurde —, zeigt die Quelle einen Fehlerstatus mit einer kurzen Meldung auf der Sources-Seite, und Sie verbinden auf demselben Weg erneut, wie Sie es zum ersten Mal getan haben.",
      },
    ],
  },

  "connect-jumia-marketplace-askbiz": {
    title: "Jumia mit AskBiz verbinden: Bestellungen, Auszahlungen & Bestand für afrikanische Marktplätze",
    description:
      "So verknüpfen Sie Ihr Jumia-Vendor-Center-Konto mit AskBiz über eine Client-ID und ein Refresh-Token, was dabei tatsächlich synchronisiert und was noch außerhalb des Umfangs liegt.",
    keywords: [
      "Jumia",
      "Jumia Vendor Center",
      "Jumia Konnektor",
      "Marktplatz-Integration",
      "afrikanischer E-Commerce",
      "Sources",
      "AskBiz",
      "Bestandssynchronisierung",
      "Bestellsynchronisierung",
    ],
    keyTakeaways: [
      "Jumia finden Sie unter Sources > E-Commerce neben Shopify, Amazon FBA, eBay, Etsy, WooCommerce und Walmart — anders als bei diesen gibt es aber keine Ein-Klick-OAuth-Weiterleitung.",
      "Sie verbinden es manuell, indem Sie eine Client-ID und ein Refresh-Token einfügen, die Sie selbst in Jumia Vendor Center > Settings > Applications (Self Authorisation) erzeugen.",
      "Jede Synchronisierung ruft aktuelle Bestellungen und den aktuellen Lagerbestand Ihrer Jumia-Storefronts ab; der pro Bestellung angezeigte Auszahlungsbetrag ist eine Schätzung aus dem Bestellumsatz, nicht Jumias offizielle abgerechnete Auszahlungsübersicht.",
      "Jumia-Bestand fließt direkt in Ihre CFO-Bestandsansicht und kanalbezeichnete Bestandswarnungen ein — Jumia-Versand und Sendungsverfolgung sind bewusst nicht Teil des Funktionsumfangs dieses Konnektors.",
      "Das ist ein neu gebauter Konnektor, intern gegen Jumias API geprüft, aber noch nicht durchgängig an einem aktiven Verkäuferkonto verifiziert — es lohnt sich, Ihre erste Synchronisierung gegen Vendor Centers eigene Zahlen stichprobenartig zu prüfen.",
    ],
    content: [
      {
        heading: "Was der Jumia-Konnektor macht",
        body: "Jumia ist eine der E-Commerce-Quellen unter Sources in AskBiz, neben Shopify, Amazon FBA, eBay, Etsy, WooCommerce und Walmart. Einmal verbunden, ist es ein reiner Abruf: AskBiz liest Ihre aktuellen Bestellungen und den aktuellen Lagerbestand aus Jumia Vendor Center und fügt sie in Ihre einheitlichen Geschäftsdaten ein, denselben Ort, an dem jeder andere Kanal — Ihre physische Kasse, Ihr Shopify-Shop, Ihre Amazon-Angebote — landet. Genau darum geht es beim Verbinden überhaupt: Statt sich separat bei Vendor Center anzumelden, um zu prüfen, wie Ihre Jumia-Storefront läuft, erscheinen deren Bestellungen und Bestand neben allem anderen, in einem Dashboard, in Ihrer lokalen Währung.",
      },
      {
        heading: "Warum es keine Ein-Klick-Schaltfläche „Verbinden\" gibt",
        body: "Shopify, Amazon FBA, eBay und Etsy nutzen alle Standard-OAuth — Sie klicken auf Verbinden, werden weitergeleitet, um sich bei dieser Plattform anzumelden, genehmigen den Zugriff und landen bereits verbunden zurück in AskBiz. Jumias Vendor Center bietet das für Drittanbieter-Apps nicht an. Stattdessen läuft es über das, was Jumia Self Authorization nennt: Sie erstellen Ihre eigene Application innerhalb Ihres eigenen Vendor-Center-Kontos, und das erzeugt eine Client-ID und ein Refresh-Token, die auf Ihren Shop begrenzt sind. Es gibt keine AskBiz-eigene App, die Sie genehmigen, und es wird nie ein Passwort zwischen den beiden ausgetauscht — Sie erzeugen ein Zugangsdatenpaar, das nur Ihr Jumia-Konto kontrolliert, und übergeben AskBiz dann diese beiden Werte direkt.",
      },
      {
        heading: "Ihr Konto Schritt für Schritt verbinden",
        body: "Melden Sie sich bei Jumia Vendor Center an und gehen Sie zu Settings, dann Applications. Klicken Sie auf Create Application und wählen Sie Self Authorisation als Typ. Jumia zeigt Ihnen eine Client-ID — kopieren Sie sie — und lässt Sie ein Refresh-Token erzeugen — kopieren Sie das ebenfalls. Zurück in AskBiz gehen Sie zu Sources, finden Jumia unter E-Commerce und fügen die Client-ID in das Feld Client-ID und das Refresh-Token in das Feld Refresh-Token ein (dieses ist maskiert, wie ein Passwort). AskBiz prüft die Zugangsdaten sofort, indem es ein Zugriffstoken von Jumia anfordert und bestätigt, dass es Ihre Shop-Liste lesen kann, bevor die Verbindung gespeichert wird. Schlägt diese Prüfung fehl, liegt die häufigste Ursache darin, dass die Application in Vendor Center nicht über die Berechtigungen Order oder Product verfügt — gehen Sie zurück und bestätigen Sie, dass diese Rollen angehakt sind, dann versuchen Sie es erneut.",
      },
      {
        heading: "Was tatsächlich synchronisiert — und was nicht",
        body: "Jede Synchronisierung ruft Ihre aktuellen Bestellungen ab (ein rollierendes Zeitfenster, neueste zuerst) und für jede davon die einzelnen Bestellpositionen — Jumias Modell liefert eine Zeile pro verkaufter Einheit statt eines Mengenfelds, eine 3-Stück-Position auf Ihrer Storefront kommt also als drei separate Positionen zurück, jede mit eigenem Preis-, Rabatt-, Steuer- und Versandwert. Bestandsmengen kommen von einem separaten Katalog-Endpunkt, nach SKU sortiert. Wichtig zu wissen: Der Auszahlungsbetrag, den Sie bei einer Jumia-Bestellung in AskBiz sehen, wird aus dem Nettoumsatz dieser Bestellung nach Rabatten berechnet, nicht aus Jumias offizieller Abrechnungsübersicht abgerufen — Jumia legt echte Provisions- und Gebührenabzüge nur über einen separaten Auszahlungsübersicht-Endpunkt offen, den dieser Konnektor derzeit nicht liest. Behandeln Sie den Auszahlungsbetrag als nützliche Schätzung zur Trendverfolgung, nicht als Ersatz für den Auszahlungsbericht in Vendor Center selbst, wenn Sie die genaue Zahl brauchen. Der Konnektor ist außerdem in beide Richtungen rein lesend: Er schreibt nie zurück in Ihre Jumia-Angebote, Preise oder Bestände, und er berührt bewusst nicht Jumias Sendungs- oder Sendungsverfolgungsdaten — dieser Konnektor dreht sich um Sichtbarkeit von Verkäufen und Bestand, nicht um Logistikabwicklung.",
      },
      {
        heading: "Wo Sie es in AskBiz sehen",
        body: "Jumia-Bestellungen zählen zu Ihrem kombinierten Umsatz und den Bestellsummen über alle verbundenen Kanäle hinweg, jeweils in der eigenen lokalen Währung der Storefront bepreist. Bestandsmengen fließen in Ihre CFO-Bestandsansicht ein, wo möglich mit demselben Produkt abgeglichen — beachten Sie, dass Jumias Bestandsfeed keinen Produktnamen enthält, bis er also mit einem benannten Angebot aus einem anderen Kanal abgeglichen ist, zeigt AskBiz stattdessen die SKU an. Bestandswarnungen sind nach Kanal beschriftet, eine Warnung, dass eine Jumia-SKU knapp wird, wird also nicht mit derselben SKU verwechselt, die in Ihrem physischen Laden noch gut läuft. Und im Kanalfilter des Intelligence-Tabs ist Jumia eine wählbare Option, sodass Sie die Jumia-Leistung isoliert von allem anderen betrachten können, was Sie verkaufen.",
      },
      {
        heading: "Was Sie wissen sollten, bevor Sie sich darauf verlassen",
        body: "Dieser Konnektor wurde kürzlich hinzugefügt. Er wurde gebaut und intern gegen Jumias dokumentierte Vendor-Center-API geprüft, aber noch nicht durchgängig gegen ein aktives, echtes Jumia-Verkäuferkonto ausgeführt — behandeln Sie Ihre erste Synchronisierung also als etwas, das Sie gegen Vendor Centers eigene Bestell- und Bestandszahlen stichprobenartig prüfen sollten, statt anzunehmen, dass sie von Tag eins an exakt ist. Schlägt eine Synchronisierung mit einem Fehler zum Refresh-Token fehl, bedeutet das fast immer, dass es in Vendor Center widerrufen wurde oder abgelaufen ist — erzeugen Sie eine neue Client-ID und ein neues Refresh-Token und verbinden Sie sich von Sources aus erneut. Im Hintergrund erzeugt AskBiz außerdem bei jeder Synchronisierung ein frisches Zugriffstoken aus Ihrem Refresh-Token, statt eines wiederzuverwenden, da Jumias Zugriffstoken kurzlebig sind, und es drosselt seine Anfragen bewusst, um unter Jumias Ratenlimit zu bleiben, statt sie alle auf einmal abzufeuern. Da jede Synchronisierung einen begrenzten Stapel Ihrer aktuellsten Bestellungen abruft, kann bei einer sehr umsatzstarken Storefront die vollständige aktuelle Historie über ein paar Synchronisierungen hinweg statt auf einen Schlag beim ersten Lauf einlaufen.",
      },
    ],
    faq: [
      {
        q: "Funktioniert das Verbinden von Jumia genauso wie bei Shopify oder Amazon, mit einer Login-Weiterleitung?",
        a: "Nein. Shopify, Amazon FBA, eBay und Etsy nutzen OAuth — Sie klicken auf Verbinden und melden sich auf deren Seite an. Jumia unterstützt das für Drittanbieter-Apps nicht, Sie erzeugen also selbst eine Client-ID und ein Refresh-Token in Jumia Vendor Center > Settings > Applications und fügen beide dann in AskBiz unter Sources ein.",
      },
      {
        q: "Kann AskBiz meine Jumia-Preise, Angebote oder Bestandsmengen ändern?",
        a: "Nein. Der Konnektor ist rein lesend — er liest Ihre Bestellungen und Ihren Bestand von Jumia, schreibt aber nie etwas zurück in Ihre Jumia-Storefront.",
      },
      {
        q: "Sehe ich den Jumia-Versand- oder Sendungsverfolgungsstatus in AskBiz?",
        a: "Derzeit nicht. Versand- und Sendungsverfolgungsdaten liegen bewusst außerhalb des Funktionsumfangs dieses Konnektors — er deckt Bestellungen, Umsatz und Bestand ab, nicht Logistik.",
      },
      {
        q: "Der Auszahlungsbetrag bei einer Jumia-Bestellung stimmt nicht mit dem überein, was Jumia mir tatsächlich zahlt — warum?",
        a: "Diese Zahl wird aus dem Nettoumsatz der Bestellung nach Rabatten geschätzt, nicht aus Jumias offizieller Auszahlungsübersicht abgerufen, die echte Provisions- und Gebührenabzüge separat ausweist. Nutzen Sie Vendor Centers eigenen Auszahlungsbericht für den genauen abgerechneten Betrag.",
      },
      {
        q: "Meine Jumia-Synchronisierung hat plötzlich aufgehört zu funktionieren — was mache ich?",
        a: "Das bedeutet fast immer, dass Ihr Refresh-Token in Vendor Center widerrufen wurde oder abgelaufen ist. Erzeugen Sie eine neue Client-ID und ein neues Refresh-Token unter Settings > Applications und verbinden Sie sich von Sources aus mit den frischen Werten erneut.",
      },
    ],
  },

  "pos-receipt-design-vat-askbiz": {
    title: "Der neu gestaltete Kassenbeleg von AskBiz: Aufgeschlüsseltes Layout & dynamische MwSt.",
    description:
      "Der Beleg, den AskBiz nach einem Verkauf per WhatsApp sendet, ist jetzt ein Bild im echten Kassenbeleg-Look — gerissene Kanten, umrahmte Summe, dekorativer Barcode — und seine MwSt.-Zeile erscheint nur bei Unternehmen, die tatsächlich eine hinterlegte USt-IdNr. haben.",
    keywords: [
      "Belegdesign",
      "Kassenbeleg",
      "WhatsApp-Beleg",
      "MwSt-Beleg",
      "dynamische MwSt",
      "AskBiz POS",
      "digitaler Beleg",
      "Belegbild",
    ],
    keyTakeaways: [
      "Der Beleg, den AskBiz nach einem Verkauf per WhatsApp sendet, ist jetzt ein gerendertes Bild im Stil eines echten Kassenbelegs — Courier-Prime-Monospace-Schrift, gerissene/perforierte obere und untere Kante, eine umrahmte SUMME und ein dekorativer Barcode — nicht mehr die schlichte Textzusammenfassung von früher.",
      "Eine Zeile „USt-IdNr.\" und die Steuerbezeichnung „MwSt. (Satz%)\" erscheinen nur, wenn Ihr Unternehmen eine hinterlegte USt-IdNr. unter Einstellungen hat. Ohne hinterlegte Nummer sehen Kunden stattdessen eine allgemeine Zeile „Steuer\" — es gibt keinen separaten Ein-/Aus-Schalter, die Nummer selbst ist das Kennzeichen.",
      "AskBiz versucht immer zuerst, das Bild zu senden; schlägt das aus irgendeinem Grund fehl, greift automatisch eine kürzere Text-Zusammenfassungsnachricht — nichts, das Sie konfigurieren oder erneut versuchen müssen.",
      "Das Bild wird jedes Mal frisch aus der tatsächlichen Transaktion erzeugt, wenn es abgerufen wird, es ist also nie ein veralteter Screenshot — und der Abruf selbst benötigt keinen Login, weil die nicht erratbare Transaktions-ID die Zugriffskontrolle übernimmt.",
    ],
    content: [
      {
        heading: "Was sich geändert hat",
        body: "Wenn der Beleg eines Kunden nach einem Verkauf per WhatsApp ausging, kam er früher als schlichte Textnachricht an — eine kurze Zeile oder zwei mit einer Zusammenfassung der Summe, Ihres Firmennamens und der Zahlungsart. Das gibt es weiterhin als Rückfalloption, aber die meisten Kunden sehen es nicht mehr. Der primäre Beleg, den AskBiz jetzt sendet, ist ein echtes Bild, gestaltet, um wie ein gedruckter Kassenbeleg auszusehen, mit jeder Artikelzeile, der Zwischensumme, jedem Rabatt, der Steuer und der Endsumme genau so dargestellt, wie ein Papierbeleg sie zeigen würde. Auf Ihrer Seite ändert sich nichts, um das zu bekommen — es passiert automatisch bei jedem Verkauf, bei dem ein Beleg gesendet wird.",
      },
      {
        heading: "Wie ein neu gestalteter Beleg aussieht",
        body: "Das Bild ist in Courier Prime gesetzt, einer Monospace-Schreibmaschinen-artigen Schrift, was den größten Teil dessen ausmacht, was es wie einen Beleg statt einer generischen Nachrichtenkarte lesen lässt. Die obere und untere Kante sind als gerissener/perforierter Zickzack gezeichnet, so wie ein Beleg aussieht, wenn er von einer Rolle abgerissen wurde. Die SUMME-Zeile sitzt unten in einem eigenen umrandeten Kasten, sodass sie die eine Zahl ist, die unmöglich zu übersehen ist. Darunter befindet sich ein dekorativer Barcode — eine Reihe vertikaler Balken unterschiedlicher Höhe, deterministisch aus der Transaktions-ID als Ausgangswert erzeugt, sodass derselbe Beleg bei erneutem Abruf immer mit denselben Balken dargestellt wird. Es ist kein echter, scanbarer Barcode; er dient dem visuellen Effekt eines echten Kassenbelegs, mit der Belegnummer darunter gedruckt anstelle dessen, was ein Barcode normalerweise codieren würde.",
      },
      {
        heading: "Alles, was auf dem Beleg gedruckt ist",
        body: "Von oben nach unten: Ihr Firmenname (in Großbuchstaben), gefolgt von der USt-IdNr.-Zeile, falls hinterlegt, dann eine Belegnummer — die ersten 8 Zeichen der Transaktions-ID, ohne Bindestriche und in Großbuchstaben — zusammen mit Datum und Uhrzeit. Darunter steht links „Bedient von [Kassierername]\", falls der Verkauf unter einem namentlichen Kassiererlogin gebucht wurde, mit der Zahlungsart in Großbuchstaben rechts. Dann die aufgeschlüsselten Positionen: Name und Zeilensumme jedes Produkts in einer Zeile, mit Menge und Einzelpreis darunter gedruckt („2 x 4,50 £\"). Nach den Positionen folgen die Zwischensumme, eine Rabattzeile nur, wenn tatsächlich ein Rabatt auf den Verkauf angewendet wurde, und eine Steuerzeile nur, wenn der Verkauf tatsächlich Steuer trug — ein Verkauf ohne Steuer hat schlicht keine Steuerzeile. Die umrahmte SUMME schließt es ab, gefolgt vom Barcode, der Belegnummer erneut und einer Dankeszeile.",
      },
      {
        heading: "Die MwSt. ist dynamisch — sie hängt von Ihren Einstellungen ab",
        body: "Die Steuerzeile ist nicht fest auf „MwSt.\" oder „Steuer\" festgelegt — sie ändert sich pro Unternehmen, abhängig von einer Sache: ob Sie eine USt-IdNr. unter Einstellungen hinterlegt haben. Haben Sie eine eingetragen, zeigt der Beleg direkt unter Ihrem Firmennamen eine Zeile „USt-IdNr.\", und die Steuerzeile selbst ist mit „MwSt.\" beschriftet, mit angehängtem Satz, wenn alle Artikel eines Verkaufs denselben Steuersatz tragen (zum Beispiel „MwSt. (20%)\"). Sind Ihre Artikel mit gemischten Sätzen besteuert, fällt es auf die schlichte Bezeichnung „MwSt.\" zurück, statt einen Satz zu erraten. Haben Sie keine USt-IdNr. hinterlegt, erscheint nichts davon — der Beleg zeigt stattdessen eine allgemeine Zeile „Steuer\", ohne jede Registrierungszeile über dem Firmennamen. Es gibt dafür nirgendwo in AskBiz einen separaten Schalter; das USt-IdNr.-Feld selbst ist das einzige Registrierungskennzeichen, das das System hat, das Hinzufügen oder Entfernen in Einstellungen schaltet also die MwSt.-spezifische Formulierung auf dem Beleg ein oder aus.",
      },
      {
        heading: "Wie AskBiz entscheidet, ob das Bild gesendet oder auf Text zurückgegriffen wird",
        body: "Jeder Belegversand-Versuch beginnt mit dem Versuch der Bildvorlage. WhatsApp verlangt, dass geschäftliche Nachrichtenvorlagen von Meta vorab genehmigt werden, bevor sie genutzt werden können, und der Header der Bildvorlage ist kein fest hinterlegtes Bild — es ist ein Link zurück zu AskBiz, den Metas eigene Zustellserver genau in dem Moment abrufen, in dem die Nachricht tatsächlich gesendet wird, was genau der Grund ist, warum der Beleg immer die echte Transaktion widerspiegelt statt eines zwischengespeicherten Bilds von früher. Schlägt dieser Bildversand aus irgendeinem Grund fehl — meist, weil die Vorlage noch in Metas Prüfwarteschlange sitzt — versucht AskBiz automatisch erneut mit einer separaten, kürzeren genehmigten Textvorlage, die nur Summe, Firmenname, Datum und Zahlungsart trägt. Sie sehen diese Entscheidung nicht, und es gibt nichts zu konfigurieren: Was auch immer erfolgreich ist, ist das, was der Kunde erhält, und sobald die Bildvorlage vollständig genehmigt ist, gelingen Sendungen als Selbstverständlichkeit beim Bildversuch.",
      },
      {
        heading: "Warum der Beleg-Link keinen Login braucht",
        body: "Weil es Metas Server sind — nicht Ihr Browser oder Ihre Kasse —, die das Belegbild zum Zeitpunkt der Zustellung abrufen, kann diese Anfrage keine AskBiz-Anmeldesitzung mit sich führen; es gibt keinen Nutzer, den man authentifizieren könnte. Der Endpunkt, der das Bild erzeugt, ist daher absichtlich offen gelassen, und sein einziger Schutz ist, dass die Transaktions-ID im Link eine nicht erratbare UUID ist statt einer kleinen fortlaufenden Nummer — dasselbe Vertrauensmodell, das AskBiz für jeden anderen Link nutzt, der auf eine einzelne Transaktion begrenzt ist. In der Praxis bedeutet das, dass der Bild-Link nichts ist, das Sie beiläufig außerhalb von WhatsApp weiterleiten möchten, da jeder mit dem genauen Link diesen einen Beleg ansehen kann, aber das ist nichts, worum Sie sich kümmern müssen — es ist so konzipiert, dass der automatische Versand funktioniert.",
      },
    ],
    faq: [
      {
        q: "Muss ich das neue Belegdesign irgendwo in den Einstellungen aktivieren?",
        a: "Nein — der bildbasierte Beleg ist das, was AskBiz jetzt automatisch bei jedem WhatsApp-Beleg sendet. Es gibt keinen Schalter zu finden; schlägt der Bildvorlagenversand aus irgendeinem Grund fehl, greift von selbst eine Text-Zusammenfassung.",
      },
      {
        q: "Warum steht auf meinem Beleg „Steuer\" statt „MwSt.\"?",
        a: "Die MwSt.-Formulierung erscheint nur, wenn Ihr Unternehmen eine USt-IdNr. unter Einstellungen hinterlegt hat — dieses Feld ist das einzige MwSt.-Registrierungskennzeichen, das AskBiz hat. Fügen Sie dort Ihre USt-IdNr. hinzu, und sowohl die Zeile „USt-IdNr.\" als auch die Bezeichnung „MwSt.\" beginnen auf Belegen zu erscheinen.",
      },
      {
        q: "Warum steht bei der MwSt.-Zeile manchmal nur „MwSt.\" ohne Prozentsatz?",
        a: "AskBiz druckt einen Satz (wie „MwSt. (20%)\") nur, wenn alle Artikel eines bestimmten Verkaufs denselben Steuersatz teilen. Mischt der Verkauf Artikel mit unterschiedlichen Sätzen, zeigt es die schlichte Bezeichnung „MwSt.\" statt einen Satz zu wählen, der für den gesamten Beleg nicht zutreffend wäre.",
      },
      {
        q: "Ist der Barcode auf dem Beleg etwas, das ein Kunde tatsächlich scannen könnte?",
        a: "Nein — er ist dekorativ. Die Balken werden aus der Transaktions-ID erzeugt, sodass derselbe Beleg bei erneuter Ansicht immer gleich aussieht, aber sie codieren nichts, was ein Scanner lesen könnte. Die echte Referenz für eine Transaktion ist die darüber und darunter gedruckte Belegnummer.",
      },
      {
        q: "Kann jeder mit dem Belegbild-Link den Beleg einer anderen Person einsehen?",
        a: "Der Link ist nicht durch einen Login geschützt — das kann er nicht sein, da WhatsApps eigene Zustellserver ihn abrufen, kein angemeldeter Browser — aber er ist dadurch geschützt, dass die Transaktions-ID eine nicht erratbare UUID ist. Behandeln Sie den Link so, wie Sie jede Einmal-Referenznummer behandeln würden: in Ordnung, wenn er per WhatsApp an den Kunden gesendet wird, aber nichts, das Sie veröffentlichen oder anderswo weiterleiten sollten.",
      },
    ],
  },

  "whatsapp-daily-pl-brief-askbiz": {
    title: "Ihr täglicher Bericht kommt jetzt als WhatsApp-GuV-Bericht",
    description:
      "AskBiz' automatische Tagesnachricht landet jetzt als echter Verkaufs-, Gewinn- und Verlustbericht für die letzten 24 Stunden und die letzten 7 Tage in WhatsApp — so schalten Sie sie ein und das bedeuten die Zahlen.",
    keywords: [
      "WhatsApp Tagesbericht",
      "WhatsApp GuV-Bericht",
      "AskBiz Benachrichtigungen",
      "Gewinn und Verlust",
      "täglicher Verkaufsbericht",
      "POS Tagesbericht",
      "WhatsApp Benachrichtigungseinstellungen",
    ],
    keyTakeaways: [
      "Schalten Sie es unter Einstellungen > Benachrichtigungen ein, im Bereich Kanäle, indem Sie WhatsApp einschalten — ein Telefonnummernfeld erscheint erst, sobald der Schalter aktiviert ist.",
      "Es wird automatisch einmal täglich gesendet, und nur an POS-aktivierte Konten, die WhatsApp-Benachrichtigungen eingeschaltet und eine Nummer hinterlegt haben. Rein E-Mail-Konten erhalten es nicht.",
      "Jede Nachricht meldet Umsatz, Gewinn (Umsatz minus die tatsächlichen Positionskosten der verkauften Waren) und Verluste durch Rückerstattungen — sowohl für die letzten 24 Stunden als auch die letzten 7 Tage — plus einen Link zurück zu askbiz.co/home.",
      "Verluste zählen Rückerstattungen nach dem Zeitpunkt der Bearbeitung, nicht dem des ursprünglichen Verkaufs — die Rückerstattung eines alten Verkaufs heute erhöht den heutigen Verlustwert.",
      "Das ersetzt die frühere E-Mail-Version der automatischen Tagesnachricht für WhatsApp-Opt-in-Konten. Ihr In-App-Tagesbericht — mit Gesundheitswert, Anomalien und vorgeschlagener Handlung — ist eine separate Funktion und funktioniert weiterhin genau wie zuvor.",
    ],
    content: [
      {
        heading: "Was sich tatsächlich geändert hat",
        body: "AskBiz hat früher eine automatische Morgen-E-Mail versendet, aufgebaut um drei KI-generierte Zeilen — etwas, das sich verbessert hat, etwas, das Aufmerksamkeit braucht, und eine vorgeschlagene Handlung für den Tag. Diese E-Mail wurde für Konten mit WhatsApp-Opt-in abgeschafft. An ihre Stelle sendet ein täglicher Cron-Job jetzt einen klartextlichen GuV-Bericht direkt an WhatsApp: echter Umsatz, echter Gewinn und echte Verluste, direkt aus Ihren Transaktionsdaten gezogen, statt zu einer Erzählung zusammengefasst. Keine KI-Interpretation, kein Fachjargon — nur die Zahlen für die letzten 24 Stunden und die letzten 7 Tage, formatiert in der Währung Ihres Kontos. Die alte Version versuchte Ihnen zu sagen, was wichtig ist; diese Version gibt Ihnen einfach die Zahlen und überlässt Ihnen die Entscheidung.",
      },
      {
        heading: "Einschalten",
        body: "Gehen Sie zu Einstellungen > Benachrichtigungen in AskBiz und finden Sie den Bereich Kanäle. Hier gibt es zwei Schalter: E-Mail-Benachrichtigungen und WhatsApp. Schalten Sie WhatsApp ein, und ein Telefonnummernfeld erscheint sofort darunter — dieses Feld ist verborgen, bis Sie den Schalter aktivieren, wenn Sie also nirgendwo eine Nummer eingeben können, prüfen Sie zuerst, ob der Schalter selbst eingeschaltet ist. Geben Sie Ihre WhatsApp-Nummer im internationalen Format ein (zum Beispiel +254 700 000000) und speichern Sie. Das ist der gesamte Einrichtungsprozess — es gibt keinen separaten Opt-in-Schritt oder eine Bestätigungsnachricht zum Genehmigen, und keine Wartezeit, bevor die erste Nachricht rausgehen kann. Schalten Sie den Schalter später wieder aus, verschwindet das Nummernfeld erneut, aber Ihre gespeicherte Nummer erhält nichts mehr, bis Sie wieder umschalten.",
      },
      {
        heading: "Wer es tatsächlich erhält",
        body: "Der tägliche Versand ist enger gesteuert, als es aussehen mag. Er geht nur an Konten, bei denen POS aktiviert ist — nutzen Sie AskBiz ausschließlich für verbundene Quellen wie Shopify oder Bankfeeds, ohne POS eingeschaltet zu haben, wird diese spezielle Nachricht unabhängig von Ihren Benachrichtigungseinstellungen nicht an Sie gesendet. Zusätzlich brauchen Sie sowohl den WhatsApp-Schalter eingeschaltet als auch eine gespeicherte Nummer; nur eines von beiden zu haben bedeutet, dass Sie übersprungen werden, und der Cron geht einfach zum nächsten Konto weiter, ohne für Sie etwas zu erzeugen. Und es ist strikt einmal pro Unternehmen und Tag — wurde für Ihr Konto bereits ein Bericht für das heutige Datum erzeugt, erzeugt oder sendet der Cron keinen zweiten, selbst wenn Sie später am Tag erneut nachsehen. Eine manuelle „Jetzt senden\"-Option gibt es ebenfalls nicht — die Nachricht geht nur nach eigenem Zeitplan raus.",
      },
      {
        heading: "Wie Umsatz, Gewinn und Verluste berechnet werden",
        body: "Umsatz ist die Summe Ihrer abgeschlossenen POS-Transaktionen im Zeitfenster — ausstehende Karten- oder Mobile-Money-Zahlungen, die noch nicht bestätigt sind, zählen erst, sobald sie bestätigt sind. Gewinn ist keine grobe Margenschätzung — es ist Umsatz minus die tatsächlichen Kosten der verkauften Waren, positionsweise aus Menge und Einkaufspreis jedes verkauften Produkts berechnet und dann über das Zeitfenster summiert. Verluste bilden den Wert rückerstatteter Positionen ab, nicht nur eine Zählung von Rückerstattungsereignissen, und sie stammen aus einem separaten Satz von Transaktionen — allem, was als rückerstattet oder teilweise rückerstattet markiert ist. Hier lässt sich die Logik leicht missverstehen: Verluste werden dem Tag zugeordnet, an dem die Rückerstattung bearbeitet wurde, nicht dem Tag, an dem der ursprüngliche Verkauf stattfand. Kauft ein Kunde vor drei Wochen etwas und Sie bearbeiten die Rückerstattung heute Morgen, landet der volle Wert dieser Rückerstattung im heutigen Verlustwert — sie passt nicht rückwirkend den Tag des ursprünglichen Verkaufs an. Über ein 7-Tage-Fenster sorgt das selten für Verwirrung, aber es lohnt sich zu wissen, falls Sie jemals einen 24-Stunden-Verlustwert sehen, der vom tatsächlichen Handel dieses Tages losgelöst wirkt.",
      },
      {
        heading: "Was Sie sehen, und wohin es verlinkt",
        body: "Die Nachricht selbst ist ein kurzer WhatsApp-Text: Ihr Firmenname oben, dann Umsatz, Gewinn und Verluste für die letzten 24 Stunden, gefolgt von denselben drei Zahlen für die letzten 7 Tage, und ein Link zu askbiz.co/home unten. Da es eine schlichte WhatsApp-Nachricht ist, sind die Zahlen selbst lesbar, sobald sie ankommt — keine App zum Öffnen, kein Login nur zum Ansehen nötig. Der Link ist eine Abkürzung zurück in AskBiz, falls Sie einer Zahl genauer nachgehen möchten; ihn zu öffnen fordert weiterhin eine Anmeldung, genau wie bei jedem anderen AskBiz-Link.",
      },
      {
        heading: "Was das nicht ersetzt",
        body: "Es lohnt sich, hier die Grenze klarzustellen. Der WhatsApp-Bericht ist eine separate Funktion, getrennt von Ihrem In-App-Tagesbericht — dem mit Business-Gesundheitswert, Anomalie-Markierungen und einer vorgeschlagenen Handlung, jederzeit verfügbar, wenn Sie AskBiz öffnen. Dieser Endpunkt und seine Daten wurden durch diese Änderung nicht angefasst und funktionieren weiterhin unabhängig davon, ob Sie WhatsApp-Benachrichtigungen eingeschaltet haben. Was sich geändert hat, ist der automatische Push: Die alte E-Mail-Erzählung, die früher jeden Morgen ungefragt eintraf, ist für WhatsApp-Opt-in-Konten weg, ersetzt durch diese wörtlichere GuV-Nachricht. Wenn Sie den Gesundheitswert und die Zusammenfassung im Aktionspunkt-Stil möchten, lebt das weiterhin in der App — es wird nur nicht mehr automatisch auf Ihr Telefon gepusht.",
      },
    ],
    faq: [
      {
        q: "Ich nutze AskBiz POS nicht — erhalte ich diese WhatsApp-Nachricht?",
        a: "Nein. Der tägliche Versand geht nur an Konten mit aktiviertem POS, weil die Umsatz-, Gewinn- und Verlustzahlen aus POS-Transaktions- und Rückerstattungsdaten berechnet werden. Nutzen Sie AskBiz nur für verbundene Quellen wie Shopify oder einen Bankfeed, wird diese spezielle Nachricht nicht an Sie gesendet.",
      },
      {
        q: "Ich habe bereits E-Mail-Benachrichtigungen eingeschaltet — muss ich noch etwas tun?",
        a: "Ja. E-Mail-Benachrichtigungen und WhatsApp sind separate Schalter unter Einstellungen > Benachrichtigungen, und nur der WhatsApp-Schalter (plus eine gespeicherte Nummer) löst diese tägliche Nachricht aus. E-Mail-Benachrichtigungen allein reichen dafür nicht.",
      },
      {
        q: "Warum stammt ein Verlust in der heutigen Nachricht aus einem Verkauf, den ich vor Wochen gemacht habe?",
        a: "Verluste werden nach dem Datum gezählt, an dem die Rückerstattung bearbeitet wurde, nicht nach dem Datum des ursprünglichen Verkaufs. Erstatten Sie heute eine alte Transaktion, zählt ihr Wert zum heutigen Verlustwert, sowohl in der 24-Stunden- als auch in der 7-Tage-Summe.",
      },
      {
        q: "Kann ich mehr als eine dieser Nachrichten erhalten, wenn ich später am Tag erneut in die App schaue?",
        a: "Nein. Der Bericht wird einmal pro Unternehmen und Kalendertag erzeugt — wurde für heute bereits einer erstellt, überspringt der Cron Ihr Konto, statt eine Doppelung zu erzeugen oder zu senden.",
      },
      {
        q: "Ersetzt das den Tagesbericht, den ich in der App sehe, mit Gesundheitswert und vorgeschlagener Handlung?",
        a: "Nein, das ist eine separate Funktion und unangetastet. Der In-App-Tagesbericht berechnet weiterhin unabhängig seinen eigenen Gesundheitswert, Anomalien und Aktionspunkt, und Sie können ihn jederzeit in AskBiz öffnen, unabhängig von Ihren WhatsApp-Einstellungen.",
      },
    ],
  },

  "forgot-pin-reset-whatsapp-askbiz": {
    title: "AskBiz-PIN vergessen? Setzen Sie sie selbst per WhatsApp zurück",
    description:
      "So stellen Sie Ihre eigene AskBiz-Anmelde-PIN wieder her, ohne den Support zu kontaktieren — bestätigen Sie Ihre Telefonnummer per WhatsApp und legen Sie in weniger als einer Minute eine neue 4-stellige PIN fest.",
    keywords: [
      "PIN vergessen",
      "PIN zurücksetzen",
      "AskBiz",
      "WhatsApp-Verifizierung",
      "Anmelden",
      "Telefon-Login",
      "Kontowiederherstellung",
      "Tutorial",
    ],
    keyTakeaways: [
      "„PIN vergessen?\" auf der Anmeldeseite startet eine selbstbediente Zurücksetzung — Telefonnummer eingeben, einen 6-stelligen Code per WhatsApp bestätigen, dann eine neue 4-stellige PIN festlegen.",
      "Der Code läuft nach 10 Minuten ab, erlaubt 5 Versuche, und es gibt eine 60-Sekunden-Sperrfrist, bevor Sie einen weiteren anfordern können.",
      "Das setzt Ihre eigene Inhaber-Anmelde-PIN für die Haupt-AskBiz-App zurück — es hat nichts mit den POS-Mitarbeiter-Kassen-PINs zu tun, die ein Manager weiterhin unter POS > Personal > Bearbeiten > PIN zurücksetzen zurücksetzt.",
      "Vor dieser Einführung hatte ein ausgesperrter Inhaber keine Selbstbedienungsoption — der einzige Weg war, den Support zu kontaktieren und darauf zu warten, dass ein Administrator manuell eine temporäre PIN erzeugt und weiterleitet.",
    ],
    content: [
      {
        heading: "Zwei verschiedene PINs, und hier geht es um eine davon",
        body: "AskBiz hat tatsächlich zwei PINs, die man leicht verwechselt. Ihre Anmelde-PIN ist das, was Sie nutzen, um sich mit Ihrer eigenen Telefonnummer in die Haupt-AskBiz-App einzuloggen — sie ist der Weg, wie Sie (der Kontoinhaber) in Ihr Dashboard, Ihre Berichte und Einstellungen gelangen. Eine POS-Mitarbeiter-Kassen-PIN ist etwas völlig Separates: ein kurzer Code, den ein Manager jedem Kassierer zuweist, damit er sich an der Kasse einloggen kann, ohne den Login des Inhabers zu teilen. Dieser Artikel handelt von der ersten — Ihrer eigenen Anmelde-PIN. Hat ein Kassierer seine Kassen-PIN vergessen, wird das dadurch behoben, dass ein Manager oder Inhaber zu POS > Personal geht, neben dessen Namen auf Bearbeiten klickt und PIN zurücksetzen wählt — an diesem Prozess hat sich nichts geändert. Neu ist ein Weg, mit dem Sie Ihre eigene Anmelde-PIN ohne fremde Hilfe wiederherstellen können.",
      },
      {
        heading: "Wo Sie es finden",
        body: "Suchen Sie auf der AskBiz-Anmeldeseite direkt unter dem PIN-Feld nach einem Link „PIN vergessen?\". Ein Klick darauf führt Sie zu einer eigenen Wiederherstellungsseite unter askbiz.co/forgot-pin, getrennt von der Haupt-Anmeldekarte, als schmaler, einzweckiger Bildschirm gestaltet, sodass klar ist, dass Sie sich in einem Wiederherstellungsablauf befinden statt sich normal anzumelden.",
      },
      {
        heading: "Schritt 1: Ihre Telefonnummer bestätigen",
        body: "Geben Sie die bei Ihrem AskBiz-Konto hinterlegte Telefonnummer ein, einschließlich der korrekten Landesvorwahl — dieselbe Nummer, mit der Sie sich normalerweise anmelden. Tippen Sie auf „Code per WhatsApp senden\". Egal welche Nummer Sie eingeben, Sie sehen als Nächstes dieselbe Bestätigungsmeldung: AskBiz gibt auf diesem Bildschirm nie preis, ob diese Nummer tatsächlich zu einem Konto gehört. Das ist Absicht — es verhindert, dass der Wiederherstellungsablauf genutzt werden kann, um zu prüfen, welche Telefonnummern bei AskBiz registriert sind. Gehört die Nummer tatsächlich zu einem Konto, trifft ein 6-stelliger Code binnen Augenblicken auf WhatsApp ein.",
      },
      {
        heading: "Schritt 2: Code eingeben und neue PIN wählen",
        body: "Geben Sie auf dem nächsten Bildschirm den 6-stelligen Code aus WhatsApp zusammen mit einer neuen 4-stelligen PIN ein, zweimal eingetippt zur Bestätigung, dass sie übereinstimmt. Absenden — vorausgesetzt der Code ist korrekt und noch gültig — aktualisiert Ihre Anmelde-PIN sofort. Sie gelangen zu einem Bestätigungsbildschirm mit einem Link direkt zurück zur Anmeldung, wo Ihre neue PIN sofort funktioniert.",
      },
      {
        heading: "Die Limits, und warum es sie gibt",
        body: "Ein paar Limits schützen diesen Ablauf vor Missbrauch. Der Code läuft 10 Minuten nach dem Versand ab, sodass ein alter, ungenutzter Code, der noch in einem WhatsApp-Thread liegt, später nicht mehr verwendet werden kann. Sie haben 5 Versuche, ihn korrekt einzugeben, bevor er ungültig wird und Sie einen neuen anfordern müssen. Und tippen Sie auf „Code erneut senden\", gibt es eine 60-Sekunden-Sperrfrist, bevor tatsächlich ein weiterer rausgeht, was verhindert, dass dieselbe Nummer mit Codes überflutet wird. Nichts davon sollte Ihnen bei einer normalen Zurücksetzung im Weg stehen — geben Sie den Code einmal korrekt innerhalb weniger Minuten nach Erhalt ein, und Sie sind fertig. Die Limits greifen nur, wenn etwas schiefgelaufen ist, was genau der Moment ist, in dem Sie sie brauchen.",
      },
      {
        heading: "Wie AskBiz Ihre Telefonnummer Ihrem Konto zuordnet",
        body: "Im Hintergrund sucht AskBiz Ihre Telefonnummer in einer eigens dafür angelegten Tabelle, statt sich auf die in Ihren allgemeinen Profileinstellungen gespeicherte Telefonnummer zu verlassen. Dieser Unterschied ist wichtig: Das Telefonfeld Ihres Profils ist nur ein bearbeitbarer Einstellungswert — Sie könnten ihn jederzeit ändern, und nichts hindert zwei Personen daran, versehentlich eine ähnlich aussehende Nummer einzugeben. Der Wiederherstellungsablauf braucht eine eindeutige, verlässliche Verknüpfung zwischen einer Telefonnummer und genau einem Konto, bevor er jemanden eine PIN ändern lässt, er nutzt daher stattdessen einen separaten Identitätsdatensatz, der bei Ihrer ersten Anmeldung angelegt und seitdem synchron gehalten wird.",
      },
      {
        heading: "Wie eine Wiederherstellung aussah, bevor es das gab",
        body: "Bis Ende Juli 2026 gab es keine Selbstbedienungsoption. Wenn Sie Ihre AskBiz-Anmelde-PIN vergessen hatten, war der einzige Weg, den Support direkt zu kontaktieren — per E-Mail oder WhatsApp —, zu erklären, wer Sie sind, und zu warten, bis ein Administrator auf AskBiz-Seite manuell eine temporäre PIN erzeugt und außerhalb des Systems an Sie weitergegeben hat. Das hat funktioniert, bedeutete aber, dass jede einzelne Aussperrung einen Menschen auf der anderen Seite brauchte, und Sie waren darauf angewiesen, wie lange es dauerte, bis sich jemand darum kümmerte. Der WhatsApp-verifizierte Ablauf erledigt denselben Job in unter einer Minute, jederzeit, ohne dass jemand anderes einbezogen werden muss.",
      },
    ],
    faq: [
      {
        q: "Ist das dasselbe wie die Kassen-PIN eines Kassierers zurückzusetzen?",
        a: "Nein. Das setzt Ihre eigene Inhaber-Anmelde-PIN für die Haupt-AskBiz-App zurück. Die POS-Kassen-PIN eines Kassierers ist ein komplett separates System und wird weiterhin genauso zurückgesetzt wie immer — ein Manager oder Inhaber geht zu POS > Personal, klickt neben diesem Mitarbeiter auf Bearbeiten und wählt PIN zurücksetzen.",
      },
      {
        q: "Ich habe meine Telefonnummer eingegeben, aber nie einen WhatsApp-Code erhalten. Was ist falsch?",
        a: "Sie sehen dieselbe „In WhatsApp nachsehen\"-Bestätigung unabhängig davon, ob diese Nummer tatsächlich registriert ist — das ist Absicht, damit die Seite nicht genutzt werden kann, um zu prüfen, welche Nummern Konten haben. Kommt nichts an, prüfen Sie noch einmal, ob Sie genau die bei Ihrem Konto hinterlegte Nummer eingegeben haben, einschließlich Landesvorwahl, und versuchen Sie es nach der 60-Sekunden-Sperrfrist erneut.",
      },
      {
        q: "Wie lange habe ich Zeit, den Code einzugeben, bevor er abläuft?",
        a: "10 Minuten ab dem Versand. Danach ist er nicht mehr gültig, und Sie müssen vom vorherigen Bildschirm aus einen neuen anfordern.",
      },
      {
        q: "Was passiert, wenn ich weiterhin den falschen Code eingebe?",
        a: "Sie haben 5 Versuche. Danach wird der Code aus Sicherheitsgründen ungültig, und Sie müssen einen neuen anfordern, statt weiter zu raten.",
      },
      {
        q: "Kann ich sofort einen weiteren Code anfordern, wenn ich den ersten nicht erhalten habe?",
        a: "Es gibt eine 60-Sekunden-Sperrfrist zwischen Codeanfragen für dieselbe Nummer. Nach diesem Zeitfenster tippen Sie auf dem Verifizierungsbildschirm auf „Code erneut senden\", um einen neuen zu erhalten.",
      },
    ],
  },

  "zakat-calculator-charity-askbiz": {
    title: "Der AskBiz-Zakat-Rechner: Wie er funktioniert und wo Sie ihn finden",
    description:
      "Wie der Zakat-Tab in Mein Unternehmen Ihre geschäftliche Zakat-Position aus Live-Bestand, Bargeld, Forderungen und Verbindlichkeiten berechnet, Nisab und Hawl automatisch nachverfolgt und Sie mit einem Verzeichnis von Partner-Wohltätigkeitsorganisationen verbindet — kostenlos in jedem Plan.",
    keywords: [
      "Zakat-Rechner",
      "Zakat-Rechner für Unternehmen",
      "Nisab-Rechner",
      "Hawl-Tracker",
      "Zakat-Tool für Unternehmen",
      "islamische Finanzen Unternehmen",
      "Zakat-Wohltätigkeitsverzeichnis",
      "AskBiz",
      "Mein Unternehmen",
    ],
    keyTakeaways: [
      "Der Zakat-Rechner befindet sich in Mein Unternehmen (/intelligence) unter seinem eigenen Zakat-Tab — Direktlink /intelligence?tab=zakat — und ist auf jedem Plan kostenlos, einschließlich Free, ohne Upgrade nötig.",
      "Er berechnet Zakat nur auf Handelsvermögen: Bargeld + Bestand (Einzelhandelswert) + Forderungen − Verbindlichkeiten, nach unten auf null begrenzt. Jede Zahl kann für eine einzelne Berechnung überschrieben werden, ohne Ihren echten Bestand oder Ihre CFO-Datensätze anzufassen.",
      "Nisab ist die übliche gewichtsbasierte Schwelle (87,48 g Gold oder 612,36 g Silber, standardmäßig Silber verwendet), über eine manuelle „Aktuellen Preis prüfen\"-Abfrage in Ihre Währung umgerechnet — sie aktualisiert sich nicht von selbst.",
      "Hawl (das 355-tägige Mondjahr) wird automatisch nachverfolgt: Die Fortschrittsanzeige beginnt an dem Tag, an dem Ihre Zakat-Basis erstmals Nisab überschreitet, und setzt sich zurück, falls sie vor Ablauf des Jahres wieder darunterfällt.",
      "Es ist eine Berechnungshilfe, keine Fatwa — es deckt keine madhhab-spezifischen Urteile, keine landwirtschaftliche oder Viehzucht-Zakat, kein persönlich gehaltenes Gold/Silber und kein persönliches Vermögen außerhalb des Unternehmens ab.",
    ],
    content: [
      {
        heading: "Wo Sie es finden",
        body: "Öffnen Sie Mein Unternehmen über die Hauptnavigation — das ist die Seite unter /intelligence — und wählen Sie den Tab Zakat. Er sitzt neben Übersicht, CFO, Team, Logistik, Markt und Aktionen, ist also ein vollwertiger Tab, keine versteckte Einstellung. Möchten Sie direkt dorthin springen, lautet der Direktlink /intelligence?tab=zakat.\n\nEine Sache lohnt sich zu wissen, bevor Sie auf anderem Weg danach suchen: AskBiz' KI-Chat kann Sie noch nicht direkt in diesen Tab verlinken, so wie er es für manche andere Teile der App kann. Ihn zu bitten, „bring mich zu Zakat\", wird Sie nicht auf dem Tab absetzen — öffnen Sie stattdessen Mein Unternehmen und klicken Sie direkt auf Zakat.",
      },
      {
        heading: "Es ist auf jedem Plan kostenlos",
        body: "Der Zakat-Rechner ist nicht hinter Growth, Business oder einer anderen Stufe verschlossen — er ist im Free-Plan ohne Upgrade verfügbar. Das ist Absicht: Zakat ist eine religiöse Pflicht, gebunden an Ihre tatsächliche Handelsposition, keine Premium-Analysefunktion, AskBiz stellt also keine Bezahlschranke davor.",
      },
      {
        heading: "Was er tatsächlich berechnet: die Zakat-Basis",
        body: "Jedes Mal, wenn Sie den Rechner öffnen, zieht AskBiz vier Live-Zahlen aus Ihren Geschäftsdaten und kombiniert sie zu dem, was es Ihre Zakat-Basis nennt:\n\n- Bargeld — der Bargeldbestand, den Sie in Ihren CFO-Kosteneinstellungen eingegeben haben. Haben Sie nie einen eingegeben, zeigt die Kachel „Nicht festgelegt\" statt ihn stillschweigend als null zu behandeln, sodass Sie Ihre Position nicht versehentlich unterschätzen.\n- Bestand — der Einzelhandelswert Ihres aktiven Lagers, berechnet als Verkaufspreis × vorrätige Menge für alles, was Sie derzeit führen.\n- Forderungen — Geld, das Ihnen geschuldet wird, aus Ihren erfassten Forderungen gezogen.\n- Verbindlichkeiten — Geld, das Sie schulden, von der Summe abgezogen. Dazu zählen alle Bestellungen, gegen die Sie bereits Wareneingänge gebucht, Ihren Lieferanten aber noch nicht vollständig bezahlt haben.\n\nDie Zakat-Basis ist Bargeld + Bestand + Forderungen − Verbindlichkeiten, nach unten auf null begrenzt, damit sie nie negativ wird. Das deckt nur Handelsvermögen ab — es ist keine Momentaufnahme Ihrer gesamten Bilanz, und es schließt bewusst Anlagevermögen wie Ausrüstung oder Räumlichkeiten aus, die nicht in gleicher Weise zakatpflichtig sind.\n\nJede dieser vier Zahlen ist antippbar. Wirkt eine Zahl falsch — Ihr Bargeldbestand ist veraltet, oder Sie wissen, dass gerade eine Forderung ausgebucht wurde — tippen Sie darauf und geben Sie einen korrigierten Wert für diese Berechnung ein. Die Überschreibung wirkt sich nur auf das vor Ihnen liegende Ergebnis aus: Sie wird nicht in Ihren Bestand oder Ihre CFO-Datensätze zurückgeschrieben und beim nächsten Öffnen des Tabs nicht erinnert, sofern Sie sie nicht erneut eingeben.",
      },
      {
        heading: "Nisab: die Schwelle, die entscheidet, ob Sie überhaupt etwas schulden",
        body: "Zakat wird erst fällig, sobald Ihre Zakat-Basis bei oder über Nisab liegt, der Mindestvermögensschwelle. AskBiz verwendet die übliche gewichtsbasierte Definition: 87,48 g Gold oder 612,36 g Silber. Silber wird standardmäßig verwendet, weil es die niedrigere der beiden Schwellen ist — Sie können jederzeit zu Gold wechseln, falls Sie danach rechnen möchten.\n\nDer Rechner aktualisiert Metallpreise nicht von selbst. Sie lösen eine Abfrage manuell mit der Schaltfläche „Aktuellen Preis prüfen\" aus, die eine Live-Preissuche durchführt und die Gewichtsschwelle in Ihre lokale Währung umrechnet. AskBiz speichert dieses Ergebnis zwischen, zusammen mit dem Datum der Prüfung, sucht den Preis also nicht bei jedem Öffnen des Tabs neu — und jedes Metall merkt sich seinen zuletzt geprüften Preis und das Datum separat, sodass ein Wechsel zwischen Gold und Silber keinen der beiden Werte verwirft. Behandeln Sie die Zahl als indikative Marktschätzung statt als exakten Kassakurs; kommt es für Ihre Situation wirklich auf Genauigkeit an, bestätigen Sie sie unabhängig, bevor Sie sich darauf verlassen.",
      },
      {
        heading: "Hawl: warum heute über Nisab zu liegen nicht dasselbe ist wie heute Zakat zu schulden",
        body: "Nisab zu überschreiten bedeutet nicht, dass Zakat sofort fällig ist — Ihre Zakat-Basis muss ein volles Mondjahr lang, den Hawl, bei oder über Nisab bleiben, bevor tatsächlich etwas geschuldet wird. AskBiz verfolgt den 355-tägigen Hawl automatisch, ohne manuelle Eingabe:\n\n- An dem Tag, an dem Ihre Zakat-Basis erstmals Nisab überschreitet, startet AskBiz die Hawl-Uhr und zeigt eine Fortschrittsanzeige.\n- Fällt Ihre Zakat-Basis vor Ablauf des Jahres wieder unter Nisab, setzt sich die Uhr zurück. Sie beginnt erneut, sobald Sie die Schwelle wieder überschreiten.\n- Ist ein voller Hawl abgeschlossen, während Sie noch über Nisab liegen, wechselt der Status zu Jetzt fällig, mit 2,5 % Ihrer Zakat-Basis als geschuldetem Betrag.\n\nBis der Hawl abgeschlossen ist, ist der angezeigte Wert eine laufende Schätzung auf Basis Ihrer aktuellen Zahlen, kein fälliger Betrag — er bewegt sich weiter, während sich Ihr Bargeld, Bestand und Ihre Forderungen von Tag zu Tag ändern. Das Status-Abzeichen sagt Ihnen genau, wo Sie stehen: Preis prüfen, um zu beginnen (Nisab wurde noch nicht abgefragt), Unter Nisab, Über Nisab (Hawl läuft), oder Jetzt fällig.",
      },
      {
        heading: "Spenden an Wohltätigkeitsorganisationen — und warum Sie nicht auf AskBiz' Liste beschränkt sind",
        body: "Unter dem Rechner listet AskBiz Partner-Wohltätigkeitsorganisationen auf, an die Sie direkt spenden können, gefiltert nach Ihrem Land, sofern AskBiz eine Übereinstimmung hat. Jeder Eintrag verlinkt zur eigenen Spendenseite der Organisation — AskBiz wickelt die Zahlung nicht selbst ab, es verweist Sie nur dorthin.\n\nDas Verzeichnis ist eine Annehmlichkeit, keine Pflicht. Es steht Ihnen völlig frei, Ihre Zakat an eine Wohltätigkeitsorganisation oder einen Empfänger Ihrer Wahl zu zahlen, innerhalb oder außerhalb der Liste. Ist für Ihr Land noch nichts eingetragen, ist das eine Lücke in einem noch wachsenden Verzeichnis, kein Zeichen, dass Sie nirgendwohin spenden können — nutzen Sie, welcher Organisation Sie bereits vertrauen.",
      },
      {
        heading: "Was dieses Tool nicht macht",
        body: "Der Zakat-Rechner ist als Berechnungshilfe gebaut, gegründet auf der üblichen Nisab-, Hawl- und 2,5%-Methodik für Zakat auf Geschäfts- oder Handelsvermögen — er ist keine Fatwa und will keine sein. Er berücksichtigt keine madhhab-spezifischen Unterschiede in der Zakat-Berechnung, deckt keine landwirtschaftliche oder Viehzucht-Zakat ab, schließt kein persönlich gehaltenes Gold oder Silber ein und berührt kein persönliches Vermögen außerhalb des Unternehmens. Braucht Ihre Situation ein Urteil statt einer Zahl, ist das ein Gespräch für Ihren eigenen Gelehrten oder Imam — AskBiz gibt Ihnen die Zahlen, die Sie in dieses Gespräch mitbringen, keinen Ersatz dafür.",
      },
    ],
    faq: [
      {
        q: "Ist der Zakat-Rechner wirklich kostenlos, oder braucht er einen bezahlten Plan?",
        a: "Er ist auf jedem Plan wirklich kostenlos, einschließlich Free — es ist kein Upgrade zur Nutzung erforderlich.",
      },
      {
        q: "Warum zeigt meine Bargeldzahl „Nicht festgelegt\" statt null?",
        a: "AskBiz kennt Ihren Bargeldbestand nur, wenn Sie einen in Ihren CFO-Kosteneinstellungen eingegeben haben. Haben Sie das nicht, zeigt die Kachel „Nicht festgelegt\" statt null anzunehmen, da die Annahme von null Ihre Zakat-Basis unterschätzen könnte. Tippen Sie auf die Kachel, um stattdessen direkt einen Bargeldwert für die Berechnung einzugeben.",
      },
      {
        q: "Wenn ich eine Zahl im Rechner korrigiere, aktualisiert das meinen echten Bestand oder meine CFO-Zahlen?",
        a: "Nein. Überschreibungen wirken sich nur auf die Berechnung aus, die Sie gerade betrachten — sie werden nie in Ihren Bestand, Ihre CFO- oder Buchhaltungsdaten zurückgeschrieben und beim nächsten Öffnen des Tabs nicht erinnert.",
      },
      {
        q: "Bedeutet über Nisab zu liegen, dass ich jetzt sofort Zakat schulde?",
        a: "Nicht unbedingt. Sie müssen ein volles Mondjahr (355 Tage, der Hawl) bei oder über Nisab bleiben, bevor Zakat tatsächlich fällig ist. AskBiz verfolgt das mit einer Fortschrittsanzeige und setzt sie zurück, falls Ihre Zakat-Basis vor Ablauf des Jahres wieder unter Nisab fällt.",
      },
      {
        q: "Kann ich meine Zakat an eine Wohltätigkeitsorganisation geben, die nicht in AskBiz' Verzeichnis steht?",
        a: "Ja. Die Partnerliste ist eine Annehmlichkeit für direktes Spenden aus AskBiz heraus — es steht Ihnen frei, Ihre Zakat an jede berechtigte Wohltätigkeitsorganisation oder jeden Empfänger Ihrer Wahl zu zahlen.",
      },
    ],
  },

  "factory-sector-guide-askbiz": {
    title: "Eine Fabrik in AskBiz betreiben: Chargen, Qualität, Ausfallzeiten, Schichten & Frachtbriefe",
    description: "Eine vollständige Tour durch AskBiz' Fabrik-Sektormodus — die neun eigenen Seiten, die vier Kamera-Erfassungsstufen, die fünf Fabrik-Mitarbeiterrollen und die 12 Fabriktyp-Vorlagen, die Ihren Prozess vorausfüllen.",
    keywords: [
      "Fabrikmodus",
      "AskBiz",
      "Fertigung",
      "Chargenverfolgung",
      "Qualitätskontrolle",
      "Ausfallzeit",
      "Schicht",
      "Frachtbrief",
      "Fabriktyp",
      "Produktion",
    ],
    keyTakeaways: [
      "Fabrik ist einer von sechs POS-Sektormodi (neben Einzelhandel, Restaurant, Reparatur, Salon und Logistik), mit neun eigenen Seiten: Erfassung, Charge, Qualität, Ausfallzeit, Schicht, Frachtbrief, Produktion, Personal und Freigaben.",
      "Die Kamera-Erfassung ist in vier Stufen unterteilt — Wareneingang, Ausstoß, Ausschuss, Versand — jede hinter ihrer eigenen Berechtigung gesteuert, sodass einer Rolle nur die Stufen gegeben werden können, die sie tatsächlich fotografieren soll.",
      "Wird während des Onboardings (oder später in den Admin-Einstellungen) der Unternehmenstyp „Hersteller\" gewählt, erscheint eine Fabriktyp-Auswahl mit 12 Vorlagen, die Ölpressung, Wasser, Mahlbetriebe, Milchwirtschaft, Bäckerei, Seife, Geflügel, Kaffee, Fischräucherung und mehr abdecken.",
      "Jede Vorlage füllt Stufenhinweise und eine vorgeschlagene Rezeptausbeutespanne für Ihren Prozess vor — die Stufen sind gemeinsam, aber die Ausbeuten variieren stark je nach Produkt, von rund 18 % bis 76 % allein bei den vier Ölsaatenarten.",
      "Es gibt fünf fabrikspezifische Mitarbeiterrollen — Linienbediener, Qualitätsprüfer, Schichtaufsicht, Produktionsleiter und Bestandsleiter — jede einem eigenen Berechtigungsbereich zugeordnet statt einer generischen Kassiererrolle.",
    ],
    content: [
      {
        heading: "Fabrik ist ein vollwertiger Sektormodus, kein Einzelhandels-Zusatz",
        body: "AskBiz POS hat sechs Sektormodi: Einzelhandel, Restaurant, Reparatur, Salon, Fabrik und Logistik. Einzelhandel ist die Standardeinstellung für die meisten Unternehmen, aber wenn Sie einen Produktionsbetrieb führen — Öl pressen, Getreide mahlen, backen, Wasser abfüllen, Seife herstellen — ersetzt der Fabrikmodus das einzelhandelsartige Menü Bestand/Verkauf/Kunden durch einen Satz von Seiten, die um Chargen statt einzelner Verkaufstransaktionen aufgebaut sind. Sie gelangen über POS > Betrieb in den Fabrikmodus, wo er als einer der Sektor-Pillenknöpfe neben den anderen fünf erscheint. Im Hintergrund liefert Fabrik neun eigene Seiten: Erfassung, Charge, Qualität, Ausfallzeit, Schicht, Frachtbrief, Produktion, Personal und Freigaben. Jede deckt einen eigenen Teil des Betriebs einer Produktionshalle ab, und sie sind so konzipiert, dass sie zusammen genutzt werden statt isoliert — ein Chargendatensatz verweist auf die Erfassungen und Qualitätsprüfungen, die während dieser Charge vorgenommen wurden, ein Schichtdatensatz zeigt, was während dieses Zeitfensters in der Halle passiert ist, und ein Frachtbrief verknüpft eine Versanderfassung mit den Papieren, die mit der Ware hinausgehen.",
      },
      {
        heading: "Erfassung: vier Stufen, vier separate Berechtigungen",
        body: "Erfassung ist der kamera-basierte Einstiegspunkt für alles, was auf der Halle passiert, und ist in vier unterschiedliche Erfassungsarten unterteilt: Wareneingang (Rohmaterial beim Eintreffen fotografieren), Ausstoß (fotografieren, was eine Charge tatsächlich produziert hat), Ausschuss (Mängel, Verderb oder Verlust fotografieren, mit erforderlicher Begründung vor dem Speichern) und Versand (die ausgehende Charge fotografieren, mit erforderlichem Ziel vor dem Speichern). Das sind nicht nur vier Schaltflächen auf einem Bildschirm — jede Stufe ist hinter einer eigenen Berechtigung gesteuert (camera.intake, camera.output, camera.wastage, camera.dispatch), Sie können also einem jungen Linienbediener nur Wareneingang und Ausstoß geben, Ausschuss und Versand seniorem Personal vorbehalten, oder einer sicherheits-/logistikorientierten Rolle nur Versand geben. Diese Granularität erlaubt es, den Kamerazugriff genau darauf abzustimmen, wer tatsächlich was fotografieren soll, statt einer Alles-oder-nichts-Kameraberechtigung.",
      },
      {
        heading: "Charge, Qualität, Ausfallzeit, Schicht und Frachtbrief",
        body: "Charge verfolgt einen Produktionslauf von Anfang bis Ende — die damit verbundenen Wareneingangs- und Ausstoß-Erfassungen, das Rezept und die erwartete Ausbeute, an der er gemessen wird, und ob das tatsächliche Ergebnis innerhalb, über oder unter dieser Spanne lag. Qualität erfasst Prüfvorgänge gegen eine Charge, Mängel werden also gegen den konkreten Lauf protokolliert, der sie erzeugt hat, statt als vage Notiz. Ausfallzeit protokolliert Stillstände — ein Maschinendefekt, ein Stromausfall, eine Nachschublücke — sodass Sie sehen, wo Produktionszeit über eine Woche oder einen Monat tatsächlich verloren geht, statt nur zu raten. Schicht ist ein eigener Produktionsschicht-Datensatz (bewusst getrennt von der bestehenden Kassenschicht-Tabelle, die anderswo in POS verwendet wird, da eine Fabrikhallen-Schicht und eine Kassierer-Sitzung unterschiedliche Dinge messen). Frachtbrief erzeugt die Versandpapiere für ausgehende Ware, verknüpft mit der Versand-Erfassung und den in dieser Stufe eingegebenen Zielnotizen. Produktion gibt Ihnen die Hallenübersicht über all das hinweg, und Freigaben ist der Ort, an dem eine Aufsicht oder ein Manager Erfassungen, Chargen oder Frachtbriefe absegnet, die vor der Finalisierung geprüft werden müssen.",
      },
      {
        heading: "Fünf Mitarbeiterrollen für eine Fabrikhalle, nicht eine Ladenkasse",
        body: "Der Fabrikmodus bringt fünf eigene Mitarbeiterrollen mit, jede einem eigenen zugrunde liegenden Berechtigungsbereich zugeordnet statt aus dem Einzelhandel wiederverwendet: factory-line-operator, factory-quality-inspector, factory-shift-supervisor, factory-production-manager und factory-inventory-manager. Ein Linienbediener ist auf die tägliche Erfassungs- und Chargenarbeit auf der Halle begrenzt; ein Qualitätsprüfer erhält die Prüf- und Mängelprotokollierungswerkzeuge; eine Schichtaufsicht überwacht eine Schicht und segnet ab, was während ihr passiert ist; ein Produktionsleiter und ein Bestandsleiter erhalten breitere Sichtbarkeit über Chargen, Rezepte und Bestand hinweg. Die richtige Rolle zuzuweisen ist für mehr als nur Ordnung wichtig — sie bestimmt, welche Kamerastufen und welche Fabrik-Seiten ein Mitarbeiter tatsächlich öffnen kann, wenn er sich mit seiner PIN anmeldet.",
      },
      {
        heading: "Zwölf Fabriktyp-Vorlagen — eine Prozessform, sehr unterschiedliche Ausbeuten",
        body: "Wenn Sie den Unternehmenstyp beim Onboarding — oder später in den Admin-Einstellungen — auf „Hersteller\" setzen, zeigt AskBiz eine Fabriktyp-Auswahl mit 12 Vorlagen: Speiseölpressung (Sesam, Erdnuss, Sonnenblume oder Palme), abgefülltes Trinkwasser, Maismahlen, Maniokverarbeitung, Reismahlen, Milchwirtschaft, Bäckerei, Seife, Betonblöcke, Geflügel, Kaffee und Fischräucherung. Die Wahl einer Vorlage füllt Stufenhinweise für Ihren konkreten Prozess vor — zum Beispiel führt die Ölpressungs-Vorlage durch Wareneingang, Reinigung/Röstung, Pressung, Filterung/Abfüllung und Versand — plus ein vorgeschlagenes Rezept mit einer erwarteten Ausbeuteprozentzahl und einer realistischen Min/Max-Spanne, sodass Sie Ihre Ausbeuteverfolgung nicht aus einer leeren Tabelle beginnen müssen. Die Stufen sind innerhalb einer Vorlagenfamilie größtenteils gemeinsam, aber die Ausbeuten sind es nicht: Allein die Ölpressung reicht von etwa 18 % bis 76 %, je nachdem, welche der vier Saatenarten Sie verarbeiten und ob geröstet wurde, was genau der Grund ist, warum die Vorlage eine separate Rezeptzeile pro Saatenart statt einer gemischten Zahl führt. Sie können die vorgeschlagenen Werte einer Vorlage als Ausgangspunkt übernehmen und anpassen, sobald Ihre eigenen Chargen ein abweichendes reales Verhältnis zeigen.",
      },
      {
        heading: "Was sich kürzlich geändert hat, und warum das wichtig ist, falls Sie das schon vor einer Weile eingerichtet haben",
        body: "Haben Sie den Fabrikmodus vor Ende Juli 2026 konfiguriert, lohnt es sich zu wissen, dass bis dahin nur Erfassung und Freigaben in der Produktion tatsächlich funktionsfähig waren — Charge, Qualität, Ausfallzeit, Schicht und Frachtbrief hatten vollständig gebaute Frontend-Seiten, aber die API-Routen dahinter existierten noch nicht, sodass dort eingegebene Daten nicht gespeichert wurden. Ein Fix erschien zusammen mit den 12 Fabriktyp-Vorlagen und baute alle fünf fehlenden Backends und ihre Datenbanktabellen auf. Derselbe Fix korrigierte auch einen Berechtigungsfehler, bei dem factory-line-operator fälschlich zu null Kameraberechtigungen aufgelöst hatte statt zu dem vorgesehenen Wareneingangs-/Ausstoß-Zugriff — jede vor dem Fix zugewiesene Linienbediener-Rolle sollte also unter Personal doppelt geprüft werden, um zu bestätigen, dass sie jetzt tatsächlich die Kamera öffnen können. Hat Ihr Team Charge, Qualität, Ausfallzeit, Schicht oder Frachtbrief genutzt und nichts gespeichert gefunden, ist das die Erklärung — und es ist jetzt behoben, es lohnt sich also, zurückzugehen und alles neu einzugeben, was Sie in diesem Zeitraum zu protokollieren versucht haben.",
      },
    ],
    faq: [
      {
        q: "Wie schalte ich mein Unternehmen auf Fabrikmodus um?",
        a: "Klicken Sie unter POS > Betrieb auf die Fabrik-Pille neben den anderen fünf Sektormodi. Richten Sie ein neues Konto ein, zeigt die Wahl des Unternehmenstyps „Hersteller\" beim Onboarding auch direkt die Fabriktyp-Auswahl; Sie können den Fabriktyp später in den Admin-Einstellungen ändern.",
      },
      {
        q: "Was ist der Unterschied zwischen der Seite Charge und der Seite Erfassung?",
        a: "Erfassung ist der Ort, an dem Sie das tatsächliche Foto für einen bestimmten Moment aufnehmen — Wareneingang, Ausstoß, Ausschuss oder Versand. Charge ist der Datensatz, der diese Erfassungen für einen Produktionslauf zusammenführt, zusammen mit dem Rezept, an dem er gemessen wird, und ob die Ausbeute im Zielbereich lag.",
      },
      {
        q: "Warum kann einer meiner Mitarbeiter die Kamera im Fabrikmodus nicht nutzen?",
        a: "Der Kamerazugriff im Fabrikmodus ist in vier separate Berechtigungen unterteilt — Wareneingang, Ausstoß, Ausschuss, Versand — und jede Mitarbeiterrolle erhält nur die, die sie haben soll. Prüfen Sie die zugewiesene Rolle unter Fabrik > Personal; ist die Person auf factory-line-operator gesetzt und wurde vor dem Berechtigungsfix von Juli 2026 eingerichtet, prüfen Sie erneut, ob sie jetzt wie erwartet camera.intake und camera.output hat.",
      },
      {
        q: "Legen mich die 12 Fabriktyp-Vorlagen auf einen festen Prozess fest?",
        a: "Nein. Eine Vorlage füllt Stufenhinweise und ein Ausgangsrezept mit einer erwarteten Ausbeutespanne vor, aber jedes Feld ist bearbeitbar. Sobald Sie ein paar echte Chargen gefahren haben und Ihre tatsächliche Ausbeute kennen, aktualisieren Sie das Rezept entsprechend — die Vorlage ist ein Ausgangspunkt, keine Einschränkung.",
      },
      {
        q: "Meine Fabrik macht etwas, das nicht in den 12 Vorlagen enthalten ist — kann ich trotzdem den Fabrikmodus nutzen?",
        a: "Ja. Die 12 Vorlagen sind bequeme Voreinstellungen für gängige afrikanische Fertigungssektoren, keine Voraussetzung. Sie können die Seiten Erfassung, Charge, Qualität, Ausfallzeit, Schicht, Frachtbrief, Produktion, Personal und Freigaben des Fabrikmodus nutzen, ohne eine Vorlage zu wählen — Sie geben dann nur Ihre eigenen Stufennamen und Rezeptwerte von Grund auf ein statt von vorausgefüllten zu starten.",
      },
    ],
  },

  "pos-free-trial-explained-askbiz": {
    title: "So funktioniert die kostenlose AskBiz-POS-Testphase",
    description: "AskBiz POS bietet eine einmalige, 30-tägige kostenlose Testphase ohne Kartenangabe. So beanspruchen Sie sie genau, was sie umfasst und was passiert, wenn sie endet.",
    keywords: ["POS kostenlose Testphase", "AskBiz POS", "30-Tage-Testphase", "keine Karte erforderlich", "pos/activate", "Testphase Ablauf", "Abrechnung"],
    keyTakeaways: [
      "Die kostenlose Testphase gilt nur für POS, dauert 30 Tage und benötigt keine Karte — jedes Konto kann sie einmal beanspruchen.",
      "Sie wird an zwei Stellen angeboten: als Banner auf dem Onboarding-Abschlussbildschirm für POS-Persona-Anmeldungen, und erneut auf der Seite pos/activate, falls Sie sie noch nicht beansprucht haben.",
      "Wenn die 30 Tage ohne bezahltes Abonnement ablaufen, schaltet AskBiz POS automatisch ab — Ihre Daten bleiben erhalten, aber die Kasse funktioniert nicht mehr, bis Sie ein Abonnement abschließen.",
      "Die entsprechende Growth-Plan-(BI-)Testphase wurde eingestellt — POS ist derzeit die einzige kostenlose Testphase, die AskBiz anbietet.",
      "Ihr Testphasenstatus, einschließlich verbleibender Tage und genauem Enddatum, ist jederzeit auf der Abrechnungsseite sichtbar.",
    ],
    content: [
      {
        heading: "Was die Testphase tatsächlich bietet",
        body: "Die kostenlose AskBiz-POS-Testphase schaltet die volle Kasse für 30 Tage ab dem Moment frei, in dem Sie sie starten, ohne dass zu irgendeinem Zeitpunkt eine Zahlungskarte angefragt wird. Es ist ein einmaliges Angebot — jedes Konto kann es genau einmal beanspruchen, was AskBiz serverseitig nachverfolgt statt sich auf irgendetwas im Browser zu verlassen. Haben Sie es bereits zuvor beansprucht (selbst auf einem anderen Gerät oder nach dem Löschen Ihrer Cookies), weiß das System das und bietet es nicht erneut an. Das Starten der Testphase schaltet POS sofort ein und richtet bis zu fünf Mitarbeiterplätze ein, sodass Sie Ihr gesamtes Kassenteam einbinden können — Kassierer, Manager, wer auch immer ein Login braucht — ohne während der Testphase selbst an ein Platzlimit zu stoßen.",
      },
      {
        heading: "Wo sie Ihnen angeboten wird",
        body: "AskBiz zeigt die Testphase an zwei Stellen, beide darauf ausgelegt, Sie so schnell wie möglich zum Verkaufen zu bringen, ohne vorab nach Kartendaten zu fragen. Die erste ist der Onboarding-„Fertig\"-Bildschirm, aber nur, wenn Sie sich als POS-Persona angemeldet haben — Sie sehen ein kleines Banner über der Schaltfläche „Meine Kasse einrichten\", das die 30-tägige Testphase ankündigt. Dieses Banner ist nur eine Ankündigung, nicht die Beanspruchungsschaltfläche selbst; es sagt Ihnen, dass es das Angebot gibt, bevor Sie weitermachen. Die zweite, und diejenige, die die Testphase tatsächlich startet, ist die Seite pos/activate — der Bildschirm, auf dem Sie landen, wenn Sie POS einschalten möchten. Bevor sie Sie direkt zu einer bezahlten Kasse führt, prüft sie, ob Sie eine unbeanspruchte Testphase haben. Ist das der Fall, erscheint eine Option „Kostenlose Testphase starten\" über den Zahlungsschaltflächen; haben Sie sie bereits genutzt, erscheint diese Option einfach nicht, und Sie gehen direkt zu den Zahlungsoptionen. So oder so gibt es keine Sackgasse — landet ein Klick, nachdem Sie sie bereits woanders beansprucht haben (etwa auf der Abrechnungsseite), blendet AskBiz die Schaltfläche einfach ruhig aus und zeigt stattdessen den Zahlungsweg, statt eines Fehlers.",
      },
      {
        heading: "Sie auf pos/activate beanspruchen",
        body: "Wenn die Testphasenoption verfügbar ist, ist sie die oberste Schaltfläche auf dem pos/activate-Bildschirm — beschriftet zum Starten der kostenlosen Testphase, mit einem Hinweis darunter, dass keine Karte benötigt wird. Darunter folgt eine Trennlinie und dann Ihre normalen Zahlungsoptionen: M-Pesa für kenianische Konten, plus Kartenzahlung für alle anderen. Ein Tipp auf die Testphasenschaltfläche leitet Sie nirgendwohin um; er ruft AskBiz' Abrechnungssystem direkt auf, das den Testphasenstart und ein 30 Tage später liegendes Enddatum erfasst, POS einschaltet und Sie direkt zu einem Bestätigungsbildschirm bringt. Von dort aus ist es derselbe „Sie sind startklar\"-Ablauf wie bei einer bezahlten Aktivierung — Sie landen zurück an Ihrer Kasse, bereit zu verkaufen.",
      },
      {
        heading: "Was passiert, wenn die 30 Tage enden",
        body: "AskBiz prüft den Testphasenablauf jedes Mal, wenn Ihr Abrechnungsstatus geladen wird — praktisch bedeutet das: sobald Ihre 30 Tage verstrichen sind, bemerkt das System es beim nächsten Zugriff auf Ihren Abrechnungsstatus. Ist bis dahin kein bezahltes POS-Abonnement an Ihr Konto geknüpft, wird der POS-Zugriff automatisch abgeschaltet: Die Kasse ist nicht mehr nutzbar, und Mitarbeiter-Logins finden die Tür verschlossen. An Ihrer Verkaufshistorie, Ihrem Bestand oder Ihren Einstellungen wird nichts gelöscht — alles bleibt erhalten und wartet. Ein Abonnement zu einem beliebigen späteren Zeitpunkt schaltet POS mit allem genau so, wie Sie es verlassen haben, wieder ein. Der Schnitt ist bewusst sauber: kein Nachfassen mit Gnadenfrist, keine Teilsperrung, nur ein automatischer Wechsel von „ein\" zu „aus\", falls die Testphase ohne bezahlte Verlängerung ausläuft.",
      },
      {
        heading: "Ihren Testphasenstatus prüfen",
        body: "Sie müssen nicht raten, wie viel Zeit Ihnen bleibt. Die Abrechnungsseite zeigt ein Abzeichen neben dem POS-Bereich, sobald Ihre Testphase aktiv ist, mit der Anzahl der verbleibenden Tage und wie viele Plätze Sie gerade nutzen. Sobald Sie abonnieren — oder sobald die Testphase abläuft und Sie zur Reaktivierung bezahlen — wechselt dieses Abzeichen stattdessen zu einem schlichten Status „aktiv\". Wenn Sie zu den Inhabern gehören, die lieber vorausplanen als von einer mitten in der Schicht gesperrten Kasse überrascht zu werden, ist die Abrechnungsseite der Ort, an dem Sie nachsehen — idealerweise ein paar Tage, bevor die 30 Tage um sind.",
      },
      {
        heading: "Warum es kein Äquivalent für den Growth-(BI-)Plan gibt",
        body: "Falls Sie gehört haben, dass AskBiz früher eine kostenlose Testphase für seinen Growth-Business-Intelligence-Plan angeboten hat, stimmt das — aber sie ist nicht mehr verfügbar. AskBiz' Abrechnungssystem lehnt jede neue Anfrage für eine Growth-Testphase ausdrücklich mit einer klaren Meldung ab, dass sie eingestellt wurde; der Codepfad existiert nur, um Anfragen abzuweisen, nicht um sie zu gewähren. Die POS-Testphase ist derzeit die einzige angebotene kostenlose Testphase. Braucht Ihr Unternehmen sowohl POS als auch die BI-/Growth-Funktionen, bringt die POS-Testphase Ihre Kasse sofort kostenlos zum Laufen, während der Growth-Plan-Zugriff von Tag eins an eine unkomplizierte Bezahlentscheidung ist — keine Testphase, die Sie in diese Entscheidung einbeziehen müssten.",
      },
    ],
    faq: [
      {
        q: "Muss ich eine Karte eingeben, um die kostenlose POS-Testphase zu starten?",
        a: "Nein. Das Starten der Testphase erfordert überhaupt keine Zahlungsdaten — sie ist für die vollen 30 Tage wirklich kostenlos. Ein Zahlungsmittel benötigen Sie nur, wenn Sie sich entscheiden, während oder nach der Testphase zu abonnieren.",
      },
      {
        q: "Kann ich die Testphase zweimal beanspruchen — zum Beispiel für ein zweites Geschäftskonto?",
        a: "Die Testphase ist einmalig pro Konto, serverseitig nachverfolgt, nicht pro Gerät oder Browser. Ein zweites AskBiz-Konto (eine echte separate Anmeldung) wäre für eine eigene Testphase berechtigt, aber Sie können sie nicht auf demselben Konto erneut auslösen, indem Sie Cookies löschen oder es von einem anderen Bildschirm aus erneut versuchen.",
      },
      {
        q: "Was passiert genau mit meinen Verkaufsdaten, wenn die Testphase abläuft?",
        a: "Nichts wird gelöscht. AskBiz schaltet den POS-Zugriff ab — das heißt, die Kasse selbst wird unbrauchbar — aber jeder Verkauf, jedes Produkt und jede Einstellung, die Sie hatten, bleibt erhalten. Ein Abonnement zu einem beliebigen späteren Zeitpunkt stellt den vollen Zugriff mit Ihren Daten genau so wieder her, wie sie waren.",
      },
      {
        q: "Ich habe die Testphase über das Onboarding-Banner gestartet — muss ich noch etwas anderes tun?",
        a: "Das Onboarding-Banner ist nur eine Ankündigung, dass das Angebot existiert; es startet die Testphase nicht selbst. Sie beanspruchen sie auf der Seite pos/activate, die Sie über „Meine Kasse einrichten\" erreichen. Haben Sie sie dort bereits beansprucht, sehen Sie die Option nicht erneut.",
      },
      {
        q: "Gibt es auch eine kostenlose Testphase für den Growth-(BI-)Plan?",
        a: "Nein — die Growth-Plan-Testphase wurde eingestellt. Eine Anfrage jetzt liefert eine ausdrückliche „nicht mehr verfügbar\"-Antwort. POS ist derzeit der einzige AskBiz-Plan, der mit kostenloser Testphase angeboten wird.",
      },
    ],
  },
};
