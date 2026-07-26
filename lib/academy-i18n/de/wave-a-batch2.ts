// Academy article translations — Deutsch (de) — Wave A, batch 2.
//
// POS compliance/ops + BI-integration + multi-location cluster:
// pos-vat-calculations, pos-audit-trail, pos-30-day-export,
// pos-multi-staff-performance, pos-security-best-practices,
// pos-pwa-mobile-setup, pos-troubleshooting, pos-data-in-dashboards,
// pos-ai-chat-questions, pos-daily-brief-integration,
// pos-business-pulse-impact, pos-offline-mode,
// multi-location-retail-management.
//
// Translated fields only (title, description, keywords, content,
// keyTakeaways, faq) — see lib/academy-i18n/README.md for the contract.
// slug/category/categorySlug/difficulty/readTime/relatedSlugs/videoUrl are
// intentionally absent; those stay canonical/English from lib/academy-content.ts.
//
// GLOSSARY — reused verbatim from de/wave-a-batch1.ts (locked, do not deviate):
//   POS system / point of sale -> Kassensystem (product name "AskBiz POS" stays untranslated)
//   profit -> Gewinn | margin -> Marge | revenue -> Umsatz
//   stock / inventory -> Bestand (inventory management -> Bestandsverwaltung; always "Bestand", never "Lagerbestand")
//   cashier (role) -> Kassierer | manager (role) -> Manager | owner (role) -> Inhaber
//   receipt -> Beleg (receipt printer -> Bondrucker; till receipt roll -> Bonrolle)
//   refund -> Rückerstattung | void -> stornieren/Stornierung
//   VAT/tax -> Mehrwertsteuer (MwSt.) | dashboard -> Dashboard (kept, loanword)
//   staff -> Mitarbeiter (individual) / Personal (collective)
//   low-stock alert -> Bestandswarnung | "low stock" (adjective) -> niedriger Bestand
//   purchase order / reorder -> Bestellung/Nachbestellung | reorder point -> Meldebestand
//   discount -> Rabatt | shopping cart -> Warenkorb | transaction -> Transaktion | sale (event) -> Verkauf
//   audit trail -> Audit-Trail (kept, established compliance loanword)
//   till/cash register -> Kasse | checkout flow/sale process -> Kassiervorgang
//   barcode -> Barcode (kept) | stock take -> Inventur
//   receive stock (goods-in) -> Wareneingang buchen | stockout -> Fehlbestand | dead stock -> Ladenhüter
//
// Style: German number conventions (decimal comma, thousands point); currency
// symbol after the number with a space; „…" typographic quotes; UK legal/
// institutional proper nouns (HMRC, Making Tax Digital, GDPR) kept in English
// with a short German gloss on first use where helpful; WhatsApp, CSV, PWA,
// GDPR kept as-is.
//
// Merge this into lib/academy-i18n/de/index.ts's `translations` export
// (spread alongside any other de batches) — not done here per instructions.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch2Translations: LocaleTranslations = {
  'pos-vat-calculations': {
    title: 'Mehrwertsteuer-Berechnung und Steuer-Compliance bei Kassentransaktionen',
    description:
      'Stimmen Sie die Mehrwertsteuer schon beim ersten Verkauf. AskBiz POS berechnet die MwSt. bei jeder Transaktion automatisch und hält Sie Making-Tax-Digital-fähig.',
    keywords: [
      'MwSt.-Berechnung Kassensystem',
      'Mehrwertsteuer-Compliance Kasse',
      'Making Tax Digital Kassensystem',
      'MwSt.-Satz Einzelhandel',
      'automatische Mehrwertsteuer-Berechnung',
      'Kassen-Steuerbericht UK',
      'Preise inklusive Mehrwertsteuer',
    ],
    keyTakeaways: [
      'AskBiz POS berechnet die Mehrwertsteuer bei jedem Verkauf automatisch anhand des dem Produkt zugewiesenen MwSt.-Satzes.',
      'Produkte können auf den Regelsatz (20 %), den ermäßigten Satz (5 %), den Nullsatz (0 %) oder steuerbefreit gesetzt werden — AskBiz berechnet gemischte Warenkörbe korrekt.',
      'MwSt.-Daten auf Transaktionsebene fließen direkt in Ihre Berichte ein und vereinfachen so Making-Tax-Digital-Meldungen.',
    ],
    content: [
      {
        heading: 'Wie AskBiz POS mit der Mehrwertsteuer umgeht',
        body: 'Wenn Sie ein Produkt in Ihren AskBiz-Katalog aufnehmen, weisen Sie ihm einen MwSt.-Satz zu: Regelsatz (20 %), ermäßigt (5 %), Nullsatz (0 %) oder steuerbefreit. Ab diesem Zeitpunkt wird bei jedem Verkauf dieses Produkts die Mehrwertsteuer automatisch berechnet. Kauft ein Kunde drei Artikel mit unterschiedlichen MwSt.-Sätzen — etwa ein regelbesteuertes Gerät, einen ermäßigt besteuerten Kindersitz und ein nullbesteuertes Buch —, berechnet AskBiz die korrekte MwSt. für jeden Artikel und zeigt eine kombinierte MwSt.-Aufschlüsselung auf dem Beleg. Während des Verkaufs müssen Sie sich darüber keine Gedanken machen; das System übernimmt das im Hintergrund. Der Beleg zeigt Nettobetrag, MwSt.-Betrag und Bruttosumme — genau das, was Ihre mehrwertsteuerpflichtigen Kunden für ihre eigenen Unterlagen benötigen. Bei Preisen inklusive Mehrwertsteuer (bei denen der ausgezeichnete Preis bereits die MwSt. enthält) rechnet AskBiz Nettobetrag und MwSt.-Anteil nach der Standardformel zurück.',
      },
      {
        heading: 'Preise inklusive vs. exklusive Mehrwertsteuer',
        body: 'Im britischen Einzelhandel werden Verbraucherpreise fast immer inklusive Mehrwertsteuer angezeigt — der Preis auf dem Regal ist der Preis, den der Kunde zahlt, mit eingerechneter MwSt. AskBiz POS unterstützt beide Modelle. Für den Verbraucherhandel legen Sie Ihre Produkte auf MwSt.-inklusive Preise fest, und AskBiz zeigt dem Kunden den vollen Preis an, während Nettobetrag und MwSt.-Anteil im Hintergrund getrennt erfasst werden. Für Gewerbe- oder Großhandelskunden, die den Nettopreis sehen müssen, können Sie auf MwSt.-exklusive Preise umstellen, bei denen der angezeigte Preis vor Steuern liegt und das System die MwSt. an der Kasse hinzurechnet. Sie können sogar im Mischbetrieb arbeiten — MwSt.-inklusive für Laufkundschaft und MwSt.-exklusive für Gewerbekonten —, indem Sie die Anzeigeeinstellung pro Kunde oder pro Transaktion konfigurieren. Diese Flexibilität ist besonders nützlich für Betriebe, die von denselben Räumlichkeiten aus sowohl Endkunden als auch Gewerbekunden bedienen.',
      },
      {
        heading: 'Making Tax Digital und Ihre Kassendaten',
        body: 'Making Tax Digital (MTD) ist das Programm von HMRC (der britischen Steuerbehörde), die Steuerverwaltung zu digitalisieren. Wenn Sie umsatzsteuerpflichtig sind, sind Sie bereits verpflichtet, digitale Aufzeichnungen zu führen und Ihre Mehrwertsteuererklärungen über MTD-kompatible Software einzureichen. AskBiz POS erstellt automatisch digitale Aufzeichnungen für jede Transaktion, sodass Ihre Kassendaten von Natur aus MTD-fähig sind. Jeder Verkauf erfasst Datum, Nettobetrag, MwSt.-Satz, MwSt.-Betrag und Bruttosumme. Diese Aufzeichnungen werden digital gespeichert, mit Zeitstempel versehen und können nicht verändert werden (dank des unveränderlichen Transaktionsmodells) — das erfüllt alle Anforderungen von HMRC. Wenn es Zeit für Ihre Mehrwertsteuererklärung ist, können Sie Ihre Kassendaten exportieren und in Ihre MTD-kompatible Buchhaltungssoftware importieren. AskBiz liefert die Daten im richtigen Format und reduziert so manuelle Eingaben und die damit verbundenen Fehler.',
      },
      {
        heading: 'Häufige Mehrwertsteuer-Fallstricke für Kassennutzer',
        body: 'Der häufigste Fehler ist die falsche Zuordnung des MwSt.-Satzes zu einem Produkt. Im Vereinigten Königreich sind die Regeln detailliert und mitunter kontraintuitiv — ein einfacher Keks ist beispielsweise nullbesteuert, ein schokoladenüberzogener Keks jedoch regelbesteuert. Warmes Essen zum Mitnehmen unterliegt dem Regelsatz, kaltes Essen zum Mitnehmen ist in der Regel nullbesteuert. Kinderkleidung ist nullbesteuert, Erwachsenenkleidung dagegen regelbesteuert. Wenn Sie sich bei der steuerlichen Behandlung eines Produkts unsicher sind, prüfen Sie den HMRC-Leitfaden für Ihre Branche oder fragen Sie Ihren Steuerberater. Ein Fehler kann zu einer Unter- oder Überzahlung der Mehrwertsteuer führen — beides schafft Probleme. AskBiz erlaubt Ihnen, MwSt.-Sätze im Bulk-Verfahren zu aktualisieren, falls Sie einen Fehler entdecken, und die Anpassung wird im nächsten Berichtszeitraum berücksichtigt. Entscheidend ist, die Sätze von Anfang an korrekt zu setzen und sie zu überprüfen, sobald HMRC die Regeln ändert.',
      },
    ],
    faq: [
      {
        q: 'Muss ich mehrwertsteuerpflichtig sein, um AskBiz POS zu nutzen?',
        a: 'Nein. Wenn Sie nicht mehrwertsteuerpflichtig sind, können Sie alle Produkte auf 0 % MwSt. setzen, und AskBiz fügt keine Steuer hinzu. Sobald Sie sich für die Mehrwertsteuer registrieren, aktualisieren Sie einfach Ihre Produkt-MwSt.-Sätze.',
      },
      {
        q: 'Kann AskBiz meine Mehrwertsteuererklärung direkt bei HMRC einreichen?',
        a: 'AskBiz liefert die Transaktionsdaten, die Sie für Ihre Mehrwertsteuererklärung benötigen. Die Erklärung reichen Sie über Ihre MTD-kompatible Buchhaltungssoftware ein. Eine direkte Einreichung bei HMRC aus AskBiz heraus ist für die Zukunft geplant.',
      },
    ],
  },

  'pos-audit-trail': {
    title: 'Audit-Trails: Jede Transaktion nachvollziehbar und fälschungssicher',
    description:
      'AskBiz POS führt einen vollständigen, unveränderlichen Audit-Trail für jeden Verkauf, jede Rückerstattung, jede Stornierung und jede Änderung. Hier erfahren Sie, warum das wichtig ist und wie Sie ihn nutzen.',
    keywords: [
      'Kassen-Audit-Trail',
      'Transaktionsprotokoll',
      'fälschungssichere Aufzeichnungen',
      'Kassen-Compliance',
      'Audit-Trail Einzelhandel',
      'Transaktionshistorie Kassensystem',
      'HMRC-Prüfung Kassensystem',
    ],
    keyTakeaways: [
      'Jede Aktion in AskBiz POS — Verkäufe, Rückerstattungen, Stornierungen, Preisänderungen, Personalwechsel — wird in einem unveränderlichen Audit-Trail protokolliert.',
      'Audit-Trails schützen Sie bei HMRC-Prüfungen, Betrugsermittlungen und Kundenreklamationen.',
      'Sie können Audit-Trail-Daten für jeden Zeitraum durchsuchen, filtern und exportieren.',
    ],
    content: [
      {
        heading: 'Was ein Audit-Trail ist und warum er wichtig ist',
        body: 'Ein Audit-Trail ist eine chronologische Aufzeichnung jedes Ereignisses in Ihrem Kassensystem. Bei AskBiz umfasst das Verkäufe, Rückerstattungen, Stornierungen, Preisänderungen, Rabattanwendungen, Bestandsanpassungen, Mitarbeiter-Logins, Rollenänderungen und Konfigurationsänderungen. Jeder Eintrag erfasst, was passiert ist, wann es passiert ist und wer es getan hat. Der Trail ist unveränderlich — Einträge können nicht bearbeitet oder gelöscht werden, auch nicht vom Kontoinhaber. Das ist aus drei Gründen wichtig. Erstens Compliance: HMRC kann bei einer Mehrwertsteuerprüfung Ihre Transaktionsaufzeichnungen anfordern, und ein lückenloser, fälschungssicherer Audit-Trail ist der Goldstandard als Nachweis. Zweitens Betrugsprävention: Werden fiktive Rückerstattungen verbucht oder Preise unangemessen überschrieben, deckt der Audit-Trail das auf. Drittens Streitbeilegung: Behauptet ein Kunde, überhöht belastet worden zu sein oder einen Artikel nicht erhalten zu haben, liefert der Audit-Trail die Fakten, um die Situation fair und schnell zu klären.',
      },
      {
        heading: 'Was in AskBiz POS protokolliert wird',
        body: 'AskBiz protokolliert mehr als nur finanzielle Transaktionen. Hier eine nicht abschließende Liste der im Audit-Trail erfassten Ereignisse. Verkäufe: jeder verkaufte Artikel, der Preis, die Menge, die MwSt., die Zahlungsmethode, der Mitarbeiter und der Zeitstempel. Rückerstattungen und Stornierungen: die Referenz zur ursprünglichen Transaktion, der Rückerstattungsbetrag, der Grund und der autorisierende Mitarbeiter. Preisänderungen: der ursprüngliche Preis, der geänderte Preis und der Grund. Rabatte: die Art des Rabatts (prozentual oder fest), der Betrag und ob er auf einen Artikel oder den gesamten Warenkorb angewendet wurde. Bestandsanpassungen: das Produkt, die alte Menge, die neue Menge und der Grund für die Anpassung. Mitarbeiterereignisse: An- und Abmeldungen, Rollenänderungen und neue Mitarbeitereinladungen. Konfigurationsänderungen: Beleg-Einstellungen, Warnschwellen und Änderungen der Zahlungsmethoden. Jeder Eintrag enthält einen sekundengenauen Zeitstempel und die Identität des ausführenden Nutzers.',
      },
      {
        heading: 'So nutzen Sie den Audit-Trail',
        body: 'Der Audit-Trail ist im Bereich Berichte in AskBiz POS zugänglich. Sie können nach Zeitraum, Ereignistyp, Mitarbeiter oder Produkt filtern. Typische Anwendungsfälle sind die Untersuchung einer Kassendifferenz (nach Datum filtern und nach Stornierungen, Rückerstattungen und Preisänderungen suchen), die Überprüfung der Aktivität eines Mitarbeiters (nach Mitarbeiter-ID filtern, um jede von ihm ausgeführte Aktion zu sehen) und die Vorbereitung auf eine Steuerprüfung (den vollständigen Trail für den relevanten Zeitraum exportieren). Mit der Suchfunktion finden Sie bestimmte Transaktionen nach Betrag, Produktname oder Transaktions-ID. Für das Tagesgeschäft ist der wertvollste Filter „Ausnahmen" — Ereignisse, die vom normalen Muster abweichen, etwa ungewöhnlich hohe Rabatte, Rückerstattungen oberhalb eines Schwellenwerts oder Stornierungen während unbeaufsichtigter Zeiten. AskBiz kann diese Ausnahmen automatisch hervorheben, sodass Sie nicht Hunderte routinemäßiger Transaktionen manuell durchsehen müssen, um die wenigen zu finden, die Aufmerksamkeit verdienen.',
      },
      {
        heading: 'Audit-Trail und HMRC-Compliance',
        body: 'Führt HMRC eine Compliance-Prüfung Ihres Unternehmens durch, wird sie Ihre Transaktionsaufzeichnungen sehen wollen. Die konkreten Anforderungen hängen von Ihrer Situation ab, aber generell erwartet HMRC digitale Aufzeichnungen aller Verkäufe und Einkäufe mit klar ausgewiesenen MwSt.-Beträgen. Ein AskBiz-Audit-Trail erfüllt diese Anforderungen umfassend. Jede Transaktion ist digital, mit Zeitstempel versehen, MwSt.-detailliert und mit der Zahlungsmethode verknüpft. Rückerstattungen und Stornierungen sind mit Gründen und Autorisierungen dokumentiert. Bestandsanpassungen sind erklärt. Die Daten können in Standardformaten (CSV, Excel) für die Einreichung oder Prüfung exportiert werden. Diese Dokumentationstiefe erfüllt nicht nur Compliance-Anforderungen — sie positioniert Ihr Unternehmen günstig. Ein gut geführter, fälschungssicherer Audit-Trail signalisiert HMRC, dass Sie Ihre Buchführung ernst nehmen, was Prüfungen kürzer und weniger konfliktreich machen kann.',
      },
    ],
    faq: [
      {
        q: 'Kann ich Einträge aus dem Audit-Trail löschen?',
        a: 'Nein. Der Audit-Trail ist konstruktionsbedingt unveränderlich. Einträge können nicht bearbeitet oder gelöscht werden, auch nicht vom Kontoinhaber. Das schützt die Integrität Ihrer Aufzeichnungen.',
      },
      {
        q: 'Wie weit zurück reicht der Audit-Trail?',
        a: 'AskBiz bewahrt Ihren vollständigen Audit-Trail auf, solange Ihr Konto aktiv ist. HMRC verlangt, dass Unternehmen Aufzeichnungen mindestens sechs Jahre lang aufbewahren, und AskBiz übertrifft diese Anforderung.',
      },
    ],
  },

  'pos-30-day-export': {
    title: '30 Tage Kassendaten für Ihren Steuerberater exportieren',
    description:
      'Müssen Sie Ihre Kassendaten an Ihren Steuerberater senden? Mit AskBiz POS exportieren Sie 30 Tage Transaktionsdaten in Sekunden — so geht’s.',
    keywords: [
      'Kassendaten exportieren',
      'Kassentransaktionen exportieren',
      'Steuerberater Kassendaten',
      '30-Tage-Export',
      'CSV-Export Kassensystem',
      'Kassenberichte exportieren',
      'Kassendaten herunterladen',
    ],
    keyTakeaways: [
      'AskBiz POS lässt Sie mit wenigen Klicks bis zu 30 Tage Transaktionsdaten im CSV- oder Excel-Format exportieren.',
      'Der Export enthält jeden Verkauf, jede Rückerstattung und jede Stornierung mit vollständigen MwSt.-Aufschlüsselungen — alles, was Ihr Steuerberater benötigt.',
      'Regelmäßige Exporte machen Buchhaltung, Mehrwertsteuererklärungen und Jahresabschlüsse erheblich einfacher.',
    ],
    content: [
      {
        heading: 'Warum regelmäßige Exporte wichtig sind',
        body: 'Selbst bei einem perfekt gepflegten Kassensystem braucht Ihr Steuerberater die Rohdaten. Er gleicht Ihre Kassentransaktionen mit Ihren Kontoauszügen ab, erstellt Ihre Mehrwertsteuererklärungen und Ihren Jahresabschluss. Je leichter Sie ihm den Zugriff auf saubere, detaillierte Transaktionsdaten machen, desto weniger Zeit verbringt er (und desto weniger berechnet er Ihnen). Viele kleine Einzelhändler übergeben ihrem Steuerberater immer noch eine Tüte Papierbelege und eine handgeschriebene Zusammenfassung am Ende jedes Quartals. Das führt zu stundenlanger manueller Dateneingabe, unvermeidlichen Fehlern und einer höheren Rechnung. Mit AskBiz POS exportieren Sie einen vollständigen Datensatz über jede Transaktion — komplett mit Datum, Beträgen, MwSt.-Aufschlüsselungen, Zahlungsmethoden und Rückerstattungsdetails — in weniger als einer Minute. Ihr Steuerberater erhält, was er braucht, Sie sparen Geld, und die Zahlen stimmen.',
      },
      {
        heading: 'Was der Export enthält',
        body: 'Ein AskBiz-POS-Datenexport enthält jede Transaktion, die innerhalb des von Ihnen gewählten Zeitraums verarbeitet wurde. Für jeden Verkauf erfasst der Export Datum und Uhrzeit, Transaktions-ID, verkaufte Artikel (mit Einzelpreisen und Mengen), angewendete Rabatte, MwSt.-Satz und -Betrag pro Artikel, Netto-Gesamtbetrag, Gesamt-MwSt., Brutto-Gesamtbetrag, Zahlungsmethode und den Mitarbeiter, der den Verkauf abgewickelt hat. Rückerstattungen und Stornierungen werden separat mit Verweisen auf die ursprünglichen Transaktionen aufgeführt, sodass Ihr Steuerberater leicht abgleichen kann. Der Export enthält außerdem ein Übersichtsblatt mit Summen: Gesamtumsatz (netto und brutto), gesamte eingezogene MwSt., gesamte Rückerstattungen, gesamte Rabatte und Transaktionsanzahl nach Zahlungsmethode. Diese Übersicht reicht für die routinemäßige Buchhaltung oft aus; die zeilengenauen Details sind für tiefere Abgleiche oder Rückfragen von HMRC da.',
      },
      {
        heading: 'So führen Sie einen Export durch',
        body: 'Gehen Sie in AskBiz POS zu Berichte und tippen Sie auf Daten exportieren. Wählen Sie Ihren Zeitraum — Sie können jeden Zeitraum bis zu dreißig Tagen wählen. Für die meisten Betriebe funktioniert ein monatlicher Export (der den Kalendermonat abdeckt) gut. Wählen Sie Ihr Format: CSV ist am universellsten kompatibel und lässt sich in Excel, Google Sheets oder in Buchhaltungssoftware importieren. Das Excel-Format enthält Formatierung und das Übersichtsblatt. Tippen Sie auf Exportieren, und die Datei wird innerhalb von Sekunden erstellt. Sie können sie direkt auf Ihr Gerät herunterladen, sich selbst per E-Mail zusenden oder mit Ihrem Steuerberater über den gewohnten Weg teilen. Bevorzugt Ihr Steuerberater ein anderes Format oder Layout, ist die CSV-Datei flexibel genug, um in jedem Tabellenkalkulationsprogramm angepasst zu werden. Manche AskBiz-Nutzer stellen sich eine monatliche Erinnerung, um ihre Daten am Ersten jedes Monats zu exportieren und so den Vormonat abzudecken.',
      },
      {
        heading: 'Tipps für eine reibungslose Übergabe an Ihren Steuerberater',
        body: 'Ein paar einfache Praktiken machen den Datenexport noch wertvoller. Erstens: Seien Sie beim Exportzeitplan konsequent. Monatliche Exporte im Einklang mit Ihren Mehrwertsteuer-Zeiträumen halten alles synchron. Zweitens: Benennen Sie Ihre Dateien klar — „AskBiz-POS-Januar-2026.csv" ist besser als „export(3).csv". Drittens: Fügen Sie jedem Export einen kurzen Hinweis auf Besonderheiten bei — eine große Rückerstattung, eine Bestandsanpassung, die die Wareneinstandskosten betrifft, oder eine Änderung der MwSt.-Sätze. Viertens: Nutzt Ihr Steuerberater bestimmte Software (Xero, QuickBooks, FreeAgent), fragen Sie, welches Importformat bevorzugt wird — AskBiz exportiert möglicherweise bereits in einem kompatiblen Layout. Schließlich: Bewahren Sie ein lokales Backup jedes Exports auf. Auch wenn AskBiz Ihre Daten sicher in der Cloud speichert, gibt Ihnen eine lokale Kopie auf Ihrem eigenen Laufwerk eine zusätzliche Absicherung und ermöglicht es Ihnen, Daten bei Bedarf jederzeit erneut zu senden.',
      },
    ],
    faq: [
      {
        q: 'Kann ich mehr als 30 Tage auf einmal exportieren?',
        a: 'Der Standardexport deckt bis zu 30 Tage ab. Für längere Zeiträume führen Sie mehrere Exporte durch oder wenden sich für einen individuellen Datenauszug an den Support.',
      },
      {
        q: 'Ist der Export mit Xero und QuickBooks kompatibel?',
        a: 'Der CSV-Export kann in die meisten Buchhaltungsprogramme importiert werden, einschließlich Xero und QuickBooks. Prüfen Sie den Importleitfaden Ihrer Software auf spezifische Formatierungsanforderungen.',
      },
    ],
  },

  'pos-multi-staff-performance': {
    title: 'Mitarbeiter-Kennzahlen: Verkäufe nach Kassierer, Umsatz nach Rolle',
    description:
      'Verfolgen Sie, welche Mitarbeiter am meisten verkaufen, den höchsten Umsatz erzielen und die wenigsten Fehler machen — alles direkt im AskBiz-POS-Dashboard.',
    keywords: [
      'Mitarbeiterleistung Kassensystem',
      'Verkäufe nach Kassierer',
      'Umsatz nach Mitarbeiter',
      'Kassensystem Mitarbeiter-Kennzahlen',
      'Mitarbeiterleistung Einzelhandel',
      'Kassierer-Leistung verfolgen',
      'Einzelhandels-KPI Personal',
    ],
    keyTakeaways: [
      'AskBiz POS ordnet jede Transaktion dem verarbeitenden Mitarbeiter zu und ermöglicht so individuelle Leistungsverfolgung.',
      'Zu den wichtigsten Kennzahlen zählen Transaktionen pro Stunde, durchschnittlicher Transaktionswert, Rückerstattungsquote und Gesamtumsatz pro Mitarbeiter.',
      'Mitarbeiterleistungsdaten helfen Ihnen bei der Schichtplanung, beim Erkennen von Schulungsbedarf und beim Belohnen von Top-Performern.',
    ],
    content: [
      {
        heading: 'Warum die Mitarbeiterleistung zu verfolgen wichtig ist',
        body: 'In einem Einzelunternehmen wissen Sie genau, wie Sie abschneiden. Sobald Sie Personal einstellen, sinkt die Übersicht. Sie kennen die Gesamtzahlen des Geschäfts, aber nicht, wer was beiträgt. Ohne individuelle Leistungsdaten können Sie wichtige Fragen nicht beantworten: Ist der neue Mitarbeiter eingearbeitet? Verkauft ein Kassierer konstant mehr als ein anderer — und wenn ja, was macht er anders? Sind die Rückerstattungsquoten in bestimmten Schichten höher? AskBiz POS beantwortet all das, indem jede Transaktion dem verarbeitenden Mitarbeiter zugeordnet wird. Mit der Zeit entsteht so ein detailliertes Bild des Beitrags jeder Person. Es geht dabei nicht um Überwachung — es geht darum, Ihr Team zu verstehen, Stärken zu erkennen, die sich vervielfachen lassen, Lücken zu identifizieren und fundierte Entscheidungen über Planung, Schulung und Belohnung zu treffen.',
      },
      {
        heading: 'Wichtige Kennzahlen, die AskBiz pro Mitarbeiter erfasst',
        body: 'AskBiz POS erfasst mehrere Leistungskennzahlen für jeden Mitarbeiter. Der Gesamtumsatz ist die naheliegendste Kennzahl — wie viel hat diese Person über die Kasse abgewickelt? Aber sie ist nicht immer die aussagekräftigste. Transaktionen pro Stunde misst den Durchsatz — ein Kassierer, der dreißig Transaktionen pro Stunde abwickelt, leert die Schlange schneller als einer, der fünfzehn schafft. Der durchschnittliche Transaktionswert (ATV) zeigt, wer höherwertige Warenkörbe verkauft, was auf erfolgreiches Upselling hindeuten kann. Die Rückerstattungsquote pro Mitarbeiter deckt mögliche Schulungsbedarfe oder, in seltenen Fällen, Betrug auf. Die Rabattquote pro Mitarbeiter zeigt, wer wie häufig Rabatte anwendet. Artikel pro Transaktion zeigt die Warenkorbgröße. AskBiz stellt diese Kennzahlen in einem übersichtlichen Dashboard dar und vergleicht Mitarbeiter für jeden von Ihnen gewählten Zeitraum nebeneinander. Sie können die Daten nach Tag, Woche oder Monat ansehen.',
      },
      {
        heading: 'Leistungsdaten konstruktiv nutzen',
        body: 'Die erfolgreichsten AskBiz-Nutzer behandeln Mitarbeiterleistungsdaten als Coaching-Werkzeug, nicht als Druckmittel. Liegt der ATV eines Kassierers konstant 30 % über dem Durchschnitt, gehen Sie den Daten auf den Grund. Empfiehlt diese Person ergänzende Produkte? Begrüßt sie Kunden auf eine Weise, die zum Stöbern einlädt? Teilen Sie solche Verhaltensweisen mit dem Team. Ist die Rückerstattungsquote eines Kassierers ungewöhnlich hoch, führen Sie zunächst ein unterstützendes Gespräch, bevor Sie vom Schlimmsten ausgehen — vielleicht bearbeitet er Retouren aus den Schichten anderer Mitarbeiter, oder es gibt ein Qualitätsproblem bei den Produkten, die er am häufigsten verkauft. Für Planungsentscheidungen sind Leistungsdaten unschätzbar wertvoll. Setzen Sie Ihre stärksten Verkäufer während der Stoßzeiten ein. Hat ein neueres Teammitglied einen geringeren Durchsatz, stellen Sie es in geschäftigen Zeiten lieber einem erfahrenen Kassierer zur Seite, statt es während eines Samstagansturms allein zu lassen.',
      },
      {
        heading: 'Datenschutz, Fairness und rechtliche Aspekte',
        body: 'Die Verfolgung der Mitarbeiterleistung wirft berechtigte Fragen zu Datenschutz und Fairness auf. Im Vereinigten Königreich sind Sie verpflichtet, Mitarbeiter darüber zu informieren, welche Daten über sie erfasst werden und wie sie verwendet werden. Dies sollte in Ihrem Arbeitsvertrag oder Mitarbeiterhandbuch geregelt sein. AskBiz erfasst arbeitsbezogene Kennzahlen während der Arbeitszeit — es überwacht keine persönlichen Aktivitäten, keinen Standort und nichts außerhalb des Kassensystems. Seien Sie transparent mit Ihrem Team darüber, welche Kennzahlen Sie einsehen und warum. Viele Einzelhändler teilen Leistungsdashboards offen, was eine Kultur gesunder Verantwortlichkeit statt heimlicher Überwachung schafft. Nutzen Sie Leistungsdaten für arbeitsrechtliche Entscheidungen (etwa Kündigung oder Beförderung), stellen Sie sicher, dass diese konsistent, dokumentiert und auf Basis einer fairen Datenmenge getroffen werden, nicht anhand eines einzelnen schlechten Tages. AskBiz speichert Mitarbeiterleistungsdaten, solange das Konto aktiv ist, aber Sie können Daten ehemaliger Mitarbeiter gemäß Ihrer Datenaufbewahrungsrichtlinie anonymisieren.',
      },
    ],
    faq: [
      {
        q: 'Können Mitarbeiter ihre eigenen Leistungskennzahlen sehen?',
        a: 'Manager und Inhaber können alle Mitarbeiterkennzahlen einsehen. Kassierer sehen ihre eigene Transaktionsanzahl und ihren Umsatz für den Tag, jedoch keine Vergleichsdaten zu anderen Mitarbeitern.',
      },
      {
        q: 'Erstellt AskBiz ein Ranking der Mitarbeiter?',
        a: 'AskBiz stellt die Daten nebeneinander dar, erstellt aber keine formellen Rankings. Wie Sie die Daten interpretieren und kommunizieren, liegt bei Ihnen als Geschäftsinhaber.',
      },
    ],
  },

  'pos-security-best-practices': {
    title: 'Kassensicherheit: Transaktionen und Kundendaten schützen',
    description:
      'Ihr Kassensystem verarbeitet täglich Geld und Kundendaten. Hier sind die Sicherheits-Best-Practices, die jeder kleine Einzelhändler befolgen sollte.',
    keywords: [
      'Kassensicherheit',
      'Datenschutz Einzelhandel',
      'Betrugsprävention Kassensystem',
      'sicheres Kassensystem',
      'DSGVO Kassensystem',
      'Zahlungssicherheit Einzelhandel',
      'Kassensystem Sicherheits-Best-Practices',
    ],
    keyTakeaways: [
      'Starke Mitarbeiterberechtigungen, Magic-Link-Login und rollenbasierter Zugriff sind Ihre erste Verteidigungslinie in der Kassensicherheit.',
      'AskBiz POS speichert Daten in einer verschlüsselten Cloud-Infrastruktur — keine sensiblen Daten liegen auf Ihrem lokalen Gerät.',
      'Regelmäßige Überprüfung von Audit-Trails, Rückerstattungsmustern und Zugriffsprotokollen hilft, Probleme zu erkennen, bevor sie teuer werden.',
    ],
    content: [
      {
        heading: 'Die drei Säulen der Kassensicherheit',
        body: 'Kassensicherheit ruht auf drei Säulen: Zugriffskontrolle, Datenschutz und Überwachung. Zugriffskontrolle bedeutet, sicherzustellen, dass nur autorisierte Personen das System nutzen können und jede Person nur das tun kann, was ihre Rolle erfordert. Die rollenbasierten Berechtigungen von AskBiz (Inhaber, Manager, Kassierer) und der Magic-Link-Login regeln dies umfassend. Datenschutz bedeutet, sicherzustellen, dass Transaktionsdaten, Kundeninformationen und Finanzunterlagen sicher gespeichert und sicher übertragen werden. AskBiz speichert alle Daten in einer verschlüsselten Cloud-Infrastruktur nach Industriestandard-Protokollen — Daten werden sowohl bei der Übertragung (zwischen Ihrem Gerät und dem Server) als auch im Ruhezustand (auf dem Server gespeichert) verschlüsselt. Keine sensiblen Transaktionsdaten werden dauerhaft auf Ihrem lokalen Gerät gespeichert. Überwachung bedeutet, im Blick zu behalten, was im System geschieht, und Auffälligkeiten frühzeitig zu erkennen. Der AskBiz-Audit-Trail liefert die Rohdaten; die Ausnahmewarnungen heben die Ereignisse hervor, die eine Untersuchung wert sind.',
      },
      {
        heading: 'Schutz vor internen Bedrohungen',
        body: 'Die unangenehme Wahrheit ist, dass der Großteil des Kassenbetrugs im kleinen Einzelhandel von Mitarbeitern begangen wird, nicht von externen Angreifern. Fiktive Rückerstattungen, „Freundschaftsdeals" (kostenlose oder rabattierte Produkte für Freunde), Skimming (Bargeld einstecken und die Transaktion stornieren) und Zeitdiebstahl sind die häufigsten Formen. AskBiz begegnet dem mit mehreren Mechanismen. Die Beschränkung von Rückerstattungen und Stornierungen auf Manager und Inhaber entzieht Kassierern den primären Weg für Betrug. Der unveränderliche Audit-Trail schafft Verantwortlichkeit — jede Aktion wird einer namentlich benannten Person zugeordnet. Ausnahmewarnungen kennzeichnen ungewöhnliche Muster, etwa einen Anstieg der Rückerstattungen oder eine auffällige Rabattquote in einer bestimmten Schicht. Kassenabgleich-Tools vergleichen den erwarteten Kassenbestand (basierend auf Kassendaten) mit dem tatsächlich gezählten Betrag und heben Abweichungen sofort hervor. Die wirksamste Abschreckung besteht jedoch schlicht darin, Ihrem Personal mitzuteilen, dass diese Kontrollen bestehen. Wissen Mitarbeiter, dass ihre Handlungen verfolgt und überprüft werden, wird kaum jemand unehrliches Verhalten in Betracht ziehen.',
      },
      {
        heading: 'Kundendaten schützen und DSGVO-Compliance',
        body: 'Erfassen Sie über Ihr Kassensystem Kundendaten — Telefonnummern für WhatsApp-Belege, E-Mail-Adressen für digitale Rechnungen oder Kundennamen für Treueprogramme —, unterliegen Sie der DSGVO. Die Kernprinzipien lauten: nur erfassen, was Sie brauchen, Kunden mitteilen, was Sie erfassen und warum, sicher speichern und löschen, sobald es nicht mehr nötig ist. AskBiz übernimmt die technische Seite der sicheren Speicherung und Verschlüsselung. Ihre Verantwortung liegt auf der Policy-Seite: einen Datenschutzhinweis in Ihrem Geschäft oder auf Ihrer Website anzeigen, sicherstellen, dass Sie für jede Art der Datenverarbeitung eine Rechtsgrundlage haben (typischerweise „berechtigtes Interesse" für die Belegzustellung und „Einwilligung" für Marketingkommunikation), und auf Anfragen zu Kundendaten-Zugriff oder -Löschung innerhalb eines Monats zu reagieren. AskBiz erlaubt Ihnen, alle zu einem bestimmten Kunden gespeicherten Daten zu suchen und zu exportieren, was die Beantwortung von Auskunftsersuchen (Subject Access Requests) erleichtert.',
      },
      {
        heading: 'Physische Sicherheit für Kassengeräte',
        body: 'Software-Sicherheit ist nur die halbe Miete. Auch Ihr Kassengerät — Telefon, Tablet oder Terminal — braucht physischen Schutz. Wird Ihr Tablet gestohlen, hat der Dieb potenziell Zugriff auf Ihr Kassensystem (sofern es noch angemeldet ist) und auf lokal zwischengespeicherte Daten. Hier sind praktische Schritte zur Risikominderung. Erstens: Aktivieren Sie die Gerätesperre — PIN, Fingerabdruck oder Gesichtserkennung zum Entsperren erforderlich machen. Zweitens: Konfigurieren Sie in AskBiz ein Sitzungs-Timeout, damit sich das Kassensystem nach einer Zeit der Inaktivität automatisch abmeldet. Drittens: Wird ein Gerät gestohlen, entfernen Sie es sofort als autorisiertes Gerät in den AskBiz-Einstellungen und ändern Sie alle gemeinsam genutzten Zugangsdaten. Viertens: Lassen Sie Kassengeräte im Kundenbereich nie unbeaufsichtigt. Während des Betriebs sollte das Gerät jederzeit in Sicht- und Reichweite eines Mitarbeiters sein. Außerhalb der Öffnungszeiten sicher verwahren. Diese Maßnahmen sind einfach, aber wirksam — die meisten physischen Kassendiebstähle sind Gelegenheitstaten, und grundlegende Vorsichtsmaßnahmen beseitigen die Gelegenheit.',
      },
    ],
    faq: [
      {
        q: 'Erfüllt AskBiz POS PCI DSS?',
        a: 'AskBiz POS verarbeitet Kartenzahlungen nicht direkt — das übernimmt Ihr Kartenterminal. Damit liegt AskBiz selbst außerhalb des Anwendungsbereichs von PCI DSS. Die Datenverarbeitungspraktiken von AskBiz orientieren sich jedoch an bewährten Sicherheitspraktiken für jedes System, das Zahlungsmethoden-Informationen erfasst.',
      },
      {
        q: 'Was soll ich tun, wenn ich Kassenbetrug durch einen Mitarbeiter vermute?',
        a: 'Prüfen Sie den Audit-Trail auf Hinweise und konzentrieren Sie sich auf Rückerstattungen, Stornierungen, Preisänderungen und Kassendifferenzen. Finden Sie Belege für Betrug, konsultieren Sie vor arbeitsrechtlichen Schritten Ihren Rechtsberater, um ein ordnungsgemäßes Verfahren sicherzustellen.',
      },
    ],
  },

  'pos-pwa-mobile-setup': {
    title: 'AskBiz POS auf dem Smartphone einrichten: PWA-Installationsanleitung',
    description:
      'AskBiz POS läuft als Progressive Web App auf jedem modernen Smartphone oder Tablet. So installieren Sie es für die beste Erfahrung.',
    keywords: [
      'PWA Kassensystem einrichten',
      'Kassensystem mobil installieren',
      'AskBiz PWA',
      'Progressive Web App Kassensystem',
      'Kassensystem auf dem Handy',
      'Kassensystem auf Tablet installieren',
      'mobiles Kassensystem einrichten',
    ],
    keyTakeaways: [
      'AskBiz POS läuft als Progressive Web App — installieren Sie es auf dem Startbildschirm für eine native App-Erfahrung ohne App Store.',
      'Die PWA-Installation dauert auf iOS- und Android-Geräten unter zwei Minuten.',
      'Einmal installiert, läuft AskBiz POS im Vollbildmodus, unterstützt den Offline-Modus und startet sofort vom Startbildschirm.',
    ],
    content: [
      {
        heading: 'Was ist eine Progressive Web App (PWA)?',
        body: 'Eine Progressive Web App ist eine Website, die sich wie eine native App verhält. Installieren Sie eine PWA auf Ihrem Startbildschirm, erhält sie ein eigenes Symbol, öffnet sich im Vollbildmodus (ohne Browser-Adressleiste), lädt schnell und kann sogar offline funktionieren. Sie laden sie nicht aus dem App Store oder von Google Play herunter — Sie installieren sie direkt aus dem Browser. Dieser Ansatz bietet für ein Kassensystem erhebliche Vorteile. Updates erfolgen automatisch — jedes Mal, wenn Sie die App öffnen, erhalten Sie die neueste Version, ohne etwas herunterzuladen. Es gibt keinen App-Prüfprozess, der Funktionsveröffentlichungen verzögert. Sie funktioniert auf jedem Gerät mit einem modernen Browser, sodass Sie nicht an ein bestimmtes Betriebssystem gebunden sind. Und weil AskBiz POS eine PWA ist, können Sie in Minuten auf einem neuen Gerät startklar sein — unschätzbar wertvoll, wenn Ihr Hauptgerät mitten in der Schicht ausfällt und Sie schnell Ersatz brauchen.',
      },
      {
        heading: 'Installation auf Android',
        body: 'Öffnen Sie Chrome (oder einen anderen Chromium-basierten Browser) auf Ihrem Android-Smartphone oder -Tablet. Rufen Sie die AskBiz-POS-URL auf und melden Sie sich in Ihrem Konto an. Chrome zeigt ein Banner oder eine Benachrichtigung an, die die Installation der App vorschlägt — tippen Sie darauf und folgen Sie den Anweisungen. Erscheint das Banner nicht, tippen Sie auf das Drei-Punkte-Menü oben rechts und wählen Sie „Zum Startbildschirm hinzufügen" oder „App installieren". Das AskBiz-Symbol erscheint sofort auf Ihrem Startbildschirm. Tippen Sie darauf, öffnet sich das Kassensystem im Vollbildmodus, nicht von einer nativen App zu unterscheiden. Die Installation belegt minimalen Speicherplatz, da der Großteil der App-Daten in der Cloud liegt. Nach der Installation zwischenspeichert AskBiz wesentliche Ressourcen lokal, sodass die App auch bei langsamen Verbindungen schnell lädt und grundlegende Verkaufsfunktionen offline verfügbar sind.',
      },
      {
        heading: 'Installation auf iOS (iPhone und iPad)',
        body: 'Öffnen Sie Safari auf Ihrem iPhone oder iPad — das ist wichtig, denn iOS unterstützt die PWA-Installation nur über Safari, nicht über Chrome oder andere Browser. Rufen Sie die AskBiz-POS-URL auf und melden Sie sich an. Tippen Sie unten auf dem Bildschirm auf die Teilen-Schaltfläche (das Quadrat mit dem nach oben zeigenden Pfeil). Scrollen Sie nach unten und tippen Sie auf „Zum Home-Bildschirm". Geben Sie der Verknüpfung einen Namen (der Standard „AskBiz POS" reicht aus) und tippen Sie auf Hinzufügen. Das Symbol erscheint auf Ihrem Startbildschirm. Öffnen Sie es, läuft AskBiz POS im Vollbildmodus. Beachten Sie, dass iOS-PWAs im Vergleich zu Android einige Einschränkungen haben — Push-Benachrichtigungen für Bestandswarnungen können sich anders verhalten, und die App muss gelegentlich nach einer Phase der Inaktivität neu geladen werden. Das sind iOS-seitige Einschränkungen, keine AskBiz-Einschränkungen, und Apple verbessert die PWA-Unterstützung mit jeder iOS-Version.',
      },
      {
        heading: 'Ihr Gerät für die Kassennutzung optimieren',
        body: 'Nach der Installation von AskBiz POS optimieren ein paar geräteseitige Anpassungen die Erfahrung. Erstens: Deaktivieren Sie die automatische Sperre oder stellen Sie ein langes Timeout ein — ein Kassenbildschirm, der alle dreißig Sekunden dunkel wird, ist während einer geschäftigen Schicht frustrierend. Stellen Sie die automatische Sperre auf fünf oder zehn Minuten oder deaktivieren Sie sie während der Öffnungszeiten ganz (denken Sie nur daran, manuell zu sperren, wenn das Gerät unbeaufsichtigt ist). Zweitens: Passen Sie die Bildschirmhelligkeit auf ein angenehmes Niveau an. Ein sehr heller Bildschirm entlädt den Akku schneller; ein sehr dunkler ist in einem gut beleuchteten Geschäft schwer zu lesen. Drittens: Aktivieren Sie den Nicht-stören-Modus während der Öffnungszeiten, damit eingehende Anrufe und Benachrichtigungen die Kassenoberfläche nicht mitten in einer Transaktion unterbrechen. Viertens: Halten Sie das Gerät eingesteckt oder in Ladegerätnähe. Kamerascans verbrauchen Akku, und ein voller Verkaufstag kann einen Handyakku bis zum Nachmittag leeren. Ein einfaches Ladekabel an der Kasse löst das. Schließlich: Schließen Sie nicht benötigte Hintergrund-Apps, um verfügbaren Speicher zu maximieren und einen reibungslosen Betrieb des Kassensystems sicherzustellen.',
      },
    ],
    faq: [
      {
        q: 'Kann ich AskBiz POS auf einem Desktop-Computer nutzen?',
        a: 'Ja. AskBiz POS funktioniert in jedem modernen Desktop-Browser. Kamerascans erfordern jedoch eine Webcam. Für die meisten Einzelhändler ist ein Smartphone oder Tablet die praktischere Wahl.',
      },
      {
        q: 'Muss ich die PWA manuell aktualisieren?',
        a: 'Nein. PWAs aktualisieren sich automatisch. Veröffentlicht AskBiz eine neue Version, wird das Update beim nächsten Öffnen der App angewendet. Ein manueller Download oder eine Installation sind nicht nötig.',
      },
    ],
  },

  'pos-troubleshooting': {
    title: 'Kassen-Problembehebung: Kamera-, Login- und Sync-Probleme',
    description:
      'Kamera scannt nicht, Login funktioniert nicht, oder Daten synchronisieren nicht? Hier sind schnelle Lösungen für die häufigsten AskBiz-POS-Probleme.',
    keywords: [
      'Kassensystem Problembehebung',
      'Barcode-Scanner funktioniert nicht',
      'Kassensystem Login-Probleme',
      'Kassensystem Sync-Probleme',
      'Kamera scannt nicht Kassensystem',
      'AskBiz POS Hilfe',
      'Kassensystem häufige Probleme beheben',
    ],
    keyTakeaways: [
      'Die meisten AskBiz-POS-Probleme fallen in drei Kategorien: Kamera/Scannen, Login/Authentifizierung und Datensynchronisierung.',
      'Die Mehrheit der Probleme wird durch das Erteilen von Browser-Berechtigungen, das Leeren des Caches oder die Prüfung der Internetverbindung gelöst.',
      'AskBiz protokolliert Sync-Ereignisse und Fehler, was die Diagnose von Problemen ohne Rätselraten erleichtert.',
    ],
    content: [
      {
        heading: 'Kamera- und Scan-Probleme',
        body: 'Aktiviert sich die Kamera beim Tippen auf die Scan-Schaltfläche nicht, ist die häufigste Ursache eine fehlende Browser-Berechtigung. Ihr Browser benötigt eine ausdrückliche Berechtigung für den Kamerazugriff, und diese muss speziell für die AskBiz-Domain erteilt werden. Gehen Sie auf Android zu den Chrome-Einstellungen, dann Website-Einstellungen, dann Kamera, und stellen Sie sicher, dass die AskBiz-URL als „Zulässig" aufgeführt ist. Gehen Sie auf iOS zu Einstellungen, dann Safari, dann Kamera, und stellen Sie diese auf „Erlauben". Aktiviert sich die Kamera, werden Barcodes aber nicht erkannt, prüfen Sie die Beleuchtung — schlechtes Licht ist die häufigste Ursache für langsame oder fehlgeschlagene Erkennung. Halten Sie das Telefon 15 bis 30 Zentimeter vom Barcode entfernt und ruhig. Reinigen Sie die Kameralinse, wenn sie verschmiert ist. Scheitert ein bestimmter Barcode wiederholt, ist er möglicherweise beschädigt oder zu klein gedruckt — versuchen Sie als Ausweg, das Produkt manuell einzugeben. Funktionierte das Scannen zuvor und hat aufgehört, versuchen Sie, die AskBiz-PWA zu schließen und neu zu öffnen, oder leeren Sie den Browser-Cache für die AskBiz-Website.',
      },
      {
        heading: 'Login- und Authentifizierungsprobleme',
        body: 'AskBiz POS nutzt den Magic-Link-Login — bei jeder Anmeldung wird ein einmaliger Link an Ihre E-Mail-Adresse gesendet. Erhalten Sie den Magic Link nicht, prüfen Sie zuerst Ihren Spam- oder Junk-Ordner — E-Mail-Anbieter stufen automatisierte E-Mails gelegentlich fälschlich ein. Stellen Sie sicher, dass Sie genau die E-Mail-Adresse eingeben, mit der Ihr Mitarbeiterkonto angelegt wurde (prüfen Sie Groß-/Kleinschreibung und Tippfehler). Kommt die E-Mail nach einigen Minuten immer noch nicht an, bitten Sie Ihren Kontoinhaber zu überprüfen, ob Ihre E-Mail-Adresse korrekt im System hinterlegt ist. Erhalten Sie den Magic Link, aber er funktioniert beim Antippen nicht, ist der Link möglicherweise abgelaufen — Magic Links sind aus Sicherheitsgründen zeitlich begrenzt. Fordern Sie einen neuen an und tippen Sie ihn zeitnah an. Achten Sie außerdem darauf, den Link im selben Browser zu öffnen, in dem Sie AskBiz POS nutzen — manche E-Mail-Apps öffnen Links in einem In-App-Browser, der keine Sitzung mit Ihrem Hauptbrowser teilt. Öffnet sich der Magic Link auf iOS im falschen Browser, kopieren Sie den Link und fügen Sie ihn manuell in Safari ein.',
      },
      {
        heading: 'Datensynchronisierungs- und Verbindungsprobleme',
        body: 'AskBiz POS synchronisiert Daten nach jeder Transaktion mit der Cloud. Bricht Ihre Internetverbindung ab, wechselt die App in den Offline-Modus und speichert Transaktionen lokal, bis die Verbindung zurückkehrt. Bei Wiederherstellung der Verbindung synchronisieren ausstehende Transaktionen automatisch. Bemerken Sie, dass Daten nicht synchronisieren (etwa wenn Sie einen Verkauf über die Kasse abwickeln, dieser aber nicht in Ihren Berichten auf einem anderen Gerät erscheint), prüfen Sie zunächst Ihre Internetverbindung. Öffnen Sie eine beliebige Website, um zu bestätigen, dass Sie online sind. Ist die Verbindung in Ordnung, die Synchronisierung aber weiterhin verzögert, versuchen Sie, die PWA zwangsweise zu aktualisieren: In den meisten Browsern nach unten ziehen zum Aktualisieren oder die App schließen und neu öffnen. Anhaltende Sync-Probleme sind selten, können aber auftreten, wenn der lokale Speicher des Browsers voll ist (häufig bei Geräten mit sehr begrenztem Speicherplatz). Das Leeren des Browser-Caches für die AskBiz-Website löst dies in der Regel — Ihre Daten sind sicher in der Cloud, sodass das Leeren des lokalen Caches nichts verliert.',
      },
      {
        heading: 'Wann Sie den Support kontaktieren sollten',
        body: 'Die meisten AskBiz-POS-Probleme lassen sich mit den obigen Schritten lösen, aber manche Situationen rechtfertigen die Kontaktaufnahme mit dem Support. Sehen Sie einen bestimmten Fehlercode oder eine Meldung, notieren Sie ihn und geben Sie ihn in Ihrer Support-Anfrage an — das beschleunigt die Diagnose erheblich. Fehlen Transaktionen (nicht nur verzögert bei der Synchronisierung), kontaktieren Sie den Support umgehend mit ungefährer Uhrzeit und verwendetem Gerät. Lässt sich ein Mitarbeiter nicht entfernen oder eine Rollenänderung wird nicht wirksam, kann das auf einen Berechtigungskonflikt hindeuten, der eine Backend-Untersuchung erfordert. Verschlechtert sich die Leistung mit der Zeit (die App wird langsam oder reagiert nicht mehr), könnte das auf ein Geräteproblem oder ein Datenvolumenproblem hindeuten, bei dessen Diagnose der Support helfen kann. Der AskBiz-Support ist über den In-App-Chat, per E-Mail und über das Hilfecenter erreichbar. Geben Sie bei der Meldung eines Problems Ihren Gerätetyp, Browsername und -version sowie eine Beschreibung der Schritte an, die zum Problem geführt haben. Screenshots oder Bildschirmaufnahmen sind bei visuellen Problemen äußerst hilfreich.',
      },
    ],
    faq: [
      {
        q: 'Verliere ich Transaktionen, wenn mein Akku während eines Verkaufs leer wird?',
        a: 'War der Verkauf bestätigt, bevor das Gerät ausging, ist er lokal gespeichert und synchronisiert, sobald das Gerät wieder aufgeladen und verbunden ist. War der Verkauf noch nicht bestätigt, müssen Sie ihn erneut eingeben.',
      },
      {
        q: 'Wie leere ich den AskBiz-Cache, ohne Daten zu verlieren?',
        a: 'Ihre Daten liegen in der Cloud, nicht im Browser-Cache. Das Leeren des Caches entfernt temporäre Dateien, die den App-Start beschleunigen, löscht aber keine Transaktionsdaten, Produkte oder Einstellungen.',
      },
      {
        q: 'Das Kassensystem läuft langsam — was soll ich tun?',
        a: 'Schließen Sie Hintergrund-Apps, um Speicher freizugeben, stellen Sie sicher, dass Ihr Gerät mindestens 500 MB freien Speicherplatz hat, und starten Sie den Browser neu. Besteht das Problem weiterhin, starten Sie das Gerät selbst neu.',
      },
    ],
  },

  'pos-data-in-dashboards': {
    title: 'Wie Kassendaten Ihr AskBiz-Dashboard antreiben',
    description:
      'Ihre Kassentransaktionen liegen nicht einfach nur in einer Datenbank — sie speisen Echtzeit-Dashboards, Umsatzcharts und Produktleistungsansichten in AskBiz.',
    keywords: [
      'Kassensystem-Dashboard',
      'Point-of-Sale-Analyse',
      'Kassen-Reporting-Dashboard',
      'Einzelhandels-Dashboard',
      'Kassendaten-Visualisierung',
      'AskBiz-Kassen-Dashboard',
    ],
    keyTakeaways: [
      'Jede Kassentransaktion erscheint automatisch innerhalb von Sekunden in Ihrem AskBiz-Dashboard.',
      'Dashboard-Widgets können Umsatz, verkaufte Einheiten, durchschnittliche Warenkorbgröße und Top-Produkte anzeigen — alles aus Kassendaten.',
      'Die Kombination von Kassendaten mit Online-Verkäufen gibt Ihnen einen echten Omnichannel-Überblick über Ihr Geschäft.',
    ],
    content: [
      {
        heading: 'Von der Kasse zum Dashboard in Echtzeit',
        body: 'Jeder über AskBiz POS abgewickelte Verkauf wird sofort in Ihrem zentralen Datenspeicher erfasst. Innerhalb von Sekunden aktualisiert diese Transaktion Ihr Dashboard: Der Gesamtumsatz steigt, die Produkt-Bestenliste ordnet sich neu, und der tägliche Verkaufszähler erhöht sich. Es gibt keinen Batch-Import, keine nächtliche Synchronisierung und keinen manuellen Export. Das ist der grundlegende Unterschied zwischen einer eigenständigen Kasse und einem integrierten Kassensystem — Ihre Intelligenzebene sieht jede Transaktion in dem Moment, in dem sie geschieht. Für einen Geschäftsinhaber bedeutet das: Sie können mittags einen Blick aufs Handy werfen und genau wissen, wie der Vormittag lief, welche Produkte sich bewegt haben und ob Sie auf Kurs sind, Ihr Tagesziel zu erreichen.',
      },
      {
        heading: 'Wichtige Kassen-Widgets für Ihr Dashboard',
        body: 'AskBiz stellt automatisch mehrere kassenspezifische Widgets bereit, sobald das Modul aktiv ist. **Umsatz heute** zeigt eine laufende Summe mit Vergleich zum selben Tag der Vorwoche. **Verkaufte Einheiten** verfolgt das Volumen getrennt vom Wert — nützlich, um zu erkennen, ob ein Umsatzanstieg durch mehr verkaufte Artikel oder teurere Artikel zustande kommt. **Durchschnittliche Warenkorbgröße** berechnet den mittleren Transaktionswert über alle heutigen Verkäufe. **Top-Produkte** rankt Ihre Bestseller nach Umsatz oder Volumen über einen von Ihnen gewählten Zeitraum. **Verkäufe nach Mitarbeiter** zeigt, welche Kassierer die meisten Transaktionen abwickeln — nützlich für Schichtplanung und Leistungsbeurteilungen. Sie können jedes dieser Widgets an Ihr Standard-Dashboard anheften, damit sie jeden Morgen zuerst laden.',
      },
      {
        heading: 'Kassendaten mit Online-Verkäufen kombinieren',
        body: 'Verkaufen Sie auch über Shopify, Amazon, Etsy oder eine andere angebundene Plattform, führt AskBiz Ihre Kassendaten mit den Online-Daten in einer einzigen Ansicht zusammen. Genau hier entsteht die eigentliche Intelligenz. Sie können erkennen, dass ein Produkt online gut läuft, sich aber im Ladengeschäft kaum bewegt, oder dass der Umsatz im Geschäft unter der Woche besser ist als am Wochenende, während online das Gegenteil gilt. Das Widget **Umsatz nach Kanal** zeigt alle Kanäle nebeneinander. Die Ansicht **Produktleistung** ermöglicht den Vergleich desselben Artikels über alle Kanäle hinweg. Diese Omnichannel-Sichtbarkeit kostet Großhändler in der Regel tausende Pfund für maßgeschneiderte Analysetools — AskBiz liefert sie automatisch, weil das Kassensystem eingebaut statt nachträglich angeflanscht ist.',
      },
      {
        heading: 'Ihr Kassen-Dashboard einrichten',
        body: 'Gehen Sie zu **Dashboards → Dashboard erstellen** und wählen Sie die Kassenvorlage, oder erstellen Sie eines von Grund auf, indem Sie Widgets aus der Kassenkategorie hinzufügen. Ordnen Sie sie in der Reihenfolge an, die Ihrer täglichen Durchsicht entspricht — die meisten Inhaber platzieren Umsatz und verkaufte Einheiten oben links, Produktleistung darunter und Mitarbeiterkennzahlen rechts. Speichern Sie es als Ihre Standardansicht, damit es automatisch lädt, wenn Sie AskBiz öffnen. Teilen Sie das Dashboard mit einem Filialleiter, sieht dieser dieselben Echtzeitdaten, ohne Zugriff auf das vollständige AskBiz-Admin zu benötigen. Das Teilen von Dashboards respektiert Rollenberechtigungen, sodass ein Manager Verkaufsdaten sieht, aber nicht Abrechnung oder Kontoeinstellungen.',
      },
    ],
    faq: [
      {
        q: 'Wie schnell erscheinen Kassendaten auf meinem Dashboard?',
        a: 'Innerhalb von Sekunden. AskBiz POS schreibt Transaktionen direkt in Ihren zentralen Datenspeicher, und Dashboards greifen in Echtzeit auf dieselbe Quelle zu.',
      },
      {
        q: 'Kann ich Kassen- und Online-Verkäufe im selben Chart sehen?',
        a: 'Ja. Das Widget Umsatz nach Kanal kombiniert alle angebundenen Kanäle — einschließlich Kasse — in einer einzigen Ansicht, aufgeschlüsselt nach Quelle.',
      },
    ],
  },

  'pos-ai-chat-questions': {
    title: 'Fragen Sie AskBiz zu Ihren Kassendaten: 25 Fragen, die Einzelhandels-Erkenntnisse freisetzen',
    description:
      'Die AskBiz-KI kann Fragen zu Ihren Kassentransaktionen in einfacher Sprache beantworten. Hier sind 25 Fragen, die sich jeder Ladenbesitzer stellen sollte.',
    keywords: [
      'AskBiz zur Kasse fragen',
      'Kassensystem KI-Fragen',
      'Einzelhandels-KI-Analyse',
      'Kassensystem natürliche Sprachabfrage',
      'AskBiz-KI-Chat Einzelhandel',
      'KI-Point-of-Sale-Erkenntnisse',
    ],
    keyTakeaways: [
      'Die AskBiz-KI versteht Ihre Kassendaten — stellen Sie einfach Fragen in normaler Sprache.',
      'Fragen zu Umsatztrends, Produktleistung und Mitarbeiterkennzahlen funktionieren alle sofort.',
      'Die Kombination von Kassenfragen mit Fragen zu Online-Daten liefert Erkenntnisse, die kein einzelnes System allein bieten kann.',
    ],
    content: [
      {
        heading: 'Wie die KI Ihre Kassendaten versteht',
        body: 'Wenn Sie eine Frage in AskBiz eingeben, betrachtet die KI alle Ihre verbundenen Datenquellen — einschließlich jeder über die Kasse abgewickelten Transaktion. Sie versteht Produktnamen, Preise, Mitarbeiter, Zahlungsmethoden, Rückerstattungsgründe und Zeiträume. Sie müssen keine Abfragen schreiben oder Filter auswählen. Fragen Sie einfach in einfacher Sprache: „Was war letzten Dienstag mein meistverkauftes Produkt?" oder „Welcher Kassierer hat diesen Monat die meisten Rückerstattungen bearbeitet?" Die KI übersetzt Ihre Frage in eine Datenabfrage, führt sie gegen Ihre Transaktionshistorie aus und liefert die Antwort in einem Satz oder als Chart — je nachdem, was hilfreicher ist. Es ist dieselbe KI-Engine, die den Rest von AskBiz antreibt, nun mit vollständiger Sicht auf Ihre physischen Einzelhandelsdaten.',
      },
      {
        heading: 'Fragen zu Umsatz und Verkäufen',
        body: 'Beginnen Sie mit den Grundlagen. **„Was war mein Gesamt-Kassenumsatz diese Woche?"** liefert Ihnen die Kernzahl. **„Wie schneidet diese Woche im Vergleich zur gleichen Woche letzten Monat ab?"** liefert den Kontext dazu. **„Wie hoch ist meine durchschnittliche Warenkorbgröße?"** zeigt Ihnen, ob Kunden mehr Artikel oder nur teurere kaufen. **„Welcher Wochentag hat den höchsten Kassenumsatz?"** hilft bei Personalentscheidungen. **„Welcher Anteil meines Umsatzes stammt aus Bar- vs. Kartenzahlung?"** informiert Ihre Zahlungsabwicklungsstrategie. **„Zeig mir den täglichen Kassenumsatz der letzten 30 Tage als Chart"** liefert Ihnen den visuellen Trend. Jede dieser Fragen wird in Sekunden beantwortet und würde ohne die KI manuelle Tabellenarbeit erfordern.',
      },
      {
        heading: 'Fragen zu Produkten und Bestand',
        body: 'Bei Produktintelligenz zeigen Kassendaten ihr volles Potenzial. **„Was sind meine Top-10-Produkte nach verkauften Einheiten diesen Monat?"** identifiziert Ihre Verkaufsschlager. **„Welche Produkte haben die höchste Rückerstattungsquote?"** weist auf Qualitäts- oder Größenprobleme hin. **„Welche Produkte haben sich in den letzten 30 Tagen nicht verkauft?"** hebt Ladenhüter hervor. **„Wie hoch ist meine durchschnittliche Marge pro Produktkategorie?"** zeigt, wo Sie tatsächlich Geld verdienen und wo Sie nur Volumen bewegen. **„Welche Produkte werden häufig zusammen gekauft?"** deckt Cross-Selling-Chancen auf, die Sie vielleicht übersehen. **„Sag voraus, welche Produkte basierend auf der aktuellen Abverkaufsrate in den nächsten 7 Tagen ausverkauft sein werden"** verwandelt Ihre Kassendaten in ein vorausschauendes Planungstool.',
      },
      {
        heading: 'Fragen zu Personal und Betrieb',
        body: 'Ihre Kassendaten enthalten eine Fundgrube an betrieblichen Erkenntnissen. **„Welcher Mitarbeiter hat den höchsten durchschnittlichen Warenkorbwert?"** identifiziert Ihre besten Upseller. **„Wie hoch ist die durchschnittliche Transaktionszeit je Kassierer?"** zeigt Schulungsbedarf auf. **„Wie viele Transaktionen wickelt jeder Kassierer pro Stunde ab?"** misst den Durchsatz. **„Zeig mir Rückerstattungen nach Mitarbeiter diesen Monat"** hilft, Muster zu erkennen, die Aufmerksamkeit verdienen könnten. **„Was sind die Stoßzeiten diese Woche?"** optimiert Ihren Schichtplan. **„Vergleiche die Mitarbeiterleistung diesen Monat mit dem letzten Monat"** verfolgt die Entwicklung über die Zeit. Diese Fragen verwandeln rohe Transaktionsprotokolle in Management-Intelligenz, die Ihnen hilft, ein besseres Geschäft zu führen.',
      },
    ],
    faq: [
      {
        q: 'Kann ich die KI bitten, Kassenverkäufe mit meinem Onlineshop zu vergleichen?',
        a: 'Ja. Versuchen Sie: „Vergleiche meinen Ladenumsatz mit dem Shopify-Umsatz diesen Monat." Die KI greift auf beide Quellen zu und stellt einen Nebeneinander-Vergleich dar.',
      },
      {
        q: 'Was, wenn die KI eine falsche Antwort zu meinen Kassendaten gibt?',
        a: 'Prüfen Sie, ob der Zeitraum und die Produktnamen in der Antwort zu Ihrer Frage passen. Wirken Daten falsch, prüfen Sie im Transaktionsprotokoll, ob alle Kassentransaktionen synchronisiert wurden. Sie können ungenaue Antworten über die Daumen-runter-Schaltfläche melden.',
      },
    ],
  },

  'pos-daily-brief-integration': {
    title: 'Wie Kassendaten in Ihrem Daily Brief erscheinen',
    description:
      'Ihr AskBiz Daily Brief enthält automatisch Kassen-Erkenntnisse — den Umsatz von gestern, Top-Produkte, Bestandswarnungen und Auffälligkeiten aus Ihrem Ladengeschäft.',
    keywords: [
      'Kassensystem Daily Brief',
      'Einzelhandel-Tageszusammenfassung',
      'Kassensystem Morgenbericht',
      'AskBiz Daily Brief Kassensystem',
      'automatisierter Kassenbericht',
      'tägliche Einzelhandels-Erkenntnisse',
    ],
    keyTakeaways: [
      'Das Daily Brief bezieht Kassendaten automatisch ein, sobald das Modul aktiv ist — keine Einrichtung nötig.',
      'Es hebt den Umsatz von gestern, Top-Seller, Bestandswarnungen und ungewöhnliche Muster hervor.',
      'Der Vergleich Ihres Daily Brief über mehrere Tage hinweg zeigt Trends, die einzelne Transaktionsprotokolle nicht offenlegen können.',
    ],
    content: [
      {
        heading: 'Was das Daily Brief aus Ihrer Kasse enthält',
        body: 'Ist AskBiz POS aktiviert, ergänzt Ihr morgendliches Daily Brief automatisch einen Einzelhandelsabschnitt. Dieser umfasst den gesamten Kassenumsatz von gestern und den Vergleich zum selben Tag der Vorwoche, die Top drei Produkte nach verkauften Einheiten, alle Produkte, die über Nacht Bestandswarnungen oder Fehlbestand-Meldungen ausgelöst haben, sowie eine Mitarbeiter-Bestenliste mit Transaktionen und Umsatz je Kassierer. Sind auch Online-Kanäle angebunden, zeigt das Brief eine Kanalaufteilung, damit Sie sehen, wie sich die Ladenleistung im Vergleich zu den digitalen Verkäufen entwickelt hat. All das erreicht Ihr Postfach oder den AskBiz-Startbildschirm, bevor Sie das Geschäft öffnen — Sie erhalten so ein vollständiges Bild von gestern und einen Vorsprung für heute.',
      },
      {
        heading: 'Anomalieerkennung für den Einzelhandel',
        body: 'Das Daily Brief meldet nicht nur Zahlen — es kennzeichnet auch alles Ungewöhnliche. War der gestrige Umsatz deutlich über oder unter dem jüngsten Durchschnitt, weist das Brief darauf hin und schlägt mögliche Gründe vor (ein lokales Ereignis, eine Preisänderung, eine Personalabwesenheit). Verkaufte sich ein Produkt, das normalerweise zehn Einheiten pro Tag verkauft, plötzlich gar nicht, wird das ebenfalls gemeldet — es könnte auf ein Präsentationsproblem, ein Bestandsproblem oder einen Scanfehler hindeuten. Diese Auffälligkeiten werden automatisch mit derselben Erkennungs-Engine aufgedeckt, die auch Ihre Online-Kanäle überwacht. Für einen vielbeschäftigten Ladeninhaber bedeutet das: Sie müssen keine Tabellen manuell vergleichen, um Probleme zu erkennen — das Brief erledigt das jeden Morgen für Sie.',
      },
      {
        heading: 'Ihr Kassen-Brief anpassen',
        body: 'Das Daily Brief ist so gestaltet, dass es sofort funktioniert, lässt sich aber anpassen. Gehen Sie zu **Einstellungen → Daily Brief → Kassenabschnitt**, um auszuwählen, welche Kennzahlen erscheinen, Vergleichszeiträume festzulegen (Tag-zu-Tag, Woche-zu-Woche oder Monat-zu-Monat) und die Mitarbeiter-Bestenliste hinzuzufügen oder zu entfernen. Betreiben Sie mehrere Standorte, können Sie ein separates Brief pro Standort oder eine konsolidierte Ansicht erhalten. Sie können auch die Zustellzeit festlegen — die meisten Ladeninhaber bevorzugen den Erhalt 30 Minuten vor Öffnung, sodass sie Zeit haben, es bei einem Kaffee vor dem ersten Kunden durchzugehen.',
      },
      {
        heading: 'Auf Ihr Brief reagieren',
        body: 'Das beste Daily Brief ist eines, das zu Handlungen führt. War der Umsatz gestern niedriger, fragen Sie die KI, warum: „Warum war der Kassenumsatz gestern niedriger als üblich?" Läuft ein Produkt knapp, füllen Sie es auf, bevor das Geschäft öffnet. Übertrifft ein Kassierer die anderen konstant beim Warenkorbwert, verstehen Sie, was er anders macht, und teilen Sie es mit dem Team. Das Brief ist kein Bericht zum Abheften — es ist ein Handlungsanstoß. Über Wochen und Monate hinweg baut die tägliche Durchsicht Ihres Briefs ein intuitives Verständnis für die Rhythmen Ihres Geschäfts auf, das keine noch so umfangreiche Ad-hoc-Berichterstattung ersetzen kann.',
      },
    ],
    faq: [
      {
        q: 'Muss ich etwas konfigurieren, damit Kassendaten in meinem Brief erscheinen?',
        a: 'Nein. Sobald die Kasse aktiviert ist, bezieht das Daily Brief ab dem nächsten Morgen automatisch Einzelhandelsdaten ein. Welche Kennzahlen erscheinen, können Sie in den Einstellungen anpassen.',
      },
      {
        q: 'Kann ich auch ein Mittags-Brief erhalten?',
        a: 'Ja. Gehen Sie zu Einstellungen → Daily Brief → Zeitplan und fügen Sie eine zweite Zustellung zu Ihrer bevorzugten Zeit hinzu. Manche Ladeninhaber stellen eine für die Öffnung und eine für nach dem Mittagsansturm ein.',
      },
    ],
  },

  'pos-business-pulse-impact': {
    title: 'Wie Kassentransaktionen Ihren Business-Pulse-Score beeinflussen',
    description:
      'Ihr Business-Pulse-Score berücksichtigt Kassenumsatztrends, Bestandsgesundheit und Transaktionsmuster. Hier erfahren Sie genau, wie das funktioniert.',
    keywords: [
      'Business Pulse Kassensystem',
      'Kassensystem-Gesundheitsscore',
      'Einzelhandels-Business-Score',
      'AskBiz Pulse Kassensystem',
      'Kassensystem-Leistungsscore',
      'Geschäftsgesundheit Einzelhandel',
    ],
    keyTakeaways: [
      'Kassenumsatztrends, Bestandsgesundheit und Rückerstattungsquoten fließen alle in Ihren Business-Pulse-Score ein.',
      'Konstanter täglicher Kassenumsatz verbessert die Stabilitätskomponente Ihres Scores.',
      'Hohe Rückerstattungsquoten oder häufige Fehlbestände drücken Ihren Score nach unten.',
    ],
    content: [
      {
        heading: 'Was der Business-Pulse-Score misst',
        body: 'Der Business Pulse ist ein zusammengesetzter Score von 0 bis 100, der die Gesamtgesundheit Ihres Unternehmens widerspiegelt. Er kombiniert fünf Dimensionen: Umsatzgesundheit (Trend, Konstanz, Wachstum), Liquiditätsgesundheit (Reichweite, Forderungen), Kundengesundheit (Bindung, Abwanderungsrisiko), operative Gesundheit (Rückerstattungen, Auftragserfüllung, Lieferantenzuverlässigkeit) und Marktsignale. Ist die Kasse aktiviert, fließen Ihre Ladentransaktionsdaten direkt in die Dimensionen Umsatz und Betrieb ein. Das bedeutet: Jeder Verkauf, den Sie abwickeln — und jede Rückerstattung, die Sie ausstellen — hat einen messbaren Einfluss auf Ihren Pulse-Score. Der Score wird für Nutzer der kostenlosen Stufe täglich neu berechnet und für Nutzer der Growth- und Business-Pläne in Echtzeit.',
      },
      {
        heading: 'Wie Kassendaten jede Dimension beeinflussen',
        body: '**Umsatzgesundheit** wird am direktesten beeinflusst. Der Pulse verfolgt Ihren Kassenumsatztrend über rollierende 7- und 30-Tage-Fenster. Konstanter oder wachsender Umsatz treibt den Score nach oben; sinkender Umsatz zieht ihn nach unten. Auch Volatilität zählt — ein Geschäft, das täglich 500 £ erzielt, erreicht bei der Konstanz einen höheren Score als eines, das zwischen 200 £ und 800 £ schwankt, selbst wenn die Durchschnittswerte identisch sind. **Operative Gesundheit** berücksichtigt Ihre Rückerstattungsquote (Rückerstattungen als Prozentsatz des Bruttoumsatzes), die Häufigkeit von Fehlbeständen und den Lagerumschlag. Eine hohe Rückerstattungsquote deutet auf Produktqualitäts- oder Kundenzufriedenheitsprobleme hin. Häufige Fehlbestände deuten auf schlechte Bestandsplanung hin. Beides senkt Ihren operativen Score.',
      },
      {
        heading: 'Den Pulse mit Kassendaten verbessern',
        body: 'Konzentrieren Sie sich auf die Hebel, die Sie beeinflussen können. Um die Umsatzkonstanz zu verbessern, analysieren Sie Ihre täglichen Verkaufsmuster und beheben Sie Einbrüche — ist Montag immer ruhig? Erwägen Sie eine Montagsaktion. Um Ihre Rückerstattungsquote zu verbessern, gehen Sie den Gründen auf den Grund: Werden bestimmte Produkte häufiger zurückgegeben? Konzentrieren sich Rückerstattungen auf einen Mitarbeiter? Um die Bestandsgesundheit zu verbessern, richten Sie Bestandswarnungen in AskBiz POS ein und füllen Sie proaktiv statt reaktiv auf. Jede dieser Maßnahmen wirkt auf eine bestimmte Pulse-Dimension und sollte bei konsequenter Umsetzung innerhalb von ein bis zwei Wochen eine messbare Verbesserung zeigen.',
      },
      {
        heading: 'Ihren Pulse-Trend über die Zeit lesen',
        body: 'Ein einzelner Pulse-Score ist eine Momentaufnahme. Der eigentliche Wert liegt im Trend. Gehen Sie zu **Intelligence → Business Pulse → Trend**, um Ihren Score über die letzten 90 Tage zu sehen. Achten Sie auf Wendepunkte — Momente, in denen sich der Score in seine Richtung änderte — und bringen Sie sie mit dem in Verbindung, was im Unternehmen geschah. Ist der Score gesunken, als Ihnen ein wichtiges Produkt ausging? Ist er gestiegen, als Sie einen neuen Kassierer eingestellt und die Warteschlangen verkürzt haben? Diese Zusammenhänge verwandeln den Pulse von einer Vanity-Kennzahl in ein echtes Diagnosewerkzeug. Mit der Zeit entwickeln Sie ein intuitives Gespür dafür, was Ihren Score bewegt, und diese Intuition wird Ihre täglichen Entscheidungen verbessern.',
      },
    ],
    faq: [
      {
        q: 'Behandelt der Pulse-Score Kassen- und Online-Umsatz gleich?',
        a: 'Ja. Umsatz ist Umsatz, unabhängig vom Kanal. Der Pulse kombiniert alle angebundenen Quellen zu einer einzigen Umsatzgesundheitsbewertung, gewichtet nach ihrem Anteil am Gesamtumsatz.',
      },
      {
        q: 'Wie schnell wirkt sich eine Kassen-Rückerstattung auf meinen Pulse aus?',
        a: 'Auf Growth- und Business-Plänen aktualisiert sich der Pulse in Echtzeit. Auf der kostenlosen Stufe wird er über Nacht neu berechnet. Eine einzelne Rückerstattung bei einem gesunden Unternehmen hat vernachlässigbare Auswirkungen — der Score reagiert auf Muster, nicht auf einzelne Transaktionen.',
      },
    ],
  },

  'pos-offline-mode': {
    title: 'Offline-Modus: Was passiert, wenn Ihr Internet mitten im Verkauf ausfällt',
    description:
      'AskBiz POS ist eine PWA, die kurze Verbindungsausfälle abfedern kann. Hier erfahren Sie, was offline funktioniert, was nicht, und wie Sie sich reibungslos erholen.',
    keywords: [
      'Kassensystem Offline-Modus',
      'Kassensystem ohne Internet',
      'Offline-Kassensystem',
      'PWA offline Einzelhandel',
      'Kassensystem Verbindungsprobleme',
      'AskBiz POS offline',
    ],
    keyTakeaways: [
      'AskBiz POS speichert Ihren Produktkatalog lokal zwischen, sodass Sie während kurzer Ausfälle weiter Artikel in den Warenkorb legen können.',
      'Transaktionen werden lokal in eine Warteschlange gestellt und synchronisieren automatisch, sobald die Verbindung zurückkehrt.',
      'Längere Ausfälle (über 30 Minuten) erfordern einen manuellen Abgleich — stellen Sie die Verbindung immer so schnell wie möglich wieder her.',
    ],
    content: [
      {
        heading: 'Wie der Offline-Modus funktioniert',
        body: 'AskBiz POS läuft als Progressive Web App, was bedeutet, dass der Anwendungscode und Ihr Produktkatalog nach dem ersten Laden auf dem Gerät zwischengespeichert werden. Bricht Ihre Internetverbindung während eines Verkaufs ab, bleibt die App funktionsfähig — Sie können weiterhin Produkte scannen, Artikel in den Warenkorb legen, Mengen anpassen und den Kassiervorgang abschließen. Die Transaktion wird lokal auf dem Gerät gespeichert und in eine Sync-Warteschlange eingereiht. Kehrt die Verbindung zurück, wird die Warteschlange automatisch verarbeitet, und alle ausstehenden Transaktionen werden auf den Server hochgeladen. Sie sehen ein kleines Banner am oberen Bildschirmrand, das den Offline-Status anzeigt, und eine weitere Bestätigung, sobald die Synchronisierung abgeschlossen ist.',
      },
      {
        heading: 'Was funktioniert und was nicht',
        body: '**Funktioniert offline:** Durchsuchen Ihres Produktkatalogs, Hinzufügen von Artikeln zum Warenkorb, Verarbeitung von Verkäufen (nur bar — Kartenlesegeräte benötigen eine Verbindung), Erstellen eines lokalen Belegs. **Funktioniert nicht offline:** Kamerascan für neue, noch nicht im Katalog erfasste Produkte (die Erkennungs-API benötigt eine Serververbindung), Echtzeit-Bestandsprüfungen, Versand von WhatsApp-Belegen, Mitarbeiter-Login per Magic Link und Synchronisierung mit Dashboards. Kartenzahlungen erfordern eine aktive Verbindung zum Zahlungsabwickler — sind Sie offline, können Sie nur Bargeld annehmen. Diese Einschränkung liegt am Kartennetzwerk, nicht an AskBiz.',
      },
      {
        heading: 'Erholung von einem längeren Ausfall',
        body: 'Kurze Ausfälle von wenigen Minuten werden nahtlos abgefedert — die Sync-Warteschlange wird verarbeitet, und alles gleicht sich automatisch ab. Längere Ausfälle von 30 Minuten oder mehr erzeugen eine längere Warteschlange, deren Synchronisierung bei Wiederherstellung der Verbindung eine Minute dauern kann. In dieser Zeit sind Dashboard-Daten und Bestandsstände vorübergehend nicht aktuell. Verliert das Gerät den Strom oder stürzt der Browser ab, während offline Transaktionen in der Warteschlange stehen, bewahrt der Service Worker der PWA die Warteschlange im lokalen Speicher. Öffnen Sie die App wieder, versucht sie, ausstehende Transaktionen zu synchronisieren. Geht in seltenen Fällen eine Transaktion verloren, können Sie manuell anhand der papiernen oder lokalen Belege abgleichen, die Sie während des Ausfalls ausgestellt haben.',
      },
      {
        heading: 'Best Practices für die Konnektivität',
        body: 'Vorbeugen ist besser als reparieren. Nutzen Sie für Ihr Kassengerät eine dedizierte Breitbandverbindung statt sich auf öffentliches WLAN zu verlassen. Halten Sie einen mobilen 4G/5G-Hotspot als Backup bereit — eine einfache SIM-Karte für 10 £/Monat kann Sie vor Umsatzverlust bei einem Breitbandausfall bewahren. Positionieren Sie Ihr Kassengerät in gutem WLAN-Empfangsbereich — dicke Wände und Metallregale können das Signal beeinträchtigen. Arbeiten Sie auf Märkten, Pop-ups oder Outdoor-Veranstaltungen mit unzuverlässiger Verbindung, laden Sie Ihren vollständigen Produktkatalog vorab und nehmen Sie einen mobilen Hotspot mit. Testen Sie Ihre Offline-Fähigkeit, bevor Sie sie brauchen — versetzen Sie Ihr Gerät in den Flugmodus und führen Sie eine Übungstransaktion durch, um sicherzustellen, dass alles funktioniert.',
      },
    ],
    faq: [
      {
        q: 'Verliere ich Verkaufsdaten, wenn mein Internet ausfällt?',
        a: 'Nein. Transaktionen werden lokal auf dem Gerät gespeichert und synchronisieren, sobald die Verbindung zurückkehrt. Daten sind nur gefährdet, wenn das Gerät den Strom verliert UND der Browser-Cache vor der Wiederverbindung geleert wird — was äußerst selten vorkommt.',
      },
      {
        q: 'Kann ich Kartenzahlungen offline verarbeiten?',
        a: 'Nein. Kartenzahlungen erfordern eine aktive Verbindung zum Zahlungsabwickler. Während eines Ausfalls können Sie nur Bargeld annehmen. Das ist eine Einschränkung der Kartennetzwerke, nicht von AskBiz.',
      },
    ],
  },

  'multi-location-retail-management': {
    title: 'Multi-Standort-Einzelhandelsmanagement: Der komplette Leitfaden',
    description:
      'Warum separater Bestand je Filiale wichtig ist, wie Sie Multi-Standort-Betriebe strukturieren, und die häufigen Fallstricke, die wachsenden Einzelhändlern zum Verhängnis werden.',
    keywords: [
      'Multi-Standort-Einzelhandel',
      'mehrere Filialen verwalten',
      'Filialverwaltung',
      'Einzelhandelsexpansion',
      'zweite Filiale',
      'Multi-Site-Einzelhandel',
    ],
    keyTakeaways: [
      'Jede Filiale sollte einen unabhängigen Bestand führen, um Überverkäufe zu vermeiden und präzise standortbezogene Berichte zu ermöglichen.',
      'Zentralisierte Eigentümerschaft bei dezentralem Betrieb ist das Standardmodell — Mitarbeiter arbeiten lokal, der Inhaber sieht alles.',
      'Der häufigste Fehler bei der Eröffnung einer zweiten Filiale ist, den Bestand als einen einzigen gemeinsamen Pool zu behandeln.',
    ],
    content: [
      {
        heading: 'Warum ein Geschäft einfach ist und zwei Geschäfte schwierig sind',
        body: 'Ein einzelnes Geschäft zu betreiben ist unkompliziert: ein Bestand, ein Team, eine Kasse. In dem Moment, in dem Sie eine zweite Filiale eröffnen, vervielfacht sich die Komplexität. Ein Bestand, der eine einzige Liste war, wird zu zwei Listen, die auseinanderlaufen können. Mitarbeiter, die alles wussten, kennen nun nur noch ihre Filiale. Ein Umsatz, der eine Zahl war, wird zu zwei Zahlen, die verglichen, zusammengeführt und eingeordnet werden müssen. Die Einzelhändler, die erfolgreich skalieren, sind diejenigen, die Systeme für diese Komplexität aufbauen, bevor sie die zweite Tür öffnen.',
      },
      {
        heading: 'Das Prinzip des separaten Bestands',
        body: 'Die wichtigste Regel im Multi-Standort-Einzelhandel lautet, dass jede Filiale ihren eigenen Bestand führen muss. Ein Produkt mit 20 Einheiten auf Lager bedeutet nichts, wenn Sie nicht wissen, ob diese 20 Einheiten in Ihrem Ladengeschäft in der Innenstadt oder in Ihrem Lager liegen. Separater Bestand bedeutet, dass jede Filiale ihre eigenen Bestandsmengen verfolgt, ihre eigenen Bestandswarnungen auslöst und ihre eigene Produktverfügbarkeit anzeigt. Das verhindert den mit Abstand häufigsten Multi-Standort-Fehler: Einem Kunden in Filiale A wird gesagt, ein Produkt sei auf Lager, obwohl es tatsächlich in Filiale B im Regal liegt.',
      },
      {
        heading: 'Zentralisierte Sichtbarkeit, dezentraler Betrieb',
        body: 'Der Inhaber oder Manager muss konsolidierte Daten über alle Filialen hinweg sehen — Gesamtumsatz, kombinierten Bestandswert, Gesamtmarge. Der Kassierer in jeder Filiale muss dagegen nur seine eigenen Produkte und seine eigenen Verkäufe sehen. Dieses duale Ansichtsmodell ist Standard in modernen Kassensystemen. Mitarbeiter sind aus betrieblichen und sicherheitstechnischen Gründen an ihre Filiale gebunden, während der Inhaber ein Dashboard hat, das alles zusammenführt und die Möglichkeit bietet, in jeden einzelnen Standort einzutauchen.',
      },
      {
        heading: 'Häufige Fallstricke bei der Expansion',
        body: 'Die häufigsten Fehler, die Einzelhändler bei der Eröffnung einer zweiten Filiale machen: den Bestand als einen gemeinsamen Pool zu behandeln (führt zu Überverkäufen), Mitarbeiter nicht bestimmten Filialen zuzuordnen (führt zu Datenverwirrung), die Filialleistung nicht zu vergleichen (ein Standort unterläuft unbemerkt die Erwartungen), und keinen Bestandstransferprozess zu haben (Überschuss in einer Filiale, während der anderen die Ware ausgeht). Ein gutes Multi-Filial-Kassensystem verhindert all das, indem es die Trennung auf Datenebene erzwingt.',
      },
      {
        heading: 'Wann Sie eine dritte Filiale eröffnen sollten',
        body: 'Ist Ihre zweite Filiale profitabel, betrieblich stabil, und bewältigen Ihre Systeme die Zwei-Standort-Komplexität ohne manuelle Behelfslösungen, sind Sie bereit für eine dritte. Der Sprung von zwei auf drei ist leichter als von eins auf zwei, weil Sie die strukturellen Probleme bereits gelöst haben. Die entscheidende Kennzahl, die Sie im Blick behalten sollten, ist, ob Ihre Margen pro Filiale stabil bleiben, während Sie Standorte hinzufügen — schrumpfen die Margen mit jeder neuen Filiale, verzetteln Sie sich zu sehr.',
      },
    ],
    faq: [
      {
        q: 'Sollte ich für jede Filiale ein separates Kassensystem verwenden?',
        a: 'Nein. Ein einziges Kassensystem mit Multi-Filial-Unterstützung bietet Ihnen konsolidierte Berichte, einfachere Mitarbeiterverwaltung und die Möglichkeit, Bestand zwischen Standorten zu transferieren. Separate Systeme schaffen Datensilos.',
      },
      {
        q: 'Wie viele Filialen kann ein kleines Unternehmen realistisch verwalten?',
        a: 'Das hängt vom Unternehmen ab, aber die meisten KMU finden 2–5 Standorte mit guten Systemen handhabbar. Darüber hinaus benötigen Sie in der Regel Regionalmanager oder Gebietsleiter, um die Qualität zu sichern.',
      },
    ],
  },
}
