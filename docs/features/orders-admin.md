# Orders admin

Purpose: real-time order inbox and customer status page.

Paths: `AdminOrders`, `OrderStatusPage`, `orderService`, `demoOrderRepository`, `orderStateMachine`, `components/orders/*`

Deps: Firestore optional; localStorage fallback keyed by tenant; demo → `sessionStorage`

## Status flow (v2)

`new` → `preparing` → `ready` → (`out_for_delivery`) → `completed`

- Legacy read: `accepted`→`preparing`, `delivered`→`completed`
- Primary CTA from `orderStateMachine` (no “Avanzar estado”)
- Mobile: bottom sheet (`OrderDrawer`); desktop: side panel

## Flow

1. Checkout → `createOrder` / demo → `createDemoOrder`
2. AdminOrders / DemoOwnerPage subscribe
3. One primary action; WSP / ticket / reject secondary
4. Customer polls `/order/:orderId` (10s; stops on terminal)

## Demo

- `/demo` → `trufi_demo_orders_v2`
- `/demo/carniceria` → `trufi_demo_orders_v2:carniceria` (totales **estimado**)
- Matching owner routes show same ID / items / total; prospect order highlighted
- Writes notify same-tab subscribers immediately (`trufi:demo-orders`); panel/detail/metrics/filters/seguimiento read that store
- Check: `npm run check:demo` (registry + full order flow)

See: [demo-carniceria-gabriel.md](../roadmap/demo-carniceria-gabriel.md)

## Gotchas

- localStorage orders not shared across devices
- Hito 1: no Firestore/MP changes yet

See also: [ordering-checkout.md](./ordering-checkout.md), [modules/services.md](../modules/services.md)
