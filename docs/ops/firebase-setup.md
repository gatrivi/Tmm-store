# Firebase setup (production pilot)

Purpose: one Firebase project, one tenant per shop, menu + orders synced across devices.

## 1. Create project

1. [Firebase Console](https://console.firebase.google.com/) → Add project.
2. Enable **Firestore** (production mode).
3. Deploy rules from repo root (requires interactive login on a machine with browser):

```bash
npx firebase-tools@latest login
npm run deploy:rules
```

**Note:** `npx firebase login` fails — use `firebase-tools@latest`. See [monday-deploy-checklist.md](./monday-deploy-checklist.md).

Rules file: [`firestore.rules`](../../firestore.rules) — open read/write for MVP pilots. Tighten before scale (admin auth).

## 2. Web app config

Project settings → Your apps → Web → copy config into Vercel / `.env`:

| Variable | Notes |
|----------|-------|
| VITE_FIREBASE_API_KEY | |
| VITE_FIREBASE_AUTH_DOMAIN | |
| VITE_FIREBASE_PROJECT_ID | |
| VITE_FIREBASE_STORAGE_BUCKET | |
| VITE_FIREBASE_MESSAGING_SENDER_ID | |
| VITE_FIREBASE_APP_ID | |

Also set `VITE_TENANT_ID` to shop slug (e.g. `chori-palermo`).

## 3. Data model

```
tenants/{tenantId}
  settings, menuItems, extras, promotions, plan
  orders/{orderId}
```

First admin load **seeds** local menu into Firestore if tenant doc is empty.

## 4. Admin sync badge

Panel shows **Nube** (synced), **Local** (no Firebase), **Sync error**. Orders inbox uses Firestore `onSnapshot` when configured.

## 5. MercadoPago webhook

Set notification URL to `https://<your-domain>/api/mp-webhook`.

Server env (Vercel):

| Variable | Notes |
|----------|-------|
| MP_ACCESS_TOKEN | Fetches payment by id when MP sends notification |
| FIREBASE_PROJECT_ID | Same as client |
| FIREBASE_API_KEY | Same as client |
| TENANT_ID | Default tenant if single-shop deploy |

Webhook updates `paymentStatus` on `tenants/{tenantId}/orders/{orderId}` where `orderId` = MP `external_reference`.

## 6. Smoke test

1. `npm run check:env -- --strict`
2. Deploy rules: `npm run deploy:rules` (copy [`.firebaserc.example`](../../.firebaserc.example) → `.firebaserc` first)
3. Open admin on two browsers → edit price → confirm both see change
4. Configuración → **Probar escritura Firestore**
5. Full checklist: [smoke-test.md](./smoke-test.md)

See also: [env-vars.md](./env-vars.md), [features/firebase-tenants.md](../features/firebase-tenants.md)
