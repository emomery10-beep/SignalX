// Academy article translations — Español (es) — Wave A, batch 2.
//
// POS operations/compliance + POS-BI-integration + multi-branch cluster:
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
// Merge this into lib/academy-i18n/es/index.ts's `translations` export
// (spread alongside any other es batches) — not done here per instructions.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch2Translations: LocaleTranslations = {
  'pos-vat-calculations': {
    title: 'Cálculo del IVA y cumplimiento fiscal en las transacciones del POS',
    description:
      'Calcula el IVA correctamente desde la primera venta. AskBiz POS calcula el IVA automáticamente en cada transacción y te mantiene listo para Making Tax Digital.',
    keywords: [
      'cálculo del IVA en el POS',
      'cumplimiento del IVA en el POS',
      'Making Tax Digital POS',
      'tipo de IVA en retail',
      'cálculo automático del IVA',
      'informes fiscales POS Reino Unido',
      'precios con IVA incluido',
    ],
    keyTakeaways: [
      'AskBiz POS calcula el IVA automáticamente en cada venta según el tipo de IVA asignado a cada producto.',
      'Los productos pueden configurarse con tipo general (20%), tipo reducido (5%), tipo cero (0%) o exentos — AskBiz gestiona correctamente los carritos con tipos mixtos.',
      'Los datos de IVA a nivel de transacción alimentan directamente tus informes, simplificando las declaraciones de Making Tax Digital.',
    ],
    content: [
      {
        heading: 'Cómo gestiona AskBiz POS el IVA',
        body: 'Cuando añades un producto a tu catálogo de AskBiz, le asignas un tipo de IVA: general (20%), reducido (5%), cero (0%) o exento. A partir de ese momento, cada venta que incluya ese producto calcula el IVA automáticamente. Si un cliente compra tres artículos con distintos tipos de IVA —por ejemplo, un aparato con tipo general, una silla de coche infantil con tipo reducido y un libro con tipo cero—, AskBiz calcula el IVA correcto para cada artículo y muestra un desglose combinado en el recibo. No tienes que pensar en ello durante la venta; el sistema lo gestiona por detrás. El recibo muestra el importe neto, el importe del IVA y el total bruto, que es justo lo que necesitan tus clientes registrados para el IVA para sus propios registros. Para precios con IVA incluido (donde el precio en el estante ya incluye el IVA), AskBiz calcula hacia atrás el importe neto y el componente de IVA usando la fórmula estándar.',
      },
      {
        heading: 'Precios con IVA incluido frente a precios sin IVA',
        body: 'En el comercio minorista del Reino Unido, los precios que se muestran a los consumidores casi siempre incluyen el IVA: el precio en el estante es el precio que paga el cliente, con el IVA ya incorporado. AskBiz POS admite ambos modelos. Para la venta al público, configura tus productos con precio con IVA incluido y AskBiz mostrará el precio completo al cliente mientras registra por separado, por detrás, el importe neto y el componente de IVA. Para clientes mayoristas o comerciales que necesiten ver el precio neto, puedes cambiar a precio sin IVA, donde el precio mostrado es antes de impuestos y el sistema añade el IVA en el cobro. Incluso puedes operar en modo mixto —con IVA incluido para clientes ocasionales y sin IVA para cuentas comerciales— configurando la preferencia de visualización por cliente o por transacción. Esta flexibilidad es especialmente útil para negocios que atienden tanto a clientes minoristas como comerciales desde el mismo local.',
      },
      {
        heading: 'Making Tax Digital y los datos de tu POS',
        body: 'Making Tax Digital (MTD) es el programa de HMRC para digitalizar la administración fiscal. Si estás registrado para el IVA, ya estás obligado a mantener registros digitales y presentar tus declaraciones de IVA a través de software compatible con MTD. AskBiz POS genera registros digitales de cada transacción automáticamente, lo que significa que los datos de tu POS ya están preparados para MTD por naturaleza. Cada venta registra la fecha, el importe neto, el tipo de IVA, el importe del IVA y el total bruto. Estos registros se almacenan digitalmente, con marca de tiempo, y no se pueden alterar (gracias al modelo de transacciones inmutables), lo que cumple con todo lo que espera HMRC. Cuando llegue el momento de preparar tu declaración de IVA, puedes exportar los datos de tus transacciones del POS e importarlos en tu software de contabilidad compatible con MTD. AskBiz entrega los datos en el formato correcto, reduciendo la introducción manual y los errores que esta conlleva.',
      },
      {
        heading: 'Errores comunes de IVA para los usuarios del POS',
        body: 'El error más común es asignar el tipo de IVA equivocado a un producto. En el Reino Unido, las reglas son detalladas y a veces poco intuitivas: por ejemplo, una galleta simple tiene tipo cero, pero una galleta cubierta de chocolate tiene tipo general. La comida caliente para llevar tiene tipo general, pero la comida fría para llevar suele tener tipo cero. La ropa infantil tiene tipo cero, pero la ropa de adulto tiene tipo general. Si no estás seguro del tratamiento de IVA de un producto, consulta la guía de IVA de HMRC para tu sector o pregúntale a tu contador. Equivocarse puede llevar a pagar de menos o de más IVA, y ambos casos generan problemas. AskBiz te permite actualizar tipos de IVA en lote si descubres un error, y el ajuste se refleja en tu próximo periodo de declaración. La clave es configurar los tipos correctamente desde el principio y revisarlos cada vez que HMRC actualice las normas.',
      },
    ],
    faq: [
      {
        q: '¿Necesito estar registrado para el IVA para usar AskBiz POS?',
        a: 'No. Si no estás registrado para el IVA, puedes configurar todos los productos con IVA cero y AskBiz no añadirá ningún impuesto. Cuando te registres para el IVA, simplemente actualiza los tipos de IVA de tus productos.',
      },
      {
        q: '¿Puede AskBiz presentar mi declaración de IVA directamente a HMRC?',
        a: 'AskBiz te proporciona los datos de transacciones que necesitas para tu declaración de IVA. Tú presentas la declaración a través de tu software de contabilidad compatible con MTD. La presentación directa a HMRC desde AskBiz está en la hoja de ruta.',
      },
    ],
  },

  'pos-audit-trail': {
    title: 'Historial de auditoría: cada transacción, rastreada y a prueba de manipulaciones',
    description:
      'AskBiz POS mantiene un historial de auditoría completo e inmutable de cada venta, reembolso, anulación y modificación. Así es por qué importa y cómo usarlo.',
    keywords: [
      'historial de auditoría POS',
      'registro de auditoría de transacciones',
      'registros a prueba de manipulaciones',
      'cumplimiento normativo POS',
      'historial de auditoría en retail',
      'historial de transacciones POS',
      'auditoría de HMRC en el POS',
    ],
    keyTakeaways: [
      'Cada acción en AskBiz POS —ventas, reembolsos, anulaciones, cambios manuales de precio, cambios de personal— queda registrada en un historial de auditoría inmutable.',
      'El historial de auditoría te protege durante las inspecciones de HMRC, las investigaciones de fraude y las disputas con clientes.',
      'Puedes buscar, filtrar y exportar los datos del historial de auditoría para cualquier rango de fechas.',
    ],
    content: [
      {
        heading: 'Qué es un historial de auditoría y por qué importa',
        body: 'Un historial de auditoría es un registro cronológico de cada evento que ocurre en tu sistema POS. En AskBiz, esto incluye ventas, reembolsos, anulaciones, cambios manuales de precio, aplicación de descuentos, ajustes de stock, inicios de sesión del personal, cambios de rol y cambios de configuración. Cada entrada registra qué pasó, cuándo pasó y quién lo hizo. El historial es inmutable: las entradas no se pueden editar ni eliminar, ni siquiera por el propietario de la cuenta. Esto importa por tres razones. Primero, el cumplimiento normativo: HMRC puede solicitar tus registros de transacciones durante una inspección de IVA, y un historial de auditoría ininterrumpido y a prueba de manipulaciones es el estándar de oro como evidencia. Segundo, la prevención del fraude: si alguien está procesando reembolsos ficticios o modificando precios de forma indebida, el historial de auditoría lo revelará. Tercero, la resolución de disputas: cuando un cliente afirma que le cobraron de más o que nunca recibió un artículo, el historial de auditoría te da los hechos para resolver la situación de forma justa y rápida.',
      },
      {
        heading: 'Qué queda registrado en AskBiz POS',
        body: "AskBiz registra mucho más que solo transacciones financieras. Esta es una lista no exhaustiva de eventos capturados en el historial de auditoría. Ventas: cada artículo vendido, el precio, la cantidad, el IVA, el método de pago, el miembro del personal y la marca de tiempo. Reembolsos y anulaciones: la referencia de la transacción original, el importe del reembolso, el motivo y el miembro del personal que lo autorizó. Cambios manuales de precio: el precio original, el precio modificado y el motivo. Descuentos: el tipo de descuento (porcentaje o importe fijo), el importe, y si se aplicó a un artículo o a todo el carrito. Ajustes de inventario: el producto, la cantidad anterior, la nueva cantidad y el motivo del ajuste. Eventos de personal: inicios de sesión, cierres de sesión, cambios de rol e invitaciones a nuevo personal. Cambios de configuración: ajustes de recibos, umbrales de alerta y cambios de método de pago. Cada entrada incluye una marca de tiempo precisa al segundo y la identidad del usuario que realizó la acción.",
      },
      {
        heading: 'Cómo usar el historial de auditoría',
        body: "El historial de auditoría es accesible desde la sección de Informes en AskBiz POS. Puedes filtrar por rango de fechas, tipo de evento, miembro del personal o producto. Los casos de uso más habituales incluyen investigar una discrepancia de caja (filtrando por fecha y buscando anulaciones, reembolsos y cambios manuales de precio), revisar la actividad de un miembro del personal (filtrando por su ID para ver cada acción que ha realizado) y prepararte para una inspección fiscal (exportando el historial completo del periodo correspondiente). La función de búsqueda te permite encontrar transacciones específicas por importe, nombre de producto o ID de transacción. Para la gestión del día a día, el filtro más valioso es 'excepciones': eventos que se salen de los patrones normales, como descuentos inusualmente grandes, reembolsos por encima de un umbral o anulaciones durante periodos sin supervisión. AskBiz puede mostrar estas excepciones automáticamente, ahorrándote la revisión manual de cientos de transacciones rutinarias para encontrar las pocas que merecen atención.",
      },
      {
        heading: 'El historial de auditoría y el cumplimiento con HMRC',
        body: 'Si HMRC realiza una revisión de cumplimiento en tu negocio, querrá ver tus registros de transacciones. Los requisitos específicos dependen de tu situación, pero, en general, HMRC espera registros digitales de todas las ventas y compras, con los importes de IVA claramente identificados. Un historial de auditoría de AskBiz cumple estos requisitos de forma integral. Cada transacción es digital, tiene marca de tiempo, detalla el IVA y está vinculada al método de pago. Los reembolsos y las anulaciones están documentados con motivos y autorizaciones. Los ajustes de stock quedan explicados. Los datos se pueden exportar en formatos estándar (CSV, Excel) para su presentación o revisión. Tener este nivel de documentación no solo satisface los requisitos de cumplimiento normativo, sino que posiciona favorablemente a tu negocio. Un historial de auditoría bien mantenido y a prueba de manipulaciones le indica a HMRC que te tomas en serio el mantenimiento de registros, lo que puede hacer que las inspecciones sean más cortas y menos conflictivas.',
      },
    ],
    faq: [
      {
        q: '¿Puedo eliminar entradas del historial de auditoría?',
        a: 'No. El historial de auditoría es inmutable por diseño. Las entradas no se pueden editar ni eliminar, ni siquiera por los propietarios de la cuenta. Esto protege la integridad de tus registros.',
      },
      {
        q: '¿Hasta cuándo se remonta el historial de auditoría?',
        a: 'AskBiz conserva tu historial de auditoría completo mientras tu cuenta esté activa. HMRC exige que los negocios conserven sus registros durante al menos seis años, y AskBiz supera este requisito.',
      },
    ],
  },

  'pos-30-day-export': {
    title: 'Cómo exportar 30 días de datos del POS para tu contador',
    description:
      'Necesitas enviarle los datos de tu POS a tu contador? AskBiz POS te permite exportar 30 días de datos de transacciones en segundos: así se hace.',
    keywords: [
      'exportación de datos POS',
      'exportar transacciones del POS',
      'datos POS para el contador',
      'exportación de 30 días',
      'exportación CSV del POS',
      'exportación de informes POS',
      'descargar datos de ventas del POS',
    ],
    keyTakeaways: [
      'AskBiz POS te permite exportar hasta 30 días de datos de transacciones en formato CSV o Excel con solo unos toques.',
      'La exportación incluye cada venta, reembolso y anulación con desgloses completos de IVA: todo lo que necesita tu contador.',
      'Las exportaciones periódicas facilitan enormemente la contabilidad, las declaraciones de IVA y las cuentas de fin de año.',
    ],
    content: [
      {
        heading: 'Por qué importan las exportaciones periódicas',
        body: 'Incluso con un sistema POS perfectamente mantenido, tu contador necesita los datos en bruto. Concilia tus transacciones del POS con tus extractos bancarios, prepara tus declaraciones de IVA y compila tus cuentas de fin de año. Cuanto más fácil le sea acceder a datos de transacciones limpios y detallados, menos tiempo dedicará (y menos te cobrará). Muchos pequeños comercios todavía le entregan a su contador una bolsa llena de recibos de papel y un resumen escrito a mano al final de cada trimestre. Esto se traduce en horas de introducción manual de datos, errores inevitables y una factura más alta. Con AskBiz POS, puedes exportar un conjunto de datos completo que cubre cada transacción —con fechas, importes, desgloses de IVA, métodos de pago y detalles de reembolsos— en menos de un minuto. Tu contador obtiene lo que necesita, tú ahorras dinero y las cifras son precisas.',
      },
      {
        heading: 'Qué incluye la exportación',
        body: 'Una exportación de datos de AskBiz POS contiene cada transacción procesada dentro del rango de fechas seleccionado. Para cada venta, la exportación registra la fecha y hora, el ID de transacción, los artículos vendidos (con precios y cantidades individuales), los descuentos aplicados, el tipo y el importe de IVA por artículo, el importe neto total, el IVA total, el total bruto, el método de pago y el miembro del personal que procesó la venta. Los reembolsos y las anulaciones se listan por separado con referencias a las transacciones originales, lo que facilita la conciliación para tu contador. La exportación también incluye una hoja de resumen con totales: ingresos totales (netos y brutos), IVA total recaudado, reembolsos totales, descuentos totales y conteo de transacciones por método de pago. Este resumen suele ser todo lo que tu contador necesita para la contabilidad rutinaria; el detalle línea por línea está ahí para una conciliación más profunda o si HMRC hace preguntas.',
      },
      {
        heading: 'Cómo generar una exportación',
        body: "En AskBiz POS, ve a Informes y toca Exportar datos. Selecciona tu rango de fechas: puedes elegir cualquier periodo de hasta treinta días. Para la mayoría de los negocios, una exportación mensual (que cubra el mes calendario) funciona bien. Elige tu formato: CSV es el más compatible universalmente y se puede abrir en Excel, Google Sheets o importar en software de contabilidad. El formato Excel incluye formato visual y la hoja de resumen. Toca Exportar y el archivo se genera en segundos. Puedes descargarlo directamente a tu dispositivo, enviártelo por correo electrónico o compartirlo con tu contador por el medio que normalmente uses. Si tu contador prefiere un formato o diseño distinto, el CSV es lo bastante flexible como para manipularlo en cualquier herramienta de hoja de cálculo. Algunos usuarios de AskBiz programan un recordatorio mensual para exportar sus datos el primer día de cada mes, cubriendo la actividad del mes anterior.",
      },
      {
        heading: 'Consejos para una entrega fluida a tu contador',
        body: "Algunas prácticas sencillas hacen que el proceso de exportación de datos sea todavía más valioso. Primero, sé constante con tu calendario de exportaciones. Las exportaciones mensuales alineadas con tus periodos de IVA mantienen todo sincronizado. Segundo, nombra tus archivos con claridad: 'AskBiz-POS-Enero-2026.csv' es mejor que 'export(3).csv'. Tercero, incluye una breve nota con cada exportación mencionando cualquier cosa inusual: un reembolso grande, un ajuste de stock que afecte el costo de mercancía o un cambio en los tipos de IVA. Cuarto, si tu contador usa un software específico (Xero, QuickBooks, FreeAgent), pregúntale qué formato de importación prefiere: es posible que AskBiz ya exporte en un formato compatible. Por último, conserva una copia de seguridad local de cada exportación. Aunque AskBiz almacena tus datos de forma segura en la nube, tener una copia local en tu propio equipo te da una capa extra de protección y te permite volver a enviar los datos cuando lo necesites.",
      },
    ],
    faq: [
      {
        q: '¿Puedo exportar más de 30 días a la vez?',
        a: 'La exportación estándar cubre hasta 30 días. Para periodos más largos, realiza varias exportaciones o contacta con soporte para obtener una extracción de datos personalizada.',
      },
      {
        q: '¿La exportación es compatible con Xero y QuickBooks?',
        a: 'La exportación en CSV se puede importar en la mayoría de los programas de contabilidad, incluidos Xero y QuickBooks. Consulta la guía de importación de tu software para conocer cualquier requisito de formato específico.',
      },
    ],
  },

  'pos-multi-staff-performance': {
    title: 'Métricas de rendimiento del personal: ventas por cajero, ingresos por rol',
    description:
      'Controla qué miembros del personal venden más, generan más ingresos y cometen menos errores, todo desde el panel de tu AskBiz POS.',
    keywords: [
      'rendimiento del personal en el POS',
      'ventas por cajero',
      'ingresos por miembro del personal',
      'métricas de personal en el POS',
      'rendimiento de empleados en retail',
      'seguimiento del rendimiento del cajero',
      'KPI de personal en retail',
    ],
    keyTakeaways: [
      'AskBiz POS atribuye cada transacción al miembro del personal que la procesó, lo que permite el seguimiento del rendimiento individual.',
      'Las métricas clave incluyen transacciones por hora, valor promedio de transacción, tasa de reembolsos e ingresos totales por miembro del personal.',
      'Los datos de rendimiento del personal te ayudan a planificar turnos, identificar necesidades de capacitación y recompensar a quienes más destacan.',
    ],
    content: [
      {
        heading: 'Por qué importa seguir el rendimiento del personal',
        body: 'Cuando trabajas solo, sabes exactamente cómo te está yendo. En el momento en que sumas personal, esa visibilidad se reduce. Conoces las cifras generales de la tienda, pero no quién está contribuyendo con qué. Sin datos de rendimiento individual, no puedes responder preguntas críticas: ¿el nuevo empleado ya está al nivel esperado? ¿Un cajero vende sistemáticamente más que otro, y si es así, qué está haciendo diferente? ¿Las tasas de reembolso son más altas en ciertos turnos? AskBiz POS responde a todo esto atribuyendo cada transacción al miembro del personal que la procesó. Con el tiempo, esto construye una imagen detallada de la contribución de cada persona. No se trata de vigilancia, sino de entender a tu equipo, identificar fortalezas que se puedan replicar, detectar carencias que abordar y tomar decisiones informadas sobre horarios, capacitación y recompensas.',
      },
      {
        heading: 'Métricas clave que AskBiz registra por miembro del personal',
        body: 'AskBiz POS registra varias métricas de rendimiento para cada miembro del personal. Los ingresos totales son la más directa: ¿cuánto ha registrado esta persona en la caja? Pero no siempre es la más reveladora. Las transacciones por hora miden el rendimiento operativo: un cajero que procesa treinta transacciones por hora está despachando la fila más rápido que uno que procesa quince. El valor promedio de transacción (VPT) muestra quién vende cestas de mayor valor, lo que podría indicar una venta cruzada eficaz. La tasa de reembolsos por miembro del personal destaca posibles problemas de capacitación o, en casos poco frecuentes, fraude. La tasa de descuentos por miembro del personal muestra quién aplica descuentos y con qué frecuencia. Los artículos por transacción revelan el tamaño de la cesta. AskBiz presenta estas métricas en un panel claro, comparando a los miembros del personal uno al lado del otro para cualquier rango de fechas que selecciones. Puedes ver los datos por día, semana o mes.',
      },
      {
        heading: 'Cómo usar los datos de rendimiento de forma constructiva',
        body: 'Los usuarios de AskBiz con más éxito tratan los datos de rendimiento del personal como una herramienta de acompañamiento, no como un castigo. Si el VPT de un cajero es sistemáticamente un 30% más alto que el promedio, indaga en los datos para entender por qué. ¿Está recomendando productos complementarios? ¿Está recibiendo a los clientes de una forma que fomenta que exploren la tienda? Comparte esos comportamientos con el equipo. Si la tasa de reembolsos de un cajero es inusualmente alta, ten una conversación de apoyo antes de asumir lo peor: puede estar gestionando devoluciones de turnos de otros miembros del personal, o puede haber un problema de calidad en los productos que más vende. Para las decisiones de horarios, los datos de rendimiento son invaluables. Programa a tus mejores vendedores en las horas de mayor actividad. Si un miembro del equipo más nuevo tiene un rendimiento más bajo, asígnalo junto a un cajero con experiencia durante los periodos de más movimiento, en lugar de dejarlo solo durante el ajetreo de un sábado.',
      },
      {
        heading: 'Privacidad, equidad y consideraciones legales',
        body: 'El seguimiento del rendimiento del personal plantea preguntas legítimas sobre privacidad y equidad. En el Reino Unido, estás obligado a informar a los empleados qué datos recopilas sobre ellos y cómo se usan. Esto debería estar cubierto en el contrato laboral o en el manual del personal. AskBiz registra métricas relacionadas con el trabajo durante el horario laboral: no supervisa actividad personal, ubicación ni nada fuera del sistema POS. Sé transparente con tu equipo sobre qué métricas revisas y por qué. Muchos comercios comparten sus paneles de rendimiento abiertamente, lo que crea una cultura de responsabilidad sana en lugar de vigilancia encubierta. Si usas los datos de rendimiento para tomar decisiones laborales (como un despido o un ascenso), asegúrate de que esas decisiones sean coherentes, estén documentadas y se basen en una muestra justa de datos, no en un solo mal día. AskBiz conserva los datos de rendimiento del personal mientras la cuenta esté activa, pero puedes anonimizar los datos de exempleados según tu política de retención de datos.',
      },
    ],
    faq: [
      {
        q: '¿El personal puede ver sus propias métricas de rendimiento?',
        a: 'Los Gerentes y Propietarios pueden ver las métricas de todo el personal. Los Cajeros pueden ver su propio número de transacciones e ingresos del día, pero no datos comparativos de otros miembros del personal.',
      },
      {
        q: '¿AskBiz clasifica a los miembros del personal?',
        a: 'AskBiz presenta los datos uno al lado del otro, pero no crea clasificaciones formales. Cómo interpretas y comunicas los datos depende de ti como propietario del negocio.',
      },
    ],
  },

  'pos-security-best-practices': {
    title: 'Seguridad del POS: cómo proteger las transacciones y los datos de tus clientes',
    description:
      'Tu POS maneja dinero y datos de clientes todos los días. Estas son las mejores prácticas de seguridad que todo pequeño comercio debería seguir.',
    keywords: [
      'seguridad del POS',
      'protección de datos en retail',
      'prevención de fraude en el POS',
      'sistema POS seguro',
      'RGPD en el POS',
      'seguridad de pagos en retail',
      'mejores prácticas de seguridad del POS',
    ],
    keyTakeaways: [
      'Los permisos sólidos del personal, el inicio de sesión con enlace mágico y el acceso basado en roles son tu primera línea de defensa en la seguridad del POS.',
      'AskBiz POS almacena los datos en infraestructura en la nube cifrada: ningún dato sensible permanece en tu dispositivo local.',
      'Revisar periódicamente el historial de auditoría, los patrones de reembolso y los registros de acceso ayuda a detectar problemas antes de que resulten costosos.',
    ],
    content: [
      {
        heading: 'Los tres pilares de la seguridad del POS',
        body: 'La seguridad del POS se apoya en tres pilares: control de acceso, protección de datos y monitoreo. El control de acceso significa asegurarse de que solo las personas autorizadas puedan usar el sistema y que cada persona solo pueda hacer lo que su rol requiere. Los permisos basados en roles de AskBiz (Propietario, Gerente, Cajero) y el inicio de sesión con enlace mágico cubren esto de forma integral. La protección de datos significa asegurarse de que los datos de transacciones, la información de clientes y los registros financieros se almacenen de forma segura y se transmitan con seguridad. AskBiz almacena todos los datos en infraestructura en la nube cifrada usando protocolos estándar del sector: los datos se cifran tanto en tránsito (al moverse entre tu dispositivo y el servidor) como en reposo (al almacenarse en el servidor). Ningún dato sensible de transacciones se almacena de forma permanente en tu dispositivo local. El monitoreo significa vigilar lo que ocurre en el sistema y detectar anomalías a tiempo. El historial de auditoría de AskBiz aporta los datos en bruto; las alertas de excepción destacan los eventos que merecen investigarse.',
      },
      {
        heading: 'Cómo protegerte de las amenazas internas',
        body: 'La verdad incómoda es que la mayoría del fraude en el POS de los pequeños comercios lo comete el propio personal, no atacantes externos. Los reembolsos ficticios, el favoritismo interno (dar productos gratis o con descuento a amigos), el "skimming" (quedarse con el efectivo y anular la transacción) y el robo de tiempo son las formas más comunes. AskBiz mitiga esto mediante varios mecanismos. Restringir los reembolsos y anulaciones a Gerentes y Propietarios elimina la principal vía de fraude a nivel de cajero. El historial de auditoría inmutable genera responsabilidad: cada acción queda registrada a nombre de una persona identificada. Las alertas de excepción señalan patrones inusuales, como un pico de reembolsos o una tasa de descuento anómala en un turno concreto. Las herramientas de arqueo de caja comparan el efectivo esperado en la caja (según los registros del POS) con el importe realmente contado, destacando discrepancias de inmediato. Sin embargo, el elemento disuasorio más eficaz es simplemente decirle a tu personal que estos controles existen. Cuando la gente sabe que sus acciones se rastrean y se revisan, la mayoría nunca considerará actuar de forma deshonesta.',
      },
      {
        heading: 'Cómo proteger los datos de clientes y cumplir con el RGPD',
        body: "Si recopilas cualquier dato de clientes a través de tu POS —números de teléfono para recibos por WhatsApp, direcciones de correo electrónico para facturas digitales o nombres de clientes para programas de fidelidad—, estás sujeto al RGPD (Reglamento General de Protección de Datos). Los principios clave son: recopila solo lo que necesitas, informa a los clientes qué estás recopilando y por qué, almacénalo de forma segura y elimínalo cuando ya no sea necesario. AskBiz se encarga del aspecto técnico del almacenamiento seguro y el cifrado. Tu responsabilidad es el aspecto normativo: muestra un aviso de privacidad en tu tienda o en tu sitio web, asegúrate de tener una base legal para tratar cada tipo de dato (normalmente 'interés legítimo' para la entrega de recibos y 'consentimiento' para las comunicaciones de marketing), y responde a cualquier solicitud de acceso o eliminación de datos de clientes en el plazo de un mes. AskBiz te permite buscar y exportar todos los datos que tienes sobre un cliente específico, lo que simplifica responder a las Solicitudes de Acceso del Interesado.",
      },
      {
        heading: 'Seguridad física de los dispositivos del POS',
        body: 'La seguridad del software es solo la mitad del panorama. Tu dispositivo POS —teléfono, tablet o terminal— también necesita protección física. Si alguien roba tu tablet, potencialmente tendrá acceso a tu sistema POS (si la sesión sigue iniciada) y a cualquier dato guardado localmente en caché. Aquí van algunos pasos prácticos para mitigar este riesgo. Primero, activa el bloqueo del dispositivo: exige un PIN, huella dactilar o reconocimiento facial para desbloquearlo. Segundo, configura el cierre de sesión automático en AskBiz para que el POS se desconecte tras un periodo de inactividad. Tercero, si roban un dispositivo, elimínalo de inmediato como dispositivo autorizado en la configuración de AskBiz y cambia cualquier credencial compartida. Cuarto, nunca dejes los dispositivos del POS sin vigilancia en zonas abiertas al público. Durante el horario de atención, el dispositivo debe estar siempre a la vista y al alcance de un miembro del personal. Fuera de horario, guárdalo de forma segura. Estas medidas son sencillas pero eficaces: la mayoría de los robos físicos de dispositivos POS son oportunistas, y las precauciones básicas eliminan esa oportunidad.',
      },
    ],
    faq: [
      {
        q: '¿AskBiz POS cumple con PCI DSS?',
        a: 'AskBiz POS no procesa pagos con tarjeta directamente: eso lo gestiona tu datáfono. Esto significa que AskBiz en sí queda fuera del alcance de PCI DSS. Sin embargo, las prácticas de manejo de datos de AskBiz se alinean con las mejores prácticas de seguridad para cualquier sistema que registre información de métodos de pago.',
      },
      {
        q: '¿Qué debo hacer si sospecho de fraude en el POS por parte de un miembro del personal?',
        a: 'Revisa el historial de auditoría en busca de evidencia, centrándote en reembolsos, anulaciones, cambios manuales de precio y discrepancias de efectivo. Si encuentras evidencia de fraude, consulta con tu asesor legal antes de tomar medidas disciplinarias para asegurarte de seguir los procedimientos adecuados.',
      },
    ],
  },

  'pos-pwa-mobile-setup': {
    title: 'Cómo configurar AskBiz POS en el móvil: guía de instalación de la PWA',
    description:
      'AskBiz POS funciona como una Progressive Web App en cualquier teléfono o tablet moderno. Así se instala para obtener la mejor experiencia.',
    keywords: [
      'configuración de la PWA del POS',
      'instalar el POS en el móvil',
      'PWA de AskBiz',
      'progressive web app POS',
      'POS en el teléfono',
      'instalar el POS en tablet',
      'configuración del punto de venta móvil',
    ],
    keyTakeaways: [
      'AskBiz POS funciona como una Progressive Web App: instálala en tu pantalla de inicio para obtener una experiencia de app nativa sin pasar por una tienda de aplicaciones.',
      'La instalación de la PWA tarda menos de dos minutos tanto en dispositivos iOS como Android.',
      'Una vez instalada, AskBiz POS funciona a pantalla completa, admite el modo sin conexión y se abre al instante desde tu pantalla de inicio.',
    ],
    content: [
      {
        heading: '¿Qué es una Progressive Web App (PWA)?',
        body: 'Una Progressive Web App es un sitio web que se comporta como una app nativa. Cuando instalas una PWA en tu pantalla de inicio, obtiene su propio icono, se abre en modo de pantalla completa (sin la barra de direcciones del navegador), carga rápido e incluso puede funcionar sin conexión. No la descargas desde la App Store ni Google Play: la instalas directamente desde el navegador. Este enfoque tiene ventajas importantes para un sistema POS. Las actualizaciones ocurren automáticamente: cada vez que abres la app, obtienes la última versión sin descargar nada. No hay un proceso de revisión de app que retrase el lanzamiento de funciones. Funciona en cualquier dispositivo con un navegador moderno, así que no estás atado a un sistema operativo específico. Y como AskBiz POS es una PWA, puedes tenerla funcionando en un dispositivo nuevo en minutos, algo invaluable si tu dispositivo principal se rompe a mitad de un turno y necesitas un reemplazo rápido.',
      },
      {
        heading: 'Instalación en Android',
        body: "Abre Chrome (o cualquier navegador basado en Chromium) en tu teléfono o tablet Android. Navega a la URL de AskBiz POS e inicia sesión en tu cuenta. Chrome mostrará un aviso o notificación sugiriéndote instalar la app: tócalo y sigue las instrucciones. Si el aviso no aparece, toca el menú de tres puntos en la esquina superior derecha y selecciona 'Añadir a la pantalla de inicio' o 'Instalar app'. El icono de AskBiz aparece de inmediato en tu pantalla de inicio. Al tocarlo, el POS se abre en modo de pantalla completa, indistinguible de una app nativa. La instalación ocupa un espacio de almacenamiento mínimo porque la mayoría de los datos de la app se guardan en la nube. Una vez instalada, AskBiz guardará en caché de forma local los recursos esenciales, lo que hace que la app cargue rápido incluso con conexiones lentas y que la funcionalidad básica de venta esté disponible sin conexión.",
      },
      {
        heading: 'Instalación en iOS (iPhone y iPad)',
        body: "Abre Safari en tu iPhone o iPad: esto es importante porque iOS solo admite la instalación de PWA a través de Safari, no de Chrome ni otros navegadores. Navega a la URL de AskBiz POS e inicia sesión. Toca el botón Compartir (el cuadrado con una flecha hacia arriba) en la parte inferior de la pantalla. Desplázate hacia abajo y toca 'Añadir a pantalla de inicio'. Dale un nombre al acceso directo (el nombre predeterminado 'AskBiz POS' está bien) y toca Añadir. El icono aparece en tu pantalla de inicio. Al abrirlo, AskBiz POS funciona en modo de pantalla completa. Ten en cuenta que las PWA en iOS tienen algunas limitaciones respecto a su equivalente en Android: las notificaciones push para alertas de stock pueden comportarse de forma distinta, y la app puede necesitar recargarse ocasionalmente tras un periodo de inactividad. Estas son limitaciones a nivel de iOS, no de AskBiz, y Apple ha ido mejorando el soporte de PWA con cada versión de iOS.",
      },
      {
        heading: 'Cómo optimizar tu dispositivo para usarlo como POS',
        body: 'Una vez instalada AskBiz POS, algunos ajustes a nivel de dispositivo optimizan la experiencia. Primero, desactiva el bloqueo automático o configura un tiempo de espera largo: una pantalla del POS que se apaga cada treinta segundos resulta frustrante durante un turno movido. Configura el bloqueo automático a cinco o diez minutos, o desactívalo por completo durante el horario de atención (solo recuerda bloquearlo manualmente cuando esté sin vigilancia). Segundo, ajusta el brillo de la pantalla a un nivel cómodo. Una pantalla muy brillante agota la batería más rápido; una muy tenue es difícil de leer en una tienda bien iluminada. Tercero, activa el modo No Molestar durante el horario de atención para evitar que llamadas entrantes y notificaciones interrumpan la interfaz del POS a mitad de una transacción. Cuarto, mantén el dispositivo enchufado o cerca de un cargador. El escaneo con cámara consume batería, y un turno completo de ventas puede agotar la batería de un teléfono para media tarde. Un simple cable de carga en la caja resuelve esto. Por último, cierra las apps innecesarias que corren en segundo plano para maximizar la memoria disponible y asegurar que el POS funcione con fluidez.',
      },
    ],
    faq: [
      {
        q: '¿Puedo usar AskBiz POS en una computadora de escritorio?',
        a: 'Sí. AskBiz POS funciona en cualquier navegador moderno de escritorio. Sin embargo, el escaneo con cámara requiere una webcam. Para la mayoría de los comercios, un teléfono o una tablet es la opción más práctica.',
      },
      {
        q: '¿Necesito actualizar la PWA manualmente?',
        a: 'No. Las PWA se actualizan automáticamente. Cuando AskBiz lanza una nueva versión, la actualización se aplica la próxima vez que abras la app. No hace falta ninguna descarga ni instalación manual.',
      },
    ],
  },

  'pos-troubleshooting': {
    title: 'Solución de problemas del POS: cámara, inicio de sesión y sincronización',
    description:
      'Tienes una cámara que no escanea, un inicio de sesión que no funciona o datos que no se sincronizan? Aquí tienes soluciones rápidas para los problemas más comunes de AskBiz POS.',
    keywords: [
      'solución de problemas del POS',
      'el lector de códigos de barras no funciona',
      'problemas de inicio de sesión en el POS',
      'problemas de sincronización del POS',
      'la cámara no escanea en el POS',
      'ayuda de AskBiz POS',
      'solución de problemas comunes del POS',
    ],
    keyTakeaways: [
      'La mayoría de los problemas de AskBiz POS se dividen en tres categorías: cámara/escaneo, inicio de sesión/autenticación y sincronización de datos.',
      'La mayoría de los problemas se resuelven concediendo permisos al navegador, limpiando la caché o revisando tu conexión a internet.',
      'AskBiz registra los eventos y errores de sincronización, lo que facilita diagnosticar problemas sin tener que adivinar.',
    ],
    content: [
      {
        heading: 'Problemas de cámara y escaneo',
        body: "Si la cámara no se activa al tocar el botón de escaneo, la causa más común es que falte un permiso del navegador. Tu navegador necesita permiso explícito para acceder a la cámara, y este debe concederse específicamente para el dominio de AskBiz. En Android, ve a Configuración de Chrome, luego Configuración del sitio, luego Cámara, y asegúrate de que la URL de AskBiz aparezca como 'Permitida'. En iOS, ve a Configuración, luego Safari, luego Cámara, y ponla en 'Permitir'. Si la cámara se activa pero no reconoce los códigos de barras, revisa la iluminación: la luz insuficiente es la causa más común de un reconocimiento lento o fallido. Sostén el teléfono a entre 15 y 30 centímetros del código de barras y mantenlo firme. Limpia el lente de la cámara si está manchado. Si un código de barras específico falla constantemente, puede estar dañado o impreso demasiado pequeño: intenta introducir el producto manualmente como solución alternativa. Si el escaneo funcionaba antes y dejó de hacerlo, intenta cerrar y volver a abrir la PWA de AskBiz, o borra la caché del navegador para el sitio de AskBiz.",
      },
      {
        heading: 'Problemas de inicio de sesión y autenticación',
        body: 'AskBiz POS usa el inicio de sesión con enlace mágico, lo que significa que se envía un enlace de un solo uso a tu correo electrónico cada vez que inicias sesión. Si no recibes el enlace mágico, revisa primero tu carpeta de spam o correo no deseado: los proveedores de correo a veces clasifican mal los correos automáticos. Asegúrate de introducir exactamente el correo electrónico que se usó al crear tu cuenta de personal (revisa mayúsculas y errores tipográficos). Si el correo sigue sin llegar después de unos minutos, pídele al propietario de la cuenta que verifique que tu dirección de correo esté registrada correctamente en el sistema. Si recibes el enlace mágico pero no funciona al tocarlo, es posible que haya caducado: los enlaces mágicos tienen un tiempo limitado por seguridad. Solicita uno nuevo y tócalo de inmediato. Asegúrate también de abrir el enlace en el mismo navegador donde usas AskBiz POS; algunas apps de correo abren los enlaces en un navegador integrado que no comparte sesión con tu navegador principal. En iOS, si el enlace mágico se abre en el navegador equivocado, copia el enlace y pégalo manualmente en Safari.',
      },
      {
        heading: 'Problemas de sincronización de datos y conectividad',
        body: 'AskBiz POS sincroniza los datos con la nube después de cada transacción. Si tu conexión a internet se corta, la app pasa a modo sin conexión y guarda las transacciones localmente hasta que vuelva la conectividad. Cuando se restablece la conexión, las transacciones pendientes se sincronizan automáticamente. Si notas que los datos no se sincronizan (por ejemplo, procesas una venta en el POS pero no aparece en tus informes en otro dispositivo), revisa primero tu conexión a internet. Abre cualquier sitio web para confirmar que estás en línea. Si la conexión está bien pero la sincronización sigue retrasada, intenta forzar la actualización de la PWA: en la mayoría de los navegadores, desliza hacia abajo para actualizar o cierra y vuelve a abrir la app. Los problemas de sincronización persistentes son poco comunes, pero pueden ocurrir si el almacenamiento local del navegador está lleno (algo común en dispositivos con muy poco espacio). Borrar la caché del navegador para el sitio de AskBiz suele resolver esto: tus datos están a salvo en la nube, así que borrar la caché local no elimina nada.',
      },
      {
        heading: 'Cuándo contactar con soporte',
        body: 'La mayoría de los problemas de AskBiz POS se resuelven con los pasos anteriores, pero algunas situaciones justifican contactar con soporte. Si ves un código o mensaje de error específico, anótalo e inclúyelo en tu solicitud de soporte: esto acelera significativamente el diagnóstico. Si faltan transacciones (no solo se retrasan en sincronizar), contacta con soporte de inmediato indicando la hora aproximada y el dispositivo usado. Si no se puede eliminar a un miembro del personal o un cambio de rol no surte efecto, esto puede indicar un conflicto de permisos que requiere investigación técnica. Si el rendimiento se degrada con el tiempo (la app se vuelve lenta o deja de responder), esto podría indicar un problema a nivel de dispositivo o de volumen de datos que soporte puede ayudarte a diagnosticar. El soporte de AskBiz está disponible a través del chat en la app, correo electrónico y el centro de ayuda. Al reportar un problema, incluye el tipo de dispositivo, el nombre y la versión del navegador, y una descripción de los pasos que llevaron al problema. Las capturas de pantalla o grabaciones de pantalla son muy útiles para problemas visuales.',
      },
    ],
    faq: [
      {
        q: '¿Perderé transacciones si la batería de mi teléfono se agota durante una venta?',
        a: 'Si la venta se confirmó antes de que el dispositivo se apagara, queda guardada localmente y se sincronizará cuando el dispositivo se recargue y vuelva a conectarse. Si la venta aún no se había confirmado, tendrás que volver a introducirla.',
      },
      {
        q: '¿Cómo borro la caché de AskBiz sin perder datos?',
        a: 'Tus datos se almacenan en la nube, no en la caché del navegador. Borrar la caché elimina archivos temporales que ayudan a que la app cargue más rápido, pero no elimina ningún dato de transacciones, productos ni configuraciones.',
      },
      {
        q: 'El POS va lento: ¿qué debo hacer?',
        a: 'Cierra las apps que corren en segundo plano para liberar memoria, asegúrate de que tu dispositivo tenga al menos 500 MB de almacenamiento libre y reinicia el navegador. Si el problema persiste, intenta reiniciar el dispositivo.',
      },
    ],
  },

  'pos-data-in-dashboards': {
    title: 'Cómo los datos del POS alimentan tu panel de AskBiz',
    description:
      'Las transacciones de tu POS no se quedan simplemente en una base de datos: alimentan paneles en tiempo real, gráficos de ingresos y vistas de rendimiento de productos dentro de AskBiz.',
    keywords: [
      'panel del POS',
      'análisis del punto de venta',
      'panel de informes del POS',
      'panel de retail',
      'visualización de datos del POS',
      'panel de AskBiz POS',
    ],
    keyTakeaways: [
      'Cada transacción del POS aparece automáticamente en tu panel de AskBiz en cuestión de segundos.',
      'Los widgets del panel pueden mostrar ingresos, unidades vendidas, tamaño promedio de cesta y productos más vendidos, todo a partir de los datos del POS.',
      'Combinar los datos del POS con las ventas en línea te da una verdadera visión omnicanal de tu negocio.',
    ],
    content: [
      {
        heading: 'De la caja al panel en tiempo real',
        body: 'Cada venta procesada a través de AskBiz POS se registra de inmediato en tu almacén central de datos. En cuestión de segundos, esa transacción actualiza tu panel: los ingresos totales suben, la tabla de productos más vendidos se reordena y el contador de ventas diarias se incrementa. No hay importaciones por lotes, ni sincronización nocturna, ni exportación manual. Esta es la diferencia fundamental entre una caja registradora independiente y un POS integrado: tu capa de inteligencia ve cada transacción en el momento en que ocurre. Para el dueño de una tienda, esto significa que puede revisar su teléfono a la hora del almuerzo y saber exactamente cómo fue la mañana, qué productos se movieron y si va camino de alcanzar su objetivo diario.',
      },
      {
        heading: 'Widgets clave del POS para tu panel',
        body: 'AskBiz pone a tu disposición automáticamente varios widgets específicos del POS cuando el módulo está activo. **Ingresos de hoy** muestra un total acumulado con una comparación respecto al mismo día de la semana pasada. **Unidades vendidas** rastrea el volumen por separado del valor, útil para detectar si un aumento de ingresos viene de vender más artículos o artículos más caros. **Tamaño promedio de cesta** calcula el valor medio de transacción entre todas las ventas de hoy. **Productos más vendidos** clasifica tus mejores productos por ingresos o volumen en cualquier periodo que elijas. **Ventas por miembro del personal** muestra qué cajeros están procesando más transacciones, útil para la planificación de turnos y las evaluaciones de rendimiento. Puedes fijar cualquiera de estos widgets en tu panel de inicio predeterminado para que carguen primero cada mañana.',
      },
      {
        heading: 'Cómo combinar el POS con las ventas en línea',
        body: 'Si también vendes a través de Shopify, Amazon, Etsy u otra plataforma conectada, AskBiz combina los datos de tu POS con los datos en línea en una sola vista. Aquí es donde surge la verdadera inteligencia. Puedes ver que un producto se vende bien en línea pero apenas se mueve en tienda física, o que los ingresos en tienda entre semana superan a los del fin de semana mientras que en línea ocurre lo contrario. El widget de **Ingresos multicanal** muestra todos los canales uno al lado del otro. La vista de **Rendimiento de productos** te permite comparar el mismo SKU en distintos canales. Esta visibilidad omnicanal es algo que a los grandes minoristas suele costarles miles de libras en análisis a medida; AskBiz la entrega automáticamente porque el POS viene integrado, no añadido después.',
      },
      {
        heading: 'Cómo configurar tu panel del POS',
        body: 'Ve a **Paneles → Crear panel** y selecciona la plantilla del POS, o crea uno desde cero añadiendo widgets de la categoría POS. Ordénalos de la forma que coincida con tu revisión diaria: la mayoría de los propietarios ponen los ingresos y las unidades vendidas arriba a la izquierda, el rendimiento de productos debajo y las métricas de personal a la derecha. Guárdalo como tu vista predeterminada para que cargue automáticamente cuando abras AskBiz. Si compartes el panel con un gerente de tienda, verá los mismos datos en tiempo real sin necesitar acceso a la administración completa de AskBiz. Compartir paneles respeta los permisos por rol, así que un gerente ve los datos de ventas pero no la facturación ni la configuración de la cuenta.',
      },
    ],
    faq: [
      {
        q: '¿Con qué rapidez aparecen los datos del POS en mi panel?',
        a: 'En cuestión de segundos. AskBiz POS escribe las transacciones directamente en tu almacén central de datos, y los paneles obtienen la información de la misma fuente en tiempo real.',
      },
      {
        q: '¿Puedo ver las ventas del POS y en línea en el mismo gráfico?',
        a: 'Sí. El widget de Ingresos multicanal combina todos los canales conectados —incluido el POS— en una sola vista, desglosada por fuente.',
      },
    ],
  },

  'pos-ai-chat-questions': {
    title: 'Pregúntale a AskBiz sobre los datos de tu POS: 25 preguntas que revelan información valiosa sobre tu retail',
    description:
      'La IA de AskBiz puede responder preguntas sobre las transacciones de tu POS en lenguaje sencillo. Aquí tienes 25 preguntas que todo dueño de tienda debería hacer.',
    keywords: [
      'preguntar a askbiz sobre el pos',
      'preguntas de ia sobre el pos',
      'análisis con ia en retail',
      'consultas en lenguaje natural del pos',
      'chat de ia de askbiz para retail',
      'información del punto de venta con ia',
    ],
    keyTakeaways: [
      'La IA de AskBiz entiende los datos de tu POS: solo hazle preguntas en lenguaje sencillo.',
      'Las preguntas sobre tendencias de ingresos, rendimiento de productos y métricas de personal funcionan de inmediato, sin configuración.',
      'Combinar preguntas sobre el POS con preguntas sobre datos en línea te da información que ningún sistema por separado podría ofrecerte.',
    ],
    content: [
      {
        heading: 'Cómo entiende la IA los datos de tu POS',
        body: "Cuando escribes una pregunta en AskBiz, la IA examina todas tus fuentes de datos conectadas, incluida cada transacción procesada a través del POS. Entiende nombres de productos, precios, miembros del personal, métodos de pago, motivos de reembolso y periodos de tiempo. No necesitas escribir consultas ni seleccionar filtros. Solo pregunta en lenguaje sencillo: '¿Cuál fue mi producto más vendido el martes pasado?' o '¿Qué cajero procesó más reembolsos este mes?'. La IA traduce tu pregunta en una consulta de datos, la ejecuta contra tu historial de transacciones y te devuelve la respuesta en una frase o en un gráfico, lo que resulte más útil. Este es el mismo motor de IA que impulsa el resto de AskBiz, ahora con visibilidad completa de los datos de tu retail físico.",
      },
      {
        heading: 'Preguntas sobre ingresos y ventas',
        body: "Empieza por lo fundamental. **'¿Cuáles fueron mis ingresos totales del POS esta semana?'** te da la cifra principal. **'¿Cómo se compara esta semana con la misma semana del mes pasado?'** añade contexto. **'¿Cuál es mi tamaño promedio de cesta?'** te dice si los clientes están comprando más artículos o solo artículos más caros. **'¿Qué día de la semana tiene los mayores ingresos del POS?'** ayuda a las decisiones de personal. **'¿Qué porcentaje de mis ingresos viene de efectivo frente a tarjeta?'** informa tu estrategia de procesamiento de pagos. **'Muéstrame los ingresos diarios del POS de los últimos 30 días en un gráfico'** te da la tendencia visual. Cada una de estas preguntas tarda segundos en responderse y, sin la IA, requeriría trabajo manual en una hoja de cálculo.",
      },
      {
        heading: 'Preguntas sobre productos e inventario',
        body: "La inteligencia de productos es donde los datos del POS realmente destacan. **'¿Cuáles son mis 10 productos principales por unidades vendidas este mes?'** identifica tus productos que más se mueven. **'¿Qué productos tienen la tasa de reembolso más alta?'** señala problemas de calidad o de tallas. **'¿Qué productos no se han vendido en los últimos 30 días?'** destaca el stock muerto. **'¿Cuál es mi margen promedio por categoría de producto?'** muestra dónde realmente ganas dinero frente a dónde solo mueves volumen. **'¿Qué productos se compran juntos con frecuencia?'** revela oportunidades de venta cruzada que podrías estar pasando por alto. **'Predice qué productos se quedarán sin stock en los próximos 7 días según la tasa de rotación actual'** convierte los datos de tu POS en una herramienta de planificación con visión de futuro.",
      },
      {
        heading: 'Preguntas sobre personal y operaciones',
        body: "Los datos de tu POS contienen una mina de información operativa. **'¿Qué miembro del personal tiene el valor promedio de cesta más alto?'** identifica a tus mejores vendedores en venta cruzada. **'¿Cuál es el tiempo promedio de transacción por cajero?'** destaca oportunidades de capacitación. **'¿Cuántas transacciones procesa cada cajero por hora?'** mide el rendimiento operativo. **'Muéstrame los reembolsos por miembro del personal este mes'** ayuda a detectar patrones que podrían necesitar atención. **'¿Cuáles son las horas de mayor actividad esta semana?'** optimiza tu horario de turnos. **'Compara el rendimiento del personal de este mes con el del mes pasado'** rastrea la mejora a lo largo del tiempo. Estas preguntas convierten los registros brutos de transacciones en inteligencia de gestión que te ayuda a llevar mejor tu tienda.",
      },
    ],
    faq: [
      {
        q: '¿Puedo pedirle a la IA que compare las ventas del POS con mi tienda en línea?',
        a: "Sí. Prueba con: 'Compara mis ingresos en tienda con los ingresos de Shopify este mes'. La IA toma datos de ambas fuentes y presenta una comparación lado a lado.",
      },
      {
        q: '¿Qué pasa si la IA da una respuesta incorrecta sobre los datos de mi POS?',
        a: 'Comprueba que el periodo de tiempo y los nombres de producto de la respuesta coincidan con tu pregunta. Si los datos parecen incorrectos, verifica que todas las transacciones del POS se hayan sincronizado revisando el registro de transacciones. Puedes marcar respuestas imprecisas usando el botón de pulgar hacia abajo.',
      },
    ],
  },

  'pos-daily-brief-integration': {
    title: 'Cómo aparecen los datos del POS en tu Resumen Diario',
    description:
      'Tu Resumen Diario de AskBiz incluye automáticamente información del POS: los ingresos de ayer, los productos más vendidos, las alertas de stock y las anomalías de tu tienda física.',
    keywords: [
      'resumen diario del pos',
      'resumen diario de retail',
      'informe matutino del pos',
      'resumen diario de askbiz para el pos',
      'informe automatizado del pos',
      'información diaria de retail',
    ],
    keyTakeaways: [
      'El Resumen Diario incluye automáticamente los datos del POS cuando el módulo está activo, sin necesidad de configuración.',
      'Destaca los ingresos de ayer, los productos más vendidos, las alertas de stock y cualquier patrón inusual.',
      'Comparar tu Resumen Diario entre distintos días revela tendencias que los registros individuales de transacciones no pueden mostrar.',
    ],
    content: [
      {
        heading: 'Qué incluye el Resumen Diario de tu POS',
        body: 'Cuando tienes AskBiz POS activado, tu Resumen Diario matutino añade automáticamente una sección de retail. Esta incluye los ingresos totales de ayer del POS y cómo se comparan con el mismo día de la semana pasada, los tres productos principales por unidades vendidas, cualquier producto que haya activado alertas de stock bajo o sin existencias durante la noche, y una tabla de clasificación del personal que muestra transacciones e ingresos por cajero. Si también tienes canales en línea conectados, el Resumen muestra un desglose por canal para que puedas ver cómo se comparó el rendimiento en tienda con las ventas digitales. Todo esto llega a tu bandeja de entrada o a la pantalla de inicio de AskBiz antes de que abras la tienda, dándote una imagen completa de ayer y una ventaja para hoy.',
      },
      {
        heading: 'Detección de anomalías para retail',
        body: 'El Resumen Diario no solo reporta números: señala cualquier cosa inusual. Si los ingresos de ayer estuvieron significativamente por encima o por debajo del promedio reciente, el Resumen lo destaca y sugiere posibles razones (un evento local, un cambio de precio, una ausencia del personal). Si un producto que normalmente vende diez unidades al día de pronto vendió cero, eso también se señala: podría indicar un problema de exhibición, un problema de stock o un error de escaneo. Estas anomalías se detectan automáticamente usando el mismo motor de detección que supervisa tus canales en línea. Para un dueño de tienda ocupado, esto significa que no necesitas comparar hojas de cálculo manualmente para detectar problemas: el Resumen lo hace por ti cada mañana.',
      },
      {
        heading: 'Cómo personalizar tu Resumen del POS',
        body: 'El Resumen Diario está diseñado para funcionar de inmediato, sin configuración, pero puedes personalizarlo. Ve a **Configuración → Resumen Diario → Sección del POS** para elegir qué métricas aparecen, definir periodos de comparación (día contra día, semana contra semana o mes contra mes) y añadir o quitar la tabla de clasificación del personal. Si gestionas varias sucursales, puedes recibir un Resumen separado por sucursal o una vista consolidada. También puedes fijar la hora de entrega: la mayoría de los dueños de tienda prefieren recibirlo 30 minutos antes de abrir, para tener tiempo de revisarlo con un café antes de que llegue el primer cliente.',
      },
      {
        heading: 'Cómo actuar según tu Resumen',
        body: "El mejor Resumen Diario es el que lleva a la acción. Si los ingresos bajaron ayer, pregúntale a la IA por qué: '¿Por qué los ingresos del POS fueron más bajos de lo habitual ayer?'. Si un producto se está agotando, reabastécelo antes de abrir la tienda. Si un cajero supera constantemente a los demás en valor de cesta, entiende qué está haciendo diferente y compártelo con el equipo. El Resumen no es un informe para archivar: es un impulso para tomar decisiones. Con el paso de las semanas y los meses, revisar tu Resumen a diario construye una comprensión intuitiva de los ritmos de tu negocio que ninguna cantidad de informes puntuales puede reemplazar.",
      },
    ],
    faq: [
      {
        q: '¿Necesito configurar algo para que los datos del POS aparezcan en mi Resumen?',
        a: 'No. En cuanto el POS está activado, el Resumen Diario incluye automáticamente datos de retail desde la mañana siguiente. Puedes personalizar qué métricas aparecen en Configuración.',
      },
      {
        q: '¿Puedo recibir también un Resumen a mediodía?',
        a: 'Sí. Ve a Configuración → Resumen Diario → Horario y añade una segunda entrega a la hora que prefieras. Algunos dueños de tienda configuran uno para la apertura y otro para después del ajetreo del almuerzo.',
      },
    ],
  },

  'pos-business-pulse-impact': {
    title: 'Cómo afectan las transacciones del POS a tu puntuación de Business Pulse',
    description:
      'Tu puntuación de Business Pulse tiene en cuenta las tendencias de ingresos del POS, la salud del inventario y los patrones de transacciones. Así es exactamente cómo funciona.',
    keywords: [
      'business pulse del pos',
      'puntuación de salud del pos',
      'puntuación de negocio en retail',
      'pulse de askbiz para el pos',
      'puntuación de rendimiento del pos',
      'salud del negocio en retail',
    ],
    keyTakeaways: [
      'Las tendencias de ingresos del POS, la salud del inventario y las tasas de reembolso alimentan tu puntuación de Business Pulse.',
      'Unos ingresos diarios constantes del POS mejoran el componente de estabilidad de tu puntuación.',
      'Las tasas de reembolso altas o los eventos frecuentes de falta de stock harán que tu puntuación baje.',
    ],
    content: [
      {
        heading: 'Qué mide la puntuación de Business Pulse',
        body: 'El Business Pulse es una puntuación compuesta de 0 a 100 que refleja la salud general de tu negocio. Combina cinco dimensiones: salud de ingresos (tendencia, consistencia, crecimiento), salud de flujo de caja (runway, cuentas por cobrar), salud del cliente (retención, riesgo de abandono), salud operativa (reembolsos, cumplimiento, fiabilidad de proveedores) y señales de mercado. Cuando el POS está activado, los datos de tus transacciones en tienda alimentan directamente las dimensiones de ingresos y operativa. Esto significa que cada venta que procesas —y cada reembolso que emites— tiene un impacto medible en tu puntuación de Pulse. La puntuación se recalcula a diario para los usuarios del plan gratuito y en tiempo real para los usuarios de los planes Growth y Business.',
      },
      {
        heading: 'Cómo influyen los datos del POS en cada dimensión',
        body: 'La **Salud de ingresos** es la que se ve afectada más directamente. El Pulse rastrea la tendencia de tus ingresos del POS en ventanas móviles de 7 y 30 días. Unos ingresos constantes o crecientes elevan la puntuación; unos ingresos en descenso la reducen. La volatilidad también importa: una tienda que gana £500 todos los días obtiene una puntuación de consistencia más alta que una que oscila entre £200 y £800, incluso si los promedios son idénticos. La **Salud operativa** considera tu tasa de reembolsos (reembolsos como porcentaje de las ventas brutas), la frecuencia de falta de stock y la rotación de inventario. Una tasa de reembolsos alta señala problemas de calidad del producto o de satisfacción del cliente. Los eventos frecuentes de falta de stock señalan una mala planificación de inventario. Ambos factores reducen tu puntuación operativa.',
      },
      {
        heading: 'Cómo mejorar tu Pulse con los datos del POS',
        body: 'Concéntrate en las palancas que puedes controlar. Para mejorar la consistencia de ingresos, analiza tus patrones de ventas diarias y aborda las caídas: ¿el lunes siempre es flojo? Considera una promoción de lunes. Para mejorar tu tasa de reembolsos, profundiza en los motivos: ¿ciertos productos se devuelven más a menudo? ¿Los reembolsos se concentran en un solo miembro del personal? Para mejorar la salud del inventario, configura alertas de stock bajo en AskBiz POS y reabastece de forma proactiva en lugar de reactiva. Cada una de estas acciones aborda una dimensión específica del Pulse y debería producir una mejora medible en una o dos semanas de ejecución constante.',
      },
      {
        heading: 'Cómo leer la tendencia de tu Pulse a lo largo del tiempo',
        body: 'Una puntuación de Pulse aislada es solo una fotografía. El verdadero valor está en la tendencia. Ve a **Inteligencia → Business Pulse → Tendencia** para ver tu puntuación de los últimos 90 días. Busca puntos de inflexión —momentos en los que la puntuación cambió de dirección— y relaciónalos con lo que pasó en el negocio. ¿La puntuación bajó cuando se te agotó un producto clave? ¿Subió cuando añadiste un nuevo cajero y redujiste los tiempos de espera? Estas correlaciones convierten al Pulse de una métrica superficial en una verdadera herramienta de diagnóstico. Con el tiempo, desarrollarás un sentido intuitivo de qué mueve tu puntuación, y esa intuición te ayudará a tomar mejores decisiones diarias.',
      },
    ],
    faq: [
      {
        q: '¿La puntuación de Pulse trata por igual los ingresos del POS y los ingresos en línea?',
        a: 'Sí. Los ingresos son ingresos sin importar el canal. El Pulse combina todas las fuentes conectadas en una sola evaluación de salud de ingresos, ponderada según su proporción del total.',
      },
      {
        q: '¿Con qué rapidez afecta un reembolso del POS a mi Pulse?',
        a: 'En los planes Growth y Business, el Pulse se actualiza en tiempo real. En el plan gratuito, se recalcula durante la noche. Un solo reembolso en un negocio saludable tendrá un impacto insignificante: la puntuación responde a patrones, no a transacciones individuales.',
      },
    ],
  },

  'pos-offline-mode': {
    title: 'Modo sin conexión: qué pasa cuando se corta tu internet a mitad de una venta',
    description:
      'AskBiz POS es una PWA que puede manejar cortes breves de conectividad. Esto es lo que funciona sin conexión, lo que no, y cómo recuperarte sin problemas.',
    keywords: [
      'modo sin conexión del pos',
      'pos sin internet',
      'punto de venta sin conexión',
      'pwa sin conexión para retail',
      'problemas de conectividad del pos',
      'askbiz pos sin conexión',
    ],
    keyTakeaways: [
      'AskBiz POS guarda tu catálogo de productos localmente en caché para que puedas seguir añadiendo artículos al carrito durante cortes breves.',
      'Las transacciones se ponen en cola localmente y se sincronizan automáticamente cuando vuelve la conectividad.',
      'Los cortes prolongados (de más de 30 minutos) requieren conciliación manual: restablece siempre la conectividad lo antes posible.',
    ],
    content: [
      {
        heading: 'Cómo funciona el modo sin conexión',
        body: 'AskBiz POS funciona como una Progressive Web App, lo que significa que el código de la aplicación y tu catálogo de productos quedan en caché en el dispositivo tras la primera carga. Si tu conexión a internet se corta durante una venta, la app sigue funcionando: puedes continuar escaneando productos, añadiendo artículos al carrito, ajustando cantidades y completando el proceso de cobro. La transacción se guarda localmente en el dispositivo y se coloca en una cola de sincronización. Cuando vuelve la conectividad, la cola se procesa automáticamente y todas las transacciones pendientes se suben al servidor. Verás un pequeño aviso en la parte superior de la pantalla indicando el estado sin conexión, y otra confirmación cuando la sincronización se complete.',
      },
      {
        heading: 'Qué funciona y qué no',
        body: '**Funciona sin conexión:** explorar tu catálogo de productos, añadir artículos al carrito, procesar ventas (solo en efectivo; los datáfonos necesitan conectividad), generar un recibo local. **No funciona sin conexión:** el escaneo con cámara para productos nuevos que aún no estén en tu catálogo (la API de reconocimiento requiere conexión al servidor), la comprobación de niveles de inventario en tiempo real, el envío de recibos por WhatsApp, el inicio de sesión del personal mediante enlace mágico y la sincronización con los paneles. Los pagos con tarjeta requieren una conexión activa con el procesador de pagos; si estás sin conexión, solo puedes aceptar efectivo. Esta limitación proviene de la red de tarjetas, no de AskBiz.',
      },
      {
        heading: 'Cómo recuperarte de un corte prolongado',
        body: 'Los cortes breves de unos minutos se gestionan sin problemas: la cola de sincronización se procesa y todo se concilia automáticamente. Los cortes prolongados de 30 minutos o más generan una cola más larga que puede tardar un minuto en sincronizarse cuando vuelve la conectividad. Durante ese tiempo, los datos del panel y los niveles de inventario estarán temporalmente desactualizados. Si el dispositivo se queda sin batería o el navegador falla mientras hay transacciones sin conexión en cola, el service worker de la PWA conserva la cola en el almacenamiento local. Al volver a abrir la app, intentará sincronizar cualquier transacción pendiente. En el raro caso de que se pierda una transacción, puedes conciliarla manualmente usando los recibos en papel o locales que emitiste durante el corte.',
      },
      {
        heading: 'Mejores prácticas para la conectividad',
        body: 'Prevenir es mejor que recuperarse. Usa una conexión de banda ancha dedicada para tu dispositivo POS en lugar de depender del Wi-Fi público. Mantén un punto de acceso móvil 4G/5G como respaldo: una simple SIM de £10 al mes puede salvarte de perder ventas durante un corte de banda ancha. Coloca tu dispositivo POS dentro del alcance de una buena señal de Wi-Fi: las paredes gruesas y las estanterías metálicas pueden degradar la señal. Si operas en mercados, tiendas pop-up o eventos al aire libre donde la conectividad es poco fiable, precarga tu catálogo completo de productos antes de salir y lleva contigo un punto de acceso móvil. Prueba tu capacidad sin conexión antes de necesitarla: pon tu dispositivo en modo avión y realiza una transacción de práctica para confirmar que todo funciona.',
      },
    ],
    faq: [
      {
        q: '¿Perderé datos de ventas si se corta mi internet?',
        a: 'No. Las transacciones se guardan localmente en el dispositivo y se sincronizan cuando vuelve la conectividad. Los datos solo corren riesgo si el dispositivo se queda sin batería Y se borra la caché del navegador antes de reconectarse, algo extremadamente raro.',
      },
      {
        q: '¿Puedo procesar pagos con tarjeta sin conexión?',
        a: 'No. Los pagos con tarjeta requieren una conexión activa con el procesador de pagos. Durante un corte, solo puedes aceptar efectivo. Esta es una limitación de las redes de tarjetas, no de AskBiz.',
      },
    ],
  },

  'multi-location-retail-management': {
    title: 'Gestión de retail multisucursal: guía completa',
    description:
      'Por qué importa tener inventario separado por sucursal, cómo estructurar operaciones multisucursal y los errores comunes que sorprenden a los comercios en crecimiento.',
    keywords: [
      'retail multisucursal',
      'gestión de varias tiendas',
      'gestión de sucursales',
      'expansión de retail',
      'segunda tienda',
      'retail multisede',
    ],
    keyTakeaways: [
      'Cada sucursal debe mantener un inventario independiente para evitar sobreventas y permitir informes precisos por ubicación.',
      'La propiedad centralizada con operaciones descentralizadas es el modelo estándar: el personal trabaja localmente y el propietario lo ve todo.',
      'El error más común al abrir una segunda sucursal es tratar el inventario como un único fondo compartido.',
    ],
    content: [
      {
        heading: 'Por qué una tienda es sencilla y dos tiendas son difíciles',
        body: 'Gestionar una sola tienda es sencillo: un conjunto de stock, un equipo, una caja registradora. En el momento en que abres una segunda sucursal, la complejidad se multiplica. El inventario que era una sola lista se convierte en dos listas que pueden divergir. El personal que lo sabía todo ahora solo conoce su propia sucursal. Los ingresos que eran una sola cifra se convierten en dos cifras que hay que comparar, combinar y poner en contexto. Los comercios que escalan con éxito son los que construyen sistemas para esta complejidad antes de abrir la segunda puerta.',
      },
      {
        heading: 'El principio del inventario separado',
        body: 'La regla más importante del retail multisucursal es que cada sucursal debe mantener su propio conteo de inventario. Un producto con 20 unidades en stock no significa nada si no sabes si esas 20 unidades están en tu tienda principal o en tu almacén. Tener inventario separado significa que cada sucursal rastrea sus propios niveles de stock, activa sus propias alertas de stock bajo y muestra su propia disponibilidad de productos. Esto evita el error más común en el retail multisucursal: que a un cliente en la Sucursal A le digan que un producto está en stock cuando en realidad está en un estante de la Sucursal B.',
      },
      {
        heading: 'Visibilidad centralizada, operaciones descentralizadas',
        body: 'El propietario o gerente necesita ver datos consolidados de todas las sucursales: ingresos totales, valor combinado del inventario, margen general. Pero el cajero de cada sucursal solo necesita ver sus propios productos y sus propias ventas. Este modelo de doble vista es el estándar en los sistemas POS modernos. El personal queda restringido a su propia sucursal por claridad operativa y seguridad, mientras que el propietario tiene un panel que agrega todo con la posibilidad de profundizar en cualquier ubicación específica.',
      },
      {
        heading: 'Errores comunes al expandirse',
        body: 'Los errores más frecuentes que cometen los comercios al abrir una segunda sucursal: tratar el inventario como un único fondo compartido (lleva a sobreventas), no asignar al personal a sucursales específicas (lleva a confusión de datos), no comparar el rendimiento entre sucursales (una ubicación tiene un bajo rendimiento sin que nadie se dé cuenta) y no tener un proceso de transferencia de stock (excedente en una sucursal mientras la otra se queda sin existencias). Un buen sistema POS multisucursal evita todo esto al forzar la separación a nivel de datos.',
      },
      {
        heading: 'Cuándo añadir una tercera sucursal',
        body: 'Si tu segunda sucursal es rentable, operativamente estable, y tus sistemas manejan la complejidad de las dos ubicaciones sin soluciones manuales improvisadas, estás listo para una tercera. El salto de dos a tres es más fácil que el de una a dos, porque ya has resuelto los problemas de arquitectura. La métrica clave a vigilar es si tus márgenes por sucursal se mantienen estables a medida que añades ubicaciones; si los márgenes se reducen con cada nueva sucursal, te estás expandiendo demasiado rápido.',
      },
    ],
    faq: [
      {
        q: '¿Debería usar sistemas POS separados para cada sucursal?',
        a: 'No. Un único sistema POS con soporte multisucursal te da informes consolidados, una gestión de personal más sencilla y la capacidad de transferir stock entre ubicaciones. Los sistemas separados crean silos de datos.',
      },
      {
        q: '¿Cuántas sucursales puede gestionar realmente un pequeño negocio?',
        a: 'Depende del negocio, pero la mayoría de las pymes encuentran que entre 2 y 5 ubicaciones es manejable con buenos sistemas. Más allá de eso, normalmente se necesitan gerentes regionales o supervisores de zona para mantener la calidad.',
      },
    ],
  },
}
