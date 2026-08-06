# Plan — verticales que compran + demos

Fecha: 2026-07-26 · Producto: carta + carrito + WSP estructurado + bandeja dueño · 0 comisión.

## Filtro de compra (por qué sí / no)

Trufi gana cuando hay **pedido recurrente por WSP desordenado** + dueño que atiende el teléfono + odio a comisión Rappi/PD.

| Señal | Peso |
|-------|------|
| Pedidos por WSP hoy (audio/foto/texto) | crítico |
| Catálogo repetible (ítems + qty) | crítico |
| Delivery / retiro (no solo salón) | alto |
| Dueño = cocina/mostrador | alto |
| Sin web propia / solo IG | alto |
| Competidor con comisión fija | medio |
| Ticket bajo–medio, volumen diario | medio |

**Fuera de foco ahora:** zapatería, indumentaria (probar talle), café solo mesa, resto fino/sushi (ciclo largo, fit C), servicios sin catálogo.

## Ranking de verticales (probabilidad de compra)

| # | Vertical | Prob | Por qué | Ya tenemos |
|---|----------|------|---------|------------|
| 1 | **Pizzería / empanadas / roti** | ★★★★★ | Fit A playbook; WSP caos; pitch 0 comisión | `/demo/pizzeria` (v1.9.1) |
| 2 | **Carnicería barrial** | ★★★★☆ | Cortes + “confirmo peso”; sin Rappi típico | `/demo/carniceria` |
| 3 | **Verdulería / frutería** | ★★★★☆ | Pedido semanal por WSP; peso/unidad; mismo patrón carnicería | — |
| 4 | **Panadería / facturas** | ★★★☆☆ | Encargos mañana; lista fija; pico 6–9h | `/demo/panaderia` (La Magdalena) |
| 5 | **Pollería / rotisería pollos** | ★★★☆☆ | Igual pizza/roti; half/pollo + guarnición | cubierto por `/demo` + armar |
| 6 | **Heladería / sandwiches** | ★★★☆☆ | Pedido WSP fin de semana; sabores/combos | — |
| 7 | **Café takeaway / dark kitchen** | ★★☆☆☆ | Solo si delivery propio; mesa = no | — |
| 8 | **Farmacia / dietética** | ★★☆☆☆ | Catálogo sí, regulación/stock no | diferir |
| — | Zapatería / ropa | ★☆☆☆☆ | No es pedido WSP estructurado | no |

## Problema → demo (1 idea por vertical)

Cada demo = **un dolor en 60s**, no feature dump. Patrón carnicería: config `src/data/demos/<id>.ts` + rutas `/demo/<id>` · `/owner` · `/order/:id`.

| Vertical | Problema del dueño | Momento demo (60s) | Diferenciador UI |
|----------|--------------------|--------------------|------------------|
| **Pizza/empanadas** | Audio + “¿tienen muzzarella?” + dirección a medias | 2 ítems → checkout → bandeja Nuevo→Prep | Ya `/demo` — no clonar |
| **Carnicería** | “Mandame 2 kg asado” sin corte/peso/total | Corte + presentación → total **estimado** → dueño confirma | Shipped |
| **Verdulería** | Lista por chat (“tomate, banana…”) sin kg ni total | Producto + unidad/kg pills → estimado → dueño ajusta | Clonar patrón carnicería |
| **Panadería** | Encargo de facturas a las 7am por WSP suelto | Pack mañana (docena/media) + retiro horario → bandeja | Chip horario retiro; sin delivery default |
| **Pollería** | “1 pollo + papas” sin tamaños | Half/entero + guarnición → WSP limpio | Variants en carta; puede ser `/demo/armar` |
| **Heladería** | Sabores por audio; se pierden | Combo kg + 2 sabores obligatorios en carrito | Selector sabores en ítem |
| **Café takeaway** | Pedido café+medialuna mezclado con charla | Menú fijo + “para cuándo” (retiro) | Solo si lead real pide |

## Orden de build (lazy)

1. **Done:** `/demo/pizzeria` · `/demo/panaderia` (La Magdalena) · carnicería · `/demo` legacy.
2. **Siguiente vertical real:** verdulería (mismo motor peso/unidad que carnicería; alto WSP barrio ZN).
3. **Pollería/heladería:** primero `/demo/armar`; solo vertical si cierra lead.
4. **Café / farmacia / zapatería:** no build hasta lead pagando depósito.

## Criterio “armar vertical nueva”

Sí si:
- ≥1 lead concreto pide ver “como la mía”, **o**
- el dolor no se muestra bien con `/demo` + `/demo/armar`

No si: solo marketing genérico — usar Express.

## Entregables por vertical (cuando se apruebe build)

- [ ] `src/data/demos/<id>.ts` (copy + 6–10 productos + seed orders)
- [ ] Rutas en registry (mismo patrón carnicería)
- [ ] Assets `public/demos/<id>/` (hero + **foto por producto**)
- [ ] Brief corto en `docs/roadmap/demo-<id>.md` (problema + 60s script)
- [ ] Link en [`prospect-demo.md`](../ops/prospect-demo.md) + índice README
- [ ] `npm run check:demo` verde (`demoPhotos.selfcheck` exige archivos en disco)

## Fotos en demos (regla ventas)

Catálogo vacío = demo mala. Presets: `/demos/presets/<rubro>/<itemId>.jpg`. Verticales: `public/demos/<id>/`.

## Decisión pedida

Confirmar **próxima vertical a buildear:** ¿verdulería o panadería? (default recomendado: **verdulería**).

See also: [`prospect-demo.md`](../ops/prospect-demo.md), [`demo-carniceria-gabriel.md`](./demo-carniceria-gabriel.md), [`sales-playbook-zn.md`](../ops/sales-playbook-zn.md)
