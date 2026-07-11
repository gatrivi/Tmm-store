# Architecture

Purpose: white-label food ordering SPA (PedidoDirecto-style) with 3 product tiers.

**Stack:** React 19, Vite 6, TypeScript, Tailwind v4, Vercel (+ serverless).

## Routes

| Path | Page |
|------|------|
| `/`, `/s/:slug` | Storefront |
| `/admin`, `/s/:slug/admin` | Admin |
| `/order/:orderId` | Order status |
| `/pricing` | Plan pricing |
| `/super-admin` | Tenant provisioning |

Paths: `src/App.tsx`

## Layers

- **UI:** `src/pages/`, `src/components/`
- **State:** React Context (`src/context/`)
- **Persistence:** localStorage (default); Firestore when `VITE_FIREBASE_*` set
- **Serverless:** `api/` (MP, AI, webhooks)

## Data flow (order)

1. Customer builds cart on Storefront
2. CheckoutModal validates, persists order (`orderService`)
3. WhatsApp handoff and/or MercadoPago redirect
4. AdminOrders subscribes to orders; status updates sync to `/order/:id`

## Plan gating

`VITE_PLAN` → `PlanContext` → `src/config/plans.ts` feature matrix.

## Gotchas

- MP functions only run on Vercel deploy/preview
- Without Firebase, orders live in localStorage per browser
- Tenant ID from `VITE_TENANT_ID` or URL slug `/s/:slug`

See also: [features/plans-tiers.md](./features/plans-tiers.md), [modules/contexts.md](./modules/contexts.md)
