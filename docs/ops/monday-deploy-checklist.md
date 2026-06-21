# Monday deploy checklist (Saturday — home PC)

Purpose: production URL + cloud sync before smoke test Sunday.

## 1. Firebase CLI

Use **`firebase-tools`**, not `firebase`:

```bash
npx firebase-tools@latest login
npm run deploy:rules
```

Project: `tmm-store` ([`.firebaserc`](../../.firebaserc)).

Verify in [Firebase Console](https://console.firebase.google.com/) → Firestore → Rules updated.

## 2. Admin password

```bash
npm run hash:admin
# Enter new username/password — copy hashes to Vercel, NOT .env in git
```

Never ship default `admin` / `admin123` to a pilot.

## 3. Vercel environment

Deploy from GitHub or `vercel --prod`. Set **Production** env:

| Variable | Example / notes |
|----------|-----------------|
| `VITE_PLAN` | `pedidos` |
| `VITE_TENANT_ID` | pilot slug, e.g. `chori-palermo` |
| `VITE_WHATSAPP_NUMBER` | shop owner WSP, no + |
| `VITE_ADMIN_USER_HASH` | from hash:admin |
| `VITE_ADMIN_PASS_HASH` | from hash:admin |
| `VITE_FIREBASE_*` | all 6 from Firebase web config |
| `FIREBASE_API_KEY` | same as client |
| `FIREBASE_PROJECT_ID` | `tmm-store` |
| `TENANT_ID` | same as `VITE_TENANT_ID` |
| `MP_ACCESS_TOKEN` | optional week 1 |
| `OPENAI_API_KEY` | optional |

Local check before push:

```bash
npm run check:env -- --strict
npm run build
```

## 4. Post-deploy verify (5 min)

1. Open `https://<your-domain>/admin`
2. Badge **Nube** (not Local)
3. Configuración → **Probar escritura Firestore** → green
4. Edit a price on phone → confirm on PC ≤10s

## 5. Next

→ [monday-smoke-runbook.md](./monday-smoke-runbook.md)

See also: [firebase-setup.md](./firebase-setup.md), [tablet-armado.md](./tablet-armado.md)
