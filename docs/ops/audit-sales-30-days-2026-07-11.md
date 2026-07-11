# Auditoría comercial de 30 días — 2026-07-11

## Decisión ejecutiva

La intervención individual elegida es **Demo Express**: un generador de enlaces que presenta la demo existente con el nombre, rubro, barrio y color de cada prospecto.

Ruta interna después del deploy:

```text
/demo/armar
```

La decisión parte de una observación simple: Trufi ya tiene suficiente producto para vender una primera implementación. El cuello de botella inmediato no es sumar otra función; es lograr que un comercio pase de “otra plataforma genérica” a “puedo imaginar esto en mi local” sin preparar un tenant manualmente.

## Criterios de priorización

Escala: 1 = desfavorable, 5 = favorable. En esfuerzo, 5 significa poco esfuerzo.

| Oportunidad | Tiempo hasta cobrar | Probabilidad de venta | Esfuerzo | Lectura |
|---|---:|---:|---:|---|
| **Demo Express personalizada** | 5 | 4 | 5 | **Ganadora: acorta preparación y mejora relevancia en cada contacto.** |
| Publicar la v1.6 actual | 5 | 5 | 4 | Condición de distribución, no una nueva intervención de producto. Es el próximo paso obligatorio. |
| Cobro de seña integrado | 4 | 3 | 2 | Puede acelerar el cierre, pero requiere cuenta, enlace de pago, confianza y condiciones comerciales ya acordadas. |
| Nuevo plan estático “Menu Lite” | 3 | 3 | 3 | Puede bajar la barrera de entrada, pero divide el mensaje cuando todavía falta validar la oferta principal. |
| Más IA, inventario o integraciones | 1 | 2 | 1 | Aumenta superficie técnica y demora conversaciones de venta. |
| Endurecer Firebase | 2 | 5 para entrega | 2 | Obligatorio antes del primer tenant pago, pero no mejora por sí solo la primera conversación comercial. |

## Qué se implementó

### 1. Generador comercial

`/demo/armar` permite completar:

- nombre del negocio;
- barrio o zona;
- rubro;
- color principal.

Genera en el acto:

- enlace de vista cliente;
- enlace del panel del local;
- mensaje corto listo para copiar y enviar por WhatsApp;
- accesos para probar ambas vistas.

### 2. Personalización sin backend

La identidad viaja en parámetros de la URL:

```text
/demo?negocio=Morelia+Pizza&barrio=Olivos&rubro=pizzeria&color=coral
```

La demo interpreta esos parámetros y aplica:

- nombre del comercio;
- rubro y ubicación;
- monograma generado localmente;
- color principal;
- título del navegador.

No crea tenants, no escribe en Firebase y no guarda datos del prospecto.

### 3. Continuidad del recorrido

La personalización se conserva cuando el usuario:

- cambia entre **Cliente** y **Local**;
- termina el checkout seguro de demostración;
- abre el panel desde la confirmación;
- pulsa el CTA comercial, cuyo origen incluye el nombre del prospecto.

### 4. Corrección necesaria de branding

La tienda escribía variables CSS con nombres que las utilidades de Tailwind no consumían. Demo Express actualiza también las variables `--color-brand-*`, por lo que el color elegido sí llega a los componentes ya construidos.

## Cómo usarla para vender

1. Confirmar en Google/Instagram el nombre público, rubro y barrio.
2. Abrir `/demo/armar`.
3. Completar los cuatro campos; no hace falta tener todavía el menú real.
4. Copiar el mensaje generado y enviarlo al dueño o encargado.
5. Si responde, mostrar en tres minutos: carta → carrito → checkout seguro → panel del local.
6. Cerrar con una sola propuesta: **Pedidos Directos, ARS 320.000 de implementación + ARS 25.000/mes, 50% para comenzar**.
7. Recién después de la seña, cargar el menú y la marca reales.

Mensaje recomendado que genera la herramienta:

```text
Hola, armé una muestra rápida de cómo podría verse [NEGOCIO] con pedidos directos:
[ENLACE]

Es una demo visual con productos de ejemplo. Si te sirve, la adapto a tu menú real.
```

La frase “productos de ejemplo” es deliberada: evita presentar como trabajo personalizado algo que todavía no lo es.

## Meta operativa

Objetivo mínimo para los primeros siete días después de publicar:

| Actividad | Meta |
|---|---:|
| Enlaces personalizados enviados | 20 |
| Respuestas reales | 6 |
| Demos conversadas | 3 |
| Implementaciones pagas | 1 |
| Cobro inicial objetivo | ARS 160.000 |

Estas cifras son metas de ejecución, no pronósticos. Registrar manualmente negocio, fecha, enlace enviado, respuesta, demo, objeción y resultado. No invertir otra semana de desarrollo antes de completar los 20 contactos.

## Observaciones del producto

### Lo que ya es vendible

- Landing comercial enfocada en el resultado: pedido claro, canal directo y cero comisión.
- Dos caras demostrables: cliente y panel del local.
- Checkout público seguro que no envía mensajes reales.
- Implementación “hecha por nosotros”, mucho más apropiada para una pyme que una cuenta vacía.
- Precio visible y 50% inicial, compatible con generar caja antes de hacer la carga completa.
- Demo aislada de Firebase y del almacenamiento de tenants.

### El cuello de botella real

La demo anterior era buena como producto genérico, pero exigía imaginación al prospecto. La alternativa indicada en la documentación era crear slug, cargar productos y aplicar branding antes de saber si el lead estaba calificado. Eso consume tiempo no cobrado. Demo Express mueve la personalización superficial antes de la conversación y reserva la adaptación real para después de la seña.

### Bloqueos de salida

1. **La v1.6 está local y la versión pública observada anteriormente seguía en v1.4.6.** Nada de esta intervención puede vender por enlace hasta publicar el estado actual.
2. Configurar `VITE_SALES_WHATSAPP_NUMBER` en producción. Si está vacío, los CTA caen a correo (`devtrivi@zengasoft.com`), una conversión probablemente inferior para comercios locales.
3. Antes del primer tenant pago, reemplazar las escrituras públicas de Firestore por acceso autenticado y reglas por tenant.
4. Hacer smoke test móvil de `/`, `/demo/armar`, `/demo` y `/demo/owner` en el dominio definitivo.

### Inconsistencias comerciales encontradas

- La landing nueva ofrece **Carta Premium ARS 180.000 + 15.000/mes**, **Pedidos Directos ARS 320.000 + 25.000/mes** y **Operación ARS 480.000 + 45.000/mes**.
- Documentos antiguos todavía mencionan ARS 15–20 mil mensuales, armado sin cargo, pilotos gratis de uno o tres meses y otras variantes.
- Para los próximos 30 días, la landing debe considerarse fuente comercial vigente. No mezclar precios durante una misma conversación.
- La oferta recomendada debe ser una sola: **Pedidos Directos**, salvo que el prospecto pida explícitamente solo carta.

### Riesgos y límites

- La demo personalizada cambia identidad, no productos. No decir “cargué tu menú”; decir “armé una muestra visual”.
- Nombre, barrio, rubro y color quedan visibles en la URL. Usar únicamente datos públicos y nunca teléfonos, datos personales o información sensible.
- El bundle de comercio sigue siendo grande: aproximadamente **294 kB gzip** en el build auditado. No bloquea la primera venta, pero merece una pasada de rendimiento si las pruebas en teléfonos viejos son lentas.
- La landing pesa aproximadamente **85 kB gzip** de JavaScript inicial y está separada del bundle comercial, una decisión correcta para captación.
- El tracking actual registra la tienda con una ruta genérica y no mide el embudo de Demo Express. Por ahora conviene registrar prospectos manualmente; instrumentar analítica solo después de ejecutar la primera tanda.
- La lista de leads existente debe verificarse antes de contactar: reseñas, web y teléfonos pueden cambiar.
- El producto tiene una superficie mucho mayor que la necesaria para la primera venta. IA, Mercado Pago, reportes, impresión y multi-tenant pueden ayudar a cerrar casos concretos, pero no deben presentarse todos a la vez.
- El posicionamiento correcto sigue siendo **link web normal para pedir**, con QR opcional. Evitar vender “un menú QR”.

## Lo que deliberadamente no se cambió

Para respetar la intervención única no se modificaron:

- planes ni precios;
- Firebase, autenticación o reglas;
- menú de productos de muestra;
- panel administrativo real;
- Mercado Pago;
- analítica;
- landing fuera de la nueva ruta interna;
- documentos comerciales antiguos.

Esos temas quedan registrados, pero no deben abrir otra ronda de producto antes de publicar y enviar 20 demos.

## Verificación realizada

- `npm run lint`: **0 errores**, 2 advertencias preexistentes de Fast Refresh.
- `npm run build`: **correcto**, 2.343 módulos transformados.
- Preview de producción: HTTP **200** para `/demo/armar`, `/demo?...` y `/demo/owner?...`.
- Prueba de ida y vuelta de parámetros: nombre, barrio, rubro y color se serializan y recuperan correctamente.
- Generación de iniciales: `Morelia Pizza` → `MP`.
- El navegador remoto del entorno no pudo acceder al servidor local; queda pendiente una comprobación visual final en el dominio desplegado.

## Archivos de esta intervención

- `src/pages/ProspectDemoBuilderPage.tsx` — herramienta comercial.
- `src/utils/prospectDemo.ts` — parámetros, validación, colores y monograma.
- `src/App.tsx` — ruta `/demo/armar`.
- `src/context/MenuContext.tsx` — branding de demo derivado del enlace.
- `src/pages/Storefront.tsx` — aplicación efectiva del color de marca.
- `src/components/DemoRibbon.tsx` — conservación de parámetros entre vistas.
- `src/components/CheckoutModal.tsx` — conservación de parámetros al pasar al panel.
- `src/pages/DemoOwnerPage.tsx` — nombre personalizado y retorno a la tienda.

## Condición de parada

La intervención está terminada. El siguiente trabajo no es agregar código: es **publicar, configurar el WhatsApp comercial y enviar los primeros 20 enlaces personalizados**.
