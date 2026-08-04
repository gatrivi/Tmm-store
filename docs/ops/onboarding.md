# Client onboarding

Purpose: internal playbook to provision Menu, Pedidos, Premium tiers.

## Implementación pagada (post-depósito)

**Primary (tablet):** leave device with client → [tablet-armado.md](./tablet-armado.md) — Admin → **Armado** wizard.

1. Client sends menu (PDF/photos), logo, WhatsApp, bank alias — or loads on tablet via Armado
2. Create tenant at `/super-admin` (needs `VITE_SUPER_ADMIN_KEY` + Firebase)
3. **Armado** in admin (manual) or **Importar menú** (AI photo) → [`features/menu-onboarding.md`](../features/menu-onboarding.md)
4. Set deploy vars: `VITE_PLAN`, `VITE_TENANT_ID={slug}`
5. Deliver store link, QR, admin credentials

## Env by tier

| Variable | Menu | Pedidos | Premium |
|----------|------|---------|---------|
| VITE_PLAN | menu | pedidos | premium |
| VITE_TENANT_ID | slug | slug | slug |
| VITE_WHATSAPP_NUMBER | yes | yes | yes |
| MP_ACCESS_TOKEN | no | optional | optional |
| OPENAI_API_KEY | no | no | recommended |
| VITE_FIREBASE_* | optional | recommended | recommended |

Full list: [env-vars.md](./env-vars.md)

## Delivery checklist

- [ ] Menu reviewed on mobile
- [ ] Branding, hours, WhatsApp
- [ ] Orders + MP (Pedidos+)
- [ ] Order inbox (Pedidos+)
- [ ] AI assistant (Premium)
- [ ] QR shared

## Upsell

- Menu → Pedidos: enable cart, orders, MP
- Pedidos → Premium: `VITE_PLAN=premium` + `OPENAI_API_KEY`

## Post-launch

- Price changes: admin or bulk edit (Pedidos+)
- Promos: admin → Promotions
- Reports: dashboard with real orders (Firebase recommended)
