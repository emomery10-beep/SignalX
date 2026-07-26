// Academy article translations — Español (es) — Wave A, batch 1.
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
// Merge this into lib/academy-i18n/es/index.ts's `translations` export
// (spread alongside any other es batches) — not done here per instructions.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch1Translations: LocaleTranslations = {
  'what-is-a-pos-system': {
    title: '¿Qué es un sistema POS? Guía completa para propietarios de pequeños negocios',
    description:
      'Un sistema POS es el corazón de cada transacción minorista. Descubre qué hace el software de punto de venta, por qué es importante y cómo elegir el adecuado para tu negocio.',
    keywords: [
      'sistema POS',
      'punto de venta',
      'POS para retail',
      'POS para pequeños negocios',
      'software de punto de venta',
      'punto de venta electrónico',
      'sistema TPV',
    ],
    keyTakeaways: [
      'Un sistema POS combina hardware y software para procesar ventas, controlar el inventario y generar recibos.',
      'Las soluciones POS modernas en la nube funcionan en tablets y teléfonos, sin necesidad de cajas registradoras voluminosas.',
      'Elegir el POS adecuado influye en todo: desde la velocidad de cobro hasta la precisión del inventario y el cumplimiento fiscal.',
    ],
    content: [
      {
        heading: '¿Qué significa realmente POS?',
        body: 'POS significa Point of Sale (punto de venta): el momento y el lugar donde un cliente paga por productos o servicios. Antiguamente, esto significaba una caja registradora atornillada al mostrador. Hoy, un sistema POS es software (a menudo en la nube) que funciona en una tablet, un teléfono o una terminal dedicada, y hace mucho más que cobrar. Registra cada transacción, actualiza tus niveles de inventario en tiempo real, calcula el IVA, genera recibos digitales o impresos, y alimenta informes que te dicen exactamente cómo va tu negocio. Si alguna vez pagaste con tarjeta en una cafetería y viste cómo el iPad del barista se actualizaba al instante, ya viste un POS moderno en acción. El paso de las cajas mecánicas a los sistemas basados en software ha sido uno de los mayores cambios en el comercio minorista del Reino Unido en la última década, y ahora está al alcance incluso del puesto de mercado o la tienda pop-up más pequeños.',
      },
      {
        heading: 'Funciones esenciales que debe tener todo sistema POS',
        body: 'Como mínimo, un sistema POS debe permitirte escanear o buscar productos, añadirlos al carrito, aplicar descuentos o promociones, aceptar varios métodos de pago (efectivo, tarjeta, sin contacto) y emitir un recibo. Más allá de eso, busca gestión de inventario: el sistema debe descontar el stock automáticamente al vender un artículo y avisarte cuando los niveles estén bajos. La gestión de personal es igual de importante: necesitas poder asignar roles, saber quién procesó cada venta y controlar el acceso a funciones sensibles como reembolsos y anulaciones. Los informes completan lo esencial. Un buen POS te ofrece resúmenes de ingresos diarios, listas de productos más vendidos y desgloses de impuestos sin que tengas que exportar nada a una hoja de cálculo. Si estás registrado para el IVA, el sistema debe calcularlo y desglosarlo en cada transacción para que tus declaraciones sean sencillas.',
      },
      {
        heading: 'POS en la nube frente al TPV tradicional',
        body: 'Los sistemas TPV (terminal de punto de venta) electrónicos tradicionales suelen funcionar en hardware dedicado con los datos almacenados localmente. Son fiables, pero caros, difíciles de actualizar y quedan atados a una sola ubicación. Los sistemas POS en la nube almacenan los datos en servidores remotos y se sincronizan entre dispositivos. Las ventajas son notables: puedes consultar las ventas desde tu teléfono estando fuera del negocio, las actualizaciones se aplican automáticamente y no existe un punto único de fallo si se rompe un dispositivo. La contrapartida es que los sistemas en la nube necesitan conexión a internet, aunque los buenos —incluido AskBiz POS— ofrecen un modo sin conexión para que puedas seguir vendiendo durante cortes breves y sincronizar todo cuando vuelva la conectividad. Para la mayoría de los pequeños negocios del Reino Unido, un POS en la nube que funcione en una tablet o un teléfono que ya tienen es la opción más económica y flexible.',
      },
      {
        heading: 'Cómo elegir el POS adecuado para tu negocio',
        body: 'Empieza por definir tus condiciones innegociables. ¿Necesitas escaneo de códigos de barras? ¿Inicio de sesión para varios miembros del personal? ¿Integración con tu software de contabilidad? Anota todo eso antes de mirar ningún producto. Después, calcula el costo total: no solo la suscripción mensual, sino también las comisiones de procesamiento de tarjetas, el costo del hardware y cualquier cargo por transacción. Los planes gratuitos suelen venir con comisiones de procesamiento más altas que se acumulan rápido con el volumen. Por último, prueba tú mismo el proceso de cobro. Cronometra cuánto tarda una venta de tres artículos, desde el escaneo hasta el recibo. Si tarda más de sesenta segundos, tus clientes lo notarán. AskBiz POS está diseñado para completar ese proceso en menos de sesenta segundos usando solo la cámara del teléfono para escanear, sin necesidad de hardware adicional.',
      },
    ],
    faq: [
      {
        q: '¿Necesito hardware especial para un sistema POS?',
        a: 'No necesariamente. Muchos sistemas POS modernos, incluido AskBiz POS, funcionan en smartphones y tablets estándar. Puedes añadir una impresora de recibos o un lector de tarjetas como complementos, pero no son necesarios para empezar a vender.',
      },
      {
        q: '¿Un sistema POS es lo mismo que un datáfono?',
        a: 'No. Un datáfono solo procesa pagos con tarjeta. Un sistema POS gestiona toda la venta —selección de productos, precios, actualización de inventario, recibos e informes— y el procesamiento de tarjetas es solo un componente más.',
      },
      {
        q: '¿Cuánto cuesta un sistema POS en el Reino Unido?',
        a: 'Los costos van desde gratis (con comisiones por transacción) hasta £50–100 al mes para sistemas completos. El hardware puede sumar entre £200 y £1,000, según uses dispositivos que ya tienes o compres terminales dedicadas.',
      },
    ],
  },

  'askbiz-pos-overview': {
    title: 'AskBiz POS: cómo funciona nuestro punto de venta integrado',
    description:
      'AskBiz incluye un módulo POS totalmente integrado. Así es como funciona, cuánto cuesta y por qué es diferente de las cajas independientes.',
    keywords: [
      'AskBiz POS',
      'POS integrado',
      'punto de venta integrado',
      'AskBiz para retail',
      'módulo POS',
      'software de caja para pequeños negocios',
    ],
    keyTakeaways: [
      'AskBiz POS está integrado en la plataforma: no necesitas integraciones de terceros ni suscripciones adicionales.',
      'Usa la cámara de tu teléfono para escanear códigos de barras, eliminando la necesidad de hardware dedicado.',
      'Cada venta alimenta automáticamente los análisis de AskBiz, dándote inteligencia de negocio en tiempo real.',
    ],
    content: [
      {
        heading: 'Por qué integramos un POS en AskBiz',
        body: 'La mayoría de los dueños de pequeños negocios terminan con un mosaico de herramientas: un sistema para vender, otro para el inventario, un tercero para la contabilidad y quizás un cuarto para los análisis. Cada uno tiene su propio inicio de sesión, su propio formato de datos y su propia cuota mensual. Cuando algo falla —una discrepancia de stock, una transacción que falta, un número de IVA que no cuadra— pasas horas cruzando hojas de cálculo. Creamos AskBiz POS para eliminar esa fricción. Como el POS vive dentro de AskBiz, cada venta que procesas actualiza al instante tu inventario, alimenta tus paneles de ingresos y pasa a formar parte de tu inteligencia de negocio. No hay sincronización, ni exportaciones a CSV, ni conciliaciones. Los datos fluyen en tiempo real, lo que significa que las estadísticas que ves en AskBiz siempre están al día.',
      },
      {
        heading: 'Cómo funciona en la práctica',
        body: 'Al abrir el módulo POS, ves una interfaz de venta limpia y sencilla. Toca el icono de la cámara para escanear un código de barras: AskBiz usa la cámara de tu dispositivo y aprendizaje automático integrado para reconocer los códigos al instante. El producto aparece en tu carrito con su nombre, precio y nivel de stock actual. Añade más artículos, ajusta las cantidades, aplica descuentos si hace falta y luego elige un método de pago: efectivo, tarjeta o una combinación de ambos. Una vez confirmada la venta, AskBiz genera un recibo que puedes imprimir, mostrar en pantalla o enviar directamente al cliente por WhatsApp. Todo el proceso —desde el primer escaneo hasta el recibo— suele tardar menos de sesenta segundos. Entre bambalinas, se descuenta el stock, los ingresos se registran a nombre del miembro del personal correcto, se calcula el IVA y la transacción queda registrada en tu historial de auditoría.',
      },
      {
        heading: 'Qué lo hace diferente de los sistemas POS independientes',
        body: 'Los sistemas POS independientes son herramientas transaccionales: procesan ventas y ahí termina, más o menos, su trabajo. AskBiz POS es una herramienta de inteligencia de negocio que, de paso, procesa ventas. Cada transacción genera datos que AskBiz analiza automáticamente. No solo ves que hoy vendiste cuarenta y dos unidades del Producto X; ves que sus ventas subieron un 18% respecto a la semana pasada, que es tu artículo con mayor margen, y que, al ritmo de venta actual, se te agotará el stock en nueve días. Ese contexto convierte un POS en algo más que una caja registradora sofisticada: lo transforma en un motor de decisiones. También obtienes métricas de rendimiento del personal, seguimiento de ingresos diarios, alertas de stock bajo e informes exportables, todo sin salir de la plataforma.',
      },
      {
        heading: 'Cómo empezar con AskBiz POS',
        body: 'La configuración toma unos quince minutos. Primero, añade tus productos: puedes hacerlo manualmente, subiendo un CSV, o escaneando códigos de barras e introduciendo los datos sobre la marcha. Después, invita a tu personal y asígnale roles (Propietario, Gerente o Cajero) para que cada persona tenga el nivel de acceso adecuado. Por último, configura tus opciones de recibo: elige entre entrega impresa, en pantalla o por WhatsApp. No hace falta comprar hardware, salvo que quieras una impresora de recibos Bluetooth por comodidad. AskBiz POS funciona como una Progressive Web App (PWA), así que funciona en cualquier teléfono o tablet moderno y se puede instalar en la pantalla de inicio para acceder con un solo toque. Si ya usas AskBiz para análisis o inventario, tu catálogo de productos ya está ahí: solo activa el módulo POS y empieza a vender.',
      },
    ],
    faq: [
      {
        q: '¿AskBiz POS está incluido en mi suscripción?',
        a: 'Sí. El módulo POS está incluido en todos los planes de AskBiz sin costo adicional. AskBiz no cobra comisiones por transacción: solo pagas lo que te cobre tu procesador de tarjetas.',
      },
      {
        q: '¿Puedo usar AskBiz POS sin conexión?',
        a: 'AskBiz POS admite un modo sin conexión para ventas básicas. Las transacciones se guardan localmente y se sincronizan automáticamente cuando tu dispositivo vuelve a conectarse a internet.',
      },
      {
        q: '¿Necesito comprar un lector de códigos de barras?',
        a: 'No. AskBiz usa la cámara de tu teléfono o tablet para escanear códigos de barras. Un lector Bluetooth dedicado es opcional, si prefieres la velocidad y la ergonomía de un dispositivo físico.',
      },
    ],
  },

  'pos-staff-management': {
    title: 'Gestión del personal del POS: roles, permisos e inicio de sesión con enlace mágico',
    description:
      'Controla quién puede hacer qué en tu POS. Aprende a configurar roles de personal, gestionar permisos y usar el inicio de sesión con enlace mágico para un acceso rápido y seguro.',
    keywords: [
      'gestión de personal POS',
      'roles de personal POS',
      'permisos POS',
      'inicio de sesión con enlace mágico',
      'acceso de cajero',
      'gestión de usuarios POS',
      'acceso del personal en retail',
    ],
    keyTakeaways: [
      'AskBiz POS admite tres roles —Propietario, Gerente y Cajero— cada uno con distintos niveles de permisos.',
      'El inicio de sesión con enlace mágico permite que el personal acceda con un solo toque, sin contraseñas que recordar ni restablecer.',
      'Los permisos granulares protegen operaciones sensibles como reembolsos, anulaciones y exportación de datos.',
    ],
    content: [
      {
        heading: 'Por qué importan los roles de personal en un POS',
        body: 'Cuando eres la única persona detrás de la caja, los permisos no importan: puedes hacerlo todo. En el momento en que contratas a una segunda persona, todo cambia. Un ayudante de fin de semana debería poder procesar ventas e imprimir recibos, pero ¿debería poder emitir reembolsos, anular transacciones o exportar tus datos de ingresos? Casi con toda seguridad, no. Los roles de personal te permiten definir exactamente qué puede y qué no puede hacer cada persona dentro del POS. Esto protege tu negocio tanto de errores accidentales (un aprendiz que anula sin querer las ventas de todo un día) como de un mal uso deliberado (un empleado que emite reembolsos fraudulentos). También simplifica la interfaz para cada usuario: un cajero solo ve las pantallas que necesita, lo que agiliza la capacitación y reduce los errores.',
      },
      {
        heading: 'Los tres roles en AskBiz POS',
        body: 'Propietario es el rol de mayor nivel, con acceso sin restricciones. Los propietarios pueden añadir y eliminar personal, cambiar precios, emitir reembolsos, acceder a todos los informes y exportar datos. Normalmente debería haber uno o dos propietarios por negocio. Gerente ocupa el nivel intermedio. Los gerentes pueden procesar ventas, gestionar reembolsos y anulaciones, ver informes diarios y administrar el inventario, pero no pueden añadir ni eliminar personal, cambiar la configuración de la suscripción ni acceder a los análisis de todo el negocio. Este es el rol adecuado para un supervisor de turno o encargado de tienda de confianza. Cajero es el rol más restringido. Los cajeros pueden procesar ventas, escanear artículos, aceptar pagos y enviar recibos. No pueden emitir reembolsos, anular transacciones, ver informes ni acceder a ninguna configuración administrativa. Este es el rol predeterminado para el personal a tiempo parcial o de nuevo ingreso.',
      },
      {
        heading: 'Cómo funciona el inicio de sesión con enlace mágico',
        body: 'Los sistemas POS tradicionales usan códigos PIN o contraseñas para el inicio de sesión del personal. Los PIN se comparten, las contraseñas se olvidan, y terminas con una nota adhesiva pegada en la caja, lo que anula bastante el propósito del control de acceso. AskBiz POS usa, en cambio, el inicio de sesión con enlace mágico. Cuando un miembro del personal necesita entrar, introduce su correo electrónico y recibe un enlace de un solo uso por correo. Al tocar ese enlace, inicia sesión al instante, con el rol y los permisos correctos ya aplicados. No hay nada que recordar, nada que compartir, y el enlace caduca al poco tiempo, así que aunque lo intercepten no se puede reutilizar. Para mayor rapidez, el personal que usa el mismo dispositivo con regularidad puede permanecer conectado entre turnos, con la sesión caducando automáticamente tras un periodo de inactividad configurable.',
      },
      {
        heading: 'Cómo configurar al personal en AskBiz POS',
        body: 'Para añadir a un miembro del personal, ve a Configuración del POS y toca Agregar personal. Introduce su nombre y correo electrónico, elige su rol (Propietario, Gerente o Cajero) y toca Invitar. Recibirá un correo con un enlace mágico para configurar su sesión. Puedes cambiar el rol de alguien en cualquier momento; es útil cuando un cajero asciende a gerente, o cuando necesitas elevar temporalmente los permisos para un turno concreto. Al eliminar a un miembro del personal, su acceso se revoca de inmediato y cualquier sesión activa se cierra. AskBiz registra cada cambio de rol en el historial de auditoría, así que siempre tienes constancia de quién tuvo qué acceso y cuándo. Si en el futuro operas en varios locales, el personal puede asignarse a sedes específicas con permisos por ubicación.',
      },
    ],
    faq: [
      {
        q: '¿Un cajero puede ver cuánto ha ganado el negocio?',
        a: 'No. Los cajeros solo pueden ver la interfaz de venta. Los informes de ingresos, los análisis y las funciones de exportación están restringidos a los roles de Gerente y Propietario.',
      },
      {
        q: '¿Qué pasa si un miembro del personal pierde el acceso a su correo?',
        a: 'Un Propietario puede eliminar el correo antiguo y volver a invitar al miembro del personal con una nueva dirección de correo. El cambio es instantáneo y los enlaces mágicos antiguos dejan de funcionar de inmediato.',
      },
    ],
  },

  'pos-camera-scanning': {
    title: 'Escaneo con cámara y reconocimiento de códigos de barras en AskBiz POS',
    description:
      'Descubre cómo AskBiz POS usa la cámara de tu teléfono para escanear códigos de barras al instante, sin necesidad de un lector dedicado.',
    keywords: [
      'escaneo de códigos de barras',
      'escaneo con cámara POS',
      'lector de códigos de barras con el teléfono',
      'código de barras AskBiz',
      'código EAN',
      'escaneo UPC',
      'lector de códigos de barras para retail',
    ],
    keyTakeaways: [
      'AskBiz POS usa aprendizaje automático integrado en el dispositivo para reconocer códigos de barras a través de la cámara de tu teléfono o tablet.',
      'Admite todos los formatos de código de barras habituales en retail, incluidos EAN-13, UPC-A, Code 128 y códigos QR.',
      'El escaneo con cámara elimina, para la mayoría de los pequeños comercios, el costo de un lector de códigos de barras dedicado.',
    ],
    content: [
      {
        heading: 'Cómo funciona el escaneo con cámara',
        body: 'Al tocar el botón de escaneo en AskBiz POS, se activa la cámara de tu dispositivo y aparece un visor en pantalla. Apunta la cámara al código de barras —mantenla a unos 15 o 30 centímetros de distancia— y el sistema lo reconoce en menos de un segundo. No hay que pulsar ningún botón de disparo: el reconocimiento es continuo y automático. La tecnología detrás de esto es el aprendizaje automático integrado en el dispositivo. En lugar de enviar una imagen a un servidor para procesarla (lo que añadiría demora y requeriría conexión de red), AskBiz procesa el código de barras enteramente en tu teléfono o tablet. Esto significa que el escaneo funciona incluso cuando tu conexión a internet es inestable, algo especialmente útil para vendedores de mercado, tiendas pop-up y locales con Wi-Fi poco fiable. Una vez reconocido un código de barras, AskBiz lo busca en tu catálogo de productos y añade el artículo correspondiente al carrito.',
      },
      {
        heading: 'Formatos de código de barras admitidos',
        body: 'AskBiz POS admite todos los formatos de código de barras habituales en el comercio minorista del Reino Unido. EAN-13 es el estándar para la mayoría de los productos de consumo que se venden en Europa: es el número de trece dígitos que ves debajo de las barras en prácticamente cualquier artículo de supermercado. UPC-A es el equivalente norteamericano y es habitual en productos importados. Code 128 se usa para artículos de peso variable, etiquetas de envío y códigos internos de inventario. Los códigos QR son cada vez más usados por comercios independientes para productos personalizados que no tienen un código de barras de fábrica. Si creas tus propios productos (repostería, artículos hechos a mano, packs personalizados), puedes generar e imprimir códigos QR desde AskBiz y pegarlos en tu empaque. El escáner los reconocerá con la misma rapidez que un código de barras estándar.',
      },
      {
        heading: 'Consejos para un escaneo fiable',
        body: 'El escaneo con cámara es notablemente fiable en los teléfonos modernos, pero unas pocas prácticas sencillas lo mejoran aún más. Primero, asegura una iluminación adecuada: la cámara necesita ver el código de barras con claridad, así que en entornos muy oscuros puede hacer falta una fuente de luz cercana. Segundo, sostén el dispositivo firme y con un ligero ángulo, en lugar de perfectamente paralelo al código de barras; esto reduce los reflejos, sobre todo en empaques brillantes. Tercero, mantén el lente de la cámara limpio. Un lente sucio es la causa más común de un reconocimiento lento. Cuarto, si un código de barras está dañado o parcialmente tapado, siempre puedes recurrir a la búsqueda manual: escribe las primeras letras del nombre del producto y selecciónalo de la lista. Por último, en entornos de alto volumen donde la velocidad es crítica (como un puesto de mercado muy concurrido un sábado), considera usar un lector de códigos de barras Bluetooth. No es obligatorio, pero ahorra uno o dos segundos por escaneo en comparación con el reconocimiento por cámara.',
      },
      {
        heading: 'Qué pasa cuando un código de barras no está en tu catálogo',
        body: 'Si escaneas un código de barras que AskBiz no reconoce, te pedirá que añadas el producto. Introduces el nombre, el precio y la categoría, y el código de barras queda vinculado a ese producto de forma permanente. La próxima vez que alguien escanee el mismo código, el producto aparecerá al instante. Esto hace que la construcción del catálogo sea orgánica: no hace falta sentarse a introducir cientos de productos antes de empezar a vender. Muchos usuarios de AskBiz construyen todo su catálogo simplemente escaneando los artículos a medida que llegan de los proveedores. En la primera semana o dos de actividad, el catálogo se completa solo. También puedes importar productos en lote mediante CSV si prefieres configurarlo todo de antemano.',
      },
    ],
    faq: [
      {
        q: '¿El escaneo con cámara funciona en teléfonos antiguos?',
        a: 'Funciona en cualquier teléfono o tablet con cámara que admita los estándares web modernos. Los dispositivos de 2018 en adelante suelen funcionar bien. Los dispositivos muy antiguos pueden escanear más lento.',
      },
      {
        q: '¿Puedo escanear varios artículos en rápida sucesión?',
        a: 'Sí. Después de cada escaneo exitoso, AskBiz añade el artículo al carrito y reactiva el escáner de inmediato. Puedes escanear artículos tan rápido como puedas apuntar con la cámara.',
      },
    ],
  },

  'pos-processing-a-sale': {
    title: 'Procesar una venta: del escaneo al recibo en menos de 60 segundos',
    description:
      'Recorre paso a paso el proceso de cobro completo de AskBiz POS: escaneo, revisión del carrito, pago y recibo.',
    keywords: [
      'procesar una venta POS',
      'proceso de cobro POS',
      'del escaneo al recibo',
      'proceso de venta AskBiz',
      'velocidad de cobro en retail',
      'pasos de una transacción POS',
    ],
    keyTakeaways: [
      'Una venta completa en AskBiz POS tarda menos de sesenta segundos, desde el primer escaneo hasta la entrega del recibo.',
      'El proceso de cobro tiene cuatro pasos: escanear, revisar el carrito, aceptar el pago y emitir el recibo.',
      'Cada venta actualiza automáticamente el inventario, el seguimiento de ingresos y las métricas de rendimiento del personal.',
    ],
    content: [
      {
        heading: 'Paso 1 — Escanea o busca los artículos',
        body: 'La venta comienza en el momento en que el cliente pone los artículos sobre el mostrador. Toca el botón de escaneo para activar la cámara y apúntala al primer código de barras. El producto aparece en el carrito en menos de un segundo, mostrando su nombre, precio y estado del IVA. Para artículos sin código de barras, toca el icono de búsqueda y escribe las primeras letras del nombre del producto: AskBiz usa coincidencia aproximada, así que no hace falta escribirlo perfectamente. Si un cliente quiere varias unidades del mismo artículo, puedes escanear el código repetidamente o tocar el campo de cantidad en el carrito y escribir el número directamente. Ambos métodos son rápidos, pero para cantidades grandes (digamos, veinte unidades del mismo artículo), escribir el número es más rápido. Puedes combinar escaneo y búsqueda dentro de la misma transacción; no hay que cambiar de modo.',
      },
      {
        heading: 'Paso 2 — Revisa y ajusta el carrito',
        body: 'Antes de aceptar el pago, tú y el cliente pueden revisar el carrito. AskBiz muestra cada artículo con su nombre, precio unitario, cantidad y total de línea. El total acumulado y el desglose del IVA aparecen en la parte inferior de la pantalla. Si el cliente cambia de opinión, desliza un artículo para eliminarlo o toca la cantidad para ajustarla. ¿Necesitas aplicar un descuento? Toca el botón de descuento para introducir un porcentaje o un importe fijo; se aplica a todo el carrito o a artículos individuales, como prefieras. El carrito también es donde añadirías una nota a la transacción (por ejemplo, «el cliente pidió envoltorio de regalo») o vincularías la venta a la ficha de un cliente existente para el seguimiento de fidelización. Este paso de revisión toma solo unos segundos para una cesta típica de tres a cinco artículos, pero evita errores que después requerirían un reembolso.',
      },
      {
        heading: 'Paso 3 — Acepta el pago',
        body: 'Toca el botón Pagar y AskBiz te muestra las opciones de pago. Las más comunes son efectivo y tarjeta, pero también puedes dividir un pago entre varios métodos; por ejemplo, el cliente paga parte en efectivo y el resto con tarjeta. Para pagos en efectivo, introduce el importe entregado y AskBiz calcula el cambio. Para pagos con tarjeta, procesa la transacción en tu datáfono como de costumbre y luego confirma en AskBiz que el pago se recibió. AskBiz no sustituye a tu datáfono: registra el método de pago junto a la transacción para tus registros. Si usas un procesador de tarjetas que se integra con AskBiz (cada vez son más los procesadores del Reino Unido compatibles), la confirmación puede ser automática. Lo importante es que AskBiz necesita saber el método de pago para que tus informes reflejen con precisión la proporción entre efectivo y tarjeta.',
      },
      {
        heading: 'Paso 4 — Emite el recibo',
        body: 'Una vez confirmado el pago, AskBiz genera un recibo. Tienes tres opciones de entrega. Primero, puedes mostrarlo en pantalla: el cliente ve la lista detallada y el total en tu dispositivo, lo que funciona bien para transacciones rápidas donde no hace falta un registro en papel. Segundo, puedes imprimirlo con una impresora de recibos Bluetooth conectada. Tercero —y esta es la opción que más le gusta a la mayoría de los usuarios de AskBiz—, puedes enviar el recibo directamente al WhatsApp del cliente. Solo introduce su número de teléfono (o selecciónalo de tu lista de clientes) y el recibo llega como un mensaje de WhatsApp con formato en cuestión de segundos. Los recibos digitales reducen el desperdicio de papel, le dan al cliente un registro permanente que no puede perder, y crean una oportunidad para futuras interacciones. Después de emitir el recibo, el carrito se vacía y AskBiz queda listo para el siguiente cliente.',
      },
    ],
    faq: [
      {
        q: '¿Puedo procesar una venta sin escanear un código de barras?',
        a: 'Sí. Puedes buscar productos por nombre, explorar tu catálogo por categoría o añadir un artículo personalizado con un precio manual. El escaneo de código de barras es el método más rápido, pero no es el único.',
      },
      {
        q: '¿Qué pasa si se corta mi internet a mitad de una venta?',
        a: 'AskBiz POS tiene capacidad para funcionar sin conexión. La venta se completa localmente y se sincroniza con la nube cuando vuelve tu conexión. No perderás la transacción.',
      },
    ],
  },

  'pos-cart-management': {
    title: 'Gestión del carrito: añadir, editar y eliminar artículos',
    description:
      'Domina el carrito de AskBiz POS: añade artículos, ajusta cantidades, aplica descuentos y gestiona los cambios del cliente sin frenar la fila.',
    keywords: [
      'gestión del carrito POS',
      'editar carrito POS',
      'añadir artículos POS',
      'eliminar artículos del carrito',
      'descuento POS',
      'edición del carrito en retail',
      'modificar artículos de una venta',
    ],
    keyTakeaways: [
      'El carrito de AskBiz POS se actualiza en tiempo real a medida que escaneas, buscas o añades productos manualmente.',
      'Puedes ajustar cantidades, eliminar artículos y aplicar descuentos en cualquier momento antes del pago.',
      'Los cambios en el carrito se reflejan al instante en el total acumulado y en el cálculo del IVA.',
    ],
    content: [
      {
        heading: 'Cómo añadir artículos al carrito',
        body: 'Hay tres formas de añadir artículos en AskBiz POS. La más rápida es el escaneo de código de barras: toca el botón de escaneo, apunta con la cámara y el producto aparece en el carrito. La segunda es buscar por nombre con la barra de búsqueda en la parte superior de la pantalla de venta. AskBiz usa coincidencia aproximada, así que escribir «choc» mostrará «Brownie de Chocolate», «Sobre de Chocolate Caliente» y cualquier otro producto que contenga esas letras. La tercera es explorar tu catálogo de productos por categoría, útil cuando conoces la categoría pero no el nombre exacto. Cada vez que añades un artículo, aparece como una nueva línea en el carrito con su nombre, precio unitario y cantidad fijada en uno. Si escaneas un artículo que ya está en el carrito, la cantidad aumenta automáticamente en lugar de crear una línea duplicada. El carrito se desplaza con fluidez si tienes una lista larga, y el total se actualiza al instante con cada adición.',
      },
      {
        heading: 'Cómo editar cantidades y precios',
        body: 'Los clientes cambian de opinión. Quieren tres de algo en lugar de uno, o al final deciden que no quieren las papas fritas. En AskBiz POS, toca el campo de cantidad junto a cualquier artículo y escribe el nuevo número directamente; no hace falta pulsar un botón de más repetidamente. Para eliminar un solo artículo, desliza la línea hacia la izquierda y toca Eliminar, o pon la cantidad en cero. Si necesitas modificar un precio (por ejemplo, un artículo dañado que se vende con descuento), toca el campo de precio e introduce el nuevo importe. Las modificaciones de precio quedan registradas en el historial de auditoría para que puedas revisarlas después y asegurarte de que son legítimas. Todos estos cambios ocurren en tiempo real: el total acumulado, el desglose del IVA y el número de artículos se actualizan en el momento en que haces un cambio, de modo que el cliente siempre ve una cifra exacta.',
      },
      {
        heading: 'Cómo aplicar descuentos',
        body: 'AskBiz POS admite dos tipos de descuento: por porcentaje y por importe fijo. Un descuento por porcentaje reduce el precio en una proporción determinada, por ejemplo, un 10% menos. Un descuento por importe fijo reduce el precio en una cifra concreta, digamos, £2 menos. Puedes aplicar descuentos a artículos individuales o a todo el carrito. Para aplicar un descuento a nivel de artículo, toca el artículo en el carrito y selecciona Descuento. Para aplicar un descuento a nivel de carrito, toca el botón de descuento debajo del total del carrito. Los descuentos se muestran claramente en el recibo para que el cliente vea cuánto se ahorró, y quedan registrados en tus datos de ventas para que puedas analizar cuánto estás descontando y si eso impulsa un mayor volumen. Si realizas promociones habituales (como «compra dos, llévate un 10% de descuento»), puedes crear plantillas de descuento reutilizables para que tu personal no tenga que calcular porcentajes al momento.',
      },
      {
        heading: 'Cómo gestionar situaciones complejas del carrito',
        body: 'El día a día del comercio plantea situaciones que un carrito básico no maneja bien. Un cliente quiere dividir su compra en dos transacciones, quizás una pagada con dinero personal y otra con una tarjeta de la empresa. En AskBiz, puedes aparcar el carrito actual (guardarlo temporalmente), iniciar una nueva transacción y volver al carrito aparcado después. Otro escenario habitual es un cliente que, a mitad del cobro, se da cuenta de que olvidó un artículo y corre a buscarlo al estante. No hace falta cancelar la transacción: el carrito espera pacientemente mientras lo busca, y lo añades cuando vuelve. Si necesitas añadir una nota a la transacción (por ejemplo, «el cliente pidió el recibo con IVA por correo electrónico»), toca el campo de Notas en la parte inferior del carrito. Las notas quedan guardadas junto a la transacción y son visibles en tu historial de auditoría e informes.',
      },
    ],
    faq: [
      {
        q: '¿Puedo guardar un carrito y volver a él más tarde?',
        a: 'Sí. AskBiz POS tiene una función para «aparcar el carrito» que guarda la transacción actual. Puedes iniciar una nueva venta y volver al carrito aparcado cuando estés listo. Es útil para clientes que necesitan alejarse un momento.',
      },
      {
        q: '¿Hay un límite de artículos que puedo añadir a un carrito?',
        a: 'No hay un límite práctico. El carrito admite cientos de líneas de artículos, aunque la mayoría de las transacciones en retail tienen menos de veinte.',
      },
    ],
  },

  'pos-cash-vs-card-payments': {
    title: 'Efectivo vs. tarjeta: cómo elegir la combinación adecuada para tu negocio',
    description:
      '¿Deberías dejar de aceptar efectivo? ¿Aceptar ambos? Así es como puedes pensar en los métodos de pago, las comisiones de procesamiento y lo que tus clientes realmente prefieren.',
    keywords: [
      'efectivo vs. tarjeta',
      'métodos de pago en retail',
      'comisiones de tarjeta en el Reino Unido',
      'negocio sin efectivo',
      'aceptar pagos con tarjeta',
      'combinación de métodos de pago',
      'pagos sin contacto en el Reino Unido',
    ],
    keyTakeaways: [
      'Los pagos con tarjeta representan hoy más del 80% de las transacciones minoristas en el Reino Unido, pero el efectivo sigue siendo importante para ciertos grupos de clientes.',
      'Las comisiones de procesamiento de tarjetas suelen ir del 1.2% al 2.5% por transacción: tenlo en cuenta al fijar tus precios.',
      'AskBiz POS registra tu proporción entre efectivo y tarjeta para que puedas tomar decisiones basadas en datos sobre tus métodos de pago.',
    ],
    content: [
      {
        heading: 'El panorama de pagos en el Reino Unido en 2026',
        body: 'El Reino Unido se ha decantado decididamente por los pagos con tarjeta y sin contacto. Según datos de UK Finance, las tarjetas de débito superaron al efectivo como método de pago más común en 2017, y la brecha se ha ampliado cada año desde entonces. El pago sin contacto por sí solo representa hoy la mayoría de las transacciones con tarjeta, con el límite por transacción elevado a £100 en 2021 y ampliamente adoptado desde entonces. Las billeteras móviles —Apple Pay, Google Pay y Samsung Pay— han añadido otra capa, permitiendo a los clientes pagar con el teléfono o el reloj. Para la mayoría de los comercios urbanos, dejar de aceptar efectivo por completo ya es viable. Sin embargo, aproximadamente uno de cada diez adultos del Reino Unido todavía depende principalmente del efectivo, y esta proporción es mayor entre los clientes de más edad, quienes no tienen cuenta bancaria y en ciertas zonas rurales. Si tu clientela incluye a estos grupos, rechazar el efectivo significa rechazar ingresos.',
      },
      {
        heading: 'Cómo entender las comisiones de procesamiento de tarjetas',
        body: 'Cada transacción con tarjeta te cuesta dinero. Un pago con tarjeta involucra al menos a tres partes además de ti y el cliente: la red de la tarjeta (Visa, Mastercard), el banco emisor (el banco del cliente) y el banco adquirente o procesador de pagos (tu proveedor de servicios). Cada uno se queda con una pequeña parte. Para un pequeño negocio típico del Reino Unido, espera pagar entre un 1.2% y un 2.5% por transacción, según tu procesador, tu volumen y el tipo de tarjeta usada. Las tarjetas premium y corporativas generan comisiones de intercambio más altas que las tarjetas de débito estándar. Algunos procesadores cobran una tarifa fija por transacción además del porcentaje. En transacciones de bajo valor (menos de £5), las comisiones pueden consumir una parte importante de tu margen, razón por la cual algunas cafeterías pequeñas todavía prefieren el efectivo para compras pequeñas. AskBiz POS registra el método de pago de cada transacción, permitiéndote calcular exactamente cuánto pagas en comisiones de procesamiento cada mes.',
      },
      {
        heading: 'Los argumentos a favor de dejar de aceptar efectivo',
        body: 'El efectivo tiene costos ocultos que muchos dueños de pequeños negocios subestiman. Contar la caja lleva tiempo al inicio y al final de cada turno. Los errores en el manejo de efectivo generan discrepancias difíciles de rastrear. Los viajes al banco para hacer depósitos consumen tiempo y suponen un riesgo de seguridad. El efectivo también es más difícil de conciliar para fines fiscales: HMRC presta más atención a los negocios que manejan mucho efectivo, precisamente porque es más difícil de rastrear. Dejar de aceptar efectivo elimina todos estos problemas. Tu caja siempre cuadra hasta el último centavo porque cada transacción tiene un registro digital. La conciliación es automática. El riesgo de robo baja porque no hay nada físico que robar. Y tu contador tiene un rastro digital perfecto de cada venta. La contrapartida es la comisión de procesamiento en cada transacción, pero muchos negocios encuentran que el ahorro de tiempo y riesgo compensa el costo.',
      },
      {
        heading: 'Cómo encontrar la combinación adecuada para tu negocio',
        body: 'El mejor enfoque para la mayoría de los pequeños negocios del Reino Unido es aceptar tanto efectivo como tarjeta, pero optimizar según lo que prefieran tus clientes. AskBiz POS te da los datos para tomar esta decisión. Después de un mes de actividad, revisa el desglose de métodos de pago en la sección de informes. Si el 90% de tus ventas son con tarjeta, quizás la infraestructura y el tiempo que dedicas al manejo de efectivo ya no se justifiquen. Si el 30% de tus ventas son en efectivo —tal vez porque atiendes a un mercado donde muchos clientes lo prefieren—, eliminarlo significaría perder casi un tercio de tus ingresos. Algunos negocios adoptan un enfoque híbrido: aceptan ambos métodos, pero ofrecen un pequeño incentivo (como un sello de fidelidad) por los pagos con tarjeta, cambiando gradualmente el comportamiento sin alejar a los clientes que pagan en efectivo. Decidas lo que decidas, deja tu política clara con carteles en el punto de venta para que los clientes sepan qué esperar antes de llegar al mostrador.',
      },
    ],
    faq: [
      {
        q: '¿Puedo establecer un gasto mínimo para pagos con tarjeta?',
        a: 'Legalmente, puedes establecer un importe mínimo de transacción para pagos con tarjeta en el Reino Unido. Sin embargo, esto puede frustrar a los clientes y podría no cumplir con los términos de tu procesador de tarjetas. Revisa tu contrato de comerciante antes de implementarlo.',
      },
      {
        q: '¿AskBiz POS se integra con mi datáfono?',
        a: 'AskBiz POS registra el método de pago junto con la venta. Para algunos procesadores de tarjetas, esto puede ser automático. Para otros, confirmas el método manualmente después de que el datáfono apruebe el pago. Consulta la página de integraciones para tu proveedor específico.',
      },
    ],
  },

  'pos-whatsapp-receipts': {
    title: 'Recibos por WhatsApp: envía comprobantes de compra digitales al instante',
    description:
      'Sustituye los recibos de papel por mensajes de WhatsApp. Descubre cómo AskBiz POS envía recibos digitales con formato directamente al teléfono de tu cliente.',
    keywords: [
      'recibos por WhatsApp',
      'recibos digitales POS',
      'enviar recibo por WhatsApp',
      'recibos sin papel',
      'recibo AskBiz',
      'recibo electrónico Reino Unido',
      'comprobante de compra digital',
    ],
    keyTakeaways: [
      'AskBiz POS puede enviar un recibo completamente detallado a cualquier número de WhatsApp en segundos.',
      'Los recibos digitales reducen el desperdicio de papel, no se pueden perder y crean un canal de comunicación con el cliente.',
      'Los clientes no necesitan instalar nada: el recibo llega como un mensaje de WhatsApp normal.',
    ],
    content: [
      {
        heading: 'Cómo funcionan los recibos por WhatsApp en AskBiz POS',
        body: 'Una vez completada la venta, AskBiz te da la opción de enviar el recibo por WhatsApp. Toca el icono de WhatsApp, introduce el número de teléfono del cliente (o selecciónalo de tu lista de clientes si ya está guardado), y AskBiz redacta un mensaje con formato que contiene el recibo completo: fecha, hora, nombre del negocio, cada artículo con su precio y cantidad, descuentos aplicados, desglose del IVA, total pagado y método de pago. El mensaje se envía mediante el protocolo de compartir de WhatsApp, que abre WhatsApp en tu dispositivo con el mensaje ya redactado. Un solo toque lo envía. Todo el proceso añade unos cinco segundos a la transacción, mucho menos tiempo que forcejear con una impresora de recibos. Como usa la mensajería estándar de WhatsApp, el cliente no necesita instalar ninguna app especial, crear una cuenta ni escanear un código QR. Si tiene WhatsApp —y más del 75% de los adultos del Reino Unido lo tiene—, simplemente funciona.',
      },
      {
        heading: 'Por qué los recibos digitales son mejores para tus clientes',
        body: 'Los recibos de papel tienen la costumbre de terminar en la lavadora, en la basura o en el fondo de un bolso, donde se desvanecen hasta volverse ilegibles. Un recibo digital vive de forma permanente en el chat de WhatsApp del cliente. Si necesita devolver un artículo tres semanas después, puede buscar en sus mensajes y encontrar el recibo en segundos. Esto también reduce las disputas de tu lado: pasas menos tiempo tratando de verificar compras cuando el cliente ya tiene una prueba clara. Los recibos digitales también dan una sensación más moderna y profesional. Para un pequeño negocio independiente, enviar un recibo de WhatsApp bien presentado transmite que te tomas en serio tu negocio y usas sistemas adecuados. Es un detalle pequeño, pero los clientes lo notan. Algunos usuarios de AskBiz cuentan que el recibo por WhatsApp se ha convertido en tema de conversación con sus clientes: a la gente le gusta la comodidad y pregunta cómo funciona.',
      },
      {
        heading: 'Beneficios para tu negocio',
        body: 'Más allá de la comodidad para el cliente, los recibos digitales te ahorran dinero y generan datos. Los rollos de papel para la impresora de recibos son un costo recurrente que se acumula con miles de transacciones. El papel térmico no es reciclable en la mayoría de los programas municipales del Reino Unido, así que también hay un aspecto medioambiental. Más importante aún, cuando un cliente proporciona su número de teléfono para un recibo por WhatsApp, tienes un canal de comunicación. Puedes hacer seguimiento con un mensaje de agradecimiento, avisarle de promociones o enviarle alertas de reabastecimiento de artículos que compró antes, todo dentro de las pautas de mensajería empresarial de WhatsApp. AskBiz registra a qué clientes se les han enviado recibos por WhatsApp y vincula esos recibos a su historial de transacciones, construyendo con el tiempo un perfil de cliente más completo. Estos datos alimentan tu inteligencia de clientes, ayudándote a entender patrones y preferencias de compra.',
      },
      {
        heading: 'Cómo configurar los recibos por WhatsApp',
        body: 'La configuración necesaria es mínima. En Configuración del POS, activa Recibos por WhatsApp y personaliza la plantilla del recibo con el nombre de tu negocio, la dirección y cualquier mensaje de pie de página que quieras incluir (como tu política de devoluciones o una nota de agradecimiento). También puedes añadir tu logo, que aparecerá en la parte superior del recibo. Al procesar una venta, la opción de WhatsApp aparece junto a los demás métodos de entrega del recibo. Si prefieres que WhatsApp sea la opción predeterminada, puedes configurarlo en las preferencias: el aviso de envío usará WhatsApp por defecto en lugar de la impresión. Para clientes recurrentes, AskBiz recuerda su número de teléfono, así que solo hace falta introducirlo una vez. El personal de todos los niveles de rol (Cajero, Gerente, Propietario) puede enviar recibos por WhatsApp, ya que se considera parte del proceso básico de venta.',
      },
    ],
    faq: [
      {
        q: '¿Enviar recibos por WhatsApp tiene algún costo?',
        a: 'AskBiz no cobra nada por esto. Se aplican las tarifas estándar de mensajería de WhatsApp, que son gratuitas para la mayoría de los usuarios con Wi-Fi o planes de datos incluidos. No hace falta la API de WhatsApp Business.',
      },
      {
        q: '¿Los clientes pueden rechazar los recibos por WhatsApp?',
        a: 'Por supuesto. El recibo por WhatsApp siempre es opcional. Si un cliente no quiere un recibo digital, puedes imprimir uno, mostrarlo en pantalla u omitir el recibo por completo.',
      },
      {
        q: '¿Enviar un recibo por WhatsApp cumple con el RGPD?',
        a: 'Sí, siempre que tengas una base legítima para procesar los datos. Enviar un recibo forma parte de completar la transacción de venta. Deberías incluir un aviso de privacidad en tu negocio o en tu sitio web explicando cómo se usan los datos de los clientes.',
      },
    ],
  },

  'pos-daily-revenue-tracking': {
    title: 'Seguimiento de ingresos diarios: conoce tus números antes del mediodía',
    description:
      'Deja de adivinar cuánto has ganado hoy. AskBiz POS te da cifras de ingresos diarios en vivo, desgloses de efectivo frente a tarjeta y comparativas de tendencias.',
    keywords: [
      'seguimiento de ingresos diarios',
      'informe de ingresos POS',
      'informe de ventas diarias',
      'seguimiento de ingresos en retail',
      'caja diaria POS',
      'panel de ventas POS',
      'seguimiento de ventas diarias',
    ],
    keyTakeaways: [
      'AskBiz POS muestra los ingresos diarios en vivo desde el momento en que procesas la primera venta del día.',
      'Los ingresos se desglosan por método de pago, miembro del personal y categoría de producto.',
      'Comparar el desempeño de hoy con el mismo día de la semana pasada te ayuda a detectar tendencias a tiempo.',
    ],
    content: [
      {
        heading: 'Por qué importa ver los ingresos día a día',
        body: 'En el comercio tradicional, muchos dueños de tiendas no saben cuáles son sus ingresos reales del día hasta que se cuenta la caja al cierre. Eso son doce horas de actividad a ciegas. Con AskBiz POS, los ingresos se actualizan en tiempo real después de cada transacción. A media mañana, ya sabes si el día va por delante o por detrás de tu promedio. Al mediodía, tienes suficientes datos para tomar decisiones: ¿deberías lanzar una promoción por la tarde? ¿Retirar de la vitrina un producto que se vende poco? ¿Ajustar el personal para el resto del turno? Este tipo de visibilidad durante el día solía estar reservado para cadenas comerciales con costosas plataformas de análisis. AskBiz lo pone en tu teléfono. La pantalla de ingresos diarios está a un toque de la interfaz de venta, así que revisar tus números toma segundos, no minutos.',
      },
      {
        heading: 'Qué muestra la pantalla de ingresos diarios',
        body: 'La pantalla de ingresos diarios de AskBiz POS muestra un total acumulado de todas las ventas procesadas hoy, desglosado por método de pago (efectivo, tarjeta o mixto). Debajo del total, ves un desglose por categoría de producto, así puedes ver de un vistazo que las bebidas calientes se venden el doble que las frías, o que los accesorios están teniendo un día flojo. También hay un desglose por miembro del personal, algo muy valioso si tienes a varias personas en la caja. La pantalla incluye una comparación con el mismo día de la semana pasada y el mismo día del mes pasado. Si hoy es martes, ves los ingresos del martes anterior junto a la cifra de hoy, lo que te da contexto inmediato. Una flecha verde significa que vas por delante; una flecha roja, que vas por detrás. En la parte inferior, AskBiz muestra el valor promedio de transacción y el número total de transacciones, lo que te ayuda a distinguir entre unas pocas ventas grandes y muchas pequeñas.',
      },
      {
        heading: 'Cómo usar los datos diarios para tomar mejores decisiones',
        body: 'El verdadero poder del seguimiento de ingresos diarios no está solo en conocer la cifra, sino en actuar en consecuencia. Aquí van algunos ejemplos prácticos. Si tus ingresos a las 11 de la mañana están un 40% por debajo de la misma hora de la semana pasada, algo ha cambiado. ¿Bajó la afluencia de clientes? ¿Abrió un competidor cerca? ¿El clima está manteniendo a la gente en casa? Puedes investigar y responder. Si tu proporción de tarjeta frente a efectivo cambió drásticamente, quizás tengas un problema con el datáfono que vale la pena revisar. Si un miembro del personal genera de forma constante valores promedio de transacción más altos, puedes aprender qué está haciendo diferente y capacitar a los demás para que hagan lo mismo. AskBiz identifica estos patrones automáticamente mediante su motor de análisis, pero incluso un vistazo rápido a la pantalla de ingresos diarios te dirá más sobre la salud de tu negocio que esperar hasta fin de mes para revisar tus estados de cuenta bancarios.',
      },
      {
        heading: 'Resumen e informes de fin de día',
        body: 'Al final del día de actividad —o cuando decidas cerrar la caja—, AskBiz genera un resumen completo de fin de día. Incluye ingresos totales, número de transacciones, valor promedio de transacción, desglose por método de pago, ingresos por categoría, ingresos por miembro del personal, reembolsos procesados y descuentos otorgados. Puedes ver este resumen en pantalla, enviártelo por correo electrónico o exportarlo como CSV para tu contador. Si administras el efectivo de tu caja, AskBiz puede comparar el importe de efectivo esperado (según las transacciones en efectivo procesadas) con tu conteo real para detectar cualquier discrepancia. Este proceso de arqueo de caja toma minutos, en lugar de la media hora que muchos comercios dedican a cuadrar manualmente los recibos con el contenido de la caja. Con el tiempo, los resúmenes diarios alimentan informes de tendencias semanales y mensuales, dándote una imagen cada vez más clara de la trayectoria de tu negocio.',
      },
    ],
    faq: [
      {
        q: '¿Puedo consultar los ingresos diarios desde mi teléfono estando fuera del negocio?',
        a: 'Sí. AskBiz funciona en la nube, así que puedes ver los ingresos en vivo desde cualquier dispositivo con tu inicio de sesión. Muchos propietarios revisan los números desde casa por la noche.',
      },
      {
        q: '¿Los ingresos diarios incluyen los reembolsos?',
        a: 'Los reembolsos se descuentan del total diario para mostrar los ingresos netos. También puedes ver los ingresos brutos y el total de reembolsos por separado en el desglose detallado.',
      },
    ],
  },

  'pos-inventory-management': {
    title: 'Gestión de inventario en el POS: niveles de stock, alertas y reabastecimiento',
    description:
      'Mantén tus estantes llenos y tu flujo de caja saludable. Descubre cómo AskBiz POS controla el inventario en tiempo real y te dice exactamente cuándo reabastecer.',
    keywords: [
      'gestión de inventario POS',
      'control de stock POS',
      'alertas de inventario',
      'gestión de stock en retail',
      'alertas de reabastecimiento',
      'niveles de stock en tiempo real',
      'control de inventario para pequeños negocios',
    ],
    keyTakeaways: [
      'AskBiz POS descuenta el stock automáticamente con cada venta, manteniendo tu conteo de inventario exacto en tiempo real.',
      'Puedes fijar puntos de reorden para cada producto, de modo que AskBiz te avise antes de que se te agote.',
      'Un inventario preciso te ayuda a evitar tanto los quiebres de stock (ventas perdidas) como el exceso de existencias (dinero inmovilizado).',
    ],
    content: [
      {
        heading: 'Cómo funciona el control de inventario en tiempo real',
        body: 'Cada vez que procesas una venta en AskBiz POS, los artículos vendidos se descuentan automáticamente de tu conteo de inventario. No hay ningún paso manual: en el momento en que se confirma la transacción, los niveles de stock se actualizan. Si vendes tres unidades del Producto A, tu conteo de stock baja en tres. Si se procesa un reembolso y el artículo vuelve al stock, el conteo sube. Esto ocurre simultáneamente en todos los dispositivos, así que si tienes a dos personas vendiendo en tablets distintas, ambas ven los mismos niveles de stock actualizados. La precisión que esto ofrece es transformadora para los pequeños comercios que tradicionalmente dependían de conteos periódicos de inventario. En lugar de descubrir que te quedaste sin tu producto más vendido hace tres días (y perder un número desconocido de ventas), sabes en el momento exacto en que el stock llega a cero. Y mejor aún, puedes configurar alertas para que te avisen antes de que eso ocurra.',
      },
      {
        heading: 'Cómo configurar puntos de reorden y alertas',
        body: 'Un punto de reorden es el nivel de stock en el que deberías hacer un nuevo pedido a tu proveedor. El nivel adecuado depende de la rapidez con la que se vende el artículo y del tiempo que tarda tu proveedor en entregarlo. Por ejemplo, si vendes diez unidades del Producto B por semana y tu proveedor tarda dos semanas en entregar, tu punto de reorden debería ser de al menos veinte unidades: veinte unidades de stock de reserva para cubrir el tiempo de entrega. En AskBiz, defines el punto de reorden de cada producto en la configuración de inventario. Cuando el stock baja a ese nivel, recibes una alerta, ya sea dentro de la app, por correo electrónico, o ambas. También puedes fijar un nivel crítico (el punto en el que estás a punto de quedarte sin existencias) para una notificación más urgente. AskBiz puede sugerir puntos de reorden basándose en tu histórico de velocidad de ventas, quitándole a este cálculo cualquier margen de adivinación.',
      },
      {
        heading: 'Cómo recibir stock y hacer ajustes',
        body: 'Cuando llega una nueva entrega de tu proveedor, necesitas añadir esos artículos a tu inventario. En AskBiz, ve a la sección de Inventario, busca el producto y toca Recibir stock. Introduce la cantidad recibida y el precio de costo (si ha cambiado). El conteo de stock se actualiza de inmediato. Si detectas una discrepancia durante un conteo físico de inventario —quizás algunos artículos se dañaron, fueron robados o se contaron mal—, puedes hacer un ajuste manual de stock. Introduce el motivo del ajuste (daño, robo, error de conteo) y AskBiz registra el cambio en el historial de auditoría. Estos ajustes son importantes para mantener la precisión y para identificar patrones: si un producto en particular tiene pérdidas de stock inexplicables de forma habitual, puede indicar un problema de robo o de empaque que causa daños.',
      },
      {
        heading: 'Cómo usar los datos de inventario para mejorar el flujo de caja',
        body: 'El stock es dinero que está sobre tus estantes. Cada producto que tienes pero no has vendido representa dinero que podría estar generando intereses, pagando deudas o financiando el crecimiento. AskBiz te ayuda a encontrar el equilibrio entre tener suficiente stock para satisfacer la demanda y no inmovilizar demasiado dinero. El panel de inventario te muestra las tasas de rotación (qué tan rápido se vende cada producto), los días de stock restantes y el stock muerto (productos que no se han vendido en treinta días o más). Si un producto tiene noventa días de stock restante según la velocidad de venta actual, casi con toda seguridad pediste de más. Si otro producto tiene tres días de stock restante, necesitas reabastecerlo con urgencia. AskBiz muestra ambos extremos para que puedas actuar: rebaja los productos que se venden poco para liberar dinero, y acelera los pedidos de tus artículos más vendidos.',
      },
    ],
    faq: [
      {
        q: '¿Puedo gestionar el inventario de productos sin código de barras?',
        a: 'Sí. Todo producto en AskBiz tiene un conteo de inventario, tenga o no código de barras. Puedes controlar el stock tanto de artículos con código de barras como de artículos introducidos manualmente y productos personalizados.',
      },
      {
        q: '¿AskBiz admite inventario en varias ubicaciones?',
        a: 'El inventario multiubicación está en la hoja de ruta. Por ahora, el stock se controla a nivel de cuenta. Si operas en varios locales, puedes usar catálogos de productos separados o añadir etiquetas de ubicación a los nombres de los productos como solución provisional.',
      },
    ],
  },

  'pos-low-stock-alerts': {
    title: 'Alertas de stock bajo y sin existencias: no te pierdas ningún reabastecimiento',
    description:
      'Configura notificaciones automáticas cuando el stock esté bajo. AskBiz POS te avisa antes de que se agoten tus productos más vendidos.',
    keywords: [
      'alertas de stock bajo',
      'notificación de sin existencias',
      'alerta de reabastecimiento POS',
      'sistema de alertas de inventario',
      'aviso de nivel de stock',
      'notificación de reorden',
      'nunca te quedes sin stock',
    ],
    keyTakeaways: [
      'AskBiz POS envía alertas cuando el stock llega a tu punto de reorden predefinido o llega a cero.',
      'Las alertas pueden llegar dentro de la app, por correo electrónico, o ambas, asegurando que nunca te pierdas un reabastecimiento crítico.',
      'Reabastecer a tiempo evita ventas perdidas y mantiene alta la satisfacción del cliente.',
    ],
    content: [
      {
        heading: 'El costo de quedarte sin stock',
        body: 'Un quiebre de stock no es solo una venta perdida, es una relación perdida. Cuando un cliente entra a tu tienda buscando un producto específico y no lo tienes, lo compra en otro lugar. Si sucede dos veces, deja de venir por completo. Las investigaciones muestran de forma constante que los quiebres de stock son una de las principales razones por las que los clientes cambian a la competencia en el comercio físico. Más allá de la pérdida directa de ingresos, está el costo reputacional: tu tienda parece mal gestionada si los estantes están vacíos. AskBiz POS está diseñado para prevenir esto, dándote visibilidad de los niveles de stock y avisándote mucho antes de llegar a cero. El objetivo es simple: ningún cliente debería oír «lo siento, no nos queda de eso» si un pedido a tiempo lo hubiera podido evitar.',
      },
      {
        heading: 'Cómo funcionan las alertas en AskBiz POS',
        body: 'AskBiz usa un sistema de alertas de dos niveles. El primer nivel es la alerta de reorden, que se activa cuando el stock baja hasta el punto de reorden que fijaste para ese producto. Esta es tu señal para hacer un pedido a tu proveedor. El punto de reorden debe tener en cuenta el tiempo de entrega de tu proveedor: si la entrega tarda cinco días y vendes dos unidades al día, fija el punto de reorden en al menos diez. El segundo nivel es la alerta crítica, que se activa cuando el stock baja a un nivel peligrosamente bajo (tú defines qué significa «peligrosamente bajo» para cada producto). Esta es tu señal de que estás a punto de quedarte sin existencias y necesitas acelerar un pedido o retirar el producto de la exhibición para reservar lo que queda para tus clientes clave. Ambas alertas se pueden enviar como notificaciones dentro de la app, por correo electrónico, o ambas. Los Propietarios y Gerentes reciben alertas por defecto; los Cajeros no, para evitar saturar de notificaciones al personal de primera línea.',
      },
      {
        heading: 'Sugerencias inteligentes de reorden',
        body: 'Fijar puntos de reorden manualmente para cada producto es tedioso, sobre todo si manejas cientos de referencias. AskBiz puede sugerir puntos de reorden basándose en tu historial de ventas. Analiza qué tan rápido se vende cada producto (la velocidad de venta), cómo cambia esa velocidad según el día de la semana o la temporada, y cuánto tardaron los reabastecimientos anteriores. Con estos datos, calcula un punto de reorden recomendado que equilibra el riesgo de quedarte sin stock con el costo de mantener un exceso de inventario. Puedes aceptar la sugerencia, ajustarla o fijar tu propio nivel. Para productos nuevos sin historial de ventas, AskBiz usa por defecto un punto de reorden conservador que puedes afinar a medida que se acumulan datos. Las sugerencias mejoran con el tiempo, a medida que AskBiz aprende tus patrones de venta y los tiempos de entrega de tus proveedores.',
      },
      {
        heading: 'Cómo actuar sobre las alertas de forma eficiente',
        body: 'Una alerta solo es útil si actúas sobre ella con rapidez. AskBiz facilita esto incluyendo contexto en cada alerta. Cuando recibes una notificación de stock bajo, te indica el nivel de stock actual, las ventas promedio diarias, los días estimados hasta el quiebre de stock y el último precio de costo del producto. Tienes suficiente información para hacer un pedido de inmediato sin necesidad de buscar nada más. Si usas los mismos proveedores con regularidad, puedes registrar sus contactos en AskBiz para que, al tocar «Reordenar» en una alerta, se redacte una orden de compra que puedas enviar directamente. Esto reduce el tiempo entre la alerta y el pedido de horas (o días, si la alerta se pierde en tu bandeja de entrada) a minutos. Cuantos menos pasos haya entre la notificación y la acción, menos quiebres de stock sufrirá tu negocio.',
      },
    ],
    faq: [
      {
        q: '¿Puedo fijar umbrales de alerta diferentes para distintos productos?',
        a: 'Sí. Cada producto tiene su propio punto de reorden y nivel crítico. Un producto de venta rápida podría tener un punto de reorden de cincuenta unidades, mientras que uno de venta lenta podría fijarse en cinco.',
      },
      {
        q: '¿Las alertas funcionan si no tengo la sesión iniciada en el POS?',
        a: 'Sí. Las alertas por correo electrónico se envían independientemente de si tienes la sesión iniciada. Las notificaciones dentro de la app aparecen la próxima vez que abras AskBiz.',
      },
      {
        q: '¿Puedo desactivar las alertas para productos específicos?',
        a: 'Sí. Si tienes artículos que dejas agotar a propósito (productos de temporada, por ejemplo), puedes desactivar las alertas para esos artículos individualmente.',
      },
    ],
  },

  'pos-refunds-guide': {
    title: 'Cómo gestionar reembolsos: totales, parciales y todo lo que hay en medio',
    description:
      'Los reembolsos son parte del día a día del comercio. Aprende a procesar reembolsos totales y parciales en AskBiz POS manteniendo tus registros en orden.',
    keywords: [
      'reembolsos POS',
      'procesar reembolso POS',
      'reembolso parcial en retail',
      'guía de reembolso total',
      'reembolso AskBiz',
      'devolución y reembolso POS',
      'derechos del consumidor reembolso Reino Unido',
    ],
    keyTakeaways: [
      'AskBiz POS admite reembolsos totales, parciales y por artículo, todos vinculados a la transacción original.',
      'Los permisos de reembolso están restringidos a los roles de Gerente y Propietario para evitar un mal uso.',
      'Cada reembolso queda registrado en el historial de auditoría con el motivo, el importe, el miembro del personal y la fecha y hora.',
    ],
    content: [
      {
        heading: 'Cómo entender tus obligaciones de reembolso en el Reino Unido',
        body: 'Antes de entrar en el funcionamiento, vale la pena entender tu situación legal. Según la Consumer Rights Act 2015 (Ley de Derechos del Consumidor), los clientes tienen derecho a un reembolso si un producto está defectuoso, no es como se describió o no es apto para su propósito. Para productos defectuosos, este derecho dura hasta treinta días para un reembolso total y hasta seis meses para una reparación o sustitución (con reembolso si esta falla). Para las devoluciones por cambio de opinión —cuando el producto está en buen estado pero el cliente simplemente cambió de idea— no tienes obligación legal de ofrecer un reembolso, aunque muchos comercios lo hacen como gesto de buena voluntad para fidelizar. AskBiz POS te permite procesar ambos tipos de reembolso, y puedes configurar tu política de reembolsos en los ajustes para que el personal conozca las reglas sin tener que consultar a un gerente cada vez.',
      },
      {
        heading: 'Cómo procesar un reembolso total',
        body: 'Para procesar un reembolso total en AskBiz POS, ve a la sección de Transacciones y busca la venta original. Puedes buscar por número de transacción, fecha, nombre del cliente o los artículos vendidos. Una vez que encuentres la transacción, toca Reembolsar. AskBiz te muestra todos los artículos de la venta original y te permite confirmar que estás reembolsando el importe completo. Selecciona el método de reembolso, idealmente el mismo que el del pago original (devolver el dinero a la misma tarjeta con la que se pagó es la mejor práctica y a menudo lo exige tu procesador de tarjetas). Añade un motivo para el reembolso (defecto, no deseado, cargo duplicado, etc.) y confirma. El importe del reembolso se descuenta de tus ingresos diarios, los artículos reembolsados vuelven a tu inventario (si corresponde), y toda la transacción —venta original y reembolso— queda vinculada en el historial de auditoría, dejando un rastro documental completo.',
      },
      {
        heading: 'Cómo procesar un reembolso parcial',
        body: 'Los reembolsos parciales son más comunes de lo que la mayoría espera. Un cliente devuelve un artículo de una compra de tres. Un producto tiene un defecto menor y acuerdas un descuento del 20% en lugar de una devolución completa. A un cliente se le cobró de más por un error de precio y necesita que le reembolsen la diferencia. AskBiz gestiona todos estos casos. Desde la transacción original, toca Reembolsar y selecciona solo los artículos (o el importe específico) a reembolsar. Para un reembolso a nivel de artículo, marca los artículos que se devuelven y AskBiz calcula el importe correcto, incluyendo cualquier ajuste del IVA. Para un reembolso de importe fijo (como un descuento de buena voluntad), introduce el importe manualmente. Los reembolsos parciales se registran con el mismo nivel de detalle que los totales: motivo, importe, miembro del personal, fecha y hora, y un enlace a la transacción original. Tu inventario solo se actualiza para los artículos que se devuelven físicamente; si estás reembolsando una diferencia de precio, los niveles de stock no cambian.',
      },
      {
        heading: 'Cómo prevenir el fraude de reembolsos',
        body: 'El fraude de reembolsos es una de las fuentes de pérdidas más comunes en el comercio. Incluye reembolsos ficticios (procesar un reembolso de una venta que nunca ocurrió), favoritismo interno (reembolsar la compra de un amigo para que se lleve el producto gratis) y fraude de devolución (devolver un producto usado o distinto). AskBiz POS mitiga estos riesgos de varias formas. Primero, los reembolsos deben estar vinculados a una transacción original: no se puede crear un reembolso independiente. Segundo, solo los Gerentes y Propietarios pueden procesar reembolsos; los Cajeros no, lo que elimina el vector de ataque más común. Tercero, cada reembolso queda registrado con la identidad del miembro del personal, la fecha y hora, el motivo y el importe, creando un elemento disuasorio y un historial de auditoría. Cuarto, AskBiz señala patrones de reembolso inusuales —como un número desproporcionado de reembolsos procesados por un mismo miembro del personal, o reembolsos que superan un porcentaje establecido de las ventas diarias— para que puedas investigar antes de que se acumulen las pérdidas.',
      },
    ],
    faq: [
      {
        q: '¿Un cajero puede procesar un reembolso?',
        a: 'No. Los reembolsos están restringidos a los roles de Gerente y Propietario. Si un cajero necesita procesar una devolución, debe llamar a un gerente para que autorice y complete el reembolso.',
      },
      {
        q: '¿Qué pasa si no encuentro la transacción original?',
        a: 'AskBiz te permite buscar por fecha, nombre del producto, número de transacción o datos del cliente. Si el cliente tiene un recibo por WhatsApp, puede mostrarte directamente el ID de la transacción.',
      },
    ],
  },

  'pos-transaction-amendments': {
    title: 'Modificaciones y correcciones de transacciones en AskBiz POS',
    description:
      '¿Cometiste un error en una venta? Así puedes modificar, corregir o anotar transacciones en AskBiz POS sin romper tu historial de auditoría.',
    keywords: [
      'modificación de transacción POS',
      'corregir venta POS',
      'anular transacción POS',
      'editar venta después del pago',
      'corrección POS',
      'modificar recibo',
      'corregir error de transacción',
    ],
    keyTakeaways: [
      'Las transacciones completadas en AskBiz POS no se pueden editar en silencio: todos los cambios crean una entrada visible en el historial de auditoría.',
      'Las correcciones más comunes son los reembolsos parciales, las anulaciones (dentro de un plazo limitado) y las notas de anotación.',
      'Este enfoque protege tus registros de cara al cumplimiento fiscal y a la prevención del fraude.',
    ],
    content: [
      {
        heading: 'Por qué las transacciones son inmutables',
        body: 'Una vez que se completa una venta en AskBiz POS, el registro de la transacción original no se puede alterar. Esto no es una limitación, es una característica. Las transacciones inmutables son la base de un historial de auditoría fiable. Si alguien pudiera editar en silencio una venta completada —cambiando el importe, eliminando un artículo o alterando el método de pago—, tus registros no serían fiables. HMRC espera que los negocios mantengan registros de transacciones precisos e infalsificables, y los requisitos de Making Tax Digital refuerzan esto. AskBiz aplica la inmutabilidad a nivel de base de datos, lo que significa que ni siquiera los administradores del sistema pueden modificar una transacción completada. En cambio, las correcciones se hacen creando nuevos registros vinculados: reembolsos, anulaciones y modificaciones que se colocan junto al original y muestran con claridad qué se cambió, cuándo y por quién.',
      },
      {
        heading: 'Cómo anular una transacción',
        body: 'Una anulación cancela una transacción por completo, como si nunca hubiera ocurrido. En AskBiz POS, la anulación solo está disponible dentro de un plazo breve después de completar la venta, normalmente unos minutos. Esto cubre el caso en el que un cajero confirma por error el pago de la transacción equivocada, o el cliente se da cuenta de inmediato de que tomó el artículo incorrecto. Para anular, ve a la transacción y toca Anular. Debes introducir un motivo (confirmación accidental, el cliente cambió de opinión, transacción duplicada). La anulación se procesa, los artículos vuelven al inventario, y tanto la transacción original como la anulación aparecen en el historial de auditoría. Una vez que se cierra el plazo de anulación, las correcciones se gestionan mediante el proceso de reembolso. Esta restricción de tiempo existe porque las anulaciones interactúan con las reversiones de pago con tarjeta: cuanto antes anules una transacción con tarjeta, más probable es que la reversión se procese como una anulación en lugar de un reembolso, lo cual es más rápido y más limpio para el estado de cuenta bancario del cliente.',
      },
      {
        heading: 'Cómo anotar una transacción',
        body: 'A veces una transacción no necesita una corrección financiera, solo una nota. Quizás el cliente mencionó que volverá más tarde a recoger el artículo. Quizás la venta incluyó un acuerdo verbal sobre un descuento futuro. Quizás hubo una circunstancia inusual que quieres dejar documentada para tus registros. AskBiz te permite añadir anotaciones a cualquier transacción completada. Toca la transacción, toca Añadir nota, y escribe tu anotación. La nota queda con fecha y hora, y atribuida al miembro del personal que la escribió. Las anotaciones no cambian el registro financiero: son información complementaria. Son visibles en la vista de detalle de la transacción y en el historial de auditoría, y se pueden buscar, lo cual es útil cuando un cliente llama semanas después y necesitas encontrar el contexto de su compra.',
      },
      {
        heading: 'Escenarios comunes de modificación y cómo gestionarlos',
        body: 'Precio incorrecto cobrado: procesa un reembolso parcial por la diferencia si cobraste de más, o anota el cobro insuficiente y ajusta el precio para futuras ventas. Producto incorrecto escaneado: anula la transacción si aún estás dentro del plazo de anulación; si no, reembolsa el artículo incorrecto y procesa una nueva venta con el correcto. Método de pago registrado incorrectamente: añade una anotación indicando el método de pago correcto. Esto no afecta tu cifra de ingresos, pero corrige tu desglose de métodos de pago para los informes. Disputa de un cliente: si un cliente afirma que le cobraron por un artículo que no recibió, revisa la transacción, comprueba las cámaras de seguridad relacionadas si están disponibles, y procesa un reembolso si el reclamo es válido. El historial de auditoría ofrece un registro claro si la disputa escala. En todos los casos, el principio es el mismo: nunca alteres el registro original. En su lugar, crea un nuevo registro (reembolso, anulación o anotación) que corrija la situación de forma transparente.',
      },
    ],
    faq: [
      {
        q: '¿Puedo cambiar el método de pago en una venta completada?',
        a: 'No puedes cambiar el método de pago en una transacción completada, pero puedes añadir una anotación indicando el método correcto. Para fines de informes, la anotación aporta la corrección.',
      },
      {
        q: '¿Cuánto tiempo tengo para anular una transacción?',
        a: 'El plazo de anulación es configurable, pero por defecto son unos minutos después de completar la venta. Después de eso, las correcciones se gestionan mediante el proceso de reembolso.',
      },
    ],
  },
}
