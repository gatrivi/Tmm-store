# Orders admin

Purpose: real-time order inbox and customer status page.

Paths: `src/components/admin/AdminOrders.tsx`, `src/pages/OrderStatusPage.tsx`, `src/services/orderService.ts`, `src/types/order.ts`

Deps: Firestore optional; localStorage fallback keyed by tenant

## Status flow

`new` → `accepted` → `preparing` → `ready` → `delivered` (or `rejected` / `cancelled`)

## Flow

1. Checkout calls `createOrder()`
2. AdminOrders subscribes via `subscribeOrders()`
3. Admin advances status, **WSP quick replies** (Recibido / Preparando / Listo), **58mm ticket**, new-order **sound**
4. Customer polls `/order/:orderId`

## Ops (P1)

- `src/utils/whatsappTemplates.ts` — pre-filled wa.me to customer
- `src/utils/printTicket.ts` — thermal 58mm layout
- `src/utils/sounds.ts` — `playNewOrderSound()` on new orders
- Settings toggles: `orderSoundEnabled`, `autoPrintOnNewOrder`

## Cloud sync (P2)

- `CloudSyncBadge` in admin header when Firebase configured
- MenuContext seeds Firestore on first load if tenant empty
- MP webhook fetches payment by id → updates `paymentStatus`

## Gotchas

- localStorage orders not shared across devices
- Order ID is 4-char alphanumeric from checkout

See also: [modules/services.md](../modules/services.md), [components/admin-panel.md](../components/admin-panel.md)
