# Trufi

Done-for-you, white-label ordering suite for local businesses: sales landing, digital menu, cart, checkout, WhatsApp, MercadoPago, owner panel, and three product tiers (Menu / Pedidos / Premium).

## Quick start

```bash
git clone https://github.com/gatrivi/Tmm-store.git
cd Tmm-store
npm install
cp .env.example .env
npm run dev
```

- Sales landing: http://localhost:5173/
- Customer demo (gastronomía): http://localhost:5173/demo
- Owner demo: http://localhost:5173/demo/owner
- **Carnicería vertical:** http://localhost:5173/demo/carniceria · owner `/demo/carniceria/owner`
- Tenant store: http://localhost:5173/s/demo-shop
- Admin: http://localhost:5173/admin

Live: [tmm.gatrivi.com/demo/carniceria](https://tmm.gatrivi.com/demo/carniceria)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run check:demo` | Registry self-check (carnicería routes/tenant) |

## Environment

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|----------|---------|
| `VITE_PLAN` | Product tier: `menu`, `pedidos`, `premium` |
| `VITE_ADMIN_*_HASH` | Admin login (SHA-256) |
| `VITE_WHATSAPP_NUMBER` | Order WhatsApp number |
| `VITE_SALES_WHATSAPP_NUMBER` | Sales CTA WhatsApp number |
| `VITE_SALES_EMAIL` | Sales fallback email |
| `MP_ACCESS_TOKEN` | MercadoPago (Vercel serverless only) |

Full reference: [docs/ops/env-vars.md](docs/ops/env-vars.md)

## Documentation

All project docs live under [`docs/`](docs/README.md):

- [Architecture](docs/architecture.md)
- [Prospect demo (3 min)](docs/ops/prospect-demo.md)
- [Demo carnicería Gabriel](docs/roadmap/demo-carniceria-gabriel.md)
- [Demo script](docs/ops/demo.md)
- [Client onboarding](docs/ops/onboarding.md)
- [Portfolio (human)](docs/human/portfolio.md)

## Deploy

Push to Vercel. Set env vars in the project dashboard. Serverless functions in `api/` require a Vercel deployment.

---

Developed by **DevSalz**
