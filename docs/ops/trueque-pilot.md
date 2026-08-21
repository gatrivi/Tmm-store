# Piloto trueque — sitios por producto (Gate A)

**Idea:** cerrar 1–2 tenants reales cobrados **en producto** en vez de plata. Test de waters antes de venta fría en cash. Cada trueque produce: tenant live `/s/<slug>` + testimonial + métricas de pedidos → activo de venta para los siguientes.

**Precedente:** Ricardo Hombres (San Fernando) — su socio les hizo el sitio a cambio de un traje + descuentos. Mismo modelo, nuestra versión: **llenar el freezer de carne + descuentos futuros**.

**Frame clave (decirlo así):** cobrar en mercadería **no es trabajar gratis — es cobrar**, con descuento efectivo para el comercio. Ellos pagan con producto a valor público; nosotros recibimos mercadería que consumimos igual. Nadie regala nada.

## Por qué trueque (y con quién)

- Trueque sólo con **proveedores/amistades cálidas**, no leads fríos. Con frío, la plata ancla el valor; con cálido, el producto recibido paga costo de vida y crea relación.
- **Carne = prioridad.** Proveedor de carne amigo es el activo más valioso de la lista (consumo propio + referral power en ZN gastronómico).
- Filtro de demanda sigue siendo el de siempre: **100+ reseñas Google sin web propia** ([leads-rings-routine.md](./leads-rings-routine.md)). El trueque no cambia el filtro — cambia el cierre.

## Targets

| # | Target | Estado | Por qué | Producto esperado |
|---|--------|--------|---------|-------------------|
| 1 | **Canavesi Carnes** (Olivos Borges) | demo shipped `/demo/canavesi` · web propia caída (HTTP 500) | Demo ya hecha, multi-sucursal, mayor+resto, dolor real | Corte mensual / pedidos con descuento — **kit:** [`trueque-canavesi-kit.md`](./trueque-canavesi-kit.md) |
| 2 | **Molino Florida** | demo shipped `/demo/molino-florida` | Harinas/cereales mayoristas; compra propia recurrente | Harina / canasta mensual |
| 3 | **Zimba Pet** (Vicente López) | demo preset `/demo/zimba-pet` · sin lead real aún | Consumible recurrente (alimento), ticket mensual claro | Alimento mensual |
| 4 | Verdulería (a elegir) | demo La Inmaculada existe | Vertical shipped, compra semanal propia | Bolso semanal |

**Regla:** arrancar con **1** (Canavesi). Sumar el 2° sólo si el 1° está live y funcionando 2 semanas.

## Estructura del trato

- **Alcance = Gate A exacto** (igual que cliente pagante): carta web + carrito + handoff WSP ordenado + bandeja dueño en celular, tenant `/s/<slug>`.
- **Contraprestación:** canje mensual (ej. X kg/mes o canasta), no pago único. Mensual = relación viva y renovable.
- **Siempre ofrecer alternativa cash:** "o $Y/mes si preferís plata" — evita anclar el mercado en $0 y mide disposición de pago real.
- **Además del producto, pedir (no negociable):**
  1. Su **número WSP real** en el sitio (el demo no puede; el tenant sí).
  2. Reseña Google a Gatrivi + testimonial escrito.
  3. **2 presentaciones** a dueños amigos (referral).
  4. Permiso de usar su marca como caso ("Canavesi vende con Gatrivi").
- **Duración:** piloto 3 meses, revisión, luego renueva o migra a cash.

## Guardrails

- **No prometer** pedidos reales multi-dispositivo (Gate B) ni MP integrado (Gate C) — igual que en venta cash.
- No inventar datos del comercio; todo lo público sale de fuentes documentadas.
- Trueque ≠ gratis para nosotros: registrar costo de soporte; si un trueque consume más horas que un cliente cash, cortar.
- El dueño carga su carta (armado wizard) — nosotros asistimos, no hacemos data entry eterno.

## Criterio de éxito → graduación a venta

- 1 tenant trueque live + ≥2 semanas de pedidos WSP reales fluyendo.
- Métricas anotadas: pedidos/semana, tiempo de respuesta dueño, qué falló.
- Con eso: caso real para el pitch cash ("Canavesi ya vende así") → recién ahí escalar outreach frío de la rutina de anillos.
