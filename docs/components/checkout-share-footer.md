# Checkout, share, footer

Purpose: checkout modal, QR share, site footer with secret admin access.

Paths: `src/components/CheckoutModal.tsx`, `src/components/ShareModal.tsx`, `src/components/GlobalFooter.tsx`

Deps: `whatsappMessage.ts`, `orderService`, `clipboard.ts`

## CheckoutModal

- Steps: form → confirm
- Persists order before WhatsApp/MP
- Promo input when Pedidos+

## ShareModal

- QR + native share API for store URL

## GlobalFooter

- Brand links (IG, Maps)
- Secret click pattern triggers admin login modal

See also: [features/ordering-checkout.md](../features/ordering-checkout.md)
