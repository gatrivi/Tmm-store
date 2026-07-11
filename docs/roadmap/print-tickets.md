# Print tickets

Purpose: kitchen/counter ticket on new order — PedidoDirecto parity.

Paths (today): `src/components/admin/AdminOrders.tsx` (`printOrder()`)

Deps (future): AdminOrders listener, optional PWA permissions, `src/utils/sounds.ts`

## Today

- Manual "Imprimir" button on selected order
- Opens new window with HTML ticket; `window.print()`
- No auto-print, no thermal-optimized layout

## Future

### P1 — Ticket v2

- **58mm thermal** CSS (`@media print`, monospace, narrow width)
- **A4** full ticket option (delivery address prominent)
- Reprint from order detail; duplicate ticket label

### P1 — Triggers

- Optional **auto-print** when order status = `new` (admin setting)
- Optional **sound alert** on new order (extend Web Audio pattern from cart sound)
- Batch select + print for rush hour

### Later

- ESC/POS via browser extension or local bridge (out of scope v1 — document only)
- KDS screen mode (tablet in kitchen, no paper)

## Ticket fields (minimum)

- Order ID, timestamp
- Customer name, phone
- Delivery type + address
- Line items, qty, options
- Payment method, total, promo discount
- Notes

## Gotchas

- Browsers block silent print without user gesture — auto-print needs PWA or desktop app helper
- Thermal printers vary; test 58mm template on common hardware

See also: [../features/orders-admin.md](../features/orders-admin.md), [whatsapp-cx.md](./whatsapp-cx.md)
