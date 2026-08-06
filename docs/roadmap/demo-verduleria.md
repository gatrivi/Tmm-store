# Demo vertical — La Inmaculada (verdulería)

**Estado: shipped** (v1.21.1) · página dedicada foto-first · Express `?rubro=verduleria` redirige acá
## Prospect

| Campo | Valor |
|-------|--------|
| Marca | **La Inmaculada** |
| Ubicación | Ugarte y España |
| Rubro | Verdulería / frutería |
| Relación | Amigos (OK usar nombre) |
| Assets | `public/demos/verduleria/` — presets editoriales; reemplazar con fotos del local |

## Problema (60s)

> Lista por chat (“tomate, banana…”) → producto + ½ kg/kg + total estimado → dueño confirma.

## Rutas

| Uso | Path |
|-----|------|
| Cliente | `/demo/verduleria` |
| Panel | `/demo/verduleria/owner` |
| Seguimiento | `/demo/verduleria/order/:id` |

- Config: `src/data/demos/verduleria.ts`
- UI: `VerduleriaDemoPage` (hero marca + cards foto + sticky cart)
- Express: `/demo?rubro=verduleria` → `/demo/verduleria`
- Storage: `trufi_demo_orders_v2:verduleria`
- Tenant: `demo-verduleria`
- Check: `npm run check:demo`
- E2E: `e2e/demo-verduleria.spec.ts`

## Pendiente visita / assets

- Hero + foto real por producto
- Precios reales
- Horarios / zona delivery / WSP del local
- Logo oficial

## Brand tokens (demo)

| Token | Hex |
|-------|-----|
| Leaf / bordo | `#2F6B3A` |
| Carbon | `#1A2A1C` |
| Hueso | `#F1F6EE` |
| Papel | `#D5E2D4` |
| Salvia | `#5A8F62` |

See also: [`vertical-demos-plan.md`](./vertical-demos-plan.md)
