# WhatsApp CX

Purpose: easier customer messaging beyond one-shot order links.

Paths (today): `src/utils/whatsappMessage.ts`, `src/pages/Storefront.tsx`, `src/components/CheckoutModal.tsx`

Deps (future): Firestore orders, tenant WSP config, serverless webhooks

## Today

- Checkout builds formatted order text; opens `wa.me/{number}?text=...`
- Menu tier: contact WhatsApp CTA (no structured order)
- No inbound messages, no shop inbox, no status push

## Future

### Phase A — Templates (P1)

- Admin-configured quick replies: order received, preparing, on the way, closed
- One-click send from AdminOrders (opens WSP with pre-filled text + order ID)
- Deep link: `/order/:orderId` in customer messages

### Phase B — Business API (P3)

- WhatsApp Business Cloud API or provider (Twilio, etc.)
- Inbound webhook: match `phone` to customer / open order
- Outbound: status updates from AdminOrders actions
- Tenant stores `phone_number_id`, tokens server-side only

### Phase C — Thread context (P3+)

- Shop sees recent WSP thread per customer in admin (not full CRM)
- Link thread to `orderId` when order placed

## Flow (target)

1. Customer completes checkout → order saved → WSP message (existing)
2. Shop updates status in admin → optional auto WSP (Phase B/C)
3. Customer replies → shop sees in admin or WSP app; AI/human on Premium

## Gotchas

- Keep `wa.me` fallback for tenants without API credentials
- AR shops often use personal WhatsApp — API onboarding is friction
- Meta template approval for proactive outbound messages

See also: [print-tickets.md](./print-tickets.md), [premium-cx-desk.md](./premium-cx-desk.md), [../features/ordering-checkout.md](../features/ordering-checkout.md)
