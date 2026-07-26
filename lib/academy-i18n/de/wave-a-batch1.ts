// Academy article translations — Deutsch (de) — Wave A, batch 1.
//
// POS fundamentals cluster: what-is-a-pos-system, askbiz-pos-overview,
// pos-staff-management, pos-camera-scanning, pos-processing-a-sale,
// pos-cart-management, pos-cash-vs-card-payments, pos-whatsapp-receipts,
// pos-daily-revenue-tracking, pos-inventory-management, pos-low-stock-alerts,
// pos-refunds-guide, pos-transaction-amendments.
//
// Translated fields only (title, description, keywords, content,
// keyTakeaways, faq) — see lib/academy-i18n/README.md for the contract.
// slug/category/categorySlug/difficulty/readTime/relatedSlugs/videoUrl are
// intentionally absent; those stay canonical/English from lib/academy-content.ts.
//
// GLOSSARY (locked de business terminology for this content — reuse verbatim
// in every other de batch, this wave and future waves):
//   POS system / point of sale -> Kassensystem
//   profit -> Gewinn | margin -> Marge | revenue -> Umsatz
//   stock / inventory -> Bestand (inventory management -> Bestandsverwaltung)
//   cashier (role) -> Kassierer | manager (role) -> Manager | owner (role) -> Inhaber
//   receipt -> Beleg (receipt printer -> Bondrucker, established compound exception)
//   refund -> Rückerstattung | void -> Stornieren/Stornierung
//   VAT/tax -> Mehrwertsteuer (MwSt.) | dashboard -> Dashboard (kept, loanword)
//   staff -> Mitarbeiter/Personal | low-stock alert -> Bestandswarnung
//   purchase order / reorder -> Bestellung/Nachbestellung | reorder point -> Meldebestand
//   discount -> Rabatt | cart -> Warenkorb | transaction/sale -> Transaktion/Verkauf
//   audit trail -> Audit-Trail (kept, established compliance loanword)
//   till/cash register -> Kasse | checkout flow -> Kassiervorgang
//   barcode -> Barcode (kept) | stock take -> Inventur
//
// Merge this into lib/academy-i18n/de/index.ts's `translations` export
// (spread alongside any other de batches) — not done here per instructions.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch1Translations: LocaleTranslations = {
  'what-is-a-pos-system': {
    title: 'Was ist ein Kassensystem? Der komplette Leitfaden für Kleinunternehmer',
    description:
      'Ein Kassensystem ist das Herzstück jeder Verkaufstransaktion im Einzelhandel. Erfahren Sie, was Kassensoftware leistet, warum sie wichtig ist und wie Sie das richtige System für Ihr Geschäft auswählen.',
    keywords: [
      'Kassensystem',
      'Point of Sale',
      'Kassensystem für den Einzelhandel',
      'Kassensystem für Kleinunternehmen',
      'Kassensoftware',
      'elektronisches Kassensystem',
      'POS-System',
    ],
    keyTakeaways: [
      'Ein Kassensystem verbindet Hardware und Software, um Verkäufe abzuwickeln, den Bestand zu verfolgen und Belege zu erstellen.',
      'Moderne cloudbasierte Kassensysteme laufen auf Tablets und Smartphones — sperrige Registrierkassen sind nicht mehr nötig.',
      'Die Wahl des richtigen Kassensystems wirkt sich auf alles aus: von der Kassiergeschwindigkeit über die Bestandsgenauigkeit bis zur steuerlichen Compliance.',
    ],
    content: [
      {
        heading: 'Was bedeutet POS eigentlich?',
        body: 'POS steht für Point of Sale — den Moment und Ort, an dem ein Kunde für Waren oder Dienstleistungen bezahlt. Früher bedeutete das eine an der Theke verschraubte Registrierkasse. Heute ist ein Kassensystem Software (häufig cloudbasiert), die auf einem Tablet, Smartphone oder speziellen Terminal läuft und weit mehr leistet als nur die Zahlung entgegenzunehmen. Es erfasst jede Transaktion, aktualisiert Ihren Lagerbestand in Echtzeit, berechnet die Mehrwertsteuer, erstellt digitale oder gedruckte Belege und speist die Daten in Berichte ein, die Ihnen genau zeigen, wie Ihr Geschäft läuft. Wenn Sie schon einmal in einem Café mit Karte bezahlt und dabei beobachtet haben, wie sich das iPad der Bedienung sofort aktualisiert, haben Sie ein modernes Kassensystem in Aktion gesehen. Der Wandel von mechanischen Registrierkassen zu softwaregesteuerten Systemen war einer der größten Umbrüche im britischen Einzelhandel des letzten Jahrzehnts und ist heute selbst für den kleinsten Marktstand oder Pop-up-Shop zugänglich.',
      },
      {
        heading: 'Grundfunktionen, die jedes Kassensystem bieten sollte',
        body: 'Mindestens sollte ein Kassensystem es Ihnen ermöglichen, Produkte zu scannen oder zu suchen, sie in den Warenkorb zu legen, Rabatte oder Aktionen anzuwenden, mehrere Zahlungsmethoden zu akzeptieren (Bargeld, Karte, kontaktlos) und einen Beleg auszustellen. Darüber hinaus sollten Sie auf eine Bestandsverwaltung achten — das System sollte den Bestand automatisch reduzieren, wenn Sie einen Artikel verkaufen, und Sie benachrichtigen, wenn der Bestand niedrig ist. Ebenso wichtig ist die Mitarbeiterverwaltung: Sie möchten Rollen vergeben, nachvollziehen, wer welchen Verkauf abgewickelt hat, und den Zugriff auf sensible Funktionen wie Rückerstattungen und Stornierungen kontrollieren. Berichte runden das Wesentliche ab. Ein gutes Kassensystem liefert Ihnen tägliche Umsatzübersichten, Listen der meistverkauften Produkte und Steueraufschlüsselungen, ohne dass Sie irgendetwas in eine Tabelle exportieren müssen. Wenn Sie mehrwertsteuerpflichtig sind, sollte das System die Mehrwertsteuer bei jeder Transaktion berechnen und ausweisen, damit Ihre Steuererklärungen unkompliziert bleiben.',
      },
      {
        heading: 'Cloud-Kassensystem vs. klassisches EPOS',
        body: 'Klassische EPOS-Systeme (Electronic Point of Sale) laufen in der Regel auf dedizierter Hardware mit lokal gespeicherten Daten. Sie sind zuverlässig, aber teuer, schwer zu aktualisieren und an einen einzigen Standort gebunden. Cloud-Kassensysteme speichern Daten auf externen Servern und synchronisieren sie geräteübergreifend. Die Vorteile sind erheblich: Sie können Verkäufe von unterwegs auf Ihrem Smartphone einsehen, Updates erfolgen automatisch, und es gibt keinen einzelnen Ausfallpunkt, wenn ein Gerät kaputtgeht. Der Kompromiss ist, dass Cloud-Systeme eine Internetverbindung benötigen — die meisten guten Anbieter, darunter auch AskBiz POS, bieten jedoch einen Offline-Modus, sodass Sie bei kurzen Ausfällen weiterverkaufen und bei wiederhergestellter Verbindung synchronisieren können. Für die meisten britischen Kleinunternehmen ist ein cloudbasiertes Kassensystem auf einem vorhandenen Tablet oder Smartphone die kostengünstigste und flexibelste Lösung.',
      },
      {
        heading: 'So wählen Sie das richtige Kassensystem für Ihr Unternehmen',
        body: 'Beginnen Sie mit Ihren unverzichtbaren Anforderungen. Brauchen Sie Barcode-Scanning? Logins für mehrere Mitarbeiter? Eine Anbindung an Ihre Buchhaltungssoftware? Schreiben Sie das auf, bevor Sie sich irgendein Produkt ansehen. Betrachten Sie als Nächstes die Gesamtkosten — nicht nur das monatliche Abonnement, sondern auch Kartengebühren, Hardwarekosten und etwaige Gebühren pro Transaktion. Kostenlose Tarife gehen oft mit höheren Transaktionsgebühren einher, die sich bei hohem Umsatz schnell summieren. Testen Sie schließlich den Kassiervorgang selbst. Stoppen Sie die Zeit, die es braucht, einen Verkauf mit drei Artikeln vom Scannen bis zum Beleg abzuwickeln. Dauert es länger als sechzig Sekunden, werden Ihre Kunden das bemerken. AskBiz POS ist darauf ausgelegt, diesen Ablauf in unter sechzig Sekunden abzuschließen — allein mit der Smartphone-Kamera zum Scannen, ohne zusätzliche Hardware.',
      },
    ],
    faq: [
      {
        q: 'Brauche ich spezielle Hardware für ein Kassensystem?',
        a: 'Nicht unbedingt. Viele moderne Kassensysteme, darunter AskBiz POS, laufen auf handelsüblichen Smartphones und Tablets. Ein Bondrucker oder ein Kartenlesegerät können als Zubehör sinnvoll sein, sind für den Verkaufsstart aber nicht erforderlich.',
      },
      {
        q: 'Ist ein Kassensystem dasselbe wie ein Kartenlesegerät?',
        a: 'Nein. Ein Kartenlesegerät verarbeitet nur Kartenzahlungen. Ein Kassensystem verwaltet den gesamten Verkauf — Produktauswahl, Preisgestaltung, Bestandsaktualisierung, Belege und Berichte — wobei die Kartenzahlung nur eine Komponente davon ist.',
      },
      {
        q: 'Wie viel kostet ein Kassensystem im Vereinigten Königreich?',
        a: 'Die Kosten reichen von kostenlos (mit Gebühren pro Transaktion) bis zu 50–100 £ pro Monat für Systeme mit vollem Funktionsumfang. Hardware kann je nach vorhandenen Geräten oder dedizierten Terminals weitere 200–1.000 £ kosten.',
      },
    ],
  },
  'askbiz-pos-overview': {
    title: 'AskBiz POS: So funktioniert unser integriertes Kassensystem',
    description:
      'AskBiz enthält ein vollständig integriertes Kassenmodul. Hier erfahren Sie, wie es funktioniert, was es kostet und warum es sich von eigenständigen Kassen unterscheidet.',
    keywords: [
      'AskBiz POS',
      'integriertes Kassensystem',
      'eingebautes Kassensystem',
      'AskBiz Einzelhandel',
      'Kassenmodul',
      'Kassensoftware für Kleinunternehmen',
    ],
    keyTakeaways: [
      'AskBiz POS ist direkt in die Plattform integriert — keine Drittanbieter-Anbindungen oder zusätzlichen Abonnements nötig.',
      'Es nutzt die Kamera Ihres Smartphones zum Barcode-Scanning und macht dedizierte Hardware überflüssig.',
      'Jeder Verkauf fließt automatisch in die AskBiz-Analysen ein und liefert Ihnen Geschäftskennzahlen in Echtzeit.',
    ],
    content: [
      {
        heading: 'Warum wir ein Kassensystem in AskBiz integriert haben',
        body: 'Die meisten Kleinunternehmer landen am Ende bei einem Flickenteppich aus Tools: ein System für den Verkauf, ein weiteres für den Bestand, ein drittes für die Buchhaltung und vielleicht ein viertes für Analysen. Jedes hat seinen eigenen Login, sein eigenes Datenformat und seine eigene monatliche Gebühr. Wenn etwas schiefgeht — eine Bestandsabweichung, eine fehlende Transaktion, eine Mehrwertsteuernummer, die nicht aufgeht —, verbringen Sie Stunden damit, Tabellen abzugleichen. Wir haben AskBiz POS entwickelt, um genau diese Reibung zu beseitigen. Da das Kassensystem Teil von AskBiz ist, aktualisiert jeder Verkauf, den Sie abwickeln, sofort Ihren Bestand, speist Ihre Umsatz-Dashboards und wird Teil Ihrer Geschäftsanalysen. Es gibt keine Synchronisierung, keine CSV-Exporte und keinen Abgleich. Die Daten fließen in Echtzeit, was bedeutet, dass die Erkenntnisse, die Sie in AskBiz sehen, immer aktuell sind.',
      },
      {
        heading: 'So funktioniert es in der Praxis',
        body: 'Wenn Sie das Kassenmodul öffnen, sehen Sie eine übersichtliche Verkaufsoberfläche. Tippen Sie auf das Kamerasymbol, um einen Barcode zu scannen — AskBiz nutzt die Kamera Ihres Geräts und maschinelles Lernen direkt auf dem Gerät, um Barcodes sofort zu erkennen. Das Produkt erscheint mit Name, Preis und aktuellem Bestand im Warenkorb. Fügen Sie weitere Artikel hinzu, passen Sie Mengen an, wenden Sie bei Bedarf Rabatte an und wählen Sie dann eine Zahlungsmethode: Bargeld, Karte oder eine Kombination aus beidem. Sobald der Verkauf bestätigt ist, erstellt AskBiz einen Beleg, den Sie drucken, auf dem Bildschirm anzeigen oder direkt per WhatsApp an den Kunden senden können. Der gesamte Ablauf — vom ersten Scan bis zum Beleg — dauert in der Regel unter sechzig Sekunden. Im Hintergrund wird der Bestand reduziert, der Umsatz dem richtigen Mitarbeiter zugeordnet, die Mehrwertsteuer berechnet und die Transaktion in Ihr Audit-Trail aufgenommen.',
      },
      {
        heading: 'Was es von eigenständigen Kassensystemen unterscheidet',
        body: 'Eigenständige Kassensysteme sind reine Transaktionswerkzeuge — sie wickeln Verkäufe ab, und damit endet ihre Aufgabe im Wesentlichen. AskBiz POS ist ein Analysewerkzeug, das nebenbei auch Verkäufe abwickelt. Jede Transaktion erzeugt Daten, die AskBiz automatisch auswertet. Sie sehen nicht nur, dass Sie heute zweiundvierzig Einheiten von Produkt X verkauft haben — Sie sehen, dass die Verkäufe von Produkt X im Wochenvergleich um 18 % gestiegen sind, dass es Ihr margenstärkstes Produkt ist und dass Ihnen bei der aktuellen Abverkaufsrate in neun Tagen der Bestand ausgeht. Dieser Kontext macht aus einem Kassensystem kein glorifiziertes Registrierkassenprogramm mehr, sondern ein Entscheidungswerkzeug. Sie erhalten außerdem Leistungskennzahlen für Ihr Personal, tägliche Umsatzverfolgung, Bestandswarnungen und exportierbare Berichte — alles, ohne die Plattform zu verlassen.',
      },
      {
        heading: 'Erste Schritte mit AskBiz POS',
        body: 'Die Einrichtung dauert etwa fünfzehn Minuten. Fügen Sie zunächst Ihre Produkte hinzu — manuell, per CSV-Upload oder indem Sie Barcodes scannen und die Details nach und nach eingeben. Laden Sie anschließend Ihr Personal ein und weisen Sie Rollen zu (Inhaber, Manager oder Kassierer), damit jede Person die passende Zugriffsstufe erhält. Konfigurieren Sie zum Schluss Ihre Belegeinstellungen: Wählen Sie zwischen gedruckter Ausgabe, Anzeige auf dem Bildschirm oder Zustellung per WhatsApp. Hardware müssen Sie nicht kaufen, es sei denn, Sie möchten der Bequemlichkeit halber einen Bluetooth-Bondrucker. AskBiz POS läuft als Progressive Web App (PWA) und funktioniert daher auf jedem modernen Smartphone oder Tablet; es lässt sich zudem auf dem Startbildschirm installieren, um mit einem Tipp darauf zuzugreifen. Wenn Sie AskBiz bereits für Analysen oder Bestandsverwaltung nutzen, ist Ihr Produktkatalog bereits vorhanden — schalten Sie einfach das Kassenmodul ein und beginnen Sie mit dem Verkauf.',
      },
    ],
    faq: [
      {
        q: 'Ist AskBiz POS in meinem Abonnement enthalten?',
        a: 'Ja. Das Kassenmodul ist in allen AskBiz-Tarifen ohne Aufpreis enthalten. Es fallen keine Gebühren pro Transaktion von AskBiz an — Sie zahlen nur das, was Ihr Kartenzahlungsanbieter berechnet.',
      },
      {
        q: 'Kann ich AskBiz POS offline nutzen?',
        a: 'AskBiz POS unterstützt einen Offline-Modus für den grundlegenden Verkauf. Transaktionen werden lokal gespeichert und automatisch synchronisiert, sobald Ihr Gerät wieder mit dem Internet verbunden ist.',
      },
      {
        q: 'Muss ich einen Barcode-Scanner kaufen?',
        a: 'Nein. AskBiz nutzt die Kamera Ihres Smartphones oder Tablets zum Scannen von Barcodes. Ein dedizierter Bluetooth-Scanner ist optional, falls Sie die Geschwindigkeit und Ergonomie eines Hardware-Geräts bevorzugen.',
      },
    ],
  },
  'pos-staff-management': {
    title: 'Mitarbeiterverwaltung im Kassensystem: Rollen, Berechtigungen und Magic-Link-Login',
    description:
      'Behalten Sie die Kontrolle darüber, wer was in Ihrem Kassensystem tun kann. Erfahren Sie, wie Sie Mitarbeiterrollen einrichten, Berechtigungen verwalten und Magic-Link-Logins für schnellen, sicheren Zugriff nutzen.',
    keywords: [
      'Mitarbeiterverwaltung Kassensystem',
      'Mitarbeiterrollen POS',
      'Kassenberechtigungen',
      'Magic-Link-Login',
      'Kassierer-Login',
      'Benutzerverwaltung Kassensystem',
      'Zugriffsrechte Einzelhandelspersonal',
    ],
    keyTakeaways: [
      'AskBiz POS unterstützt drei Rollen — Inhaber, Manager und Kassierer — jeweils mit unterschiedlichen Berechtigungsstufen.',
      'Mit Magic-Link-Login melden sich Mitarbeiter mit einem einzigen Tipp an — keine Passwörter zum Merken oder Zurücksetzen.',
      'Fein abgestufte Berechtigungen schützen sensible Vorgänge wie Rückerstattungen, Stornierungen und Datenexporte.',
    ],
    content: [
      {
        heading: 'Warum Mitarbeiterrollen in einem Kassensystem wichtig sind',
        body: 'Solange Sie allein an der Kasse stehen, spielen Berechtigungen keine Rolle — Sie können alles tun. Sobald Sie eine zweite Person einstellen, ändert sich alles. Eine Samstagsaushilfe sollte Verkäufe abwickeln und Belege drucken können — aber sollte sie auch Rückerstattungen ausstellen, Transaktionen stornieren oder Ihre Umsatzdaten exportieren dürfen? Mit ziemlicher Sicherheit nicht. Mitarbeiterrollen erlauben es Ihnen, genau festzulegen, was jede Person im Kassensystem tun darf und was nicht. Das schützt Ihr Unternehmen sowohl vor versehentlichen Fehlern (eine Auszubildende storniert aus Versehen die Verkäufe eines ganzen Tages) als auch vor absichtlichem Missbrauch (ein Mitarbeiter stellt betrügerische Rückerstattungen aus). Außerdem vereinfacht es die Oberfläche für jeden Nutzer — ein Kassierer sieht nur die Bildschirme, die er braucht, was die Einarbeitung beschleunigt und Fehler reduziert.',
      },
      {
        heading: 'Die drei Rollen in AskBiz POS',
        body: 'Inhaber ist die oberste Rolle mit uneingeschränktem Zugriff. Inhaber können Mitarbeiter hinzufügen und entfernen, Preise ändern, Rückerstattungen ausstellen, auf alle Berichte zugreifen und Daten exportieren. In der Regel sollte es ein oder zwei Inhaber pro Unternehmen geben. Manager steht in der Mitte. Manager können Verkäufe abwickeln, Rückerstattungen und Stornierungen bearbeiten, Tagesberichte einsehen und den Bestand verwalten — sie können jedoch keine anderen Mitarbeiter hinzufügen oder entfernen, keine Abonnementeinstellungen ändern und nicht auf unternehmensweite Analysen zugreifen. Das ist die richtige Rolle für eine vertrauenswürdige Schichtleitung oder Filialleitung. Kassierer ist die am stärksten eingeschränkte Rolle. Kassierer können Verkäufe abwickeln, Artikel scannen, Zahlungen entgegennehmen und Belege versenden. Sie können keine Rückerstattungen ausstellen, keine Transaktionen stornieren, keine Berichte einsehen und nicht auf Admin-Einstellungen zugreifen. Dies ist die Standardrolle für Teilzeit- oder neue Mitarbeiter.',
      },
      {
        heading: 'Magic-Link-Login erklärt',
        body: 'Herkömmliche Kassensysteme verwenden PIN-Codes oder Passwörter für den Mitarbeiter-Login. PINs werden weitergegeben, Passwörter werden vergessen, und am Ende klebt ein Zettel mit den Zugangsdaten an der Kasse — was den Sinn der Zugriffskontrolle ziemlich untergräbt. AskBiz POS setzt stattdessen auf den Magic-Link-Login. Wenn sich ein Mitarbeiter anmelden möchte, gibt er seine E-Mail-Adresse ein und erhält per E-Mail einen einmaligen Link. Ein Tipp auf diesen Link meldet ihn sofort an, mit der passenden Rolle und den entsprechenden Berechtigungen. Es gibt nichts zu merken, nichts weiterzugeben, und der Link läuft nach kurzer Zeit ab — selbst wenn er abgefangen wird, kann er also nicht erneut verwendet werden. Für mehr Tempo können Mitarbeiter, die regelmäßig dasselbe Gerät nutzen, zwischen den Schichten angemeldet bleiben, wobei die Sitzung nach einer konfigurierbaren Zeit der Inaktivität automatisch abläuft.',
      },
      {
        heading: 'Mitarbeiter in AskBiz POS einrichten',
        body: 'Um einen Mitarbeiter hinzuzufügen, gehen Sie zu den POS-Einstellungen und tippen Sie auf Mitarbeiter hinzufügen. Geben Sie Name und E-Mail-Adresse ein, wählen Sie die Rolle (Inhaber, Manager oder Kassierer) und tippen Sie auf Einladen. Der Mitarbeiter erhält eine E-Mail mit einem Magic Link, um seine Sitzung einzurichten. Sie können die Rolle jederzeit ändern — nützlich, wenn ein Kassierer zum Manager befördert wird oder Sie für eine bestimmte Schicht vorübergehend höhere Berechtigungen benötigen. Das Entfernen eines Mitarbeiters widerruft den Zugriff sofort; alle aktiven Sitzungen werden beendet. AskBiz protokolliert jede Rollenänderung im Audit-Trail, sodass Sie jederzeit nachvollziehen können, wer wann welchen Zugriff hatte. Sollten Sie künftig mehrere Standorte betreiben, können Mitarbeiter bestimmten Filialen mit standortbezogenen Berechtigungen zugewiesen werden.',
      },
    ],
    faq: [
      {
        q: 'Kann ein Kassierer sehen, wie viel Umsatz das Unternehmen gemacht hat?',
        a: 'Nein. Kassierer sehen nur die Verkaufsoberfläche. Umsatzberichte, Analysen und Exportfunktionen sind den Rollen Manager und Inhaber vorbehalten.',
      },
      {
        q: 'Was passiert, wenn ein Mitarbeiter keinen Zugriff mehr auf seine E-Mail hat?',
        a: 'Ein Inhaber kann die alte E-Mail-Adresse entfernen und den Mitarbeiter mit einer neuen Adresse erneut einladen. Die Änderung erfolgt sofort, und die alten Magic Links funktionieren umgehend nicht mehr.',
      },
    ],
  },
  'pos-camera-scanning': {
    title: 'Kamera-Scanning und Barcode-Erkennung in AskBiz POS',
    description:
      'Erfahren Sie, wie AskBiz POS die Kamera Ihres Smartphones nutzt, um Barcodes sofort zu scannen — ohne dedizierte Scanner-Hardware.',
    keywords: [
      'Barcode-Scanning',
      'Kamera-Scanning Kassensystem',
      'Smartphone-Barcodescanner',
      'AskBiz Barcode',
      'EAN-Barcode',
      'UPC-Scanning',
      'Barcode-Lesegerät Einzelhandel',
    ],
    keyTakeaways: [
      'AskBiz POS nutzt maschinelles Lernen direkt auf dem Gerät, um Barcodes über die Kamera Ihres Smartphones oder Tablets zu erkennen.',
      'Es unterstützt alle gängigen Barcode-Formate im Einzelhandel, darunter EAN-13, UPC-A, Code 128 und QR-Codes.',
      'Kamera-Scanning macht für die meisten Kleinhändler die Anschaffung dedizierter Barcode-Scanner-Hardware überflüssig.',
    ],
    content: [
      {
        heading: 'So funktioniert Kamera-Scanning',
        body: 'Wenn Sie in AskBiz POS auf die Scan-Schaltfläche tippen, aktiviert sich die Kamera Ihres Geräts, und auf dem Bildschirm erscheint ein Sucherfeld. Richten Sie die Kamera auf einen Barcode — halten Sie sie in etwa 15 bis 30 Zentimeter Entfernung — und das System erkennt ihn in unter einer Sekunde. Es gibt keinen Auslöser zum Drücken; die Erkennung läuft kontinuierlich und automatisch. Dahinter steckt maschinelles Lernen direkt auf dem Gerät. Statt ein Bild zur Verarbeitung an einen Server zu senden (was Verzögerungen verursachen und eine Netzwerkverbindung erfordern würde), verarbeitet AskBiz den Barcode vollständig auf Ihrem Smartphone oder Tablet. Das bedeutet, dass das Scannen selbst bei schwacher Internetverbindung funktioniert — besonders nützlich für Marktstände, Pop-up-Shops und Standorte mit unzuverlässigem WLAN. Sobald ein Barcode erkannt ist, gleicht AskBiz ihn mit Ihrem Produktkatalog ab und legt den entsprechenden Artikel in den Warenkorb.',
      },
      {
        heading: 'Unterstützte Barcode-Formate',
        body: 'AskBiz POS unterstützt jedes im britischen Einzelhandel gängige Barcode-Format. EAN-13 ist der Standard für die meisten in Europa verkauften Konsumgüter — es ist die dreizehnstellige Nummer, die auf praktisch jedem Supermarktartikel unter den Balken zu sehen ist. UPC-A ist das nordamerikanische Äquivalent und häufig auf importierten Waren zu finden. Code 128 wird für Artikel mit variablem Gewicht, Versandetiketten und interne Lagercodes verwendet. QR-Codes werden zunehmend von unabhängigen Händlern für eigene Produkte genutzt, die keinen Herstellerbarcode haben. Wenn Sie eigene Produkte herstellen (Backwaren, handgefertigte Artikel, individuelle Sets), können Sie in AskBiz QR-Codes erstellen und ausdrucken und sie auf Ihre Verpackung kleben. Der Scanner erkennt sie genauso schnell wie einen Standardbarcode.',
      },
      {
        heading: 'Tipps für zuverlässiges Scannen',
        body: 'Kamera-Scanning ist auf modernen Smartphones bemerkenswert zuverlässig, aber ein paar einfache Praktiken machen es noch besser. Erstens: Sorgen Sie für ausreichend Licht — die Kamera muss den Barcode klar erkennen können, in sehr dunklen Umgebungen kann daher eine zusätzliche Lichtquelle nötig sein. Zweitens: Halten Sie das Gerät ruhig und in einem leichten Winkel statt genau parallel zum Barcode; das reduziert Spiegelungen, besonders bei glänzender Verpackung. Drittens: Halten Sie das Kameraobjektiv sauber. Ein verschmiertes Objektiv ist die häufigste Ursache für eine langsame Erkennung. Viertens: Ist ein Barcode beschädigt oder teilweise verdeckt, können Sie immer auf die manuelle Suche zurückgreifen — geben Sie die ersten Buchstaben des Produktnamens ein und wählen Sie ihn aus der Liste aus. Erwägen Sie schließlich für Umgebungen mit hohem Durchsatz, in denen Geschwindigkeit entscheidend ist (etwa ein belebter Samstagsmarktstand), einen Bluetooth-Barcodescanner zu koppeln. Er ist nicht erforderlich, spart aber im Vergleich zur Kamera-Erkennung ein bis zwei Sekunden pro Scan.',
      },
      {
        heading: 'Was passiert, wenn ein Barcode nicht in Ihrem Katalog ist',
        body: 'Scannen Sie einen Barcode, den AskBiz nicht erkennt, werden Sie aufgefordert, das Produkt hinzuzufügen. Sie geben Produktname, Preis und Kategorie ein, und der Barcode wird dauerhaft mit diesem Produkt verknüpft. Beim nächsten Scan desselben Barcodes erscheint das Produkt sofort. Das macht den Aufbau des Katalogs organisch — Sie müssen sich nicht hinsetzen und hunderte Produkte eingeben, bevor Sie mit dem Verkauf beginnen. Viele AskBiz-Nutzer bauen ihren gesamten Katalog einfach dadurch auf, dass sie Artikel scannen, sobald sie vom Lieferanten eintreffen. In den ersten ein bis zwei Handelswochen füllt sich der Katalog von selbst. Sie können Produkte auch per CSV im Großformat importieren, wenn Sie lieber alles im Voraus einrichten möchten.',
      },
    ],
    faq: [
      {
        q: 'Funktioniert Kamera-Scanning auch auf älteren Smartphones?',
        a: 'Es funktioniert auf jedem Smartphone oder Tablet mit einer Kamera, das moderne Webstandards unterstützt. Geräte ab Baujahr 2018 funktionieren in der Regel gut. Sehr alte Geräte scannen möglicherweise langsamer.',
      },
      {
        q: 'Kann ich mehrere Artikel schnell hintereinander scannen?',
        a: 'Ja. Nach jedem erfolgreichen Scan fügt AskBiz den Artikel dem Warenkorb hinzu und aktiviert den Scanner sofort erneut. Sie können Artikel so schnell scannen, wie Sie die Kamera darauf richten können.',
      },
    ],
  },
  'pos-processing-a-sale': {
    title: 'Einen Verkauf abwickeln: Vom Scan zum Beleg in unter 60 Sekunden',
    description:
      'Durchlaufen Sie den kompletten Kassiervorgang von AskBiz POS — Scannen, Warenkorb prüfen, Zahlung und Beleg — Schritt für Schritt.',
    keywords: [
      'Verkauf abwickeln Kassensystem',
      'Kassiervorgang POS',
      'vom Scan zum Beleg',
      'AskBiz Verkaufsprozess',
      'Kassiergeschwindigkeit Einzelhandel',
      'POS-Transaktionsschritte',
    ],
    keyTakeaways: [
      'Ein kompletter Verkauf in AskBiz POS dauert vom ersten Scan bis zur Belegzustellung unter sechzig Sekunden.',
      'Der Kassiervorgang hat vier Schritte: scannen, Warenkorb prüfen, Zahlung entgegennehmen und Beleg ausstellen.',
      'Jeder Verkauf aktualisiert automatisch den Bestand, die Umsatzverfolgung und die Leistungskennzahlen der Mitarbeiter.',
    ],
    content: [
      {
        heading: 'Schritt 1 — Artikel scannen oder suchen',
        body: 'Der Verkauf beginnt in dem Moment, in dem ein Kunde Artikel auf Ihre Theke legt. Tippen Sie auf die Scan-Schaltfläche, um die Kamera zu aktivieren, und richten Sie sie auf den ersten Barcode. Das Produkt erscheint innerhalb einer Sekunde im Warenkorb, mit Name, Preis und Mehrwertsteuerstatus. Bei Artikeln ohne Barcode tippen Sie auf das Suchsymbol und geben die ersten Buchstaben des Produktnamens ein — AskBiz nutzt eine unscharfe Suche, Sie müssen also nicht alles fehlerfrei buchstabieren. Möchte ein Kunde mehrere Exemplare desselben Artikels, können Sie entweder den Barcode wiederholt scannen oder im Warenkorb das Mengenfeld antippen und die Zahl direkt eingeben. Beide Methoden sind schnell, aber bei großen Mengen (etwa zwanzig Stück desselben Artikels) geht die Zahleneingabe schneller. Sie können Scannen und Suchen innerhalb derselben Transaktion beliebig kombinieren — es gibt keinen Modus, zwischen dem Sie wechseln müssten.',
      },
      {
        heading: 'Schritt 2 — Warenkorb prüfen und anpassen',
        body: 'Vor der Zahlung können Sie und der Kunde den Warenkorb überprüfen. AskBiz zeigt jeden Artikel mit Name, Einzelpreis, Menge und Zeilensumme an. Die laufende Gesamtsumme und die Mehrwertsteueraufschlüsselung erscheinen unten auf dem Bildschirm. Ändert ein Kunde seine Meinung, wischen Sie einen Artikel weg, um ihn zu entfernen, oder tippen Sie auf die Menge, um sie anzupassen. Möchten Sie einen Rabatt gewähren? Tippen Sie auf die Rabatt-Schaltfläche und geben Sie einen Prozentsatz oder einen festen Betrag ein — er gilt wahlweise für den gesamten Warenkorb oder für einzelne Artikel. Im Warenkorb können Sie der Transaktion auch eine Notiz hinzufügen (zum Beispiel „Kunde wünscht Geschenkverpackung") oder den Verkauf mit einem vorhandenen Kundendatensatz für die Treuepunkte-Verfolgung verknüpfen. Dieser Prüfschritt dauert bei einem typischen Warenkorb mit drei bis fünf Artikeln nur wenige Sekunden, verhindert aber Fehler, die andernfalls später eine Rückerstattung erfordern würden.',
      },
      {
        heading: 'Schritt 3 — Zahlung entgegennehmen',
        body: 'Tippen Sie auf die Schaltfläche Bezahlen, und AskBiz zeigt Ihnen die Zahlungsoptionen an. Die gängigsten sind Bargeld und Karte, Sie können eine Zahlung aber auch auf mehrere Methoden aufteilen — der Kunde zahlt zum Beispiel einen Teil in bar und den Rest per Karte. Bei Barzahlungen geben Sie den erhaltenen Betrag ein, und AskBiz berechnet das Rückgeld. Bei Kartenzahlungen wickeln Sie die Transaktion wie gewohnt über Ihr Kartenterminal ab und bestätigen anschließend in AskBiz, dass die Zahlung eingegangen ist. AskBiz ersetzt Ihr Kartenterminal nicht; es erfasst die Zahlungsmethode zusammen mit der Transaktion für Ihre Unterlagen. Nutzen Sie einen Kartenzahlungsanbieter, der mit AskBiz verbunden ist (die Unterstützung großer britischer Anbieter wächst stetig), kann die Bestätigung automatisch erfolgen. Entscheidend ist, dass AskBiz die Zahlungsmethode kennt, damit Ihre Berichte das Verhältnis von Bar- zu Kartenzahlungen korrekt widerspiegeln.',
      },
      {
        heading: 'Schritt 4 — Den Beleg ausstellen',
        body: 'Sobald die Zahlung bestätigt ist, erstellt AskBiz einen Beleg. Sie haben drei Zustelloptionen. Erstens können Sie ihn auf dem Bildschirm anzeigen — der Kunde sieht die Artikelliste und die Summe auf Ihrem Gerät, was sich für schnelle Transaktionen eignet, bei denen kein Papierbeleg nötig ist. Zweitens können Sie ihn über einen verbundenen Bluetooth-Bondrucker ausdrucken. Drittens — und diese Option lieben die meisten AskBiz-Nutzer besonders — können Sie den Beleg direkt an das WhatsApp des Kunden senden. Geben Sie einfach die Telefonnummer ein (oder wählen Sie den Kunden aus Ihrer Kundenliste aus), und der Beleg kommt innerhalb von Sekunden als formatierte WhatsApp-Nachricht an. Digitale Belege reduzieren Papierabfall, geben dem Kunden einen dauerhaften Nachweis, den er nicht verlieren kann, und schaffen eine Gelegenheit für künftigen Kontakt. Nach der Ausstellung des Belegs wird der Warenkorb geleert, und AskBiz ist bereit für den nächsten Kunden.',
      },
    ],
    faq: [
      {
        q: 'Kann ich einen Verkauf abwickeln, ohne einen Barcode zu scannen?',
        a: 'Ja. Sie können Produkte nach Name suchen, Ihren Katalog nach Kategorie durchsuchen oder einen individuellen Artikel mit einem manuell eingegebenen Preis hinzufügen. Barcode-Scanning ist die schnellste Methode, aber nicht die einzige.',
      },
      {
        q: 'Was passiert, wenn meine Internetverbindung während eines Verkaufs abbricht?',
        a: 'AskBiz POS verfügt über eine Offline-Funktion. Der Verkauf wird lokal abgeschlossen und mit der Cloud synchronisiert, sobald Ihre Verbindung wiederhergestellt ist. Die Transaktion geht dabei nicht verloren.',
      },
    ],
  },
  'pos-cart-management': {
    title: 'Warenkorbverwaltung: Artikel hinzufügen, bearbeiten und entfernen',
    description:
      'Beherrschen Sie den Warenkorb von AskBiz POS — Artikel hinzufügen, Mengen anpassen, Rabatte gewähren und Kundenwünsche berücksichtigen, ohne die Schlange auszubremsen.',
    keywords: [
      'Warenkorbverwaltung Kassensystem',
      'POS-Warenkorb bearbeiten',
      'Artikel hinzufügen Kassensystem',
      'Artikel aus Warenkorb entfernen',
      'Rabatt Kassensystem',
      'Warenkorb im Einzelhandel bearbeiten',
      'Verkaufsartikel ändern',
    ],
    keyTakeaways: [
      'Der Warenkorb von AskBiz POS aktualisiert sich in Echtzeit, während Sie Produkte scannen, suchen oder manuell hinzufügen.',
      'Sie können jederzeit vor der Zahlung Mengen anpassen, Artikel entfernen und Rabatte gewähren.',
      'Änderungen im Warenkorb wirken sich sofort auf die laufende Summe und die Mehrwertsteuerberechnung aus.',
    ],
    content: [
      {
        heading: 'Artikel zum Warenkorb hinzufügen',
        body: 'In AskBiz POS gibt es drei Möglichkeiten, Artikel hinzuzufügen. Am schnellsten ist das Barcode-Scanning — tippen Sie auf die Scan-Schaltfläche, richten Sie die Kamera darauf, und das Produkt erscheint im Warenkorb. Zweitens können Sie über die Suchleiste oben in der Verkaufsansicht nach Name suchen. AskBiz nutzt eine unscharfe Suche, sodass die Eingabe von „schok" bereits „Schokobrownie", „Heiße-Schokolade-Beutel" und alles andere mit diesen Buchstaben findet. Drittens können Sie Ihren Produktkatalog nach Kategorie durchsuchen — nützlich, wenn Sie die Kategorie kennen, aber nicht den genauen Namen. Jedes Mal, wenn Sie einen Artikel hinzufügen, erscheint er als neue Zeile im Warenkorb mit Name, Einzelpreis und einer Menge von zunächst eins. Scannen Sie einen Artikel, der bereits im Warenkorb liegt, erhöht sich automatisch die Menge, statt eine doppelte Zeile anzulegen. Der Warenkorb lässt sich bei einer langen Liste flüssig scrollen, und die Summe aktualisiert sich mit jeder Hinzufügung sofort.',
      },
      {
        heading: 'Mengen und Preise bearbeiten',
        body: 'Kunden ändern ihre Meinung. Sie möchten drei von etwas statt eines, oder entscheiden sich doch gegen die Chips. Tippen Sie in AskBiz POS auf das Mengenfeld neben einem Artikel und geben Sie die neue Zahl direkt ein — Sie müssen nicht wiederholt auf ein Plus-Symbol tippen. Um einen einzelnen Artikel zu entfernen, wischen Sie die Zeile nach links und tippen Sie auf Löschen, oder setzen Sie die Menge auf null. Möchten Sie einen Preis überschreiben (zum Beispiel bei einem beschädigten Artikel, der ermäßigt verkauft wird), tippen Sie auf das Preisfeld und geben Sie den neuen Betrag ein. Preisüberschreibungen werden im Audit-Trail protokolliert, damit Sie sie später überprüfen und sicherstellen können, dass sie berechtigt sind. All diese Änderungen erfolgen in Echtzeit: Die laufende Summe, die Mehrwertsteueraufschlüsselung und die Artikelanzahl aktualisieren sich in dem Moment, in dem Sie eine Änderung vornehmen, sodass der Kunde stets eine korrekte Zahl sieht.',
      },
      {
        heading: 'Rabatte gewähren',
        body: 'AskBiz POS unterstützt zwei Arten von Rabatten: prozentual und als fester Betrag. Ein prozentualer Rabatt senkt den Preis um einen festgelegten Anteil — zum Beispiel 10 % Nachlass. Ein Festbetrag-Rabatt senkt den Preis um eine bestimmte Summe — etwa 2 £ Nachlass. Sie können Rabatte auf einzelne Artikel oder auf den gesamten Warenkorb anwenden. Um einen Rabatt auf einen einzelnen Artikel zu gewähren, tippen Sie im Warenkorb auf den Artikel und wählen Rabatt. Für einen Rabatt auf den gesamten Warenkorb tippen Sie auf die Rabatt-Schaltfläche unterhalb der Gesamtsumme. Rabatte werden auf dem Beleg deutlich ausgewiesen, damit der Kunde sieht, was er gespart hat, und sie werden in Ihren Verkaufsdaten erfasst, sodass Sie analysieren können, wie viel Sie im Schnitt nachlassen und ob dies zusätzliches Volumen bringt. Führen Sie regelmäßig Aktionen durch (etwa „zwei kaufen, 10 % sparen"), können Sie wiederverwendbare Rabattvorlagen einrichten, damit Ihr Personal nicht spontan Prozentsätze berechnen muss.',
      },
      {
        heading: 'Komplexe Warenkorbsituationen meistern',
        body: 'Der reale Einzelhandelsalltag bringt Situationen mit sich, die ein einfacher Warenkorb nur schwer bewältigt. Ein Kunde möchte seinen Einkauf in zwei Transaktionen aufteilen — etwa eine privat und eine über eine Firmenkarte bezahlt. In AskBiz können Sie den aktuellen Warenkorb parken (vorübergehend speichern), eine neue Transaktion starten und anschließend zum geparkten Warenkorb zurückkehren. Ein weiteres häufiges Szenario ist ein Kunde, der mitten im Kassiervorgang merkt, dass er einen Artikel vergessen hat, und zurück ins Regal läuft. Sie müssen die Transaktion nicht abbrechen — der Warenkorb wartet geduldig, bis der Kunde den Artikel geholt hat, und Sie fügen ihn bei der Rückkehr hinzu. Möchten Sie der Transaktion eine Notiz hinzufügen (zum Beispiel „Kunde wünscht Mehrwertsteuerbeleg per E-Mail"), tippen Sie unten im Warenkorb auf das Notizfeld. Notizen werden zur Transaktion gespeichert und sind in Ihrem Audit-Trail und in den Berichten sichtbar.',
      },
    ],
    faq: [
      {
        q: 'Kann ich einen Warenkorb speichern und später fortsetzen?',
        a: 'Ja. AskBiz POS verfügt über eine Funktion „Warenkorb parken", die die aktuelle Transaktion speichert. Sie können einen neuen Verkauf beginnen und dann zum geparkten Warenkorb zurückkehren, sobald Sie bereit sind. Das ist nützlich für Kunden, die kurz weggehen müssen.',
      },
      {
        q: 'Gibt es eine Obergrenze für die Anzahl der Artikel im Warenkorb?',
        a: 'Es gibt keine praktische Obergrenze. Der Warenkorb unterstützt Hunderte von Positionen, auch wenn die meisten Einzelhandelstransaktionen weniger als zwanzig enthalten.',
      },
    ],
  },
  'pos-cash-vs-card-payments': {
    title: 'Bargeld vs. Kartenzahlung: Die richtige Mischung für Ihr Unternehmen wählen',
    description:
      'Sollten Sie ganz auf Bargeld verzichten? Beides akzeptieren? So denken Sie über Zahlungsmethoden, Transaktionsgebühren und die tatsächlichen Vorlieben Ihrer Kunden nach.',
    keywords: [
      'Bargeld vs Kartenzahlung',
      'Zahlungsmethoden Einzelhandel',
      'Kartengebühren UK',
      'bargeldloses Geschäft',
      'Kartenzahlung akzeptieren',
      'Zahlungsmix Einzelhandel',
      'kontaktlos bezahlen UK',
    ],
    keyTakeaways: [
      'Kartenzahlungen machen inzwischen über 80 % aller Einzelhandelstransaktionen im Vereinigten Königreich aus, Bargeld bleibt jedoch für bestimmte Kundengruppen wichtig.',
      'Kartengebühren liegen in der Regel zwischen 1,2 % und 2,5 % pro Transaktion — berücksichtigen Sie das in Ihrer Preisgestaltung.',
      'AskBiz POS erfasst Ihr Verhältnis von Bar- zu Kartenzahlungen, damit Sie datengestützte Entscheidungen zu Zahlungsmethoden treffen können.',
    ],
    content: [
      {
        heading: 'Die Zahlungslandschaft im Vereinigten Königreich 2026',
        body: 'Das Vereinigte Königreich hat sich klar in Richtung Karten- und kontaktlose Zahlungen entwickelt. Laut Daten von UK Finance überholten Debitkarten Bargeld bereits 2017 als häufigste Zahlungsmethode, und der Abstand ist seither jedes Jahr größer geworden. Kontaktloses Bezahlen allein macht inzwischen den Großteil der Kartentransaktionen aus, wobei die Grenze pro Einzeltransaktion 2021 auf 100 £ angehoben wurde und seither breit genutzt wird. Mobile Wallets — Apple Pay, Google Pay und Samsung Pay — haben eine weitere Ebene hinzugefügt und ermöglichen es Kunden, mit dem Smartphone oder der Uhr zu bezahlen. Für die meisten städtischen Einzelhändler ist es inzwischen realistisch, vollständig auf Bargeld zu verzichten. Allerdings verlassen sich etwa einer von zehn britischen Erwachsenen weiterhin überwiegend auf Bargeld, und dieser Anteil ist bei älteren Kunden, Menschen ohne Bankkonto und in bestimmten ländlichen Gebieten höher. Umfasst Ihr Kundenstamm solche Gruppen, bedeutet die Ablehnung von Bargeld, dass Sie Umsatz liegen lassen.',
      },
      {
        heading: 'Kartengebühren verstehen',
        body: 'Jede Kartentransaktion kostet Sie Geld. An einer Kartenzahlung sind neben Ihnen und dem Kunden mindestens drei weitere Parteien beteiligt: das Kartennetzwerk (Visa, Mastercard), die kartenausgebende Bank (die Bank des Kunden) und die Akquisitionsbank oder der Zahlungsdienstleister (Ihr Anbieter). Jede Partei behält einen kleinen Anteil ein. Für ein typisches britisches Kleinunternehmen sollten Sie mit 1,2 % bis 2,5 % pro Transaktion rechnen, abhängig von Ihrem Anbieter, Ihrem Umsatzvolumen und der verwendeten Kartenart. Premium- und Firmenkarten haben höhere Interchange-Gebühren als Standard-Debitkarten. Manche Anbieter berechnen zusätzlich zum Prozentsatz eine feste Gebühr pro Transaktion. Bei geringen Transaktionswerten (unter 5 £) können Gebühren einen erheblichen Teil Ihrer Marge auffressen — weshalb manche kleinen Cafés bei kleinen Beträgen weiterhin Bargeld bevorzugen. AskBiz POS erfasst die Zahlungsmethode für jede Transaktion und lässt Sie so genau berechnen, wie viel Sie monatlich an Transaktionsgebühren zahlen.',
      },
      {
        heading: 'Die Argumente für ein bargeldloses Geschäft',
        body: 'Bargeld verursacht versteckte Kosten, die viele Kleinunternehmer unterschätzen. Das Zählen der Kasse kostet zu Beginn und am Ende jeder Schicht Zeit. Fehler bei der Bargeldhandhabung führen zu Abweichungen, die sich nur schwer nachvollziehen lassen. Bankfahrten zur Bargeldeinzahlung kosten Zeit und bergen ein Sicherheitsrisiko. Auch für steuerliche Zwecke lässt sich Bargeld schwerer abgleichen — HMRC schaut bei bargeldintensiven Unternehmen genauer hin, gerade weil Bargeld schwerer nachzuverfolgen ist. Ein bargeldloses Geschäft beseitigt all diese Probleme. Ihre Kasse stimmt immer auf den Penny genau, weil jede Transaktion digital erfasst wird. Der Abgleich erfolgt automatisch. Das Diebstahlrisiko sinkt, weil es nichts Physisches zu stehlen gibt. Und Ihr Steuerberater hat für jeden Verkauf eine lückenlose digitale Spur. Der Kompromiss ist die Transaktionsgebühr bei jedem Verkauf, doch viele Unternehmen stellen fest, dass die Zeit- und Risikoeinsparungen die Kosten aufwiegen.',
      },
      {
        heading: 'Die richtige Mischung für Ihr Unternehmen finden',
        body: 'Für die meisten britischen Kleinunternehmen ist es am besten, sowohl Bargeld als auch Karte zu akzeptieren, sich aber an dem zu orientieren, was Ihre Kunden bevorzugen. AskBiz POS liefert Ihnen die Daten für diese Entscheidung. Prüfen Sie nach einem Monat Handelstätigkeit die Aufschlüsselung der Zahlungsmethoden im Berichtsbereich. Sind 90 % Ihrer Verkäufe Kartenzahlungen, lohnt sich der Aufwand für die Bargeldhandhabung womöglich kaum noch. Sind 30 % Ihrer Verkäufe Barzahlungen — vielleicht weil Sie einen Markt bedienen, in dem viele Kunden Bargeld bevorzugen —, würde der Verzicht darauf bedeuten, fast ein Drittel Ihres Umsatzes zu verlieren. Manche Unternehmen wählen einen hybriden Ansatz: Sie akzeptieren beide Methoden, bieten aber einen kleinen Anreiz (etwa einen Treuestempel) für Kartenzahlungen und verschieben so das Verhalten allmählich, ohne Bargeldkunden zu vergraulen. Für welche Lösung Sie sich auch entscheiden — machen Sie Ihre Regelung mit Beschilderung an der Kasse deutlich, damit Kunden wissen, was sie erwartet, bevor sie an die Theke kommen.',
      },
    ],
    faq: [
      {
        q: 'Kann ich einen Mindestbetrag für Kartenzahlungen festlegen?',
        a: 'Rechtlich dürfen Sie im Vereinigten Königreich einen Mindestbetrag für Kartenzahlungen festlegen. Das kann Kunden jedoch verärgern und entspricht möglicherweise nicht den Bedingungen Ihres Zahlungsdienstleisters. Prüfen Sie Ihren Händlervertrag, bevor Sie eine solche Regelung einführen.',
      },
      {
        q: 'Lässt sich AskBiz POS mit meinem Kartenterminal verbinden?',
        a: 'AskBiz POS erfasst die Zahlungsmethode zusammen mit dem Verkauf. Bei manchen Zahlungsdienstleistern geschieht das automatisch. Bei anderen bestätigen Sie die Methode manuell, nachdem das Kartenterminal die Zahlung genehmigt hat. Prüfen Sie die Integrationsseite für Ihren jeweiligen Anbieter.',
      },
    ],
  },
  'pos-whatsapp-receipts': {
    title: 'WhatsApp-Belege: Digitalen Kaufnachweis in Sekundenschnelle versenden',
    description:
      'Ersetzen Sie Papierbelege durch WhatsApp-Nachrichten. Erfahren Sie, wie AskBiz POS formatierte digitale Belege direkt an das Smartphone Ihres Kunden sendet.',
    keywords: [
      'WhatsApp-Belege',
      'digitale Belege Kassensystem',
      'Beleg per WhatsApp senden',
      'papierlose Belege',
      'AskBiz Beleg',
      'elektronischer Beleg UK',
      'digitaler Kaufnachweis',
    ],
    keyTakeaways: [
      'AskBiz POS kann einen vollständig aufgeschlüsselten Beleg innerhalb von Sekunden an jede WhatsApp-Nummer senden.',
      'Digitale Belege reduzieren Papierabfall, können nicht verloren gehen und schaffen einen Kommunikationskanal zum Kunden.',
      'Kunden müssen nichts installieren — der Beleg kommt als ganz normale WhatsApp-Nachricht an.',
    ],
    content: [
      {
        heading: 'So funktionieren WhatsApp-Belege in AskBiz POS',
        body: 'Nach Abschluss eines Verkaufs bietet Ihnen AskBiz die Möglichkeit, den Beleg per WhatsApp zu senden. Tippen Sie auf das WhatsApp-Symbol, geben Sie die Telefonnummer des Kunden ein (oder wählen Sie ihn aus Ihrer Kundenliste, falls bereits gespeichert), und AskBiz erstellt eine formatierte Nachricht mit dem vollständigen Beleg: Datum, Uhrzeit, Ladenname, jeder Artikel mit Preis und Menge, gewährte Rabatte, Mehrwertsteueraufschlüsselung, Gesamtbetrag und Zahlungsmethode. Die Nachricht wird über das Freigabeprotokoll von WhatsApp versendet, das WhatsApp auf Ihrem Gerät mit der vorformulierten Nachricht öffnet. Ein Tipp genügt zum Senden. Der gesamte Vorgang verlängert die Transaktion um etwa fünf Sekunden — deutlich weniger als das Hantieren mit einem Bondrucker. Da dabei die übliche WhatsApp-Nachrichtenfunktion genutzt wird, muss der Kunde keine spezielle App installieren, kein Konto anlegen und keinen QR-Code scannen. Hat er WhatsApp — und das haben über 75 % der britischen Erwachsenen —, funktioniert es einfach.',
      },
      {
        heading: 'Warum digitale Belege für Ihre Kunden besser sind',
        body: 'Papierbelege haben die Angewohnheit, in der Waschmaschine, im Mülleimer oder am Grund einer Handtasche zu landen, wo sie bis zur Unleserlichkeit verblassen. Ein digitaler Beleg bleibt dauerhaft im WhatsApp-Chat des Kunden erhalten. Muss er drei Wochen später einen Artikel zurückgeben, kann er seine Nachrichten durchsuchen und den Beleg in Sekunden finden. Das reduziert auch bei Ihnen Streitfälle — Sie verbringen weniger Zeit damit, Käufe zu überprüfen, wenn der Kunde bereits einen klaren Nachweis hat. Digitale Belege wirken zudem moderner und professioneller. Für ein kleines, unabhängiges Unternehmen signalisiert ein sauber formatierter WhatsApp-Beleg, dass Sie Ihr Geschäft ernst nehmen und mit ordentlichen Systemen arbeiten. Es ist ein kleines Detail, aber Kunden bemerken es. Manche AskBiz-Nutzer berichten, dass der WhatsApp-Beleg zu einem Gesprächsthema mit Kunden geworden ist — sie schätzen die Bequemlichkeit und fragen, wie es funktioniert.',
      },
      {
        heading: 'Vorteile für Ihr Unternehmen',
        body: 'Über die Bequemlichkeit für Kunden hinaus sparen digitale Belege Geld und liefern Daten. Bonrollen für den Bondrucker sind eine wiederkehrende Kostenposition, die sich über Tausende Transaktionen summiert. Thermopapier lässt sich in den meisten britischen Kommunen nicht recyceln, es gibt also auch eine ökologische Seite. Noch wichtiger: Wenn ein Kunde für einen WhatsApp-Beleg seine Telefonnummer angibt, haben Sie einen Kommunikationskanal. Sie können mit einer Dankesnachricht nachfassen, über Aktionen informieren oder Nachbestellungshinweise für zuvor gekaufte Artikel senden — jeweils im Rahmen der Geschäftsrichtlinien von WhatsApp. AskBiz verfolgt, welche Kunden WhatsApp-Belege erhalten haben, und verknüpft diese Belege mit ihrer Transaktionshistorie, wodurch mit der Zeit ein umfangreicheres Kundenprofil entsteht. Diese Daten fließen in Ihre Kundenanalysen ein und helfen Ihnen, Kaufverhalten und Vorlieben besser zu verstehen.',
      },
      {
        heading: 'WhatsApp-Belege einrichten',
        body: 'Der Einrichtungsaufwand ist minimal. Aktivieren Sie in den POS-Einstellungen WhatsApp-Belege und passen Sie die Belegvorlage mit Ihrem Firmennamen, Ihrer Adresse und einer beliebigen Fußzeile an (etwa Ihre Rückgabebedingungen oder eine Dankesnotiz). Sie können auch Ihr Logo hinzufügen, das dann oben auf dem Beleg erscheint. Beim Abwickeln eines Verkaufs erscheint die WhatsApp-Option neben den anderen Belegmethoden. Möchten Sie WhatsApp als Standard festlegen, können Sie dies in den Einstellungen konfigurieren — der Sendehinweis nutzt dann standardmäßig WhatsApp statt Drucken. Bei Stammkunden merkt sich AskBiz die Telefonnummer, sodass Sie sie nur einmal eingeben müssen. Mitarbeiter aller Rollenstufen (Kassierer, Manager, Inhaber) können WhatsApp-Belege versenden, da dies als Teil des grundlegenden Verkaufsvorgangs gilt.',
      },
    ],
    faq: [
      {
        q: 'Kostet der Versand von WhatsApp-Belegen etwas?',
        a: 'Von AskBiz fallen keine Gebühren an. Es gelten die üblichen WhatsApp-Nachrichtentarife, die für die meisten Nutzer über WLAN oder inklusive Datentarife kostenlos sind. Eine WhatsApp Business API ist nicht erforderlich.',
      },
      {
        q: 'Können Kunden WhatsApp-Belege ablehnen?',
        a: 'Selbstverständlich. Der WhatsApp-Beleg ist immer optional. Möchte ein Kunde keinen digitalen Beleg, können Sie einen ausdrucken, auf dem Bildschirm anzeigen oder ganz auf einen Beleg verzichten.',
      },
      {
        q: 'Ist der Versand eines Belegs per WhatsApp DSGVO-konform?',
        a: 'Ja, sofern Sie eine rechtmäßige Grundlage für die Datenverarbeitung haben. Der Versand eines Belegs ist Teil der Erfüllung des Kaufvertrags. Sie sollten in Ihrem Geschäft oder auf Ihrer Website einen Datenschutzhinweis bereitstellen, der erklärt, wie Kundendaten verwendet werden.',
      },
    ],
  },
  'pos-daily-revenue-tracking': {
    title: 'Tägliche Umsatzverfolgung: Kennen Sie Ihre Zahlen schon vor dem Mittagessen',
    description:
      'Hören Sie auf zu raten, wie viel Sie heute eingenommen haben. AskBiz POS liefert Ihnen live tägliche Umsatzzahlen, die Aufschlüsselung nach Bar- und Kartenzahlung sowie Trendvergleiche.',
    keywords: [
      'tägliche Umsatzverfolgung',
      'Umsatzbericht Kassensystem',
      'täglicher Verkaufsbericht',
      'Umsatzverfolgung Einzelhandel',
      'Tageseinnahmen Kassensystem',
      'Verkaufs-Dashboard Kassensystem',
      'tägliche Verkäufe verfolgen',
    ],
    keyTakeaways: [
      'AskBiz POS zeigt den Live-Tagesumsatz ab dem Moment, in dem Sie den ersten Verkauf des Tages abwickeln.',
      'Der Umsatz wird nach Zahlungsmethode, Mitarbeiter und Produktkategorie aufgeschlüsselt.',
      'Der Vergleich der heutigen Leistung mit demselben Tag der Vorwoche hilft Ihnen, Trends frühzeitig zu erkennen.',
    ],
    content: [
      {
        heading: 'Warum die tägliche Umsatzeinsicht wichtig ist',
        body: 'Im klassischen Einzelhandel kennen viele Ladenbesitzer ihren tatsächlichen Tagesumsatz erst, wenn die Kasse bei Geschäftsschluss gezählt wird. Das sind zwölf Stunden Handel im Blindflug. Mit AskBiz POS aktualisiert sich der Umsatz nach jeder Transaktion in Echtzeit. Am späten Vormittag wissen Sie bereits, ob der heutige Tag über oder unter Ihrem Durchschnitt liegt. Zur Mittagszeit haben Sie genug Daten, um Entscheidungen zu treffen: Sollten Sie eine Nachmittagsaktion starten? Ein sich schleppend verkaufendes Produkt aus dem Schaufenster nehmen? Die Personalbesetzung für den Rest der Schicht anpassen? Diese Art der untertägigen Einsicht war früher großen Handelsketten mit teuren Analyseplattformen vorbehalten. AskBiz bringt sie auf Ihr Smartphone. Die Ansicht zum Tagesumsatz ist nur einen Tipp von der Verkaufsoberfläche entfernt, sodass die Kontrolle Ihrer Zahlen Sekunden statt Minuten dauert.',
      },
      {
        heading: 'Was die Ansicht zum Tagesumsatz zeigt',
        body: 'Die Ansicht zum Tagesumsatz in AskBiz POS zeigt eine laufende Summe aller heute abgewickelten Verkäufe, aufgeschlüsselt nach Zahlungsmethode (Bargeld, Karte oder gemischt). Unter der Summe sehen Sie eine Aufschlüsselung nach Produktkategorie — sodass Sie auf einen Blick erkennen, dass heiße Getränke im Verhältnis zwei zu eins besser laufen als kalte, oder dass sich Accessoires heute schlecht verkaufen. Es gibt außerdem eine Aufschlüsselung nach Mitarbeiter, was unschätzbar wertvoll ist, wenn mehrere Personen an der Kasse arbeiten. Die Ansicht enthält einen Vergleich zum selben Tag der Vorwoche und desselben Tages im Vormonat. Ist heute Dienstag, sehen Sie den Umsatz vom letzten Dienstag neben der heutigen Zahl, was Ihnen sofort Orientierung gibt. Ein grüner Pfeil bedeutet, Sie liegen vorn; ein roter Pfeil bedeutet, Sie liegen zurück. Unten zeigt AskBiz den durchschnittlichen Transaktionswert und die Gesamtzahl der Transaktionen, was Ihnen hilft, zwischen wenigen großen Verkäufen und vielen kleinen zu unterscheiden.',
      },
      {
        heading: 'Tagesdaten für bessere Entscheidungen nutzen',
        body: 'Die eigentliche Stärke der täglichen Umsatzverfolgung liegt nicht nur darin, die Zahl zu kennen — sondern darin, danach zu handeln. Hier ein paar praktische Beispiele. Liegt Ihr Umsatz um 11 Uhr 40 % unter dem der Vorwoche zur gleichen Zeit, hat sich etwas verändert. Ist die Kundenfrequenz gesunken? Hat ein Mitbewerber in der Nähe eröffnet? Hält das Wetter die Leute zu Hause? Sie können nachforschen und reagieren. Hat sich Ihr Verhältnis von Karten- zu Barzahlungen drastisch verschoben, könnte es sich lohnen, das Kartenterminal zu prüfen. Erzielt ein Mitarbeiter durchgängig höhere durchschnittliche Transaktionswerte, können Sie herausfinden, was er anders macht, und andere entsprechend schulen. AskBiz deckt diese Muster automatisch über seine Analysefunktionen auf, doch schon ein kurzer Blick auf die Tagesumsatzansicht verrät Ihnen mehr über die Gesundheit Ihres Unternehmens, als bis zum Monatsende auf Ihre Kontoauszüge zu warten.',
      },
      {
        heading: 'Tagesabschluss und Berichte',
        body: 'Am Ende des Handelstages — oder wann immer Sie sich entscheiden, die Kasse zu schließen — erstellt AskBiz eine umfassende Tagesabschlussübersicht. Sie enthält Gesamtumsatz, Anzahl der Transaktionen, durchschnittlichen Transaktionswert, Aufteilung nach Zahlungsmethode, Umsatz nach Kategorie, Umsatz nach Mitarbeiter, verarbeitete Rückerstattungen und gewährte Rabatte. Sie können diese Übersicht auf dem Bildschirm ansehen, sich selbst per E-Mail zusenden oder als CSV für Ihren Steuerberater exportieren. Verwalten Sie das Bargeld in Ihrer Kasse, kann AskBiz den erwarteten Bargeldbetrag (basierend auf den abgewickelten Barzahlungen) mit Ihrem gezählten Betrag vergleichen, um Abweichungen zu erkennen. Dieser Kassenabschluss dauert Minuten statt der halben Stunde, die viele Händler manuell mit dem Abgleich von Belegen und Kasseninhalt verbringen. Mit der Zeit fließen die Tagesübersichten in wöchentliche und monatliche Trendberichte ein und geben Ihnen ein zunehmend klares Bild von der Entwicklung Ihres Unternehmens.',
      },
    ],
    faq: [
      {
        q: 'Kann ich den Tagesumsatz von meinem Smartphone aus einsehen, wenn ich nicht im Laden bin?',
        a: 'Ja. AskBiz ist cloudbasiert, sodass Sie den Live-Umsatz von jedem Gerät mit Ihrem Login aus einsehen können. Viele Inhaber prüfen die Zahlen abends von zu Hause aus.',
      },
      {
        q: 'Sind Rückerstattungen im Tagesumsatz enthalten?',
        a: 'Rückerstattungen werden von der Tagessumme abgezogen, um den Nettoumsatz anzuzeigen. In der detaillierten Aufschlüsselung sehen Sie zudem Bruttoumsatz und Gesamtrückerstattungen separat.',
      },
    ],
  },
  'pos-inventory-management': {
    title: 'Bestandsverwaltung im Kassensystem: Lagerbestände, Warnungen und Nachbestellung',
    description:
      'Halten Sie Ihre Regale voll und Ihren Cashflow gesund. Erfahren Sie, wie AskBiz POS den Bestand in Echtzeit verfolgt und Ihnen genau sagt, wann Sie nachbestellen sollten.',
    keywords: [
      'Bestandsverwaltung Kassensystem',
      'Bestandsverfolgung POS',
      'Bestandswarnungen',
      'Lagerbestandsverwaltung Einzelhandel',
      'Nachbestellungswarnung',
      'Bestand in Echtzeit',
      'Bestandskontrolle Kleinunternehmen',
    ],
    keyTakeaways: [
      'AskBiz POS reduziert den Bestand bei jedem Verkauf automatisch und hält Ihre Bestandszahlen so in Echtzeit genau.',
      'Sie können für jedes Produkt einen Meldebestand festlegen, damit AskBiz Sie warnt, bevor der Bestand ausgeht.',
      'Genaue Bestandsdaten helfen Ihnen, sowohl Fehlbestände (entgangene Verkäufe) als auch Überbestände (gebundenes Kapital) zu vermeiden.',
    ],
    content: [
      {
        heading: 'So funktioniert die Bestandsverfolgung in Echtzeit',
        body: 'Jedes Mal, wenn Sie in AskBiz POS einen Verkauf abwickeln, werden die verkauften Artikel automatisch von Ihrem Bestand abgezogen. Es gibt keinen manuellen Schritt — in dem Moment, in dem die Transaktion bestätigt wird, aktualisiert sich der Bestand. Verkaufen Sie drei Einheiten von Produkt A, sinkt Ihr Bestand um drei. Wird eine Rückerstattung bearbeitet und der Artikel dem Bestand wieder zugeführt, steigt die Zahl entsprechend. Das geschieht geräteübergreifend gleichzeitig — verkaufen also zwei Personen auf separaten Tablets, sehen beide dieselben aktuellen Bestandszahlen. Diese Genauigkeit ist für kleine Einzelhändler, die traditionell auf regelmäßige Inventuren angewiesen waren, ein echter Fortschritt. Statt erst drei Tage später festzustellen, dass Ihnen der Bestseller ausgegangen ist (und eine unbekannte Anzahl von Verkäufen verpasst zu haben), wissen Sie genau in dem Moment Bescheid, in dem der Bestand null erreicht. Noch besser: Sie können sich schon vorher warnen lassen, bevor es so weit ist.',
      },
      {
        heading: 'Meldebestand und Warnungen einrichten',
        body: 'Der Meldebestand ist die Bestandsmenge, bei der Sie eine neue Bestellung bei Ihrem Lieferanten aufgeben sollten. Die richtige Höhe hängt davon ab, wie schnell sich der Artikel verkauft und wie lange Ihr Lieferant für die Lieferung braucht. Verkaufen Sie beispielsweise zehn Einheiten von Produkt B pro Woche und Ihr Lieferant braucht zwei Wochen für die Lieferung, sollte Ihr Meldebestand mindestens zwanzig Einheiten betragen — zwanzig Einheiten Pufferbestand, um die Lieferzeit zu überbrücken. In AskBiz legen Sie den Meldebestand für jedes Produkt in den Bestandseinstellungen fest. Sinkt der Bestand auf dieses Niveau, erhalten Sie eine Warnung — entweder in der App, per E-Mail oder beides. Sie können außerdem ein kritisches Niveau festlegen (der Punkt, an dem Ihnen der Bestand fast ausgeht), für eine dringendere Benachrichtigung. AskBiz kann Ihnen basierend auf Ihrer historischen Abverkaufsgeschwindigkeit Meldebestände vorschlagen und nimmt Ihnen so das Rätselraten bei der Berechnung ab.',
      },
      {
        heading: 'Wareneingang und Anpassungen',
        body: 'Trifft eine neue Lieferung von Ihrem Lieferanten ein, müssen Sie diese Artikel Ihrem Bestand hinzufügen. Gehen Sie in AskBiz zum Bereich Bestand, suchen Sie das Produkt und tippen Sie auf Wareneingang buchen. Geben Sie die erhaltene Menge und den Einkaufspreis ein (falls sich dieser geändert hat). Der Bestand aktualisiert sich sofort. Stellen Sie bei einer physischen Inventur eine Abweichung fest — vielleicht wurden Artikel beschädigt, gestohlen oder falsch gezählt —, können Sie eine manuelle Bestandsanpassung vornehmen. Geben Sie den Grund für die Anpassung ein (Beschädigung, Diebstahl, Zählfehler), und AskBiz protokolliert die Änderung im Audit-Trail. Diese Anpassungen sind wichtig, um die Genauigkeit zu wahren und Muster zu erkennen: Verzeichnet ein bestimmtes Produkt regelmäßig unerklärliche Bestandsverluste, könnte das auf ein Diebstahlproblem oder ein Verpackungsproblem hindeuten, das zu Beschädigungen führt.',
      },
      {
        heading: 'Bestandsdaten zur Verbesserung des Cashflows nutzen',
        body: 'Bestand ist Kapital, das auf Ihren Regalen liegt. Jedes Produkt, das Sie besitzen, aber noch nicht verkauft haben, bindet Geld, das stattdessen Zinsen erwirtschaften, Schulden abbauen oder Wachstum finanzieren könnte. AskBiz hilft Ihnen, die Balance zu finden zwischen genügend Bestand, um die Nachfrage zu decken, und nicht zu viel gebundenem Kapital. Das Bestands-Dashboard zeigt Ihnen die Abverkaufsraten (wie schnell sich jedes Produkt verkauft), die verbleibenden Tage an Bestand und Ladenhüter (Produkte, die seit dreißig Tagen oder länger nicht verkauft wurden). Hat ein Produkt bei der aktuellen Abverkaufsgeschwindigkeit noch neunzig Tage Bestand, haben Sie mit ziemlicher Sicherheit zu viel bestellt. Hat ein anderes Produkt noch drei Tage Bestand, müssen Sie dringend nachbestellen. AskBiz zeigt Ihnen beide Extreme auf, damit Sie handeln können: Ladenhüter reduzieren, um Kapital freizusetzen, und Nachbestellungen für Ihre Bestseller beschleunigen.',
      },
    ],
    faq: [
      {
        q: 'Kann ich den Bestand für Produkte ohne Barcode verwalten?',
        a: 'Ja. Jedes Produkt in AskBiz hat einen Bestandszähler, unabhängig davon, ob es einen Barcode hat oder nicht. Sie können den Bestand für Artikel mit Barcode, manuell eingegebene Artikel und individuelle Produkte gleichermaßen verfolgen.',
      },
      {
        q: 'Unterstützt AskBiz die Bestandsführung über mehrere Standorte hinweg?',
        a: 'Bestandsführung für mehrere Standorte ist für die Zukunft geplant. Derzeit wird der Bestand auf Kontoebene verfolgt. Betreiben Sie mehrere Standorte, können Sie behelfsweise getrennte Produktkataloge verwenden oder Standort-Tags an Produktnamen anhängen.',
      },
    ],
  },
  'pos-low-stock-alerts': {
    title: 'Warnungen bei niedrigem Bestand und Fehlbestand: Nie wieder eine Nachbestellung verpassen',
    description:
      'Richten Sie automatische Benachrichtigungen ein, wenn der Bestand knapp wird. AskBiz POS warnt Sie, bevor Ihre Bestseller ausgehen.',
    keywords: [
      'Warnung bei niedrigem Bestand',
      'Fehlbestand-Benachrichtigung',
      'Nachbestellungswarnung Kassensystem',
      'Bestandswarnsystem',
      'Warnung bei Bestandsniveau',
      'Nachbestellungsbenachrichtigung',
      'nie mehr ausverkauft',
    ],
    keyTakeaways: [
      'AskBiz POS sendet Warnungen, sobald der Bestand Ihren festgelegten Meldebestand erreicht oder auf null sinkt.',
      'Warnungen können in der App, per E-Mail oder beides zugestellt werden — so verpassen Sie nie eine wichtige Nachbestellung.',
      'Rechtzeitiges Nachbestellen verhindert entgangene Verkäufe und hält die Kundenzufriedenheit hoch.',
    ],
    content: [
      {
        heading: 'Die Kosten eines Fehlbestands',
        body: 'Ein Fehlbestand ist nicht nur ein entgangener Verkauf — er ist eine verpasste Kundenbeziehung. Betritt ein Kunde Ihr Geschäft auf der Suche nach einem bestimmten Produkt und Sie haben es nicht vorrätig, kauft er es woanders. Passiert das zweimal, kommt er gar nicht mehr zu Ihnen. Untersuchungen zeigen immer wieder, dass Fehlbestände einer der Hauptgründe sind, warum Kunden im stationären Handel zur Konkurrenz wechseln. Neben dem direkten Umsatzverlust kommt der Imageschaden hinzu: Ein Geschäft mit leeren Regalen wirkt schlecht geführt. AskBiz POS ist darauf ausgelegt, das zu verhindern, indem es Ihnen Einblick in die Bestandszahlen gibt und Sie warnt, lange bevor der Bestand null erreicht. Das Ziel ist einfach — kein Kunde sollte jemals hören müssen: „Tut mir leid, das haben wir gerade nicht", wenn rechtzeitiges Nachbestellen dies hätte verhindern können.',
      },
      {
        heading: 'So funktionieren Warnungen in AskBiz POS',
        body: 'AskBiz nutzt ein zweistufiges Warnsystem. Die erste Stufe ist die Nachbestellungswarnung, die ausgelöst wird, wenn der Bestand den von Ihnen für dieses Produkt festgelegten Meldebestand erreicht. Das ist Ihr Signal, eine Bestellung bei Ihrem Lieferanten aufzugeben. Der Meldebestand sollte die Lieferzeit Ihres Lieferanten berücksichtigen — dauert die Lieferung fünf Tage und verkaufen Sie zwei Einheiten pro Tag, setzen Sie den Meldebestand auf mindestens zehn. Die zweite Stufe ist die kritische Warnung, die ausgelöst wird, wenn der Bestand ein gefährlich niedriges Niveau erreicht (was „gefährlich niedrig" für jedes Produkt bedeutet, legen Sie selbst fest). Das ist Ihr Signal, dass Ihnen der Bestand gleich ausgeht und Sie entweder eine Bestellung beschleunigen oder das Produkt aus der Auslage nehmen sollten, um den verbleibenden Bestand für wichtige Kunden zu reservieren. Beide Warnungen können als In-App-Benachrichtigungen, per E-Mail oder beides zugestellt werden. Inhaber und Manager erhalten Warnungen standardmäßig; Kassierer nicht, um das Frontpersonal nicht mit Benachrichtigungen zu überlasten.',
      },
      {
        heading: 'Intelligente Nachbestellungsvorschläge',
        body: 'Für jedes Produkt manuell einen Meldebestand festzulegen, ist mühsam, besonders wenn Sie Hunderte von Artikeln führen. AskBiz kann Ihnen basierend auf Ihrer Verkaufshistorie Meldebestände vorschlagen. Es analysiert, wie schnell sich jedes Produkt verkauft (die Abverkaufsgeschwindigkeit), wie sich diese Geschwindigkeit je nach Wochentag oder Saison ändert, und wie lange frühere Nachbestellungen gedauert haben. Aus diesen Daten berechnet AskBiz einen empfohlenen Meldebestand, der das Risiko eines Fehlbestands gegen die Kosten überschüssiger Bestände abwägt. Sie können den Vorschlag übernehmen, anpassen oder Ihr eigenes Niveau festlegen. Für neue Produkte ohne Verkaufshistorie setzt AskBiz standardmäßig auf einen vorsichtigen Meldebestand, den Sie mit zunehmenden Daten verfeinern können. Die Vorschläge verbessern sich mit der Zeit, da AskBiz Ihre Verkaufsmuster und Lieferzeiten der Lieferanten lernt.',
      },
      {
        heading: 'Effizient auf Warnungen reagieren',
        body: 'Eine Warnung ist nur dann nützlich, wenn Sie schnell darauf reagieren. AskBiz erleichtert das, indem jede Warnung mit Kontext versehen ist. Erhalten Sie eine Benachrichtigung über niedrigen Bestand, teilt sie Ihnen den aktuellen Bestand, den durchschnittlichen Tagesumsatz, die geschätzte Anzahl Tage bis zum Fehlbestand und den letzten Einkaufspreis des Produkts mit. Sie haben genug Informationen, um sofort eine Nachbestellung aufzugeben, ohne irgendetwas nachschlagen zu müssen. Nutzen Sie regelmäßig dieselben Lieferanten, können Sie Lieferantenkontakte in AskBiz hinterlegen, sodass ein Tipp auf „Nachbestellen" bei einer Warnung eine Bestellung vorbereitet, die Sie direkt versenden können. Das verkürzt die Zeit von der Warnung bis zur Bestellung von Stunden (oder Tagen, falls die Warnung im Posteingang untergeht) auf Minuten. Je weniger Schritte zwischen Benachrichtigung und Handlung liegen, desto weniger Fehlbestände wird Ihr Unternehmen erleben.',
      },
    ],
    faq: [
      {
        q: 'Kann ich für verschiedene Produkte unterschiedliche Warnschwellen festlegen?',
        a: 'Ja. Jedes Produkt hat seinen eigenen Meldebestand und ein eigenes kritisches Niveau. Ein schnell verkauftes Produkt hat vielleicht einen Meldebestand von fünfzig Einheiten, während er bei einem Ladenhüter auf fünf gesetzt sein könnte.',
      },
      {
        q: 'Funktionieren Warnungen auch, wenn ich nicht im Kassensystem angemeldet bin?',
        a: 'Ja. E-Mail-Warnungen werden unabhängig davon versendet, ob Sie angemeldet sind. In-App-Benachrichtigungen erscheinen, sobald Sie AskBiz das nächste Mal öffnen.',
      },
      {
        q: 'Kann ich Warnungen für bestimmte Produkte deaktivieren?',
        a: 'Ja. Führen Sie Artikel, deren Bestand Sie absichtlich auslaufen lassen (zum Beispiel Saisonprodukte), können Sie Warnungen für diese Artikel einzeln deaktivieren.',
      },
    ],
  },
  'pos-refunds-guide': {
    title: 'Rückerstattungen bearbeiten: Vollständig, teilweise und alles dazwischen',
    description:
      'Rückerstattungen gehören zum Einzelhandelsalltag. Erfahren Sie, wie Sie vollständige und teilweise Rückerstattungen in AskBiz POS bearbeiten und dabei Ihre Aufzeichnungen sauber halten.',
    keywords: [
      'Rückerstattungen Kassensystem',
      'Rückerstattung bearbeiten POS',
      'teilweise Rückerstattung Einzelhandel',
      'vollständige Rückerstattung Leitfaden',
      'AskBiz Rückerstattung',
      'Rückgabe und Rückerstattung POS',
      'Verbraucherrechte Rückerstattung UK',
    ],
    keyTakeaways: [
      'AskBiz POS unterstützt vollständige Rückerstattungen, teilweise Rückerstattungen und Rückerstattungen auf Artikelebene — jeweils mit der ursprünglichen Transaktion verknüpft.',
      'Berechtigungen für Rückerstattungen sind auf die Rollen Manager und Inhaber beschränkt, um Missbrauch zu verhindern.',
      'Jede Rückerstattung wird mit Grund, Betrag, Mitarbeiter und Zeitstempel im Audit-Trail protokolliert.',
    ],
    content: [
      {
        heading: 'Ihre Rückerstattungspflichten im Vereinigten Königreich verstehen',
        body: 'Bevor wir zur praktischen Abwicklung kommen, lohnt es sich, die Rechtslage zu verstehen. Nach dem Consumer Rights Act 2015 (dem britischen Verbraucherschutzgesetz) haben Kunden Anspruch auf eine Rückerstattung, wenn ein Produkt defekt, nicht wie beschrieben oder nicht für den vorgesehenen Zweck geeignet ist. Bei defekten Waren gilt dieses Recht bis zu dreißig Tage für eine vollständige Rückerstattung und bis zu sechs Monate für eine Reparatur oder einen Ersatz (mit Rückerstattung, falls das scheitert). Bei Rückgaben wegen Meinungsänderung — wenn das Produkt in Ordnung ist, der Kunde es sich aber einfach anders überlegt hat — besteht keine gesetzliche Verpflichtung zur Rückerstattung, viele Händler bieten sie jedoch als Kulanzgeste an, um Kundenbindung aufzubauen. AskBiz POS lässt Sie beide Arten von Rückerstattung abwickeln, und Sie können Ihre Rückerstattungsrichtlinie in den Einstellungen konfigurieren, damit Ihr Personal die Regeln kennt, ohne jedes Mal einen Manager fragen zu müssen.',
      },
      {
        heading: 'Eine vollständige Rückerstattung durchführen',
        body: 'Um in AskBiz POS eine vollständige Rückerstattung durchzuführen, gehen Sie zum Bereich Transaktionen und suchen Sie den ursprünglichen Verkauf. Sie können nach Transaktionsnummer, Datum, Kundenname oder den verkauften Artikeln suchen. Sobald Sie die Transaktion gefunden haben, tippen Sie auf Rückerstattung. AskBiz zeigt Ihnen jeden Artikel des ursprünglichen Verkaufs und lässt Sie bestätigen, dass Sie den vollen Betrag erstatten. Wählen Sie die Rückerstattungsmethode — idealerweise dieselbe wie die ursprüngliche Zahlungsmethode (eine Kartenzahlung auf dieselbe Karte zurückzuerstatten, ist bewährte Praxis und wird von Ihrem Zahlungsdienstleister oft vorausgesetzt). Fügen Sie einen Grund für die Rückerstattung hinzu (defekt, nicht gewünscht, doppelte Abbuchung usw.) und bestätigen Sie. Der Rückerstattungsbetrag wird von Ihrem Tagesumsatz abgezogen, die zurückgegebenen Artikel werden (sofern zutreffend) wieder Ihrem Bestand hinzugefügt, und die gesamte Transaktion — ursprünglicher Verkauf und Rückerstattung — wird im Audit-Trail verknüpft, sodass ein lückenloser Nachweis vorliegt.',
      },
      {
        heading: 'Eine teilweise Rückerstattung durchführen',
        body: 'Teilweise Rückerstattungen kommen häufiger vor, als die meisten erwarten. Ein Kunde gibt einen Artikel aus einem Kauf mit drei Artikeln zurück. Ein Produkt hat einen kleinen Mangel, und Sie einigen sich auf 20 % Nachlass statt einer vollständigen Rückgabe. Ein Kunde wurde durch einen Preisfehler zu viel belastet und benötigt die Differenz erstattet. AskBiz deckt all diese Fälle ab. Tippen Sie in der ursprünglichen Transaktion auf Rückerstattung und wählen Sie dann nur die Artikel (oder den bestimmten Betrag) aus, die erstattet werden sollen. Bei einer Rückerstattung auf Artikelebene haken Sie die zurückgegebenen Artikel ab, und AskBiz berechnet den korrekten Betrag einschließlich etwaiger Mehrwertsteueranpassung. Bei einer pauschalen Rückerstattung (wie einem Kulanzrabatt) geben Sie den Betrag manuell ein. Teilweise Rückerstattungen werden mit derselben Detailtiefe wie vollständige erfasst — Grund, Betrag, Mitarbeiter, Zeitstempel und ein Verweis auf die ursprüngliche Transaktion. Ihr Bestand wird nur für Artikel aktualisiert, die tatsächlich zurückgegeben werden; erstatten Sie eine Preisdifferenz, bleibt der Bestand unverändert.',
      },
      {
        heading: 'Rückerstattungsbetrug verhindern',
        body: 'Rückerstattungsbetrug ist eine der häufigsten Verlustquellen im Einzelhandel. Dazu gehören fiktive Rückerstattungen (die Bearbeitung einer Rückerstattung für einen Verkauf, der nie stattgefunden hat), Vetternwirtschaft an der Kasse (die Rückerstattung des Kaufs eines Freundes, damit dieser das Produkt kostenlos erhält) und Retourenbetrug (die Rückgabe eines gebrauchten oder anderen Produkts). AskBiz POS mindert diese Risiken auf mehrere Arten. Erstens müssen Rückerstattungen mit einer ursprünglichen Transaktion verknüpft sein — eine eigenständige Rückerstattung lässt sich nicht erstellen. Zweitens können nur Manager und Inhaber Rückerstattungen bearbeiten; Kassierer nicht, was den häufigsten Angriffsweg beseitigt. Drittens wird jede Rückerstattung mit der Identität des Mitarbeiters, Zeitstempel, Grund und Betrag protokolliert, was sowohl abschreckend wirkt als auch einen lückenlosen Nachweis schafft. Viertens erkennt AskBiz ungewöhnliche Rückerstattungsmuster — etwa eine überproportionale Anzahl von Rückerstattungen durch einen einzelnen Mitarbeiter oder Rückerstattungen, die einen festgelegten Anteil der Tagesverkäufe übersteigen —, damit Sie eingreifen können, bevor sich Verluste anhäufen.',
      },
    ],
    faq: [
      {
        q: 'Kann ein Kassierer eine Rückerstattung bearbeiten?',
        a: 'Nein. Rückerstattungen sind den Rollen Manager und Inhaber vorbehalten. Muss ein Kassierer eine Rückgabe bearbeiten, muss er einen Manager hinzuziehen, der die Rückerstattung genehmigt und abschließt.',
      },
      {
        q: 'Was, wenn ich die ursprüngliche Transaktion nicht finden kann?',
        a: 'AskBiz lässt Sie nach Datum, Produktname, Transaktionsnummer oder Kundendaten suchen. Hat der Kunde einen WhatsApp-Beleg, kann er Ihnen die Transaktions-ID direkt zeigen.',
      },
    ],
  },
  'pos-transaction-amendments': {
    title: 'Transaktionsänderungen und Korrekturen in AskBiz POS',
    description:
      'Fehler bei einem Verkauf passiert? So ändern, korrigieren oder kommentieren Sie Transaktionen in AskBiz POS, ohne Ihren Audit-Trail zu gefährden.',
    keywords: [
      'POS-Transaktionsänderung',
      'Kassenverkauf korrigieren',
      'Transaktion stornieren Kassensystem',
      'Verkauf nach Zahlung bearbeiten',
      'POS-Korrektur',
      'Beleg ändern',
      'Transaktionsfehler beheben',
    ],
    keyTakeaways: [
      'Abgeschlossene Transaktionen in AskBiz POS lassen sich nicht stillschweigend bearbeiten — jede Änderung erzeugt einen sichtbaren Audit-Eintrag.',
      'Die häufigsten Korrekturen sind teilweise Rückerstattungen, Stornierungen (innerhalb eines begrenzten Zeitfensters) und Anmerkungsnotizen.',
      'Dieser Ansatz schützt Ihre Aufzeichnungen im Hinblick auf steuerliche Compliance und Betrugsprävention.',
    ],
    content: [
      {
        heading: 'Warum Transaktionen unveränderlich sind',
        body: 'Ist ein Verkauf in AskBiz POS einmal abgeschlossen, lässt sich der ursprüngliche Transaktionsdatensatz nicht mehr verändern. Das ist keine Einschränkung — das ist ein Merkmal. Unveränderliche Transaktionen bilden die Grundlage eines verlässlichen Audit-Trails. Könnte jemand einen abgeschlossenen Verkauf einfach still bearbeiten — den Betrag ändern, einen Artikel entfernen oder die Zahlungsmethode ändern —, wären Ihre Aufzeichnungen nicht mehr vertrauenswürdig. HMRC erwartet von Unternehmen genaue, manipulationssichere Transaktionsaufzeichnungen, und die Anforderungen von Making Tax Digital verstärken das noch. AskBiz erzwingt die Unveränderlichkeit auf Datenbankebene, sodass nicht einmal die Systemadministratoren eine abgeschlossene Transaktion ändern können. Stattdessen erfolgen Korrekturen durch das Anlegen neuer, verknüpfter Datensätze: Rückerstattungen, Stornierungen und Anmerkungen, die neben dem Original stehen und klar zeigen, was wann und von wem geändert wurde.',
      },
      {
        heading: 'Eine Transaktion stornieren',
        body: 'Eine Stornierung hebt eine Transaktion vollständig auf, so als hätte sie nie stattgefunden. In AskBiz POS ist die Stornierung nur innerhalb eines kurzen Zeitfensters nach Abschluss des Verkaufs möglich — üblicherweise wenige Minuten. Das deckt den Fall ab, dass ein Kassierer versehentlich die Zahlung für die falsche Transaktion bestätigt oder der Kunde sofort merkt, dass er den falschen Artikel genommen hat. Um zu stornieren, gehen Sie zur Transaktion und tippen Sie auf Stornieren. Sie müssen einen Grund angeben (versehentliche Bestätigung, Kunde hat es sich anders überlegt, doppelte Transaktion). Die Stornierung wird verarbeitet, die Artikel werden dem Bestand wieder zugeführt, und sowohl die ursprüngliche Transaktion als auch die Stornierung erscheinen im Audit-Trail. Nach Ablauf des Stornierungsfensters werden Korrekturen stattdessen über den Rückerstattungsprozess abgewickelt. Diese zeitliche Begrenzung besteht, weil Stornierungen mit Kartenzahlungsstornierungen zusammenhängen — je früher Sie eine Kartentransaktion stornieren, desto wahrscheinlicher wird die Rückbuchung als Stornierung statt als Rückerstattung verarbeitet, was für den Kontoauszug des Kunden schneller und sauberer ist.',
      },
      {
        heading: 'Eine Transaktion mit einer Notiz versehen',
        body: 'Manchmal braucht eine Transaktion keine finanzielle Korrektur — sondern nur eine Notiz. Vielleicht hat der Kunde erwähnt, dass er den Artikel später abholen wird. Vielleicht enthielt der Verkauf eine mündliche Vereinbarung über einen künftigen Rabatt. Vielleicht gab es einen ungewöhnlichen Umstand, den Sie für Ihre Unterlagen festhalten möchten. AskBiz erlaubt es Ihnen, jede abgeschlossene Transaktion mit Anmerkungen zu versehen. Tippen Sie auf die Transaktion, tippen Sie auf Notiz hinzufügen und geben Sie Ihre Anmerkung ein. Die Notiz erhält einen Zeitstempel und wird dem Mitarbeiter zugeordnet, der sie verfasst hat. Anmerkungen ändern nichts am finanziellen Datensatz — sie sind ergänzende Informationen. Sie sind in der Transaktionsdetailansicht und im Audit-Trail sichtbar und lassen sich durchsuchen, was nützlich ist, wenn ein Kunde Wochen später anruft und Sie den Kontext seines Kaufs nachvollziehen müssen.',
      },
      {
        heading: 'Häufige Korrekturszenarien und wie Sie damit umgehen',
        body: 'Falscher berechneter Preis: Führen Sie eine teilweise Rückerstattung für die Differenz durch, falls Sie zu viel berechnet haben, oder vermerken Sie die zu niedrige Berechnung und passen Sie die Preisgestaltung für künftige Verkäufe an. Falsches Produkt gescannt: Stornieren Sie die Transaktion, falls Sie noch im Stornierungsfenster sind; andernfalls erstatten Sie den falschen Artikel und wickeln einen neuen Verkauf für den richtigen ab. Zahlungsmethode falsch erfasst: Fügen Sie eine Anmerkung mit der korrekten Zahlungsmethode hinzu. Das wirkt sich nicht auf Ihre Umsatzzahl aus, korrigiert aber die Aufschlüsselung der Zahlungsmethoden in Ihren Berichten. Kundenreklamation: Erhebt ein Kunde den Anspruch, für einen Artikel belastet worden zu sein, den er nicht erhalten hat, prüfen Sie die Transaktion, sehen Sie sich gegebenenfalls relevante Videoaufnahmen an und führen Sie bei berechtigtem Anspruch eine Rückerstattung durch. Der Audit-Trail liefert einen klaren Nachweis, falls sich die Reklamation ausweitet. In jedem Fall gilt derselbe Grundsatz: Ändern Sie niemals den ursprünglichen Datensatz. Legen Sie stattdessen einen neuen Datensatz an (Rückerstattung, Stornierung oder Anmerkung), der die Situation transparent korrigiert.',
      },
    ],
    faq: [
      {
        q: 'Kann ich die Zahlungsmethode bei einem abgeschlossenen Verkauf ändern?',
        a: 'Sie können die Zahlungsmethode bei einer abgeschlossenen Transaktion nicht ändern, aber Sie können eine Anmerkung mit der korrekten Methode hinzufügen. Für Berichtszwecke liefert die Anmerkung die Korrektur.',
      },
      {
        q: 'Wie lange habe ich Zeit, eine Transaktion zu stornieren?',
        a: 'Das Stornierungsfenster ist konfigurierbar, beträgt aber standardmäßig wenige Minuten nach Abschluss des Verkaufs. Danach werden Korrekturen über den Rückerstattungsprozess abgewickelt.',
      },
    ],
  },
}
