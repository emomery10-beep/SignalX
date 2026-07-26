// Academy article translations — Español (es) — Wave A, batch 4 (new articles).
//
// Articles: purchase-orders-guide-askbiz, connect-marketing-ads-sources-askbiz,
// connect-gocardless-askbiz, connect-linnworks-askbiz, connect-xero-freeagent-askbiz,
// connect-jumia-marketplace-askbiz, pos-receipt-design-vat-askbiz,
// whatsapp-daily-pl-brief-askbiz, forgot-pin-reset-whatsapp-askbiz,
// zakat-calculator-charity-askbiz, factory-sector-guide-askbiz,
// pos-free-trial-explained-askbiz.
//
// Translated fields only (title, description, keywords, content,
// keyTakeaways, faq) — see lib/academy-i18n/README.md for the contract.
// slug/category/categorySlug/difficulty/readTime/relatedSlugs/videoUrl are
// intentionally absent; those stay canonical/English from lib/academy-*.ts.
//
// Merge this into lib/academy-i18n/es/index.ts's `translations` export
// (spread alongside any other es batches) — not done here per instructions.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const waveABatch4NewArticlesTranslations: LocaleTranslations = {
  'purchase-orders-guide-askbiz': {
    title: 'Órdenes de compra: crea, envía y recibe pedidos a proveedores en AskBiz POS',
    description:
      'Cómo funciona en realidad el mosaico de Órdenes de compra en POS > Operaciones — armar un pedido con cantidades de reorden sugeridas automáticamente, enviarlo a tu proveedor por WhatsApp y recibir stock (incluidas entregas parciales) sin tocar una hoja de cálculo.',
    keywords: [
      'órdenes de compra',
      'pedidos a proveedores',
      'reabastecimiento',
      'punto de reorden',
      'POS',
      'AskBiz',
      'inventario',
      'pedido pendiente',
      'proveedor por WhatsApp',
      'recibir stock',
    ],
    keyTakeaways: [
      'Órdenes de compra vive en POS > Operaciones > Retail, y se abre desde el mosaico 📋 — es una pestaña dedicada, no una ventana emergente pegada a Inventario.',
      'Al crear un nuevo pedido, se rellenan automáticamente todos los productos en su punto de reorden o por debajo, con una cantidad sugerida que reabastece hasta el doble del umbral y usa el último costo registrado del producto. Puedes editar o eliminar cualquier línea, o agregar productos manualmente.',
      'Enviar una orden de compra manda un mensaje al número de WhatsApp de tu proveedor con el pedido detallado; si la plantilla automática no está disponible, se recurre a un enlace wa.me prellenado que tocas para enviar tú mismo. Un proveedor sin número de teléfono registrado no puede recibir el envío.',
      'Recibir stock se hace línea por línea, así que las entregas parciales son normales: un pedido pasa a "Parcial" en cuanto una línea queda incompleta, y solo cambia a "Recibido" cuando todas las líneas están completas.',
      'Lo que puedes hacer depende de tu rol en el POS — Propietario y Gerente tienen acceso completo, Inventario puede crear y recibir pero no enviar, y Supervisor/Gerente de sucursal solo pueden ver.',
    ],
    content: [
      {
        heading: 'Dónde encontrarlo',
        body: 'Órdenes de compra es un mosaico dentro de POS > Operaciones, en el sector Retail — busca el ícono 📋. Al tocarlo se abre una pestaña dedicada de Órdenes de compra con su propia lista, filtros (Todas / Pendientes / Recibidas) y un botón "+ Nuevo pedido" en la esquina superior derecha. Si hasta ahora tu proceso de reabastecimiento consistía en escribirle a un proveedor desde tu propio teléfono y esperar haber recordado cada artículo, esta es la herramienta que reemplaza ese hábito — vive dentro de la misma app que ya usas para vender, así que no hay nada aparte en lo que iniciar sesión.',
      },
      {
        heading: 'Cómo iniciar un nuevo pedido',
        body: 'Toca "+ Nuevo pedido" y primero te pedirá un proveedor — elige uno existente del menú desplegable, o agrega uno nuevo al instante con solo un nombre y un número de teléfono. El número de teléfono importa: es lo que usará más adelante el paso de envío por WhatsApp, y sin él, ese pedido no se puede enviar, solo crear y llevar el seguimiento manualmente.\n\nDebajo del proveedor, la lista de artículos se abre ya con datos: AskBiz revisa cada producto que esté en su punto de reorden o por debajo y lo agrega como línea, con una cantidad de pedido sugerida calculada para llevar el stock de vuelta a aproximadamente el doble de ese umbral, y un costo unitario tomado del último costo registrado del producto. No tienes que aceptar nada de esto — edita la cantidad o el costo en cualquier línea, elimina las líneas que no quieras, o usa el menú desplegable "Agregar producto" debajo para incorporar cualquier otro artículo de tu catálogo que no estuviera bajo en stock. Un total en tiempo real se actualiza a medida que avanzas, y un campo de notas al final es un buen lugar para instrucciones de entrega o un número de referencia que tu proveedor necesite.',
      },
      {
        heading: 'Los cinco estados del pedido',
        body: 'Cada pedido está en uno de cinco estados, mostrados como una etiqueta de color en su tarjeta: Borrador (creado pero aún no enviado), Pedido (enviado al proveedor, nada recibido), Parcial, Recibido o Cancelado. Vale la pena entender Parcial por separado — no es una acción que elijas por separado, es lo que se vuelve automáticamente un pedido en el instante en que has recibido algo pero no todo lo que pediste. Si pides 50 unidades de algo y llegan 30 hoy con el resto la semana que viene, el pedido pasa a Parcial en el momento en que registras esas 30, y se queda ahí —mostrando exactamente lo que aún falta— hasta que lleguen las 20 restantes y pase solo a Recibido. El filtro Pendientes en la parte superior de la lista es simplemente todo pedido que está actualmente en estado Parcial, así que puedes ver de un vistazo qué entregas todavía te deben.',
      },
      {
        heading: 'Enviar un pedido a tu proveedor',
        body: 'Abre cualquier pedido en Borrador o Pedido y toca Enviar (dice Reenviar una vez que un pedido ya salió una vez). AskBiz arma un mensaje detallado —cada línea como "artículo x cantidad @ costo", el total, y tus notas si agregaste alguna— e intenta entregarlo como un mensaje de plantilla automática de WhatsApp directo al número del proveedor. Si esa vía automática no está disponible, recurre a abrir un enlace wa.me prellenado en una pestaña nueva con el mismo mensaje ya escrito, así que solo tienes que darle a enviar tú mismo en WhatsApp. De cualquier forma, un pedido en Borrador pasa a Pedido la primera vez que se envía, y la marca de tiempo de envío se actualiza en cada envío posterior. Si el registro del proveedor no tiene número de teléfono, el botón Enviar aparece deshabilitado y una sugerencia te indica que agregues uno — no hay forma de evitar la necesidad de un número.',
      },
      {
        heading: 'Recibir stock',
        body: 'Cuando llega la mercancía, abre el pedido y toca "Recibir stock". Verás cada línea con un campo ya predeterminado a su cantidad total pendiente (lo pedido menos lo ya recibido en esa línea) — las líneas que ya están completamente recibidas aparecen en gris y no pueden recibir más. Ajusta cualquier cantidad hacia abajo si solo llegó parte de esa línea, y luego confirma.\n\nConfirmar es lo que realmente mueve el stock: cada línea incrementa de forma atómica el conteo de stock en vivo de ese producto en tu inventario (la misma cifra que lee tu caja y la pantalla Resumen), y el estado del pedido se recalcula con los números frescos —Recibido si todas las líneas ya están completas, Parcial si algunas siguen incompletas, sin cambios en cualquier otro caso. Puedes volver y recibir contra el mismo pedido más de una vez a medida que una entrega llega por etapas; cada recepción solo pregunta por lo que sigue pendiente.',
      },
      {
        heading: 'Quién puede hacer qué',
        body: 'Las acciones sobre órdenes de compra están controladas por permisos según el rol en el POS, no por un interruptor único de todo o nada. Propietario y Gerente pueden ver, crear, enviar, recibir y marcar pedidos como pagados. El rol Inventario puede crear y recibir pedidos (y marcarlos como pagados) pero no puede enviarlos — el envío se deja deliberadamente a la gerencia. Los roles Supervisor y Gerente de sucursal pueden ver los pedidos y su estado pero no pueden crear, enviar ni recibir contra ellos. Si un botón se ve deshabilitado o alguien te dice que no puede ver la opción Enviar, revisa el rol que tiene asignado antes de asumir que algo está roto.',
      },
    ],
    faq: [
      {
        q: '¿Por qué AskBiz ya agregó artículos a mi nueva orden de compra antes de que escribiera algo?',
        a: 'El formulario de creación rellena automáticamente todo producto que esté actualmente en su punto de reorden o por debajo, con una cantidad sugerida que lo reabastece hasta aproximadamente el doble de ese umbral y el último costo registrado. Es un punto de partida, no un pedido final — edita, elimina o agrega líneas libremente antes de guardar.',
      },
      {
        q: '¿Qué significa realmente "Parcial" en un pedido?',
        a: 'Significa un pedido pendiente: ha llegado algo pero no todo lo pedido. Se establece automáticamente en el momento en que recibes cualquier cantidad menor a la totalidad pendiente en al menos una línea, y el pedido permanece Parcial hasta que todas las líneas estén completamente recibidas.',
      },
      {
        q: '¿Puedo enviar una orden de compra sin un número de teléfono del proveedor?',
        a: 'No. El envío entrega el pedido como un mensaje de WhatsApp (o un enlace de WhatsApp prellenado como alternativa), así que el proveedor necesita un número de teléfono registrado antes de que puedas enviárselo. Aún puedes crear y llevar el seguimiento del pedido sin uno — simplemente no puedes enviarlo hasta que se agregue un número.',
      },
      {
        q: 'Si recibo parte de un pedido hoy, ¿puedo recibir el resto más adelante?',
        a: 'Sí. Cada recepción solo pregunta por las cantidades aún pendientes, y puedes abrir el mismo pedido y recibir contra él de nuevo a medida que lleguen entregas posteriores. El stock se agrega de forma incremental cada vez — nada se deshace ni se sobrescribe entre recepciones.',
      },
      {
        q: '¿Qué roles del personal pueden enviar una orden de compra a un proveedor?',
        a: 'Solo Propietario y Gerente pueden enviar. El personal con rol Inventario puede crear y recibir pedidos pero no enviarlos, y los roles Supervisor/Gerente de sucursal solo pueden ver pedidos, no actuar sobre ellos.',
      },
    ],
  },

  'connect-marketing-ads-sources-askbiz': {
    title: 'Conecta tus datos de marketing: Meta Ads, Google Ads, Google Analytics, Mailchimp y Klaviyo',
    description:
      'Cómo conectar las cinco fuentes de Marketing y Publicidad en AskBiz —Meta Ads, Google Ads, Google Analytics, Mailchimp y Klaviyo— y qué sincroniza cada una en tu panel.',
    keywords: [
      'Meta Ads', 'Google Ads', 'Google Analytics', 'Mailchimp', 'Klaviyo',
      'fuentes de Marketing y Publicidad', 'AskBiz Sources', 'gasto publicitario', 'ROAS',
      'email marketing', 'conectar datos de marketing',
    ],
    keyTakeaways: [
      'Sources > Marketing y Publicidad tiene cinco conectores: Meta Ads, Google Ads, Google Analytics, Mailchimp y Klaviyo — cada uno trae una parte distinta de tu rendimiento de marketing a AskBiz.',
      'Cuatro de las cinco se conectan con un clic vía OAuth (Meta Ads, Google Ads, Google Analytics, Mailchimp). Klaviyo es la excepción — pegas una clave de API privada en su lugar, porque Klaviyo no ofrece un flujo de app OAuth para este tipo de acceso de lectura.',
      'Cada fuente aporta números diferentes: Meta Ads y Google Ads traen gasto/ROAS/CPM/CPC, Google Analytics trae tráfico del sitio y embudos, Mailchimp trae rendimiento de campañas, y Klaviyo trae ingresos atribuidos al email.',
      'En el plan Free puedes conectar hasta 3 fuentes de datos en total, en cualquier categoría — así que una combinación de, por ejemplo, Meta Ads, Mailchimp y tu POS ya agota tu cuota completa. Los planes Growth y Business eliminan el límite por completo.',
      'Estos no son conectores de relleno — cada uno tiene lógica de sincronización real detrás, así que una vez conectados, traen datos en vivo de forma continua, no solo una importación única.',
    ],
    content: [
      {
        heading: 'Dónde encontrarlas',
        body: 'Abre Sources desde la navegación principal de AskBiz. Los conectores están agrupados por categoría, y Marketing y Publicidad es uno de esos grupos, junto a E-Commerce, Contabilidad, Pagos y el resto. Dentro encontrarás cinco tarjetas: Meta Ads, Google Ads, Google Analytics, Mailchimp y Klaviyo. También puedes usar el cuadro de búsqueda en la parte superior de la página de Sources — escribir "ads", "mailchimp" o "klaviyo" filtra directamente hasta la tarjeta correspondiente. Cada tarjeta muestra una breve descripción de lo que sincroniza, y un botón Conectar. Una vez conectada, una fuente sube a la lista "Conectadas" en la parte superior de la página, donde puedes activar una sincronización manual o desconectarla en cualquier momento.',
      },
      {
        heading: 'Meta Ads — rendimiento publicitario de Facebook e Instagram',
        body: 'Meta Ads conecta tu cuenta publicitaria de Facebook e Instagram. Haz clic en Conectar y AskBiz te redirige a Meta para iniciar sesión y aprobar el acceso de lectura a tus cuentas publicitarias — no hay nada que escribir ni pegar. Una vez aprobado, sincroniza tu gasto publicitario junto con el ROAS (retorno sobre el gasto publicitario), el CPM (costo por mil impresiones) y el CPC (costo por clic), para que puedas ver qué está devolviendo realmente tu presupuesto publicitario sin abrir Ads Manager por separado. Esto es útil para conectar lo que gastas en anuncios de Facebook e Instagram con lo que realmente termina en tus ventas — especialmente si también usas Instagram Shopping o una tienda de Shopify a través de AskBiz, ya que el gasto y los ingresos quedan entonces uno junto al otro.',
      },
      {
        heading: 'Google Ads — rendimiento de campañas de búsqueda',
        body: 'Google Ads funciona igual que Meta Ads: haz clic en Conectar, inicia sesión en tu cuenta de Google y aprueba el acceso de solo lectura a tus cuentas publicitarias. Sincroniza el gasto de tus campañas de búsqueda, el ROAS y las conversiones, para que puedas hacer seguimiento de lo que cuestan tus anuncios de búsqueda de Google frente a lo que están convirtiendo. Si ya usas Google Ads para llevar tráfico a un sitio web o tienda, conectarlo aquí significa que ese gasto aparece junto a tus otras cifras de marketing e ingresos, en vez de vivir solo en un inicio de sesión separado de Google Ads.',
      },
      {
        heading: 'Google Analytics — tráfico del sitio y embudos',
        body: 'Google Analytics es un conector separado de Google Ads, aunque ambos pasen por el inicio de sesión de Google. Este se conecta a una propiedad de GA4 en tu sitio web — se trata de lo que pasa una vez que alguien llega a tu sitio, no de lo que pagaste para traerlo. Sincroniza tráfico y sesiones, datos de embudo (dónde abandonan los visitantes antes de convertir), e ingresos de e-commerce si tienes configurado el seguimiento de e-commerce de GA4. Haz clic en Conectar, inicia sesión con la cuenta de Google que tiene acceso a tu propiedad de GA4 y aprueba el acceso. Combinar esto con Google Ads o Meta Ads te da la imagen completa: lo que gastaste para traer a alguien a tu sitio, y lo que esa persona realmente hizo una vez ahí.',
      },
      {
        heading: 'Mailchimp — rendimiento de campañas de email',
        body: 'Mailchimp también se conecta vía OAuth — haz clic en Conectar, inicia sesión en Mailchimp y aprueba el acceso. Sincroniza tus campañas junto con las tasas de apertura, las tasas de clic y los datos de audiencia, para que el rendimiento de tu email marketing esté en el mismo panel que tus ventas y gasto publicitario, en vez de solo en los propios informes de Mailchimp.',
      },
      {
        heading: 'Klaviyo — la que es diferente: una clave de API pegada, no OAuth',
        body: 'Klaviyo es la excepción entre las cinco. En lugar de un botón Conectar que te redirige a iniciar sesión, verás un campo que pide una clave de API privada. Para obtener una, inicia sesión en Klaviyo, ve a Account, luego Settings, luego API Keys, y crea (o copia) una clave de API privada desde ahí. Pégala en el campo de AskBiz y conecta. Esta es una diferencia deliberada en cómo funciona el conector, no un flujo de OAuth roto — la API de Klaviyo para este tipo de acceso de lectura a nivel de cuenta funciona con clave, no con OAuth, así que una clave privada es la forma correcta y esperada de conectarlo. Como una clave de API privada es una credencial genuina, trátala como tratarías una contraseña: genérala solo desde tu propia cuenta de Klaviyo, y no la compartas fuera de pegarla directamente en AskBiz. Una vez conectado, Klaviyo sincroniza los ingresos atribuidos al email, tus flows (secuencias de email automatizadas), tasas de apertura y atribución — para que puedas ver cuántos ingresos están generando realmente tus emails de Klaviyo, no solo cuánta gente los abrió.',
      },
      {
        heading: 'Límites de fuentes en el plan Free',
        body: 'El plan Free permite hasta 3 fuentes de datos conectadas en total, y ese límite aplica combinando todas las categorías — no es 3 por categoría. Así que si conectas Meta Ads, Mailchimp y tu POS de AskBiz, ya usaste tu cuota completa y necesitarías desconectar una antes de agregar una cuarta, ya sea Klaviyo, Shopify o cualquier otra cosa. Los planes Growth y Business eliminan este límite por completo, dándote conexiones de fuentes ilimitadas en toda la lista de integraciones de AskBiz. Si los datos de marketing son una prioridad para ti, vale la pena decidir de antemano qué fuentes te importan más en el plan Free, o actualizar si quieres las cinco conectores de Marketing y Publicidad junto con tus fuentes de ventas y contabilidad al mismo tiempo.',
      },
      {
        heading: 'Qué pasa después de conectar',
        body: 'Una vez que una fuente está conectada, aparece en la lista Conectadas en la parte superior de la página de Sources con un indicador de estado y una hora de "última sincronización". Estas no son importaciones únicas — cada una de las cinco tiene lógica de sincronización real detrás que sigue trayendo datos frescos de forma continua, y también puedes presionar "Sincronizar ahora" en cualquier fuente conectada si quieres los números más recientes de inmediato en lugar de esperar la siguiente sincronización automática. Si una fuente alguna vez muestra un estado de error —por ejemplo, si la clave de API de Klaviyo fue revocada, o un token de OAuth necesita ser aprobado de nuevo— el mensaje de error en esa fila te dirá qué salió mal, y reconectar es el mismo proceso que conectar por primera vez.',
      },
    ],
    faq: [
      {
        q: '¿Por qué Klaviyo pide una clave de API en lugar de simplemente dejarme iniciar sesión como las demás?',
        a: 'Meta Ads, Google Ads, Google Analytics y Mailchimp usan OAuth, así que inicias sesión y apruebas el acceso con un clic. El conector de Klaviyo usa una clave de API privada en su lugar, porque esa es la forma correcta de otorgar este tipo de acceso de lectura a la API de Klaviyo. Genérala en Klaviyo bajo Account, luego Settings, luego API Keys, y pégala en AskBiz.',
      },
      {
        q: '¿Google Ads y Google Analytics usan la misma conexión?',
        a: 'No — son dos conectores separados en la página de Sources, aunque ambos te redirijan a través de un inicio de sesión de Google. Google Ads sincroniza tu gasto publicitario y el rendimiento de campañas; Google Analytics sincroniza el tráfico de tu sitio web y los embudos desde una propiedad GA4. Puedes conectar cualquiera de los dos por su cuenta, o ambos.',
      },
      {
        q: 'Estoy en el plan Free — ¿puedo conectar las cinco fuentes de Marketing y Publicidad?',
        a: 'Solo si son las únicas fuentes que conectas. El plan Free permite hasta 3 fuentes de datos en total, combinando todas las categorías, no 3 por categoría. Conectar las cinco fuentes de Marketing y Publicidad más cualquier otra cosa —tu POS, Shopify, software de contabilidad— superaría ese límite. Los planes Growth y Business tienen conexiones de fuentes ilimitadas.',
      },
      {
        q: '¿Es seguro pegar mi clave de API de Klaviyo en AskBiz?',
        a: 'El campo es un campo de entrada tipo contraseña, y se usa solo para autenticar el acceso de lectura de AskBiz a tu cuenta de Klaviyo. Trata la clave en sí como tratarías cualquier otra credencial de cuenta — genérala solo desde tu propia cuenta de Klaviyo, y no la pegues en ningún lugar excepto directamente en el campo de conexión de AskBiz.',
      },
      {
        q: '¿Qué sincroniza exactamente cada fuente — es una importación única?',
        a: 'No, ninguna de las cinco es una importación única. Meta Ads y Google Ads sincronizan gasto, ROAS, CPM/CPC y conversiones; Google Analytics sincroniza tráfico, sesiones, embudos e ingresos de e-commerce; Mailchimp sincroniza campañas, tasas de apertura, tasas de clic y audiencia; Klaviyo sincroniza ingresos por email, flows, tasas de apertura y atribución. Cada una sigue sincronizando de forma continua una vez conectada, y puedes activar una sincronización manual en cualquier momento desde la lista Conectadas.',
      },
    ],
  },

  'connect-gocardless-askbiz': {
    title: 'Conecta GoCardless a AskBiz para pagos de domiciliación bancaria y suscripciones',
    description:
      'Cómo conectar GoCardless en Sources de AskBiz, qué sincroniza, dónde termina esa información y qué significa para tu límite de fuentes en el plan Free.',
    keywords: [
      'GoCardless', 'domiciliación bancaria', 'Bacs', 'suscripciones', 'mandatos',
      'pagos recurrentes', 'AskBiz Sources', 'conector de Pagos', 'conectar GoCardless',
    ],
    keyTakeaways: [
      'GoCardless vive en Sources > Pagos, junto a Stripe, PayPal, Klarna y SumUp.',
      'Es una conexión OAuth con un clic — haz clic en Conectar, inicia sesión en GoCardless, aprueba el acceso de solo lectura. No hay ninguna clave de API que buscar ni pegar.',
      'Sincroniza tus pagos por domiciliación bancaria, cada uno etiquetado con el mandato que lo autorizó, para que puedas rastrear un cobro hasta el acuerdo con el cliente detrás de él.',
      'Los datos de GoCardless se escriben en su propia tabla gocardless_payments en lugar de en tu feed compartido de Transacciones, porque los registros de pagos y mandatos no encajan en esa forma — así que aún no aparecerán en tus Informes de ventas habituales como sí lo hacen Stripe o PayPal.',
      'Cuenta hacia el límite de 3 fuentes conectadas del plan Free como cualquier otro conector; los planes Growth y Business no tienen límite de fuentes.',
    ],
    content: [
      {
        heading: 'Dónde encontrarlo',
        body: 'Abre Sources desde la navegación principal de AskBiz y busca en la categoría Pagos — se encuentra entre PayPal y Klarna, junto a Stripe y SumUp. AskBiz agrupa cada conector por categoría (E-Commerce, Contabilidad, Pagos, Marketing y Publicidad, y demás), así que Pagos es donde viven juntas las cinco fuentes relacionadas con pagos en lugar de estar dispersas por la página. Si prefieres no desplazarte, el cuadro de búsqueda en la parte superior de la página de Sources filtra mientras escribes, así que escribir "gocardless" o "domiciliación bancaria" salta directo a su tarjeta. La tarjeta muestra una breve descripción —pagos por domiciliación bancaria, suscripciones, mandatos— y un botón Conectar. Una vez conectada, sube a la lista Conectadas en la parte superior de la página junto a tus otras fuentes, mostrando un punto de estado y una hora de última sincronización, donde puedes activar una sincronización manual o desconectarla en cualquier momento.',
      },
      {
        heading: 'Conectar: un clic, sin clave de API',
        body: 'GoCardless es un conector OAuth, no de pegar una clave — la sugerencia de la tarjeta dice "Redirige a GoCardless — acceso de solo lectura", y eso es exactamente lo que sucede. Haz clic en Conectar y AskBiz te envía a la propia pantalla de inicio de sesión de GoCardless, solicitando un alcance read_only. Inicia sesión y apruébalo ahí, y GoCardless te redirige de vuelta a Sources. Nunca ves ni manejas un token de acceso tú mismo, y no hay nada que copiar de una página de configuración de GoCardless primero — a diferencia de, digamos, Klarna o SumUp en el mismo grupo de Pagos, que sí piden pegar credenciales de API. Una vez que apruebas el acceso, AskBiz busca tu cuenta de acreedor de GoCardless y usa su nombre como el nombre visible de la fuente en tu lista Conectadas, así que se reconoce como tu negocio en lugar de aparecer como una fila genérica de "GoCardless". Una primera sincronización se activa automáticamente justo después de conectar, así que no necesitas presionar Sincronizar ahora solo para verla empezar a funcionar.',
      },
      {
        heading: 'Qué se sincroniza realmente',
        body: 'Una vez conectado, AskBiz trae tus pagos de GoCardless — cada cobro por domiciliación bancaria en la cuenta, ya sea completado, pendiente o fallido, retrocediendo por todo tu historial de pagos y luego manteniéndose actualizado en cada sincronización posterior. Cada registro de pago lleva el monto y la moneda, su estado, la fecha del cobro, y cualquier descripción que tú o GoCardless hayan adjuntado. Fundamentalmente, cada uno también lleva el mandato que lo autorizó —el acuerdo de domiciliación bancaria subyacente al que se suscribió el cliente— así que un pago no es solo un número, es rastreable hasta el mandato específico (y por extensión la suscripción o acuerdo) que lo generó. Es en ese sentido que el conector cubre "pagos, suscripciones y mandatos": lo que obtienes es un feed completo de pagos, cada uno ya vinculado al mandato detrás de él, en lugar de tres conjuntos de datos separados y desconectados. Como AskBiz pagina a través de la API en lugar de traer un lote fijo, un negocio con un historial extenso ya existente en GoCardless obtiene todo su historial acumulado en la primera sincronización, no solo los cobros más recientes.',
      },
      {
        heading: 'Por qué todavía no aparece en tus Informes habituales',
        body: 'La mayoría de los conectores de AskBiz —Stripe y PayPal incluidos— alimentan una tabla compartida que impulsa tu vista de Transacciones, el P&L y las páginas de Informes. GoCardless deliberadamente no lo hace. Los datos de pagos y mandatos tienen una forma distinta a la de una orden o venta —un pago por domiciliación bancaria no tiene una línea de producto, un nombre de cliente en el mismo formato, ni un canal como sí lo tiene una orden de Shopify— así que AskBiz lo escribe en su propia tabla dedicada en lugar de forzarlo dentro de la compartida. En la práctica, eso significa que tus datos de GoCardless se están sincronizando, almacenando de forma segura y manteniendo actualizados —pero aún no están mezclados en los mismos Informes de ventas o vista de P&L donde aparecen tus pagos de Stripe o PayPal. Si dependes de AskBiz para tener una vista de ingresos combinada única entre procesadores de pago, GoCardless es el único conector del grupo de Pagos que actualmente está un poco al margen de esa imagen en lugar de dentro de ella. Esa es una razón para seguir conectándolo —los datos están capturados y listos en el momento en que los informes lo alcancen— pero no una razón para esperar una coincidencia instantánea equivalente a cómo se comporta Stripe hoy.',
      },
      {
        heading: 'Límites de fuentes en el plan Free',
        body: 'GoCardless no recibe trato especial en los límites de plan — cuenta como una conexión contra el límite del plan Free de 3 fuentes conectadas en total, combinadas en todas las categorías, no 3 por categoría. Así que si ya tienes Shopify y Xero en Free, GoCardless sería tu tercer y último cupo a menos que desconectes algo más primero. Los planes Growth y Business eliminan este límite por completo, así que puedes ejecutar GoCardless junto con Stripe, PayPal y todo lo demás en tu conjunto de herramientas sin tener que sacrificar nada. Si los pagos por domiciliación bancaria y suscripción son una parte importante de tus ingresos, vale la pena decidir de antemano si GoCardless merece uno de tus tres cupos gratuitos, o si tiene más sentido actualizar una vez que dependas de más de un par de fuentes a la vez.',
      },
      {
        heading: 'Si algo falla',
        body: 'El token OAuth de GoCardless para esta conexión no viene con un flujo de renovación documentado, así que si la conexión alguna vez deja de funcionar, la causa más probable es que ese token necesite ser aprobado de nuevo en lugar de un error real de sincronización. Si una sincronización falla, la fila de la fuente en tu lista Conectadas cambiará a un estado de error con un mensaje breve explicando por qué, y reconectar es la solución: haz clic en Conectar de nuevo y aprueba el acceso otra vez. Algo que vale la pena saber antes de hacer clic en Desconectar: no es una pausa. Eliminar GoCardless de tu lista Conectadas borra su historial de pagos sincronizado junto con él, no solo la conexión en sí. Si estás desconectando para solucionar un problema en lugar de eliminar GoCardless de forma definitiva, reconectar después vuelve a sincronizar tu historial de pagos desde cero desde GoCardless en lugar de continuar donde quedaron los datos anteriores.',
      },
    ],
    faq: [
      {
        q: '¿Necesito una clave de API de GoCardless para conectar?',
        a: 'No. GoCardless se conecta vía OAuth — haz clic en Conectar en su tarjeta de Sources y serás redirigido para iniciar sesión y aprobar el acceso de solo lectura en el propio sitio de GoCardless. No hay ninguna clave o token que buscar en tu configuración de GoCardless y pegar en AskBiz.',
      },
      {
        q: '¿Mis pagos de GoCardless aparecerán en mis Informes o P&L de AskBiz junto a Stripe y PayPal?',
        a: 'Todavía no. Los datos de pagos y mandatos de GoCardless se almacenan en su propia tabla dedicada en lugar de en la tabla compartida que alimenta Informes, Transacciones y P&L —porque esos datos no encajan en la misma forma que una orden o venta. Se sincronizan y almacenan, pero actualmente están separados de tu vista de ingresos combinada.',
      },
      {
        q: '¿El conector trae mis suscripciones como una lista separada, o solo pagos?',
        a: 'Sincroniza pagos —cada cobro por domiciliación bancaria, ya sea completado, pendiente o fallido— y cada pago lleva el mandato que lo autorizó, así que puedes rastrear un cobro hasta el acuerdo subyacente. No es un feed separado de objetos de suscripción o mandato independientes de los propios pagos.',
      },
      {
        q: '¿Conectar GoCardless usa uno de mis cupos de fuente del plan Free?',
        a: 'Sí. El plan Free permite hasta 3 fuentes conectadas en total combinando todas las categorías, y GoCardless cuenta igual que cualquier otro conector —Stripe, Shopify, Xero, todos ellos. Los planes Growth y Business no tienen límite de fuentes.',
      },
      {
        q: 'Mi conexión de GoCardless muestra un error — ¿qué hago?',
        a: 'Haz clic en Conectar de nuevo desde la página de Sources y aprueba el acceso otra vez a través de la pantalla de inicio de sesión de GoCardless — el mismo proceso que conectar por primera vez. Ten en cuenta que esto es distinto de desconectar: un estado de error no afecta tu historial de pagos sincronizado, pero si primero haces clic en Desconectar, eso elimina los datos de pagos de GoCardless sincronizados junto con la conexión, y reconectar los vuelve a sincronizar desde cero en lugar de restaurar los registros anteriores.',
      },
    ],
  },

  'connect-linnworks-askbiz': {
    title: 'Conecta Linnworks a AskBiz para sincronización de inventario multicanal',
    description:
      'Guía paso a paso para conectar Linnworks a AskBiz — qué hace el flujo OAuth, qué datos se sincronizan realmente y con qué frecuencia se actualizan.',
    keywords: ['Linnworks', 'conectar', 'integración', 'AskBiz', 'inventario', 'multicanal', 'Sources', 'pedidos', 'cumplimiento', 'OAuth'],
    keyTakeaways: [
      'Linnworks vive bajo Sources > Inventario y Logística, junto a Cin7 y ShipStation, y se conecta vía OAuth — autorizas en el propio Linnworks, AskBiz nunca ve una contraseña.',
      'El acceso es de solo lectura: AskBiz puede traer tus pedidos, no puede crear, editar ni cancelar nada en tu cuenta de Linnworks.',
      'Lo que se sincroniza son tus pedidos abiertos —SKU, producto, cantidad, precio, canal y estado de cumplimiento por línea de artículo— que AskBiz convierte en cifras de ingresos por canal y movimiento de stock. No es un feed independiente de conteo de stock en vivo de almacén.',
      'La frecuencia de sincronización sigue tu plan de AskBiz como cualquier otra fuente: diaria en Free, cada 6 horas en Growth, cada hora en Business.',
      'Este es un conector real y funcional con su propio manejador de sincronización y normalizador de datos —no lo mismo que los artículos más antiguos de AskBiz que mencionan Linnworks solo como ejemplo de una plataforma multicanal que los negocios podrían usar.',
    ],
    content: [
      {
        heading: 'Dónde encontrarlo',
        body: 'Desde tu panel de AskBiz, ve a Sources. Baja hasta la sección Inventario y Logística —Linnworks está ahí junto a Cin7 y ShipStation, con una breve descripción debajo: "Inventario multicanal, pedidos, cumplimiento." Tanto Cin7 como ShipStation te piden pegar una clave de API (y, para Cin7, también un ID de cuenta) antes de conectarse. Linnworks es diferente —es el único de los tres que usa una conexión OAuth completa, así que haces clic en la tarjeta y todo lo que sigue sucede en el propio sitio de Linnworks en lugar de en un formulario en AskBiz.',
      },
      {
        heading: 'Antes de conectar',
        body: 'Necesitarás acceso de administrador, o al menos de autorización de aplicaciones, en tu cuenta de Linnworks —el mismo nivel de acceso que necesitarías para aprobar cualquier aplicación de terceros dentro de Linnworks. No necesitas generar ni copiar claves de API, secretos ni tokens de antemano; AskBiz no te pide pegar nada para este conector en particular, que es la principal diferencia práctica con Cin7 justo al lado. La página de Sources te dice exactamente qué esperar antes de hacer clic en nada: "Redirige a Linnworks — acceso de solo lectura." Esa línea es una descripción literal de lo que sucede a continuación, no texto de marketing —AskBiz está solicitando permiso para leer tus pedidos, y nada más.',
      },
      {
        heading: 'Paso 1 y 2: Autorizar en Linnworks',
        body: 'Al hacer clic en la tarjeta de Linnworks te lleva a la propia pantalla de autorización OAuth de Linnworks, donde inicias sesión (si aún no lo has hecho) y revisas exactamente qué está pidiendo leer AskBiz antes de aprobarlo. Nunca se te pide una contraseña de Linnworks dentro de AskBiz —todo el intercambio ocurre en el dominio de Linnworks, que es la práctica estándar de OAuth y el mismo patrón que usa AskBiz para Shopify, Xero y sus otras fuentes basadas en OAuth. Si decides no continuar, simplemente puedes cerrar o salir de esa pantalla; nada se conecta hasta que realmente lo apruebas. Una vez que lo apruebas, Linnworks te redirige directamente de vuelta a la página de Sources de AskBiz de forma automática —no hay ningún código que copiar ni pegar en ningún lado.',
      },
      {
        heading: 'Paso 3: Qué pasa después de que apruebas',
        body: 'En el camino de regreso, AskBiz intercambia el código de autorización que Linnworks le entrega por un token de acceso, y luego guarda ese token cifrado en tu cuenta junto con la URL del servidor de Linnworks que Linnworks asigna a tu cuenta. Ese token es permanente —no expira como lo haría un token de sesión típico— pero AskBiz nunca lo usa directamente contra la API de pedidos de Linnworks. En cambio, en cada sincronización presenta ese token permanente al endpoint AuthorizeByApplication de Linnworks para generar un token de sesión fresco y de corta duración (los propios tokens de sesión de Linnworks duran solo alrededor de 20 minutos, mucho menos que cualquier intervalo de sincronización realista), y es ese token de sesión recién generado el que realmente se usa para traer tus pedidos. No ves nada de esto suceder —es el mecanismo que mantiene la conexión funcionando de forma confiable e indefinida sin nunca pedirte que te reconectes o vuelvas a autorizar. En el momento en que se guarda tu conexión, AskBiz también activa automáticamente una primera sincronización, así que no hay nada más que hacer clic.',
      },
      {
        heading: 'Qué datos se sincronizan realmente',
        body: 'Cada sincronización trae tus pedidos abiertos de Linnworks. Para cada línea de artículo en cada pedido, AskBiz registra el SKU, el nombre del producto, la cantidad, el precio unitario, el costo unitario (donde Linnworks lo proporciona), por qué canal de venta llegó el pedido y el estado del pedido. Eso se normaliza en los mismos campos por registro que AskBiz usa para cualquier otra fuente conectada —ingresos brutos, costo, margen, unidades vendidas y movimiento de stock— así que tus pedidos de Linnworks se sitúan en tus informes junto a tus ventas de Shopify, Amazon o POS en lugar de como un silo separado que tienes que revisar por su cuenta. Si un pedido llega sin líneas de artículo adjuntas, AskBiz igual lo registra como una sola fila usando el total del pedido, así que nada desaparece silenciosamente solo porque el detalle a nivel de artículo no estaba disponible. Vale la pena ser preciso en un punto, sin embargo: lo que se sincroniza hoy es actividad de pedidos, no un feed independiente de conteo de stock en vivo de almacén. AskBiz infiere el movimiento de stock a partir de las unidades vendidas por pedido en lugar de traer directamente las cantidades absolutas disponibles de Linnworks —cada pedido sincronizado reduce la cifra de movimiento de stock de ese SKU, pero AskBiz no le está preguntando a Linnworks "cuántos me quedan en el almacén ahora mismo" como una consulta separada. Si dependes de Linnworks como tu fuente real de conteo de stock, sigue haciéndolo. La vista de AskBiz aquí está impulsada por pedidos, lo cual es preciso para análisis de ingresos, canal y rendimiento de producto, pero no es un sustituto de revisar los conteos de almacén en vivo en el propio Linnworks antes de tomar una decisión de compra.',
      },
      {
        heading: 'Con qué frecuencia se vuelve a sincronizar',
        body: 'Una vez conectado, Linnworks sigue el mismo calendario de sincronización que cualquier otra fuente, condicionado por tu plan de AskBiz: una vez al día en Free, cada 6 horas en Growth y cada hora en Business. Linnworks no tiene su propio intervalo mínimo más lento como sí lo tienen un par de otros conectores —Stripe está limitado a 3 horas y Etsy a 8 horas incluso en Business, porque sus datos subyacentes simplemente no cambian lo suficientemente rápido como para justificar consultarlos con más frecuencia— así que Linnworks solo sigue el ritmo que permita tu plan, igual que Shopify, Amazon o Xero. Si quieres números más frescos justo después de un gran impulso de ventas en tus canales, vuelve a la página de Sources, busca Linnworks en tu lista de fuentes conectadas, y haz clic en Sincronizar ahora —eso activa una sincronización bajo demanda fuera del calendario regular, sin afectar cuándo se ejecuta la próxima sincronización programada. La misma fila en esa página muestra un punto de estado (verde cuando sincroniza limpiamente, ámbar o rojo si algo necesita atención) y una hora de "última sincronización", así que puedes ver de un vistazo qué tan actuales están tus datos de Linnworks antes de confiar en ellos.',
      },
      {
        heading: 'Si has leído la guía de AskBiz sobre venta multicanal',
        body: 'El contenido general de la Academia de AskBiz sobre venta multicanal menciona Linnworks como ejemplo del tipo de plataforma que usan los negocios para centralizar pedidos entre canales —esa es una referencia genérica a la categoría de herramienta, escrita antes de que AskBiz se conectara directamente a Linnworks. Este artículo trata sobre algo diferente: la conexión directa de AskBiz a tu propia cuenta de Linnworks, descrita arriba. Si ya usas Linnworks como tu centro multicanal, conectarlo aquí es lo que realmente hace que esos datos lleguen a los informes de AskBiz.',
      },
    ],
    faq: [
      { q: '¿AskBiz obtiene acceso de escritura a mi cuenta de Linnworks?', a: 'No. La conexión es de solo lectura —AskBiz puede traer tus datos de pedidos pero no puede crear, editar, cancelar ni cumplir nada en Linnworks. La página de Sources lo indica explícitamente antes de que conectes.' },
      { q: '¿Esto me mostrará mis niveles de stock actuales exactos de Linnworks?', a: 'No directamente. AskBiz sincroniza tus pedidos abiertos y deriva el movimiento de stock (unidades vendidas por SKU) a partir de ellos —actualmente no trae un feed independiente de conteo de stock en vivo de almacén. Para tus cantidades disponibles autorizadas, revisa Linnworks directamente.' },
      { q: '¿Cómo es esto diferente de la mención de Linnworks en el artículo de venta multicanal de AskBiz?', a: 'Ese artículo menciona Linnworks de forma genérica, como ejemplo de la categoría de herramientas de gestión multicanal que usan los negocios —no describe una conexión con AskBiz. Este artículo cubre el conector real de Linnworks de AskBiz, que trae datos reales de pedidos a tu cuenta.' },
      { q: '¿Con qué frecuencia se actualizarán mis datos de Linnworks en AskBiz?', a: 'Sigue el calendario de sincronización normal de tu plan: diaria en Free, cada 6 horas en Growth, cada hora en Business. También puedes activar una sincronización inmediata en cualquier momento desde la página de Sources con el botón Sincronizar ahora.' },
      { q: '¿Qué pasa si necesito reconectar o algo se ve mal?', a: 'Ve a Sources, busca Linnworks en tu lista de fuentes conectadas, y usa Desconectar seguido de reconectar a través del mismo flujo OAuth. Si una sincronización está fallando, la fila de estado mostrará un mensaje de error en lugar de quedarse en silencio.' },
    ],
  },

  'connect-xero-freeagent-askbiz': {
    title: 'Conecta Xero o FreeAgent a AskBiz',
    description:
      'Cómo conectar Xero o FreeAgent bajo Sources > Contabilidad, qué sincroniza cada uno en AskBiz, y en qué se diferencian de Sage y Wave en la misma categoría.',
    keywords: [
      'Xero', 'FreeAgent', 'AskBiz Sources', 'conectores de Contabilidad',
      'conectar Xero', 'conectar FreeAgent', 'sincronizar facturas', 'integración de contabilidad',
    ],
    keyTakeaways: [
      'Xero y FreeAgent viven bajo Sources > Contabilidad, junto a QuickBooks, Sage y Wave.',
      'Ambos se conectan con un clic vía OAuth — inicias sesión y apruebas el acceso de solo lectura, sin nada que pegar. Sage y Wave, en la misma categoría, en cambio piden pegar credenciales de API.',
      'Lo que realmente fluye hacia AskBiz son tus facturas —tanto el dinero que entra (facturas de venta) como el dinero que sale (facturas de proveedor)— que alimentan tus informes de ingresos y gastos de AskBiz.',
      'Esta es una extracción separada y de una sola dirección: AskBiz lee de Xero/FreeAgent para informes. Si también usas AskBiz POS, su propia integración (distinta) con Xero envía las ventas del POS hacia Xero para contabilidad — las dos no son la misma conexión.',
      'La frecuencia de resincronización depende de tu plan: diaria en Free, cada 6 horas en Growth, cada hora en Business.',
    ],
    content: [
      {
        heading: 'Dónde encontrarlas',
        body: 'Abre Sources desde la navegación principal de AskBiz. Los conectores están agrupados por categoría, y Contabilidad es uno de esos grupos —junto a E-Commerce, Pagos, Marketing y Publicidad y el resto. Dentro de Contabilidad encontrarás cinco tarjetas: QuickBooks, Xero, Sage, FreeAgent y Wave. Si desplazarte no es lo tuyo, el cuadro de búsqueda en la parte superior de la página de Sources filtra directamente hasta una tarjeta cuando escribes "xero" o "freeagent". La tarjeta de Xero lo describe como cubriendo facturas, conciliación bancaria, P&L y nómina; la tarjeta de FreeAgent describe facturas, gastos, calendario fiscal y flujo de caja —ese es el terreno que cubre cada plataforma en general. Lo que AskBiz realmente trae de cualquiera de las dos, cubierto abajo, es más específico: tus facturas.',
      },
      {
        heading: 'Conectar Xero',
        body: 'Haz clic en Conectar en la tarjeta de Xero. AskBiz te redirige a Xero para iniciar sesión y aprobar el acceso de solo lectura a tu organización —no hay ID de cliente, secreto ni token que buscar y pegar en ningún lado. Una vez que lo apruebas, vuelves a AskBiz y la tarjeta se mueve a la lista Conectadas en la parte superior de la página con un indicador de estado y una hora de última sincronización.',
      },
      {
        heading: 'Conectar FreeAgent',
        body: 'FreeAgent funciona de la misma manera. Haz clic en Conectar, inicia sesión en FreeAgent y aprueba el acceso de solo lectura —de nuevo, sin credenciales que copiar manualmente. Como un token OAuth de FreeAgent está limitado a una sola empresa, no necesitas elegir un inquilino o empresa después, como sí requieren algunas plataformas multiempresa; la conexión queda vinculada a la empresa de FreeAgent para la que aprobaste el acceso.',
      },
      {
        heading: 'La diferencia con Sage y Wave, justo al lado',
        body: 'Xero y FreeAgent son las dos conexiones OAuth en el grupo de Contabilidad —nunca ves un campo de formulario para ninguna de las dos. Sage y Wave, en la misma lista, funcionan de forma distinta: Sage pide pegar un ID de cliente y un secreto de cliente del portal de desarrolladores de Sage, y Wave pide un token de acceso generado desde la propia página de Settings > Developer de Wave. Si estás acostumbrado a pegar credenciales para Sage o Wave, no busques un campo equivalente para Xero o FreeAgent —para estas dos, hacer clic en Conectar y aprobar el acceso en la pantalla de inicio de sesión del propio proveedor es todo el proceso.',
      },
      {
        heading: 'Qué se sincroniza realmente',
        body: 'Una vez conectado, AskBiz trae tus facturas de Xero (o FreeAgent) y las divide por tipo. Las facturas de venta —dinero que te deben— se convierten en partidas de ingresos en AskBiz, llevando la descripción del producto/línea, cantidad, precio, moneda y estado de pago (pagada, pendiente o parcialmente pagada) directamente desde la factura. Las facturas de proveedor —dinero que debes— se convierten en registros de gastos, etiquetados con el proveedor, monto, fecha y categoría. Entre las dos, eso es lo que alimenta tu P&L y tus informes de gastos de AskBiz desde cualquiera de las dos plataformas. Del lado de Xero, las facturas se traen en páginas y ordenadas por cuándo se actualizaron por última vez, así que las ediciones que hagas en Xero —un pago registrado, una factura modificada— se recogen en la siguiente sincronización en lugar de solo en la fecha de creación original de la factura. Las propias funciones de conciliación bancaria, nómina y calendario fiscal de Xero y FreeAgent se quedan dentro de Xero o FreeAgent —AskBiz no trae esas cifras específicas.',
      },
      {
        heading: 'Mantener viva la conexión del token',
        body: 'Los tokens OAuth expiran periódicamente por diseño, y AskBiz renueva ambos automáticamente en segundo plano —para Xero a través de su servicio de identidad, para FreeAgent a través de su propio endpoint de tokens— así que una sincronización normal no te pedirá iniciar sesión de nuevo. Si una renovación alguna vez falla (por ejemplo, si el acceso fue revocado desde el lado de Xero o FreeAgent), la fuente conectada mostrará un estado de error en la página de Sources con un mensaje breve, y reconectar es el mismo proceso de un clic que la primera vez.',
      },
      {
        heading: 'Con qué frecuencia se resincroniza',
        body: 'La frecuencia de sincronización está ligada a tu plan de AskBiz más que al conector en sí: diaria en Free, cada 6 horas en Growth, y cada hora en Business. Ni Xero ni FreeAgent tienen un límite inferior especial aplicado como sí lo tienen un par de otros conectores, así que obtienes el intervalo normal de tu plan. Si quieres las cifras más recientes sin esperar, presiona "Sincronizar ahora" en la fila de la fuente conectada en la página de Sources y traerá los datos de inmediato, sin importar cuándo esté programada la siguiente sincronización.',
      },
      {
        heading: 'Desconectar o cambiar',
        body: 'Ambas fuentes se sitúan en la lista Conectadas una vez configuradas, junto a cualquier otra fuente que hayas vinculado, y cada una tiene su propio botón Desconectar. Desconectar es una limpieza genuina, no solo una pausa: AskBiz revoca el token con el proveedor y elimina los registros de ingresos que esa fuente sincronizó, para que una conexión antigua o incorrecta no siga dejando cifras en tus informes. Si necesitas reconectar más tarde, o cambiar qué organización de Xero o empresa de FreeAgent está vinculada, desconecta primero y luego pasa por Conectar de nuevo para autorizar la nueva —la siguiente sincronización repuebla tus datos desde cero.',
      },
      {
        heading: 'Si también usas AskBiz POS con Xero',
        body: 'Vale la pena aclarar esto, porque los nombres se superponen: este conector de Sources es una extracción de una sola dirección hacia AskBiz para informes —lee tus datos de Xero o FreeAgent para que aparezcan en tus paneles y P&L. Si usas AskBiz POS, POS tiene su propia integración con Xero separada bajo su propia configuración, que hace el trabajo opuesto —envía tus ventas del POS hacia Xero como facturas borrador, para tu contabilidad. Las dos no están vinculadas entre sí ni comparten una conexión: conectar una no conecta ni afecta a la otra, y puedes usar cualquiera, ambas o ninguna según lo que necesites.',
      },
    ],
    faq: [
      {
        q: '¿Necesito pegar una clave de API o un secreto de cliente para Xero o FreeAgent?',
        a: 'No. Ambos son conectores OAuth —haz clic en Conectar, inicia sesión en Xero o FreeAgent, y aprueba el acceso de solo lectura. Eso es distinto de Sage y Wave en el mismo grupo de Contabilidad, que sí piden pegar credenciales.',
      },
      {
        q: '¿Conectar Xero a Sources también configura la sincronización de contabilidad de POS hacia Xero?',
        a: 'No, son conexiones no relacionadas. Este conector de Sources trae tus datos de Xero a AskBiz para informes. AskBiz POS tiene su propia integración con Xero, separada, en su propia configuración, que envía las ventas del POS hacia Xero como facturas borrador. Conectar una no conecta la otra.',
      },
      {
        q: '¿Qué datos aparecen realmente en AskBiz después de conectar — todo lo de Xero?',
        a: 'Específicamente tus facturas: las facturas de venta se convierten en registros de ingresos (con cantidad, precio, moneda y estado de pago) y las facturas de proveedor se convierten en registros de gastos (proveedor, monto, categoría). Las propias funciones de conciliación bancaria, nómina y calendario fiscal de Xero y FreeAgent no se traen — esas se quedan en Xero o FreeAgent.',
      },
      {
        q: '¿Con qué frecuencia se actualizan los datos una vez conectados?',
        a: 'Sigue el intervalo de sincronización de tu plan de AskBiz —diaria en Free, cada 6 horas en Growth, cada hora en Business. También puedes hacer clic en "Sincronizar ahora" en la fuente conectada en cualquier momento para traer los datos más recientes de inmediato en lugar de esperar.',
      },
      {
        q: '¿Qué pasa si mi conexión con Xero o FreeAgent deja de funcionar?',
        a: 'AskBiz renueva automáticamente el token de acceso subyacente en cada sincronización, así que esto normalmente no debería requerir nada de ti. Si una renovación sí falla —por ejemplo, porque el acceso fue revocado del lado de Xero o FreeAgent— la fuente muestra un estado de error con un mensaje breve en la página de Sources, y reconectas de la misma forma en que conectaste la primera vez.',
      },
    ],
  },

  'connect-jumia-marketplace-askbiz': {
    title: 'Conecta Jumia a AskBiz: pedidos, pagos y stock para marketplaces africanos',
    description:
      'Cómo vincular tu cuenta de Jumia Vendor Center a AskBiz usando un Client ID y un Refresh Token, qué se sincroniza realmente y qué todavía queda fuera de alcance.',
    keywords: [
      'Jumia',
      'Jumia Vendor Center',
      'conector de Jumia',
      'integración de marketplace',
      'e-commerce africano',
      'Sources',
      'AskBiz',
      'sincronización de stock',
      'sincronización de pedidos',
    ],
    keyTakeaways: [
      'Jumia vive bajo Sources > E-Commerce junto a Shopify, Amazon FBA, eBay, Etsy, WooCommerce y Walmart — pero a diferencia de esas, no usa una redirección OAuth de un clic.',
      'Lo conectas manualmente, pegando un Client ID y un Refresh Token que generas tú mismo en Jumia Vendor Center > Settings > Applications (Self Authorisation).',
      'Cada sincronización trae los pedidos recientes y los niveles de stock actuales de tus tiendas de Jumia; la cifra de pago mostrada por pedido es una estimación a partir de los ingresos del pedido, no el estado de liquidación oficial de Jumia.',
      'El stock de Jumia alimenta directamente tu vista de inventario del CFO y las alertas de stock bajo etiquetadas por canal — los envíos y el seguimiento de entregas de Jumia quedan deliberadamente fuera del alcance de este conector.',
      'Este es un conector recién construido, revisado internamente contra la API de Jumia pero aún no verificado de principio a fin en una cuenta de vendedor en vivo — vale la pena revisar tu primera sincronización contra los propios números de Vendor Center.',
    ],
    content: [
      {
        heading: 'Qué hace el conector de Jumia',
        body: 'Jumia es una de las fuentes de E-Commerce bajo Sources en AskBiz, junto a Shopify, Amazon FBA, eBay, Etsy, WooCommerce y Walmart. Una vez conectado, es una sincronización de solo lectura: AskBiz lee tus pedidos recientes y niveles de stock actuales de Jumia Vendor Center y los incorpora a tus datos de negocio unificados, el mismo lugar donde llega cada otro canal —tu caja física, tu tienda de Shopify, tus listados de Amazon. Ese es el punto de conectarlo en absoluto: en lugar de iniciar sesión en Vendor Center por separado para ver cómo va tu tienda de Jumia, sus pedidos y stock aparecen junto a todo lo demás, en un solo panel, en tu moneda local.',
      },
      {
        heading: 'Por qué no hay un botón "Conectar" de un clic',
        body: 'Shopify, Amazon FBA, eBay y Etsy usan todos OAuth estándar —haces clic en Conectar, te redirigen a iniciar sesión en esa plataforma, apruebas el acceso, y vuelves a AskBiz ya conectado. El Vendor Center de Jumia no ofrece eso para aplicaciones de terceros. En su lugar, funciona con lo que Jumia llama Self Authorization: creas tu propia Application dentro de tu propia cuenta de Vendor Center, y eso genera un Client ID y un Refresh Token limitados a tu tienda. No hay ninguna app propiedad de AskBiz que estés aprobando y ninguna contraseña se transmite entre las dos —estás generando un par de credenciales que solo controla tu cuenta de Jumia, y luego entregando esos dos valores directamente a AskBiz.',
      },
      {
        heading: 'Cómo conectar tu cuenta, paso a paso',
        body: 'Inicia sesión en Jumia Vendor Center y ve a Settings, luego Applications. Haz clic en Create Application y elige Self Authorisation como tipo. Jumia te mostrará un Client ID —cópialo— y te dejará generar un Refresh Token —cópialo también. De vuelta en AskBiz, ve a Sources, busca Jumia bajo E-Commerce, y pega el Client ID en el campo Client ID y el Refresh Token en el campo Refresh Token (este está enmascarado, como una contraseña). AskBiz verifica las credenciales de inmediato solicitando un token de acceso a Jumia y confirmando que puede leer la lista de tu tienda antes de guardar la conexión. Si esa verificación falla, la causa más común es que la Application no tenga habilitados los permisos de Order o Product en Vendor Center —vuelve y confirma que esos roles estén marcados, y vuelve a intentarlo.',
      },
      {
        heading: 'Qué se sincroniza realmente — y qué no',
        body: 'Cada sincronización trae tus pedidos recientes (una ventana móvil, los más recientes primero) y, para cada uno, las líneas de artículo individuales —el modelo de Jumia devuelve una fila por unidad vendida en lugar de un campo de cantidad, así que una línea de 3 unidades en tu tienda vuelve como tres artículos separados, cada uno con su propio precio, descuento, impuesto y cifra de envío. Los niveles de stock provienen de un endpoint de catálogo separado, indexado por SKU. Vale la pena saber: el monto de pago que verás contra un pedido de Jumia en AskBiz se calcula a partir de los ingresos netos de ese pedido después de descuentos, no se trae del informe de liquidación oficial de Jumia —Jumia solo expone las deducciones reales de comisión y tarifas en un endpoint de informe de pagos separado que este conector actualmente no lee. Trata la cifra de pago como una estimación útil para seguir tendencias, no como un sustituto del informe de pagos dentro del propio Vendor Center cuando necesites el número exacto. El conector también es de solo lectura en ambas direcciones de alcance: nunca escribe de vuelta a tus listados, precios o stock de Jumia, y deliberadamente no toca los datos de envío o seguimiento de entrega de Jumia —este conector trata sobre visibilidad de ventas y stock, no logística de cumplimiento.',
      },
      {
        heading: 'Dónde lo verás en AskBiz',
        body: 'Los pedidos de Jumia cuentan hacia tus totales combinados de ingresos y pedidos en todos los canales conectados, cada uno valorado en la moneda local propia de la tienda. Los niveles de stock alimentan tu vista de Inventario del CFO, fusionados con el mismo producto donde sea posible —ten en cuenta que el feed de stock de Jumia no incluye un nombre de producto, así que hasta que se empareje con un listado nombrado de otro canal, AskBiz muestra el SKU en su lugar. Las alertas de stock bajo están etiquetadas por canal, así que una advertencia de que un SKU de Jumia está bajo no se confundirá con el mismo SKU funcionando bien en tu tienda física. Y en el filtro de canal de la pestaña Intelligence, Jumia es una opción seleccionable, así que puedes ver el rendimiento de Jumia de forma aislada del resto de lo que vendes.',
      },
      {
        heading: 'Vale la pena saber antes de confiar en él',
        body: 'Este conector se agregó recientemente. Ha sido construido y revisado internamente contra la API documentada del Vendor Center de Jumia, pero aún no se ha ejecutado de principio a fin contra una cuenta de vendedor de Jumia real y activa —así que trata tu primera sincronización como algo que hay que revisar contra las propias cifras de pedidos y stock de Vendor Center en lugar de asumir que es exacta desde el primer día. Si una sincronización deja de funcionar con un error sobre el refresh token, eso casi siempre significa que fue revocado o expiró en Vendor Center —genera un nuevo Client ID y Refresh Token y reconecta desde Sources. Detrás de escena, AskBiz también genera un token de acceso fresco a partir de tu refresh token en cada sincronización en lugar de intentar reutilizar uno, ya que los tokens de acceso de Jumia son de corta duración, y deliberadamente ritma sus solicitudes para mantenerse por debajo del límite de tasa de Jumia en lugar de dispararlas todas de una vez. Como cada sincronización trae un lote limitado de tus pedidos más recientes, una tienda de muy alto volumen puede ver que su historial reciente completo se completa en un par de sincronizaciones en lugar de todo de una vez en la primera ejecución.',
      },
    ],
    faq: [
      {
        q: '¿Conectar Jumia funciona igual que Shopify o Amazon, con una redirección de inicio de sesión?',
        a: 'No. Shopify, Amazon FBA, eBay y Etsy usan OAuth —haces clic en Conectar e inicias sesión en su sitio. Jumia no soporta eso para aplicaciones de terceros, así que generas un Client ID y un Refresh Token tú mismo en Jumia Vendor Center > Settings > Applications, y luego pegas ambos en AskBiz bajo Sources.',
      },
      {
        q: '¿Puede AskBiz cambiar mis precios, listados o niveles de stock en Jumia?',
        a: 'No. El conector es de solo lectura —lee tus pedidos y stock de Jumia, nunca escribe nada de vuelta a tu tienda de Jumia.',
      },
      {
        q: '¿Veré el estado de envío o entrega de Jumia en AskBiz?',
        a: 'Actualmente no. Los datos de envío y seguimiento de entrega quedan deliberadamente fuera del alcance de este conector —cubre pedidos, ingresos y stock, no logística.',
      },
      {
        q: 'El monto de pago en un pedido de Jumia no coincide con lo que Jumia realmente me paga — ¿por qué?',
        a: 'Esa cifra se estima a partir de los ingresos netos del pedido después de descuentos, no se trae del informe de pagos oficial de Jumia, que reporta las deducciones reales de comisión y tarifas por separado. Usa el propio informe de pagos de Vendor Center para el monto exacto liquidado.',
      },
      {
        q: 'Mi sincronización de Jumia dejó de funcionar de repente — ¿qué hago?',
        a: 'Esto casi siempre significa que tu Refresh Token fue revocado o expiró en Vendor Center. Genera un nuevo Client ID y Refresh Token desde Settings > Applications y reconecta desde Sources con los valores nuevos.',
      },
    ],
  },

  'pos-receipt-design-vat-askbiz': {
    title: 'El recibo de caja rediseñado de AskBiz: diseño detallado e IVA dinámico',
    description:
      'El recibo de WhatsApp que envía AskBiz después de una venta ahora es una imagen con estilo de recibo de tienda real —bordes rasgados, total enmarcado, código de barras decorativo— y su línea de IVA solo aparece para negocios que realmente tienen un número de IVA registrado.',
    keywords: [
      'diseño de recibo',
      'recibo de caja',
      'recibo de WhatsApp',
      'recibo de IVA',
      'IVA dinámico',
      'AskBiz POS',
      'recibo digital',
      'imagen de recibo',
    ],
    keyTakeaways: [
      'El recibo que envía AskBiz por WhatsApp después de una venta ahora es una imagen renderizada con estilo de recibo de caja real —tipografía monoespaciada Courier Prime, bordes superior e inferior rasgados/perforados, un TOTAL enmarcado, y un código de barras decorativo— ya no es el resumen de texto plano que solía ser.',
      'Una línea "N.º de reg. IVA" y una etiqueta de impuesto "IVA (tasa%)" solo aparecen si tu negocio tiene un número de IVA guardado en Configuración. Si no hay número de IVA registrado, los clientes ven en su lugar una línea genérica de "Impuesto" —no hay un interruptor de activación/desactivación separado, el número en sí es el indicador.',
      'AskBiz siempre intenta enviar primero la imagen; si eso falla por cualquier motivo, recurre automáticamente a un mensaje de resumen en texto más corto, sin nada que configurar o reintentar de tu parte.',
      'La imagen se genera fresca a partir de la transacción real cada vez que se solicita, así que nunca es una captura de pantalla obsoleta —y la solicitud en sí no necesita inicio de sesión, porque es el ID de transacción imposible de adivinar el que hace de control de acceso.',
    ],
    content: [
      {
        heading: 'Qué cambió',
        body: 'Cuando el recibo de un cliente sale por WhatsApp después de una venta, solía llegar como un mensaje de texto plano —una línea o dos resumiendo el total, el nombre de tu negocio y el método de pago. Eso sigue existiendo como respaldo, pero ya no es lo que ven la mayoría de los clientes. El recibo principal que envía AskBiz ahora es una imagen real, diseñada y con estilo para parecer un recibo de caja impreso, con cada línea de artículo, el subtotal, cualquier descuento, impuesto y el total final mostrados exactamente como los mostraría un recibo en papel. Nada cambia de tu lado para obtener esto —es automático en cada venta donde se envía un recibo.',
      },
      {
        heading: 'Cómo se ve un recibo rediseñado',
        body: 'La imagen está compuesta en Courier Prime, una fuente monoespaciada estilo máquina de escribir, que es la mayor parte de lo que hace que se lea como un recibo en lugar de una tarjeta de mensaje genérica. Los bordes superior e inferior se dibujan como un zigzag rasgado/perforado, tal como se ve un recibo cuando se arranca de un rollo. La línea TOTAL está dentro de su propio recuadro cerca de la parte inferior para que sea la cifra imposible de pasar por alto. Debajo de eso hay un código de barras decorativo —una fila de barras verticales de altura variable, generadas de forma determinística usando el ID de transacción como semilla, así que el mismo recibo siempre se renderiza con las mismas barras si alguna vez se vuelve a consultar. No es un código de barras real y escaneable; está ahí por el efecto visual de un recibo de caja genuino, con el número de recibo impreso debajo en el lugar donde un código de barras normalmente codificaría algo.',
      },
      {
        heading: 'Todo lo que se imprime en el recibo',
        body: 'Leyendo de arriba a abajo: el nombre de tu negocio (en mayúsculas), seguido de la línea de registro de IVA si tienes una registrada, luego un número de recibo —los primeros 8 caracteres del ID de transacción, sin guiones y en mayúsculas— junto con la fecha y hora. Debajo de eso, "Atendido por [nombre del cajero]" aparece a la izquierda si la venta se registró bajo el inicio de sesión de un cajero nombrado, con el método de pago mostrado en mayúsculas a la derecha. Luego las líneas de artículos: el nombre de cada producto y el total de la línea completa en una fila, con la cantidad y el precio unitario ("2 x $4.50") impresos debajo. Después de los artículos viene el subtotal, una línea de descuento solo si realmente se aplicó un descuento a la venta, y una línea de impuesto solo si la venta realmente llevaba algún impuesto —una venta sin impuesto simplemente no tiene ninguna fila de impuesto. El TOTAL enmarcado cierra todo, seguido del código de barras, el número de recibo de nuevo, y una línea de agradecimiento.',
      },
      {
        heading: 'El IVA es dinámico — depende de tu Configuración',
        body: 'La línea de impuesto no está fija para decir siempre "IVA" o siempre "Impuesto" —cambia según el negocio, basándose en una sola cosa: si tienes un número de IVA guardado en Configuración. Si has ingresado uno, el recibo muestra una línea "N.º de reg. IVA" justo debajo del nombre de tu negocio, y la línea de impuesto en sí está etiquetada "IVA", con la tasa añadida cuando todos los artículos de esa venta comparten una sola tasa de impuesto (por ejemplo "IVA (16%)"). Si tus artículos tienen tasas mixtas, recurre a una etiqueta simple de "IVA" en lugar de adivinar una tasa. Si no tienes un número de IVA registrado, nada de eso aparece —el recibo muestra una línea genérica de "Impuesto" en su lugar, sin línea de registro arriba del nombre del negocio. No hay ningún interruptor separado para esto en ninguna parte de AskBiz; el campo del número de IVA en sí es la única bandera de registro que tiene el sistema, así que agregarlo o quitarlo en Configuración es lo que activa o desactiva el texto específico de IVA en el recibo.',
      },
      {
        heading: 'Cómo decide AskBiz si enviar la imagen o recurrir al texto',
        body: 'Cada intento de envío de recibo empieza probando la plantilla de imagen. WhatsApp exige que las plantillas de mensajes empresariales sean preaprobadas por Meta antes de poder usarse, y el encabezado de la plantilla de imagen no es una imagen fija subida —es un enlace de vuelta a AskBiz que los propios servidores de entrega de Meta consultan en el momento en que el mensaje realmente se envía, que es exactamente por qué el recibo siempre refleja la transacción real en lugar de una imagen guardada de antes. Si ese envío de imagen falla por cualquier motivo —lo más común porque la plantilla todavía está en la cola de revisión de Meta— AskBiz automáticamente reintenta con una plantilla de texto aprobada, separada y más corta, con solo el total, el nombre del negocio, la fecha y el método de pago. No ves esta decisión ocurrir y no hay nada que configurar: el que tenga éxito es lo que recibe el cliente, y una vez que la plantilla de imagen esté completamente aprobada, los envíos tienen éxito en el intento de imagen como algo normal.',
      },
      {
        heading: 'Por qué el enlace del recibo no necesita inicio de sesión',
        body: 'Como son los servidores de Meta —no tu navegador ni tu caja— los que buscan la imagen del recibo en el momento de la entrega, esa solicitud no puede llevar una sesión de inicio de sesión de AskBiz consigo; no hay ningún usuario que autenticar. Así que el endpoint que genera la imagen se deja intencionalmente abierto, y su única protección es que el ID de transacción en el enlace es un UUID imposible de adivinar en lugar de un número secuencial pequeño —el mismo modelo de confianza que usa AskBiz para cualquier otro enlace limitado a una sola transacción. En la práctica, esto significa que el enlace de la imagen no es algo que quieras reenviar por ahí casualmente fuera de WhatsApp, ya que cualquiera que tenga el enlace exacto puede ver ese recibo, pero no es algo que tengas que hacer nada al respecto —es cómo está diseñado para funcionar el envío automático.',
      },
    ],
    faq: [
      {
        q: '¿Necesito activar el nuevo diseño de recibo en algún lugar de Configuración?',
        a: 'No —el recibo con estilo de imagen es lo que envía AskBiz automáticamente en cada recibo de WhatsApp ahora. No hay ningún interruptor que buscar; si el envío de la plantilla de imagen falla por cualquier motivo, recurre a un resumen en texto por su cuenta.',
      },
      {
        q: '¿Por qué mi recibo dice "Impuesto" en lugar de "IVA"?',
        a: 'El texto de IVA solo aparece cuando tu negocio tiene un número de IVA guardado en Configuración —ese campo es la única bandera de registro de IVA que tiene AskBiz. Agrega tu número de IVA ahí y tanto la línea "N.º de reg. IVA" como la etiqueta de impuesto "IVA" empezarán a aparecer en los recibos.',
      },
      {
        q: '¿Por qué la línea de IVA a veces solo dice "IVA" sin porcentaje?',
        a: 'AskBiz solo imprime una tasa (como "IVA (16%)") cuando todos los artículos de esa venta en particular comparten una sola tasa de impuesto. Si la venta mezcla artículos con tasas diferentes, muestra la etiqueta simple "IVA" en lugar de elegir una tasa que no sería precisa para todo el recibo.',
      },
      {
        q: '¿El código de barras del recibo es algo que un cliente realmente podría escanear?',
        a: 'No —es decorativo. Las barras se generan a partir del ID de transacción, así que el mismo recibo siempre se ve igual si se vuelve a consultar, pero no codifican nada que un escáner pueda leer. La referencia real de una transacción es el número de recibo impreso arriba y abajo de él.',
      },
      {
        q: '¿Puede cualquiera con el enlace de la imagen del recibo ver el recibo de otra persona?',
        a: 'El enlace no está protegido por un inicio de sesión —no puede estarlo, ya que los propios servidores de entrega de WhatsApp lo consultan, no un navegador con sesión iniciada— pero sí está protegido por que el ID de transacción es un UUID imposible de adivinar. Trata el enlace como tratarías cualquier número de referencia de un solo uso: está bien tal como se envía al cliente por WhatsApp, no es algo para publicar o reenviar en otro lugar.',
      },
    ],
  },

  'whatsapp-daily-pl-brief-askbiz': {
    title: 'Tu resumen diario ahora llega como un informe de P&L por WhatsApp',
    description:
      'El mensaje diario automático de AskBiz ahora llega a WhatsApp como un informe real de ventas, ganancias y pérdidas de las últimas 24 horas y los últimos 7 días —así se activa y así se interpretan los números.',
    keywords: [
      'resumen diario de WhatsApp',
      'informe de P&L por WhatsApp',
      'notificaciones de AskBiz',
      'ganancias y pérdidas',
      'informe de ventas diario',
      'resumen diario de POS',
      'configuración de notificaciones de WhatsApp',
    ],
    keyTakeaways: [
      'Actívalo en Configuración > Notificaciones, bajo Canales, activando el interruptor de WhatsApp —un campo de número de teléfono solo aparece una vez que el interruptor está activado.',
      'Se envía automáticamente una vez al día, y solo a cuentas con POS habilitado que tengan las notificaciones de WhatsApp activadas y un número guardado. Las cuentas solo con email no lo reciben.',
      'Cada mensaje reporta ventas, ganancia (ventas menos el costo real por línea de artículo de los bienes vendidos) y pérdidas por reembolsos —tanto para las últimas 24 horas como para los últimos 7 días— más un enlace de vuelta a askbiz.co/home.',
      'Las pérdidas cuentan los reembolsos por cuándo se procesó el reembolso, no por cuándo ocurrió la venta original —reembolsar una venta antigua hoy suma a la cifra de pérdida de hoy.',
      'Esto reemplazó la versión anterior por email del mensaje diario automático para las cuentas suscritas a WhatsApp. Tu Resumen Diario dentro de la app —con su puntuación de salud, anomalías y acción sugerida— es una función separada y sigue funcionando exactamente igual que antes.',
    ],
    content: [
      {
        heading: 'Qué cambió realmente',
        body: 'AskBiz solía enviar un email matutino automático construido alrededor de tres líneas generadas por IA —algo que mejoró, algo que necesitaba atención, y una acción sugerida para el día. Ese email se retiró para las cuentas que se suscriben a WhatsApp. En su lugar, ahora un trabajo cron diario envía un informe de P&L en lenguaje sencillo directo a WhatsApp: ventas reales, ganancia real y pérdidas reales, extraídas directamente de tus datos de transacciones en lugar de resumidas en una narrativa. Sin interpretación de IA, sin jerga —solo las cifras de las últimas 24 horas y los últimos 7 días, con el formato de la moneda de tu cuenta. La versión anterior intentaba decirte qué importaba; esta versión simplemente te da las cifras y te deja decidir.',
      },
      {
        heading: 'Cómo activarlo',
        body: 'Ve a Configuración > Notificaciones en AskBiz y busca la sección Canales. Hay dos interruptores aquí: Alertas por email y WhatsApp. Activa el interruptor de WhatsApp, y un campo de número de teléfono aparece de inmediato debajo —este campo está oculto hasta que activas el interruptor, así que si no ves dónde ingresar un número, revisa primero que el interruptor esté activado. Ingresa tu número de WhatsApp en formato internacional (por ejemplo +254 700 000000) y guarda. Eso es toda la configuración —no hay un paso de suscripción separado ni un mensaje de confirmación que aprobar, y no hay período de espera antes de que pueda salir el primer mensaje. Si más adelante vuelves a desactivar el interruptor, el campo del número desaparece de nuevo, pero tu número guardado no recibe nada más hasta que lo vuelvas a activar.',
      },
      {
        heading: 'Quién lo recibe realmente',
        body: 'El envío diario está más restringido de lo que podría parecer. Solo llega a cuentas donde el POS está habilitado —si usas AskBiz exclusivamente para fuentes conectadas como Shopify o feeds bancarios sin tener el POS activado, este mensaje en particular no se te envía, sin importar tu configuración de notificaciones. Además de eso, necesitas tanto el interruptor de WhatsApp activado como un número guardado; tener solo uno de los dos significa que te saltas, y el cron simplemente pasa a la siguiente cuenta sin generar nada para ti. Y es estrictamente una vez por negocio por día —si ya se generó un resumen para tu cuenta en la fecha de hoy, el cron no generará ni enviará un segundo, aunque vuelvas a revisar más tarde ese mismo día. Tampoco hay una opción manual de "enviar ahora" —el mensaje solo sale según su propio calendario.',
      },
      {
        heading: 'Cómo se calculan las ventas, la ganancia y las pérdidas',
        body: 'Ventas es el total de tus transacciones de POS completadas en la ventana de tiempo —los pagos con tarjeta o dinero móvil pendientes que aún no se han confirmado no se cuentan hasta que lo hacen. La ganancia no es una estimación aproximada de margen —es ventas menos el costo real de los bienes vendidos, calculado línea de artículo por línea de artículo a partir de la cantidad y el precio de costo registrados en cada producto vendido, luego sumados a lo largo de la ventana. Las pérdidas representan el valor de los artículos reembolsados, no solo un conteo de eventos de reembolso, y se extraen de un conjunto separado de transacciones —cualquiera marcada como reembolsada o parcialmente reembolsada. Aquí es donde la lógica es fácil de malinterpretar: las pérdidas se atribuyen al día en que se procesó el reembolso, no al día en que ocurrió la venta original. Si un cliente compró algo hace tres semanas y procesas el reembolso esta mañana, el valor completo de ese reembolso cae en la cifra de pérdida de hoy —no ajusta retroactivamente el día de la venta original. En una ventana de 7 días esto rara vez causa confusión, pero vale la pena saberlo si alguna vez ves una cifra de pérdida de 24 horas que parece desconectada de la actividad comercial real de ese día.',
      },
      {
        heading: 'Qué verás, y a qué enlaza',
        body: 'El mensaje en sí es un texto corto de WhatsApp: el nombre de tu negocio arriba, luego Ventas, Ganancia y Pérdidas de las últimas 24 horas, seguido de las mismas tres cifras de los últimos 7 días, y un enlace a askbiz.co/home al final. Como es un mensaje de WhatsApp plano, las cifras en sí son legibles en el momento en que llega —sin necesidad de abrir ninguna app, sin iniciar sesión solo para verlas. El enlace es un atajo de vuelta a AskBiz si quieres profundizar más en una cifra; abrirlo igual te pedirá iniciar sesión de la misma forma que cualquier otro enlace de AskBiz.',
      },
      {
        heading: 'Lo que esto no reemplaza',
        body: 'Vale la pena aclarar el límite aquí. El informe de WhatsApp es una función separada de tu Resumen Diario dentro de la app —el que tiene una Puntuación de Salud del Negocio, marcas de anomalías y una acción sugerida, disponible siempre que abras AskBiz. Ese endpoint y sus datos no se tocaron con este cambio y siguen funcionando de forma independiente a si tienes las notificaciones de WhatsApp activadas. Lo que sí cambió es el envío automático: la antigua narrativa por email que solía llegar sin que la pidieras cada mañana ya no existe para las cuentas suscritas a WhatsApp, reemplazada por este mensaje de P&L más literal. Si quieres la puntuación de salud y el resumen estilo lista de acciones, eso sigue viviendo dentro de la app —simplemente ya no es lo que se envía automáticamente a tu teléfono.',
      },
    ],
    faq: [
      {
        q: 'No uso AskBiz POS — ¿recibiré este mensaje de WhatsApp?',
        a: 'No. El envío diario solo llega a cuentas con POS habilitado, porque las cifras de ventas, ganancia y pérdidas se calculan a partir de datos de transacciones y reembolsos del POS. Si solo usas AskBiz para fuentes conectadas como Shopify o un feed bancario, este mensaje en particular no se te envía.',
      },
      {
        q: 'Ya tengo activadas las Alertas por email — ¿necesito hacer algo más?',
        a: 'Sí. Alertas por email y WhatsApp son interruptores separados en Configuración > Notificaciones, y solo el interruptor de WhatsApp (más un número guardado) activa este mensaje diario. Tener solo las Alertas por email activadas no lo habilita.',
      },
      {
        q: '¿Por qué una pérdida en el mensaje de hoy viene de una venta que hice hace semanas?',
        a: 'Las pérdidas se cuentan por la fecha en que se procesó el reembolso, no por la fecha de la venta original. Si reembolsas una transacción antigua hoy, su valor cuenta hacia la cifra de pérdida de hoy tanto en el total de 24 horas como en el de 7 días.',
      },
      {
        q: '¿Puedo recibir más de uno de estos mensajes si vuelvo a revisar la app más tarde en el día?',
        a: 'No. El resumen se genera una vez por negocio por día calendario —si ya se creó uno para hoy, el cron se salta tu cuenta en lugar de generar o enviar un duplicado.',
      },
      {
        q: '¿Esto reemplaza el Resumen Diario que veo dentro de la app, con la puntuación de salud y la acción sugerida?',
        a: 'No, esa es una función separada y no se ha tocado. El Resumen Diario dentro de la app sigue calculando su propia puntuación de salud, anomalías y acción de forma independiente, y puedes abrirlo en AskBiz en cualquier momento sin importar tu configuración de WhatsApp.',
      },
    ],
  },

  'forgot-pin-reset-whatsapp-askbiz': {
    title: '¿Olvidaste tu PIN de AskBiz? Restablécelo tú mismo por WhatsApp',
    description:
      'Cómo recuperar tu propio PIN de inicio de sesión de AskBiz sin contactar a soporte —verifica tu teléfono por WhatsApp y establece un nuevo PIN de 4 dígitos en menos de un minuto.',
    keywords: [
      'olvidé mi PIN',
      'restablecer PIN',
      'AskBiz',
      'verificación de WhatsApp',
      'iniciar sesión',
      'inicio de sesión por teléfono',
      'recuperación de cuenta',
      'tutorial',
    ],
    keyTakeaways: [
      '¿Olvidaste tu PIN? en la página de inicio de sesión inicia un restablecimiento autoservicio —ingresa tu número de teléfono, confirma un código de 6 dígitos enviado por WhatsApp, y luego establece un nuevo PIN de 4 dígitos.',
      'El código expira después de 10 minutos, permite 5 intentos, y hay un tiempo de espera de 60 segundos antes de poder solicitar otro.',
      'Esto restablece tu propio PIN de inicio de sesión de propietario para la app principal de AskBiz —no tiene nada que ver con los PIN de caja del personal del POS, que un gerente sigue restableciendo desde POS > Personal > Editar > Restablecer PIN.',
      'Antes de que esto se lanzara, un propietario bloqueado no tenía ninguna opción de autoservicio —el único camino era contactar a soporte y esperar a que un administrador generara y transmitiera un PIN temporal a mano.',
    ],
    content: [
      {
        heading: 'Dos PIN diferentes, y este trata sobre uno de ellos',
        body: 'AskBiz en realidad tiene dos PIN que es fácil confundir. Tu PIN de inicio de sesión es lo que usas para entrar a la app principal de AskBiz en tu propio número de teléfono —es cómo tú (el propietario de la cuenta) accedes a tu panel, informes y configuración. Un PIN de caja del personal del POS es algo completamente separado: un código corto que un gerente asigna a cada cajero para que pueda registrarse en la caja sin compartir el inicio de sesión del propietario. Este artículo trata sobre el primero —tu propio PIN de inicio de sesión. Si un cajero olvidó su PIN de caja, eso se arregla con un gerente o propietario yendo a POS > Personal, haciendo clic en Editar junto a su nombre, y eligiendo Restablecer PIN —nada de ese proceso ha cambiado. Lo nuevo es una forma de que tú recuperes tu propio PIN de inicio de sesión sin la ayuda de nadie más.',
      },
      {
        heading: 'Dónde encontrarlo',
        body: 'En la página de inicio de sesión de AskBiz, busca justo debajo del campo de PIN un enlace ¿Olvidaste tu PIN?. Al hacer clic te lleva a una página de recuperación dedicada en askbiz.co/forgot-pin, separada de la tarjeta de inicio de sesión principal, diseñada como una pantalla estrecha y de un solo propósito para que sea obvio que estás en un flujo de recuperación en lugar de iniciando sesión normalmente.',
      },
      {
        heading: 'Paso 1: Confirma tu número de teléfono',
        body: 'Ingresa el número de teléfono registrado en tu cuenta de AskBiz, incluyendo el código de país correcto —el mismo número con el que normalmente inicias sesión. Toca Enviar código por WhatsApp. Sea cual sea el número que ingreses, verás el mismo mensaje de confirmación después: AskBiz nunca revela en esta pantalla si ese número realmente pertenece a una cuenta. Eso es deliberado —evita que el flujo de restablecimiento se use como una forma de verificar qué números de teléfono están registrados en AskBiz. Si el número sí pertenece a una cuenta, un código de 6 dígitos llega por WhatsApp en cuestión de momentos.',
      },
      {
        heading: 'Paso 2: Ingresa el código y elige un nuevo PIN',
        body: 'En la siguiente pantalla, ingresa el código de 6 dígitos de WhatsApp junto con un nuevo PIN de 4 dígitos, escrito dos veces para confirmar que coincide. Envía, y —suponiendo que el código sea correcto y siga siendo válido— tu PIN de inicio de sesión se actualiza de inmediato. Serás llevado a una pantalla de confirmación con un enlace directo de vuelta a iniciar sesión, donde tu nuevo PIN funciona de inmediato.',
      },
      {
        heading: 'Los límites, y por qué existen',
        body: 'Algunos límites protegen este flujo de abuso. El código expira 10 minutos después de enviarse, así que un código viejo y sin usar en un hilo de WhatsApp no se puede usar más tarde. Tienes 5 intentos para ingresarlo correctamente antes de que se invalide y tengas que solicitar uno nuevo. Y si tocas Reenviar código, hay un tiempo de espera de 60 segundos antes de que realmente salga otro, lo que evita que el mismo número se inunde de códigos. Nada de esto debería interponerse en tu camino durante un restablecimiento normal —ingresa el código una vez, correctamente, dentro de unos minutos después de que llegue, y listo. Los límites solo entran en juego si algo salió mal, que es exactamente cuando quieres que lo hagan.',
      },
      {
        heading: 'Cómo AskBiz vincula tu número de teléfono con tu cuenta',
        body: 'Detrás de escena, AskBiz busca tu número de teléfono en una tabla dedicada construida específicamente para este propósito, en lugar de depender del número de teléfono guardado en tu configuración general de perfil. Esa distinción importa: el campo de teléfono de tu perfil es solo un valor de configuración editable —podrías actualizarlo en cualquier momento, y nada impide que dos personas ingresen por error un número parecido. El flujo de restablecimiento necesita un vínculo inequívoco y confiable entre un número de teléfono y exactamente una cuenta antes de dejar que alguien cambie un PIN, así que usa un registro de identidad separado en su lugar, configurado cuando te registraste por primera vez y mantenido sincronizado desde entonces.',
      },
      {
        heading: 'Cómo se veía la recuperación antes de que esto existiera',
        body: 'Hasta finales de julio de 2026, no había ninguna opción de autoservicio. Si olvidabas tu PIN de inicio de sesión de AskBiz, el único camino era contactar a soporte directamente —por email o WhatsApp— explicar quién eras, y esperar a que un administrador del lado de AskBiz generara manualmente un PIN temporal y te lo transmitiera fuera de banda. Eso funcionaba, pero significaba que cada bloqueo individual necesitaba a una persona del otro lado, y quedabas esperando el tiempo que le tomara a alguien atenderlo. El flujo verificado por WhatsApp hace el mismo trabajo en menos de un minuto, en cualquier momento, sin necesidad de involucrar a nadie más.',
      },
    ],
    faq: [
      {
        q: '¿Es lo mismo que restablecer el PIN de caja de un cajero?',
        a: 'No. Esto restablece tu propio PIN de inicio de sesión de propietario para la app principal de AskBiz. El PIN de caja del POS de un cajero es un sistema completamente separado, y se sigue restableciendo de la misma forma que siempre —un gerente o propietario va a POS > Personal, hace clic en Editar junto a ese miembro del personal, y elige Restablecer PIN.',
      },
      {
        q: 'Ingresé mi número de teléfono pero nunca recibí el código de WhatsApp. ¿Qué pasa?',
        a: 'Verás el mismo mensaje de confirmación "revisa WhatsApp" sin importar si ese número está realmente registrado —eso es intencional, para que la página no pueda usarse para verificar qué números tienen cuentas. Si no llega nada, revisa que hayas ingresado exactamente el número con el que está registrada tu cuenta, incluyendo el código de país, y vuelve a intentar después del tiempo de espera de 60 segundos.',
      },
      {
        q: '¿Cuánto tiempo tengo para ingresar el código antes de que expire?',
        a: '10 minutos desde que se envía. Después de eso ya no es válido y tendrás que solicitar uno nuevo desde la pantalla anterior.',
      },
      {
        q: '¿Qué pasa si sigo ingresando el código incorrecto?',
        a: 'Tienes 5 intentos. Después de eso, el código se invalida por seguridad y tendrás que solicitar uno nuevo en lugar de seguir adivinando.',
      },
      {
        q: '¿Puedo solicitar otro código de inmediato si no recibí el primero?',
        a: 'Hay un tiempo de espera de 60 segundos entre solicitudes de código para el mismo número. Después de esa ventana, toca Reenviar código en la pantalla de verificación para obtener uno nuevo.',
      },
    ],
  },

  'zakat-calculator-charity-askbiz': {
    title: 'La calculadora de zakat de AskBiz: cómo funciona y dónde encontrarla',
    description:
      'Cómo calcula la pestaña de Zakat en Mi Negocio la posición de zakat de tu negocio a partir del inventario en vivo, el efectivo, las cuentas por cobrar y por pagar, cómo hace seguimiento automático del nisab y el hawl, y cómo te conecta con un directorio de organizaciones benéficas asociadas —gratis en todos los planes.',
    keywords: [
      'calculadora de zakat',
      'calculadora de zakat para negocios',
      'calculadora de nisab',
      'seguimiento de hawl',
      'herramienta de zakat empresarial',
      'finanzas islámicas para negocios',
      'directorio de caridad de zakat',
      'AskBiz',
      'Mi Negocio',
    ],
    keyTakeaways: [
      'La calculadora de zakat vive en Mi Negocio (/intelligence) bajo su propia pestaña Zakat —enlace directo /intelligence?tab=zakat— y es gratis en todos los planes, incluido Free, sin necesidad de actualizar.',
      'Calcula el zakat solo sobre activos comerciales: efectivo + inventario (valor de venta al público) + cuentas por cobrar − cuentas por pagar, con un piso de cero. Cualquier cifra se puede anular para un solo cálculo sin tocar tu inventario real ni tus registros del CFO.',
      'El nisab es el umbral estándar basado en peso (87.48g de oro o 612.36g de plata, con la plata usada por defecto) convertido a tu moneda mediante una consulta manual de "Verificar precio actual" —no se actualiza por sí solo.',
      'El hawl (el año lunar de 355 días) se rastrea automáticamente: la barra de progreso comienza el día en que tu base de zakat cruza por primera vez el nisab y se reinicia si vuelve a caer por debajo antes de que termine el año.',
      'Es una herramienta de cálculo, no una fatwa —no cubre normas específicas de madhhab, zakat agrícola o ganadero, oro o plata en posesión personal, ni el patrimonio personal fuera del negocio.',
    ],
    content: [
      {
        heading: 'Dónde encontrarla',
        body: 'Abre Mi Negocio desde la navegación principal —esa es la página en /intelligence— y selecciona la pestaña Zakat. Está junto a Resumen, CFO, Equipo, Logística, Mercado y Acciones, así que es una pestaña de primera clase, no una configuración oculta. Si quieres ir directo, el enlace directo es /intelligence?tab=zakat.\n\nAlgo que vale la pena saber antes de buscarla de otra forma: el chat de IA de AskBiz todavía no puede llevarte directamente a esta pestaña, como sí puede hacerlo con algunas otras partes de la app. Pedirle "llévame a zakat" no te dejará en la pestaña —abre Mi Negocio y haz clic en Zakat directamente en su lugar.',
      },
      {
        heading: 'Es gratis en todos los planes',
        body: 'La calculadora de zakat no está limitada detrás de Growth, Business, ni ningún otro nivel —está disponible en Free sin necesidad de actualizar. Eso es deliberado: el zakat es una obligación religiosa ligada a tu posición comercial real, no una función de análisis premium, así que AskBiz no pone un muro de pago delante de ella.',
      },
      {
        heading: 'Qué calcula realmente: la base de zakat',
        body: 'Cada vez que abres la calculadora, AskBiz extrae cuatro cifras en vivo de los datos de tu negocio y las combina en lo que llama tu base de zakat:\n\n- Efectivo — el saldo de efectivo que has ingresado en la configuración de costos de tu CFO. Si nunca has ingresado uno, la casilla muestra "No establecido" en lugar de tratarlo silenciosamente como cero, para que no subestimes accidentalmente tu posición.\n- Inventario — el valor de venta al público de tu stock activo, calculado como precio de venta × cantidad disponible de todo lo que tienes actualmente.\n- Cuentas por cobrar — dinero que te deben, extraído de tus cuentas por cobrar registradas.\n- Cuentas por pagar — dinero que debes, restado del total. Esto incluye cualquier orden de compra por la que hayas recibido stock pero que aún no hayas pagado completamente a tu proveedor.\n\nLa base de zakat es Efectivo + Inventario + Cuentas por cobrar − Cuentas por pagar, con un piso de cero para que nunca sea negativa. Esto cubre solo activos comerciales —no es una instantánea de todo tu balance general, y excluye deliberadamente activos fijos como equipo o instalaciones, que no son zakatables de la misma manera.\n\nCada una de esas cuatro cifras se puede tocar. Si un número se ve incorrecto —tu saldo de efectivo está desactualizado, o sabes que una cuenta por cobrar acaba de darse de baja— tócalo e ingresa un valor corregido para este cálculo. La anulación solo afecta el resultado que tienes delante: no se escribe de vuelta en tu inventario ni en tus registros del CFO, y no se recordará la próxima vez que abras la pestaña a menos que lo vuelvas a ingresar.',
      },
      {
        heading: 'Nisab: el umbral que decide si debes algo',
        body: 'El zakat solo se vuelve exigible una vez que tu base de zakat está en o por encima del nisab, el umbral mínimo de riqueza. AskBiz usa la definición estándar basada en peso: 87.48g de oro, o 612.36g de plata. La plata se usa por defecto porque es el más bajo de los dos umbrales —puedes cambiar a oro en cualquier momento si es eso lo que prefieres calcular.\n\nLa calculadora no actualiza los precios de los metales por sí sola. Activas una consulta manualmente con el botón "Verificar precio actual", que ejecuta una búsqueda de precio en vivo y convierte el umbral de peso a tu moneda local. AskBiz guarda en caché ese resultado junto con la fecha en que se consultó, así que no busca el precio de nuevo cada vez que abres la pestaña —y cada metal recuerda su propio último precio y fecha consultados por separado, así que alternar entre oro y plata no pierde ninguno de los dos valores. Trata la cifra como una estimación de mercado indicativa en lugar de una tasa exacta al contado; si la precisión realmente importa para tu situación, confírmala de forma independiente antes de confiar en ella.',
      },
      {
        heading: 'Hawl: por qué estar por encima del nisab hoy no es lo mismo que deber zakat hoy',
        body: 'Cruzar el nisab no significa que el zakat sea exigible de inmediato —tu base de zakat necesita mantenerse en o por encima del nisab durante un año lunar completo, el hawl, antes de que realmente se deba algo. AskBiz rastrea el hawl de 355 días automáticamente, sin necesidad de ingreso manual:\n\n- El día en que tu base de zakat cruza el nisab por primera vez, AskBiz inicia el reloj del hawl y muestra una barra de progreso.\n- Si tu base de zakat vuelve a caer por debajo del nisab antes de que se complete el año, el reloj se reinicia. Vuelve a empezar la próxima vez que cruces el umbral de nuevo.\n- Una vez que se completa un hawl completo mientras sigues por encima del nisab, el estado cambia a Vencido ahora, mostrando el 2.5% de tu base de zakat como el monto adeudado.\n\nHasta que se complete el hawl, cualquier cifra mostrada es una estimación en curso basada en tus números actuales, no un monto vencido —seguirá moviéndose a medida que cambien tu efectivo, stock y cuentas por cobrar día a día. La insignia de estado te dice exactamente dónde estás: Verificar precio para empezar (el nisab aún no se ha consultado), Por debajo del nisab, Por encima del nisab (hawl en curso), o Vencido ahora.',
      },
      {
        heading: 'Donar a caridad — y por qué no estás limitado a la lista de AskBiz',
        body: 'Debajo de la calculadora, AskBiz enumera organizaciones benéficas asociadas a las que puedes donar directamente, filtradas según tu país donde AskBiz tenga una coincidencia. Cada entrada enlaza a la propia página de donación de la organización —AskBiz no procesa el pago en sí, solo te dirige hacia allá.\n\nEl directorio es una conveniencia, no un requisito. Eres completamente libre de pagar tu zakat a cualquier organización benéfica o destinatario de tu elección, dentro o fuera de la lista. Si aún no hay nada listado para tu país, eso es un vacío en un directorio que sigue creciendo, no una señal de que no tienes dónde donar —usa cualquier organización en la que ya confíes.',
      },
      {
        heading: 'Lo que esta herramienta no hace',
        body: 'La calculadora de zakat está construida como una herramienta de cálculo basada en la metodología estándar de nisab, hawl y 2.5% para el zakat sobre activos comerciales o de negocio —no es una fatwa, y no pretende serlo. No tiene en cuenta diferencias específicas de madhhab en cómo se calcula el zakat, no cubre zakat agrícola o ganadero, no incluye oro o plata en posesión personal, y no toca tu patrimonio personal fuera del negocio. Si tu situación necesita una resolución en lugar de un número, esa es una conversación para tu propio erudito o imán —AskBiz te da las cifras para llevar a esa conversación, no un sustituto de ella.',
      },
    ],
    faq: [
      {
        q: '¿La calculadora de zakat es realmente gratis, o necesita un plan pagado?',
        a: 'Es genuinamente gratis en todos los planes, incluido Free —no se necesita ninguna actualización para usarla.',
      },
      {
        q: '¿Por qué mi cifra de efectivo muestra "No establecido" en lugar de cero?',
        a: 'AskBiz solo conoce tu saldo de efectivo si has ingresado uno en la configuración de costos de tu CFO. Si no lo has hecho, la casilla muestra "No establecido" en lugar de asumir cero, ya que asumir cero podría subestimar tu base de zakat. Toca la casilla para ingresar una cifra de efectivo directamente para el cálculo.',
      },
      {
        q: 'Si corrijo una cifra en la calculadora, ¿se actualiza mi inventario o mis números del CFO reales?',
        a: 'No. Las anulaciones solo afectan el cálculo que estás viendo en ese momento —nunca se escriben de vuelta en tu inventario, CFO o datos contables, y no se recuerdan la próxima vez que abras la pestaña.',
      },
      {
        q: '¿Estar por encima del nisab significa que debo zakat ahora mismo?',
        a: 'No necesariamente. Necesitas mantenerte en o por encima del nisab durante un año lunar completo (355 días, el hawl) antes de que el zakat realmente sea exigible. AskBiz rastrea esto con una barra de progreso y la reinicia si tu base de zakat vuelve a caer por debajo del nisab antes de que se complete el año.',
      },
      {
        q: '¿Puedo dar mi zakat a una organización benéfica que no está en el directorio de AskBiz?',
        a: 'Sí. La lista de organizaciones benéficas asociadas es una conveniencia para donar directamente desde dentro de AskBiz —eres libre de pagar tu zakat a cualquier organización benéfica o destinatario elegible de tu elección.',
      },
    ],
  },

  'factory-sector-guide-askbiz': {
    title: 'Cómo funciona una fábrica en AskBiz: lotes, calidad, tiempo de inactividad, turnos y guías de remisión',
    description:
      'Un recorrido completo por el modo de sector Fábrica de AskBiz —las nueve páginas dedicadas, las cuatro etapas de captura con cámara, los cinco roles del personal de fábrica y las 12 plantillas de tipo de fábrica que prellenan tu proceso.',
    keywords: [
      'modo Fábrica',
      'AskBiz',
      'manufactura',
      'seguimiento de lotes',
      'control de calidad',
      'tiempo de inactividad',
      'turno',
      'guía de remisión',
      'tipo de fábrica',
      'producción',
    ],
    keyTakeaways: [
      'Fábrica es uno de los seis modos de sector del POS (junto a Retail, Restaurante, Reparación, Salón y Logística), con nueve páginas dedicadas: Captura, Lote, Calidad, Tiempo de inactividad, Turno, Guía de remisión, Producción, Personal y Aprobaciones.',
      'La captura con cámara está dividida en cuatro etapas —entrada, salida, merma, despacho— cada una controlada por su propio permiso, así que a un rol se le puede dar acceso solo a las etapas que realmente debería fotografiar.',
      'Elegir el tipo de negocio "fabricante" durante la incorporación (o más tarde en la configuración de administrador) muestra un selector de tipo de fábrica con 12 plantillas que cubren prensado de aceite, agua, molienda, lácteos, panadería, jabón, avicultura, café, ahumado de pescado y más.',
      'Cada plantilla prellena una guía de etapas y un rango de rendimiento de receta sugerido para tu proceso —las etapas son compartidas, pero los rendimientos varían enormemente según el producto, desde aproximadamente 18% hasta 76% solo para los cuatro tipos de semilla de prensado de aceite.',
      'Existen cinco roles de personal específicos de fábrica —operador de línea, inspector de calidad, supervisor de turno, gerente de producción y gerente de inventario— cada uno mapeado a un conjunto de permisos distinto en lugar de un rol genérico de cajero.',
    ],
    content: [
      {
        heading: 'Fábrica es un modo de sector completo, no un complemento de Retail',
        body: 'AskBiz POS tiene seis modos de sector: Retail, Restaurante, Reparación, Salón, Fábrica y Logística. Retail es el predeterminado para la mayoría de los negocios, pero si diriges un negocio de producción —prensando aceite, moliendo grano, horneando, embotellando agua, haciendo jabón— el modo Fábrica reemplaza el menú de Inventario/Ventas/Clientes estilo retail con un conjunto de páginas construidas alrededor de lotes, no de transacciones de venta individuales. Llegas al modo Fábrica desde POS > Operaciones, donde aparece como uno de los botones de sector junto a los otros cinco. Bajo el capó, el modo Fábrica viene con nueve páginas dedicadas: Captura, Lote, Calidad, Tiempo de inactividad, Turno, Guía de remisión, Producción, Personal y Aprobaciones. Cada una cubre una parte distinta de dirigir un piso de producción, y están diseñadas para usarse juntas en lugar de aisladas —un registro de lote hace referencia a las capturas y controles de calidad tomados durante él, un registro de turno muestra lo que pasó en el piso durante esa ventana de tiempo, y una guía de remisión vincula una captura de despacho con el papeleo que sale junto con la mercancía.',
      },
      {
        heading: 'Captura: cuatro etapas, cuatro permisos separados',
        body: 'Captura es el punto de entrada centrado en la cámara para todo lo que pasa en el piso, y está dividida en cuatro tipos de captura distintos: entrada (fotografiar la materia prima cuando llega), salida (fotografiar lo que un lote realmente produjo), merma (fotografiar defectos, deterioro o pérdida, con un motivo requerido antes de guardar), y despacho (fotografiar el lote saliente, con un destino requerido antes de guardar). Estos no son solo cuatro botones en una pantalla —cada etapa está controlada por su propio permiso (camera.intake, camera.output, camera.wastage, camera.dispatch), así que puedes darle a un operador de línea junior acceso solo a entrada y salida, mantener merma y despacho restringidos a personal más senior, o darle a un rol enfocado en seguridad/logística solo despacho. Esa granularidad es lo que permite que el acceso a la cámara coincida con quién realmente debería estar fotografiando qué, en lugar de un permiso de cámara de todo o nada.',
      },
      {
        heading: 'Lote, Calidad, Tiempo de inactividad, Turno y Guía de remisión',
        body: 'Lote rastrea una corrida de producción de principio a fin —las capturas de entrada y salida vinculadas a ella, la receta y el rendimiento esperado con el que se mide, y si el resultado real quedó dentro, por encima o por debajo de ese rango. Calidad registra los controles de inspección contra un lote, así que los defectos quedan registrados contra la corrida específica que los produjo en lugar de como una nota vaga. Tiempo de inactividad registra las paradas —una falla de máquina, un corte de energía, una falta de suministro— así que puedes ver dónde se está perdiendo realmente el tiempo de producción a lo largo de una semana o un mes, no solo adivinarlo. Turno es un registro dedicado de turno de producción (deliberadamente separado de la tabla de turnos de caja registradora ya existente que se usa en otras partes del POS, ya que un turno de piso de fábrica y una sesión de caja de un cajero son cosas diferentes que miden trabajo diferente). Guía de remisión genera el papeleo de despacho para la mercancía saliente, vinculado a la captura de despacho y las notas de destino ingresadas en esa etapa. Producción te da la vista general a nivel de piso de todo lo anterior, y Aprobaciones es donde un supervisor o gerente aprueba capturas, lotes o guías de remisión que necesitan revisión antes de finalizarse.',
      },
      {
        heading: 'Cinco roles de personal construidos para un piso de fábrica, no una caja de tienda',
        body: 'El modo Fábrica viene con cinco roles de personal dedicados, cada uno mapeado a su propio conjunto de permisos subyacente en lugar de reutilizado del retail: factory-line-operator, factory-quality-inspector, factory-shift-supervisor, factory-production-manager y factory-inventory-manager. Un operador de línea está limitado al trabajo diario de captura y lotes en el piso; un inspector de calidad obtiene las herramientas de controles y registro de defectos; un supervisor de turno supervisa un turno y aprueba lo que pasó durante él; un gerente de producción y un gerente de inventario obtienen visibilidad más amplia sobre lotes, recetas y stock. Asignar el rol correcto importa por más que orden —es lo que determina qué etapas de cámara y qué páginas de Fábrica puede abrir realmente un miembro del personal cuando inicia sesión con su PIN.',
      },
      {
        heading: 'Doce plantillas de tipo de fábrica — una forma de proceso, rendimientos muy distintos',
        body: 'Cuando estableces el tipo de negocio como "fabricante" durante la incorporación —o lo cambias más tarde en la configuración de administrador— AskBiz muestra un selector de tipo de fábrica con 12 plantillas: Prensado de aceite de cocina (ajonjolí, maní, girasol o palma), Agua embotellada, Molienda de maíz, Procesamiento de yuca, Molienda de arroz, Lácteos, Panadería, Jabón, Bloques de concreto, Avicultura, Café y Ahumado de pescado. Elegir una prellena una guía de etapas para tu proceso específico —por ejemplo, la plantilla de prensado de aceite recorre entrada, limpieza/tostado, prensado, filtrado/embotellado y despacho— además de una receta sugerida con un porcentaje de rendimiento esperado y un rango realista de mínimo/máximo, así que no empiezas tu seguimiento de rendimiento desde una tabla en blanco. Las etapas son en gran parte compartidas dentro de una familia de plantillas dada, pero los rendimientos no lo son: solo el prensado de aceite abarca aproximadamente del 18% al 76% dependiendo de cuál de los cuatro tipos de semilla estés usando y si se tostó primero, que es exactamente por qué la plantilla mantiene una fila de receta separada por semilla en lugar de un número combinado. Puedes aceptar las cifras sugeridas de una plantilla como punto de partida y ajustarlas una vez que tus propios lotes muestren una proporción real distinta.',
      },
      {
        heading: 'Qué cambió recientemente, y por qué importa si lo configuraste hace tiempo',
        body: 'Si configuraste el modo Fábrica antes de finales de julio de 2026, vale la pena saber que solo Captura y Aprobaciones estaban realmente funcionales en producción hasta ese momento —Lote, Calidad, Tiempo de inactividad, Turno y Guía de remisión tenían páginas de interfaz completamente construidas, pero las rutas de API detrás de ellas todavía no existían, así que nada de lo ingresado ahí se estaba guardando. Se lanzó una corrección junto con las 12 plantillas de tipo de fábrica, construyendo los cinco backends faltantes y sus tablas de base de datos. La misma corrección también arregló un error de permisos donde factory-line-operator se había estado resolviendo a cero permisos de cámara en lugar del acceso de entrada/salida que debía tener, así que cualquier rol de operador de línea asignado antes de la corrección debería revisarse de nuevo en Personal para confirmar que ahora sí pueda abrir la cámara. Si tu equipo ha estado usando Lote, Calidad, Tiempo de inactividad, Turno o Guía de remisión y no encontraba nada guardado, esa es la explicación —y ya está resuelto, así que vale la pena volver a entrar y reingresar cualquier cosa que hayas intentado registrar durante esa ventana de tiempo.',
      },
    ],
    faq: [
      {
        q: '¿Cómo cambio mi negocio al modo Fábrica?',
        a: 'En POS > Operaciones, haz clic en el botón Fábrica junto a los otros cinco modos de sector. Si estás configurando una cuenta nueva, elegir el tipo de negocio "fabricante" durante la incorporación también muestra el selector de tipo de fábrica directamente; puedes cambiar el tipo de fábrica más tarde desde la configuración de administrador.',
      },
      {
        q: '¿Cuál es la diferencia entre la página de Lote y la página de Captura?',
        a: 'Captura es donde tomas la foto real para un momento específico —entrada, salida, merma o despacho. Lote es el registro que vincula esas capturas para una corrida de producción, junto con la receta contra la que se mide y si el rendimiento llegó según lo esperado.',
      },
      {
        q: '¿Por qué uno de mis empleados no puede usar la cámara en el modo Fábrica?',
        a: 'El acceso a la cámara en el modo Fábrica está dividido en cuatro permisos separados —entrada, salida, merma, despacho— y cada rol de personal solo obtiene los que se supone que debe tener. Revisa su rol asignado en Fábrica > Personal; si está en factory-line-operator y fue configurado antes de la corrección de permisos de julio de 2026, verifica de nuevo que ahora tenga camera.intake y camera.output como se espera.',
      },
      {
        q: '¿Las 12 plantillas de tipo de fábrica me obligan a un proceso fijo?',
        a: 'No. Una plantilla prellena una guía de etapas y una receta inicial con un rango de rendimiento esperado, pero cada campo es editable. Una vez que hayas corrido algunos lotes reales y sepas tu rendimiento real, actualiza la receta para que coincida —la plantilla es un punto de partida, no una restricción.',
      },
      {
        q: 'Mi fábrica hace algo que no está en las 12 plantillas — ¿puedo seguir usando el modo Fábrica?',
        a: 'Sí. Las 12 plantillas son ajustes preestablecidos de conveniencia para sectores manufactureros africanos comunes, no un requisito. Puedes usar las páginas de Captura, Lote, Calidad, Tiempo de inactividad, Turno, Guía de remisión, Producción, Personal y Aprobaciones del modo Fábrica sin elegir una plantilla —simplemente estarás ingresando tus propios nombres de etapas y cifras de receta desde cero en lugar de partir de unos prellenados.',
      },
    ],
  },

  'pos-free-trial-explained-askbiz': {
    title: 'Cómo funciona la prueba gratuita del POS de AskBiz',
    description:
      'AskBiz POS ofrece una prueba gratuita única de 30 días sin necesidad de tarjeta. Aquí te explicamos exactamente cómo reclamarla, qué incluye y qué pasa cuando termina.',
    keywords: ['prueba gratuita de POS', 'AskBiz POS', 'prueba de 30 días', 'sin tarjeta requerida', 'pos/activate', 'expiración de prueba', 'facturación'],
    keyTakeaways: [
      'La prueba gratuita es solo para POS, dura 30 días y no requiere tarjeta —cada cuenta puede reclamarla una vez.',
      'La verás ofrecida en dos lugares: un banner en la pantalla final de incorporación para registros de perfil POS, y de nuevo en la página pos/activate si aún no la has reclamado.',
      'Cuando los 30 días se agotan sin una suscripción pagada, AskBiz apaga el POS automáticamente —tus datos permanecen intactos, pero la caja deja de funcionar hasta que te suscribas.',
      'La prueba equivalente del plan Growth (BI) ha sido descontinuada —POS es la única prueba gratuita que ofrece AskBiz actualmente.',
      'El estado de tu prueba, incluidos los días restantes y la fecha exacta de finalización, siempre está visible en la página de Facturación.',
    ],
    content: [
      {
        heading: 'Qué te da realmente la prueba',
        body: 'La prueba gratuita del POS de AskBiz desbloquea la caja completa durante 30 días desde el momento en que la inicias, sin que se solicite ninguna tarjeta de pago en ningún momento. Es una oferta única —cada cuenta puede reclamarla exactamente una vez, algo que AskBiz rastrea del lado del servidor en lugar de confiar en nada del navegador. Si ya la has reclamado antes (incluso en un dispositivo diferente o después de borrar tus cookies), el sistema lo sabe y no volverá a ofrecerla. Iniciar la prueba activa el POS de inmediato y aprovisiona hasta cinco cupos de personal, así que puedes incorporar a todo tu equipo de caja —cajeros, gerentes, quien necesite un inicio de sesión— sin toparte con un límite de cupos durante la propia prueba.',
      },
      {
        heading: 'Dónde te la ofrecerán',
        body: 'AskBiz muestra la prueba en dos momentos, ambos orientados a hacerte vender lo más rápido posible sin pedir datos de tarjeta por adelantado. El primero es en la pantalla "listo" de incorporación, pero solo si te registraste con un perfil POS —verás un pequeño banner arriba del botón "Configurar mi caja" anunciando la prueba de 30 días. Ese banner es solo un anuncio, no el botón de reclamo en sí; te dice que la oferta existe antes de que avances más. El segundo, y el que realmente inicia la prueba, está en la página pos/activate —la pantalla a la que llegas cuando vas a activar el POS. Antes de llevarte directamente a un pago pagado, revisa si tienes una prueba sin reclamar. Si la tienes, aparece una opción "Iniciar prueba gratuita" arriba de los botones de pago; si ya la usaste, esa opción simplemente no aparece y vas directo a las opciones de pago. De cualquier forma, no hay callejón sin salida —si un clic llega después de que ya la reclamaste en otro lugar (digamos, la página de Facturación), AskBiz simplemente oculta el botón y muestra el camino de pago en su lugar, en lugar de un error.',
      },
      {
        heading: 'Reclamarla en pos/activate',
        body: 'Cuando la opción de prueba está disponible, es el botón superior en la pantalla pos/activate —etiquetado para iniciar la prueba gratuita, con una nota debajo confirmando que no se necesita tarjeta. Debajo de él hay un divisor y luego tus opciones de pago normales: M-Pesa para cuentas de Kenia, más pago con tarjeta para todos los demás. Tocar el botón de prueba no te redirige a ningún lado; llama directamente al sistema de facturación de AskBiz, que registra la hora de inicio de la prueba y una fecha de finalización 30 días después, activa el POS, y te lleva directo a una pantalla de confirmación. Desde ahí es el mismo flujo de "ya estás listo" que una activación pagada —vuelves a tu caja, lista para vender.',
      },
      {
        heading: 'Qué pasa cuando terminan los 30 días',
        body: 'AskBiz verifica la expiración de la prueba cada vez que se carga tu estado de facturación —en la práctica, esto significa que en el momento en que pasan tus 30 días, la próxima vez que algo toque tu estado de facturación, el sistema lo nota. Si no hay una suscripción pagada de POS vinculada a tu cuenta para entonces, el acceso al POS se apaga automáticamente: la caja deja de ser usable, y los inicios de sesión del personal encontrarán la puerta cerrada. Nada de tu historial de ventas, inventario o configuración se elimina —todo sigue ahí, esperando. Suscribirte en cualquier momento después reactiva el POS con todo exactamente como lo dejaste. El corte es deliberadamente limpio: no hay un período de gracia con avisos molestos ni un bloqueo parcial, solo un cambio automático de "activo" a "apagado" si la prueba vence sin nada pagado detrás.',
      },
      {
        heading: 'Cómo revisar el estado de tu prueba',
        body: 'No tienes que adivinar cuánto tiempo te queda. La página de Facturación muestra una insignia junto a la sección de POS siempre que tu prueba esté activa, indicando el número de días restantes y cuántos cupos estás usando actualmente. Una vez que te suscribes —o una vez que la prueba expira y pagas para reactivar— esa insignia cambia a un estado simple de "activo" en su lugar. Si eres del tipo de propietario que prefiere planear con anticipación en lugar de sorprenderse con una caja bloqueada a mitad de turno, la página de Facturación es el lugar para revisar, idealmente unos días antes de que se cumplan los 30.',
      },
      {
        heading: 'Por qué no hay un equivalente para el plan Growth (BI)',
        body: 'Si has escuchado que AskBiz solía ofrecer una prueba gratuita para su plan de inteligencia de negocio Growth, eso es cierto —pero ya no está disponible. El sistema de facturación de AskBiz rechaza explícitamente cualquier solicitud nueva de una prueba de Growth con un mensaje claro de que ha sido descontinuada; la ruta de código existe solo para rechazar solicitudes, no para concederlas. La prueba de POS es la única prueba gratuita que se ofrece actualmente. Si tu negocio necesita tanto el POS como las funciones de BI/Growth, la prueba de POS pone tu caja en funcionamiento de inmediato sin costo, mientras que el acceso al plan Growth es una decisión de pago directa desde el primer día —sin período de prueba que factorizar en esa decisión.',
      },
    ],
    faq: [
      {
        q: '¿Necesito ingresar una tarjeta para iniciar la prueba gratuita del POS?',
        a: 'No. Iniciar la prueba no requiere ningún dato de pago en absoluto —es genuinamente gratis durante los 30 días completos. Solo necesitarás agregar un método de pago si decides suscribirte, ya sea durante o después de la prueba.',
      },
      {
        q: '¿Puedo reclamar la prueba dos veces —por ejemplo en una segunda cuenta de negocio?',
        a: 'La prueba es única por cuenta, rastreada en el servidor, no por dispositivo o navegador. Una segunda cuenta de AskBiz (un registro genuinamente separado) sería elegible para su propia prueba, pero no puedes volver a activarla en la misma cuenta borrando cookies o intentando de nuevo desde una pantalla diferente.',
      },
      {
        q: '¿Qué pasa exactamente con mis datos de ventas cuando expira la prueba?',
        a: 'Nada se elimina. AskBiz apaga el acceso al POS —lo que significa que la caja en sí deja de ser usable— pero cada venta, producto y configuración que tenías se conserva. Suscribirte en cualquier momento después restaura el acceso completo con tus datos exactamente como estaban.',
      },
      {
        q: 'Inicié la prueba desde el banner de incorporación —¿necesito hacer algo más?',
        a: 'El banner de incorporación es solo un anuncio de que la oferta existe; no inicia la prueba por sí mismo. La reclamas en la página pos/activate, a la que llegas mediante "Configurar mi caja". Si ya la reclamaste ahí, no volverás a ver la opción.',
      },
      {
        q: '¿Hay también una prueba gratuita para el plan Growth (BI)?',
        a: 'No —la prueba del plan Growth ha sido descontinuada. Solicitar una ahora devuelve una respuesta explícita de "ya no disponible". POS es actualmente el único plan de AskBiz que se ofrece con prueba gratuita.',
      },
    ],
  },
}
