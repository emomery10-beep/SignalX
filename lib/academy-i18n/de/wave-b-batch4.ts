import { AcademyArticle } from '../academy-types'

export const waveB4Translations: Record<string, Partial<AcademyArticle>> = {
  "what-is-just-in-time-inventory": {
    title: "Was ist Just-in-Time-Inventar?",
    description: "Erkunden Sie, wie Just-in-Time-Inventar-Verwaltung Verschwendung minimiert, indem Waren nur empfangen werden, wenn sie im Produktions- oder Verkaufsprozess benötigt werden.",
    keywords: ["Just-in-Time", "JIT-Inventar", "Lean Manufacturing", "Verschwendungs-Reduzierung", "Pull-System", "Toyota Production System"],
    keyTakeaways: [
      "JIT zielt darauf ab, Materialien und Produkte zu empfangen und herzustellen, nur wenn sie benötigt werden, was Inventar-Haltung minimiert.",
      "Es reduziert Verschwendung, senkt Tragekosten und verbessert den Cashflow, erfordert aber hochzuverlässige Lieferketten.",
      "Der Ansatz stammt vom Toyota Production System und ist ein Grundpfeiler des Lean Manufacturing."
    ],
    content: [
      { heading: "Was JIT-Inventar-Verwaltung ist", body: "Just-in-Time-Inventar ist eine Management-Strategie, die Rohstoff-Bestellungen und Produktions-Pläne direkt an Kundennachfrage ausrichtet. Anstatt Materialien und fertig Waren zu lagern, ziehen JIT-Systeme Inventar durch die Lieferkette nur wie benötigt. Dieser Ansatz wurde von Toyota in Japan in den 1970ern entwickelt und wurde ein Fundament-Element des Lean Manufacturing. Das Ziel ist, Verschwendung in Form von überschüssigen Inventar, Überproduktion und unnötige Handhabung zu eliminieren." },
      { heading: "Wie JIT-Systeme operieren", body: "In einem JIT-System wird Produktion durch echte Kundenbefehle ausgelöst, anstatt Nachfrage-Prognosen. Lieferanten liefern Komponenten in klein, häufigen Chargen zeitlich zu ankommen, just bevor sie auf der Produktionslinie benötigt werden. Dies erfordert präzise Koordination, zuverlässige Logistik und enge Lieferanten-Beziehungen. Kanban-Karten oder elektronische Signale teilen mit, wenn Materialien Nachschubs benötigen. Das gesamte System hängt von Konsistenz, Qualität und minimaler Variabilität über alle Lieferketten-Partner ab." },
      { heading: "Vorteile von Just-in-Time", body: "JIT reduziert dramatisch Inventar-Lagerkosten, freed Lager-Raum auf und verbessert den Cashflow durch Minimierung von in Bestand gebundenem Kapital. Es exponiert auch Qualitäts-Probleme schnell, da es keinen Puffer-Inventar gibt, um Mängel zu maskieren. Unternehmen, die JIT verwenden, sehen oft reduzierte Verschwendung, schnellere Durchsatz und verbesserte Produkt-Qualität. Die Disziplin, die zum Unterhalten von JIT-Systemen erforderlich ist, treibt kontinuierliche Verbesserung in Prozessen, Lieferanten-Beziehungen und Produktions-Effizienz." },
      { heading: "Herausforderungen und Anwendbarkeit in Afrika", body: "JIT erfordert extrem zuverlässige Lieferanten und Logistik-Netze, was vollständige Implementierung in Märkten mit Infrastruktur-Einschränkungen herausfordernd macht. Hafen-Stau, unvorhersehbare Zoll-Prozesse und unzuverlässiger Inland-Transport über viele afrikanische Länder können die enge Timing stören, die JIT verlangt. Allerdings können Elemente des JIT-Denkens, wie Reduzieren überschüssigen Inventars, Verbesserung der Lieferanten-Beziehungen und Ausscheiden von Verschwendung, an lokale Bedingungen angepasst werden, ohne dass das volle Systemgenauigkeit erforderlich ist." }
    ],
    faq: [
      { q: "Was sind die Risiken von Just-in-Time-Inventar?", a: "Das Hauptrisiko ist Anfälligkeit für Lieferketten-Unterbrechungen. Mit minimalem Puffer-Bestand kann jede Verzögerung von einem Lieferanten, Versand-Unterbrechung oder plötzliche Nachfrage-Spike die Produktion halt. Die COVID-19-Pandemie exponierte diese Anfälligkeit, wenn viele JIT-abhängige Hersteller kritische Mangel gegenüber sahen." },
      { q: "Kann JIT für Einzelhandels-Unternehmen funktionieren?", a: "Einzelhandels-Adaptionen von JIT beinhalten häufige klein Lieferungen, Cross-Docking bei Verteilungs-Zentren und responsive Nachschubs-Systeme. Fast-Fashion-Einzelhändler wie Zara verwenden JIT-Prinzipien, um nicht verkaufte Inventar zu reduzieren. Allerdings erfordert Einzelhandels-JIT immer noch zuverlässige Logistik und responsive Lieferanten-Netze." },
      { q: "Wie unterscheidet sich JIT von der Haltung von Sicherheits-Bestand?", a: "JIT minimiert allen Inventar, einschließlich Sicherheits-Bestand, sich stattdessen auf Lieferketten-Zuverlässigkeit und Geschwindigkeit verlassend. Sicherheits-Bestand ist essentiell der gegensätzliche Ansatz: extra Inventar zu halten, um Unsicherheit zu absorbieren. Viele Unternehmen verwenden einen Hybrid-Ansatz, werben JIT-Prinzipien an, wo praktikabel, während kritische oder schwer-zu-source-Gegenstände den Sicherheits-Bestand halten." }
    ]
  }
}
