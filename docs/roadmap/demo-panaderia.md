# Demo vertical — Panadería Artesanal La Magdalena

**Estado: shipped** (v1.9.3) · prospect real

## Prospect

| Campo | Valor |
|-------|--------|
| Nombre | Panadería Artesanal La Magdalena |
| WSP | 11 6563-860 → `549116563860` |
| Logo | blueprint + pintura (`public/demos/panaderia/`) |

## Problema (60s)

> Audio a las 7: “docena de medialunas” → pedido estructurado + retiro con hora en notas.

## Rutas

| Uso | Path |
|-----|------|
| Cliente | `/demo/panaderia` |
| Panel | `/demo/panaderia/owner` |
| Seguimiento | `/demo/panaderia/order/:id` |

- Config: `src/data/demos/panaderia.ts`
- UI: Storefront + registry
- Storage: `trufi_demo_orders_v2:panaderia`
- Tenant: `demo-panaderia`
- Theme: blueprint navy/cyan
- Check: `npm run check:demo`

Demo checkout **no envía** WSP real (`demoMode`).

See also: [`prospect-demo.md`](../ops/prospect-demo.md)
