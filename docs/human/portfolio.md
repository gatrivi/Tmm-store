# Portfolio (human-readable)

Longer product narrative for humans. For agents, use [architecture.md](../architecture.md) and [features/](../features/).

**Trufi** — white-label online ordering for food businesses (PedidoDirecto-style). Three tiers: Menu (digital menu), Pedidos (full ordering), Premium (AI assistant).

**Stack:** React 19, Vite 6, Tailwind v4, TypeScript, Vercel, optional Firebase.

## Customer experience

- Digital menu: categories, images, variants, badges, availability
- Cart with localStorage persistence and menu validation
- Multi-step checkout: cash, transfer, MercadoPago
- WhatsApp order message with order ID
- 5 languages; business hours open/closed badge
- Share/QR modal

## Admin

- SHA-256 login + footer secret pattern
- Menu CRUD, multi-language, image editor, file manager
- Dashboard with visit analytics; demo mode for presentations
- Branding: logo, colors, contact links
- Orders inbox, promotions, bulk pricing (Pedidos+)

## Production flow

1. Owner configures menu/branding in `/admin`
2. Shares store link / QR
3. Customer orders; payment via cash, transfer, or MP
4. Owner receives WhatsApp detail; orders also in admin inbox when enabled

## Screenshots (optional)

Save under `docs/screenshots/`:

| # | View | File |
|---|------|------|
| 1 | Storefront | 01-storefront.png |
| 2 | Cart | 02-cart.png |
| 3 | Checkout | 03-checkout.png |
| 4 | Admin menu | 04-admin-menu.png |
| 5 | Dashboard demo | 05-admin-dashboard.png |
| 6 | Branding | 06-admin-branding.png |

Live demo: [ops/demo.md](../ops/demo.md)

## Future (not shipped)

- WhatsApp CX depth, print tickets v2 — [roadmap/whatsapp-cx.md](../roadmap/whatsapp-cx.md), [roadmap/print-tickets.md](../roadmap/print-tickets.md)
- Gaucho free mode + earnings tracker — [roadmap/gaucho-mode.md](../roadmap/gaucho-mode.md)
- Premium supervised AI desk — [roadmap/premium-cx-desk.md](../roadmap/premium-cx-desk.md)

Full sequence: [roadmap/phases.md](../roadmap/phases.md)

Developed by DevSalz.
