# Competitive parity

Purpose: living matrix — PedidoDirecto vs Trufi.

Reference: [pedidodirecto.com.ar](https://pedidodirecto.com.ar/) (~$20k ARS/mes fixed).

## Matrix

| Capability | PedidoDirecto | Trufi now | Next |
|------------|---------------|-----------|------|
| Digital menu + QR | Yes | Yes | — |
| WhatsApp orders | Automated | `wa.me` + `#pedido` + templates | P3 API |
| Admin menu/prices | Yes | Yes + Firestore sync | Deploy env |
| Order register | Yes | AdminOrders realtime | — |
| Print orders | Yes | 58mm + auto-print toggle | — |
| WSP quick replies | Yes | Recibido / Preparando / Listo | — |
| New order alert | Yes | Sound toggle | — |
| Cash / reports | Yes | Dashboard (Pedidos+) | Export polish |
| Bulk pricing | Yes | Yes | — |
| Promotions | Yes | Yes | — |
| MercadoPago | Yes | Checkout Pro + webhook fetch | Prod smoke |
| Multi-device sync | Yes | Firestore (when configured) | **Nube badge** |
| Setup sin cargo | Yes | Manual → [onboarding.md](../ops/onboarding.md) | — |
| AI assistant | No | Premium basic | P5 desk |
| Free + donate tier | No | Planned Gaucho | P4 |

## MVP ops remaining (not feature gaps)

1. Firebase on Vercel → [firebase-setup.md](../ops/firebase-setup.md)
2. Smoke → [smoke-test.md](../ops/smoke-test.md)
3. 2 pilots → [pilot-program-zn.md](../ops/pilot-program-zn.md)
4. Sell 5 → [sales-playbook-zn.md](../ops/sales-playbook-zn.md)

## Differentiators (after parity)

- Gaucho mode
- Premium CX desk
- 5-language storefront

See also: [phases.md](./phases.md)
