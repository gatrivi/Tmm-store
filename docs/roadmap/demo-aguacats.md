# Demo vertical — Aguacats (ex Refcurcum)

**Estado: shipped** (v1.16.0) · prospect amigo

## Prospect

| Campo | Valor |
|-------|--------|
| Marca | Aguacats · display IG aún dice Refcurcum |
| IG | [@aguacats21](https://www.instagram.com/aguacats21/) |
| WSP | +54 11 7139-5174 → `541171395174` |
| Rubro | Despensa / fresco · mayor y menor · delivery AMBA |
| Assets | `public/demos/aguacats/` (logo + hero + IG scrape) |

## Problema (60s)

> Audio “mandame 2 botellas y un cajón” → pedido estructurado + delivery.

## Rutas

| Uso | Path |
|-----|------|
| Cliente | `/demo/aguacats` |
| Panel | `/demo/aguacats/owner` |
| Seguimiento | `/demo/aguacats/order/:id` |

- Config: `src/data/demos/aguacats.ts`
- Storage: `trufi_demo_orders_v2:aguacats`
- Tenant: `demo-aguacats`
- Theme: leaf green / cream / gold accent
- Scrape: `npx --yes tsx scripts/scrape-aguacats-brave.ts` (Brave CDP :9222)
- Check: `npm run check:demo`

Demo checkout **no envía** WSP real (`demoMode`). Precios ilustrativos (IG casi sin fotos de producto reales).

See also: [`prospect-demo.md`](../ops/prospect-demo.md)
