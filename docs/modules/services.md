# Services

Purpose: order persistence and tenant cloud ops.

Paths: `src/services/orderService.ts`, `src/services/tenantService.ts`

## orderService

- `createOrder`, `getOrder`, `listOrders`, `subscribeOrders`
- `updateOrderStatus`, `updateOrderPaymentStatus`
- Firestore if configured; else `trufi_orders_{tenantId}` in localStorage
- Statuses normalized on read (`accepted`→`preparing`, `delivered`→`completed`)

## demoOrderRepository

- sessionStorage scoped by demo id via `demoRegistry`
- Gastronomía: `trufi_demo_orders_v2` (`/demo` ↔ `/demo/owner`)
- Carnicería: `trufi_demo_orders_v2:carniceria` (`/demo/carniceria` ↔ owner)
- Seeds until prospect creates an order; prospect IDs highlighted
- Same-tab updates via `DEMO_ORDERS_EVENT` (no 1.5s poll)
- Flow check: `src/services/demoOrderFlow.selfcheck.ts`

## demoRegistry

- `src/utils/demoRegistry.ts` — path → tenant / storage key
- Config: `src/data/demos/carniceria.ts`
- Check: `npm run check:demo`

## orderStateMachine

- `nextOperationalStatus`, `primaryActionLabel`, `canTransition`

## tenantService

- `loadTenantData`, `saveTenantSnapshot`, `createTenant`, `listTenants`
- Requires Firebase

See also: [features/orders-admin.md](../features/orders-admin.md), [features/firebase-tenants.md](../features/firebase-tenants.md)
