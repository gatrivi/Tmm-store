# Demo vertical — pizzería / empanadas

**Estado: shipped** (v1.9.1) — Fit A sales (ZN shortlist).

## Por qué esta vertical

Playbook + leads Olivos/VL: pizza/empanadas/roti = quién más probable contrata.
`/demo` legacy es choripán — mal pitch. Esta demo habla el idioma del prospecto.

## Problema (60s)

> Audio “una muzza grande y media docena de carne” → pedido estructurado en bandeja.

## Rutas

| Uso | Path |
|-----|------|
| Cliente | `/demo/pizzeria` |
| Panel | `/demo/pizzeria/owner` |
| Seguimiento | `/demo/pizzeria/order/:id` |

- Config: `src/data/demos/pizzeria.ts`
- UI cliente: Storefront (mismo patrón registry que carnicería)
- Storage: `trufi_demo_orders_v2:pizzeria`
- Tenant: `demo-pizzeria`
- Check: `npm run check:demo`

## Nombre de trabajo

**La Barrial** — reemplazar cuando cierre un piloto.

See also: [`vertical-demos-plan.md`](./vertical-demos-plan.md), [`prospect-demo.md`](../ops/prospect-demo.md)
