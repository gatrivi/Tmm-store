# USD 50 mañana — plan mínimo de demos

Fecha: 2026-07-28  
Objetivo: cobrar una reserva equivalente a USD 50 mañana, sin construir backend ni prometer pedidos productivos.

## 0. Qué significa la variable

`VITE_SALES_WHATSAPP_NUMBER` es el número comercial de Gastón/Trufi que deben abrir todos los CTA.

Formato argentino:

```env
VITE_SALES_WHATSAPP_NUMBER=54911XXXXXXXX
```

Solo dígitos: `54` + `9` + código de área sin `0` + número sin `15`.

Debe configurarse en Vercel **Production** y luego redeployar. No usar el número de Mamabel ni inventar uno.

---

## 1. Producto de mañana

Vender una entrega pequeña y concreta, no el sistema completo:

### Demo a medida 24 h

**Reserva:** equivalente a USD 50 en ARS.  
**Se descuenta 100%** si luego contrata Carta/Pedidos.

Incluye:

- nombre y rubro del negocio;
- colores y monograma/logo recibido;
- hasta 8 productos o servicios;
- precios ilustrativos o datos provistos;
- CTA a su WhatsApp;
- link móvil compartible;
- una ronda breve de correcciones.

No incluye:

- dominio propio;
- panel productivo;
- Mercado Pago;
- Firebase;
- carga masiva;
- pedidos con datos reales.

El comprador recibe algo visible aunque no contrate el sistema completo. No es una “seña por una promesa”.

Cobro mañana: transferencia o link manual de Mercado Pago. No integrar pagos en Trufi.

---

## 2. Ocho rubros, tres moldes

No construir ocho aplicaciones.

| Molde | Rubros | Problema mostrado |
|---|---|---|
| **Peso / unidad** | carnicería, pollería, verdulería | cantidad, presentación y total estimado |
| **Preparación / horario** | panadería, cafetería, pizzería | variantes, retiro/delivery y pedido ordenado |
| **Catálogo / cotización** | librería, gráfica/imprenta | producto, medida, cantidad y especificación |

### Ya existen

- Carnicería: `/demo/carniceria`
- Panadería: `/demo/panaderia`
- Pizzería: `/demo/pizzeria`

No reconstruirlas esta noche.

### Presets nuevos

Agregar presets livianos a Demo Express:

- `polleria`
- `verduleria`
- `cafeteria`
- `libreria`
- `grafica`

Todos reutilizan:

```text
/demo?negocio=...&barrio=...&rubro=...&color=...
/demo/owner?negocio=...&barrio=...&rubro=...&color=...
```

No crear cinco rutas, cinco páginas owner ni cinco arquitecturas.

---

## 3. Datos mínimos

Crear un único archivo estructurado sugerido:

```text
src/data/demoPresets.ts
```

Cada preset contiene únicamente:

- label y familia;
- 3 categorías;
- 6–8 productos/servicios;
- opciones/variantes;
- hero/copy breve;
- labels de total y CTA;
- layout existente;
- color sugerido.

### Pollería

- pollo entero / medio;
- pollo al spiedo;
- combo pollo + papas;
- combo familiar;
- papas chicas / grandes;
- ensalada;
- bebida.

CTA: `Armar pedido`.

### Verdulería

- tomate ½ kg / 1 kg;
- papa 1 kg / 2 kg;
- cebolla ½ kg / 1 kg;
- banana ½ kg / 1 kg;
- manzana ½ kg / 1 kg;
- palta unidad / pack;
- huevos docena / maple;
- bolsón semanal.

Label: `Total estimado`.  
Aviso: peso y total final pueden variar.

### Cafetería

- espresso simple / doble;
- café con leche chico / grande;
- cappuccino;
- medialuna;
- tostado;
- combo desayuno;
- jugo;
- agua.

CTA: `Pedir para retirar`.

### Librería

- cuaderno A4/A5;
- resma A4;
- lapiceras pack;
- marcadores;
- carpeta;
- fotocopias B/N y color;
- anillado;
- combo escolar/oficina.

CTA: `Consultar disponibilidad`.

### Gráfica / imprenta

- tarjetas personales 100/500;
- flyers A5 100/500;
- stickers 50/100;
- banner/lona por medida;
- impresión A4 B/N y color;
- anillado;
- plastificado;
- diseño básico opcional.

CTA: `Pedir cotización`.  
Usar notas para medida, papel, terminación y fecha. No implementar upload esta noche.

Todos los datos deben decir claramente `muestra ilustrativa`.

---

## 4. Dos pasadas Cursor

## Pasada A — presets

Cambios mínimos:

1. Extender `PROSPECT_CATEGORIES` con los cinco rubros.
2. Crear `demoPresets.ts`.
3. Hacer que `MenuContext` seleccione menú/categorías/settings según `rubro` cuando `tenantId === demo`.
4. Mantener nombre, barrio, color y query al pasar cliente ↔ local.
5. Ajustar CTA/total por preset usando los puntos de configuración existentes; no crear subsistemas.
6. Monograma/placeholder editorial cuando no haya foto. No reutilizar una foto incorrecta.

### Prompt Cursor A

> Leé `docs/AGENT_STATUS.md` y `docs/roadmap/usd50-tomorrow-demo-plan.md`. Implementá únicamente “Pasada A — presets”. Conservá intactas las demos dedicadas de carnicería, panadería y pizzería. Añadí cinco presets data-driven a Demo Express: pollería, verdulería, cafetería, librería y gráfica. Reutilizá Storefront, Checkout, owner y query existente; no crees rutas ni páginas duplicadas, backend, Firebase, MP, uploads o un motor nuevo de variantes. Usá placeholders editoriales cuando falten fotos. Agregá self-check del parser/presets y smoke de un preset por familia. Ejecutá lint, build y checks; reportá evidencia y detenete.

## Pasada B — galería y conversión

Crear `/demos` con ocho cards agrupadas en tres familias.

Cada card:

- nombre del rubro;
- problema que resuelve en una línea;
- `Ver muestra`;
- `Personalizar` → `/demo/armar` con rubro preseleccionado;
- `Quiero una así` → WhatsApp comercial con rubro y URL.

Usar rutas dedicadas para carnicería, panadería y pizzería. Usar presets Demo Express para las otras cinco.

Añadir link `/demos` en landing y footer. No rediseñar la landing.

### Prompt Cursor B

> Implementá únicamente “Pasada B — galería y conversión” del plan USD 50. Creá `/demos` con ocho rubros, agrupados en tres moldes, usando rutas existentes o presets reales. Cada card debe abrir la muestra, permitir personalizarla y generar CTA WhatsApp con rubro/origen. Enlazá la galería desde landing/footer sin rediseñar. Agregá metadata genérica suficiente, E2E de links/CTA y capturas 390/1440. Lint, build, tests y stop.

---

## 5. Aceptación nocturna

Detener código cuando:

- los ocho rubros tienen una muestra accesible;
- los cinco presets cambian productos, categorías y copy, no solo el nombre;
- cliente ↔ local conserva rubro y personalización;
- `/demos` no tiene links muertos;
- CTA comercial abre `wa.me`, no email;
- 390 px no tiene overflow;
- lint, build y checks pasan.

No dedicar tiempo a OG individual, dominio, imágenes perfectas o pixel polish antes de contactar prospectos.

---

## 6. Venta mañana

Orden de probabilidad:

1. **Contactos cálidos:** familia de Mamabel, Gabriel, Magdalena y conocidos de comercios.
2. Referidos de esos contactos.
3. Comercios fríos de Olivos/Vicente López con Instagram/WhatsApp pero sin web útil.

### Meta

- 5 contactos cálidos;
- 20 contactos locales dirigidos;
- 6 respuestas;
- 3 demos de 3 minutos;
- 1 reserva equivalente a USD 50.

### Mensaje inicial

> Hola. Armé una muestra de cómo podría verse un negocio de [RUBRO] para que los pedidos/consultas lleguen más ordenados: [URL]. Es ilustrativa, no usé datos tuyos. Si te interesa, mañana te preparo una versión con tu marca y hasta 8 productos. La reserva es el equivalente a USD 50 y se descuenta completa si después hacemos el sitio final. ¿Te la muestro en 3 minutos?

### Demo de 3 minutos

1. Abrir el rubro correcto.
2. Personalizar nombre/color en `/demo/armar`.
3. Mostrar cliente y local/cotización.
4. Cerrar con entrega concreta: `tu marca + 8 productos + WhatsApp mañana`.
5. Enviar alias o link de pago manual.

No decir “plataforma terminada”, “MP integrado” ni “pedidos en la nube”.

---

## 7. Stop absoluto

Hasta cobrar la primera reserva, no hacer:

- auth/Firebase;
- Mercado Pago dentro del producto;
- otra vertical;
- imágenes perfectas;
- dominio por demo;
- WhatsApp Business API;
- IA;
- planes nuevos;
- rediseño de Mamabel o landing.

La próxima acción después de dos pasadas verdes es vender, no programar.
