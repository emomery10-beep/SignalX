// Academy article translations — Deutsch (de) — Wave C, batch 6.
//
// Tax & Compliance cluster (UK tax/compliance articles from
// lib/academy-content.ts, plus international tax articles from
// lib/academy-pseo-batch7.ts): what-is-vat, what-is-paye,
// what-is-rd-tax-credits, what-is-making-tax-digital,
// what-is-national-insurance-tax, what-is-gdpr-for-business,
// what-is-income-tax-self-assessment, what-is-auto-enrolment-tax,
// what-is-ir35, what-is-companies-house, what-is-capital-gains-tax-business,
// what-is-employment-law-compliance, what-is-business-rates,
// what-is-a-tax-investigation, what-is-the-annual-investment-allowance,
// what-is-stamp-duty-business, what-is-transfer-pricing-uk,
// what-is-an-eori-number, what-is-a-vat-inspection,
// what-is-transfer-pricing, what-is-a-double-tax-treaty,
// what-is-withholding-tax, what-is-permanent-establishment,
// what-is-thin-capitalisation, what-is-country-by-country-reporting.
//
// Translated fields only (title, description, keywords, content,
// keyTakeaways, faq) — see lib/academy-i18n/README.md for the contract.
// slug/category/categorySlug/difficulty/readTime/relatedSlugs are
// intentionally absent; those stay canonical/English from the source files.
//
// LOCKED GLOSSARY (reuse verbatim in every other de batch):
//   POS -> Kassensystem | profit -> Gewinn | revenue -> Umsatz
//   stock -> Bestand | margin -> Marge | cashier -> Kassierer
//   receipt -> Beleg | refund -> Rückerstattung | VAT -> Mehrwertsteuer
//   dashboard -> Dashboard | staff -> Mitarbeiter | role -> Rolle
//
// Note: this batch covers UK-specific tax/compliance terminology (HMRC,
// PAYE, Companies House, etc.) which has no direct German equivalent —
// these are treated as explained UK institutions/schemes (kept in English
// with German explanatory text), consistent with how other locale batches
// handle jurisdiction-specific proper nouns.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveC6Translations: LocaleTranslations = {
  'what-is-vat': {
    title: 'Was ist die Mehrwertsteuer (VAT)?',
    description:
      'Die Mehrwertsteuer (VAT) wird in Großbritannien auf die meisten Waren und Dienstleistungen erhoben. Erfahren Sie mehr über die Sätze, Registrierungsschwellen und die korrekte Verbuchung.',
    keywords: [
      'Mehrwertsteuer',
      'VAT',
      'VAT-Registrierung',
      'Umsatzsteuervoranmeldung',
      'Making Tax Digital',
    ],
    keyTakeaways: [
      'Sie müssen sich für VAT registrieren, sobald der steuerpflichtige Umsatz in einem 12-Monats-Zeitraum 90.000 £ übersteigt',
      'Der Standard-VAT-Satz beträgt 20 %; der ermäßigte Satz liegt bei 5 %; manche Waren sind nullsatzbesteuert',
      'VAT-registrierte Unternehmen erheben VAT von Kunden und führen sie abzüglich der auf Einkäufe gezahlten VAT an HMRC ab',
      'Making Tax Digital verlangt, dass VAT-Meldungen mit kompatibler Software eingereicht werden',
    ],
    content: [
      {
        heading: 'Was VAT ist',
        body: 'Die Mehrwertsteuer (Value Added Tax) ist eine Verbrauchssteuer, die auf den Preis von Waren und Dienstleistungen aufgeschlagen wird. VAT-registrierte Unternehmen berechnen VAT auf ihre Verkäufe (Ausgangs-VAT), ziehen die auf Einkäufe gezahlte VAT ab (Vorsteuer) und führen die Differenz an HMRC ab. Übersteigt die Vorsteuer die Ausgangs-VAT — häufig bei neu gegründeten Unternehmen mit hohen Anlaufinvestitionen —, erstattet HMRC die Differenz.',
      },
      {
        heading: 'Registrierungsschwelle und Sätze',
        body: 'Sie müssen sich für VAT registrieren, sobald der steuerpflichtige Umsatz innerhalb eines rollierenden 12-Monats-Zeitraums 90.000 £ übersteigt. Eine freiwillige Registrierung unterhalb der Schwelle lohnt sich, wenn Ihre Kunden überwiegend selbst VAT-registrierte Unternehmen sind. Der Standardsatz beträgt 20 %. Der ermäßigte Satz von 5 % gilt für Haushaltsenergie und einige medizinische Produkte. Nullsatzbesteuert sind unter anderem die meisten Lebensmittel, Kinderkleidung, Bücher und der öffentliche Nahverkehr — Unternehmen können die Vorsteuer auf Kosten im Zusammenhang mit nullsatzbesteuerten Lieferungen dennoch geltend machen.',
      },
      {
        heading: 'VAT-Meldungen einreichen',
        body: 'VAT-registrierte Unternehmen reichen ihre Meldungen vierteljährlich ein (monatliche oder jährliche Regelungen sind ebenfalls möglich). Die Meldung weist Ausgangs- und Vorsteuer für den Zeitraum aus, die Differenz wird an HMRC gezahlt oder von dort erstattet. Meldung und Zahlung müssen innerhalb von 1 Monat und 7 Tagen nach Ende des Zeitraums erfolgen. Verspätete Zahlung führt zu einem Strafpunktesystem, das letztlich zu Bußgeldern von 200 £ zuzüglich täglicher Verzugszinsen führt.',
      },
      {
        heading: 'Making Tax Digital für VAT',
        body: 'Seit April 2022 müssen alle VAT-registrierten Unternehmen digitale VAT-Aufzeichnungen führen und Meldungen über Making-Tax-Digital-kompatible Software einreichen. Zahlen können nicht mehr manuell auf der HMRC-Website eingegeben werden — Einreichungen müssen aus Buchhaltungssoftware (Xero, QuickBooks, Sage, FreeAgent) stammen, die direkt mit HMRC verbunden ist. Für Unternehmen, die ihre Aufzeichnungen in Tabellenkalkulationen führen, gibt es Brückensoftware.',
      },
      {
        heading: 'VAT-Regelungen für kleinere Unternehmen',
        body: 'Die Flat-Rate-Scheme berechnet einen festen Prozentsatz des Bruttoumsatzes, statt Ausgangs- und Vorsteuer separat zu erfassen — einfacher in der Verwaltung, aber nicht immer finanziell vorteilhaft. Die Cash-Accounting-Scheme erlaubt es, VAT bei Zahlungseingang bzw. -ausgang statt bei Rechnungsstellung zu verbuchen. Die Annual-Accounting-Scheme erlaubt eine einzige VAT-Meldung pro Jahr mit Vorauszahlungen — ebenfalls eine administrative Vereinfachung.',
      },
    ],
  },

  'what-is-paye': {
    title: 'Was ist PAYE?',
    description:
      'PAYE ist das System, mit dem Arbeitgeber Einkommensteuer und Sozialversicherungsbeiträge vom Lohn der Mitarbeiter einbehalten. Erfahren Sie, wie Sie die Lohnabrechnung compliant durchführen.',
    keywords: [
      'PAYE',
      'Lohnabrechnung',
      'Einkommensteuer',
      'National Insurance',
      'Real Time Information',
    ],
    keyTakeaways: [
      'PAYE verpflichtet Arbeitgeber, Einkommensteuer und National Insurance vom Lohn der Mitarbeiter einzubehalten',
      'Arbeitgeber zahlen zusätzlich Arbeitgeber-National-Insurance oben auf die Abzüge der Mitarbeiter',
      'Real Time Information (RTI) verlangt Lohnmeldungen an HMRC am oder vor jedem Zahltag',
      'Lohnbuchhaltungssoftware automatisiert die meisten PAYE-Pflichten — manuelle Lohnabrechnung ist fehleranfällig',
    ],
    content: [
      {
        heading: 'Was PAYE ist',
        body: 'Pay As You Earn ist das britische System, mit dem Arbeitgeber Einkommensteuer und Sozialversicherungsbeiträge (National Insurance) vom Lohn der Mitarbeiter einbehalten und direkt an HMRC abführen. Statt die Steuer jährlich als Pauschalbetrag zu zahlen, verteilt PAYE die Verpflichtung auf jeden Lohnzeitraum. Arbeitgeber fungieren als unbezahlte Steuereinzieher — eine fehlerhafte Anwendung von PAYE führt zu Bußgeldern für den Arbeitgeber.',
      },
      {
        heading: 'Was Arbeitgeber einbehalten und zahlen müssen',
        body: 'Vom Bruttolohn jedes Mitarbeiters behalten Arbeitgeber Einkommensteuer (anhand von HMRC-Steuercodes) und Arbeitnehmer-National-Insurance-Beiträge ein. Zusätzlich zahlen Arbeitgeber die Arbeitgeber-National-Insurance auf Einkommen oberhalb der Secondary Threshold — derzeit 13,8 %, steigend auf 15 % ab April 2025. Dieser Arbeitgeberbeitrag ist eine eigenständige Steuer auf die Beschäftigung, zusätzlich zum Abzug beim Mitarbeiter. Der Arbeitgeber übernimmt außerdem Abzüge für Studienkredite, Rentenbeiträge und gesetzliche Zahlungen.',
      },
      {
        heading: 'Real Time Information',
        body: 'Seit 2013 verlangt HMRC von Arbeitgebern, am oder vor jedem Zahltag eine Full Payment Submission (FPS) über Real Time Information einzureichen. Sind in einem Zeitraum keine Mitarbeiter zu bezahlen, wird eine Employer Payment Summary (EPS) eingereicht. Fehlende oder verspätete RTI-Meldungen führen zu Bußgeldern — 100 £ pro Monat für Arbeitgeber mit 1-9 Mitarbeitern, steigend mit der Belegschaftsgröße.',
      },
      {
        heading: 'Lohnbuchhaltungssoftware',
        body: 'PAYE manuell durchzuführen ist komplex und fehleranfällig. Lohnbuchhaltungssoftware — Xero Payroll, Sage Payroll, BrightPay, QuickBooks Payroll — automatisiert die Berechnung der Abzüge, erstellt Gehaltsabrechnungen, reicht RTI-Meldungen ein und berechnet Rentenbeiträge. Kostenlose einfache Lohnbuchhaltungssoftware ist über die von HMRC zugelassene Liste für Unternehmen mit weniger als 10 Mitarbeitern erhältlich.',
      },
      {
        heading: 'Arbeitgeberpflichten über PAYE hinaus',
        body: 'Der Betrieb von PAYE bringt weitere Pflichten mit sich. Auto-Enrolment verpflichtet Arbeitgeber, berechtigte Mitarbeiter in eine qualifizierte betriebliche Altersvorsorge einzuschreiben. Gesetzliche Zahlungen wie Statutory Sick Pay und Statutory Maternity Pay müssen berechtigten Mitarbeitern gezahlt werden. Nach jedem Steuerjahresende muss jedem Mitarbeiter ein P60-Jahreszertifikat mit einer Zusammenfassung seiner Einkünfte und Abzüge ausgestellt werden.',
      },
    ],
  },

  'what-is-rd-tax-credits': {
    title: 'Was sind R&D Tax Credits?',
    description:
      'R&D Tax Credits belohnen britische Unternehmen für Investitionen in Innovation. Eine der wertvollsten verfügbaren Steuervergünstigungen — und oft nicht beantragt.',
    keywords: [
      'R&D Tax Credits',
      'Forschung und Entwicklung',
      'Innovate UK',
      'HMRC R&D',
      'SME R&D Scheme',
    ],
    keyTakeaways: [
      'R&D Tax Credits ermöglichen einen erhöhten Abzug qualifizierender F&E-Kosten und senken damit die Körperschaftsteuerlast',
      'Verlustunternehmen können statt eines Steuerabzugs eine Barauszahlung von HMRC beantragen',
      'Qualifizierende F&E ist breiter gefasst, als die meisten Gründer annehmen — Softwareentwicklung fällt häufig darunter',
      'Anträge müssen innerhalb von 2 Jahren nach Ende des Abrechnungszeitraums gestellt werden',
    ],
    content: [
      {
        heading: 'Was R&D Tax Credits sind',
        body: 'R&D Tax Credits sind ein Anreiz der britischen Regierung, der es Unternehmen mit Investitionen in qualifizierende Forschung und Entwicklung erlaubt, einen erhöhten Steuerabzug geltend zu machen — sie zahlen also effektiv weniger Körperschaftsteuer — oder, bei Verlustunternehmen, eine Barauszahlung von HMRC zu erhalten. Das Programm soll Innovation fördern, indem es deren Kosten nach Steuern senkt, und wird von berechtigten Unternehmen häufig nicht in Anspruch genommen.',
      },
      {
        heading: 'Was als F&E zählt',
        body: 'HMRC definiert qualifizierende F&E als Arbeit, die einen Fortschritt in Wissenschaft oder Technologie durch die Lösung einer wissenschaftlichen oder technologischen Unsicherheit anstrebt — das heißt, zu Beginn ist nicht bekannt, ob und wie etwas erreicht werden kann. Software zu entwickeln, die die Lösung echter neuartiger technischer Probleme erfordert, qualifiziert häufig. Routinemäßige Softwareentwicklung, kosmetische Produktänderungen oder sozialwissenschaftliche Forschung qualifizieren nicht.',
      },
      {
        heading: 'Die SME- und RDEC-Programme',
        body: 'Die SME R&D Relief gilt für Unternehmen mit weniger als 500 Mitarbeitern und entweder einem Umsatz unter 100 Millionen € oder einer Bilanzsumme unter 86 Millionen €. Ab April 2023 gewährt das Programm einen zusätzlichen Abzug von 86 % auf qualifizierende Kosten. Verlustbringende KMU können den Verlust gegen eine Barauszahlung von HMRC eintauschen. Der R&D Expenditure Credit (RDEC) gilt für große Unternehmen und gewährt eine 20 % Above-the-Line-Gutschrift auf qualifizierende Kosten.',
      },
      {
        heading: 'Qualifizierende Kosten',
        body: 'Die wichtigsten qualifizierenden Kostenkategorien sind: Personalkosten (Gehälter, Arbeitgeber-NIC, Rentenbeiträge) von Mitarbeitern, die direkt in F&E eingebunden sind; Subunternehmerkosten (65 % der Zahlungen an qualifizierende Subunternehmer); Verbrauchsmaterialien einschließlich Materialien und Softwarelizenzen, die im F&E-Prozess verwendet werden. Führen Sie detaillierte Zeitaufzeichnungen der Mitarbeiter, die an qualifizierender F&E arbeiten — dies ist entscheidend, um den Antrag zu belegen.',
      },
      {
        heading: 'Wie man den Antrag stellt',
        body: 'R&D Tax Credits werden über die jährliche Körperschaftsteuererklärung sowie einen begleitenden F&E-Bericht mit Beschreibung der qualifizierenden Projekte und Kosten beantragt. Anträge müssen innerhalb von 2 Jahren nach Ende des Abrechnungszeitraums eingereicht werden. HMRC hat die Prüfung von R&D-Anträgen deutlich verschärft — die Qualität und Genauigkeit der technischen Beschreibung im Antragsbericht gewinnt zunehmend an Bedeutung. Viele Unternehmen beauftragen R&D-Tax-Credit-Spezialisten auf Erfolgshonorarbasis.',
      },
    ],
  },

  'what-is-making-tax-digital': {
    title: 'Was ist Making Tax Digital (MTD)?',
    description:
      'Making Tax Digital ist das HMRC-Programm zur Digitalisierung von Steueraufzeichnungen und -meldungen. Erfahren Sie, was es verlangt und wann welche Phase gilt.',
    keywords: [
      'Making Tax Digital',
      'MTD',
      'digitale Steueraufzeichnungen',
      'MTD für VAT',
      'MTD für Einkommensteuer',
    ],
    keyTakeaways: [
      'MTD für VAT gilt für alle VAT-registrierten Unternehmen — Meldungen müssen mit kompatibler Software eingereicht werden',
      'MTD für Einkommensteuer gilt ab April 2026 für Selbstständige und Vermieter',
      'MTD für Körperschaftsteuer ist geplant, aber es gibt noch keinen bestätigten Zeitplan',
      'Cloud-Buchhaltungssoftware ist heute der einfachste Weg, aktuelle und künftige MTD-Anforderungen zu erfüllen',
    ],
    content: [
      {
        heading: 'Was Making Tax Digital ist',
        body: 'Making Tax Digital (MTD) ist das HMRC-Programm zur Digitalisierung von Steueraufzeichnungen und -meldungen für Unternehmen und Privatpersonen. Ziel ist es, Fehler durch manuelle Berechnungen zu reduzieren, Steuerkonten genauer und aktueller zu machen und langfristig eine nahezu zeitnahe Steuerveranlagung zu ermöglichen. MTD wird in Phasen für verschiedene Steuerarten eingeführt.',
      },
      {
        heading: 'MTD für VAT',
        body: 'MTD für VAT gilt seit April 2022 für alle VAT-registrierten Unternehmen. Anforderungen: digitale Aufzeichnung aller für VAT relevanten Transaktionen und Einreichung der Meldungen über HMRC-kompatible Software mit direkter API-Verbindung. Zahlen können nicht mehr manuell in das HMRC-Portal eingegeben werden. Kompatible Software umfasst Xero, QuickBooks, Sage und FreeAgent. Brückensoftware verbindet Tabellenkalkulationen mit HMRC für diejenigen, die noch nicht vollständig auf Cloud-Buchhaltung umgestellt haben.',
      },
      {
        heading: 'MTD für Einkommensteuer (Self Assessment)',
        body: 'MTD ITSA gilt ab April 2026 für Selbstständige und Vermieter mit einem Einkommen über 50.000 £, ab April 2027 erweitert auf Einkommen über 30.000 £. Betroffene Steuerpflichtige müssen digitale Aufzeichnungen führen und vierteljährliche Updates an HMRC übermitteln — viermal pro Jahr statt der bisherigen jährlichen Self-Assessment-Erklärung. Dies ist eine bedeutende Veränderung für Einzelunternehmer und Vermieter, die derzeit nur einmal jährlich melden.',
      },
      {
        heading: 'MTD für Körperschaftsteuer',
        body: 'HMRC hat angekündigt, dass MTD schließlich auch auf die Körperschaftsteuer ausgeweitet wird, aber es gibt noch kein bestätigtes Einführungsdatum. Die meisten Kommentatoren erwarten dies frühestens in den späten 2020er-Jahren. Kapitalgesellschaften können sich vorbereiten, indem sie jetzt auf Cloud-Buchhaltungssoftware umstellen — für VAT konforme Software wird voraussichtlich auch kompatibel sein, sobald MTD für Körperschaftsteuer eingeführt wird.',
      },
      {
        heading: 'Vorbereitung auf MTD',
        body: 'Wenn Sie noch keine Cloud-Buchhaltungssoftware nutzen, ist jetzt der richtige Zeitpunkt dafür. Cloud-Buchhaltung (Xero, QuickBooks, Sage, FreeAgent) automatisiert die von MTD geforderte Aufzeichnung, verbindet sich direkt mit HMRC für die Einreichung und bietet Echtzeit-Einblick in Ihre Konten. Der Umstieg lässt sich weit einfacher proaktiv bewältigen als reaktiv kurz vor einer Compliance-Frist.',
      },
    ],
  },

  'what-is-national-insurance-tax': {
    title: 'Was ist National Insurance für Unternehmer?',
    description:
      'National Insurance ist eine Steuer auf Einkommen, die staatliche Leistungen finanziert. Erfahren Sie mehr über die Klassen, Sätze und die Auswirkungen auf Ihre Kosten als Arbeitgeber und Geschäftsführer.',
    keywords: [
      'National Insurance',
      'NI-Beiträge',
      'Arbeitgeber-NI',
      'Employment Allowance',
      'Class 4 NI',
    ],
    keyTakeaways: [
      'Mitarbeiter zahlen Class-1-NI; Arbeitgeber zahlen zusätzlich Arbeitgeber-Class-1-NI',
      'Arbeitgeber-NI liegt derzeit bei 13,8 % auf Einkommen über 9.100 £ — steigend auf 15 % ab April 2025',
      'Die Employment Allowance senkt die Arbeitgeber-NI für berechtigte Unternehmen um bis zu 5.000 £ pro Jahr',
      'Selbstständige zahlen Class-4-NI auf ihren Gewinn über die Self-Assessment-Erklärung',
    ],
    content: [
      {
        heading: 'Was National Insurance ist',
        body: 'National Insurance ist eine Steuer auf Einkommen, die von Mitarbeitern, Arbeitgebern und Selbstständigen gezahlt wird. Die Beiträge finanzieren den National Health Service, die staatliche Rente und weitere Leistungen. Für Unternehmer stellt NI einen erheblichen Beschäftigungskostenfaktor über das reine Bruttogehalt hinaus dar — die Gesamtkosten für die Beschäftigung einer Person liegen deutlich über deren Bruttolohn.',
      },
      {
        heading: 'Class 1 für Mitarbeiter und Arbeitgeber',
        body: 'Mitarbeiter zahlen Class-1-NI in Höhe von 8 % auf Einkommen zwischen 12.570 £ und 50.270 £ und 2 % darüber hinaus. Arbeitgeber zahlen Arbeitgeber-Class-1-NIC in Höhe von 13,8 % auf Mitarbeitereinkommen über 9.100 £ pro Jahr — steigend auf 15 % ab April 2025. Dieser Arbeitgeberbeitrag ist eine eigene Steuer auf die Beschäftigung, getrennt von und zusätzlich zum Abzug beim Mitarbeiter selbst. Ein Gehalt von 40.000 £ kostet den Arbeitgeber insgesamt rund 44.500 £ oder mehr an Gesamtbeschäftigungskosten.',
      },
      {
        heading: 'Gehaltsstrategie für Geschäftsführer',
        body: 'Viele Geschäftsführer von Kapitalgesellschaften zahlen sich ein Gehalt an oder knapp über der NI-Schwelle und nehmen zusätzliches Einkommen als Dividenden — die niedrigeren Steuersätzen unterliegen und keine National Insurance auslösen. Ein Gehalt von 9.100-12.570 £ nutzt typischerweise den persönlichen Freibetrag aus und minimiert gleichzeitig die NI. Dies erfordert sorgfältige Planung: Das Unternehmen muss ausschüttungsfähige Gewinne haben, um Dividenden zu zahlen, und Dividendeneinkommen wird zu Dividendensätzen besteuert. Holen Sie sich immer professionellen Rat ein, bevor Sie eine Gehaltsstrategie für Geschäftsführer festlegen.',
      },
      {
        heading: 'Employment Allowance',
        body: 'Die Employment Allowance senkt Ihre gesamte Arbeitgeber-National-Insurance-Rechnung um bis zu 5.000 £ pro Jahr. Die meisten Unternehmen sind berechtigt. Ausnahmen sind unter anderem: Unternehmen, bei denen der einzige Mitarbeiter zugleich Geschäftsführer ist, öffentliche Einrichtungen sowie Unternehmen mit nur einem Mitarbeiter, der zugleich Geschäftsführer ist. Die Beantragung erfolgt über die Lohnbuchhaltungssoftware bei der RTI-Meldung. Wenn Sie berechtigt sind und sie nicht beanspruchen, zahlen Sie zu viel an HMRC.',
      },
      {
        heading: 'NI für Selbstständige',
        body: 'Selbstständige zahlen Class-4-NIC auf ihren Gewinn — 6 % auf Gewinne zwischen 12.570 £ und 50.270 £ und 2 % darüber hinaus. Class-2-NIC (ein fester Wochensatz) wurde ab April 2024 abgeschafft. Selbstständige mit Gewinnen unter dem Lower Profits Limit benötigen unter Umständen freiwillige Class-3-Beiträge, um ihre staatliche Rente abzusichern — prüfen Sie Ihr NI-Konto im HMRC-Portal auf eventuelle Lücken.',
      },
    ],
  },

  'what-is-gdpr-for-business': {
    title: 'Was ist die DSGVO und was bedeutet sie für Ihr Unternehmen?',
    description:
      'Die DSGVO regelt, wie Unternehmen personenbezogene Daten erheben, speichern und nutzen. Erfahren Sie mehr über Ihre wichtigsten Pflichten und die praktischen Schritte zur Einhaltung.',
    keywords: ['DSGVO', 'UK GDPR', 'Datenschutz', 'ICO', 'personenbezogene Daten'],
    keyTakeaways: [
      'UK GDPR gilt für jedes Unternehmen, das personenbezogene Daten von Personen im Vereinigten Königreich verarbeitet',
      'Sie benötigen eine Rechtsgrundlage für die Verarbeitung — berechtigtes Interesse, Einwilligung oder Vertrag sind am häufigsten',
      'Betroffene haben Rechte, darunter Auskunft, Löschung und Widerspruch gegen die Verarbeitung',
      'Die ICO kann Unternehmen bei schweren Verstößen mit bis zu 17,5 Millionen £ oder 4 % des weltweiten Jahresumsatzes belegen',
    ],
    content: [
      {
        heading: 'Was UK GDPR ist',
        body: 'Die UK General Data Protection Regulation gilt für jede Organisation, die personenbezogene Daten von Personen im Vereinigten Königreich verarbeitet. Nahezu jedes Unternehmen verarbeitet in irgendeiner Form personenbezogene Daten — Namen und E-Mail-Adressen von Kunden, Mitarbeiterdaten, Lieferantenkontakte —, weshalb UK GDPR praktisch für alle britischen Unternehmen unabhängig von ihrer Größe relevant ist.',
      },
      {
        heading: 'Die sechs Rechtsgrundlagen der Verarbeitung',
        body: 'Sie benötigen eine Rechtsgrundlage für die Verarbeitung personenbezogener Daten. Die sechs Grundlagen sind: Einwilligung (klare, informierte Zustimmung), Vertrag (notwendig zur Erfüllung eines Vertrags mit der betroffenen Person), rechtliche Verpflichtung (gesetzlich vorgeschrieben), lebenswichtige Interessen (Schutz von Leben), öffentliche Aufgabe (Aufgabe im öffentlichen Interesse) und berechtigte Interessen (Ihre berechtigten Interessen, sofern sie nicht durch die Rechte der betroffenen Person überwogen werden). Berechtigtes Interesse ist die flexibelste Grundlage und wird für die meisten geschäftlichen Verarbeitungen genutzt — erfordert jedoch eine dokumentierte Interessenabwägung.',
      },
      {
        heading: 'Rechte der betroffenen Personen',
        body: 'UK GDPR gewährt betroffenen Personen Rechte über ihre Daten: Auskunft (Subject Access Requests — innerhalb von 30 Tagen kostenlos zu erfüllen), Löschung (Recht auf Vergessenwerden, mit Ausnahmen), Berichtigung (Korrektur unrichtiger Daten), Einschränkung der Verarbeitung, Datenübertragbarkeit (maschinenlesbares Format) und das Widerspruchsrecht. Bauen Sie Prozesse zur Bearbeitung dieser Anfragen auf, bevor Sie sie erhalten — reaktiv unter Zeitdruck zu reagieren ist stressig.',
      },
      {
        heading: 'Die Datenschutzerklärung',
        body: 'Jedes Unternehmen, das personenbezogene Daten verarbeitet, muss eine Datenschutzerklärung bereitstellen, die erklärt: welche Daten Sie erheben, warum, wie lange Sie sie speichern, mit wem Sie sie teilen und welche Rechte betroffene Personen haben. Sie muss in klarer, einfacher Sprache verfasst und leicht zugänglich sein — üblicherweise als eigene Seite auf Ihrer Website. Erheben Sie Daten, die in der Erklärung nicht genannt sind, oder teilen Sie diese mit nicht aufgeführten Dritten, sind Sie nicht compliant.',
      },
      {
        heading: 'Datenpannen und die ICO',
        body: 'Kommt es zu einer Datenpanne — unbefugter Zugriff auf, Verlust von oder Zerstörung personenbezogener Daten — prüfen Sie, ob wahrscheinlich ein Risiko für die betroffenen Personen besteht. Ist dies der Fall, melden Sie den Vorfall innerhalb von 72 Stunden dem Information Commissioner\'s Office (ICO). Hochrisiko-Pannen erfordern eine direkte Benachrichtigung der betroffenen Personen. Die ICO kann Unternehmen bei schweren Verstößen mit bis zu 17,5 Millionen £ oder 4 % des weltweiten Jahresumsatzes belegen — in der Praxis konzentrieren sich Bußgelder jedoch auf große Organisationen mit systematischen Mängeln.',
      },
    ],
  },

  'what-is-income-tax-self-assessment': {
    title: 'Was ist die Einkommensteuer über Self Assessment für Unternehmer?',
    description:
      'Selbstständige und Geschäftsführer zahlen Einkommensteuer über Self Assessment. Erfahren Sie, wie es funktioniert und wie Sie Ihre Steuerlast legal senken.',
    keywords: [
      'Einkommensteuer',
      'Self Assessment',
      'Steuererklärung',
      'Dividendensteuer',
      'persönlicher Freibetrag',
    ],
    keyTakeaways: [
      'Selbstständige zahlen Einkommensteuer auf ihren Gewinn über Self Assessment',
      'Geschäftsführer zahlen Einkommensteuer auf Gehalt und Dividenden — Dividenden werden zu niedrigeren Sätzen besteuert',
      'Der persönliche Freibetrag (12.570 £) bedeutet, dass die ersten 12.570 £ des Einkommens steuerfrei sind',
      'Self-Assessment-Steuererklärungen müssen bis zum 31. Januar nach Ende des Steuerjahres online eingereicht werden',
    ],
    content: [
      {
        heading: 'Einkommensteuer für Selbstständige',
        body: 'Wenn Sie als Einzelunternehmer oder in einer Personengesellschaft tätig sind, sind Ihre Geschäftsgewinne Ihr persönliches Einkommen. Sie zahlen Einkommensteuer über Self Assessment — eine Steuererklärung bis zum 31. Januar für das vorangegangene Steuerjahr (6. April bis 5. April). Einkommensteuersätze: 20 % Grundsatz auf Einkommen von 12.570 £ bis 50.270 £; 40 % höherer Satz von 50.270 £ bis 125.140 £; 45 % zusätzlicher Satz oberhalb von 125.140 £.',
      },
      {
        heading: 'Geschäftsführer: Gehalt versus Dividenden',
        body: 'Geschäftsführer von Kapitalgesellschaften können Einkommen als Gehalt und Dividenden beziehen. Gehalt unterliegt Einkommensteuer und National Insurance. Dividenden werden aus versteuerten Unternehmensgewinnen gezahlt und zu niedrigeren Sätzen besteuert: 8,75 % Grundsatz, 33,75 % höherer Satz und 39,35 % zusätzlicher Satz. Der Dividendenfreibetrag liegt seit April 2024 bei 500 £ pro Jahr. Viele Geschäftsführer zahlen sich Gehalt bis zur NI-Schwelle und nehmen den Rest als Dividenden, um die Gesamtsteuerlast zu minimieren.',
      },
      {
        heading: 'Vorauszahlungen (Payments on Account)',
        body: 'Selbstständige, die mehr als 1.000 £ Steuern schulden, müssen zwei Vorauszahlungen für das folgende Jahr leisten — jeweils 50 % der Steuerschuld des laufenden Jahres, fällig am 31. Januar und 31. Juli. Im ersten Jahr der Steuererklärung können Sie im Januar 150 % Ihrer erwarteten Jahressteuerschuld schulden — 100 % für das laufende Jahr und 50 % als erste Vorauszahlung. Die Planung dieses Liquiditätsbedarfs ist unerlässlich.',
      },
      {
        heading: 'Der persönliche Freibetrag und Gutverdiener',
        body: 'Der persönliche Freibetrag von 12.570 £ bedeutet, dass die ersten 12.570 £ des Einkommens steuerfrei sind. Geschäftsführer nehmen dies typischerweise als Gehalt — nutzen so den persönlichen Freibetrag ohne Einkommensteuer. Der persönliche Freibetrag wird für jeweils 2 £ Einkommen über 100.000 £ um 1 £ reduziert und ist ab 125.140 £ vollständig aufgebraucht — dies erzeugt einen effektiven Grenzsteuersatz von 60 % auf Einkommen zwischen 100.000 £ und 125.140 £, wodurch Rentenbeiträge für Gutverdiener besonders wertvoll werden.',
      },
      {
        heading: 'Fristen bei Self Assessment',
        body: 'Die Frist für die Papiereinreichung ist der 31. Oktober. Die Frist für die Online-Einreichung ist der 31. Januar nach Ende des Steuerjahres (5. April). Auch die fällige Steuer ist bis zum 31. Januar zu zahlen. Die Fristversäumnis führt unabhängig davon, ob Steuern geschuldet werden, zu einem automatischen Bußgeld von 100 £. Weitere Bußgelder folgen nach 3, 6 und 12 Monaten Verspätung. HMRC berechnet Verzugszinsen zum Bank Rate zuzüglich 2,5 %.',
      },
    ],
  },

  'what-is-auto-enrolment-tax': {
    title: 'Was ist Auto-Enrolment?',
    description:
      'Auto-Enrolment verpflichtet Arbeitgeber, berechtigte Mitarbeiter automatisch in eine betriebliche Altersvorsorge einzuschreiben. Erfahren Sie mehr über die Regeln und die Mindestbeitragspflichten.',
    keywords: [
      'Auto-Enrolment',
      'betriebliche Altersvorsorge',
      'Arbeitgeberrente',
      'The Pensions Regulator',
      'NEST',
    ],
    keyTakeaways: [
      'Arbeitgeber müssen berechtigte Mitarbeiter automatisch in eine qualifizierte betriebliche Altersvorsorge einschreiben',
      'Berechtigte Mitarbeiter sind 22 bis 66 Jahre alt und verdienen über 10.000 £ pro Jahr',
      'Die Mindestbeiträge betragen 8 % des qualifizierenden Einkommens — mindestens 3 % müssen vom Arbeitgeber kommen',
      'Bei Nichteinhaltung drohen tägliche Bußgelder von The Pensions Regulator',
    ],
    content: [
      {
        heading: 'Was Auto-Enrolment ist',
        body: 'Auto-Enrolment verpflichtet Arbeitgeber, berechtigte Mitarbeiter automatisch in eine qualifizierte betriebliche Altersvorsorge einzuschreiben und Mindestbeiträge als Arbeitgeber zu leisten. Eingeführt 2012, um die weitverbreitete unzureichende Altersvorsorge anzugehen. Mitarbeiter werden automatisch eingeschrieben und müssen aktiv widersprechen (Opt-out), wenn sie nicht teilnehmen möchten. Die Opt-out-Quote liegt typischerweise bei 8-10 %, das heißt, die überwiegende Mehrheit der eingeschriebenen Mitarbeiter bleibt im Programm.',
      },
      {
        heading: 'Wer eingeschrieben werden muss',
        body: 'Berechtigte Arbeitnehmer müssen automatisch eingeschrieben werden: Mitarbeiter zwischen 22 Jahren und dem staatlichen Renteneintrittsalter (derzeit 66), die von diesem einen Arbeitgeber mehr als 10.000 £ pro Jahr verdienen und im Vereinigten Königreich arbeiten. Mitarbeiter im Alter von 16-21 Jahren oder über dem staatlichen Renteneintrittsalter, oder solche mit einem Verdienst zwischen 6.240 £ und 10.000 £, haben ein Recht auf Beitritt (Opt-in), werden aber nicht automatisch eingeschrieben. Jeder Mitarbeiter muss zu seinem Eintrittsdatum bewertet werden.',
      },
      {
        heading: 'Mindestbeitragssätze',
        body: 'Der Mindestgesamtbeitrag beträgt 8 % des qualifizierenden Einkommens. Mindestens 3 % müssen vom Arbeitgeber kommen — der Mitarbeiter trägt die verbleibenden 5 %. Qualifizierendes Einkommen ist definiert als die Bandbreite zwischen 6.240 £ und 50.270 £ pro Jahr. Für einen Mitarbeiter mit einem Verdienst von 25.000 £ beträgt das qualifizierende Einkommen 18.760 £ — der Mindestarbeitgeberbeitrag liegt somit bei 563 £ pro Jahr. Arbeitgeber können freiwillig mehr als das Minimum beitragen.',
      },
      {
        heading: 'Wahl der Rentenkasse',
        body: 'NEST (National Employment Savings Trust) ist das staatlich unterstützte Programm, das speziell für Auto-Enrolment konzipiert wurde — keine Zugangsbeschränkungen, keine Mindestbeitragshöhen, keine Kosten für Arbeitgeber. Andere Anbieter, darunter The People\'s Pension, Smart Pension, Aviva und Legal & General, bieten ebenfalls qualifizierende Programme an. Die meisten Lohnbuchhaltungsprogramme sind mit den großen Rentenanbietern integriert, um die Berechnung der Beiträge zu automatisieren.',
      },
      {
        heading: 'Compliance-Pflichten',
        body: 'Die Einhaltung von Auto-Enrolment erfordert: die Bewertung aller Mitarbeiter zu ihrem Startdatum, die Einschreibung berechtigter Mitarbeiter innerhalb von 6 Wochen nach ihrem Bewertungsdatum, die schriftliche Mitteilung der Einschreibung an die Mitarbeiter, die pünktliche Zahlung der Beiträge, die erneute Einschreibung von Opt-outs alle 3 Jahre und die Aufbewahrung von Aufzeichnungen für 6 Jahre. The Pensions Regulator (TPR) setzt die Einhaltung mit eskalierenden Bußgeldbescheiden durch — anfänglich 400 £, steigend zu täglichen Bußgeldern von 50 £ bis 10.000 £ je nach Unternehmensgröße.',
      },
    ],
  },

  'what-is-ir35': {
    title: 'Was ist IR35?',
    description:
      'IR35 bestimmt, ob ein Auftragnehmer, der über die eigene Gesellschaft arbeitet, tatsächlich selbstständig ist oder faktisch ein Arbeitnehmer. Erhebliche steuerliche Auswirkungen für beide Seiten.',
    keywords: [
      'IR35',
      'Off-Payroll Working',
      'Auftragnehmersteuer',
      'Personal Service Company',
      'CEST',
    ],
    keyTakeaways: [
      'IR35 bestimmt, ob ein Auftragnehmer über eine Personal Service Company tatsächlich selbstständig ist',
      'Mittlere und große Unternehmen sind seit 2021 für die Feststellung des IR35-Status von Auftragnehmern verantwortlich',
      'Fällt der Auftrag unter IR35, wird der Auftragnehmer wie ein Arbeitnehmer besteuert, jedoch ohne Arbeitnehmerrechte',
      'Die drei zentralen Tests sind: Vertretung, Kontrolle und wechselseitige Verpflichtung',
    ],
    content: [
      {
        heading: 'Was IR35 ist',
        body: 'IR35 (die Off-Payroll-Working-Regeln) bestimmt, ob ein Auftragnehmer, der über die eigene Kapitalgesellschaft (Personal Service Company, PSC) arbeitet, tatsächlich selbstständig ist oder faktisch Arbeitnehmer des Endkunden. Fällt der Auftrag unter IR35, muss der Auftragnehmer Einkommensteuer und National Insurance wie ein Arbeitnehmer zahlen und verliert die steuerlichen Vorteile einer Kapitalgesellschaft. Fällt der Auftrag außerhalb von IR35, behält der Auftragnehmer den niedrigeren effektiven Steuersatz eines Geschäftsführers einer Kapitalgesellschaft.',
      },
      {
        heading: 'Wer den IR35-Status bestimmt',
        body: 'Kleine Unternehmen im Privatsektor (weniger als 50 Mitarbeiter, Umsatz unter 10,2 Millionen £) — die PSC des Auftragnehmers trifft die Feststellung selbst. Mittlere und große Unternehmen im Privatsektor sowie alle öffentlichen Einrichtungen — der Endkunde (das beauftragende Unternehmen) ist für die Feststellung verantwortlich und muss eine Status Determination Statement (SDS) ausstellen. Diese Reform von April 2021 hat den Compliance-Aufwand für mittlere und große Unternehmen, die Auftragnehmer beschäftigen, deutlich erhöht.',
      },
      {
        heading: 'Die drei zentralen Tests',
        body: 'Der Status wird anhand der Gesamtbeziehung beurteilt. Kontrolle: Kontrolliert der Kunde, wann, wo und wie die Arbeit ausgeführt wird? Hohe Kontrolle spricht für IR35. Vertretung: Kann der Auftragnehmer ohne Zustimmung des Kunden einen Ersatz schicken? Ist dies der Fall, spricht das stark gegen IR35. Wechselseitige Verpflichtung: Ist der Kunde verpflichtet, Arbeit anzubieten, und der Auftragnehmer verpflichtet, sie anzunehmen? Eine fortlaufende Verpflichtung spricht für IR35. Kein einzelner Faktor ist allein entscheidend — alle werden gemeinsam abgewogen.',
      },
      {
        heading: 'Compliance für Unternehmen, die Auftragnehmer beschäftigen',
        body: 'Mittlere und große Unternehmen, die Auftragnehmer beschäftigen, müssen: mit angemessener Sorgfalt IR35-Statusfeststellungen treffen (mithilfe des CEST-Tools von HMRC oder eines spezialisierten Beraters für Beschäftigungssteuer), eine Status Determination Statement an den Auftragnehmer und die zahlende Stelle ausstellen und sicherstellen, dass PAYE korrekt angewendet wird für jeden Auftragnehmer, der als innerhalb von IR35 eingestuft wird. Wird keine angemessene Sorgfalt angewendet, kann HMRC die Haftung für nicht gezahlte PAYE und NIC auf den Endkunden verlagern.',
      },
      {
        heading: 'Praktisches Risikomanagement',
        body: 'Zur Reduzierung des IR35-Risikos: Verträge so gestalten, dass sie echte Selbstständigkeit widerspiegeln — keine Festlegung von Arbeitszeiten, Arbeitsort und alltäglichen Arbeitsmethoden. Sicherstellen, dass Vertretungsklauseln tatsächlich gelebt werden. Verträge für definierte Projekte mit klaren Leistungen verwenden. Den eigenen Statusfeststellungsprozess dokumentieren. Im Zweifel spezialisierten Rat zur Beschäftigungssteuer einholen, bevor ein Auftragnehmer langfristig beauftragt wird, nicht erst, nachdem HMRC eine Untersuchung eingeleitet hat.',
      },
    ],
  },

  'what-is-companies-house': {
    title: 'Was ist Companies-House-Compliance?',
    description:
      'Britische Kapitalgesellschaften müssen regelmäßig Dokumente bei Companies House einreichen. Erfahren Sie, was erforderlich ist, welche Fristen gelten und welche Bußgelder bei verspäteter Einreichung drohen.',
    keywords: [
      'Companies House',
      'Confirmation Statement',
      'Jahresabschluss',
      'Annual Return',
      'Meldepflichten',
    ],
    keyTakeaways: [
      'Jede britische Kapitalgesellschaft muss ein Confirmation Statement und einen Jahresabschluss bei Companies House einreichen',
      'Das Confirmation Statement ist innerhalb von 14 Tagen nach dem Jahrestag der Gründung fällig',
      'Jahresabschlüsse privater Gesellschaften müssen innerhalb von 9 Monaten nach Ende des Geschäftsjahres eingereicht werden',
      'Verspätete Einreichung führt zu automatischen Bußgeldern und letztlich zur Löschung der Gesellschaft',
    ],
    content: [
      {
        heading: 'Was Companies House ist',
        body: 'Companies House ist die britische Behörde, die das Register aller Kapitalgesellschaften führt. Es handelt sich um ein öffentliches Register — jeder kann von einer Gesellschaft eingereichte Dokumente einsehen. Jede britische Kapitalgesellschaft muss ihre Angaben bei Companies House durch regelmäßige Einreichung bestimmter Dokumente aktuell halten. Verspätete Einreichung führt zu automatischen Bußgeldern und riskiert letztlich die Löschung der Gesellschaft aus dem Register.',
      },
      {
        heading: 'Das Confirmation Statement',
        body: 'Das Confirmation Statement muss einmal jährlich innerhalb von 14 Tagen nach dem Jahrestag der Gründung oder des vorherigen Confirmation Statements eingereicht werden. Es bestätigt, dass die bei Companies House hinterlegten Informationen — eingetragene Adresse, Geschäftsführer, Gesellschafter und Personen mit erheblicher Kontrolle (PSC) — aktuell sind. Die Einreichung erfolgt online über Companies House WebFiling für 13 £. Wird nicht eingereicht, kann die Gesellschaft gelöscht werden.',
      },
      {
        heading: 'Jahresabschluss',
        body: 'Jahresabschlüsse müssen innerhalb von 9 Monaten nach Ende des Geschäftsjahres für private Gesellschaften eingereicht werden. Kleine Unternehmen (weniger als 50 Mitarbeiter, Umsatz unter 10,2 Millionen £, Bilanzsumme unter 5,1 Millionen £) können verkürzte Abschlüsse ohne detaillierte Gewinn- und Verlustrechnung einreichen. Kleinstunternehmen (Umsatz unter 632.000 £, Vermögenswerte unter 316.000 £, weniger als 10 Mitarbeiter) können noch einfachere Abschlüsse einreichen. Diese Abschlüsse sind öffentlich einsehbar.',
      },
      {
        heading: 'Angaben aktuell halten',
        body: 'Über Confirmation Statement und Jahresabschluss hinaus müssen weitere Ereignisse Companies House zeitnah gemeldet werden: die Bestellung oder der Rücktritt eines Geschäftsführers innerhalb von 14 Tagen; eine Änderung der eingetragenen Adresse; die Ausgabe neuer Anteile; sowie die Änderung des Firmennamens (erfordert einen besonderen Beschluss). Die meisten Einreichungen können online über Companies House WebFiling oder kommerzielle Company-Secretarial-Software erfolgen.',
      },
      {
        heading: 'Bußgelder bei verspäteter Einreichung',
        body: 'Companies House verhängt automatische Bußgelder bei verspäteten Abschlüssen. Für private Gesellschaften: 150 £ bei bis zu 1 Monat Verspätung; 375 £ bei 1-3 Monaten; 750 £ bei 3-6 Monaten; 1.500 £ bei mehr als 6 Monaten. Bei zwei aufeinanderfolgenden Jahren mit verspäteten Abschlüssen verdoppeln sich die Bußgelder. HMRC verhängt zusätzlich separate Körperschaftsteuer-Bußgelder für verspätete CT600-Einreichung — beide Pflichten sind unabhängig voneinander und müssen beide erfüllt werden.',
      },
    ],
  },

  'what-is-capital-gains-tax-business': {
    title: 'Was ist die Kapitalertragsteuer (CGT) für Unternehmer?',
    description:
      'Die Kapitalertragsteuer wird fällig, wenn Sie einen Unternehmenswert mit Gewinn verkaufen. Erfahren Sie mehr über die Sätze, Business Asset Disposal Relief und wichtige Planungsmöglichkeiten.',
    keywords: [
      'Kapitalertragsteuer',
      'CGT',
      'Business Asset Disposal Relief',
      'BADR',
      'Steuer beim Unternehmensverkauf',
    ],
    keyTakeaways: [
      'CGT wird auf den Gewinn beim Verkauf eines qualifizierenden Vermögenswerts erhoben — der Gewinn über die ursprünglichen Kosten hinaus',
      'Business Asset Disposal Relief senkt die CGT auf 10 % bei qualifizierenden Unternehmensveräußerungen bis zu 1 Million £ lebenslang',
      'Der jährliche CGT-Freibetrag beträgt 3.000 £ — deutlich gesenkt gegenüber 12.300 £ im Jahr 2022',
      'Unternehmer sollten Verkäufe von Vermögenswerten sorgfältig planen, um verfügbare Vergünstigungen optimal zu nutzen',
    ],
    content: [
      {
        heading: 'Was die Kapitalertragsteuer ist',
        body: 'Die Kapitalertragsteuer (Capital Gains Tax) wird auf den Gewinn erhoben, wenn Sie einen Vermögenswert verkaufen oder veräußern, der im Wert gestiegen ist. Für Unternehmer betrifft sie unter anderem: den Verkauf von Anteilen an einer Gesellschaft, den Verkauf von Geschäftsräumen oder -ausrüstung, die Veräußerung von geistigem Eigentum und den Verkauf des Unternehmens selbst. Der Gewinn berechnet sich als Veräußerungserlös abzüglich der ursprünglichen Kosten und etwaiger Verbesserungskosten.',
      },
      {
        heading: 'CGT-Sätze für Unternehmer',
        body: 'Der CGT-Satz für die meisten Gewinne aus Unternehmensvermögen liegt bei 18 % (Grundsatz-Steuerzahler) oder 24 % (höherer Steuersatz) — die Sätze wurden im Herbstbudget Oktober 2024 geändert. Für qualifizierende Unternehmensveräußerungen unter Business Asset Disposal Relief gilt ein Satz von 10 %, steigend auf 14 % ab April 2025 und 18 % ab April 2026 gemäß dem Budget 2024. Der jährliche CGT-Freibetrag beträgt 3.000 £ — deutlich reduziert gegenüber 12.300 £ in 2022-23.',
      },
      {
        heading: 'Business Asset Disposal Relief',
        body: 'Business Asset Disposal Relief (BADR), früher Entrepreneurs\' Relief, senkt den CGT-Satz bei qualifizierenden Unternehmensveräußerungen. Voraussetzungen: mindestens 5 % der Anteile und Stimmrechte für mindestens 2 Jahre halten, mindestens 2 Jahre Mitarbeiter oder leitender Angestellter der Gesellschaft gewesen sein, und die Gesellschaft muss eine qualifizierende Handelsgesellschaft sein. BADR gilt für ein lebenslanges Limit von 1 Million £ an Gewinnen. Angesichts der Satzerhöhungen im Budget 2024 ist bei der Zeitplanung eines Unternehmensverkaufs fachkundiger Steuerrat unerlässlich.',
      },
      {
        heading: 'Holdover und Rollover Relief',
        body: 'Holdover Relief erlaubt es, den Gewinn bei der Schenkung eines Unternehmensvermögens aufzuschieben — der Empfänger übernimmt die ursprüngliche Kostenbasis und zahlt CGT erst beim eigenen späteren Verkauf. Rollover Relief erlaubt es, den Gewinn beim Verkauf eines qualifizierenden Vermögenswerts aufzuschieben, wenn der Erlös innerhalb von 3 Jahren in einen weiteren qualifizierenden Vermögenswert reinvestiert wird. Beide ermöglichen eine Umstrukturierung oder Übertragung von Vermögenswerten, ohne sofort CGT auszulösen.',
      },
      {
        heading: 'Planungsmöglichkeiten',
        body: 'Strategien zur Reduzierung der CGT-Belastung umfassen: die BADR-Berechtigung sicherzustellen, indem die 2-Jahres-Qualifikationsfrist eingehalten wird, Rentenbeiträge im Jahr der Veräußerung zu leisten, um das steuerpflichtige Einkommen zu senken, Freibeträge von Ehe- oder Lebenspartnern durch Übertragung von Vermögenswerten vor der Veräußerung zu nutzen (Übertragungen zwischen Ehepartnern sind CGT-frei), sowie die Veräußerung im Verhältnis zum Ende des Steuerjahres zeitlich zu planen. Keine dieser Strategien sollte ohne professionelle Beratung umgesetzt werden.',
      },
    ],
  },

  'what-is-employment-law-compliance': {
    title: 'Was sind die wichtigsten arbeitsrechtlichen Pflichten für Arbeitgeber?',
    description:
      'Das britische Arbeitsrecht begründet Pflichten ab der ersten Einstellung. Erfahren Sie die wichtigsten Grundlagen, die jeder Unternehmer kennen muss, um compliant zu bleiben.',
    keywords: [
      'Arbeitsrecht',
      'Arbeitsvertrag',
      'unfaire Kündigung',
      'National Minimum Wage',
      'Diskriminierung',
    ],
    keyTakeaways: [
      'Schriftliche Arbeitsverträge müssen ab dem ersten Beschäftigungstag bereitgestellt werden',
      'Mitarbeiter erhalten nach 2 Jahren ununterbrochener Beschäftigung Rechte gegen unfaire Kündigung',
      'Der National Minimum Wage muss an alle Arbeitnehmer gezahlt werden — die Durchsetzung ist streng',
      'Diskriminierungsrecht gilt ab dem ersten Tag ohne Wartefrist',
    ],
    content: [
      {
        heading: 'Arbeitsverträge',
        body: 'Jeder Mitarbeiter muss am oder vor seinem ersten Arbeitstag eine schriftliche Aufstellung der Beschäftigungsbedingungen erhalten. Erforderliche Inhalte: Namen von Arbeitgeber und Arbeitnehmer, Berufsbezeichnung und -beschreibung, Startdatum, Gehalt und Zahlungsfrequenz, Arbeitszeiten, Arbeitsort, Urlaubsanspruch (gesetzliches Minimum 28 Tage einschließlich Feiertage bei Vollzeit), Kündigungsfristen und Rentendetails. Werden die schriftlichen Angaben nicht bereitgestellt, kann dies zu Entschädigungszahlungen führen, falls der Mitarbeiter später eine Klage erhebt.',
      },
      {
        heading: 'National Minimum Wage',
        body: 'Alle Arbeitnehmer haben Anspruch auf mindestens den National Minimum Wage. Der National Living Wage (für Arbeitnehmer ab 21 Jahren) liegt derzeit bei 11,44 £ pro Stunde, mit niedrigeren Sätzen für jüngere Arbeitnehmer und Auszubildende. HMRC setzt NMW konsequent durch — Unterbezahlung führt zu Nachzahlungen, einem Bußgeld von 200 % des Unterbezahlungsbetrags (bis zu 20.000 £ pro Arbeitnehmer) und öffentlicher Namensnennung. Häufige Fehler: Abzug von Uniformkosten unter den NMW, fehlende Berücksichtigung aller Arbeitszeit einschließlich verpflichtender Schulungen.',
      },
      {
        heading: 'Rechte gegen unfaire Kündigung',
        body: 'Mitarbeiter mit 2 Jahren ununterbrochener Beschäftigung haben das Recht, nicht unfair gekündigt zu werden. Vor der Kündigung eines solchen Mitarbeiters müssen Sie: einen fairen Grund haben (Verhalten, Leistungsfähigkeit, Redundanz, Rechtswidrigkeit oder einen anderen wesentlichen Grund), ein faires Verfahren einhalten (Verwarnung, Untersuchung, Disziplinargespräch, Widerspruchsrecht) und sicherstellen, dass die Entscheidung im Rahmen angemessener Reaktionen liegt. Wird dies missachtet, kann ein Arbeitsgericht eine Entschädigung von bis zu 105.707 £ zuzüglich einer Ausgleichszahlung zusprechen.',
      },
      {
        heading: 'Diskriminierungsrecht',
        body: 'Das britische Diskriminierungsrecht verbietet die weniger günstige Behandlung von Mitarbeitern aufgrund eines geschützten Merkmals: Alter, Behinderung, Geschlechtsumwandlung, Ehe und eingetragene Partnerschaft, Schwangerschaft und Mutterschaft, ethnische Herkunft, Religion oder Weltanschauung, Geschlecht und sexuelle Orientierung. Entscheidend ist, dass das Diskriminierungsrecht ab dem allerersten Tag der Beschäftigung gilt, ohne Wartefrist. Die Kündigung eines Mitarbeiters in der ersten Woche aus einem mit einem geschützten Merkmal zusammenhängenden Grund kann zu einer Klage vor dem Arbeitsgericht ohne Entschädigungsobergrenze führen.',
      },
      {
        heading: 'Arbeitsschutzpflichten',
        body: 'Jeder Arbeitgeber muss, soweit vernünftigerweise praktikabel, die Gesundheit, Sicherheit und das Wohlergehen aller Mitarbeiter sicherstellen. Arbeitgeber mit 5 oder mehr Mitarbeitern müssen eine schriftliche Arbeitsschutzpolitik vorhalten. Gefährdungsbeurteilungen müssen für Arbeitsplatztätigkeiten einschließlich Heimarbeit durchgeführt werden. Die Health and Safety Executive (HSE) setzt diese Pflichten durch und kann Verbesserungsanordnungen, Verbotsanordnungen erlassen und in schweren Fällen strafrechtlich verfolgen.',
      },
    ],
  },

  'what-is-business-rates': {
    title: 'Was sind Business Rates?',
    description:
      'Business Rates sind eine Grundsteuer auf gewerblich genutzte Immobilien. Erfahren Sie, wie sie berechnet werden, welche Vergünstigungen verfügbar sind und wann Sie zahlen müssen.',
    keywords: [
      'Business Rates',
      'Gewerbesteuer auf Immobilien',
      'Rateable Value',
      'Small Business Rates Relief',
      'VOA',
    ],
    keyTakeaways: [
      'Business Rates werden auf die meisten gewerblich genutzten Immobilien erhoben — Büros, Einzelhandel, Lagerhallen, Fabriken',
      'Der Betrag basiert auf dem von der Valuation Office Agency (VOA) festgelegten Rateable Value',
      'Small Business Rates Relief kann die Rates für berechtigte Unternehmen mit einem Rateable Value unter 12.000 £ vollständig entfallen lassen',
      'Sie können Ihren Rateable Value über den Check-Challenge-Appeal-Prozess anfechten',
    ],
    content: [
      {
        heading: 'Was Business Rates sind',
        body: 'Business Rates (formal Non-Domestic Rates) sind eine Grundsteuer, die auf die meisten gewerblich genutzten Immobilien erhoben wird — Geschäfte, Büros, Lagerhallen, Fabriken und andere gewerbliche Immobilien. Sie werden von den lokalen Councils eingezogen und teilweise zentral umverteilt. Wenn Sie gewerbliche Räumlichkeiten nutzen — besitzen, mieten oder von dort aus tätig sind —, sind Sie fast sicher business-rates-pflichtig, sofern Sie nicht für eine Vergünstigung qualifizieren.',
      },
      {
        heading: 'Wie die Rechnung berechnet wird',
        body: 'Ihre Business-Rates-Rechnung errechnet sich durch Multiplikation des Rateable Value der Immobilie mit dem von der Zentralregierung festgelegten Multiplikator (Pence pro Pfund). Der Rateable Value ist eine von der Valuation Office Agency (VOA) geschätzte jährliche Marktmiete der Immobilie. Der aktuelle Standard-Multiplikator liegt bei etwa 51,2 Pence pro £1 Rateable Value für große Unternehmen. Eine Immobilie mit einem Rateable Value von 20.000 £ hätte vor Vergünstigungen eine jährliche Grundrechnung von rund 10.240 £.',
      },
      {
        heading: 'Small Business Rates Relief',
        body: 'Liegt der Rateable Value Ihrer Immobilie unter 12.000 £ und ist es Ihre einzige gewerbliche Immobilie, zahlen Sie keine Rates — 100 % Vergünstigung. Zwischen 12.000 £ und 15.000 £ erhalten Sie eine gestaffelte Vergünstigung auf einer Gleitskala. Mehrere Immobilien machen die Regeln komplexer — nur die Hauptimmobilie erhält SBRR. Beantragen Sie SBRR bei Ihrem lokalen Council — sie wird nicht in allen Fällen automatisch angewendet.',
      },
      {
        heading: 'Weitere Vergünstigungen',
        body: 'Retail, Hospitality and Leisure Relief: erhebliche temporäre Vergünstigung — prüfen Sie den jeweils aktuellen Prozentsatz, da er sich jährlich ändert. Leerstandsvergünstigung: leerstehende Immobilien zahlen bis zu 3 Monate (6 Monate bei Industrieimmobilien) keine Rates; danach gilt der volle Satz. Vergünstigung für Wohltätigkeitsorganisationen: eingetragene gemeinnützige Organisationen zahlen nur 20 % des vollen Satzes. Vergünstigung für ländliche Gebiete: 50-100 % Vergünstigung für bestimmte Immobilientypen in ländlichen Gebieten mit weniger als 3.000 Einwohnern.',
      },
      {
        heading: 'Anfechtung Ihres Rateable Value',
        body: 'Erscheint Ihnen Ihr Rateable Value zu hoch, fechten Sie ihn über den Check-Challenge-Appeal-Prozess (CCA) auf der VOA-Website an. Beginnen Sie mit der Check-Phase — Überprüfung der von der VOA gespeicherten Angaben. Bei Fehlern (falsche Flächenangabe, fehlende Informationen) können Korrekturen Ihre Bewertung senken. Eine formale Challenge legt dar, warum die Bewertung falsch ist. Berufungen an das unabhängige Valuation Tribunal sind die letzte Stufe.',
      },
    ],
  },

  'what-is-a-tax-investigation': {
    title: 'Was ist eine Steuerprüfung?',
    description:
      'Eine Steuerprüfung ist die Untersuchung Ihrer Steuerangelegenheiten durch HMRC. Erfahren Sie, was sie auslöst, was zu erwarten ist und wie Sie sich schützen.',
    keywords: [
      'Steuerprüfung',
      'HMRC Enquiry',
      'Steuer-Compliance',
      'Steuerinspektion',
      'Fee Protection',
    ],
    keyTakeaways: [
      'HMRC leitet Steuerprüfungen sowohl zufällig als auch als Reaktion auf konkrete Risikosignale ein',
      'Eine vollständige Prüfung untersucht alle Aspekte einer Steuererklärung; eine Aspect Enquiry konzentriert sich auf bestimmte Posten',
      'Antworten Sie niemals HMRC, ohne zuvor professionellen Rat eingeholt zu haben',
      'Eine Fee-Protection-Versicherung deckt die Kosten Ihres Steuerberaters während einer Steuerprüfung',
    ],
    content: [
      {
        heading: 'Was eine Steuerprüfung ist',
        body: 'Eine Steuerprüfung (oder Enquiry) ist eine formale Untersuchung Ihrer Steuererklärungen durch HMRC, um zu prüfen, ob sie vollständig und korrekt sind. HMRC kann jede Steuererklärung untersuchen — Körperschaftsteuer, VAT, Einkommensteuer oder PAYE — innerhalb von 12 Monaten nach dem Einreichungsdatum, oder länger, wenn HMRC Betrug oder Nachlässigkeit vermutet. Prüfungen können routinemäßig (zufällig ausgewählt) oder gezielt (durch ein konkretes Anliegen ausgelöst) sein.',
      },
      {
        heading: 'Arten von Prüfungen',
        body: 'Eine vollständige Prüfung bedeutet, dass HMRC alle Aspekte der Steuererklärung untersuchen möchte — eine umfassende Überprüfung. Diese wird typischerweise eröffnet, wenn HMRC weitreichendere Bedenken bezüglich der Genauigkeit hat. Eine Aspect Enquiry konzentriert sich auf einen bestimmten Bereich — eine bestimmte Ausgabenkategorie, einen R&D-Antrag oder eine bestimmte Transaktion. Eine VAT-Inspektion überprüft Ihre VAT-Aufzeichnungen und -Meldungen — häufig eine routinemäßige Compliance-Kontrolle ohne Hinweis auf vermutetes Fehlverhalten.',
      },
      {
        heading: 'Was eine Prüfung auslöst',
        body: 'Auch wenn HMRC manche Prüfungen zufällig auswählt, werden die meisten durch Risikosignale ausgelöst: erhebliche jährliche Schwankungen bei Umsatz oder Gewinn, die nicht durch wirtschaftliche Bedingungen erklärt werden; hohe Kostenquoten insbesondere oberhalb der Branchennormen; Widersprüche zwischen verschiedenen Steuererklärungen (VAT-Umsatz stimmt nicht mit der Körperschaftsteuererklärung überein); hohe R&D-Tax-Credit-Anträge (HMRC hat die Prüfung hier deutlich verschärft); und branchenspezifische Risikokampagnen gegen Sektoren, in denen HMRC systematische Unterzahlung vermutet.',
      },
      {
        heading: 'Wie man reagiert',
        body: 'Antworten Sie niemals auf ein HMRC-Prüfungsschreiben, ohne zuvor professionellen Rat eingeholt zu haben. Ihr Steuerberater sollte die gesamte Kommunikation mit HMRC übernehmen. Er weiß, welche Informationen HMRC anfordern darf, und stellt sicher, dass Antworten korrekt und angemessen im Umfang sind. Mehr Informationen bereitzustellen als angefragt kann neue Prüfungsbereiche eröffnen. Ein professioneller Berater sorgt dafür, dass Sie genau das bereitstellen, was nötig ist — nicht mehr und nicht weniger.',
      },
      {
        heading: 'Fee-Protection-Versicherung',
        body: 'Eine Steuerprüfungsversicherung deckt die Honorare Ihres Steuerberaters während einer Steuerprüfung — die bei einer langwierigen Untersuchung schnell mehrere Tausend Pfund erreichen können. Viele Steuerberater bieten dies als jährliches Zusatzprodukt an, typischerweise für 200-500 £ pro Jahr. Angesichts des Zufallselements bei der HMRC-Prüfungsauswahl lohnt sich Fee Protection unabhängig davon, wie sicher Sie sich bei Ihrer Steuer-Compliance sind — die potenzielle Ersparnis im Falle einer Prüfung ist erheblich.',
      },
    ],
  },

  'what-is-the-annual-investment-allowance': {
    title: 'Was ist die Annual Investment Allowance (AIA)?',
    description:
      'Die AIA erlaubt Unternehmen, die vollen Kosten qualifizierender Investitionsausgaben im Jahr des Kaufs abzuziehen. Erfahren Sie, was qualifiziert und wie Sie sie beantragen.',
    keywords: [
      'Annual Investment Allowance',
      'AIA',
      'Kapitalabschreibung',
      'Betriebs- und Geschäftsausstattung',
      'Körperschaftsteuerabzug',
    ],
    keyTakeaways: [
      'AIA ermöglicht einen 100 % Sofortabzug für qualifizierende Betriebs- und Geschäftsausstattung bis zu 1 Million £ pro Jahr',
      'AIA umfasst die meisten Geschäftsausstattungen — Computer, Transporter, Maschinen und gewerbliche Einbauten',
      'Für Pkw gelten separate Abschreibungsregeln, sie qualifizieren nicht für AIA',
      'Full Expensing (seit April 2023) bietet einen zusätzlichen 100 % Abzug für neue Ausrüstung ohne die 1-Millionen-£-Obergrenze',
    ],
    content: [
      {
        heading: 'Was die AIA ist',
        body: 'Die Annual Investment Allowance erlaubt Unternehmen, 100 % der Kosten für qualifizierende Betriebs- und Geschäftsausstattung im Jahr des Kaufs abzuziehen, statt den Abzug über mehrere Jahre zu verteilen. Sie zählt zu den wertvollsten verfügbaren Kapitalabschreibungen. Die aktuelle AIA-Grenze liegt bei 1 Million £ pro Jahr — das deckt die überwiegende Mehrheit der Investitionsausgaben von KMU ab.',
      },
      {
        heading: 'Was für AIA qualifiziert',
        body: 'AIA gilt für Ausgaben für Betriebs- und Geschäftsausstattung — eine breite Kategorie, die unter anderem umfasst: Computer, Server und IT-Ausrüstung; Büromöbel; Maschinen und Fertigungsausrüstung; Werkzeuge und Instrumente; Einbauten in gewerblichen Gebäuden (Regale, Heizsysteme, Elektroinstallationen); und gewerbliche Fahrzeuge wie Transporter und Lkw. Personenkraftwagen qualifizieren NICHT für AIA — für sie gelten separate Abschreibungsregeln auf Basis der CO2-Emissionen.',
      },
      {
        heading: 'Was nicht qualifiziert',
        body: 'Von AIA ausgeschlossene Posten sind: Pkw (separate Regeln), Vermögenswerte, die zur Vermietung an Dritte gekauft wurden, Gebäude und Bauwerke (die ihre eigene Structures and Buildings Allowance von 3 % pro Jahr haben), und Vermögenswerte, die ausschließlich gekauft wurden, um AIA-Ansprüche am letzten Tag eines Abrechnungszeitraums zu maximieren — HMRC hat hierfür Anti-Missbrauchsregeln. Grundstücke qualifizieren nie für eine Kapitalabschreibung.',
      },
      {
        heading: 'Wie man AIA beantragt',
        body: 'AIA wird über die jährliche Körperschaftsteuererklärung (CT600) beantragt. Führen Sie qualifizierende Investitionsausgaben auf und beantragen Sie den AIA-Abzug gegen den steuerpflichtigen Gewinn. Übersteigen die Investitionsausgaben die AIA-Grenze von 1 Million £, wird der überschüssige Betrag über die reguläre Writing-Down-Allowance abgeschrieben — typischerweise 18 % pro Jahr für Standardausstattung, 6 % für Special-Rate-Vermögenswerte. Bewahren Sie Rechnungen für alle geltend gemachten Posten auf — HMRC kann sie im Rahmen einer Prüfung anfordern.',
      },
      {
        heading: 'Full Expensing',
        body: 'Seit April 2023 wurde Full Expensing eingeführt — eine 100 % Sofortabschreibung für neue (nicht gebrauchte) qualifizierende Betriebs- und Geschäftsausstattung ohne die 1-Millionen-£-Obergrenze. Dies ist besonders wertvoll für große Investitionen, die die AIA-Grenze übersteigen. Full Expensing gilt nur für körperschaftsteuerpflichtige Unternehmen, während AIA allen Unternehmensformen zur Verfügung steht. Das Zusammenspiel zwischen AIA und Full Expensing erfordert Planung bei größeren Investitionsentscheidungen.',
      },
    ],
  },

  'what-is-stamp-duty-business': {
    title: 'Was ist Stamp Duty bei Unternehmenstransaktionen?',
    description:
      'Stamp Duty und SDLT gelten, wenn Unternehmen Immobilien und Anteile erwerben. Erfahren Sie mehr über die Sätze und Vergünstigungen, die für Unternehmenstransaktionen relevant sind.',
    keywords: [
      'Stamp Duty',
      'SDLT',
      'Stamp Duty Land Tax',
      'Gewerbeimmobiliensteuer',
      'Anteilserwerb',
    ],
    keyTakeaways: [
      'SDLT-Sätze auf Gewerbeimmobilien: 0 % bis 150.000 £; 2 % bis 250.000 £; 5 % darüber',
      'Beim Kauf von Anteilen an einer britischen Gesellschaft fällt Stamp Duty von 0,5 % an',
      'Group Relief befreit konzerninterne Immobilienübertragungen innerhalb derselben Unternehmensgruppe',
      'Die Deal-Struktur (Asset Purchase vs. Share Purchase) beeinflusst die Stamp-Duty-Position erheblich',
    ],
    content: [
      {
        heading: 'SDLT auf Gewerbeimmobilien',
        body: 'Stamp Duty Land Tax wird erhoben, wenn ein Unternehmen eine Gewerbeimmobilie in England oder Nordirland kauft oder ein langfristiges Mietverhältnis eingeht. Die aktuellen SDLT-Sätze für gewerblichen Freehold-Erwerb: 0 % auf die ersten 150.000 £; 2 % auf den Anteil zwischen 150.000 £ und 250.000 £; und 5 % auf den Anteil über 250.000 £. Ein Kauf einer Gewerbeimmobilie für 500.000 £ löst SDLT von 0 £ + 2.000 £ + 12.500 £ = 14.500 £ aus. Schottland erhebt LBTT und Wales LTT — separate, aber weitgehend ähnliche Steuern.',
      },
      {
        heading: 'SDLT bei gewerblichen Mietverhältnissen',
        body: 'SDLT bei gewerblichen Mietverhältnissen wird anders berechnet — ein 1 %-Satz auf den Barwert der Miete über die Mietlaufzeit (oberhalb von 150.000 £ Barwert), zuzüglich der Freehold-Sätze auf eine etwaige Prämie. Leasehold-SDLT wird häufig falsch berechnet — Fehler können Jahre später zu zusätzlichen Steuerforderungen von HMRC plus Bußgeldern führen. Lassen Sie bei jedem bedeutenden gewerblichen Mietverhältnis die SDLT-Berechnung von einem Spezialisten überprüfen.',
      },
      {
        heading: 'Stamp Duty bei Anteilskäufen',
        body: 'Beim Kauf von Anteilen an einer britischen Gesellschaft (bei einer Übernahme) fällt Stamp Duty von 0,5 % auf die Gegenleistung an. Der Erwerb einer Gesellschaft für 2 Millionen £ löst 10.000 £ Stamp Duty aus, aufgerundet auf die nächsten 5 £, zahlbar innerhalb von 30 Tagen nach Vollzug. Über eine qualifizierende Handelsplattform gekaufte AIM-notierte Anteile sind befreit — ein Grund, warum AIM bei Investoren beliebt ist.',
      },
      {
        heading: 'Group Relief und weitere Ausnahmen',
        body: 'Group Relief befreit konzerninterne Immobilienübertragungen, bei denen Käufer und Verkäufer zur selben Unternehmensgruppe gehören. Wohltätigkeitsorganisationen sind von SDLT bei Erwerben zu gemeinnützigen Zwecken befreit. Multiple Dwellings Relief kann die Belastung beim Kauf mehrerer Wohneinheiten senken (vorbehaltlich jüngster Änderungen). First-Time-Buyers-Relief gilt nur für Privatpersonen — Unternehmen, die Wohnimmobilien kaufen, unterliegen höheren SDLT-Sätzen als Privatpersonen.',
      },
      {
        heading: 'Asset Purchase versus Share Purchase',
        body: 'Die Deal-Struktur beeinflusst die Stamp-Duty-Position erheblich. Ein Share Purchase löst 0,5 % Stamp Duty auf die Gesamtgegenleistung aus. Ein Asset Purchase löst SDLT nur auf den Immobilienanteil zu gewerblichen Sätzen aus — andere Vermögenswerte (Goodwill, Ausrüstung, Bestand) lösen keine Stamp Duty aus. Diese Unterscheidung beeinflusst häufig die Verhandlungen zur Deal-Struktur — Käufer bevorzugen Asset Purchases wegen der SDLT-Ersparnis, während Verkäufer Share Purchases aus CGT-Gründen bevorzugen können.',
      },
    ],
  },

  'what-is-transfer-pricing-uk': {
    title: 'Was ist Transfer-Pricing-Compliance für britische Unternehmen?',
    description:
      'Transfer-Pricing-Compliance stellt sicher, dass Transaktionen zwischen Konzerngesellschaften zu Fremdvergleichspreisen erfolgen. Erfahren Sie mehr über die britischen Regeln und Dokumentationspflichten.',
    keywords: [
      'Transfer Pricing',
      'Fremdvergleichsgrundsatz',
      'HMRC Transfer Pricing',
      'verbundene Unternehmen',
      'OECD',
    ],
    keyTakeaways: [
      'Britische Transfer-Pricing-Regeln verlangen, dass Transaktionen zwischen verbundenen Unternehmen wie zwischen unabhängigen Parteien bepreist werden',
      'Die Regeln gelten sowohl für grenzüberschreitende als auch inländische Transaktionen zwischen verbundenen Gesellschaften',
      'Große Konzerne müssen Master File, Local File und Country-by-Country-Reporting erstellen',
      'Fehlerhaftes Transfer Pricing führt zu erheblichen Steuerkorrekturen und Bußgeldern',
    ],
    content: [
      {
        heading: 'Was britische Transfer-Pricing-Regeln verlangen',
        body: 'Die britische Transfer-Pricing-Gesetzgebung verlangt, dass Transaktionen zwischen verbundenen Gesellschaften — ob inländisch oder grenzüberschreitend — bepreist werden, als handele es sich um unabhängige, fremde Parteien zum Fremdvergleichspreis. Die Regeln verhindern, dass multinationale Konzerne Gewinne in Niedrigsteuerländer verlagern, indem sie die Preise für Waren, Dienstleistungen oder geistiges Eigentum untereinander manipulieren. HMRC kann steuerpflichtige Gewinne anpassen, wenn die Bepreisung zwischen verbundenen Unternehmen nicht dem Fremdvergleichsgrundsatz entspricht.',
      },
      {
        heading: 'Wann britisches Transfer Pricing gilt',
        body: 'Die Regeln gelten, wenn: zwei Gesellschaften verbunden sind (direkt oder indirekt unter gemeinsamer Kontrolle) und die tatsächlichen Bedingungen ihrer Transaktion von dem abweichen, was fremde Parteien vereinbart hätten. Britisches Transfer Pricing gilt sowohl für grenzüberschreitende als auch inländische Transaktionen — inländische Anpassungen erfolgen dort, wo ein britischer Steuervorteil besteht (z. B. wenn eine Partei Verluste macht und die andere Gewinne erzielt).',
      },
      {
        heading: 'Dokumentationspflichten',
        body: 'Große Konzerne (konsolidierter Umsatz über 750 Millionen €) müssen ein Master File erstellen, das die Struktur und Grundsätze des Konzerns beschreibt, ein Local File mit Details zu bestimmten Transaktionen sowie einen Country-by-Country Report. Mittlere Unternehmen sollten zeitnahe Dokumentation führen. Kleine Unternehmen (beide Parteien im Vereinigten Königreich ansässig und unterhalb einer bestimmten Größe) sind befreit. Die Dokumentation sollte vor der Einreichungsfrist erstellt werden, nicht rückwirkend.',
      },
      {
        heading: 'Häufige Transaktionen zwischen verbundenen Unternehmen, die Aufmerksamkeit erfordern',
        body: 'Die häufigsten Transfer-Pricing-Themen für britische KMU mit Auslandsgeschäft: Management-Gebühren von der britischen Muttergesellschaft an ausländische Tochtergesellschaften (oder umgekehrt); IP-Lizenzgebühren für in Großbritannien entwickelte Technologie, die von ausländischen Einheiten genutzt wird; konzerninterne Darlehen (Zinsen müssen zu marktüblichen Sätzen erfolgen); Kauf und Verkauf von Waren zwischen Konzerngesellschaften zu nicht marktüblichen Preisen; und Cost-Sharing-Vereinbarungen. Jede sollte über eine schriftliche konzerninterne Vereinbarung und eine dokumentierte Bepreisungsbegründung verfügen.',
      },
      {
        heading: 'Advance Pricing Agreements',
        body: 'Ein Advance Pricing Agreement (APA) ist eine Vereinbarung mit HMRC, die die Transfer-Pricing-Methodik für bestimmte Transaktionen über einen bestimmten Zeitraum (typischerweise 3-5 Jahre) im Voraus genehmigt. APAs schaffen Rechtssicherheit und schützen vor Doppelbesteuerung. Sie sind komplex und teuer in der Aushandlung, aber wertvoll für große, risikoreiche Transaktionen zwischen verbundenen Unternehmen. Für die meisten KMU genügt eine dokumentierte, jährlich überprüfte Fremdvergleichsanalyse ohne die Förmlichkeit eines APA.',
      },
    ],
  },

  'what-is-an-eori-number': {
    title: 'Was ist eine EORI-Nummer?',
    description:
      'Eine EORI-Nummer ist für jedes Unternehmen erforderlich, das Waren importiert oder exportiert. Erfahren Sie, wie Sie eine erhalten und wann Sie sie benötigen.',
    keywords: [
      'EORI-Nummer',
      'Import Export',
      'Zollregistrierung',
      'Economic Operator Registration',
      'internationaler Handel Compliance',
    ],
    keyTakeaways: [
      'EORI steht für Economic Operator Registration and Identification',
      'Jedes britische Unternehmen, das Waren gewerblich importiert oder exportiert, benötigt eine GB-EORI-Nummer',
      'Sie ist kostenlos und kann innerhalb von Minuten über die Gov.uk-Website bei HMRC beantragt werden',
      'Ohne EORI-Nummer können Ihre Waren nicht durch den britischen Zoll abgefertigt werden',
    ],
    content: [
      {
        heading: 'Was eine EORI-Nummer ist',
        body: 'Eine Economic Operator Registration and Identification (EORI)-Nummer ist eine eindeutige Kennung, die für jedes Unternehmen oder jede Person erforderlich ist, die international mit Waren handelt. Im Vereinigten Königreich beginnt eine GB-EORI-Nummer mit GB, gefolgt von der VAT-Nummer des Unternehmens und drei weiteren Ziffern. Sie ist auf allen Zollanmeldungen — Import und Export — erforderlich, und ohne sie können Ihre Waren nicht durch den britischen Zoll abgefertigt werden.',
      },
      {
        heading: 'Wer eine EORI-Nummer benötigt',
        body: 'Jedes britische Unternehmen, das Waren gewerblich in das Vereinigte Königreich importiert oder von dort exportiert, benötigt eine GB-EORI-Nummer. Dies gilt unabhängig vom Wert oder der Häufigkeit internationaler Sendungen — selbst ein einziger Import erfordert eine. Wenn Sie nach Nordirland verkaufen oder mit der EU handeln, benötigen Sie möglicherweise zusätzlich eine XI-EORI-Nummer für Bewegungen nach Nordirland und potenziell eine EU-EORI-Nummer für Bewegungen innerhalb der EU.',
      },
      {
        heading: 'Wie man eine EORI-Nummer erhält',
        body: 'Beantragen Sie eine GB-EORI-Nummer unter gov.uk/eori. Die Beantragung ist kostenlos und dauert etwa 5-10 Minuten. Ist Ihr Unternehmen in Großbritannien VAT-registriert, entspricht Ihre EORI-Nummer typischerweise Ihrer VAT-Nummer mit dem Präfix GB und der Endung 000. Nicht VAT-registrierte Unternehmen können sich dennoch anhand ihrer Unique Taxpayer Reference (UTR) bewerben. Die meisten Anträge werden sofort bearbeitet — Sie erhalten Ihre EORI-Nummer innerhalb von Minuten per E-Mail.',
      },
      {
        heading: 'EORI und Ihr Zollagent',
        body: 'Ihr Spediteur oder Zollmakler benötigt Ihre EORI-Nummer, um in Ihrem Namen Zollanmeldungen abzugeben. Geben Sie sie an, wenn Sie ein Konto bei einem Fracht- oder Logistikanbieter einrichten. Nutzen Sie Amazon FBA oder andere Marktplatz-Fulfilment-Dienste, die Waren in Ihrem Namen importieren, benötigen auch diese Ihre EORI-Nummer. Bewahren Sie sie sicher und konsistent auf — Ihre EORI-Nummer ist mit allen Ihren Zollaufzeichnungen bei HMRC verknüpft.',
      },
      {
        heading: 'Post-Brexit-EORI-Anforderungen',
        body: 'Seit dem Brexit benötigen britische Unternehmen, die mit der EU handeln, eine GB-EORI-Nummer für den britischen Zoll und möglicherweise zusätzlich eine EU-EORI-Nummer für Zollanmeldungen innerhalb der EU-Mitgliedstaaten. EU-EORI-Nummern werden von der Zollbehörde eines beliebigen EU-Mitgliedstaats ausgestellt — wenn Sie regelmäßig nach Deutschland importieren, beantragen Sie eine DE-EORI-Nummer bei der deutschen Zollbehörde (Bundeszollverwaltung). Ihr Spediteur kann Sie beraten, welche EU-EORI-Nummern für Ihre spezifischen Handelsrouten erforderlich sind.',
      },
    ],
  },

  'what-is-a-vat-inspection': {
    title: 'Was ist eine VAT-Inspektion?',
    description:
      'Eine VAT-Inspektion ist die Überprüfung Ihrer VAT-Aufzeichnungen und -Meldungen durch HMRC. Erfahren Sie, was Sie erwartet und wie Sie sich vorbereiten.',
    keywords: [
      'VAT-Inspektion',
      'VAT-Besuch',
      'HMRC VAT',
      'VAT-Compliance',
      'VAT-Aufzeichnungen',
    ],
    keyTakeaways: [
      'HMRC führt VAT-Inspektionen sowohl routinemäßig als auch als Reaktion auf Risikosignale durch',
      'Prüfer können Ihre Räumlichkeiten besuchen oder die Inspektion aus der Ferne durchführen',
      'Sie müssen VAT-Aufzeichnungen mindestens 6 Jahre aufbewahren',
      'Lassen Sie Ihren Steuerberater bei einer VAT-Inspektion stets anwesend oder erreichbar sein',
    ],
    content: [
      {
        heading: 'Was eine VAT-Inspektion ist',
        body: 'Eine VAT-Inspektion (oder VAT-Compliance-Besuch) ist eine Überprüfung Ihrer VAT-Aufzeichnungen durch HMRC, um zu prüfen, ob Ihre VAT-Meldungen korrekt sind. Prüfer können Ihre Räumlichkeiten besuchen oder verlangen, dass Aufzeichnungen digital übermittelt werden. Manche Inspektionen sind routinemäßig — im Rahmen des Compliance-Programms von HMRC ausgewählt, unabhängig von vermutetem Fehlverhalten. Andere werden durch Risikosignale ausgelöst, wie wiederkehrende VAT-Rückerstattungsanträge, Widersprüche in Meldungen oder ungewöhnlich niedrige VAT-Verbindlichkeiten für Ihre Branche.',
      },
      {
        heading: 'Was Prüfer untersuchen',
        body: 'HMRC-VAT-Prüfer untersuchen typischerweise: Verkaufsrechnungen und ob Ausgangs-VAT korrekt berechnet wurde; Einkaufsrechnungen und ob Vorsteueransprüche gültig sind (die Rechnung muss eine gültige VAT-Rechnung auf Ihren Namen sein); ob VAT auf alle steuerpflichtigen Lieferungen erhoben wurde; die Behandlung etwaiger steuerfreier oder teilweise steuerfreier Lieferungen; und ob der korrekte VAT-Satz auf jede Kategorie von Lieferung angewendet wurde. Sie prüfen auch, ob Ihre MTD-Digitalaufzeichnungen ordnungsgemäß geführt werden.',
      },
      {
        heading: 'Anforderungen zur Aufbewahrung von Aufzeichnungen',
        body: 'Sie müssen alle VAT-Aufzeichnungen mindestens 6 Jahre aufbewahren — oder 10 Jahre, wenn Sie das VAT-MOSS-Schema (Mini One Stop Shop) für digitale Dienstleistungen nutzen. Aufzeichnungen müssen in einer für HMRC zugänglichen Form vorliegen — digitale Aufzeichnungen unter Making Tax Digital müssen in einem kompatiblen Format geführt werden. Das Nichtvorlegen von Aufzeichnungen während einer Inspektion kann zu Steuerbescheiden und Bußgeldern führen, selbst wenn Ihre VAT korrekt gezahlt wurde.',
      },
      {
        heading: 'Wie man sich vorbereitet',
        body: 'Eine gute Vorbereitung macht eine VAT-Inspektion unkompliziert. Stellen Sie sicher, dass Ihre VAT-Aufzeichnungen organisiert und zugänglich sind — Verkaufs- und Einkaufsrechnungen nach Zeitraum abgelegt, digitale Aufzeichnungen MTD-konform, und Ihr VAT-Konto mit Ihren Meldungen abgeglichen. Überprüfen Sie alle Bereiche, in denen Sie Ermessensentscheidungen zur VAT-Behandlung getroffen haben, und dokumentieren Sie, was Ihre Position stützt. Informieren Sie Ihren Steuerberater, sobald Sie eine Ankündigung einer Inspektion erhalten — er sollte anwesend sein oder durchgehend erreichbar sein.',
      },
      {
        heading: 'Wenn Fehler gefunden werden',
        body: 'Findet der Prüfer Fehler in Ihren VAT-Meldungen, hängt das Ergebnis von der Art des Fehlers ab. Kleine Fehler (unter 10.000 £ oder 1 % des Umsatzes, je nachdem, was höher ist) können in Ihrer nächsten VAT-Meldung korrigiert werden. Größere Fehler müssen HMRC separat gemeldet werden. HMRC wird die zusätzlich geschuldete VAT plus Zinsen festsetzen. Waren die Fehler fahrlässig, können Bußgelder von 15-30 % der zusätzlichen VAT verhängt werden; bei Vorsatz bis zu 100 %. Zeitnahe Kooperation und freiwillige Offenlegung senken die Bußgelder.',
      },
    ],
  },

  'what-is-transfer-pricing': {
    title: 'Was ist Transfer Pricing?',
    description:
      'Transfer Pricing regelt, wie verbundene Unternehmen Transaktionen untereinander bepreisen. Erfahren Sie mehr über die Regeln, Risiken und Compliance-Anforderungen.',
    keywords: [
      'Transfer Pricing',
      'Fremdvergleichsgrundsatz',
      'konzerninterne Transaktionen',
      'OECD-Richtlinien',
      'Steuer-Compliance',
    ],
    keyTakeaways: [
      'Transfer Pricing bezeichnet den Preis für Waren, Dienstleistungen oder geistiges Eigentum, die zwischen verbundenen Einheiten innerhalb eines multinationalen Konzerns übertragen werden.',
      'Es muss dem Fremdvergleichsgrundsatz folgen, das heißt, die Preise sollten mit dem vergleichbar sein, was unabhängige Parteien berechnen würden.',
      'Fehlerhaftes Transfer Pricing kann Steuerkorrekturen, Bußgelder und Doppelbesteuerung über Ländergrenzen hinweg auslösen.',
    ],
    content: [
      {
        heading: 'Was Transfer Pricing umfasst',
        body: 'Verkauft eine Muttergesellschaft in Großbritannien Komponenten an ihre Tochtergesellschaft in Nigeria, ist der berechnete Preis der Transferpreis. Transfer-Pricing-Regeln gelten für alle konzerninternen Transaktionen: Waren, Dienstleistungen, Darlehen, Lizenzgebühren und Management-Gebühren. Steuerbehörden prüfen diese Preise genau, da Unternehmen durch die Manipulation konzerninterner Gebühren Gewinne in Niedrigsteuerländer verlagern könnten.',
      },
      {
        heading: 'Der Fremdvergleichsgrundsatz',
        body: 'Der Fremdvergleichsgrundsatz verlangt, dass konzerninterne Preise dem entsprechen, was unabhängige Parteien unter vergleichbaren Umständen vereinbaren würden. Zahlt Ihre Tochtergesellschaft Ihrer Muttergesellschaft 100 USD pro Einheit für eine Komponente, die unabhängige Käufer für 60 USD erwerben, kann die Steuerbehörde im Land der Tochtergesellschaft den Preis für Steuerzwecke auf 60 USD korrigieren und so das steuerpflichtige Einkommen vor Ort erhöhen.',
      },
      {
        heading: 'Transfer-Pricing-Methoden',
        body: 'Die OECD erkennt fünf Hauptmethoden an: Comparable Uncontrolled Price, Resale Price, Cost Plus, Transactional Net Margin und Profit Split. Die Wahl hängt von der Art der Transaktion und der Verfügbarkeit von Vergleichsdaten ab. Afrikanische Steuerbehörden, darunter in Nigeria, Kenia und Südafrika, verlangen zunehmend formale Transfer-Pricing-Dokumentation nach diesen Methoden.',
      },
      {
        heading: 'Compliance und Bußgelder',
        body: 'Die meisten Rechtsordnungen verlangen von Unternehmen oberhalb bestimmter Schwellenwerte, Transfer-Pricing-Dokumentation zu führen, einschließlich Master File, Local File und teilweise Country-by-Country Reports. Nichteinhaltung kann zu Bußgeldern führen, die von festen Geldstrafen bis zu einem Prozentsatz der nicht gezahlten Steuer reichen. Proaktive Compliance ist deutlich günstiger als nachträgliche Anpassungen und Streitbeilegung.',
      },
    ],
    faq: [
      {
        q: 'Gelten Transfer-Pricing-Regeln für kleine Unternehmen?',
        a: 'Grundsätzlich gelten Transfer-Pricing-Regeln für Unternehmen mit Transaktionen zwischen verbundenen Unternehmen oberhalb bestimmter Schwellenwerte, die je nach Land variieren. Kleine Unternehmen, die nur im Inland handeln, sind typischerweise nicht betroffen. Selbst kleine Unternehmen mit grenzüberschreitenden konzerninternen Transaktionen sollten sich jedoch der lokalen Anforderungen bewusst sein.',
      },
      {
        q: 'Was passiert, wenn Transferpreise falsch sind?',
        a: 'Steuerbehörden können den Transferpreis anpassen und so das steuerpflichtige Einkommen in ihrer Rechtsordnung erhöhen. Dies führt zu zusätzlicher Steuerschuld, Zinsen und Bußgeldern. Bietet die andere Rechtsordnung keine entsprechende Gegenanpassung, kann das Unternehmen einer Doppelbesteuerung auf denselben Gewinn ausgesetzt sein.',
      },
      {
        q: 'Kann ich für konzerninterne Transaktionen jeden beliebigen Preis festlegen?',
        a: 'Nein. Der Preis muss unter dem Fremdvergleichsgrundsatz verteidigungsfähig sein. Sie benötigen eine Dokumentation, die zeigt, dass der Preis mit dem vergleichbar ist, was unabhängige Parteien unter ähnlichen Umständen berechnen. Steuerbehörden haben die Befugnis, nicht fremdvergleichskonforme Preise anzupassen und zusätzliche Steuern festzusetzen.',
      },
    ],
  },

  'what-is-a-double-tax-treaty': {
    title: 'Was ist ein Doppelbesteuerungsabkommen?',
    description:
      'Ein Doppelbesteuerungsabkommen verhindert, dass dasselbe Einkommen in zwei Ländern besteuert wird. Erfahren Sie, wie Abkommen funktionieren und wie Unternehmen davon profitieren.',
    keywords: [
      'Doppelbesteuerungsabkommen',
      'DBA',
      'DTA',
      'Quellensteuer',
      'Steuererleichterung',
    ],
    keyTakeaways: [
      'Ein Doppelbesteuerungsabkommen ist eine Vereinbarung zwischen zwei Ländern, um zu verhindern, dass dasselbe Einkommen zweimal besteuert wird.',
      'Abkommen senken typischerweise die Quellensteuersätze auf Dividenden, Zinsen und Lizenzgebühren zwischen den beiden Ländern.',
      'Unternehmen müssen Abkommensvorteile aktiv beantragen; sie werden nicht automatisch angewendet.',
    ],
    content: [
      {
        heading: 'Warum es zur Doppelbesteuerung kommt',
        body: 'Erzielt ein britisches Unternehmen Einkommen in Kenia, können beide Länder das Recht beanspruchen, es zu besteuern. Großbritannien besteuert seine Ansässigen auf das weltweite Einkommen, und Kenia besteuert Einkommen, das innerhalb seiner Grenzen erzielt wird. Ohne Abkommen zahlt das Unternehmen in beiden Ländern Steuern auf dasselbe Einkommen. Doppelbesteuerungsabkommen verteilen die Besteuerungsrechte zwischen den Ländern und bieten Mechanismen, um diese Überschneidung zu beseitigen oder zu verringern.',
      },
      {
        heading: 'Wie Abkommen funktionieren',
        body: 'Abkommen weisen Besteuerungsrechte entweder dem Ansässigkeitsstaat, dem Quellenstaat oder beiden mit Begrenzungen zu. Sie senken typischerweise Quellensteuern auf grenzüberschreitende Dividenden, Zinsen und Lizenzgebühren. Ohne Abkommen könnte Kenia beispielsweise 15 Prozent Quellensteuer auf Lizenzgebühren an ein britisches Unternehmen einbehalten. Ein Abkommen könnte dies auf 10 Prozent senken. Großbritannien rechnet dann die kenianische Steuer auf die in Großbritannien fällige Steuer an.',
      },
      {
        heading: 'Beantragung von Abkommensvorteilen',
        body: 'Abkommensvorteile werden nicht automatisch gewährt. Das empfangende Unternehmen muss in der Regel eine Ansässigkeitsbescheinigung vorlegen und den ermäßigten Satz beim Zahler oder der eigenen lokalen Steuerbehörde beantragen. Wird dieser Schritt versäumt, wird der volle inländische Quellensteuersatz gezahlt und muss anschließend erstattet werden, was Monate oder Jahre dauern kann. Proaktive Anträge sparen Liquidität und Verwaltungsaufwand.',
      },
      {
        heading: 'Afrikas Abkommensnetzwerk',
        body: 'Afrikanische Länder haben ihre Abkommensnetzwerke ausgeweitet, um ausländische Investitionen anzuziehen. Südafrika hat mit über 70 Abkommen das umfangreichste Netzwerk auf dem Kontinent. Auch Nigeria, Kenia und Ägypten verfügen über wachsende Netzwerke. Manche Abkommen sind jedoch veraltet und spiegeln möglicherweise die aktuellen wirtschaftlichen Gegebenheiten nicht mehr wider. Unternehmen sollten Abkommensbestimmungen prüfen, bevor sie grenzüberschreitende Geschäfte strukturieren.',
      },
    ],
    faq: [
      {
        q: 'Hat jedes Land Doppelbesteuerungsabkommen?',
        a: 'Nein. Die Abkommensabdeckung variiert erheblich. Industrieländer wie Großbritannien haben Abkommen mit über 100 Ländern. Manche Entwicklungsländer haben weniger als zehn. Besteht zwischen zwei Ländern kein Abkommen, verlassen sich Unternehmen auf einseitige Erleichterungsmechanismen, die möglicherweise weniger großzügig sind.',
      },
      {
        q: 'Kann ein Abkommen meine Steuerlast erhöhen?',
        a: 'Nicht direkt. Abkommen senken oder beseitigen lediglich die Doppelbesteuerung; sie können keine neuen Besteuerungsrechte schaffen, die das innerstaatliche Recht nicht bereits vorsieht. Abkommensbestimmungen zur Betriebsstätte können jedoch klären, wann ein Land ein Besteuerungsrecht hat, was Planungsentscheidungen beeinflussen kann.',
      },
      {
        q: 'Wie finde ich heraus, ob zwischen zwei Ländern ein Abkommen besteht?',
        a: 'Prüfen Sie die Websites der Steuerbehörden beider Länder, die üblicherweise alle geltenden Abkommen auflisten. Auch die Datenbanken von OECD und IBFD bieten umfassende Abkommensübersichten. Für afrikanische Länder veröffentlicht das African Tax Administration Forum Informationen zum Abkommensnetzwerk.',
      },
    ],
  },

  'what-is-withholding-tax': {
    title: 'Was ist Quellensteuer?',
    description:
      'Quellensteuer wird an der Quelle einbehalten, bevor das Einkommen den Empfänger erreicht. Erfahren Sie, wann sie anfällt und wie Sie damit umgehen.',
    keywords: [
      'Quellensteuer',
      'WHT',
      'Steuer an der Quelle',
      'grenzüberschreitende Zahlungen',
      'Steuer-Compliance',
    ],
    keyTakeaways: [
      'Quellensteuer wird vom Zahler von einer Zahlung einbehalten, bevor sie den Empfänger erreicht, und dann an die Steuerbehörde abgeführt.',
      'Sie gilt häufig für Dividenden, Zinsen, Lizenzgebühren und Zahlungen an Gebietsfremde.',
      'Die Sätze variieren je nach Land und können durch Doppelbesteuerungsabkommen gesenkt werden.',
    ],
    content: [
      {
        heading: 'Wie Quellensteuer funktioniert',
        body: 'Zahlt ein nigerianisches Unternehmen einem britischen Lieferanten für eine Softwarelizenz, kann das nigerianische Steuerrecht verlangen, dass das nigerianische Unternehmen einen Prozentsatz der Zahlung einbehält und an den Federal Inland Revenue Service abführt. Der britische Lieferant erhält den Nettobetrag. Die einbehaltene Steuer stellt eine Vorauszahlung auf die nigerianische Steuerschuld des Lieferanten dar und stellt sicher, dass die Steuerbehörde Einnahmen von gebietsfremden Verdienern erzielt.',
      },
      {
        heading: 'Häufige Zahlungsarten, die der Quellensteuer unterliegen',
        body: 'Die meisten Länder erheben Quellensteuer auf Dividenden an Aktionäre, Zinsen auf Darlehen, Lizenzgebühren für geistiges Eigentum, Management- und technische Gebühren sowie Mieteinkünfte. Die inländischen WHT-Sätze variieren: Nigeria erhebt 10 Prozent auf Dividenden und 10 Prozent auf Zinsen für Ansässige, mit abweichenden Sätzen für Gebietsfremde. Diese Sätze werden häufig durch Steuerabkommen geändert.',
      },
      {
        heading: 'Auswirkungen auf die Liquidität',
        body: 'Für den Empfänger reduziert die Quellensteuer den erhaltenen Barbetrag jeder Zahlung. Erwarten Sie 10.000 USD, aber es werden 15 Prozent einbehalten, erhalten Sie 8.500 USD. Sie können die Differenz möglicherweise über Steuergutschriften oder Erstattungen in Ihrem Heimatland zurückerhalten, doch die zeitliche Lücke beeinträchtigt die Liquidität. Unternehmen, die WHT nicht einplanen, können unerwartete Engpässe erleben, insbesondere bei großen grenzüberschreitenden Zahlungen.',
      },
      {
        heading: 'Senkung der Quellensteuer',
        body: 'Doppelbesteuerungsabkommen senken WHT-Sätze häufig unter das inländische Niveau. Um Zugang zu ermäßigten Sätzen zu erhalten, legen Sie dem Zahler eine Ansässigkeitsbescheinigung sowie die relevanten Abkommensformulare vor der Zahlung vor. Manche Länder bieten auch Befreiungen für bestimmte Zahlungsarten oder Branchen an. Vorausschauende Planung und Dokumentation sind unerlässlich; die nachträgliche Rückforderung überzahlter WHT ist zeitaufwendig und unsicher.',
      },
    ],
    faq: [
      {
        q: 'Wer ist für die Einbehaltung und Abführung der Steuer verantwortlich?',
        a: 'Der Zahler ist gesetzlich verantwortlich. Behält der Zahler die Steuer nicht ein, kann er selbst für die Steuer haftbar gemacht werden, zuzüglich Bußgeldern und Zinsen. Das bedeutet, dass Unternehmen, die Zahlungen leisten, ihre Einbehaltungspflichten verstehen müssen, um eine persönliche Haftung für nicht gezahlte Steuern zu vermeiden.',
      },
      {
        q: 'Kann ich eine Erstattung der Quellensteuer erhalten?',
        a: 'In vielen Fällen ja. Übersteigt die WHT Ihre endgültige Steuerschuld im Quellenland, können Sie eine Erstattung beantragen. Alternativ kann Ihr Heimatland eine Steuergutschrift für im Ausland gezahlte WHT gewähren. Die Erstattungsverfahren variieren je nach Land und können mehrere Monate dauern.',
      },
      {
        q: 'Gilt Quellensteuer auch für inländische Zahlungen?',
        a: 'In vielen Ländern ja. Inländische WHT gilt häufig für Zinsen, Dividenden und Zahlungen an Auftragnehmer. Sätze und erfasste Zahlungsarten unterscheiden sich je nach Rechtsordnung. Prüfen Sie die Richtlinien Ihrer lokalen Steuerbehörde für spezifische inländische Einbehaltungspflichten.',
      },
    ],
  },

  'what-is-permanent-establishment': {
    title: 'Was ist eine Betriebsstätte?',
    description:
      'Eine Betriebsstätte bestimmt, wann ein ausländisches Unternehmen in einem anderen Land steuerpflichtig wird. Erfahren Sie mehr über die Regeln und Auslöser.',
    keywords: [
      'Betriebsstätte',
      'PE',
      'feste Geschäftseinrichtung',
      'steuerlicher Anknüpfungspunkt',
      'internationales Steuerrecht',
    ],
    keyTakeaways: [
      'Eine Betriebsstätte ist eine feste Geschäftseinrichtung, über die ein ausländisches Unternehmen seine Tätigkeit in einem anderen Land ausübt.',
      'Die Begründung einer Betriebsstätte in einem Land löst dort Körperschaftsteuerpflichten auf die dieser Betriebsstätte zurechenbaren Gewinne aus.',
      'Das Verständnis der Betriebsstättenregeln ist für jedes grenzüberschreitend tätige Unternehmen entscheidend, um unbeabsichtigte Steuerpflichten zu vermeiden.',
    ],
    content: [
      {
        heading: 'Was eine Betriebsstätte begründet',
        body: 'Nach dem OECD-Musterabkommen entsteht eine Betriebsstätte, wenn ein Unternehmen eine feste Geschäftseinrichtung in einem anderen Land hat, wie ein Büro, eine Zweigniederlassung, eine Fabrik oder eine Werkstatt. Eine Betriebsstätte kann auch durch einen abhängigen Vertreter entstehen, der gewohnheitsmäßig Verträge im Namen des ausländischen Unternehmens abschließt. Ein britisches Unternehmen mit einem Vertriebsbüro in Lagos hat eine Betriebsstätte in Nigeria und muss nigerianische Steuer auf die diesem Büro zurechenbaren Gewinne zahlen.',
      },
      {
        heading: 'Tätigkeiten, die typischerweise keine Betriebsstätte begründen',
        body: 'Bestimmte vorbereitende oder unterstützende Tätigkeiten sind generell ausgeschlossen: das Unterhalten eines Lagers ausschließlich zur Lagerung, der Einkauf von Waren für das Unternehmen oder das Sammeln von Informationen. Diese Ausnahmen werden jedoch enger gefasst. Das BEPS-Projekt der OECD hat die Regeln verschärft, um zu verhindern, dass Unternehmen Tätigkeiten auf mehrere Standorte aufsplitten, um den Betriebsstättenstatus zu vermeiden, insbesondere bei digitalen Geschäftsmodellen.',
      },
      {
        heading: 'Digitale Betriebsstätte und sich wandelnde Regeln',
        body: 'Der Aufstieg digitaler Unternehmen, die Kunden aus der Ferne ohne jede physische Präsenz bedienen, hat traditionelle Betriebsstättenkonzepte infrage gestellt. Mehrere afrikanische Länder, darunter Nigeria und Kenia, haben Regeln eingeführt, die Steuerpflichten auf Grundlage einer erheblichen digitalen Präsenz begründen, statt eine physische Niederlassung vorauszusetzen. Das bedeutet, dass ein SaaS-Unternehmen, das an nigerianische Kunden verkauft, Steuerpflichten auslösen kann, ohne Personal oder ein Büro in Nigeria zu haben.',
      },
      {
        heading: 'Umgang mit dem Betriebsstättenrisiko',
        body: 'International tätige Unternehmen sollten ihre Tätigkeiten in jedem Land mit den Betriebsstättendefinitionen in relevanten Abkommen und dem innerstaatlichen Recht abgleichen. Häufige Risikobereiche sind Mitarbeiter, die remote in ausländischen Ländern arbeiten, Vertreter, die im Namen des Unternehmens verhandeln, sowie Projektstandorte, die Laufzeitschwellen überschreiten. Eine ungeplante Betriebsstättenbegründung kann zu Steuernachzahlungen, Bußgeldern und Compliance-Pflichten führen, auf die das Unternehmen nicht vorbereitet war.',
      },
    ],
    faq: [
      {
        q: 'Kann ein einzelner Mitarbeiter eine Betriebsstätte begründen?',
        a: 'Möglicherweise ja. Arbeitet ein Mitarbeiter gewohnheitsmäßig von einem Heimbüro in einem ausländischen Land aus und übt die Befugnis aus, Verträge abzuschließen, kann er für seinen Arbeitgeber eine Betriebsstätte begründen. Grenzüberschreitende Remote-Arbeitsvereinbarungen sollten auf Betriebsstättenimplikationen überprüft werden.',
      },
      {
        q: 'Wie lange muss ein Projekt dauern, um eine Betriebsstätte zu begründen?',
        a: 'Nach dem OECD-Musterabkommen begründet ein Bau- oder Montageprojekt eine Betriebsstätte, wenn es länger als 12 Monate dauert. Viele bilaterale Abkommen verwenden kürzere Schwellenwerte, wie 6 oder 9 Monate. Manche afrikanischen Länder wenden Schwellenwerte von nur 3 Monaten an. Prüfen Sie stets das jeweils spezifische Abkommen.',
      },
      {
        q: 'Welche Folgen hat eine ungeplante Betriebsstätte?',
        a: 'Das Gastland kann Körperschaftsteuer auf die der Betriebsstätte zurechenbaren Gewinne festsetzen, möglicherweise rückwirkend über mehrere Jahre. Das Unternehmen muss sich zudem steuerlich registrieren, Erklärungen einreichen und kann Bußgelder für verspätete Einreichung erhalten. Doppelbesteuerung kann eintreten, wenn das Heimatland keine Erleichterung gewährt.',
      },
    ],
  },

  'what-is-thin-capitalisation': {
    title: 'Was ist Unterkapitalisierung (Thin Capitalisation)?',
    description:
      'Regeln zur Unterkapitalisierung begrenzen, wie viel Fremdkapital ein Unternehmen zur Senkung steuerpflichtiger Gewinne nutzen kann. Erfahren Sie, warum diese Regeln existieren und wie sie funktionieren.',
    keywords: [
      'Unterkapitalisierung',
      'Fremdkapitalquote',
      'Zinsabzug',
      'Steuerplanung',
      'BEPS',
    ],
    keyTakeaways: [
      'Unterkapitalisierung liegt vor, wenn ein Unternehmen im Verhältnis zum Eigenkapital übermäßig mit Fremdkapital finanziert wird, oft um steuerlich abzugsfähige Zinszahlungen zu maximieren.',
      'Steuerbehörden erlassen Regeln zur Unterkapitalisierung, um Gewinnverlagerung durch überhöhte Zinsabzüge zu verhindern.',
      'Übliche Ansätze umfassen feste Fremdkapitalquoten und ertragsbasierte Begrenzungen des Zinsabzugs.',
    ],
    content: [
      {
        heading: 'Warum Unterkapitalisierung relevant ist',
        body: 'Zinsen auf Fremdkapital sind typischerweise steuerlich abzugsfähig, während Dividenden auf Eigenkapital dies nicht sind. Dies schafft einen Anreiz für multinationale Konzerne, Tochtergesellschaften mit konzerninternem Fremdkapital zu belasten, um hohe Zinsabzüge zu generieren, die lokale steuerpflichtige Gewinne senken. Die Zinsen fließen an den Kreditgeber (oft eine verbundene Einheit in einem Niedrigsteuerland) und verlagern so Gewinn aus dem Land des Kreditnehmers heraus. Regeln zur Unterkapitalisierung sollen dies verhindern.',
      },
      {
        heading: 'Wie die Regeln funktionieren',
        body: 'Es gibt zwei Hauptansätze. Fixed-Ratio-Regeln legen eine maximale Fremdkapitalquote fest, typischerweise zwischen 2:1 und 4:1. Zinsen auf Fremdkapital, das diese Quote übersteigt, sind nicht abzugsfähig. Ertragsbasierte Regeln begrenzen den Zinsabzug auf einen Prozentsatz des EBITDA, üblicherweise 30 Prozent, gemäß den Empfehlungen der OECD-BEPS-Maßnahme 4. Nigeria verwendet einen Fremdkapitalquoten-Ansatz, während Südafrika beide Methoden anwendet.',
      },
      {
        heading: 'Auswirkungen auf die Unternehmensstrukturierung',
        body: 'Unternehmen, die Tochtergesellschaften in Ländern mit Regeln zur Unterkapitalisierung gründen, müssen ihre Kapitalstruktur sorgfältig planen. Eine neue Geschäftstätigkeit vollständig mit konzerninternen Darlehen zu finanzieren mag steuerlich attraktiv erscheinen, doch wird der Zinsabzug versagt, steigen die effektiven Finanzierungskosten erheblich. Die optimale Struktur balanciert Steuereffizienz mit Compliance-Risiko und wirtschaftlicher Realität.',
      },
      {
        heading: 'Praktische Compliance-Schritte',
        body: 'Überprüfen Sie Ihre konzerninternen Finanzierungsvereinbarungen anhand der lokalen Regeln zur Unterkapitalisierung in jeder Rechtsordnung. Stellen Sie sicher, dass Fremdkapitalquoten innerhalb der zulässigen Grenzen bleiben. Dokumentieren Sie die wirtschaftliche Begründung für konzerninterne Darlehen einschließlich fremdvergleichskonformer Zinssätze. Überwachen Sie ertragsbasierte Schwellenwerte, die sich mit Änderungen des EBITDA verschieben können. Proaktives Management vermeidet unerwartete Steueranpassungen und Streitigkeiten.',
      },
    ],
    faq: [
      {
        q: 'Was ist eine übliche Grenze für die Fremdkapitalquote?',
        a: 'Die meisten Rechtsordnungen legen Grenzen zwischen 2:1 und 4:1 fest, das heißt, Fremdkapital darf zwei- bis viermal so hoch sein wie Eigenkapital. Manche Länder wie Südafrika verwenden 3:1 für verbundene Personen. Die konkrete Quote variiert je nach Land und teilweise nach Branche, daher sollten Sie stets die lokalen Regeln prüfen.',
      },
      {
        q: 'Gilt Unterkapitalisierung nur für Fremdkapital zwischen verbundenen Unternehmen?',
        a: 'In den meisten Rechtsordnungen konzentrieren sich Regeln zur Unterkapitalisierung auf konzerninternes oder verbundenes Fremdkapital. Fremdkapital von Dritten wie Banken ist meist ausgenommen. Manche Länder berücksichtigen jedoch auch Fremdkapital Dritter, das von einer verbundenen Partei garantiert wird, da die Garantie es faktisch zu konzerninterner Finanzierung macht.',
      },
      {
        q: 'Was passiert, wenn Zinsen unter den Regeln zur Unterkapitalisierung versagt werden?',
        a: 'Die versagten Zinsen können nicht vom steuerpflichtigen Einkommen abgezogen werden, was die Steuerlast des Unternehmens erhöht. Manche Rechtsordnungen erlauben einen Vortrag des überschüssigen Zinsbetrags auf künftige Jahre. Der versagte Betrag kann zudem als Dividende umqualifiziert werden, was Quellensteuer auslösen kann.',
      },
    ],
  },

  'what-is-country-by-country-reporting': {
    title: 'Was ist Country-by-Country Reporting?',
    description:
      'Country-by-Country Reporting verpflichtet multinationale Konzerne, für jede Rechtsordnung, in der sie tätig sind, Finanzdaten offenzulegen. Erfahren Sie mehr über die Anforderungen.',
    keywords: [
      'Country-by-Country Reporting',
      'CbCR',
      'BEPS-Maßnahme 13',
      'Steuertransparenz',
      'Konzernberichterstattung',
    ],
    keyTakeaways: [
      'Country-by-Country Reporting verpflichtet multinationale Konzerne, einen Bericht mit Umsatz, Gewinn, gezahlter Steuer und Mitarbeiterzahl für jede Rechtsordnung einzureichen.',
      'Es wurde unter der OECD-BEPS-Maßnahme 13 eingeführt und gilt für Konzerne mit einem konsolidierten Umsatz über 750 Millionen €.',
      'Der Bericht hilft Steuerbehörden, Gewinnverlagerungsrisiken zu erkennen und Prüfungsressourcen gezielter einzusetzen.',
    ],
    content: [
      {
        heading: 'Was CbCR verlangt',
        body: 'Ein Country-by-Country Report legt für jedes Land, in dem ein multinationaler Konzern tätig ist, offen: Umsatz von verbundenen und unabhängigen Parteien, Gewinn oder Verlust vor Steuern, gezahlte und abgegrenzte Ertragsteuer, gezeichnetes Kapital, einbehaltene Gewinne, Mitarbeiterzahl und Sachanlagen. Dies gibt Steuerbehörden einen übergeordneten Einblick, wo der Konzern Gewinne erzielt, Steuern zahlt und Mitarbeiter beschäftigt, und deckt mögliche Unstimmigkeiten auf.',
      },
      {
        heading: 'Wer einreichen muss',
        body: 'CbCR gilt für multinationale Konzerne mit einem konsolidierten Jahresumsatz von 750 Millionen € oder mehr. Der Bericht wird von der obersten Muttergesellschaft in ihrer Heimatrechtsordnung eingereicht und über Informationsaustauschabkommen mit anderen Ländern geteilt. Manche Länder, darunter Nigeria, haben niedrigere Schwellenwerte übernommen. Auch Konzerne unterhalb der Schwelle sollten CbCR verstehen, da es die Richtung der globalen Steuertransparenz vorzeichnet.',
      },
      {
        heading: 'Wie Steuerbehörden die Daten nutzen',
        body: 'Steuerbehörden nutzen CbCR-Daten zur Risikobewertung, nicht für direkte Steueranpassungen. Ein Bericht, der hohe Gewinne in einer Niedrigsteuerjurisdiktion mit wenigen Mitarbeitern und geringen Vermögenswerten zeigt, weckt Verdacht. Die Behörden führen daraufhin detaillierte Transfer-Pricing-Prüfungen bei den auffälligen Einheiten durch. CbCR hat die Fähigkeit afrikanischer Steuerbehörden, Gewinnverlagerungsrisiken in ihren Rechtsordnungen zu erkennen, erheblich verbessert.',
      },
      {
        heading: 'Compliance- und Einreichungsanforderungen',
        body: 'Der CbCR wird typischerweise innerhalb von 12 Monaten nach Ende des Geschäftsjahres eingereicht. Er wird über bilaterale oder multilaterale Abkommen zwischen Rechtsordnungen ausgetauscht. Unternehmen müssen zudem ein Master File und ein Local File als Teil des dreistufigen Transfer-Pricing-Dokumentationsrahmens erstellen. Nichteinreichung kann zu Bußgeldern führen, und manche Rechtsordnungen teilen Informationen über Nichteinhaltung mit anderen Steuerbehörden.',
      },
    ],
    faq: [
      {
        q: 'Gilt CbCR für kleine Unternehmen?',
        a: 'Nein. Der Schwellenwert von 750 Millionen € Umsatz bedeutet, dass CbCR direkt nur große multinationale Konzerne betrifft. Tochtergesellschaften großer Konzerne, die in Ihrem Markt tätig sind, können jedoch CbCR unterliegen, und die Transparenzgrundsätze sickern in manchen Ländern allmählich auf niedrigere Konzernschwellen durch.',
      },
      {
        q: 'Wird der CbCR veröffentlicht?',
        a: 'Derzeit wird CbCR vertraulich zwischen Steuerbehörden geteilt, nicht öffentlich offengelegt. Die EU hat jedoch ein öffentliches CbCR für große in Europa tätige Unternehmen eingeführt, und es gibt eine wachsende globale Tendenz, einen Teil oder alle dieser Daten öffentlich zugänglich zu machen.',
      },
      {
        q: 'Was ist der dreistufige Dokumentationsansatz?',
        a: 'BEPS-Maßnahme 13 hat drei Dokumente etabliert: das Master File (konzernweiter Überblick über Tätigkeiten und Transfer-Pricing-Grundsätze), das Local File (detaillierte Transfer-Pricing-Analyse für jede Einheit) und den CbCR (länderbezogene Aggregatdaten). Zusammen geben sie den Steuerbehörden einen umfassenden Einblick in das Transfer Pricing des Konzerns.',
      },
    ],
  },
}
