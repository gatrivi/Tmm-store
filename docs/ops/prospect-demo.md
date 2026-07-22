# Prospect demo — 3 minutes

Purpose: show the outcome, not a feature inventory.

## Links

- Sales page: `/`
- **Demo Express builder (internal sales tool): `/demo/armar`**
- Customer view (gastronomía): `/demo`
- Owner view: `/demo/owner`
- **Vertical carnicería:** `/demo/carniceria` · `/demo/carniceria/owner` · seguimiento `/demo/carniceria/order/:id`

Live: https://tmm.gatrivi.com/demo/carniceria

Demo tenants are isolated from Firebase and browser tenant data. Checkout never sends a real WhatsApp message.

### Vertical carnicería (Gabriel)

Separate tenant `demo-carniceria` (sessionStorage `trufi_demo_orders_v2:carniceria`). Totals labeled **estimado**. Brief: [demo-carniceria-gabriel.md](../roadmap/demo-carniceria-gabriel.md).

60s pitch: open `/demo/carniceria` → add corte by weight + pack → Coordinar pedido → panel `/demo/carniceria/owner`.

## Script

1. **Problem (20s)** — “Hoy el cliente pregunta precio, manda un audio, pasa una dirección incompleta y el pedido se reconstruye a mano.”
2. **Customer (60s)** — open `/demo`, add two products, open cart and complete the checkout.
3. **Handoff (20s)** — point out the safe demo confirmation: in production the structured message opens in the shop WhatsApp.
4. **Owner (60s)** — open `/demo/owner`, filter active orders and move one from **Nuevo** to **Preparando** and **Listo**.
5. **Close (20s)** — “I load your current menu and branding. You receive link, QR and panel ready in 48–72 hours. No commission per sale.”

## Prospect-specific demo — before qualification

Use `/demo/armar` to generate a URL-personalized sample in under a minute. It applies the public business name, category, area, monogram, and color without creating a tenant or writing to Firebase.

Send the generated customer link with the included disclosure that products are examples. The same query parameters persist when switching to the owner view.

Do not put phone numbers, personal data, or secrets in the URL.

## Prospect-specific demo — after deposit

Do not clone the full app per lead. Once the lead has paid the deposit, use the existing tenant flow:

1. Create a tenant slug.
2. Load only 6–10 representative products.
3. Apply the prospect's colors/logo.
4. Send `/s/<slug>` with one sentence: “I adapted this version using the material you shared.”
5. Delete or archive unqualified prospect tenants after the sales window.

## Contact config

Set these in Vercel Production:

```bash
VITE_SALES_WHATSAPP_NUMBER=54911...
VITE_SALES_EMAIL=devtrivi@zengasoft.com
```

Without the WhatsApp variable, CTAs fall back to email.

## Guardrails

- Never use a real shop phone in `/demo`.
- Never claim Mercado Pago is production-tested until the live smoke test passes.
- Before the first paying tenant, replace open Firestore writes with authenticated owner access.
