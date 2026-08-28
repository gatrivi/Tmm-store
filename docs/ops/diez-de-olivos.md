# Diez de Olivos — targets con 100+ reseñas sin web

Fecha de datos: **jul–ago 2026** · Filtro: **100+ reseñas Google y sin sitio propio** (FB/IG/pedix = sin web) · Tablero vivo: [`public/diez-de-olivos.html`](../../public/diez-de-olivos.html) → en producción `tmm.gatrivi.com/diez-de-olivos.html` (atajo `/diez`).

**Regla del filtro:** no inventar datos; si un dato es "por verificar" va marcado. Refresh con Places API cuando haya key (`npm run leads:scan`; hoy `.env` no tiene `GOOGLE_PLACES_API_KEY`).

## La lista (orden de ataque)

| # | Negocio | Reseñas | Rubro | Demo asignada | Ángulo | Estado fuente |
|---|---------|---------|-------|---------------|--------|----------------|
| 1 | 🔥 La Inmaculada | cálida | Verdulería | [/verduleria](https://tmm.gatrivi.com/verduleria) | lead amigos · propuesta completa en [propuesta-inmaculada.md](./propuesta-inmaculada.md) | ago-26 |
| 2 | 🔥 Canavesi Carnes | por contar | Carnicería (multi) | [/demo/canavesi](https://tmm.gatrivi.com/demo/canavesi) | web caída HTTP500 · kit trueque listo ([trueque-canavesi-kit.md](./trueque-canavesi-kit.md)) | ago-26 |
| 3 | Dale Vicente | 102 | Pizzería | /demo/pizzeria | clásico VL, solo FB | jul-26 scan |
| 4 | Croxi Pizzería | 110 | Pizzería | /demo/pizzeria | delivery propio, solo Google site | jul-26 scan |
| 5 | El Corcubión | 161 | Gastronomía | /demo | solo IG | jul-26 scan |
| 6 | Pizzería San Antonio | 201 | Pizzería | /demo/pizzeria | venden por Rappi → ángulo 0% comisión | jul-26 scan |
| 7 | Bebotes | 238 | **a confirmar en visita** | /demo/zimba-pet (si pet) | reemplazar si no encaja | jul-26 scan |
| 8 | Rincón del Bajo | 267 | Pizzería/cocina | /demo/pizzeria | ya en Pedix → pitch menos coste + panel propio | jul-26 scan |
| 9 | La Nueva Cocinita | 293 | Cocina | /demo/pizzeria | sin web, pide por teléfono | jul-26 scan |
| 10 | Morelia Pizza | 3.329 | Pizzería | /demo/pizzeria | volumen: demanda sobra, falta canal propio | jul-26 scan |

Demo + proposal asegurados para los 10 (ver tablero): cada fila tiene link de demo cliente, panel dueño y proposal personalizada copiable.

## Cómo generar ingresos esta semana (ya mismo)

1. **Hoy:** mandar WSP a La Inmaculada (mensaje redactado en su propuesta) y Canavesi (móvil → botón WhatsApp del tablero).
2. **Hoy/mañana:** fijos → llamar **antes del pico (11:30 o 19:00)**, orden de tabla.
3. **Cierre estándar:** "muestra gratis con tus productos, lista en 24 h" → armado a medida `/demo/armar` → carga checklist (productos/fotos/horarios/WSP) → go-live 48–72 hs → **factura mes 1** (plan Pedidos $20.000/mes · 0% comisión, ref. [propuesta-inmaculada.md](./propuesta-inmaculada.md)).
4. **Sin cierre:** dejar el brief A6 impreso del rubro (lleva QR al demo). Imprimir con `npm run briefs`.
5. Si Canavesi cierra trueque: no cobrarle al resto igual — queda como caso ("Canavesi ya vende así") para acelerar el cierre cash de los demás.

## Bajas y reposiciones

Criterio para salir de la lista: rubro no calza (ver caso Bebotes), local cerró, o aparece web propia nueva. Reposición: buscar con el mismo filtro (100+ res., sin web, Olivos/VL), agregar al tablero editando `L` en `public/diez-de-olivos.html` con demo + proposal antes de llamar — **no se llama a un lead sin demo asignada**.

## Pendientes

- [ ] Contar reseñas exactas Canavesi e Inmaculada en Maps (5 min, celular).
- [ ] Confirmar rubro Bebotes en visita (o reemplazar).
- [ ] Alta `GOOGLE_PLACES_API_KEY` en Google Cloud → correr `npm run leads:scan` para refrescar/reemplazar lista completa automáticamente.
