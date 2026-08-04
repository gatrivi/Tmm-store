# Demo vertical — Aguacats (ex Refcurcum)

**Estado: shipped** (v1.17.1) · página dedicada v2 · fotos IG por producto

## Prospect

| Campo | Valor |
|-------|--------|
| Contacto | Fermín Ibáñez (amigo) |
| Marca pública | **Aguacats** · display IG aún **Refcurcum** 🥑 |
| IG | [@aguacats21](https://www.instagram.com/aguacats21/) · ~814 followers |
| WSP | +54 11 7139-5174 → `541171395174` |
| Ubicación | **AR / AMBA** (no GB). Envios a domicilio |
| Rubro | **Distribuidora de paltas** (foodservice) · mayor y menor |
| Mascota | Yaguacat / jaguar antropomorfo · logo aguacate+yaguareté |
| Assets | `public/demos/aguacats/` |

## Brand tokens (demo)

| Token | Hex |
|-------|-----|
| Leaf / bordo | `#3D6B2A` |
| Carbon | `#1A2E14` |
| Cream / hueso | `#F4F7E8` |
| Salvia | `#6BA84F` |
| Gold accent | `#C4A035` |

Font: `"Trebuchet MS", "Segoe UI", system-ui, sans-serif`

## Problema (60s)

> Pedido por WhatsApp sin audios → palta + combo armado + envío AMBA.

## Rutas

| Uso | Path |
|-----|------|
| Cliente | `/demo/aguacats` |
| Panel | `/demo/aguacats/owner` |
| Seguimiento | `/demo/aguacats/order/:id` |
| Live | https://tmm.gatrivi.com/demo/aguacats |

- Config: `src/data/demos/aguacats.ts`
- Storage: `trufi_demo_orders_v2:aguacats`
- Tenant: `demo-aguacats`
- UI: `AguacatsDemoPage` — sitio multi-sección (Navarro/Zengasoft tier) + catálogo
- Scrape: `npx --yes tsx scripts/scrape-aguacats-brave.ts` (Brave CDP `:9222`)
- Check: `npm run check:demo`
- Gaps: [`aguacats-content-gaps.md`](../aguacats-content-gaps.md)

## Carta demo (ilustrativa)

Paltas: Hass + combo frescura · Complementos: frutillas, miel, aceite.

Imágenes catálogo: `public/demos/aguacats/products/` (generadas demo · producto centro · leopardo bg sutil).

## Guardrails

- Checkout **no** envía WSP real (`demoMode`)
- No inventar domicilio físico / CUIT / precios “oficiales”
- No afirmar presencia UK/GB
- No inventar empresa a nombre de Fermín sin fuente

See also: [`prospect-demo.md`](../ops/prospect-demo.md)
