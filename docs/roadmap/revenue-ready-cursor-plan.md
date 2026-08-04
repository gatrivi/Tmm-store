# Plan de ingreso — Trufi v1.13.4 → primer depósito

Fecha: 2026-07-28  
Rama auditada: `trabajo`  
Live auditado: `https://tmm.gatrivi.com`

## 0. Objetivo

Conseguir el primer depósito sin vender como terminado lo que todavía no es seguro.

Definición de éxito:

1. Un prospecto entra desde una demo adecuada a su rubro.
2. El CTA abre WhatsApp comercial con origen y plan identificados.
3. Recibe alcance, precio y condiciones simples.
4. Paga 50% de implementación.
5. Solo después se crea su tenant y se carga material real.

No medir éxito por cantidad de demos, features o commits. Medirlo por conversaciones calificadas, demos realizadas y depósitos recibidos.

---

## 1. Auditoría actual

### Sí funciona

- Producción sirve `v1.13.4`.
- Landing profesional con oferta, precios y 50% de anticipo.
- Flujo demo pizzería verificado en live:
  - carrito;
  - checkout;
  - revisión;
  - creación de pedido;
  - mismo ID, ítems y total en panel.
- Demos disponibles:
  - `/demo/mamabel`;
  - `/demo/pizzeria`;
  - `/demo/panaderia`;
  - `/demo/carniceria`;
  - `/demo/armar`;
  - `/demo` legacy / puestito.
- Mamabel ya demuestra el diferencial real: implementación de marca y contenido, no solo una plantilla.

### Bloqueos de ingreso

1. **Los CTA live caen a email.** `VITE_SALES_WHATSAPP_NUMBER` no está activo en Production.
2. **La landing promete Mercado Pago** dentro de Pedidos Directos, pero no existe un smoke productivo verificable.
3. **Firestore está abierto:** `firestore.rules` permite lectura y escritura pública.
4. **Autorización insegura:** `VITE_SUPER_ADMIN_KEY` vive en el bundle y el owner no usa una sesión validada por servidor.
5. **Preferencia MP manipulable:** `api/create-preference.ts` acepta títulos y precios enviados por el navegador.
6. **Webhook incompleto:** no valida `x-signature`, usa un tenant de entorno único y Firebase client SDK.
7. **Persistencia no apta para comercio real:** sin Firebase, pedidos quedan en `localStorage` del browser.
8. **Oferta contradictoria:** landing cobra implementación; docs viejos todavía dicen “armado sin cargo”.

### Veredicto

| Oferta | Hoy | Gate |
|---|---|---|
| Sitio / carta / catálogo con CTA WhatsApp | **Vendible ya**, tras activar WhatsApp comercial | Gate A |
| Pedidos reales con efectivo/transferencia + panel compartido | No | Gate B: auth + backend + reglas |
| Mercado Pago integrado multi-tenant | No | Gate C: OAuth/credenciales por comercio + webhook seguro |

No cargar nombre, teléfono, domicilio ni pedidos reales antes de Gate B.

---

## 2. Oferta que cobrar

Mantener precios públicos hasta validarlos con conversaciones reales; no cambiarlos por intuición dentro de Cursor.

| Producto | Implementación | Mensual | Qué se puede vender |
|---|---:|---:|---|
| Carta Premium | desde $180.000 | $15.000 | Sitio/carta a medida, fotos, QR, edición, CTA WhatsApp |
| Pedidos Directos | desde $320.000 | $25.000 | Tras Gate B; efectivo/transferencia primero |
| Operación | desde $480.000 | $45.000 | Tras Gate C y pruebas de comandas/reportes |

Condición simple:

- 50% para empezar;
- saldo contra aprobación y antes del go-live;
- mantenimiento desde el día 31;
- transferencia o link de pago manual de Mercado Pago;
- no construir facturación recurrente hasta tener 3 clientes pagos.

El benchmark público obliga a vender **servicio hecho por nosotros**, no “otro SaaS”: Pedido Directo publica Plan Full a $20.000/mes con armado sin cargo, y Pedix publica planes desde USD 9/mes. La implementación de Trufi se justifica por marca, contenido, carga y acompañamiento.

Fuentes al 2026-07-28:

- https://pedidodirecto.com.ar/
- https://info.pedix.app/
- https://www.tiendanube.com/

---

## 3. Orden estricto

```text
P0 Conversión comercial
P1 Galería de demos
P2 Demo pollería
P3 Demo verdulería
P4 Configuración de pedidos
P5 Auth + backend seguro
P6 Efectivo/transferencia real
P7 Mercado Pago por comercio
P8 Venta piloto
```

Regla: una fase, evidencia, stop. No mezclar demos con seguridad o pagos.

---

## P0 — Conversión comercial

Objetivo: que una visita pueda terminar en conversación y depósito.

### Trabajo manual

1. Configurar en Vercel Production:
   - `VITE_SALES_WHATSAPP_NUMBER=54911...`
   - `VITE_SALES_EMAIL=devtrivi@zengasoft.com`
2. Redeploy de Production.
3. Probar desde celular que los CTA abren `wa.me`, no `mailto:`.

### Trabajo Cursor

- Añadir smoke E2E de landing live/local:
  - CTA header;
  - CTA de cada plan;
  - CTA final;
  - origen del mensaje;
  - fallback email con copy explícito si falta WhatsApp.
- En la oferta Pedidos Directos, cambiar `Mercado Pago` por `Mercado Pago opcional, después de validar la integración` hasta Gate C.
- Corregir docs que todavía dicen `armado sin cargo`.
- No tocar precios.

### Aceptación

- Todos los CTA de Production abren el número comercial correcto.
- El mensaje identifica `landing`, demo o plan.
- No se promete MP listo.
- `npm run lint`, `npm run build` y Playwright verdes.

### Prompt Cursor 0

> Leé `docs/AGENT_STATUS.md` y `docs/roadmap/revenue-ready-cursor-plan.md`. Implementá únicamente P0 — Conversión comercial. No cambies precios ni diseño general. Agregá un smoke E2E que demuestre el destino y origen de los CTA. Atenuá la promesa de Mercado Pago hasta Gate C y corregí docs contradictorios sobre “armado sin cargo”. Ejecutá lint, build y el E2E; reportá archivos, resultados y capturas 390/1440. Detenete.

---

## P1 — Galería de demos

Objetivo: enviar un solo link y dejar que el prospecto se reconozca por rubro.

### Implementación

- Ruta `/demos`.
- Cards para:
  - Mamá Mabel / repostería;
  - pizzería;
  - panadería;
  - carnicería;
  - puestito;
  - pollería;
  - verdulería.
- Cada card contiene:
  - dolor de 1 línea;
  - `Ver como cliente`;
  - `Ver panel` si aplica;
  - `Quiero algo así` → WhatsApp con rubro y URL.
- Link visible desde landing y footer.
- No inventar testimonios, resultados, direcciones o teléfonos.

### Aceptación

- 390 px sin overflow.
- Todas las rutas existen o la card figura claramente `Próximamente`; nunca link muerto.
- CTA conserva origen/rubro.
- Metadata propia para `/demos`.

### Prompt Cursor 1

> Implementá únicamente P1 del plan de ingreso. Creá `/demos` reutilizando el lenguaje visual de la landing. Usá datos estructurados, no JSX repetido. Enlazá solo rutas existentes; pollería y verdulería quedan “Próximamente” hasta sus fases. Agregá CTA WhatsApp con origen por rubro, metadata, smoke 390/1440, lint y build. Detenete.

---

## P2 — Demo pollería

Objetivo demo 60s: “medio/entero + guarnición” deja de ser un intercambio ambiguo.

### Archivos esperados

- `src/data/demos/polleria.ts`
- registry y rutas cliente/owner/seguimiento
- `public/demos/polleria/`
- metadata HTTP inicial y rewrite
- `docs/roadmap/demo-polleria.md`
- actualización de `/demos`, `prospect-demo.md` e índices
- self-check + E2E

### Catálogo mínimo

8–10 ítems, datos explícitamente ilustrativos:

- pollo al spiedo: medio / entero;
- pollo a la parrilla: medio / entero;
- combo pollo + papas;
- combo familiar;
- papas chicas / grandes;
- ensalada;
- empanadas o bebida solo si no distraen.

Usar opciones existentes. No construir un motor nuevo de modificadores: los combos y tamaños deben expresarse como variantes claras.

### Aceptación

- `demo-polleria` y storage aislado.
- cliente → pedido → owner → seguimiento conserva ID/total.
- no WhatsApp ni pago real.
- OG propio, `noindex,follow`.
- ninguna foto representa otro producto; placeholder editorial es válido.
- E2E: pollo entero + papas → total exacto → aceptar/preparar.

### Prompt Cursor 2

> Implementá únicamente P2 — Demo pollería. Seguí el patrón de `pizzeria.ts` y el flujo compartido de pedidos; no clones la aplicación ni agregues modificadores nuevos. La demo debe resolver medio/entero + guarnición en 60 segundos. Datos, nombre y precios son ilustrativos. Añadí rutas, storage aislado, owner, seguimiento, OG inicial, `/demos`, docs, self-check y E2E. Verificá 390/1440, lint, build y tests. Detenete.

---

## P3 — Demo verdulería

Objetivo demo 60s: una lista por chat se convierte en producto + unidad/peso + total estimado.

### Catálogo mínimo

8–10 ítems:

- tomate: ½ kg / 1 kg;
- papa: 1 kg / 2 kg;
- cebolla: ½ kg / 1 kg;
- banana: ½ kg / 1 kg;
- manzana: ½ kg / 1 kg;
- palta: unidad / pack;
- maple o docena de huevos;
- bolsón semanal.

### UX específica

- `Total estimado` siempre visible.
- Aviso: peso y total final pueden variar.
- Nota opcional para sustituciones: `Si no hay, reemplazar / consultar / no reemplazar` sin crear un subsistema complejo.
- Retiro y delivery de demo.
- Reutilizar el patrón de peso de carnicería.

`CarniceriaDemoPage` contiene texto hardcodeado de Gabriel/cortes. Extraer solo lo necesario a un `WeightedCatalogDemoPage` configurable o usar el storefront genérico. Si se extrae, carnicería debe quedar visual y funcionalmente igual.

### Aceptación

- `demo-verduleria` y storage aislado.
- total estimado en tienda, checkout, éxito, panel y seguimiento.
- OG propio, `noindex,follow`.
- E2E: tomate 1 kg + banana ½ kg + bolsón → mismo total en todo el flujo.
- regresión carnicería verde.

### Prompt Cursor 3

> Implementá únicamente P3 — Demo verdulería. Reutilizá el patrón de peso de carnicería sin dejar referencias a Gabriel o “cortes”. Preferí extracción pequeña y configurable; no reescribas Storefront. El demo debe expresar peso/unidad, total estimado y sustituciones en notas. Añadí rutas, storage aislado, owner, seguimiento, OG, `/demos`, docs, self-check y E2E. Verificá también la regresión carnicería. Detenete.

---

## P4 — Configuración de pedidos

Implementar Hito 2 de `order-processing-v2.md` antes del backend:

- `OrderingSettings` versionado;
- retiro, zonas de delivery, costo y mínimo;
- efectivo/transferencia habilitables;
- alias obligatorio para transferencia visible;
- carrito por tenant;
- normalización de WhatsApp AR;
- estado operativo separado de estado de pago;
- `getOrderingReadiness` puro;
- opciones incompletas ocultas, no deshabilitadas sin explicación.

No activar producción todavía.

### Prompt Cursor 4

> Implementá únicamente Hito 2 de `docs/roadmap/order-processing-v2.md`, alineado con P4 del plan de ingreso. No toques auth, Firestore, MP ni demos visuales. Añadí pruebas unitarias/self-checks de readiness, pricing, teléfono y estados. Demostrá retiro y delivery a 390 px. Lint/build/tests y stop.

---

## P5 — Auth + backend seguro

Gate B. Bloquea cualquier pedido real.

### Seguridad mínima

- Firebase Auth; primer piloto con cuentas owner creadas manualmente.
- Membresía `uid ↔ tenantId ↔ role` validada en servidor/reglas.
- Quitar SHA/login local como autorización.
- Eliminar `VITE_SUPER_ADMIN_KEY` del bundle.
- Provisioning de tenants solo por operación server autenticada o script local seguro.
- `firebase-admin` en backend.
- `POST /api/orders`:
  - tenant resuelto por slug permitido;
  - allowlist y límites de campos;
  - catálogo/settings desde servidor;
  - total recalculado;
  - idempotencia;
  - rate limit;
  - una orden por doble click/reintento.
- Firestore rules:
  - catálogo/config público: solo lectura publicable;
  - anónimo no lista ni lee órdenes;
  - owner/staff solo su tenant;
  - cliente crea por API, nunca SDK directo.
- Seguimiento con token opaco y respuesta sanitizada.
- Sin fallback silencioso a `localStorage` en Production.

### Prueba obligatoria

Dos tenants + dos owners:

- A puede operar A;
- B puede operar B;
- A no lee/modifica B;
- anónimo no lista órdenes;
- doble submit crea una sola orden;
- cliente en dispositivo 1 → owner en dispositivo 2 → seguimiento se actualiza.

### Prompt Cursor 5

> Implementá únicamente P5 — Gate B. Leé completo `advertising-readiness.md` Hito B y `order-processing-v2.md` Hito 3. Reemplazá autorizaciones client-side por Firebase Auth + membresía tenant; cerrá reglas; creá API idempotente con recálculo servidor y Admin SDK; quitá fallbacks productivos. No implementes Mercado Pago. Añadí pruebas de reglas, dos tenants/dos usuarios y E2E dos dispositivos. No uses datos reales. Reportá evidencia y detenete.

---

## P6 — Efectivo y transferencia real

Primer piloto operativo, todavía sin MP.

- Checkout usa solo opciones configuradas.
- Pedido se persiste antes de abrir WhatsApp.
- WhatsApp se genera desde la orden guardada.
- Transferencia nace `pending`; owner confirma.
- Efectivo nace `unpaid`; owner marca cobrado.
- Pago y preparación avanzan por separado.
- Owner inbox realtime y seguimiento sin refresh manual.
- Política mínima de privacidad, retención y borrado visible.

Gate superado cuando el flujo pasa dos veces desde dos celulares con un tenant piloto sin datos cruzados.

---

## P7 — Mercado Pago por comercio

No reutilizar el `MP_ACCESS_TOKEN` único como solución multi-tenant. Cada comercio debe cobrar en su propia cuenta.

Camino recomendado después del primer ingreso:

1. Conectar la cuenta del comercio mediante OAuth de Mercado Pago.
2. Guardar credenciales solo del lado servidor, cifradas/no legibles por clientes.
3. Crear preferencia desde `orderId`, nunca desde precios del browser.
4. `external_reference`/metadata identifica tenant + order.
5. Validar `x-signature`.
6. Consultar el pago a MP y verificar vendedor, monto, moneda, tenant y orden.
7. Webhook e intentos idempotentes.
8. URL de retorno muestra `Verificando`; nunca aprueba desde query params.
9. Reintentar pago sobre la misma orden.
10. Sandbox + notificación de prueba + smoke productivo documentado.

Hasta entonces `mpEnabled=false` y la landing lo presenta como integración opcional.

Referencia oficial: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/how-tos/integrate-marketplace

---

## P8 — Venta piloto

No es trabajo de código.

### Sprint comercial

1. Seleccionar 20 locales:
   - 5 pollerías/rotiserías;
   - 5 verdulerías;
   - 5 pizzerías/empanadas;
   - 5 panaderías/carnicerías.
2. Enviar la demo del rubro, no la landing genérica.
3. Objetivo:
   - 8 conversaciones;
   - 5 demos de 3 minutos;
   - 2 propuestas;
   - 1 depósito.
4. Antes del depósito: demo ilustrativa/Express.
5. Después del depósito: tenant real con 6–10 productos.
6. No guardar datos de leads, pagos o clientes en este repo público.

### Mensaje base

> Hola, vi que reciben pedidos por WhatsApp. Armé una muestra corta para mostrar cómo podrían llegar con producto, cantidad, entrega y pago ya ordenados, sin comisión por venta: [URL]. Si te sirve, la adapto con tu marca y menú. ¿Te la muestro en 3 minutos?

### Stop rule

Tras 10 conversaciones, revisar objeciones antes de construir otra vertical o feature.

---

## 4. No hacer todavía

- Más verticales después de pollería/verdulería sin lead o depósito.
- WhatsApp Business API.
- IA de atención.
- Facturación ARCA.
- Inventario complejo.
- Repartidores, mapas o tracking.
- Suscripciones automáticas de Trufi.
- Rediseño general de landing/Mamabel.
- Tests decorativos que no cubran el recorrido real.

---

## 5. Gate final

Trufi puede anunciar `Pedidos Directos listo para operar` solo si:

- CTA comercial live llega a WhatsApp;
- auth owner es server-validada;
- reglas Firestore niegan cruces;
- orden se calcula y persiste en backend;
- doble toque no duplica;
- efectivo/transferencia funcionan en dos dispositivos;
- MP no aparece si no está listo;
- demo y producción comparten tipos/transiciones;
- privacidad y borrado están definidos;
- lint, build, reglas, integración y E2E pasan.

Antes de eso, vender Carta Premium y pilotos controlados. No esperar a terminar todo para cobrar por el trabajo que ya es vendible.
