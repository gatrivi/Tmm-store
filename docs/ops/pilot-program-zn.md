# Pilot program — Zona Norte (2 shops)

Purpose: onboard first two live shops before selling to five more in the same zona.

## Target profile

- Rotisería, food truck, empanadería, burger/chori de barrio.
- Owner is also cook; high WhatsApp volume; simple menu.
- Zona Norte or CABA with network you can visit (Palermo, Belgrano, Vicente López, San Isidro, etc.).

Avoid for pilots: full restaurant with mesas, dark kitchen with many integrations, shops happy on PedidoDirecto.

## Offer (piloto controlado)

| Item | Action |
|------|--------|
| Plan | Pedidos — piloto acotado o $15–18k/mes tras validación |
| Setup | Load menu, logo, WhatsApp, alias, QR en mostrador |
| Support | WhatsApp group with owner; visit once in week 1 |
| Success | >30 pedidos/semana for 2 weeks; owner opens admin daily |

## Recruitment (20 → 2)

1. List 20 targets from personal network + walk-ins.
2. Pitch: **0 comisión**, pedidos por WhatsApp + bandeja admin, efectivo/transferencia/MP.
3. Close 2 with signed verbal OK + fecha de go-live.
4. One referido in barrio beats landing page.

## Onboarding checklist (per shop)

- [ ] Firebase tenant slug + Vercel env (`VITE_TENANT_ID`, Firebase set)
- [ ] Menu loaded (precios ARS, fotos opcionales)
- [ ] `VITE_WHATSAPP_NUMBER` + alias transferencia en settings
- [ ] QR impreso → `/` or `/s/:slug`
- [ ] Admin password shared securely with dueño
- [ ] Test order end-to-end (cliente → WSP → admin → ticket 58mm)
- [ ] MP enabled only if shop uses tarjeta
- [ ] Sonido + auto-print toggles explained in Configuración

## Week 1 visit

- Peak hour observation (vie/sáb noche).
- Printer paper width (58mm).
- Fix menu confusion (opciones, delivery vs retiro).

## Exit criteria (pilot → paid)

- 2 weeks live with metrics sheet filled ([pilot-metrics.md](./pilot-metrics.md)).
- Per-shop trackers: [pilot-shop-a.md](./pilot-shop-a.md), [pilot-shop-b.md](./pilot-shop-b.md).
- Owner would recommend to neighbor.
- No blocker bugs open >48h.

## After 2 happy pilots

- Case study → [case-study-template.md](./case-study-template.md)
- Outbound playbook → [sales-playbook-zn.md](./sales-playbook-zn.md)
- Close 5 paid in same zona paid.

See also: [firebase-setup.md](./firebase-setup.md), [onboarding.md](./onboarding.md)
