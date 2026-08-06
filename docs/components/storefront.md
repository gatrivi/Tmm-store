# Storefront

Purpose: primary customer UI — menu grid, cart, plan-gated ordering.

Paths: `src/pages/Storefront.tsx` · vertical carnicería `src/pages/CarniceriaDemoPage.tsx`

Deps: `useMenu()`, `usePlan()`, `useLanguage()`, `CheckoutModal`, `ShareModal`, `AIAssistant`, `GlobalFooter`

## Flow

- Load menu from MenuContext; filter unavailable items/options
- `siteSettings.menuLayout`: grid | list | magazine | compact (set in admin Apariencia)
- Menu plan: WhatsApp CTA, no cart buttons
- Pedidos+: cart drawer, checkout, promos
- Premium+: AI assistant hook

## Vertical demos

| Path | Page | Notes |
|------|------|-------|
| `/demo` | `Storefront` + `DemoRibbon` | Gastronomía showcase |
| `/demo/carniceria` | `WeightedCatalogDemoPage` | Hero, weight pills, estimado; registry config |
| `/demo/verduleria` | `WeightedCatalogDemoPage` | Mismo motor peso/unidad · La Inmaculada |

## Gotchas

- Cart re-validated when menu changes
- MP success banner from query params `mp_status=approved`
- Demo carts keyed `trufi_cart:{tenantId}`

See also: [features/ordering-checkout.md](../features/ordering-checkout.md), [components/checkout-share-footer.md](./checkout-share-footer.md), [roadmap/demo-carniceria-gabriel.md](../roadmap/demo-carniceria-gabriel.md)
