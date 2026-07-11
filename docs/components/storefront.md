# Storefront

Purpose: primary customer UI — menu grid, cart, plan-gated ordering.

Paths: `src/pages/Storefront.tsx`

Deps: `useMenu()`, `usePlan()`, `useLanguage()`, `CheckoutModal`, `ShareModal`, `AIAssistant`, `GlobalFooter`

## Flow

- Load menu from MenuContext; filter unavailable items/options
- `siteSettings.menuLayout`: grid | list | magazine | compact (set in admin Apariencia)
- Menu plan: WhatsApp CTA, no cart buttons
- Pedidos+: cart drawer, checkout, promos
- Premium+: AI assistant hook

## Gotchas

- Cart re-validated when menu changes
- MP success banner from query params `mp_status=approved`

See also: [features/ordering-checkout.md](../features/ordering-checkout.md), [components/checkout-share-footer.md](./checkout-share-footer.md)
