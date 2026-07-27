import { AcademyArticle } from '../academy-types'

export const waveB2Translations: Record<string, Partial<AcademyArticle>> = {
  "what-is-enterprise-value": {
    title: "Was ist Unternehmens-Wert?",
    description: "Erfahren Sie, wie der Unternehmens-Wert das Gesamtwert eines Unternehmens misst, indem er Eigenkapitalwert und Schulden kombiniert und Bargeld abzieht, was ein klareres Bild als nur Marktkapitalisierung bietet.",
    keywords: ["Unternehmens-Wert", "EV", "Unternehmens-Bewertung", "Marktkapitalisierung", "Eigenkapitalwert", "Geschäftswert"],
    keyTakeaways: [
      "Der Unternehmens-Wert repräsentiert den Gesamtpreis zum Erwerb eines Unternehmens, einschließlich Eigenkapital und Schulden-Verpflichtungen.",
      "Es wird berechnet als Marktkapitalisierung plus Gesamtschulden minus Bargeld und Bargeld-Äquivalente.",
      "EV wird über Marktkapitalisierung bevorzugt zum Vergleich von Unternehmen mit verschiedenen Kapitalstrukturen."
    ],
    content: [
      { heading: "Was Unternehmens-Wert repräsentiert", body: "Unternehmens-Wert (EV) ist ein Maß für eines Unternehmens Gesamtwert, das sein Eigenkapital, Schulden und Bargeld-Position berücksichtigt. Im Unterschied zu Marktkapitalisierung, die nur den Wert des Eigenkapitals reflektiert, repräsentiert EV, was ein Erwerber zahlen müsste, um vollständigen Besitz des Geschäfts zu übernehmen. Dies beinhaltet, die Schulden des Unternehmens zu annehmen, während auch Zugang zu seinen Bargeld-Reserven gain. EV bietet ein vollständigeres Bild des Geschäftswerts für Vergleich-Zwecke." },
      { heading: "Wie man Unternehmens-Wert berechnet", body: "Die Standard-Formel ist: Unternehmens-Wert = Marktkapitalisierung + Gesamtschulden + Minderheits-Beteiligung + Bevorzugtes Eigenkapital - Bargeld und Bargeld-Äquivalente. Zum Beispiel, ein Unternehmen mit einer $50 Million Marktkapitalisierung, $20 Million in Schulden und $5 Million in Bargeld hat einen EV von $65 Million. Diese Berechnung enthüllt, dass das Kaufen des Unternehmens mehr kostet, als sein Share-Preis impliziert, weil der Erwerber auch die Schulden-Verpflichtungen des Unternehmens erbt." },
      { heading: "Warum EV in der Bewertung wichtig ist", body: "Unternehmens-Wert ermöglicht aussagekräftige Vergleiche zwischen Unternehmen mit verschiedenen Finanzierungsstrukturen. Zwei Unternehmen mit identischen Operationen, aber verschiedenen Schulden-Niveaus, werden verschiedene Marktkapitalisierungen, aber ähnliche Unternehmens-Werte haben, wenn richtig angepasst. Dies macht EV-basierte Multiples wie EV/EBITDA zuverlässiger als Preis-basierte Ratios für Cross-Company-Analyse. Investment Banker und Analysten über afrikanischen und globalen Märkten verwenden EV als Grundlage für die meisten Bewertungs-Arbeiten." },
      { heading: "Unternehmens-Wert in der Praxis", body: "Bei der Evaluierung von Akquisitions-Zielen konzentrieren sich Käufer auf Unternehmens-Wert, um die echten Kosten des Besitzes zu verstehen. Ein Unternehmen mag billig basierend auf seinem Share-Preis aussehen, aber erhebliche verborgene Schulden tragen. Umgekehrt kostet ein Unternehmen mit großen Bargeld-Reserven effektiv weniger, als seine Marktkapitalisierung suggert. Das Verstehen von EV ist essentiell für jeden, der in M&A involved ist, ob Deals über der Johannesburg Stock Exchange analysiert oder private Unternehmen über Afrika evaluiert werden." }
    ],
    faq: [
      { q: "Was ist der Unterschied zwischen Unternehmens-Wert und Marktkapitalisierung?", a: "Marktkapitalisierung misst nur den Eigenkapitalwert eines Unternehmens durch Multiplizieren des Share-Preises mit ausgegebenen Shares. Unternehmens-Wert addiert Gesamtschulden und subtrahiert Bargeld, was den vollständigen Kosten der Akquisition des Geschäfts einschließlich angenommener Verbindlichkeiten gibt." },
      { q: "Kann Unternehmens-Wert negativ sein?", a: "Ja, obwohl es selten ist. Ein negativer Unternehmens-Wert tritt auf, wenn eines Unternehmens Bargeld und Investitionen seine Marktkapitalisierung plus Schulden überschreiten. Dies kann auf ein unterbewertetes Unternehmen oder eine mit strukturellen Probleme führende Probleme signalisieren, die den Markt, sein Eigenkapital zu Heavy Diskontieren verursachen." },
      { q: "Warum wird Bargeld von Unternehmens-Wert subtrahiert?", a: "Bargeld wird subtrahiert, weil ein Erwerber Zugang zu des Ziels Bargeld bei Kauf gained. Effektiv kann der Käufer das erworbene Bargeld verwenden, um den Kauf-Preis auszugleichen, was die net Kosten der Akquisition reduziert." }
    ]
  },
  "what-is-discounted-cash-flow": {
    title: "Was ist Discounted Cash Flow?",
    description: "Verstehen Sie, wie Discounted-Cash-Flow-Analyse ein Geschäft bewertet, indem es zukünftige Geldströme prognostiziert und sie zu ihrem Gegenwartswert diskontiert.",
    keywords: ["Discounted Cash Flow", "DCF", "Innerer Wert", "Gegenwartswert", "Cash-Flow-Prognose", "Bewertungsmodell"],
    keyTakeaways: [
      "DCF-Analyse bewertet ein Geschäft basierend auf dem Gegenwartswert seiner erwartete zukünftigen Geldströme.",
      "Es erfordert die Prognose von freien Geldströmen und die Auswahl eines geeigneten Diskount-Satzes.",
      "Ein Terminal-Wert erfasst den Unternehmens-Wert jenseits der expliziten Prognose-Periode."
    ],
    content: [
      { heading: "Wie DCF-Analyse funktioniert", body: "Eine Discounted-Cash-Flow-Analyse schätzt einen Unternehmens Inneren Wert durch die Prognose seiner zukünftigen freien Geldströme und ihre Diskontierung zum Gegenwartswert unter Verwendung einer Rate, die das Risiko dieser Geldströme reflektiert. Die Logik ist, dass in der Zukunft empfangenes Geld weniger wert ist als heute empfangenes Geld aufgrund von Inflation, Risiko und Gelegenheitskosten. DCF wird als eine der rigorosesten Bewertungsmethoden betrachtet, weil es auf fundamentaler Bargeld-Generierung basiert anstatt Markt-Gefühl." },
      { heading: "Bauen eines DCF-Modells", body: "Ein DCF-Modell beginnt mit detaillierten Finanz-Prognosen, typischerweise fünf bis zehn Jahre von Umsatz, Kosten und Kapital-Ausgaben, um freien Geldfluss abzuleiten. Der Diskount-Satz, normalerweise die gewichtete durchschnittlichen Kosten von Kapital (WACC), reflektiert die verschmolzenen Kosten des Unternehmens Fremd- und Eigenkapital-Finanzierung. Ein Terminal-Wert wird berechnet, um Wert jenseits der Prognose-Periode erfassen, oft unter Verwendung einer Perpetuity-Wachstums-Methode oder Exit-Multiple-Ansatz." },
      { heading: "Schlüssel-Annahmen und Sensitivitäten", body: "DCF-Bewertungen sind sehr empfindlich auf Input-Annahmen. Kleine Änderungen des Diskount-Satzes, Wachstums-Prognosen oder Terminal-Wert-Annahmen können den Output dramatisch verändern. Analysten führen typischerweise Sensitivitäts-Analysen durch, um eine Reihe von Szenarien zu testen. Für afrikanische Unternehmen beinhalten zusätzliche Überlegungen Währungsrisiko, politische Stabilität und begrenzte Verfügbarkeit von vergleichbaren Markt-Daten, alle von denen Prognosen und Diskount-Sätze betreffen." },
      { heading: "Stärken und Einschränkungen", body: "Die Stärke der DCF-Methode ist, dass sie ein Unternehmen auf seine Eigenen Fundamentale bewertet, unabhängig von Markt-Bedingungen oder Peer-Bewertungen. Allerdings ist es nur so zuverlässig wie seine Annahmen. Für Early-Stage-Startups mit unvorhersehbaren Geldströmen kann DCF unpraktisch sein. Für reife Unternehmen mit stabilen Operationen bietet es ein robustes Framework. Analysten verwenden oft DCF neben relativen Bewertungs-Methoden, um eine Unternehmens faire Wert zu triangulieren und Vertrauen in ihre Schlussfolgerungen zu bauen." }
    ],
    faq: [
      { q: "Welcher Diskount-Satz sollte in einem DCF verwendet werden?", a: "Der häufigsten verwendete Diskount-Satz ist der gewichtete durchschnittliche Kosten von Kapital (WACC), die die Kosten von Fremd- und Eigenkapital blenden, die von des Unternehmens Kapitalstruktur gewichtet werden. Für riskantere Investitionen oder Emerging-Market-Unternehmen wird ein höherer Diskount-Satz angewendet, um zusätzliche Unsicherheit zu reflektieren." },
      { q: "Was ist ein Terminal-Wert in DCF?", a: "Der Terminal-Wert schätzt den Unternehmens-Wert am Ende der expliziten Prognose-Periode, erfassend alle zukünftigen Geldströme jenseits dieses Punkts. Er machte oft 60-80% des gesamten DCF-Wertes und wird berechnet unter Verwendung entweder eines Perpetuity-Wachstums-Modells oder eines Exit-Multiples." },
      { q: "Ist DCF geeignet zum Bewerten von Startups?", a: "DCF ist herausfordernd für Early-Stage-Startups, weil ihre Geldströme schwierig vorherzusagen sind und oft negativ. Alternative Methoden wie vergleichbare Unternehmen-Analyse oder Venture-Capital-Bewertungs-Methoden werden häufiger für Startups verwendet, bis sie stabil, vorhersehbare Umsatz erreichen." }
    ]
  }
}
