# Demo vertical — carnicería de Gabriel

Brief de producto e implementación para Cursor.

**Estado: Hito 1 shipped** (v1.8.0) — vertical `/demo/carniceria` aislada del showcase gastronómico.

- Config: `src/data/demos/carniceria.ts`
- Registry: `src/utils/demoRegistry.ts`
- Check: `npm run check:demo`
- Storage: `trufi_demo_orders_v2:carniceria`

Placeholders pendientes: foto/nombre real, precios, cobertura, punto de retiro. Sin motor de peso variable (siguiente hito).

---

Estado de referencia original: rama `trabajo`, después de Orders v2 Hito 1
(`cf2b2bf`), 21 de julio de 2026.

## 0. Instrucción para Cursor

Implementar únicamente el Hito 1 de este documento y detenerse cuando sus
criterios de aceptación estén verificados.

Esta es una demo vertical nueva. No reemplaza `/demo`, Demo Express ni la demo
gastronómica existente.

Reglas:

- No rediseñar la landing ni el panel general.
- No duplicar Storefront, CheckoutModal ni los componentes de órdenes.
- No crear una segunda máquina de estados.
- No conectar Firebase, Mercado Pago, un WhatsApp real ni analytics.
- No presentar productos, precios, dirección o promesas comerciales como datos
  reales de Gabriel. Todo lo no confirmado debe figurar como demostración.
- No agregar controles decorativos o sin comportamiento.
- No implementar todavía un motor de peso variable ni ajuste de total.
- Mantener intacto el flujo `/demo` ↔ `/demo/owner`.

## 1. Resultado buscado

Una demo creíble de carnicería barrial sin salón de ventas: el cliente pide
cortes por presentaciones simples, elige delivery o retiro coordinado, envía el
pedido y Gabriel lo recibe en la misma bandeja operativa.

La demo debe vender una idea en menos de un minuto:

> Elegís el corte y la cantidad. Gabriel confirma peso, total y horario antes
> de preparar el pedido.

Nombre de trabajo: **Gabriel Carnes**. Debe vivir en una sola configuración
para reemplazarlo en segundos cuando llegue el nombre real.

## 2. Rutas

| Uso | Ruta |
| --- | --- |
| Cliente | `/demo/carniceria` |
| Panel de Gabriel | `/demo/carniceria/owner` |
| Seguimiento | `/demo/carniceria/order/:orderId` |

Requisitos:

- Las tres rutas deben funcionar al entrar directamente y al recargar.
- Usar scope/tenant `demo-carniceria`, no `demo`.
- Persistir solo en `sessionStorage`, aislado de la demo gastronómica.
- Mantener el mismo ID, ítems y total estimado entre cliente, panel y
  seguimiento.

Hoy App, CommerceApp, MenuContext y PlanContext tratan todo path que empieza por
`/demo` como el tenant `demo`. Centralizar la resolución en una función común;
no sumar cuatro regex distintas.

## 3. Posicionamiento

### Promesa

**Carne elegida por Gabriel, lista para tu cocina.**

Apoyo:

**Pedí por peso, elegí entrega o retiro y coordinamos por WhatsApp.**

No usar afirmaciones todavía no verificadas, por ejemplo “premium”, “de campo”,
“faena propia”, “mejor precio”, “entrega en el día” o “cadena de frío
garantizada”.

### Personalidad

- Barrial y confiable, no parrilla temática.
- Directa: corte, cantidad, preparación, entrega.
- Gabriel es la cara humana; Trufi queda en el pie y la cinta de demo.
- Español únicamente.

## 4. Dirección visual

Evitar el verde de delivery genérico y la estética de restaurante oscuro.

| Token | Valor | Uso |
| --- | --- | --- |
| hueso | `#F4EFE7` | fondo principal |
| bordó | `#7B1E24` | CTA y acentos |
| carbón | `#1D1B18` | texto y header |
| papel | `#D8C8B4` | superficies secundarias |
| salvia | `#68705A` | disponibilidad y confianza |

- Títulos: serif robusta disponible en el proyecto.
- Interfaz: sans legible, números con buen contraste.
- Formas: tarjetas sobrias, bordes finos, radios moderados.
- No usar cuchillos ensangrentados, llamas, vacas caricaturescas ni textura de
  madera falsa.
- Hasta recibir la foto: monograma `GC` y bloque visual neutro.
- Asset futuro: `public/demos/carniceria/gabriel.*`; el object-position debe
  configurarse junto al asset, no quedar hardcodeado en el componente.

## 5. Portada cliente

Orden móvil:

1. Cinta `DEMO · productos y precios ilustrativos`.
2. Marca `Gabriel Carnes` + monograma/foto.
3. Promesa y texto de apoyo.
4. Dos chips informativos, no botones: `Delivery` y `Retiro coordinado`.
5. Aviso compacto: `El peso puede variar. Confirmamos el total antes de
   preparar.`
6. Categorías.
7. Productos.
8. Carrito fijo existente.

No mostrar:

- Dirección de local o link de Maps.
- Selector de idiomas.
- USD.
- Mercado Pago.
- IA.
- Horarios inventados.

Plan de la vertical: `pedidos`, no `premium`.

## 6. Catálogo demo

Los valores siguientes son semillas ilustrativas para que la pantalla tenga
densidad realista. Una fuente/config debe contener todo el catálogo; no repartir
los textos entre componentes.

### Categorías

1. `Para la parrilla`
2. `Todos los días`
3. `Listos para cocinar`

### Productos

| ID | Producto | Categoría | Presentaciones | Precio demo | Nota breve |
| --- | --- | --- | --- | ---: | --- |
| `combo-parrillero` | Combo parrillero | parrilla | Pack 2–3 personas | $49.900 | Asado, vacío, chorizos y morcillas |
| `asado` | Asado del medio | parrilla | ½ kg / 1 kg aprox. | $18.900/kg | Tira pareja para parrilla |
| `vacio` | Vacío | parrilla | ½ kg / 1 kg aprox. | $16.900/kg | Pieza sabrosa, cocción lenta |
| `bife-ancho` | Bife ancho | parrilla | ½ kg / 1 kg aprox. | $25.200/kg | Cortado en bifes |
| `nalga` | Nalga para milanesas | diario | ½ kg / 1 kg aprox. | $32.000/kg | Feteada fina o mediana |
| `picada` | Picada especial | diario | ½ kg / 1 kg aprox. | $14.000/kg | Para hamburguesas, salsa o relleno |
| `milanesas` | Milanesas de carne | listos | Bandeja ½ kg / 1 kg aprox. | $34.900/kg | Empanadas y listas para cocinar |
| `hamburguesas` | Hamburguesas caseras | listos | Pack de 4 | $12.900 | Medallones frescos |

Implementación Hito 1:

- Representar peso mediante las opciones existentes (`½ kg aprox.` y `1 kg
  aprox.`), con precio ya calculado.
- Cantidad del carrito multiplica paquetes; no gramos.
- En esta vertical, cambiar la etiqueta `Total` por `Total estimado` en carrito,
  checkout, confirmación, panel y seguimiento.
- Debajo del total: `Gabriel confirma peso y total antes de preparar.`
- Los productos fijos, como combos y packs, no necesitan esa nota por ítem.
- Badge útil máximo en dos productos: `Más pedido` y `Rinde 2–3`.

Los precios se tomaron solo como orden de magnitud de listados públicos de
Vicente López y deben reemplazarse al recibir la lista de Gabriel:

- Vacarne, Vicente López:
  https://www.pedidosya.com.ar/restaurantes/vicente-lopez/vacarne-d5080fdf-eb7e-4330-8700-27aa290f9164-menu
- Carnes Vicente López:
  https://www.instagram.com/carnesvicentelopez/

## 7. Carrito y checkout

### Carrito

- Nombre + presentación, por ejemplo `1 × Vacío · 1 kg aprox.`.
- `Total estimado` siempre visible.
- CTA: `Coordinar pedido`.
- Nada de cupones en esta demo.

### Datos

Campos mínimos:

- Nombre.
- WhatsApp.
- `Delivery` o `Retiro coordinado`.
- Dirección, solo para delivery.
- Notas, con ejemplo: `Cortar los bifes medianos`.

Copy de retiro:

> Retiro coordinado en Olivos. Gabriel te confirma punto y horario.

Copy de delivery:

> Ingresá tu dirección. Gabriel confirma cobertura y horario antes de preparar.

No inventar zonas, costos ni franjas horarias hasta que Gabriel los confirme.

### Pago

Opciones demo:

- `Transferencia al confirmar`.
- `Efectivo al recibir`.

No abrir pagos ni WhatsApp. El botón final es `Enviar pedido de prueba`.

### Confirmación

Título:

**Pedido recibido por Gabriel**

Texto:

**Es una simulación: no se envió ningún mensaje ni pago.**

Acciones:

1. `Ver cómo lo recibe Gabriel` → panel de esta vertical.
2. `Ver estado del pedido` → seguimiento de esta vertical.
3. `Seguir comprando`.

## 8. Panel de Gabriel

Reutilizar DemoOwnerPage y los componentes de Orders v2; parametrizar contenido
y datos. No copiar la página.

Encabezado:

- `Pedidos de Gabriel`
- `Demo carnicería · hoy`

Semillas iniciales:

| Estado | Cliente | Modalidad | Pedido |
| --- | --- | --- | --- |
| Nuevo | Lucía M. | Delivery | 1 kg asado + 1 kg vacío |
| Preparando | Martín R. | Retiro | 1 kg nalga + ½ kg picada |
| Listo | Ana P. | Delivery | Combo parrillero |

Requisitos:

- El pedido creado por el prospecto aparece primero y marcado `Tu pedido de
  prueba`.
- CTA y transiciones usan `orderStateMachine.ts` sin estados nuevos.
- La palabra `Total` pasa a `Estimado` para esta vertical.
- No mostrar revenue como venta cobrada. Si hay métrica monetaria, titularla
  `Pedidos estimados`.
- No mostrar controles de pago que simulen cobro real.
- No mostrar impresión, WhatsApp o links que apunten a personas reales.

## 9. Configuración sugerida

Crear una definición declarativa, por ejemplo:

```ts
export interface DemoDefinition {
  id: string;
  tenantId: string;
  customerPath: string;
  ownerPath: string;
  plan: Plan;
  locale: 'es';
  siteSettings: Partial<SiteSettings>;
  menuItems: MenuItemType[];
  menuCategories: MenuCategory[];
  seedOrders: OrderRecord[];
  copy: {
    heroTitle: string;
    heroBody: string;
    checkoutCta: string;
    totalLabel: string;
    ownerTitle: string;
  };
}
```

Archivo sugerido:

`src/data/demos/carniceria.ts`

Resolver sugerido:

`src/utils/demoRegistry.ts`

El resolver debe ser la fuente de verdad para App/CommerceApp, MenuContext,
PlanContext, CheckoutModal, DemoOwnerPage, seguimiento y repositorio demo.

Session storage sugerido:

`trufi_demo_orders_v2:carniceria`

No aceptar que la vertical dependa de `tenantId === 'demo'`; usar una función o
definición que reconozca tenants demo.

## 10. Hito 1 — demo vendible

Implementar:

1. Registry/config de demos.
2. Tres rutas dedicadas.
3. Marca, copy y catálogo de Gabriel.
4. Storefront español, plan Pedidos, sin funciones irrelevantes.
5. Delivery y retiro coordinado.
6. Totales rotulados como estimados.
7. Pedido seguro en sessionStorage aislado.
8. Panel y seguimiento coherentes.
9. Slot de foto con fallback GC.

No implementar:

- Peso exacto editado por el dueño.
- Cambio de total posterior.
- Cobro real.
- Zonas/tarifas/horarios.
- Login, Firebase o tenants reales.
- Catálogo editable específico.
- Notificaciones.

## 11. Aceptación

1. `/demo`, `/demo/owner` y Demo Express siguen funcionando igual.
2. `/demo/carniceria` abre por URL directa y muestra cero hamburguesas,
   choripanes o copy de restaurante.
3. Se pueden agregar un producto por peso y un pack fijo.
4. Carrito, checkout y panel dicen `estimado`, no fingen precio final.
5. Delivery exige dirección; retiro no la pide y no inventa un local.
6. Enviar crea exactamente un pedido y limpia el carrito solo al confirmar.
7. El mismo ID, ítems y estimado aparecen en panel y seguimiento.
8. El panel completa retiro y delivery con los CTA actuales.
9. La demo no abre WhatsApp, MP, Maps ni Firebase.
10. A 390 px no hay controles fuera de pantalla; card, carrito, checkout y
    drawer se operan con una mano.
11. No hay botones o links muertos.
12. Pasan lint, build y las pruebas agregadas.

Pruebas mínimas:

- Resolución de las tres rutas y del tenant aislado.
- Menú/config correctos para `demo-carniceria`.
- Storage de carnicería no contamina `trufi_demo_orders_v2`.
- Pedido pickup y pedido delivery conservan ID/total estimado.
- Smoke manual 390 px y escritorio.

## 12. Después del Hito 1

Detenerse y reportar:

- archivos tocados;
- rutas probadas;
- captura móvil cliente;
- captura móvil panel;
- resultado de lint, build y tests;
- decisiones que quedaron como placeholder esperando foto, nombre real,
  catálogo, precios, cobertura y punto de retiro de Gabriel.

El siguiente paso, fuera de este hito, será decidir si el producto generaliza
`precio estimado → peso preparado → total final`. No esconder ese trabajo dentro
de esta demo.
