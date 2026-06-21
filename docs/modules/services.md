# Services

Purpose: order persistence and tenant cloud ops.

Paths: `src/services/orderService.ts`, `src/services/tenantService.ts`

## orderService

- `createOrder`, `getOrder`, `listOrders`, `subscribeOrders`
- `updateOrderStatus`, `updateOrderPaymentStatus`
- Firestore if configured; else `trufi_orders_{tenantId}` in localStorage

## tenantService

- `loadTenantData`, `saveTenantSnapshot`, `createTenant`, `listTenants`
- Requires Firebase

See also: [features/orders-admin.md](../features/orders-admin.md), [features/firebase-tenants.md](../features/firebase-tenants.md)
