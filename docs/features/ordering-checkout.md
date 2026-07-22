# Ordering and checkout

Purpose: cart → checkout → WhatsApp and/or MercadoPago.

Paths: `Storefront`, `CheckoutModal`, `whatsappMessage`, `orderBuilder`, `demoOrderRepository`

Deps: `MenuContext`, `PlanContext`, `LanguageContext`

## Flow

1. Add items to cart (validated against menu availability)
2. Cart persisted in `elpuestito_cart` when plan allows ordering
3. CheckoutModal: form → confirm → WhatsApp or MP
4. Order persisted via `createOrder()` before handoff
5. Tenant `demo`: `createDemoOrder()` → sessionStorage → success with links to owner + `/order/:id`
6. Promo code optional (Pedidos+)

## Gotchas

- Business hours block checkout when closed
- Popup blocker: message copied to clipboard as fallback
- MP pending state in `sessionStorage` (`elpuestito_mp_pending`)
- Demo does not open WhatsApp

See also: [payments-mercadopago.md](./payments-mercadopago.md), [orders-admin.md](./orders-admin.md)
