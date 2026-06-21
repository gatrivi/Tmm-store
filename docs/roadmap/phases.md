# Delivery phases

Purpose: ordered roadmap with dependencies.

## Phases

| Phase | Focus | Competes with PD | Status |
|-------|--------|------------------|--------|
| **P1** | WSP quick-reply templates; order deep links; print ticket v2; new-order sound | Yes | **Shipped** |
| **P2** | Firebase default for orders/menu; MP webhook production; mobile-friendly admin | Yes | **Shipped** (needs env deploy) |
| **P3** | WhatsApp Business API inbound/outbound; status auto-messages | Partial | Planned |
| **P4** | Gaucho mode UI; earnings tracker; donate + subscribe CTAs | Differentiator | Planned |
| **P5** | Premium CX desk: 10 windows, highlights, human takeover, knowledge store | Premium only | Planned |

## P1 acceptance

- [x] Admin sends WSP template from order row with one click
- [x] 58mm print template
- [x] Optional sound on new order

## P2 acceptance

- [x] Tenant sync via Firestore (seed + badge + verify panel)
- [x] MP webhook fetches payment by id
- [x] Admin usable on phone browser
- [ ] **Production env live** — operator task → [../ops/firebase-setup.md](../ops/firebase-setup.md)

## MVP gate (ops, not code)

- [ ] Smoke test → [../ops/smoke-test.md](../ops/smoke-test.md)
- [ ] Pilot A → [../ops/pilot-shop-a.md](../ops/pilot-shop-a.md)
- [ ] Pilot B → [../ops/pilot-shop-b.md](../ops/pilot-shop-b.md)
- [ ] Sell 5 → [../ops/sales-playbook-zn.md](../ops/sales-playbook-zn.md)

## P3–P5

- [whatsapp-cx.md](./whatsapp-cx.md)
- [gaucho-mode.md](./gaucho-mode.md)
- [premium-cx-desk.md](./premium-cx-desk.md)

## Explicit deferrals

- Delivery fleet / Rappi orchestration
- Native iOS/Android apps
- SaaS self-serve signup
- Image CDN migration — parallel, not blocking

## Rule

**P1–P2 code shipped.** Next: deploy Firebase, smoke, 2 pilots, sell 5. Gaucho/Premium desk after.

See also: [competitive-parity.md](./competitive-parity.md), [README.md](./README.md)
