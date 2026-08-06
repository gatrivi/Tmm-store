# Prospect demo — 3 minutes

Purpose: show the outcome, not a feature inventory.

## Links

- Sales page: `/`
- **Galería (solo pulidas):** `/demos`
- **Demo Express:** **OFF público** (`DEMO_EXPRESS_PUBLIC=false`) — `/demo/armar` y `/demo?rubro=` redirigen a `/demos`
- **Flagship Mamá Mabel:** `/demo/mamabel` · `/demo/mamabel/owner` · `/demo/mamabel/order/:id`
- **Primary Fit A (pizzería/empanadas):** `/demo/pizzeria` · `/demo/pizzeria/owner` · `/demo/pizzeria/order/:id`
- **Panadería La Magdalena:** `/demo/panaderia` · `/demo/panaderia/owner` · `/demo/panaderia/order/:id`
- **Aguacats (ex Refcurcum):** `/demo/aguacats` · `/demo/aguacats/owner` · `/demo/aguacats/order/:id`
- **Canavesi Carnes (Olivos):** `/demo/canavesi` · `/demo/canavesi/owner` · `/demo/canavesi/order/:id`
- **Vertical carnicería:** `/demo/carniceria` · `/demo/carniceria/owner` · `/demo/carniceria/order/:id`
- **Verdulería La Inmaculada:** `/demo/verduleria` · `/demo/verduleria/owner` · `/demo/verduleria/order/:id`

Live: https://tmm.gatrivi.com/demo/mamabel

Demo tenants are isolated from Firebase and browser tenant data. Checkout never sends a real WhatsApp message.

### Flagship — Las Tortas de Mamá Mabel

Tenant `demo-mamabel` · plan **premium** · logo FB · WSP `5491156196941`. Brief: [demo-mamabel.md](../roadmap/demo-mamabel.md).

60s: `/demo/mamabel` → selva negra 1kg + nota cumple → panel `/demo/mamabel/owner` · AI “quiero lemon pie”.

### Vertical panadería (La Magdalena)

Tenant `demo-panaderia` · WSP prospect `549116563860` · logo blueprint. Brief: [demo-panaderia.md](../roadmap/demo-panaderia.md).

60s: `/demo/panaderia` → medialunas docena + nota retiro 7:30 → `/demo/panaderia/owner`.

### Vertical Aguacats (ex Refcurcum)

Tenant `demo-aguacats` · WSP `541171395174` · IG `@aguacats21` · contact Fermín. Brief: [demo-aguacats.md](../roadmap/demo-aguacats.md) · gaps: [aguacats-content-gaps.md](../aguacats-content-gaps.md).

60s: `/demo/aguacats` → palta + combo frescura → `/demo/aguacats/owner`.

### Prospect Canavesi Carnes (Olivos)

Tenant `demo-canavesi` · IG `@canavesioficial` · Borges 2376. Brief: [demo-canavesi.md](../roadmap/demo-canavesi.md) · gaps: [canavesi-content-gaps.md](../canavesi-content-gaps.md).

60s: `/demo/canavesi` → vacío 1 kg + combo → `/demo/canavesi/owner`.

### Vertical pizzería (Fit A — default pitch)

Tenant `demo-pizzeria` · storage `trufi_demo_orders_v2:pizzeria`. Brief: [demo-pizzeria.md](../roadmap/demo-pizzeria.md).

60s: `/demo/pizzeria` → muzza grande + ½ docena → pedido de prueba → `/demo/pizzeria/owner`.

### Vertical carnicería (Gabriel)

Separate tenant `demo-carniceria` (sessionStorage `trufi_demo_orders_v2:carniceria`). Totals labeled **estimado**. Brief: [demo-carniceria-gabriel.md](../roadmap/demo-carniceria-gabriel.md).

60s pitch: open `/demo/carniceria` → add corte by weight + pack → Coordinar pedido → panel `/demo/carniceria/owner`.

## Script (pizzería — default)

1. **Problem (20s)** — “Hoy el cliente manda un audio: una muzza y media docena. Vos reconstruís el pedido a mano.”
2. **Customer (60s)** — open `/demo/pizzeria`, add pizza + empanadas, complete checkout.
3. **Handoff (20s)** — safe demo confirmation: in production the structured message opens in WhatsApp.
4. **Owner (60s)** — `/demo/pizzeria/owner`, Nuevo → Preparando → Listo.
5. **Close (20s)** — “Cargo tu carta y marca. Link + QR + panel en 48–72 hs. Cero comisión.”

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
