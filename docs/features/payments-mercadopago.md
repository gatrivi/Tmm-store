# MercadoPago payments

Purpose: Checkout Pro preference + webhook reconciliation.

Paths: `api/create-preference.ts`, `api/mp-webhook.ts`, `src/components/CheckoutModal.tsx`

Deps: `MP_ACCESS_TOKEN` (server), `features.canUseMercadoPago`

## Flow

1. Checkout POSTs cart to `/api/create-preference`
2. Redirect to `init_point`
3. Return URL: `/?mp_status=approved&mp_ref={orderId}`
4. Webhook updates `paymentStatus` on order doc

## Gotchas

- Token never exposed to frontend
- Webhook needs Firebase env on server for order update
- Test with Vercel preview, not `npm run dev` alone

See also: [api/vercel-functions.md](../api/vercel-functions.md), [features/ordering-checkout.md](./ordering-checkout.md)
