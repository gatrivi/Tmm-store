# Release gate — publicitar Trufi

Auditoría de `trabajo` en `b0f0cf7` / v1.8.3, 22 de julio de 2026.

## Veredicto

| Uso | Estado |
| --- | --- |
| Mostrar la demo en una conversación | Sí |
| Publicar “busco 2 comercios piloto” y captar consultas | Después del Hito A |
| Mandar tráfico frío prometiendo un sistema listo | No |
| Cargar pedidos o datos reales de un cliente | No, hasta completar Hito B |

La demo ya demuestra la idea. Lo que hoy la frena no es otra feature: son
credibilidad pública, coherencia de punta a punta y seguridad de producción.

## Instrucción para Cursor

Implementar **solo Hito A** en una rama propia. Verificarlo y detenerse.

- No rediseñar la landing.
- No sumar funcionalidades comerciales.
- No tocar precios ni inventar datos de Gabriel.
- No implementar Hito B dentro de la misma pasada.
- El contenido de la carnicería sigue gobernado por
  [demo-carniceria-gabriel.md](./demo-carniceria-gabriel.md).

## Ya resuelto

Presente en la rama:

- vertical aislada en `/demo/carniceria`;
- cliente, panel y seguimiento con tenant `demo-carniceria`;
- catálogo por presentaciones de ½ kg / 1 kg y packs;
- delivery y retiro coordinado;
- demo segura en `sessionStorage`, sin WhatsApp ni pago real;
- un store de pedidos para confirmación, listado, detalle, métricas y seguimiento;
- correcciones de total `$0` y estado listado/detalle;
- self-check `npm run check:demo`.

La comprobación del deploy público sigue siendo parte de la aceptación.

## Bloqueos observados

1. **Preview social incorrecto.** `index.html` entrega OG genérico de Trufi para
   todas las rutas. Cambiar `document.title` en React no sirve para el crawler
   de Facebook.
2. **Chrome técnico.** `AppVersionStamp` aparece en todas las rutas públicas y
   la tienda acumula `DemoRibbon` + cinta DEMO + header.
3. **Fotos poco creíbles.** Varias tarjetas reutilizan la foto de otro producto:
   asado/bife, nalga/picada/milanesas y combo/hamburguesas.
4. **Identidad cortada.** Tienda bordó/hueso; checkout y seguimiento vuelven al
   verde oscuro genérico.
5. **Checkout contradictorio.**
   - La revisión dice enviar por WhatsApp aunque la demo no lo hace.
   - Transferencia puede mostrar/copiar un alias vacío.
   - El ejemplo de dirección dice Palermo.
6. **Salida post-pedido.** El carrito se limpia al cerrar el modal, pero los links
   directos a panel/seguimiento pueden saltear ese cierre.
7. **Controles falsos.** La campana del panel parece interactiva y no hace nada.
8. **Sin prueba UI.** El self-check cubre el store de datos, no el recorrido real
   en navegador ni el HTML que reciben los crawlers.

## Hito A — piloto público

### A1. Enlace compartible

Hacer que una petición HTTP inicial a `/demo/carniceria` ya contenga, sin
ejecutar JavaScript:

- `<title>Demo de pedidos para carnicerías — Trufi</title>`;
- description: `Mirá cómo una carnicería recibe pedidos por peso, delivery o retiro, sin comisión por venta.`;
- `og:title`, `og:description`, `og:url` y Twitter equivalentes;
- imagen propia 1200×630, no el OG genérico;
- `robots=noindex,follow` para la demo.

Puede resolverse con una entrada HTML adicional de Vite + rewrite de Vercel, o
una respuesta server/edge pequeña. **No** resolverlo solo con un `useEffect`.
La landing `/` debe conservar su metadata actual.

Verificar también el CTA de ventas:

- en Production debe abrir un canal real;
- para esta campaña, preferir WhatsApp configurando
  `VITE_SALES_WHATSAPP_NUMBER`;
- el mensaje debe identificar `demo carnicería`;
- si cae a email, el texto visible no debe prometer WhatsApp.

### A2. Credibilidad visual

1. Dejar como máximo dos niveles fijos arriba:
   - navegación/disclosure de demo;
   - header de Gabriel.
   Integrar la cinta DEMO en `DemoRibbon` o eliminar su duplicación.
2. Ocultar `AppVersionStamp` en UI pública de producción. Puede quedar en
   admin, DEV o `?debug=1`.
3. No usar una foto para representar cortes distintos. Cuando no exista una
   imagen propia y autorizada, usar un placeholder editorial consistente con
   nombre/monograma; es preferible a una foto incorrecta.
4. Aplicar los tokens bordó/hueso/carbón de la definición de demo a:
   - checkout;
   - confirmación;
   - éxito;
   - seguimiento.
5. El seguimiento debe mostrar marca, disclosure de demo y el mismo vocabulario
   `Total estimado`.
6. Quitar la campana del panel o convertirla en información no interactiva
   inequívoca. No agregarle una función inventada.
7. No inventar horarios, cobertura, dirección de retiro ni cualidades de la
   carne.

### A3. Integridad del recorrido

1. Agregar copy configurable para la revisión de demos:
   - título: `Revisá tu pedido de prueba`;
   - apoyo: `Todavía no se envió ningún mensaje ni pago.`;
   - placeholder de dirección: `Calle, altura y localidad`;
   - éxito: `Pedido de prueba creado`, no `Pedido enviado`.
2. En transferencia sin alias:
   - no renderizar valor ni botones de copiar vacíos;
   - mostrar `Gabriel te envía el alias al confirmar`.
3. Al persistir correctamente un pedido, marcar el carrito como consumido.
   Debe quedar vacío al salir por cualquiera de estas vías:
   - panel de Gabriel;
   - seguimiento;
   - seguir comprando;
   - cerrar modal.
4. Un doble click no puede crear dos pedidos.
5. Mantener el mismo ID, ítems, total y estado entre éxito, panel y seguimiento.
6. En la demo, el pago pendiente debe decir `Pago a coordinar`, no fingir
   cobro o fallo real.
7. No reintroducir el bug `total $0` ni limpiar el carrito antes de construir
   el snapshot confirmado.

### A4. Prueba de liberación

Agregar un E2E real con Playwright (390×844 como viewport principal):

1. sesión nueva en `/demo/carniceria`;
2. agregar 1 kg de asado + combo parrillero;
3. comprobar carrito `$68.800`;
4. completar delivery y transferencia;
5. comprobar que no existe alias/copiar vacío ni copy de envío real;
6. crear una sola orden y comprobar éxito `$68.800`;
7. abrir panel y validar mismo ID, ítems, total y estado;
8. avanzar un estado y comprobar seguimiento;
9. volver a tienda y comprobar carrito vacío;
10. smoke de retiro;
11. smoke de `/demo` y `/demo/owner` para evitar regresiones;
12. ausencia de overflow horizontal y de version stamp.

Agregar además un test del HTML construido/servido que compruebe los tags OG en
la **respuesta inicial** de `/demo/carniceria`.

Comandos obligatorios:

```bash
npm run lint
npm run build
npm run check:demo
npm run test:e2e:demo
```

## Aceptación Hito A

- Facebook Sharing Debugger ya no muestra la tarjeta genérica de Trufi.
- La primera pantalla móvil muestra negocio y propuesta, no tres barras.
- Ningún producto usa la foto de otro producto.
- Checkout y seguimiento parecen parte de Gabriel Carnes.
- No hay versión, botones muertos, alias vacío ni afirmaciones contradictorias.
- El recorrido completo pasa dos veces desde sesión limpia.
- La demo gastronómica existente no cambia.
- Cursor entrega capturas 390 px de tienda, checkout, panel y seguimiento.

Después de esto se puede publicitar únicamente como **búsqueda de pilotos**.

## Hito B — antes de datos reales

Este es otro PR. No cargar clientes reales hasta resolverlo.

1. Reemplazar login/hash y rate-limit del navegador por Firebase Auth u otra
   sesión validada en servidor.
2. Asociar cada owner a tenants autorizados. Un owner nunca debe leer o editar
   otro slug.
3. Reemplazar `firestore.rules` abierto:
   - lectura pública solo de catálogo/config publicable;
   - create de orden público con allowlist, tipos, límites y campos server-owned;
   - lectura/actualización de órdenes solo para owners del tenant;
   - escritura de tenant/config solo para owner autorizado.
4. Eliminar `VITE_SUPER_ADMIN_KEY` como control de acceso. Ningún secreto o
   autorización vive en el bundle.
5. Mover provisión de tenants a una operación autenticada de servidor.
6. Validar y limitar creación de pedidos para evitar spam/abuso.
7. Definir aviso de privacidad, retención y borrado de nombre, teléfono y
   dirección.
8. Probar dos tenants y dos usuarios: accesos propios permitidos, cruces
   denegados.
9. Smoke real en dos dispositivos: cliente crea; owner recibe; cambia estado;
   cliente ve el cambio.
10. Recién entonces habilitar promesas de panel multi-dispositivo, Mercado Pago
    y operación real.

## Reporte final de Cursor

Al detenerse tras Hito A, informar:

- commit y archivos tocados;
- URL de preview;
- resultado de los cuatro comandos;
- captura del preview social;
- cuatro capturas móviles;
- cualquier dato real todavía pendiente de Gabriel.
