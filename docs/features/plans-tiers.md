# Plans and tiers

Purpose: gate features by subscription product (Menu, Pedidos, Premium).

Paths: `src/config/plans.ts`, `src/context/PlanContext.tsx`

Deps: `VITE_PLAN` env (`menu` | `pedidos` | `premium`, default `pedidos`)

## Tiers

| Plan | Order | MP | AI | Admin orders | Promos | Reports |
|------|-------|----|----|--------------|--------|---------|
| menu | no | no | no | no | no | no |
| pedidos | yes | yes | no | yes | yes | yes |
| premium | yes | yes | yes | yes | yes | yes |

## Flow

- `parsePlan()` reads env
- `usePlan()` exposes `plan`, `features`, `tenantId`
- Storefront hides cart when `!features.canOrder`
- AdminPanel filters nav tabs by features

## Gotchas

- Plan is per-deploy today; tenant record can override when Firebase loads
- Menu tier shows WhatsApp contact CTA, not structured checkout
- Future monetization: [Gaucho mode](../roadmap/gaucho-mode.md) (free + voluntary pay) — not a plan enum yet

See also: [components/storefront.md](../components/storefront.md), [ops/onboarding.md](../ops/onboarding.md), [roadmap/README.md](../roadmap/README.md)
