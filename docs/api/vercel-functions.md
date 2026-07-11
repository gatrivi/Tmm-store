# Vercel functions

Purpose: server-side MP, AI, webhooks.

Paths: `api/`

| File | Method | Role |
|------|--------|------|
| create-preference.ts | POST | MercadoPago Checkout Pro preference |
| mp-webhook.ts | POST | Update order paymentStatus from MP |
| ai-chat.ts | POST | OpenAI or fallback chat for Premium |
| test-mp.ts | GET | Debug MP token presence |

Patterns:

- CORS via `setCors()` helper
- Secrets from `process.env` only
- Firebase admin in webhook uses `FIREBASE_*` / `TENANT_ID`

Gotcha: deploy to Vercel for runtime; not available in Vite dev server.

See also: [features/payments-mercadopago.md](../features/payments-mercadopago.md), [ops/env-vars.md](../ops/env-vars.md)
