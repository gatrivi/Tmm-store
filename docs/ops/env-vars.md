# Environment variables

Purpose: reference for local `.env` and Vercel project settings.

Copy from `.env.example` at repo root.

## Client (VITE_*)

| Variable | Required | Notes |
|----------|----------|-------|
| VITE_PLAN | no | `menu` \| `pedidos` \| `premium` (default pedidos) |
| VITE_TENANT_ID | no | Firestore tenant; default from `/s/:slug` or `default` |
| VITE_ADMIN_USER_HASH | admin | SHA-256 of username |
| VITE_ADMIN_PASS_HASH | admin | SHA-256 of password |
| VITE_WHATSAPP_NUMBER | yes | No `+` prefix |
| VITE_BANK_ALIAS | transfer | Default transfer alias |
| VITE_SUPER_ADMIN_KEY | super-admin | Protects `/super-admin` |
| VITE_FIREBASE_API_KEY | sync | With full Firebase set |
| VITE_FIREBASE_AUTH_DOMAIN | sync | |
| VITE_FIREBASE_PROJECT_ID | sync | |
| VITE_FIREBASE_STORAGE_BUCKET | sync | |
| VITE_FIREBASE_MESSAGING_SENDER_ID | sync | |
| VITE_FIREBASE_APP_ID | sync | |

## Server (never expose to browser)

| Variable | Used by |
|----------|---------|
| MP_ACCESS_TOKEN | create-preference |
| OPENAI_API_KEY | ai-chat |
| FIREBASE_API_KEY | mp-webhook |
| FIREBASE_AUTH_DOMAIN | mp-webhook |
| FIREBASE_PROJECT_ID | mp-webhook |
| TENANT_ID | mp-webhook default tenant |

MP webhook: set notification URL to `/api/mp-webhook`. With `MP_ACCESS_TOKEN`, server fetches payment by id when MP sends `{ type: payment, data: { id } }`.

See [ops/firebase-setup.md](./ops/firebase-setup.md).

See also: [features/firebase-tenants.md](../features/firebase-tenants.md)
