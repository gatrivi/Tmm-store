# Venta pasiva — landing + demo pet shop

Fecha: 2026-07-28  
Estado: especificación para Cursor; no implementar backend nuevo.

## 0. Resultado

Una persona que llega por QR debe poder, sin hablar con Gastón:

1. entender en menos de 10 segundos si Trufi sirve para su comercio;
2. escribir nombre y rubro;
3. abrir una muestra funcional con esos datos;
4. entender exactamente qué compra por una reserva accesible;
5. dejar sus datos;
6. pasar a pagar la reserva en Mercado Pago.

**Conversión mínima:** lead identificado antes de salir a pagar.  
**WhatsApp:** respaldo, no CTA principal.

---

## 1. Verdad actual

- La landing actual de `/` ya tiene buen diseño y estructura. No rehacerla.
- Está escrita casi enteramente para gastronomía: “carta”, Mamá Mabel y pizzería.
- Sus CTA terminan en `buildSalesContactHref()`; dependen de una conversación.
- Muestra planes de ARS 180.000–480.000, pero no la entrada de USD 50.
- Demo Express v1.14.0 ya tiene siete presets data-driven.
- `petshop` ya existe en `PROSPECT_CATEGORIES`, pero todavía no tiene un preset real en `demoPresets.ts`.

Conclusión: cirugía de conversión sobre lo existente, no otro rediseño.

---

## 2. Embudo

```text
QR / enlace
  → landing general
  → nombre + rubro
  → demo instantánea
  → oferta “Muestra a medida 24 h”
  → formulario de ingreso
  → link de pago Mercado Pago
```

URL para tarjetas de recorrida:

```text
https://tmm.gatrivi.com/?utm_source=recorrida&utm_medium=qr&utm_campaign=zona_norte&utm_content=petshop
```

Conservar esos parámetros al abrir Demo Express y al formulario.

---

## 3. Demo pet shop

Agregar `PRESET_PETSHOP` a `src/data/demoPresets.ts`.

| Campo | Valor |
|---|---|
| id | `petshop` |
| familia | `catalogo` |
| color sugerido | `verde` |
| layout | grid existente |
| CTA | `Armar pedido` |
| total | `Total estimado` |
| stock | `Confirmamos stock y entrega por WhatsApp` |

### Categorías

1. Alimento
2. Higiene
3. Paseo y juego

### Ocho productos

- alimento para perro — 3 kg / 15 kg;
- alimento para gato — 1,5 kg / 7,5 kg;
- alimento húmedo — unidad / pack;
- arena sanitaria — 4 kg / 10 kg;
- shampoo — 250 ml / 500 ml;
- collar — S / M / L;
- correa — corta / larga;
- snacks o juguete — unidad / pack.

Usar nombres y marcas genéricas, precios ilustrativos y placeholders editoriales.

Mostrar con datos/copy existente:

- presentación;
- cantidad;
- retiro o delivery;
- barrio/zona;
- observaciones;
- acceso “Repetir compra habitual” solo como copy o atajo; no crear suscripciones.

No agregar medicamentos, recomendaciones veterinarias, cuentas de cliente ni recurrencia automática.

Aviso:

> Muestra conceptual. Productos, precios, stock y condiciones ilustrativas.

---

## 4. Landing que vende sola

Conservar tipografía, paleta, componentes, espaciado y estructura visual de `LandingPage.tsx`.

### 4.1 Hero

Reemplazar el encuadre exclusivamente gastronómico.

**Eyebrow**

> Zona Norte · muestra personalizada en 24 h

**Título**

> Tu negocio, listo para vender online.

**Bajada**

> Catálogo, pedidos o cotizaciones desde un link. Tu marca, tu WhatsApp y cero comisión por venta.

El primer bloque debe incluir un mini personalizador:

- nombre del negocio;
- rubro;
- barrio opcional;
- botón `Ver mi muestra`.

Reutilizar `buildProspectDemoSearch()`; no implementar otro generador.

CTA secundario: `Ver las 11 muestras` → `/demos`.

### 4.2 Prueba visual

Reemplazar el protagonismo único de Mamá Mabel por cuatro accesos:

- comida;
- pet shop;
- mayorista;
- servicios/cotización.

Cada acceso abre una demo real. No mostrar tarjetas todavía no implementadas.

Mantener una entrada separada a “Vista del local” para explicar el pedido recibido.

### 4.3 Oferta de entrada

Antes de los tres planes, agregar una tarjeta dominante:

#### Muestra a medida 24 h

Precio visible en ARS, configurado en un único lugar. No mostrar “USD 50” al prospecto.

Incluye:

- nombre, colores y logo recibido;
- hasta 8 productos/servicios;
- catálogo móvil;
- CTA al WhatsApp del comercio;
- link compartible;
- una ronda breve de cambios;
- reserva descontada 100% si luego contrata el proyecto completo.

Aclarar:

- las 24 h comienzan cuando están completos los materiales;
- no incluye dominio, panel productivo, Mercado Pago del comercio ni carga masiva;
- las demos públicas son conceptuales.

CTA primario: `Reservar mi muestra`.  
CTA secundario: `Probar gratis primero`.

Los planes grandes permanecen debajo como siguiente paso, no como primera decisión.

### 4.4 CTA móvil

Barra sticky solo en móvil:

- `Probar` → mini personalizador;
- `Reservar` → formulario.

No tapar navegación, carrito ni safe areas.

### 4.5 Confianza

Usar evidencia comprobable:

- demos cliente/local funcionando;
- entrega concreta;
- precio y alcance explícitos;
- sin comisión por venta;
- implementación hecha por Trufi.

No inventar clientes, testimonios, contadores, cupos ni urgencia.

---

## 5. Captura y cobro

Para este corte usar herramientas alojadas; no ampliar el backend inseguro actual.

### Tally

Crear un formulario breve con:

1. nombre;
2. nombre del negocio;
3. rubro;
4. WhatsApp;
5. barrio;
6. Instagram/web opcional;
7. hasta 8 productos o enlace al catálogo;
8. notas opcionales.

Campos ocultos:

- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_content`;
- `demo_url`;
- `rubro_demo`.

Activar notificación al correo comercial. Después de enviar, redirigir al link de pago.

Tally permite campos ocultos por URL, notificación al propietario y redirección al completar:

- https://tally.so/help/hidden-fields
- https://tally.so/help/self-email-notifications
- https://tally.so/help/redirect-on-completion

### Mercado Pago

Crear un Link de pago fijo llamado:

```text
Reserva — muestra web Trufi 24 h
```

Debe tener el mismo monto en ARS que muestra la landing.

Referencia oficial:
https://www.mercadopago.com.ar/herramientas-para-vender/link-de-pago

No usar esta noche la preferencia dinámica ni el webhook actuales.

### Configuración

```env
VITE_DEMO_INTAKE_URL=https://tally.so/r/...
VITE_DEMO_PRICE_LABEL=$...
VITE_SALES_WHATSAPP_NUMBER=549...
```

El link de pago queda configurado como redirect dentro de Tally.

Si falta `VITE_DEMO_INTAKE_URL`, no mostrar un botón roto: CTA de respaldo a WhatsApp con mensaje prearmado. No distribuir el QR hasta que el formulario y el pago estén verdes.

---

## 6. Tarjeta impresa

Crear el archivo imprimible recién después del deploy final y de escanear el QR desde un teléfono con datos móviles.

Copy:

> ¿Tu catálogo vive en WhatsApp?  
> Mirá en 30 segundos cómo podría verse tu negocio.  
> **[QR]**  
> Muestra a medida en 24 h · sin comisión por venta.

Agregar Trufi/ZengaSoft y la URL corta debajo del QR.

Formato: ocho tarjetas por A4, blanco y negro legible. El QR comercial debe estar separado del volante de búsqueda del perro; no mezclar ambos mensajes.

---

## 7. Dos pasadas Cursor

## Pasada A — corte vendible

1. Agregar el preset real de pet shop.
2. Generalizar hero/copy de la landing sin rediseñarla.
3. Integrar el mini personalizador existente.
4. Añadir oferta de entrada y CTA al formulario.
5. Preservar UTM hasta Demo Express y Tally.
6. Añadir fallback seguro cuando falte configuración.
7. Validar 390 px y teclado móvil.

### Prompt Cursor A

> Leé `docs/AGENT_STATUS.md`, `docs/roadmap/usd50-tomorrow-demo-plan.md` y `docs/roadmap/passive-sales-petshop-landing.md`. Implementá únicamente “Pasada A — corte vendible”. Partí de v1.14.0 y no rehagas la landing. Añadí `PRESET_PETSHOP` data-driven y convertí la landing actual en un embudo general: mini personalizador reutilizando `buildProspectDemoSearch`, oferta “Muestra a medida 24 h”, CTA Tally con UTM y WhatsApp solo como fallback. No agregues backend, Firebase, preferencia MP, webhook, auth, CRM, chat ni páginas duplicadas. Conservá las demos dedicadas y los siete presets actuales. Agregá checks del preset, parámetros y CTA; smoke 390/1440; lint, build y tests. Reportá evidencia y detenete.

## Pasada B — galería y material

1. Crear/completar `/demos` con once rubros.
2. Enlazarlo desde landing/footer.
3. Verificar que cada card abre productos/copy correctos.
4. Generar la tarjeta A4 solo con la URL productiva.
5. Escanear QR real en 4G.

### Prompt Cursor B

> Implementá únicamente “Pasada B — galería y material”. Creá `/demos` con once rubros y cuatro familias, usando rutas dedicadas o presets existentes. Cada card debe abrir muestra, personalizador y reserva conservando atribución. Enlazá landing/footer. Después del deploy confirmado, generá una hoja A4 imprimible con ocho tarjetas y QR a la URL UTM definida en el plan. No mezcles la pieza comercial con material de búsqueda del perro. E2E de links/CTA, captura 390/1440, prueba de impresión y verificación manual del QR; stop.

---

## 8. Aceptación

- `rubro=petshop` cambia productos, categorías, variantes y copy;
- pet shop funciona cliente → checkout de prueba → local;
- el hero permite crear una muestra sin conversar;
- el CTA primario no es email ni WhatsApp;
- Tally recibe datos y UTM;
- llega la notificación;
- al completar abre el Link de pago correcto;
- precio de landing y Mercado Pago coincide;
- ningún CTA queda muerto sin env;
- once demos accesibles;
- 390 px sin overflow;
- lint, build y checks verdes;
- QR verificado desde otro teléfono.

---

## 9. Stop

Después de publicar y probar el QR, detener desarrollo.

No agregar ahora:

- chatbot;
- CRM;
- pixel publicitario;
- login;
- newsletter;
- Mercado Pago API;
- automatización WhatsApp;
- SEO por cada rubro;
- otra vertical.

El siguiente trabajo es distribuir tarjetas y revisar formularios/pagos, no ampliar el producto.
