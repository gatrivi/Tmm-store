# Demo script

Purpose: live presentation guide for sales and portfolio.

## Admin board

| What | Where |
|------|-------|
| URL | `/admin` |
| Dashboard | First tab (Pedidos+ only) |
| Demo data | Toggle **Demo ON** (top right) |

Demo ON: synthetic visits, charts, orders. Demo OFF: real localStorage metrics (and orders if Firebase/local orders exist).

### Admin access

1. `/admin` or `http://localhost:5173/admin`
2. Login via `VITE_ADMIN_*_HASH` in `.env`
3. Footer secret: 5 fast clicks → wait 5s → 6th click → login modal

## 10-minute script

1. Storefront `/` — categories, add to cart (sound)
2. Reload — cart persistence
3. Checkout — cash or transfer (copy alias). Skip live MP unless token tested on Vercel
4. WhatsApp — open pre-filled message (no need to send)
5. `/admin` — Demo ON, charts, top products
6. Branding — change color or logo
7. Close — mention tiers (Menu / Pedidos / Premium) and optional Firebase sync

## Show / avoid

| Show | Avoid live |
|------|------------|
| Multi-language | MP without token |
| Open/closed hours | Claiming multi-device sync without Firebase |
| Menu editor + images | Admin login without credentials |
| QR / share | |

## Pre-demo checklist

- [ ] `npm run build` OK
- [ ] Admin credentials ready
- [ ] WhatsApp + bank alias configured
- [ ] Dashboard Demo ON (Pedidos+)
- [ ] Screenshots optional — see [human/portfolio.md](../human/portfolio.md)

## Deploy

Push to Vercel with vars from [env-vars.md](./env-vars.md). Serverless functions run on Vercel preview/production only.
