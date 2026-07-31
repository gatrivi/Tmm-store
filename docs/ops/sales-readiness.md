# Sales readiness — Gatrivi.com

Fecha: 2026-07-31  
Versión gate: `1.15.5`

## Veredicto

| Oferta | ¿Vendible hoy? | Gate |
|--------|----------------|------|
| Tienda online (catálogo + carrito + alias + comprobante WSP) | **Sí** | A — conversión comercial |
| Pilotos / demos en conversación | **Sí** | A |
| Pedidos reales multi-dispositivo (efectivo/transferencia) | **No** | B — auth + backend |
| Mercado Pago integrado por comercio | **No** | C — OAuth + webhook seguro |

**Conclusión:** podemos vender e implementar tiendas online. No prometer panel operativo con pedidos reales hasta Gate B.

---

## Gate A — checklist (conversión)

### Vercel Production (opcional si ya está en código)

- [x] WhatsApp comercial: `5491156199363` (default en `salesContact.ts`)
- [x] Email: `devtrivi@zengasoft.com`
- [ ] `VITE_DEMO_INTAKE_URL` (Tally) si querés formulario antes de WSP
- [ ] `VITE_DEMO_PRICE_LABEL=$65.000` coincide con link MP
- [ ] Redeploy Production tras merge
- [ ] CTA desde celular abre `wa.me/5491156199363`

### Firebase (proyecto `tmm-store`)

`.firebaserc` ya apunta a `tmm-store`. Pegar en Vercel las 6 `VITE_FIREBASE_*` desde [Firebase Console](https://console.firebase.google.com/) → Project settings → Web app.

```bash
npm run check:env   # avisa si faltan vars de venta
```

### Código (automático)

```bash
npm run lint
npm run build
npm run check:demo
npm run test:e2e:demo
```

### Demos live

- `/` — landing + reserva
- `/demos` — 11 rubros
- `/demo/pizzeria` + `/owner` — Fit A default
- `/demo/mamabel` — flagship marca
- `/demo/armar` — personalización Express

---

## Gate B — antes de pedidos reales

Ver [`roadmap/advertising-readiness.md`](../roadmap/advertising-readiness.md) Hito B y [`roadmap/order-processing-v2.md`](../roadmap/order-processing-v2.md) Hito 3.

- Firebase Auth owner (no hash client-side)
- Firestore rules cerradas
- `POST /api/orders` idempotente con recálculo servidor
- Sin fallback `localStorage` en Production
- Privacidad / retención definida

---

## Pitch 30s

Sin comisión. Catálogo web → carrito → total → alias → comprobante por WhatsApp. Implementación en 48–72 h. Desde $65.000 promo primeros 10 + plan mensual.

## Flujo de cierre

1. Demo del rubro (`/demos` o `/demo/armar`)
2. Reserva (`/#reserva`) o WhatsApp con origen
3. 50% implementación
4. Armado tenant real post-depósito → [`onboarding.md`](./onboarding.md)
5. Smoke → [`smoke-test.md`](./smoke-test.md) (solo tras Gate B para pedidos)

Ver también: [`revenue-ready-cursor-plan.md`](../roadmap/revenue-ready-cursor-plan.md), [`sales-playbook-zn.md`](./sales-playbook-zn.md)
