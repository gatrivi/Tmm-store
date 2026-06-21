# Monday smoke runbook (Sunday)

Purpose: sign off prod URL before pilot go-live Monday.

Prereq: [monday-deploy-checklist.md](./monday-deploy-checklist.md) complete.

Use **production URL** (not `vite` alone). MP section optional week 1.

## Section 1 — Multi-device sync

| Step | Pass |
|------|------|
| Admin on phone → badge **Nube** | ☐ |
| Admin on PC → badge **Nube** | ☐ |
| Edit price on phone → PC updates ≤10s | ☐ |
| Configuración → **Probar escritura Firestore** → green | ☐ |

## Section 2 — Order flow

| Step | Pass |
|------|------|
| Customer places order (cash or transfer) | ☐ |
| Order `#XXXX` in admin inbox (both devices if synced) | ☐ |
| New-order sound (if enabled) | ☐ |
| WSP template **Recibido** opens with customer number + link | ☐ |
| Ticket **58mm** prints (allow popups) | ☐ |
| `/order/:id` shows status | ☐ |

## Section 3 — Armado + QR (pilot prep)

| Step | Pass |
|------|------|
| `/admin?setup=1` → Armado completes | ☐ |
| Step 5 shows QR + copy link | ☐ |
| Storefront shows categories + products | ☐ |
| Reload → data persists | ☐ |

## Blockers log

| Symptom | Fix |
|---------|-----|
| Badge Local | Firebase env or rules → [firebase-setup.md](./firebase-setup.md) |
| Firestore write fails | `npm run deploy:rules` |
| Orders not in inbox | Check tenant slug matches `VITE_TENANT_ID` |
| WSP empty | Set WhatsApp in Armado or Configuración |

## Sign-off

- [ ] Sections 1–2 pass (3 recommended)
- [ ] Ready → [pilot-shop-a.md](./pilot-shop-a.md) go-live Monday

Full checklist: [smoke-test.md](./smoke-test.md)
