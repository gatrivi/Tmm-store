# Production smoke test

Purpose: verify Pedidos MVP before pilots. Run after Firebase + Vercel deploy.

Prereq: [`firebase-setup.md`](./firebase-setup.md) complete. Use preview/prod URL (not plain `vite` alone for MP).

## 0. Env

```bash
npm run check:env -- --strict
```

## 1. Multi-device sync

| Step | Pass |
|------|------|
| Admin on phone → badge **Nube** | |
| Admin on PC → badge **Nube** | |
| Edit price on phone → PC updates ≤10s | |
| Configuración → **Probar escritura Firestore** → green | |

## 2. Order flow

| Step | Pass |
|------|------|
| Customer places order (cash or transfer) | |
| Order `#XXXX` in admin inbox both devices | |
| New-order sound (if enabled) | |
| WSP template **Recibido** opens with customer number + link | |
| Ticket **58mm** prints (allow popups) | |
| `/order/:id` shows status | |

## 3. MercadoPago (if shop uses MP)

| Step | Pass |
|------|------|
| `MP_ACCESS_TOKEN` set on Vercel | |
| MP notification URL → `https://<domain>/api/mp-webhook` | |
| Sandbox payment → order `paymentStatus` = approved | |
| Webhook log returns `{ ok: true, orderId, paymentStatus }` | |

## 4. Peak burst

Place **5 test orders in 10 minutes** (or simulate):

| Check | Pass |
|-------|------|
| All appear in inbox | |
| No duplicate sound spam | |
| Print queue acceptable (or auto-print off) | |
| Admin still responsive on phone | |

## 5. Sign-off

- [ ] All critical rows pass
- [ ] Known issues logged in [`pilot-metrics.md`](./pilot-metrics.md) incident table
- [ ] Ready for pilot shop A → [`pilot-shop-a.md`](./pilot-shop-a.md)

See also: [`pilot-program-zn.md`](./pilot-program-zn.md)
