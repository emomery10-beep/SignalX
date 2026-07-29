// Academy article translations — Deutsch (de) — Wave C, batch 2.
//
// Funding & Investment cluster (development finance, patient/catalytic capital,
// fund of funds, SAFE, cap table, dilution, post-money valuation, liquidation
// preference, anti-dilution, drag-along) + Business Strategy & Growth cluster
// (product-market fit, GTM, OKRs, market sizing, competitive advantage,
// business model, pricing strategy, SWOT, growth hacking, value proposition,
// strategic planning, pivot, Ansoff matrix, customer development).
//
// Translated fields only (title, description, keywords, content,
// keyTakeaways, faq) — see lib/academy-i18n/README.md for the contract.
// slug/category/categorySlug/difficulty/readTime/relatedSlugs are
// intentionally absent; those stay canonical/English from the source files.
//
// GLOSSARY (locked de business terminology — reuse verbatim in every other
// de batch, this wave and future waves):
//   POS -> Kassensystem | profit -> Gewinn | revenue -> Umsatz | stock -> Bestand
//   margin -> Marge | cashier -> Kassierer | receipt -> Beleg
//   refund -> Rückerstattung | VAT -> Mehrwertsteuer | dashboard -> Dashboard
//   staff -> Mitarbeiter | role -> Rolle
//
// Merge this into lib/academy-i18n/de/index.ts's `translations` export
// (spread alongside any other de batches) — not done here per instructions.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveC2Translations: LocaleTranslations = {
  'what-is-development-finance': {
    title: 'Was ist Entwicklungsfinanzierung?',
    description:
      'Erfahren Sie, wie Entwicklungsfinanzierungsinstitutionen Kapital bereitstellen, um Wirtschaftswachstum zu fördern und Armut in Schwellen- und Grenzmärkten zu verringern.',
    keywords: [
      'Entwicklungsfinanzierung',
      'DFI',
      'Entwicklungsbank',
      'Schwellenmärkte',
      'konzessionäre Kredite',
      'multilaterale Finanzierung',
    ],
    keyTakeaways: [
      'Entwicklungsfinanzierungsinstitutionen (DFIs) stellen Kapital für Projekte und Unternehmen in Märkten bereit, in denen kommerzielle Finanzierung knapp ist.',
      'DFIs nutzen ein breites Spektrum an Instrumenten, darunter Kredite, Eigenkapital, Garantien und technische Unterstützung.',
      'Zu den wichtigsten in Afrika aktiven DFIs zählen die IFC, die AfDB, die CDC Group und Proparco.',
    ],
    content: [
      {
        heading: 'Was Entwicklungsfinanzierung ist',
        body: 'Entwicklungsfinanzierung umfasst die Finanzinstrumente und Institutionen, die sich der Förderung wirtschaftlicher Entwicklung in Schwellen- und Grenzmärkten widmen. Entwicklungsfinanzierungsinstitutionen sind spezialisierte, häufig staatlich getragene Organisationen, die dort Kapital bereitstellen, wo Geschäftsbanken und Investoren aufgrund des wahrgenommenen Risikos nicht tätig werden wollen. Sie zielen darauf ab, kommerzielle Tragfähigkeit zu belegen, private Investitionen anzuziehen und Märkte aufzubauen, die schließlich eigenständig funktionieren können.',
      },
      {
        heading: 'Wie DFIs arbeiten',
        body: 'DFIs setzen eine Reihe von Instrumenten ein, darunter langfristige Kredite, Eigenkapitalbeteiligungen, Mezzanine-Finanzierungen, Garantien und politische Risikoversicherungen. Häufig leisten sie zusätzlich technische Unterstützung, um Beteiligungsunternehmen und die Marktinfrastruktur zu stärken. Die IFC, der Bereich des Weltbank-Konzerns für den Privatsektor, ist die größte multilaterale DFI. In Afrika spielt die AfDB eine entscheidende Rolle neben bilateralen DFIs wie der britischen BII (vormals CDC Group), der französischen Proparco und der deutschen DEG.',
      },
      {
        heading: 'Auswirkungen auf Schwellenmärkte',
        body: 'DFIs waren maßgeblich am Aufbau kritischer Infrastruktur, der Ausweitung der finanziellen Inklusion und der Förderung privater Unternehmen in ganz Afrika beteiligt. Sie finanzieren Projekte, die kommerzielle Kreditgeber meiden, etwa Stromerzeugung in Grenzmärkten oder landwirtschaftliche Wertschöpfungsketten für Kleinbauern. Indem sie zeigen, dass diese Investitionen Renditen erwirtschaften können, ziehen DFIs nach und nach kommerzielles Kapital an und tragen dazu bei, lokale Finanzmärkte im Laufe der Zeit zu entwickeln.',
      },
      {
        heading: 'Kritik und Weiterentwicklung',
        body: 'Kritiker stellen infrage, ob DFIs tatsächlich zusätzliches privates Kapital mobilisieren oder einfach mit ihm konkurrieren. Bedenken hinsichtlich bürokratischer Prozesse und langsamer Umsetzungszeiten sind ebenfalls verbreitet. Als Reaktion darauf haben viele DFIs ihre Ansätze modernisiert, setzen auf Blended-Finance-Strukturen, arbeiten mit Fintech-Plattformen zusammen und entwickeln Kreditfazilitäten in Landeswährung. Der Schwerpunkt hat sich verschoben: weg von der Substitution privaten Kapitals, hin zu dessen Katalyse.',
      },
    ],
    faq: [
      {
        q: 'Was ist der Unterschied zwischen einer DFI und einer Geschäftsbank?',
        a: 'DFIs sind beauftragt, Entwicklung neben finanziellen Renditen zu fördern, und agieren in Märkten, die Geschäftsbanken als zu riskant einstufen. Sie akzeptieren längere Zeithorizonte, höhere Risikoprofile und mitunter unterdurchschnittliche Renditen, um Entwicklungswirkung zu erzielen, die Geschäftsbanken nicht verfolgen würden.',
      },
      {
        q: 'Wie verdienen DFIs Geld?',
        a: 'DFIs erzielen Renditen durch Zinsen auf Kredite, Dividenden und Kursgewinne aus Eigenkapitalbeteiligungen sowie Garantiegebühren. Auch wenn sie finanzielle Nachhaltigkeit anstreben, ist ihr primäres Ziel die Entwicklungswirkung und nicht die Gewinnmaximierung.',
      },
      {
        q: 'Welche DFIs sind in Afrika am aktivsten?',
        a: 'Zu den aktivsten DFIs in Afrika zählen die IFC, die Afrikanische Entwicklungsbank, British International Investment (BII), Proparco, DEG und die US International Development Finance Corporation. Gemeinsam stellen sie jährlich Milliarden für Infrastruktur, Finanzdienstleistungen, Landwirtschaft und verarbeitendes Gewerbe bereit.',
      },
    ],
  },

  'what-is-patient-capital': {
    title: 'Was ist geduldiges Kapital (Patient Capital)?',
    description:
      'Erfahren Sie, wie geduldiges Kapital Unternehmen und Projekten langfristige, flexible Finanzierung bietet, die längere Zeiträume benötigen, um Renditen zu erwirtschaften.',
    keywords: [
      'geduldiges Kapital',
      'Patient Capital',
      'langfristige Investition',
      'flexibles Kapital',
      'Sozialunternehmen',
      'Impact Fund',
      'Entwicklungsinvestition',
    ],
    keyTakeaways: [
      'Geduldiges Kapital akzeptiert längere Zeithorizonte und niedrigere kurzfristige Renditen, um Unternehmen mit hoher Wirkungskraft zu unterstützen.',
      'Es wird häufig in Sektoren wie Gesundheitswesen, Landwirtschaft und saubere Energie in Entwicklungsmärkten eingesetzt.',
      'Acumen ist einer der bekanntesten Praktiker des Patient-Capital-Ansatzes weltweit.',
    ],
    content: [
      {
        heading: 'Was geduldiges Kapital bedeutet',
        body: 'Geduldiges Kapital ist eine Investitionsform, die längere Zeithorizonte toleriert, oft 10 bis 15 Jahre oder mehr, bevor Renditen erwartet werden. Es schließt eine Lücke zwischen klassischer Philanthropie und kommerzieller Investition, indem es Unternehmen unterstützt, die einkommensschwache Gemeinschaften bedienen, aber Zeit benötigen, um Skalierung und Profitabilität zu erreichen. Anders als Zuschüsse erwartet geduldiges Kapital eine Rendite, verlangt aber anders als Venture Capital keine schnellen Exits oder aggressive Wachstumszeitpläne.',
      },
      {
        heading: 'Wie geduldiges Kapital funktioniert',
        body: 'Anbieter von geduldigem Kapital investieren über Eigenkapital, eigenkapitalähnliche Instrumente oder langfristige Kredite mit flexiblen Rückzahlungsbedingungen. Sie arbeiten eng mit Portfoliounternehmen zusammen und bieten neben der Finanzierung auch Managementunterstützung und technische Hilfe. Acumen, ein Pionier dieses Modells, hat über 145 Millionen US-Dollar in Unternehmen in Afrika, Südasien und Lateinamerika investiert. Ihr Ansatz zeigt, dass Unternehmen, die Armut bekämpfen, bei ausreichend Zeit und Unterstützung finanziell tragfähig werden können.',
      },
      {
        heading: 'Wo geduldiges Kapital zum Einsatz kommt',
        body: 'Geduldiges Kapital eignet sich besonders für Sektoren, in denen die Kundengewinnung langsam verläuft oder Infrastruktur aufgebaut werden muss, bevor Umsätze fließen. Off-Grid-Energieunternehmen in Ostafrika, etwa Anbieter von Solar-Home-Systemen, benötigen oft Jahre, um Vertriebsnetze aufzubauen, die ländliche Kunden erreichen. Landwirtschaftliche Unternehmen, die Kleinbauern bedienen, stehen vor ähnlichen Zeitrahmen. Auch Organisationen im Gesundheitswesen, die Kliniken in unterversorgten Gebieten aufbauen, profitieren von diesem längerfristigen Ansatz.',
      },
      {
        heading: 'Das Argument für Geduld',
        body: 'Studien zeigen, dass geduldiges Kapital neben sozialer Wirkung durchaus nennenswerte finanzielle Renditen erzielen kann, doch Investoren müssen akzeptieren, dass der Weg dorthin nicht linear verläuft. Unternehmen benötigen mitunter Jahre, um Geschäftsmodelle zu verfeinern, Kundenvertrauen aufzubauen und betriebliche Effizienz zu erreichen. Anbieter von geduldigem Kapital argumentieren, dass die Alternative — verfrühte Exits oder unrealistische Wachstumsziele zu erzwingen — häufig Wert vernichtet, in Märkten, in denen der Aufbau tragfähiger Unternehmen bedeutet, Infrastrukturlücken und regulatorische Komplexität zu bewältigen.',
      },
    ],
    faq: [
      {
        q: 'Wie lange dauern Investitionen mit geduldigem Kapital typischerweise?',
        a: 'Investitionen mit geduldigem Kapital haben in der Regel Zeithorizonte von 10 bis 15 Jahren, manche noch länger. Das steht im Gegensatz zu typischen Venture-Capital-Fonds, die Exits innerhalb von 5 bis 7 Jahren anstreben, und Private-Equity-Fonds mit Haltedauern von 3 bis 5 Jahren.',
      },
      {
        q: 'Ist geduldiges Kapital dasselbe wie konzessionäres Kapital?',
        a: 'Nicht unbedingt. Geduldiges Kapital bezieht sich auf den Zeithorizont, während konzessionäres Kapital bedeutet, unterdurchschnittliche finanzielle Konditionen zu akzeptieren. Geduldiges Kapital kann über einen längeren Zeitraum marktübliche Renditen erzielen, während konzessionäres Kapital ausdrücklich unterdurchschnittliche Renditen akzeptiert, um Wirkung zu erzielen.',
      },
      {
        q: 'Wer stellt geduldiges Kapital bereit?',
        a: 'Geduldiges Kapital stammt von Impact-Investment-Fonds wie Acumen, Entwicklungsfinanzierungsinstitutionen, Family Offices mit langfristiger Ausrichtung sowie Stiftungen. Diese Investoren verfügen über Mandate oder Strukturen, die es ihnen erlauben, längere Zeithorizonte zu akzeptieren als typische institutionelle Investoren.',
      },
    ],
  },

  'what-is-catalytic-capital': {
    title: 'Was ist katalytisches Kapital?',
    description:
      'Erfahren Sie, wie katalytisches Kapital überproportionales Risiko akzeptiert, um Investitionsmöglichkeiten zu erschließen, die sonst keine kommerzielle Finanzierung anziehen würden.',
    keywords: [
      'katalytisches Kapital',
      'First-Loss-Kapital',
      'Risikoabsorption',
      'Impact Investing',
      'konzessionäre Finanzierung',
      'Marktaufbau',
    ],
    keyTakeaways: [
      'Katalytisches Kapital akzeptiert Risiken oder Renditen, die andere Investoren ablehnen würden, und ermöglicht so Deals, die sonst keine Finanzierung erhalten würden.',
      'Es kann die Form von First-Loss-Positionen, nachrangigen Schulden, Garantien oder unterdurchschnittlichem Eigenkapital annehmen.',
      'Die MacArthur Foundation und die Rockefeller Foundation zählen weltweit zu den größten Anbietern von katalytischem Kapital.',
    ],
    content: [
      {
        heading: 'Katalytisches Kapital definiert',
        body: 'Katalytisches Kapital ist eine Investition, die im Vergleich zu einer konventionellen Investition überproportionales Risiko oder konzessionäre Renditen akzeptiert, um positive Wirkung zu erzielen und Drittinvestitionen zu ermöglichen, die sonst nicht zustande kämen. Es handelt sich nicht um Wohltätigkeit; es wird eine gewisse finanzielle Rendite erwartet, doch im Vordergrund steht die Erschließung zusätzlicher Kapitalflüsse. Der Begriff wurde von der MacArthur Foundation und Tideline geprägt, um Kapital zu beschreiben, das geduldig, risikotolerant, konzessionär oder flexibel ist — auf eine Weise, wie es kommerzielles Kapital nicht sein kann.',
      },
      {
        heading: 'Wie katalytisches Kapital funktioniert',
        body: 'Katalytisches Kapital nimmt typischerweise die Position mit dem höchsten Risiko innerhalb einer Kapitalstruktur ein. In einem geschichteten Fonds könnte es die ersten 10 bis 20 Prozent der Verluste absorbieren und damit vorrangige Investoren vor Abwärtsrisiken schützen. Das ermutigt Pensionsfonds, Versicherungsgesellschaften und andere institutionelle Investoren zur Teilnahme. In afrikanischen Märkten hat katalytisches Kapital von Stiftungen es erstmaligen Fondsmanagern ermöglicht, Vehikel aufzulegen, und wegweisenden Unternehmen Zugang zu Wachstumsfinanzierung verschafft, die kommerzielle Investoren allein nicht bereitgestellt hätten.',
      },
      {
        heading: 'Die Rolle beim Marktaufbau',
        body: 'Über einzelne Transaktionen hinaus spielt katalytisches Kapital eine entscheidende Rolle beim Aufbau völlig neuer Märkte. Indem es frühphasiges Risiko absorbiert, hilft es, kommerzielle Tragfähigkeit in Sektoren oder Regionen ohne Erfolgsbilanz nachzuweisen. Sobald mehrere Investitionen Renditen zeigen, folgt kommerzielles Kapital im großen Maßstab. Der Off-Grid-Solarsektor in Afrika veranschaulicht diese Entwicklung: Frühe katalytische Investitionen ebneten den Weg für Milliarden an kommerziellem Kapital.',
      },
      {
        heading: 'Herausforderungen beim Einsatz von katalytischem Kapital',
        body: 'Die Bereitstellung von katalytischem Kapital erfordert ein ausgereiftes Verständnis von Risiko, Wirkung und Marktdynamik. Geldgeber müssen sicherstellen, dass ihr Kapital tatsächlich katalytisch wirkt und nicht private Investitionen verdrängt. Governance-Strukturen müssen die Interessen katalytischer Geldgeber mit denen kommerzieller Co-Investoren in Einklang bringen. Die Zusätzlichkeit (Additionalität) von katalytischem Kapital zu messen — also nachzuweisen, dass Deals ohne dieses Kapital nicht zustande gekommen wären — bleibt methodisch anspruchsvoll, aber für die Rechenschaftspflicht unerlässlich.',
      },
    ],
    faq: [
      {
        q: 'Wie unterscheidet sich katalytisches Kapital von einem Zuschuss?',
        a: 'Katalytisches Kapital erwartet eine gewisse finanzielle Rendite, selbst wenn sie unter dem Marktniveau liegt, und ist damit eher eine Investition als eine Spende. Zuschüsse erwarten keine Rückzahlung. Katalytisches Kapital ist darauf ausgelegt, nach Eintritt der Renditen in künftige Investitionen reinvestiert zu werden, wodurch sich seine Wirkung über die Zeit verstärkt.',
      },
      {
        q: 'Wer stellt typischerweise katalytisches Kapital bereit?',
        a: 'Zu den wichtigsten Anbietern zählen philanthropische Stiftungen wie MacArthur und Rockefeller, Entwicklungsfinanzierungsinstitutionen wie die IFC sowie staatliche Institutionen. Diese Organisationen verfügen über Mandate, die es ihnen erlauben, höheres Risiko oder niedrigere Renditen im Dienst breiterer Entwicklungsziele zu akzeptieren.',
      },
      {
        q: 'Kann katalytisches Kapital kommerzielle Renditen erzielen?',
        a: 'In manchen Fällen ja. Auch wenn katalytisches Kapital per Definition überproportionales Risiko akzeptiert, können erfolgreiche Investitionen dennoch positive Renditen erwirtschaften. Der entscheidende Unterschied ist die Bereitschaft, Konditionen zu akzeptieren, die kommerzielle Investoren ablehnen würden, um den Deal überhaupt erst möglich zu machen.',
      },
    ],
  },

  'what-is-a-fund-of-funds': {
    title: 'Was ist ein Dachfonds (Fund of Funds)?',
    description:
      'Erfahren Sie, wie Dachfonds in mehrere zugrunde liegende Fonds investieren, um Diversifikation und Zugang zu spezialisierten Anlagestrategien zu bieten.',
    keywords: [
      'Dachfonds',
      'Fund of Funds',
      'Portfoliodiversifikation',
      'alternative Investments',
      'Private Equity',
      'Asset Allocation',
      'institutionelles Investieren',
    ],
    keyTakeaways: [
      'Ein Dachfonds investiert in ein Portfolio anderer Investmentfonds, statt direkt in Unternehmen oder Vermögenswerte.',
      'Er bietet Diversifikation über Manager, Strategien, Regionen und Jahrgänge hinweg.',
      'Die Struktur bringt eine zusätzliche Gebührenebene mit sich, ermöglicht aber Zugang zu Fonds mit hohen Mindestanlagen.',
    ],
    content: [
      {
        heading: 'Was ein Dachfonds ist',
        body: 'Ein Dachfonds ist ein Anlagevehikel, das Kapital über ein Portfolio zugrunde liegender Fonds verteilt, statt direkt in einzelne Unternehmen oder Vermögenswerte zu investieren. Dieser Ansatz bietet Investoren über eine einzige Zusage Diversifikation über mehrere Fondsmanager, Anlagestrategien, Sektoren und Regionen hinweg. Dachfondsstrukturen sind in Private Equity, Venture Capital, Hedgefonds und Immobilieninvestitionen verbreitet.',
      },
      {
        heading: 'Wie Dachfonds funktionieren',
        body: 'Investoren sagen dem Dachfonds Kapital zu, der von einem Team verwaltet wird, das für die Auswahl, Überwachung und Pflege der Beziehungen zu den zugrunde liegenden Fondsmanagern verantwortlich ist. Das Managementteam führt Due Diligence zu potenziellen Fondsinvestitionen durch, verhandelt Konditionen und konstruiert ein Portfolio, das Risiko und Rendite ausbalanciert. In Afrika investieren Dachfonds wie Sango Capital und von der AfDB unterstützte Initiativen über mehrere Private-Equity- und Venture-Capital-Fonds hinweg, die auf dem Kontinent tätig sind.',
      },
      {
        heading: 'Vor- und Nachteile',
        body: 'Der wesentliche Vorteil ist Diversifikation: Eine einzige Zusage bietet Zugang zu Dutzenden zugrunde liegender Investitionen über mehrere Fonds hinweg. Dachfonds bieten zudem Zugang zu Top-Managern, deren Fonds hohe Mindestzusagen verlangen, die einzelne Investoren nicht erfüllen könnten. Der Hauptnachteil ist die doppelte Gebührenebene: Investoren zahlen Managementgebühren und Carry sowohl an den Dachfonds als auch an jeden zugrunde liegenden Fonds, was die Nettorenditen im Vergleich zu Direktinvestitionen in Fonds schmälert.',
      },
      {
        heading: 'Wer Dachfonds nutzt',
        body: 'Institutionelle Investoren wie Pensionsfonds, Staatsfonds und Stiftungen nutzen Dachfonds häufig, um Zugang zu alternativen Anlageklassen zu erhalten, ohne große interne Investmentteams aufzubauen. Auch kleinere Institutionen und Family Offices nutzen sie, um Zugang zu diversifizierten Portfolios leistungsstarker Manager zu erhalten. Für Investoren, die Zugang zu afrikanischen Privatmärkten suchen, bieten Dachfonds einen praktikablen Einstiegspunkt mit professioneller Managerauswahl und Aufsicht.',
      },
    ],
    faq: [
      {
        q: 'Wie hoch sind die typischen Gebühren für einen Dachfonds?',
        a: 'Dachfonds berechnen in der Regel eine jährliche Managementgebühr von 0,5 bis 1,5 Prozent zuzüglich Carried Interest von 5 bis 10 Prozent auf Gewinne. Diese kommen zusätzlich zu den Gebühren der zugrunde liegenden Fonds hinzu, die üblicherweise 2 Prozent Managementgebühr und 20 Prozent Carry betragen.',
      },
      {
        q: 'Wie wählt ein Dachfonds seine zugrunde liegenden Fonds aus?',
        a: 'Die Auswahl umfasst eine sorgfältige Due Diligence zu Erfolgsbilanz, Anlagestrategie, Teamstabilität und operativer Infrastruktur der Fondsmanager. Der Dachfondsmanager berücksichtigt zudem Faktoren der Portfoliokonstruktion wie die Diversifikation nach Jahrgängen, regionale Balance und Sektorexposition.',
      },
      {
        q: 'Wie hoch ist die Mindestanlage für einen Dachfonds?',
        a: 'Die Mindestbeträge variieren stark, von 100.000 US-Dollar für einige auf vermögende Privatpersonen ausgerichtete Vehikel bis zu 5 Millionen US-Dollar oder mehr für institutionelle Dachfonds. Diese Mindestbeträge liegen in der Regel niedriger als bei einer Direktinvestition in die zugrunde liegenden Fonds, die jeweils 1 Million US-Dollar oder mehr verlangen können.',
      },
    ],
  },

  'what-is-a-safe-agreement': {
    title: 'Was ist eine SAFE-Vereinbarung?',
    description:
      'Ein SAFE (Simple Agreement for Future Equity) ermöglicht es Investoren, Startups zu finanzieren, ohne eine Bewertung festzulegen. Erfahren Sie, wie SAFEs funktionieren und welche Schlüsselbegriffe wichtig sind.',
    keywords: [
      'SAFE',
      'Simple Agreement for Future Equity',
      'Y Combinator',
      'Startup-Investition',
      'Pre-Seed-Finanzierung',
    ],
    keyTakeaways: [
      'Ein SAFE ist eine Vereinbarung, bei der ein Investor Kapital bereitstellt und im Gegenzug das Recht erhält, bei einer künftigen Finanzierungsrunde mit festgelegter Bewertung Anteile zu erhalten.',
      'Anders als Wandelanleihen haben SAFEs weder Zinssatz noch Fälligkeitsdatum, was sie für beide Seiten einfacher macht.',
      'SAFEs wurden von Y Combinator entwickelt und sind in vielen Märkten zum Standardinstrument für die Frühphasenfinanzierung geworden.',
    ],
    content: [
      {
        heading: 'Wie ein SAFE funktioniert',
        body: 'Ein Investor zahlt einem Startup einen festen Betrag und erhält im Gegenzug das Recht, diesen Betrag bei einer künftigen Finanzierungsrunde mit festgelegter Bewertung in Eigenkapital umzuwandeln. Die Umwandlung erfolgt automatisch zum Anteilspreis der neuen Runde, vorbehaltlich einer im SAFE festgelegten Bewertungsobergrenze oder eines Abschlags. Zum Zeitpunkt der Investition werden keine Anteile ausgegeben; das SAFE ist ein vertragliches Versprechen auf künftiges Eigenkapital.',
      },
      {
        heading: 'Arten von SAFEs',
        body: 'Die häufigsten Varianten sind: SAFE mit nur einer Bewertungsobergrenze (der Umwandlungspreis des Investors ist gedeckelt, unabhängig davon, wie hoch die Bewertung steigt), SAFE mit nur einem Abschlag (der Investor erhält Anteile zu einem Prozentsatz unter dem Preis der neuen Runde), SAFE mit sowohl Obergrenze als auch Abschlag (der Investor erhält, je nachdem was mehr Anteile ergibt) sowie das ungedeckelte SAFE ohne Abschlag, das den geringsten Investorenschutz bietet.',
      },
      {
        heading: 'Warum SAFEs populär wurden',
        body: 'Y Combinator führte das SAFE 2013 ein, um die Frühphasenfinanzierung zu vereinfachen. Im Vergleich zu Wandelanleihen entfallen bei SAFEs Verhandlungen über Zinssätze, Fälligkeitsdaten und deren Konsequenzen. Die Rechtsdokumente sind kürzer und günstiger in der Erstellung. Das hat SAFEs zum Standardinstrument bei Acceleratoren weltweit gemacht, darunter auch solche, die in Afrika tätig sind, wie Techstars und Flat6Labs.',
      },
      {
        heading: 'Überlegungen für Gründer',
        body: 'SAFEs sind gründerfreundlich, das heißt aber nicht, dass sie kostenlos sind. Jedes SAFE schafft eine künftige Verwässerungsverpflichtung, die auf dem Cap Table bis zur Umwandlung nicht sichtbar ist. Zu viel Geld über SAFEs mit niedrigen Obergrenzen aufzunehmen, kann bei einer Finanzierungsrunde mit festgelegter Bewertung zu erheblicher Gründerverwässerung führen. Modellieren Sie die Umwandlungsszenarien, bevor Sie unterschreiben, um die vollen Auswirkungen auf Ihre Eigentumsanteile zu verstehen.',
      },
    ],
    faq: [
      {
        q: 'Ist ein SAFE Eigenkapital oder Fremdkapital?',
        a: 'Streng genommen keines von beidem. Ein SAFE ist ein vertragliches Recht auf künftiges Eigenkapital. Es ist kein Fremdkapital, da keine Rückzahlungspflicht besteht und keine Zinsen anfallen. Es ist kein Eigenkapital, da bis zur Umwandlung keine Anteile ausgegeben werden. Diese einzigartige Struktur macht es einfacher als sowohl Wandelanleihen als auch Finanzierungsrunden mit festgelegter Bewertung.',
      },
      {
        q: 'Was ist der Unterschied zwischen Pre-Money- und Post-Money-SAFEs?',
        a: 'Bei einem Pre-Money-SAFE gilt die Obergrenze vor Berücksichtigung der SAFE-Erlöse, was die Verwässerung weniger vorhersehbar machen kann. Y Combinators Post-Money-SAFE, 2018 eingeführt, legt die Obergrenze inklusive aller SAFE-Gelder fest und gibt Gründern und Investoren klarere Verwässerungserwartungen bereits zum Zeitpunkt der Unterzeichnung.',
      },
      {
        q: 'Können SAFEs außerhalb der USA verwendet werden?',
        a: 'Ja, wobei die rechtliche Durchsetzbarkeit vom lokalen Gesellschaftsrecht abhängt. SAFEs werden in afrikanischen Startup-Ökosystemen häufig genutzt, insbesondere in Nigeria, Kenia und Südafrika. Manche Rechtsordnungen erfordern Anpassungen, um lokale Wertpapiervorschriften einzuhalten. Konsultieren Sie stets einen örtlichen Anwalt.',
      },
    ],
  },

  'what-is-a-cap-table': {
    title: 'Was ist ein Cap Table (Kapitalisierungstabelle)?',
    description:
      'Ein Cap Table erfasst, wem was in einem Unternehmen gehört. Erfahren Sie, warum er wichtig ist und wie Sie ihn von Anfang an richtig führen.',
    keywords: [
      'Cap Table',
      'Kapitalisierungstabelle',
      'Eigenkapitalbesitz',
      'Aktionärsregister',
      'Startup-Eigenkapital',
    ],
    keyTakeaways: [
      'Ein Cap Table ist ein Verzeichnis sämtlicher Eigenkapitalanteile an einem Unternehmen, einschließlich Aktien, Optionen, Optionsscheinen und wandelbaren Instrumenten.',
      'Er zeigt, wer welchen Prozentsatz besitzt, sowohl auf ausstehender als auch auf voll verwässerter Basis.',
      'Einen genauen Cap Table von Anfang an zu führen, verhindert kostspielige Streitigkeiten und Fehler bei der Kapitalbeschaffung.',
    ],
    content: [
      {
        heading: 'Was ein Cap Table zeigt',
        body: 'Eine Kapitalisierungstabelle listet jeden Anteilseigner des Unternehmens auf: Gründer, Investoren, Mitarbeiter mit Optionen sowie Inhaber wandelbarer Instrumente wie SAFEs und Wandelanleihen. Für jeden Anteilseigner zeigt sie die Anzahl der gehaltenen Anteile, die Anteilsklasse, den prozentualen Eigentumsanteil und den gezahlten Preis. Ein voll verwässerter Cap Table enthält zudem Anteile, die entstehen würden, wenn alle Optionen, Optionsscheine und wandelbaren Instrumente ausgeübt oder umgewandelt würden.',
      },
      {
        heading: 'Warum Genauigkeit wichtig ist',
        body: 'Jede Finanzierungsrunde, jedes Übernahmegespräch und jede Mitarbeiterbeteiligung hängt von einem genauen Cap Table ab. Fehler summieren sich über die Zeit und können Transaktionen zum Scheitern bringen. Ein nigerianisches Startup, das während der Due-Diligence-Prüfung einer Series-A-Runde Fehler im Cap Table entdeckt, kann wochenlange Verzögerungen erleben, während Anwälte die Diskrepanzen abgleichen. Von der Gründung an sauber zu beginnen und die Genauigkeit fortlaufend zu pflegen, verhindert diese Probleme.',
      },
      {
        heading: 'Häufige Fehler beim Cap Table',
        body: 'Die häufigsten Fehler umfassen: frühe Anteilsübertragungen unter Gründern nicht zu dokumentieren, Vesting-Zeitpläne nicht nachzuverfolgen, den verwässernden Effekt ausstehender SAFEs und Optionen zu ignorieren sowie den Überblick über kleine, informell getätigte Angel-Investitionen zu verlieren. Ein weiterer häufiger Fehler ist es, die Auswirkungen künftiger Runden nicht zu modellieren, was Gründer nach einer Series A von ihrem verringerten Eigentumsanteil überrascht.',
      },
      {
        heading: 'Werkzeuge und bewährte Praktiken',
        body: 'Einfache Cap Tables lassen sich in Tabellenkalkulationen führen, doch mit wachsender Komplexität nehmen die Fehler zu. Spezialisierte Tools wie Carta, Pulley und Ledgy automatisieren Berechnungen, verfolgen Vesting und modellieren künftige Szenarien. Unabhängig vom Tool sollte der Cap Table nach jedem Eigenkapitalereignis sofort aktualisiert werden: Anteilsausgabe, Optionsgewährung, SAFE-Unterzeichnung oder Anteilsübertragung. Lassen Sie ihn niemals veralten.',
      },
    ],
    faq: [
      {
        q: 'Wann sollte ich einen Cap Table anlegen?',
        a: 'Bei der Gründung, sobald Anteile an Gründer ausgegeben werden. Selbst wenn es nur zwei Anteilseigner gibt, sollte dies ordentlich dokumentiert werden. Jedes nachfolgende Eigenkapitalereignis sollte sofort erfasst werden. Einen Cap Table Monate oder Jahre später rückwirkend zu erstellen, ist fehleranfällig und teuer.',
      },
      {
        q: 'Was ist der Unterschied zwischen ausstehenden und voll verwässerten Anteilen?',
        a: 'Ausstehende Anteile sind jene, die derzeit ausgegeben sind und von Anteilseignern gehalten werden. Voll verwässerte Anteile umfassen ausstehende Anteile zuzüglich aller Anteile, die entstehen würden, wenn jede Option, jeder Optionsschein, jedes SAFE und jede Wandelanleihe ausgeübt oder umgewandelt würde. Investoren bewerten den Eigentumsanteil typischerweise auf voll verwässerter Basis.',
      },
      {
        q: 'Sollte mein Cap Table den Optionspool enthalten?',
        a: 'Ja. Der Optionspool, ob zugeteilt oder nicht, sollte im voll verwässerten Cap Table erscheinen. Investoren möchten die Gesamtgröße des Pools sehen, wie viel bereits gewährt wurde und wie viel noch verfügbar ist. Der Optionspool verwässert alle bestehenden Anteilseigner anteilig.',
      },
    ],
  },

  'what-is-dilution': {
    title: 'Was ist Verwässerung (Dilution)?',
    description:
      'Verwässerung tritt auf, wenn neue Anteile ausgegeben werden und dadurch der Eigentumsanteil bestehender Anteilseigner sinkt. Erfahren Sie, wie sie funktioniert und wie Sie damit umgehen.',
    keywords: [
      'Verwässerung',
      'Dilution',
      'Eigenkapitalverwässerung',
      'Anteilsverwässerung',
      'Eigentumsanteil',
      'Anti-Verwässerung',
    ],
    keyTakeaways: [
      'Verwässerung verringert den prozentualen Eigentumsanteil eines bestehenden Anteilseigners, wenn neue Anteile geschaffen werden, auch wenn der Wert seines Anteils dabei steigen kann.',
      'Jede Finanzierungsrunde, jede Optionsgewährung und jede Umwandlung eines wandelbaren Instruments führt zu einer Verwässerung bestehender Anteilseigner.',
      'Verwässerung ist nicht per se schlecht, solange die neuen Anteile den Unternehmenswert um mehr steigern, als der verlorene Prozentsatz ausmacht.',
    ],
    content: [
      {
        heading: 'Wie Verwässerung funktioniert',
        body: 'Wenn Sie 1.000 von insgesamt 10.000 Anteilen besitzen, halten Sie 10 Prozent des Unternehmens. Gibt das Unternehmen 5.000 neue Anteile an einen Investor aus, gibt es nun 15.000 Anteile insgesamt, und Ihre 1.000 Anteile entsprechen nur noch 6,67 Prozent. Ihr Eigentumsanteil wurde von 10 auf 6,67 Prozent verwässert. Wurden die neuen Anteile jedoch zu einem hohen Preis verkauft, kann der Wert Ihrer 6,67 Prozent den Wert Ihrer ursprünglichen 10 Prozent übersteigen.',
      },
      {
        heading: 'Wann Verwässerung eintritt',
        body: 'Verwässerung tritt bei jedem Eigenkapitalereignis auf: Finanzierungsrunden, Mitarbeiteroptionsgewährungen, SAFE-Umwandlungen, Ausübung von Optionsscheinen und Umwandlungen von Wandelanleihen. Gründer erfahren typischerweise die stärkste Verwässerung, da sie von der frühesten Runde an dabei sind. Ein Gründer, der mit 50 Prozent startet, hält nach einer Series B möglicherweise nur noch 15 bis 20 Prozent, je nachdem, wie viel Kapital zu welchen Bewertungen aufgenommen wurde.',
      },
      {
        heading: 'Gute Verwässerung vs. schlechte Verwässerung',
        body: 'Verwässerung durch eine starke Finanzierungsrunde bei steigender Bewertung ist grundsätzlich positiv, da der Gesamtwert des Unternehmens schneller wächst, als Ihr Prozentanteil schrumpft. 20 Prozent eines Unternehmens im Wert von 50 Millionen US-Dollar zu besitzen, ist besser als 50 Prozent eines Unternehmens im Wert von 2 Millionen US-Dollar. Schlechte Verwässerung tritt auf, wenn neue Anteile zu niedrigen Bewertungen ausgegeben werden, Anti-Verwässerungsklauseln Ratchets auslösen oder unnötiges Eigenkapital verschenkt wird.',
      },
      {
        heading: 'Verwässerung steuern',
        body: 'Modellieren Sie Ihre Verwässerung über mehrere künftige Runden hinweg, bevor Sie Finanzierungskonditionen akzeptieren. Verstehen Sie, wie sich Bewertungsobergrenzen bei SAFEs, Erweiterungen des Optionspools und Anti-Verwässerungsklauseln auf Ihren Eigentumsanteil auswirken. Nehmen Sie nur so viel Kapital auf, wie Sie benötigen, um bedeutende Meilensteine zu erreichen. Verhandeln Sie Bewertungsobergrenzen und Pre-Money-Bewertungen sorgfältig. Viele afrikanische Gründer unterschätzen die kumulative Verwässerung über mehrere Runden hinweg, weil sie sich jeweils nur auf eine Runde konzentrieren.',
      },
    ],
    faq: [
      {
        q: 'Wie viel Verwässerung pro Runde ist normal?',
        a: 'Gründer geben typischerweise bei jeder Finanzierungsrunde 15 bis 25 Prozent ab. Seed-Runden verwässern oft um 20 bis 25 Prozent, Series A um 15 bis 25 Prozent und spätere Runden um 10 bis 20 Prozent. Diese Spannen variieren je nach Markt, Unternehmensstärke und Verhandlungsdynamik.',
      },
      {
        q: 'Kann ich Verwässerung vollständig vermeiden?',
        a: 'Nur indem Sie niemals neue Anteile ausgeben, was bedeutet: keine externe Finanzierung und keine Mitarbeiterbeteiligungen. Das begrenzt das Wachstum der meisten Unternehmen. Ziel ist nicht, Verwässerung zu vermeiden, sondern sicherzustellen, dass jedes verwässernde Ereignis den Gesamtwert ausreichend steigert, damit der verbleibende Prozentanteil wertvoller wird.',
      },
      {
        q: 'Beeinträchtigt Verwässerung meine Stimmrechte?',
        a: 'In der Regel ja. Sinkt Ihr Eigentumsanteil, sinkt auch Ihre Stimmkraft proportional, es sei denn, Sie halten Anteile mit erweiterten Stimmrechten. Manche Gründer verhandeln Dual-Class-Anteilsstrukturen, um trotz Verwässerung die Kontrolle zu behalten, was jedoch bei Unternehmen in späteren Phasen häufiger vorkommt.',
      },
    ],
  },

  'what-is-post-money-valuation': {
    title: 'Was ist die Post-Money-Bewertung?',
    description:
      'Die Post-Money-Bewertung ist der Wert eines Unternehmens unmittelbar nach Erhalt einer Investition. Erfahren Sie, wie sie sich zur Pre-Money-Bewertung und zum Eigentumsanteil verhält.',
    keywords: [
      'Post-Money-Bewertung',
      'Startup-Bewertung',
      'Finanzierungsrunde',
      'Eigenkapitalbesitz',
      'Finanzierung',
    ],
    keyTakeaways: [
      'Die Post-Money-Bewertung entspricht der Pre-Money-Bewertung zuzüglich der neuen Investitionssumme.',
      'Sie stellt den Gesamtwert des Unternehmens unmittelbar nach Abschluss der Finanzierungsrunde dar.',
      'Der Eigentumsanteil des Investors wird berechnet, indem die Investition durch die Post-Money-Bewertung geteilt wird.',
    ],
    content: [
      {
        heading: 'Die Formel',
        body: 'Die Post-Money-Bewertung ist unkompliziert: Pre-Money-Bewertung plus neue Investition ergibt die Post-Money-Bewertung. Hat ein Unternehmen eine Pre-Money-Bewertung von 8 Millionen US-Dollar und nimmt 2 Millionen US-Dollar auf, beträgt die Post-Money-Bewertung 10 Millionen US-Dollar. Der Investor, der 2 Millionen US-Dollar beigesteuert hat, besitzt 20 Prozent des Unternehmens. Diese Formel ist die Grundlage jeder Berechnung rund um Finanzierungsrunden.',
      },
      {
        heading: 'Warum die Post-Money-Bewertung wichtig ist',
        body: 'Die Post-Money-Bewertung legt den Referenzwert des Unternehmens für die nächste Phase fest. Sie setzt die Messlatte, die das Unternehmen überschreiten muss, um bei der nächsten Finanzierungsstufe eine Aufwertungsrunde (Up Round) zu erreichen. Mitarbeiteroptionen werden typischerweise auf Basis der Post-Money-Bewertung bepreist. Sie bestimmt zudem den bilanziellen Wert der Anteile aller Anteilseigner und wird in Ankündigungen zur Kapitalbeschaffung und in der Presseberichterstattung genannt.',
      },
      {
        heading: 'Post-Money-Bewertung bei SAFEs',
        body: 'Y Combinators Post-Money-SAFE definiert die Bewertungsobergrenze als Post-Money-Wert. Das bedeutet, die Obergrenze schließt die SAFE-Investition selbst ein, was zum Zeitpunkt der Unterzeichnung eine klarere Verwässerungsrechnung ermöglicht. Hat ein Post-Money-SAFE eine Obergrenze von 10 Millionen US-Dollar und der Investor zahlt 1 Million US-Dollar ein, ist ihm bei der Umwandlung mindestens ein Eigentumsanteil von 10 Prozent garantiert, unabhängig von der Bewertung der Finanzierungsrunde mit festgelegter Bewertung.',
      },
      {
        heading: 'Grenzen der Post-Money-Bewertung',
        body: 'Die Post-Money-Bewertung spiegelt den Preis wider, den ein Investor zu einem bestimmten Zeitpunkt gezahlt hat, nicht den inneren Wert des Unternehmens. Sie berücksichtigt weder Liquidationspräferenzen noch Anti-Verwässerungsklauseln oder andere Konditionen, die die tatsächlichen wirtschaftlichen Ergebnisse beeinflussen. Zwei Unternehmen mit identischer Post-Money-Bewertung können sehr unterschiedliche Vertragsstrukturen haben, was die Headline-Bewertung zu einem unvollständigen Bild eines Deals macht.',
      },
    ],
    faq: [
      {
        q: 'Entspricht die Post-Money-Bewertung dem Marktwert des Unternehmens?',
        a: 'Nein. Die Post-Money-Bewertung spiegelt den in einer privaten Transaktion mit begrenzter Liquidität gezahlten Preis wider. Sie kann erheblich von dem abweichen, was das Unternehmen bei einem offenen Marktverkauf erzielen würde. Private Bewertungen sind Referenzpunkte, keine Marktpreise.',
      },
      {
        q: 'Enthält die Post-Money-Bewertung den Optionspool?',
        a: 'Ja. Der Optionspool ist Teil der voll verwässerten Anteilszahl des Unternehmens und daher sowohl in der Pre-Money- als auch in der Post-Money-Bewertung enthalten. Wenn Investoren von der Post-Money-Bewertung sprechen, meinen sie den Gesamtwert aller Anteile, einschließlich der für den Optionspool reservierten.',
      },
      {
        q: 'Was passiert, wenn die nächste Runde eine niedrigere Post-Money-Bewertung hat?',
        a: 'Das wird als Down Round bezeichnet. Es bedeutet, dass das Unternehmen niedriger bewertet wird als nach der vorherigen Runde, was Anti-Verwässerungsschutz für frühere Investoren auslösen kann und Gründer sowie Mitarbeiter weiter verwässert. Down Rounds signalisieren zudem geringeres Vertrauen und erschweren damit die nachfolgende Kapitalbeschaffung.',
      },
    ],
  },

  'what-is-a-liquidation-preference': {
    title: 'Was ist eine Liquidationspräferenz?',
    description:
      'Eine Liquidationspräferenz bestimmt, welche Anteilseigner beim Verkauf oder der Abwicklung eines Unternehmens zuerst ausgezahlt werden. Erfahren Sie mehr über die Arten und ihre Auswirkungen.',
    keywords: [
      'Liquidationspräferenz',
      'Investorenschutz',
      'Exit-Verteilung',
      'partizipierende Vorzugsanteile',
      'Wasserfall',
    ],
    keyTakeaways: [
      'Eine Liquidationspräferenz gibt Investoren das Recht, ihr Geld zurückzuerhalten, bevor Stammaktionäre bei einem Verkauf oder einer Liquidation überhaupt etwas erhalten.',
      'Die häufigste Struktur ist eine 1x nicht-partizipierende Vorzugsstruktur, bei der der Investor entweder sein Geld zurückerhält oder in Stammaktien umwandelt, je nachdem, was mehr einbringt.',
      'Partizipierende Präferenzen und Multiplikatoren über 1x können bei moderaten Exits deutlich verringern, was Gründer und Mitarbeiter erhalten.',
    ],
    content: [
      {
        heading: 'Wie Liquidationspräferenzen funktionieren',
        body: 'Wird ein Unternehmen verkauft, aufgelöst oder erlebt ein als Liquidation geltendes Ereignis, bestimmen Liquidationspräferenzen die Reihenfolge der Auszahlung. Investoren mit Vorzugsanteilen erhalten ihren Präferenzbetrag, bevor verbleibende Erlöse an Stammaktionäre verteilt werden. Hat ein Investor 5 Millionen US-Dollar mit einer 1x-Präferenz eingebracht, erhält er zuerst 5 Millionen US-Dollar. Die verbleibenden Verkaufserlöse werden dann unter den Stammaktionären aufgeteilt.',
      },
      {
        heading: 'Nicht-partizipierend vs. partizipierend',
        body: 'Bei nicht-partizipierenden Vorzugsanteilen wählt der Investor: entweder seinen Präferenzbetrag zu nehmen oder in Stammaktien umzuwandeln und anteilig teilzuhaben. Beides zusammen ist nicht möglich. Bei partizipierenden Vorzugsanteilen erhält der Investor zunächst seinen Präferenzbetrag und ist anschließend auch an den verbleibenden Erlösen beteiligt, als hätte er umgewandelt. Partizipierende Vorzugsanteile werden manchmal als Double-Dipping bezeichnet und verringern bei moderaten Exits die Auszahlungen an Stammaktionäre erheblich.',
      },
      {
        heading: 'Multiplikatoren und Kumulierung',
        body: 'Eine 1x-Präferenz erstattet den investierten Betrag. Eine 2x-Präferenz erstattet den doppelten investierten Betrag, bevor Stammaktionäre etwas erhalten. Höhere Multiplikatoren sind in gesunden Märkten unüblich, treten aber bei notleidenden Kapitalbeschaffungen auf. Tragen mehrere Finanzierungsrunden jeweils Präferenzen, kumulieren sich diese. Ein Unternehmen mit 20 Millionen US-Dollar an kumulierten Präferenzen muss für mehr als 20 Millionen US-Dollar verkauft werden, bevor Gründer überhaupt Erlöse sehen.',
      },
      {
        heading: 'Auswirkungen auf Gründer und Mitarbeiter',
        body: 'Bei einem großen Exit spielen Liquidationspräferenzen eine geringere Rolle, weil die Gesamterlöse die Präferenzbeträge weit übersteigen. Bei moderaten Exits spielen sie eine enorme Rolle. Verkauft sich ein Unternehmen mit 15 Millionen US-Dollar an Präferenzen für 20 Millionen US-Dollar, teilen sich Gründer und Mitarbeiter nur 5 Millionen US-Dollar. Deshalb werden viele afrikanische Startup-Gründer beim Exit überrascht: Der Verkaufspreis in der Schlagzeile spiegelt nicht wider, was sie persönlich erhalten.',
      },
    ],
    faq: [
      {
        q: 'Was ist die marktübliche Liquidationspräferenz?',
        a: 'Der Marktstandard ist 1x nicht-partizipierende Vorzugsanteile. Das gibt dem Investor Abwärtsschutz, indem sein Geld garantiert zurückerstattet wird, während er gleichzeitig umwandeln und an der Aufwärtsentwicklung teilhaben kann. Alles über 1x oder mit Partizipationsmerkmalen ist investorenfreundlicher und sollte sorgfältig geprüft werden.',
      },
      {
        q: 'Gelten Liquidationspräferenzen nur, wenn das Unternehmen scheitert?',
        a: 'Nein. Sie gelten bei jedem Liquidationsereignis, wozu typischerweise Übernahmen, Fusionen und manchmal Börsengänge zählen. Selbst ein erfolgreicher Verkauf kann dazu führen, dass Gründer weniger erhalten als erwartet, wenn erhebliche Liquidationspräferenzen kumuliert sind. Den Präferenz-Wasserfall zu verstehen, ist vor jedem Exit unerlässlich.',
      },
      {
        q: 'Kann ich Liquidationspräferenzen verhandeln?',
        a: 'Ja, und Sie sollten es tun. Bestehen Sie auf 1x nicht-partizipierend als Standard. Verlangt ein Investor Partizipation, verhandeln Sie eine Obergrenze für die Partizipation, etwa 3x Gesamtrendite. Verlangt er einen Multiplikator über 1x, verstehen Sie die Szenarien, in denen dies Ihre Auszahlung verringert, und verhandeln Sie entsprechend.',
      },
    ],
  },

  'what-is-an-anti-dilution-clause': {
    title: 'Was ist eine Anti-Verwässerungsklausel?',
    description:
      'Eine Anti-Verwässerungsklausel schützt Investoren davor, an Wert zu verlieren, wenn das Unternehmen künftige Runden zu einer niedrigeren Bewertung aufnimmt. Erfahren Sie, wie diese Klauseln funktionieren.',
    keywords: [
      'Anti-Verwässerung',
      'Full Ratchet',
      'gewichteter Durchschnitt',
      'Down Round',
      'Investorenschutz',
    ],
    keyTakeaways: [
      'Anti-Verwässerungsklauseln passen den Umwandlungspreis eines Investors nach unten an, wenn das Unternehmen in einer künftigen Runde Anteile zu einem niedrigeren Preis ausgibt.',
      'Die beiden Haupttypen sind Full Ratchet (am aggressivsten) und gewichteter Durchschnitt (häufiger und ausgewogener).',
      'Anti-Verwässerungsklauseln können die Gründerverwässerung bei einem Down Round erheblich erhöhen.',
    ],
    content: [
      {
        heading: 'Warum es Anti-Verwässerungsklauseln gibt',
        body: 'Investoren, die in einer Series A 10 US-Dollar je Anteil zahlen, wollen Schutz, falls das Unternehmen später Series-B-Anteile für 5 US-Dollar ausgibt. Ohne Anti-Verwässerungsschutz sind ihre Series-A-Anteile wirtschaftlich gegenüber den günstigeren Series-B-Anteilen benachteiligt. Anti-Verwässerungsklauseln passen den Umwandlungspreis der Series A nach unten an und geben dem Series-A-Investor zusätzliche Anteile als Ausgleich für die niedrigere Bewertung.',
      },
      {
        heading: 'Full Ratchet vs. gewichteter Durchschnitt',
        body: 'Full Ratchet ist die aggressivste Form: Der Umwandlungspreis fällt exakt auf den neuen, niedrigeren Preis, unabhängig davon, wie viele Anteile im Down Round ausgegeben werden. Der gewichtete Durchschnitt ist üblicher und fairer; er passt den Umwandlungspreis basierend sowohl auf dem neuen Preis als auch auf der Anzahl neu ausgegebener Anteile an. Der breit angelegte gewichtete Durchschnitt (Broad-Based Weighted Average), der alle Anteile und Optionen in die Berechnung einbezieht, ist der Marktstandard.',
      },
      {
        heading: 'Auswirkungen auf Gründer bei einem Down Round',
        body: 'Bei einem Down Round schaffen Anti-Verwässerungsklauseln zusätzliche Anteile für geschützte Investoren, und diese zusätzlichen Anteile gehen zulasten der Stammaktionäre, vor allem der Gründer und Mitarbeiter. Ein schwerer Down Round mit Full-Ratchet-Schutz kann den Gründeranteil drastisch verringern. Das ist einer der Gründe, warum erfahrene Gründer auf den breit angelegten gewichteten Durchschnitt als Standardklausel drängen.',
      },
      {
        heading: 'Anti-Verwässerungsklauseln verhandeln',
        body: 'Akzeptieren Sie, dass Investoren eine Form von Anti-Verwässerungsschutz verlangen werden. Drängen Sie auf den breit angelegten gewichteten Durchschnitt, der branchenüblich ist und beide Interessen ausbalanciert. Widerstehen Sie Full-Ratchet-Klauseln, sofern es wirklich keine Alternative gibt. Verhandeln Sie Pay-to-Play-Klauseln, die verlangen, dass Investoren sich am Down Round beteiligen, um von Anti-Verwässerungsschutz zu profitieren, und verhindern Sie so, dass passive Investoren auf Ihre Kosten profitieren.',
      },
    ],
    faq: [
      {
        q: 'Gilt Anti-Verwässerungsschutz für jede neue Anteilsausgabe?',
        a: 'Nein. Anti-Verwässerung wird typischerweise nur ausgelöst, wenn Anteile unter dem ursprünglichen Preis des geschützten Investors ausgegeben werden. Ausgaben über diesem Preis, standardmäßige Optionsgewährungen und im Rahmen von Übernahmen ausgegebene Anteile sind durch Ausnahmeklauseln im Investitionsvertrag üblicherweise ausgeschlossen.',
      },
      {
        q: 'Was bedeutet Pay-to-Play im Kontext der Anti-Verwässerung?',
        a: 'Pay-to-Play verlangt von einem Investor, sich am Down Round durch Investition seines anteiligen Anteils zu beteiligen, um seinen Anti-Verwässerungsschutz zu behalten. Beteiligt er sich nicht, können seine Vorzugsanteile in Stammaktien umgewandelt werden, wodurch er sowohl Anti-Verwässerungs- als auch Liquidationspräferenzrechte verliert.',
      },
      {
        q: 'Können Anti-Verwässerungsklauseln aufgehoben werden?',
        a: 'Ja. Investoren können sich dafür entscheiden, ihre Anti-Verwässerungsrechte in einer bestimmten Runde aufzuheben. Das geschieht mitunter, wenn der Down Round klein oder strategisch bedingt ist und die Durchsetzung der Anti-Verwässerung eine übermäßige Gründerverwässerung schaffen würde, die die Fähigkeit des Unternehmens beeinträchtigt, Talente zu gewinnen und zu halten.',
      },
    ],
  },

  'what-is-a-drag-along-right': {
    title: 'Was ist ein Mitverkaufszwang (Drag-Along Right)?',
    description:
      'Ein Drag-Along Right erlaubt es Mehrheitsaktionären, Minderheitsaktionäre zu einem Mitverkauf zu verpflichten. Erfahren Sie, wie es funktioniert und warum es existiert.',
    keywords: [
      'Drag-Along Right',
      'Mitverkaufszwang',
      'Gesellschaftervereinbarung',
      'Minderheitsaktionäre',
      'Exit-Mechanismus',
      'M&A',
    ],
    keyTakeaways: [
      'Ein Drag-Along Right erlaubt es Mehrheitsaktionären, Minderheitsaktionäre zu verpflichten, ihre Anteile bei einem Unternehmensverkauf zu denselben Konditionen zu verkaufen.',
      'Es existiert, um zu verhindern, dass eine kleine Minderheit eine Übernahme blockiert, die die Mehrheit unterstützt.',
      'Die Klausel erfordert typischerweise eine qualifizierte Mehrheitsschwelle und stellt sicher, dass Minderheitsaktionäre denselben Preis je Anteil erhalten.',
    ],
    content: [
      {
        heading: 'Wie Drag-Along-Rechte funktionieren',
        body: 'Möchte ein Käufer 100 Prozent eines Unternehmens erwerben, benötigt er die Zustimmung jedes einzelnen Anteilseigners. Ohne ein Drag-Along Right könnte ein Minderheitsaktionär mit auch nur 5 Prozent die gesamte Transaktion blockieren. Eine Drag-Along-Klausel erlaubt es Anteilseignern, die eine festgelegte Mehrheit halten, typischerweise 60 bis 75 Prozent der Anteile, alle verbleibenden Anteilseigner zu verpflichten, ihre Anteile zu denselben Konditionen zu verkaufen, sodass die Transaktion vollzogen werden kann.',
      },
      {
        heading: 'Warum Käufer und Investoren sie wollen',
        body: 'Käufer erwerben in der Regel lieber 100 Prozent eines Unternehmens, als sich mit verbleibenden Minderheitsaktionären auseinanderzusetzen. Investoren wünschen sich Drag-Along-Rechte, weil sie saubere Exits ermöglichen. Ohne sie könnte ein strategischer Käufer von einem Deal zurücktreten, wenn er keine vollständige Eigentümerschaft garantieren kann. Das schützt den Wert der Anteile der Mehrheit, indem es einen tragfähigen Exit-Weg sicherstellt.',
      },
      {
        heading: 'Schutz für Minderheitsaktionäre',
        body: 'Gut ausgearbeitete Drag-Along-Klauseln enthalten Schutzmechanismen für Minderheiten. Am wichtigsten ist, dass mitverkaufte Anteilseigner denselben Preis je Anteil und dieselben Konditionen wie die Mehrheit erhalten. Manche Vereinbarungen verlangen zudem, dass der Verkaufspreis eine Mindestschwelle übersteigt, etwa einen bestimmten Rückzahlungsfaktor auf das investierte Kapital. Diese Schutzmechanismen stellen sicher, dass Minderheiten nicht zu unfair bepreisten Transaktionen gezwungen werden.',
      },
      {
        heading: 'Drag-Along im afrikanischen Startup-Kontext',
        body: 'Drag-Along-Rechte sind in Venture-Capital-Term-Sheets weltweit Standard, auch in afrikanischen Märkten. Sie werden praktisch wichtig, wenn frühe Angel-Investoren oder inaktive Mitgründer kleine Anteile halten und während eines Exits nicht auffindbar sind oder nicht kooperieren wollen. Gründer sollten sicherstellen, dass ihre Gesellschaftervereinbarungen von den frühesten Investitionsrunden an klare Drag-Along-Klauseln enthalten, um spätere Komplikationen zu vermeiden.',
      },
    ],
    faq: [
      {
        q: 'Was ist der Unterschied zwischen Drag-Along- und Tag-Along-Rechten?',
        a: 'Drag-Along zwingt Minderheitsaktionäre, gemeinsam mit der Mehrheit zu verkaufen. Tag-Along gibt Minderheitsaktionären das Recht, sich einem Verkauf zu denselben Konditionen anzuschließen, falls die Mehrheit verkauft, und schützt sie davor, zurückgelassen zu werden. Sie erfüllen entgegengesetzte Zwecke: Drag-Along schützt die Mehrheit, Tag-Along schützt die Minderheit.',
      },
      {
        q: 'Können Drag-Along-Rechte missbraucht werden?',
        a: 'Theoretisch könnte eine Mehrheit Drag-Along nutzen, um einen Verkauf zu einem unfair niedrigen Preis zu erzwingen. Schutzmechanismen dagegen umfassen Mindestpreisschwellen, Anforderungen an eine unabhängige Bewertung sowie die Verpflichtung, allen Anteilseignern dieselben Konditionen anzubieten. Auch Gerichte können die Ausübung von Drag-Along-Rechten auf Treu und Glauben hin prüfen.',
      },
      {
        q: 'Sind Drag-Along-Rechte in Gesellschaftervereinbarungen Standard?',
        a: 'Ja. Drag-Along-Rechte sind eine Standardklausel in praktisch allen Venture-Capital- und Private-Equity-Investitionsverträgen. Sie gelten als essenziell, um einen sauberen Exit-Weg sicherzustellen. Die genauen Konditionen, einschließlich der Mehrheitsschwelle und etwaiger Mindestpreisanforderungen, sind verhandelbar.',
      },
    ],
  },
}
