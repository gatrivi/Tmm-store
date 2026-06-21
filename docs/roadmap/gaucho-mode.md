# Gaucho mode

Purpose: default **free** app with transparent value tracking and voluntary monetization.

Paths (today): none — monetization via `VITE_PLAN` deploy tiers only

Deps (future): order aggregation, MP payment totals, donate/subscribe checkout

## Concept

**Gaucho mode** = shop runs Trufi at **$0/month** with full or Pedidos-level features (TBD policy).

Shop sees a prominent **earnings tracker**:

- Total $ processed through app (MercadoPago approved + recorded cash/transfer orders)
- Order count (today / month / all time)
- Optional estimate: "saved vs marketplace commission" (editable % assumption)

**CTAs:**

- **Donate** — one-time tip to Trufi (MP or similar)
- **Subscribe** — upgrade to Menu / Pedidos / Premium paid plans

No hard paywall initially. Optional **nudge** after threshold (e.g. $500k ARS processed or 100 orders): friendly prompt to donate or subscribe.

## Relation to plan tiers

| Concept | Role |
|---------|------|
| `menu` / `pedidos` / `premium` | Feature gates (what the shop can do) |
| Gaucho mode | **Monetization mode** (how Trufi gets paid) |

A shop can be Gaucho + Pedidos features, or paid subscriber + same features. Doc combination rules when implementing — avoid double gating confusion.

## UI sketch

- Admin dashboard widget: earnings tracker (always visible in Gaucho)
- Settings: "Support Trufi" section with donate + plan cards
- Storefront: no customer-facing Gaucho branding unless shop opts in

## Not in scope (doc only)

- Billing provider choice (MP subscriptions vs Stripe)
- Legal/tax copy for Argentina
- Enforcing payment after threshold (ethical nudge only)

See also: [../features/plans-tiers.md](../features/plans-tiers.md), [phases.md](./phases.md)
